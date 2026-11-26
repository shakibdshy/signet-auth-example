"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@signet-auth-example/ui/components/alert-dialog";
import { Laptop, LoaderCircle } from "lucide-react";

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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground">
          Active Sessions{" "}
          <span className="font-mono text-muted-foreground">[{sessions.length}]</span>
        </span>
        {sessions.length > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <button
                  type="button"
                  disabled={busy}
                  className="text-xs text-destructive transition-colors hover:underline disabled:opacity-50"
                />
              }
            >
              Revoke all
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke all active sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately invalidate all {sessions.length} active session
                  {sessions.length === 1 ? "" : "s"}, including your current browser session, and
                  sign you out.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onRevokeAll}>Revoke all sessions</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>

      {busy ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
          Loading sessions…
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-xs text-muted-foreground">No active sessions.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sessions.map((session, idx) => (
            <li
              key={session.id}
              className="flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <Laptop className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span className="font-mono text-foreground">{session.id.slice(0, 8)}…</span>
                <span className="text-muted-foreground">
                  started {formatDate(session.created_at)}
                </span>
              </div>
              {idx === 0 ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={onRevokeCurrent}
                  className="text-xs text-destructive transition-colors hover:underline disabled:opacity-50"
                >
                  Sign Out
                </button>
              ) : (
                <span className="font-mono text-[0.7rem] text-muted-foreground">
                  expires {formatDate(session.absolute_expires_at)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
