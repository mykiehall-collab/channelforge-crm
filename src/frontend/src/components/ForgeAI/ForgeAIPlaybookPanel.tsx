import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileText,
  Flame,
  Globe,
  Lock,
  MessageSquare,
  RefreshCw,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  type GlobalFilters,
  useFilterContext,
} from "../../contexts/FilterContext";
import useProgressiveRefresh from "../../hooks/useProgressiveRefresh";
import type { OperationalRole } from "../../utils/roleIntelligenceEngine";

interface PlaybookInsight {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  action: string;
  severity: "info" | "warning" | "critical";
}

interface PlaybookData {
  name: string;
  insights: PlaybookInsight[];
}

const PLAYBOOK_DATA: Record<OperationalRole, PlaybookData> = {
  salesRep: {
    name: "Pipeline Progression Playbook",
    insights: [
      {
        id: "sr-1",
        icon: TrendingDown,
        iconColor: "text-amber-400",
        title: "3 Opportunities Stalled",
        description:
          "Desperado, Nordic Energy Group, and TechSolutions have not progressed in 14+ days.",
        action: "Review Stalled Deals",
        severity: "warning",
      },
      {
        id: "sr-2",
        icon: Clock,
        iconColor: "text-rose-400",
        title: "Renewal Due in 28 Days",
        description:
          "Adobe Systems contract £45,000 expiring soon — prep renewal before the window closes.",
        action: "Start Renewal Prep",
        severity: "warning",
      },
      {
        id: "sr-3",
        icon: Bell,
        iconColor: "text-orange-400",
        title: "Engagement Reminder",
        description:
          "Global Pharma Holdings — no activity logged in 7 days. Re-engage before momentum drops.",
        action: "Log Activity",
        severity: "info",
      },
      {
        id: "sr-4",
        icon: Zap,
        iconColor: "text-primary",
        title: "Next Best Action",
        description:
          "Follow up with Ingram Micro after proposal sent 3 days ago — response window closing.",
        action: "Send Follow-up",
        severity: "info",
      },
    ],
  },
  bdr: {
    name: "Prospecting Playbook",
    insights: [
      {
        id: "bdr-1",
        icon: Target,
        iconColor: "text-primary",
        title: "12 Target Accounts Need Outreach",
        description:
          "High-priority accounts in your territory with no initial contact logged.",
        action: "View Call List",
        severity: "warning",
      },
      {
        id: "bdr-2",
        icon: RefreshCw,
        iconColor: "text-amber-400",
        title: "3 Accounts Inactive for 21 Days",
        description:
          "Engagement sequences paused — restart recommended before accounts go cold.",
        action: "Resume Sequences",
        severity: "warning",
      },
      {
        id: "bdr-3",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "Meeting Conversion Rate: 23%",
        description:
          "Below territory average of 31% — review outreach cadence and messaging.",
        action: "Review Outreach Strategy",
        severity: "critical",
      },
      {
        id: "bdr-4",
        icon: BarChart2,
        iconColor: "text-amber-400",
        title: "Pipeline Gap Alert",
        description:
          "Current pipeline £87,000 short of monthly target — add prospects urgently.",
        action: "Add Prospects",
        severity: "warning",
      },
    ],
  },
  accountManager: {
    name: "Strategic Account Playbook",
    insights: [
      {
        id: "am-1",
        icon: AlertTriangle,
        iconColor: "text-rose-400",
        title: "2 Accounts at High Renewal Risk",
        description:
          "Nordic Energy Group and Cyber Dynamics show significant engagement decline.",
        action: "Review Risk Accounts",
        severity: "critical",
      },
      {
        id: "am-2",
        icon: TrendingUp,
        iconColor: "text-emerald-400",
        title: "Expansion Opportunity Detected",
        description:
          "TechSolutions Ltd has grown 40% — strong upsell signal identified by ForgeAI.",
        action: "Explore Expansion",
        severity: "info",
      },
      {
        id: "am-3",
        icon: Users,
        iconColor: "text-amber-400",
        title: "Stakeholder Mapping Gap",
        description:
          "3 accounts missing executive sponsor contacts — relationship risk elevated.",
        action: "Update Stakeholders",
        severity: "warning",
      },
      {
        id: "am-4",
        icon: BarChart2,
        iconColor: "text-amber-400",
        title: "Renewal Health Score: 72%",
        description:
          "Below 85% target — 4 accounts need immediate attention before quarter end.",
        action: "Review Health Scores",
        severity: "warning",
      },
    ],
  },
  renewalSpecialist: {
    name: "Renewal Recovery Playbook",
    insights: [
      {
        id: "rs-1",
        icon: Flame,
        iconColor: "text-rose-400",
        title: "5 Contracts Expiring in 30 Days",
        description:
          "Total value £234,500 at risk — immediate action required across all 5 accounts.",
        action: "Open Renewal Queue",
        severity: "critical",
      },
      {
        id: "rs-2",
        icon: AlertTriangle,
        iconColor: "text-rose-400",
        title: "AI Risk Score: Nordic Energy Group 8.2/10",
        description:
          "High churn probability — low engagement combined with unresolved pricing concerns.",
        action: "View Risk Analysis",
        severity: "critical",
      },
      {
        id: "rs-3",
        icon: Clock,
        iconColor: "text-amber-400",
        title: "3 Overdue Renewal Actions",
        description:
          "Tasks not completed for Desperado, Adobe, and Global Pharma Holdings.",
        action: "Complete Actions",
        severity: "warning",
      },
      {
        id: "rs-4",
        icon: Bell,
        iconColor: "text-orange-400",
        title: "Engagement Gap",
        description:
          "7 accounts with renewal due in 60 days have had zero outreach this month.",
        action: "Schedule Outreach",
        severity: "warning",
      },
    ],
  },
  salesManager: {
    name: "Territory Review Playbook",
    insights: [
      {
        id: "sm-1",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "Forecast Gap: £127,000",
        description:
          "Team pipeline 23% below quarterly forecast — immediate pipeline review needed.",
        action: "Review Pipeline",
        severity: "critical",
      },
      {
        id: "sm-2",
        icon: Users,
        iconColor: "text-amber-400",
        title: "Rep Activity Alert",
        description:
          "2 reps below activity threshold this week — performance intervention recommended.",
        action: "View Rep Performance",
        severity: "warning",
      },
      {
        id: "sm-3",
        icon: Globe,
        iconColor: "text-amber-400",
        title: "Territory Imbalance Detected",
        description:
          "North region over-covered; South region has 3 unassigned accounts.",
        action: "Rebalance Territory",
        severity: "warning",
      },
      {
        id: "sm-4",
        icon: BarChart2,
        iconColor: "text-rose-400",
        title: "Renewal Health: 68%",
        description:
          "Team renewal rate below 80% target — review renewal risk across all accounts.",
        action: "Review Renewal Risk",
        severity: "critical",
      },
    ],
  },
  marketing: {
    name: "Partner Engagement Playbook",
    insights: [
      {
        id: "mkt-1",
        icon: DollarSign,
        iconColor: "text-amber-400",
        title: "MDF Utilisation: 64%",
        description:
          "3 resellers have unclaimed MDF funds expiring this quarter — alert them now.",
        action: "Alert Resellers",
        severity: "warning",
      },
      {
        id: "mkt-2",
        icon: TrendingDown,
        iconColor: "text-amber-400",
        title: "Campaign Adoption: 41%",
        description:
          "Partner campaign kit downloaded by fewer than half of eligible resellers.",
        action: "Drive Adoption",
        severity: "warning",
      },
      {
        id: "mkt-3",
        icon: BarChart2,
        iconColor: "text-primary",
        title: "Asset Performance",
        description:
          "Top 3 assets this month: Product Overview PDF, Demo Video, Pricing Guide.",
        action: "View Analytics",
        severity: "info",
      },
      {
        id: "mkt-4",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "Partner Engagement Score: 58%",
        description:
          "Below 75% target — 5 resellers showing low activity this quarter.",
        action: "Review Partners",
        severity: "critical",
      },
    ],
  },
  partnerMarketing: {
    name: "Channel Activation Playbook",
    insights: [
      {
        id: "pm-1",
        icon: BookOpen,
        iconColor: "text-amber-400",
        title: "Reseller Enablement Score: 62%",
        description:
          "8 resellers have not completed latest product training — send reminders.",
        action: "Send Training Reminder",
        severity: "warning",
      },
      {
        id: "pm-2",
        icon: FileText,
        iconColor: "text-primary",
        title: "Shared Asset Downloads: 234 This Month",
        description:
          "Top performing asset: Partner Battlecard — high engagement across network.",
        action: "View Asset Analytics",
        severity: "info",
      },
      {
        id: "pm-3",
        icon: TrendingDown,
        iconColor: "text-amber-400",
        title: "Co-selling Campaign: Low Uptake",
        description:
          "Only 12 of 45 eligible resellers joined Q1 campaign — drive participation.",
        action: "Drive Participation",
        severity: "warning",
      },
      {
        id: "pm-4",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "Partner Engagement Score: 58%",
        description:
          "Below 75% target — immediate engagement review recommended.",
        action: "Review Engagement",
        severity: "critical",
      },
    ],
  },
  salesOps: {
    name: "Operational Governance Playbook",
    insights: [
      {
        id: "so-1",
        icon: AlertTriangle,
        iconColor: "text-rose-400",
        title: "4 Allocation Conflicts Detected",
        description:
          "Duplicate account assignments across Reseller A and Reseller B — resolve now.",
        action: "Resolve Conflicts",
        severity: "critical",
      },
      {
        id: "so-2",
        icon: Building2,
        iconColor: "text-amber-400",
        title: "Hierarchy Issue",
        description:
          "2 accounts with missing Distributor relationship in the hierarchy.",
        action: "Fix Hierarchy",
        severity: "warning",
      },
      {
        id: "so-3",
        icon: BarChart2,
        iconColor: "text-muted-foreground",
        title: "Report Usage Low",
        description:
          "6 reports not accessed in 30 days — review and identify retirement candidates.",
        action: "Audit Reports",
        severity: "info",
      },
      {
        id: "so-4",
        icon: TrendingDown,
        iconColor: "text-amber-400",
        title: "Data Quality Score: 84%",
        description: "Below 95% target — 23 accounts missing required fields.",
        action: "Fix Data Quality",
        severity: "warning",
      },
      {
        id: "so-5",
        icon: ExternalLink,
        iconColor: "text-primary",
        title: "Price List Health: Last Upload 5 Days Ago",
        description:
          "Active version: v4. Price list is current — next scheduled review in 25 days.",
        action: "View Price List",
        severity: "info",
      },
      {
        id: "so-6",
        icon: CheckCircle2,
        iconColor: "text-emerald-400",
        title: "Price List Version: v4 — Active",
        description:
          "Current price list is active and approved. No conflicts detected across 347 SKUs.",
        action: "View Version History",
        severity: "info",
      },
      {
        id: "so-7",
        icon: Clock,
        iconColor: "text-amber-400",
        title: "Promotional Pricing Expiry: 23 Days",
        description:
          "Q4 promotional pricing ends in 23 days. 14 active quotes using promo rates — ensure renewals or extensions are submitted in time.",
        action: "Review Promo Quotes",
        severity: "warning",
      },
    ],
  },
  finance: {
    name: "Operational Spend Playbook",
    insights: [
      {
        id: "fin-1",
        icon: Flame,
        iconColor: "text-rose-400",
        title: "Credit Burn Rate: £12,340/month",
        description:
          "Projected exhaustion in 4.2 months at current consumption rate.",
        action: "Review Usage",
        severity: "critical",
      },
      {
        id: "fin-2",
        icon: TrendingUp,
        iconColor: "text-emerald-400",
        title: "Forecasted Renewal Value: £487,000",
        description:
          "Next 90 days renewal pipeline — strong recovery opportunity this quarter.",
        action: "View Forecast",
        severity: "info",
      },
      {
        id: "fin-3",
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        title: "AI Usage Spike",
        description:
          "340% increase in AI credits consumed this week vs last — investigate source.",
        action: "Investigate Usage",
        severity: "warning",
      },
      {
        id: "fin-4",
        icon: BarChart2,
        iconColor: "text-rose-400",
        title: "Infrastructure Spend",
        description:
          "Storage credits 87% consumed — allocation review needed before overage.",
        action: "Review Allocation",
        severity: "warning",
      },
    ],
  },
  itOperations: {
    name: "Infrastructure Governance Playbook",
    insights: [
      {
        id: "it-1",
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        title: "Integration Health: 2 Warnings",
        description:
          "Salesforce sync delayed 4 hours; SharePoint connector experiencing timeouts.",
        action: "Review Integrations",
        severity: "warning",
      },
      {
        id: "it-2",
        icon: FileText,
        iconColor: "text-rose-400",
        title: "3 Failed Import Jobs",
        description:
          "CSV imports failed validation in the last 24 hours — check import logs.",
        action: "View Import Logs",
        severity: "critical",
      },
      {
        id: "it-3",
        icon: CheckCircle2,
        iconColor: "text-emerald-400",
        title: "Cloud Engine Status: Operational",
        description:
          "All canisters operational — last health check completed 8 minutes ago.",
        action: "View Infrastructure",
        severity: "info",
      },
      {
        id: "it-4",
        icon: TrendingUp,
        iconColor: "text-emerald-400",
        title: "Operational Stability: 99.2%",
        description:
          "One minor degradation event this week — stability remains within SLA.",
        action: "View Stability Log",
        severity: "info",
      },
    ],
  },
  securityAdmin: {
    name: "Security Governance Playbook",
    insights: [
      {
        id: "sec-1",
        icon: AlertTriangle,
        iconColor: "text-rose-400",
        title: "3 Access Anomalies",
        description:
          "Users accessing accounts outside their assigned territory — review immediately.",
        action: "Review Anomalies",
        severity: "critical",
      },
      {
        id: "sec-2",
        icon: Shield,
        iconColor: "text-amber-400",
        title: "SSO Health: 94%",
        description:
          "2 users with expired SSO sessions — force re-authentication recommended.",
        action: "Force Re-auth",
        severity: "warning",
      },
      {
        id: "sec-3",
        icon: Lock,
        iconColor: "text-amber-400",
        title: "MFA Adoption: 87%",
        description:
          "4 users without MFA enabled — enforcement recommended for compliance.",
        action: "Enforce MFA",
        severity: "warning",
      },
      {
        id: "sec-4",
        icon: Bell,
        iconColor: "text-primary",
        title: "5 Open Access Requests",
        description:
          "Pending approval — 2 high-risk requests require Primary Admin review.",
        action: "Review Requests",
        severity: "warning",
      },
    ],
  },
  customerSuccess: {
    name: "Customer Lifecycle Playbook",
    insights: [
      {
        id: "cs-1",
        icon: AlertTriangle,
        iconColor: "text-rose-400",
        title: "4 Accounts Below Health Threshold",
        description:
          "Health score below 60 — immediate attention needed before escalation risk rises.",
        action: "View At-Risk Accounts",
        severity: "critical",
      },
      {
        id: "cs-2",
        icon: Clock,
        iconColor: "text-amber-400",
        title: "Onboarding Stalled: 2 Accounts",
        description:
          "Onboarding tasks incomplete for 14+ days — intervention required.",
        action: "Resume Onboarding",
        severity: "warning",
      },
      {
        id: "cs-3",
        icon: TrendingDown,
        iconColor: "text-amber-400",
        title: "Adoption Score: 71%",
        description:
          "Product feature adoption below 80% target for 5 accounts — drive engagement.",
        action: "Drive Adoption",
        severity: "warning",
      },
      {
        id: "cs-4",
        icon: Flame,
        iconColor: "text-rose-400",
        title: "Escalation Alert",
        description:
          "1 open escalation from Desperado — response overdue, escalate immediately.",
        action: "Resolve Escalation",
        severity: "critical",
      },
    ],
  },
  leadership: {
    name: "Strategic Command Playbook",
    insights: [
      {
        id: "ld-1",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "Revenue Attainment: 78%",
        description:
          "£345,000 behind quarterly target — strategic pipeline review required.",
        action: "View Revenue Dashboard",
        severity: "critical",
      },
      {
        id: "ld-2",
        icon: Building2,
        iconColor: "text-amber-400",
        title: "Ecosystem Health: 82%",
        description:
          "3 reseller relationships showing decline in activity — engagement needed.",
        action: "View Ecosystem",
        severity: "warning",
      },
      {
        id: "ld-3",
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        title: "Renewal Exposure: £567,000",
        description:
          "Contracts at risk in next 90 days — leadership visibility recommended.",
        action: "View Renewal Risk",
        severity: "warning",
      },
      {
        id: "ld-4",
        icon: BarChart2,
        iconColor: "text-amber-400",
        title: "Forecast Accuracy: 74%",
        description:
          "Below 85% target — pipeline quality review recommended across all teams.",
        action: "Review Forecast",
        severity: "warning",
      },
    ],
  },
  regionalDirector: {
    name: "Executive Territory Playbook",
    insights: [
      {
        id: "rd-1",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "Revenue Attainment: 78%",
        description:
          "£345,000 behind quarterly regional target — team review required.",
        action: "View Revenue Dashboard",
        severity: "critical",
      },
      {
        id: "rd-2",
        icon: Globe,
        iconColor: "text-amber-400",
        title: "Ecosystem Health: 82%",
        description:
          "3 reseller relationships in your region showing decline in activity.",
        action: "View Ecosystem",
        severity: "warning",
      },
      {
        id: "rd-3",
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        title: "Renewal Exposure: £567,000",
        description:
          "Contracts at regional risk in next 90 days — escalation visibility needed.",
        action: "View Renewal Risk",
        severity: "warning",
      },
      {
        id: "rd-4",
        icon: BarChart2,
        iconColor: "text-amber-400",
        title: "Forecast Accuracy: 74%",
        description:
          "Below 85% target — pipeline quality review recommended across region.",
        action: "Review Forecast",
        severity: "warning",
      },
    ],
  },
  dealDesk: {
    name: "Deal Velocity Playbook",
    insights: [
      {
        id: "dd-1",
        icon: Flame,
        iconColor: "text-rose-400",
        title: "7 Pending Approvals",
        description:
          "3 are SLA-critical and overdue — immediate review required to avoid breach.",
        action: "Review Queue",
        severity: "critical",
      },
      {
        id: "dd-2",
        icon: Clock,
        iconColor: "text-amber-400",
        title: "Avg Approval Time: 18 Hours",
        description:
          "Above 12-hour SLA target — expedite pending approvals to restore compliance.",
        action: "Expedite Approvals",
        severity: "warning",
      },
      {
        id: "dd-3",
        icon: TrendingUp,
        iconColor: "text-amber-400",
        title: "Exception Volume Up 23%",
        description:
          "More pricing exceptions this week vs last — pattern review suggested.",
        action: "Review Exceptions",
        severity: "warning",
      },
      {
        id: "dd-4",
        icon: MessageSquare,
        iconColor: "text-primary",
        title: "Deal Registration Backlog: 4 Pending",
        description:
          "Awaiting Distributor confirmation — follow up to unblock registrations.",
        action: "Follow Up",
        severity: "info",
      },
      {
        id: "dd-5",
        icon: AlertTriangle,
        iconColor: "text-rose-400",
        title: "Pricing Governance: Pending Approval",
        description:
          "2 pricing approval requests pending Deal Desk sign-off — Desperado and Nordic Energy Group.",
        action: "Review Approvals",
        severity: "critical",
      },
      {
        id: "dd-6",
        icon: Clock,
        iconColor: "text-amber-400",
        title: "Quote Approval SLA: 2 Days Remaining",
        description:
          "Nordic Energy Group quote must be approved within 48 hours to meet contracted SLA.",
        action: "Approve Now",
        severity: "warning",
      },
      {
        id: "dd-7",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "Margin Threshold Warning",
        description:
          "Apex Financial Services quote is 22% below standard margin floor — exception approval required.",
        action: "Flag Exception",
        severity: "critical",
      },
    ],
  },
  channelAccountManager: {
    name: "CAM Ecosystem Playbook",
    insights: [
      {
        id: "cam-1",
        icon: Building2,
        iconColor: "text-amber-400",
        title: "Distributor Pipeline Down 8% QoQ",
        description:
          "Crayon Nordics pipeline declined 8% quarter-over-quarter — engagement review recommended.",
        action: "Review Distributor",
        severity: "warning",
      },
      {
        id: "cam-2",
        icon: TrendingUp,
        iconColor: "text-emerald-400",
        title: "ATEA Renewal Activity Up 14%",
        description:
          "Renewal engagement increased 14% this quarter — positive momentum signal.",
        action: "View Renewals",
        severity: "info",
      },
      {
        id: "cam-3",
        icon: Users,
        iconColor: "text-rose-400",
        title: "Reseller Engagement Low in UK Tier 1",
        description:
          "3 resellers in UK Tier 1 territory show no activity in 30 days.",
        action: "Review Resellers",
        severity: "critical",
      },
      {
        id: "cam-4",
        icon: DollarSign,
        iconColor: "text-amber-400",
        title: "MDF Utilization Below Forecast",
        description:
          "Current MDF spend is 62% of forecast — 4 campaigns underutilized.",
        action: "Review MDF",
        severity: "warning",
      },
    ],
  },
  channelSalesManager: {
    name: "Regional Ecosystem Playbook",
    insights: [
      {
        id: "csm-1",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "Nordics Ecosystem Forecast Below Target",
        description:
          "Nordics ecosystem forecast trending 6% below quarterly target — CAM intervention needed.",
        action: "Review Forecast",
        severity: "critical",
      },
      {
        id: "csm-2",
        icon: Users,
        iconColor: "text-amber-400",
        title: "3 CAM Territories Declining",
        description:
          "Three CAM-managed territories show declining reseller activity month-over-month.",
        action: "Review Territories",
        severity: "warning",
      },
      {
        id: "csm-3",
        icon: AlertTriangle,
        iconColor: "text-rose-400",
        title: "Renewal Risk Concentrated in DACH",
        description:
          "£312,000 renewal exposure concentrated in DACH region — escalation recommended.",
        action: "View Renewal Risk",
        severity: "critical",
      },
      {
        id: "csm-4",
        icon: BarChart2,
        iconColor: "text-primary",
        title: "Tier 1 vs Tier 2 Gap Widening",
        description:
          "Tier 1 territories outperforming Tier 2 by 18% — rebalancing strategy needed.",
        action: "Review Strategy",
        severity: "info",
      },
    ],
  },
  channelDirector: {
    name: "Executive Channel Playbook",
    insights: [
      {
        id: "cd-1",
        icon: TrendingDown,
        iconColor: "text-rose-400",
        title: "EMEA Forecast 6% Below YoY Plan",
        description:
          "EMEA ecosystem forecast now 6% below year-over-year growth plan — strategic review required.",
        action: "Review Forecast",
        severity: "critical",
      },
      {
        id: "cd-2",
        icon: BarChart2,
        iconColor: "text-amber-400",
        title: "Tier 1 Outperforming Tier 2 by 18%",
        description:
          "Performance gap between Tier 1 and Tier 2 territories continues to widen.",
        action: "View Performance",
        severity: "warning",
      },
      {
        id: "cd-3",
        icon: AlertTriangle,
        iconColor: "text-rose-400",
        title: "Distributor Concentration Risk Increasing",
        description:
          "Top 3 Distributors represent 72% of ecosystem revenue — diversification recommended.",
        action: "Assess Risk",
        severity: "critical",
      },
      {
        id: "cd-4",
        icon: Shield,
        iconColor: "text-amber-400",
        title: "Renewal Exposure Elevated in Healthcare",
        description:
          "Strategic healthcare accounts show elevated renewal exposure — governance review needed.",
        action: "Review Exposure",
        severity: "warning",
      },
    ],
  },
};

