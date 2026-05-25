import { u as useApp, r as reactExports, j as jsxRuntimeExports, d as Brain, a6 as RefreshCw, S as Search, H as Shield, L as Lock, be as CircleCheckBig, ac as ChevronUp, k as ChevronDown, n as Clock, X, am as Sparkles, T as TriangleAlert, f as TrendingDown, e as TrendingUp, Z as Zap, i as ChevronRight } from "./index-DvFvlUBj.js";
import { u as useForgeAI } from "./useForgeAI-CFLYJlF1.js";
import { u as useKPIGovernance } from "./useKPIGovernance-DlQd85gm.js";
import { F as Funnel } from "./funnel-ouUqz1CV.js";
import { L as LockOpen } from "./lock-open-DZv958mu.js";
import "./backend.d-Bio-_uWv.js";
const BASE_INSIGHTS = [
  {
    id: "ins-1",
    priority: "HIGH",
    category: "Renewals",
    title: "Desperado — Renewal Risk: 87% Churn Probability",
    description: "Desperado's contract expires in 18 days and engagement has dropped 62% over the past 45 days. No renewal discussion on record. Last logged contact was 34 days ago. Immediate outreach recommended to prevent lapse.",
    accountName: "Desperado",
    accountId: "CUST-001",
    actions: ["Schedule Renewal Call", "Send Renewal Pack", "Dismiss"],
    status: "new"
  },
  {
    id: "ins-2",
    priority: "HIGH",
    category: "Renewals",
    title: "Nordic Energy Group — Contract Expires in 11 Days",
    description: "Nordic Energy Group' annual subscription (£48,000) expires on the 30th. The assigned reseller Horizon Manufacturing has not logged any renewal activity. ForgeAI detects no pricing discussion or contract extension on record.",
    accountName: "Nordic Energy Group",
    accountId: "CUST-002",
    actions: ["Alert Reseller", "Escalate to Account Manager", "Snooze"],
    status: "new"
  },
  {
    id: "ins-3",
    priority: "MEDIUM",
    category: "Renewals",
    title: "UK Education Trust — Auto-Renewal Flag Not Set",
    description: "UK Education Trust' renewal date is in 42 days. The auto-renewal flag is disabled and no manual process has been initiated. Historical data shows this account has renewed late in 2 of 3 previous cycles.",
    accountName: "UK Education Trust",
    accountId: "CUST-003",
    actions: ["Review Renewal Settings", "Contact Account Owner"],
    status: "new"
  },
  {
    id: "ins-4",
    priority: "LOW",
    category: "Renewals",
    title: "Nexwave Corp — Renewal Confirmed, Documentation Pending",
    description: "Nexwave Corp confirmed verbal renewal commitment 5 days ago. Contract amendment has not been uploaded. ForgeAI recommends completing documentation before the renewal date in 67 days to ensure billing continuity.",
    accountName: "Nexwave Corp",
    accountId: "ACC-0203",
    actions: ["Upload Contract", "Mark Complete"],
    status: "acted",
    actedDaysAgo: 2
  },
  {
    id: "ins-5",
    priority: "HIGH",
    category: "Pipeline",
    title: "Q3 Pipeline Gap: £340,000 Below Forecast",
    description: "Current committed pipeline for Q3 stands at £1.26M against a forecast target of £1.6M. Three opportunities totalling £340K have been stalled for over 21 days with no progression activity. Deals with City Infrastructure Authority, Apex Financial Services, and EuroRetail Group require immediate attention.",
    actions: ["Review Stalled Deals", "Update Forecast"],
    status: "new"
  },
  {
    id: "ins-6",
    priority: "MEDIUM",
    category: "Pipeline",
    title: "City Infrastructure Authority Opportunity — Stalled at Proposal Stage for 28 Days",
    description: "The £85,000 opportunity with City Infrastructure Authority has been sitting at the Proposal stage since the 2nd. No follow-up recorded. Deal age is 61 days. Win rate at this stage historically drops significantly after 30 days without response.",
    accountName: "City Infrastructure Authority",
    accountId: "CUST-005",
    actions: ["Log Follow-up", "Update Deal Stage", "Dismiss"],
    status: "new"
  },
  {
    id: "ins-7",
    priority: "MEDIUM",
    category: "Pipeline",
    title: "3 Deal Registrations Pending Approval — Approaching SLA",
    description: "DR-2024-0089, DR-2024-0092, and DR-2024-0095 have been awaiting vendor approval for 12, 10, and 9 days respectively. Standard SLA is 14 days. Reseller escalation risk is elevated if approvals are not processed this week.",
    actions: ["Review Pending DRs", "Notify Deal Desk"],
    status: "new"
  },
  {
    id: "ins-8",
    priority: "HIGH",
    category: "Engagement",
    title: "Global Pharma Holdings — No Activity in 47 Days",
    description: "Global Pharma Holdings (£62,000 ARR) has had zero logged engagement for 47 days. No calls, emails, or meetings on record. Account health score has dropped from 78 to 41. Renewal is due in 5 months. ForgeAI classifies this as a high-risk account requiring immediate re-engagement.",
    accountName: "Global Pharma Holdings",
    accountId: "CUST-004",
    actions: ["Log Outreach", "Assign Account Task", "Snooze"],
    status: "new"
  },
  {
    id: "ins-9",
    priority: "MEDIUM",
    category: "Engagement",
    title: "Horizon Manufacturing Reseller — Engagement Below Threshold",
    description: "Horizon Manufacturing reseller account has logged only 2 interactions in the past 30 days against a target of 8+. MDF activity is zero this quarter. Partner tier is Gold. ForgeAI recommends scheduling a QBR within 14 days.",
    accountName: "Horizon Manufacturing",
    accountId: "CUST-006",
    actions: ["Schedule QBR", "Review MDF Utilisation"],
    status: "new"
  },
  {
    id: "ins-10",
    priority: "LOW",
    category: "Engagement",
    title: "Apex Financial Services — Engagement Recovered After 32-Day Gap",
    description: "Apex Financial Services re-engaged last week following a 32-day inactivity gap. Two calls were logged and an opportunity has been reopened. ForgeAI recommends maintaining weekly touchpoints to sustain momentum ahead of the Q4 close.",
    accountName: "Apex Financial Services",
    accountId: "CUST-007",
    actions: ["Schedule Next Touchpoint", "Mark Resolved"],
    status: "acted",
    actedDaysAgo: 3
  },
  {
    id: "ins-11",
    priority: "HIGH",
    category: "Forecast",
    title: "Q3 Forecast Warning: Weighted Commit at 78% of Target",
    description: "Based on current pipeline velocity and stage probabilities, Q3 weighted forecast is £1.24M against a £1.6M target — a 22% shortfall. Two high-confidence deals are showing risk signals. Early action on the £340K gap is required to achieve target by the close of quarter.",
    actions: ["View Forecast Dashboard", "Review At-Risk Deals"],
    status: "new"
  },
  {
    id: "ins-12",
    priority: "MEDIUM",
    category: "Forecast",
    title: "3 Opportunities Moved to Closed Lost — Review Patterns",
    description: "Three deals totalling £127,000 were marked Closed Lost this week. Win/loss data shows consistent loss at the Pricing Review stage. ForgeAI recommends a deal desk review to identify pricing strategy gaps and reseller alignment issues.",
    actions: ["Review Win/Loss Data", "Brief Deal Desk"],
    status: "new"
  },
  {
    id: "ins-13",
    priority: "HIGH",
    category: "Account Health",
    title: "EuroRetail Group — Health Score Dropped 31 Points",
    description: "EuroRetail Group' health score has dropped from 74 to 43 over the past 21 days. Drivers include: no renewal discussion, a support ticket backlog of 6 open issues, and a missed QBR. Account is classified as At Risk. Immediate escalation recommended.",
    accountName: "EuroRetail Group",
    accountId: "CUST-008",
    actions: ["Escalate Account", "Book Emergency QBR", "Dismiss"],
    status: "new"
  },
  {
    id: "ins-14",
    priority: "MEDIUM",
    category: "Account Health",
    title: "Northern Telecom Networks — Support Ticket Backlog Affecting Health Score",
    description: "Northern Telecom Networks has 5 open support tickets older than 14 days. No resolution timeline has been communicated. Customer satisfaction data from the last survey was 3.1/5. Health score is currently 52 and declining.",
    accountName: "Northern Telecom Networks",
    accountId: "CUST-009",
    actions: ["Review Support Backlog", "Send Customer Update"],
    status: "new"
  },
  {
    id: "ins-15",
    priority: "LOW",
    category: "Account Health",
    title: "Desperado — Health Score Improvement Detected",
    description: "Desperado's health score improved from 55 to 71 over the past 14 days following active engagement by the account team. Renewal probability has increased. ForgeAI recommends continuing current engagement cadence to consolidate the improvement ahead of renewal.",
    accountName: "Desperado",
    accountId: "CUST-001",
    actions: ["Log Positive Update", "Maintain Cadence"],
    status: "acted",
    actedDaysAgo: 1
  }
];
const PRICING_QUOTING_INSIGHTS = [
  {
    id: "pq1",
    priority: "HIGH",
    category: "Pricing & Quoting",
    title: "Quote Below Margin Threshold",
    description: "Nordic Energy Group quote is 18% below expected margin threshold. Recommend reviewing discount structure before submission.",
    accountName: "Nordic Energy Group",
    accountId: "CUST-002",
    actions: ["Review Quote", "Dismiss"],
    status: "new"
  },
  {
    id: "pq2",
    priority: "HIGH",
    category: "Pricing & Quoting",
    title: "Stalled Quotes Alert",
    description: "3 quotes in the pipeline have been inactive for 14+ days. Immediate follow-up recommended to prevent deal stagnation.",
    accountName: "Multiple Accounts",
    actions: ["View Stalled Quotes", "Dismiss"],
    status: "new"
  },
  {
    id: "pq3",
    priority: "MEDIUM",
    category: "Pricing & Quoting",
    title: "Renewal Incentive Opportunity",
    description: "Global Pharma Holdings may qualify for renewal incentive pricing — renewal due in 45 days and volume qualifies for 8% discount.",
    accountName: "Global Pharma Holdings",
    accountId: "CUST-004",
    actions: ["Apply Incentive", "Snooze"],
    status: "new"
  },
  {
    id: "pq4",
    priority: "MEDIUM",
    category: "Pricing & Quoting",
    title: "Quote Expiry Warning",
    description: "Desperado quote Q-2025-0012 is approaching expiry in 7 days. Extend or resubmit before opportunity is lost.",
    accountName: "Desperado",
    accountId: "CUST-001",
    actions: ["Extend Quote", "Dismiss"],
    status: "new"
  },
  {
    id: "pq5",
    priority: "MEDIUM",
    category: "Pricing & Quoting",
    title: "3-Year Term Conversion Insight",
    description: "Similar enterprise accounts in EMEA converted 2.3x better when offered 3-year contract terms at 12% discount vs 1-year at list price.",
    accountName: "EMEA Segment",
    actions: ["Apply to Active Quotes", "Dismiss"],
    status: "new"
  },
  {
    id: "pq6",
    priority: "LOW",
    category: "Pricing & Quoting",
    title: "Promo Pricing Available",
    description: "Cloud Infrastructure SKU CF-CI-001 has a promotional price available until end of quarter. 7 active quotes are using list price instead.",
    accountName: "Multiple Accounts",
    actions: ["Update Quotes", "Dismiss"],
    status: "new"
  },
  {
    id: "pq7",
    priority: "LOW",
    category: "Pricing & Quoting",
    title: "Renewal Uplift Opportunity",
    description: "Nordic Energy Group renewing at same price point. Market data suggests 6-8% uplift is achievable.",
    accountName: "Nordic Energy Group",
    accountId: "CUST-002",
    actions: ["Review Renewal", "Dismiss"],
    status: "new"
  },
  {
    id: "pq8",
    priority: "LOW",
    category: "Pricing & Quoting",
    title: "Stale Draft Quotes",
    description: "4 quotes have been in Draft status for more than 30 days. Consider archiving stale quotes to keep pipeline clean.",
    accountName: "Multiple Accounts",
    actions: ["Review Drafts", "Dismiss"],
    status: "new"
  }
];
const MOCK_INSIGHTS = [
  ...BASE_INSIGHTS,
  ...PRICING_QUOTING_INSIGHTS
];
const PERMISSION_MATRIX = [
  {
    org: "Adobe Vendor",
    type: "Vendor",
    accessLevel: "full",
    renewals: "allowed",
    pipeline: "allowed",
    forecast: "allowed",
    pricing: "allowed",
    margin: "allowed",
    escalation: "allowed",
    mdf: "allowed",
    partner: "allowed",
    strategic: "allowed"
  },
  {
    org: "Ingram Micro Distributor",
    type: "Distributor",
    accessLevel: "operational",
    renewals: "allowed",
    pipeline: "allowed",
    forecast: "allowed",
    pricing: "restricted",
    margin: "restricted",
    escalation: "restricted",
    mdf: "allowed",
    partner: "allowed",
    strategic: "restricted"
  },
  {
    org: "Nordic Cloud Reseller",
    type: "Reseller",
    accessLevel: "basic",
    renewals: "allowed",
    pipeline: "restricted",
    forecast: "restricted",
    pricing: "restricted",
    margin: "restricted",
    escalation: "restricted",
    mdf: "restricted",
    partner: "restricted",
    strategic: "restricted"
  }
];
const MOCK_ACTIONS_LOG = [
  {
    id: 1,
    text: "Scheduled renewal call with Desperado",
    time: "2 hours ago"
  },
  {
    id: 2,
    text: "Escalated EuroRetail Group to Senior Account Manager",
    time: "5 hours ago"
  },
  {
    id: 3,
    text: "Sent renewal pack to Nordic Energy Group via Horizon Manufacturing",
    time: "Yesterday"
  },
  {
    id: 4,
    text: "Updated pipeline forecast — City Infrastructure Authority re-engaged",
    time: "Yesterday"
  },
  {
    id: 5,
    text: "QBR scheduled for Horizon Manufacturing — 14 days out",
    time: "2 days ago"
  }
];
const MOCK_QUERIES = [
  {
    label: "Show renewal risks",
    prompt: "Show renewal risks",
    response: "ForgeAI has identified 6 accounts with elevated renewal risk in the next 90 days. Desperado (87% churn probability, expires in 18 days) and Nordic Energy Group (expires in 11 days, no renewal activity logged) are the most critical. Additional at-risk accounts include UK Education Trust, Northern Telecom Networks, Global Pharma Holdings, and EuroRetail Group. Recommend prioritising outreach to TechVision and Meridian this week."
  },
  {
    label: "Which accounts are inactive?",
    prompt: "Which accounts are inactive?",
    response: "4 accounts show no logged engagement in the past 30+ days: Global Pharma Holdings (47 days), City Infrastructure Authority (35 days), Northern Telecom Networks (29 days), and UK Education Trust (22 days). Global Pharma Holdings is the most critical — £62,000 ARR with renewal due in 5 months. Immediate re-engagement is recommended for all four accounts."
  },
  {
    label: "Pipeline forecast Q3",
    prompt: "Pipeline forecast Q3",
    response: "Current Q3 weighted forecast is £1.24M against a target of £1.6M — a £360K gap (22%). Committed deals stand at £820K. Three stalled opportunities (City Infrastructure Authority £85K, Apex Financial Services £72K, EuroRetail Group £183K) are required to close the gap. Deal velocity suggests 68% probability of achieving 90%+ of target if stalled deals progress this week."
  }
];
function priorityColor(p) {
  if (p === "HIGH")
    return {
      bg: "bg-orange-500/15",
      text: "text-orange-400",
      border: "border-orange-500/30"
    };
  if (p === "MEDIUM")
    return {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/25"
    };
  return {
    bg: "bg-muted/40",
    text: "text-muted-foreground",
    border: "border-border"
  };
}
function categoryColor(c) {
  const map = {
    Renewals: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    Pipeline: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    Engagement: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    Forecast: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "Account Health": "text-rose-400 bg-rose-500/10 border-rose-500/20",
    "Pricing & Quoting": "text-orange-400 bg-orange-500/10 border-orange-500/20",
    "YoY Growth": "text-orange-300 bg-orange-600/15 border-orange-400/30",
    "KPI Performance": "text-teal-300 bg-teal-500/15 border-teal-400/30"
  };
  return map[c];
}
function ForgeAIPage() {
  const { operationalRole, testModeRole, isTestModeActive } = useApp();
  const effectiveForgeRole = isTestModeActive && testModeRole ? testModeRole : operationalRole;
  const ROLE_INSIGHT_TAGS = {
    salesRep: ["Renewals", "Pipeline", "Engagement"],
    accountManager: ["Account Health", "Renewals", "Engagement"],
    renewalSpecialist: ["Renewals", "Account Health"],
    bdr: ["Pipeline", "Engagement"],
    salesManager: ["Pipeline", "Forecast"],
    regionalDirector: ["Forecast", "Account Health", "Pipeline"],
    salesOps: ["Pipeline", "Forecast", "Engagement"],
    dealDesk: ["Pipeline", "Pricing & Quoting"],
    marketing: ["Engagement", "Pipeline"],
    customerSuccess: ["Account Health", "Renewals", "Engagement"],
    finance: ["Account Health", "Forecast"],
    itOperations: ["Account Health"],
    securityAdmin: ["Account Health"],
    leadership: ["Forecast", "Account Health", "Pipeline", "Renewals"],
    partnerMarketing: ["Engagement", "Pipeline"]
  };
  const roleInsightTags = ROLE_INSIGHT_TAGS[effectiveForgeRole ?? ""] ?? null;
  const roleFilteredInsights = roleInsightTags ? MOCK_INSIGHTS.filter(
    (i) => roleInsightTags.some(
      (tag) => {
        var _a, _b;
        return ((_a = i.category) == null ? void 0 : _a.includes(tag)) || ((_b = i.tags) == null ? void 0 : _b.includes(tag));
      }
    )
  ) : MOCK_INSIGHTS;
  const { isAnalyzing, runAnalysis } = useForgeAI();
  const { getForgeInsights } = useKPIGovernance();
  const kpiInsights = getForgeInsights();
  const needsAttention = kpiInsights.filter((i) => i.severity === "critical" || i.severity === "warning").slice(0, 4);
  const positiveSignals = kpiInsights.filter((i) => i.severity === "info" || i.severity === "positive").slice(0, 4);
  const [categoryFilter, setCategoryFilter] = reactExports.useState(
    "All"
  );
  const [priorityFilter, setPriorityFilter] = reactExports.useState(
    "All"
  );
  const [accountSearch, setAccountSearch] = reactExports.useState("");
  const [expandedIds, setExpandedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [dismissedIds, setDismissedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [queryInput, setQueryInput] = reactExports.useState("");
  const [queryResponse, setQueryResponse] = reactExports.useState(null);
  const [queryLoading, setQueryLoading] = reactExports.useState(false);
  const [lastUpdated, setLastUpdated] = reactExports.useState(2);
  const queryInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setLastUpdated((prev) => prev + 1), 6e4);
    return () => clearInterval(timer);
  }, []);
  const visibleInsights = roleFilteredInsights.filter((ins) => {
    if (dismissedIds.has(ins.id)) return false;
    if (categoryFilter !== "All" && ins.category !== categoryFilter)
      return false;
    if (priorityFilter !== "All" && ins.priority !== priorityFilter)
      return false;
    if (accountSearch && ins.accountName && !ins.accountName.toLowerCase().includes(accountSearch.toLowerCase()))
      return false;
    return true;
  });
  const highCount = MOCK_INSIGHTS.filter(
    (i) => i.priority === "HIGH" && !dismissedIds.has(i.id)
  ).length;
  const atRiskCount = MOCK_INSIGHTS.filter(
    (i) => ["Account Health", "Renewals"].includes(i.category) && i.priority === "HIGH" && !dismissedIds.has(i.id)
  ).length;
  const renewalsDue = MOCK_INSIGHTS.filter(
    (i) => i.category === "Renewals" && !dismissedIds.has(i.id)
  ).length;
  function toggleExpand(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function dismissInsight(id) {
    setDismissedIds((prev) => /* @__PURE__ */ new Set([...prev, id]));
  }
  async function handleQuery(prompt) {
    setQueryInput(prompt);
    setQueryLoading(true);
    setQueryResponse(null);
    await new Promise((r) => setTimeout(r, 1200));
    const found = MOCK_QUERIES.find((q) => q.prompt === prompt);
    setQueryResponse(
      (found == null ? void 0 : found.response) ?? `ForgeAI has analysed your query: "${prompt}". Based on current data, 4 accounts require immediate attention with elevated risk signals. Pipeline health is at 78% of Q3 target. Recommend reviewing the Renewals and Engagement categories for actionable next steps.`
    );
    setQueryLoading(false);
  }
  function handleQueryKeyDown(e) {
    if (e.key === "Enter" && queryInput.trim()) handleQuery(queryInput.trim());
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full min-h-0 overflow-hidden",
      "data-ocid": "forgeai.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 px-6 pt-5 pb-4 border-b border-border bg-card/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 intelligence-pulse bg-accent/10 border border-accent/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 20, className: "text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-accent font-display forge-pulse", children: "ForgeAI Operational Intelligence" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "forgeai-pulse-dot" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: "AI-powered channel operations intelligence" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-body", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RefreshCw,
                  {
                    size: 11,
                    className: isAnalyzing ? "animate-spin text-accent" : "text-muted-foreground"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Updated ",
                  lastUpdated,
                  " min",
                  lastUpdated !== 1 ? "s" : "",
                  " ago"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "forgeai.refresh_button",
                  onClick: () => {
                    runAnalysis();
                    setLastUpdated(0);
                  },
                  disabled: isAnalyzing,
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RefreshCw,
                      {
                        size: 12,
                        className: isAnalyzing ? "animate-spin" : ""
                      }
                    ),
                    "Refresh"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 11, className: "text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold", children: "Category:" })
            ] }),
            [
              "All",
              "Renewals",
              "Pipeline",
              "Engagement",
              "Forecast",
              "Account Health",
              "Pricing & Quoting",
              "YoY Growth",
              "KPI Performance"
            ].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `forgeai.filter.category.${cat.toLowerCase().replace(" ", "_")}`,
                onClick: () => setCategoryFilter(cat),
                className: `px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${categoryFilter === cat ? "bg-accent/15 text-accent border-accent/30" : "bg-transparent text-muted-foreground border-border hover:border-accent/20"}`,
                children: cat
              },
              cat
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-border mx-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold", children: "Priority:" }),
            ["All", "HIGH", "MEDIUM", "LOW"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `forgeai.filter.priority.${p.toLowerCase()}`,
                onClick: () => setPriorityFilter(p),
                className: `px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border ${priorityFilter === p ? "bg-accent/15 text-accent border-accent/30" : "bg-transparent text-muted-foreground border-border"}`,
                children: p
              },
              p
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Search,
                {
                  size: 12,
                  className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  "data-ocid": "forgeai.account_search.input",
                  value: accountSearch,
                  onChange: (e) => setAccountSearch(e.target.value),
                  placeholder: "Filter by account\\u2026",
                  className: "pl-7 pr-3 py-1.5 rounded-lg text-xs bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent w-44 transition-colors"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 px-6 py-4 border-b border-border bg-card/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 14, className: "text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold text-accent uppercase tracking-wider", children: "Permission-Aware Intelligence" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-body ml-2", children: "ForgeAI filters insights based on linked organisation access level" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border border-border rounded-lg overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Organisation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Access Level" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Renewals" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Pipeline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Forecast" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Pricing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Margin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Escalation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "MDF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Partner" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Strategic" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: PERMISSION_MATRIX.map((row, _i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-b-0 hover:bg-secondary/20 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: row.org }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: row.type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${row.accessLevel === "full" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : row.accessLevel === "operational" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`,
                      children: [
                        row.accessLevel === "full" && /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { size: 9 }),
                        row.accessLevel === "operational" && /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 9 }),
                        row.accessLevel === "basic" && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 9 }),
                        row.accessLevel
                      ]
                    }
                  ) }),
                  [
                    "renewals",
                    "pipeline",
                    "forecast",
                    "pricing",
                    "margin",
                    "escalation",
                    "mdf",
                    "partner",
                    "strategic"
                  ].map((cat) => {
                    const val = row[cat];
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${val === "allowed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`,
                        children: val === "allowed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { size: 9 }),
                          " Allowed"
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 9 }),
                          " Restricted"
                        ] })
                      }
                    ) }, cat);
                  })
                ]
              },
              row.org
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex min-h-0 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin px-6 py-5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground", children: [
              visibleInsights.length,
              " insight",
              visibleInsights.length !== 1 ? "s" : "",
              categoryFilter !== "All" || priorityFilter !== "All" ? " (filtered)" : ""
            ] }) }),
            visibleInsights.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-20",
                "data-ocid": "forgeai.insights.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 36, className: "text-muted-foreground/30 mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No insights match the selected filters" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setCategoryFilter("All");
                        setPriorityFilter("All");
                        setAccountSearch("");
                      },
                      className: "mt-3 text-xs text-accent hover:underline",
                      children: "Clear filters"
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-col gap-3",
                "data-ocid": "forgeai.insights.list",
                children: visibleInsights.map((ins, i) => {
                  const pColors = priorityColor(ins.priority);
                  const catClass = categoryColor(ins.category);
                  const isExpanded = expandedIds.has(ins.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `forgeai.insight.item.${i + 1}`,
                      className: "cf-card rounded-lg p-4 transition-all duration-200 hover:border-accent/20",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-2", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${pColors.bg} ${pColors.text} ${pColors.border}`,
                                  children: ins.priority
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${catClass}`,
                                  children: ins.category
                                }
                              ),
                              ins.status === "new" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20", children: "New" }),
                              ins.status === "acted" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 9 }),
                                " Acted on",
                                " ",
                                ins.actedDaysAgo,
                                "d ago"
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground leading-snug mb-1.5", children: ins.title }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: `text-xs text-muted-foreground font-body leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`,
                                children: ins.description
                              }
                            ),
                            ins.accountName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Account:" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  className: "text-[10px] text-accent underline underline-offset-2 font-medium hover:text-accent/80 transition-colors",
                                  children: ins.accountName
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/50", children: [
                                "(",
                                ins.accountId,
                                ")"
                              ] })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              "data-ocid": `forgeai.insight.expand.${i + 1}`,
                              onClick: () => toggleExpand(ins.id),
                              className: "flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors rounded",
                              "aria-label": isExpanded ? "Collapse" : "Expand",
                              children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 })
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 flex-wrap", children: [
                          ins.actions.filter((a) => a !== "Dismiss" && a !== "Snooze").map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              type: "button",
                              className: "px-3 py-1.5 rounded-md text-xs font-medium bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors",
                              children: action
                            },
                            action
                          )),
                          ins.actions.includes("Snooze") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              "data-ocid": `forgeai.insight.snooze.${i + 1}`,
                              className: "px-3 py-1.5 rounded-md text-xs font-medium bg-muted/30 border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                                " Snooze"
                              ]
                            }
                          ),
                          ins.actions.includes("Dismiss") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              type: "button",
                              "data-ocid": `forgeai.insight.dismiss.${i + 1}`,
                              onClick: () => dismissInsight(ins.id),
                              className: "ml-auto px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-colors flex items-center gap-1",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 }),
                                " Dismiss"
                              ]
                            }
                          )
                        ] })
                      ]
                    },
                    ins.id
                  );
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 bg-[#1e293b] rounded-lg border border-slate-700/50 p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    className: "text-orange-400",
                    "aria-label": "Performance chart",
                    role: "img",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "18", y1: "20", x2: "18", y2: "10" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "20", x2: "12", y2: "4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "20", x2: "6", y2: "14" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white", children: "Performance Intelligence" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 ml-1", children: "— KPI & YoY signals" })
              ] }),
              needsAttention.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 uppercase tracking-wider mb-2", children: "Needs Attention" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: needsAttention.map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `bg-[#0f172a] rounded-lg p-3 border-l-4 ${insight.severity === "critical" ? "border-l-red-500" : "border-l-amber-500"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-200", children: insight.message }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
                        insight.kpiName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded", children: insight.kpiName }),
                        insight.territory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded", children: insight.territory }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: insight.period })
                      ] })
                    ]
                  },
                  insight.id
                )) })
              ] }),
              positiveSignals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 uppercase tracking-wider mb-2", children: "Positive Signals" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: positiveSignals.map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `bg-[#0f172a] rounded-lg p-3 border-l-4 ${insight.severity === "positive" ? "border-l-green-500" : "border-l-blue-500"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-200", children: insight.message }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
                        insight.kpiName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded", children: insight.kpiName }),
                        insight.territory && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded", children: insight.territory }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: insight.period })
                      ] })
                    ]
                  },
                  insight.id
                )) })
              ] }),
              needsAttention.length === 0 && positiveSignals.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "No performance signals available for this period." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-80 flex-shrink-0 border-l border-border overflow-y-auto scrollbar-thin px-5 py-5 flex-col gap-5 hidden lg:flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "cf-card rounded-lg p-4",
                "data-ocid": "forgeai.summary.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-md bg-accent/10 border border-accent/25 flex items-center justify-center flex-shrink-0 intelligence-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 13, className: "text-accent" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold text-accent uppercase tracking-wider", children: "AI Summary" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-xs text-muted-foreground font-body leading-relaxed", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      "As of today, your channel pipeline shows a",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "22% shortfall against Q3 target" }),
                      ", driven primarily by 3 stalled opportunities and 2 critical renewal risks requiring immediate action."
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Engagement health across the reseller network is mixed \\u2014 Horizon Manufacturing and Global Pharma Holdings require re-engagement within 7 days to prevent further health score deterioration." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      "ForgeAI recommends prioritising",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: "Desperado" }),
                      " and",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: "Nordic Energy Group" }),
                      " ",
                      "renewals this week, alongside progressing the City Infrastructure Authority and Apex Financial Services pipeline deals to close the Q3 forecast gap."
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "forgeai.metrics.panel", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Key Metrics" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MetricTile,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 13, className: "text-orange-400" }),
                    label: "High Priority",
                    value: highCount,
                    accent: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MetricTile,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 13, className: "text-rose-400" }),
                    label: "Accounts at Risk",
                    value: atRiskCount
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MetricTile,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13, className: "text-sky-400" }),
                    label: "Renewals (30d)",
                    value: renewalsDue
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/60 border border-border rounded-lg p-3 flex flex-col gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-body leading-tight", children: "Pipeline Health" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 13, className: "text-accent" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-foreground font-display", children: "78%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-border/60 rounded-full h-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "bg-accent h-1 rounded-full",
                      style: { width: "78%" }
                    }
                  ) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "forgeai.smart_queries.panel", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Ask ForgeAI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Brain,
                    {
                      size: 11,
                      className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-accent"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: queryInputRef,
                      type: "text",
                      "data-ocid": "forgeai.query.input",
                      value: queryInput,
                      onChange: (e) => setQueryInput(e.target.value),
                      onKeyDown: handleQueryKeyDown,
                      placeholder: "Ask anything\\u2026",
                      className: "w-full pl-7 pr-3 py-2 rounded-lg text-xs bg-input border border-border text-foreground placeholder-muted-foreground outline-none focus:border-accent transition-colors"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "forgeai.query.submit_button",
                    onClick: () => queryInput.trim() && handleQuery(queryInput.trim()),
                    disabled: queryLoading || !queryInput.trim(),
                    className: "px-3 py-2 rounded-lg text-xs font-semibold bg-accent/15 border border-accent/25 text-accent hover:bg-accent/25 transition-colors disabled:opacity-50",
                    children: queryLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 11 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: MOCK_QUERIES.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `forgeai.query.preset.${q.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
                  onClick: () => handleQuery(q.prompt),
                  className: "w-full text-left px-3 py-2 rounded-lg text-xs bg-card/60 border border-border text-muted-foreground hover:text-foreground hover:border-accent/25 transition-colors flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronRight,
                      {
                        size: 10,
                        className: "text-accent flex-shrink-0"
                      }
                    ),
                    q.label
                  ]
                },
                q.label
              )) }),
              queryLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-lg p-3 border border-accent/30 bg-accent/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11, className: "animate-spin text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-accent", children: "ForgeAI is analysing\\u2026" })
              ] }) }),
              queryResponse && !queryLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mt-3 rounded-lg p-3 border border-accent/30 bg-accent/5",
                  "data-ocid": "forgeai.query.response",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 10, className: "text-accent" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-accent uppercase tracking-wide", children: "ForgeAI Response" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body leading-relaxed", children: queryResponse })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "forgeai.recent_actions.panel", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3", children: "Recent Actions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: MOCK_ACTIONS_LOG.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleCheckBig,
                  {
                    size: 11,
                    className: "text-emerald-400 flex-shrink-0 mt-0.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 font-body leading-snug", children: action.text }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: action.time })
                ] })
              ] }, action.id)) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function MetricTile({
  icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `bg-card/60 border rounded-lg p-3 flex flex-col gap-2 ${accent ? "border-accent/25" : "border-border"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-body leading-tight", children: label }),
          icon
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xl font-bold font-display ${accent ? "text-accent" : "text-foreground"}`,
            children: value
          }
        )
      ]
    }
  );
}
export {
  ForgeAIPage
};
