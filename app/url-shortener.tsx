"use client";

import { useState } from "react";
import { authApi } from "@/lib/AuthApi";
import Navbar from "@/components/Navbar";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [ttl, setTtl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    setError("");
    setShortUrl("");

    if (!url) {
      setError("URL is required");
      return;
    }

    try {
      const payload: any = {
        url,
      };

      if (shortCode.trim()) {
        payload.shortCode = shortCode.trim();
      }

      if (ttl.trim()) {
        payload.ttl = Number(ttl);
      }

      const res = await authApi.post("/api/url", payload);

      setShortUrl(res.data.shortUrl);
    } catch (e: any) {
      setError(
        e.response?.data?.message || "Failed to generate short URL"
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-[420px] space-y-4 border p-6 rounded">
          <h1 className="text-xl font-bold text-center">
            TinyURL Generator
          </h1>

        {/* Long URL */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* Custom short code */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Custom short code (optional)"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
        />

        {/* TTL */}
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="TTL in seconds (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={generate}
          className="w-full bg-black text-white p-2 rounded"
        >
          Generate Short URL
        </button>

        {/* Result */}
        {shortUrl && (
          <div className="mt-2 text-center">
            <p className="text-green-600 break-all">
              {shortUrl}
            </p>
            <a
              href={`${shortUrl}`}
              target="_blank"
              className="underline text-sm"
            >
              Open
            </a>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
