import { z } from "zod";

export const MARKETING_CHANNELS = [
  { value: "social_media", label: "Social Media" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "referral_network", label: "Referral Network" },
  { value: "print_media", label: "Print Media" },
] as const;

export const promoteRequestSchema = z.object({
  proposed_commission_pct: z
    .number()
    .min(0, "Must be 0 or more.")
    .max(100, "Must be 100 or less."),
  marketing_channels: z
    .array(z.string())
    .min(1, "Select at least one channel."),
  message: z
    .string()
    .min(10, "Tell them a bit more — at least 10 characters.")
    .max(500, "Keep it under 500 characters."),
});

export type PromoteRequestValues = z.infer<typeof promoteRequestSchema>;