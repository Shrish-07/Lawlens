"use client";

import Link from "next/link";
import AnimatedButton from "./AnimatedButton";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-6 bg-white shadow-md">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        LawLens
      </Link>

      <nav className="flex gap-3">
        {user ? (
          <>
            <Link href="/upload">
              <AnimatedButton variant="secondary">Upload</AnimatedButton>
            </Link>
            <Link href="/dashboard">
              <AnimatedButton variant="secondary">Dashboard</AnimatedButton>
            </Link>
            <Link href="/summarize">
              <AnimatedButton variant="secondary">Summarize</AnimatedButton>
            </Link>
            <AnimatedButton variant="primary" onClick={logout}>
              Logout
            </AnimatedButton>
          </>
        ) : (
          <>
            <Link href="/login">
              <AnimatedButton variant="primary">Log In</AnimatedButton>
            </Link>
            <Link href="/signup">
              <AnimatedButton variant="secondary">Sign Up</AnimatedButton>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
