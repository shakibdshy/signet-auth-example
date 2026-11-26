"use client";

import { findArea } from "@/lib/catalog";
import { CapabilityCard, DocsLink } from "./primitives";
import { FlowRunner } from "./flow-runner";

export function AreaPage({ areaId }: { areaId: string }) {
  const area = findArea(areaId);

  if (!area) {
    return (
      <div className="border border-dashed p-8 text-sm text-muted-foreground">
        Unknown Feature area. Pick one from the sidebar.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 border-b pb-6">
        <div className="flex items-center gap-3">
          <span className="mono-label text-signal">Feature area {area.index}</span>
          <span className="signal-rule w-12" />
        </div>
        <h1 className="display-title text-4xl font-semibold sm:text-5xl">{area.title}</h1>
        <p className="max-w-2xl text-sm/relaxed text-muted-foreground">{area.summary}</p>
        <DocsLink href={area.docs} label="Read the guide" />
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        {area.capabilities.map((capability) =>
          capability.status === "card" ? (
            <CapabilityCard key={capability.id} capability={capability} />
          ) : (
            <FlowRunner key={capability.id} capability={capability} />
          ),
        )}
      </div>
    </div>
  );
}
