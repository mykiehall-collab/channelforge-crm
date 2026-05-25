import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  BarChart2,
  BarChart3,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Eye,
  FileBarChart,
  FileText,
  Globe,
  Layers,
  Lock,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Share2,
  Shield,
  Table2,
  TrendingUp,
  Unlock,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "../AppContext";
import type { Account, DealRegistration, ReportFilters } from "../backend";
import { AccountStatus, DealStatus } from "../backend";
import { AccessDenied } from "../components/AccessDenied";
import { CurrencySelector } from "../components/CurrencySelector";
import type { SavedReport } from "../components/ReportBuilder";
import { ReportBuilder, ShareModal } from "../components/ReportBuilder";
import { useFilterContext } from "../contexts/FilterContext";
import { useActor } from "../hooks/useActor";
import { useForex } from "../hooks/useForex";
import {
  accountStatusColor,
  dealStatusColor,
  dealStatusLabel,
  formatDate,
} from "../utils/channelforge";
import {
  PROVIDER_NAMES,
  convertCurrency,
  formatCurrencyAmount,
  getHistoricalRateVariance,
} from "../utils/forex";

// ─── Types ─────────────────────────────────────────────────────────────────

type ReportType = "renewal" | "pipeline" | "dealreg" | "custom";
type FxMode = "live" | "historical";
type ResultView = "table" | "chart";
type SidebarSection = "library" | "shared" | "prebuilt" | "shared_dashboards";

// ─── Source labels ──────────────────────────────────────────────────────────

const SOURCE_LABEL_MAP: Record<string, string> = {
  customer_accounts: "Customer Accounts",
  deal_registrations: "Deal Registrations",
  opportunities: "Opportunities",
  renewals: "Renewals",
  business_plans: "Business Plans",
  mdf_requests: "MDF Requests",
  promotions: "Promotions",
  marketing_activities: "Marketing Activities",
};

// ─── Pre-built report templates ─────────────────────────────────────────────

interface PrebuiltTemplate {
  id: string;
  category: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  type?: "renewal" | "pipeline" | "dealreg";
}

const PREBUILT_CATEGORIES: {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: PrebuiltTemplate[];
}[] = [
  {
    id: "accounts",
    label: "Account Reports",
    icon: <Layers className="w-3.5 h-3.5" />,
    items: [
      {
        id: "acc_status",
        category: "accounts",
        label: "Accounts by Status",
        description: "All customer accounts segmented by current status.",
        icon: null,
      },
      {
        id: "acc_region",
        category: "accounts",
        label: "Accounts by Region",
        description: "Account distribution across regions and territories.",
        icon: null,
      },
      {
        id: "acc_health",
        category: "accounts",
        label: "Account Health",
        description: "Health scores, risk levels, and engagement metrics.",
        icon: null,
      },
    ],
  },
  {
    id: "renewals",
    label: "Renewal Reports",
    icon: <RefreshCcw className="w-3.5 h-3.5" />,
    items: [
      {
        id: "ren_due",
        category: "renewals",
        label: "Renewals Due",
        description: "Contracts expiring within the next 90 days.",
        icon: null,
        type: "renewal",
      },
      {
        id: "ren_risk",
        category: "renewals",
        label: "At-Risk Renewals",
        description: "High-risk accounts with low engagement scores.",
        icon: null,
        type: "renewal",
      },
      {
        id: "ren_perf",
        category: "renewals",
        label: "Renewal Performance",
        description: "Renewal win rates and revenue impact by reseller.",
        icon: null,
        type: "renewal",
      },
    ],
  },
  {
    id: "pipeline",
    label: "Pipeline Reports",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    items: [
      {
        id: "pip_opp",
        category: "pipeline",
        label: "Opportunity Pipeline",
        description: "All open opportunities by stage and close date.",
        icon: null,
        type: "pipeline",
      },
      {
        id: "pip_winloss",
        category: "pipeline",
        label: "Win/Loss Analysis",
        description: "Closed deals with win/loss breakdown and reasons.",
        icon: null,
        type: "pipeline",
      },
      {
        id: "pip_forecast",
        category: "pipeline",
        label: "Forecast",
        description: "Weighted forecast by quarter and distributor.",
        icon: null,
        type: "pipeline",
      },
    ],
  },
  {
    id: "partner",
    label: "Partner Reports",
    icon: <Users className="w-3.5 h-3.5" />,
    items: [
      {
        id: "par_reseller",
        category: "partner",
        label: "Reseller Performance",
        description: "Revenue, pipeline, and activity by reseller.",
        icon: null,
        type: "dealreg",
      },
      {
        id: "par_dist",
        category: "partner",
        label: "Distributor Activity",
        description: "Distributor engagement, accounts managed, and MDF.",
        icon: null,
        type: "dealreg",
      },
      {
        id: "par_tier",
        category: "partner",
        label: "Partner Tiers",
        description: "Tier status and qualification progress by partner.",
        icon: null,
      },
    ],
  },
  {
    id: "mdf",
    label: "MDF Reports",
    icon: <FileBarChart className="w-3.5 h-3.5" />,
    items: [
      {
        id: "mdf_spend",
        category: "mdf",
        label: "MDF Spend",
        description: "Total MDF requested and approved by quarter.",
        icon: null,
      },
      {
        id: "mdf_roi",
        category: "mdf",
        label: "MDF ROI",
        description: "Return on investment per MDF campaign.",
        icon: null,
      },
      {
        id: "mdf_pending",
        category: "mdf",
        label: "Pending MDF",
        description: "Unresolved MDF requests awaiting approval.",
        icon: null,
      },
    ],
  },
  {
    id: "activity",
    label: "Activity Reports",
    icon: <BarChart2 className="w-3.5 h-3.5" />,
    items: [
      {
        id: "act_user",
        category: "activity",
        label: "User Activity",
        description: "Login history, actions, and system activity by user.",
        icon: null,
      },
      {
        id: "act_account",
        category: "activity",
        label: "Account Activity",
        description: "Notes, calls, emails, and meetings per account.",
        icon: null,
      },
      {
        id: "act_audit",
        category: "activity",
        label: "Login Audit",
        description: "Authentication events and session history.",
        icon: null,
      },
    ],
  },
];

// ─── Sample saved reports ────────────────────────────────────────────────────

const SAMPLE_MY_REPORTS: SavedReport[] = [
  {
    id: "r1",
    name: "Q3 Renewal Risk Summary",
    description:
      "High-risk renewals expiring within 90 days across all resellers.",
    dataSource: "renewals",
    columns: [
      "Account Name",
      "Renewal Date",
      "Risk Score",
      "Reseller",
      "Estimated Value",
    ],
    filters: [],
    shareLevel: "internal",
    sharedDepts: [],
    createdAt: "2026-04-10T09:00:00Z",
    owner: "You",
    lastRun: "2026-05-15T14:22:00Z",
  },
  {
    id: "r2",
    name: "Active Pipeline by Distributor",
    description: "Open opportunities segmented by distributor and deal stage.",
    dataSource: "opportunities",
    columns: [
      "Opportunity Name",
      "Stage",
      "Amount",
      "Distributor",
      "Close Date",
    ],
    filters: [],
    shareLevel: "private",
    sharedDepts: [],
    createdAt: "2026-03-22T11:30:00Z",
    owner: "You",
    lastRun: "2026-05-14T09:00:00Z",
  },
  {
    id: "r3",
    name: "Deal Registration Approval Status",
    description:
      "Pending and recently approved deal registrations by reseller.",
    dataSource: "deal_registrations",
    columns: [
      "Opportunity Name",
      "Reseller",
      "Submitted Date",
      "Status",
      "Estimated Value",
    ],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Deal Desk", "Sales Operations"],
    createdAt: "2026-02-18T08:45:00Z",
    owner: "You",
    lastRun: "2026-05-16T16:05:00Z",
  },
];

const SAMPLE_SHARED_REPORTS: (SavedReport & {
  sharedBy: string;
  permLevel: string;
  visibility: string;
})[] = [
  {
    id: "sr1",
    name: "Vendor Channel Health Overview",
    description: "Cross-vendor channel health scores and engagement metrics.",
    dataSource: "customer_accounts",
    columns: [
      "Account Name",
      "Status",
      "Risk Level",
      "Vendor",
      "Last Activity",
    ],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Leadership", "Sales"],
    createdAt: "2026-01-05T10:00:00Z",
    owner: "Sarah Mitchell",
    lastRun: "2026-05-17T08:00:00Z",
    sharedBy: "Sarah Mitchell",
    permLevel: "View Only",
    visibility: "Internal",
  },
  {
    id: "sr2",
    name: "MDF Spend & ROI Tracker",
    description: "Quarterly MDF spend, approved amounts, and ROI by partner.",
    dataSource: "mdf_requests",
    columns: [
      "Partner",
      "Campaign",
      "Requested Amount",
      "Approved Amount",
      "ROI",
      "Status",
    ],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Marketing", "Finance"],
    createdAt: "2026-04-01T12:00:00Z",
    owner: "James O'Brien",
    lastRun: "2026-05-10T11:30:00Z",
    sharedBy: "James O'Brien",
    permLevel: "View & Export",
    visibility: "Internal",
  },
];

// ─── Shared Dashboards Types & Data ─────────────────────────────────────────

type LinkedOrg = {
  id: string;
  name: string;
  type: "Vendor" | "Distributor" | "Reseller";
};

