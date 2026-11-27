"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@signet-auth-example/ui/components/dropdown-menu";
import { ChevronDown, LoaderCircle } from "lucide-react";

import { describeSignetError, signetClient } from "@/lib/signet-client";
import { InviteMemberDialog, NewOrganizationDialog } from "./security-dialogs";

type Org = {
  ID: string;
  Name: string;
  OwnerID: string;
  CreatedAt: string;
};

type Member = {
  UserID: string;
  Role: string;
};

export function OrganizationCard({
  user,
}: {
  user: { id: string; name: string; email: string };
}) {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);

  const loadMembers = useCallback(async (orgId: string) => {
    setLoadingMembers(true);
    try {
      const res = await signetClient.listOrganizationMembers(orgId);
      setMembers(res.Members ?? []);
    } catch {
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  const loadOrganizations = useCallback(
    async (preferOrgId?: string) => {
      setLoadingOrgs(true);
      setOrgError(null);
      try {
        const [listRes, activeRes] = await Promise.all([
          signetClient.listOrganizations(),
          signetClient.activeOrganization().catch(() => null),
        ]);
        const list = listRes.Organizations ?? [];
        setOrgs(list);

        const nextId =
          (preferOrgId && list.some((o) => o.ID === preferOrgId) ? preferOrgId : null) ??
          (activeRes?.id && list.some((o) => o.ID === activeRes.id)
            ? activeRes.id
            : null) ??
          list[0]?.ID ??
          null;

        setSelectedOrgId(nextId);
        if (nextId) {
          await loadMembers(nextId);
        } else {
          setMembers([]);
        }
      } catch (error) {
        setOrgs([]);
        setSelectedOrgId(null);
        setMembers([]);
        setOrgError(describeSignetError(error).message);
      } finally {
        setLoadingOrgs(false);
      }
    },
    [loadMembers],
  );

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  async function selectOrg(org: Org) {
    setSelectedOrgId(org.ID);
    try {
      await signetClient.setActiveOrganization({ org_id: org.ID });
    } catch {
      // Non-fatal if active-org endpoint is gated; still load members for view.
    }
    await loadMembers(org.ID);
  }

  const selectedOrg = orgs.find((o) => o.ID === selectedOrgId) ?? null;

  return (
    <section className="flex flex-col gap-5 border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Organization</h2>
          {orgs.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  />
                }
              >
                <span>{selectedOrg?.Name ?? "Select organization"}</span>
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {orgs.map((org) => (
                  <DropdownMenuItem key={org.ID} onClick={() => void selectOrg(org)}>
                    {org.Name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-xs text-muted-foreground">Personal</span>
          )}
        </div>

        <NewOrganizationDialog
          ownerId={user.id}
          onCreated={(createdOrgId) => {
            void loadOrganizations(createdOrgId);
          }}
        />
      </div>

      {loadingOrgs ? (
        <div className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
          Loading organizations…
        </div>
      ) : !selectedOrg ? (
        <div className="border-t pt-4 text-xs text-muted-foreground">
          {orgError
            ? `Cannot list organizations: ${orgError}. Create a new organization or ensure your account has organization permissions.`
            : "No organization yet. Create a new organization to become its owner/admin and invite members."}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center bg-muted font-mono text-sm font-semibold">
              {selectedOrg.Name.slice(0, 1).toUpperCase()}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{selectedOrg.Name}</span>
              <span className="text-xs text-muted-foreground">
                {members.length} {members.length === 1 ? "member" : "members"} ·{" "}
                <span className="font-mono">{selectedOrg.ID}</span>
              </span>
            </div>
          </div>

          <div className="grid gap-6 border-t pt-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <span className="border-b pb-2 text-xs font-semibold">Members</span>
              {loadingMembers ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
                  Loading members…
                </div>
              ) : members.length === 0 ? (
                <p className="text-xs text-muted-foreground">No members found.</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {members.map((member) => {
                    const isSelf = member.UserID === user.id;
                    const display = isSelf ? user.name : member.UserID;
                    const badgeInitial = display.slice(0, 1).toUpperCase();
                    return (
                      <li key={member.UserID} className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted font-mono text-xs font-semibold">
                          {badgeInitial}
                        </span>
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-xs font-medium">
                            {display}
                            {isSelf ? " (you)" : ""}
                          </span>
                          <span className="text-[0.7rem] text-muted-foreground">{member.Role}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <span className="border-b pb-2 text-xs font-semibold">Invites</span>
              <p className="text-xs text-muted-foreground">
                Add an existing user to <span className="text-foreground">{selectedOrg.Name}</span>{" "}
                by their User ID.
              </p>
              <div className="mt-1 flex justify-end">
                <InviteMemberDialog
                  orgId={selectedOrg.ID}
                  orgName={selectedOrg.Name}
                  onInvited={() => {
                    void loadMembers(selectedOrg.ID);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
