"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import BgImage from "@/assets/Login/login-bg.jpg";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  fetchRegistrationPaymentDetails,
  createRegistrationCheckout,
  resetPaymentState,
} from "@/lib/features/payment/paymentSlice";

export default function RegistrationPaymentPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const dispatch = useAppDispatch();

  const {
    details,
    isDetailsLoading,
    detailsError,
    isCheckoutLoading,
    checkoutError,
  } = useAppSelector((state) => state.payment);

  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    dispatch(fetchRegistrationPaymentDetails(token));

    return () => {
      dispatch(resetPaymentState());
    };
  }, [token, dispatch]);

  const handlePayNow = async () => {
    if (!token) {
      return;
    }

    const result = await dispatch(
      createRegistrationCheckout({
        token,
        discountCode: discountCode || undefined,
      })
    );

    if (createRegistrationCheckout.fulfilled.match(result)) {
      window.location.href = result.payload;
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src={BgImage}
        alt="Background"
        fill
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute top-0 left-1/2 h-100 w-100 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[180px]" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-amber-400/20 bg-black/40 p-10 backdrop-blur-[10px]">
        {isDetailsLoading && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-amber-400" />
            <p className="text-sm text-white/60">
              Loading your payment details...
            </p>
          </div>
        )}

        {!isDetailsLoading && detailsError && !details && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center text-sm text-red-400">
            {detailsError}
          </div>
        )}

        {!isDetailsLoading && details && details.alreadyPaid && (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10">
              <ShieldCheck className="h-8 w-8 text-amber-400" />
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-amber-400">
              Payment Already Completed
            </h2>

            <p className="text-sm text-white/60">
              {details.message ?? "Your payment has already been completed."}
            </p>
          </div>
        )}

        {!isDetailsLoading && details && !details.alreadyPaid && (
          <>
            <h2 className="mb-1 text-center text-2xl font-semibold text-amber-400">
              Complete Your Membership Payment
            </h2>

            <p className="mb-8 text-center text-sm text-white/50">
              Hello {details.user.fullName}, confirm your plan below to
              activate your account.
            </p>

            <div className="mb-6 space-y-3 rounded-2xl border border-amber-400/10 bg-white/5 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Role</span>
                <span className="text-white">{details.user.role}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Access</span>
                <span className="text-white">{details.user.accessTo}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Duration</span>
                <span className="text-white">
                  {details.user.durationMonths} months
                </span>
              </div>

              {details.pricing && (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">
                      Total Amount
                    </span>
                    <span className="text-lg font-semibold text-amber-400">
                      {details.pricing.totalFirstPaymentFormatted}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/60">
                Discount Code (optional)
              </label>

              <input
                className="w-full rounded-xl border border-amber-400/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter discount code"
              />
            </div>

            {checkoutError && (
              <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
                {checkoutError}
              </div>
            )}

            <button
              type="button"
              onClick={handlePayNow}
              disabled={isCheckoutLoading}
              className="w-full cursor-pointer rounded-xl bg-amber-400 px-8 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckoutLoading ? "Redirecting to payment..." : "Pay Now"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}