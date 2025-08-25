// src/lib/api.ts
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function toJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiGet(path: string) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...authHeaders() },
    });
    const data = await toJson(res);
    const error = res.ok ? undefined : (data?.detail || data?.message || res.statusText);
    return { ok: res.ok, data, status: res.status, error };
  } catch (e: any) {
    return { ok: false, data: null, status: 0, error: e?.message || String(e) };
  }
}

export async function apiPost<T = any>(path: string, body?: any) {
  try {
    const headers: Record<string, string> =
      body instanceof FormData
        ? { ...authHeaders() }
        : { "Content-Type": "application/json", ...authHeaders() };

    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    });

    const data = await toJson(res);
    const error = res.ok ? undefined : (data?.detail || data?.message || res.statusText);
    return { ok: res.ok, data, status: res.status, error } as { ok: boolean; data: T; status: number; error?: string };
  } catch (e: any) {
    return { ok: false, data: null as any, status: 0, error: e?.message || String(e) };
  }
}
