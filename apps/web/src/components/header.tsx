"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import { ArrowUpRight } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

const externalLinks = [
  { href: "https://go-signet-auth.vercel.app/", label: "Docs" },
  { href: "https://github.com/shakibdshy/signet-auth", label: "Source" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { status, user } = useSession();
  const inAccount = pathname.startsWith("/account");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-7 place-items-center bg-primary text-primary-foreground">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="square"
              >
                <path d="M12 3L4 7v5c0 5 3.4 8.6 8 9.8 4.6-1.2 8-4.8 8-9.8V7l-8-4z" />
                <path d="M9.5 12.2l1.8 1.8 3.4-3.6" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-tight">SIGNET</span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
            {externalLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">

          {status === "authenticated" ? (
            <Button
              render={<Link href="/account" />}
              nativeButton={false}
              variant={inAccount ? "default" : "outline"}
              size="sm"
            >
              <span className="size-1.5 rounded-full bg-seal" aria-hidden="true" />
              <span className="max-w-32 truncate">{user?.name ?? "Dashboard"}</span>
            </Button>
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
              >
                Sign up
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
