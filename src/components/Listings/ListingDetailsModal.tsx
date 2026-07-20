"use client";

import Image from "next/image";
import { useState, useEffect, useRef, cloneElement, isValidElement } from "react";
import { createPortal } from "react-dom";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Tag,
  Eye,
  Hash,
  Gift,
  Calendar,
  Users,
  X,
} from "lucide-react";
import { Badge } from "../ui/Badge";

interface Props {
  listing: any;
  children: React.ReactElement<any>;
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:p-4">
      <div className="mb-1.5 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gold sm:mb-2 sm:text-xs">
        {icon}
        {label}
      </div>

      <p className="break-words text-sm text-white">
        {value ?? "-"}
      </p>
    </div>
  );
}

function statusColor(status?: string) {
  switch (status) {
    case "active":
      return "bg-green-600";
    case "pending":
      return "bg-yellow-600";
    case "rejected":
      return "bg-red-600";
    default:
      return "bg-white/20";
  }
}

export default function ListingDetailsModal({ listing, children }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState<string | undefined>(
    listing?.cover_image
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveImage(listing?.cover_image);
  }, [listing?.cover_image]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const trigger = isValidElement(children)
    ? cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
          (children.props as any).onClick?.(e);
          setOpen(true);
        },
      } as any)
    : children;

  if (!listing) return trigger;

  const {
    title,
    status,
    cover_image,
    images = [],
    price,
    location,
    area_sqm,
    bedrooms,
    bathrooms,
    ref_code,
    listings_view,
    referral_commission,
    promoters = [],
    created_at,
  } = listing;

  const allImages = [cover_image, ...images].filter(Boolean);

  const modal = open && (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
      onMouseDown={(e) => {
        e.stopPropagation()
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-xl border border-gold/20 bg-[#121212] p-4 text-white shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
          <div className="min-w-0">
            <h2 className="break-words font-serif text-xl sm:text-2xl md:text-3xl">
              {title || "Listing Details"}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/60 sm:text-sm">
              <MapPin size={13} />
              {[location?.city, location?.region, location?.country]
                .filter(Boolean)
                .join(", ") || "-"}
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="shrink-0 cursor-pointer rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Images */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={title || "listing image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">
                No image
              </div>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border transition sm:h-16 sm:w-24 ${
                    activeImage === img
                      ? "border-gold"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`thumb-${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status + Price */}
        <div className="mb-4 flex flex-wrap items-center gap-3 sm:mb-6">
          <Badge className={statusColor(status)}>{status || "-"}</Badge>
          <span className="text-lg font-semibold text-gold sm:text-xl">
            {price ? `${price.amount} ${price.currency}` : "-"}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <Info icon={<Bed size={15} />} label="Bedrooms" value={bedrooms} />
          <Info icon={<Bath size={15} />} label="Bathrooms" value={bathrooms} />
          <Info icon={<Ruler size={15} />} label={area_sqm.unit} value={area_sqm.value} />
          <Info icon={<Hash size={15} />} label="Ref Code" value={ref_code} />
          <Info icon={<Eye size={15} />} label="Views" value={listings_view} />
          <Info
            icon={<Gift size={15} />}
            label="Referral Commission"
            value={
              referral_commission?.offered_amount != null
                ? `${referral_commission.offered_amount}`
                : "-"
            }
          />
          <Info icon={<Users size={15} />} label="Promoters" value={promoters.length} />
          <Info
            icon={<Calendar size={15} />}
            label="Created At"
            value={created_at ? new Date(created_at).toLocaleDateString() : "-"}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {trigger}
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}