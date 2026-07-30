import { getEyeglassCatalogUrl } from '@/config/eyeglassCatalog';
import type { ProductType } from '@/data/frameData';
import { FALLBACK_FRAME_PRODUCTS } from '@/data/frameData';

function parseRow(row: unknown): ProductType | null {
  if (!row || typeof row !== 'object') return null;
  const o = row as Record<string, unknown>;
  if (typeof o.name !== 'string' || typeof o.vendor !== 'string' || typeof o.src !== 'string') {
    return null;
  }
  return { name: o.name, vendor: o.vendor, src: o.src };
}

/** Parses remote JSON into shape → products; invalid entries are skipped. */
export function parseEyeglassCatalogJson(raw: unknown): Record<string, ProductType[]> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: Record<string, ProductType[]> = {};
  for (const [shape, rows] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(rows)) continue;
    const items = rows.map(parseRow).filter((x): x is ProductType => x !== null);
    if (items.length) out[shape] = items;
  }
  return out;
}

/**
 * Remote entries override fallback only when they have at least one valid SKU
 * (so a bad JSON patch does not wipe a shape).
 */
export function mergeEyeglassCatalog(parsed: Record<string, ProductType[]>): Record<string, ProductType[]> {
  const merged: Record<string, ProductType[]> = { ...FALLBACK_FRAME_PRODUCTS };
  for (const [k, v] of Object.entries(parsed)) {
    if (v.length) merged[k] = v;
  }
  return merged;
}

export async function fetchEyeglassCatalog(): Promise<Record<string, ProductType[]>> {
  const res = await fetch(getEyeglassCatalogUrl(), { cache: 'no-store' });
  if (!res.ok) return { ...FALLBACK_FRAME_PRODUCTS };
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return { ...FALLBACK_FRAME_PRODUCTS };
  }
  return mergeEyeglassCatalog(parseEyeglassCatalogJson(json));
}
