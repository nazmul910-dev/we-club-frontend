"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, ShieldCheck } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchQuizQuestions } from "@/lib/features/invictus/academy/quiz-question/quizQuestionSlice";
import {
  submitQuizAttempt,
  clearLastAttempt,
} from "@/lib/features/invictus/academy/quiz-attempt/quizAttemptSlice";
import {
  issueMyCertificate,
  fetchMyCertificates,
} from "@/lib/features/invictus/academy/cerfificate/certificateSlice";
import { fetchMyModuleProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import type { ISubmitQuizAnswer } from "@/lib/features/invictus/academy/quiz-attempt/quizAttemptTypes";

interface Props {
  moduleId: string;
  quizUnlocked: boolean;
  alreadyCertified: boolean;
}

export default function ChallengeQuizPanel({
  moduleId,
  quizUnlocked,
  alreadyCertified,
}: Props) {
  const dispatch = useAppDispatch();

  const questions = useAppSelector((state) => state.quizQuestion.questions);
  const questionsLoading = useAppSelector((state) => state.quizQuestion.loading);
  const submitting = useAppSelector((state) => state.quizAttempt.submitting);
  const lastAttempt = useAppSelector((state) => state.quizAttempt.lastAttempt);
  const certificateLoading = useAppSelector((state) => state.certificate.actionLoading);
  const myCertificates = useAppSelector((state) => state.certificate.myCertificates);

  const [answers, setAnswers] = useState<Record<string, ISubmitQuizAnswer>>({});

  useEffect(() => {
    if (quizUnlocked) {
      dispatch(fetchQuizQuestions({ moduleId, includeArchived: false }));
    }
  }, [dispatch, moduleId, quizUnlocked]);

  const selectSingleOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { questionId, selectedOptionIndexes: [optionIndex] },
    }));
  };

  const toggleMultiOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      const current = prev[questionId]?.selectedOptionIndexes ?? [];
      const next = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];
      return { ...prev, [questionId]: { questionId, selectedOptionIndexes: next } };
    });
  };

  const selectBoolean = (questionId: string, value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { questionId, booleanAnswer: value },
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer every question before submitting");
      return;
    }

    try {
      const res = await dispatch(
        submitQuizAttempt({
          moduleId,
          data: { answers: Object.values(answers) },
        }),
      ).unwrap();

      if (res.attempt.passed) {
        toast.success(`Congratulations! You passed with ${res.attempt.score}%!`);
      } else {
        toast.error(`Score: ${res.attempt.score}%. You need at least 70% to pass.`);
      }

      // Sync progress & certificates
      dispatch(fetchMyModuleProgress(moduleId));
      dispatch(fetchMyCertificates());
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to submit quiz attempt";
      toast.error(msg);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    dispatch(clearLastAttempt());
  };

  const handleIssueCertificate = async () => {
    try {
      await dispatch(issueMyCertificate(moduleId)).unwrap();
      toast.success("Certificate issued successfully! You can view it in your profile.");
      dispatch(fetchMyCertificates());
      dispatch(fetchMyModuleProgress(moduleId));
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to issue certificate";
      toast.error(msg);
    }
  };

  const thisModuleCertificate = myCertificates.find(
    (cert) => cert.module?._id === moduleId && cert.status === "issued",
  );

  if (!quizUnlocked) {
    return (
      <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6 text-sm text-[#8A8175] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B18A3A]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-[#171717]">Quiz Locked</h4>
            <p className="mt-0.5 text-xs text-[#8A8175]">
              Finish all required videos, resources, and 80% of module actions above to unlock this assessment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (lastAttempt) {
    return (
      <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              lastAttempt.passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
            }`}
          >
            {lastAttempt.passed ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#171717]">
              {lastAttempt.passed ? "Assessment Passed!" : "Assessment Not Passed"}
            </h3>
            <p className="text-sm text-[#8A8175]">
              Score: <span className="font-semibold text-[#171717]">{lastAttempt.score}%</span> ·{" "}
              {lastAttempt.correctAnswers} of {lastAttempt.totalQuestions} questions correct
            </p>
          </div>
        </div>

        {lastAttempt.passed && !alreadyCertified && !thisModuleCertificate && (
          <div className="mt-6 border-t border-[#E8DDCA] pt-5">
            <button
              onClick={handleIssueCertificate}
              disabled={certificateLoading}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#B18A3A] px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#997734] hover:shadow-lg disabled:opacity-60"
            >
              <Award size={18} />
              {certificateLoading ? "Issuing Certificate..." : "Claim Your Certificate"}
            </button>
          </div>
        )}

        {(alreadyCertified || thisModuleCertificate) && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Award size={18} className="text-emerald-600" />
              <span>Official certificate issued for this module</span>
            </div>
            {thisModuleCertificate?.certificateNumber && (
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-900">
                {thisModuleCertificate.certificateNumber}
              </span>
            )}
          </div>
        )}

        {!lastAttempt.passed && (
          <div className="mt-6 border-t border-[#E8DDCA] pt-5">
            <p className="mb-3 text-xs text-[#8A8175]">
              Review the module lessons and resources, then try the assessment again.
            </p>
            <button
              onClick={handleRetake}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#B18A3A] bg-white px-5 py-2.5 text-sm font-semibold text-[#B18A3A] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F3E9D2]"
            >
              <RotateCcw size={16} />
              Retake Assessment
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E8DDCA] pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#171717]">Module Assessment Quiz</h3>
          <p className="text-xs text-[#8A8175]">
            Score at least 70% to pass and earn your Invictus certificate.
          </p>
        </div>
        <span className="rounded-full bg-[#F3E9D2] px-3 py-1 text-xs font-semibold text-[#B18A3A]">
          {questions.length} Questions
        </span>
      </div>

      {questionsLoading ? (
        <div className="py-8 text-center text-sm text-[#8A8175]">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#8A8175]">
          No published quiz questions available for this module yet.
        </div>
      ) : (
        questions.map((question, index) => {
          const isAnswered =
            answers[question._id]?.selectedOptionIndexes !== undefined ||
            answers[question._id]?.booleanAnswer !== undefined;

          return (
            <div
              key={question._id}
              className={`rounded-2xl border p-5 transition duration-150 ${
                isAnswered ? "border-[#B18A3A]/40 bg-[#FAF8F4]" : "border-[#E8DDCA] bg-white"
              }`}
            >
              <p className="text-sm font-semibold text-[#171717]">
                <span className="text-[#B18A3A]">{index + 1}.</span> {question.question}
              </p>

              {question.questionType === "true_false" ? (
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => selectBoolean(question._id, true)}
                    className={`flex-1 cursor-pointer rounded-xl border py-2.5 text-center text-sm font-medium transition ${
                      answers[question._id]?.booleanAnswer === true
                        ? "border-[#B18A3A] bg-[#F3E9D2] text-[#B18A3A] shadow-sm ring-1 ring-[#B18A3A]"
                        : "border-[#E8DDCA] bg-white text-[#171717] hover:border-[#B18A3A]/60"
                    }`}
                  >
                    True
                  </button>
                  <button
                    type="button"
                    onClick={() => selectBoolean(question._id, false)}
                    className={`flex-1 cursor-pointer rounded-xl border py-2.5 text-center text-sm font-medium transition ${
                      answers[question._id]?.booleanAnswer === false
                        ? "border-[#B18A3A] bg-[#F3E9D2] text-[#B18A3A] shadow-sm ring-1 ring-[#B18A3A]"
                        : "border-[#E8DDCA] bg-white text-[#171717] hover:border-[#B18A3A]/60"
                    }`}
                  >
                    False
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {question.options?.map((option, optionIndex) => {
                    const isMulti = question.questionType === "multiple_choice";
                    const isSelected =
                      answers[question._id]?.selectedOptionIndexes?.includes(optionIndex) ?? false;

                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        onClick={() =>
                          isMulti
                            ? toggleMultiOption(question._id, optionIndex)
                            : selectSingleOption(question._id, optionIndex)
                        }
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition duration-150 ${
                          isSelected
                            ? "border-[#B18A3A] bg-[#F3E9D2] font-medium text-[#171717] shadow-sm"
                            : "border-[#E8DDCA] bg-white text-[#171717] hover:border-[#B18A3A]/60 hover:bg-[#FAF8F4]"
                        }`}
                      >
                        <span>{option}</span>
                        <div
                          className={`h-4 w-4 rounded-full border transition ${
                            isSelected
                              ? "border-[#B18A3A] bg-[#B18A3A]"
                              : "border-[#E8DDCA] bg-white"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}

      {questions.length > 0 && (
        <div className="flex items-center justify-between border-t border-[#E8DDCA] pt-4">
          <p className="text-xs text-[#8A8175]">
            {Object.keys(answers).length} of {questions.length} answered
          </p>
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < questions.length}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#B18A3A] px-7 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#997734] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>{submitting ? "Submitting..." : "Submit Answers"}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}