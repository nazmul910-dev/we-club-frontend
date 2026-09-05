"use client";

import { useEffect, useRef, useState } from "react";
import { Film, ImagePlus, Plus, RefreshCw, Save, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import {
  ICreateRetreatLocationPayload,
  IRetreatLocation,
  LocationFormSubmitPayload,
  RETREAT_LOCATION_STATUSES,
  RetreatLocationStatus,
} from "@/lib/features/retreat/retreatTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createRetreatLocation,
  selectRetreatStatus,
  updateRetreatLocation,
} from "@/lib/features/retreat/retreatSlice";

interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: IRetreatLocation | null;
}

/** Local form shape (includes existing URL strings for display while editing). */
type LocationFormState = ICreateRetreatLocationPayload & {
  coverImage?: string;
  promoVideoUrl?: string;
  galleryImages?: string[];
};

const EMPTY_FORM: LocationFormState = {
  title: "",
  slug: "",
  country: "",
  city: "",
  tagline: "",
  description: "",
  coverImage: "",
  promoVideoUrl: "",
  galleryImages: [],
  whatsIncluded: [],
  isFeatured: false,
  isActive: true,
  status: "draft",
  order: 0,
};

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function toFormState(location: IRetreatLocation): LocationFormState {
  return {
    title: location.title,
    slug: location.slug,
    country: location.country,
    city: location.city,
    tagline: location.tagline ?? "",
    description: location.description,
    coverImage: location.coverImage ?? "",
    promoVideoUrl: location.promoVideoUrl ?? "",
    galleryImages: location.galleryImages ?? [],
    whatsIncluded: location.whatsIncluded ?? [],
    isFeatured: location.isFeatured,
    isActive: location.isActive,
    status: location.status,
    order: location.order,
  };
}

