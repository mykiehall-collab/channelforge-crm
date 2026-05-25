import { r as reactExports, j as jsxRuntimeExports, e as TrendingUp, a9 as Globe, f as TrendingDown, y as Target, b as ChartColumn } from "./index-DvFvlUBj.js";
import { u as useKPIGovernance } from "./useKPIGovernance-DlQd85gm.js";
import { M as Minus } from "./minus-OwCcNK6_.js";
const STATUS_CONFIG = {
  exceeding: {
    label: "Exceeding",
    color: "text-purple-300",
    bg: "bg-purple-500/15",
    border: "border-purple-500/40"
  },
  ahead: {
    label: "Ahead",
    color: "text-blue-300",
    bg: "bg-blue-500/15",
    border: "border-blue-500/40"
  },
  on_track: {
    label: "On Track",
    color: "text-green-300",
    bg: "bg-green-500/15",
    border: "border-green-500/40"
  },
  growth_risk: {
    label: "Growth Risk",
    color: "text-amber-300",
    bg: "bg-amber-500/15",
    border: "border-amber-500/40"
  },
  underperforming: {
    label: "Underperforming",
    color: "text-red-300",
    bg: "bg-red-500/15",
    border: "border-red-500/40"
  }
};
const HEATMAP_COLS = [
  "Renewal Rev",
  "AI Adoption",
  "Pipeline",
  "MDF ROI",
  "Forecast Acc."
];
const HEATMAP_DATA = [
  {
    territory: "Nordics",
    yoy: -8,
    statuses: [
      "growth_risk",
      "on_track",
      "underperforming",
      "on_track",
      "growth_risk"
    ]
  },
  {
    territory: "DACH",
    yoy: 12,
    statuses: ["on_track", "ahead", "on_track", "on_track", "on_track"]
  },
  {
    territory: "UK & Ireland",
    yoy: 22,
    statuses: ["ahead", "on_track", "ahead", "exceeding", "on_track"]
  },
  {
    territory: "Benelux",
    yoy: 5,
    statuses: ["on_track", "on_track", "growth_risk", "on_track", "on_track"]
  },
  {
    territory: "Southern Europe",
    yoy: -3,
    statuses: [
      "growth_risk",
      "growth_risk",
      "underperforming",
      "growth_risk",
      "growth_risk"
    ]
  },
  {
    territory: "North America",
    yoy: 31,
    statuses: ["exceeding", "exceeding", "exceeding", "ahead", "exceeding"]
  },
  {
    territory: "APAC",
    yoy: 18,
    statuses: ["ahead", "ahead", "on_track", "ahead", "ahead"]
  }
];
const STAT_TILES = [
  {
    label: "YoY Pipeline Growth",
    value: "+21.4%",
    sub: "vs +18% target",
    status: "ahead"
  },
  {
    label: "Renewal Retention",
    value: "87.2%",
    sub: "vs 85% benchmark",
    status: "on_track"
  },
  {
    label: "Territories Ahead",
    value: "5 / 7",
    sub: "2 growth risk zones",
    status: "ahead"
  },
  {
    label: "Forecast Accuracy",
    value: "91.3%",
    sub: "+4.1pp vs prior year",
    status: "exceeding"
  }
];
const FORECAST_CARDS = [
  {
    id: "fc-1",
    title: "Revenue Attainment",
    priorYear: 2.4,
    currentTarget: 3,
    forecast: 2.7,
    unit: "£M",
    yoyExpected: 25,
    yoyForecast: 12.5,
    status: "growth_risk",
    insight: "Nordics and Southern Europe are dragging overall revenue attainment. Q3 pipeline needs acceleration."
  },
  {
    id: "fc-2",
    title: "Pipeline Coverage",
    priorYear: 8.1,
    currentTarget: 10.2,
    forecast: 10.8,
    unit: "£M",
    yoyExpected: 26,
    yoyForecast: 33.3,
    status: "exceeding",
    insight: "North America and APAC are driving strong pipeline generation above YoY expectations."
  },
  {
    id: "fc-3",
    title: "Renewal Revenue",
    priorYear: 1.8,
    currentTarget: 2.1,
    forecast: 2.05,
    unit: "£M",
    yoyExpected: 16.7,
    yoyForecast: 13.9,
    status: "on_track",
    insight: "Renewal performance stabilizing. Tier 1 territories tracking well; Nordics require intervention."
  }
];
function YoYGrowthPage() {
  const [period, setPeriod] = reactExports.useState("Q1");
  const { getForgeInsights } = useKPIGovernance();
  const insights = getForgeInsights().slice(0, 4);
  const heatCell = (s) => {
    const cfg = STATUS_CONFIG[s];
    return cfg ? `${cfg.bg} ${cfg.border} border` : "bg-slate-700/30";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-6xl mx-auto px-4 py-6 space-y-8",
      "data-ocid": "yoy_growth.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-6 h-6 text-orange-400" }),
              "YoY Growth Intelligence"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-1", children: "Year-over-year performance tracking, territory health and strategic forecast" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-[#1e293b] rounded-lg p-1 border border-slate-700/50", children: ["Q1", "Q2", "Q3", "Q4", "FY"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setPeriod(p),
              "data-ocid": `yoy_growth.period.${p.toLowerCase()}`,
              className: `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${period === p ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-200"}`,
              children: p
            },
            p
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
            "data-ocid": "yoy_growth.stats.section",
            children: STAT_TILES.map((tile) => {
              const cfg = STATUS_CONFIG[tile.status];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `bg-[#1e293b] rounded-lg p-4 border ${cfg.border}`,
                  "data-ocid": `yoy_growth.stat.${tile.label.toLowerCase().replace(/\s+/g, "_")}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-1", children: tile.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-white", children: tile.value }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`,
                        children: tile.sub
                      }
                    )
                  ]
                },
                tile.label
              );
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden",
            "data-ocid": "yoy_growth.heatmap.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-slate-700/40 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 text-orange-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white", children: "Territory Growth Heatmap" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-slate-500", children: [
                  period,
                  " 2025"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-700/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-slate-400 font-medium w-40", children: "Territory" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-3 text-slate-400 font-medium", children: "YoY Δ" }),
                  HEATMAP_COLS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "th",
                    {
                      className: "text-center px-3 py-3 text-slate-400 font-medium",
                      children: col
                    },
                    col
                  ))
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: HEATMAP_DATA.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-slate-700/20 hover:bg-slate-700/10",
                    "data-ocid": `yoy_growth.heatmap.row.${ri + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-200 font-medium", children: row.territory }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: `flex items-center justify-end gap-1 font-semibold ${row.yoy >= 0 ? "text-green-400" : "text-red-400"}`,
                          children: [
                            row.yoy >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3 h-3" }),
                            row.yoy > 0 ? "+" : "",
                            row.yoy,
                            "%"
                          ]
                        }
                      ) }),
                      row.statuses.map((s) => {
                        var _a, _b;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `inline-block px-2 py-0.5 rounded text-xs font-medium ${heatCell(s)} ${((_a = STATUS_CONFIG[s]) == null ? void 0 : _a.color) ?? "text-slate-300"}`,
                            children: ((_b = STATUS_CONFIG[s]) == null ? void 0 : _b.label) ?? s
                          }
                        ) }, s);
                      })
                    ]
                  },
                  row.territory
                )) })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "yoy_growth.forecast.section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 text-orange-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white", children: "Strategic Forecast vs YoY Target" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-slate-500", children: [
              period,
              " 2025"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: FORECAST_CARDS.map((card) => {
            const cfg = STATUS_CONFIG[card.status];
            const pct = Math.min(
              100,
              Math.round(card.forecast / card.currentTarget * 100)
            );
            const fillColor = card.status === "exceeding" ? "bg-purple-500" : card.status === "ahead" ? "bg-blue-500" : card.status === "on_track" ? "bg-green-500" : card.status === "growth_risk" ? "bg-amber-500" : "bg-red-500";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `bg-[#1e293b] rounded-xl p-5 border ${cfg.border}`,
                "data-ocid": `yoy_growth.forecast.${card.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white", children: card.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`,
                        children: cfg.label
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mb-3 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Prior Year" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-slate-300", children: [
                        card.unit,
                        card.priorYear
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Target" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-white", children: [
                        card.unit,
                        card.currentTarget
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Forecast" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: `text-base font-bold ${card.forecast >= card.currentTarget ? "text-green-400" : "text-amber-400"}`,
                          children: [
                            card.unit,
                            card.forecast
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-slate-700 rounded-full mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `h-1.5 rounded-full ${fillColor}`,
                      style: { width: `${pct}%` }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "YoY Expected" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      card.yoyForecast >= card.yoyExpected ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3 h-3 text-red-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: card.yoyForecast >= card.yoyExpected ? "text-green-400" : "text-red-400",
                          children: [
                            "+",
                            card.yoyForecast,
                            "%"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500", children: [
                        "/ +",
                        card.yoyExpected,
                        "% target"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `rounded-lg p-3 ${cfg.bg} border ${cfg.border}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ChartColumn,
                          {
                            className: `w-3 h-3 mt-0.5 flex-shrink-0 ${cfg.color}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs leading-relaxed ${cfg.color}`, children: card.insight })
                      ] })
                    }
                  )
                ]
              },
              card.id
            );
          }) })
        ] }),
        insights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-[#1e293b] rounded-xl border border-orange-500/20 p-5",
            "data-ocid": "yoy_growth.forge_insights.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-orange-400 text-xs font-bold", children: "AI" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white", children: "ForgeAI Growth Intelligence" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: insights.map((ins, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-3 bg-slate-800/50 rounded-lg p-3",
                  "data-ocid": `yoy_growth.insight.item.${i + 1}`,
                  children: [
                    (ins.type === "trending_up" || ins.type === "growth_acceleration") && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" }),
                    (ins.type === "trending_down" || ins.type === "underperformance_warning") && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" }),
                    ins.type !== "trending_up" && ins.type !== "growth_acceleration" && ins.type !== "trending_down" && ins.type !== "underperformance_warning" && /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-200 leading-relaxed", children: ins.message }),
                      ins.territory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 mt-0.5 block", children: ins.territory })
                    ] })
                  ]
                },
                ins.id
              )) })
            ]
          }
        )
      ]
    }
  );
}
export {
  YoYGrowthPage
};
