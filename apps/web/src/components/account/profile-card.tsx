"use client";

import { useState } from "react";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { LoaderCircle, MailCheck, MailX } from "lucide-react";
import { toast } from "sonner";

import { describeSignetError, signetClient } from "@/lib/signet-client";
import { ChangeEmailDialog } from "./security-dialogs";

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

  const initial = (user.name || user.email || "S").slice(0, 1).toUpperCase();

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div
          className="grid size-11 shrink-0 place-items-center border bg-muted font-mono text-base font-semibold text-foreground"
          aria-hidden="true"
        >
          {initial}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold">{user.name}</span>
            {typeof user.email_verified === "boolean" ? (
              user.email_verified ? (
                <span className="inline-flex items-center gap-1 border border-seal/30 bg-seal-soft px-1.5 py-0.5 font-mono text-[0.65rem] text-seal">
                  <MailCheck className="size-3" aria-hidden="true" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 border border-chart-4/40 bg-chart-4/10 px-1.5 py-0.5 font-mono text-[0.65rem] text-chart-4">
                  <MailX className="size-3" aria-hidden="true" />
                  Unverified
                </span>
              )
            ) : null}
          </div>
          <span className="truncate font-mono text-xs text-muted-foreground">{user.email}</span>
          {lastMethod ? (
            <span className="mt-0.5 font-mono text-[0.68rem] text-muted-foreground">
              Last signed in via {methodLabel(lastMethod)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {user.email_verified === false ? (
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => void resendVerification()}
          >
            {busy ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : null}
            Resend verification
          </Button>
        ) : null}
        <ChangeEmailDialog currentEmail={user.email} />
      </div>
    </div>
  );
}
