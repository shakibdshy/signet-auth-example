/**
 * Same-origin bridge to the deployed Signet backend.
 *
 * The browser only ever talks to this proxy, so real cookie sessions and the
 * library's signed double-submit CSRF keep working without CORS on the backend.
 */

export type FetchLike = (request: Request) => Promise<Response>;

const PROXY_PREFIX = "/api/signet";
// Emailed links point at {AppURL}/auth/... and a next.config rewrite lands them
// on this proxy with their original path preserved, so strip that prefix too.
const LINK_PREFIX = "/auth";
const TIMEOUT_MS = 60_000;

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const BODYLESS_METHODS = new Set(["GET", "HEAD"]);

function isAbort(error: unknown): boolean {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}

export async function forwardSignet(
  request: Request,
  backendURL: string,
  fetchImpl: FetchLike = (forwarded) => fetch(forwarded),
): Promise<Response> {
  const backend = new URL(backendURL);
  const incoming = new URL(request.url);

  const prefix = [PROXY_PREFIX, LINK_PREFIX].find((candidate) =>
    incoming.pathname.startsWith(candidate),
  );
  const suffix = prefix
    ? incoming.pathname.slice(prefix.length)
    : incoming.pathname;
  const upstreamURL = new URL(
    `${backend.pathname.replace(/\/$/, "")}${suffix.startsWith("/") ? suffix : `/${suffix}`}`,
    backend.origin,
  );
  upstreamURL.search = incoming.search;

  const upstreamHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) upstreamHeaders.set(key, value);
  });
  upstreamHeaders.set("origin", backend.origin);

  const init: RequestInit = {
    method: request.method,
    headers: upstreamHeaders,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  };
  if (!BODYLESS_METHODS.has(request.method.toUpperCase())) {
    init.body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetchImpl(new Request(upstreamURL, init));
  } catch (error) {
    if (isAbort(error)) {
      return Response.json(
        { error: "gateway_timeout", message: "Signet backend did not respond in time" },
        { status: 504 },
      );
    }
    return Response.json(
      { error: "bad_gateway", message: "Signet backend is unreachable" },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) responseHeaders.set(key, value);
  });

  // Headers.forEach collapses duplicate Set-Cookie values, so copy them explicitly.
  responseHeaders.delete("set-cookie");
  const cookies = upstream.headers.getSetCookie();
  for (const cookie of cookies) responseHeaders.append("set-cookie", cookie);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
