import { configureStore } from "@reduxjs/toolkit";
import registrationReducer from "@/lib/features/auth/authSlice";
import listingsReducer from "@/lib/features/listings/listingsSlice";
import authUserReducer from "@/lib/features/auth/authUserSlice";
import promoteRequestReducer from "@/lib/features/PromoteRequest/promoteRequestSlice";




export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    authUser:authUserReducer,
    listings: listingsReducer,
    promoteRequests: promoteRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;