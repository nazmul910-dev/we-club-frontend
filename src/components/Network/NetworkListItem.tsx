"use client";

import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import Avatar from "./Avatar";
import NetworkProfileDialog from "./NetworkProfileDialog";

interface Props {
  user: any;
}

const roleStyles: Record<string, string> = {
  admin: "border-green-700 text-green-400 bg-green-950/20",
  associate: "border-yellow-700 text-yellow-400 bg-yellow-950/20",
  partner: "border-blue-700 text-blue-400 bg-blue-950/20",
  ceo: "border-purple-700 text-purple-400 bg-purple-950/20",
  ceo_partner: "border-cyan-700 text-cyan-400 bg-cyan-950/20",
  ambassador:
    "border-emerald-700 text-emerald-400 bg-emerald-950/20",
  we_club_member:
    "border-gray-700 text-gray-400 bg-gray-900/30",
  founder: "border-amber-600 text-amber-400 bg-amber-950/20",
  super_admin: "border-rose-700 text-rose-400 bg-rose-950/20",
  community_manager:
    "border-teal-700 text-teal-400 bg-teal-950/20",
  manager: "border-indigo-700 text-indigo-400 bg-indigo-950/20",
};

const formatJoinDate = (dateStr?: string) => {
  if (!dateStr) return null;

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

export default function NetworkListItem({ user }: Props) {
  const role = user?.role || "associate";

  const badgeClass =
    roleStyles[role] ||
    "border-gray-700 text-gray-400 bg-gray-900/30";

  const userName = user?.fullName || "User";

  const location =
    [user?.city, user?.country].filter(Boolean).join(", ") ||
    "Location not set";

  const joinDate = formatJoinDate(user?.createdAt);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#5c4518] bg-[#090909] p-4 transition hover:border-[#c9a227] sm:flex-row sm:items-center sm:justify-between sm:p-5">
      {/* Identity */}
      <div className="flex min-w-0 items-center gap-4">
        <Avatar
          image={user?.profileImage}
          name={userName}
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-white">
              {userName}
            </h3>

            <span
              className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[8px] uppercase tracking-[1px] ${badgeClass}`}
            >
              {role.replaceAll("_", " ")}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin
              size={12}
              className="shrink-0"
            />

            <span className="truncate">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Professional details */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-400 sm:pl-2">
        {user?.brokerage && (
          <div className="flex min-w-0 items-center gap-1.5">
            <Building2
              size={12}
              className="shrink-0 text-[#c9a227]"
            />

            <span className="truncate">
              {user.brokerage}
            </span>
          </div>
        )}

        {user?.licenseNumber && (
          <div className="flex min-w-0 items-center gap-1.5">
            <BadgeCheck
              size={12}
              className="shrink-0 text-[#c9a227]"
            />

            <span className="truncate tracking-wide">
              {user.licenseNumber}
            </span>
          </div>
        )}

        {joinDate && (
          <div className="flex items-center gap-1.5">
            <CalendarDays
              size={12}
              className="shrink-0 text-[#c9a227]"
            />

            <span className="truncate">
              Joined {joinDate}
            </span>
          </div>
        )}

        {!user?.brokerage &&
          !user?.licenseNumber &&
          !joinDate && (
            <span className="text-gray-600">
              No additional details
            </span>
          )}
      </div>

      {/* Contact */}
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        {user?.email ? (
          <a
            href={`mailto:${user.email}`}
            aria-label={`Email ${userName}`}
            title={`Email ${userName}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5c4518] text-gray-400 transition hover:border-[#c9a227] hover:text-[#c9a227]"
          >
            <Mail size={14} />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-label="Email unavailable"
            title="Email unavailable"
            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full border border-[#5c4518] text-gray-600 opacity-50"
          >
            <Mail size={14} />
          </button>
        )}

        {user?.phone ? (
          <a
            href={`tel:${user.phone}`}
            aria-label={`Call ${userName}`}
            title={`Call ${userName}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5c4518] text-gray-400 transition hover:border-[#c9a227] hover:text-[#c9a227]"
          >
            <Phone size={14} />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-label="Phone unavailable"
            title="Phone unavailable"
            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full border border-[#5c4518] text-gray-600 opacity-50"
          >
            <Phone size={14} />
          </button>
        )}

        <NetworkProfileDialog
          profile={user}
          user={user}
        />
      </div>
    </div>
  );
}
