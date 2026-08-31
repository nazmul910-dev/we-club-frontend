// Pure helpers shared across the Manage Listings tabs. Extracted as-is from
// ManageListingsPage — same logic, just made into standalone functions
// (currentUserId passed in instead of closed over) so every section
// component can reuse them without needing its own copy.

export function formatDate(d: string | undefined): string {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    return dt.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch (e) {
    return d;
  }
}

export function formatDate2(date: string, timezone?: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone || undefined,
  }).format(new Date(date));
}

export function isRequester(request: any, currentUserId: string | null): boolean {
  const requesterId = request?.requester?.user_id;
  const requesterIdString =
    typeof requesterId === "string" ? requesterId : (requesterId?._id ?? requesterId);

  return Boolean(currentUserId) && String(requesterIdString) === String(currentUserId);
}

export function canManageRequest(request: any): boolean {
  return request?.status === "pending";
}

export function canApproveRejectRequest(
  request: any,
  currentUserId: string | null
): boolean {
  return request?.status === "pending" && !isRequester(request, currentUserId);
}

export function canDeleteRequest(request: any, currentUserId: string | null): boolean {
  return request?.status === "pending" && isRequester(request, currentUserId);
}

export function getInitials(name?: string | null): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}
