"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { describeSignetError, signetClient } from "@/lib/signet-client";

export function SignUpForm({
  onCreated,
}: {
  onCreated: (email: string) => void;
}) {
  const router = useRouter();
  const { refresh } = useSession();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await signetClient.signUp({
        username,
        name,
        email,
        password,
      });
      if (result.session_token) {
        await refresh();
        toast.success("Account created");
        router.push("/account");
        return;
      }
      toast.success("Account created — verify your email to finish");
      onCreated(email);
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-username">Username</Label>
        <span
          id="signup-username-hint"
          className="text-xs text-muted-foreground"
        >
          3–30 characters: letters, numbers, dots, underscores.
        </span>
        <Input
          id="signup-username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-describedby="signup-username-hint"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="ada.lovelace"
          pattern="[a-zA-Z0-9_.]{3,30}"
          title="3–30 characters: letters, numbers, dots and underscores (lowercased on the server)"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-name">Full name</Label>
        <Input
          id="signup-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ada Lovelace"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-password">Password</Label>
        <span
          id="signup-password-hint"
          className="text-xs text-muted-foreground"
        >
          At least 6 characters. Password managers and pasting are supported.
        </span>
        <div className="relative">
          <Input
            id="signup-password"
            name="new-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-describedby="signup-password-hint"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••"
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
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={busy}
        className="mt-1 w-full justify-between"
        size="lg"
      >
        <span className="inline-flex items-center gap-2">
          {busy ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          Create account
        </span>
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}
