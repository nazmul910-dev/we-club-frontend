import React from "react";
import { cn } from "@/lib/utils";
import PageTitle from "./PageTitle";

export interface PageHeaderProps {
  /** Upper kicker / eyebrow text */
  eyebrow?: React.ReactNode;
  /** Primary page title (string or JSX) */
  title: React.ReactNode;
  /** Subtitle / descriptive paragraph */
  description?: React.ReactNode;
  /** Right-hand side action buttons, badges, filters, search */
  actions?: React.ReactNode;
  /** Theme variant: "dashboard" (dark/gold), "invictus" (light/sand), or "plain" */
  variant?: "dashboard" | "invictus" | "plain";
  /** Optional custom typography font family for title */
  fontFamily?: "font-display" | "font-playfair" | "font-serif" | "font-sans";
  /** Extra container className */
  className?: string;
  /** Extra title className */
  titleClassName?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  variant = "dashboard",
  fontFamily,
  className,
  titleClassName,
}: PageHeaderProps) {
  const isInvictus = variant === "invictus";

  const eyebrowClass = isInvictus
    ? "text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A88A3F] mb-2"
    : "text-eyebrow mb-2";

  const descriptionClass = isInvictus
    ? "mt-2 text-sm text-[#777] max-w-2xl"
    : "mt-1.5 text-sm text-muted-foreground max-w-3xl";

  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && <div className={eyebrowClass}>{eyebrow}</div>}
        <PageTitle
          variant={variant}
          fontFamily={fontFamily}
          className={titleClassName}
        >
          {title}
        </PageTitle>
        {description && (
          <p className={descriptionClass}>
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}

export { PageHeader };
