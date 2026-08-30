"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Award,
  Copy,
  Download,
  ExternalLink,
  Printer,
  ShieldCheck,
  X,
  Sparkles,
  CheckCircle2,
  FileDown,
  Image as ImageIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import type { IQuizCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  certificate: IQuizCertificate | null;
  userName?: string;
}

export default function ProfileCertificateModal({
  open,
  onClose,
  certificate,
  userName,
}: Props) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);

  if (!certificate) return null;

  const recipientName = certificate.user?.fullName || userName || "Invictus Member";
  const moduleTitle = certificate.module?.title || "Course Module";
  const pillarName = certificate.pillar?.name || "Invictus Challenge";
  const issueDate = certificate.issuedAt
    ? new Date(certificate.issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificate.certificateNumber);
    toast.success("Certificate ID copied to clipboard!");
  };

  // 1-Click High Resolution Landscape PDF Download
  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    try {
      setDownloadingPdf(true);
      toast.loading("Generating your high-definition certificate PDF...", { id: "cert-pdf" });

      const element = certificateRef.current;
      const imgData = await toPng(element, {
        pixelRatio: 2.5,
        backgroundColor: "#FAF8F3",
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Fit image into A4 landscape
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`Invictus-Certificate-${certificate.certificateNumber}.pdf`);

      toast.success("Certificate PDF downloaded successfully!", { id: "cert-pdf" });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try the Print option.", { id: "cert-pdf" });
    } finally {
      setDownloadingPdf(false);
    }
  };

  // 1-Click High Resolution PNG Image Download
  const handleDownloadPng = async () => {
    if (!certificateRef.current) return;
    try {
      setDownloadingPng(true);
      toast.loading("Generating certificate image...", { id: "cert-png" });

      const element = certificateRef.current;
      const imgData = await toPng(element, {
        pixelRatio: 2.5,
        backgroundColor: "#FAF8F3",
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Invictus-Certificate-${certificate.certificateNumber}.png`;
      link.click();

      toast.success("Certificate image saved!", { id: "cert-png" });
    } catch (error) {
      console.error("PNG export failed:", error);
      toast.error("Failed to export image.", { id: "cert-png" });
    } finally {
      setDownloadingPng(false);
    }
  };

  // Dedicated Clean Print Window
  const handlePrint = () => {
    if (!certificateRef.current) return;
    const certHtml = certificateRef.current.outerHTML;

    const printWindow = window.open("", "_blank", "width=1200,height=850");
    if (!printWindow) {
      toast.error("Please allow popups to print certificate directly");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invictus Certificate - ${certificate.certificateNumber}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #FAF8F3;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .font-cinzel { font-family: 'Cinzel', serif; }
            .font-playfair { font-family: 'Playfair Display', serif; }
            .font-signature { font-family: 'Great Vibes', cursive; }
          </style>
        </head>
        <body>
          <div style="width: 297mm; height: 210mm; padding: 12mm; box-sizing: border-box;">
            ${certHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[96vh] max-w-5xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-[#111111]/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:p-6">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium text-white sm:text-xl">
            <Award className="text-[#D4AF37]" size={22} />
            Official Invictus Certificate of Achievement
          </DialogTitle>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        {/* Certificate Container with Royal Landscape Aspect Ratio */}
        <div className="my-2 flex items-center justify-center overflow-x-auto p-1">
          <div
            ref={certificateRef}
            id="invictus-certificate-frame"
            className="relative box-border flex h-[620px] w-[900px] shrink-0 flex-col justify-between overflow-hidden rounded-xl border-[6px] border-[#B08A3E] bg-[#FAF8F3] p-8 text-[#1C1A17] shadow-2xl select-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(243, 233, 210, 0.4) 0%, rgba(250, 248, 243, 0.95) 75%)`,
            }}
          >
            {/* Inner Gold Pinstripe Border */}
            <div className="pointer-events-none absolute inset-3 rounded-lg border-2 border-[#D4AF37]/50" />
            <div className="pointer-events-none absolute inset-4 rounded-md border border-[#B08A3E]/30" />

            {/* Corner Filigree / Ornaments */}
            <div className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l-2 border-t-2 border-[#B08A3E]" />
            <div className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r-2 border-t-2 border-[#B08A3E]" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b-2 border-l-2 border-[#B08A3E]" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b-2 border-r-2 border-[#B08A3E]" />

            {/* Background Watermark Crest */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
              <span className="font-serif text-[160px] font-black tracking-widest text-[#B08A3E]">
                INVICTUS
              </span>
            </div>

            {/* Top Header & Emblem */}
            <div className="relative z-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#B08A3E] bg-gradient-to-tr from-[#E6CA65] via-[#B08A3E] to-[#997734] text-white shadow-md">
                <Award size={28} />
              </div>
              <p className="mt-2 text-[10px] font-bold tracking-[8px] uppercase text-[#B08A3E]">
                INVICTUS EXECUTIVE ACADEMY
              </p>
              <h1 className="mt-1 font-serif text-3xl font-bold tracking-wide text-[#1C1A17] sm:text-4xl">
                Certificate of Mastery
              </h1>
            </div>

            {/* Main Recipient Body */}
            <div className="relative z-10 my-auto text-center">
              <p className="text-xs italic tracking-wide text-[#8A8175]">
                This is proudly and officially conferred upon
              </p>

              <div className="relative mx-auto mt-2 inline-block max-w-xl">
                <h2 className="px-8 font-serif text-3xl font-bold tracking-wide text-[#1C1A17] sm:text-4xl">
                  {recipientName}
                </h2>
                <div className="mx-auto mt-1 h-[2px] w-full bg-gradient-to-r from-transparent via-[#B08A3E] to-transparent" />
              </div>

              <p className="mx-auto mt-3 max-w-lg text-[11px] leading-relaxed text-[#5A534A]">
                for demonstrating leadership excellence, mastering all lessons & resources, and passing
                comprehensive evaluations with a distinction score of{" "}
                <span className="font-bold text-[#B08A3E]">{certificate.score}%</span> in:
              </p>

              {/* Pillar / Module Badge */}
              <div className="mx-auto mt-2.5 inline-flex items-center gap-2 rounded-xl border border-[#B08A3E]/40 bg-[#F3E9D2]/80 px-6 py-2 shadow-sm">
                <Sparkles size={14} className="text-[#B08A3E]" />
                <span className="font-serif text-sm font-bold text-[#1C1A17]">
                  {certificate.pillar?.name
                    ? `${certificate.pillar.name} Pillar Track`
                    : certificate.module?.title || "Executive Challenge"}
                </span>
                {certificate.module?.title && (
                  <>
                    <span className="text-[#B08A3E]">·</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#B08A3E]">
                      {certificate.module.title}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Footer Information, Official Seal & Signatures */}
            <div className="relative z-10 flex items-end justify-between border-t border-[#E7DDCC] pt-4">
              {/* Left: Certificate Metadata */}
              <div className="w-56 text-left">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8A8175]">
                  Certificate Registry ID
                </p>
                <p className="mt-0.5 font-mono text-[11px] font-bold text-[#1C1A17]">
                  {certificate.certificateNumber}
                </p>

                <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-[#8A8175]">
                  Conferred Date
                </p>
                <p className="mt-0.5 font-serif text-[11px] font-medium text-[#1C1A17]">{issueDate}</p>
              </div>

              {/* Center: Gold 3D Seal */}
              <div className="text-center">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border double border-[#FAF8F3] bg-gradient-to-br from-[#F5D77F] via-[#B08A3E] to-[#7A5A1B] text-white shadow-xl">
                  <div className="flex flex-col items-center">
                    <Award size={22} className="text-white drop-shadow" />
                    <span className="mt-0.5 text-[6px] font-black tracking-widest uppercase">
                      OFFICIAL SEAL
                    </span>
                    <span className="text-[5px] tracking-wider uppercase opacity-90">VERIFIED</span>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 size={12} />
                  <span>Authenticated</span>
                </div>
              </div>

              {/* Right: Executive Signatures */}
              <div className="w-56 text-right">
                <div className="mb-1 inline-block text-center">
                  <p
                    className="font-serif italic text-lg text-[#1C1A17] tracking-wider"
                    style={{ fontFamily: "'Playfair Display', cursive, serif" }}
                  >
                    Alexander Vance
                  </p>
                  <div className="h-[1px] w-36 bg-[#1C1A17]/40" />
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#8A8175]">
                    Executive Dean
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="cursor-pointer gap-1.5 rounded-xl border-white/20 bg-white/5 text-xs text-white transition hover:bg-white/10 hover:text-white"
            >
              <Copy size={13} />
              Copy ID
            </Button>

            {certificate.certificateUrl && (
              <a
                href={certificate.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                <ExternalLink size={13} />
                Original File
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleDownloadPng}
              disabled={downloadingPng}
              className="cursor-pointer gap-1.5 rounded-xl border border-[#B08A3E]/60 bg-[#B08A3E]/20 px-4 py-2 text-xs font-medium text-[#F3E9D2] transition hover:bg-[#B08A3E]/30"
            >
              <ImageIcon size={14} />
              {downloadingPng ? "Saving Image..." : "Save Image"}
            </Button>

            <Button
              onClick={handlePrint}
              className="cursor-pointer gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/20"
            >
              <Printer size={14} />
              Print
            </Button>

            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="cursor-pointer gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B08A3E] px-6 py-2.5 text-xs font-bold text-white shadow-lg transition duration-200 hover:brightness-110 disabled:opacity-60"
            >
              <FileDown size={16} />
              {downloadingPdf ? "Generating PDF..." : "Download Clean PDF (1-Page)"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
