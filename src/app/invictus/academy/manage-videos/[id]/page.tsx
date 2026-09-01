"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Archive,
  Award,
  Calendar,
  Clock,
  Crown,
  Edit,
  Film,
  Hash,
  ListOrdered,
  Percent,
  PlayCircle,
  Unlock,
  User,
} from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import {
  archiveVideo,
  clearSelectedVideo,
  draftVideo,
  fetchVideoById,
  publishVideo,
} from "@/lib/features/invictus/academy/video-module/videoSlice";

import EditVideoModal from "@/components/invictus/academy/videos/EditVideoModal";

export default function VideoDetailsPage() {
  return (
    <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
      <VideoDetailsContent />
    </AuthGuard>
  );
}

const statusBadgeClass: Record<string, string> = {
  draft: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  published: "bg-green-100 text-green-700 hover:bg-green-100",
  archived: "bg-gray-200 text-gray-600 hover:bg-gray-200",
};

const uploadStatusBadgeClass: Record<string, string> = {
  ready: "bg-green-100 text-green-700 hover:bg-green-100",
  processing: "bg-[#F3E9D2] text-[#B08A3E] hover:bg-[#F3E9D2]",
  failed: "bg-red-100 text-red-600 hover:bg-red-100",
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatBytes = (bytes?: number) => {
  if (!bytes) return "—";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getActorName = (
  actor?: string | { fullName?: string; email?: string } | null,
) => {
  if (!actor) return "—";
  if (typeof actor === "string") return actor;
  return actor.fullName || actor.email || "—";
};

function VideoDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const videoId = params.id as string;

  const { selectedVideo: video, loading, error } = useAppSelector(
    (state) => state.video,
  );

  const [editOpen, setEditOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (videoId) {
      dispatch(fetchVideoById(videoId));
    }

    return () => {
      dispatch(clearSelectedVideo());
    };
  }, [videoId, dispatch]);

  const handleStatus = async (checked: boolean) => {
    if (!video) return;
    try {
      setActionLoading(true);
      if (checked) {
        await dispatch(publishVideo(video._id)).unwrap();
      } else {
        await dispatch(draftVideo(video._id)).unwrap();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };



  const handleArchive = async () => {
    if (!video) return;
    const confirmed = window.confirm(
      `Archive "${video.title}"? Archived videos are hidden from members and can no longer be edited or published. This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await dispatch(archiveVideo(video._id)).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <p className="text-sm text-[#8A8175]">Loading video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="mx-auto max-w-[1180px] px-[6vw] py-[4vw] sm:px-8">
        <button
          onClick={() => router.push("/invictus/academy/manage-videos")}
          className="flex items-center gap-2 text-sm text-[#8A8175] cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Module Videos
        </button>

        <div className="mt-6 rounded-2xl border border-[#E8DDCA] bg-white p-8 text-center text-[#8A8175]">
          {error || "This video could not be found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
      <button
        onClick={() => router.push("/invictus/academy/manage-videos")}
        className="flex items-center gap-2 text-sm text-[#8A8175] cursor-pointer hover:text-[#B18A3A]"
      >
        <ArrowLeft size={16} />
        Back to Module Videos
      </button>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[4px] text-[#B18A3A] font-semibold">
            INVICTUS ACADEMY · MODULE VIDEO
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
            {video.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={statusBadgeClass[video.status]}>
              {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
            </Badge>

            {video.isPaid ? (
              <Badge className="flex w-fit items-center gap-1 bg-[#1C1A17] text-[#F3E9D2] hover:bg-[#1C1A17]">
                <Crown size={12} />
                Premium
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                Free
              </Badge>
            )}

            <Badge className={uploadStatusBadgeClass[video.uploadStatus]}>
              Upload: {video.uploadStatus}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer border-[#E8DDCA]"
            disabled={video.status === "archived"}
            onClick={() => setEditOpen(true)}
          >
            <Edit size={16} className="mr-1.5" />
            Edit
          </Button>

          <Button
            variant="outline"
            className="cursor-pointer border-[#E8DDCA] text-red-500"
            disabled={video.status === "archived" || actionLoading}
            onClick={handleArchive}
          >
            <Archive size={16} className="mr-1.5" />
            Archive
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* LEFT: PLAYER + DESCRIPTION */}
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-[#E8DDCA] bg-black">
            {video.secureUrl || video.playbackUrl ? (
              <video
                src={video.playbackUrl || video.secureUrl}
                controls
                poster={video.thumbnailUrl}
                className="aspect-video w-full bg-black"
              />
            ) : (
              <div className="flex aspect-video cursor-pointer w-full items-center justify-center text-gray-400">
                <PlayCircle size={40} />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#B18A3A]">
              Description
            </h3>

            <p className="mt-3 whitespace-pre-line text-sm text-[#4A4238]">
              {video.description || "No description added for this video yet."}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#B18A3A]">
              Course Module
            </h3>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="rounded-xl bg-[#F5ECD8] px-4 py-2 text-sm text-[#B18A3A]">
                {video.module?.title || "—"}
              </div>

              {video.module?.pillar?.name && (
                <div className="rounded-xl bg-[#1C1A17] px-4 py-2 text-sm text-[#F3E9D2]">
                  {video.module.pillar.name}
                </div>
              )}

              {video.module?.moduleNumber !== undefined && (
                <span className="text-sm text-[#8A8175]">
                  Module #{video.module.moduleNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: STATUS + META */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#B18A3A]">
              Publish Status
            </h3>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-[#4A4238]">
                {video.status === "published"
                  ? "Visible to members"
                  : "Hidden from members"}
              </span>

              <Switch
                className="cursor-pointer"
                checked={video.status === "published"}
                disabled={video.status === "archived" || actionLoading}
                onCheckedChange={handleStatus}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#B18A3A]">
              Lesson Details
            </h3>

            <div className="mt-4 space-y-4 text-sm">
              <MetaRow
                icon={<ListOrdered size={16} />}
                label="Order"
                value={String(video.order)}
              />
              <MetaRow
                icon={<Clock size={16} />}
                label="Duration"
                value={formatDuration(video.durationSeconds)}
              />
              <MetaRow
                icon={<Percent size={16} />}
                label="Required Watch"
                value={`${video.requiredWatchPercent}%`}
              />
              <MetaRow
                icon={<Award size={16} />}
                label="Points Reward"
                value={String(video.pointsReward)}
              />
              <MetaRow
                icon={video.isPaid ? <Crown size={16} /> : <Unlock size={16} />}
                label="Access"
                value={video.isPaid ? "Premium" : "Free"}
              />
              <MetaRow
                icon={<Hash size={16} />}
                label="Required Lesson"
                value={video.isRequired ? "Yes" : "No"}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#B18A3A]">
              File Info
            </h3>

            <div className="mt-4 space-y-4 text-sm">
              <MetaRow
                icon={<Film size={16} />}
                label="Format"
                value={video.format?.toUpperCase() || "—"}
              />
              <MetaRow label="Size" value={formatBytes(video.bytes)} />
              <MetaRow
                label="Resolution"
                value={
                  video.width && video.height
                    ? `${video.width} × ${video.height}`
                    : "—"
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#B18A3A]">
              Activity
            </h3>

            <div className="mt-4 space-y-4 text-sm">
              <MetaRow
                icon={<User size={16} />}
                label="Uploaded By"
                value={getActorName(video.uploadedBy)}
              />
              <MetaRow
                icon={<User size={16} />}
                label="Updated By"
                value={getActorName(video.updatedBy)}
              />
              <MetaRow
                icon={<Calendar size={16} />}
                label="Created"
                value={formatDate(video.createdAt)}
              />
              <MetaRow
                icon={<Calendar size={16} />}
                label="Last Updated"
                value={formatDate(video.updatedAt)}
              />
              {video.publishedAt && (
                <MetaRow
                  icon={<Calendar size={16} />}
                  label="Published"
                  value={formatDate(video.publishedAt)}
                />
              )}
              {video.archivedAt && (
                <MetaRow
                  icon={<Calendar size={16} />}
                  label="Archived"
                  value={formatDate(video.archivedAt)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <EditVideoModal open={editOpen} video={video} onClose={() => setEditOpen(false)} />
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#F0E8DB] pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-[#8A8175]">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium text-[#171717]">{value}</span>
    </div>
  );
}
