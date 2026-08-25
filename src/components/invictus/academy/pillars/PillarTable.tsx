"use client";

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
  archivePillar,
  draftPillar,
  publishPillar,
} from "@/lib/features/invictus/academy/pillar/pillarSlice";
import type { ChallengePillar } from "@/lib/features/invictus/academy/pillar/pillarTypes";
import { useAppDispatch } from "@/lib/redux/store/hook";

import { Archive, Edit, Crown } from "lucide-react";

interface Props {
  data: ChallengePillar[];
  onEdit: (pillar: ChallengePillar) => void;
}

const statusBadgeClass: Record<ChallengePillar["status"], string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  published: "bg-green-100 text-green-700 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const statusLabel: Record<ChallengePillar["status"], string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export default function PillarTable({ data, onEdit }: Props) {
  const dispatch = useAppDispatch();

  const handleStatus = (item: ChallengePillar, checked: boolean) => {
    if (checked) {
      dispatch(publishPillar(item._id));
    } else {
      dispatch(draftPillar(item._id));
    }
  };

  const handleArchive = (item: ChallengePillar) => {
    const confirmed = window.confirm(
      `Archive "${item.title}"? Archived pillars are hidden from members and can no longer be edited or published. This cannot be undone.`,
    );
    if (confirmed) {
      dispatch(archivePillar(item._id));
    }
  };

  return (
    <div className="rounded-2xl p-3 border border-[#E7DDCC] bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Tagline</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="font-medium text-[#1C1A17]">{item.name}</TableCell>
              <TableCell className="text-[#8A8175]">{item.slug}</TableCell>
              <TableCell className="max-w-[220px] truncate">{item.tagline}</TableCell>
              <TableCell>
                <Badge className="bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]">
                  {item.icon}
                </Badge>
              </TableCell>

              <TableCell>
                {item.isPaid ? (
                  <Badge className="flex w-fit items-center gap-1 bg-[#1C1A17] text-[#F3E9D2] hover:bg-[#1C1A17]">
                    <Crown size={12} />
                    Premium · {formatPrice(item.priceCents)}
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">Free</Badge>
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
                    title="Edit pillar"
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer text-red-500"
                    disabled={item.status === "archived"}
                    onClick={() => handleArchive(item)}
                    title="Archive pillar"
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
                No challenge pillars yet. Click "Create Pillar" to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}