type OrgShareConfig = {
  orgId: string;
  enabled: boolean;
  exportFormats: ("PDF" | "CSV" | "Excel")[];
};

type SharedDashboardEntry = {
  id: string;
  name: string;
  type: string;
  orgConfigs: OrgShareConfig[];
  filterScope: string;
  exportAllowed: boolean;
};

type AuditEvent = {
  id: string;
  who: string;
  org: string;
  dashboard: string;
  action: "viewed" | "exported" | "shared" | "revoked";
  timestamp: string;
};

const LINKED_ORGS: LinkedOrg[] = [
  { id: "org-adobe", name: "Adobe", type: "Vendor" },
  { id: "org-ingram", name: "Ingram Micro", type: "Distributor" },
  { id: "org-nordic", name: "Nordic Cloud Solutions", type: "Reseller" },
];

const INITIAL_DASHBOARDS: SharedDashboardEntry[] = [
  {
    id: "dash-qtd",
    name: "QTD Performance",
    type: "Performance",
    orgConfigs: [
      { orgId: "org-adobe", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF"] },
      { orgId: "org-nordic", enabled: false, exportFormats: [] },
    ],
    filterScope: "Assigned accounts only",
    exportAllowed: true,
  },
  {
    id: "dash-renewal",
    name: "Renewal Risk",
    type: "Risk",
    orgConfigs: [
      {
        orgId: "org-adobe",
        enabled: true,
        exportFormats: ["PDF", "CSV", "Excel"],
      },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-nordic", enabled: true, exportFormats: ["PDF"] },
    ],
    filterScope: "Assigned accounts only",
    exportAllowed: true,
  },
  {
    id: "dash-pipeline",
    name: "Pipeline Overview",
    type: "Pipeline",
    orgConfigs: [
      { orgId: "org-adobe", enabled: false, exportFormats: [] },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-nordic", enabled: true, exportFormats: ["PDF"] },
    ],
    filterScope: "Downstream visibility",
    exportAllowed: true,
  },
  {
    id: "dash-mdf",
    name: "MDF ROI",
    type: "MDF",
    orgConfigs: [
      {
        orgId: "org-adobe",
        enabled: true,
        exportFormats: ["PDF", "CSV", "Excel"],
      },
      {
        orgId: "org-ingram",
        enabled: true,
        exportFormats: ["PDF", "CSV", "Excel"],
      },
      { orgId: "org-nordic", enabled: false, exportFormats: [] },
    ],
    filterScope: "Campaign-level",
    exportAllowed: true,
  },
  {
    id: "dash-deal",
    name: "Deal Registration Performance",
    type: "Deal Reg",
    orgConfigs: [
      { orgId: "org-adobe", enabled: true, exportFormats: ["PDF"] },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-nordic", enabled: true, exportFormats: ["PDF"] },
    ],
    filterScope: "Assigned accounts only",
    exportAllowed: true,
  },
  {
    id: "dash-churn",
    name: "Churn/Save Performance",
    type: "Retention",
    orgConfigs: [
      { orgId: "org-adobe", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-ingram", enabled: false, exportFormats: [] },
      { orgId: "org-nordic", enabled: false, exportFormats: [] },
    ],
    filterScope: "Internal only",
    exportAllowed: false,
  },
  {
    id: "dash-campaign",
    name: "Campaign Performance",
    type: "Marketing",
    orgConfigs: [
      {
        orgId: "org-adobe",
        enabled: true,
        exportFormats: ["PDF", "CSV", "Excel"],
      },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-nordic", enabled: true, exportFormats: ["PDF"] },
    ],
    filterScope: "Campaign-level",
    exportAllowed: true,
  },
  {
    id: "dash-missed",
    name: "Missed Opportunity",
    type: "Opportunity",
    orgConfigs: [
      { orgId: "org-adobe", enabled: true, exportFormats: ["PDF"] },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF"] },
      { orgId: "org-nordic", enabled: false, exportFormats: [] },
    ],
    filterScope: "Territory-scoped",
    exportAllowed: true,
  },
];

const SAVED_REPORTS_FOR_SHARING: (SavedReport & {
  sharedExternally: boolean;
})[] = [
  {
    id: "shr1",
    name: "Q1 Renewal Pipeline",
    description: "Renewal pipeline summary for Q1.",
    dataSource: "renewals",
    columns: ["Account", "Renewal Date", "Value"],
    filters: [],
    shareLevel: "internal",
    sharedDepts: [],
    createdAt: "2026-01-10T09:00:00Z",
    owner: "You",
    lastRun: "2026-05-15T14:22:00Z",
    sharedExternally: true,
  },
  {
    id: "shr2",
    name: "Partner Performance",
    description: "Reseller and distributor performance metrics.",
    dataSource: "customer_accounts",
    columns: ["Partner", "Revenue", "Accounts"],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Sales"],
    createdAt: "2026-02-12T10:00:00Z",
    owner: "You",
    lastRun: "2026-05-14T09:00:00Z",
    sharedExternally: false,
  },
  {
    id: "shr3",
    name: "MDF ROI Analysis",
    description: "MDF spend and return analysis by campaign.",
    dataSource: "mdf_requests",
    columns: ["Campaign", "Spend", "ROI"],
    filters: [],
    shareLevel: "internal",
    sharedDepts: [],
    createdAt: "2026-03-05T11:30:00Z",
    owner: "You",
    lastRun: "2026-05-16T16:05:00Z",
    sharedExternally: true,
  },
  {
    id: "shr4",
    name: "Deal Registration Summary",
    description: "Summary of all deal registrations this quarter.",
    dataSource: "deal_registrations",
    columns: ["Deal", "Reseller", "Status", "Value"],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Deal Desk"],
    createdAt: "2026-04-01T08:45:00Z",
    owner: "You",
    lastRun: "2026-05-17T10:00:00Z",
    sharedExternally: false,
  },
  {
    id: "shr5",
    name: "Territory Coverage",
    description: "Territory coverage and account distribution.",
    dataSource: "customer_accounts",
    columns: ["Territory", "Accounts", "Coverage %"],
    filters: [],
    shareLevel: "internal",
    sharedDepts: [],
    createdAt: "2026-04-20T09:15:00Z",
    owner: "You",
    lastRun: "2026-05-18T11:30:00Z",
    sharedExternally: true,
  },
];

const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "a1",
    who: "Sarah Mitchell",
    org: "Adobe",
    dashboard: "QTD Performance",
    action: "viewed",
    timestamp: "2026-05-22T09:30:00Z",
  },
  {
    id: "a2",
    who: "James O'Brien",
    org: "Ingram Micro",
    dashboard: "Renewal Risk",
    action: "exported",
    timestamp: "2026-05-22T08:45:00Z",
  },
  {
    id: "a3",
    who: "Lisa Chen",
    org: "Nordic Cloud Solutions",
    dashboard: "Pipeline Overview",
    action: "viewed",
    timestamp: "2026-05-21T16:20:00Z",
  },
  {
    id: "a4",
    who: "Sarah Mitchell",
    org: "Adobe",
    dashboard: "MDF ROI",
    action: "shared",
    timestamp: "2026-05-21T14:10:00Z",
  },
  {
    id: "a5",
    who: "James O'Brien",
    org: "Ingram Micro",
    dashboard: "Deal Registration Performance",
    action: "viewed",
    timestamp: "2026-05-21T11:00:00Z",
  },
  {
    id: "a6",
    who: "Lisa Chen",
    org: "Nordic Cloud Solutions",
    dashboard: "Campaign Performance",
    action: "exported",
    timestamp: "2026-05-20T15:30:00Z",
  },
  {
    id: "a7",
    who: "Sarah Mitchell",
    org: "Adobe",
    dashboard: "QTD Performance",
    action: "viewed",
    timestamp: "2026-05-20T10:15:00Z",
  },
  {
    id: "a8",
    who: "James O'Brien",
    org: "Ingram Micro",
    dashboard: "Renewal Risk",
    action: "viewed",
    timestamp: "2026-05-19T09:45:00Z",
  },
  {
    id: "a9",
    who: "Lisa Chen",
    org: "Nordic Cloud Solutions",
    dashboard: "Pipeline Overview",
    action: "revoked",
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "a10",
    who: "Sarah Mitchell",
    org: "Adobe",
    dashboard: "Missed Opportunity",
    action: "viewed",
    timestamp: "2026-05-18T17:00:00Z",
  },
];

// ─── Built-in report meta ────────────────────────────────────────────────────

interface ReportMeta {
  id: ReportType;
  label: string;
  statusOptions: string[];
}

