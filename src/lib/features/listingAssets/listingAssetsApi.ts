import api from "@/lib/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const downloadListingAssets = createAsyncThunk<
    Blob,
    string,
    {
        rejectValue:string
    }
>(
    "listingAssets/download",

    async(listingId,{rejectWithValue})=>{

        try{

            const response = await api.post(

                `/listing-assets/${listingId}/download`,

                {},

                {
                    responseType:"blob"
                }

            );

            return response.data;

        }catch(err){

            if(axios.isAxiosError(err)){

                return rejectWithValue(

                    err.response?.data?.message ||
                    "Download failed"

                );

            }

            return rejectWithValue(
                "Something went wrong"
            );

        }

    }
);