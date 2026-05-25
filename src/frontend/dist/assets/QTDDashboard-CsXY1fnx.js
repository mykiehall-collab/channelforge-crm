import { c as createLucideIcon, a as useNavigate, u as useApp, at as useForex, r as reactExports, bm as PartnerTier, j as jsxRuntimeExports, b as ChartColumn, a6 as RefreshCw, ax as CurrencySelector, k as ChevronDown, w as Settings, A as ArrowRight, T as TriangleAlert, y as Target, W as formatCurrency, n as Clock, X, e as TrendingUp } from "./index-DvFvlUBj.js";
import { T as TierBadge } from "./TierBadge-juuOTVtt.js";
import { u as useTargets } from "./useTargets-v1HbgFMi.js";
import { F as Funnel } from "./funnel-ouUqz1CV.js";
import { M as Minus } from "./minus-OwCcNK6_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode);
function Skeleton({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded animate-pulse bg-secondary/40 ${className ?? ""}`
    }
  );
}
function AttainmentBadge({ pct }) {
  if (pct === null)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" });
  const color = pct >= 100 ? "bg-[#FF6B2B]/20 text-[#FF6B2B] border border-[#FF6B2B]/30" : pct >= 75 ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/25" : "bg-red-500/15 text-red-400 border border-red-500/25";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-bold ${color}`,
      children: [
        pct >= 100 && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-2.5 h-2.5 mr-1" }),
        pct.toFixed(1),
        "%"
      ]
    }
  );
}
function TrendIndicator({ delta }) {
  if (delta === null)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono", children: "—" });
  if (Math.abs(delta) < 0.5)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3.5 h-3.5 text-muted-foreground" });
  if (delta > 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-3.5 h-3.5 text-green-400" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3.5 h-3.5 text-red-400" });
}
function QuarterProgressBar({
  quarterDef,
  daysElapsed,
  daysRemaining,
  progressPercent
}) {
  const start = new Date(quarterDef.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const end = new Date(quarterDef.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 mt-1", "data-ocid": "qtd.progress_bar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-mono text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        quarterDef.name,
        ": ",
        start,
        " – ",
        end
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#FF6B2B] font-bold", children: [
        progressPercent,
        "% complete"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-2 rounded-full bg-secondary/50 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute left-0 top-0 h-full rounded-full transition-all duration-700",
        style: {
          width: `${Math.min(100, progressPercent)}%`,
          background: "linear-gradient(90deg, #FF6B2B 0%, #FF8C55 100%)"
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono text-muted-foreground", children: [
      daysElapsed,
      " days elapsed · ",
      daysRemaining,
      " days remaining"
    ] })
  ] });
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
  ocid
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-tile", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32 mb-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
    ] });
  }
  const displayValue = isCurrency ? formatCurrency(value, currency) : value.toLocaleString();
  const targetDisplay = target !== null ? isCurrency ? formatCurrency(target, currency) : target.toLocaleString() : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-tile group", "data-ocid": ocid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-label uppercase tracking-wider text-[10px] font-semibold", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendIndicator, { delta })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "metric-value text-3xl mt-1", children: displayValue }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: targetDisplay !== null ? `Target: ${targetDisplay}` : "No target set" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AttainmentBadge, { pct: attainmentPct })
    ] })
  ] });
}
function Chip({
  label,
  onRemove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono bg-accent/15 text-accent border border-accent/25", children: [
    label,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onRemove,
        "aria-label": `Remove ${label}`,
        className: "hover:text-foreground transition-colors",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2.5 h-2.5" })
      }
    )
  ] });
}
const RANK_BORDERS = [
  "border-l-2 border-l-[#F0CC5A]",
  // Gold
  "border-l-2 border-l-[#C4C5C9]",
  // Silver
  "border-l-2 border-l-[#CD7F32]"
  // Bronze
];
function QTDDashboard() {
  var _a, _b, _c;
  const navigate = useNavigate();
  const { isVendor, fiscalYearConfig, currentQuarter } = useApp();
  const forex = useForex();
  const targets = useTargets();
  const vendorView = isVendor();
  const [viewMode, setViewMode] = reactExports.useState("vendor");
  const [selectedQuarterKey, setSelectedQuarterKey] = reactExports.useState(
    null
  );
  const [countries, setCountries] = reactExports.useState([]);
  const [countryInput, setCountryInput] = reactExports.useState("");
  const [tiers, setTiers] = reactExports.useState([]);
  const [productFamilies, setProductFamilies] = reactExports.useState([]);
  const [productInput, setProductInput] = reactExports.useState("");
  const [partnerFilter, setPartnerFilter] = reactExports.useState("");
  const [metrics, setMetrics] = reactExports.useState(null);
  const [rankings, setRankings] = reactExports.useState([]);
  const [loadingMetrics, setLoadingMetrics] = reactExports.useState(false);
  const [loadingRankings, setLoadingRankings] = reactExports.useState(false);
  const [noData, setNoData] = reactExports.useState(false);
  const didLoadRef = reactExports.useRef(false);
  const quarters = (fiscalYearConfig == null ? void 0 : fiscalYearConfig.quarters) ?? ((_a = targets.fiscalYearConfig) == null ? void 0 : _a.quarters) ?? [];
  const activeQuarterDef = selectedQuarterKey ? quarters.find((q) => q.quarterId === selectedQuarterKey) ?? null : (currentQuarter == null ? void 0 : currentQuarter.quarterDef) ?? ((_b = targets.currentQuarter) == null ? void 0 : _b.quarterDef) ?? null;
  const activeCurrentQuarter = currentQuarter ?? targets.currentQuarter;
  const quarterLabel = activeQuarterDef ? `${activeQuarterDef.name} · ${new Date(activeQuarterDef.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – ${new Date(activeQuarterDef.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "No quarter configured";
  const fxTimestamp = forex.lastUpdated ? (() => {
    const ms = Date.now() - forex.lastUpdated.getTime();
    const mins = Math.floor(ms / 6e4);
    const hrs = Math.floor(ms / 36e5);
    if (mins < 60) return `${mins}m ago`;
    return `${hrs}h ago`;
  })() : "—";
  const buildFilters = reactExports.useCallback(
    () => ({
      quarterKey: selectedQuarterKey ?? (activeQuarterDef == null ? void 0 : activeQuarterDef.quarterId) ?? null,
      country: countries.length ? countries[0] : null,
      resellerId: partnerFilter || null,
      tierName: tiers.length ? tiers[0] : null,
      productFamily: productFamilies.length ? productFamilies[0] : null,
      currency: forex.displayCurrency,
      targetSegment: null
    }),
    [
      selectedQuarterKey,
      activeQuarterDef,
      countries,
      partnerFilter,
      tiers,
      productFamilies,
      forex.displayCurrency
    ]
  );
  const loadMetrics = reactExports.useCallback(async () => {
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
  const loadRankings = reactExports.useCallback(async () => {
    if (!vendorView) return;
    const qKey = selectedQuarterKey ?? (activeQuarterDef == null ? void 0 : activeQuarterDef.quarterId) ?? "Q1";
    setLoadingRankings(true);
    try {
      const result = await targets.getPartnerRankings(qKey);
      setRankings(result);
    } finally {
      setLoadingRankings(false);
    }
  }, [vendorView, targets, selectedQuarterKey, activeQuarterDef]);
  reactExports.useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    loadMetrics();
    if (vendorView) loadRankings();
  }, [loadMetrics, loadRankings, vendorView]);
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
  const safeMetrics = metrics ?? {
    quarterKey: (activeQuarterDef == null ? void 0 : activeQuarterDef.quarterId) ?? "",
    renewalRevenue: 0,
    newBusinessRevenue: 0,
    pipelineCreated: 0,
    pipelineClosed: 0,
    dealRegistrationsSubmitted: 0,
    dealRegistrationsApproved: 0,
    currency: "USD",
    calculatedAt: BigInt(0)
  };
  const metricDefs = [
    {
      id: "Measure1",
      value: safeMetrics.renewalRevenue,
      isCurrency: true,
      target: 24e4,
      delta: 8.4,
      ocid: "qtd.metric_card.renewal_revenue"
    },
    {
      id: "Measure2",
      value: safeMetrics.newBusinessRevenue,
      isCurrency: true,
      target: 18e4,
      delta: -3.2,
      ocid: "qtd.metric_card.new_business"
    },
    {
      id: "Measure3",
      value: safeMetrics.pipelineCreated,
      isCurrency: true,
      target: 52e4,
      delta: 12.1,
      ocid: "qtd.metric_card.pipeline_created"
    },
    {
      id: "Measure4",
      value: safeMetrics.pipelineClosed,
      isCurrency: true,
      target: 31e4,
      delta: 0.2,
      ocid: "qtd.metric_card.pipeline_closed"
    },
    {
      id: "Measure4",
      value: Number(safeMetrics.dealRegistrationsSubmitted),
      isCurrency: false,
      target: 120,
      delta: 5,
      ocid: "qtd.metric_card.dr_submitted"
    },
    {
      id: "Measure5",
      value: Number(safeMetrics.dealRegistrationsApproved),
      isCurrency: false,
      target: 95,
      delta: null,
      ocid: "qtd.metric_card.dr_approved"
    }
  ];
  const CUSTOM_LABELS = {
    "qtd.metric_card.dr_submitted": "Deal Regs Submitted",
    "qtd.metric_card.dr_approved": "Deal Regs Approved"
  };
  const MOCK_RANKINGS = [
    {
      rank: 1,
      resellerId: "r1",
      resellerName: "Westbrook Technology",
      renewalRevenue: 342e3,
      attainmentPercent: 142.5,
      tier: PartnerTier.Platinum
    },
    {
      rank: 2,
      resellerId: "r2",
      resellerName: "Apex Solutions GmbH",
      renewalRevenue: 295e3,
      attainmentPercent: 123,
      tier: PartnerTier.Gold
    },
    {
      rank: 3,
      resellerId: "r3",
      resellerName: "CoreAxis Partners",
      renewalRevenue: 261e3,
      attainmentPercent: 108.8,
      tier: PartnerTier.Platinum
    },
    {
      rank: 4,
      resellerId: "r4",
      resellerName: "Luminary Systems",
      renewalRevenue: 218e3,
      attainmentPercent: 90.8,
      tier: PartnerTier.Gold
    },
    {
      rank: 5,
      resellerId: "r5",
      resellerName: "NovaBridge UK",
      renewalRevenue: 196e3,
      attainmentPercent: 81.7,
      tier: PartnerTier.Silver
    },
    {
      rank: 6,
      resellerId: "r6",
      resellerName: "Elevate Digital",
      renewalRevenue: 174e3,
      attainmentPercent: 72.5,
      tier: PartnerTier.Gold
    },
    {
      rank: 7,
      resellerId: "r7",
      resellerName: "CloudPath APAC",
      renewalRevenue: 152e3,
      attainmentPercent: 63.3,
      tier: PartnerTier.Silver
    },
    {
      rank: 8,
      resellerId: "r8",
      resellerName: "Synergy IT SA",
      renewalRevenue: 138e3,
      attainmentPercent: 57.5,
      tier: PartnerTier.Silver
    },
    {
      rank: 9,
      resellerId: "r9",
      resellerName: "Fortis Networks",
      renewalRevenue: 124e3,
      attainmentPercent: 51.7,
      tier: PartnerTier.Silver
    },
    {
      rank: 10,
      resellerId: "r10",
      resellerName: "Summit Tech Dubai",
      renewalRevenue: 109e3,
      attainmentPercent: 45.4,
      tier: PartnerTier.Silver
    }
  ];
  const displayRankings = rankings.length > 0 ? rankings : MOCK_RANKINGS;
  const noQuarterConfigured = !activeQuarterDef && !targets.loading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-full", "data-ocid": "qtd.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card border-b border-border px-6 py-4",
        "data-ocid": "qtd.header",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-5 h-5 text-accent flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Quarter-to-Date Dashboard" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-mono", children: quarterLabel }),
            activeCurrentQuarter && activeQuarterDef && /* @__PURE__ */ jsxRuntimeExports.jsx(
              QuarterProgressBar,
              {
                quarterDef: activeCurrentQuarter.quarterDef,
                daysElapsed: activeCurrentQuarter.daysElapsed,
                daysRemaining: activeCurrentQuarter.daysRemaining,
                progressPercent: activeCurrentQuarter.progressPercent
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/20 text-xs font-mono text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: forex.providerName.split(" ").slice(0, 2).join(" ").toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "updated ",
                fxTimestamp
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencySelector, { forex, compact: true })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card/60 border-b border-border px-6 py-3",
        "data-ocid": "qtd.filter_panel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "qtd-quarter-select",
                className: "text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Quarter"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "qtd-quarter-select",
                  "data-ocid": "qtd.filter.quarter_select",
                  value: selectedQuarterKey ?? "",
                  onChange: (e) => setSelectedQuarterKey(e.target.value || null),
                  className: "crm-input h-8 text-xs pr-7 pl-2 appearance-none min-w-[90px]",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Current" }),
                    quarters.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: q.quarterId, children: q.name }, q.quarterId)),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "All" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "qtd-country-input",
                className: "text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Country / Region"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-wrap", children: [
              countries.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: c,
                  onRemove: () => setCountries((p) => p.filter((x) => x !== c))
                },
                c
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "qtd-country-input",
                  type: "text",
                  "data-ocid": "qtd.filter.country_input",
                  placeholder: "+ Add",
                  value: countryInput,
                  onChange: (e) => setCountryInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && countryInput.trim()) {
                      setCountries((p) => [...p, countryInput.trim()]);
                      setCountryInput("");
                    }
                  },
                  className: "crm-input h-8 text-xs px-2 w-20"
                }
              )
            ] })
          ] }),
          vendorView && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "qtd-partner-input",
                className: "text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Reseller"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "qtd-partner-input",
                type: "text",
                "data-ocid": "qtd.filter.partner_input",
                placeholder: "Filter reseller…",
                value: partnerFilter,
                onChange: (e) => setPartnerFilter(e.target.value),
                className: "crm-input h-8 text-xs px-2 w-36"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "Reseller Tier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 h-8", children: ["Silver", "Gold", "Platinum"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-1.5 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      "data-ocid": `qtd.filter.tier_${t.toLowerCase()}`,
                      checked: tiers.includes(t),
                      onChange: (e) => setTiers(
                        (p) => e.target.checked ? [...p, t] : p.filter((x) => x !== t)
                      ),
                      className: "w-3 h-3 accent-[#FF6B2B]"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: t })
                ]
              },
              t
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "qtd-product-input",
                className: "text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider",
                children: "Product Family"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-wrap", children: [
              productFamilies.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: p,
                  onRemove: () => setProductFamilies((prev) => prev.filter((x) => x !== p))
                },
                p
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "qtd-product-input",
                  type: "text",
                  "data-ocid": "qtd.filter.product_input",
                  placeholder: "+ Add",
                  value: productInput,
                  onChange: (e) => setProductInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && productInput.trim()) {
                      setProductFamilies((p) => [...p, productInput.trim()]);
                      setProductInput("");
                    }
                  },
                  className: "crm-input h-8 text-xs px-2 w-20"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "qtd.filter.clear_button",
                onClick: handleClearFilters,
                className: "text-xs text-muted-foreground hover:text-foreground transition-colors h-8 px-2",
                children: "Clear"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "qtd.filter.apply_button",
                onClick: handleApplyFilters,
                className: "flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#FF6B2B] text-white text-xs font-semibold hover:bg-[#FF8C55] transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3 h-3" }),
                  "Apply"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-6 space-y-6 bg-background", children: [
      noQuarterConfigured && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "qtd.no_quarter_state",
          className: "flex flex-col items-center justify-center gap-4 py-16 px-6 rounded-xl border-2 border-dashed border-accent/30 bg-accent/5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-7 h-7 text-accent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-bold text-foreground mb-1", children: "Fiscal Year Not Configured" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md", children: "Set up your fiscal year and quarter dates to activate QTD reporting and track performance against targets." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "qtd.setup_cta_button",
                onClick: () => navigate({ to: "/admin/quarter-setup" }),
                className: "flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF6B2B] text-white font-semibold text-sm hover:bg-[#FF8C55] transition-colors",
                children: [
                  "Set Up Quarter Configuration",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                ]
              }
            )
          ]
        }
      ),
      !noQuarterConfigured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "QTD Performance" }),
          loadingMetrics && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Loading metrics…" })
          ] })
        ] }),
        noData && !loadingMetrics && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "qtd.metrics.empty_state",
            className: "flex flex-col items-center justify-center gap-3 py-10 rounded-xl border border-dashed border-border bg-secondary/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "No data matches your filter selection. Try adjusting the filters above." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-2 lg:grid-cols-3 gap-4",
            "data-ocid": "qtd.metric_cards_grid",
            children: metricDefs.map((m) => {
              const label = CUSTOM_LABELS[m.ocid] ?? targets.getMeasureDisplayName(m.id);
              const attainment = m.target !== null && m.target > 0 ? Math.round(m.value / m.target * 1e3) / 10 : null;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                MetricCard,
                {
                  label,
                  value: m.isCurrency ? forex.convertAmount(m.value, safeMetrics.currency) : m.value,
                  target: m.target,
                  isCurrency: m.isCurrency,
                  currency: forex.displayCurrency,
                  attainmentPct: attainment,
                  delta: m.delta,
                  loading: loadingMetrics,
                  ocid: m.ocid
                },
                m.ocid
              );
            })
          }
        )
      ] }),
      vendorView && !noQuarterConfigured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 p-1 rounded-lg bg-card border border-border w-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "qtd.view_toggle.vendor",
            onClick: () => setViewMode("vendor"),
            className: `px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${viewMode === "vendor" ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground"}`,
            children: "Vendor-wide"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "qtd.view_toggle.partner",
            onClick: () => setViewMode("partner"),
            className: `px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${viewMode === "partner" ? "bg-accent text-white" : "text-muted-foreground hover:text-foreground"}`,
            children: "By Reseller"
          }
        )
      ] }),
      vendorView && !noQuarterConfigured && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "qtd.rankings_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "Reseller Performance Rankings — QTD" })
          ] }),
          loadingRankings && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "qtd.rankings_table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-[#0F1A2C]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider w-12", children: "Rank" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "Reseller" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "Tier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "Renewal Revenue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "Attainment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider", children: "vs Last Qtr" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loadingRankings ? ["s0", "s1", "s2", "s3", "s4"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "tr",
              {
                className: "border-b border-border/40",
                children: ["c0", "c1", "c2", "c3", "c4", "c5"].map((ck) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: "px-4 py-3",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" })
                  },
                  `skel-cell-${sk}-${ck}`
                ))
              },
              `skel-row-${sk}`
            )) : displayRankings.slice(0, 10).map((r, idx) => {
              const borderClass = RANK_BORDERS[idx] ?? "";
              const rowBg = idx % 2 === 0 ? "bg-background/30" : "bg-background/10";
              const tier = r.tier ?? PartnerTier.Silver;
              const deltaPct = [
                12.3,
                5.1,
                -2.4,
                8.7,
                -6,
                3.2,
                -1.1,
                4.5,
                -8.3,
                0.7
              ][idx] ?? null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  "data-ocid": `qtd.rankings_table.item.${idx + 1}`,
                  className: `border-b border-border/30 cursor-pointer hover:bg-secondary/20 transition-colors ${borderClass} ${rowBg}`,
                  onClick: () => navigate({ to: `/reseller/${r.resellerId}` }),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate({ to: `/reseller/${r.resellerId}` });
                  },
                  tabIndex: 0,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-sm font-mono font-bold ${idx === 0 ? "text-[#F0CC5A]" : idx === 1 ? "text-[#C4C5C9]" : idx === 2 ? "text-[#CD7F32]" : "text-muted-foreground"}`,
                        children: idx < 3 ? ["🥇", "🥈", "🥉"][idx] : `#${r.rank}`
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-sm", children: r.resellerName }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier, size: "sm" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono font-semibold text-foreground", children: formatCurrency(
                      forex.convertAmount(r.renewalRevenue, "USD"),
                      forex.displayCurrency
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AttainmentBadge, { pct: r.attainmentPercent }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendIndicator, { delta: deltaPct }),
                      deltaPct !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: `text-xs font-mono ${deltaPct > 0 ? "text-green-400" : deltaPct < 0 ? "text-red-400" : "text-muted-foreground"}`,
                          children: [
                            deltaPct > 0 ? "+" : "",
                            deltaPct.toFixed(1),
                            "%"
                          ]
                        }
                      )
                    ] }) })
                  ]
                },
                r.resellerId
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-t border-border/40 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "qtd.rankings_table.view_all_button",
              onClick: () => navigate({ to: "/reseller/$id", params: { id: "all" } }),
              className: "flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold transition-colors",
              children: [
                "View all resellers",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
              ]
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border-t border-border bg-card px-6 py-3 flex items-center justify-between flex-wrap gap-2",
        "data-ocid": "qtd.footer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] font-mono text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "FX Source: ",
              forex.providerName.split(" ").slice(0, 2).join(" ")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Rate captured:",
              " ",
              ((_c = forex.lastUpdated) == null ? void 0 : _c.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "numeric"
              })) ?? "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Quarter:",
              " ",
              activeQuarterDef ? `${activeQuarterDef.name} ${new Date(activeQuarterDef.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(activeQuarterDef.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "Not configured"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Last refreshed: just now" })
          ] })
        ]
      }
    )
  ] });
}
export {
  QTDDashboard
};
