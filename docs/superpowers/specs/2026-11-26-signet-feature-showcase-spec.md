# Signet Feature Showcase — Specification

## Problem Statement

Signet is a secure-by-default, embeddable authentication library for Go. Every planned phase is
shipped, but the library deliberately provides no bundled dashboard and no CLI. A developer who
wants to understand its breadth must read a status page and an HTTP reference separately, then
imagine what the flows look like. The author has deployed a live Signet backend at
`https://go-signet-auth.onrender.com/auth/`, but that deployment has no CORS headers, so a
browser frontend on another origin cannot call it directly. Several capabilities are denied to
ordinary accounts by the configured authorizer, OAuth providers are not configured, and email
tokens go to server logs with no outbox. As a result there is no single place where a reader can
see, let alone exercise, what Signet actually does.

## Solution

Build a **Showcase**: a public example application, based on the existing Next.js 16 monorepo,
that shows every shipped Signet capability from a real frontend. The browser talks only to a
same-origin route-handler proxy that forwards to the deployed backend, preserving real cookie
and CSRF behaviour without changing the backend. The Showcase opens with a genuine sign-up /
sign-in experience and leads into an authenticated dashboard whose sidebar groups capabilities
into **Feature areas**. Each capability carries a **Status badge** — LIVE, NEEDS ROLE, or NEEDS
SERVER CONFIG — derived from verified backend behaviour, never from simulated success. Flows
that need an emailed token use a **Dev inbox** input and honestly report when the token source is
unavailable to the reader. Destructive flows steer the reader to a throwaway account created
through the public signup form rather than mutating the shared **Demo account**. Every screen links
to the official docs and shows its exact HTTP method and path.

## User Stories

