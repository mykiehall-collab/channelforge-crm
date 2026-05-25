import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Flame,
  Layers,
  MessageSquare,
  Pin,
  PinOff,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Task {
  id: string;
  title: string;
  account: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
}
interface Callback {
  id: string;
  account: string;
  contact: string;
  scheduledTime: string;
}
interface Opportunity {
  id: string;
  dealName: string;
  account: string;
  stage: string;
  value: number;
  closeDate: string;
  daysOpen: number;
}
interface Renewal {
  id: string;
  account: string;
  product: string;
  renewalDate: string;
  value: number;
  status: "At Risk" | "Due Soon" | "Healthy";
  daysUntil: number;
}
interface Insight {
  id: string;
  type: "Renewal Risk" | "Pipeline" | "Engagement" | "Forecast";
  title: string;
  body: string;
  urgency: "high" | "medium" | "low";
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_TASKS: Task[] = [
  {
    id: "t1",
    title: "Follow up on renewal risk – Axiom Networks",
    account: "Axiom Networks",
    dueDate: "Today",
    priority: "High",
    done: false,
  },
  {
    id: "t2",
    title: "Send pricing proposal – BlueStar IT",
    account: "BlueStar IT",
    dueDate: "Tomorrow",
    priority: "High",
    done: false,
  },
  {
    id: "t3",
    title: "Review inactive account – CoreEdge Solutions",
    account: "CoreEdge Solutions",
    dueDate: "May 21",
    priority: "Medium",
    done: false,
  },
  {
    id: "t4",
    title: "Update deal registration – Nexus Systems",
    account: "Nexus Systems",
    dueDate: "May 22",
    priority: "Medium",
    done: false,
  },
  {
    id: "t5",
    title: "Qualify new lead – Vertex Cloud",
    account: "Vertex Cloud",
    dueDate: "May 23",
    priority: "Low",
    done: false,
  },
  {
    id: "t6",
    title: "Book QBR meeting – TowerBridge Tech",
    account: "TowerBridge Tech",
    dueDate: "May 24",
    priority: "Low",
    done: false,
  },
];
const MOCK_CALLBACKS: Callback[] = [
  {
    id: "cb1",
    account: "Axiom Networks",
    contact: "Sarah Lawson",
    scheduledTime: "Today 14:00",
  },
  {
    id: "cb2",
    account: "BlueStar IT",
    contact: "James Whitmore",
    scheduledTime: "Tomorrow 10:30",
  },
  {
    id: "cb3",
    account: "Nexus Systems",
    contact: "Rachel Chen",
    scheduledTime: "May 22 09:00",
  },
];
const MOCK_OPPS: Opportunity[] = [
  {
    id: "op1",
    dealName: "Enterprise Renewal – Axiom",
    account: "Axiom Networks",
    stage: "Negotiation",
    value: 84000,
    closeDate: "Jun 01",
    daysOpen: 42,
  },
  {
    id: "op2",
    dealName: "Cloud Migration Suite",
    account: "CoreEdge Solutions",
    stage: "Proposal",
    value: 56000,
    closeDate: "Jun 15",
    daysOpen: 28,
  },
  {
    id: "op3",
    dealName: "Security Bundle Q2",
    account: "Nexus Systems",
    stage: "Deal Registration",
    value: 32000,
    closeDate: "Jun 30",
    daysOpen: 14,
  },
  {
    id: "op4",
    dealName: "Managed Services Upsell",
    account: "BlueStar IT",
    stage: "Qualification",
    value: 18000,
    closeDate: "Jul 10",
    daysOpen: 7,
  },
  {
    id: "op5",
    dealName: "Endpoint Refresh",
    account: "Vertex Cloud",
    stage: "Prospecting",
    value: 11500,
    closeDate: "Jul 20",
    daysOpen: 3,
  },
  {
    id: "op6",
    dealName: "Annual Support Contract",
    account: "TowerBridge Tech",
    stage: "Closed Won",
    value: 24000,
    closeDate: "May 10",
    daysOpen: 60,
  },
];
const MOCK_RENEWALS: Renewal[] = [
  {
    id: "r1",
    account: "Axiom Networks",
    product: "Enterprise Suite",
    renewalDate: "Jun 01",
    value: 84000,
    status: "At Risk",
    daysUntil: 13,
  },
  {
    id: "r2",
    account: "CoreEdge Solutions",
    product: "Cloud Platform",
    renewalDate: "Jun 10",
    value: 56000,
    status: "Due Soon",
    daysUntil: 22,
  },
  {
    id: "r3",
    account: "Nexus Systems",
    product: "Security Bundle",
    renewalDate: "Jun 18",
    value: 32000,
    status: "Due Soon",
    daysUntil: 30,
  },
  {
    id: "r4",
    account: "BlueStar IT",
    product: "Managed Services",
    renewalDate: "Jul 05",
    value: 44000,
    status: "Healthy",
    daysUntil: 47,
  },
  {
    id: "r5",
    account: "Vertex Cloud",
    product: "Endpoint Protection",
    renewalDate: "Jul 15",
    value: 18000,
    status: "Healthy",
    daysUntil: 57,
  },
  {
    id: "r6",
    account: "TowerBridge Tech",
    product: "Support & Maintenance",
    renewalDate: "Aug 01",
    value: 24000,
    status: "Healthy",
    daysUntil: 74,
  },
  {
    id: "r7",
    account: "SkyBridge Group",
    product: "Analytics Suite",
    renewalDate: "May 28",
    value: 12000,
    status: "At Risk",
    daysUntil: 9,
  },
  {
    id: "r8",
    account: "Meridian Partners",
    product: "Collaboration Tools",
    renewalDate: "Jun 05",
    value: 9500,
    status: "Due Soon",
    daysUntil: 17,
  },
];
const MOCK_INSIGHTS: Insight[] = [
  {
    id: "i1",
    type: "Renewal Risk",
    title: "Axiom Networks renewal at risk",
    body: "No engagement recorded in 34 days. Renewal due in 13 days.",
    urgency: "high",
  },
  {
    id: "i2",
    type: "Renewal Risk",
    title: "SkyBridge Group expiring soon",
    body: "Contract expires in 9 days. Last contact: 41 days ago.",
    urgency: "high",
  },
  {
    id: "i3",
    type: "Pipeline",
    title: "Cloud Migration Suite stalled",
    body: "Opportunity has not progressed in 14 days. Proposal sent May 5.",
    urgency: "medium",
  },
  {
    id: "i4",
    type: "Engagement",
    title: "CoreEdge engagement gap detected",
    body: "Customer engagement dropped 42% compared to last quarter.",
    urgency: "medium",
  },
  {
    id: "i5",
    type: "Forecast",
    title: "Q2 pipeline below target",
    body: "Current pipeline covers 74% of Q2 target. Consider accelerating 2 opportunities.",
    urgency: "medium",
  },
  {
    id: "i6",
    type: "Engagement",
    title: "TowerBridge Tech – no recent activity",
    body: "No meetings, calls, or messages logged in 28 days.",
    urgency: "low",
  },
  {
    id: "i7",
    type: "Pipeline",
    title: "3 opportunities approaching close date",
    body: "Axiom, CoreEdge, and Nexus all closing within 30 days.",
    urgency: "medium",
  },
  {
    id: "i8",
    type: "Renewal Risk",
    title: "Meridian Partners renewal in 17 days",
    body: "Medium risk. Last contact 19 days ago. Recommend outreach today.",
    urgency: "medium",
  },
  {
    id: "i9",
    type: "Forecast",
    title: "Renewal revenue tracking ahead",
    body: "Renewal pipeline is 112% of forecast for the quarter — good momentum.",
    urgency: "low",
  },
  {
    id: "i10",
    type: "Engagement",
    title: "BlueStar IT scoring highly",
    body: "Customer health score: 88/100. Strong engagement across last 60 days.",
    urgency: "low",
  },
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
    renewalDate: "Jun 01",
  },
  {
    id: "a2",
    name: "CoreEdge Solutions",
    customerId: "VND-0002",
    status: "Active",
    health: "medium",
    owner: "You",
    lastActivity: "5 days ago",
    renewalDate: "Jun 10",
  },
  {
    id: "a3",
    name: "Nexus Systems",
    customerId: "VND-0003",
    status: "Active",
    health: "high",
    owner: "You",
    lastActivity: "1 day ago",
    renewalDate: "Jun 18",
  },
  {
    id: "a4",
    name: "BlueStar IT",
    customerId: "VND-0004",
    status: "Active",
    health: "high",
    owner: "You",
    lastActivity: "Today",
    renewalDate: "Jul 05",
  },
  {
    id: "a5",
    name: "Vertex Cloud",
    customerId: "VND-0005",
    status: "Inactive",
    health: "low",
    owner: "You",
    lastActivity: "18 days ago",
    renewalDate: "Jul 15",
  },
  {
    id: "a6",
    name: "TowerBridge Tech",
    customerId: "VND-0006",
    status: "Active",
    health: "medium",
    owner: "You",
    lastActivity: "8 days ago",
    renewalDate: "Aug 01",
  },
  {
    id: "a7",
    name: "SkyBridge Group",
    customerId: "VND-0007",
    status: "At Risk",
    health: "low",
    owner: "You",
    lastActivity: "12 days ago",
    renewalDate: "May 28",
  },
  {
    id: "a8",
    name: "Meridian Partners",
    customerId: "VND-0008",
    status: "Active",
    health: "medium",
    owner: "You",
    lastActivity: "3 days ago",
    renewalDate: "Jun 05",
  },
];
const MOCK_MESSAGES = [
  {
    id: "m1",
    from: "Sarah Lawson",
    preview: "Following up on the renewal proposal we discussed...",
    time: "10:24",
    unread: 2,
  },
  {
    id: "m2",
    from: "James Whitmore",
    preview: "The pricing deck looks good. Can we schedule a call?",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "m3",
    from: "Rachel Chen",
    preview: "Deal registration approved — moving to negotiation stage.",
    time: "Yesterday",
    unread: 1,
  },
  {
    id: "m4",
    from: "ForgeAI Alert",
    preview:
      "Axiom Networks renewal risk increased. Immediate action recommended.",
    time: "2 days ago",
    unread: 0,
  },
  {
    id: "m5",
    from: "Admin – Vendor Team",
    preview: "New pricing promotion available Q2. See promotions section.",
    time: "3 days ago",
    unread: 0,
  },
];
const ROLE_REPORTS: Record<string, { name: string; description: string }[]> = {
  accountmanager: [
    {
      name: "Account Health Summary",
      description:
        "Health scores and engagement trends across assigned accounts.",
    },
    {
      name: "Open Opportunities",
      description: "Active opportunities with stage and value breakdown.",
    },
    {
      name: "Relationship Risk Report",
      description: "Accounts with declining engagement or no recent activity.",
    },
    {
      name: "QBR Preparation Pack",
      description: "Quarterly business review data for assigned accounts.",
    },
    {
      name: "ForgeAI Upsell Signals",
      description: "AI-detected expansion and upsell opportunities.",
    },
  ],
  renewalspecialist: [
    {
      name: "Renewals Due This Quarter",
      description: "All renewals expiring within 90 days, sorted by risk.",
    },
    {
      name: "At-Risk Renewal Report",
      description:
        "Renewals with probability below 70% and recommended actions.",
    },
    {
      name: "Renewal Health Tracker",
      description: "Health scores and engagement for upcoming renewals.",
    },
    {
      name: "Churn Signal Analysis",
      description: "ForgeAI-detected early churn indicators and alerts.",
    },
    {
      name: "Renewal Forecast",
      description:
        "Projected renewal revenue and probability-weighted pipeline.",
    },
  ],
  dealdesk: [
    {
      name: "Pending Approvals Queue",
      description:
        "Pricing exceptions, discounts, and deal terms awaiting approval.",
    },
    {
      name: "Deal Registration Status",
      description:
        "All deal registrations with validation and approval status.",
    },
    {
      name: "SLA Breach Report",
      description:
        "Approvals and registrations that have exceeded SLA targets.",
    },
    {
      name: "Discount Exception Log",
      description: "Historical discount approvals and exception patterns.",
    },
  ],
  customersuccess: [
    {
      name: "Onboarding Progress Tracker",
      description: "Active onboardings with schedule adherence and milestones.",
    },
    {
      name: "Adoption Score Report",
      description: "Product adoption metrics across all managed accounts.",
    },
    {
      name: "Customer Health Index",
      description: "Composite health scores with trend and risk indicators.",
    },
    {
      name: "Engagement Gap Analysis",
      description:
        "Accounts with declining usage and recommended interventions.",
    },
    {
      name: "Expansion Opportunity Report",
      description: "ForgeAI-detected expansion signals and growth potential.",
    },
  ],
  finance: [
    {
      name: "Renewal Revenue Forecast",
      description: "Projected renewal revenue with probability weighting.",
    },
    {
      name: "Credit Usage vs Budget",
      description:
        "Compute, storage, and AI credit consumption against budget.",
    },
    {
      name: "YTD Revenue Report",
      description: "Year-to-date revenue performance vs forecast and target.",
    },
    {
      name: "At-Risk Revenue Analysis",
      description: "Revenue at risk from renewals with low probability.",
    },
    {
      name: "Department Spend Breakdown",
      description: "Credit and operational spend by team and department.",
    },
  ],
  default: [
    {
      name: "My Accounts Summary",
      description:
        "Overview of all assigned accounts with health and renewal status.",
    },
    {
      name: "Open Opportunities",
      description: "All active opportunities with stage and value breakdown.",
    },
    {
      name: "Renewals Due This Quarter",
      description: "Renewals expiring within 90 days, sorted by risk.",
    },
    {
      name: "Pipeline Forecast",
      description: "Weighted pipeline vs. Q2 revenue target.",
    },
    {
      name: "Account Engagement Gaps",
      description: "Accounts with no logged activity in the past 30 days.",
    },
    {
      name: "Deal Registration Status",
      description: "Pending, approved, and rejected deal registrations.",
    },
  ],
};
const OPP_STAGES = [
  "Prospecting",
  "Qualification",
  "Proposal",
  "Deal Registration",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatTile({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`cf-card rounded-lg p-4 flex flex-col gap-1.5 ${accent ? "border-orange-500/40" : ""}`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className={`w-4 h-4 ${accent ? "text-orange-400" : ""}`} />
        <span className="text-xs">{label}</span>
      </div>
      <p
        className={`text-2xl font-bold font-display ${accent ? "text-orange-400" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}

function PriorityCard({
  title,
  detail,
  urgency,
}: { title: string; detail: string; urgency: "high" | "medium" | "low" }) {
  const colors: Record<string, string> = {
    high: "border-l-orange-500/70 bg-orange-500/5",
    medium: "border-l-orange-500/60 bg-orange-500/5",
    low: "border-l-blue-500/40 bg-blue-500/5",
  };
  return (
    <div
      className={`border border-border border-l-4 rounded-lg p-3 ${colors[urgency]}`}
    >
      <p className="text-sm font-medium text-foreground leading-snug">
        {title}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const typeColors: Record<string, string> = {
    "Renewal Risk": "text-orange-400 bg-orange-500/10",
    Pipeline: "text-blue-400 bg-blue-500/10",
    Engagement: "text-orange-400 bg-orange-500/10",
    Forecast: "text-emerald-400 bg-emerald-500/10",
  };
  const urgencyDot: Record<string, string> = {
    high: "bg-orange-500",
    medium: "bg-orange-400",
    low: "bg-emerald-500",
  };
  return (
    <div className="cf-card rounded-lg p-4 border border-border hover:border-orange-500/30 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[insight.type]}`}
        >
          {insight.type}
        </span>
        <span
          className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${urgencyDot[insight.urgency]}`}
        />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">
        {insight.title}
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {insight.body}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "At Risk": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Inactive: "bg-muted text-muted-foreground border-border",
    "Due Soon": "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Healthy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Negotiation: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    Proposal: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    "Deal Registration":
      "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Qualification: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    Prospecting: "bg-muted text-muted-foreground border-border",
    "Closed Won": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    "Closed Lost": "bg-muted/40 text-muted-foreground border-border",
  };
  return (
    <span
      className={`text-xs border rounded-full px-2 py-0.5 font-medium ${map[status] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {status}
    </span>
  );
}

function HealthDot({ health }: { health: string }) {
  const map: Record<string, string> = {
    high: "bg-emerald-500",
    medium: "bg-orange-400",
    low: "bg-red-500",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${map[health] ?? "bg-muted"}`}
    />
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    High: "bg-orange-500/15 text-orange-400",
    Medium: "bg-orange-500/15 text-orange-400",
    Low: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[priority] ?? "bg-muted text-muted-foreground"}`}
    >
      {priority}
    </span>
  );
}

// ─── Tab content components ──────────────────────────────────────────────────
function WorkspaceTab({ role }: { role: string }) {
  const navigate = useNavigate();
  const _roleKey = role.toLowerCase();
  const priorities: {
    title: string;
    detail: string;
    urgency: "high" | "medium" | "low";
  }[] = [
    {
      title: "Axiom Networks renewal at critical risk",
      detail: "Due in 13 days — no contact in 34 days",
      urgency: "high",
    },
    {
      title: "SkyBridge Group contract expiring in 9 days",
      detail: "Immediate outreach required",
      urgency: "high",
    },
    {
      title: "3 opportunities stalled in pipeline",
      detail: "CoreEdge, Nexus, BlueStar — no progression in 14+ days",
      urgency: "medium",
    },
    {
      title: "Q2 pipeline at 74% of target",
      detail: "Consider accelerating 2 opportunities",
      urgency: "medium",
    },
    {
      title: "Vertex Cloud inactive for 18 days",
      detail: "Review account engagement",
      urgency: "low",
    },
  ];
  const recentAccounts = MOCK_ACCOUNTS.slice(0, 5);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cf_watchlist") ?? "[]");
    } catch {
      return [];
    }
  });
  const togglePin = (id: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
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
    { label: "SkyBridge Group – contract alert raised", time: "2 days ago" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left column */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile label="My Accounts" value={47} icon={Users} />
          <StatTile label="Open Opportunities" value={12} icon={TrendingUp} />
          <StatTile label="Renewals Due" value={8} icon={RefreshCw} accent />
          <StatTile label="Tasks Today" value={5} icon={CheckCircle2} />
        </div>

        {/* Priorities */}
        <div className="cf-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold">Today's Priorities</h3>
          </div>
          <div className="flex flex-col gap-2">
            {priorities.map((p, _i) => (
              <PriorityCard key={p.title} {...p} />
            ))}
          </div>
        </div>

        {/* Recent accounts */}
        <div className="cf-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold">Recent Accounts</h3>
            </div>
            <button
              type="button"
              onClick={() => navigate({ to: "/accounts" })}
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {recentAccounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <HealthDot health={acc.health} />
                  <span className="text-sm font-medium truncate">
                    {acc.name}
                  </span>
                  <StatusBadge status={acc.status} />
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {acc.lastActivity}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePin(acc.id)}
                    className="text-muted-foreground hover:text-orange-400 transition-colors"
                    aria-label={watchlist.includes(acc.id) ? "Unpin" : "Pin"}
                  >
                    {watchlist.includes(acc.id) ? (
                      <PinOff className="w-3.5 h-3.5" />
                    ) : (
                      <Pin className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        {/* ForgeAI quick panel */}
        <div className="cf-card rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-orange-400 intelligence-pulse" />
            <h3 className="text-sm font-semibold text-orange-400">
              ForgeAI Insights
            </h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {MOCK_INSIGHTS.slice(0, 3).map((insight) => (
              <div key={insight.id} className="text-xs">
                <p className="font-medium text-foreground leading-snug">
                  {insight.title}
                </p>
                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                  {insight.body}
                </p>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            View All Insights <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Upcoming tasks */}
        <div className="cf-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold">Upcoming Tasks</h3>
          </div>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    task.priority === "High"
                      ? "bg-orange-500"
                      : task.priority === "Medium"
                        ? "bg-orange-400"
                        : "bg-muted-foreground"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {task.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="cf-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold">Recent Activity</h3>
          </div>
          <div className="flex flex-col gap-2">
            {activity.map((item, _i) => (
              <div key={item.label} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-orange-400/60 mt-2 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-foreground leading-snug">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountsTab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cf_watchlist") ?? "[]");
    } catch {
      return [];
    }
  });
  const togglePin = (id: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("cf_watchlist", JSON.stringify(next));
      return next;
    });
  };
  const filtered = MOCK_ACCOUNTS.filter(
    (a) =>
      (statusFilter === "All" || a.status === statusFilter) &&
      a.name.toLowerCase().includes(search.toLowerCase()),
  );
  const pinned = MOCK_ACCOUNTS.filter((a) => watchlist.includes(a.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search accounts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-white/5 border-border"
          data-ocid="foundry-lite.account_search"
        />
        <div className="flex gap-1">
          {["All", "Active", "At Risk", "Inactive"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                statusFilter === s
                  ? "bg-orange-500/15 text-orange-400"
                  : "text-muted-foreground hover:bg-white/5"
              }`}
              data-ocid={`foundry-lite.status_filter.${s.toLowerCase().replace(" ", "-")}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="cf-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-white/[0.04]">
                {[
                  "Account Name",
                  "Customer ID",
                  "Status",
                  "Health",
                  "Owner",
                  "Last Activity",
                  "Renewal Date",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-muted-foreground font-medium px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc, i) => (
                <tr
                  key={acc.id}
                  className="border-b border-border/50 hover:bg-white/[0.03] cursor-pointer transition-colors"
                  onClick={() => navigate({ to: "/accounts" })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate({ to: "/accounts" });
                  }}
                  tabIndex={0}
                  data-ocid={`foundry-lite.account.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{acc.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {acc.customerId}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={acc.status} />
                  </td>
                  <td className="px-4 py-3">
                    <HealthDot health={acc.health} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {acc.owner}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {acc.lastActivity}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {acc.renewalDate}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(acc.id);
                      }}
                      className="text-muted-foreground hover:text-orange-400 transition-colors"
                      aria-label={watchlist.includes(acc.id) ? "Unpin" : "Pin"}
                    >
                      {watchlist.includes(acc.id) ? (
                        <PinOff className="w-4 h-4" />
                      ) : (
                        <Pin className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watchlist */}
      {pinned.length > 0 && (
        <div className="cf-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Pin className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold">Watchlist</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {pinned.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2"
              >
                <HealthDot health={acc.health} />
                <span className="text-sm font-medium">{acc.name}</span>
                <StatusBadge status={acc.status} />
                <button
                  type="button"
                  onClick={() => togglePin(acc.id)}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                  aria-label="Remove from watchlist"
                >
                  <PinOff className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PipelineTab() {
  const [opps, setOpps] = useState(MOCK_OPPS);
  const updateStage = (id: string, stage: string) => {
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">My Opportunities</h3>
        <Button
          size="sm"
          variant="outline"
          className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
          data-ocid="foundry-lite.new_opportunity_button"
        >
          + New Opportunity
        </Button>
      </div>
      <div className="cf-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-white/[0.04]">
                {[
                  "Deal Name",
                  "Account",
                  "Stage",
                  "Value",
                  "Close Date",
                  "Days Open",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-muted-foreground font-medium px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {opps.map((opp, i) => (
                <tr
                  key={opp.id}
                  className="border-b border-border/50 hover:bg-white/[0.03] transition-colors"
                  data-ocid={`foundry-lite.opportunity.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{opp.dealName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {opp.account}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={opp.stage} />
                  </td>
                  <td className="px-4 py-3 font-mono text-right">
                    £{opp.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {opp.closeDate}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {opp.daysOpen}d
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="text-xs bg-white/5 border border-border rounded px-2 py-1 text-foreground"
                      value={opp.stage}
                      onChange={(e) => updateStage(opp.id, e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      aria-label="Move stage"
                    >
                      {OPP_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RenewalsTab() {
  const renewals = [...MOCK_RENEWALS].sort((a, b) => a.daysUntil - b.daysUntil);
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">My Assigned Renewals</h3>
      <div className="cf-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-white/[0.04]">
                {[
                  "Account",
                  "Product",
                  "Renewal Date",
                  "Value",
                  "Status",
                  "Days Until",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-muted-foreground font-medium px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renewals.map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b border-border/50 hover:bg-white/[0.03] transition-colors"
                  data-ocid={`foundry-lite.renewal.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium">{r.account}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.product}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.renewalDate}
                  </td>
                  <td className="px-4 py-3 font-mono text-right">
                    £{r.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${r.daysUntil <= 14 ? "text-red-400" : r.daysUntil <= 30 ? "text-orange-400" : "text-muted-foreground"}`}
                  >
                    {r.daysUntil}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TasksTab() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    account: "",
    dueDate: "",
    priority: "Medium" as Task["priority"],
  });
  const toggleDone = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  const addTask = () => {
    if (!newTask.title) return;
    setTasks((prev) => [
      ...prev,
      { id: `t${Date.now()}`, ...newTask, done: false },
    ]);
    setNewTask({ title: "", account: "", dueDate: "", priority: "Medium" });
    setShowNewTask(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tasks */}
      <div className="cf-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold">Tasks</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
            onClick={() => setShowNewTask((v) => !v)}
            data-ocid="foundry-lite.new_task_button"
          >
            + New Task
          </Button>
        </div>

        {showNewTask && (
          <div className="mb-4 p-3 bg-white/[0.04] rounded-lg border border-border flex flex-col gap-2">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask((p) => ({ ...p, title: e.target.value }))
              }
              className="bg-white/5 border-border"
              data-ocid="foundry-lite.new_task.title_input"
            />
            <div className="flex gap-2">
              <Input
                placeholder="Account"
                value={newTask.account}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, account: e.target.value }))
                }
                className="bg-white/5 border-border flex-1"
                data-ocid="foundry-lite.new_task.account_input"
              />
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, dueDate: e.target.value }))
                }
                className="bg-white/5 border-border w-36"
                data-ocid="foundry-lite.new_task.date_input"
              />
              <select
                className="text-xs bg-white/5 border border-border rounded px-2 text-foreground"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask((p) => ({
                    ...p,
                    priority: e.target.value as Task["priority"],
                  }))
                }
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-500 text-white"
                onClick={addTask}
                data-ocid="foundry-lite.new_task.submit_button"
              >
                Add Task
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowNewTask(false)}
                data-ocid="foundry-lite.new_task.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {tasks.map((task, i) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg ${task.done ? "opacity-50" : ""}`}
              data-ocid={`foundry-lite.task.item.${i + 1}`}
            >
              <button
                type="button"
                onClick={() => toggleDone(task.id)}
                className="flex-shrink-0"
                aria-label={task.done ? "Mark undone" : "Mark done"}
                data-ocid={`foundry-lite.task.checkbox.${i + 1}`}
              >
                {task.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-border block" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${task.done ? "line-through" : ""} truncate`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {task.account} · {task.dueDate}
                </p>
              </div>
              <PriorityBadge priority={task.priority} />
            </div>
          ))}
        </div>
      </div>

      {/* Callbacks */}
      <div className="cf-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold">Scheduled Callbacks</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
            data-ocid="foundry-lite.new_callback_button"
          >
            + New Callback
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {MOCK_CALLBACKS.map((cb, i) => (
            <div
              key={cb.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-border/50"
              data-ocid={`foundry-lite.callback.item.${i + 1}`}
            >
              <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{cb.account}</p>
                <p className="text-xs text-muted-foreground">{cb.contact}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {cb.scheduledTime}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsTab({
  navigate,
}: { navigate: ReturnType<typeof useNavigate> }) {
  const reports = ROLE_REPORTS.default;
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const mockResult = [
    ["Axiom Networks", "At Risk", "Jun 01", "£84,000"],
    ["CoreEdge Solutions", "Active", "Jun 10", "£56,000"],
    ["Nexus Systems", "Active", "Jun 18", "£32,000"],
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <div
            key={r.name}
            className="cf-card rounded-xl p-4 flex flex-col gap-3"
            data-ocid={`foundry-lite.report.item.${i + 1}`}
          >
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {r.description}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10 w-full mt-auto"
              onClick={() =>
                setActiveReport(activeReport === r.name ? null : r.name)
              }
              data-ocid={`foundry-lite.report.run_button.${i + 1}`}
            >
              {activeReport === r.name ? "Hide Results" : "Run Report"}
            </Button>
          </div>
        ))}
      </div>

      {activeReport && (
        <div className="cf-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">
            {activeReport} — Results
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium px-3 py-2">
                    Account
                  </th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-3 py-2">
                    Status
                  </th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-3 py-2">
                    Renewal
                  </th>
                  <th className="text-left text-xs text-muted-foreground font-medium px-3 py-2">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockResult.map((row, ri) => (
                  <tr
                    key={mockResult[ri]?.[0] ?? `row-${ri}`}
                    className="border-b border-border/50"
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={`${row[0] ?? ri}-col-${ci}`}
                        className="px-3 py-2 text-sm"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate({ to: "/reports" })}
          className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1.5 mx-auto transition-colors"
        >
          <BookOpen className="w-4 h-4" /> Need more? Open Full Reports{" "}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ForgeAITab() {
  const [filter, setFilter] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(0);
  const filters = ["All", "Renewal Risk", "Pipeline", "Engagement", "Forecast"];

  useEffect(() => {
    const tick = () => setLastUpdated(Date.now());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const minsAgo = lastUpdated
    ? Math.floor((Date.now() - lastUpdated) / 60_000)
    : 0;
  const filtered =
    filter === "All"
      ? MOCK_INSIGHTS
      : MOCK_INSIGHTS.filter((i) => i.type === filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                filter === f
                  ? "bg-orange-500/15 text-orange-400"
                  : "text-muted-foreground hover:bg-white/5"
              }`}
              data-ocid={`foundry-lite.forgeai_filter.${f.toLowerCase().replace(" ", "-")}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Flame className="w-3 h-3 text-orange-400 intelligence-pulse" />
          Updated{" "}
          {minsAgo === 0
            ? "just now"
            : `${minsAgo} min${minsAgo > 1 ? "s" : ""} ago`}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}

function MessagesTab({
  navigate,
}: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="cf-card rounded-xl overflow-hidden">
        {MOCK_MESSAGES.map((msg, i) => (
          <div
            key={msg.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-white/[0.03] transition-colors"
            data-ocid={`foundry-lite.message.item.${i + 1}`}
          >
            <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-orange-400">
                {msg.from[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{msg.from}</p>
                <span className="text-xs text-muted-foreground">
                  {msg.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {msg.preview}
              </p>
            </div>
            {msg.unread > 0 && (
              <Badge className="bg-orange-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                {msg.unread}
              </Badge>
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button
          variant="outline"
          className="border-orange-500/40 text-orange-400 hover:bg-orange-500/10"
          onClick={() => navigate({ to: "/messages" })}
          data-ocid="foundry-lite.open_messaging_button"
        >
          <MessageSquare className="w-4 h-4 mr-2" /> Open Messaging
        </Button>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
const TABS = [
  { id: "workspace", label: "My Workspace" },
  { id: "accounts", label: "Accounts" },
  { id: "pipeline", label: "Pipeline" },
  { id: "renewals", label: "Renewals" },
  { id: "tasks", label: "Tasks & Callbacks" },
  { id: "reports", label: "Reports" },
  { id: "forgeai", label: "ForgeAI" },
  { id: "messages", label: "Messages" },
];

export default function FoundryLite() {
  const { userProfile } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem("cf_fl_tab") ?? "workspace";
    } catch {
      return "workspace";
    }
  });
  const role = userProfile?.role ?? "End User";

  return (
    <div className="flex flex-col h-full" data-ocid="foundry-lite.page">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-orange-400" />
          <h1 className="text-xl font-semibold font-display">Foundry Lite</h1>
          <span className="text-xs bg-orange-500/15 text-orange-400 rounded px-2 py-0.5 font-medium">
            {role}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400 intelligence-pulse" />
          <span className="text-xs text-muted-foreground">ForgeAI Active</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-6 py-2 border-b border-border overflow-x-auto bg-card/50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              try {
                localStorage.setItem("cf_fl_tab", tab.id);
              } catch {
                /* noop */
              }
            }}
            className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-orange-500/15 text-orange-400 font-medium"
                : "text-muted-foreground hover:bg-white/5"
            }`}
            data-ocid={`foundry-lite.${tab.id}_tab`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "workspace" && <WorkspaceTab role={role} />}
        {activeTab === "accounts" && <AccountsTab />}
        {activeTab === "pipeline" && <PipelineTab />}
        {activeTab === "renewals" && <RenewalsTab />}
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "reports" && <ReportsTab navigate={navigate} />}
        {activeTab === "forgeai" && <ForgeAITab />}
        {activeTab === "messages" && <MessagesTab navigate={navigate} />}
      </div>
    </div>
  );
}
