"use client";

import { Bath, Bed, Maximize2, MapPin, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DEFAULT_STATUS_STYLE, STATUS_STYLES } from "@/styles/listingsStyles";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store/store";
import { useState } from "react";
import { listingsApi } from "@/lib/features/listings/listingsApi";

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center">
      <div className="flex justify-center text-gold mb-1.5">{icon}</div>
      <div className="text-white text-sm font-medium">{value}</div>
      <div className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight
          ? "border-gold/40 bg-gold/[0.06]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div
        className={`text-[10px] uppercase tracking-wider mb-1 ${
          highlight ? "text-gold" : "text-white/40"
        }`}
      >
        {label}
      </div>
      <div
        className={`text-sm font-medium ${highlight ? "text-gold" : "text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}

export function ListingDetailsModal({ property }: { property: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  // Optimistic display count — bumped immediately on open rather than
  // waiting for the server round trip, since the real count only matters
  // for later readers, not for confirming this exact click to this user.
  const [displayViews, setDisplayViews] = useState(property.listings_view ?? 0);

  const statusStyle = STATUS_STYLES[property.status] ?? DEFAULT_STATUS_STYLE;

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (open) {
      setDisplayViews((v: number) => v + 1);
      // Fire-and-forget: a failed view-count write shouldn't block or
      // interrupt the user actually viewing the listing's details.
      dispatch(listingsApi.incrementListingView(property._id));
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="inline-flex cursor-pointer w-9 h-9 aspect-square  items-center justify-center rounded-full border border-gold-soft text-white/80 transition duration-200 hover:border-gold hover:text-gold">
        <Eye className="h-3.5 w-3.5" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto border border-gold-soft/60 bg-[#111111]/90 backdrop-blur-2xl text-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="font-display text-2xl text-white">
              {property.title}
            </DialogTitle>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-ui text-[10px] tracking-[0.2em] uppercase ${statusStyle.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {property.status}
            </span>
          </div>
          <DialogDescription className="text-white/50">
            Ref · {property.ref_code}
          </DialogDescription>
        </DialogHeader>

        {property.cover_image && (
          <div className="relative min-h-80 overflow-hidden rounded-lg border border-white/10">
            <img
              src={property.cover_image}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <p className="flex items-center gap-1.5 text-sm text-white/60">
          <MapPin size={14} className="shrink-0" />
          {[
            property.location?.city,
            property.location?.state,
            property.location?.region,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>

        <div className="grid grid-cols-3 gap-3">
          <Spec
            icon={<Bed size={16} />}
            label="Bedrooms"
            value={property.bedrooms}
          />
          <Spec
            icon={<Bath size={16} />}
            label="Bathrooms"
            value={property.bathrooms}
          />
          <Spec
            icon={<Maximize2 size={16} />}
            label="Area"
            value={`${property?.area_sqm?.value} ${property?.area_sqm?.unit} `}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoBox
            label="Asking Price"
            value={`${property.price?.amount} ${property.price?.currency}`}
          />
          <InfoBox
            label="Referral Commission"
            value={`${property.referral_commission?.offered_amount}%`}
            highlight
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoBox
            label="Promoters"
            value={String((property.promoters ?? []).length)}
          />
          <InfoBox label="Views" value={String(displayViews)} />
        </div>

        {Array.isArray(property.images) && property.images.length > 0 && (
          <div>
            <h4 className="mb-2 text-[10px] uppercase tracking-widest text-white/40">
              Gallery
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {property.images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-md border border-white/10"
                >
                  <img
                    src={img}
                    alt={`${property.title} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
