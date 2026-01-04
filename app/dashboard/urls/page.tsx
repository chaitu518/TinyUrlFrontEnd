"use client";

import { useState } from "react";
import UrlForm from "@/components/UrlForm";
import UrlTable from "@/components/UrlTable";
import UrlMetrics from "@/components/UrlMetrics";

export default function UrlsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [urls, setUrls] = useState<any[]>([]);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My URLs</h2>

      {/* Metrics */}
      <UrlMetrics urls={urls} />

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: URL TABLE */}
        <div className="lg:col-span-2">
          <UrlTable
            refreshKey={refreshKey}
            onDataLoaded={setUrls}
          />
        </div>

        {/* RIGHT: CREATE FORM */}
        <div className="lg:col-span-1">
          <UrlForm onSuccess={triggerRefresh} />
        </div>

      </div>
    </div>
  );
}
