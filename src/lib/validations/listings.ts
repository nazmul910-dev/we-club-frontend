import { z } from "zod";

// Guard against SSR: FileList only exists in the browser. During server
// render this schema key just accepts anything; react-hook-form only
// actually validates client-side anyway.
const singleFileSchema =
  typeof window === "undefined"
    ? z.any()
    : z.instanceof(File);

const multipleFilesSchema =
  typeof window === "undefined"
    ? z.any()
    : z.array(z.instanceof(File)).min(1, {
        message: "At least one image is required.",
      });

export const listingFormSchema = z.object({
  title: z.string().min(2, "Title is required."),
  ref_code: z.string().min(2, "Reference code is required."),
  status: z.enum(["active", "pending", "sold"], {
    error: "Select a status.",
  }),
  bedrooms: z.number().int().min(0, "Must be 0 or more."),
  bathrooms: z.number().int().min(0, "Must be 0 or more."),
  area_sqm: z.number().positive("Must be greater than 0."),

  city: z.string().min(1, "City is required."),
  region: z.string().min(1, "Region is required."),
  country: z.string().min(1, "Country is required."),

  price_amount: z.number().positive("Must be greater than 0."),
  price_currency: z.enum(["EUR", "USD", "GBP"], {
    error: "Select a currency.",
  }),

  referral_commission_offered: z
    .number()
    .min(0, "Must be 0 or more.")
    .max(100, "Must be 100 or less."),

  cover_image: singleFileSchema,
  images: multipleFilesSchema,

  // associate_id intentionally excluded — it's attached server-side / from
  // the authenticated session at submit time, never user-entered.
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;