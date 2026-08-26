import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "dark" | "light";
  className?: string;
  children?: React.ReactNode;
}

export default function EmptyState({
  icon,
  kicker,
  title,
  description,
  action,
  variant = "dark",
  className,
  children,
}: EmptyStateProps) {
  const isLight = variant === "light";

  return (
    <div
      className={cn(
        "flex min-h-[30vh] flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl",
        isLight
          ? "border border-[#E9E2D2] bg-white text-[#1C1A16]"
          : "border border-gold-soft/30 bg-[#111111]/70 text-white shadow-xl",
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
            isLight ? "bg-[#FAF6EE] text-[#A88A3F]" : "bg-white/5 text-gold"
          )}
        >
          {icon}
        </div>
      )}

      {kicker && (
        <span
          className={cn(
            "mb-2 text-xs font-semibold uppercase tracking-[0.25em]",
            isLight ? "text-[#A88A3F]" : "text-gold"
          )}
        >
          {kicker}
        </span>
      )}

      <h2
        className={cn(
          "max-w-md text-xl sm:text-2xl font-semibold",
          isLight ? "text-[#1C1A16]" : "text-white"
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-2.5 max-w-lg text-sm leading-relaxed",
            isLight ? "text-[#8A8375]" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
      {children}
    </div>
  );
}

export { EmptyState };