export default function LocationFormDialog({
  open,
  onOpenChange,
  location,
}: LocationFormDialogProps) {
  const dispatch = useAppDispatch();
  const { locationCreate, locationUpdate } =
    useAppSelector(selectRetreatStatus);

  const isEditing = Boolean(location);
  const isSubmitting =
    (isEditing && locationUpdate === "loading") ||
    (!isEditing && locationCreate === "loading");

  const [form, setForm] = useState<LocationFormState>(EMPTY_FORM);
  const [includedInput, setIncludedInput] = useState("");

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [replaceGallery, setReplaceGallery] = useState(false);
  const [promoVideoFile, setPromoVideoFile] = useState<File | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const promoVideoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    setForm(location ? toFormState(location) : EMPTY_FORM);
    setIncludedInput("");
    setCoverFile(null);
    setCoverPreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery(location?.galleryImages ?? []);
    setReplaceGallery(false);
    setPromoVideoFile(null);

    if (coverInputRef.current) coverInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (promoVideoInputRef.current) promoVideoInputRef.current.value = "";

    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, location]);

  const canSubmit =
    form.title.trim().length >= 2 &&
    form.country.trim().length >= 2 &&
    form.city.trim().length >= 2 &&
    form.description.trim().length >= 10 &&
    !isSubmitting;

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
    if (file) {
      setForm((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const clearCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
    setForm((prev) => ({ ...prev, coverImage: "" }));
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const nextFiles = [...galleryFiles, ...files].slice(0, 10);
    const nextPreviews = nextFiles.map((f) => URL.createObjectURL(f));

    galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
    setGalleryFiles(nextFiles);
    setGalleryPreviews(nextPreviews);

    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const removeNewGalleryFile = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index] ?? "");
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryUrl = (index: number) => {
    setExistingGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const clearPromoVideo = () => {
    setPromoVideoFile(null);
    setForm((prev) => ({ ...prev, promoVideoUrl: "" }));
    if (promoVideoInputRef.current) promoVideoInputRef.current.value = "";
  };

  const addIncludedItem = () => {
    const value = includedInput.trim();
    if (!value) return;
    setForm((prev) => ({
      ...prev,
      whatsIncluded: [...(prev.whatsIncluded ?? []), value],
    }));
    setIncludedInput("");
  };

  const removeIncludedItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      whatsIncluded: (prev.whatsIncluded ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const payload: LocationFormSubmitPayload = {
      title: form.title.trim(),
      slug: form.slug?.trim() || undefined,
      country: form.country.trim(),
      city: form.city.trim(),
      tagline: form.tagline?.trim() || undefined,
      description: form.description.trim(),
      whatsIncluded: form.whatsIncluded ?? [],
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      status: form.status,
      order: form.order,
      galleryImages: replaceGallery ? [] : existingGallery,
      coverImageFile: coverFile ?? undefined,
      galleryFiles: galleryFiles.length ? galleryFiles : undefined,
      promoVideoFile: promoVideoFile ?? undefined,
      replaceGallery: isEditing ? replaceGallery : undefined,
    };

    // Clear cover on edit if user removed it and didn't pick a new file
    if (isEditing && !coverFile && !form.coverImage && location?.coverImage) {
      payload.coverImage = null;
    }

    // Clear promo video on edit if user removed it and didn't pick a new file
    if (
      isEditing &&
      !promoVideoFile &&
      !form.promoVideoUrl &&
      location?.promoVideoUrl
    ) {
      payload.promoVideoUrl = null;
    }

    const result = location
      ? await dispatch(updateRetreatLocation({ id: location._id, payload }))
      : await dispatch(createRetreatLocation(payload));

    const succeeded = location
      ? updateRetreatLocation.fulfilled.match(result)
      : createRetreatLocation.fulfilled.match(result);

    if (succeeded) {
      onOpenChange(false);
    }
  };

  const shownCover = coverPreview || form.coverImage || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader className="space-y-2">
          <DialogTitle className={dialogTitleClass}>
            {isEditing ? "Edit retreat location" : "New retreat location"}
          </DialogTitle>
          <DialogDescription className={dialogDescriptionClass}>
            {isEditing
              ? "Update the details for this retreat location."
              : "Add a new retreat location. You can attach batches to it afterwards."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loc-title" className={sectionLabelClass}>
                Title
              </Label>
              <Input
                id="loc-title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  }))
                }
                placeholder="e.g. Bali Fearless Retreat"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc-slug" className={sectionLabelClass}>
                Slug{" "}
                <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                  (auto-generated if left blank)
                </span>
              </Label>
              <Input
                id="loc-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="bali-fearless-retreat"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc-country" className={sectionLabelClass}>
                Country
              </Label>
              <Input
                id="loc-country"
                value={form.country}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, country: e.target.value }))
                }
                placeholder="Indonesia"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc-city" className={sectionLabelClass}>
                City
              </Label>
              <Input
                id="loc-city"
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="Ubud"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loc-tagline" className={sectionLabelClass}>
              Tagline{" "}
              <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                (optional)
              </span>
            </Label>
            <Input
              id="loc-tagline"
              value={form.tagline}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tagline: e.target.value }))
              }
              placeholder="A short one-liner shown on the location card"
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loc-description" className={sectionLabelClass}>
              Description
            </Label>
            <textarea
              id="loc-description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Full description of the retreat location..."
              className={textareaClass}
            />
          </div>

          {/* Cover image */}
          <div className="space-y-2">
            <Label className={sectionLabelClass}>
              Cover image{" "}
              <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                (optional, JPG / PNG / WEBP)
              </span>
            </Label>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleCoverChange}
            />

            {shownCover ? (
              <div className="relative overflow-hidden rounded-lg border border-[#E9E2D2] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shownCover}
                  alt="Cover preview"
                  className="h-40 w-full object-cover"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={outlineButtonClass}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={outlineButtonClass}
                    onClick={clearCover}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E9E2D2] bg-[#FAF6EE]/50 text-sm text-[#8A8375] transition hover:border-[#C6A34A] hover:text-[#4A4539]"
              >
                <ImagePlus className="h-6 w-6" />
                Click to upload cover image
              </button>
            )}
          </div>

          {/* Promo video */}
          <div className="space-y-2">
            <Label className={sectionLabelClass}>
              Promo video{" "}
              <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                (optional, MP4 / WEBM / MOV, max ~150MB)
              </span>
            </Label>

            <input
              ref={promoVideoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/mpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setPromoVideoFile(file);
                if (file) {
                  setForm((prev) => ({ ...prev, promoVideoUrl: "" }));
                }
              }}
            />

            {promoVideoFile || form.promoVideoUrl ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-[#E9E2D2] bg-white px-3 py-3 text-sm text-[#4A4539]">
                <span className="min-w-0 truncate">
                  {promoVideoFile ? promoVideoFile.name : form.promoVideoUrl}
                </span>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={outlineButtonClass}
                    onClick={() => promoVideoInputRef.current?.click()}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={outlineButtonClass}
                    onClick={clearPromoVideo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => promoVideoInputRef.current?.click()}
                className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E9E2D2] bg-[#FAF6EE]/50 text-sm text-[#8A8375] transition hover:border-[#C6A34A] hover:text-[#4A4539]"
              >
                <Film className="h-5 w-5" />
                Click to upload promo video
              </button>
            )}
          </div>

          {/* Gallery */}
          <div className="space-y-2">
            <Label className={sectionLabelClass}>
              Gallery images{" "}
              <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                (optional, up to 10 new uploads)
              </span>
            </Label>

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleGalleryChange}
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => galleryInputRef.current?.click()}
              className={outlineButtonClass}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Add gallery images
            </Button>

            {isEditing && existingGallery.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-[#8A8375]">Current gallery</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {existingGallery.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-md border border-[#E9E2D2]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryUrl(index)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-sm text-[#4A4539]">
                  <input
                    type="checkbox"
                    checked={replaceGallery}
                    onChange={(e) => setReplaceGallery(e.target.checked)}
                    className="accent-[#C6A34A]"
                  />
                  Replace gallery with new uploads only
                </label>
              </div>
            )}

            {galleryPreviews.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-[#8A8375]">New uploads</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {galleryPreviews.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-md border border-[#E9E2D2]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewGalleryFile(index)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* What's included */}
          <div className="space-y-2">
            <Label className={sectionLabelClass}>
              What&apos;s included{" "}
              <span className="font-normal normal-case tracking-normal text-[#B0A996]">
                (optional, up to 30)
              </span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={includedInput}
                onChange={(e) => setIncludedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIncludedItem();
                  }
                }}
                placeholder="e.g. All meals, then press Add"
                className={inputClass}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addIncludedItem}
                className={outlineButtonClass}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {(form.whatsIncluded ?? []).length > 0 && (
              <ul className="space-y-1.5">
                {(form.whatsIncluded ?? []).map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-md border border-[#E9E2D2] bg-white px-3 py-2 text-sm text-[#4A4539]"
                  >
                    <span className="min-w-0 truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeIncludedItem(index)}
                      className="shrink-0 text-[#B0A996] hover:text-[#B3413E]"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="loc-status" className={sectionLabelClass}>
                Status
              </Label>
              <select
                id="loc-status"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as RetreatLocationStatus,
                  }))
                }
                className="h-9 w-full rounded-md border border-[#E9E2D2] bg-white px-3 text-sm text-[#1C1A16] outline-none focus-visible:border-[#C6A34A]"
              >
                {RETREAT_LOCATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status[0].toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loc-order" className={sectionLabelClass}>
                Display order
              </Label>
              <Input
                id="loc-order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    order: Number(e.target.value),
                  }))
                }
                className={inputClass}
              />
            </div>

            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-sm text-[#4A4539]">
                <input
                  type="checkbox"
                  checked={Boolean(form.isFeatured)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="accent-[#C6A34A]"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-[#4A4539]">
                <input
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="accent-[#C6A34A]"
                />
                Active
              </label>
            </div>
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
                {isEditing ? "Save changes" : "Create location"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
