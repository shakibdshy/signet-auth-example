"use client";

import { Button } from "@signet-auth-example/ui/components/button";
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
    <details className="group border">
      <summary className="mono-label cursor-pointer list-none px-4 py-3 text-muted-foreground transition-colors group-open:text-foreground">
        Clicking the link didn&apos;t work? Enter the token manually
        <span className="ml-2 inline-block transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="flex flex-col gap-3 border-t p-4">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value.trim())}
          placeholder={placeholder}
          className="font-mono text-xs"
        />
      </div>
    </details>
  );
}
