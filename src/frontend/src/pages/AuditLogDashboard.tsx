import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { UserRole } from "../backend";
import type { AuditEntry } from "../backend.d";
import { useActor } from "../hooks/useActor";

// ─── Constants ───────────────────────────────────────────────────────────────

const ORANGE = "#FF6B2B";
const PAGE_SIZE = 25;

type DecisionCategory = "all" | "tier" | "forex" | "duplicate_dr" | "general";

const CATEGORY_ACTIONS: Record<string, DecisionCategory> = {
  TIER_PERMISSION_CHANGE: "tier",
  TIER_ASSIGNED: "tier",
  TIER_OVERRIDE_ADDED: "tier",
  FOREX_CONFIG_CHANGE: "forex",
  DUPLICATE_DR_FLAGGED: "duplicate_dr",
  DUPLICATE_DR_REVIEWED: "duplicate_dr",
};

const CATEGORY_LABELS: Record<DecisionCategory, string> = {
  all: "All Categories",
  tier: "Tier Permission Changes",
  forex: "Forex Configuration",
  duplicate_dr: "Duplicate DR Decisions",
  general: "General",
};

const CATEGORY_COLORS: Record<DecisionCategory, string> = {
  all: "rgba(125,138,160,0.7)",
  tier: "#6B7FFF",
  forex: "#22C55E",
  duplicate_dr: ORANGE,
  general: "rgba(125,138,160,0.7)",
};

