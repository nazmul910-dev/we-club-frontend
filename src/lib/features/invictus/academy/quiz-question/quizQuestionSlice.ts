import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

import { quizQuestionApi } from "./quizQuestionApi";
import type {
  ICreateQuizQuestion,
  IQuizQuestion,
  IUpdateQuizQuestion,
} from "./quizQuestionTypes";

interface QuizQuestionState {
  questions: IQuizQuestion[];
  selectedQuestion: IQuizQuestion | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: QuizQuestionState = {
  questions: [],
  selectedQuestion: null,
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchQuizQuestions = createAsyncThunk(
  "quizQuestion/getAll",
  async (
    params: { moduleId?: string; includeArchived?: boolean } | undefined,
  ) => {
    const res = await quizQuestionApi.getAll(
      params?.moduleId,
      params?.includeArchived ?? true,
    );
    return res.data;
  },
);

export const fetchQuizQuestionById = createAsyncThunk(
  "quizQuestion/getById",
  async (id: string) => {
    const res = await quizQuestionApi.getById(id);
    return res.data;
  },
);

export const createQuizQuestion = createAsyncThunk(
  "quizQuestion/create",
  async ({ moduleId, data }: { moduleId: string; data: ICreateQuizQuestion }) => {
    const res = await quizQuestionApi.create(moduleId, data);
    return res.data;
  },
);

export const updateQuizQuestion = createAsyncThunk(
  "quizQuestion/update",
  async ({ id, data }: { id: string; data: IUpdateQuizQuestion }) => {
    const res = await quizQuestionApi.update(id, data);
    return res.data;
  },
);

export const publishQuizQuestion = createAsyncThunk(
  "quizQuestion/publish",
  async (id: string) => {
    const res = await quizQuestionApi.publish(id);
    return res.data;
  },
);

export const draftQuizQuestion = createAsyncThunk(
  "quizQuestion/draft",
  async (id: string) => {
    const res = await quizQuestionApi.draft(id);
    return res.data;
  },
);

export const archiveQuizQuestion = createAsyncThunk(
  "quizQuestion/archive",
  async (id: string) => {
    const res = await quizQuestionApi.archive(id);
    return res.data;
  },
);

const upsertQuestion = (state: QuizQuestionState, updated: IQuizQuestion) => {
  const index = state.questions.findIndex((item) => item._id === updated._id);
  if (index !== -1) {
    state.questions[index] = updated;
  } else {
    state.questions.push(updated);
  }
  if (state.selectedQuestion?._id === updated._id) {
    state.selectedQuestion = updated;
  }
};

const quizQuestionSlice = createSlice({
  name: "quizQuestion",
  initialState,
  reducers: {
    clearSelectedQuestion: (state) => {
      state.selectedQuestion = null;
    },
    clearQuizQuestionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchQuizQuestions.fulfilled,
        (state, action: PayloadAction<IQuizQuestion[]>) => {
          state.loading = false;
          state.questions = action.payload || [];
        },
      )
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading questions";
      })

      .addCase(fetchQuizQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuestion = action.payload;
      })
      .addCase(fetchQuizQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed loading question";
      })

      .addCase(createQuizQuestion.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createQuizQuestion.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.questions.push(action.payload);
      })
      .addCase(createQuizQuestion.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to create question";
      })

      .addCase(updateQuizQuestion.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateQuizQuestion.fulfilled, (state, action) => {
        state.actionLoading = false;
        upsertQuestion(state, action.payload);
      })
      .addCase(updateQuizQuestion.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.error.message || "Failed to update question";
      })

      .addCase(publishQuizQuestion.fulfilled, (state, action) => {
        upsertQuestion(state, action.payload);
      })
      .addCase(publishQuizQuestion.rejected, (state, action) => {
        state.error = action.error.message || "Failed to publish question";
      })

      .addCase(draftQuizQuestion.fulfilled, (state, action) => {
        upsertQuestion(state, action.payload);
      })
      .addCase(draftQuizQuestion.rejected, (state, action) => {
        state.error = action.error.message || "Failed to move question to draft";
      })

      .addCase(archiveQuizQuestion.fulfilled, (state, action) => {
        upsertQuestion(state, action.payload);
      })
      .addCase(archiveQuizQuestion.rejected, (state, action) => {
        state.error = action.error.message || "Failed to archive question";
      });
  },
});

export const { clearSelectedQuestion, clearQuizQuestionError } = quizQuestionSlice.actions;
export default quizQuestionSlice.reducer;