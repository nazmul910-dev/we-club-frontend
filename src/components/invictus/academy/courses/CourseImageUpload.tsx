"use client";

import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface Props {
  file: File | null;

  preview: string;

  onChange: (file: File) => void;

  onRemove: () => void;
}

export default function CourseImageUpload({
  file,

  preview,

  onChange,

  onRemove,
}: Props) {
  return (
    <div className="space-y-3">
      <p
        className="
text-sm
font-medium
text-[#171717]
"
      >
        Course Thumbnail
      </p>

      {preview ? (
        <div
          className="
relative
w-full
h-48
rounded-2xl
overflow-hidden
border
border-[#E8DDCA]
group
"
        >
          <Image
            src={preview}
            alt="preview"
            fill
            className="
object-cover
"
          />

          <button
            type="button"
            onClick={onRemove}
            className="
absolute
top-3
right-3
w-8
h-8
rounded-full
bg-white
text-red-500
flex
items-center
justify-center
cursor-pointer
opacity-0
group-hover:opacity-100
transition
"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          className="
h-48
border-2
border-dashed
border-[#E8DDCA]
rounded-2xl
flex
flex-col
items-center
justify-center
cursor-pointer
hover:border-[#B18A3A]
transition
"
        >
          <UploadCloud className="text-[#B18A3A]" />

          <p
            className="
text-sm
text-[#8A8175]
mt-2
"
          >
            Upload Course Image
          </p>

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                onChange(file);
              }
            }}
          />
        </label>
      )}
    </div>
  );
}
