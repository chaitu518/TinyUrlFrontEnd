"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#16171d] text-[#d1d3de]">

      {/* 🔝 FIXED NAVBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
      </header>

      {/* 🧱 LAYOUT BELOW NAVBAR */}
      <div className="flex pt-16">

        {/* 📌 FIXED SIDEBAR */}
        <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-40">
          <Sidebar open onClose={() => {}} />
        </aside>

        {/* 📱 MOBILE SIDEBAR */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* 📄 SCROLLABLE CONTENT */}
        <main
          className="
            flex-1
            ml-0 lg:ml-64
            p-6
            h-[calc(100vh-4rem)]
            overflow-y-auto
          "
        >
          {children}
        </main>

      </div>
    </div>
  );
}
