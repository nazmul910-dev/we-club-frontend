import api from "@/lib/api/api";
import { Retreat, RetreatBatch } from "@/types/retreat";
import {
  CancelRetreatBookingPayload,
  ConfirmRetreatBookingPayload,
  IApiEnvelope,
  ICreateRetreatBatchPayload,
  ICreateRetreatLocationPayload,
  InviteRetreatBookingPayload,
  IPaginatedRetreatBatches,
  IPaginatedRetreatLocations,
  IRetreatBatch,
  IRetreatBatchQuery,
  IRetreatLocation,
  IRetreatLocationQuery,
  IUpdateRetreatBatchPayload,
  IUpdateRetreatLocationPayload,
  LocationFormSubmitPayload,
  PaginatedRetreatBookings,
  RefundRetreatBookingPayload,
  RetreatBooking,
  RetreatBookingQuery,
} from "./retreatTypes";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    totalPages: number;
  };
}

const LOCATIONS_URL = "/invictus/retreat-locations";
const BATCHES_URL = "/invictus/retreat-batches";


export const retreatLocationApi = {
  // GET / — list, filterable by status/isActive/isFeatured/search
  fetchAll: async (
    query: IRetreatLocationQuery = {},
  ): Promise<IPaginatedRetreatLocations> => {
    const { data } = await api.get<
      IApiEnvelope<IPaginatedRetreatLocations>
    >(LOCATIONS_URL, { params: query });
    return data.data;
  },

  // GET /:idOrSlug
  fetchOne: async (idOrSlug: string): Promise<IRetreatLocation> => {
    const { data } = await api.get<IApiEnvelope<IRetreatLocation>>(
      `${LOCATIONS_URL}/${idOrSlug}`,
    );
    return data.data;
  },

  // POST /
  create: async (
    payload: LocationFormSubmitPayload,
  ): Promise<IRetreatLocation> => {
    const form = new FormData();

    form.append("title", payload.title);
    form.append("country", payload.country);
    form.append("city", payload.city);
    form.append("description", payload.description);

    if (payload.slug) form.append("slug", payload.slug);
    if (payload.tagline) form.append("tagline", payload.tagline);
    if (payload.status) form.append("status", payload.status);
    if (payload.order !== undefined) form.append("order", String(payload.order));
    if (payload.isFeatured !== undefined)
      form.append("isFeatured", String(payload.isFeatured));
    if (payload.isActive !== undefined)
      form.append("isActive", String(payload.isActive));
    if (payload.whatsIncluded?.length)
      form.append("whatsIncluded", JSON.stringify(payload.whatsIncluded));

    if (payload.coverImageFile) {
      form.append("coverImage", payload.coverImageFile);
    }
    payload.galleryFiles?.forEach((file) => {
      form.append("gallery", file);
    });
    if (payload.promoVideoFile) {
      form.append("promoVideo", payload.promoVideoFile);
    }

    const { data } = await api.post<IApiEnvelope<IRetreatLocation>>(
      LOCATIONS_URL,
      form,
    );
    return data.data;
  },

  update: async (
    id: string,
    payload: IUpdateRetreatLocationPayload,
  ): Promise<IRetreatLocation> => {
    const form = new FormData();

    if (payload.title !== undefined) form.append("title", payload.title);
    if (payload.slug !== undefined) form.append("slug", payload.slug);
    if (payload.country !== undefined) form.append("country", payload.country);
    if (payload.city !== undefined) form.append("city", payload.city);
    if (payload.tagline !== undefined) form.append("tagline", payload.tagline);
    if (payload.description !== undefined)
      form.append("description", payload.description);

    if (payload.status !== undefined) form.append("status", payload.status);
    if (payload.order !== undefined) form.append("order", String(payload.order));
    if (payload.isFeatured !== undefined)
      form.append("isFeatured", String(payload.isFeatured));
    if (payload.isActive !== undefined)
      form.append("isActive", String(payload.isActive));

    if (payload.whatsIncluded !== undefined) {
      form.append("whatsIncluded", JSON.stringify(payload.whatsIncluded));
    }

    if (payload.galleryImages !== undefined) {
      form.append("galleryImages", JSON.stringify(payload.galleryImages));
    }
    if (payload.replaceGallery !== undefined) {
      form.append("replaceGallery", String(payload.replaceGallery));
    }

    // Clear without new file
    if (payload.coverImage === null) {
      form.append("coverImage", "null");
    }
    if (payload.promoVideoUrl === null) {
      form.append("promoVideoUrl", "null");
    }

    // New files
    if (payload.coverImageFile) {
      form.append("coverImage", payload.coverImageFile);
    }
    payload.galleryFiles?.forEach((file) => {
      form.append("gallery", file);
    });
    if (payload.promoVideoFile) {
      form.append("promoVideo", payload.promoVideoFile);
    }

    const { data } = await api.patch<IApiEnvelope<IRetreatLocation>>(
      `${LOCATIONS_URL}/${id}`,
      form,
    );
    return data.data;
  },

  // DELETE /:id
  remove: async (id: string): Promise<void> => {
    await api.delete<IApiEnvelope<null>>(`${LOCATIONS_URL}/${id}`);
  },
};


