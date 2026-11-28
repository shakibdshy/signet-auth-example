"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { DemoInbox } from "@/components/auth/demo-inbox";
import { describeSignetError, signetClient } from "@/lib/signet-client";

function VerifyEmailInner() {
  const router = useRouter();
  const { refresh, status, user } = useSession();
  const [token, setToken] = useState(useSearchParams().get("token") ?? "");
  const [resendEmail, setResendEmail] = useState(user?.email ?? "");
  const [inboxOpen, setInboxOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setResendEmail((current) => current || user.email);
    }
  }, [user?.email]);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await signetClient.verifyEmail({ token });
      await refresh();
      toast.success("Email verified");
      router.push(status === "anonymous" ? "/sign-in" : "/account");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  async function resend(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await signetClient.sendVerification({ email: resendEmail });
      toast.success("Verification email sent to Demo Inbox");
      setInboxOpen(true);
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={verify} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="verify-token">Verification token</Label>
          <Input
            id="verify-token"
            value={token}
            onChange={(event) => setToken(event.target.value.trim())}
            placeholder="Paste the token from your email"
            spellCheck={false}
            className="font-mono text-xs"
            required
          />
        </div>
        <Button type="submit" disabled={busy || !token} className="w-full justify-between">
          <span className="inline-flex items-center gap-2">
            {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
            Verify email
          </span>
          <ArrowRight data-icon="inline-end" />
        </Button>
      </form>
      <form onSubmit={resend} className="flex flex-col gap-3 border-t pt-5">
        <Label htmlFor="verify-resend">Lost the email? Send a fresh one</Label>
        <div className="flex items-center gap-2">
          <Input
            id="verify-resend"
            type="email"
            autoComplete="email"
            spellCheck={false}
            value={resendEmail}
            onChange={(event) => setResendEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <Button type="submit" variant="outline" disabled={busy || !resendEmail}>
            Send
          </Button>
        </div>
        {(resendEmail || user?.email) ? (
          <DemoInbox
            email={resendEmail || user?.email || ""}
            open={inboxOpen}
            onOpenChange={setInboxOpen}
            onSelectToken={(selected) => setToken(selected)}
          />
        ) : null}
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="border bg-card p-6">
      <div className="mb-5 flex flex-col gap-1">
        <h1 className="text-lg font-semibold tracking-tight">Verify Email</h1>
        <p className="text-xs/relaxed text-muted-foreground">
          Confirm the email address on your account is real and reachable.
        </p>
      </div>
      <Suspense fallback={null}>
        <VerifyEmailInner />
      </Suspense>
    </div>
  );
}
