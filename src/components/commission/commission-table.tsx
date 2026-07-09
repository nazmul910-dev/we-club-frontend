"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/lib/redux/store/hook";
import {
  getAllCommissions,
  getMyCommissions,
} from "@/lib/features/commissionLedger/commissionLedgerApi";
import CommissionStatusBadge from "./commission-status-badge";
import CommissionActionMenu from "./commission-action-menu";
import { Commission } from "@/lib/features/commissionLedger/types";
import { buildCommissionsCacheKey, getCachedCommissions, setCachedCommissions } from "@/lib/features/commissionLedger/commissionCached";
import { PaginationControl } from "../ui/PaginationControll";


interface CommissionsMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Roles that can see every commission record, not just their own.
const PRIVILEGED_ROLES = [
  "admin",
  "associate",
  "ceo",
  "ceo_partner",
  "partner",
  "ambassador",
  "we_club_member",
];

const PAGE_SIZE = 10;

export default function CommissionTable() {
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [meta, setMeta] = useState<CommissionsMeta | null>(null);
  const [page, setPage] = useState(1);

  const tab = useAppSelector((state) => state.commission.tab);
  const user = useAppSelector((state) => state.authUser.user);

  const isAdminOrManager = Boolean(
    user?.role && PRIVILEGED_ROLES.includes(user.role)
  );

  // Reset back to page 1 whenever the tab changes — a saved page number
  // from a different status filter won't necessarily exist in the new one.
  useEffect(() => {
    setPage(1);
  }, [tab]);

  // Guards against a slow, stale response overwriting a newer tab/page's
  // data — e.g. user clicks "pending" then immediately "paid" before the
  // first request resolves; without this, whichever response arrives last
  // wins even if it's for the tab the user already navigated away from.
  const requestIdRef = useRef(0);

  const loadCommissions = useCallback(
    async (opts?: { force?: boolean }) => {
      const scope = isAdminOrManager ? "all" : "mine";
      const cacheKey = buildCommissionsCacheKey(scope, tab, page);

      if (!opts?.force) {
        const cached = getCachedCommissions<Commission>(cacheKey);
        if (cached) {
          setCommissions(cached.data);
          setMeta(cached.meta);
          setLoading(false);
          return;
        }
      }

      const requestId = ++requestIdRef.current;
      setLoading(true);

      try {
        // Filter server-side by status when a specific tab is selected,
        // rather than fetching one page and filtering it client-side — the
        // latter silently drops rows that belong on other pages and makes
        // pagination counts wrong for anything but the "all" tab.
        const params = {
          page,
          limit: PAGE_SIZE,
          ...(tab !== "all" ? { status: tab } : {}),
        };

        const thunkAction = isAdminOrManager
          ? getAllCommissions(params)
          : getMyCommissions(params);

        const result = await dispatch(thunkAction);

        // A newer request has since started (user switched tabs again) —
        // discard this response instead of letting it clobber fresher state.
        if (requestId !== requestIdRef.current) return;

        const isFulfilled =
          getAllCommissions.fulfilled.match(result) ||
          getMyCommissions.fulfilled.match(result);

        if (isFulfilled) {
          const payload = (result as any).payload;
          const data = payload.data.data ?? [];
          const responseMeta = payload.data.meta ?? null;

          setCommissions(data);
          setMeta(responseMeta);
          if (responseMeta) {
            setCachedCommissions(cacheKey, data, responseMeta);
          }
        }
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [dispatch, isAdminOrManager, tab, page]
  );

  useEffect(() => {
    loadCommissions();
  }, [loadCommissions]);

  return (
    <div className="flex flex-col gap-4">
      <div className=" rounded-xl overflow-x-auto border border-[#332b18] bg-[#111]">
        <table className="w-full text-left ">
          <thead>
            <tr className="border-b border-[#332b18] text-xs tracking-[3px] text-[#777] uppercase">
              <th className="p-5">Listing</th>
              <th className="p-5">Promoter</th>
              <th className="p-5">Status</th>
              <th className="p-5">Estimated Value</th>
              <th className="p-5">Date</th>
              <th className="p-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#888]">
                  Loading commissions...
                </td>
              </tr>
            )}

            {!loading && commissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#666]">
                  No commission records found.
                </td>
              </tr>
            )}

            {!loading &&
              commissions.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-[#332b18] transition hover:bg-[#161616]"
                >
                  <td className="p-5">
                    <p className="font-playfair text-white">
                      {item?.listing_id?.title ?? "Listing Removed"}
                    </p>
                    <p className="mt-1 text-xs text-[#777]">
                      #{item?.listing_id?.ref_code ?? "--"}
                    </p>
                  </td>
                  <td className="p-5">
                    <p className="text-white">{item.promoter_id?.fullName}</p>
                    <p className="mt-1 text-xs text-[#777]">
                      {item.promoter_id?.role}
                    </p>
                  </td>
                  <td className="p-5">
                    <CommissionStatusBadge status={item.status} />
                  </td>
                  <td className="p-5 text-white">
                    {item.currency}{" "}
                    {Number(item.estimated_commission_amount).toLocaleString()}
                  </td>
                  <td className="p-5 text-sm text-[#888]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-5 text-center">
                    <CommissionActionMenu commission={item} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && meta && meta.totalPage > 1 && (
        <PaginationControl
          currentPage={meta.page}
          totalPages={meta.totalPage}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}