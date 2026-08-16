"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

interface RegistrationSuccessModalProps {
  open: boolean;
}

export default function RegistrationSuccessModal({
  open,
}: RegistrationSuccessModalProps) {
  const router = useRouter();

  if (!open) {
    return null;
  }

  const handleOk = () => {
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl border border-amber-400/20 bg-black/60 p-8 text-center backdrop-blur-[10px]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10">
          <CheckCircle2 className="h-8 w-8 text-amber-400" />
        </div>

        <h2 className="mb-3 text-2xl font-semibold text-amber-400">
          Registration Received
        </h2>

        <p className="mb-8 text-sm leading-relaxed text-white/60">
          Thank you for registering. The World Elite team will review your
          information shortly. Please wait a moment — you will receive an
          email once your account is reviewed and a payment link is
          available.
        </p>

        <button
          type="button"
          onClick={handleOk}
          className="w-full cursor-pointer rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
        >
          OK
        </button>
      </div>
    </div>
  );
}