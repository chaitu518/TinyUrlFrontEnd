import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyClient />
    </Suspense>
  );
}

function VerifyLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Loading verification...</p>
    </div>
  );
}
