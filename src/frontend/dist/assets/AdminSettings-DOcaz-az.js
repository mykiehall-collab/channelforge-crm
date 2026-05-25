import { c as createLucideIcon, p as useActor, r as reactExports, ab as ue, j as jsxRuntimeExports, af as formatDate, aM as CustomerIdNumberSequencing, L as Lock, aF as Label, aN as Info, H as Shield, ad as Input, az as Copy, X, a8 as Plus, m as Button, a6 as RefreshCw, ar as Save, ac as ChevronUp, k as ChevronDown, au as Eye, aO as EyeOff, aC as Trash2, u as useApp, q as UserRole, B as Building2, U as Users, $ as Network, aP as Bot, a7 as Upload, a as useNavigate, aj as getInitials, aQ as ActivationStatus, J as CircleCheck, aa as CircleX, E as ExternalLink, aR as useTheme, aS as Moon, aT as Sun, aG as ExternalBlob, aU as useGapNotificationConfig, a0 as Bell } from "./index-DvFvlUBj.js";
import { P as Palette, C as CustomFieldManager, D as DepartmentAllocation } from "./CustomFieldManager-CEOFGm2c.js";
import { S as Settings2, A as AIProviderSettings } from "./AIProviderSettings-oVXdXmwz.js";
import { C as Checkbox } from "./checkbox-Cr6u9Lap.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CJsIFtIC.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { S as Switch } from "./switch-7D4xT4MC.js";
import { S as ShieldAlert } from "./shield-alert-BCLvkGRD.js";
import { u as useForgeAI } from "./useForgeAI-CFLYJlF1.js";
import { S as ShieldCheck } from "./shield-check-Bs1OSg8Z.js";
import { C as ClipboardList } from "./clipboard-list-BvyAGRk8.js";
import { S as ShieldOff } from "./shield-off-2d9YhE28.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
import { U as UserPlus } from "./user-plus-C0nBhDAj.js";
import { M as Mail } from "./mail-BpQyu_iW.js";
import "./share-2-BFP_6Fru.js";
import "./textarea-BHUaDciu.js";
import "./useMutation-D0Tr8pyU.js";
import "./archive-R3lqk_IO.js";
import "./minus-OwCcNK6_.js";
import "./activity-BzA2r-7b.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
import "./index-D-5r5K-M.js";
import "./backend.d-Bio-_uWv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
];
const Hash = createLucideIcon("hash", __iconNode);
const ORANGE = "#FF6B2B";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const TEXT_SOFT = "#A9B6C9";
const AUTH_TABS = [
  { id: "password", label: "Password" },
  { id: "mfa", label: "MFA" },
  { id: "security", label: "Security" },
  { id: "sso", label: "SSO" }
];
function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  dataOcid
}) {
  const toggleId = `sw-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", "data-ocid": dataOcid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        id: toggleId,
        role: "switch",
        "aria-checked": checked,
        onClick: () => {
          if (!disabled) onChange(!checked);
        },
        onKeyDown: (e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            onChange(!checked);
          }
        },
        className: "relative w-10 h-5 rounded-full transition-all flex-shrink-0",
        style: {
          background: checked ? ORANGE : "rgba(255,255,255,0.1)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          border: "none"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0.5 w-4 h-4 rounded-full transition-all",
            style: {
              left: checked ? "calc(100% - 18px)" : "2px",
              background: "white"
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor: toggleId,
        className: "text-sm cursor-pointer",
        style: { color: TEXT_SOFT },
        children: label
      }
    )
  ] });
}
function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
  dataOcid
}) {
  const numId = `ni-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor: numId,
        className: "block text-[12px] font-semibold mb-1 uppercase tracking-[0.06em]",
        style: { color: TEXT_MUTED },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id: numId,
        type: "number",
        min,
        max,
        value,
        onChange: (e) => onChange(Math.min(max, Math.max(min, Number(e.target.value)))),
        disabled,
        "data-ocid": dataOcid,
        className: "w-32 rounded-lg px-3 py-2 text-sm outline-none transition-all",
        style: {
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${BORDER}`,
          color: "#E7EEF8"
        },
        onFocus: (e) => {
          e.currentTarget.style.borderColor = "rgba(255,107,43,0.5)";
        },
        onBlur: (e) => {
          e.currentTarget.style.borderColor = BORDER;
        }
      }
    )
  ] });
}
const DEFAULT_AUTH_SETTINGS = {
  orgId: "",
  passwordLoginEnabled: true,
  passwordMinLength: BigInt(8),
  passwordMaxLength: BigInt(128),
  passwordExpiryDays: BigInt(0),
  passwordReusePreventCount: BigInt(5),
  passwordComplexityRequired: true,
  mfaEnabled: false,
  mfaRequiredForAll: false,
  mfaRequiredForAdmins: false,
  mfaOptionalEnrollment: true,
  mfaGracePeriodDays: BigInt(7),
  lockoutEnabled: true,
  maxFailedAttempts: BigInt(5),
  lockoutDurationMinutes: BigInt(30),
  permanentLockUntilReset: false,
  sessionTimeoutMinutes: BigInt(480),
  ssoEnabled: false,
  internetIdentityEnabled: true
};
function AuthSettingsSection({ orgId }) {
  const { actor } = useActor();
  const [tab, setTab] = reactExports.useState("password");
  const [settings, setSettings] = reactExports.useState(DEFAULT_AUTH_SETTINGS);
  const [saving, setSaving] = reactExports.useState(false);
  const [lockedAccounts, setLockedAccounts] = reactExports.useState([]);
  const [loginHistory, setLoginHistory] = reactExports.useState([]);
  const [showHistory, setShowHistory] = reactExports.useState(false);
  const [loadingLocked, setLoadingLocked] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor || !orgId) return;
    actor.getAuthSettings(orgId).then((s) => setSettings(s)).catch(() => {
    });
  }, [actor, orgId]);
  reactExports.useEffect(() => {
    if (!actor || !orgId || tab !== "security") return;
    setLoadingLocked(true);
    actor.getLockedAccounts(orgId).then(setLockedAccounts).catch(() => {
    }).finally(() => setLoadingLocked(false));
  }, [actor, orgId, tab]);
  const updateSettings = reactExports.useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);
  const handleSave = reactExports.useCallback(async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.updateAuthSettings(orgId, settings);
      if (result.__kind__ === "ok") {
        ue.success("Authentication settings saved.");
      } else {
        ue.error("Failed to save settings.");
      }
    } catch {
      ue.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }, [actor, orgId, settings]);
  const handleUnlock = reactExports.useCallback(
    async (userId) => {
      if (!actor) return;
      try {
        const result = await actor.unlockUserAccount(
          userId,
          "Admin manual unlock"
        );
        if (result.__kind__ === "ok") {
          setLockedAccounts((prev) => prev.filter((a) => a.userId !== userId));
          ue.success("Account unlocked.");
        } else {
          ue.error("Could not unlock account.");
        }
      } catch {
        ue.error("Unlock failed.");
      }
    },
    [actor]
  );
  const handleLoadHistory = reactExports.useCallback(
    async (userId) => {
      if (!actor) return;
      try {
        const events = await actor.getFailedLoginHistory(userId, BigInt(20));
        setLoginHistory(events);
        setShowHistory(true);
      } catch {
      }
    },
    [actor]
  );
  const saveBtnStyle = {
    background: saving ? "rgba(255,107,43,0.5)" : `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
    color: "white",
    padding: "8px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    border: "none",
    cursor: saving ? "not-allowed" : "pointer"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 p-1 mb-6 rounded-xl",
        style: { background: "rgba(255,255,255,0.04)" },
        children: AUTH_TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setTab(t.id),
            "data-ocid": `auth_settings.${t.id}.tab`,
            className: "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
            style: {
              background: tab === t.id ? ORANGE : "transparent",
              color: tab === t.id ? "white" : TEXT_MUTED
            },
            children: t.label
          },
          t.id
        ))
      }
    ),
    tab === "password" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleSwitch,
        {
          checked: settings.passwordLoginEnabled,
          onChange: (v) => updateSettings({ passwordLoginEnabled: v }),
          label: "Enable password login",
          dataOcid: "auth_settings.password_login.toggle"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            label: "Min password length",
            value: Number(settings.passwordMinLength),
            onChange: (v) => updateSettings({ passwordMinLength: BigInt(v) }),
            min: 8,
            max: 32,
            dataOcid: "auth_settings.min_length.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            label: "Max password length",
            value: Number(settings.passwordMaxLength),
            onChange: (v) => updateSettings({ passwordMaxLength: BigInt(v) }),
            min: 8,
            max: 128,
            dataOcid: "auth_settings.max_length.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 flex-wrap items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            label: "Password expiry (days, 0 = disabled)",
            value: Number(settings.passwordExpiryDays),
            onChange: (v) => updateSettings({ passwordExpiryDays: BigInt(v) }),
            min: 0,
            max: 365,
            dataOcid: "auth_settings.expiry_days.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            label: "Prevent reuse (last N passwords)",
            value: Number(settings.passwordReusePreventCount),
            onChange: (v) => updateSettings({ passwordReusePreventCount: BigInt(v) }),
            min: 3,
            max: 12,
            dataOcid: "auth_settings.reuse_count.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleSwitch,
        {
          checked: settings.passwordComplexityRequired,
          onChange: (v) => updateSettings({ passwordComplexityRequired: v }),
          label: "Require uppercase, lowercase, number, and symbol",
          dataOcid: "auth_settings.complexity.toggle"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleSave,
          disabled: saving,
          style: saveBtnStyle,
          "data-ocid": "auth_settings.password.save_button",
          children: saving ? "Saving…" : "Save Password Settings"
        }
      ) })
    ] }),
    tab === "mfa" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleSwitch,
        {
          checked: settings.mfaEnabled,
          onChange: (v) => updateSettings({ mfaEnabled: v }),
          label: "Enable MFA for organization",
          dataOcid: "auth_settings.mfa_enabled.toggle"
        }
      ),
      settings.mfaEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleSwitch,
          {
            checked: settings.mfaRequiredForAll,
            onChange: (v) => updateSettings({ mfaRequiredForAll: v }),
            label: "Require MFA for all users",
            dataOcid: "auth_settings.mfa_all.toggle"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleSwitch,
          {
            checked: settings.mfaRequiredForAdmins,
            onChange: (v) => updateSettings({ mfaRequiredForAdmins: v }),
            label: "Require MFA for admins only",
            dataOcid: "auth_settings.mfa_admins.toggle"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleSwitch,
          {
            checked: settings.mfaOptionalEnrollment,
            onChange: (v) => updateSettings({ mfaOptionalEnrollment: v }),
            label: "Allow optional MFA enrollment",
            dataOcid: "auth_settings.mfa_optional.toggle"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            label: "Grace period before MFA required (days)",
            value: Number(settings.mfaGracePeriodDays),
            onChange: (v) => updateSettings({ mfaGracePeriodDays: BigInt(v) }),
            min: 0,
            max: 30,
            dataOcid: "auth_settings.mfa_grace.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleSave,
          disabled: saving,
          style: saveBtnStyle,
          "data-ocid": "auth_settings.mfa.save_button",
          children: saving ? "Saving…" : "Save MFA Settings"
        }
      ) })
    ] }),
    tab === "security" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleSwitch,
        {
          checked: settings.lockoutEnabled,
          onChange: (v) => updateSettings({ lockoutEnabled: v }),
          label: "Enable account lockout",
          dataOcid: "auth_settings.lockout_enabled.toggle"
        }
      ),
      settings.lockoutEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            label: "Max failed attempts",
            value: Number(settings.maxFailedAttempts),
            onChange: (v) => updateSettings({ maxFailedAttempts: BigInt(v) }),
            min: 3,
            max: 15,
            dataOcid: "auth_settings.max_attempts.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumberInput,
          {
            label: "Lockout duration (minutes)",
            value: Number(settings.lockoutDurationMinutes),
            onChange: (v) => updateSettings({ lockoutDurationMinutes: BigInt(v) }),
            min: 5,
            max: 1440,
            dataOcid: "auth_settings.lockout_duration.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleSwitch,
        {
          checked: settings.permanentLockUntilReset,
          onChange: (v) => updateSettings({ permanentLockUntilReset: v }),
          label: "Permanent lock until admin reset",
          dataOcid: "auth_settings.permanent_lock.toggle"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NumberInput,
        {
          label: "Session timeout (minutes)",
          value: Number(settings.sessionTimeoutMinutes),
          onChange: (v) => updateSettings({ sessionTimeoutMinutes: BigInt(v) }),
          min: 30,
          max: 1440,
          dataOcid: "auth_settings.session_timeout.input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleSave,
          disabled: saving,
          style: saveBtnStyle,
          "data-ocid": "auth_settings.security.save_button",
          children: saving ? "Saving…" : "Save Security Settings"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold mb-3", style: { color: "#E7EEF8" }, children: "Locked Accounts" }),
        loadingLocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 text-sm",
            style: { color: TEXT_MUTED },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-4 h-4 border-2 border-t-transparent rounded-full animate-spin",
                  style: {
                    borderColor: `${ORANGE} transparent transparent transparent`
                  }
                }
              ),
              "Loading…"
            ]
          }
        ) : lockedAccounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: TEXT_MUTED }, children: "No locked accounts." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "overflow-x-auto rounded-xl",
            style: { border: `1px solid ${BORDER}` },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "table",
              {
                className: "w-full text-sm",
                "data-ocid": "auth_settings.locked_accounts.table",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "tr",
                    {
                      style: {
                        background: "rgba(255,255,255,0.03)",
                        borderBottom: `1px solid ${BORDER}`
                      },
                      children: [
                        "Email",
                        "Name",
                        "Locked At",
                        "Locked Until",
                        "Fails",
                        ""
                      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "th",
                        {
                          className: "text-left px-4 py-2.5 text-[11px] uppercase tracking-wide",
                          style: { color: TEXT_MUTED },
                          children: h
                        },
                        h
                      ))
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: lockedAccounts.map((a, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      "data-ocid": `auth_settings.locked_account.${idx + 1}`,
                      onClick: () => handleLoadHistory(a.userId),
                      onKeyDown: (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleLoadHistory(a.userId);
                        }
                      },
                      title: "Click to view failed login history",
                      style: {
                        borderBottom: "1px solid rgba(30,48,80,0.4)",
                        cursor: "pointer"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", style: { color: "#E7EEF8" }, children: a.email }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", style: { color: TEXT_SOFT }, children: a.fullName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: "px-4 py-3 text-xs",
                            style: { color: TEXT_MUTED },
                            children: formatDate(a.lockedAt)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: "px-4 py-3 text-xs",
                            style: { color: TEXT_MUTED },
                            children: formatDate(a.lockedUntil)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", style: { color: ORANGE }, children: String(a.failedCount) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleUnlock(a.userId),
                            "data-ocid": `auth_settings.unlock.${idx + 1}`,
                            className: "text-[12px] font-semibold transition-opacity hover:opacity-80",
                            style: { color: ORANGE },
                            children: "Unlock"
                          }
                        ) })
                      ]
                    },
                    a.userId
                  )) })
                ]
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowHistory((v) => !v),
            "data-ocid": "auth_settings.history.toggle",
            className: "text-sm font-semibold transition-opacity hover:opacity-80",
            style: { color: ORANGE },
            children: [
              showHistory ? "▲ Hide" : "▼ Show",
              " Failed Login History"
            ]
          }
        ),
        showHistory && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
          loginHistory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: TEXT_MUTED }, children: "Click a locked account above to view failed login history." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "overflow-x-auto rounded-xl",
              style: { border: `1px solid ${BORDER}` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "tr",
                  {
                    style: {
                      background: "rgba(255,255,255,0.03)",
                      borderBottom: `1px solid ${BORDER}`
                    },
                    children: ["Time", "Email", "Attempts", "Reason"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "th",
                      {
                        className: "text-left px-4 py-2.5 text-[11px] uppercase tracking-wide",
                        style: { color: TEXT_MUTED },
                        children: h
                      },
                      h
                    ))
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loginHistory.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    style: {
                      borderBottom: "1px solid rgba(30,48,80,0.4)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "px-4 py-2.5 text-xs",
                          style: { color: TEXT_MUTED },
                          children: formatDate(ev.timestamp)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "px-4 py-2.5",
                          style: { color: TEXT_SOFT },
                          children: ev.email
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "px-4 py-2.5",
                          style: { color: ORANGE },
                          children: String(ev.attemptCount)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "px-4 py-2.5 text-xs",
                          style: { color: TEXT_MUTED },
                          children: ev.reason
                        }
                      )
                    ]
                  },
                  ev.id
                )) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] mt-2", style: { color: TEXT_MUTED }, children: "Click a locked account above to view failed login history." })
        ] })
      ] })
    ] }),
    tab === "sso" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl p-4",
          style: {
            background: "rgba(255,107,43,0.07)",
            border: "1px solid rgba(255,107,43,0.2)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold mb-1", style: { color: ORANGE }, children: "Enterprise SSO Coming Soon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: { color: TEXT_MUTED }, children: "Advanced SSO provider setup will be available in a future enterprise authentication update." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleSwitch,
        {
          checked: settings.internetIdentityEnabled,
          onChange: (v) => updateSettings({ internetIdentityEnabled: v }),
          label: "Enable Internet Identity login",
          dataOcid: "auth_settings.ii_enabled.toggle"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleSwitch,
        {
          checked: settings.ssoEnabled,
          onChange: (v) => updateSettings({ ssoEnabled: v }),
          label: "Enable SSO (future providers)",
          disabled: true,
          dataOcid: "auth_settings.sso_enabled.toggle"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { disabled: true, className: "flex flex-col gap-4 opacity-40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "sso-provider-sel",
              className: "block text-[12px] font-semibold mb-1 uppercase tracking-[0.06em]",
              style: { color: TEXT_MUTED },
              children: "Provider Type"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "sso-provider-sel",
              className: "w-full rounded-lg px-3 py-2 text-sm",
              style: {
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${BORDER}`,
                color: TEXT_SOFT
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Select provider…" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Okta" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Azure AD / Microsoft Entra ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Google Workspace" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "SAML 2.0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "OpenID Connect" })
              ]
            }
          )
        ] }),
        [
          "Client ID",
          "Client Secret",
          "Issuer URL",
          "Metadata URL",
          "Callback URL"
        ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: `sso-fld-${field}`,
              className: "block text-[12px] font-semibold mb-1 uppercase tracking-[0.06em]",
              style: { color: TEXT_MUTED },
              children: field
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: `sso-fld-${field}`,
              type: "text",
              placeholder: `Enter ${field}…`,
              className: "w-full rounded-lg px-3 py-2 text-sm",
              style: {
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${BORDER}`,
                color: TEXT_SOFT
              }
            }
          )
        ] }, field))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleSave,
          disabled: saving,
          style: saveBtnStyle,
          "data-ocid": "auth_settings.sso.save_button",
          children: saving ? "Saving…" : "Save SSO Settings"
        }
      ) })
    ] })
  ] });
}
const TOKEN_BUTTONS = [
  { label: "+ Prefix", token: "{PREFIX}", tooltip: "Static prefix e.g. UK" },
  { label: "+ Region", token: "{REGION}", tooltip: "Region code e.g. LON" },
  {
    label: "+ Sequential",
    token: "{SEQUENTIAL}",
    tooltip: "Auto-incrementing number"
  },
  {
    label: "+ Digits:N",
    token: "{DIGITS:4}",
    tooltip: "Fixed-length digit block"
  },
  {
    label: "+ Alpha:N",
    token: "{ALPHANUMERIC:4}",
    tooltip: "Fixed alphanumeric block"
  },
  { label: "+ Custom", token: "{CUSTOM}", tooltip: "Custom segment" }
];
const EXAMPLE_REGIONS = ["LON", "NOR", "MAN", "NYC", "BER"];
const EXAMPLE_NUMBERS = ["000145", "000912", "001033", "002441"];
function generatePreview(pattern, regionRules, prefixRules) {
  const regions = regionRules.length > 0 ? regionRules.slice(0, 3) : EXAMPLE_REGIONS.slice(0, 3);
  return regions.slice(0, 3).map((region, i) => {
    let id = pattern;
    id = id.replace("{PREFIX}", prefixRules || "UK");
    id = id.replace("{REGION}", region);
    id = id.replace("{SEQUENTIAL}", EXAMPLE_NUMBERS[i] ?? "000001");
    id = id.replace(/{DIGITS:\d+}/g, (match) => {
      const n = Number.parseInt(
        match.replace("{DIGITS:", "").replace("}", ""),
        10
      );
      return String(Math.floor(Math.random() * 10 ** n)).padStart(n, "0").slice(0, n);
    });
    id = id.replace(/{ALPHANUMERIC:\d+}/g, (match) => {
      const n = Number.parseInt(
        match.replace("{ALPHANUMERIC:", "").replace("}", ""),
        10
      );
      return "A1B2C3D4".slice(0, n);
    });
    id = id.replace("{CUSTOM}", "X");
    return id;
  });
}
function AuditActionBadge({ action }) {
  const cfg = {
    created: { bg: "rgba(16,185,129,0.12)", color: "#34d399" },
    formatRuleChanged: { bg: "rgba(255,107,43,0.12)", color: "#FF6B2B" },
    duplicateBlocked: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
    manualOverride: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
    mergeResolved: { bg: "rgba(99,102,241,0.12)", color: "#818cf8" },
    updated: { bg: "rgba(100,140,220,0.12)", color: "#648CDC" }
  };
  const c = cfg[action] ?? cfg.updated;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
      style: {
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.color}33`
      },
      children: action.replace(/([A-Z])/g, " $1").trim()
    }
  );
}
function CustomerIdConfig({
  vendorId,
  isVendor = true
}) {
  const { actor } = useActor();
  const [rule, setRule] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [showAudit, setShowAudit] = reactExports.useState(false);
  const [auditEntries, setAuditEntries] = reactExports.useState([]);
  const [auditLoading, setAuditLoading] = reactExports.useState(false);
  const [formatPattern, setFormatPattern] = reactExports.useState(
    "UK-{REGION}-{SEQUENTIAL}"
  );
  const [prefixRules, setPrefixRules] = reactExports.useState("UK");
  const [regionRules, setRegionRules] = reactExports.useState([
    "LON",
    "NOR",
    "MAN"
  ]);
  const [newRegion, setNewRegion] = reactExports.useState("");
  const [numberSequencing, setNumberSequencing] = reactExports.useState(CustomerIdNumberSequencing.sequential);
  const [characterLimit, setCharacterLimit] = reactExports.useState("20");
  const [separators, setSeparators] = reactExports.useState(["-"]);
  const [newSeparator, setNewSeparator] = reactExports.useState("");
  const [autoGenEnabled, setAutoGenEnabled] = reactExports.useState(true);
  const [manualOverride, setManualOverride] = reactExports.useState(false);
  const [dupPreventionEnabled, setDupPreventionEnabled] = reactExports.useState(true);
  const loadRule = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const data = await actor.getCustomerIdFormatRule(vendorId);
      if (data) {
        setRule(data);
        setFormatPattern(data.formatPattern);
        setPrefixRules(data.prefixRules);
        setRegionRules([...data.regionRules]);
        setNumberSequencing(data.numberSequencing);
        setCharacterLimit(data.characterLimit.toString());
        setSeparators([...data.allowedSeparators]);
        setAutoGenEnabled(data.autoGenerationEnabled);
        setManualOverride(data.manualOverridePermitted);
        setDupPreventionEnabled(data.duplicatePreventionEnabled);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [actor, vendorId]);
  reactExports.useEffect(() => {
    loadRule();
  }, [loadRule]);
  async function loadAudit() {
    if (!actor) return;
    setAuditLoading(true);
    try {
      const data = await actor.getCustomerIdAuditLog(vendorId);
      setAuditEntries(data.slice(0, 20));
    } catch {
      setAuditEntries([]);
    } finally {
      setAuditLoading(false);
    }
  }
  async function handleSave() {
    if (!actor) return;
    setSaving(true);
    try {
      const input = {
        formatPattern,
        prefixRules,
        regionRules,
        numberSequencing,
        characterLimit: BigInt(Number.parseInt(characterLimit, 10) || 20),
        allowedSeparators: separators,
        autoGenerationEnabled: autoGenEnabled,
        manualOverridePermitted: manualOverride,
        duplicatePreventionEnabled: dupPreventionEnabled
      };
      await actor.upsertCustomerIdFormatRule(vendorId, input);
      ue.success("Customer ID format rule saved");
      await loadRule();
    } catch {
      ue.error("Failed to save Customer ID format rule");
    } finally {
      setSaving(false);
    }
  }
  function insertToken(token) {
    setFormatPattern((prev) => prev + token);
  }
  function addRegion() {
    const r = newRegion.trim().toUpperCase();
    if (!r || regionRules.includes(r)) return;
    setRegionRules((prev) => [...prev, r]);
    setNewRegion("");
  }
  function removeRegion(r) {
    setRegionRules((prev) => prev.filter((x) => x !== r));
  }
  function addSeparator() {
    const s = newSeparator.trim();
    if (!s || separators.includes(s)) return;
    setSeparators((prev) => [...prev, s]);
    setNewSeparator("");
  }
  function removeSeparator(s) {
    setSeparators((prev) => prev.filter((x) => x !== s));
  }
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => ue.success("Copied"));
  }
  const previews = generatePreview(formatPattern, regionRules, prefixRules);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-secondary/30" }, i)) });
  }
  if (!isVendor) {
    if (!rule) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center py-10 gap-2 text-center",
          "data-ocid": "customer_id_config.no_rule.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 32, className: "text-muted-foreground mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No Customer ID format configured" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Contact your Vendor to configure a Customer ID format standard." })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "customer_id_config.readonly.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 px-4 py-2.5 rounded-lg",
          style: {
            background: "rgba(100,140,220,0.08)",
            border: "1px solid rgba(100,140,220,0.2)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 13, style: { color: "#648CDC" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", style: { color: "#648CDC" }, children: "Inherited from Vendor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-2", children: "— Read-only" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Format Pattern" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-semibold text-foreground mt-1", children: rule.formatPattern })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Example IDs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-1.5", children: previews.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs font-mono px-2.5 py-1 rounded-lg",
              style: {
                background: "rgba(255,107,43,0.1)",
                color: "#FF6B2B",
                border: "1px solid rgba(255,107,43,0.2)"
              },
              children: p
            },
            p
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 12 }),
          "Contact your Vendor to request format changes."
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "customer_id_config.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 14, style: { color: "#FF6B2B" } }),
          "Customer ID Format Governance"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Define the Customer ID standard that all Distributors and Resellers must follow." })
      ] }),
      rule && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-[10px] font-semibold px-2.5 py-1 rounded-full",
          style: {
            background: "rgba(16,185,129,0.12)",
            color: "#34d399",
            border: "1px solid rgba(16,185,129,0.2)"
          },
          children: "Format Active"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Format Pattern" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: formatPattern,
            onChange: (e) => setFormatPattern(e.target.value),
            className: "crm-input font-mono text-sm",
            placeholder: "e.g. UK-{REGION}-{SEQUENTIAL}",
            "data-ocid": "customer_id_config.format_pattern.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Use tokens to define the structure. Insert tokens with the buttons below." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: TOKEN_BUTTONS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => insertToken(t.token),
          title: t.tooltip,
          className: "text-xs px-2.5 py-1 rounded-md transition-colors border font-mono",
          style: {
            background: "rgba(255,107,43,0.08)",
            color: "#FF6B2B",
            borderColor: "rgba(255,107,43,0.2)"
          },
          "data-ocid": `customer_id_config.token.${t.token.replace(/[{}:]/g, "_")}`,
          children: t.label
        },
        t.token
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg p-4 space-y-2",
          style: {
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,107,43,0.15)"
          },
          "data-ocid": "customer_id_config.preview.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-semibold", children: "Live Preview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: previews.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-sm font-mono font-bold",
                  style: { color: "#FF6B2B" },
                  children: p
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => copyToClipboard(p),
                  className: "text-muted-foreground hover:text-foreground transition-colors",
                  "aria-label": "Copy example ID",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 })
                }
              )
            ] }, p)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-foreground uppercase tracking-wide", children: "Format Configuration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Prefix Rules" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: prefixRules,
              onChange: (e) => setPrefixRules(e.target.value),
              placeholder: "e.g. UK, EU, US",
              className: "crm-input",
              "data-ocid": "customer_id_config.prefix_rules.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Static prefix applied to all generated IDs." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Character Limit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "5",
              max: "64",
              value: characterLimit,
              onChange: (e) => setCharacterLimit(e.target.value),
              className: "crm-input",
              "data-ocid": "customer_id_config.character_limit.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Region Rules" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          regionRules.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold",
              style: {
                background: "rgba(100,140,220,0.1)",
                color: "#648CDC",
                border: "1px solid rgba(100,140,220,0.2)"
              },
              children: [
                r,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeRegion(r),
                    className: "text-muted-foreground hover:text-red-400 transition-colors",
                    "aria-label": `Remove region ${r}`,
                    "data-ocid": `customer_id_config.remove_region.${r}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
                  }
                )
              ]
            },
            r
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newRegion,
                onChange: (e) => setNewRegion(e.target.value.toUpperCase().slice(0, 6)),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRegion();
                  }
                },
                placeholder: "ADD",
                className: "crm-input h-7 w-20 text-xs font-mono uppercase",
                "data-ocid": "customer_id_config.new_region.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: addRegion,
                className: "h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
                style: { border: "1px solid rgba(255,255,255,0.1)" },
                "data-ocid": "customer_id_config.add_region.button",
                "aria-label": "Add region",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Allowed Separators" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          separators.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold",
              style: {
                background: "rgba(255,107,43,0.08)",
                color: "#FF6B2B",
                border: "1px solid rgba(255,107,43,0.18)"
              },
              children: [
                '"',
                s,
                '"',
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => removeSeparator(s),
                    className: "text-muted-foreground hover:text-red-400 transition-colors",
                    "aria-label": `Remove separator ${s}`,
                    "data-ocid": `customer_id_config.remove_separator.${s}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
                  }
                )
              ]
            },
            s
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: newSeparator,
                onChange: (e) => setNewSeparator(e.target.value.slice(0, 1)),
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSeparator();
                  }
                },
                placeholder: "-",
                className: "crm-input h-7 w-12 text-xs font-mono text-center",
                maxLength: 1,
                "data-ocid": "customer_id_config.new_separator.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: addSeparator,
                className: "h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
                style: { border: "1px solid rgba(255,255,255,0.1)" },
                "aria-label": "Add separator",
                "data-ocid": "customer_id_config.add_separator.button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Number Sequencing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: [
          {
            value: CustomerIdNumberSequencing.sequential,
            label: "Sequential"
          },
          { value: CustomerIdNumberSequencing.random, label: "Random" },
          { value: CustomerIdNumberSequencing.custom, label: "Custom" }
        ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "flex items-center gap-2 cursor-pointer",
            "data-ocid": `customer_id_config.sequencing.${opt.value}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "radio",
                  name: "numberSequencing",
                  value: opt.value,
                  checked: numberSequencing === opt.value,
                  onChange: () => setNumberSequencing(opt.value),
                  className: "accent-orange-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: opt.label })
            ]
          },
          opt.value
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-foreground uppercase tracking-wide", children: "Governance Toggles" }),
      [
        {
          id: "autoGen",
          label: "Auto-generate Customer IDs",
          description: "IDs are generated automatically when accounts are created.",
          value: autoGenEnabled,
          onChange: setAutoGenEnabled,
          ocid: "customer_id_config.auto_gen.toggle",
          warn: false
        },
        {
          id: "manualOverride",
          label: "Permit Manual Override",
          description: "Allow Distributors and Resellers to enter IDs manually. Relaxes format enforcement.",
          value: manualOverride,
          onChange: setManualOverride,
          ocid: "customer_id_config.manual_override.toggle",
          warn: true
        },
        {
          id: "dupPrev",
          label: "Duplicate Prevention",
          description: "Block duplicate Customer IDs across all accounts.",
          value: dupPreventionEnabled,
          onChange: setDupPreventionEnabled,
          ocid: "customer_id_config.dup_prevention.toggle",
          warn: false
        }
      ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: t.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t.description }),
          t.warn && t.value && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs mt-1 flex items-center gap-1",
              style: { color: "#fbbf24" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 11 }),
                " Governance implication: Distributors and Resellers can create IDs outside the standard format."
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": t.value,
            onClick: () => t.onChange(!t.value),
            "data-ocid": t.ocid,
            className: "flex-shrink-0 w-10 h-5.5 rounded-full relative transition-colors",
            style: {
              background: t.value ? "#FF6B2B" : "rgba(255,255,255,0.1)",
              minWidth: "2.5rem",
              height: "1.375rem",
              transition: "background 0.2s"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                style: {
                  transform: t.value ? "translateX(1.125rem)" : "translateX(0)",
                  transition: "transform 0.2s"
                }
              }
            )
          }
        )
      ] }, t.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        disabled: saving,
        onClick: handleSave,
        style: { background: "#FF6B2B" },
        className: "text-white gap-2",
        "data-ocid": "customer_id_config.save.button",
        children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14 }),
          saving ? "Saving…" : "Save Format Rule"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            setShowAudit((v) => !v);
            if (!showAudit) loadAudit();
          },
          className: "flex items-center gap-2 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors",
          "data-ocid": "customer_id_config.audit.toggle",
          children: [
            showAudit ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }),
            "Customer ID Audit Log",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-normal", children: "(last 20 entries)" })
          ]
        }
      ),
      showAudit && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "crm-card overflow-hidden fade-in",
          "data-ocid": "customer_id_config.audit.panel",
          children: auditLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full bg-secondary/30" }, i)) }) : auditEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center py-8 gap-2",
              "data-ocid": "customer_id_config.audit.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { size: 24, className: "text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No audit entries yet" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
              "Action",
              "Customer ID",
              "Account ID",
              "Performed By",
              "Timestamp"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "text-left text-muted-foreground uppercase tracking-wide px-4 py-2.5 whitespace-nowrap",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: auditEntries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
                "data-ocid": `customer_id_config.audit.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditActionBadge, { action: entry.action }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-foreground font-semibold", children: entry.customerId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground font-mono", children: entry.accountId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: entry.performedBy }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground whitespace-nowrap", children: formatDate(entry.performedAt) })
                ]
              },
              entry.entryId
            )) })
          ] }) })
        }
      )
    ] })
  ] });
}
const OBJECT_TYPES = [
  { value: "customerAccount", label: "Customer Accounts" },
  { value: "dealRegistration", label: "Deal Registrations" },
  { value: "opportunity", label: "Opportunities" },
  { value: "businessPlan", label: "Business Plans" },
  { value: "mdfRequest", label: "MDF Requests" },
  { value: "promotion", label: "Promotions" },
  { value: "marketingActivity", label: "Marketing Activities" },
  { value: "userProfile", label: "User Profiles" },
  { value: "resellerProfile", label: "Reseller Profiles" },
  { value: "distributorProfile", label: "Distributor Profiles" }
];
const CONDITION_FIELDS = [
  { value: "role", label: "Role" },
  { value: "region", label: "Region" },
  { value: "org", label: "Organisation" }
];
const CONDITION_OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not Equals" },
  { value: "contains", label: "Contains" }
];
const TEMPLATES = [
  {
    id: "vendor_sees_all",
    label: "Vendor sees all",
    ruleType: "allow",
    objectType: "customerAccount",
    conditions: [
      {
        conditionField: "role",
        conditionOperator: "equals",
        conditionValue: "VendorAdmin"
      }
    ]
  },
  {
    id: "distributor_assigned",
    label: "Distributor sees assigned only",
    ruleType: "allow",
    objectType: "customerAccount",
    conditions: [
      {
        conditionField: "org",
        conditionOperator: "equals",
        conditionValue: "assigned_distributor"
      }
    ]
  },
  {
    id: "reseller_transacted",
    label: "Reseller sees transacted accounts only",
    ruleType: "allow",
    objectType: "customerAccount",
    conditions: [
      {
        conditionField: "role",
        conditionOperator: "equals",
        conditionValue: "ResellerAdmin"
      }
    ]
  },
  {
    id: "manager_team",
    label: "Manager sees team accounts",
    ruleType: "allow",
    objectType: "customerAccount",
    conditions: [
      {
        conditionField: "role",
        conditionOperator: "contains",
        conditionValue: "Manager"
      }
    ]
  }
];
const EMPTY_FORM = {
  objectType: "customerAccount",
  ruleType: "allow",
  conditions: [
    { conditionField: "role", conditionOperator: "equals", conditionValue: "" }
  ]
};
function VisibilityRulesConfig({ orgId, orgType }) {
  const { actor } = useActor();
  const [config, setConfig] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [saving, setSaving] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [inheritToggling, setInheritToggling] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor || !orgId) return;
    setLoading(true);
    actor.getOrgVisibilityConfig(orgId).then((cfg) => setConfig(cfg)).catch(() => setConfig(null)).finally(() => setLoading(false));
  }, [actor, orgId]);
  async function handleToggleInherit(checked) {
    if (!actor || !orgId) return;
    setInheritToggling(true);
    try {
      await actor.updateOrgVisibilityConfig(orgId, {
        defaultInheritFromVendor: checked,
        lockedByParent: (config == null ? void 0 : config.lockedByParent) ?? false
      });
      setConfig(
        (prev) => prev ? { ...prev, defaultInheritFromVendor: checked } : prev
      );
      ue.success(checked ? "Inheritance enabled" : "Inheritance disabled");
    } catch {
      ue.error("Failed to update config");
    } finally {
      setInheritToggling(false);
    }
  }
  async function handleDeleteRule(ruleId) {
    if (!actor) return;
    setDeletingId(ruleId);
    try {
      await actor.deleteVisibilityRule(ruleId);
      setConfig(
        (prev) => prev ? {
          ...prev,
          customRules: prev.customRules.filter((r) => r.id !== ruleId)
        } : prev
      );
      ue.success("Rule deleted");
    } catch {
      ue.error("Failed to delete rule");
    } finally {
      setDeletingId(null);
    }
  }
  function addCondition() {
    setForm((f) => ({
      ...f,
      conditions: [
        ...f.conditions,
        {
          conditionField: "role",
          conditionOperator: "equals",
          conditionValue: ""
        }
      ]
    }));
  }
  function removeCondition(idx) {
    setForm((f) => ({
      ...f,
      conditions: f.conditions.filter((_, i) => i !== idx)
    }));
  }
  function updateCondition(idx, field, value) {
    setForm((f) => {
      const next = [...f.conditions];
      next[idx] = { ...next[idx], [field]: value };
      return { ...f, conditions: next };
    });
  }
  function applyTemplate(templateId) {
    const t = TEMPLATES.find((t2) => t2.id === templateId);
    if (!t) return;
    setForm({
      objectType: t.objectType,
      ruleType: t.ruleType,
      conditions: [...t.conditions]
    });
    setShowCreate(true);
  }
  async function handleCreateRule(e) {
    e.preventDefault();
    if (!actor || !orgId) return;
    const invalid = form.conditions.some((c) => !c.conditionValue.trim());
    if (invalid) {
      ue.error("All conditions must have a value");
      return;
    }
    setSaving(true);
    try {
      const newRule = await actor.createVisibilityRule(orgId, {
        objectType: form.objectType,
        ruleType: form.ruleType,
        conditions: form.conditions.map((c) => ({
          conditionField: c.conditionField,
          conditionOperator: c.conditionOperator,
          conditionValue: c.conditionValue
        })),
        isActive: true
      });
      setConfig(
        (prev) => prev ? { ...prev, customRules: [...prev.customRules, newRule] } : prev
      );
      setShowCreate(false);
      setForm(EMPTY_FORM);
      ue.success("Visibility rule created");
    } catch {
      ue.error("Failed to create rule");
    } finally {
      setSaving(false);
    }
  }
  function conditionsSummary(rule) {
    var _a;
    if (!((_a = rule.conditions) == null ? void 0 : _a.length)) return "No conditions";
    return rule.conditions.map(
      (c) => `${c.conditionField} ${c.conditionOperator} "${c.conditionValue}"`
    ).join(" AND ");
  }
  const objectLabel = (val) => {
    var _a;
    return ((_a = OBJECT_TYPES.find((o) => o.value === val)) == null ? void 0 : _a.label) ?? val;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "visibility_rules.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 15, style: { color: "#FF6B2B" } }),
        "Data Visibility Rules"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Control who can access each type of data in your organisation" })
    ] }),
    (config == null ? void 0 : config.lockedByParent) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 px-4 py-3 rounded-lg border",
        style: {
          background: "rgba(245,158,11,0.07)",
          borderColor: "rgba(245,158,11,0.25)"
        },
        "data-ocid": "visibility_rules.locked_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14, className: "text-yellow-400 flex-shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-yellow-300", children: [
            "Visibility rules are locked by your parent organisation. Contact your ",
            orgType === "reseller" ? "Distributor or Vendor" : "Vendor",
            " ",
            "admin to request changes."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-foreground", children: "Inherit parent org visibility rules by default" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "When enabled, rules from your parent organisation apply automatically." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Switch,
        {
          checked: (config == null ? void 0 : config.defaultInheritFromVendor) ?? false,
          onCheckedChange: handleToggleInherit,
          disabled: inheritToggling || !!(config == null ? void 0 : config.lockedByParent) || loading,
          "data-ocid": "visibility_rules.inherit_toggle"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 13, className: "text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground uppercase tracking-wide", children: "Quick Templates" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: TEMPLATES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => applyTemplate(t.id),
          disabled: !!(config == null ? void 0 : config.lockedByParent),
          className: "text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
          "data-ocid": `visibility_rules.template.${t.id}`,
          children: t.label
        },
        t.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground", children: [
          "Active Rules",
          config && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs text-muted-foreground font-normal", children: [
            "(",
            config.customRules.filter((r) => r.isActive).length,
            " active)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            disabled: !!(config == null ? void 0 : config.lockedByParent) || loading,
            onClick: () => setShowCreate(true),
            style: { background: "#FF6B2B" },
            className: "text-white gap-1.5",
            "data-ocid": "visibility_rules.create_rule_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 }),
              " Create Rule"
            ]
          }
        )
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: "Loading rules…" }) : !config || config.customRules.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center py-12 gap-3",
          "data-ocid": "visibility_rules.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 32, className: "text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No custom rules defined" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create a rule or apply a template to control data access." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
          "Object Type",
          "Rule Type",
          "Conditions",
          "Status",
          "Actions"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: config.customRules.map((rule, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors",
            "data-ocid": `visibility_rules.rule.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground text-xs", children: objectLabel(rule.objectType) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: rule.ruleType === "allow" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 9 }),
                " Allow"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-red-500/15 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 9 }),
                " Deny"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground max-w-[260px] truncate", children: conditionsSummary(rule) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: rule.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-badge text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-badge text-[11px] font-semibold bg-muted/40 text-muted-foreground", children: "Inactive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  disabled: deletingId === rule.id || !!(config == null ? void 0 : config.lockedByParent),
                  onClick: () => handleDeleteRule(rule.id),
                  className: "h-7 w-7 p-0 text-muted-foreground hover:text-red-400",
                  "aria-label": "Delete rule",
                  "data-ocid": `visibility_rules.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                }
              ) })
            ]
          },
          rule.id
        )) })
      ] }) })
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        style: { background: "rgba(0,0,0,0.65)" },
        "data-ocid": "visibility_rules.create.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card w-full max-w-lg max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 14, style: { color: "#FF6B2B" } }),
              "Create Visibility Rule"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setShowCreate(false);
                  setForm(EMPTY_FORM);
                },
                className: "text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "visibility_rules.create.close_button",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateRule, className: "p-6 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Object Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: form.objectType,
                  onChange: (e) => setForm((f) => ({ ...f, objectType: e.target.value })),
                  className: "crm-input w-full px-3 py-2 text-sm",
                  "data-ocid": "visibility_rules.create.object_type.select",
                  children: OBJECT_TYPES.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Rule Type *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: ["allow", "deny"].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setForm((f) => ({ ...f, ruleType: type })),
                  className: `flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${form.ruleType === type ? type === "allow" ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "bg-red-500/15 border-red-500/40 text-red-400" : "border-border text-muted-foreground hover:border-accent/50"}`,
                  "data-ocid": `visibility_rules.create.rule_type_${type}`,
                  children: type === "allow" ? "✓ Allow" : "✗ Deny"
                },
                type
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Conditions (AND logic)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: addCondition,
                    className: "text-xs text-accent hover:text-accent/80 flex items-center gap-1",
                    "data-ocid": "visibility_rules.create.add_condition_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 11 }),
                      " Add Condition"
                    ]
                  }
                )
              ] }),
              form.conditions.map((cond, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: condition order is user-managed
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: cond.conditionField,
                      onChange: (e) => updateCondition(idx, "conditionField", e.target.value),
                      className: "crm-input px-2 py-1.5 text-xs flex-1 min-w-[100px]",
                      children: CONDITION_FIELDS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f.value, children: f.label }, f.value))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      value: cond.conditionOperator,
                      onChange: (e) => updateCondition(
                        idx,
                        "conditionOperator",
                        e.target.value
                      ),
                      className: "crm-input px-2 py-1.5 text-xs flex-1 min-w-[90px]",
                      children: CONDITION_OPERATORS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: cond.conditionValue,
                      onChange: (e) => updateCondition(idx, "conditionValue", e.target.value),
                      placeholder: "value…",
                      className: "crm-input flex-1 min-w-[100px] h-8 text-xs"
                    }
                  ),
                  form.conditions.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeCondition(idx),
                      className: "text-muted-foreground hover:text-red-400 transition-colors",
                      "aria-label": "Remove condition",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
                    }
                  )
                ] }, idx)
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    setShowCreate(false);
                    setForm(EMPTY_FORM);
                  },
                  "data-ocid": "visibility_rules.create.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: saving,
                  style: { background: "#FF6B2B" },
                  className: "text-white",
                  "data-ocid": "visibility_rules.create.submit_button",
                  children: saving ? "Creating…" : "Create Rule"
                }
              )
            ] })
          ] })
        ] })
      }
    )
  ] });
}
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
const ALL_PERMISSIONS = [
  { id: "view_accounts", label: "View Accounts" },
  { id: "edit_accounts", label: "Edit Accounts" },
  { id: "upload_contacts", label: "Upload Contacts" },
  { id: "manage_partner_users", label: "Manage Reseller Users" },
  { id: "view_reports", label: "View Reports" },
  { id: "create_reports", label: "Create Reports" },
  { id: "upload_promotions", label: "Upload Promotions" },
  { id: "upload_price_lists", label: "Upload Price Lists" },
  { id: "manage_deal_registrations", label: "Manage Deal Registrations" },
  { id: "view_business_plans", label: "View Business Plans" },
  { id: "edit_business_plans", label: "Edit Business Plans" },
  { id: "manage_account_alerts", label: "Manage Account Alerts" },
  { id: "propose_domain_changes", label: "Propose Domain Changes" }
];
const TABS = [
  { id: "company", label: "Company Profile", icon: Building2 },
  { id: "partners", label: "Reseller Management", icon: Users },
  { id: "distributors", label: "Distributor Management", icon: Network },
  { id: "users", label: "User Management", icon: ShieldCheck },
  { id: "audit", label: "Audit Log", icon: ClipboardList },
  { id: "authentication", label: "Authentication", icon: Lock },
  { id: "forgeai", label: "ForgeAI Settings", icon: Bot },
  { id: "customfields", label: "Custom Fields", icon: Settings2 },
  { id: "customerids", label: "Customer IDs", icon: Hash },
  { id: "visibility", label: "Visibility Rules", icon: Eye },
  { id: "appearance", label: "Appearance", icon: Palette }
];
function formatAction(action) {
  return action.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function ActivationBadge({ status }) {
  const cfg = {
    [ActivationStatus.Active]: {
      cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
      label: "Active"
    },
    [ActivationStatus.Pending]: {
      cls: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
      label: "Pending"
    },
    [ActivationStatus.Suspended]: {
      cls: "bg-red-500/15 text-red-400 border border-red-500/20",
      label: "Suspended"
    }
  };
  const c = cfg[status] ?? cfg[ActivationStatus.Pending];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `status-badge text-[11px] font-semibold ${c.cls}`, children: c.label });
}
function InvBadge({ status }) {
  const map = {
    Pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
    Accepted: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    Expired: "bg-secondary/50 text-muted-foreground",
    Cancelled: "bg-secondary/50 text-muted-foreground line-through"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `status-badge text-[11px] font-semibold ${map[status] ?? map.Pending}`,
      children: status
    }
  );
}
function AdminSettings() {
  const { userProfile, companyProfile } = useApp();
  const [activeTab, setActiveTab] = reactExports.useState("company");
  const isPrimaryAdmin = (userProfile == null ? void 0 : userProfile.isPrimaryAdmin) === true;
  const isVendorAdmin = (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorAdmin || (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorPrimaryAdmin;
  if (!isVendorAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[400px] gap-4",
        "data-ocid": "admin.access_restricted",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-16 h-16 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display text-foreground", children: "Access Restricted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: "This section is only available to Vendor Admins. Contact your administrator for access." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-6 fade-in", "data-ocid": "admin.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Admin Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage your company, partners, users, and audit logs" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 border-b border-border overflow-x-auto scrollbar-thin pb-0",
        "data-ocid": "admin.tabs",
        children: TABS.map((tab) => {
          const Icon = tab.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab(tab.id),
              "data-ocid": `admin.${tab.id}.tab`,
              className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
                tab.label
              ]
            },
            tab.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fade-in", children: [
      activeTab === "company" && /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyProfileTab, { company: companyProfile }),
      activeTab === "partners" && /* @__PURE__ */ jsxRuntimeExports.jsx(PartnerManagementTab, { company: companyProfile }),
      activeTab === "distributors" && /* @__PURE__ */ jsxRuntimeExports.jsx(DistributorManagementTab, { company: companyProfile }),
      activeTab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsx(UserManagementTab, { isPrimaryAdmin }),
      activeTab === "audit" && /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogTab, {}),
      activeTab === "authentication" && companyProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(AuthSettingsSection, { orgId: companyProfile.id }),
      activeTab === "forgeai" && isPrimaryAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAISettingsTab, {}),
      activeTab === "forgeai" && isPrimaryAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AIProviderSettings, { wsType: "vendor" }) }),
      activeTab === "customerids" && companyProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerIdTab, { companyId: companyProfile.id }),
      activeTab === "forgeai" && !isPrimaryAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center min-h-[400px] gap-4",
          "data-ocid": "forgeai.access_restricted",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-14 h-14 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display text-foreground", children: "Primary Admin Required" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center max-w-xs", children: "ForgeAI settings are only configurable by Primary Admins." })
          ]
        }
      ),
      activeTab === "customfields" && /* @__PURE__ */ jsxRuntimeExports.jsx(CustomFieldManager, { orgType: "vendor", canCreate: true, canArchive: true, canLock: true }),
      activeTab === "visibility" && companyProfile && /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilityRulesConfig, { orgId: companyProfile.id, orgType: "vendor" }),
      activeTab === "appearance" && /* @__PURE__ */ jsxRuntimeExports.jsx(AppearanceTab, {})
    ] })
  ] });
}
function AppearanceTab() {
  const { effectiveTheme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", "data-ocid": "admin.appearance.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Theme & Display" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Choose your preferred display theme for authenticated workspace areas. Pre-login screens always use the CHANNELFORGE dark identity." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTheme("dark"),
          "data-ocid": "admin.appearance.dark_mode.toggle",
          className: `flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all ${effectiveTheme === "dark" ? "border-accent bg-accent/8 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${effectiveTheme === "dark" ? "bg-accent/15" : "bg-secondary/50"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Moon,
                    {
                      className: `w-5 h-5 ${effectiveTheme === "dark" ? "text-accent" : "text-muted-foreground"}`
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-sm font-semibold ${effectiveTheme === "dark" ? "text-accent" : "text-foreground"}`,
                    children: "Dark Mode"
                  }
                ),
                effectiveTheme === "dark" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-accent/70 font-medium", children: "Currently active" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Navy backgrounds, dark gradients, orange highlights. Operational command-center feel." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setTheme("light"),
          "data-ocid": "admin.appearance.light_mode.toggle",
          className: `flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all ${effectiveTheme === "light" ? "border-accent bg-accent/8 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${effectiveTheme === "light" ? "bg-accent/15" : "bg-secondary/50"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Sun,
                    {
                      className: `w-5 h-5 ${effectiveTheme === "light" ? "text-accent" : "text-muted-foreground"}`
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-sm font-semibold ${effectiveTheme === "light" ? "text-accent" : "text-foreground"}`,
                    children: "Light Mode"
                  }
                ),
                effectiveTheme === "light" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-accent/70 font-medium", children: "Currently active" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "White/light grey backgrounds, navy typography, orange accents. Clean productivity feel." })
          ]
        }
      )
    ] })
  ] });
}
function DistributorManagementTab({
  company
}) {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    companyName: "",
    companyId: "",
    emailDomain: "",
    primaryAdminEmail: ""
  });
  const SAMPLE_DISTRIBUTORS = [
    {
      id: "dist-1",
      companyName: "Ingram Micro",
      companyId: "INGM0001",
      emailDomain: "ingrammicro.com",
      status: "Active",
      tier: "Platinum",
      resellerCount: 12,
      vendorCount: 3
    },
    {
      id: "dist-2",
      companyName: "TD Synnex",
      companyId: "SYNN0002",
      emailDomain: "tdsynnex.com",
      status: "Active",
      tier: "Gold",
      resellerCount: 8,
      vendorCount: 2
    },
    {
      id: "dist-3",
      companyName: "Arrow Electronics",
      companyId: "ARRO0003",
      emailDomain: "arrow.com",
      status: "Pending",
      tier: "Silver",
      resellerCount: 0,
      vendorCount: 1
    }
  ];
  const TIER_COLORS = {
    Silver: { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
    Gold: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
    Platinum: { bg: "rgba(148,163,184,0.12)", color: "#e2e8f0" }
  };
  async function handleCreateDistributor(e) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setCreateOpen(false);
    ue.success(
      `Distributor "${form.companyName}" created. Invitation sent to primary admin.`
    );
    setForm({
      companyName: "",
      companyId: "",
      emailDomain: "",
      primaryAdminEmail: ""
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", "data-ocid": "admin.distributors.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        SAMPLE_DISTRIBUTORS.length,
        " distributor",
        SAMPLE_DISTRIBUTORS.length !== 1 ? "s" : "",
        " connected"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          className: "gap-1.5",
          onClick: () => setCreateOpen(true),
          "data-ocid": "admin.distributors.create_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
            "Create Distributor"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Company",
        "Distributor ID",
        "Domain",
        "Status",
        "Tier",
        "Resellers",
        "Vendors",
        "Actions"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: SAMPLE_DISTRIBUTORS.map((d, i) => {
        const tierCfg = TIER_COLORS[d.tier] ?? TIER_COLORS.Silver;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/40 hover:bg-secondary/10 transition-colors",
            "data-ocid": `admin.distributors.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold",
                    style: {
                      background: "rgba(100,140,220,0.1)",
                      color: "#648CDC"
                    },
                    children: d.companyName.charAt(0)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-xs", children: d.companyName })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: d.companyId }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: [
                "@",
                d.emailDomain
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `status-badge text-[11px] font-semibold ${d.status === "Active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : d.status === "Pending" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20" : "bg-secondary/50 text-muted-foreground"}`,
                  children: d.status
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
                  style: {
                    background: tierCfg.bg,
                    color: tierCfg.color,
                    border: `1px solid ${tierCfg.color}40`
                  },
                  children: d.tier
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-center text-foreground font-medium", children: d.resellerCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-center text-foreground font-medium", children: d.vendorCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "h-7 text-xs",
                    onClick: () => navigate({ to: `/distributor/${d.id}` }),
                    "data-ocid": `admin.distributors.view_button.${i + 1}`,
                    children: "View"
                  }
                ),
                d.status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    className: "h-7 text-xs",
                    "data-ocid": `admin.distributors.activate_button.${i + 1}`,
                    children: "Activate"
                  }
                )
              ] }) })
            ]
          },
          d.id
        );
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-md",
        style: { background: "#121b2a", border: "1px solid #223047" },
        "data-ocid": "admin.distributors.create.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { className: "w-4 h-4", style: { color: "#648CDC" } }),
            "Create Distributor"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreateDistributor, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Distributor Company Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  required: true,
                  value: form.companyName,
                  onChange: (e) => setForm((f) => ({ ...f, companyName: e.target.value })),
                  placeholder: "e.g. Ingram Micro",
                  className: "crm-input",
                  "data-ocid": "admin.distributors.company_name.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Distributor ID *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  required: true,
                  value: form.companyId,
                  onChange: (e) => setForm((f) => ({
                    ...f,
                    companyId: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)
                  })),
                  placeholder: "e.g. INGM0001",
                  className: "crm-input font-mono",
                  "data-ocid": "admin.distributors.company_id.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] mt-1 text-muted-foreground", children: "4 letters + 4 numbers (e.g. INGM0001)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Email Domain *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground", children: "@" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    required: true,
                    value: form.emailDomain,
                    onChange: (e) => setForm((f) => ({
                      ...f,
                      emailDomain: e.target.value.replace(/^@/, "")
                    })),
                    placeholder: "ingrammicro.com",
                    className: "crm-input pl-7",
                    "data-ocid": "admin.distributors.email_domain.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Primary Admin Email *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  required: true,
                  type: "email",
                  value: form.primaryAdminEmail,
                  onChange: (e) => setForm((f) => ({ ...f, primaryAdminEmail: e.target.value })),
                  placeholder: "admin@ingrammicro.com",
                  className: "crm-input",
                  "data-ocid": "admin.distributors.primary_admin_email.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] mt-1 text-muted-foreground", children: "An invitation will be sent to this email to complete distributor setup." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setCreateOpen(false),
                  "data-ocid": "admin.distributors.create.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: saving || !form.companyName || !form.companyId || !form.emailDomain || !form.primaryAdminEmail,
                  style: { background: "#648CDC" },
                  className: "text-white",
                  "data-ocid": "admin.distributors.create.submit_button",
                  children: saving ? "Creating..." : "Create Distributor"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
