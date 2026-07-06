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
 
export const getPromoterProfile = createAsyncThunk<
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


export const listingsApi = {
  getListings,
  postListing,
  getMyPromoters,
  getPromoterProfile,
};
