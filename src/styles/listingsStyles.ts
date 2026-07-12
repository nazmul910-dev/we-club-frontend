// Single source of truth for listing-status colors, shared between
// ListingCard's badge and ListingDetailsModal's badge — previously this
// exact 4-way ternary chain (active/pending/draft/sold/fallback) was
// duplicated twice inline in ListingCard's JSX (once for the badge
// background/border/text, once for the small status dot), which meant
// updating a color meant editing two places and risking them drifting out
// of sync. Now it's one object, looked up once.

export const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  active: {
    badge: "text-green-800 border-green-400/30 bg-green-400/30",
    dot: "bg-green-400",
  },
  pending: {
    badge: "text-yellow-800 border-yellow-400/30 bg-yellow-400/50",
    dot: "bg-yellow-400",
  },
  draft: {
    badge: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    dot: "bg-blue-400",
  },
  sold: {
    badge: "text-red-400 border-red-400/30 bg-red-400/10",
    dot: "bg-red-400",
  },
};

export const DEFAULT_STATUS_STYLE = {
  badge: "text-white/50 border-white/10 bg-white/5",
  dot: "bg-white/40",
};