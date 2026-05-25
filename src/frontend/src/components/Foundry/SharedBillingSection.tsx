import {
  Brain,
  Cpu,
  Database,
  Landmark,
  Network,
  Share2,
  Split,
  Users,
} from "lucide-react";
import { useState } from "react";

type BillingMode = "centralized" | "shared" | "hybrid";
type WorkspaceType = "vendor" | "distributor" | "reseller";

type OrgAllocation = {
  name: string;
  computePercent: number;
  storagePercent: number;
  aiPercent: number;
  creditsConsumed: number;
};

const BILLING_MODE_META: Record<
  BillingMode,
  {
    title: string;
    description: string;
    examples: string[];
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  centralized: {
    title: "Centralized Billing",
    description:
      "One organization covers all compute and storage costs across the entire ecosystem.",
    examples: [
      "Vendor pays for entire ecosystem",
      "Distributor pays for connected Resellers",
      "Enterprise parent covers all usage",
    ],
    icon: Landmark,
  },
  shared: {
    title: "Shared Billing",
    description:
      "Compute and storage consumption is dynamically distributed across connected organizations.",
    examples: [
      "Vendors cover Vendor workloads",
      "Distributors cover Distributor workloads",
      "Resellers cover customer-facing workloads",
      "AI usage allocated to consuming organization",
    ],
    icon: Share2,
  },
  hybrid: {
    title: "Hybrid Billing",
    description:
      "Primary organization covers baseline infrastructure while connected organizations contribute based on usage thresholds.",
    examples: [
      "Vendor funds core infrastructure",
      "Resellers top up additional usage",
      "Distributor funds regional reporting workloads",
    ],
    icon: Split,
  },
};

const ATTRIBUTION_DATA: Record<WorkspaceType, OrgAllocation[]> = {
  vendor: [
    {
      name: "Vendor (Primary)",
      computePercent: 60,
      storagePercent: 55,
      aiPercent: 70,
      creditsConsumed: 8500,
    },
    {
      name: "Distributor A",
      computePercent: 25,
      storagePercent: 30,
      aiPercent: 20,
      creditsConsumed: 3200,
    },
    {
      name: "Distributor B",
      computePercent: 10,
      storagePercent: 10,
      aiPercent: 7,
      creditsConsumed: 1200,
    },
    {
      name: "Reseller Network",
      computePercent: 5,
      storagePercent: 5,
      aiPercent: 3,
      creditsConsumed: 600,
    },
  ],
  distributor: [
    {
      name: "Distributor (Primary)",
      computePercent: 55,
      storagePercent: 50,
      aiPercent: 60,
      creditsConsumed: 6200,
    },
    {
      name: "Reseller A",
      computePercent: 25,
      storagePercent: 28,
      aiPercent: 22,
      creditsConsumed: 2800,
    },
    {
      name: "Reseller B",
      computePercent: 15,
      storagePercent: 17,
      aiPercent: 13,
      creditsConsumed: 1700,
    },
    {
      name: "Reseller C",
      computePercent: 5,
      storagePercent: 5,
      aiPercent: 5,
      creditsConsumed: 600,
    },
  ],
  reseller: [
    {
      name: "Reseller (Primary)",
      computePercent: 100,
      storagePercent: 100,
      aiPercent: 100,
      creditsConsumed: 3500,
    },
  ],
};

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

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

