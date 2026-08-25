import { InstagramIcon, LinkedInIcon } from "@/components/invictus/profiles/icons";
import { ProfileCard } from "@/components/invictus/profiles/profileCard";
import PageContainer from "@/components/common/PageContainer";
import PageHeader from "@/components/common/PageHeader";

import adam from "@/assets/Invictus/Home/adam.jpg";
import founder1 from "@/assets/Invictus/Home/sof1.png";
import founder2 from "@/assets/Invictus/Home/sof.png";

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
    <PageContainer variant="invictus" as="main">
      <div className="mb-16 text-center">
        <PageHeader
          variant="invictus"
          className="flex-col items-center text-center"
          eyebrow="Founders Profiles"
          title="The inspiring Founders in our Council."
          description="The founding voices whose vision shapes every INVICTUS challenge, every room, every ritual."
          titleClassName="text-4xl sm:text-5xl"
        />
      </div>

      <div className="grid grid-cols-1 gap-9 md:grid-cols-2 ">
        {founders.map((f, i) => (
          <ProfileCard key={f.name} variant="founder" index={i + 1} {...f} />
        ))}
      </div>
    </PageContainer>
  );
}