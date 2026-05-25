import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { CompanyType } from "../backend";
import { useActor } from "../hooks/useActor";

const ORANGE = "#FF6B2B";
const BG_DEEP = "#060d18";
const BG_BASE = "#0b1220";
const BG_MID = "#0d1a2e";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const TEXT_SOFT = "#A9B6C9";

// ─── Backend unavailability detection ─────────────────────────────────────────
// Covers IC0508 (canister stopped), replica rejections, and fetch failures.
// Used in both handleSubmit and performTestLogin to show a consistent friendly
// message instead of raw error text.
export function detectBackendUnavailable(error: unknown): boolean {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : JSON.stringify(error ?? "");
  const lower = msg.toLowerCase();
  return (
    lower.includes("ic0508") ||
    lower.includes("canister is stopped") ||
    lower.includes("canister stopped") ||
    lower.includes("reject_code: 5") ||
    lower.includes("reject code: 5") ||
    lower.includes('reject_code":5') ||
    lower.includes("non_replicated_rejection") ||
    lower.includes("replica returned a rejection") ||
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("load failed") ||
    lower.includes("fetch failed") ||
    (error instanceof TypeError && lower.includes("fetch"))
  );
}

const BACKEND_UNAVAILABLE_MSG =
  "The service is temporarily unavailable. Our team has been notified and it will be back up shortly. Please try again in a few minutes.";

export type LoginRole = "Vendor" | "Distributor" | "Reseller";

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
        <span
          className="font-black text-[24px]"
          style={{
            color: "#C8D6E8",
            textShadow: "0 1px 2px rgba(255,255,255,0.15)",
          }}
        >
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

const UNAVAILABLE_KEYWORDS = ["temporarily unavailable", "back up shortly"];

function AuthErrorMessage({ error }: { error: string }) {
  if (!error) return null;
  const isUnavailable = UNAVAILABLE_KEYWORDS.some((kw) =>
    error.toLowerCase().includes(kw),
  );
  return (
    <div
      className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
      style={{
        background: isUnavailable
          ? "rgba(255,107,43,0.10)"
          : "rgba(220,60,60,0.12)",
        border: isUnavailable
          ? "1px solid rgba(255,107,43,0.35)"
          : "1px solid rgba(220,60,60,0.3)",
        color: isUnavailable ? "#FFB07A" : "#ff7b7b",
      }}
      data-ocid="login.error_state"
      role="alert"
      aria-live="polite"
    >
      {isUnavailable ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className="mt-0.5 flex-shrink-0"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="#FF6B2B" strokeWidth="1.5" />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="13"
            stroke="#FF6B2B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.5" r="1" fill="#FF6B2B" />
        </svg>
      ) : (
        <Lock size={14} className="mt-0.5 flex-shrink-0" />
      )}
      <span>{error}</span>
    </div>
  );
}

const ROLE_CONFIG: Record<
  LoginRole,
  {
    title: string;
    subtitle: string;
    companyType: CompanyType;
    setupPath: string;
  }
> = {
  Vendor: {
    title: "Vendor Login",
    subtitle: "Command center & partner oversight",
    companyType: CompanyType.Vendor,
    setupPath: "/onboarding",
  },
  Distributor: {
    title: "Distributor Login",
    subtitle: "Multi-vendor distribution operations",
    companyType: CompanyType.Distributor,
    setupPath: "/distributor-setup",
  },
  Reseller: {
    title: "Reseller Login",
    subtitle: "Partner workspace & sales activity",
    companyType: CompanyType.Reseller,
    setupPath: "/reseller-setup",
  },
};

function formatLockoutError(lockedUntil: bigint): string {
  const ms = Number(lockedUntil) / 1_000_000;
  const date = new Date(ms);
  const now = Date.now();
  const diffMs = date.getTime() - now;
  if (diffMs <= 0) return "Account temporarily locked. Please try again.";
  const diffMin = Math.ceil(diffMs / 60_000);
  if (diffMin < 60)
    return `Account locked for ${diffMin} more minute${diffMin !== 1 ? "s" : ""}.`;
  return `Account locked until ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`;
}

const FORGEAI_VALUE_POINTS = [
  "AI-powered renewal risk detection",
  "Intelligent reseller & distributor insights",
  "Deal registration intelligence",
  "Channel health scoring",
  "Operational recommendations in real time",
  "Sovereign-first enterprise architecture",
];

