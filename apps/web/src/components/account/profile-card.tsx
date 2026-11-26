"use client";

import { useState } from "react";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { LoaderCircle, MailCheck, MailX } from "lucide-react";
import { toast } from "sonner";

import { describeSignetError, signetClient } from "@/lib/signet-client";

const METHOD_LABELS: Record<string, string> = {
  password: "Password",
  magic_link: "Magic link",
  otp: "One-time code",
  passkey: "Passkey",
  two_factor: "Two-factor code",
};

export function methodLabel(method: string) {
  return (
    METHOD_LABELS[method] ??
    method.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase())
  );
}

export function ProfileCard({
  user,
  lastMethod,
}: {
  // GET /me returns UserInfo, which carries no email_verified flag; the badge
  // renders only when the API actually provides one.
  user: { name: string; email: string; email_verified?: boolean };
  lastMethod: string | null;
}) {
  const { refresh } = useSession();
  const [busy, setBusy] = useState(false);

  async function resendVerification() {
    setBusy(true);
    try {
      await signetClient.sendVerification({ email: user.email });
      await refresh();
      toast.success("Verification email sent");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-5 border bg-card/60 p-6">
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <span className="mono-label text-muted-foreground">Profile</span>
        <span className="mono-label flex items-center gap-1.5 text-muted-foreground">
          <span className="size-1.5 bg-signal" />
          Signed in
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-display text-2xl font-semibold">{user.name}</span>
        <span className="font-mono text-sm text-muted-foreground">{user.email}</span>
      </div>
      {typeof user.email_verified === "boolean" ? (
        <div className="flex flex-wrap items-center gap-2">
          {user.email_verified ? (
            <span className="mono-label inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-muted-foreground">
              <MailCheck className="size-3.5 text-signal" />
              Email verified
            </span>
          ) : (
            <span className="mono-label inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-muted-foreground">
              <MailX className="size-3.5" />
              Email unverified
            </span>
          )}
        </div>
      ) : null}
      {lastMethod ? (
        <span className="mono-label inline-flex w-fit items-center gap-1.5 border px-2.5 py-1.5 text-muted-foreground">
          <span className="size-1.5 bg-signal" />
          Last signed in via {methodLabel(lastMethod)}
        </span>
      ) : null}
      {user.email_verified === false ? (
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => void resendVerification()}
          className="justify-between"
        >
          {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
          Resend verification email
        </Button>
      ) : null}
    </section>
  );
}
