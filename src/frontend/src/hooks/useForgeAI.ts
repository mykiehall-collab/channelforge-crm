import { useCallback, useEffect, useRef, useState } from "react";
import {
  type EngagementGapAlert as BackendEngagementGapAlert,
  type ForgeAIAuditEntry as BackendForgeAIAuditEntry,
  type ForgeAIRecommendation as BackendForgeAIRecommendation,
  type ForgeAISettings as BackendForgeAISettings,
  type GapNotificationConfig as BackendGapNotificationConfig,
  type NLQueryResult as BackendNLQueryResult,
  type RenewalRiskScore as BackendRenewalRiskScore,
  type SmartQueryFilter as BackendSmartQueryFilter,
  type SmartQueryResult as BackendSmartQueryResult,
  SmartQueryType as BackendSmartQueryType,
  RiskTier,
} from "../backend.d";
import type {
  AuditLogLevel,
  EngagementGapAlert,
  ForgeAIAuditEntry,
  ForgeAIRecommendation,
  ForgeAIRiskTier,
  ForgeAISettings,
  GapNotificationConfig,
  NLQueryResult,
  RenewalRiskScore,
  SmartQueryFilter,
  SmartQueryResult,
  SmartQueryType,
} from "../types";
import { useActor } from "./useActor";

// Re-export AuditLogLevel for consumers
export type { AuditLogLevel };

// ─── Polling interval ────────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 30_000;

// ─── Type mappers: backend → frontend ────────────────────────────────────────

