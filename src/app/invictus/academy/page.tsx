"use client";

import {
  Trophy,
  Flame,
  Target,
  ArrowRight,
  Layers,
  BookOpen,
  Video,
  FileText,
  ListChecks,
  Award,
  CheckSquare,
  TrendingUp,
} from "lucide-react";

import Link from "next/link";

import ModuleCard from "@/components/invictus/academy/modules/ModuleCard";

import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { fetchModules } from "@/lib/features/invictus/academy/academySlice";

import { useEffect } from "react";

export default function AcademyPage() {
  const dispatch = useAppDispatch();

  const { modules } = useAppSelector((state) => state.academy);

  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);

  const managementCards = [
    {
      title: "Manage Pillars",
      description: "Create and configure academy challenge tracks and pricing.",
      icon: <Layers size={26} />,
      route: "/invictus/academy/pillars",
    },

    {
      title: "Manage Courses",
      description: "Organize course modules and learning progression paths.",
      icon: <BookOpen size={26} />,
      route: "/invictus/academy/courses",
    },

    {
      title: "Manage Videos",
      description: "Upload, stream, and control module lesson videos.",
      icon: <Video size={26} />,
      route: "/invictus/academy/manage-videos",
    },

    {
      title: "Manage Resources",
      description: "Upload downloadable PDFs, worksheets, and external links.",
      icon: <FileText size={26} />,
      route: "/invictus/academy/manage-resources",
    },

    {
      title: "Manage Quiz Questions",
      description:
        "Set up module quizzes, choice options, and correct answers.",
      icon: <ListChecks size={26} />,
      route: "/invictus/academy/manage-quiz-questions",
    },

    {
      title: "Manage Certificates",
      description: "Review member quiz certificates, attach files, and revoke.",
      icon: <Award size={26} />,
      route: "/invictus/academy/manage-certificates",
    },

    {
      title: "Manage Actions",
      description: "Define actionable milestones and tasks for each module.",
      icon: <CheckSquare size={26} />,
      route: "/invictus/academy/manage-actions",
    },

    {
      title: "Manage Progress",
      description: "Inspect member video watch progress and module completion.",
      icon: <TrendingUp size={26} />,
      route: "/invictus/academy/manage-progress",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#171717] mx-auto max-w-[1180px] px-[6vw] py-[2vw] sm:px-8">
      {/* HERO */}

      <div className="relative overflow-hidden rounded-3xl border border-[#E8DDCA] bg-white p-10 shadow-sm">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#B18A3A]/10 blur-3xl" />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[5px] text-[#B18A3A]">
            INVICTUS ACADEMY
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-[#171717]">
            Forge Your Path. Become Invincible.
          </h1>

          <p className="mt-4 max-w-2xl text-[#8A8175]">
            Manage your academy ecosystem, courses, pillars and learning videos
            from one powerful dashboard.
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <StatCard icon={<Target />} title="Challenges" value="24" />

        <StatCard icon={<Flame />} title="Current Streak" value="12 Days" />

        <StatCard icon={<Trophy />} title="Points" value="1240" />
      </div>

      {/* MANAGEMENT */}

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold text-[#171717]">
          Academy Management
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {managementCards.map((card) => (
            <Link
              key={card.title}
              href={card.route}
              className="group rounded-3xl border border-[#E8DDCA] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#B18A3A]/50 hover:shadow-[0_20px_50px_rgba(177,138,58,.15)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3E9D2] text-[#B18A3A]">
                {card.icon}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-[#171717]">
                {card.title}
              </h3>

              <p className="mt-3 text-sm text-[#8A8175]">{card.description}</p>

              <div className="mt-6 flex items-center gap-2 text-sm text-[#B18A3A]">
                Open Dashboard
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* LEARNING MODULES */}

      <div className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#171717]">
            Learning Modules
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((item) => (
            <ModuleCard
              key={item._id}
              title={item.title}
              description={item.description}
              lessons={item.totalVideos}
              progress={0}
              isPremium={item.isPremium}
              id={item._id}
            />
          ))}
        </div>
      </div>
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
