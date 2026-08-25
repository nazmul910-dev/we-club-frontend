"use client";

import { InstagramIcon, LinkedInIcon, WebsiteIcon } from "@/components/invictus/profiles/icons";
import { ProfileCard } from "@/components/invictus/profiles/profileCard";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import ceo1 from "@/assets/Invictus/Home/sof.png";
import ceo2 from "@/assets/Invictus/Home/sof1.png";

const ceos = [
  {
    slug: "sofia-marchetti",
    imageSrc: ceo1,
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
    imageSrc: ceo2,
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
    <PageContainer variant="invictus" as="main">
      <div className="mb-16 text-center">
        <PageHeader
          variant="invictus"
          className="flex-col items-center text-center"
          eyebrow="CEO Profiles"
          title="Learn from the CEOs who've done it."
          description="Each CEO curates a library organized by the disciplines that built them. Open a profile to explore."
          titleClassName="text-4xl sm:text-5xl"
        />
      </div>

      <div className="grid grid-cols-1 gap-9 md:grid-cols-2">
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
    </PageContainer>
  );
}