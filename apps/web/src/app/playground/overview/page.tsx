"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@signet-auth-example/ui/components/badge";
import { Button } from "@signet-auth-example/ui/components/button";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/playground/primitives";
import { ALL_CAPABILITIES, FEATURE_AREAS, STATUS_META } from "@/lib/catalog";
import { describeSignetError, signetClient } from "@/lib/signet-client";

export default function OverviewPage() {
  const [busy, setBusy] = useState(false);
  const [probe, setProbe] = useState<Record<string, string> | null>(null);

  async function recheck() {
    setBusy(true);
    try {
      const [lastMethod, sessions, user] = await Promise.all([
        signetClient.lastSignInMethod(),
        signetClient.listSessions(),
        signetClient.me(),
      ]);
      setProbe({
        "last sign-in method": lastMethod.method || "(none)",
        "signed in as": user.email,
        "active sessions": String(sessions.sessions.length),
      });
      toast.success("Read-only checks refreshed");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  const counts = {
    live: ALL_CAPABILITIES.filter((capability) => capability.status === "live").length,
    gated: ALL_CAPABILITIES.filter((capability) => capability.status === "gated").length,
    unconfigured: ALL_CAPABILITIES.filter((capability) => capability.status === "unconfigured")
      .length,
    card: ALL_CAPABILITIES.filter((capability) => capability.status === "card").length,
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center gap-3">
          <span className="mono-label text-signal">Chapter 01 / Overview</span>
          <span className="signal-rule w-12" />
        </div>
        <h1 className="display-title text-4xl font-semibold sm:text-5xl">
          The whole surface.
          <br />
          <span className="text-muted-foreground">No hidden parts.</span>
        </h1>
        <p className="max-w-2xl text-sm/relaxed text-muted-foreground">
          Every capability below is either a real call through the typed client, an honest
          configuration-gated panel, or a library card where no browser endpoint exists. Nothing
          here fakes a successful response.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(STATUS_META) as Array<keyof typeof STATUS_META>).map((status) => (
          <div key={status} className="flex flex-col gap-2 border bg-card p-4">
            <StatusBadge status={status} />
            <span className="font-display text-3xl font-semibold">{counts[status]}</span>
            <span className="text-xs/relaxed text-muted-foreground">
              {STATUS_META[status].description}
            </span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-semibold">Feature areas</h2>
          <Button variant="outline" size="sm" onClick={() => void recheck()} disabled={busy}>
            {busy ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
            Read-only recheck
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURE_AREAS.map((area) => (
            <Link
              key={area.id}
              href={`/playground/${area.id}`}
              className="group flex flex-col gap-3 border bg-card p-4 transition-colors hover:border-signal/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] text-signal">{area.index}</span>
                <Badge variant="outline" className="mono-label text-muted-foreground">
                  {area.capabilities.length} items
                </Badge>
              </div>
              <h3 className="font-display text-base font-semibold">{area.title}</h3>
              <p className="text-xs/relaxed text-muted-foreground">{area.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {probe ? (
        <section className="border bg-muted/30 p-4">
          <h2 className="mono-label mb-3 text-signal">Last read-only probe</h2>
          <dl className="grid gap-2 sm:grid-cols-2">
            {Object.entries(probe).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1">
                <dt className="mono-label text-muted-foreground">{key}</dt>
                <dd className="font-mono text-xs">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
