import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
  Send,
  Shield,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  ForgeAIAlertConfig as BackendAlertConfig,
  LockStatus,
  OrgForgeAIAlertSettings,
} from "../backend";
import {
  AlertDeliveryMode,
  AlertFrequency,
  ForgeAIAlertType,
  type LockSource,
} from "../backend";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertTypeKey =
  | "RenewalRisk"
  | "ResellerEngagementGap"
  | "DistributorEngagementGap"
  | "DealRegistrationWarning"
  | "StalledApproval"
  | "AccountRisk"
  | "BusinessPlanInactivity"
  | "PipelineHealth"
  | "ChannelHealthScoreChange";

type RiskThresholdLevel = "critical" | "high" | "medium" | "all";

type DeliveryMode = "Dashboard Only" | "Message Only" | "Both";
type FrequencyOption =
  | "Real-time"
  | "Hourly Digest"
  | "Daily Digest"
  | "Weekly Summary";

interface EscalationRecipient {
  name: string;
  role: "Primary Admin" | "Secondary Admin" | "End User";
}

interface AlertConfig {
  enabled: boolean;
  recipients: {
    primaryAdmin: boolean;
    secondaryAdmins: boolean;
    endUsers: boolean;
  };
  deliveryMode: DeliveryMode;
  frequency: FrequencyOption;
  riskThreshold: RiskThresholdLevel;
  escalationRecipients: EscalationRecipient[];
  lockStatus: LockStatus;
  saved: boolean;
}

interface SecondaryAdmin {
  id: string;
  name: string;
  email: string;
  canManageForgeAIAlerts: boolean;
}

type AlertConfigs = Record<AlertTypeKey, AlertConfig>;

// ─── Constants ────────────────────────────────────────────────────────────────

const ALERT_META: Record<AlertTypeKey, { label: string; description: string }> =
  {
    RenewalRisk: {
      label: "Renewal Risk Alerts",
      description:
        "Triggered when an account's renewal risk score exceeds the configured threshold.",
    },
    ResellerEngagementGap: {
      label: "Reseller Engagement Gap Alerts",
      description:
        "Triggered when a reseller has not engaged with a customer account within the configured inactivity window.",
    },
    DistributorEngagementGap: {
      label: "Distributor Engagement Gap Alerts",
      description:
        "Triggered when a distributor has not engaged within configurable activity thresholds.",
    },
    DealRegistrationWarning: {
      label: "Deal Registration Warnings",
      description:
        "Alerts for stalled, duplicate, or expired deal registrations requiring attention.",
    },
    StalledApproval: {
      label: "Stalled Approval Alerts",
      description:
        "Triggered when a deal registration or business plan approval has been pending beyond the expected window.",
    },
    AccountRisk: {
      label: "Account Risk Alerts",
      description:
        "Triggered when an account's overall risk score exceeds the configured threshold.",
    },
    BusinessPlanInactivity: {
      label: "Business Plan Inactivity Alerts",
      description:
        "Triggered when a business plan has had no activity or milestone updates for a configurable period.",
    },
    PipelineHealth: {
      label: "Pipeline Health Alerts",
      description:
        "Alerts when pipeline velocity slows or conversion rates fall below expected benchmarks.",
    },
    ChannelHealthScoreChange: {
      label: "Channel Health Score Changes",
      description:
        "Triggered when a channel health score changes significantly relative to the configured threshold.",
    },
  };

const ALERT_TYPE_KEYS = Object.keys(ALERT_META) as AlertTypeKey[];

const ALERT_TYPE_MAP: Record<AlertTypeKey, ForgeAIAlertType> = {
  RenewalRisk: ForgeAIAlertType.RenewalRisk,
  ResellerEngagementGap: ForgeAIAlertType.ResellerEngagementGap,
  DistributorEngagementGap: ForgeAIAlertType.DistributorEngagementGap,
  DealRegistrationWarning: ForgeAIAlertType.DealRegistrationWarning,
  StalledApproval: ForgeAIAlertType.StalledApproval,
  AccountRisk: ForgeAIAlertType.AccountRisk,
  BusinessPlanInactivity: ForgeAIAlertType.BusinessPlanInactivity,
  PipelineHealth: ForgeAIAlertType.PipelineHealth,
  ChannelHealthScoreChange: ForgeAIAlertType.ChannelHealthScoreChange,
};

