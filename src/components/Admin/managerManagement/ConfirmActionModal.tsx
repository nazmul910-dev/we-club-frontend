
"use client";

import { Loader2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";

interface ConfirmActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
}

export default function ConfirmActionModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  loading = false,
  destructive = false,
  onConfirm,
}: ConfirmActionModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !loading && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              disabled={loading}
              className={
                destructive
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-amber-500 text-black hover:bg-amber-400"
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}