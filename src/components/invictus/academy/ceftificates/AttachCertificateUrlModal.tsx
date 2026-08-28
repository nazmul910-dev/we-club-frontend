"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link2 } from "lucide-react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { IQuizCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateTypes";
import { attachCertificateUrl } from "@/lib/features/invictus/academy/cerfificate/certificateSlice";


interface Props {
  open: boolean;
  onClose: () => void;
  certificate: IQuizCertificate | null;
}

export default function AttachCertificateUrlModal({ open, onClose, certificate }: Props) {
  const dispatch = useAppDispatch();

  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setUrl(certificate?.certificateUrl || "");
      setError("");
    }
  }, [open, certificate]);

  const submit = async () => {
    if (!certificate) return;

    if (!url.trim()) {
      setError("Paste the certificate file URL first");
      return;
    }

    try {
      setLoading(true);
      await dispatch(attachCertificateUrl({ id: certificate._id, certificateUrl: url.trim() })).unwrap();
      toast.success("Certificate file attached successfully");
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not attach the file, try again";
      setError(message);
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
            <Link2 size={18} className="text-[#B08A3E]" />
            Attach Certificate File
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-[#8A8175]">
            Paste the URL of the generated PDF / image for <span className="font-medium text-[#1C1A17]">{certificate?.certificateNumber}</span>.
          </p>

          <div>
            <Label>Certificate URL</Label>
            <Input
              className="mt-2"
              placeholder="https://res.cloudinary.com/..."
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer border-[#E7DDCC] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading} className="cursor-pointer bg-[#B08A3E] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#B08A3E]/90 active:translate-y-0" onClick={submit}>
            {loading ? "Saving..." : "Save URL"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}