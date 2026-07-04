'use client';

import LoginForm from '@/components/Auth/login/LoginForm';
import Image from 'next/image';
import BgImage from "@/assets/Login/login-bg.jpg";

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      <Image
        src={BgImage}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute top-0 left-1/2 h-100 w-100 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[180px]" />

      <div className="w-full max-w-md rounded-3xl border border-yellow-500/20 bg-white/5 backdrop-blur-[5px] p-10">
        <LoginForm />
      </div>
    </section>
  );
}