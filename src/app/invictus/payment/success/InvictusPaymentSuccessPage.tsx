"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  BookOpen,
  RefreshCw,
  Home,
} from "lucide-react";
import api from "@/lib/api/api";
import { useAppDispatch } from "@/lib/redux/store/hook";
import { fetchMyEntitlements } from "@/lib/features/invictus/academy/entitlement/entitlementSlice";
import { fetchMyInvictusPurchases } from "@/lib/features/invictus/payment/invictusPaymentSlice";

type VerificationStatus = "verifying" | "success" | "error" | "no_session";

export default function InvictusPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(8);
  const [isAutoRedirectPaused, setIsAutoRedirectPaused] = useState(false);

  const sessionId = searchParams.get("session_id");

  const verifyPayment = useCallback(async () => {
    if (!sessionId) {
      setStatus("no_session");
      return;
    }

    setStatus("verifying");
    setErrorMessage(null);

    try {
      // Verify session via backend
      const response = await api.get(`/payments/verify-session/${sessionId}`);

      if (response.data?.success || response.data?.data?.paid || response.status === 200) {
        // Refresh entitlements and purchase history in Redux store
        try {
          await Promise.all([
            dispatch(fetchMyEntitlements()),
            dispatch(fetchMyInvictusPurchases()),
          ]);
        } catch {
          // Non-blocking if entitlements fetch encounters a minor issue
        }
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(
          response.data?.message || "Payment verification could not be completed."
        );
      }
    } catch (err: any) {
      console.error("Payment verification error:", err);
      // If error still indicates paid or already verified, handle gracefully
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while verifying your payment.";

      // If backend says already paid or webhook succeeded earlier
      if (err?.response?.status === 200) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(msg);
      }
    }
  }, [sessionId, dispatch]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  // Countdown timer for automatic redirect
  useEffect(() => {
    if (status !== "success" || isAutoRedirectPaused) return;

    if (countdown <= 0) {
      router.push("/invictus/invictus-challenge");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [status, countdown, isAutoRedirectPaused, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4 py-12">
      {/* Decorative luxury background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#B18A3A]/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#C9A84C]/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Verifying State */}
        {status === "verifying" && (
          <div className="overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white p-8 text-center shadow-lg md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#B18A3A]/30 bg-[#B18A3A]/10 text-[#B18A3A]">
              <Loader2 className="h-10 w-10 animate-spin text-[#B18A3A]" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[4px] text-[#B18A3A]">
              INVICTUS ACADEMY
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#171717] md:text-3xl">
              Verifying Your Payment
            </h1>
            <p className="mt-3 text-sm text-[#8A8175] leading-relaxed">
              Please wait while we confirm your transaction and activate your access...
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#8A8175]">
              <ShieldCheck className="h-4 w-4 text-[#B18A3A]" />
              <span>Secured with 256-bit Stripe encryption</span>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white shadow-xl transition-all">
            {/* Top gold ribbon / banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#171717] via-[#2A2318] to-[#171717] px-8 py-8 text-center text-white">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#B18A3A]/20 blur-2xl" />
              <div className="absolute left-0 bottom-0 h-24 w-24 rounded-full bg-[#C9A84C]/15 blur-2xl" />

              <div className="relative z-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C9A84C]/40 bg-[#B18A3A]/20 text-[#E5C368] shadow-inner">
                  <CheckCircle2 className="h-9 w-9 text-[#E5C368]" />
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#B18A3A]/40 bg-[#B18A3A]/20 px-3 py-1 text-xs font-semibold tracking-wider text-[#E5C368] uppercase">
                  <Sparkles className="h-3 w-3" />
                  Access Granted
                </div>

                <h1 className="mt-3 font-serif text-2xl font-bold md:text-3xl">
                  Payment Successful!
                </h1>
                <p className="mt-2 text-sm text-white/70">
                  Your Invictus Challenge access has been activated successfully.
                </p>
              </div>
            </div>

            {/* Content body */}
            <div className="p-8 space-y-6">
              {/* Feature highlights */}
              <div className="rounded-2xl border border-[#E8DDCA] bg-[#FAF8F3] p-5">
                <p className="text-xs font-semibold uppercase tracking-[3px] text-[#B18A3A] mb-3">
                  Unlocked Privileges
                </p>
                <div className="space-y-2.5">
                  {[
                    {
                      icon: Award,
                      text: "Full access to challenge video lessons & curriculum",
                    },
                    {
                      icon: BookOpen,
                      text: "Action guides, downloadable resources & quizzes",
                    },
                    {
                      icon: ShieldCheck,
                      text: "Verifiable Invictus Certificate upon completion",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 text-sm text-[#4A4A4A]">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#B18A3A]/10 text-[#B18A3A]">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Session ID info */}
              {sessionId && (
                <div className="flex items-center justify-between text-xs text-[#8A8175] border-t border-[#E8DDCA] pt-4">
                  <span>Transaction Reference:</span>
                  <span className="font-mono text-[#171717] bg-[#FAF8F3] px-2 py-1 rounded border border-[#E8DDCA]">
                    {sessionId.slice(0, 18)}...
                  </span>
                </div>
              )}

              {/* Countdown notification */}
              <div className="flex items-center justify-between rounded-xl bg-[#F4EFE6] px-4 py-2.5 text-xs text-[#8A8175]">
                <span>
                  Redirecting to challenge in{" "}
                  <strong className="text-[#171717] font-semibold">{countdown}s</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAutoRedirectPaused((p) => !p)}
                  className="font-medium text-[#B18A3A] hover:underline cursor-pointer"
                >
                  {isAutoRedirectPaused ? "Resume" : "Pause"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/invictus/invictus-challenge"
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#B18A3A] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#997734] shadow-md text-center"
                >
                  Go to Challenge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href="/invictus/academy"
                  className="flex-1 inline-flex items-center justify-center rounded-xl border border-[#C8B89A] bg-white px-6 py-3.5 text-sm font-semibold text-[#4A4A4A] transition-all hover:border-[#B18A3A] hover:bg-[#FAF8F3] text-center"
                >
                  <BookOpen className="mr-2 h-4 w-4 text-[#B18A3A]" />
                  Academy Hub
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="overflow-hidden rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[4px] text-red-500">
              Verification Notice
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#171717] md:text-3xl">
              Could Not Verify Payment
            </h1>
            <p className="mt-3 text-sm text-[#8A8175] leading-relaxed">
              {errorMessage ||
                "We were unable to verify your payment status automatically. If you were charged, your access will be activated once the webhook completes."}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={verifyPayment}
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#B18A3A] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#997734] cursor-pointer"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Verification
              </button>
              <Link
                href="/invictus/invictus-challenge"
                className="flex-1 inline-flex items-center justify-center rounded-xl border border-[#C8B89A] bg-white px-6 py-3.5 text-sm font-semibold text-[#4A4A4A] hover:bg-[#FAF8F3] text-center"
              >
                <Home className="mr-2 h-4 w-4" />
                Return to Challenge
              </Link>
            </div>
          </div>
        )}

        {/* No Session State */}
        {status === "no_session" && (
          <div className="overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white p-8 text-center shadow-xl md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#E8DDCA] bg-[#FAF8F3] text-[#8A8175]">
              <BookOpen className="h-10 w-10 text-[#B18A3A]" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[4px] text-[#B18A3A]">
              INVICTUS ACADEMY
            </p>
            <h1 className="mt-2 font-serif text-2xl font-bold text-[#171717] md:text-3xl">
              No Payment Session Found
            </h1>
            <p className="mt-3 text-sm text-[#8A8175] leading-relaxed">
              It seems you accessed this page directly without an active checkout session.
            </p>

            <div className="mt-8">
              <Link
                href="/invictus/invictus-challenge"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#B18A3A] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#997734]"
              >
                Explore Invictus Challenge
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
