"use client";

import { useState } from "react";
import { useAppDispatch } from "@/lib/redux/store/hook";
import { forgotPassword } from "@/lib/features/auth/authApi";

import Link from "next/link";
import Image from "next/image";
import BgImage from "@/assets/Login/login-bg.jpg";

export default function ForgetPassword() {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setMessage("Reset link sent to your email");
      setIsError(false);
    } catch (err: any) {
      setMessage(
        typeof err === "string" ? err : err?.message || "Something went wrong"
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">
      {/* Background image */}
      <Image
        src={BgImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md space-y-6 rounded-3xl border border-yellow-500/20 bg-white/5 p-10 shadow-2xl backdrop-blur-md"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-amber-400">
            Forgot Password
          </h2>
          <p className="text-sm text-white/50">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="space-y-1">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-amber-400/20 bg-transparent px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-xl bg-amber-400 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              isError ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}

        <Link
          href="/login"
          className="block text-center text-sm text-amber-400 transition hover:text-amber-300"
        >
          Back to Login
        </Link>
      </form>
    </section>
  );
}