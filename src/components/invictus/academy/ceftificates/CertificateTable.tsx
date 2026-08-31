"use client";

import { Award, Eye, Link2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";



import CertificateStatusBadge from "./CertificateStatusBadge";
import { IQuizCertificate } from "@/lib/features/invictus/academy/cerfificate/certificateTypes";

interface Props {
  data: IQuizCertificate[];
  onView: (certificate: IQuizCertificate) => void;
}

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
};

export default function CertificateTable({ data, onView }: Props) {
  return (
    <div className="rounded-2xl border border-[#E7DDCC] bg-white p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Certificate</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Module / Pillar</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item._id} className="cursor-pointer transition-colors hover:bg-[#FAF8F4]" onClick={() => onView(item)}>
              <TableCell className="max-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3E9D2] text-[#B08A3E]">
                    <Award size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs font-medium text-[#1C1A17]">{item.certificateNumber}</p>
                    <p className="truncate text-xs text-[#8A8175]">ID · {item._id.slice(-8)}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="max-w-[180px]">
                <p className="truncate text-[#1C1A17]">{item.user?.fullName || "—"}</p>
                <p className="truncate text-xs text-[#8A8175]">{item.user?.email || "—"}</p>
              </TableCell>

              <TableCell className="max-w-[180px]">
                <p className="truncate text-[#1C1A17]">{item.module?.title || "—"}</p>
                {item.pillar?.name && <p className="truncate text-xs text-[#8A8175]">{item.pillar.name}</p>}
              </TableCell>

              <TableCell>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{item.score}%</Badge>
              </TableCell>

              <TableCell className="text-[#8A8175]">{formatDate(item.issuedAt)}</TableCell>

              <TableCell>
                {item.certificateUrl ? (
                  <Badge className="flex w-fit items-center gap-1 bg-[#1C1A17] text-[#F3E9D2] hover:bg-[#1C1A17]">
                    <Link2 size={12} />
                    Attached
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">Pending</Badge>
                )}
              </TableCell>

              <TableCell>
                <CertificateStatusBadge status={item.status} />
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button variant="outline" size="icon" className="cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#B08A3E] hover:text-[#B08A3E] active:translate-y-0" onClick={(e) => { e.stopPropagation(); onView(item); }} title="View certificate">
                    <Eye size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-10 text-center text-[#8A8175]">
                No certificates found for the selected filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}