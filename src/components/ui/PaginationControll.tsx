"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: "dashboard" | "invictus" | "dark" | "light";
}

// Builds a compact page list with ellipses, e.g.:
//   1 ... 4 5 [6] 7 8 ... 20
// Always shows first, last, current, and one neighbor on each side.
function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  });

  return result;
}

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  variant = "dark",
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const isInvictus = variant === "invictus" || variant === "light";
  const pageClassName = isInvictus
    ? "text-ink border-[#D6B15C] hover:bg-gold/20 data-[active=true]:bg-gold data-[active=true]:text-ink"
    : "text-white border-gold hover:bg-gold/20 data-[active=true]:bg-gold data-[active=true]:text-ink";
  const navigationClassName = isInvictus
    ? "text-ink-soft hover:bg-gold/20"
    : "text-white hover:bg-gold/20";

  function go(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  }

  return (
    <Pagination >
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go(currentPage - 1);
            }}
            className={`${navigationClassName} ${
              currentPage === 1 ? "pointer-events-none opacity-40" : ""
            }`}
          />
        </PaginationItem>

        {pages.map((page, i) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis
                className={isInvictus ? "text-ink-soft bg-transparent" : "text-white bg-transparent"}
              />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                className={`${pageClassName} rounded-full text-xs h-7 w-7 border bg-transparent`}
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  go(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              go(currentPage + 1);
            }}
            className={`${navigationClassName} ${
              currentPage === totalPages ? "pointer-events-none opacity-40" : ""
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}