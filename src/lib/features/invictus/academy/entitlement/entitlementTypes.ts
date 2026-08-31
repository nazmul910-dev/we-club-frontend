export const ENTITLEMENT_TYPES = ["pillar", "bundle", "event", "retreat"] as const;
export type EntitlementType = (typeof ENTITLEMENT_TYPES)[number];

export const ENTITLEMENT_STATUSES = ["active", "revoked", "refunded", "expired"] as const;
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];

export interface IUserEntitlement {
  _id: string;
  user: string;
  entitlementType: EntitlementType;
  entitlementKey: string;
  pillar?: string;
  targetId?: string;
  source: string;
  status: EntitlementStatus;
  startsAt: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// GET /check/pillar/:pillarId response
export interface IPillarAccessResult {
  hasAccess: boolean;
  accessType?: "free" | "purchased";
  reason: string;
  pillar: {
    _id: string;
    name?: string;
    slug?: string;
    title?: string;
    isPaid: boolean;
    priceCents?: number;
    currency?: string;
    status?: string;
  };
  entitlement: IUserEntitlement | null;
}