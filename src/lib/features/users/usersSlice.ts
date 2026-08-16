import { createSlice } from "@reduxjs/toolkit";

import {
  getAllUsers,
  updateApprovalStatus,
  updateLicenseStatus,
  updateAccountStatus,
  deleteUser,
} from "./usersApi";

import { IUser } from "@/types/user-managemetn";

interface State {
  users: IUser[];

  loading: boolean;

  error: string | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  } | null;
}

const initialState: State = {
  users: [],

  loading: false,

  error: null,
  meta: null,
};

const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getAllUsers.fulfilled, (state, action) => {
    state.loading = false;
    state.users = action.payload.users;
    state.meta = action.payload.meta;
  })
  .addCase(getAllUsers.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload ?? "Failed to fetch users.";
  })

      // APPROVAL UPDATE

      .addCase(updateApprovalStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // LICENSE UPDATE

      .addCase(updateLicenseStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // ACCOUNT UPDATE

      .addCase(updateAccountStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // DELETE USER

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload._id);
        state.loading = false;
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload ?? null;
        state.loading = false;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = false;
      });
  },
});

export default usersSlice.reducer;
