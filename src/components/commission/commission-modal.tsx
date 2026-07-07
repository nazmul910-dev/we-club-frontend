"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import {
    confirmCommission,
    disputeCommission,
    markPaid,
    resolveDispute,
} from "@/lib/features/commissionLedger/commissionLedgerApi";

interface Props {
    commission: any;
    type: "confirm" | "paid" | "dispute" | "resolve";
    close: () => void;
}

const finalStatuses = [
    { label: "Confirmed", value: "confirmed" as const },
    { label: "Paid", value: "paid" as const },
    { label: "Cancelled", value: "cancelled" as const },
];

export default function CommissionModal({ commission, type, close }: Props) {
    const dispatch = useDispatch<any>();

    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [finalCommission, setFinalCommission] = useState("");
    const [dealClosedAt, setDealClosedAt] = useState("");
    const [finalStatus, setFinalStatus] = useState<"confirmed" | "paid" | "cancelled">("confirmed");

    const formatDealClosedAt = (value: string) => {
        if (!value) return "";

        const [year, month, day] = value.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        return date.toISOString();
    };

    const submit = async () => {
        try {
            setLoading(true);

            if (type === "confirm") {
                const result = await dispatch(
                    confirmCommission({
                        id: commission._id,
                        final_commission_amount: Number(finalCommission),
                        deal_closed_at: formatDealClosedAt(dealClosedAt),
                        note,
                    })
                );

                if (confirmCommission.fulfilled.match(result)) {
                    close();
                }
                return;
            }

            if (type === "paid") {
                const result = await dispatch(
                    markPaid({
                        id: commission._id,
                        payment_method: paymentMethod as
                            | "bank_transfer"
                            | "stripe"
                            | "helcim"
                            | "cash"
                            | "check"
                            | "other",
                    })
                );

                if (markPaid.fulfilled.match(result)) {
                    close();
                }
                return;
            }

            if (type === "dispute") {
                const result = await dispatch(
                    disputeCommission({
                        id: commission._id,
                        reason: note,
                    })
                );

                if (disputeCommission.fulfilled.match(result)) {
                    close();
                }
            }

            if (type === "resolve") {
                const result = await dispatch(
                    resolveDispute({
                        id: commission._id,
                        final_status: finalStatus,
                        resolution_note: note,
                    })
                );

                if (resolveDispute.fulfilled.match(result)) {
                    close();
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-xl border border-[#332b18] bg-[#111] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#332b18] px-6 py-5">
                    <h2 className="font-playfair text-xl text-white">
                        {type === "dispute"
                            ? "Open Dispute"
                            : type === "confirm"
                                ? "Confirm Commission"
                                : type === "paid"
                                    ? "Mark Paid"
                                    : "Resolve Dispute"}
                    </h2>

                    <button onClick={close} className="text-[#888] hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-5 rounded-lg border border-[#332b18] bg-black p-4">
                        <p className="text-xs uppercase tracking-widest text-[#777]">Listing</p>
                        <p className="mt-2 font-playfair text-white">
                            {commission?.listing_id?.title ?? "N/A"}
                        </p>
                    </div>

                    {type === "confirm" && (
                        <>
                            <label className="mb-2 block text-xs uppercase tracking-[3px] text-[#C9A962]">
                                Final Commission Amount
                            </label>
                            <input
                                type="number"
                                value={finalCommission}
                                onChange={(e) => setFinalCommission(e.target.value)}
                                placeholder="Enter final commission amount"
                                className="mb-5 w-full rounded-lg border border-[#332b18] bg-[#090909] p-3 text-white outline-none focus:border-[#C9A962]"
                            />

                            <label className="mb-2 block text-xs uppercase tracking-[3px] text-[#C9A962]">
                                Deal Closed Date
                            </label>
                            <input
                                type="date"
                                value={dealClosedAt}
                                onChange={(e) => setDealClosedAt(e.target.value)}
                                className="mb-5 w-full rounded-lg border border-[#332b18] bg-[#090909] p-3 text-white outline-none focus:border-[#C9A962]"
                            />

                            <label className="mb-2 block text-xs uppercase tracking-[3px] text-[#C9A962]">
                                Note
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Deal Closed"
                                className="h-28 w-full resize-none rounded-lg border border-[#332b18] bg-[#090909] p-4 text-white outline-none placeholder:text-[#555] focus:border-[#C9A962]"
                            />
                        </>
                    )}

                    {type === "dispute" && (
                        <>
                            <label className="mb-2 block text-xs uppercase tracking-[3px] text-[#C9A962]">
                                Reason
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Explain dispute reason..."
                                className="h-32 w-full resize-none rounded-lg border border-[#332b18] bg-[#090909] p-4 text-white outline-none placeholder:text-[#555] focus:border-[#C9A962]"
                            />
                        </>
                    )}

                    {type === "resolve" && (
                        <>
                            <label className="mb-2 block text-xs uppercase tracking-[3px] text-[#C9A962]">
                                Final Status
                            </label>
                            <select
                                value={finalStatus}
                                onChange={(e) =>
                                    setFinalStatus(
                                        e.target.value as "confirmed" | "paid" | "cancelled"
                                    )
                                }
                                className="mb-5 w-full rounded-lg border border-[#332b18] bg-[#090909] p-3 text-white outline-none focus:border-[#C9A962]"
                            >
                                {finalStatuses.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>

                            <label className="mb-2 block text-xs uppercase tracking-[3px] text-[#C9A962]">
                                Resolution Note
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Write resolution details..."
                                className="h-32 w-full resize-none rounded-lg border border-[#332b18] bg-[#090909] p-4 text-white outline-none placeholder:text-[#555] focus:border-[#C9A962]"
                            />
                        </>
                    )}
                </div>

                <div className="p-6">
                    {type === "paid" && (
                        <div className="mb-5">
                            <label className="mb-2 block text-xs uppercase tracking-[3px] text-[#C9A962]">
                                Payment Method
                            </label>

                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full rounded-lg border border-[#332b18] bg-[#090909] p-3 text-white outline-none focus:border-[#C9A962]"
                            >
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="stripe">Stripe</option>
                                <option value="helcim">Helcim</option>
                                <option value="cash">Cash</option>
                                <option value="check">Check</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-[#332b18] px-6 py-4">
                    <button
                        onClick={close}
                        className="rounded-lg px-5 py-2 text-sm text-[#888] hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={
                            loading ||
                            (
                                type === "confirm"
                                    ? !finalCommission || !dealClosedAt
                                    : type === "paid"
                                        ? !paymentMethod
                                        : type === "resolve"
                                            ? !note.trim() || !finalStatus
                                            : !note.trim()
                            )
                        }
                        onClick={submit}
                        className="rounded-lg bg-[#C9A962] px-6 py-2 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {
                            loading
                                ?
                                "Processing..."
                                :
                                type === "confirm"
                                    ?
                                    "Confirm"
                                    :
                                    type === "paid"
                                        ?
                                        "Mark Paid"
                                        :
                                        type === "dispute"
                                            ?
                                            "Submit Dispute"
                                            :
                                            "Resolve"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}