# Backend deployment configuration

The real email-driven flows (verification, magic link, one-time code, password reset) require
three settings on the **Signet backend deployment** (Render). They are environment values on the
wrapper service — map the names below to however your wrapper reads them.

Until SMTP is configured, the deployed backend uses the console mailer: every token goes to the
**Render service logs**, and flows are still completable in the app through manual token entry.

## 1. Mailer → SMTP

Signet ships an SMTP adapter (`mailer/smtp`); the console mailer is development-only.

| Setting | Value |
| --- | --- |
| `Mailer` | SMTP |
| SMTP `Host` | your provider's SMTP host (e.g. `smtp.resend.com`) |
| SMTP `Port` | `587` (StartTLS) or `465` (ImplicitTLS) |
| SMTP `Username` / `Password` | provider credentials — secret, never committed |
| SMTP `From` | e.g. `Signet Example <auth@yourdomain.tld>` |
| SMTP `TLS` | `StartTLS` |

Resend, SendGrid, SES and Mailgun free tiers all work for a demo.

## 2. AppURL → this app's origin

`AppURL` is the origin Signet embeds in every emailed link (`{AppURL}{PathPrefix}/path`).

| Setting | Value |
| --- | --- |
| `AppURL` | `https://<this-apps-domain>` — *placeholder until the app's production URL exists* |
| `PathPrefix` | `/auth` (unchanged) |

Pointing `AppURL` at the app (not the API) is deliberate: emailed links then land on the app,
where the `/auth/:path*` rewrite forwards them through the same-origin proxy, so session cookies
are set first-party. For local development, set `AppURL=http://localhost:3001` on a local backend,
or keep the deployed value and click links from the deployed origin only.

## 3. AllowedRedirectPatterns

After consuming a link, the backend 302s to a redirect target. Allow this app's pages:

| Setting | Value |
| --- | --- |
| `AllowedRedirectPatterns` | `https://<this-apps-domain>/auth/*`, plus `http://localhost:3001/auth/*` for local dev |

The magic-link request sends `callback_url` per call (always `<origin>/auth/callback`); the
pattern above must cover it. **Symptom when missing:** `POST /send-magic-link` returns
`400 invalid_request` — observed live on 2026-11-26 before this deployment set was applied.
OTP sign-in (`/sign-in/otp`) needs no callback URL and works without this setting.

## 4. Optional: AutoSignIn

With `AutoSignIn` enabled, sign-up and email verification return a session immediately and the
app lands the user directly on `/account`. With it disabled, the app shows the "check your inbox"
steps instead. Both paths are implemented; no frontend change is needed either way.
