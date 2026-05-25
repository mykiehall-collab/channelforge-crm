// TODO-SECURITY: Test/demo data integration — remove before production.
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  Brain,
  Building2,
  ChevronRight,
  Globe,
  HeartPulse,
  Network,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../AppContext";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useFilterContext } from "../contexts/FilterContext";
import {
  DEMO_CASES,
  DEMO_CUSTOMERS,
  DEMO_DISTRIBUTORS,
  DEMO_MDF_REQUESTS,
  DEMO_OPPORTUNITIES,
  DEMO_RESELLERS,
  DEMO_VENDORS,
  type DemoOrg,
  getEcosystemForOrgType,
} from "../data/demoEcosystem";
import { IS_TEST_MODE } from "../utils/testMode";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrgKind =
  | "Vendor"
  | "Distributor"
  | "Global Distributor"
  | "Reseller"
  | "Multi-Group Reseller";

type SubTabId =
  | "distributors"
  | "resellers"
  | "customers"
  | "opportunities"
  | "cases"
  | "mdf"
  | "territory"
  | "ecosystem"
  | "vendors"
  | "regional"
  | "vendor-rel"
  | "distributor-rel"
  | "shared-ops";

interface SubTabDef {
  id: SubTabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface ForgeInsight {
  type: "warning" | "positive" | "info";
  text: string;
}

interface TerritoryRow {
  territory: string;
  qtd: string;
  qtdStatus: "ahead" | "on-track" | "risk";
  qoq: string;
  yoy: string;
  yoyStatus: "positive" | "negative";
}

// ─── Helper functions ─────────────────────────────────────────────────────────

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const healthColor = (score: number) =>
  score >= 85
    ? "text-green-400"
    : score >= 70
      ? "text-yellow-400"
      : "text-red-400";
const fmtK = (v: number) =>
  v >= 1000000 ? `£${(v / 1000000).toFixed(1)}M` : `£${(v / 1000).toFixed(0)}K`;

// ─── OrgCard component ───────────────────────────────────────────────────────

function OrgCard({ org }: { org: DemoOrg }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2 hover:border-accent/40 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-primary/20 border border-primary/40 shrink-0">
          {initials(org.name)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {org.name}
          </div>
          <div className="text-xs text-muted-foreground">{org.territory}</div>
        </div>
      </div>
      {org.healthScore !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Health:</span>
          <span className={`font-semibold ${healthColor(org.healthScore)}`}>
            {org.healthScore}%
          </span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${org.healthScore >= 85 ? "bg-green-400" : org.healthScore >= 70 ? "bg-yellow-400" : "bg-red-400"}`}
              style={{ width: `${org.healthScore}%` }}
            />
          </div>
        </div>
      )}
      {org.performanceMetrics && (
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>
            QTD:{" "}
            <span className="font-semibold text-foreground">
              {fmtK(org.performanceMetrics.qtd)}
            </span>
          </span>
          <span>
            QoQ:{" "}
            <span
              className={`font-semibold ${
                org.performanceMetrics.qoq >= 0
                  ? "text-green-400"
                  : "text-destructive"
              }`}
            >
              {org.performanceMetrics.qoq >= 0 ? "+" : ""}
              {org.performanceMetrics.qoq}%
            </span>
          </span>
          <span>
            YoY:{" "}
            <span
              className={`font-semibold ${
                org.performanceMetrics.yoy >= 0
                  ? "text-green-400"
                  : "text-destructive"
              }`}
            >
              {org.performanceMetrics.yoy >= 0 ? "+" : ""}
              {org.performanceMetrics.yoy}%
            </span>
          </span>
        </div>
      )}
      <div className="text-xs text-muted-foreground">
        Owner: <span className="text-foreground font-medium">{org.owner}</span>
      </div>
    </div>
  );
}

const VENDOR_TERRITORIES: TerritoryRow[] = [
  {
    territory: "UK & Ireland",
    qtd: "£1.82M",
    qtdStatus: "ahead",
    qoq: "+14%",
    yoy: "+22%",
    yoyStatus: "positive",
  },
  {
    territory: "DACH",
    qtd: "£1.44M",
    qtdStatus: "on-track",
    qoq: "+9%",
    yoy: "+18%",
    yoyStatus: "positive",
  },
  {
    territory: "Nordics",
    qtd: "£640K",
    qtdStatus: "risk",
    qoq: "-5%",
    yoy: "-4%",
    yoyStatus: "negative",
  },
  {
    territory: "Benelux",
    qtd: "£880K",
    qtdStatus: "on-track",
    qoq: "+7%",
    yoy: "+11%",
    yoyStatus: "positive",
  },
  {
    territory: "Southern Europe",
    qtd: "£520K",
    qtdStatus: "risk",
    qoq: "-2%",
    yoy: "+3%",
    yoyStatus: "positive",
  },
];

// (old static DIST_VENDORS / RESELLER_VENDORS / RESELLER_DISTRIBUTORS removed — data now from demoEcosystem)

// ─── ForgeAI insight data ─────────────────────────────────────────────────────

const FORGE_INSIGHTS: Record<string, ForgeInsight[]> = {
  Vendor: [
    {
      type: "warning",
      text: "Westcon EMEA showing -4% YoY decline — engagement review recommended.",
    },
    {
      type: "warning",
      text: "Reseller activation rate below target in Nordics. Consider incentive programme review.",
    },
    {
      type: "positive",
      text: "Arrow EMEA pipeline momentum +22% YoY — strong distributor growth trajectory.",
    },
  ],
  Distributor: [
    {
      type: "positive",
      text: "Microsoft joint pipeline is 18% above commitment target — acceleration opportunity.",
    },
    {
      type: "warning",
      text: "Regional performance in Southern Europe tracking below benchmark by 12%.",
    },
    {
      type: "info",
      text: "VMware co-marketing budget utilisation at 62% — £91K MDF available before Q close.",
    },
  ],
  "Global Distributor": [
    {
      type: "positive",
      text: "Multi-region pipeline coverage improved 15% QoQ across EMEA and APAC.",
    },
    {
      type: "warning",
      text: "APAC vendor commitment utilisation below target in Singapore zone.",
    },
    {
      type: "info",
      text: "Extended regional MDF allocation available — review vendor co-marketing schedule.",
    },
  ],
  Reseller: [
    {
      type: "positive",
      text: "Vendor renewal incentive available — claim before Q3 close. Estimated value: £8,400.",
    },
    {
      type: "warning",
      text: "Distributor credit utilisation at 87% — consider requesting credit limit extension.",
    },
    {
      type: "info",
      text: "2 deal registrations pending vendor approval for more than 7 days.",
    },
  ],
  "Multi-Group Reseller": [
    {
      type: "positive",
      text: "Group-wide pipeline grew 19% QoQ — multi-group momentum is strong.",
    },
    {
      type: "warning",
      text: "Renewal coverage gap identified across reseller group B — 3 contracts unassigned.",
    },
    {
      type: "info",
      text: "Distributor joint marketing funds available across 2 vendor relationships.",
    },
  ],
};

// ─── Helper components ────────────────────────────────────────────────────────

function StatusBadge({
  status,
}: { status: "ahead" | "on-track" | "risk" | "positive" | "negative" }) {
  const config = {
    ahead: { label: "Ahead", cls: "bg-emerald-500/15 text-emerald-400" },
    "on-track": { label: "On Track", cls: "bg-accent/15 text-accent" },
    risk: { label: "Risk", cls: "bg-destructive/15 text-destructive" },
    positive: { label: "↑", cls: "bg-emerald-500/15 text-emerald-400" },
    negative: { label: "↓", cls: "bg-destructive/15 text-destructive" },
  }[status];
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.cls}`}
    >
      {config.label}
    </span>
  );
}

function ForgeAIPanel({ orgType }: { orgType: string }) {
  const insights = FORGE_INSIGHTS[orgType] ?? FORGE_INSIGHTS.Vendor;
  return (
    <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={14} className="text-accent" />
        <span className="text-xs font-semibold text-accent uppercase tracking-wide">
          ForgeAI Ecosystem Insights
        </span>
      </div>
      <div className="space-y-2">
        {insights.map((ins, i) => {
          const Icon =
            ins.type === "warning"
              ? AlertTriangle
              : ins.type === "positive"
                ? TrendingUp
                : Activity;
          const cls =
            ins.type === "warning"
              ? "text-amber-400"
              : ins.type === "positive"
                ? "text-emerald-400"
                : "text-accent";
          return (
            <div
              key={`insight-${ins.type ?? i}`}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card/60 border border-border/40"
            >
              <Icon size={13} className={`flex-shrink-0 mt-0.5 ${cls}`} />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {ins.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sub-tab content sections ─────────────────────────────────────────────────

function DistributorsTab() {
  const ecosystem = getEcosystemForOrgType("Vendor");
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {ecosystem.distributors.map((d, i) => (
          <div
            key={d.id}
            data-ocid={`linked_workspaces.distributor_card.${i + 1}`}
          >
            <OrgCard org={d} />
          </div>
        ))}
      </div>
      <ForgeAIPanel orgType="Vendor" />
    </div>
  );
}

function ResellersTab({ orgType }: { orgType: string }) {
  const ecosystem = getEcosystemForOrgType(orgType);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {ecosystem.resellers.map((r, i) => (
          <div
            key={r.id}
            data-ocid={`linked_workspaces.reseller_card.${i + 1}`}
          >
            <OrgCard org={r} />
          </div>
        ))}
      </div>
      <ForgeAIPanel orgType={orgType} />
    </div>
  );
}

function TerritoryPerformanceTab({ orgType }: { orgType: string }) {
  return (
    <div>
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Territory
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                QTD Revenue
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                QTD Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                QoQ
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                YoY
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {VENDOR_TERRITORIES.map((t, i) => (
              <tr
                key={t.territory}
                data-ocid={`linked_workspaces.territory_row.${i + 1}`}
                className="bg-background hover:bg-card/60 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {t.territory}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {t.qtd}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={t.qtdStatus} />
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold tabular-nums text-xs ${
                    t.qoq.startsWith("-")
                      ? "text-destructive"
                      : "text-emerald-400"
                  }`}
                >
                  {t.qoq}
                </td>
                <td className="px-4 py-3 text-right">
                  <StatusBadge status={t.yoyStatus} />
                  <span
                    className={`ml-1 text-xs font-semibold tabular-nums ${
                      t.yoyStatus === "negative"
                        ? "text-destructive"
                        : "text-emerald-400"
                    }`}
                  >
                    {t.yoy}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ForgeAIPanel orgType={orgType} />
    </div>
  );
}

function EcosystemHealthTab() {
  const metrics = [
    {
      label: "Active Distributors",
      value: "8 / 10",
      icon: Network,
      color: "text-accent",
    },
    {
      label: "Active Resellers",
      value: "24 / 32",
      icon: Users,
      color: "text-emerald-400",
    },
    {
      label: "Deals Registered",
      value: "47 this Q",
      icon: BarChart2,
      color: "text-primary",
    },
    {
      label: "Renewal Coverage",
      value: "81%",
      icon: HeartPulse,
      color: "text-emerald-400",
    },
    {
      label: "Ecosystem Score",
      value: "79%",
      icon: Shield,
      color: "text-accent",
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        {metrics.map((m, i) => (
          <Card
            key={m.label}
            data-ocid={`linked_workspaces.ecosystem_metric.${i + 1}`}
            className="bg-card border-border"
          >
            <CardContent className="pt-4 pb-4">
              <m.icon size={18} className={`mb-2 ${m.color}`} />
              <p className="text-lg font-bold text-foreground">{m.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {m.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ForgeAIPanel orgType="Vendor" />
    </div>
  );
}

function VendorsTab({ orgType }: { orgType: string }) {
  const ecosystem = getEcosystemForOrgType(orgType);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {ecosystem.vendors.map((v, i) => (
          <div key={v.id} data-ocid={`linked_workspaces.vendor_card.${i + 1}`}>
            <OrgCard org={v} />
          </div>
        ))}
      </div>
      <ForgeAIPanel orgType={orgType} />
    </div>
  );
}

function VendorRelationshipsTab() {
  const ecosystem = getEcosystemForOrgType("Reseller");
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {ecosystem.vendors.map((v, i) => (
          <div
            key={v.id}
            data-ocid={`linked_workspaces.vendor_rel_card.${i + 1}`}
          >
            <OrgCard org={v} />
          </div>
        ))}
      </div>
      <ForgeAIPanel orgType="Reseller" />
    </div>
  );
}

function DistributorRelationshipsTab() {
  const ecosystem = getEcosystemForOrgType("Reseller");
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {ecosystem.distributors.map((d, i) => (
          <div
            key={d.id}
            data-ocid={`linked_workspaces.dist_rel_card.${i + 1}`}
          >
            <OrgCard org={d} />
          </div>
        ))}
      </div>
      <ForgeAIPanel orgType="Reseller" />
    </div>
  );
}

function SharedOperationalTab() {
  const summaries = [
    {
      label: "Shared Accounts",
      value: "14",
      icon: Building2,
      delta: "+2 this Q",
    },
    {
      label: "Joint Opportunities",
      value: "8",
      icon: TrendingUp,
      delta: "£1.2M combined",
    },
    {
      label: "Co-Sell Pipeline",
      value: "£2.4M",
      icon: BarChart2,
      delta: "+18% QoQ",
    },
    {
      label: "Shared Contacts",
      value: "31",
      icon: Users,
      delta: "Across 4 orgs",
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {summaries.map((s, i) => (
          <Card
            key={s.label}
            data-ocid={`linked_workspaces.shared_ops_metric.${i + 1}`}
            className="bg-card border-border"
          >
            <CardContent className="pt-4 pb-4">
              <s.icon size={18} className="text-accent mb-2" />
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {s.label}
              </p>
              <p className="text-[10px] text-accent mt-1">{s.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ForgeAIPanel orgType="Reseller" />
    </div>
  );
}

// ─── New data-driven tab components ─────────────────────────────────────────

function CustomersTab() {
  return (
    <div>
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Account
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Territory
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Contract Value
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Renewal Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Active Products
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {DEMO_CUSTOMERS.map((c, i) => (
              <tr
                key={c.id}
                data-ocid={`linked_workspaces.customer_row.${i + 1}`}
                className="bg-background hover:bg-card/60 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {c.territory}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {c.contractValue ? fmtK(c.contractValue) : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {c.renewalDate ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(c.activeProducts ?? []).map((p) => (
                      <span
                        key={p}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ForgeAIPanel orgType="Vendor" />
    </div>
  );
}

function OpportunitiesTab({ limit = 8 }: { limit?: number }) {
  const opps = DEMO_OPPORTUNITIES.slice(0, limit);
  return (
    <div>
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Account
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Stage
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Value
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Owner
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Forecast Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {opps.map((o, i) => (
              <tr
                key={o.id}
                data-ocid={`linked_workspaces.opportunity_row.${i + 1}`}
                className="bg-background hover:bg-card/60 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {o.accountName}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      o.stage === "Closed Won"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : o.stage === "Negotiation"
                          ? "bg-accent/15 text-accent"
                          : o.stage === "Proposal"
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {o.stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {fmtK(o.value)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {o.ownerName}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {o.forecastDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ForgeAIPanel orgType="Vendor" />
    </div>
  );
}

function CasesTab({ limit = 15 }: { limit?: number }) {
  const cases = DEMO_CASES.filter(
    (c) => c.priority === "Critical" || c.priority === "High",
  ).slice(0, limit);
  return (
    <div>
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Case ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Title
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Type
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Priority
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                SLA (hrs)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {cases.map((c, i) => (
              <tr
                key={c.id}
                data-ocid={`linked_workspaces.case_row.${i + 1}`}
                className="bg-background hover:bg-card/60 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  {c.id}
                </td>
                <td className="px-4 py-3 font-medium text-foreground max-w-xs">
                  <span className="line-clamp-1">{c.title}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                  {c.caseType.replace(/-/g, " ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      c.priority === "Critical"
                        ? "bg-red-500/15 text-red-400"
                        : c.priority === "High"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      c.status === "Resolved"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : c.status === "Escalated"
                          ? "bg-red-500/15 text-red-400"
                          : c.status === "In Progress"
                            ? "bg-accent/15 text-accent"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-xs">
                  {c.sla}h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ForgeAIPanel orgType="Vendor" />
    </div>
  );
}

function AllCasesTab({ limit = 6 }: { limit?: number }) {
  const cases = DEMO_CASES.slice(0, limit);
  return (
    <div>
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Case ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Title
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Type
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Priority
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                SLA (hrs)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {cases.map((c, i) => (
              <tr
                key={c.id}
                data-ocid={`linked_workspaces.case_row.${i + 1}`}
                className="bg-background hover:bg-card/60 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  {c.id}
                </td>
                <td className="px-4 py-3 font-medium text-foreground max-w-xs">
                  <span className="line-clamp-1">{c.title}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                  {c.caseType.replace(/-/g, " ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      c.priority === "Critical"
                        ? "bg-red-500/15 text-red-400"
                        : c.priority === "High"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      c.status === "Resolved"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : c.status === "Escalated"
                          ? "bg-red-500/15 text-red-400"
                          : c.status === "In Progress"
                            ? "bg-accent/15 text-accent"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-xs">
                  {c.sla}h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ForgeAIPanel orgType="Reseller" />
    </div>
  );
}

function MdfTab({ limit = 10 }: { limit?: number }) {
  const requests = DEMO_MDF_REQUESTS.slice(0, limit);
  return (
    <div>
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Campaign
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Organisation
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Requested
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Approved
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Quarter
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {requests.map((m, i) => (
              <tr
                key={m.id}
                data-ocid={`linked_workspaces.mdf_row.${i + 1}`}
                className="bg-background hover:bg-card/60 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  {m.id}
                </td>
                <td className="px-4 py-3 font-medium text-foreground max-w-xs">
                  <span className="line-clamp-1">{m.campaignName}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {m.requestingOrgName}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {fmtK(m.requestedAmount)}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {m.approvedAmount > 0 ? fmtK(m.approvedAmount) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      m.status === "Approved"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : m.status === "Rejected"
                          ? "bg-red-500/15 text-red-400"
                          : m.status === "Complete"
                            ? "bg-primary/15 text-primary"
                            : m.status === "In Progress"
                              ? "bg-accent/15 text-accent"
                              : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {m.quarter}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ForgeAIPanel orgType="Distributor" />
    </div>
  );
}

// ─── Sub-tab configuration by org type ───────────────────────────────────────

const SUB_TABS: Record<OrgKind, SubTabDef[]> = {
  Vendor: [
    { id: "distributors", label: "Distributors", icon: Network },
    { id: "resellers", label: "Resellers", icon: Users },
    { id: "customers", label: "Customer Accounts", icon: Building2 },
    { id: "opportunities", label: "Opportunities", icon: BarChart2 },
    { id: "cases", label: "Cases", icon: Shield },
    { id: "mdf", label: "MDF Requests", icon: TrendingUp },
    { id: "territory", label: "Territory Performance", icon: Globe },
    { id: "ecosystem", label: "Ecosystem Health", icon: HeartPulse },
  ],
  Distributor: [
    { id: "vendors", label: "Vendors", icon: Building2 },
    { id: "resellers", label: "Resellers", icon: Users },
    { id: "customers", label: "Customer Coverage", icon: Globe },
    { id: "opportunities", label: "Opportunities", icon: BarChart2 },
    { id: "mdf", label: "MDF Requests", icon: TrendingUp },
    { id: "regional", label: "Regional Performance", icon: ChevronRight },
  ],
  "Global Distributor": [
    { id: "vendors", label: "Vendors", icon: Building2 },
    { id: "resellers", label: "Resellers", icon: Users },
    { id: "customers", label: "Customer Coverage", icon: Globe },
    { id: "opportunities", label: "Opportunities", icon: BarChart2 },
    { id: "mdf", label: "MDF Requests", icon: TrendingUp },
    { id: "regional", label: "Regional Performance", icon: ChevronRight },
  ],
  Reseller: [
    { id: "vendor-rel", label: "Vendor Relationships", icon: Building2 },
    {
      id: "distributor-rel",
      label: "Distributor Relationships",
      icon: Network,
    },
    { id: "customers", label: "Customer Accounts", icon: Users },
    { id: "opportunities", label: "Opportunities", icon: BarChart2 },
    { id: "cases", label: "Cases", icon: Shield },
    {
      id: "shared-ops",
      label: "Shared Operational Relationships",
      icon: ArrowUpRight,
    },
  ],
  "Multi-Group Reseller": [
    { id: "vendor-rel", label: "Vendor Relationships", icon: Building2 },
    {
      id: "distributor-rel",
      label: "Distributor Relationships",
      icon: Network,
    },
    { id: "customers", label: "Customer Accounts", icon: Users },
    { id: "opportunities", label: "Opportunities", icon: BarChart2 },
    { id: "cases", label: "Cases", icon: Shield },
    {
      id: "shared-ops",
      label: "Shared Operational Relationships",
      icon: ArrowUpRight,
    },
  ],
};

function renderSubTabContent(activeTab: SubTabId, orgType: OrgKind) {
  switch (activeTab) {
    case "distributors":
      return <DistributorsTab />;
    case "resellers":
      return <ResellersTab orgType={orgType} />;
    case "customers":
      return <CustomersTab />;
    case "opportunities":
      return <OpportunitiesTab limit={orgType === "Vendor" ? 8 : 6} />;
    case "cases":
      return orgType === "Vendor" ? <CasesTab /> : <AllCasesTab />;
    case "mdf":
      return (
        <MdfTab
          limit={
            orgType === "Distributor" || orgType === "Global Distributor"
              ? 5
              : 10
          }
        />
      );
    case "territory":
      return <TerritoryPerformanceTab orgType={orgType} />;
    case "ecosystem":
      return <EcosystemHealthTab />;
    case "vendors":
      return <VendorsTab orgType={orgType} />;
    case "regional":
      return <TerritoryPerformanceTab orgType={orgType} />;
    case "vendor-rel":
      return <VendorRelationshipsTab />;
    case "distributor-rel":
      return <DistributorRelationshipsTab />;
    case "shared-ops":
      return <SharedOperationalTab />;
  }
}

// ─── Page header meta ─────────────────────────────────────────────────────────

const ORG_META: Record<
  OrgKind,
  {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  Vendor: {
    title: "Linked Workspaces",
    subtitle:
      "Distributor & reseller ecosystem performance and relationship intelligence",
    icon: Network,
  },
  Distributor: {
    title: "Linked Workspaces",
    subtitle:
      "Vendor partnerships and reseller management across your distribution network",
    icon: Network,
  },
  "Global Distributor": {
    title: "Linked Workspaces",
    subtitle:
      "Multi-region vendor partnerships, reseller management and extended coverage analysis",
    icon: Globe,
  },
  Reseller: {
    title: "Linked Workspaces",
    subtitle:
      "Vendor and distributor relationships, co-sell pipeline and shared operational collaboration",
    icon: Network,
  },
  "Multi-Group Reseller": {
    title: "Linked Workspaces",
    subtitle:
      "Group-wide vendor and distributor relationships, co-sell pipeline and multi-group collaboration",
    icon: Globe,
  },
};

// ─── Main page ────────────────────────────────────────────────────────────────

export function LinkedWorkspacesPage() {
  const { companyProfile, testModeOrgType } = useApp();
  useFilterContext();

  const rawOrgType: string =
    IS_TEST_MODE && testModeOrgType
      ? testModeOrgType
      : (companyProfile?.companyType ?? "Vendor");

  const orgType: OrgKind =
    rawOrgType === "Vendor"
      ? "Vendor"
      : rawOrgType === "Distributor"
        ? "Distributor"
        : rawOrgType === "Global Distributor"
          ? "Global Distributor"
          : rawOrgType === "Multi-Group Reseller"
            ? "Multi-Group Reseller"
            : rawOrgType === "Reseller"
              ? "Reseller"
              : "Vendor";

  const subTabs = SUB_TABS[orgType];
  const [activeTab, setActiveTab] = useState<SubTabId>(subTabs[0].id);

  const meta = ORG_META[orgType];
  const MetaIcon = meta.icon;

  return (
    <div
      className="p-6 max-w-7xl mx-auto space-y-6"
      data-ocid="linked_workspaces.page"
    >
      {/* Page header */}
      <div className="rounded-xl bg-card border border-border px-6 py-4 flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
          <MetaIcon size={18} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground">{meta.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {meta.subtitle}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25">
            {orgType}
          </span>
        </div>
      </div>

      {/* Sub-tab pills */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Linked workspace sub-tabs"
        data-ocid="linked_workspaces.sub_tabs"
      >
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              data-ocid={`linked_workspaces.tab.${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active
                  ? "bg-accent text-white shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
              }`}
            >
              <Icon size={12} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active sub-tab content */}
      <div
        role="tabpanel"
        data-ocid={`linked_workspaces.tabpanel.${activeTab}`}
      >
        {renderSubTabContent(activeTab, orgType)}
      </div>
    </div>
  );
}

export default LinkedWorkspacesPage;
