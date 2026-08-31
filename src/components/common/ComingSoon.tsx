"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

interface ComingSoonProps {
    /** Main heading. Defaults to "Coming Soon". */
    title?: string;
    /** Supporting copy under the title. */
    description?: string;
    /** Small pill label above the title. Defaults to "Coming Soon". */
    eyebrow?: string;
    /** Lucide icon shown in the badge circle. Defaults to Sparkles. */
    icon?: ComponentType<{ size?: number; className?: string }>;
    /** Optional CTA — e.g. link back to the dashboard. Omit to hide. */
    actionLabel?: string;
    actionHref?: string;
    /** Renders inside a bordered card instead of full-bleed. Useful when
     * dropping this into an existing page section rather than using it as
     * the entire page body. */
    variant?: "page" | "card";
    className?: string;
}

export default function ComingSoon({
    title = "Coming Soon",
    description = "We're building this out. Check back soon — it'll be worth the wait.",
    eyebrow = "Coming Soon",
    icon: Icon = Sparkles,
    actionLabel,
    actionHref,
    variant = "page",
    className = "",
}: ComingSoonProps) {
    const content = (
        <div className="flex flex-col items-center px-6 py-16 text-center sm:py-20">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-[#F7EFD9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A6E22]">
                <Sparkles size={12} />
                {eyebrow}
            </span>

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#EFE1BD] bg-[#FAF6EE]">
                <Icon size={28} className="text-[#C6A34A]" />
            </div>

            <h1 className="max-w-md font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1C1A16] sm:text-3xl">
                {title}
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#8A8375]">
                {description}
            </p>

            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#C6A34A] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#B8923D]"
                >
                    <ArrowLeft size={14} />
                    {actionLabel}
                </Link>
            )}
        </div>
    );

    if (variant === "card") {
        return (
            <div
                className={`rounded-xl border border-dashed border-[#E9E2D2] bg-[#FBF9F4] ${className}`}
            >
                {content}
            </div>
        );
    }

    return (
        <div
            className={`flex min-h-[70vh] items-center justify-center bg-[#FBF9F4] ${className}`}
        >
            {content}
        </div>
    );
}
