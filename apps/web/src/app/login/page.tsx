"use client";

import { useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import AnimatedButton from "@/components/AnimatedButton";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await apiPost("/auth/login", { email, password });
    if (!res.ok) {
      setError(res.error || "Login failed");
      return;
    }

    // save token
    const token = (res.data as any)?.access_token;
    if (!token) {
      setError("No token returned");
      return;
    }
    localStorage.setItem("token", token);

    // fetch user
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
      <h1 className="text-2xl font-bold mb-6">Log In</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          Log In
        </AnimatedButton>
      </form>
    </div>
  );
}
