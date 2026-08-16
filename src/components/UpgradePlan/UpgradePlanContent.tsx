"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  fetchMyUpgradePlans,
  createUpgradeCheckout,
  UpgradePlanOption,
} from "@/lib/features/payment/paymentSlice";
import {
  Loader2,
  AlertCircle,
  ShieldCheck,
  Crown,
  Check,
  ArrowRight,
  ChevronLeft,
  Tag,
} from "lucide-react";

export default function UpgradePlanContent() {
  const dispatch = useAppDispatch();

  const {
    upgradePlans,
    isUpgradePlansLoading,
    upgradePlansError,
    isUpgradeCheckoutLoading,
    upgradeCheckoutError,
  } = useAppSelector((state) => state.payment);

  const [selectedPlan, setSelectedPlan] = useState<UpgradePlanOption | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    dispatch(fetchMyUpgradePlans());
  }, [dispatch]);

  const handleOpenPayment = (plan: UpgradePlanOption) => {
    setSelectedPlan(plan);
    setDiscountCode("");
    setLocalError("");
    setShowPayment(true);
  };

  const handleBack = () => {
    setShowPayment(false);
    setDiscountCode("");
    setLocalError("");
  };

  const handlePay = async () => {
    if (!selectedPlan) return;

    setLocalError("");

    const result = await dispatch(
      createUpgradeCheckout({
        durationMonths: selectedPlan.durationMonths,
        discountCode: discountCode.trim() || undefined,
      }),
    );

    if (createUpgradeCheckout.fulfilled.match(result)) {
      window.location.href = result.payload;
      return;
    }

    setLocalError((result.payload as string) || "Failed to start checkout");
  };

  if (isUpgradePlansLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-[#080808]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#D6A83F]" />
          <p className="text-sm text-white/40">Loading your renewal plans...</p>
        </div>
      </div>
    );
  }

  if (upgradePlansError) {
    return (
      <div className="mx-auto max-w-md rounded-[26px] border border-[#D6A83F]/30 bg-[#111] p-7 text-center">
        <ShieldCheck className="mx-auto mb-4 h-8 w-8 text-[#D6A83F]" />
        <h3 className="text-xl font-semibold text-white">Your membership is still active</h3>
        <p className="mt-2 text-sm leading-6 text-white/40">{upgradePlansError}</p>
      </div>
    );
  }

  if (!upgradePlans || upgradePlans.plans.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-[26px] border border-[#D6A83F]/20 bg-[#111] p-7 text-center">
        <AlertCircle className="mx-auto mb-3 text-[#D6A83F]" />
        <p className="text-sm text-white/50">No renewal plans available right now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] px-5 py-10 sm:px-8 sm:py-14">
      <div className={`mx-auto grid gap-6 ${upgradePlans.plans.length === 1 ? "max-w-sm grid-cols-1" : "max-w-6xl sm:grid-cols-2 lg:grid-cols-3"}`}>
        {upgradePlans.plans.map((plan) => {
          const isPaymentOpen = showPayment && selectedPlan?.durationMonths === plan.durationMonths;

          const durationLabel = `${plan.durationMonths} Month Plan`;
          const periodLabel = "one-time";

          return (
            <div key={plan.durationMonths} className="relative overflow-hidden rounded-[26px] border border-[#8C6A22]/60 bg-gradient-to-b from-[#171714] via-[#101010] to-[#0b0b0b] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.55)] sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#D6A83F]/[0.06] blur-[70px]" />

              <div className="relative z-10">
                {!isPaymentOpen ? (
                  <>
                    {/* Crown Icon */}
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8C6A22]/50 bg-[#D6A83F]/[0.07]">
                      <Crown size={21} strokeWidth={1.7} className="text-[#E1B84D]" />
                    </div>

                    {/* Heading */}
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E1B84D]">World Elite Membership</p>

                    <h3 className="mt-3 text-[23px] font-semibold tracking-[-0.03em] text-white">{durationLabel}</h3>

                    <p className="mt-2 min-h-[48px] text-[13px] leading-6 text-white/40">Renew your membership and continue accessing all premium features.</p>

                    {/* Price */}
                    <div className="mt-7">
                      <div className="flex items-end gap-2">
                        <span className="text-[38px] font-semibold leading-none tracking-[-0.04em] text-white">{plan.pricing.totalFirstPaymentFormatted}</span>

                        <span className="mb-1 text-xs text-white/35">{periodLabel}</span>
                      </div>

                      <p className="mt-3 text-[11px] text-[#D6A83F]">Grants {plan.durationMonths} months of access from payment date</p>
                    </div>

                    {/* Divider */}
                    <div className="my-7 h-px bg-white/[0.07]" />

                    {/* Features */}
                    <div className="space-y-4">
                      {[
                        "Full dashboard access",
                        "Premium membership features",
                        "Priority account support",
                        "Secure member access",
                      ].map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#8C6A22]/60 bg-[#D6A83F]/[0.07]">
                            <Check size={11} strokeWidth={1.8} className="text-[#E1B84D]" />
                          </div>

                          <span className="text-[13px] text-white/75">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Upgrade Button */}
                    <button type="button" onClick={() => handleOpenPayment(plan)} className="group mt-8 flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#D6A43A] px-5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#E0B550] hover:shadow-[0_12px_35px_rgba(214,164,58,0.18)]">
                      Upgrade Membership
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Back */}
                    <button type="button" onClick={handleBack} className="mb-6 flex cursor-pointer items-center gap-1.5 text-xs text-white/35 transition hover:text-[#E1B84D]">
                      <ChevronLeft size={15} />
                      Back
                    </button>

                    {/* Icon */}
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8C6A22]/50 bg-[#D6A83F]/[0.07]">
                      <Crown size={21} strokeWidth={1.7} className="text-[#E1B84D]" />
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E1B84D]">Complete Payment</p>

                    <h3 className="mt-3 text-[23px] font-semibold tracking-[-0.03em] text-white">Upgrade Membership</h3>

                    <p className="mt-2 text-[13px] leading-6 text-white/40">Review your membership plan and continue securely to payment.</p>

                    {/* Selected Plan */}
                    <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">{durationLabel}</p>
                          <p className="mt-1 text-[11px] text-white/30">World Elite Membership</p>
                        </div>

                        <span className="text-lg font-semibold text-[#E1B84D]">{plan.pricing.totalFirstPaymentFormatted}</span>
                      </div>
                    </div>

                    {/* Discount */}
                    <div className="mt-6">
                      <div className="mb-2.5 flex items-center gap-2">
                        <Tag size={13} className="text-[#D6A83F]" />

                        <label className="text-xs font-medium text-white/65">Discount Code</label>

                        <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/30">Optional</span>
                      </div>

                      <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Enter discount code" className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D6A83F]/50 focus:ring-2 focus:ring-[#D6A83F]/10" />
                    </div>

                    {/* Total */}
                    <div className="my-6 border-t border-white/[0.07] pt-5">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">Total</p>
                          <p className="mt-1 text-[11px] text-white/25">Amount due today</p>
                        </div>

                        <span className="text-[26px] font-semibold tracking-[-0.03em] text-[#E1B84D]">{plan.pricing.totalFirstPaymentFormatted}</span>
                      </div>
                    </div>

                    {/* Error */}
                    {(localError || upgradeCheckoutError) && (
                      <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3">
                        <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-400" />
                        <p className="text-xs leading-5 text-red-300">{localError || upgradeCheckoutError}</p>
                      </div>
                    )}

                    {/* Pay */}
                    <button type="button" onClick={handlePay} disabled={isUpgradeCheckoutLoading} className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#D6A43A] px-5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#E0B550] hover:shadow-[0_12px_35px_rgba(214,164,58,0.18)] disabled:cursor-not-allowed disabled:opacity-50">
                      {isUpgradeCheckoutLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay
                          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>

                    {/* Security */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <ShieldCheck size={13} className="text-white/25" />
                      <span className="text-[10px] text-white/25">Secure & protected payment</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}