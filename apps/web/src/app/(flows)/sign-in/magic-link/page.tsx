"use client";

import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { ToSignInLink } from "@/components/auth/flow-links";

export default function MagicLinkPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="mono-label text-signal">Flow 03 / Magic link</span>
        <h1 className="display-title text-3xl font-semibold sm:text-4xl">Sign in by email.</h1>
        <p className="text-sm/relaxed text-muted-foreground">
          No password. We email you a single-use link — click it in this browser and you&apos;re
          in.
        </p>
      </div>
      <div className="border bg-card/60 p-6">
        <MagicLinkForm />
      </div>
      <ToSignInLink />
    </div>
  );
}
