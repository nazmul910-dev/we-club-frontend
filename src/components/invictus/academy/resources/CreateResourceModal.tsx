"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Check,
  ChevronsUpDown,
  FileUp,
  Link2,
  PlayCircle,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
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

import { useAppDispatch } from "@/lib/redux/store/hook";
import { createResource } from "@/lib/features/invictus/academy/resource/resourceSlice";
import { courseApi } from "@/lib/features/invictus/academy/course/courseApi";
import type { ICourseModule } from "@/lib/features/invictus/academy/course/courseTypes";
import { videoApi } from "@/lib/features/invictus/academy/video-module/videoApi";
import type { IModuleVideo } from "@/lib/features/invictus/academy/video-module/videoTypes";
import type {
  ModuleResourceProvider,
  ModuleResourceType,
} from "@/lib/features/invictus/academy/resource/resourceTypes";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RESOURCE_TYPES: { value: ModuleResourceType; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "worksheet", label: "Worksheet" },
  { value: "template", label: "Template" },
  { value: "external_link", label: "External Link" },
  { value: "other", label: "Other" },
];

const emptyForm = {
  moduleId: "",
  title: "",
  slug: "",
  description: "",
  resourceType: "pdf" as ModuleResourceType,
  provider: "cloudinary" as ModuleResourceProvider,
  externalUrl: "",
  isRequired: true,
  pointsReward: 5,
  order: 1,
};

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function CreateResourceModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

  const [courses, setCourses] = useState<ICourseModule[]>([]);
  const [moduleVideos, setModuleVideos] = useState<IModuleVideo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState(emptyForm);
  const [courseSearch, setCourseSearch] = useState("");
  const [coursePickerOpen, setCoursePickerOpen] = useState(false);

  useEffect(() => {
    if (open) {
      loadCourses();
    }
  }, [open]);

  useEffect(() => {
    if (form.moduleId) {
      loadModuleVideos(form.moduleId);
    } else {
      setModuleVideos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.moduleId]);

  const loadCourses = async () => {
    try {
      const res = await courseApi.getCourses();
      const published = res.data.filter((item) => item.status === "published");
      setCourses(published);
    } catch (error) {
      console.log(error);
    }
  };

  const loadModuleVideos = async (moduleId: string) => {
    try {
      const res = await videoApi.getByModule(moduleId);
      setModuleVideos(res.data.videos || []);
    } catch (error) {
      console.log(error);
      setModuleVideos([]);
    }
  };

  const updateField = (
    key: keyof typeof emptyForm,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleTitle = (value: string) => {
    updateField("title", value);
    updateField("slug", generateSlug(value));
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.moduleId)
      next.moduleId = "Select the course module this resource belongs to";
    if (!form.title.trim() || form.title.trim().length < 2)
      next.title = "Title minimum 2 charecter";
    if (!form.slug.trim()) next.slug = "Slug is required";
    if (!form.order || form.order < 1) next.order = "Order must be at least 1";

    if (form.provider === "cloudinary" && !file) {
      next.file = "Please select a file to upload";
    }

    if (form.provider === "external" && !form.externalUrl.trim()) {
      next.externalUrl = "External URL is required";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setModuleVideos([]);
    setCourseSearch("");
    setCoursePickerOpen(false);
  };

  const handleClose = () => {
    resetForm();
    setErrors({});
    onClose();
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("slug", form.slug.trim());
      if (form.description.trim()) {
        formData.append("description", form.description.trim());
      }
      formData.append("resourceType", form.resourceType);
      formData.append("provider", form.provider);
      formData.append("isRequired", String(form.isRequired));
      formData.append("pointsReward", String(form.pointsReward));
      formData.append("order", String(form.order));

      if (form.provider === "external") {
        formData.append("externalUrl", form.externalUrl.trim());
      } else if (file) {
        formData.append("resource", file);
      }

      await dispatch(
        createResource({ moduleId: form.moduleId, data: formData }),
      ).unwrap();

      toast.success("Module resource added successfully!");
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Resource could not be added, try again later!";
      toast.error(message);
      setErrors((prev) => ({
        ...prev,
        form: message,
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl border-[#E7DDCC] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#1C1A17]">
            Add Module Resource
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label>Course Module</Label>
            <Popover
              open={coursePickerOpen}
              onOpenChange={(open) => {
                setCoursePickerOpen(open);
                if (!open) setCourseSearch("");
              }}
            >
              <PopoverTrigger className="mt-2 block w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-12 w-full justify-between rounded-xl border-[#E7DDCC] p-3 text-left font-normal"
                >
                  <span
                    className={cn(!form.moduleId && "text-muted-foreground")}
                  >
                    {form.moduleId
                      ? courses.find((course) => course._id === form.moduleId)
                          ?.title
                      : "Select Course Module"}
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
                    value={courseSearch}
                    onValueChange={setCourseSearch}
                    placeholder="Search courses..."
                  />
                  <CommandList className="max-h-72 overflow-y-auto">
                    <CommandEmpty>No courses found.</CommandEmpty>
                    {courses.map((course) => (
                      <CommandItem
                        key={course._id}
                        value={`${course.title} ${course.pillar?.name ?? ""}`}
                        onSelect={() => {
                          updateField("moduleId", course._id);
                          setCoursePickerOpen(false);
                          setCourseSearch("");
                        }}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            form.moduleId === course._id
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
            {errors.moduleId && (
              <p className="mt-1 text-xs text-red-500">{errors.moduleId}</p>
            )}

            {form.moduleId && (
              <div className="mt-2 rounded-xl border border-dashed border-[#E7DDCC] bg-[#FAF8F4] p-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#8A8175]">
                  <PlayCircle size={13} />
                  Lesson videos in this module
                </p>
                {moduleVideos.length > 0 ? (
                  <ul className="space-y-1">
                    {moduleVideos.map((video) => (
                      <li
                        key={video._id}
                        className="truncate text-xs text-[#1C1A17]"
                      >
                        {video.order}. {video.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#8A8175]">
                    No videos uploaded for this module yet.
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label>Resource Type</Label>
            <select
              className="mt-2 w-full cursor-pointer rounded-xl border border-[#E7DDCC] p-3"
              value={form.resourceType}
              onChange={(e) =>
                updateField(
                  "resourceType",
                  e.target.value as ModuleResourceType,
                )
              }
            >
              {RESOURCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateField("provider", "cloudinary")}
              className={`cursor-pointer rounded-xl border p-3 text-sm transition ${
                form.provider === "cloudinary"
                  ? "border-[#B08A3E] bg-[#F3E9D2] text-[#B08A3E]"
                  : "border-[#E7DDCC] text-[#8A8175]"
              }`}
            >
              <FileUp size={16} className="mx-auto mb-1" />
              Upload File
            </button>

            <button
              type="button"
              onClick={() => updateField("provider", "external")}
              className={`cursor-pointer rounded-xl border p-3 text-sm transition ${
                form.provider === "external"
                  ? "border-[#B08A3E] bg-[#F3E9D2] text-[#B08A3E]"
                  : "border-[#E7DDCC] text-[#8A8175]"
              }`}
            >
              <Link2 size={16} className="mx-auto mb-1" />
              External Link
            </button>
          </div>

          {form.provider === "cloudinary" ? (
            <div>
              <Label>Resource File</Label>

              {file ? (
                <div className="mt-2 flex items-center justify-between rounded-xl border border-[#E7DDCC] p-4">
                  <div className="flex items-center gap-3">
                    <FileUp className="text-[#B08A3E]" size={20} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1C1A17]">
                        {file.name}
                      </p>
                      <p className="text-xs text-[#8A8175]">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="cursor-pointer text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E7DDCA] transition hover:border-[#B08A3E]">
                  <UploadCloud className="text-[#B08A3E]" size={24} />
                  <p className="mt-2 text-sm text-[#8A8175]">
                    Click to select a file (PDF, DOCX, ZIP...)
                  </p>
                  <input
                    hidden
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              )}
              {errors.file && (
                <p className="mt-1 text-xs text-red-500">{errors.file}</p>
              )}
            </div>
          ) : (
            <div>
              <Label>External URL</Label>
              <Input
                className="mt-2"
                placeholder="https://..."
                value={form.externalUrl}
                onChange={(e) => updateField("externalUrl", e.target.value)}
              />
              {errors.externalUrl && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.externalUrl}
                </p>
              )}
            </div>
          )}

          <div>
            <Label>Resource Title</Label>
            <Input
              className="mt-2"
              placeholder="Enter resource title"
              value={form.title}
              onChange={(e) => handleTitle(e.target.value)}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              className="mt-2"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-red-500">{errors.slug}</p>
            )}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-2 min-h-[100px]"
              placeholder="Enter resource description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Order</Label>
              <Input
                className="mt-2"
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => updateField("order", Number(e.target.value))}
              />
              {errors.order && (
                <p className="mt-1 text-xs text-red-500">{errors.order}</p>
              )}
            </div>

            <div>
              <Label>Points Reward</Label>
              <Input
                className="mt-2"
                type="number"
                min={0}
                value={form.pointsReward}
                onChange={(e) =>
                  updateField("pointsReward", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E7DDCC] p-4">
            <div>
              <p className="font-medium">Required Resource</p>
              <p className="text-sm text-gray-500">
                Counts toward the module&apos;s resource completion progress
              </p>
            </div>
            <Switch
              className="cursor-pointer"
              checked={form.isRequired}
              onCheckedChange={(value) => updateField("isRequired", value)}
            />
          </div>

          {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer border-[#E7DDCC]"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            className="cursor-pointer bg-[#B08A3E] text-white hover:bg-[#B08A3E]/90"
            onClick={submit}
          >
            {loading ? "Saving..." : "Add Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
