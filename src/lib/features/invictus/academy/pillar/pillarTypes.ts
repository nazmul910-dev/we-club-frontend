export interface ChallengePillar {
  _id: string;

  title: string;

  slug: string;

  description: string;

  thumbnail?: string;

  status: "draft" | "published" | "archived";

  order: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface CreatePillarPayload {
  title: string;

  description: string;

  order: number;

  status: "draft" | "published";

  isActive: boolean;
}
