"use client";

import { Badge } from "@/components/ui/Badge";
import { CertificateStatus } from "@/lib/features/invictus/academy/cerfificate/certificateTypes";


const styles: Record<CertificateStatus, string> = {
  issued: "bg-green-100 text-green-700 hover:bg-green-100",
  revoked: "bg-red-100 text-red-600 hover:bg-red-100",
};

const labels: Record<CertificateStatus, string> = {
  issued: "Issued",
  revoked: "Revoked",
};

export default function CertificateStatusBadge({ status }: { status: CertificateStatus }) {
  return <Badge className={styles[status]}>{labels[status]}</Badge>;
}