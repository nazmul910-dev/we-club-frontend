"use client";

import { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getManagers } from "@/lib/features/addManager/ManagerApi";
import { setActiveTab } from "@/lib/features/addManager/addManagerSlice";
import {
  Manager,
  VISIBLE_ROLES_BY_CURRENT_ROLE,
} from "@/lib/features/addManager/managerTypes";

import AddManagerModal from "@/components/Admin/managerManagement/AddManagerModal";
import ManagerRowActions from "@/components/Admin/managerManagement/ManagerRowActions";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ManagersTableSkeleton } from "@/components/ui/manager-table-skeleton";
import { PaginationControl } from "@/components/ui/PaginationControll";

const TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
] as const;

const getInitials = (fullName: string) => {
  const words = fullName.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
};

const statusBadgeClass = (status: Manager["accountStatus"]) => {
  switch (status) {
    case "active":
      return "border-emerald-500/40 text-emerald-400";
    case "suspended":
      return "border-red-500/40 text-red-400";
    case "pending_payment":
    case "pending_approval":
      return "border-amber-500/40 text-amber-400";
    case "rejected":
      return "border-red-500/40 text-red-400";
    default:
      return "border-neutral-600 text-neutral-400";
  }
};

const formatAccess = (value: string) => {
  switch (value) {
    case "we_command_center":
      return "WE Command Center";
    case "invictus":
      return "Invictus";
    case "both":
      return "Both";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "super_admin":
      return "Super Admin Support";
    case "community_manager":
      return "Community Manager";
    default:
      return value;
  }
};

export default function ManagerManagement() {
  const dispatch = useAppDispatch();
  const { managers, loading, error, activeTab, meta } = useAppSelector(
    (state) => state.manager
  );

  const currentUserRole = useAppSelector((state) => state.authUser?.user?.role) as
    | string
    | undefined;

  const canDelete = currentUserRole === "founder";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const visibleRoles = useMemo(() => {
    if (!currentUserRole) return [];
    return VISIBLE_ROLES_BY_CURRENT_ROLE[currentUserRole] ?? [];
  }, [currentUserRole]);

  useEffect(() => {
    dispatch(getManagers({ status: activeTab, page, limit }));
  }, [dispatch, activeTab, page, limit]);


  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const filteredManagers = useMemo(() => {
    const sourceManagers = Array.isArray(managers) ? managers : [];

    let result = sourceManagers;

    if (visibleRoles.length > 0) {
      result = result.filter((m) => visibleRoles.includes(m.role as any));
    } else {
      result = [];
    }

    return result;
  }, [managers, visibleRoles]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">
      <div className="w-full space-y-6 md:space-y-0 md:flex md:items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#cdae53]">
            Admin Management
          </p>
          <h1 className="mt-2 font-playfair text-4xl font-medium text-white">
            Admin Directory
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            {currentUserRole === "founder"
              ? "Manage access, roles and account status of all admins."
              : "Manage Admin, Super Admin and Community Manager accounts."}
          </p>
        </div>

        <AddManagerModal />
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-neutral-800 bg-[#0B0B0B] shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">
          <Tabs
            value={activeTab}
            onValueChange={(value) => dispatch(setActiveTab(value as typeof activeTab))}
          >
            <TabsList className="h-11 rounded-full border border-neutral-800 bg-transparent p-1">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-full px-5 text-xs font-semibold uppercase tracking-wider text-neutral-400 transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-400">Per page</label>
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none"
            >
              {[10, 20, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <ManagersTableSkeleton />}

        {error && (
          <div className="flex h-72 items-center justify-center text-red-400">{error}</div>
        )}

        {!loading && !error && filteredManagers.length === 0 && (
          <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-500">
            <Users className="h-10 w-10 text-neutral-700" />
            <p>No accounts found.</p>
          </div>
        )}

        {!loading && !error && filteredManagers.length > 0 && (
          <div className="overflow-x-auto">
            <Table className="min-w-180">
              <TableHeader>
                <TableRow className="border-neutral-800 bg-neutral-900/40 hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-neutral-500">
                    User
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-neutral-500">
                    Access
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-neutral-500">
                    Role
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-neutral-500">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wider text-neutral-500">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow
                    key={manager._id}
                    className="border-neutral-800 transition hover:bg-neutral-900/70"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {manager.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={manager.profileImage}
                            alt={manager.fullName}
                            className="h-10 w-10 rounded-full border border-neutral-700 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-sm font-semibold text-amber-400">
                            {getInitials(manager.fullName)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">
                            {manager.fullName}
                          </span>
                          <span className="text-xs text-neutral-500">{manager.email}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-full border-neutral-700 bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-300"
                      >
                        <p>{formatAccess(manager.accessTo)}</p>
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-full border-neutral-700 bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-300"
                      >
                        {formatAccess(manager.role)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full bg-transparent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusBadgeClass(
                          manager.accountStatus
                        )}`}
                      >
                        {manager.accountStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <ManagerRowActions manager={manager} canDelete={canDelete} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}


        {!loading && !error && meta && meta.totalPage > 1 && (
          <div className="flex justify-center border-t border-neutral-800 px-6 py-5">
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