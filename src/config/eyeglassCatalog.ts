/**
 * Dynamic eyewear catalog — URL resolution only (single patch surface).
 *
 * Priority:
 * 1. `NEXT_PUBLIC_EYEGLASS_CATALOG_URL` — full URL (any origin, e.g. CDN JSON)
 * 2. `NEXT_PUBLIC_ASSET_CDN_BASE` + {@link EYEGLASS_CATALOG_PUBLIC_PATH}
 * 3. Same-origin {@link EYEGLASS_CATALOG_PUBLIC_PATH} (`public/data/eyeglass-models.json`)
 */
export const EYEGLASS_CATALOG_PUBLIC_PATH = '/data/eyeglass-models.json' as const;

function joinCdnBase(base: string, path: string): string {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

export function getEyeglassCatalogUrl(): string {
  const override = process.env.NEXT_PUBLIC_EYEGLASS_CATALOG_URL?.trim();
  if (override) return override;

  const cdn = process.env.NEXT_PUBLIC_ASSET_CDN_BASE?.trim();
  if (cdn) return joinCdnBase(cdn, EYEGLASS_CATALOG_PUBLIC_PATH);

  return EYEGLASS_CATALOG_PUBLIC_PATH;
}
