"use client";

import { useEffect, useState } from "react";
import { Award, CheckCircle2, XCircle } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchQuizQuestions } from "@/lib/features/invictus/academy/quiz-question/quizQuestionSlice";
import { submitQuizAttempt } from "@/lib/features/invictus/academy/quiz-attempt/quizAttemptSlice";
import { issueMyCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateSlice";
import type { ISubmitQuizAnswer } from "@/lib/features/invictus/academy/quiz-attempt/quizAttemptTypes";

interface Props {
  moduleId: string;
  quizUnlocked: boolean;
  alreadyCertified: boolean;
}

export default function ChallengeQuizPanel({ moduleId, quizUnlocked, alreadyCertified }: Props) {
  const dispatch = useAppDispatch();

  const questions = useAppSelector((state) => state.quizQuestion.questions);
  const submitting = useAppSelector((state) => state.quizAttempt.submitting);
  const lastAttempt = useAppSelector((state) => state.quizAttempt.lastAttempt);
  const certificateLoading = useAppSelector((state) => state.certificate.actionLoading);

  const [answers, setAnswers] = useState<Record<string, ISubmitQuizAnswer>>({});

  useEffect(() => {
    if (quizUnlocked) {
      dispatch(fetchQuizQuestions({ moduleId, includeArchived: false }));
    }
  }, [dispatch, moduleId, quizUnlocked]);

  const selectSingleOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { questionId, selectedOptionIndexes: [optionIndex] } }));
  };

  const toggleMultiOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      const current = prev[questionId]?.selectedOptionIndexes ?? [];
      const next = current.includes(optionIndex) ? current.filter((i) => i !== optionIndex) : [...current, optionIndex];
      return { ...prev, [questionId]: { questionId, selectedOptionIndexes: next } };
    });
  };

  const selectBoolean = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { questionId, booleanAnswer: value } }));
  };

  const handleSubmit = () => {
    dispatch(submitQuizAttempt({ moduleId, data: { answers: Object.values(answers) } }));
  };

  const handleIssueCertificate = () => {
    dispatch(issueMyCertificate(moduleId));
  };

  if (!quizUnlocked) {
    return (
      <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6 text-sm text-[#8A8175]">
        Finish the required videos, resources and actions above to unlock this module's quiz.
      </div>
    );
  }

  if (lastAttempt) {
    return (
      <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6">
        <div className="flex items-center gap-3">
          {lastAttempt.passed ? <CheckCircle2 className="text-emerald-500" size={28} /> : <XCircle className="text-red-500" size={28} />}
          <div>
            <h3 className="text-lg font-semibold text-[#171717]">{lastAttempt.passed ? "Quiz Passed" : "Quiz Not Passed"}</h3>
            <p className="text-sm text-[#8A8175]">Score {lastAttempt.score}% · {lastAttempt.correctAnswers}/{lastAttempt.totalQuestions} correct</p>
          </div>
        </div>

        {lastAttempt.passed && !alreadyCertified && (
          <button onClick={handleIssueCertificate} disabled={certificateLoading} className="mt-5 flex items-center gap-2 rounded-xl bg-[#B18A3A] px-5 py-3 text-sm font-medium text-white disabled:opacity-60">
            <Award size={16} />
            {certificateLoading ? "Issuing Certificate..." : "Claim Certificate"}
          </button>
        )}

        {lastAttempt.passed && alreadyCertified && (
          <p className="mt-5 flex items-center gap-2 text-sm text-emerald-600">
            <Award size={16} /> Certificate already issued for this module
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-3xl border border-[#E8DDCA] bg-white p-6">
      <h3 className="text-lg font-semibold text-[#171717]">Module Quiz</h3>

      {questions.map((question, index) => (
        <div key={question._id} className="rounded-2xl border border-[#E8DDCA] p-4">
          <p className="text-sm font-medium text-[#171717]">{index + 1}. {question.question}</p>

          {question.questionType === "true_false" ? (
            <div className="mt-3 flex gap-3">
              <button onClick={() => selectBoolean(question._id, true)} className={`rounded-xl border px-4 py-2 text-sm ${answers[question._id]?.booleanAnswer === true ? "border-[#B18A3A] bg-[#F3E9D2]" : "border-[#E8DDCA]"}`}>True</button>
              <button onClick={() => selectBoolean(question._id, false)} className={`rounded-xl border px-4 py-2 text-sm ${answers[question._id]?.booleanAnswer === false ? "border-[#B18A3A] bg-[#F3E9D2]" : "border-[#E8DDCA]"}`}>False</button>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {question.options?.map((option, optionIndex) => {
                const isMulti = question.questionType === "multiple_choice";
                const isSelected = answers[question._id]?.selectedOptionIndexes?.includes(optionIndex) ?? false;
                return (
                  <button key={optionIndex} onClick={() => (isMulti ? toggleMultiOption(question._id, optionIndex) : selectSingleOption(question._id, optionIndex))} className={`block w-full rounded-xl border px-4 py-2 text-left text-sm ${isSelected ? "border-[#B18A3A] bg-[#F3E9D2]" : "border-[#E8DDCA]"}`}>
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <button onClick={handleSubmit} disabled={submitting || Object.keys(answers).length < questions.length} className="rounded-xl bg-[#B18A3A] px-6 py-3 text-sm font-medium text-white disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit Quiz"}
      </button>
    </div>
  );
}