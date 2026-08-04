"use client";

import { AUTH_ENABLED } from "@/data/auth/flags";
import {
  useUserId as useGuestUserId,
  getGuestId,
  clearGuestId,
} from "./use-user-id.guest";
import { useUserId as useSessionUserId } from "./use-user-id.session";

export { getGuestId, clearGuestId };

/**
 * Session-aware when NEXT_PUBLIC_AUTH_ENABLED=true; guest otherwise.
 * Branch is fixed per build so hook order stays stable.
 */
export const useUserId: () => string = AUTH_ENABLED
  ? useSessionUserId
  : useGuestUserId;
