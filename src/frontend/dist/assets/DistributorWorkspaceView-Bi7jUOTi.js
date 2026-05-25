import { a as useNavigate, bx as useParams, u as useApp, r as reactExports, j as jsxRuntimeExports, $ as Network, o as Badge, ai as ArrowLeft, B as Building2, U as Users, G as RefreshCcw, Q as Briefcase, e as TrendingUp, x as ChartNoAxesColumn, m as Button, by as ScrollArea, n as Clock, Z as Zap } from "./index-DvFvlUBj.js";
import { F as ForgeAIRecommendationCard } from "./ForgeAIRecommendationCard-C4eBPTAG.js";
import { u as useForgeAI } from "./useForgeAI-CFLYJlF1.js";
import { C as ClipboardList } from "./clipboard-list-BvyAGRk8.js";
import { A as Activity } from "./activity-BzA2r-7b.js";
import { B as BrainCircuit } from "./brain-circuit-DUSNG23G.js";
import "./backend.d-Bio-_uWv.js";
const BLUE = "#648CDC";
const BG = "#0b1724";
const BORDER = "#1e3050";
const TABS = [
  { id: "overview", label: "Overview", icon: ChartNoAxesColumn },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "resellers", label: "Resellers", icon: Users },
  { id: "accounts", label: "Customer Accounts", icon: Briefcase },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "forgeai", label: "AI Insights", icon: BrainCircuit }
];
const SAMPLE_VENDORS = [
  {
    id: "v1",
    name: "Acme Software Ltd",
    status: "Active",
    products: "Security Suite, Cloud Platform",
    since: "Jan 2023"
  },
  {
    id: "v2",
    name: "TechVault Systems",
    status: "Active",
    products: "Data Management, Analytics",
    since: "Mar 2023"
  }
];
const SAMPLE_RESELLERS = [
  {
    id: "r1",
    name: "ATEA Sweden AB",
    tier: "Gold",
    accounts: 14,
    activity: "3 days ago"
  },
  {
    id: "r2",
    name: "Computacenter UK",
    tier: "Platinum",
    accounts: 22,
    activity: "1 day ago"
  },
  {
    id: "r3",
    name: "SHI International",
    tier: "Silver",
    accounts: 8,
    activity: "5 days ago"
  }
];
const SAMPLE_ACCOUNTS = [
  {
    id: "a1",
    name: "GlobalTech Corp",
    reseller: "ATEA Sweden AB",
    region: "EMEA",
    renewal: "45",
    risk: "Low",
    value: "£124,000"
  },
  {
    id: "a2",
    name: "Meridian Holdings",
    reseller: "Computacenter UK",
    region: "UK",
    renewal: "12",
    risk: "High",
    value: "£89,500"
  },
  {
    id: "a3",
    name: "Apex Financial",
    reseller: "SHI International",
    region: "Americas",
    renewal: "90",
    risk: "Medium",
    value: "£67,200"
  }
];
const SAMPLE_ACTIVITY = [
  {
    id: "act1",
    action: "Reseller ATEA Sweden added to workspace",
    user: "James Porter",
    time: "2 hours ago"
  },
  {
    id: "act2",
    action: "Customer account Meridian Holdings reassigned",
    user: "Sarah Mitchell",
    time: "1 day ago"
  },
  {
    id: "act3",
    action: "Vendor relationship TechVault Systems approved",
    user: "Admin",
    time: "3 days ago"
  },
  {
    id: "act4",
    action: "Deal registration DR-2024-0089 submitted",
    user: "Priya Sharma",
    time: "4 days ago"
  }
];
const TIER_COLORS = {
  Silver: { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
  Gold: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  Platinum: { bg: "rgba(148,163,184,0.12)", color: "#e2e8f0" }
};
function TierBadgeLocal({ tier }) {
  const cfg = TIER_COLORS[tier] ?? TIER_COLORS.Silver;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
      style: {
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`
      },
      children: tier
    }
  );
}
function DistributorForgeAIPanel({
  distributorId,
  distributorName
}) {
  const {
    recommendations,
    engagementGaps,
    dismissRecommendation,
    isAnalyzing,
    runAnalysis,
    lastAnalyzedAt
  } = useForgeAI();
  const distributorRecs = recommendations.filter(
    (r) => r.affectedEntityType === "Distributor" && (r.affectedEntityId === distributorId || r.affectedEntityName.toLowerCase().includes(distributorName.toLowerCase().slice(0, 6)))
  );
  const distributorGaps = engagementGaps.filter(
    (g) => g.entityType === "Distributor" && (g.entityId === distributorId || g.entityName.toLowerCase().includes(distributorName.toLowerCase().slice(0, 6)))
  );
  const DIST_METRICS = [
    {
      label: "Distributor Health Score",
      value: "71/100",
      trend: "Moderate",
      risk: false
    },
    {
      label: "Engagement Activity",
      value: "30d gap",
      trend: "Below threshold",
      risk: true
    },
    { label: "Renewal Conversion", value: "68%", trend: "−6% QTD", risk: true },
    {
      label: "Pipeline Coverage",
      value: "£280,700",
      trend: "4 open DRs",
      risk: false
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "distributor_workspace.forgeai.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-5 py-4 rounded-xl border",
        style: {
          background: "rgba(255,107,43,0.05)",
          borderColor: "rgba(255,107,43,0.18)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                style: { background: "rgba(255,107,43,0.15)", color: "#FF6B2B" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrainCircuit, { size: 18 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: "Distributor Health & Performance" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                    style: {
                      background: "rgba(255,107,43,0.15)",
                      color: "#FF6B2B",
                      border: "1px solid rgba(255,107,43,0.3)"
                    },
                    children: "ForgeAI"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Operational intelligence for ",
                distributorName
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            lastAnalyzedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "hidden sm:flex items-center gap-1 text-[10px]",
                style: { color: "#6B8CAE" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                  " Analyzed",
                  " ",
                  lastAnalyzedAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: runAnalysis,
                disabled: isAnalyzing,
                "data-ocid": "distributor_workspace.forgeai.run_analysis.button",
                className: "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50",
                style: {
                  background: "rgba(255,107,43,0.12)",
                  color: "#FF6B2B",
                  border: "1px solid rgba(255,107,43,0.25)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 11 }),
                  isAnalyzing ? "Analyzing…" : "Re-analyze"
                ]
              }
            )
          ] })
        ]
      }
    ),
    distributorGaps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "space-y-2",
        "data-ocid": "distributor_workspace.forgeai.gap_alerts",
        children: distributorGaps.map((gap) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 px-4 py-3 rounded-xl border",
            style: {
              background: gap.severity === "Critical" ? "rgba(248,113,113,0.06)" : "rgba(251,146,60,0.06)",
              borderColor: gap.severity === "Critical" ? "rgba(248,113,113,0.2)" : "rgba(251,146,60,0.2)"
            },
            "data-ocid": `distributor_workspace.forgeai.gap_alert.${gap.alertId}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "forgeai-pulse-dot mt-1 flex-shrink-0",
                  style: {
                    background: gap.severity === "Critical" ? "#f87171" : "#fb923c"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs font-semibold",
                    style: {
                      color: gap.severity === "Critical" ? "#fca5a5" : "#fdba74"
                    },
                    children: [
                      "Distributor Engagement Gap — ",
                      gap.entityName
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "No distributor activity recorded in",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                    gap.daysSinceLastEngagement,
                    " days"
                  ] }),
                  " ",
                  "(threshold: ",
                  gap.threshold,
                  "d) · ",
                  gap.affectedAccountCount,
                  " ",
                  "account",
                  gap.affectedAccountCount !== 1 ? "s" : "",
                  " affected"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-[10px] flex-shrink-0",
                  style: { color: "#4a6080", fontFamily: "var(--font-mono)" },
                  children: [
                    Math.floor((Date.now() - Number(gap.detectedAt)) / 6e4),
                    "m ago"
                  ]
                }
              )
            ]
          },
          gap.alertId
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-3",
        "data-ocid": "distributor_workspace.forgeai.metrics_grid",
        children: DIST_METRICS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forgeai-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider mb-1", children: m.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xl font-bold tabular-nums",
              style: { color: m.risk ? "#fb923c" : "#4ade80" },
              children: m.value
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: m.trend })
        ] }, m.label))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "distributor_workspace.forgeai.recommendations", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "text-xs font-semibold uppercase tracking-wider mb-3",
          style: { color: "#6B8CAE" },
          children: "AI Recommendations"
        }
      ),
      distributorRecs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "forgeai-card flex flex-col items-center py-12",
          "data-ocid": "distributor_workspace.forgeai.recommendations.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              BrainCircuit,
              {
                size: 32,
                style: { color: "rgba(255,107,43,0.4)" },
                className: "mb-3"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No distributor-specific recommendations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "ForgeAI has no active insights for this distributor at this time." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: distributorRecs.map((rec, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": `distributor_workspace.forgeai.recommendation.item.${i + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ForgeAIRecommendationCard,
            {
              recommendation: rec,
              onDismiss: dismissRecommendation
            }
          )
        },
        rec.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "forgeai-card p-5",
        "data-ocid": "distributor_workspace.forgeai.performance_trend",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h3",
            {
              className: "text-xs font-semibold uppercase tracking-wider mb-4",
              style: { color: "#6B8CAE" },
              children: "Distributor Performance Analysis"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
            {
              label: "Reseller engagement quality",
              current: 62,
              prior: 84,
              unit: "%"
            },
            {
              label: "Renewal conversion rate",
              current: 68,
              prior: 74,
              unit: "%"
            },
            {
              label: "Pipeline coverage vs target",
              current: 71,
              prior: 90,
              unit: "%"
            }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  style: {
                    color: item.current < item.prior * 0.8 ? "#fb923c" : "#facc15"
                  },
                  children: [
                    item.current,
                    item.unit,
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                      "(was ",
                      item.prior,
                      item.unit,
                      ")"
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-1.5 rounded-full overflow-hidden",
                style: { background: "rgba(255,255,255,0.06)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-all duration-700",
                    style: {
                      width: `${item.current / Math.max(item.prior, 1) * 100}%`,
                      background: item.current < item.prior * 0.8 ? "#fb923c" : "#facc15"
                    }
                  }
                )
              }
            )
          ] }, item.label)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-[11px] mt-4 leading-relaxed",
              style: {
                color: "#8AABDC",
                background: "rgba(255,107,43,0.04)",
                border: "1px solid rgba(255,107,43,0.1)",
                borderRadius: "0.375rem",
                padding: "0.625rem 0.75rem"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#FF6B2B", fontWeight: 600 }, children: "ForgeAI: " }),
                distributorName,
                " is showing a measurable decline in reseller engagement quality and renewal conversion this quarter. Recommend an urgent distributor review meeting and co-coverage assessment for all accounts with renewals in the next 45 days."
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DistributorWorkspaceView() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/distributor/$id" });
  const { distributorContext, setDistributorContext } = useApp();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const displayName = (distributorContext == null ? void 0 : distributorContext.distributorName) ?? `Distributor ${id}`;
  function handleBack() {
    setDistributorContext(null);
    navigate({ to: "/dashboard" });
  }
  const statCards = [
    {
      icon: Building2,
      label: "Vendor Relationships",
      value: SAMPLE_VENDORS.length.toString(),
      color: BLUE
    },
    {
      icon: Users,
      label: "Active Resellers",
      value: SAMPLE_RESELLERS.length.toString(),
      color: "#FF6B2B"
    },
    {
      icon: RefreshCcw,
      label: "Renewals This Quarter",
      value: "6",
      color: "#22c55e"
    },
    {
      icon: Briefcase,
      label: "Open Deal Registrations",
      value: "4",
      color: "#f59e0b"
    },
    {
      icon: TrendingUp,
      label: "Pipeline Value",
      value: "£280,700",
      color: "#8b5cf6"
    },
    {
      icon: ClipboardList,
      label: "Business Plan Actions",
      value: "3",
      color: "#06b6d4"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "distributor_workspace.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl px-5 py-3 flex items-center gap-4",
        style: {
          background: "rgba(100,140,220,0.08)",
          border: "1px solid rgba(100,140,220,0.2)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
              style: { background: "rgba(100,140,220,0.15)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { size: 16, style: { color: BLUE } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  style: {
                    background: "rgba(100,140,220,0.15)",
                    color: BLUE,
                    border: "1px solid rgba(100,140,220,0.3)"
                  },
                  children: "Distributor"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "ID: ",
                id
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  style: {
                    background: "rgba(34,197,94,0.12)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.25)"
                  },
                  children: "Active"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "Multi-vendor distributor workspace · ",
              SAMPLE_VENDORS.length,
              " ",
              "vendor relationships · ",
              SAMPLE_RESELLERS.length,
              " resellers"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "distributor_workspace.back.button",
              onClick: handleBack,
              className: "flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-2 transition-colors hover:bg-secondary/40 flex-shrink-0",
              style: { color: BLUE },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
                " Back"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3", children: statCards.map(({ icon: Icon, label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-4",
        style: { background: BG, border: `1px solid ${BORDER}` },
        "data-ocid": "distributor_workspace.stat.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, style: { color, marginBottom: 8 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-foreground", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5 leading-tight", children: label })
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b border-border overflow-x-auto scrollbar-thin", children: TABS.map(({ id: tabId, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `distributor_workspace.${tabId}.tab`,
        onClick: () => setActiveTab(tabId),
        className: "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors border-b-2 -mb-px",
        style: {
          color: activeTab === tabId ? BLUE : "rgba(125,138,160,0.7)",
          borderBottomColor: activeTab === tabId ? BLUE : "transparent"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14 }),
          label
        ]
      },
      tabId
    )) }),
    activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        "data-ocid": "distributor_workspace.overview.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-5 space-y-4",
              style: { background: BG, border: `1px solid ${BORDER}` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Workspace Summary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [
                  { label: "Distributor ID", value: id },
                  { label: "Status", value: "Active" },
                  { label: "Vendor Relationships", value: SAMPLE_VENDORS.length },
                  { label: "Reseller Network", value: SAMPLE_RESELLERS.length },
                  { label: "Customer Accounts", value: SAMPLE_ACCOUNTS.length }
                ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: value })
                    ]
                  },
                  label
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-5 space-y-3",
              style: { background: BG, border: `1px solid ${BORDER}` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Recent Activity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: SAMPLE_ACTIVITY.slice(0, 4).map((act) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                      style: { background: BLUE }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground", children: act.action }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                      act.user,
                      " · ",
                      act.time
                    ] })
                  ] })
                ] }, act.id)) })
              ]
            }
          )
        ]
      }
    ),
    activeTab === "vendors" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "distributor_workspace.vendors.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl overflow-hidden",
        style: { background: BG, border: `1px solid ${BORDER}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3.5 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Vendor Relationships" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
              SAMPLE_VENDORS.length,
              " vendors"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["Vendor", "Status", "Product Lines", "Active Since"].map(
              (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-5 py-3",
                  children: h
                },
                h
              )
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: SAMPLE_VENDORS.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
                "data-ocid": `distributor_workspace.vendor.item.${v.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold",
                        style: {
                          background: "rgba(100,140,220,0.12)",
                          color: BLUE
                        },
                        children: v.name.charAt(0)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-xs", children: v.name })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      style: {
                        background: "rgba(34,197,94,0.12)",
                        color: "#22c55e"
                      },
                      children: v.status
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-xs text-muted-foreground", children: v.products }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-xs text-muted-foreground", children: v.since })
                ]
              },
              v.id
            )) })
          ] })
        ]
      }
    ) }),
    activeTab === "resellers" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "distributor_workspace.resellers.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl overflow-hidden",
        style: { background: BG, border: `1px solid ${BORDER}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3.5 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Reseller Network" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
              SAMPLE_RESELLERS.length,
              " resellers"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
              "Reseller",
              "Tier",
              "Accounts",
              "Last Activity",
              "Actions"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-5 py-3",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: SAMPLE_RESELLERS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
                "data-ocid": `distributor_workspace.reseller.item.${r.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold",
                        style: {
                          background: "rgba(255,107,43,0.1)",
                          color: "#FF6B2B"
                        },
                        children: r.name.charAt(0)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-xs", children: r.name })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadgeLocal, { tier: r.tier }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-xs text-foreground font-medium", children: r.accounts }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-xs text-muted-foreground", children: r.activity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "h-7 text-xs",
                      "data-ocid": `distributor_workspace.reseller.view_button.${r.id}`,
                      children: "View Workspace"
                    }
                  ) })
                ]
              },
              r.id
            )) })
          ] })
        ]
      }
    ) }),
    activeTab === "accounts" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "distributor_workspace.accounts.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl overflow-hidden",
        style: { background: BG, border: `1px solid ${BORDER}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3.5 border-b border-border flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Customer Accounts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
              SAMPLE_ACCOUNTS.length,
              " accounts"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
              "Account",
              "Reseller",
              "Region",
              "Renewal",
              "Risk",
              "Value"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-5 py-3",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: SAMPLE_ACCOUNTS.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
                "data-ocid": `distributor_workspace.account.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-medium text-foreground text-xs", children: a.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-xs text-muted-foreground", children: a.reseller }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-xs text-muted-foreground", children: a.region }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-xs",
                      style: {
                        color: Number.parseInt(a.renewal) <= 30 ? "#ef4444" : Number.parseInt(a.renewal) <= 60 ? "#f59e0b" : "#22c55e"
                      },
                      children: [
                        a.renewal,
                        " days"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      style: {
                        background: a.risk === "High" ? "rgba(239,68,68,0.12)" : a.risk === "Medium" ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)",
                        color: a.risk === "High" ? "#f87171" : a.risk === "Medium" ? "#fbbf24" : "#22c55e"
                      },
                      children: a.risk
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-xs font-medium text-foreground", children: a.value })
                ]
              },
              a.id
            )) })
          ] })
        ]
      }
    ) }),
    activeTab === "activity" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollArea,
      {
        className: "h-96",
        "data-ocid": "distributor_workspace.activity.panel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: SAMPLE_ACTIVITY.map((act) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 rounded-xl px-4 py-3",
            style: { background: BG, border: `1px solid ${BORDER}` },
            "data-ocid": `distributor_workspace.activity.item.${act.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  style: { background: "rgba(100,140,220,0.1)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14, style: { color: BLUE } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: act.action }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  act.user,
                  " · ",
                  act.time
                ] })
              ] })
            ]
          },
          act.id
        )) })
      }
    ),
    activeTab === "forgeai" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DistributorForgeAIPanel,
      {
        distributorId: id,
        distributorName: displayName
      }
    )
  ] });
}
export {
  DistributorWorkspaceView
};
