import api from "@/lib/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CreateManagerPayload,
  Manager,
} from "./managerTypes";

export const getManagers = createAsyncThunk<
  Manager[],
  "all" | "active" | "suspended",
  { rejectValue: string }
>( 
  "manager/getManagers",

  async (status, { rejectWithValue }) => {
    try {
      const params: Record<string, string> = {
        role: "manager",
      };

      if (status !== "all") {
        params.accountStatus = status;
      }

      const res = await api.get("/users", {
        params,
      });

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed"
        );
      }

      return rejectWithValue("Something went wrong");
    }
  }
);


export const createManager = createAsyncThunk<
  Manager,
  CreateManagerPayload,
  { rejectValue: string }
>(
  "manager/createManager",

  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/users/admin-create",
        payload
      );

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed"
        );
      }

      return rejectWithValue("Something went wrong");
    }
  }
); 

export const suspendManager = createAsyncThunk<
  Manager,
  string,
  { rejectValue: string }
>(
  "manager/suspend",

  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/users/${id}/suspend`
      );

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed"
        );
      }

      return rejectWithValue("Something went wrong");
    }
  }
);

export const activateManager = createAsyncThunk<
  Manager,
  string,
  { rejectValue: string }
>(
  "manager/activate",

  async (id, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/users/${id}/activate`
      );

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed"
        );
      }

      return rejectWithValue("Something went wrong");
    }
  }
);


export const deleteManager = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "manager/delete",

  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);

      return id;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed"
        );
      }

      return rejectWithValue("Something went wrong");
    }
  }
);