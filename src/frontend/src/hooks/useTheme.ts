import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

const PRE_LOGIN_PATHS = [
  "/landing",
  "/vendor-login",
  "/distributor-login",
  "/reseller-login",
  "/workspace-setup",
  "/forgot-password",
  "/reset-password",
  "/mfa-challenge",
  "/onboarding",
  "/distributor-setup",
  "/reseller-setup",
];

function isPreLoginPath(hash: string): boolean {
  // TanStack Router uses hash-based routing: /#/path
  const path = hash.replace(/^#/, "").split("?")[0];
  return PRE_LOGIN_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

export interface UseChannelForgeTheme {
  /** Always 'dark' on pre-login routes; user preference on authenticated routes */
  effectiveTheme: "dark" | "light";
  /** The user's actual stored preference from next-themes */
  storedTheme: string | undefined;
  /** Set the user's theme preference (only has visible effect on authenticated routes) */
  setTheme: (theme: string) => void;
}

export function useTheme(): UseChannelForgeTheme {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const onPreLoginRoute = isPreLoginPath(hash);
  const effectiveTheme: "dark" | "light" = onPreLoginRoute
    ? "dark"
    : ((resolvedTheme as "dark" | "light") ?? "dark");

  return {
    effectiveTheme,
    storedTheme: theme,
    setTheme,
  };
}
