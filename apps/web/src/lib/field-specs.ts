export type FlowField = {
  name: string;
  label: string;
  type?: "email" | "password" | "text" | "number";
  placeholder?: string;
  required?: boolean;
  kind?: "string" | "number" | "array";
};

const email = (name = "email", label = "Email"): FlowField => ({
  name,
  label,
  type: "email",
  placeholder: "you@example.com",
  required: true,
});
const password = (name = "password", label = "Password"): FlowField => ({
  name,
  label,
  type: "password",
  placeholder: "••••••••••••",
  required: true,
});
const text = (name: string, label: string, placeholder?: string): FlowField => ({
  name,
  label,
  type: "text",
  placeholder,
  required: true,
});

export const FIELD_SPECS: Record<string, FlowField[]> = {
  signUp: [text("name", "Name", "Ada Lovelace"), email(), password()],
  signIn: [email(), password()],
  signInUsername: [text("username", "Username", "ada"), password()],
  changePassword: [password("current_password", "Current password"), password("new_password", "New password")],
  changeEmail: [email("new_email", "New email"), password()],
  sendVerification: [email()],
  sendPasswordReset: [email()],
  resetPassword: [text("token", "Reset token"), password("new_password", "New password")],
  verifyEmail: [text("token", "Verification token")],
  verifyChangeEmail: [text("token", "Change token")],
  confirmAccountDeletion: [text("token", "Deletion token")],
  sendMagicLink: [email()],
  verifyMagicLink: [text("token", "Magic-link token")],
  sendOtp: [email()],
  verifyOtp: [email(), text("code", "Six-digit code", "000000")],
  enableTwoFactor: [password()],
  disableTwoFactor: [password()],
  regenerateBackupCodes: [password()],
  verifyTwoFactor: [text("challenge", "Challenge"), text("code", "TOTP code", "000000")],
  unlinkAccount: [text("account_id", "Account ID")],
  oauthStart: [text("provider", "Provider", "google")],
  oauthAuthorize: [
    text("client_id", "Client ID"),
    text("redirect_uri", "Redirect URI"),
    text("response_type", "Response type", "code"),
    text("scope", "Scope", "openid"),
    text("state", "State"),
    text("code_challenge", "PKCE challenge"),
    text("audience", "Audience", "signet-showcase"),
  ],
  oauthToken: [text("code", "Authorization code")],
  beginDeviceAuthorization: [
    text("client_id", "Client ID"),
    text("scope", "Scope", "openid"),
    text("audience", "Audience", "signet-showcase"),
  ],
  approveDeviceAuthorization: [text("user_code", "User code")],
  deviceToken: [text("device_code", "Device code")],
  createApiKey: [
    text("owner_user_id", "Owner user ID"),
    text("name", "Key name", "CI runner"),
    { name: "roles", label: "Roles (comma separated)", type: "text", placeholder: "admin", required: true, kind: "array" },
    { name: "remaining", label: "Uses remaining", type: "number", placeholder: "100", required: true, kind: "number" },
    { name: "expires_at", label: "Expires at (ISO date)", type: "text", placeholder: "2027-01-01T00:00:00Z", required: true },
  ],
  verifyApiKey: [text("key", "Raw API key")],
  revokeApiKey: [text("id", "Key ID")],
  createOrganization: [text("name", "Organization name", "Acme Labs")],
  listOrganizationMembers: [text("organization_id", "Organization ID")],
  addOrganizationMember: [text("organization_id", "Organization ID"), email(), text("role", "Role", "member")],
  removeOrganizationMember: [text("organization_id", "Organization ID"), text("user_id", "User ID")],
  setOrganizationMemberRole: [text("organization_id", "Organization ID"), text("user_id", "User ID"), text("role", "Role", "admin")],
  setActiveOrganization: [text("org_id", "Organization ID")],
  adminSetUserRole: [text("user_id", "User ID"), text("role", "Role", "admin")],
  adminBanUser: [text("user_id", "User ID")],
  adminUnbanUser: [text("user_id", "User ID")],
  adminListUserSessions: [text("user_id", "User ID")],
  adminRevokeUserSession: [text("session_id", "Session ID")],
  impersonate: [text("ActorID", "Actor ID"), text("SessionToken", "Session token"), text("UserID", "User ID")],
  stopImpersonating: [text("token", "Impersonation token")],
  startSSOSignIn: [text("organization_id", "Organization ID")],
  createSSOConnection: [text("organization_id", "Organization ID"), text("issuer", "OIDC issuer URL")],
  deleteSSOConnection: [text("id", "Connection ID")],
  startSAMLSignIn: [text("organization_id", "Organization ID")],
  beginPasskeyRegistration: [text("name", "Passkey label", "My laptop")],
  finishPasskeyRegistration: [text("token", "Ceremony token"), text("response", "Credential JSON")],
  finishPasskeySignIn: [text("token", "Ceremony token"), text("response", "Assertion JSON")],
  deletePasskey: [text("user_id", "User ID"), text("credential_id", "Credential ID")],
};

export const POSITIONAL_METHODS = new Set([
  "verifyApiKey",
  "listOrganizationMembers",
  "adminListUserSessions",
  "stopImpersonating",
  "deleteSSOConnection",
  "oauthCallback",
  "completeSSOSignIn",
]);

export const TOKEN_METHODS = new Set([
  "verifyEmail",
  "resetPassword",
  "verifyChangeEmail",
  "confirmAccountDeletion",
  "verifyMagicLink",
  "verifyOtp",
]);

export const DESTRUCTIVE_METHODS = new Set([
  "revokeSession",
  "revokeAllSessions",
  "changePassword",
  "changeEmail",
  "requestAccountDeletion",
  "confirmAccountDeletion",
  "resetPassword",
  "disableTwoFactor",
  "regenerateBackupCodes",
  "unlinkAccount",
  "deletePasskey",
  "revokeApiKey",
  "removeOrganizationMember",
  "adminBanUser",
  "adminRevokeUserSession",
  "deleteSSOConnection",
]);

export function fieldsFor(method?: string): FlowField[] {
  return method ? (FIELD_SPECS[method] ?? []) : [];
}
