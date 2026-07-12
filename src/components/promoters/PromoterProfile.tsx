"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  BadgeCheck,
  Megaphone,
  Loader2,
} from "lucide-react";
import { Promoter, PromoterProfile } from "@/lib/features/listings/listingsApi";


// ─── Tier config ──────────────────────────────────────────────────────────────

const TIER_LABELS: Record<string, string> = {
  tier_1: "Tier 1 · Full Marketing + Website",
  tier_2: "Tier 2 · Full Marketing",
  tier_3: "Tier 3 · Discreet Marketing",
};

const TIER_COLORS: Record<string, string> = {
  tier_1: "#16a34a",
  tier_2: "#2563eb",
  tier_3: "#7c3aed",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ─── Props ────────────────────────────────────────────────────────────────────

interface PromoterProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promoterCard: Promoter | null;   // card data already in store (name, tier, stats)
  profile: PromoterProfile | null; // full profile, fetched lazily on click
  loading: boolean;
  error: string | null;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export const ProfileSkeleton = () => (
  <div className="space-y-4 animate-pulse pt-2">
    {[80, 60, 70].map((w, i) => (
      <div
        key={i}
        className="h-3 rounded bg-white/10"
        style={{ width: `${w}%` }}
      />
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

export function PromoterProfileDialog({
  open,
  onOpenChange,
  promoterCard,
  profile,
  loading,
  error,
}: PromoterProfileDialogProps) {
  if (!promoterCard) return null;

  const tierColor = TIER_COLORS[promoterCard.tier] ?? "#888";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0e0e0e] border border-gold-soft text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Promoter Profile</DialogTitle>
        </DialogHeader>

        {/* Avatar + Name + Tier — from card data, always available instantly */}
        <div className="flex items-center gap-4 pb-4 border-b border-gold-soft">
          <div
            className="inline-flex items-center justify-center rounded-full border border-gold/40 bg-[#1A1A1A] font-ui font-medium text-gold shrink-0"
            style={{ width: "56px", height: "56px", fontSize: "20px" }}
          >
            {getInitials(promoterCard.name ?? promoterCard.email)}
          </div>

          <div className="min-w-0">
            <h2 className="font-display text-xl text-white truncate">
              {promoterCard.name}
            </h2>
            <span
              className="inline-block mt-1 font-ui text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border"
              style={{
                color: tierColor,
                borderColor: `${tierColor}40`,
                backgroundColor: `${tierColor}15`,
              }}
            >
              {TIER_LABELS[promoterCard.tier] ?? promoterCard.tier}
            </span>
          </div>
        </div>

        {/* Stats — from card data, always available instantly */}
        <div className="grid grid-cols-2 gap-2 pb-4 border-b border-gold-soft">
          <div className="rounded-md border border-gold-soft bg-[#0a0a0a] px-3 py-2">
            <div className="text-white/50 text-xs">Listings Promoted</div>
            <div className="mt-0.5 font-display text-lg text-white">
              {promoterCard.totalListingsCount}
            </div>
          </div>
          <div className="rounded-md border border-gold-soft bg-[#0a0a0a] px-3 py-2">
            <div className="text-white/50 text-xs">Email</div>
            <div className="mt-0.5 text-xs text-white truncate">
              {promoterCard.email}
            </div>
          </div>
        </div>

        {/* Profile details — lazily loaded */}
        {loading && <ProfileSkeleton />}

        {error && (
          <p className="text-sm text-red-400 py-2">{error}</p>
        )}

        {!loading && !error && profile && (
          <div className="space-y-0 divide-y divide-gold-soft">

            {/* Contact */}
            <div className="space-y-2.5 py-3">
              <p className="font-ui text-[9px] tracking-widest uppercase text-gold/60 mb-3">
                Contact
              </p>

              <div className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>

              {profile.phone && (
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}

              {(profile.city || profile.country) && (
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                  <span>
                    {[profile.city, profile.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Professional */}
            {(profile.licenseNumber || profile.brokerage) && (
              <div className="space-y-2.5 py-3">
                <p className="font-ui text-[9px] tracking-widest uppercase text-gold/60 mb-3">
                  Professional
                </p>

                {profile.brokerage && (
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <Building2 className="h-3.5 w-3.5 text-gold shrink-0" />
                    <span>{profile.brokerage}</span>
                  </div>
                )}

                {profile.licenseNumber && (
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <BadgeCheck className="h-3.5 w-3.5 text-gold shrink-0" />
                    <span className="font-ui tracking-wider">
                      {profile.licenseNumber}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Marketing Channels */}
            {profile.marketingChannels && profile.marketingChannels.length > 0 && (
              <div className="space-y-2 py-3">
                <p className="font-ui text-[9px] tracking-widest uppercase text-gold/60 mb-3">
                  Marketing Channels
                </p>
                <div className="flex items-start gap-3 text-sm text-white/80">
                  <Megaphone className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-1.5">
                    {profile.marketingChannels.map((channel : string) => (
                      <span
                        key={channel}
                        className="font-ui text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border border-gold-soft text-white/60"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <div className="py-3">
                <p className="font-ui text-[9px] tracking-widest uppercase text-gold/60 mb-2">
                  Bio
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}