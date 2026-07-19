"use client";

import { X } from "lucide-react";
import { Commission } from "@/lib/features/commissionLedger/types";
import CommissionStatusBadge from "./commission-status-badge";

interface Props {
  commission: Commission;
  close: () => void;
}

const formatDate = (value?: string | null) => {
  if (!value) return "--";
  return new Date(value).toLocaleString();
};

const formatMoney = (amount?: number | null, currency?: string) => {
  if (amount === undefined || amount === null) return "--";
  return `${currency ?? ""} ${Number(amount).toLocaleString()}`;
};

const Row = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between border-b border-[#221d10] py-2 last:border-b-0">
    <span className="text-xs uppercase tracking-[2px] text-[#777]">
      {label}
    </span>
    <span className="text-right text-sm text-white">{value}</span>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-5 rounded-lg border border-[#332b18] bg-black p-4">
    <p className="mb-2 text-xs uppercase tracking-[3px] text-[#C9A962]">
      {title}
    </p>
    <div>{children}</div>
  </div>
);

export default function CommissionDetailsModal({ commission, close }: Props) {
  const {
    listing_id,
    listing_owner_id,
    promoter_id,
    created_by ,
    status,
    currency,
    listing_price_amount,
    commission_rate_percent,
    estimated_commission_amount,
    final_commission_amount,
    deal_closed_at,
    payment_tracking,
    dispute,
    platform_fee,
    status_history,
    is_frozen,
    note,
    created_at,
    updated_at,
  } = commission;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#332b18] bg-[#111] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#332b18] bg-[#111] px-6 py-5">
          <div>
            <h2 className="font-playfair text-xl text-white">
              Commission Details
            </h2>
            <p className="mt-1 text-xs text-[#777]">
              #{(commission as any)._id}
            </p>
          </div>

          <button onClick={close} className="text-[#888] cursor-pointer hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <CommissionStatusBadge status={status} />
            {is_frozen && (
              <span className="inline-block rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs uppercase tracking-wider text-red-400">
                Frozen (Disputed)
              </span>
            )}
          </div>

          <Section title="Listing">
            <Row
              label="Title"
              value={listing_id?.title ?? "Listing Removed"}
            />
            <Row label="Ref Code" value={`#${listing_id?.ref_code ?? "--"}`} />
            <Row
              label="Listing Price"
              value={formatMoney(listing_id?.price?.amount, listing_id?.price?.currency)}
            />
          </Section>

          <Section title="Parties">
            <Row
              label="Listing Owner"
              value={
                listing_owner_id
                  ? `${listing_owner_id.fullName} (${listing_owner_id.email})`
                  : "--"
              }
            />
            <Row
              label="Promoter"
              value={
                promoter_id
                  ? `${promoter_id.fullName} (${promoter_id.email})`
                  : "--"
              }
            />
            <Row
              label="Created By"
              value={
                created_by
                  ? `${created_by.fullName} (${created_by.email})`
                  : "--"
              }
            />
          </Section>

          <Section title="Commission">
            <Row label="Rate" value={`${commission_rate_percent}%`} />
            <Row
              label="Estimated Amount"
              value={formatMoney(estimated_commission_amount, currency)}
            />
            <Row
              label="Final Amount"
              value={formatMoney(final_commission_amount, currency)}
            />
            <Row label="Deal Closed At" value={formatDate(deal_closed_at)} />
            {note && <Row label="Note" value={note} />}
          </Section>

          <Section title="Payment Tracking">
            <Row
              label="Sent At"
              value={formatDate(payment_tracking?.sent_at)}
            />
            <Row
              label="Marked Paid At"
              value={formatDate(payment_tracking?.marked_paid_at)}
            />
            <Row
              label="Receiver Confirmed At"
              value={formatDate(payment_tracking?.receiver_confirmed_at)}
            />
            <Row
              label="Payment Method"
              value={payment_tracking?.payment_method ?? "--"}
            />
            <Row
              label="Payment Reference"
              value={payment_tracking?.payment_reference ?? "--"}
            />
            {payment_tracking?.note && (
              <Row label="Note" value={payment_tracking.note} />
            )}
          </Section>

          <Section title="Platform Fee">
            <Row
              label="Rate"
              value={
                platform_fee?.rate_percent !== undefined
                  ? `${platform_fee.rate_percent}%`
                  : "--"
              }
            />
            <Row
              label="Amount"
              value={formatMoney(platform_fee?.amount, currency)}
            />
            <Row label="Status" value={platform_fee?.status ?? "--"} />
            <Row label="Provider" value={platform_fee?.provider ?? "--"} />
            <Row label="Paid At" value={formatDate(platform_fee?.paid_at)} />
          </Section>

          {dispute && (dispute.opened_at || dispute.reason) && (
            <Section title="Dispute">
              <Row label="Opened At" value={formatDate(dispute.opened_at)} />
              <Row label="Reason" value={dispute.reason ?? "--"} />
              <Row
                label="Resolved At"
                value={formatDate(dispute.resolved_at)}
              />
              <Row
                label="Resolution Note"
                value={dispute.resolution_note ?? "--"}
              />
            </Section>
          )}

          <Section title="Status History">
            {status_history && status_history.length > 0 ? (
              <div className="flex flex-col gap-3">
                {status_history.map((entry:any, idx:any) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-[#221d10] p-3"
                  >
                    <div className="flex items-center justify-between">
                      <CommissionStatusBadge status={entry.status} />
                      <span className="text-xs text-[#777]">
                        {formatDate(entry.changed_at)}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="mt-2 text-sm text-[#ccc]">{entry.note}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#777]">No history yet.</p>
            )}
          </Section>

          <Section title="Timestamps">
            <Row label="Created At" value={formatDate(created_at)} />
            <Row label="Updated At" value={formatDate(updated_at)} />
          </Section>
        </div>

        <div className="flex justify-end border-t border-[#332b18] px-6 py-4">
          <button
            onClick={close}
            className="rounded-lg cursor-pointer bg-[#C9A962] px-6 py-2 text-sm font-medium text-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}