import type {
  KPIAuditEntry,
  KPIDataPoint,
  KPIDefinition,
  KPIForgeInsight,
  KPIScorecard,
  KPIScorecardEntry,
  KPIStatus,
} from "@/types/kpi";
import { useCallback, useEffect, useState } from "react";

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const LS_DEFS = "channelforge_kpi_definitions";
const LS_DATA = "channelforge_kpi_datapoints";
const LS_AUDIT = "channelforge_kpi_audit";
const LS_INSIGHTS = "channelforge_kpi_forge_insights";

// ─── Default KPI Definitions (10 starter templates) ──────────────────────────

const DEFAULT_KPI_DEFINITIONS: KPIDefinition[] = [
  {
    id: "kpi-renewal-revenue",
    name: "Renewal Revenue",
    category: "Revenue",
    description:
      "Total value of subscription and contract renewals closed within the period against target.",
    formulaType: "attainment",
    formulaExpression: "(actualRenewalRevenue / targetRenewalRevenue) * 100",
    weight: 30,
    benchmarkTarget: 3,
    benchmarkUnit: "£M",
    warningThreshold: 10,
    criticalThreshold: 20,
    visibilityRoles: ["all"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["revenue", "renewals", "core"],
  },
  {
    id: "kpi-ai-adoption",
    name: "AI Adoption",
    category: "Adoption",
    description:
      "Percentage of active partner accounts with at least one AI-enabled workflow activated.",
    formulaType: "percentage",
    formulaExpression: "(accountsWithAI / totalActiveAccounts) * 100",
    weight: 10,
    benchmarkTarget: 65,
    benchmarkUnit: "%",
    warningThreshold: 10,
    criticalThreshold: 20,
    visibilityRoles: ["all"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["adoption", "ai", "product"],
  },
  {
    id: "kpi-pipeline-growth",
    name: "Pipeline Growth",
    category: "Pipeline",
    description:
      "YoY percentage growth in qualified pipeline value across the operational territory.",
    formulaType: "growth_rate",
    formulaExpression:
      "((currentPipeline - priorYearPipeline) / priorYearPipeline) * 100",
    weight: 15,
    benchmarkTarget: 25,
    benchmarkUnit: "%",
    warningThreshold: 8,
    criticalThreshold: 15,
    visibilityRoles: ["all", "sales_manager", "leadership"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["pipeline", "growth", "core"],
  },
  {
    id: "kpi-mdf-roi",
    name: "MDF ROI",
    category: "Marketing",
    description:
      "Return on Market Development Funds — revenue attributed per £1 of MDF invested.",
    formulaType: "ratio",
    formulaExpression: "attributedRevenue / mdfInvested",
    weight: 8,
    benchmarkTarget: 3.5,
    benchmarkUnit: "x",
    warningThreshold: 15,
    criticalThreshold: 30,
    visibilityRoles: ["marketing", "leadership", "finance"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["marketing", "mdf", "roi"],
  },
  {
    id: "kpi-forecast-accuracy",
    name: "Forecast Accuracy",
    category: "Forecasting",
    description:
      "Accuracy of quarterly revenue forecasts against final actuals — reflects operational predictability.",
    formulaType: "percentage",
    formulaExpression:
      "100 - abs((forecastedRevenue - actualRevenue) / actualRevenue * 100)",
    weight: 12,
    benchmarkTarget: 90,
    benchmarkUnit: "%",
    warningThreshold: 5,
    criticalThreshold: 10,
    visibilityRoles: ["leadership", "sales_manager", "finance", "operations"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["forecasting", "accuracy", "governance"],
  },
  {
    id: "kpi-opportunity-velocity",
    name: "Opportunity Velocity",
    category: "Pipeline",
    description:
      "Average number of days from opportunity creation to Closed Won. Lower is better.",
    formulaType: "average",
    formulaExpression: "avg(closedWonDate - createdDate) in days",
    weight: 8,
    benchmarkTarget: 42,
    benchmarkUnit: "days",
    warningThreshold: 15,
    criticalThreshold: 30,
    visibilityRoles: ["all", "sales_manager", "leadership", "operations"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["pipeline", "velocity", "efficiency"],
  },
  {
    id: "kpi-reseller-growth",
    name: "Reseller Growth",
    category: "Growth",
    description:
      "YoY revenue growth generated through the reseller partner tier.",
    formulaType: "growth_rate",
    formulaExpression:
      "((currentResellerRevenue - priorYearResellerRevenue) / priorYearResellerRevenue) * 100",
    weight: 7,
    benchmarkTarget: 18,
    benchmarkUnit: "%",
    warningThreshold: 8,
    criticalThreshold: 15,
    visibilityRoles: ["leadership", "sales_manager", "operations"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["growth", "reseller", "partner"],
  },
  {
    id: "kpi-distributor-activation",
    name: "Distributor Activation",
    category: "Growth",
    description:
      "Percentage of contracted Distributors with at least one closed transaction in the current period.",
    formulaType: "percentage",
    formulaExpression: "(activeDistributors / contractedDistributors) * 100",
    weight: 5,
    benchmarkTarget: 80,
    benchmarkUnit: "%",
    warningThreshold: 10,
    criticalThreshold: 20,
    visibilityRoles: ["leadership", "operations"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["distributor", "activation", "partner"],
  },
  {
    id: "kpi-customer-expansion",
    name: "Customer Expansion",
    category: "Revenue",
    description:
      "Total upsell and cross-sell revenue from existing customer accounts within the period.",
    formulaType: "attainment",
    formulaExpression: "(expansionRevenue / expansionTarget) * 100",
    weight: 3,
    benchmarkTarget: 0.8,
    benchmarkUnit: "£M",
    warningThreshold: 15,
    criticalThreshold: 25,
    visibilityRoles: ["all", "sales_rep", "sales_manager", "leadership"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["revenue", "expansion", "upsell"],
  },
  {
    id: "kpi-quote-conversion",
    name: "Quote Conversion",
    category: "Pipeline",
    description:
      "Percentage of submitted quotes that convert to Closed Won opportunities within 90 days.",
    formulaType: "percentage",
    formulaExpression: "(closedWonFromQuotes / totalQuotesSubmitted) * 100",
    weight: 2,
    benchmarkTarget: 38,
    benchmarkUnit: "%",
    warningThreshold: 10,
    criticalThreshold: 20,
    visibilityRoles: ["all", "sales_rep", "sales_manager"],
    isEnabled: true,
    isDefault: true,
    ownerId: "admin",
    createdAt: "2024-10-01T00:00:00Z",
    updatedAt: "2025-01-15T09:00:00Z",
    version: 1,
    tags: ["pipeline", "quotes", "conversion"],
  },
];

// ─── Seeded Data Points (50+) ─────────────────────────────────────────────────

const TERRITORIES = [
  "UK&I",
  "Nordics",
  "DACH",
  "Benelux",
  "Southern Europe",
] as const;

const DEFAULT_DATA_POINTS: KPIDataPoint[] = [
  // ── Renewal Revenue ─────────────────────────────────────────────────────────
  {
    kpiId: "kpi-renewal-revenue",
    period: "2024-Q4",
    actualValue: 2.61,
    targetValue: 2.75,
    forecastValue: 2.58,
    priorYearValue: 2.2,
    yoyGrowthExpected: 25,
    yoyGrowthActual: 18.6,
    yoyGrowthForecast: 17.3,
    yoyVariance: -6.4,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-renewal-revenue",
    period: "2025-Q1",
    actualValue: 2.88,
    targetValue: 2.9,
    forecastValue: 2.92,
    priorYearValue: 2.4,
    yoyGrowthExpected: 25,
    yoyGrowthActual: 20.0,
    yoyGrowthForecast: 21.7,
    yoyVariance: -5.0,
    status: "ahead",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-renewal-revenue",
    period: "2024-Q4",
    actualValue: 0.72,
    targetValue: 0.85,
    forecastValue: 0.74,
    priorYearValue: 0.65,
    yoyGrowthExpected: 30,
    yoyGrowthActual: 10.8,
    yoyGrowthForecast: 13.8,
    yoyVariance: -19.2,
    status: "growth_risk",
    territory: "Nordics",
    orgType: "distributor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-renewal-revenue",
    period: "2025-Q1",
    actualValue: 0.78,
    targetValue: 0.88,
    forecastValue: 0.81,
    priorYearValue: 0.68,
    yoyGrowthExpected: 30,
    yoyGrowthActual: 14.7,
    yoyGrowthForecast: 19.1,
    yoyVariance: -15.3,
    status: "growth_risk",
    territory: "Nordics",
    orgType: "distributor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-renewal-revenue",
    period: "2025-Q1",
    actualValue: 1.12,
    targetValue: 1.05,
    forecastValue: 1.14,
    priorYearValue: 0.88,
    yoyGrowthExpected: 20,
    yoyGrowthActual: 27.3,
    yoyGrowthForecast: 29.5,
    yoyVariance: 7.3,
    status: "exceeding",
    territory: "DACH",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── AI Adoption ──────────────────────────────────────────────────────────────
  {
    kpiId: "kpi-ai-adoption",
    period: "2024-Q4",
    actualValue: 61.4,
    targetValue: 65,
    forecastValue: 62.0,
    priorYearValue: 48,
    yoyGrowthExpected: 35,
    yoyGrowthActual: 27.9,
    yoyGrowthForecast: 29.2,
    yoyVariance: -7.1,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-ai-adoption",
    period: "2025-Q1",
    actualValue: 63.8,
    targetValue: 65,
    forecastValue: 64.5,
    priorYearValue: 51,
    yoyGrowthExpected: 35,
    yoyGrowthActual: 25.1,
    yoyGrowthForecast: 26.5,
    yoyVariance: -9.9,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-ai-adoption",
    period: "2024-Q4",
    actualValue: 38.2,
    targetValue: 65,
    forecastValue: 41.0,
    priorYearValue: 30,
    yoyGrowthExpected: 35,
    yoyGrowthActual: 27.3,
    yoyGrowthForecast: 36.7,
    yoyVariance: -7.7,
    status: "underperforming",
    territory: "Southern Europe",
    orgType: "reseller",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-ai-adoption",
    period: "2025-Q1",
    actualValue: 42.5,
    targetValue: 65,
    forecastValue: 46.0,
    priorYearValue: 33,
    yoyGrowthExpected: 35,
    yoyGrowthActual: 28.8,
    yoyGrowthForecast: 39.4,
    yoyVariance: -6.2,
    status: "underperforming",
    territory: "Southern Europe",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-ai-adoption",
    period: "2025-Q1",
    actualValue: 69.2,
    targetValue: 65,
    forecastValue: 70.1,
    priorYearValue: 54,
    yoyGrowthExpected: 35,
    yoyGrowthActual: 28.1,
    yoyGrowthForecast: 29.8,
    yoyVariance: -6.9,
    status: "exceeding",
    territory: "DACH",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── Pipeline Growth ──────────────────────────────────────────────────────────
  {
    kpiId: "kpi-pipeline-growth",
    period: "2024-Q4",
    actualValue: 22.1,
    targetValue: 25,
    forecastValue: 23.5,
    priorYearValue: 18.2,
    yoyGrowthExpected: 25,
    yoyGrowthActual: 21.4,
    yoyGrowthForecast: 29.1,
    yoyVariance: -3.6,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-pipeline-growth",
    period: "2025-Q1",
    actualValue: 24.8,
    targetValue: 25,
    forecastValue: 25.2,
    priorYearValue: 19.6,
    yoyGrowthExpected: 25,
    yoyGrowthActual: 26.5,
    yoyGrowthForecast: 28.6,
    yoyVariance: 1.5,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-pipeline-growth",
    period: "2024-Q4",
    actualValue: 11.3,
    targetValue: 25,
    forecastValue: 13.8,
    priorYearValue: 10.1,
    yoyGrowthExpected: 25,
    yoyGrowthActual: 11.9,
    yoyGrowthForecast: 36.6,
    yoyVariance: -13.1,
    status: "underperforming",
    territory: "Southern Europe",
    orgType: "reseller",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-pipeline-growth",
    period: "2025-Q1",
    actualValue: 26.4,
    targetValue: 25,
    forecastValue: 26.9,
    priorYearValue: 20.8,
    yoyGrowthExpected: 25,
    yoyGrowthActual: 26.9,
    yoyGrowthForecast: 29.3,
    yoyVariance: 1.9,
    status: "ahead",
    territory: "Benelux",
    orgType: "distributor",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── MDF ROI ──────────────────────────────────────────────────────────────────
  {
    kpiId: "kpi-mdf-roi",
    period: "2024-Q4",
    actualValue: 3.6,
    targetValue: 3.5,
    forecastValue: 3.55,
    priorYearValue: 3.1,
    yoyGrowthExpected: 13,
    yoyGrowthActual: 16.1,
    yoyGrowthForecast: 14.5,
    yoyVariance: 3.1,
    status: "ahead",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-mdf-roi",
    period: "2025-Q1",
    actualValue: 2.8,
    targetValue: 3.5,
    forecastValue: 2.95,
    priorYearValue: 3.0,
    yoyGrowthExpected: 17,
    yoyGrowthActual: -6.7,
    yoyGrowthForecast: -1.7,
    yoyVariance: -23.7,
    status: "growth_risk",
    territory: "Nordics",
    orgType: "distributor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-mdf-roi",
    period: "2024-Q4",
    actualValue: 2.3,
    targetValue: 3.5,
    forecastValue: 2.4,
    priorYearValue: 2.8,
    yoyGrowthExpected: 25,
    yoyGrowthActual: -17.9,
    yoyGrowthForecast: -14.3,
    yoyVariance: -42.9,
    status: "underperforming",
    territory: "Southern Europe",
    orgType: "reseller",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-mdf-roi",
    period: "2025-Q1",
    actualValue: 3.9,
    targetValue: 3.5,
    forecastValue: 3.95,
    priorYearValue: 3.2,
    yoyGrowthExpected: 13,
    yoyGrowthActual: 21.9,
    yoyGrowthForecast: 23.4,
    yoyVariance: 8.9,
    status: "exceeding",
    territory: "DACH",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── Forecast Accuracy ────────────────────────────────────────────────────────
  {
    kpiId: "kpi-forecast-accuracy",
    period: "2024-Q4",
    actualValue: 88.4,
    targetValue: 90,
    forecastValue: 88.8,
    priorYearValue: 85.2,
    yoyGrowthExpected: 5,
    yoyGrowthActual: 3.8,
    yoyGrowthForecast: 4.2,
    yoyVariance: -1.2,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-forecast-accuracy",
    period: "2025-Q1",
    actualValue: 91.2,
    targetValue: 90,
    forecastValue: 91.5,
    priorYearValue: 86.0,
    yoyGrowthExpected: 5,
    yoyGrowthActual: 6.0,
    yoyGrowthForecast: 6.4,
    yoyVariance: 1.0,
    status: "exceeding",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-forecast-accuracy",
    period: "2025-Q1",
    actualValue: 87.3,
    targetValue: 90,
    forecastValue: 88.0,
    priorYearValue: 84.0,
    yoyGrowthExpected: 7,
    yoyGrowthActual: 3.9,
    yoyGrowthForecast: 4.8,
    yoyVariance: -3.1,
    status: "on_track",
    territory: "Nordics",
    orgType: "distributor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-forecast-accuracy",
    period: "2025-Q1",
    actualValue: 92.8,
    targetValue: 90,
    forecastValue: 93.1,
    priorYearValue: 87.5,
    yoyGrowthExpected: 5,
    yoyGrowthActual: 6.1,
    yoyGrowthForecast: 6.4,
    yoyVariance: 1.1,
    status: "exceeding",
    territory: "DACH",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── Opportunity Velocity ─────────────────────────────────────────────────────
  // Lower is better — exceeding means we beat the target day count
  {
    kpiId: "kpi-opportunity-velocity",
    period: "2024-Q4",
    actualValue: 44.2,
    targetValue: 42,
    forecastValue: 43.8,
    priorYearValue: 51,
    yoyGrowthExpected: -17.6,
    yoyGrowthActual: -13.3,
    yoyGrowthForecast: -14.1,
    yoyVariance: 4.3,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-opportunity-velocity",
    period: "2025-Q1",
    actualValue: 37.6,
    targetValue: 42,
    forecastValue: 38.2,
    priorYearValue: 50,
    yoyGrowthExpected: -16,
    yoyGrowthActual: -24.8,
    yoyGrowthForecast: -23.6,
    yoyVariance: 8.8,
    status: "exceeding",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-opportunity-velocity",
    period: "2025-Q1",
    actualValue: 55.3,
    targetValue: 42,
    forecastValue: 53.0,
    priorYearValue: 58,
    yoyGrowthExpected: -27.6,
    yoyGrowthActual: -4.7,
    yoyGrowthForecast: -8.6,
    yoyVariance: -22.9,
    status: "underperforming",
    territory: "Southern Europe",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-opportunity-velocity",
    period: "2025-Q1",
    actualValue: 39.1,
    targetValue: 42,
    forecastValue: 39.5,
    priorYearValue: 47,
    yoyGrowthExpected: -10.6,
    yoyGrowthActual: -16.8,
    yoyGrowthForecast: -15.9,
    yoyVariance: 6.2,
    status: "ahead",
    territory: "Benelux",
    orgType: "distributor",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── Reseller Growth ──────────────────────────────────────────────────────────
  {
    kpiId: "kpi-reseller-growth",
    period: "2024-Q4",
    actualValue: 14.2,
    targetValue: 18,
    forecastValue: 15.0,
    priorYearValue: 12.1,
    yoyGrowthExpected: 18,
    yoyGrowthActual: 17.4,
    yoyGrowthForecast: 23.9,
    yoyVariance: -0.6,
    status: "growth_risk",
    territory: "Nordics",
    orgType: "reseller",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-reseller-growth",
    period: "2025-Q1",
    actualValue: 16.8,
    targetValue: 18,
    forecastValue: 17.4,
    priorYearValue: 13.8,
    yoyGrowthExpected: 18,
    yoyGrowthActual: 21.7,
    yoyGrowthForecast: 26.1,
    yoyVariance: 3.7,
    status: "on_track",
    territory: "UK&I",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-reseller-growth",
    period: "2025-Q1",
    actualValue: 11.4,
    targetValue: 18,
    forecastValue: 12.2,
    priorYearValue: 10.8,
    yoyGrowthExpected: 18,
    yoyGrowthActual: 5.6,
    yoyGrowthForecast: 13.0,
    yoyVariance: -12.4,
    status: "underperforming",
    territory: "Southern Europe",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-reseller-growth",
    period: "2025-Q1",
    actualValue: 21.3,
    targetValue: 18,
    forecastValue: 21.8,
    priorYearValue: 16.5,
    yoyGrowthExpected: 18,
    yoyGrowthActual: 29.1,
    yoyGrowthForecast: 32.1,
    yoyVariance: 11.1,
    status: "exceeding",
    territory: "DACH",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── Distributor Activation ───────────────────────────────────────────────────
  {
    kpiId: "kpi-distributor-activation",
    period: "2024-Q4",
    actualValue: 64.0,
    targetValue: 80,
    forecastValue: 66.5,
    priorYearValue: 70,
    yoyGrowthExpected: 14.3,
    yoyGrowthActual: -8.6,
    yoyGrowthForecast: -5.0,
    yoyVariance: -22.9,
    status: "underperforming",
    territory: "Nordics",
    orgType: "distributor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-distributor-activation",
    period: "2025-Q1",
    actualValue: 84.3,
    targetValue: 80,
    forecastValue: 85.0,
    priorYearValue: 72,
    yoyGrowthExpected: 11.1,
    yoyGrowthActual: 17.1,
    yoyGrowthForecast: 18.1,
    yoyVariance: 6.0,
    status: "exceeding",
    territory: "DACH",
    orgType: "distributor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-distributor-activation",
    period: "2025-Q1",
    actualValue: 82.1,
    targetValue: 80,
    forecastValue: 82.5,
    priorYearValue: 74,
    yoyGrowthExpected: 8.1,
    yoyGrowthActual: 10.9,
    yoyGrowthForecast: 11.5,
    yoyVariance: 2.8,
    status: "ahead",
    territory: "Benelux",
    orgType: "distributor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-distributor-activation",
    period: "2025-Q1",
    actualValue: 58.6,
    targetValue: 80,
    forecastValue: 61.0,
    priorYearValue: 62,
    yoyGrowthExpected: 29,
    yoyGrowthActual: -5.5,
    yoyGrowthForecast: -1.6,
    yoyVariance: -34.5,
    status: "underperforming",
    territory: "Southern Europe",
    orgType: "distributor",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── Customer Expansion ───────────────────────────────────────────────────────
  {
    kpiId: "kpi-customer-expansion",
    period: "2024-Q4",
    actualValue: 0.74,
    targetValue: 0.8,
    forecastValue: 0.76,
    priorYearValue: 0.58,
    yoyGrowthExpected: 37.9,
    yoyGrowthActual: 27.6,
    yoyGrowthForecast: 31.0,
    yoyVariance: -10.3,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-customer-expansion",
    period: "2025-Q1",
    actualValue: 0.96,
    targetValue: 0.8,
    forecastValue: 0.97,
    priorYearValue: 0.62,
    yoyGrowthExpected: 29,
    yoyGrowthActual: 54.8,
    yoyGrowthForecast: 56.5,
    yoyVariance: 25.8,
    status: "exceeding",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-customer-expansion",
    period: "2025-Q1",
    actualValue: 0.88,
    targetValue: 0.8,
    forecastValue: 0.89,
    priorYearValue: 0.68,
    yoyGrowthExpected: 17.6,
    yoyGrowthActual: 29.4,
    yoyGrowthForecast: 30.9,
    yoyVariance: 11.8,
    status: "exceeding",
    territory: "DACH",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-customer-expansion",
    period: "2025-Q1",
    actualValue: 0.41,
    targetValue: 0.8,
    forecastValue: 0.44,
    priorYearValue: 0.48,
    yoyGrowthExpected: 66.7,
    yoyGrowthActual: -14.6,
    yoyGrowthForecast: -8.3,
    yoyVariance: -81.3,
    status: "underperforming",
    territory: "Southern Europe",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },

  // ── Quote Conversion ─────────────────────────────────────────────────────────
  {
    kpiId: "kpi-quote-conversion",
    period: "2024-Q4",
    actualValue: 35.8,
    targetValue: 38,
    forecastValue: 36.5,
    priorYearValue: 32.1,
    yoyGrowthExpected: 18.4,
    yoyGrowthActual: 11.5,
    yoyGrowthForecast: 13.7,
    yoyVariance: -6.9,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    kpiId: "kpi-quote-conversion",
    period: "2025-Q1",
    actualValue: 37.2,
    targetValue: 38,
    forecastValue: 37.8,
    priorYearValue: 33.4,
    yoyGrowthExpected: 18.4,
    yoyGrowthActual: 11.4,
    yoyGrowthForecast: 13.2,
    yoyVariance: -7.0,
    status: "on_track",
    territory: "UK&I",
    orgType: "vendor",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-quote-conversion",
    period: "2025-Q1",
    actualValue: 28.6,
    targetValue: 38,
    forecastValue: 30.2,
    priorYearValue: 31.0,
    yoyGrowthExpected: 22.6,
    yoyGrowthActual: -7.7,
    yoyGrowthForecast: -2.6,
    yoyVariance: -30.3,
    status: "underperforming",
    territory: "Nordics",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },
  {
    kpiId: "kpi-quote-conversion",
    period: "2025-Q1",
    actualValue: 41.4,
    targetValue: 38,
    forecastValue: 41.8,
    priorYearValue: 35.2,
    yoyGrowthExpected: 7.9,
    yoyGrowthActual: 17.6,
    yoyGrowthForecast: 18.8,
    yoyVariance: 9.7,
    status: "exceeding",
    territory: "DACH",
    orgType: "reseller",
    updatedAt: "2025-04-10T08:00:00Z",
  },
];

// ─── Seeded Audit Entries ─────────────────────────────────────────────────────

const DEFAULT_AUDIT_ENTRIES: KPIAuditEntry[] = [
  {
    id: "audit-001",
    kpiId: "kpi-renewal-revenue",
    kpiName: "Renewal Revenue",
    changeType: "created",
    changedBy: "James Harrington",
    changedAt: "2024-10-01T09:15:00Z",
    notes: "Initial KPI framework seeded for Q4 2024 rollout.",
  },
  {
    id: "audit-002",
    kpiId: "kpi-ai-adoption",
    kpiName: "AI Adoption",
    changeType: "created",
    changedBy: "James Harrington",
    changedAt: "2024-10-01T09:16:00Z",
    notes: "New KPI added to track AI workflow activation across partner tier.",
  },
  {
    id: "audit-003",
    kpiId: "kpi-pipeline-growth",
    kpiName: "Pipeline Growth",
    changeType: "weight_changed",
    changedBy: "Rachel Chen",
    changedAt: "2024-10-18T14:22:00Z",
    previousValue: "10%",
    newValue: "15%",
    notes:
      "Weight increased following quarterly review — pipeline now a strategic priority.",
  },
  {
    id: "audit-004",
    kpiId: "kpi-mdf-roi",
    kpiName: "MDF ROI",
    changeType: "formula_changed",
    changedBy: "Rachel Chen",
    changedAt: "2024-11-05T10:44:00Z",
    previousValue: "totalRevenue / mdfSpend",
    newValue: "attributedRevenue / mdfInvested",
    notes:
      "Formula updated to reflect attributed revenue model vs gross revenue.",
  },
  {
    id: "audit-005",
    kpiId: "kpi-forecast-accuracy",
    kpiName: "Forecast Accuracy",
    changeType: "updated",
    changedBy: "James Harrington",
    changedAt: "2024-11-12T16:30:00Z",
    previousValue: "benchmark: 88%",
    newValue: "benchmark: 90%",
    notes:
      "Benchmark raised following operational review — 90% now the governance standard.",
  },
  {
    id: "audit-006",
    kpiId: "kpi-opportunity-velocity",
    kpiName: "Opportunity Velocity",
    changeType: "updated",
    changedBy: "Sarah Mitchell",
    changedAt: "2024-11-20T09:00:00Z",
    previousValue: "benchmark: 45 days",
    newValue: "benchmark: 42 days",
    notes: "Target improved following territory optimisation in UK&I and DACH.",
  },
  {
    id: "audit-007",
    kpiId: "kpi-reseller-growth",
    kpiName: "Reseller Growth",
    changeType: "weight_changed",
    changedBy: "James Harrington",
    changedAt: "2024-12-02T11:15:00Z",
    previousValue: "10%",
    newValue: "7%",
    notes: "Weight reduced to reflect revised channel mix strategy for 2025.",
  },
  {
    id: "audit-008",
    kpiId: "kpi-distributor-activation",
    kpiName: "Distributor Activation",
    changeType: "updated",
    changedBy: "Rachel Chen",
    changedAt: "2024-12-10T14:55:00Z",
    previousValue: "warningThreshold: 15%",
    newValue: "warningThreshold: 10%",
    notes:
      "Tightened warning threshold — early detection of activation gaps is operationally critical.",
  },
  {
    id: "audit-009",
    kpiId: "kpi-customer-expansion",
    kpiName: "Customer Expansion",
    changeType: "enabled",
    changedBy: "James Harrington",
    changedAt: "2024-12-15T08:30:00Z",
    notes: "KPI re-enabled for Q1 2025 following successful pilot in UK&I.",
  },
  {
    id: "audit-010",
    kpiId: "kpi-quote-conversion",
    kpiName: "Quote Conversion",
    changeType: "created",
    changedBy: "Rachel Chen",
    changedAt: "2024-10-01T09:20:00Z",
    notes:
      "Quote Conversion KPI introduced to link pricing workflow to revenue outcomes.",
  },
  {
    id: "audit-011",
    kpiId: "kpi-ai-adoption",
    kpiName: "AI Adoption",
    changeType: "updated",
    changedBy: "Sarah Mitchell",
    changedAt: "2025-01-08T10:00:00Z",
    previousValue: "benchmark: 60%",
    newValue: "benchmark: 65%",
    notes:
      "Adoption benchmark raised following strong H2 2024 performance across Vendor tier.",
  },
  {
    id: "audit-012",
    kpiId: "kpi-mdf-roi",
    kpiName: "MDF ROI",
    changeType: "updated",
    changedBy: "Rachel Chen",
    changedAt: "2025-01-15T13:40:00Z",
    previousValue: "benchmark: 3.2x",
    newValue: "benchmark: 3.5x",
    notes: "Benchmark updated for 2025 — Nordics exception noted.",
  },
  {
    id: "audit-013",
    kpiId: "kpi-pipeline-growth",
    kpiName: "Pipeline Growth",
    changeType: "updated",
    changedBy: "James Harrington",
    changedAt: "2025-02-01T09:00:00Z",
    previousValue: "criticalThreshold: 20%",
    newValue: "criticalThreshold: 15%",
    notes:
      "Critical threshold tightened to give earlier warning of underperformance in growth KPIs.",
  },
  {
    id: "audit-014",
    kpiId: "kpi-renewal-revenue",
    kpiName: "Renewal Revenue",
    changeType: "weight_changed",
    changedBy: "James Harrington",
    changedAt: "2025-02-14T11:20:00Z",
    previousValue: "25%",
    newValue: "30%",
    notes:
      "Renewal Revenue weight increased to 30% — board directive for FY2025.",
  },
  {
    id: "audit-015",
    kpiId: "kpi-reseller-growth",
    kpiName: "Reseller Growth",
    changeType: "updated",
    changedBy: "Rachel Chen",
    changedAt: "2025-03-01T10:30:00Z",
    previousValue: "territory: all",
    newValue: "UK&I recovery plan applied",
    notes:
      "Territory weighting adjusted following Q4 underperformance in Nordics reseller tier.",
  },
  {
    id: "audit-016",
    kpiId: "kpi-distributor-activation",
    kpiName: "Distributor Activation",
    changeType: "updated",
    changedBy: "Sarah Mitchell",
    changedAt: "2025-03-15T14:00:00Z",
    previousValue: "benchmark: 75%",
    newValue: "benchmark: 80%",
    notes:
      "Activation target raised following DACH success — global benchmark now 80%.",
  },
  {
    id: "audit-017",
    kpiId: "kpi-forecast-accuracy",
    kpiName: "Forecast Accuracy",
    changeType: "updated",
    changedBy: "James Harrington",
    changedAt: "2025-04-01T09:30:00Z",
    previousValue: "visibilityRoles: leadership",
    newValue: "visibilityRoles: leadership, sales_manager, finance, operations",
    notes:
      "Visibility extended — forecast accuracy now shared with Sales Ops and Finance for governance alignment.",
  },
  {
    id: "audit-018",
    kpiId: "kpi-opportunity-velocity",
    kpiName: "Opportunity Velocity",
    changeType: "formula_changed",
    changedBy: "Rachel Chen",
    changedAt: "2025-04-05T15:10:00Z",
    previousValue: "mean(closedDate - createdDate)",
    newValue: "avg(closedWonDate - createdDate) in days",
    notes:
      "Formula clarified to use closedWonDate only — excludes lost opportunities from velocity calculation.",
  },
  {
    id: "audit-019",
    kpiId: "kpi-customer-expansion",
    kpiName: "Customer Expansion",
    changeType: "weight_changed",
    changedBy: "James Harrington",
    changedAt: "2025-04-08T10:00:00Z",
    previousValue: "5%",
    newValue: "3%",
    notes:
      "Weight reduced — expansion KPI re-scoped to enterprise tier only for Q2 2025.",
  },
  {
    id: "audit-020",
    kpiId: "kpi-quote-conversion",
    kpiName: "Quote Conversion",
    changeType: "updated",
    changedBy: "Sarah Mitchell",
    changedAt: "2025-04-10T11:45:00Z",
    previousValue: "benchmark: 35%",
    newValue: "benchmark: 38%",
    notes:
      "Benchmark raised following DACH pilot results — 38% is now the operational standard.",
  },
];

// ─── Seeded ForgeAI Insights ──────────────────────────────────────────────────

const DEFAULT_FORGE_INSIGHTS: KPIForgeInsight[] = [
  {
    id: "fi-001",
    type: "territory_trend",
    kpiId: "kpi-pipeline-growth",
    kpiName: "Pipeline Growth",
    message:
      "Nordics trending below YoY expectation for Pipeline Growth. Current trajectory suggests an 8% shortfall against Q1 2025 target.",
    territory: "Nordics",
    severity: "warning",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:00:00Z",
  },
  {
    id: "fi-002",
    type: "trending_up",
    kpiId: "kpi-renewal-revenue",
    kpiName: "Renewal Revenue",
    message:
      "Renewal Revenue improving month-over-month in UK&I territories. Current attainment at 99.3% of target — on track to exceed Q1 benchmark.",
    territory: "UK&I",
    severity: "positive",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:05:00Z",
  },
  {
    id: "fi-003",
    type: "momentum",
    kpiId: "kpi-ai-adoption",
    kpiName: "AI Adoption",
    message:
      "AI Adoption stabilizing across reseller group after Q4 2024 dip. DACH and UK&I showing consistent upward movement — Southern Europe remains the primary gap.",
    severity: "info",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:10:00Z",
  },
  {
    id: "fi-004",
    type: "underperformance_warning",
    kpiId: "kpi-opportunity-velocity",
    kpiName: "Opportunity Velocity",
    message:
      "Deal registration conversion slowing in Tier 1 territories — Opportunity Velocity metric flagged. Southern Europe averaging 55 days vs 42-day benchmark.",
    territory: "Southern Europe",
    severity: "warning",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:15:00Z",
  },
  {
    id: "fi-005",
    type: "trending_up",
    kpiId: "kpi-forecast-accuracy",
    kpiName: "Forecast Accuracy",
    message:
      "Forecast Accuracy improving across the reseller group — now at 91.2% vs 88.4% last quarter. Consistent with improved pipeline qualification discipline.",
    severity: "positive",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:20:00Z",
  },
  {
    id: "fi-006",
    type: "yoy_variance",
    kpiId: "kpi-mdf-roi",
    kpiName: "MDF ROI",
    message:
      "MDF ROI variance detected in Nordics — currently tracking at 2.8x vs 3.5x benchmark. YoY variance of -23.7% suggests a structural change in campaign attribution.",
    territory: "Nordics",
    severity: "warning",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:25:00Z",
  },
  {
    id: "fi-007",
    type: "growth_acceleration",
    kpiId: "kpi-distributor-activation",
    kpiName: "Distributor Activation",
    message:
      "Distributor Activation accelerating in DACH and Benelux — ahead of YoY targets. DACH at 84.3% activated vs 80% benchmark; Benelux at 82.1%.",
    territory: "DACH",
    severity: "positive",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:30:00Z",
  },
  {
    id: "fi-008",
    type: "territory_trend",
    kpiId: "kpi-pipeline-growth",
    kpiName: "Pipeline Growth",
    message:
      "Pipeline Growth on track nationally; Southern Europe showing below-benchmark progression at 11.3% vs 25% target. Intervention recommended before end of Q2.",
    territory: "Southern Europe",
    severity: "warning",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:35:00Z",
  },
  {
    id: "fi-009",
    type: "trending_up",
    kpiId: "kpi-reseller-growth",
    kpiName: "Reseller Growth",
    message:
      "Reseller Growth momentum improving in UK&I after territory realignment. Q1 2025 performance at 16.8% vs 18% target — closing the gap from Q4 2024.",
    territory: "UK&I",
    severity: "info",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:40:00Z",
  },
  {
    id: "fi-010",
    type: "growth_acceleration",
    kpiId: "kpi-customer-expansion",
    kpiName: "Customer Expansion",
    message:
      "Customer Expansion rate exceeding YoY expectation across enterprise tier. UK&I and DACH both delivering above benchmark — expansion pipeline remains healthy.",
    severity: "positive",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:45:00Z",
  },
  {
    id: "fi-011",
    type: "trending_down",
    kpiId: "kpi-reseller-growth",
    kpiName: "Reseller Growth",
    message:
      "Reseller Growth in Southern Europe showing continued underperformance — 11.4% against an 18% target. Three consecutive quarters below benchmark.",
    territory: "Southern Europe",
    severity: "critical",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:50:00Z",
  },
  {
    id: "fi-012",
    type: "forecast_movement",
    kpiId: "kpi-renewal-revenue",
    kpiName: "Renewal Revenue",
    message:
      "Renewal performance stabilizing across distributed reseller tier. Forecasts for Q2 2025 suggest continued improvement — risk concentrated in Nordics distributor segment.",
    severity: "info",
    period: "2025-Q1",
    createdAt: "2025-04-11T08:55:00Z",
  },
  {
    id: "fi-013",
    type: "underperformance_warning",
    kpiId: "kpi-distributor-activation",
    kpiName: "Distributor Activation",
    message:
      "Distributor Activation remains critically low in Southern Europe at 58.6% — 21.4 percentage points below the 80% global benchmark. Root cause analysis recommended.",
    territory: "Southern Europe",
    severity: "critical",
    period: "2025-Q1",
    createdAt: "2025-04-11T09:00:00Z",
  },
  {
    id: "fi-014",
    type: "yoy_variance",
    kpiId: "kpi-opportunity-velocity",
    kpiName: "Opportunity Velocity",
    message:
      "Opportunity Velocity improving beyond expectations in UK&I — average deal cycle now 37.6 days, beating the 42-day benchmark and improving 24.8% YoY.",
    territory: "UK&I",
    severity: "positive",
    period: "2025-Q1",
    createdAt: "2025-04-11T09:05:00Z",
  },
  {
    id: "fi-015",
    type: "trending_up",
    kpiId: "kpi-mdf-roi",
    kpiName: "MDF ROI",
    message:
      "MDF ROI outperforming in DACH — 3.9x return against 3.5x benchmark. Campaign attribution model showing strong results from Q1 partner engagement programs.",
    territory: "DACH",
    severity: "positive",
    period: "2025-Q1",
    createdAt: "2025-04-11T09:10:00Z",
  },
  {
    id: "fi-016",
    type: "underperformance_warning",
    kpiId: "kpi-ai-adoption",
    kpiName: "AI Adoption",
    message:
      "AI Adoption in Southern Europe continues to lag — at 42.5% vs 65% target. Reseller enablement gap identified as likely driver. Recommended action: targeted AI onboarding campaign.",
    territory: "Southern Europe",
    severity: "critical",
    period: "2025-Q1",
    createdAt: "2025-04-11T09:15:00Z",
  },
  {
    id: "fi-017",
    type: "momentum",
    kpiId: "kpi-quote-conversion",
    kpiName: "Quote Conversion",
    message:
      "Quote Conversion momentum improving in DACH — 41.4% conversion rate exceeds the 38% benchmark. Pricing strategy alignment showing positive commercial outcomes.",
    territory: "DACH",
    severity: "positive",
    period: "2025-Q1",
    createdAt: "2025-04-11T09:20:00Z",
  },
];

// ─── Role → KPI Visibility Map ────────────────────────────────────────────────

const ROLE_KPI_MAP: Record<string, string[]> = {
  sales_rep: [
    "kpi-renewal-revenue",
    "kpi-pipeline-growth",
    "kpi-opportunity-velocity",
    "kpi-quote-conversion",
    "kpi-customer-expansion",
  ],
  account_manager: [
    "kpi-renewal-revenue",
    "kpi-customer-expansion",
    "kpi-opportunity-velocity",
    "kpi-pipeline-growth",
  ],
  renewal_specialist: [
    "kpi-renewal-revenue",
    "kpi-forecast-accuracy",
    "kpi-customer-expansion",
  ],
  bdr: [
    "kpi-pipeline-growth",
    "kpi-opportunity-velocity",
    "kpi-quote-conversion",
  ],
  sales_manager: [
    "kpi-renewal-revenue",
    "kpi-pipeline-growth",
    "kpi-opportunity-velocity",
    "kpi-forecast-accuracy",
    "kpi-reseller-growth",
    "kpi-quote-conversion",
  ],
  leadership: [
    "kpi-renewal-revenue",
    "kpi-ai-adoption",
    "kpi-pipeline-growth",
    "kpi-mdf-roi",
    "kpi-forecast-accuracy",
    "kpi-opportunity-velocity",
    "kpi-reseller-growth",
    "kpi-distributor-activation",
    "kpi-customer-expansion",
    "kpi-quote-conversion",
  ],
  marketing: [
    "kpi-mdf-roi",
    "kpi-ai-adoption",
    "kpi-pipeline-growth",
    "kpi-reseller-growth",
    "kpi-distributor-activation",
  ],
  finance: [
    "kpi-renewal-revenue",
    "kpi-mdf-roi",
    "kpi-forecast-accuracy",
    "kpi-customer-expansion",
  ],
  sales_ops: [
    "kpi-pipeline-growth",
    "kpi-opportunity-velocity",
    "kpi-forecast-accuracy",
    "kpi-quote-conversion",
    "kpi-reseller-growth",
    "kpi-distributor-activation",
  ],
  deal_desk: [
    "kpi-quote-conversion",
    "kpi-opportunity-velocity",
    "kpi-pipeline-growth",
  ],
  customer_success: [
    "kpi-renewal-revenue",
    "kpi-ai-adoption",
    "kpi-customer-expansion",
  ],
  partner_marketing: [
    "kpi-mdf-roi",
    "kpi-reseller-growth",
    "kpi-distributor-activation",
    "kpi-ai-adoption",
  ],
  it_ops: ["kpi-forecast-accuracy"],
  security_admin: ["kpi-forecast-accuracy"],
  regional_director: [
    "kpi-renewal-revenue",
    "kpi-ai-adoption",
    "kpi-pipeline-growth",
    "kpi-mdf-roi",
    "kpi-forecast-accuracy",
    "kpi-reseller-growth",
    "kpi-distributor-activation",
    "kpi-customer-expansion",
  ],
};

// ─── Status helpers ──────────────────────────────────────────────────────────

function scoreForStatus(status: KPIStatus): number {
  switch (status) {
    case "exceeding":
      return 100;
    case "ahead":
      return 85;
    case "on_track":
      return 70;
    case "growth_risk":
      return 45;
    case "underperforming":
      return 20;
    default:
      return 50;
  }
}

function trendFromVariance(variance: number): "up" | "down" | "stable" {
  if (variance > 2) return "up";
  if (variance < -2) return "down";
  return "stable";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useKPIGovernance() {
  const [kpiDefinitions, setKpiDefinitions] = useState<KPIDefinition[]>(() => {
    try {
      const stored = localStorage.getItem(LS_DEFS);
      return stored
        ? (JSON.parse(stored) as KPIDefinition[])
        : DEFAULT_KPI_DEFINITIONS;
    } catch {
      return DEFAULT_KPI_DEFINITIONS;
    }
  });

  const [kpiDataPoints] = useState<KPIDataPoint[]>(() => {
    try {
      const stored = localStorage.getItem(LS_DATA);
      if (stored) return JSON.parse(stored) as KPIDataPoint[];
      localStorage.setItem(LS_DATA, JSON.stringify(DEFAULT_DATA_POINTS));
      return DEFAULT_DATA_POINTS;
    } catch {
      return DEFAULT_DATA_POINTS;
    }
  });

  const [kpiAuditLog, setKpiAuditLog] = useState<KPIAuditEntry[]>(() => {
    try {
      const stored = localStorage.getItem(LS_AUDIT);
      if (stored) return JSON.parse(stored) as KPIAuditEntry[];
      localStorage.setItem(LS_AUDIT, JSON.stringify(DEFAULT_AUDIT_ENTRIES));
      return DEFAULT_AUDIT_ENTRIES;
    } catch {
      return DEFAULT_AUDIT_ENTRIES;
    }
  });

  const [forgeInsights] = useState<KPIForgeInsight[]>(() => {
    try {
      const stored = localStorage.getItem(LS_INSIGHTS);
      if (stored) return JSON.parse(stored) as KPIForgeInsight[];
      localStorage.setItem(LS_INSIGHTS, JSON.stringify(DEFAULT_FORGE_INSIGHTS));
      return DEFAULT_FORGE_INSIGHTS;
    } catch {
      return DEFAULT_FORGE_INSIGHTS;
    }
  });

  // Persist definitions whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LS_DEFS, JSON.stringify(kpiDefinitions));
    } catch {
      // storage may be unavailable — fail silently
    }
  }, [kpiDefinitions]);

  // ── Public API ──────────────────────────────────────────────────────────────

  const saveKPIDefinitions = useCallback((defs: KPIDefinition[]) => {
    setKpiDefinitions(defs);
  }, []);

  const addAuditEntry = useCallback(
    (kpiId: string, kpiName: string, changeType: string, changedBy: string) => {
      const entry: KPIAuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kpiId,
        kpiName,
        changeType: changeType as KPIAuditEntry["changeType"],
        changedBy,
        changedAt: new Date().toISOString(),
      };
      setKpiAuditLog((prev) => {
        const next = [entry, ...prev];
        try {
          localStorage.setItem(LS_AUDIT, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      });
    },
    [],
  );

  const getKPIsByRole = useCallback(
    (role: string): KPIDefinition[] => {
      const allowedIds = ROLE_KPI_MAP[role];
      if (!allowedIds) {
        // unknown role — return all enabled KPIs
        return kpiDefinitions.filter((k) => k.isEnabled);
      }
      return kpiDefinitions.filter(
        (k) => k.isEnabled && allowedIds.includes(k.id),
      );
    },
    [kpiDefinitions],
  );

  const getKPIDataPoints = useCallback(
    (kpiId: string): KPIDataPoint[] => {
      return kpiDataPoints.filter((p) => p.kpiId === kpiId);
    },
    [kpiDataPoints],
  );

  const getLatestDataPoint = useCallback(
    (kpiId: string): KPIDataPoint | undefined => {
      const points = kpiDataPoints
        .filter((p) => p.kpiId === kpiId)
        .sort((a, b) => b.period.localeCompare(a.period));
      return points[0];
    },
    [kpiDataPoints],
  );

  const computeScorecard = useCallback(
    (period: string, role: string): KPIScorecard => {
      const roleKPIs = getKPIsByRole(role);
      const entries: KPIScorecardEntry[] = roleKPIs.map((kpi) => {
        const dp = kpiDataPoints
          .filter((p) => p.kpiId === kpi.id && p.period === period)
          .sort((a, b) =>
            (a.territory ?? "").localeCompare(b.territory ?? ""),
          )[0];

        const status: KPIStatus = dp?.status ?? "on_track";
        const rawScore = scoreForStatus(status);
        const weighted = (rawScore * kpi.weight) / 100;
        const variance = dp?.yoyVariance ?? 0;

        return {
          kpiId: kpi.id,
          kpiName: kpi.name,
          weight: kpi.weight,
          score: weighted,
          status,
          trend: trendFromVariance(variance),
          trendMagnitude: Math.abs(variance),
        };
      });

      const totalWeight = roleKPIs.reduce((sum, k) => sum + k.weight, 0);
      const rawTotal =
        totalWeight > 0
          ? entries.reduce(
              (sum, e) =>
                sum +
                (e.score / (e.weight / 100 || 1)) * (e.weight / totalWeight),
              0,
            )
          : 0;

      return {
        id: `scorecard-${role}-${period}-${Date.now()}`,
        name: `${role.replace(/_/g, " ")} Scorecard`,
        period,
        totalScore: Math.round(Math.min(100, Math.max(0, rawTotal))),
        entries,
        role,
        generatedAt: new Date().toISOString(),
      };
    },
    [kpiDataPoints, getKPIsByRole],
  );

  const getForgeInsights = useCallback((): KPIForgeInsight[] => {
    return forgeInsights
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [forgeInsights]);

  // ── Expose territories for consumers ────────────────────────────────────────
  const territories: string[] = Array.from(
    new Set(
      kpiDataPoints
        .map((p) => p.territory)
        .filter((t): t is string => Boolean(t)),
    ),
  );

  return {
    kpiDefinitions,
    kpiDataPoints,
    kpiAuditLog,
    auditLog: kpiAuditLog,
    forgeInsights,
    territories,
    saveKPIDefinitions,
    addAuditEntry,
    getKPIsByRole,
    getKPIDataPoints,
    getLatestDataPoint,
    computeScorecard,
    getForgeInsights,
  };
}

// Re-export the TERRITORIES constant for consumers that need it
export { TERRITORIES };
