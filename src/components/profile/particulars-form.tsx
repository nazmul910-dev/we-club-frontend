"use client";

import { useState, useTransition } from "react";
import type { ProfileParticulars } from "@/lib/data/profile";
import { updateProfile } from "@/lib/actions/profile";

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-widest uppercase text-[#8a8a82] mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#2a2a26] bg-[#0d0d0e] px-3.5 py-2.5 text-sm text-[#e8e6df] outline-none focus:border-[#c9a962]/60 transition-colors"
      />
    </label>
  );
}

export function ParticularsForm({
  userId,
  initialData,
}: {
  userId: string;
  initialData: ProfileParticulars;
}) {
  const [saved, setSaved] = useState(initialData);
  const [draft, setDraft] = useState(initialData);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isDirty = JSON.stringify(saved) !== JSON.stringify(draft);

  function set<K extends keyof ProfileParticulars>(key: K, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleDiscard() {
    setDraft(saved);
    setError(null);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateProfile(userId, draft);
      if (result.success) {
        setSaved(draft);
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[#26261f] bg-[#111112] px-7 py-6">
      <h3 className="text-[11px] tracking-widest uppercase text-[#c9a962] mb-6">
        Particulars
      </h3>

      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Full Name"
            value={draft.fullName}
            onChange={(v) => set("fullName", v)}
          />
          <Field label="Title" value={draft.title} onChange={(v) => set("title", v)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Email"
            type="email"
            value={draft.email}
            onChange={(v) => set("email", v)}
          />
          <Field label="Phone" value={draft.phone} onChange={(v) => set("phone", v)} />
        </div>

        <Field
          label="Based In"
          value={draft.basedIn}
          onChange={(v) => set("basedIn", v)}
        />

        <label className="block">
          <span className="block text-[10px] tracking-widest uppercase text-[#8a8a82] mb-2">
            Biography
          </span>
          <textarea
            value={draft.biography}
            onChange={(e) => set("biography", e.target.value)}
            rows={3}
            className="w-full resize-none rounded-md border border-[#2a2a26] bg-[#0d0d0e] px-3.5 py-2.5 text-sm text-[#e8e6df] outline-none focus:border-[#c9a962]/60 transition-colors"
          />
        </label>
      </div>

      {error && <p className="mt-4 text-xs text-red-400">{error}</p>}

      <div className="mt-6 flex items-center justify-end gap-3">
        {isDirty && !isPending && (
          <span className="text-xs text-[#8a8a82] mr-auto">Unsaved changes</span>
        )}
        <button
          type="button"
          onClick={handleDiscard}
          disabled={!isDirty || isPending}
          className="rounded-full border border-[#3a3a36] px-5 py-2 text-[11px] tracking-widest uppercase text-[#cfcfc8] hover:bg-white/5 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isPending}
          className="rounded-full bg-[#c9a962] px-5 py-2 text-[11px] tracking-widest uppercase font-medium text-[#1a1608] hover:bg-[#d8ba76] transition-colors disabled:opacity-40 disabled:hover:bg-[#c9a962]"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}