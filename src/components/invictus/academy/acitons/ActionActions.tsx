"use client";

import { Button } from "@/components/ui/button";

import { Archive, Edit } from "lucide-react";

import type { IModuleAction } from "@/lib/features/invictus/academy/action-module/actionChecklistTypes";

interface Props {
  action: IModuleAction;

  onEdit: (action: IModuleAction) => void;

  onArchive: (action: IModuleAction) => void;
}

export default function ActionActions({ action, onEdit, onArchive }: Props) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer"
        disabled={action.status === "archived"}
        onClick={() => onEdit(action)}
        title="Edit action"
      >
        <Edit size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer text-red-500"
        disabled={action.status === "archived"}
        onClick={() => onArchive(action)}
        title="Archive action"
      >
        <Archive size={16} />
      </Button>
    </div>
  );
}
