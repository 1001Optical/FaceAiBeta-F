/**
 * Browser URL for face API routes.
 *
 * - **Default (recommended for HTTPS frontend):** relative `/api/v1/...` — Next.js
 *   `rewrites` proxies to `BACKEND_URL` on the server → no mixed content.
 * - **Direct:** set `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5001` for local dev).
 *   Do not use plain `http://` API from an `https://` site (browser will block it).
 */
export function faceApiUrl(path: string): string {
  const segment = path.replace(/^\//, '').replace(/^api\/v1\/?/, '');
  const direct = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (direct) {
    return `${direct.replace(/\/$/, '')}/api/v1/${segment}`;
  }
  return `/api/v1/${segment}`;
}
