import React from "react";
import { cn } from "@/lib/utils";

export interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  /** Theme variant */
  variant?: "dashboard" | "invictus" | "hero" | "plain";
  /** Typography family */
  fontFamily?: "font-display" | "font-playfair" | "font-serif" | "font-sans";
  className?: string;
}

export default function PageTitle({
  children,
  variant = "dashboard",
  fontFamily,
  className,
  ...props
}: PageTitleProps) {
  const isInvictus = variant === "invictus";
  const isHero = variant === "hero";

  const defaultFont =
    fontFamily ||
    (variant === "dashboard"
      ? "font-display"
      : variant === "invictus"
      ? "font-display"
      : isHero
      ? "font-playfair"
      : "font-display");

  const variantStyles = {
    dashboard: "text-3xl md:text-4xl text-white font-semibold",
    invictus: "text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.015em] text-[#1C1A16]",
    hero: "text-3xl sm:text-4xl md:text-6xl font-bold leading-tight text-white",
    plain: "",
  };

  return (
    <h1
      className={cn(defaultFont, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export { PageTitle };
