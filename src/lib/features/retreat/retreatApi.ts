import api from "@/lib/api/api";
import { Retreat, RetreatBatch } from "@/types/retreat";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    totalPages: number;
  };
}

export const getFeaturedRetreat = async (): Promise<Retreat> => {
  const response = await api.get<{ data: PaginatedResponse<Retreat> }>(
    "/invictus/retreat-locations",
    { params: { status: "published", isActive: true, limit: 1 } },
  );

  const retreat = response.data.data.data[0];
  if (!retreat) throw new Error("No featured retreat found");
  return retreat;
};

export const getRetreatBatches = async (
  locationId: string,
): Promise<RetreatBatch[]> => {
  const response = await api.get<{ data: PaginatedResponse<RetreatBatch> }>(
    "/invictus/retreat-batches",
    { params: { locationId, limit: 20 } },
  );

  return response.data.data.data;
};
