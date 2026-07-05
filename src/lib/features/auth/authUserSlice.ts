import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DecodedUser } from "@/lib/utils/auth";
import api from "@/lib/api/api";
import axios from "axios";

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  accessTo: "we_command_center" | "invictus" | "both";
  profileImage?: string;
  brokerage?: string;
  city?: string;
  country?: string;
  bio?: string;
}

interface AuthUserState {
  user: DecodedUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isProfileLoading: boolean;
}

const initialState: AuthUserState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isProfileLoading: false,
};

export const fetchCurrentUserProfile = createAsyncThunk<UserProfile, string, { rejectValue: string }>(
  "users/fetchProfile",
  async (userId, { rejectWithValue }) => {

    try {
      const res = await api.get(`/users/${userId}`);
      return res.data.data as UserProfile;
    } catch (err) {
      if (axios.isAxiosError(err)) {

        return rejectWithValue(err.response?.data?.message || "Failed to load profile");
      }
      console.error("Unexpected error:", err);
      return rejectWithValue("Unexpected error");
    }
  }
);

const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<DecodedUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserProfile.pending, (state) => {
        state.isProfileLoading = true;
      })
      .addCase(fetchCurrentUserProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCurrentUserProfile.rejected, (state) => {
        state.isProfileLoading = false;
      });
  },
});

export const { setUser, logout } = authUserSlice.actions;
export default authUserSlice.reducer;