"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Plus, Trash2 } from "lucide-react";

import { useAppDispatch } from "@/lib/redux/store/hook";

import { createQuizQuestion } from "@/lib/features/invictus/academy/quiz-question/quizQuestionSlice";

import {
  QUIZ_QUESTION_TYPES,
  type QuizQuestionType,
} from "@/lib/features/invictus/academy/quiz-question/quizQuestionTypes";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";

import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
}

const emptyForm = {
  moduleId: "",
  question: "",
  questionType: "single_choice" as QuizQuestionType,
  options: ["", ""],
  correctOptionIndexes: [0],
  correctBooleanAnswer: true,
  explanation: "",
  order: 1,
};

export default function CreateQuizQuestionModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

  const [courses, setCourses] = useState<ICourseModule[]>([]);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      loadCourses();
    }
  }, [open]);

  const loadCourses = async () => {
    try {
      const res = await courseApi.getCourses();

      setCourses(res.data.filter((item) => item.status === "published"));
    } catch (error) {
      console.log(error);
    }
  };

  const updateField = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const addOption = () => {
    setForm((prev) => ({
      ...prev,

      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index: number) => {
    setForm((prev) => ({
      ...prev,

      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const updateOption = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,

      options: prev.options.map((item, i) => (i === index ? value : item)),
    }));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.moduleId) next.moduleId = "Select module";

    if (!form.question.trim()) next.question = "Question is required";

    if (form.questionType !== "true_false") {
      if (form.options.some((item) => !item.trim()))
        next.options = "All options are required";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setForm(emptyForm);

    setErrors({});
  };

  const handleClose = () => {
    reset();

    onClose();
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const payload: any = {
        question: form.question.trim(),

        questionType: form.questionType,

        explanation: form.explanation,

        order: form.order,
      };

      if (
        form.questionType === "single_choice" ||
        form.questionType === "multiple_choice"
      ) {
        payload.options = form.options;

        payload.correctOptionIndexes = form.correctOptionIndexes;
      }

      if (form.questionType === "true_false") {
        payload.correctBooleanAnswer = form.correctBooleanAnswer;
      }

      await dispatch(
        createQuizQuestion({
          moduleId: form.moduleId,

          data: payload,
        }),
      ).unwrap();

      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">
            Add Quiz Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Course Module</Label>

            <select
              value={form.moduleId}
              onChange={(e) => updateField("moduleId", e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E7DDCC] p-3"
            >
              <option value="">Select Course Module</option>

              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} · {course.pillar?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Question</Label>

            <Textarea
              value={form.question}
              onChange={(e) => updateField("question", e.target.value)}
              className="mt-2 min-h-[100px]"
              placeholder="Enter question"
            />
          </div>

          <div>
            <Label>Question Type</Label>

            <select
              value={form.questionType}
              onChange={(e) =>
                updateField("questionType", e.target.value as QuizQuestionType)
              }
              className="mt-2 w-full rounded-xl border border-[#E7DDCC] p-3"
            >
              {QUIZ_QUESTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {form.questionType !== "true_false" && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Options</Label>

                <button
                  type="button"
                  onClick={addOption}
                  className="flex cursor-pointer items-center gap-1 text-sm text-[#B08A3E]"
                >
                  <Plus size={15} />
                  Add
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {form.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="cursor-pointer text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {form.questionType === "true_false" && (
            <div>
              <Label>Correct Answer</Label>

              <select
                value={String(form.correctBooleanAnswer)}
                onChange={(e) =>
                  updateField("correctBooleanAnswer", e.target.value === "true")
                }
                className="mt-2 w-full rounded-xl border border-[#E7DDCC] p-3"
              >
                <option value="true">True</option>

                <option value="false">False</option>
              </select>
            </div>
          )}

          <div>
            <Label>Explanation</Label>

            <Textarea
              value={form.explanation}
              onChange={(e) => updateField("explanation", e.target.value)}
              className="mt-2"
              placeholder="Explain the answer"
            />
          </div>

          <div>
            <Label>Order</Label>

            <Input
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => updateField("order", Number(e.target.value))}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="cursor-pointer border-[#E7DDCC]"
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={submit}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
          >
            {loading ? "Saving..." : "Add Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
