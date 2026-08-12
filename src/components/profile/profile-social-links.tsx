"use client";

import { useMemo, useState } from "react";
import { Globe2, Loader2, Plus, Trash2, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

import { UserProfile } from "@/lib/features/profile/profileSlice";
import { deleteSocialLink, updateSocialLink } from "@/lib/features/profile/profileApi";
import { useAppDispatch } from "@/lib/redux/store/hook";

type SocialPlatform = "linkedin" | "facebook" | "twitter" | "instagram" | "website";

const PLATFORM_OPTIONS = [
  {
    value: "facebook" as SocialPlatform,
    label: "Facebook",
    icon: FaFacebookF,
  },
  {
    value: "instagram" as SocialPlatform,
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    value: "linkedin" as SocialPlatform,
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  {
    value: "twitter" as SocialPlatform,
    label: "X / Twitter",
    icon: FaXTwitter,
  },
  {
    value: "website" as SocialPlatform,
    label: "Website",
    icon: Globe2,
  },
];

interface Props {
  profile: UserProfile;
}

const normalizeUrl = (url: string) => {
  const trimmed = url.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

export default function ProfileSocialLinks({ profile }: Props) {
  const dispatch = useAppDispatch();

  const [platform, setPlatform] = useState<SocialPlatform | "">("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const [deletePlatform, setDeletePlatform] = useState<SocialPlatform | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Only show platforms that haven't been added yet
  const availablePlatforms = useMemo(() => {
    return PLATFORM_OPTIONS.filter((item) => !profile.socialLinks?.[item.value]);
  }, [profile.socialLinks]);

  // Existing connected social links
  const existingPlatforms = useMemo(() => {
    return PLATFORM_OPTIONS.filter((item) => !!profile.socialLinks?.[item.value]);
  }, [profile.socialLinks]);

  const handleSave = async () => {
    if (!platform) {
      toast.error("Please select a platform");
      return;
    }

    if (!url.trim()) {
      toast.error("Please enter the profile link");
      return;
    }

    try {
      setSaving(true);

      const normalizedUrl = normalizeUrl(url);

      await dispatch(
        updateSocialLink({
          platform,
          url: normalizedUrl,
        }),
      ).unwrap();

      toast.success("Social link added successfully");

      setPlatform("");
      setUrl("");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to save social link");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePlatform) {
      return;
    }

    try {
      setDeleting(true);

      await dispatch(deleteSocialLink(deletePlatform)).unwrap();

      toast.success("Social link deleted successfully");

      setDeletePlatform(null);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete social link");
    } finally {
      setDeleting(false);
    }
  };

  const deletingPlatformInfo = PLATFORM_OPTIONS.find((item) => item.value === deletePlatform);

  return (
    <>
      {/* SOCIAL LINKS CARD */}
      <div className="h-fit rounded-xl border border-[#302718] bg-[#111] p-6">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs tracking-[3px] text-[#C9A962]">SOCIAL LINKS</h3>

          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#302718] text-[#C9A962]">
            <Plus size={13} />
          </div>
        </div>

        {/* ADD SOCIAL LINK */}
        {availablePlatforms.length > 0 ? (
          <div className="space-y-3">
            {/* PLATFORM SELECT */}
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#777]">
                Platform
              </label>

              <select
                value={platform}
                onChange={(e) => {
                  setPlatform(e.target.value as SocialPlatform | "");
                  setUrl("");
                }}
                className="h-11 w-full cursor-pointer rounded-lg border border-[#302718] bg-[#0B0B0B] px-3 text-sm text-white outline-none transition focus:border-[#C9A962]"
              >
                <option value="">Select platform</option>

                {availablePlatforms.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* URL INPUT */}
            {platform && (
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-[#777]">
                  Profile Link
                </label>

                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !saving) {
                      handleSave();
                    }
                  }}
                  placeholder={platform === "website" ? "yourwebsite.com" : `Enter ${PLATFORM_OPTIONS.find((item) => item.value === platform)?.label} profile URL`}
                  className="h-11 w-full rounded-lg border border-[#302718] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#555] focus:border-[#C9A962]"
                />
              </div>
            )}

            {/* SAVE BUTTON */}
            {platform && (
              <button
                type="button"
                disabled={saving || !url.trim()}
                onClick={handleSave}
                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C9A962] text-xs font-semibold uppercase tracking-[1.5px] text-black transition hover:bg-[#d7bb7a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Link"
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#302718] px-4 py-4 text-center">
            <p className="text-xs text-[#777]">All available social platforms have been added.</p>
          </div>
        )}

        {/* EXISTING / CONNECTED LINKS */}
        {existingPlatforms.length > 0 && (
          <div className="mt-6 border-t border-[#302718] pt-5">
            <p className="mb-3 text-[10px] uppercase tracking-[2px] text-[#777]">
              Connected
            </p>

            <div className="space-y-2">
              {existingPlatforms.map((item) => {
                const Icon = item.icon;
                const socialUrl = profile.socialLinks?.[item.value];

                if (!socialUrl) {
                  return null;
                }

                return (
                  <div
                    key={item.value}
                    className="group flex items-center justify-between gap-2 rounded-lg border border-[#252525] bg-[#0B0B0B] px-3 py-2.5 transition hover:border-[#403621]"
                  >
                    {/* SOCIAL PROFILE LINK */}
                    <a
                      href={socialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#403621] bg-[#15120d] text-[#C9A962] transition group-hover:scale-105 group-hover:border-[#C9A962]">
                        <Icon size={14} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">
                          {item.label}
                        </p>

                        <p className="truncate text-[11px] text-[#666]">
                          {socialUrl}
                        </p>
                      </div>
                    </a>

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setDeletePlatform(item.value)}
                      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#777] transition hover:bg-red-500/10 hover:text-red-500"
                      aria-label={`Delete ${item.label}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {existingPlatforms.length === 0 && (
          <div className="mt-6 rounded-lg border border-dashed border-[#302718] px-4 py-5 text-center">
            <p className="text-xs text-[#666]">No social links added yet.</p>
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deletePlatform && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          onClick={() => {
            if (!deleting) {
              setDeletePlatform(null);
            }
          }}
        >
          <div
            className="relative w-full max-w-md rounded-xl border border-[#302718] bg-[#111] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeletePlatform(null)}
              className="absolute right-4 top-4 cursor-pointer text-[#777] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* DELETE ICON */}
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <Trash2 size={18} />
            </div>

            {/* MODAL CONTENT */}
            <h3 className="mb-2 text-lg font-semibold text-white">
              Delete Social Link?
            </h3>

            <p className="mb-6 text-sm leading-6 text-[#888]">
              Are you sure you want to delete your{" "}
              <span className="font-medium text-white">
                {deletingPlatformInfo?.label}
              </span>{" "}
              link?
            </p>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeletePlatform(null)}
                className="h-10 cursor-pointer rounded-lg border border-[#333] px-5 text-sm text-[#aaa] transition hover:bg-[#1a1a1a] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}