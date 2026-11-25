/**
 * The single source of truth for what the Showcase can show.
 *
 * Status values are a verified snapshot of the deployed backend, not a guess
 * made at runtime. `card` capabilities have no browser-callable endpoint.
 */

export type CapabilityStatus = "live" | "gated" | "unconfigured" | "card";

export type Capability = {
  id: string;
  name: string;
  summary: string;
  status: CapabilityStatus;
  docs: string;
  endpoint?: string;
  method?: "GET" | "POST" | "DELETE";
  clientMethod?: string;
  reason?: string;
  snippet?: string;
};

export type FeatureArea = {
  id: string;
  index: string;
  title: string;
  summary: string;
  docs: string;
  capabilities: Capability[];
};

const DOCS = "https://go-signet-auth.vercel.app";

export const STATUS_META: Record<
  CapabilityStatus,
  { label: string; description: string; tone: string }
> = {
  live: {
    label: "Live",
    description: "Completes against the deployed backend.",
    tone: "text-chart-2 border-chart-2/40",
  },
  gated: {
    label: "Needs role",
    description: "The endpoint exists, but this account is denied.",
    tone: "text-chart-1 border-chart-1/40",
  },
  unconfigured: {
    label: "Needs server config",
    description: "The deployment has no provider or token source for this flow.",
    tone: "text-chart-4 border-chart-4/40",
  },
  card: {
    label: "Library",
    description: "Capability of the Go library, with no browser endpoint.",
    tone: "text-muted-foreground border-border",
  },
};

function defineCapability(
  id: string,
  name: string,
  summary: string,
  status: CapabilityStatus,
  docs: string,
  method: Capability["method"],
  endpoint: string,
  clientMethod?: string,
  reason?: string,
  snippet?: string,
): Capability {
  return {
    id,
    name,
    summary,
    status,
    docs: `${DOCS}${docs}`,
    method,
    endpoint,
    clientMethod,
    reason,
    snippet,
  };
}

function defineLibraryCard(
  id: string,
  name: string,
  summary: string,
  docs: string,
  reason?: string,
): Capability {
  return { id, name, summary, status: "card", docs: `${DOCS}${docs}`, reason };
}

