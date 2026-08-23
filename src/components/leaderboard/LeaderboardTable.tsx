import type { ReactNode } from "react";

export type LedgerColumn<T> = {
  key: string;
  label: string;
  align?: "left" | "right";
  /** Tailwind width class for this <th>, e.g. "w-14" for the rank column. */
  width?: string;
  render: (row: T) => ReactNode;
};

export type LeaderboardTableProps<T> = {
  kickerIcon: ReactNode;
  kicker: string;
  title: string;
  tag: string;
  live?: boolean;
  columns: LedgerColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  delay?: number;
};

export function LeaderboardTable<T>({
  kickerIcon,
  kicker,
  title,
  tag,
  live = false,
  columns,
  rows,
  rowKey,
  delay = 0,
}: LeaderboardTableProps<T>) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="mb-9 animate-rise border border-line bg-paper-raised  shadow-panel"
    >
      {/* head */}
      <div className="flex flex-wrap items-end justify-between gap-2.5 border-b border-line px-7 pb-5 pt-7">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
            <span className="h-3 w-3 [&>svg]:h-full [&>svg]:w-full">{kickerIcon}</span>
            {kicker}
          </div>
          <h2 className="font-display text-[1.32rem] font-medium tracking-[-0.005em] text-ink">
            {title}
          </h2>
        </div>

        <span
          className={`pb-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.14em] ${
            live ? "inline-flex items-center gap-2 text-accent-green" : "text-ink-faint"
          }`}
        >
          {live && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-green" />
            </span>
          )}
          {tag}
        </span>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border-b border-line px-7 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-faint ${
                    col.align === "right" ? "text-right" : "text-left"
                  } ${col.width ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="group relative border-b border-line transition-colors duration-300 last:border-b-0 hover:bg-gradient-to-r hover:from-gold-tint hover:to-transparent"
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={`relative px-7 py-3.5 text-[0.85rem] ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {i === 0 && (
                      <span className="absolute left-0 top-0 h-full w-0.5 origin-center scale-y-0 bg-gold transition-transform duration-300 group-hover:scale-y-100" />
                    )}
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
