

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/Table";
import { cn } from "@/lib/utils";
 
/**
 * Shape of a single skeleton cell within a column.
 * - "text"   : a single line, optionally with a smaller second line beneath
 *              it (set `subline` for e.g. name + email stacked cells)
 * - "avatar" : a circular thumbnail + a text line beside it (person cells)
 * - "badge"  : a short pill shape (status/role chips)
 * - "circle" : a bare circle with no accompanying text (icon-only cells,
 *              rank badges, checkboxes)
 */
export type TableSkeletonColumnKind = "text" | "avatar" | "badge" | "circle";
 
export interface TableSkeletonColumn {
  /** Visual shape rendered in this column's cells. Defaults to "text". */
  kind?: TableSkeletonColumnKind;
  /** Tailwind width class for the main skeleton bar, e.g. "w-24", "w-full". */
  width?: string;
  /** Renders a shorter second line under the first — only used by "text"/"avatar". */
  subline?: boolean;
  /** Text alignment for this column's cells. */
  align?: "left" | "right" | "center";
  /** Extra classes on the <TableCell>, e.g. to control column width like "w-[20%]". */
  cellClassName?: string;
}
 
export interface TableSkeletonProps {
  /** Number of skeleton rows to render. */
  rows?: number;
  /**
   * Either a column count (renders that many identical "text" columns)
   * or an explicit array of per-column configs for mixed layouts.
   */
  columns?: number | TableSkeletonColumn[];
  /** Renders a header row of skeleton bars above the body. */
  showHeader?: boolean;
  /** Color theme — "dashboard" (dark) or "invictus" (light/sand), matching
   *  the same variant naming used by PageContainer/PageHeader elsewhere. */
  variant?: "dashboard" | "invictus";
  className?: string;
}
 
const ALIGN_CLASS: Record<NonNullable<TableSkeletonColumn["align"]>, string> = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center",
};
 
function normalizeColumns(
  columns: TableSkeletonProps["columns"],
): TableSkeletonColumn[] {
  if (Array.isArray(columns)) return columns;
  const count = columns ?? 4;
  return Array.from({ length: count }, () => ({ kind: "text" as const }));
}
 
function SkeletonCell({
  column,
  bg,
}: {
  column: TableSkeletonColumn;
  bg: string;
}) {
  const { kind = "text", width = "w-24", subline, align = "left" } = column;
  const justify = ALIGN_CLASS[align];
 
  if (kind === "avatar") {
    return (
      <div className={cn("flex items-center gap-3", justify)}>
        <Skeleton className={cn("h-9 w-9 shrink-0 rounded-full", bg)} />
        <div className="flex flex-col gap-2">
          <Skeleton className={cn("h-4", width, bg)} />
          {subline && <Skeleton className={cn("h-3 w-2/3", bg)} />}
        </div>
      </div>
    );
  }
 
  if (kind === "badge") {
    return (
      <div className={cn("flex", justify)}>
        <Skeleton className={cn("h-6 rounded-full", width, bg)} />
      </div>
    );
  }
 
  if (kind === "circle") {
    return (
      <div className={cn("flex", justify)}>
        <Skeleton className={cn("h-8 w-8 rounded-full", bg)} />
      </div>
    );
  }
 
  // "text"
  return (
    <div className={cn("flex flex-col gap-2", justify === "justify-start" ? "" : justify)}>
      <Skeleton className={cn("h-4", width, bg)} />
      {subline && <Skeleton className={cn("h-3 w-2/3", bg)} />}
    </div>
  );
}
 
export default function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = false,
  variant = "dashboard",
  className,
}: TableSkeletonProps) {
  const cols = normalizeColumns(columns);
  const bg = variant === "invictus" ? "bg-[#EFE9DA]" : "bg-neutral-800";
 
  return (
    <div className={cn("overflow-hidden rounded-2xl ", className)}>
      <Table>
        {showHeader && (
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {cols.map((col, i) => (
              <TableCell key={i} className={col.cellClassName}>
                <Skeleton className={cn("h-3 w-16", bg)} />
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
      )}
 
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="hover:bg-transparent">
            {cols.map((col, colIndex) => (
              <TableCell key={colIndex} className={col.cellClassName}>
                <SkeletonCell column={col} bg={bg} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </div>
  );
}
 
