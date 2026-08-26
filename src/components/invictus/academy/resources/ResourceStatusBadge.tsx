"use client";

interface Props {
  status: "draft" | "published" | "archived";
}

export default function ResourceStatusBadge({ status }: Props) {
  const styles = {
    draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    published: "bg-green-500/10 text-green-400 border-green-500/20",

    archived: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`
px-3
py-1
rounded-full
text-xs
border
${styles[status]}
`}
    >
      {status}
    </span>
  );
}
