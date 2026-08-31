"use client";

import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  prevStep,
  RegistrationFormData,
  updateField,
} from "@/lib/features/auth/authSlice";
import { registerUser } from "@/lib/features/auth/authApi";
import CountrySelect from "./CountrySelect";
import RegistrationSuccessModal from "./RegistrationSuccessModal";

const ROLE_OPTIONS = [
  { value: "associate", label: "Associate" },
  { value: "ceo", label: "CEO" },
  { value: "ceo_partner", label: "CEO Partner" },
  { value: "partner", label: "Partner" },
  { value: "ambassador", label: "Ambassador" },
  { value: "we_club_member", label: "WE Club Member" },
];

const DURATION_OPTIONS: { value: 3 | 6 | 12; label: string }[] = [
  { value: 3, label: "3 Months" },
  { value: 6, label: "6 Months" },
  { value: 12, label: "12 Months" },
];

const PAID_ROLES = ["associate", "partner", "ambassador", "ceo", "ceo_partner","we_club_member"];
const CEO_ROLES = ["ceo", "ceo_partner"];

const inputClass =
  "w-full rounded-xl border border-amber-400/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-white/60";

export default function DetailsStep() {
  const dispatch = useAppDispatch();

  const formData = useAppSelector((state) => state.registration.formData);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = <K extends keyof RegistrationFormData>(
    field: K,
    value: RegistrationFormData[K],
  ) => {
    dispatch(
      updateField({
        field,
        value,
      }),
    );
  };

  const isPaidRole = PAID_ROLES.includes(formData.role);
  const isCeoRole = CEO_ROLES.includes(formData.role);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.role
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (isPaidRole && !isCeoRole && !formData.membershipDurationMonths) {
      setError("Please select a membership duration (3, 6, or 12 months).");
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(registerUser(formData)).unwrap();

      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err ?? "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-center text-3xl font-semibold text-amber-400">
            Create Account
          </h2>

          <p className="mt-2 text-center text-sm text-white/50">
            Selected Access :
            <span className="ml-1 text-amber-400">
              {formData.accessTo === "we_command_center"
                ? "We Command Center"
                : formData.accessTo === "invictus"
                  ? "Invictus"
                  : "We Command Center + Invictus"}
            </span>
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Full Name *</label>

            <input
              className={inputClass}
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className={labelClass}>Email *</label>

            <input
              type="email"
              autoComplete="email"
              className={inputClass}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className={labelClass}>Password *</label>

            <input
              type="password"
              autoComplete="new-password"
              className={inputClass}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className={labelClass}>Role *</label>

            <select
              className={inputClass}
              value={formData.role}
              onChange={(e) => {
                const nextRole = e.target.value as RegistrationFormData["role"];

                handleChange("role", nextRole);

                if (CEO_ROLES.includes(nextRole)) {
                  handleChange("membershipDurationMonths", 12);
                } else {
                  handleChange("membershipDurationMonths", "");
                }
              }}
            >
              <option value="" className="bg-black">
                Select Role
              </option>

              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value} className="bg-black">
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          {isPaidRole && !isCeoRole && (
            <div>
              <label className={labelClass}>Membership Duration *</label>

              <select
                className={inputClass}
                value={formData.membershipDurationMonths}
                onChange={(e) =>
                  handleChange(
                    "membershipDurationMonths",
                    e.target.value
                      ? (Number(
                          e.target.value,
                        ) as RegistrationFormData["membershipDurationMonths"])
                      : "",
                  )
                }
              >
                <option value="" className="bg-black">
                  Select Duration
                </option>

                {DURATION_OPTIONS.map((duration) => (
                  <option
                    key={duration.value}
                    value={duration.value}
                    className="bg-black"
                  >
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isCeoRole && (
            <div>
              <label className={labelClass}>Membership Duration</label>

              <div className="w-full rounded-xl border border-amber-400/20 bg-white/5 px-4 py-3 text-sm text-white/60">
                12 Months (Fixed for {formData.role === "ceo" ? "CEO" : "CEO Partner"})
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>License Number</label>

            <input
              className={inputClass}
              value={formData.licenseNumber}
              onChange={(e) => handleChange("licenseNumber", e.target.value)}
              placeholder="LIC-123"
            />
          </div>

          <div>
            <label className={labelClass}>Phone</label>

            <input
              type="tel"
              className={inputClass}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className={labelClass}>City</label>

            <input
              className={inputClass}
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className={labelClass}>Country</label>

            <CountrySelect
              value={formData.country}
              onChange={(value) => handleChange("country", value)}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => dispatch(prevStep())}
            className="rounded-xl border cursor-pointer border-white/20 px-6 py-3 text-white transition hover:border-white/40"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl cursor-pointer bg-amber-400 px-8 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>

      <RegistrationSuccessModal open={showSuccessModal} />
    </>
  );
}