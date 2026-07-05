import { Cormorant_Garamond, Jost } from "next/font/google";
import { getProfile, CURRENT_USER_ID } from "@/lib/data/profile";
import { ProfileHeaderCard } from "@/components/profile/profile-header-card";
import { StandingPanel } from "@/components/profile/standing-panel";
import { ParticularsForm } from "@/components/profile/particulars-form";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

export const metadata = {
  title: "My Profile",
};

// Server Component: fetch happens here, so the page can later take a real
// session/userId without the child components needing to change at all.
export default async function ProfilePage() {
  const profile = await getProfile(CURRENT_USER_ID);

  return (
    <div
      className={`${serif.variable} ${sans.variable} min-h-screen bg-[#0b0b0d] px-6 sm:px-10 py-10`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Page heading */}
        <div className="mb-8">
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#c9a962]">
            Account · Private
          </span>
          <h1
            className="mt-2 text-4xl text-[#ece9e2]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            My Profile
          </h1>
          <p className="mt-1.5 text-sm text-[#8a8a82]">
            The face you present to the network.
          </p>
        </div>

        {/* Identity card */}
        <div className="mb-6">
          <ProfileHeaderCard identity={profile.identity} />
        </div>

        {/* Particulars + Standing */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <ParticularsForm userId={profile.id} initialData={profile.particulars} />
          <StandingPanel standing={profile.standing} />
        </div>
      </div>
    </div>
  );
}