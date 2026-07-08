interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex h-[330px] items-center justify-center">
      <div className="max-w-xs text-center">

        <p className="font-display text-lg text-zinc-300">
          {title}
        </p>

        <p className="mt-3 text-sm italic leading-7 text-zinc-500">
          {description}
        </p>

      </div>
    </div>
  );
}