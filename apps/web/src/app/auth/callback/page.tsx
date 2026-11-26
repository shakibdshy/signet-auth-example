"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { LoaderCircle, MailWarning } from "lucide-react";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { status, refresh } = useSession();
  const attempted = useRef(false);
  const [failed, setFailed] = useState(params.get("error") !== null);

  useEffect(() => {
    if (attempted.current || failed) return;
    attempted.current = true;
    void refresh();
  }, [refresh, failed]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/account");
    }
  }, [status, router]);

  useEffect(() => {
    if (!failed && status === "anonymous") {
      const timer = setTimeout(() => setFailed(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [status, failed]);

  if (failed) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 border border-destructive/30 bg-destructive/10 p-4">
          <MailWarning className="size-5 text-destructive" aria-hidden="true" />
          <span className="text-sm font-semibold">Link invalid or expired</span>
          <p className="text-xs/relaxed text-muted-foreground">
            Sign-in links are single-use and must be opened in the same browser
            that requested them. Request a fresh one and try again.
          </p>
        </div>
        <Button
          render={<Link href="/sign-in/magic-link" />}
          nativeButton={false}
          className="justify-between"
        >
          Request a new magic link
        </Button>
        <Button
          render={<Link href="/sign-in" />}
          nativeButton={false}
          variant="outline"
          className="justify-between"
        >
          Sign in with a password instead
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <LoaderCircle
        className="size-6 animate-spin text-foreground"
        aria-hidden="true"
      />
      <p className="mono-label text-muted-foreground">
        Verifying session cookie…
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12 sm:px-6">
      <div className="border bg-card p-6">
        <div className="mb-4 flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight">Magic Link</h1>
        </div>
        <Suspense fallback={null}>
          <CallbackInner />
        </Suspense>
      </div>
    </main>
  );
}
