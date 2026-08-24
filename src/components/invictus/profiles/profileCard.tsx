import Image from "next/image";
import type { ReactNode } from "react";

export type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

export type ProfileCardProps = {
  /** Which page this card is rendered on. Controls the footer content —
   *  founders get a plain social row, CEOs get the same row plus a CTA. */
  variant: "founder" | "ceo";
  imageSrc: any;
  imageAlt: string;
  /** Small kicker label above the name, e.g. "Founder" or "CEO Profile". */
  kicker: string;
  name: string;
  role: string;
  bio: string;
  socials?: SocialLink[];
  /** Only rendered when variant === "ceo". */
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** Optional numeral badge over the image, used on the founders grid (01, 02, ...). */
  index?: number;
  className?: string;
};

export function ProfileCard({
  variant,
  imageSrc,
  imageAlt,
  kicker,
  name,
  role,
  bio,
  socials = [],
  ctaLabel = "View Profile",
  onCtaClick,
  index,
  className = "",
}: ProfileCardProps) {
  return (
    <article
      className={[
        "card-corners group relative overflow-hidden border border-line bg-paper-raised",
        "shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d8cba4] hover:shadow-card-hover",
        "animate-rise rounded-2xl h-full",
        className,
      ].join(" ")}
    >
      {/* media */}
      <div className="relative aspect-4/3 overflow-hidden bg-black/5">
        {/* {typeof index === "number" && (
          <span className="absolute left-3.5 top-3.5 z-10 bg-black/40 px-2.5 py-1 font-display text-sm italic text-white backdrop-blur-sm">
            {String(index).padStart(2, "0")}
          </span>
        )} */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-transparent to-transparent" />
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="object-cover h-full  max-h-100 grayscale-[28%] contrast-[1.02] transition-all duration-[1100ms] ease-[cubic-bezier(.16,.84,.34,1)] group-hover:scale-[1.07] group-hover:grayscale-0"
        />
      </div>

      {/* body */}
      <div className="px-6 pb-7 pt-6 bg-[#FAF6EE] h-full">
        <div className="mb-2 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gold-deep">
          <span className="h-1.5 w-1.5 flex-none rounded-full bg-gold" />
          {kicker}
        </div>

        <h3 className="mb-2 font-display text-[1.32rem] font-medium leading-tight tracking-[-0.005em] text-ink">
          {name}
        </h3>

        <p className="mb-2 text-[0.74rem] font-medium uppercase tracking-[0.06em] text-ink-soft">
          {role}
        </p>

        <div className="mb-4 h-0.5 w-[34px] bg-gold" />

        <p className="text-[0.9rem] leading-[1.62] text-ink-soft">{bio}</p>

        {/* footer — the only part that differs between founder / ceo */}
        {(socials.length > 0 || variant === "ceo") && (
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
            {socials.length > 0 && (
              <div className="flex gap-2.5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-line text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold-tint hover:text-gold-deep"
                  >
                    <span className="h-3.5 w-3.5 [&>svg]:h-full [&>svg]:w-full">
                      {s.icon}
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* {variant === "ceo" && (
              <button
                onClick={onCtaClick}
                className="cta-wipe relative overflow-hidden whitespace-nowrap border border-ink px-[1.15em] py-[0.68em] text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-[400ms] hover:text-paper"
              >
                <span className="relative z-[1]">{ctaLabel}</span>
              </button>
            )} */}
          </div>
        )}
      </div>
    </article>
  );
}