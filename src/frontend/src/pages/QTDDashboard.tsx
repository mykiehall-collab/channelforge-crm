import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  ChevronDown,
  Clock,
  Filter,
  Minus,
  RefreshCw,
  Settings,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../AppContext";
import { PartnerTier } from "../backend";
import { CurrencySelector } from "../components/CurrencySelector";
import TierBadge from "../components/TierBadge";
import { useForex } from "../hooks/useForex";
import { useTargets } from "../hooks/useTargets";
import type {
  PartnerQTDRanking,
  QTDFilters,
  QTDMetrics,
  QuarterDef,
  TargetMeasureId,
} from "../types";
import { formatCurrency } from "../utils/channelforge";

// ── Skeleton shimmer ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse bg-secondary/40 ${className ?? ""}`}
    />
  );
}

// ── Attainment badge ─────────────────────────────────────────────────────────
function AttainmentBadge({ pct }: { pct: number | null }) {
  if (pct === null)
    return <span className="text-xs text-muted-foreground">—</span>;
  const color =
    pct >= 100
      ? "bg-[#FF6B2B]/20 text-[#FF6B2B] border border-[#FF6B2B]/30"
      : pct >= 75
        ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/25"
        : "bg-red-500/15 text-red-400 border border-red-500/25";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold ${color}`}
    >
      {pct >= 100 && <TrendingUp className="w-2.5 h-2.5 mr-1" />}
      {pct.toFixed(1)}%
    </span>
  );
}

// ── Trend arrow ──────────────────────────────────────────────────────────────
function TrendIndicator({ delta }: { delta: number | null }) {
  if (delta === null)
    return <span className="text-muted-foreground text-xs font-mono">—</span>;
  if (Math.abs(delta) < 0.5)
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  if (delta > 0) return <ArrowUp className="w-3.5 h-3.5 text-green-400" />;
  return <ArrowDown className="w-3.5 h-3.5 text-red-400" />;
}

// ── Quarter progress bar ─────────────────────────────────────────────────────
function QuarterProgressBar({
  quarterDef,
  daysElapsed,
  daysRemaining,
  progressPercent,
}: {
  quarterDef: QuarterDef;
  daysElapsed: number;
  daysRemaining: number;
  progressPercent: number;
}) {
  const start = new Date(quarterDef.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const end = new Date(quarterDef.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-1.5 mt-1" data-ocid="qtd.progress_bar">
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>
          {quarterDef.name}: {start} – {end}
        </span>
        <span className="text-[#FF6B2B] font-bold">
          {progressPercent}% complete
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-secondary/50 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(100, progressPercent)}%`,
            background: "linear-gradient(90deg, #FF6B2B 0%, #FF8C55 100%)",
          }}
        />
      </div>
      <div className="text-[10px] font-mono text-muted-foreground">
        {daysElapsed} days elapsed · {daysRemaining} days remaining
      </div>
    </div>
  );
}

// ── Metric card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: number;
  target: number | null;
  isCurrency: boolean;
  currency: string;
  attainmentPct: number | null;
  delta: number | null;
  loading: boolean;
  ocid: string;
}

