import api from "@/lib/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "../users/user.types";

export interface PromoterListingSummary {
  listing_id: string;
  listing_title: string;
  listing_price: number;
  listing_owner_id: string;
  promotion_request_id: string;
  tier: "tier_1" | "tier_2" | "tier_3";
  approved_by: string;
  approved_at: string;
  status: string;
}

export interface Promoter {
  _id: string;
  // May come back as a raw id string or populated with profile fields —
  // handled either way in the normalizer.
  user_id:
    | string
    | {
        _id: string;
        fullName?: string;
        email?: string;
        city?: string;
        country?: string;
        brokerage?: string;
        [key: string]: any;
      };
  listings: PromoterListingSummary[];
  profile_views: number;
  createdAt: string;
  updatedAt: string;
  user? : IUser
}

interface PromotersMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface PromotersApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Promoter[];
    meta: PromotersMeta;
  };
}

interface PromotersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort? : string;
  [key: string]: any;
}

const getPromoters = createAsyncThunk<
  PromotersApiResponse["data"],
  PromotersQueryParams | void,
  { rejectValue: string }
>("promoters/getPromoters", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get<PromotersApiResponse>("/promoters", { params });
    
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to fetch promoters"
    );
  }
});

const incrementPromoterView = createAsyncThunk<any, string, { rejectValue: string }>(
  "listings/incrementView",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/promoters/${id}/view`);
      return res.data.data;
    } catch (err: any) {
      // Silently fail — a missed view-count write shouldn't disrupt anything
      // the user is doing; there's nothing worth showing an error for here.
      return rejectWithValue(err?.response?.data?.message ?? "Failed to record view");
    }
  }
);


export const promotersApi = { getPromoters, incrementPromoterView };