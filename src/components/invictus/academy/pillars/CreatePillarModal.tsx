"use client";

import { useState } from "react";

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

interface Props {
  open: boolean;
  onClose: () => void;
}

const pillarOptions = {
  FEARLESS: {
    slug: "fearless",
    icon: "crown",
    order: 1,
  },

  LIMITLESS: {
    slug: "limitless",
    icon: "infinity",
    order: 2,
  },

  BORDERLESS: {
    slug: "borderless",
    icon: "globe",
    order: 3,
  },
} as const;

export default function CreatePillarDialog({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",

    slug: "",

    title: "",

    tagline: "",

    description: "",

    icon: "",

    order: 1,

    accentColor: "#C9A84C",

    isPaid: false,

    priceCents: 0,

    currency: "usd",

    stripePriceId: "",
  });

  const handlePillarChange = (value: string) => {
    const selected = pillarOptions[value as keyof typeof pillarOptions];

    setForm({
      ...form,

      name: value,

      slug: selected.slug,

      icon: selected.icon,

      order: selected.order,
    });
  };

  const submit = async () => {
    if (!form.name || !form.title || !form.tagline || !form.description) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(createPillar(form)).unwrap();

      onClose();

      setForm({
        name: "",

        slug: "",

        title: "",

        tagline: "",

        description: "",

        icon: "",

        order: 1,

        accentColor: "#C9A84C",

        isPaid: false,

        priceCents: 0,

        currency: "usd",

        stripePriceId: "",
      });
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
            Create Challenge Pillar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* PILLAR NAME */}

          <div>
            <Label>Pillar Name</Label>

            <select
              className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3"
              value={form.name}
              onChange={(e) => handlePillarChange(e.target.value)}
            >
              <option value="">Select Pillar</option>

              <option value="FEARLESS">FEARLESS</option>

              <option value="LIMITLESS">LIMITLESS</option>

              <option value="BORDERLESS">BORDERLESS</option>
            </select>
          </div>

          {/* TITLE */}

          <div>
            <Label>Title</Label>

            <Input
              className="mt-2"
              placeholder="Enter pillar title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,

                  title: e.target.value,
                })
              }
            />
          </div>

          {/* TAGLINE */}

          <div>
            <Label>Tagline</Label>

            <Input
              className="mt-2"
              placeholder="Enter short tagline"
              value={form.tagline}
              onChange={(e) =>
                setForm({
                  ...form,

                  tagline: e.target.value,
                })
              }
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <Label>Description</Label>

            <Textarea
              className="mt-2 min-h-[120px]"
              placeholder="Enter pillar description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,

                  description: e.target.value,
                })
              }
            />
          </div>

          {/* ACCENT COLOR */}

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

          {/* PAID */}

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

          {/* PRICE */}

          {form.isPaid && (
            <div>
              <Label>Price (Cents)</Label>

              <Input
                className="mt-2"
                type="number"
                placeholder="Example: 1000 = $10"
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
        </div>

        <DialogFooter>
          <Button
            disabled={loading}
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
