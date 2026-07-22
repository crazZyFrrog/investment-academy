/**
 * Active identity hook.
 * Guest mode is default while AUTH_ENABLED is false (pre–Version 1.0).
 * Switch the export to `./use-user-id.session` when re-enabling auth.
 */
export { useUserId, getGuestId } from "./use-user-id.guest";
