const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export interface UploadResult {
  id: string;
  url: string;
  original_filename: string;
  content_type: string;
  size_bytes: number;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/upload`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Upload failed");
  }
  return res.json();
}

export function imageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `http://localhost:8000${path}`;
}
