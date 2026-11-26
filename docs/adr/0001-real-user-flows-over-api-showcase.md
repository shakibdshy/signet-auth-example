# Real user flows over API showcase

The app originally presented Signet as a feature showcase: thirteen areas of flow-runner panels
that print raw JSON responses — effectively an HTTP API testing console. We decided the example's
purpose is the opposite: show how a real product uses Signet, with each capability as a user flow
a person completes end-to-end (sign up with email/username/password, email verification, sign in
by password, magic link, or one-time code, password reset, session management on an account page).
The showcase was demoted to a `/playground` developer tool rather than deleted, because it remains
the fastest way to poke the API directly; the main experience no longer links flows to it.

## Considered Options

- **Delete the playground** — rejected: it cost real effort and still serves as a debugging
  surface for the API; it just no longer *is* the example.
- **Keep both equally prominent** — rejected: the repo would keep saying two contradictory things
  about what an integration with Signet looks like.

## Consequences

- Email-driven flows must actually deliver email. The backend deployment needs the SMTP mailer,
  `AppURL` pointed at this app's origin, and redirect patterns allowing `/auth/*` — documented in
  [deploy-config.md](../deploy-config.md). Until then, flows remain completable through manual
  token entry.
- Emailed links point at this app (`{AppURL}/auth/...`) and rely on the `/auth/:path*` rewrite to
  the same-origin proxy, so session cookies stay first-party. This coupling between backend config
  and frontend routing is deliberate.
- Honesty badges (Live / Needs role / Needs server config) left the main app — a real product
  does not label its own infrastructure state — and stayed in the playground.
