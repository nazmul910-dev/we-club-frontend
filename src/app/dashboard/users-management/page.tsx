"use client";

import { useEffect, useState } from "react";

import { redirect } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { getAllUsers } from "@/lib/features/users/usersApi";

import UserHeader from "@/components/Admin/UsersManagement/UsersHeader";
import UsersTable from "@/components/Admin/UsersManagement/UsersTable";
import { PaginationControl } from "@/components/ui/PaginationControll";

export default function UsersManagementPage() {
  const dispatch = useAppDispatch();



  const users = useAppSelector((state) => state.users.users);
  const loading = useAppSelector((state) => state.users.loading);
  const meta = useAppSelector((state) => state.users.meta);

  const currentUser = useAppSelector((state) => state.authUser?.user);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(getAllUsers({ page, limit }));
  }, [dispatch, page, limit]);

  if (currentUser && !["manager", "founder"].includes(currentUser.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-6">
        <UserHeader />

        <UsersTable users={users} loading={loading} />

        {meta && meta.totalPage > 1 && (
          <div className="mt-4">
            <PaginationControl
              currentPage={page}
              totalPages={meta.totalPage}
              onPageChange={(nextPage) => setPage(nextPage)}
            />
          </div>
        )}
      </div>
    </div>
  );
}