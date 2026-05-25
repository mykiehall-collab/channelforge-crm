import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  AuthSettings,
  FailedLoginEvent,
  LockedAccountInfo,
} from "../backend";
import { useActor } from "../hooks/useActor";
import { formatDate } from "../utils/channelforge";

const ORANGE = "#FF6B2B";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const TEXT_SOFT = "#A9B6C9";

type AuthTab = "password" | "mfa" | "security" | "sso";

const AUTH_TABS: { id: AuthTab; label: string }[] = [
  { id: "password", label: "Password" },
  { id: "mfa", label: "MFA" },
  { id: "security", label: "Security" },
  { id: "sso", label: "SSO" },
];

function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  dataOcid,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
  dataOcid?: string;
}) {
  const toggleId = `sw-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="flex items-center gap-3" data-ocid={dataOcid}>
      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        onClick={() => {
          if (!disabled) onChange(!checked);
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
        style={{
          background: checked ? ORANGE : "rgba(255,255,255,0.1)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          border: "none",
        }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
          style={{
            left: checked ? "calc(100% - 18px)" : "2px",
            background: "white",
          }}
        />
      </button>
      <label
        htmlFor={toggleId}
        className="text-sm cursor-pointer"
        style={{ color: TEXT_SOFT }}
      >
        {label}
      </label>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
  dataOcid,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  dataOcid?: string;
}) {
  const numId = `ni-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label
        htmlFor={numId}
        className="block text-[12px] font-semibold mb-1 uppercase tracking-[0.06em]"
        style={{ color: TEXT_MUTED }}
      >
        {label}
      </label>
      <input
        id={numId}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Math.min(max, Math.max(min, Number(e.target.value))))
        }
        disabled={disabled}
        data-ocid={dataOcid}
        className="w-32 rounded-lg px-3 py-2 text-sm outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${BORDER}`,
          color: "#E7EEF8",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,107,43,0.5)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = BORDER;
        }}
      />
    </div>
  );
}

const DEFAULT_AUTH_SETTINGS: AuthSettings = {
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
  internetIdentityEnabled: true,
};

interface Props {
  orgId: string;
}

