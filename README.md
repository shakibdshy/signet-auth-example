# Signet Feature Showcase

A working frontend for [Signet](https://github.com/shakibdshy/signet-auth), a secure-by-default
authentication library for Go. Signet intentionally ships no dashboard; this is the missing face —
a public example that shows every shipped capability from the browser, calls the real API, and
says plainly when a capability needs configuration.

- Docs: <https://go-signet-auth.vercel.app/>
- Live backend: <https://go-signet-auth.onrender.com/auth/>
- Spec: [issue #1](https://github.com/shakibdshy/signet-auth-example/issues/1)

## Quickstart

```bash
bun install
bun run dev
```

Open <http://localhost:3001>. One command starts the Next.js app; there is no local Go server.
The frontend reaches the deployed backend through a same-origin route-handler proxy at
`/api/signet/*`, which forwards cookies, CSRF headers and `Set-Cookie` values. This is necessary
because the deployment has no CORS headers and Signet uses cookie sessions.

## Demo account

```
demo@signet.dev
SignetDemo!2026
```

This credential is public and non-sensitive. Use it for read-only and safe flows only. For
anything destructive — password change, email change, deletion, session revocation, 2FA changes,
organization or admin writes — create your own throwaway account through the sign-up form. The UI
puts those calls behind a confirmation for exactly this reason.

## Status badges

| Badge | Meaning |
| --- | --- |
| **Live** | The flow completes against the deployed backend. |
| **Needs role** | The endpoint exists, but an Authorizer denies this account. |
| **Needs server config** | No provider or email-token source is configured on this deployment. |
| **Library** | A Go-library capability with no browser-callable endpoint. |

Verification, password reset, magic links and OTPs really call the backend. Their tokens are
mailed to the server log, so an outside reader cannot finish them — the Dev inbox input accepts a
pasted token if you can read those logs. Nothing here simulates success.

## What is covered

Thirteen Feature areas: core identity, sessions, verification and recovery, passwordless, second
factor, passkeys, OAuth sign-in, authorization server, organizations, API keys, admin and
impersonation, enterprise identity, and library internals. A static catalog drives the sidebar,
badges, endpoint chips and docs links. An opt-in "read-only recheck" probes only safe endpoints.

## Configuration

`apps/web/.env.schema` defines `SIGNET_BACKEND_URL`, defaulting to the deployed backend. Override
it in your local environment to point the Showcase at a different Signet deployment. Run
`bun run env:generate` after editing the schema.

## Scripts

- `bun run dev` — start the frontend
- `bun run build` — production build
- `bun run check-types` — typecheck every workspace
- `bun test` — proxy and catalog invariant tests
