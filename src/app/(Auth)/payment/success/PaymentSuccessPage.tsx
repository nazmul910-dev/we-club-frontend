"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import BgImage from "@/assets/Login/login-bg.jpg";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"verifying" | "error">("verifying");

  useEffect(() => {
    const verify = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        router.push("/");
        return;
      }

      try {
        await axios.get(
          `https://we-club.onrender.com/api/v1/payments/verify-session/${sessionId}`,
          { timeout: 15000 }
        );

        router.push("/confirm-mail");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    verify();
  }, [router, searchParams]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Image
        src={BgImage}
        alt="Background"
        fill
        priority
        className="absolute inset-0 object-cover"
      />

      <div className="relative z-20 flex h-52 w-52 flex-col items-center justify-center gap-4 rounded-2xl border border-amber-600/20 bg-transparent backdrop-blur-[3px] md:h-100 md:w-100">
        <h2 className="text-center text-xl font-bold text-white font-playfair md:text-2xl">
          {status === "verifying"
            ? "Verifying your payment..."
            : "Something went wrong"}
        </h2>

        {status === "error" && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl border border-amber-400/40 px-4 py-2 text-sm text-amber-400 transition hover:border-amber-400"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}