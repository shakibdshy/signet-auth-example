"use client";

import { useState } from "react";

import { Button } from "@signet-auth-example/ui/components/button";
import { LoaderCircle, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { describeSignetError } from "@/lib/signet-client";

export function CheckInbox({
  email,
  title = "Check your inbox",
  description = "We sent you an email. Follow the link inside to continue.",
  resendLabel = "Resend email",
  onResend,
  children,
}: {
  email: string;
  title?: string;
  description?: string;
  resendLabel?: string;
  onResend: () => Promise<unknown>;
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 border bg-signal-soft/40 p-5">
        <MailCheck className="size-6 text-signal" />
        <div className="flex flex-col gap-1">
          <span className="font-display text-lg font-semibold">{title}</span>
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
        className="justify-between"
      >
        {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : null}
        {resendLabel}
      </Button>
      {children}
    </div>
  );
}
