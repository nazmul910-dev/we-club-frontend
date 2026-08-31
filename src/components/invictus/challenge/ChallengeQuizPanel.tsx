"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Trophy,
  PartyPopper,
  Sparkles,
} from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  moduleId: string;
  /** The pillar this module belongs to — used for pillar-level certificate. */
  pillarId: string;
  /** Human-readable pillar name (e.g. "LIMITLESS") for display. */
  pillarName?: string;
  quizUnlocked: boolean;
  /** True when the user already holds a valid (issued) certificate for this pillar. */
  alreadyCertified: boolean;
  /** True when the user has already passed the quiz for this specific module. */
  moduleQuizPassed?: boolean;
  /** Best score achieved in this module quiz. */
  moduleScore?: number;
  /** True when EVERY published module in this pillar has been quiz-passed. */
  allModulesPassed?: boolean;
  /** Total number of published modules in this pillar. */
  pillarTotalModules?: number;
  /** Number of pillar modules the user has already passed quiz for. */
  pillarPassedModules?: number;
}

export default function ChallengeQuizPanel({
  moduleId,
  pillarId,
  pillarName,
  quizUnlocked,
  alreadyCertified,
  moduleQuizPassed,
  moduleScore,
  allModulesPassed = false,
  pillarTotalModules = 0,
  pillarPassedModules = 0,
}: Props) {
  const dispatch = useAppDispatch();

  const questions = useAppSelector((state) => state.quizQuestion.questions);
  const questionsLoading = useAppSelector((state) => state.quizQuestion.loading);
  const submitting = useAppSelector((state) => state.quizAttempt.submitting);
  const lastAttempt = useAppSelector((state) => state.quizAttempt.lastAttempt);
  const certificateLoading = useAppSelector(
    (state) => state.certificate.actionLoading,
  );
  const myCertificates = useAppSelector(
    (state) => state.certificate.myCertificates,
  );
  const myProgress = useAppSelector((state) => state.progress.myProgress);

  const [answers, setAnswers] = useState<Record<string, ISubmitQuizAnswer>>({});

  // Resolve current module's progress from redux if not passed directly
  const currentProgress = myProgress.find(
    (item) =>
      (typeof item.module === "string" ? item.module : item.module?._id) ===
      moduleId,
  );

  // Reset answers and last attempt when moduleId changes
  useEffect(() => {
    setAnswers({});
    dispatch(clearLastAttempt());
  }, [dispatch, moduleId]);

  const isModulePassed =
    moduleQuizPassed ||
    currentProgress?.quizSummary?.passed ||
    (lastAttempt?.passed && true) ||
    false;

  const scoreAchieved =
    lastAttempt?.score ??
    moduleScore ??
    currentProgress?.quizSummary?.bestScore ??
    0;

  useEffect(() => {
    if (quizUnlocked && !isModulePassed && moduleId) {
      dispatch(fetchQuizQuestions({ moduleId, includeArchived: false }));
    }
  }, [dispatch, moduleId, quizUnlocked, isModulePassed]);

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
      return {
        ...prev,
        [questionId]: { questionId, selectedOptionIndexes: next },
      };
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
        toast.success(
          `🎉 Congratulations! You passed with ${res.attempt.score}%!`,
        );
      } else {
        toast.error(
          `Score: ${res.attempt.score}%. You need at least 70% to pass.`,
        );
      }

      dispatch(fetchMyModuleProgress(moduleId));
      dispatch(fetchMyCertificates());
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit quiz attempt";
      toast.error(msg);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    dispatch(clearLastAttempt());
  };

  /** Claim the pillar-level certificate */
  const handleIssueCertificate = async () => {
    if (!pillarId) {
      toast.error("Pillar ID not found");
      return;
    }
    try {
      await dispatch(issueMyCertificate(pillarId)).unwrap();
      toast.success(
        "🎉 Pillar certificate issued! You can view and print it in your profile.",
      );
      dispatch(fetchMyCertificates());
      dispatch(fetchMyModuleProgress(moduleId));
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to issue certificate. Ensure you have passed all module quizzes in this pillar.";
      toast.error(msg);
    }
  };

  /** Certificate for THIS pillar (issued & valid) */
  const thisPillarCertificate = pillarId
    ? myCertificates.find(
        (cert) =>
          (typeof cert.pillar === "string"
            ? cert.pillar
            : cert.pillar?._id) === pillarId && cert.status === "issued",
      )
    : undefined;

  /* ─── 1. Quiz Locked ─── */
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
              Finish all required videos, resources, and 80% of module actions
              above to unlock this assessment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── 2. Pillar Certificate Already Claimed / Issued ─── */
  if (Boolean(pillarId) && (alreadyCertified || thisPillarCertificate)) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner ring-4 ring-emerald-200/60">
            <Trophy size={38} />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <PartyPopper size={20} className="text-emerald-500" />
              <h3 className="text-2xl font-extrabold tracking-tight text-emerald-800">
                You Have Passed!
              </h3>
              <PartyPopper size={20} className="text-emerald-500" />
            </div>
            {pillarName && (
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-emerald-600">
                {pillarName} Pillar Certificate
              </p>
            )}
            <p className="mt-2 text-sm text-emerald-700">
              You have successfully completed all modules in this pillar and
              earned your official Invictus Certificate.
            </p>
          </div>

          {thisPillarCertificate?.certificateNumber && (
            <div className="mt-1 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 shadow-sm">
              <Award size={16} className="text-emerald-600" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-900">
                {thisPillarCertificate.certificateNumber}
              </span>
            </div>
          )}

          <p className="mt-1 text-xs font-medium text-emerald-600">
            View, download, or print your certificate anytime in your Profile.
          </p>
        </div>
      </div>
    );
  }

  /* ─── 3. Last Attempt Failed (Just Submitted) ─── */
  if (lastAttempt && !lastAttempt.passed) {
    return (
      <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <XCircle size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#171717]">
              Quiz Not Passed
            </h3>
            <p className="text-sm text-[#8A8175]">
              Score:{" "}
              <span className="font-semibold text-red-600">
                {lastAttempt.score}%
              </span>{" "}
              · {lastAttempt.correctAnswers} of {lastAttempt.totalQuestions}{" "}
              questions correct (70% required to pass)
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-[#E8DDCA] pt-5">
          <p className="mb-3 text-xs text-[#8A8175]">
            Review the module lessons and downloadable resources, then try again.
          </p>
          <button
            onClick={handleRetake}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#B18A3A] bg-white px-5 py-2.5 text-sm font-semibold text-[#B18A3A] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F3E9D2]"
          >
            <RotateCcw size={16} />
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  /* ─── 4. Module Quiz Already Passed (Previously or Just Submitted) ─── */
  if (isModulePassed) {
    const remainingModules = pillarTotalModules - pillarPassedModules;

    return (
      <div className="rounded-3xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-[#171717]">
                You Have Passed!
              </h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                Passed ({scoreAchieved}%)
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#8A8175]">
              You have successfully completed and passed the assessment for this
              module.
            </p>
          </div>
        </div>

        {/* Pillar Certificate Claim Banner */}
        <div className="mt-6 rounded-2xl border border-[#B18A3A]/30 bg-[#FAF8F2] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B18A3A]">
              <Sparkles size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#171717]">
                {pillarName
                  ? `${pillarName} Pillar Certificate`
                  : "Pillar Certificate"}
              </p>

              {allModulesPassed ? (
                /* ✅ All modules done — ready to claim */
                <p className="mt-0.5 text-xs text-[#8A8175]">
                  🎉 You have passed all{" "}
                  {pillarTotalModules > 0 ? `${pillarTotalModules} ` : ""}
                  modules in{" "}
                  {pillarName ? (
                    <span className="font-semibold text-[#B18A3A]">{pillarName}</span>
                  ) : (
                    "this pillar"
                  )}
                  ! Claim your official Invictus Certificate now.
                </p>
              ) : (
                /* ⏳ Some modules still remaining */
                <p className="mt-0.5 text-xs text-[#8A8175]">
                  <span className="font-semibold text-[#B18A3A]">
                    {pillarPassedModules} of {pillarTotalModules}
                  </span>{" "}
                  module{pillarTotalModules !== 1 ? "s" : ""} passed.{" "}
                  Complete the remaining{" "}
                  <span className="font-semibold text-[#B18A3A]">
                    {remainingModules} module{remainingModules !== 1 ? "s" : ""}
                  </span>{" "}
                  in{" "}
                  {pillarName ? (
                    <span className="font-semibold text-[#B18A3A]">{pillarName}</span>
                  ) : (
                    "this pillar"
                  )}{" "}
                  to unlock your certificate.
                </p>
              )}
            </div>
          </div>

          {allModulesPassed && (
            <button
              onClick={handleIssueCertificate}
              disabled={certificateLoading}
              className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl bg-[#B18A3A] px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#997734] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Award size={18} />
              {certificateLoading
                ? "Checking eligibility & issuing..."
                : `Claim ${pillarName ?? "Pillar"} Certificate`}
            </button>
          )}

          {!allModulesPassed && pillarTotalModules > 0 && (
            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: pillarTotalModules }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < pillarPassedModules
                      ? "bg-emerald-500"
                      : "bg-[#E8DDCA]"
                  }`}
                />
              ))}
              <span className="ml-1 shrink-0 text-[11px] font-semibold text-[#8A8175]">
                {pillarPassedModules}/{pillarTotalModules}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── 5. Quiz Questions (Active Assessment) ─── */
  return (
    <div className="space-y-6 rounded-3xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E8DDCA] pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#171717]">
            Module Assessment Quiz
          </h3>
          <p className="text-xs text-[#8A8175]">
            Score at least 70% to pass and earn your Invictus certificate.
          </p>
        </div>
        {questionsLoading ? (
          <Skeleton className="h-6 w-24 rounded-full" />
        ) : (
          <span className="rounded-full bg-[#F3E9D2] px-3 py-1 text-xs font-semibold text-[#B18A3A]">
            {questions.length} Questions
          </span>
        )}
      </div>

      {/* Skeleton while loading */}
      {questionsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E8DDCA] bg-white p-5 space-y-3"
            >
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3.5 w-1/2 rounded-md" />
              <div className="mt-3 space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center justify-between rounded-xl border border-[#E8DDCA] px-4 py-3"
                  >
                    <Skeleton className="h-3.5 w-40 rounded" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-[#E8DDCA] pt-4">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#8A8175]">
          No published quiz questions available for this module yet.
        </div>
      ) : (
        <>
          {questions.map((question, index) => {
            const isAnswered =
              answers[question._id]?.selectedOptionIndexes !== undefined ||
              answers[question._id]?.booleanAnswer !== undefined;

            return (
              <div
                key={question._id}
                className={`rounded-2xl border p-5 transition duration-150 ${
                  isAnswered
                    ? "border-[#B18A3A]/40 bg-[#FAF8F4]"
                    : "border-[#E8DDCA] bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-[#171717]">
                  <span className="text-[#B18A3A]">{index + 1}.</span>{" "}
                  {question.question}
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
                      const isMulti =
                        question.questionType === "multiple_choice";
                      const isSelected =
                        answers[question._id]?.selectedOptionIndexes?.includes(
                          optionIndex,
                        ) ?? false;

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
          })}

          <div className="flex items-center justify-between border-t border-[#E8DDCA] pt-4">
            <p className="text-xs text-[#8A8175]">
              {Object.keys(answers).length} of {questions.length} answered
            </p>
            <button
              onClick={handleSubmit}
              disabled={
                submitting || Object.keys(answers).length < questions.length
              }
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#B18A3A] px-7 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#997734] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>{submitting ? "Submitting..." : "Submit Answers"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}