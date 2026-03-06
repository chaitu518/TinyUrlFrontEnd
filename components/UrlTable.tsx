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
    <div className="p-4">
      <p className="text-[#8b8da0]">Loading...</p>
    </div>
  );
}

return (
  <div className="p-4">
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
          border border-[#2e3044] bg-[#1a1b24] text-[#d1d3de] placeholder-[#5d5f73]
          rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#7c8ade]/40
        "
      />

      <button
        onClick={handleSearch}
        className="
          px-4 py-2 text-sm font-semibold
          bg-[#5c6bc0] text-[#eaebf2] rounded-md
          hover:bg-[#6a79ce] active:scale-95
          transition
        "
      >
        Search
      </button>

      {searchQuery && (
        <button
          onClick={handleClearSearch}
          className="
            px-4 py-2 text-sm font-medium
            bg-[#272833] text-[#8b8da0] rounded-md
            hover:bg-[#2f303d] active:scale-95
            transition-colors
          "
        >
          Clear
        </button>
      )}
    </div>

    {/* 📭 EMPTY STATE */}
    {!data || data.content.length === 0 ? (
      <p className="text-sm text-[#5d5f73] text-center">
        No URLs found
      </p>
    ) : (
      <>
        {/* 📦 CARD LIST */}
        <div className="space-y-4">
          {data.content.map((u) => {
            const expired = isExpired(u.expiresAt);

            return (
              <div
                key={u.id}
                className="relative border border-[#2e3044] rounded-lg p-4 bg-[#1a1b24] hover:bg-[#222330] transition-colors"
              >
                {/* ❌ DELETE */}
                <button
                  onClick={() => handleDelete(u.id)}
                  className="absolute top-3 right-3 text-[#cf7c82] text-sm hover:text-[#e09096] hover:underline transition-colors"
                >
                  Delete
                </button>

                {/* 🔗 TITLE */}
                <h3 className="text-sm font-semibold text-[#d1d3de] mb-1">
                  {u.shortCode}
                </h3>

                {/* 🌐 ORIGINAL URL */}
                <p className="text-xs text-[#6c6c82] truncate mb-2">
                  {u.originalUrl}
                </p>

                {/* 🔗 SHORT URL + ACTIONS */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    disabled={expired}
                    onClick={() => handleShortClick(u.shortUrl)}
                    className={`
                      text-sm font-medium
                      ${
                        expired
                          ? "text-[#5d5f73] cursor-not-allowed"
                          : "text-[#8b9cf0] hover:text-[#a0adf0] hover:underline"
                      }
                    `}
                  >
                    {u.shortUrl}
                  </button>

                  <button
                    onClick={() => handleCopy(u.shortUrl)}
                    className="
                      text-xs px-2 py-1
                      border border-[#2e3044] rounded
                      text-[#8b8da0]
                      bg-[#222330] hover:bg-[#272833]
                      transition-colors
                    "
                  >
                    Copy
                  </button>
                </div>

                {/* 📊 META */}
                <div className="flex flex-wrap gap-6 mt-3 text-xs text-[#6c6c82]">
                  <span>
                    <strong className="text-[#8b8da0]">Clicks:</strong> {u.accessCount}
                  </span>

                  <span>
                    <strong className="text-[#8b8da0]">Expiry:</strong>{" "}
                    {formatExpiry(u.expiresAt)}
                    {expired && (
                      <span className="ml-1 text-[#cf7c82]">(Expired)</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>


        {/* 📄 PAGINATION */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            disabled={data.first}
            onClick={() => setPage((p) => p - 1)}
            className={data.first
              ? "text-[#5d5f73] bg-[#1a1b24] px-3 py-1.5 rounded-md cursor-not-allowed"
              : "text-[#8b8da0] bg-[#1a1b24] border border-[#2e3044] px-3 py-1.5 rounded-md hover:bg-[#272833] transition-colors"}
          >
            ← Prev
          </button>

          <span className="px-3 py-1.5 text-sm text-[#6c6c82]">
            Page {data.number + 1} of {data.totalPages}
          </span>

          <button
            disabled={data.last}
            onClick={() => setPage((p) => p + 1)}
            className={data.last
              ? "text-[#5d5f73] bg-[#1a1b24] px-3 py-1.5 rounded-md cursor-not-allowed"
              : "text-[#8b8da0] bg-[#1a1b24] border border-[#2e3044] px-3 py-1.5 rounded-md hover:bg-[#272833] transition-colors"}
          >
            Next →
          </button>
        </div>
      </>
    )}
  </div>
);

}
