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
        <label className="block text-sm font-medium mb-1">
          Long URL
        </label>
        <input
          className="w-full border px-3 py-2 text-sm rounded-md"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* OPTIONAL FIELDS */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Custom Code
          </label>
          <input
            className="w-full border px-3 py-2 text-sm rounded-md"
            placeholder="optional"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            TTL (seconds)
          </label>
          <input
            type="number"
            className="w-full border px-3 py-2 text-sm rounded-md"
            placeholder="optional"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs">
          {error}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
        )}

        <button
          onClick={generate}
          disabled={loading}
          className="
            px-4 py-2 text-sm
            bg-blue-600 text-white
            rounded-md
            hover:bg-blue-700
            active:scale-95
            disabled:opacity-60
          "
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
