"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Award, Copy, ExternalLink, Link2, ShieldAlert } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";



import CertificateStatusBadge from "./CertificateStatusBadge";
import AttachCertificateUrlModal from "./AttachCertificateUrlModal";
import RevokeCertificateModal from "./RevokeCertificateModal";
import { IQuizCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  certificate: IQuizCertificate | null;
}

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

export default function CertificateDetailModal({ open, onClose, certificate }: Props) {
  const [attachOpen, setAttachOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);

  if (!certificate) return null;

  const copyNumber = () => {
    navigator.clipboard.writeText(certificate.certificateNumber);
    toast.success("Certificate number copied");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#1C1A17]">Certificate Detail</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E7DDCC] bg-[#FAF8F4] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B08A3E]">
                  <Award size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-medium text-[#1C1A17]">{certificate.certificateNumber}</p>
                    <button onClick={copyNumber} className="cursor-pointer text-[#8A8175] transition-colors duration-200 hover:text-[#B08A3E]" title="Copy certificate number">
                      <Copy size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-[#8A8175]">Score {certificate.score}%</p>
                </div>
              </div>

              <CertificateStatusBadge status={certificate.status} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E7DDCC] p-4">
                <p className="text-xs uppercase tracking-[3px] text-[#B08A3E]">Member</p>
                <p className="mt-1 font-medium text-[#1C1A17]">{certificate.user?.fullName || "—"}</p>
                <p className="text-xs text-[#8A8175]">{certificate.user?.email || "—"}</p>
              </div>

              <div className="rounded-2xl border border-[#E7DDCC] p-4">
                <p className="text-xs uppercase tracking-[3px] text-[#B08A3E]">Module</p>
                <p className="mt-1 font-medium text-[#1C1A17]">{certificate.module?.title || "—"}</p>
                {certificate.pillar?.name && <p className="text-xs text-[#8A8175]">Pillar · {certificate.pillar.name}</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E7DDCC] p-4">
              <p className="text-xs uppercase tracking-[3px] text-[#B08A3E]">Certificate File</p>
              {certificate.certificateUrl ? (
                <a href={certificate.certificateUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#B08A3E] transition-colors duration-200 hover:text-[#8f6e2f]">
                  <ExternalLink size={14} />
                  View attached file
                </a>
              ) : (
                <p className="mt-2 text-sm text-[#8A8175]">No file attached yet.</p>
              )}
            </div>

            <div className="grid gap-2 rounded-2xl border border-dashed border-[#E7DDCC] bg-[#FAF8F4] p-4 text-xs text-[#8A8175] sm:grid-cols-2">
              <p>Issued at · {formatDate(certificate.issuedAt)}</p>
              {certificate.status === "revoked" ? (
                <>
                  <p>Revoked at · {formatDate(certificate.revokedAt)}</p>
                  <p className="sm:col-span-2">Revoked by · {certificate.revokedBy?.fullName || "—"}</p>
                  {certificate.revokedReason && <p className="sm:col-span-2">Reason · {certificate.revokedReason}</p>}
                </>
              ) : (
                <p>Created at · {formatDate(certificate.createdAt)}</p>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap justify-end gap-3">
            <Button variant="outline" className="cursor-pointer border-[#E7DDCC] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" onClick={onClose}>
              Close
            </Button>

            <Button variant="outline" className="cursor-pointer gap-2 border-[#E7DDCC] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#B08A3E] hover:text-[#B08A3E] active:translate-y-0" onClick={() => setAttachOpen(true)}>
              <Link2 size={16} />
              {certificate.certificateUrl ? "Update File URL" : "Attach File URL"}
            </Button>

            {certificate.status === "issued" && (
              <Button className="cursor-pointer gap-2 bg-red-500 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-600 active:translate-y-0" onClick={() => setRevokeOpen(true)}>
                <ShieldAlert size={16} />
                Revoke
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AttachCertificateUrlModal open={attachOpen} certificate={certificate} onClose={() => setAttachOpen(false)} />
      <RevokeCertificateModal open={revokeOpen} certificate={certificate} onClose={() => setRevokeOpen(false)} />
    </>
  );
}