const DELIVERY_MAP: Record<DeliveryMode, AlertDeliveryMode> = {
  "Dashboard Only": AlertDeliveryMode.DashboardOnly,
  "Message Only": AlertDeliveryMode.MessageOnly,
  Both: AlertDeliveryMode.Both,
};

const DELIVERY_REVERSE: Record<AlertDeliveryMode, DeliveryMode> = {
  [AlertDeliveryMode.DashboardOnly]: "Dashboard Only",
  [AlertDeliveryMode.MessageOnly]: "Message Only",
  [AlertDeliveryMode.Both]: "Both",
};

const FREQUENCY_MAP: Record<FrequencyOption, AlertFrequency> = {
  "Real-time": AlertFrequency.Realtime,
  "Hourly Digest": AlertFrequency.Hourly,
  "Daily Digest": AlertFrequency.Daily,
  "Weekly Summary": AlertFrequency.Weekly,
};

const FREQUENCY_REVERSE: Record<AlertFrequency, FrequencyOption> = {
  [AlertFrequency.Realtime]: "Real-time",
  [AlertFrequency.Hourly]: "Hourly Digest",
  [AlertFrequency.Daily]: "Daily Digest",
  [AlertFrequency.Weekly]: "Weekly Summary",
};

const RISK_THRESHOLD_OPTIONS: { value: RiskThresholdLevel; label: string }[] = [
  { value: "critical", label: "Critical only" },
  { value: "high", label: "High and above" },
  { value: "medium", label: "Medium and above" },
  { value: "all", label: "All levels" },
];

const RISK_THRESHOLD_COLORS: Record<
  RiskThresholdLevel,
  { bg: string; text: string; border: string }
> = {
  critical: {
    bg: "rgba(239,68,68,0.12)",
    text: "#F87171",
    border: "rgba(239,68,68,0.3)",
  },
  high: {
    bg: "rgba(249,115,22,0.12)",
    text: "#F97316",
    border: "rgba(249,115,22,0.3)",
  },
  medium: {
    bg: "rgba(234,179,8,0.12)",
    text: "#EAB308",
    border: "rgba(234,179,8,0.3)",
  },
  all: {
    bg: "rgba(34,197,94,0.12)",
    text: "#4ADE80",
    border: "rgba(34,197,94,0.3)",
  },
};

const SAMPLE_SECONDARY_ADMINS: SecondaryAdmin[] = [
  {
    id: "sa1",
    name: "James Tan",
    email: "james.tan@ingrammicro.com",
    canManageForgeAIAlerts: false,
  },
  {
    id: "sa2",
    name: "Claire Bertrand",
    email: "claire.bertrand@ingrammicro.com",
    canManageForgeAIAlerts: false,
  },
];

function buildDefaultConfig(): AlertConfig {
  return {
    enabled: true,
    recipients: { primaryAdmin: true, secondaryAdmins: false, endUsers: false },
    deliveryMode: "Both",
    frequency: "Real-time",
    riskThreshold: "high",
    escalationRecipients: [],
    lockStatus: { __kind__: "Unlocked", Unlocked: null },
    saved: false,
  };
}

function buildDefaultConfigs(): AlertConfigs {
  return Object.fromEntries(
    ALERT_TYPE_KEYS.map((key) => [key, buildDefaultConfig()]),
  ) as AlertConfigs;
}

