"use client";

export type UrlMetric = {
  expiresAt: string | null;
};

type UrlMetricsProps = {
  urls: UrlMetric[];
};

export default function UrlMetrics({ urls }: UrlMetricsProps) {
  const now = Date.now();

  const total = urls.length;

  const expired = urls.filter((u) => {
    if (!u.expiresAt) return false;
    return new Date(u.expiresAt).getTime() < now;
  }).length;

  const active = total - expired;

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard label="Total URLs" value={total} />
      <MetricCard label="Active URLs" value={active} />
      <MetricCard label="Expired URLs" value={expired} />
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white border rounded p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
