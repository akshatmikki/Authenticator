"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.post(
        "https://asyncxeno.app.n8n.cloud/webhook/eb971ec1-445d-4af9-9b84-3cd5ea2190d4",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", res.data); 

      if (res.data.success) {
        setContent(""); 
        setError(""); 
        router.push("/posts"); 
      } else {
        setError(res.data.message || "Failed to create post.");
      }
    } catch (err) {
      setError("Error creating post.");
      console.error("Error:", err);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Create Post</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">Post</button>
      </form>
    </div>
  );
}
