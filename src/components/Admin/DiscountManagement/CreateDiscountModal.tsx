"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { createDiscountCode } from "@/lib/features/discountFounder/discountSlice";
import {
  DiscountUserRole,
  DiscountAccessTo,
} from "@/lib/features/discountFounder/discount.interface";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLE_OPTIONS: { value: DiscountUserRole; label: string }[] = [
  { value: "associate", label: "Associate" },
  { value: "partner", label: "Partner" },
  { value: "ambassador", label: "Ambassador" },
  { value: "ceo", label: "CEO" },
  { value: "ceo_partner", label: "CEO Partner" },
  { value: "we_club_member", label: "WE Club Member" },
];

const ACCESS_OPTIONS: { value: DiscountAccessTo; label: string }[] = [
  { value: "we_command_center", label: "We Command Center" },
  { value: "invictus", label: "Invictus" },
  { value: "both", label: "Both" },
];

const inputClass =
  "w-full rounded-xl border border-yellow-500/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wider text-white/50";

export default function CreateDiscountModal({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();

  const isCreating = useAppSelector((state) => state.discount.isCreating);

  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [note, setNote] = useState("");
  const [allowedRoles, setAllowedRoles] = useState<DiscountUserRole[]>([]);
  const [allowedAccessTo, setAllowedAccessTo] = useState<DiscountAccessTo[]>(
    []
  );
  const [error, setError] = useState("");

  const toggleRole = (role: DiscountUserRole) => {
    setAllowedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleAccess = (access: DiscountAccessTo) => {
    setAllowedAccessTo((prev) =>
      prev.includes(access)
        ? prev.filter((a) => a !== access)
        : [...prev, access]
    );
  };

  const resetForm = () => {
    setCode("");
    setDiscountPercent("");
    setExpiresAt("");
    setNote("");
    setAllowedRoles([]);
    setAllowedAccessTo([]);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");

    if (!code.trim()) {
      setError("Discount code is required.");
      return;
    }

    const percentNum = Number(discountPercent);

    if (!discountPercent || percentNum <= 0 || percentNum > 100) {
      setError("Enter a valid discount percentage (1-100).");
      return;
    }

    try {
      await dispatch(
        createDiscountCode({
          code: code.trim(),
          discountPercent: percentNum,
          allowedRoles: allowedRoles.length ? allowedRoles : undefined,
          allowedAccessTo: allowedAccessTo.length
            ? allowedAccessTo
            : undefined,
          expiresAt: expiresAt
            ? new Date(expiresAt).toISOString()
            : undefined,
          note: note.trim() || undefined,
        })
      ).unwrap();

      toast.success("Discount code created successfully.");
      resetForm();
      onOpenChange(false);
    } catch (e: any) {
      setError(e || "Failed to create discount code.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          resetForm();
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-lg rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Discount Code
          </DialogTitle>

          <DialogDescription className="text-neutral-400">
            Set up a new discount code for registration or upgrade payments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Code *</label>
              <input
                className={inputClass}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="WELCOME10"
              />
            </div>

            <div>
              <label className={labelClass}>Discount % *</label>
              <input
                type="number"
                min={1}
                max={100}
                className={inputClass}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Expires At (optional)</label>
            <input
              type="date"
              className={inputClass}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {/* <div>
            <label className={labelClass}>
              Allowed Roles (optional — leave empty for all roles)
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => toggleRole(role.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs uppercase transition ${
                    allowedRoles.includes(role.value)
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                      : "border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Allowed Access (optional — leave empty for all)
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCESS_OPTIONS.map((access) => (
                <button
                  key={access.value}
                  type="button"
                  onClick={() => toggleAccess(access.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs uppercase transition ${
                    allowedAccessTo.includes(access.value)
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                      : "border-white/10 text-white/50 hover:border-white/30"
                  }`}
                >
                  {access.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Note (optional)</label>
            <textarea
              rows={3}
              className={inputClass}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Internal note about this discount..."
            />
          </div> */}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2 gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="h-11 cursor-pointer rounded-xl border border-neutral-700 px-6 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCreating}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-500 px-6 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating && <Loader2 size={16} className="animate-spin" />}
            {isCreating ? "Creating..." : "Create Discount"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}