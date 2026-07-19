"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Loader2,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Mail,
  Phone,
  
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import api from "@/lib/api/api";

import Logo from "../../../public/assets/world-logo.png"
import Link from "next/link";


interface PublicPromoteRequestDetailsProps {
  id: string;
}

/**
 * Design tokens (matched to the Rise Alliance reference):
 * - bg-cream:   #F8F6F0   page background
 * - bg-card:    #FFFFFF   white cards
 * - ink:        #101214   primary text
 * - muted:      #9A9C99   secondary / eyebrow text
 * - line:       #EDEAE2   hairline dividers
 * - accent:     #D97757   small accent dot (role bullet)
 */

const statusStyles: Record<string, string> = {
  approved: "bg-[#CDEFD4] text-[#306843]",
  pending: "bg-[#FBF0DC] text-[#8A5A00]",
  rejected: "bg-[#FBE4E1] text-[#A32C1E]",
  cancelled: "bg-[#ECEAE4] text-[#5F5F5F]",
};

export default function PublicPromoteRequestDetails({
  id,
}: PublicPromoteRequestDetailsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/listings/promote-request/public/${id}`);
        setData(res.data.data);
        setActiveImage(
          res.data.data?.listing?.cover_image ||
            res.data.data?.listing?.images?.[0] ||
            null
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F6F0]">
        <Loader2 className="animate-spin text-[#9A9C99]" size={32} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F6F0] px-6">
        <div className="text-center">
          <p className="font-serif text-xl text-[#101214]">
            Invalid or expired promotion link
          </p>
          <p className="mt-2 font-mono text-[13px] tracking-wide text-[#9A9C99]">
            PLEASE CHECK THE LINK OR CONTACT THE SENDER
          </p>
        </div>
      </div>
    );
  }

  const owner =
    data.selected_tier === "tier_1" ? data.listing_owner : data.promoter;

  const listing = data.listing;

  const galleryImages: string[] = Array.from(
    new Set([listing?.cover_image, ...(listing?.images || [])].filter(Boolean))
  );

  const handleThumbnailClick = (img: string) => {
    if (img === activeImage) return;
    setActiveImage(img);
    setImageKey((prev) => prev + 1);
  };

  const statusClass =
    statusStyles[data.status] || "bg-[#ECEAE4] text-[#5F5F5F]";

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#101214]">
      <style>{`
        @keyframes coverFade {
          0% { opacity: 0; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .cover-animate { animation: coverFade 0.45s ease-out; }
        .thumb-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .thumb-hover:hover { transform: translateY(-3px); }
      `}</style>

      {/* Navbar */}
      <header className="border-b bg-[#00000098] backdrop:blur-2xl border-[#EDEAE2]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="https://world-elete-674262.webflow.io/" className="flex items-center gap-2 font-serif text-lg">
            <Image src={Logo} alt="logo" width={100} height={60}/>
          </Link>

          <span className="font-lato text-[11px] uppercase tracking-[0.2em] text-[#ffffff]">
            Promotion Request{listing?.ref_code ? ` · ${listing.ref_code}` : ""}
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text column */}
          <div className="flex flex-col justify-end gap-6">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${statusClass}`}
              >
                {data.status}
              </span>
              {listing?.ref_code && (
                <span className="font-lato text-[12px] tracking-wide text-[#000000]">
                  REF {listing.ref_code}
                </span>
              )}
            </div>

            <h1 className="font-playfair text-4xl leading-[1.1] sm:text-5xl">
              {listing?.title}
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-[#656A6D]">
              <MapPin size={14} />
              {[listing?.location?.city, listing?.location?.country]
                .filter(Boolean)
                .join(", ")}
            </p>

            <p className="font-serif text-3xl sm:text-4xl">
              {listing?.price?.amount?.toLocaleString?.() ?? listing?.price?.amount}{" "}
              <span className="font-mono text-sm tracking-wide text-[#9A9C99]">
                {listing?.price?.currency}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-6 border-t border-[#EDEAE2] pt-5 text-sm text-[#3F3F3F]">
              <span className="flex items-center gap-2">
                <Bed size={18} className="text-[#9A9C99]" />
                {listing?.bedrooms}{" "}
                <span className="font-mono text-[12px] tracking-wide text-[#000000]">
                  BEDROOMS
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Bath size={18} className="text-[#9A9C99]" />
                {listing?.bathrooms}{" "}
                <span className="font-mono text-[12px] tracking-wide text-[#000000]">
                  BATHROOMS
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Ruler size={18} className="text-[#9A9C99]" />
                {listing?.area_sqm} m²{" "}
                <span className="font-mono text-[12px] tracking-wide text-[#000000]">
                  AREA
                </span>
              </span>
            </div>
          </div>

          {/* Image column */}
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#EDEAE2]">
              {activeImage && (
                <Image
                  key={imageKey}
                  src={activeImage}
                  fill
                  alt={listing?.title || "listing"}
                  className="cover-animate object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {galleryImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleThumbnailClick(img)}
                    className={`thumb-hover relative aspect-square cursor-pointer overflow-hidden rounded-lg border ${
                      activeImage === img
                        ? "border-[#101214]"
                        : "border-[#EDEAE2]"
                    }`}
                  >
                    <Image
                      src={img}
                      fill
                      alt={`thumbnail-${idx}`}
                      className="object-cover"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promotion Details + Listing Information */}
      <section className="border-t border-[#EDEAE2] bg-[#F5F2EC]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-20">
          {/* Promotion Details */}
          <div>
            <h2 className="mt-2 font-playfair text-2xl">Promotion Details</h2>

            <dl className="mt-6 divide-y divide-[#63636336]">
              <Row
              
                label="TIER"
                value={
                  data.selected_tier
                    ? `Tier ${data.selected_tier.replace(/\D/g, "")}`
                    : "-"
                }
              />
              <Row
                label="COMMISSION"
                value={`${
                  data.confirmed_commission_pct ??
                  listing?.referral_commission?.offered_amount ??
                  "-"
                }%`}
              />
              <Row
                label="PRICE"
                value={`${listing?.price?.amount ?? "-"} ${
                  listing?.price?.currency ?? ""
                }`}
              />
              <Row label="STATUS" value={data.status} capitalize />
            </dl>
          </div>

          {/* Listing Information */}
          <div>
            <SectionEyebrow index="02" label="The Property" />
            <h2 className="mt-2 font-playfair text-2xl">Listing Information</h2>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Card
                icon={<span className="font-serif text-base">$</span>}
                title="Price"
                value={`${listing?.price?.amount ?? "-"} ${
                  listing?.price?.currency ?? ""
                }`}
              />
              <Card icon={<Bed size={15} />} title="Bedrooms" value={listing?.bedrooms} />
              <Card icon={<Bath size={15} />} title="Bathrooms" value={listing?.bathrooms} />
              <Card
                icon={<Ruler size={15} />}
                title="Area"
                value={`${listing?.area_sqm ?? "-"} m²`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-[#EDEAE2]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <SectionEyebrow index="03" label="Your Contact" />
          <h2 className="mt-2 font-serif text-2xl">
            {data.selected_tier === "tier_1" ? "Listing Owner" : "Promoter"}
          </h2>

          <div className="mt-6 grid gap-8 rounded-xl border border-[#EDEAE2] bg-white p-6 sm:p-8 lg:grid-cols-[1.2fr_1px_1fr] lg:gap-10">
            {/* Profile */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {owner?.profileImage ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={owner.profileImage}
                    fill
                    alt="profile"
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ) : (
                <InitialsAvatar name={owner?.fullName} />
              )}

              <div>
                <h3 className="font-serif text-xl">{owner?.fullName}</h3>

                {owner?.role && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[#656A6D]">
                    <span className="h-1.5 w-1.5 rounded-sm bg-[#D97757]" />
                    {owner.role.charAt(0).toUpperCase() + owner.role.slice(1)}
                  </p>
                )}

                {(owner?.brokerage && owner.brokerage !== "N/A") ||
                owner?.city ||
                owner?.country ? (
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#656A6D]">
                    {owner?.brokerage && owner.brokerage !== "N/A" && (
                      <span>{owner.brokerage}</span>
                    )}
                    {(owner?.city || owner?.country) && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {[owner?.city, owner?.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </p>
                ) : null}

                {owner?.bio && (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5F5F5F]">
                    {owner.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden bg-[#EDEAE2] lg:block" />

            {/* Get in touch */}
            <div>
              <p className="font-lato text-[12px] uppercase tracking-[0.2em] text-[#9A9C99]">
                Get in touch
              </p>

              <div className="mt-3 space-y-2">
                {owner?.email && (
                  <ContactRow
                    icon={<Mail size={15} />}
                    label={owner.email}
                    href={`mailto:${owner.email}`}
                  />
                )}
                {owner?.phone && (
                  <ContactRow
                    icon={<Phone size={15} />}
                    label={owner.phone}
                    href={`tel:${owner.phone}`}
                  />
                )}
                {/* {owner?.socialLinks?.facebook && (
                  <ContactRow
                    icon={<Facebook size={15} />}
                    label="Facebook"
                    href={owner.socialLinks.facebook}
                    external
                  />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#EDEAE2]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 font-mono text-[11px] uppercase tracking-wide text-[#9A9C99] sm:flex-row items-center justify-between sm:px-8">
          <span>© World Elite</span>
          <span>Confidential Promotion Link</span>
        </div>
      </footer>
    </div>
  );
}

function SectionEyebrow({ index, label }: { index: string; label: string }) {
  return (
    <span className="font-lato text-[14px] uppercase tracking-[0.2em] text-[#9A9C99]">
      {index} · {label}
    </span>
  );
}

function Row({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: any;
  capitalize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="font-lato text-[12px] tracking-wide text-[#0f0f0f]">
        {label}
      </dt>
      <dd
        className={`font-serif text-lg text-[#101214] ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex cursor-pointer items-center gap-3 rounded-lg border border-[#EDEAE2] bg-[#FBFAF8] px-4 py-3 transition hover:border-[#101214]"
    >
      <span className="md:flex hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#343536] text-white">
        {icon}
      </span>
      <span className="flex-1 truncate text-[12px] sm:text-sm text-[#101214]">{label}</span>
      <ArrowUpRight
        size={15}
        className="md:flex-1 hidden shrink-0 text-[#9A9C99] transition group-hover:text-[#101214]"
      />
    </a>
  );
}

const avatarPalette = [
  "#D97757",
  "#4C7A5C",
  "#3B5BA9",
  "#8A5A9E",
  "#B0733C",
  "#2E6B6B",
];

function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

function getAvatarColor(name?: string) {
  if (!name) return avatarPalette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarPalette[Math.abs(hash) % avatarPalette.length];
}

function InitialsAvatar({ name }: { name?: string }) {
  return (
    <div
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full font-serif text-xl text-white"
      style={{ backgroundColor: getAvatarColor(name) }}
    >
      {getInitials(name)}
    </div>
  );
}

function Card({
  icon,
  title,
  value,
}: {
  icon?: React.ReactNode;
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-lg border border-[#EDEAE2] bg-white p-4">
      <div className="flex items-center gap-1.5 font-mono text-[14px] uppercase tracking-wide text-[#5c5c5c]">
        {icon}
        {title}
      </div>
      <h3 className="mt-2 font-lato text-xl text-[#101214]">
        {value || "-"}
      </h3>
    </div>
  );
}