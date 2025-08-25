"use client";
import { useEffect, useState } from "react";
import { listPdfs } from "../lib/pdf";

export default function PdfList() {
  const [pdfs, setPdfs] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPdfs() {
      const data = await listPdfs();
      setPdfs(data);
    }
    fetchPdfs();
  }, []);

  return (
    <ul className="mt-6 space-y-2">
      {pdfs.map((pdf, i) => (
        <li key={i} className="p-2 border rounded">
          {pdf}
        </li>
      ))}
    </ul>
  );
}
