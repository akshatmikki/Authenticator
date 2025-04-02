"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://asyncxeno.app.n8n.cloud/webhook/ca570426-3c74-4cd6-8a66-2a26d8d8ecac", { username, password });
  
      if (res.data?.data?.token) {
        localStorage.setItem("jwt", res.data.data.token);
        localStorage.setItem("jwt_expiration", (Date.now() + 5 * 60 * 1000).toString()); 
        router.push("/posts");
      } 
      else {
        setError("Invalid response from server.");
      }
  } 
  catch (err: unknown) { 
    if (axios.isAxiosError(err)) {
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.message || "Invalid credentials.");
    } else {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    }
  }
};


  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-3">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 border" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">Login</button>
      </form>
    </div>
  );
}
