import {
  AlertTriangle,
  Bell,
  Eye,
  Lock,
  Search,
  Shield,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CreditVisibilityEntry {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  domain: string;
  grantedAt: string;
  visibilityScope: "full" | "alertsOnly" | "keyMetrics";
  alertPermissions: {
    lowCredit: boolean;
    heavyUsage: boolean;
    abnormal: boolean;
    aiSpike: boolean;
    storageWarning: boolean;
  };
}

// ─── Sample data ───────────────────────────────────────────────────────────────

const SAMPLE_VISIBILITY_LIST: CreditVisibilityEntry[] = [
  {
    id: "va-001",
    name: "James Harrington",
    email: "james.harrington@channelforge.net",
    role: "Sales Ops Manager",
    organization: "ChannelForge Internal",
    domain: "channelforge.net",
    grantedAt: "2024-01-15",
    visibilityScope: "full",
    alertPermissions: {
      lowCredit: true,
      heavyUsage: true,
      abnormal: true,
      aiSpike: true,
      storageWarning: true,
    },
  },
  {
    id: "va-002",
    name: "Priya Nair",
    email: "priya.nair@channelforge.net",
    role: "Marketing Analyst",
    organization: "ChannelForge Internal",
    domain: "channelforge.net",
    grantedAt: "2024-02-03",
    visibilityScope: "keyMetrics",
    alertPermissions: {
      lowCredit: true,
      heavyUsage: false,
      abnormal: false,
      aiSpike: true,
      storageWarning: true,
    },
  },
];

const LS_KEY = "channelforge_credit_visibility_list";

// ─── Recent alerts dummy data ───────────────────────────────────────────────

const RECENT_ALERTS = [
  {
    time: "2 hours ago",
    type: "AI Spike",
    typeColor: "text-orange-400",
    typeBg: "bg-orange-500/15 border-orange-500/25",
    msg: "ForgeAI Chat usage increased 34% this week — Marcus Reid driving primary consumption.",
  },
  {
    time: "6 hours ago",
    type: "Heavy Usage",
    typeColor: "text-yellow-400",
    typeBg: "bg-yellow-500/15 border-yellow-500/25",
    msg: "Marketing Team compute usage 28% above baseline this month.",
  },
  {
    time: "1 day ago",
    type: "Warning",
    typeColor: "text-amber-400",
    typeBg: "bg-amber-500/15 border-amber-500/25",
    msg: "Credit balance below 35%. Projected depletion in 13 days.",
  },
  {
    time: "2 days ago",
    type: "Storage",
    typeColor: "text-blue-400",
    typeBg: "bg-blue-500/15 border-blue-500/25",
    msg: "Storage allocation at 44% — growth rate accelerating.",
  },
  {
    time: "3 days ago",
    type: "Ecosystem",
    typeColor: "text-purple-400",
    typeBg: "bg-purple-500/15 border-purple-500/25",
    msg: "Ingram Micro linked workflows consuming elevated compute resources.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
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

function Toggle({
  enabled,
  onToggle,
  label,
  dataOcid,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  dataOcid?: string;
}) {
  return (
    <button
      type="button"
      data-ocid={dataOcid}
      onClick={onToggle}
      aria-label={`${enabled ? "Disable" : "Enable"} ${label}`}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
        enabled ? "bg-orange-500" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function AdminInitials({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0].slice(0, 2);
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500/40 to-orange-600/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
      <span className="text-[11px] font-bold text-orange-300 uppercase">
        {initials.toUpperCase()}
      </span>
    </div>
  );
}

// ─── Alert examples info box ───────────────────────────────────────────────────

function AlertExamplesBox() {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-orange-500/15">
          <Bell size={13} className="text-orange-400" />
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Alert Examples
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Approved Secondary Admins will automatically receive the following types
        of operational credit alerts:
      </p>
      <div className="space-y-2">
        {[
          {
            icon: "🤖",
            text: "Marketing team AI usage increased 42% this week.",
          },
          { icon: "📉", text: "Projected depletion date reduced to 12 days." },
          {
            icon: "⚡",
            text: "Distributor-linked workflows are consuming elevated compute.",
          },
        ].map((ex) => (
          <div
            key={ex.text}
            className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
          >
            <span className="text-sm leading-none mt-0.5">{ex.icon}</span>
            <span className="text-xs text-white/75 leading-relaxed">
              {ex.text}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Admin entry row ───────────────────────────────────────────────────────────

type AlertKey = keyof CreditVisibilityEntry["alertPermissions"];

const ALERT_LABELS: { key: AlertKey; label: string }[] = [
  { key: "lowCredit", label: "Low-Credit Alerts" },
  { key: "heavyUsage", label: "Heavy Usage Alerts" },
  { key: "abnormal", label: "Abnormal Usage Alerts" },
  { key: "aiSpike", label: "AI Consumption Spikes" },
  { key: "storageWarning", label: "Storage Growth Warnings" },
];

const SCOPE_LABELS: Record<CreditVisibilityEntry["visibilityScope"], string> = {
  full: "Full Dashboard",
  alertsOnly: "Alerts Only",
  keyMetrics: "Key Metrics Only",
};

function AdminRow({
  entry,
  onUpdate,
  onRemove,
  index,
}: {
  entry: CreditVisibilityEntry;
  onUpdate: (updated: CreditVisibilityEntry) => void;
  onRemove: () => void;
  index: number;
}) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  function toggleAlert(key: AlertKey) {
    onUpdate({
      ...entry,
      alertPermissions: {
        ...entry.alertPermissions,
        [key]: !entry.alertPermissions[key],
      },
    });
  }

  function changeScope(scope: CreditVisibilityEntry["visibilityScope"]) {
    onUpdate({ ...entry, visibilityScope: scope });
  }

  return (
    <GlassCard className="p-4" data-ocid={`credit_visibility.item.${index}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <AdminInitials name={entry.name} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white/90 truncate">
              {entry.name}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {entry.email}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-white/50">{entry.role}</span>
              <span className="text-[10px] text-white/30">·</span>
              <span className="text-[10px] text-white/50">
                {entry.organization}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-muted-foreground">
            Granted {entry.grantedAt}
          </span>
          {confirmRemove ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/70">Remove?</span>
              <button
                type="button"
                data-ocid={`credit_visibility.confirm_button.${index}`}
                onClick={onRemove}
                className="px-2 py-0.5 rounded text-[11px] font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
              >
                Yes
              </button>
              <button
                type="button"
                data-ocid={`credit_visibility.cancel_button.${index}`}
                onClick={() => setConfirmRemove(false)}
                className="px-2 py-0.5 rounded text-[11px] font-semibold text-white/50 hover:text-white/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              data-ocid={`credit_visibility.delete_button.${index}`}
              onClick={() => setConfirmRemove(true)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-red-400 transition-colors"
              aria-label={`Remove ${entry.name}`}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Visibility scope */}
      <div className="mb-4">
        <label
          htmlFor={`scope-${entry.id}`}
          className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
        >
          Visibility Scope
        </label>
        <select
          id={`scope-${entry.id}`}
          data-ocid={`credit_visibility.scope_select.${index}`}
          value={entry.visibilityScope}
          onChange={(e) =>
            changeScope(
              e.target.value as CreditVisibilityEntry["visibilityScope"],
            )
          }
          className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/90 text-xs focus:outline-none focus:border-orange-500/50 cursor-pointer"
        >
          <option value="full">Full Dashboard</option>
          <option value="keyMetrics">Key Metrics Only</option>
          <option value="alertsOnly">Alerts Only</option>
        </select>
        <span className="ml-2 text-[10px] text-muted-foreground">
          Currently: {SCOPE_LABELS[entry.visibilityScope]}
        </span>
      </div>

      {/* Alert permission toggles */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Alert Permissions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ALERT_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]"
            >
              <span className="text-[11px] text-white/75 leading-tight">
                {label}
              </span>
              <Toggle
                enabled={entry.alertPermissions[key]}
                onToggle={() => toggleAlert(key)}
                label={label}
                dataOcid={`credit_visibility.alert_toggle.${entry.id}.${key}`}
              />
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Active Alerts section ─────────────────────────────────────────────────────

function ActiveAlertsSection() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={14} className="text-orange-400" />
        <h4 className="text-sm font-semibold text-white/90">
          Recent Credit Alerts
        </h4>
        <span className="ml-auto text-[10px] text-muted-foreground">
          Shared with approved admins
        </span>
      </div>
      <div className="space-y-2">
        {RECENT_ALERTS.map((alert, i) => (
          <div
            key={alert.msg}
            data-ocid={`credit_visibility.alert.item.${i + 1}`}
            className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="flex-shrink-0 mt-0.5">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${alert.typeBg} ${alert.typeColor}`}
              >
                {alert.type}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 leading-relaxed">
                {alert.msg}
              </p>
            </div>
            <span className="flex-shrink-0 text-[10px] text-muted-foreground whitespace-nowrap">
              {alert.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function CreditVisibilityManagement({
  isPrimaryAdmin = false,
}: {
  isPrimaryAdmin?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (section === "credit-visibility" && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 3000);
      return () => clearTimeout(t);
    }
  }, []);
  const [list, setList] = useState<CreditVisibilityEntry[]>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) return JSON.parse(stored) as CreditVisibilityEntry[];
    } catch {
      // ignore
    }
    return SAMPLE_VISIBILITY_LIST;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [addError, setAddError] = useState("");

  // Persist to localStorage whenever list changes
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }, [list]);

  if (!isPrimaryAdmin) {
    return (
      <div
        className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-6 text-center"
        data-ocid="credit_visibility.locked_panel"
      >
        <div className="p-3 rounded-full bg-white/[0.06] w-fit mx-auto mb-3">
          <Lock size={18} className="text-muted-foreground" />
        </div>
        <h4 className="text-sm font-semibold text-white/70 mb-1">
          Credit Visibility Management
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Credit Visibility Management is available to Primary Admins only.
        </p>
      </div>
    );
  }

  const filtered = list.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function handleAdd() {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) {
      setAddError("Please enter an email address.");
      return;
    }
    if (!trimmed.includes("@")) {
      setAddError("Enter a valid email address.");
      return;
    }
    if (list.some((e) => e.email.toLowerCase() === trimmed)) {
      setAddError("This admin is already in the access list.");
      return;
    }
    const domain = trimmed.split("@")[1] ?? "";
    const newEntry: CreditVisibilityEntry = {
      id: `va-${Date.now()}`,
      name: trimmed.split("@")[0].replace(/[._]/g, " "),
      email: trimmed,
      role: "Secondary Admin",
      organization: "Internal",
      domain,
      grantedAt: new Date().toISOString().split("T")[0],
      visibilityScope: "keyMetrics",
      alertPermissions: {
        lowCredit: true,
        heavyUsage: false,
        abnormal: false,
        aiSpike: false,
        storageWarning: true,
      },
    };
    setList((prev) => [...prev, newEntry]);
    setEmailInput("");
    setAddError("");
  }

  function handleUpdate(updated: CreditVisibilityEntry) {
    setList((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }

  function handleRemove(id: string) {
    setList((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div
      ref={panelRef}
      className={`space-y-6 transition-all duration-500 ${highlight ? "rounded-2xl ring-2 ring-orange-500/40 ring-offset-2 ring-offset-[#0a1628]" : ""}`}
      data-ocid="credit_visibility.panel"
    >
      {/* Panel header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/25 flex-shrink-0">
          <Shield size={16} className="text-orange-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white/90">
            Credit Visibility Management
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Manage which Secondary Admins within your organization can access
            Credit Usage Insights and receive operational credit alerts. Access
            is restricted to approved admins sharing your claimed domain.
          </p>
        </div>
      </div>

      {/* Alert examples */}
      <AlertExamplesBox />

      {/* Add Secondary Admin */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <UserPlus size={14} className="text-orange-400" />
          <h4 className="text-sm font-semibold text-white/90">
            Add Secondary Admin
          </h4>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Enter the email address of a Secondary Admin within your claimed
          domain to grant Credit Usage Insights access.
        </p>
        <div className="flex items-start gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setAddError("");
              }}
              placeholder="admin@yourcompany.net"
              data-ocid="credit_visibility.email_input"
              className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-orange-500/50 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            {addError && (
              <p
                className="text-[11px] text-red-400 mt-1"
                data-ocid="credit_visibility.email_error"
              >
                {addError}
              </p>
            )}
          </div>
          <button
            type="button"
            data-ocid="credit_visibility.search_button"
            onClick={() => setSearchQuery(emailInput)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 border border-white/[0.1] hover:bg-white/[0.06] hover:text-white/90 transition-colors"
          >
            <Search size={13} />
            Search
          </button>
          <button
            type="button"
            data-ocid="credit_visibility.add_button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
          >
            <UserPlus size={13} />
            Add
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/70 mt-2">
          Only Secondary Admins within your claimed organization domain may be
          added to the visibility list.
        </p>
      </GlassCard>

      {/* Access list */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-orange-400" />
            <h4 className="text-sm font-semibold text-white/90">
              Approved Access List
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-[10px] font-bold text-orange-400">
              {list.length}
            </span>
          </div>

          {/* Filter */}
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Filter by name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-ocid="credit_visibility.search_input"
              className="pl-7 pr-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/80 text-xs placeholder:text-white/30 focus:outline-none focus:border-orange-500/40 transition-colors w-44"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label="Clear search"
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 text-center"
            data-ocid="credit_visibility.empty_state"
          >
            <Eye size={20} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-white/50 mb-1">
              {searchQuery
                ? "No admins match your search."
                : "No Secondary Admins have been granted access."}
            </p>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? "Try a different name or email."
                : "Use the form above to add approved Secondary Admins."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((entry, i) => (
              <AdminRow
                key={entry.id}
                entry={entry}
                index={i + 1}
                onUpdate={handleUpdate}
                onRemove={() => handleRemove(entry.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Active Alerts */}
      <GlassCard className="p-5">
        <ActiveAlertsSection />
      </GlassCard>
    </div>
  );
}
