import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CreditCard,
  Database,
  ExternalLink,
  FlameKindling,
  Lock,
  ServerCog,
  Share2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import type { CreditVisibilityEntry } from "./Foundry/CreditVisibilityManagement";

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_DATA = {
  totalPurchased: 50000,
  totalUsed: 34200,
  remaining: 15800,
  usedPercent: 68.4,
  burnRatePerDay: 1140,
  projectedDepletionDays: 13,
  currentMonthUsage: 21800,
  ytdUsage: 34200,
  aiUsedPercent: 62,
  storageUsedPercent: 44,
  computeUsedPercent: 71,
};

const TOP_USERS = [
  {
    name: "Sarah Chen",
    role: "Sales Lead",
    credits: 2840,
    trend: "+12%",
    trendUp: true,
  },
  {
    name: "Marcus Reid",
    role: "Marketing Dir",
    credits: 2410,
    trend: "+28%",
    trendUp: true,
  },
  {
    name: "Alex Torres",
    role: "Account Manager",
    credits: 1980,
    trend: "-5%",
    trendUp: false,
  },
  {
    name: "Jordan Kim",
    role: "Sales Ops",
    credits: 1750,
    trend: "+8%",
    trendUp: true,
  },
  {
    name: "Emma Walsh",
    role: "CS Manager",
    credits: 1420,
    trend: "+3%",
    trendUp: true,
  },
];

const TOP_TEAMS = [
  { name: "Sales Team", percent: 38, credits: 13000, trend: "+15%" },
  { name: "Marketing Team", percent: 24, credits: 8200, trend: "+31%" },
  { name: "Customer Success", percent: 18, credits: 6156, trend: "+4%" },
  { name: "Sales Ops", percent: 12, credits: 4104, trend: "+9%" },
  { name: "IT / Ops", percent: 8, credits: 2736, trend: "-2%" },
];

const TOP_FEATURES = [
  {
    name: "ForgeAI Chat",
    credits: 11628,
    percent: 34,
    trend: "+22%",
    trendUp: true,
  },
  {
    name: "Report Generation",
    credits: 6498,
    percent: 19,
    trend: "+11%",
    trendUp: true,
  },
  {
    name: "File & Asset Uploads",
    credits: 4788,
    percent: 14,
    trend: "+7%",
    trendUp: true,
  },
  {
    name: "Dashboard Refreshes",
    credits: 3762,
    percent: 11,
    trend: "-3%",
    trendUp: false,
  },
  {
    name: "Account Exports",
    credits: 3078,
    percent: 9,
    trend: "+5%",
    trendUp: true,
  },
];

const LINKED_ECOSYSTEM = [
  { name: "Ingram Micro", type: "Distributor", credits: 4200, percent: 12 },
  {
    name: "Nordic Cloud Solutions",
    type: "Reseller",
    credits: 2100,
    percent: 6,
  },
  {
    name: "FutureStack Technologies",
    type: "Reseller",
    credits: 1580,
    percent: 5,
  },
];

const SPARKLINE_30D = [
  820, 890, 950, 1020, 980, 1100, 1150, 1080, 1240, 1300, 1180, 1350, 1420,
  1380, 1450, 1520, 1480, 1600, 1580, 1650, 1700, 1680, 1750, 1820, 1800, 1900,
  1850, 1950, 2100, 2180,
];

// ─── Types ───────────────────────────────────────────────────────────────────
type AlertState = "healthy" | "info" | "warning" | "critical";

function getAlertState(remainingPct: number): AlertState {
  if (remainingPct < 10) return "critical";
  if (remainingPct < 25) return "warning";
  if (remainingPct < 50) return "info";
  return "healthy";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  glow = false,
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  "data-ocid"?: string;
}) {
  return (
    <div
      data-ocid={dataOcid}
      className={`rounded-xl border backdrop-blur-sm ${
        glow
          ? "border-orange-500/30 shadow-[0_0_24px_rgba(249,115,22,0.08),inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      } bg-white/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

function HealthBadge({ state }: { state: AlertState }) {
  const config = {
    healthy: {
      label: "Healthy",
      cls: "bg-teal-500/15 text-teal-400 border-teal-500/25",
    },
    info: {
      label: "Monitor",
      cls: "bg-amber-500/10 text-amber-400/90 border-amber-500/20",
    },
    warning: {
      label: "Warning",
      cls: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    },
    critical: {
      label: "Critical",
      cls: "bg-red-500/15 text-red-400 border-red-500/25",
    },
  }[state];
  return (
    <span
      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${config.cls}`}
    >
      {config.label}
    </span>
  );
}

