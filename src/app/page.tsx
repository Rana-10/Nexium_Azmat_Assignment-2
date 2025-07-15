'use client';

import { useState } from 'react';

export default function BlogForm() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/summarise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server responded with error:", errorText);
      alert("Failed to summarise: " + errorText);
      return;
    }

    const data = await res.json();
    console.log("Summary response:", data);
    setSummary(data.summary);
  } catch (err: any) {
    console.error("Fetch failed:", err);
    alert("Network or code error: " + err.message);
  }
};

  return (
    <div className="p-4 max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter blog URL"
          className="border p-2 rounded w-full"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Summarising...' : 'Summarise'}
        </button>
      </form>

      {summary && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