const REPORTS: ReportMeta[] = [
  {
    id: "renewal",
    label: "Renewal Report",
    statusOptions: Object.values(AccountStatus),
  },
  {
    id: "pipeline",
    label: "Pipeline Report",
    statusOptions: Object.values(DealStatus),
  },
  {
    id: "dealreg",
    label: "Deal Registration Report",
    statusOptions: Object.values(DealStatus),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSourceBadgeClass(source: string): string {
  const map: Record<string, string> = {
    renewals: "bg-accent/20 text-accent",
    opportunities: "bg-chart-2/20 text-chart-2",
    deal_registrations: "bg-chart-3/20 text-chart-3",
    customer_accounts: "bg-primary/20 text-primary",
    mdf_requests: "bg-chart-4/20 text-chart-4",
    marketing_activities: "bg-secondary text-muted-foreground",
    business_plans: "bg-chart-2/10 text-chart-2",
    promotions: "bg-accent/10 text-accent",
  };
  return map[source] ?? "bg-secondary text-muted-foreground";
}

function daysUntil(ns: bigint): number {
  const ms = Number(ns) / 1_000_000;
  return Math.ceil((ms - Date.now()) / 86_400_000);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoToNs(iso: string): bigint {
  return BigInt(new Date(iso).getTime()) * 1_000_000n;
}

function exportCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(title: string) {
  const style = document.createElement("style");
  style.id = "print-override";
  style.textContent =
    "@media print { body > *:not(#report-print-area) { display: none !important; } #report-print-area { display: block !important; } }";
  document.head.appendChild(style);
  const prev = document.title;
  document.title = title;
  window.print();
  document.title = prev;
  style.remove();
}

function buildRates(
  forex: ReturnType<typeof useForex>,
  currency: string,
  dateNs: bigint,
  fxMode: FxMode,
): Record<string, number> {
  if (fxMode === "live") return forex.rates;
  return {
    ...forex.rates,
    [currency]: getHistoricalRateVariance(currency, dateNs),
  };
}

// ─── Recent Reports Card ─────────────────────────────────────────────────────

interface ReportCardProps {
  report: SavedReport;
  canExport?: boolean;
  canShare?: boolean;
  onRun: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

function ReportCard({
  report,
  canExport = true,
  canShare = true,
  onRun,
  onEdit,
  onDuplicate,
  onExport,
  onShare,
}: ReportCardProps) {
  const srcLabel = SOURCE_LABEL_MAP[report.dataSource] ?? report.dataSource;
  const lastRunDate = report.lastRun
    ? new Date(report.lastRun).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="crm-card p-4 flex flex-col gap-3 hover:border-accent/40 transition-colors"
      data-ocid={`reports.saved.item.${report.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {report.name}
          </div>
          {report.description && (
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {report.description}
            </div>
          )}
        </div>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${getSourceBadgeClass(report.dataSource)}`}
        >
          {srcLabel}
        </span>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        {lastRunDate && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {lastRunDate}
          </span>
        )}
        <span className="capitalize">
          {report.shareLevel === "private"
            ? "🔒 Private"
            : report.shareLevel === "internal"
              ? "🏢 Internal"
              : `🔗 ${report.sharedDepts.slice(0, 2).join(", ")}${report.sharedDepts.length > 2 ? ` +${report.sharedDepts.length - 2}` : ""}`}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-auto pt-1 border-t border-border/50">
        <Button
          type="button"
          size="sm"
          onClick={onRun}
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3"
          data-ocid={`reports.saved.run.${report.id}`}
        >
          Run Report
        </Button>
        {onEdit && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="h-7 w-7 p-0"
            aria-label="Edit"
            data-ocid={`reports.saved.edit.${report.id}`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
        )}
        {onDuplicate && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onDuplicate}
            className="h-7 w-7 p-0"
            aria-label="Duplicate"
            data-ocid={`reports.saved.duplicate.${report.id}`}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
        )}
        {canExport && onExport && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onExport}
            className="h-7 w-7 p-0"
            aria-label="Export"
            data-ocid={`reports.saved.export.${report.id}`}
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        )}
        {canShare && onShare && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onShare}
            className="h-7 w-7 p-0"
            aria-label="Share"
            data-ocid={`reports.saved.share.${report.id}`}
          >
            <Share2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Recent Reports Grid ──────────────────────────────────────────────────────

