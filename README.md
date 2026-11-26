# Signet Example App

A working example of [Signet](https://github.com/shakibdshy/signet-auth), a secure-by-default
authentication library for Go, built the way a real product would use it: every capability is a
**user flow** you complete end-to-end in the browser — real accounts, real emails, real sessions.
Nothing simulated.

- Docs: <https://go-signet-auth.vercel.app/>
- Live backend: <https://go-signet-auth.onrender.com/auth/>

## The flows

| Flow | Route |
| --- | --- |
| Sign up — email, username, password | `/sign-up` |
| Email verification | `/verify-email` (lands from the emailed link) |
| Sign in — email *or* username + password | `/sign-in` |
| Magic link sign-in | `/sign-in/magic-link` → emailed link → `/auth/callback` |
| One-time-code sign-in | `/sign-in/otp` |
| Password reset | `/forgot-password` → emailed link → `/reset-password` |
| Account — profile, "last signed in via …", sessions, sign out | `/account` (sign-in required) |

The [playground](apps/web/src/app/playground) keeps the old API-testing console alive as a
developer tool: every Signet endpoint, callable, with its status badges. The main app no longer
points flows at it.

## Quickstart

```bash
bun install
bun run dev
```

Open <http://localhost:3001>. One command starts the Next.js app; there is no local Go server.
The frontend reaches the deployed backend through a same-origin route-handler proxy at
`/api/signet/*` (also reachable as `/auth/*` for emailed links), which forwards cookies, CSRF
headers and `Set-Cookie` values. This is necessary because the deployment has no CORS headers and
Signet uses cookie sessions.

## Email-driven flows

Verification, magic-link, one-time-code and reset emails are sent by the backend itself. On the
current deployment they use the console mailer — tokens land in the **Render service logs** — so
until SMTP is configured, every flow stays completable through manual token entry in the UI.

To make the emails real (SMTP mailer, `AppURL` pointed at this app, redirect allowlist), see
[docs/deploy-config.md](docs/deploy-config.md). See
[docs/adr/0001-real-user-flows-over-api-showcase.md](docs/adr/0001-real-user-flows-over-api-showcase.md)
for why the example pivoted from an API showcase to user flows.

## Configuration

`apps/web/.env.schema` defines `SIGNET_BACKEND_URL`, defaulting to the deployed backend. Override
it in your local environment to point the app at a different Signet deployment. Run
`bun run env:generate` after editing the schema.

## Scripts

- `bun run dev` — start the frontend
- `bun run build` — production build
- `bun run check-types` — typecheck every workspace
- `bun test` — proxy and catalog invariant tests
