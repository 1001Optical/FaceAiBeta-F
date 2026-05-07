import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/** Vercel Pro: raise if uploads + EC2 are slow. Hobby max is typically 10s. */
export const maxDuration = 60;

const defaultBackend = 'http://54.252.234.32:5001';

/**
 * Override with `BACKEND_URL` in `.env` / Vercel. No trailing slash.
 * Default points at the shared API host on port 5001.
 */
function backendBase(): string {
  const fromEnv = process.env.BACKEND_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  return defaultBackend;
}

function forwardHeaders(request: NextRequest): Headers {
  const out = new Headers();
  for (const key of ['content-type', 'accept', 'authorization']) {
    const v = request.headers.get(key);
    if (v) out.set(key, v);
  }
  return out;
}

/** Node/undici only says "fetch failed"; real reason is usually on `cause` (ECONNREFUSED, etc.). */
function describeUpstreamFailure(e: unknown): string {
  const parts: string[] = [];
  let cur: unknown = e;
  let depth = 0;
  while (cur != null && depth < 8) {
    if (cur instanceof Error) {
      parts.push(cur.message);
      const ne = cur as NodeJS.ErrnoException & { address?: string; port?: number };
      if (ne.code) parts.push(`code=${ne.code}`);
      if (ne.syscall) parts.push(`${ne.syscall}`);
      if (ne.address !== undefined) parts.push(`addr=${ne.address}`);
      if (ne.port !== undefined) parts.push(`port=${ne.port}`);
      cur = ne.cause;
    } else {
      parts.push(typeof cur === 'object' ? JSON.stringify(cur) : String(cur));
      break;
    }
    depth += 1;
  }
  return parts.join(' | ');
}

async function proxy(request: NextRequest, pathSegments: string[]) {
  const base = backendBase();
  const path = pathSegments.join('/');
  const target = `${base}/api/v1/${path}${request.nextUrl.search}`;

  const body =
    request.method === 'GET' || request.method === 'HEAD'
      ? undefined
      : await request.arrayBuffer();

  let res: Response;
  try {
    res = await fetch(target, {
      method: request.method,
      headers: forwardHeaders(request),
      body:
        body !== undefined && body.byteLength > 0 ? body : undefined,
    });
  } catch (e) {
    const detail = describeUpstreamFailure(e);
    console.error('[api/v1 proxy] fetch failed:', target, detail, e);
    return Response.json(
      {
        error: 'upstream_unreachable',
        target,
        detail,
      },
      { status: 502 },
    );
  }

  const outHeaders = new Headers();
  const ct = res.headers.get('content-type');
  if (ct) outHeaders.set('content-type', ct);

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: outHeaders,
  });
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(request, path ?? []);
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(request, path ?? []);
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
