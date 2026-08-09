export type DiscountUserRole =
  | "associate"
  | "partner"
  | "ambassador"
  | "ceo"
  | "ceo_partner"
  | "we_club_member";

export type DiscountAccessTo = "we_command_center" | "invictus" | "both";

export interface IDiscountCode {
  _id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  allowedRoles?: DiscountUserRole[];
  allowedAccessTo?: DiscountAccessTo[];
  maxRedemptions: number;
  usedCount?: number;
  expiresAt?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDiscountPayload {
  code: string;
  discountPercent: number;
  allowedRoles?: DiscountUserRole[];
  allowedAccessTo?: DiscountAccessTo[];
  expiresAt?: string;
  note?: string;
}

export interface SendDiscountEmailPayload {
  email: string;
  code: string;
}

export interface DeleteDiscountPayload {
  id: string;
}