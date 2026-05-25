import { useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

const ORANGE = "#FF6B2B";
const BG_DEEP = "#060d18";
const BG_BASE = "#0b1220";
const BG_MID = "#0d1a2e";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const _TEXT_SOFT = "#A9B6C9";

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

/** 6-box OTP input */
function OTPInput({
  value,
  onChange,
  disabled,
}: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const arr = value.padEnd(6, " ").split("");
    arr[i] = digit || " ";
    const newVal = arr.join("").trimEnd();
    onChange(newVal);
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          data-ocid={`mfa.code.input.${i + 1}`}
          className="w-11 h-14 rounded-lg text-center text-xl font-bold outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1.5px solid ${value[i] ? ORANGE : BORDER}`,
            color: "#E7EEF8",
            caretColor: ORANGE,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = ORANGE;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = value[i] ? ORANGE : BORDER;
          }}
        />
      ))}
    </div>
  );
}

export function MFAChallengePage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [code, setCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pendingToken = sessionStorage.getItem("cf_pending_mfa_token") ?? "";
  const companyId = sessionStorage.getItem("cf_company_id") ?? "";

  const handleVerify = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!actor) {
        setError("Service unavailable. Please refresh.");
        return;
      }

      const submitCode = useRecovery ? recoveryCode.trim() : code;

      if (!useRecovery && submitCode.length !== 6) {
        setError("Please enter the 6-digit code from your authenticator app.");
        return;
      }
      if (useRecovery && !submitCode) {
        setError("Please enter a recovery code.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const result = await actor.validateMfaToken(
          pendingToken,
          submitCode,
          companyId,
        );
        if (result.__kind__ === "ok") {
          const session = result.ok;
          sessionStorage.setItem("cf_session_token", session.token);
          sessionStorage.setItem("cf_session_timestamp", String(Date.now()));
          sessionStorage.removeItem("cf_pending_mfa_token");
          navigate({ to: "/dashboard" });
        } else {
          const err = result.err;
          if (err.__kind__ === "MfaInvalidCode") {
            setError(
              useRecovery
                ? "Invalid recovery code."
                : "Invalid code — please check your authenticator app.",
            );
          } else if (
            err.__kind__ === "TokenExpired" ||
            err.__kind__ === "SessionExpired"
          ) {
            setError("Code expired — please log in again.");
          } else {
            setError("Verification failed. Please try again.");
          }
        }
      } catch {
        setError("Verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [actor, code, recoveryCode, useRecovery, pendingToken, companyId, navigate],
  );

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
          onClick={() => navigate({ to: "/login" })}
          className="text-xs font-medium hover:opacity-80 transition-opacity"
          style={{ color: TEXT_MUTED }}
        >
          ← Cancel
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
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

            <div className="flex justify-center mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(255,107,43,0.1)",
                  border: "1px solid rgba(255,107,43,0.25)",
                }}
              >
                <KeyRound size={22} style={{ color: ORANGE }} />
              </div>
            </div>

            <h1
              className="text-2xl font-black text-center mb-1"
              style={{
                color: "#E7EEF8",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Two-Factor Authentication
            </h1>
            <p
              className="text-center text-[13px] mb-7"
              style={{ color: TEXT_MUTED }}
            >
              {useRecovery
                ? "Enter a backup recovery code"
                : "Enter the 6-digit code from your authenticator app"}
            </p>

            <form onSubmit={handleVerify} className="flex flex-col gap-5">
              {!useRecovery ? (
                <OTPInput value={code} onChange={setCode} disabled={loading} />
              ) : (
                <div>
                  <label
                    htmlFor="mfa-recovery"
                    className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                    style={{ color: TEXT_MUTED }}
                  >
                    Recovery Code
                  </label>
                  <input
                    id="mfa-recovery"
                    type="text"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="xxxx-xxxx-xxxx"
                    disabled={loading}
                    data-ocid="mfa.recovery_code.input"
                    className="w-full rounded-lg px-4 py-3 text-sm font-mono outline-none transition-all placeholder:opacity-40"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${BORDER}`,
                      color: "#E7EEF8",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,107,43,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                    }}
                  />
                </div>
              )}

              {error && (
                <div
                  className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
                  style={{
                    background: "rgba(220,60,60,0.12)",
                    border: "1px solid rgba(220,60,60,0.3)",
                    color: "#ff7b7b",
                  }}
                  data-ocid="mfa.error_state"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                data-ocid="mfa.submit_button"
                className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-all"
                style={{
                  background: loading
                    ? "rgba(255,107,43,0.6)"
                    : `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                  boxShadow: loading
                    ? "none"
                    : "0 4px 16px rgba(255,107,43,0.35)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Verifying…
                  </>
                ) : (
                  "Verify"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setUseRecovery((v) => !v);
                  setError("");
                  setCode("");
                  setRecoveryCode("");
                }}
                data-ocid="mfa.toggle_recovery.button"
                className="text-center text-[12px] transition-opacity hover:opacity-80"
                style={{ color: ORANGE }}
              >
                {useRecovery
                  ? "Use authenticator code instead"
                  : "Use a recovery code instead"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
