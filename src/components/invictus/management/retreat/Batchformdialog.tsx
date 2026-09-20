"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Save } from "lucide-react";

import {
  ICreateRetreatBatchPayload,
  IRetreatBatch,
  IRetreatLocation,
  RETREAT_BATCH_STATUSES,
  RetreatBatchStatus,
} from "@/lib/features/retreat/retreatTypes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  dialogContentClass,
  dialogDescriptionClass,
  dialogTitleClass,
  inputClass,
  outlineButtonClass,
  primaryButtonClass,
  sectionLabelClass,
  textareaClass,
} from "@/app/invictus/management/retreats/Retreatdesigntokens";
import {
  createRetreatBatch,
  selectRetreatStatus,
  updateRetreatBatch,
} from "@/lib/features/retreat/retreatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { DateTimePicker } from "@/components/common/date-time-picker";

interface BatchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations: IRetreatLocation[];
  // Pass an existing batch to edit; omit to create a new one.
  batch?: IRetreatBatch | null;
  // Preselect a location when creating from within a location's context.
  defaultLocationId?: string;
}

interface BatchFormState {
  retreatLocation: string;
  batchName: string;
  slug: string;
  startDate: string; // datetime-local value
  endDate: string; // datetime-local value
  capacity: string;
  price: string;
  depositAmount: string;
  currency: string;
  status: RetreatBatchStatus;
  isFeatured: boolean;
  isActive: boolean;
  bookingDeadline: string; // datetime-local value
  description: string;
  notes: string;
}

