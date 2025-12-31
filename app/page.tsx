"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [ttl, setTtl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    setError("");
    setShortUrl("");

    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE + "/api/url",
        {
          url,
          shortCode: code || undefined,
          ttl: ttl ? Number(ttl) : undefined,
        }
      );

      setShortUrl(res.data.shortUrl);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to generate URL");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-[400px] space-y-4">
        <h1 className="text-xl font-bold text-center">TinyURL Generator</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Custom Code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="TTL in seconds (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        <button
          onClick={generate}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Generate
        </button>

        {shortUrl && (
          <div className="bg-green-100 p-2 rounded text-sm break-all">
            <a href={`https://${shortUrl}`} target="_blank">
              {shortUrl}
            </a>
          </div>
        )}

        {error && (
          <div className="bg-red-100 p-2 rounded text-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