export const retreatBatchApi = {
  // GET / — list, filterable by location/status/date range/search
  fetchAll: async (
    query: IRetreatBatchQuery = {},
  ): Promise<IPaginatedRetreatBatches> => {
    const { data } = await api.get<IApiEnvelope<IPaginatedRetreatBatches>>(
      BATCHES_URL,
      { params: query },
    );
    return data.data;
  },

  // GET /:idOrSlug
  fetchOne: async (idOrSlug: string): Promise<IRetreatBatch> => {
    const { data } = await api.get<IApiEnvelope<IRetreatBatch>>(
      `${BATCHES_URL}/${idOrSlug}`,
    );
    return data.data;
  },

  // POST /
  create: async (
    payload: ICreateRetreatBatchPayload,
  ): Promise<IRetreatBatch> => {
    const { data } = await api.post<IApiEnvelope<IRetreatBatch>>(
      BATCHES_URL,
      payload,
    );
    return data.data;
  },

  // PATCH /:id
  update: async (
    id: string,
    payload: IUpdateRetreatBatchPayload,
  ): Promise<IRetreatBatch> => {
    const { data } = await api.patch<IApiEnvelope<IRetreatBatch>>(
      `${BATCHES_URL}/${id}`,
      payload,
    );
    return data.data;
  },

  // DELETE /:id
  remove: async (id: string): Promise<void> => {
    await api.delete<IApiEnvelope<null>>(`${BATCHES_URL}/${id}`);
  },
};


export const getFeaturedRetreat = async (): Promise<Retreat> => {
  const response = await api.get<{ data: PaginatedResponse<Retreat> }>(
    "/invictus/retreat-locations",
    { params: { status: "published", isActive: true, limit: 1 } },
  );

  const retreat = response.data.data.data[0];
  if (!retreat) throw new Error("No featured retreat found");
  return retreat;
};

export const getRetreatBatches = async (
  locationId: string,
): Promise<RetreatBatch[]> => {
  const response = await api.get<{ data: PaginatedResponse<RetreatBatch> }>(
    "/invictus/retreat-batches",
    { params: { locationId, limit: 20 } },
  );

  return response.data.data.data;
};

export const getRetreatLocations = async (): Promise<Retreat[]> => {
  const response = await api.get<{ data: PaginatedResponse<Retreat> }>(
    "/invictus/retreat-locations",
    { params: { status: "published", isActive: true, limit: 100 } },
  );
  return response.data.data.data;
};

export const getRetreatBatchesForLocations = async (
  locationIds: string[],
): Promise<RetreatBatch[]> => {
  const response = await api.get<{ data: PaginatedResponse<RetreatBatch> }>(
    "/invictus/retreat-batches",
    {
      params: {
        locationIds: locationIds.join(","),
        isActive: true,
        includePast: true,
        limit: 20 * locationIds.length,
      },
    },
  );
  return response.data.data.data;
};

