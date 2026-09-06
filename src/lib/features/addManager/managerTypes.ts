export type CreatableAdminRole =
  | "manager"
  | "super_admin"
  | "co_mentor"
  | "ceo";
export type AllVisibleRole =
  | "admin"
  | "manager"
  | "super_admin"
  | "co_mentor"
  | "ceo"
  | "ceo_partner";

export interface Manager {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  accessTo: "we_command_center" | "invictus" | "both";
  profileImage?: string;
  accountStatus:
    | "active"
    | "suspended"
    | "pending_payment"
    | "pending_approval"
    | "rejected";
}

export interface ManagerMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface CreateManagerPayload {
  fullName: string;
  email: string;
  password: string;
  role: CreatableAdminRole;
  accessTo: "we_command_center" | "invictus" | "both";
}

export const CREATABLE_ROLES_BY_CURRENT_ROLE: Record<
  string,
  CreatableAdminRole[]
> = {
  founder: ["manager", "super_admin", "co_mentor", "ceo"],
  manager: ["super_admin", "co_mentor"],
};

export const VISIBLE_ROLES_BY_CURRENT_ROLE: Record<string, AllVisibleRole[]> = {
  founder: ["admin", "manager", "super_admin", "ceo", "ceo_partner"],
  manager: ["admin", "manager", "super_admin", "ceo", "ceo_partner"],
};

export const ROLE_LABELS: Record<AllVisibleRole, string> = {
  admin: "Admin",
  manager: "Manager",
  super_admin: "Super Admin Support",
  co_mentor: "Co Mentor",
  ceo: "CEO",
  ceo_partner: "CEO Partner",
};
