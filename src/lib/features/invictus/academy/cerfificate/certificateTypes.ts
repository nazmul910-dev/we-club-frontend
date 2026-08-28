export const CERTIFICATE_STATUSES = ["issued", "revoked"] as const;
export type CertificateStatus = (typeof CERTIFICATE_STATUSES)[number];

export interface ICertificatePillarRef {
  _id: string;
  name?: string;
  slug?: string;
  title?: string;
  status?: string;
}

export interface ICertificateModuleRef {
  _id: string;
  title: string;
  slug?: string;
  moduleNumber?: number;
  status?: string;
  pillar?: ICertificatePillarRef;
}

export interface ICertificateUserRef {
  _id: string;
  fullName?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

// Backend Response
export interface IQuizCertificate {
  _id: string;
  user: ICertificateUserRef;
  module: ICertificateModuleRef;
  pillar: ICertificatePillarRef;

  quizAttempt?: string;

  certificateNumber: string;

  status: CertificateStatus;

  score: number;

  issuedAt: string;

  certificateUrl?: string;

  revokedAt?: string;
  revokedReason?: string;
  revokedBy?: ICertificateUserRef;

  createdAt?: string;
  updatedAt?: string;
}

export interface IQuizCertificateAdminQuery {
  userId?: string;
  moduleId?: string;
  pillarId?: string;
  status?: CertificateStatus;
  page?: number;
  limit?: number;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ICertificateListResponse {
  meta: IPaginationMeta;
  data: IQuizCertificate[];
}

export interface IAttachCertificateUrl {
  certificateUrl: string;
}

export interface IRevokeCertificatePayload {
  id: string;
  reason?: string;
}

export interface IVerifyCertificateResult {
  valid: boolean;
  certificate: IQuizCertificate;
}