export function AuthSettingsSection({ orgId }: Props) {
  const { actor } = useActor();
  const [tab, setTab] = useState<AuthTab>("password");
  const [settings, setSettings] = useState<AuthSettings>(DEFAULT_AUTH_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [lockedAccounts, setLockedAccounts] = useState<LockedAccountInfo[]>([]);
  const [loginHistory, setLoginHistory] = useState<FailedLoginEvent[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingLocked, setLoadingLocked] = useState(false);

  useEffect(() => {
    if (!actor || !orgId) return;
    actor
      .getAuthSettings(orgId)
      .then((s) => setSettings(s))
      .catch(() => {});
  }, [actor, orgId]);

  useEffect(() => {
    if (!actor || !orgId || tab !== "security") return;
    setLoadingLocked(true);
    actor
      .getLockedAccounts(orgId)
      .then(setLockedAccounts)
      .catch(() => {})
      .finally(() => setLoadingLocked(false));
  }, [actor, orgId, tab]);

  const updateSettings = useCallback((patch: Partial<AuthSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.updateAuthSettings(orgId, settings);
      if (result.__kind__ === "ok") {
        toast.success("Authentication settings saved.");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }, [actor, orgId, settings]);

  const handleUnlock = useCallback(
    async (userId: string) => {
      if (!actor) return;
      try {
        const result = await actor.unlockUserAccount(
          userId,
          "Admin manual unlock",
        );
        if (result.__kind__ === "ok") {
          setLockedAccounts((prev) => prev.filter((a) => a.userId !== userId));
          toast.success("Account unlocked.");
        } else {
          toast.error("Could not unlock account.");
        }
      } catch {
        toast.error("Unlock failed.");
      }
    },
    [actor],
  );

  const handleLoadHistory = useCallback(
    async (userId: string) => {
      if (!actor) return;
      try {
        const events = await actor.getFailedLoginHistory(userId, BigInt(20));
        setLoginHistory(events);
        setShowHistory(true);
      } catch {}
    },
    [actor],
  );

  const saveBtnStyle = {
    background: saving
      ? "rgba(255,107,43,0.5)"
      : `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
    color: "white",
    padding: "8px 20px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    border: "none",
    cursor: saving ? "not-allowed" : "pointer",
  };

  return (
    <div>
      {/* Tabs */}
      <div
        className="flex gap-1 p-1 mb-6 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {AUTH_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            data-ocid={`auth_settings.${t.id}.tab`}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: tab === t.id ? ORANGE : "transparent",
              color: tab === t.id ? "white" : TEXT_MUTED,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* PASSWORD TAB */}
      {tab === "password" && (
        <div className="flex flex-col gap-5">
          <ToggleSwitch
            checked={settings.passwordLoginEnabled}
            onChange={(v) => updateSettings({ passwordLoginEnabled: v })}
            label="Enable password login"
            dataOcid="auth_settings.password_login.toggle"
          />
          <div className="flex gap-4 flex-wrap">
            <NumberInput
              label="Min password length"
              value={Number(settings.passwordMinLength)}
              onChange={(v) => updateSettings({ passwordMinLength: BigInt(v) })}
              min={8}
              max={32}
              dataOcid="auth_settings.min_length.input"
            />
            <NumberInput
              label="Max password length"
              value={Number(settings.passwordMaxLength)}
              onChange={(v) => updateSettings({ passwordMaxLength: BigInt(v) })}
              min={8}
              max={128}
              dataOcid="auth_settings.max_length.input"
            />
          </div>
          <div className="flex gap-4 flex-wrap items-end">
            <NumberInput
              label="Password expiry (days, 0 = disabled)"
              value={Number(settings.passwordExpiryDays)}
              onChange={(v) =>
                updateSettings({ passwordExpiryDays: BigInt(v) })
              }
              min={0}
              max={365}
              dataOcid="auth_settings.expiry_days.input"
            />
            <NumberInput
              label="Prevent reuse (last N passwords)"
              value={Number(settings.passwordReusePreventCount)}
              onChange={(v) =>
                updateSettings({ passwordReusePreventCount: BigInt(v) })
              }
              min={3}
              max={12}
              dataOcid="auth_settings.reuse_count.input"
            />
          </div>
          <ToggleSwitch
            checked={settings.passwordComplexityRequired}
            onChange={(v) => updateSettings({ passwordComplexityRequired: v })}
            label="Require uppercase, lowercase, number, and symbol"
            dataOcid="auth_settings.complexity.toggle"
          />
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={saveBtnStyle}
              data-ocid="auth_settings.password.save_button"
            >
              {saving ? "Saving…" : "Save Password Settings"}
            </button>
          </div>
        </div>
      )}

      {/* MFA TAB */}
      {tab === "mfa" && (
        <div className="flex flex-col gap-5">
          <ToggleSwitch
            checked={settings.mfaEnabled}
            onChange={(v) => updateSettings({ mfaEnabled: v })}
            label="Enable MFA for organization"
            dataOcid="auth_settings.mfa_enabled.toggle"
          />
          {settings.mfaEnabled && (
            <>
              <ToggleSwitch
                checked={settings.mfaRequiredForAll}
                onChange={(v) => updateSettings({ mfaRequiredForAll: v })}
                label="Require MFA for all users"
                dataOcid="auth_settings.mfa_all.toggle"
              />
              <ToggleSwitch
                checked={settings.mfaRequiredForAdmins}
                onChange={(v) => updateSettings({ mfaRequiredForAdmins: v })}
                label="Require MFA for admins only"
                dataOcid="auth_settings.mfa_admins.toggle"
              />
              <ToggleSwitch
                checked={settings.mfaOptionalEnrollment}
                onChange={(v) => updateSettings({ mfaOptionalEnrollment: v })}
                label="Allow optional MFA enrollment"
                dataOcid="auth_settings.mfa_optional.toggle"
              />
              <NumberInput
                label="Grace period before MFA required (days)"
                value={Number(settings.mfaGracePeriodDays)}
                onChange={(v) =>
                  updateSettings({ mfaGracePeriodDays: BigInt(v) })
                }
                min={0}
                max={30}
                dataOcid="auth_settings.mfa_grace.input"
              />
            </>
          )}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={saveBtnStyle}
              data-ocid="auth_settings.mfa.save_button"
            >
              {saving ? "Saving…" : "Save MFA Settings"}
            </button>
          </div>
        </div>
      )}

      {/* SECURITY TAB */}
      {tab === "security" && (
        <div className="flex flex-col gap-5">
          <ToggleSwitch
            checked={settings.lockoutEnabled}
            onChange={(v) => updateSettings({ lockoutEnabled: v })}
            label="Enable account lockout"
            dataOcid="auth_settings.lockout_enabled.toggle"
          />
          {settings.lockoutEnabled && (
            <div className="flex gap-4 flex-wrap">
              <NumberInput
                label="Max failed attempts"
                value={Number(settings.maxFailedAttempts)}
                onChange={(v) =>
                  updateSettings({ maxFailedAttempts: BigInt(v) })
                }
                min={3}
                max={15}
                dataOcid="auth_settings.max_attempts.input"
              />
              <NumberInput
                label="Lockout duration (minutes)"
                value={Number(settings.lockoutDurationMinutes)}
                onChange={(v) =>
                  updateSettings({ lockoutDurationMinutes: BigInt(v) })
                }
                min={5}
                max={1440}
                dataOcid="auth_settings.lockout_duration.input"
              />
            </div>
          )}
          <ToggleSwitch
            checked={settings.permanentLockUntilReset}
            onChange={(v) => updateSettings({ permanentLockUntilReset: v })}
            label="Permanent lock until admin reset"
            dataOcid="auth_settings.permanent_lock.toggle"
          />
          <NumberInput
            label="Session timeout (minutes)"
            value={Number(settings.sessionTimeoutMinutes)}
            onChange={(v) =>
              updateSettings({ sessionTimeoutMinutes: BigInt(v) })
            }
            min={30}
            max={1440}
            dataOcid="auth_settings.session_timeout.input"
          />
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={saveBtnStyle}
              data-ocid="auth_settings.security.save_button"
            >
              {saving ? "Saving…" : "Save Security Settings"}
            </button>
          </div>

          {/* Locked accounts */}
          <div className="mt-4">
            <h3 className="text-sm font-bold mb-3" style={{ color: "#E7EEF8" }}>
              Locked Accounts
            </h3>
            {loadingLocked ? (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: TEXT_MUTED }}
              >
                <div
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: `${ORANGE} transparent transparent transparent`,
                  }}
                />
                Loading…
              </div>
            ) : lockedAccounts.length === 0 ? (
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                No locked accounts.
              </p>
            ) : (
              <div
                className="overflow-x-auto rounded-xl"
                style={{ border: `1px solid ${BORDER}` }}
              >
                <table
                  className="w-full text-sm"
                  data-ocid="auth_settings.locked_accounts.table"
                >
                  <thead>
                    <tr
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {[
                        "Email",
                        "Name",
                        "Locked At",
                        "Locked Until",
                        "Fails",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wide"
                          style={{ color: TEXT_MUTED }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lockedAccounts.map((a, idx) => (
                      <tr
                        key={a.userId}
                        data-ocid={`auth_settings.locked_account.${idx + 1}`}
                        onClick={() => handleLoadHistory(a.userId)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleLoadHistory(a.userId);
                          }
                        }}
                        title="Click to view failed login history"
                        style={{
                          borderBottom: "1px solid rgba(30,48,80,0.4)",
                          cursor: "pointer",
                        }}
                      >
                        <td className="px-4 py-3" style={{ color: "#E7EEF8" }}>
                          {a.email}
                        </td>
                        <td className="px-4 py-3" style={{ color: TEXT_SOFT }}>
                          {a.fullName}
                        </td>
                        <td
                          className="px-4 py-3 text-xs"
                          style={{ color: TEXT_MUTED }}
                        >
                          {formatDate(a.lockedAt)}
                        </td>
                        <td
                          className="px-4 py-3 text-xs"
                          style={{ color: TEXT_MUTED }}
                        >
                          {formatDate(a.lockedUntil)}
                        </td>
                        <td className="px-4 py-3" style={{ color: ORANGE }}>
                          {String(a.failedCount)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleUnlock(a.userId)}
                            data-ocid={`auth_settings.unlock.${idx + 1}`}
                            className="text-[12px] font-semibold transition-opacity hover:opacity-80"
                            style={{ color: ORANGE }}
                          >
                            Unlock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Failed login history */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowHistory((v) => !v)}
              data-ocid="auth_settings.history.toggle"
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: ORANGE }}
            >
              {showHistory ? "▲ Hide" : "▼ Show"} Failed Login History
            </button>
            {showHistory && (
              <div className="mt-3">
                {loginHistory.length === 0 ? (
                  <p className="text-sm" style={{ color: TEXT_MUTED }}>
                    Click a locked account above to view failed login history.
                  </p>
                ) : (
                  <div
                    className="overflow-x-auto rounded-xl"
                    style={{ border: `1px solid ${BORDER}` }}
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            borderBottom: `1px solid ${BORDER}`,
                          }}
                        >
                          {["Time", "Email", "Attempts", "Reason"].map((h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wide"
                              style={{ color: TEXT_MUTED }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {loginHistory.map((ev) => (
                          <tr
                            key={ev.id}
                            style={{
                              borderBottom: "1px solid rgba(30,48,80,0.4)",
                            }}
                          >
                            <td
                              className="px-4 py-2.5 text-xs"
                              style={{ color: TEXT_MUTED }}
                            >
                              {formatDate(ev.timestamp)}
                            </td>
                            <td
                              className="px-4 py-2.5"
                              style={{ color: TEXT_SOFT }}
                            >
                              {ev.email}
                            </td>
                            <td
                              className="px-4 py-2.5"
                              style={{ color: ORANGE }}
                            >
                              {String(ev.attemptCount)}
                            </td>
                            <td
                              className="px-4 py-2.5 text-xs"
                              style={{ color: TEXT_MUTED }}
                            >
                              {ev.reason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-[11px] mt-2" style={{ color: TEXT_MUTED }}>
                  Click a locked account above to view failed login history.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SSO TAB */}
      {tab === "sso" && (
        <div className="flex flex-col gap-5">
          {/* Banner */}
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(255,107,43,0.07)",
              border: "1px solid rgba(255,107,43,0.2)",
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: ORANGE }}>
              Enterprise SSO Coming Soon
            </p>
            <p className="text-[13px]" style={{ color: TEXT_MUTED }}>
              Advanced SSO provider setup will be available in a future
              enterprise authentication update.
            </p>
          </div>

          {/* Internet Identity (functional) */}
          <ToggleSwitch
            checked={settings.internetIdentityEnabled}
            onChange={(v) => updateSettings({ internetIdentityEnabled: v })}
            label="Enable Internet Identity login"
            dataOcid="auth_settings.ii_enabled.toggle"
          />

          {/* SSO toggle */}
          <ToggleSwitch
            checked={settings.ssoEnabled}
            onChange={(v) => updateSettings({ ssoEnabled: v })}
            label="Enable SSO (future providers)"
            disabled
            dataOcid="auth_settings.sso_enabled.toggle"
          />

          {/* Placeholder provider fields */}
          <fieldset disabled className="flex flex-col gap-4 opacity-40">
            <div>
              <label
                htmlFor="sso-provider-sel"
                className="block text-[12px] font-semibold mb-1 uppercase tracking-[0.06em]"
                style={{ color: TEXT_MUTED }}
              >
                Provider Type
              </label>
              <select
                id="sso-provider-sel"
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT_SOFT,
                }}
              >
                <option>Select provider…</option>
                <option>Okta</option>
                <option>Azure AD / Microsoft Entra ID</option>
                <option>Google Workspace</option>
                <option>SAML 2.0</option>
                <option>OpenID Connect</option>
              </select>
            </div>
            {[
              "Client ID",
              "Client Secret",
              "Issuer URL",
              "Metadata URL",
              "Callback URL",
            ].map((field) => (
              <div key={field}>
                <label
                  htmlFor={`sso-fld-${field}`}
                  className="block text-[12px] font-semibold mb-1 uppercase tracking-[0.06em]"
                  style={{ color: TEXT_MUTED }}
                >
                  {field}
                </label>
                <input
                  id={`sso-fld-${field}`}
                  type="text"
                  placeholder={`Enter ${field}…`}
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${BORDER}`,
                    color: TEXT_SOFT,
                  }}
                />
              </div>
            ))}
          </fieldset>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={saveBtnStyle}
              data-ocid="auth_settings.sso.save_button"
            >
              {saving ? "Saving…" : "Save SSO Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const _saveBtnStyle2 = {
  background: `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
  color: "white",
  padding: "8px 20px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 600 as const,
  border: "none",
  cursor: "pointer" as const,
};
