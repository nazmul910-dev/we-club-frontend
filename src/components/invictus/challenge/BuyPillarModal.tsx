"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Crown,
  Infinity as InfinityIcon,
  Globe,
  Lock,
  ShieldCheck,
  CreditCard,
  Zap,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  fetchPaymentPlansByProductType,
  createInvictusCheckout,
  clearCheckoutError,
} from "@/lib/features/invictus/payment/invictusPaymentSlice";
import type { ChallengePillar } from "@/lib/features/invictus/academy/pillar/pillarTypes";
import type { IPaymentPlan } from "@/lib/features/invictus/payment/invictusPaymentTypes";

const PILLAR_ICONS = {
  crown: Crown,
  infinity: InfinityIcon,
  globe: Globe,
} as const;

interface Props {
  open: boolean;
  onClose: () => void;
  pillar: ChallengePillar;
}

export default function BuyPillarModal({ open, onClose, pillar }: Props) {
  const dispatch = useAppDispatch();

  const { plansByProductType, plansLoading, checkoutLoading, checkoutError } =
    useAppSelector((state) => state.invictusPayment);

  const [selectedPlan, setSelectedPlan] = useState<IPaymentPlan | { _id: string; name: string; description?: string; amountCents: number; currency: string; mode: string } | null>(null);

  // Fetch pillar payment plans when modal opens
  useEffect(() => {
    if (open) {
      dispatch(
        fetchPaymentPlansByProductType({ productType: "pillar", status: "active" })
      );
    }
  }, [open, dispatch]);

  // Filter plans that are linked to this specific pillar
  const allPillarPlans: IPaymentPlan[] = plansByProductType["pillar"] || [];
  const pillarPlans = allPillarPlans.filter(
    (plan) => plan.product === pillar._id
  );

  const directPillarPlan = {
    _id: "pillar_direct",
    name: "Full Pillar Access",
    description: `Complete lifetime access to all modules, videos, quiz, and certificate in ${pillar.title}`,
    amountCents: pillar.priceCents,
    currency: pillar.currency || "usd",
    mode: "one_time",
  };

  // Auto-select first plan or default direct pillar purchase
  useEffect(() => {
    if (pillarPlans.length > 0) {
      setSelectedPlan(pillarPlans[0]);
    } else if (pillar.isPaid && (pillar.priceCents > 0 || pillar.stripePriceId)) {
      setSelectedPlan(directPillarPlan);
    }
  }, [pillarPlans.length, pillar._id, pillar.isPaid, pillar.priceCents]);

  // Handle checkout error toast
  useEffect(() => {
    if (checkoutError) {
      toast.error(checkoutError);
      dispatch(clearCheckoutError());
    }
  }, [checkoutError, dispatch]);

  const handlePurchase = async () => {
    try {
      const payload =
        selectedPlan && selectedPlan._id !== "pillar_direct"
          ? { paymentPlanId: selectedPlan._id }
          : { pillarId: pillar._id };

      const result = await dispatch(
        createInvictusCheckout(payload)
      ).unwrap();

      // Redirect to Stripe Checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch {
      // Error handled via useEffect above
    }
  };

  const PillarIcon = PILLAR_ICONS[pillar.icon] ?? Crown;

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-[#E8DDCA] bg-white p-0 overflow-hidden">
        {/* Header gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#171717] to-[#2A2A2A] px-8 pt-8 pb-6">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#B18A3A]/20 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-24 w-24 rounded-full bg-[#C9A84C]/10 blur-2xl" />

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B18A3A]/20 border border-[#B18A3A]/30 text-[#C9A84C]">
                <PillarIcon size={28} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[4px] text-[#C9A84C] mb-1">
                  Invictus Challenge
                </p>
                <DialogTitle className="text-xl font-bold text-white leading-tight">
                  {pillar.title}
                </DialogTitle>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              {pillar.tagline}
            </p>
          </DialogHeader>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* What you get */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#B18A3A] mb-3">
              What&apos;s Included
            </p>
            <div className="grid gap-2">
              {[
                "Full access to all videos in this pillar",
                "Downloadable resources & PDF guides",
                "Action checklists to apply what you learn",
                "Quiz to test your knowledge",
                "Verifiable certificate upon completion",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={15}
                    className="flex-shrink-0 text-[#B18A3A]"
                  />
                  <span className="text-sm text-[#4A4A4A]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Plans */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[3px] text-[#B18A3A] mb-3">
              Select Plan
            </p>

            {plansLoading ? (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-[#8A8175]">
                <Loader2 size={16} className="animate-spin" />
                Loading plans...
              </div>
            ) : pillarPlans.length > 0 ? (
              <div className="space-y-2">
                {pillarPlans.map((plan) => {
                  const isSelected = selectedPlan?._id === plan._id;
                  return (
                    <button
                      key={plan._id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full cursor-pointer rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-[#B18A3A] bg-[#F3E9D2]/60"
                          : "border-[#E8DDCA] bg-white hover:border-[#B18A3A]/40 hover:bg-[#F9F6EE]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                              isSelected
                                ? "border-[#B18A3A] bg-[#B18A3A]"
                                : "border-[#C8B89A]"
                            }`}
                          >
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#171717]">
                              {plan.name}
                            </p>
                            {plan.description && (
                              <p className="text-xs text-[#8A8175] mt-0.5">
                                {plan.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#171717]">
                            {formatPrice(plan.amountCents, plan.currency)}
                          </p>
                          <p className="text-xs text-[#8A8175]">
                            {plan.mode === "one_time"
                              ? "one-time"
                              : "per period"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : selectedPlan ? (
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedPlan(directPillarPlan)}
                  className="w-full cursor-pointer rounded-xl border-2 border-[#B18A3A] bg-[#F3E9D2]/60 p-4 text-left transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#B18A3A] bg-[#B18A3A] transition-colors">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#171717]">
                          {selectedPlan.name}
                        </p>
                        {selectedPlan.description && (
                          <p className="text-xs text-[#8A8175] mt-0.5">
                            {selectedPlan.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#171717]">
                        {formatPrice(selectedPlan.amountCents, selectedPlan.currency)}
                      </p>
                      <p className="text-xs text-[#8A8175]">one-time</p>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-[#E8DDCA] bg-[#FAF8F3] p-4 text-center">
                <p className="text-sm text-[#8A8175]">
                  No payment plans available for this pillar yet.
                </p>
                <p className="mt-1 text-xs text-[#B18A3A]">
                  Please check back soon or contact support.
                </p>
              </div>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-[#E8DDCA] pt-4">
            {[
              { icon: ShieldCheck, label: "Secure Checkout" },
              { icon: CreditCard, label: "Stripe Protected" },
              { icon: Zap, label: "Instant Access" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-[#8A8175]"
              >
                <Icon size={13} className="text-[#B18A3A]" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 border-t border-[#E8DDCA] bg-[#FAF8F3] px-8 py-5">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 cursor-pointer border-[#C8B89A] text-[#4A4A4A] hover:bg-[#F3E9D2] hover:border-[#B18A3A] transition-all"
            disabled={checkoutLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={!selectedPlan || checkoutLoading}
            className="flex-[2] cursor-pointer bg-[#B18A3A] text-white hover:bg-[#997734] transition-all disabled:opacity-60 shadow-md"
          >
            {checkoutLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Redirecting...
              </>
            ) : selectedPlan ? (
              <>
                <Lock size={14} className="mr-2" />
                Unlock for{" "}
                {formatPrice(selectedPlan.amountCents, selectedPlan.currency)}
              </>
            ) : (
              <>
                <Lock size={14} className="mr-2" />
                Unlock Pillar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
