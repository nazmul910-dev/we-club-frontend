export interface Manager {
  _id: string;
  fullName: string;
  email: string;
  role: "manager";
  accessTo: "we_command_center" | "invictus" | "both";

  profileImage?: string;

  accountStatus:
    | "active"
    | "suspended"
    | "pending_payment"
    | "pending_approval"
    | "rejected";
}

export interface CreateManagerPayload {
  fullName: string;
  email: string;
  password: string;
  role: "manager";
  accessTo: "we_command_center" | "invictus" | "both";
}