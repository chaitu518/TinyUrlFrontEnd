"use client";

import { useState } from "react";
import { authApi } from "@/lib/AuthApi";

export default function UrlForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [ttl, setTtl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setError("");

    if (!url) {
      setError("URL is required");
      return;
    }

    try {
      setLoading(true);

      const payload: any = { url };
      if (shortCode) payload.shortCode = shortCode;
      if (ttl) payload.ttl = Number(ttl);

      await authApi.post("/api/url", payload);

      setUrl("");
      setShortCode("");
      setTtl("");
      onSuccess();
    } catch (e: any) {
      setError("Failed to create URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded p-4 max-w-md">
      <h3 className="font-semibold mb-3 text-sm">
        Create Short URL
      </h3>

      {/* Long URL */}
      <input
        className="w-full border px-3 py-2 text-sm rounded mb-3"
        placeholder="Long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {/* Optional Fields */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input
          className="border px-3 py-2 text-sm rounded"
          placeholder="Custom code"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
        />

        <input
          type="number"
          className="border px-3 py-2 text-sm rounded"
          placeholder="TTL (sec)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mb-2">
          {error}
        </p>
      )}

      <button
        onClick={generate}
        disabled={loading}
        className="w-full bg-black text-white py-2 text-sm rounded"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}
