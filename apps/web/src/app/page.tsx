"use client";

import Link from "next/link";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import {
  ArrowRight,
  ArrowUpRight,
  KeyRound,
  Link2,
  MailCheck,
  RotateCcw,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

const flows = [
  {
    href: "/sign-up",
    title: "Sign Up",
    tag: "01",
    icon: UserPlus,
    description: "Create a real account with username, email, and password.",
  },
  {
    href: "/sign-in",
    title: "Sign In",
    tag: "02",
    icon: ShieldCheck,
    description: "Authenticate with email or username, plus 2FA challenge.",
  },
  {
    href: "/sign-in/magic-link",
    title: "Magic Link",
    tag: "03",
    icon: Link2,
    description: "Passwordless sign-in via single-use emailed link.",
  },
  {
    href: "/sign-in/otp",
    title: "One-Time Code",
    tag: "04",
    icon: KeyRound,
    description: "Six-digit numeric verification code sent to your inbox.",
  },
  {
    href: "/verify-email",
    title: "Verify Email",
    tag: "05",
    icon: MailCheck,
    description: "Confirm email ownership via link or manual token entry.",
  },
  {
    href: "/forgot-password",
    title: "Reset Password",
    tag: "06",
    icon: RotateCcw,
    description: "Single-use reset proof that revokes all existing sessions.",
  },
] as const;

export default function Home() {
  const { status, user } = useSession();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col items-start gap-5 border-b pb-10">
        <div className="inline-flex items-center gap-2 border bg-card px-2.5 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-seal" aria-hidden="true" />
          <span>Live Go Backend</span>
          <span className="text-border" aria-hidden="true">
            |
          </span>
          <span className="font-mono text-[0.7rem] text-foreground">Nothing Simulated</span>
        </div>

        <h1 className="display-title max-w-2xl text-4xl sm:text-5xl">
          Signet Auth Demo.
        </h1>

        <p className="max-w-xl text-sm/relaxed text-muted-foreground sm:text-base/relaxed">
          A live reference frontend for Signet, the authentication library for Go. Complete real
          sign-up, sign-in, session management, passwordless flows, and raw API calls.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {status === "authenticated" ? (
            <Button render={<Link href="/account" />} nativeButton={false} size="lg">
              Open Dashboard ({user?.name ?? user?.email})
              <ArrowRight data-icon="inline-end" />
            </Button>
          ) : (
            <>
              <Button render={<Link href="/sign-up" />} nativeButton={false} size="lg">
                Create account
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button render={<Link href="/sign-in" />} nativeButton={false} variant="outline" size="lg">
                Sign in
              </Button>
            </>
          )}
          <a
            href="https://go-signet-auth.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1 border px-4 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            OpenAPI Docs
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-label="Authentication flows">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Authentication Flows</h2>
          <span className="mono-label text-muted-foreground">6 Real User Flows</span>
        </div>

        <div className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {flows.map(({ href, title, tag, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col justify-between gap-4 bg-card p-5 transition-colors hover:bg-accent/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{tag}</span>
                <Icon
                  className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                  <ArrowRight
                    className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs/relaxed text-muted-foreground">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