function emptyForm(defaultLocationId?: string): BatchFormState {
  return {
    retreatLocation: defaultLocationId ?? "",
    batchName: "",
    slug: "",
    startDate: "",
    endDate: "",
    capacity: "",
    price: "",
    depositAmount: "",
    currency: "usd",
    status: "upcoming",
    isFeatured: false,
    isActive: true,
    bookingDeadline: "",
    description: "",
    notes: "",
  };
}

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// ISO string <-> <input type="datetime-local"> value conversion
function isoToLocalInput(iso?: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function localInputToIso(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function toFormState(batch: IRetreatBatch): BatchFormState {
  return {
    retreatLocation:
      typeof batch.retreatLocation === "string"
        ? batch.retreatLocation
        : batch.retreatLocation._id,
    batchName: batch.batchName,
    slug: batch.slug,
    startDate: isoToLocalInput(batch.startDate),
    endDate: isoToLocalInput(batch.endDate),
    capacity: String(batch.capacity),
    price: String(batch.price),
    depositAmount:
      batch.depositAmount !== undefined ? String(batch.depositAmount) : "",
    currency: batch.currency,
    status: batch.status,
    isFeatured: batch.isFeatured,
    isActive: batch.isActive,
    bookingDeadline: isoToLocalInput(batch.bookingDeadline),
    description: batch.description ?? "",
    notes: batch.notes ?? "",
  };
}

export default function BatchFormDialog({
  open,
  onOpenChange,
  locations,
  batch,
  defaultLocationId,
}: BatchFormDialogProps) {
  const dispatch = useAppDispatch();
  const { batchCreate, batchUpdate } = useAppSelector(selectRetreatStatus);
  const isEditing = Boolean(batch);
  const isSubmitting =
    (isEditing && batchUpdate === "loading") ||
    (!isEditing && batchCreate === "loading");

  const [form, setForm] = useState<BatchFormState>(
    emptyForm(defaultLocationId),
  );

  useEffect(() => {
    if (open) {
      setForm(batch ? toFormState(batch) : emptyForm(defaultLocationId));
    }
  }, [open, batch, defaultLocationId]);

  const startIso = localInputToIso(form.startDate);
  const endIso = localInputToIso(form.endDate);

  const canSubmit =
    form.retreatLocation.length > 0 &&
    form.batchName.trim().length >= 2 &&
    Boolean(startIso) &&
    Boolean(endIso) &&
    Number(form.capacity) >= 1 &&
    Number(form.price) >= 0 &&
    !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit || !startIso || !endIso) return;

    const payload: ICreateRetreatBatchPayload = {
      retreatLocation: form.retreatLocation,
      batchName: form.batchName.trim(),
      slug: form.slug.trim() || undefined,
      startDate: startIso,
      endDate: endIso,
      capacity: Number(form.capacity),
      price: Number(form.price),
      depositAmount: form.depositAmount
        ? Number(form.depositAmount)
        : undefined,
      currency: form.currency.trim() || undefined,
      status: form.status,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      bookingDeadline: localInputToIso(form.bookingDeadline),
      description: form.description.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    const result = batch
      ? await dispatch(updateRetreatBatch({ id: batch._id, payload }))
      : await dispatch(createRetreatBatch(payload));

    const succeeded = batch
      ? updateRetreatBatch.fulfilled.match(result)
      : createRetreatBatch.fulfilled.match(result);

    if (succeeded) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader className="space-y-2">
          <DialogTitle className={dialogTitleClass}>
            {isEditing ? "Edit retreat batch" : "New retreat batch"}
          </DialogTitle>

          <DialogDescription className={dialogDescriptionClass}>
            {isEditing
              ? "Update the schedule, pricing, or status for this batch."
              : "Create a bookable batch for a retreat location."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="batch-location" className={sectionLabelClass}>
              Retreat location
            </Label>
            <select
              id="batch-location"
              value={form.retreatLocation}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  retreatLocation: event.target.value,
                }))
              }
              className="h-9 w-full rounded-md border border-[#E9E2D2] bg-white px-3 text-sm text-[#1C1A16] outline-none focus-visible:border-[#C6A34A]"
            >
              <option value="" disabled>
                Select a location
              </option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.title} ({loc.city}, {loc.country})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="batch-name" className={sectionLabelClass}>
                Batch name
              </Label>
              <Input
                id="batch-name"
                value={form.batchName}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    batchName: event.target.value,
                    slug: generateSlug(event.target.value),
                  }))
                }
                placeholder="e.g. March 2027 Cohort"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-slug" className={sectionLabelClass}>
                Slug{" "}
                <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                  (auto-generated if left blank)
                </span>
              </Label>
              <Input
                id="batch-slug"
                value={form.slug}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    slug: event.target.value,
                  }))
                }
                placeholder="march-2027-cohort"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-start" className={sectionLabelClass}>
                Start date
              </Label>
              <DateTimePicker
                value={form.startDate}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, startDate: value }))
                }
                placeholder="Select start date and time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-end" className={sectionLabelClass}>
                End date
              </Label>
              <DateTimePicker
                value={form.endDate}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, endDate: value }))
                }
                placeholder="Select end date and time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-capacity" className={sectionLabelClass}>
                Capacity
              </Label>
              <Input
                id="batch-capacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    capacity: event.target.value,
                  }))
                }
                placeholder="20"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-deadline" className={sectionLabelClass}>
                Booking deadline{" "}
                <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                  (optional)
                </span>
              </Label>
              <DateTimePicker
                value={form.bookingDeadline}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, bookingDeadline: value }))
                }
                placeholder="Select booking deadline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-price" className={sectionLabelClass}>
                Price
              </Label>
              <Input
                id="batch-price"
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    price: event.target.value,
                  }))
                }
                placeholder="2500"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-deposit" className={sectionLabelClass}>
                Deposit amount{" "}
                <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                  (optional)
                </span>
              </Label>
              <Input
                id="batch-deposit"
                type="number"
                min={0}
                step="0.01"
                value={form.depositAmount}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    depositAmount: event.target.value,
                  }))
                }
                placeholder="500"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-currency" className={sectionLabelClass}>
                Currency
              </Label>
              <Input
                id="batch-currency"
                value={form.currency}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    currency: event.target.value,
                  }))
                }
                placeholder="usd"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-status" className={sectionLabelClass}>
                Status
              </Label>
              <select
                id="batch-status"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as RetreatBatchStatus,
                  }))
                }
                className="h-9 w-full rounded-md border border-[#E9E2D2] bg-white px-3 text-sm text-[#1C1A16] outline-none focus-visible:border-[#C6A34A]"
              >
                {RETREAT_BATCH_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status
                      .split("_")
                      .map((word) => word[0].toUpperCase() + word.slice(1))
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-sm text-[#4A4539]">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isFeatured: event.target.checked,
                  }))
                }
                className="accent-[#C6A34A]"
              />
              Featured
            </label>

            <label className="flex items-center gap-2 text-sm text-[#4A4539]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: event.target.checked,
                  }))
                }
                className="accent-[#C6A34A]"
              />
              Active
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch-description" className={sectionLabelClass}>
              Description{" "}
              <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                (optional)
              </span>
            </Label>
            <textarea
              id="batch-description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="What makes this specific batch different..."
              className={textareaClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch-notes" className={sectionLabelClass}>
              Internal notes{" "}
              <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                (optional, not shown to members)
              </span>
            </Label>
            <textarea
              id="batch-notes"
              value={form.notes}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
              placeholder="Internal notes for the team..."
              className={textareaClass}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className={outlineButtonClass}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={primaryButtonClass}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Save changes" : "Create batch"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
