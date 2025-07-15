'use client';

import { useState } from "react";

export default function BlogForm() {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/summarise", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    console.log("Summary:", data.summary);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        placeholder="Enter blog URL"
        className="border p-2 rounded w-full"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
        Summarise
      </button>
    </form>
  );
}