export const FEATURE_AREAS = [
  {
    id: "core",
    index: "01",
    title: "Core identity",
    summary: "The first factor: credentials, sessions and the signed-in reader.",
    docs: `${DOCS}/docs/quickstart`,
    capabilities: [
      defineCapability("sign-up", "Sign up", "Create a user and credential account.", "live", "/docs/quickstart", "POST", "/auth/signup", "signUp"),
      defineCapability("sign-in", "Sign in", "Issue a session and rotate the CSRF token.", "live", "/docs/sessions", "POST", "/auth/signin", "signIn"),
      defineCapability("sign-in-username", "Username sign-in", "Authenticate with a username instead of an email.", "live", "/docs/status", "POST", "/auth/signin", "signIn", undefined, "await signetClient.signIn({ username: 'ada', password: '…' });"),
      defineCapability("me", "Current user", "Read the signed-in reader from the session.", "live", "/docs/frontend-client", "GET", "/auth/me", "me"),
      defineCapability("sign-out", "Sign out", "Revoke the current session.", "live", "/docs/sessions", "POST", "/auth/signout", "signOut"),
      defineCapability("last-method", "Last sign-in method", "Read the signed last-factor cookie.", "live", "/docs/sessions", "GET", "/auth/last-sign-in-method", "lastSignInMethod"),
      defineCapability("token", "Token exchange", "Exchange credentials or a refresh token.", "live", "/docs/sessions", "POST", "/auth/token", "exchangeToken"),
    ],
  },
  {
    id: "sessions",
    index: "02",
    title: "Sessions",
    summary: "Hashed tokens, idle and absolute deadlines, revocation.",
    docs: `${DOCS}/docs/sessions`,
    capabilities: [
      defineCapability("list-sessions", "List sessions", "Inspect live sessions and expiry times.", "live", "/docs/sessions", "GET", "/auth/sessions", "listSessions"),
      defineCapability("revoke-session", "Revoke current session", "End the current authenticated visit.", "live", "/docs/sessions", "DELETE", "/auth/session", "revokeSession"),
      defineCapability("revoke-all", "Revoke all sessions", "End every session for this user.", "live", "/docs/sessions", "DELETE", "/auth/sessions", "revokeAllSessions"),
    ],
  },
  {
    id: "verification",
    index: "03",
    title: "Verification & recovery",
    summary: "Single-use proofs for email, password and deletion.",
    docs: `${DOCS}/docs/complete-example`,
    capabilities: [
      defineCapability("send-verification", "Send verification", "Request a verification proof by email.", "live", "/docs/complete-example", "POST", "/auth/send-verification", "sendVerification"),
      defineCapability("verify-email", "Verify email", "Consume the emailed proof.", "unconfigured", "/docs/complete-example", "POST", "/auth/verify-email", "verifyEmail", "Token is delivered to the server log."),
      defineCapability("send-reset", "Send password reset", "Request a reset proof by email.", "live", "/docs/complete-example", "POST", "/auth/send-password-reset", "sendPasswordReset"),
      defineCapability("reset-password", "Reset password", "Set a new password with the proof.", "unconfigured", "/docs/complete-example", "POST", "/auth/reset-password", "resetPassword", "Token is delivered to the server log."),
      defineCapability("change-password", "Change password", "Verify the current password before changing it.", "live", "/docs/complete-example", "POST", "/auth/change-password", "changePassword"),
      defineCapability("change-email", "Change email", "Start a verified email change.", "live", "/docs/complete-example", "POST", "/auth/change-email", "changeEmail"),
      defineCapability("verify-change-email", "Verify new email", "Consume the emailed change proof.", "unconfigured", "/docs/complete-example", "POST", "/auth/verify-change-email", "verifyChangeEmail", "Token is delivered to the server log."),
      defineCapability("request-deletion", "Request deletion", "Start verified account deletion.", "live", "/docs/complete-example", "POST", "/auth/request-account-deletion", "requestAccountDeletion"),
      defineCapability("confirm-deletion", "Confirm deletion", "Destroy the account with the proof.", "unconfigured", "/docs/complete-example", "POST", "/auth/confirm-account-deletion", "confirmAccountDeletion", "Token is delivered to the server log."),
    ],
  },
  {
    id: "passwordless",
    index: "04",
    title: "Passwordless",
    summary: "Magic links and six-digit email OTPs, digest-only proofs.",
    docs: `${DOCS}/docs/complete-example`,
    capabilities: [
      defineCapability("magic-link", "Magic link", "Request a sign-in link.", "live", "/docs/frontend-client", "POST", "/auth/send-magic-link", "sendMagicLink"),
      defineCapability("verify-magic", "Verify magic link", "Exchange the link token for a session.", "unconfigured", "/docs/frontend-client", "GET", "/auth/verify-magic-link", "verifyMagicLink", "Token is delivered to the server log."),
      defineCapability("email-otp", "Email OTP", "Request a six-digit code.", "live", "/docs/frontend-client", "POST", "/auth/send-otp", "sendOtp"),
      defineCapability("verify-otp", "Verify OTP", "Exchange the code for a session.", "unconfigured", "/docs/frontend-client", "POST", "/auth/verify-otp", "verifyOtp", "Code is delivered to the server log."),
    ],
  },
  {
    id: "two-factor",
    index: "05",
    title: "Second factor",
    summary: "TOTP, backup codes and linked provider accounts.",
    docs: `${DOCS}/docs/oauth`,
    capabilities: [
      defineCapability("enable-2fa", "Enable TOTP", "Receive a provisioning URI and backup codes.", "unconfigured", "/docs/complete-example", "POST", "/auth/enable-two-factor", "enableTwoFactor", "Second factor is not configured on this deployment."),
      defineCapability("verify-2fa", "Verify TOTP", "Complete a two-factor challenge.", "unconfigured", "/docs/complete-example", "POST", "/auth/verify-two-factor", "verifyTwoFactor", "Second factor is not configured on this deployment."),
      defineCapability("disable-2fa", "Disable TOTP", "Remove the second factor.", "unconfigured", "/docs/complete-example", "POST", "/auth/disable-two-factor", "disableTwoFactor", "Second factor is not configured on this deployment."),
      defineCapability("backup-codes", "Regenerate backup codes", "Replace all existing backup codes.", "unconfigured", "/docs/complete-example", "POST", "/auth/regenerate-backup-codes", "regenerateBackupCodes", "Second factor is not configured on this deployment."),
      defineCapability("accounts", "Linked accounts", "List ways this user can sign in.", "live", "/docs/oauth", "GET", "/auth/accounts", "listAccounts"),
      defineCapability("unlink", "Unlink provider", "Remove a provider link, with a last-account guard.", "live", "/docs/oauth", "POST", "/auth/unlink-account", "unlinkAccount"),
    ],
  },
  {
    id: "passkeys",
    index: "06",
    title: "Passkeys",
    summary: "WebAuthn enrollment and discoverable sign-in.",
    docs: `${DOCS}/docs/passkeys`,
    capabilities: [
      defineCapability("passkey-register", "Register passkey", "Begin and finish a WebAuthn ceremony.", "gated", "/docs/passkeys", "POST", "/auth/passkeys/register-begin", "beginPasskeyRegistration", "The demo account has no passkey permission."),
      defineCapability("passkey-signin", "Passkey sign-in", "Discoverable authentication.", "gated", "/docs/passkeys", "POST", "/auth/passkeys/signin-begin", "beginPasskeySignIn", "The deployment denies anonymous WebAuthn."),
      defineCapability("passkey-list", "List passkeys", "Inspect safe credential fields.", "gated", "/docs/passkeys", "GET", "/auth/passkeys", "listPasskeys", "The demo account has no passkey permission."),
      defineCapability("passkey-delete", "Delete passkey", "Revoke a WebAuthn credential.", "gated", "/docs/passkeys", "POST", "/auth/passkeys/delete", "deletePasskey", "The demo account has no passkey permission."),
    ],
  },
  {
    id: "oauth",
    index: "07",
    title: "OAuth sign-in",
    summary: "Google, GitHub and generic OIDC with PKCE.",
    docs: `${DOCS}/docs/oauth`,
    capabilities: [
      defineCapability("oauth-google", "Google sign-in", "Built-in Google provider with PKCE.", "unconfigured", "/docs/oauth", "POST", "/auth/oauth/start", "oauthStart", "No providers are configured on this deployment.", "await signetClient.oauthStart({ provider: 'google' });"),
      defineCapability("oauth-github", "GitHub sign-in", "Built-in GitHub provider with PKCE.", "unconfigured", "/docs/oauth", "POST", "/auth/oauth/start", "oauthStart", "No providers are configured on this deployment.", "await signetClient.oauthStart({ provider: 'github' });"),
      defineCapability("oauth-start", "Custom provider", "Redirect to any configured provider or OIDC adapter.", "unconfigured", "/docs/oauth", "POST", "/auth/oauth/start", "oauthStart", "No providers are configured on this deployment."),
      defineCapability("oauth-callback", "OAuth callback", "Redeem the code and consume encrypted state.", "unconfigured", "/docs/oauth", "GET", "/auth/oauth/callback", "oauthCallback", "Requires a configured provider."),
    ],
  },
  {
    id: "authorization-server",
    index: "08",
    title: "Authorization server",
    summary: "PKCE codes, rotating tokens and device authorization.",
    docs: `${DOCS}/docs/authorization-server`,
    capabilities: [
      defineCapability("oauth-authorize", "Authorize client", "Issue an authorization code.", "live", "/docs/authorization-server", "POST", "/auth/oauth/authorize", "oauthAuthorize"),
      defineCapability("oauth-token", "Issue tokens", "Exchange a code or refresh token.", "live", "/docs/authorization-server", "POST", "/auth/oauth/token", "oauthToken"),
      defineCapability("device-authorize", "Start device flow", "Receive a user code and verification URI.", "live", "/docs/authorization-server", "POST", "/auth/oauth/device/authorize", "beginDeviceAuthorization"),
      defineCapability("device-approve", "Approve device", "Approve a pending user code.", "live", "/docs/authorization-server", "POST", "/auth/oauth/device/approve", "approveDeviceAuthorization"),
      defineCapability("device-token", "Poll device token", "Poll until the device is approved.", "live", "/docs/authorization-server", "POST", "/auth/oauth/device/token", "deviceToken"),
    ],
  },
  {
    id: "organizations",
    index: "09",
    title: "Organizations",
    summary: "Memberships, roles and the active organization.",
    docs: `${DOCS}/docs/authorization`,
    capabilities: [
      defineCapability("org-create", "Create organization", "Create a tenant and owner membership.", "gated", "/docs/authorization", "POST", "/auth/organizations", "createOrganization", "The demo account has no organization permission."),
      defineCapability("org-list", "List organizations", "Read the user's memberships.", "gated", "/docs/authorization", "GET", "/auth/organizations", "listOrganizations", "The demo account has no organization permission."),
      defineCapability("org-members", "List members", "Inspect an organization's members.", "gated", "/docs/authorization", "GET", "/auth/organization-members", "listOrganizationMembers", "The demo account has no organization permission."),
      defineCapability("org-role", "Set member role", "Change a membership role.", "gated", "/docs/authorization", "POST", "/auth/organization-members/role", "setOrganizationMemberRole", "The demo account has no organization permission."),
      defineCapability("active-org", "Active organization", "Read the scoped organization.", "gated", "/docs/authorization", "GET", "/auth/active-organization", "activeOrganization", "Scoped organization features are gated."),
      defineCapability("set-active-org", "Set active organization", "Scope subsequent calls to one organization.", "gated", "/docs/authorization", "POST", "/auth/set-active-organization", "setActiveOrganization", "The demo account has no organization permission."),
      defineCapability("clear-active-org", "Clear active organization", "Return to user-only scope.", "gated", "/docs/authorization", "POST", "/auth/clear-active-organization", "clearActiveOrganization", "The demo account has no organization permission."),
    ],
  },
  {
    id: "api-keys",
    index: "10",
    title: "API keys",
    summary: "Machine credentials with roles, limits and revocation.",
    docs: `${DOCS}/docs/authorization`,
    capabilities: [
      defineCapability("api-key-create", "Create API key", "Issue a raw key shown once.", "gated", "/docs/authorization", "POST", "/auth/api-keys", "createApiKey", "The demo account has no API-key permission."),
      defineCapability("api-key-list", "List API keys", "Inspect safe key fields.", "gated", "/docs/authorization", "GET", "/auth/api-keys", "listApiKeys", "The demo account has no API-key permission."),
      defineCapability("api-key-verify", "Verify API key", "Resolve a bearer key to a principal.", "gated", "/docs/authorization", "POST", "/auth/verify-api-key", "verifyApiKey", "The demo account has no API-key permission."),
      defineCapability("api-key-revoke", "Revoke API key", "Disable a machine credential.", "gated", "/docs/authorization", "POST", "/auth/revoke-api-key", "revokeApiKey", "The demo account has no API-key permission."),
    ],
  },
  {
    id: "admin",
    index: "11",
    title: "Admin & impersonation",
    summary: "Guarded user management with audit events.",
    docs: `${DOCS}/docs/authorization`,
    capabilities: [
      defineCapability("admin-users", "List users", "Query users with a management permission.", "gated", "/docs/authorization", "GET", "/auth/admin-users", "adminListUsers", "The demo account has no admin permission."),
      defineCapability("admin-role", "Set user role", "Grant or revoke an application role.", "gated", "/docs/authorization", "POST", "/auth/admin-users/role", "adminSetUserRole", "The demo account has no admin permission."),
      defineCapability("admin-ban", "Ban user", "Disable a user account.", "gated", "/docs/authorization", "POST", "/auth/admin-users/ban", "adminBanUser", "The demo account has no admin permission."),
      defineCapability("admin-unban", "Unban user", "Restore a disabled user account.", "gated", "/docs/authorization", "POST", "/auth/admin-users/unban", "adminUnbanUser", "The demo account has no admin permission."),
      defineCapability("admin-sessions", "List user sessions", "Inspect another user's sessions.", "gated", "/docs/authorization", "GET", "/auth/admin-user-sessions", "adminListUserSessions", "The demo account has no admin permission."),
      defineCapability("admin-revoke", "Revoke user session", "End another user's session.", "gated", "/docs/authorization", "POST", "/auth/admin-user-sessions/revoke", "adminRevokeUserSession", "The demo account has no admin permission."),
      defineCapability("impersonate", "Impersonate", "Act as another user with an audit trail.", "gated", "/docs/authorization", "POST", "/auth/impersonate", "impersonate", "The demo account has no impersonation permission."),
    ],
  },
  {
    id: "enterprise",
    index: "12",
    title: "Enterprise identity",
    summary: "Per-organization SSO, SAML and SCIM provisioning.",
    docs: `${DOCS}/docs/organization-sso`,
    capabilities: [
      defineCapability("sso-start", "SSO sign-in", "Start an OIDC SSO flow.", "gated", "/docs/organization-sso", "POST", "/auth/sso/start", "startSSOSignIn", "No SSO connection is configured."),
      defineCapability("sso-connections", "List SSO connections", "Read verified-domain connections.", "gated", "/docs/organization-sso", "GET", "/auth/sso/connections", "listSSOConnections", "The demo account has no SSO permission."),
      defineCapability("sso-create", "Create SSO connection", "Register an OIDC connection for an organization.", "gated", "/docs/organization-sso", "POST", "/auth/sso/connections", "createSSOConnection", "The demo account has no SSO permission."),
      defineCapability("sso-delete", "Delete SSO connection", "Remove a verified-domain connection.", "gated", "/docs/organization-sso", "DELETE", "/auth/sso/connections", "deleteSSOConnection", "The demo account has no SSO permission."),
      defineCapability("saml-start", "SAML sign-in", "Build a signed AuthnRequest.", "gated", "/docs/saml", "POST", "/auth/saml/start", "startSAMLSignIn", "No SAML service provider is configured."),
      defineLibraryCard("scim", "SCIM 2.0", "Directory provisioning for Users and Groups with role projection.", "/docs/scim", "Uses a bearer token rather than the typed client, so it has no browser panel here."),
    ],
  },
  {
    id: "library",
    index: "13",
    title: "Inside the library",
    summary: "Capabilities that live in Go code rather than in an HTTP endpoint.",
    docs: `${DOCS}/docs/status`,
    capabilities: [
      defineLibraryCard("storage", "Storage adapters", "Bring your own schema with explicit SQLite and PostgreSQL migrations.", "/docs/quickstart"),
      defineLibraryCard("hash", "Password hashing", "Argon2id verifiers with transparent rehash and an optional bcrypt adapter.", "/docs/status"),
      defineLibraryCard("mail", "Mailers and templates", "Console and SMTP adapters with overridable templates.", "/docs/status"),
      defineLibraryCard("rate-limits", "Rate limiting", "Per-endpoint rules, trusted proxies and a window-aware limiter.", "/docs/status"),
      defineLibraryCard("keys", "Key rings and JWKS", "Rotating CSRF and JWT keys with opt-in JWKS publication.", "/docs/status"),
      defineLibraryCard("defensive", "Defensive controls", "Captcha checks, breach checks and validated redirect patterns.", "/docs/status"),
      defineLibraryCard("auto-signin", "Automatic sign-in", "Opt-in session issuance after sign-up or verification.", "/docs/status"),
      defineLibraryCard("audit", "Audit query", "Queryable audit events are a Go API method, not an HTTP endpoint.", "/docs/status"),
      defineLibraryCard("set-password", "Set password", "Server-side password assignment is a Go API method with no HTTP route.", "/docs/status"),
      defineLibraryCard("verify-password", "Verify password", "Server-side password checks are a Go API method with no HTTP route.", "/docs/status"),
      defineLibraryCard("update-user", "Update user", "Direct user updates are a Go API method with no HTTP route.", "/docs/status"),
    ],
  },
] as const satisfies readonly FeatureArea[];

export const ALL_CAPABILITIES: Capability[] = FEATURE_AREAS.flatMap((area) => area.capabilities);

export function findArea(id: string): FeatureArea | undefined {
  return FEATURE_AREAS.find((area) => area.id === id);
}

/** Every callable flow gets a copyable snippet, even when no bespoke example was written. */
export function snippetFor(capability: Capability): string | undefined {
  if (capability.status === "card" || !capability.clientMethod) return undefined;
  if (capability.snippet) return capability.snippet;
  return `const result = await signetClient.${capability.clientMethod}();\nconsole.log(result);`;
}
