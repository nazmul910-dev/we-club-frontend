export const QUIZ_PROGRESS_STATUSES = [
  "locked",
  "unlocked",
  "in_progress",
  "passed",
  "failed",
] as const;

export type QuizProgressStatus = (typeof QUIZ_PROGRESS_STATUSES)[number];

export interface IProgressPillarRef {
  _id: string;
  name?: string;
  slug?: string;
  title?: string;
  status?: string;
}

export interface IProgressModuleRef {
  _id: string;
  title: string;
  slug?: string;
  moduleNumber?: number;
  status?: string;
  pillar?: IProgressPillarRef;
}

export interface IProgressUserRef {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

export interface IModuleRequirementSummary {
  totalRequired: number;
  completedRequired: number;
  completionPercent: number;
  completed: boolean;
}

export interface IModuleQuizSummary {
  status: QuizProgressStatus;
  attemptsUsed: number;
  maximumAttempts: number;
  bestScore: number;
  passScore: number;
  passed: boolean;
  lastAttemptAt?: string;
}

// Backend Response
export interface IModuleProgress {
  _id: string;
  user: IProgressUserRef;
  module: IProgressModuleRef;

  videoSummary: IModuleRequirementSummary;
  resourceSummary: IModuleRequirementSummary;
  actionSummary: IModuleRequirementSummary;
  quizSummary: IModuleQuizSummary;

  actionsUnlocked: boolean;
  quizUnlocked: boolean;

  overallCompletionPercent: number;

  isCompleted: boolean;
  completedAt?: string;

  lastCalculatedAt: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface IModuleProgressAdminQuery {
  userId?: string;
  moduleId?: string;
  isCompleted?: boolean;
  page?: number;
  limit?: number;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IModuleProgressListResponse {
  meta: IPaginationMeta;
  data: IModuleProgress[];
}

// One row per member — every module-progress record for that
// member is collapsed into a summary, with the individual records
// kept so the detail modal can show a full per-module breakdown.
export interface IUserModuleProgressGroup {
  user: IProgressUserRef;

  totalModules: number;
  completedModules: number;
  avgCompletionPercent: number;
  isFullyCompleted: boolean;

  lastUpdatedAt?: string;

  records: IModuleProgress[];
}

export interface IUserModuleProgressListResponse {
  meta: IPaginationMeta;
  data: IUserModuleProgressGroup[];
}