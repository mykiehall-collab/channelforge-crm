import { p as useActor, r as reactExports } from "./index-DvFvlUBj.js";
const DEFAULT_MEASURE_NAMES = {
  Measure1: "Renewal Revenue",
  Measure2: "New Business Revenue",
  Measure3: "Pipeline Created",
  Measure4: "Deal Registrations Approved",
  Measure5: "Closed Won Revenue"
};
function deriveCurrentQuarter(config) {
  const today = /* @__PURE__ */ new Date();
  const todayMs = today.getTime();
  for (const q of config.quarters) {
    const start = new Date(q.startDate).getTime();
    const end = new Date(q.endDate).getTime();
    if (todayMs >= start && todayMs <= end) {
      const totalDays = Math.ceil((end - start) / 864e5);
      const elapsed = Math.ceil((todayMs - start) / 864e5);
      const remaining = Math.max(0, totalDays - elapsed);
      const progress = totalDays > 0 ? Math.round(elapsed / totalDays * 100) : 0;
      return {
        quarterDef: q,
        daysElapsed: elapsed,
        daysRemaining: remaining,
        progressPercent: Math.min(100, progress)
      };
    }
  }
  return null;
}
function buildCalendarYearConfig() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const quarters = [
    {
      quarterId: "Q1",
      name: "Q1",
      startDate: `${year}-01-01`,
      endDate: `${year}-03-31`
    },
    {
      quarterId: "Q2",
      name: "Q2",
      startDate: `${year}-04-01`,
      endDate: `${year}-06-30`
    },
    {
      quarterId: "Q3",
      name: "Q3",
      startDate: `${year}-07-01`,
      endDate: `${year}-09-30`
    },
    {
      quarterId: "Q4",
      name: "Q4",
      startDate: `${year}-10-01`,
      endDate: `${year}-12-31`
    }
  ];
  return {
    vendorId: "",
    fiscalYearType: "CalendarYear",
    quarters,
    updatedAt: BigInt(0),
    updatedBy: ""
  };
}
function buildDefaultMeasureConfig() {
  const measures = Object.keys(DEFAULT_MEASURE_NAMES).map((id) => ({
    measureId: id,
    defaultName: DEFAULT_MEASURE_NAMES[id],
    customName: null,
    calculationType: "Revenue"
  }));
  return { vendorId: "", measures, updatedAt: BigInt(0), updatedBy: "" };
}
function useTargets() {
  const { actor } = useActor();
  const [fiscalYearConfig, setFiscalYearConfig] = reactExports.useState(null);
  const [currentQuarter, setCurrentQuarter] = reactExports.useState(null);
  const [measureConfig, setMeasureConfig] = reactExports.useState(null);
  const [qtdMetrics, setQtdMetrics] = reactExports.useState(null);
  const [partnerRankings, setPartnerRankings] = reactExports.useState(
    []
  );
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const loadFiscalYear = reactExports.useCallback(async () => {
    if (!actor) return;
    try {
      if ("getFiscalYearConfig" in actor) {
        const raw = await actor.getFiscalYearConfig();
        if (raw) {
          const cfg = raw;
          setFiscalYearConfig(cfg);
          setCurrentQuarter(deriveCurrentQuarter(cfg));
          return;
        }
      }
    } catch {
    }
    const fallback = buildCalendarYearConfig();
    setFiscalYearConfig(fallback);
    setCurrentQuarter(deriveCurrentQuarter(fallback));
  }, [actor]);
  const loadMeasureConfig = reactExports.useCallback(async () => {
    if (!actor) return;
    try {
      if ("getMeasureConfig" in actor) {
        const raw = await actor.getMeasureConfig();
        if (raw) {
          setMeasureConfig(raw);
          return;
        }
      }
    } catch {
    }
    setMeasureConfig(buildDefaultMeasureConfig());
  }, [actor]);
  const refreshAll = reactExports.useCallback(async () => {
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
  reactExports.useEffect(() => {
    if (actor) refreshAll();
  }, [actor, refreshAll]);
  const saveFiscalYearConfig = reactExports.useCallback(
    async (type, quarters) => {
      if (!actor) return false;
      try {
        if ("saveFiscalYearConfig" in actor) {
          await actor.saveFiscalYearConfig({ fiscalYearType: type, quarters });
        }
        const updated = {
          vendorId: "",
          fiscalYearType: type,
          quarters,
          updatedAt: BigInt(Date.now()),
          updatedBy: "current-user"
        };
        setFiscalYearConfig(updated);
        setCurrentQuarter(deriveCurrentQuarter(updated));
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save fiscal year");
        return false;
      }
    },
    [actor]
  );
  const updateMeasureName = reactExports.useCallback(
    async (measureId, customName) => {
      if (!actor) return false;
      try {
        if ("updateMeasureName" in actor) {
          await actor.updateMeasureName(measureId, customName);
        }
        setMeasureConfig((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            measures: prev.measures.map(
              (m) => m.measureId === measureId ? { ...m, customName } : m
            ),
            updatedAt: BigInt(Date.now())
          };
        });
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update measure");
        return false;
      }
    },
    [actor]
  );
  const saveTargetAssignment = reactExports.useCallback(
    async (assignment) => {
      if (!actor) return false;
      try {
        if ("saveTargetAssignment" in actor) {
          await actor.saveTargetAssignment(assignment);
        }
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save target");
        return false;
      }
    },
    [actor]
  );
  const getQTDMetrics = reactExports.useCallback(
    async (filters) => {
      if (!actor) return null;
      try {
        if ("getQTDMetrics" in actor) {
          const result = await actor.getQTDMetrics(filters);
          const metrics = result;
          setQtdMetrics(metrics);
          return metrics;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load QTD metrics");
      }
      return null;
    },
    [actor]
  );
  const getPartnerRankings = reactExports.useCallback(
    async (quarterKey) => {
      if (!actor) return [];
      try {
        if ("getPartnerRankings" in actor) {
          const result = await actor.getPartnerRankings(quarterKey);
          const rankings = result ?? [];
          setPartnerRankings(rankings);
          return rankings;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load rankings");
      }
      return [];
    },
    [actor]
  );
  const getMeasureDisplayName = reactExports.useCallback(
    (measureId) => {
      if (!measureConfig) return DEFAULT_MEASURE_NAMES[measureId];
      const measure = measureConfig.measures.find(
        (m) => m.measureId === measureId
      );
      if (!measure) return DEFAULT_MEASURE_NAMES[measureId];
      return measure.customName ?? measure.defaultName;
    },
    [measureConfig]
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
    getMeasureDisplayName
  };
}
export {
  useTargets as u
};
