export interface IChallengePillar {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  icon?: string;
  status: string;
}

export interface IChallengeModule {
  _id: string;

  title: string;

  slug: string;

  shortDescription?: string;

  thumbnailUrl?: string;

  moduleNumber: number;

  estimatedDurationMinutes?: number;

  status: string;

  pillar: string;
}
