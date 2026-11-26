"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { describeSignetError, signetClient } from "@/lib/signet-client";

export function SignInForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [challenge, setChallenge] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await signetClient.signIn(
        username.trim() ? { email: "", username, password } : { email, password },
      );
      if (result.two_factor_challenge) {
        setChallenge(result.two_factor_challenge);
        toast.info("Two-factor code required");
        return;
      }
      await refresh();
      toast.success("Signed in");
      router.push("/account");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleChallenge(event: React.FormEvent) {
    event.preventDefault();
    if (!challenge) return;
    setBusy(true);
    try {
      await signetClient.verifyTwoFactor({ challenge, code });
      await refresh();
      toast.success("Two-factor verified");
      router.push("/account");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  if (challenge) {
    return (
      <form onSubmit={handleChallenge} className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-signal" />
          Enter the six-digit code from your authenticator app.
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signin-totp">Two-factor code</Label>
          <Input
            id="signin-totp"
            inputMode="numeric"
            value={code}
            onChange={(event) => setCode(event.target.value.trim())}
            placeholder="000000"
            maxLength={6}
            className="font-mono"
            required
          />
        </div>
        <Button type="submit" disabled={busy || code.length < 6} className="w-full justify-between">
          {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
          Verify and sign in
          <ArrowRight data-icon="inline-end" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signin-username">Username (optional)</Label>
        <Input
          id="signin-username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Leave blank to sign in with email"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••••••"
          required
        />
      </div>
      <Button type="submit" disabled={busy} className="w-full justify-between">
        {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
        Sign in
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}
