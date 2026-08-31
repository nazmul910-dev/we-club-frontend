export interface LeaderboardUser {
  fullName: string;
  profileImage?: string;
  country?: string;
}

export interface LeaderboardEntry {
  _id: string;
  rank: number;
  points: number;
  breakdown?: {
    modules?: number;
    success?: number;
    streak?: number;
  };
  user: LeaderboardUser;
}

export interface LeaderboardRecord {
  _id: string;
  title: string;
  type: string;
  period: string;
  status: string;
}

export interface InvictusLeaderboardData {
  leaderboard: LeaderboardRecord;
  entries: LeaderboardEntry[];
  currentPage: number;
  totalPages: number;
}
