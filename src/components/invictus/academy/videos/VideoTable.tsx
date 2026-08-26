"use client";

import { useRouter } from "next/navigation";

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

import { Archive, Crown, Edit, Eye, PlayCircle } from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";
import {
  archiveVideo,
  draftVideo,
  publishVideo,
} from "@/lib/features/invictus/academy/video-module/videoSlice";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";

interface Props {
  data: IModuleVideo[];
  onEdit: (video: IModuleVideo) => void;
}

const statusBadgeClass: Record<IModuleVideo["status"], string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  published: "bg-green-100 text-green-700 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const statusLabel: Record<IModuleVideo["status"], string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

const formatDuration = (seconds: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function VideoTable({ data, onEdit }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleStatus = (item: IModuleVideo, checked: boolean) => {
    if (checked) {
      dispatch(publishVideo(item._id));
    } else {
      dispatch(draftVideo(item._id));
    }
  };

  const handleArchive = (item: IModuleVideo) => {
    const confirmed = window.confirm(
      `Archive "${item.title}"? Archived videos are hidden from members and can no longer be edited or published. This cannot be undone.`,
    );
    if (confirmed) {
      dispatch(archiveVideo(item._id));
    }
  };

  return (
    <div className="rounded-2xl border border-[#E7DDCC] bg-white p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Video</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="max-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3E9D2] text-[#B08A3E]">
                    <PlayCircle size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#1C1A17]">
                      {item.title}
                    </p>
                    <p className="truncate text-xs text-[#8A8175]">
                      {item.slug}
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

              <TableCell className="text-[#8A8175]">{item.order}</TableCell>

              <TableCell className="text-[#8A8175]">
                {formatDuration(item.durationSeconds)}
              </TableCell>

              <TableCell>
                {item.isPaid ? (
                  <Badge className="flex w-fit items-center gap-1 bg-[#1C1A17] text-[#F3E9D2] hover:bg-[#1C1A17]">
                    <Crown size={12} />
                    Premium
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                    Free
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
                    onClick={() =>
                      router.push(`/invictus/academy/manage-videos/${item._id}`)
                    }
                    title="View details"
                  >
                    <Eye size={16} />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    disabled={item.status === "archived"}
                    onClick={() => onEdit(item)}
                    title="Edit video"
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer text-red-500"
                    disabled={item.status === "archived"}
                    onClick={() => handleArchive(item)}
                    title="Archive video"
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
                No module videos yet. Click &quot;Upload Video&quot; to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}