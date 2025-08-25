"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import AnimatedButton from "@/components/AnimatedButton";

export default function SummarizePage() {
  const searchParams = useSearchParams();
  const pdfIdFromUrl = searchParams.get("id");

  const [pdfId, setPdfId] = useState(pdfIdFromUrl || "");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSummarize = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setErr(null);
    setSummary("");
    try {
      // Backend expects GET /pdf/summarize/{pdf_id}
      const res = await apiGet(`/pdf/summarize/${id}`);
      if (res.ok) {
        setSummary(res.data?.summary || "");
      } else {
        setErr(res.error || "Failed to summarize");
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  // Auto-run if id is in URL
  useEffect(() => {
    if (pdfIdFromUrl) {
      handleSummarize(pdfIdFromUrl);
    }
  }, [pdfIdFromUrl]);

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Summarize PDF</h1>

      {!pdfIdFromUrl && (
        <>
          <input
            type="text"
            placeholder="Enter PDF ID"
            className="p-2 border rounded w-full"
            value={pdfId}
            onChange={(e) => setPdfId(e.target.value)}
          />
          <div className="mt-4">
            <AnimatedButton variant="primary" onClick={() => handleSummarize(pdfId)}>
              Summarize
            </AnimatedButton>
          </div>
        </>
      )}

      {loading && <p className="mt-4 text-gray-500">Summarizing...</p>}
      {err && <p className="mt-4 text-red-500">{err}</p>}

      {summary && !loading && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2">Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
