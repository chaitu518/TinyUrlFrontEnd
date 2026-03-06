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
    `block px-4 py-2 rounded transition-colors ${
      pathname === path
        ? "bg-[#5c6bc0]/15 text-[#a0adf0] font-semibold border-l-2 border-[#7c8ade]"
        : "text-[#8b8da0] hover:bg-[#272833] hover:text-[#d1d3de]"
    }`;

  return (
    <>
      {/* Overlay (mobile only) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed z-50 md:static top-0 left-0 h-full w-64
          bg-[#1e1f27] border-r border-[#2e3044] p-4
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-[#d1d3de]">Dashboard</h2>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="text-xl md:hidden text-[#8b8da0] hover:text-[#d1d3de]"
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
