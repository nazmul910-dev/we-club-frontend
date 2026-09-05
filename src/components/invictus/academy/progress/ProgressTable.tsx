"use client";

import { Eye, CircleCheck, Clock, BookOpen } from "lucide-react";

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

import type { IUserModuleProgressGroup } from "@/lib/features/invictus/academy/progress/progressTypes";

import ProgressStatBar from "./ProgressStatBar";

interface Props {
  data: IUserModuleProgressGroup[];
  onView: (group: IUserModuleProgressGroup) => void;
}

export default function ProgressTable({ data, onView }: Props) {
  return (
    <div className="rounded-2xl border border-[#E7DDCC] ">
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[220px]">Member</TableHead>
              <TableHead className="w-[140px]">Modules</TableHead>
              <TableHead className="w-[160px]">Avg. Completion</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[70px] text-right">Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((group) => {
              const key = group.user?._id || `${group.records[0]?._id}`;

              return (
                <TableRow
                  key={key}
                  className="cursor-pointer transition-colors "
                  onClick={() => onView(group)}
                >
                  <TableCell className="max-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3E9D2] text-xs font-semibold text-[#B08A3E]">
                        {group.user?.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={group.user.profileImage} alt={group.user?.fullName || "Member"} className="h-full w-full object-cover" />
                        ) : (
                          (group.user?.fullName || "U").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#1C1A17]">{group.user?.fullName || "Unknown Member"}</p>
                        <p className="truncate text-xs text-[#8A8175]">{group.user?.email || "—"}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="w-[140px] align-top">
                    <div className="flex items-center gap-2 text-sm text-[#1C1A17]">
                      <BookOpen size={14} className="text-[#B08A3E]" />
                      <span className="whitespace-nowrap">
                        {group.completedModules}/{group.totalModules} done
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="w-[160px] align-top">
                    <ProgressStatBar
                      label="Overall"
                      completed={group.completedModules}
                      total={group.totalModules}
                      percent={group.avgCompletionPercent}
                      isDone={group.isFullyCompleted}
                    />
                  </TableCell>

                  <TableCell className="w-[150px] align-top">
                    {group.isFullyCompleted ? (
                      <Badge className="flex w-fit items-center gap-1 whitespace-nowrap bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <CircleCheck size={12} />
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="flex w-fit items-center gap-1 whitespace-nowrap bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]">
                        <Clock size={12} />
                        In Progress
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="w-[70px] text-right align-top">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#B08A3E] hover:text-[#B08A3E] active:translate-y-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(group);
                        }}
                        title="View this member's full progress"
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-[#8A8175]">
                  No progress records found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}