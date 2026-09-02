// Mirrors src/modules/leaderboards/leaderboard.interface.ts on the backend.

export const LEADERBOARD_TYPES = [
  "points",
  "streak",
  "course_completion",
  "quiz_score",
  "custom",
] as const;

export const LEADERBOARD_PERIODS = [
  "daily",
  "weekly",
  "monthly",
  "seasonal",
  "all_time",
] as const;

export const LEADERBOARD_STATUSES = [
  "draft",
  "active",
  "finalized",
  "archived",
] as const;

export type LeaderboardType = (typeof LEADERBOARD_TYPES)[number];
export type LeaderboardPeriod = (typeof LEADERBOARD_PERIODS)[number];
export type LeaderboardStatus = (typeof LEADERBOARD_STATUSES)[number];

interface PopulatedActor {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
}

export interface AdminLeaderboard {
  _id: string;
  title: string;
  type: LeaderboardType;
  period: LeaderboardPeriod;
  status: LeaderboardStatus;
  startAt: string;
  endAt: string;
  description?: string;
  createdBy?: PopulatedActor | string;
  updatedBy?: PopulatedActor | string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLeaderboardEntryUser {
  _id: string;
  fullName: string;
  email?: string;
  role?: string;
  profileImage?: string;
  country?: string;
}

export interface AdminLeaderboardEntry {
  _id: string;
  leaderboard: string;
  user: AdminLeaderboardEntryUser;
  points: number;
  rank: number | null;
  breakdown?: Record<string, number>;
  lastUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaderboardPayload {
  title: string;
  type: LeaderboardType;
  period: LeaderboardPeriod;
  startAt: string;
  endAt: string;
  description?: string;
}

export interface UpdateLeaderboardPayload {
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
}

export interface GetAllLeaderboardsParams {
  type?: LeaderboardType;
  period?: LeaderboardPeriod;
  status?: LeaderboardStatus;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UpsertPointsPayload {
  userId: string;
  pointsDelta: number;
  breakdownKey?: string;
}
