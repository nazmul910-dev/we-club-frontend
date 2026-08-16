"use client";

interface Props {
  sentAt?: string;
  receivedAt?: string;
}

export default function CommissionPaymentStatusBadge({ sentAt, receivedAt }: Props) {
  let label = "Not Sent";
  let classes = "bg-[#2a2a2a] text-[#888] border border-[#332b18]";

  if (receivedAt) {
    label = "Received";
    classes = "bg-green-500/10 text-green-400 border border-green-500/30";
  } else if (sentAt) {
    label = "Sent";
    classes = "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";
  }

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs uppercase tracking-wider ${classes}`}
    >
      {label}
    </span>
  );
}