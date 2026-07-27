// Pre-generates the per-shape result images that the QR code points at.
//
// It screenshots the REAL /result/[shape] page (capture mode hides the action
// buttons + loading overlay), cropped to the content column (738px, the cards),
// so the QR opens a faithful image of the result page itself.
//
// Usage:
//   1) frontend dev server must be running (yarn dev on :3000)
//   2) yarn capture:results            # all 5 shapes
//      yarn capture:results Oval       # one shape (for previewing)
//
// Output: public/result-images/<Shape>.png

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'result-images');

const ALL_SHAPES = ['Diamond', 'Heart', 'Oval', 'Angular', 'Round'];
const BASE = process.env.CAPTURE_BASE_URL ?? 'http://localhost:3000';

// Design is a fixed 810px-wide column. Using viewport width 810 makes
// ResponsiveContainer's scale() resolve to 1, so element coordinates are 1:1.
// Tall height keeps all content on-screen (scale stays 1). The 36px side gutter
// (px-9) is cropped so only the 738px card column remains.
const VIEWPORT = { width: 810, height: 3200 };
const SIDE_GUTTER = 36; // px-9 design gutter (max bg available on each side at vw=810)
const CONTENT_WIDTH = 738; // 810 - 36*2 (the card column)
const SIDE_MARGIN = 30; // small bg breathing room on each side of the cards
const TOP_MARGIN = 30; // breathing room above the header
const BOTTOM_MARGIN = 30; // breathing room under the last card

const shapes = process.argv.slice(2).length ? process.argv.slice(2) : ALL_SHAPES;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });

await mkdir(OUT_DIR, { recursive: true });

for (const shape of shapes) {
  const url = `${BASE}/result/${shape}?capture=1`;
  await page.goto(url, { waitUntil: 'networkidle' });
  const root = page.locator('#capture-root');
  await root.waitFor({ state: 'visible' });
  await page.waitForTimeout(800); // let fonts/lottie/images settle

  const box = await root.boundingBox();
  if (!box) throw new Error(`no #capture-root box for ${shape}`);

  // Crop to the card column (738px) plus a small symmetric bg margin on every
  // side. The page itself is untouched — only the captured rectangle changes.
  const x = box.x + (SIDE_GUTTER - SIDE_MARGIN);
  const width = CONTENT_WIDTH + SIDE_MARGIN * 2;
  const y = Math.max(0, box.y - TOP_MARGIN);
  const height = box.y + box.height + BOTTOM_MARGIN - y;

  const out = join(OUT_DIR, `${shape}.png`);
  await page.screenshot({ path: out, clip: { x, y, width, height } });
  console.log(`saved ${out}  (${Math.round(width)}x${Math.round(height)} css px @2x)`);
}

await browser.close();
