"use client";

import { useId } from "react";

import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { Inbox } from "lucide-react";

export function DevInbox({
  value,
  onChange,
  label = "Token from server logs",
  placeholder = "Paste the token or full link",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2 border border-dashed bg-muted/30 p-3">
      <div className="flex items-center gap-2">
        <Inbox className="size-3.5 text-signal" />
        <Label htmlFor={id} className="mono-label text-signal">
          Dev inbox
        </Label>
      </div>
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="font-mono text-xs"
      />
      <p className="text-xs/relaxed text-muted-foreground">
        This deployment mails tokens to the server log. If you cannot read those logs, this flow
        is <span className="text-foreground">NEEDS SERVER CONFIG</span> for you — the request is
        still real.
      </p>
    </div>
  );
}
