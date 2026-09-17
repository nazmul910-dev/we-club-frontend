"use client";

import { useEffect, useState, useMemo } from "react";
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
  fetchMyModuleAttempts,
} from "@/lib/features/invictus/academy/quiz-attempt/quizAttemptSlice";
import {
  issueMyCertificate,
  fetchMyCertificates,
} from "@/lib/features/invictus/academy/cerfificate/certificateSlice";
import {
  fetchMyModuleProgress,
  fetchMyAllProgress,
} from "@/lib/features/invictus/academy/progress/progressSlice";
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
  const questionsLoading = useAppSelector(
    (state) => state.quizQuestion.loading,
  );
  const submitting = useAppSelector((state) => state.quizAttempt.submitting);
  const lastAttempt = useAppSelector((state) => state.quizAttempt.lastAttempt);
  const certificateLoading = useAppSelector(
    (state) => state.certificate.actionLoading,
  );
  const myCertificates = useAppSelector(
    (state) => state.certificate.myCertificates,
  );
  const myProgress = useAppSelector((state) => state.progress.myProgress);
  const moduleAttempts = useAppSelector(
    (state) => state.quizAttempt.attemptsByModuleId[moduleId] ?? [],
  );

  const [answers, setAnswers] = useState<Record<string, ISubmitQuizAnswer>>({});

  // Resolve current module's progress from redux if not passed directly
  const currentProgress = myProgress.find(
    (item) =>
      (typeof item.module === "string" ? item.module : item.module?._id) ===
      moduleId,
  );

  // Fetch attempts on mount and reset answers/lastAttempt when moduleId changes
  useEffect(() => {
    setAnswers({});
    dispatch(clearLastAttempt());
    if (moduleId) {
      dispatch(fetchMyModuleAttempts(moduleId));
    }
  }, [dispatch, moduleId]);

  const attemptPassed = moduleAttempts.some((a) => a.passed);
  const bestAttemptScore = moduleAttempts.reduce(
    (max, a) => Math.max(max, a.score ?? 0),
    0,
  );

  // "passed" according to the SERVER (version-aware).
  // Do NOT include old `attemptPassed` here — the server already checks
  // whether the pass is still valid given any newly-added questions.
  const isModulePassed =
    moduleQuizPassed ||
    (lastAttempt?.passed && true) ||
    false;

  // Map of questions already answered correctly in any previous passed attempt
  const previouslyPassedQuestionsMap = useMemo(() => {
    const map = new Map<string, any>();
    for (const attempt of moduleAttempts) {
      if (attempt.passed) {
        for (const ans of attempt.answers ?? []) {
          if (ans.isCorrect) {
            const qId =
              typeof ans.question === "object" && ans.question
                ? String((ans.question as any)._id ?? ans.question)
                : String(ans.question);
            if (qId) {
              map.set(qId, ans);
            }
          }
        }
      }
    }
    return map;
  }, [moduleAttempts]);

  // Questions in this module that still require an answer
  const pendingQuestions = useMemo(() => {
    return questions.filter((q) => !previouslyPassedQuestionsMap.has(q._id));
  }, [questions, previouslyPassedQuestionsMap]);

  // Whether the module has any pending questions that must be answered
  const hasNewQuestions = pendingQuestions.length > 0;

  const scoreAchieved =
    lastAttempt?.score ??
    (bestAttemptScore > 0 ? bestAttemptScore : undefined) ??
    moduleScore ??
    currentProgress?.quizSummary?.bestScore ??
    0;

  const attemptsUsed =
    Math.max(
      currentProgress?.quizSummary?.attemptsUsed ?? 0,
      moduleAttempts.length,
    );
  const maximumAttempts = currentProgress?.quizSummary?.maximumAttempts ?? 2;
  const attemptsExhausted =
    maximumAttempts > 0 && attemptsUsed >= maximumAttempts;

  // Always fetch questions when quiz is unlocked. The server automatically returns
  // an empty array [] if the user already passed the current questions version.
  useEffect(() => {
    if (quizUnlocked && moduleId) {
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
    if (attemptsExhausted) {
      toast.error(
        `Maximum ${maximumAttempts} quiz attempts have already been used.`,
      );
      return;
    }

    const pendingAnswered = pendingQuestions.every(
      (q) =>
        answers[q._id]?.selectedOptionIndexes !== undefined ||
        answers[q._id]?.booleanAnswer !== undefined,
    );

    if (!pendingAnswered) {
      toast.error("Please answer all new questions before submitting");
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
        dispatch(fetchQuizQuestions({ moduleId, includeArchived: false }));
        dispatch(fetchMyModuleAttempts(moduleId));
        dispatch(fetchMyAllProgress());
      } else {
        toast.error(
          `Score: ${res.attempt.score}%. You need at least 70% to pass.`,
        );
      }

      dispatch(fetchMyModuleProgress(moduleId));
      dispatch(fetchMyCertificates());
    } catch (error: unknown) {
      const msg =
        typeof error === "string"
          ? error
          : error instanceof Error
            ? error.message
            : "Failed to submit quiz attempt";

      if (msg.toLowerCase().includes("already been passed")) {
        toast.success("This quiz has already been passed!");
        dispatch(fetchMyModuleAttempts(moduleId));
        dispatch(fetchMyModuleProgress(moduleId));
        return;
      }

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
    } catch (error: unknown) {
      const responseError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        responseError.response?.data?.message ||
        responseError.message ||
        "Failed to issue certificate. Complete the latest videos and quizzes in every module first.";
      toast.error(msg);
    }
  };

  /** Certificate for THIS pillar (issued & valid) */
  const thisPillarCertificate = pillarId
    ? myCertificates.find(
        (cert) =>
          (typeof cert.pillar === "string" ? cert.pillar : cert.pillar?._id) ===
            pillarId && cert.status === "issued",
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
  if (
    Boolean(pillarId) &&
    (alreadyCertified || thisPillarCertificate) &&
    !hasNewQuestions &&
    !questionsLoading
  ) {
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
            Review the module lessons and downloadable resources, then try
            again.
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
  // Show "passed" UI when:
  //   a) Server confirmed passed (version-aware) AND no new questions pending, OR
  //   b) User has a prior passing attempt AND loading is done AND server returned
  //      no new questions (empty array means their pass is still valid).
  // If hasNewQuestions is true, new questions exist — fall through to quiz form.
  const serverConfirmedPassed =
    isModulePassed && !hasNewQuestions && !questionsLoading;
  const priorPassNoNewQuestions =
    attemptPassed && !questionsLoading && !hasNewQuestions;

  if (serverConfirmedPassed || priorPassNoNewQuestions) {
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
                    <span className="font-semibold text-[#B18A3A]">
                      {pillarName}
                    </span>
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
                  module{pillarTotalModules !== 1 ? "s" : ""} passed. Complete
                  the remaining{" "}
                  <span className="font-semibold text-[#B18A3A]">
                    {remainingModules} module{remainingModules !== 1 ? "s" : ""}
                  </span>{" "}
                  in{" "}
                  {pillarName ? (
                    <span className="font-semibold text-[#B18A3A]">
                      {pillarName}
                    </span>
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
                    i < pillarPassedModules ? "bg-emerald-500" : "bg-[#E8DDCA]"
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
            const isPassedPreviously =
              previouslyPassedQuestionsMap.has(question._id);
            const prevAns = previouslyPassedQuestionsMap.get(question._id);

            const isAnswered =
              isPassedPreviously ||
              answers[question._id]?.selectedOptionIndexes !== undefined ||
              answers[question._id]?.booleanAnswer !== undefined;

            return (
              <div
                key={question._id}
                className={`rounded-2xl border p-5 transition duration-150 ${
                  isPassedPreviously
                    ? "border-emerald-200 bg-emerald-50/30"
                    : isAnswered
                      ? "border-[#B18A3A]/40 bg-[#FAF8F4]"
                      : "border-[#E8DDCA] bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">
                      <span
                        className={
                          isPassedPreviously
                            ? "text-emerald-700"
                            : "text-[#B18A3A]"
                        }
                      >
                        {index + 1}.
                      </span>{" "}
                      {question.question}
                    </p>
                    {isPassedPreviously ? (
                      <p className="mt-1 text-xs font-medium text-emerald-700">
                        ✓ You have already answered this question correctly. No
                        further action needed.
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-[#8A8175]">
                        Please choose your answer below to complete this module.
                      </p>
                    )}
                  </div>
                  {isPassedPreviously ? (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      Passed
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                      <Sparkles size={13} className="text-amber-600" />
                      New Question
                    </span>
                  )}
                </div>

                {question.questionType === "true_false" ? (
                  <div className="mt-4 flex gap-3">
                    {isPassedPreviously ? (
                      <>
                        <div
                          className={`flex-1 rounded-xl border py-2.5 text-center text-sm font-semibold ${
                            prevAns?.booleanAnswer === true
                              ? "border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400"
                              : "border-slate-200 bg-slate-50 text-slate-400 opacity-60"
                          }`}
                        >
                          True {prevAns?.booleanAnswer === true && "✓"}
                        </div>
                        <div
                          className={`flex-1 rounded-xl border py-2.5 text-center text-sm font-semibold ${
                            prevAns?.booleanAnswer === false
                              ? "border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400"
                              : "border-slate-200 bg-slate-50 text-slate-400 opacity-60"
                          }`}
                        >
                          False {prevAns?.booleanAnswer === false && "✓"}
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    {question.options?.map((option, optionIndex) => {
                      if (isPassedPreviously) {
                        const wasSelected =
                          prevAns?.selectedOptionIndexes?.includes(
                            optionIndex,
                          ) ?? false;
                        return (
                          <div
                            key={optionIndex}
                            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
                              wasSelected
                                ? "border-emerald-500 bg-emerald-100/90 font-medium text-emerald-950 ring-1 ring-emerald-400"
                                : "border-slate-200 bg-slate-50/70 text-slate-400 opacity-60"
                            }`}
                          >
                            <span>{option}</span>
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                                wasSelected
                                  ? "border-emerald-600 bg-emerald-600 font-bold text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {wasSelected && "✓"}
                            </div>
                          </div>
                        );
                      }

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
              {previouslyPassedQuestionsMap.size > 0 ? (
                <>
                  <span className="font-semibold text-emerald-700">
                    {previouslyPassedQuestionsMap.size} passed previously
                  </span>
                  {" · "}
                  <span className="font-semibold text-[#B18A3A]">
                    {
                      pendingQuestions.filter(
                        (q) =>
                          answers[q._id]?.selectedOptionIndexes !== undefined ||
                          answers[q._id]?.booleanAnswer !== undefined,
                      ).length
                    }{" "}
                    of {pendingQuestions.length} new answered
                  </span>
                </>
              ) : (
                `${Object.keys(answers).length} of ${questions.length} answered`
              )}
            </p>
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                pendingQuestions.some(
                  (q) =>
                    answers[q._id]?.selectedOptionIndexes === undefined &&
                    answers[q._id]?.booleanAnswer === undefined,
                )
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
