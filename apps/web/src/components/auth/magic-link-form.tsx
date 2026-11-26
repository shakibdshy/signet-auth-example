"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { CheckInbox } from "@/components/auth/check-inbox";
import { TokenEntry } from "@/components/auth/token-entry";
import { describeSignetError, signetClient } from "@/lib/signet-client";

export function MagicLinkForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  function callbackUrl() {
    return `${window.location.origin}/auth/callback`;
  }

  async function sendMagic(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await signetClient.sendMagicLink({ email, callback_url: callbackUrl() });
      setSent(true);
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyManually() {
    if (!token) return;
    setBusy(true);
    try {
      await signetClient.verifyMagicLink({ token });
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
      <CheckInbox
        email={email}
        title="Check your inbox"
        description="Click the sign-in link from this browser — it signs you straight in."
        resendLabel="Send the link again"
        onResend={() => signetClient.sendMagicLink({ email, callback_url: callbackUrl() })}
      >
        <TokenEntry
          id="magic-token"
          label="Magic-link token"
          value={token}
          onChange={setToken}
          placeholder="Paste the token from the link"
        />
        <Button
          type="button"
          disabled={busy || !token}
          onClick={() => void verifyManually()}
          className="w-full justify-between"
        >
          {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
          Verify token manually
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CheckInbox>
    );
  }

  return (
    <form onSubmit={sendMagic} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="magic-email">Email</Label>
        <Input
          id="magic-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <Button type="submit" disabled={busy} className="w-full justify-between">
        {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
        Email me a magic link
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}
