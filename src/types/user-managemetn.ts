export const APPROVAL_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export type ApprovalStatus =
  (typeof APPROVAL_STATUSES)[number];


export const ACCOUNT_STATUSES = [
  "active",
  "pending_payment",
  "pending_approval",
  "suspended",
  "rejected",
] as const;


export type AccountStatus =
  (typeof ACCOUNT_STATUSES)[number];


export const LICENSE_VERIFICATION_STATUSES = [
  "pending",
  "verified",
  "rejected",
] as const;


export type LicenseVerificationStatus =
  (typeof LICENSE_VERIFICATION_STATUSES)[number];



export interface IUser {

_id:string;

fullName:string;

email:string;

role:string;

accessTo:string;

licenseNumber:string;

brokerage:string;

phone:string;

city:string;

country:string;

bio:string;


approvalStatus:ApprovalStatus;

accountStatus:AccountStatus;

licenseVerificationStatus:LicenseVerificationStatus;


paymentStatus:string;

subscriptionStatus:string;

createdAt:string;

}