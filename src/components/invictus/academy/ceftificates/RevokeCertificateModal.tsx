"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { IQuizCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateTypes";
import { revokeCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateSlice";


interface Props {
  open: boolean;
  onClose: () => void;
  certificate: IQuizCertificate | null;
}

export default function RevokeCertificateModal({ open, onClose, certificate }: Props) {
  const dispatch = useAppDispatch();

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const submit = async () => {
    if (!certificate) return;

    try {
      setLoading(true);
      await dispatch(revokeCertificate({ id: certificate._id, reason: reason.trim() || undefined })).unwrap();
      toast.success("Certificate revoked");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not revoke the certificate, try again";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-[#1C1A17]">
            <ShieldAlert size={18} className="text-red-500" />
            Revoke Certificate
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-[#8A8175]">
            <span className="font-medium text-[#1C1A17]">{certificate?.certificateNumber}</span> will immediately show as invalid on the public verification page. This cannot be undone.
          </p>

          <div>
            <Label>Reason (optional)</Label>
            <Textarea
              className="mt-2 min-h-[90px]"
              placeholder="e.g. Issued in error, quiz result disputed..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer border-[#E7DDCC] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading} className="cursor-pointer bg-red-500 text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-600 active:translate-y-0" onClick={submit}>
            {loading ? "Revoking..." : "Confirm Revoke"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}