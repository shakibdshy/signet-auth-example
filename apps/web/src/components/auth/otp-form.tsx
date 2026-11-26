"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { describeSignetError, signetClient } from "@/lib/signet-client";

const RESEND_SECONDS = 60;

export function OtpForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (sent) codeRef.current?.focus();
  }, [sent]);

  async function sendCode(event?: React.FormEvent) {
    event?.preventDefault();
    setBusy(true);
    try {
      await signetClient.sendOtp({ email });
      setSent(true);
      setCooldown(RESEND_SECONDS);
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await signetClient.verifyOtp({ email, code });
      await refresh();
      toast.success("Signed in");
      router.push("/account");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 border-b pb-4">
          <span className="font-display text-lg font-bold">Enter your code</span>
          <p className="text-sm/relaxed text-muted-foreground">
            Six digits sent to <span className="font-mono text-foreground">{email}</span>. It
            expires shortly.
          </p>
        </div>
        <form onSubmit={verify} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="otp-code">Six-digit code</Label>
            <Input
              id="otp-code"
              name="otp"
              ref={codeRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="h-12 text-center font-mono text-xl tracking-[0.5em]"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={busy || code.length < 6}
            className="w-full justify-between"
            size="lg"
          >
            <span className="inline-flex items-center gap-2">
              {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
              Verify and sign in
            </span>
            <ArrowRight data-icon="inline-end" />
          </Button>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
          <button
            type="button"
            className="mono-label text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            disabled={cooldown > 0 || busy}
            onClick={() => void sendCode()}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
          <button
            type="button"
            className="mono-label text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              setSent(false);
              setCode("");
            }}
          >
            Use different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={sendCode} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="otp-email">Email</Label>
        <Input
          id="otp-email"
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
      <Button type="submit" disabled={busy} className="w-full justify-between" size="lg">
        <span className="inline-flex items-center gap-2">
          {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
          Email me a six-digit code
        </span>
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}
