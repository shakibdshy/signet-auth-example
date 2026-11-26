"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { TokenEntry } from "@/components/auth/token-entry";
import { ToSignInLink } from "@/components/auth/flow-links";
import { describeSignetError, signetClient } from "@/lib/signet-client";

function ResetPasswordInner() {
  const router = useRouter();
  const [token, setToken] = useState(useSearchParams().get("token") ?? "");
  const [password, setPassword] = useState("");
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
      <p className="text-sm/relaxed text-muted-foreground">
        The reset email contains a single-use link. Open it to land here with the token attached —
        or paste the token manually. This revokes every existing session.
      </p>
      <TokenEntry
        id="reset-token"
        label="Reset token"
        value={token}
        onChange={setToken}
        placeholder="Prefilled when you arrive from the email"
      />
      <div className="flex flex-col gap-2">
        <Label htmlFor="reset-password">New password</Label>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least twelve characters"
          minLength={12}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={busy || !token}
        className="w-full justify-between"
      >
        {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
        Set new password
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="mono-label text-signal">Flow 06 / Reset password</span>
        <h1 className="display-title text-3xl font-semibold sm:text-4xl">Choose a new password.</h1>
        <p className="text-sm/relaxed text-muted-foreground">
          One token, one use, then it&apos;s dead — and every old session goes with it.
        </p>
      </div>
      <div className="border bg-card/60 p-6">
        <Suspense fallback={null}>
          <ResetPasswordInner />
        </Suspense>
      </div>
      <ToSignInLink />
    </div>
  );
}
