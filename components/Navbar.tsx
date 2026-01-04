"use client";

import { useRouter } from "next/navigation";

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          className="text-2xl md:hidden"
        >
          ☰
        </button>

        <h1 className="font-bold text-lg">TinyURL Dashboard</h1>
      </div>

      <button
        onClick={logout}
        className="text-red-600 font-medium"
      >
        Logout
      </button>
    </header>
  );
}
