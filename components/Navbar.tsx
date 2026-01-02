"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex justify-end p-4">
      <button onClick={logout} className="text-red-600">
        Logout
      </button>
    </div>
  );
}