const SEVERITY_STYLES: Record<PlaybookInsight["severity"], string> = {
  info: "border-border/60 bg-secondary/20",
  warning: "border-amber-500/20 bg-amber-500/5",
  critical: "border-rose-500/20 bg-rose-500/5",
};

const SEVERITY_DOT: Record<PlaybookInsight["severity"], string> = {
  info: "bg-primary/60",
  warning: "bg-amber-400",
  critical: "bg-rose-400",
};

function getFilterAwareInsights(
  baseInsights: PlaybookInsight[],
  filters: GlobalFilters,
): PlaybookInsight[] {
  const active: string[] = [];
  if (filters.vendor) active.push(filters.vendor);
  if (filters.region) active.push(filters.region);
  if (filters.productFamily) active.push(filters.productFamily);
  if (filters.distributor) active.push(filters.distributor);
  if (filters.territory) active.push(filters.territory);
  if (filters.resellerGroup) active.push(filters.resellerGroup);
  if (filters.product) active.push(filters.product);
  if (filters.industry) active.push(filters.industry);
  if (filters.customerSegment) active.push(filters.customerSegment);
  if (filters.countryTier) active.push(filters.countryTier);
  if (filters.opportunityStage) active.push(filters.opportunityStage);
  if (filters.renewalStatus) active.push(filters.renewalStatus);

  if (active.length === 0) return baseInsights;

  const prefix = active.slice(0, 3).join(" / ");

  return baseInsights.map((insight) => {
    let title = insight.title;
    let description = insight.description;

    if (filters.vendor) {
      const v = filters.vendor;
      if (!title.toLowerCase().includes(v.toLowerCase())) {
        title = `${v} — ${title}`;
      }
      if (!description.toLowerCase().includes(v.toLowerCase())) {
        description = `${description} (filtered to ${v})`;
      }
    }

    if (filters.region) {
      const r = filters.region;
      if (!description.toLowerCase().includes(r.toLowerCase())) {
        description = `${description} in ${r}`;
      }
    }

    if (filters.productFamily) {
      const p = filters.productFamily;
      if (!description.toLowerCase().includes(p.toLowerCase())) {
        description = `${description} for ${p}`;
      }
    }

    return {
      ...insight,
      title,
      description: `${description} — active view: ${prefix}`,
    };
  });
}

