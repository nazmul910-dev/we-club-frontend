import { Skeleton } from "./skeleton";

export default function RowSkeleton ()  {
   return  <div  className="flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-full h-7 bg-white/20 rounded-xl" />
        ))}
      </div>
}