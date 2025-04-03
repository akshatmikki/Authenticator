"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
      <nav className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>

        {/* ✅ Toggle Menu for Mobile */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* ✅ Desktop Menu */}
        <div className="hidden lg:flex space-x-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-700 transition-all"
              >
                Logout
              </button>
              <a
                href="/addpost"
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 transition-all"
              >
                Create Post
              </a>
              <a
                href="/posts"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-700 transition-all"
              >
                All Posts
              </a>
            </>
          ) : (
            <>
              <a
                href="/register"
                className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-700"
              >
                Register
              </a>
              <a
                href="/login"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-700"
              >
                Login
              </a>
            </>
          )}
        </div>
      </nav>

      {/* ✅ Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-800 p-4 text-center">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="block bg-red-500 px-3 py-1 rounded hover:bg-red-700 w-full mb-2"
              >
                Logout
              </button>
              <a
                href="/addpost"
                className="block bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 w-full mb-2"
              >
                Create Post
              </a>
              <a
                href="/posts"
                className="block bg-green-500 px-3 py-1 rounded hover:bg-green-700 w-full"
              >
                All Posts
              </a>
            </>
          ) : (
            <>
              <a
                href="/register"
                className="block bg-blue-500 px-3 py-1 rounded hover:bg-blue-700 w-full mb-2"
              >
                Register
              </a>
              <a
                href="/login"
                className="block bg-green-500 px-3 py-1 rounded hover:bg-green-700 w-full"
              >
                Login
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
