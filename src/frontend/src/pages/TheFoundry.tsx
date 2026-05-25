import { AIProviderSettings } from "@/components/ForgeAI/AIProviderSettings";
import { InfrastructurePanel } from "@/components/Foundry/InfrastructurePanel";
import { PerformanceGovernanceModule } from "@/components/Foundry/PerformanceGovernanceModule";
import { LayoutBuilderProvider } from "@/contexts/LayoutBuilderContext";
import { AccountLayoutBuilder } from "@/pages/AccountLayoutBuilder";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Flame,
  FolderOpen,
  Globe,
  GripVertical,
  Info,
  LayoutDashboard,
  Link2,
  Lock,
  Map as MapIcon,
  Megaphone,
  Package,
  Pencil,
  Plus,
  Puzzle,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
  Upload,
  UserCheck,
  UserMinus,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useApp } from "../AppContext";
import { AccessGovernanceModule } from "../components/Foundry/AccessGovernanceModule";
import AccessValidationModule from "../components/Foundry/AccessValidationModule";
import AccountGovernancePanel from "../components/Foundry/AccountGovernancePanel";
import { OrgManagementModule } from "../components/Foundry/OrgManagementModule";
import { StakeholderAdminModule } from "../components/Foundry/StakeholderAdminModule";
import {
  DEFAULT_DASHBOARD_TEMPLATES,
  FORGEAI_LAYOUT_SUGGESTIONS,
  WIDGET_CATALOG,
} from "../data/layoutBuilderDefaults";
import { resetDemoSeedFlag } from "../utils/demoSeed";
import DashboardLayoutManagerPage, {
  DashboardLayoutManager,
} from "./DashboardLayoutManager";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FoundryModule =
  | "users"
  | "dashboards"
  | "marketing"
  | "salesops"
  | "allocation"
  | "forgeai"
  | "visibility"
  | "subscription"
  | "infrastructure"
  | "layout-builder"
  | "dashboard-manager"
  | "widget-management"
  | "dashboard-templates"
  | "layout-governance"
  | "account-governance"
  | "access-governance"
  | "access-validation"
  | "org-management"
  | "stakeholder-admin"
  | "performance-governance"
  | "integration-management";

type WorkspaceType = "vendor" | "distributor" | "reseller";

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_USERS = [
  {
    id: "u1",
    name: "James Harrington",
    email: "j.harrington@acmecorp.com",
    role: "Primary Admin",
    mfa: true,
    lastLogin: "2 hours ago",
    status: "active",
  },
  {
    id: "u2",
    name: "Rachel Chen",
    email: "r.chen@acmecorp.com",
    role: "Secondary Admin",
    mfa: true,
    lastLogin: "Yesterday",
    status: "active",
  },
  {
    id: "u3",
    name: "Marcus Webb",
    email: "m.webb@acmecorp.com",
    role: "Sales Rep",
    mfa: false,
    lastLogin: "3 days ago",
    status: "active",
  },
  {
    id: "u4",
    name: "Sofia Alvarez",
    email: "s.alvarez@acmecorp.com",
    role: "Marketing",
    mfa: true,
    lastLogin: "1 day ago",
    status: "active",
  },
  {
    id: "u5",
    name: "Tom Nakamura",
    email: "t.nakamura@acmecorp.com",
    role: "Sales Rep",
    mfa: false,
    lastLogin: "5 days ago",
    status: "inactive",
  },
];

const MOCK_DASHBOARDS = [
  {
    id: "d1",
    name: "Channel Performance",
    assignedTo: "All Admins",
    widgets: 8,
    visibility: "All",
  },
  {
    id: "d2",
    name: "Renewal Risk Dashboard",
    assignedTo: "Sales & Admin",
    widgets: 5,
    visibility: "Restricted",
  },
  {
    id: "d3",
    name: "QTD Sales Dashboard",
    assignedTo: "Sales Reps",
    widgets: 6,
    visibility: "Sales",
  },
  {
    id: "d4",
    name: "Marketing Operations",
    assignedTo: "Marketing",
    widgets: 4,
    visibility: "Marketing",
  },
];

const MOCK_ASSETS = [
  {
    id: "a1",
    name: "Q2 2026 Product Brochure",
    type: "PDF",
    size: "4.2 MB",
    uploaded: "3 days ago",
    category: "Product",
  },
  {
    id: "a2",
    name: "Partner Enablement Kit",
    type: "ZIP",
    size: "18.7 MB",
    uploaded: "1 week ago",
    category: "Enablement",
  },
  {
    id: "a3",
    name: "Brand Banner Set",
    type: "ZIP",
    size: "11.2 MB",
    uploaded: "2 weeks ago",
    category: "Brand",
  },
  {
    id: "a4",
    name: "Sales Presentation Deck",
    type: "PPTX",
    size: "6.8 MB",
    uploaded: "Today",
    category: "Sales",
  },
];

const MOCK_MDF = [
  {
    id: "m1",
    name: "EMEA Q2 Digital Campaign",
    amount: "£32,000",
    status: "approved",
    requester: "Ingram Micro",
    date: "Apr 15",
  },
  {
    id: "m2",
    name: "Nordic Reseller Summit",
    amount: "£18,500",
    status: "pending",
    requester: "Also AB",
    date: "May 3",
  },
  {
    id: "m3",
    name: "ANZ Partner Day",
    amount: "£9,200",
    status: "review",
    requester: "Dicker Data",
    date: "May 7",
  },
];

const MOCK_PRICING = [
  {
    id: "p1",
    product: "Enterprise Suite Pro",
    tier: "Gold",
    price: "$1,840/yr",
    margin: "32%",
    updated: "Apr 20",
  },
  {
    id: "p2",
    product: "Creative Cloud Team",
    tier: "Silver",
    price: "$540/yr",
    margin: "28%",
    updated: "Apr 15",
  },
  {
    id: "p3",
    product: "Analytics Platform",
    tier: "Platinum",
    price: "$2,240/yr",
    margin: "38%",
    updated: "May 1",
  },
  {
    id: "p4",
    product: "Security Suite",
    tier: "Gold",
    price: "$980/yr",
    margin: "30%",
    updated: "Apr 28",
  },
];

const MOCK_PROMOTIONS = [
  {
    id: "pr1",
    name: "Mid-Year Renewal Boost",
    type: "Discount",
    value: "15%",
    status: "active",
    expires: "Jun 30",
  },
  {
    id: "pr2",
    name: "New Reseller Incentive",
    type: "Rebate",
    value: "8%",
    status: "active",
    expires: "Jul 15",
  },
  {
    id: "pr3",
    name: "Q3 Volume Accelerator",
    type: "Tiered",
    value: "5–20%",
    status: "draft",
    expires: "Sep 30",
  },
];

const MOCK_ACCOUNTS_ALLOCATION = [
  {
    id: "ac1",
    customer: "NHS Greater Manchester",
    rep: "Marcus Webb",
    territory: "UK North",
    region: "EMEA",
    distributor: "Ingram Micro",
  },
  {
    id: "ac2",
    customer: "City of Stockholm",
    rep: "Sofia Alvarez",
    territory: "Nordics",
    region: "EMEA",
    distributor: "Also AB",
  },
  {
    id: "ac3",
    customer: "Telstra Enterprise",
    rep: "Tom Nakamura",
    territory: "ANZ",
    region: "APAC",
    distributor: "Dicker Data",
  },
  {
    id: "ac4",
    customer: "Deutsche Post DHL",
    rep: "James Harrington",
    territory: "DACH",
    region: "EMEA",
    distributor: "Ingram Micro",
  },
];

