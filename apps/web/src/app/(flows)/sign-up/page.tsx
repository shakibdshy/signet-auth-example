"use client";

import { useState } from "react";

import { CheckInbox } from "@/components/auth/check-inbox";
import { ToSignInLink } from "@/components/auth/flow-links";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { signetClient } from "@/lib/signet-client";

export default function SignUpPage() {
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="border bg-card p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight">Sign Up</h1>
          <p className="text-xs/relaxed text-muted-foreground">
            Enter your information to create an account on the live backend.
          </p>
        </div>
        {createdEmail === null ? (
          <SignUpForm onCreated={setCreatedEmail} />
        ) : (
          <CheckInbox
            email={createdEmail}
            title="Almost there"
            description="Verify your address to finish setting up the account."
            resendLabel="Resend verification email"
            onResend={() => signetClient.sendVerification({ email: createdEmail })}
          />
        )}
      </div>
      <ToSignInLink />
    </div>
  );
}
