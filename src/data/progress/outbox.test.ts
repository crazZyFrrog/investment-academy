import { describe, expect, it } from "vitest";
import { canSyncProgress } from "@/data/progress/outbox";

describe("canSyncProgress", () => {
  it("rejects empty and SSR guest ids", () => {
    expect(canSyncProgress("")).toBe(false);
    expect(canSyncProgress("guest-ssr")).toBe(false);
    expect(canSyncProgress("guest-abc")).toBe(false);
  });

  it("allows authenticated user ids only when auth is enabled", () => {
    // AUTH_ENABLED is compile-time from NEXT_PUBLIC_AUTH_ENABLED.
    // In default CI/guest builds the gate stays closed for everyone.
    const result = canSyncProgress("11111111-1111-1111-1111-111111111111");
    expect(typeof result).toBe("boolean");
    if (process.env.NEXT_PUBLIC_AUTH_ENABLED === "true") {
      expect(result).toBe(true);
    } else {
      expect(result).toBe(false);
    }
  });
});
