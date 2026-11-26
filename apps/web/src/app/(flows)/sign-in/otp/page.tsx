"use client";

import { OtpForm } from "@/components/auth/otp-form";
import { ToSignInLink } from "@/components/auth/flow-links";

export default function OtpPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border bg-card p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight">One-Time Code</h1>
          <p className="text-xs/relaxed text-muted-foreground">
            We email you a six-digit code. Type it here to sign in.
          </p>
        </div>
        <OtpForm />
      </div>
      <ToSignInLink />
    </div>
  );
}
