import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { invictusPaymentApi } from "./invictusPaymentApi";
import type {
  IInvictusCheckoutResponse,
  IMyInvictusPurchase,
  IPaymentPlan,
} from "./invictusPaymentTypes";

interface InvictusPaymentState {
  // Stripe checkout
  checkoutLoading: boolean;
  checkoutError: string | null;
  checkoutResult: IInvictusCheckoutResponse | null;

  // My purchases
  myPurchases: IMyInvictusPurchase[];
  purchasesLoading: boolean;
  purchasesError: string | null;

  // Payment plans (keyed by productType for caching)
  plansByProductType: Record<string, IPaymentPlan[]>;
  plansLoading: boolean;
  plansError: string | null;
}

const initialState: InvictusPaymentState = {
  checkoutLoading: false,
  checkoutError: null,
  checkoutResult: null,

  myPurchases: [],
  purchasesLoading: false,
  purchasesError: null,

  plansByProductType: {},
  plansLoading: false,
  plansError: null,
};

/** Create a Stripe checkout session → returns `{ checkoutUrl, sessionId }` */
export const createInvictusCheckout = createAsyncThunk(
  "invictusPayment/createCheckout",
  async (
    payload: string | { paymentPlanId?: string; pillarId?: string; discountCode?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await invictusPaymentApi.createCheckoutSession(payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create checkout session"
      );
    }
  }
);

/** Fetch my Invictus purchases */
export const fetchMyInvictusPurchases = createAsyncThunk(
  "invictusPayment/fetchMyPurchases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await invictusPaymentApi.getMyPurchases();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch purchases"
      );
    }
  }
);

/** Fetch active payment plans for a given productType (e.g. "pillar") */
export const fetchPaymentPlansByProductType = createAsyncThunk(
  "invictusPayment/fetchPlansByProductType",
  async (
    params: { productType: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await invictusPaymentApi.getPaymentPlansByProduct({
        productType: params.productType,
        status: params.status ?? "active",
      });
      return { productType: params.productType, plans: res.data };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch payment plans"
      );
    }
  }
);

const invictusPaymentSlice = createSlice({
  name: "invictusPayment",
  initialState,
  reducers: {
    clearCheckoutResult(state) {
      state.checkoutResult = null;
      state.checkoutError = null;
    },
    clearCheckoutError(state) {
      state.checkoutError = null;
    },
  },
  extraReducers: (builder) => {
    // --- Create Checkout ---
    builder
      .addCase(createInvictusCheckout.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
        state.checkoutResult = null;
      })
      .addCase(createInvictusCheckout.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutResult = action.payload;
      })
      .addCase(createInvictusCheckout.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.payload as string;
      });

    // --- My Purchases ---
    builder
      .addCase(fetchMyInvictusPurchases.pending, (state) => {
        state.purchasesLoading = true;
        state.purchasesError = null;
      })
      .addCase(fetchMyInvictusPurchases.fulfilled, (state, action) => {
        state.purchasesLoading = false;
        state.myPurchases = action.payload || [];
      })
      .addCase(fetchMyInvictusPurchases.rejected, (state, action) => {
        state.purchasesLoading = false;
        state.purchasesError = action.payload as string;
      });

    // --- Payment Plans ---
    builder
      .addCase(fetchPaymentPlansByProductType.pending, (state) => {
        state.plansLoading = true;
        state.plansError = null;
      })
      .addCase(fetchPaymentPlansByProductType.fulfilled, (state, action) => {
        state.plansLoading = false;
        state.plansByProductType[action.payload.productType] =
          action.payload.plans || [];
      })
      .addCase(fetchPaymentPlansByProductType.rejected, (state, action) => {
        state.plansLoading = false;
        state.plansError = action.payload as string;
      });
  },
});

export const { clearCheckoutResult, clearCheckoutError } =
  invictusPaymentSlice.actions;
export default invictusPaymentSlice.reducer;
