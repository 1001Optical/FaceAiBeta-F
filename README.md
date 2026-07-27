# AI FACE DETECTION

This is a document for [AI FACE DETECTION](https://1001face-ai.vercel.app)

### Getting Started
```shell
# npm
npm run dev
# yarn
yarn dev
```

## QR share flow

After a scan, the result page (`/result/[shape]`) lets users take their
recommendation with them via two entry points, both pointing at the same
landing page:

- **QR Code** button — opens `DynamicQrModal`, which renders a styled QR at
  runtime (dot modules, circular finder eyes, brand teal frame, center shape
  icon) using [`qr-code-styling`](https://www.npmjs.com/package/qr-code-styling).
  Error correction is set to `H` so the center logo never breaks scannability.
- **Share** button — uses the Web Share API (shown only on supported
  browsers, mostly mobile/tablet) to share the landing URL directly.

Both target `/share/[shape]` — the landing page that shows the pre-generated
result image plus brand CTA links (Shop, Find Nearest Store, Instagram).

### Editing the landing links

CTA links live in a single source of truth: `src/config/socialLinks.ts`.
Edit there only.

### Generating the result images

The QR/landing shows a faithful screenshot of the result page, pre-generated
per shape into `public/result-images/<Shape>.png`.

```shell
# dev server must be running on :3000 first
yarn capture:results          # all 5 shapes
yarn capture:results Oval     # a single shape
```

The script (`scripts/capture-results.mjs`) screenshots the real
`/result/[shape]` page in capture mode (action buttons + loading overlay
hidden) via Playwright. Re-run it whenever the result page design changes.
