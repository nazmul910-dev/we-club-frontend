"use client";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { deleteDiscountCode } from "@/lib/features/discountFounder/discountSlice";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discountId: string | null;
  discountCode: string | null;
}

export default function DeleteDiscountModal({
  open,
  onOpenChange,
  discountId,
  discountCode,
}: Props) {
  const dispatch = useAppDispatch();

  const deletingId = useAppSelector((state) => state.discount.deletingId);
  const isDeleting = deletingId === discountId;

  const handleDelete = async () => {
    if (!discountId) {
      return;
    }

    try {
      await dispatch(deleteDiscountCode({ id: discountId })).unwrap();

      toast.success(`Discount code "${discountCode}" deleted.`);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e || "Failed to delete discount code.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-neutral-800 bg-[#0B0B0B] text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Delete Discount Code
          </DialogTitle>

          <DialogDescription className="text-neutral-400">
            Are you sure you want to delete{" "}
            <span className="text-red-400 font-semibold">
              {discountCode}
            </span>
            ? This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="h-11 cursor-pointer rounded-xl border border-neutral-700 px-6 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 px-6 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}