function mapRiskTier(tier: RiskTier | undefined): ForgeAIRiskTier {
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

function mapSmartQueryType(qt: BackendSmartQueryType): SmartQueryType {
  switch (qt) {
    case BackendSmartQueryType.HighRiskRenewals:
      return "HighRiskRenewals";
    case BackendSmartQueryType.RenewalsExpiringNextMonth:
      return "RenewalsExpiringNextMonth";
    case BackendSmartQueryType.PendingDRsOver14Days:
      return "PendingDealRegistrationsOver14Days";
    case BackendSmartQueryType.InactiveResellers:
      return "InactiveResellerAccounts";
    case BackendSmartQueryType.AccountsNoEngagement:
      return "AccountsNoEngagement";
    case BackendSmartQueryType.TopPerformingDistributors:
      return "TopPerformingDistributors";
    case BackendSmartQueryType.ResellersBelowTarget:
      return "ResellersBelowTarget";
    case BackendSmartQueryType.CustomersNoActivePipeline:
      return "CustomersNoActivePipeline";
    case BackendSmartQueryType.ContractsMissingPlans:
      return "ContractsMissingBusinessPlans";
    case BackendSmartQueryType.StalledApprovals:
      return "OpportunitiesStalledApprovals";
    case BackendSmartQueryType.DecliningEngagement:
      return "AccountsDecliningEngagement";
    case BackendSmartQueryType.HighGrowthOpportunities:
      return "HighGrowthResellerOpportunities";
    default:
      return "HighRiskRenewals";
  }
}

function mapSmartQueryTypeToBackend(qt: SmartQueryType): BackendSmartQueryType {
  switch (qt) {
    case "HighRiskRenewals":
      return BackendSmartQueryType.HighRiskRenewals;
    case "RenewalsExpiringNextMonth":
      return BackendSmartQueryType.RenewalsExpiringNextMonth;
    case "PendingDealRegistrationsOver14Days":
      return BackendSmartQueryType.PendingDRsOver14Days;
    case "InactiveResellerAccounts":
      return BackendSmartQueryType.InactiveResellers;
    case "AccountsNoEngagement":
      return BackendSmartQueryType.AccountsNoEngagement;
    case "TopPerformingDistributors":
      return BackendSmartQueryType.TopPerformingDistributors;
    case "ResellersBelowTarget":
      return BackendSmartQueryType.ResellersBelowTarget;
    case "CustomersNoActivePipeline":
      return BackendSmartQueryType.CustomersNoActivePipeline;
    case "ContractsMissingBusinessPlans":
      return BackendSmartQueryType.ContractsMissingPlans;
    case "OpportunitiesStalledApprovals":
      return BackendSmartQueryType.StalledApprovals;
    case "AccountsDecliningEngagement":
      return BackendSmartQueryType.DecliningEngagement;
    case "HighGrowthResellerOpportunities":
      return BackendSmartQueryType.HighGrowthOpportunities;
    default:
      return BackendSmartQueryType.HighRiskRenewals;
  }
}

function mapSmartQueryFilterToBackend(
  filter: SmartQueryFilter | undefined,
): BackendSmartQueryFilter {
  if (!filter) return {};
  return {
    region: filter.region,
    product: filter.product,
    distributorId: filter.distributorId,
    resellerId: filter.resellerId,
    accountManagerId: filter.accountManagerId,
    renewalWindowDays:
      filter.renewalWindowDays !== undefined
        ? BigInt(filter.renewalWindowDays)
        : undefined,
    riskLevel: filter.riskLevel,
    minContractValue:
      filter.contractValueMin !== undefined
        ? BigInt(Math.round(filter.contractValueMin))
        : undefined,
  };
}

function mapRecommendation(
  r: BackendForgeAIRecommendation,
): ForgeAIRecommendation {
  return {
    id: r.id,
    riskTier: mapRiskTier(r.riskLevel),
    summary: r.summary,
    fullDetail: undefined,
    affectedEntityId: r.affectedEntityId,
    affectedEntityName: r.affectedEntityName,
    affectedEntityType:
      r.affectedEntityType as ForgeAIRecommendation["affectedEntityType"],
    suggestedNextAction: r.suggestedAction,
    recommendedAt: r.timestamp,
    confidence: Number(r.confidence),
    dataSources: [r.recommendationType],
    dismissed: r.dismissed,
  };
}

function mapEngagementGap(g: BackendEngagementGapAlert): EngagementGapAlert {
  return {
    alertId: g.entityId,
    entityId: g.entityId,
    entityName: g.entityName,
    entityType: g.entityType as EngagementGapAlert["entityType"],
    daysSinceLastEngagement: Number(g.daysSinceEngagement),
    threshold: Number(g.threshold),
    affectedAccountCount: 1,
    severity: mapRiskTier(g.alertLevel),
    detectedAt: g.detectedAt,
  };
}

function mapRenewalRiskScore(s: BackendRenewalRiskScore): RenewalRiskScore {
  return {
    accountId: s.accountId,
    accountName: s.accountId, // backend doesn't carry name separately
    riskScore: Number(s.score),
    riskTier: mapRiskTier(s.tier),
    renewalDate: new Date(Number(s.lastAnalyzed)).toISOString().slice(0, 10),
    contractValue: 0,
    currency: "USD",
    factors: s.signals.map((sig) => sig.description),
    lastCalculated: s.lastAnalyzed,
  };
}

function mapAuditEntry(e: BackendForgeAIAuditEntry): ForgeAIAuditEntry {
  return {
    entryId: e.id,
    analysisType: e.analysisType,
    entityName: e.entityName,
    riskLevel: e.riskLevel ? mapRiskTier(e.riskLevel) : "Low",
    timestamp: e.timestamp,
    triggeredBy: e.triggeredBy,
  };
}

function mapSmartQueryResult(r: BackendSmartQueryResult): SmartQueryResult {
  return {
    queryType: mapSmartQueryType(r.queryType),
    title: r.queryType,
    summary: r.summary,
    items: r.items.map((item) => ({
      id: item.entityId,
      label: item.entityName,
      subLabel: item.details || undefined,
      riskTier: item.riskTier ? mapRiskTier(item.riskTier) : undefined,
      metric: item.riskScore !== undefined ? `${item.riskScore}%` : undefined,
    })),
    generatedAt: r.generatedAt,
    insight: r.insights[0],
  };
}

function mapForgeAISettings(s: BackendForgeAISettings): ForgeAISettings {
  return {
    enabled: s.enabled,
    engagementGapThresholdReseller: Number(s.resellerInactivityThresholdDays),
    engagementGapThresholdDistributor: Number(
      s.distributorInactivityThresholdDays,
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
      messagingAssistance: s.messagingAssistEnabled,
    },
    notificationBehavior: "InAppOnly",
    updatedAt: 0n,
    updatedBy: "",
  };
}

function mapSettingsToBackend(
  patch: Partial<ForgeAISettings>,
  current: BackendForgeAISettings,
): BackendForgeAISettings {
  return {
    ...current,
    enabled: patch.enabled ?? current.enabled,
    resellerInactivityThresholdDays:
      patch.engagementGapThresholdReseller !== undefined
        ? BigInt(patch.engagementGapThresholdReseller)
        : current.resellerInactivityThresholdDays,
    distributorInactivityThresholdDays:
      patch.engagementGapThresholdDistributor !== undefined
        ? BigInt(patch.engagementGapThresholdDistributor)
        : current.distributorInactivityThresholdDays,
    escalationThresholdDays:
      patch.escalationDays !== undefined
        ? BigInt(patch.escalationDays)
        : current.escalationThresholdDays,
    renewalRiskEnabled:
      patch.aiCapabilities?.renewalRiskScoring ?? current.renewalRiskEnabled,
    engagementGapEnabled:
      patch.aiCapabilities?.engagementGapDetection ??
      current.engagementGapEnabled,
    recommendationsEnabled:
      patch.aiCapabilities?.dealRegistrationAnalysis ??
      current.recommendationsEnabled,
    smartQueriesEnabled:
      patch.aiCapabilities?.smartQuerySearch ?? current.smartQueriesEnabled,
    messagingAssistEnabled:
      patch.aiCapabilities?.messagingAssistance ??
      current.messagingAssistEnabled,
  };
}

// ─── Pricing & Quoting insight helpers (non-backend, UI-layer) ───────────────

export interface PricingInsightItem {
  id: string;
  priority: "high" | "medium" | "low";
  description: string;
  actionLabel: string;
}

export function getPricingInsights(
  _opportunityId?: string,
): PricingInsightItem[] {
  return [
    {
      id: "pq1",
      priority: "high",
      description:
        "This quote may fall below expected margin threshold. Review discount before submission.",
      actionLabel: "Review",
    },
    {
      id: "pq3",
      priority: "medium",
      description: "Customer may qualify for renewal incentive pricing.",
      actionLabel: "Apply Incentive",
    },
    {
      id: "pq6",
      priority: "low",
      description:
        "Promotional pricing available for selected SKUs this quarter.",
      actionLabel: "Apply Promo",
    },
  ];
}

export function getQuoteInsights(_quoteId?: string): PricingInsightItem[] {
  return [
    {
      id: "pq2",
      priority: "high",
      description:
        "Quote has been inactive for 14+ days. Follow up recommended.",
      actionLabel: "Follow Up",
    },
    {
      id: "pq4",
      priority: "medium",
      description: "Quote expiry approaching in 7 days.",
      actionLabel: "Extend Quote",
    },
  ];
}

export function mapGapNotificationConfig(
  c: BackendGapNotificationConfig,
): GapNotificationConfig {
  return {
    critical: {
      accountOwner: c.critical.accountOwner,
      primaryAdmin: c.critical.primaryAdmin,
      assignedDistributor: c.critical.assignedDistributor,
      assignedReseller: c.critical.assignedReseller,
    },
    high: {
      accountOwner: c.high.accountOwner,
      primaryAdmin: c.high.primaryAdmin,
      assignedDistributor: c.high.assignedDistributor,
      assignedReseller: c.high.assignedReseller,
    },
  };
}

// ─── Hook interface ───────────────────────────────────────────────────────────

export interface UseForgeAIReturn {
  recommendations: ForgeAIRecommendation[];
  settings: ForgeAISettings | null;
  engagementGaps: EngagementGapAlert[];
  renewalRiskScores: RenewalRiskScore[];
  auditLog: ForgeAIAuditEntry[];
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;
  lastAnalyzedAt: Date | null;
  dismissRecommendation: (id: string) => void;
  updateSettings: (patch: Partial<ForgeAISettings>) => void;
  runAnalysis: () => Promise<void>;
  runSmartQuery: (
    queryType: SmartQueryType,
    filter?: SmartQueryFilter,
  ) => Promise<SmartQueryResult | null>;
  runNLQuery: (naturalLanguageQuery: string) => Promise<NLQueryResult | null>;
  activeSmartQuery: SmartQueryResult | null;
  clearSmartQuery: () => void;
  nlQueryResult: NLQueryResult | null;
  clearNLQuery: () => void;
  // Polling metadata
  lastQueryUpdatedAt: Date | null;
  isPolling: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useForgeAI(): UseForgeAIReturn {
  const { actor } = useActor();

  // ── Core state ──
  const [recommendations, setRecommendations] = useState<
    ForgeAIRecommendation[]
  >([]);
  const [settings, setSettings] = useState<ForgeAISettings | null>(null);
  const [backendSettings, setBackendSettings] =
    useState<BackendForgeAISettings | null>(null);
  const [engagementGaps, setEngagementGaps] = useState<EngagementGapAlert[]>(
    [],
  );
  const [renewalRiskScores, setRenewalRiskScores] = useState<
    RenewalRiskScore[]
  >([]);
  const [auditLog, setAuditLog] = useState<ForgeAIAuditEntry[]>([]);

  // ── Loading / error state ──
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<Date | null>(null);

  // ── Smart query state ──
  const [activeSmartQuery, setActiveSmartQuery] =
    useState<SmartQueryResult | null>(null);
  const [activeQueryType, setActiveQueryType] = useState<SmartQueryType | null>(
    null,
  );
  const [activeQueryFilter, setActiveQueryFilter] = useState<
    SmartQueryFilter | undefined
  >(undefined);
  const [lastQueryUpdatedAt, setLastQueryUpdatedAt] = useState<Date | null>(
    null,
  );
  const [isPolling, setIsPolling] = useState(false);

  // ── NL query state ──
  const [nlQueryResult, setNlQueryResult] = useState<NLQueryResult | null>(
    null,
  );

  // ── Polling refs ──
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ─── Initial load: fetch settings + run analysis ───────────────────────────

  useEffect(() => {
    if (!actor) return;

    let cancelled = false;
    setIsLoading(true);

    const fetchSettingsAndAnalysis = async () => {
      try {
        const [settingsResult, analysisResult, auditResult] =
          await Promise.allSettled([
            actor.getForgeAISettings(),
            actor.runForgeAIAnalysis(),
            actor.getForgeAIAuditLog(BigInt(50)),
          ]);

        if (cancelled) return;

        if (settingsResult.status === "fulfilled") {
          const s = settingsResult.value;
          setBackendSettings(s);
          setSettings(mapForgeAISettings(s));
        }

        if (
          analysisResult.status === "fulfilled" &&
          analysisResult.value.__kind__ === "ok"
        ) {
          const {
            recommendations: recs,
            riskScores,
            gapAlerts,
          } = analysisResult.value.ok;
          setRecommendations(recs.map(mapRecommendation));
          setRenewalRiskScores(riskScores.map(mapRenewalRiskScore));
          setEngagementGaps(gapAlerts.map(mapEngagementGap));
          setLastAnalyzedAt(new Date());
        } else if (
          analysisResult.status === "fulfilled" &&
          analysisResult.value.__kind__ === "err"
        ) {
          setError(analysisResult.value.err);
        }

        if (auditResult.status === "fulfilled") {
          setAuditLog(auditResult.value.map(mapAuditEntry));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load ForgeAI data",
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

  // ─── 30-second polling for active smart query ──────────────────────────────

  const executeSmartQueryPoll = useCallback(
    async (
      actor: NonNullable<ReturnType<typeof useActor>["actor"]>,
      queryType: SmartQueryType,
      filter: SmartQueryFilter | undefined,
    ) => {
      if (document.visibilityState === "hidden") return;

      try {
        const backendFilter = mapSmartQueryFilterToBackend(filter);
        const backendQT = mapSmartQueryTypeToBackend(queryType);
        const result = await actor.runSmartQuery(backendQT, backendFilter);

        if (!isMountedRef.current) return;

        if (result.__kind__ === "ok") {
          setActiveSmartQuery(mapSmartQueryResult(result.ok));
          setLastQueryUpdatedAt(new Date());
        }
      } catch {
        // Preserve previous results on poll failure — no error state update
      }
    },
    [],
  );

  useEffect(() => {
    // Clear previous timer
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

  // ─── Actions ──────────────────────────────────────────────────────────────

  const runAnalysis = useCallback(async () => {
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
        setLastAnalyzedAt(new Date());
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

  const runSmartQuery = useCallback(
    async (
      queryType: SmartQueryType,
      filter?: SmartQueryFilter,
    ): Promise<SmartQueryResult | null> => {
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
          setLastQueryUpdatedAt(new Date());
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
    [actor],
  );

  const clearSmartQuery = useCallback(() => {
    setActiveSmartQuery(null);
    setActiveQueryType(null);
    setActiveQueryFilter(undefined);
    setLastQueryUpdatedAt(null);
    setIsPolling(false);
  }, []);

  const runNLQuery = useCallback(
    async (naturalLanguageQuery: string): Promise<NLQueryResult | null> => {
      if (!actor) return null;

      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await actor.runNLQuery(naturalLanguageQuery);

        if (!isMountedRef.current) return null;

        if (result.__kind__ === "ok") {
          const r = result.ok;
          const mappedResult: NLQueryResult = {
            interpretedQueryType: mapSmartQueryType(r.interpretedQueryType),
            interpretedFilters: {
              region: r.interpretedFilters.region,
              product: r.interpretedFilters.product,
              distributorId: r.interpretedFilters.distributorId,
              resellerId: r.interpretedFilters.resellerId,
              accountManagerId: r.interpretedFilters.accountManagerId,
              renewalWindowDays:
                r.interpretedFilters.renewalWindowDays !== undefined
                  ? Number(r.interpretedFilters.renewalWindowDays)
                  : undefined,
              riskLevel: r.interpretedFilters.riskLevel as
                | ForgeAIRiskTier
                | undefined,
              contractValueMin:
                r.interpretedFilters.minContractValue !== undefined
                  ? Number(r.interpretedFilters.minContractValue)
                  : undefined,
            },
            interpretationExplanation: r.interpretationExplanation,
            confidenceLevel:
              (r.confidenceLevel as "High" | "Medium" | "Low") ?? "Low",
            originalQuery: r.originalQuery,
            queryResult: mapSmartQueryResult(r.queryResult),
          };

          setNlQueryResult(mappedResult);
          setActiveSmartQuery(mappedResult.queryResult);
          setActiveQueryType(mappedResult.interpretedQueryType);
          setActiveQueryFilter(mappedResult.interpretedFilters);
          setLastQueryUpdatedAt(new Date());
          return mappedResult;
        }

        setError(result.err);
        return null;
      } catch (err) {
        if (isMountedRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : "Natural language query failed",
          );
        }
        return null;
      } finally {
        if (isMountedRef.current) setIsAnalyzing(false);
      }
    },
    [actor],
  );

  const clearNLQuery = useCallback(() => {
    setNlQueryResult(null);
    setActiveSmartQuery(null);
    setActiveQueryType(null);
    setActiveQueryFilter(undefined);
    setLastQueryUpdatedAt(null);
    setIsPolling(false);
  }, []);

  const dismissRecommendation = useCallback(
    (id: string) => {
      if (!actor) return;

      // Optimistic update — remove immediately from UI
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, dismissed: true } : r)),
      );

      // Fire-and-forget backend call
      actor.dismissForgeAIRecommendation(id).catch(() => {
        // Revert on failure
        if (isMountedRef.current) {
          setRecommendations((prev) =>
            prev.map((r) => (r.id === id ? { ...r, dismissed: false } : r)),
          );
        }
      });
    },
    [actor],
  );

  const updateSettings = useCallback(
    (patch: Partial<ForgeAISettings>) => {
      if (!actor || !backendSettings) return;

      // Optimistic update
      setSettings((prev) => (prev ? { ...prev, ...patch } : null));

      const updatedBackend = mapSettingsToBackend(patch, backendSettings);

      actor
        .updateForgeAISettings(updatedBackend)
        .then((result) => {
          if (!isMountedRef.current) return;
          if (result.__kind__ === "ok") {
            setBackendSettings(updatedBackend);
          } else {
            // Revert optimistic update on failure
            setSettings(mapForgeAISettings(backendSettings));
            setError(result.err);
          }
        })
        .catch(() => {
          if (isMountedRef.current) {
            setSettings(mapForgeAISettings(backendSettings));
          }
        });
    },
    [actor, backendSettings],
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
    isPolling,
  };
}
