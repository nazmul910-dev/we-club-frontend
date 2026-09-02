import React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Layout preset: "dashboard" (dark/full-height) | "invictus" (light/max-w-1180px) | "raw" */
  variant?: "dashboard" | "invictus" | "raw";
  /** HTML tag to render: "div" | "main" | "section" */
  as?: "div" | "main" | "section";
  className?: string;
}

export default function PageContainer({
  children,
  variant = "dashboard",
  as: Component = "div",
  className,
  ...props
}: PageContainerProps) {
  const variantStyles = {
    dashboard:
      "flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)] w-full",
    invictus:
      " min-h-screen bg-[#FAF8F3] text-[#171717] mx-auto max-w-295 px-4 py-8 md:px-8 md:py-10 space-y-8",
    raw: "",
  };

  return (
    <Component
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export { PageContainer };
