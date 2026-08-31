export const MODULE_RESOURCE_STATUSES = ["draft", "published", "archived"] as const;
export type ModuleResourceStatus = (typeof MODULE_RESOURCE_STATUSES)[number];

export const MODULE_RESOURCE_TYPES = [
  "pdf",
  "worksheet",
  "template",
  "external_link",
  "other",
] as const;
export type ModuleResourceType = (typeof MODULE_RESOURCE_TYPES)[number];

export const MODULE_RESOURCE_PROVIDERS = ["cloudinary", "external"] as const;
export type ModuleResourceProvider = (typeof MODULE_RESOURCE_PROVIDERS)[number];

export interface IPillarRef {
  _id: string;
  name?: string;
  slug?: string;
  title?: string;
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
export interface IModuleResource {
  _id: string;
  module: IModuleRef;

  title: string;
  slug: string;
  description?: string;

  resourceType: ModuleResourceType;
  provider: ModuleResourceProvider;

  fileName?: string;
  mimeType?: string;
  format?: string;
  bytes?: number;

  cloudinaryPublicId?: string;
  cloudinaryAssetId?: string;
  secureUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;

  isRequired: boolean;
  pointsReward: number;
  order: number;

  status: ModuleResourceStatus;

  publishedAt?: string;
  archivedAt?: string;

  createdBy?: IActorRef | string;
  updatedBy?: IActorRef | string;

  createdAt?: string;
  updatedAt?: string;
}

// Create Form (fields the admin fills in)
export interface ICreateModuleResourceForm {
  title: string;
  slug: string;
  description?: string;

  resourceType: ModuleResourceType;
  provider: ModuleResourceProvider;
  externalUrl?: string;

  isRequired?: boolean;
  pointsReward?: number;
  order: number;
}

// Update Payload (metadata only, JSON)
export interface IUpdateModuleResource {
  title?: string;
  slug?: string;
  description?: string | null;

  resourceType?: ModuleResourceType;
  provider?: ModuleResourceProvider;
  externalUrl?: string | null;

  isRequired?: boolean;
  pointsReward?: number;
  order?: number;
}