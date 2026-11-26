"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { ProfileCard } from "@/components/account/profile-card";
import { SessionsCard, type SessionRow } from "@/components/account/sessions-card";
import { describeSignetError, signetClient } from "@/lib/signet-client";

export default function AccountPage() {
  const router = useRouter();
  const { status, user, signOut } = useSession();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [lastMethod, setLastMethod] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "anonymous") {
      router.replace("/sign-in");
    }
  }, [status, router]);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const [sessionList, method] = await Promise.all([
        signetClient.listSessions(),
        signetClient.lastSignInMethod().catch(() => null),
      ]);
      setSessions(sessionList.sessions);
      setLastMethod(method?.method ?? null);
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") void load();
  }, [status, load]);

  async function revokeCurrent() {
    setBusy(true);
    try {
      await signetClient.revokeSession();
      toast.success("Session revoked");
      await signOut();
      router.push("/");
    } catch (error) {
      toast.error(describeSignetError(error).message);
      setBusy(false);
    }
  }

  async function revokeAll() {
    setBusy(true);
    try {
      await signetClient.revokeAllSessions();
      toast.success("Every session revoked");
      await signOut();
      router.push("/");
    } catch (error) {
      toast.error(describeSignetError(error).message);
      setBusy(false);
    }
  }

  if (status !== "authenticated" || !user) {
    return (
      <main className="grid min-h-[50vh] place-items-center">
        <LoaderCircle className="size-6 animate-spin text-signal" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="mono-label text-signal">Signed in</span>
          <h1 className="display-title text-3xl font-semibold sm:text-4xl">Your account.</h1>
          <p className="text-sm/relaxed text-muted-foreground">
            Every flow you completed — sign-up, verification, sign-in — ends up here.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileCard user={user} lastMethod={lastMethod} />
          <SessionsCard
            sessions={sessions}
            busy={busy}
            onRevokeCurrent={() => void revokeCurrent()}
            onRevokeAll={() => void revokeAll()}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t pt-5">
          <Link
            href="/playground/overview"
            className="mono-label text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore the playground →
          </Link>
          <button
            type="button"
            className="mono-label text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              void signOut().then(() => router.push("/"));
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
