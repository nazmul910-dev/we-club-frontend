"use client";

import { Bath, Bed, MapPin, Maximize2, Share2, CheckCircle2 } from "lucide-react";
import { useSelector } from "react-redux";
import ListingsPromoteModal from "./ListingsPromoteModal";
import { promoteRequestApi } from "@/lib/features/PromoteRequest/promoteRequestApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { useDispatch } from "react-redux";

type PromoteState =
  | "available"
  | "pending" // listing itself hasn't been approved yet — applies to everyone
  | "sold" // listing itself is sold — applies to everyone
  | "owner" // viewer owns this listing
  | "already-promoting"; // viewer already has a promote request on this listing

function getPromoteState(property: any, currentUserId: string | null): PromoteState {
  if (property.status === "pending") return "pending";
  if (property.status === "sold") return "sold";

  const associateId =
    typeof property.associate_id === "string"
      ? property.associate_id
      : property.associate_id?._id;
  if (currentUserId && String(associateId) === String(currentUserId)) return "owner";

  const isAlreadyPromoter = (property.promoters ?? []).some((p: any) => {
    const promoterId = typeof p.user_id === "string" ? p.user_id : p.user_id?._id;
    return currentUserId && String(promoterId) === String(currentUserId);
  });
  if (isAlreadyPromoter) return "already-promoting";

  return "available";
}

export const ListingCard = ({ property }: { property: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const currentUserId = useSelector(
    (s: RootState) => (s as any).authUser?.user?.id ?? null
  );

  const promoteState = getPromoteState(property, currentUserId);

  return (
    <article
      key={property.ref_code}
      className=" card-luxe flex flex-col overflow-hidden"
    >
      {/* Card Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.cover_image}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="rounded-sm bg-gold px-2.5 py-1 font-ui text-[10px] tracking-[0.2em] uppercase text-primary-foreground">
            Ref · {property.ref_code}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-ui text-[10px] tracking-[0.2em] uppercase text-white/50`}
          >
            <span className={`h-1.5 w-1.5 rounded-full text`} />
            {property.status}
          </span>
        </div>

        {/* Overlay with Asking Price */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent p-4 pt-12">
          <div className="text-meta text-white/50">Asking</div>
          <div className="mt-0.5 font-display  text-white text-2xl">
            {property.price.amount} {property.price.currency}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="font-display text-white text-xl truncate"
          title={property.title}
        >
          {property.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {property.location?.city}, {property.location?.state},{" "}
          {property.location?.region}
        </p>

        {/* Specs */}
        <div className="mt-4 flex items-center gap-5 font-ui text-[11px] text-foreground/80">
          <span className="flex items-center gap-1.5 text-white/70">
            <Bed className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
            <Bath className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
            <Maximize2 className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
            {property.area_sqm}
          </span>
        </div>

        {/* Commission */}
        <div className="mt-5 rounded-md border border-gold/45 bg-gold/8 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-gold">
              Referral Commission Offered
            </span>
            <span className="font-display text-lg text-gold">
              {property.referral_commission?.offered_amount}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center gap-2 pt-1">
          {promoteState === "pending" || promoteState === "sold" ? (
            // Listing-level state — true for every viewer, not specific to
            // the current user. A quiet inline badge reads faster than a
            // disabled button + hover tooltip, and works on touch devices.
            <div className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-center font-ui text-[10px] tracking-[0.22em] uppercase text-white/40">
              {promoteState === "pending" ? "Pending Approval" : "Sold"}
            </div>
          ) : promoteState === "already-promoting" ? (
            // Viewer-specific, positive state — worth a distinct look rather
            // than a disabled control, since it's not really a "blocked"
            // action, it's confirmation the viewer already acted.
            <div className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-gold/30 bg-gold/[0.06] px-3 py-2 font-ui text-[10px] tracking-[0.22em] uppercase text-gold/70">
              <CheckCircle2 size={12} />
              Already Promoting
            </div>
          ) : (
            <ListingsPromoteModal
              listingId={property._id}
              disabled={promoteState === "owner"}
              disabledReason={
                promoteState === "owner"
                  ? "You can't promote your own listing."
                  : undefined
              }
              onSubmit={async (payload) => {
                await dispatch(
                  promoteRequestApi.createPromoteRequest(payload)
                ).unwrap();
              }}
            />
          )}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-soft text-white/80 hover:border-gold hover:text-gold transition duration-200 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};