import api from "@/lib/api/api";

import type { IPillarAccessResult, IUserEntitlement } from "./entitlementTypes";

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const ENTITLEMENT_URL = "/invictus/user-entitlements";

export const entitlementApi = {
  // Member: every entitlement I own
  getMine: async (): Promise<ApiEnvelope<IUserEntitlement[]>> => {
    const res = await api.get(`${ENTITLEMENT_URL}/me`);
    return res.data;
  },

  // Member: whether I can access a specific paid pillar
  checkPillarAccess: async (pillarId: string): Promise<ApiEnvelope<IPillarAccessResult>> => {
    const res = await api.get(`${ENTITLEMENT_URL}/check/pillar/${pillarId}`);
    return res.data;
  },
};