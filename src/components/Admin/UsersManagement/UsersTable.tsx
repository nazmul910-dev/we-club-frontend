"use client";

import { useMemo, useState } from "react";
import { Settings2 } from "lucide-react";

import { IUser } from "@/types/user-managemetn";

import { useAppDispatch } from "@/lib/redux/store/hook";

import {
  updateApprovalStatus,
  updateLicenseStatus,
  updateAccountStatus,
} from "@/lib/features/users/usersApi";

import UserDetailsModal from "./UserDetailsModal";
import StatusDropdown from "./StatusDropdown";
import UserTabs from "./UserTabs";

interface Props {
  users: IUser[];
}

export default function UsersTable({ users }: Props) {
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<IUser | null>(null);

  const [tab, setTab] = useState("all");

  const filteredUsers = useMemo(() => {
    if (tab === "all") return users;

    return users.filter((user) => {
      if (tab === "pending") return user.approvalStatus === "pending";

      if (tab === "approved") return user.approvalStatus === "approved";

      if (tab === "verified")
        return user.licenseVerificationStatus === "verified";

      if (tab === "active") return user.accountStatus === "active";

      if (tab === "rejected")
        return (
          user.approvalStatus === "rejected" ||
          user.accountStatus === "rejected" ||
          user.licenseVerificationStatus === "rejected"
        );

      return true;
    });
  }, [users, tab]);

  return (
    <div className="w-full">
      <UserTabs active={tab} setActive={setTab} />

      <div className="w-full overflow-x-auto rounded-xl border border-yellow-500/20 bg-[#111]">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-yellow-500/20 bg-[#151515]">
            <tr className="text-left text-xs uppercase tracking-wider text-white/40">
              <th className="px-6 py-5">User</th>

              <th className="px-6 py-5">Role</th>

              <th className="px-6 py-5">Approval</th>

              <th className="px-6 py-5">License</th>

              <th className="px-6 py-5">Account</th>

              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-white/5 transition hover:bg-white/[0.03]"
              >
                <td
                  onClick={() => setSelected(user)}
                  className="cursor-pointer px-6 py-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10 text-sm font-semibold text-yellow-400">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {user.fullName}
                      </h3>

                      <p className="mt-1 text-xs text-white/40">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase text-white/60">
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs uppercase border ${
                      user.approvalStatus === "approved"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : user.approvalStatus === "rejected"
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {user.approvalStatus}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs uppercase border ${
                      user.licenseVerificationStatus === "verified"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : user.licenseVerificationStatus === "rejected"
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {user.licenseVerificationStatus}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs uppercase border ${
                      user.accountStatus === "active"
                        ? "border-green-500/30 bg-green-500/10 text-green-400"
                        : user.accountStatus === "rejected"
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {user.accountStatus}
                  </div>
                </td>

                <td className="px-6 py-5 text-center">
                  <StatusDropdown
                    onApproval={(status) =>
                      dispatch(
                        updateApprovalStatus({
                          id: user._id,

                          approvalStatus: status as any,
                        }),
                      )
                    }
                    onLicense={(status) =>
                      dispatch(
                        updateLicenseStatus({
                          id: user._id,

                          licenseVerificationStatus: status as any,
                        }),
                      )
                    }
                    onAccount={(status) =>
                      dispatch(
                        updateAccountStatus({
                          id: user._id,

                          accountStatus: status as any,
                        }),
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserDetailsModal user={selected} close={() => setSelected(null)} />
    </div>
  );
}
