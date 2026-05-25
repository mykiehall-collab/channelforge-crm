import { CheckCircle2, Copy, Download } from "lucide-react";
import React from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

const ORANGE = "#FF6B2B";
const _BG_DEEP = "#060d18";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const TEXT_SOFT = "#A9B6C9";

interface Props {
  sessionToken: string;
  onClose: () => void;
  onComplete: () => void;
}

type SetupStep = "qr" | "verify" | "codes";

function StepIndicator({ current }: { current: SetupStep }) {
  const steps: { id: SetupStep; label: string }[] = [
    { id: "qr", label: "Scan QR" },
    { id: "verify", label: "Verify" },
    { id: "codes", label: "Save Codes" },
  ];
  const idx = steps.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-2 mb-7">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: i <= idx ? ORANGE : "rgba(255,255,255,0.08)",
                color: i <= idx ? "white" : TEXT_MUTED,
              }}
            >
              {i < idx ? "✓" : i + 1}
            </div>
            <span
              className="text-[11px]"
              style={{ color: i <= idx ? TEXT_SOFT : TEXT_MUTED }}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-px"
              style={{ background: i < idx ? ORANGE : BORDER }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function MFASetupModal({ sessionToken, onClose, onComplete }: Props) {
  const { actor } = useActor();

  const [step, setStep] = useState<SetupStep>("qr");
  const [qrUrl, setQrUrl] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [savedConfirmed, setSavedConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  // Step 1: fetch QR code
  const fetchQR = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError("");
    try {
      const result = await actor.setupMfa(sessionToken);
      if (result.__kind__ === "ok") {
        setQrUrl(result.ok.qrCodeUrl);
        setTotpSecret(result.ok.totpSecret);
      } else {
        setError("Could not set up MFA. Please try again.");
      }
    } catch {
      setError("Failed to initialize MFA setup.");
    } finally {
      setLoading(false);
    }
  }, [actor, sessionToken]);

  // Fetch on first render
  const [fetched, setFetched] = useState(false);
  if (!fetched) {
    setFetched(true);
    fetchQR();
  }

  // Step 2: verify enrollment
  const handleVerify = useCallback(async () => {
    if (!actor) return;
    if (verifyCode.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await actor.verifyMfaEnrollment(sessionToken, verifyCode);
      if (result.__kind__ === "ok") {
        setRecoveryCodes(result.ok);
        setStep("codes");
      } else {
        const err = result.err;
        if (err.__kind__ === "MfaInvalidCode") {
          setError("Invalid code. Please check your authenticator app.");
        } else {
          setError("Verification failed. Please try again.");
        }
      }
    } catch {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  }, [actor, sessionToken, verifyCode]);

  const handleDownloadCodes = useCallback(() => {
    const content = `CHANNELFORGE MFA Recovery Codes\nGenerated: ${new Date().toISOString()}\n\n${recoveryCodes.join("\n")}\n\nEach code can only be used once. Store securely.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "channelforge-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [recoveryCodes]);

  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(recoveryCodes.join("\n")).then(() => {
      toast.success("Recovery codes copied!");
    });
  }, [recoveryCodes]);

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${BORDER}`,
    color: "#E7EEF8",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,13,24,0.92)", backdropFilter: "blur(6px)" }}
      data-ocid="mfa_setup.dialog"
    >
      <div
        className="relative w-full max-w-[480px] rounded-2xl p-8"
        style={{
          background: "rgba(11,18,32,0.98)",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Orange top edge */}
        <div
          className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,107,43,0.7), transparent)",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg font-black"
            style={{
              color: "#E7EEF8",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            Set Up Two-Factor Authentication
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="mfa_setup.close_button"
            aria-label="Close"
            className="text-lg font-bold hover:opacity-70 transition-opacity"
            style={{ color: TEXT_MUTED }}
          >
            ✕
          </button>
        </div>

        <StepIndicator current={step} />

        {/* Step 1: QR code */}
        {step === "qr" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: TEXT_MUTED }}>
              Open your authenticator app (Google Authenticator, Microsoft
              Authenticator, Authy, or 1Password) and scan the QR code below.
            </p>

            {loading && (
              <div className="flex items-center justify-center py-10">
                <div
                  className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: `${ORANGE} transparent transparent transparent`,
                  }}
                />
              </div>
            )}

            {qrUrl && (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-xl" style={{ background: "white" }}>
                  <img src={qrUrl} alt="MFA QR code" className="w-40 h-40" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowSecret((v) => !v)}
                  className="text-[12px] transition-opacity hover:opacity-80"
                  style={{ color: ORANGE }}
                >
                  {showSecret ? "Hide" : "Can't scan? Show"} manual key
                </button>

                {showSecret && (
                  <div
                    className="w-full p-3 rounded-lg font-mono text-[12px] break-all text-center"
                    style={{
                      background: "rgba(6,13,24,0.9)",
                      border: `1px solid ${BORDER}`,
                      color: ORANGE,
                    }}
                  >
                    {totpSecret}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div
                className="px-3 py-2.5 rounded-lg text-sm"
                style={{
                  background: "rgba(220,60,60,0.12)",
                  border: "1px solid rgba(220,60,60,0.3)",
                  color: "#ff7b7b",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep("verify")}
              disabled={!qrUrl}
              data-ocid="mfa_setup.next_button"
              className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-all"
              style={{
                background: !qrUrl
                  ? "rgba(255,107,43,0.4)"
                  : `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                cursor: !qrUrl ? "not-allowed" : "pointer",
              }}
            >
              I've scanned the code →
            </button>
          </div>
        )}

        {/* Step 2: Verify */}
        {step === "verify" && (
          <div className="flex flex-col gap-4">
            <p className="text-sm" style={{ color: TEXT_MUTED }}>
              Enter the 6-digit code shown in your authenticator app to confirm
              setup.
            </p>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={verifyCode}
              onChange={(e) =>
                setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              data-ocid="mfa_setup.verify_code.input"
              className="w-full rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-[0.3em] outline-none transition-all"
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,107,43,0.5)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = BORDER;
              }}
            />

            {error && (
              <div
                className="px-3 py-2.5 rounded-lg text-sm"
                style={{
                  background: "rgba(220,60,60,0.12)",
                  border: "1px solid rgba(220,60,60,0.3)",
                  color: "#ff7b7b",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || verifyCode.length !== 6}
              data-ocid="mfa_setup.verify_button"
              className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-all"
              style={{
                background:
                  loading || verifyCode.length !== 6
                    ? "rgba(255,107,43,0.4)"
                    : `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                cursor:
                  loading || verifyCode.length !== 6
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Verifying…
                </>
              ) : (
                "Verify and Enable MFA"
              )}
            </button>
          </div>
        )}

        {/* Step 3: Recovery codes */}
        {step === "codes" && (
          <div className="flex flex-col gap-4">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{
                background: "rgba(60,180,80,0.1)",
                border: "1px solid rgba(60,180,80,0.3)",
                color: "#6ee798",
              }}
            >
              <CheckCircle2 size={14} /> MFA enabled successfully!
            </div>

            <p className="text-sm" style={{ color: TEXT_MUTED }}>
              Save these backup codes. Each can only be used once. Store them
              securely.
            </p>

            <div
              className="grid grid-cols-2 gap-2 p-4 rounded-lg"
              style={{
                background: "rgba(6,13,24,0.8)",
                border: `1px solid ${BORDER}`,
              }}
              data-ocid="mfa_setup.recovery_codes"
            >
              {recoveryCodes.map((code, _i) => (
                <div
                  key={code}
                  className="font-mono text-[13px] text-center py-1.5 rounded"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: ORANGE,
                  }}
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadCodes}
                data-ocid="mfa_setup.download_codes.button"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,107,43,0.1)",
                  border: "1px solid rgba(255,107,43,0.3)",
                  color: ORANGE,
                }}
              >
                <Download size={14} /> Download
              </button>
              <button
                type="button"
                onClick={handleCopyAll}
                data-ocid="mfa_setup.copy_codes.button"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${BORDER}`,
                  color: TEXT_SOFT,
                }}
              >
                <Copy size={14} /> Copy All
              </button>
            </div>

            <label
              className="flex items-center gap-2.5 cursor-pointer"
              data-ocid="mfa_setup.saved_confirm.checkbox"
            >
              <input
                type="checkbox"
                checked={savedConfirmed}
                onChange={(e) => setSavedConfirmed(e.target.checked)}
                className="rounded"
                style={{ accentColor: ORANGE }}
              />
              <span className="text-[13px]" style={{ color: TEXT_SOFT }}>
                I have saved my recovery codes securely
              </span>
            </label>

            <button
              type="button"
              onClick={onComplete}
              disabled={!savedConfirmed}
              data-ocid="mfa_setup.done_button"
              className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-all"
              style={{
                background: !savedConfirmed
                  ? "rgba(255,107,43,0.4)"
                  : `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                cursor: !savedConfirmed ? "not-allowed" : "pointer",
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
