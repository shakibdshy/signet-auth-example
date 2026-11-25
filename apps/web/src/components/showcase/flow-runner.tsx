"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@signet-auth-example/ui/components/alert-dialog";
import { Button } from "@signet-auth-example/ui/components/button";
import { Input } from "@signet-auth-example/ui/components/input";
import { Label } from "@signet-auth-example/ui/components/label";
import { LoaderCircle, Play } from "lucide-react";
import { toast } from "sonner";

import type { Capability } from "@/lib/catalog";
import { snippetFor } from "@/lib/catalog";
import {
  DESTRUCTIVE_METHODS,
  fieldsFor,
  POSITIONAL_METHODS,
  TOKEN_METHODS,
} from "@/lib/field-specs";
import { describeSignetError, signetClient } from "@/lib/signet-client";
import { DevInbox } from "./dev-inbox";
import { CodeSnippet, DocsLink, EndpointChip, StatusBadge } from "./primitives";

type ClientMethod = (...args: unknown[]) => Promise<unknown>;

export function FlowRunner({ capability }: { capability: Capability }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  const fields = fieldsFor(capability.clientMethod);
  const destructive = DESTRUCTIVE_METHODS.has(capability.clientMethod ?? "");

  async function run() {
    setBusy(true);
    setResult(null);
    try {
      const method = (signetClient as unknown as Record<string, ClientMethod>)[
        capability.clientMethod!
      ];
      if (!method) throw new Error("No typed client method for this capability");

      const body = Object.fromEntries(
        Object.entries(values)
          .filter(([, value]) => value !== "")
          .map(([key, value]) => {
            const field = fields.find((item) => item.name === key);
            if (field?.kind === "number") return [key, Number(value)];
            if (field?.kind === "array") return [key, value.split(",").map((item) => item.trim())];
            return [key, value];
          }),
      );
      let response: unknown;
      if (POSITIONAL_METHODS.has(capability.clientMethod!)) {
        response = await method(body[fields[0]?.name ?? ""] ?? "");
      } else if (fields.length > 0) {
        response = await method(body);
      } else {
        response = await method();
      }

      setResult(response ?? { status: "204 — no content" });
      toast.success(`${capability.name} completed`);
    } catch (error) {
      const described = describeSignetError(error);
      setResult({ error: described.code ?? "error", message: described.message });
      toast.error(described.message);
    } finally {
      setBusy(false);
    }
  }

  const runButton = (
    <Button onClick={() => void run()} disabled={busy} className="w-full justify-between">
      {busy ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : <Play data-icon="inline-start" />}
      {busy ? "Calling…" : "Run flow"}
    </Button>
  );

  return (
    <article className="flex flex-col gap-4 border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-base font-semibold">{capability.name}</h3>
          <p className="max-w-xl text-xs/relaxed text-muted-foreground">{capability.summary}</p>
        </div>
        <StatusBadge status={capability.status} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <EndpointChip method={capability.method} path={capability.endpoint} />
        <DocsLink href={capability.docs} />
      </div>

      {capability.reason ? (
        <p className="border-l-2 border-signal pl-3 text-xs/relaxed text-muted-foreground">
          {capability.reason}
        </p>
      ) : null}

      {fields.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((field) => {
            const usesDevInbox =
              TOKEN_METHODS.has(capability.clientMethod ?? "") &&
              (field.name === "token" || field.name === "code");
            if (usesDevInbox) {
              return (
                <DevInbox
                  key={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(value) =>
                    setValues((current) => ({ ...current, [field.name]: value }))
                  }
                />
              );
            }
            return (
              <div key={field.name} className="flex flex-col gap-1.5">
                <Label
                  htmlFor={`${capability.id}-${field.name}`}
                  className="mono-label text-muted-foreground"
                >
                  {field.label}
                </Label>
                <Input
                  id={`${capability.id}-${field.name}`}
                  type={field.type ?? "text"}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [field.name]: event.target.value }))
                  }
                />
              </div>
            );
          })}
        </div>
      ) : null}

      {destructive ? (
        <AlertDialog>
          <AlertDialogTrigger render={<Button disabled={busy} className="w-full justify-between" />}>
            <Play data-icon="inline-start" />
            Run guarded flow
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>This call changes shared state</AlertDialogTitle>
              <AlertDialogDescription>
                {capability.name} mutates the deployed backend. Create your own throwaway account
                through sign-up before running it — never use the shared Demo account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => void run()}>Run anyway</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        runButton
      )}

      {result !== null ? (
        <pre className="max-h-64 overflow-auto border bg-muted/30 p-3 font-mono text-[0.7rem] leading-relaxed text-foreground/80">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}

      <CodeSnippet snippet={snippetFor(capability)} />
    </article>
  );
}
