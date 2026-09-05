export type MentorProfileStatus = "draft" | "published" | "archived";

export interface MentorUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
}

export interface MentorProfile {
  _id: string;
  mentor: MentorUser;
  bio: string;
  expertise: string[];
  availability: MentorAvailabilitySlot[];
  profileImage?: string;
  isPrimaryMentor: boolean;
  isActive: boolean;
  yearsOfExperience?: number;
  sessionDurationMinutes: number;
  status: MentorProfileStatus;
  order: number;
  publishedAt?: string;
  archivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MentorAvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface MentorProfileFields {
  bio: string;
  expertise?: string[];
  profileImage?: string;
  yearsOfExperience?: number;
  sessionDurationMinutes?: number;
  order?: number;
  isPrimaryMentor?: boolean;
}

export type CreateMentorPayload = MentorProfileFields &
  (
    | {
        mode: "create";
        fullName: string;
        email: string;
        password: string;
      }
    | {
        mode: "existing";
        userId: string;
      }
  );

export interface UpdateMentorPayload {
  bio?: string;
  expertise?: string[];
  profileImage?: string | null;
  yearsOfExperience?: number;
  sessionDurationMinutes?: number;
  order?: number;
  isPrimaryMentor?: boolean;
  isActive?: boolean;
}

export interface MentorProfileQuery {
  isActive?: boolean;
}
