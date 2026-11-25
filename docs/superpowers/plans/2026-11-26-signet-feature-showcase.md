# Signet Feature Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js Showcase that presents every shipped Signet capability from a real frontend, calling the deployed backend through a same-origin proxy with honest status labeling.

**Architecture:** The browser only talks to a Next.js route-handler proxy at `/api/signet/*`; the proxy forwards to `https://go-signet-auth.onrender.com/auth/*`, relaying cookies and rewriting `Origin`. A typed client and React provider manage session state. A static feature catalog drives a sidebar-grouped explorer, with a shared flow-panel component for live calls and capability cards for library-only features.

**Tech Stack:** Next.js 16.4.6 App Router, React 19.3.1, TypeScript 6, Tailwind CSS v4, shared shadcn/ui (base-lyra), Bun 1.4.3 + `bun test`, Varlock env integration, `@shakibdshy/signet-auth-client@1.0.0-beta`, `@shakibdshy/signet-auth-react@1.0.0-beta`.

**Spec:** `docs/superpowers/specs/2026-11-26-signet-feature-showcase-design.md` and published issue https://github.com/shakibdshy/signet-auth-example/issues/1.

## Global Constraints

- Backend base URL default: `https://go-signet-auth.onrender.com/auth`. No backend changes, no local Go server, no CORS changes.
- Client `baseURL` is the proxy path `/api/signet` (relative, same-origin). The proxy adds the backend `/auth` prefix by forwarding to the configured base URL.
- Never simulate success. Every capability is a LIVE flow, a GATED flow, or a capability/documented-only card.
- Demo account: `demo@signet.dev` / `SignetDemo!2026`, public and non-sensitive; if taken, pick a unique variant and update the README.
- Destructive calls require explicit confirmation and steer to a throwaway account; never run them against the shared Demo account.
- Never auto-probe state-changing endpoints for status badges; static catalog plus opt-in read-only recheck.
- Next.js 16 conventions: async request APIs, route handlers, Turbopack default, no `next lint`, `proxy.ts` if a proxy file is ever needed.
- Use glossary vocabulary in code, docs and UI copy: Showcase, Feature area, Live flow, Gated feature, Dev inbox, Demo account, Status badge.
- Verify with `bun run check-types`, `bun test`, and `bun run build` before claiming completion.

## Review Focus

- **Cold start / slow upstream**: the backend can take 10–20s to wake; the proxy must use a generous timeout and the UI must show a loading state rather than a false failure. Test: proxy test asserts timeout/abort path returns an error response rather than hanging; browser walkthrough verifies loading UI.
- **CSRF rotation and cookie relay**: sign-in rotates the CSRF token; the proxy must relay every `Set-Cookie` and the client must use the token from the sign-in response. Test: proxy test asserts multiple `Set-Cookie` headers are forwarded verbatim and request cookies/CSRF header are sent upstream.
- **`Secure` cookie on `http://localhost`**: browsers treat localhost as a secure context, but this must be verified in the browser; if cookies are dropped, the app must report it clearly. Test: manual browser walkthrough of signup → signin → `me` → signout.
- **Gated 403/404 honesty**: privileged endpoints return `forbidden`, OAuth start returns `not found`; the UI must show NEEDS ROLE / NEEDS SERVER CONFIG instead of a broken spinner. Test: catalog invariant test asserts every GATED entry has a reason and docs link; browser walkthrough checks one 403 panel.
- **Shared-account damage**: destructive actions could break the Demo account for every reader. Test: guardrail inspection in the browser walkthrough; no automated test executes a destructive call against the Demo account.

---

### Task 1: Dependencies and environment contract

**Files:**
- Modify: `package.json` (catalog + `apps/web` dependencies)
- Modify: `apps/web/.env.schema`
- Modify: `README.md`

**Interfaces:**
- Produces: `SIGNET_BACKEND_URL` available through the generated `ENV` accessor, default `https://go-signet-auth.onrender.com/auth`.
- Produces: `@shakibdshy/signet-auth-react` and `@shakibdshy/signet-auth-client` installed at `1.0.0-beta`.

- [ ] **Step 1: Add the typed clients to the Bun catalog and `apps/web` dependencies; run `bun install`**
- [ ] **Step 2: Add `SIGNET_BACKEND_URL` to `apps/web/.env.schema` with default `https://go-signet-auth.onrender.com/auth` and regenerate env types (`bun run env:generate`)**
- [ ] **Step 3: Rewrite `README.md` with quickstart, demo credential, status-badge legend, and the note that the demo account is public/non-sensitive**
- [ ] **Step 4: Verify `bun run check-types` passes**

### Task 2: Proxy boundary (the single test seam)

**Files:**
- Create: `apps/web/src/lib/signet-proxy.ts`
- Create: `apps/web/src/lib/signet-proxy.test.ts`
- Create: `apps/web/src/app/api/signet/[...path]/route.ts`

