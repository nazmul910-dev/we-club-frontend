import api from "@/lib/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export type PromoteRequestStatus =
  | "pending"
  | "owner_approved"
  | "approved"
  | "rejected"
  | "promoter_rejected"
  | "cancelled";

export type PromoterAgreementStatus =
  | "not_started"
  | "pending"
  | "accepted"
  | "rejected";

export type PromotionTier =
  | "tier_1"
  | "tier_2"
  | "tier_3";

export interface PromoteRequestWorkflow {
  waiting_for_owner: boolean;
  waiting_for_promoter_decision: boolean;
  can_accept_owner_terms: boolean;
  can_reject_owner_terms: boolean;
  promoter_accepted: boolean;
  promoter_rejected: boolean;
  permanently_blocked_from_requesting_again: boolean;
}

export interface PromoteRequest {
  _id: string;

  listing_id: {
    _id: string;
    title: string;
    ref_code: string;
    cover_image: string;
    price: {
      amount: number;
      currency: string;
    };
    referral_commission?: {
      offered_amount?: number;
    };
  } | null;

  requester: {
    user_id:
      | string
      | {
          _id: string;
          fullName?: string;
          email?: string;
          profileImage?: string;
        };
    email: string;
  };

  proposed_commission_pct: number;
  confirmed_commission_pct?: number;

  marketing_channels: string[];
  message?: string;

  status: PromoteRequestStatus;

  promoter_agreement_status: PromoterAgreementStatus;

  selected_tier?: PromotionTier | null;

  promoter_website_url?: string;
  marketing_document_url?: string;
  access_url?: string;

  promoter_rejection_reason?: string;

  requested_at: string;
  owner_approved_at?: string;
  promoter_accepted_at?: string;
  promoter_rejected_at?: string;
  resolved_at?: string | null;

  is_deleted: boolean;

  workflow?: PromoteRequestWorkflow;
}

export interface CreatePromoteRequestPayload {
  listing_id: string;
  proposed_commission_pct: number;
  marketing_channels: string[];
  message: string;
}

export interface RespondToOwnerTermsPayload {
  id: string;
  decision: "accepted" | "rejected";

  promoter_website_url?: string;
  marketing_document_url?: string;
  rejection_reason?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  fieldErrors?: Record<string, string>;
}

function toApiError(
  err: any,
  fallback: string,
): ApiError {
  if (!err.response) {
    return {
      message:
        "Network error. Check your connection and try again.",
    };
  }

  const status = err.response.status;
  const body = err.response.data;

  return {
    message: body?.message ?? fallback,
    status,
    code: body?.code,
    fieldErrors: body?.errors,
  };
}

interface PromoteRequestsMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface PromoteRequestsListResponse {
  success: boolean;
  message: string;

  data: {
    data: PromoteRequest[];
    meta: PromoteRequestsMeta;
  };
}

interface PromoteRequestResponse {
  success: boolean;
  message: string;
  data: PromoteRequest;
}

const createPromoteRequest = createAsyncThunk<
  PromoteRequest,
  CreatePromoteRequestPayload,
  { rejectValue: ApiError }
>(
  "promoteRequests/createPromoteRequest",
  async (payload, { rejectWithValue }) => {
    try {
      const res =
        await api.post<PromoteRequestResponse>(
          "/listings/promote-request",
          payload,
        );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        toApiError(
          err,
          "Failed to send promote request",
        ),
      );
    }
  },
);

const getReceivedPromoteRequests = createAsyncThunk<
  PromoteRequestsListResponse["data"],
  Record<string, unknown> | void,
  { rejectValue: ApiError }
>(
  "promoteRequests/getReceivedPromoteRequests",
  async (query, { rejectWithValue }) => {
    try {
      const res =
        await api.get<PromoteRequestsListResponse>(
          "/listings/promote-request/received",
          {
            params: query ?? {},
          },
        );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        toApiError(
          err,
          "Failed to fetch received promote requests",
        ),
      );
    }
  },
);

/**
 * Logged-in promoter-এর পাঠানো requests
 */
const getMyPromoteRequests = createAsyncThunk<
  PromoteRequestsListResponse["data"],
  Record<string, unknown> | void,
  { rejectValue: ApiError }
>(
  "promoteRequests/getMyPromoteRequests",
  async (query, { rejectWithValue }) => {
    try {
      const res =
        await api.get<PromoteRequestsListResponse>(
          "/listings/promote-request/sent",
          {
            params: query ?? {},
          },
        );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        toApiError(
          err,
          "Failed to fetch your promote requests",
        ),
      );
    }
  },
);


const respondToOwnerTerms = createAsyncThunk<
  PromoteRequest,
  RespondToOwnerTermsPayload,
  { rejectValue: ApiError }
>(
  "promoteRequests/respondToOwnerTerms",
  async (
    {
      id,
      decision,
      promoter_website_url,
      marketing_document_url,
      rejection_reason,
    },
    { rejectWithValue },
  ) => {
    try {
      const body = {
        decision,

        ...(promoter_website_url
          ? { promoter_website_url }
          : {}),

        ...(marketing_document_url
          ? { marketing_document_url }
          : {}),

        ...(rejection_reason
          ? { rejection_reason }
          : {}),
      };

      const res =
        await api.patch<PromoteRequestResponse>(
          `/listings/promote-request/${id}/accept-owner-terms`,
          body,
        );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        toApiError(
          err,
          "Failed to respond to the listing owner's terms",
        ),
      );
    }
  },
);

export const promoteRequestApi = {
  createPromoteRequest,
  getReceivedPromoteRequests,
  getMyPromoteRequests,
  respondToOwnerTerms,
};