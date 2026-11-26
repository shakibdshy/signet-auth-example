"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { TokenEntry } from "@/components/auth/token-entry";
import { describeSignetError, signetClient } from "@/lib/signet-client";

function VerifyEmailInner() {
  const router = useRouter();
  const { refresh, status } = useSession();
  const [token, setToken] = useState(useSearchParams().get("token") ?? "");
  const [resendEmail, setResendEmail] = useState("");
  const [busy, setBusy] = useState(false);

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
      toast.success("Verification email sent");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={verify} className="flex flex-col gap-4">
        <p className="text-sm/relaxed text-muted-foreground">
          The email we sent contains a verification link. Clicking it lands here with the token
          attached — or paste the token below.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="verify-token">Verification token</Label>
          <Input
            id="verify-token"
            value={token}
            onChange={(event) => setToken(event.target.value.trim())}
            placeholder="Paste the token from your email"
            className="font-mono text-xs"
            required
          />
        </div>
        <Button type="submit" disabled={busy || !token} className="w-full justify-between">
          {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
          Verify email
          <ArrowRight data-icon="inline-end" />
        </Button>
      </form>
      <form onSubmit={resend} className="flex flex-col gap-4 border-t pt-5">
        <Label htmlFor="verify-resend">Lost the email? Send a fresh one</Label>
        <div className="flex items-end gap-2">
          <Input
            id="verify-resend"
            type="email"
            value={resendEmail}
            onChange={(event) => setResendEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <Button type="submit" variant="outline" disabled={busy || !resendEmail}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="mono-label text-signal">Flow 05 / Verify email</span>
        <h1 className="display-title text-3xl font-semibold sm:text-4xl">Prove it&apos;s you.</h1>
        <p className="text-sm/relaxed text-muted-foreground">
          Verification confirms the address on your account is real and reachable.
        </p>
      </div>
      <div className="border bg-card/60 p-6">
        <Suspense fallback={null}>
          <VerifyEmailInner />
        </Suspense>
      </div>
    </div>
  );
}
