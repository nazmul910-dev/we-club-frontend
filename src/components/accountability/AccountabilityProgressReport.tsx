"use client";

import { useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import ProgressBar from "@/components/accountability/ProgressBar";
import StatusDot from "@/components/accountability/statusDot";
import SectionCard from "@/components/common/SectionCard";
import SectionHeader from "@/components/common/SectionHeader";
import { fetchMyAllVideoProgress } from "@/lib/features/invictus/videoProgress/videoProgressSlice";
import { fetchMyAllProgress } from "@/lib/features/invictus/academy/progress/progressSlice";
import { fetchMyCertificates } from "@/lib/features/invictus/academy/cerfificate/certificateSlice";
import type { IModuleProgress } from "@/lib/features/invictus/academy/progress/progressTypes";
import type { IVideoProgress } from "@/lib/features/invictus/videoProgress/videoProgressTypes";
import type { IQuizCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateTypes";

export default function AccountabilityProgressReport() {
  const dispatch = useAppDispatch();
  const moduleProgress = useAppSelector((state) => state.progress.myProgress);
  const videoHistory = useAppSelector((state) => state.videoProgress.myHistory);
  const certificates = useAppSelector(
    (state) => state.certificate.myCertificates,
  );
  const watchedVideoHistory = useMemo(
    () =>
      videoHistory.filter(
        (item) =>
          item.totalWatchedSeconds > 0 ||
          item.watchPercent > 0 ||
          item.isCompleted,
      ),
    [videoHistory],
  );

  useEffect(() => {
    dispatch(fetchMyAllProgress());
    dispatch(fetchMyAllVideoProgress());
    dispatch(fetchMyCertificates());
  }, [dispatch]);

  const progressPillars = useMemo(() => {
    const grouped = new Map<string, IModuleProgress[]>();
    moduleProgress.forEach((record) => {
      const name = record.module.pillar?.name ?? "General Track";
      grouped.set(name, [...(grouped.get(name) ?? []), record]);
    });

    return [...grouped.entries()].map(([name, records]) => ({
      name: `${name} Pillar`,
      active: records.some(
        (record) => record.quizUnlocked || record.overallCompletionPercent > 0,
      ),
      progress: Math.round(
        records.reduce(
          (sum, record) => sum + record.overallCompletionPercent,
          0,
        ) / Math.max(records.length, 1),
      ),
      modules: records.map((record) => {
        const watchedVideos = watchedVideoHistory.filter(
          (item) => item.module?._id === record.module._id,
        );
        const completedVideos = watchedVideos.filter(
          (item) => item.isCompleted,
        ).length;
        const status = record.isCompleted
          ? "Complete"
          : record.quizUnlocked
            ? "Available"
            : record.overallCompletionPercent > 0
              ? "In progress"
              : "Locked";

        return {
          label: record.module.title,
          status,
          meta: `${watchedVideos.length} watched · ${completedVideos} completed · ${record.overallCompletionPercent}% module progress`,
        };
      }),
    }));
  }, [moduleProgress, watchedVideoHistory]);

  const overallProgress = useMemo(() => {
    if (!moduleProgress.length) return 0;
    return Math.round(
      moduleProgress.reduce(
        (sum, record) => sum + record.overallCompletionPercent,
        0,
      ) / moduleProgress.length,
    );
  }, [moduleProgress]);

  const handleDownloadProgressReport = () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const userName = moduleProgress[0]?.user?.fullName ?? "Invictus Member";
    type PdfColor = readonly [number, number, number];
    const gold: PdfColor = [186, 148, 61];
    const ink: PdfColor = [28, 26, 22];
    const muted: PdfColor = [111, 103, 90];
    const green: PdfColor = [0, 184, 128];
    const pageMargin = 14;
    const contentWidth = pageWidth - pageMargin * 2;
    let y = 0;

    const addPage = () => {
      pdf.addPage();
      y = 18;
    };

    const ensureSpace = (height: number) => {
      if (y + height > pageHeight - 14) addPage();
    };

    const text = (
      value: string,
      x: number,
      top: number,
      size: number,
      color: PdfColor = ink,
      bold = false,
    ) => {
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      pdf.text(value, x, top);
    };

    const rightText = (
      value: string,
      x: number,
      top: number,
      size: number,
      color: PdfColor = ink,
      bold = false,
    ) => {
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      pdf.text(value, x, top, { align: "right" });
    };

    const progressBar = (
      value: number,
      x: number,
      top: number,
      width: number,
    ) => {
      const safeValue = Math.max(0, Math.min(100, value));
      pdf.setFillColor(238, 232, 216);
      pdf.roundedRect(x, top, width, 3, 1.5, 1.5, "F");
      pdf.setFillColor(...gold);
      if (safeValue > 0)
        pdf.roundedRect(x, top, width * (safeValue / 100), 3, 1.5, 1.5, "F");
    };

    const metricCard = (
      label: string,
      value: string,
      detail: string,
      x: number,
      top: number,
      width: number,
    ) => {
      pdf.setDrawColor(231, 221, 204);
      pdf.setFillColor(255, 254, 251);
      pdf.roundedRect(x, top, width, 30, 3, 3, "FD");
      text(label.toUpperCase(), x + 4, top + 7, 7, muted);
      rightText(
        value,
        x + width - 4,
        top + 8,
        10,
        value === "N/A" ? muted : green,
        true,
      );
      progressBar(
        value === "N/A" ? 0 : Number(value.replace("%", "")),
        x + 4,
        top + 13,
        width - 8,
      );
      const detailLines = pdf.splitTextToSize(detail, width - 8).slice(0, 2);
      detailLines.forEach((detailLine: string, index: number) => {
        text(detailLine, x + 4, top + 23 + index * 3.5, 6.5, muted);
      });
    };

    pdf.setFillColor(28, 26, 22);
    pdf.rect(0, 0, pageWidth, 42, "F");
    text("INVICTUS", pageMargin, 13, 9, [201, 168, 76], true);
    text(
      "Invictus Challenge & Academy Progress",
      pageMargin,
      25,
      18,
      [245, 240, 226],
      true,
    );
    text(
      `${userName}  |  Generated ${new Date().toLocaleDateString()}`,
      pageMargin,
      34,
      9,
      [224, 216, 195],
    );
    y = 55;

    const completedModules = moduleProgress.filter(
      (record) => record.isCompleted,
    ).length;
    const summaryWidth = (contentWidth - 9) / 4;
    [
      ["MODULES", String(moduleProgress.length)],
      ["COMPLETED", String(completedModules)],
      ["AVG. COMPLETION", `${overallProgress}%`],
      ["VIDEOS WATCHED", String(watchedVideoHistory.length)],
    ].forEach(([label, value], index) => {
      const x = pageMargin + index * (summaryWidth + 3);
      pdf.setDrawColor(231, 221, 204);
      pdf.setFillColor(255, 254, 251);
      pdf.roundedRect(x, y, summaryWidth, 24, 3, 3, "FD");
      text(label, x + 4, y + 7, 7, muted);
      text(value, x + 4, y + 17, 14, index === 2 ? gold : ink, true);
    });
    y += 34;

    text("PROGRESS BY MODULE", pageMargin, y, 9, gold, true);
    y += 7;

    moduleProgress.forEach((record) => {
      ensureSpace(112);
      const cardTop = y;
      const cardHeight = 105;
      pdf.setDrawColor(231, 221, 204);
      pdf.setFillColor(255, 254, 251);
      pdf.roundedRect(
        pageMargin,
        cardTop,
        contentWidth,
        cardHeight,
        4,
        4,
        "FD",
      );
      const moduleTitle = pdf
        .splitTextToSize(record.module.title, contentWidth - 42)
        .slice(0, 2);
      moduleTitle.forEach((titleLine: string, index: number) =>
        text(
          titleLine,
          pageMargin + 5,
          cardTop + 9 + index * 4.5,
          10,
          ink,
          true,
        ),
      );
      text(
        `Pillar · ${record.module.pillar?.name ?? "General"}`,
        pageMargin + 5,
        cardTop + 19,
        8,
        muted,
      );
      rightText(
        record.isCompleted
          ? "Complete"
          : record.quizSummary.status.replace("_", " "),
        pageWidth - pageMargin - 5,
        cardTop + 12,
        8,
        record.isCompleted ? green : gold,
        true,
      );
      text("Overall Completion", pageMargin + 5, cardTop + 27, 8, muted, true);
      rightText(
        `${record.overallCompletionPercent}%`,
        pageWidth - pageMargin - 5,
        cardTop + 27,
        8,
        gold,
        true,
      );
      progressBar(
        record.overallCompletionPercent,
        pageMargin + 5,
        cardTop + 31,
        contentWidth - 10,
      );

      const metricWidth = (contentWidth - 15) / 2;
      const videoValue = `${record.videoSummary.completionPercent}%`;
      const resourceValue = `${record.resourceSummary.completionPercent}%`;
      const actionValue = record.actionSummary.totalRequired
        ? `${record.actionSummary.completionPercent}%`
        : "N/A";
      const quizStatus = record.quizSummary.passed
        ? "Passed"
        : record.quizSummary.status.replace("_", " ");
      metricCard(
        "Videos watched",
        videoValue,
        `${record.videoSummary.completedRequired}/${record.videoSummary.totalRequired} done`,
        pageMargin + 5,
        cardTop + 38,
        metricWidth,
      );
      metricCard(
        "Resources completed",
        resourceValue,
        `${record.resourceSummary.completedRequired}/${record.resourceSummary.totalRequired} done`,
        pageMargin + 10 + metricWidth,
        cardTop + 38,
        metricWidth,
      );
      metricCard(
        "Actions completed",
        actionValue,
        record.actionSummary.totalRequired
          ? `${record.actionSummary.completedRequired}/${record.actionSummary.totalRequired} done`
          : "Not unlocked",
        pageMargin + 5,
        cardTop + 70,
        metricWidth,
      );
      metricCard(
        "Quiz",
        record.quizSummary.passed ? `${record.quizSummary.bestScore}%` : "N/A",
        `${quizStatus} · ${record.quizSummary.attemptsUsed}/${record.quizSummary.maximumAttempts} attempts`,
        pageMargin + 10 + metricWidth,
        cardTop + 70,
        metricWidth,
      );
      y += cardHeight + 7;
    });

    ensureSpace(20);
    text("WATCHED VIDEOS", pageMargin, y, 9, gold, true);
    y += 7;
    watchedVideoHistory.forEach((item: IVideoProgress) => {
      ensureSpace(12);
      const videoTitle = `${item.video?.title ?? "Video"} · ${item.module?.title ?? "Module"}`;
      const videoLines = pdf.splitTextToSize(videoTitle, 88).slice(0, 2);
      videoLines.forEach((videoLine: string, index: number) =>
        text(videoLine, pageMargin, y + index * 3.5, 7.5, ink, true),
      );
      rightText(
        `${Math.round(item.watchPercent)}% watched · ${Math.round(item.totalWatchedSeconds / 60)} min${item.isCompleted ? " · Completed" : ""}`,
        pageWidth - pageMargin,
        y,
        8,
        muted,
      );
      y += Math.max(6, videoLines.length * 3.5 + 2);
    });

    ensureSpace(22);
    text("CERTIFICATES", pageMargin, y, 9, gold, true);
    y += 7;
    const issuedCertificates = certificates.filter(
      (certificate: IQuizCertificate) => certificate.status === "issued",
    );
    if (!issuedCertificates.length)
      text("No certificates issued yet.", pageMargin, y, 8.5, muted);
    issuedCertificates.forEach((certificate) => {
      ensureSpace(8);
      text(
        `${certificate.pillar?.name ?? "Invictus"} · ${certificate.certificateNumber}`,
        pageMargin,
        y,
        8.5,
        ink,
        true,
      );
      rightText(
        certificate.issuedAt
          ? `Issued ${new Date(certificate.issuedAt).toLocaleDateString()}`
          : "",
        pageWidth - pageMargin,
        y,
        8,
        muted,
      );
      y += 6;
    });

    pdf.save(`Invictus-Progress-Report-${userName.replace(/\s+/g, "-")}.pdf`);
    toast.success("Progress report downloaded successfully!");
  };

  return (
    <>
      <SectionHeader variant="invictus" title="Member Progress Report" />
      <SectionCard variant="invictus" className="mb-4">
        <div className="divide-y divide-[#F0EBDE]">
          {progressPillars.length > 0 ? (
            progressPillars.map((pillar) => (
              <div key={pillar.name} className="py-4 first:pt-0 last:pb-0">
                <div className="mb-3 flex items-center justify-between">
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${pillar.active ? "text-[#1C1A16]" : "text-[#C7C0B0]"}`}
                  >
                    {pillar.name}
                  </p>
                  {pillar.active && (
                    <span className="text-sm font-medium text-[#8A8375]">
                      {pillar.progress}%
                    </span>
                  )}
                </div>

                {pillar.active ? (
                  <>
                    <ul className="space-y-2">
                      {pillar.modules.map((module) => (
                        <li
                          key={module.label}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="flex items-center gap-2 text-[#4A4539]">
                            <StatusDot status={module.status} />
                            {module.label} — {module.status}
                          </span>
                          <span className="text-xs text-[#B0A996]">
                            {module.meta}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <ProgressBar value={pillar.progress} className="mt-4" />
                  </>
                ) : (
                  <p className="text-sm text-[#C7C0B0]">
                    Unlocks after the previous pillar is complete
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="py-4 text-sm text-[#8A8375]">
              No academy progress recorded yet.
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-[#F0EBDE] pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9284]">
            Overall Success Rate
          </p>
          <span className="text-sm font-medium text-[#8A8375]">
            {overallProgress}%
          </span>
        </div>
        <ProgressBar value={overallProgress} className="mt-2" />
      </SectionCard>

      <button
        type="button"
        onClick={handleDownloadProgressReport}
        className="mb-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#DECDB0] bg-[#FAF6EE] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#A88A3F] transition-colors hover:bg-[#FBF3DC]"
      >
        <Download size={15} />
        Download my progress report
      </button>
    </>
  );
}
