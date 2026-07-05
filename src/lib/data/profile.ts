// lib/data/profile.ts
//
// Data layer for the profile page. Everything the UI needs is typed here.
// Right now `getProfile` returns a static mock, but the shape and the async
// signature are already what a real DB/API call would look like — swap the
// body of `getProfile` for a Prisma/Drizzle query or a `fetch()` to your API
// and nothing above it (the page, the components) needs to change.

export interface ProfileIdentity {
  name: string;
  role: string;
  quote: string;
  initials: string;
  avatarUrl: string | null;
}

export interface ProfileParticulars {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  basedIn: string;
  biography: string;
}

export interface ProfileStanding {
  tenure: string;
  totalIntroductions: number;
  lifetimeCommission: string;
  discretionScore: string;
}

export interface UserProfile {
  id: string;
  identity: ProfileIdentity;
  particulars: ProfileParticulars;
  standing: ProfileStanding;
}

// TODO(backend): replace with a real lookup, e.g.
//   const row = await db.profile.findUnique({ where: { userId } });
//   return mapRowToUserProfile(row);
export async function getProfile(userId: string): Promise<UserProfile> {
  return {
    id: userId,
    identity: {
      name: "Alexandra Voss",
      role: "Ambassador",
      quote: "Discretion is not silence — it is choosing one's audience.",
      initials: "AV",
      avatarUrl: null,
    },
    particulars: {
      fullName: "Alexandra Voss",
      title: "Senior Ambassador",
      email: "alexandra@worldelite.club",
      phone: "+41 22 555 0102",
      basedIn: "Geneva, Switzerland",
      biography:
        "Architect by training, broker by circumstance. Operating between Geneva, Monaco, and London since 2015.",
    },
    standing: {
      tenure: "3 years",
      totalIntroductions: 148,
      lifetimeCommission: "€2.84M",
      discretionScore: "A+",
    },
  };
}

// Convenience constant so the page compiles today without an auth/session
// lookup wired up yet. Replace with the authenticated user's id.
export const CURRENT_USER_ID = "me";