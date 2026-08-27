// Adjust this import to wherever your project's configured axios instance lives
// (the one with baseURL + auth token interceptor already attached).

import api from "@/lib/api/api";
import { IApiEnvelope, ICancelMentorBookingPayload, ICompleteMentorBookingPayload, ICreateMentorBookingPayload, IMentorBooking, IMentorBookingQuery, IMyMentorResponse, IPaginatedBookings, ISelectCoMentorPayload, IUpdateMentorBookingPayload } from "./mentorBookingTypes";


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
  // co-mentor + next session
  fetchMyMentor: async (): Promise<IMyMentorResponse> => {
    const { data } = await api.get<IApiEnvelope<IMyMentorResponse>>(
      `${BASE_URL}/me/my-mentor`,
    );
    return data.data;
  },

  // PATCH /invictus/mentorship-profiles/me/co-mentor — member selects a
  // non-primary mentorship profile as their co-mentor
  selectCoMentor: async (
    payload: ISelectCoMentorPayload,
  ): Promise<unknown> => {
    const { data } = await api.patch<IApiEnvelope<unknown>>(
      `${MENTORSHIP_PROFILES_URL}/me/co-mentor`,
      payload,
    );
    return data.data;
  },
};