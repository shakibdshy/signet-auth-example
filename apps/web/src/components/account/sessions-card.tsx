"use client";

import { Button } from "@signet-auth-example/ui/components/button";
import { LoaderCircle } from "lucide-react";

export type SessionRow = {
  id: string;
  created_at: string;
  absolute_expires_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SessionsCard({
  sessions,
  busy,
  onRevokeCurrent,
  onRevokeAll,
}: {
  sessions: SessionRow[];
  busy: boolean;
  onRevokeCurrent: () => void;
  onRevokeAll: () => void;
}) {
  return (
    <section className="flex flex-col gap-5 border bg-card/60 p-6">
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <span className="mono-label text-muted-foreground">
          Sessions <span className="text-signal">/ {sessions.length}</span>
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={busy} onClick={onRevokeCurrent}>
            Sign out here
          </Button>
          <Button variant="outline" size="sm" disabled={busy} onClick={onRevokeAll}>
            Revoke all
          </Button>
        </div>
      </div>
      {busy ? <LoaderCircle className="size-4 animate-spin text-muted-foreground" /> : null}
      {sessions.length === 0 && !busy ? (
        <p className="text-sm text-muted-foreground">No active sessions.</p>
      ) : (
        <ul className="flex flex-col">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-b-0"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {session.id.slice(0, 8)}…
              </span>
              <span className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
                <span>started {formatDate(session.created_at)}</span>
                <span>expires {formatDate(session.absolute_expires_at)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
