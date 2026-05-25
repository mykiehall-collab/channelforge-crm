/**
 * useLayoutBuilder — primary data hook for the Account Layout Builder
 * and Dashboard Customization system.
 *
 * Follows the same actor pattern as useAIProviders.ts.
 * Falls back to mock data when the backend actor is unavailable.
 */

import type {
  AccountLayout,
  DashboardLayout,
  LayoutAuditEntry,
  LayoutPermissions,
  VisibilityRule__1,
} from "@/backend";
import {
  DEFAULT_ACCOUNT_LAYOUT,
  DEFAULT_DASHBOARD_TEMPLATES,
} from "@/data/layoutBuilderDefaults";
import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseLayoutBuilderResult {
  /** All account layouts saved in the backend */
  layouts: AccountLayout[];
  /** All dashboard layouts (templates + personal) */
  dashboardLayouts: DashboardLayout[];
  /** Dashboard templates only */
  templates: DashboardLayout[];
  /** Layout permissions for the current user */
  permissions: LayoutPermissions | null;
  /** Audit log entries */
  auditLog: LayoutAuditEntry[];
  loading: boolean;
  error: string | null;

  // Layout methods
  saveLayout: (layout: AccountLayout) => Promise<string | null>;
  deleteLayout: (layoutId: string) => Promise<boolean>;
  getLayoutForUser: (
    orgType: string,
    department: string,
    role: string,
  ) => Promise<AccountLayout | null>;

  // Dashboard methods
  saveDashboard: (layout: DashboardLayout) => Promise<string | null>;
  cloneDashboard: (layoutId: string, newName: string) => Promise<string | null>;

  // Permission methods
  updatePermissions: (
    userId: string,
    perms: LayoutPermissions,
  ) => Promise<boolean>;

  // Visibility rule methods
  saveVisibilityRule: (rule: VisibilityRule__1) => Promise<string | null>;
  getVisibilityRules: (layoutId: string) => Promise<VisibilityRule__1[]>;

  // Utility
  refresh: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLayoutBuilder(): UseLayoutBuilderResult {
  const { actor } = useActor();
  const [layouts, setLayouts] = useState<AccountLayout[]>([]);
  const [dashboardLayouts, setDashboardLayouts] = useState<DashboardLayout[]>(
    [],
  );
  const [templates, setTemplates] = useState<DashboardLayout[]>([]);
  const [permissions, setPermissions] = useState<LayoutPermissions | null>(
    null,
  );
  const [auditLog, setAuditLog] = useState<LayoutAuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Load all data on mount / actor availability
  // ---------------------------------------------------------------------------

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (actor) {
        const [layoutsResult, dashResult, templatesResult] = await Promise.all([
          actor.getAccountLayouts(),
          actor.getDashboardLayouts(),
          actor.getDashboardTemplates(),
        ]);
        setLayouts(
          layoutsResult.length ? layoutsResult : [DEFAULT_ACCOUNT_LAYOUT],
        );
        setDashboardLayouts(
          dashResult.length ? dashResult : DEFAULT_DASHBOARD_TEMPLATES,
        );
        setTemplates(
          templatesResult.length
            ? templatesResult
            : DEFAULT_DASHBOARD_TEMPLATES,
        );
      } else {
        // Mock fallback when backend unavailable
        setLayouts([DEFAULT_ACCOUNT_LAYOUT]);
        setDashboardLayouts(DEFAULT_DASHBOARD_TEMPLATES);
        setTemplates(DEFAULT_DASHBOARD_TEMPLATES);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load layout data",
      );
      // Fallback to defaults so UI never shows empty state on first load
      setLayouts([DEFAULT_ACCOUNT_LAYOUT]);
      setDashboardLayouts(DEFAULT_DASHBOARD_TEMPLATES);
      setTemplates(DEFAULT_DASHBOARD_TEMPLATES);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ---------------------------------------------------------------------------
  // Account layout methods
  // ---------------------------------------------------------------------------

  const saveLayout = useCallback(
    async (layout: AccountLayout): Promise<string | null> => {
      if (!actor) {
        // Optimistic mock update
        setLayouts((prev) => {
          const idx = prev.findIndex((l) => l.id === layout.id);
          return idx >= 0
            ? prev.map((l) => (l.id === layout.id ? layout : l))
            : [...prev, layout];
        });
        return layout.id;
      }
      try {
        const result = await actor.saveAccountLayout(layout);
        if (result.__kind__ === "ok") {
          await loadAll();
          return result.ok;
        }
        setError(result.err);
        return null;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save layout");
        return null;
      }
    },
    [actor, loadAll],
  );

  const deleteLayout = useCallback(
    async (layoutId: string): Promise<boolean> => {
      if (!actor) {
        setLayouts((prev) => prev.filter((l) => l.id !== layoutId));
        return true;
      }
      try {
        const result = await actor.deleteAccountLayout(layoutId);
        if (result.__kind__ === "ok") {
          setLayouts((prev) => prev.filter((l) => l.id !== layoutId));
          return true;
        }
        setError(result.err);
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete layout",
        );
        return false;
      }
    },
    [actor],
  );

  const getLayoutForUser = useCallback(
    async (
      orgType: string,
      department: string,
      role: string,
    ): Promise<AccountLayout | null> => {
      if (!actor) return DEFAULT_ACCOUNT_LAYOUT;
      try {
        return await actor.getLayoutForUser(orgType, department, role);
      } catch {
        return DEFAULT_ACCOUNT_LAYOUT;
      }
    },
    [actor],
  );

  // ---------------------------------------------------------------------------
  // Dashboard methods
  // ---------------------------------------------------------------------------

  const saveDashboard = useCallback(
    async (layout: DashboardLayout): Promise<string | null> => {
      if (!actor) {
        setDashboardLayouts((prev) => {
          const idx = prev.findIndex((d) => d.id === layout.id);
          return idx >= 0
            ? prev.map((d) => (d.id === layout.id ? layout : d))
            : [...prev, layout];
        });
        return layout.id;
      }
      try {
        const result = await actor.saveDashboardLayout(layout);
        if (result.__kind__ === "ok") {
          await loadAll();
          return result.ok;
        }
        setError(result.err);
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save dashboard",
        );
        return null;
      }
    },
    [actor, loadAll],
  );

  const cloneDashboard = useCallback(
    async (layoutId: string, newName: string): Promise<string | null> => {
      if (!actor) {
        const original = dashboardLayouts.find((d) => d.id === layoutId);
        if (!original) return null;
        const clone: DashboardLayout = {
          ...original,
          id: `clone-${Date.now()}`,
          name: newName,
          createdAt: BigInt(Date.now()),
          updatedAt: BigInt(Date.now()),
        };
        setDashboardLayouts((prev) => [...prev, clone]);
        return clone.id;
      }
      try {
        const result = await actor.cloneDashboardLayout(layoutId, newName);
        if (result.__kind__ === "ok") {
          await loadAll();
          return result.ok;
        }
        setError(result.err);
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to clone dashboard",
        );
        return null;
      }
    },
    [actor, dashboardLayouts, loadAll],
  );

  // ---------------------------------------------------------------------------
  // Permission methods
  // ---------------------------------------------------------------------------

  const updatePermissions = useCallback(
    async (userId: string, perms: LayoutPermissions): Promise<boolean> => {
      if (!actor) {
        setPermissions(perms);
        return true;
      }
      try {
        const result = await actor.updateLayoutPermissions(userId, perms);
        if (result.__kind__ === "ok") {
          setPermissions(perms);
          return true;
        }
        setError(result.err);
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update permissions",
        );
        return false;
      }
    },
    [actor],
  );

  // ---------------------------------------------------------------------------
  // Visibility rule methods
  // ---------------------------------------------------------------------------

  const saveVisibilityRule = useCallback(
    async (rule: VisibilityRule__1): Promise<string | null> => {
      if (!actor) return rule.id;
      try {
        const result = await actor.saveVisibilityRule(rule);
        if (result.__kind__ === "ok") return result.ok;
        setError(result.err);
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to save visibility rule",
        );
        return null;
      }
    },
    [actor],
  );

  const getVisibilityRules = useCallback(
    async (layoutId: string): Promise<VisibilityRule__1[]> => {
      if (!actor) return [];
      try {
        return await actor.getVisibilityRulesForLayout(layoutId);
      } catch {
        return [];
      }
    },
    [actor],
  );

  // ---------------------------------------------------------------------------
  // Audit log
  // ---------------------------------------------------------------------------

  const loadAuditLog = useCallback(async () => {
    if (!actor) return;
    try {
      const log = await actor.getLayoutAuditLog();
      setAuditLog(log);
    } catch {
      // Non-critical — silently ignore
    }
  }, [actor]);

  useEffect(() => {
    loadAuditLog();
  }, [loadAuditLog]);

  return {
    layouts,
    dashboardLayouts,
    templates,
    permissions,
    auditLog,
    loading,
    error,
    saveLayout,
    deleteLayout,
    getLayoutForUser,
    saveDashboard,
    cloneDashboard,
    updatePermissions,
    saveVisibilityRule,
    getVisibilityRules,
    refresh: loadAll,
  };
}
