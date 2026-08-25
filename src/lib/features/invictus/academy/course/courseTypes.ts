export const COURSE_MODULE_STATUSES = [
  "draft",
  "published",
  "archived",
] as const;

export type CourseModuleStatus = (typeof COURSE_MODULE_STATUSES)[number];

export interface IPillarReference {
  _id: string;

  name: string;

  slug: string;
}

// Backend Response

export interface ICourseModule {
  _id: string;

  pillar: IPillarReference;

  title: string;

  slug: string;

  shortDescription?: string;

  description: string;

  thumbnailUrl?: string;

  moduleNumber: number;

  estimatedDurationMinutes: number;

  minimumVideoPercent: number;

  minimumActionPercent: number;

  minimumQuizScore: number;

  maximumQuizAttempts: number;

  completionPoints: number;

  status: CourseModuleStatus;

  publishedAt?: string;

  archivedAt?: string;

  createdBy: string;

  updatedBy?: string;

  createdAt?: string;

  updatedAt?: string;
}

// Create Payload

export interface ICreateCourseModule {
  pillar: string;

  title: string;

  slug: string;

  shortDescription?: string;

  description: string;

  thumbnailUrl?: string;

  moduleNumber: number;

  estimatedDurationMinutes?: number;

  minimumVideoPercent?: number;

  minimumActionPercent?: number;

  minimumQuizScore?: number;

  maximumQuizAttempts?: number;

  completionPoints?: number;
}

// Update Payload

export interface IUpdateCourseModule {
  title?: string;

  slug?: string;

  shortDescription?: string | null;

  description?: string;

  thumbnailUrl?: string | null;

  moduleNumber?: number;

  estimatedDurationMinutes?: number;

  minimumVideoPercent?: number;

  minimumActionPercent?: number;

  minimumQuizScore?: number;

  maximumQuizAttempts?: number;

  completionPoints?: number;
}
