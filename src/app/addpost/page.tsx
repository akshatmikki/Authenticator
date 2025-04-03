"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Show loading state

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Unauthorized. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      const res = await axios.post(
        "https://asyncxeno.app.n8n.cloud/webhook/eb971ec1-445d-4af9-9b84-3cd5ea2190d4",
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", res.data);

      if (res.data.success) {
        setContent(""); // Clear input
        setTimeout(() => router.push("/posts"), 1000); // Redirect after showing success message
      } else {
        setError(res.data.message || "Failed to create post.");
      }
    } catch (err) {
      setError("Error creating post. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Post</h2>

      {error && <p className="text-red-500 text-center mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-300"
          rows={4}
          required
        />
        <button 
          type="submit" 
          className={`w-full text-white p-2 rounded-md transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
