import React from "react";
import { cn } from "@/lib/utils";

export interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "dark" | "dark-border" | "light" | "invictus";
  className?: string;
}

export default function SectionCard({
  children,
  variant = "dark",
  className,
  ...props
}: SectionCardProps) {
  const variantStyles = {
    dark: "rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6 shadow-xl",
    "dark-border": "rounded-2xl border border-neutral-800 bg-[#0B0B0B] p-6 shadow-xl",
    light: "rounded-xl border border-[#E9E2D2] bg-white p-6 shadow-xs",
    invictus: "rounded-xl border border-[#DECDB0] bg-[#FAF6EE] p-6 shadow-2xs",
  };

  return (
    <section className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </section>
  );
}

export { SectionCard };
