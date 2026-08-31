export interface ModuleVideo {
  _id: string;

  moduleId: string;

  title: string;

  slug?: string;

  description?: string;

  video: string;

  thumbnail?: string;

  isPaid: boolean;

  isRequired: boolean;

  requiredWatchPercent: number;

  pointsReward: number;

  order: number;

  status: "draft" | "published" | "archived";

  createdAt: string;

  updatedAt: string;
}

export interface CourseModule {
  _id: string;

  title: string;

  description?: string;

  thumbnail?: string;

  videos?: ModuleVideo[];

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface VideoUploadPayload {
  moduleId: string;

  title: string;

  description?: string;

  video: File;

  isPaid: boolean;

  isRequired: boolean;

  requiredWatchPercent: number;

  pointsReward: number;

  order: number;
}

export interface UserEntitlement {
  _id: string;

  userId: string;

  pillarId: string;

  status: "active" | "expired";

  expiresAt: string;
}

export interface AcademyModule {
  _id: string;

  title: string;

  slug: string;

  description: string;

  thumbnail?: string;

  totalVideos: number;

  isPremium: boolean;

  createdAt: string;
}
