import React from "react";
import PageHeader from "@/components/common/PageHeader";

export interface TitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  variant?: "dashboard" | "invictus" | "plain";
  className?: string;
}

export default function Title({
  subtitle,
  title,
  description,
  actions,
  variant = "dashboard",
  className,
}: TitleProps) {
  return (
    <PageHeader
      eyebrow={subtitle}
      title={title}
      description={description}
      actions={actions}
      variant={variant}
      className={className}
    />
  );
}

export { Title };