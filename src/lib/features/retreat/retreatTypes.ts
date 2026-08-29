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
