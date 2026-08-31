// Same warm "Invictus" palette used across the app's admin/member UI.
// Kept as its own copy (rather than importing from the booking feature) so
// the retreat feature has no cross-feature coupling.

export const pageBgClass = "min-h-screen bg-[#FBF9F4]";

export const cardClass = "border-[#E9E2D2] bg-white";

export const cardSurfaceClass =
    "rounded-xl border border-[#E9E2D2] bg-[#FAF6EE] p-5";

export const sectionLabelClass =
    "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C9284]";

export const mutedTextClass = "text-sm text-[#8A8375]";

export const dialogContentClass =
    "w-[calc(100%-2rem)] max-w-2xl overflow-y-auto max-h-[90vh] rounded-xl border-[#E9E2D2] bg-[#FBF9F4] p-6 text-[#1C1A16]";

export const dialogTitleClass =
    "font-[family-name:var(--font-display)] text-lg font-semibold text-[#1C1A16]";

export const dialogDescriptionClass = "text-sm leading-5 text-[#8A8375]";

export const primaryButtonClass =
    "bg-[#C6A34A] text-white hover:bg-[#B8923D] disabled:cursor-not-allowed disabled:bg-[#E9E2D2] disabled:text-[#B0A996]";

export const outlineButtonClass =
    "border-[#E9E2D2] bg-white text-[#4A4539] hover:border-[#C6A34A] hover:bg-[#FBF3DC] hover:text-[#A88A3F]";

export const dangerButtonClass =
    "border-[#F0D3CE] bg-white text-[#B3413E] hover:border-[#E7B6AF] hover:bg-[#FCEEEC]";

export const dangerFilledButtonClass =
    "bg-[#B3413E] text-white hover:bg-[#9C3733]";

export const inputClass =
    "border-[#E9E2D2] bg-white text-[#1C1A16] placeholder:text-[#B0A996] focus-visible:border-[#C6A34A] focus-visible:ring-[#C6A34A]/30";

export const textareaClass =
    "flex min-h-[90px] w-full resize-none rounded-md border border-[#E9E2D2] bg-white px-3 py-2 text-sm text-[#1C1A16] outline-none placeholder:text-[#B0A996] focus-visible:border-[#C6A34A]";

export const tabButtonClass = (active: boolean) =>
    `rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
        active
            ? "bg-[#C6A34A] text-white"
            : "border border-[#E9E2D2] bg-white text-[#4A4539] hover:border-[#C6A34A] hover:text-[#A88A3F]"
    }`;

export const statusBadgeClass = (tone: "neutral" | "gold" | "green" | "red") => {
    const tones: Record<typeof tone, string> = {
        neutral: "bg-[#F0EBDE] text-[#6B6459]",
        gold: "bg-[#F7EFD9] text-[#8A6E22]",
        green: "bg-[#E5F0E3] text-[#3E6B37]",
        red: "bg-[#FCEEEC] text-[#B3413E]",
    };

    return `inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`;
};