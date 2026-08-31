import api from "@/lib/api/api";
import {
  CompleteOnboardingTaskResult,
  OnboardingChecklistItem,
} from "./onboardingTaskTypes";

export const getMyOnboardingChecklist = async (): Promise<
  OnboardingChecklistItem[]
> => {
  const response = await api.get<{ data: OnboardingChecklistItem[] }>(
    "/invictus/onboarding-tasks/me",
  );

  return response.data.data;
};

export const completeOnboardingTask = async (
  taskId: string,
): Promise<CompleteOnboardingTaskResult> => {
  const response = await api.patch<{ data: CompleteOnboardingTaskResult }>(
    `/invictus/onboarding-tasks/${taskId}/complete`,
  );

  return response.data.data;
};
