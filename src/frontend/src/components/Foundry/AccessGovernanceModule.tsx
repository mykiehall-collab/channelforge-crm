import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Lock,
  LockOpen,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  type RestrictionType,
  useAccessGovernance,
} from "../../stores/accessGovernanceStore";

// ─── Lockable items catalogue ─────────────────────────────────────────────────

const LOCKABLE_ITEMS = [
  {
    id: "advanced-reporting",
    displayName: "Advanced Reporting",
    category: "Analytics",
    defaultRestrictionSummary: "Restricted to: Leadership",
  },
  {
    id: "infrastructure-analytics",
    displayName: "Infrastructure Analytics",
    category: "Analytics",
    defaultRestrictionSummary: "Restricted to: IT/Security",
  },
  {
    id: "ai-governance",
    displayName: "AI Governance",
    category: "AI Capabilities",
    defaultRestrictionSummary: "Restricted to: Primary Admins",
  },
  {
    id: "cross-region-reporting",
    displayName: "Cross-Region Reporting",
    category: "Analytics",
    defaultRestrictionSummary: "Restricted to: Regional Heads",
  },
  {
    id: "pricing-governance",
    displayName: "Pricing Governance",
    category: "Operational Features",
    defaultRestrictionSummary: "Restricted to: Sales Ops",
  },
  {
    id: "strategic-forecasting",
    displayName: "Strategic Forecasting",
    category: "Dashboards",
    defaultRestrictionSummary: "Restricted to: Leadership",
  },
  {
    id: "security-administration",
    displayName: "Security Administration",
    category: "Foundry Modules",
    defaultRestrictionSummary: "Restricted to: IT/Security",
  },
  {
    id: "deal-registration-reports",
    displayName: "Deal Registration Reports",
    category: "Reports",
    defaultRestrictionSummary: "All users",
  },
  {
    id: "account-health-dashboard",
    displayName: "Account Health Dashboard",
    category: "Dashboards",
    defaultRestrictionSummary: "All users",
  },
  {
    id: "forgeai-chat",
    displayName: "ForgeAI Chat",
    category: "AI Capabilities",
    defaultRestrictionSummary: "All users",
  },
  {
    id: "mdf-tracking",
    displayName: "MDF Tracking Widget",
    category: "Widgets",
    defaultRestrictionSummary: "Restricted to: Marketing",
  },
] as const;

const CATEGORY_ORDER = [
  "Analytics",
  "AI Capabilities",
  "Operational Features",
  "Dashboards",
  "Reports",
  "Widgets",
  "Foundry Modules",
];

