import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import {
  completeOnboardingTask,
  getMyOnboardingChecklist,
} from "./onboardingTaskApi";
import { OnboardingChecklistItem } from "./onboardingTaskTypes";

interface OnboardingTaskState {
  items: OnboardingChecklistItem[];
  isLoading: boolean;
  completingTaskId: string | null;
  error: string | null;
}

const initialState: OnboardingTaskState = {
  items: [],
  isLoading: false,
  completingTaskId: null,
  error: null,
};

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const fetchMyOnboardingChecklist = createAsyncThunk<
  OnboardingChecklistItem[],
  void,
  { rejectValue: string }
>("onboardingTasks/fetchMyChecklist", async (_, { rejectWithValue }) => {
  try {
    return await getMyOnboardingChecklist();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to load checklist"));
  }
});

export const completeMyOnboardingTask = createAsyncThunk<
  { taskId: string; pointsAwarded: number },
  string,
  { rejectValue: string }
>("onboardingTasks/completeTask", async (taskId, { rejectWithValue }) => {
  try {
    const result = await completeOnboardingTask(taskId);
    return { taskId, pointsAwarded: result.pointsAwarded };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to complete task"));
  }
});

const onboardingTaskSlice = createSlice({
  name: "onboardingTasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOnboardingChecklist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOnboardingChecklist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyOnboardingChecklist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to load checklist";
      })
      .addCase(completeMyOnboardingTask.pending, (state, action) => {
        state.completingTaskId = action.meta.arg;
      })
      .addCase(completeMyOnboardingTask.fulfilled, (state, action) => {
        state.completingTaskId = null;
        const item = state.items.find((task) => task._id === action.payload.taskId);
        if (item) {
          item.isCompleted = true;
        }
      })
      .addCase(completeMyOnboardingTask.rejected, (state, action) => {
        state.completingTaskId = null;
        state.error = action.payload ?? "Failed to complete task";
      });
  },
});

export default onboardingTaskSlice.reducer;
