"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { createPillar } from "@/lib/features/invictus/academy/pillar/pillarSlice";
import {
  PILLAR_NAMES,
  PILLAR_RULES,
  type PillarName,
} from "@/lib/features/invictus/academy/pillar/pillarTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  usedNames: PillarName[];
}

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

const emptyForm = {
  name: "" as PillarName | "",
  slug: "",
  title: "",
  tagline: "",
  description: "",
  icon: "",
  order: 0,
  accentColor: "#C9A84C",
  isPaid: false,
  priceCents: 0,
  currency: "usd" as const,
  stripePriceId: "",
};

export default function CreatePillarDialog({ open, onClose, usedNames }: Props) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(emptyForm);

  const availableNames = useMemo(
    () => PILLAR_NAMES.filter((name) => !usedNames.includes(name)),
    [usedNames],
  );

  const handlePillarChange = (value: string) => {
    const rule = PILLAR_RULES[value as PillarName];
    setForm((prev) => ({
      ...prev,
      name: value as PillarName,
      slug: rule.slug,
      icon: rule.icon,
      order: rule.order,
    }));
    setErrors((prev) => ({ ...prev, name: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.name) next.name = "Pillar select";

    if (!form.title.trim() || form.title.trim().length < 2)
      next.title = "Title minimum 2 charecter";
    else if (form.title.trim().length > 150)
      next.title = "Title maximum 150 charecter";

    if (!form.tagline.trim() || form.tagline.trim().length < 2)
      next.tagline = "Tagline minimum 2 charecter ";
    else if (form.tagline.trim().length > 250)
      next.tagline = "Tagline maximum 250 charecter";

    if (!form.description.trim() || form.description.trim().length < 10)
      next.description = "Description minimum 10 charecter ";
    else if (form.description.trim().length > 3000)
      next.description = "Description maximum 3000 charecter";

    if (!HEX_COLOR_REGEX.test(form.accentColor))
      next.accentColor = "Need to valid HEX color";

    if (form.isPaid) {
      const hasPrice = form.priceCents > 0;
      const hasStripeId = form.stripePriceId.trim().length >= 3;
      if (!hasPrice && !hasStripeId)
        next.priceCents = "Enter Price or Stripe Price ID ";
    }

    if (form.stripePriceId.trim() && form.stripePriceId.trim().length < 3)
      next.stripePriceId = "Stripe Price ID want minimum 3 charecter";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => setForm(emptyForm);

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        name: form.name as PillarName,
        slug: form.slug as "fearless" | "limitless" | "borderless",
        title: form.title.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        icon: form.icon as "crown" | "infinity" | "globe",
        order: form.order,
        accentColor: form.accentColor,
        isPaid: form.isPaid,
        priceCents: form.isPaid ? form.priceCents : 0,
        currency: form.currency,
        stripePriceId: form.stripePriceId.trim() || undefined,
      };

      await dispatch(createPillar(payload)).unwrap();

      onClose();
      resetForm();
      setErrors({});
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        form: error?.message || "Pillar not ready, try again later!",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">Create Challenge Pillar</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {availableNames.length === 0 ? (
            <p className="rounded-xl bg-[#F3E9D2] p-4 text-sm text-[#B08A3E]">
              Already all pillars (FEARLESS, LIMITLESS, BORDERLESS) ready.
              
            </p>
          ) : (
            <>
              <div>
                <Label>Pillar Name</Label>
                <select
                  className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3"
                  value={form.name}
                  onChange={(e) => handlePillarChange(e.target.value)}
                >
                  <option value="">Select Pillar</option>
                  {availableNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  className="mt-2"
                  placeholder="Enter pillar title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              <div>
                <Label>Tagline</Label>
                <Input
                  className="mt-2"
                  placeholder="Enter short tagline"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
                {errors.tagline && <p className="mt-1 text-xs text-red-500">{errors.tagline}</p>}
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  className="mt-2 min-h-[120px]"
                  placeholder="Enter pillar description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                )}
              </div>

              <div>
                <Label>Accent Color</Label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="color"
                    className="h-10 w-12 cursor-pointer rounded-lg border border-[#E7DDCC]"
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  />
                  <Input
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  />
                </div>
                {errors.accentColor && (
                  <p className="mt-1 text-xs text-red-500">{errors.accentColor}</p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#E7DDCC] p-4">
                <div>
                  <p className="font-medium">Paid Pillar</p>
                  <p className="text-sm text-gray-500">Enable premium access</p>
                </div>
                <Switch
                  className="cursor-pointer"
                  checked={form.isPaid}
                  onCheckedChange={(value) =>
                    setForm({ ...form, isPaid: value, priceCents: value ? form.priceCents : 0 })
                  }
                />
              </div>

              {form.isPaid && (
                <>
                  <div>
                    <Label>Price (Cents)</Label>
                    <Input
                      className="mt-2"
                      type="number"
                      min={0}
                      placeholder="Example: 1000 = $10"
                      value={form.priceCents}
                      onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })}
                    />
                    {errors.priceCents && (
                      <p className="mt-1 text-xs text-red-500">{errors.priceCents}</p>
                    )}
                  </div>

                  <div>
                    <Label>Stripe Price ID (optional)</Label>
                    <Input
                      className="mt-2"
                      placeholder="price_xxxxx"
                      value={form.stripePriceId}
                      onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })}
                    />
                    {errors.stripePriceId && (
                      <p className="mt-1 text-xs text-red-500">{errors.stripePriceId}</p>
                    )}
                  </div>
                </>
              )}

              {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            disabled={loading || availableNames.length === 0}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
            onClick={submit}
          >
            {loading ? "Creating..." : "Create Pillar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}