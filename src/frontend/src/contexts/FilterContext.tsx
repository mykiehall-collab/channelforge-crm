import { useApp } from "@/AppContext";
import type { OperationalRole } from "@/utils/roleIntelligenceEngine";
import { useLocation } from "@tanstack/react-router";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GlobalFilters {
  vendor: string | null;
  distributor: string | null;
  resellerGroup: string | null;
  product: string | null;
  productFamily: string | null;
  territory: string | null;
  region: string | null;
  countryTier: string | null;
  customerSegment: string | null;
  industry: string | null;
  opportunityStage: string | null;
  renewalStatus: string | null;
}

export const FILTER_DIMENSIONS: (keyof GlobalFilters)[] = [
  "vendor",
  "distributor",
  "resellerGroup",
  "product",
  "productFamily",
  "territory",
  "region",
  "countryTier",
  "customerSegment",
  "industry",
  "opportunityStage",
  "renewalStatus",
];

export enum FILTER_FAMILIES {
  DASHBOARD = "dashboard",
  TRANSACTIONAL = "transactional",
}

export interface SavedView {
  id: string;
  name: string;
  filters: GlobalFilters;
  family: FILTER_FAMILIES;
  isPinned: boolean;
  createdAt: number;
}

interface FilterContextValue {
  filters: GlobalFilters;
  activeFamily: FILTER_FAMILIES | null;
  activeFilterCount: number;
  savedViews: SavedView[];
  pinnedViews: SavedView[];
  setFilter: (key: keyof GlobalFilters, value: string | null) => void;
  clearFilters: (family?: FILTER_FAMILIES) => void;
  clearAllFilters: () => void;
  saveCurrentView: (name: string) => void;
  deleteView: (id: string) => void;
  pinView: (id: string) => void;
  unpinView: (id: string) => void;
  applyView: (view: SavedView) => void;
  primaryFilters: (keyof GlobalFilters)[];
  roleDefaults: Partial<GlobalFilters>;
}

// ─── Default empty filters ───────────────────────────────────────────────────

export const EMPTY_FILTERS: GlobalFilters = {
  vendor: null,
  distributor: null,
  resellerGroup: null,
  product: null,
  productFamily: null,
  territory: null,
  region: null,
  countryTier: null,
  customerSegment: null,
  industry: null,
  opportunityStage: null,
  renewalStatus: null,
};

// ─── Storage keys ────────────────────────────────────────────────────────────

const STORAGE_KEY_DASHBOARD = "channelforge_dashboard_filters";
const STORAGE_KEY_TRANSACTIONAL = "channelforge_transactional_filters";
const STORAGE_KEY_SAVED_VIEWS = "channelforge_saved_views";

// ─── Route-to-family mapping ─────────────────────────────────────────────────

const DASHBOARD_ROUTES = new Set([
  "/",
  "/dashboard",
  "/reports",
  "/reports/qtd",
  "/targets",
  "/executive-performance",
  "/ecosystem-performance",
  "/kpi-dashboards",
  "/forecast",
  "/yoy-growth",
  "/forge-ai",
  "/linked-workspaces",
  "/team-performance",
  "/channel-performance",
]);

const TRANSACTIONAL_ROUTES = new Set([
  "/opportunities",
  "/renewals",
  "/tasks",
  "/quotes",
  "/deal-registrations",
  "/cases",
  "/mdf-requests",
  "/marketing-activities",
]);

export function getFilterFamilyForRoute(
  pathname: string,
): "dashboard" | "transactional" | "none" {
  const base = pathname.split("?")[0] ?? pathname;
  if (DASHBOARD_ROUTES.has(base)) return "dashboard";
  if (TRANSACTIONAL_ROUTES.has(base)) return "transactional";
  return "none";
}

// ─── Role-aware filter defaults ──────────────────────────────────────────────

export interface RoleFilterConfig {
  primaryFilters: (keyof GlobalFilters)[];
  defaultValues: Partial<GlobalFilters>;
}

