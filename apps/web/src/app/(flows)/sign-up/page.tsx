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
      <div className="flex flex-col gap-2">
        <span className="mono-label text-signal">Flow 01 / Sign up</span>
        <h1 className="display-title text-3xl font-semibold sm:text-4xl">Create your account.</h1>
        <p className="text-sm/relaxed text-muted-foreground">
          A real account on the deployed backend — username, email, and a password. A verification
          email follows.
        </p>
      </div>
      <div className="border bg-card/60 p-6">
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
