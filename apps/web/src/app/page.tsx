"use client";

import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8">
      <h1 className="text-5xl font-bold text-blue-600">Welcome to LawLens</h1>
      <p className="text-lg text-gray-600 max-w-xl">
        Upload, summarize, and manage your legal documents with ease.
      </p>
      <div className="flex gap-4">
        <Link href="/upload">
          <AnimatedButton variant="primary">Upload PDF</AnimatedButton>
        </Link>
        <Link href="/learn-more">
          <AnimatedButton variant="secondary">Learn More</AnimatedButton>
        </Link>
      </div>
    </div>
  );
}
