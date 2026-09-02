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
  limit? : number,
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
      status: "active",
      // No `period` filter — an admin can activate a leaderboard with any
      // period (daily/weekly/monthly/seasonal/all_time), and more than one
      // can be active at once (the uniqueness constraint is scoped per
      // type+period). We don't want to hardcode one period and silently
      // miss whichever is actually live. The backend already sorts by
      // createdAt desc, so with limit:1 this picks the most recently
      // activated "points" leaderboard, whatever its period.
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
    params: { page, limit  },
  });

  return {
    leaderboard,
    entries: entriesResponse.data.data.data,
    currentPage: entriesResponse.data.data.meta.page,
    totalPages: entriesResponse.data.data.meta.totalPages,
  };
};