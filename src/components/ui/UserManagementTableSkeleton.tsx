import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementTableSkeleton({
  rows = 6,
}: {
  rows?: number;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-yellow-500/20 bg-[#111]">
      <table className="w-full">
        {/* Header */}
        <thead className="border-b border-yellow-500/20 bg-[#151515]">
          <tr>
            <th className="px-6 py-5 text-left">
              <Skeleton className="h-3 w-16 bg-[#252525]" />
            </th>

            <th className="px-6 py-5 text-left">
              <Skeleton className="h-3 w-12 bg-[#252525]" />
            </th>

            <th className="px-6 py-5 text-left">
              <Skeleton className="h-3 w-20 bg-[#252525]" />
            </th>

            <th className="px-6 py-5 text-left">
              <Skeleton className="h-3 w-16 bg-[#252525]" />
            </th>

            <th className="px-6 py-5 text-left">
              <Skeleton className="h-3 w-16 bg-[#252525]" />
            </th>

            <th className="px-6 py-5 text-center">
              <Skeleton className="mx-auto h-3 w-14 bg-[#252525]" />
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <tr
              key={index}
              className="border-b border-white/5"
            >
              {/* User */}
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-[#252525]" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36 bg-[#252525]" />
                    <Skeleton className="h-3 w-52 bg-[#252525]" />
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="px-6 py-5">
                <Skeleton className="h-7 w-24 rounded-full bg-[#252525]" />
              </td>

              {/* Approval */}
              <td className="px-6 py-5">
                <Skeleton className="h-7 w-28 rounded-full bg-[#252525]" />
              </td>

              {/* License */}
              <td className="px-6 py-5">
                <Skeleton className="h-7 w-28 rounded-full bg-[#252525]" />
              </td>

              {/* Account */}
              <td className="px-6 py-5">
                <Skeleton className="h-7 w-24 rounded-full bg-[#252525]" />
              </td>

              {/* Action */}
              <td className="px-6 py-5">
                <div className="flex justify-center">
                  <Skeleton className="h-9 w-9 rounded-md bg-[#252525]" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}