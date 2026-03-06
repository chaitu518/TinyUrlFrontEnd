"use client";

import { useRouter } from "next/navigation";

type NavbarProps = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#2e3044] bg-[#1e1f27]">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-xl font-bold text-[#d1d3de]"
        >
          ☰
        </button>

        <h1 className="font-bold text-lg text-[#d1d3de]">TinyURL Dashboard</h1>
      </div>

      <button
        onClick={logout}
        className="text-[#cf7c82] font-medium hover:text-[#e09096] transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
