import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { quizAttemptApi } from "./quizAttemptApi";
import type { IQuizAttempt, ISubmitQuizAttempt } from "./quizAttemptTypes";

interface QuizAttemptState {
  // moduleId -> my attempts for that module
  attemptsByModuleId: Record<string, IQuizAttempt[]>;
  lastAttempt: IQuizAttempt | null;
  submitting: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: QuizAttemptState = {
  attemptsByModuleId: {},
  lastAttempt: null,
  submitting: false,
  loading: false,
  error: null,
};

export const submitQuizAttempt = createAsyncThunk(
  "quizAttempt/submit",
  async ({ moduleId, data }: { moduleId: string; data: ISubmitQuizAttempt }) => {
    const res = await quizAttemptApi.submit(moduleId, data);
    return { moduleId, attempt: res.data };
  },
);

export const fetchMyModuleAttempts = createAsyncThunk(
  "quizAttempt/getMyModuleAttempts",
  async (moduleId: string) => {
    const res = await quizAttemptApi.getMyModuleAttempts(moduleId);
    return { moduleId, attempts: res.data };
  },
);

const quizAttemptSlice = createSlice({
  name: "quizAttempt",
  initialState,
  reducers: {
    clearLastAttempt: (state) => {
      state.lastAttempt = null;
    },
    clearQuizAttemptError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitQuizAttempt.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.submitting = false;
        state.lastAttempt = action.payload.attempt;
        const list = state.attemptsByModuleId[action.payload.moduleId] ?? [];
        state.attemptsByModuleId[action.payload.moduleId] = [action.payload.attempt, ...list];
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || "Failed to submit quiz";
      })

      .addCase(fetchMyModuleAttempts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyModuleAttempts.fulfilled, (state, action) => {
        state.loading = false;
        state.attemptsByModuleId[action.payload.moduleId] = action.payload.attempts || [];
      })
      .addCase(fetchMyModuleAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading quiz attempts";
      });
  },
});

export const { clearLastAttempt, clearQuizAttemptError } = quizAttemptSlice.actions;
export default quizAttemptSlice.reducer;