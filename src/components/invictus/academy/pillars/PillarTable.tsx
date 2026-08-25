"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Switch } from "@/components/ui/switch";
import { deletePillar, draftPillar, publishPillar } from "@/lib/features/invictus/academy/pillar/pillarSlice";
import { useAppDispatch } from "@/lib/redux/store/hook";

import { Trash2, Edit } from "lucide-react";

interface Props {
  data: any[];
}

export default function PillarTable({ data }: Props) {
  const dispatch = useAppDispatch();

  const handleStatus = (
    item: any,

    checked: boolean,
  ) => {
    if (checked) {
      dispatch(publishPillar(item._id));
    } else {
      dispatch(draftPillar(item._id));
    }
  };

  return (
    <div className="rounded-2xl border border-[#E7DDCC] bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>

            <TableHead>Slug</TableHead>

            <TableHead>Tagline</TableHead>

            <TableHead>Icon</TableHead>

            <TableHead>Published Status</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="font-medium text-[#1C1A17]">
                {item.name}
              </TableCell>

              <TableCell className="text-[#8A8175]">{item.slug}</TableCell>

              <TableCell>{item.tagline}</TableCell>

              <TableCell>
                <Badge className="bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]">
                  {item.icon}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch
                    className="cursor-pointer "
                    checked={item.status === "published"}
                    onCheckedChange={(value) => handleStatus(item, value)}
                  />

                  <span className="text-sm text-[#8A8175]">
                    {item.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <Edit size={16} />
                  </Button>

                  {/* <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer text-red-500"
                    onClick={() => {
                      dispatch(deletePillar(item._id));
                    }}
                  >
                    <Trash2 size={16} />
                  </Button> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
