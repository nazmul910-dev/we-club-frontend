"use client";

import ChangePassword from "@/components/Auth/login/ChangePassword";

export default function ChangePasswordPage() {
  return (
    <section className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-5">
      <div className="w-full max-w-lg text-black bg-white border border-[#E8E0D2] rounded-3xl p-10">
        <ChangePassword />
      </div>
    </section>
  );
}
