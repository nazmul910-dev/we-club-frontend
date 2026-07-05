import { configureStore } from "@reduxjs/toolkit";
import registrationReducer from "@/lib/features/auth/authSlice";
import authUserReducer from "@/lib/features/auth/authUserSlice";

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    authUser:authUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;