import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  BarChart2,
  BrainCircuit,
  Briefcase,
  Building2,
  ClipboardList,
  Clock,
  Network,
  RefreshCcw,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useApp } from "../AppContext";
import { ForgeAIRecommendationCard } from "../components/ForgeAIRecommendationCard";
import { useForgeAI } from "../hooks/useForgeAI";
import type { EngagementGapAlert } from "../types";

const BLUE = "#648CDC";
const BG = "#0b1724";
const BORDER = "#1e3050";

type TabId =
  | "overview"
  | "vendors"
  | "resellers"
  | "accounts"
  | "activity"
  | "forgeai";

const TABS: Array<{
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "resellers", label: "Resellers", icon: Users },
  { id: "accounts", label: "Customer Accounts", icon: Briefcase },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "forgeai", label: "AI Insights", icon: BrainCircuit },
];

const SAMPLE_VENDORS = [
  {
    id: "v1",
    name: "Acme Software Ltd",
    status: "Active",
    products: "Security Suite, Cloud Platform",
    since: "Jan 2023",
  },
  {
    id: "v2",
    name: "TechVault Systems",
    status: "Active",
    products: "Data Management, Analytics",
    since: "Mar 2023",
  },
];

const SAMPLE_RESELLERS = [
  {
    id: "r1",
    name: "ATEA Sweden AB",
    tier: "Gold",
    accounts: 14,
    activity: "3 days ago",
  },
  {
    id: "r2",
    name: "Computacenter UK",
    tier: "Platinum",
    accounts: 22,
    activity: "1 day ago",
  },
  {
    id: "r3",
    name: "SHI International",
    tier: "Silver",
    accounts: 8,
    activity: "5 days ago",
  },
];

const SAMPLE_ACCOUNTS = [
  {
    id: "a1",
    name: "GlobalTech Corp",
    reseller: "ATEA Sweden AB",
    region: "EMEA",
    renewal: "45",
    risk: "Low",
    value: "\u00a3124,000",
  },
  {
    id: "a2",
    name: "Meridian Holdings",
    reseller: "Computacenter UK",
    region: "UK",
    renewal: "12",
    risk: "High",
    value: "\u00a389,500",
  },
  {
    id: "a3",
    name: "Apex Financial",
    reseller: "SHI International",
    region: "Americas",
    renewal: "90",
    risk: "Medium",
    value: "\u00a367,200",
  },
];

const SAMPLE_ACTIVITY = [
  {
    id: "act1",
    action: "Reseller ATEA Sweden added to workspace",
    user: "James Porter",
    time: "2 hours ago",
  },
  {
    id: "act2",
    action: "Customer account Meridian Holdings reassigned",
    user: "Sarah Mitchell",
    time: "1 day ago",
  },
  {
    id: "act3",
    action: "Vendor relationship TechVault Systems approved",
    user: "Admin",
    time: "3 days ago",
  },
  {
    id: "act4",
    action: "Deal registration DR-2024-0089 submitted",
    user: "Priya Sharma",
    time: "4 days ago",
  },
];

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  Silver: { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
  Gold: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  Platinum: { bg: "rgba(148,163,184,0.12)", color: "#e2e8f0" },
};

function TierBadgeLocal({ tier }: { tier: string }) {
  const cfg = TIER_COLORS[tier] ?? TIER_COLORS.Silver;
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
      }}
    >
      {tier}
    </span>
  );
}

