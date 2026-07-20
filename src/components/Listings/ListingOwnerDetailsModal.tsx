"use client";

import Image from "next/image";
import { useState, useEffect, useRef, cloneElement, isValidElement } from "react";
import { createPortal } from "react-dom";
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  ShieldCheck,
  User,
  IdCard,
  X,
  FileText,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import ListingDetailsModal from "./ListingDetailsModal";



interface Props {
  owner: any;
  listing?: any;
  children: React.ReactElement<any>;
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:p-4">
      <div className="mb-1.5 flex items-center gap-2 text-[10px] uppercase tracking-wider text-gold sm:mb-2 sm:text-xs">
        {icon}
        {label}
      </div>

      <p className="break-words text-sm text-white">
        {value || "-"}
      </p>
    </div>
  );
}

export default function ListingOwnerDetailsModal({
  owner,
  listing,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Esc key দিয়ে close
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

  const modal = open && (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
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
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-xl border border-gold/20 bg-[#121212] p-4 text-white shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl">
            Listing Owner
          </h2>

          <div className="flex items-center gap-2 sm:gap-3">
            {listing && (
              <ListingDetailsModal listing={listing}>
                <button className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-gold/30 bg-gold/10 px-2.5 py-1.5 text-[11px] text-gold transition hover:bg-gold/20 sm:px-3 sm:text-xs">
                  <FileText size={13} />
                  <span className="hidden sm:inline">See Listing Details</span>
                  <span className="sm:hidden">Listing</span>
                </button>
              </ListingDetailsModal>
            )}

            <button
              onClick={() => setOpen(false)}
              className="shrink-0 cursor-pointer rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row">

          <div className="flex w-full flex-col items-center md:w-56 md:shrink-0 lg:w-64">

            <Image
              src={owner.profileImage}
              alt={owner.fullName}
              width={120}
              height={120}
              className="h-24 w-24 rounded-full border-4 border-gold object-cover sm:h-28 sm:w-28 md:h-32 md:w-32"
            />

            <h2 className="mt-3 text-center text-lg font-semibold sm:mt-4 sm:text-xl md:text-2xl">
              {owner.fullName}
            </h2>

            <p className="text-sm text-white/60 sm:text-base">
              {owner.role}
            </p>

            <Badge className="mt-2 bg-green-600 sm:mt-3">
              {owner.accountStatus}
            </Badge>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

            <Info icon={<Mail size={15} />} label="Email" value={owner.email} />
            <Info icon={<Phone size={15} />} label="Phone" value={owner.phone} />
            <Info icon={<Globe size={15} />} label="Country" value={owner.country} />
            <Info icon={<MapPin size={15} />} label="City" value={owner.city} />
            <Info icon={<Building2 size={15} />} label="Brokerage" value={owner.brokerage} />
            <Info icon={<IdCard size={15} />} label="License Number" value={owner.licenseNumber} />
            <Info icon={<ShieldCheck size={15} />} label="Approval Status" value={owner.approvalStatus} />
            <Info icon={<User size={15} />} label="Role" value={owner.role} />

          </div>

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