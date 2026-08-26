export type Retreat = {
  _id: string;
  title: string;
  slug: string;
  country: string;
  city: string;
  tagline: string;
  description: string;
  coverImage: string;
  promoVideoUrl?: string;
  galleryImages: string[];
  whatsIncluded: string[];
  isFeatured: boolean;
  isActive: boolean;
  status: "draft" | "published" | "archived" | string;
  order: number;
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
};

/**
 * Not part of the schema you shared — dates and seat counts aren't fields on
 * the retreat object yet. Passed in separately so the page still renders
 * correctly (badge + CTA just omit what's missing) until those fields exist.
 */
export type RetreatSchedule = {
  dateLabel?: string; // e.g. "October 12–17, 2026"
  seatsRemaining?: number;
  seatsTotal?: number;
};

export type RetreatBatch = {
  _id: string;
  batchName: string;
  slug: string;
  startDate: string;
  endDate: string;
  capacity: number;
  confirmedBookingsCount: number;
  waitlistCount: number;
  price: number;
  currency: string;
  status: string;
  isFeatured: boolean;
  isActive: boolean;
};

export interface RetreatBooking {
  _id: string;
  retreatBatch: string | { _id: string };
  status:
    | "waitlisted"
    | "invited"
    | "payment_pending"
    | "confirmed"
    | "cancelled"
    | "refunded";
  createdAt: string;
}