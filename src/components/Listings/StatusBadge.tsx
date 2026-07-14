export const statusBadge = (status: string | undefined) => {
  const s = (status || "").toLowerCase();
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-ui font-medium";
  if (s === "approved")
    return (
      <span
        className={`${base} bg-green-800/20 text-green-300 border border-green-700/30`}
      >
        Approved
      </span>
    );
  if (s === "pending")
    return (
      <span
        className={`${base} bg-yellow-900/20 text-yellow-300 border border-yellow-700/30`}
      >
        Pending
      </span>
    );
  if (s === "rejected")
    return (
      <span
        className={`${base} bg-red-900/20 text-red-300 border border-red-700/30`}
      >
        Rejected
      </span>
    );
  if (s === "cancelled")
    return (
      <span
        className={`${base} bg-gray-800/20 text-gray-300 border border-gray-700/30`}
      >
        Cancelled
      </span>
    );
  if (s === "active")
    return (
      <span
        className={`${base} bg-green-800/30 text-green-300 border border-green-800/80 capitalize`}
      >
        active
      </span>
    );
  if (s === "sold")
    return (
      <span
        className={`${base}  bg-gray-800/20 text-gray-300 border border-gray-700/30`}
      >
        Sold
      </span>
    );
  if (s === "draft")
    return (
      <span
        className={`${base} bg-gold/10 text-gold border border-amber-400 capitalize`}
      >
        draft
      </span>
    );
  return (
    <span className={`${base} bg-white/5 text-white/80 border border-white/10`}>
      {status}
    </span>
  );
};
