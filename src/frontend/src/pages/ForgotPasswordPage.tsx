import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Copy, KeyRound } from "lucide-react";
import { useCallback, useState } from "react";
import { CompanyType } from "../backend";
import { useActor } from "../hooks/useActor";

const ORANGE = "#FF6B2B";
const BG_DEEP = "#060d18";
const BG_BASE = "#0b1220";
const BG_MID = "#0d1a2e";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const TEXT_SOFT = "#A9B6C9";

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

const COMPANY_TYPE_OPTIONS: { label: string; value: CompanyType }[] = [
  { label: "Vendor", value: CompanyType.Vendor },
  { label: "Distributor", value: CompanyType.Distributor },
  { label: "Reseller", value: CompanyType.Reseller },
];

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyType, setCompanyType] = useState<CompanyType>(
    CompanyType.Vendor,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!actor) {
        setError("Service unavailable. Please refresh.");
        return;
      }
      if (!email) {
        setError("Please enter your email address.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const result = await actor.forgotPassword(
          email,
          companyType,
          companyId,
        );
        if (result.__kind__ === "ok") {
          setResetToken(result.ok.id);
        } else {
          const err = result.err;
          if (err.__kind__ === "UserNotFound") {
            setError("Email address not found. Please check and try again.");
          } else if (err.__kind__ === "AccountInactive") {
            setError("Account is not active. Contact your admin.");
          } else {
            setError("Could not generate reset token. Please try again.");
          }
        }
      } catch {
        setError("Request failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [actor, email, companyType, companyId],
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(resetToken).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [resetToken]);

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${BORDER}`,
    color: "#E7EEF8",
  };

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
          ← Back to Login
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
              Password Reset
            </h1>
            <p
              className="text-center text-[13px] mb-7"
              style={{ color: TEXT_MUTED }}
            >
              Generate a secure single-use reset token
            </p>

            {!resetToken ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="fp-email"
                    className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                    style={{ color: TEXT_MUTED }}
                  >
                    Email Address
                  </label>
                  <input
                    id="fp-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    disabled={loading}
                    data-ocid="forgot_password.email.input"
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,107,43,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="fp-type"
                    className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                    style={{ color: TEXT_MUTED }}
                  >
                    Organization Type
                  </label>
                  <select
                    id="fp-type"
                    value={companyType}
                    onChange={(e) =>
                      setCompanyType(e.target.value as CompanyType)
                    }
                    disabled={loading}
                    data-ocid="forgot_password.company_type.select"
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {COMPANY_TYPE_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        style={{ background: BG_MID }}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fp-company-id"
                    className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                    style={{ color: TEXT_MUTED }}
                  >
                    Organization ID{" "}
                    <span style={{ fontWeight: 400, color: TEXT_MUTED }}>
                      (optional)
                    </span>
                  </label>
                  <input
                    id="fp-company-id"
                    type="text"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    placeholder="e.g. your-company-id"
                    disabled={loading}
                    data-ocid="forgot_password.company_id.input"
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,107,43,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                    }}
                  />
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
                    style={{
                      background: "rgba(220,60,60,0.12)",
                      border: "1px solid rgba(220,60,60,0.3)",
                      color: "#ff7b7b",
                    }}
                    data-ocid="forgot_password.error_state"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  data-ocid="forgot_password.submit_button"
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
                      Generating…
                    </>
                  ) : (
                    "Generate Reset Token"
                  )}
                </button>
              </form>
            ) : (
              /* Token display */
              <div className="flex flex-col gap-5">
                <div
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                  style={{
                    background: "rgba(60,180,80,0.1)",
                    border: "1px solid rgba(60,180,80,0.3)",
                    color: "#6ee798",
                  }}
                >
                  <CheckCircle2 size={15} />
                  Token generated successfully
                </div>

                <div>
                  <p
                    className="text-[12px] font-semibold mb-2 uppercase tracking-[0.08em]"
                    style={{ color: TEXT_MUTED }}
                  >
                    Your reset token (expires in 15 minutes):
                  </p>
                  <div
                    className="rounded-lg p-4 font-mono text-sm break-all select-all"
                    style={{
                      background: "rgba(6,13,24,0.9)",
                      border: `1px solid ${BORDER}`,
                      color: ORANGE,
                      letterSpacing: "0.06em",
                      wordBreak: "break-all",
                    }}
                    data-ocid="forgot_password.token_display"
                  >
                    {resetToken}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    data-ocid="forgot_password.copy_button"
                    className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all hover:opacity-80"
                    style={{
                      background: "rgba(255,107,43,0.1)",
                      border: "1px solid rgba(255,107,43,0.3)",
                      color: copied ? "#6ee798" : ORANGE,
                    }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={14} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy Token
                      </>
                    )}
                  </button>
                </div>

                <div
                  className="rounded-lg p-4 text-[12px] leading-relaxed"
                  style={{
                    background: "rgba(255,107,43,0.05)",
                    border: "1px solid rgba(255,107,43,0.15)",
                    color: TEXT_MUTED,
                  }}
                >
                  <strong style={{ color: TEXT_SOFT }}>Instructions:</strong>{" "}
                  Save this token securely. Go to the reset page and enter this
                  token along with your new password. This token can only be
                  used once and expires in 15 minutes.
                </div>

                <button
                  type="button"
                  onClick={() => navigate({ to: "/reset-password" })}
                  data-ocid="forgot_password.go_to_reset.link"
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                    boxShadow: "0 4px 16px rgba(255,107,43,0.35)",
                  }}
                >
                  Go to Password Reset →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
