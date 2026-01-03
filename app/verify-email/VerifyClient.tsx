"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    const verifyEmail = async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify-email`,
          null,
          { params: { token } }
        );

        setStatus("success");
        setMessage("Email verified successfully. Redirecting to login...");

        setTimeout(() => router.push("/login"), 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification failed or link expired"
        );
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded border p-6 shadow text-center">
        {status === "loading" && <p>Verifying your email...</p>}
        {status === "success" && (
          <p className="text-green-600">{message}</p>
        )}
        {status === "error" && (
          <p className="text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
