"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "../ui/button";

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
  option:string;
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
    option: "Option 1",
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
    option: "Option 2",
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
  // {
  //   value: "tier_3",
  //   title: "Discreet Marketing",
  //   description: "Off-market. Whispered; never broadcast.",
  //   accent: "gold-soft",
  //   bullets: [
  //     "Address withheld until NDA signed",
  //     "Exterior photography only",
  //     "1:1 introductions only — no decks",
  //     "All inquiries routed through Associate",
  //   ],
  // },
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
      <DialogContent className="max-w-6xl w-full sm:min-w-2xl md:min-w-3xl lg:min-w-4xl   bg-gold-soft backdrop:blur-2xl ">
        <DialogHeader>
          <h2 className="text-xl font-semibold text-white">
            Assign Sharing Permission
          </h2>
          <p className="text-sm text-muted/70 ">
            Determine how this promoter may present the property. Revocable at
            any time.
          </p>
        </DialogHeader>

        <div className="flex  lg:grid  sm:grid-cols-3 overflow-auto w-full  gap-4 py-6">
          {TIER_OPTIONS.map((tier) => {
            const isSelected = selectedTier === tier.value;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => onSelectTier(tier.value)}
                className={`rounded-2xl border w-full cursor-pointer min-w-[300] md:min-w-auto p-4 transition text-left  shadow-2xl  backdrop-blur-lg ${
                  isSelected
                    ? tier.accent === "gold"
                      ? "border-gold bg-gold/10"
                      : "border-gold-soft bg-gold-soft/10"
                    : "border-gold-soft/30 hover:border-gold-soft/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-ui uppercase tracking-wider text-white/80 `}
                  >
                    {tier.option} 
                  </span>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-gold bg-gold" : "border-gold-soft/30"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gold mb-2">
                  {tier.title}
                </h3>
                <p className="text-xs text-muted/70 mb-3">{tier.description}</p>
                <ul className="text-xs text-muted/70 space-y-1">
                  {tier.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center w-full gap-4">
          <Button
            variant="outline"
            onClickCapture={() => onOpenChange(false)}
            className="rounded-2xl cursor-pointer bg-white/80"
          >
            Cancel
          </Button>

          <Button
            disabled={isConfirming}
            onClick={onConfirm}
            type="button"
            className="rounded-2xl bg-gold cursor-pointer hover:bg-yellow-600"
          >
            {" "}
            {isConfirming ? "Confirming..." : "Confirm Marketing Permission"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
