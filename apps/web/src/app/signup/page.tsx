"use client";

import { useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import AnimatedButton from "@/components/AnimatedButton";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const sign = await apiPost("/auth/signup", { email, password });
    if (!sign.ok) {
      setError(sign.error || "Signup failed");
      return;
    }

    // immediately log in
    const res = await apiPost("/auth/login", { email, password });
    if (!res.ok) {
      setError(res.error || "Auto login failed");
      return;
    }

    const token = (res.data as any)?.access_token;
    localStorage.setItem("token", token);

    const me = await apiGet("/auth/me");
    if (me.ok && me.data?.user) {
      login(me.data.user);
      router.push("/dashboard");
    } else {
      setError(me.error || "Failed to load user");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AnimatedButton type="submit" variant="primary">
          Sign Up
        </AnimatedButton>
      </form>
    </div>
  );
}
