"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icons for menu

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwt_expiration");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
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
    <nav className="p-3 bg-gray-800 text-white flex justify-between items-center relative">
      <h1 className="text-xl font-bold">My App</h1>

      {/* ✅ Hamburger Menu (Only on Mobile) */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* ✅ Menu for Mobile & Desktop */}
      <div
        className={`absolute md:relative top-14 left-0 w-full md:w-auto md:flex items-center space-x-4 p-4 bg-gray-800 md:bg-transparent transition-all ${
          isMenuOpen ? "block" : "hidden"
        } md:block`}
      >
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="block md:inline bg-red-500 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
            <Link
              href="/addpost"
              className="block md:inline bg-blue-500 px-3 py-1 rounded hover:bg-blue-700"
            >
              Create Post
            </Link>
            <Link
              href="/posts"
              className="block md:inline bg-green-500 px-3 py-1 rounded hover:bg-green-700"
            >
              All Posts
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/register"
              className="block md:inline bg-blue-500 px-3 py-1 rounded hover:bg-blue-700"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="block md:inline bg-green-500 px-3 py-1 rounded hover:bg-green-700"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
