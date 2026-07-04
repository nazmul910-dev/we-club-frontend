"use client"

import Image from "next/image";
import BgImage from "@/assets/Login/login-bg.jpg";
import Link from "next/link";

export default function ConfirmMailPage() {
    return (
        <>
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
                <Image
                    src={BgImage}
                    alt="Background"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className=" justify-center flex-col p-5 md:p-10 border border-amber-600/20 items-center flex w-52 h-52 md:w-100 md:h-100  relative z-20 bg-transparent  backdrop-blur-[3px] rounded-2xl" >
                    <h2 className="text-xl text-center md:text-2xl font-bold text-white font-playfair">Please check your mail and wait for admin verification...</h2>
                    <Link href="/">
                        <button className="mt-4 cursor-pointer rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">
                            Go to Home
                        </button>
                    </Link>
                </div>
            </div>
        </>
    )
}