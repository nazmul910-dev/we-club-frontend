"use client";

import { Button } from "@/components/ui/button";

import { Archive, Edit } from "lucide-react";

import type { IQuizQuestion } from "@/lib/features/invictus/academy/quiz-question/quizQuestionTypes";

interface Props {
  question: IQuizQuestion;

  onEdit: (question: IQuizQuestion) => void;

  onArchive: (question: IQuizQuestion) => void;
}

export default function QuizQuestionActions({
  question,
  onEdit,
  onArchive,
}: Props) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer"
        disabled={question.status === "archived"}
        onClick={() => onEdit(question)}
        title="Edit question"
      >
        <Edit size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer text-red-500"
        disabled={question.status === "archived"}
        onClick={() => onArchive(question)}
        title="Archive question"
      >
        <Archive size={16} />
      </Button>
    </div>
  );
}
