"use client";

import { useRef, useState } from "react";
import { Loader2, Plus, RefreshCw, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { uploadLogo, changeLogo } from "@/lib/features/logo/logoApi";
import { useAppDispatch } from "@/lib/redux/store/hook";

interface LogoUploadModalProps {
  existingLogo?: string;
}

const MAX_FILE_SIZE_MB = 5;

export default function LogoUploadModal({ existingLogo }: LogoUploadModalProps) {
  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isChangeMode = Boolean(existingLogo);

  const resetAndClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setOpen(false);
  };

  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0] ?? null;
    handleFileSelect(dropped);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const action = isChangeMode ? changeLogo(file) : uploadLogo(file);
    const result = await dispatch(action);

    setSubmitting(false);

    if (
      uploadLogo.fulfilled.match(result) ||
      changeLogo.fulfilled.match(result)
    ) {
      resetAndClose();
    } else {
      setError((result.payload as string) || "Failed to save logo. Try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!submitting) {
          setOpen(next);
          if (!next) {
            setFile(null);
            setPreviewUrl(null);
            setError(null);
          }
        }
      }}
    >
      <DialogTrigger>
        <div className="h-11 rounded-xl cursor-pointer flex justify-center items-center bg-[#c9a84c] px-5 text-sm font-bold text-black shadow-lg transition hover:bg-[#c9a125]">
          {isChangeMode ? (
            <RefreshCw className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          <p>{isChangeMode ? "Change Logo" : "Add Logo"}</p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {isChangeMode ? "Change Logo" : "Upload Logo"}
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            {isChangeMode
              ? "Replace the current site logo with a new image."
              : "Upload an image to set as the site logo."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            disabled={submitting}
          />

          {!previewUrl ? (
            <div
              onClick={() => !submitting && fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-900/40 px-6 text-center transition hover:border-[#cdae53] hover:bg-neutral-900/70"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900">
                <UploadCloud className="h-5 w-5 text-[#cdae53]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-200">
                  Click to upload
                  <span className="font-normal text-neutral-500">
                    {" "}
                    or drag and drop
                  </span>
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  PNG, JPG, SVG or WEBP (max {MAX_FILE_SIZE_MB}MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="relative flex h-52 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={submitting}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition hover:bg-red-500/20 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected logo preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {file && (
            <p className="truncate text-xs text-neutral-500">
              Selected: <span className="text-neutral-300">{file.name}</span>
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="ghost"
            onClick={resetAndClose}
            disabled={submitting}
            className="h-11 rounded-xl font-bold text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !file}
            className="h-11 rounded-xl bg-[#c9a84c] px-6 font-bold text-black hover:bg-[#cfa123]"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Logo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}