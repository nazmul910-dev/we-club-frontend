"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  CheckSquare,
  Square,
  Edit3,
  XCircle,
} from "lucide-react";
import { useAppDispatch } from "@/lib/redux/store/hook";
import { updateQuizQuestion } from "@/lib/features/invictus/academy/quiz-question/quizQuestionSlice";
import {
  QUIZ_QUESTION_TYPES,
  type QuizQuestionType,
  type IQuizQuestion,
} from "@/lib/features/invictus/academy/quiz-question/quizQuestionTypes";

interface Props {
  open: boolean;
  question: IQuizQuestion | null;
  onClose: () => void;
}

const emptyForm = {
  question: "",
  questionType: "single_choice" as QuizQuestionType,
  options: ["", ""],
  correctOptionIndexes: [0],
  correctBooleanAnswer: true,
  explanation: "",
  order: 1,
};

export default function EditQuizQuestionModal({
  open,
  question,
  onClose,
}: Props) {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (question) {
      setForm({
        question: question.question || "",
        questionType: question.questionType || "single_choice",
        options: question.options && question.options.length >= 2 ? [...question.options] : ["", ""],
        correctOptionIndexes: question.correctOptionIndexes && question.correctOptionIndexes.length > 0
          ? [...question.correctOptionIndexes]
          : [0],
        correctBooleanAnswer: question.correctBooleanAnswer ?? true,
        explanation: question.explanation || "",
        order: question.order || 1,
      });
      setErrors({});
    }
  }, [question, open]);

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

  const handleTypeChange = (type: QuizQuestionType) => {
    setForm((prev) => ({
      ...prev,
      questionType: type,
      options: type === "true_false" ? ["", ""] : prev.options.length >= 2 ? prev.options : ["", ""],
      correctOptionIndexes: [0],
      correctBooleanAnswer: true,
    }));
    setErrors({});
  };

  const addOption = () => {
    if (form.options.length >= 6) {
      toast.error("Maximum 6 options allowed per question");
      return;
    }
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index: number) => {
    if (form.options.length <= 2) {
      toast.error("A question requires at least 2 options");
      return;
    }

    setForm((prev) => {
      const nextOptions = prev.options.filter((_, i) => i !== index);
      let nextCorrect = prev.correctOptionIndexes
        .filter((i) => i !== index)
        .map((i) => (i > index ? i - 1 : i));

      if (nextCorrect.length === 0) {
        nextCorrect = [0];
      }

      return {
        ...prev,
        options: nextOptions,
        correctOptionIndexes: nextCorrect,
      };
    });
  };

  const updateOption = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.map((item, i) => (i === index ? value : item)),
    }));
  };

  const setSingleCorrectOption = (index: number) => {
    setForm((prev) => ({
      ...prev,
      correctOptionIndexes: [index],
    }));
    setErrors((prev) => ({ ...prev, correctOptionIndexes: "" }));
  };

  const toggleMultiCorrectOption = (index: number) => {
    setForm((prev) => {
      const current = prev.correctOptionIndexes;
      const next = current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index];
      return {
        ...prev,
        correctOptionIndexes: next,
      };
    });
    setErrors((prev) => ({ ...prev, correctOptionIndexes: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.question.trim()) next.question = "Question statement is required";

    if (form.questionType !== "true_false") {
      if (form.options.some((item) => !item.trim())) {
        next.options = "All options must have text filled in";
      }
      const trimmed = form.options.map((o) => o.trim().toLowerCase());
      if (new Set(trimmed).size !== form.options.length) {
        next.options = "All options must be unique";
      }

      if (!form.correctOptionIndexes || form.correctOptionIndexes.length === 0) {
        next.correctOptionIndexes = "Please choose at least one correct answer";
      }
    }

    if (!form.order || form.order < 1) {
      next.order = "Order must be at least 1";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const submit = async () => {
    if (!question) return;

    if (!validate()) {
      toast.error("Please fill in all required question fields");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        question: form.question.trim(),
        questionType: form.questionType,
        explanation: form.explanation.trim() || undefined,
        order: Number(form.order),
      };

      if (form.questionType === "single_choice" || form.questionType === "multiple_choice") {
        payload.options = form.options.map((o) => o.trim());
        payload.correctOptionIndexes = form.correctOptionIndexes;
      }

      if (form.questionType === "true_false") {
        payload.correctBooleanAnswer = form.correctBooleanAnswer;
      }

      await dispatch(
        updateQuizQuestion({
          id: question._id,
          data: payload,
        }),
      ).unwrap();

      toast.success("Quiz question updated successfully!");
      handleClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to update quiz question";
      toast.error(msg);
      setErrors((prev) => ({ ...prev, form: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold text-[#1C1A17]">
            <Edit3 className="text-[#B08A3E]" size={24} />
            Edit Quiz Question
          </DialogTitle>
          <p className="text-xs text-[#8A8175]">
            Modify the question statement, question type, options, and designated correct answer(s).
          </p>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Module Banner */}
          {question?.module && (
            <div className="rounded-2xl border border-[#E7DDCC] bg-[#FAF8F4] p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8175]">Module</p>
              <p className="mt-0.5 text-sm font-medium text-[#1C1A17]">
                {question.module.title} · {question.module.pillar?.name || "Pillar"}
              </p>
            </div>
          )}

          {/* Question Text */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#8A8175]">Question Statement *</Label>
            <Textarea
              value={form.question}
              onChange={(e) => updateField("question", e.target.value)}
              className="mt-1.5 min-h-[90px] rounded-xl border-[#E7DDCC] text-sm focus-visible:ring-[#B08A3E]"
            />
            {errors.question && <p className="mt-1 text-xs text-red-500">{errors.question}</p>}
          </div>

          {/* Question Type */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#8A8175]">Question Type</Label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {QUIZ_QUESTION_TYPES.map((type) => {
                const isActive = form.questionType === type;
                const labels: Record<string, string> = {
                  single_choice: "Single Choice",
                  multiple_choice: "Multiple Choice",
                  true_false: "True / False",
                };
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`cursor-pointer rounded-xl border p-3 text-center text-xs font-medium transition duration-200 hover:-translate-y-0.5 ${
                      isActive
                        ? "border-[#B08A3E] bg-[#F3E9D2] text-[#B08A3E] shadow-sm"
                        : "border-[#E7DDCC] bg-[#FAF8F4] text-[#8A8175] hover:border-[#B08A3E]/60 hover:text-[#1C1A17]"
                    }`}
                  >
                    {labels[type]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choice Question Options & Correct Selection */}
          {form.questionType !== "true_false" && (
            <div className="rounded-2xl border border-[#E7DDCC] bg-[#FAF8F4] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-[#1C1A17]">
                    Options & Correct Answer Selection
                  </Label>
                  <p className="text-[11px] text-[#8A8175]">
                    {form.questionType === "single_choice"
                      ? "Click the radio button to select the correct answer."
                      : "Check all options that are correct answers."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addOption}
                  className="flex cursor-pointer items-center gap-1 rounded-lg border border-[#B08A3E] bg-white px-2.5 py-1 text-xs font-medium text-[#B08A3E] transition hover:bg-[#F3E9D2]"
                >
                  <Plus size={14} />
                  Add Option
                </button>
              </div>

              {errors.options && <p className="mt-2 text-xs text-red-500">{errors.options}</p>}
              {errors.correctOptionIndexes && (
                <p className="mt-2 text-xs text-red-500">{errors.correctOptionIndexes}</p>
              )}

              <div className="mt-3 space-y-2.5">
                {form.options.map((option, index) => {
                  const isCorrect = form.correctOptionIndexes.includes(index);
                  const isSingle = form.questionType === "single_choice";

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 rounded-xl border p-2.5 transition duration-150 ${
                        isCorrect
                          ? "border-[#B08A3E] bg-white shadow-[0_2px_10px_rgba(176,138,62,0.12)]"
                          : "border-[#E7DDCC] bg-white hover:border-[#D6C6AC]"
                      }`}
                    >
                      {/* Mark Correct Button / Icon */}
                      <button
                        type="button"
                        onClick={() =>
                          isSingle ? setSingleCorrectOption(index) : toggleMultiCorrectOption(index)
                        }
                        title={isCorrect ? "Marked as correct" : "Click to mark as correct answer"}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        {isSingle ? (
                          isCorrect ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} />
                        ) : (
                          isCorrect ? <CheckSquare size={16} className="text-emerald-600" /> : <Square size={16} />
                        )}
                        <span>{isCorrect ? "Correct" : "Mark"}</span>
                      </button>

                      {/* Option Input */}
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="h-9 flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-sm"
                      />

                      {/* Delete Option */}
                      {form.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="cursor-pointer p-1 text-gray-400 transition hover:text-red-500"
                          title="Remove option"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* True / False Selection */}
          {form.questionType === "true_false" && (
            <div className="rounded-2xl border border-[#E7DDCC] bg-[#FAF8F4] p-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-[#1C1A17]">
                Select Correct Boolean Answer
              </Label>
              <p className="text-[11px] text-[#8A8175]">Click which statement is the correct answer:</p>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateField("correctBooleanAnswer", true)}
                  className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border p-4 font-medium transition duration-200 hover:-translate-y-0.5 ${
                    form.correctBooleanAnswer === true
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-md ring-2 ring-emerald-500/20"
                      : "border-[#E7DDCC] bg-white text-[#8A8175] hover:border-emerald-300"
                  }`}
                >
                  <CheckCircle2 size={20} className={form.correctBooleanAnswer === true ? "text-emerald-600" : "text-gray-400"} />
                  <span>TRUE (Correct)</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateField("correctBooleanAnswer", false)}
                  className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-xl border p-4 font-medium transition duration-200 hover:-translate-y-0.5 ${
                    form.correctBooleanAnswer === false
                      ? "border-red-500 bg-red-50 text-red-800 shadow-md ring-2 ring-red-500/20"
                      : "border-[#E7DDCC] bg-white text-[#8A8175] hover:border-red-300"
                  }`}
                >
                  <XCircle size={20} className={form.correctBooleanAnswer === false ? "text-red-600" : "text-gray-400"} />
                  <span>FALSE (Correct)</span>
                </button>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#8A8175]">Answer Explanation</Label>
            <Textarea
              value={form.explanation}
              onChange={(e) => updateField("explanation", e.target.value)}
              className="mt-1.5 min-h-[70px] rounded-xl border-[#E7DDCC] text-sm focus-visible:ring-[#B08A3E]"
              placeholder="Explain why this is the correct answer"
            />
          </div>

          {/* Order */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#8A8175]">Display Order</Label>
            <Input
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => updateField("order", Number(e.target.value))}
              className="mt-1.5 h-10 w-32 rounded-xl border-[#E7DDCC] text-sm"
            />
            {errors.order && <p className="mt-1 text-xs text-red-500">{errors.order}</p>}
          </div>

          {errors.form && <p className="text-sm font-medium text-red-500">{errors.form}</p>}
        </div>

        <DialogFooter className="mt-6 flex items-center justify-end gap-3 border-t border-[#E7DDCC] pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="cursor-pointer rounded-xl border-[#E7DDCC] px-5 py-2 text-sm transition hover:bg-[#FAF8F4]"
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            onClick={submit}
            className="cursor-pointer rounded-xl bg-[#B08A3E] px-6 py-2 text-sm font-medium text-white shadow-md transition hover:bg-[#997734] hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Updating Question..." : "Update Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
