import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api/api";
import axios from "axios";

const errorHandler = (error: any) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Request failed";
  }

  return "Something went wrong";
};

// GET LOGO

export const getLogo = createAsyncThunk(
  "logo/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/logo");

      return res.data.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

// UPLOAD LOGO

export const uploadLogo = createAsyncThunk(
  "logo/upload",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("logo", file);

      const res = await api.post("/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);

// CHANGE LOGO

export const changeLogo = createAsyncThunk(
  "logo/change",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("logo", file);

      const res = await api.patch("/logo/change", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    } catch (error) {
      return rejectWithValue(errorHandler(error));
    }
  }
);