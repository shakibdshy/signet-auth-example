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
    // Only conclude failure once the refresh has had its chance to see the new cookie.
    if (!failed && status === "anonymous") {
      const timer = setTimeout(() => setFailed(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [status, failed]);

  if (failed) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 border bg-signal-soft/40 p-5">
          <MailWarning className="size-6 text-signal" />
          <div className="flex flex-col gap-1">
            <span className="font-display text-lg font-semibold">Link invalid or expired</span>
            <p className="text-sm/relaxed text-muted-foreground">
              Sign-in links are single-use and must be opened in the same browser that requested
              them. Request a fresh one and try again.
            </p>
          </div>
        </div>
        <Button render={<Link href="/sign-in/magic-link" />} nativeButton={false} className="justify-between">
          Request a new magic link
        </Button>
        <Button render={<Link href="/sign-in" />} nativeButton={false} variant="outline" className="justify-between">
          Sign in with a password instead
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <LoaderCircle className="size-6 animate-spin text-signal" />
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="mono-label text-signal">Flow 03 / Magic link</span>
        <h1 className="display-title text-3xl font-semibold sm:text-4xl">One moment.</h1>
      </div>
      <div className="border bg-card/60 p-6">
        <Suspense fallback={null}>
          <CallbackInner />
        </Suspense>
      </div>
    </div>
  );
}
