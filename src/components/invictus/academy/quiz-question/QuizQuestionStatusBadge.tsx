"use client";

import { Badge } from "@/components/ui/Badge";

import type { QuizQuestionStatus } from "@/lib/features/invictus/academy/quiz-question/quizQuestionTypes";

interface Props {
  status: QuizQuestionStatus;
}

const statusClass: Record<QuizQuestionStatus, string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",

  published: "bg-green-100 text-green-700 hover:bg-green-100",

  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const statusText: Record<QuizQuestionStatus, string> = {
  draft: "Draft",

  published: "Published",

  archived: "Archived",
};

export default function QuizQuestionStatusBadge({ status }: Props) {
  return <Badge className={statusClass[status]}>{statusText[status]}</Badge>;
}
