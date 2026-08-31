import api from "@/lib/api/api";
import {
  AdminOnboardingTask,
  CompleteOnboardingTaskResult,
  CreateOnboardingTaskPayload,
  OnboardingChecklistItem,
  UpdateOnboardingTaskPayload,
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

/* --------------------------------------------------------------------- */
/*  Admin (founder / manager / admin) — task management                  */
/* --------------------------------------------------------------------- */

export const getAllOnboardingTasksAdmin = async (): Promise<
  AdminOnboardingTask[]
> => {
  const response = await api.get<{ data: AdminOnboardingTask[] }>(
    "/invictus/onboarding-tasks",
  );

  return response.data.data;
};

export const createOnboardingTaskAdmin = async (
  payload: CreateOnboardingTaskPayload,
): Promise<AdminOnboardingTask> => {
  const response = await api.post<{ data: AdminOnboardingTask }>(
    "/invictus/onboarding-tasks",
    payload,
  );

  return response.data.data;
};

export const updateOnboardingTaskAdmin = async (
  taskId: string,
  payload: UpdateOnboardingTaskPayload,
): Promise<AdminOnboardingTask> => {
  const response = await api.patch<{ data: AdminOnboardingTask }>(
    `/invictus/onboarding-tasks/${taskId}`,
    payload,
  );

  return response.data.data;
};

export const publishOnboardingTaskAdmin = async (
  taskId: string,
): Promise<AdminOnboardingTask> => {
  const response = await api.patch<{ data: AdminOnboardingTask }>(
    `/invictus/onboarding-tasks/${taskId}/publish`,
  );

  return response.data.data;
};

export const archiveOnboardingTaskAdmin = async (
  taskId: string,
): Promise<AdminOnboardingTask> => {
  const response = await api.patch<{ data: AdminOnboardingTask }>(
    `/invictus/onboarding-tasks/${taskId}/archive`,
  );

  return response.data.data;
};