"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { promotersApi } from "@/lib/features/promoters/promotersApi";

import NetworkHeader from "@/components/Network/NetworkHeader";
import NetworkSearch from "@/components/Network/NetworkSearch";
import NetworkToolbar from "@/components/Network/NetworkToolbar";
import NetworkCard from "@/components/Network/NetworkCard";
import NetworkListItem from "@/components/Network/NetworkListItem";
import { NetworkCardSkeleton } from "@/components/Network/NetworkCardSkeleton";
import { PaginationControl } from "@/components/ui/PaginationControll";

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

  useEffect(() => {
    setPage(1);
  }, [search]);

  console.log("search query : ", search)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        promotersApi.getPromoters({
          page,
          limit: PAGE_SIZE,
          ...(search.trim() && { search: search.trim() }),
        })
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [dispatch, page, search]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <NetworkCardSkeleton key={index} />
            ))}
          </div>
        ) : promoters.length === 0 ? (
          <div className="rounded-xl border border-[#5c4518] py-20 text-center">
            <p className="text-gray-400">No network members found.</p>
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {promoters.map((promoter) => (
              <NetworkCard
                key={promoter._id}
                data={promoter}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {promoters.map((promoter) => (
              <NetworkListItem
                key={promoter._id}
                data={promoter}
              />
            ))}
          </div>
        )}

        {meta && meta.totalPage > 1 && !loading && (
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