function mapBackendConfigToLocal(cfg: BackendAlertConfig): AlertConfig {
  const riskRaw =
    cfg.riskThreshold !== undefined ? Number(cfg.riskThreshold) : 2;
  // Map numeric threshold (0=critical,1=high,2=medium,3=all) to level
  const riskLevels: RiskThresholdLevel[] = [
    "critical",
    "high",
    "medium",
    "all",
  ];
  const riskThreshold: RiskThresholdLevel =
    riskLevels[Math.min(riskRaw, 3)] ?? "high";

  // Parse escalation recipients: stored as "name|role" strings for backward-compat
  const escalationRecipients: EscalationRecipient[] =
    cfg.escalationRecipients.map((raw) => {
      const parts = raw.split("|");
      return {
        name: parts[0] ?? raw,
        role: (parts[1] as EscalationRecipient["role"]) ?? "Primary Admin",
      };
    });

  return {
    enabled: cfg.enabled,
    recipients: {
      primaryAdmin: cfg.primaryAdminRecipient,
      secondaryAdmins: cfg.secondaryAdminRecipient,
      endUsers: cfg.endUsersRecipient,
    },
    deliveryMode: DELIVERY_REVERSE[cfg.deliveryMode] ?? "Both",
    frequency: FREQUENCY_REVERSE[cfg.frequency] ?? "Real-time",
    riskThreshold,
    escalationRecipients,
    lockStatus: cfg.lockStatus,
    saved: true,
  };
}

function mapLocalConfigToBackend(
  alertKey: AlertTypeKey,
  cfg: AlertConfig,
): BackendAlertConfig {
  const riskIndexMap: Record<RiskThresholdLevel, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    all: 3,
  };
  return {
    alertType: ALERT_TYPE_MAP[alertKey],
    enabled: cfg.enabled,
    primaryAdminRecipient: cfg.recipients.primaryAdmin,
    secondaryAdminRecipient: cfg.recipients.secondaryAdmins,
    endUsersRecipient: cfg.recipients.endUsers,
    deliveryMode: DELIVERY_MAP[cfg.deliveryMode],
    frequency: FREQUENCY_MAP[cfg.frequency],
    riskThreshold: BigInt(riskIndexMap[cfg.riskThreshold]),
    escalationRecipients: cfg.escalationRecipients.map(
      (r) => `${r.name}|${r.role}`,
    ),
    lockStatus: cfg.lockStatus,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  disabled,
  dataOcid,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  dataOcid?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      data-ocid={dataOcid}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        background: checked ? "#F97316" : "rgba(100,116,139,0.4)",
        boxShadow: checked ? "0 0 8px rgba(249,115,22,0.35)" : "none",
      }}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function DarkSelect<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      disabled={disabled}
      className="text-xs rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-1 transition-colors"
      style={{
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(100,116,139,0.3)",
        color: disabled ? "#64748b" : "#E2E8F0",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {options.map((opt) => (
        <option
          key={opt}
          value={opt}
          style={{ background: "#0F172A", color: "#E2E8F0" }}
        >
          {opt}
        </option>
      ))}
    </select>
  );
}

function RiskThresholdBadge({ level }: { level: RiskThresholdLevel }) {
  const colors = RISK_THRESHOLD_COLORS[level];
  const label =
    RISK_THRESHOLD_OPTIONS.find((o) => o.value === level)?.label ?? level;
  return (
    <span
      className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {label}
    </span>
  );
}

function RoleBadge({ role }: { role: EscalationRecipient["role"] }) {
  const style =
    role === "Primary Admin"
      ? {
          bg: "rgba(249,115,22,0.12)",
          color: "#F97316",
          border: "rgba(249,115,22,0.3)",
        }
      : role === "Secondary Admin"
        ? {
            bg: "rgba(100,140,220,0.12)",
            color: "#8AABDC",
            border: "rgba(100,140,220,0.3)",
          }
        : {
            bg: "rgba(100,116,139,0.15)",
            color: "#94a3b8",
            border: "rgba(100,116,139,0.3)",
          };
  return (
    <span
      className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {role}
    </span>
  );
}

function EscalationChip({
  recipient,
  onRemove,
  disabled,
  index,
}: {
  recipient: EscalationRecipient;
  onRemove: () => void;
  disabled?: boolean;
  index: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{
        background: "rgba(30,41,59,0.9)",
        border: "1px solid rgba(100,116,139,0.3)",
        color: "#CBD5E1",
      }}
      data-ocid={`forgeai_alert.escalation_chip.${index + 1}`}
    >
      <span>{recipient.name}</span>
      <RoleBadge role={recipient.role} />
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-white transition-colors focus:outline-none"
          aria-label={`Remove ${recipient.name}`}
          data-ocid={`forgeai_alert.escalation_chip.remove.${index + 1}`}
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
}

