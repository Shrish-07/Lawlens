"use client";

import { useState } from "react";
import AnimatedButton from "@/components/AnimatedButton";
import { apiPost } from "@/lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiPost("/pdf/upload", formData);
    if (res.ok) {
      setMessage("Upload successful!");
    } else {
      setMessage(`Upload failed: ${res.error || "Unknown error"}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Upload PDF</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <div className="mt-4">
        <AnimatedButton variant="primary" onClick={handleUpload}>
          Upload
        </AnimatedButton>
      </div>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
