"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { TokenEntry } from "@/components/auth/token-entry";
import { ToSignInLink } from "@/components/auth/flow-links";
import { describeSignetError, signetClient } from "@/lib/signet-client";

function ResetPasswordInner() {
  const router = useRouter();
  const [token, setToken] = useState(useSearchParams().get("token") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await signetClient.resetPassword({ token, new_password: password });
      toast.success("Password updated — sign in with it now");
      router.push("/sign-in");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <TokenEntry
        id="reset-token"
        label="Reset token"
        value={token}
        onChange={setToken}
        placeholder="Prefilled when you arrive from the email"
      />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reset-password">New password</Label>
        <span id="reset-password-hint" className="text-xs text-muted-foreground">
          At least 6 characters.
        </span>
        <div className="relative">
          <Input
            id="reset-password"
            name="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-describedby="reset-password-hint"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••••••"
            minLength={6}
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
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" disabled={busy || !token} className="w-full justify-between">
        <span className="inline-flex items-center gap-2">
          {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
          Set new password
        </span>
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border bg-card p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight">Reset Password</h1>
          <p className="text-xs/relaxed text-muted-foreground">
            One token, one use, then it&apos;s dead — and every old session goes with it.
          </p>
        </div>
        <Suspense fallback={null}>
          <ResetPasswordInner />
        </Suspense>
      </div>
      <ToSignInLink />
    </div>
  );
}
