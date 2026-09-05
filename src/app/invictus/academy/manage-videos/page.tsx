"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Check,
  ChevronsUpDown,
  Crown,
  PlayCircle,
  Plus,
  Unlock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchVideos } from "@/lib/features/invictus/academy/video-module/videoSlice";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

import VideoTable from "@/components/invictus/academy/videos/VideoTable";
import CreateVideoModal from "@/components/invictus/academy/videos/CreateVideoModal";
import EditVideoModal from "@/components/invictus/academy/videos/EditVideoModal";
import TableSkeleton from "@/components/skeleton/Tableskeleton";

export default function ManageVideosPage() {
  return (
    <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
      <ManageVideosContent />
    </AuthGuard>
  );
}

function ManageVideosContent() {
  const dispatch = useAppDispatch();

  const { videos, loading, error } = useAppSelector((state) => state.video);

  const [courses, setCourses] = useState<ICourseModule[]>([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [courseFilterSearch, setCourseFilterSearch] = useState("");
  const [courseFilterOpen, setCourseFilterOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<IModuleVideo | null>(null);

  const loadCourses = useCallback(async () => {
    try {
      const res = await courseApi.getCourses();
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchVideos({ includeArchived: true }));
    const timeoutId = window.setTimeout(() => {
      void loadCourses();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [dispatch, loadCourses]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredVideos = useMemo(() => {
    if (!courseFilter) return videos;
    return videos.filter((video) => video.module?._id === courseFilter);
  }, [videos, courseFilter]);

  const stats = useMemo(() => {
    const total = videos.length;
    const free = videos.filter((v) => !v.isPaid).length;
    const premium = videos.filter((v) => v.isPaid).length;
    return { total, free, premium };
  }, [videos]);

  return (
    <div className="page-wrapper">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[4px] text-[#B18A3A] font-semibold">
            INVICTUS ACADEMY
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
            Module Videos
          </h1>

          <p className="mt-2 text-sm text-[#8A8175]">
            Upload and manage lesson videos across course modules
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#B18A3A] px-5 py-2.5 text-sm text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(177,138,58,.25)]"
        >
          <Plus size={16} />
          Upload Video
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <StatCard
          icon={<PlayCircle />}
          title="Total Videos"
          value={String(stats.total)}
        />
        <StatCard
          icon={<Unlock />}
          title="Free Videos"
          value={String(stats.free)}
        />
        <StatCard
          icon={<Crown />}
          title="Premium Videos"
          value={String(stats.premium)}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="w-full max-w-xs">
          <Popover
            open={courseFilterOpen}
            onOpenChange={(open) => {
              setCourseFilterOpen(open);
              if (!open) setCourseFilterSearch("");
            }}
          >
            <PopoverTrigger className="block w-full">
              <Button
                type="button"
                variant="outline"
                className="h-auto min-h-12 w-full justify-between rounded-xl border-[#E8DDCA] bg-white p-3 text-left text-sm font-normal"
              >
                <span className={cn(!courseFilter && "text-muted-foreground")}>
                  {courseFilter
                    ? courses.find((course) => course._id === courseFilter)
                        ?.title
                    : "All Courses"}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--anchor-width)] p-0"
              align="start"
            >
              <Command>
                <CommandInput
                  value={courseFilterSearch}
                  onValueChange={setCourseFilterSearch}
                  placeholder="Search courses..."
                />
                <CommandList>
                  <CommandEmpty>No courses found.</CommandEmpty>
                  <CommandItem
                    value="all courses"
                    onSelect={() => {
                      setCourseFilter("");
                      setCourseFilterOpen(false);
                      setCourseFilterSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        !courseFilter ? "opacity-100" : "opacity-0",
                      )}
                    />
                    All Courses
                  </CommandItem>
                  {courses.map((course) => (
                    <CommandItem
                      key={course._id}
                      value={`${course.title} ${course.pillar?.name ?? ""}`}
                      onSelect={() => {
                        setCourseFilter(course._id);
                        setCourseFilterOpen(false);
                        setCourseFilterSearch("");
                      }}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          courseFilter === course._id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span>
                        {course.title} · {course.pillar?.name}
                      </span>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <TableSkeleton
            variant="invictus"
            className="border border-gold-soft"
          />
        ) : (
          <VideoTable
            data={filteredVideos}
            onEdit={(video) => {
              setSelectedVideo(video);
              setEditOpen(true);
            }}
          />
        )}
      </div>

      <CreateVideoModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <EditVideoModal
        open={editOpen}
        video={selectedVideo}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6">
      <div className="text-[#B18A3A]">{icon}</div>

      <p className="mt-4 text-[#8A8175]">{title}</p>

      <h2 className="mt-2 text-3xl font-bold text-[#171717]">{value}</h2>
    </div>
  );
}
