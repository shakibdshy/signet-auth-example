"use client";

import { SignInAlternativesLinks, ToSignUpLink } from "@/components/auth/flow-links";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="mono-label text-signal">Flow 02 / Sign in</span>
        <h1 className="display-title text-3xl font-semibold sm:text-4xl">Welcome back.</h1>
        <p className="text-sm/relaxed text-muted-foreground">
          Sign in with your email or your username — both work.
        </p>
      </div>
      <div className="border bg-card/60 p-6">
        <SignInForm />
      </div>
      <SignInAlternativesLinks />
      <ToSignUpLink />
    </div>
  );
}
