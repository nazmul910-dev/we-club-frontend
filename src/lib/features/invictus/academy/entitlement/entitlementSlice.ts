import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { entitlementApi } from "./entitlementApi";
import type { IPillarAccessResult, IUserEntitlement } from "./entitlementTypes";

interface EntitlementState {
  myEntitlements: IUserEntitlement[];
  // pillarId -> access check result
  pillarAccessById: Record<string, IPillarAccessResult>;
  loading: boolean;
  error: string | null;
}

const initialState: EntitlementState = {
  myEntitlements: [],
  pillarAccessById: {},
  loading: false,
  error: null,
};

export const fetchMyEntitlements = createAsyncThunk(
  "entitlement/getMine",
  async () => {
    const res = await entitlementApi.getMine();
    return res.data;
  },
);

export const checkPillarAccess = createAsyncThunk(
  "entitlement/checkPillarAccess",
  async (pillarId: string) => {
    const res = await entitlementApi.checkPillarAccess(pillarId);
    return { pillarId, result: res.data };
  },
);

const entitlementSlice = createSlice({
  name: "entitlement",
  initialState,
  reducers: {
    clearEntitlementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEntitlements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEntitlements.fulfilled, (state, action) => {
        state.loading = false;
        state.myEntitlements = action.payload || [];
      })
      .addCase(fetchMyEntitlements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading your entitlements";
      })

      .addCase(checkPillarAccess.fulfilled, (state, action) => {
        state.pillarAccessById[action.payload.pillarId] = action.payload.result;
      })
      .addCase(checkPillarAccess.rejected, (state, action) => {
        state.error = action.error.message || "Failed checking pillar access";
      });
  },
});

export const { clearEntitlementError } = entitlementSlice.actions;
export default entitlementSlice.reducer;