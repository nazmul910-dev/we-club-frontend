"use client";

import { Badge } from "@/components/ui/Badge";

import type { ModuleActionStatus } from "@/lib/features/invictus/academy/action-module/actionChecklistTypes";

interface Props {
  status: ModuleActionStatus;
}

const statusClass: Record<ModuleActionStatus, string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  published: "bg-green-100 text-green-700 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const statusText: Record<ModuleActionStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export default function ActionStatusBadge({ status }: Props) {
  return <Badge className={statusClass[status]}>{statusText[status]}</Badge>;
}