function getCategory(action: string): DecisionCategory {
  return CATEGORY_ACTIONS[action] ?? "general";
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  if (ms < 1_000_000_000_000) return "\u2014";
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Summary stats ────────────────────────────────────────────────────────────

interface SummaryStats {
  total: number;
  tier: number;
  forex: number;
  dupApproved: number;
  dupRejected: number;
  dupTotal: number;
}

function computeStats(entries: AuditEntry[]): SummaryStats {
  let tier = 0;
  let forex = 0;
  let dupApproved = 0;
  let dupRejected = 0;
  for (const e of entries) {
    const cat = getCategory(e.action);
    if (cat === "tier") tier++;
    else if (cat === "forex") forex++;
    else if (cat === "duplicate_dr") {
      if (e.action === "DUPLICATE_DR_REVIEWED") {
        const lower = e.details.toLowerCase();
        if (lower.includes("approved")) dupApproved++;
        else if (lower.includes("rejected")) dupRejected++;
      }
    }
  }
  return {
    total: entries.length,
    tier,
    forex,
    dupApproved,
    dupRejected,
    dupTotal: dupApproved + dupRejected,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CategoryBadge({ action }: { action: string }) {
  const cat = getCategory(action);
  const color = CATEGORY_COLORS[cat];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {CATEGORY_LABELS[cat]}
    </span>
  );
}

function StatTile({
  label,
  value,
  sub,
  color,
}: { label: string; value: number; sub?: string; color?: string }) {
  return (
    <div
      className="metric-tile"
      style={{ borderLeft: `3px solid ${color ?? ORANGE}` }}
    >
      <div
        className="text-3xl font-black font-display leading-none"
        style={{ color: color ?? ORANGE }}
      >
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      {sub && (
        <div className="text-[11px] text-muted-foreground opacity-70">
          {sub}
        </div>
      )}
    </div>
  );
}

function ActiveFilterBadge({
  label,
  onRemove,
}: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{
        background: `${ORANGE}15`,
        border: `1px solid ${ORANGE}40`,
        color: ORANGE,
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
        aria-label={`Remove filter: ${label}`}
      >
        <X size={10} />
      </button>
    </span>
  );
}

// ─── Row drill-down panel ──────────────────────────────────────────────────

function DrillDownPanel({
  entry,
  onClose,
}: { entry: AuditEntry; onClose: () => void }) {
  let details: Record<string, string> = {};
  try {
    details = JSON.parse(entry.details) as Record<string, string>;
  } catch {
    details = { details: entry.details };
  }
  return (
    <div
      data-ocid="audit_log.drill_down.panel"
      className="crm-card p-5 mt-2 fade-in"
      style={{ borderLeft: `3px solid ${ORANGE}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Activity size={14} style={{ color: ORANGE }} />
          Entry Details
        </h4>
        <button
          type="button"
          data-ocid="audit_log.drill_down.close_button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          aria-label="Close details"
        >
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
        <div className="flex gap-2">
          <span className="text-muted-foreground w-28 flex-shrink-0">
            Entry ID
          </span>
          <span className="text-foreground font-mono break-all">
            {entry.id}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground w-28 flex-shrink-0">
            Timestamp
          </span>
          <span className="text-foreground">
            {formatTimestamp(entry.timestamp)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground w-28 flex-shrink-0">
            Action
          </span>
          <span className="text-foreground font-semibold">
            {formatAction(entry.action)}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground w-28 flex-shrink-0">
            Entity Type
          </span>
          <span className="text-foreground">
            {entry.entityType || "\u2014"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground w-28 flex-shrink-0">
            Entity ID
          </span>
          <span className="text-foreground font-mono break-all">
            {entry.entityId || "\u2014"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground w-28 flex-shrink-0">
            Reviewer
          </span>
          <span className="text-foreground">{entry.userId || "\u2014"}</span>
        </div>
      </div>
      {Object.keys(details).length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Decision Details
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
            {Object.entries(details).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span
                  className="text-muted-foreground flex-shrink-0 capitalize"
                  style={{ minWidth: "7rem" }}
                >
                  {k.replace(/_/g, " ")}
                </span>
                <span className="text-foreground break-all">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AuditLogDashboard() {
  const navigate = useNavigate();
  const { userProfile, isVendor } = useApp();
  const { actor } = useActor();

  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<DecisionCategory>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [resellerFilter, setResellerFilter] = useState("");
  const [reviewerFilter, setReviewerFilter] = useState("");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const isVendorAdmin =
    userProfile?.role === UserRole.VendorAdmin ||
    userProfile?.role === UserRole.VendorPrimaryAdmin ||
    userProfile?.role === UserRole.VendorSecondaryAdmin ||
    isVendor();

  const loadEntries = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError("");
    try {
      const raw = await actor.getAuditLog(BigInt(500));
      setEntries(raw);
    } catch {
      setError("Failed to load audit log. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor) loadEntries();
  }, [actor, loadEntries]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allResellers = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      const match = e.details.match(/reseller[_\s]?(?:id)?[:\s]+([\w-]+)/i);
      if (match?.[1]) set.add(match[1]);
    }
    return Array.from(set).sort();
  }, [entries]);

  const allReviewers = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      if (e.userId) set.add(e.userId);
    }
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    let list = [...entries];
    if (category !== "all")
      list = list.filter((e) => getCategory(e.action) === category);
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      list = list.filter((e) => Number(e.timestamp) / 1_000_000 >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86_400_000;
      list = list.filter((e) => Number(e.timestamp) / 1_000_000 <= to);
    }
    if (resellerFilter)
      list = list.filter((e) =>
        e.details.toLowerCase().includes(resellerFilter.toLowerCase()),
      );
    if (reviewerFilter)
      list = list.filter((e) =>
        e.userId.toLowerCase().includes(reviewerFilter.toLowerCase()),
      );
    const q = search.trim().toLowerCase();
    if (q)
      list = list.filter(
        (e) =>
          e.action.toLowerCase().includes(q) ||
          e.entityId.toLowerCase().includes(q) ||
          e.entityType.toLowerCase().includes(q) ||
          e.userId.toLowerCase().includes(q) ||
          e.details.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q),
      );
    list.sort((a, b) => {
      const diff = Number(a.timestamp) - Number(b.timestamp);
      return sortDir === "desc" ? -diff : diff;
    });
    return list;
  }, [
    entries,
    category,
    dateFrom,
    dateTo,
    resellerFilter,
    reviewerFilter,
    search,
    sortDir,
  ]);

  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when any filter changes
  const filterKey = `${search}|${category}|${dateFrom}|${dateTo}|${resellerFilter}|${reviewerFilter}`;
  // biome-ignore lint/correctness/useExhaustiveDependencies: composite filter key intentional
  useEffect(() => setPage(1), [filterKey]);

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (category !== "all")
    activeFilters.push({
      label: CATEGORY_LABELS[category],
      clear: () => setCategory("all"),
    });
  if (dateFrom)
    activeFilters.push({
      label: `From ${dateFrom}`,
      clear: () => setDateFrom(""),
    });
  if (dateTo)
    activeFilters.push({ label: `To ${dateTo}`, clear: () => setDateTo("") });
  if (resellerFilter)
    activeFilters.push({
      label: `Reseller: ${resellerFilter}`,
      clear: () => setResellerFilter(""),
    });
  if (reviewerFilter)
    activeFilters.push({
      label: `Reviewer: ${reviewerFilter}`,
      clear: () => setReviewerFilter(""),
    });
  if (search)
    activeFilters.push({
      label: `Search: "${search}"`,
      clear: () => setSearch(""),
    });

  const clearAllFilters = () => {
    setCategory("all");
    setDateFrom("");
    setDateTo("");
    setResellerFilter("");
    setReviewerFilter("");
    setSearch("");
  };

  function buildCSVRow(e: AuditEntry): string {
    return [
      formatTimestamp(e.timestamp),
      formatAction(e.action),
      CATEGORY_LABELS[getCategory(e.action)],
      e.entityType,
      e.entityId,
      e.userId,
      `"${e.details.replace(/"/g, "'")}"`,
    ].join(",");
  }

  function exportCSV() {
    const header =
      "Timestamp,Action,Category,Entity Type,Entity ID,Reviewer,Details";
    const summary = `,,,,TOTAL: ${filtered.length},Tier: ${stats.tier} | Forex: ${stats.forex} | Dup DR Approved: ${stats.dupApproved} | Dup DR Rejected: ${stats.dupRejected}`;
    const csv = [header, ...filtered.map(buildCSVRow), "", summary].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `channelforge-audit-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  }

  function exportXLSX() {
    const header =
      "Timestamp\tAction\tCategory\tEntity Type\tEntity ID\tReviewer\tDetails";
    const rows = filtered.map((e) =>
      [
        formatTimestamp(e.timestamp),
        formatAction(e.action),
        CATEGORY_LABELS[getCategory(e.action)],
        e.entityType,
        e.entityId,
        e.userId,
        e.details,
      ].join("\t"),
    );
    const meta = [
      "",
      "-- Export Metadata --",
      `Export Date\t${new Date().toLocaleString()}`,
      `Total Rows\t${filtered.length}`,
      `Tier Changes\t${stats.tier}`,
      `Forex Changes\t${stats.forex}`,
      `Dup DR Approved\t${stats.dupApproved}`,
      `Dup DR Rejected\t${stats.dupRejected}`,
      `Filters Applied\t${activeFilters.map((f) => f.label).join(" | ") || "None"}`,
    ];
    const blob = new Blob([[header, ...rows, ...meta].join("\n")], {
      type: "text/tab-separated-values",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `channelforge-audit-log-${new Date().toISOString().split("T")[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("XLSX exported successfully");
  }

  if (userProfile && !isVendorAdmin) {
    return (
      <div
        data-ocid="audit_log.access_denied.error_state"
        className="flex flex-col items-center justify-center h-64 gap-4"
      >
        <AlertTriangle size={36} style={{ color: ORANGE }} />
        <h2 className="text-lg font-semibold text-foreground">
          Access Restricted
        </h2>
        <p className="text-sm text-muted-foreground">
          The Audit Log is only accessible to Vendor Admins.
        </p>
        <button
          type="button"
          data-ocid="audit_log.go_back.button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border hover:border-accent transition-colors"
          style={{ color: ORANGE }}
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      data-ocid="audit_log.page"
      className="max-w-[1400px] mx-auto px-4 py-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="audit_log.back.button"
            onClick={() => navigate({ to: "/admin" })}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
            aria-label="Back to Admin Settings"
          >
            <ChevronLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground font-display tracking-tight">
              Audit Log Dashboard
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Searchable log of tier, forex, and duplicate DR decisions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="audit_log.refresh.button"
            onClick={loadEntries}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors text-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            data-ocid="audit_log.export_csv.button"
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors text-sm"
          >
            <Download size={13} />
            CSV
          </button>
          <button
            type="button"
            data-ocid="audit_log.export_xlsx.button"
            onClick={exportXLSX}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold"
            style={{ background: ORANGE, borderColor: ORANGE, color: "white" }}
          >
            <Download size={13} />
            XLSX + Metadata
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div
        data-ocid="audit_log.summary_stats.section"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <StatTile
          label="Total Entries"
          value={stats.total}
          color="rgba(200,214,232,0.9)"
        />
        <StatTile label="Tier Changes" value={stats.tier} color="#6B7FFF" />
        <StatTile label="Forex Changes" value={stats.forex} color="#22C55E" />
        <StatTile
          label="Dup DR Approved"
          value={stats.dupApproved}
          sub={`${stats.dupTotal} total reviews`}
          color={ORANGE}
        />
        <StatTile
          label="Dup DR Rejected"
          value={stats.dupRejected}
          sub={`${stats.dupTotal > 0 ? Math.round((stats.dupRejected / stats.dupTotal) * 100) : 0}% rejection rate`}
          color="#EF4444"
        />
      </div>

      {/* Filter bar */}
      <div
        data-ocid="audit_log.filter_bar.section"
        className="crm-card p-4 space-y-3"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              data-ocid="audit_log.search.input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, entity, reviewer, details\u2026"
              className="crm-input w-full pl-8 pr-4 py-2 text-sm"
            />
          </div>
          <div className="relative" ref={catRef}>
            <button
              type="button"
              data-ocid="audit_log.category_filter.select"
              onClick={() => setCatDropOpen((v) => !v)}
              className="crm-input flex items-center gap-2 px-3 py-2 text-sm min-w-[180px] justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Filter size={12} className="text-muted-foreground" />
                {CATEGORY_LABELS[category]}
              </span>
              <ChevronDown size={12} className="text-muted-foreground" />
            </button>
            {catDropOpen && (
              <div
                className="absolute z-20 top-full mt-1 left-0 crm-card py-1 min-w-[200px] shadow-lg"
                data-ocid="audit_log.category_dropdown.popover"
              >
                {(
                  [
                    "all",
                    "tier",
                    "forex",
                    "duplicate_dr",
                    "general",
                  ] as DecisionCategory[]
                ).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      setCatDropOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary/40 transition-colors flex items-center gap-2 ${c === category ? "text-accent font-semibold" : "text-foreground"}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: CATEGORY_COLORS[c] }}
                    />
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="date"
            data-ocid="audit_log.date_from.input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="crm-input px-3 py-2 text-sm"
            title="From date"
          />
          <input
            type="date"
            data-ocid="audit_log.date_to.input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="crm-input px-3 py-2 text-sm"
            title="To date"
          />
          {allResellers.length > 0 && (
            <select
              data-ocid="audit_log.reseller_filter.select"
              value={resellerFilter}
              onChange={(e) => setResellerFilter(e.target.value)}
              className="crm-input px-3 py-2 text-sm min-w-[160px]"
            >
              <option value="">All Resellers</option>
              {allResellers.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
          {allReviewers.length > 0 && (
            <select
              data-ocid="audit_log.reviewer_filter.select"
              value={reviewerFilter}
              onChange={(e) => setReviewerFilter(e.target.value)}
              className="crm-input px-3 py-2 text-sm min-w-[160px]"
            >
              <option value="">All Reviewers</option>
              {allReviewers.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
          {activeFilters.length > 0 && (
            <button
              type="button"
              data-ocid="audit_log.reset_filters.button"
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
            >
              <X size={12} /> Reset
            </button>
          )}
        </div>
        {activeFilters.length > 0 && (
          <div
            data-ocid="audit_log.active_filters.section"
            className="flex flex-wrap gap-2"
          >
            {activeFilters.map((f) => (
              <ActiveFilterBadge
                key={f.label}
                label={f.label}
                onRemove={f.clear}
              />
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div
        data-ocid="audit_log.table.section"
        className="crm-card overflow-hidden"
      >
        {/* Header row */}
        <div
          className="grid text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2.5 border-b border-border"
          style={{
            gridTemplateColumns: "1fr 1.4fr 1fr 1fr 1fr 1.4fr 1fr",
            background: "rgba(11,18,32,0.5)",
          }}
        >
          <button
            type="button"
            className="flex items-center gap-1 select-none hover:text-foreground transition-colors bg-transparent border-0 p-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer"
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            aria-label="Sort by timestamp"
          >
            Timestamp <ArrowUpDown size={10} />
          </button>
          <div>Action</div>
          <div>Category</div>
          <div>Entity Type</div>
          <div>Entity / Account</div>
          <div>Reviewer</div>
          <div>Details</div>
        </div>

        {loading && (
          <div
            data-ocid="audit_log.loading_state"
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: `${ORANGE} transparent transparent transparent`,
              }}
            />
            <p className="text-sm text-muted-foreground">
              Loading audit log\u2026
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            data-ocid="audit_log.error_state"
            className="flex flex-col items-center justify-center py-12 gap-3"
          >
            <AlertTriangle size={28} style={{ color: ORANGE }} />
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              type="button"
              data-ocid="audit_log.retry.button"
              onClick={loadEntries}
              className="text-sm font-medium px-4 py-1.5 rounded-lg border border-border hover:border-accent transition-colors"
              style={{ color: ORANGE }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && paginated.length === 0 && (
          <div
            data-ocid="audit_log.empty_state"
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <Activity size={32} className="text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">
              No audit entries match the current filters.
            </p>
            {activeFilters.length > 0 && (
              <button
                type="button"
                data-ocid="audit_log.clear_filters.button"
                onClick={clearAllFilters}
                className="text-sm font-medium"
                style={{ color: ORANGE }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && paginated.length > 0 && (
          <div className="divide-y divide-border">
            {paginated.map((entry, idx) => {
              const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
              const isExpanded = expandedId === entry.id;
              const cat = getCategory(entry.action);
              const color = CATEGORY_COLORS[cat];
              return (
                <div key={entry.id}>
                  <button
                    type="button"
                    data-ocid={`audit_log.item.${globalIdx}`}
                    className="grid w-full px-4 py-3 text-sm hover:bg-secondary/20 transition-colors cursor-pointer bg-transparent border-0 text-left"
                    style={{
                      gridTemplateColumns: "1fr 1.4fr 1fr 1fr 1fr 1.4fr 1fr",
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="text-muted-foreground text-xs font-mono pr-2 truncate">
                      {formatTimestamp(entry.timestamp)}
                    </div>
                    <div className="flex items-center gap-1.5 pr-2 min-w-0">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-foreground font-medium truncate">
                        {formatAction(entry.action)}
                      </span>
                    </div>
                    <div className="pr-2">
                      <CategoryBadge action={entry.action} />
                    </div>
                    <div className="text-muted-foreground truncate pr-2">
                      {entry.entityType || "\u2014"}
                    </div>
                    <div className="text-muted-foreground font-mono text-xs truncate pr-2">
                      {entry.entityId || "\u2014"}
                    </div>
                    <div className="text-foreground truncate pr-2">
                      {entry.userId || "\u2014"}
                    </div>
                    <div className="text-muted-foreground text-xs truncate">
                      {entry.details.slice(0, 60)}
                      {entry.details.length > 60 && "\u2026"}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3">
                      <DrillDownPanel
                        entry={entry}
                        onClose={() => setExpandedId(null)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length > PAGE_SIZE && (
          <div
            className="flex items-center justify-between px-4 py-3 border-t border-border"
            style={{ background: "rgba(11,18,32,0.4)" }}
          >
            <span className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}\u2013
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
              entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-ocid="audit_log.pagination_prev"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-border disabled:opacity-40 hover:border-accent transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                data-ocid="audit_log.pagination_next"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded border border-border disabled:opacity-40 hover:border-accent transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
