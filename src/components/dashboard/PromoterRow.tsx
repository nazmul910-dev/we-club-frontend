export interface Promoter {
  id: number;
  rank: string;
  initials: string;
  name: string;
  company: string;
  views: number;
}

export const promoters: Promoter[] = [
  {
    id: 1,
    rank: "01",
    initials: "HM",
    name: "Hugo Marchetti",
    company: "Marchetti Privée",
    views: 8412,
  },
  {
    id: 2,
    rank: "02",
    initials: "SO",
    name: "Sienna Okonkwo",
    company: "Okonkwo & Co.",
    views: 6230,
  },
  {
    id: 3,
    rank: "03",
    initials: "KT",
    name: "Kenji Tanaka",
    company: "Tanaka Yamato",
    views: 4890,
  },
  {
    id: 4,
    rank: "04",
    initials: "IC",
    name: "Isabel Cortez",
    company: "Cortez Estates",
    views: 3720,
  },
  {
    id: 5,
    rank: "05",
    initials: "MR",
    name: "Mathilde Renard",
    company: "Renard Group",
    views: 2410,
  },
];

interface PromoterRowProps {
  promoter: Promoter;
}

export default function PromoterRow({ promoter }: PromoterRowProps) {
  return (
    <div className="group relative cursor-auto ">
      <div
        className="
        flex items-center justify-between
        rounded-xl
        px-1 py-3
        transition-all duration-300
        hover:bg-[#171717] 
      "
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Rank */}
          <span
            className="
            w-6
            text-[11px]
            font-medium
            tracking-[0.25em]
            text-[#9C7A2C]
          "
          >
            {promoter.rank}
          </span>

          {/* Avatar */}
          <div
            className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-[#7B6128]
            bg-[#131313]
            text-xs
            text-[#D6B25E]
            transition-all
            duration-300
            group-hover:border-[#D6B25E]
            group-hover:shadow-[0_0_18px_rgba(214,178,94,.18)]
          "
          >
            {promoter.initials}
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-medium text-white">{promoter.name}</h4>

            <p className="mt-1 text-xs text-zinc-500">{promoter.company}</p>
          </div>
        </div>

        {/* Right */}

        <div className="text-right">
          <p className="font-display text-xl text-white">
            {promoter.views.toLocaleString()}
          </p>

          <p
            className="
            text-[10px]
            uppercase
            tracking-[0.35em]
            text-zinc-600
          "
          >
            Views
          </p>
        </div>
      </div>

      {/* Divider */}

      <div className="mx-2 h-px bg-[#2A251B] last:hidden" />
    </div>
  );
}
