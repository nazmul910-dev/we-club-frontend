"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { Switch } from "@/components/ui/switch";

import { Archive, Edit, Star, CheckCircle2 } from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";

import {
  archiveModuleAction,
  draftModuleAction,
  publishModuleAction,
} from "@/lib/features/invictus/academy/action-module/actionChecklistSlice";

import type { IModuleAction } from "@/lib/features/invictus/academy/action-module/actionChecklistTypes";

import InvictusConfirmDialog from "@/components/invictus/academy/shared/InvictusConfirmDialog";

interface Props {
  data: IModuleAction[];

  onEdit: (action: IModuleAction) => void;
}

const statusBadgeClass: Record<IModuleAction["status"], string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",

  published: "bg-green-100 text-green-700 hover:bg-green-100",

  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const statusLabel: Record<IModuleAction["status"], string> = {
  draft: "Draft",

  published: "Published",

  archived: "Archived",
};

export default function ActionTable({ data, onEdit }: Props) {
  const dispatch = useAppDispatch();

  const [archiveTarget, setArchiveTarget] = useState<IModuleAction | null>(
    null,
  );

  const [archiving, setArchiving] = useState(false);

  const handleStatus = (item: IModuleAction, checked: boolean) => {
    if (checked) {
      dispatch(publishModuleAction(item._id));
    } else {
      dispatch(draftModuleAction(item._id));
    }
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;

    try {
      setArchiving(true);

      await dispatch(archiveModuleAction(archiveTarget._id)).unwrap();

      setArchiveTarget(null);
    } catch (error) {
      console.log(error);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E7DDCC]  p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>

            <TableHead>Course Module</TableHead>

            <TableHead>Order</TableHead>

            <TableHead>Points</TableHead>

            <TableHead>Required</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="max-w-[280px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3E9D2] text-[#B08A3E]">
                    <CheckCircle2 size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#1C1A17]">
                      {item.title}
                    </p>

                    {item.description && (
                      <p className="truncate text-xs text-[#8A8175]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <p className="truncate text-[#1C1A17]">
                  {item.module?.title || "—"}
                </p>

                {item.module?.pillar?.name && (
                  <p className="text-xs text-[#8A8175]">
                    {item.module.pillar.name}
                  </p>
                )}
              </TableCell>

              <TableCell className="text-[#8A8175]">{item.order}</TableCell>

              <TableCell>
                <Badge className="flex w-fit items-center gap-1 bg-gray-100 text-gray-600 hover:bg-gray-100">
                  <Star size={12} />

                  {item.pointsReward}
                </Badge>
              </TableCell>

              <TableCell>
                {item.isRequired ? (
                  <Badge className="bg-[#1C1A17] text-[#F3E9D2] hover:bg-[#1C1A17]">
                    Required
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                    Optional
                  </Badge>
                )}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch
                    className="cursor-pointer"
                    checked={item.status === "published"}
                    disabled={item.status === "archived"}
                    onCheckedChange={(value) => handleStatus(item, value)}
                  />

                  <Badge className={statusBadgeClass[item.status]}>
                    {statusLabel[item.status]}
                  </Badge>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    disabled={item.status === "archived"}
                    onClick={() => onEdit(item)}
                    title="Edit action"
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer text-red-500"
                    disabled={item.status === "archived"}
                    onClick={() => setArchiveTarget(item)}
                    title="Archive action"
                  >
                    <Archive size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-[#8A8175]"
              >
                No module actions yet. Click "Add Action" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <InvictusConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        title="Archive this action?"
        description={
          archiveTarget
            ? `"${archiveTarget.title}" will be hidden from members and can no longer be edited or published.`
            : undefined
        }
        confirmText="Archive"
        confirmVariant="danger"
        loading={archiving}
        onConfirm={confirmArchive}
      />
    </div>
  );
}