function ForgeAIPanel() {
  return (
    <>
      <style>{`
        @keyframes forgeai-network-pulse {
          0%, 100% { border-color: rgba(255,107,43,0.1); box-shadow: 0 0 20px rgba(255,107,43,0.04); }
          50%       { border-color: rgba(255,107,43,0.3); box-shadow: 0 0 28px rgba(255,107,43,0.10); }
        }
        .forgeai-login-panel {
          animation: forgeai-network-pulse 2s ease-in-out infinite alternate;
        }
      `}</style>
      <div
        className="forgeai-login-panel w-full max-w-[400px] rounded-2xl p-7 flex flex-col gap-5"
        data-ocid="forgeai.intro_panel"
        style={{
          background: "rgba(11,18,32,0.92)",
          border: "1px solid rgba(255,107,43,0.15)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Top label */}
        <div className="flex items-center gap-2.5">
          <span
            className="text-[12px] font-black tracking-[0.14em] uppercase"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: ORANGE,
            }}
          >
            ForgeAI
          </span>
          <span className="forgeai-pulse-dot" />
        </div>

        {/* Headline */}
        <div>
          <h2
            className="text-[15px] font-bold leading-snug mb-3"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "#E7EEF8",
              letterSpacing: "-0.01em",
            }}
          >
            ForgeAI — Intelligence for Modern Channel Operations
          </h2>
          <p
            className="text-[12px] leading-relaxed"
            style={{ color: TEXT_MUTED, lineHeight: "1.65" }}
          >
            ForgeAI transforms CHANNELFORGE from a traditional CRM into an
            intelligent operational platform for Vendors, Distributors, and
            Resellers. Monitor renewal risk, reseller engagement, deal
            registrations, pipeline health, pricing opportunities, and channel
            performance in real time through AI-powered operational intelligence
            designed specifically for complex channel ecosystems.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(30,48,80,0.8)" }} />

        {/* Value points */}
        <ul className="flex flex-col gap-2.5">
          {FORGEAI_VALUE_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <span
                className="mt-[4px] w-[6px] h-[6px] rounded-full flex-shrink-0"
                style={{ background: ORANGE, opacity: 0.85 }}
              />
              <span
                className="text-[12px] leading-snug"
                style={{ color: TEXT_SOFT }}
              >
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* Sovereignty tag */}
        <div
          className="mt-1 text-[10px] uppercase tracking-[0.12em] font-semibold"
          style={{ color: "rgba(255,107,43,0.45)" }}
        >
          Sovereignty-first · Audit-ready · Enterprise-grade
        </div>
      </div>
    </>
  );
}

// TODO-SECURITY: Remove TEST_ACCOUNTS before live launch
const TEST_ACCOUNTS = [
  {
    label: "Vendor Admin",
    email: "vendor@test.channelforge.net",
    password: "Test1234!",
    companyId: "test-vendor-001",
  },
  {
    label: "Distributor Admin",
    email: "distributor@test.channelforge.net",
    password: "Test1234!",
    companyId: "test-distributor-001",
  },
  {
    label: "Reseller Admin",
    email: "reseller@test.channelforge.net",
    password: "Test1234!",
    companyId: "test-reseller-001",
  },
] as const;

interface Props {
  loginRole?: LoginRole;
}

