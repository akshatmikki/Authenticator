"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Move handleLogout outside useEffect
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
      const expiration = localStorage.getItem("jwt_expiration");

      if (!token || !expiration || Date.now() > Number(expiration)) {
        handleLogout(); // Now accessible
      } else {
        setIsLoggedIn(true);
      }
    };

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 60000);
    return () => clearInterval(interval);
  }, [handleLogout]); // ✅ Add handleLogout as a dependency

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-xl font-bold">My App</h1>
      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
            <a href="/addpost" className="bg-blue-500 px-3 py-1 rounded">
              Create Post
            </a>
            <a href="/posts" className="bg-green-500 px-3 py-1 rounded">
              All Posts
            </a>
          </>
        ) : (
          <>
            <a href="/register" className="bg-blue-500 px-3 py-1 rounded">Register</a>
            <a href="/login" className="bg-green-500 px-3 py-1 rounded">Login</a>
          </>
        )}
      </div>
    </nav>
  );
}