1. As a developer evaluating Signet, I want a single application that shows every shipped capability, so that I can judge its breadth without reading two separate references.
2. As a visitor, I want to land on a polished screen that explains what Signet is in a sentence, so that I immediately know whether it is relevant to me.
3. As a visitor, I want a clear path to sign up, so that I can try the flows myself.
4. As a visitor, I want a documented Demo account, so that I can explore signed-in screens immediately without creating an account.
5. As a visitor, I want to know the Demo account is public and non-sensitive, so that I do not treat it as a real identity.
6. As a visitor, I want a theme toggle, so that the Showcase is comfortable in both light and dark environments.
7. As a visitor on a phone, I want the layout to remain usable, so that I can explore on any device.
8. As a visitor, I want a top-level link to the official documentation, so that I can go deeper when needed.
9. As a visitor, I want a link to the GitHub repository, so that I can inspect the library source.
10. As a visitor, I want each capability to show a Status badge, so that I know whether it will actually work against this deployment.
11. As a visitor, I want the Status badge definitions explained, so that LIVE, NEEDS ROLE and NEEDS SERVER CONFIG are unambiguous.
12. As a visitor, I want a read-only recheck action, so that I can refresh session-derived state without triggering side effects.
13. As a visitor, I want to understand that the status catalog is a verified snapshot, so that I do not expect it to auto-probe every endpoint.
14. As a prospective user, I want to sign up with email, name and password, so that I can create my own identity.
15. As a prospective user, I want clear validation feedback on sign-up, so that I know what was wrong with my input.
16. As a signed-out visitor, I want to sign in with email and password, so that I can reach the dashboard.
17. As a signed-out visitor, I want to sign in by username, so that I can see the username first factor in action.
18. As a user with two-factor enabled, I want a challenge step after sign-in, so that I can complete authentication with my TOTP code.
19. As a signed-in user, I want my session and user name shown in the header, so that I know who I am acting as.
20. As a signed-in user, I want to sign out, so that I can end my session.
21. As a signed-in user, I want to see the last sign-in method, so that I can tell which factor was used.
22. As a user, I want to request a magic link, so that I can experience passwordless sign-in.
23. As a user, I want to paste the magic-link token in the Dev inbox, so that I can complete the real verification call.
24. As a user, I want to request an email OTP, so that I can experience six-digit passwordless sign-in.
25. As a user, I want to paste my OTP in the Dev inbox, so that I can complete the real verification call.
26. As a user without access to server logs, I want passwordless flows clearly marked NEEDS SERVER CONFIG, so that I am not misled into thinking they are broken.
27. As a signed-in user, I want to list my sessions with their expiry times, so that I can see where I am signed in.
28. As a signed-in user, I want to revoke one session or all sessions, so that I can manage my security.
29. As a signed-in user, I want to change my email, so that I can see the verified email-change proof flow.
30. As a signed-in user, I want to change my password, so that I can see the password-change flow with current-password verification.
31. As a signed-in user, I want to see my linked provider accounts, so that I can understand the Account concept.
32. As a signed-in user, I want to unlink a provider, so that I can see the last-account guard.
33. As a signed-in user, I want to request account deletion, so that I can see the verified deletion proof flow.
34. As a user about to run a destructive call, I want an explicit confirmation and a steer to my own throwaway account, so that I cannot break the shared Demo account.
35. As a signed-in user, I want to enable two-factor authentication, so that I can see the TOTP URI and backup codes.
36. As a signed-in user, I want to regenerate backup codes, so that I can recover access.
37. As a signed-in user, I want to disable two-factor authentication, so that I can revert the change.
38. As a signed-in user, I want to register a passkey, so that I can see WebAuthn enrollment.
39. As a visitor, I want to sign in with a passkey, so that I can see discoverable sign-in.
40. As a signed-in user, I want to list and delete passkeys, so that I can manage credentials.
41. As a user whose account has no admin role, I want passkey, API-key, organization and admin panels to show NEEDS ROLE, so that I understand why a call would be denied.
42. As a signed-in user, I want to create, list, verify and revoke API keys, so that I can see machine authentication.
43. As a signed-in user, I want to create an organization and manage members and roles, so that I can see multi-tenant identity.
44. As a signed-in user, I want to set and clear an active organization, so that I can see organization scoping.
45. As an administrator, I want to list users, set roles, ban and unban users, so that I can see guarded admin management.
46. As an administrator, I want to impersonate a user and stop impersonating, so that I can see the audit-relevant admin flow.
47. As a user exploring the authorization server, I want to start a PKCE authorization code flow, so that I can see token issuance.
48. As a user exploring the authorization server, I want to exchange a code or refresh token, so that I can see token rotation.
49. As a user exploring device authorization, I want to start a device flow and receive a user code, so that I can see the device experience.
50. As a user, I want to approve a device authorization, so that I can complete the device flow.
51. As a visitor, I want Google and GitHub sign-in panels, so that I can see OAuth support even though this deployment has no providers configured.
52. As an administrator, I want to manage SSO connections, so that I can see per-organization OIDC SSO configuration.
53. As an administrator, I want to start a SAML sign-in, so that I can see the service-provider side of SAML.
54. As a reader, I want SCIM shown as a capability card, so that I know directory provisioning exists even though it uses a bearer token rather than the typed client.
55. As a reader, I want library-level capabilities with no browser path — storage adapters, mailers, templates, rate limits, trusted proxies, key rings, JWKS and defensive controls — shown as honest capability cards, so that I see the full surface without fake controls.
56. As a reader, I want Go-only methods such as audit query, password verification and user update documented rather than invoked, so that I am not promised an HTTP endpoint that does not exist.
57. As a developer, I want each capability to show its exact HTTP method and path, so that I can map the UI back to the API reference.
58. As a developer, I want a copyable code snippet per flow, so that I can see how the typed client is used.
59. As a developer, I want a contextual docs link per feature area, so that I can read the full guide without leaving the flow.
60. As a developer cloning the repo, I want one command to start the frontend, so that I can run the Showcase locally.
61. As a developer, I want the backend URL configurable through the project's environment schema with the deployed URL as default, so that the app works locally and when published.
62. As a developer, I want destructive flows guarded, so that exploring the Showcase cannot damage the shared Demo account.

