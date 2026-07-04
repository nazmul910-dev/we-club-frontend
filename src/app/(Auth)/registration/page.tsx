'use client';

import AccessToStep from "@/components/Auth/registration/AccessToStep";
import DetailsStep from "@/components/Auth/registration/DetailsStep";
import StepIndicator from "@/components/Auth/registration/stepIndicator";
import { useAppSelector } from "@/lib/redux/store/hook";

import Image from "next/image";
import BgImage from "@/assets/Login/login-bg.jpg"

export default function RegistrationPage() {

    const currentStep = useAppSelector(
        (state) => state.registration.currentStep
    );

    return ( 

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

            <Image
                src={BgImage}
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute top-0 left-1/2 h-100 w-100 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[180px]" />

            <div className="w-full max-w-2xl rounded-3xl border border-yellow-500/20  backdrop-blur-[10px] p-10">

                <StepIndicator
                    currentStep={currentStep}
                    totalSteps={2}
                    labels={[
                        "Access Plan",
                        "Your Details"
                    ]}
                />

                {
                    currentStep === 1
                        ? <AccessToStep />
                        : <DetailsStep />
                }

            </div>

        </section>

    );

}