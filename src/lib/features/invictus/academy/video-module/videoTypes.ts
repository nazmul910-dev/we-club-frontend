export const MODULE_VIDEO_STATUSES = ["draft", "published", "archived"] as const;
export type ModuleVideoStatus = (typeof MODULE_VIDEO_STATUSES)[number];

export const VIDEO_UPLOAD_STATUSES = ["processing", "ready", "failed"] as const;
export type VideoUploadStatus = (typeof VIDEO_UPLOAD_STATUSES)[number];

export interface IPillarRef {
  _id: string;
  name?: string;
  slug?: string;
  title?: string;
  isPaid?: boolean;
  priceCents?: number;
  currency?: string;
  status?: string;
}

export interface IModuleRef {
  _id: string;
  title: string;
  slug?: string;
  moduleNumber?: number;
  status?: string;
  pillar?: IPillarRef;
}

interface IActorRef {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

// Backend Response
export interface IModuleVideo {
  _id: string;
  module: IModuleRef;

  title: string;
  slug: string;
  description?: string;

  provider: "cloudinary";
  resourceType: "video";

  cloudinaryPublicId?: string;
  cloudinaryAssetId?: string;

  secureUrl?: string;
  playbackUrl?: string;
  thumbnailUrl?: string;
  folder?: string;

  format?: string;
  durationSeconds: number;
  bytes?: number;
  width?: number;
  height?: number;

  isPaid: boolean;

  isRequired: boolean;
  requiredWatchPercent: number;
  pointsReward: number;
  order: number;

  uploadStatus: VideoUploadStatus;
  status: ModuleVideoStatus;

  publishedAt?: string;
  archivedAt?: string;

  uploadedBy?: IActorRef | string;
  updatedBy?: IActorRef | string;

  createdAt?: string;
  updatedAt?: string;
}

// Create Form (fields the admin fills in, sent as multipart along with the video file)
export interface ICreateModuleVideoForm {
  title: string;
  slug: string;
  description?: string;

  isPaid?: boolean;

  isRequired?: boolean;
  requiredWatchPercent?: number;
  pointsReward?: number;
  order: number;
}

// Update Payload (metadata only, JSON)
export interface IUpdateModuleVideo {
  title?: string;
  slug?: string;
  description?: string | null;

  isPaid?: boolean;

  isRequired?: boolean;
  requiredWatchPercent?: number;
  pointsReward?: number;
  order?: number;
}