import { createSignetClient } from "@shakibdshy/signet-auth-client";

/**
 * The browser never calls Render directly: it calls the same-origin proxy,
 * which forwards to the deployed Signet backend and relays cookies.
 */
export const signetClient = createSignetClient({ baseURL: "/api/signet" });

export type SignetError = { code?: string; message: string };

export function describeSignetError(error: unknown): SignetError {
  if (error instanceof Error && "code" in error && "status" in error) {
    return { code: String((error as { code: unknown }).code), message: error.message };
  }
  return { message: error instanceof Error ? error.message : "Something went wrong" };
}
