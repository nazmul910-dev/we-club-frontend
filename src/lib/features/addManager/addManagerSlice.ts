import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  activateManager,
  createManager,
  deleteManager,
  getManagers,
  suspendManager,
} from "./ManagerApi";
import { Manager } from "./managerTypes";

interface ManagerState {
  managers: Manager[];
  loading: boolean;
  error: string | null;
  activeTab: "all" | "active" | "suspended";
}

const initialState: ManagerState = {
  managers: [],
  loading: false,
  error: null,
  activeTab: "all",
};

const managerSlice = createSlice({
  name: "manager",

  initialState,

  reducers: {
    setActiveTab: (
      state,
      action: PayloadAction<"all" | "active" | "suspended">
    ) => {
      state.activeTab = action.payload;
    },

    clearManagerError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder



      .addCase(getManagers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload;
      })

      .addCase(getManagers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch managers.";
      })

      .addCase(createManager.pending, (state) => {
        state.loading = true;
      })

      .addCase(createManager.fulfilled, (state, action) => {
        state.loading = false;
        state.managers.unshift(action.payload);
      })

      .addCase(createManager.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to create manager.";
      })


      .addCase(suspendManager.pending, (state) => {
        state.loading = true;
      })

      .addCase(suspendManager.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.managers.findIndex(
          (manager) => manager._id === action.payload._id
        );

        if (index !== -1) {
          state.managers[index] = action.payload;
        }
      })

      .addCase(suspendManager.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to suspend manager.";
      })


      .addCase(activateManager.pending, (state) => {
        state.loading = true;
      })

      .addCase(activateManager.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.managers.findIndex(
          (manager) => manager._id === action.payload._id
        );

        if (index !== -1) {
          state.managers[index] = action.payload;
        }
      })

      .addCase(activateManager.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to activate manager.";
      })


      .addCase(deleteManager.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteManager.fulfilled, (state, action) => {
        state.loading = false;

        state.managers = state.managers.filter(
          (manager) => manager._id !== action.payload
        );
      })

      .addCase(deleteManager.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to delete manager.";
      });
  },
});

export const {
  setActiveTab,
  clearManagerError,
} = managerSlice.actions;

export default managerSlice.reducer;