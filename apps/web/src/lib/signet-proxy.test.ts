import { expect, test } from "bun:test";

import { forwardSignet } from "./signet-proxy";

const BACKEND = "https://auth.example.com/auth";

type FetchLike = (request: Request) => Promise<Response>;

test("forwards method, path, query and body to the backend", async () => {
  let seen: { url?: string; method?: string; body?: string } = {};
  const fakeFetch: FetchLike = async (request) => {
    seen = { url: request.url, method: request.method, body: await request.text() };
    return new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  };

  const incoming = new Request("http://localhost:3001/api/signet/signup?invite=1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "a@b.c" }),
  });

  const response = await forwardSignet(incoming, BACKEND, fakeFetch);

  expect(seen.url).toBe("https://auth.example.com/auth/signup?invite=1");
  expect(seen.method).toBe("POST");
  expect(seen.body).toBe('{"email":"a@b.c"}');
  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ ok: true });
});

test("rewrites Origin and forwards cookies and the CSRF header", async () => {
  let headers = new Headers();
  const fakeFetch: FetchLike = async (request) => {
    headers = request.headers;
    return new Response(null, { status: 204 });
  };

  const incoming = new Request("http://localhost:3001/api/signet/signout", {
    method: "POST",
    headers: {
      origin: "http://localhost:3001",
      cookie: "__Host-signet_session=abc",
      "x-csrf-token": "csrf-123",
      "sec-fetch-site": "same-origin",
    },
  });

  await forwardSignet(incoming, BACKEND, fakeFetch);

  expect(headers.get("origin")).toBe("https://auth.example.com");
  expect(headers.get("cookie")).toBe("__Host-signet_session=abc");
  expect(headers.get("x-csrf-token")).toBe("csrf-123");
});

test("relays every Set-Cookie header from the backend", async () => {
  const upstreamHeaders = new Headers();
  upstreamHeaders.append("set-cookie", "__Host-signet_csrf=a; Path=/; Secure");
  upstreamHeaders.append("set-cookie", "__Host-signet_session=b; Path=/; HttpOnly");
  const fakeFetch: FetchLike = async () =>
    new Response("ok", { status: 200, headers: upstreamHeaders });

  const response = await forwardSignet(
    new Request("http://localhost:3001/api/signet/signin"),
    BACKEND,
    fakeFetch,
  );

  expect(response.headers.getSetCookie()).toEqual([
    "__Host-signet_csrf=a; Path=/; Secure",
    "__Host-signet_session=b; Path=/; HttpOnly",
  ]);
});

test("passes upstream errors through unchanged", async () => {
  const fakeFetch: FetchLike = async () =>
    new Response(JSON.stringify({ error: "forbidden", message: "permission denied" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });

  const response = await forwardSignet(
    new Request("http://localhost:3001/api/signet/admin-users"),
    BACKEND,
    fakeFetch,
  );

  expect(response.status).toBe(403);
  expect(await response.json()).toEqual({ error: "forbidden", message: "permission denied" });
});

test("returns a gateway timeout when the backend aborts", async () => {
  const fakeFetch: FetchLike = async () => {
    throw new DOMException("The operation was aborted", "AbortError");
  };

  const response = await forwardSignet(
    new Request("http://localhost:3001/api/signet/me"),
    BACKEND,
    fakeFetch,
  );

  expect(response.status).toBe(504);
  expect(await response.json()).toEqual({
    error: "gateway_timeout",
    message: "Signet backend did not respond in time",
  });
});
