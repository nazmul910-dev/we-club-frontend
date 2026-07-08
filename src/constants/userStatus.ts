export const APPROVAL_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;


export const ACCOUNT_STATUSES = [
  "active",
  "pending_payment",
  "pending_approval",
  "suspended",
  "rejected",
] as const;


export const LICENSE_VERIFICATION_STATUSES = [
  "pending",
  "verified",
  "rejected",
] as const;



export type ApprovalStatus =
  typeof APPROVAL_STATUSES[number];


export type AccountStatus =
  typeof ACCOUNT_STATUSES[number];


export type LicenseVerificationStatus =
  typeof LICENSE_VERIFICATION_STATUSES[number];