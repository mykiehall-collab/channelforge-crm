import { useCallback, useEffect, useState } from "react";
import type {
  CurrentQuarterResult,
  FiscalYearConfig,
  FiscalYearType,
  PartnerQTDRanking,
  QTDFilters,
  QTDMetrics,
  QuarterDef,
  TargetAssignment,
  TargetMeasureConfig,
  TargetMeasureId,
} from "../types";
import { useActor } from "./useActor";

// Default measure names used when no custom config exists
const DEFAULT_MEASURE_NAMES: Record<TargetMeasureId, string> = {
  Measure1: "Renewal Revenue",
  Measure2: "New Business Revenue",
  Measure3: "Pipeline Created",
  Measure4: "Deal Registrations Approved",
  Measure5: "Closed Won Revenue",
};

// Derive the current quarter from a fiscal year config based on today's date
function deriveCurrentQuarter(
  config: FiscalYearConfig,
): CurrentQuarterResult | null {
  const today = new Date();
  const todayMs = today.getTime();

  for (const q of config.quarters) {
    const start = new Date(q.startDate).getTime();
    const end = new Date(q.endDate).getTime();
    if (todayMs >= start && todayMs <= end) {
      const totalDays = Math.ceil((end - start) / 86_400_000);
      const elapsed = Math.ceil((todayMs - start) / 86_400_000);
      const remaining = Math.max(0, totalDays - elapsed);
      const progress =
        totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 0;
      return {
        quarterDef: q,
        daysElapsed: elapsed,
        daysRemaining: remaining,
        progressPercent: Math.min(100, progress),
      };
    }
  }
  return null;
}

// Build a calendar-year fiscal config for the current year as a fallback
function buildCalendarYearConfig(): FiscalYearConfig {
  const year = new Date().getFullYear();
  const quarters: QuarterDef[] = [
    {
      quarterId: "Q1",
      name: "Q1",
      startDate: `${year}-01-01`,
      endDate: `${year}-03-31`,
    },
    {
      quarterId: "Q2",
      name: "Q2",
      startDate: `${year}-04-01`,
      endDate: `${year}-06-30`,
    },
    {
      quarterId: "Q3",
      name: "Q3",
      startDate: `${year}-07-01`,
      endDate: `${year}-09-30`,
    },
    {
      quarterId: "Q4",
      name: "Q4",
      startDate: `${year}-10-01`,
      endDate: `${year}-12-31`,
    },
  ];
  return {
    vendorId: "",
    fiscalYearType: "CalendarYear",
    quarters,
    updatedAt: BigInt(0),
    updatedBy: "",
  };
}

function buildDefaultMeasureConfig(): TargetMeasureConfig {
  const measures = (
    Object.keys(DEFAULT_MEASURE_NAMES) as TargetMeasureId[]
  ).map((id) => ({
    measureId: id,
    defaultName: DEFAULT_MEASURE_NAMES[id],
    customName: null,
    calculationType: "Revenue" as const,
  }));
  return { vendorId: "", measures, updatedAt: BigInt(0), updatedBy: "" };
}

export interface UseTargetsResult {
  fiscalYearConfig: FiscalYearConfig | null;
  currentQuarter: CurrentQuarterResult | null;
  measureConfig: TargetMeasureConfig | null;
  qtdMetrics: QTDMetrics | null;
  partnerRankings: PartnerQTDRanking[];
  loading: boolean;
  error: string | null;
  saveFiscalYearConfig: (
    type: FiscalYearType,
    quarters: QuarterDef[],
  ) => Promise<boolean>;
  updateMeasureName: (
    measureId: TargetMeasureId,
    customName: string,
  ) => Promise<boolean>;
  saveTargetAssignment: (
    assignment: Omit<TargetAssignment, "assignedAt" | "assignedBy">,
  ) => Promise<boolean>;
  getQTDMetrics: (filters: QTDFilters) => Promise<QTDMetrics | null>;
  getPartnerRankings: (quarterKey: string) => Promise<PartnerQTDRanking[]>;
  refreshAll: () => Promise<void>;
  getMeasureDisplayName: (measureId: TargetMeasureId) => string;
}

