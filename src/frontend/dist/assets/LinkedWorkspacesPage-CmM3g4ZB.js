import { c as createLucideIcon, u as useApp, s as useFilterContext, r as reactExports, B as Building2, $ as Network, U as Users, x as ChartNoAxesColumn, H as Shield, a9 as Globe, e as TrendingUp, i as ChevronRight, j as jsxRuntimeExports, d as Brain, T as TriangleAlert } from "./index-DvFvlUBj.js";
import { C as Card, a as CardContent } from "./card-DWB_Rthq.js";
import { a as DEMO_CASES, b as DEMO_CUSTOMERS, g as getEcosystemForOrgType, c as DEMO_MDF_REQUESTS, d as DEMO_OPPORTUNITIES } from "./demoEcosystem-CavgYYzT.js";
import { A as Activity } from "./activity-BzA2r-7b.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ],
  ["path", { d: "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27", key: "1uw2ng" }]
];
const HeartPulse = createLucideIcon("heart-pulse", __iconNode);
const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const healthColor = (score) => score >= 85 ? "text-green-400" : score >= 70 ? "text-yellow-400" : "text-red-400";
const fmtK = (v) => v >= 1e6 ? `£${(v / 1e6).toFixed(1)}M` : `£${(v / 1e3).toFixed(0)}K`;
function OrgCard({ org }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 flex flex-col gap-2 hover:border-accent/40 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-primary/20 border border-primary/40 shrink-0", children: initials(org.name) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground truncate", children: org.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: org.territory })
      ] })
    ] }),
    org.healthScore !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Health:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `font-semibold ${healthColor(org.healthScore)}`, children: [
        org.healthScore,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `h-full rounded-full ${org.healthScore >= 85 ? "bg-green-400" : org.healthScore >= 70 ? "bg-yellow-400" : "bg-red-400"}`,
          style: { width: `${org.healthScore}%` }
        }
      ) })
    ] }),
    org.performanceMetrics && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "QTD:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: fmtK(org.performanceMetrics.qtd) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "QoQ:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `font-semibold ${org.performanceMetrics.qoq >= 0 ? "text-green-400" : "text-destructive"}`,
            children: [
              org.performanceMetrics.qoq >= 0 ? "+" : "",
              org.performanceMetrics.qoq,
              "%"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "YoY:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `font-semibold ${org.performanceMetrics.yoy >= 0 ? "text-green-400" : "text-destructive"}`,
            children: [
              org.performanceMetrics.yoy >= 0 ? "+" : "",
              org.performanceMetrics.yoy,
              "%"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
      "Owner: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: org.owner })
    ] })
  ] });
}
const VENDOR_TERRITORIES = [
  {
    territory: "UK & Ireland",
    qtd: "£1.82M",
    qtdStatus: "ahead",
    qoq: "+14%",
    yoy: "+22%",
    yoyStatus: "positive"
  },
  {
    territory: "DACH",
    qtd: "£1.44M",
    qtdStatus: "on-track",
    qoq: "+9%",
    yoy: "+18%",
    yoyStatus: "positive"
  },
  {
    territory: "Nordics",
    qtd: "£640K",
    qtdStatus: "risk",
    qoq: "-5%",
    yoy: "-4%",
    yoyStatus: "negative"
  },
  {
    territory: "Benelux",
    qtd: "£880K",
    qtdStatus: "on-track",
    qoq: "+7%",
    yoy: "+11%",
    yoyStatus: "positive"
  },
  {
    territory: "Southern Europe",
    qtd: "£520K",
    qtdStatus: "risk",
    qoq: "-2%",
    yoy: "+3%",
    yoyStatus: "positive"
  }
];
const FORGE_INSIGHTS = {
  Vendor: [
    {
      type: "warning",
      text: "Westcon EMEA showing -4% YoY decline — engagement review recommended."
    },
    {
      type: "warning",
      text: "Reseller activation rate below target in Nordics. Consider incentive programme review."
    },
    {
      type: "positive",
      text: "Arrow EMEA pipeline momentum +22% YoY — strong distributor growth trajectory."
    }
  ],
  Distributor: [
    {
      type: "positive",
      text: "Microsoft joint pipeline is 18% above commitment target — acceleration opportunity."
    },
    {
      type: "warning",
      text: "Regional performance in Southern Europe tracking below benchmark by 12%."
    },
    {
      type: "info",
      text: "VMware co-marketing budget utilisation at 62% — £91K MDF available before Q close."
    }
  ],
  "Global Distributor": [
    {
      type: "positive",
      text: "Multi-region pipeline coverage improved 15% QoQ across EMEA and APAC."
    },
    {
      type: "warning",
      text: "APAC vendor commitment utilisation below target in Singapore zone."
    },
    {
      type: "info",
      text: "Extended regional MDF allocation available — review vendor co-marketing schedule."
    }
  ],
  Reseller: [
    {
      type: "positive",
      text: "Vendor renewal incentive available — claim before Q3 close. Estimated value: £8,400."
    },
    {
      type: "warning",
      text: "Distributor credit utilisation at 87% — consider requesting credit limit extension."
    },
    {
      type: "info",
      text: "2 deal registrations pending vendor approval for more than 7 days."
    }
  ],
  "Multi-Group Reseller": [
    {
      type: "positive",
      text: "Group-wide pipeline grew 19% QoQ — multi-group momentum is strong."
    },
    {
      type: "warning",
      text: "Renewal coverage gap identified across reseller group B — 3 contracts unassigned."
    },
    {
      type: "info",
      text: "Distributor joint marketing funds available across 2 vendor relationships."
    }
  ]
};
function StatusBadge({
  status
}) {
  const config = {
    ahead: { label: "Ahead", cls: "bg-emerald-500/15 text-emerald-400" },
    "on-track": { label: "On Track", cls: "bg-accent/15 text-accent" },
    risk: { label: "Risk", cls: "bg-destructive/15 text-destructive" },
    positive: { label: "↑", cls: "bg-emerald-500/15 text-emerald-400" },
    negative: { label: "↓", cls: "bg-destructive/15 text-destructive" }
  }[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${config.cls}`,
      children: config.label
    }
  );
}
function ForgeAIPanel({ orgType }) {
  const insights = FORGE_INSIGHTS[orgType] ?? FORGE_INSIGHTS.Vendor;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-accent/20 bg-accent/5 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 14, className: "text-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-accent uppercase tracking-wide", children: "ForgeAI Ecosystem Insights" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: insights.map((ins, i) => {
      const Icon = ins.type === "warning" ? TriangleAlert : ins.type === "positive" ? TrendingUp : Activity;
      const cls = ins.type === "warning" ? "text-amber-400" : ins.type === "positive" ? "text-emerald-400" : "text-accent";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-2.5 p-2.5 rounded-lg bg-card/60 border border-border/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13, className: `flex-shrink-0 mt-0.5 ${cls}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: ins.text })
          ]
        },
        `insight-${ins.type ?? i}`
      );
    }) })
  ] });
}
function DistributorsTab() {
  const ecosystem = getEcosystemForOrgType("Vendor");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6", children: ecosystem.distributors.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": `linked_workspaces.distributor_card.${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrgCard, { org: d })
      },
      d.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Vendor" })
  ] });
}
function ResellersTab({ orgType }) {
  const ecosystem = getEcosystemForOrgType(orgType);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6", children: ecosystem.resellers.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": `linked_workspaces.reseller_card.${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrgCard, { org: r })
      },
      r.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType })
  ] });
}
function TerritoryPerformanceTab({ orgType }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Territory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "QTD Revenue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "QTD Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "QoQ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "YoY" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/50", children: VENDOR_TERRITORIES.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `linked_workspaces.territory_row.${i + 1}`,
          className: "bg-background hover:bg-card/60 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: t.territory }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold tabular-nums", children: t.qtd }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: t.qtdStatus }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: `px-4 py-3 text-right font-semibold tabular-nums text-xs ${t.qoq.startsWith("-") ? "text-destructive" : "text-emerald-400"}`,
                children: t.qoq
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: t.yoyStatus }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `ml-1 text-xs font-semibold tabular-nums ${t.yoyStatus === "negative" ? "text-destructive" : "text-emerald-400"}`,
                  children: t.yoy
                }
              )
            ] })
          ]
        },
        t.territory
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType })
  ] });
}
function EcosystemHealthTab() {
  const metrics = [
    {
      label: "Active Distributors",
      value: "8 / 10",
      icon: Network,
      color: "text-accent"
    },
    {
      label: "Active Resellers",
      value: "24 / 32",
      icon: Users,
      color: "text-emerald-400"
    },
    {
      label: "Deals Registered",
      value: "47 this Q",
      icon: ChartNoAxesColumn,
      color: "text-primary"
    },
    {
      label: "Renewal Coverage",
      value: "81%",
      icon: HeartPulse,
      color: "text-emerald-400"
    },
    {
      label: "Ecosystem Score",
      value: "79%",
      icon: Shield,
      color: "text-accent"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6", children: metrics.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        "data-ocid": `linked_workspaces.ecosystem_metric.${i + 1}`,
        className: "bg-card border-border",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { size: 18, className: `mb-2 ${m.color}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground", children: m.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: m.label })
        ] })
      },
      m.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Vendor" })
  ] });
}
function VendorsTab({ orgType }) {
  const ecosystem = getEcosystemForOrgType(orgType);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6", children: ecosystem.vendors.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `linked_workspaces.vendor_card.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrgCard, { org: v }) }, v.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType })
  ] });
}
function VendorRelationshipsTab() {
  const ecosystem = getEcosystemForOrgType("Reseller");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6", children: ecosystem.vendors.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": `linked_workspaces.vendor_rel_card.${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrgCard, { org: v })
      },
      v.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Reseller" })
  ] });
}
function DistributorRelationshipsTab() {
  const ecosystem = getEcosystemForOrgType("Reseller");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6", children: ecosystem.distributors.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": `linked_workspaces.dist_rel_card.${i + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrgCard, { org: d })
      },
      d.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Reseller" })
  ] });
}
function SharedOperationalTab() {
  const summaries = [
    {
      label: "Shared Accounts",
      value: "14",
      icon: Building2,
      delta: "+2 this Q"
    },
    {
      label: "Joint Opportunities",
      value: "8",
      icon: TrendingUp,
      delta: "£1.2M combined"
    },
    {
      label: "Co-Sell Pipeline",
      value: "£2.4M",
      icon: ChartNoAxesColumn,
      delta: "+18% QoQ"
    },
    {
      label: "Shared Contacts",
      value: "31",
      icon: Users,
      delta: "Across 4 orgs"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6", children: summaries.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        "data-ocid": `linked_workspaces.shared_ops_metric.${i + 1}`,
        className: "bg-card border-border",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { size: 18, className: "text-accent mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: s.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-accent mt-1", children: s.delta })
        ] })
      },
      s.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Reseller" })
  ] });
}
function CustomersTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Territory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Contract Value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Renewal Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Active Products" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/50", children: DEMO_CUSTOMERS.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `linked_workspaces.customer_row.${i + 1}`,
          className: "bg-background hover:bg-card/60 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: c.territory }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold tabular-nums", children: c.contractValue ? fmtK(c.contractValue) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: c.renewalDate ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: (c.activeProducts ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20",
                children: p
              },
              p
            )) }) })
          ]
        },
        c.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Vendor" })
  ] });
}
function OpportunitiesTab({ limit = 8 }) {
  const opps = DEMO_OPPORTUNITIES.slice(0, limit);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Stage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Owner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Forecast Date" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/50", children: opps.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `linked_workspaces.opportunity_row.${i + 1}`,
          className: "bg-background hover:bg-card/60 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: o.accountName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-1.5 py-0.5 rounded ${o.stage === "Closed Won" ? "bg-emerald-500/15 text-emerald-400" : o.stage === "Negotiation" ? "bg-accent/15 text-accent" : o.stage === "Proposal" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
                children: o.stage
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold tabular-nums", children: fmtK(o.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: o.ownerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: o.forecastDate })
          ]
        },
        o.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Vendor" })
  ] });
}
function CasesTab({ limit = 15 }) {
  const cases = DEMO_CASES.filter(
    (c) => c.priority === "Critical" || c.priority === "High"
  ).slice(0, limit);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Case ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "SLA (hrs)" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/50", children: cases.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `linked_workspaces.case_row.${i + 1}`,
          className: "bg-background hover:bg-card/60 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-muted-foreground", children: c.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: c.title }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground capitalize", children: c.caseType.replace(/-/g, " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.priority === "Critical" ? "bg-red-500/15 text-red-400" : c.priority === "High" ? "bg-amber-500/15 text-amber-400" : "bg-muted text-muted-foreground"}`,
                children: c.priority
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.status === "Resolved" ? "bg-emerald-500/15 text-emerald-400" : c.status === "Escalated" ? "bg-red-500/15 text-red-400" : c.status === "In Progress" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`,
                children: c.status
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right tabular-nums text-xs", children: [
              c.sla,
              "h"
            ] })
          ]
        },
        c.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Vendor" })
  ] });
}
function AllCasesTab({ limit = 6 }) {
  const cases = DEMO_CASES.slice(0, limit);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Case ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "SLA (hrs)" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/50", children: cases.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `linked_workspaces.case_row.${i + 1}`,
          className: "bg-background hover:bg-card/60 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-muted-foreground", children: c.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: c.title }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground capitalize", children: c.caseType.replace(/-/g, " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.priority === "Critical" ? "bg-red-500/15 text-red-400" : c.priority === "High" ? "bg-amber-500/15 text-amber-400" : "bg-muted text-muted-foreground"}`,
                children: c.priority
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.status === "Resolved" ? "bg-emerald-500/15 text-emerald-400" : c.status === "Escalated" ? "bg-red-500/15 text-red-400" : c.status === "In Progress" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`,
                children: c.status
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right tabular-nums text-xs", children: [
              c.sla,
              "h"
            ] })
          ]
        },
        c.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Reseller" })
  ] });
}
function MdfTab({ limit = 10 }) {
  const requests = DEMO_MDF_REQUESTS.slice(0, limit);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-card border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Campaign" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Organisation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Requested" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Approved" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Quarter" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/50", children: requests.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `linked_workspaces.mdf_row.${i + 1}`,
          className: "bg-background hover:bg-card/60 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-muted-foreground", children: m.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: m.campaignName }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: m.requestingOrgName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold tabular-nums", children: fmtK(m.requestedAmount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold tabular-nums", children: m.approvedAmount > 0 ? fmtK(m.approvedAmount) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-[10px] font-semibold px-1.5 py-0.5 rounded ${m.status === "Approved" ? "bg-emerald-500/15 text-emerald-400" : m.status === "Rejected" ? "bg-red-500/15 text-red-400" : m.status === "Complete" ? "bg-primary/15 text-primary" : m.status === "In Progress" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`,
                children: m.status
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: m.quarter })
          ]
        },
        m.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIPanel, { orgType: "Distributor" })
  ] });
}
const SUB_TABS = {
  Vendor: [
    { id: "distributors", label: "Distributors", icon: Network },
    { id: "resellers", label: "Resellers", icon: Users },
    { id: "customers", label: "Customer Accounts", icon: Building2 },
    { id: "opportunities", label: "Opportunities", icon: ChartNoAxesColumn },
    { id: "cases", label: "Cases", icon: Shield },
    { id: "mdf", label: "MDF Requests", icon: TrendingUp },
    { id: "territory", label: "Territory Performance", icon: Globe },
    { id: "ecosystem", label: "Ecosystem Health", icon: HeartPulse }
  ],
  Distributor: [
    { id: "vendors", label: "Vendors", icon: Building2 },
    { id: "resellers", label: "Resellers", icon: Users },
    { id: "customers", label: "Customer Coverage", icon: Globe },
    { id: "opportunities", label: "Opportunities", icon: ChartNoAxesColumn },
    { id: "mdf", label: "MDF Requests", icon: TrendingUp },
    { id: "regional", label: "Regional Performance", icon: ChevronRight }
  ],
  "Global Distributor": [
    { id: "vendors", label: "Vendors", icon: Building2 },
    { id: "resellers", label: "Resellers", icon: Users },
    { id: "customers", label: "Customer Coverage", icon: Globe },
    { id: "opportunities", label: "Opportunities", icon: ChartNoAxesColumn },
    { id: "mdf", label: "MDF Requests", icon: TrendingUp },
    { id: "regional", label: "Regional Performance", icon: ChevronRight }
  ],
  Reseller: [
    { id: "vendor-rel", label: "Vendor Relationships", icon: Building2 },
    {
      id: "distributor-rel",
      label: "Distributor Relationships",
      icon: Network
    },
    { id: "customers", label: "Customer Accounts", icon: Users },
    { id: "opportunities", label: "Opportunities", icon: ChartNoAxesColumn },
    { id: "cases", label: "Cases", icon: Shield },
    {
      id: "shared-ops",
      label: "Shared Operational Relationships",
      icon: ArrowUpRight
    }
  ],
  "Multi-Group Reseller": [
    { id: "vendor-rel", label: "Vendor Relationships", icon: Building2 },
    {
      id: "distributor-rel",
      label: "Distributor Relationships",
      icon: Network
    },
    { id: "customers", label: "Customer Accounts", icon: Users },
    { id: "opportunities", label: "Opportunities", icon: ChartNoAxesColumn },
    { id: "cases", label: "Cases", icon: Shield },
    {
      id: "shared-ops",
      label: "Shared Operational Relationships",
      icon: ArrowUpRight
    }
  ]
};
function renderSubTabContent(activeTab, orgType) {
  switch (activeTab) {
    case "distributors":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorsTab, {});
    case "resellers":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ResellersTab, { orgType });
    case "customers":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CustomersTab, {});
    case "opportunities":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(OpportunitiesTab, { limit: orgType === "Vendor" ? 8 : 6 });
    case "cases":
      return orgType === "Vendor" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CasesTab, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AllCasesTab, {});
    case "mdf":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        MdfTab,
        {
          limit: orgType === "Distributor" || orgType === "Global Distributor" ? 5 : 10
        }
      );
    case "territory":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TerritoryPerformanceTab, { orgType });
    case "ecosystem":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(EcosystemHealthTab, {});
    case "vendors":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(VendorsTab, { orgType });
    case "regional":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(TerritoryPerformanceTab, { orgType });
    case "vendor-rel":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(VendorRelationshipsTab, {});
    case "distributor-rel":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorRelationshipsTab, {});
    case "shared-ops":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SharedOperationalTab, {});
  }
}
const ORG_META = {
  Vendor: {
    title: "Linked Workspaces",
    subtitle: "Distributor & reseller ecosystem performance and relationship intelligence",
    icon: Network
  },
  Distributor: {
    title: "Linked Workspaces",
    subtitle: "Vendor partnerships and reseller management across your distribution network",
    icon: Network
  },
  "Global Distributor": {
    title: "Linked Workspaces",
    subtitle: "Multi-region vendor partnerships, reseller management and extended coverage analysis",
    icon: Globe
  },
  Reseller: {
    title: "Linked Workspaces",
    subtitle: "Vendor and distributor relationships, co-sell pipeline and shared operational collaboration",
    icon: Network
  },
  "Multi-Group Reseller": {
    title: "Linked Workspaces",
    subtitle: "Group-wide vendor and distributor relationships, co-sell pipeline and multi-group collaboration",
    icon: Globe
  }
};
function LinkedWorkspacesPage() {
  const { companyProfile, testModeOrgType } = useApp();
  useFilterContext();
  const rawOrgType = testModeOrgType ? testModeOrgType : (companyProfile == null ? void 0 : companyProfile.companyType) ?? "Vendor";
  const orgType = rawOrgType === "Vendor" ? "Vendor" : rawOrgType === "Distributor" ? "Distributor" : rawOrgType === "Global Distributor" ? "Global Distributor" : rawOrgType === "Multi-Group Reseller" ? "Multi-Group Reseller" : rawOrgType === "Reseller" ? "Reseller" : "Vendor";
  const subTabs = SUB_TABS[orgType];
  const [activeTab, setActiveTab] = reactExports.useState(subTabs[0].id);
  const meta = ORG_META[orgType];
  const MetaIcon = meta.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 max-w-7xl mx-auto space-y-6",
      "data-ocid": "linked_workspaces.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border px-6 py-4 flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MetaIcon, { size: 18, className: "text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground", children: meta.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: meta.subtitle })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25", children: orgType }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-wrap gap-2",
            role: "tablist",
            "aria-label": "Linked workspace sub-tabs",
            "data-ocid": "linked_workspaces.sub_tabs",
            children: subTabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": active,
                  "data-ocid": `linked_workspaces.tab.${tab.id}`,
                  onClick: () => setActiveTab(tab.id),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? "bg-accent text-white shadow-md" : "bg-card border border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 12 }),
                    tab.label
                  ]
                },
                tab.id
              );
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            role: "tabpanel",
            "data-ocid": `linked_workspaces.tabpanel.${activeTab}`,
            children: renderSubTabContent(activeTab, orgType)
          }
        )
      ]
    }
  );
}
export {
  LinkedWorkspacesPage,
  LinkedWorkspacesPage as default
};
