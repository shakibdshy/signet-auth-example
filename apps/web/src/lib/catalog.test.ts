import { expect, test } from "bun:test";

import { ALL_CAPABILITIES, FEATURE_AREAS, snippetFor } from "./catalog";
import { signetClient } from "./signet-client";

test("every shipped capability is represented exactly once", () => {
  const ids = ALL_CAPABILITIES.map((capability) => capability.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(FEATURE_AREAS.length).toBe(13);
  expect(ALL_CAPABILITIES.length).toBeGreaterThanOrEqual(60);
});

test("every capability has a valid status, docs link and call classification", () => {
  for (const capability of ALL_CAPABILITIES) {
    expect(["live", "gated", "unconfigured", "card"]).toContain(capability.status);
    expect(capability.docs).toMatch(/^https:\/\/go-signet-auth\.vercel\.app\/docs\//);
    if (capability.status === "card") {
      expect(capability.endpoint).toBeUndefined();
    } else {
      expect(capability.endpoint).toMatch(/^\/auth\//);
      expect(capability.method).toBeDefined();
      expect(capability.clientMethod).toBeDefined();
    }
  }
});

test("every callable capability names a real typed client method", () => {
  const methods = new Set(Object.keys(signetClient));
  for (const capability of ALL_CAPABILITIES) {
    if (capability.status === "card") continue;
    expect(methods.has(capability.clientMethod!)).toBe(true);
  }
});

test("every callable flow offers a copyable snippet", () => {
  for (const capability of ALL_CAPABILITIES) {
    if (capability.status === "card") continue;
    expect(snippetFor(capability)).toContain("signetClient.");
  }
});

test("Go-only methods are documented as cards", () => {
  const ids = ALL_CAPABILITIES.filter((capability) => capability.status === "card").map(
    (capability) => capability.id,
  );
  expect(ids).toContain("audit");
  expect(ids).toContain("set-password");
  expect(ids).toContain("verify-password");
  expect(ids).toContain("update-user");
});

test("username sign-in is represented", () => {
  expect(ALL_CAPABILITIES.some((capability) => capability.id === "sign-in-username")).toBe(true);
});

test("gated and unconfigured capabilities explain themselves", () => {
  for (const capability of ALL_CAPABILITIES) {
    if (capability.status === "gated" || capability.status === "unconfigured") {
      expect(capability.reason).toBeTruthy();
    }
  }
});
