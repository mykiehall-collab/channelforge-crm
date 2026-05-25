import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ArrowUpCircle,
  BadgeCheck,
  BarChart2,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  FileText,
  FileX,
  Flame,
  Gauge,
  GitBranch,
  Globe,
  Handshake,
  Heart,
  Inbox,
  Key,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Link2,
  ListChecks,
  Lock,
  Mail,
  Map as MapIcon,
  MapPin,
  Megaphone,
  Merge,
  MessageCircle,
  MessageSquare,
  Minus,
  Network,
  Package,
  Percent,
  Phone,
  Plus,
  PlusCircle,
  RefreshCcw,
  RefreshCw,
  ScanSearch,
  ScrollText,
  Search,
  Send,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Target,
  ThumbsUp,
  Timer,
  TrendingDown,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import type { Account } from "../backend";
import type { DealRegistration } from "../backend";
import { AccountStatus, DealStatus, UserRole } from "../backend";
import { AccountSearchBar } from "../components/AccountSearchBar";
import { CreditUsageInsightsWidget } from "../components/CreditUsageInsightsWidget";
import { DashboardCalendarWidget } from "../components/DashboardCalendarWidget";
import { useFilterContext } from "../contexts/FilterContext";
import { useActor } from "../hooks/useActor";
import { useKPIGovernance } from "../hooks/useKPIGovernance";
import useProgressiveRefresh from "../hooks/useProgressiveRefresh";
import { formatCurrency } from "../utils/channelforge";
import {
  ROLE_QUICK_ACTIONS,
  ROLE_WORKFLOWS,
} from "../utils/roleIntelligenceEngine";
import { IS_TEST_MODE } from "../utils/testMode";

// ─── Types ──────────────────────────────────────────────────────────────────
type DateRange = "today" | "week" | "month" | "quarter";

interface Priority {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  count: number;
  description: string;
  href: string;
  urgency: "high" | "medium" | "low";
}

interface KpiTile {
  title: string;
  value: string;
  trend: number;
  sparkline: number[];
}

interface ActivityEvent {
  id: string;
  account: string;
  action: string;
  time: string;
  dot: "orange" | "green" | "blue" | "muted";
}

