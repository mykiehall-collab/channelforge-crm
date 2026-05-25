import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  Lock,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LockStatus =
  | "editable"
  | "lockedByVendor"
  | "lockedByDistributor"
  | "inheritedFromVendor"
  | "inheritedFromDistributor";

type UnlockRequestStatus = "Pending" | "Approved" | "Declined";

interface UnlockRequest {
  status: UnlockRequestStatus;
  submittedAt: Date;
  reason: string;
}

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  value: boolean;
  lockStatus: LockStatus;
  lockSource?: "Vendor" | "Distributor";
  /** For hierarchy routing — highest enforcer takes precedence */
  enforcedBy?: "Vendor" | "Distributor";
}

interface Props {
  companyType: "Distributor" | "Reseller";
  orgId: string;
  isPrimaryAdmin: boolean;
}

// ─── Mocked data factory ──────────────────────────────────────────────────────

function buildRules(
  companyType: "Distributor" | "Reseller",
): NotificationRule[] {
  return [
    {
      id: "renewalRiskAlerts",
      name: "Renewal Risk Alerts",
      description:
        "Alerts when account renewal risk score increases significantly.",
      value: true,
      lockStatus: "editable",
    },
    {
      id: "resellerEngagementGapAlerts",
      name: "Reseller Engagement Gap Alerts",
      description:
        "Notifies when a reseller has not engaged within the configured threshold.",
      value: true,
      lockStatus: "editable",
    },
    {
      id: "distributorEngagementGapAlerts",
      name: "Distributor Engagement Gap Alerts",
      description:
        "Notifies when a distributor has not engaged within the configured threshold.",
      value: true,
      lockStatus:
        companyType === "Reseller" ? "lockedByDistributor" : "editable",
      lockSource: companyType === "Reseller" ? "Distributor" : undefined,
      enforcedBy: companyType === "Reseller" ? "Distributor" : undefined,
    },
    {
      id: "dealRegistrationWarnings",
      name: "Deal Registration Warnings",
      description:
        "Alerts for stalled, duplicate, or expired deal registrations.",
      value: true,
      lockStatus: "lockedByVendor",
      lockSource: "Vendor",
      enforcedBy: "Vendor",
    },
    {
      id: "stalledApprovalAlerts",
      name: "Stalled Approval Alerts",
      description:
        "Alerts when a deal or business plan approval has been pending too long.",
      value: false,
      lockStatus: "editable",
    },
    {
      id: "accountRiskAlerts",
      name: "Account Risk Alerts",
      description: "AI-generated alerts when an account is flagged as at-risk.",
      value: true,
      lockStatus: "inheritedFromVendor",
      lockSource: "Vendor",
    },
    {
      id: "businessPlanInactivityAlerts",
      name: "Business Plan Inactivity Alerts",
      description: "Notifies when a business plan has no recorded activity.",
      value: true,
      lockStatus: "editable",
    },
    {
      id: "pipelineHealthAlerts",
      name: "Pipeline Health Alerts",
      description:
        "Periodic alerts summarising pipeline health across your organisation.",
      value: false,
      lockStatus: "editable",
    },
    {
      id: "channelHealthScoreChanges",
      name: "Channel Health Score Changes",
      description:
        "Alerts when a channel health score changes by more than the configured threshold.",
      value: true,
      lockStatus: "editable",
    },
    {
      id: "messagingNotifications",
      name: "Messaging Notifications",
      description:
        "In-app notifications for new direct messages and group threads.",
      value: true,
      lockStatus: "editable",
    },
    {
      id: "securityAlerts",
      name: "MFA & Security Alerts",
      description:
        "Alerts for failed logins, MFA changes, and account lockouts. Enforced for compliance.",
      value: true,
      lockStatus: "lockedByVendor",
      lockSource: "Vendor",
      enforcedBy: "Vendor",
    },
  ];
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function LockBadge({ rule }: { rule: NotificationRule }) {
  const { lockStatus } = rule;
  if (lockStatus === "editable") return null;

  const configs = {
    lockedByVendor: {
      label: "Locked by Vendor",
      icon: <Lock className="w-3 h-3" />,
      style: {
        background: "rgba(249,115,22,0.12)",
        color: "#F97316",
        border: "1px solid rgba(249,115,22,0.3)",
        boxShadow: "0 0 6px rgba(249,115,22,0.18)",
      },
    },
    lockedByDistributor: {
      label: "Locked by Distributor",
      icon: <Lock className="w-3 h-3" />,
      style: {
        background: "rgba(234,179,8,0.12)",
        color: "#CA8A04",
        border: "1px solid rgba(234,179,8,0.3)",
      },
    },
    inheritedFromVendor: {
      label: "Inherited from Vendor",
      icon: <Info className="w-3 h-3" />,
      style: {
        background: "rgba(100,140,220,0.1)",
        color: "#8AABDC",
        border: "1px solid rgba(100,140,220,0.25)",
      },
    },
    inheritedFromDistributor: {
      label: "Inherited from Distributor",
      icon: <Info className="w-3 h-3" />,
      style: {
        background: "rgba(100,140,220,0.1)",
        color: "#8AABDC",
        border: "1px solid rgba(100,140,220,0.25)",
      },
    },
  } as const;

  const config = configs[lockStatus as keyof typeof configs];
  if (!config) return null;

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={config.style}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function ValueBadge({ value }: { value: boolean }) {
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={
        value
          ? {
              background: "rgba(34,197,94,0.12)",
              color: "#4ADE80",
              border: "1px solid rgba(34,197,94,0.2)",
            }
          : {
              background: "rgba(100,116,139,0.15)",
              color: "#94a3b8",
              border: "1px solid rgba(100,116,139,0.2)",
            }
      }
    >
      {value ? "On" : "Off"}
    </span>
  );
}

function UnlockStatusBadge({ status }: { status: UnlockRequestStatus }) {
  const map = {
    Pending: {
      icon: <Clock className="w-3 h-3" />,
      label: "Pending Unlock Request",
      style: {
        background: "rgba(234,179,8,0.12)",
        color: "#CA8A04",
        border: "1px solid rgba(234,179,8,0.3)",
      },
    },
    Approved: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "Unlock Approved",
      style: {
        background: "rgba(34,197,94,0.1)",
        color: "#4ADE80",
        border: "1px solid rgba(34,197,94,0.2)",
      },
    },
    Declined: {
      icon: <XCircle className="w-3 h-3" />,
      label: "Unlock Declined",
      style: {
        background: "rgba(239,68,68,0.1)",
        color: "#F87171",
        border: "1px solid rgba(239,68,68,0.2)",
      },
    },
  };
  const cfg = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={cfg.style}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
  ruleId,
}: {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  ruleId: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={!disabled ? onChange : undefined}
      data-ocid={`notifications.toggle.${ruleId}`}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
      }`}
      style={
        checked && !disabled
          ? { background: "#F97316", outlineColor: "#F97316" }
          : { background: "rgba(100,116,139,0.4)" }
      }
      aria-label={`Toggle ${ruleId}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0.5"
        } translate-y-0.5`}
        style={{ background: disabled ? "#4b5563" : "#fff" }}
      />
    </button>
  );
}

// ─── Request Unlock Modal ─────────────────────────────────────────────────────

function RequestUnlockModal({
  rule,
  companyType,
  onClose,
  onSubmit,
}: {
  rule: NotificationRule;
  companyType: "Distributor" | "Reseller";
  onClose: () => void;
  onSubmit: (ruleId: string, reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const routedTo =
    rule.enforcedBy === "Vendor"
      ? "Vendor Admin"
      : rule.enforcedBy === "Distributor"
        ? "Distributor Admin"
        : rule.lockSource === "Vendor"
          ? "Vendor Admin"
          : "Distributor Admin";

  const lockedByLabel =
    rule.lockStatus === "lockedByVendor"
      ? "This rule is locked by Vendor Admin"
      : rule.lockStatus === "lockedByDistributor"
        ? "This rule is locked by Distributor Admin"
        : `This rule is enforced by ${rule.lockSource} Admin`;

  const hierarchyNote =
    companyType === "Reseller" && rule.enforcedBy === "Vendor"
      ? "This rule is enforced at Vendor level. Your request will be routed to the Vendor Admin, bypassing the Distributor."
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (reason.trim().length < 20) return;
    onSubmit(rule.id, reason.trim());
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,18,30,0.82)" }}
      data-ocid={`notifications.unlock_modal.${rule.id}`}
    >
      <div
        className="relative w-full max-w-md rounded-2xl flex flex-col gap-5 p-6"
        style={{
          background: "#0F172A",
          border: "1.5px solid rgba(249,115,22,0.22)",
          boxShadow:
            "0 0 48px rgba(249,115,22,0.1), 0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3
              className="text-base font-bold font-display"
              style={{ color: "#E2E8F0" }}
            >
              Request Unlock
            </h3>
            <p className="text-sm font-semibold" style={{ color: "#F97316" }}>
              {rule.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-ocid={`notifications.unlock_modal.${rule.id}.close_button`}
            className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              <CheckCircle2 className="w-6 h-6" style={{ color: "#4ADE80" }} />
            </div>
            <div className="text-center flex flex-col gap-1">
              <p className="text-sm font-semibold" style={{ color: "#E2E8F0" }}>
                Unlock request sent
              </p>
              <p className="text-xs text-muted-foreground">
                Status:{" "}
                <span style={{ color: "#CA8A04" }} className="font-semibold">
                  Pending
                </span>
                . Your request has been routed to {routedTo} and logged in the
                audit history.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-border text-xs mt-1"
              onClick={onClose}
              data-ocid={`notifications.unlock_modal.${rule.id}.close_button`}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            {/* Lock info */}
            <div
              className="rounded-xl px-4 py-3 flex flex-col gap-1.5"
              style={{
                background: "rgba(249,115,22,0.06)",
                border: "1px solid rgba(249,115,22,0.18)",
              }}
            >
              <div className="flex items-center gap-2">
                <Lock
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: "#F97316" }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#F97316" }}
                >
                  {lockedByLabel}
                </span>
              </div>
              <p className="text-xs text-muted-foreground pl-5">
                Request will be routed to:{" "}
                <span className="font-semibold" style={{ color: "#E2E8F0" }}>
                  {routedTo}
                </span>
              </p>
              {hierarchyNote && (
                <div className="pl-5 flex items-start gap-1.5">
                  <AlertTriangle
                    className="w-3 h-3 mt-0.5 flex-shrink-0"
                    style={{ color: "#CA8A04" }}
                  />
                  <p className="text-[11px]" style={{ color: "#CA8A04" }}>
                    {hierarchyNote}
                  </p>
                </div>
              )}
            </div>

            {/* Reason form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`unlock-reason-${rule.id}`}
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Reason for unlock request{" "}
                  <span style={{ color: "#F97316" }}>*</span>
                </label>
                <textarea
                  id={`unlock-reason-${rule.id}`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Describe why you need this rule unlocked (min. 20 characters)…"
                  required
                  data-ocid={`notifications.unlock_modal.${rule.id}.reason.textarea`}
                  className="w-full rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 transition-all"
                  style={{
                    background: "rgba(30,41,59,0.8)",
                    border:
                      reason.length > 0 && reason.trim().length < 20
                        ? "1px solid rgba(239,68,68,0.5)"
                        : "1px solid rgba(100,116,139,0.3)",
                  }}
                />
                {reason.length > 0 && reason.trim().length < 20 && (
                  <p className="text-[11px]" style={{ color: "#F87171" }}>
                    Please enter at least 20 characters.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-border text-xs"
                  onClick={onClose}
                  data-ocid={`notifications.unlock_modal.${rule.id}.cancel_button`}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={reason.trim().length < 20}
                  data-ocid={`notifications.unlock_modal.${rule.id}.submit_button`}
                  style={{
                    background:
                      reason.trim().length >= 20 ? "#F97316" : undefined,
                  }}
                  className="text-white text-xs"
                >
                  Send Unlock Request
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Rule Row ─────────────────────────────────────────────────────────────────

function RuleRow({
  rule,
  companyType: _companyType,
  isPrimaryAdmin,
  unlockRequest,
  onToggle,
  onRequestUnlock,
}: {
  rule: NotificationRule;
  companyType: "Distributor" | "Reseller";
  isPrimaryAdmin: boolean;
  unlockRequest?: UnlockRequest;
  onToggle: (id: string) => void;
  onRequestUnlock: (rule: NotificationRule) => void;
}) {
  const isLocked =
    rule.lockStatus === "lockedByVendor" ||
    rule.lockStatus === "lockedByDistributor";
  const isEditable = rule.lockStatus === "editable" && isPrimaryAdmin;

  const leftBorderColor =
    rule.lockStatus === "lockedByVendor"
      ? "rgba(249,115,22,0.5)"
      : rule.lockStatus === "lockedByDistributor"
        ? "rgba(234,179,8,0.5)"
        : "transparent";

  return (
    <div
      className="rounded-xl px-4 py-3.5 flex items-center justify-between gap-3"
      style={{
        background: "#1E293B",
        border: "1px solid rgba(100,116,139,0.18)",
        borderLeft: isLocked
          ? `3px solid ${leftBorderColor}`
          : "1px solid rgba(100,116,139,0.18)",
      }}
      data-ocid={`notifications.rule.${rule.id}`}
    >
      {/* Left: name + badges */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {rule.name}
          </span>
          <LockBadge rule={rule} />
          {unlockRequest && <UnlockStatusBadge status={unlockRequest.status} />}
        </div>
        <p className="text-xs text-muted-foreground leading-snug">
          {rule.description}
        </p>
      </div>

      {/* Right: toggle + value + unlock button */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <ValueBadge value={rule.value} />
        <Toggle
          checked={rule.value}
          onChange={() => onToggle(rule.id)}
          disabled={!isEditable}
          ruleId={rule.id}
        />
        {isLocked && !unlockRequest && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 text-[11px] gap-1 border-border"
            style={{
              borderColor: "rgba(249,115,22,0.35)",
              color: "#F97316",
            }}
            onClick={() => onRequestUnlock(rule)}
            data-ocid={`notifications.rule.${rule.id}.request_unlock_button`}
          >
            <Lock className="w-3 h-3" />
            Request Unlock
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const items = [
    {
      icon: <Lock className="w-3 h-3" style={{ color: "#F97316" }} />,
      label: "Locked by Vendor",
      style: {
        background: "rgba(249,115,22,0.1)",
        color: "#F97316",
        border: "1px solid rgba(249,115,22,0.25)",
      },
    },
    {
      icon: <Lock className="w-3 h-3" style={{ color: "#CA8A04" }} />,
      label: "Locked by Distributor",
      style: {
        background: "rgba(234,179,8,0.1)",
        color: "#CA8A04",
        border: "1px solid rgba(234,179,8,0.25)",
      },
    },
    {
      icon: <Info className="w-3 h-3" style={{ color: "#8AABDC" }} />,
      label: "Inherited (read-only default)",
      style: {
        background: "rgba(100,140,220,0.08)",
        color: "#8AABDC",
        border: "1px solid rgba(100,140,220,0.2)",
      },
    },
    {
      icon: <Clock className="w-3 h-3" style={{ color: "#CA8A04" }} />,
      label: "Pending Unlock Request",
      style: {
        background: "rgba(234,179,8,0.08)",
        color: "#CA8A04",
        border: "1px solid rgba(234,179,8,0.2)",
      },
    },
  ];

  return (
    <div
      className="rounded-xl px-4 py-3 flex flex-wrap gap-3"
      style={{
        background: "rgba(15,23,42,0.7)",
        border: "1px solid rgba(100,116,139,0.18)",
      }}
    >
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide self-center">
        Legend:
      </span>
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={item.style}
        >
          {item.icon}
          {item.label}
        </span>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function NotificationRulesConfig({
  companyType,
  orgId: _orgId,
  isPrimaryAdmin,
}: Props) {
  const [rules, setRules] = useState<NotificationRule[]>(() =>
    buildRules(companyType),
  );
  const [unlockRequests, setUnlockRequests] = useState<
    Record<string, UnlockRequest>
  >({});
  const [activeModal, setActiveModal] = useState<NotificationRule | null>(null);

  function handleToggle(id: string) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, value: !r.value } : r)),
    );
  }

  function handleRequestUnlock(rule: NotificationRule) {
    setActiveModal(rule);
  }

  function handleSubmitUnlock(ruleId: string, reason: string) {
    setUnlockRequests((prev) => ({
      ...prev,
      [ruleId]: { status: "Pending", submittedAt: new Date(), reason },
    }));
  }

  const prefix = companyType === "Distributor" ? "distributor" : "reseller";

  return (
    <div
      className="flex flex-col gap-5"
      data-ocid={`${prefix}_admin.notifications.rules_config`}
    >
      {/* Section header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-bold font-display text-foreground">
          Notification Rules
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          Configure which notifications your organisation receives. Rules
          enforced by your{" "}
          {companyType === "Reseller" ? "Vendor or Distributor" : "Vendor"} are
          shown with lock indicators. You can request unlock through the
          built-in request flow.
        </p>
      </div>

      {/* Legend */}
      <Legend />

      {/* Rules list */}
      <div className="flex flex-col gap-2">
        {rules.map((rule) => (
          <RuleRow
            key={rule.id}
            rule={rule}
            companyType={companyType}
            isPrimaryAdmin={isPrimaryAdmin}
            unlockRequest={unlockRequests[rule.id]}
            onToggle={handleToggle}
            onRequestUnlock={handleRequestUnlock}
          />
        ))}
      </div>

      {/* Modal */}
      {activeModal && (
        <RequestUnlockModal
          rule={activeModal}
          companyType={companyType}
          onClose={() => setActiveModal(null)}
          onSubmit={(id, reason) => {
            handleSubmitUnlock(id, reason);
          }}
        />
      )}
    </div>
  );
}
