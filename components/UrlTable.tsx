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

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this URL?")) return;
    await authApi.delete(`/api/url/${id}`);
    fetchUrls();
  };

  /* ================= UI ================= */

  if (loading) return <p>Loading...</p>;

  if (!data || data.content.length === 0) {
    return <p className="text-sm text-gray-500">No URLs found</p>;
  }

  return (
    <div className="bg-white border rounded p-4">
      <table className="w-full text-sm">
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
                 <button
                  disabled={expired}
                  onClick={() => window.open(u.shortUrl, "_blank")}
                  className={`
                    relative inline-flex items-center gap-1
                    px-3 py-1.5 rounded-md
                    text-sm font-medium
                    transition-all duration-200 ease-in-out
                    ${
                      expired
                        ? "text-gray-400 cursor-not-allowed"
                        : `
                          text-blue-600
                          border border-blue-200
                          bg-blue-50
                          hover:bg-blue-100
                          hover:border-blue-300
                          hover:text-blue-700
                          active:scale-95
                        `
                    }
                  `}
                >
                  Click here
                </button>
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

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-6">
        {/* PREV */}
        <button
          disabled={data.first}
          onClick={() => setPage((p) => p - 1)}
          className={`
            px-3 py-1.5 rounded-md
            text-sm font-medium
            transition-all duration-200
            ${
              data.first
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 active:scale-95"
            }
          `}
        >
          ← Prev
        </button>

      {/* PAGE INFO */}
        <span className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md">
          Page <span className="text-gray-900">{data.number + 1}</span> of{" "}
          <span className="text-gray-900">{data.totalPages}</span>
        </span>

        {/* NEXT */}
        <button
          disabled={data.last}
          onClick={() => setPage((p) => p + 1)}
          className={`
            px-3 py-1.5 rounded-md
            text-sm font-medium
            transition-all duration-200
            ${
              data.last
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 active:scale-95"
            }
          `}
        >
          Next →
        </button>
      </div>

    </div>
  );
}
