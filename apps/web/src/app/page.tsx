"use client";

import Link from "next/link";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { ArrowUpRight, MoveRight } from "lucide-react";

const flows = [
  {
    href: "/sign-up",
    index: "01",
    title: "Sign up",
    description: "Email, username, and a password — a real account with a real verification email.",
  },
  {
    href: "/sign-in",
    index: "02",
    title: "Sign in",
    description: "Password sign-in with your email or your username. Both work.",
  },
  {
    href: "/sign-in/magic-link",
    index: "03",
    title: "Magic link",
    description: "One emailed link, one click, one session. No password anywhere.",
  },
  {
    href: "/sign-in/otp",
    index: "04",
    title: "One-time code",
    description: "Six digits to your inbox — type them in and you're signed in.",
  },
  {
    href: "/forgot-password",
    index: "06",
    title: "Reset password",
    description: "A single-use reset link. New password in, every old session out.",
  },
  {
    href: "/playground/overview",
    index: "—",
    title: "Playground",
    description: "The developer tool behind this app: every Signet endpoint, callable, raw.",
  },
] as const;

export default function Home() {
  const { status, user } = useSession();

  return (
    <main className="tech-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-px max-w-[1500px] bg-gradient-to-r from-transparent via-signal/50 to-transparent" />

      <div className="mx-auto grid w-full max-w-[1500px] gap-12 px-4 pt-12 pb-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:pt-20">
        <section className="flex flex-col justify-between gap-12">
          <div className="flex flex-col gap-8">
            <div className="animate-rise flex items-center gap-3" style={{ animationDelay: "40ms" }}>
              <span className="mono-label text-signal">Signet example app</span>
              <span className="signal-rule w-10" />
              <span className="mono-label text-muted-foreground">live backend</span>
            </div>

            <h1
              className="animate-rise display-title max-w-3xl text-[clamp(2.6rem,6vw,5rem)]"
              style={{ animationDelay: "90ms" }}
            >
              Real auth flows.
              <br />
              <span className="text-signal">Nothing simulated.</span>
            </h1>

            <div className="animate-rise flex max-w-xl flex-col gap-4" style={{ animationDelay: "150ms" }}>
              <p className="text-sm/relaxed text-muted-foreground sm:text-base/relaxed">
                Signet is a secure-by-default authentication library for Go. This app is how a real
                product would use it: sign up, verify, sign in by password, magic link, or
                one-time code — every step completes against the deployed backend, emails
                included.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {status === "authenticated" ? (
                  <Button
                    render={<Link href="/account" />}
                    nativeButton={false}
                    className="justify-between"
                  >
                    Open your account
                    <MoveRight data-icon="inline-end" />
                  </Button>
                ) : (
                  <>
                    <Button
                      render={<Link href="/sign-up" />}
                      nativeButton={false}
                      className="justify-between"
                    >
                      Create an account
                      <MoveRight data-icon="inline-end" />
                    </Button>
                    <Button
                      render={<Link href="/sign-in" />}
                      nativeButton={false}
                      variant="outline"
                      className="justify-between"
                    >
                      Sign in
                    </Button>
                  </>
                )}
                <a
                  href="https://go-signet-auth.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="mono-label inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  Read the docs
                  <ArrowUpRight data-icon="inline-end" />
                </a>
              </div>
            </div>
          </div>

          <div className="animate-rise flex flex-col gap-2 border-t pt-6" style={{ animationDelay: "210ms" }}>
            <span className="mono-label text-muted-foreground">
              {status === "authenticated" && user
                ? `Signed in as ${user.email}`
                : "Pick a flow and start walking"}
            </span>
            <span className="text-sm/relaxed text-muted-foreground">
              Everything you do here happens for real: real accounts, real emails, real sessions
              you can see and revoke in your account page.
            </span>
          </div>
        </section>

        <section className="animate-rise grid content-start gap-3 sm:grid-cols-2" style={{ animationDelay: "160ms" }}>
          {flows.map(({ href, index, title, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-2 border bg-card/60 p-5 transition-colors hover:border-signal"
            >
              <span className="mono-label flex items-center justify-between text-muted-foreground">
                <span className="text-signal">{index}</span>
                <MoveRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="font-display text-lg font-semibold">{title}</span>
              <span className="text-sm/relaxed text-muted-foreground">{description}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
