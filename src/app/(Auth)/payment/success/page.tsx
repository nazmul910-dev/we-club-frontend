"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

import Image from "next/image";
import BgImage from "@/assets/Login/login-bg.jpg";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const verify = async () => {
            const sessionId = searchParams.get("session_id");

            if (!sessionId) {
                return;
            }

            try {
                await axios.get(
                    `http://localhost:5000/api/v1/payments/verify-session/${sessionId}`
                );

                router.push("/confirm-mail");
            } catch (error) {
                console.error(error);
            }
        };

        verify();
    }, [router, searchParams]);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <Image
                src={BgImage}
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className=" justify-center border border-amber-600/20 items-center flex w-52 h-52 md:w-100 md:h-100  relative z-20 bg-transparent  backdrop-blur-[3px] rounded-2xl" >
                <h2 className="text-xl text-center md:text-2xl font-bold text-white font-playfair">Verifying your payment...</h2>
            </div>
        </div>
    );
}