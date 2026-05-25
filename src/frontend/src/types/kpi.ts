// ─── KPI Type Definitions ──────────────────────────────────────────────────────
// Core type system for the Performance Governance Ecosystem.
// All KPI logic flows through these types — editable, role-aware, hierarchy-aware.
// ──────────────────────────────────────────────────────────────────────────────

export type KPICategory =
  | "Revenue"
  | "Renewals"
  | "Pipeline"
  | "Adoption"
  | "Marketing"
  | "Operations"
  | "Forecasting"
  | "Growth";

export type KPIFormulaType =
  | "percentage"
  | "average"
  | "weighted_score"
  | "growth_rate"
  | "ratio"
  | "attainment"
  | "custom";

export type KPIStatus =
  | "exceeding"
  | "ahead"
  | "on_track"
  | "growth_risk"
  | "underperforming";

export type KPIVisibilityRole =
  | "all"
  | "leadership"
  | "sales_manager"
  | "sales_rep"
  | "marketing"
  | "finance"
  | "operations";

// ─── Core KPI Definition ───────────────────────────────────────────────────────
// The authoritative schema for a KPI. Admins create/edit these in the KPI Builder.

export interface KPIDefinition {
  id: string;
  name: string;
  category: KPICategory;
  description: string;
  formulaType: KPIFormulaType;
  /** Human-readable formula expression, e.g. "(actual / target) * 100" */
  formulaExpression: string;
  /** 0–100: percentage contribution to the overall operational scorecard */
  weight: number;
  benchmarkTarget: number;
  /** Display unit, e.g. "%" | "£M" | "score" | "count" | "days" | "x" */
  benchmarkUnit: string;
  /** % below benchmark before a warning indicator triggers */
  warningThreshold: number;
  /** % below benchmark before a critical indicator triggers */
  criticalThreshold: number;
  visibilityRoles: KPIVisibilityRole[];
  isEnabled: boolean;
  /** True for the 10 seeded default starter templates */
  isDefault: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  tags: string[];
}

// ─── KPI Data Point ────────────────────────────────────────────────────────────
// One operational snapshot for a KPI in a given period + territory + org type.

export interface KPIDataPoint {
  kpiId: string;
  /** ISO period string, e.g. "2024-Q4", "2025-Q1" */
  period: string;
  actualValue: number;
  targetValue: number;
  forecastValue: number;
  /** Actual performance in the equivalent period one year prior */
  priorYearValue: number;
  /** YoY growth % expected (target vs prior year) */
  yoyGrowthExpected: number;
  /** YoY growth % achieved (actual vs prior year) */
  yoyGrowthActual: number;
  /** YoY growth % forecast (forecast vs prior year) */
  yoyGrowthForecast: number;
  /** Variance vs expected YoY growth — positive = ahead, negative = behind */
  yoyVariance: number;
  status: KPIStatus;
  territory?: string;
  orgType?: "vendor" | "distributor" | "reseller";
  updatedAt: string;
}

// ─── Scorecard Types ───────────────────────────────────────────────────────────

export interface KPIScorecardEntry {
  kpiId: string;
  kpiName: string;
  weight: number;
  /** 0–100 weighted contribution score for this KPI */
  score: number;
  status: KPIStatus;
  trend: "up" | "down" | "stable";
  /** % change driving the trend */
  trendMagnitude: number;
}

export interface KPIScorecard {
  id: string;
  name: string;
  period: string;
  /** 0–100 weighted aggregate score */
  totalScore: number;
  entries: KPIScorecardEntry[];
  territory?: string;
  role?: string;
  generatedAt: string;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export type KPIAuditChangeType =
  | "created"
  | "updated"
  | "disabled"
  | "enabled"
  | "weight_changed"
  | "formula_changed"
  | "restored";

export interface KPIAuditEntry {
  id: string;
  kpiId: string;
  kpiName: string;
  changeType: KPIAuditChangeType;
  changedBy: string;
  changedAt: string;
  previousValue?: string;
  newValue?: string;
  notes?: string;
}

// ─── ForgeAI KPI Insights ─────────────────────────────────────────────────────
// Lightweight, operational, believable — no gimmicky AI theatrics.

export type KPIForgeInsightType =
  | "trending_up"
  | "trending_down"
  | "growth_acceleration"
  | "underperformance_warning"
  | "territory_trend"
  | "forecast_movement"
  | "yoy_variance"
  | "momentum";

export interface KPIForgeInsight {
  id: string;
  type: KPIForgeInsightType;
  kpiId?: string;
  kpiName: string;
  message: string;
  territory?: string;
  severity: "info" | "warning" | "positive" | "critical";
  period: string;
  createdAt: string;
}
