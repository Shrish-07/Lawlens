"use client";

import { useEffect, useState } from "react";
import { apiGet, API_BASE } from "@/lib/api";
import AnimatedButton from "@/components/AnimatedButton";
import { useRouter } from "next/navigation";

type Item = { id: number; filename: string };

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true);
      setErr(null);
      try {
        const res = await apiGet("/pdf/list");
        if (res.ok) {
          const arr = Array.isArray(res.data?.pdfs) ? res.data.pdfs : [];
          setItems(arr);
        } else {
          setErr(res.error || "Failed to fetch files");
        }
      } catch (e: any) {
        setErr(e?.message || "Failed to fetch files");
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  // Download with Authorization header
  const handleDownload = async (id: number, filename: string) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const res = await fetch(`${API_BASE}/pdf/download/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Download failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `file-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.message || "Download failed");
      console.error(e);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {err && <p className="text-red-500 mb-4">{err}</p>}

      {items.length === 0 && !err && (
        <p className="text-gray-500">No PDFs uploaded yet.</p>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm"
          >
            <span>{item.filename}</span>
            <div className="flex gap-2">
              {/* Bubble Download Button */}
              <AnimatedButton
                variant="secondary"
                onClick={() => handleDownload(item.id, item.filename)}
              >
                Download
              </AnimatedButton>

              {/* Bubble Summarize Button - navigates to summarize with id */}
              <AnimatedButton
                variant="primary"
                onClick={() => router.push(`/summarize?id=${item.id}`)}
              >
                Summarize
              </AnimatedButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
