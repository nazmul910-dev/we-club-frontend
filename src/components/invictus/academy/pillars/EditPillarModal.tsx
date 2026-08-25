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

interface Props {
  open: boolean;

  onClose: () => void;

  pillar: any;
}

export default function EditPillarDialog({
  open,

  onClose,

  pillar,
}: Props) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",

    tagline: "",

    description: "",

    accentColor: "#C9A84C",

    isPaid: false,

    priceCents: 0,

    currency: "usd",

    stripePriceId: "",
  });

  useEffect(() => {
    if (pillar) {
      setForm({
        title: pillar.title || "",

        tagline: pillar.tagline || "",

        description: pillar.description || "",

        accentColor: pillar.accentColor || "#C9A84C",

        isPaid: pillar.isPaid || false,

        priceCents: pillar.priceCents || 0,

        currency: pillar.currency || "usd",

        stripePriceId: pillar.stripePriceId || "",
      });
    }
  }, [pillar]);

  const submit = async () => {
    if (!pillar) return;

    try {
      setLoading(true);

      await dispatch(
        updatePillar({
          id: pillar._id,

          data: form,
        }),
      ).unwrap();

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">
            Edit Challenge Pillar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Fixed Name */}

          <div>
            <Label>Pillar Name</Label>

            <Input
              className="mt-2 bg-gray-100"
              value={pillar?.name || ""}
              disabled
            />
          </div>

          {/* Fixed Slug */}

          <div>
            <Label>Slug</Label>

            <Input
              className="mt-2 bg-gray-100"
              value={pillar?.slug || ""}
              disabled
            />
          </div>

          {/* Title */}

          <div>
            <Label>Title</Label>

            <Input
              className="mt-2"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,

                  title: e.target.value,
                })
              }
            />
          </div>

          {/* Tagline */}

          <div>
            <Label>Tagline</Label>

            <Input
              className="mt-2"
              value={form.tagline}
              onChange={(e) =>
                setForm({
                  ...form,

                  tagline: e.target.value,
                })
              }
            />
          </div>

          {/* Description */}

          <div>
            <Label>Description</Label>

            <Textarea
              className="mt-2 min-h-[120px]"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,

                  description: e.target.value,
                })
              }
            />
          </div>

          {/* Accent Color */}

          <div>
            <Label>Accent Color</Label>

            <Input
              className="mt-2"
              value={form.accentColor}
              onChange={(e) =>
                setForm({
                  ...form,

                  accentColor: e.target.value,
                })
              }
            />
          </div>

          {/* Paid Toggle */}

          <div className="flex items-center justify-between rounded-xl border border-[#E7DDCC] p-4">
            <div>
              <p className="font-medium">Paid Pillar</p>

              <p className="text-sm text-gray-500">Enable premium access</p>
            </div>

            <Switch
              className="cursor-pointer"
              checked={form.isPaid}
              onCheckedChange={(value) =>
                setForm({
                  ...form,

                  isPaid: value,

                  priceCents: value ? form.priceCents : 0,
                })
              }
            />
          </div>

          {/* Price */}

          {form.isPaid && (
            <div>
              <Label>Price (Cents)</Label>

              <Input
                type="number"
                className="mt-2"
                value={form.priceCents}
                onChange={(e) =>
                  setForm({
                    ...form,

                    priceCents: Number(e.target.value),
                  })
                }
              />
            </div>
          )}

          {/* Stripe Price ID */}

          {form.isPaid && (
            <div>
              <Label>Stripe Price ID</Label>

              <Input
                className="mt-2"
                placeholder="price_xxxxx"
                value={form.stripePriceId}
                onChange={(e) =>
                  setForm({
                    ...form,

                    stripePriceId: e.target.value,
                  })
                }
              />
            </div>
          )}
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
