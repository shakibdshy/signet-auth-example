"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { CheckInbox } from "@/components/auth/check-inbox";
import { ToSignInLink } from "@/components/auth/flow-links";
import { describeSignetError, signetClient } from "@/lib/signet-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await signetClient.sendPasswordReset({ email });
      setSent(true);
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border bg-card p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight">Forgot Password</h1>
          <p className="text-xs/relaxed text-muted-foreground">
            We email a single-use reset link. Setting a new password signs you out everywhere.
          </p>
        </div>
        {sent ? (
          <CheckInbox
            email={email}
            title="Check your inbox"
            description="Open the reset link to choose a new password."
            resendLabel="Send the reset email again"
            onResend={() => signetClient.sendPasswordReset({ email })}
          >
            <Link
              href="/reset-password"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Have the reset token already? Enter the reset page →
            </Link>
          </CheckInbox>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full justify-between">
              <span className="inline-flex items-center gap-2">
                {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
                Send reset link
              </span>
              <ArrowRight data-icon="inline-end" />
            </Button>
          </form>
        )}
      </div>
      <ToSignInLink />
    </div>
  );
}
