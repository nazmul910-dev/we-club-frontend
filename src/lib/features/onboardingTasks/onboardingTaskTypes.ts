export type OnboardingTaskTrigger = "manual" | "auto_on_login" | "video_watch";

export interface OnboardingChecklistItem {
  _id: string;
  title: string;
  description?: string;
  order: number;
  trigger: OnboardingTaskTrigger;
  actionLabel?: string;
  actionUrl?: string;
  pointsReward: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface CompleteOnboardingTaskResult {
  alreadyCompleted: boolean;
  pointsAwarded: number;
}

export type OnboardingTaskStatus = "draft" | "published" | "archived";

/**
 * Full admin-facing task shape, returned by the founder/manager
 * CRUD endpoints (POST/GET/PATCH /invictus/onboarding-tasks).
 */
export interface AdminOnboardingTask {
  _id: string;
  title: string;
  description?: string;
  order: number;
  trigger: OnboardingTaskTrigger;
  actionLabel?: string;
  actionUrl?: string;
  linkedVideo?: string;
  pointsReward: number;
  status: OnboardingTaskStatus;
  publishedAt?: string;
  archivedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOnboardingTaskPayload {
  title: string;
  description?: string;
  order: number;
  trigger?: OnboardingTaskTrigger;
  actionLabel?: string;
  actionUrl?: string;
  linkedVideo?: string;
  pointsReward?: number;
}

export interface UpdateOnboardingTaskPayload {
  title?: string;
  description?: string | null;
  order?: number;
  trigger?: OnboardingTaskTrigger;
  actionLabel?: string | null;
  actionUrl?: string | null;
  linkedVideo?: string | null;
  pointsReward?: number;
}