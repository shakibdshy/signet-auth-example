# Signet Feature Showcase — Design

## Intent

Shakib built Signet, a secure-by-default embeddable auth library for Go. Every roadmap
phase is shipped, but the library deliberately has **no bundled dashboard**. This project
is the missing public face: a polished example application that shows, from a real
frontend, every capability the library implements. A developer should be able to clone
it, run one command, and understand Signet's breadth in a few minutes.

The application is a showcase and a learning companion at once: it demonstrates real
auth flows a user can feel (sign up, sign in, sessions, passkeys) and exposes the wider
API surface (organizations, admin, device flow, SCIM) in an explorable form.

## Goals

- Represent **every shipped capability** from the status page somewhere in the UI.
- Make each capability **actually call the Signet client** — no simulated success.
- Be honest about what the deployed backend permits: label a flow **LIVE**, **NEEDS ROLE**,
  or **NEEDS SERVER CONFIG** based on the backend's real response.
- Provide a genuine user-facing auth experience (sign up / sign in / passwordless /
  passkey) leading into an authenticated dashboard.
- Keep every screen tied to the official docs with contextual links and exact endpoint chips.
- Run with a single `bun run dev`.

## Non-goals

- No local Go server, no changes to the deployed Go service.
- No embedded docs viewer and no custom marketing site.
- No faking 403/404 responses to make a feature look live.
- No i18n, no anomaly detection, no features Signet does not implement.

## Anti-goals (what would make this a failure)

- A pretty UI that never talks to Signet.
- A showcase that silently omits enterprise/auth-server capabilities.
- A demo that tricks a viewer into thinking an unconfigured feature works.
- Storing session/CSRF tokens in `localStorage` or handling CSRF manually when the typed
  client already does it.

## Constraints (verified against the live deployment on 2026-11-26)

- Backend: `https://go-signet-auth.onrender.com/auth/`. Live Go service, `/healthz` 200,
  cold starts of roughly 10–20 seconds.
- **No CORS.** Responses carry no `Access-Control-Allow-Origin`; `OPTIONS` preflight returns
  `400 invalid_input`. A browser on another origin cannot call it directly.
- Cookies are `__Host-signet_csrf` and `__Host-signet_session`, `Secure`, `SameSite=Lax`;
  sign-in **rotates** the CSRF token. A same-origin browser path is required.
- Verified facts about feature availability on that deployment:
  - LIVE: `csrf-token`, `signup`, `signin`, `signout`, `me`, `sessions`, `accounts`,
    `last-sign-in-method`, `token`, `/private`, plus the authorization-server and device
    flow endpoints (they return protocol errors, not 404/403).
  - NEEDS ROLE (403 `forbidden` for the demo account): passkeys, API keys, organizations,
    admin users, impersonation, SSO, SAML.
  - NEEDS SERVER CONFIG: `oauth/start` returns `404 not_found` — no OAuth providers configured.
  - Email verification is not enforced; sign-in succeeds for an unverified account.
- No dev outbox and no `/dev/*` bridge endpoints exist. Tokens delivered by email must be
  pasted manually from the server logs. `QueryAudit`, `SetPassword`, `VerifyPassword` and
  `UpdateUser` have no HTTP endpoints in Signet at all, so they are documented rather than
  invoked.
- Frontend scaffold: fresh Better-T-Stack monorepo — Next.js 16.4.6 App Router, React 19.3.1,
  Tailwind CSS v4, TypeScript 6, Bun 1.4.3 workspaces, Varlock env integration, shared
  shadcn/ui (`base-lyra`, Base UI primitives) in `packages/ui`. This Next.js version has
  breaking changes; agent guides in `node_modules/next/dist/docs/` must be read before code.
- Typed clients: `@shakibdshy/signet-auth-client` and `@shakibdshy/signet-auth-react` at
  `1.0.0-beta`. The client handles CSRF caching/rotation and sends credentials; `baseURL`
  must include the `/auth` prefix.
