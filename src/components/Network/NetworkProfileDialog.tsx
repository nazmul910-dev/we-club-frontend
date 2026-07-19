"use client";

import { BadgeCheck, Building2, Eye, Mail, MapPin, Megaphone, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ProfileSkeleton } from "../promoters/PromoterProfile";
import { useEffect, useState } from "react";
import { promotersApi } from "@/lib/features/promoters/promotersApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store/store";

const NetworkProfileDialog = ({ profile, user } : {profile : any, user : any}) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [displayViews, setDisplayViews] = useState(10);


    const dispatch = useDispatch<AppDispatch>();

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

  const tierColor = TIER_COLORS[profile?.tier] ?? "#888";

    function handleOpenChange(open: boolean) {
      setIsOpen(open);
      if (open) {
        setDisplayViews((v: number) => v + 1);
        // Fire-and-forget: a failed view-count write shouldn't block or
        // interrupt the user actually viewing the listing's details.
        dispatch(promotersApi.incrementPromoterView(user._id));
      }
    }
  
useEffect(() => {
  setDisplayViews(user?.profile_views ?? 0);
}, [user?.profile_views]);


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className=" w-9 h-9
      rounded-full
      border border-[#5c4518]
      flex
      items-center
      justify-center
      text-gray-400
      hover:text-[#c9a227]
      transition">

        <Eye size={15} />
      </DialogTrigger>
      <DialogContent className="bg-[#0e0e0e] border border-gold-soft text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Promoter Profile</DialogTitle>
        </DialogHeader>

        {/* Avatar + Name + Tier — from card data, always available instantly */}
        <div className="flex flex-col text-left  gap-4 pb-4 border-b border-gold-soft">
          
          <div className="min-w-0">
            <img src={profile.profileImage} height={60} width={60} className="rounded-full overflow-hidden"/>
           
          </div>
          <div
            className="inline-flex   font-ui font-medium text-gold "
           
          >
            {profile.fullName}
          </div>

        </div>

        {/* Stats — from card data, always available instantly */}
        {/* <div className="grid grid-cols-2 gap-2 pb-4 border-b border-gold-soft">
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
        </div> */}

        {/* Profile details — lazily loaded */}
        {loading && <ProfileSkeleton />}

        {error && <p className="text-sm text-red-400 py-2">{error}</p>}

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
            <p>Profile Views : {displayViews}</p>

            {/* Marketing Channels */}
            {profile.marketingChannels &&
              profile.marketingChannels.length > 0 && (
                <div className="space-y-2 py-3">
                  <p className="font-ui text-[9px] tracking-widest uppercase text-gold/60 mb-3">
                    Marketing Channels
                  </p>
                  <div className="flex items-start gap-3 text-sm text-white/80">
                    <Megaphone className="h-3.5 w-3.5 text-gold shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {profile.marketingChannels.map((channel: string) => (
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
};
export default NetworkProfileDialog;
