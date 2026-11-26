# Signet Example App

The public example application demonstrating Signet the way a real product would use it:
every capability is a user flow a person completes end-to-end in the browser.

## Language

**Example app**:
The application itself, showing Signet through real user flows rather than API testing.
_Avoid_: showcase, demo app, sample project

**User flow**:
A complete journey a person performs against the deployed backend — sign up, verify, sign in, recover — with real inputs and real emails.
_Avoid_: live flow, feature flow, use case

**Credential sign-in**:
Signing in with an email-or-username identifier plus password.
_Avoid_: password login, classic login

**Magic-link sign-in**:
Passwordless sign-in by requesting an emailed link and clicking it in the same browser.
_Avoid_: login link, email login

**OTP sign-in**:
Passwordless sign-in by requesting an emailed six-digit code and typing it in.
_Avoid_: one-time password login, 2FA code

**Email verification**:
Proving ownership of the address given at sign-up, before or after first sign-in.
_Avoid_: OTP verification, account activation

**Sign-in method**:
How the current session was established — credential, magic link, or OTP — as reported by the backend after sign-in.
_Avoid_: login type, auth provider

**Callback page**:
The app page an emailed magic link's redirect lands on, where the established session is picked up.
_Avoid_: redirect handler, landing URL

**Manual token entry**:
The fallback input for pasting a token or code from an email when its link path cannot be used.
_Avoid_: dev inbox, outbox, token paste box

**Same-origin proxy**:
The app's boundary that relays requests to the Signet backend from the app's own origin, keeping session cookies first-party.
_Avoid_: API gateway, backend-for-frontend

**Playground**:
The demoted API-testing area at `/playground`, kept as a developer tool for poking Signet endpoints directly.
_Avoid_: showcase, console, feature area browser

**Demo account**:
The seeded shared credential, referenced only inside the playground and its destructive-flow warnings.
_Avoid_: test user, admin user, fixture

**Status badge**:
The playground-only label telling a developer whether a capability is Live, Needs Role, or Needs Server Config.
_Avoid_: health indicator, feature flag