// ── ForgeAI Distributor Panel ─────────────────────────────────────────────────
function DistributorForgeAIPanel({
  distributorId,
  distributorName,
}: {
  distributorId: string;
  distributorName: string;
}) {
  const {
    recommendations,
    engagementGaps,
    dismissRecommendation,
    isAnalyzing,
    runAnalysis,
    lastAnalyzedAt,
  } = useForgeAI();

  // Filter recommendations scoped to this distributor
  const distributorRecs = recommendations.filter(
    (r) =>
      r.affectedEntityType === "Distributor" &&
      (r.affectedEntityId === distributorId ||
        r.affectedEntityName
          .toLowerCase()
          .includes(distributorName.toLowerCase().slice(0, 6))),
  );

  // Engagement gap alerts scoped to this distributor
  const distributorGaps: EngagementGapAlert[] = engagementGaps.filter(
    (g) =>
      g.entityType === "Distributor" &&
      (g.entityId === distributorId ||
        g.entityName
          .toLowerCase()
          .includes(distributorName.toLowerCase().slice(0, 6))),
  );

  const DIST_METRICS = [
    {
      label: "Distributor Health Score",
      value: "71/100",
      trend: "Moderate",
      risk: false,
    },
    {
      label: "Engagement Activity",
      value: "30d gap",
      trend: "Below threshold",
      risk: true,
    },
    { label: "Renewal Conversion", value: "68%", trend: "−6% QTD", risk: true },
    {
      label: "Pipeline Coverage",
      value: "£280,700",
      trend: "4 open DRs",
      risk: false,
    },
  ];

  return (
    <div className="space-y-5" data-ocid="distributor_workspace.forgeai.panel">
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-5 py-4 rounded-xl border"
        style={{
          background: "rgba(255,107,43,0.05)",
          borderColor: "rgba(255,107,43,0.18)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,107,43,0.15)", color: "#FF6B2B" }}
          >
            <BrainCircuit size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                Distributor Health &amp; Performance
              </h2>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                style={{
                  background: "rgba(255,107,43,0.15)",
                  color: "#FF6B2B",
                  border: "1px solid rgba(255,107,43,0.3)",
                }}
              >
                ForgeAI
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Operational intelligence for {distributorName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastAnalyzedAt && (
            <span
              className="hidden sm:flex items-center gap-1 text-[10px]"
              style={{ color: "#6B8CAE" }}
            >
              <Clock size={10} /> Analyzed{" "}
              {lastAnalyzedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <button
            type="button"
            onClick={runAnalysis}
            disabled={isAnalyzing}
            data-ocid="distributor_workspace.forgeai.run_analysis.button"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            style={{
              background: "rgba(255,107,43,0.12)",
              color: "#FF6B2B",
              border: "1px solid rgba(255,107,43,0.25)",
            }}
          >
            <Zap size={11} />
            {isAnalyzing ? "Analyzing…" : "Re-analyze"}
          </button>
        </div>
      </div>

      {/* Engagement Gap Alerts */}
      {distributorGaps.length > 0 && (
        <div
          className="space-y-2"
          data-ocid="distributor_workspace.forgeai.gap_alerts"
        >
          {distributorGaps.map((gap) => (
            <div
              key={gap.alertId}
              className="flex items-start gap-3 px-4 py-3 rounded-xl border"
              style={{
                background:
                  gap.severity === "Critical"
                    ? "rgba(248,113,113,0.06)"
                    : "rgba(251,146,60,0.06)",
                borderColor:
                  gap.severity === "Critical"
                    ? "rgba(248,113,113,0.2)"
                    : "rgba(251,146,60,0.2)",
              }}
              data-ocid={`distributor_workspace.forgeai.gap_alert.${gap.alertId}`}
            >
              <div
                className="forgeai-pulse-dot mt-1 flex-shrink-0"
                style={{
                  background:
                    gap.severity === "Critical" ? "#f87171" : "#fb923c",
                }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold"
                  style={{
                    color: gap.severity === "Critical" ? "#fca5a5" : "#fdba74",
                  }}
                >
                  Distributor Engagement Gap — {gap.entityName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  No distributor activity recorded in{" "}
                  <span className="font-bold text-foreground">
                    {gap.daysSinceLastEngagement} days
                  </span>{" "}
                  (threshold: {gap.threshold}d) · {gap.affectedAccountCount}{" "}
                  account
                  {gap.affectedAccountCount !== 1 ? "s" : ""} affected
                </p>
              </div>
              <span
                className="text-[10px] flex-shrink-0"
                style={{ color: "#4a6080", fontFamily: "var(--font-mono)" }}
              >
                {Math.floor((Date.now() - Number(gap.detectedAt)) / 60_000)}m
                ago
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Health Metrics Grid */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="distributor_workspace.forgeai.metrics_grid"
      >
        {DIST_METRICS.map((m) => (
          <div key={m.label} className="forgeai-card p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              {m.label}
            </p>
            <p
              className="text-xl font-bold tabular-nums"
              style={{ color: m.risk ? "#fb923c" : "#4ade80" }}
            >
              {m.value}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {m.trend}
            </p>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div data-ocid="distributor_workspace.forgeai.recommendations">
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#6B8CAE" }}
        >
          AI Recommendations
        </h3>
        {distributorRecs.length === 0 ? (
          <div
            className="forgeai-card flex flex-col items-center py-12"
            data-ocid="distributor_workspace.forgeai.recommendations.empty_state"
          >
            <BrainCircuit
              size={32}
              style={{ color: "rgba(255,107,43,0.4)" }}
              className="mb-3"
            />
            <p className="text-sm font-medium text-foreground">
              No distributor-specific recommendations
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ForgeAI has no active insights for this distributor at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {distributorRecs.map((rec, i) => (
              <div
                key={rec.id}
                data-ocid={`distributor_workspace.forgeai.recommendation.item.${i + 1}`}
              >
                <ForgeAIRecommendationCard
                  recommendation={rec}
                  onDismiss={dismissRecommendation}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Trend Overview */}
      <div
        className="forgeai-card p-5"
        data-ocid="distributor_workspace.forgeai.performance_trend"
      >
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: "#6B8CAE" }}
        >
          Distributor Performance Analysis
        </h3>
        <div className="space-y-3">
          {[
            {
              label: "Reseller engagement quality",
              current: 62,
              prior: 84,
              unit: "%",
            },
            {
              label: "Renewal conversion rate",
              current: 68,
              prior: 74,
              unit: "%",
            },
            {
              label: "Pipeline coverage vs target",
              current: 71,
              prior: 90,
              unit: "%",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{item.label}</span>
                <span
                  style={{
                    color:
                      item.current < item.prior * 0.8 ? "#fb923c" : "#facc15",
                  }}
                >
                  {item.current}
                  {item.unit}{" "}
                  <span className="text-muted-foreground">
                    (was {item.prior}
                    {item.unit})
                  </span>
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(item.current / Math.max(item.prior, 1)) * 100}%`,
                    background:
                      item.current < item.prior * 0.8 ? "#fb923c" : "#facc15",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p
          className="text-[11px] mt-4 leading-relaxed"
          style={{
            color: "#8AABDC",
            background: "rgba(255,107,43,0.04)",
            border: "1px solid rgba(255,107,43,0.1)",
            borderRadius: "0.375rem",
            padding: "0.625rem 0.75rem",
          }}
        >
          <span style={{ color: "#FF6B2B", fontWeight: 600 }}>ForgeAI: </span>
          {distributorName} is showing a measurable decline in reseller
          engagement quality and renewal conversion this quarter. Recommend an
          urgent distributor review meeting and co-coverage assessment for all
          accounts with renewals in the next 45 days.
        </p>
      </div>
    </div>
  );
}

export function DistributorWorkspaceView() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/distributor/$id" });
  const { distributorContext, setDistributorContext } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const displayName =
    distributorContext?.distributorName ?? `Distributor ${id}`;

  function handleBack() {
    setDistributorContext(null);
    navigate({ to: "/dashboard" });
  }

  const statCards = [
    {
      icon: Building2,
      label: "Vendor Relationships",
      value: SAMPLE_VENDORS.length.toString(),
      color: BLUE,
    },
    {
      icon: Users,
      label: "Active Resellers",
      value: SAMPLE_RESELLERS.length.toString(),
      color: "#FF6B2B",
    },
    {
      icon: RefreshCcw,
      label: "Renewals This Quarter",
      value: "6",
      color: "#22c55e",
    },
    {
      icon: Briefcase,
      label: "Open Deal Registrations",
      value: "4",
      color: "#f59e0b",
    },
    {
      icon: TrendingUp,
      label: "Pipeline Value",
      value: "\u00a3280,700",
      color: "#8b5cf6",
    },
    {
      icon: ClipboardList,
      label: "Business Plan Actions",
      value: "3",
      color: "#06b6d4",
    },
  ];

  return (
    <div className="p-6 space-y-6" data-ocid="distributor_workspace.page">
      {/* Context banner */}
      <div
        className="rounded-xl px-5 py-3 flex items-center gap-4"
        style={{
          background: "rgba(100,140,220,0.08)",
          border: "1px solid rgba(100,140,220,0.2)",
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(100,140,220,0.15)" }}
        >
          <Network size={16} style={{ color: BLUE }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-foreground">
              {displayName}
            </span>
            <Badge
              style={{
                background: "rgba(100,140,220,0.15)",
                color: BLUE,
                border: "1px solid rgba(100,140,220,0.3)",
              }}
            >
              Distributor
            </Badge>
            <span className="text-xs text-muted-foreground">ID: {id}</span>
            <Badge
              style={{
                background: "rgba(34,197,94,0.12)",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi-vendor distributor workspace &middot; {SAMPLE_VENDORS.length}{" "}
            vendor relationships &middot; {SAMPLE_RESELLERS.length} resellers
          </p>
        </div>
        <button
          type="button"
          data-ocid="distributor_workspace.back.button"
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-secondary/40 flex-shrink-0"
          style={{ color: BLUE }}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: BG, border: `1px solid ${BORDER}` }}
            data-ocid="distributor_workspace.stat.card"
          >
            <Icon size={16} style={{ color, marginBottom: 8 }} />
            <div className="text-xl font-bold text-foreground">{value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-thin">
        {TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            type="button"
            data-ocid={`distributor_workspace.${tabId}.tab`}
            onClick={() => setActiveTab(tabId)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors border-b-2 -mb-px"
            style={{
              color: activeTab === tabId ? BLUE : "rgba(125,138,160,0.7)",
              borderBottomColor: activeTab === tabId ? BLUE : "transparent",
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-ocid="distributor_workspace.overview.panel"
        >
          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: BG, border: `1px solid ${BORDER}` }}
          >
            <h3 className="text-sm font-semibold text-foreground">
              Workspace Summary
            </h3>
            <div className="space-y-2">
              {[
                { label: "Distributor ID", value: id },
                { label: "Status", value: "Active" },
                { label: "Vendor Relationships", value: SAMPLE_VENDORS.length },
                { label: "Reseller Network", value: SAMPLE_RESELLERS.length },
                { label: "Customer Accounts", value: SAMPLE_ACCOUNTS.length },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ background: BG, border: `1px solid ${BORDER}` }}
          >
            <h3 className="text-sm font-semibold text-foreground">
              Recent Activity
            </h3>
            <div className="space-y-2">
              {SAMPLE_ACTIVITY.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-2 text-xs">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: BLUE }}
                  />
                  <div className="min-w-0">
                    <p className="text-foreground">{act.action}</p>
                    <p className="text-muted-foreground">
                      {act.user} &middot; {act.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vendors */}
      {activeTab === "vendors" && (
        <div data-ocid="distributor_workspace.vendors.panel">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: BG, border: `1px solid ${BORDER}` }}
          >
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Vendor Relationships
              </h3>
              <Badge variant="secondary">{SAMPLE_VENDORS.length} vendors</Badge>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Vendor", "Status", "Product Lines", "Active Since"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-muted-foreground uppercase tracking-wide px-5 py-3"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_VENDORS.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                    data-ocid={`distributor_workspace.vendor.item.${v.id}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            background: "rgba(100,140,220,0.12)",
                            color: BLUE,
                          }}
                        >
                          {v.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground text-xs">
                          {v.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(34,197,94,0.12)",
                          color: "#22c55e",
                        }}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {v.products}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {v.since}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resellers */}
      {activeTab === "resellers" && (
        <div data-ocid="distributor_workspace.resellers.panel">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: BG, border: `1px solid ${BORDER}` }}
          >
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Reseller Network
              </h3>
              <Badge variant="secondary">
                {SAMPLE_RESELLERS.length} resellers
              </Badge>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Reseller",
                    "Tier",
                    "Accounts",
                    "Last Activity",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground uppercase tracking-wide px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_RESELLERS.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                    data-ocid={`distributor_workspace.reseller.item.${r.id}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{
                            background: "rgba(255,107,43,0.1)",
                            color: "#FF6B2B",
                          }}
                        >
                          {r.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground text-xs">
                          {r.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <TierBadgeLocal tier={r.tier} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-foreground font-medium">
                      {r.accounts}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {r.activity}
                    </td>
                    <td className="px-5 py-3.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        data-ocid={`distributor_workspace.reseller.view_button.${r.id}`}
                      >
                        View Workspace
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accounts */}
      {activeTab === "accounts" && (
        <div data-ocid="distributor_workspace.accounts.panel">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: BG, border: `1px solid ${BORDER}` }}
          >
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Customer Accounts
              </h3>
              <Badge variant="secondary">
                {SAMPLE_ACCOUNTS.length} accounts
              </Badge>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Account",
                    "Reseller",
                    "Region",
                    "Renewal",
                    "Risk",
                    "Value",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground uppercase tracking-wide px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ACCOUNTS.map((a, i) => (
                  <tr
                    key={a.id}
                    className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                    data-ocid={`distributor_workspace.account.item.${i + 1}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground text-xs">
                      {a.name}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {a.reseller}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {a.region}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs"
                        style={{
                          color:
                            Number.parseInt(a.renewal) <= 30
                              ? "#ef4444"
                              : Number.parseInt(a.renewal) <= 60
                                ? "#f59e0b"
                                : "#22c55e",
                        }}
                      >
                        {a.renewal} days
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            a.risk === "High"
                              ? "rgba(239,68,68,0.12)"
                              : a.risk === "Medium"
                                ? "rgba(245,158,11,0.12)"
                                : "rgba(34,197,94,0.12)",
                          color:
                            a.risk === "High"
                              ? "#f87171"
                              : a.risk === "Medium"
                                ? "#fbbf24"
                                : "#22c55e",
                        }}
                      >
                        {a.risk}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium text-foreground">
                      {a.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity */}
      {activeTab === "activity" && (
        <ScrollArea
          className="h-96"
          data-ocid="distributor_workspace.activity.panel"
        >
          <div className="space-y-2">
            {SAMPLE_ACTIVITY.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{ background: BG, border: `1px solid ${BORDER}` }}
                data-ocid={`distributor_workspace.activity.item.${act.id}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(100,140,220,0.1)" }}
                >
                  <Activity size={14} style={{ color: BLUE }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{act.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {act.user} &middot; {act.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* ForgeAI */}
      {activeTab === "forgeai" && (
        <DistributorForgeAIPanel
          distributorId={id}
          distributorName={displayName}
        />
      )}
    </div>
  );
}