**Interfaces:**
- Consumes: `ENV.SIGNET_BACKEND_URL`.
- Produces: `forwardSignet(request: Request, backendURL: string, fetchImpl?: typeof fetch): Promise<Response>` — pure forwarding function with injectable fetch.
- Produces: route handlers `GET/POST/PUT/PATCH/DELETE` at `/api/signet/[...path]`.

- [ ] **Step 1: Write failing tests for method/path/query forwarding, request body pass-through, cookie + `X-CSRF-Token` forwarding, `Origin` rewritten to backend origin, multiple `Set-Cookie` relay, upstream status/body passthrough, upstream failure, and the 60s timeout/abort path**
- [ ] **Step 2: Run `bun test apps/web/src/lib/signet-proxy.test.ts`; confirm failure**
- [ ] **Step 3: Implement `forwardSignet` with a generous timeout (60s), `redirect: 'manual'`, hop-by-hop header filtering, and error mapping**
- [ ] **Step 4: Add route handlers delegating to `forwardSignet` with the configured backend URL**
- [ ] **Step 5: Run tests again; confirm pass**
- [ ] **Step 6: Commit**

### Task 3: Typed client and session provider

**Files:**
- Create: `apps/web/src/lib/signet-client.ts`
- Create: `apps/web/src/components/signet-session-provider.tsx`
- Modify: `apps/web/src/components/providers.tsx`
- Modify: `apps/web/src/app/layout.tsx`

**Interfaces:**
- Consumes: `createSignetClient`, `SignetProvider`, `useSession` from the installed packages.
- Produces: a singleton `signetClient` with `baseURL: '/api/signet'`; a provider that performs one `GET /me` on mount.

- [ ] **Step 1: Inspect the installed package type declarations and record the exact method signatures used by the app**
- [ ] **Step 2: Create the singleton client with `baseURL: '/api/signet'`**
- [ ] **Step 3: Wrap the app in `SignetProvider` inside the existing providers component**
- [ ] **Step 4: Update root metadata and keep theme/toast providers intact**
- [ ] **Step 5: Verify `bun run check-types` passes; commit**

### Task 4: Feature catalog and shared showcase components

**Files:**
- Create: `apps/web/src/lib/catalog.ts`, `apps/web/src/lib/catalog.test.ts`
- Create: `apps/web/src/components/showcase/status-badge.tsx`, `endpoint-chip.tsx`, `docs-link.tsx`, `code-snippet.tsx`, `capability-card.tsx`, `feature-page.tsx`, `flow-panel.tsx`, `dev-inbox.tsx`, `guarded-action.tsx`

**Interfaces:**
- Produces: `FeatureArea` and `Capability` types; `FEATURE_AREAS` catalog with every shipped capability, status, endpoint or card type, docs link and code snippet.
- Produces: shared components used by all feature pages.

- [ ] **Step 1: Write failing invariant tests: every capability has a valid status, a docs link, and either an endpoint or a declared card type; each shipped capability from the status page appears exactly once**
- [ ] **Step 2: Run `bun test apps/web/src/lib/catalog.test.ts`; confirm failure**
- [ ] **Step 3: Define the catalog types and data, grouping capabilities into Feature areas**
- [ ] **Step 4: Build the shared components with keyboard-accessible controls, responsive layout and glossary vocabulary**
- [ ] **Step 5: Run tests and typecheck; confirm pass; commit**

### Task 5: Auth entry experience

