"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


 const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/google`,
        { idToken }
      );

      localStorage.setItem("token", res.data.access_token);

      router.push("/");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/");
    }
  }, [router]);
  

  const login = async () => {
    setError("");
    try {
      const res = await api.post("/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      router.push("/");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-96 space-y-4 rounded border p-6 shadow-lg">
        <h1 className="text-xl font-bold text-center">Login</h1>

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

        <button
          onClick={login}
          className="w-full bg-black text-white p-2 active:scale-95 transition-transform rounded hover:opacity-90"
        >
          Login
        </button>

        <p className="text-sm text-center">
          No account? <a href="/register" className="underline">Sign up</a>
        </p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => console.log("Google login failed")}
        />
      </div>
    </div>
    
  );
}
