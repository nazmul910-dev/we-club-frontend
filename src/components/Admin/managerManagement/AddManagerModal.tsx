
"use client";

import { useState } from "react";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createManager } from "@/lib/features/addManager/ManagerApi";
import { CreateManagerPayload } from "@/lib/features/addManager/managerTypes";
import { useAppDispatch } from "@/lib/redux/store/hook";

const emptyForm: CreateManagerPayload = {
  fullName: "",
  email: "",
  password: "",
  role: "manager",
  accessTo: "we_command_center",
};

export default function AddManagerModal() {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<CreateManagerPayload>(emptyForm);

  const handleChange = (field: keyof CreateManagerPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetAndClose = () => {
    setForm(emptyForm);
    setError(null);
    setShowPassword(false);
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Full name, email, and password are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await dispatch(createManager(form));

    setSubmitting(false);

    if (createManager.fulfilled.match(result)) {
      resetAndClose();
    } else {
      setError(
        (result.payload as string) || "Failed to create manager. Try again."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!submitting) {
          setOpen(next);
          if (!next) {
            setForm(emptyForm);
            setError(null);
            setShowPassword(false);
          }
        }
      }}
    >
      <DialogTrigger >
        <div className="h-11 rounded-xl bg-[#c9a84c] px-5 text-sm font-bold text-black shadow-lg transition hover:bg-[#c9a125]">
          <UserPlus className="mr-2 h-4 w-4" />
          <p className="">Add Manager</p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Add New Manager
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            Create a manager account and assign system access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">
              Full Name
            </Label>
            <Input
              name="manager-name"
              placeholder="Enter manager full name"
              value={form.fullName}
              autoComplete="off"
              onChange={(e) => handleChange("fullName", e.target.value)}
              disabled={submitting}
              className="h-11 rounded-xl border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:ring-[#cfa12396]"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">
              Email Address
            </Label>
            <Input
              id="email"
              name="manager-email"
              type="email"
              placeholder="Use your manager email"
              value={form.email}
              autoComplete="new-email"
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={submitting}
              className="h-11 rounded-xl border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:ring-[#cfa12396]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="manager-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create manager password"
                value={form.password}
                autoComplete="new-password"
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={submitting}
                className="h-11 rounded-xl border-neutral-800 bg-neutral-900 pr-12 text-white placeholder:text-neutral-500 focus-visible:ring-[#cfa12396]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-amber-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Access */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">
              System Access
            </Label>
            <Select
              value={form.accessTo}
              onValueChange={(value) =>
                handleChange(
                  "accessTo",
                  value as CreateManagerPayload["accessTo"]
                )
              }
              disabled={submitting}
            >
              <SelectTrigger className="h-11 rounded-xl border-neutral-800 bg-neutral-900 text-white focus:ring-[#cfa12396]">
                <SelectValue placeholder="Select access type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-neutral-800 bg-neutral-900 text-white">
                <SelectItem value="we_command_center">
                  WE Command Center
                </SelectItem>
                <SelectItem value="invictus">Invictus</SelectItem>
                <SelectItem value="both">Both Platforms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="ghost"
            onClick={resetAndClose}
            disabled={submitting}
            className="h-11 rounded-xl font-bold text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-11 rounded-xl bg-[#c9a84c] px-6 font-bold text-black hover:bg-[#cfa123]"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Manager
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}