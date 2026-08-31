import { Suspense } from "react";
import InvictusPaymentSuccessPage from "./InvictusPaymentSuccessPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3] text-sm text-[#8A8175]">
          Verifying your purchase...
        </div>
      }
    >
      <InvictusPaymentSuccessPage />
    </Suspense>
  );
}
