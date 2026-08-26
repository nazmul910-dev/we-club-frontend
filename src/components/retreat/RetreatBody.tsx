export type RetreatBodyProps = {
  description: string;
  whatsIncluded: string[];
};

export function RetreatBody({ description, whatsIncluded }: RetreatBodyProps) {
  return (
    <div className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_320px]">
      <p className="max-w-[62ch] text-[0.96rem] leading-[1.8] text-ink-soft">{description}</p>

      <aside className="h-fit  bg-paper-raised p-6 shadow-card rounded-2xl bg-[#FAF6EE] border border-[#DECDB0] shadow-2xs">
        <div className="mb-4 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
          What&apos;s Included
        </div>
        <ul className="space-y-3 ">
          {whatsIncluded.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[0.86rem] text-ink">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="mt-[3px] h-3.5 w-3.5 flex-none text-gold"
              >
                <path d="M12 2l2 5 5 .8-3.6 3.6.9 5.1L12 14l-4.3 2.5.9-5.1L5 7.8 10 7z" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
