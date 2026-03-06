"use client";

import { useState } from "react";
import { authApi } from "@/lib/AuthApi";

type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function UrlForm({ onSuccess, onCancel }: Props) {
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

      // reset
      setUrl("");
      setShortCode("");
      setTtl("");

      onSuccess();
    } catch {
      setError("Failed to create URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* LONG URL */}
      <div>
        <label className="block text-sm font-medium mb-1 text-[#8b8da0]">
          Long URL
        </label>
        <input
          className="w-full border border-[#2e3044] bg-[#1a1b24] text-[#d1d3de] placeholder-[#5d5f73] px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#7c8ade]/40"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* OPTIONAL FIELDS */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1 text-[#8b8da0]">
            Custom Code
          </label>
          <input
            className="w-full border border-[#2e3044] bg-[#1a1b24] text-[#d1d3de] placeholder-[#5d5f73] px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#7c8ade]/40"
            placeholder="optional"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-[#8b8da0]">
            TTL (seconds)
          </label>
          <input
            type="number"
            className="w-full border border-[#2e3044] bg-[#1a1b24] text-[#d1d3de] placeholder-[#5d5f73] px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#7c8ade]/40"
            placeholder="optional"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-[#cf7c82] text-xs">
          {error}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-[#2e3044] text-[#8b8da0] rounded-md hover:bg-[#272833] transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="
            px-4 py-2 text-sm
            bg-[#5c6bc0] text-[#eaebf2]
            font-semibold
            rounded-md
            hover:bg-[#6a79ce]
            active:scale-95
            disabled:opacity-60
            transition
          "
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
