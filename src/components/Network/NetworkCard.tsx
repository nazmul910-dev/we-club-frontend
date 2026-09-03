"use client";

import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Megaphone,
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
  co_mentor:
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

export default function NetworkCard({ user }: Props) {
  const role = user?.role || "associate";

  const badgeClass =
    roleStyles[role] ||
    "border-gray-700 text-gray-400 bg-gray-900/30";

  const userName = user?.fullName || "User";

  const location =
    [user?.city, user?.country].filter(Boolean).join(", ") ||
    "Location not set";

  const joinDate = formatJoinDate(user?.createdAt);

  const channels: string[] = Array.isArray(user?.marketingChannels)
    ? user.marketingChannels
    : [];

  return (
    <div className="flex h-full flex-col rounded-[12px] border border-[#5c4518] bg-[#090909] p-4 shadow-[0_0_10px_#00000040] transition duration-300 hover:shadow-[#c9a3276b] sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          <Avatar
            image={user?.profileImage}
            name={userName}
          />

          <div className="min-w-0">
            <h3 className="truncate font-playfair text-sm font-medium text-white sm:text-[15px]">
              {userName}
            </h3>

            <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
              <MapPin
                size={12}
                className="shrink-0"
              />

              <span className="truncate text-[10px] sm:text-[11px]">
                {location}
              </span>
            </div>
          </div>
        </div>

        <span
          className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[8px] uppercase tracking-[1px] sm:px-3 sm:text-[9px] sm:tracking-[1.5px] ${badgeClass}`}
        >
          {role.replaceAll("_", " ")}
        </span>
      </div>

      {/* Extra details */}
      <div className="mt-4 flex flex-col gap-2 border-t border-[#3e3014] pt-3 text-xs text-gray-400">
        {user?.brokerage && (
          <div className="flex min-w-0 items-center gap-2">
            <Building2
              size={12}
              className="shrink-0 text-[#c9a227]"
            />

            <span className="truncate text-[11px]">
              {user.brokerage}
            </span>
          </div>
        )}

        {user?.licenseNumber && (
          <div className="flex min-w-0 items-center gap-2">
            <BadgeCheck
              size={12}
              className="shrink-0 text-[#c9a227]"
            />

            <span className="truncate text-[11px] tracking-wide">
              License · {user.licenseNumber}
            </span>
          </div>
        )}

        {joinDate && (
          <div className="flex min-w-0 items-center gap-2">
            <CalendarDays
              size={12}
              className="shrink-0 text-[#c9a227]"
            />

            <span className="truncate text-[11px]">
              Joined {joinDate}
            </span>
          </div>
        )}
      </div>

      {/* Marketing channels */}
      {channels.length > 0 && (
        <div className="mt-3 flex items-start gap-2">
          <Megaphone
            size={12}
            className="mt-0.5 shrink-0 text-[#c9a227]"
          />

          <div className="flex flex-wrap gap-1.5">
            {channels.slice(0, 4).map((channel, index) => (
              <span
                key={`${channel}-${index}`}
                className="rounded-full border border-[#3e3014] px-2 py-0.5 text-[9px] uppercase tracking-wider text-gray-400"
              >
                {channel}
              </span>
            ))}

            {channels.length > 4 && (
              <span className="rounded-full border border-[#3e3014] px-2 py-0.5 text-[9px] text-gray-500">
                +{channels.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bio */}
      {user?.bio && (
        <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-gray-500">
          {user.bio}
        </p>
      )}

      {/* Equal-height card spacer */}
      <div className="flex-1" />

      {/* Contact */}
      <div className="mt-5 flex items-center gap-2 sm:gap-3">
        {user?.email ? (
          <a
            href={`mailto:${user.email}`}
            aria-label={`Email ${userName}`}
            title={`Email ${userName}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5c4518] text-gray-400 transition hover:border-[#c9a227] hover:text-[#c9a227] sm:h-9 sm:w-9"
          >
            <Mail size={14} />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-label="Email unavailable"
            title="Email unavailable"
            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full border border-[#5c4518] text-gray-600 opacity-50 sm:h-9 sm:w-9"
          >
            <Mail size={14} />
          </button>
        )}

        {user?.phone ? (
          <a
            href={`tel:${user.phone}`}
            aria-label={`Call ${userName}`}
            title={`Call ${userName}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5c4518] text-gray-400 transition hover:border-[#c9a227] hover:text-[#c9a227] sm:h-9 sm:w-9"
          >
            <Phone size={14} />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-label="Phone unavailable"
            title="Phone unavailable"
            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full border border-[#5c4518] text-gray-600 opacity-50 sm:h-9 sm:w-9"
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