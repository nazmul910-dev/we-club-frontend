"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { promotersApi } from "@/lib/features/promoters/promotersApi";

import NetworkHeader from "@/components/Network/NetworkHeader";
import NetworkSearch from "@/components/Network/NetworkSearch";
import NetworkToolbar from "@/components/Network/NetworkToolbar";
import NetworkCard from "@/components/Network/NetworkCard";
import NetworkListItem from "@/components/Network/NetworkListItem";
import { PaginationControl } from "@/components/ui/PaginationControll";
import { normalizePromoterForDirectory } from "@/lib/features/promoters/normalizePromoters";


const PAGE_SIZE = 24;
const SEARCH_DEBOUNCE_MS = 300;

export default function NetworkDirectoryPage() {
  const dispatch = useAppDispatch();
  const {
    items: promoters,
    meta,
    loading,
  } = useAppSelector((state) => state.promoters);

  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  // A new search term makes the old page number meaningless (page 3 of
  // "unfiltered" results isn't page 3 of "matching Cap Ferrat" results) —
  // reset back to page 1 whenever the search changes.
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Debounced server-side search: filtering happens on the backend against
  // the FULL promoter set, not just whatever page happened to already be
  // loaded client-side. Waits for typing to pause before firing, so it's
  // not sending a request on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      dispatch(
        promotersApi.getPromoters({
          page,
          limit: PAGE_SIZE,
          ...(search.trim() ? { search: search.trim() } : {}),
        })
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [dispatch, page, search]);



  console.log(promoters)

  return (
    <div className="min-h-screen bg-black px-6 py-10 md:px-10">
      <div className="max-w-7xl mx-auto">
        <NetworkHeader />

        <div className="mt-8">
          <NetworkSearch value={search} onChange={setSearch} />
        </div>

        <NetworkToolbar
          count={meta?.total ?? promoters.length}
          layout={layout}
          setLayout={setLayout}
        />

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading network members...
          </div>
        ) : promoters.length === 0 ? (
          <div className="border border-[#5c4518] rounded-xl py-20 text-center">
            <p className="text-gray-400">No network members found</p>
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {promoters.map((item) => (
              <NetworkCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {promoters.map((item) => (
              <NetworkListItem key={item._id} data={item} />
            ))}
          </div>
        )}

        {!loading && meta && meta.totalPage > 1 && (
          <div className="mt-8">
            <PaginationControl
              currentPage={meta.page}
              totalPages={meta.totalPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}