import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { mentorManagementApi } from "./mentorManagementApi";
import type {
  CreateMentorPayload,
  MentorProfile,
  MentorProfileQuery,
  UpdateMentorPayload,
} from "./mentorManagementTypes";

interface MentorManagementState {
  profiles: MentorProfile[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: MentorManagementState = {
  profiles: [],
  loading: false,
  actionLoading: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

export const fetchMentorProfiles = createAsyncThunk<
  MentorProfile[],
  MentorProfileQuery | void,
  { rejectValue: string }
>("mentorManagement/fetchProfiles", async (query, { rejectWithValue }) => {
  try {
    const response = await mentorManagementApi.list(query ?? {});
    return response.data;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to load mentor profiles"),
    );
  }
});

export const createMentor = createAsyncThunk<
  MentorProfile,
  CreateMentorPayload,
  { rejectValue: string }
>("mentorManagement/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await mentorManagementApi.create(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to create mentor"));
  }
});

export const updateMentor = createAsyncThunk<
  MentorProfile,
  { id: string; payload: UpdateMentorPayload },
  { rejectValue: string }
>("mentorManagement/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await mentorManagementApi.update(id, payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to update mentor"));
  }
});

const createAction = (
  action: "publish" | "draft" | "archive",
  fallback: string,
) =>
  createAsyncThunk<MentorProfile, string, { rejectValue: string }>(
    `mentorManagement/${action}`,
    async (id, { rejectWithValue }) => {
      try {
        const response = await mentorManagementApi[action](id);
        return response.data;
      } catch (error) {
        return rejectWithValue(getErrorMessage(error, fallback));
      }
    },
  );

export const publishMentor = createAction(
  "publish",
  "Failed to publish mentor profile",
);
export const moveMentorToDraft = createAction(
  "draft",
  "Failed to move mentor profile to draft",
);
export const archiveMentor = createAction(
  "archive",
  "Failed to archive mentor profile",
);

const upsertProfile = (state: MentorManagementState, profile: MentorProfile) => {
  const index = state.profiles.findIndex((item) => item._id === profile._id);
  if (index === -1) {
    state.profiles.unshift(profile);
  } else {
    state.profiles[index] = profile;
  }

  if (profile.isPrimaryMentor) {
    state.profiles = state.profiles.map((item) =>
      item._id === profile._id ? item : { ...item, isPrimaryMentor: false },
    );
  }
}

const mentorManagementSlice = createSlice({
  name: "mentorManagement",
  initialState,
  reducers: {
    clearMentorManagementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentorProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentorProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchMentorProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load mentor profiles";
      });

    [createMentor, updateMentor, publishMentor, moveMentorToDraft, archiveMentor].forEach(
      (action) => {
        builder
          .addCase(action.pending, (state) => {
            state.actionLoading = true;
            state.error = null;
          })
          .addCase(action.fulfilled, (state, result) => {
            state.actionLoading = false;
            upsertProfile(state, result.payload);
          })
          .addCase(action.rejected, (state, result) => {
            state.actionLoading = false;
            state.error = result.payload ?? "Mentor action failed";
          });
      },
    );
  },
});

export const { clearMentorManagementError } = mentorManagementSlice.actions;
export default mentorManagementSlice.reducer;
