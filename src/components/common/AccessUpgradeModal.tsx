"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { useAppDispatch } from "@/lib/redux/store/hook";
import {
  createAccessUpgradeCheckout,
  fetchAccessUpgradePlan,
  type AccessUpgradePlan,
} from "@/lib/features/payment/paymentSlice";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  variant: "dashboard" | "invictus";
}

export default function AccessUpgradeModal({ open, onClose, variant }: Props) {
  const dispatch = useAppDispatch();
  const [plan, setPlan] = useState<AccessUpgradePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const dark = variant === "dashboard";

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    dispatch(fetchAccessUpgradePlan())
      .unwrap()
      .then(setPlan)
      .catch((message) => toast.error(message))
      .finally(() => setLoading(false));
  }, [dispatch, open]);

  const startCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const checkoutUrl = await dispatch(
        createAccessUpgradeCheckout({
          cancelPath: window.location.pathname,
          discountCode: discountCode.trim() || undefined,
        }),
      ).unwrap();
      window.location.assign(checkoutUrl);
    } catch (message) {
      toast.error(
        typeof message === "string" ? message : "Could not start checkout",
      );
      setCheckoutLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg rounded-3xl border p-7 shadow-2xl ${
          dark
            ? "border-[#D6A83F]/30 bg-[#111111] text-white"
            : "border-[#DECDB0] bg-[#FAF8F5] text-[#1C1814]"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute cursor-pointer group right-5 top-5 rounded-full p-1.5 ${dark ? "text-white/60 hover:bg-white/10" : "text-[#6B6358] hover:bg-[#F1E8D7]"}`}
          aria-label="Close upgrade dialog"
        >
          <X size={18} className="group-hover:text-red-500 rotate-90 duration-300" />
        </button>

        <p
          className={`text-xs font-bold uppercase tracking-[0.28em] ${dark ? "text-[#D6A83F]" : "text-[#9E7B28]"}`}
        >
          Access upgrade
        </p>
        <h2 className="mt-3 text-2xl font-semibold">Unlock both platforms</h2>
        <p
          className={`mt-3 text-sm leading-6 ${dark ? "text-white/60" : "text-[#6B6358]"}`}
        >
          Add the other platform to your active membership without changing its
          current end date.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin" />
          </div>
        ) : plan?.hasBoth ? (
          <div className="mt-8 rounded-2xl border border-emerald-300/40 bg-emerald-500/10 p-4 text-sm text-emerald-600">
            Your account already has both platforms.
          </div>
        ) : (
          <>
            <div
              className={`mt-6 rounded-2xl border p-5 ${dark ? "border-white/10 bg-white/[.04]" : "border-[#DECDB0] bg-[#FAF6EE]"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className={`text-xs uppercase tracking-widest ${dark ? "text-white/45" : "text-[#7A7062]"}`}
                  >
                    Upgrade to
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {plan?.displayName ||
                      "WÉ Command Center + INVICTUS Academy"}
                  </p>
                </div>
                <p
                  className={`text-2xl font-bold ${dark ? "text-[#D6A83F]" : "text-[#9E7B28]"}`}
                >
                  {plan?.formattedAmount}
                </p>
              </div>
              <p
                className={`mt-2 text-xs ${dark ? "text-white/45" : "text-[#7A7062]"}`}
              >
                {plan?.billingText}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm">
              <Check
                size={16}
                className={dark ? "text-[#D6A83F]" : "text-[#9E7B28]"}
              />
              Current subscription expiry remains unchanged
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Check
                size={16}
                className={dark ? "text-[#D6A83F]" : "text-[#9E7B28]"}
              />
              Future renewals use the combined platform rate
            </div>

            <input
              value={discountCode}
              onChange={(event) => setDiscountCode(event.target.value)}
              placeholder="Discount code (optional)"
              className={`mt-6 h-11 w-full rounded-xl border px-3 text-sm outline-none ${dark ? "border-white/15 bg-white/5 text-white placeholder:text-white/35" : "border-[#DECDB0] bg-white text-[#1C1814]"}`}
            />
            <button
              type="button"
              disabled={checkoutLoading}
              onClick={startCheckout}
              className={`mt-5 flex cursor-pointer h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold uppercase tracking-wider text-white disabled:opacity-60 ${dark ? "bg-[#D6A83F] text-[#111111]" : "bg-[#9E7B28]"}`}
            >
              {checkoutLoading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <>
                  Proceed to Stripe Checkout <ArrowRight size={17} />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
