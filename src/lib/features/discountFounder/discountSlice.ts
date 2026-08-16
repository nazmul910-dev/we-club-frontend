import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/lib/api/api";
import {
  IDiscountCode,
  CreateDiscountPayload,
  SendDiscountEmailPayload,
  DeleteDiscountPayload,
} from "./discount.interface";

interface DiscountResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface DiscountState {
  discounts: IDiscountCode[];
  loading: boolean;
  error: string | null;

  isCreating: boolean;
  createError: string | null;

  sendingId: string | null;
  sendError: string | null;

  deletingId: string | null;
  deleteError: string | null;
}

const initialState: DiscountState = {
  discounts: [],
  loading: false,
  error: null,

  isCreating: false,
  createError: null,

  sendingId: null,
  sendError: null,

  deletingId: null,
  deleteError: null,
};

export const getAllDiscountCodes = createAsyncThunk<
  IDiscountCode[],
  void,
  { rejectValue: string }
>("discount/getAll", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<DiscountResponse<IDiscountCode[]>>("/discounts");

    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load discount codes"
      );
    }

    return rejectWithValue("Unexpected error");
  }
});

export const createDiscountCode = createAsyncThunk<
  IDiscountCode,
  CreateDiscountPayload,
  { rejectValue: string }
>("discount/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<DiscountResponse<IDiscountCode>>(
      "/discounts",
      payload
    );

    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create discount code"
      );
    }

    return rejectWithValue("Unexpected error");
  }
});

export const sendDiscountCodeEmail = createAsyncThunk<
  { email: string; code: string },
  SendDiscountEmailPayload,
  { rejectValue: string }
>("discount/sendEmail", async (payload, { rejectWithValue }) => {
  try {
    await api.post("/discounts/send-email", payload);

    return payload;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send discount email"
      );
    }

    return rejectWithValue("Unexpected error");
  }
});

export const deleteDiscountCode = createAsyncThunk<
  string,
  DeleteDiscountPayload,
  { rejectValue: string }
>("discount/delete", async ({ id }, { rejectWithValue }) => {
  try {
    await api.delete(`/discounts/${id}`);

    return id;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete discount code"
      );
    }

    return rejectWithValue("Unexpected error");
  }
});

const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    clearDiscountErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.sendError = null;
      state.deleteError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllDiscountCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDiscountCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload;
      })
      .addCase(getAllDiscountCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load discount codes";
      })

      .addCase(createDiscountCode.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createDiscountCode.fulfilled, (state, action) => {
        state.isCreating = false;
        state.discounts.unshift(action.payload);
      })
      .addCase(createDiscountCode.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload ?? "Failed to create discount code";
      })

      .addCase(sendDiscountCodeEmail.pending, (state, action) => {
        state.sendingId = action.meta.arg.code;
        state.sendError = null;
      })
      .addCase(sendDiscountCodeEmail.fulfilled, (state) => {
        state.sendingId = null;
      })
      .addCase(sendDiscountCodeEmail.rejected, (state, action) => {
        state.sendingId = null;
        state.sendError = action.payload ?? "Failed to send discount email";
      })

      .addCase(deleteDiscountCode.pending, (state, action) => {
        state.deletingId = action.meta.arg.id;
        state.deleteError = null;
      })
      .addCase(deleteDiscountCode.fulfilled, (state, action) => {
        state.deletingId = null;
        state.discounts = state.discounts.filter(
          (d) => d._id !== action.payload
        );
      })
      .addCase(deleteDiscountCode.rejected, (state, action) => {
        state.deletingId = null;
        state.deleteError = action.payload ?? "Failed to delete discount code";
      });
  },
});

export const { clearDiscountErrors } = discountSlice.actions;
export default discountSlice.reducer;