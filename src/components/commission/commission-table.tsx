"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/lib/redux/store/hook";

import {
  getAllCommissions,
  getMyCommissions,
} from "@/lib/features/commissionLedger/commissionLedgerApi";

import CommissionStatusBadge from "./commission-status-badge";
import CommissionActionMenu from "./commission-action-menu";

import { Commission } from "@/lib/features/commissionLedger/types";

export default function CommissionTable() {

const dispatch = useDispatch<any>();

const [loading, setLoading] = useState(true);

const [commissions, setCommissions] = useState<Commission[]>([]);

const tab = useAppSelector(
(state) => state.commission.tab
);

const user = useAppSelector(
(state) => state.authUser.user
);

const isAdminOrManager =
  user?.role === "admin" ||
  user?.role === "associate" ||
  user?.role === "ceo" ||
  user?.role === "ceo_partner" ||
  user?.role === "partner" ||
  user?.role === "ambassador" ||
  user?.role === "we_club_member";

const loadCommissions = useCallback(async () => {

setLoading(true);

try {

if (isAdminOrManager) {

const result = await dispatch(getAllCommissions());

if (getAllCommissions.fulfilled.match(result)) {

setCommissions(result.payload.data ?? []);

}

} else {

const result = await dispatch(getMyCommissions());

if (getMyCommissions.fulfilled.match(result)) {

setCommissions(result.payload.data ?? []);

}

}

} finally {

setLoading(false);

}

}, [dispatch, isAdminOrManager]);

useEffect(() => {
  loadCommissions();
}, [loadCommissions]);

const filtered =
tab === "all"
? commissions
: commissions.filter(
(item) => item.status === tab
);

return (

<div className="overflow-hidden rounded-xl border border-[#332b18] bg-[#111]">

<table className="w-full text-left">

<thead>

<tr className="border-b border-[#332b18] text-xs tracking-[3px] text-[#777] uppercase">

<th className="p-5">Listing</th>

<th className="p-5">Promoter</th>

<th className="p-5">Status</th>

<th className="p-5">Estimated Value</th>

<th className="p-5">Date</th>

<th className="p-5 text-center">Action</th>

</tr>

</thead>

<tbody>

{
loading && (

<tr>

<td
colSpan={6}
className="py-16 text-center text-[#888]"
>

Loading commissions...

</td>

</tr>

)
}

{
!loading &&
filtered.length === 0 && (

<tr>

<td
colSpan={6}
className="py-16 text-center text-[#666]"
>

No commission records found.

</td>

</tr>

)
}

{
!loading &&
filtered.map((item) => (

<tr
key={item._id}
className="border-b border-[#332b18] transition hover:bg-[#161616]"
>

<td className="p-5">

<p className="font-playfair text-white">

{item?.listing_id?.title ?? "Listing Removed"}

</p>

<p className="mt-1 text-xs text-[#777]">

#{item?.listing_id?.ref_code ?? "--"}

</p>

</td>

<td className="p-5">

<p className="text-white">

{item.promoter_id?.fullName}

</p>

<p className="mt-1 text-xs text-[#777]">

{item.promoter_id?.role}

</p>

</td>

<td className="p-5">

<CommissionStatusBadge
status={item.status}
/>

</td>

<td className="p-5 text-white">

{item.currency}{" "}

{Number(
item.estimated_commission_amount
).toLocaleString()}

</td>

<td className="p-5 text-sm text-[#888]">

{
new Date(
item.created_at
).toLocaleDateString()
}

</td>

<td className="p-5 text-center">

<CommissionActionMenu
commission={item}
/>

</td>

</tr>

))
}

</tbody>

</table>

</div>

);

}