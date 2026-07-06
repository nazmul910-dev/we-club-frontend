"use client";



import { listingsApi } from "@/lib/features/listings/listingsApi";
import { AppDispatch, RootState } from "@/lib/redux/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function ManageListingsPage() {

    const dispatch = useDispatch<AppDispatch>();
    const {
        myListings,
        myListingsLoading,
        myListingsError,
        promoteRequests,
        promoteRequestsLoading,
        promoteRequestsError,
    } = useSelector((s: RootState) => {
        return {
            myListings: (s as any).listings?.myListings ?? [],
            myListingsLoading: (s as any).listings?.myListingsLoading ?? false,
            myListingsError: (s as any).listings?.myListingsError ?? null,
            promoteRequests: (s as any).listings?.promoteRequests ?? [],
            promoteRequestsLoading: (s as any).listings?.promoteRequestsLoading ?? false,
            promoteRequestsError: (s as any).listings?.promoteRequestsError ?? null,
        };
    });

    useEffect(() => {
        dispatch(listingsApi.getMyListings());
        dispatch(listingsApi.getMyListingPromoteRequests());
    }, [dispatch]);

    return (
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-8 bg-[#0a0a0a] min-h-[calc(100vh-4rem)]">        

            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="text-eyebrow mb-2">Listings</div>
                    <h1 className="font-display text-3xl md:text-4xl text-white">Manage Listings</h1>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
                    <h2 className="mb-4 text-xl font-semibold text-white">My Listings</h2>
                    {myListingsLoading ? (
                        <div className="text-muted-foreground">Loading listings…</div>
                    ) : myListings.length === 0 ? (
                        <div className="text-muted-foreground">You have no listings yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-left">
                                <thead>
                                    <tr className="text-sm text-muted-foreground">
                                        <th className="py-2">Title</th>
                                        <th className="py-2">Price</th>
                                        <th className="py-2">Status</th>
                                        <th className="py-2">Promoter Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myListings.map((l: any) => (
                                        <tr key={l._id} className="border-t border-white/5">
                                            <td className="py-3 pr-6 text-white">{l.title}</td>
                                            <td className="py-3 pr-6 text-white">{l.price?.amount} {l.price?.currency}</td>
                                            <td className="py-3 pr-6 text-white">{l.status}</td>
                                            <td className="py-3 pr-6 text-white">{(l.promoters || []).length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-gold-soft/30 bg-[#0f0f0f]/60 p-6">
                    <h2 className="mb-4 text-xl font-semibold text-white">Promote Requests Received</h2>
                    {promoteRequestsLoading ? (
                        <div className="text-muted-foreground">Loading promote requests…</div>
                    ) : promoteRequests.length === 0 ? (
                        <div className="text-muted-foreground">No promote requests received.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-left">
                                <thead>
                                    <tr className="text-sm text-muted-foreground">
                                        <th className="py-2">Listing</th>
                                        <th className="py-2">Requester</th>
                                        <th className="py-2">Status</th>
                                        <th className="py-2">Requested At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {promoteRequests.map((r: any) => (
                                        <tr key={r._id} className="border-t border-white/5">
                                            <td className="py-3 pr-6 text-white">{r.listing_id?.title || r.listing_id?.ref_code}</td>
                                            <td className="py-3 pr-6 text-white">{r.requester?.email || r.requester?.user_id}</td>
                                            <td className="py-3 pr-6 text-white">{r.status}</td>
                                            <td className="py-3 pr-6 text-white">{new Date(r.requested_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );

}