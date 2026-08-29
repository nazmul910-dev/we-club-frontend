import api from "@/lib/api/api";
import type {
  IInvictusCheckoutResponse,
  IMyInvictusPurchase,
  IPaymentPlan,
} from "./invictusPaymentTypes";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const INVICTUS_PAYMENTS_URL = "/invictus/payments";
const PAYMENT_PLANS_URL = "/invictus/payment-plans";

export const invictusPaymentApi = {
  /**
   * Create a Stripe checkout session for a paid pillar.
   * POST /invictus/payments/checkout
   */
  createCheckoutSession: async (
    paymentPlanId: string
  ): Promise<ApiEnvelope<IInvictusCheckoutResponse>> => {
    const res = await api.post(`${INVICTUS_PAYMENTS_URL}/checkout`, {
      paymentPlanId,
    });
    return res.data;
  },

  /**
   * Fetch logged-in user's own Invictus purchases.
   * GET /invictus/payments/my-purchases
   */
  getMyPurchases: async (): Promise<
    ApiEnvelope<IMyInvictusPurchase[]>
  > => {
    const res = await api.get(`${INVICTUS_PAYMENTS_URL}/my-purchases`);
    return res.data;
  },

  /**
   * Fetch payment plans filtered by productType (e.g. "pillar") and status "active".
   * GET /invictus/payment-plans?productType=pillar&status=active
   */
  getPaymentPlansByProduct: async (params: {
    productType?: string;
    status?: string;
  }): Promise<ApiEnvelope<IPaymentPlan[]>> => {
    const query = new URLSearchParams();
    if (params.productType) query.set("productType", params.productType);
    if (params.status) query.set("status", params.status);
    const res = await api.get(`${PAYMENT_PLANS_URL}?${query.toString()}`);
    return res.data;
  },

  /**
   * Get a single payment plan by ID.
   * GET /invictus/payment-plans/:id
   */
  getPaymentPlanById: async (
    id: string
  ): Promise<ApiEnvelope<IPaymentPlan>> => {
    const res = await api.get(`${PAYMENT_PLANS_URL}/${id}`);
    return res.data;
  },
};