function MiniAllocationBar({
  percent,
  colorClass = "bg-orange-500",
}: { percent: number; colorClass?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-700`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

function TrendPill({ trend, up }: { trend: string; up: boolean }) {
  return (
    <span
      className={`flex items-center gap-0.5 text-[10px] font-semibold ${
        up ? "text-orange-400" : "text-muted-foreground/70"
      }`}
    >
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {trend}
    </span>
  );
}

function InlineSvgSparkline({ data }: { data: number[] }) {
  const W = 200;
  const H = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const polyFill = `0,${H} ${pts} ${W},${H}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-10"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(249,115,22)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(249,115,22)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={polyFill} fill="url(#spark-grad)" />
      <polyline
        points={pts}
        fill="none"
        stroke="rgb(249,115,22)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const mini = data.slice(-10);
  const W = 60;
  const H = 20;
  const max = Math.max(...mini);
  const min = Math.min(...mini);
  const range = max - min || 1;
  const pts = mini
    .map((v, i) => {
      const x = (i / (mini.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 3) - 1.5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-16 h-5"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="rgba(249,115,22,0.6)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: boolean;
}) {
  return (
    <GlassCard className="p-4 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-orange-500/10 border border-orange-500/15 flex-shrink-0">
          <Icon size={13} className="text-orange-400" />
        </div>
        <span className="text-[11px] text-muted-foreground font-medium truncate">
          {label}
        </span>
      </div>
      <span
        className={`text-xl font-bold tracking-tight leading-none ${
          accent ? "text-orange-400" : "text-foreground"
        }`}
      >
        {value}
      </span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </GlassCard>
  );
}

function UsageOverviewMini({
  label,
  percent,
  icon: Icon,
  color,
  sparkData,
}: {
  label: string;
  percent: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  sparkData: number[];
}) {
  const isHigh = percent >= 70;
  return (
    <GlassCard className="p-3.5 flex flex-col gap-2" glow={isHigh}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={13} className="text-orange-400" />
          <span className="text-[11px] font-medium text-muted-foreground">
            {label}
          </span>
        </div>
        <span
          className={`text-sm font-bold ${isHigh ? "text-orange-400" : "text-foreground"}`}
        >
          {percent}%
        </span>
      </div>
      <MiniAllocationBar percent={percent} colorClass={color} />
      <MiniSparkline data={sparkData} />
    </GlassCard>
  );
}

// ─── Locked Placeholder ───────────────────────────────────────────────────────
function LockedPlaceholder() {
  return (
    <div
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 flex flex-col items-center justify-center gap-4 opacity-70"
      data-ocid="credit_usage.locked_card"
    >
      <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
        <Lock size={20} className="text-muted-foreground" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-foreground">
          Credit Usage Insights
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Contact your Primary Admin to request access to credit intelligence.
        </p>
      </div>
    </div>
  );
}

// ─── Main Widget ─────────────────────────────────────────────────────────────
export function CreditUsageInsightsWidget() {
  const { isPrimaryAdmin, userProfile } = useApp();
  const navigate = useNavigate();
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const key = "cf_credit_usage_seeded";
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "true");
    }
    setSeeded(true);
  }, []);

  // Access check: Primary Admin always has access.
  // Secondary admins need explicit permission via channelforge_credit_visibility_list.
  const hasPrimaryAccess = isPrimaryAdmin();
  const creditVisibility = (() => {
    try {
      const raw = localStorage.getItem("channelforge_credit_visibility_list");
      if (!raw) return [] as CreditVisibilityEntry[];
      return JSON.parse(raw) as CreditVisibilityEntry[];
    } catch {
      return [] as CreditVisibilityEntry[];
    }
  })();
  const hasSecondaryAccess =
    !hasPrimaryAccess &&
    userProfile?.email !== undefined &&
    creditVisibility.some((entry) => entry.email === userProfile.email);

  if (!hasPrimaryAccess && !hasSecondaryAccess) {
    return <LockedPlaceholder />;
  }

  const remainingPct = 100 - SEED_DATA.usedPercent;
  const alertState = getAlertState(remainingPct);

  const operationalHealth: AlertState =
    SEED_DATA.computeUsedPercent >= 90
      ? "critical"
      : SEED_DATA.computeUsedPercent >= 70
        ? "warning"
        : "healthy";

  // Prevent hydration mismatch flash
  if (!seeded) return null;

  return (
    <div
      className="rounded-2xl border border-white/[0.08] bg-[#0a1628] overflow-hidden"
      data-ocid="credit_usage.widget"
      style={{
        boxShadow:
          "0 0 40px rgba(249,115,22,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* ── Widget Header ── */}
      <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20 flex-shrink-0">
            <Zap size={16} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground font-display">
              Credit Usage Insights
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Operational infrastructure consumption overview
            </p>
          </div>
          <HealthBadge state={operationalHealth} />
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/foundry" })}
          className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 border border-orange-500/25 px-3.5 py-1.5 rounded-lg hover:bg-orange-500/10 transition-colors flex-shrink-0"
          data-ocid="credit_usage.view_full_button"
        >
          View Full Usage
          <ExternalLink size={12} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* ── Alert Banner ── */}
        {alertState === "warning" && (
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl bg-orange-500/[0.08] border border-orange-500/20"
            data-ocid="credit_usage.alert_banner"
            role="alert"
          >
            <AlertTriangle
              size={15}
              className="text-orange-400 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-orange-300">
                Credit balance below 50%. Monitor usage to avoid service
                interruption.
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                At current burn rate, credits are projected to deplete in{" "}
                <span className="font-semibold text-foreground">
                  {SEED_DATA.projectedDepletionDays} days
                </span>
                .
              </p>
            </div>
          </div>
        )}
        {alertState === "critical" && (
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20"
            data-ocid="credit_usage.alert_banner"
            role="alert"
          >
            <AlertTriangle
              size={15}
              className="text-red-400 flex-shrink-0 mt-0.5"
            />
            <p className="text-xs font-semibold text-red-300">
              Urgent: Credit balance critically low. Immediate top-up required.
            </p>
          </div>
        )}

        {/* ── Credit Overview: 4 Metric Cards ── */}
        <div>
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Credit Overview
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              label="Total Purchased"
              value={SEED_DATA.totalPurchased.toLocaleString()}
              sub="Infrastructure credits"
              icon={CreditCard}
            />
            <MetricCard
              label="Credits Used"
              value={`${SEED_DATA.totalUsed.toLocaleString()} (${SEED_DATA.usedPercent}%)`}
              sub={`${SEED_DATA.currentMonthUsage.toLocaleString()} this month`}
              icon={BarChart3}
              accent
            />
            <MetricCard
              label="Remaining"
              value={SEED_DATA.remaining.toLocaleString()}
              sub={`${remainingPct.toFixed(1)}% of allocation`}
              icon={ShieldCheck}
            />
            <MetricCard
              label="Daily Burn Rate"
              value={`${SEED_DATA.burnRatePerDay.toLocaleString()}/day`}
              sub={`Depletion in ~${SEED_DATA.projectedDepletionDays} days`}
              icon={FlameKindling}
              accent
            />
          </div>
        </div>

        {/* ── 30-Day Usage Chart ── */}
        <GlassCard className="p-4" data-ocid="credit_usage.sparkline_chart">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                30-Day Usage Trend
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                YTD Usage:{" "}
                <span className="font-semibold text-foreground">
                  {SEED_DATA.ytdUsage.toLocaleString()}
                </span>{" "}
                credits
              </p>
            </div>
            <TrendPill trend="+18% vs last month" up />
          </div>
          <InlineSvgSparkline data={SPARKLINE_30D} />
        </GlassCard>

        {/* ── AI / Storage / Compute Mini Overview ── */}
        <div>
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Infrastructure Allocation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <UsageOverviewMini
              label="AI Operational Capacity"
              percent={SEED_DATA.aiUsedPercent}
              icon={Brain}
              color="bg-purple-500"
              sparkData={SPARKLINE_30D.slice(0, 10).map((v) => v * 0.62)}
            />
            <UsageOverviewMini
              label="Storage Allocation"
              percent={SEED_DATA.storageUsedPercent}
              icon={Database}
              color="bg-blue-500"
              sparkData={SPARKLINE_30D.slice(10, 20).map((v) => v * 0.44)}
            />
            <UsageOverviewMini
              label="Compute Consumption"
              percent={SEED_DATA.computeUsedPercent}
              icon={ServerCog}
              color="bg-orange-500"
              sparkData={SPARKLINE_30D.slice(20, 30).map((v) => v * 0.71)}
            />
          </div>
        </div>

        {/* ── Top Users / Teams / Features ── */}
        <div>
          <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Top Consumers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top Users */}
            <GlassCard className="p-4" data-ocid="credit_usage.top_users">
              <div className="flex items-center gap-2 mb-4">
                <Users size={13} className="text-orange-400" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Heavy Users
                </span>
              </div>
              <div className="space-y-3">
                {TOP_USERS.map((u, idx) => (
                  <div
                    key={u.name}
                    className="flex items-center gap-2"
                    data-ocid={`credit_usage.top_user.${idx + 1}`}
                  >
                    <span className="text-[10px] font-bold text-muted-foreground/50 w-3 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {u.name}
                        </span>
                        <TrendPill trend={u.trend} up={u.trendUp} />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {u.role}
                        </span>
                        <span className="text-[10px] font-semibold text-orange-400">
                          {u.credits.toLocaleString()} cr
                        </span>
                      </div>
                      <MiniAllocationBar
                        percent={(u.credits / TOP_USERS[0].credits) * 100}
                        colorClass="bg-orange-500/50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Top Teams */}
            <GlassCard className="p-4" data-ocid="credit_usage.top_teams">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={13} className="text-orange-400" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Heavy Teams
                </span>
              </div>
              <div className="space-y-3">
                {TOP_TEAMS.map((t, idx) => (
                  <div
                    key={t.name}
                    className="space-y-1.5"
                    data-ocid={`credit_usage.top_team.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground/50">
                          {idx + 1}.
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {t.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {t.trend}
                        </span>
                        <span className="text-[10px] font-bold text-orange-400">
                          {t.percent}%
                        </span>
                      </div>
                    </div>
                    <MiniAllocationBar
                      percent={t.percent}
                      colorClass="bg-orange-500/40"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {t.credits.toLocaleString()} credits
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Top Features */}
            <GlassCard className="p-4" data-ocid="credit_usage.top_features">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={13} className="text-orange-400" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Feature Usage
                </span>
              </div>
              <div className="space-y-3">
                {TOP_FEATURES.map((f, idx) => (
                  <div
                    key={f.name}
                    className="space-y-1.5"
                    data-ocid={`credit_usage.top_feature.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground/50">
                          {idx + 1}.
                        </span>
                        <span className="text-xs font-semibold text-foreground truncate">
                          {f.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendPill trend={f.trend} up={f.trendUp} />
                        <span className="text-[10px] font-bold text-orange-400">
                          {f.percent}%
                        </span>
                      </div>
                    </div>
                    <MiniAllocationBar
                      percent={f.percent}
                      colorClass="bg-orange-500/50"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {f.credits.toLocaleString()} credits
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ── Linked Ecosystem Snapshot ── */}
        <GlassCard className="p-4" data-ocid="credit_usage.ecosystem_panel">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink size={13} className="text-orange-400" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Linked Ecosystem Usage
            </span>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {LINKED_ECOSYSTEM.reduce((s, e) => s + e.percent, 0)}% of total
              consumption
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LINKED_ECOSYSTEM.map((org, idx) => (
              <div
                key={org.name}
                className="rounded-lg p-3 bg-white/[0.03] border border-white/[0.06] space-y-2"
                data-ocid={`credit_usage.ecosystem_item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {org.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {org.type}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-orange-400 flex-shrink-0">
                    {org.percent}%
                  </span>
                </div>
                <MiniAllocationBar
                  percent={org.percent * 4}
                  colorClass="bg-orange-400/40"
                />
                <p className="text-[10px] text-muted-foreground">
                  {org.credits.toLocaleString()} credits consumed
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── CTA Row ── */}
        <div
          className="flex flex-wrap items-center gap-2 pt-1"
          data-ocid="credit_usage.cta_row"
        >
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/foundry",
                search: { tab: "infrastructure", section: "top-up" },
              })
            }
            className="flex items-center gap-1.5 text-xs font-semibold bg-orange-500/10 border border-orange-500/25 text-orange-400 px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-colors"
            data-ocid="credit_usage.buy_credits_button"
          >
            <CreditCard size={13} />
            Buy Credits
          </button>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/foundry",
                search: { tab: "infrastructure", section: "credit-visibility" },
              })
            }
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-white/[0.07] transition-colors"
            data-ocid="credit_usage.share_button"
          >
            <Share2 size={13} />
            Share With Secondary Admin
          </button>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/foundry",
                search: { tab: "infrastructure", section: "alerts" },
              })
            }
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-white/[0.07] transition-colors"
            data-ocid="credit_usage.configure_alerts_button"
          >
            <AlertTriangle size={13} />
            Configure Alerts
          </button>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => navigate({ to: "/foundry" })}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-orange-400 transition-colors"
              data-ocid="credit_usage.view_full_usage_link"
            >
              View Full Usage in The Foundry <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
