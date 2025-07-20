'use client';
import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';


const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert('📋 Summary copied to clipboard!');
};

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
      const res = await fetch('/api/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.error) {
        alert('Server Error: ' + data.error);
      } else {
        setSummary(data.summary);
        setUrduSummary(data.urduSummary);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center animate-gradient px-4 py-10 font-sans">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-xl border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          ✨ Blog Summarizer & Urdu Translator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Paste a blog URL here..."
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500 text-sm bg-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition duration-200 font-medium text-sm tracking-wide"
            disabled={loading}
          >
            {loading ? 'Summarising...' : 'Summarise'}
          </button>
        </form>
        {/* <div className="mt-10 bg-green-100 border border-green-300 text-green-800 text-sm rounded-xl px-6 py-4 w-fit mx-auto shadow">
  Your English and Urdu summaries are being safely stored in our database. Copyright © {new Date().getFullYear()} All Rights Reserved.
</div> */}
<div className="mt-12 flex items-center justify-center animate-fade-in">
  <div className="bg-blue-50 border border-blue-300 text-blue-800 px-5 py-3 rounded-lg shadow-sm flex items-center gap-2 text-sm">
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2"
      viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    Your summaries (English & Urdu) are being securely stored in our database. Copyright © {new Date().getFullYear()} All Rights Reserved.
  </div>
</div>

        {(summary || urduSummary) && (
          <div className="mt-8">
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="english">🇬🇧 English Summary</TabsTrigger>
                <TabsTrigger value="urdu">🇵🇰 Urdu Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="english">
                <div className="p-4 bg-white border border-gray-300 rounded-xl">
                  <h2 className="font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
                    📘 English Summary
                  </h2>
                  <p className="text-gray-800 leading-relaxed text-sm">{summary}</p>
                  <button
                    onClick={() => copyToClipboard(summary)}
                    className="mt-3 text-blue-600 text-sm underline hover:text-blue-800"
                  >
                    Copy English Summary
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="urdu">
                <div className="p-4 bg-white border border-gray-300 rounded-xl">
                  <h2 className="font-semibold mb-2 text-gray-700 text-sm uppercase tracking-wide">
                    🌐 Urdu Summary
                  </h2>
                  <p className="text-gray-800 leading-relaxed text-sm urdu-text text-right">{urduSummary}</p>
                  <button
                    onClick={() => copyToClipboard(urduSummary)}
                    className="mt-3 text-blue-600 text-sm underline hover:text-blue-800 float-left"
                  >
                    Copy Urdu Summary
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
    
  );
}
