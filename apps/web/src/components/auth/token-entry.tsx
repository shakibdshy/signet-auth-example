"use client";

import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";

/**
 * Fallback for the rare case the emailed link cannot be clicked in the same
 * browser: paste the token from the email and complete the flow here.
 */
export function TokenEntry({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <details className="group border bg-muted/20">
      <summary className="mono-label flex cursor-pointer list-none items-center justify-between px-4 py-3 text-muted-foreground transition-colors group-open:text-foreground">
        <span>Enter token manually</span>
        <span className="inline-block transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="flex flex-col gap-2 border-t p-4">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value.trim())}
          placeholder={placeholder}
          spellCheck={false}
          className="font-mono text-xs"
        />
      </div>
    </details>
  );
}
