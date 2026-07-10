"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { changePassword } from "@/lib/features/auth/authApi";
import BgImage from "@/assets/Login/login-bg.jpg";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-xl border border-amber-400/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-white/60";

export default function ChangePassword() {
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await toast.promise(dispatch(changePassword(formData)).unwrap(), {
        loading: "Changing password...",

        success: () => {
          setFormData({
            oldPassword: "",
            newPassword: "",
          });

          return "Password changed successfully.";
        },

        error: (error) => {
          if (typeof error === "string") {
            return error;
          }

          return error?.message || "Password change failed. Please try again.";
        },
      });
    } catch {
      // toast.promise handles the error automatically.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-semibold text-amber-400">
          Change Password
        </h2>

        <p className="mt-2 text-center text-sm text-white/50">
          Update your account password
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>Old Password *</label>

          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              {showOld ? (
                <EyeOff className="text-amber-400" />
              ) : (
                <Eye className="text-amber-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>New Password *</label>

          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass}
            />

            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              {showNew ? (
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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Changing...
          </>
        ) : (
          "Change Password"
        )}
      </button>
    </form>
  );
}