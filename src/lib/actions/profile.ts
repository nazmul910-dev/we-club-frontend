"use server";

import type { ProfileParticulars } from "@/lib/data/profile";

export interface UpdateProfileResult {
  success: boolean;
  error?: string;
}

// TODO(backend): persist to your DB, e.g.
//   await db.profile.update({ where: { userId }, data: particulars });
// Revalidate the profile path afterwards if you're caching it:
//   revalidatePath("/dashboard/profile");
export async function updateProfile(
  userId: string,
  particulars: ProfileParticulars
): Promise<UpdateProfileResult> {
  try {
    // Simulated latency so the client-side "Saving..." state has something
    // to show while wired to a real backend.
    await new Promise((resolve) => setTimeout(resolve, 400));

    return { success: true };
  } catch (error) {
    console.error("[updateProfile] failed", error);
    return { success: false, error: "Could not save changes. Try again." };
  }
}