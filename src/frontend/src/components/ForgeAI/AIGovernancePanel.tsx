import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const ROLES = [
  "Sales",
  "Marketing",
  "IT",
  "BDR",
  "Sales Manager",
  "Sales Operations",
  "Deal Desk",
  "Order Management",
  "Directors",
] as const;

const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "IT",
  "BDR",
  "Sales Management",
  "Sales Operations",
  "Deal Desk",
  "Order Management",
  "Leadership",
  "Finance",
  "Admin",
] as const;

const VENDOR_DISTRIBUTORS = [
  "Distributor Alpha",
  "Distributor Beta",
  "Distributor Gamma",
];
const DISTRIBUTOR_RESELLERS = [
  "Reseller One",
  "Reseller Two",
  "Reseller Three",
];

interface AIGovernancePanelProps {
  wsType: string;
}

export function AIGovernancePanel({ wsType }: AIGovernancePanelProps) {
  const [sharingToggles, setSharingToggles] = useState<Record<string, boolean>>(
    {},
  );
  const [roleAccess, setRoleAccess] = useState<Record<string, boolean>>(
    Object.fromEntries(ROLES.map((r) => [r, true])),
  );
  const [deptAccess, setDeptAccess] = useState<Record<string, boolean>>(
    Object.fromEntries(DEPARTMENTS.map((d) => [d, true])),
  );

  const toggleSharing = (name: string) =>
    setSharingToggles((prev) => ({ ...prev, [name]: !prev[name] }));
  const toggleRole = (role: string) =>
    setRoleAccess((prev) => ({ ...prev, [role]: !prev[role] }));
  const toggleDept = (dept: string) =>
    setDeptAccess((prev) => ({ ...prev, [dept]: !prev[dept] }));

  return (
    <div className="space-y-6" data-ocid="ai_governance.panel">
      {/* Section 1: Sharing Rules */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {wsType === "vendor"
            ? "Vendor AI Sharing — Connected Distributors"
            : wsType === "distributor"
              ? "Distributor AI Sharing — Connected Resellers"
              : "Available AI Providers"}
        </h3>

        {wsType === "vendor" && (
          <div className="space-y-3">
            {VENDOR_DISTRIBUTORS.map((dist, i) => (
              <div
                key={dist}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                data-ocid={`ai_governance.sharing_toggle.${i + 1}`}
              >
                <div>
                  <p className="text-sm text-foreground font-medium">{dist}</p>
                  <p className="text-xs text-muted-foreground">
                    Share Vendor AI access downstream
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {sharingToggles[dist] ? "Shared" : "Not shared"}
                  </span>
                  <Switch
                    checked={!!sharingToggles[dist]}
                    onCheckedChange={() => toggleSharing(dist)}
                    aria-label={`Share Vendor AI with ${dist}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {wsType === "distributor" && (
          <div className="space-y-3">
            {DISTRIBUTOR_RESELLERS.map((res, i) => (
              <div
                key={res}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                data-ocid={`ai_governance.sharing_toggle.${i + 1}`}
              >
                <div>
                  <p className="text-sm text-foreground font-medium">{res}</p>
                  <p className="text-xs text-muted-foreground">
                    Share Distributor AI access downstream
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {sharingToggles[res] ? "Shared" : "Not shared"}
                  </span>
                  <Switch
                    checked={!!sharingToggles[res]}
                    onCheckedChange={() => toggleSharing(res)}
                    aria-label={`Share Distributor AI with ${res}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {wsType === "reseller" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <p className="text-sm text-foreground font-medium">
                  Native ForgeAI
                </p>
                <p className="text-xs text-muted-foreground">
                  Default — always available
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-medium">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div>
                <p className="text-sm text-foreground font-medium">Vendor AI</p>
                <p className="text-xs text-muted-foreground">
                  Requires Vendor admin approval
                </p>
              </div>
              <button
                type="button"
                className="text-xs text-primary border border-primary/30 rounded px-2 py-1 hover:bg-primary/10 transition-colors"
                data-ocid="ai_governance.request_vendor_ai"
              >
                Request Access
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground font-medium">
                  Distributor AI
                </p>
                <p className="text-xs text-muted-foreground">
                  Requires Distributor admin approval
                </p>
              </div>
              <button
                type="button"
                className="text-xs text-primary border border-primary/30 rounded px-2 py-1 hover:bg-primary/10 transition-colors"
                data-ocid="ai_governance.request_distributor_ai"
              >
                Request Access
              </button>
            </div>
          </div>
        )}
      </div>

      <hr className="border-border/50" />

      {/* Section 2: Role-Based Access */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Role-Based AI Access
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Control which user roles can access AI features in this workspace.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ROLES.map((role, i) => (
            <label
              key={role}
              className="flex items-center gap-2.5 cursor-pointer"
              data-ocid={`ai_governance.role_toggle.${i + 1}`}
            >
              <input
                type="checkbox"
                checked={!!roleAccess[role]}
                onChange={() => toggleRole(role)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span className="text-sm text-foreground">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Section 3: Department Access */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Department AI Access
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Control which departments can access AI features in this workspace.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DEPARTMENTS.map((dept, i) => (
            <label
              key={dept}
              className="flex items-center gap-2.5 cursor-pointer"
              data-ocid={`ai_governance.dept_toggle.${i + 1}`}
            >
              <input
                type="checkbox"
                checked={!!deptAccess[dept]}
                onChange={() => toggleDept(dept)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span className="text-sm text-foreground">{dept}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
