import { jwtDecode } from "jwt-decode";

export type UserRole =
  | "associate"
  | "ceo"
  | "ceo_partner"
  | "partner"
  | "ambassador"
  | "we_club_member";

export type AccessTo = "we_command_center" | "invictus" | "both";

export interface DecodedUser {
  id: string;
  email: string;
  role: UserRole;
  accessTo?: AccessTo;
  exp: number;
  iat: number;
}

export function decodeToken(token: string): DecodedUser | null {
  try {
    return jwtDecode<DecodedUser>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(decoded: DecodedUser): boolean {
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

export function getStoredUser(): DecodedUser | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded || isTokenExpired(decoded)) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return null;
  }

  return decoded;
}

export function getInitials(fullName?: string): string {
  if (!fullName) return "U";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

// "ceo_partner" -> "Ceo Partner"
export function formatLabel(value?: string): string {
  if (!value) return "";
  return value
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}