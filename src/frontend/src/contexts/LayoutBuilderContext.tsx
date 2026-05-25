/**
 * LayoutBuilderContext — React context wrapping the useLayoutBuilder hook.
 *
 * Follows the same pattern as ForgeAIChatContext.tsx:
 *   - LayoutBuilderProvider wraps a subtree
 *   - useLayoutBuilderContext throws if used outside the provider
 */

import {
  type UseLayoutBuilderResult,
  useLayoutBuilder,
} from "@/hooks/useLayoutBuilder";
import type React from "react";
import { createContext, useContext } from "react";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const LayoutBuilderContext = createContext<UseLayoutBuilderResult | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Wrap any subtree that needs access to layout builder state and methods.
 * Typically placed at the The Foundry module or dashboard builder root.
 */
export function LayoutBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useLayoutBuilder();
  return (
    <LayoutBuilderContext.Provider value={value}>
      {children}
    </LayoutBuilderContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

/**
 * Access layout builder state and methods from any component inside
 * a LayoutBuilderProvider.
 *
 * @throws if called outside of LayoutBuilderProvider
 */
export function useLayoutBuilderContext(): UseLayoutBuilderResult {
  const ctx = useContext(LayoutBuilderContext);
  if (!ctx) {
    throw new Error(
      "useLayoutBuilderContext must be used within a LayoutBuilderProvider",
    );
  }
  return ctx;
}
