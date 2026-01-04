"use client";

import { useEffect, useState, useCallback } from "react";
import { authApi } from "@/lib/AuthApi";

/* ================= TYPES ================= */

type Url = {
  id: number;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  expiresAt: string | null;
  accessCount: number;
};

type PageResponse = {
  content: Url[];
  totalPages: number;
  first: boolean;
  last: boolean;
  number: number;
};

/* ================= PROPS ================= */

type UrlTableProps = {
  refreshKey: number;
  onDataLoaded: (urls: Url[]) => void;
};

/* ================= HELPERS ================= */

const isExpired = (expiresAt: string | null) => {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
};

const formatExpiry = (expiresAt: string | null) => {
  if (!expiresAt) return "Never";
  return new Date(expiresAt).toLocaleString();
};

/* ================= COMPONENT ================= */

export default function UrlTable({
  refreshKey,
  onDataLoaded,
}: UrlTableProps) {
  const [data, setData] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const size = 10;

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= FETCH ================= */

  const handleShortClick = (url: string) => {
  window.open(url, "_blank");

  // refresh data after a small delay
  setTimeout(() => {
    fetchUrls();
  }, 500);
};


  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authApi.get<PageResponse>("/api/url", {
        params: {
          page,
          size,
          q: searchQuery || undefined,
        },
      });

      setData(res.data);
      onDataLoaded(res.data.content); // 🔥 KEY LINE
    } catch {
      setData(null);
      onDataLoaded([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, searchQuery, onDataLoaded]);

  /* fetch on page/search/refreshKey */
  useEffect(() => {
    fetchUrls();
  }, [fetchUrls, refreshKey]);

  /* ================= ACTIONS ================= */
  const handleSearch = () => {
    setPage(0);
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(0);
  };

  const handleCopy = async (shortUrl: string) => {
    await navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied!");
  };


  const handleDelete = async (id: number) => {
    if (!confirm("Delete this URL?")) return;
    await authApi.delete(`/api/url/${id}`);
    fetchUrls();
  };



/* ================= UI ================= */

if (loading) {
  return (
    <div className="bg-white border rounded p-4">
      <p>Loading...</p>
    </div>
  );
}

return (
  <div className="bg-white border rounded p-4">
    {/* 🔍 SEARCH BAR — ALWAYS VISIBLE */}
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search by original URL / shortcode"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="
          flex-1 min-w-[240px]
          px-3 py-2 text-sm
          border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />

      <button
        onClick={handleSearch}
        className="
          px-4 py-2 text-sm font-medium
          bg-blue-600 text-white rounded-md
          hover:bg-blue-700 active:scale-95
        "
      >
        Search
      </button>

      {searchQuery && (
        <button
          onClick={handleClearSearch}
          className="
            px-4 py-2 text-sm font-medium
            bg-gray-200 text-gray-700 rounded-md
            hover:bg-gray-300 active:scale-95
          "
        >
          Clear
        </button>
      )}
    </div>

    {/* 📭 EMPTY STATE */}
    {!data || data.content.length === 0 ? (
      <p className="text-sm text-gray-500 text-center">
        No URLs found
      </p>
    ) : (
      <>
        {/* 📊 TABLE */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="min-w-[720px] w-full text-sm">
        <thead>
          <tr className="border-b text-center">
            <th>Original</th>
            <th>Short</th>
            <th>Count</th>
            <th>Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.content.map((u) => {
            const expired = isExpired(u.expiresAt);

            return (
              <tr key={u.id} className="border-b text-center">
                <td className="truncate max-w-xs mx-auto">
                  {u.originalUrl}
                </td>

                <td>
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {/* OPEN SHORT URL */}
                    <button
                      disabled={expired}
                      onClick={() => handleShortClick(u.shortUrl)}
                      className={`
                        inline-flex items-center
                        px-3 py-1.5 rounded-md
                        text-sm font-medium
                        transition
                        ${
                          expired
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100"
                        }
                      `}
                    >
                      Open
                    </button>

                    {/* COPY BUTTON */}
                    <button
                      onClick={() => handleCopy(u.shortUrl)}
                      className="
                        inline-flex items-center
                        px-2 py-1.5 rounded-md
                        text-xs font-medium
                        border border-gray-300
                        bg-white text-gray-700
                        hover:bg-gray-100
                        active:scale-95
                      "
                    >
                      Copy
                    </button>
                  </div>
                </td>


                <td>{u.accessCount}</td>

                <td>
                  {formatExpiry(u.expiresAt)}
                  {expired && (
                    <div className="text-xs text-red-600">
                      Expired
                    </div>
                  )}
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
        </div>

        {/* 📄 PAGINATION */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            disabled={data.first}
            onClick={() => setPage((p) => p - 1)}
            className={data.first
              ? "text-gray-400 bg-gray-100 px-3 py-1.5 rounded-md"
              : "text-gray-700 bg-white border px-3 py-1.5 rounded-md hover:bg-gray-100"}
          >
            ← Prev
          </button>

          <span className="px-3 py-1.5 text-sm">
            Page {data.number + 1} of {data.totalPages}
          </span>

          <button
            disabled={data.last}
            onClick={() => setPage((p) => p + 1)}
            className={data.last
              ? "text-gray-400 bg-gray-100 px-3 py-1.5 rounded-md"
              : "text-gray-700 bg-white border px-3 py-1.5 rounded-md hover:bg-gray-100"}
          >
            Next →
          </button>
        </div>
      </>
    )}
  </div>
);

}
