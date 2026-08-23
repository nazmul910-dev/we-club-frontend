"use client";

import { useMemo, useState } from "react";

import { Globe2, Plus, Trash2, X, Loader2 } from "lucide-react";

import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import { toast } from "sonner";

import { useAppDispatch } from "@/lib/redux/store/hook";

import {
  updateSocialLink,
  deleteSocialLink,
} from "@/lib/features/profile/profileApi";

type Platform = "linkedin" | "facebook" | "twitter" | "instagram" | "website";

const PLATFORMS = [
  {
    value: "linkedin" as Platform,
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },

  {
    value: "facebook" as Platform,
    label: "Facebook",
    icon: FaFacebookF,
  },

  {
    value: "instagram" as Platform,
    label: "Instagram",
    icon: FaInstagram,
  },

  {
    value: "twitter" as Platform,
    label: "X / Twitter",
    icon: FaXTwitter,
  },

  {
    value: "website" as Platform,
    label: "Website",
    icon: Globe2,
  },
];

export default function ProfileSocialLinks({ profile }: any) {
  const dispatch = useAppDispatch();

  const [platform, setPlatform] = useState<Platform | "">("");

  const [url, setUrl] = useState("");

  const [saving, setSaving] = useState(false);

  const [deleteItem, setDeleteItem] = useState<Platform | null>(null);

  const [deleting, setDeleting] = useState(false);

  const available = useMemo(() => {
    return PLATFORMS.filter((item) => !profile.socialLinks?.[item.value]);
  }, [profile.socialLinks]);

  const connected = useMemo(() => {
    return PLATFORMS.filter((item) => profile.socialLinks?.[item.value]);
  }, [profile.socialLinks]);

  const normalize = (value: string) => {
    if (value.startsWith("http")) return value;

    return `https://${value}`;
  };

  const save = async () => {
    if (!platform) {
      toast.error("Select platform");

      return;
    }

    if (!url) {
      toast.error("Enter profile link");

      return;
    }

    try {
      setSaving(true);

      await dispatch(
        updateSocialLink({
          platform,

          url: normalize(url),
        }),
      ).unwrap();

      toast.success("Social link added");

      setPlatform("");

      setUrl("");
    } catch {
      toast.error("Failed to save link");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteItem) return;

    try {
      setDeleting(true);

      await dispatch(deleteSocialLink(deleteItem)).unwrap();

      toast.success("Social link removed");

      setDeleteItem(null);
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-[#E8E0D2] rounded-2xl p-8 h-fit">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs tracking-[4px] uppercase text-[#C9A962]">
            SOCIAL LINKS
          </h3>

          <div className="w-8 h-8 rounded-full border border-[#E8E0D2] flex items-center justify-center text-[#C9A962]">
            <Plus size={14} />
          </div>
        </div>

        {available.length > 0 && (
          <div className="space-y-4">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full h-12 rounded-lg border border-[#E8E0D2] px-4 text-sm outline-none focus:border-[#C9A962]"
            >
              <option value="">Select Platform</option>

              {available.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {platform && (
              <>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Profile URL"
                  className="w-full h-12 rounded-lg border border-[#E8E0D2] px-4 text-sm outline-none focus:border-[#C9A962]"
                />

                <button
                  disabled={saving}
                  onClick={save}
                  className="w-full h-12 rounded-full bg-[#C9A962] text-white text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save Link"
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {connected.length > 0 && (
          <div className="mt-8 space-y-3">
            <p className="text-[10px] tracking-[3px] uppercase text-[#999]">
              CONNECTED
            </p>

            {connected.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.value}
                  className="flex items-center justify-between border border-[#EEE7DA] rounded-xl p-4"
                >
                  <a
                    href={profile.socialLinks[item.value]}
                    target="_blank"
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F8F6F1] flex items-center justify-center text-[#C9A962]">
                      <Icon size={16} />
                    </div>

                    <div>
                      <p className="text-sm text-[#111]">{item.label}</p>

                      <p className="text-xs text-[#999] max-w-[180px] truncate">
                        {profile.socialLinks[item.value]}
                      </p>
                    </div>
                  </a>

                  <button
                    onClick={() => setDeleteItem(item.value)}
                    className="text-[#999] hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {connected.length === 0 && (
          <div className="mt-6 border border-dashed border-[#E8E0D2] rounded-xl p-6 text-center text-xs text-[#999]">
            No social links added yet.
          </div>
        )}
      </div>

      {deleteItem && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-5">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-[#E8E0D2]">
            <button onClick={() => setDeleteItem(null)} className="float-right">
              <X />
            </button>

            <h2 className="text-xl font-serif text-[#111]">
              Delete Social Link?
            </h2>

            <p className="mt-4 text-sm text-[#666]">
              Are you sure you want to remove this social link?
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setDeleteItem(null)}
                className="flex-1 h-11 rounded-full border border-[#E8E0D2] text-sm"
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={remove}
                className="flex-1 h-11 rounded-full bg-red-600 text-white text-sm flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
