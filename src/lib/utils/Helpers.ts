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