const MOCK_AI_RECS = [
  {
    id: "r1",
    type: "risk",
    title: "Renewal risk detected",
    body: "NHS Greater Manchester has no reseller engagement in 52 days. Renewal date is June 14.",
    risk: "critical",
    account: "NHS Greater Manchester",
    action: "Initiate outreach",
  },
  {
    id: "r2",
    type: "opportunity",
    title: "Upsell opportunity identified",
    body: "Telstra Enterprise is eligible for Enterprise Suite Pro upgrade. 3 active deal registrations support this.",
    risk: "medium",
    account: "Telstra Enterprise",
    action: "Create opportunity",
  },
  {
    id: "r3",
    type: "engagement",
    title: "Distributor engagement gap",
    body: "Also AB has not updated any account notes in 31 days across 7 accounts.",
    risk: "high",
    account: "Also AB",
    action: "Schedule QBR",
  },
];

const MOCK_VISIBILITY_RULES = [
  {
    object: "Customer Accounts",
    visibility: "Role-based",
    restr: "Resellers see own only",
    status: "enforced",
  },
  {
    object: "Deal Registrations",
    visibility: "Hierarchy",
    restr: "Vendor + Assigned Dist/Res",
    status: "enforced",
  },
  { object: "Promotions", visibility: "All", restr: "None", status: "open" },
  {
    object: "Pricing",
    visibility: "Tier-based",
    restr: "Gold/Platinum only",
    status: "restricted",
  },
  {
    object: "MDF Data",
    visibility: "Role-based",
    restr: "Admins + Marketing",
    status: "restricted",
  },
  {
    object: "Customer Sites",
    visibility: "Hierarchy",
    restr: "Owner + Vendor",
    status: "enforced",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  glow = false,
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  "data-ocid"?: string;
}) {
  return (
    <div
      data-ocid={dataOcid}
      className={`rounded-xl border backdrop-blur-sm transition-all ${
        glow
          ? "border-orange-500/30 shadow-[0_0_24px_rgba(249,115,22,0.08),inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      } bg-white/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    inactive: "bg-white/5 text-muted-foreground border border-white/10",
    approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
    review: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    draft: "bg-secondary/50 text-muted-foreground border border-white/10",
    critical: "bg-orange-500/15 text-orange-400 border border-orange-500/25",
    high: "bg-orange-500/15 text-orange-400 border border-orange-500/25",
    medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
    enforced: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
    restricted: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    open: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${map[status] ?? map.pending}`}
    >
      {status}
    </span>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-orange-400 border border-orange-500/30 hover:bg-orange-500/10"
        >
          <Plus size={12} />
          {action}
        </button>
      )}
    </div>
  );
}

function AdvancedLink({ to, label }: { to: string; label: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate({ to })}
      className="flex items-center gap-1.5 text-xs text-orange-400/70 hover:text-orange-400 transition-colors mt-4"
    >
      <Settings size={11} />
      {label}
      <ChevronRight size={11} />
    </button>
  );
}

// ─── Subscription data type ──────────────────────────────────────────────────

type SubscriptionData = {
  tier: string;
  orgType: string;
  adminCount: number;
  endUserCount: number;
  salesUserCount: number;
  customerAccountCount: number;
  regions: string[];
  companyName: string;
  anniversaryDate: string;
  trialStartDate: string;
  isMultiGroupReseller?: boolean;
};

// ─── Module panels ────────────────────────────────────────────────────────────