export const ROLE_FILTER_DEFAULTS: Record<OperationalRole, RoleFilterConfig> = {
  salesRep: {
    primaryFilters: [
      "opportunityStage",
      "customerSegment",
      "product",
      "renewalStatus",
      "region",
    ],
    defaultValues: {},
  },
  accountManager: {
    primaryFilters: [
      "vendor",
      "distributor",
      "resellerGroup",
      "region",
      "productFamily",
    ],
    defaultValues: {},
  },
  renewalSpecialist: {
    primaryFilters: [
      "renewalStatus",
      "customerSegment",
      "region",
      "productFamily",
    ],
    defaultValues: { renewalStatus: "due_this_quarter" },
  },
  bdr: {
    primaryFilters: ["customerSegment", "industry", "region", "productFamily"],
    defaultValues: {},
  },
  salesManager: {
    primaryFilters: [
      "territory",
      "region",
      "vendor",
      "productFamily",
      "opportunityStage",
    ],
    defaultValues: {},
  },
  regionalDirector: {
    primaryFilters: ["region", "territory", "productFamily", "vendor"],
    defaultValues: {},
  },
  salesOps: {
    primaryFilters: ["product", "territory", "opportunityStage", "countryTier"],
    defaultValues: {},
  },
  dealDesk: {
    primaryFilters: ["opportunityStage", "vendor", "productFamily", "region"],
    defaultValues: {},
  },
  marketing: {
    primaryFilters: ["vendor", "productFamily", "region", "customerSegment"],
    defaultValues: {},
  },
  partnerMarketing: {
    primaryFilters: ["vendor", "productFamily", "region", "customerSegment"],
    defaultValues: {},
  },
  customerSuccess: {
    primaryFilters: [
      "customerSegment",
      "region",
      "renewalStatus",
      "productFamily",
    ],
    defaultValues: {},
  },
  itOperations: {
    primaryFilters: ["region", "territory", "countryTier"],
    defaultValues: {},
  },
  securityAdmin: {
    primaryFilters: ["region", "territory", "countryTier"],
    defaultValues: {},
  },
  finance: {
    primaryFilters: ["region", "vendor", "productFamily", "customerSegment"],
    defaultValues: {},
  },
  leadership: {
    primaryFilters: ["region", "territory", "productFamily", "vendor"],
    defaultValues: {},
  },
  channelAccountManager: {
    primaryFilters: [
      "vendor",
      "distributor",
      "resellerGroup",
      "region",
      "productFamily",
    ],
    defaultValues: {},
  },
  channelSalesManager: {
    primaryFilters: ["region", "territory", "vendor", "productFamily"],
    defaultValues: {},
  },
  channelDirector: {
    primaryFilters: ["region", "territory", "productFamily", "vendor"],
    defaultValues: {},
  },
};

// ─── Context ─────────────────────────────────────────────────────────────────

const FilterContext = createContext<FilterContextValue | null>(null);

function readSessionFilters(key: string): GlobalFilters | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GlobalFilters>;
    return { ...EMPTY_FILTERS, ...parsed };
  } catch {
    return null;
  }
}

function writeSessionFilters(key: string, filters: GlobalFilters) {
  try {
    sessionStorage.setItem(key, JSON.stringify(filters));
  } catch {
    // ignore storage errors
  }
}

function readSavedViews(): SavedView[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_SAVED_VIEWS);
    if (!raw) return [];
    return JSON.parse(raw) as SavedView[];
  } catch {
    return [];
  }
}

