import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/**
 * Max wall-clock time for this function (Vercel → EC2 왕복 포함).
 * - Hobby(무료): 플랫폼 상한이 짧아서(대략 10s) 느린 업로드/추론이면 여기서 잘림 → 브라우저에서 끊김/canceled처럼 보일 수 있음.
 * - Pro 이상: 대시보드/플랜에 맞게 더 길게 쓰려면 값 올리고 재배포.
 */
export const maxDuration = 120;

const defaultBackend = 'http://15.134.136.129:5001';

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
  const started = Date.now();

  console.info('[api/v1 proxy] ->', request.method, path, { target });

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
    const ms = Date.now() - started;
    console.error('[api/v1 proxy] fetch failed:', { path, target, ms, detail, e });
    return Response.json(
      {
        error: 'upstream_unreachable',
        target,
        detail,
        proxy_duration_ms: ms,
      },
      { status: 502 },
    );
  }

  const upstreamMs = Date.now() - started;
  console.info('[api/v1 proxy] ok', { path, status: res.status, upstreamMs });

  const outHeaders = new Headers();
  const ct = res.headers.get('content-type');
  if (ct) outHeaders.set('content-type', ct);
  outHeaders.set('x-proxy-upstream-ms', String(upstreamMs));

  // Vercel에서 ReadableStream 그대로 넘기면 간헐적으로 플랫폼 502가 나는 경우가 있어 본문을 버퍼링함.
  const payload = await res.arrayBuffer();
  return new Response(payload.byteLength ? payload : null, {
    status: res.status,
    statusText: res.statusText,
    headers: outHeaders,
  });
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await ctx.params;
    return await proxy(request, path ?? []);
  } catch (e) {
    console.error('[api/v1 proxy] POST crashed', e);
    return Response.json(
      {
        error: 'proxy_internal',
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await ctx.params;
    return await proxy(request, path ?? []);
  } catch (e) {
    console.error('[api/v1 proxy] GET crashed', e);
    return Response.json(
      {
        error: 'proxy_internal',
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
