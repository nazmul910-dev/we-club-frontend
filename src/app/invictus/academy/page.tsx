"use client";

import { Trophy, Flame, Target, ArrowRight } from "lucide-react";

import ModuleCard from "@/components/invictus/academy/modules/ModuleCard";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";

import { fetchModules } from "@/lib/features/invictus/academy/academySlice";
import { useEffect } from "react";

// const modules = [
//   {
//     id: "1",
//     title: "Discipline & Mindset",
//     description:
//       "Build the foundation of a stronger mindset through daily challenges.",
//     lessons: 12,
//     progress: 75,
//     isPremium: false,
//   },

//   {
//     id: "2",
//     title: "Leadership Mastery",
//     description: "Develop leadership skills and unlock your full potential.",
//     lessons: 18,
//     progress: 40,
//     isPremium: true,
//   },

//   {
//     id: "3",
//     title: "Peak Performance",
//     description: "Advanced training modules designed for elite members.",
//     lessons: 15,
//     progress: 0,
//     isPremium: true,
//   },
// ];

export default function AcademyPage() {
  const dispatch = useAppDispatch();

  const { modules } = useAppSelector((state) => state.academy);

  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);
  return (
    <div
      className="
min-h-screen
bg-[#080808]
px-6
py-10
text-white
"
    >
      {/* HERO */}

      <div
        className="
relative
overflow-hidden
rounded-3xl
border
border-[#C9A84C]/20
bg-[#111]
p-10
"
      >
        <div
          className="
absolute
right-0
top-0
h-72
w-72
rounded-full
bg-[#C9A84C]/10
blur-3xl
"
        />

        <div
          className="
relative
z-10
"
        >
          <p
            className="
text-sm
uppercase
tracking-[4px]
text-[#C9A84C]
"
          >
            Invictus Academy
          </p>

          <h1
            className="
mt-4
max-w-3xl
text-4xl
font-bold
"
          >
            Forge Your Path. Become Invincible.
          </h1>

          <p
            className="
mt-4
max-w-2xl
text-gray-400
"
          >
            Access exclusive courses, challenges, and leadership training
            designed to transform your personal growth journey.
          </p>
        </div>
      </div>

      {/* STATS */}

      <div
        className="
mt-8
grid
gap-5
md:grid-cols-3
"
      >
        <StatCard icon={<Target />} title="Challenges" value="24" />

        <StatCard icon={<Flame />} title="Current Streak" value="12 Days" />

        <StatCard icon={<Trophy />} title="Points" value="1240" />
      </div>

      {/* MODULES */}

      <div
        className="
mt-12
"
      >
        <div
          className="
mb-6
flex
items-center
justify-between
"
        >
          <h2
            className="
text-2xl
font-semibold
"
          >
            Learning Modules
          </h2>

          <button
            className="
flex
items-center
gap-2
text-sm
text-[#C9A84C]
"
          >
            View All
            <ArrowRight size={18} />
          </button>
        </div>

        <div
          className="
grid
gap-6
md:grid-cols-3
"
        >
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
    <div
      className="
rounded-2xl
border
border-white/10
bg-[#111]
p-6
"
    >
      <div
        className="
mb-4
text-[#C9A84C]
"
      >
        {icon}
      </div>

      <p
        className="
text-sm
text-gray-400
"
      >
        {title}
      </p>

      <h3
        className="
mt-1
text-2xl
font-bold
"
      >
        {value}
      </h3>
    </div>
  );
}
