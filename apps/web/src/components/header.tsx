"use client";

import Link from "next/link";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { ArrowUpRight } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

const externalLinks = [
  { href: "https://go-signet-auth.vercel.app/", label: "Docs" },
  { href: "https://github.com/shakibdshy/signet-auth", label: "Source" },
] as const;

export default function Header() {
  const { status, user } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1500px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid size-8 place-items-center border border-signal bg-signal-soft">
            <span className="font-display text-sm font-bold text-signal">S</span>
            <span className="absolute -top-px -right-px size-1.5 bg-signal" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-base font-semibold tracking-tight">Signet</span>
            <span className="mono-label mt-1 text-muted-foreground">Auth / Go</span>
          </span>
        </Link>

        <span className="hidden h-5 w-px bg-border lg:block" />

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          <Link
            href="/playground/overview"
            className="mono-label text-muted-foreground transition-colors hover:text-foreground"
          >
            Playground
          </Link>
          {externalLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mono-label inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
              <ArrowUpRight data-icon="inline-end" />
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {status === "authenticated" ? (
            <>
              <span className="hidden max-w-40 truncate font-mono text-xs text-foreground/80 lg:inline">
                {user?.name ?? user?.email}
              </span>
              <Button
                render={<Link href="/account" />}
                nativeButton={false}
                variant="outline"
                size="sm"
              >
                Account
              </Button>
            </>
          ) : (
            <>
              <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign in
              </Button>
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                size="sm"
                className="mono-label"
              >
                Create account
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
