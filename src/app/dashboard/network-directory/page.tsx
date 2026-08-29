"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getAllUsers } from "@/lib/features/users/usersApi";

import NetworkHeader from "@/components/Network/NetworkHeader";
import NetworkSearch from "@/components/Network/NetworkSearch";
import NetworkToolbar from "@/components/Network/NetworkToolbar";
import NetworkCard from "@/components/Network/NetworkCard";
import NetworkListItem from "@/components/Network/NetworkListItem";
import { NetworkCardSkeleton } from "@/components/Network/NetworkCardSkeleton";
import { PaginationControl } from "@/components/ui/PaginationControll";

const PAGE_SIZE = 9;
const SEARCH_DEBOUNCE_MS = 300;

export default function NetworkDirectoryPage() {
  const dispatch = useAppDispatch();

  const { users, meta, loading } = useAppSelector((state) => state.users);
const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [limit,setLimit] = useState(9);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     dispatch(
  //       getAllUsers({
  //         page,
  //         limit: PAGE_SIZE,
  //         ...(search.trim() && { search: search.trim() }),
  //         approvalStatus: "approved",
  //       } as any)
  //     );
  //   }, SEARCH_DEBOUNCE_MS);

   useEffect(() => {
  dispatch(
    getAllUsers({
      page,
      limit,
      search, // এখন এটা plain string হিসেবেই যাবে
      approvalStatus: "approved", // আলাদা field হিসেবে
    })
  );
}, [dispatch, page, limit, search]);

// console.log(users);

  //   return () => clearTimeout(timer);
  // }, [dispatch, page, search]);

  // backend filter na kaj korle extra safety hisebe frontend eo filter kora hocche
  // const approvedUsers = (users ?? []).filter(
  //   (u: any) => u.approvalStatus === "approved"
  // );

  



  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="">
        <NetworkHeader />

        <div className="">
          <NetworkSearch value={search} onChange={setSearch} />
        </div>

        <NetworkToolbar
          count={ meta?.total!}
          layout={layout}
          setLayout={setLayout}
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <NetworkCardSkeleton key={index} />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-[#5c4518] py-20 text-center">
            <p className="text-gray-400">No network members found.</p>
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user: any) => (
              <NetworkCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user: any) => (
              <NetworkListItem key={user._id} user={user} />
            ))}
          </div>
        )}

        {meta && meta.totalPage > 1 && !loading && (
          <div className="">
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