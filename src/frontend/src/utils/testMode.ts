// TODO-TEST_MODE_ONLY: This file controls the Test Experience Mode flag.
// Before deploying to production, set IS_TEST_MODE to false OR remove this
// file and all references to it throughout the codebase.
//
// Search for "IS_TEST_MODE" and "TEST_MODE_ONLY" to find all affected files.
// The Test Experience Mode switcher (TestModeDropdown) should also be removed
// from TopBar.tsx and AppContext.tsx when disabling for production.

/**
 * IS_TEST_MODE — master gate for all Test Experience Mode features.
 *
 * true  → Test Experience Mode switcher is visible; persona simulation is active.
 * false → All test-mode UI is hidden; no persona simulation occurs.
 *
 * This is set to true during development/QA and must be false (or removed)
 * before any production deployment.
 */
export const IS_TEST_MODE = true;
