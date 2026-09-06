"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, Users, X } from "lucide-react";
import { toast } from "sonner";

import AuthGuard from "@/components/Auth/authGuard/AuthGuard";
import { PageContainer, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCountryRoomRequestsForReview,
  reviewCountryRoomRequest,
  type CountryRoomRequest,
} from "@/lib/features/addManager/privateRoomApi";

function CountryRoomRequestsContent() {
  const [requests, setRequests] = useState<CountryRoomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      setRequests(await getCountryRoomRequestsForReview());
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Could not load room requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const review = async (
    request: CountryRoomRequest,
    status: "approved" | "rejected",
  ) => {
    setActingId(request._id);
    try {
      await reviewCountryRoomRequest(request._id, status);
      setRequests((current) =>
        current.filter((item) => item._id !== request._id),
      );
      toast.success(
        status === "approved"
          ? `${request.user?.fullName ?? "User"} can now enter ${request.countryName}`
          : "Room request rejected",
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Could not review request");
    } finally {
      setActingId(null);
    }
  };

  return (
    <PageContainer variant="invictus">
      <PageHeader
        variant="invictus"
        eyebrow="Invictus · Management"
        title="Community room requests"
        description="Review requests from members who want to join another country community."
        actions={
          <Button variant="outline" onClick={loadRequests} disabled={loading}>
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        }
      />

      <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#E7DDCC] bg-white p-5">
        <span className="rounded-full bg-[#F3E9D2] p-2 text-[#B08A3E]">
          <Users size={18} />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8A8175]">
            Pending requests
          </p>
          <p className="mt-1 text-2xl font-semibold text-[#1C1A17]">
            {requests.length}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {!loading && requests.length === 0 && (
          <Card className="border-[#E7DDCC]">
            <CardContent className="p-10 text-center text-sm text-[#8A8175]">
              No pending country-room requests.
            </CardContent>
          </Card>
        )}

        {requests.map((request) => (
          <Card key={request._id} className="border-[#E7DDCC] bg-white">
            <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[#1C1A17]">
                  {request.user?.fullName ?? "Unknown user"}
                </p>
                <p className="mt-1 text-sm text-[#71685C]">
                  {request.user?.email ?? "No email"}
                  {request.user?.role ? ` · ${request.user.role}` : ""}
                </p>
                <p className="mt-3 text-sm text-[#8A8175]">
                  Wants access to <strong className="text-[#1C1A17]">{request.countryName}</strong> community
                </p>
                {request.createdAt && (
                  <p className="mt-1 text-xs text-[#A19788]">
                    Requested {new Date(request.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  disabled={actingId === request._id}
                  onClick={() => review(request, "rejected")}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X size={15} /> Reject
                </Button>
                <Button
                  variant="invictus"
                  disabled={actingId === request._id}
                  onClick={() => review(request, "approved")}
                >
                  <Check size={15} /> Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

export default function CommunityRoomRequestsPage() {
  return (
    <AuthGuard
      allowedRoles={["founder", "manager"]}
      allowedAccessTo={["invictus", "both"]}
    >
      <CountryRoomRequestsContent />
    </AuthGuard>
  );
}