function MetricCard({
  label,
  value,
  target,
  isCurrency,
  currency,
  attainmentPct,
  delta,
  loading,
  ocid,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="metric-tile">
        <Skeleton className="h-3 w-32 mb-1" />
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  const displayValue = isCurrency
    ? formatCurrency(value, currency)
    : value.toLocaleString();

  const targetDisplay =
    target !== null
      ? isCurrency
        ? formatCurrency(target, currency)
        : target.toLocaleString()
      : null;

  return (
    <div className="metric-tile group" data-ocid={ocid}>
      <div className="flex items-start justify-between gap-2">
        <span className="metric-label uppercase tracking-wider text-[10px] font-semibold">
          {label}
        </span>
        <TrendIndicator delta={delta} />
      </div>
      <div className="metric-value text-3xl mt-1">{displayValue}</div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground font-mono">
          {targetDisplay !== null
            ? `Target: ${targetDisplay}`
            : "No target set"}
        </span>
        <AttainmentBadge pct={attainmentPct} />
      </div>
    </div>
  );
}

// ── Filter chip ──────────────────────────────────────────────────────────────
function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-accent/15 text-accent border border-accent/25">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="hover:text-foreground transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

// ── Rank medal left-border ────────────────────────────────────────────────────
const RANK_BORDERS = [
  "border-l-2 border-l-[#F0CC5A]", // Gold
  "border-l-2 border-l-[#C4C5C9]", // Silver
  "border-l-2 border-l-[#CD7F32]", // Bronze
];

// ── Main page ─────────────────────────────────────────────────────────────────
export function QTDDashboard() {
  const navigate = useNavigate();
  const { isVendor, fiscalYearConfig, currentQuarter } = useApp();
  const forex = useForex();
  const targets = useTargets();
  const vendorView = isVendor();

  // ── View toggle ────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<"vendor" | "partner">("vendor");

  // ── Filter state ───────────────────────────────────────────────────────────
  const [selectedQuarterKey, setSelectedQuarterKey] = useState<string | null>(
    null,
  );
  const [countries, setCountries] = useState<string[]>([]);
  const [countryInput, setCountryInput] = useState("");
  const [tiers, setTiers] = useState<string[]>([]);
  const [productFamilies, setProductFamilies] = useState<string[]>([]);
  const [productInput, setProductInput] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");

  // ── Data state ─────────────────────────────────────────────────────────────
  const [metrics, setMetrics] = useState<QTDMetrics | null>(null);
  const [rankings, setRankings] = useState<PartnerQTDRanking[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [noData, setNoData] = useState(false);

  // Ref to track whether initial data load has been triggered
  const didLoadRef = useRef(false);

  // ── Derived quarter info ───────────────────────────────────────────────────
  const quarters =
    fiscalYearConfig?.quarters ?? targets.fiscalYearConfig?.quarters ?? [];
  const activeQuarterDef = selectedQuarterKey
    ? (quarters.find((q) => q.quarterId === selectedQuarterKey) ?? null)
    : (currentQuarter?.quarterDef ??
      targets.currentQuarter?.quarterDef ??
      null);
  const activeCurrentQuarter = currentQuarter ?? targets.currentQuarter;

  const quarterLabel = activeQuarterDef
    ? `${activeQuarterDef.name} · ${new Date(activeQuarterDef.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – ${new Date(activeQuarterDef.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "No quarter configured";

  // ── FX timestamp ───────────────────────────────────────────────────────────
  const fxTimestamp = forex.lastUpdated
    ? (() => {
        const ms = Date.now() - forex.lastUpdated.getTime();
        const mins = Math.floor(ms / 60000);
        const hrs = Math.floor(ms / 3600000);
        if (mins < 60) return `${mins}m ago`;
        return `${hrs}h ago`;
      })()
    : "—";

  // ── Build filters ──────────────────────────────────────────────────────────
  const buildFilters = useCallback(
    (): QTDFilters => ({
      quarterKey: selectedQuarterKey ?? activeQuarterDef?.quarterId ?? null,
      country: countries.length ? countries[0] : null,
      resellerId: partnerFilter || null,
      tierName: tiers.length ? tiers[0] : null,
      productFamily: productFamilies.length ? productFamilies[0] : null,
      currency: forex.displayCurrency,
      targetSegment: null,
    }),
    [
      selectedQuarterKey,
      activeQuarterDef,
      countries,
      partnerFilter,
      tiers,
      productFamilies,
      forex.displayCurrency,
    ],
  );

  // ── Load QTD metrics ────────────────────────────────────────────────────────
  const loadMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    setNoData(false);
    try {
      const result = await targets.getQTDMetrics(buildFilters());
      setMetrics(result);
      if (!result) setNoData(true);
    } finally {
      setLoadingMetrics(false);
    }
  }, [targets, buildFilters]);

  const loadRankings = useCallback(async () => {
    if (!vendorView) return;
    const qKey = selectedQuarterKey ?? activeQuarterDef?.quarterId ?? "Q1";
    setLoadingRankings(true);
    try {
      const result = await targets.getPartnerRankings(qKey);
      setRankings(result);
    } finally {
      setLoadingRankings(false);
    }
  }, [vendorView, targets, selectedQuarterKey, activeQuarterDef]);

  // ── On mount load ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    loadMetrics();
    if (vendorView) loadRankings();
  }, [loadMetrics, loadRankings, vendorView]);

  // ── Apply filters ──────────────────────────────────────────────────────────
  function handleApplyFilters() {
    loadMetrics();
    if (vendorView) loadRankings();
  }

  function handleClearFilters() {
    setSelectedQuarterKey(null);
    setCountries([]);
    setCountryInput("");
    setTiers([]);
    setProductFamilies([]);
    setProductInput("");
    setPartnerFilter("");
  }

  // ── Metrics data ──────────────────────────────────────────────────────────
  // Use mock/zero data when no backend returns
  const safeMetrics: QTDMetrics = metrics ?? {
    resellerId: null,
    quarterKey: activeQuarterDef?.quarterId ?? "",
    renewalRevenue: 0,
    newBusinessRevenue: 0,
    pipelineCreated: 0,
    pipelineClosed: 0,
    dealRegistrationsSubmitted: 0,
    dealRegistrationsApproved: 0,
    currency: "USD",
    calculatedAt: BigInt(0),
  };

  type MetricDef = {
    id: TargetMeasureId;
    value: number;
    isCurrency: boolean;
    target: number | null;
    delta: number | null;
    ocid: string;
  };

  const metricDefs: MetricDef[] = [
    {
      id: "Measure1",
      value: safeMetrics.renewalRevenue,
      isCurrency: true,
      target: 240000,
      delta: 8.4,
      ocid: "qtd.metric_card.renewal_revenue",
    },
    {
      id: "Measure2",
      value: safeMetrics.newBusinessRevenue,
      isCurrency: true,
      target: 180000,
      delta: -3.2,
      ocid: "qtd.metric_card.new_business",
    },
    {
      id: "Measure3",
      value: safeMetrics.pipelineCreated,
      isCurrency: true,
      target: 520000,
      delta: 12.1,
      ocid: "qtd.metric_card.pipeline_created",
    },
    {
      id: "Measure4",
      value: safeMetrics.pipelineClosed,
      isCurrency: true,
      target: 310000,
      delta: 0.2,
      ocid: "qtd.metric_card.pipeline_closed",
    },
    {
      id: "Measure4" as TargetMeasureId,
      value: Number(safeMetrics.dealRegistrationsSubmitted),
      isCurrency: false,
      target: 120,
      delta: 5.0,
      ocid: "qtd.metric_card.dr_submitted",
    },
    {
      id: "Measure5" as TargetMeasureId,
      value: Number(safeMetrics.dealRegistrationsApproved),
      isCurrency: false,
      target: 95,
      delta: null,
      ocid: "qtd.metric_card.dr_approved",
    },
  ];

  const CUSTOM_LABELS: Record<string, string> = {
    "qtd.metric_card.dr_submitted": "Deal Regs Submitted",
    "qtd.metric_card.dr_approved": "Deal Regs Approved",
  };

  // ── Mock partner rankings ─────────────────────────────────────────────────
  const MOCK_RANKINGS: (PartnerQTDRanking & { tier: PartnerTier })[] = [
    {
      rank: 1,
      resellerId: "r1",
      resellerName: "Westbrook Technology",
      renewalRevenue: 342000,
      attainmentPercent: 142.5,
      tier: PartnerTier.Platinum,
    },
    {
      rank: 2,
      resellerId: "r2",
      resellerName: "Apex Solutions GmbH",
      renewalRevenue: 295000,
      attainmentPercent: 123.0,
      tier: PartnerTier.Gold,
    },
    {
      rank: 3,
      resellerId: "r3",
      resellerName: "CoreAxis Partners",
      renewalRevenue: 261000,
      attainmentPercent: 108.8,
      tier: PartnerTier.Platinum,
    },
    {
      rank: 4,
      resellerId: "r4",
      resellerName: "Luminary Systems",
      renewalRevenue: 218000,
      attainmentPercent: 90.8,
      tier: PartnerTier.Gold,
    },
    {
      rank: 5,
      resellerId: "r5",
      resellerName: "NovaBridge UK",
      renewalRevenue: 196000,
      attainmentPercent: 81.7,
      tier: PartnerTier.Silver,
    },
    {
      rank: 6,
      resellerId: "r6",
      resellerName: "Elevate Digital",
      renewalRevenue: 174000,
      attainmentPercent: 72.5,
      tier: PartnerTier.Gold,
    },
    {
      rank: 7,
      resellerId: "r7",
      resellerName: "CloudPath APAC",
      renewalRevenue: 152000,
      attainmentPercent: 63.3,
      tier: PartnerTier.Silver,
    },
    {
      rank: 8,
      resellerId: "r8",
      resellerName: "Synergy IT SA",
      renewalRevenue: 138000,
      attainmentPercent: 57.5,
      tier: PartnerTier.Silver,
    },
    {
      rank: 9,
      resellerId: "r9",
      resellerName: "Fortis Networks",
      renewalRevenue: 124000,
      attainmentPercent: 51.7,
      tier: PartnerTier.Silver,
    },
    {
      rank: 10,
      resellerId: "r10",
      resellerName: "Summit Tech Dubai",
      renewalRevenue: 109000,
      attainmentPercent: 45.4,
      tier: PartnerTier.Silver,
    },
  ];

  const displayRankings = rankings.length > 0 ? rankings : MOCK_RANKINGS;

  // ── No quarter configured state ───────────────────────────────────────────
  const noQuarterConfigured = !activeQuarterDef && !targets.loading;

  return (
    <div className="flex flex-col min-h-full" data-ocid="qtd.page">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div
        className="bg-card border-b border-border px-6 py-4"
        data-ocid="qtd.header"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: title + progress */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent flex-shrink-0" />
              <h1 className="text-xl font-display font-bold text-foreground">
                Quarter-to-Date Dashboard
              </h1>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {quarterLabel}
            </p>
            {activeCurrentQuarter && activeQuarterDef && (
              <QuarterProgressBar
                quarterDef={activeCurrentQuarter.quarterDef}
                daysElapsed={activeCurrentQuarter.daysElapsed}
                daysRemaining={activeCurrentQuarter.daysRemaining}
                progressPercent={activeCurrentQuarter.progressPercent}
              />
            )}
          </div>

          {/* Right: currency + FX badge */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/20 text-xs font-mono text-muted-foreground">
              <RefreshCw className="w-3 h-3" />
              <span>
                {forex.providerName
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")
                  .toUpperCase()}
              </span>
              <span className="text-border">·</span>
              <span>updated {fxTimestamp}</span>
            </div>
            <CurrencySelector forex={forex} compact />
          </div>
        </div>
      </div>

      {/* ── Filter panel ────────────────────────────────────────────────── */}
      <div
        className="bg-card/60 border-b border-border px-6 py-3"
        data-ocid="qtd.filter_panel"
      >
        <div className="flex flex-wrap gap-3 items-end">
          {/* Quarter */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="qtd-quarter-select"
              className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Quarter
            </label>
            <div className="relative">
              <select
                id="qtd-quarter-select"
                data-ocid="qtd.filter.quarter_select"
                value={selectedQuarterKey ?? ""}
                onChange={(e) => setSelectedQuarterKey(e.target.value || null)}
                className="crm-input h-8 text-xs pr-7 pl-2 appearance-none min-w-[90px]"
              >
                <option value="">Current</option>
                {quarters.map((q) => (
                  <option key={q.quarterId} value={q.quarterId}>
                    {q.name}
                  </option>
                ))}
                <option value="ALL">All</option>
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Country chips */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="qtd-country-input"
              className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Country / Region
            </label>
            <div className="flex items-center gap-1 flex-wrap">
              {countries.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  onRemove={() => setCountries((p) => p.filter((x) => x !== c))}
                />
              ))}
              <input
                id="qtd-country-input"
                type="text"
                data-ocid="qtd.filter.country_input"
                placeholder="+ Add"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && countryInput.trim()) {
                    setCountries((p) => [...p, countryInput.trim()]);
                    setCountryInput("");
                  }
                }}
                className="crm-input h-8 text-xs px-2 w-20"
              />
            </div>
          </div>

          {/* Partner */}
          {vendorView && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="qtd-partner-input"
                className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Reseller
              </label>
              <input
                id="qtd-partner-input"
                type="text"
                data-ocid="qtd.filter.partner_input"
                placeholder="Filter reseller…"
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="crm-input h-8 text-xs px-2 w-36"
              />
            </div>
          )}

          {/* Tier checkboxes */}
          <fieldset className="flex flex-col gap-1">
            <legend className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
              Reseller Tier
            </legend>
            <div className="flex items-center gap-3 h-8">
              {(["Silver", "Gold", "Platinum"] as const).map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    data-ocid={`qtd.filter.tier_${t.toLowerCase()}`}
                    checked={tiers.includes(t)}
                    onChange={(e) =>
                      setTiers((p) =>
                        e.target.checked ? [...p, t] : p.filter((x) => x !== t),
                      )
                    }
                    className="w-3 h-3 accent-[#FF6B2B]"
                  />
                  <span className="text-xs text-foreground">{t}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Product family chips */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="qtd-product-input"
              className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Product Family
            </label>
            <div className="flex items-center gap-1 flex-wrap">
              {productFamilies.map((p) => (
                <Chip
                  key={p}
                  label={p}
                  onRemove={() =>
                    setProductFamilies((prev) => prev.filter((x) => x !== p))
                  }
                />
              ))}
              <input
                id="qtd-product-input"
                type="text"
                data-ocid="qtd.filter.product_input"
                placeholder="+ Add"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && productInput.trim()) {
                    setProductFamilies((p) => [...p, productInput.trim()]);
                    setProductInput("");
                  }
                }}
                className="crm-input h-8 text-xs px-2 w-20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2 ml-auto">
            <button
              type="button"
              data-ocid="qtd.filter.clear_button"
              onClick={handleClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors h-8 px-2"
            >
              Clear
            </button>
            <button
              type="button"
              data-ocid="qtd.filter.apply_button"
              onClick={handleApplyFilters}
              className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#FF6B2B] text-white text-xs font-semibold hover:bg-[#FF8C55] transition-colors"
            >
              <Filter className="w-3 h-3" />
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex-1 p-6 space-y-6 bg-background">
        {/* No quarter configured CTA */}
        {noQuarterConfigured && (
          <div
            data-ocid="qtd.no_quarter_state"
            className="flex flex-col items-center justify-center gap-4 py-16 px-6 rounded-xl border-2 border-dashed border-accent/30 bg-accent/5"
          >
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
              <Settings className="w-7 h-7 text-accent" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-display font-bold text-foreground mb-1">
                Fiscal Year Not Configured
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Set up your fiscal year and quarter dates to activate QTD
                reporting and track performance against targets.
              </p>
            </div>
            <button
              type="button"
              data-ocid="qtd.setup_cta_button"
              onClick={() => navigate({ to: "/admin/quarter-setup" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF6B2B] text-white font-semibold text-sm hover:bg-[#FF8C55] transition-colors"
            >
              Set Up Quarter Configuration
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metric cards 2×3 grid */}
        {!noQuarterConfigured && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                QTD Performance
              </h2>
              {loadingMetrics && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Loading metrics…</span>
                </div>
              )}
            </div>

            {/* No data state */}
            {noData && !loadingMetrics && (
              <div
                data-ocid="qtd.metrics.empty_state"
                className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl border border-dashed border-border bg-secondary/10"
              >
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  No data matches your filter selection. Try adjusting the
                  filters above.
                </p>
              </div>
            )}

            <div
              className="grid grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="qtd.metric_cards_grid"
            >
              {metricDefs.map((m) => {
                const label =
                  CUSTOM_LABELS[m.ocid] ?? targets.getMeasureDisplayName(m.id);
                const attainment =
                  m.target !== null && m.target > 0
                    ? Math.round((m.value / m.target) * 1000) / 10
                    : null;
                return (
                  <MetricCard
                    key={m.ocid}
                    label={label}
                    value={
                      m.isCurrency
                        ? forex.convertAmount(m.value, safeMetrics.currency)
                        : m.value
                    }
                    target={m.target}
                    isCurrency={m.isCurrency}
                    currency={forex.displayCurrency}
                    attainmentPct={attainment}
                    delta={m.delta}
                    loading={loadingMetrics}
                    ocid={m.ocid}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* View toggle — vendor only */}
        {vendorView && !noQuarterConfigured && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-card border border-border w-fit">
            <button
              type="button"
              data-ocid="qtd.view_toggle.vendor"
              onClick={() => setViewMode("vendor")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === "vendor"
                  ? "bg-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Vendor-wide
            </button>
            <button
              type="button"
              data-ocid="qtd.view_toggle.partner"
              onClick={() => setViewMode("partner")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === "partner"
                  ? "bg-accent text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              By Reseller
            </button>
          </div>
        )}

        {/* Partner ranking table — vendor only */}
        {vendorView && !noQuarterConfigured && (
          <div data-ocid="qtd.rankings_section">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                <h2 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                  Reseller Performance Rankings — QTD
                </h2>
              </div>
              {loadingRankings && (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              )}
            </div>

            <div className="crm-card overflow-hidden">
              <table className="w-full text-sm" data-ocid="qtd.rankings_table">
                <thead>
                  <tr className="border-b border-border bg-[#0F1A2C]">
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider w-12">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                      Reseller
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                      Renewal Revenue
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                      Attainment
                    </th>
                    <th className="px-4 py-3 text-right text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                      vs Last Qtr
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingRankings
                    ? ["s0", "s1", "s2", "s3", "s4"].map((sk) => (
                        <tr
                          key={`skel-row-${sk}`}
                          className="border-b border-border/40"
                        >
                          {["c0", "c1", "c2", "c3", "c4", "c5"].map((ck) => (
                            <td
                              key={`skel-cell-${sk}-${ck}`}
                              className="px-4 py-3"
                            >
                              <Skeleton className="h-3 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : displayRankings.slice(0, 10).map((r, idx) => {
                        const borderClass = RANK_BORDERS[idx] ?? "";
                        const rowBg =
                          idx % 2 === 0
                            ? "bg-background/30"
                            : "bg-background/10";
                        const tier =
                          (r as (typeof MOCK_RANKINGS)[number]).tier ??
                          PartnerTier.Silver;
                        // Mock delta value
                        const deltaPct =
                          [
                            12.3, 5.1, -2.4, 8.7, -6.0, 3.2, -1.1, 4.5, -8.3,
                            0.7,
                          ][idx] ?? null;
                        return (
                          <tr
                            key={r.resellerId}
                            data-ocid={`qtd.rankings_table.item.${idx + 1}`}
                            className={`border-b border-border/30 cursor-pointer hover:bg-secondary/20 transition-colors ${borderClass} ${rowBg}`}
                            onClick={() =>
                              navigate({ to: `/reseller/${r.resellerId}` })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                navigate({ to: `/reseller/${r.resellerId}` });
                            }}
                            tabIndex={0}
                          >
                            <td className="px-4 py-3">
                              <span
                                className={`text-sm font-mono font-bold ${
                                  idx === 0
                                    ? "text-[#F0CC5A]"
                                    : idx === 1
                                      ? "text-[#C4C5C9]"
                                      : idx === 2
                                        ? "text-[#CD7F32]"
                                        : "text-muted-foreground"
                                }`}
                              >
                                {idx < 3
                                  ? ["🥇", "🥈", "🥉"][idx]
                                  : `#${r.rank}`}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-medium text-foreground text-sm">
                                {r.resellerName}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <TierBadge tier={tier} size="sm" />
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                              {formatCurrency(
                                forex.convertAmount(r.renewalRevenue, "USD"),
                                forex.displayCurrency,
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <AttainmentBadge pct={r.attainmentPercent} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <TrendIndicator delta={deltaPct} />
                                {deltaPct !== null && (
                                  <span
                                    className={`text-xs font-mono ${
                                      deltaPct > 0
                                        ? "text-green-400"
                                        : deltaPct < 0
                                          ? "text-red-400"
                                          : "text-muted-foreground"
                                    }`}
                                  >
                                    {deltaPct > 0 ? "+" : ""}
                                    {deltaPct.toFixed(1)}%
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>

              {/* View all link */}
              <div className="px-4 py-3 border-t border-border/40 flex justify-end">
                <button
                  type="button"
                  data-ocid="qtd.rankings_table.view_all_button"
                  onClick={() =>
                    navigate({ to: "/reseller/$id", params: { id: "all" } })
                  }
                  className="flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold transition-colors"
                >
                  View all resellers
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Dashboard footer ────────────────────────────────────────────── */}
      <div
        className="border-t border-border bg-card px-6 py-3 flex items-center justify-between flex-wrap gap-2"
        data-ocid="qtd.footer"
      >
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
          <span>
            FX Source: {forex.providerName.split(" ").slice(0, 2).join(" ")}
          </span>
          <span className="text-border">·</span>
          <span>
            Rate captured:{" "}
            {forex.lastUpdated?.toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              month: "short",
              day: "numeric",
            }) ?? "—"}
          </span>
          <span className="text-border">·</span>
          <span>
            Quarter:{" "}
            {activeQuarterDef
              ? `${activeQuarterDef.name} ${new Date(activeQuarterDef.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(activeQuarterDef.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
              : "Not configured"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Last refreshed: just now</span>
        </div>
      </div>
    </div>
  );
}
