export type CommissionStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "disputed"
  | "cancelled";

export type CommissionPaymentMethod =
  | "bank_transfer"
  | "stripe"
  | "helcim"
  | "cash"
  | "check"
  | "other";

export type PlatformFeeStatus =
  | "not_required"
  | "pending"
  | "paid"
  | "failed";

export interface PopulatedUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface PopulatedListing {
  _id: string;
  title: string;
  ref_code: string;
  cover_image?: string;
  price: {
    amount: number;
    currency: string;
  };
  referral_commission: {
    offered_amount: number;
  };
}

export interface CommissionStatusHistoryEntry {
  status: CommissionStatus;
  changed_by: string;
  changed_at: string;
  note?: string;
}

export interface CommissionPaymentTracking {
  sent_by?: string;
  sent_at?: string;

  marked_paid_by?: string;
  marked_paid_at?: string;

  receiver_confirmed_by?: string;
  receiver_confirmed_at?: string;

  payment_method?: CommissionPaymentMethod;
  payment_reference?: string;
  note?: string;
}

export interface CommissionDispute {
  opened_by?: string;
  opened_at?: string;
  reason?: string;

  resolved_by?: string;
  resolved_at?: string;
  resolution_note?: string;
}

export interface CommissionPlatformFee {
  rate_percent: number;
  amount: number;
  status: PlatformFeeStatus;
  provider?: "stripe" | "helcim";
  provider_payment_id?: string;
  paid_at?: string;
}

export interface Commission {
  _id: string;

  listing_id: PopulatedListing;
  promotion_request_id?: string;

  listing_owner_id: PopulatedUser;
  promoter_id: PopulatedUser;

  created_by: PopulatedUser;

  status: CommissionStatus;

  currency: string;

  listing_price_amount: number;
  commission_rate_percent: number;

  estimated_commission_amount: number;
  final_commission_amount?: number;

  deal_closed_at?: string;

  payment_tracking?: CommissionPaymentTracking;
  dispute?: CommissionDispute;
  platform_fee?: CommissionPlatformFee;

  status_history: CommissionStatusHistoryEntry[];

  is_frozen: boolean;

  note?: string;

  created_at: string;
  updated_at: string;
}