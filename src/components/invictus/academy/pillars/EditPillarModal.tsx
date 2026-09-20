"use client";

import { useEffect, useState } from "react";

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
import { updatePillar } from "@/lib/features/invictus/academy/pillar/pillarSlice";
import type { ChallengePillar } from "@/lib/features/invictus/academy/pillar/pillarTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  pillar: ChallengePillar | null;
}

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

const buildFormFromPillar = (pillar: ChallengePillar | null) => ({
  title: pillar?.title || "",
  tagline: pillar?.tagline || "",
  description: pillar?.description || "",
  accentColor: pillar?.accentColor || "#C9A84C",
  isPaid: pillar?.isPaid || false,
  priceCents: pillar?.priceCents || 0,
  currency: (pillar?.currency || "usd") as "usd",
  stripePriceId: pillar?.stripePriceId || "",
});

export default function EditPillarDialog({ open, onClose, pillar }: Props) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(buildFormFromPillar(pillar));

  useEffect(() => {
    setForm(buildFormFromPillar(pillar));
    setErrors({});
  }, [pillar]);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.title.trim() || form.title.trim().length < 2)
      next.title = "Title minimum 2 charecter ";
    else if (form.title.trim().length > 150)
      next.title = "Title সর্বোচ্চ ১৫০ ক্যারেক্টার";

    if (!form.tagline.trim() || form.tagline.trim().length < 2)
      next.tagline = "Tagline minimum 2 charecter";
    else if (form.tagline.trim().length > 250)
      next.tagline = "Tagline maximum 250 charecter";

    if (!form.description.trim() || form.description.trim().length < 10)
      next.description = "Description minimum 10 charecter ";
    else if (form.description.trim().length > 3000)
      next.description = "Description maximum 3000 charecter";

    if (!HEX_COLOR_REGEX.test(form.accentColor))
      next.accentColor = "Input valid HEX color (Example: #C9A84C)";

    if (form.isPaid) {
      const hasPrice = form.priceCents > 0;
      const hasStripeId = form.stripePriceId.trim().length >= 3;
      if (!hasPrice && !hasStripeId)
        next.priceCents = "Price or Stripe Price ID ";
    }

    if (form.stripePriceId.trim() && form.stripePriceId.trim().length < 3)
      next.stripePriceId = "Stripe Price ID minimum 3 charecter";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!pillar) return;
    if (!validate()) return;

    try {
      setLoading(true);

      const data = {
        title: form.title.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        accentColor: form.accentColor,
        isPaid: form.isPaid,
        priceCents: form.isPaid ? form.priceCents : 0,
        currency: form.currency,
        stripePriceId: form.stripePriceId.trim() || null,
      };

      await dispatch(updatePillar({ id: pillar._id, data })).unwrap();
      onClose();
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        form: error?.message || "Pillar uplate failed, try again!",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">Edit Challenge Pillar</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Pillar Name</Label>
            <Input className="mt-2 px-2 bg-gray-100" value={pillar?.name || ""} disabled />
          </div>

          <div>
            <Label>Slug</Label>
            <Input className="mt-2 px-2 bg-gray-100" value={pillar?.slug || ""} disabled />
          </div>

          <div>
            <Label>Title</Label>
            <Input
              className="mt-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <Label>Tagline</Label>
            <Input
              className="mt-2"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
            {errors.tagline && <p className="mt-1 text-xs text-red-500">{errors.tagline}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-2 min-h-[120px]"
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
                className="h-8 w-8 cursor-pointer rounded-full relative overflow-hidden border border-[#E7DDCC]"
                value={form.accentColor}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
              />
              <Input
                className=" px-2"
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
                  type="number"
                  min={0}
                  className="mt-2"
                  value={form.priceCents}
                  onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })}
                />
                {errors.priceCents && (
                  <p className="mt-1 text-xs text-red-500">{errors.priceCents}</p>
                )}
              </div>

              <div>
                <Label>Stripe Price ID (Optional)</Label>
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
        </div>

        <DialogFooter>
          <Button
            disabled={loading}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
            onClick={submit}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}