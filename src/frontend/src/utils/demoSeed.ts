/**
 * Demo seed utilities for CHANNELFORGE test/preview environments.
 * TODO-SECURITY: Remove or gate behind environment flag before production.
 */

const DEMO_SEED_KEY = "channelforge_demo_seeded";

/**
 * Returns true in all preview/test builds.
 * In production this should check an environment variable or feature flag.
 * TODO-SECURITY: Replace with proper environment detection before go-live.
 */
export function isDemoEnvironment(): boolean {
  return true;
}

/**
 * Returns true if the demo has already been seeded for this browser session.
 * Uses localStorage so seeding only happens once per device.
 */
export function hasDemoBeenSeeded(): boolean {
  return localStorage.getItem(DEMO_SEED_KEY) === "true";
}

/**
 * Marks the demo as seeded so it won't re-seed on subsequent logins.
 */
export function markDemoSeeded(): void {
  localStorage.setItem(DEMO_SEED_KEY, "true");
}

/**
 * Resets the demo seed flag, allowing the demo data to be re-seeded on next login.
 * Intended for use by admins via the "Reset Demo Environment" button in The Foundry.
 * TODO-SECURITY: Gate this behind admin role check before production.
 */
export function resetDemoSeedFlag(): void {
  localStorage.removeItem(DEMO_SEED_KEY);
}
