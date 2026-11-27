"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@signet-auth-example/ui/components/button";
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
  onSelectToken,
  onSelectCode,
}: {
  email: string;
  onSelectToken?: (token: string) => void;
  onSelectCode?: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
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
    void navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      toast.success(`${label} copied`);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }

  return (
    <div className="border bg-muted/25">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 text-xs font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          <Inbox className="size-3.5" aria-hidden="true" />
          <span>{open ? "Hide Demo Inbox" : "Open Demo Inbox"}</span>
        </button>
        {open ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Refresh demo inbox"
            disabled={loading}
            onClick={() => void load()}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <RefreshCw />
            )}
          </Button>
        ) : null}
      </div>

      {open ? (
        <div className="border-t p-3.5">
          {loading && messages.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
              Checking demo inbox…
            </div>
          ) : messages.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No demo emails for <span className="font-mono text-foreground">{email}</span> yet.
              Click refresh in a moment.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {messages.map((msg, idx) => {
                const key = msg.id ?? String(idx);
                return (
                  <li key={key} className="flex flex-col gap-2 border bg-card p-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-foreground">
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
                      <p className="line-clamp-3 text-[0.72rem]/relaxed text-muted-foreground">
                        {msg.body}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {msg.code ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() => copyValue(`${key}-code`, msg.code!, "Code")}
                          >
                            {copiedKey === `${key}-code` ? <Check /> : <Clipboard />}
                            Code: <span className="font-mono">{msg.code}</span>
                          </Button>
                          {onSelectCode ? (
                            <Button
                              type="button"
                              size="xs"
                              onClick={() => onSelectCode(msg.code!)}
                            >
                              Use code
                            </Button>
                          ) : null}
                        </>
                      ) : null}

                      {msg.token ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() => copyValue(`${key}-tok`, msg.token!, "Token")}
                          >
                            {copiedKey === `${key}-tok` ? <Check /> : <Clipboard />}
                            Copy token
                          </Button>
                          {onSelectToken ? (
                            <Button
                              type="button"
                              size="xs"
                              onClick={() => onSelectToken(msg.token!)}
                            >
                              Use token
                            </Button>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
