"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import { verifyRetreatPayment } from "@/lib/features/retreat/retreatSlice";

export default function RetreatPaymentSuccessPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isVerifying = useAppSelector((state) => state.retreat.isVerifyingPayment);
    const verifyError = useAppSelector((state) => state.retreat.verifyPaymentError);

    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) return;

        let cancelled = false;
        let attempts = 0;

        const tryVerify = async () => {
            const result = await dispatch(verifyRetreatPayment({ sessionId }));
            if (cancelled) return;
            if (verifyRetreatPayment.rejected.match(result) && attempts < 3) {
                attempts += 1;
                setTimeout(tryVerify, 1500);
            }
        };

        tryVerify();
        return () => { cancelled = true; };
    }, [dispatch, searchParams]);

    if (isVerifying) return <div className="py-20 text-center">Confirming your payment…</div>;
    if (verifyError) return <div className="py-20 text-center text-red-500">{verifyError}</div>;

    return (
        <div className="py-20 text-center">
            <h1 className="mb-4 font-display text-2xl">Your seat is confirmed 🎉</h1>
            <button onClick={() => router.push("/invictus/retreats")} className="underline">
                Back to retreats
            </button>
        </div>
    );
}