export const PILLAR_NAMES = ["FEARLESS", "LIMITLESS", "BORDERLESS"] as const;
export const PILLAR_SLUGS = ["fearless", "limitless", "borderless"] as const;
export const PILLAR_ICONS = ["crown", "infinity", "globe"] as const;
export const PILLAR_STATUSES = ["draft", "published", "archived"] as const;
export const INTRO_VIDEO_STATUSES = [
  "not_uploaded",
  "processing",
  "ready",
  "failed",
] as const;

export const MAX_PILLARS = 3;

export const PILLAR_RULES = {
  FEARLESS: { slug: "fearless", icon: "crown", order: 1 },
  LIMITLESS: { slug: "limitless", icon: "infinity", order: 2 },
  BORDERLESS: { slug: "borderless", icon: "globe", order: 3 },
} as const;

export type PillarName = (typeof PILLAR_NAMES)[number];
export type PillarSlug = (typeof PILLAR_SLUGS)[number];
export type PillarIcon = (typeof PILLAR_ICONS)[number];
export type PillarStatus = (typeof PILLAR_STATUSES)[number];
export type IntroVideoStatus = (typeof INTRO_VIDEO_STATUSES)[number];

export interface PillarIntroVideo {
  cloudinaryPublicId?: string;
  cloudinaryAssetId?: string;
  secureUrl?: string;
  playbackUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  format?: string;
  bytes?: number;
  status: IntroVideoStatus;
}

interface PopulatedActor {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

export interface ChallengePillar {
  _id: string;
  name: PillarName;
  slug: PillarSlug;
  title: string;
  tagline: string;
  description: string;
  icon: PillarIcon;
  accentColor: string;
  isPaid: boolean;
  priceCents: number;
  currency: "usd";
  stripePriceId?: string;
  introVideo: PillarIntroVideo;
  order: number;
  status: PillarStatus;
  publishedAt?: string;
  archivedAt?: string;
  createdBy?: PopulatedActor | string;
  updatedBy?: PopulatedActor | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePillarPayload {
  name: PillarName;
  slug: PillarSlug;
  title: string;
  tagline: string;
  description: string;
  icon: PillarIcon;
  accentColor?: string;
  isPaid?: boolean;
  priceCents?: number;
  currency?: "usd";
  stripePriceId?: string;
  introVideo?: Partial<PillarIntroVideo>;
  order: number;
}

export interface UpdatePillarPayload {
  title?: string;
  tagline?: string;
  description?: string;
  accentColor?: string;
  isPaid?: boolean;
  priceCents?: number;
  currency?: "usd";
  stripePriceId?: string | null;
  introVideo?: Partial<PillarIntroVideo>;
}