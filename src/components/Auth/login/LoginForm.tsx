"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { loginUser } from "@/lib/features/auth/authApi";

import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-amber-400/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-white/60";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isSubmitting = useAppSelector(
    (state) => state.registration.isSubmitting,
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const result = await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        }),
      ).unwrap();

      alert("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err || "Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-semibold text-amber-400">
          Welcome Back
        </h2>

        <p className="mt-2 text-center text-sm text-white/50">
          Sign in to your account
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>

          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            className={inputClass}
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password *
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              className={inputClass}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
            >
              {showPassword ? (
                <EyeOff className="text-amber-400" />
              ) : (
                <Eye className="text-amber-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-amber-400 px-8 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>

      <div className="text-center">
        <Link
          href="/forget-password"
          className="
text-sm
text-amber-400
hover:text-amber-300
"
        >
          Forgot password?
        </Link>
        <p className="text-sm text-white/60">
          Don't have an account?{" "}
          <Link
            href="/registration"
            className="text-amber-400 hover:text-amber-300 transition"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </form>
  );
}