- Browser and backend must appear same-origin. The deployed backend cannot be modified.

## Approaches considered

1. **Vendored local Go server.** Full control; could enable every feature and add an outbox.
   Rejected: the user already has a deployed backend and explicitly does not want a second one.
2. **Direct cross-origin fetch from the browser.** Rejected: no CORS headers and a `400`
   preflight; cookie sessions cannot cross origins anyway.
3. **Next.js server-side route-handler proxy (chosen).** The browser calls `/api/signet/*` on
   its own origin; a route handler forwards to the deployed backend, copies request headers
   and cookies, rewrites `Origin` to the backend origin, and relays `Set-Cookie` back. This
   preserves real cookie/CSRF behaviour with zero changes to the deployed service. Next.js
   `rewrites` were considered as a lighter variant but give less control over headers.
4. **UI shape (chosen):** a real sign-in/sign-up entry experience plus an authenticated
   dashboard with a sidebar-grouped explorer. A single long page was rejected because ~70
   endpoints would be unnavigable; a bare dashboard was rejected because it would hide the
   user-facing side of auth.

## Decisions made

- **Backend**: use the deployed service only. No vendored server, no backend edits.
- **Bridge**: a Next.js route-handler proxy, with backend base URL in the Varlock env schema.
- **Coverage**: every shipped capability gets a UI surface with real client calls. Each
  feature carries a status badge derived from actual backend behaviour.
- **Email tokens**: a "Dev inbox" panel with a token/link input on verification, reset,
  magic-link and OTP flows, plus a hint to read the Render logs. No simulation.
- **Demo account**: one documented account on the deployed backend — `demo@signet.dev` with
  password `SignetDemo!2026` — clearly labeled as public and non-sensitive. If that address is
  already taken on the deployment, the builder picks a unique variant and updates the README.
- **Docs**: contextual "View docs" links, method/path chips, and copyable snippets; a
  top-level Docs link to `https://go-signet-auth.vercel.app/`.
- **Look**: polished dark developer-tool aesthetic with a light toggle, refined type scale,
  consistent iconography, restrained depth, responsive down to mobile.
- **Auth state**: `@shakibdshy/signet-auth-react` `SignetProvider` + `useSession()` for reactive
  state; 2FA flows use the typed client directly because `signIn()` does not handle challenges.

## Resolutions from builder review

These were decisions a builder would otherwise have to guess at. They are settled here.

- **Coverage scope**: "represented" means one of three honest forms — a callable live/gated flow,
  a capability card for library-only features with no browser path (storage adapters, mailers,
  Go API, rate limits, trusted proxies, hardening, defensive controls), or a documented-only
  note for Go-only methods (`QueryAudit`, `SetPassword`, `VerifyPassword`, `UpdateUser`).
  SCIM, SAML and SSO get real UI panels but are labeled GATED because the deployment denies them.
- **Email tokens**: a reader without Render access cannot complete verification, reset, magic-link
  or OTP flows. Those flows fire the real request and display a token/link input, and are labeled
  NEEDS SERVER CONFIG for that reader. No simulated completion.
- **Status badges**: a static catalog derived from the verified 2026-11-26 snapshot. An explicit
  "recheck" action may probe **read-only** endpoints (`me`, `sessions`, `accounts`,
  `last-sign-in-method`) to refresh session state. Never auto-probe state-changing endpoints:
  cold starts add 10–20s, probes have side effects, and a signed-out reader has no permissions
  to reflect.
- **Mutating shared state**: dangerous calls against the shared demo account must be guarded —
  see the open question below.
- **Deployment**: the backend URL is a Varlock value defaulting to the deployed URL, so the app
  runs locally and can be published without code changes. Publishing the demo credential is a
  deliberate, documented choice.

## Left to the builder

- Exact component and file breakdown, field-level forms, and the explorer's page taxonomy.
- Styling details and the visual treatment of status badges.
- Test strategy and verification commands.
- Copy for individual screens, keeping it short and faithful to Signet's vocabulary.
