import api from "@/lib/api/api";
import { LeaderboardEntry, LeaderboardRecord } from "./leaderboardTypes";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    totalPages: number;
  };
}

export const getActiveInvictusLeaderboard = async (
  page = 1,
): Promise<{
  leaderboard: LeaderboardRecord;
  entries: LeaderboardEntry[];
  currentPage: number;
  totalPages: number;
}> => {
  const leaderboardResponse = await api.get<{
    data: PaginatedResponse<LeaderboardRecord>;
  }>("/invictus/leaderboards", {
    params: {
      type: "points",
      period: "seasonal",
      status: "active",
      limit: 1,
    },
  });

  const leaderboard = leaderboardResponse.data.data.data[0];
  if (!leaderboard) {
    throw new Error("No active Invictus leaderboard found");
  }

  const entriesResponse = await api.get<{
    data: PaginatedResponse<LeaderboardEntry>;
  }>(`/invictus/leaderboards/${leaderboard._id}/entries`, {
    params: { page, limit: 10 },
  });

  return {
    leaderboard,
    entries: entriesResponse.data.data.data,
    currentPage: entriesResponse.data.data.meta.page,
    totalPages: entriesResponse.data.data.meta.totalPages,
  };
};
