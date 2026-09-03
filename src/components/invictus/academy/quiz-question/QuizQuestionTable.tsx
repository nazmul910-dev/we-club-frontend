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
  Edit,
  CircleCheck,
  ListChecks,
  CircleHelp,
} from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";

import {
  publishQuizQuestion,
  draftQuizQuestion,
  archiveQuizQuestion,
} from "@/lib/features/invictus/academy/quiz-question/quizQuestionSlice";

import type { IQuizQuestion } from "@/lib/features/invictus/academy/quiz-question/quizQuestionTypes";

import InvictusConfirmDialog from "@/components/invictus/academy/shared/InvictusConfirmDialog";

interface Props {
  data: IQuizQuestion[];

  onEdit: (question: IQuizQuestion) => void;
}

const statusBadgeClass: Record<IQuizQuestion["status"], string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",

  published: "bg-green-100 text-green-700 hover:bg-green-100",

  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const statusLabel: Record<IQuizQuestion["status"], string> = {
  draft: "Draft",

  published: "Published",

  archived: "Archived",
};

const questionTypeLabel = {
  single_choice: "Single Choice",

  multiple_choice: "Multiple Choice",

  true_false: "True / False",
};

export default function QuizQuestionTable({ data, onEdit }: Props) {
  const dispatch = useAppDispatch();

  const [archiveTarget, setArchiveTarget] = useState<IQuizQuestion | null>(
    null,
  );

  const [archiving, setArchiving] = useState(false);

  const handleStatus = (item: IQuizQuestion, checked: boolean) => {
    if (checked) {
      dispatch(publishQuizQuestion(item._id));
    } else {
      dispatch(draftQuizQuestion(item._id));
    }
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;

    try {
      setArchiving(true);

      await dispatch(archiveQuizQuestion(archiveTarget._id)).unwrap();

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
            <TableHead>Question</TableHead>

            <TableHead>Course Module</TableHead>

            <TableHead>Type</TableHead>

            <TableHead>Order</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="max-w-[320px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3E9D2] text-[#B08A3E]">
                    {item.questionType === "true_false" ? (
                      <CircleHelp size={16} />
                    ) : item.questionType === "multiple_choice" ? (
                      <ListChecks size={16} />
                    ) : (
                      <CircleCheck size={16} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#1C1A17]">
                      {item.question}
                    </p>

                    {item.explanation && (
                      <p className="truncate text-xs text-[#8A8175]">
                        {item.explanation}
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

              <TableCell>
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                  {questionTypeLabel[item.questionType]}
                </Badge>
              </TableCell>

              <TableCell className="text-[#8A8175]">{item.order}</TableCell>

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
                    title="Edit question"
                  >
                    <Edit size={16} />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer text-red-500"
                    disabled={item.status === "archived"}
                    onClick={() => setArchiveTarget(item)}
                    title="Archive question"
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
                colSpan={6}
                className="py-10 text-center text-[#8A8175]"
              >
                No quiz questions found. Click "Add Question" to create one.
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
        title="Archive this question?"
        description={
          archiveTarget
            ? `"${archiveTarget.question}" will be hidden from members and can no longer be edited or published.`
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
