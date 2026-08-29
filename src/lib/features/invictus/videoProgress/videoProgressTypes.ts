export interface IWatchedRange {
  startSeconds: number;
  endSeconds: number;
}

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

export interface IProgressVideoRef {
  _id: string;
  title: string;
  slug?: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  requiredWatchPercent: number;
  isRequired: boolean;
  isPaid: boolean;
  order: number;
  status?: string;
}

// Heartbeat / me-list response — a full, populated progress document
export interface IVideoProgress {
  _id: string;
  user: string;
  video: IProgressVideoRef;
  module: IProgressModuleRef;

  durationSecondsSnapshot: number;
  requiredWatchPercentSnapshot: number;

  watchedRanges: IWatchedRange[];

  totalWatchedSeconds: number;
  watchPercent: number;

  lastPositionSeconds: number;

  isCompleted: boolean;

  startedAt: string;
  lastWatchedAt: string;
  completedAt?: string;

  createdAt?: string;
  updatedAt?: string;
}

// GET /video/:videoId/me response
export interface IMyVideoProgressSummary {
  totalWatchedSeconds: number;
  watchPercent: number;
  lastPositionSeconds: number;
  isCompleted: boolean;
  completedAt?: string | null;
  lastWatchedAt?: string | null;
}

export interface IMyVideoProgressResult {
  video: {
    id: string;
    title: string;
    slug?: string;
    thumbnailUrl?: string;
    durationSeconds: number;
    requiredWatchPercent: number;
    isRequired: boolean;
    isPaid: boolean;
    order: number;
  };
  module: {
    id: string;
    title: string;
    slug?: string;
    moduleNumber?: number;
    pillar?: IProgressPillarRef;
  };
  progress: IMyVideoProgressSummary;
}

// GET /module/:moduleId/me response
export interface IModuleVideoWithProgress extends IProgressVideoRef {
  pointsReward?: number;
  progress: IMyVideoProgressSummary;
}

export interface IMyModuleVideoProgressResult {
  module: IProgressModuleRef;
  summary: {
    totalVideos: number;
    totalRequiredVideos: number;
    completedRequiredVideos: number;
    requiredVideoCompletionPercent: number;
    allRequiredVideosCompleted: boolean;
  };
  videos: IModuleVideoWithProgress[];
}

// Heartbeat payload sent while the video is playing
export interface IRecordVideoHeartbeat {
  segmentStartSeconds: number;
  segmentEndSeconds: number;
  currentPositionSeconds: number;
}

export interface IVideoProgressAdminQuery {
  userId?: string;
  videoId?: string;
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

export interface IVideoProgressListResponse {
  meta: IPaginationMeta;
  data: IVideoProgress[];
}