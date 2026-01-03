"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/");
    }
  }, [router]);

  const register = async () => {
    setError("");
    setSuccess("");

    try {
      await api.post("/api/users/register", {
        name,
        email,
        password,
      });

      setSuccess(
        "Registration successful. Please check your email to verify your account."
      );

      // Redirect after short delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 space-y-4 rounded border p-6 shadow-lg">
        <h1 className="text-xl font-bold text-center">Sign Up</h1>

        <input
          className="w-full border p-2"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <button
          onClick={register}
          className="w-full bg-black text-white p-2 rounded hover:opacity-90"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
