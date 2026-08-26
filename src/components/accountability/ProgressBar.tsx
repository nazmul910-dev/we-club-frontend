export default function ProgressBar({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-[#F0EBDE] ${className}`}
    >
      <div
        className="h-full rounded-full bg-[#C6A34A]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
