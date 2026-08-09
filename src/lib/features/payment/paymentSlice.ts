import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api/api";
import axios from "axios";

export interface PricingItem {
  name: string;
  description: string;
  amountCents: number;
  amount: number;
  currency: string;
  interval: string;
  formattedAmount: string;
  billingText: string;
}

export interface RolePricingPlan {
  role: string;
  accessTo: string;
  displayName: string;
  requiresPayment: boolean;
  items: PricingItem[];
  totalFirstPaymentCents: number;
  totalFirstPayment: number;
  totalFirstPaymentFormatted: string;
}

export interface RegistrationPaymentUser {
  fullName: string;
  email: string;
  role: string;
  accessTo: string;
  durationMonths: number;
}

export interface RegistrationPaymentDetails {
  alreadyPaid: boolean;
  user: RegistrationPaymentUser;
  pricing?: RolePricingPlan;
  paymentStatus: string;
  message?: string;
}

export interface PendingRegistrationPayment {
  _id: string;
  token: string;
  status: string;
  stripeCheckoutSessionId?: string;
  paymentLink: string;
  createdAt: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    country?: string;
    brokerage?: string;
    role: string;
    accessTo: string;
    membershipDurationMonths?: number;
    paymentStatus: string;
    subscriptionStatus: string;
    approvalStatus: string;
    accountStatus: string;
    createdAt: string;
  } | null;
}

interface RegistrationPaymentDetailsResponse {
  success: boolean;
  message: string;
  data: RegistrationPaymentDetails;
}

interface RegistrationCheckoutResponse {
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string;
    sessionId: string;
  };
}

interface PendingRegistrationPaymentsResponse {
  success: boolean;
  message: string;
  data: PendingRegistrationPayment[];
}

interface SendRegistrationPaymentLinkResponse {
  success: boolean;
  message: string;
  data: {
    sent: boolean;
    email: string;
    paymentLink: string;
  };
}

interface PaymentState {
  details: RegistrationPaymentDetails | null;
  isDetailsLoading: boolean;
  detailsError: string | null;

  checkoutUrl: string | null;
  isCheckoutLoading: boolean;
  checkoutError: string | null;

  pendingRegistrations: PendingRegistrationPayment[];
  isPendingLoading: boolean;
  pendingError: string | null;

  sendingLinkId: string | null;
  sendLinkError: string | null;
}

const initialState: PaymentState = {
  details: null,
  isDetailsLoading: false,
  detailsError: null,

  checkoutUrl: null,
  isCheckoutLoading: false,
  checkoutError: null,

  pendingRegistrations: [],
  isPendingLoading: false,
  pendingError: null,

  sendingLinkId: null,
  sendLinkError: null,
};

export const fetchRegistrationPaymentDetails = createAsyncThunk<
  RegistrationPaymentDetails,
  string,
  { rejectValue: string }
>(
  "payment/fetchRegistrationDetails",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get<RegistrationPaymentDetailsResponse>(
        `/payments/registration-link/${token}`
      );

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to load payment details"
        );
      }

      return rejectWithValue("Unexpected error");
    }
  }
);

export const createRegistrationCheckout = createAsyncThunk<
  string,
  { token: string; discountCode?: string },
  { rejectValue: string }
>(
  "payment/createRegistrationCheckout",
  async ({ token, discountCode }, { rejectWithValue }) => {
    try {
      const res = await api.post<RegistrationCheckoutResponse>(
        `/payments/registration-link/${token}/checkout`,
        { discountCode }
      );

      return res.data.data.checkoutUrl;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to start checkout"
        );
      }

      return rejectWithValue("Unexpected error");
    }
  }
);

export const fetchPendingRegistrationPayments = createAsyncThunk<
  PendingRegistrationPayment[],
  void,
  { rejectValue: string }
>(
  "payment/fetchPendingRegistrationPayments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<PendingRegistrationPaymentsResponse>(
        "/payments/registration-pending"
      );

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to load pending payments"
        );
      }

      return rejectWithValue("Unexpected error");
    }
  }
);

export const sendRegistrationPaymentLink = createAsyncThunk<
  { linkId: string; email: string },
  string,
  { rejectValue: string }
>(
  "payment/sendRegistrationPaymentLink",
  async (linkId, { rejectWithValue }) => {
    try {
      const res = await api.post<SendRegistrationPaymentLinkResponse>(
        `/payments/registration-link/${linkId}/send`
      );

      return { linkId, email: res.data.data.email };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to send payment link"
        );
      }

      return rejectWithValue("Unexpected error");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: () => initialState,

    setCheckoutError: (state, action: PayloadAction<string | null>) => {
      state.checkoutError = action.payload;
    },

    setSendLinkError: (state, action: PayloadAction<string | null>) => {
      state.sendLinkError = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrationPaymentDetails.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchRegistrationPaymentDetails.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.details = action.payload;
      })
      .addCase(fetchRegistrationPaymentDetails.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError = action.payload ?? "Failed to load payment details";
      })

      .addCase(createRegistrationCheckout.pending, (state) => {
        state.isCheckoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(createRegistrationCheckout.fulfilled, (state, action) => {
        state.isCheckoutLoading = false;
        state.checkoutUrl = action.payload;
      })
      .addCase(createRegistrationCheckout.rejected, (state, action) => {
        state.isCheckoutLoading = false;
        state.checkoutError = action.payload ?? "Checkout failed";
      })

      .addCase(fetchPendingRegistrationPayments.pending, (state) => {
        state.isPendingLoading = true;
        state.pendingError = null;
      })
      .addCase(fetchPendingRegistrationPayments.fulfilled, (state, action) => {
        state.isPendingLoading = false;
        state.pendingRegistrations = action.payload;
      })
      .addCase(fetchPendingRegistrationPayments.rejected, (state, action) => {
        state.isPendingLoading = false;
        state.pendingError = action.payload ?? "Failed to load pending payments";
      })

      .addCase(sendRegistrationPaymentLink.pending, (state, action) => {
        state.sendingLinkId = action.meta.arg;
        state.sendLinkError = null;
      })
      .addCase(sendRegistrationPaymentLink.fulfilled, (state, action) => {
        state.sendingLinkId = null;

        const link = state.pendingRegistrations.find(
          (item) => item._id === action.payload.linkId
        );

        if (link) {
          link.status = "checkout_created";
        }
      })
      .addCase(sendRegistrationPaymentLink.rejected, (state, action) => {
        state.sendingLinkId = null;
        state.sendLinkError = action.payload ?? "Failed to send payment link";
      });
  },
});

export const { resetPaymentState, setCheckoutError, setSendLinkError } =
  paymentSlice.actions;

export default paymentSlice.reducer;