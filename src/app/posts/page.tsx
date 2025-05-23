"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Posts() {
  const [posts, setPosts] = useState<{ post: string; id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          setError("Unauthorized. Redirecting to login...");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        const res = await axios.get(
          "https://asyncxeno.app.n8n.cloud/webhook/19bcbda5-6497-478b-b2dc-68b0f4848fa2",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Response:", res.data); // Debugging step

        // 🔹 Adjusted structure based on API response
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          setPosts(res.data.data);
        } else {
          setError("No posts available.");
        }
      } catch (err) {
        setError("Failed to fetch posts. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">All Posts</h2>

      {error && <p className="text-red-500 text-center mb-3">{error}</p>}

      {loading ? (
        <p className="text-gray-500 text-center">Loading posts...</p>
      ) : posts.length ? (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="p-3 border rounded-md shadow-sm hover:shadow-md transition"
            >
              {post.post}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No posts available.</p>
      )}
    </div>
  );
}
