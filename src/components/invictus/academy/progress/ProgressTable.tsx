"use client";

import { Eye, CircleCheck, Clock } from "lucide-react";

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

import type { IModuleProgress } from "@/lib/features/invictus/academy/progress/progressTypes";

import ProgressStatBar from "./ProgressStatBar";
import QuizStatusBadge from "./QuizStatusBadge";

interface Props {
  data: IModuleProgress[];
  onView: (record: IModuleProgress) => void;
}

export default function ProgressTable({ data, onView }: Props) {
  return (
    <div className="rounded-2xl border border-[#E7DDCC] bg-white p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Videos</TableHead>
            <TableHead>Resources</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Quiz</TableHead>
            <TableHead>Overall</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id} className="cursor-pointer transition-colors hover:bg-[#FAF8F4]" onClick={() => onView(item)}>
              <TableCell className="max-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F3E9D2] text-xs font-semibold text-[#B08A3E]">
                    {item.user?.profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.user.profileImage} alt={item.user?.fullName || "Member"} className="h-full w-full object-cover" />
                    ) : (
                      (item.user?.fullName || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#1C1A17]">{item.user?.fullName || "Unknown Member"}</p>
                    <p className="truncate text-xs text-[#8A8175]">{item.user?.email || "—"}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="max-w-[200px]">
                <p className="truncate text-[#1C1A17]">{item.module?.title || "—"}</p>
                {item.module?.pillar?.name && (
                  <p className="truncate text-xs text-[#8A8175]">{item.module.pillar.name}</p>
                )}
              </TableCell>

              <TableCell className="w-[140px]">
                <ProgressStatBar label="Videos" completed={item.videoSummary.completedRequired} total={item.videoSummary.totalRequired} percent={item.videoSummary.completionPercent} isDone={item.videoSummary.completed} />
              </TableCell>

              <TableCell className="w-[140px]">
                <ProgressStatBar label="Resources" completed={item.resourceSummary.completedRequired} total={item.resourceSummary.totalRequired} percent={item.resourceSummary.completionPercent} isDone={item.resourceSummary.completed} />
              </TableCell>

              <TableCell className="w-[140px]">
                <ProgressStatBar label="Actions" completed={item.actionSummary.completedRequired} total={item.actionSummary.totalRequired} percent={item.actionSummary.completionPercent} isDone={item.actionSummary.completed} />
              </TableCell>

              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <QuizStatusBadge status={item.quizSummary.status} />
                  <span className="text-xs text-[#8A8175]">Best {item.quizSummary.bestScore}%</span>
                </div>
              </TableCell>

              <TableCell className="w-[130px]">
                <ProgressStatBar label="Overall" completed={0} total={0} percent={item.overallCompletionPercent} isDone={item.isCompleted} />
              </TableCell>

              <TableCell>
                {item.isCompleted ? (
                  <Badge className="flex w-fit items-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    <CircleCheck size={12} />
                    Completed
                  </Badge>
                ) : (
                  <Badge className="flex w-fit items-center gap-1 bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]">
                    <Clock size={12} />
                    In Progress
                  </Badge>
                )}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button variant="outline" size="icon" className="cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#B08A3E] hover:text-[#B08A3E] active:translate-y-0" onClick={(e) => { e.stopPropagation(); onView(item); }} title="View progress detail">
                    <Eye size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="py-10 text-center text-[#8A8175]">
                No progress records found for the selected filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}