## Implementation Decisions

- **Architecture**: the browser talks only to a same-origin Next.js route-handler proxy; the proxy forwards to the deployed Signet backend. No local Go server, no backend changes, no CORS changes.
- **Proxy contract**: a single forwarding function accepts an incoming request and a base URL, and returns a response. It forwards method, query string, relevant headers, cookies and request body; rewrites `Origin` to the backend origin; relays `Set-Cookie` headers verbatim; and preserves upstream status and body. An injectable fetch implementation is the test seam.
- **Client contract**: the typed client is created once with `baseURL` pointing at the proxy path, so CSRF caching, CSRF rotation after sign-in and credential inclusion remain the library's responsibility. Session state comes from the React provider; two-factor challenges use the client directly.
- **Feature catalog**: one catalog drives the sidebar, the Status badges, endpoint chips, docs links and code snippets. Status values are a static verified snapshot, with a read-only recheck for session-derived state only.
- **Capability forms**: three honest forms — callable flow, capability card for library-only features, documented-only note for Go-only methods. No simulated success in any form.
- **Demo account safety**: one shared Demo account for read-only and safe flows; destructive flows require explicit confirmation and steer the reader to a throwaway account created through public signup.
- **Dev inbox**: a token/link input on verification, reset, magic-link, OTP, email-change and deletion flows, with an honest note that a reader without server-log access cannot obtain the token from this deployment.
- **Environment**: backend base URL lives in the app's environment schema with the deployed URL as default.
- **Framework conventions**: follow Next.js 16 — async request APIs, route handlers, Turbopack defaults, no `next lint` — and the shared shadcn/ui primitives already present in the monorepo.
- **Vocabulary**: use the project glossary terms — Showcase, Feature area, Live flow, Gated feature, Dev inbox, Demo account, Status badge — in code, docs and UI copy where natural.

## Testing Decisions

- A good test asserts externally observable behaviour only: what goes into the proxy and what comes back, never internal helper calls or styling.
- Primary seam: the proxy forwarding function with an injected fetch stub. Tests cover method and path forwarding, query preservation, cookie and CSRF-header forwarding, `Origin` rewriting, request body pass-through, `Set-Cookie` relay, upstream status/body passthrough and upstream failure handling.
- Secondary invariant: the feature catalog contains an entry for every shipped capability and every entry has a valid Status badge, endpoint or capability-card type, and docs link.
- The codebase has no prior tests; there is no existing seam to reuse. The proxy function is the highest point at which the whole backend boundary can be tested.
- UI behaviour is verified with typecheck, production build and a manual browser walkthrough against the live backend, not with component tests.
- Destructive flows are verified by inspection of their guardrails, never by executing them against the shared Demo account.

## Out of Scope

- A local Go server, backend code changes, adding CORS to the deployed service, or adding an outbox endpoint.
- Faked or simulated success responses.
- Embedded docs viewer, marketing site, native mobile app, i18n, anomaly detection and features Signet does not implement.
- Phone OTP, anonymous sessions, One Tap, SIWE, MCP, CIMD and DPoP.
- Automated browser E2E tests and exhaustive component test suites.
- Publishing the Demo account as a real credential or using it for anything sensitive.

## Further Notes

- Verified backend facts are dated 2026-11-26. The backend is live but cold starts take roughly 10–20 seconds.
- The deployment enforces an authorizer: privileged capabilities return `forbidden` for ordinary accounts, and OAuth sign-in returns `not found` because no providers are configured.
- Email verification is not enforced on the deployment, so sign-in succeeds for an unverified account.
- Library-only capabilities and Go-only methods are included for completeness; they are explicitly not callable from the browser.
- A builder review raised six scope questions; the resolutions are recorded in the design document. The one question requiring the author's decision — destructive mutation safety — was resolved in favour of guardrails and throwaway accounts.
- Published to https://github.com/shakibdshy/signet-auth-example/issues/1 with the `ready-for-agent` label.
