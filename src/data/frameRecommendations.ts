import { TFaceShape } from '@/types/face';
import type { ProductType } from '@/data/frameData';
import { FALLBACK_FRAME_PRODUCTS, type FrameCatalogShape } from '@/data/frameData';

/** Eyeglass frame shapes recommended for each detected face shape (single source of truth). */
export const frameRecommendationsByFaceShape: Record<TFaceShape, FrameCatalogShape[]> = {
  Oval: ['Square', 'Round'],
  Heart: ['Round', 'Pilot'],
  Round: ['Rectangle', 'Square'],
  Angular: ['Round', 'Oval'],
  Diamond: ['Round', 'Square'],
};

function assertRecommendationsReferenceCatalog(catalog: Record<string, ProductType[] | undefined>) {
  for (const list of Object.values(frameRecommendationsByFaceShape)) {
    for (const shape of list) {
      const row = catalog[shape];
      if (!row?.length) {
        throw new Error(
          `[frameRecommendations] "${shape}" must exist in catalog with at least one SKU`,
        );
      }
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  assertRecommendationsReferenceCatalog(FALLBACK_FRAME_PRODUCTS);
}

/** Dev-only: warn if a loaded catalog is missing SKUs for recommended shapes. */
export function warnIfRecommendationsMissing(catalog: Record<string, ProductType[] | undefined>) {
  if (process.env.NODE_ENV !== 'development') return;
  for (const list of Object.values(frameRecommendationsByFaceShape)) {
    for (const shape of list) {
      const row = catalog[shape];
      if (!row?.length) {
        console.warn(`[frameRecommendations] loaded catalog missing products for shape "${shape}"`);
      }
    }
  }
}
