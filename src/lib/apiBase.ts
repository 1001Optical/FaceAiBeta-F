/**
 * Browser URL for face API routes.
 *
 * Vercel / HTTPS site (e.g. https://1001face-ai-preview.vercel.app):
 * - Do **not** set `NEXT_PUBLIC_API_URL` to your EC2 `http://…` URL — the browser
 *   would call HTTP from an HTTPS page (mixed content).
 * - Use relative `/api/v1/…` (leave `NEXT_PUBLIC_API_URL` unset).
 * - Set **`BACKEND_URL`** to override (optional; default `http://54.252.234.32:5001`).
 *
 * Local dev hitting API directly: `NEXT_PUBLIC_API_URL=http://localhost:5001`
 */
export function faceApiUrl(path: string): string {
  const segment = path.replace(/^\//, '').replace(/^api\/v1\/?/, '');
  const direct = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (direct) {
    return `${direct.replace(/\/$/, '')}/api/v1/${segment}`;
  }
  return `/api/v1/${segment}`;
}
