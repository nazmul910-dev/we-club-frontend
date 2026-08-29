import { MentorBookingStatus } from "@/lib/features/mentorBooking/mentorBookingTypes";
const STATUS_LABELS: Record<MentorBookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};
export default function StatusBadge({
  status,
}: {
  status: MentorBookingStatus;
}) {
  const styles: Record<MentorBookingStatus, string> = {
    requested: "border-amber-200 bg-amber-50 text-amber-700",
    confirmed: "border-blue-200 bg-blue-50 text-blue-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
    no_show: "border-gray-200 bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}