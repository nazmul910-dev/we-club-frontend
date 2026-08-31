"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Loader2 } from "lucide-react";

interface InvictusConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "danger" | "success";
  loading?: boolean;
  onConfirm: () => void;
}

/**
 * Shared confirm dialog for Invictus Academy admin actions
 * (archive, revoke, delete, etc). Styled to match the
 * academy's gold / cream theme instead of the default
 * dark ConfirmDialog used elsewhere in the app.
 */
export default function InvictusConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  loading = false,
  onConfirm,
}: InvictusConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-[#E7DDCC] bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-[#1C1A17]">
            {title}
          </AlertDialogTitle>

          {description && (
            <AlertDialogDescription className="text-sm text-[#8A8175]">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="cursor-pointer rounded-xl border-[#E7DDCC] bg-transparent text-[#1C1A17] hover:bg-[#FAF8F4]"
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={
              confirmVariant === "danger"
                ? "cursor-pointer rounded-xl bg-red-500 text-white hover:bg-red-600"
                : confirmVariant === "success"
                ? "cursor-pointer rounded-xl bg-green-600 text-white hover:bg-green-700"
                : "cursor-pointer rounded-xl bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
            }
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}