"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { describeSignetError, signetClient } from "@/lib/signet-client";

export function SignInForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [mode, setMode] = useState<"email" | "username">("email");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrorMessage(null);
    try {
      signetClient.clearCsrfToken();
      const result = await signetClient.signIn(
        mode === "username"
          ? { email: "", username: username.trim(), password }
          : { email: email.trim(), password },
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
      const msg = describeSignetError(error).message;
      setErrorMessage(msg);
      toast.error(msg);
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
      <form onSubmit={handleChallenge} className="flex flex-col gap-5">
        <div className="flex items-start gap-3 border border-signal/30 bg-signal-soft p-3.5 text-xs/relaxed text-foreground">
          <ShieldCheck
            className="mt-0.5 size-4 shrink-0 text-signal"
            aria-hidden="true"
          />
          <span>
            Enter the six-digit code from your authenticator app to finish
            signing in.
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signin-totp">Two-factor code</Label>
          <Input
            id="signin-totp"
            name="totp"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            maxLength={6}
            className="text-center font-mono text-base tracking-[0.4em]"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={busy || code.length < 6}
          className="w-full justify-between"
        >
          <span className="inline-flex items-center gap-2">
            {busy ? (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            ) : null}
            Verify and sign in
          </span>
          <ArrowRight data-icon="inline-end" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div
        className="grid grid-cols-2 border bg-muted/50 p-1"
        role="group"
        aria-label="Sign in method"
      >
        <button
          type="button"
          onClick={() => setMode("email")}
          aria-pressed={mode === "email"}
          className={`mono-label py-1.5 transition-colors ${
            mode === "email"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setMode("username")}
          aria-pressed={mode === "username"}
          className={`mono-label py-1.5 transition-colors ${
            mode === "username"
              ? "bg-card text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Username
        </button>
      </div>

      {mode === "email" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            name="email"
            type="email"
            autoComplete="username"
            spellCheck={false}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Label htmlFor="signin-username">Username</Label>
          <Input
            id="signin-username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="ada.lovelace"
            required
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="signin-password">Password</Label>
        <div className="relative">
          <Input
            id="signin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••••••"
            className="pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          {errorMessage}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={busy}
        className="w-full justify-between"
        size="lg"
      >
        <span className="inline-flex items-center gap-2">
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          Sign in
        </span>
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}
