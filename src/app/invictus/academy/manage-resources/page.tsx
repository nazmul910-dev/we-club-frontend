"use client";

import { useEffect, useMemo, useState } from "react";

import { FileText, Plus, ShieldCheck, Unlock } from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { fetchResources } from "@/lib/features/invictus/academy/resource/resourceSlice";
import type { IModuleResource } from "@/lib/features/invictus/academy/resource/resourceTypes";

import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";

import ResourceTable from "@/components/invictus/academy/resources/ResourceTable";
import CreateResourceModal from "@/components/invictus/academy/resources/CreateResourceModal";
import EditResourceModal from "@/components/invictus/academy/resources/EditResourceModal";

export default function ManageResourcesPage() {
  return (
    <AuthGuard allowedRoles={["founder", "manager", "admin"]}>
      <ManageResourcesContent />
    </AuthGuard>
  );
}

function ManageResourcesContent() {
  const dispatch = useAppDispatch();

  const { resources, loading, error } = useAppSelector((state) => state.resource);

  const [courses, setCourses] = useState<ICourseModule[]>([]);
  const [courseFilter, setCourseFilter] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<IModuleResource | null>(null);

  const loadCourses = async () => {
    try {
      const res = await courseApi.getCourses();
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(fetchResources({ includeArchived: true }));
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const filteredResources = useMemo(() => {
    if (!courseFilter) return resources;
    return resources.filter((item) => item.module?._id === courseFilter);
  }, [resources, courseFilter]);

  const stats = useMemo(() => {
    const total = resources.length;
    const required = resources.filter((item) => item.isRequired).length;
    const optional = total - required;
    return { total, required, optional };
  }, [resources]);

  return (
    <div className="mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[4px] text-[#B18A3A] font-semibold">
            INVICTUS ACADEMY
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#171717]">
            Module Resources
          </h1>

          <p className="mt-2 text-sm text-[#8A8175]">
            Upload downloadable resources — PDFs, worksheets, templates and
            external links — for each course module
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#B18A3A] px-5 py-2.5 text-sm text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(177,138,58,.25)]"
        >
          <Plus size={16} />
          Add Resource
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <StatCard icon={<FileText />} title="Total Resources" value={String(stats.total)} />
        <StatCard icon={<ShieldCheck />} title="Required" value={String(stats.required)} />
        <StatCard icon={<Unlock />} title="Optional" value={String(stats.optional)} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="w-full max-w-xs">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-[#E8DDCA] bg-white p-3 text-sm"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title} · {course.pillar?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-[#8A8175]">Loading resources...</p>
        ) : (
          <ResourceTable
            data={filteredResources}
            onEdit={(resource) => {
              setSelectedResource(resource);
              setEditOpen(true);
            }}
          />
        )}
      </div>

      <CreateResourceModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <EditResourceModal
        open={editOpen}
        resource={selectedResource}
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
    <div className="rounded-2xl border border-[#E8DDCA] bg-white p-6 shadow-sm">
      <div className="mb-4 text-[#B18A3A]">{icon}</div>
      <p className="text-sm text-[#8A8175]">{title}</p>
      <h3 className="mt-1 text-2xl font-bold text-[#171717]">{value}</h3>
    </div>
  );
}