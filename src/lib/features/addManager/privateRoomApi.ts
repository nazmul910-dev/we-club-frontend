import api from "@/lib/api/api";

export const PRIVATE_ROOMS = [
  { slug: "ceos-council-club", name: "CEOs Council Club" },
  { slug: "founders-council-club", name: "Founders Council Club" },
  { slug: "vip-community", name: "VIP Community" },
  { slug: "world-elite-inner-circle", name: "World Elite Inner Circle" },
] as const;

export const inviteToPrivateRoom = async (userId: string, slug: string) => {
  const response = await api.post(`/rooms/private/${slug}/invite/${userId}`);
  return response.data;
};

export interface PrivateRoomAccess {
  slug: string;
  name: string;
  canEnter: boolean;
}

export const getPrivateRoomAccess = async (): Promise<PrivateRoomAccess[]> => {
  const response = await api.get("/rooms/private");
  return response.data.data;
};

export type CountryRoomRequestStatus = "pending" | "approved" | "rejected";

export interface CountryRoomAccess {
  countryName: string;
  countryCode: string;
  canEnter: boolean;
  requestStatus: CountryRoomRequestStatus | null;
  requestId: string | null;
}

export interface CountryRoomRequest {
  _id: string;
  countryName: string;
  countryCode: string;
  status: CountryRoomRequestStatus;
  user?: { _id: string; fullName: string; email: string; role: string; country?: string };
  room?: { _id: string; name: string; countryName: string; countryCode: string };
  createdAt?: string;
}

export const getCountryRoomAccess = async (
  countryName: string,
): Promise<CountryRoomAccess> => {
  const response = await api.get("/rooms/country/access", {
    params: { countryName },
  });
  return response.data.data;
};

export const requestCountryRoom = async (countryName: string) => {
  const response = await api.post("/rooms/country/requests", { countryName });
  return response.data.data as CountryRoomRequest;
};

export const getMyCountryRoomRequests = async () => {
  const response = await api.get("/rooms/country/requests/me");
  return response.data.data as CountryRoomRequest[];
};

export const getCountryRoomRequestsForReview = async () => {
  const response = await api.get("/rooms/country/requests");
  return response.data.data as CountryRoomRequest[];
};

export const reviewCountryRoomRequest = async (
  requestId: string,
  status: "approved" | "rejected",
) => {
  const response = await api.patch(`/rooms/country/requests/${requestId}`, {
    status,
  });
  return response.data.data as CountryRoomRequest;
};