export function useTargets(): UseTargetsResult {
  const { actor } = useActor();
  const [fiscalYearConfig, setFiscalYearConfig] =
    useState<FiscalYearConfig | null>(null);
  const [currentQuarter, setCurrentQuarter] =
    useState<CurrentQuarterResult | null>(null);
  const [measureConfig, setMeasureConfig] =
    useState<TargetMeasureConfig | null>(null);
  const [qtdMetrics, setQtdMetrics] = useState<QTDMetrics | null>(null);
  const [partnerRankings, setPartnerRankings] = useState<PartnerQTDRanking[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiscalYear = useCallback(async () => {
    if (!actor) return;
    try {
      // Backend method may not exist yet — guard with in operator
      if ("getFiscalYearConfig" in actor) {
        const raw = await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).getFiscalYearConfig();
        if (raw) {
          const cfg = raw as FiscalYearConfig;
          setFiscalYearConfig(cfg);
          setCurrentQuarter(deriveCurrentQuarter(cfg));
          return;
        }
      }
    } catch {}
    // Fallback: use calendar year defaults
    const fallback = buildCalendarYearConfig();
    setFiscalYearConfig(fallback);
    setCurrentQuarter(deriveCurrentQuarter(fallback));
  }, [actor]);

  const loadMeasureConfig = useCallback(async () => {
    if (!actor) return;
    try {
      if ("getMeasureConfig" in actor) {
        const raw = await (
          actor as unknown as Record<
            string,
            (...args: unknown[]) => Promise<unknown>
          >
        ).getMeasureConfig();
        if (raw) {
          setMeasureConfig(raw as TargetMeasureConfig);
          return;
        }
      }
    } catch {}
    setMeasureConfig(buildDefaultMeasureConfig());
  }, [actor]);

  const refreshAll = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadFiscalYear(), loadMeasureConfig()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load config");
    } finally {
      setLoading(false);
    }
  }, [actor, loadFiscalYear, loadMeasureConfig]);

  useEffect(() => {
    if (actor) refreshAll();
  }, [actor, refreshAll]);

  const saveFiscalYearConfig = useCallback(
    async (type: FiscalYearType, quarters: QuarterDef[]): Promise<boolean> => {
      if (!actor) return false;
      try {
        if ("saveFiscalYearConfig" in actor) {
          await (
            actor as unknown as Record<
              string,
              (...args: unknown[]) => Promise<unknown>
            >
          ).saveFiscalYearConfig({ fiscalYearType: type, quarters: quarters });
        }
        // Optimistic update
        const updated: FiscalYearConfig = {
          vendorId: "",
          fiscalYearType: type,
          quarters,
          updatedAt: BigInt(Date.now()),
          updatedBy: "current-user",
        };
        setFiscalYearConfig(updated);
        setCurrentQuarter(deriveCurrentQuarter(updated));
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save fiscal year");
        return false;
      }
    },
    [actor],
  );

  const updateMeasureName = useCallback(
    async (
      measureId: TargetMeasureId,
      customName: string,
    ): Promise<boolean> => {
      if (!actor) return false;
      try {
        if ("updateMeasureName" in actor) {
          await (
            actor as unknown as Record<
              string,
              (...args: unknown[]) => Promise<unknown>
            >
          ).updateMeasureName(measureId, customName);
        }
        setMeasureConfig((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            measures: prev.measures.map((m) =>
              m.measureId === measureId ? { ...m, customName } : m,
            ),
            updatedAt: BigInt(Date.now()),
          };
        });
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update measure");
        return false;
      }
    },
    [actor],
  );

  const saveTargetAssignment = useCallback(
    async (
      assignment: Omit<TargetAssignment, "assignedAt" | "assignedBy">,
    ): Promise<boolean> => {
      if (!actor) return false;
      try {
        if ("saveTargetAssignment" in actor) {
          await (
            actor as unknown as Record<
              string,
              (...args: unknown[]) => Promise<unknown>
            >
          ).saveTargetAssignment(assignment);
        }
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save target");
        return false;
      }
    },
    [actor],
  );

  const getQTDMetrics = useCallback(
    async (filters: QTDFilters): Promise<QTDMetrics | null> => {
      if (!actor) return null;
      try {
        if ("getQTDMetrics" in actor) {
          const result = await (
            actor as unknown as Record<
              string,
              (...args: unknown[]) => Promise<unknown>
            >
          ).getQTDMetrics(filters);
          const metrics = result as QTDMetrics | null;
          setQtdMetrics(metrics);
          return metrics;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load QTD metrics");
      }
      return null;
    },
    [actor],
  );

  const getPartnerRankings = useCallback(
    async (quarterKey: string): Promise<PartnerQTDRanking[]> => {
      if (!actor) return [];
      try {
        if ("getPartnerRankings" in actor) {
          const result = await (
            actor as unknown as Record<
              string,
              (...args: unknown[]) => Promise<unknown>
            >
          ).getPartnerRankings(quarterKey);
          const rankings = (result as PartnerQTDRanking[]) ?? [];
          setPartnerRankings(rankings);
          return rankings;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load rankings");
      }
      return [];
    },
    [actor],
  );

  const getMeasureDisplayName = useCallback(
    (measureId: TargetMeasureId): string => {
      if (!measureConfig) return DEFAULT_MEASURE_NAMES[measureId];
      const measure = measureConfig.measures.find(
        (m) => m.measureId === measureId,
      );
      if (!measure) return DEFAULT_MEASURE_NAMES[measureId];
      return measure.customName ?? measure.defaultName;
    },
    [measureConfig],
  );

  return {
    fiscalYearConfig,
    currentQuarter,
    measureConfig,
    qtdMetrics,
    partnerRankings,
    loading,
    error,
    saveFiscalYearConfig,
    updateMeasureName,
    saveTargetAssignment,
    getQTDMetrics,
    getPartnerRankings,
    refreshAll,
    getMeasureDisplayName,
  };
}
