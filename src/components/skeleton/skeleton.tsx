import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardRowSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-border last:border-b-0">
          <td className="px-5 py-3.5">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="px-5 py-3.5">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="px-5 py-3.5">
            <Skeleton className="h-4 w-14" />
          </td>
          <td className="px-5 py-3.5">
            <Skeleton className="h-4 w-20 rounded-full" />
          </td>
          <td className="px-5 py-3.5">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="px-5 py-3.5">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}