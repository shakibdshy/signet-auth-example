"use client";

import { useState } from "react";

import { Badge } from "@signet-auth-example/ui/components/badge";
import { Button } from "@signet-auth-example/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@signet-auth-example/ui/components/tabs";
import { Clipboard, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { PasswordlessForm } from "./passwordless-form";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

const DEMO_EMAIL = "demo@signet.dev";
const DEMO_PASSWORD = "SignetDemo!2026";

export function AuthConsole() {
  const [tab, setTab] = useState("signin");

  return (
    <div className="animate-rise border bg-card shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <KeyRound className="size-3.5 text-signal" />
          <span className="mono-label text-muted-foreground">Access console / 001</span>
        </div>
        <Badge variant="outline" className="mono-label border-signal text-signal">
          Live
        </Badge>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="gap-5 p-5">
        <TabsList variant="line" className="w-full border-b">
          <TabsTrigger value="signin" className="flex-1">
            Sign in
          </TabsTrigger>
          <TabsTrigger value="signup" className="flex-1">
            Create account
          </TabsTrigger>
          <TabsTrigger value="passwordless" className="flex-1">
            Passwordless
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm onCreated={() => setTab("signin")} />
        </TabsContent>
        <TabsContent value="passwordless">
          <PasswordlessForm />
        </TabsContent>
      </Tabs>

      <div className="border-t bg-muted/20 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="mono-label text-muted-foreground">Demo account</span>
            <span className="font-mono text-xs text-foreground">{DEMO_EMAIL}</span>
            <span className="font-mono text-xs text-foreground">{DEMO_PASSWORD}</span>
            <span className="mt-1 text-xs/relaxed text-muted-foreground">
              Public and non-sensitive. Do not use it for anything real.
            </span>
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Copy demo credentials"
            onClick={() => {
              void navigator.clipboard
                .writeText(`${DEMO_EMAIL}\n${DEMO_PASSWORD}`)
                .then(() => toast.success("Credentials copied"));
            }}
          >
            <Clipboard />
          </Button>
        </div>
      </div>
    </div>
  );
}
