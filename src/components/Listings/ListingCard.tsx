"use client";

import { memo, useMemo } from "react";
import {
  Bath,
  Bed,
  MapPin,
  Maximize2,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import ListingsPromoteModal from "./ListingsPromoteModal";

import { promoteRequestApi } from "@/lib/features/PromoteRequest/promoteRequestApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { DEFAULT_STATUS_STYLE, STATUS_STYLES } from "@/styles/listingsStyles";
import { ListingDetailsModal } from "./ListingsDetailsModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type PromoteState =
  | "available"
  | "pending"
  | "sold"
  | "owner"
  | "already-promoting";

function getPromoteState(
  property: any,
  currentUserId: string | null,
): PromoteState {
  if (property.status === "pending") return "pending";
  if (property.status === "sold") return "sold";

  const associateId =
    typeof property.associate_id === "string"
      ? property.associate_id
      : property.associate_id?._id;
  if (currentUserId && String(associateId) === String(currentUserId))
    return "owner";

  const isAlreadyPromoter = (property.promoters ?? []).some((p: any) => {
    const promoterId =
      typeof p.user_id === "string" ? p.user_id : p.user_id?._id;
    return currentUserId && String(promoterId) === String(currentUserId);
  });
  if (isAlreadyPromoter) return "already-promoting";

  return "available";
}

const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-soft text-white/80 transition duration-200 hover:border-gold hover:text-gold cursor-pointer";

function ListingCardInner({ property }: { property: any }) {
  const dispatch = useDispatch<AppDispatch>();

  const currentUserId = useSelector(
    (s: RootState) => (s as any).authUser?.user?.id ?? null,
  );

  const promoteState = useMemo(
    () => getPromoteState(property, currentUserId),
    [property, currentUserId],
  );
  const statusStyle = useMemo(
    () => STATUS_STYLES[property.status] ?? DEFAULT_STATUS_STYLE,
    [property.status],
  );

  return (
    <article className="card-luxe flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
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
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-ui text-[10px] tracking-[0.2em] uppercase ${statusStyle.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            {property.status}
          </span>
        </div>

        {/* Price Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent p-4 pt-12">
          <div className="text-meta text-white/50">Asking</div>
          <div className="mt-0.5 font-display text-white text-2xl">
            {property.price.amount} {property.price.currency}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-white text-xl truncate">
          {property.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {property.location?.city}, {property.location?.region},{" "}
          {property.location?.country}
        </p>

        <div className="mt-4 flex items-center gap-5 font-ui text-[11px] text-foreground/80">
          <span className="flex items-center gap-1.5 text-white/70">
            <Bed className="h-3.5 w-3.5 text-gold" />
            {property.bedrooms} {property.location?.region}
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
            <Bath className="h-3.5 w-3.5 text-gold" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5 text-white/70">
            <Maximize2 className="h-3.5 w-3.5 text-gold" />
            {property.area_sqm}
          </span>
        </div>

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

        {/* Buttons */}
        <div className="mt-5 flex items-center gap-2">
          {promoteState === "pending" || promoteState === "sold" ? (
            <div className="flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center font-ui text-[10px] uppercase text-white/40">
              {promoteState === "pending" ? "Pending Approval" : "Sold"}
            </div>
          ) : promoteState === "already-promoting" ? (
            <div className="flex-1 w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-gold/30 bg-gold/6 px-3 py-2 text-gold/70">
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
                  promoteRequestApi.createPromoteRequest(payload),
                ).unwrap();
              }}
            />
          )}

          <ListingDetailsModal property={property} />

          {/* NOTE: relies on a <TooltipProvider> mounted once higher up the
              tree (e.g. root layout) — see note below the component. */}
          <Tooltip>
            <TooltipTrigger
              className={`${iconButtonClass} w-8 h-8 aspect-square flex-nowrap opacity-40 cursor-not-allowed hover:border-gold-soft hover:text-white/80`}
            >
              {/* Disabled native buttons often don't reliably fire the
                  hover/focus events Tooltip depends on — wrapping in a
                  span keeps the tooltip working while the button stays
                  genuinely non-interactive, matching the disabled-promote
                  pattern used elsewhere. */}

              <Share2 className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1a1a1a] text-center border-white/10 text-white text-xs max-w-[220px]">
              Sharing this listing isn't available right now.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </article>
  );
}

// Memoized since these render in a mapped grid — avoids re-rendering every
// card when e.g. only one listing's data changes elsewhere in the list.
export const ListingCard = memo(ListingCardInner);
