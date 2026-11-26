"use client";

import { SignInAlternativesLinks, ToSignUpLink } from "@/components/auth/flow-links";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border bg-card p-6">
        <div className="mb-5 flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight">Sign In</h1>
          <p className="text-xs/relaxed text-muted-foreground">
            Enter your email or username below to login to your account.
          </p>
        </div>
        <SignInForm />
      </div>
      <SignInAlternativesLinks />
      <ToSignUpLink />
    </div>
  );
}
