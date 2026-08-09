"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch } from "@/lib/redux/store/hook";
import { sendRegistrationPaymentLink } from "@/lib/features/payment/paymentSlice";
import { PendingRegistrationPayment } from "@/lib/features/payment/paymentSlice";
import SendLinkConfirmModal from "./SendLinkConfirmModal";
import PendingPaymentsTableSkeleton from "./PendingPaymentsTableSkeleton";


interface Props {
  payments: PendingRegistrationPayment[];
  loading?: boolean;
}

export default function PendingPaymentsTable({ payments, loading }: Props) {
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<PendingRegistrationPayment | null>(
    null
  );
  const [sendingId, setSendingId] = useState<string | null>(null);

  const handleConfirmSend = async () => {
    if (!selected) {
      return;
    }

    try {
      setSendingId(selected._id);

      await dispatch(sendRegistrationPaymentLink(selected._id)).unwrap();

      toast.success(
        `Payment link sent to ${selected.user?.email ?? "user"}.`
      );

      setSelected(null);
    } catch (e: any) {
      toast.error(e || "Failed to send payment link.");
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return <PendingPaymentsTableSkeleton />;
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-xl border border-yellow-500/20 bg-[#111]">
        <table className="w-full">
          <thead className="border-b border-yellow-500/20 bg-[#151515]">
            <tr className="text-left text-xs uppercase tracking-wider text-white/40">
              <th className="px-6 py-5">User</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Access</th>
              <th className="px-6 py-5">Duration</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-white/40"
                >
                  No pending registration payments found.
                </td>
              </tr>
            )}

            {payments.map((payment) => {
              const user = payment.user;

              return (
                <tr
                  key={payment._id}
                  className="border-b border-white/5 transition hover:bg-white/3"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/10 text-sm font-semibold text-yellow-400">
                        {user?.fullName?.charAt(0).toUpperCase() ?? "?"}
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-white">
                          {user?.fullName ?? "Unknown User"}
                        </h3>

                        <p className="mt-1 text-xs text-white/40">
                          {user?.email ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase text-white/60">
                      {user?.role ?? "—"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm text-white/60">
                      {user?.accessTo ?? "—"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm text-white/60">
                      {user?.membershipDurationMonths
                        ? `${user.membershipDurationMonths} months`
                        : "—"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs uppercase ${
                        payment.status === "checkout_created"
                          ? "border-green-500/30 bg-green-500/10 text-green-400"
                          : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {payment.status === "checkout_created" && (
                        <CheckCircle2 size={12} />
                      )}
                      {payment.status === "checkout_created"
                        ? "link sent"
                        : payment.status}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <button
                      type="button"
                      onClick={() => setSelected(payment)}
                      disabled={sendingId === payment._id}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs font-semibold uppercase text-yellow-400 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send size={14} />
                      Send Payment Link
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SendLinkConfirmModal
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
        userName={selected?.user?.fullName}
        userEmail={selected?.user?.email}
        isSending={sendingId === selected?._id}
        onConfirm={handleConfirmSend}
      />
    </>
  );
}