interface ForgeAIPlaybookPanelProps {
  role: OperationalRole;
  playbookName: string;
  orgType?: string;
  onAction?: (action: string, insight: string) => void;
}

export function ForgeAIPlaybookPanel({
  role,
  playbookName,
  orgType,
  onAction,
}: ForgeAIPlaybookPanelProps) {
  const { filters, activeFilterCount } = useFilterContext();
  const { insightsLoading } = useProgressiveRefresh(filters);

  const data = PLAYBOOK_DATA[role];
  if (!data) return null;

  const insights = getFilterAwareInsights(data.insights, filters);

  const criticalCount = insights.filter(
    (i) => i.severity === "critical",
  ).length;
  const warningCount = insights.filter((i) => i.severity === "warning").length;

  const activeLabels: string[] = [];
  if (filters.vendor) activeLabels.push(filters.vendor);
  if (filters.region) activeLabels.push(filters.region);
  if (filters.productFamily) activeLabels.push(filters.productFamily);
  if (filters.distributor) activeLabels.push(filters.distributor);
  if (filters.territory) activeLabels.push(filters.territory);
  if (filters.resellerGroup) activeLabels.push(filters.resellerGroup);
  if (filters.product) activeLabels.push(filters.product);
  if (filters.industry) activeLabels.push(filters.industry);
  if (filters.customerSegment) activeLabels.push(filters.customerSegment);
  if (filters.countryTier) activeLabels.push(filters.countryTier);
  if (filters.opportunityStage) activeLabels.push(filters.opportunityStage);
  if (filters.renewalStatus) activeLabels.push(filters.renewalStatus);

  return (
    <div className="flex flex-col gap-3" data-ocid="forgeai.playbook_panel">
      {/* Playbook header */}
      <div
        className="rounded-xl border border-primary/20 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.04 250 / 0.9) 0%, oklch(0.14 0.03 250 / 0.95) 100%)",
          boxShadow:
            "0 0 20px oklch(0.65 0.24 32 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.06)",
        }}
      >
        <div className="px-3 py-2.5 flex items-start gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.24 32 / 0.25), oklch(0.55 0.22 32 / 0.15))",
              border: "1px solid oklch(0.65 0.24 32 / 0.35)",
            }}
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
                Active Playbook
              </span>
              {orgType && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary/40 border border-border text-muted-foreground">
                  {orgType}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-foreground font-display leading-tight truncate">
              {playbookName}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {criticalCount > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-400 font-semibold">
                {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 font-semibold">
                {warningCount} warnings
              </span>
            )}
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && activeLabels.length > 0 && (
        <div
          className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 flex items-center gap-2"
          data-ocid="forgeai.playbook.filter_label"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Insights filtered to:
          </span>
          <span className="text-[11px] font-medium text-foreground truncate">
            {activeLabels.slice(0, 3).join(" / ")}
            {activeLabels.length > 3 && " …"}
          </span>
        </div>
      )}

      {insightsLoading && (
        <div className="flex items-center justify-center py-4 gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="text-[11px] text-muted-foreground font-body">
            Recalculating insights…
          </span>
        </div>
      )}

      {/* Insight cards */}
      <div
        className={`flex flex-col gap-2 ${insightsLoading ? "opacity-50" : "opacity-100"} transition-opacity duration-300`}
      >
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className={`rounded-xl border p-3 transition-all duration-200 hover:shadow-sm ${SEVERITY_STYLES[insight.severity]}`}
              data-ocid={`forgeai.playbook.insight.${insight.id}`}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-secondary/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className={`w-3.5 h-3.5 ${insight.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${SEVERITY_DOT[insight.severity]}`}
                    />
                    <p className="text-xs font-semibold text-foreground font-display leading-tight truncate">
                      {insight.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed mb-2">
                    {insight.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => onAction?.(insight.action, insight.title)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors duration-150 group"
                    data-ocid={`forgeai.playbook.action.${insight.id}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    {insight.action}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-[10px] text-muted-foreground/60 text-center font-body px-1">
        ForgeAI operational intelligence — updated in real time based on your
        role
      </p>
    </div>
  );
}
