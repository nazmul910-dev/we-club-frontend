"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";

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
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MARKETING_CHANNELS, promoteRequestSchema, PromoteRequestValues } from "@/lib/validations/PromoteRequest";


const fieldClass =
  "h-11 rounded-lg border-white/10 bg-white/[0.04] text-white placeholder:text-white/30 " +
  "backdrop-blur-sm transition-colors focus-visible:border-gold/60 " +
  "focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:ring-offset-0";

interface ListingsPromoteModalProps {
  listingId: string;
  // When set, the trigger renders as a disabled button with a tooltip
  // explaining why, and the dialog never opens — no listingId/form logic
  // runs at all in this state.
  disabled?: boolean;
  disabledReason?: string;
  // Called with { listing_id, ...formValues } — dispatch your create-promote-request
  // thunk inside here.
  onSubmit: (payload: {
    listing_id: string;
    proposed_commission_pct: number;
    marketing_channels: string[];
    message: string;
  }) => Promise<void> | void;
}

const ListingsPromoteModal = ({
  listingId,
  onSubmit,
  disabled = false,
  disabledReason,
}: ListingsPromoteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const form = useForm<PromoteRequestValues>({
    resolver: zodResolver(promoteRequestSchema),
    defaultValues: {
      proposed_commission_pct: 0,
      marketing_channels: [],
      message: "",
    },
  });

  function toggleChannel(value: string, current: string[]) {
    return current.includes(value)
      ? current.filter((c) => c !== value)
      : [...current, value];
  }

  async function handleSubmit(values: PromoteRequestValues) {
    try {
      setSubmitting(true);
      await onSubmit({ listing_id: listingId, ...values });
      setSucceeded(true);
    } catch (err: any) {
      // err here is whatever `.unwrap()` throws in your onSubmit — pass your
      // ApiError object through (see note below) so we can branch on it.
      const apiError = err?.message ? err : { message: String(err) };

      if (apiError.status === 401) {
        form.setError("root", {
          message: "Your session expired. Please log in again.",
        });
      } else if (apiError.status === 409 || apiError.code === "DUPLICATE_REQUEST") {
        form.setError("root", {
          message: "You've already sent a promote request for this listing.",
        });
      } else if (apiError.fieldErrors) {
        // Map server-side per-field validation errors onto the matching
        // form fields instead of one generic banner.
        Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
          if (field in form.getValues()) {
            form.setError(field as keyof PromoteRequestValues, {
              message: String(message),
            });
          }
        });
      } else {
        form.setError("root", {
          message: apiError.message ?? "Failed to send promote request. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      // Reset everything once the dialog fully closes so a fresh open starts clean.
      setTimeout(() => {
        form.reset();
        setSucceeded(false);
      }, 200);
    }
  }

  if (disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger >
            {/* A disabled <button> fires no pointer/focus events in most
                browsers, which breaks hover tooltips — wrapping it in a
                span keeps the tooltip working while the button itself
                stays visually and functionally disabled. */}
            <span className="flex-1 inline-block" tabIndex={0}>
              <button
                type="button"
                disabled
                className="w-full rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-ui text-[10px] tracking-[0.22em] uppercase text-white/30 cursor-not-allowed text-center"
              >
                Request to Promote
              </button>
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1a1a1a] border-white/10 text-white text-xs max-w-[220px]">
            {disabledReason ?? "Promoting this listing isn't available right now."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger className="flex-1 rounded-full border border-gold/60 bg-transparent px-3 py-2 font-ui text-[10px] tracking-[0.22em] uppercase text-gold hover:bg-gold/10 transition duration-200 cursor-pointer text-center">
        Request to Promote
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-lg border border-gold-soft/60 bg-[#111111]/80 backdrop-blur-2xl
          shadow-[0_20px_70px_-20px_rgba(0,0,0,0.7)] text-white"
      >
        {succeeded ? (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <CheckCircle2 size={48} className="text-gold" strokeWidth={1.5} />
            <div>
              <h3 className="font-display text-2xl text-white">Request Sent</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Your promote request has been submitted. You can track its
                status from your listings dashboard.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                Close
              </Button>
              <Button
                
                className="rounded-full bg-gold text-primary-foreground hover:brightness-110"
              >
                <Link href="/dashboard/manage-listings">Go to My Listings</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-white">
                Request to Promote
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Propose your commission and how you plan to market this
                listing to your network.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5 pt-1"
              >
                <FormField
                  control={form.control}
                  name="proposed_commission_pct"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                        Proposed Commission %
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

                <FormField
                  control={form.control}
                  name="marketing_channels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                        Marketing Channels
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {MARKETING_CHANNELS.map((channel) => {
                            const active = field.value.includes(channel.value);
                            return (
                              <button
                                key={channel.value}
                                type="button"
                                onClick={() =>
                                  field.onChange(
                                    toggleChannel(channel.value, field.value)
                                  )
                                }
                                className={`rounded-full border px-3.5 py-1.5 text-[11px] tracking-wide uppercase transition-colors ${
                                  active
                                    ? "border-gold bg-gold/15 text-gold"
                                    : "border-white/15 bg-white/[0.03] text-white/60 hover:border-white/30"
                                }`}
                              >
                                {channel.label}
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70 text-xs uppercase tracking-wider">
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="I would like to promote this listing to my network of qualified buyers."
                          className={`${fieldClass} h-auto resize-none py-2.5`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <p className="text-sm text-red-400">
                    {form.formState.errors.root.message}
                  </p>
                )}

                <DialogFooter className="pt-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
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
                    {submitting ? "Sending..." : "Send Request"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ListingsPromoteModal;