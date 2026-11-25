"use client";

import { Badge } from "@signet-auth-example/ui/components/badge";
import { Button } from "@signet-auth-example/ui/components/button";
import { ArrowUpRight, Clipboard } from "lucide-react";
import { toast } from "sonner";

import { STATUS_META, type Capability, type CapabilityStatus } from "@/lib/catalog";

export function StatusBadge({ status }: { status: CapabilityStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge variant="outline" className={`mono-label ${meta.tone}`} title={meta.description}>
      {meta.label}
    </Badge>
  );
}

export function EndpointChip({ method, path }: { method?: string; path?: string }) {
  if (!method || !path) return null;
  return (
    <span className="inline-flex items-center gap-2 border bg-muted/40 px-2 py-1 font-mono text-[0.68rem]">
      <span className="text-signal">{method}</span>
      <span className="text-muted-foreground">{path}</span>
    </span>
  );
}

export function DocsLink({ href, label = "View docs" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mono-label inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
      <ArrowUpRight data-icon="inline-end" />
    </a>
  );
}

export function CodeSnippet({ snippet }: { snippet?: string }) {
  if (!snippet) return null;
  return (
    <div className="relative border bg-muted/30">
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Copy code snippet"
        className="absolute top-1 right-1"
        onClick={() => {
          void navigator.clipboard.writeText(snippet).then(() => toast.success("Snippet copied"));
        }}
      >
        <Clipboard />
      </Button>
      <pre className="overflow-x-auto p-3 pr-10 font-mono text-[0.7rem] leading-relaxed text-muted-foreground">
        {snippet}
      </pre>
    </div>
  );
}

export function CapabilityCard({ capability }: { capability: Capability }) {
  return (
    <article className="flex flex-col gap-3 border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-sm font-semibold">{capability.name}</h3>
        <StatusBadge status={capability.status} />
      </div>
      <p className="text-xs/relaxed text-muted-foreground">{capability.summary}</p>
      {capability.reason ? (
        <p className="border-l-2 border-signal pl-3 text-xs/relaxed text-muted-foreground">
          {capability.reason}
        </p>
      ) : null}
      <div className="mt-auto pt-2">
        <DocsLink href={capability.docs} />
      </div>
    </article>
  );
}
