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
>(
  "listings/postListing",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/listings", formData);

      // Return only the created listing
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ?? "Failed to create listing"
      );
    }
  }
);
export const listingsApi = {
  getListings,
  postListing,
};