function UsersModule({ wsType }: { wsType: WorkspaceType }) {
  const adminPath =
    wsType === "vendor"
      ? "/admin"
      : wsType === "distributor"
        ? "/distributor-admin"
        : "/reseller-admin";

  return (
    <div className="space-y-4">
      <SectionHeader
        title="User Management"
        subtitle={`Manage users, roles, permissions, and access across your ${wsType} workspace`}
        action="Add User"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Users",
            value: "24",
            icon: Users,
            color: "text-blue-400",
          },
          {
            label: "Active",
            value: "21",
            icon: UserCheck,
            color: "text-emerald-400",
          },
          {
            label: "Inactive",
            value: "3",
            icon: UserMinus,
            color: "text-muted-foreground",
          },
          {
            label: "MFA Enabled",
            value: "18",
            icon: ShieldCheck,
            color: "text-orange-400",
          },
        ].map((s) => (
          <GlassCard key={s.label} className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={13} className={s.color} />
              <span className="text-[11px] text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="text-xl font-bold text-foreground">{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "Role", "MFA", "Last Login", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u, i) => (
                <tr
                  key={u.id}
                  data-ocid={`foundry.users.item.${i + 1}`}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 bg-orange-500">
                        {u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {u.role}
                  </td>
                  <td className="px-4 py-3">
                    {u.mfa ? (
                      <span className="text-emerald-400 text-xs font-medium">
                        ✓ On
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs font-medium">
                        ✗ Off
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {u.lastLogin}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        data-ocid={`foundry.users.edit_button.${i + 1}`}
                        className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        data-ocid={`foundry.users.delete_button.${i + 1}`}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <UserMinus size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <AdvancedLink
        to={adminPath}
        label="Advanced user settings & permissions"
      />
    </div>
  );
}

function DashboardsModule({ wsType }: { wsType: WorkspaceType }) {
  const adminPath =
    wsType === "vendor"
      ? "/admin"
      : wsType === "distributor"
        ? "/distributor-admin"
        : "/reseller-admin";
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Dashboard & Report Management"
        subtitle="Control which dashboards and reports are visible to each role"
        action="New Dashboard"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOCK_DASHBOARDS.map((d, i) => (
          <GlassCard
            key={d.id}
            className="p-4"
            data-ocid={`foundry.dashboards.item.${i + 1}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <LayoutDashboard size={14} className="text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {d.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Assigned to: {d.assignedTo}
                  </div>
                </div>
              </div>
              <button
                type="button"
                data-ocid={`foundry.dashboards.edit_button.${i + 1}`}
                className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil size={12} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {d.widgets} widgets
              </span>
              <span className="text-[11px] text-muted-foreground">
                Visibility:{" "}
                <span className="text-foreground font-medium">
                  {d.visibility}
                </span>
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Report Visibility by Role
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            "QTD Performance",
            "Renewal Risk Report",
            "Deal Registration Summary",
            "Channel Health Score",
            "MDF Utilisation",
            "Territory Pipeline",
          ].map((r) => (
            <div
              key={r}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5"
            >
              <BarChart2 size={12} className="text-orange-400 flex-shrink-0" />
              <span className="text-xs text-foreground truncate">{r}</span>
              <CheckCircle2
                size={11}
                className="ml-auto text-emerald-400 flex-shrink-0"
              />
            </div>
          ))}
        </div>
      </GlassCard>
      <AdvancedLink
        to={adminPath}
        label="Configure reporting permissions in detail"
      />
    </div>
  );
}

function MarketingModule({ wsType }: { wsType: WorkspaceType }) {
  const [dragging, setDragging] = useState(false);
  const adminPath =
    wsType === "vendor"
      ? "/admin"
      : wsType === "distributor"
        ? "/distributor-admin"
        : "/reseller-admin";

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Marketing Operations"
        subtitle="Campaign assets, MDF workflows, quarterly activities, and stakeholder collaboration"
        action="Upload Asset"
      />

      {/* Asset upload zone */}
      <div
        data-ocid="foundry.marketing.dropzone"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        className={`rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
          dragging
            ? "border-orange-500/60 bg-orange-500/5"
            : "border-white/[0.12] bg-white/[0.02]"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-full bg-orange-500/10">
            <Upload size={20} className="text-orange-400" />
          </div>
          <div className="text-sm font-medium text-foreground">
            Drop files here or click to upload
          </div>
          <div className="text-xs text-muted-foreground">
            PDF, PPTX, ZIP, MP4, PNG — max 50MB per file
          </div>
          <button
            type="button"
            data-ocid="foundry.marketing.upload_button"
            className="mt-1 px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all bg-orange-500/80"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Asset library */}
      <GlassCard>
        <div className="p-4 border-b border-white/8">
          <h4 className="text-sm font-semibold text-foreground">
            Campaign Asset Library
          </h4>
        </div>
        <div className="divide-y divide-white/5">
          {MOCK_ASSETS.map((a, i) => (
            <div
              key={a.id}
              data-ocid={`foundry.marketing.item.${i + 1}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
            >
              <div className="p-2 rounded-lg flex-shrink-0 bg-orange-500/10">
                <FolderOpen size={13} className="text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {a.name}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {a.type} · {a.size} · {a.uploaded}
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400">
                {a.category}
              </span>
              <button
                type="button"
                data-ocid={`foundry.marketing.download_button.${i + 1}`}
                className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download size={12} />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* MDF requests */}
      <GlassCard>
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              MDF Requests
            </h4>
            <button
              type="button"
              data-ocid="foundry.marketing.mdf.add_button"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all text-orange-400 border border-orange-500/30 hover:bg-orange-500/10"
            >
              <Plus size={11} />
              New MDF Request
            </button>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {MOCK_MDF.map((m, i) => (
            <div
              key={m.id}
              data-ocid={`foundry.marketing.mdf.item.${i + 1}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
            >
              <DollarSign size={14} className="text-orange-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {m.name}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {m.requester} · {m.date}
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {m.amount}
              </span>
              <StatusBadge status={m.status} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quarterly activity tracker */}
      <GlassCard className="p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Quarterly Marketing Activity Tracker
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {["Q1 — Complete", "Q2 — Active", "Q3 — Planned", "Q4 — Planned"].map(
            (q, i) => (
              <div
                key={q}
                className={`p-3 rounded-lg text-center border ${
                  i === 1
                    ? "bg-orange-500/10 border-orange-500/20"
                    : "bg-white/[0.03] border-white/[0.06]"
                }`}
              >
                <div
                  className={`text-[11px] font-semibold ${i === 1 ? "text-orange-400" : "text-muted-foreground"}`}
                >
                  {q.split("—")[0].trim()}
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${i === 1 ? "text-orange-300" : "text-muted-foreground/60"}`}
                >
                  {q.split("—")[1].trim()}
                </div>
              </div>
            ),
          )}
        </div>
      </GlassCard>
      <AdvancedLink to={adminPath} label="Manage MDF governance settings" />
    </div>
  );
}

function SalesOpsModule({ wsType }: { wsType: WorkspaceType }) {
  const [csvDrag, setCsvDrag] = useState(false);
  const adminPath =
    wsType === "vendor"
      ? "/admin"
      : wsType === "distributor"
        ? "/distributor-admin"
        : "/reseller-admin";

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Sales Operations"
        subtitle="Pricing, promotions, incentives, territory mapping, and account allocation"
        action="Add Promotion"
      />

      {/* Pricing table */}
      <GlassCard>
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              Pricing Management
            </h4>
            <button
              type="button"
              data-ocid="foundry.sales.pricing.add_button"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 transition-all"
            >
              <Plus size={11} />
              Add
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {[
                  "Product",
                  "Tier",
                  "Price",
                  "Margin",
                  "Updated",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PRICING.map((p, i) => (
                <tr
                  key={p.id}
                  data-ocid={`foundry.sales.pricing.item.${i + 1}`}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {p.product}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400">
                      {p.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-mono">
                    {p.price}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-400 font-mono">
                    {p.margin}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {p.updated}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      data-ocid={`foundry.sales.pricing.edit_button.${i + 1}`}
                      className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Promotions */}
      <GlassCard className="p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Active Promotions & Incentives
        </h4>
        <div className="space-y-2">
          {MOCK_PROMOTIONS.map((pr, i) => (
            <div
              key={pr.id}
              data-ocid={`foundry.sales.promotions.item.${i + 1}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
            >
              <Tag size={14} className="text-orange-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">
                  {pr.name}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {pr.type} · Expires {pr.expires}
                </div>
              </div>
              <span className="text-sm font-bold text-orange-400">
                {pr.value}
              </span>
              <StatusBadge status={pr.status} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Territory mapping */}
      <GlassCard className="p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Territory Mapping
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { t: "EMEA", reps: 8, accounts: 142 },
            { t: "APAC", reps: 4, accounts: 67 },
            { t: "Americas", reps: 6, accounts: 98 },
            { t: "MENA", reps: 2, accounts: 31 },
          ].map((t) => (
            <div
              key={t.t}
              className="p-3 rounded-lg text-center bg-orange-500/[0.07] border border-orange-500/15"
            >
              <div className="text-sm font-bold text-orange-300">{t.t}</div>
              <div className="text-[11px] text-muted-foreground mt-1">
                {t.reps} reps · {t.accounts} accs
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* CSV upload */}
      <div
        data-ocid="foundry.sales.csv.dropzone"
        onDragOver={(e) => {
          e.preventDefault();
          setCsvDrag(true);
        }}
        onDragLeave={() => setCsvDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setCsvDrag(false);
        }}
        className={`rounded-xl border-2 border-dashed p-5 text-center transition-all cursor-pointer ${
          csvDrag
            ? "border-orange-500/60 bg-orange-500/[0.04]"
            : "border-white/10 bg-transparent"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <FileSpreadsheet size={16} className="text-orange-400" />
          <span className="text-sm text-muted-foreground">
            Upload pricing or allocation data via{" "}
            <span className="text-orange-400 font-medium">CSV / Excel</span>
          </span>
          <button
            type="button"
            data-ocid="foundry.sales.csv.upload_button"
            className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-orange-500/70"
          >
            Upload
          </button>
        </div>
      </div>
      <AdvancedLink
        to={adminPath}
        label="Configure incentive programs in detail"
      />
    </div>
  );
}

function AllocationModule({ wsType }: { wsType: WorkspaceType }) {
  const adminPath =
    wsType === "vendor"
      ? "/admin"
      : wsType === "distributor"
        ? "/distributor-admin"
        : "/reseller-admin";
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Account Allocation & Mapping"
        subtitle="Assign customer accounts to sales reps, territories, distributors, and resellers"
        action="Bulk Assign"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Assigned",
            value: "284",
            icon: CheckCircle2,
            color: "text-emerald-400",
          },
          {
            label: "Unassigned",
            value: "12",
            icon: AlertTriangle,
            color: "text-orange-400",
          },
          {
            label: "Territories",
            value: "4",
            icon: MapIcon,
            color: "text-blue-400",
          },
          {
            label: "Conflicts",
            value: "2",
            icon: Zap,
            color: "text-orange-400",
          },
        ].map((s) => (
          <GlassCard key={s.label} className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={13} className={s.color} />
              <span className="text-[11px] text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="text-xl font-bold text-foreground">{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {[
                  " ",
                  "Customer",
                  "Assigned Rep",
                  "Territory",
                  "Region",
                  "Distributor",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ACCOUNTS_ALLOCATION.map((a, i) => (
                <tr
                  key={a.id}
                  data-ocid={`foundry.allocation.item.${i + 1}`}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="pl-4 py-3 text-muted-foreground">
                    <GripVertical size={12} />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {a.customer}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {a.rep}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {a.territory}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                      {a.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {a.distributor}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      data-ocid={`foundry.allocation.edit_button.${i + 1}`}
                      className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <AdvancedLink to={adminPath} label="Configure conflict detection rules" />
    </div>
  );
}

function ForgeAIModule({ wsType }: { wsType: WorkspaceType }) {
  const navigate = useNavigate();
  const adminPath =
    wsType === "vendor"
      ? "/admin"
      : wsType === "distributor"
        ? "/distributor-admin"
        : "/reseller-admin";
  const [healthScore] = useState(72);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Brain size={16} className="text-orange-400" />
            ForgeAI Controls
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live operational intelligence, renewal risk, engagement gaps, and
            AI-powered recommendations
          </p>
        </div>
        <button
          type="button"
          data-ocid="foundry.forgeai.full_page.link"
          onClick={() => navigate({ to: "/forge-ai" })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 transition-all"
        >
          Full ForgeAI
          <ArrowRight size={11} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Health gauge */}
        <GlassCard className="p-4" glow>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-2">
              <svg
                aria-label="Channel Health Score gauge"
                role="img"
                className="w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="10"
                  strokeDasharray={`${(healthScore / 100) * 251} 251`}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-orange-400">
                  {healthScore}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  Health
                </span>
              </div>
            </div>
            <div className="text-xs text-center text-muted-foreground">
              Channel Health Score
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 forgeai-pulse" />
              <span className="text-[10px] text-orange-400">Live</span>
            </div>
          </div>
        </GlassCard>

        {/* Renewal risk */}
        <GlassCard className="p-4" glow>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={13} className="text-orange-400" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Renewal Risk
              </span>
            </div>
            {[
              { label: "Critical", count: 3, color: "bg-orange-600" },
              { label: "High", count: 8, color: "bg-orange-500" },
              { label: "Medium", count: 14, color: "bg-yellow-500" },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${r.color} flex-shrink-0`}
                />
                <span className="text-xs text-muted-foreground flex-1">
                  {r.label}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Engagement gaps */}
        <GlassCard className="p-4" glow>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={13} className="text-orange-400" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Engagement Gaps
              </span>
            </div>
            {[
              { label: "Resellers", count: 5, icon: Users },
              { label: "Distributors", count: 2, icon: Building2 },
              { label: "Accounts", count: 11, icon: Briefcase },
            ].map((g) => (
              <div key={g.label} className="flex items-center gap-2">
                <g.icon
                  size={11}
                  className="text-muted-foreground flex-shrink-0"
                />
                <span className="text-xs text-muted-foreground flex-1">
                  {g.label}
                </span>
                <span className="text-sm font-bold text-orange-400">
                  {g.count}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* AI Recommendations */}
      <GlassCard glow>
        <div className="p-4 border-b border-orange-500/20 flex items-center gap-2">
          <Brain size={14} className="text-orange-400" />
          <h4 className="text-sm font-semibold text-foreground">
            AI Recommendations
          </h4>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 forgeai-pulse" />
            <span className="text-[10px] text-orange-400">
              Updated just now
            </span>
          </div>
        </div>
        <div className="divide-y divide-orange-500/10">
          {MOCK_AI_RECS.map((r, i) => (
            <div
              key={r.id}
              data-ocid={`foundry.forgeai.rec.item.${i + 1}`}
              className="p-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg flex-shrink-0 mt-0.5 bg-orange-500/10">
                  {r.type === "risk" ? (
                    <AlertTriangle size={12} className="text-amber-400" />
                  ) : r.type === "opportunity" ? (
                    <TrendingUp size={12} className="text-emerald-400" />
                  ) : (
                    <Activity size={12} className="text-orange-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      {r.title}
                    </span>
                    <StatusBadge status={r.risk} />
                  </div>
                  <p className="text-xs text-muted-foreground">{r.body}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-muted-foreground">
                      Account:{" "}
                      <span className="text-foreground">{r.account}</span>
                    </span>
                    <button
                      type="button"
                      data-ocid={`foundry.forgeai.rec.action_button.${i + 1}`}
                      className="text-[11px] text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      {r.action} <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Channel health indicators */}
      <GlassCard className="p-4" glow>
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Channel Health Indicators
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "EMEA", score: 84, trend: "up" },
            { label: "APAC", score: 68, trend: "down" },
            { label: "Americas", score: 77, trend: "up" },
            { label: "MENA", score: 59, trend: "down" },
          ].map((region) => (
            <div
              key={region.label}
              className="p-3 rounded-lg bg-white/[0.03] border border-orange-500/10"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-muted-foreground">
                  {region.label}
                </span>
                {region.trend === "up" ? (
                  <TrendingUp size={11} className="text-emerald-400" />
                ) : (
                  <TrendingDown size={11} className="text-muted-foreground" />
                )}
              </div>
              <div
                className={`text-lg font-black ${
                  region.score >= 75 ? "text-emerald-400" : "text-orange-400"
                }`}
              >
                {region.score}
              </div>
              <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    region.score >= 75
                      ? "bg-emerald-400"
                      : region.score >= 65
                        ? "bg-orange-500"
                        : "bg-orange-400"
                  }`}
                  style={{ width: `${region.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
      <AdvancedLink
        to={adminPath}
        label="Configure ForgeAI alert delivery & thresholds"
      />
    </div>
  );
}

function SubscriptionModule() {
  const navigate = useNavigate();
  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [complexityOpen, setComplexityOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cf_subscription");
      if (raw) setSubData(JSON.parse(raw) as SubscriptionData);
    } catch {
      // no-op
    }
  }, []);

  if (!subData) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Subscription & Billing"
          subtitle="Manage your CHANNELFORGE subscription, billing, and usage"
        />
        <GlassCard
          className="p-8 text-center"
          data-ocid="foundry.subscription.empty_state"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-2xl bg-orange-500/10">
              <CreditCard size={32} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                No Active Subscription Found
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
                Start your free trial to activate your CHANNELFORGE subscription
                and unlock the full platform.
              </p>
            </div>
            <button
              type="button"
              data-ocid="foundry.subscription.start_trial_button"
              onClick={() => navigate({ to: "/pricing" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-br from-orange-500 to-orange-600"
            >
              <Sparkles size={14} />
              Start Your Free Trial
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const BUNDLE_PRICES: Record<string, number> = {
    small: 49,
    medium: 149,
    large: 449,
  };
  const BUNDLE_LABELS: Record<string, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
  };
  const TIER_BADGE_CLASSES: Record<string, string> = {
    small: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    medium: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    large: "bg-orange-500/15 text-orange-400 border border-orange-500/25",
  };

  const bundleKey = (subData.tier || "growth").toLowerCase();
  const bundlePrice = BUNDLE_PRICES[bundleKey] ?? 149;
  const bundleLabel = BUNDLE_LABELS[bundleKey] ?? subData.tier;
  const tierBadge = TIER_BADGE_CLASSES[bundleKey] ?? TIER_BADGE_CLASSES.growth;
  const totalSeats =
    (subData.adminCount || 0) +
    (subData.endUserCount || 0) +
    (subData.salesUserCount || 0);
  const monthlyBilling = bundlePrice;
  const billingStr = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(monthlyBilling);

  const parseDDMMYYYY = (s: string): Date => {
    const parts = s.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return new Date(`${y}-${m}-${d}`);
    }
    return new Date(s);
  };

  const trialStart = subData.trialStartDate
    ? parseDDMMYYYY(subData.trialStartDate)
    : null;
  const today = new Date();
  const trialDaysRemaining = trialStart
    ? Math.max(
        0,
        30 - Math.floor((today.getTime() - trialStart.getTime()) / 86400000),
      )
    : 0;
  const isTrialActive = trialDaysRemaining > 0;

  const formatDate = (ddmmyyyy: string) => {
    try {
      return parseDDMMYYYY(ddmmyyyy).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return ddmmyyyy;
    }
  };

  const anniversaryFormatted = subData.anniversaryDate
    ? formatDate(subData.anniversaryDate)
    : "—";

  return (
    <div className="space-y-5" data-ocid="foundry.subscription.panel">
      <SectionHeader
        title="Subscription & Billing"
        subtitle="Manage your CHANNELFORGE subscription, plan, and usage details"
      />

      {/* Coming soon banner */}
      <div
        className="rounded-xl p-4 flex items-start gap-3 bg-orange-500/[0.06] border border-orange-500/25"
        data-ocid="foundry.subscription.coming_soon_banner"
      >
        <div className="p-2 rounded-lg flex-shrink-0 mt-0.5 bg-orange-500/10">
          <Lock size={14} className="text-orange-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-orange-300">
            Billing and live subscription management will be activated in a
            future update.
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your subscription profile is active and your trial is running. Full
            billing management, payment methods, and seat adjustments will be
            available once live billing is activated.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tier card */}
        <GlassCard
          className="p-5"
          glow
          data-ocid="foundry.subscription.tier_card"
        >
          <div className="flex items-center gap-2 mb-3">
            <Package size={14} className="text-orange-400" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Current Plan
            </span>
          </div>
          <div
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold mb-2 ${tierBadge}`}
          >
            {bundleLabel}
          </div>
          <p className="text-xs text-muted-foreground">
            {bundleKey === "small"
              ? "Small operational capacity for emerging channel ecosystems"
              : bundleKey === "medium"
                ? "Medium operational capacity for growing channel operations"
                : "Large operational capacity for enterprise channel ecosystems"}
          </p>
        </GlassCard>

        {/* Billing card */}
        <GlassCard
          className="p-5"
          glow
          data-ocid="foundry.subscription.billing_card"
        >
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={14} className="text-orange-400" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Est. Monthly Billing
            </span>
          </div>
          <div className="text-2xl font-black text-foreground mb-0.5">
            {billingStr}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              /month
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Flat bundle price — no per-user billing
          </p>
          <p className="text-[10px] text-orange-400/70 mt-1.5 flex items-center gap-1">
            <Info size={9} />
            Live billing activation coming soon.
          </p>
        </GlassCard>

        {/* Trial / Status card */}
        <GlassCard
          className="p-5"
          glow
          data-ocid="foundry.subscription.status_card"
        >
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck2 size={14} className="text-orange-400" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Subscription Status
            </span>
          </div>
          {isTrialActive ? (
            <>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mb-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Trial Active
              </div>
              <p className="text-sm font-semibold text-foreground">
                {trialDaysRemaining} days remaining
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Free trial · No billing yet
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mb-2 bg-blue-500/10 text-blue-400 border border-blue-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                Active Subscription
              </div>
              <p className="text-xs text-muted-foreground">
                Subscription is active
              </p>
            </>
          )}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[11px] text-muted-foreground">
              Next billing date
            </p>
            <p className="text-sm font-semibold text-foreground">
              {anniversaryFormatted}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Active Users */}
      <GlassCard className="p-5" data-ocid="foundry.subscription.users_card">
        <h4 className="text-sm font-semibold text-foreground mb-4">
          Active Users
        </h4>
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-3">
          <Users size={18} className="text-orange-400" />
          <div>
            <div className="text-2xl font-black text-foreground">
              {totalSeats}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Total active users in workspace
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Plan management */}
      <GlassCard className="p-5">
        <h4 className="text-sm font-semibold text-foreground mb-1">
          Plan Management
        </h4>
        <p className="text-xs text-muted-foreground mb-4">
          Upgrade or downgrade your subscription once live billing is activated.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled
            data-ocid="foundry.subscription.upgrade_button"
            title="Billing management will be available in a future update"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed bg-orange-500/20 border border-orange-500/30 text-orange-400"
          >
            <TrendingUp size={14} />
            Upgrade Plan
          </button>
          <button
            type="button"
            disabled
            data-ocid="foundry.subscription.downgrade_button"
            title="Billing management will be available in a future update"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed bg-white/[0.04] border border-white/[0.12] text-muted-foreground"
          >
            <TrendingDown size={14} />
            Downgrade Plan
          </button>
          <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
            <Info size={10} />
            Billing management will be available in a future update.
          </span>
        </div>
      </GlassCard>

      {/* Subscription details — expandable */}
      <GlassCard data-ocid="foundry.subscription.details_card">
        <button
          type="button"
          data-ocid="foundry.subscription.details_toggle"
          onClick={() => setDetailsOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-white/[0.03] transition-colors rounded-xl"
        >
          <span className="flex items-center gap-2">
            <Info size={14} className="text-orange-400" />
            View Subscription Details
          </span>
          {detailsOpen ? (
            <ChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground" />
          )}
        </button>
        {detailsOpen && (
          <div className="px-5 pb-5 space-y-3 border-t border-white/8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {[
                { label: "Company", value: subData.companyName || "—" },
                { label: "Organisation Type", value: subData.orgType || "—" },
                {
                  label: "Operational Regions",
                  value: Array.isArray(subData.regions)
                    ? subData.regions.join(", ")
                    : subData.regions || "—",
                },
                {
                  label: "Customer Accounts (est.)",
                  value: String(subData.customerAccountCount || "—"),
                },
                {
                  label: "Multi-Group Reseller",
                  value: subData.isMultiGroupReseller ? "Yes" : "No",
                },
                {
                  label: "Trial Start Date",
                  value: subData.trialStartDate
                    ? formatDate(subData.trialStartDate)
                    : "—",
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Org complexity — expandable */}
      <GlassCard data-ocid="foundry.subscription.complexity_card">
        <button
          type="button"
          data-ocid="foundry.subscription.complexity_toggle"
          onClick={() => setComplexityOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-white/[0.03] transition-colors rounded-xl"
        >
          <span className="flex items-center gap-2">
            <Globe size={14} className="text-orange-400" />
            Organisation Complexity Profile
          </span>
          {complexityOpen ? (
            <ChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground" />
          )}
        </button>
        {complexityOpen && (
          <div className="px-5 pb-5 border-t border-white/8">
            <p className="text-xs text-muted-foreground mt-4 mb-3">
              This complexity profile was captured during onboarding and is used
              to calibrate ForgeAI, governance controls, and operational
              recommendations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  label: "Admins",
                  value: subData.adminCount || 0,
                  desc: "System administrators",
                },
                {
                  label: "End Users",
                  value: subData.endUserCount || 0,
                  desc: "Operational end users",
                },
                {
                  label: "Sales Users",
                  value: subData.salesUserCount || 0,
                  desc: "Sales representatives",
                },
                {
                  label: "Customer Accounts",
                  value: subData.customerAccountCount || 0,
                  desc: "Estimated total accounts",
                },
                {
                  label: "Regions",
                  value: Array.isArray(subData.regions)
                    ? subData.regions.length
                    : 0,
                  desc: "Operational territories",
                },
                {
                  label: "Org Type",
                  value: subData.orgType || "—",
                  desc: "Classification",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="p-3 rounded-xl flex flex-col gap-1 bg-orange-500/[0.05] border border-orange-500/[0.12]"
                >
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {c.label}
                  </span>
                  <span className="text-lg font-black text-orange-400">
                    {c.value}
                  </span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {c.desc}
                  </span>
                </div>
              ))}
            </div>
            {subData.isMultiGroupReseller && (
              <div className="mt-3 p-3 rounded-xl flex items-center gap-2 bg-blue-500/[0.08] border border-blue-500/20">
                <Sparkles size={13} className="text-blue-400 flex-shrink-0" />
                <span className="text-xs text-blue-300 font-medium">
                  Multi-Group Reseller — Distributor-tier complexity pricing
                  applies
                </span>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      <div className="flex items-center justify-end">
        <button
          type="button"
          data-ocid="foundry.subscription.view_plans_button"
          onClick={() => navigate({ to: "/pricing" })}
          className="flex items-center gap-1.5 text-xs text-orange-400/70 hover:text-orange-400 transition-colors"
        >
          <ExternalLink size={11} />
          View all subscription plans
          <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

function VisibilityModule({ wsType }: { wsType: WorkspaceType }) {
  const adminPath =
    wsType === "vendor"
      ? "/admin"
      : wsType === "distributor"
        ? "/distributor-admin"
        : "/reseller-admin";
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Operational Visibility Controls"
        subtitle="Define who sees accounts, opportunities, deals, pricing, MDF, and dashboards"
        action="Add Rule"
      />

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {[
                  "Object",
                  "Visibility Mode",
                  "Restriction",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_VISIBILITY_RULES.map((v, i) => (
                <tr
                  key={v.object}
                  data-ocid={`foundry.visibility.item.${i + 1}`}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Eye size={12} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {v.object}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {v.visibility}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {v.restr}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={v.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        data-ocid={`foundry.visibility.edit_button.${i + 1}`}
                        className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        data-ocid={`foundry.visibility.lock_button.${i + 1}`}
                        className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Lock size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Role Access Matrix
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left py-2 text-muted-foreground font-medium">
                  Object
                </th>
                {[
                  "Primary Admin",
                  "Secondary Admin",
                  "Sales Rep",
                  "Marketing",
                  "End User",
                ].map((r) => (
                  <th
                    key={r}
                    className="text-center py-2 text-muted-foreground font-medium px-2"
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                "Accounts",
                "Deals",
                "Pricing",
                "MDF",
                "Reports",
                "Dashboards",
              ].map((obj) => (
                <tr key={obj} className="border-b border-white/5 last:border-0">
                  <td className="py-2 font-medium text-foreground">{obj}</td>
                  {[
                    "Primary Admin",
                    "Secondary Admin",
                    "Sales Rep",
                    "Marketing",
                    "End User",
                  ].map((role, ci) => (
                    <td key={role} className="text-center py-2 px-2">
                      {ci < 2 ? (
                        <CheckCircle2
                          size={12}
                          className="inline text-emerald-400"
                        />
                      ) : (
                        <span className="text-muted-foreground/40 text-[10px]">
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
      <AdvancedLink
        to={adminPath}
        label="Configure granular visibility rules"
      />
    </div>
  );
}

// ─── Module rail config ────────────────────────────────────────────────────────

const MODULE_RAIL: {
  id: FoundryModule;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  adminOnly?: boolean;
}[] = [
  {
    id: "users",
    name: "User Management",
    description: "Manage users, roles & permissions",
    icon: Users,
  },
  {
    id: "dashboards",
    name: "Dashboard & Reports",
    description: "Control visibility & sharing",
    icon: LayoutDashboard,
  },
  {
    id: "marketing",
    name: "Marketing Operations",
    description: "Assets, MDF & campaigns",
    icon: Megaphone,
  },
  {
    id: "salesops",
    name: "Sales Operations",
    description: "Pricing, promotions & allocations",
    icon: TrendingUp,
  },
  {
    id: "allocation",
    name: "Account Allocation",
    description: "Mapping, territories & conflicts",
    icon: MapIcon,
  },
  {
    id: "forgeai",
    name: "ForgeAI Controls",
    description: "AI delivery & configuration",
    icon: Brain,
  },
  {
    id: "visibility",
    name: "Visibility Controls",
    description: "Who sees what across the platform",
    icon: Eye,
  },
  {
    id: "infrastructure",
    name: "Infrastructure & Compute",
    description: "Credit balances, usage & forecasting",
    icon: Server,
  },
  {
    id: "subscription",
    name: "Subscription",
    description: "Current plan & billing",
    icon: CreditCard,
  },
  {
    id: "layout-builder",
    name: "Account Layout Builder",
    description: "Drag-and-drop layout customisation",
    icon: LayoutDashboard,
  },
  {
    id: "dashboard-manager",
    name: "Dashboard Layout Manager",
    description: "Manage and customise dashboards",
    icon: BarChart3,
  },
  {
    id: "widget-management",
    name: "Widget Management",
    description: "Browse and configure dashboard widgets",
    icon: Puzzle,
  },
  {
    id: "dashboard-templates",
    name: "Dashboard Templates",
    description: "Create, clone and assign templates",
    icon: BookOpen,
  },
  {
    id: "layout-governance",
    name: "Layout Governance",
    description: "Permissions, assignments and audit log",
    icon: Shield,
  },
  {
    id: "account-governance",
    name: "Account Governance",
    description: "Manage customer ownership and partner mappings",
    icon: Shield,
  },
  {
    id: "access-governance",
    name: "Access Governance",
    description: "Pending requests, locked views & visibility rules",
    icon: ShieldCheck,
  },
  {
    id: "access-validation",
    name: "Access Validation",
    description: "Live security diagnostics, hierarchy tests & audit tracing",
    icon: ShieldCheck,
  },
  {
    id: "org-management",
    name: "Team & Org Structure",
    description: "Team members, reporting lines & departments",
    icon: Users,
  },
  {
    id: "stakeholder-admin",
    name: "User & Stakeholder Admin",
    description: "Bulk import, directory & visibility governance",
    icon: UserCheck,
  },
  {
    id: "performance-governance",
    name: "Performance Governance",
    description: "KPI framework, YoY tracking & scorecards",
    icon: BarChart3,
    adminOnly: true,
  },
  {
    id: "integration-management" as FoundryModule,
    name: "Integration Management",
    description: "Manage external calendar and email integrations",
    icon: Link2,
  },
];

// ─── Workspace helpers ────────────────────────────────────────────────────────

type WorkspaceConfig = {
  type: WorkspaceType;
  label: string;
  subtitle: string;
  badgeClass: string;
  headerTag: string;
};

function getWorkspaceConfig(
  isVendor: () => boolean,
  isDistributor: () => boolean,
): WorkspaceConfig {
  if (isVendor())
    return {
      type: "vendor",
      label: "Vendor",
      subtitle:
        "Channel ecosystem management · Distributor & reseller oversight · Revenue governance",
      badgeClass: "bg-orange-500/15 text-orange-400",
      headerTag: "Vendor Workspace",
    };
  if (isDistributor())
    return {
      type: "distributor",
      label: "Distributor",
      subtitle:
        "Vendor relationships · Reseller coordination · Territory operations · MDF governance",
      badgeClass: "bg-blue-500/10 text-blue-400",
      headerTag: "Distributor Workspace",
    };
  return {
    type: "reseller",
    label: "Reseller",
    subtitle:
      "Customer account management · Renewals · Pipeline visibility · Sales operations",
    badgeClass: "bg-emerald-500/10 text-emerald-400",
    headerTag: "Reseller Workspace",
  };
}

// ─── Visible modules per workspace ─────────────────────────────────────────────

function getVisibleModules(wsType: WorkspaceType): FoundryModule[] {
  if (wsType === "vendor")
    return [
      "users",
      "layout-builder",
      "dashboard-manager",
      "widget-management",
      "dashboard-templates",
      "layout-governance",
      "dashboards",
      "marketing",
      "salesops",
      "allocation",
      "forgeai",
      "visibility",
      "infrastructure",
      "account-governance",
      "access-governance",
      "access-validation",
      "org-management",
      "stakeholder-admin",
      "performance-governance",
      "integration-management",
      "subscription",
    ];
  if (wsType === "distributor")
    return [
      "users",
      "layout-builder",
      "dashboard-manager",
      "widget-management",
      "dashboard-templates",
      "layout-governance",
      "dashboards",
      "marketing",
      "allocation",
      "forgeai",
      "visibility",
      "infrastructure",
      "account-governance",
      "access-governance",
      "access-validation",
      "org-management",
      "stakeholder-admin",
      "performance-governance",
      "integration-management",
      "subscription",
    ];
  // reseller — reduced set
  return [
    "users",
    "layout-builder",
    "dashboard-manager",
    "widget-management",
    "dashboard-templates",
    "layout-governance",
    "dashboards",
    "forgeai",
    "visibility",
    "infrastructure",
    "account-governance",
    "access-governance",
    "access-validation",
    "org-management",
    "stakeholder-admin",
    "performance-governance",
    "integration-management",
    "subscription",
  ];
}

// TEST_MODE_PLACEHOLDER: Remove or replace before production
const DEMO_INTEGRATIONS = [
  {
    id: "outlook",
    name: "Microsoft Outlook / Microsoft 365 Calendar",
    status: "Available",
    usersConnected: 0,
    description:
      "Sync meetings, callbacks, and renewal reminders with Outlook and Microsoft 365 Calendar.",
  },
  {
    id: "google-cal",
    name: "Google Calendar",
    status: "Available",
    usersConnected: 0,
    description:
      "Sync calendar events and operational tasks with Google Calendar.",
  },
  {
    id: "gmail",
    name: "Gmail",
    status: "Available",
    usersConnected: 0,
    description:
      "Improve activity tracking and account collaboration via Gmail.",
  },
  {
    id: "exchange",
    name: "Exchange Server",
    status: "Available",
    usersConnected: 0,
    description:
      "Connect to on-premise or hosted Exchange for enterprise email and calendar.",
  },
  {
    id: "enterprise-api",
    name: "Enterprise Calendar API",
    status: "Coming Soon",
    usersConnected: 0,
    description:
      "Connect to custom enterprise calendar APIs for advanced integration.",
  },
];
const IntegrationManagementModule = () => {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>({
    outlook: true,
    "google-cal": true,
    gmail: true,
    exchange: true,
    "enterprise-api": false,
  });
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Integration Management</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Control which external calendar and email integrations are available
          to users in your organisation.
        </p>
      </div>
      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="text-left p-3 font-medium">Integration</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Users Connected</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_INTEGRATIONS.map((intg) => (
              <React.Fragment key={intg.id}>
                <tr className="border-b hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-medium">{intg.name}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${intg.status === "Available" ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}
                    >
                      {intg.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {intg.status === "Coming Soon"
                      ? "N/A"
                      : intg.usersConnected}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRow(expandedRow === intg.id ? null : intg.id)
                      }
                      className="text-xs border border-border rounded px-2 py-1 hover:bg-muted/40 transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
                {expandedRow === intg.id && (
                  <tr className="border-b bg-muted/10">
                    <td colSpan={4} className="p-4">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {intg.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">
                            Allow users to connect {intg.name}:
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setEnabled((e) => ({
                                ...e,
                                [intg.id]: !e[intg.id],
                              }))
                            }
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled[intg.id] ? "bg-primary" : "bg-muted"}`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${enabled[intg.id] ? "translate-x-5" : "translate-x-1"}`}
                            />
                          </button>
                          <span className="text-xs text-muted-foreground">
                            {enabled[intg.id] ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          Integration credentials are stored securely.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────

function WidgetManagementModule() {
  const [category, setCategory] = useState("All");
  const categories = [
    "All",
    "KPI",
    "Charts",
    "Operations",
    "AI",
    "Infrastructure",
  ];
  const filtered =
    category === "All"
      ? WIDGET_CATALOG
      : WIDGET_CATALOG.filter(
          (w: { category: string }) => w.category === category,
        );
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">
          Widget Management
        </h2>
        <p className="text-sm text-white/60">
          Browse and configure widgets for your dashboards
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${category === cat ? "bg-orange-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(
          (widget: {
            type: unknown;
            name: string;
            description: string;
            category: string;
          }) => (
            <div
              key={String(widget.type)}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-orange-500/50 transition-all"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-semibold text-white mb-1">
                {widget.name}
              </div>
              <div className="text-xs text-white/50 mb-3">
                {widget.description}
              </div>
              <span className="px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-300">
                {widget.category}
              </span>
            </div>
          ),
        )}
      </div>
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
        <div className="text-orange-400 font-semibold mb-3">
          ⚡ ForgeAI Suggestions
        </div>
        {FORGEAI_LAYOUT_SUGGESTIONS.slice(0, 3).map(
          (s: { suggestion: string }, i: number) => (
            <div
              key={`suggestion-${i}`}
              className="py-2 border-b border-white/10 last:border-0 text-sm text-white/70"
            >
              {s.suggestion}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function DashboardTemplatesModule() {
  const [showAssign, setShowAssign] = useState(false);
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">
            Dashboard Templates
          </h2>
          <p className="text-sm text-white/60">
            Create, clone, and assign operational dashboard templates
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + New Template
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_DASHBOARD_TEMPLATES.map(
          (tpl: {
            id: string;
            name: string;
            description: string;
            widgets: unknown[];
          }) => (
            <div
              key={tpl.id}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-orange-500/40 transition-all"
            >
              <div className="text-lg font-semibold text-white mb-1">
                {tpl.name}
              </div>
              <div className="text-sm text-white/50 mb-3">
                {tpl.description}
              </div>
              <div className="text-xs text-white/40 mb-4">
                {tpl.widgets.length} widgets
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg"
                >
                  Preview
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg"
                >
                  Clone
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssign(true)}
                  className="px-3 py-1.5 text-xs bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 rounded-lg"
                >
                  Assign
                </button>
              </div>
            </div>
          ),
        )}
      </div>
      {showAssign && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowAssign(false)}
          onKeyDown={() => {}}
          tabIndex={0}
          role="presentation"
        >
          <div
            className="bg-card border border-white/20 rounded-2xl p-6 w-full max-w-md"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              Assign Template
            </h3>
            <div className="space-y-2 mb-6">
              {["Vendor", "Distributor", "Reseller"].map((org) => (
                <label
                  key={org}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input type="checkbox" className="accent-orange-500" />
                  <span className="text-white text-sm">{org}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowAssign(false)}
                className="px-4 py-2 text-sm text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowAssign(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
        <div className="text-orange-400 font-semibold mb-2">⚡ ForgeAI</div>
        <p className="text-sm text-white/60">
          Marketing teams commonly pin MDF Performance templates. Sales teams
          benefit from the Pipeline Board template.
        </p>
      </div>
    </div>
  );
}

function LayoutGovernanceModule() {
  const [tab, setTab] = useState<"permissions" | "assignments" | "audit">(
    "permissions",
  );
  const [perms, setPerms] = useState({
    canManageLayouts: false,
    canManageWidgets: false,
    canManageDashboardTemplates: false,
    canManageCustomFields: false,
  });
  const defaultLayouts = [
    "Default Layout",
    "Sales Team Layout",
    "Marketing Layout",
    "Leadership Layout",
    "Operations Layout",
  ];
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">
          Layout Governance
        </h2>
        <p className="text-sm text-white/60">
          Manage layout permissions, assignments, and audit history
        </p>
      </div>
      <div className="flex gap-2 border-b border-white/10">
        {(["permissions", "assignments", "audit"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-orange-500 text-orange-400" : "border-transparent text-white/60 hover:text-white"}`}
          >
            {t === "assignments"
              ? "Assignment Matrix"
              : t === "audit"
                ? "Audit Log"
                : "Permissions"}
          </button>
        ))}
      </div>
      {tab === "permissions" && (
        <div className="space-y-4">
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-sm text-white/70">
            All permissions are OFF by default. Only grant access to trusted
            administrators.
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            {(Object.keys(perms) as (keyof typeof perms)[]).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{key}</div>
                  <div className="text-xs text-white/40">Default: OFF</div>
                </div>
                <button
                  type="button"
                  onClick={() => setPerms((p) => ({ ...p, [key]: !p[key] }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${perms[key] ? "bg-orange-500" : "bg-white/20"}`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${perms[key] ? "translate-x-6" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium"
          >
            Save Permissions
          </button>
        </div>
      )}
      {tab === "assignments" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-left border-b border-white/10">
                {[
                  "Layout",
                  "Org Type",
                  "Department",
                  "Role",
                  "Priority",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="py-3 px-4 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {defaultLayouts.map((name, i) => (
                <tr
                  key={name}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="py-3 px-4 text-white">{name}</td>
                  <td className="py-3 px-4 text-white/60">All</td>
                  <td className="py-3 px-4 text-white/60">All</td>
                  <td className="py-3 px-4 text-white/60">All</td>
                  <td className="py-3 px-4 text-white/60">{i + 1}</td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "audit" && (
        <div className="text-center py-16 text-white/40">
          <div className="text-4xl mb-3">📋</div>
          <div>No audit entries yet. Layout changes will appear here.</div>
        </div>
      )}
    </div>
  );
}

export function TheFoundry() {
  const { isVendor, isDistributor, isPrimaryAdmin, isSecondaryAdmin } =
    useApp();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<FoundryModule>("users");
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const section = params.get("section");
    if (tab === "infrastructure") {
      setActiveModule("infrastructure");
    }
    if (section) {
      setPendingSection(section);
    }
  }, []);

  const isAdmin = isPrimaryAdmin() || isSecondaryAdmin();

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-4 rounded-full bg-orange-500/10">
          <Lock size={32} className="text-orange-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">
            Access Restricted
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            The Foundry is available to Primary and Secondary Admins only.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-orange-500/80"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const wsConfig = getWorkspaceConfig(isVendor, isDistributor);
  const adminSettingsPath =
    wsConfig.type === "vendor"
      ? "/admin"
      : wsConfig.type === "distributor"
        ? "/distributor-admin"
        : "/reseller-admin";

  const visibleModules = getVisibleModules(wsConfig.type);
  const railItems = MODULE_RAIL.filter((m) => visibleModules.includes(m.id));

  // If active module was hidden by workspace type, reset to first visible
  const safeActive = visibleModules.includes(activeModule)
    ? activeModule
    : visibleModules[0];

  function renderModule() {
    switch (safeActive) {
      case "users":
        return <UsersModule wsType={wsConfig.type} />;
      case "dashboards":
        return <DashboardsModule wsType={wsConfig.type} />;
      case "marketing":
        return <MarketingModule wsType={wsConfig.type} />;
      case "salesops":
        return <SalesOpsModule wsType={wsConfig.type} />;
      case "allocation":
        return <AllocationModule wsType={wsConfig.type} />;
      case "forgeai":
        return (
          <div className="space-y-6">
            <ForgeAIModule wsType={wsConfig.type} />
            <AIProviderSettings wsType={wsConfig.type as string} />
          </div>
        );
      case "visibility":
        return <VisibilityModule wsType={wsConfig.type} />;
      case "infrastructure":
        return (
          <div className="space-y-8">
            <InfrastructurePanel
              isAdmin={isAdmin}
              workspaceType={wsConfig.type}
              section={pendingSection ?? undefined}
            />
            <div className="p-6 rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
              <h3 className="text-lg font-semibold text-white mb-2">
                Demo &amp; Testing Environment
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Reset the demo seed flag to allow fresh demo data to be loaded
                on next login. Use this to restore the demo environment for
                testing or demonstrations.
              </p>
              <button
                type="button"
                onClick={() => {
                  resetDemoSeedFlag();
                  window.alert(
                    "Demo environment reset. Refresh the page and log in again to reseed with fresh demo data.",
                  );
                }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Reset Demo Environment
              </button>
            </div>
          </div>
        );
      case "subscription":
        return <SubscriptionModule />;
      case "layout-builder":
        return (
          <LayoutBuilderProvider>
            <AccountLayoutBuilder />
          </LayoutBuilderProvider>
        );
      case "dashboard-manager":
        return (
          <LayoutBuilderProvider>
            <DashboardLayoutManager />
          </LayoutBuilderProvider>
        );
      case "widget-management":
        return (
          <LayoutBuilderProvider>
            <WidgetManagementModule />
          </LayoutBuilderProvider>
        );
      case "dashboard-templates":
        return (
          <LayoutBuilderProvider>
            <DashboardTemplatesModule />
          </LayoutBuilderProvider>
        );
      case "layout-governance":
        return (
          <LayoutBuilderProvider>
            <LayoutGovernanceModule />
          </LayoutBuilderProvider>
        );
      case "account-governance":
        return <AccountGovernancePanel />;
      case "access-governance":
        return <AccessGovernanceModule />;
      case "access-validation":
        return <AccessValidationModule />;
      case "org-management":
        return <OrgManagementModule />;
      case "stakeholder-admin":
        return <StakeholderAdminModule isPrimaryAdmin={isPrimaryAdmin()} />;
      case "performance-governance":
        return <PerformanceGovernanceModule />;
      case "integration-management":
        return <IntegrationManagementModule />;
    }
  }

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* Page header */}
      <div className="px-6 pt-6 pb-5 border-b border-white/[0.07] bg-card/95 shadow-[0_4px_32px_rgba(0,0,0,0.3)] flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>CHANNELFORGE</span>
            <ChevronRight size={10} />
            <span className="text-foreground font-medium">The Foundry</span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-500/20 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <Flame size={22} className="text-orange-400" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-foreground font-display">
                    The Foundry
                  </h1>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${wsConfig.badgeClass}`}
                  >
                    {wsConfig.headerTag}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {wsConfig.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/[0.08] border border-orange-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 forgeai-pulse" />
                <span className="text-[11px] font-medium text-orange-400">
                  Operational
                </span>
              </div>
              <button
                type="button"
                data-ocid="foundry.admin_settings.link"
                onClick={() => navigate({ to: adminSettingsPath })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground transition-all"
              >
                <Wrench size={12} />
                Advanced Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Split layout: rail + content */}
      <div className="flex flex-1 min-h-0 max-w-7xl mx-auto w-full">
        {/* ── Left module selector rail ───────────────────────────────── */}
        <aside className="w-[220px] flex-shrink-0 border-r border-white/10 bg-card flex flex-col hidden md:flex">
          <div className="p-4 border-b border-white/8 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Modules
            </span>
            <Settings size={13} className="text-muted-foreground" />
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {railItems.map((module) => {
              const isActive = safeActive === module.id;
              return (
                <button
                  key={module.id}
                  type="button"
                  data-ocid={`foundry.module.${module.id}.tab`}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "border-l-2 border-orange-500 text-orange-400 bg-orange-500/10 pl-[10px]"
                      : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <module.icon
                    size={15}
                    className={`mt-0.5 flex-shrink-0 ${isActive ? "text-orange-400" : ""}`}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-tight">
                      {module.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 mt-0.5 leading-tight">
                      {module.description}
                    </div>
                  </div>
                  {module.id === "forgeai" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 forgeai-pulse ml-auto mt-1 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
          {/* Advanced settings link at bottom */}
          <div className="p-3 border-t border-white/8">
            <button
              type="button"
              data-ocid="foundry.rail.advanced_settings.link"
              onClick={() => navigate({ to: adminSettingsPath })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground/70 hover:text-orange-400 hover:bg-orange-500/5 transition-colors"
            >
              <ExternalLink size={11} />
              <span>Advanced Settings</span>
              <ChevronRight size={11} className="ml-auto" />
            </button>
          </div>
        </aside>

        {/* ── Mobile module selector dropdown ─────────────────────────── */}
        <div className="md:hidden w-full border-b border-white/8 bg-card px-4 py-3 flex-shrink-0">
          <select
            value={safeActive}
            onChange={(e) => setActiveModule(e.target.value as FoundryModule)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            aria-label="Select Foundry module"
          >
            {railItems.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* ── Right content area ──────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{renderModule()}</div>

          {/* Footer */}
          <div className="px-6 py-4 mt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground/60">
              <span>The Foundry · CHANNELFORGE Operational Command Center</span>
              <span>
                © {new Date().getFullYear()}. Built with love using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-muted-foreground transition-colors"
                >
                  caffeine.ai
                </a>
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
