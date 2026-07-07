const SkeletonCard = () => (
  <div className="card-luxe p-6 flex flex-col gap-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-[52px] h-[52px] rounded-full bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/2" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="h-14 bg-white/10 rounded-md" />
      <div className="h-14 bg-white/10 rounded-md" />
    </div>
    <div className="h-8 bg-white/10 rounded mt-2" />
  </div>
);


export default SkeletonCard;