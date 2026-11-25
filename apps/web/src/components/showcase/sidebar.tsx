"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FEATURE_AREAS } from "@/lib/catalog";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <details className="group border bg-sidebar" open>
      <summary className="mono-label flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sidebar-foreground">
        Feature areas
        <span className="text-sidebar-primary transition-transform group-open:rotate-45">+</span>
      </summary>
      <nav aria-label="Feature areas" className="border-t">
        <ul className="flex flex-col">
          {FEATURE_AREAS.map((area) => {
            const href = `/showcase/${area.id}` as `/showcase/${(typeof FEATURE_AREAS)[number]["id"]}`;
            const active = pathname === href;
            return (
              <li key={area.id}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`group/link flex items-center gap-3 border-b border-sidebar-border px-4 py-2.5 text-xs transition-colors last:border-b-0 ${
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  }`}
                >
                  <span className="font-mono text-[0.65rem] text-sidebar-primary/80">
                    {area.index}
                  </span>
                  <span className="truncate">{area.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </details>
  );
}
