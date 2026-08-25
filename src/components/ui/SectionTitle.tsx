import React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
}

export default function SectionTitle({
  children,
  variant = "light",
  className,
  ...props
}: SectionTitleProps) {
  const variantClass =
    variant === "dark"
      ? "text-white font-playfair text-xl font-semibold mb-4"
      : "font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16] mb-3";

  return (
    <h3 className={cn(variantClass, className)} {...props}>
      {children}
    </h3>
  );
}

export { SectionTitle };