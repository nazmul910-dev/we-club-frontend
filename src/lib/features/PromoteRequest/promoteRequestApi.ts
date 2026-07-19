import api from "@/lib/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";


export interface PublicPromoteRequestDetails {
  id: string;
  status: "pending" | "approved" | "rejected";
  selected_tier: string;
  requested_at: string;
  resolved_at: string | null;
  proposed_commission_pct: number;
  confirmed_commission_pct: number;

  listing: {
    id: string;
    title: string;
    ref_code: string;
    status: string;
    cover_image: string;
    images: string[];
    price: any;
    location: any;
    bedrooms: number;
    bathrooms: number;
    area_sqm: number;
    referral_commission: number;
  } | null;

  listing_owner: {
    fullName: string;
    email: string;
    phone: string;
    licenseNumber: string;
    brokerage: string;
    profileImage: string;
    city: string;
    country: string;
    bio: string;
    socialLinks: any;
    role: string;
  } | null;

  promoter: {
    fullName: string;
    email: string;
    phone: string;
    licenseNumber: string;
    brokerage: string;
    profileImage: string;
    city: string;
    country: string;
    bio: string;
    socialLinks: any;
    role: string;
  } | {
    email: string;
  };
}


interface PublicPromoteRequestResponse {
  success: boolean;
  message: string;
  data: PublicPromoteRequestDetails;
}

export interface CreatePromoteRequestPayload {
  listing_id: string;
  proposed_commission_pct: number;
  marketing_channels: string[];
  message: string;
}

// A structured error shape so callers can branch on *what kind* of failure
// happened, not just display a string.
export interface ApiError {
  message: string;
  status?: number; // HTTP status code, if the server responded at all
  code?: string; // your backend's own error code, if it sends one (e.g. "DUPLICATE_REQUEST")
  fieldErrors?: Record<string, string>; // per-field validation messages, if any
}

function toApiError(err: any, fallback: string): ApiError {
  // No response at all → network failure, timeout, CORS, server unreachable
  if (!err.response) {
    return { message: "Network error. Check your connection and try again." };
  }

  const status = err.response.status;
  const body = err.response.data;

  return {
    message: body?.message ?? fallback,
    status,
    code: body?.code,
    fieldErrors: body?.errors, // adjust key name to match your backend's validation error shape
  };
}

export interface PromoteRequest {
  _id: string;
  listing_id: {
    _id: string;
    title: string;
    ref_code: string;
    cover_image: string;
    price: { amount: number; currency: string };
  } | null;
  requester: { user_id: string; email: string };
  proposed_commission_pct: number;
  marketing_channels: string[];
  message: string;
  status: "pending" | "approved" | "rejected";
  selected_tier?: string;
  requested_at: string;
  resolved_at: string | null;
  is_deleted: boolean;
}

interface PromoteRequestsMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Matches the { success, message, data: { data, meta } } envelope used across the API
interface PromoteRequestsListResponse {
  success: boolean;
  message: string;
  data: {
    data: PromoteRequest[];
    meta: PromoteRequestsMeta;
  };
}

interface CreatePromoteRequestResponse {
  success: boolean;
  message: string;
  data: PromoteRequest;
}

// Create a new promote request for a listing.
const createPromoteRequest = createAsyncThunk<
  PromoteRequest,
  CreatePromoteRequestPayload,
  { rejectValue: ApiError }
>(
  "promoteRequests/createPromoteRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post<CreatePromoteRequestResponse>(
        "/listings/promote-request", // TODO: confirm this matches your real route
        payload
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(toApiError(err, "Failed to send promote request"));
    }
  }
);

// Requests I've sent (as a promoter/associate).
// const getMyPromoteRequests = createAsyncThunk<
//   PromoteRequestsListResponse["data"],
//   Record<string, unknown> | void,
//   { rejectValue: ApiError }
// >(
//   "promoteRequests/getMyPromoteRequests",
//   async (query, { rejectWithValue }) => {
//     try {
//       const res = await api.get<PromoteRequestsListResponse>(
//         "/promote-requests/my", // TODO: confirm this matches your real route
//         { params: query ?? {} }
//       );
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         toApiError(err, "Failed to fetch your promote requests")
//       );
//     }
//   }
// );

// Requests received on my listings (as a listing owner).
const getReceivedPromoteRequests = createAsyncThunk<
  PromoteRequestsListResponse["data"],
  Record<string, unknown> | void,
  { rejectValue: ApiError }
>(
  "promoteRequests/getReceivedPromoteRequests",
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get<PromoteRequestsListResponse>(
        "/listings/promote-request/received", // TODO: confirm this matches your real route
        { params: query ?? {} }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        toApiError(err, "Failed to fetch received promote requests")
      );
    }
  }
);


const getPublicPromoteRequestDetails = createAsyncThunk<
  PublicPromoteRequestDetails,
  string,
  { rejectValue: ApiError }
>(
  "promoteRequests/getPublicPromoteRequestDetails",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get<PublicPromoteRequestResponse>(
        `/listings/promote-request/public/${id}`
      );

      return res.data.data;

    } catch (err: any) {
      return rejectWithValue(
        toApiError(
          err,
          "Failed to fetch promote request details"
        )
      );
    }
  }
);


export const promoteRequestApi = {
  createPromoteRequest,
//   getMyPromoteRequests,
  getReceivedPromoteRequests,
  getPublicPromoteRequestDetails,
};