function RecentReportsGrid({
  myReports,
  sharedReports,
  searchQuery,
  onRun,
  onEdit,
  onDuplicate,
  onShare,
}: {
  myReports: SavedReport[];
  sharedReports: (SavedReport & { sharedBy?: string; permLevel?: string })[];
  searchQuery: string;
  onRun: (r: SavedReport) => void;
  onEdit: (r: SavedReport) => void;
  onDuplicate: (r: SavedReport) => void;
  onShare: (r: SavedReport) => void;
}) {
  const recentMy = myReports
    .filter(
      (r) =>
        !searchQuery ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 4);

  const recentShared = sharedReports
    .filter(
      (r) =>
        !searchQuery ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .slice(0, 2);

  const hasResults = recentMy.length > 0 || recentShared.length > 0;

  if (!hasResults && searchQuery) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        data-ocid="reports.search.empty_state"
      >
        <Search className="w-8 h-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">
          No reports match{" "}
          <strong className="text-foreground">"{searchQuery}"</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {recentMy.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              My Reports
            </h2>
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
              {recentMy.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
            {recentMy.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                canExport
                canShare
                onRun={() => onRun(r)}
                onEdit={() => onEdit(r)}
                onDuplicate={() => onDuplicate(r)}
                onExport={() => exportCSV(r.columns, [], `${r.name}.csv`)}
                onShare={() => onShare(r)}
              />
            ))}
          </div>
        </section>
      )}
      {recentShared.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Shared with Me
            </h2>
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
              {recentShared.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {recentShared.map((r) => (
              <div
                key={r.id}
                className="crm-card p-4 hover:border-accent/40 transition-colors"
                data-ocid={`reports.shared.item.${r.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">
                      {r.name}
                    </div>
                    {r.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {r.description}
                      </div>
                    )}
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${getSourceBadgeClass(r.dataSource)}`}
                  >
                    {SOURCE_LABEL_MAP[r.dataSource] ?? r.dataSource}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-3">
                  <span>
                    Owner: <span className="text-foreground">{r.owner}</span>
                  </span>
                  {r.sharedBy && (
                    <span>
                      Shared by:{" "}
                      <span className="text-foreground">{r.sharedBy}</span>
                    </span>
                  )}
                  {r.permLevel && (
                    <span className="px-1.5 py-0.5 rounded bg-secondary/60">
                      {r.permLevel}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3"
                  data-ocid={`reports.shared.run.${r.id}`}
                >
                  Run Report
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
      {!hasResults && (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="reports.my_reports.empty_state"
        >
          <BarChart3 className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">
            No reports yet
          </p>
          <p className="text-xs text-muted-foreground">
            Create your first custom report to analyse your channel data.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Pre-built Templates Panel ────────────────────────────────────────────────

function PrebuiltTemplatesPanel({
  onSelect,
}: {
  onSelect: (tmpl: PrebuiltTemplate) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["accounts", "renewals"]),
  );

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-1">
      {PREBUILT_CATEGORIES.map((cat) => (
        <div key={cat.id}>
          <button
            type="button"
            onClick={() => toggle(cat.id)}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-colors"
          >
            <span className="text-accent">{cat.icon}</span>
            <span className="flex-1 text-left">{cat.label}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${expanded.has(cat.id) ? "rotate-180" : ""}`}
            />
          </button>
          {expanded.has(cat.id) && (
            <div className="pl-4 pb-1">
              {cat.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded transition-colors"
                  data-ocid={`reports.prebuilt.${item.id}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CSS bar chart ───────────────────────────────────────────────────────────

function BarChartView({
  labels,
  values,
  currency,
}: { labels: string[]; values: number[]; currency: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="space-y-3 py-4">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-3 text-sm">
          <div className="w-36 shrink-0 text-muted-foreground text-xs truncate text-right">
            {label}
          </div>
          <div className="flex-1 bg-secondary/30 rounded-full h-6 overflow-hidden">
            <div
              className="h-full bg-accent/80 rounded-full flex items-center pl-2 transition-all"
              style={{ width: `${Math.max((values[i] / max) * 100, 2)}%` }}
            >
              {values[i] > max * 0.15 && (
                <span className="text-[10px] text-accent-foreground font-mono">
                  {formatCurrencyAmount(values[i], currency)}
                </span>
              )}
            </div>
          </div>
          <div className="w-24 shrink-0 text-right font-mono text-xs text-foreground">
            {formatCurrencyAmount(values[i], currency)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Report Results View ──────────────────────────────────────────────────────

interface ReportResultsViewProps {
  reportLabel: string;
  reportType: ReportType;
  data: Account[] | DealRegistration[] | null;
  forex: ReturnType<typeof useForex>;
  fxMode: FxMode;
  loading: boolean;
  hasRun: boolean;
  onRun: () => void;
  startDate: string;
  endDate: string;
  partnerId: string;
  status: string;
  statusOptions: string[];
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onPartnerIdChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onFxModeChange: (v: FxMode) => void;
  incumbentDistributor: string;
  onIncumbentDistributorChange: (v: string) => void;
  incumbentReseller: string;
  onIncumbentResellerChange: (v: string) => void;
  vendorAlignment: string;
  onVendorAlignmentChange: (v: string) => void;
  servicingOwner: string;
  onServicingOwnerChange: (v: string) => void;
  territory: string;
  onTerritoryChange: (v: string) => void;
}

function ReportResultsView({
  reportLabel,
  reportType,
  data,
  forex,
  fxMode,
  loading,
  hasRun,
  onRun,
  startDate,
  endDate,
  partnerId,
  status,
  statusOptions,
  onStartDateChange,
  onEndDateChange,
  onPartnerIdChange,
  onStatusChange,
  onFxModeChange,
  incumbentDistributor,
  onIncumbentDistributorChange,
  incumbentReseller,
  onIncumbentResellerChange,
  vendorAlignment,
  onVendorAlignmentChange,
  servicingOwner,
  onServicingOwnerChange,
  territory,
  onTerritoryChange,
}: ReportResultsViewProps) {
  const [resultView, setResultView] = useState<ResultView>("table");
  const [statusOpen, setStatusOpen] = useState(false);

  const lastUpdatedStr = forex.lastUpdated
    ? forex.lastUpdated.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
  const providerShort = (
    PROVIDER_NAMES[forex.forexConfig.primaryProvider] ??
    forex.forexConfig.primaryProvider
  )
    .split(" ")
    .slice(0, 3)
    .join(" ");

  // Build chart data from whatever is available
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { labels: [], values: [] };
    if (reportType === "renewal") {
      const accs = data as Account[];
      return {
        labels: accs.slice(0, 8).map((a) => a.accountName),
        values: accs
          .slice(0, 8)
          .map((a) =>
            convertCurrency(
              a.estimatedRenewalValue,
              "USD",
              forex.displayCurrency,
              buildRates(forex, forex.displayCurrency, a.renewalDate, fxMode),
            ),
          ),
      };
    }
    const deals = data as DealRegistration[];
    return {
      labels: deals.slice(0, 8).map((d) => d.opportunityName),
      values: deals
        .slice(0, 8)
        .map((d) =>
          convertCurrency(
            d.estimatedValue,
            "USD",
            forex.displayCurrency,
            buildRates(forex, forex.displayCurrency, d.closeDate, fxMode),
          ),
        ),
    };
  }, [data, reportType, forex, fxMode]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card flex items-start justify-between shrink-0 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground font-display">
            {reportLabel}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <TrendingUp className="w-3 h-3 text-accent" />
            <span className="text-[11px] font-mono text-muted-foreground">
              Rates: {providerShort}
            </span>
            <span className="text-muted-foreground/40 text-[11px]">|</span>
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] font-mono text-muted-foreground">
              {lastUpdatedStr}
            </span>
            <span className="text-muted-foreground/40 text-[11px]">|</span>
            <span className="text-[11px] font-mono font-semibold text-accent">
              {forex.displayCurrency}
            </span>
            {fxMode === "historical" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground font-mono">
                HIST. FX
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* View toggle */}
          {hasRun && data && data.length > 0 && (
            <div className="flex rounded-lg border border-border overflow-hidden h-8">
              <button
                type="button"
                onClick={() => setResultView("table")}
                className={`px-3 text-xs font-medium transition-colors flex items-center gap-1.5 ${resultView === "table" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`}
                data-ocid="reports.view_table_toggle"
              >
                <Table2 className="w-3.5 h-3.5" /> Table
              </button>
              <button
                type="button"
                onClick={() => setResultView("chart")}
                className={`px-3 text-xs font-medium border-l border-border transition-colors flex items-center gap-1.5 ${resultView === "chart" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`}
                data-ocid="reports.view_chart_toggle"
              >
                <BarChart2 className="w-3.5 h-3.5" /> Chart
              </button>
            </div>
          )}
          <CurrencySelector forex={forex} compact={false} />
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="px-6 py-3 border-b border-border bg-card/60 shrink-0"
        data-ocid="reports.filter_bar"
      >
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="reports-start-date"
              className="text-xs text-muted-foreground"
            >
              Start Date
            </label>
            <input
              id="reports-start-date"
              type="date"
              className="crm-input h-9 px-3 text-sm"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              data-ocid="reports.start_date_input"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="reports-end-date"
              className="text-xs text-muted-foreground"
            >
              End Date
            </label>
            <input
              id="reports-end-date"
              type="date"
              className="crm-input h-9 px-3 text-sm"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              data-ocid="reports.end_date_input"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="reports-partner-id"
              className="text-xs text-muted-foreground"
            >
              Reseller ID
            </label>
            <input
              id="reports-partner-id"
              type="text"
              className="crm-input h-9 px-3 text-sm w-40"
              placeholder="Any reseller"
              value={partnerId}
              onChange={(e) => onPartnerIdChange(e.target.value)}
              data-ocid="reports.partner_input"
            />
          </div>
          <div className="flex flex-col gap-1 relative">
            <span className="text-xs text-muted-foreground">Status</span>
            <button
              type="button"
              className="crm-input h-9 px-3 text-sm w-44 flex items-center justify-between gap-2"
              onClick={() => setStatusOpen((v) => !v)}
              data-ocid="reports.status_select"
            >
              <span
                className={status ? "text-foreground" : "text-muted-foreground"}
              >
                {status || "Any status"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </button>
            {statusOpen && (
              <div className="absolute top-full mt-1 left-0 z-20 crm-card w-44 py-1 shadow-lg">
                <button
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  onClick={() => {
                    onStatusChange("");
                    setStatusOpen(false);
                  }}
                >
                  Any status
                </button>
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-secondary/30 ${status === s ? "text-accent font-medium" : "text-foreground"}`}
                    onClick={() => {
                      onStatusChange(s);
                      setStatusOpen(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">FX Mode</span>
            <div
              className="flex rounded-lg border border-border overflow-hidden h-9"
              data-ocid="reports.fx_mode_toggle"
            >
              <button
                type="button"
                data-ocid="reports.fx_mode_live"
                onClick={() => onFxModeChange("live")}
                className={`px-3 text-xs font-mono font-semibold transition-colors ${fxMode === "live" ? "bg-accent text-accent-foreground" : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`}
              >
                Live FX
              </button>
              <button
                type="button"
                data-ocid="reports.fx_mode_historical"
                onClick={() => onFxModeChange("historical")}
                className={`px-3 text-xs font-mono font-semibold border-l border-border transition-colors ${fxMode === "historical" ? "bg-accent text-accent-foreground" : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`}
              >
                Historical
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-incumbent-distributor"
              className="text-xs text-muted-foreground whitespace-nowrap"
            >
              Incumbent Distributor
            </label>
            <input
              id="filter-incumbent-distributor"
              type="text"
              value={incumbentDistributor}
              onChange={(e) => onIncumbentDistributorChange(e.target.value)}
              placeholder="Filter by distributor..."
              className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-incumbent-reseller"
              className="text-xs text-muted-foreground whitespace-nowrap"
            >
              Incumbent Reseller
            </label>
            <input
              id="filter-incumbent-reseller"
              type="text"
              value={incumbentReseller}
              onChange={(e) => onIncumbentResellerChange(e.target.value)}
              placeholder="Filter by reseller..."
              className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-vendor-alignment"
              className="text-xs text-muted-foreground whitespace-nowrap"
            >
              Vendor Alignment
            </label>
            <input
              id="filter-vendor-alignment"
              type="text"
              value={vendorAlignment}
              onChange={(e) => onVendorAlignmentChange(e.target.value)}
              placeholder="Filter by vendor..."
              className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-servicing-owner"
              className="text-xs text-muted-foreground whitespace-nowrap"
            >
              Servicing Owner
            </label>
            <input
              id="filter-servicing-owner"
              type="text"
              value={servicingOwner}
              onChange={(e) => onServicingOwnerChange(e.target.value)}
              placeholder="Filter by owner..."
              className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="filter-territory"
              className="text-xs text-muted-foreground whitespace-nowrap"
            >
              Territory
            </label>
            <input
              id="filter-territory"
              type="text"
              value={territory}
              onChange={(e) => onTerritoryChange(e.target.value)}
              placeholder="Filter by territory..."
              className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportPDF(reportLabel)}
              className="h-9 text-xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1" /> PDF
            </Button>
            <Button
              type="button"
              onClick={onRun}
              disabled={loading}
              data-ocid="reports.run_report_button"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-9"
            >
              {loading ? (
                <>
                  <RefreshCcw className="w-3.5 h-3.5 mr-1.5 animate-spin" />{" "}
                  Running...
                </>
              ) : (
                <>
                  <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Run Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="flex-1 overflow-auto p-6">
        {loading && (
          <div data-ocid="reports.loading_state" className="space-y-2">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <Skeleton key={k} className="h-10 w-full rounded" />
            ))}
          </div>
        )}
        {!loading && !hasRun && (
          <div
            className="crm-card flex flex-col items-center justify-center py-20 text-center"
            data-ocid="reports.empty_state"
          >
            <BarChart3 className="w-10 h-10 text-muted-foreground mb-4 opacity-40" />
            <p className="text-muted-foreground text-sm">
              Set your filters and click{" "}
              <strong className="text-foreground">Run Report</strong> to see
              results.
            </p>
          </div>
        )}
        {!loading && hasRun && data !== null && (
          <div className="fade-in">
            {resultView === "chart" && data.length > 0 && (
              <BarChartView
                labels={chartData.labels}
                values={chartData.values}
                currency={forex.displayCurrency}
              />
            )}
            {(resultView === "table" || data.length === 0) && (
              <>
                {reportType === "renewal" && (
                  <RenewalTable
                    data={data as Account[]}
                    forex={forex}
                    fxMode={fxMode}
                  />
                )}
                {reportType === "pipeline" && (
                  <PipelineTable
                    data={data as DealRegistration[]}
                    forex={forex}
                    fxMode={fxMode}
                  />
                )}
                {reportType === "dealreg" && (
                  <DealRegTable
                    data={data as DealRegistration[]}
                    forex={forex}
                    fxMode={fxMode}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Renewal Table ────────────────────────────────────────────────────────────

interface RenewalTableProps {
  data: Account[];
  forex: ReturnType<typeof useForex>;
  fxMode: FxMode;
}

function RenewalTable({ data, forex, fxMode }: RenewalTableProps) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => Number(a.renewalDate - b.renewalDate)),
    [data],
  );
  const convertVal = (amount: number, dateNs: bigint) =>
    convertCurrency(
      amount,
      "USD",
      forex.displayCurrency,
      buildRates(forex, forex.displayCurrency, dateNs, fxMode),
    );
  const totalValue = sorted.reduce(
    (s, a) => s + convertVal(a.estimatedRenewalValue, a.renewalDate),
    0,
  );
  const now = new Date().toISOString();

  const csvRows = sorted.map((a) => {
    const converted = convertVal(a.estimatedRenewalValue, a.renewalDate);
    const rates = buildRates(
      forex,
      forex.displayCurrency,
      a.renewalDate,
      fxMode,
    );
    const rate = rates[forex.displayCurrency] ?? 1;
    return [
      a.accountName,
      a.customerDomain,
      a.resellerOwnerId,
      formatDate(a.renewalDate),
      String(a.estimatedRenewalValue),
      "USD",
      formatCurrencyAmount(converted, forex.displayCurrency),
      forex.displayCurrency,
      String(rate.toFixed(6)),
      forex.forexConfig.primaryProvider,
      now,
      a.status,
      String(daysUntil(a.renewalDate)),
    ];
  });

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{sorted.length} accounts</span>
          <span>
            Total Est. Value:{" "}
            <span className="text-foreground font-semibold font-mono">
              {formatCurrencyAmount(totalValue, forex.displayCurrency)}
            </span>
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="reports.export_excel_button"
          onClick={() =>
            exportCSV(
              [
                "Account Name",
                "Customer Domain",
                "Reseller Owner",
                "Renewal Date",
                "Original Value",
                "Original Currency",
                "Converted Value",
                "Converted Currency",
                "FX Rate",
                "FX Provider",
                "Conversion Timestamp",
                "Status",
                "Days Until Renewal",
              ],
              csvRows,
              "renewal-report.xlsx",
            )
          }
        >
          <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto rounded-[0.5rem] border border-border">
        <table className="w-full text-sm" id="report-print-area">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {[
                "Account Name",
                "Customer Domain",
                "Reseller Owner",
                "Renewal Date",
                `Est. Value (${forex.displayCurrency})`,
                "Status",
                "Days Until Renewal",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((a, i) => {
              const days = daysUntil(a.renewalDate);
              const daysColor =
                days <= 30
                  ? "text-destructive"
                  : days <= 90
                    ? "text-yellow-400"
                    : "text-emerald-400";
              const converted = convertVal(
                a.estimatedRenewalValue,
                a.renewalDate,
              );
              const isBtc = forex.displayCurrency === "BTC";
              return (
                <tr
                  key={a.id}
                  data-ocid={`reports.renewal.item.${i + 1}`}
                  className={`border-b border-border/50 transition-colors hover:bg-secondary/20 ${i % 2 === 1 ? "bg-secondary/10" : ""}`}
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {a.accountName}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {a.customerDomain}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {a.resellerOwnerId || "—"}
                  </td>
                  <td className="px-4 py-2.5">{formatDate(a.renewalDate)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <div>
                      {formatCurrencyAmount(converted, forex.displayCurrency)}
                    </div>
                    {isBtc && (
                      <div className="text-[10px] text-muted-foreground">
                        ≈ {formatCurrencyAmount(a.estimatedRenewalValue, "USD")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={accountStatusColor(a.status)}>
                      {a.status}
                    </span>
                  </td>
                  <td className={`px-4 py-2.5 font-semibold ${daysColor}`}>
                    {days > 0 ? `${days}d` : `${Math.abs(days)}d overdue`}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-secondary/20">
              <td
                colSpan={4}
                className="px-4 py-2.5 text-xs text-muted-foreground font-medium"
              >
                Summary — {sorted.length} accounts
              </td>
              <td className="px-4 py-2.5 text-right font-semibold text-foreground font-mono">
                {formatCurrencyAmount(totalValue, forex.displayCurrency)}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
        {sorted.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="reports.renewal.empty_state"
          >
            No accounts match the selected filters.
          </div>
        )}
      </div>
    </>
  );
}

// ─── Pipeline Table ───────────────────────────────────────────────────────────

interface PipelineTableProps {
  data: DealRegistration[];
  forex: ReturnType<typeof useForex>;
  fxMode: FxMode;
}

function PipelineTable({ data, forex, fxMode }: PipelineTableProps) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => Number(a.closeDate - b.closeDate)),
    [data],
  );
  const convertVal = (amount: number, dateNs: bigint) =>
    convertCurrency(
      amount,
      "USD",
      forex.displayCurrency,
      buildRates(forex, forex.displayCurrency, dateNs, fxMode),
    );
  const totalValue = sorted.reduce(
    (s, d) => s + convertVal(d.estimatedValue, d.closeDate),
    0,
  );
  const now = new Date().toISOString();

  const csvRows = sorted.map((d) => {
    const converted = convertVal(d.estimatedValue, d.closeDate);
    const rates = buildRates(forex, forex.displayCurrency, d.closeDate, fxMode);
    const rate = rates[forex.displayCurrency] ?? 1;
    return [
      d.opportunityName,
      d.accountId,
      d.resellerId,
      d.vendorOwnerId,
      String(d.estimatedValue),
      "USD",
      formatCurrencyAmount(converted, forex.displayCurrency),
      forex.displayCurrency,
      String(rate.toFixed(6)),
      forex.forexConfig.primaryProvider,
      now,
      formatDate(d.closeDate),
      d.dealStage,
      dealStatusLabel(d.status),
    ];
  });

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{sorted.length} deals</span>
          <span>
            Total Pipeline:{" "}
            <span className="text-foreground font-semibold font-mono">
              {formatCurrencyAmount(totalValue, forex.displayCurrency)}
            </span>
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="reports.export_excel_button"
          onClick={() =>
            exportCSV(
              [
                "Opportunity",
                "Account",
                "Reseller",
                "Vendor Owner",
                "Original Value",
                "Original Currency",
                "Converted Value",
                "Converted Currency",
                "FX Rate",
                "FX Provider",
                "Conversion Timestamp",
                "Close Date",
                "Deal Stage",
                "Status",
              ],
              csvRows,
              "pipeline-report.xlsx",
            )
          }
        >
          <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto rounded-[0.5rem] border border-border">
        <table className="w-full text-sm" id="report-print-area">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {[
                "Opportunity Name",
                "Account",
                "Reseller",
                "Vendor Owner",
                `Est. Value (${forex.displayCurrency})`,
                "Close Date",
                "Deal Stage",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => {
              const converted = convertVal(d.estimatedValue, d.closeDate);
              const isBtc = forex.displayCurrency === "BTC";
              return (
                <tr
                  key={d.id}
                  data-ocid={`reports.pipeline.item.${i + 1}`}
                  className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 1 ? "bg-secondary/10" : ""}`}
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {d.opportunityName}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {d.accountId}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {d.resellerId || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {d.vendorOwnerId || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <div>
                      {formatCurrencyAmount(converted, forex.displayCurrency)}
                    </div>
                    {isBtc && (
                      <div className="text-[10px] text-muted-foreground">
                        ≈ {formatCurrencyAmount(d.estimatedValue, "USD")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{formatDate(d.closeDate)}</td>
                  <td className="px-4 py-2.5">{d.dealStage || "—"}</td>
                  <td className="px-4 py-2.5">
                    <span className={dealStatusColor(d.status)}>
                      {dealStatusLabel(d.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-secondary/20">
              <td
                colSpan={4}
                className="px-4 py-2.5 text-xs text-muted-foreground font-medium"
              >
                Summary — {sorted.length} deals
              </td>
              <td className="px-4 py-2.5 text-right font-semibold text-foreground font-mono">
                {formatCurrencyAmount(totalValue, forex.displayCurrency)}
              </td>
              <td colSpan={3} />
            </tr>
          </tfoot>
        </table>
        {sorted.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="reports.pipeline.empty_state"
          >
            No deals match the selected filters.
          </div>
        )}
      </div>
    </>
  );
}

// ─── Deal Registration Table ──────────────────────────────────────────────────

interface DealRegTableProps {
  data: DealRegistration[];
  forex: ReturnType<typeof useForex>;
  fxMode: FxMode;
}

function DealRegTable({ data, forex, fxMode }: DealRegTableProps) {
  const sorted = useMemo(
    () =>
      [...data].sort((a, b) =>
        Number((b.submittedDate ?? 0n) - (a.submittedDate ?? 0n)),
      ),
    [data],
  );
  const convertVal = (amount: number, dateNs: bigint) =>
    convertCurrency(
      amount,
      "USD",
      forex.displayCurrency,
      buildRates(forex, forex.displayCurrency, dateNs, fxMode),
    );
  const totalValue = sorted.reduce(
    (s, d) => s + convertVal(d.estimatedValue, d.closeDate),
    0,
  );
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const d of sorted) map[d.status] = (map[d.status] ?? 0) + 1;
    return map;
  }, [sorted]);
  const now = new Date().toISOString();

  const csvRows = sorted.map((d) => {
    const converted = convertVal(d.estimatedValue, d.closeDate);
    const rates = buildRates(forex, forex.displayCurrency, d.closeDate, fxMode);
    const rate = rates[forex.displayCurrency] ?? 1;
    return [
      d.opportunityName,
      d.accountId,
      d.resellerId,
      d.submittedBy,
      d.submittedDate ? formatDate(d.submittedDate) : "—",
      formatDate(d.closeDate),
      dealStatusLabel(d.status),
      d.vendorOwnerId || "—",
      String(d.estimatedValue),
      "USD",
      formatCurrencyAmount(converted, forex.displayCurrency),
      forex.displayCurrency,
      String(rate.toFixed(6)),
      forex.forexConfig.primaryProvider,
      now,
    ];
  });

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{sorted.length} registrations</span>
          <span>
            Total:{" "}
            <span className="text-foreground font-semibold font-mono">
              {formatCurrencyAmount(totalValue, forex.displayCurrency)}
            </span>
          </span>
          {Object.entries(statusCounts).map(([s, n]) => (
            <span key={s}>
              <span className={dealStatusColor(s)}>
                {dealStatusLabel(s)}: {n}
              </span>
            </span>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="reports.export_excel_button"
          onClick={() =>
            exportCSV(
              [
                "Opportunity",
                "Account",
                "Reseller",
                "Submitted By",
                "Submitted Date",
                "Close Date",
                "Status",
                "Approver",
                "Original Value",
                "Original Currency",
                "Converted Value",
                "Converted Currency",
                "FX Rate",
                "FX Provider",
                "Conversion Timestamp",
              ],
              csvRows,
              "deal-reg-report.xlsx",
            )
          }
        >
          <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto rounded-[0.5rem] border border-border">
        <table className="w-full text-sm" id="report-print-area">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {[
                "Opportunity",
                "Account",
                "Reseller",
                "Submitted By",
                "Submitted Date",
                "Close Date",
                "Status",
                `Value (${forex.displayCurrency})`,
                "Approver",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => {
              const converted = convertVal(d.estimatedValue, d.closeDate);
              const isBtc = forex.displayCurrency === "BTC";
              return (
                <tr
                  key={d.id}
                  data-ocid={`reports.dealreg.item.${i + 1}`}
                  className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 1 ? "bg-secondary/10" : ""}`}
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {d.opportunityName}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {d.accountId}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {d.resellerId || "—"}
                  </td>
                  <td className="px-4 py-2.5">{d.submittedBy || "—"}</td>
                  <td className="px-4 py-2.5">
                    {d.submittedDate ? formatDate(d.submittedDate) : "—"}
                  </td>
                  <td className="px-4 py-2.5">{formatDate(d.closeDate)}</td>
                  <td className="px-4 py-2.5">
                    <span className={dealStatusColor(d.status)}>
                      {dealStatusLabel(d.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <div>
                      {formatCurrencyAmount(converted, forex.displayCurrency)}
                    </div>
                    {isBtc && (
                      <div className="text-[10px] text-muted-foreground">
                        ≈ {formatCurrencyAmount(d.estimatedValue, "USD")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {d.vendorOwnerId || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-secondary/20">
              <td
                colSpan={6}
                className="px-4 py-2.5 text-xs text-muted-foreground font-medium"
              >
                Summary — {sorted.length} registrations
              </td>
              <td />
              <td className="px-4 py-2.5 text-right font-semibold text-foreground font-mono">
                {formatCurrencyAmount(totalValue, forex.displayCurrency)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
        {sorted.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="reports.dealreg.empty_state"
          >
            No registrations match the selected filters.
          </div>
        )}
      </div>
    </>
  );
}

// ─── Shared Dashboards Panel ────────────────────────────────────────────────

function SharedDashboardsPanel({
  dashboards,
  setDashboards,
}: {
  dashboards: SharedDashboardEntry[];
  setDashboards: React.Dispatch<React.SetStateAction<SharedDashboardEntry[]>>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  function toggleOrg(dashId: string, orgId: string) {
    setDashboards((prev) =>
      prev.map((d) =>
        d.id === dashId
          ? {
              ...d,
              orgConfigs: d.orgConfigs.map((oc) =>
                oc.orgId === orgId ? { ...oc, enabled: !oc.enabled } : oc,
              ),
            }
          : d,
      ),
    );
  }

  function toggleExportFormat(
    dashId: string,
    orgId: string,
    fmt: "PDF" | "CSV" | "Excel",
  ) {
    setDashboards((prev) =>
      prev.map((d) =>
        d.id === dashId
          ? {
              ...d,
              orgConfigs: d.orgConfigs.map((oc) =>
                oc.orgId === orgId
                  ? {
                      ...oc,
                      exportFormats: oc.exportFormats.includes(fmt)
                        ? oc.exportFormats.filter((f) => f !== fmt)
                        : [...oc.exportFormats, fmt],
                    }
                  : oc,
              ),
            }
          : d,
      ),
    );
  }

  function sharedOrgNames(d: SharedDashboardEntry): string[] {
    return d.orgConfigs
      .filter((oc) => oc.enabled)
      .map(
        (oc) => LINKED_ORGS.find((o) => o.id === oc.orgId)?.name ?? oc.orgId,
      );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground font-display">
            Shared Dashboards & Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
            Control which linked organisations can access your operational
            intelligence.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShareModalOpen(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          data-ocid="shared_dashboards.share_new_button"
        >
          <Share2 className="w-4 h-4 mr-1.5" /> Share Dashboard
        </Button>
      </div>

      {/* Permission scope banner */}
      <div
        className="crm-card p-4 border-l-4 border-accent bg-accent/5"
        data-ocid="shared_dashboards.scope_banner"
      >
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Permission-Scoped Sharing
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Dashboards and reports shared with linked organisations are
              dynamically filtered to show only data within their approved
              access scope. A Reseller sees only their assigned territory. A
              Distributor sees downstream Reseller performance only.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard sharing management table */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Dashboard Sharing
          </h2>
          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
            {dashboards.length}
          </Badge>
        </div>
        <div className="overflow-x-auto rounded-[0.5rem] border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {[
                  "Dashboard Name",
                  "Type",
                  "Shared With",
                  "Filter Scope",
                  "Export Allowed",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dashboards.map((d, i) => {
                const shared = sharedOrgNames(d);
                const isExpanded = expandedId === d.id;
                return (
                  <>
                    <tr
                      key={d.id}
                      data-ocid={`shared_dashboards.item.${i + 1}`}
                      className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground">
                        {d.name}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary">
                          {d.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {shared.length > 0 ? (
                            shared.map((name) => (
                              <Badge
                                key={name}
                                variant="outline"
                                className="text-[10px] h-5 px-1.5"
                              >
                                {name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Not shared
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {d.filterScope}
                      </td>
                      <td className="px-4 py-2.5">
                        {d.exportAllowed ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <Unlock className="w-3 h-3" /> Yes
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-destructive">
                            <Lock className="w-3 h-3" /> No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : d.id)
                          }
                          data-ocid={`shared_dashboards.manage_access.${d.id}`}
                        >
                          {isExpanded ? "Close" : "Manage Access"}
                        </Button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 bg-secondary/10">
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-foreground">
                              Linked Organisation Access
                            </p>
                            {LINKED_ORGS.map((org) => {
                              const cfg = d.orgConfigs.find(
                                (oc) => oc.orgId === org.id,
                              );
                              const enabled = cfg?.enabled ?? false;
                              return (
                                <div
                                  key={org.id}
                                  className="flex items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-foreground">
                                      {org.name}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] h-4 px-1"
                                    >
                                      {org.type}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                      {(["PDF", "CSV", "Excel"] as const).map(
                                        (fmt) => (
                                          <label
                                            key={fmt}
                                            className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border cursor-pointer transition-colors ${
                                              enabled &&
                                              cfg?.exportFormats.includes(fmt)
                                                ? "border-accent bg-accent/10 text-accent"
                                                : "border-border text-muted-foreground"
                                            }`}
                                          >
                                            <input
                                              type="checkbox"
                                              className="sr-only"
                                              checked={
                                                enabled &&
                                                cfg?.exportFormats.includes(fmt)
                                              }
                                              onChange={() =>
                                                toggleExportFormat(
                                                  d.id,
                                                  org.id,
                                                  fmt,
                                                )
                                              }
                                            />
                                            {fmt}
                                          </label>
                                        ),
                                      )}
                                    </div>
                                    <Switch
                                      checked={enabled}
                                      onCheckedChange={() =>
                                        toggleOrg(d.id, org.id)
                                      }
                                      data-ocid={`shared_dashboards.toggle.${d.id}.${org.id}`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                            <p className="text-[10px] text-muted-foreground italic">
                              Data filtered to viewer&apos;s assigned accounts
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Report sharing section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Report Sharing
          </h2>
          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
            {SAVED_REPORTS_FOR_SHARING.length}
          </Badge>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {SAVED_REPORTS_FOR_SHARING.map((r, i) => (
            <div
              key={r.id}
              className="crm-card p-4 hover:border-accent/40 transition-colors"
              data-ocid={`shared_dashboards.report.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {r.name}
                  </div>
                  {r.description && (
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {r.description}
                    </div>
                  )}
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${getSourceBadgeClass(r.dataSource)}`}
                >
                  {SOURCE_LABEL_MAP[r.dataSource] ?? r.dataSource}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                {r.sharedExternally ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 text-emerald-400 border-emerald-400/30"
                  >
                    <Globe className="w-3 h-3 mr-1" /> Shared
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 px-1.5 text-muted-foreground"
                  >
                    <Lock className="w-3 h-3 mr-1" /> Private
                  </Badge>
                )}
              </div>
              <div className="flex gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3"
                  data-ocid={`shared_dashboards.report.share.${r.id}`}
                >
                  <Share2 className="w-3.5 h-3.5 mr-1" /> Share
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  aria-label="Export"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audit trail */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Access Audit Trail
          </h2>
          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
            Last 10 events
          </Badge>
        </div>
        <div className="overflow-x-auto rounded-[0.5rem] border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Who", "Organisation", "Dashboard", "Action", "When"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {AUDIT_EVENTS.map((e, i) => (
                <tr
                  key={e.id}
                  data-ocid={`shared_dashboards.audit.item.${i + 1}`}
                  className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium text-foreground text-xs">
                    {e.who}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">
                    {e.org}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-foreground">
                    {e.dashboard}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
                        e.action === "viewed"
                          ? "bg-primary/10 text-primary"
                          : e.action === "exported"
                            ? "bg-accent/10 text-accent"
                            : e.action === "shared"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {e.action === "viewed" && <Eye className="w-3 h-3" />}
                      {e.action === "exported" && (
                        <Download className="w-3 h-3" />
                      )}
                      {e.action === "shared" && <Share2 className="w-3 h-3" />}
                      {e.action === "revoked" && <X className="w-3 h-3" />}
                      {e.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-muted-foreground font-mono">
                    {new Date(e.timestamp).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Share Dashboard Modal */}
      <ShareDashboardModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={(newDash) =>
          setDashboards((prev) => [
            ...prev,
            { ...newDash, id: `dash-${Date.now()}` },
          ])
        }
      />
    </div>
  );
}

// ─── Share Dashboard Modal ──────────────────────────────────────────────────

function ShareDashboardModal({
  open,
  onClose,
  onShare,
}: {
  open: boolean;
  onClose: () => void;
  onShare: (d: Omit<SharedDashboardEntry, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedOrgs, setSelectedOrgs] = useState<Set<string>>(new Set());
  const [exportFormats, setExportFormats] = useState<{
    PDF: boolean;
    CSV: boolean;
    Excel: boolean;
  }>({ PDF: true, CSV: false, Excel: false });
  const [notes, setNotes] = useState("");

  const DASHBOARD_TYPES = [
    "QTD Performance",
    "Renewal Risk",
    "Pipeline Overview",
    "MDF ROI",
    "Deal Registration Performance",
    "Churn/Save Performance",
    "Campaign Performance",
    "Missed Opportunity",
  ];

  function toggleOrg(orgId: string) {
    setSelectedOrgs((prev) => {
      const next = new Set(prev);
      next.has(orgId) ? next.delete(orgId) : next.add(orgId);
      return next;
    });
  }

  function handleShare() {
    if (!title.trim() || !selectedType) return;
    const fmts = (["PDF", "CSV", "Excel"] as const).filter(
      (f) => exportFormats[f],
    );
    onShare({
      name: title.trim(),
      type: selectedType,
      orgConfigs: LINKED_ORGS.map((o) => ({
        orgId: o.id,
        enabled: selectedOrgs.has(o.id),
        exportFormats: selectedOrgs.has(o.id) ? fmts : [],
      })),
      filterScope: "Assigned accounts only",
      exportAllowed: fmts.length > 0,
    });
    setTitle("");
    setSelectedType("");
    setSelectedOrgs(new Set());
    setExportFormats({ PDF: true, CSV: false, Excel: false });
    setNotes("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold font-display">
            Share Dashboard
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label
              htmlFor="dash-title"
              className="text-xs font-medium text-muted-foreground"
            >
              Dashboard Title
            </label>
            <input
              id="dash-title"
              type="text"
              className="crm-input h-9 px-3 text-sm w-full"
              placeholder="e.g. Q3 Partner Performance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="shared_dashboards.modal.title_input"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="dash-type"
              className="text-xs font-medium text-muted-foreground"
            >
              Dashboard Type
            </label>
            <div id="dash-type" className="grid grid-cols-2 gap-2">
              {DASHBOARD_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`text-left px-3 py-2 rounded-md border text-xs transition-colors ${
                    selectedType === t
                      ? "border-accent bg-accent/10 text-accent font-medium"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  }`}
                  data-ocid={`shared_dashboards.modal.type.${t}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="share-with"
              className="text-xs font-medium text-muted-foreground"
            >
              Share With
            </label>
            <div id="share-with" className="space-y-2">
              {LINKED_ORGS.map((org) => (
                <label
                  key={org.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      selectedOrgs.has(org.id)
                        ? "bg-accent border-accent"
                        : "border-border"
                    }`}
                  >
                    {selectedOrgs.has(org.id) && (
                      <Check className="w-3 h-3 text-accent-foreground" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedOrgs.has(org.id)}
                    onChange={() => toggleOrg(org.id)}
                    data-ocid={`shared_dashboards.modal.org.${org.id}`}
                  />
                  <span className="text-xs text-foreground">{org.name}</span>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1">
                    {org.type}
                  </Badge>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="export-perms"
              className="text-xs font-medium text-muted-foreground"
            >
              Export Permissions
            </label>
            <div id="export-perms" className="flex gap-3">
              {(["PDF", "CSV", "Excel"] as const).map((fmt) => (
                <label
                  key={fmt}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded border cursor-pointer transition-colors ${
                    exportFormats[fmt]
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={exportFormats[fmt]}
                    onChange={() =>
                      setExportFormats((prev) => ({
                        ...prev,
                        [fmt]: !prev[fmt],
                      }))
                    }
                  />
                  {fmt}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="dash-notes"
              className="text-xs font-medium text-muted-foreground"
            >
              Notes
            </label>
            <textarea
              id="dash-notes"
              className="crm-input px-3 py-2 text-sm w-full min-h-[60px] resize-none"
              placeholder="Optional notes for recipients..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-ocid="shared_dashboards.modal.notes_input"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="shared_dashboards.modal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleShare}
              disabled={!title.trim() || !selectedType}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              data-ocid="shared_dashboards.modal.confirm_button"
            >
              <Share2 className="w-3.5 h-3.5 mr-1" /> Share Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Reports Page ────────────────────────────────────────────────────────

export function Reports() {
  const { actor } = useActor();
  const forex = useForex();
  const { isPrimaryAdmin } = useApp();

  const [viewMode, setViewMode] = useState<"library" | "run">("library");
  const [sidebarSection, setSidebarSection] =
    useState<SidebarSection>("library");
  const [activeReport, setActiveReport] = useState<ReportType>("renewal");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(todayISO());
  const [partnerId, setPartnerId] = useState("");
  const [status, setStatus] = useState("");
  const [fxMode, setFxMode] = useState<FxMode>("live");
  const [incumbentDistributor, setIncumbentDistributor] = useState("");
  const [incumbentReseller, setIncumbentReseller] = useState("");
  const [vendorAlignment, setVendorAlignment] = useState("");
  const [servicingOwner, setServicingOwner] = useState("");
  const [territory, setTerritory] = useState("");
  const [activePrebuiltLabel, setActivePrebuiltLabel] = useState("");

  const [renewalData, setRenewalData] = useState<Account[] | null>(null);
  const [pipelineData, setPipelineData] = useState<DealRegistration[] | null>(
    null,
  );
  const [dealRegData, setDealRegData] = useState<DealRegistration[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<SavedReport | undefined>(
    undefined,
  );
  const [shareTarget, setShareTarget] = useState<SavedReport | undefined>(
    undefined,
  );
  const [myReports, setMyReports] = useState<SavedReport[]>(SAMPLE_MY_REPORTS);
  const sharedReports = SAMPLE_SHARED_REPORTS;
  const [searchQuery, setSearchQuery] = useState("");
  const [sharedDashboards, setSharedDashboards] =
    useState<SharedDashboardEntry[]>(INITIAL_DASHBOARDS);

  const currentMeta = REPORTS.find(
    (r) => r.id === activeReport && r.id !== "custom",
  );

  function buildFilters(): ReportFilters {
    const f: ReportFilters = {};
    if (startDate) f.startDate = isoToNs(startDate);
    if (endDate) f.endDate = isoToNs(endDate);
    if (partnerId.trim()) f.resellerId = partnerId.trim();
    if (status) f.status = status;
    if (incumbentDistributor.trim())
      (f as any).incumbentDistributor = incumbentDistributor.trim();
    // Extended channel filters: incumbentReseller, vendorAlignment, servicingOwner, territory added as UI state (backend filter typing extended via cast)
    if (incumbentReseller.trim())
      (f as any).incumbentReseller = incumbentReseller.trim();
    if (vendorAlignment.trim())
      (f as any).vendorAlignment = vendorAlignment.trim();
    if (servicingOwner.trim())
      (f as any).servicingOwner = servicingOwner.trim();
    if (territory.trim()) (f as any).territory = territory.trim();
    return f;
  }

  async function runReport() {
    if (!actor) return;
    setLoading(true);
    setHasRun(true);
    const filters = buildFilters();
    try {
      if (activeReport === "renewal")
        setRenewalData(await actor.getRenewalReport(filters));
      else if (activeReport === "pipeline")
        setPipelineData(await actor.getPipelineReport(filters));
      else setDealRegData(await actor.getDealRegistrationReport(filters));
    } finally {
      setLoading(false);
    }
  }

  function selectBuiltIn(
    type: "renewal" | "pipeline" | "dealreg",
    label?: string,
  ) {
    setActiveReport(type);
    setStatus("");
    setHasRun(false);
    setViewMode("run");
    if (label) setActivePrebuiltLabel(label);
  }

  function handleSaveReport(report: SavedReport) {
    if (editingReport) {
      setMyReports((prev) =>
        prev.map((r) => (r.id === report.id ? report : r)),
      );
    } else {
      setMyReports((prev) => [report, ...prev]);
    }
    setBuilderOpen(false);
    setEditingReport(undefined);
    setViewMode("library");
  }

  function handleDuplicate(r: SavedReport) {
    const copy: SavedReport = {
      ...r,
      id: Math.random().toString(36).slice(2, 9),
      name: `${r.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastRun: undefined,
    };
    setMyReports((prev) => [copy, ...prev]);
  }

  function handleShare(r: SavedReport) {
    setShareTarget(r);
  }
  function handleShareSave(r: SavedReport) {
    setMyReports((prev) => prev.map((x) => (x.id === r.id ? r : x)));
    setShareTarget(undefined);
  }

  const currentData =
    activeReport === "renewal"
      ? renewalData
      : activeReport === "pipeline"
        ? pipelineData
        : dealRegData;
  const reportLabel = activePrebuiltLabel || currentMeta?.label || "Report";
  useFilterContext();

  return (
    <div className="flex h-full min-h-screen bg-background">
      {/* ── Left sidebar ─────────────────────────────────────────────────── */}
      <aside
        className="w-64 shrink-0 crm-sidebar border-r border-border flex flex-col"
        data-ocid="reports.sidebar"
      >
        {/* Header + New Report */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">
                Reports
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setEditingReport(undefined);
              setBuilderOpen(true);
            }}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold"
            data-ocid="reports.create_button"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Report
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports..."
              className="crm-input h-8 pl-7 pr-2 text-xs w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-ocid="reports.sidebar.search_input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {/* My Reports */}
          <div className="px-4 pt-2 pb-1">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              My Reports
            </span>
          </div>
          <button
            type="button"
            data-ocid="reports.library.tab"
            onClick={() => {
              setSidebarSection("library");
              setViewMode("library");
            }}
            className={`w-full text-left px-4 py-2 text-xs transition-colors ${
              sidebarSection === "library" && viewMode === "library"
                ? "text-accent font-semibold bg-accent/10 border-r-2 border-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            }`}
          >
            All My Reports
            {myReports.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-secondary/60 rounded-full px-1.5 py-0.5">
                {myReports.length}
              </span>
            )}
          </button>
          {myReports.slice(0, 3).map((r) => (
            <button
              key={r.id}
              type="button"
              data-ocid={`reports.sidebar.my.${r.id}`}
              onClick={() => {
                setSidebarSection("library");
                setViewMode("library");
              }}
              className="w-full text-left px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-colors truncate"
            >
              {r.name}
            </button>
          ))}

          {/* Shared with me */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              Shared with Me
            </span>
          </div>
          <button
            type="button"
            data-ocid="reports.shared.tab"
            onClick={() => {
              setSidebarSection("shared");
              setViewMode("library");
            }}
            className={`w-full text-left px-4 py-2 text-xs transition-colors ${
              sidebarSection === "shared" && viewMode === "library"
                ? "text-accent font-semibold bg-accent/10 border-r-2 border-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            }`}
          >
            Shared Reports
            {sharedReports.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-secondary/60 rounded-full px-1.5 py-0.5">
                {sharedReports.length}
              </span>
            )}
          </button>

          {/* Shared Dashboards */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              External Sharing
            </span>
          </div>
          <button
            type="button"
            data-ocid="reports.shared_dashboards.tab"
            onClick={() => {
              setSidebarSection("shared_dashboards");
              setViewMode("library");
            }}
            className={`w-full text-left px-4 py-2 text-xs transition-colors ${
              sidebarSection === "shared_dashboards" && viewMode === "library"
                ? "text-accent font-semibold bg-accent/10 border-r-2 border-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            }`}
          >
            Shared Dashboards
            <span className="ml-1.5 text-[10px] bg-secondary/60 rounded-full px-1.5 py-0.5">
              {sharedDashboards.length}
            </span>
          </button>

          {/* Pre-built */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              Pre-built
            </span>
          </div>
          <PrebuiltTemplatesPanel
            onSelect={(tmpl) => {
              setSidebarSection("prebuilt");
              if (tmpl.type) {
                selectBuiltIn(tmpl.type, tmpl.label);
              } else {
                // Non-wired templates: show library view with label
                setActivePrebuiltLabel(tmpl.label);
                setViewMode("library");
              }
            }}
          />

          {/* Built-in runners */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              Run Reports
            </span>
          </div>
          {REPORTS.map((r) => (
            <button
              key={r.id}
              type="button"
              data-ocid={`reports.${r.id}.tab`}
              onClick={() =>
                selectBuiltIn(r.id as "renewal" | "pipeline" | "dealreg")
              }
              className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                viewMode === "run" && activeReport === r.id
                  ? "text-accent font-semibold bg-accent/10 border-r-2 border-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
            >
              {r.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {viewMode === "library" ? (
          <>
            <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between shrink-0 gap-4">
              <div>
                <h1 className="text-lg font-semibold text-foreground font-display">
                  {sidebarSection === "shared"
                    ? "Shared with Me"
                    : sidebarSection === "prebuilt"
                      ? "Pre-built Reports"
                      : "Report Library"}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create, manage, and run your channel reports.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setEditingReport(undefined);
                  setBuilderOpen(true);
                }}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                data-ocid="reports.create_button_header"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Create Report
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {sidebarSection === "shared_dashboards" ? (
                <SharedDashboardsPanel
                  dashboards={sharedDashboards}
                  setDashboards={setSharedDashboards}
                />
              ) : sidebarSection === "shared" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Shared with Me
                    </h2>
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1.5"
                    >
                      {sharedReports.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    {sharedReports.map((r) => (
                      <div
                        key={r.id}
                        className="crm-card p-4 hover:border-accent/40 transition-colors"
                        data-ocid={`reports.shared.card.${r.id}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-foreground truncate">
                              {r.name}
                            </div>
                            {r.description && (
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {r.description}
                              </div>
                            )}
                          </div>
                          <span
                            className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${getSourceBadgeClass(r.dataSource)}`}
                          >
                            {SOURCE_LABEL_MAP[r.dataSource] ?? r.dataSource}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-3">
                          <span>
                            Owner:{" "}
                            <span className="text-foreground">{r.owner}</span>
                          </span>
                          <span>
                            Shared by:{" "}
                            <span className="text-foreground">
                              {r.sharedBy}
                            </span>
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-secondary/60">
                            {r.permLevel}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-secondary/60">
                            {r.visibility}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3"
                            data-ocid={`reports.shared.run.${r.id}`}
                          >
                            Run Report
                          </Button>
                          {r.permLevel?.includes("Export") && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              aria-label="Export"
                              data-ocid={`reports.shared.export.${r.id}`}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : sidebarSection === "prebuilt" && !isPrimaryAdmin() ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <AccessDenied
                    featureName="Advanced Report Templates"
                    showRequestButton={true}
                  />
                </div>
              ) : (
                <RecentReportsGrid
                  myReports={myReports}
                  sharedReports={sharedReports}
                  searchQuery={searchQuery}
                  onRun={(_r) => {
                    /* run custom report view */
                  }}
                  onEdit={(r) => {
                    setEditingReport(r);
                    setBuilderOpen(true);
                  }}
                  onDuplicate={handleDuplicate}
                  onShare={handleShare}
                />
              )}
            </div>
          </>
        ) : (
          <ReportResultsView
            reportLabel={reportLabel}
            reportType={activeReport}
            data={currentData}
            forex={forex}
            fxMode={fxMode}
            loading={loading}
            hasRun={hasRun}
            onRun={runReport}
            startDate={startDate}
            endDate={endDate}
            partnerId={partnerId}
            status={status}
            statusOptions={currentMeta?.statusOptions ?? []}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onPartnerIdChange={setPartnerId}
            onStatusChange={setStatus}
            onFxModeChange={setFxMode}
            incumbentDistributor={incumbentDistributor}
            onIncumbentDistributorChange={setIncumbentDistributor}
            incumbentReseller={incumbentReseller}
            onIncumbentResellerChange={setIncumbentReseller}
            vendorAlignment={vendorAlignment}
            onVendorAlignmentChange={setVendorAlignment}
            servicingOwner={servicingOwner}
            onServicingOwnerChange={setServicingOwner}
            territory={territory}
            onTerritoryChange={setTerritory}
          />
        )}
      </main>

      {/* Report Builder Modal */}
      {builderOpen && (
        <ReportBuilder
          initial={editingReport}
          onSave={handleSaveReport}
          onClose={() => {
            setBuilderOpen(false);
            setEditingReport(undefined);
          }}
        />
      )}

      {/* Share Modal */}
      {shareTarget && (
        <ShareModal
          report={shareTarget}
          onSave={handleShareSave}
          onClose={() => setShareTarget(undefined)}
        />
      )}
    </div>
  );
}
