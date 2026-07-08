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
  totalPage: number;
}

export interface Promoter {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  tier: "tier_1" | "tier_2" | "tier_3";
  totalListingsCount: number;
  listingPrices: { ammount: number; currency: string }[];
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

interface ListQueryParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

const getListings = createAsyncThunk<
  ListingsApiResponse,
  ListQueryParams | void,
  { rejectValue: string }
>("listings/getListings", async (query, { rejectWithValue }) => {
  try {
    const res = await api.get("/listings", {
      params: query,
    });

    return res.data as ListingsApiResponse;
  } catch (err: any) {
    console.log(err?.response?.data ?? err);
    return rejectWithValue("Failed to fetch listings");
  }
});

interface PaginationParams {
  page?: number;
  limit?: number;
}

const getMyListings = createAsyncThunk<
  ListingsApiResponse,
  PaginationParams | void
>("listings/my", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get("/listings/my", {
      params,
    });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to fetch my listings",
    );
  }
});
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
  PaginationParams | void
>(
  "listings/promote-requests/received",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/listings/promote-request/received", {
        params,
      });
      return res.data as PromoteRequestsApiResponse;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to fetch promote requests",
      );
    }
  },
);
const getMySentPromoteRequests = createAsyncThunk<
  PromoteRequestsApiResponse,
  PaginationParams | void
>(
  "listings/promote-requests/sent",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/listings/promote-request/sent", {
        params,
      });

      return res.data as PromoteRequestsApiResponse;
    } catch (err: any) {
      console.log(err?.response?.data ?? err);

      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to fetch sent promote requests",
      );
    }
  },
);

// const manageListing =

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
  {
    id: string;
    status: "approved" | "rejected";
    selected_tier?: "tier_1" | "tier_2" | "tier_3";
  },
  { rejectValue: string }
>(
  "listings/promote-requests/manage",
  async ({ id, status, selected_tier = "tier_1" }, { rejectWithValue }) => {
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
        err.response?.data?.message ?? "Failed to fetch promoters",
      );
    }
  },
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
>("listings/getPromoterProfile", async (userId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data as PromoterProfileApiResponse;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message ?? "Failed to fetch promoter profile",
    );
  }
});

const cencelPendingListing = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("listings/cancelPendingListing", async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/listings/cancel/${id}`);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message ?? "Failed to cancel pending listing",
    );
  }
});

const deletePendingListing = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("listings/cancelPendingListing", async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/listings/delete/${id}`);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message ?? "Failed to delete pending listing",
    );
  }
});

// ── Add these to your existing lib/features/listings/listingsApi.ts ──

// Admin/manager: browse every listing regardless of owner, with the same
// {data, meta} shape as getListings — reuses GET "/" but keeps its own
// action type so it can live in its own slice of state (`adminListings`)
// without fighting with whatever getListings already populates elsewhere.
const getAllListingsForAdmin = createAsyncThunk<
  ListingsApiResponse,
  ListQueryParams | void,
  { rejectValue: string }
>("listings/admin/getAll", async (query, { rejectWithValue }) => {
  try {
    const res = await api.get("/listings", { params: query ?? {} });
    return res.data as ListingsApiResponse;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to fetch listings",
    );
  }
});

// Admin/manager: approve or reject a listing.
// POST /listings/manage/:id — verifyAdmin on the backend, so this call will
// 403 for non-admins; the UI should also hide the buttons for non-admins.
export const manageListingStatus = createAsyncThunk<
  any,
  { id: string; status: "active" | "rejected" },
  { rejectValue: string }
>(
  "listings/admin/manageStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/listings/manage/${id}`, { status });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ?? "Failed to update listing status",
      );
    }
  },
);

// Admin (or owner, per your backend's isOwner/isAdmin check): permanently
// delete a listing. This is the HARD delete (DELETE /listings/:id) — distinct
// from cencelPendingListing/deletePendingListing, which are soft-delete/status
// flips via PATCH. Use this one for the admin table's "Delete" action.
export const deleteListing = createAsyncThunk<
  string, // return the deleted id so the reducer can splice it out of state
  string,
  { rejectValue: string }
>("listings/admin/deleteHard", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/listings/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message ?? "Failed to delete listing",
    );
  }
});

// Then add all three into your existing `listingsApi` export object:
// export const listingsApi = {
//   ...,
//   getAllListingsForAdmin,
//   manageListingStatus,
//   deleteListingHard,
// };

export const listingsApi = {
  getListings,
  postListing,
  getMyPromoters,
  getPromoterProfile,
  getMyListings,
  getMyListingPromoteRequests,
  getMySentPromoteRequests,
  cancelPromoteRequest,
  deletePromoteRequest,
  managePromoteRequest,
  cencelPendingListing,
  deletePendingListing,
  getAllListingsForAdmin,
  manageListingStatus,
  deleteListing,
};
