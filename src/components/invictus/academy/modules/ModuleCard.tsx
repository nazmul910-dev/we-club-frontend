"use client";

import { Lock, PlayCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


interface Props {
  title: string;

  description: string;

  lessons: number;

  progress: number;

  isPremium: boolean;
  id: string
}

export default function ModuleCard({
  title,

  description,

  lessons,

  progress,

  isPremium,
  id
}: Props) {

  const router=useRouter();

  return (
    <div
    onClick={()=>{

router.push(
`/invictus/academy/modules/${id}`
)

}}
      className="
group
rounded-3xl
border
border-white/10
bg-[#111]
p-6
transition
hover:-translate-y-1
hover:border-[#C9A84C]/40
"
    >
      <div
        className="
flex
items-start
justify-between
"
      >
        <div
          className="
rounded-xl
bg-[#C9A84C]/10
p-3
"
        >
          <PlayCircle
            className="
text-[#C9A84C]
"
          />
        </div>

        {isPremium && (
          <Lock
            size={20}
            className="
text-[#C9A84C]
"
          />
        )}
      </div>

      <h3
        className="
mt-6
text-xl
font-semibold
"
      >
        {title}
      </h3>

      <p
        className="
mt-3
text-sm
text-gray-400
"
      >
        {description}
      </p>

      <div
        className="
mt-6
"
      >
        <div
          className="
mb-2
flex
justify-between
text-xs
text-gray-400
"
        >
          <span>{lessons} Lessons</span>

          <span>{progress}%</span>
        </div>

        <div
          className="
h-2
overflow-hidden
rounded-full
bg-white/10
"
        >
          <div
            style={{
              width: `${progress}%`,
            }}
            className="
h-full
bg-[#C9A84C]
"
          />
        </div>
      </div>

      <button
        className="
mt-6
flex
items-center
gap-2
text-sm
text-[#C9A84C]
"
      >
        Continue
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
