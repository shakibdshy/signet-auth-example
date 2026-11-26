"use client";

import { OtpForm } from "@/components/auth/otp-form";
import { ToSignInLink } from "@/components/auth/flow-links";

export default function OtpPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="mono-label text-signal">Flow 04 / One-time code</span>
        <h1 className="display-title text-3xl font-semibold sm:text-4xl">Sign in by code.</h1>
        <p className="text-sm/relaxed text-muted-foreground">
          We email you a six-digit code. Type it here and you&apos;re in.
        </p>
      </div>
      <div className="border bg-card/60 p-6">
        <OtpForm />
      </div>
      <ToSignInLink />
    </div>
  );
}
