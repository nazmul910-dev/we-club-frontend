import { statusBadgeClass } from "@/app/invictus/management/retreats/Retreatdesigntokens";
import {
  RetreatBatchStatus,
  RetreatLocationStatus,
} from "@/lib/features/retreat/retreatTypes";

const LOCATION_STATUS_CONFIG: Record<
  RetreatLocationStatus,
  { label: string; tone: "neutral" | "gold" | "green" | "red" }
> = {
  draft: { label: "Draft", tone: "neutral" },
  published: { label: "Published", tone: "green" },
  archived: { label: "Archived", tone: "red" },
};

export function LocationStatusBadge({
  status,
}: {
  status: RetreatLocationStatus;
}) {
  const config = LOCATION_STATUS_CONFIG[status];

  return <span className={statusBadgeClass(config.tone)}>{config.label}</span>;
}

const BATCH_STATUS_CONFIG: Record<
  RetreatBatchStatus,
  { label: string; tone: "neutral" | "gold" | "green" | "red" }
> = {
  upcoming: { label: "Upcoming", tone: "neutral" },
  open: { label: "Open", tone: "green" },
  sold_out: { label: "Sold Out", tone: "gold" },
  in_progress: { label: "In Progress", tone: "gold" },
  completed: { label: "Completed", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "red" },
};

export function BatchStatusBadge({ status }: { status: RetreatBatchStatus }) {
  const config = BATCH_STATUS_CONFIG[status];

  return <span className={statusBadgeClass(config.tone)}>{config.label}</span>;
}
