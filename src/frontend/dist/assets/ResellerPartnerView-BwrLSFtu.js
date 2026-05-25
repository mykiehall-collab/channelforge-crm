import { c as createLucideIcon, ag as useRouterState, a as useNavigate, p as useActor, u as useApp, r as reactExports, ab as ue, O as AccountStatus, j as jsxRuntimeExports, B as Building2, m as Button, o as Badge, ai as ArrowLeft, G as RefreshCcw, e as TrendingUp, W as formatCurrency, T as TriangleAlert, x as ChartNoAxesColumn, ae as accountStatusColor, a8 as Plus, af as formatDate, ak as dealStatusLabel, al as dealStatusColor, n as Clock, Z as Zap } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { F as ForgeAIRecommendationCard } from "./ForgeAIRecommendationCard-C4eBPTAG.js";
import { u as useForgeAI } from "./useForgeAI-CFLYJlF1.js";
import { L as LayoutDashboard } from "./layout-dashboard-BMx3T8Vl.js";
import { C as ClipboardList } from "./clipboard-list-BvyAGRk8.js";
import { A as Activity } from "./activity-BzA2r-7b.js";
import { B as BrainCircuit } from "./brain-circuit-DUSNG23G.js";
import "./backend.d-Bio-_uWv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m9 15 2 2 4-4", key: "1grp1n" }]
];
const FileCheck = createLucideIcon("file-check", __iconNode);
const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "accounts", label: "Customer Accounts", icon: Building2 },
  { id: "renewals", label: "Renewals", icon: CalendarClock },
  { id: "deals", label: "Deal Registrations", icon: ClipboardList },
  { id: "business-plan", label: "Business Plan", icon: TrendingUp },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "forgeai", label: "AI Insights", icon: BrainCircuit }
];
function renewalDays(ns) {
  return (Number(ns) / 1e6 - Date.now()) / 864e5;
}
function RenewalCell({ ns }) {
  if (!ns) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" });
  const days = renewalDays(ns);
  const color = days <= 30 ? "text-red-400" : days <= 90 ? "text-yellow-400" : "text-green-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: color, children: formatDate(ns) });
}
function MetricTile({
  label,
  value,
  sub,
  icon: Icon,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 flex items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
        style: {
          background: accent ? "rgba(255,107,43,0.15)" : "rgba(255,255,255,0.06)",
          color: accent ? "#FF6B2B" : "var(--muted-foreground)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground tabular-nums", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
    ] })
  ] });
}
function ResellerPartnerView() {
  var _a;
  const routerState = useRouterState();
  const resellerId = routerState.location.pathname.split("/reseller/")[1];
  const navigate = useNavigate();
  const { actor } = useActor();
  const { dealRegistrations, businessPlans } = useApp();
  const [reseller, setReseller] = reactExports.useState(null);
  const [accounts, setAccounts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const loadData = reactExports.useCallback(async () => {
    if (!actor || !resellerId) return;
    setLoading(true);
    try {
      const [profile, accts] = await Promise.all([
        actor.getCompanyProfile(resellerId),
        actor.getAccountsByReseller(resellerId)
      ]);
      setReseller(profile ?? null);
      setAccounts(accts);
    } catch {
      ue.error("Failed to load reseller workspace");
    } finally {
      setLoading(false);
    }
  }, [actor, resellerId]);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  const resellerDeals = dealRegistrations.filter(
    (d) => d.resellerId === resellerId
  );
  const resellerPlans = businessPlans.filter(
    (b) => b.partnerId === resellerId
  );
  const renewalsDue = accounts.filter((a) => {
    if (!a.renewalDate) return false;
    const days = renewalDays(a.renewalDate);
    return days >= 0 && days <= 90;
  });
  const riskAccounts = accounts.filter(
    (a) => a.status === AccountStatus.AtRisk || a.status === AccountStatus.Churned
  );
  const activeDeals = resellerDeals.filter(
    (d) => d.status !== "Won" && d.status !== "Lost" && d.status !== "Rejected" && d.status !== "Expired"
  );
  const resellerName = (reseller == null ? void 0 : reseller.companyName) ?? resellerId;
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28" }, i)) })
    ] });
  }
  if (!reseller && !loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 40, className: "text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Reseller workspace not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          onClick: () => navigate({ to: "/dashboard" }),
          className: "mt-4",
          children: "Back to Dashboard"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-5 py-3 rounded-xl border",
        style: {
          background: "rgba(255,107,43,0.08)",
          borderColor: "rgba(255,107,43,0.2)"
        },
        "data-ocid": "reseller_view.workspace_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0",
                style: { background: "rgba(255,107,43,0.2)", color: "#FF6B2B" },
                children: (_a = resellerName[0]) == null ? void 0 : _a.toUpperCase()
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Viewing workspace" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", style: { color: "#FF6B2B" }, children: resellerName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "ml-2 text-[10px] border-orange-500/30 text-orange-400",
                children: "Reseller View"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/dashboard" }),
              className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
              "data-ocid": "reseller_view.back.link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 13 }),
                " Back to vendor view"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: resellerName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          (reseller == null ? void 0 : reseller.emailDomain) ?? "",
          (reseller == null ? void 0 : reseller.companyId) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs", children: [
            "· ID: ",
            reseller.companyId
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: loadData,
          className: "text-muted-foreground hover:text-foreground transition-colors",
          "aria-label": "Refresh",
          "data-ocid": "reseller_view.refresh.button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { size: 15 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 border-b border-border overflow-x-auto scrollbar-thin",
        "data-ocid": "reseller_view.tabs",
        children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab.id),
            "data-ocid": `reseller_view.tab.${tab.id}`,
            className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(tab.icon, { size: 14 }),
              tab.label
            ]
          },
          tab.id
        ))
      }
    ),
    activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      OverviewTab,
      {
        accounts,
        renewalsDue,
        riskAccounts,
        activeDeals,
        resellerDeals,
        resellerPlans
      }
    ),
    activeTab === "accounts" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccountsTab,
      {
        accounts,
        resellerId,
        resellerName,
        onNavigate: (id) => navigate({ to: "/accounts/$id", params: { id } })
      }
    ),
    activeTab === "renewals" && /* @__PURE__ */ jsxRuntimeExports.jsx(RenewalsTab, { accounts }),
    activeTab === "deals" && /* @__PURE__ */ jsxRuntimeExports.jsx(DealsTab, { deals: resellerDeals }),
    activeTab === "business-plan" && /* @__PURE__ */ jsxRuntimeExports.jsx(BusinessPlanTab, { plans: resellerPlans }),
    activeTab === "activity" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ActivityTab,
      {
        resellerName,
        accounts,
        deals: resellerDeals
      }
    ),
    activeTab === "forgeai" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResellerForgeAIPanel,
      {
        resellerId,
        resellerName
      }
    )
  ] });
}
function ResellerForgeAIPanel({
  resellerId,
  resellerName
}) {
  const {
    recommendations,
    engagementGaps,
    dismissRecommendation,
    isAnalyzing,
    runAnalysis,
    lastAnalyzedAt
  } = useForgeAI();
  const resellerRecs = recommendations.filter(
    (r) => r.affectedEntityType === "Reseller" && (r.affectedEntityId === resellerId || r.affectedEntityName.toLowerCase().includes(resellerName.toLowerCase().slice(0, 6)))
  );
  const resellerGaps = engagementGaps.filter(
    (g) => g.entityType === "Reseller" && (g.entityId === resellerId || g.entityName.toLowerCase().includes(resellerName.toLowerCase().slice(0, 6)))
  );
  const METRICS = [
    {
      label: "Renewal Conversion",
      value: "44%",
      trend: "-34% QTD",
      risk: true
    },
    {
      label: "Engagement Score",
      value: "28/100",
      trend: "↓ vs prior quarter",
      risk: true
    },
    {
      label: "Pipeline Health",
      value: "Moderate",
      trend: "3 active deals",
      risk: false
    },
    {
      label: "Target Attainment",
      value: "44%",
      trend: "of $180,000 target",
      risk: true
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "reseller_view.forgeai.panel", children: [
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: "Performance & Engagement Insights" }),
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
                resellerName
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
                "data-ocid": "reseller_view.forgeai.run_analysis.button",
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
    resellerGaps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "reseller_view.forgeai.gap_alerts", children: resellerGaps.map((gap) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 px-4 py-3 rounded-xl border",
        style: {
          background: gap.severity === "Critical" ? "rgba(248,113,113,0.06)" : "rgba(251,146,60,0.06)",
          borderColor: gap.severity === "Critical" ? "rgba(248,113,113,0.2)" : "rgba(251,146,60,0.2)"
        },
        "data-ocid": `reseller_view.forgeai.gap_alert.${gap.alertId}`,
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
                  "Engagement Gap — ",
                  gap.entityName
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "No reseller engagement detected in",
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
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-3",
        "data-ocid": "reseller_view.forgeai.metrics_grid",
        children: METRICS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forgeai-card p-4", children: [
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "reseller_view.forgeai.recommendations", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "text-xs font-semibold uppercase tracking-wider mb-3",
          style: { color: "#6B8CAE" },
          children: "AI Recommendations"
        }
      ),
      resellerRecs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "forgeai-card flex flex-col items-center py-12",
          "data-ocid": "reseller_view.forgeai.recommendations.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              BrainCircuit,
              {
                size: 32,
                style: { color: "rgba(255,107,43,0.4)" },
                className: "mb-3"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No reseller-specific recommendations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "ForgeAI has no active insights for this reseller at this time." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: resellerRecs.map((rec, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": `reseller_view.forgeai.recommendation.item.${i + 1}`,
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
        "data-ocid": "reseller_view.forgeai.performance_trend",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h3",
            {
              className: "text-xs font-semibold uppercase tracking-wider mb-4",
              style: { color: "#6B8CAE" },
              children: "Performance Trend Summary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
            {
              label: "Renewal conversion rate",
              current: 44,
              prior: 78,
              unit: "%"
            },
            {
              label: "Business plan milestone completion",
              current: 22,
              prior: 65,
              unit: "%"
            },
            {
              label: "Enablement sessions attended",
              current: 0,
              prior: 4,
              unit: " of 4"
            }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  style: {
                    color: item.current < item.prior * 0.7 ? "#f87171" : "#facc15"
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
                      background: item.current < item.prior * 0.7 ? "#f87171" : "#facc15"
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
                "Renewal conversion and milestone completion are significantly below target this quarter. Recommend scheduling an urgent performance review call with ",
                resellerName,
                " and assigning channel enablement support before end of Q2."
              ]
            }
          )
        ]
      }
    )
  ] });
}
function OverviewTab({
  accounts,
  renewalsDue,
  riskAccounts,
  activeDeals,
  resellerDeals,
  resellerPlans
}) {
  const totalARR = accounts.reduce(
    (sum, a) => sum + a.estimatedRenewalValue,
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
        "data-ocid": "reseller_view.overview.metrics",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricTile,
            {
              label: "Total Accounts",
              value: accounts.length,
              icon: Building2,
              accent: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricTile,
            {
              label: "Renewals Due (90d)",
              value: renewalsDue.length,
              sub: formatCurrency(
                renewalsDue.reduce((s, a) => s + a.estimatedRenewalValue, 0)
              ),
              icon: CalendarClock
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricTile,
            {
              label: "Active Deals",
              value: activeDeals.length,
              icon: FileCheck
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MetricTile,
            {
              label: "At-Risk Accounts",
              value: riskAccounts.length,
              icon: TriangleAlert
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { size: 14, style: { color: "#FF6B2B" } }),
          " Revenue Summary"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Total ARR" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground", children: formatCurrency(totalARR) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Active Accounts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground", children: accounts.filter((a) => a.status === AccountStatus.Active).length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Prospect Accounts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground", children: accounts.filter((a) => a.status === AccountStatus.Prospect).length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Total Deal Registrations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground", children: resellerDeals.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Business Plans" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-semibold text-foreground", children: resellerPlans.length })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 14, style: { color: "#FF6B2B" } }),
          " Risk Summary"
        ] }),
        riskAccounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No at-risk accounts. 🎉" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          riskAccounts.slice(0, 5).map((a) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                        style: {
                          background: "rgba(255,107,43,0.15)",
                          color: "#FF6B2B"
                        },
                        children: (_a = a.accountName[0]) == null ? void 0 : _a.toUpperCase()
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground truncate", children: a.accountName })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: accountStatusColor(a.status), children: a.status })
                ]
              },
              a.id
            );
          }),
          riskAccounts.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "+",
            riskAccounts.length - 5,
            " more"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function AccountsTab({
  accounts,
  onNavigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        accounts.length,
        " account",
        accounts.length !== 1 ? "s" : "",
        " in this workspace"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: () => ue.info("Create account in reseller workspace coming soon"),
          style: { background: "#FF6B2B" },
          className: "text-white",
          "data-ocid": "reseller_view.accounts.create.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1.5" }),
            " New Account"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: accounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16",
        "data-ocid": "reseller_view.accounts.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 36, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No accounts yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "This reseller has no customer accounts." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Account",
        "Main Contact",
        "Renewal Date",
        "Product Stack",
        "ARR",
        "Risk",
        "Vendor Manager"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: accounts.map((a, i) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `reseller_view.accounts.item.${i + 1}`,
            onClick: () => onNavigate(a.id),
            onKeyDown: (e) => e.key === "Enter" && onNavigate(a.id),
            tabIndex: 0,
            className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                    style: {
                      background: "rgba(255,107,43,0.15)",
                      color: "#FF6B2B"
                    },
                    children: (_a = a.accountName[0]) == null ? void 0 : _a.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: a.accountName })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: a.customerDomain || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RenewalCell, { ns: a.renewalDate }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: a.productList.length > 0 ? `${a.productList.slice(0, 2).join(", ")}${a.productList.length > 2 ? ` +${a.productList.length - 2}` : ""}` : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-foreground tabular-nums", children: formatCurrency(a.estimatedRenewalValue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: accountStatusColor(a.status), children: a.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: a.vendorOwnerId || "—" })
            ]
          },
          a.id
        );
      }) })
    ] }) }) })
  ] });
}
function RenewalsTab({ accounts }) {
  const upcoming = [...accounts].filter((a) => a.renewalDate && renewalDays(a.renewalDate) >= 0).sort((a, b) => Number(a.renewalDate - b.renewalDate));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
      "Renewals (",
      upcoming.length,
      ")"
    ] }) }),
    upcoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16",
        "data-ocid": "reseller_view.renewals.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { size: 36, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No upcoming renewals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "All renewals are past or have no date set." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["Account", "Renewal Date", "Days Until", "ARR", "Status"].map(
        (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: h
          },
          h
        )
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: upcoming.map((a, i) => {
        const days = Math.ceil(renewalDays(a.renewalDate));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `reseller_view.renewals.item.${i + 1}`,
            className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-medium text-foreground", children: a.accountName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RenewalCell, { ns: a.renewalDate }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: days <= 30 ? "text-red-400" : days <= 90 ? "text-yellow-400" : "text-green-400",
                  children: [
                    days,
                    "d"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-foreground tabular-nums", children: formatCurrency(a.estimatedRenewalValue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: accountStatusColor(a.status), children: a.status }) })
            ]
          },
          a.id
        );
      }) })
    ] }) })
  ] });
}
function DealsTab({ deals }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
      "Deal Registrations (",
      deals.length,
      ")"
    ] }) }),
    deals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16",
        "data-ocid": "reseller_view.deals.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 36, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No deal registrations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Deal registrations for this reseller will appear here." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Opportunity",
        "Account",
        "Product",
        "Value",
        "Close Date",
        "Status"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: deals.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `reseller_view.deals.item.${i + 1}`,
          className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-medium text-foreground", children: d.opportunityName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: d.customerDomain || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: d.product || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-foreground tabular-nums", children: formatCurrency(d.estimatedValue) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: d.closeDate ? formatDate(d.closeDate) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: dealStatusColor(d.status), children: dealStatusLabel(d.status) }) })
          ]
        },
        d.id
      )) })
    ] }) })
  ] });
}
function BusinessPlanTab({ plans }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: plans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card flex flex-col items-center py-16",
      "data-ocid": "reseller_view.business_plan.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 36, className: "text-muted-foreground mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No business plans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Business plans for this reseller will appear here." })
      ]
    }
  ) : plans.map((plan, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card p-5",
      "data-ocid": `reseller_view.business_plan.item.${i + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
              plan.planType,
              " Plan ·",
              " ",
              plan.quarter ? `Q${plan.quarter} ` : "",
              "FY",
              plan.year.toString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: plan.objective })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Revenue Target" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold", style: { color: "#FF6B2B" }, children: formatCurrency(plan.revenueTarget) })
          ] })
        ] }),
        plan.activities.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wider", children: "Activities" }),
          plan.activities.map((act) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: act.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `px-2 py-0.5 rounded-full text-[10px] font-medium ${act.status === "Completed" ? "bg-green-500/15 text-green-400" : act.status === "Overdue" ? "bg-red-500/15 text-red-400" : "bg-secondary text-muted-foreground"}`,
                    children: act.status
                  }
                )
              ]
            },
            act.id
          ))
        ] })
      ]
    },
    plan.id
  )) });
}
function ActivityTab({
  resellerName,
  accounts,
  deals
}) {
  const feed = [
    ...accounts.slice(0, 10).map((a) => ({
      id: `acc-${a.id}`,
      label: `Account updated: ${a.accountName}`,
      sub: `Status: ${a.status} · ${formatCurrency(a.estimatedRenewalValue)}`,
      ts: a.updatedAt,
      kind: "account"
    })),
    ...deals.slice(0, 10).map((d) => ({
      id: `deal-${d.id}`,
      label: `Deal registration: ${d.opportunityName}`,
      sub: `${dealStatusLabel(d.status)} · ${formatCurrency(d.estimatedValue)}`,
      ts: d.updatedAt,
      kind: "deal"
    }))
  ].sort((a, b) => Number(b.ts - a.ts));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground", children: [
      "Recent Activity — ",
      resellerName
    ] }) }),
    feed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16",
        "data-ocid": "reseller_view.activity.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 36, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No activity yet" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: feed.slice(0, 20).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `reseller_view.activity.item.${i + 1}`,
        className: "flex items-start gap-4 px-5 py-3.5 hover:bg-secondary/20 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
              style: {
                background: item.kind === "deal" ? "rgba(255,107,43,0.15)" : "rgba(255,255,255,0.06)",
                color: item.kind === "deal" ? "#FF6B2B" : "var(--muted-foreground)"
              },
              children: item.kind === "deal" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 12 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: item.sub })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground flex-shrink-0", children: formatDate(item.ts) })
        ]
      },
      item.id
    )) })
  ] });
}
export {
  ResellerPartnerView
};
