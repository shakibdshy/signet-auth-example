"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { describeSignetError, signetClient } from "@/lib/signet-client";

export function SignUpForm({ onCreated }: { onCreated: (email: string) => void }) {
  const router = useRouter();
  const { refresh } = useSession();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await signetClient.signUp({ username, name, email, password });
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-username">Username</Label>
        <Input
          id="signup-username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="how you will sign in"
          pattern="[a-zA-Z0-9_.]{3,30}"
          title="3–30 characters: letters, numbers, dots and underscores (lowercased on the server)"
          required
        />
        <p className="mono-label text-muted-foreground">
          3–30 characters — letters, numbers, dots, underscores.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ada Lovelace"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least twelve characters"
          minLength={12}
          required
        />
      </div>
      <Button type="submit" disabled={busy} className="w-full justify-between">
        {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
        Create account
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}
