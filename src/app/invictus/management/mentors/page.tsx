"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Check,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import { PageContainer, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { getAllUsers } from "@/lib/features/users/usersApi";
import {
  archiveMentor,
  createMentor,
  fetchMentorProfiles,
  moveMentorToDraft,
  publishMentor,
  updateMentor,
} from "@/lib/features/mentorManagement/mentorManagementSlice";
import type {
  CreateMentorPayload,
  MentorProfile,
  UpdateMentorPayload,
} from "@/lib/features/mentorManagement/mentorManagementTypes";

const emptyForm = {
  bio: "",
  expertise: "",
  fullName: "",
  email: "",
  password: "",
  userId: "",
  yearsOfExperience: "",
  sessionDurationMinutes: "60",
  isPrimaryMentor: false,
};

type FormState = typeof emptyForm;
type CreateMode = "create" | "existing";
type StatusFilter = "all" | "draft" | "published" | "archived";

const statusStyles: Record<StatusFilter, string> = {
  all: "bg-stone-100 text-stone-600",
  draft: "bg-amber-100 text-amber-700",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-rose-100 text-rose-700",
};

const toNumber = (value: string) => (value ? Number(value) : undefined);

function MentorManagementContent() {
  const dispatch = useAppDispatch();
  const { profiles, loading, actionLoading, error } = useAppSelector(
    (state) => state.mentorManagement,
  );
  const users = useAppSelector((state) => state.users.users);
  const usersLoading = useAppSelector((state) => state.users.loading);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [mode, setMode] = useState<CreateMode>("create");
  const [editing, setEditing] = useState<MentorProfile | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [existingUserSearch, setExistingUserSearch] = useState("");
  const [existingUserSelectOpen, setExistingUserSelectOpen] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState("");

  const loadData = () => {
    dispatch(fetchMentorProfiles({}));
    dispatch(getAllUsers({ page: 1, limit: 100 }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return profiles.filter((profile) => {
      const matchesStatus =
        statusFilter === "all" || profile.status === statusFilter;
      const matchesSearch =
        !query ||
        profile.mentor.fullName.toLowerCase().includes(query) ||
        profile.mentor.email.toLowerCase().includes(query) ||
        profile.expertise.some((item) => item.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [profiles, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: profiles.length,
      published: profiles.filter((profile) => profile.status === "published")
        .length,
      primary: profiles.filter((profile) => profile.isPrimaryMentor).length,
      active: profiles.filter((profile) => profile.isActive).length,
    }),
    [profiles],
  );

  const updateForm = (key: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openCreate = (nextMode: CreateMode) => {
    setEditing(null);
    setMode(nextMode);
    setForm(emptyForm);
    setExistingUserSearch("");
    setExistingUserSelectOpen(false);
    setExpertiseInput("");
    setFormOpen(true);
  };

  const openEdit = (profile: MentorProfile) => {
    setEditing(profile);
    setMode("existing");
    setExistingUserSearch("");
    setExistingUserSelectOpen(false);
    setExpertiseInput("");
    setForm({
      ...emptyForm,
      bio: profile.bio,
      expertise: profile.expertise.join(", "),
      yearsOfExperience:
        profile.yearsOfExperience === undefined
          ? ""
          : String(profile.yearsOfExperience),
      sessionDurationMinutes: String(profile.sessionDurationMinutes),
      isPrimaryMentor: profile.isPrimaryMentor,
      userId: profile.mentor._id,
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (form.bio.trim().length < 10) return;

    const fields = {
      bio: form.bio.trim(),
      expertise: form.expertise
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      yearsOfExperience: toNumber(form.yearsOfExperience),
      sessionDurationMinutes: toNumber(form.sessionDurationMinutes),
      isPrimaryMentor: form.isPrimaryMentor,
    };

    let result;
    if (editing) {
      const payload: UpdateMentorPayload = fields;
      result = await dispatch(updateMentor({ id: editing._id, payload }));
    } else {
      const payload: CreateMentorPayload =
        mode === "create"
          ? {
              ...fields,
              mode,
              fullName: form.fullName.trim(),
              email: form.email.trim(),
              password: form.password,
            }
          : { ...fields, mode, userId: form.userId };
      result = await dispatch(createMentor(payload));
    }

    if (
      (editing && updateMentor.fulfilled.match(result)) ||
      (!editing && createMentor.fulfilled.match(result))
    ) {
      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm);
    }
  };

  const expertiseItems = form.expertise
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const addExpertise = () => {
    const value = expertiseInput.trim();
    if (!value) return;

    const alreadyAdded = expertiseItems.some(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );

    if (!alreadyAdded) {
      updateForm("expertise", [...expertiseItems, value].join(", "));
    }

    setExpertiseInput("");
  };

  const removeExpertise = (itemToRemove: string) => {
    updateForm(
      "expertise",
      expertiseItems.filter((item) => item !== itemToRemove).join(", "),
    );
  };

  const selectableUsers = useMemo(() => {
    const query = existingUserSearch.trim().toLowerCase();

    return users
      .filter((user) => user.role !== "co_mentor")
      .filter(
        (user) =>
          !query ||
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      );
  }, [existingUserSearch, users]);

  const selectedUser = users.find((user) => user._id === form.userId);

  const closeExistingUserPicker = () => {
    setExistingUserSelectOpen(false);
    setExistingUserSearch("");
  };

  const selectExistingUser = (userId: string) => {
    updateForm("userId", userId);
    closeExistingUserPicker();
  };

  const runAction = async (
    action: typeof publishMentor | typeof moveMentorToDraft | typeof archiveMentor,
    id: string,
  ) => {
    await dispatch(action(id));
  };

  return (
    <PageContainer variant="invictus">
      <PageHeader
        variant="invictus"
        eyebrow="Invictus · Management"
        title="Mentor management"
        description="Create mentor profiles, promote existing users, and keep the active mentor roster ready for members."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className={loading ? "animate-spin" : ""} size={15} />
              Refresh
            </Button>
            <Button variant="invictus" onClick={() => openCreate("create")}>
              <Plus size={16} /> New mentor
            </Button>
          </div>
        }
      />

      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Users size={18} />} label="Total mentors" value={stats.total} />
        <Stat icon={<CheckCircle2 size={18} />} label="Published" value={stats.published} />
        <Stat icon={<ShieldCheck size={18} />} label="Primary configured" value={stats.primary} />
        <Stat icon={<Users size={18} />} label="Active" value={stats.active} />
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl border-[#E7DDCC] bg-[#FBF9F4]">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl text-[#1C1A17]">
              {editing ? "Edit mentor profile" : "Create mentor"}
            </DialogTitle>
            <DialogDescription className="text-[#8A8175]">
              {editing
                ? "Update the mentor profile and publishing settings."
                : "Create a new mentor account or promote an existing user."}
            </DialogDescription>
            {!editing && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant={mode === "create" ? "invictus" : "outline"}
                  onClick={() => setMode("create")}
                >
                  Create new user
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={mode === "existing" ? "invictus" : "outline"}
                  onClick={() => setMode("existing")}
                >
                  Promote existing user
                </Button>
              </div>
            )}
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            {mode === "create" && !editing ? (
              <>
                <Field label="Full name" value={form.fullName} onChange={(value) => updateForm("fullName", value)} />
                <Field label="Email" type="email" value={form.email} onChange={(value) => updateForm("email", value)} />
                <div className="space-y-1 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8175]">
                    Temporary password
                  </span>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) => updateForm("password", event.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      title={showPassword ? "Hide password" : "Show password"}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#8A8175] hover:bg-[#F3E9D2] hover:text-[#1C1A17]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : !editing ? (
              <div className="space-y-1 text-sm sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8175]">
                  Existing user
                </span>
                <div
                  className="relative"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      window.setTimeout(closeExistingUserPicker, 120);
                    }
                  }}
                >
                  <div className="relative">
                    <Input
                      value={
                        existingUserSelectOpen
                          ? existingUserSearch
                          : selectedUser
                            ? `${selectedUser.fullName} · ${selectedUser.email}`
                            : ""
                      }
                      onFocus={() => {
                        setExistingUserSearch("");
                        setExistingUserSelectOpen(true);
                      }}
                      onChange={(event) => {
                        setExistingUserSearch(event.target.value);
                        setExistingUserSelectOpen(true);
                      }}
                      placeholder={
                        usersLoading
                          ? "Loading users..."
                          : "Search by name or email"
                      }
                      disabled={usersLoading}
                      className="h-11 border-[#E7DDCC] bg-white pr-10 shadow-sm"
                    />
                    <ChevronDown
                      size={16}
                      className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8175] transition-transform ${existingUserSelectOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {existingUserSelectOpen && !usersLoading && (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-50 overflow-hidden rounded-xl border border-[#E7DDCC] bg-white p-1 shadow-xl">
                      <div className="max-h-60 overflow-y-auto">
                        {selectableUsers.length > 0 ? (
                          selectableUsers.map((user) => {
                            const isSelected = user._id === form.userId;
                            return (
                              <button
                                key={user._id}
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => selectExistingUser(user._id)}
                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[#F8F2E7]"
                              >
                                <span className="min-w-0">
                                  <span className="block truncate font-medium text-[#1C1A17]">
                                    {user.fullName}
                                  </span>
                                  <span className="block truncate text-xs text-[#8A8175]">
                                    {user.email} · {user.role}
                                  </span>
                                </span>
                                {isSelected && (
                                  <Check size={16} className="shrink-0 text-[#B08A3E]" />
                                )}
                              </button>
                            );
                          })
                        ) : (
                          <p className="px-3 py-6 text-center text-sm text-[#8A8175]">
                            No users found for “{existingUserSearch}”.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8175]">Bio</span>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(event) => updateForm("bio", event.target.value)}
                className="w-full rounded-md border border-[#E7DDCC] bg-white px-3 py-2 text-sm outline-none focus:border-[#B08A3E]"
                placeholder="Describe the mentor's experience and coaching focus."
              />
            </label>
            <div className="space-y-2 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8175]">
                Expertise
              </span>
              <div className="flex gap-2">
                <Input
                  value={expertiseInput}
                  onChange={(event) => setExpertiseInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addExpertise();
                    }
                  }}
                  placeholder="e.g. Leadership coaching"
                  className="border-[#E7DDCC] bg-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExpertise}
                  disabled={!expertiseInput.trim()}
                >
                  Add
                </Button>
              </div>
              {expertiseItems.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {expertiseItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full border border-[#E7DDCC] bg-[#F8F2E7] px-3 py-1.5 text-xs font-medium text-[#6B6257]"
                    >
                      {item}
                      <button
                        type="button"
                        title={`Remove ${item}`}
                        aria-label={`Remove ${item}`}
                        onClick={() => removeExpertise(item)}
                        className="rounded-full p-0.5 text-[#8A8175] hover:bg-[#E7DDCC] hover:text-[#1C1A17]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Field label="Years of experience" type="number" value={form.yearsOfExperience} onChange={(value) => updateForm("yearsOfExperience", value)} />
            <Field label="Session duration (minutes)" type="number" value={form.sessionDurationMinutes} onChange={(value) => updateForm("sessionDurationMinutes", value)} />
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={form.isPrimaryMentor} onChange={(event) => updateForm("isPrimaryMentor", event.target.checked)} />
              Set as the one primary mentor
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button variant="invictus" onClick={handleSubmit} disabled={actionLoading}>
              {actionLoading ? "Saving..." : editing ? "Save changes" : "Create mentor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8175]" size={16} />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search mentors, email, or expertise" className="pl-9" />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          
        >
          <SelectTrigger className="min-h-11 rounded-xl w-full border-[#E7DDCC] bg-white text-sm sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#E7DDCC] bg-white">
        <Table>
          <TableHeader className="bg-[#FAF6EE]">
            <TableRow>
              <TableHead>Mentor</TableHead>
              <TableHead>Expertise</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Primary</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.map((profile) => (
              <TableRow key={profile._id}>
                <TableCell>
                  <p className="font-medium text-[#1C1A17]">{profile.mentor.fullName}</p>
                  <p className="text-xs text-[#8A8175]">{profile.mentor.email}</p>
                </TableCell>
                <TableCell className="max-w-65 text-sm text-[#6B6257]">
                  {profile.expertise.length ? profile.expertise.join(", ") : "No expertise added"}
                </TableCell>
                <TableCell>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[profile.status]}`}>
                    {profile.status}
                  </span>
                </TableCell>
                <TableCell>
                  {profile.isPrimaryMentor ? <ShieldCheck className="text-[#B08A3E]" size={18} /> : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="icon" title="Edit mentor" onClick={() => openEdit(profile)}>
                      <Edit3 size={15} />
                    </Button>
                    {profile.status === "published" ? (
                      <Button variant="outline" size="icon" title="Move to draft" disabled={actionLoading} onClick={() => runAction(moveMentorToDraft, profile._id)}>
                        <RefreshCw size={15} />
                      </Button>
                    ) : profile.status === "draft" ? (
                      <Button variant="outline" size="icon" title="Publish mentor" disabled={actionLoading} onClick={() => runAction(publishMentor, profile._id)}>
                        <CheckCircle2 size={15} />
                      </Button>
                    ) : null}
                    {profile.status !== "archived" && (
                      <Button variant="outline" size="icon" title="Archive mentor" disabled={actionLoading} onClick={() => runAction(archiveMentor, profile._id)}>
                        <Archive size={15} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!loading && filteredProfiles.length === 0 && (
          <div className="p-10 text-center text-sm text-[#8A8175]">No mentor profiles match this view.</div>
        )}
      </div>
    </PageContainer>
  );
}

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
    <label className="space-y-1 text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#8A8175]">{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="border-[#E7DDCC]">
      <CardContent className="flex items-center gap-3 p-4">
        <span className="rounded-full bg-[#F3E9D2] p-2 text-[#B08A3E]">{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-wide text-[#8A8175]">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-[#1C1A17]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MentorManagementPage() {
  return (
    <AuthGuard
      allowedRoles={["founder", "manager"]}
      allowedAccessTo={["invictus", "both"]}
    >
      <MentorManagementContent />
    </AuthGuard>
  );
}
