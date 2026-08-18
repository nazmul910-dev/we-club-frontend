import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import api from "@/lib/api/api";

import {
  IUser,
  ApprovalStatus,
  AccountStatus,
  LicenseVerificationStatus,
} from "@/types/user-managemetn";

interface UsersResponse {
  success: boolean;

  message: string;

  data: IUser[];
}

interface GetAllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  approvalStatus? : string
}

// GET ALL USERS

export const getAllUsers = createAsyncThunk<
  { users: IUser[]; meta: { page: number; limit: number; total: number; totalPage: number } },
  GetAllUsersParams | void,
  { rejectValue: string }
>(
  "users/getAllUsers",

  async (params, { rejectWithValue }) => {

    

    try {
      const res = await api.get("/users", {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          ...(params?.search ? { search: params.search } : {}),
          ...(params?.role ? { role: params.role } : {}),
          ...(params?.approvalStatus ? { approvalStatus: params.approvalStatus } : {}),
        },
      });

      return {
        users: res.data.data.data,
        meta: res.data.data.meta,
      };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Failed");
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

// UPDATE APPROVAL STATUS

export const updateApprovalStatus = createAsyncThunk<
  IUser,
  {
    id: string;
    approvalStatus: ApprovalStatus;
    rejectedReason?: string;
  },
  {
    rejectValue: string;
  }
>(
  "users/updateApproval",

  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/admin/users/${payload.id}/approval-status`,
        {
          approvalStatus: payload.approvalStatus,
          rejectedReason:
            payload.approvalStatus === "rejected"
              ? "Admin not satisfied"
              : undefined,
        },
      );

      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Approval update failed",
        );
      }

      return rejectWithValue("Something went wrong");
    }
  },
);

// UPDATE LICENSE

export const updateLicenseStatus = createAsyncThunk<
  IUser,
  {
    id: string;
    licenseVerificationStatus: LicenseVerificationStatus;
  },
  {
    rejectValue: string;
  }
>(
  "users/updateLicense",

  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/admin/users/${payload.id}/license-verification-status`,

        {
          licenseVerificationStatus: payload.licenseVerificationStatus,
        },
      );

      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "License update failed",
        );
      }

      return rejectWithValue("Something went wrong");
    }
  },
);

// UPDATE ACCOUNT STATUS

export const updateAccountStatus = createAsyncThunk<
  IUser,
  {
    id: string;
    accountStatus: AccountStatus;
  },
  {
    rejectValue: string;
  }
>(
  "users/updateAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/admin/users/${payload.id}/account-status`,
        {
          accountStatus: payload.accountStatus,
        },
      );
      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Account update failed",
        );
      }

      return rejectWithValue("Something went wrong");
    }
  },
);


export const deleteUser = createAsyncThunk<
  IUser,
  { id: string },
  { rejectValue: string }
>(
  "users/delete",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/admin/users/${payload.id}`);
      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete user",
        );
      }
      return rejectWithValue("Something went wrong");
    }
  },
);
