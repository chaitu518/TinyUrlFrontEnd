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
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-xl font-bold"
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
