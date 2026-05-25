import { p as useActor, r as reactExports } from "./index-DvFvlUBj.js";
import { S as SmartQueryType, R as RiskTier } from "./backend.d-Bio-_uWv.js";
const POLL_INTERVAL_MS = 3e4;
function mapRiskTier(tier) {
  switch (tier) {
    case RiskTier.Critical:
      return "Critical";
    case RiskTier.High:
      return "High";
    case RiskTier.Medium:
      return "Medium";
    case RiskTier.Low:
      return "Low";
    case RiskTier.Healthy:
      return "Opportunity";
    default:
      return "Low";
  }
}
function mapSmartQueryType(qt) {
  switch (qt) {
    case SmartQueryType.HighRiskRenewals:
      return "HighRiskRenewals";
    case SmartQueryType.RenewalsExpiringNextMonth:
      return "RenewalsExpiringNextMonth";
    case SmartQueryType.PendingDRsOver14Days:
      return "PendingDealRegistrationsOver14Days";
    case SmartQueryType.InactiveResellers:
      return "InactiveResellerAccounts";
    case SmartQueryType.AccountsNoEngagement:
      return "AccountsNoEngagement";
    case SmartQueryType.TopPerformingDistributors:
      return "TopPerformingDistributors";
    case SmartQueryType.ResellersBelowTarget:
      return "ResellersBelowTarget";
    case SmartQueryType.CustomersNoActivePipeline:
      return "CustomersNoActivePipeline";
    case SmartQueryType.ContractsMissingPlans:
      return "ContractsMissingBusinessPlans";
    case SmartQueryType.StalledApprovals:
      return "OpportunitiesStalledApprovals";
    case SmartQueryType.DecliningEngagement:
      return "AccountsDecliningEngagement";
    case SmartQueryType.HighGrowthOpportunities:
      return "HighGrowthResellerOpportunities";
    default:
      return "HighRiskRenewals";
  }
}
function mapSmartQueryTypeToBackend(qt) {
  switch (qt) {
    case "HighRiskRenewals":
      return SmartQueryType.HighRiskRenewals;
    case "RenewalsExpiringNextMonth":
      return SmartQueryType.RenewalsExpiringNextMonth;
    case "PendingDealRegistrationsOver14Days":
      return SmartQueryType.PendingDRsOver14Days;
    case "InactiveResellerAccounts":
      return SmartQueryType.InactiveResellers;
    case "AccountsNoEngagement":
      return SmartQueryType.AccountsNoEngagement;
    case "TopPerformingDistributors":
      return SmartQueryType.TopPerformingDistributors;
    case "ResellersBelowTarget":
      return SmartQueryType.ResellersBelowTarget;
    case "CustomersNoActivePipeline":
      return SmartQueryType.CustomersNoActivePipeline;
    case "ContractsMissingBusinessPlans":
      return SmartQueryType.ContractsMissingPlans;
    case "OpportunitiesStalledApprovals":
      return SmartQueryType.StalledApprovals;
    case "AccountsDecliningEngagement":
      return SmartQueryType.DecliningEngagement;
    case "HighGrowthResellerOpportunities":
      return SmartQueryType.HighGrowthOpportunities;
    default:
      return SmartQueryType.HighRiskRenewals;
  }
}
function mapSmartQueryFilterToBackend(filter) {
  if (!filter) return {};
  return {
    region: filter.region,
    product: filter.product,
    distributorId: filter.distributorId,
    resellerId: filter.resellerId,
    accountManagerId: filter.accountManagerId,
    renewalWindowDays: filter.renewalWindowDays !== void 0 ? BigInt(filter.renewalWindowDays) : void 0,
    riskLevel: filter.riskLevel,
    minContractValue: filter.contractValueMin !== void 0 ? BigInt(Math.round(filter.contractValueMin)) : void 0
  };
}
function mapRecommendation(r) {
  return {
    id: r.id,
    riskTier: mapRiskTier(r.riskLevel),
    summary: r.summary,
    fullDetail: void 0,
    affectedEntityId: r.affectedEntityId,
    affectedEntityName: r.affectedEntityName,
    affectedEntityType: r.affectedEntityType,
    suggestedNextAction: r.suggestedAction,
    recommendedAt: r.timestamp,
    confidence: Number(r.confidence),
    dataSources: [r.recommendationType],
    dismissed: r.dismissed
  };
}
function mapEngagementGap(g) {
  return {
    alertId: g.entityId,
    entityId: g.entityId,
    entityName: g.entityName,
    entityType: g.entityType,
    daysSinceLastEngagement: Number(g.daysSinceEngagement),
    threshold: Number(g.threshold),
    affectedAccountCount: 1,
    severity: mapRiskTier(g.alertLevel),
    detectedAt: g.detectedAt
  };
}
function mapRenewalRiskScore(s) {
  return {
    accountId: s.accountId,
    accountName: s.accountId,
    // backend doesn't carry name separately
    riskScore: Number(s.score),
    riskTier: mapRiskTier(s.tier),
    renewalDate: new Date(Number(s.lastAnalyzed)).toISOString().slice(0, 10),
    contractValue: 0,
    currency: "USD",
    factors: s.signals.map((sig) => sig.description),
    lastCalculated: s.lastAnalyzed
  };
}
function mapAuditEntry(e) {
  return {
    entryId: e.id,
    analysisType: e.analysisType,
    entityName: e.entityName,
    riskLevel: e.riskLevel ? mapRiskTier(e.riskLevel) : "Low",
    timestamp: e.timestamp,
    triggeredBy: e.triggeredBy
  };
}
function mapSmartQueryResult(r) {
  return {
    queryType: mapSmartQueryType(r.queryType),
    title: r.queryType,
    summary: r.summary,
    items: r.items.map((item) => ({
      id: item.entityId,
      label: item.entityName,
      subLabel: item.details || void 0,
      riskTier: item.riskTier ? mapRiskTier(item.riskTier) : void 0,
      metric: item.riskScore !== void 0 ? `${item.riskScore}%` : void 0
    })),
    generatedAt: r.generatedAt,
    insight: r.insights[0]
  };
}
function mapForgeAISettings(s) {
  return {
    enabled: s.enabled,
    engagementGapThresholdReseller: Number(s.resellerInactivityThresholdDays),
    engagementGapThresholdDistributor: Number(
      s.distributorInactivityThresholdDays
    ),
    warningLevel: "Standard",
    escalationDays: Number(s.escalationThresholdDays),
    aiCapabilities: {
      renewalRiskScoring: s.renewalRiskEnabled,
      engagementGapDetection: s.engagementGapEnabled,
      dealRegistrationAnalysis: s.recommendationsEnabled,
      channelHealthScoring: s.recommendationsEnabled,
      incentiveIntelligence: s.recommendationsEnabled,
      smartQuerySearch: s.smartQueriesEnabled,
      messagingAssistance: s.messagingAssistEnabled
    },
    notificationBehavior: "InAppOnly",
    updatedAt: 0n,
    updatedBy: ""
  };
}
function mapSettingsToBackend(patch, current) {
  var _a, _b, _c, _d, _e;
  return {
    ...current,
    enabled: patch.enabled ?? current.enabled,
    resellerInactivityThresholdDays: patch.engagementGapThresholdReseller !== void 0 ? BigInt(patch.engagementGapThresholdReseller) : current.resellerInactivityThresholdDays,
    distributorInactivityThresholdDays: patch.engagementGapThresholdDistributor !== void 0 ? BigInt(patch.engagementGapThresholdDistributor) : current.distributorInactivityThresholdDays,
    escalationThresholdDays: patch.escalationDays !== void 0 ? BigInt(patch.escalationDays) : current.escalationThresholdDays,
    renewalRiskEnabled: ((_a = patch.aiCapabilities) == null ? void 0 : _a.renewalRiskScoring) ?? current.renewalRiskEnabled,
    engagementGapEnabled: ((_b = patch.aiCapabilities) == null ? void 0 : _b.engagementGapDetection) ?? current.engagementGapEnabled,
    recommendationsEnabled: ((_c = patch.aiCapabilities) == null ? void 0 : _c.dealRegistrationAnalysis) ?? current.recommendationsEnabled,
    smartQueriesEnabled: ((_d = patch.aiCapabilities) == null ? void 0 : _d.smartQuerySearch) ?? current.smartQueriesEnabled,
    messagingAssistEnabled: ((_e = patch.aiCapabilities) == null ? void 0 : _e.messagingAssistance) ?? current.messagingAssistEnabled
  };
}
function useForgeAI() {
  const { actor } = useActor();
  const [recommendations, setRecommendations] = reactExports.useState([]);
  const [settings, setSettings] = reactExports.useState(null);
  const [backendSettings, setBackendSettings] = reactExports.useState(null);
  const [engagementGaps, setEngagementGaps] = reactExports.useState(
    []
  );
  const [renewalRiskScores, setRenewalRiskScores] = reactExports.useState([]);
  const [auditLog, setAuditLog] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [isAnalyzing, setIsAnalyzing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [lastAnalyzedAt, setLastAnalyzedAt] = reactExports.useState(null);
  const [activeSmartQuery, setActiveSmartQuery] = reactExports.useState(null);
  const [activeQueryType, setActiveQueryType] = reactExports.useState(
    null
  );
  const [activeQueryFilter, setActiveQueryFilter] = reactExports.useState(void 0);
  const [lastQueryUpdatedAt, setLastQueryUpdatedAt] = reactExports.useState(
    null
  );
  const [isPolling, setIsPolling] = reactExports.useState(false);
  const [nlQueryResult, setNlQueryResult] = reactExports.useState(
    null
  );
  const pollTimerRef = reactExports.useRef(null);
  const isMountedRef = reactExports.useRef(true);
  reactExports.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  reactExports.useEffect(() => {
    if (!actor) return;
    let cancelled = false;
    setIsLoading(true);
    const fetchSettingsAndAnalysis = async () => {
      try {
        const [settingsResult, analysisResult, auditResult] = await Promise.allSettled([
          actor.getForgeAISettings(),
          actor.runForgeAIAnalysis(),
          actor.getForgeAIAuditLog(BigInt(50))
        ]);
        if (cancelled) return;
        if (settingsResult.status === "fulfilled") {
          const s = settingsResult.value;
          setBackendSettings(s);
          setSettings(mapForgeAISettings(s));
        }
        if (analysisResult.status === "fulfilled" && analysisResult.value.__kind__ === "ok") {
          const {
            recommendations: recs,
            riskScores,
            gapAlerts
          } = analysisResult.value.ok;
          setRecommendations(recs.map(mapRecommendation));
          setRenewalRiskScores(riskScores.map(mapRenewalRiskScore));
          setEngagementGaps(gapAlerts.map(mapEngagementGap));
          setLastAnalyzedAt(/* @__PURE__ */ new Date());
        } else if (analysisResult.status === "fulfilled" && analysisResult.value.__kind__ === "err") {
          setError(analysisResult.value.err);
        }
        if (auditResult.status === "fulfilled") {
          setAuditLog(auditResult.value.map(mapAuditEntry));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load ForgeAI data"
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSettingsAndAnalysis();
    return () => {
      cancelled = true;
    };
  }, [actor]);
  const executeSmartQueryPoll = reactExports.useCallback(
    async (actor2, queryType, filter) => {
      if (document.visibilityState === "hidden") return;
      try {
        const backendFilter = mapSmartQueryFilterToBackend(filter);
        const backendQT = mapSmartQueryTypeToBackend(queryType);
        const result = await actor2.runSmartQuery(backendQT, backendFilter);
        if (!isMountedRef.current) return;
        if (result.__kind__ === "ok") {
          setActiveSmartQuery(mapSmartQueryResult(result.ok));
          setLastQueryUpdatedAt(/* @__PURE__ */ new Date());
        }
      } catch {
      }
    },
    []
  );
  reactExports.useEffect(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (!actor || !activeQueryType) {
      setIsPolling(false);
      return;
    }
    setIsPolling(true);
    pollTimerRef.current = setInterval(() => {
      executeSmartQueryPoll(actor, activeQueryType, activeQueryFilter);
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [actor, activeQueryType, activeQueryFilter, executeSmartQueryPoll]);
  const runAnalysis = reactExports.useCallback(async () => {
    if (!actor) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await actor.runForgeAIAnalysis();
      if (!isMountedRef.current) return;
      if (result.__kind__ === "ok") {
        const { recommendations: recs, riskScores, gapAlerts } = result.ok;
        setRecommendations(recs.map(mapRecommendation));
        setRenewalRiskScores(riskScores.map(mapRenewalRiskScore));
        setEngagementGaps(gapAlerts.map(mapEngagementGap));
        setLastAnalyzedAt(/* @__PURE__ */ new Date());
      } else {
        setError(result.err);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "Analysis failed");
      }
    } finally {
      if (isMountedRef.current) setIsAnalyzing(false);
    }
  }, [actor]);
  const runSmartQuery = reactExports.useCallback(
    async (queryType, filter) => {
      if (!actor) return null;
      setIsAnalyzing(true);
      setError(null);
      try {
        const backendFilter = mapSmartQueryFilterToBackend(filter);
        const backendQT = mapSmartQueryTypeToBackend(queryType);
        const result = await actor.runSmartQuery(backendQT, backendFilter);
        if (!isMountedRef.current) return null;
        if (result.__kind__ === "ok") {
          const mapped = mapSmartQueryResult(result.ok);
          setActiveSmartQuery(mapped);
          setActiveQueryType(queryType);
          setActiveQueryFilter(filter);
          setLastQueryUpdatedAt(/* @__PURE__ */ new Date());
          return mapped;
        }
        setError(result.err);
        return null;
      } catch (err) {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : "Smart query failed");
        }
        return null;
      } finally {
        if (isMountedRef.current) setIsAnalyzing(false);
      }
    },
    [actor]
  );
  const clearSmartQuery = reactExports.useCallback(() => {
    setActiveSmartQuery(null);
    setActiveQueryType(null);
    setActiveQueryFilter(void 0);
    setLastQueryUpdatedAt(null);
    setIsPolling(false);
  }, []);
  const runNLQuery = reactExports.useCallback(
    async (naturalLanguageQuery) => {
      if (!actor) return null;
      setIsAnalyzing(true);
      setError(null);
      try {
        const result = await actor.runNLQuery(naturalLanguageQuery);
        if (!isMountedRef.current) return null;
        if (result.__kind__ === "ok") {
          const r = result.ok;
          const mappedResult = {
            interpretedQueryType: mapSmartQueryType(r.interpretedQueryType),
            interpretedFilters: {
              region: r.interpretedFilters.region,
              product: r.interpretedFilters.product,
              distributorId: r.interpretedFilters.distributorId,
              resellerId: r.interpretedFilters.resellerId,
              accountManagerId: r.interpretedFilters.accountManagerId,
              renewalWindowDays: r.interpretedFilters.renewalWindowDays !== void 0 ? Number(r.interpretedFilters.renewalWindowDays) : void 0,
              riskLevel: r.interpretedFilters.riskLevel,
              contractValueMin: r.interpretedFilters.minContractValue !== void 0 ? Number(r.interpretedFilters.minContractValue) : void 0
            },
            interpretationExplanation: r.interpretationExplanation,
            confidenceLevel: r.confidenceLevel ?? "Low",
            originalQuery: r.originalQuery,
            queryResult: mapSmartQueryResult(r.queryResult)
          };
          setNlQueryResult(mappedResult);
          setActiveSmartQuery(mappedResult.queryResult);
          setActiveQueryType(mappedResult.interpretedQueryType);
          setActiveQueryFilter(mappedResult.interpretedFilters);
          setLastQueryUpdatedAt(/* @__PURE__ */ new Date());
          return mappedResult;
        }
        setError(result.err);
        return null;
      } catch (err) {
        if (isMountedRef.current) {
          setError(
            err instanceof Error ? err.message : "Natural language query failed"
          );
        }
        return null;
      } finally {
        if (isMountedRef.current) setIsAnalyzing(false);
      }
    },
    [actor]
  );
  const clearNLQuery = reactExports.useCallback(() => {
    setNlQueryResult(null);
    setActiveSmartQuery(null);
    setActiveQueryType(null);
    setActiveQueryFilter(void 0);
    setLastQueryUpdatedAt(null);
    setIsPolling(false);
  }, []);
  const dismissRecommendation = reactExports.useCallback(
    (id) => {
      if (!actor) return;
      setRecommendations(
        (prev) => prev.map((r) => r.id === id ? { ...r, dismissed: true } : r)
      );
      actor.dismissForgeAIRecommendation(id).catch(() => {
        if (isMountedRef.current) {
          setRecommendations(
            (prev) => prev.map((r) => r.id === id ? { ...r, dismissed: false } : r)
          );
        }
      });
    },
    [actor]
  );
  const updateSettings = reactExports.useCallback(
    (patch) => {
      if (!actor || !backendSettings) return;
      setSettings((prev) => prev ? { ...prev, ...patch } : null);
      const updatedBackend = mapSettingsToBackend(patch, backendSettings);
      actor.updateForgeAISettings(updatedBackend).then((result) => {
        if (!isMountedRef.current) return;
        if (result.__kind__ === "ok") {
          setBackendSettings(updatedBackend);
        } else {
          setSettings(mapForgeAISettings(backendSettings));
          setError(result.err);
        }
      }).catch(() => {
        if (isMountedRef.current) {
          setSettings(mapForgeAISettings(backendSettings));
        }
      });
    },
    [actor, backendSettings]
  );
  return {
    recommendations: recommendations.filter((r) => !r.dismissed),
    settings,
    engagementGaps,
    renewalRiskScores,
    auditLog,
    isLoading,
    isAnalyzing,
    error,
    lastAnalyzedAt,
    dismissRecommendation,
    updateSettings,
    runAnalysis,
    runSmartQuery,
    runNLQuery,
    activeSmartQuery,
    clearSmartQuery,
    nlQueryResult,
    clearNLQuery,
    lastQueryUpdatedAt,
    isPolling
  };
}
export {
  useForgeAI as u
};
