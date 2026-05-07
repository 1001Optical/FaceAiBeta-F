/**
 * Face API origin (no trailing slash).
 * Override with NEXT_PUBLIC_API_URL in .env (e.g. http://localhost:5001 for local API).
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://54.252.234.32:5001'
).replace(/\/$/, '');
