import type { RetreatBatch, RetreatLocationRef } from "@/types/retreat";
import type {
  RetreatBooking,
  RetreatBookingStatus,
  RetreatBookingUser,
  RetreatEmergencyContact,
} from "@/lib/features/retreat/retreatTypes";

export const getBookingMember = (
  user: RetreatBooking["user"],
): RetreatBookingUser | null => {
  if (!user || typeof user === "string") return null;
  return user;
};

export const getBookingBatch = (
  batch: RetreatBooking["retreatBatch"],
): RetreatBatch | null => {
  if (!batch || typeof batch === "string") return null;
  return batch;
};

export const getBookingLocation = (
  location: RetreatBooking["retreatLocation"],
): RetreatLocationRef | null => {
  if (!location || typeof location === "string") return null;
  return location;
};

export const formatMoney = (amount: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

export const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateRange = (start?: string, end?: string) => {
  if (!start && !end) return "—";
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  return formatDate(start || end);
};

export const formatEmergencyContact = (
  contact?: RetreatEmergencyContact | string,
) => {
  if (!contact) return "—";
  if (typeof contact === "string") return contact || "—";
  const parts = [contact.name, contact.phone, contact.relationship].filter(
    Boolean,
  );
  return parts.length > 0 ? parts.join(" · ") : "—";
};

export const STATUS_LABELS: Record<RetreatBookingStatus, string> = {
  waitlisted: "Request",
  invited: "Invited",
  payment_pending: "Payment pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};
