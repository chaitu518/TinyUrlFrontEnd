"use client";

import { useState } from "react";
import UrlForm from "@/components/UrlForm";
import UrlTable from "@/components/UrlTable";
import UrlMetrics from "@/components/UrlMetrics";

export default function UrlsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [urls, setUrls] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My URLs</h2>

        <button
          onClick={() => setOpen(true)}
          className="
            px-4 py-2
            bg-blue-600 text-white
            rounded-md
            hover:bg-blue-700
            active:scale-95
            transition
          "
        >
          Create Link
        </button>
      </div>

      {/* METRICS */}
      <UrlMetrics urls={urls} />

      {/* TABLE */}
      <div className="rounded-lg border p-4 bg-white shadow">
        <UrlTable refreshKey={refreshKey} onDataLoaded={setUrls} />
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Create Short URL
            </h3>

            <UrlForm
              onCancel={() => setOpen(false)}
              onSuccess={() => {
                setOpen(false);
                triggerRefresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
