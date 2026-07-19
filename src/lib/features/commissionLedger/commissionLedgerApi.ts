import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api/api";
import type { Commission } from "./types";

interface ApiResponse<T> {
  meta: null;
  success: boolean;
  message: string;
  data: T;
}


interface ListQueryParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}


export const getMyCommissions = createAsyncThunk<
  ApiResponse<Commission[]>,
 ListQueryParams | void,
  { rejectValue: string }
>(
  "commission/getMyCommissions",
  async ( params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/commission/my", {params});
      return res.data as ApiResponse<Commission[]>;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ??
          "Failed to fetch commissions"
      );
    }
  }
);


export const getAllCommissions = createAsyncThunk<
  ApiResponse<Commission[]>,
  ListQueryParams | void,
  { rejectValue: string }
>(
  "commission/getAllCommissions",
  async (params ={}, { rejectWithValue }) => {
    try {
      const res = await api.get("/commission/admin/all", {params});
      return res.data as ApiResponse<Commission[]>;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ??
          "Failed to fetch commissions"
      );
    }
  }
);


export const confirmCommission = createAsyncThunk<
  ApiResponse<Commission>,
  {
    id: string;
    final_commission_amount: number;
    deal_closed_at: string;
    note: string;
  },
  { rejectValue: string }
>(
  "commission/confirmCommission",
  async (
    {
      id,
      final_commission_amount,
      deal_closed_at,
      note,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(
        `/commission/${id}/confirm`,
        {
          final_commission_amount,
          deal_closed_at,
          note,
        }
      );

      return res.data as ApiResponse<Commission>;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ??
          "Failed to confirm commission"
      );
    }
  }
);


export const markPaid = createAsyncThunk<
  ApiResponse<Commission>,
  {
    id: string;
    payment_method?:
      | "bank_transfer"
      | "stripe"
      | "helcim"
      | "cash"
      | "check"
      | "other" | undefined;
  },
  { rejectValue: string }
>(
  "commission/markPaid",
  async ({ id, payment_method }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/commission/${id}/mark-paid`,
        {
           ...(payment_method && { payment_method }),
        }
      );

      return res.data as ApiResponse<Commission>;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ??
          "Failed to mark commission as paid"
      );
    }
  }
);


export const confirmReceived = createAsyncThunk<
  ApiResponse<Commission>,
  string,
  { rejectValue: string }
>(
  "commission/confirmReceived",
  async (
    id,
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(
        `/commission/${id}/confirm-received`,
        {}
      );

      return res.data as ApiResponse<Commission>;

    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ??
          "Failed to confirm receipt"
      );
    }
  }
);


export const disputeCommission = createAsyncThunk<
  ApiResponse<Commission>,
  {
    id: string;
    reason: string;
  },
  { rejectValue: string }
>(
  "commission/disputeCommission",
  async (
    {
      id,
      reason,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(
        `/commission/${id}/dispute`,
        {
          reason,
        }
      );

      return res.data as ApiResponse<Commission>;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ??
          "Failed to dispute commission"
      );
    }
  }
);


export const resolveDispute = createAsyncThunk<
  ApiResponse<Commission>,
  {
    id: string;
    final_status:
      | "confirmed"
      | "paid"
      | "cancelled";
    resolution_note: string;
  },
  { rejectValue: string }
>(
  "commission/resolveDispute",
  async (
    {
      id,
      final_status,
      resolution_note,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.patch(
        `/commission/admin/${id}/resolve-dispute`,
        {
          final_status,
          resolution_note,
        }
      );

      return res.data as ApiResponse<Commission>;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ??
          "Failed to resolve dispute"
      );
    }
  }
);

export const sendCommissionPayment = createAsyncThunk<
  ApiResponse<Commission>,
  {
    id:string;
    payment_method:
      |"bank_transfer"
      |"stripe"
      |"helcim"
      |"cash"
      |"check"
      |"other";
  },
  {rejectValue:string}
>(
"commission/sendCommissionPayment",

async(
{
 id,
 payment_method
},
{rejectWithValue}

)=>{

try{

const res = await api.patch(
`/commission/${id}/send-payment`,
{
 payment_method
}
);


return res.data as ApiResponse<Commission>;


}catch(err:any){

return rejectWithValue(
err?.response?.data?.message ??
"Failed to send payment"
);

}

}

);