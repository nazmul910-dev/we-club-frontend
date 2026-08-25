import { configureStore } from "@reduxjs/toolkit";
import registrationReducer from "@/lib/features/auth/authSlice";
import listingsReducer from "@/lib/features/listings/listingsSlice";
import authUserReducer from "@/lib/features/auth/authUserSlice";
import profileReducer from "@/lib/features/profile/profileSlice";
import commissionReducer from "@/lib/features/commissionLedger/commissionLedgerSlice";
import promoteRequestReducer from "@/lib/features/PromoteRequest/promoteRequestSlice";
import usersReducer from "@/lib/features/users/usersSlice";
import listingAssetsReducer from "@/lib/features/listingAssets/listingAssetsSlice";
import dashboardReducer from "@/lib/features/dashboard/dashboardSlice";
import promotersReducer from "@/lib/features/promoters/promotersSlice";
import managerReducer from "@/lib/features/addManager/addManagerSlice";
import chatReducer from "@/lib/features/chat/chatSlice";
import logoReducer from "@/lib/features/logo/logoSlice";
import paymentReducer from "@/lib/features/payment/paymentSlice";
import discountReducer from "@/lib/features/discountFounder/discountSlice";
import academyReducer from "@/lib/features/invictus/academy/academySlice";

import pillarReducer from "@/lib/features/invictus/academy/pillar/pillarSlice";
import courseReducer from "@/lib/features/invictus/academy/course/courseSlice";

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    authUser: authUserReducer,
    profile: profileReducer,
    listings: listingsReducer,
    commission: commissionReducer,
    promoteRequests: promoteRequestReducer,
    users: usersReducer,
    listingAssets: listingAssetsReducer,
    dashboard: dashboardReducer,
    promoters: promotersReducer,
    manager: managerReducer,
    chat: chatReducer,
    logo: logoReducer,
    payment: paymentReducer,
    discount: discountReducer,
    academy: academyReducer,
    pillar: pillarReducer,
    course: courseReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
