import api from "@/lib/api/api";

import type { IChallengeModule, IChallengePillar } from "./challengeTypes";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ChallengeModulesResponse = {
  pillar: IChallengePillar;
  modules: IChallengeModule[];
};

export const challengeApi = {
  getChallengePillars: async (): Promise<ApiEnvelope<IChallengePillar[]>> => {
    const res = await api.get("/invictus/challenge-pillars");

    return res.data;
  },

  getChallengeModules: async (
    pillarId: string,
  ): Promise<ApiEnvelope<ChallengeModulesResponse>> => {
    const res = await api.get(`/invictus/course-modules/pillar/${pillarId}`);

    return res.data;
  },
};
