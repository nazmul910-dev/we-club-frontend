"use client";

import { InstagramIcon, LinkedInIcon, WebsiteIcon } from "@/components/invictus/profiles/icons";
import { ProfileCard } from "@/components/invictus/profiles/profileCard";
import { useRouter } from "next/navigation";

const ceos = [
  {
    slug: "sofia-marchetti",
    imageSrc: "/images/sofia-marchetti.jpg",
    imageAlt: "Sofia Marchetti",
    kicker: "CEO Profile",
    name: "Sofia Marchetti",
    role: "CEO, Marchetti Luxury Group",
    bio: "Twenty years leading luxury real estate teams across Europe and North America. Sofia specializes in high-net-worth client acquisition and building teams that win in premium markets.",
    socials: [
      { label: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
      { label: "Instagram", href: "#", icon: <InstagramIcon /> },
      { label: "Website", href: "#", icon: <WebsiteIcon /> },
    ],
  },
  {
    slug: "carlos-vega",
    imageSrc: "/images/carlos-vega.jpg",
    imageAlt: "Carlos Vega",
    kicker: "CEO Profile",
    name: "Carlos Vega",
    role: "CEO, Vega Capital Partners",
    bio: "Founder of a $400M investment portfolio. Carlos mentors entrepreneurs on scaling from operator to owner, and building durable wealth systems.",
    socials: [
      { label: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
      { label: "Instagram", href: "#", icon: <InstagramIcon /> },
      { label: "Website", href: "#", icon: <WebsiteIcon /> },
    ],
  },
];

export default function CeoProfilesPage() {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-[1180px] px-[6vw] py-[6vw] sm:px-8">
      <div className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-gold-deep before:h-px before:w-[26px] before:bg-gold after:h-px after:w-[26px] after:bg-gold">
          CEO Profiles
        </div>
        <h1 className="mb-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Learn from the CEOs who&apos;ve done it.
        </h1>
        <p className="mx-auto max-w-[520px] text-ink-soft">
          Each CEO curates a library organized by the disciplines that built them. Open a profile to explore.
        </p>


      </div>

  

      <div className="grid grid-cols-1 gap-9 md:grid-cols-2  ">
        
        {ceos.map(({ slug, ...c }) => (
            
          <ProfileCard
            key={c.name}
            variant="ceo"
            ctaLabel="View Profile"
            onCtaClick={() => router.push(`/ceo-profiles/${slug}`)}
            {...c}
          />
        ))}
      </div>
    </main>
  );
}