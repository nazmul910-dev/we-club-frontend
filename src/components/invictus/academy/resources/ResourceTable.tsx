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

import {
  Archive,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Link2,
  ShieldCheck,
} from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";
import {
  archiveResource,
  draftResource,
  publishResource,
} from "@/lib/features/invictus/academy/resource/resourceSlice";
import type { IModuleResource } from "@/lib/features/invictus/academy/resource/resourceTypes";

import InvictusConfirmDialog from "@/components/invictus/academy/shared/InvictusConfirmDialog";

interface Props {
  data: IModuleResource[];
  onEdit: (resource: IModuleResource) => void;
}

const statusBadgeClass: Record<IModuleResource["status"], string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  published: "bg-green-100 text-green-700 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const statusLabel: Record<IModuleResource["status"], string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

const typeLabel: Record<IModuleResource["resourceType"], string> = {
  pdf: "PDF",
  worksheet: "Worksheet",
  template: "Template",
  external_link: "External Link",
  other: "Other",
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return "—";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function ResourceTable({ data, onEdit }: Props) {
  const dispatch = useAppDispatch();

  const [archiveTarget, setArchiveTarget] = useState<IModuleResource | null>(
    null,
  );
  const [archiving, setArchiving] = useState(false);

  const handleStatus = (item: IModuleResource, checked: boolean) => {
    if (checked) {
      dispatch(publishResource(item._id));
    } else {
      dispatch(draftResource(item._id));
    }
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;
    try {
      setArchiving(true);
      await dispatch(archiveResource(archiveTarget._id)).unwrap();
      setArchiveTarget(null);
    } catch (err) {
      console.log(err);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E7DDCC] p-3">
      <Table>
        <TableHeader className="">
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>Course Module</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="max-w-[260px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3E9D2] text-[#B08A3E]">
                    {item.provider === "external" ? (
                      <Link2 size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#1C1A17]">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-[#8A8175]">
                      {item.provider === "external"
                        ? item.externalUrl
                        : `${item.fileName || item.slug} · ${formatBytes(item.bytes)}`}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-[#8A8175]">
                <p className="truncate text-[#1C1A17]">
                  {item.module?.title || "—"}
                </p>
                {item.module?.pillar?.name && (
                  <p className="text-xs text-[#8A8175]">
                    {item.module.pillar.name}
                  </p>
                )}
              </TableCell>

              <TableCell>
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {typeLabel[item.resourceType]}
                </Badge>
              </TableCell>

              <TableCell className="text-[#8A8175]">{item.order}</TableCell>

              <TableCell>
                {item.isRequired ? (
                  <Badge className="flex w-fit items-center gap-1 bg-[#1C1A17] text-[#F3E9D2] hover:bg-[#1C1A17]">
                    <ShieldCheck size={12} />
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
                  {(item.secureUrl || item.externalUrl) && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() =>
                        window.open(
                          item.secureUrl || item.externalUrl,
                          "_blank",
                        )
                      }
                      title={
                        item.provider === "external"
                          ? "Open link"
                          : "Download file"
                      }
                    >
                      {item.provider === "external" ? (
                        <ExternalLink size={16} />
                      ) : (
                        <Download size={16} />
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    disabled={item.status === "archived"}
                    onClick={() => onEdit(item)}
                    title="Edit resource"
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer text-red-500"
                    disabled={item.status === "archived"}
                    onClick={() => setArchiveTarget(item)}
                    title="Archive resource"
                  >
                    <Archive size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-[#8A8175]">
                No module resources yet. Click &quot;Add Resource&quot; to add one.
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
        title="Archive this resource?"
        description={
          archiveTarget
            ? `"${archiveTarget.title}" will be hidden from members and can no longer be edited or published. This cannot be undone.`
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