import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLogo, uploadLogo, changeLogo } from "./logoApi";

export interface Logo {
  _id: string;
  logo: string;
  createdAt?: string;
}

interface State {
  logo: Logo | null;

  loading: boolean;

  error: string | null;
}

const initialState: State = {
  logo: null,

  loading: false,

  error: null,
};

const logoSlice = createSlice({
  name: "logo",

  initialState,

  reducers: {
    clearLogo: (state) => {
      state.logo = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getLogo.pending, (state) => {
        state.loading = true;
      })

      .addCase(getLogo.fulfilled, (state, action: PayloadAction<Logo>) => {
        state.loading = false;

        state.logo = action.payload;
      })

      .addCase(getLogo.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      })

      .addCase(uploadLogo.pending, (state) => {
        state.loading = true;
      })

      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.loading = false;

        state.logo = action.payload;
      })

      .addCase(uploadLogo.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      })

      .addCase(changeLogo.pending, (state) => {
        state.loading = true;
      })

      .addCase(changeLogo.fulfilled, (state, action) => {
        state.loading = false;

        state.logo = action.payload;
      })

      .addCase(changeLogo.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      });
  },
});

export const { clearLogo } = logoSlice.actions;

export default logoSlice.reducer;