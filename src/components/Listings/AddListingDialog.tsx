"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Plus, ImagePlus, UploadCloud, X } from "lucide-react";

import { RootState } from "@/lib/redux/store/store";
import {
  listingFormSchema,
  ListingFormValues,
} from "@/lib/validations/listings";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Shared classNames so every text/number input and select trigger looks
// consistent: frosted glass surface, soft border, gold focus glow.
const fieldClass =
  "h-11 rounded-lg border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 " +
  "backdrop-blur-sm transition-colors focus-visible:border-gold/60 " +
  "focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:ring-offset-0";

const fileFieldClass =
  "h-auto rounded-lg border border-dashed border-white/15 bg-white/[0.03] text-white/70 " +
  "backdrop-blur-sm py-3 px-3 cursor-pointer transition-colors hover:border-gold/50 " +
  "file:mr-3 file:rounded-full file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 " +
  "file:text-xs file:font-medium file:uppercase file:tracking-wider file:text-gold " +
  "hover:file:bg-gold/25";

interface AddListingDialogProps {
  onSubmit: (formData: FormData) => Promise<void> | void;
}

// Creates (and cleans up) a blob preview URL for a single File.
function useObjectUrl(file: File | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}

function CoverImageField({
  value,
  onChange,
}: {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
}) {
  const previewUrl = useObjectUrl(value);

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Cover preview"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90 transition"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          className={`${fileFieldClass} flex items-center justify-center gap-2 text-sm cursor-pointer`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0])}
          />
          <ImagePlus size={16} className="text-gold" />
          Click to choose a cover image
        </label>
      )}
    </div>
  );
}

function GalleryImagesField({
  value,
  onChange,
}: {
  value: File[];
  onChange: (files: File[]) => void;
}) {
  function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    onChange([...value, ...newFiles]);
    e.target.value = ""; // allow re-selecting the same file later
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <label
        className={`${fileFieldClass} flex items-center justify-center gap-2 text-sm cursor-pointer`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleAdd}
        />
        <UploadCloud size={16} className="text-gold" />
        {value.length > 0
          ? `${value.length} image${value.length > 1 ? "s" : ""} selected — add more`
          : "Click to select images (multiple allowed)"}
      </label>

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((file, i) => (
            <GalleryThumb
              key={`${file.name}-${i}`}
              file={file}
              onRemove={() => handleRemove(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryThumb({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const previewUrl = useObjectUrl(file);

  return (
    <div className="group relative aspect-square rounded-md overflow-hidden border border-white/10">
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={file.name}
          className="h-full w-full object-cover"
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 group-hover:opacity-100 transition"
      >
        <X size={12} />
      </button>
    </div>
  );
}

export function AddListingDialog({ onSubmit }: AddListingDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // TODO: adjust this path to match your real auth slice shape.
  const associateId = useSelector(
    (s: RootState) => (s as any).registration?.user?.id ?? null,
  );

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      ref_code: "",
      bedrooms: 0,
      bathrooms: 0,
      area_sqm: 0,
      city: "",
      region: "",
      country: "",
      price_amount: 0,
      price_currency: "EUR",
      referral_commission_offered: 0,
    },
  });

  async function handleSubmit(values: ListingFormValues) {
    // if (!associateId) {
    //   form.setError("root", {
    //     message: "Could not determine your associate ID. Please re-login.",
    //   });
    //   return;
    // }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("ref_code", values.ref_code);
    formData.append("status", values.status);
    formData.append("bedrooms", String(values.bedrooms));
    formData.append("bathrooms", String(values.bathrooms));
    formData.append("area_sqm", String(values.area_sqm));
    formData.append("associate_id", associateId);

    formData.append(
      "location",
      JSON.stringify({
        city: values.city,
        region: values.region,
        country: values.country,
      }),
    );
    formData.append(
      "price",
      JSON.stringify({
        amount: values.price_amount,
        currency: values.price_currency,
      }),
    );
    formData.append(
      "referral_commission",
      JSON.stringify({ offered_amount: values.referral_commission_offered }),
    );

    formData.append("cover_image", values.cover_image);

    values.images.forEach((file: any) => {
      formData.append("images", file);
    });

    try {
      setSubmitting(true);

      console.log("===== FormData =====");

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,
            type: value.type,
            size: value.size,
          });
        } else {
          console.log(key, value);
        }
      }

      await onSubmit(formData);
      form.reset();

      // setOpen(false);
    } catch (err) {
      form.setError("root", {
        message: "Failed to create listing. Please try again.",
      });
    } finally {
      setSubmitting(false);
      console.log("[AddListingDialog] submitted formData:", formData);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 font-ui text-[11px] tracking-[0.22em] uppercase text-primary-foreground font-medium transition hover:brightness-110 duration-200 cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Listing
        </button>
      </DialogTrigger>

      <DialogContent
        className="w-[95vw] sm:max-w-2xl lg:max-w-3xl max-h-[88vh] overflow-y-auto
          border border-gold-soft/60 bg-[#111111]/70 backdrop-blur-2xl
          shadow-[0_20px_70px_-20px_rgba(0,0,0,0.7)] text-white
          supports-[backdrop-filter]:bg-[#111111]/55"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl sm:text-3xl text-white">
            Add Listing
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new property to your inventory. Your associate ID is attached
            automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 pt-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Villa Crépuscule"
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ref_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Reference Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="WE-3040"
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                    Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={`${fieldClass} w-full`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-white/10 bg-[#161616]/95 backdrop-blur-xl text-white">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Bedrooms
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className={fieldClass}
                        onChange={(e) => onChange(e.target.valueAsNumber)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Bathrooms
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className={fieldClass}
                        onChange={(e) => onChange(e.target.valueAsNumber)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area_sqm"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Area (m²)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className={fieldClass}
                        onChange={(e) => onChange(e.target.valueAsNumber)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cap Ferrat"
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Region
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Côte d'Azur"
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="France"
                        className={fieldClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              <FormField
                control={form.control}
                name="price_amount"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        className={fieldClass}
                        onChange={(e) => onChange(e.target.valueAsNumber)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Currency
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={`${fieldClass} w-full`}>
                          <SelectValue placeholder="EUR" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-white/10 bg-[#161616]/95 backdrop-blur-xl text-white">
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referral_commission_offered"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                      Commission %
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        className={fieldClass}
                        onChange={(e) => onChange(e.target.valueAsNumber)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <FormField
                control={form.control}
                name="cover_image"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <ImagePlus size={13} className="text-gold" />
                      Cover Image
                    </FormLabel>
                    <FormControl>
                      <CoverImageField value={value} onChange={onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className="text-white/70 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <UploadCloud size={13} className="text-gold" />
                      Gallery Images
                    </FormLabel>
                    <FormControl>
                      <GalleryImagesField
                        value={value ?? []}
                        onChange={onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root && (
              <p className="text-sm text-red-400">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter className="pt-2 gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-gold text-primary-foreground hover:brightness-110"
              >
                {submitting ? "Saving..." : "Save Listing"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
