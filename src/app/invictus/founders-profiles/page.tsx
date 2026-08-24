import { InstagramIcon, LinkedInIcon } from "@/components/invictus/profiles/icons";
import { ProfileCard } from "@/components/invictus/profiles/profileCard";

import adam from "@/assets/Invictus/Home/adam.jpg"
import founder1 from "@/assets/Invictus/Home/sof1.png"
import founder2 from "@/assets/Invictus/Home/sof.png"

const founders = [
  {
    imageSrc: adam,
    imageAlt: "Adam Koubi",
    kicker: "Founder",
    name: "Adam Koubi",
    role: "Founder, World Elite",
    bio: "Architect of the World Elite organization and the INVICTUS methodology. Built one of the most influential real estate networks under eXp Realty.",
    socials: [{ label: "LinkedIn", href: "#", icon: <LinkedInIcon /> }],
  },
  {
    imageSrc: founder2,
    imageAlt: "Isabelle Laurent",
    kicker: "Founder",
    name: "Isabelle Laurent",
    role: "Co-Founder, World Elite",
    bio: "Strategic force behind World Elite's European expansion. Led the launch of five country divisions in under three years.",
    socials: [
      { label: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
      { label: "Instagram", href: "#", icon: <InstagramIcon /> },
    ],
  },
  {
    imageSrc: founder1,
    imageAlt: "Marcus Whitfield",
    kicker: "Founding Partner",
    name: "Marcus Whitfield",
    role: "Founding Partner",
    bio: "Institutional capital veteran. Designed the wealth architecture that transforms operators into owners inside the FCC.",
    socials: [{ label: "LinkedIn", href: "#", icon: <LinkedInIcon /> }],
  },
];

export default function FoundersPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-[6vw] py-[6vw] sm:px-8">
      <div className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-gold-deep before:h-px before:w-[26px] before:bg-gold after:h-px after:w-[26px] after:bg-gold">
          Founders Profiles
        </div>
        <h1 className="mb-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          The inspiring Founders in our Council.
        </h1>
        <p className="mx-auto max-w-[520px] text-ink-soft">
          The founding voices whose vision shapes every INVICTUS challenge, every room, every ritual.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-9 md:grid-cols-2 ">
        {founders.map((f, i) => (
          <ProfileCard key={f.name} variant="founder" index={i + 1} {...f} />
        ))}
      </div>
    </main>
  );
}