import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart2,
  BrainCircuit,
  Building2,
  CalendarClock,
  ClipboardList,
  Clock,
  FileCheck,
  LayoutDashboard,
  Plus,
  RefreshCcw,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type {
  Account,
  BusinessPlan,
  CompanyProfile,
  DealRegistration,
} from "../backend";
import { AccountStatus } from "../backend";
import { ForgeAIRecommendationCard } from "../components/ForgeAIRecommendationCard";
import { useActor } from "../hooks/useActor";
import { useForgeAI } from "../hooks/useForgeAI";
import type { EngagementGapAlert } from "../types";
import {
  accountStatusColor,
  dealStatusColor,
  dealStatusLabel,
  formatCurrency,
  formatDate,
} from "../utils/channelforge";

type TabId =
  | "overview"
  | "accounts"
  | "renewals"
  | "deals"
  | "business-plan"
  | "activity"
  | "forgeai";

const TABS: Array<{
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "accounts", label: "Customer Accounts", icon: Building2 },
  { id: "renewals", label: "Renewals", icon: CalendarClock },
  { id: "deals", label: "Deal Registrations", icon: ClipboardList },
  { id: "business-plan", label: "Business Plan", icon: TrendingUp },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "forgeai", label: "AI Insights", icon: BrainCircuit },
];

function renewalDays(ns: bigint): number {
  return (Number(ns) / 1_000_000 - Date.now()) / 86_400_000;
}

function RenewalCell({ ns }: { ns: bigint }) {
  if (!ns) return <span className="text-muted-foreground">—</span>;
  const days = renewalDays(ns);
  const color =
    days <= 30
      ? "text-red-400"
      : days <= 90
        ? "text-yellow-400"
        : "text-green-400";
  return <span className={color}>{formatDate(ns)}</span>;
}