function writeSavedViews(views: SavedView[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY_SAVED_VIEWS, JSON.stringify(views));
  } catch {
    // ignore storage errors
  }
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const { operationalRole } = useApp();
  const location = useLocation();

  // Track previous family to avoid clearing filters on cross-family navigation
  const prevFamilyRef = useRef<FILTER_FAMILIES | null>(null);
  // Track if role defaults have been applied to avoid re-applying on every render
  const roleDefaultsAppliedRef = useRef<string | null>(null);

  const [dashboardFilters, setDashboardFilters] = useState<GlobalFilters>(
    () => {
      const stored = readSessionFilters(STORAGE_KEY_DASHBOARD);
      return stored ?? EMPTY_FILTERS;
    },
  );

  const [transactionalFilters, setTransactionalFilters] =
    useState<GlobalFilters>(() => {
      const stored = readSessionFilters(STORAGE_KEY_TRANSACTIONAL);
      return stored ?? EMPTY_FILTERS;
    });

  const [savedViews, setSavedViews] = useState<SavedView[]>(() =>
    readSavedViews(),
  );

  // Determine active family from current route
  const activeFamily = useMemo<FILTER_FAMILIES | null>(() => {
    const family = getFilterFamilyForRoute(location.pathname);
    if (family === "dashboard") return FILTER_FAMILIES.DASHBOARD;
    if (family === "transactional") return FILTER_FAMILIES.TRANSACTIONAL;
    return null;
  }, [location.pathname]);

  // Sync prevFamilyRef — this never triggers re-renders
  useEffect(() => {
    if (activeFamily !== null) {
      prevFamilyRef.current = activeFamily;
    }
  }, [activeFamily]);

  // Apply role-aware defaults to dashboard filters on first mount per role
  // Only runs when the role changes and only if session storage was empty
  const roleConfig = useMemo<RoleFilterConfig>(() => {
    if (!operationalRole) {
      return {
        primaryFilters: ["vendor", "region", "productFamily"],
        defaultValues: {},
      };
    }
    return (
      ROLE_FILTER_DEFAULTS[operationalRole] ?? {
        primaryFilters: ["vendor", "region", "productFamily"],
        defaultValues: {},
      }
    );
  }, [operationalRole]);

  useEffect(() => {
    const roleKey = operationalRole ?? "__default__";
    if (roleDefaultsAppliedRef.current === roleKey) return;
    roleDefaultsAppliedRef.current = roleKey;

    const defaults = roleConfig.defaultValues;
    if (!defaults || Object.keys(defaults).length === 0) return;

    // Only apply defaults if no session filters are already set
    const hasExistingDashboardFilters = Object.values(dashboardFilters).some(
      (v) => v !== null && v !== "",
    );
    if (hasExistingDashboardFilters) return;

    setDashboardFilters((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(defaults).filter(([, v]) => v != null),
      ),
    }));
  }, [operationalRole, roleConfig, dashboardFilters]);

  // Current visible filters based on active family
  const filters = useMemo<GlobalFilters>(() => {
    if (activeFamily === FILTER_FAMILIES.DASHBOARD) return dashboardFilters;
    if (activeFamily === FILTER_FAMILIES.TRANSACTIONAL)
      return transactionalFilters;
    // Fallback: show dashboard filters for routes with no family mapping
    return dashboardFilters;
  }, [activeFamily, dashboardFilters, transactionalFilters]);

  const activeFilterCount = useMemo(() => {
    return FILTER_DIMENSIONS.filter(
      (k) => filters[k] !== null && filters[k] !== "",
    ).length;
  }, [filters]);

  // Persist filters to sessionStorage whenever they change — no extra re-renders
  useEffect(() => {
    writeSessionFilters(STORAGE_KEY_DASHBOARD, dashboardFilters);
  }, [dashboardFilters]);

  useEffect(() => {
    writeSessionFilters(STORAGE_KEY_TRANSACTIONAL, transactionalFilters);
  }, [transactionalFilters]);

  // Persist saved views
  useEffect(() => {
    writeSavedViews(savedViews);
  }, [savedViews]);

  const setFilter = useCallback(
    (key: keyof GlobalFilters, value: string | null) => {
      const clean = value && value.trim().length > 0 ? value.trim() : null;
      if (activeFamily === FILTER_FAMILIES.DASHBOARD) {
        setDashboardFilters((prev) => ({ ...prev, [key]: clean }));
      } else if (activeFamily === FILTER_FAMILIES.TRANSACTIONAL) {
        setTransactionalFilters((prev) => ({ ...prev, [key]: clean }));
      }
    },
    [activeFamily],
  );

  const clearFilters = useCallback(
    (family?: FILTER_FAMILIES) => {
      const target = family ?? activeFamily;
      if (target === FILTER_FAMILIES.DASHBOARD) {
        setDashboardFilters(EMPTY_FILTERS);
      } else if (target === FILTER_FAMILIES.TRANSACTIONAL) {
        setTransactionalFilters(EMPTY_FILTERS);
      }
    },
    [activeFamily],
  );

  const clearAllFilters = useCallback(() => {
    setDashboardFilters(EMPTY_FILTERS);
    setTransactionalFilters(EMPTY_FILTERS);
  }, []);

  const saveCurrentView = useCallback(
    (name: string) => {
      if (!activeFamily) return;
      const newView: SavedView = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim(),
        filters: { ...filters },
        family: activeFamily,
        isPinned: false,
        createdAt: Date.now(),
      };
      setSavedViews((prev) => [newView, ...prev].slice(0, 50));
    },
    [activeFamily, filters],
  );

  const deleteView = useCallback((id: string) => {
    setSavedViews((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const pinView = useCallback((id: string) => {
    setSavedViews((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isPinned: true } : v)),
    );
  }, []);

  const unpinView = useCallback((id: string) => {
    setSavedViews((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isPinned: false } : v)),
    );
  }, []);

  const applyView = useCallback((view: SavedView) => {
    if (view.family === FILTER_FAMILIES.DASHBOARD) {
      setDashboardFilters({ ...view.filters });
    } else if (view.family === FILTER_FAMILIES.TRANSACTIONAL) {
      setTransactionalFilters({ ...view.filters });
    }
  }, []);

  const pinnedViews = useMemo(
    () => savedViews.filter((v) => v.isPinned),
    [savedViews],
  );

  const value = useMemo<FilterContextValue>(
    () => ({
      filters,
      activeFamily,
      activeFilterCount,
      savedViews,
      pinnedViews,
      setFilter,
      clearFilters,
      clearAllFilters,
      saveCurrentView,
      deleteView,
      pinView,
      unpinView,
      applyView,
      primaryFilters: roleConfig.primaryFilters,
      roleDefaults: roleConfig.defaultValues,
    }),
    [
      filters,
      activeFamily,
      activeFilterCount,
      savedViews,
      pinnedViews,
      setFilter,
      clearFilters,
      clearAllFilters,
      saveCurrentView,
      deleteView,
      pinView,
      unpinView,
      applyView,
      roleConfig,
    ],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilterContext(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx)
    throw new Error("useFilterContext must be used inside FilterProvider");
  return ctx;
}
