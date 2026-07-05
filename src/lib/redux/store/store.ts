import { configureStore } from "@reduxjs/toolkit";
import registrationReducer from "@/lib/features/auth/authSlice";
import listingsReducer from "@/lib/features/listings/listingsSlice";

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    listings: listingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;