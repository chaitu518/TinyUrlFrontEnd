"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <>
      {/* Overlay (mobile only) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed z-50 md:static top-0 left-0 h-full w-64
          bg-white border-r p-4
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Dashboard</h2>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="text-xl md:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            onClick={onClose}
            className={linkClass("/dashboard")}
          >
            Overview
          </Link>

          <Link
            href="/dashboard/urls"
            onClick={onClose}
            className={linkClass("/dashboard/urls")}
          >
            My URLs
          </Link>
        </nav>
      </aside>
    </>
  );
}
