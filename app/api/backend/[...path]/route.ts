import { NextResponse } from "next/server";

function getBackendBaseUrl(): string {
  // Prefer non-public env var if provided.
  const base = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
  return base || "https://streak-api.duckdns.org";
}

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function proxy(req: Request, params: { path?: string[] }) {
  const baseUrl = getBackendBaseUrl();
  const path = (params.path || []).join("/");
  const url = new URL(req.url);

  const upstreamUrl = new URL(joinUrl(baseUrl, path));
  // Preserve querystring
  upstreamUrl.search = url.search;

  // Forward request body as-is (for POST/PATCH/etc)
  const method = req.method.toUpperCase();
  const hasBody = !(method === "GET" || method === "HEAD");
  const body = hasBody ? await req.arrayBuffer() : undefined;

  // Forward minimal headers (avoid hop-by-hop / host)
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);

  const upstreamRes = await fetch(upstreamUrl.toString(), {
    method,
    headers,
    body: body ? Buffer.from(body) : undefined,
    // Ensure we don't cache auth flows
    cache: "no-store",
  });

  // Pipe response back
  const resBody = await upstreamRes.arrayBuffer();
  const resHeaders = new Headers();

  const upstreamContentType = upstreamRes.headers.get("content-type");
  if (upstreamContentType) resHeaders.set("content-type", upstreamContentType);

  return new NextResponse(resBody, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}

export async function GET(req: Request, ctx: { params: { path?: string[] } }) {
  return proxy(req, ctx.params);
}

export async function POST(req: Request, ctx: { params: { path?: string[] } }) {
  return proxy(req, ctx.params);
}

export async function PATCH(req: Request, ctx: { params: { path?: string[] } }) {
  return proxy(req, ctx.params);
}

export async function PUT(req: Request, ctx: { params: { path?: string[] } }) {
  return proxy(req, ctx.params);
}

export async function DELETE(req: Request, ctx: { params: { path?: string[] } }) {
  return proxy(req, ctx.params);
}
