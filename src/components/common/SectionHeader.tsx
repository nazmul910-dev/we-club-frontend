import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: "dashboard" | "invictus" | "label";
  className?: string;
  titleClassName?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  description,
  actions,
  variant = "dashboard",
  className,
  titleClassName,
}: SectionHeaderProps) {
  if (variant === "label") {
    return (
      <div className={cn("mb-3", className)}>
        <h3 className={cn("text-xs font-semibold uppercase tracking-wider text-gray-500", titleClassName)}>
          {title}
        </h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    );
  }

  const isInvictus = variant === "invictus";

  const titleClass = isInvictus
    ? "font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold text-[#1C1A16]"
    : "font-playfair text-xl font-semibold text-white";

  return (
    <div className={cn("mb-4 flex flex-wrap items-center justify-between gap-3", className)}>
      <div>
        {subtitle && (
          <p
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.14em] mb-1.5",
              isInvictus ? "text-[#9C9284]" : "text-gold"
            )}
          >
            {subtitle}
          </p>
        )}
        <h2 className={cn(titleClass, titleClassName)}>{title}</h2>
        {description && (
          <p
            className={cn(
              "text-sm mt-1",
              isInvictus ? "text-[#8A8375]" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export { SectionHeader };
