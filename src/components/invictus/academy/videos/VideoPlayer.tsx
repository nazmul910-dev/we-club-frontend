"use client";

interface Props {
  src: string;

  title: string;
}

export default function VideoPlayer({ src, title }: Props) {
  return (
    <div
      className="
overflow-hidden
rounded-3xl
border
border-white/10
bg-black
"
    >
      <video
        src={src}
        controls
        className="
h-full
w-full
"
      ></video>

      <div
        className="
border-t
border-white/10
p-4
text-white
"
      >
        {title}
      </div>
    </div>
  );
}
