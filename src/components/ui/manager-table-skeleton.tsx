import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "./Table";

export function ManagersTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <TableBody className="w-full ">
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow
          key={index}
          className="w-full  border-neutral-800 hover:bg-transparent"
        >
          {/* User */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-neutral-800" />

              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-36 bg-neutral-800" />
                <Skeleton className="h-3 w-52 bg-neutral-800" />
              </div>
            </div>
          </TableCell>

          {/* Access */}
          <TableCell>
            <div className="w-full">
              <Skeleton className="h-7 w-full max-w-28 rounded-full bg-neutral-800" />
            </div>
          </TableCell>

          {/* Role */}
          <TableCell className="w-[25%]">
            <Skeleton className="h-5 w-24 rounded-full bg-neutral-800" />
          </TableCell>

          {/* Status */}
          <TableCell className="w-[25%]">
            <Skeleton className="h-5 w-20 rounded-full bg-neutral-800" />
          </TableCell>

          <TableCell className="w-[20%]">
            <Skeleton className="h-5 w-20 rounded-full bg-neutral-800" />
          </TableCell>

          {/* Action */}
          <TableCell className="text-right w-[20%]" >
            <div className="flex justify-end">
              <Skeleton className="h-9 w-4 rounded-sm bg-neutral-800" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
