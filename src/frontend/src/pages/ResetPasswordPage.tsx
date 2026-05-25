import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const ORANGE = "#FF6B2B";
const BG_DEEP = "#060d18";
const BG_BASE = "#0b1220";
const BG_MID = "#0d1a2e";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const TEXT_SOFT = "#A9B6C9";

interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "" | "Weak" | "Fair" | "Good" | "Strong";
  color: string;
}

function calcStrength(pw: string): PasswordStrength {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score === 2) return { score: 2, label: "Fair", color: "#f97316" };
  if (score === 3) return { score: 3, label: "Good", color: "#eab308" };
  return { score: 4, label: "Strong", color: "#22c55e" };
}

const REQUIREMENTS = [
  { id: "len", label: "8+ characters", test: (pw: string) => pw.length >= 8 },
  {
    id: "upper",
    label: "Uppercase letter",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    id: "lower",
    label: "Lowercase letter",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  { id: "num", label: "Number", test: (pw: string) => /[0-9]/.test(pw) },
  {
    id: "sym",
    label: "Special character",
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
];

function ChannelForgeLogo() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-baseline leading-none"
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        <span className="font-black text-[24px]" style={{ color: "#C8D6E8" }}>
          CHANNEL
        </span>
        <span
          className="font-black text-[24px] forge-pulse"
          style={{ color: ORANGE }}
        >
          FORGE
        </span>
      </div>
      <div
        className="text-[9px] font-medium tracking-[0.28em] uppercase"
        style={{ color: "rgba(125,138,160,0.65)" }}
      >
        CRM
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [token, setToken] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => calcStrength(newPassword), [newPassword]);

  const allMet = REQUIREMENTS.every((r) => r.test(newPassword));

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!actor) {
        setError("Service unavailable. Please refresh.");
        return;
      }
      if (!allMet) {
        setError("Password does not meet requirements.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!token.trim()) {
        setError("Please enter your reset token.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const result = await actor.resetPasswordWithToken(
          token.trim(),
          newPassword,
          companyId,
        );
        if (result.__kind__ === "ok") {
          setSuccess(true);
          toast.success("Password reset successful. Please log in.");
          setTimeout(() => navigate({ to: "/login" }), 2500);
        } else {
          const err = result.err;
          if (
            err.__kind__ === "TokenInvalid" ||
            err.__kind__ === "TokenExpired"
          ) {
            setError("Invalid or expired token. Please generate a new one.");
          } else if (err.__kind__ === "TokenAlreadyUsed") {
            setError(
              "This token has already been used. Please generate a new one.",
            );
          } else if (err.__kind__ === "PasswordTooWeak") {
            setError(`Password too weak: ${err.PasswordTooWeak.join(", ")}.`);
          } else if (err.__kind__ === "PasswordReused") {
            setError(
              "This password was recently used. Please choose a different one.",
            );
          } else {
            setError("Reset failed. Please try again.");
          }
        }
      } catch {
        setError("Reset failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [actor, token, newPassword, confirmPassword, companyId, allMet, navigate],
  );

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${BORDER}`,
    color: "#E7EEF8",
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: `linear-gradient(160deg, ${BG_DEEP} 0%, ${BG_BASE} 100%)`,
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 size={48} style={{ color: "#22c55e" }} />
          <p className="text-xl font-bold" style={{ color: "#E7EEF8" }}>
            Password reset successful
          </p>
          <p className="text-sm" style={{ color: TEXT_MUTED }}>
            Redirecting to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(160deg, ${BG_DEEP} 0%, ${BG_BASE} 40%, ${BG_MID} 100%)`,
      }}
    >
      <header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{
          borderColor: "rgba(30,48,80,0.5)",
          background: "rgba(6,13,24,0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <ChannelForgeLogo />
        <button
          type="button"
          onClick={() => navigate({ to: "/forgot-password" })}
          className="text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: TEXT_MUTED }}
        >
          ← Generate new token
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px]">
          <div
            className="relative rounded-2xl p-8"
            style={{
              background: "rgba(13,26,46,0.92)",
              border: `1px solid ${BORDER}`,
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,107,43,0.7), transparent)",
              }}
            />

            <h1
              className="text-2xl font-black text-center mb-1"
              style={{
                color: "#E7EEF8",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Reset Password
            </h1>
            <p
              className="text-center text-[13px] mb-7"
              style={{ color: TEXT_MUTED }}
            >
              Enter your token and choose a new password
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Token */}
              <div>
                <label
                  htmlFor="rp-token"
                  className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                  style={{ color: TEXT_MUTED }}
                >
                  Reset Token
                </label>
                <input
                  id="rp-token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your reset token here"
                  disabled={loading}
                  data-ocid="reset_password.token.input"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none font-mono transition-all placeholder:opacity-40"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,107,43,0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = BORDER;
                  }}
                />
              </div>

              {/* Company ID */}
              <div>
                <label
                  htmlFor="rp-company"
                  className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                  style={{ color: TEXT_MUTED }}
                >
                  Organization ID{" "}
                  <span style={{ fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  id="rp-company"
                  type="text"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="e.g. your-company-id"
                  disabled={loading}
                  data-ocid="reset_password.company_id.input"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,107,43,0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = BORDER;
                  }}
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="rp-new"
                  className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                  style={{ color: TEXT_MUTED }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="rp-new"
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    data-ocid="reset_password.new_password.input"
                    className="w-full rounded-lg px-4 py-3 pr-11 text-sm outline-none transition-all placeholder:opacity-40"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,107,43,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    aria-label={showNew ? "Hide" : "Show"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80"
                    style={{ color: TEXT_SOFT }}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength bar */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((s) => (
                        <div
                          key={s}
                          className="flex-1 h-1 rounded-full transition-all"
                          style={{
                            background:
                              s <= strength.score
                                ? strength.color
                                : "rgba(255,255,255,0.08)",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-[11px]"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Password requirements */}
              {newPassword && (
                <div
                  className="rounded-lg p-3 grid grid-cols-2 gap-1.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${BORDER}`,
                  }}
                  data-ocid="reset_password.requirements"
                >
                  {REQUIREMENTS.map((req) => {
                    const met = req.test(newPassword);
                    return (
                      <div
                        key={req.id}
                        className="flex items-center gap-1.5 text-[11px]"
                        style={{ color: met ? "#22c55e" : TEXT_MUTED }}
                      >
                        <span>{met ? "✓" : "✗"}</span>
                        {req.label}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="rp-confirm"
                  className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                  style={{ color: TEXT_MUTED }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="rp-confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    data-ocid="reset_password.confirm_password.input"
                    className="w-full rounded-lg px-4 py-3 pr-11 text-sm outline-none transition-all placeholder:opacity-40"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,107,43,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Hide" : "Show"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80"
                    style={{ color: TEXT_SOFT }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] mt-1" style={{ color: "#ef4444" }}>
                    Passwords do not match
                  </p>
                )}
              </div>

              {error && (
                <div
                  className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
                  style={{
                    background: "rgba(220,60,60,0.12)",
                    border: "1px solid rgba(220,60,60,0.3)",
                    color: "#ff7b7b",
                  }}
                  data-ocid="reset_password.error_state"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !allMet}
                data-ocid="reset_password.submit_button"
                className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-all"
                style={{
                  background:
                    loading || !allMet
                      ? "rgba(255,107,43,0.4)"
                      : `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                  boxShadow:
                    loading || !allMet
                      ? "none"
                      : "0 4px 16px rgba(255,107,43,0.35)",
                  cursor: loading || !allMet ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Resetting…
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
