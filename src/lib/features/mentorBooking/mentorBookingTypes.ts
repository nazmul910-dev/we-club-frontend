export const MENTOR_BOOKING_STATUSES = [
  "requested",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;

export type MentorBookingStatus =
  (typeof MENTOR_BOOKING_STATUSES)[number];

export type NoShowParty = "member" | "mentor" | "both";

export interface IUserSummary {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
  city?: string;
  country?: string;
}

export interface IMentorshipProfileSummary {
  _id: string;

  mentor?: IUserSummary;

  bio?: string;
  expertise?: string[];

  availability?: {
    day: string;
    startTime: string;
    endTime: string;
    timezone: string;
  }[];

  profileImage?: string;

  sessionDurationMinutes?: number;

  isPrimaryMentor?: boolean;
  isActive?: boolean;
  status?: string;
}

export interface IMentorBooking {
  _id: string;

  member: IUserSummary;

  leadMentor: IUserSummary;
  leadMentorProfile?: IMentorshipProfileSummary;

  coMentor?: IUserSummary | null;
  coMentorProfile?: IMentorshipProfileSummary | null;

  scheduledStartTime: string;
  scheduledEndTime: string;

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

  recording?: {
    provider: "cloudinary";
    cloudinaryPublicId: string;
    cloudinaryAssetId?: string;
    secureUrl: string;
    playbackUrl?: string;
    thumbnailUrl?: string;
    durationSeconds?: number;
    format?: string;
    bytes?: number;
  };

  createdBy: IUserSummary;

  updatedBy?: IUserSummary | null;

  createdAt: string;
  updatedAt: string;
}

export interface ICreateMentorBookingPayload {
  leadMentor: string;
  leadMentorProfile?: string;

  coMentor?: string;
  coMentorProfile?: string;

  scheduledStartTime: string;

  durationMinutes?: number;

  timezone: string;

  sessionTopic?: string;

  notes?: string;

  meetingUrl?: string;
}

export interface IUpdateMentorBookingPayload {
  leadMentor?: string;
  leadMentorProfile?: string;

  coMentor?: string | null;
  coMentorProfile?: string | null;

  scheduledStartTime?: string;

  durationMinutes?: number;

  timezone?: string;

  sessionTopic?: string;

  notes?: string;

  meetingUrl?: string | null;
}

export interface IConfirmMentorBookingPayload {
  sessionTopic: string;
  meetingUrl: string;
  notes?: string;
}

export interface ICancelMentorBookingPayload {
  reason: string;
}

export interface INoShowMentorBookingPayload {
  noShowBy: NoShowParty;
  reason?: string;
}

export interface ICompleteMentorBookingPayload {
  recordingTitle: string;
  mentorFeedback?: string;
  recordingFile: File;
}

export interface IMentorBookingQuery {
  memberId?: string;
  leadMentorId?: string;
  coMentorId?: string;
  mentorId?: string;

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

export interface IApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}