import { RetreatBatch, RetreatLocationRef } from "@/types/retreat";

export type RetreatBookingStatus =
  | "waitlisted"
  | "invited"
  | "payment_pending"
  | "confirmed"
  | "cancelled"
  | "refunded";

export const RETREAT_BOOKING_STATUSES: RetreatBookingStatus[] = [
  "waitlisted",
  "invited",
  "payment_pending",
  "confirmed",
  "cancelled",
  "refunded",
];

export type RetreatBookingUser = {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
  profileImage?: string;
  phone?: string;
  city?: string;
  country?: string;
};

export type RetreatEmergencyContact = {
  name?: string;
  phone?: string;
  relationship?: string;
};

export type RetreatBooking = {
  _id: string;
  user: string | RetreatBookingUser;
  retreatBatch: string | RetreatBatch;
  retreatLocation: string | RetreatLocationRef;
  status: RetreatBookingStatus;
  amount: number;
  amountPaid?: number;
  currency: string;
  notes?: string;
  specialRequests?: string;
  dietaryRequirements?: string;
  emergencyContact?: RetreatEmergencyContact | string;
  invitationExpiresAt?: string;
  stripeCheckoutSessionId?: string;
  checkoutUrl?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  refundReason?: string;
  confirmedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  paid?: boolean;
};

export type RetreatBookingQuery = {
  userId?: string;
  batchId?: string;
  locationId?: string;
  status?: RetreatBookingStatus;
  search?: string;
  page?: number;
  limit?: number;
};

export type RetreatBookingListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedRetreatBookings = {
  data: RetreatBooking[];
  meta: RetreatBookingListMeta;
};

export type InviteRetreatBookingPayload = {
  invitationExpiresInHours?: number;
  notes?: string;
};

export type ConfirmRetreatBookingPayload = {
  amountPaid?: number;
  notes?: string;
};

export type CancelRetreatBookingPayload = {
  reason: string;
};

export type RefundRetreatBookingPayload = {
  refundAmount?: number;
  reason?: string;
};

export type RetreatBookingStatusCounts = {
  waitlisted: number;
  invited: number;
  payment_pending: number;
  confirmed: number;
};


// Mirrors:
//   server/src/modules/retreatLocations/retreat.location.interface.ts
//   server/src/modules/retreatBatches/retreat.batch.interface.ts

export const RETREAT_LOCATION_STATUSES = [
  "draft",
  "published",
  "archived",
] as const;

export type RetreatLocationStatus = (typeof RETREAT_LOCATION_STATUSES)[number];

export const RETREAT_BATCH_STATUSES = [
  "upcoming",
  "open",
  "sold_out",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type RetreatBatchStatus = (typeof RETREAT_BATCH_STATUSES)[number];

export interface IUserSummary {
  _id: string;
  fullName: string;
  email: string;
}

export interface IRetreatLocation {
  _id: string;

  title: string;
  slug: string;
  country: string;
  city: string;

  tagline?: string;
  description: string;

  coverImage?: string;
  promoVideoUrl?: string;
  galleryImages: string[];
  whatsIncluded: string[];

  isFeatured: boolean;
  isActive: boolean;
  status: RetreatLocationStatus;
  order: number;

  createdBy: IUserSummary | string;
  updatedBy?: IUserSummary | string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ICreateRetreatLocationPayload {
  title: string;
  slug?: string;
  country: string;
  city: string;

  tagline?: string;
  description: string;

  whatsIncluded?: string[];

  isFeatured?: boolean;
  isActive?: boolean;
  status?: RetreatLocationStatus;
  order?: number;
}

/** Files + optional clear/keep fields for multipart create & update */
export type LocationFormSubmitPayload = ICreateRetreatLocationPayload & {
  coverImageFile?: File | null;
  galleryFiles?: File[];
  promoVideoFile?: File | null;
  /** Existing gallery URLs to keep (edit). Sent as JSON string. */
  galleryImages?: string[];

  /** If true on update, gallery becomes only newly uploaded files. */
  replaceGallery?: boolean;

  /**
   * Set to null on update to clear cover / promo when no new file is chosen.
   * (Not used as a URL input anymore.)
   */
  coverImage?: string | null;
  promoVideoUrl?: string | null;
};

export type IUpdateRetreatLocationPayload = Partial<LocationFormSubmitPayload>;
export interface IRetreatLocationQuery {
  status?: RetreatLocationStatus;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// A retreat batch's location can come back either populated (object) or as
// a bare id string, depending on the endpoint — callers should narrow before
// reading nested fields.
export interface IRetreatLocationSummary {
  _id: string;
  title: string;
  slug: string;
  country: string;
  city: string;
  coverImage?: string;
}

export interface IRetreatBatch {
  _id: string;

  retreatLocation: IRetreatLocationSummary | string;

  batchName: string;
  slug: string;

  startDate: string;
  endDate: string;

  capacity: number;
  confirmedBookingsCount: number;
  waitlistCount: number;

  price: number;
  depositAmount?: number;
  currency: string;

  status: RetreatBatchStatus;
  isFeatured: boolean;
  isActive: boolean;

  bookingDeadline?: string;
  description?: string;
  notes?: string;

  createdBy: IUserSummary | string;
  updatedBy?: IUserSummary | string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ICreateRetreatBatchPayload {
  retreatLocation: string;
  batchName: string;
  slug?: string;

  startDate: string; // ISO 8601
  endDate: string; // ISO 8601

  capacity: number;
  price: number;
  depositAmount?: number;
  currency?: string;

  status?: RetreatBatchStatus;
  isFeatured?: boolean;
  isActive?: boolean;

  bookingDeadline?: string;
  description?: string;
  notes?: string;
}

export type IUpdateRetreatBatchPayload = Partial<ICreateRetreatBatchPayload>;

export interface IRetreatBatchQuery {
  locationId?: string;
  locationIds?: string;
  includePast?: boolean;
  status?: RetreatBatchStatus;
  isActive?: boolean;
  isFeatured?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IPaginatedRetreatLocations {
  meta: IPaginationMeta;
  data: IRetreatLocation[];
}

export interface IPaginatedRetreatBatches {
  meta: IPaginationMeta;
  data: IRetreatBatch[];
}

export interface IApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}