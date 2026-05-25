import { c as createLucideIcon, a as useNavigate, u as useApp, p as useActor, r as reactExports, q as UserRole, j as jsxRuntimeExports, T as TriangleAlert, g as ChevronLeft, a6 as RefreshCw, S as Search, k as ChevronDown, X, i as ChevronRight, ab as ue } from "./index-DvFvlUBj.js";
import { D as Download } from "./download-DVLbZ_Ir.js";
import { F as Funnel } from "./funnel-ouUqz1CV.js";
import { A as Activity } from "./activity-BzA2r-7b.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
];
const ArrowUpDown = createLucideIcon("arrow-up-down", __iconNode);
const ORANGE = "#FF6B2B";
const PAGE_SIZE = 25;
const CATEGORY_ACTIONS = {
  TIER_PERMISSION_CHANGE: "tier",
  TIER_ASSIGNED: "tier",
  TIER_OVERRIDE_ADDED: "tier",
  FOREX_CONFIG_CHANGE: "forex",
  DUPLICATE_DR_FLAGGED: "duplicate_dr",
  DUPLICATE_DR_REVIEWED: "duplicate_dr"
};
const CATEGORY_LABELS = {
  all: "All Categories",
  tier: "Tier Permission Changes",
  forex: "Forex Configuration",
  duplicate_dr: "Duplicate DR Decisions",
  general: "General"
};
const CATEGORY_COLORS = {
  all: "rgba(125,138,160,0.7)",
  tier: "#6B7FFF",
  forex: "#22C55E",
  duplicate_dr: ORANGE,
  general: "rgba(125,138,160,0.7)"
};
function getCategory(action) {
  return CATEGORY_ACTIONS[action] ?? "general";
}
function formatTimestamp(ts) {
  const ms = Number(ts) / 1e6;
  if (ms < 1e12) return "—";
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function formatAction(action) {
  return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
function computeStats(entries) {
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
    dupTotal: dupApproved + dupRejected
  };
}
function CategoryBadge({ action }) {
  const cat = getCategory(action);
  const color = CATEGORY_COLORS[cat];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
      style: {
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`
      },
      children: CATEGORY_LABELS[cat]
    }
  );
}
function StatTile({
  label,
  value,
  sub,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "metric-tile",
      style: { borderLeft: `3px solid ${color ?? ORANGE}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "text-3xl font-black font-display leading-none",
            style: { color: color ?? ORANGE },
            children: value.toLocaleString()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-medium", children: label }),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground opacity-70", children: sub })
      ]
    }
  );
}
function ActiveFilterBadge({
  label,
  onRemove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium",
      style: {
        background: `${ORANGE}15`,
        border: `1px solid ${ORANGE}40`,
        color: ORANGE
      },
      children: [
        label,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            className: "ml-0.5 opacity-70 hover:opacity-100 transition-opacity",
            "aria-label": `Remove filter: ${label}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
          }
        )
      ]
    }
  );
}
function DrillDownPanel({
  entry,
  onClose
}) {
  let details = {};
  try {
    details = JSON.parse(entry.details);
  } catch {
    details = { details: entry.details };
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "audit_log.drill_down.panel",
      className: "crm-card p-5 mt-2 fade-in",
      style: { borderLeft: `3px solid ${ORANGE}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14, style: { color: ORANGE } }),
            "Entry Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "audit_log.drill_down.close_button",
              onClick: onClose,
              className: "text-muted-foreground hover:text-foreground transition-colors p-1 rounded",
              "aria-label": "Close details",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground w-28 flex-shrink-0", children: "Entry ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono break-all", children: entry.id })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground w-28 flex-shrink-0", children: "Timestamp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: formatTimestamp(entry.timestamp) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground w-28 flex-shrink-0", children: "Action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: formatAction(entry.action) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground w-28 flex-shrink-0", children: "Entity Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: entry.entityType || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground w-28 flex-shrink-0", children: "Entity ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono break-all", children: entry.entityId || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground w-28 flex-shrink-0", children: "Reviewer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: entry.userId || "—" })
          ] })
        ] }),
        Object.keys(details).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3", children: "Decision Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs", children: Object.entries(details).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-muted-foreground flex-shrink-0 capitalize",
                style: { minWidth: "7rem" },
                children: k.replace(/_/g, " ")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground break-all", children: String(v) })
          ] }, k)) })
        ] })
      ]
    }
  );
}
function AuditLogDashboard() {
  const navigate = useNavigate();
  const { userProfile, isVendor } = useApp();
  const { actor } = useActor();
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("all");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [resellerFilter, setResellerFilter] = reactExports.useState("");
  const [reviewerFilter, setReviewerFilter] = reactExports.useState("");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [page, setPage] = reactExports.useState(1);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [catDropOpen, setCatDropOpen] = reactExports.useState(false);
  const catRef = reactExports.useRef(null);
  const isVendorAdmin = (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorAdmin || (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorPrimaryAdmin || (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorSecondaryAdmin || isVendor();
  const loadEntries = reactExports.useCallback(async () => {
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
  reactExports.useEffect(() => {
    if (actor) loadEntries();
  }, [actor, loadEntries]);
  reactExports.useEffect(() => {
    function handleClick(e) {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const allResellers = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const e of entries) {
      const match = e.details.match(/reseller[_\s]?(?:id)?[:\s]+([\w-]+)/i);
      if (match == null ? void 0 : match[1]) set.add(match[1]);
    }
    return Array.from(set).sort();
  }, [entries]);
  const allReviewers = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const e of entries) {
      if (e.userId) set.add(e.userId);
    }
    return Array.from(set).sort();
  }, [entries]);
  const filtered = reactExports.useMemo(() => {
    let list = [...entries];
    if (category !== "all")
      list = list.filter((e) => getCategory(e.action) === category);
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      list = list.filter((e) => Number(e.timestamp) / 1e6 >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 864e5;
      list = list.filter((e) => Number(e.timestamp) / 1e6 <= to);
    }
    if (resellerFilter)
      list = list.filter(
        (e) => e.details.toLowerCase().includes(resellerFilter.toLowerCase())
      );
    if (reviewerFilter)
      list = list.filter(
        (e) => e.userId.toLowerCase().includes(reviewerFilter.toLowerCase())
      );
    const q = search.trim().toLowerCase();
    if (q)
      list = list.filter(
        (e) => e.action.toLowerCase().includes(q) || e.entityId.toLowerCase().includes(q) || e.entityType.toLowerCase().includes(q) || e.userId.toLowerCase().includes(q) || e.details.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
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
    sortDir
  ]);
  const stats = reactExports.useMemo(() => computeStats(filtered), [filtered]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filterKey = `${search}|${category}|${dateFrom}|${dateTo}|${resellerFilter}|${reviewerFilter}`;
  reactExports.useEffect(() => setPage(1), [filterKey]);
  const activeFilters = [];
  if (category !== "all")
    activeFilters.push({
      label: CATEGORY_LABELS[category],
      clear: () => setCategory("all")
    });
  if (dateFrom)
    activeFilters.push({
      label: `From ${dateFrom}`,
      clear: () => setDateFrom("")
    });
  if (dateTo)
    activeFilters.push({ label: `To ${dateTo}`, clear: () => setDateTo("") });
  if (resellerFilter)
    activeFilters.push({
      label: `Reseller: ${resellerFilter}`,
      clear: () => setResellerFilter("")
    });
  if (reviewerFilter)
    activeFilters.push({
      label: `Reviewer: ${reviewerFilter}`,
      clear: () => setReviewerFilter("")
    });
  if (search)
    activeFilters.push({
      label: `Search: "${search}"`,
      clear: () => setSearch("")
    });
  const clearAllFilters = () => {
    setCategory("all");
    setDateFrom("");
    setDateTo("");
    setResellerFilter("");
    setReviewerFilter("");
    setSearch("");
  };
  function buildCSVRow(e) {
    return [
      formatTimestamp(e.timestamp),
      formatAction(e.action),
      CATEGORY_LABELS[getCategory(e.action)],
      e.entityType,
      e.entityId,
      e.userId,
      `"${e.details.replace(/"/g, "'")}"`
    ].join(",");
  }
  function exportCSV() {
    const header = "Timestamp,Action,Category,Entity Type,Entity ID,Reviewer,Details";
    const summary = `,,,,TOTAL: ${filtered.length},Tier: ${stats.tier} | Forex: ${stats.forex} | Dup DR Approved: ${stats.dupApproved} | Dup DR Rejected: ${stats.dupRejected}`;
    const csv = [header, ...filtered.map(buildCSVRow), "", summary].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `channelforge-audit-log-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("CSV exported successfully");
  }
  function exportXLSX() {
    const header = "Timestamp	Action	Category	Entity Type	Entity ID	Reviewer	Details";
    const rows = filtered.map(
      (e) => [
        formatTimestamp(e.timestamp),
        formatAction(e.action),
        CATEGORY_LABELS[getCategory(e.action)],
        e.entityType,
        e.entityId,
        e.userId,
        e.details
      ].join("	")
    );
    const meta = [
      "",
      "-- Export Metadata --",
      `Export Date	${(/* @__PURE__ */ new Date()).toLocaleString()}`,
      `Total Rows	${filtered.length}`,
      `Tier Changes	${stats.tier}`,
      `Forex Changes	${stats.forex}`,
      `Dup DR Approved	${stats.dupApproved}`,
      `Dup DR Rejected	${stats.dupRejected}`,
      `Filters Applied	${activeFilters.map((f) => f.label).join(" | ") || "None"}`
    ];
    const blob = new Blob([[header, ...rows, ...meta].join("\n")], {
      type: "text/tab-separated-values"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `channelforge-audit-log-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("XLSX exported successfully");
  }
  if (userProfile && !isVendorAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "audit_log.access_denied.error_state",
        className: "flex flex-col items-center justify-center h-64 gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 36, style: { color: ORANGE } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Access Restricted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "The Audit Log is only accessible to Vendor Admins." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "audit_log.go_back.button",
              onClick: () => navigate({ to: "/dashboard" }),
              className: "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border border-border hover:border-accent transition-colors",
              style: { color: ORANGE },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 }),
                " Back to Dashboard"
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "audit_log.page",
      className: "max-w-[1400px] mx-auto px-4 py-6 space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "audit_log.back.button",
                onClick: () => navigate({ to: "/admin" }),
                className: "p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors",
                "aria-label": "Back to Admin Settings",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display tracking-tight", children: "Audit Log Dashboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Searchable log of tier, forex, and duplicate DR decisions" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "audit_log.refresh.button",
                onClick: loadEntries,
                disabled: loading,
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13, className: loading ? "animate-spin" : "" }),
                  "Refresh"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "audit_log.export_csv.button",
                onClick: exportCSV,
                disabled: filtered.length === 0,
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
                  "CSV"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "audit_log.export_xlsx.button",
                onClick: exportXLSX,
                disabled: filtered.length === 0,
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold",
                style: { background: ORANGE, borderColor: ORANGE, color: "white" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
                  "XLSX + Metadata"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "audit_log.summary_stats.section",
            className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatTile,
                {
                  label: "Total Entries",
                  value: stats.total,
                  color: "rgba(200,214,232,0.9)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Tier Changes", value: stats.tier, color: "#6B7FFF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Forex Changes", value: stats.forex, color: "#22C55E" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatTile,
                {
                  label: "Dup DR Approved",
                  value: stats.dupApproved,
                  sub: `${stats.dupTotal} total reviews`,
                  color: ORANGE
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatTile,
                {
                  label: "Dup DR Rejected",
                  value: stats.dupRejected,
                  sub: `${stats.dupTotal > 0 ? Math.round(stats.dupRejected / stats.dupTotal * 100) : 0}% rejection rate`,
                  color: "#EF4444"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "audit_log.filter_bar.section",
            className: "crm-card p-4 space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Search,
                    {
                      size: 13,
                      className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      "data-ocid": "audit_log.search.input",
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: "Search by action, entity, reviewer, details\\u2026",
                      className: "crm-input w-full pl-8 pr-4 py-2 text-sm"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: catRef, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "audit_log.category_filter.select",
                      onClick: () => setCatDropOpen((v) => !v),
                      className: "crm-input flex items-center gap-2 px-3 py-2 text-sm min-w-[180px] justify-between",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 12, className: "text-muted-foreground" }),
                          CATEGORY_LABELS[category]
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 12, className: "text-muted-foreground" })
                      ]
                    }
                  ),
                  catDropOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute z-20 top-full mt-1 left-0 crm-card py-1 min-w-[200px] shadow-lg",
                      "data-ocid": "audit_log.category_dropdown.popover",
                      children: [
                        "all",
                        "tier",
                        "forex",
                        "duplicate_dr",
                        "general"
                      ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setCategory(c);
                            setCatDropOpen(false);
                          },
                          className: `w-full text-left px-3 py-2 text-sm hover:bg-secondary/40 transition-colors flex items-center gap-2 ${c === category ? "text-accent font-semibold" : "text-foreground"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "w-2 h-2 rounded-full flex-shrink-0",
                                style: { background: CATEGORY_COLORS[c] }
                              }
                            ),
                            CATEGORY_LABELS[c]
                          ]
                        },
                        c
                      ))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    "data-ocid": "audit_log.date_from.input",
                    value: dateFrom,
                    onChange: (e) => setDateFrom(e.target.value),
                    className: "crm-input px-3 py-2 text-sm",
                    title: "From date"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "date",
                    "data-ocid": "audit_log.date_to.input",
                    value: dateTo,
                    onChange: (e) => setDateTo(e.target.value),
                    className: "crm-input px-3 py-2 text-sm",
                    title: "To date"
                  }
                ),
                allResellers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    "data-ocid": "audit_log.reseller_filter.select",
                    value: resellerFilter,
                    onChange: (e) => setResellerFilter(e.target.value),
                    className: "crm-input px-3 py-2 text-sm min-w-[160px]",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Resellers" }),
                      allResellers.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
                    ]
                  }
                ),
                allReviewers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    "data-ocid": "audit_log.reviewer_filter.select",
                    value: reviewerFilter,
                    onChange: (e) => setReviewerFilter(e.target.value),
                    className: "crm-input px-3 py-2 text-sm min-w-[160px]",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Reviewers" }),
                      allReviewers.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
                    ]
                  }
                ),
                activeFilters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "audit_log.reset_filters.button",
                    onClick: clearAllFilters,
                    className: "flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
                      " Reset"
                    ]
                  }
                )
              ] }),
              activeFilters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "audit_log.active_filters.section",
                  className: "flex flex-wrap gap-2",
                  children: activeFilters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ActiveFilterBadge,
                    {
                      label: f.label,
                      onRemove: f.clear
                    },
                    f.label
                  ))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "audit_log.table.section",
            className: "crm-card overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "grid text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2.5 border-b border-border",
                  style: {
                    gridTemplateColumns: "1fr 1.4fr 1fr 1fr 1fr 1.4fr 1fr",
                    background: "rgba(11,18,32,0.5)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "flex items-center gap-1 select-none hover:text-foreground transition-colors bg-transparent border-0 p-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer",
                        onClick: () => setSortDir((d) => d === "desc" ? "asc" : "desc"),
                        "aria-label": "Sort by timestamp",
                        children: [
                          "Timestamp ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { size: 10 })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Action" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Category" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Entity Type" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Entity / Account" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Reviewer" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Details" })
                  ]
                }
              ),
              loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "audit_log.loading_state",
                  className: "flex flex-col items-center justify-center py-16 gap-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-6 h-6 rounded-full border-2 border-t-transparent animate-spin",
                        style: {
                          borderColor: `${ORANGE} transparent transparent transparent`
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading audit log\\u2026" })
                  ]
                }
              ),
              !loading && error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "audit_log.error_state",
                  className: "flex flex-col items-center justify-center py-12 gap-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 28, style: { color: ORANGE } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: error }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "audit_log.retry.button",
                        onClick: loadEntries,
                        className: "text-sm font-medium px-4 py-1.5 rounded-lg border border-border hover:border-accent transition-colors",
                        style: { color: ORANGE },
                        children: "Retry"
                      }
                    )
                  ]
                }
              ),
              !loading && !error && paginated.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "audit_log.empty_state",
                  className: "flex flex-col items-center justify-center py-16 gap-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 32, className: "text-muted-foreground opacity-40" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No audit entries match the current filters." }),
                    activeFilters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "audit_log.clear_filters.button",
                        onClick: clearAllFilters,
                        className: "text-sm font-medium",
                        style: { color: ORANGE },
                        children: "Clear all filters"
                      }
                    )
                  ]
                }
              ),
              !loading && !error && paginated.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: paginated.map((entry, idx) => {
                const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
                const isExpanded = expandedId === entry.id;
                const cat = getCategory(entry.action);
                const color = CATEGORY_COLORS[cat];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `audit_log.item.${globalIdx}`,
                      className: "grid w-full px-4 py-3 text-sm hover:bg-secondary/20 transition-colors cursor-pointer bg-transparent border-0 text-left",
                      style: {
                        gridTemplateColumns: "1fr 1.4fr 1fr 1fr 1fr 1.4fr 1fr"
                      },
                      onClick: () => setExpandedId(isExpanded ? null : entry.id),
                      "aria-expanded": isExpanded,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs font-mono pr-2 truncate", children: formatTimestamp(entry.timestamp) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pr-2 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "w-1.5 h-1.5 rounded-full flex-shrink-0",
                              style: { background: color }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium truncate", children: formatAction(entry.action) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryBadge, { action: entry.action }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground truncate pr-2", children: entry.entityType || "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground font-mono text-xs truncate pr-2", children: entry.entityId || "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground truncate pr-2", children: entry.userId || "—" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground text-xs truncate", children: [
                          entry.details.slice(0, 60),
                          entry.details.length > 60 && "…"
                        ] })
                      ]
                    }
                  ),
                  isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    DrillDownPanel,
                    {
                      entry,
                      onClose: () => setExpandedId(null)
                    }
                  ) })
                ] }, entry.id);
              }) }),
              !loading && !error && filtered.length > PAGE_SIZE && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between px-4 py-3 border-t border-border",
                  style: { background: "rgba(11,18,32,0.4)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Showing ",
                      (page - 1) * PAGE_SIZE + 1,
                      "\\u2013",
                      Math.min(page * PAGE_SIZE, filtered.length),
                      " of ",
                      filtered.length,
                      " ",
                      "entries"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "audit_log.pagination_prev",
                          onClick: () => setPage((p) => Math.max(1, p - 1)),
                          disabled: page === 1,
                          className: "p-1.5 rounded border border-border disabled:opacity-40 hover:border-accent transition-colors",
                          "aria-label": "Previous page",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 13 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                        "Page ",
                        page,
                        " of ",
                        totalPages
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "audit_log.pagination_next",
                          onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
                          disabled: page === totalPages,
                          className: "p-1.5 rounded border border-border disabled:opacity-40 hover:border-accent transition-colors",
                          "aria-label": "Next page",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13 })
                        }
                      )
                    ] })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  AuditLogDashboard
};
