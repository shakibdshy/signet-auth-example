"use client";

import Link from "next/link";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { ArrowUpRight, MoveRight } from "lucide-react";

import { AuthConsole } from "@/components/auth/auth-console";

const capabilityTicker = [
  "Passwordless",
  "Passkeys",
  "Sessions",
  "OAuth",
  "TOTP",
  "Organizations",
  "API keys",
  "Device flow",
  "SAML",
  "SCIM",
  "Audit",
];

export default function Home() {
  const { status, user } = useSession();

  return (
    <main className="tech-grid relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-px max-w-[1500px] bg-gradient-to-r from-transparent via-signal/50 to-transparent" />

      <div className="mx-auto grid w-full max-w-[1500px] gap-12 px-4 pt-12 pb-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pt-20">
        <section className="flex flex-col justify-between gap-12">
          <div className="flex flex-col gap-8">
            <div className="animate-rise flex items-center gap-3" style={{ animationDelay: "40ms" }}>
              <span className="mono-label text-signal">Chapter 00 / Introduction</span>
              <span className="signal-rule w-10" />
              <span className="mono-label text-muted-foreground">v1.0.0-beta</span>
            </div>

            <h1
              className="animate-rise display-title max-w-4xl text-[clamp(3rem,7.2vw,6.4rem)]"
              style={{ animationDelay: "90ms" }}
            >
              Every auth flow.
              <br />
              <span className="text-signal">In the open.</span>
            </h1>

            <div className="animate-rise flex max-w-xl flex-col gap-4" style={{ animationDelay: "150ms" }}>
              <p className="text-sm/relaxed text-muted-foreground sm:text-base/relaxed">
                Signet is a secure-by-default authentication library you import into a Go app. This
                is its missing face: a working frontend that exercises the flows, shows the real
                responses, and says plainly when a capability needs configuration.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {status === "authenticated" ? (
                  <Button
                    render={<Link href="/showcase/overview" />}
                    nativeButton={false}
                    className="justify-between"
                  >
                    Continue as {user?.name ?? user?.email ?? "member"}
                    <MoveRight data-icon="inline-end" />
                  </Button>
                ) : (
                  <Button
                    render={<Link href="#access-console" />}
                    nativeButton={false}
                    className="justify-between"
                  >
                    Open the access console
                    <MoveRight data-icon="inline-end" />
                  </Button>
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

          <div
            className="animate-rise grid grid-cols-3 border-t pt-6"
            style={{ animationDelay: "210ms" }}
          >
            {[
              { value: "13", label: "Feature areas" },
              { value: "70+", label: "Endpoints" },
              { value: "0", label: "Fake responses" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 border-r pr-4 last:border-r-0">
                <span className="font-display text-2xl font-semibold text-foreground">
                  {stat.value}
                </span>
                <span className="mono-label text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="access-console" className="scroll-mt-24">
          <AuthConsole />
        </section>
      </div>

      <div className="border-t bg-background/60">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
          <span className="mono-label text-muted-foreground">On the workbench</span>
          {capabilityTicker.map((item) => (
            <span key={item} className="font-mono text-xs text-foreground/70">
              {item}
              <span className="ml-6 text-signal">/</span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