export function LoginPage({ loginRole = "Vendor" }: Props) {
  const navigate = useNavigate();
  const { actor } = useActor();
  const cfg = ROLE_CONFIG[loginRole];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [showCompanyId, setShowCompanyId] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // TODO-SECURITY: Remove test panel before live launch
  const [testPanelOpen, setTestPanelOpen] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!actor) {
        setError(BACKEND_UNAVAILABLE_MSG);
        return;
      }
      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const result = await actor.loginWithEmailPassword(
          email,
          password,
          cfg.companyType,
          companyId,
        );
        if (result.__kind__ === "ok") {
          const session = result.ok;
          const store = rememberMe ? localStorage : sessionStorage;
          store.setItem("cf_session_token", session.token);
          store.setItem("cf_session_timestamp", String(Date.now()));
          store.setItem("cf_company_type", session.companyType);
          store.setItem("cf_company_id", session.companyId);
          if (session.isPendingMfa) {
            sessionStorage.setItem("cf_pending_mfa_token", session.token);
            navigate({ to: "/mfa-challenge" });
          } else {
            navigate({ to: "/dashboard" });
          }
        } else {
          const err = result.err;
          if (err.__kind__ === "AccountLocked") {
            setError(formatLockoutError(err.AccountLocked.lockedUntil));
          } else if (err.__kind__ === "InvalidCredentials") {
            setError("Invalid email or password.");
          } else if (err.__kind__ === "AccountInactive") {
            setError("Your account is not active. Contact your admin.");
          } else if (err.__kind__ === "MfaRequired") {
            setError("MFA required — check your authenticator app.");
          } else if (err.__kind__ === "UserNotFound") {
            setError("Email domain not recognized. Contact your admin.");
          } else if (err.__kind__ === "PasswordAuthDisabled") {
            setError("Password login is disabled for your organization.");
          } else {
            setError("Login failed. Please try again.");
          }
        }
      } catch (ex) {
        if (detectBackendUnavailable(ex)) {
          setError(BACKEND_UNAVAILABLE_MSG);
        } else {
          setError("Authentication failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [actor, email, password, cfg.companyType, companyId, navigate, rememberMe],
  );

  // TODO-SECURITY: Remove performTestLogin and handleUseTestAccount before live launch
  const performTestLogin = useCallback(
    async (testEmail: string, testPassword: string, testCompanyId: string) => {
      if (!actor) {
        setError(BACKEND_UNAVAILABLE_MSG);
        return;
      }
      // Update form fields so the user can see what was used
      setEmail(testEmail);
      setPassword(testPassword);
      setCompanyId(testCompanyId);
      setShowCompanyId(true);
      setTestPanelOpen(false);
      setLoading(true);
      setError("");
      try {
        const result = await actor.loginWithEmailPassword(
          testEmail,
          testPassword,
          cfg.companyType,
          testCompanyId,
        );
        if (result.__kind__ === "ok") {
          const session = result.ok;
          // Test logins always use sessionStorage (not persistent)
          sessionStorage.setItem("cf_session_token", session.token);
          sessionStorage.setItem("cf_session_timestamp", String(Date.now()));
          sessionStorage.setItem("cf_company_type", session.companyType);
          sessionStorage.setItem("cf_company_id", session.companyId);
          if (session.isPendingMfa) {
            sessionStorage.setItem("cf_pending_mfa_token", session.token);
            navigate({ to: "/mfa-challenge" });
          } else {
            navigate({ to: "/dashboard" });
          }
        } else {
          const err = result.err;
          if (err.__kind__ === "AccountLocked") {
            setError(formatLockoutError(err.AccountLocked.lockedUntil));
          } else if (err.__kind__ === "InvalidCredentials") {
            // TODO-SECURITY: Verbose error shown only in test environment
            setError(
              `Test login failed: invalid credentials. Ensure backend has seeded test accounts with email "${testEmail}" and companyId "${testCompanyId}".`,
            );
          } else if (err.__kind__ === "UserNotFound") {
            // TODO-SECURITY: Verbose error shown only in test environment
            setError(
              `Test account not found. Backend may need redeployment to seed test accounts. (companyId: ${testCompanyId})`,
            );
          } else {
            setError(
              `Test login failed: ${err.__kind__}. Check backend seed data.`,
            );
          }
        }
      } catch (ex) {
        // TODO-SECURITY: Show friendly message for backend unavailability; keep test panel open
        if (detectBackendUnavailable(ex)) {
          setError(BACKEND_UNAVAILABLE_MSG);
          // Re-open the test panel so the user can retry after canister restarts
          setTestPanelOpen(true);
        } else {
          // TODO-SECURITY: Verbose error shown in test environment only — remove before live launch
          setError(
            `Auth error: ${ex instanceof Error ? ex.message : String(ex)}`,
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [actor, cfg.companyType, navigate],
  );

  const handleUseTestAccount = useCallback(
    (testEmail: string, testPassword: string, testCompanyId: string) => {
      void performTestLogin(testEmail, testPassword, testCompanyId);
    },
    [performTestLogin],
  );

  const handleIILogin = useCallback(() => {
    toast.info(
      "Internet Identity login: complete your Internet Identity authentication.",
    );
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      data-ocid="login.page"
      style={{
        background: `linear-gradient(160deg, ${BG_DEEP} 0%, ${BG_BASE} 40%, ${BG_MID} 100%)`,
        colorScheme: "dark",
      }}
    >
      {/* Header — logo top-left, once only */}
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
          ← Back
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-10 max-w-[900px]">
          <div className="w-full max-w-[420px] flex-shrink-0">
            {/* Card */}
            <div
              className="relative rounded-2xl p-8"
              style={{
                background: "rgba(13,26,46,0.92)",
                border: `1px solid ${BORDER}`,
                backdropFilter: "blur(20px)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
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

              {/* Role badge */}
              <div className="flex justify-center mb-6">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1 rounded-full border"
                  style={{
                    borderColor: "rgba(255,107,43,0.35)",
                    background: "rgba(255,107,43,0.08)",
                    color: ORANGE,
                  }}
                >
                  {cfg.subtitle}
                </span>
              </div>

              <h1
                className="text-2xl font-black text-center mb-1"
                style={{
                  color: "#E7EEF8",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {cfg.title}
              </h1>
              <p
                className="text-center text-[13px] mb-7"
                style={{ color: TEXT_MUTED }}
              >
                Your Channel Data.{" "}
                <span style={{ color: ORANGE }}>Your Control.</span>
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                    style={{ color: TEXT_MUTED }}
                  >
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    disabled={loading}
                    data-ocid="login.email.input"
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
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

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                    style={{ color: TEXT_MUTED }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      data-ocid="login.password.input"
                      className="w-full rounded-lg px-4 py-3 pr-11 text-sm outline-none transition-all placeholder:opacity-40"
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
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity"
                      style={{ color: TEXT_SOFT }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Company ID (optional, shown on demand) */}
                {showCompanyId ? (
                  <div>
                    <label
                      htmlFor="login-company-id"
                      className="block text-[12px] font-semibold mb-1.5 uppercase tracking-[0.08em]"
                      style={{ color: TEXT_MUTED }}
                    >
                      Organization ID{" "}
                      <span style={{ color: TEXT_MUTED, fontWeight: 400 }}>
                        (optional)
                      </span>
                    </label>
                    <input
                      id="login-company-id"
                      type="text"
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      placeholder="e.g. ATEA0001 or company ID"
                      disabled={loading}
                      data-ocid="login.company_id.input"
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
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
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCompanyId(true)}
                    className="text-left text-[11px] transition-opacity hover:opacity-80"
                    style={{ color: TEXT_MUTED }}
                  >
                    + Enter Organization ID
                  </button>
                )}

                {/* Error */}
                <AuthErrorMessage error={error} />

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  data-ocid="login.submit_button"
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
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <Shield size={15} /> Sign In
                    </>
                  )}
                </button>

                {/* Remember me */}
                <label
                  className="flex items-start gap-2.5 cursor-pointer select-none"
                  data-ocid="login.remember_me.checkbox"
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mt-0.5 accent-[#FF6B2B] w-4 h-4 rounded cursor-pointer"
                  />
                  <span>
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: TEXT_SOFT }}
                    >
                      Remember me
                    </span>
                    <span
                      className="block text-[11px] mt-0.5"
                      style={{ color: TEXT_MUTED }}
                    >
                      (stays logged in for 7 days)
                    </span>
                  </span>
                </label>

                {/* Forgot password */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/forgot-password" })}
                    data-ocid="login.forgot_password.link"
                    className="text-[12px] transition-opacity hover:opacity-80"
                    style={{ color: ORANGE }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px" style={{ background: BORDER }} />
                  <span className="text-[11px]" style={{ color: TEXT_MUTED }}>
                    or continue with
                  </span>
                  <div className="flex-1 h-px" style={{ background: BORDER }} />
                </div>

                {/* Internet Identity */}
                <button
                  type="button"
                  onClick={handleIILogin}
                  data-ocid="login.internet_identity.button"
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "transparent",
                    border: "1.5px solid rgba(255,107,43,0.35)",
                    color: TEXT_SOFT,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke={ORANGE}
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx="12"
                      cy="12"
                      rx="4"
                      ry="10"
                      stroke={ORANGE}
                      strokeWidth="1.5"
                    />
                    <line
                      x1="2"
                      y1="12"
                      x2="22"
                      y2="12"
                      stroke={ORANGE}
                      strokeWidth="1.5"
                    />
                  </svg>
                  Sign in with Internet Identity
                </button>

                {/* SSO placeholder */}
                <div className="relative group">
                  <button
                    type="button"
                    disabled
                    data-ocid="login.sso.button"
                    className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold cursor-not-allowed"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(30,48,80,0.5)",
                      color: "rgba(125,138,160,0.4)",
                    }}
                  >
                    Sign in with SSO
                  </button>
                  <span
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded text-[11px] whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{
                      background: BG_DEEP,
                      border: `1px solid ${BORDER}`,
                      color: TEXT_SOFT,
                    }}
                  >
                    Enterprise SSO coming soon
                  </span>
                </div>
              </form>

              {/* TODO-SECURITY: Remove entire test login panel block before live launch */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setTestPanelOpen((v) => !v)}
                  disabled={loading}
                  data-ocid="login.test_panel.toggle"
                  className="w-full text-xs py-2 rounded-md border transition-colors"
                  style={{
                    background: "rgba(255,107,43,0.08)",
                    borderColor: "rgba(255,107,43,0.3)",
                    color: "rgba(255,107,43,0.8)",
                  }}
                >
                  🧪 {testPanelOpen ? "Hide" : "Show"} Test Accounts (Dev Only)
                </button>

                {testPanelOpen && (
                  <div
                    className="mt-3 rounded-lg p-3 space-y-2"
                    style={{
                      background: "rgba(255,107,43,0.06)",
                      border: "1px solid rgba(255,107,43,0.2)",
                    }}
                    data-ocid="login.test_panel"
                  >
                    <p
                      className="text-xs font-semibold mb-0.5"
                      style={{ color: "rgba(255,107,43,0.9)" }}
                    >
                      Test Environment — One-Click Login
                    </p>
                    <p
                      className="text-[10px] mb-2"
                      style={{ color: "rgba(125,138,160,0.65)" }}
                    >
                      Click a button to authenticate immediately — no form
                      submission needed.
                    </p>

                    {TEST_ACCOUNTS.map((acc) => (
                      <div
                        key={acc.email}
                        className="flex items-center justify-between rounded-md px-3 py-2"
                        style={{
                          background: "rgba(6,13,24,0.6)",
                          border: "1px solid rgba(255,107,43,0.15)",
                        }}
                      >
                        <div
                          className="text-xs"
                          style={{ color: "rgba(196,210,230,0.85)" }}
                        >
                          <p
                            className="font-semibold"
                            style={{ color: "rgba(255,107,43,0.9)" }}
                          >
                            {acc.label}
                          </p>
                          <p>{acc.email}</p>
                          <p style={{ color: "rgba(125,138,160,0.6)" }}>
                            ID: {acc.companyId}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleUseTestAccount(
                              acc.email,
                              acc.password,
                              acc.companyId,
                            )
                          }
                          disabled={loading}
                          data-ocid={`login.test_account.${acc.label.toLowerCase().replace(/ /g, "_")}`}
                          className="ml-3 text-xs px-3 py-1.5 rounded-md shrink-0 transition-colors flex items-center gap-1.5 font-semibold"
                          style={{
                            background: loading
                              ? "rgba(255,107,43,0.06)"
                              : "rgba(255,107,43,0.18)",
                            border: "1px solid rgba(255,107,43,0.4)",
                            color: loading
                              ? "rgba(255,107,43,0.4)"
                              : "rgba(255,107,43,0.95)",
                            cursor: loading ? "not-allowed" : "pointer",
                          }}
                        >
                          {loading ? (
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : null}
                          {loading ? "Signing in…" : "Login"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <p
              className="text-center text-[11px] mt-6"
              style={{ color: "rgba(125,138,160,0.4)" }}
            >
              Sovereign infrastructure · Enterprise-grade security · {loginRole}{" "}
              workspace
            </p>
          </div>

          {/* ForgeAI intro panel */}
          <ForgeAIPanel />
        </div>
      </div>
    </div>
  );
}