// ---- Member booking actions ----

export const createBooking = async (
  retreatBatch: string,
): Promise<RetreatBooking> => {
  const response = await api.post("/invictus/retreat-bookings/me", { retreatBatch });
  return response.data.data;
};

export const getMyBookings = async (): Promise<RetreatBooking[]> => {
  const response = await api.get<{ data: PaginatedResponse<RetreatBooking> }>(
    "/invictus/retreat-bookings/me",
  );
  return response.data.data.data;
};

export const getMyBooking = async (bookingId: string): Promise<RetreatBooking> => {
  const response = await api.get(`/invictus/retreat-bookings/me/${bookingId}`);
  return response.data.data;
};

export const updateMyBooking = async (
  bookingId: string,
  payload: Partial<Pick<RetreatBooking, "notes" | "specialRequests" | "dietaryRequirements" | "emergencyContact">>,
): Promise<RetreatBooking> => {
  const response = await api.patch(`/invictus/retreat-bookings/me/${bookingId}`, payload);
  return response.data.data;
};

export const cancelMyBooking = async (
  bookingId: string,
  reason: string,
): Promise<RetreatBooking> => {
  const response = await api.patch(`/invictus/retreat-bookings/me/${bookingId}/cancel`, { reason });
  return response.data.data;
};

export const createCheckoutSession = async (
  bookingId: string,
  successUrl?: string,
  cancelUrl?: string,
): Promise<{ bookingId: string; stripeCheckoutSessionId: string; checkoutUrl: string }> => {
  const response = await api.post(`/invictus/retreat-bookings/me/${bookingId}/checkout`, {
    successUrl,
    cancelUrl,
  });
  return response.data.data;
};

export const verifyPayment = async (
  sessionId: string,
): Promise<{ paid: boolean; message: string; booking?: RetreatBooking }> => {
  const response = await api.post("/invictus/retreat-bookings/verify-payment", { sessionId });
  return response.data.data;
};

const ADMIN_BOOKINGS_URL = "/invictus/retreat-bookings";

export const getAdminRetreatBookings = async (
  query: RetreatBookingQuery = {},
): Promise<PaginatedRetreatBookings> => {
  const response = await api.get<{ data: PaginatedRetreatBookings }>(
    ADMIN_BOOKINGS_URL,
    { params: query },
  );
  return response.data.data;
};

export const getAdminRetreatBooking = async (
  bookingId: string,
): Promise<RetreatBooking> => {
  const response = await api.get<{ data: RetreatBooking }>(
    `${ADMIN_BOOKINGS_URL}/${bookingId}`,
  );
  return response.data.data;
};

export const inviteRetreatBooking = async (
  bookingId: string,
  payload: InviteRetreatBookingPayload = {},
): Promise<RetreatBooking> => {
  const response = await api.patch<{ data: RetreatBooking }>(
    `${ADMIN_BOOKINGS_URL}/${bookingId}/invite`,
    payload,
  );
  return response.data.data;
};

export const confirmRetreatBookingAdmin = async (
  bookingId: string,
  payload: ConfirmRetreatBookingPayload = {},
): Promise<RetreatBooking> => {
  const response = await api.patch<{ data: RetreatBooking }>(
    `${ADMIN_BOOKINGS_URL}/${bookingId}/confirm`,
    payload,
  );
  return response.data.data;
};

export const cancelRetreatBookingAdmin = async (
  bookingId: string,
  payload: CancelRetreatBookingPayload,
): Promise<RetreatBooking> => {
  const response = await api.patch<{ data: RetreatBooking }>(
    `${ADMIN_BOOKINGS_URL}/${bookingId}/cancel`,
    payload,
  );
  return response.data.data;
};

export const refundRetreatBookingAdmin = async (
  bookingId: string,
  payload: RefundRetreatBookingPayload = {},
): Promise<RetreatBooking> => {
  const response = await api.patch<{ data: RetreatBooking }>(
    `${ADMIN_BOOKINGS_URL}/${bookingId}/refund`,
    payload,
  );
  return response.data.data;
};
