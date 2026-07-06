"use client";

import {
  listingsApi,
  Promoter,
  PromoterProfile,
} from "@/lib/features/listings/listingsApi";
import { Eye, Forward, Trash2, Download, Mail, Phone } from "lucide-react";
import { useRef, useState } from "react";
import { PromoterProfileDialog } from "./PromoterProfile";
import { AppDispatch } from "@/lib/redux/store/store";
import { useDispatch } from "react-redux";

const PromotersCard = ({ promoter }: { promoter: any }) => {
  const [selectedCard, setSelectedCard] = useState<Promoter | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<PromoterProfile | null>(
    null,
  );
  const dispatch = useDispatch<AppDispatch>();

  const CURRENCY_SYMBOLS: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
  };

  const profileCache = useRef<Map<string, PromoterProfile>>(new Map());

  const handleView = async (promoter: Promoter) => {
    setSelectedCard(promoter);
    setDialogOpen(true);

    // Check cache first — if already fetched, show instantly
    if (profileCache.current.has(promoter.user_id)) {
      setActiveProfile(profileCache.current.get(promoter.user_id)!);
      setProfileLoading(false);
      setProfileError(null);
      return;
    }

    // Not cached — fetch now
    setActiveProfile(null);
    setProfileLoading(true);
    setProfileError(null);

    const result = await dispatch(
      listingsApi.getPromoterProfile(promoter.user_id),
    );

    if (listingsApi.getPromoterProfile.fulfilled.match(result)) {
      const profile = result.payload.data;
      profileCache.current.set(promoter.user_id, profile); // cache it
      setActiveProfile(profile);
    } else {
      setProfileError("Failed to load profile");
    }

    setProfileLoading(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Small delay before clearing so dialog closes gracefully
      setTimeout(() => {
        setSelectedCard(null);
        setActiveProfile(null);
        setProfileError(null);
      }, 200);
    }
  };

  const handleRevoke = (userId: string) => {
    if (confirm("Are you sure you want to revoke this promoter's access?")) {
      // TODO: dispatch revoke thunk
      console.log("Revoke:", userId);
    }
  };

  const handleDownloadAssets = (promoter: Promoter) => {
    alert(`Downloading assets for ${promoter.name}...`);
  };

  const handleShare = (promoter: Promoter) => {
    alert(`Sharing ${promoter.name}...`);
  };

  const formatValue = (
    listingPrices: { amount: number; currency: string }[],
  ) => {
    // Group by currency and sum
    const byCurrency = listingPrices.reduce<Record<string, number>>(
      (acc, { amount, currency }) => {
        acc[currency] = (acc[currency] ?? 0) + amount;
        return acc;
      },
      {},
    );

    return Object.entries(byCurrency)
      .map(([currency, total]) => {
        const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
        const formatted =
          total >= 1_000_000_000
            ? `${symbol}${(total / 1_000_000_000).toFixed(1)}B`
            : total >= 1_000_000
              ? `${symbol}${(total / 1_000_000).toFixed(1)}M`
              : total >= 1_000
                ? `${symbol}${(total / 1_000).toFixed(0)}K`
                : `${symbol}${total}`;
        return formatted;
      })
      .join(" · ");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <article
        key={promoter.user_id}
        className="card-luxe p-6 flex flex-col justify-between"
      >
        <div>
          {/* Avatar + Info */}
          <div className="flex items-start gap-4">
            <div
              className="inline-flex items-center justify-center rounded-full border border-gold/40 bg-[#1A1A1A] font-ui font-medium text-gold shrink-0"
              style={{ width: "52px", height: "52px", fontSize: "18.72px" }}
            >
              {getInitials(promoter.name ?? promoter.email)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl text-white truncate">
                  {promoter.name || "Promoter Name"}
                </h3>
                {/* Tier badge */}
                {/* <span
                  className="shrink-0 font-ui text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    color: TIER_COLORS[promoter.tier],
                    borderColor: `${TIER_COLORS[promoter.tier]}40`,
                    backgroundColor: `${TIER_COLORS[promoter.tier]}15`,
                  }}
                >
                  {TIER_LABELS[promoter.tier] ?? promoter.tier}
                </span> */}
              </div>

              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                {promoter.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gold shrink-0" />
                    <span>{promoter.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-gold shrink-0" />
                  <span className="truncate">{promoter.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-gold-soft bg-[#0E0E0E] px-3 py-2.5">
              <div className="text-white/70 text-xs">Value of Listings</div>
              <div className="mt-1 font-display text-lg text-white">
                {formatValue(promoter.listingPrices as any)}
              </div>
            </div>
            <div className="rounded-md border border-gold-soft bg-[#0E0E0E] px-3 py-2.5">
              <div className="text-white/70 text-xs">No. of Listings</div>
              <div className="mt-1 font-display text-lg text-white">
                {promoter.totalListingsCount}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-gold-soft pt-4">
          <button
            type="button"
            onClick={() => handleDownloadAssets(promoter)}
            className="flex items-center gap-2 font-ui text-[10px] tracking-[0.22em] uppercase text-gold hover:underline cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Download Assets
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="View"
              onClick={() => handleView(promoter)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold-soft text-white/75 transition hover:border-gold hover:text-gold cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Share"
              onClick={() => handleShare(promoter)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold-soft text-white/75 transition hover:border-gold hover:text-gold cursor-pointer"
            >
              <Forward className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Revoke"
              onClick={() => handleRevoke(promoter.user_id)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold-soft text-white/75 transition hover:border-red-500 hover:text-[#E88A8A] cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </article>

      <PromoterProfileDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        promoterCard={selectedCard}
        profile={activeProfile}
        loading={profileLoading}
        error={profileError}
      />
    </>
  );
};

export default PromotersCard;