function CompanyProfileTab({ company }) {
  const { refreshUserProfile, companyLogoUrl } = useApp();
  const fileInputRef = reactExports.useRef(null);
  const [editingName, setEditingName] = reactExports.useState(false);
  const [companyName, setCompanyName] = reactExports.useState((company == null ? void 0 : company.companyName) ?? "");
  const [savingName, setSavingName] = reactExports.useState(false);
  const [addingDomain, setAddingDomain] = reactExports.useState(false);
  const [newDomain, setNewDomain] = reactExports.useState("");
  const [domains, setDomains] = reactExports.useState(
    (company == null ? void 0 : company.partnerDomains) ?? []
  );
  const [confirmRemoveDomain, setConfirmRemoveDomain] = reactExports.useState(
    null
  );
  const [uploadingLogo, setUploadingLogo] = reactExports.useState(false);
  const [logoPreview, setLogoPreview] = reactExports.useState(companyLogoUrl);
  reactExports.useEffect(() => {
    setCompanyName((company == null ? void 0 : company.companyName) ?? "");
    setDomains((company == null ? void 0 : company.partnerDomains) ?? []);
  }, [company]);
  reactExports.useEffect(() => {
    setLogoPreview(companyLogoUrl);
  }, [companyLogoUrl]);
  async function saveName() {
    if (!company) return;
    setSavingName(true);
    try {
      ue.success("Company name updated");
      setEditingName(false);
    } finally {
      setSavingName(false);
    }
  }
  async function addDomain() {
    const d = newDomain.trim().toLowerCase();
    if (!d || domains.includes(d)) return;
    setDomains((prev) => [...prev, d]);
    setNewDomain("");
    setAddingDomain(false);
    ue.success(`Reseller domain ${d} added`);
  }
  function removeDomain(domain) {
    setDomains((prev) => prev.filter((d) => d !== domain));
    setConfirmRemoveDomain(null);
    ue.success(`Domain ${domain} removed`);
  }
  async function handleLogoUpload(files) {
    if (!files || files.length === 0 || !company) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      ue.error("Please upload an image file");
      return;
    }
    setUploadingLogo(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const url = blob.getDirectURL();
      setLogoPreview(url);
      await refreshUserProfile();
      ue.success("Company logo updated");
    } catch {
      ue.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card p-6 flex flex-col gap-6",
      "data-ocid": "admin.company.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Company Logo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-xl border border-border bg-secondary/30 flex items-center justify-center overflow-hidden flex-shrink-0", children: logoPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: logoPreview,
                alt: "Company logo",
                className: "w-full h-full object-contain"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-6 h-6 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "border-border text-xs h-8 gap-1.5",
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  disabled: uploadingLogo,
                  "data-ocid": "admin.company_logo.upload_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
                    uploadingLogo ? "Uploading..." : logoPreview ? "Change Logo" : "Upload Logo"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "PNG, JPG, SVG · Shown on login screen and dashboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: (e) => handleLogoUpload(e.target.files)
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Company Name" }),
          editingName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 max-w-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: companyName,
                onChange: (e) => setCompanyName(e.target.value),
                className: "crm-input",
                "data-ocid": "admin.company_name.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: saveName,
                disabled: savingName,
                "data-ocid": "admin.company_name.save_button",
                children: savingName ? "Saving..." : "Save"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                onClick: () => setEditingName(false),
                "data-ocid": "admin.company_name.cancel_button",
                children: "Cancel"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-semibold text-foreground", children: (company == null ? void 0 : company.companyName) ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                onClick: () => setEditingName(true),
                className: "text-muted-foreground hover:text-foreground h-7 text-xs gap-1",
                "data-ocid": "admin.company_name.edit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" }),
                  "Edit"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Email Domain" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-mono", children: (company == null ? void 0 : company.emailDomain) ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Company ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground font-mono", children: (company == null ? void 0 : company.companyId) ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Reseller Domains" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                className: "border-border h-7 text-xs",
                onClick: () => setAddingDomain(true),
                "data-ocid": "admin.add_domain.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                  " Add Domain"
                ]
              }
            )
          ] }),
          addingDomain && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 max-w-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. partner.com",
                value: newDomain,
                onChange: (e) => setNewDomain(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && addDomain(),
                className: "crm-input text-sm",
                "data-ocid": "admin.new_domain.input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: addDomain,
                "data-ocid": "admin.new_domain.submit_button",
                children: "Add"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                onClick: () => setAddingDomain(false),
                "data-ocid": "admin.new_domain.cancel_button",
                children: "Cancel"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            domains.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "No partner domains configured" }),
            domains.map((domain) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 bg-secondary/40 border border-border rounded-full px-3 py-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-foreground", children: domain }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setConfirmRemoveDomain(domain),
                      className: "text-muted-foreground hover:text-red-400 transition-colors ml-1",
                      "aria-label": `Remove ${domain}`,
                      "data-ocid": "admin.remove_domain.button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              domain
            ))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: !!confirmRemoveDomain,
            onOpenChange: () => setConfirmRemoveDomain(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Remove Reseller Domain?" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Are you sure you want to remove",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: confirmRemoveDomain }),
                "? Resellers using this domain will lose access."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    onClick: () => setConfirmRemoveDomain(null),
                    "data-ocid": "admin.remove_domain.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "destructive",
                    onClick: () => confirmRemoveDomain && removeDomain(confirmRemoveDomain),
                    "data-ocid": "admin.remove_domain.confirm_button",
                    children: "Remove Domain"
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
function PartnerManagementTab({ company }) {
  const { actor } = useActor();
  const navigate = useNavigate();
  const { setResellerContext } = useApp();
  const [resellers, setResellers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    companyName: "",
    companyId: "",
    emailDomain: "",
    primaryAdminEmail: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const [actionTarget, setActionTarget] = reactExports.useState(null);
  const [resellerIdError, setResellerIdError] = reactExports.useState(null);
  const [suggestedId, setSuggestedId] = reactExports.useState(null);
  const debouncedCompanyName = useDebounce(form.companyName, 500);
  const loadResellers = reactExports.useCallback(async () => {
    if (!actor || !company) return;
    setLoading(true);
    try {
      const data = await actor.getResellersForVendor(company.id);
      setResellers([...data]);
    } catch {
      ue.error("Failed to load partner list");
    } finally {
      setLoading(false);
    }
  }, [actor, company]);
  reactExports.useEffect(() => {
    loadResellers();
  }, [loadResellers]);
  reactExports.useEffect(() => {
    if (!debouncedCompanyName || editTarget) {
      setSuggestedId(null);
      return;
    }
    const prefix = debouncedCompanyName.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 4);
    if (prefix.length < 4) {
      setSuggestedId(null);
      return;
    }
    const existingNums = resellers.map((r) => r.companyId).filter((id) => id.length === 8 && id.startsWith(prefix)).map((id) => Number.parseInt(id.slice(4), 10)).filter((n) => !Number.isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
    setSuggestedId(`${prefix}${String(nextNum).padStart(4, "0")}`);
  }, [debouncedCompanyName, resellers, editTarget]);
  function validateResellerId(value) {
    if (value.length === 0) return null;
    if (/[^A-Z0-9]/.test(value))
      return "Only letters (A-Z) and numbers are allowed — no spaces, hyphens, or symbols.";
    if (value.length !== 8) return "Reseller ID must be exactly 8 characters.";
    if (!/^[A-Z]{4}/.test(value))
      return "The first 4 characters must be letters from the partner name.";
    if (!/[0-9]{4}$/.test(value))
      return "The last 4 characters must be 4 numbers.";
    return null;
  }
  function handleResellerIdChange(raw) {
    const sanitized = raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 8).replace(/^([A-Za-z]{0,4})/, (m) => m.toUpperCase());
    setForm((f) => ({ ...f, companyId: sanitized }));
    setResellerIdError(validateResellerId(sanitized));
  }
  function applySuggestion() {
    if (!suggestedId) return;
    setForm((f) => ({ ...f, companyId: suggestedId }));
    setResellerIdError(null);
  }
  function openCreate() {
    setForm({
      companyName: "",
      companyId: "",
      emailDomain: "",
      primaryAdminEmail: ""
    });
    setEditTarget(null);
    setResellerIdError(null);
    setSuggestedId(null);
    setCreateOpen(true);
  }
  function openEdit(r) {
    setForm({
      companyName: r.companyName,
      companyId: r.companyId,
      emailDomain: r.emailDomain,
      primaryAdminEmail: ""
    });
    setEditTarget(r);
    setResellerIdError(null);
    setSuggestedId(null);
    setCreateOpen(true);
  }
  function validateForm() {
    if (!form.companyName.trim()) return "Company name is required.";
    if (!form.companyId.trim()) return "Reseller ID is required.";
    const idErr = validateResellerId(form.companyId);
    if (idErr) return idErr;
    if (!form.emailDomain.trim()) return "Email domain is required.";
    if (!editTarget && !form.primaryAdminEmail.trim())
      return "Primary admin email is required.";
    const d = form.emailDomain.trim().toLowerCase();
    if (!editTarget && resellers.some((r) => r.emailDomain === d))
      return `Domain @${d} is already registered to another partner.`;
    if (form.primaryAdminEmail && !form.primaryAdminEmail.endsWith(`@${d}`))
      return `Primary admin email must belong to @${d}.`;
    return null;
  }
  const isFormValid = reactExports.useMemo(() => {
    if (!form.companyName.trim() || !form.companyId.trim() || !form.emailDomain.trim())
      return false;
    if (!editTarget && !form.primaryAdminEmail.trim()) return false;
    const id = form.companyId;
    if (/[^A-Z0-9]/.test(id) || id.length !== 8) return false;
    if (!/^[A-Z]{4}/.test(id) || !/[0-9]{4}$/.test(id)) return false;
    return true;
  }, [form, editTarget]);
  async function handleSave() {
    const err = validateForm();
    if (err) {
      ue.error(err);
      return;
    }
    if (!actor || !company) return;
    setSaving(true);
    try {
      if (editTarget) {
        ue.success(`Partner "${form.companyName}" updated`);
        setCreateOpen(false);
        await loadResellers();
      } else {
        const result = await actor.createReseller(company.id, {
          companyName: form.companyName.trim(),
          companyId: form.companyId.trim(),
          emailDomain: form.emailDomain.trim().toLowerCase(),
          primaryAdminEmail: form.primaryAdminEmail.trim()
        });
        if (result.__kind__ === "ok") {
          ue.success(`Partner "${form.companyName}" created`);
          setCreateOpen(false);
          await loadResellers();
        } else {
          const errMsg = result.err;
          if (errMsg.toLowerCase().includes("already exists") || errMsg.toLowerCase().includes("duplicate")) {
            setResellerIdError(
              "This Reseller ID already exists in your vendor workspace. Please enter a unique ID."
            );
          } else {
            ue.error(errMsg);
          }
        }
      }
    } catch {
      ue.error("Failed to save reseller");
    } finally {
      setSaving(false);
    }
  }
  async function handleActivate(resellerId) {
    if (!actor) return;
    setActionTarget(resellerId);
    try {
      const result = await actor.activateReseller(resellerId);
      if (result.__kind__ === "ok") {
        ue.success("Reseller activated");
        await loadResellers();
      } else ue.error(result.err);
    } catch {
      ue.error("Failed to activate reseller");
    } finally {
      setActionTarget(null);
    }
  }
  async function handleDeactivate(resellerId) {
    if (!actor) return;
    setActionTarget(resellerId);
    try {
      const result = await actor.deactivateReseller(resellerId);
      if (result.__kind__ === "ok") {
        ue.success("Reseller suspended");
        await loadResellers();
      } else ue.error(result.err);
    } catch {
      ue.error("Failed to suspend reseller");
    } finally {
      setActionTarget(null);
    }
  }
  function viewWorkspace(r) {
    setResellerContext({ resellerId: r.id, resellerName: r.companyName });
    navigate({ to: "/dashboard" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", "data-ocid": "admin.partners.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        resellers.length,
        " reseller",
        resellers.length !== 1 ? "s" : "",
        " ",
        "connected"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          className: "gap-1.5",
          onClick: openCreate,
          "data-ocid": "admin.partners.create_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
            "Create New Reseller"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "p-4 flex flex-col gap-2",
        "data-ocid": "admin.partners.loading_state",
        children: ["s1", "s2", "s3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-secondary/30" }, k))
      }
    ) : resellers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 gap-2",
        "data-ocid": "admin.partners.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No resellers yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create a reseller to get started" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Company",
        "Reseller ID",
        "Domain",
        "Primary Admin",
        "Status",
        "Actions"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: resellers.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `admin.partners.item.${idx + 1}`,
          className: `border-b border-border/50 hover:bg-secondary/20 transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0", children: getInitials(r.companyName) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium text-sm", children: r.companyName })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-semibold tracking-wider", children: r.companyId }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-sm text-muted-foreground", children: [
              "@",
              r.emailDomain
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-sm", children: r.claimedBy ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-muted-foreground/60", children: "Not set" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActivationBadge, { status: r.activationStatus }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "border-border text-xs h-7",
                  onClick: () => viewWorkspace(r),
                  "data-ocid": `admin.partners.view_workspace.button.${idx + 1}`,
                  children: "View Workspace"
                }
              ),
              r.activationStatus !== ActivationStatus.Active && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs h-7",
                  disabled: actionTarget === r.id,
                  onClick: () => handleActivate(r.id),
                  "data-ocid": `admin.partners.activate.button.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                    "Activate"
                  ]
                }
              ),
              r.activationStatus === ActivationStatus.Active && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-7",
                  disabled: actionTarget === r.id,
                  onClick: () => handleDeactivate(r.id),
                  "data-ocid": `admin.partners.deactivate.button.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 mr-1" }),
                    "Deactivate"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "text-muted-foreground hover:text-foreground text-xs h-7 px-2",
                  onClick: () => openEdit(r),
                  "aria-label": "Edit reseller",
                  "data-ocid": `admin.partners.edit.button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3" })
                }
              )
            ] }) })
          ]
        },
        r.id
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-md",
        "data-ocid": "admin.partners.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editTarget ? `Edit ${editTarget.companyName}` : "Create New Reseller" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Company Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.companyName,
                  onChange: (e) => setForm((f) => ({ ...f, companyName: e.target.value })),
                  placeholder: "Acme Solutions Ltd",
                  className: "crm-input",
                  "data-ocid": "admin.partners.company_name.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Reseller ID *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.companyId,
                    onChange: (e) => handleResellerIdChange(e.target.value),
                    placeholder: "ATEA0001",
                    maxLength: 8,
                    className: `crm-input font-mono uppercase tracking-widest pr-10 ${resellerIdError ? "border-red-500/60 focus-visible:ring-red-500/40" : form.companyId.length === 8 && !resellerIdError ? "border-emerald-500/40 focus-visible:ring-emerald-500/30" : ""}`,
                    "data-ocid": "admin.partners.reseller_id.input",
                    "aria-describedby": "reseller-id-helper reseller-id-error"
                  }
                ),
                form.companyId.length === 8 && !resellerIdError && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" })
              ] }),
              resellerIdError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  id: "reseller-id-error",
                  className: "text-xs text-red-400 flex items-center gap-1",
                  "data-ocid": "admin.partners.reseller_id.error_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 flex-shrink-0" }),
                    resellerIdError
                  ]
                }
              ),
              !editTarget && suggestedId && form.companyId !== suggestedId && !resellerIdError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 p-2 rounded-md bg-accent/8 border border-accent/20",
                  "data-ocid": "admin.partners.reseller_id_suggestion.panel",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground flex-1", children: [
                      "Suggested:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: applySuggestion,
                          className: "font-mono font-bold text-accent hover:text-accent/80 transition-colors underline decoration-dotted underline-offset-2",
                          "data-ocid": "admin.partners.reseller_id_suggestion.button",
                          children: suggestedId
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: applySuggestion,
                        className: "text-[10px] text-accent/80 hover:text-accent px-2 py-0.5 rounded border border-accent/30 hover:border-accent/50 transition-colors",
                        "data-ocid": "admin.partners.reseller_id_apply.button",
                        children: "Apply"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  id: "reseller-id-helper",
                  className: "text-[10px] text-muted-foreground",
                  children: [
                    "Reseller ID must use 4 letters from the partner name followed by 4 numbers, e.g.",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground/70", children: "ATEA0001" }),
                    "."
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Email Domain *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.emailDomain,
                    onChange: (e) => setForm((f) => ({ ...f, emailDomain: e.target.value })),
                    placeholder: "acme.com",
                    className: "crm-input",
                    "data-ocid": "admin.partners.email_domain.input"
                  }
                )
              ] }),
              !editTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Primary Admin Email *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "email",
                    value: form.primaryAdminEmail,
                    onChange: (e) => setForm((f) => ({
                      ...f,
                      primaryAdminEmail: e.target.value
                    })),
                    placeholder: `admin@${form.emailDomain || "partner.com"}`,
                    className: "crm-input",
                    "data-ocid": "admin.partners.primary_admin_email.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Must match the partner email domain" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => setCreateOpen(false),
                "data-ocid": "admin.partners.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: handleSave,
                disabled: saving || !isFormValid,
                "data-ocid": "admin.partners.save_button",
                children: saving ? "Saving..." : editTarget ? "Save Changes" : "Create Reseller"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function UserManagementTab({ isPrimaryAdmin }) {
  const { userProfile, companyProfile } = useApp();
  const { actor } = useActor();
  const [users, setUsers] = reactExports.useState([]);
  const [invitations, setInvitations] = reactExports.useState([]);
  const [loadingUsers, setLoadingUsers] = reactExports.useState(true);
  const [permModalUser, setPermModalUser] = reactExports.useState(null);
  const [selectedPerms, setSelectedPerms] = reactExports.useState([]);
  const [savingPerms, setSavingPerms] = reactExports.useState(false);
  const [inviteOpen, setInviteOpen] = reactExports.useState(false);
  const [inviteForm, setInviteForm] = reactExports.useState({
    email: "",
    role: UserRole.VendorSecondaryAdmin
  });
  const [inviting, setInviting] = reactExports.useState(false);
  const [cancellingId, setCancellingId] = reactExports.useState(null);
  const [deptMap, setDeptMap] = reactExports.useState({});
  const isVendorUser = (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorAdmin || (userProfile == null ? void 0 : userProfile.role) === UserRole.VendorSecondaryAdmin;
  const inviteRoleOptions = isVendorUser ? [
    {
      value: UserRole.VendorSecondaryAdmin,
      label: "Vendor Secondary Admin"
    }
  ] : [
    { value: UserRole.ResellerAdmin, label: "Reseller Admin" },
    { value: UserRole.ResellerSalesUser, label: "Reseller Sales User" }
  ];
  const loadData = reactExports.useCallback(async () => {
    if (!actor || !companyProfile) return;
    setLoadingUsers(true);
    try {
      const [usersData, invData] = await Promise.all([
        actor.getUsersByCompany(companyProfile.id),
        actor.getInvitations(companyProfile.id)
      ]);
      setUsers([...usersData]);
      setInvitations([...invData]);
    } catch {
      ue.error("Failed to load user data");
    } finally {
      setLoadingUsers(false);
    }
  }, [actor, companyProfile]);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  function openPermModal(user) {
    setPermModalUser(user);
    setSelectedPerms([...user.permissions]);
  }
  function togglePerm(id) {
    setSelectedPerms(
      (prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }
  async function savePermissions() {
    if (!actor || !permModalUser) return;
    setSavingPerms(true);
    try {
      const result = await actor.updateSecondaryAdminPermissions(
        permModalUser.id,
        selectedPerms
      );
      if (result.__kind__ === "ok") {
        ue.success("Permissions updated");
        setPermModalUser(null);
        await loadData();
      } else ue.error(result.err);
    } catch {
      ue.error("Failed to update permissions");
    } finally {
      setSavingPerms(false);
    }
  }
  async function handleInvite() {
    if (!actor || !companyProfile) return;
    const emailDomain = inviteForm.email.split("@")[1];
    if (!emailDomain || emailDomain !== companyProfile.emailDomain) {
      ue.error(`Email must belong to @${companyProfile.emailDomain}`);
      return;
    }
    setInviting(true);
    try {
      const result = await actor.inviteUser({
        email: inviteForm.email.trim(),
        role: inviteForm.role,
        companyId: companyProfile.id
      });
      if (result.__kind__ === "ok") {
        ue.success(`Invitation sent to ${inviteForm.email}`);
        setInviteOpen(false);
        setInviteForm({ email: "", role: UserRole.VendorSecondaryAdmin });
        await loadData();
      } else ue.error(result.err);
    } catch {
      ue.error("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  }
  async function handleCancelInvite(id) {
    if (!actor) return;
    setCancellingId(id);
    try {
      const result = await actor.cancelInvitation(id);
      if (result.__kind__ === "ok") {
        ue.success("Invitation cancelled");
        await loadData();
      } else ue.error(result.err);
    } catch {
      ue.error("Failed to cancel invitation");
    } finally {
      setCancellingId(null);
    }
  }
  const roleLabel = (role) => {
    const map = {
      [UserRole.VendorAdmin]: "Vendor Admin",
      [UserRole.VendorPrimaryAdmin]: "Primary Admin",
      [UserRole.VendorSecondaryAdmin]: "Secondary Admin",
      [UserRole.ResellerAdmin]: "Reseller Admin",
      [UserRole.ResellerPrimaryAdmin]: "Reseller Primary Admin",
      [UserRole.ResellerSalesUser]: "Sales User",
      [UserRole.ReadOnlyViewer]: "Viewer"
    };
    return map[role] ?? role;
  };
  const pendingCount = invitations.filter((i) => i.status === "Pending").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", "data-ocid": "admin.users.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        users.length,
        " user",
        users.length !== 1 ? "s" : "",
        pendingCount > 0 ? ` · ${pendingCount} pending invite${pendingCount !== 1 ? "s" : ""}` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          className: "gap-1.5",
          onClick: () => setInviteOpen(true),
          "data-ocid": "admin.users.invite_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-3.5 h-3.5" }),
            "Invite User"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Team Members" }) }),
      loadingUsers ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "p-4 flex flex-col gap-2",
          "data-ocid": "admin.users.loading_state",
          children: ["s1", "s2", "s3"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-secondary/30" }, k))
        }
      ) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-10 gap-2",
          "data-ocid": "admin.users.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-10 h-10 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No users yet. Invite team members to get started." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["User", "Email", "Role", "Department", "Actions"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: users.map((user, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `admin.users.item.${idx + 1}`,
            className: `border-b border-border/50 hover:bg-secondary/20 transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent", children: getInitials(user.fullName) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: user.fullName }),
                  user.isPrimaryAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10px] text-accent font-semibold", children: "(Primary)" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: user.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-badge bg-accent/10 text-accent border border-accent/20", children: roleLabel(user.role) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: deptMap[user.id] || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: (user.role === UserRole.VendorSecondaryAdmin || user.role === UserRole.ResellerAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "border-border text-xs h-7",
                  onClick: () => openPermModal(user),
                  "data-ocid": `admin.manage_permissions.button.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-3.5 h-3.5 mr-1.5" }),
                    "Permissions"
                  ]
                }
              ) })
            ]
          },
          user.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DepartmentAllocation,
      {
        users: users.map((u) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: roleLabel(u.role),
          isPrimary: u.isPrimaryAdmin
        })),
        isPrimaryAdmin,
        orgType: "vendor",
        onDeptChange: (userId, dept) => setDeptMap((prev) => ({ ...prev, [userId]: dept }))
      }
    ),
    invitations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Pending Invitations" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["Email", "Role", "Invited By", "Expires", "Status", ""].map(
          (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
              children: h
            },
            h
          )
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: invitations.map((inv, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `admin.invitations.item.${idx + 1}`,
            className: `border-b border-border/50 hover:bg-secondary/20 transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground text-sm", children: inv.email })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-sm", children: roleLabel(inv.role) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-sm", children: inv.invitedBy }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs whitespace-nowrap", children: formatDate(inv.expiresAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InvBadge, { status: inv.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: inv.status === "Pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7",
                  disabled: cancellingId === inv.id,
                  onClick: () => handleCancelInvite(inv.id),
                  "data-ocid": `admin.invitations.cancel.button.${idx + 1}`,
                  children: "Cancel"
                }
              ) })
            ]
          },
          inv.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: inviteOpen, onOpenChange: setInviteOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-sm",
        "data-ocid": "admin.invite.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Invite User" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Email Address *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "email",
                  value: inviteForm.email,
                  onChange: (e) => setInviteForm((f) => ({ ...f, email: e.target.value })),
                  placeholder: `user@${(companyProfile == null ? void 0 : companyProfile.emailDomain) ?? "company.com"}`,
                  className: "crm-input",
                  "data-ocid": "admin.invite.email.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                "Must match @",
                (companyProfile == null ? void 0 : companyProfile.emailDomain) ?? "your company domain"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Role *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: inviteForm.role,
                  onChange: (e) => setInviteForm((f) => ({
                    ...f,
                    role: e.target.value
                  })),
                  className: "crm-input text-sm w-full px-3 py-2 bg-input border border-border rounded-[0.5rem] text-foreground",
                  "data-ocid": "admin.invite.role.select",
                  children: inviteRoleOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => setInviteOpen(false),
                "data-ocid": "admin.invite.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: handleInvite,
                disabled: inviting || !inviteForm.email,
                "data-ocid": "admin.invite.submit_button",
                children: inviting ? "Sending..." : "Send Invite"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!permModalUser,
        onOpenChange: () => setPermModalUser(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "bg-card border-border max-w-md",
            "data-ocid": "admin.permissions.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
                "Permissions — ",
                permModalUser == null ? void 0 : permModalUser.fullName
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All permissions are off by default. Enable only what this user needs." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 py-2 max-h-[340px] overflow-y-auto scrollbar-thin pr-1", children: ALL_PERMISSIONS.map((perm) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Checkbox,
                  {
                    id: perm.id,
                    checked: selectedPerms.includes(perm.id),
                    onCheckedChange: () => togglePerm(perm.id),
                    className: "border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent focus-visible:ring-accent",
                    "data-ocid": `admin.perm.${perm.id}.checkbox`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: perm.id,
                    className: "text-sm text-foreground cursor-pointer",
                    children: perm.label
                  }
                )
              ] }, perm.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    onClick: () => setPermModalUser(null),
                    "data-ocid": "admin.permissions.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    onClick: savePermissions,
                    disabled: savingPerms,
                    "data-ocid": "admin.permissions.save_button",
                    children: savingPerms ? "Saving..." : "Save Permissions"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
function AuditLogTab() {
  const { actor } = useActor();
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!actor) return;
    actor.getAuditLog(BigInt(200)).then((res) => {
      setEntries(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [actor]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center py-16",
        "data-ocid": "audit.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", "data-ocid": "audit.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Audit Log" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        entries.length,
        " entries"
      ] })
    ] }),
    entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16",
        "data-ocid": "audit.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-10 h-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No audit entries found" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["Action", "Entity", "ID", "User", "At", "Details"].map(
        (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap",
            children: h
          },
          h
        )
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.slice(0, 100).map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-muted/20",
          "data-ocid": `audit.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: formatAction(entry.action) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-badge bg-secondary/50 text-muted-foreground", children: entry.entityType }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "px-4 py-3 text-muted-foreground font-mono truncate max-w-[100px]",
                title: entry.entityId,
                children: entry.entityId
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: entry.userId }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: formatDate(entry.timestamp) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "px-4 py-3 text-muted-foreground truncate max-w-[200px]",
                title: entry.details,
                children: entry.details
              }
            )
          ]
        },
        entry.id
      )) })
    ] }) })
  ] }) });
}
function RecipientToggle({
  label,
  checked,
  onChange,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2.5 border-b border-border/30 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        "data-ocid": ocid,
        onClick: () => onChange(!checked),
        className: "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        style: { background: checked ? "#f97316" : "rgba(255,255,255,0.08)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
            style: {
              transform: checked ? "translateX(18px)" : "translateX(2px)"
            }
          }
        )
      }
    )
  ] });
}
function GapSeverityCard({ severity, config, onChange }) {
  const isCritical = severity === "Critical";
  const severityStyle = isCritical ? {
    background: "rgba(239,68,68,0.12)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.3)"
  } : {
    background: "rgba(251,146,60,0.12)",
    color: "#fb923c",
    border: "1px solid rgba(251,146,60,0.3)"
  };
  function patch(key, val) {
    onChange({ ...config, [key]: val });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl p-4 flex flex-col gap-3",
      style: {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)"
      },
      "data-ocid": `forgeai.gap_notif.${severity.toLowerCase()}_card`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wide",
              style: severityStyle,
              children: severity
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: isCritical ? "Critical engagement gaps — immediate action required" : "High engagement gaps — elevated risk detected" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecipientToggle,
            {
              label: "Account Owner",
              checked: config.accountOwner,
              onChange: (v) => patch("accountOwner", v),
              ocid: `forgeai.gap_notif.${severity.toLowerCase()}.account_owner.toggle`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecipientToggle,
            {
              label: "Primary Admin",
              checked: config.primaryAdmin,
              onChange: (v) => patch("primaryAdmin", v),
              ocid: `forgeai.gap_notif.${severity.toLowerCase()}.primary_admin.toggle`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecipientToggle,
            {
              label: "Assigned Distributor",
              checked: config.assignedDistributor,
              onChange: (v) => patch("assignedDistributor", v),
              ocid: `forgeai.gap_notif.${severity.toLowerCase()}.distributor.toggle`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecipientToggle,
            {
              label: "Assigned Reseller",
              checked: config.assignedReseller,
              onChange: (v) => patch("assignedReseller", v),
              ocid: `forgeai.gap_notif.${severity.toLowerCase()}.reseller.toggle`
            }
          )
        ] })
      ]
    }
  );
}
function GapNotificationConfigSection({
  open,
  onToggle
}) {
  const { config, updateConfig, loading, saving } = useGapNotificationConfig();
  const [local, setLocal] = reactExports.useState(config);
  reactExports.useEffect(() => {
    setLocal(config);
  }, [config]);
  async function handleSave() {
    try {
      await updateConfig(local);
      ue.success("Engagement gap notification settings saved");
    } catch {
      ue.error("Failed to save notification settings");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl overflow-hidden",
      style: { border: "1px solid rgba(255,255,255,0.08)" },
      "data-ocid": "forgeai.gap_notif.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: onToggle,
            className: "w-full flex items-center justify-between px-5 py-4 bg-card/50 hover:bg-card/80 transition-colors",
            "data-ocid": "forgeai.gap_notif.toggle",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-8 h-8 rounded-lg flex items-center justify-center",
                    style: { background: "rgba(249,115,22,0.12)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-4 h-4", style: { color: "#f97316" } })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "ForgeAI Engagement Gap Notifications" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Configure who receives in-app alerts when ForgeAI detects a reseller or distributor has become inactive" })
                ] })
              ] }),
              open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
            ]
          }
        ),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pt-2 pb-5 flex flex-col gap-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "forgeai.gap_notif.loading_state",
            className: "space-y-2 py-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GapSeverityCard,
              {
                severity: "Critical",
                config: local.critical,
                onChange: (cfg) => setLocal((prev) => ({ ...prev, critical: cfg }))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GapSeverityCard,
              {
                severity: "High",
                config: local.high,
                onChange: (cfg) => setLocal((prev) => ({ ...prev, high: cfg }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground/70 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block w-1 h-1 rounded-full flex-shrink-0",
                style: { background: "#f97316" }
              }
            ),
            "Alerts are sent at most once per account per 24 hours to prevent notification fatigue."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              disabled: saving,
              onClick: handleSave,
              "data-ocid": "forgeai.gap_notif.save_button",
              size: "sm",
              className: "gap-2 text-xs",
              style: { background: "#f97316" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-3.5 h-3.5" }),
                saving ? "Saving…" : "Save Notification Settings"
              ]
            }
          ) })
        ] }) })
      ]
    }
  );
}
function CustomerIdTab({ companyId }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "admin.customerids.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerIdConfig, { vendorId: companyId, isVendor: true }) });
}
const CAPABILITY_LABELS = {
  renewalRiskScoring: "Renewal Risk Scoring",
  engagementGapDetection: "Engagement Gap Detection",
  dealRegistrationAnalysis: "Deal Registration Analysis",
  channelHealthScoring: "Channel Health Scoring",
  incentiveIntelligence: "Incentive Intelligence",
  smartQuerySearch: "Smart Queries",
  messagingAssistance: "Messaging Assistance"
};
const CAPABILITY_DESCRIPTIONS = {
  renewalRiskScoring: "Analyze renewal dates, reseller activity, and pipeline engagement to score at-risk accounts",
  engagementGapDetection: "Detect when resellers, distributors, or accounts have been inactive beyond configured thresholds",
  dealRegistrationAnalysis: "Identify duplicate registrations, stalled approvals, and conflict detection across deals",
  channelHealthScoring: "Generate health scores and trend analysis for vendors, distributors, resellers, and accounts",
  incentiveIntelligence: "Surface best-fit promotions, renewal incentives, and upsell opportunities",
  smartQuerySearch: "Pre-built AI-assisted smart queries for operational intelligence searches",
  messagingAssistance: "Draft reseller outreach, renewal follow-ups, and QBR summaries inside messaging"
};
const RISK_TIER_COLORS = {
  Critical: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
  High: { bg: "rgba(251,146,60,0.12)", color: "#fb923c" },
  Medium: { bg: "rgba(234,179,8,0.12)", color: "#facc15" },
  Low: { bg: "rgba(100,140,220,0.12)", color: "#648CDC" },
  Opportunity: { bg: "rgba(52,211,153,0.12)", color: "#34d399" }
};
function ForgeAISettingsTab() {
  const { settings, updateSettings, auditLog } = useForgeAI();
  const [localSettings, setLocalSettings] = reactExports.useState(
    settings
  );
  const [auditLogLevel, setAuditLogLevel] = reactExports.useState("Recommended");
  const [gapNotifOpen, setGapNotifOpen] = reactExports.useState(true);
  const [capabilitiesOpen, setCapabilitiesOpen] = reactExports.useState(true);
  const [thresholdsOpen, setThresholdsOpen] = reactExports.useState(true);
  const [auditOpen, setAuditOpen] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const local = localSettings;
  function patchLocal(patch) {
    setLocalSettings((prev) => prev ? { ...prev, ...patch } : prev);
  }
  function patchCapability(key, value) {
    if (!local) return;
    setLocalSettings(
      (prev) => prev ? { ...prev, aiCapabilities: { ...prev.aiCapabilities, [key]: value } } : prev
    );
  }
  async function handleSave() {
    if (!local) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateSettings(local);
    setSaving(false);
    ue.success("ForgeAI settings saved");
  }
  if (!local) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center py-16",
        "data-ocid": "forgeai.settings.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 bg-secondary/30" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", "data-ocid": "forgeai.settings.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
          style: {
            background: "rgba(255,107,43,0.12)",
            border: "1px solid rgba(255,107,43,0.25)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4", style: { color: "#FF6B2B" } })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold font-display text-foreground", children: "ForgeAI Intelligence Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
              style: {
                background: "rgba(255,107,43,0.15)",
                color: "#FF6B2B",
                border: "1px solid rgba(255,107,43,0.3)"
              },
              children: "Primary Admin"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Configure AI capabilities, engagement thresholds, and audit logging for ForgeAI" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "ForgeAI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => patchLocal({ enabled: !local.enabled }),
            "data-ocid": "forgeai.master_toggle",
            "aria-label": local.enabled ? "Disable ForgeAI" : "Enable ForgeAI",
            className: "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
            style: {
              background: local.enabled ? "#FF6B2B" : "rgba(100,116,139,0.4)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm",
                style: {
                  transform: local.enabled ? "translateX(24px)" : "translateX(4px)"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-semibold w-6",
            style: { color: local.enabled ? "#FF6B2B" : "#64748b" },
            children: local.enabled ? "ON" : "OFF"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card overflow-hidden",
        "data-ocid": "forgeai.capabilities.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setCapabilitiesOpen((o) => !o),
              className: "w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/10 transition-colors",
              "data-ocid": "forgeai.capabilities.toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-4 h-4", style: { color: "#FF6B2B" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "AI Capabilities" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1", children: [
                    Object.values(local.aiCapabilities).filter(Boolean).length,
                    " of",
                    " ",
                    Object.values(local.aiCapabilities).length,
                    " enabled"
                  ] })
                ] }),
                capabilitiesOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
              ]
            }
          ),
          capabilitiesOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50", children: Object.keys(CAPABILITY_LABELS).map(
            (key, idx) => {
              const isEnabled = local.aiCapabilities[key];
              const isDisabled = !local.enabled;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-start gap-4 px-5 py-3.5 ${idx < Object.keys(CAPABILITY_LABELS).length - 1 ? "border-b border-border/30" : ""} ${isDisabled ? "opacity-50" : ""}`,
                  "data-ocid": `forgeai.capability.${key}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: CAPABILITY_LABELS[key] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: CAPABILITY_DESCRIPTIONS[key] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 mt-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] font-semibold w-6 text-right",
                          style: {
                            color: isEnabled && !isDisabled ? "#FF6B2B" : "#64748b"
                          },
                          children: isEnabled ? "ON" : "OFF"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          disabled: isDisabled,
                          onClick: () => patchCapability(key, !isEnabled),
                          "data-ocid": `forgeai.capability.${key}.toggle`,
                          "aria-label": `${isEnabled ? "Disable" : "Enable"} ${CAPABILITY_LABELS[key]}`,
                          className: "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed",
                          style: {
                            background: isEnabled && !isDisabled ? "#FF6B2B" : "rgba(100,116,139,0.4)"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm",
                              style: {
                                transform: isEnabled ? "translateX(20px)" : "translateX(3px)"
                              }
                            }
                          )
                        }
                      )
                    ] })
                  ]
                },
                key
              );
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card overflow-hidden",
        "data-ocid": "forgeai.thresholds.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setThresholdsOpen((o) => !o),
              className: "w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/10 transition-colors",
              "data-ocid": "forgeai.thresholds.toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4", style: { color: "#FF6B2B" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Engagement Gap Thresholds" })
                ] }),
                thresholdsOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
              ]
            }
          ),
          thresholdsOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground block", children: "Reseller Inactivity Threshold (days)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 7,
                  max: 365,
                  value: local.engagementGapThresholdReseller,
                  onChange: (e) => patchLocal({
                    engagementGapThresholdReseller: Math.min(
                      365,
                      Math.max(7, Number(e.target.value))
                    )
                  }),
                  className: "crm-input max-w-[160px]",
                  "data-ocid": "forgeai.thresholds.reseller.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Alert when a reseller has not engaged in this many days (7–365)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground block", children: "Distributor Inactivity Threshold (days)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 7,
                  max: 365,
                  value: local.engagementGapThresholdDistributor,
                  onChange: (e) => patchLocal({
                    engagementGapThresholdDistributor: Math.min(
                      365,
                      Math.max(7, Number(e.target.value))
                    )
                  }),
                  className: "crm-input max-w-[160px]",
                  "data-ocid": "forgeai.thresholds.distributor.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Alert when a distributor has not engaged in this many days (7–365)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground block", children: "Warning Threshold (days, first alert)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 7,
                  max: 90,
                  value: 14,
                  onChange: () => {
                  },
                  className: "crm-input max-w-[160px]",
                  "data-ocid": "forgeai.thresholds.warning.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "First-level warning before escalation fires (7–90)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground block", children: "Escalation Threshold (days)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 14,
                  max: 180,
                  value: local.escalationDays,
                  onChange: (e) => patchLocal({
                    escalationDays: Math.min(
                      180,
                      Math.max(14, Number(e.target.value))
                    )
                  }),
                  className: "crm-input max-w-[160px]",
                  "data-ocid": "forgeai.thresholds.escalation.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Days after warning before escalation alert is triggered (14–180)" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card overflow-hidden",
        "data-ocid": "forgeai.audit.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setAuditOpen((o) => !o),
              className: "w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/10 transition-colors",
              "data-ocid": "forgeai.audit.toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4", style: { color: "#FF6B2B" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Audit Logging" })
                ] }),
                auditOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
              ]
            }
          ),
          auditOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground block mb-2", children: "Audit Log Level" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ["Full", "Recommended", "Minimal"].map(
                (level) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setAuditLogLevel(level),
                    "data-ocid": `forgeai.audit.level.${level.toLowerCase()}`,
                    className: "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                    style: auditLogLevel === level ? {
                      background: "rgba(255,107,43,0.15)",
                      color: "#FF6B2B",
                      borderColor: "rgba(255,107,43,0.4)"
                    } : {
                      background: "transparent",
                      color: "#64748b",
                      borderColor: "rgba(100,116,139,0.2)"
                    },
                    children: level
                  },
                  level
                )
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-1.5", children: [
                auditLogLevel === "Full" && "Log all ForgeAI analyses, smart queries, and background processing",
                auditLogLevel === "Recommended" && "Log critical and high-risk analyses and all user-initiated queries",
                auditLogLevel === "Minimal" && "Log only user-initiated actions — no background analysis logging"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto scrollbar-thin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
                "Analysis Type",
                "Entity",
                "Risk Level",
                "Timestamp",
                "Triggered By"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-2.5 whitespace-nowrap",
                  children: h
                },
                h
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: auditLog.slice(0, 10).map((entry, idx) => {
                const tierCfg = RISK_TIER_COLORS[entry.riskLevel] ?? RISK_TIER_COLORS.Low;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: `border-b border-border/30 hover:bg-secondary/10 transition-colors ${idx % 2 === 1 ? "bg-secondary/5" : ""}`,
                    "data-ocid": `forgeai.audit.item.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-foreground font-medium", children: entry.analysisType }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "td",
                        {
                          className: "px-4 py-2.5 text-xs text-muted-foreground max-w-[160px] truncate",
                          title: entry.entityName,
                          children: entry.entityName
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] font-bold px-1.5 py-0.5 rounded",
                          style: {
                            background: tierCfg.bg,
                            color: tierCfg.color,
                            border: `1px solid ${tierCfg.color}30`
                          },
                          children: entry.riskLevel
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap", children: new Date(Number(entry.timestamp)).toLocaleString(
                        "en-GB",
                        { dateStyle: "short", timeStyle: "short" }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-muted-foreground", children: entry.triggeredBy })
                    ]
                  },
                  entry.entryId
                );
              }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-t border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "text-xs h-7 gap-1.5 text-muted-foreground hover:text-foreground",
                onClick: () => ue.info(
                  "Full ForgeAI audit log available in the ForgeAI dashboard"
                ),
                "data-ocid": "forgeai.audit.view_full_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                  "View Full Audit Log"
                ]
              }
            ) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      GapNotificationConfigSection,
      {
        open: gapNotifOpen,
        onToggle: () => setGapNotifOpen((v) => !v)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-4 flex gap-3",
        style: {
          background: "rgba(255,107,43,0.06)",
          border: "1px solid rgba(255,107,43,0.18)"
        },
        "data-ocid": "forgeai.sovereignty.card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ShieldCheck,
            {
              className: "w-4 h-4 flex-shrink-0 mt-0.5",
              style: { color: "#FF6B2B" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold", style: { color: "#FF6B2B" }, children: "AI Intelligence Without Losing Control" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "ForgeAI is designed around a sovereignty-first philosophy. All channel intelligence remains within approved organizational boundaries with full auditability and enterprise governance — no centralized SaaS processing." })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        disabled: saving,
        onClick: handleSave,
        "data-ocid": "forgeai.settings.save_button",
        className: "gap-2",
        style: { background: "#FF6B2B" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4" }),
          saving ? "Saving…" : "Save ForgeAI Settings"
        ]
      }
    ) })
  ] });
}
export {
  AdminSettings
};
