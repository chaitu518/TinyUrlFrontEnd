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
        <h2 className="text-2xl font-bold text-[#d1d3de]">My URLs</h2>

        <button
          onClick={() => setOpen(true)}
          className="
            px-4 py-2
            bg-[#5c6bc0] text-[#eaebf2]
            font-semibold
            rounded-md
            hover:bg-[#6a79ce]
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
      <div className="rounded-lg border border-[#2e3044] p-4 bg-[#1e1f27] shadow-lg">
        <UrlTable refreshKey={refreshKey} onDataLoaded={setUrls} />
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#1e1f27] border border-[#2e3044] rounded-lg shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#d1d3de]">
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
