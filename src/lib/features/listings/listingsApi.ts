import api from "@/lib/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface Listing {
  id: string;
  [key: string]: any;
}

interface ListingsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Promoter {
  user_id : string;
  name: string;
  email: string;
  phone: string;
  tier : "tier_1" | "tier_2" | "tier_3";
  totalListingsCount: number;
  listingPrices : {ammount : number, currency : string}[];
}

interface PromotersApiResponse {
  success: boolean;
  message: string;
  data: Promoter[];
}

// Matches the real API envelope: { success, message, data: { data, meta } }
interface ListingsApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Listing[];
    meta: ListingsMeta;
  };
}

const getListings = createAsyncThunk<ListingsApiResponse, void>(
  "/listings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/listings");
      return res.data as ListingsApiResponse;
    } catch (err) {
      console.log(err);
      return rejectWithValue("Failed to fetch listings");
    }
  },
);

const getMyListings = createAsyncThunk<ListingsApiResponse, void>(
  "listings/my",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/listings/my");
      return res.data as ListingsApiResponse;
    } catch (err: any) {
      console.log(err?.response?.data ?? err);
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to fetch my listings",
      );
    }
  },
);

interface PromoteRequestsApiResponse {
  success: boolean;
  message: string;
  data: {
    data: any[];
    meta: any;
  };
}

const getMyListingPromoteRequests = createAsyncThunk<
  PromoteRequestsApiResponse,
  void
>(
  "listings/promote-requests/received",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/listings/promote-request/received");
      return res.data as PromoteRequestsApiResponse;
    } catch (err: any) {
      console.log(err?.response?.data ?? err);
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to fetch promote requests",
      );
    }
  },
);

export const cancelPromoteRequest = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("listings/promote-requests/cancel", async (id, { rejectWithValue }) => {
  try {
    const res = await api.put(`/listings/promote-request/${id}`);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to cancel promote request",
    );
  }
});

export const deletePromoteRequest = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("listings/promote-requests/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/listings/promote-request/${id}`);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to delete promote request",
    );
  }
});

export const managePromoteRequest = createAsyncThunk<
  any,
  { id: string; status: "approved" | "rejected"; selected_tier?: "tier_1" | "tier_2" | "tier_3" },
  { rejectValue: string }
>("listings/promote-requests/manage", async ({ id, status, selected_tier = "tier_1" }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/listings/promote-request/manage/${id}`, {
      status,
      selected_tier,
    });
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to manage promote request",
    );
  }
});

export const postListing = createAsyncThunk<
  Listing,
  FormData,
  { rejectValue: string }
>("listings/postListing", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/listings", formData);

    // Return only the created listing
    return res.data.data;
  } catch (err: any) {
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);
    console.log("Errors:", err.response?.data?.errors);

    return rejectWithValue(
      err.response?.data?.message ?? "Failed to create listing",
    );
  }
});


 const getMyPromoters = createAsyncThunk<PromotersApiResponse, void>(
  "listings/getMyPromoters",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/listings/my-promoters");
      return res.data as PromotersApiResponse;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch promoters"
      );
    }
  }
);

export interface PromoterProfile {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  licenseNumber?: string;
  brokerage?: string;
  marketingChannels?: string[];
  bio?: string;
}
 
interface PromoterProfileApiResponse {
  success: boolean;
  message: string;
  data: PromoterProfile;
}
 
 const getPromoterProfile = createAsyncThunk<
  PromoterProfileApiResponse,
  string // user_id
>(
  "listings/getPromoterProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}`);
      return res.data as PromoterProfileApiResponse;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to fetch promoter profile"
      );
    }
  }
);


const cencelPendingListing = createAsyncThunk<any, string, { rejectValue: string }>(
  "listings/cancelPendingListing",
  async (id , { rejectWithValue }) => {  
    try{
      const res = await api.patch(`/listings/cancel/${id}`, );
      return res.data.data;
    }catch(err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to cancel pending listing"
      );
    }
    
  })
  
const deletePendingListing = createAsyncThunk<any, string, { rejectValue: string }>(
  "listings/cancelPendingListing",
  async (id , { rejectWithValue }) => {  
    try{
      const res = await api.patch(`/listings/delete/${id}`, );
      return res.data.data;
    }catch(err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to delete pending listing"
      );
    }
    
  })



export const listingsApi = {
  getListings,
  postListing,
  getMyPromoters,
  getPromoterProfile,
  getMyListings,
  getMyListingPromoteRequests,
  cancelPromoteRequest,
  deletePromoteRequest,
  managePromoteRequest,
  cencelPendingListing,
  deletePendingListing
};
