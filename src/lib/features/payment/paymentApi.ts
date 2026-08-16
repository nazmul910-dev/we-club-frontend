import api from "@/lib/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
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

export interface RegistrationPaymentDetails {
  alreadyPaid: boolean;
  user: {
    fullName: string;
    email: string;
    role: string;
    accessTo: string;
    durationMonths: number;
  };
  pricing?: RolePricingPlan;
  paymentStatus: string;
  message?: string;
}

export interface RegistrationPaymentDetailsResponse {
  success: boolean;
  message: string;
  data: RegistrationPaymentDetails;
}

export interface RegistrationCheckoutResponse {
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string;
    sessionId: string;
    user: Record<string, unknown>;
    originalPricing: RolePricingPlan;
    pricing: RolePricingPlan;
    discount: unknown;
  };
}

export const fetchRegistrationPaymentDetails = createAsyncThunk<
  RegistrationPaymentDetailsResponse,
  string,
  { rejectValue: string }
>(
  "payment/fetchRegistrationDetails",
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.get<RegistrationPaymentDetailsResponse>(
        `/payments/registration-link/${token}`
      );

      return res.data;
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
  RegistrationCheckoutResponse,
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

      return res.data;
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