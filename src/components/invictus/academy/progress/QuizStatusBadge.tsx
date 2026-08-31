"use client";

import { Badge } from "@/components/ui/Badge";
import type { QuizProgressStatus } from "@/lib/features/invictus/academy/progress/progressTypes";

const styles: Record<QuizProgressStatus, string> = {
  locked: "bg-gray-100 text-gray-500 hover:bg-gray-100",
  unlocked: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  in_progress: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  passed: "bg-green-100 text-green-700 hover:bg-green-100",
  failed: "bg-red-100 text-red-600 hover:bg-red-100",
};

const labels: Record<QuizProgressStatus, string> = {
  locked: "Locked",
  unlocked: "Unlocked",
  in_progress: "In Progress",
  passed: "Passed",
  failed: "Failed",
};

export default function QuizStatusBadge({ status }: { status: QuizProgressStatus }) {
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
}