function MetricTile({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: boolean;
}) {
  return (
    <div className="crm-card p-5 flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: accent
            ? "rgba(255,107,43,0.15)"
            : "rgba(255,255,255,0.06)",
          color: accent ? "#FF6B2B" : "var(--muted-foreground)",
        }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-foreground tabular-nums">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function ResellerPartnerView() {
  const routerState = useRouterState();
  const resellerId = routerState.location.pathname.split("/reseller/")[1];
  const navigate = useNavigate();
  const { actor } = useActor();
  const { dealRegistrations, businessPlans } = useApp();

  const [reseller, setReseller] = useState<CompanyProfile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const loadData = useCallback(async () => {
    if (!actor || !resellerId) return;
    setLoading(true);
    try {
      const [profile, accts] = await Promise.all([
        actor.getCompanyProfile(resellerId),
        actor.getAccountsByReseller(resellerId),
      ]);
      setReseller(profile ?? null);
      setAccounts(accts);
    } catch {
      toast.error("Failed to load reseller workspace");
    } finally {
      setLoading(false);
    }
  }, [actor, resellerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resellerDeals: DealRegistration[] = dealRegistrations.filter(
    (d) => d.resellerId === resellerId,
  );
  const resellerPlans: BusinessPlan[] = businessPlans.filter(
    (b) => b.partnerId === resellerId,
  );

  // Derived stats
  const renewalsDue = accounts.filter((a) => {
    if (!a.renewalDate) return false;
    const days = renewalDays(a.renewalDate);
    return days >= 0 && days <= 90;
  });
  const riskAccounts = accounts.filter(
    (a) =>
      a.status === AccountStatus.AtRisk || a.status === AccountStatus.Churned,
  );
  const activeDeals = resellerDeals.filter(
    (d) =>
      d.status !== "Won" &&
      d.status !== "Lost" &&
      d.status !== "Rejected" &&
      d.status !== "Expired",
  );

  const resellerName = reseller?.companyName ?? resellerId;

  if (loading) {
    return (
      <div className="space-y-5 fade-in">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!reseller && !loading) {
    return (
      <div className="flex flex-col items-center py-20">
        <Building2 size={40} className="text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          Reseller workspace not found
        </p>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/dashboard" })}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 fade-in">
      {/* Workspace breadcrumb banner */}
      <div
        className="flex items-center justify-between px-5 py-3 rounded-xl border"
        style={{
          background: "rgba(255,107,43,0.08)",
          borderColor: "rgba(255,107,43,0.2)",
        }}
        data-ocid="reseller_view.workspace_banner"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
            style={{ background: "rgba(255,107,43,0.2)", color: "#FF6B2B" }}
          >
            {resellerName[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Viewing workspace</p>
            <p className="text-sm font-bold" style={{ color: "#FF6B2B" }}>
              {resellerName}
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-2 text-[10px] border-orange-500/30 text-orange-400"
          >
            Reseller View
          </Badge>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="reseller_view.back.link"
        >
          <ArrowLeft size={13} /> Back to vendor view
        </button>
      </div>

      {/* Reseller info row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground font-display">
            {resellerName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {reseller?.emailDomain ?? ""}
            {reseller?.companyId && (
              <span className="ml-2 text-xs">· ID: {reseller.companyId}</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Refresh"
          data-ocid="reseller_view.refresh.button"
        >
          <RefreshCcw size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 border-b border-border overflow-x-auto scrollbar-thin"
        data-ocid="reseller_view.tabs"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`reseller_view.tab.${tab.id}`}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <OverviewTab
          accounts={accounts}
          renewalsDue={renewalsDue}
          riskAccounts={riskAccounts}
          activeDeals={activeDeals}
          resellerDeals={resellerDeals}
          resellerPlans={resellerPlans}
        />
      )}

      {activeTab === "accounts" && (
        <AccountsTab
          accounts={accounts}
          resellerId={resellerId}
          resellerName={resellerName}
          onNavigate={(id) => navigate({ to: "/accounts/$id", params: { id } })}
        />
      )}

      {activeTab === "renewals" && <RenewalsTab accounts={accounts} />}

      {activeTab === "deals" && <DealsTab deals={resellerDeals} />}

      {activeTab === "business-plan" && (
        <BusinessPlanTab plans={resellerPlans} />
      )}

      {activeTab === "activity" && (
        <ActivityTab
          resellerName={resellerName}
          accounts={accounts}
          deals={resellerDeals}
        />
      )}

      {activeTab === "forgeai" && (
        <ResellerForgeAIPanel
          resellerId={resellerId}
          resellerName={resellerName}
        />
      )}
    </div>
  );
}

// ── ForgeAI Reseller Panel ───────────────────────────────────────────────────
function ResellerForgeAIPanel({
  resellerId,
  resellerName,
}: {
  resellerId: string;
  resellerName: string;
}) {
  const {
    recommendations,
    engagementGaps,
    dismissRecommendation,
    isAnalyzing,
    runAnalysis,
    lastAnalyzedAt,
  } = useForgeAI();

  // Filter recommendations scoped to this reseller
  const resellerRecs = recommendations.filter(
    (r) =>
      r.affectedEntityType === "Reseller" &&
      (r.affectedEntityId === resellerId ||
        r.affectedEntityName
          .toLowerCase()
          .includes(resellerName.toLowerCase().slice(0, 6))),
  );

  // Engagement gap alerts scoped to this reseller
  const resellerGaps: EngagementGapAlert[] = engagementGaps.filter(
    (g) =>
      g.entityType === "Reseller" &&
      (g.entityId === resellerId ||
        g.entityName
          .toLowerCase()
          .includes(resellerName.toLowerCase().slice(0, 6))),
  );

  // Performance metrics derived from mock data
  const METRICS = [
    {
      label: "Renewal Conversion",
      value: "44%",
      trend: "-34% QTD",
      risk: true,
    },
    {
      label: "Engagement Score",
      value: "28/100",
      trend: "↓ vs prior quarter",
      risk: true,
    },
    {
      label: "Pipeline Health",
      value: "Moderate",
      trend: "3 active deals",
      risk: false,
    },
    {
      label: "Target Attainment",
      value: "44%",
      trend: "of $180,000 target",
      risk: true,
    },
  ];

  return (
    <div className="space-y-5" data-ocid="reseller_view.forgeai.panel">
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
                Performance &amp; Engagement Insights
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
              Operational intelligence for {resellerName}
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
            data-ocid="reseller_view.forgeai.run_analysis.button"
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
      {resellerGaps.length > 0 && (
        <div className="space-y-2" data-ocid="reseller_view.forgeai.gap_alerts">
          {resellerGaps.map((gap) => (
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
              data-ocid={`reseller_view.forgeai.gap_alert.${gap.alertId}`}
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
                  Engagement Gap — {gap.entityName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  No reseller engagement detected in{" "}
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

      {/* Performance Metrics Grid */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="reseller_view.forgeai.metrics_grid"
      >
        {METRICS.map((m) => (
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
      <div data-ocid="reseller_view.forgeai.recommendations">
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "#6B8CAE" }}
        >
          AI Recommendations
        </h3>
        {resellerRecs.length === 0 ? (
          <div
            className="forgeai-card flex flex-col items-center py-12"
            data-ocid="reseller_view.forgeai.recommendations.empty_state"
          >
            <BrainCircuit
              size={32}
              style={{ color: "rgba(255,107,43,0.4)" }}
              className="mb-3"
            />
            <p className="text-sm font-medium text-foreground">
              No reseller-specific recommendations
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ForgeAI has no active insights for this reseller at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {resellerRecs.map((rec, i) => (
              <div
                key={rec.id}
                data-ocid={`reseller_view.forgeai.recommendation.item.${i + 1}`}
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
        data-ocid="reseller_view.forgeai.performance_trend"
      >
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: "#6B8CAE" }}
        >
          Performance Trend Summary
        </h3>
        <div className="space-y-3">
          {[
            {
              label: "Renewal conversion rate",
              current: 44,
              prior: 78,
              unit: "%",
            },
            {
              label: "Business plan milestone completion",
              current: 22,
              prior: 65,
              unit: "%",
            },
            {
              label: "Enablement sessions attended",
              current: 0,
              prior: 4,
              unit: " of 4",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{item.label}</span>
                <span
                  style={{
                    color:
                      item.current < item.prior * 0.7 ? "#f87171" : "#facc15",
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
                      item.current < item.prior * 0.7 ? "#f87171" : "#facc15",
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
          Renewal conversion and milestone completion are significantly below
          target this quarter. Recommend scheduling an urgent performance review
          call with {resellerName} and assigning channel enablement support
          before end of Q2.
        </p>
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({
  accounts,
  renewalsDue,
  riskAccounts,
  activeDeals,
  resellerDeals,
  resellerPlans,
}: {
  accounts: Account[];
  renewalsDue: Account[];
  riskAccounts: Account[];
  activeDeals: DealRegistration[];
  resellerDeals: DealRegistration[];
  resellerPlans: BusinessPlan[];
}) {
  const totalARR = accounts.reduce(
    (sum, a) => sum + a.estimatedRenewalValue,
    0,
  );
  return (
    <div className="space-y-5">
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="reseller_view.overview.metrics"
      >
        <MetricTile
          label="Total Accounts"
          value={accounts.length}
          icon={Building2}
          accent
        />
        <MetricTile
          label="Renewals Due (90d)"
          value={renewalsDue.length}
          sub={formatCurrency(
            renewalsDue.reduce((s, a) => s + a.estimatedRenewalValue, 0),
          )}
          icon={CalendarClock}
        />
        <MetricTile
          label="Active Deals"
          value={activeDeals.length}
          icon={FileCheck}
        />
        <MetricTile
          label="At-Risk Accounts"
          value={riskAccounts.length}
          icon={AlertTriangle}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="crm-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart2 size={14} style={{ color: "#FF6B2B" }} /> Revenue Summary
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Total ARR</dt>
              <dd className="font-semibold text-foreground">
                {formatCurrency(totalARR)}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Active Accounts</dt>
              <dd className="font-semibold text-foreground">
                {
                  accounts.filter((a) => a.status === AccountStatus.Active)
                    .length
                }
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Prospect Accounts</dt>
              <dd className="font-semibold text-foreground">
                {
                  accounts.filter((a) => a.status === AccountStatus.Prospect)
                    .length
                }
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">
                Total Deal Registrations
              </dt>
              <dd className="font-semibold text-foreground">
                {resellerDeals.length}
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Business Plans</dt>
              <dd className="font-semibold text-foreground">
                {resellerPlans.length}
              </dd>
            </div>
          </dl>
        </div>
        <div className="crm-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle size={14} style={{ color: "#FF6B2B" }} /> Risk
            Summary
          </h3>
          {riskAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No at-risk accounts. 🎉
            </p>
          ) : (
            <div className="space-y-2">
              {riskAccounts.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{
                        background: "rgba(255,107,43,0.15)",
                        color: "#FF6B2B",
                      }}
                    >
                      {a.accountName[0]?.toUpperCase()}
                    </div>
                    <span className="text-foreground truncate">
                      {a.accountName}
                    </span>
                  </div>
                  <span className={accountStatusColor(a.status)}>
                    {a.status}
                  </span>
                </div>
              ))}
              {riskAccounts.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{riskAccounts.length - 5} more
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Accounts Tab ──────────────────────────────────────────────────────────────
function AccountsTab({
  accounts,
  onNavigate,
}: {
  accounts: Account[];
  resellerId: string;
  resellerName: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {accounts.length} account{accounts.length !== 1 ? "s" : ""} in this
          workspace
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() =>
            toast.info("Create account in reseller workspace coming soon")
          }
          style={{ background: "#FF6B2B" }}
          className="text-white"
          data-ocid="reseller_view.accounts.create.button"
        >
          <Plus size={13} className="mr-1.5" /> New Account
        </Button>
      </div>
      <div className="crm-card overflow-hidden">
        {accounts.length === 0 ? (
          <div
            className="flex flex-col items-center py-16"
            data-ocid="reseller_view.accounts.empty_state"
          >
            <Building2 size={36} className="text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">
              No accounts yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This reseller has no customer accounts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Account",
                    "Main Contact",
                    "Renewal Date",
                    "Product Stack",
                    "ARR",
                    "Risk",
                    "Vendor Manager",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounts.map((a, i) => (
                  <tr
                    key={a.id}
                    data-ocid={`reseller_view.accounts.item.${i + 1}`}
                    onClick={() => onNavigate(a.id)}
                    onKeyDown={(e) => e.key === "Enter" && onNavigate(a.id)}
                    tabIndex={0}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{
                            background: "rgba(255,107,43,0.15)",
                            color: "#FF6B2B",
                          }}
                        >
                          {a.accountName[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">
                          {a.accountName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {a.customerDomain || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <RenewalCell ns={a.renewalDate} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {a.productList.length > 0
                        ? `${a.productList.slice(0, 2).join(", ")}${a.productList.length > 2 ? ` +${a.productList.length - 2}` : ""}`
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-foreground tabular-nums">
                      {formatCurrency(a.estimatedRenewalValue)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={accountStatusColor(a.status)}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {a.vendorOwnerId || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Renewals Tab ──────────────────────────────────────────────────────────────
function RenewalsTab({ accounts }: { accounts: Account[] }) {
  const upcoming = [...accounts]
    .filter((a) => a.renewalDate && renewalDays(a.renewalDate) >= 0)
    .sort((a, b) => Number(a.renewalDate - b.renewalDate));

  return (
    <div className="crm-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Renewals ({upcoming.length})
        </h3>
      </div>
      {upcoming.length === 0 ? (
        <div
          className="flex flex-col items-center py-16"
          data-ocid="reseller_view.renewals.empty_state"
        >
          <CalendarClock size={36} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No upcoming renewals
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            All renewals are past or have no date set.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Account", "Renewal Date", "Days Until", "ARR", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {upcoming.map((a, i) => {
                const days = Math.ceil(renewalDays(a.renewalDate));
                return (
                  <tr
                    key={a.id}
                    data-ocid={`reseller_view.renewals.item.${i + 1}`}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      {a.accountName}
                    </td>
                    <td className="px-5 py-3.5">
                      <RenewalCell ns={a.renewalDate} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          days <= 30
                            ? "text-red-400"
                            : days <= 90
                              ? "text-yellow-400"
                              : "text-green-400"
                        }
                      >
                        {days}d
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-foreground tabular-nums">
                      {formatCurrency(a.estimatedRenewalValue)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={accountStatusColor(a.status)}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Deals Tab ─────────────────────────────────────────────────────────────────
function DealsTab({ deals }: { deals: DealRegistration[] }) {
  return (
    <div className="crm-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Deal Registrations ({deals.length})
        </h3>
      </div>
      {deals.length === 0 ? (
        <div
          className="flex flex-col items-center py-16"
          data-ocid="reseller_view.deals.empty_state"
        >
          <ClipboardList size={36} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No deal registrations
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Deal registrations for this reseller will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Opportunity",
                  "Account",
                  "Product",
                  "Value",
                  "Close Date",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deals.map((d, i) => (
                <tr
                  key={d.id}
                  data-ocid={`reseller_view.deals.item.${i + 1}`}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    {d.opportunityName}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {d.customerDomain || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {d.product || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-foreground tabular-nums">
                    {formatCurrency(d.estimatedValue)}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {d.closeDate ? formatDate(d.closeDate) : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={dealStatusColor(d.status)}>
                      {dealStatusLabel(d.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Business Plan Tab ─────────────────────────────────────────────────────────
function BusinessPlanTab({ plans }: { plans: BusinessPlan[] }) {
  return (
    <div className="space-y-4">
      {plans.length === 0 ? (
        <div
          className="crm-card flex flex-col items-center py-16"
          data-ocid="reseller_view.business_plan.empty_state"
        >
          <TrendingUp size={36} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No business plans
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Business plans for this reseller will appear here.
          </p>
        </div>
      ) : (
        plans.map((plan, i) => (
          <div
            key={plan.id}
            className="crm-card p-5"
            data-ocid={`reseller_view.business_plan.item.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {plan.planType} Plan ·{" "}
                  {plan.quarter ? `Q${plan.quarter} ` : ""}FY
                  {plan.year.toString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {plan.objective}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">Revenue Target</p>
                <p className="text-base font-bold" style={{ color: "#FF6B2B" }}>
                  {formatCurrency(plan.revenueTarget)}
                </p>
              </div>
            </div>
            {plan.activities.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Activities
                </p>
                {plan.activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-foreground">{act.description}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        act.status === "Completed"
                          ? "bg-green-500/15 text-green-400"
                          : act.status === "Overdue"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ── Activity Tab ──────────────────────────────────────────────────────────────
function ActivityTab({
  resellerName,
  accounts,
  deals,
}: {
  resellerName: string;
  accounts: Account[];
  deals: DealRegistration[];
}) {
  // Build a synthetic activity feed from available data
  type ActivityItem = {
    id: string;
    label: string;
    sub: string;
    ts: bigint;
    kind: "account" | "deal";
  };
  const feed: ActivityItem[] = [
    ...accounts.slice(0, 10).map((a) => ({
      id: `acc-${a.id}`,
      label: `Account updated: ${a.accountName}`,
      sub: `Status: ${a.status} · ${formatCurrency(a.estimatedRenewalValue)}`,
      ts: a.updatedAt,
      kind: "account" as const,
    })),
    ...deals.slice(0, 10).map((d) => ({
      id: `deal-${d.id}`,
      label: `Deal registration: ${d.opportunityName}`,
      sub: `${dealStatusLabel(d.status)} · ${formatCurrency(d.estimatedValue)}`,
      ts: d.updatedAt,
      kind: "deal" as const,
    })),
  ].sort((a, b) => Number(b.ts - a.ts));

  return (
    <div className="crm-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Recent Activity — {resellerName}
        </h3>
      </div>
      {feed.length === 0 ? (
        <div
          className="flex flex-col items-center py-16"
          data-ocid="reseller_view.activity.empty_state"
        >
          <Activity size={36} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No activity yet</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {feed.slice(0, 20).map((item, i) => (
            <div
              key={item.id}
              data-ocid={`reseller_view.activity.item.${i + 1}`}
              className="flex items-start gap-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background:
                    item.kind === "deal"
                      ? "rgba(255,107,43,0.15)"
                      : "rgba(255,255,255,0.06)",
                  color:
                    item.kind === "deal"
                      ? "#FF6B2B"
                      : "var(--muted-foreground)",
                }}
              >
                {item.kind === "deal" ? (
                  <ClipboardList size={12} />
                ) : (
                  <Building2 size={12} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.sub}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground flex-shrink-0">
                {formatDate(item.ts)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
