// Adjust this import to wherever your project's configured axios instance lives
// (the one with baseURL + auth token interceptor already attached).

import api from "@/lib/api/api";
import { IApiEnvelope, ICancelMentorBookingPayload, ICompleteMentorBookingPayload, IConfirmMentorBookingPayload, ICreateMentorBookingPayload, IMentorBooking, IMentorBookingQuery, IMentorshipProfileSummary, IMyMentorResponse, IMentorReviewsResponse, INoShowMentorBookingPayload, IPaginatedBookings, ISelectCoMentorPayload, IUpdateMentorBookingPayload } from "./mentorBookingTypes";


const BASE_URL = "/invictus/mentor-bookings";
const MENTORSHIP_PROFILES_URL = "/invictus/mentorship-profiles";

export const mentorBookingApi = {
  // POST /me — member requests a new booking
  create: async (
    payload: ICreateMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.post<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/me`,
      payload,
    );
    return data.data;
  },

  // GET /me — member's own bookings (filter by status/date range for
  // "upcoming" vs "history")
  fetchMyBookings: async (
    query: IMentorBookingQuery = {},
  ): Promise<IPaginatedBookings> => {
    const { data } = await api.get<IApiEnvelope<IPaginatedBookings>>(
      `${BASE_URL}/me`,
      { params: query },
    );
    return data.data;
  },

  // GET /me/:id — single booking detail
  fetchMySingleBooking: async (id: string): Promise<IMentorBooking> => {
    const { data } = await api.get<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/me/${id}`,
    );
    return data.data;
  },

  // PATCH /me/:id — member edits their own (not-yet-confirmed) booking
  updateMyBooking: async (
    id: string,
    payload: IUpdateMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/me/${id}`,
      payload,
    );
    return data.data;
  },

  // PATCH /me/:id/cancel — member cancels their own booking
  cancelMyBooking: async (
    id: string,
    payload: ICancelMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/me/${id}/cancel`,
      payload,
    );
    return data.data;
  },

  // GET /:id — admin/mentor fetches a single booking by id (any status)
  fetchSingleBookingAdmin: async (id: string): Promise<IMentorBooking> => {
    const { data } = await api.get<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/${id}`,
    );
    return data.data;
  },

  // PATCH /:id/confirm — mentor/admin confirms a requested booking,
  // providing the session title + meeting link (notes optional)
  confirmBooking: async (
    id: string,
    payload: IConfirmMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/${id}/confirm`,
      payload,
    );
    return data.data;
  },

  // PATCH /:id/cancel — mentor/admin cancels a booking (distinct from the
  // member-scoped /me/:id/cancel)
  cancelBooking: async (
    id: string,
    payload: ICancelMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/${id}/cancel`,
      payload,
    );
    return data.data;
  },

  // PATCH /:id/no-show — mentor/admin marks a confirmed booking as a no-show
  markNoShow: async (
    id: string,
    payload: INoShowMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/${id}/no-show`,
      payload,
    );
    return data.data;
  },

  // PATCH /:id/complete — mentor/admin marks a booking complete.
  // multipart/form-data: the recording file + title (+ optional feedback).
  completeBooking: async (
    id: string,
    payload: ICompleteMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const formData = new FormData();
    formData.append("recording", payload.recordingFile);
    formData.append("recordingTitle", payload.recordingTitle);
    if (payload.mentorFeedback) {
      formData.append("mentorFeedback", payload.mentorFeedback);
    }

    const { data } = await api.patch<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/${id}/complete`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
  },

  // GET /me/my-mentor — resolves the member's primary mentor + selected
  // co_mentor + next session
  fetchMyMentor: async (): Promise<IMyMentorResponse> => {
    const { data } = await api.get<IApiEnvelope<IMyMentorResponse>>(
      `${BASE_URL}/me/my-mentor`,
    );
    return data.data;
  },

  // PATCH /invictus/mentorship-profiles/me/co_mentor — member selects a
  // non-primary mentorship profile as their co_mentor
  selectCoMentor: async (
    payload: ISelectCoMentorPayload,
  ): Promise<unknown> => {
    const { data } = await api.patch<IApiEnvelope<unknown>>(
      `${MENTORSHIP_PROFILES_URL}/me/co_mentor`,
      payload,
    );
    return data.data;
  },

  fetchAvailableCoMentors: async (): Promise<IMentorshipProfileSummary[]> => {
    const { data } = await api.get<IApiEnvelope<IMentorshipProfileSummary[]>>(
      MENTORSHIP_PROFILES_URL,
    );
    return data.data;
  },

  fetchPublishedMentors: async (): Promise<IMentorshipProfileSummary[]> => {
    const { data } = await api.get<IApiEnvelope<IMentorshipProfileSummary[]>>(
      MENTORSHIP_PROFILES_URL,
    );
    return data.data;
  },

  fetchMentorReviews: async (
    mentorId: string,
  ): Promise<IMentorReviewsResponse> => {
    const { data } = await api.get<IApiEnvelope<IMentorReviewsResponse>>(
      `/invictus/mentorship-reviews/mentor/${mentorId}`,
      { params: { page: 1, limit: 5 } },
    );
    return data.data;
  },

  // GET / — admin list (all bookings, paginated + filterable)
  fetchAdminBookings: async (
    query: IMentorBookingQuery = {},
  ): Promise<IPaginatedBookings> => {
    const { data } = await api.get<IApiEnvelope<IPaginatedBookings>>(
      BASE_URL,
      { params: query },
    );
    return data.data;
  },
};