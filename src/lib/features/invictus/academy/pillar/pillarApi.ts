import api from "@/lib/api/api";

export const pillarApi = {
  getAll: async () => {
    const res = await api.get("/invictus/challenge-pillars");

    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/invictus/challenge-pillars/${id}`);

    return res.data;
  },

  create: async (data: any) => {
    const res = await api.post("/invictus/challenge-pillars", data);

    return res.data;
  },

  update: async (id: string, data: any) => {
    const res = await api.patch(`/invictus/challenge-pillars/${id}`, data);

    return res.data;
  },

  publish: async (id: string) => {
    const res = await api.patch(`/invictus/challenge-pillars/${id}/publish`);

    return res.data;
  },

  draft: async (id: string) => {
    const res = await api.patch(`/invictus/challenge-pillars/${id}/draft`);

    return res.data;
  },

  archive: async (id: string) => {
    const res = await api.patch(`/invictus/challenge-pillars/${id}/archive`);

    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/invictus/challenge-pillars/${id}`);

    return res.data;
  },
};
