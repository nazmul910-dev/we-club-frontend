export type RetreatBodyProps = {
  description: string;
  whatsIncluded: string[];
};

const normalizeIncludedItems = (items: string[]): string[] =>
  items.flatMap((item) => {
    const value = item.trim();
    if (!value) return [];

    try {
      const parsed: unknown = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (entry): entry is string =>
            typeof entry === "string" && entry.trim().length > 0,
        ).map((entry) => entry.trim());
      }
    } catch {
      // Keep regular text items unchanged.
    }

    return [value];
  });

export function RetreatBody({ description, whatsIncluded }: RetreatBodyProps) {
  const includedItems = normalizeIncludedItems(whatsIncluded);

  return (
    <div className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_320px]">
      <p className="max-w-[62ch] text-[0.96rem] leading-[1.8] text-ink-soft">{description}</p>

      <aside className="h-fit rounded-2xl border border-[#DECDB0] bg-[#FAF6EE] p-6 shadow-2xs">
        <div className="mb-4 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
          What&apos;s Included
        </div>
        <ul className="space-y-2.5">
          {includedItems.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-[0.86rem] leading-relaxed text-ink">
              <span aria-hidden="true" className="mt-[0.45rem] h-1.5 w-1.5 flex-none rounded-full bg-gold" />
              <span className="min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
