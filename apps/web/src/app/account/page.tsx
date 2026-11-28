"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@shakibdshy/signet-auth-react";

import { Button } from "@signet-auth-example/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@signet-auth-example/ui/components/dropdown-menu";
import {
  ChevronDown,
  Fingerprint,
  LoaderCircle,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

import { OrganizationCard } from "@/components/account/organization-card";
import { ProfileCard } from "@/components/account/profile-card";
import {
  AddPasskeyDialog,
  ChangePasswordDialog,
  EnableTwoFactorDialog,
} from "@/components/account/security-dialogs";
import {
  SessionsCard,
  type SessionRow,
} from "@/components/account/sessions-card";
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

  async function inspectPasskeys() {
    try {
      const result = await signetClient.listPasskeys();
      toast.info(
        `Passkeys registered: ${Array.isArray(result) ? result.length : 0}`,
      );
    } catch (error) {
      toast.error(describeSignetError(error).message);
    }
  }

  if (status !== "authenticated" || !user) {
    return (
      <main className="grid min-h-[50vh] place-items-center">
        <LoaderCircle
          className="size-6 animate-spin text-foreground"
          aria-label="Loading account"
        />
      </main>
    );
  }

  const initial = (user.name || user.email || "S").slice(0, 1).toUpperCase();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10">
      {/* Account Switcher Dropdown (matching Better Auth Demo) */}
      <div className="flex items-center justify-between gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="sm" className="gap-2.5" />}
          >
            <span className="grid size-5 place-items-center bg-muted font-mono text-[0.65rem] font-semibold">
              {initial}
            </span>
            <span className="max-w-40 truncate">{user.name}</span>
            <ChevronDown
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Current Account
              </DropdownMenuLabel>
              <DropdownMenuItem className="flex items-center gap-2.5">
                <span className="grid size-6 shrink-0 place-items-center bg-muted font-mono text-xs font-semibold">
                  {initial}
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-medium">
                    {user.name}
                  </span>
                  <span className="truncate font-mono text-[0.65rem] text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Switch Account
              </DropdownMenuLabel>
              <DropdownMenuItem render={<Link href="/sign-in" />}>
                <PlusCircle className="size-3.5" aria-hidden="true" />
                Add Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Card 1: Main User & Security Card */}
      <section className="flex flex-col border bg-card">
        <div className="border-b px-5 py-3.5">
          <h1 className="text-sm font-semibold">User</h1>
        </div>

        <div className="flex flex-col gap-6 p-5">
          <ProfileCard user={user} lastMethod={lastMethod} />

          <SessionsCard
            sessions={sessions}
            busy={busy}
            onRevokeCurrent={() => void revokeCurrent()}
            onRevokeAll={() => void revokeAll()}
          />
        </div>

        <div className="grid gap-4 border-t px-5 py-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-medium text-foreground">
              Passkeys
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <AddPasskeyDialog />
              <Button
                variant="outline"
                size="sm"
                onClick={() => void inspectPasskeys()}
              >
                <Fingerprint className="size-3.5" aria-hidden="true" />
                Passkeys
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:items-end">
            <span className="text-xs font-medium text-foreground">
              Two Factor
            </span>
            <div>
              <EnableTwoFactorDialog />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4">
          <ChangePasswordDialog />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void signOut().then(() => router.push("/"));
            }}
          >
            <LogOut className="size-3.5" aria-hidden="true" />
            Sign Out
          </Button>
        </div>
      </section>

      {/* Card 2: Organization Card */}
      <OrganizationCard user={user} />
    </main>
  );
}
