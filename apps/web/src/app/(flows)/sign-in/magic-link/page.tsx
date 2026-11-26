"use client";

import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { ToSignInLink } from "@/components/auth/flow-links";

export default function MagicLinkPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border bg-card p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight">Magic Link</h1>
          <p className="text-xs/relaxed text-muted-foreground">
            We email you a single-use link — click it in this browser to sign in.
          </p>
        </div>
        <MagicLinkForm />
      </div>
      <ToSignInLink />
    </div>
  );
}
