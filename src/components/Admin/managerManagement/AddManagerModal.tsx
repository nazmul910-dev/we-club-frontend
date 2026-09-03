"use client";

import { useState, useMemo } from "react";
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
import {
  CreateManagerPayload,
  CreatableAdminRole,
  CREATABLE_ROLES_BY_CURRENT_ROLE,
  ROLE_LABELS,
} from "@/lib/features/addManager/managerTypes";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

const emptyForm: CreateManagerPayload = {
  fullName: "",
  email: "",
  password: "",
  role: "co_mentor",
  accessTo: "we_command_center",
};

const isValidEmail = (value: string) => {
  const normalized = value.trim().toLowerCase();
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(
    normalized
  );
};

const validateManagerForm = (form: CreateManagerPayload) => {
  if (!form.fullName.trim()) return "Full name is required.";
  if (!form.email.trim()) return "Email is required.";
  if (!isValidEmail(form.email)) return "Please enter a valid email address.";
  if (form.password.trim().length < 8) return "Password must be at least 8 characters.";
  if (!form.role) return "Please select a role.";
  return null;
};

export default function AddManagerModal() {
  const dispatch = useAppDispatch();

 
  const currentUserRole = useAppSelector((state) => state.authUser?.user?.role) as
    | string
    | undefined;

  const allowedRoles = useMemo(() => {
    if (!currentUserRole) return [];
    return CREATABLE_ROLES_BY_CURRENT_ROLE[currentUserRole] ?? [];
  }, [currentUserRole]);

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
    if (!allowedRoles.includes(form.role)) {
      setError("You are not permitted to create this role.");
      return;
    }

    const validationError = validateManagerForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    };

    const result = await dispatch(createManager(payload));
    setSubmitting(false);

    if (createManager.fulfilled.match(result)) {
      resetAndClose();
    } else {
      setError((result.payload as string) || "Failed to create account. Try again.");
    }
  };

  if (allowedRoles.length === 0) {
    return null;
  }

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
      <DialogTrigger>
        <div className="h-11 rounded-xl cursor-pointer flex justify-center items-center bg-[#c9a84c] px-5 text-sm font-bold text-black shadow-lg transition hover:bg-[#c9a125]">
          <UserPlus className="mr-2 h-4 w-4" />
          <p>Manage Roles</p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Add New Admin</DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            Create an admin account and assign a role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">Full Name</Label>
            <Input
              name="manager-name"
              placeholder="Enter full name"
              value={form.fullName}
              autoComplete="off"
              onChange={(e) => handleChange("fullName", e.target.value)}
              disabled={submitting}
              className="h-11 rounded-xl px-2 border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:ring-[#cfa12396]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">Email Address</Label>
            <Input
              id="email"
              name="manager-email"
              type="email"
              placeholder="Use admin email"
              value={form.email}
              autoComplete="new-email"
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={submitting}
              className="h-11 rounded-xl px-2 border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:ring-[#cfa12396]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="manager-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={form.password}
                autoComplete="new-password"
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={submitting}
                className="h-11 rounded-xl px-2 border-neutral-800 bg-neutral-900 pr-12 text-white placeholder:text-neutral-500 focus-visible:ring-[#cfa12396]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-amber-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) => handleChange("role", value as CreatableAdminRole)}
              disabled={submitting}
            >
              <SelectTrigger className="h-11 rounded-xl border-neutral-800 bg-neutral-900 text-white focus:ring-[#cfa12396]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-neutral-800 bg-neutral-900 text-white">
                {allowedRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-neutral-200">System Access</Label>
            <Select
              value={form.accessTo}
              onValueChange={(value) =>
                handleChange("accessTo", value as CreateManagerPayload["accessTo"])
              }
              disabled={submitting}
            >
              <SelectTrigger className="h-11 rounded-xl border-neutral-800 bg-neutral-900 text-white focus:ring-[#cfa12396]">
                <SelectValue placeholder="Select access type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-neutral-800 bg-neutral-900 text-white">
                <SelectItem value="we_command_center">WE Command Center</SelectItem>
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
            className="h-11 cursor-pointer rounded-xl bg-red-500 font-bold text-white hover:bg-red-600 duration-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-11 rounded-xl cursor-pointer bg-[#c9a84c] px-6 font-bold text-white duration-300 hover:bg-[#cfa123]"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}