**Files:**
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/components/header.tsx`
- Create: `apps/web/src/components/auth/sign-in-form.tsx`, `sign-up-form.tsx`, `two-factor-form.tsx`, `passwordless-form.tsx`, `demo-account-card.tsx`

**Interfaces:**
- Consumes: singleton client, `useSession()`, shared components from Task 4.
- Produces: a working sign-up / sign-in / passwordless / passkey entry experience with a two-factor challenge branch and demo credential helper.

- [ ] **Step 1: Build the landing page with a short explainer and a tabbed auth card**
- [ ] **Step 2: Implement sign-up and sign-in with error mapping from `SignetApiError`**
- [ ] **Step 3: Implement the two-factor challenge branch using the typed client then `refresh()`**
- [ ] **Step 4: Implement magic-link and email-OTP forms with Dev inbox token inputs**
- [ ] **Step 5: Implement passkey sign-in and the demo account helper**
- [ ] **Step 6: Verify in the browser: signup → signin → `me` → signout; commit**

### Task 6: Dashboard shell and navigation

**Files:**
- Create: `apps/web/src/app/(showcase)/layout.tsx`
- Create: `apps/web/src/components/showcase/sidebar.tsx`, `user-menu.tsx`
- Create: `apps/web/src/app/(showcase)/overview/page.tsx`

**Interfaces:**
- Consumes: `FEATURE_AREAS`, `useSession()`.
- Produces: authenticated dashboard shell with grouped sidebar, user menu, sign-out and overview page.

- [ ] **Step 1: Build the sidebar from the catalog with active-route highlighting and mobile collapse**
- [ ] **Step 2: Build the user menu with sign-out and session status**
- [ ] **Step 3: Build the overview page with capability counts, badge legend and docs links**
- [ ] **Step 4: Verify `bun run build` and browser navigation; commit**

### Task 7: Core identity feature areas

**Files:**
- Create: `apps/web/src/app/(showcase)/core/page.tsx`, `sessions/page.tsx`, `verification/page.tsx`, `passwordless/page.tsx`

**Interfaces:**
- Consumes: shared components, singleton client, `useSession()`.
- Produces: callable flows for sign-up/sign-in/last-method, session listing/revocation, verification/reset/email-change, and passwordless.

- [ ] **Step 1: Build the Core page with sign-up, sign-in, sign-out, `me` and last-sign-in-method flows**
- [ ] **Step 2: Build the Sessions page with list/revoke/session/all-sessions flows and read-only recheck**
- [ ] **Step 3: Build the Verification page with Dev inbox inputs and honest NEEDS SERVER CONFIG labels for token retrieval**
- [ ] **Step 4: Build the Passwordless page with magic-link and OTP flows**
- [ ] **Step 5: Verify LIVE flows in the browser; commit**

### Task 8: Security and account feature areas

**Files:**
- Create: `apps/web/src/app/(showcase)/two-factor/page.tsx`, `passkeys/page.tsx`, `account/page.tsx`

**Interfaces:**
- Consumes: shared components, singleton client.
- Produces: 2FA, passkey and account-control pages with GATED labels where the deployment denies access.

- [ ] **Step 1: Build the Two-factor page with enable/verify/disable/regenerate flows**
- [ ] **Step 2: Build the Passkeys page with registration, discoverable sign-in, listing and deletion, marked NEEDS ROLE for the demo account**
- [ ] **Step 3: Build the Account page with linked accounts, unlink, email change, password change and deletion, all behind `GuardedAction`**
- [ ] **Step 4: Verify guardrails and badge accuracy in the browser; commit**

### Task 9: Application-managed authorization feature areas

**Files:**
- Create: `apps/web/src/app/(showcase)/api-keys/page.tsx`, `organizations/page.tsx`, `admin/page.tsx`

**Interfaces:**
- Consumes: shared components, singleton client.
- Produces: API-key, organization and admin pages marked NEEDS ROLE, with real calls behind confirmation.

- [ ] **Step 1: Build the API keys page with create/list/verify/revoke flows**
- [ ] **Step 2: Build the Organizations page with create/list/members/roles/active-organization flows**
- [ ] **Step 3: Build the Admin page with user listing, roles, ban/unban, impersonation and stop-impersonating**
- [ ] **Step 4: Verify that a 403 is rendered as NEEDS ROLE with docs link, not an unhandled error; commit**

### Task 10: Authorization server and enterprise identity areas

**Files:**
- Create: `apps/web/src/app/(showcase)/authorization-server/page.tsx`, `oauth/page.tsx`, `enterprise/page.tsx`

**Interfaces:**
- Consumes: shared components, singleton client.
- Produces: auth-server/device-flow, OAuth and SSO/SAML/SCIM panels with accurate LIVE/GATED/CONFIG labels.

- [ ] **Step 1: Build the Authorization server page with PKCE authorize/token and device authorize/approve/token flows**
- [ ] **Step 2: Build the OAuth page with `oauthStart` and NEEDS SERVER CONFIG for the unconfigured providers**
- [ ] **Step 3: Build the Enterprise page with SSO connections, SAML start and a SCIM capability card**
- [ ] **Step 4: Verify badge accuracy in the browser; commit**

### Task 11: Library-level capability cards and audit note

**Files:**
- Create: `apps/web/src/app/(showcase)/library/page.tsx`, `audit/page.tsx`

**Interfaces:**
- Consumes: `CapabilityCard`, catalog entries without browser-callable endpoints.
- Produces: honest docs-only surfaces for storage adapters, mailers, Go API, security controls, rate limits, trusted proxies, key rings, JWKS, automatic sign-in and Go-only audit methods.

- [ ] **Step 1: Build the Library page from capability-card entries with docs links**
- [ ] **Step 2: Build the Audit page explaining that audit querying is a Go API method, not an HTTP endpoint**
- [ ] **Step 3: Verify every shipped capability from the status page appears somewhere in the Showcase; commit**

### Task 12: Polish and verification

**Files:**
- Modify: `packages/ui/src/styles/globals.css`, `apps/web/src/app/(showcase)/layout.tsx`, `README.md`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a polished, accessible, responsive Showcase with verified build.

- [ ] **Step 1: Apply dark-first design tokens, refined type scale, consistent iconography and restrained depth**
- [ ] **Step 2: Check keyboard navigation, focus states, labels and reduced-motion behaviour**
- [ ] **Step 3: Run `bun test`, `bun run check-types`, `bun run build`; confirm all pass**
- [ ] **Step 4: Walk through one LIVE flow, one GATED flow and one capability card in the browser**
- [ ] **Step 5: Commit and report results**
