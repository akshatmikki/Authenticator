"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Toggle state
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwt_expiration");
    setIsLoggedIn(false);
    if (pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [router, pathname]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("jwt");
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">My App</h1>

      {/* ✅ Mobile Menu Button */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
        {menuOpen ? "✖️" : "☰"}
      </button>

      {/* ✅ Menu Items */}
      <div className={`md:flex space-x-4 ${menuOpen ? "block" : "hidden"} md:block`}>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-700">
              Logout
            </button>
            <a href="/addpost" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700">
              Create Post
            </a>
            <a href="/posts" className="bg-green-500 px-3 py-1 rounded hover:bg-green-700">
              All Posts
            </a>
          </>
        ) : (
          <>
            <a href="/register" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700">Register</a>
            <a href="/login" className="bg-green-500 px-3 py-1 rounded hover:bg-green-700">Login</a>
          </>
        )}
      </div>
    </nav>
  );
}
