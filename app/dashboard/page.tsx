"use client";

import { useState, useRef } from "react";
import { authApi } from "@/lib/AuthApi";
import QRCode from "react-qr-code";

type Mode = "link" | "qr";

export default function DashboardPage() {
  const [mode, setMode] = useState<Mode>("link");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [error, setError] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  /* ---- Link creation (stored) ---- */
  const createQuickLink = async () => {
    if (!url.trim()) {
      setError("Destination URL is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await authApi.post("/api/url", { url });

      setShortUrl(res.data.shortUrl);
      setUrl("");
    } catch {
      setError("Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  /* ---- QR code generation (client-side only, not stored) ---- */
  const generateQr = () => {
    if (!url.trim()) {
      setError("Destination URL is required");
      return;
    }
    setError("");
    setQrValue(url.trim());
  };

  /* ---- Helpers ---- */
  const copyLink = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard");
  };

  const downloadQr = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.download = "qrcode.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleCreate = () => {
    if (mode === "link") createQuickLink();
    else generateQr();
  };

  return (
    <>
      {/* CENTER CONTENT */}
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md bg-[#1e1f27] border border-[#2e3044] rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-center text-[#d1d3de]">
            Quick Create
          </h2>

          {/* TOGGLE */}
          <div className="flex bg-[#1a1b24] border border-[#2e3044] rounded-lg p-1 mb-4">
            <button
              onClick={() => { setMode("link"); setQrValue(null); setError(""); }}
              className={`
                flex-1 py-1.5 text-sm font-medium rounded-md transition-all
                ${mode === "link"
                  ? "bg-[#5c6bc0] text-[#eaebf2] shadow"
                  : "text-[#8b8da0] hover:text-[#d1d3de]"
                }
              `}
            >
              Short Link
            </button>
            <button
              onClick={() => { setMode("qr"); setShortUrl(null); setError(""); }}
              className={`
                flex-1 py-1.5 text-sm font-medium rounded-md transition-all
                ${mode === "qr"
                  ? "bg-[#5c6bc0] text-[#eaebf2] shadow"
                  : "text-[#8b8da0] hover:text-[#d1d3de]"
                }
              `}
            >
              QR Code
            </button>
          </div>

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Enter destination URL"
            className="
              w-full
              border border-[#2e3044]
              bg-[#1a1b24]
              text-[#d1d3de]
              placeholder-[#5d5f73]
              px-4 py-2
              rounded-md
              text-sm
              mb-3
              focus:outline-none
              focus:ring-2
              focus:ring-[#7c8ade]/40
            "
          />

          {error && (
            <p className="text-[#cf7c82] text-sm mb-3">{error}</p>
          )}

          <button
            onClick={handleCreate}
            disabled={loading}
            className="
              w-full
              bg-[#5c6bc0]
              text-[#eaebf2]
              py-2
              rounded-md
              text-sm
              font-semibold
              hover:bg-[#6a79ce]
              active:scale-95
              transition
            "
          >
            {loading
              ? "Creating..."
              : mode === "link"
                ? "Create Link"
                : "Generate QR Code"
            }
          </button>

          {/* INLINE QR RESULT (not stored) */}
          {qrValue && mode === "qr" && (
            <div className="mt-5 flex flex-col items-center gap-3">
              <div
                ref={qrRef}
                className="bg-white p-4 rounded-lg inline-block"
              >
                <QRCode value={qrValue} size={180} />
              </div>

              <p className="text-xs text-[#6c6c82] text-center max-w-[260px] truncate">
                {qrValue}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={downloadQr}
                  className="
                    px-4 py-1.5 text-sm font-medium
                    bg-[#5c6bc0] text-[#eaebf2]
                    rounded-md hover:bg-[#6a79ce]
                    active:scale-95 transition
                  "
                >
                  Download PNG
                </button>

                <button
                  onClick={() => setQrValue(null)}
                  className="
                    px-4 py-1.5 text-sm
                    border border-[#2e3044] text-[#8b8da0]
                    rounded-md hover:bg-[#272833]
                    transition-colors
                  "
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LINK RESULT MODAL */}
      {shortUrl && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-[#1e1f27] border border-[#2e3044] w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2 text-center text-[#d1d3de]">
              🎉 Link Created
            </h3>

            <p className="text-sm text-[#8b8da0] text-center mb-4">
              Your short URL is ready
            </p>

            <div className="flex items-center gap-2 mb-4">
              <input
                readOnly
                value={shortUrl}
                className="flex-1 border border-[#2e3044] bg-[#1a1b24] text-[#d1d3de] px-3 py-2 rounded text-sm"
              />

              <button
                onClick={copyLink}
                className="
                  px-3 py-2
                  text-sm
                  border border-[#2e3044]
                  text-[#d1d3de]
                  rounded-md
                  hover:bg-[#272833]
                  transition-colors
                "
              >
                Copy
              </button>
            </div>

            <button
              onClick={() => setShortUrl(null)}
              className="
                w-full
                bg-[#272833]
                text-[#8b8da0]
                py-2
                rounded-md
                text-sm
                hover:bg-[#2f303d]
                transition-colors
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
