export const MODULE_ACTION_STATUSES = ["draft", "published", "archived"] as const;
export type ModuleActionStatus = (typeof MODULE_ACTION_STATUSES)[number];

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
export interface IModuleAction {
  _id: string;
  module: IModuleRef;

  title: string;
  description?: string;

  order: number;
  isRequired: boolean;
  pointsReward: number;

  status: ModuleActionStatus;

  publishedAt?: string;
  archivedAt?: string;

  createdBy?: IActorRef | string;
  updatedBy?: IActorRef | string;

  createdAt?: string;
  updatedAt?: string;
}

// Create Payload
export interface ICreateModuleAction {
  title: string;
  description?: string;

  order: number;
  isRequired?: boolean;
  pointsReward?: number;
}

// Update Payload
export interface IUpdateModuleAction {
  title?: string;
  description?: string | null;

  order?: number;
  isRequired?: boolean;
  pointsReward?: number;
}