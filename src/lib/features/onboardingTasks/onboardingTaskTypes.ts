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
