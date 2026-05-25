import { useApp } from "@/AppContext";
import { ClipboardList, Globe, MapPin, Shield, Users } from "lucide-react";
import { useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type SubTab = "ownership" | "partners" | "territory" | "audit";

interface AuditEntry {
  date: string;
  user: string;
  account: string;
  action: string;
  oldValue: string;
  newValue: string;
}

// ─── Mock audit data ───────────────────────────────────────────────────────────

const MOCK_AUDIT: AuditEntry[] = [
  {
    date: "2026-05-18 09:42",
    user: "James Harrington",
    account: "Acme Corp",
    action: "Assigned Strategic Owner",
    oldValue: "Unassigned",
    newValue: "Sarah Blake (Vendor)",
  },
  {
    date: "2026-05-17 14:20",
    user: "Rachel Chen",
    account: "Globex Industries",
    action: "Mapped Distributor to EMEA",
    oldValue: "Unassigned",
    newValue: "Nordic Distribution Ltd",
  },
  {
    date: "2026-05-16 11:05",
    user: "Marcus Webb",
    account: "Stark Enterprises",
    action: "Changed Renewal Owner",
    oldValue: "David Park (Distributor)",
    newValue: "Elena Rossi (Reseller)",
  },
  {
    date: "2026-05-15 16:33",
    user: "Priya Sharma",
    account: "Wayne Industries",
    action: "Added Secondary Reseller",
    oldValue: "None",
    newValue: "Channel Partners Inc",
  },
  {
    date: "2026-05-14 08:50",
    user: "James Harrington",
    account: "Cyberdyne Systems",
    action: "Assigned Escalation Owner",
    oldValue: "Unassigned",
    newValue: "Omar Farouk (Vendor)",
  },
  {
    date: "2026-05-13 13:12",
    user: "Rachel Chen",
    account: "Massive Dynamic",
    action: "Updated Territory Mapping",
    oldValue: "UK Only",
    newValue: "UK + Nordics",
  },
  {
    date: "2026-05-12 10:45",
    user: "Marcus Webb",
    account: "Umbrella Corp",
    action: "Changed Operational Owner",
    oldValue: "Lisa Wong (Reseller)",
    newValue: "Tom Bradley (Distributor)",
  },
  {
    date: "2026-05-11 15:28",
    user: "Priya Sharma",
    account: "Initech",
    action: "Assigned Servicing Owner",
    oldValue: "Unassigned",
    newValue: "Ana Martinez (Reseller)",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function OwnerBadge({ type }: { type: string }) {
  const styleMap: Record<string, string> = {
    vendor: "bg-blue-500/20 text-blue-300",
    distributor: "bg-amber-500/20 text-amber-300",
    reseller: "bg-emerald-500/20 text-emerald-300",
  };
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${styleMap[type] ?? "bg-muted text-muted-foreground"}`}
    >
      {label}
    </span>
  );
}

function SectionHeader({
  title,
  subtitle,
}: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
  );
}

// ─── Sub-tab content ─────────────────────────────────────────────────────────

function OwnershipTab({ accounts }: { accounts: any[] }) {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Account Ownership"
        subtitle="Strategic, renewal, operational, servicing and escalation owners per account."
      />
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Account Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Strategic Owner
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Renewal Owner
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Operational Owner
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Servicing Owner
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Escalation Owner
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, idx) => {
              const roles = acc.ownershipRoles ?? {};
              const cells = [
                { key: "strategicOwner", label: "Strategic" },
                { key: "renewalOwner", label: "Renewal" },
                { key: "operationalOwner", label: "Operational" },
                { key: "servicingOwner", label: "Servicing" },
                { key: "escalationOwner", label: "Escalation" },
              ];
              return (
                <tr
                  key={acc.id ?? idx}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  data-ocid={`account_governance.ownership.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {acc.name}
                  </td>
                  {cells.map((c) => {
                    const owner = roles[c.key];
                    return (
                      <td key={c.key} className="px-4 py-3">
                        {owner ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-foreground font-medium">
                              {owner.ownerName}
                            </span>
                            <OwnerBadge type={owner.ownerType} />
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PartnersTab({ accounts }: { accounts: any[] }) {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Partner Mappings"
        subtitle="Primary and secondary Distributors and Resellers mapped to each account."
      />
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Account Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Primary Distributor
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Secondary Distributor
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Primary Reseller
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Secondary Reseller
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Territories
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, idx) => {
              const dists: any[] = acc.incumbentDistributors ?? [];
              const resellers: any[] = acc.incumbentResellers ?? [];
              const primaryDist = dists.find((d) => d.isPrimary);
              const secondaryDist = dists.find((d) => !d.isPrimary);
              const primaryRes = resellers.find((r) => r.isPrimary);
              const secondaryRes = resellers.find((r) => !r.isPrimary);
              const allTerritories = Array.from(
                new Set([
                  ...(primaryDist?.territories ?? []),
                  ...(secondaryDist?.territories ?? []),
                  ...(primaryRes?.territories ?? []),
                  ...(secondaryRes?.territories ?? []),
                ]),
              );
              return (
                <tr
                  key={acc.id ?? idx}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  data-ocid={`account_governance.partners.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {acc.name}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {primaryDist ? (
                      primaryDist.distributorName
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {secondaryDist ? (
                      secondaryDist.distributorName
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {primaryRes ? (
                      primaryRes.resellerName
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {secondaryRes ? (
                      secondaryRes.resellerName
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {allTerritories.length > 0 ? (
                        allTerritories.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic">
                          None
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TerritoryTab({ accounts }: { accounts: any[] }) {
  const byRegion: Record<string, any[]> = {};
  for (const acc of accounts) {
    const region = acc.region ?? "Global";
    if (!byRegion[region]) byRegion[region] = [];
    byRegion[region].push(acc);
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Territory Servicing"
        subtitle="Accounts grouped by region with incumbent Distributor and Reseller coverage."
      />
      <div className="space-y-6">
        {Object.entries(byRegion).map(([region, regionAccounts]) => (
          <div
            key={region}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-primary" />
              <h4 className="text-base font-semibold text-foreground">
                {region}
              </h4>
              <span className="ml-2 text-xs text-muted-foreground">
                {regionAccounts.length} account(s)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionAccounts.map((acc, idx) => {
                const dists: any[] = acc.incumbentDistributors ?? [];
                const resellers: any[] = acc.incumbentResellers ?? [];
                const primaryDist = dists.find((d) => d.isPrimary);
                const primaryRes = resellers.find((r) => r.isPrimary);
                return (
                  <div
                    key={acc.id ?? idx}
                    className="rounded-lg border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                    data-ocid={`account_governance.territory.item.${idx + 1}`}
                  >
                    <div className="text-sm font-semibold text-foreground mb-2">
                      {acc.name}
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Distributor
                        </span>
                        <span className="text-foreground font-medium">
                          {primaryDist?.distributorName ?? (
                            <span className="italic text-muted-foreground">
                              None
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Reseller</span>
                        <span className="text-foreground font-medium">
                          {primaryRes?.resellerName ?? (
                            <span className="italic text-muted-foreground">
                              None
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Territories
                        </span>
                        <span className="text-foreground">
                          {primaryDist?.territories?.join(", ") ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditTab() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="Audit Trail"
        subtitle="Recent changes to account ownership, partner mappings and territory assignments."
      />
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Account
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Action
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Old Value
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                New Value
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_AUDIT.map((entry, idx) => (
              <tr
                key={`${entry.action}-${entry.date}-${idx}`}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                data-ocid={`account_governance.audit.item.${idx + 1}`}
              >
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {entry.date}
                </td>
                <td className="px-4 py-3 text-foreground font-medium">
                  {entry.user}
                </td>
                <td className="px-4 py-3 text-foreground">{entry.account}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.oldValue}
                </td>
                <td className="px-4 py-3 text-foreground font-medium">
                  {entry.newValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function AccountGovernancePanel() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("ownership");
  const { accounts } = useApp();
  const data = (accounts as any[]) ?? [];

  const tabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: "ownership", label: "Account Ownership", icon: <Users size={14} /> },
    { id: "partners", label: "Partner Mappings", icon: <Shield size={14} /> },
    {
      id: "territory",
      label: "Territory Servicing",
      icon: <Globe size={14} />,
    },
    { id: "audit", label: "Audit Trail", icon: <ClipboardList size={14} /> },
  ];

  return (
    <div className="space-y-6" data-ocid="account_governance.panel">
      {/* Sub-tab bar */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveSubTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSubTab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            data-ocid={`account_governance.tab.${t.id}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSubTab === "ownership" && <OwnershipTab accounts={data} />}
      {activeSubTab === "partners" && <PartnersTab accounts={data} />}
      {activeSubTab === "territory" && <TerritoryTab accounts={data} />}
      {activeSubTab === "audit" && <AuditTab />}
    </div>
  );
}
