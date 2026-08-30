export type SessionType =
  | "academy_live"
  | "mentorship_group"
  | "retreat_prep"
  | "community_call"
  | "other";

export type SessionStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "postponed";

export interface ISessionScheduleItem {
  _id: string;
  title: string;
  description?: string;
  sessionType: SessionType;
  host: { _id: string; fullName: string; email: string; role: string };
  pillar?: { _id: string; name?: string; slug?: string; title?: string };
  courseModule?: { _id: string; title?: string; slug?: string };
  startTime: string;
  endTime: string;
  timezone: string;
  meetingUrl?: string;
  capacity?: number;
  status: SessionStatus;
  cancellationReason?: string;
  cancelledBy?: { _id: string; fullName: string };
  cancelledAt?: string;
  createdBy?: { _id: string; fullName: string };
  updatedBy?: { _id: string; fullName: string };
  createdAt?: string;
  updatedAt?: string;
}

// ---- Admin/manager side payloads (create/update) ----

export interface ICreateSessionSchedulePayload {
  title: string;
  description?: string;
  sessionType: SessionType;
  host: string; // User _id (mentor/founder/manager)
  pillar?: string;
  courseModule?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  timezone: string; // e.g. "Europe/Paris"
  meetingUrl?: string;
  capacity?: number;
}

export interface IUpdateSessionSchedulePayload
  extends Partial<ICreateSessionSchedulePayload> {
  status?: SessionStatus;
}

// ---- Attendance side ----

export type SessionAttendanceStatus =
  | "registered"
  | "attended"
  | "late"
  | "no_show"
  | "cancelled";

export interface ISessionAttendanceItem {
  _id: string;
  session: { _id: string; title: string; sessionType?: SessionType; startTime: string; endTime: string; status: SessionStatus };
  user: { _id: string; fullName: string; email: string; role: string };
  status: SessionAttendanceStatus;
  registeredAt?: string;
  joinedAt?: string;
  leftAt?: string;
  markedBy?: { _id: string; fullName: string };
  cancellationReason?: string;
  cancelledAt?: string;
  notes?: string;
}