interface InsightCard {
  priority: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatToday(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysUntilRenewal(ns: bigint): number {
  return (Number(ns) / 1_000_000 - Date.now()) / 86_400_000;
}

// ─── Role Key Resolution ─────────────────────────────────────────────────────
type RoleKey =
  | "salesRep"
  | "accountManager"
  | "renewalSpecialist"
  | "bdr"
  | "salesManager"
  | "regionalDirector"
  | "salesOps"
  | "dealDesk"
  | "marketing"
  | "customerSuccess"
  | "finance"
  | "itOperations"
  | "securityAdmin"
  | "leadership"
  | "partnerMarketing"
  | "channelAccountManager"
  | "channelSalesManager"
  | "channelDirector";

function resolveRoleKey(role: string | undefined): RoleKey {
  const map: Record<string, RoleKey> = {
    salesRep: "salesRep",
    "sales-rep": "salesRep",
    "Sales Representative": "salesRep",
    accountManager: "accountManager",
    "account-manager": "accountManager",
    "Account Manager": "accountManager",
    renewalSpecialist: "renewalSpecialist",
    "renewal-specialist": "renewalSpecialist",
    "Renewal Specialist": "renewalSpecialist",
    bdr: "bdr",
    BDR: "bdr",
    "Business Development Representative": "bdr",
    salesManager: "salesManager",
    "sales-manager": "salesManager",
    "Sales Manager": "salesManager",
    regionalDirector: "regionalDirector",
    "regional-director": "regionalDirector",
    "Regional Director": "regionalDirector",
    salesOps: "salesOps",
    "sales-ops": "salesOps",
    "Sales Operations": "salesOps",
    dealDesk: "dealDesk",
    "deal-desk": "dealDesk",
    "Deal Desk": "dealDesk",
    marketing: "marketing",
    Marketing: "marketing",
    "Marketing Manager": "marketing",
    partnerMarketing: "partnerMarketing",
    "partner-marketing": "partnerMarketing",
    "Partner Marketing": "partnerMarketing",
    customerSuccess: "customerSuccess",
    "customer-success": "customerSuccess",
    "Customer Success": "customerSuccess",
    finance: "finance",
    Finance: "finance",
    itOperations: "itOperations",
    "it-operations": "itOperations",
    "IT Operations": "itOperations",
    securityAdmin: "securityAdmin",
    "security-admin": "securityAdmin",
    "Security Admin": "securityAdmin",
    leadership: "leadership",
    Leadership: "leadership",
    channelAccountManager: "channelAccountManager",
    "channel-account-manager": "channelAccountManager",
    "Channel Account Manager": "channelAccountManager",
    channelSalesManager: "channelSalesManager",
    "channel-sales-manager": "channelSalesManager",
    "Channel Sales Manager": "channelSalesManager",
    channelDirector: "channelDirector",
    "channel-director": "channelDirector",
    "Channel Director": "channelDirector",
  };
  return map[role ?? ""] ?? "leadership";
}

// ─── Role KPI Tiles ──────────────────────────────────────────────────────────
const ROLE_KPI_TILES: Record<
  RoleKey,
  Array<{
    icon: React.ElementType;
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    color: string;
  }>
> = {
  salesRep: [
    {
      icon: TrendingUp,
      label: "Pipeline Value",
      value: "£2.4M",
      change: "+12%",
      trend: "up",
      color: "blue",
    },
    {
      icon: RefreshCcw,
      label: "Renewals Due",
      value: "8",
      change: "+2",
      trend: "up",
      color: "green",
    },
    {
      icon: Phone,
      label: "Overdue Callbacks",
      value: "3",
      change: "-1",
      trend: "down",
      color: "amber",
    },
    {
      icon: AlertTriangle,
      label: "High-Risk Accounts",
      value: "2",
      change: "0",
      trend: "neutral",
      color: "red",
    },
  ],
  accountManager: [
    {
      icon: Activity,
      label: "Account Health",
      value: "87%",
      change: "+3%",
      trend: "up",
      color: "blue",
    },
    {
      icon: Target,
      label: "Open Opportunities",
      value: "12",
      change: "+4",
      trend: "up",
      color: "green",
    },
    {
      icon: RefreshCcw,
      label: "Renewal Value",
      value: "£1.8M",
      change: "-5%",
      trend: "down",
      color: "amber",
    },
    {
      icon: AlertCircle,
      label: "Engagement Gaps",
      value: "3",
      change: "-1",
      trend: "down",
      color: "red",
    },
  ],
  renewalSpecialist: [
    {
      icon: RefreshCcw,
      label: "Renewals Due Q",
      value: "24",
      change: "+6",
      trend: "up",
      color: "amber",
    },
    {
      icon: AlertTriangle,
      label: "Value at Risk",
      value: "£680K",
      change: "+8%",
      trend: "up",
      color: "red",
    },
    {
      icon: Clock,
      label: "Overdue Renewals",
      value: "5",
      change: "+2",
      trend: "up",
      color: "orange",
    },
    {
      icon: TrendingDown,
      label: "Churn Risk",
      value: "7%",
      change: "-2%",
      trend: "down",
      color: "green",
    },
  ],
  bdr: [
    {
      icon: Users,
      label: "Prospects Contacted",
      value: "47",
      change: "+12",
      trend: "up",
      color: "blue",
    },
    {
      icon: Calendar,
      label: "Meetings Set",
      value: "8",
      change: "+3",
      trend: "up",
      color: "green",
    },
    {
      icon: Activity,
      label: "Sequences Active",
      value: "6",
      change: "0",
      trend: "neutral",
      color: "purple",
    },
    {
      icon: MessageSquare,
      label: "Response Rate",
      value: "18%",
      change: "+4%",
      trend: "up",
      color: "cyan",
    },
  ],
  salesManager: [
    {
      icon: TrendingUp,
      label: "Team Attainment",
      value: "76%",
      change: "-4%",
      trend: "down",
      color: "orange",
    },
    {
      icon: BarChart2,
      label: "Pipeline Gap",
      value: "£420K",
      change: "+8%",
      trend: "up",
      color: "red",
    },
    {
      icon: Target,
      label: "Forecast vs Target",
      value: "84%",
      change: "-6%",
      trend: "down",
      color: "amber",
    },
    {
      icon: AlertCircle,
      label: "Open Escalations",
      value: "3",
      change: "+1",
      trend: "up",
      color: "yellow",
    },
  ],
  regionalDirector: [
    {
      icon: DollarSign,
      label: "QTD Revenue",
      value: "£4.2M",
      change: "+18%",
      trend: "up",
      color: "green",
    },
    {
      icon: TrendingUp,
      label: "YoY Growth",
      value: "22%",
      change: "+3%",
      trend: "up",
      color: "blue",
    },
    {
      icon: Target,
      label: "Forecast Accuracy",
      value: "87%",
      change: "-2%",
      trend: "down",
      color: "teal",
    },
    {
      icon: Activity,
      label: "Ecosystem Health",
      value: "79%",
      change: "+5%",
      trend: "up",
      color: "purple",
    },
  ],
  salesOps: [
    {
      icon: Clock,
      label: "Avg Sales Cycle",
      value: "42 days",
      change: "-3d",
      trend: "down",
      color: "blue",
    },
    {
      icon: Zap,
      label: "Quote Turnaround",
      value: "2.1 days",
      change: "-0.4d",
      trend: "down",
      color: "green",
    },
    {
      icon: MapPin,
      label: "Allocation Gaps",
      value: "4",
      change: "+1",
      trend: "up",
      color: "amber",
    },
    {
      icon: CheckCircle2,
      label: "Pipeline Hygiene",
      value: "81%",
      change: "+7%",
      trend: "up",
      color: "teal",
    },
  ],
  dealDesk: [
    {
      icon: Clock,
      label: "Pending Approvals",
      value: "9",
      change: "+3",
      trend: "up",
      color: "orange",
    },
    {
      icon: Zap,
      label: "Avg Approval Time",
      value: "1.8 days",
      change: "-0.2d",
      trend: "down",
      color: "green",
    },
    {
      icon: AlertTriangle,
      label: "SLA Breaches",
      value: "2",
      change: "-1",
      trend: "down",
      color: "red",
    },
    {
      icon: DollarSign,
      label: "Pricing Exceptions",
      value: "5",
      change: "+2",
      trend: "up",
      color: "amber",
    },
  ],
  marketing: [
    {
      icon: BarChart2,
      label: "Campaign Engagement",
      value: "34%",
      change: "+8%",
      trend: "up",
      color: "purple",
    },
    {
      icon: DollarSign,
      label: "MDF ROI",
      value: "2.4x",
      change: "+0.3x",
      trend: "up",
      color: "green",
    },
    {
      icon: Download,
      label: "Content Downloads",
      value: "847",
      change: "+120",
      trend: "up",
      color: "cyan",
    },
    {
      icon: Users,
      label: "Reseller Participation",
      value: "62%",
      change: "+7%",
      trend: "up",
      color: "blue",
    },
  ],
  customerSuccess: [
    {
      icon: Activity,
      label: "Health Score Avg",
      value: "74%",
      change: "+5%",
      trend: "up",
      color: "green",
    },
    {
      icon: CheckCircle2,
      label: "Onboarding Active",
      value: "6",
      change: "+2",
      trend: "up",
      color: "blue",
    },
    {
      icon: TrendingUp,
      label: "Adoption Score",
      value: "68%",
      change: "+3%",
      trend: "up",
      color: "amber",
    },
    {
      icon: RefreshCcw,
      label: "Renewal Readiness",
      value: "71%",
      change: "-4%",
      trend: "down",
      color: "teal",
    },
  ],
  finance: [
    {
      icon: TrendingDown,
      label: "Credit Burn Rate",
      value: "2.4%/day",
      change: "+0.2%",
      trend: "up",
      color: "red",
    },
    {
      icon: Clock,
      label: "Projected Depletion",
      value: "38 days",
      change: "-5d",
      trend: "down",
      color: "orange",
    },
    {
      icon: DollarSign,
      label: "Renewal Revenue",
      value: "£3.1M",
      change: "+12%",
      trend: "up",
      color: "green",
    },
    {
      icon: Server,
      label: "Infrastructure Cost",
      value: "£4.2K/mo",
      change: "+8%",
      trend: "up",
      color: "blue",
    },
  ],
  itOperations: [
    {
      icon: AlertCircle,
      label: "Open System Issues",
      value: "3",
      change: "-2",
      trend: "down",
      color: "green",
    },
    {
      icon: CheckCircle2,
      label: "Case SLA",
      value: "94%",
      change: "+2%",
      trend: "up",
      color: "blue",
    },
    {
      icon: AlertTriangle,
      label: "Failed Imports",
      value: "2",
      change: "-1",
      trend: "down",
      color: "amber",
    },
    {
      icon: Activity,
      label: "Integration Sync",
      value: "OK",
      change: "healthy",
      trend: "neutral",
      color: "cyan",
    },
  ],
  securityAdmin: [
    {
      icon: Shield,
      label: "Access Anomalies",
      value: "1",
      change: "-2",
      trend: "down",
      color: "green",
    },
    {
      icon: Lock,
      label: "MFA Coverage",
      value: "96%",
      change: "+3%",
      trend: "up",
      color: "blue",
    },
    {
      icon: Clock,
      label: "Pending Reviews",
      value: "4",
      change: "-1",
      trend: "down",
      color: "amber",
    },
    {
      icon: Activity,
      label: "SSO Health",
      value: "Good",
      change: "stable",
      trend: "neutral",
      color: "red",
    },
  ],
  leadership: [
    {
      icon: DollarSign,
      label: "QTD vs Target",
      value: "87%",
      change: "+3%",
      trend: "up",
      color: "green",
    },
    {
      icon: TrendingUp,
      label: "YoY Growth",
      value: "22%",
      change: "+5%",
      trend: "up",
      color: "blue",
    },
    {
      icon: Target,
      label: "Forecast Accuracy",
      value: "84%",
      change: "-2%",
      trend: "down",
      color: "teal",
    },
    {
      icon: Activity,
      label: "Ecosystem Health",
      value: "79%",
      change: "+4%",
      trend: "up",
      color: "purple",
    },
  ],
  partnerMarketing: [
    {
      icon: Megaphone,
      label: "Active Campaigns",
      value: "6",
      change: "+2",
      trend: "up",
      color: "purple",
    },
    {
      icon: DollarSign,
      label: "MDF Utilisation",
      value: "68%",
      change: "+12%",
      trend: "up",
      color: "green",
    },
    {
      icon: Download,
      label: "Asset Downloads",
      value: "1,240",
      change: "+180",
      trend: "up",
      color: "blue",
    },
    {
      icon: Users,
      label: "Partner Engagement",
      value: "74%",
      change: "+8%",
      trend: "up",
      color: "cyan",
    },
  ],
  channelAccountManager: [
    {
      icon: TrendingUp,
      label: "Distributor Growth",
      value: "+14%",
      change: "+3%",
      trend: "up",
      color: "blue",
    },
    {
      icon: TrendingUp,
      label: "Reseller Growth",
      value: "+9%",
      change: "+1%",
      trend: "up",
      color: "green",
    },
    {
      icon: BarChart3,
      label: "Ecosystem Pipeline",
      value: "£8.4M",
      change: "+6%",
      trend: "up",
      color: "purple",
    },
    {
      icon: Activity,
      label: "Partner Engagement",
      value: "72%",
      change: "-4%",
      trend: "down",
      color: "amber",
    },
    {
      icon: DollarSign,
      label: "Partner-Led Revenue",
      value: "£3.2M",
      change: "+11%",
      trend: "up",
      color: "green",
    },
    {
      icon: Users,
      label: "Active Partners",
      value: "47",
      change: "+3",
      trend: "up",
      color: "blue",
    },
    {
      icon: Zap,
      label: "Partner Activation",
      value: "68%",
      change: "+5%",
      trend: "up",
      color: "cyan",
    },
    {
      icon: Target,
      label: "MDF Utilization",
      value: "61%",
      change: "-8%",
      trend: "down",
      color: "orange",
    },
    {
      icon: Megaphone,
      label: "Campaign Participation",
      value: "54%",
      change: "+2%",
      trend: "up",
      color: "purple",
    },
    {
      icon: Heart,
      label: "Partner Retention",
      value: "91%",
      change: "+1%",
      trend: "up",
      color: "green",
    },
    {
      icon: RefreshCcw,
      label: "Renewal Health",
      value: "84%",
      change: "-2%",
      trend: "down",
      color: "amber",
    },
    {
      icon: BarChart2,
      label: "QoQ Pipeline Growth",
      value: "+7%",
      change: "+2%",
      trend: "up",
      color: "blue",
    },
  ],
  channelSalesManager: [
    {
      icon: Target,
      label: "CAM Attainment",
      value: "78%",
      change: "-4%",
      trend: "down",
      color: "amber",
    },
    {
      icon: TrendingUp,
      label: "Distributor Growth",
      value: "+12%",
      change: "+2%",
      trend: "up",
      color: "blue",
    },
    {
      icon: Activity,
      label: "Reseller Performance",
      value: "74/100",
      change: "-3",
      trend: "down",
      color: "amber",
    },
    {
      icon: MapPin,
      label: "Territory Health",
      value: "71/100",
      change: "-5",
      trend: "down",
      color: "red",
    },
    {
      icon: BarChart3,
      label: "Ecosystem Forecast",
      value: "£11.2M",
      change: "+5%",
      trend: "up",
      color: "purple",
    },
    {
      icon: TrendingUp,
      label: "YoY Growth",
      value: "+18%",
      change: "+3%",
      trend: "up",
      color: "green",
    },
    {
      icon: BarChart2,
      label: "QoQ Growth",
      value: "+6%",
      change: "-2%",
      trend: "down",
      color: "amber",
    },
    {
      icon: RefreshCcw,
      label: "Renewal Performance",
      value: "82%",
      change: "+4%",
      trend: "up",
      color: "green",
    },
    {
      icon: Gauge,
      label: "Forecast Accuracy",
      value: "79%",
      change: "-3%",
      trend: "down",
      color: "orange",
    },
    {
      icon: Target,
      label: "Target Attainment",
      value: "81%",
      change: "-2%",
      trend: "down",
      color: "amber",
    },
    {
      icon: LineChart,
      label: "Pipeline Coverage",
      value: "3.2x",
      change: "+0.1x",
      trend: "up",
      color: "blue",
    },
  ],
  channelDirector: [
    {
      icon: TrendingUp,
      label: "YoY Ecosystem Growth",
      value: "+18%",
      change: "+3%",
      trend: "up",
      color: "green",
    },
    {
      icon: BarChart2,
      label: "QoQ Performance",
      value: "+6%",
      change: "-2%",
      trend: "down",
      color: "amber",
    },
    {
      icon: Target,
      label: "Target Attainment",
      value: "81%",
      change: "-2%",
      trend: "down",
      color: "amber",
    },
    {
      icon: DollarSign,
      label: "Ecosystem Profitability",
      value: "£4.7M",
      change: "+9%",
      trend: "up",
      color: "green",
    },
    {
      icon: Activity,
      label: "Distributor Health",
      value: "76/100",
      change: "-4",
      trend: "down",
      color: "amber",
    },
    {
      icon: TrendingUp,
      label: "Reseller Growth",
      value: "+9%",
      change: "+1%",
      trend: "up",
      color: "blue",
    },
    {
      icon: RefreshCcw,
      label: "Renewal Forecast",
      value: "£8.2M",
      change: "+5%",
      trend: "up",
      color: "green",
    },
    {
      icon: MapPin,
      label: "Territory Performance",
      value: "71/100",
      change: "-5",
      trend: "down",
      color: "red",
    },
    {
      icon: AlertTriangle,
      label: "Strategic Risk Index",
      value: "Medium",
      change: "+1",
      trend: "up",
      color: "orange",
    },
    {
      icon: Users,
      label: "CAM Performance",
      value: "78%",
      change: "-4%",
      trend: "down",
      color: "amber",
    },
    {
      icon: Gauge,
      label: "Regional Forecast Accuracy",
      value: "79%",
      change: "-3%",
      trend: "down",
      color: "orange",
    },
  ],
};

// ─── Role Insights ───────────────────────────────────────────────────────────
const ROLE_INSIGHTS: Record<RoleKey, string[]> = {
  salesRep: [
    "Pipeline velocity slowing in Tier 2 accounts — 3 opportunities stalled for 14+ days.",
    "Renewal due for Nordic Energy Group in 45 days — no quote generated yet.",
    "Callback overdue for Desperado Ltd — last contact was 12 days ago.",
  ],
  accountManager: [
    "Account engagement declining for 2 strategic accounts this quarter.",
    "Renewal value at risk increased 5% — stakeholder mapping recommended.",
    "Expansion opportunity detected for Adobe account based on product usage.",
  ],
  renewalSpecialist: [
    "£680K renewal value at risk this quarter — 5 contracts approaching expiry.",
    "Renewal conversion rate below benchmark in Nordics territory.",
    "Customer has no renewal quote generated — engagement gap detected.",
  ],
  bdr: [
    "12 target accounts showing inactivity — outreach sequence recommended.",
    "Meeting conversion rate improved 4% month-over-month.",
    "Response rate below benchmark for APAC region — adjust messaging cadence.",
  ],
  salesManager: [
    "Team pipeline gap of £420K detected against quarterly target.",
    "Forecast accuracy declined 6% — review opportunity stage hygiene.",
    "2 reps below 60% attainment — coaching intervention recommended.",
  ],
  regionalDirector: [
    "EMEA forecast trending 6% below YoY growth plan.",
    "Distributor performance improved in Tier 1 regions this quarter.",
    "Renewal risk concentrated in three strategic accounts — executive review needed.",
  ],
  salesOps: [
    "Pipeline aging increased in Tier 2 territories — hygiene review recommended.",
    "Account allocation conflict detected for 2 accounts in North EMEA.",
    "Quote turnaround improved 12% QoQ — positive efficiency trend.",
  ],
  dealDesk: [
    "Deal approval has exceeded SLA for 2 pending registrations.",
    "Quote margin below threshold detected — review before approval.",
    "Duplicate deal registration risk flagged for Ingram Micro opportunity.",
  ],
  marketing: [
    "MDF activity underutilised in Nordics — 38% of budget unallocated.",
    "Campaign downloads increased 22% QoQ — asset momentum strong.",
    "Reseller participation low for current demand-gen campaign.",
  ],
  customerSuccess: [
    "Customer adoption declining for 2 accounts — intervention recommended.",
    "No engagement recorded for TechNova Ltd in 21 days.",
    "Renewal readiness low for 3 accounts approaching contract end.",
  ],
  finance: [
    "AI usage increased 38% month-over-month — monitor burn acceleration.",
    "Credit depletion forecast moved forward by 12 days at current rate.",
    "Renewal revenue at risk increased this quarter — commercial review needed.",
  ],
  itOperations: [
    "CSV import failures increased this week — 2 imports require investigation.",
    "Integration sync delayed for CRM connector — last sync 6 hours ago.",
    "Access conflict detected for 3 users — review pending in governance queue.",
  ],
  securityAdmin: [
    "Access anomaly detected for 1 user account — review recommended.",
    "MFA coverage at 96% — 4 users without MFA enforcement.",
    "SSO health stable — no authentication failures in last 24 hours.",
  ],
  leadership: [
    "EMEA forecast 6% below YoY growth plan — territory review recommended.",
    "Distributor performance improving in Tier 1 regions this quarter.",
    "Renewal risk concentrated in three strategic accounts.",
  ],
  partnerMarketing: [
    "Partner campaign engagement up 8% — momentum building in EMEA.",
    "MDF utilisation at 68% — accelerate spend before quarter end.",
    "Asset downloads increased 180 this month — top content performing well.",
  ],
  channelAccountManager: [
    "Crayon Nordics pipeline down 8% QoQ — engagement plan needed.",
    "ATEA renewal activity increased 14% — capitalise on momentum.",
    "Reseller engagement low in UK Tier 1 territory.",
    "Distributor campaign adoption below forecast — MDF reallocation opportunity.",
  ],
  channelSalesManager: [
    "Nordics ecosystem forecast trending 12% below target.",
    "Three CAM territories showing declining reseller activity.",
    "Renewal risk concentrated in DACH region.",
    "CAM attainment across team at 78% — two territories at risk.",
  ],
  channelDirector: [
    "EMEA forecast now 6% below YoY plan — board-level attention required.",
    "Tier 1 territories outperforming Tier 2 by 18%.",
    "Distributor concentration risk increasing.",
    "Renewal exposure elevated across strategic healthcare accounts.",
  ],
};

const _ROLE_WIDGET_ORDER: Record<RoleKey, string[]> = {
  salesRep: ["kpi-tiles", "quick-actions", "priorities", "insights"],
  accountManager: ["kpi-tiles", "quick-actions", "priorities", "insights"],
  bdr: ["quick-actions", "kpi-tiles", "priorities", "insights"],
  renewalSpecialist: ["priorities", "kpi-tiles", "quick-actions", "insights"],
  customerSuccess: ["kpi-tiles", "quick-actions", "priorities", "insights"],
  salesManager: ["kpi-tiles", "priorities", "quick-actions", "insights"],
  regionalDirector: ["kpi-tiles", "priorities", "quick-actions", "insights"],
  salesOps: ["quick-actions", "kpi-tiles", "priorities", "insights"],
  dealDesk: ["priorities", "quick-actions", "kpi-tiles", "insights"],
  marketing: ["kpi-tiles", "quick-actions", "priorities", "insights"],
  partnerMarketing: ["kpi-tiles", "quick-actions", "priorities", "insights"],
  finance: ["kpi-tiles", "priorities", "quick-actions", "insights"],
  itOperations: ["priorities", "kpi-tiles", "quick-actions", "insights"],
  securityAdmin: ["priorities", "kpi-tiles", "quick-actions", "insights"],
  leadership: ["kpi-tiles", "insights", "priorities", "quick-actions"],
  channelAccountManager: [
    "kpi-tiles",
    "quick-actions",
    "priorities",
    "insights",
  ],
  channelSalesManager: ["kpi-tiles", "priorities", "quick-actions", "insights"],
  channelDirector: ["kpi-tiles", "insights", "priorities", "quick-actions"],
};

const QUICK_ACTION_ICON_MAP: Record<string, React.ElementType> = {
  Plus,
  PlusCircle,
  FileText,
  CalendarPlus,
  CalendarCheck,
  CalendarDays: CalendarCheck,
  Phone,
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  BarChart2,
  BarChart3,
  Upload,
  Settings,
  Shield,
  ShieldCheck: Shield,
  ShieldAlert: AlertTriangle,
  AlertTriangle,
  AlertOctagon,
  AlertCircle: AlertTriangle,
  RefreshCcw,
  RefreshCw,
  CheckSquare,
  CheckCircle2,
  MessageSquare,
  MessageCircle,
  Target,
  Search,
  ScanSearch,
  Briefcase,
  DollarSign,
  Activity,
  BookOpen,
  Link2,
  Send,
  ArrowUpCircle,
  ListChecks,
  GitBranch,
  LineChart,
  MapPin,
  MapIcon,
  Map: MapIcon,
  Shuffle,
  Merge,
  Gauge,
  Inbox,
  BadgeCheck,
  Percent,
  Timer,
  ThumbsUp,
  Megaphone: Bell,
  Wallet,
  Handshake: Users,
  CreditCard,
  Server,
  Download: ArrowUpCircle,
  FileX,
  KeyRound,
  ScrollText,
  Bell,
  LayoutDashboard,
  Network,
  Heart,
  Zap,
  HeartPulse: Heart,
  PlugZap: Zap,
  ClipboardList: FileText,
};

function QuickActionsRow({ roleKey }: { roleKey: RoleKey }) {
  const actions =
    ROLE_QUICK_ACTIONS[roleKey as keyof typeof ROLE_QUICK_ACTIONS] ?? [];
  return (
    <div className="mb-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Quick Actions
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const IconComp = (QUICK_ACTION_ICON_MAP[action.icon] ??
            Plus) as React.ElementType;
          return (
            <a
              key={action.label}
              href={action.href}
              className="bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-foreground hover:bg-[var(--hover-bg)] hover:border-orange-500/40 transition-colors no-underline"
            >
              <IconComp size={14} className="shrink-0" />
              <span>{action.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function RoleWorkflowBanner({ roleKey }: { roleKey: RoleKey }) {
  const workflow = ROLE_WORKFLOWS[roleKey as keyof typeof ROLE_WORKFLOWS];
  if (!workflow) return null;
  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#0a1628]/80 border border-white/10 px-4 py-3">
      <Briefcase size={15} className="text-orange-400 shrink-0" />
      <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-400 mr-1 shrink-0">
        Today&apos;s Focus:
      </span>
      <span className="text-sm text-slate-200 leading-snug">
        {workflow.dailyFocus}
      </span>
    </div>
  );
}

// ─── Role playbook config ───────────────────────────────────────────────────
interface PlaybookConfig {
  name: string;
  color: string;
}

function getPlaybook(role: UserRole): PlaybookConfig | null {
  const rs = String(role).toLowerCase();
  if (rs.includes("sales rep") || rs.includes("reseller sales")) {
    return { name: "Pipeline Progression Playbook", color: "orange" };
  }
  if (rs.includes("account manager")) {
    return { name: "Strategic Account Playbook", color: "blue" };
  }
  if (rs.includes("renewal")) {
    return { name: "Renewal Recovery Playbook", color: "amber" };
  }
  if (rs.includes("bdr")) {
    return { name: "Prospecting Playbook", color: "teal" };
  }
  if (rs.includes("sales manager")) {
    return { name: "Territory Review Playbook", color: "indigo" };
  }
  if (
    rs.includes("regional director") ||
    rs.includes("leadership") ||
    rs.includes("vendor primary") ||
    rs.includes("vendor admin")
  ) {
    return { name: "Executive Intelligence Playbook", color: "purple" };
  }
  if (rs.includes("partner marketing")) {
    return { name: "Partner Engagement Playbook", color: "pink" };
  }
  if (rs.includes("marketing")) {
    return { name: "Partner Engagement Playbook", color: "pink" };
  }
  if (rs.includes("sales ops")) {
    return { name: "Operational Governance Playbook", color: "slate" };
  }
  if (rs.includes("deal desk")) {
    return { name: "Deal Approval Playbook", color: "yellow" };
  }
  if (rs.includes("customer success")) {
    return { name: "Customer Health Playbook", color: "green" };
  }
  if (rs.includes("finance")) {
    return { name: "Operational Spend Playbook", color: "emerald" };
  }
  if (
    rs.includes("security") ||
    rs.includes("it operations") ||
    rs.includes("it ops")
  ) {
    return { name: "Infrastructure Governance Playbook", color: "red" };
  }
  if (rs.includes("distributor")) {
    return { name: "Channel Enablement Playbook", color: "cyan" };
  }
  if (rs.includes("reseller")) {
    return { name: "Pipeline Progression Playbook", color: "orange" };
  }
  return null;
}

// ─── Role-based data ─────────────────────────────────────────────────────────
function getPriorities(
  role: UserRole,
  accounts: Account[],
  dealRegs: DealRegistration[],
): Priority[] {
  const isVendorRole =
    role === UserRole.VendorPrimaryAdmin ||
    role === UserRole.VendorAdmin ||
    role === UserRole.VendorSecondaryAdmin;
  const isDistributorRole =
    role === UserRole.DistributorPrimaryAdmin ||
    role === UserRole.DistributorSalesUser ||
    role === UserRole.DistributorSecondaryAdmin;
  const isResellerAdminRole =
    role === UserRole.ResellerPrimaryAdmin || role === UserRole.ResellerAdmin;
  const isResellerSalesRole = role === UserRole.ResellerSalesUser;
  const roleStr = String(role).toLowerCase();
  const isAccountManager = roleStr.includes("account manager");
  const isRenewalSpecialist = roleStr.includes("renewal");
  const isDealDesk = roleStr.includes("deal desk");
  const isCustomerSuccess = roleStr.includes("customer success");
  const isFinance = roleStr.includes("finance");
  const isBdr = roleStr.includes("bdr");
  const isSalesManager = roleStr.includes("sales manager");
  const isRegionalDirector = roleStr.includes("regional director");
  const isPartnerMarketing = roleStr.includes("partner marketing");
  const isSecurityAdmin = roleStr.includes("security");
  const isItOps =
    roleStr.includes("it operations") || roleStr.includes("it ops");
  const isSalesRep = roleStr.includes("sales rep");
  const isSalesOps = roleStr.includes("sales ops");
  const isMarketing = roleStr.includes("marketing") && !isPartnerMarketing;
  const isLeadership = roleStr.includes("leadership");

  const renewalsDue = accounts.filter(
    (a) =>
      daysUntilRenewal(a.renewalDate) <= 30 &&
      daysUntilRenewal(a.renewalDate) > 0,
  ).length;
  const highRisk = accounts.filter(
    (a) =>
      a.status === AccountStatus.AtRisk || a.status === AccountStatus.Churned,
  ).length;
  const pendingDeals = dealRegs.filter(
    (d) =>
      d.status === DealStatus.Submitted || d.status === DealStatus.UnderReview,
  ).length;

  if (isVendorRole) {
    return [
      {
        icon: RefreshCcw,
        title: "Renewals Due",
        count: renewalsDue || 4,
        description: "Accounts expiring within 30 days",
        href: "/renewals",
        urgency: "high",
      },
      {
        icon: ShieldAlert,
        title: "High-Risk Accounts",
        count: highRisk || 7,
        description: "Accounts with declining health scores",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: TrendingDown,
        title: "Stalled Opportunities",
        count: 3,
        description: "Deals with no activity in 14+ days",
        href: "/opportunities",
        urgency: "medium",
      },
      {
        icon: Briefcase,
        title: "Pending Deal Regs",
        count: pendingDeals || 5,
        description: "Awaiting approval or review",
        href: "/deal-registrations",
        urgency: "medium",
      },
      {
        icon: Target,
        title: "Forecast Gap",
        count: 2,
        description: "Quarters below pipeline coverage threshold",
        href: "/reports",
        urgency: "low",
      },
    ];
  }
  if (isDistributorRole) {
    return [
      {
        icon: Handshake,
        title: "Vendor Relationship Actions",
        count: 2,
        description: "Pending vendor alignment tasks",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: MapPin,
        title: "Reseller Coverage Gaps",
        count: 5,
        description: "Territories with limited reseller coverage",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: FileText,
        title: "Regional MDF Actions",
        count: 3,
        description: "MDF requests requiring your attention",
        href: "/mdf-requests",
        urgency: "medium",
      },
      {
        icon: AlertTriangle,
        title: "Account Servicing Issues",
        count: 4,
        description: "Accounts needing immediate intervention",
        href: "/accounts",
        urgency: "medium",
      },
    ];
  }
  if (isResellerAdminRole) {
    return [
      {
        icon: RefreshCcw,
        title: "Customer Renewals Due",
        count: renewalsDue || 6,
        description: "Customer accounts expiring soon",
        href: "/renewals",
        urgency: "high",
      },
      {
        icon: Briefcase,
        title: "Deal Regs Pending",
        count: pendingDeals || 3,
        description: "Deal registrations awaiting approval",
        href: "/deal-registrations",
        urgency: "high",
      },
      {
        icon: TrendingDown,
        title: "Pipeline Gaps",
        count: 4,
        description: "Opportunity stages with low coverage",
        href: "/opportunities",
        urgency: "medium",
      },
      {
        icon: ShieldAlert,
        title: "Customer Health Alerts",
        count: highRisk || 2,
        description: "Accounts with declining engagement",
        href: "/accounts",
        urgency: "medium",
      },
    ];
  }
  if (isResellerSalesRole) {
    return [
      {
        icon: Users,
        title: "Accounts to Follow Up",
        count: 8,
        description: "Accounts with no recent activity",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: RefreshCcw,
        title: "Renewals This Week",
        count: renewalsDue || 3,
        description: "Upcoming renewal deadlines",
        href: "/renewals",
        urgency: "high",
      },
      {
        icon: ClipboardList,
        title: "Open Tasks",
        count: 11,
        description: "Tasks due today and this week",
        href: "/tasks",
        urgency: "medium",
      },
      {
        icon: Clock,
        title: "Callbacks Scheduled",
        count: 5,
        description: "Scheduled follow-up calls today",
        href: "/tasks",
        urgency: "low",
      },
    ];
  }
  if (isAccountManager) {
    return [
      {
        icon: AlertTriangle,
        title: "Nordic Energy Group renewal call overdue",
        count: 1,
        description: "High urgency — schedule now",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: Briefcase,
        title: "3 opportunities closing this quarter need updates",
        count: 3,
        description: "Update pipeline stages before quarter end",
        href: "/opportunities",
        urgency: "high",
      },
      {
        icon: TrendingDown,
        title: "Desperado engagement dropped 28% this week",
        count: 1,
        description: "Review account health and re-engage",
        href: "/accounts",
        urgency: "medium",
      },
      {
        icon: Brain,
        title: "ForgeAI: Upsell signal detected — Global Pharma Holdings",
        count: 1,
        description: "View AI insight and plan outreach",
        href: "/forge-ai",
        urgency: "medium",
      },
    ];
  }
  if (isRenewalSpecialist) {
    return [
      {
        icon: ShieldAlert,
        title: "Desperado renewal expires in 18 days — probability 61%",
        count: 1,
        description: "Critical — intervene now to prevent churn",
        href: "/renewals",
        urgency: "high",
      },
      {
        icon: AlertTriangle,
        title: "Nordic Energy Group at renewal risk — pricing objection logged",
        count: 1,
        description: "Escalate pricing concern to leadership",
        href: "/renewals",
        urgency: "high",
      },
      {
        icon: FileText,
        title: "UK Education Trust contract review overdue",
        count: 1,
        description: "Schedule review meeting this week",
        href: "/renewals",
        urgency: "high",
      },
      {
        icon: Brain,
        title: "ForgeAI: 2 renewals showing early churn signals",
        count: 2,
        description: "View AI insights and take preventive action",
        href: "/forge-ai",
        urgency: "medium",
      },
      {
        icon: Users,
        title: "3 renewals due next month not yet contacted",
        count: 3,
        description: "Start outreach for upcoming renewals",
        href: "/renewals",
        urgency: "medium",
      },
    ];
  }
  if (isDealDesk) {
    return [
      {
        icon: AlertTriangle,
        title: "4 pricing approvals have breached SLA",
        count: 4,
        description: "Critical — review now to meet targets",
        href: "/deal-registrations",
        urgency: "high",
      },
      {
        icon: Briefcase,
        title:
          "Deal registration: Horizon Manufacturing — discount requested 22%",
        count: 1,
        description: "Evaluate discount request against policy",
        href: "/deal-registrations",
        urgency: "high",
      },
      {
        icon: FileText,
        title: "Exception request: Nordic Energy Group — requires VP sign-off",
        count: 1,
        description: "Escalate exception to VP for approval",
        href: "/deal-registrations",
        urgency: "high",
      },
      {
        icon: Clock,
        title: "2 deal registrations expire in 48 hours",
        count: 2,
        description: "Validate registrations before expiration",
        href: "/deal-registrations",
        urgency: "medium",
      },
    ];
  }
  if (isCustomerSuccess) {
    return [
      {
        icon: AlertTriangle,
        title:
          "City Infrastructure Authority onboarding 12 days behind schedule",
        count: 1,
        description: "High urgency — intervene to get back on track",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: TrendingDown,
        title:
          "EuroRetail Group adoption score dropped to 42% — intervention needed",
        count: 1,
        description: "Schedule adoption review session",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: Users,
        title: "3 accounts showing declining product usage this month",
        count: 3,
        description: "Review accounts and plan engagement",
        href: "/accounts",
        urgency: "medium",
      },
      {
        icon: Brain,
        title:
          "ForgeAI: Expansion opportunity detected at Apex Financial Services",
        count: 1,
        description: "View AI insight and plan expansion outreach",
        href: "/forge-ai",
        urgency: "medium",
      },
      {
        icon: ShieldAlert,
        title: "Northern Telecom Networks health score fell below threshold",
        count: 1,
        description: "Conduct health check and document findings",
        href: "/accounts",
        urgency: "medium",
      },
    ];
  }
  if (isFinance) {
    return [
      {
        icon: TrendingDown,
        title: "Sales team credit overspend — 142% of monthly budget consumed",
        count: 1,
        description: "Review usage and adjust budgets",
        href: "/foundry",
        urgency: "high",
      },
      {
        icon: FileText,
        title: "Renewal revenue forecast gap: £500K below Q3 target",
        count: 1,
        description: "Review forecast and identify recovery actions",
        href: "/reports",
        urgency: "high",
      },
      {
        icon: Brain,
        title: "ForgeAI: 3 high-value renewals showing revenue risk signals",
        count: 3,
        description: "View AI insights on revenue at risk",
        href: "/forge-ai",
        urgency: "medium",
      },
      {
        icon: CalendarDays,
        title: "Monthly finance report due — data reconciliation needed",
        count: 1,
        description: "Generate report and reconcile data",
        href: "/reports",
        urgency: "medium",
      },
    ];
  }
  if (isBdr) {
    return [
      {
        icon: Phone,
        title: "18 target accounts with no outreach in 14+ days",
        count: 18,
        description: "Prioritise outreach to dormant target accounts",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: ClipboardList,
        title: "Follow-up tasks due today — 7 open",
        count: 7,
        description: "Complete scheduled follow-ups before end of day",
        href: "/tasks",
        urgency: "high",
      },
      {
        icon: Users,
        title: "5 inbound leads unqualified this week",
        count: 5,
        description: "Qualify new inbound leads and assign opportunities",
        href: "/opportunities",
        urgency: "medium",
      },
      {
        icon: Brain,
        title: "ForgeAI: 3 accounts flagged as high-propensity targets",
        count: 3,
        description: "AI-recommended accounts to prioritise this week",
        href: "/forge-ai",
        urgency: "medium",
      },
      {
        icon: Target,
        title: "Outreach sequence stalled — Horizon Manufacturing",
        count: 1,
        description: "Resume engagement before account goes cold",
        href: "/accounts",
        urgency: "low",
      },
    ];
  }
  if (isSalesManager) {
    return [
      {
        icon: AlertTriangle,
        title: "3 reps below 50% attainment — Q3 at risk",
        count: 3,
        description: "Review pipeline and provide targeted coaching",
        href: "/reports",
        urgency: "high",
      },
      {
        icon: TrendingDown,
        title: "Northern territory pipeline gap — £340K shortfall",
        count: 1,
        description: "Identify coverage actions to close pipeline gap",
        href: "/reports",
        urgency: "high",
      },
      {
        icon: Target,
        title: "Forecast coverage at 72% — below 90% threshold",
        count: 1,
        description: "Review stalled deals and accelerate where possible",
        href: "/opportunities",
        urgency: "medium",
      },
      {
        icon: Brain,
        title: "ForgeAI: 2 reps showing activity compliance risk",
        count: 2,
        description:
          "View AI performance insights and coaching recommendations",
        href: "/forge-ai",
        urgency: "medium",
      },
      {
        icon: Users,
        title: "Weekly team pipeline review — 4 updates needed",
        count: 4,
        description: "Request pipeline stage updates from team",
        href: "/opportunities",
        urgency: "low",
      },
    ];
  }
  if (isRegionalDirector) {
    return [
      {
        icon: TrendingDown,
        title: "EMEA region revenue 8% below Q3 forecast",
        count: 1,
        description: "Review strategic gaps and escalate recovery actions",
        href: "/reports",
        urgency: "high",
      },
      {
        icon: ShieldAlert,
        title: "Ecosystem health score dropped to 74 — intervention needed",
        count: 1,
        description:
          "Review partner performance and identify at-risk relationships",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: Brain,
        title: "ForgeAI: Executive summary — 3 key operational risks",
        count: 3,
        description: "Review AI-generated operational risk briefing",
        href: "/forge-ai",
        urgency: "medium",
      },
      {
        icon: FileText,
        title: "Quarterly board report data requires sign-off",
        count: 1,
        description: "Review and approve quarterly operational data",
        href: "/reports",
        urgency: "medium",
      },
      {
        icon: MapPin,
        title: "2 territory realignment proposals pending approval",
        count: 2,
        description: "Approve or adjust proposed territory boundaries",
        href: "/reports",
        urgency: "low",
      },
    ];
  }
  if (isPartnerMarketing) {
    return [
      {
        icon: Target,
        title: "4 reseller co-sell campaigns with low engagement",
        count: 4,
        description: "Review and optimise underperforming partner campaigns",
        href: "/campaigns",
        urgency: "high",
      },
      {
        icon: FileText,
        title: "MDF requests pending — 6 awaiting approval",
        count: 6,
        description: "Review and approve partner MDF requests",
        href: "/mdf-requests",
        urgency: "high",
      },
      {
        icon: Briefcase,
        title: "3 enablement content assets outdated",
        count: 3,
        description: "Refresh partner-facing enablement assets",
        href: "/campaigns",
        urgency: "medium",
      },
      {
        icon: Brain,
        title:
          "ForgeAI: 2 high-engagement partners ready for co-sell activation",
        count: 2,
        description:
          "Initiate partner engagement with top-performing resellers",
        href: "/forge-ai",
        urgency: "medium",
      },
      {
        icon: Users,
        title: "Partner enablement session — 8 resellers not yet enrolled",
        count: 8,
        description: "Invite remaining resellers to this quarter's programme",
        href: "/campaigns",
        urgency: "low",
      },
    ];
  }
  if (isSecurityAdmin) {
    return [
      {
        icon: ShieldAlert,
        title: "4 access anomalies detected in the last 24 hours",
        count: 4,
        description: "Review and investigate flagged access events",
        href: "/foundry",
        urgency: "high",
      },
      {
        icon: Lock,
        title: "3 role conflicts require immediate resolution",
        count: 3,
        description: "Resolve conflicting permissions before next audit",
        href: "/foundry",
        urgency: "high",
      },
      {
        icon: AlertTriangle,
        title: "MFA adoption at 74% — below 90% policy threshold",
        count: 1,
        description: "Identify non-compliant users and enforce MFA",
        href: "/foundry",
        urgency: "medium",
      },
      {
        icon: ClipboardList,
        title: "7 open access requests awaiting admin review",
        count: 7,
        description: "Action pending access requests in governance queue",
        href: "/foundry",
        urgency: "medium",
      },
      {
        icon: Brain,
        title: "ForgeAI: SSO configuration anomaly detected",
        count: 1,
        description: "Review AI-flagged SSO health warning",
        href: "/forge-ai",
        urgency: "low",
      },
    ];
  }
  if (isSalesRep) {
    return [
      {
        icon: TrendingDown,
        title: "5 stalled opportunities — no activity in 14+ days",
        count: 5,
        description: "Re-engage stalled deals before quarter end",
        href: "/opportunities",
        urgency: "high",
      },
      {
        icon: Phone,
        title: "8 callbacks due today",
        count: 8,
        description: "Scheduled follow-up calls — complete before 5pm",
        href: "/tasks",
        urgency: "high",
      },
      {
        icon: RefreshCcw,
        title: "3 renewal reminders due this week",
        count: 3,
        description: "Upcoming renewal deadlines requiring your action",
        href: "/renewals",
        urgency: "medium",
      },
      {
        icon: Brain,
        title: "ForgeAI: Next-best action — 4 accounts ready for upsell",
        count: 4,
        description: "AI-recommended upsell conversations to book now",
        href: "/forge-ai",
        urgency: "medium",
      },
    ];
  }
  if (isSalesOps) {
    return [
      {
        icon: AlertTriangle,
        title: "6 account allocation conflicts detected",
        count: 6,
        description: "Resolve conflicting territory assignments",
        href: "/foundry",
        urgency: "high",
      },
      {
        icon: Users,
        title: "11 duplicate account records flagged this week",
        count: 11,
        description: "Review and merge or dismiss duplicate records",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: MapPin,
        title: "Hierarchy mapping errors in North territory — 3 issues",
        count: 3,
        description: "Correct hierarchy assignments in territory settings",
        href: "/foundry",
        urgency: "medium",
      },
      {
        icon: FileText,
        title: "4 operational process exceptions require review",
        count: 4,
        description: "Review exception reports and take corrective actions",
        href: "/reports",
        urgency: "medium",
      },
      {
        icon: Brain,
        title: "ForgeAI: Data quality score dropped to 81% — 3 root causes",
        count: 1,
        description: "View AI-generated data quality recommendations",
        href: "/forge-ai",
        urgency: "low",
      },
    ];
  }
  if (isMarketing) {
    return [
      {
        icon: Target,
        title: "2 active campaigns with falling engagement rates",
        count: 2,
        description: "Review and optimise underperforming campaigns",
        href: "/campaigns",
        urgency: "high",
      },
      {
        icon: FileText,
        title: "5 MDF requests pending approval",
        count: 5,
        description: "Review partner MDF requests before deadline",
        href: "/mdf-requests",
        urgency: "high",
      },
      {
        icon: Briefcase,
        title: "Asset adoption rate below 40% — refresh needed",
        count: 1,
        description: "Update low-performing enablement assets",
        href: "/campaigns",
        urgency: "medium",
      },
      {
        icon: Brain,
        title: "ForgeAI: Q3 campaign insights ready",
        count: 1,
        description: "Review AI-generated campaign performance analysis",
        href: "/forge-ai",
        urgency: "medium",
      },
    ];
  }
  if (isLeadership) {
    return [
      {
        icon: TrendingDown,
        title: "Revenue attainment at 78% — Q3 gap requires action",
        count: 1,
        description: "Review strategic recovery plan with leadership team",
        href: "/reports",
        urgency: "high",
      },
      {
        icon: ShieldAlert,
        title: "Ecosystem health score dropped to 74 — at-risk partners",
        count: 1,
        description: "Identify and intervene on at-risk partner relationships",
        href: "/accounts",
        urgency: "high",
      },
      {
        icon: Brain,
        title: "ForgeAI: Executive operational briefing — 4 alerts",
        count: 4,
        description: "Review AI-generated strategic recommendations",
        href: "/forge-ai",
        urgency: "medium",
      },
      {
        icon: FileText,
        title: "Q3 renewal exposure: £1.2M at risk",
        count: 1,
        description: "Review renewal pipeline and assign recovery resources",
        href: "/renewals",
        urgency: "medium",
      },
      {
        icon: MapPin,
        title: "3 territories showing performance imbalance",
        count: 3,
        description: "Review territory performance and rebalance if needed",
        href: "/reports",
        urgency: "low",
      },
    ];
  }
  if (isItOps) {
    return [
      {
        icon: Wifi,
        title: "2 API integrations showing degraded response times",
        count: 2,
        description: "Investigate and resolve integration health issues",
        href: "/foundry",
        urgency: "high",
      },
      {
        icon: AlertTriangle,
        title: "14 failed sync events in the last 24 hours",
        count: 14,
        description: "Review failed sync logs and retry failed operations",
        href: "/foundry",
        urgency: "high",
      },
      {
        icon: FileText,
        title: "3 import/export operations completed with warnings",
        count: 3,
        description: "Review import logs for data integrity issues",
        href: "/foundry",
        urgency: "medium",
      },
      {
        icon: Brain,
        title: "ForgeAI: Cloud Engine stability anomaly detected",
        count: 1,
        description: "Review infrastructure health report and take action",
        href: "/forge-ai",
        urgency: "medium",
      },
    ];
  }
  // Default
  return [
    {
      icon: ClipboardList,
      title: "Open Tasks",
      count: 6,
      description: "Tasks due today",
      href: "/tasks",
      urgency: "medium",
    },
    {
      icon: RefreshCcw,
      title: "Renewals Due",
      count: renewalsDue || 3,
      description: "Accounts expiring within 30 days",
      href: "/renewals",
      urgency: "high",
    },
    {
      icon: AlertTriangle,
      title: "Accounts Needing Attention",
      count: highRisk || 4,
      description: "Accounts with activity gaps",
      href: "/accounts",
      urgency: "medium",
    },
  ];
}

function getKpis(
  role: UserRole,
  accounts: Account[],
  dealRegs: DealRegistration[],
): KpiTile[] {
  const isVendorRole =
    role === UserRole.VendorPrimaryAdmin ||
    role === UserRole.VendorAdmin ||
    role === UserRole.VendorSecondaryAdmin;
  const isDistributorRole =
    role === UserRole.DistributorPrimaryAdmin ||
    role === UserRole.DistributorSalesUser ||
    role === UserRole.DistributorSecondaryAdmin;

  const openDeals = dealRegs.filter(
    (d) =>
      d.status !== DealStatus.Lost &&
      d.status !== DealStatus.Rejected &&
      d.status !== DealStatus.Expired,
  );
  const pipeline = openDeals.reduce((s, d) => s + d.estimatedValue, 0);

  if (isVendorRole) {
    return [
      {
        title: "Pipeline Value",
        value: pipeline > 0 ? formatCurrency(pipeline) : "£2.4M",
        trend: 12,
        sparkline: [40, 55, 45, 70, 60, 80, 75],
      },
      {
        title: "Renewals Due",
        value: String(
          accounts.filter(
            (a) =>
              daysUntilRenewal(a.renewalDate) <= 90 &&
              daysUntilRenewal(a.renewalDate) > 0,
          ).length || 23,
        ),
        trend: -5,
        sparkline: [20, 30, 25, 35, 28, 22, 23],
      },
      {
        title: "Closed Won QTD",
        value: "£840K",
        trend: 8,
        sparkline: [30, 45, 50, 65, 70, 80, 84],
      },
      {
        title: "Win Rate",
        value: "64%",
        trend: 3,
        sparkline: [55, 58, 60, 61, 63, 62, 64],
      },
      {
        title: "High-Risk Accounts",
        value: String(
          accounts.filter((a) => a.status === AccountStatus.AtRisk).length || 7,
        ),
        trend: -2,
        sparkline: [5, 8, 9, 7, 8, 7, 7],
      },
      {
        title: "Active Distributors",
        value: "4",
        trend: 0,
        sparkline: [4, 4, 4, 4, 4, 4, 4],
      },
    ];
  }
  if (isDistributorRole) {
    return [
      {
        title: "Active Resellers",
        value: "12",
        trend: 2,
        sparkline: [8, 9, 10, 10, 11, 11, 12],
      },
      {
        title: "Pipeline Value",
        value: pipeline > 0 ? formatCurrency(pipeline) : "£1.1M",
        trend: 7,
        sparkline: [70, 75, 80, 85, 90, 100, 110],
      },
      {
        title: "MDF Utilization",
        value: "67%",
        trend: 4,
        sparkline: [50, 55, 58, 61, 63, 65, 67],
      },
      {
        title: "Reseller Coverage",
        value: "89%",
        trend: -1,
        sparkline: [92, 91, 90, 90, 89, 89, 89],
      },
    ];
  }
  const rs = String(role).toLowerCase();

  if (rs.includes("sales rep") || rs.includes("reseller sales")) {
    return [
      {
        title: "Pipeline Value",
        value: pipeline > 0 ? formatCurrency(pipeline) : "£287,450",
        trend: 9,
        sparkline: [22, 24, 25, 26, 27, 28, 29],
      },
      {
        title: "Renewal Value",
        value: "£94,200",
        trend: 4,
        sparkline: [80, 82, 85, 88, 90, 92, 94],
      },
      {
        title: "Meetings Booked",
        value: "11",
        trend: 10,
        sparkline: [7, 8, 9, 9, 10, 10, 11],
      },
      {
        title: "Account Engagement",
        value: "82%",
        trend: 3,
        sparkline: [76, 77, 78, 79, 80, 81, 82],
      },
      {
        title: "Forecast Contribution",
        value: "£178,000",
        trend: 6,
        sparkline: [140, 148, 155, 160, 165, 170, 178],
      },
    ];
  }
  if (rs.includes("account manager")) {
    return [
      {
        title: "Renewal Retention Rate",
        value: "91%",
        trend: 3,
        sparkline: [85, 86, 88, 89, 90, 91, 91],
      },
      {
        title: "Account Growth %",
        value: "+14%",
        trend: 5,
        sparkline: [8, 9, 10, 11, 12, 13, 14],
      },
      {
        title: "Customer Engagement",
        value: "76%",
        trend: -4,
        sparkline: [82, 80, 79, 78, 77, 76, 76],
      },
      {
        title: "At-Risk Accounts",
        value: "4",
        trend: 2,
        sparkline: [1, 2, 2, 3, 3, 4, 4],
      },
      {
        title: "Expansion Opportunities",
        value: "7",
        trend: 3,
        sparkline: [4, 4, 5, 5, 6, 6, 7],
      },
    ];
  }
  if (rs.includes("renewal")) {
    return [
      {
        title: "Renewal Rate %",
        value: "87%",
        trend: -2,
        sparkline: [91, 90, 90, 89, 89, 88, 87],
      },
      {
        title: "Expiring in 30 Days",
        value: "8 contracts",
        trend: 3,
        sparkline: [5, 6, 6, 7, 7, 8, 8],
      },
      {
        title: "Forecasted Churn Value",
        value: "£234,500",
        trend: 8,
        sparkline: [150, 165, 180, 195, 205, 220, 234],
      },
      {
        title: "Overdue Renewals",
        value: "3",
        trend: 1,
        sparkline: [1, 1, 2, 2, 2, 3, 3],
      },
    ];
  }
  if (rs.includes("deal desk")) {
    return [
      {
        title: "Pending Approvals",
        value: "9",
        trend: 3,
        sparkline: [5, 5, 6, 7, 7, 8, 9],
      },
      {
        title: "Avg Approval Speed",
        value: "6.2 hrs",
        trend: -12,
        sparkline: [11, 11, 10, 9, 8, 7, 6],
      },
      {
        title: "Exception Volume",
        value: "14 this month",
        trend: 5,
        sparkline: [9, 10, 10, 11, 12, 13, 14],
      },
      {
        title: "Deal Cycle Efficiency",
        value: "78%",
        trend: 4,
        sparkline: [70, 71, 73, 74, 75, 77, 78],
      },
    ];
  }
  if (
    rs.includes("partner marketing") ||
    (rs.includes("marketing") && !rs.includes("partner"))
  ) {
    const isPartnerMkt = rs.includes("partner marketing");
    if (isPartnerMkt) {
      return [
        {
          title: "Partner Campaign Engagement",
          value: "54%",
          trend: 6,
          sparkline: [44, 46, 48, 49, 51, 52, 54],
        },
        {
          title: "Reseller Enablement Score",
          value: "68/100",
          trend: 4,
          sparkline: [60, 62, 63, 64, 65, 67, 68],
        },
        {
          title: "Shared Asset Downloads",
          value: "1,204",
          trend: 14,
          sparkline: [800, 870, 940, 1000, 1080, 1140, 1204],
        },
        {
          title: "Partner Participation Rate",
          value: "61%",
          trend: 5,
          sparkline: [52, 54, 55, 57, 58, 60, 61],
        },
      ];
    }
    return [
      {
        title: "Campaign Engagement",
        value: "47%",
        trend: 6,
        sparkline: [38, 40, 41, 43, 44, 46, 47],
      },
      {
        title: "MDF ROI",
        value: "312%",
        trend: 8,
        sparkline: [260, 270, 280, 290, 295, 305, 312],
      },
      {
        title: "Content Downloads",
        value: "3,847",
        trend: 12,
        sparkline: [2800, 3000, 3200, 3400, 3550, 3700, 3847],
      },
      {
        title: "Partner Participation",
        value: "58%",
        trend: 3,
        sparkline: [52, 53, 54, 55, 56, 57, 58],
      },
    ];
  }
  if (rs.includes("sales ops")) {
    return [
      {
        title: "Data Quality Score",
        value: "81%",
        trend: -3,
        sparkline: [86, 85, 84, 84, 83, 82, 81],
      },
      {
        title: "Allocation Accuracy",
        value: "93%",
        trend: 2,
        sparkline: [89, 90, 90, 91, 92, 92, 93],
      },
      {
        title: "Report Usage",
        value: "247 views",
        trend: 8,
        sparkline: [190, 200, 210, 220, 230, 240, 247],
      },
      {
        title: "Workflow Health",
        value: "88%",
        trend: 1,
        sparkline: [85, 85, 86, 87, 87, 88, 88],
      },
    ];
  }
  if (
    rs.includes("leadership") ||
    rs.includes("vendor primary") ||
    rs.includes("vendor admin")
  ) {
    return [
      {
        title: "Revenue Attainment",
        value: "78%",
        trend: -5,
        sparkline: [85, 84, 83, 82, 81, 80, 78],
      },
      {
        title: "Forecast Accuracy",
        value: "84%",
        trend: 2,
        sparkline: [79, 80, 81, 82, 82, 83, 84],
      },
      {
        title: "Ecosystem Health",
        value: "74/100",
        trend: -3,
        sparkline: [80, 79, 78, 77, 76, 75, 74],
      },
      {
        title: "Renewal Exposure",
        value: "£1.2M",
        trend: 8,
        sparkline: [80, 85, 90, 95, 100, 110, 120],
      },
      {
        title: "Operational Risk Score",
        value: "Medium",
        trend: -1,
        sparkline: [3, 3, 3, 3, 3, 3, 3],
      },
    ];
  }
  if (rs.includes("regional director")) {
    return [
      {
        title: "Revenue Attainment",
        value: "78%",
        trend: -5,
        sparkline: [85, 84, 83, 82, 81, 80, 78],
      },
      {
        title: "Forecast Accuracy",
        value: "82%",
        trend: 1,
        sparkline: [78, 79, 80, 80, 81, 82, 82],
      },
      {
        title: "Ecosystem Health",
        value: "74/100",
        trend: -3,
        sparkline: [80, 79, 78, 77, 76, 75, 74],
      },
      {
        title: "Renewal Exposure",
        value: "£1.4M",
        trend: 7,
        sparkline: [100, 105, 110, 118, 124, 130, 140],
      },
    ];
  }
  if (rs.includes("sales manager")) {
    return [
      {
        title: "Forecast Coverage",
        value: "72%",
        trend: -8,
        sparkline: [88, 86, 84, 82, 80, 76, 72],
      },
      {
        title: "Team Attainment",
        value: "61%",
        trend: -5,
        sparkline: [72, 70, 68, 67, 65, 63, 61],
      },
      {
        title: "Renewal Health Score",
        value: "79/100",
        trend: 2,
        sparkline: [74, 75, 76, 77, 77, 78, 79],
      },
      {
        title: "Activity Compliance",
        value: "84%",
        trend: -3,
        sparkline: [90, 89, 88, 87, 86, 85, 84],
      },
    ];
  }
  if (rs.includes("bdr")) {
    return [
      {
        title: "Calls Completed",
        value: "47",
        trend: 12,
        sparkline: [30, 33, 35, 38, 40, 44, 47],
      },
      {
        title: "Meetings Booked",
        value: "9",
        trend: 13,
        sparkline: [5, 6, 6, 7, 7, 8, 9],
      },
      {
        title: "Opportunities Created",
        value: "6",
        trend: 20,
        sparkline: [3, 3, 4, 4, 5, 5, 6],
      },
      {
        title: "Conversion Rate",
        value: "19%",
        trend: 5,
        sparkline: [13, 14, 15, 16, 17, 18, 19],
      },
    ];
  }
  if (rs.includes("it operations") || rs.includes("it ops")) {
    return [
      {
        title: "Integration Uptime",
        value: "98.4%",
        trend: 0,
        sparkline: [98, 98, 98, 98, 99, 98, 98],
      },
      {
        title: "Failed Syncs (24h)",
        value: "14",
        trend: 40,
        sparkline: [5, 6, 7, 8, 10, 12, 14],
      },
      {
        title: "Operational Stability",
        value: "94/100",
        trend: -2,
        sparkline: [97, 96, 96, 95, 95, 94, 94],
      },
      {
        title: "Cloud Engine Health",
        value: "Healthy",
        trend: 0,
        sparkline: [100, 100, 100, 100, 100, 100, 100],
      },
    ];
  }
  if (rs.includes("security")) {
    return [
      {
        title: "Access Anomalies",
        value: "4 detected",
        trend: 33,
        sparkline: [1, 2, 2, 3, 3, 3, 4],
      },
      {
        title: "SSO Health",
        value: "96%",
        trend: -1,
        sparkline: [99, 98, 98, 97, 97, 96, 96],
      },
      {
        title: "MFA Adoption",
        value: "74%",
        trend: -5,
        sparkline: [82, 81, 80, 79, 78, 76, 74],
      },
      {
        title: "Open Security Requests",
        value: "7",
        trend: 40,
        sparkline: [3, 4, 4, 5, 5, 6, 7],
      },
    ];
  }
  if (rs.includes("customer success")) {
    return [
      {
        title: "Customer Health Score",
        value: "74/100",
        trend: -3,
        sparkline: [80, 79, 78, 77, 76, 75, 74],
      },
      {
        title: "Onboarding Completion",
        value: "68%",
        trend: 5,
        sparkline: [58, 60, 61, 63, 64, 66, 68],
      },
      {
        title: "Adoption Score",
        value: "71%",
        trend: 4,
        sparkline: [63, 64, 65, 67, 68, 70, 71],
      },
      {
        title: "Escalation Rate",
        value: "6.2%",
        trend: -8,
        sparkline: [10, 9, 9, 8, 8, 7, 6],
      },
    ];
  }
  if (rs.includes("finance")) {
    return [
      {
        title: "Operational Spend (mo)",
        value: "£12,340",
        trend: 8,
        sparkline: [9500, 10000, 10500, 11000, 11400, 11900, 12340],
      },
      {
        title: "Forecasted Revenue",
        value: "£4.2M",
        trend: -6,
        sparkline: [47, 46, 45, 45, 44, 43, 42],
      },
      {
        title: "Compute Burn Rate",
        value: "£12,340/mo",
        trend: 8,
        sparkline: [9500, 10000, 10500, 11000, 11400, 11900, 12340],
      },
      {
        title: "Renewal Value Pipeline",
        value: "£890K",
        trend: -14,
        sparkline: [110, 105, 100, 95, 92, 90, 89],
      },
    ];
  }
  // Reseller / default
  return [
    {
      title: "Customer Accounts",
      value: String(accounts.length || 47),
      trend: 3,
      sparkline: [38, 40, 42, 43, 44, 46, 47],
    },
    {
      title: "Renewals This Month",
      value: String(
        accounts.filter(
          (a) =>
            daysUntilRenewal(a.renewalDate) <= 30 &&
            daysUntilRenewal(a.renewalDate) > 0,
        ).length || 8,
      ),
      trend: -1,
      sparkline: [10, 9, 11, 10, 9, 8, 8],
    },
    {
      title: "Open Opportunities",
      value: pipeline > 0 ? formatCurrency(pipeline) : "£380K",
      trend: 11,
      sparkline: [28, 30, 32, 34, 35, 37, 38],
    },
    {
      title: "Tasks Due",
      value: "14",
      trend: -3,
      sparkline: [18, 17, 16, 16, 15, 14, 14],
    },
  ];
}

// ─── Static mock data ────────────────────────────────────────────────────────
const ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: "1",
    account: "Acme Corp",
    action: "Renewal risk flagged by ForgeAI",
    time: "2h ago",
    dot: "orange",
  },
  {
    id: "2",
    account: "TechVision Ltd",
    action: "Deal registration approved",
    time: "3h ago",
    dot: "green",
  },
  {
    id: "3",
    account: "Global Partners",
    action: "Opportunity moved to Proposal stage",
    time: "5h ago",
    dot: "orange",
  },
  {
    id: "4",
    account: "NovaTech Systems",
    action: "Contact record updated",
    time: "Yesterday",
    dot: "muted",
  },
  {
    id: "5",
    account: "Pinnacle Group",
    action: "MDF request submitted — Q3 campaign",
    time: "Yesterday",
    dot: "blue",
  },
  {
    id: "6",
    account: "Corelink Solutions",
    action: "Internal note added",
    time: "2 days ago",
    dot: "muted",
  },
  {
    id: "7",
    account: "Apex Partners",
    action: "Account health dropped to 42 — intervention recommended",
    time: "2 days ago",
    dot: "orange",
  },
  {
    id: "8",
    account: "LumiTech",
    action: "Closed Won — Q3 strategic deal",
    time: "3 days ago",
    dot: "green",
  },
  {
    id: "9",
    account: "Meridian Dynamics",
    action: "New contact: Sarah Chen, VP Sales",
    time: "3 days ago",
    dot: "muted",
  },
  {
    id: "10",
    account: "Vertex Innovations",
    action: "Renewal campaign launched",
    time: "4 days ago",
    dot: "blue",
  },
];

const _FORGE_AI_INSIGHTS: InsightCard[] = [
  {
    priority: "HIGH",
    title: "3 accounts due for renewal in 7 days",
    description:
      "No recent engagement recorded for Acme Corp, Corelink, and Pinnacle Group. Immediate outreach recommended.",
  },
  {
    priority: "HIGH",
    title: "Pipeline coverage at 68% — below Q3 threshold",
    description:
      "Current forecast coverage is 15pp below your quarterly target. 4 opportunities are stalled in Proposal stage.",
  },
  {
    priority: "MEDIUM",
    title: "TechCorp deal stalled for 14 days",
    description:
      "The TechCorp Proposal stage opportunity has had no activity since 5th July. Consider re-engaging or escalating.",
  },
  {
    priority: "MEDIUM",
    title: "Western region reseller engagement down 40%",
    description:
      "Reseller activity in the Western territory has dropped significantly compared to Q2. Coverage review suggested.",
  },
  {
    priority: "LOW",
    title: "4 accounts unassigned — North territory",
    description:
      "These accounts have no current owner assigned. Allocate to a sales rep to prevent engagement gaps.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function UrgencyDot({ urgency }: { urgency: "high" | "medium" | "low" }) {
  if (urgency === "high")
    return (
      <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
    );
  if (urgency === "medium")
    return (
      <span className="w-2 h-2 rounded-full bg-orange-400/60 flex-shrink-0" />
    );
  return (
    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 flex-shrink-0" />
  );
}

function ActivityDot({ dot }: { dot: ActivityEvent["dot"] }) {
  if (dot === "orange")
    return (
      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0 mt-0.5" />
    );
  if (dot === "green")
    return (
      <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0 mt-0.5" />
    );
  if (dot === "blue")
    return (
      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 flex-shrink-0 mt-0.5" />
    );
  return (
    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30 flex-shrink-0 mt-0.5" />
  );
}

function _InsightPriorityBadge({
  priority,
}: { priority: InsightCard["priority"] }) {
  if (priority === "HIGH")
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20">
        HIGH
      </span>
    );
  if (priority === "MEDIUM")
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        MED
      </span>
    );
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border">
      LOW
    </span>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, idx) => (
        <div
          key={`sparkline-bar-${idx}-${v}`}
          className="w-1.5 rounded-sm bg-orange-500/30 flex-shrink-0"
          style={{ height: `${Math.round((v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function _KpiCard({ tile, loading }: { tile: KpiTile; loading: boolean }) {
  const positive = tile.trend >= 0;
  return (
    <div
      className="cf-card p-4 flex flex-col gap-2"
      data-ocid="dashboard.kpi.card"
    >
      <p className="text-xs text-muted-foreground font-medium truncate">
        {tile.title}
      </p>
      {loading ? (
        <Skeleton className="h-7 w-20" />
      ) : (
        <p className="text-2xl font-bold text-foreground tracking-tight">
          {tile.value}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-green-400" : "text-red-400/80"}`}
        >
          {positive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{Math.abs(tile.trend)}%</span>
        </div>
        <Sparkline data={tile.sparkline} />
      </div>
    </div>
  );
}

function PriorityCard({ p }: { p: Priority }) {
  const navigate = useNavigate();
  const Icon = p.icon;
  return (
    <button
      type="button"
      className="cf-card p-4 flex flex-col gap-3 min-w-[200px] max-w-[220px] flex-shrink-0 cursor-pointer hover:border-orange-500/30 transition-colors text-left"
      data-ocid="dashboard.priority.card"
      onClick={() => navigate({ to: p.href as string })}
      aria-label={p.title}
    >
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-500/10 border border-orange-500/15">
          <Icon size={16} className="text-orange-400" />
        </div>
        <div className="flex items-center gap-1.5">
          <UrgencyDot urgency={p.urgency} />
          <span className="text-lg font-bold text-orange-400">{p.count}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{p.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {p.description}
        </p>
      </div>
      <span
        className="flex items-center gap-1 text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors w-fit mt-auto"
        aria-hidden="true"
        data-ocid="dashboard.priority.view_button"
      >
        View <ArrowRight size={11} />
      </span>
    </button>
  );
}

// ─── Channel Account Manager Dashboard Sections ─────────────────────────────
function ChannelAccountManagerDashboard() {
  const distributors = [
    {
      name: "ATEA Group",
      pipeline: "£4.8M",
      renewal: "£1.2M",
      attainment: 94,
      activity: 28,
      engagement: 92,
      status: "On Track",
      statusColor: "green",
    },
    {
      name: "Crayon",
      pipeline: "£3.2M",
      renewal: "£0.9M",
      attainment: 71,
      activity: 14,
      engagement: 68,
      status: "Needs Attention",
      statusColor: "amber",
      note: "Nordics pipeline down 8%",
    },
    {
      name: "TD SYNNEX",
      pipeline: "£5.1M",
      renewal: "£1.6M",
      attainment: 98,
      activity: 34,
      engagement: 95,
      status: "Exceeding",
      statusColor: "green",
    },
    {
      name: "Ingram Micro",
      pipeline: "£2.8M",
      renewal: "£0.8M",
      attainment: 78,
      activity: 19,
      engagement: 74,
      status: "Needs Attention",
      statusColor: "amber",
    },
  ];
  const resellers = [
    {
      name: "Nordic Cloud Solutions",
      pipeline: "£2.1M",
      growth: "+14%",
      status: "Active",
      onboarding: "Complete",
      underperforming: false,
      star: false,
    },
    {
      name: "Sovereign Systems UK",
      pipeline: "£1.8M",
      growth: "+7%",
      status: "Active",
      onboarding: "Complete",
      underperforming: false,
      star: false,
    },
    {
      name: "BluePeak Consulting",
      pipeline: "£0.9M",
      growth: "-3%",
      status: "Underperforming",
      onboarding: "Active",
      underperforming: true,
      star: false,
    },
    {
      name: "FutureStack Technologies",
      pipeline: "£1.4M",
      growth: "+22%",
      status: "Active",
      onboarding: "Complete",
      underperforming: false,
      star: true,
    },
  ];
  return (
    <div className="space-y-6">
      {/* Distributor Performance */}
      <div
        className="cf-card overflow-hidden"
        data-ocid="cam.distributor.section"
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Building2 size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Distributor Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Distributor</th>
                <th className="text-right px-5 py-3 font-medium">Pipeline</th>
                <th className="text-right px-5 py-3 font-medium">
                  Renewal Value
                </th>
                <th className="text-right px-5 py-3 font-medium">Attainment</th>
                <th className="text-right px-5 py-3 font-medium">Engagement</th>
                <th className="text-right px-5 py-3 font-medium">Activity</th>
                <th className="text-right px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {distributors.map((d) => (
                <tr
                  key={d.name}
                  className="hover:bg-muted/10 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-foreground">
                    {d.name}
                  </td>
                  <td className="px-5 py-3 text-right text-foreground">
                    {d.pipeline}
                  </td>
                  <td className="px-5 py-3 text-right text-foreground">
                    {d.renewal}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`font-semibold ${d.attainment >= 90 ? "text-green-400" : d.attainment >= 80 ? "text-amber-400" : "text-red-400"}`}
                    >
                      {d.attainment}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`font-semibold ${d.engagement >= 85 ? "text-green-400" : d.engagement >= 70 ? "text-amber-400" : "text-red-400"}`}
                    >
                      {d.engagement}/100
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-muted-foreground">
                    {d.activity}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${d.statusColor === "green" ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-amber-500/15 text-amber-400 border-amber-500/20"}`}
                    >
                      {d.status}
                    </span>
                    {d.note && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {d.note}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reseller Performance */}
      <div data-ocid="cam.reseller.section">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Reseller Performance
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {resellers.map((r) => (
            <div
              key={r.name}
              className="cf-card p-4 flex flex-col gap-3"
              data-ocid={`cam.reseller.card.${r.name}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {r.name}
                </span>
                <div className="flex items-center gap-1.5">
                  {r.star && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20">
                      Star Performer
                    </span>
                  )}
                  {r.underperforming && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                      Underperforming
                    </span>
                  )}
                  {!r.underperforming && !r.star && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                      Active
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Pipeline
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {r.pipeline}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Growth
                  </p>
                  <p
                    className={`text-lg font-bold ${r.growth.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                  >
                    {r.growth}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Onboarding
                  </p>
                  <p
                    className={`text-lg font-bold ${r.onboarding === "Active" ? "text-amber-400" : "text-green-400"}`}
                  >
                    {r.onboarding}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Status:{" "}
                  <span
                    className={
                      r.underperforming
                        ? "text-red-400 font-medium"
                        : "text-green-400 font-medium"
                    }
                  >
                    {r.status}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem Health */}
      <div className="cf-card p-5" data-ocid="cam.ecosystem.section">
        <div className="flex items-center gap-2 mb-4">
          <Network size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Ecosystem Health
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Active Partners", value: "47", color: "text-green-400" },
            { label: "Inactive Partners", value: "8", color: "text-amber-400" },
            { label: "Coverage Gaps", value: "3", color: "text-amber-400" },
            {
              label: "Territory Risk",
              value: "Medium",
              color: "text-amber-400",
            },
            {
              label: "YoY Partner Growth",
              value: "+14%",
              color: "text-green-400",
            },
            {
              label: "QoQ Pipeline Growth",
              value: "+7%",
              color: "text-blue-400",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="text-center p-3 rounded-lg bg-card/60 border border-border/50"
            >
              <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Customer Exposure */}
      <div className="cf-card p-5" data-ocid="cam.customer.section">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Strategic Customer Exposure
          </h2>
          <span className="text-[10px] text-muted-foreground ml-2">
            (Viewed through partner ecosystem lens)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-card/60 border border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Partner-Linked Accounts
            </p>
            <p className="text-2xl font-bold text-blue-400 mt-1">23</p>
          </div>
          <div className="p-4 rounded-lg bg-card/60 border border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Strategic Renewal Risk
            </p>
            <p className="text-2xl font-bold text-red-400 mt-1">£2.8M</p>
          </div>
          <div className="p-4 rounded-lg bg-card/60 border border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Active Escalations
            </p>
            <p className="text-2xl font-bold text-amber-400 mt-1">2</p>
          </div>
          <div className="p-4 rounded-lg bg-card/60 border border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Large Opportunity Exposure
            </p>
            <p className="text-2xl font-bold text-blue-400 mt-1">£6.4M</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Channel Sales Manager Dashboard Sections ───────────────────────────────
function ChannelSalesManagerDashboard() {
  const cams = [
    {
      name: "Sarah Mitchell",
      territory: "Nordics",
      attainment: 87,
      activity: 24,
      variance: "+£0.3M",
    },
    {
      name: "James Chen",
      territory: "DACH",
      attainment: 72,
      activity: 18,
      variance: "-£0.8M",
    },
    {
      name: "Emma Williams",
      territory: "UK / Benelux",
      attainment: 94,
      activity: 31,
      variance: "+£0.5M",
    },
    {
      name: "Carlos Mendez",
      territory: "South EMEA",
      attainment: 68,
      activity: 12,
      variance: "-£1.2M",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Team Performance */}
      <div className="cf-card overflow-hidden" data-ocid="csm.team.section">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Users size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Team Performance — CAM Scorecards
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">CAM</th>
                <th className="text-left px-5 py-3 font-medium">Territory</th>
                <th className="text-left px-5 py-3 font-medium">Attainment</th>
                <th className="text-right px-5 py-3 font-medium">
                  Partner Activity
                </th>
                <th className="text-right px-5 py-3 font-medium">
                  Forecast Variance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {cams.map((cam) => {
                const barColor =
                  cam.attainment >= 85
                    ? "bg-green-500"
                    : cam.attainment >= 70
                      ? "bg-amber-500"
                      : "bg-red-500";
                const textColor =
                  cam.attainment >= 85
                    ? "text-green-400"
                    : cam.attainment >= 70
                      ? "text-amber-400"
                      : "text-red-400";
                return (
                  <tr
                    key={cam.name}
                    className="hover:bg-muted/10 transition-colors"
                    data-ocid={`csm.cam.row.${cam.name}`}
                  >
                    <td className="px-5 py-3 font-medium text-foreground">
                      {cam.name}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {cam.territory}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all`}
                            style={{ width: `${cam.attainment}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${textColor}`}>
                          {cam.attainment}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {cam.activity} activities
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`font-semibold ${cam.variance.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      >
                        {cam.variance}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ecosystem Forecast */}
      <div className="cf-card p-5" data-ocid="csm.forecast.section">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Ecosystem Forecast
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Distributor Pipeline",
              value: "£11.2M",
              target: "£12M",
              pct: 93,
              inverse: false,
            },
            {
              label: "Reseller Contribution",
              value: "£5.8M",
              target: "£7M",
              pct: 83,
              inverse: false,
            },
            {
              label: "Strategic Opportunity Coverage",
              value: "74%",
              target: "85%",
              pct: 74,
              inverse: false,
            },
            {
              label: "Renewal Exposure at Risk",
              value: "£2.4M",
              target: "—",
              pct: 100,
              inverse: true,
              highlight: true,
            },
          ].map((f) => (
            <div
              key={f.label}
              className={`p-4 rounded-lg border ${f.highlight ? "bg-red-500/5 border-red-500/20" : "bg-card/60 border-border/50"}`}
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                {f.label}
              </p>
              <p className="text-xl font-bold text-foreground">{f.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Target: {f.target}
              </p>
              <div className="mt-3 w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${f.inverse ? "bg-red-500" : f.pct >= 90 ? "bg-green-500" : f.pct >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                  style={{ width: `${f.inverse ? 100 : f.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Territory Health */}
      <div className="cf-card p-5" data-ocid="csm.territory.section">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Territory Health
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Tier 1 Territories
            </p>
            <p className="text-2xl font-bold text-green-400 mt-1">£14.2M</p>
            <p className="text-xs text-green-400 mt-1">YoY +22%</p>
            <p className="text-xs text-muted-foreground mt-1">3 territories</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Tier 2 Territories
            </p>
            <p className="text-2xl font-bold text-amber-400 mt-1">£4.5M</p>
            <p className="text-xs text-amber-400 mt-1">YoY +4%</p>
            <p className="text-xs text-muted-foreground mt-1">4 territories</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-foreground mb-2">
            Underperforming Regions
          </p>
          {[
            { region: "DACH", attainment: 72, cam: "James Chen" },
            { region: "South EMEA", attainment: 68, cam: "Carlos Mendez" },
          ].map((t) => (
            <div
              key={t.region}
              className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10"
              data-ocid={`csm.territory.row.${t.region}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-foreground">
                  {t.region}
                </span>
                <span className="text-xs text-muted-foreground">{t.cam}</span>
              </div>
              <span className="text-sm font-bold text-red-400">
                {t.attainment}%
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-card/60 border border-border/50">
          <span className="text-xs text-muted-foreground">
            Partner Engagement Average:
          </span>
          <span className="text-sm font-bold text-amber-400">78%</span>
          <span className="text-xs text-muted-foreground">
            across all territories
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Channel Director Dashboard Sections ──────────────────────────────────────
function ChannelDirectorDashboard() {
  return (
    <div className="space-y-6">
      {/* Executive Ecosystem Overview */}
      <div data-ocid="cd.executive.section">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Executive Ecosystem Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="cf-card p-6 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Total Ecosystem Revenue
            </p>
            <p className="text-4xl font-bold text-foreground mt-3">£24.7M</p>
            <div className="mt-3 flex items-center justify-center gap-1 text-sm text-green-400">
              <TrendingUp size={14} />
              <span>+18% YoY</span>
            </div>
          </div>
          <div className="cf-card p-6 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Distributor Contribution
            </p>
            <p className="text-3xl font-bold text-foreground mt-3">£16.2M</p>
            <div className="mt-3 flex items-center justify-center">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                66% of total
              </span>
            </div>
          </div>
          <div className="cf-card p-6 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Reseller Contribution
            </p>
            <p className="text-3xl font-bold text-foreground mt-3">£8.5M</p>
            <div className="mt-3 flex items-center justify-center">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                34% of total
              </span>
            </div>
          </div>
          <div className="cf-card p-6 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Territory Growth
            </p>
            <p className="text-3xl font-bold text-green-400 mt-3">+12%</p>
            <p className="text-xs text-muted-foreground mt-3">
              YoY — All Regions
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Forecasting */}
      <div className="cf-card p-6" data-ocid="cd.forecast.section">
        <div className="flex items-center gap-2 mb-6">
          <LineChart size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Strategic Forecasting
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-lg bg-card/60 border border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              QTD Forecast
            </p>
            <p className="text-3xl font-bold text-foreground mt-2">£6.1M</p>
            <div className="mt-3 w-full h-2 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: "82%" }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                82% of £7.4M target
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                Below Target
              </span>
            </div>
          </div>
          <div className="p-5 rounded-lg bg-card/60 border border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              QoQ Trend
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown size={24} className="text-amber-400" />
              <p className="text-3xl font-bold text-amber-400">-2%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              vs previous quarter
            </p>
          </div>
          <div className="p-5 rounded-lg bg-card/60 border border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              YoY Growth
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp size={24} className="text-green-400" />
              <p className="text-3xl font-bold text-green-400">+18%</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              vs same quarter last year
            </p>
          </div>
          <div className="p-5 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Forecast Risk
            </p>
            <p className="text-3xl font-bold text-red-400 mt-2">ELEVATED</p>
            <p className="text-xs text-muted-foreground mt-3">6% below plan</p>
          </div>
        </div>
        <div className="mt-6 p-5 rounded-lg bg-card/60 border border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Strategic Pipeline
          </p>
          <p className="text-3xl font-bold text-foreground mt-2">£31.2M</p>
          <p className="text-xs text-muted-foreground mt-2">
            Across 23 strategic opportunities in Tier 1 territories
          </p>
        </div>
      </div>

      {/* Ecosystem Risk & Opportunity */}
      <div className="cf-card p-5" data-ocid="cd.risk.section">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={15} className="text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground font-display">
            Ecosystem Risk & Opportunity
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground">
              Underperforming Territories
            </p>
            {[
              {
                territory: "DACH",
                change: "-8%",
                risk: "Declining reseller engagement",
              },
              {
                territory: "South EMEA",
                change: "-15%",
                risk: "CAM turnover + pipeline gap",
              },
            ].map((t) => (
              <div
                key={t.territory}
                className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center justify-between"
                data-ocid={`cd.risk.territory.${t.territory}`}
              >
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {t.territory}
                  </span>
                  <p className="text-[11px] text-muted-foreground">{t.risk}</p>
                </div>
                <span className="text-sm font-bold text-amber-400">
                  {t.change}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground">
              Concentration & Exposure
            </p>
            <div
              className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10"
              data-ocid="cd.risk.concentration"
            >
              <p className="text-sm font-medium text-foreground">
                Partner Concentration Risk
              </p>
              <p className="text-2xl font-bold text-amber-400 mt-1">
                3 distributors = 72%
              </p>
              <p className="text-[11px] text-muted-foreground">
                of total pipeline concentrated in top 3 partners
              </p>
            </div>
            <div
              className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10"
              data-ocid="cd.opportunity.expansion"
            >
              <p className="text-sm font-medium text-foreground">
                Strategic Expansion Opportunities
              </p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                3 identified
              </p>
              <p className="text-[11px] text-muted-foreground">
                New territory entries with high partner readiness
              </p>
            </div>
            <div
              className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10"
              data-ocid="cd.risk.renewal"
            >
              <p className="text-sm font-medium text-foreground">
                Renewal Concentration
              </p>
              <p className="text-2xl font-bold text-amber-400 mt-1">£4.2M</p>
              <p className="text-[11px] text-muted-foreground">
                concentrated in 8 strategic accounts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export function Dashboard() {
  const {
    accounts,
    dealRegistrations,
    loading,
    userProfile,
    isPrimaryAdmin,
    testModeRole,
    testModeOrgType,
    isTestModeActive,
  } = useApp();
  const { computeScorecard } = useKPIGovernance();
  const { actor } = useActor();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [activityFilter, setActivityFilter] = useState<
    "all" | "accounts" | "deals" | "messages"
  >("all");
  const [renewalsDueAccounts, setRenewalsDueAccounts] = useState<Account[]>([]);
  const [highRiskAccounts, setHighRiskAccounts] = useState<Account[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setDataLoading(true);
    Promise.all([
      actor.getRenewalsDue(BigInt(90)).catch(() => [] as Account[]),
      actor.getHighRiskAccounts().catch(() => [] as Account[]),
    ]).then(([renewals, highRisk]) => {
      setRenewalsDueAccounts(renewals);
      setHighRiskAccounts(highRisk);
      setDataLoading(false);
    });
  }, [actor]);

  const role = userProfile?.role ?? UserRole.ReadOnlyViewer;
  const effectiveDisplayRole: UserRole = (
    IS_TEST_MODE && testModeRole ? testModeRole : role
  ) as UserRole;
  const isRestrictedSimRole =
    IS_TEST_MODE &&
    isTestModeActive &&
    ["endUser", "securityAdmin", "itOperations", "finance", "salesRep"].some(
      (r) => String(effectiveDisplayRole).includes(r),
    );
  const firstName = userProfile?.fullName?.split(" ")[0] ?? "there";

  const allAccountsForKpi = [
    ...accounts,
    ...renewalsDueAccounts,
    ...highRiskAccounts,
  ];
  const priorities = getPriorities(
    effectiveDisplayRole,
    allAccountsForKpi,
    dealRegistrations,
  );
  const _kpis = getKpis(
    effectiveDisplayRole,
    allAccountsForKpi,
    dealRegistrations,
  );
  const playbook = getPlaybook(effectiveDisplayRole);
  const { filters, activeFilterCount } = useFilterContext();
  const { kpiLoading, insightsLoading } = useProgressiveRefresh(filters);

  const filteredActivity =
    activityFilter === "all"
      ? ACTIVITY_EVENTS
      : activityFilter === "accounts"
        ? ACTIVITY_EVENTS.filter((e) => e.dot === "muted" || e.dot === "orange")
        : activityFilter === "deals"
          ? ACTIVITY_EVENTS.filter((e) => e.dot === "green")
          : ACTIVITY_EVENTS.filter((e) => e.dot === "blue");

  function handleAccountSelect(account: Account) {
    navigate({ to: `/accounts/${account.id}` as string });
  }

  const tileLoading = loading || dataLoading;

  return (
    <div className="space-y-6 fade-in" data-ocid="dashboard.page">
      {IS_TEST_MODE && isTestModeActive && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2 mb-4 text-sm text-orange-300 flex items-center gap-2">
          <span className="font-semibold">Simulating:</span>
          <span>
            {String(effectiveDisplayRole)}
            {testModeOrgType ? ` — ${testModeOrgType}` : ""}
          </span>
          <span className="text-orange-200/60">
            — Data visibility reflects simulated permissions.
          </span>
        </div>
      )}
      {/* ── ROLE PLAYBOOK BADGE ── */}
      {playbook && (
        <div
          className="flex items-center justify-between"
          data-ocid="dashboard.playbook.header"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25">
              <BookOpen size={12} className="text-orange-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-orange-400 tracking-wide">
                {playbook.name}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-orange-400 transition-colors"
            data-ocid="dashboard.customize.button"
            onClick={() => navigate({ to: "/foundry" as string })}
          >
            <Settings size={12} />
            Customize Dashboard
          </button>
        </div>
      )}

      {/* ── SECTION 1: HEADER ── */}
      <div
        className="cf-card px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        data-ocid="dashboard.header.section"
      >
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            {getGreeting()},{" "}
            <span className="text-orange-400">{firstName}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <CalendarDays size={12} />
            {formatToday()}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["today", "week", "month", "quarter"] as DateRange[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDateRange(r)}
              data-ocid={`dashboard.daterange.${r}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateRange === r
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-muted-foreground hover:text-foreground border border-border hover:border-border/80"
              }`}
            >
              {r === "today"
                ? "Today"
                : r === "week"
                  ? "This Week"
                  : r === "month"
                    ? "This Month"
                    : "This Quarter"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Persistent Search ── */}
      <div className="cf-card p-4" data-ocid="dashboard.search.section">
        <AccountSearchBar accounts={accounts} onSelect={handleAccountSelect} />
      </div>

      <RoleWorkflowBanner
        roleKey={resolveRoleKey(String(effectiveDisplayRole ?? ""))}
      />
      {/* ── SECTION 2: DAILY PRIORITIES ── */}
      <div data-ocid="dashboard.priorities.section">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground font-display flex items-center gap-2">
            <Flame size={15} className="text-orange-400" />
            Daily Priorities
          </h2>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-orange-400 transition-colors flex items-center gap-1"
            onClick={() => navigate({ to: "/tasks" })}
            data-ocid="dashboard.priorities.view_all"
          >
            View all tasks <ArrowRight size={11} />
          </button>
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
          data-ocid="dashboard.priorities.list"
        >
          {tileLoading
            ? ["a", "b", "c", "d"].map((id) => (
                <div
                  key={`skel-priority-${id}`}
                  className="cf-card p-4 min-w-[200px] max-w-[220px] flex-shrink-0 space-y-3"
                >
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              ))
            : priorities.map((p) => <PriorityCard key={p.title} p={p} />)}
        </div>
      </div>

      {/* ── SECTION 3: ROLE KPI TILES ── */}
      <div className="mb-8" data-ocid="dashboard.kpi.section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            KPI Performance
            {activeFilterCount > 0 && (
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
                active
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => navigate({ to: "/yoy-growth" as string })}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
            data-ocid="dashboard.yoy_growth.link"
          >
            <TrendingUp className="w-3 h-3" /> YoY Growth Intelligence
          </button>
        </div>
        {kpiLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="animate-pulse rounded-xl h-24 bg-muted" />
            <div className="animate-pulse rounded-xl h-24 bg-muted" />
            <div className="animate-pulse rounded-xl h-24 bg-muted" />
            <div className="animate-pulse rounded-xl h-24 bg-muted" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-stretch kpi-grid">
            {(ROLE_KPI_TILES[resolveRoleKey(effectiveDisplayRole)] ?? []).map(
              (tile, i) => {
                const colorMap: Record<string, string> = {
                  blue: "text-blue-400 bg-blue-500/10",
                  green: "text-green-400 bg-green-500/10",
                  amber: "text-amber-400 bg-amber-500/10",
                  red: "text-red-400 bg-red-500/10",
                  orange: "text-orange-400 bg-orange-500/10",
                  purple: "text-purple-400 bg-purple-500/10",
                  teal: "text-teal-400 bg-teal-500/10",
                  cyan: "text-cyan-400 bg-cyan-500/10",
                  yellow: "text-yellow-400 bg-yellow-500/10",
                };
                const cc = colorMap[tile.color] ?? colorMap.blue;
                const Icon = tile.icon;
                const [textClass, bgClass] = cc.split(" ");
                return (
                  <div
                    key={tile.label}
                    className="bg-card border border-border rounded-xl p-4 min-h-[var(--kpi-tile-height)]"
                    data-ocid={`dashboard.kpi.tile.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground font-medium">
                        {tile.label}
                      </span>
                      <div className={`p-1.5 rounded-lg ${bgClass}`}>
                        <Icon size={14} className={textClass} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground tabular-nums mb-1">
                      {tile.value}
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 ${tile.trend === "up" ? "text-green-400" : tile.trend === "down" ? "text-red-400" : "text-muted-foreground"}`}
                    >
                      {tile.trend === "up" ? (
                        <TrendingUp size={11} />
                      ) : tile.trend === "down" ? (
                        <TrendingDown size={11} />
                      ) : null}
                      <span>{tile.change}</span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
        {(() => {
          const sc = computeScorecard("2025-Q1", effectiveDisplayRole);
          const circumference = 2 * Math.PI * 36;
          const offset = circumference - (sc.totalScore / 100) * circumference;
          const ringColor =
            sc.totalScore >= 80
              ? "#22c55e"
              : sc.totalScore >= 60
                ? "#f59e0b"
                : "#ef4444";
          return (
            <div
              className="mt-4 bg-card rounded-lg p-5 border border-border"
              data-ocid="dashboard.scorecard.panel"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Performance Scorecard
                </h3>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/foundry" as string })}
                  className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                  data-ocid="dashboard.scorecard.full_button"
                >
                  View Full Scorecard →
                </button>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <svg
                    width="88"
                    height="88"
                    viewBox="0 0 88 88"
                    aria-label="Performance scorecard score"
                    role="img"
                  >
                    <circle
                      cx="44"
                      cy="44"
                      r="36"
                      fill="none"
                      stroke="var(--color-background, #0f172a)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="44"
                      cy="44"
                      r="36"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="8"
                      strokeDasharray={String(circumference)}
                      strokeDashoffset={String(offset)}
                      strokeLinecap="round"
                      transform="rotate(-90 44 44)"
                    />
                    <text
                      x="44"
                      y="48"
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {Math.round(sc.totalScore)}
                    </text>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-2">
                    Top contributors
                  </p>
                  {sc.entries.slice(0, 3).map((e) => (
                    <div
                      key={e.kpiId}
                      className="flex items-center justify-between mb-1.5"
                    >
                      <span className="text-xs text-foreground/80">
                        {e.kpiName}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1 bg-muted rounded-full">
                          <div
                            className="h-1 rounded-full bg-orange-400"
                            style={{ width: `${e.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {e.score.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <QuickActionsRow
        roleKey={resolveRoleKey(String(effectiveDisplayRole ?? ""))}
      />

      {/* ── CHANNEL ROLE DASHBOARD SECTIONS ── */}
      {resolveRoleKey(String(effectiveDisplayRole ?? "")) ===
        "channelAccountManager" && <ChannelAccountManagerDashboard />}
      {resolveRoleKey(String(effectiveDisplayRole ?? "")) ===
        "channelSalesManager" && <ChannelSalesManagerDashboard />}
      {resolveRoleKey(String(effectiveDisplayRole ?? "")) ===
        "channelDirector" && <ChannelDirectorDashboard />}

      {/* ── SECTION 4: CALENDAR WIDGET ── */}
      <div data-ocid="dashboard.calendar.section">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground font-display flex items-center gap-2">
            <CalendarDays size={15} className="text-orange-400" />
            My Calendar
          </h2>
        </div>
        <DashboardCalendarWidget
          role={String(effectiveDisplayRole ?? "")}
          orgType={String(testModeOrgType ?? "")}
        />
      </div>

      {/* ── SECTION 5: ACTIVITY STREAM + FORGEAI ── */}
      {/* ── SECTION 3b: CREDIT USAGE INSIGHTS (Primary Admin only) ── */}
      {!isRestrictedSimRole && isPrimaryAdmin() && (
        <div data-ocid="dashboard.credit_usage.section">
          <h2 className="text-sm font-semibold text-foreground font-display flex items-center gap-2 mb-3">
            <Zap size={15} className="text-orange-400" />
            Credit Usage Insights
          </h2>
          <CreditUsageInsightsWidget />
        </div>
      )}

      <div
        className="flex flex-col lg:flex-row gap-4"
        data-ocid="dashboard.intelligence.section"
      >
        {/* LEFT — Activity Stream */}
        <div
          className="flex-1 cf-card overflow-hidden"
          data-ocid="dashboard.activity.section"
        >
          <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <h2 className="text-sm font-semibold text-foreground font-display">
              Recent Activity
            </h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(["all", "accounts", "deals", "messages"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActivityFilter(f)}
                  data-ocid={`dashboard.activity.filter.${f}`}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                    activityFilter === f
                      ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                      : "text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {filteredActivity.map((event, idx) => (
              <div
                key={event.id}
                className="px-5 py-3.5 flex items-start gap-3 hover:bg-muted/20 transition-colors"
                data-ocid={`dashboard.activity.item.${idx + 1}`}
              >
                <ActivityDot dot={event.dot} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs">
                    <span className="font-semibold text-foreground">
                      {event.account}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {event.action}
                    </span>
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground flex-shrink-0">
                  {event.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — ForgeAI Insights */}
        <div
          className="lg:w-80 cf-card overflow-hidden forgeai-card"
          data-ocid="dashboard.forgeai.section"
        >
          <div className="px-5 py-4 border-b border-orange-500/15 bg-orange-500/[0.03] flex items-center gap-2">
            <Brain size={15} className="text-orange-400" />
            <h2 className="text-sm font-semibold text-orange-400 font-display flex-1">
              ForgeAI Insights
            </h2>
            <span className="forgeai-pulse-dot" aria-label="ForgeAI active" />
          </div>
          <div className="divide-y divide-border/50">
            {insightsLoading ? (
              <div className="space-y-2 px-3 py-2">
                <div className="animate-pulse rounded-lg h-12 bg-muted" />
                <div className="animate-pulse rounded-lg h-12 bg-muted" />
                <div className="animate-pulse rounded-lg h-12 bg-muted" />
              </div>
            ) : (
              (ROLE_INSIGHTS[resolveRoleKey(effectiveDisplayRole)] ?? []).map(
                (text, i) => (
                  <div
                    key={`insight-${text.slice(0, 20)}`}
                    className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border/30 mx-3 my-2"
                    data-ocid={`dashboard.forgeai.insight.${i + 1}`}
                  >
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                    <p className="text-sm text-foreground/80">{text}</p>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