export function SharedBillingSection({
  workspaceType = "vendor",
}: {
  workspaceType?: WorkspaceType;
}) {
  const [billingMode, setBillingMode] = useState<BillingMode>("shared");
  const data = ATTRIBUTION_DATA[workspaceType];

  return (
    <div
      className="space-y-6"
      data-ocid="infrastructure.shared_billing.section"
    >
      {/* Billing Mode Selector */}
      <GlassCard className="p-5" glow>
        <SectionHeader
          title="Shared Operational Billing"
          subtitle="Choose how infrastructure costs are handled across your channel ecosystem"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.keys(BILLING_MODE_META) as BillingMode[]).map((mode) => {
            const meta = BILLING_MODE_META[mode];
            const Icon = meta.icon;
            const active = billingMode === mode;
            return (
              <button
                key={mode}
                type="button"
                data-ocid={`infrastructure.billing_mode.${mode}`}
                onClick={() => setBillingMode(mode)}
                className={`relative text-left p-4 rounded-xl border transition-all ${
                  active
                    ? "border-orange-500/50 bg-orange-500/[0.08]"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      active ? "bg-orange-500/15" : "bg-white/[0.06]"
                    }`}
                  >
                    <Icon
                      size={14}
                      className={
                        active ? "text-orange-400" : "text-muted-foreground"
                      }
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      active ? "text-orange-400" : "text-foreground"
                    }`}
                  >
                    {meta.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {meta.description}
                </p>
                <ul className="space-y-1">
                  {meta.examples.map((ex) => (
                    <li
                      key={ex}
                      className="text-[11px] text-muted-foreground/80 flex items-start gap-1.5"
                    >
                      <span
                        className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                          active ? "bg-orange-400" : "bg-white/20"
                        }`}
                      />
                      {ex}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Cost Attribution & Visibility */}
      <div>
        <SectionHeader
          title="Cost Attribution & Visibility"
          subtitle="Infrastructure consumption breakdown across your operational hierarchy"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Attribution breakdown */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Network size={14} className="text-orange-400" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {workspaceType === "vendor"
                  ? "Vendor → Distributor Breakdown"
                  : workspaceType === "distributor"
                    ? "Distributor → Reseller Breakdown"
                    : "Reseller Operational Consumption"}
              </span>
            </div>
            <div className="space-y-3">
              {data.map((org, i) => (
                <div
                  key={org.name}
                  className="space-y-2"
                  data-ocid={`infrastructure.attribution.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {org.name}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {org.creditsConsumed.toLocaleString()} credits
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Compute</span>
                        <span>{org.computePercent}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-500/70"
                          style={{ width: `${org.computePercent}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Storage</span>
                        <span>{org.storagePercent}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-400/70"
                          style={{ width: `${org.storagePercent}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>AI</span>
                        <span>{org.aiPercent}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-400/70"
                          style={{ width: `${org.aiPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Summary tiles */}
          <div className="space-y-4">
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={14} className="text-orange-400" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Compute Allocation by Organization
                </span>
              </div>
              <div className="space-y-2">
                {data.map((org) => (
                  <div
                    key={org.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-foreground">{org.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-500/70"
                          style={{ width: `${org.computePercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-orange-400 w-8 text-right">
                        {org.computePercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Database size={14} className="text-blue-400" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Storage Allocation by Organization
                </span>
              </div>
              <div className="space-y-2">
                {data.map((org) => (
                  <div
                    key={org.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-foreground">{org.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-400/70"
                          style={{ width: `${org.storagePercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-blue-400 w-8 text-right">
                        {org.storagePercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={14} className="text-purple-400" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  AI Consumption Ownership
                </span>
              </div>
              <div className="space-y-2">
                {data.map((org) => (
                  <div
                    key={org.name}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-foreground">{org.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-400/70"
                          style={{ width: `${org.aiPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-purple-400 w-8 text-right">
                        {org.aiPercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Usage Attribution Explanations */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-orange-400" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Usage Attribution Rules
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              label: "AI Usage",
              desc: "AI usage allocated to the consuming organization",
            },
            {
              label: "Storage",
              desc: "Storage allocated proportionally across organizations",
            },
            {
              label: "Reporting",
              desc: "Reporting activity attributed to requesting organization",
            },
            {
              label: "Account Operations",
              desc: "Reseller account operations = Reseller compute allocation",
            },
            {
              label: "Shared Reporting",
              desc: "Shared reporting = proportional compute split",
            },
            {
              label: "Vendor AI Analysis",
              desc: "Vendor AI on Distributor data = Vendor compute allocation",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
            >
              <div className="text-xs font-medium text-foreground mb-1">
                {item.label}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
