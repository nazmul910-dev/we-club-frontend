"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  ArrowUpRight,
  Notebook,
  Tag,
  Percent,
  Megaphone,
  MessageSquare,
  Award,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Avatar from "./ListingAvatar";
import { formatCompactNumber } from "@/lib/utils/format-number";

interface Props {
  request: any;
}

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
  rejected: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20",
  default: "bg-white/10 text-gray-300 ring-1 ring-white/10",
};

export default function PromoteRequestDetailsModal({ request }: Props) {
  const [open, setOpen] = useState(false);

  const requester = request?.requester;
  const user = requester?.user_id;
  const listing = request?.listing_id;


  // lock background scroll while modal is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  const initials = (name?: string) => {
    return name
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase();
  };

  const statusKey = (request?.status || "").toLowerCase();
  const statusClass = STATUS_STYLES[statusKey] || STATUS_STYLES.default;

  const location =
    listing?.location?.city || listing?.location?.country
      ? [listing?.location?.city, listing?.location?.country]
          .filter(Boolean)
          .join(", ")
      : "N/A";

  const formattedPrice = listing?.price?.amount
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: listing?.price?.currency || "USD",
        maximumFractionDigits: 0,
      }).format(listing.price.amount)
    : "N/A";

  const marketingChannels: string[] = request?.marketing_channels || [];

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              onClick={() => setOpen(true)}
              className="cursor-pointer font-medium text-[#c9a84c] underline decoration-white/20 decoration-1 underline-offset-4 transition hover:text-amber-300 hover:decoration-primary/50"
            >
              {user?.fullName || "Unknown"}
            </div>
          </TooltipTrigger>
          <TooltipContent>View Details</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm animate-in fade-in duration-150 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/50 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-[#111]/95 px-4 py-3.5 backdrop-blur sm:px-6 sm:py-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                  Promote Request
                </h2>
                <p className="text-xs text-gray-500">
                  Submitted{" "}
                  {request?.requested_at
                    ? new Date(request.requested_at).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                      )
                    : "—"}
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="shrink-0 cursor-pointer rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 px-4 py-5 sm:space-y-7 sm:px-6 sm:py-6">
              {/* REQUESTER */}
              <section>
                <SectionLabel>Requester</SectionLabel>

                <div className="flex flex-wrap items-center gap-4">
                  {user?.profileImage ? (
                    <Avatar image={user.profileImage} name={user.fullName} />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-white ring-2 ring-white/10 sm:h-16 sm:w-16">
                      {initials(user?.fullName) || "—"}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-base font-semibold text-white">
                      {user?.fullName || "Unknown"}
                    </h4>

                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {user?.role && (
                        <span className="inline-block rounded-full bg-white/5 px-2 py-0.5 text-xs capitalize text-gray-400">
                          {user.role}
                        </span>
                      )}
                      {requester?.selected_tier && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary">
                          <Award size={11} />
                          {requester.selected_tier}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <Info icon={<Notebook size={15} />} text={user?.bio || "N/A"} />
                </div>

                <div className="mt-4 grid gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-4 sm:grid-cols-2">
                  <Info icon={<Mail size={15} />} text={user?.email || "N/A"} />
                  <Info icon={<Phone size={15} />} text={user?.phone || "N/A"} />
                  <Info
                    icon={<MapPin size={15} />}
                    text={
                      user?.city || user?.country
                        ? `${user?.city ?? ""}${
                            user?.city && user?.country ? ", " : ""
                          }${user?.country ?? ""}`
                        : "N/A"
                    }
                  />
                </div>
              </section>

              {/* LISTING */}
              <section>
                <SectionLabel>Listing</SectionLabel>

                <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 sm:flex-row">
                  <div className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-lg bg-white/5 sm:h-[70px] sm:w-[100px]">
                    {listing?.cover_image && (
                      <Image
                        src={listing.cover_image}
                        fill
                        alt={listing?.title || "Listing cover"}
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col justify-center gap-1">
                    <h4 className="truncate font-semibold text-white">
                      {listing?.title || "Untitled listing"}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Hash size={12} />
                      <span>{listing?.ref_code || "—"}</span>
                    </div>

                    <a
                      href={listing?.url || "#"}
                      className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-medium text-primary transition hover:text-primary/80"
                    >
                      View listing
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>

                <div className="mt-3 grid gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-4 sm:grid-cols-2">
                  <Info icon={<MapPin size={15} />} text={location} />
                  <Info icon={<Tag size={15} />} text={`$ ${formatCompactNumber(listing.price.amount)}`} />
                  <Info
                    icon={<Percent size={15} />}
                    text={
                      listing?.referral_commission?.offered_amount != null
                        ? `${listing.referral_commission.offered_amount}% referral commission offered`
                        : "N/A"
                    }
                  />
                </div>
              </section>

              {/* PROMOTER PROPOSAL */}
              <section>
                <SectionLabel>Promoter Proposal</SectionLabel>

                <div className="grid gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <Info
                    icon={<Percent size={15} />}
                    text={
                      request?.proposed_commission_pct != null
                        ? `Proposed commission: ${request.proposed_commission_pct}%`
                        : "N/A"
                    }
                  />

                  <div className="flex items-start gap-3 text-sm text-gray-200">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-gray-400">
                      <Megaphone size={15} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                      {marketingChannels.length > 0 ? (
                        marketingChannels.map((channel) => (
                          <span
                            key={channel}
                            className="rounded-full bg-white/5 px-2 py-0.5 text-xs capitalize text-gray-300 ring-1 ring-white/10"
                          >
                            {channel.replace(/_/g, " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm text-gray-200">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-gray-400">
                      <MessageSquare size={15} />
                    </span>
                    <p className="min-w-0 flex-1 whitespace-pre-wrap wrap-break-word text-gray-300">
                      {request?.message || "N/A"}
                    </p>
                  </div>
                </div>
              </section>

              {/* REQUEST INFO */}
              <section>
                <SectionLabel>Request status</SectionLabel>

                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
                  >
                    {request?.status || "unknown"}
                  </span>

                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Calendar size={14} />
                    {request?.requested_at
                      ? new Date(request.requested_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </h3>
  );
}

function Info({
  icon,
  text,
  wrap = false,
}: {
  icon: any;
  text: string;
  wrap?: boolean;
}) {
  return (
    <div className={`flex gap-3 text-sm text-gray-200 ${wrap ? "items-start" : "items-center"}`}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-gray-400">
        {icon}
      </span>
      <span
        className={`min-w-0 flex-1 ${
          wrap ? "whitespace-normal wrap-break-word" : "truncate"
        }`}
      >
        {text}
      </span>
    </div>
  );
}