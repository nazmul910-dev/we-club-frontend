// components/profile/profile-header-card.tsx
import type { ProfileIdentity } from "@/lib/data/profile";
export function ProfileHeaderCard({ identity }: { identity: ProfileIdentity }) {
  return (
    <div className="rounded-2xl border border-[#26261f] bg-[#111112] px-8 py-7 flex items-center justify-between gap-6 flex-wrap">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full border border-[#c9a962]/50 flex items-center justify-center shrink-0 bg-[#0d0d0e]">
          {identity.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={identity.avatarUrl}
              alt={identity.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span
              className="text-lg text-[#c9a962]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {identity.initials}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2
              className="text-2xl text-[#ece9e2] leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {identity.name}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1f4a3a] bg-[#0f2620] px-2.5 py-1 text-[10px] tracking-widest text-[#5eead4] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5eead4]" />
              {identity.role}
            </span>
          </div>
          <p className="mt-1.5 text-sm italic text-[#8f8f87]">
            &ldquo;{identity.quote}&rdquo;
          </p>
        </div>
      </div>

      <button
        type="button"
        className="shrink-0 rounded-full border border-[#c9a962]/50 px-5 py-2 text-[11px] tracking-widest uppercase text-[#c9a962] hover:bg-[#c9a962]/10 transition-colors"
      >
        Edit Avatar
      </button>
    </div>
  );
}