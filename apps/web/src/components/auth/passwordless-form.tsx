"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@signet-auth-example/ui/components/tabs";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { DevInbox } from "@/components/showcase/dev-inbox";
import { describeSignetError, signetClient } from "@/lib/signet-client";

export function PasswordlessForm() {
  const router = useRouter();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState<"magic" | "otp" | null>(null);
  const [busy, setBusy] = useState(false);

  async function finish(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      await refresh();
      toast.success("Passwordless session established");
      router.push("/showcase/overview");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  async function sendMagic(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await signetClient.sendMagicLink({
        email,
        callback_url: `${window.location.origin}/showcase/overview`,
      });
      setSent("magic");
      toast.success("Magic link requested");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await signetClient.sendOtp({ email });
      setSent("otp");
      toast.success("Six-digit code requested");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Tabs defaultValue="magic" className="gap-4">
      <TabsList variant="line" className="w-full">
        <TabsTrigger value="magic" className="flex-1">
          Magic link
        </TabsTrigger>
        <TabsTrigger value="otp" className="flex-1">
          Email OTP
        </TabsTrigger>
      </TabsList>

      <TabsContent value="magic">
        <form onSubmit={sendMagic} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input
              id="magic-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full justify-between">
            {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
            Send magic link
            <ArrowRight data-icon="inline-end" />
          </Button>
        </form>
        {sent === "magic" ? (
          <div className="mt-4 flex flex-col gap-3">
            <DevInbox value={token} onChange={setToken} placeholder="Paste the magic-link token" />
            <Button
              disabled={busy || !token}
              onClick={() =>
                void finish(() => signetClient.verifyMagicLink({ token }))
              }
              className="w-full"
            >
              Verify magic link
            </Button>
          </div>
        ) : null}
      </TabsContent>

      <TabsContent value="otp">
        <form onSubmit={sendCode} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="otp-email">Email</Label>
            <Input
              id="otp-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full justify-between">
            {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
            Send six-digit code
            <ArrowRight data-icon="inline-end" />
          </Button>
        </form>
        {sent === "otp" ? (
          <div className="mt-4 flex flex-col gap-3">
            <DevInbox value={code} onChange={setCode} placeholder="000000" label="Six-digit code" />
            <Button
              disabled={busy || !code}
              onClick={() =>
                void finish(() => signetClient.verifyOtp({ email, code }))
              }
              className="w-full"
            >
              Verify code
            </Button>
          </div>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
