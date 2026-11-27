"use client";

import { useState } from "react";

import { Button } from "@signet-auth-example/ui/components/button";
import { LoaderCircle, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { describeSignetError } from "@/lib/signet-client";
import { DemoInbox } from "./demo-inbox";

export function CheckInbox({
  email,
  title = "Check your inbox",
  description = "We sent you an email. Follow the link inside to continue.",
  resendLabel = "Resend email",
  onResend,
  onSelectToken,
  children,
}: {
  email: string;
  title?: string;
  description?: string;
  resendLabel?: string;
  onResend: () => Promise<unknown>;
  onSelectToken?: (token: string) => void;
  children?: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);

  async function resend() {
    setBusy(true);
    try {
      await onResend();
      toast.success("Email sent");
    } catch (error) {
      toast.error(describeSignetError(error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 border border-signal/30 bg-signal-soft p-4">
        <MailCheck className="size-5 text-signal" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <span className="font-display text-lg font-bold">{title}</span>
          <p className="text-sm/relaxed text-muted-foreground">
            {description} Sent to <span className="font-mono text-foreground">{email}</span>.
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={() => void resend()}
        className="w-full justify-between"
      >
        <span className="inline-flex items-center gap-2">
          {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
          {resendLabel}
        </span>
      </Button>
      <DemoInbox email={email} onSelectToken={onSelectToken} />
      {children}
    </div>
  );
}
