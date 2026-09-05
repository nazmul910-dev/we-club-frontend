// Mirrors: server/src/modules/mentorBookings/mentor.booking.interface.ts

export const MENTOR_BOOKING_STATUSES = [
  "requested",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;

export type MentorBookingStatus = (typeof MENTOR_BOOKING_STATUSES)[number];

export type NoShowParty = "member" | "mentor" | "both";

export interface IUserSummary {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
}

export interface IMentorshipAvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface IMentorshipProfileSummary {
  _id: string;
  mentor?: IUserSummary;
  bio?: string;
  expertise?: string[];
  availability?: IMentorshipAvailabilitySlot[];
  profileImage?: string;
  sessionDurationMinutes?: number;
  isPrimaryMentor?: boolean;
  status?: string;
}

export interface IMentorBooking {
  _id: string;

  member: IUserSummary;

  leadMentor: IUserSummary;
  leadMentorProfile?: IMentorshipProfileSummary;

  coMentor?: IUserSummary | null;
  coMentorProfile?: IMentorshipProfileSummary | null;

  scheduledStartTime: string; // ISO
  scheduledEndTime: string; // ISO
  durationMinutes: number;
  timezone: string;

  meetingUrl?: string;
  sessionTopic?: string;
  notes?: string;

  status: MentorBookingStatus;

  cancellationReason?: string;
  cancelledBy?: IUserSummary | null;
  cancelledAt?: string;

  completedAt?: string;

  noShowAt?: string;
  noShowBy?: NoShowParty;
  noShowReason?: string;

  mentorFeedback?: string;

  recordingTitle?: string;
  recording?: IMentorBookingRecording;

  createdBy: IUserSummary;
  updatedBy?: IUserSummary | null;

  createdAt: string;
  updatedAt: string;
}

export interface IMentorBookingRecording {
  provider: "cloudinary";
  cloudinaryPublicId: string;
  cloudinaryAssetId?: string;
  secureUrl: string;
  playbackUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  format?: string;
  bytes?: number;
}

export interface ICreateMentorBookingPayload {
  leadMentor: string;
  leadMentorProfile?: string;

  coMentor?: string;
  coMentorProfile?: string;

  scheduledStartTime: string; // ISO 8601
  durationMinutes?: number;
  timezone: string;

  sessionTopic?: string;
  notes?: string;
  meetingUrl?: string;
}

export type IUpdateMentorBookingPayload = Partial<ICreateMentorBookingPayload>;

export interface ICancelMentorBookingPayload {
  reason: string;
}

export interface IMentorBookingQuery {
  status?: MentorBookingStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface IPaginatedBookings {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: IMentorBooking[];
}

// Response shape for GET /invictus/mentor-bookings/me/my-mentor
//
// - primaryMentor: the platform's single configured primary mentor — same
//   for every member, always present.
// - coMentor: the non-primary mentor this specific member selected for
//   themselves (typically at purchase/onboarding time). Null until they've
//   picked one via PATCH /invictus/mentorship-profiles/me/co_mentor.
// - nextSession: the member's soonest upcoming confirmed booking (or most
//   recent active booking as a fallback) — informational only, drives the
//   "book / join" card, and does NOT determine who the mentor/co_mentor are.
export interface IMentorPairing {
  mentor: IUserSummary;
  mentorProfile: IMentorshipProfileSummary;
}

export interface IMyMentorResponse {
  primaryMentor: IMentorPairing;
  coMentor: IMentorPairing | null;
  nextSession: IMentorBooking | null;
}

export interface ISelectCoMentorPayload {
  mentorshipProfileId: string;
}

export interface IMentorReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface IMentorReview {
  _id: string;
  rating: number;
  comment?: string;
  isAnonymous?: boolean;
  user?: { fullName?: string; role?: string };
  createdAt?: string;
}

export interface IMentorReviewsResponse {
  stats: IMentorReviewSummary;
  data: IMentorReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IConfirmMentorBookingPayload {
  sessionTopic: string;
  meetingUrl: string;
  notes?: string;
}

export interface INoShowMentorBookingPayload {
  noShowBy: NoShowParty;
  reason?: string;
}

// PATCH /:id/complete is multipart/form-data — recordingFile is the actual
// video, sent alongside these text fields. Only mentors/admins call this.
export interface ICompleteMentorBookingPayload {
  recordingTitle: string;
  mentorFeedback?: string;
  recordingFile: File;
}

export interface IApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}