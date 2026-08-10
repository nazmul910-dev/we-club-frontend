"use client";

import { useState } from "react";
import { Send, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { IDiscountCode } from "@/lib/features/discountFounder/discount.interface";
import SendDiscountEmailModal from "./SendDiscountEmailModal";
import DeleteDiscountModal from "./DeleteDiscountModal";

interface Props {
  discounts: IDiscountCode[];
  loading?: boolean;
}

export default function DiscountTable({ discounts, loading }: Props) {
  const [sendTarget, setSendTarget] = useState<IDiscountCode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IDiscountCode | null>(null);

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-yellow-500/20 bg-[#111]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-white/5 px-6 py-5"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border border-yellow-500/20 bg-[#111]">
        <table className="w-full">
          <thead className="border-b border-yellow-500/20 bg-[#151515]">
            <tr className="text-left text-xs uppercase tracking-wider text-white/40">
              <th className="px-6 py-5">Code</th>
              <th className="px-6 py-5">Discount</th>
              <th className="px-6 py-5">Roles</th>
              <th className="px-6 py-5">Access</th>
              <th className="px-6 py-5">Expires</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {discounts.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-white/40"
                >
                  No discount codes found. Create one to get started.
                </td>
              </tr>
            )}

            {discounts.map((discount) => {
              const maxRedemptions = discount.maxRedemptions ?? 20;
              const isUsed = (discount.usedCount ?? 0) >= maxRedemptions;
              const isExpired =
                discount.expiresAt && new Date(discount.expiresAt) < new Date();

              const status = isUsed
                ? "used"
                : isExpired
                  ? "expired"
                  : discount.isActive
                    ? "active"
                    : "inactive";

              return (
                <tr
                  key={discount._id}
                  className="border-b border-white/5 transition hover:bg-white/3"
                >
                  <td className="px-6 py-5">
                    <span className="font-mono text-sm font-semibold text-yellow-400">
                      {discount.code}
                    </span>
                    {discount.note && (
                      <p className="mt-1 text-xs text-white/30">
                        {discount.note}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5 text-sm text-white">
                    {discount.discountPercent}%
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-xs text-white/50">
                      {discount.allowedRoles?.length
                        ? discount.allowedRoles.join(", ")
                        : "All roles"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-xs text-white/50">
                      {discount.allowedAccessTo?.length
                        ? discount.allowedAccessTo.join(", ")
                        : "All access"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-xs text-white/50">
                      {discount.expiresAt
                        ? new Date(discount.expiresAt).toLocaleDateString()
                        : "No expiry"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {discount.isActive && (
                      <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium uppercase text-green-400">
                        Active
                      </span>
                    )}
                    {/* <div
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs uppercase ${
                        status === "active"
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : status === "used"
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {status === "active" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {status}
                    </div> */}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSendTarget(discount)}
                        disabled={discount.usedCount == discount.maxRedemptions}
                        title="Send to email"
                        className="rounded-lg cursor-pointer border border-yellow-500/30 bg-yellow-500/10 p-2 text-yellow-400 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Send size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(discount)}
                        title="Delete"
                        className="rounded-lg cursor-pointer border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SendDiscountEmailModal
        open={!!sendTarget}
        onOpenChange={(open) => {
          if (!open) setSendTarget(null);
        }}
        code={sendTarget?.code ?? null}
      />

      <DeleteDiscountModal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        discountId={deleteTarget?._id ?? null}
        discountCode={deleteTarget?.code ?? null}
      />
    </>
  );
}
