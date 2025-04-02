"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Posts() {
  const [posts, setPosts] = useState<{ data: { post: string; id: string }[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          setError("Unauthorized. Please log in.");
          return;
        }

        const res = await axios.get("https://asyncxeno.app.n8n.cloud/webhook/19bcbda5-6497-478b-b2dc-68b0f4848fa2", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(res.data); 
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">All Posts</h2>
      {posts?.data?.length ? (
        <ul>
          {posts.data.map((post) => (
            <li key={post.id} className="p-2 border my-2">{post.post}</li>
          ))}
        </ul>
      ) : (
        <p>Loading posts...</p>
      )}
    </div>
  );
}
