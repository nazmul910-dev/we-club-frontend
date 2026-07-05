import api from "@/lib/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RegistrationFormData } from "./authSlice";
import { decodeToken } from "@/lib/utils/auth";
import { setUser } from "./authUserSlice";

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: Record<string, unknown>;
    checkoutUrl: string | null;
    sessionId: string | null;
    pricing: unknown;
    originalPricing?: unknown;
    discount?: unknown;
    message: string;
  };
}

export type SignupPayload = Omit<RegistrationFormData, 'discountCode'> & {
  discountCode?: string;
};

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: Record<string, unknown>;
    token: string;
    refreshToken?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk<
  SignupResponse,
  SignupPayload,
  { rejectValue: string }
>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post<SignupResponse>(
        "/auth/signup",
        payload
      );

      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Registration failed"
        );
      }

      return rejectWithValue("Unexpected error");
    }
  }
);

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>(
  "auth/login",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post<LoginResponse>(
        "/auth/login",
        payload
      );

      if (res.data.data.token) {
        localStorage.setItem("token", res.data.data.token);
        if (res.data.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.data.refreshToken);
        }

        const decoded = decodeToken(res.data.data.token);
        if (decoded) {
          dispatch(setUser(decoded));
        }
      }

      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Login failed"
        );
      }

      return rejectWithValue("Unexpected error");
    }
  }
);

