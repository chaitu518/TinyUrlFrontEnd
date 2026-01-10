"use client";

import { useState } from "react";
import { authApi } from "@/lib/AuthApi";

export default function DashboardPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const createQuickLink = async () => {
    if (!url.trim()) {
      setError("Destination URL is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await authApi.post("/api/url", {
        url,
      });

      setShortUrl(res.data.shortUrl);
      setUrl("");
    } catch {
      setError("Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard");
  };

  return (
    <>
      {/* CENTER CONTENT */}
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-white border rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Quick Create
          </h2>

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter destination URL"
            className="
              w-full
              border
              px-4 py-2
              rounded-md
              text-sm
              mb-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          {error && (
            <p className="text-red-500 text-sm mb-3">
              {error}
            </p>
          )}

          <button
            onClick={createQuickLink}
            disabled={loading}
            className="
              w-full
              bg-blue-600
              text-white
              py-2
              rounded-md
              text-sm
              font-medium
              hover:bg-blue-700
              active:scale-95
              transition
            "
          >
            {loading ? "Creating..." : "Create Link"}
          </button>
        </div>
      </div>

      {/* RESULT MODAL */}
      {shortUrl && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              🎉 Link Created
            </h3>

            <p className="text-sm text-gray-600 text-center mb-4">
              Your short URL is ready
            </p>

            <div className="flex items-center gap-2 mb-4">
              <input
                readOnly
                value={shortUrl}
                className="flex-1 border px-3 py-2 rounded text-sm"
              />

              <button
                onClick={copy}
                className="
                  px-3 py-2
                  text-sm
                  border
                  rounded-md
                  hover:bg-gray-100
                "
              >
                Copy
              </button>
            </div>

            <button
              onClick={() => setShortUrl(null)}
              className="
                w-full
                bg-gray-100
                py-2
                rounded-md
                text-sm
                hover:bg-gray-200
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
