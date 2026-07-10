import { createSlice } from "@reduxjs/toolkit";
import { downloadListingAssets } from "./listingAssetsApi";

interface ListingAssetsState{

    downloading:boolean;

    error:string|null;

}

const initialState:ListingAssetsState={

    downloading:false,

    error:null

};

const listingAssetsSlice=createSlice({

    name:"listingAssets",

    initialState,

    reducers:{},

    extraReducers:(builder)=>{

        builder

        .addCase(downloadListingAssets.pending,(state)=>{

            state.downloading=true;
            state.error=null;

        })

        .addCase(downloadListingAssets.fulfilled,(state)=>{

            state.downloading=false;

        })

        .addCase(downloadListingAssets.rejected,(state,action)=>{

            state.downloading=false;

            state.error=action.payload ?? "Download failed";

        });

    }

});

export default listingAssetsSlice.reducer;