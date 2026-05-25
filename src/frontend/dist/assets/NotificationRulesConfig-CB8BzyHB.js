import { p as useActor, r as reactExports, aV as ForgeAIAlertType, ab as ue, j as jsxRuntimeExports, L as Lock, aP as Bot, aN as Info, aW as AlertFrequency, aX as AlertDeliveryMode, H as Shield, ac as ChevronUp, k as ChevronDown, aF as Label, ad as Input, m as Button, J as CircleCheck, X, T as TriangleAlert, n as Clock, aa as CircleX } from "./index-DvFvlUBj.js";
import { S as Send } from "./send-Bb1KdK72.js";
const ALERT_META = {
  RenewalRisk: {
    label: "Renewal Risk Alerts",
    description: "Triggered when an account's renewal risk score exceeds the configured threshold."
  },
  ResellerEngagementGap: {
    label: "Reseller Engagement Gap Alerts",
    description: "Triggered when a reseller has not engaged with a customer account within the configured inactivity window."
  },
  DistributorEngagementGap: {
    label: "Distributor Engagement Gap Alerts",
    description: "Triggered when a distributor has not engaged within configurable activity thresholds."
  },
  DealRegistrationWarning: {
    label: "Deal Registration Warnings",
    description: "Alerts for stalled, duplicate, or expired deal registrations requiring attention."
  },
  StalledApproval: {
    label: "Stalled Approval Alerts",
    description: "Triggered when a deal registration or business plan approval has been pending beyond the expected window."
  },
  AccountRisk: {
    label: "Account Risk Alerts",
    description: "Triggered when an account's overall risk score exceeds the configured threshold."
  },
  BusinessPlanInactivity: {
    label: "Business Plan Inactivity Alerts",
    description: "Triggered when a business plan has had no activity or milestone updates for a configurable period."
  },
  PipelineHealth: {
    label: "Pipeline Health Alerts",
    description: "Alerts when pipeline velocity slows or conversion rates fall below expected benchmarks."
  },
  ChannelHealthScoreChange: {
    label: "Channel Health Score Changes",
    description: "Triggered when a channel health score changes significantly relative to the configured threshold."
  }
};
const ALERT_TYPE_KEYS = Object.keys(ALERT_META);
const ALERT_TYPE_MAP = {
  RenewalRisk: ForgeAIAlertType.RenewalRisk,
  ResellerEngagementGap: ForgeAIAlertType.ResellerEngagementGap,
  DistributorEngagementGap: ForgeAIAlertType.DistributorEngagementGap,
  DealRegistrationWarning: ForgeAIAlertType.DealRegistrationWarning,
  StalledApproval: ForgeAIAlertType.StalledApproval,
  AccountRisk: ForgeAIAlertType.AccountRisk,
  BusinessPlanInactivity: ForgeAIAlertType.BusinessPlanInactivity,
  PipelineHealth: ForgeAIAlertType.PipelineHealth,
  ChannelHealthScoreChange: ForgeAIAlertType.ChannelHealthScoreChange
};
const DELIVERY_MAP = {
  "Dashboard Only": AlertDeliveryMode.DashboardOnly,
  "Message Only": AlertDeliveryMode.MessageOnly,
  Both: AlertDeliveryMode.Both
};
const DELIVERY_REVERSE = {
  [AlertDeliveryMode.DashboardOnly]: "Dashboard Only",
  [AlertDeliveryMode.MessageOnly]: "Message Only",
  [AlertDeliveryMode.Both]: "Both"
};
const FREQUENCY_MAP = {
  "Real-time": AlertFrequency.Realtime,
  "Hourly Digest": AlertFrequency.Hourly,
  "Daily Digest": AlertFrequency.Daily,
  "Weekly Summary": AlertFrequency.Weekly
};
const FREQUENCY_REVERSE = {
  [AlertFrequency.Realtime]: "Real-time",
  [AlertFrequency.Hourly]: "Hourly Digest",
  [AlertFrequency.Daily]: "Daily Digest",
  [AlertFrequency.Weekly]: "Weekly Summary"
};
const RISK_THRESHOLD_OPTIONS = [
  { value: "critical", label: "Critical only" },
  { value: "high", label: "High and above" },
  { value: "medium", label: "Medium and above" },
  { value: "all", label: "All levels" }
];
const RISK_THRESHOLD_COLORS = {
  critical: {
    bg: "rgba(239,68,68,0.12)",
    text: "#F87171",
    border: "rgba(239,68,68,0.3)"
  },
  high: {
    bg: "rgba(249,115,22,0.12)",
    text: "#F97316",
    border: "rgba(249,115,22,0.3)"
  },
  medium: {
    bg: "rgba(234,179,8,0.12)",
    text: "#EAB308",
    border: "rgba(234,179,8,0.3)"
  },
  all: {
    bg: "rgba(34,197,94,0.12)",
    text: "#4ADE80",
    border: "rgba(34,197,94,0.3)"
  }
};
const SAMPLE_SECONDARY_ADMINS = [
  {
    id: "sa1",
    name: "James Tan",
    email: "james.tan@ingrammicro.com",
    canManageForgeAIAlerts: false
  },
  {
    id: "sa2",
    name: "Claire Bertrand",
    email: "claire.bertrand@ingrammicro.com",
    canManageForgeAIAlerts: false
  }
];
function buildDefaultConfig() {
  return {
    enabled: true,
    recipients: { primaryAdmin: true, secondaryAdmins: false, endUsers: false },
    deliveryMode: "Both",
    frequency: "Real-time",
    riskThreshold: "high",
    escalationRecipients: [],
    lockStatus: { __kind__: "Unlocked", Unlocked: null },
    saved: false
  };
}
function buildDefaultConfigs() {
  return Object.fromEntries(
    ALERT_TYPE_KEYS.map((key) => [key, buildDefaultConfig()])
  );
}
function mapBackendConfigToLocal(cfg) {
  const riskRaw = cfg.riskThreshold !== void 0 ? Number(cfg.riskThreshold) : 2;
  const riskLevels = [
    "critical",
    "high",
    "medium",
    "all"
  ];
  const riskThreshold = riskLevels[Math.min(riskRaw, 3)] ?? "high";
  const escalationRecipients = cfg.escalationRecipients.map((raw) => {
    const parts = raw.split("|");
    return {
      name: parts[0] ?? raw,
      role: parts[1] ?? "Primary Admin"
    };
  });
  return {
    enabled: cfg.enabled,
    recipients: {
      primaryAdmin: cfg.primaryAdminRecipient,
      secondaryAdmins: cfg.secondaryAdminRecipient,
      endUsers: cfg.endUsersRecipient
    },
    deliveryMode: DELIVERY_REVERSE[cfg.deliveryMode] ?? "Both",
    frequency: FREQUENCY_REVERSE[cfg.frequency] ?? "Real-time",
    riskThreshold,
    escalationRecipients,
    lockStatus: cfg.lockStatus,
    saved: true
  };
}
function mapLocalConfigToBackend(alertKey, cfg) {
  const riskIndexMap = {
    critical: 0,
    high: 1,
    medium: 2,
    all: 3
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
      (r) => `${r.name}|${r.role}`
    ),
    lockStatus: cfg.lockStatus
  };
}
function ToggleSwitch({
  checked,
  onChange,
  disabled,
  dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": checked,
      disabled,
      "data-ocid": dataOcid,
      onClick: () => !disabled && onChange(!checked),
      className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`,
      style: {
        background: checked ? "#F97316" : "rgba(100,116,139,0.4)",
        boxShadow: checked ? "0 0 8px rgba(249,115,22,0.35)" : "none"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`
        }
      )
    }
  );
}
function DarkSelect({
  value,
  options,
  onChange,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "select",
    {
      value,
      onChange: (e) => onChange(e.target.value),
      disabled,
      className: "text-xs rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-1 transition-colors",
      style: {
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(100,116,139,0.3)",
        color: disabled ? "#64748b" : "#E2E8F0",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center"
      },
      children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "option",
        {
          value: opt,
          style: { background: "#0F172A", color: "#E2E8F0" },
          children: opt
        },
        opt
      ))
    }
  );
}
function RiskThresholdBadge({ level }) {
  var _a;
  const colors = RISK_THRESHOLD_COLORS[level];
  const label = ((_a = RISK_THRESHOLD_OPTIONS.find((o) => o.value === level)) == null ? void 0 : _a.label) ?? level;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full",
      style: {
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`
      },
      children: label
    }
  );
}
function RoleBadge({ role }) {
  const style = role === "Primary Admin" ? {
    bg: "rgba(249,115,22,0.12)",
    color: "#F97316",
    border: "rgba(249,115,22,0.3)"
  } : role === "Secondary Admin" ? {
    bg: "rgba(100,140,220,0.12)",
    color: "#8AABDC",
    border: "rgba(100,140,220,0.3)"
  } : {
    bg: "rgba(100,116,139,0.15)",
    color: "#94a3b8",
    border: "rgba(100,116,139,0.3)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "text-[9px] font-semibold px-1.5 py-0.5 rounded",
      style: {
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`
      },
      children: role
    }
  );
}
function EscalationChip({
  recipient,
  onRemove,
  disabled,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
      style: {
        background: "rgba(30,41,59,0.9)",
        border: "1px solid rgba(100,116,139,0.3)",
        color: "#CBD5E1"
      },
      "data-ocid": `forgeai_alert.escalation_chip.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: recipient.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: recipient.role }),
        !disabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            className: "hover:text-white transition-colors focus:outline-none",
            "aria-label": `Remove ${recipient.name}`,
            "data-ocid": `forgeai_alert.escalation_chip.remove.${index + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-2.5 h-2.5" })
          }
        )
      ]
    }
  );
}
function RequestUnlockModal$1({
  ruleName,
  lockSource,
  orgId,
  onClose
}) {
  const { actor } = useActor();
  const [reason, setReason] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!reason.trim()) {
      ue.error("Please provide a reason for your unlock request.");
      return;
    }
    if (!actor) {
      ue.error("Unable to submit: actor not available.");
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
        ""
      );
      if (result.__kind__ === "ok") {
        ue.success(
          `Unlock request submitted to ${lockSource} Admin. Status: Pending.`
        );
        onClose();
      } else {
        ue.error(`Failed to submit request: ${result.err}`);
      }
    } catch {
      ue.error("An error occurred while submitting the unlock request.");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)" },
      "data-ocid": "forgeai_alert.unlock_request.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-md rounded-2xl flex flex-col gap-0 relative",
          style: {
            background: "#0F172A",
            border: "1px solid rgba(249,115,22,0.25)",
            boxShadow: "0 0 48px rgba(249,115,22,0.08)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-5 py-4",
                style: { borderBottom: "1px solid rgba(100,116,139,0.2)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4", style: { color: "#F97316" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold font-display text-white", children: "Request Unlock" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      className: "text-muted-foreground hover:text-white transition-colors",
                      "aria-label": "Close",
                      "data-ocid": "forgeai_alert.unlock_request.close_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4 px-5 py-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg px-3 py-2.5 flex items-start gap-2",
                  style: {
                    background: "rgba(249,115,22,0.06)",
                    border: "1px solid rgba(249,115,22,0.2)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        className: "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                        style: { color: "#F97316" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-white", children: "Locked Rule" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: ruleName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1", children: [
                        "This setting is locked by",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { style: { color: "#F97316" }, children: [
                          lockSource,
                          " Admin"
                        ] }),
                        ". Your request will be sent to them for review."
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                  "Reason for unlock request",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 ml-1", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: reason,
                    onChange: (e) => setReason(e.target.value),
                    placeholder: "Explain why you need this setting changed...",
                    rows: 3,
                    required: true,
                    className: "crm-input text-xs resize-none rounded-lg px-3 py-2 w-full",
                    style: {
                      background: "rgba(15,23,42,0.8)",
                      border: "1px solid rgba(100,116,139,0.3)",
                      color: "#E2E8F0"
                    },
                    "data-ocid": "forgeai_alert.unlock_request.reason.textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "h-8 text-xs border-border",
                    onClick: onClose,
                    "data-ocid": "forgeai_alert.unlock_request.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    size: "sm",
                    disabled: submitting || !reason.trim(),
                    className: "h-8 text-xs text-white gap-1.5",
                    style: { background: "#F97316" },
                    "data-ocid": "forgeai_alert.unlock_request.submit_button",
                    children: submitting ? "Submitting..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3 h-3" }),
                      "Submit Request"
                    ] })
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function AlertCard({
  alertKey,
  config,
  onChange,
  onSave,
  ocidPrefix,
  companyType
}) {
  const meta = ALERT_META[alertKey];
  const lockStatus = config.lockStatus;
  const isLocked = lockStatus.__kind__ === "LockedBy";
  const isInherited = lockStatus.__kind__ === "InheritedFrom";
  const lockSource = isLocked ? lockStatus.LockedBy : isInherited ? lockStatus.InheritedFrom : null;
  const isReadOnly = isLocked;
  const [escalationName, setEscalationName] = reactExports.useState("");
  const [escalationRole, setEscalationRole] = reactExports.useState("Primary Admin");
  const [saving, setSaving] = reactExports.useState(false);
  const [showSaved, setShowSaved] = reactExports.useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = reactExports.useState(false);
  const slug = alertKey.toLowerCase();
  const ocid = `${ocidPrefix}.${slug}`;
  const allowEndUsers = companyType === "Reseller";
  function handleAddEscalation() {
    const trimmed = escalationName.trim();
    if (!trimmed) return;
    onChange(alertKey, {
      escalationRecipients: [
        ...config.escalationRecipients,
        { name: trimmed, role: escalationRole }
      ]
    });
    setEscalationName("");
    setEscalationRole("Primary Admin");
  }
  function handleRemoveEscalation(i) {
    onChange(alertKey, {
      escalationRecipients: config.escalationRecipients.filter(
        (_, idx) => idx !== i
      )
    });
  }
  async function handleSave() {
    setSaving(true);
    await onSave(alertKey);
    setSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2e3);
  }
  const recipientRows = [
    ["primaryAdmin", "Primary Admin"],
    ["secondaryAdmins", "Secondary Admins"],
    ...allowEndUsers ? [["endUsers", "End Users"]] : []
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    unlockModalOpen && lockSource && /* @__PURE__ */ jsxRuntimeExports.jsx(
      RequestUnlockModal$1,
      {
        ruleName: meta.label,
        lockSource,
        orgId: "current-org",
        onClose: () => setUnlockModalOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl flex flex-col gap-0 transition-opacity",
        style: {
          background: "#1E293B",
          border: isReadOnly ? "1px solid rgba(249,115,22,0.15)" : "1px solid rgba(100,116,139,0.2)",
          opacity: config.enabled ? 1 : 0.6
        },
        "data-ocid": `${ocid}.card`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start justify-between gap-3 p-4 pb-3",
              style: { borderBottom: "1px solid rgba(100,116,139,0.12)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: meta.label }),
                    isLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        style: {
                          background: "rgba(249,115,22,0.12)",
                          border: "1px solid rgba(249,115,22,0.3)",
                          color: "#F97316"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5" }),
                          "Locked by ",
                          lockSource
                        ]
                      }
                    ),
                    isInherited && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        style: {
                          background: "rgba(100,140,220,0.12)",
                          border: "1px solid rgba(100,140,220,0.3)",
                          color: "#8AABDC"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-2.5 h-2.5" }),
                          "Inherited from ",
                          lockSource
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: meta.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ToggleSwitch,
                  {
                    checked: config.enabled,
                    onChange: (v) => onChange(alertKey, { enabled: v }),
                    disabled: isReadOnly,
                    dataOcid: `${ocid}.enabled.toggle`
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Alert Recipients" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4", children: recipientRows.map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: `flex items-center gap-2 cursor-pointer ${isReadOnly || !config.enabled ? "pointer-events-none" : ""}`,
                  "data-ocid": `${ocid}.recipient.${key}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: config.recipients[key],
                        onChange: (e) => onChange(alertKey, {
                          recipients: {
                            ...config.recipients,
                            [key]: e.target.checked
                          }
                        }),
                        disabled: isReadOnly || !config.enabled,
                        className: "rounded",
                        style: { accentColor: "#F97316" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      label,
                      key === "endUsers" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] opacity-60", children: "(where permitted)" })
                    ] })
                  ]
                },
                key
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Delivery Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DarkSelect,
                  {
                    value: config.deliveryMode,
                    options: ["Dashboard Only", "Message Only", "Both"],
                    onChange: (v) => onChange(alertKey, { deliveryMode: v }),
                    disabled: isReadOnly || !config.enabled
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Alert Frequency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  DarkSelect,
                  {
                    value: config.frequency,
                    options: [
                      "Real-time",
                      "Hourly Digest",
                      "Daily Digest",
                      "Weekly Summary"
                    ],
                    onChange: (v) => onChange(alertKey, { frequency: v }),
                    disabled: isReadOnly || !config.enabled
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Minimum Risk Level to Trigger Alert" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(RiskThresholdBadge, { level: config.riskThreshold })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: RISK_THRESHOLD_OPTIONS.map((opt) => {
                const isActive = config.riskThreshold === opt.value;
                const colors = RISK_THRESHOLD_COLORS[opt.value];
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    disabled: isReadOnly || !config.enabled,
                    onClick: () => onChange(alertKey, { riskThreshold: opt.value }),
                    "data-ocid": `${ocid}.risk_threshold.${opt.value}`,
                    className: "text-[11px] font-medium px-3 py-1 rounded-full transition-all focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed",
                    style: {
                      background: isActive ? colors.bg : "rgba(15,23,42,0.6)",
                      border: isActive ? `1.5px solid ${colors.border}` : "1px solid rgba(100,116,139,0.25)",
                      color: isActive ? colors.text : "#64748b",
                      boxShadow: isActive ? `0 0 8px ${colors.bg}` : "none"
                    },
                    children: opt.label
                  },
                  opt.value
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-muted-foreground uppercase tracking-wider", children: "Escalation Recipients" }),
              config.escalationRecipients.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: config.escalationRecipients.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                EscalationChip,
                {
                  recipient: r,
                  index: i,
                  onRemove: () => handleRemoveEscalation(i),
                  disabled: isReadOnly || !config.enabled
                },
                `${r.name}-${i}`
              )) }),
              config.escalationRecipients.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "No escalation recipients configured." }),
              !isReadOnly && config.enabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: escalationName,
                    onChange: (e) => setEscalationName(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddEscalation();
                      }
                    },
                    placeholder: "Recipient name",
                    className: "crm-input h-8 text-xs flex-1 min-w-[140px]",
                    "data-ocid": `${ocid}.escalation.name.input`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: escalationRole,
                    onChange: (e) => setEscalationRole(
                      e.target.value
                    ),
                    className: "text-xs rounded-lg px-2.5 py-1.5 h-8 appearance-none focus:outline-none",
                    style: {
                      background: "rgba(15,23,42,0.8)",
                      border: "1px solid rgba(100,116,139,0.3)",
                      color: "#E2E8F0"
                    },
                    "data-ocid": `${ocid}.escalation.role.select`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "option",
                        {
                          value: "Primary Admin",
                          style: { background: "#0F172A" },
                          children: "Primary Admin"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "option",
                        {
                          value: "Secondary Admin",
                          style: { background: "#0F172A" },
                          children: "Secondary Admin"
                        }
                      ),
                      allowEndUsers && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "End User", style: { background: "#0F172A" }, children: "End User" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "h-8 text-xs border-border px-3",
                    onClick: handleAddEscalation,
                    disabled: !escalationName.trim(),
                    "data-ocid": `${ocid}.escalation.add_button`,
                    children: "Add"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between pt-1 flex-wrap gap-2", children: isLocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3", style: { color: "#F97316" } }),
                "Locked by ",
                lockSource,
                " — settings are read-only"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "h-8 text-xs gap-1.5",
                  style: {
                    borderColor: "rgba(249,115,22,0.3)",
                    color: "#F97316"
                  },
                  onClick: () => setUnlockModalOpen(true),
                  "data-ocid": `${ocid}.request_unlock_button`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }),
                    "Request Unlock"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                disabled: saving || !config.enabled,
                onClick: handleSave,
                className: "text-white text-xs h-8 gap-1.5",
                style: { background: showSaved ? "#16a34a" : "#F97316" },
                "data-ocid": `${ocid}.save_button`,
                children: showSaved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                  "Saved"
                ] }) : saving ? "Saving..." : "Save Alert Configuration"
              }
            ) }) })
          ] })
        ]
      }
    )
  ] });
}
function SecondaryAdminPermissionsPanel() {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [admins, setAdmins] = reactExports.useState(
    SAMPLE_SECONDARY_ADMINS
  );
  function togglePermission(id, value) {
    setAdmins(
      (prev) => prev.map(
        (a) => a.id === id ? { ...a, canManageForgeAIAlerts: value } : a
      )
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl overflow-hidden",
      style: {
        background: "rgba(30,41,59,0.6)",
        border: "1px solid rgba(100,140,220,0.2)"
      },
      "data-ocid": "forgeai_alert.secondary_admin_permissions.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors",
            onClick: () => setExpanded((v) => !v),
            "data-ocid": "forgeai_alert.secondary_admin_permissions.toggle",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4", style: { color: "#8AABDC" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Secondary Admin Permissions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    style: {
                      background: "rgba(100,140,220,0.12)",
                      color: "#8AABDC",
                      border: "1px solid rgba(100,140,220,0.25)"
                    },
                    children: "Primary Admin Only"
                  }
                )
              ] }),
              expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 pb-4 flex flex-col gap-4",
            style: { borderTop: "1px solid rgba(100,116,139,0.15)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground pt-3 leading-relaxed", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "canManageForgeAIAlerts" }),
                " ",
                "— off by default. Grant this permission to allow Secondary Admins to configure ForgeAI alert delivery settings in this workspace."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { style: { borderBottom: "1px solid rgba(100,116,139,0.2)" }, children: ["Admin", "Email", "Can Manage ForgeAI Alerts"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "text-left text-[11px] text-muted-foreground uppercase tracking-wide py-2 pr-4 whitespace-nowrap",
                    children: h
                  },
                  h
                )) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: admins.map((admin, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    style: {
                      borderBottom: "1px solid rgba(100,116,139,0.1)"
                    },
                    "data-ocid": `forgeai_alert.secondary_admin.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0",
                            style: { background: "#8AABDC" },
                            children: admin.name.split(" ").map((n) => n[0]).join("")
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: admin.name })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 pr-4 text-xs text-muted-foreground", children: admin.email }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ToggleSwitch,
                          {
                            checked: admin.canManageForgeAIAlerts,
                            onChange: (v) => togglePermission(admin.id, v),
                            dataOcid: `forgeai_alert.secondary_admin.toggle.${i + 1}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: admin.canManageForgeAIAlerts ? "Granted" : "Not granted" })
                      ] }) })
                    ]
                  },
                  admin.id
                )) })
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
function ForgeAIAlertConfig({
  companyType,
  orgId,
  isPrimaryAdmin,
  canManageForgeAIAlerts
}) {
  const { actor } = useActor();
  const [configs, setConfigs] = reactExports.useState(buildDefaultConfigs);
  const [loadError, setLoadError] = reactExports.useState(false);
  const ocidPrefix = companyType === "Distributor" ? "distributor_admin.forgeai" : "reseller_admin.forgeai";
  const loadSettings = reactExports.useCallback(async () => {
    var _a;
    if (!actor) return;
    try {
      const settings = await actor.getOrgForgeAIAlertSettings(orgId);
      if (settings.alertConfigs.length > 0) {
        const mapped = buildDefaultConfigs();
        for (const cfg of settings.alertConfigs) {
          const key = (_a = Object.entries(ALERT_TYPE_MAP).find(
            ([, v]) => v === cfg.alertType
          )) == null ? void 0 : _a[0];
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
  reactExports.useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  const handleSave = reactExports.useCallback(
    async (alertKey) => {
      if (!actor) {
        ue.error("Unable to save: actor not available.");
        return;
      }
      try {
        const backendCfg = mapLocalConfigToBackend(alertKey, configs[alertKey]);
        const result = await actor.updateForgeAIAlertConfig(orgId, backendCfg);
        if (result.__kind__ === "ok") {
          ue.success(`${ALERT_META[alertKey].label} configuration saved.`);
          setConfigs((prev) => ({
            ...prev,
            [alertKey]: { ...prev[alertKey], saved: true }
          }));
        } else {
          ue.error(`Save failed: ${result.err}`);
        }
      } catch {
        ue.error("An error occurred while saving.");
      }
    },
    [actor, configs, orgId]
  );
  function handleChange(key, patch) {
    setConfigs((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }
  const hasAccess = isPrimaryAdmin || canManageForgeAIAlerts;
  if (!hasAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 py-16 px-8 rounded-xl text-center",
        style: {
          background: "rgba(30,41,59,0.6)",
          border: "1px solid rgba(249,115,22,0.15)"
        },
        "data-ocid": `${ocidPrefix}.access_restricted`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-14 h-14 rounded-2xl flex items-center justify-center",
              style: {
                background: "rgba(249,115,22,0.08)",
                border: "1.5px solid rgba(249,115,22,0.3)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-6 h-6", style: { color: "#F97316" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Access Restricted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground max-w-sm leading-relaxed", children: [
              "ForgeAI alert configuration requires Primary Admin access or the",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "ForgeAI Alerts Management" }),
              " ",
              "permission."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Contact your Primary Admin to request access." })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-6",
      "data-ocid": `${ocidPrefix}.config.panel`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5", style: { color: "#F97316" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold font-display text-foreground", children: "ForgeAI Alert Delivery Configuration" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed max-w-2xl", children: "Configure how and when ForgeAI intelligence alerts are delivered to your organisation. Set recipient roles, delivery channels, frequency, minimum risk threshold, and escalation recipients per alert type." })
            ] }),
            !isPrimaryAdmin && canManageForgeAIAlerts && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold flex-shrink-0",
                style: {
                  background: "rgba(100,140,220,0.1)",
                  border: "1px solid rgba(100,140,220,0.25)",
                  color: "#8AABDC"
                },
                "data-ocid": `${ocidPrefix}.delegated_access_badge`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
                  "Delegated Access"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2 rounded-lg px-4 py-3",
              style: {
                background: "rgba(249,115,22,0.05)",
                border: "1px solid rgba(249,115,22,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Info,
                  {
                    className: "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                    style: { color: "#F97316" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground leading-relaxed", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F97316" }, className: "font-semibold", children: "In-app notifications only." }),
                  " ",
                  "All ForgeAI alerts are delivered in-app. Email notifications are not available on the current plan. Alerts are scoped to your",
                  " ",
                  companyType,
                  " workspace — no cross-workspace data is exposed."
                ] })
              ]
            }
          ),
          loadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 rounded-lg px-4 py-2.5",
              style: {
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)"
              },
              "data-ocid": `${ocidPrefix}.load_error`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5 text-red-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-400", children: "Could not load saved settings from backend. Showing defaults." })
              ]
            }
          )
        ] }),
        isPrimaryAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(SecondaryAdminPermissionsPanel, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: ALERT_TYPE_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertCard,
          {
            alertKey: key,
            config: configs[key],
            onChange: handleChange,
            onSave: handleSave,
            ocidPrefix,
            companyType
          },
          key
        )) })
      ]
    }
  );
}
function buildRules(companyType) {
  return [
    {
      id: "renewalRiskAlerts",
      name: "Renewal Risk Alerts",
      description: "Alerts when account renewal risk score increases significantly.",
      value: true,
      lockStatus: "editable"
    },
    {
      id: "resellerEngagementGapAlerts",
      name: "Reseller Engagement Gap Alerts",
      description: "Notifies when a reseller has not engaged within the configured threshold.",
      value: true,
      lockStatus: "editable"
    },
    {
      id: "distributorEngagementGapAlerts",
      name: "Distributor Engagement Gap Alerts",
      description: "Notifies when a distributor has not engaged within the configured threshold.",
      value: true,
      lockStatus: companyType === "Reseller" ? "lockedByDistributor" : "editable",
      lockSource: companyType === "Reseller" ? "Distributor" : void 0,
      enforcedBy: companyType === "Reseller" ? "Distributor" : void 0
    },
    {
      id: "dealRegistrationWarnings",
      name: "Deal Registration Warnings",
      description: "Alerts for stalled, duplicate, or expired deal registrations.",
      value: true,
      lockStatus: "lockedByVendor",
      lockSource: "Vendor",
      enforcedBy: "Vendor"
    },
    {
      id: "stalledApprovalAlerts",
      name: "Stalled Approval Alerts",
      description: "Alerts when a deal or business plan approval has been pending too long.",
      value: false,
      lockStatus: "editable"
    },
    {
      id: "accountRiskAlerts",
      name: "Account Risk Alerts",
      description: "AI-generated alerts when an account is flagged as at-risk.",
      value: true,
      lockStatus: "inheritedFromVendor",
      lockSource: "Vendor"
    },
    {
      id: "businessPlanInactivityAlerts",
      name: "Business Plan Inactivity Alerts",
      description: "Notifies when a business plan has no recorded activity.",
      value: true,
      lockStatus: "editable"
    },
    {
      id: "pipelineHealthAlerts",
      name: "Pipeline Health Alerts",
      description: "Periodic alerts summarising pipeline health across your organisation.",
      value: false,
      lockStatus: "editable"
    },
    {
      id: "channelHealthScoreChanges",
      name: "Channel Health Score Changes",
      description: "Alerts when a channel health score changes by more than the configured threshold.",
      value: true,
      lockStatus: "editable"
    },
    {
      id: "messagingNotifications",
      name: "Messaging Notifications",
      description: "In-app notifications for new direct messages and group threads.",
      value: true,
      lockStatus: "editable"
    },
    {
      id: "securityAlerts",
      name: "MFA & Security Alerts",
      description: "Alerts for failed logins, MFA changes, and account lockouts. Enforced for compliance.",
      value: true,
      lockStatus: "lockedByVendor",
      lockSource: "Vendor",
      enforcedBy: "Vendor"
    }
  ];
}
function LockBadge({ rule }) {
  const { lockStatus } = rule;
  if (lockStatus === "editable") return null;
  const configs = {
    lockedByVendor: {
      label: "Locked by Vendor",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }),
      style: {
        background: "rgba(249,115,22,0.12)",
        color: "#F97316",
        border: "1px solid rgba(249,115,22,0.3)",
        boxShadow: "0 0 6px rgba(249,115,22,0.18)"
      }
    },
    lockedByDistributor: {
      label: "Locked by Distributor",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }),
      style: {
        background: "rgba(234,179,8,0.12)",
        color: "#CA8A04",
        border: "1px solid rgba(234,179,8,0.3)"
      }
    },
    inheritedFromVendor: {
      label: "Inherited from Vendor",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
      style: {
        background: "rgba(100,140,220,0.1)",
        color: "#8AABDC",
        border: "1px solid rgba(100,140,220,0.25)"
      }
    },
    inheritedFromDistributor: {
      label: "Inherited from Distributor",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
      style: {
        background: "rgba(100,140,220,0.1)",
        color: "#8AABDC",
        border: "1px solid rgba(100,140,220,0.25)"
      }
    }
  };
  const config = configs[lockStatus];
  if (!config) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
      style: config.style,
      children: [
        config.icon,
        config.label
      ]
    }
  );
}
function ValueBadge({ value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "text-[10px] font-semibold px-2 py-0.5 rounded-full",
      style: value ? {
        background: "rgba(34,197,94,0.12)",
        color: "#4ADE80",
        border: "1px solid rgba(34,197,94,0.2)"
      } : {
        background: "rgba(100,116,139,0.15)",
        color: "#94a3b8",
        border: "1px solid rgba(100,116,139,0.2)"
      },
      children: value ? "On" : "Off"
    }
  );
}
function UnlockStatusBadge({ status }) {
  const map = {
    Pending: {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
      label: "Pending Unlock Request",
      style: {
        background: "rgba(234,179,8,0.12)",
        color: "#CA8A04",
        border: "1px solid rgba(234,179,8,0.3)"
      }
    },
    Approved: {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
      label: "Unlock Approved",
      style: {
        background: "rgba(34,197,94,0.1)",
        color: "#4ADE80",
        border: "1px solid rgba(34,197,94,0.2)"
      }
    },
    Declined: {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
      label: "Unlock Declined",
      style: {
        background: "rgba(239,68,68,0.1)",
        color: "#F87171",
        border: "1px solid rgba(239,68,68,0.2)"
      }
    }
  };
  const cfg = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
      style: cfg.style,
      children: [
        cfg.icon,
        cfg.label
      ]
    }
  );
}
function Toggle({
  checked,
  onChange,
  disabled,
  ruleId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": checked,
      disabled,
      onClick: !disabled ? onChange : void 0,
      "data-ocid": `notifications.toggle.${ruleId}`,
      className: `relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`,
      style: checked && !disabled ? { background: "#F97316", outlineColor: "#F97316" } : { background: "rgba(100,116,139,0.4)" },
      "aria-label": `Toggle ${ruleId}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0.5"} translate-y-0.5`,
          style: { background: disabled ? "#4b5563" : "#fff" }
        }
      )
    }
  );
}
function RequestUnlockModal({
  rule,
  companyType,
  onClose,
  onSubmit
}) {
  const [reason, setReason] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState(false);
  const routedTo = rule.enforcedBy === "Vendor" ? "Vendor Admin" : rule.enforcedBy === "Distributor" ? "Distributor Admin" : rule.lockSource === "Vendor" ? "Vendor Admin" : "Distributor Admin";
  const lockedByLabel = rule.lockStatus === "lockedByVendor" ? "This rule is locked by Vendor Admin" : rule.lockStatus === "lockedByDistributor" ? "This rule is locked by Distributor Admin" : `This rule is enforced by ${rule.lockSource} Admin`;
  const hierarchyNote = companyType === "Reseller" && rule.enforcedBy === "Vendor" ? "This rule is enforced at Vendor level. Your request will be routed to the Vendor Admin, bypassing the Distributor." : null;
  function handleSubmit(e) {
    e.preventDefault();
    if (reason.trim().length < 20) return;
    onSubmit(rule.id, reason.trim());
    setSubmitted(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(10,18,30,0.82)" },
      "data-ocid": `notifications.unlock_modal.${rule.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative w-full max-w-md rounded-2xl flex flex-col gap-5 p-6",
          style: {
            background: "#0F172A",
            border: "1.5px solid rgba(249,115,22,0.22)",
            boxShadow: "0 0 48px rgba(249,115,22,0.1), 0 8px 40px rgba(0,0,0,0.6)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h3",
                  {
                    className: "text-base font-bold font-display",
                    style: { color: "#E2E8F0" },
                    children: "Request Unlock"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: { color: "#F97316" }, children: rule.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": "Close",
                  "data-ocid": `notifications.unlock_modal.${rule.id}.close_button`,
                  className: "flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors",
                  children: "✕"
                }
              )
            ] }),
            submitted ? (
              /* ── Success state ── */
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 py-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-full flex items-center justify-center",
                    style: {
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.25)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-6 h-6", style: { color: "#4ADE80" } })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: { color: "#E2E8F0" }, children: "Unlock request sent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Status:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#CA8A04" }, className: "font-semibold", children: "Pending" }),
                    ". Your request has been routed to ",
                    routedTo,
                    " and logged in the audit history."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "border-border text-xs mt-1",
                    onClick: onClose,
                    "data-ocid": `notifications.unlock_modal.${rule.id}.close_button`,
                    children: "Close"
                  }
                )
              ] })
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-xl px-4 py-3 flex flex-col gap-1.5",
                  style: {
                    background: "rgba(249,115,22,0.06)",
                    border: "1px solid rgba(249,115,22,0.18)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Lock,
                        {
                          className: "w-3.5 h-3.5 flex-shrink-0",
                          style: { color: "#F97316" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-semibold",
                          style: { color: "#F97316" },
                          children: lockedByLabel
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground pl-5", children: [
                      "Request will be routed to:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", style: { color: "#E2E8F0" }, children: routedTo })
                    ] }),
                    hierarchyNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-5 flex items-start gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TriangleAlert,
                        {
                          className: "w-3 h-3 mt-0.5 flex-shrink-0",
                          style: { color: "#CA8A04" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: { color: "#CA8A04" }, children: hierarchyNote })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      htmlFor: `unlock-reason-${rule.id}`,
                      className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                      children: [
                        "Reason for unlock request",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#F97316" }, children: "*" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      id: `unlock-reason-${rule.id}`,
                      value: reason,
                      onChange: (e) => setReason(e.target.value),
                      rows: 4,
                      placeholder: "Describe why you need this rule unlocked (min. 20 characters)…",
                      required: true,
                      "data-ocid": `notifications.unlock_modal.${rule.id}.reason.textarea`,
                      className: "w-full rounded-xl px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 transition-all",
                      style: {
                        background: "rgba(30,41,59,0.8)",
                        border: reason.length > 0 && reason.trim().length < 20 ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(100,116,139,0.3)"
                      }
                    }
                  ),
                  reason.length > 0 && reason.trim().length < 20 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: { color: "#F87171" }, children: "Please enter at least 20 characters." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "border-border text-xs",
                      onClick: onClose,
                      "data-ocid": `notifications.unlock_modal.${rule.id}.cancel_button`,
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      size: "sm",
                      disabled: reason.trim().length < 20,
                      "data-ocid": `notifications.unlock_modal.${rule.id}.submit_button`,
                      style: {
                        background: reason.trim().length >= 20 ? "#F97316" : void 0
                      },
                      className: "text-white text-xs",
                      children: "Send Unlock Request"
                    }
                  )
                ] })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function RuleRow({
  rule,
  companyType: _companyType,
  isPrimaryAdmin,
  unlockRequest,
  onToggle,
  onRequestUnlock
}) {
  const isLocked = rule.lockStatus === "lockedByVendor" || rule.lockStatus === "lockedByDistributor";
  const isEditable = rule.lockStatus === "editable" && isPrimaryAdmin;
  const leftBorderColor = rule.lockStatus === "lockedByVendor" ? "rgba(249,115,22,0.5)" : rule.lockStatus === "lockedByDistributor" ? "rgba(234,179,8,0.5)" : "transparent";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl px-4 py-3.5 flex items-center justify-between gap-3",
      style: {
        background: "#1E293B",
        border: "1px solid rgba(100,116,139,0.18)",
        borderLeft: isLocked ? `3px solid ${leftBorderColor}` : "1px solid rgba(100,116,139,0.18)"
      },
      "data-ocid": `notifications.rule.${rule.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: rule.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LockBadge, { rule }),
            unlockRequest && /* @__PURE__ */ jsxRuntimeExports.jsx(UnlockStatusBadge, { status: unlockRequest.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-snug", children: rule.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ValueBadge, { value: rule.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: rule.value,
              onChange: () => onToggle(rule.id),
              disabled: !isEditable,
              ruleId: rule.id
            }
          ),
          isLocked && !unlockRequest && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "h-7 text-[11px] gap-1 border-border",
              style: {
                borderColor: "rgba(249,115,22,0.35)",
                color: "#F97316"
              },
              onClick: () => onRequestUnlock(rule),
              "data-ocid": `notifications.rule.${rule.id}.request_unlock_button`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }),
                "Request Unlock"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function Legend() {
  const items = [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3", style: { color: "#F97316" } }),
      label: "Locked by Vendor",
      style: {
        background: "rgba(249,115,22,0.1)",
        color: "#F97316",
        border: "1px solid rgba(249,115,22,0.25)"
      }
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3", style: { color: "#CA8A04" } }),
      label: "Locked by Distributor",
      style: {
        background: "rgba(234,179,8,0.1)",
        color: "#CA8A04",
        border: "1px solid rgba(234,179,8,0.25)"
      }
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3", style: { color: "#8AABDC" } }),
      label: "Inherited (read-only default)",
      style: {
        background: "rgba(100,140,220,0.08)",
        color: "#8AABDC",
        border: "1px solid rgba(100,140,220,0.2)"
      }
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3", style: { color: "#CA8A04" } }),
      label: "Pending Unlock Request",
      style: {
        background: "rgba(234,179,8,0.08)",
        color: "#CA8A04",
        border: "1px solid rgba(234,179,8,0.2)"
      }
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl px-4 py-3 flex flex-wrap gap-3",
      style: {
        background: "rgba(15,23,42,0.7)",
        border: "1px solid rgba(100,116,139,0.18)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide self-center", children: "Legend:" }),
        items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full",
            style: item.style,
            children: [
              item.icon,
              item.label
            ]
          },
          item.label
        ))
      ]
    }
  );
}
function NotificationRulesConfig({
  companyType,
  orgId: _orgId,
  isPrimaryAdmin
}) {
  const [rules, setRules] = reactExports.useState(
    () => buildRules(companyType)
  );
  const [unlockRequests, setUnlockRequests] = reactExports.useState({});
  const [activeModal, setActiveModal] = reactExports.useState(null);
  function handleToggle(id) {
    setRules(
      (prev) => prev.map((r) => r.id === id ? { ...r, value: !r.value } : r)
    );
  }
  function handleRequestUnlock(rule) {
    setActiveModal(rule);
  }
  function handleSubmitUnlock(ruleId, reason) {
    setUnlockRequests((prev) => ({
      ...prev,
      [ruleId]: { status: "Pending", submittedAt: /* @__PURE__ */ new Date(), reason }
    }));
  }
  const prefix = companyType === "Distributor" ? "distributor" : "reseller";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-5",
      "data-ocid": `${prefix}_admin.notifications.rules_config`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold font-display text-foreground", children: "Notification Rules" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed max-w-2xl", children: [
            "Configure which notifications your organisation receives. Rules enforced by your",
            " ",
            companyType === "Reseller" ? "Vendor or Distributor" : "Vendor",
            " are shown with lock indicators. You can request unlock through the built-in request flow."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: rules.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          RuleRow,
          {
            rule,
            companyType,
            isPrimaryAdmin,
            unlockRequest: unlockRequests[rule.id],
            onToggle: handleToggle,
            onRequestUnlock: handleRequestUnlock
          },
          rule.id
        )) }),
        activeModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          RequestUnlockModal,
          {
            rule: activeModal,
            companyType,
            onClose: () => setActiveModal(null),
            onSubmit: (id, reason) => {
              handleSubmitUnlock(id, reason);
            }
          }
        )
      ]
    }
  );
}
export {
  ForgeAIAlertConfig as F,
  NotificationRulesConfig as N
};
