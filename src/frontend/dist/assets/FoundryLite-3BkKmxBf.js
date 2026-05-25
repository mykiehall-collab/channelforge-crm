import { c as createLucideIcon, u as useApp, a as useNavigate, r as reactExports, j as jsxRuntimeExports, ay as Layers, F as Flame, U as Users, e as TrendingUp, a6 as RefreshCw, J as CircleCheck, Z as Zap, Q as Briefcase, A as ArrowRight, n as Clock, ad as Input, m as Button, a0 as Bell, V as FileText, v as BookOpen, o as Badge, N as MessageSquare } from "./index-DvFvlUBj.js";
import { P as Pin } from "./pin-Bu-NHign.js";
import { C as Calendar } from "./calendar-BzO3LGDM.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  ["path", { d: "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89", key: "znwnzq" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11",
      key: "c9qhm2"
    }
  ]
];
const PinOff = createLucideIcon("pin-off", __iconNode);
const MOCK_TASKS = [
  {
    id: "t1",
    title: "Follow up on renewal risk – Axiom Networks",
    account: "Axiom Networks",
    dueDate: "Today",
    priority: "High",
    done: false
  },
  {
    id: "t2",
    title: "Send pricing proposal – BlueStar IT",
    account: "BlueStar IT",
    dueDate: "Tomorrow",
    priority: "High",
    done: false
  },
  {
    id: "t3",
    title: "Review inactive account – CoreEdge Solutions",
    account: "CoreEdge Solutions",
    dueDate: "May 21",
    priority: "Medium",
    done: false
  },
  {
    id: "t4",
    title: "Update deal registration – Nexus Systems",
    account: "Nexus Systems",
    dueDate: "May 22",
    priority: "Medium",
    done: false
  },
  {
    id: "t5",
    title: "Qualify new lead – Vertex Cloud",
    account: "Vertex Cloud",
    dueDate: "May 23",
    priority: "Low",
    done: false
  },
  {
    id: "t6",
    title: "Book QBR meeting – TowerBridge Tech",
    account: "TowerBridge Tech",
    dueDate: "May 24",
    priority: "Low",
    done: false
  }
];
const MOCK_CALLBACKS = [
  {
    id: "cb1",
    account: "Axiom Networks",
    contact: "Sarah Lawson",
    scheduledTime: "Today 14:00"
  },
  {
    id: "cb2",
    account: "BlueStar IT",
    contact: "James Whitmore",
    scheduledTime: "Tomorrow 10:30"
  },
  {
    id: "cb3",
    account: "Nexus Systems",
    contact: "Rachel Chen",
    scheduledTime: "May 22 09:00"
  }
];
const MOCK_OPPS = [
  {
    id: "op1",
    dealName: "Enterprise Renewal – Axiom",
    account: "Axiom Networks",
    stage: "Negotiation",
    value: 84e3,
    closeDate: "Jun 01",
    daysOpen: 42
  },
  {
    id: "op2",
    dealName: "Cloud Migration Suite",
    account: "CoreEdge Solutions",
    stage: "Proposal",
    value: 56e3,
    closeDate: "Jun 15",
    daysOpen: 28
  },
  {
    id: "op3",
    dealName: "Security Bundle Q2",
    account: "Nexus Systems",
    stage: "Deal Registration",
    value: 32e3,
    closeDate: "Jun 30",
    daysOpen: 14
  },
  {
    id: "op4",
    dealName: "Managed Services Upsell",
    account: "BlueStar IT",
    stage: "Qualification",
    value: 18e3,
    closeDate: "Jul 10",
    daysOpen: 7
  },
  {
    id: "op5",
    dealName: "Endpoint Refresh",
    account: "Vertex Cloud",
    stage: "Prospecting",
    value: 11500,
    closeDate: "Jul 20",
    daysOpen: 3
  },
  {
    id: "op6",
    dealName: "Annual Support Contract",
    account: "TowerBridge Tech",
    stage: "Closed Won",
    value: 24e3,
    closeDate: "May 10",
    daysOpen: 60
  }
];
const MOCK_RENEWALS = [
  {
    id: "r1",
    account: "Axiom Networks",
    product: "Enterprise Suite",
    renewalDate: "Jun 01",
    value: 84e3,
    status: "At Risk",
    daysUntil: 13
  },
  {
    id: "r2",
    account: "CoreEdge Solutions",
    product: "Cloud Platform",
    renewalDate: "Jun 10",
    value: 56e3,
    status: "Due Soon",
    daysUntil: 22
  },
  {
    id: "r3",
    account: "Nexus Systems",
    product: "Security Bundle",
    renewalDate: "Jun 18",
    value: 32e3,
    status: "Due Soon",
    daysUntil: 30
  },
  {
    id: "r4",
    account: "BlueStar IT",
    product: "Managed Services",
    renewalDate: "Jul 05",
    value: 44e3,
    status: "Healthy",
    daysUntil: 47
  },
  {
    id: "r5",
    account: "Vertex Cloud",
    product: "Endpoint Protection",
    renewalDate: "Jul 15",
    value: 18e3,
    status: "Healthy",
    daysUntil: 57
  },
  {
    id: "r6",
    account: "TowerBridge Tech",
    product: "Support & Maintenance",
    renewalDate: "Aug 01",
    value: 24e3,
    status: "Healthy",
    daysUntil: 74
  },
  {
    id: "r7",
    account: "SkyBridge Group",
    product: "Analytics Suite",
    renewalDate: "May 28",
    value: 12e3,
    status: "At Risk",
    daysUntil: 9
  },
  {
    id: "r8",
    account: "Meridian Partners",
    product: "Collaboration Tools",
    renewalDate: "Jun 05",
    value: 9500,
    status: "Due Soon",
    daysUntil: 17
  }
];
const MOCK_INSIGHTS = [
  {
    id: "i1",
    type: "Renewal Risk",
    title: "Axiom Networks renewal at risk",
    body: "No engagement recorded in 34 days. Renewal due in 13 days.",
    urgency: "high"
  },
  {
    id: "i2",
    type: "Renewal Risk",
    title: "SkyBridge Group expiring soon",
    body: "Contract expires in 9 days. Last contact: 41 days ago.",
    urgency: "high"
  },
  {
    id: "i3",
    type: "Pipeline",
    title: "Cloud Migration Suite stalled",
    body: "Opportunity has not progressed in 14 days. Proposal sent May 5.",
    urgency: "medium"
  },
  {
    id: "i4",
    type: "Engagement",
    title: "CoreEdge engagement gap detected",
    body: "Customer engagement dropped 42% compared to last quarter.",
    urgency: "medium"
  },
  {
    id: "i5",
    type: "Forecast",
    title: "Q2 pipeline below target",
    body: "Current pipeline covers 74% of Q2 target. Consider accelerating 2 opportunities.",
    urgency: "medium"
  },
  {
    id: "i6",
    type: "Engagement",
    title: "TowerBridge Tech – no recent activity",
    body: "No meetings, calls, or messages logged in 28 days.",
    urgency: "low"
  },
  {
    id: "i7",
    type: "Pipeline",
    title: "3 opportunities approaching close date",
    body: "Axiom, CoreEdge, and Nexus all closing within 30 days.",
    urgency: "medium"
  },
  {
    id: "i8",
    type: "Renewal Risk",
    title: "Meridian Partners renewal in 17 days",
    body: "Medium risk. Last contact 19 days ago. Recommend outreach today.",
    urgency: "medium"
  },
  {
    id: "i9",
    type: "Forecast",
    title: "Renewal revenue tracking ahead",
    body: "Renewal pipeline is 112% of forecast for the quarter — good momentum.",
    urgency: "low"
  },
  {
    id: "i10",
    type: "Engagement",
    title: "BlueStar IT scoring highly",
    body: "Customer health score: 88/100. Strong engagement across last 60 days.",
    urgency: "low"
  }
];
const MOCK_ACCOUNTS = [
  {
    id: "a1",
    name: "Axiom Networks",
    customerId: "VND-0001",
    status: "At Risk",
    health: "low",
    owner: "You",
    lastActivity: "2 days ago",
    renewalDate: "Jun 01"
  },
  {
    id: "a2",
    name: "CoreEdge Solutions",
    customerId: "VND-0002",
    status: "Active",
    health: "medium",
    owner: "You",
    lastActivity: "5 days ago",
    renewalDate: "Jun 10"
  },
  {
    id: "a3",
    name: "Nexus Systems",
    customerId: "VND-0003",
    status: "Active",
    health: "high",
    owner: "You",
    lastActivity: "1 day ago",
    renewalDate: "Jun 18"
  },
  {
    id: "a4",
    name: "BlueStar IT",
    customerId: "VND-0004",
    status: "Active",
    health: "high",
    owner: "You",
    lastActivity: "Today",
    renewalDate: "Jul 05"
  },
  {
    id: "a5",
    name: "Vertex Cloud",
    customerId: "VND-0005",
    status: "Inactive",
    health: "low",
    owner: "You",
    lastActivity: "18 days ago",
    renewalDate: "Jul 15"
  },
  {
    id: "a6",
    name: "TowerBridge Tech",
    customerId: "VND-0006",
    status: "Active",
    health: "medium",
    owner: "You",
    lastActivity: "8 days ago",
    renewalDate: "Aug 01"
  },
  {
    id: "a7",
    name: "SkyBridge Group",
    customerId: "VND-0007",
    status: "At Risk",
    health: "low",
    owner: "You",
    lastActivity: "12 days ago",
    renewalDate: "May 28"
  },
  {
    id: "a8",
    name: "Meridian Partners",
    customerId: "VND-0008",
    status: "Active",
    health: "medium",
    owner: "You",
    lastActivity: "3 days ago",
    renewalDate: "Jun 05"
  }
];
const MOCK_MESSAGES = [
  {
    id: "m1",
    from: "Sarah Lawson",
    preview: "Following up on the renewal proposal we discussed...",
    time: "10:24",
    unread: 2
  },
  {
    id: "m2",
    from: "James Whitmore",
    preview: "The pricing deck looks good. Can we schedule a call?",
    time: "Yesterday",
    unread: 0
  },
  {
    id: "m3",
    from: "Rachel Chen",
    preview: "Deal registration approved — moving to negotiation stage.",
    time: "Yesterday",
    unread: 1
  },
  {
    id: "m4",
    from: "ForgeAI Alert",
    preview: "Axiom Networks renewal risk increased. Immediate action recommended.",
    time: "2 days ago",
    unread: 0
  },
  {
    id: "m5",
    from: "Admin – Vendor Team",
    preview: "New pricing promotion available Q2. See promotions section.",
    time: "3 days ago",
    unread: 0
  }
];
const ROLE_REPORTS = {
  default: [
    {
      name: "My Accounts Summary",
      description: "Overview of all assigned accounts with health and renewal status."
    },
    {
      name: "Open Opportunities",
      description: "All active opportunities with stage and value breakdown."
    },
    {
      name: "Renewals Due This Quarter",
      description: "Renewals expiring within 90 days, sorted by risk."
    },
    {
      name: "Pipeline Forecast",
      description: "Weighted pipeline vs. Q2 revenue target."
    },
    {
      name: "Account Engagement Gaps",
      description: "Accounts with no logged activity in the past 30 days."
    },
    {
      name: "Deal Registration Status",
      description: "Pending, approved, and rejected deal registrations."
    }
  ]
};
const OPP_STAGES = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Deal Registration",
  "Negotiation",
  "Closed Won",
  "Closed Lost"
];
function StatTile({
  label,
  value,
  icon: Icon,
  accent = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `cf-card rounded-lg p-4 flex flex-col gap-1.5 ${accent ? "border-orange-500/40" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-4 h-4 ${accent ? "text-orange-400" : ""}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `text-2xl font-bold font-display ${accent ? "text-orange-400" : "text-foreground"}`,
            children: value
          }
        )
      ]
    }
  );
}
function PriorityCard({
  title,
  detail,
  urgency
}) {
  const colors = {
    high: "border-l-orange-500/70 bg-orange-500/5",
    medium: "border-l-orange-500/60 bg-orange-500/5",
    low: "border-l-blue-500/40 bg-blue-500/5"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `border border-border border-l-4 rounded-lg p-3 ${colors[urgency]}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-snug", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: detail })
      ]
    }
  );
}
function InsightCard({ insight }) {
  const typeColors = {
    "Renewal Risk": "text-orange-400 bg-orange-500/10",
    Pipeline: "text-blue-400 bg-blue-500/10",
    Engagement: "text-orange-400 bg-orange-500/10",
    Forecast: "text-emerald-400 bg-emerald-500/10"
  };
  const urgencyDot = {
    high: "bg-orange-500",
    medium: "bg-orange-400",
    low: "bg-emerald-500"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-lg p-4 border border-border hover:border-orange-500/30 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[insight.type]}`,
          children: insight.type
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `w-2 h-2 rounded-full mt-1 flex-shrink-0 ${urgencyDot[insight.urgency]}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: insight.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: insight.body })
  ] });
}
function StatusBadge({ status }) {
  const map = {
    "At Risk": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Inactive: "bg-muted text-muted-foreground border-border",
    "Due Soon": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Healthy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Negotiation: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    Proposal: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "Deal Registration": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Qualification: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    Prospecting: "bg-muted text-muted-foreground border-border",
    "Closed Won": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    "Closed Lost": "bg-muted/40 text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `text-xs border rounded-full px-2 py-0.5 font-medium ${map[status] ?? "bg-muted text-muted-foreground border-border"}`,
      children: status
    }
  );
}
function HealthDot({ health }) {
  const map = {
    high: "bg-emerald-500",
    medium: "bg-orange-400",
    low: "bg-red-500"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-block w-2 h-2 rounded-full ${map[health] ?? "bg-muted"}`
    }
  );
}
function PriorityBadge({ priority }) {
  const map = {
    High: "bg-orange-500/15 text-orange-400",
    Medium: "bg-orange-500/15 text-orange-400",
    Low: "bg-muted text-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `text-xs px-2 py-0.5 rounded-full font-medium ${map[priority] ?? "bg-muted text-muted-foreground"}`,
      children: priority
    }
  );
}
function WorkspaceTab({ role }) {
  const navigate = useNavigate();
  role.toLowerCase();
  const priorities = [
    {
      title: "Axiom Networks renewal at critical risk",
      detail: "Due in 13 days — no contact in 34 days",
      urgency: "high"
    },
    {
      title: "SkyBridge Group contract expiring in 9 days",
      detail: "Immediate outreach required",
      urgency: "high"
    },
    {
      title: "3 opportunities stalled in pipeline",
      detail: "CoreEdge, Nexus, BlueStar — no progression in 14+ days",
      urgency: "medium"
    },
    {
      title: "Q2 pipeline at 74% of target",
      detail: "Consider accelerating 2 opportunities",
      urgency: "medium"
    },
    {
      title: "Vertex Cloud inactive for 18 days",
      detail: "Review account engagement",
      urgency: "low"
    }
  ];
  const recentAccounts = MOCK_ACCOUNTS.slice(0, 5);
  const [watchlist, setWatchlist] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cf_watchlist") ?? "[]");
    } catch {
      return [];
    }
  });
  const togglePin = (id) => {
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("cf_watchlist", JSON.stringify(next));
      return next;
    });
  };
  const tasks = MOCK_TASKS.slice(0, 5);
  const activity = [
    { label: "Axiom Networks – renewal risk updated", time: "10 min ago" },
    { label: "CoreEdge Solutions – proposal sent", time: "2 hrs ago" },
    { label: "Nexus Systems – deal registration approved", time: "Yesterday" },
    { label: "BlueStar IT – call logged", time: "Yesterday" },
    { label: "SkyBridge Group – contract alert raised", time: "2 days ago" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "My Accounts", value: 47, icon: Users }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Open Opportunities", value: 12, icon: TrendingUp }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Renewals Due", value: 8, icon: RefreshCw, accent: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Tasks Today", value: 5, icon: CircleCheck })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-orange-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Today's Priorities" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: priorities.map((p, _i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityCard, { ...p }, p.title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-4 h-4 text-orange-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Recent Accounts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/accounts" }),
              className: "text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1",
              children: [
                "View All ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col divide-y divide-border", children: recentAccounts.map((acc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between py-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HealthDot, { health: acc.health }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: acc.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: acc.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: acc.lastActivity }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => togglePin(acc.id),
                    className: "text-muted-foreground hover:text-orange-400 transition-colors",
                    "aria-label": watchlist.includes(acc.id) ? "Unpin" : "Pin",
                    children: watchlist.includes(acc.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(PinOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ]
          },
          acc.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-80 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4 border border-orange-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4 text-orange-400 intelligence-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-orange-400", children: "ForgeAI Insights" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2.5", children: MOCK_INSIGHTS.slice(0, 3).map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground leading-snug", children: insight.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5 leading-relaxed", children: insight.body })
        ] }, insight.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "mt-3 text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors",
            children: [
              "View All Insights ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-orange-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Upcoming Tasks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: tasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${task.priority === "High" ? "bg-orange-500" : task.priority === "Medium" ? "bg-orange-400" : "bg-muted-foreground"}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: task.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: task.dueDate })
          ] })
        ] }, task.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-orange-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Recent Activity" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: activity.map((item, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-orange-400/60 mt-2 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-snug", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.time })
          ] })
        ] }, item.label)) })
      ] })
    ] })
  ] });
}
function AccountsTab() {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [watchlist, setWatchlist] = reactExports.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cf_watchlist") ?? "[]");
    } catch {
      return [];
    }
  });
  const togglePin = (id) => {
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("cf_watchlist", JSON.stringify(next));
      return next;
    });
  };
  const filtered = MOCK_ACCOUNTS.filter(
    (a) => (statusFilter === "All" || a.status === statusFilter) && a.name.toLowerCase().includes(search.toLowerCase())
  );
  const pinned = MOCK_ACCOUNTS.filter((a) => watchlist.includes(a.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search accounts…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "max-w-xs bg-white/5 border-border",
          "data-ocid": "foundry-lite.account_search"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["All", "Active", "At Risk", "Inactive"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setStatusFilter(s),
          className: `px-3 py-1.5 text-xs rounded-md transition-colors ${statusFilter === s ? "bg-orange-500/15 text-orange-400" : "text-muted-foreground hover:bg-white/5"}`,
          "data-ocid": `foundry-lite.status_filter.${s.toLowerCase().replace(" ", "-")}`,
          children: s
        },
        s
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cf-card rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-white/[0.04]", children: [
        "Account Name",
        "Customer ID",
        "Status",
        "Health",
        "Owner",
        "Last Activity",
        "Renewal Date",
        ""
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left text-xs text-muted-foreground font-medium px-4 py-3",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((acc, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-white/[0.03] cursor-pointer transition-colors",
          onClick: () => navigate({ to: "/accounts" }),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ")
              navigate({ to: "/accounts" });
          },
          tabIndex: 0,
          "data-ocid": `foundry-lite.account.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: acc.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono text-xs", children: acc.customerId }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: acc.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthDot, { health: acc.health }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: acc.owner }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: acc.lastActivity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: acc.renewalDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  togglePin(acc.id);
                },
                className: "text-muted-foreground hover:text-orange-400 transition-colors",
                "aria-label": watchlist.includes(acc.id) ? "Unpin" : "Pin",
                children: watchlist.includes(acc.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(PinOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-4 h-4" })
              }
            ) })
          ]
        },
        acc.id
      )) })
    ] }) }) }),
    pinned.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "w-4 h-4 text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Watchlist" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: pinned.map((acc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HealthDot, { health: acc.health }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: acc.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: acc.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => togglePin(acc.id),
                className: "text-muted-foreground hover:text-red-400 transition-colors",
                "aria-label": "Remove from watchlist",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(PinOff, { className: "w-3 h-3" })
              }
            )
          ]
        },
        acc.id
      )) })
    ] })
  ] });
}
function PipelineTab() {
  const [opps, setOpps] = reactExports.useState(MOCK_OPPS);
  const updateStage = (id, stage) => {
    setOpps((prev) => prev.map((o) => o.id === id ? { ...o, stage } : o));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "My Opportunities" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "border-orange-500/40 text-orange-400 hover:bg-orange-500/10",
          "data-ocid": "foundry-lite.new_opportunity_button",
          children: "+ New Opportunity"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cf-card rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-white/[0.04]", children: [
        "Deal Name",
        "Account",
        "Stage",
        "Value",
        "Close Date",
        "Days Open",
        ""
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left text-xs text-muted-foreground font-medium px-4 py-3",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: opps.map((opp, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-white/[0.03] transition-colors",
          "data-ocid": `foundry-lite.opportunity.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: opp.dealName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: opp.account }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: opp.stage }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-right", children: [
              "£",
              opp.value.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: opp.closeDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
              opp.daysOpen,
              "d"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "text-xs bg-white/5 border border-border rounded px-2 py-1 text-foreground",
                value: opp.stage,
                onChange: (e) => updateStage(opp.id, e.target.value),
                onKeyDown: (e) => e.stopPropagation(),
                "aria-label": "Move stage",
                children: OPP_STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
              }
            ) })
          ]
        },
        opp.id
      )) })
    ] }) }) })
  ] });
}
function RenewalsTab() {
  const renewals = [...MOCK_RENEWALS].sort((a, b) => a.daysUntil - b.daysUntil);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "My Assigned Renewals" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cf-card rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-white/[0.04]", children: [
        "Account",
        "Product",
        "Renewal Date",
        "Value",
        "Status",
        "Days Until"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left text-xs text-muted-foreground font-medium px-4 py-3",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: renewals.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-white/[0.03] transition-colors",
          "data-ocid": `foundry-lite.renewal.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: r.account }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.product }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.renewalDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-right", children: [
              "£",
              r.value.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: `px-4 py-3 font-semibold ${r.daysUntil <= 14 ? "text-red-400" : r.daysUntil <= 30 ? "text-orange-400" : "text-muted-foreground"}`,
                children: [
                  r.daysUntil,
                  "d"
                ]
              }
            )
          ]
        },
        r.id
      )) })
    ] }) }) })
  ] });
}
function TasksTab() {
  const [tasks, setTasks] = reactExports.useState(MOCK_TASKS);
  const [showNewTask, setShowNewTask] = reactExports.useState(false);
  const [newTask, setNewTask] = reactExports.useState({
    title: "",
    account: "",
    dueDate: "",
    priority: "Medium"
  });
  const toggleDone = (id) => setTasks(
    (prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t)
  );
  const addTask = () => {
    if (!newTask.title) return;
    setTasks((prev) => [
      ...prev,
      { id: `t${Date.now()}`, ...newTask, done: false }
    ]);
    setNewTask({ title: "", account: "", dueDate: "", priority: "Medium" });
    setShowNewTask(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-orange-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Tasks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "border-orange-500/40 text-orange-400 hover:bg-orange-500/10",
            onClick: () => setShowNewTask((v) => !v),
            "data-ocid": "foundry-lite.new_task_button",
            children: "+ New Task"
          }
        )
      ] }),
      showNewTask && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 p-3 bg-white/[0.04] rounded-lg border border-border flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Task title",
            value: newTask.title,
            onChange: (e) => setNewTask((p) => ({ ...p, title: e.target.value })),
            className: "bg-white/5 border-border",
            "data-ocid": "foundry-lite.new_task.title_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Account",
              value: newTask.account,
              onChange: (e) => setNewTask((p) => ({ ...p, account: e.target.value })),
              className: "bg-white/5 border-border flex-1",
              "data-ocid": "foundry-lite.new_task.account_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: newTask.dueDate,
              onChange: (e) => setNewTask((p) => ({ ...p, dueDate: e.target.value })),
              className: "bg-white/5 border-border w-36",
              "data-ocid": "foundry-lite.new_task.date_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "text-xs bg-white/5 border border-border rounded px-2 text-foreground",
              value: newTask.priority,
              onChange: (e) => setNewTask((p) => ({
                ...p,
                priority: e.target.value
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "High" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Medium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Low" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "bg-orange-600 hover:bg-orange-500 text-white",
              onClick: addTask,
              "data-ocid": "foundry-lite.new_task.submit_button",
              children: "Add Task"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => setShowNewTask(false),
              "data-ocid": "foundry-lite.new_task.cancel_button",
              children: "Cancel"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: tasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-3 p-2.5 rounded-lg ${task.done ? "opacity-50" : ""}`,
          "data-ocid": `foundry-lite.task.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleDone(task.id),
                className: "flex-shrink-0",
                "aria-label": task.done ? "Mark undone" : "Mark done",
                "data-ocid": `foundry-lite.task.checkbox.${i + 1}`,
                children: task.done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border border-border block" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-medium ${task.done ? "line-through" : ""} truncate`,
                  children: task.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                task.account,
                " · ",
                task.dueDate
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityBadge, { priority: task.priority })
          ]
        },
        task.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4 text-orange-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Scheduled Callbacks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "border-orange-500/40 text-orange-400 hover:bg-orange-500/10",
            "data-ocid": "foundry-lite.new_callback_button",
            children: "+ New Callback"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: MOCK_CALLBACKS.map((cb, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-border/50",
          "data-ocid": `foundry-lite.callback.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-orange-400 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: cb.account }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: cb.contact })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: cb.scheduledTime })
          ]
        },
        cb.id
      )) })
    ] })
  ] });
}
function ReportsTab({
  navigate
}) {
  const reports = ROLE_REPORTS.default;
  const [activeReport, setActiveReport] = reactExports.useState(null);
  const mockResult = [
    ["Axiom Networks", "At Risk", "Jun 01", "£84,000"],
    ["CoreEdge Solutions", "Active", "Jun 10", "£56,000"],
    ["Nexus Systems", "Active", "Jun 18", "£32,000"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: reports.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "cf-card rounded-xl p-4 flex flex-col gap-3",
        "data-ocid": `foundry-lite.report.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: r.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: r.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "border-orange-500/40 text-orange-400 hover:bg-orange-500/10 w-full mt-auto",
              onClick: () => setActiveReport(activeReport === r.name ? null : r.name),
              "data-ocid": `foundry-lite.report.run_button.${i + 1}`,
              children: activeReport === r.name ? "Hide Results" : "Run Report"
            }
          )
        ]
      },
      r.name
    )) }),
    activeReport && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cf-card rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-3", children: [
        activeReport,
        " — Results"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs text-muted-foreground font-medium px-3 py-2", children: "Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs text-muted-foreground font-medium px-3 py-2", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs text-muted-foreground font-medium px-3 py-2", children: "Renewal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs text-muted-foreground font-medium px-3 py-2", children: "Value" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: mockResult.map((row, ri) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "tr",
            {
              className: "border-b border-border/50",
              children: row.map((cell, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  className: "px-3 py-2 text-sm",
                  children: cell
                },
                `${row[0] ?? ri}-col-${ci}`
              ))
            },
            ((_a = mockResult[ri]) == null ? void 0 : _a[0]) ?? `row-${ri}`
          );
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => navigate({ to: "/reports" }),
        className: "text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1.5 mx-auto transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
          " Need more? Open Full Reports",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
        ]
      }
    ) })
  ] });
}
function ForgeAITab() {
  const [filter, setFilter] = reactExports.useState("All");
  const [lastUpdated, setLastUpdated] = reactExports.useState(0);
  const filters = ["All", "Renewal Risk", "Pipeline", "Engagement", "Forecast"];
  reactExports.useEffect(() => {
    const tick = () => setLastUpdated(Date.now());
    tick();
    const id = setInterval(tick, 3e4);
    return () => clearInterval(id);
  }, []);
  const minsAgo = lastUpdated ? Math.floor((Date.now() - lastUpdated) / 6e4) : 0;
  const filtered = filter === "All" ? MOCK_INSIGHTS : MOCK_INSIGHTS.filter((i) => i.type === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: filters.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setFilter(f),
          className: `px-3 py-1.5 text-xs rounded-md transition-colors ${filter === f ? "bg-orange-500/15 text-orange-400" : "text-muted-foreground hover:bg-white/5"}`,
          "data-ocid": `foundry-lite.forgeai_filter.${f.toLowerCase().replace(" ", "-")}`,
          children: f
        },
        f
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3 text-orange-400 intelligence-pulse" }),
        "Updated",
        " ",
        minsAgo === 0 ? "just now" : `${minsAgo} min${minsAgo > 1 ? "s" : ""} ago`
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: filtered.map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsx(InsightCard, { insight }, insight.id)) })
  ] });
}
function MessagesTab({
  navigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cf-card rounded-xl overflow-hidden", children: MOCK_MESSAGES.map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-white/[0.03] transition-colors",
        "data-ocid": `foundry-lite.message.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-orange-400", children: msg.from[0] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: msg.from }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: msg.time })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: msg.preview })
          ] }),
          msg.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-orange-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full", children: msg.unread })
        ]
      },
      msg.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "border-orange-500/40 text-orange-400 hover:bg-orange-500/10",
        onClick: () => navigate({ to: "/messages" }),
        "data-ocid": "foundry-lite.open_messaging_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4 mr-2" }),
          " Open Messaging"
        ]
      }
    ) })
  ] });
}
const TABS = [
  { id: "workspace", label: "My Workspace" },
  { id: "accounts", label: "Accounts" },
  { id: "pipeline", label: "Pipeline" },
  { id: "renewals", label: "Renewals" },
  { id: "tasks", label: "Tasks & Callbacks" },
  { id: "reports", label: "Reports" },
  { id: "forgeai", label: "ForgeAI" },
  { id: "messages", label: "Messages" }
];
function FoundryLite() {
  const { userProfile } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState(() => {
    try {
      return localStorage.getItem("cf_fl_tab") ?? "workspace";
    } catch {
      return "workspace";
    }
  });
  const role = (userProfile == null ? void 0 : userProfile.role) ?? "End User";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "foundry-lite.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border flex items-center justify-between bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-5 h-5 text-orange-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold font-display", children: "Foundry Lite" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-orange-500/15 text-orange-400 rounded px-2 py-0.5 font-medium", children: role })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4 text-orange-400 intelligence-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "ForgeAI Active" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 px-6 py-2 border-b border-border overflow-x-auto bg-card/50", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          setActiveTab(tab.id);
          try {
            localStorage.setItem("cf_fl_tab", tab.id);
          } catch {
          }
        },
        className: `px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-orange-500/15 text-orange-400 font-medium" : "text-muted-foreground hover:bg-white/5"}`,
        "data-ocid": `foundry-lite.${tab.id}_tab`,
        children: tab.label
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [
      activeTab === "workspace" && /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceTab, { role }),
      activeTab === "accounts" && /* @__PURE__ */ jsxRuntimeExports.jsx(AccountsTab, {}),
      activeTab === "pipeline" && /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineTab, {}),
      activeTab === "renewals" && /* @__PURE__ */ jsxRuntimeExports.jsx(RenewalsTab, {}),
      activeTab === "tasks" && /* @__PURE__ */ jsxRuntimeExports.jsx(TasksTab, {}),
      activeTab === "reports" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReportsTab, { navigate }),
      activeTab === "forgeai" && /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAITab, {}),
      activeTab === "messages" && /* @__PURE__ */ jsxRuntimeExports.jsx(MessagesTab, { navigate })
    ] })
  ] });
}
export {
  FoundryLite as default
};
