// Invictus Payment Types

export interface IPaymentPlan {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  productType: "pillar" | "retreat" | "event" | "membership" | "other";
  product?: string;
  productRefModel?: string;
  mode: "one_time" | "subscription";
  amountCents: number;
  currency: string;
  stripePriceId?: string;
  stripeProductId?: string;
  status: "draft" | "active" | "archived";
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IInvictusCheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface IMyInvictusPurchase {
  _id: string;
  user: string;
  purpose: "invictus_purchase";
  status: "pending" | "paid" | "failed" | "refunded";
  stripeCheckoutSessionId?: string;
  amountTotal: number;
  currency: string;
  paymentPlan?: IPaymentPlan;
  product?: string;
  productRefModel?: string;
  entitlementActivatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
