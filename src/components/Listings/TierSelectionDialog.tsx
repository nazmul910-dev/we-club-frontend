"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

type Tier = "tier_1" | "tier_2" | "tier_3";

interface TierSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier: Tier;
  onSelectTier: (tier: Tier) => void;
  onConfirm: () => void;
  isConfirming: boolean;
}

const TIER_OPTIONS: {
  value: Tier;
  title: string;
  description: string;
  bullets: string[];
  // Matches the original inline JSX exactly: tier_1 and tier_3 use the
  // softer gold-soft accent even when selected, only tier_2 uses full gold.
  // Preserved as-is rather than "fixed" since this is a restructure, not a
  // behavior change.
  accent: "gold" | "gold-soft";
}[] = [
  {
    value: "tier_1",
    title: "Full Marketing + Website",
    description: "Maximum reach. Full address and visuals exposed.",
    accent: "gold-soft",
    bullets: [
      "Full address & geolocation revealed",
      "All photography (interior + exterior)",
      "Promoter may publish to their own website",
      "Listing appears in network newsletter",
    ],
  },
  {
    value: "tier_2",
    title: "Full Marketing",
    description: "Distribution to qualified buyers only — no public listing.",
    accent: "gold",
    bullets: [
      "Full address shared with vetted prospects",
      "All photography (interior + exterior)",
      "No public web publication permitted",
      "Print collateral & private decks allowed",
    ],
  },
  {
    value: "tier_3",
    title: "Discreet Marketing",
    description: "Off-market. Whispered; never broadcast.",
    accent: "gold-soft",
    bullets: [
      "Address withheld until NDA signed",
      "Exterior photography only",
      "1:1 introductions only — no decks",
      "All inquiries routed through Associate",
    ],
  },
];

export function TierSelectionDialog({
  open,
  onOpenChange,
  selectedTier,
  onSelectTier,
  onConfirm,
  isConfirming,
}: TierSelectionDialogProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <h2 className="text-xl font-semibold text-white">Assign Sharing Permission</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Determine how this promoter may present the property. Revocable at any
            time.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-6">
          {TIER_OPTIONS.map((tier) => {
            const isSelected = selectedTier === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => onSelectTier(tier.value)}
                className={`rounded-2xl border p-4 transition ${
                  isSelected
                    ? tier.accent === "gold"
                      ? "border-gold bg-gold/10"
                      : "border-gold-soft bg-gold-soft/10"
                    : "border-gold-soft/30 hover:border-gold-soft/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-ui uppercase tracking-wider ${
                      tier.accent === "gold" ? "text-gold" : "text-gold-soft"
                    }`}
                  >
                    Option
                  </span>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-gold bg-gold" : "border-gold-soft/30"
                    }`}
                  >
                    {isSelected && <div className="h-2 w-2 bg-black rounded-full" />}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {tier.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {tier.description}
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {tier.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
            className="rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="rounded-full border border-gold bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-gold/90 disabled:opacity-50"
          >
            {isConfirming ? "Confirming..." : "Confirm Marketing Permission"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}