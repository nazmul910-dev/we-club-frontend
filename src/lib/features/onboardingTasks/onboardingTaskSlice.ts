import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import {
  archiveOnboardingTaskAdmin,
  completeOnboardingTask,
  createOnboardingTaskAdmin,
  getAllOnboardingTasksAdmin,
  getMyOnboardingChecklist,
  publishOnboardingTaskAdmin,
  updateOnboardingTaskAdmin,
} from "./onboardingTaskApi";
import {
  AdminOnboardingTask,
  CreateOnboardingTaskPayload,
  OnboardingChecklistItem,
  UpdateOnboardingTaskPayload,
} from "./onboardingTaskTypes";

interface OnboardingTaskState {
  items: OnboardingChecklistItem[];
  isLoading: boolean;
  completingTaskId: string | null;
  error: string | null;

  // admin (founder/manager) task-management state
  adminTasks: AdminOnboardingTask[];
  isAdminLoading: boolean;
  isSavingTask: boolean;
  mutatingTaskId: string | null;
  adminError: string | null;
}

const initialState: OnboardingTaskState = {
  items: [],
  isLoading: false,
  completingTaskId: null,
  error: null,

  adminTasks: [],
  isAdminLoading: false,
  isSavingTask: false,
  mutatingTaskId: null,
  adminError: null,
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

/* --------------------------------------------------------------------- */
/*  Admin thunks (founder / manager / admin)                             */
/* --------------------------------------------------------------------- */

export const fetchAllOnboardingTasksAdmin = createAsyncThunk<
  AdminOnboardingTask[],
  void,
  { rejectValue: string }
>("onboardingTasks/fetchAllAdmin", async (_, { rejectWithValue }) => {
  try {
    return await getAllOnboardingTasksAdmin();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to load tasks"));
  }
});

export const createOnboardingTask = createAsyncThunk<
  AdminOnboardingTask,
  CreateOnboardingTaskPayload,
  { rejectValue: string }
>("onboardingTasks/create", async (payload, { rejectWithValue }) => {
  try {
    return await createOnboardingTaskAdmin(payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to create task"));
  }
});

export const updateOnboardingTask = createAsyncThunk<
  AdminOnboardingTask,
  { taskId: string; payload: UpdateOnboardingTaskPayload },
  { rejectValue: string }
>("onboardingTasks/update", async ({ taskId, payload }, { rejectWithValue }) => {
  try {
    return await updateOnboardingTaskAdmin(taskId, payload);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to update task"));
  }
});

export const publishOnboardingTask = createAsyncThunk<
  AdminOnboardingTask,
  string,
  { rejectValue: string }
>("onboardingTasks/publish", async (taskId, { rejectWithValue }) => {
  try {
    return await publishOnboardingTaskAdmin(taskId);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to publish task"));
  }
});

export const archiveOnboardingTask = createAsyncThunk<
  AdminOnboardingTask,
  string,
  { rejectValue: string }
>("onboardingTasks/archive", async (taskId, { rejectWithValue }) => {
  try {
    return await archiveOnboardingTaskAdmin(taskId);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to archive task"));
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
      })

      /* ---------------------------- admin: list ---------------------------- */
      .addCase(fetchAllOnboardingTasksAdmin.pending, (state) => {
        state.isAdminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchAllOnboardingTasksAdmin.fulfilled, (state, action) => {
        state.isAdminLoading = false;
        state.adminTasks = [...action.payload].sort((a, b) => a.order - b.order);
      })
      .addCase(fetchAllOnboardingTasksAdmin.rejected, (state, action) => {
        state.isAdminLoading = false;
        state.adminError = action.payload ?? "Failed to load tasks";
      })

      /* --------------------------- admin: create --------------------------- */
      .addCase(createOnboardingTask.pending, (state) => {
        state.isSavingTask = true;
        state.adminError = null;
      })
      .addCase(createOnboardingTask.fulfilled, (state, action) => {
        state.isSavingTask = false;
        state.adminTasks = [...state.adminTasks, action.payload].sort(
          (a, b) => a.order - b.order,
        );
      })
      .addCase(createOnboardingTask.rejected, (state, action) => {
        state.isSavingTask = false;
        state.adminError = action.payload ?? "Failed to create task";
      })

      /* --------------------------- admin: update --------------------------- */
      .addCase(updateOnboardingTask.pending, (state, action) => {
        state.mutatingTaskId = action.meta.arg.taskId;
        state.adminError = null;
      })
      .addCase(updateOnboardingTask.fulfilled, (state, action) => {
        state.mutatingTaskId = null;
        const index = state.adminTasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.adminTasks[index] = action.payload;
        }
        state.adminTasks.sort((a, b) => a.order - b.order);
      })
      .addCase(updateOnboardingTask.rejected, (state, action) => {
        state.mutatingTaskId = null;
        state.adminError = action.payload ?? "Failed to update task";
      })

      /* ------------------------- admin: publish/archive ---------------------- */
      .addCase(publishOnboardingTask.pending, (state, action) => {
        state.mutatingTaskId = action.meta.arg;
      })
      .addCase(publishOnboardingTask.fulfilled, (state, action) => {
        state.mutatingTaskId = null;
        const index = state.adminTasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.adminTasks[index] = action.payload;
      })
      .addCase(publishOnboardingTask.rejected, (state, action) => {
        state.mutatingTaskId = null;
        state.adminError = action.payload ?? "Failed to publish task";
      })
      .addCase(archiveOnboardingTask.pending, (state, action) => {
        state.mutatingTaskId = action.meta.arg;
      })
      .addCase(archiveOnboardingTask.fulfilled, (state, action) => {
        state.mutatingTaskId = null;
        const index = state.adminTasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.adminTasks[index] = action.payload;
      })
      .addCase(archiveOnboardingTask.rejected, (state, action) => {
        state.mutatingTaskId = null;
        state.adminError = action.payload ?? "Failed to archive task";
      });
  },
});

export default onboardingTaskSlice.reducer;