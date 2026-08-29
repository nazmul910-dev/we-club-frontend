import api from "@/lib/api/api";

import {
  IApiEnvelope,
  ICancelMentorBookingPayload,
  ICompleteMentorBookingPayload,
  IConfirmMentorBookingPayload,
  ICreateMentorBookingPayload,
  IMentorBooking,
  IMentorBookingQuery,
  IMyMentorResponse,
  INoShowMentorBookingPayload,
  IPaginatedBookings,
  ISelectCoMentorPayload,
  IUpdateMentorBookingPayload,
} from "./mentorBookingTypes";

const BASE_URL = "/invictus/mentor-bookings";
const MENTORSHIP_PROFILES_URL = "/invictus/mentorship-profiles";

export const mentorBookingApi = {
  // ============================================================
  // MEMBER APIs
  // ============================================================

  // POST /me
  create: async (
    payload: ICreateMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.post<IApiEnvelope<IMentorBooking>>(
      `${BASE_URL}/me`,
      payload,
    );

    return data.data;
  },

  // GET /me
  fetchMyBookings: async (
    query: IMentorBookingQuery = {},
  ): Promise<IPaginatedBookings> => {
    const { data } = await api.get<
      IApiEnvelope<IPaginatedBookings>
    >(`${BASE_URL}/me`, {
      params: query,
    });

    return data.data;
  },

  // GET /me/:id
  fetchMySingleBooking: async (
    id: string,
  ): Promise<IMentorBooking> => {
    const { data } = await api.get<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/me/${id}`);

    return data.data;
  },

  // PATCH /me/:id
  updateMyBooking: async (
    id: string,
    payload: IUpdateMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/me/${id}`, payload);

    return data.data;
  },

  // PATCH /me/:id/cancel
  cancelMyBooking: async (
    id: string,
    payload: ICancelMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/me/${id}/cancel`, payload);

    return data.data;
  },

  // PATCH /:id/complete
  completeBooking: async (
    id: string,
    payload: ICompleteMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const formData = new FormData();

    formData.append(
      "recording",
      payload.recordingFile,
    );

    formData.append(
      "recordingTitle",
      payload.recordingTitle,
    );

    if (payload.mentorFeedback) {
      formData.append(
        "mentorFeedback",
        payload.mentorFeedback,
      );
    }

    const { data } = await api.patch<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/${id}/complete`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.data;
  },

  // GET /me/my-mentor
  fetchMyMentor: async (): Promise<IMyMentorResponse> => {
    const { data } = await api.get<
      IApiEnvelope<IMyMentorResponse>
    >(`${BASE_URL}/me/my-mentor`);

    return data.data;
  },

  // PATCH /mentorship-profiles/me/co-mentor
  selectCoMentor: async (
    payload: ISelectCoMentorPayload,
  ): Promise<unknown> => {
    const { data } = await api.patch<
      IApiEnvelope<unknown>
    >(`${MENTORSHIP_PROFILES_URL}/me/co-mentor`, payload);

    return data.data;
  },

  // ============================================================
  // ADMIN / MANAGER APIs
  // ============================================================

  // GET /invictus/mentor-bookings
  fetchAllBookings: async (
    query: IMentorBookingQuery = {},
  ): Promise<IPaginatedBookings> => {
    const { data } = await api.get<
      IApiEnvelope<IPaginatedBookings>
    >(BASE_URL, {
      params: query,
    });

    return data.data;
  },

  // GET /invictus/mentor-bookings/:id
  fetchBooking: async (
    id: string,
  ): Promise<IMentorBooking> => {
    const { data } = await api.get<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/${id}`);

    return data.data;
  },

  // PATCH /invictus/mentor-bookings/:id
  updateBooking: async (
    id: string,
    payload: IUpdateMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/${id}`, payload);

    return data.data;
  },

  // PATCH /invictus/mentor-bookings/:id/confirm
  confirmBooking: async (
    id: string,
    payload: IConfirmMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/${id}/confirm`, payload);

    return data.data;
  },

  // PATCH /invictus/mentor-bookings/:id/cancel
  cancelBooking: async (
    id: string,
    payload: ICancelMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/${id}/cancel`, payload);

    return data.data;
  },

  // PATCH /invictus/mentor-bookings/:id/no-show
  markNoShow: async (
    id: string,
    payload: INoShowMentorBookingPayload,
  ): Promise<IMentorBooking> => {
    const { data } = await api.patch<
      IApiEnvelope<IMentorBooking>
    >(`${BASE_URL}/${id}/no-show`, payload);

    return data.data;
  },
};