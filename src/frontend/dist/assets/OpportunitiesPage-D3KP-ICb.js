import { c as createLucideIcon, p as useActor, u as useApp, s as useFilterContext, r as reactExports, j as jsxRuntimeExports, Z as Zap, m as Button, a8 as Plus, S as Search, ad as Input, X, x as ChartNoAxesColumn, e as TrendingUp, y as Target, f as TrendingDown, T as TriangleAlert, k as ChevronDown, ac as ChevronUp, ab as ue } from "./index-DvFvlUBj.js";
import { C as ClickableAccountName } from "./ClickableAccountName-DlLteLE7.js";
import { u as useCustomFields, C as CustomFieldEditor } from "./useCustomFields-Do4Q3M8P.js";
import { F as ForgeAIRecommendationCard } from "./ForgeAIRecommendationCard-C4eBPTAG.js";
import { u as useForgeAI } from "./useForgeAI-CFLYJlF1.js";
import { L as LayoutGrid } from "./layout-grid-CWVFWNqK.js";
import { C as ChartLine } from "./chart-line-BU_r2Hol.js";
import { C as CalendarDays } from "./calendar-days-BhEBMHaO.js";
import "./checkbox-Cr6u9Lap.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
import "./textarea-BHUaDciu.js";
import "./useMutation-D0Tr8pyU.js";
import "./backend.d-Bio-_uWv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = createLucideIcon("list", __iconNode);
const STAGE_KEYS = [
  "prospecting",
  "qualification",
  "solutionAlignment",
  "proposal",
  "pricingReview",
  "dealRegistration",
  "approval",
  "negotiation",
  "closedWon",
  "closedLost"
];
const STAGE_LABEL = {
  prospecting: "Prospecting",
  qualification: "Qualification",
  solutionAlignment: "Solution Alignment",
  proposal: "Proposal",
  pricingReview: "Pricing Review",
  dealRegistration: "Deal Registration",
  approval: "Approval",
  negotiation: "Negotiation",
  closedWon: "Closed Won",
  closedLost: "Closed Lost"
};
const STAGE_PROBABILITY = {
  prospecting: 10,
  qualification: 25,
  solutionAlignment: 40,
  proposal: 55,
  pricingReview: 65,
  dealRegistration: 75,
  approval: 80,
  negotiation: 90,
  closedWon: 100,
  closedLost: 0
};
const STAGE_COLOR = {
  prospecting: "bg-secondary/60 text-muted-foreground border-border",
  qualification: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  solutionAlignment: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  proposal: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  pricingReview: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  dealRegistration: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  approval: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  negotiation: "bg-accent/15 text-accent border-accent/30",
  closedWon: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  closedLost: "bg-muted/30 text-muted-foreground border-border"
};
const STAGE_HEADER_ACCENT = {
  prospecting: "border-t-border",
  qualification: "border-t-blue-500/50",
  solutionAlignment: "border-t-violet-500/50",
  proposal: "border-t-yellow-500/50",
  pricingReview: "border-t-orange-500/50",
  dealRegistration: "border-t-cyan-500/50",
  approval: "border-t-purple-500/50",
  negotiation: "border-t-accent/60",
  closedWon: "border-t-emerald-500/50",
  closedLost: "border-t-border"
};
const MOCK_DEALS = [
  {
    id: "d1",
    name: "Meridian Cloud Suite Renewal",
    account: "Meridian Technologies",
    value: 84500,
    stage: "negotiation",
    owner: "Sarah Chen",
    ownerInitials: "SC",
    daysAgo: 38,
    closeDate: "2026-06-30",
    risk: "high",
    workspace: "vendor",
    probability: 90
  },
  {
    id: "d2",
    name: "Nexus Platform Expansion",
    account: "Nexus Global",
    value: 126e3,
    stage: "proposal",
    owner: "James Wright",
    ownerInitials: "JW",
    daysAgo: 12,
    closeDate: "2026-07-15",
    risk: "low",
    workspace: "vendor",
    probability: 55
  },
  {
    id: "d3",
    name: "Axiom Security Upgrade",
    account: "Axiom Systems",
    value: 47200,
    stage: "approval",
    owner: "Maria Santos",
    ownerInitials: "MS",
    daysAgo: 21,
    closeDate: "2026-06-20",
    risk: "medium",
    workspace: "distributor",
    probability: 80
  },
  {
    id: "d4",
    name: "Pinnacle ERP Migration",
    account: "Pinnacle Corp",
    value: 215e3,
    stage: "pricingReview",
    owner: "David Kim",
    ownerInitials: "DK",
    daysAgo: 5,
    closeDate: "2026-08-01",
    risk: "low",
    workspace: "vendor",
    probability: 65
  },
  {
    id: "d5",
    name: "Vantage CRM Rollout",
    account: "Vantage Partners",
    value: 33800,
    stage: "prospecting",
    owner: "Emma Thompson",
    ownerInitials: "ET",
    daysAgo: 3,
    closeDate: "2026-09-30",
    risk: "low",
    workspace: "reseller",
    probability: 10
  },
  {
    id: "d6",
    name: "BlueStar Analytics Suite",
    account: "BlueStar Inc",
    value: 78900,
    stage: "dealRegistration",
    owner: "Tom Reeves",
    ownerInitials: "TR",
    daysAgo: 18,
    closeDate: "2026-07-05",
    risk: "medium",
    workspace: "distributor",
    probability: 75
  },
  {
    id: "d7",
    name: "Crestline Managed Services",
    account: "Crestline Group",
    value: 62100,
    stage: "closedWon",
    owner: "Sarah Chen",
    ownerInitials: "SC",
    daysAgo: 45,
    closeDate: "2026-05-15",
    risk: "low",
    workspace: "vendor",
    probability: 100
  },
  {
    id: "d8",
    name: "TechFusion Dev Tools",
    account: "TechFusion Ltd",
    value: 19400,
    stage: "qualification",
    owner: "James Wright",
    ownerInitials: "JW",
    daysAgo: 8,
    closeDate: "2026-08-20",
    risk: "low",
    workspace: "reseller",
    probability: 25
  },
  {
    id: "d9",
    name: "Orion Infrastructure Deal",
    account: "Orion Solutions",
    value: 34e4,
    stage: "solutionAlignment",
    owner: "Maria Santos",
    ownerInitials: "MS",
    daysAgo: 24,
    closeDate: "2026-09-01",
    risk: "medium",
    workspace: "vendor",
    probability: 40
  },
  {
    id: "d10",
    name: "Harbor Cloud Transition",
    account: "Harbor Systems",
    value: 58700,
    stage: "negotiation",
    owner: "David Kim",
    ownerInitials: "DK",
    daysAgo: 32,
    closeDate: "2026-06-25",
    risk: "high",
    workspace: "distributor",
    probability: 90
  },
  {
    id: "d11",
    name: "Granite Software Renewal",
    account: "Granite Corp",
    value: 27500,
    stage: "prospecting",
    owner: "Emma Thompson",
    ownerInitials: "ET",
    daysAgo: 2,
    closeDate: "2026-10-01",
    risk: "low",
    workspace: "reseller",
    probability: 10
  },
  {
    id: "d12",
    name: "Catalyst Data Platform",
    account: "Catalyst Technologies",
    value: 145e3,
    stage: "approval",
    owner: "Tom Reeves",
    ownerInitials: "TR",
    daysAgo: 16,
    closeDate: "2026-06-28",
    risk: "low",
    workspace: "vendor",
    probability: 80
  },
  {
    id: "d13",
    name: "Summit Partner Program",
    account: "Summit Global",
    value: 93200,
    stage: "proposal",
    owner: "Sarah Chen",
    ownerInitials: "SC",
    daysAgo: 10,
    closeDate: "2026-07-22",
    risk: "medium",
    workspace: "distributor",
    probability: 55
  },
  {
    id: "d14",
    name: "Vertex Reseller Onboarding",
    account: "Vertex Networks",
    value: 41600,
    stage: "closedLost",
    owner: "James Wright",
    ownerInitials: "JW",
    daysAgo: 60,
    closeDate: "2026-05-01",
    risk: "high",
    workspace: "reseller",
    probability: 0
  },
  {
    id: "d15",
    name: "Horizon Enterprise Stack",
    account: "Horizon Industries",
    value: 188e3,
    stage: "pricingReview",
    owner: "Maria Santos",
    ownerInitials: "MS",
    daysAgo: 7,
    closeDate: "2026-07-30",
    risk: "medium",
    workspace: "vendor",
    probability: 65
  }
];
function fmtCurrency(val) {
  if (val >= 1e6) return `£${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `£${(val / 1e3).toFixed(0)}k`;
  return `£${val.toLocaleString("en-GB")}`;
}
function dealAgeColor(days) {
  if (days <= 14) return "text-emerald-400";
  if (days <= 30) return "text-orange-400";
  return "text-red-400";
}
function riskDot(risk) {
  if (risk === "high") return "bg-red-400";
  if (risk === "medium") return "bg-orange-400";
  return "bg-emerald-400";
}
function getInitialsBg(initials) {
  const map = {
    SC: "bg-violet-500/30 text-violet-200",
    JW: "bg-blue-500/30 text-blue-200",
    MS: "bg-emerald-500/30 text-emerald-200",
    DK: "bg-cyan-500/30 text-cyan-200",
    ET: "bg-orange-500/30 text-orange-200",
    TR: "bg-purple-500/30 text-purple-200"
  };
  return map[initials] ?? "bg-secondary text-muted-foreground";
}
function getViewFromStorage() {
  try {
    const v = localStorage.getItem("cf_pipeline_view");
    if (v === "kanban" || v === "list" || v === "forecast") return v;
  } catch {
  }
  return "kanban";
}
function startOfQuarterMs() {
  const d = /* @__PURE__ */ new Date();
  const q = Math.floor(d.getMonth() / 3);
  return new Date(d.getFullYear(), q * 3, 1).getTime();
}
function endOfQuarterMs() {
  const d = /* @__PURE__ */ new Date();
  const q = Math.floor(d.getMonth() / 3);
  return new Date(d.getFullYear(), q * 3 + 3, 0, 23, 59, 59).getTime();
}
function startOfMonthMs() {
  const d = /* @__PURE__ */ new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}
function endOfMonthMs() {
  const d = /* @__PURE__ */ new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).getTime();
}
function closeDateMs(deal) {
  return new Date(deal.closeDate).getTime();
}
function StageBadge({ stage }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${STAGE_COLOR[stage]}`,
      children: STAGE_LABEL[stage]
    }
  );
}
function KanbanCard({
  deal,
  index,
  onDragStart
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      draggable: true,
      onDragStart: () => onDragStart(deal.id),
      "data-ocid": `opportunities.kanban.item.${index}`,
      className: "group relative crm-card p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:border-accent/40 transition-all duration-150 select-none",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${riskDot(deal.risk)}`,
            title: `${deal.risk} risk`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-snug pr-4 truncate", children: deal.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold font-mono text-accent min-w-0 truncate whitespace-nowrap", children: fmtCurrency(deal.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ClickableAccountName,
          {
            accountName: deal.account,
            accountId: deal.id,
            opportunityId: deal.id,
            context: "pipeline",
            className: "text-xs text-muted-foreground truncate block"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${getInitialsBg(deal.ownerInitials)}`,
                children: deal.ownerInitials
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-medium ${dealAgeColor(deal.daysAgo)}`, children: [
              deal.daysAgo,
              "d"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: new Date(deal.closeDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short"
          }) })
        ] })
      ]
    }
  );
}
function KanbanColumn({
  stage,
  deals,
  onDragStart,
  onDrop
}) {
  const [dragOver, setDragOver] = reactExports.useState(false);
  const totalValue = deals.reduce((s, d) => s + d.value, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex-none w-[230px] flex flex-col rounded-xl border-t-2 transition-all duration-150 ${dragOver ? "border-accent/60 bg-accent/5" : `${STAGE_HEADER_ACCENT[stage]} bg-card/50`}`,
      "data-ocid": `opportunities.kanban.column.${stage}`,
      onDragOver: (e) => {
        e.preventDefault();
        setDragOver(true);
      },
      onDragLeave: () => setDragOver(false),
      onDrop: () => {
        setDragOver(false);
        onDrop(stage);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pt-3 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-1 min-w-0 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground truncate", children: STAGE_LABEL[stage] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-none text-[10px] font-mono bg-secondary/60 text-muted-foreground rounded-full px-1.5 py-0.5", children: deals.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground whitespace-nowrap", children: fmtCurrency(totalValue) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 px-2 pb-3 min-h-[80px]", children: [
          deals.map((deal, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            KanbanCard,
            {
              deal,
              index: i + 1,
              onDragStart
            },
            deal.id
          )),
          deals.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `rounded-lg border border-dashed py-6 flex items-center justify-center transition-colors ${dragOver ? "border-accent/40 bg-accent/5" : "border-border/50"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: "Drop here" })
            }
          )
        ] })
      ]
    }
  );
}
function KanbanView({ deals }) {
  const [localDeals, setLocalDeals] = reactExports.useState(deals);
  const draggingId = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setLocalDeals(deals);
  }, [deals]);
  const handleDragStart = reactExports.useCallback((id) => {
    draggingId.current = id;
  }, []);
  const handleDrop = reactExports.useCallback((targetStage) => {
    const id = draggingId.current;
    if (!id) return;
    setLocalDeals(
      (prev) => prev.map(
        (d) => d.id === id ? {
          ...d,
          stage: targetStage,
          probability: STAGE_PROBABILITY[targetStage]
        } : d
      )
    );
    draggingId.current = null;
  }, []);
  const grouped = STAGE_KEYS.reduce(
    (acc, s) => {
      acc[s] = localDeals.filter((d) => d.stage === s);
      return acc;
    },
    {}
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-3 overflow-x-auto pb-4 pt-1",
      "data-ocid": "opportunities.kanban.board",
      style: { scrollbarWidth: "thin" },
      children: STAGE_KEYS.map((stage) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        KanbanColumn,
        {
          stage,
          deals: grouped[stage],
          onDragStart: handleDragStart,
          onDrop: handleDrop
        },
        stage
      ))
    }
  );
}
const PAGE_SIZE = 10;
function ListRow({
  deal,
  index
}) {
  const relativeDate = (() => {
    const ms = new Date(deal.closeDate).getTime();
    const diff = Math.round((ms - Date.now()) / 864e5);
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    if (diff === 0) return "today";
    return `in ${diff} days`;
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      "data-ocid": `opportunities.list.item.${index}`,
      className: "border-b border-border/40 last:border-0 hover:bg-[var(--hover-bg)] transition-colors duration-150 cursor-pointer",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-medium text-foreground text-sm truncate max-w-[200px] block",
            title: deal.name,
            children: deal.name
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ClickableAccountName,
          {
            accountName: deal.account,
            accountId: deal.id,
            context: "account-table",
            className: "text-muted-foreground truncate max-w-[160px] block"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StageBadge, { stage: deal.stage }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm font-mono font-bold text-accent text-right whitespace-nowrap tabular-nums", children: new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
          notation: "compact"
        }).format(deal.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: "px-4 py-3 text-sm text-muted-foreground hidden md:table-cell whitespace-nowrap text-right tabular-nums",
            title: relativeDate,
            children: new Date(deal.closeDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${getInitialsBg(deal.ownerInitials)}`,
              children: deal.ownerInitials
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: deal.owner })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-sm text-muted-foreground text-right hidden lg:table-cell whitespace-nowrap tabular-nums", children: [
          deal.probability,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell whitespace-nowrap text-right tabular-nums", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `text-xs font-mono font-medium ${dealAgeColor(deal.daysAgo)}`,
            children: [
              deal.daysAgo,
              "d"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap min-w-[80px] ${deal.risk === "high" ? "bg-red-500/15 text-red-400 border-red-500/30" : deal.risk === "medium" ? "bg-orange-500/15 text-amber-400 border-orange-500/30" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"}`,
            children: deal.risk.charAt(0).toUpperCase() + deal.risk.slice(1)
          }
        ) })
      ]
    }
  );
}
function ListView({
  deals,
  stageFilter,
  ownerFilter,
  setStageFilter,
  setOwnerFilter,
  dateRange: _dateRange,
  minValue,
  setMinValue
}) {
  const [sortKey, setSortKey] = reactExports.useState("opportunityName");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [page, setPage] = reactExports.useState(1);
  const [showAll, setShowAll] = reactExports.useState(false);
  const owners = Array.from(new Set(deals.map((d) => d.owner)));
  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }
  const sorted = [...deals].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "opportunityName") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "customerAccountId")
      cmp = a.account.localeCompare(b.account);
    else if (sortKey === "stage") cmp = a.stage.localeCompare(b.stage);
    else if (sortKey === "revenueEstimate") cmp = a.value - b.value;
    else if (sortKey === "closeDate")
      cmp = a.closeDate.localeCompare(b.closeDate);
    else if (sortKey === "ownerUserId") cmp = a.owner.localeCompare(b.owner);
    else if (sortKey === "probability") cmp = a.probability - b.probability;
    else if (sortKey === "dealAge") cmp = a.daysAgo - b.daysAgo;
    return sortDir === "asc" ? cmp : -cmp;
  });
  const paginated = showAll ? sorted : sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  function SortIcon({ col }) {
    if (sortKey !== col)
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 11, className: "opacity-30" });
    return sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 11, className: "text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 11, className: "text-accent" });
  }
  const cols = [
    { key: "opportunityName", label: "Deal Name" },
    { key: "customerAccountId", label: "Account", cls: "hidden sm:table-cell" },
    { key: "stage", label: "Stage" },
    {
      key: "revenueEstimate",
      label: "Value",
      cls: "min-w-[160px] whitespace-nowrap text-right"
    },
    {
      key: "closeDate",
      label: "Close Date",
      cls: "hidden md:table-cell whitespace-nowrap"
    },
    { key: "ownerUserId", label: "Owner", cls: "hidden lg:table-cell" },
    {
      key: "probability",
      label: "Prob %",
      cls: "hidden lg:table-cell text-right whitespace-nowrap"
    },
    {
      key: "dealAge",
      label: "Age",
      cls: "hidden md:table-cell text-right whitespace-nowrap"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "opportunities.list.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          "data-ocid": "opportunities.list.stage.select",
          value: stageFilter,
          onChange: (e) => {
            setStageFilter(e.target.value);
            setPage(1);
          },
          className: "crm-input text-xs px-3 py-2 h-9 rounded-lg cursor-pointer",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Stages" }),
            STAGE_KEYS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: STAGE_LABEL[s] }, s))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          "data-ocid": "opportunities.list.owner.select",
          value: ownerFilter,
          onChange: (e) => {
            setOwnerFilter(e.target.value);
            setPage(1);
          },
          className: "crm-input text-xs px-3 py-2 h-9 rounded-lg cursor-pointer",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Owners" }),
            owners.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs", children: "£" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            "data-ocid": "opportunities.list.min_value.input",
            value: minValue,
            onChange: (e) => {
              setMinValue(e.target.value);
              setPage(1);
            },
            placeholder: "Min value",
            className: "crm-input h-9 text-xs pl-6 w-28"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-secondary/20", children: [
          cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              onClick: () => toggleSort(c.key),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") toggleSort(c.key);
              },
              className: `px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors select-none ${c.cls ?? ""}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                c.label,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col: c.key })
              ] })
            },
            c.key
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right", children: "Risk" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 9,
            className: "px-4 py-16 text-center",
            "data-ocid": "opportunities.list.empty_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChartNoAxesColumn,
                {
                  size: 32,
                  className: "text-muted-foreground/40"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No deals match your filters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Try adjusting the stage, owner, or value filters" })
            ] })
          }
        ) }) : paginated.map((deal, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ListRow,
          {
            deal,
            index: (page - 1) * PAGE_SIZE + i + 1
          },
          deal.id
        )) })
      ] }) }),
      !showAll && sorted.length > PAGE_SIZE && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowAll(true),
            className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
            children: [
              "Show all ",
              sorted.length
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "opportunities.list.pagination_prev",
              disabled: page === 1,
              onClick: () => setPage((p) => p - 1),
              className: "text-xs px-2.5 py-1.5 rounded border border-border hover:bg-secondary/40 disabled:opacity-30 transition-colors",
              children: "‹ Prev"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            page,
            " / ",
            totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "opportunities.list.pagination_next",
              disabled: page === totalPages,
              onClick: () => setPage((p) => p + 1),
              className: "text-xs px-2.5 py-1.5 rounded border border-border hover:bg-secondary/40 disabled:opacity-30 transition-colors",
              children: "Next ›"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function ForecastView({ deals }) {
  const qStart = startOfQuarterMs();
  const qEnd = endOfQuarterMs();
  const active = deals.filter((d) => d.stage !== "closedLost");
  const bestCase = active.reduce((s, d) => s + d.value, 0);
  const commit = deals.filter((d) => d.stage === "approval" || d.stage === "negotiation").reduce((s, d) => s + d.value, 0);
  const closedWonQTD = deals.filter((d) => {
    if (d.stage !== "closedWon") return false;
    const ms = closeDateMs(d);
    return ms >= qStart && ms <= qEnd;
  }).reduce((s, d) => s + d.value, 0);
  const TARGET = 8e5;
  const gap = TARGET - closedWonQTD;
  const summaryCards = [
    {
      label: "Best Case",
      value: fmtCurrency(bestCase),
      sub: "All active pipeline",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }),
      accent: "text-accent",
      border: "border-accent/30"
    },
    {
      label: "Commit",
      value: fmtCurrency(commit),
      sub: "Approval + Negotiation",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 18 }),
      accent: "text-violet-400",
      border: "border-violet-500/30"
    },
    {
      label: "Closed Won QTD",
      value: fmtCurrency(closedWonQTD),
      sub: "This quarter",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 18 }),
      accent: "text-emerald-400",
      border: "border-emerald-500/30"
    },
    {
      label: "Gap to Target",
      value: gap > 0 ? fmtCurrency(gap) : "Target met ✓",
      sub: `Target: ${fmtCurrency(TARGET)}`,
      icon: gap > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 18 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }),
      accent: gap > 0 ? "text-orange-400" : "text-emerald-400",
      border: gap > 0 ? "border-orange-500/30" : "border-emerald-500/30"
    }
  ];
  const activeStages = STAGE_KEYS.filter((s) => s !== "closedLost");
  const stageRows = activeStages.map((stage) => {
    const stageDeal = deals.filter((d) => d.stage === stage);
    const total = stageDeal.reduce((s, d) => s + d.value, 0);
    const weighted = Math.round(
      stageDeal.reduce((s, d) => s + d.value * (d.probability / 100), 0)
    );
    const avgAge = stageDeal.length > 0 ? Math.round(
      stageDeal.reduce((s, d) => s + d.daysAgo, 0) / stageDeal.length
    ) : 0;
    return { stage, count: stageDeal.length, total, weighted, avgAge };
  });
  const won = deals.filter((d) => d.stage === "closedWon");
  const lost = deals.filter((d) => d.stage === "closedLost");
  const closed = won.length + lost.length;
  const winRate = closed > 0 ? Math.round(won.length / closed * 100) : 0;
  const avgDealSize = deals.length > 0 ? Math.round(deals.reduce((s, d) => s + d.value, 0) / deals.length) : 0;
  const atRisk = deals.filter((d) => d.stage !== "closedWon" && d.stage !== "closedLost").filter((d) => d.risk === "high" || d.daysAgo > 25).sort((a, b) => b.daysAgo - a.daysAgo).slice(0, 4);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "opportunities.forecast.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: summaryCards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `crm-card p-4 border ${c.border} flex flex-col gap-2 min-w-0 overflow-hidden`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 ${c.accent}`, children: [
            c.icon,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground", children: c.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-base font-bold font-mono ${c.accent} whitespace-nowrap overflow-hidden text-ellipsis`,
              children: c.value
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: c.sub })
        ]
      },
      c.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: "Stage Breakdown" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/20", children: ["Stage", "Deals", "Total Value", "Weighted", "Avg Age"].map(
          (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap ${h === "Stage" ? "text-left" : "text-right"}`,
              children: h
            },
            h
          )
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: stageRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/40 last:border-0 hover:bg-secondary/10 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 max-w-[140px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StageBadge, { stage: r.stage }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-muted-foreground font-mono whitespace-nowrap", children: r.count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-foreground whitespace-nowrap", children: fmtCurrency(r.total) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-accent whitespace-nowrap", children: fmtCurrency(r.weighted) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "td",
                {
                  className: `px-4 py-3 text-right font-mono text-sm whitespace-nowrap ${dealAgeColor(r.avgAge)}`,
                  children: [
                    r.avgAge,
                    "d"
                  ]
                }
              )
            ]
          },
          r.stage
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: "Win / Loss Analysis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold font-mono text-emerald-400", children: [
              winRate,
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Win Rate" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-mono text-accent whitespace-nowrap", children: fmtCurrency(avgDealSize) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Avg Deal Size" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-mono text-foreground", children: "34d" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "Avg Days to Close" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Won" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-emerald-400 font-mono", children: won.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Lost" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-muted-foreground font-mono", children: lost.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground font-mono", children: active.length })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14, className: "text-orange-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: "Top Deals at Risk" })
        ] }),
        atRisk.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No at-risk deals detected" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: atRisk.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0",
            "data-ocid": `opportunities.forecast.risk.item.${d.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: d.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: d.account })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `text-xs font-mono font-semibold ${dealAgeColor(d.daysAgo)}`,
                    children: [
                      d.daysAgo,
                      "d"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `w-2 h-2 rounded-full ${riskDot(d.risk)}`
                  }
                )
              ] })
            ]
          },
          d.id
        )) })
      ] })
    ] })
  ] });
}
const EMPTY_FORM = {
  opportunityName: "",
  customerAccountId: "",
  revenueEstimate: "",
  stage: "prospecting",
  closeDate: "",
  ownerUserId: "",
  resellerId: "",
  distributorId: ""
};
function NewOpportunityModal({
  onClose,
  onSaved
}) {
  const { actor } = useActor();
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [saving, setSaving] = reactExports.useState(false);
  const [newOppId, setNewOppId] = reactExports.useState(null);
  const customFields = useCustomFields(
    "opportunity",
    newOppId ?? ""
  );
  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }
  function dateToNs(val) {
    if (!val) return BigInt(0);
    return BigInt(new Date(val).getTime() * 1e6);
  }
  async function handleCreate(e) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const created = await actor.createOpportunity({
        opportunityName: form.opportunityName,
        customerAccountId: form.customerAccountId || void 0,
        revenueEstimate: BigInt(Math.round(Number(form.revenueEstimate) || 0)),
        stage: form.stage,
        closeDate: dateToNs(form.closeDate),
        vendorOwnerId: form.ownerUserId,
        resellerId: form.resellerId || void 0,
        distributorId: form.distributorId || void 0,
        associatedDealIds: []
      });
      setNewOppId(created.id);
      ue.success("Opportunity created");
      onSaved();
      onClose();
    } catch {
      ue.error("Failed to create opportunity");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 fade-in",
      "data-ocid": "opportunities.new_opportunity.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground font-display", children: "New Opportunity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "text-muted-foreground hover:text-foreground transition-colors",
              "data-ocid": "opportunities.new_opportunity.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "opp-name",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Opportunity Name *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "opp-name",
                  required: true,
                  "data-ocid": "opportunities.new_opportunity.name.input",
                  value: form.opportunityName,
                  onChange: (e) => update("opportunityName", e.target.value),
                  placeholder: "e.g. Meridian Cloud Suite Renewal Q3",
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "opp-account",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Customer Account"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "opp-account",
                  "data-ocid": "opportunities.new_opportunity.account.input",
                  value: form.customerAccountId,
                  onChange: (e) => update("customerAccountId", e.target.value),
                  placeholder: "Account ID or name",
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "opp-revenue",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Revenue Estimate (£)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "opp-revenue",
                  type: "number",
                  "data-ocid": "opportunities.new_opportunity.revenue.input",
                  value: form.revenueEstimate,
                  onChange: (e) => update("revenueEstimate", e.target.value),
                  placeholder: "50000",
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "opp-stage",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Stage"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "opp-stage",
                  "data-ocid": "opportunities.new_opportunity.stage.select",
                  value: form.stage,
                  onChange: (e) => update("stage", e.target.value),
                  className: "crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
                  children: STAGE_KEYS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: STAGE_LABEL[s] }, s))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "opp-close-date",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Close Date"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "opp-close-date",
                  type: "date",
                  "data-ocid": "opportunities.new_opportunity.close_date.input",
                  value: form.closeDate,
                  onChange: (e) => update("closeDate", e.target.value),
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "opp-owner",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Owner"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "opp-owner",
                  "data-ocid": "opportunities.new_opportunity.owner.input",
                  value: form.ownerUserId,
                  onChange: (e) => update("ownerUserId", e.target.value),
                  placeholder: "user-id",
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "opp-reseller",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Reseller ID"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "opp-reseller",
                  "data-ocid": "opportunities.new_opportunity.reseller.input",
                  value: form.resellerId,
                  onChange: (e) => update("resellerId", e.target.value),
                  placeholder: "Optional",
                  className: "crm-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "opp-distributor",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Distributor ID"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "opp-distributor",
                  "data-ocid": "opportunities.new_opportunity.distributor.input",
                  value: form.distributorId,
                  onChange: (e) => update("distributorId", e.target.value),
                  placeholder: "Optional",
                  className: "crm-input"
                }
              )
            ] })
          ] }),
          customFields.fieldDefs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Custom Fields" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: customFields.fieldDefs.filter((f) => !f.isArchived).map((def) => {
              var _a;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                CustomFieldEditor,
                {
                  fieldDef: def,
                  value: customFields.pendingChanges[def.id] ?? ((_a = customFields.fieldValues[def.id]) == null ? void 0 : _a.value) ?? "",
                  onChange: (v) => customFields.setFieldValue(def.id, v),
                  error: customFields.errors[def.id]
                },
                def.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: onClose,
                "data-ocid": "opportunities.new_opportunity.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: saving,
                "data-ocid": "opportunities.new_opportunity.submit_button",
                className: "bg-accent hover:bg-accent/90 text-accent-foreground",
                children: saving ? "Creating…" : "Create Opportunity"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function StatsBar({ deals }) {
  const active = deals.filter(
    (d) => d.stage !== "closedWon" && d.stage !== "closedLost"
  );
  const pipelineValue = active.reduce((s, d) => s + d.value, 0);
  const won = deals.filter((d) => d.stage === "closedWon");
  const lost = deals.filter((d) => d.stage === "closedLost");
  const closed = won.length + lost.length;
  const winRate = closed > 0 ? Math.round(won.length / closed * 100) : 0;
  const stats = [
    {
      label: "Total Deals",
      value: deals.length.toString(),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 15 }),
      accent: false
    },
    {
      label: "Pipeline Value",
      value: fmtCurrency(pipelineValue),
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 15 }),
      accent: true
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 15 }),
      accent: false
    },
    {
      label: "Avg Deal Size",
      value: active.length > 0 ? fmtCurrency(Math.round(pipelineValue / active.length)) : "£0",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 15 }),
      accent: false
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-tile min-w-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground mb-1", children: [
      s.icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: s.label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `text-xl font-bold font-mono whitespace-nowrap overflow-hidden text-ellipsis ${s.accent ? "text-accent" : "text-foreground"}`,
        children: s.value
      }
    )
  ] }, s.label)) });
}
function OpportunitiesPage() {
  const { actor } = useActor();
  const { isVendor, isDistributor, isReseller } = useApp();
  useFilterContext();
  const orgFilteredDeals = MOCK_DEALS.filter((d) => {
    if (isVendor()) return d.workspace === "vendor";
    if (isDistributor()) return d.workspace === "distributor";
    if (isReseller()) return d.workspace === "reseller";
    return true;
  });
  const { recommendations } = useForgeAI();
  const [viewMode, setViewMode] = reactExports.useState(getViewFromStorage);
  const [wsFilter, setWsFilter] = reactExports.useState("all");
  const [dateRange, setDateRange] = reactExports.useState("quarter");
  const [search, setSearch] = reactExports.useState("");
  const [stageFilter, setStageFilter] = reactExports.useState("all");
  const [ownerFilter, setOwnerFilter] = reactExports.useState("");
  const [minValue, setMinValue] = reactExports.useState("");
  const [showNewModal, setShowNewModal] = reactExports.useState(false);
  const [, setOpps] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!actor) return;
    actor.listOpportunitiesForCaller(null, "", "", null, null).then(setOpps).catch(() => {
    });
  }, [actor]);
  function changeView(v) {
    setViewMode(v);
    try {
      localStorage.setItem("cf_pipeline_view", v);
    } catch {
    }
  }
  const filteredDeals = orgFilteredDeals.filter((d) => {
    if (wsFilter !== "all" && d.workspace !== wsFilter) return false;
    if (stageFilter !== "all" && d.stage !== stageFilter) return false;
    if (ownerFilter && d.owner !== ownerFilter) return false;
    if (minValue && d.value < Number(minValue)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!d.name.toLowerCase().includes(q) && !d.account.toLowerCase().includes(q))
        return false;
    }
    const ms = new Date(d.closeDate).getTime();
    if (dateRange === "quarter" && (ms < startOfQuarterMs() || ms > endOfQuarterMs()))
      return false;
    if (dateRange === "month" && (ms < startOfMonthMs() || ms > endOfMonthMs()))
      return false;
    return true;
  });
  const forecastDeals = orgFilteredDeals.filter((d) => {
    if (wsFilter !== "all" && d.workspace !== wsFilter) return false;
    return true;
  });
  const oppRecommendations = recommendations.filter(
    (r) => r.affectedEntityType === "Opportunity" || r.affectedEntityType === "Deal"
  ).slice(0, 2);
  function handleSaved() {
    if (!actor) return;
    actor.listOpportunitiesForCaller(null, "", "", null, null).then(setOpps).catch(() => {
    });
  }
  const viewButtons = [
    {
      mode: "kanban",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { size: 15 }),
      label: "Kanban",
      ocid: "opportunities.view.kanban.toggle"
    },
    {
      mode: "list",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { size: 15 }),
      label: "List",
      ocid: "opportunities.view.list.toggle"
    },
    {
      mode: "forecast",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartLine, { size: 15 }),
      label: "Forecast",
      ocid: "opportunities.view.forecast.toggle"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", "data-ocid": "opportunities.page", children: [
    oppRecommendations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-3 rounded-xl border border-accent/20 bg-accent/5",
        "data-ocid": "opportunities.forgeai.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 13, className: "text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-accent", children: "ForgeAI Insights" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: oppRecommendations.map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForgeAIRecommendationCard,
            {
              recommendation: rec,
              showExpand: false
            },
            rec.id
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground font-display", children: [
          "Pipeline",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-base font-normal text-muted-foreground", children: [
            filteredDeals.length,
            " deals"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Manage your channel opportunity pipeline" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            "data-ocid": "opportunities.workspace.select",
            value: wsFilter,
            onChange: (e) => setWsFilter(e.target.value),
            className: "crm-input text-xs px-3 py-2 h-9 rounded-lg cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Workspaces" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "vendor", children: "Vendor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "distributor", children: "Distributor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "reseller", children: "Reseller" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-0.5 border border-border rounded-lg p-0.5",
            "data-ocid": "opportunities.date_range.toggle",
            children: ["quarter", "month", "custom"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setDateRange(r),
                className: `px-2.5 py-1 rounded text-xs transition-colors capitalize ${dateRange === r ? "bg-accent/20 text-accent font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                children: r === "quarter" ? "This Quarter" : r === "month" ? "This Month" : "Custom"
              },
              r
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-0.5 border border-border rounded-lg p-0.5",
            "data-ocid": "opportunities.view.toggle",
            children: viewButtons.map((vb) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": vb.ocid,
                onClick: () => changeView(vb.mode),
                "aria-label": `${vb.label} view`,
                className: `flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors ${viewMode === vb.mode ? "bg-accent/20 text-accent font-semibold" : "text-muted-foreground hover:text-foreground"}`,
                children: [
                  vb.icon,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: vb.label })
                ]
              },
              vb.mode
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            "data-ocid": "opportunities.new_opportunity.open_modal_button",
            onClick: () => setShowNewModal(true),
            className: "bg-accent hover:bg-accent/90 text-accent-foreground flex-none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1" }),
              " New Opportunity"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsBar, { deals: orgFilteredDeals }),
    viewMode !== "forecast" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          size: 13,
          className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "opportunities.search_input",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search deals or accounts…",
          className: "crm-input pl-9 h-9 text-sm"
        }
      ),
      search && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setSearch(""),
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
        }
      )
    ] }),
    viewMode === "kanban" && /* @__PURE__ */ jsxRuntimeExports.jsx(KanbanView, { deals: filteredDeals }),
    viewMode === "list" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListView,
      {
        deals: filteredDeals,
        stageFilter,
        ownerFilter,
        setStageFilter,
        setOwnerFilter,
        dateRange,
        minValue,
        setMinValue
      }
    ),
    viewMode === "forecast" && /* @__PURE__ */ jsxRuntimeExports.jsx(ForecastView, { deals: forecastDeals }),
    showNewModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewOpportunityModal,
      {
        onClose: () => setShowNewModal(false),
        onSaved: handleSaved
      }
    )
  ] });
}
export {
  OpportunitiesPage
};
