import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api/api";
import axios from "axios";

export const getDashboardStats = createAsyncThunk(
  "dashboard/getDashboardStats",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/dashboard/stats");

      return res.data.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard statistics"
      );
    }
  }
);

export const fetchTopPromoters=createAsyncThunk(

    "dashboard/fetchTopPromoters",

    async(_,{rejectWithValue})=>{

        try{

            const res=await api.get(

                "/dashboard/top-promoters"

            );

            return res.data.data;

        }catch(err:any){

            return rejectWithValue(

                err.response?.data?.message

            );

        }

    }

);