// ─── Request Unlock Modal ─────────────────────────────────────────────────────

function RequestUnlockModal({
  ruleName,
  lockSource,
  orgId,
  onClose,
}: {
  ruleName: string;
  lockSource: LockSource;
  orgId: string;
  onClose: () => void;
}) {
  const { actor } = useActor();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for your unlock request.");
      return;
    }
    if (!actor) {
      toast.error("Unable to submit: actor not available.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await actor.submitUnlockRequest(
        ruleName,
        ruleName,
        orgId,
        "Current Admin",
        "parent-org",
        lockSource,
        reason.trim(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "" as unknown as any,
      );
      if (result.__kind__ === "ok") {
        toast.success(
          `Unlock request submitted to ${lockSource} Admin. Status: Pending.`,
        );
        onClose();
      } else {
        toast.error(`Failed to submit request: ${result.err}`);
      }
    } catch {
      toast.error("An error occurred while submitting the unlock request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      data-ocid="forgeai_alert.unlock_request.dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl flex flex-col gap-0 relative"
        style={{
          background: "#0F172A",
          border: "1px solid rgba(249,115,22,0.25)",
          boxShadow: "0 0 48px rgba(249,115,22,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" style={{ color: "#F97316" }} />
            <span className="text-sm font-bold font-display text-white">
              Request Unlock
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors"
            aria-label="Close"
            data-ocid="forgeai_alert.unlock_request.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-4">
          <div
            className="rounded-lg px-3 py-2.5 flex items-start gap-2"
            style={{
              background: "rgba(249,115,22,0.06)",
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          >
            <Info
              className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
              style={{ color: "#F97316" }}
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-white">Locked Rule</p>
              <p className="text-xs text-muted-foreground">{ruleName}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                This setting is locked by{" "}
                <strong style={{ color: "#F97316" }}>{lockSource} Admin</strong>
                . Your request will be sent to them for review.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Reason for unlock request
              <span className="text-red-400 ml-1">*</span>
            </Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you need this setting changed..."
              rows={3}
              required
              className="crm-input text-xs resize-none rounded-lg px-3 py-2 w-full"
              style={{
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(100,116,139,0.3)",
                color: "#E2E8F0",
              }}
              data-ocid="forgeai_alert.unlock_request.reason.textarea"
            />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 text-xs border-border"
              onClick={onClose}
              data-ocid="forgeai_alert.unlock_request.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting || !reason.trim()}
              className="h-8 text-xs text-white gap-1.5"
              style={{ background: "#F97316" }}
              data-ocid="forgeai_alert.unlock_request.submit_button"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Alert Card ───────────────────────────────────────────────────────────────

function AlertCard({
  alertKey,
  config,
  onChange,
  onSave,
  ocidPrefix,
  companyType,
}: {
  alertKey: AlertTypeKey;
  config: AlertConfig;
  onChange: (key: AlertTypeKey, patch: Partial<AlertConfig>) => void;
  onSave: (key: AlertTypeKey) => Promise<void>;
  ocidPrefix: string;
  companyType: "Distributor" | "Reseller";
}) {
  const meta = ALERT_META[alertKey];
  const lockStatus = config.lockStatus;
  const isLocked = lockStatus.__kind__ === "LockedBy";
  const isInherited = lockStatus.__kind__ === "InheritedFrom";
  const lockSource = isLocked
    ? (lockStatus as { __kind__: "LockedBy"; LockedBy: LockSource }).LockedBy
    : isInherited
      ? (lockStatus as { __kind__: "InheritedFrom"; InheritedFrom: LockSource })
          .InheritedFrom
      : null;
  const isReadOnly = isLocked;

  const [escalationName, setEscalationName] = useState("");
  const [escalationRole, setEscalationRole] =
    useState<EscalationRecipient["role"]>("Primary Admin");
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const slug = alertKey.toLowerCase();
  const ocid = `${ocidPrefix}.${slug}`;

  const allowEndUsers = companyType === "Reseller";

  function handleAddEscalation() {
    const trimmed = escalationName.trim();
    if (!trimmed) return;
    onChange(alertKey, {
      escalationRecipients: [
        ...config.escalationRecipients,
        { name: trimmed, role: escalationRole },
      ],
    });
    setEscalationName("");
    setEscalationRole("Primary Admin");
  }

  function handleRemoveEscalation(i: number) {
    onChange(alertKey, {
      escalationRecipients: config.escalationRecipients.filter(
        (_, idx) => idx !== i,
      ),
    });
  }

  async function handleSave() {
    setSaving(true);
    await onSave(alertKey);
    setSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }

  const recipientRows: [keyof AlertConfig["recipients"], string][] = [
    ["primaryAdmin", "Primary Admin"],
    ["secondaryAdmins", "Secondary Admins"],
    ...(allowEndUsers
      ? [["endUsers", "End Users"] as [keyof AlertConfig["recipients"], string]]
      : []),
  ];

  return (
    <>
      {unlockModalOpen && lockSource && (
        <RequestUnlockModal
          ruleName={meta.label}
          lockSource={lockSource}
          orgId="current-org"
          onClose={() => setUnlockModalOpen(false)}
        />
      )}
      <div
        className="rounded-xl flex flex-col gap-0 transition-opacity"
        style={{
          background: "#1E293B",
          border: isReadOnly
            ? "1px solid rgba(249,115,22,0.15)"
            : "1px solid rgba(100,116,139,0.2)",
          opacity: config.enabled ? 1 : 0.6,
        }}
        data-ocid={`${ocid}.card`}
      >
        {/* Card header */}
        <div
          className="flex items-start justify-between gap-3 p-4 pb-3"
          style={{ borderBottom: "1px solid rgba(100,116,139,0.12)" }}
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">
                {meta.label}
              </span>
              {isLocked && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(249,115,22,0.12)",
                    border: "1px solid rgba(249,115,22,0.3)",
                    color: "#F97316",
                  }}
                >
                  <Lock className="w-2.5 h-2.5" />
                  Locked by {lockSource}
                </span>
              )}
              {isInherited && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(100,140,220,0.12)",
                    border: "1px solid rgba(100,140,220,0.3)",
                    color: "#8AABDC",
                  }}
                >
                  <Info className="w-2.5 h-2.5" />
                  Inherited from {lockSource}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {meta.description}
            </p>
          </div>
          <ToggleSwitch
            checked={config.enabled}
            onChange={(v) => onChange(alertKey, { enabled: v })}
            disabled={isReadOnly}
            dataOcid={`${ocid}.enabled.toggle`}
          />
        </div>

        {/* Card body */}
        <div className="p-4 flex flex-col gap-4">
          {/* Recipients */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Alert Recipients
            </Label>
            <div className="flex flex-wrap gap-4">
              {recipientRows.map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 cursor-pointer ${
                    isReadOnly || !config.enabled ? "pointer-events-none" : ""
                  }`}
                  data-ocid={`${ocid}.recipient.${key}`}
                >
                  <input
                    type="checkbox"
                    checked={config.recipients[key]}
                    onChange={(e) =>
                      onChange(alertKey, {
                        recipients: {
                          ...config.recipients,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    disabled={isReadOnly || !config.enabled}
                    className="rounded"
                    style={{ accentColor: "#F97316" }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {label}
                    {key === "endUsers" && (
                      <span className="ml-1 text-[10px] opacity-60">
                        (where permitted)
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery Mode + Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Delivery Mode
              </Label>
              <DarkSelect<DeliveryMode>
                value={config.deliveryMode}
                options={["Dashboard Only", "Message Only", "Both"]}
                onChange={(v) => onChange(alertKey, { deliveryMode: v })}
                disabled={isReadOnly || !config.enabled}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Alert Frequency
              </Label>
              <DarkSelect<FrequencyOption>
                value={config.frequency}
                options={[
                  "Real-time",
                  "Hourly Digest",
                  "Daily Digest",
                  "Weekly Summary",
                ]}
                onChange={(v) => onChange(alertKey, { frequency: v })}
                disabled={isReadOnly || !config.enabled}
              />
            </div>
          </div>

          {/* Risk Threshold Level */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
                Minimum Risk Level to Trigger Alert
              </Label>
              <RiskThresholdBadge level={config.riskThreshold} />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {RISK_THRESHOLD_OPTIONS.map((opt) => {
                const isActive = config.riskThreshold === opt.value;
                const colors = RISK_THRESHOLD_COLORS[opt.value];
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isReadOnly || !config.enabled}
                    onClick={() =>
                      onChange(alertKey, { riskThreshold: opt.value })
                    }
                    data-ocid={`${ocid}.risk_threshold.${opt.value}`}
                    className="text-[11px] font-medium px-3 py-1 rounded-full transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: isActive ? colors.bg : "rgba(15,23,42,0.6)",
                      border: isActive
                        ? `1.5px solid ${colors.border}`
                        : "1px solid rgba(100,116,139,0.25)",
                      color: isActive ? colors.text : "#64748b",
                      boxShadow: isActive ? `0 0 8px ${colors.bg}` : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Escalation Recipients */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">
              Escalation Recipients
            </Label>
            {config.escalationRecipients.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {config.escalationRecipients.map((r, i) => (
                  <EscalationChip
                    key={`${r.name}-${i}`}
                    recipient={r}
                    index={i}
                    onRemove={() => handleRemoveEscalation(i)}
                    disabled={isReadOnly || !config.enabled}
                  />
                ))}
              </div>
            )}
            {config.escalationRecipients.length === 0 && (
              <p className="text-[11px] text-muted-foreground">
                No escalation recipients configured.
              </p>
            )}
            {!isReadOnly && config.enabled && (
              <div className="flex gap-2 items-center flex-wrap">
                <Input
                  value={escalationName}
                  onChange={(e) => setEscalationName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddEscalation();
                    }
                  }}
                  placeholder="Recipient name"
                  className="crm-input h-8 text-xs flex-1 min-w-[140px]"
                  data-ocid={`${ocid}.escalation.name.input`}
                />
                <select
                  value={escalationRole}
                  onChange={(e) =>
                    setEscalationRole(
                      e.target.value as EscalationRecipient["role"],
                    )
                  }
                  className="text-xs rounded-lg px-2.5 py-1.5 h-8 appearance-none focus:outline-none"
                  style={{
                    background: "rgba(15,23,42,0.8)",
                    border: "1px solid rgba(100,116,139,0.3)",
                    color: "#E2E8F0",
                  }}
                  data-ocid={`${ocid}.escalation.role.select`}
                >
                  <option
                    value="Primary Admin"
                    style={{ background: "#0F172A" }}
                  >
                    Primary Admin
                  </option>
                  <option
                    value="Secondary Admin"
                    style={{ background: "#0F172A" }}
                  >
                    Secondary Admin
                  </option>
                  {allowEndUsers && (
                    <option value="End User" style={{ background: "#0F172A" }}>
                      End User
                    </option>
                  )}
                </select>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-border px-3"
                  onClick={handleAddEscalation}
                  disabled={!escalationName.trim()}
                  data-ocid={`${ocid}.escalation.add_button`}
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Footer: save or locked actions */}
          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            {isLocked ? (
              <>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" style={{ color: "#F97316" }} />
                  Locked by {lockSource} — settings are read-only
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5"
                  style={{
                    borderColor: "rgba(249,115,22,0.3)",
                    color: "#F97316",
                  }}
                  onClick={() => setUnlockModalOpen(true)}
                  data-ocid={`${ocid}.request_unlock_button`}
                >
                  <Lock className="w-3 h-3" />
                  Request Unlock
                </Button>
              </>
            ) : (
              <div className="flex justify-end w-full">
                <Button
                  type="button"
                  size="sm"
                  disabled={saving || !config.enabled}
                  onClick={handleSave}
                  className="text-white text-xs h-8 gap-1.5"
                  style={{ background: showSaved ? "#16a34a" : "#F97316" }}
                  data-ocid={`${ocid}.save_button`}
                >
                  {showSaved ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved
                    </>
                  ) : saving ? (
                    "Saving..."
                  ) : (
                    "Save Alert Configuration"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Secondary Admin Permissions Panel ───────────────────────────────────────

function SecondaryAdminPermissionsPanel() {
  const [expanded, setExpanded] = useState(false);
  const [admins, setAdmins] = useState<SecondaryAdmin[]>(
    SAMPLE_SECONDARY_ADMINS,
  );

  function togglePermission(id: string, value: boolean) {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, canManageForgeAIAlerts: value } : a,
      ),
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(30,41,59,0.6)",
        border: "1px solid rgba(100,140,220,0.2)",
      }}
      data-ocid="forgeai_alert.secondary_admin_permissions.panel"
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        data-ocid="forgeai_alert.secondary_admin_permissions.toggle"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: "#8AABDC" }} />
          <span className="text-sm font-semibold text-foreground">
            Secondary Admin Permissions
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(100,140,220,0.12)",
              color: "#8AABDC",
              border: "1px solid rgba(100,140,220,0.25)",
            }}
          >
            Primary Admin Only
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div
          className="px-4 pb-4 flex flex-col gap-4"
          style={{ borderTop: "1px solid rgba(100,116,139,0.15)" }}
        >
          <p className="text-xs text-muted-foreground pt-3 leading-relaxed">
            <strong className="text-foreground">canManageForgeAIAlerts</strong>{" "}
            — off by default. Grant this permission to allow Secondary Admins to
            configure ForgeAI alert delivery settings in this workspace.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
                  {["Admin", "Email", "Can Manage ForgeAI Alerts"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] text-muted-foreground uppercase tracking-wide py-2 pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, i) => (
                  <tr
                    key={admin.id}
                    style={{
                      borderBottom: "1px solid rgba(100,116,139,0.1)",
                    }}
                    data-ocid={`forgeai_alert.secondary_admin.item.${i + 1}`}
                  >
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ background: "#8AABDC" }}
                        >
                          {admin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {admin.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {admin.email}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={admin.canManageForgeAIAlerts}
                          onChange={(v) => togglePermission(admin.id, v)}
                          dataOcid={`forgeai_alert.secondary_admin.toggle.${i + 1}`}
                        />
                        <span className="text-[11px] text-muted-foreground">
                          {admin.canManageForgeAIAlerts
                            ? "Granted"
                            : "Not granted"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface ForgeAIAlertConfigProps {
  companyType: "Distributor" | "Reseller";
  orgId: string;
  isPrimaryAdmin: boolean;
  canManageForgeAIAlerts: boolean;
}

export function ForgeAIAlertConfig({
  companyType,
  orgId,
  isPrimaryAdmin,
  canManageForgeAIAlerts,
}: ForgeAIAlertConfigProps) {
  const { actor } = useActor();
  const [configs, setConfigs] = useState<AlertConfigs>(buildDefaultConfigs);
  const [loadError, setLoadError] = useState(false);

  const ocidPrefix =
    companyType === "Distributor"
      ? "distributor_admin.forgeai"
      : "reseller_admin.forgeai";

  // ─── Load settings from backend ────────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    if (!actor) return;
    try {
      const settings: OrgForgeAIAlertSettings =
        await actor.getOrgForgeAIAlertSettings(orgId);
      if (settings.alertConfigs.length > 0) {
        const mapped = buildDefaultConfigs();
        for (const cfg of settings.alertConfigs) {
          const key = Object.entries(ALERT_TYPE_MAP).find(
            ([, v]) => v === cfg.alertType,
          )?.[0] as AlertTypeKey | undefined;
          if (key) {
            mapped[key] = mapBackendConfigToLocal(cfg);
          }
        }
        setConfigs(mapped);
      }
    } catch {
      setLoadError(true);
    }
  }, [actor, orgId]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // ─── Save single alert config ───────────────────────────────────────────────
  const handleSave = useCallback(
    async (alertKey: AlertTypeKey) => {
      if (!actor) {
        toast.error("Unable to save: actor not available.");
        return;
      }
      try {
        const backendCfg = mapLocalConfigToBackend(alertKey, configs[alertKey]);
        const result = await actor.updateForgeAIAlertConfig(orgId, backendCfg);
        if (result.__kind__ === "ok") {
          toast.success(`${ALERT_META[alertKey].label} configuration saved.`);
          setConfigs((prev) => ({
            ...prev,
            [alertKey]: { ...prev[alertKey], saved: true },
          }));
        } else {
          toast.error(`Save failed: ${result.err}`);
        }
      } catch {
        toast.error("An error occurred while saving.");
      }
    },
    [actor, configs, orgId],
  );

  function handleChange(key: AlertTypeKey, patch: Partial<AlertConfig>) {
    setConfigs((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  // ─── Access control ─────────────────────────────────────────────────────────
  const hasAccess = isPrimaryAdmin || canManageForgeAIAlerts;
  if (!hasAccess) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-16 px-8 rounded-xl text-center"
        style={{
          background: "rgba(30,41,59,0.6)",
          border: "1px solid rgba(249,115,22,0.15)",
        }}
        data-ocid={`${ocidPrefix}.access_restricted`}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(249,115,22,0.08)",
            border: "1.5px solid rgba(249,115,22,0.3)",
          }}
        >
          <Lock className="w-6 h-6" style={{ color: "#F97316" }} />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-foreground">
            Access Restricted
          </p>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            ForgeAI alert configuration requires Primary Admin access or the{" "}
            <strong className="text-foreground">
              ForgeAI Alerts Management
            </strong>{" "}
            permission.
          </p>
          <p className="text-xs text-muted-foreground">
            Contact your Primary Admin to request access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-6"
      data-ocid={`${ocidPrefix}.config.panel`}
    >
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" style={{ color: "#F97316" }} />
              <h2 className="text-lg font-bold font-display text-foreground">
                ForgeAI Alert Delivery Configuration
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              Configure how and when ForgeAI intelligence alerts are delivered
              to your organisation. Set recipient roles, delivery channels,
              frequency, minimum risk threshold, and escalation recipients per
              alert type.
            </p>
          </div>
          {!isPrimaryAdmin && canManageForgeAIAlerts && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold flex-shrink-0"
              style={{
                background: "rgba(100,140,220,0.1)",
                border: "1px solid rgba(100,140,220,0.25)",
                color: "#8AABDC",
              }}
              data-ocid={`${ocidPrefix}.delegated_access_badge`}
            >
              <Info className="w-3 h-3" />
              Delegated Access
            </div>
          )}
        </div>

        {/* Info banner */}
        <div
          className="flex items-start gap-2 rounded-lg px-4 py-3"
          style={{
            background: "rgba(249,115,22,0.05)",
            border: "1px solid rgba(249,115,22,0.15)",
          }}
        >
          <Info
            className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
            style={{ color: "#F97316" }}
          />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span style={{ color: "#F97316" }} className="font-semibold">
              In-app notifications only.
            </span>{" "}
            All ForgeAI alerts are delivered in-app. Email notifications are not
            available on the current plan. Alerts are scoped to your{" "}
            {companyType} workspace — no cross-workspace data is exposed.
          </p>
        </div>

        {/* Load error */}
        {loadError && (
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-2.5"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
            data-ocid={`${ocidPrefix}.load_error`}
          >
            <Info className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <p className="text-[11px] text-red-400">
              Could not load saved settings from backend. Showing defaults.
            </p>
          </div>
        )}
      </div>

      {/* Secondary Admin Permissions (Primary Admin only) */}
      {isPrimaryAdmin && <SecondaryAdminPermissionsPanel />}

      {/* Alert type cards */}
      <div className="flex flex-col gap-4">
        {ALERT_TYPE_KEYS.map((key) => (
          <AlertCard
            key={key}
            alertKey={key}
            config={configs[key]}
            onChange={handleChange}
            onSave={handleSave}
            ocidPrefix={ocidPrefix}
            companyType={companyType}
          />
        ))}
      </div>
    </div>
  );
}
