"use client";

import { useState } from "react";
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
import { LoaderCircle, LogOut } from "lucide-react";

export function UserMenu() {
  const router = useRouter();
  const { status, user, signOut } = useSession();
  const [busy, setBusy] = useState(false);

  if (status === "loading") {
    return <LoaderCircle className="animate-spin text-muted-foreground" />;
  }

  if (status === "anonymous") {
    return (
      <Button render={<Link href="/" />} nativeButton={false} size="sm" className="mono-label">
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <span className="grid size-5 place-items-center border border-signal bg-signal-soft font-mono text-[0.6rem] text-signal">
          {(user?.name ?? user?.email ?? "S").slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden max-w-32 truncate sm:inline">{user?.email}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span className="text-foreground">{user?.name}</span>
            <span className="font-mono text-[0.65rem] normal-case tracking-normal text-muted-foreground">
              {user?.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void signOut().finally(() => {
                setBusy(false);
                router.push("/");
              });
            }}
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