const RESTRICTION_TYPES: { value: RestrictionType; label: string }[] = [
  { value: "role", label: "Role" },
  { value: "department", label: "Department" },
  { value: "orgType", label: "Org Type" },
  { value: "territory", label: "Territory" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const INITIALS_PALETTE = [
  "bg-orange-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
];

function initialsColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return INITIALS_PALETTE[hash % INITIALS_PALETTE.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-widest text-orange-400/70 mb-3 mt-5 first:mt-0">
      {children}
    </h3>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <ShieldCheck size={36} className="mb-3 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── Tab 1: Pending Requests ──────────────────────────────────────────────────

function PendingRequestsTab() {
  const {
    accessRequests,
    approveRequest,
    rejectRequest,
    requestClarification,
  } = useAccessGovernance();

  const pending = accessRequests.filter((r) => r.status === "pending");

  const [actionState, setActionState] = useState<
    Record<string, { mode: "approve" | "reject" | "clarify"; note: string }>
  >({});

  function setMode(id: string, mode: "approve" | "reject" | "clarify" | null) {
    if (mode === null) {
      setActionState((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      setActionState((prev) => ({ ...prev, [id]: { mode, note: "" } }));
    }
  }

  function setNote(id: string, note: string) {
    setActionState((prev) => ({
      ...prev,
      [id]: { ...prev[id], note },
    }));
  }

  function commit(id: string) {
    const s = actionState[id];
    if (!s) return;
    if (s.mode === "approve") approveRequest(id, s.note || undefined);
    else if (s.mode === "reject") rejectRequest(id, s.note || "Rejected");
    else requestClarification(id, s.note || "Clarification requested");
    setMode(id, null);
  }

  if (pending.length === 0)
    return <EmptyState message="No pending access requests" />;

  return (
    <div className="space-y-3">
      {pending.map((req) => {
        const s = actionState[req.id];
        return (
          <div
            key={req.id}
            className="bg-slate-800/70 border border-white/[0.06] rounded-xl p-4 space-y-3"
            data-ocid={`access-governance.pending-request.${req.id}`}
          >
            {/* Header row */}
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${initialsColor(req.requesterName)}`}
              >
                {getInitials(req.requesterName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-100">
                    {req.requesterName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {req.requesterRole}
                    {req.requesterDepartment
                      ? ` · ${req.requesterDepartment}`
                      : ""}
                  </span>
                  <Badge
                    className={`text-[10px] px-2 py-0 ${
                      req.routingTier === "primary"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                    }`}
                    variant="outline"
                  >
                    {req.routingTier === "primary"
                      ? "Primary Admin"
                      : "Secondary Admin"}
                  </Badge>
                </div>
                <p className="text-xs text-orange-300 font-medium mt-0.5">
                  Requesting:{" "}
                  <span className="text-orange-200">
                    {req.featureDisplayName}
                  </span>
                </p>
              </div>
              <span className="text-[11px] text-slate-500 flex-shrink-0">
                {formatDate(req.submittedAt)}
              </span>
            </div>

            {/* Reason & justification */}
            <div className="pl-12 space-y-1">
              <p className="text-xs font-medium text-slate-400">
                Reason: <span className="text-slate-300">{req.reason}</span>
              </p>
              <p className="text-xs text-slate-400 line-clamp-2">
                {req.justification.length > 80
                  ? `${req.justification.slice(0, 80)}…`
                  : req.justification}
              </p>
            </div>

            {/* Actions */}
            {!s ? (
              <div className="pl-12 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 hover:bg-emerald-600/30"
                  variant="ghost"
                  onClick={() => setMode(req.id, "approve")}
                  data-ocid={`access-governance.approve_button.${req.id}`}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs bg-rose-600/20 text-rose-300 border border-rose-600/30 hover:bg-rose-600/30"
                  variant="ghost"
                  onClick={() => setMode(req.id, "reject")}
                  data-ocid={`access-governance.reject_button.${req.id}`}
                >
                  Reject
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs bg-amber-600/20 text-amber-300 border border-amber-600/30 hover:bg-amber-600/30"
                  variant="ghost"
                  onClick={() => setMode(req.id, "clarify")}
                  data-ocid={`access-governance.clarify_button.${req.id}`}
                >
                  Request Clarification
                </Button>
              </div>
            ) : (
              <div className="pl-12 flex items-center gap-2">
                <Input
                  value={s.note}
                  onChange={(e) => setNote(req.id, e.target.value)}
                  placeholder={
                    s.mode === "approve"
                      ? "Optional note…"
                      : s.mode === "reject"
                        ? "Rejection reason…"
                        : "Clarification note…"
                  }
                  className="h-7 text-xs bg-slate-700 border-white/10 text-slate-200 placeholder:text-slate-500 flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  className={`h-7 text-xs ${
                    s.mode === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : s.mode === "reject"
                        ? "bg-rose-600 hover:bg-rose-500 text-white"
                        : "bg-amber-600 hover:bg-amber-500 text-white"
                  }`}
                  onClick={() => commit(req.id)}
                  data-ocid={`access-governance.confirm_button.${req.id}`}
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-slate-400 hover:text-slate-200"
                  onClick={() => setMode(req.id, null)}
                  data-ocid={`access-governance.cancel_button.${req.id}`}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab 2: Approved Access ───────────────────────────────────────────────────

function ApprovedAccessTab() {
  const { accessRequests, revokeGrant } = useAccessGovernance();
  const grants = accessRequests.filter((r) => r.status === "approved");

  if (grants.length === 0)
    return <EmptyState message="No approved access grants" />;

  return (
    <div className="space-y-2">
      {grants.map((req) => (
        <div
          key={req.id}
          className="bg-slate-800/70 border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3"
          data-ocid={`access-governance.approved-grant.${req.id}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${initialsColor(req.requesterName)}`}
          >
            {getInitials(req.requesterName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {req.requesterName}
            </p>
            <p className="text-xs text-slate-400 truncate">
              <span className="text-orange-300">{req.featureDisplayName}</span>
              {req.resolvedBy && (
                <span className="text-slate-500">
                  {" "}
                  &nbsp;· Approved by {req.resolvedBy}
                </span>
              )}
            </p>
            {req.resolvedAt && (
              <p className="text-[11px] text-slate-500">
                {formatDate(req.resolvedAt)}
              </p>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-rose-400 hover:text-rose-200 hover:bg-rose-600/10 flex-shrink-0"
            onClick={() => revokeGrant(req.id)}
            data-ocid={`access-governance.revoke_button.${req.id}`}
          >
            Revoke
          </Button>
        </div>
      ))}
    </div>
  );
}

// ─── Tab 3: Rejected Requests ─────────────────────────────────────────────────

function RejectedRequestsTab() {
  const { accessRequests } = useAccessGovernance();
  const rejected = accessRequests.filter((r) => r.status === "rejected");

  if (rejected.length === 0)
    return <EmptyState message="No rejected requests" />;

  return (
    <div className="space-y-2">
      {rejected.map((req) => (
        <div
          key={req.id}
          className="bg-slate-800/70 border border-white/[0.06] rounded-xl px-4 py-3"
          data-ocid={`access-governance.rejected-request.${req.id}`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${initialsColor(req.requesterName)}`}
            >
              {getInitials(req.requesterName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">
                {req.requesterName}
              </p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-300">{req.featureDisplayName}</span>
                {req.resolvedBy && (
                  <span className="text-slate-500">
                    {" "}
                    &nbsp;· Rejected by {req.resolvedBy}
                  </span>
                )}
              </p>
              {req.resolutionNote && (
                <p className="text-xs text-rose-400/80 mt-1 italic">
                  &ldquo;{req.resolutionNote}&rdquo;
                </p>
              )}
              {req.resolvedAt && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {formatDate(req.resolvedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab 4: Locked Views Management ──────────────────────────────────────────

const GROUPED_ITEMS = CATEGORY_ORDER.map((cat) => ({
  category: cat,
  items: LOCKABLE_ITEMS.filter((i) => i.category === cat),
})).filter((g) => g.items.length > 0);

function LockedViewsTab() {
  const { lockConfig, lockItem, unlockItem } = useAccessGovernance();

  return (
    <div className="space-y-1">
      {GROUPED_ITEMS.map(({ category, items }) => (
        <div key={category}>
          <SectionHeader>{category}</SectionHeader>
          <div className="space-y-1.5">
            {items.map((item) => {
              const cfg = lockConfig[item.id];
              const isLocked = cfg?.isLocked ?? false;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-slate-800/50 border border-white/[0.05] rounded-lg px-4 py-2.5"
                  data-ocid={`access-governance.locked-view.${item.id}`}
                >
                  {isLocked ? (
                    <Lock size={14} className="text-orange-400 flex-shrink-0" />
                  ) : (
                    <LockOpen
                      size={14}
                      className="text-slate-500 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{item.displayName}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.defaultRestrictionSummary}
                    </p>
                  </div>
                  {/* Toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isLocked}
                    onClick={() =>
                      isLocked ? unlockItem(item.id) : lockItem(item.id)
                    }
                    className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400 flex-shrink-0 ${
                      isLocked
                        ? "bg-orange-500"
                        : "bg-slate-600 hover:bg-slate-500"
                    }`}
                    data-ocid={`access-governance.lock-toggle.${item.id}`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isLocked ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab 5: Visibility Rules ──────────────────────────────────────────────────

function VisibilityRulesTab() {
  const {
    visibilityRules,
    addVisibilityRule,
    removeVisibilityRule,
    toggleVisibilityRule,
  } = useAccessGovernance();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemId, setNewItemId] = useState(LOCKABLE_ITEMS[0].id as string);
  const [newType, setNewType] = useState<RestrictionType>("role");
  const [newValue, setNewValue] = useState("");

  function handleSave() {
    if (!newValue.trim()) return;
    const item = LOCKABLE_ITEMS.find((i) => i.id === newItemId);
    if (!item) return;
    addVisibilityRule(newItemId, item.displayName, newType, newValue.trim());
    setNewValue("");
    setShowAddForm(false);
  }

  const restrictionTypeBadgeColor = (type: RestrictionType) => {
    if (type === "role")
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    if (type === "department")
      return "bg-violet-500/20 text-violet-300 border-violet-500/30";
    if (type === "orgType")
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  };

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-white/[0.06]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80 border-b border-white/[0.06]">
              {["Rule", "Item", "Type", "Value", "Active", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {visibilityRules.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-slate-500 text-xs"
                >
                  No visibility rules configured
                </td>
              </tr>
            )}
            {visibilityRules.map((rule) => (
              <tr
                key={rule.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                data-ocid={`access-governance.visibility-rule.${rule.id}`}
              >
                <td className="px-3 py-2.5 font-mono text-[11px] text-slate-500 truncate max-w-[80px]">
                  {rule.id}
                </td>
                <td className="px-3 py-2.5 text-slate-300 text-xs">
                  {rule.itemDisplayName}
                </td>
                <td className="px-3 py-2.5">
                  <Badge
                    className={`text-[10px] px-2 py-0 ${restrictionTypeBadgeColor(rule.ruleType)}`}
                    variant="outline"
                  >
                    {rule.ruleType}
                  </Badge>
                </td>
                <td className="px-3 py-2.5 text-slate-300 text-xs">
                  {rule.ruleValue}
                </td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={rule.active}
                    onClick={() => toggleVisibilityRule(rule.id)}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                      rule.active
                        ? "bg-orange-500"
                        : "bg-slate-600 hover:bg-slate-500"
                    }`}
                    data-ocid={`access-governance.rule-toggle.${rule.id}`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        rule.active ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-3 py-2.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-rose-500 hover:text-rose-300 hover:bg-rose-600/10"
                    onClick={() => removeVisibilityRule(rule.id)}
                    data-ocid={`access-governance.delete-rule.${rule.id}`}
                  >
                    <Trash2 size={12} />
                  </Button>
                </td>
              </tr>
            ))}

            {/* Inline add-rule form */}
            {showAddForm && (
              <tr className="border-b border-white/[0.06] bg-slate-800/50">
                <td className="px-3 py-2" colSpan={1}>
                  <span className="text-[11px] text-slate-500 font-mono">
                    new
                  </span>
                </td>
                <td className="px-3 py-2">
                  <select
                    value={newItemId}
                    onChange={(e) => setNewItemId(e.target.value)}
                    className="w-full text-xs bg-slate-700 border border-white/10 rounded px-2 py-1 text-slate-200"
                  >
                    {LOCKABLE_ITEMS.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.displayName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select
                    value={newType}
                    onChange={(e) =>
                      setNewType(e.target.value as RestrictionType)
                    }
                    className="w-full text-xs bg-slate-700 border border-white/10 rounded px-2 py-1 text-slate-200"
                  >
                    {RESTRICTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2" colSpan={2}>
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. Sales Ops"
                    className="h-7 text-xs bg-slate-700 border-white/10 text-slate-200 placeholder:text-slate-500"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      className="h-6 text-[11px] bg-orange-500 hover:bg-orange-400 text-white px-2"
                      onClick={handleSave}
                      data-ocid="access-governance.save-rule_button"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-slate-400"
                      onClick={() => setShowAddForm(false)}
                      data-ocid="access-governance.cancel-rule_button"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Rule button */}
      {!showAddForm && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 border border-orange-500/20"
          onClick={() => setShowAddForm(true)}
          data-ocid="access-governance.add-rule_button"
        >
          <Plus size={13} className="mr-1" />
          Add Rule
        </Button>
      )}
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "pending", label: "Pending Requests" },
  { id: "approved", label: "Approved Access" },
  { id: "rejected", label: "Rejected Requests" },
  { id: "locked-views", label: "Locked Views" },
  { id: "visibility-rules", label: "Visibility Rules" },
  { id: "edit-rights", label: "Account Edit Rights" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Shared constants for edit-rights tab ────────────────────────────────────

const FIELD_ROWS: { key: string; label: string }[] = [
  { key: "accountName", label: "Account Name" },
  { key: "customerDomain", label: "Customer Domain" },
  { key: "contractType", label: "Contract Type" },
  { key: "estimatedRenewalValue", label: "Estimated Renewal Value" },
  { key: "licenceQuantity", label: "Licence Quantity" },
  { key: "products", label: "Products" },
  { key: "status", label: "Status" },
  { key: "customerIdNumber", label: "Customer ID Number" },
  { key: "pricingData", label: "Pricing Data" },
  { key: "territoryMapping", label: "Territory Mapping" },
  { key: "campaignData", label: "Campaign Data" },
  { key: "forecastingData", label: "Forecasting Data" },
  { key: "renewalDates", label: "Renewal Dates" },
  { key: "internalNotes", label: "Internal Notes" },
  { key: "externalNotes", label: "External Notes" },
  { key: "resellerOwnerId", label: "Reseller Owner" },
  { key: "vendorOwnerId", label: "Vendor Owner" },
];

const ROLE_COLUMNS: string[] = [
  "Primary Admin",
  "Secondary Admin",
  "Sales Rep",
  "Account Manager",
  "Renewal Specialist",
  "Marketing User",
  "Sales Operations",
  "Leadership",
  "IT/Security",
  "Deal Desk",
  "Customer Success",
  "Finance",
];

const OVERRIDE_ACCOUNTS = [
  { id: "acc-desperado", name: "Desperado" },
  { id: "acc-nordic", name: "Nordic Energy Group" },
  { id: "acc-global-pharma", name: "Global Pharma Holdings" },
  { id: "acc-apex", name: "Apex Financial Services" },
];

// ─── Tab 6: Account Edit Rights ───────────────────────────────────────────────

function AccountEditRightsTab() {
  const {
    getFieldPermission,
    setFieldPermission,
    setAccountEditOverride,
    accountEditOverrides,
  } = useAccessGovernance();
  const [accountSearch, setAccountSearch] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );

  const filteredAccounts = OVERRIDE_ACCOUNTS.filter((a) =>
    a.name.toLowerCase().includes(accountSearch.toLowerCase()),
  );

  const selectedAccount = OVERRIDE_ACCOUNTS.find(
    (a) => a.id === selectedAccountId,
  );

  function handleCellToggle(fieldKey: string, role: string) {
    if (role === "Primary Admin") return;
    const current = getFieldPermission(fieldKey);
    const has = current.editableByRoles.includes(role);
    const next = has
      ? current.editableByRoles.filter((r) => r !== role)
      : [...current.editableByRoles, role];
    setFieldPermission(fieldKey, { editableByRoles: next });
  }

  function handleOverrideToggle(fieldKey: string, role: string) {
    if (!selectedAccountId) return;
    const current = accountEditOverrides[selectedAccountId]?.[fieldKey] ?? [];
    const has = current.includes(role);
    const next = has ? current.filter((r) => r !== role) : [...current, role];
    setAccountEditOverride(selectedAccountId, fieldKey, next);
  }

  return (
    <div className="space-y-6">
      {/* Section: Field-Level Permissions */}
      <div className="bg-slate-800/50 border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <ShieldCheck size={15} className="text-orange-400" />
            Field-Level Edit Permissions
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure which roles can edit specific account fields. Users can
            always view data within their hierarchy — edit rights are separately
            governed.
          </p>
        </div>

        {/* Scrollable permission matrix */}
        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table
            className="w-full text-xs border-collapse"
            style={{ minWidth: "900px" }}
          >
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-900/95 border-b border-white/[0.08]">
                <th className="sticky left-0 z-20 bg-slate-900/95 px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400 min-w-[160px]">
                  Field
                </th>
                {ROLE_COLUMNS.map((role) => (
                  <th
                    key={role}
                    className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 min-w-[96px] whitespace-nowrap"
                  >
                    {role === "Primary Admin" ? (
                      <span className="text-orange-400">{role}</span>
                    ) : (
                      role
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELD_ROWS.map((field, rowIdx) => {
                const rule = getFieldPermission(field.key);
                return (
                  <tr
                    key={field.key}
                    className={`border-b border-white/[0.04] ${
                      rowIdx % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/20"
                    } hover:bg-slate-700/30 transition-colors`}
                    data-ocid={`access-governance.edit-rights.field-row.${field.key}`}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5 font-medium text-slate-200 whitespace-nowrap">
                      {field.label}
                      {rule.lockedByDefault && (
                        <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-amber-400/80">
                          <Lock size={9} />
                          default locked
                        </span>
                      )}
                    </td>
                    {ROLE_COLUMNS.map((role) => {
                      const isPrimary = role === "Primary Admin";
                      const hasAccess =
                        isPrimary || rule.editableByRoles.includes(role);
                      return (
                        <td key={role} className="px-3 py-2.5 text-center">
                          <button
                            type="button"
                            disabled={isPrimary}
                            onClick={() => handleCellToggle(field.key, role)}
                            aria-label={`${hasAccess ? "Remove" : "Grant"} edit access for ${role} on ${field.label}`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150 ${
                              isPrimary
                                ? "cursor-default"
                                : hasAccess
                                  ? "hover:bg-emerald-500/20 hover:scale-110 cursor-pointer"
                                  : "hover:bg-rose-500/10 hover:scale-110 cursor-pointer"
                            }`}
                            data-ocid={`access-governance.edit-rights.cell.${field.key}.${role.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                          >
                            {hasAccess ? (
                              <CheckCircle2
                                size={16}
                                className={
                                  isPrimary
                                    ? "text-orange-400"
                                    : "text-emerald-400"
                                }
                              />
                            ) : (
                              <Lock size={14} className="text-slate-600" />
                            )}
                          </button>
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

      {/* Section: Account-Level Overrides */}
      <div className="bg-slate-800/50 border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Lock size={15} className="text-orange-400" />
            Account-Level Edit Overrides
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Grant additional edit rights on a specific account — overriding the
            global field permissions above.
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Account search */}
          <div className="space-y-2">
            <label
              htmlFor="account-override-search"
              className="text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              Search Account
            </label>
            <Input
              value={accountSearch}
              onChange={(e) => {
                setAccountSearch(e.target.value);
                setSelectedAccountId(null);
              }}
              placeholder="Type account name…"
              id="account-override-search"
              className="h-8 text-sm bg-slate-700/70 border-white/10 text-slate-200 placeholder:text-slate-500"
              data-ocid="access-governance.edit-rights.account-search_input"
            />
            {accountSearch.length > 0 && (
              <div className="rounded-lg border border-white/[0.06] overflow-hidden bg-slate-800/80">
                {filteredAccounts.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-slate-500">
                    No matching accounts
                  </p>
                ) : (
                  filteredAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setSelectedAccountId(acc.id);
                        setAccountSearch(acc.name);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-700/60 ${
                        selectedAccountId === acc.id
                          ? "text-orange-300 bg-orange-500/5"
                          : "text-slate-200"
                      }`}
                      data-ocid={`access-governance.edit-rights.account-option.${acc.id}`}
                    >
                      {acc.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Override matrix for selected account */}
          {selectedAccount ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-orange-300">
                Overrides for:{" "}
                <span className="text-slate-100">{selectedAccount.name}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLE_COLUMNS.filter((r) => r !== "Primary Admin").map(
                  (role) => {
                    const overrideFields =
                      accountEditOverrides[selectedAccount.id] ?? {};
                    const grantedFields = FIELD_ROWS.filter((f) =>
                      overrideFields[f.key]?.includes(role),
                    ).map((f) => f.label);
                    return (
                      <div
                        key={role}
                        className="bg-slate-700/30 border border-white/[0.05] rounded-lg px-4 py-3"
                        data-ocid={`access-governance.edit-rights.override-role.${role.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      >
                        <p className="text-xs font-semibold text-slate-300 mb-2">
                          {role}
                        </p>
                        <div className="space-y-1">
                          {FIELD_ROWS.map((field) => {
                            const currentOverride =
                              accountEditOverrides[selectedAccount.id]?.[
                                field.key
                              ] ?? [];
                            const checked = currentOverride.includes(role);
                            return (
                              <label
                                key={field.key}
                                className="flex items-center gap-2 cursor-pointer group"
                                data-ocid={`access-governance.edit-rights.override-checkbox.${selectedAccount.id}.${field.key}.${role.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    handleOverrideToggle(field.key, role)
                                  }
                                  className="w-3.5 h-3.5 rounded border-white/20 bg-slate-700 accent-orange-500 cursor-pointer"
                                />
                                <span
                                  className={`text-[11px] transition-colors ${
                                    checked
                                      ? "text-emerald-300"
                                      : "text-slate-500 group-hover:text-slate-300"
                                  }`}
                                >
                                  {field.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        {grantedFields.length > 0 && (
                          <p className="mt-2 text-[10px] text-emerald-400/70">
                            {grantedFields.length} override
                            {grantedFields.length !== 1 ? "s" : ""} active
                          </p>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-600">
              <Lock size={24} className="mb-2 opacity-30" />
              <p className="text-xs">
                Search and select an account to configure overrides
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AccessGovernanceModule() {
  const [activeTab, setActiveTab] = useState<TabId>("pending");
  const { accessRequests } = useAccessGovernance();
  const pendingCount = accessRequests.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <div
      className="min-h-full bg-slate-900"
      data-ocid="access-governance.panel"
    >
      {/* Module header */}
      <div className="px-6 pt-5 pb-0 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <ShieldCheck size={18} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Access Governance
            </h2>
            <p className="text-xs text-slate-400">
              Manage access requests, locked views, and visibility rules
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-0 border-b border-transparent -mb-px"
          role="tablist"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium relative transition-colors duration-150 ${
                activeTab === tab.id
                  ? "text-orange-400 border-b-2 border-orange-400"
                  : "text-slate-400 hover:text-slate-200 border-b-2 border-transparent"
              }`}
              data-ocid={`access-governance.tab.${tab.id}`}
            >
              {tab.label}
              {tab.id === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 text-[10px] text-white font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === "pending" && <PendingRequestsTab />}
        {activeTab === "approved" && <ApprovedAccessTab />}
        {activeTab === "rejected" && <RejectedRequestsTab />}
        {activeTab === "locked-views" && <LockedViewsTab />}
        {activeTab === "visibility-rules" && <VisibilityRulesTab />}
        {activeTab === "edit-rights" && <AccountEditRightsTab />}
      </div>
    </div>
  );
}
