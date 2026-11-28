"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@signet-auth-example/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@signet-auth-example/ui/components/dialog";
import { Check, Clipboard, Inbox, LoaderCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type DemoMessage = {
  id?: string;
  to?: string;
  subject?: string;
  body?: string;
  url?: string;
  token?: string;
  code?: string;
  created_at?: string;
};

export function DemoInbox({
  email,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSelectToken,
  onSelectCode,
}: {
  email: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectToken?: (token: string) => void;
  onSelectCode?: (code: string) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/signet/demo/inbox?email=${encodeURIComponent(email)}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        throw new Error(`Inbox unavailable (${response.status})`);
      }
      const data = (await response.json()) as { messages?: DemoMessage[] };
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load demo inbox");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (open) {
      void load();
    }
  }, [open, load]);

  function copyValue(key: string, value: string, label: string) {
    void navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedKey(key);
        toast.success(`${label} copied`);
        setTimeout(() => setCopiedKey(null), 1500);
      })
      .catch(() => {
        toast.error(`Could not copy ${label.toLowerCase()}`);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" className="w-full justify-between" />}>
        <span className="inline-flex items-center gap-2">
          <Inbox className="size-3.5" aria-hidden="true" />
          Open Demo Inbox
        </span>
        <span className="font-mono text-[0.65rem] text-muted-foreground">{email}</span>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Demo Inbox</DialogTitle>
          <DialogDescription>
            This is a demo inbox for testing — no real emails are sent. Copy or use your
            verification token below.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-2 border bg-muted/30 px-3 py-2">
          <span className="truncate font-mono text-xs text-foreground">{email}</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={loading}
            onClick={() => void load()}
          >
            {loading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <RefreshCw aria-hidden="true" />}
            Refresh
          </Button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading && messages.length === 0 ? (
            <div className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Checking demo inbox…
            </div>
          ) : messages.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No demo emails for <span className="font-mono text-foreground">{email}</span> yet.
              Click Refresh in a moment.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {messages.map((msg, idx) => {
                const key = msg.id ?? String(idx);
                return (
                  <li key={key} className="flex flex-col gap-2.5 border bg-card p-3.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-foreground">
                        {msg.subject || "Signet Auth Email"}
                      </span>
                      {msg.created_at ? (
                        <span className="shrink-0 font-mono text-[0.65rem] text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      ) : null}
                    </div>

                    {msg.body ? (
                      <p className="text-[0.72rem]/relaxed text-muted-foreground">{msg.body}</p>
                    ) : null}

                    {msg.token ? (
                      <div className="flex flex-col gap-2 border bg-muted/40 p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="mono-label text-[0.65rem] text-muted-foreground">
                            Token
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              onClick={() => copyValue(`${key}-tok`, msg.token!, "Token")}
                            >
                              {copiedKey === `${key}-tok` ? <Check /> : <Clipboard />}
                              Copy
                            </Button>
                            {onSelectToken ? (
                              <Button
                                type="button"
                                size="xs"
                                onClick={() => {
                                  onSelectToken(msg.token!);
                                  setOpen(false);
                                }}
                              >
                                Use token
                              </Button>
                            ) : null}
                          </div>
                        </div>
                        <code className="block break-all font-mono text-[0.7rem] text-foreground">
                          {msg.token}
                        </code>
                      </div>
                    ) : null}

                    {msg.code ? (
                      <div className="flex items-center justify-between gap-2 border bg-muted/40 p-2.5">
                        <div className="flex items-center gap-2">
                          <span className="mono-label text-[0.65rem] text-muted-foreground">
                            Code
                          </span>
                          <code className="font-mono text-sm font-semibold text-foreground">
                            {msg.code}
                          </code>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() => copyValue(`${key}-code`, msg.code!, "Code")}
                          >
                            {copiedKey === `${key}-code` ? <Check /> : <Clipboard />}
                            Copy
                          </Button>
                          {onSelectCode ? (
                            <Button
                              type="button"
                              size="xs"
                              onClick={() => {
                                onSelectCode(msg.code!);
                                setOpen(false);
                              }}
                            >
                              Use code
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
