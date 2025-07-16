'use client';
import { useState } from 'react';

export default function BlogForm() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [urduSummary, setUrduSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary('');
    setUrduSummary('');

    try {
      const res = await fetch("/api/summarise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json(); // this line fails if res is not valid JSON

      if (data.error) {
        alert("Server Error: " + data.error);
      } else {
        setSummary(data.summary);
        setUrduSummary(data.urduSummary);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
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
          <h2 className="font-bold mb-2">📘 English Summary:</h2>
          <p>{summary}</p>

          <h2 className="font-bold mb-2 mt-4">🌐 Urdu Summary:</h2>
          <p>{urduSummary}</p>
        </div>
      )}
    </div>
  );
}
