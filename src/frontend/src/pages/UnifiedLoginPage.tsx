import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  Eye,
  GitBranch,
  Info,
  Layers,
  Lock,
  Network,
  Server,
  Shield,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import React, { useCallback, useState } from "react";

// ── Design tokens (inline constants — no hardcoded color classes in JSX) ────
const ORANGE = "#FF6B2B";
const BG_DEEP = "#060d18";
const BG_BASE = "#0b1220";
const BG_MID = "#0d1a2e";
const BORDER = "#1e3050";
const TEXT_MUTED = "#7D8AA0";
const TEXT_SOFT = "#A9B6C9";

// ── Shared micro-components ─────────────────────────────────────────────────
function ChannelForgeLogo({
  size = "md",
}: { size?: "sm" | "md" | "lg" | "xl" }) {
  const cfg = {
    sm: { channel: "text-[14px]", forge: "text-[14px]", crm: "text-[8px]" },
    md: { channel: "text-[18px]", forge: "text-[18px]", crm: "text-[10px]" },
    lg: { channel: "text-[26px]", forge: "text-[26px]", crm: "text-[11px]" },
    xl: { channel: "text-[38px]", forge: "text-[38px]", crm: "text-[14px]" },
  }[size];
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
          className={`font-black ${cfg.channel}`}
          style={{
            color: "#C8D6E8",
            textShadow: "0 1px 2px rgba(255,255,255,0.12)",
          }}
        >
          CHANNEL
        </span>
        <span
          className={`font-black forge-pulse ${cfg.forge}`}
          style={{ color: ORANGE }}
        >
          FORGE
        </span>
      </div>
      <div
        className={`${cfg.crm} font-medium tracking-[0.28em] uppercase`}
        style={{ color: "rgba(125,138,160,0.6)" }}
      >
        CRM
      </div>
    </div>
  );
}

function OrangeCheck() {
  return (
    <span
      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
      style={{
        background: "rgba(255,107,43,0.12)",
        border: "1px solid rgba(255,107,43,0.3)",
      }}
    >
      <svg
        width="10"
        height="8"
        viewBox="0 0 10 8"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 4l2.5 2.5L9 1"
          stroke={ORANGE}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────
const PRICING_TIERS = [
  {
    name: "Small",
    tagline:
      "For smaller operational ecosystems and moderate yearly workloads.",
    computeAllocation: "Starter Compute Allocation",
    storageAllocation: "Base Storage Allocation",
    aiCapacity: "Moderate AI Usage",
    users: "5–25 users / 1–3 admins",
    ecosystem: "Small Vendor / single Reseller",
    features: [
      "Starter Compute Credits",
      "Base Storage Allocation",
      "Moderate AI operational capacity",
      "Core channel workflows",
      "ForgeAI insights",
      "Account hierarchy management",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Medium",
    tagline:
      "For growing Vendor, Distributor, and Multi-Group Reseller operations.",
    computeAllocation: "Growth Compute Allocation",
    storageAllocation: "Standard Storage Allocation",
    aiCapacity: "Regular AI Usage",
    users: "25–150 users / 3–15 admins",
    ecosystem: "National Distributor / growing Vendor ecosystem",
    features: [
      "Growth Compute Credits",
      "Standard Storage Allocation",
      "Regular AI operational capacity",
      "Full channel ecosystem workflows",
      "Advanced ForgeAI intelligence",
      "Multi-tier hierarchy management",
      "Shared Infrastructure Billing",
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    name: "Large",
    tagline:
      "For enterprise-scale channel ecosystems and advanced operational intelligence.",
    computeAllocation: "Enterprise Compute Allocation",
    storageAllocation: "Enterprise Storage Allocation",
    aiCapacity: "High AI Usage",
    users: "150+ users / 15+ admins",
    ecosystem: "Global Distributor / enterprise channel networks",
    features: [
      "Enterprise Compute Credits",
      "Enterprise Storage Allocation",
      "High AI operational capacity",
      "Advanced operational reporting",
      "Sovereign infrastructure options",
      "Dedicated node readiness",
      "Full enterprise governance",
    ],
    popular: false,
    cta: "Contact Sales",
  },
];

const DIFFERENTIATORS = [
  "Sovereign-first architecture",
  "Operational visibility controls",
  "Vendor → Distributor → Reseller hierarchy",
  "ForgeAI operational intelligence",
  "Channel-specific workflows",
  "Renewal intelligence",
  "Deal registration management",
  "Operational governance",
  "Account allocation visibility",
  "MDF & promotion management",
  "AI-assisted operational workflows",
];

const WHY_FEATURES = [
  {
    icon: Zap,
    label: "Renewals",
    desc: "Track every renewal, risk-score accounts, and act before contracts lapse.",
  },
  {
    icon: Shield,
    label: "Deal Registrations",
    desc: "Streamlined approval workflows with full audit trail from submission to won.",
  },
  {
    icon: Eye,
    label: "Operational Visibility",
    desc: "Complete command-center view across all tiers in your channel ecosystem.",
  },
  {
    icon: Database,
    label: "Pricing Governance",
    desc: "Enforce pricing structures and approval flows across your partner network.",
  },
  {
    icon: Users,
    label: "Reseller Coordination",
    desc: "Manage, align, and motivate your reseller network with purpose-built tools.",
  },
  {
    icon: Sparkles,
    label: "Operational Intelligence",
    desc: "ForgeAI surfaces insights, risks, and next-best actions in real time.",
  },
];

const SOVEREIGNTY_CARDS = [
  {
    icon: Lock,
    title: "Operational Ownership",
    desc: "Your data stays within your operational boundaries — not shared by default with third-party ecosystems.",
  },
  {
    icon: Eye,
    title: "Permission-Based Visibility",
    desc: "Access follows your hierarchy. Every account, report, and insight is earned through stakeholder alignment.",
  },
  {
    icon: GitBranch,
    title: "Stakeholder Alignment",
    desc: "Visibility is permission-governed across Vendor, Distributor, and Reseller tiers — not assumed or open.",
  },
];

const LOGIN_OPTIONS = [
  {
    id: "vendor" as const,
    title: "Vendor",
    subtitle: "Command center & partner oversight",
    description:
      "Manage Distributors, Resellers, customer operations, renewals, incentives, and channel intelligence.",
    route: "/vendor-login",
    icon: <Building2 size={26} />,
  },
  {
    id: "distributor" as const,
    title: "Distributor",
    subtitle: "Multi-vendor distribution operations",
    description:
      "Manage Vendor relationships, Resellers, regional operations, promotions, and channel execution.",
    route: "/distributor-login",
    icon: <Network size={26} />,
  },
  {
    id: "reseller" as const,
    title: "Reseller",
    subtitle: "Partner workspace & sales activity",
    description:
      "Manage customer accounts, renewals, opportunities, deal registrations, and pipeline activity.",
    route: "/reseller-login",
    icon: <Users size={26} />,
  },
];

// ── Main component ──────────────────────────────────────────────────────────
export function UnifiedLoginPage() {
  const navigate = useNavigate();
  const [showCloudEngineModal, setShowCloudEngineModal] = useState(false);

  const scrollToSignIn = useCallback(() => {
    document
      .getElementById("signin-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      className="ulp-root min-h-screen overflow-y-auto"
      style={{ background: BG_DEEP }}
    >
      {/* ── FIXED NAV ─────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(6,13,24,0.97)",
          borderColor: BORDER,
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="mx-auto px-6 h-[60px] flex items-center justify-between"
          style={{ maxWidth: "1280px" }}
        >
          <ChannelForgeLogo size="md" />
          <nav className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="ulp.nav.pricing.button"
              onClick={() => navigate({ to: "/pricing" })}
              className="ulp-ghost-btn text-[13px] font-medium px-4 py-1.5 rounded-lg border transition-all duration-200"
              style={{
                borderColor: BORDER,
                color: TEXT_SOFT,
                background: "transparent",
              }}
            >
              Explore Plans
            </button>
            <button
              type="button"
              data-ocid="ulp.nav.signin.button"
              onClick={scrollToSignIn}
              className="ulp-orange-btn text-[13px] font-semibold px-4 py-1.5 rounded-lg text-white border-none"
              style={{ background: ORANGE }}
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* ── SECTION 1: HERO ───────────────────────────────────── */}
      <section
        data-ocid="ulp.hero.section"
        className="relative flex flex-col items-center justify-center text-center pt-[60px] min-h-screen"
        style={{
          background: `linear-gradient(160deg, ${BG_DEEP} 0%, #0b1628 50%, ${BG_BASE} 100%)`,
        }}
      >
        {/* Radial orange glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(255,107,43,0.11) 0%, transparent 65%)",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,107,43,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div
          className="relative z-10 mx-auto px-6 py-24 flex flex-col items-center"
          style={{ maxWidth: "900px" }}
        >
          {/* ForgeAI badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium border mb-8 intelligence-pulse"
            style={{
              background: "rgba(255,107,43,0.08)",
              borderColor: "rgba(255,107,43,0.28)",
              color: ORANGE,
            }}
          >
            <Sparkles size={12} />
            Powered by ForgeAI Operational Intelligence
          </div>

          {/* Main headline */}
          <h1
            className="font-black text-white text-center leading-[1.06] tracking-[-0.04em] mb-6"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(2.6rem, 5.5vw, 4.8rem)",
            }}
          >
            Forge Your Channel Pipeline
            <br />
            <span style={{ color: ORANGE }}>Into Revenue</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-[17px] leading-[1.8] mb-10 mx-auto"
            style={{ color: TEXT_SOFT, maxWidth: "640px" }}
          >
            AI-powered operational intelligence built specifically for{" "}
            <span className="font-semibold" style={{ color: "#C8D6E8" }}>
              Vendors
            </span>
            ,{" "}
            <span className="font-semibold" style={{ color: "#C8D6E8" }}>
              Distributors
            </span>
            , and{" "}
            <span className="font-semibold" style={{ color: "#C8D6E8" }}>
              Resellers
            </span>
            .
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
            <button
              type="button"
              data-ocid="ulp.hero.explore_plans.primary_button"
              onClick={() => navigate({ to: "/pricing" })}
              className="ulp-orange-btn inline-flex items-center gap-2 text-white font-semibold text-[15px] px-8 py-3.5 rounded-xl border-none"
              style={{
                background: `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                boxShadow: "0 4px 24px rgba(255,107,43,0.4)",
              }}
            >
              Explore Plans
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              data-ocid="ulp.hero.start_setup.secondary_button"
              onClick={() => navigate({ to: "/workspace-setup" })}
              className="ulp-ghost-btn inline-flex items-center gap-2 font-semibold text-[15px] px-8 py-3.5 rounded-xl border transition-all duration-200"
              style={{
                borderColor: "rgba(255,107,43,0.4)",
                color: TEXT_SOFT,
                background: "transparent",
              }}
            >
              Start Setup
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Social proof strip */}
          <div
            className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-4"
            style={{ color: TEXT_MUTED }}
          >
            {[
              "Enterprise-grade security",
              "1 month free trial",
              "No immediate billing",
              "Purpose-built for channel ecosystems",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[12px]">
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: ORANGE }}
                />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Section bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, ${BG_BASE})`,
          }}
        />
      </section>

      {/* ── SECTION 2: CTA TILES ──────────────────────────────── */}
      <section
        data-ocid="ulp.cta_tiles.section"
        className="relative py-24 px-6"
        style={{ background: BG_BASE }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,43,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 mx-auto" style={{ maxWidth: "1100px" }}>
          <div className="text-center mb-14">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-3"
              style={{ color: ORANGE }}
            >
              Get Started
            </p>
            <h2
              className="font-black text-white leading-tight tracking-[-0.03em]"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
              }}
            >
              Begin Your Journey
            </h2>
            <p
              className="mt-4 text-[15px]"
              style={{
                color: TEXT_MUTED,
                maxWidth: "560px",
                margin: "16px auto 0",
              }}
            >
              Two paths into the CHANNELFORGE ecosystem — explore our pricing
              tiers or launch your operational workspace today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* TILE 1: View Pricing */}
            <div
              data-ocid="ulp.pricing_tile.card"
              className="ulp-cta-tile relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: "rgba(11,18,32,0.85)",
                border: "1px solid rgba(255,107,43,0.18)",
                backdropFilter: "blur(12px)",
                minHeight: "360px",
              }}
            >
              <div
                className="h-[3px] w-full"
                style={{
                  background: `linear-gradient(90deg, ${ORANGE}, rgba(255,107,43,0.3))`,
                }}
              />
              <div className="flex flex-col flex-1 p-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
                  style={{
                    background: "rgba(255,107,43,0.1)",
                    border: "1px solid rgba(255,107,43,0.25)",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="2"
                      y="6"
                      width="18"
                      height="12"
                      rx="2"
                      stroke={ORANGE}
                      strokeWidth="1.6"
                    />
                    <path
                      d="M7 10h8M7 14h5"
                      stroke={ORANGE}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15 2l3 4H4l3-4"
                      stroke={ORANGE}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3
                  className="text-white font-black mb-3 tracking-tight"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "clamp(1.5rem, 2.2vw, 1.9rem)",
                  }}
                >
                  View Pricing
                </h3>
                <p
                  className="text-[14px] leading-[1.7] mb-6"
                  style={{ color: TEXT_SOFT }}
                >
                  Explore CHANNELFORGE infrastructure packages built for
                  operational ecosystems of every scale.
                </p>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {[
                    "Small infrastructure package",
                    "Medium infrastructure package",
                    "Large infrastructure package",
                    "1 month free trial",
                    "AI-powered operational intelligence",
                    "Built for channel ecosystems",
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 text-[13px]"
                      style={{ color: TEXT_SOFT }}
                    >
                      <OrangeCheck />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  data-ocid="ulp.pricing_tile.explore_plans.button"
                  onClick={() => navigate({ to: "/pricing" })}
                  className="ulp-orange-btn mt-auto flex-shrink-0 w-full flex items-center justify-center gap-2 text-white font-semibold text-[15px] py-3.5 rounded-xl border-none"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                    boxShadow: "0 4px 20px rgba(255,107,43,0.35)",
                  }}
                >
                  Explore Plans
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* TILE 2: Set Up Workspace */}
            <div
              data-ocid="ulp.setup_tile.card"
              className="ulp-cta-tile relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: "rgba(11,18,32,0.85)",
                border: "1px solid rgba(255,107,43,0.18)",
                backdropFilter: "blur(12px)",
                minHeight: "360px",
              }}
            >
              <div
                className="h-[3px] w-full"
                style={{
                  background: `linear-gradient(90deg, ${ORANGE}, rgba(255,107,43,0.3))`,
                }}
              />
              <div className="flex flex-col flex-1 p-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
                  style={{
                    background: "rgba(255,107,43,0.1)",
                    border: "1px solid rgba(255,107,43,0.25)",
                  }}
                >
                  <Building2 size={22} color={ORANGE} />
                </div>

                <h3
                  className="text-white font-black mb-3 tracking-tight"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "clamp(1.5rem, 2.2vw, 1.9rem)",
                  }}
                >
                  Set Up Workspace
                </h3>
                <p
                  className="text-[14px] leading-[1.7] mb-6"
                  style={{ color: TEXT_SOFT }}
                >
                  Launch your Vendor, Distributor, or Reseller workspace and
                  start building your operational ecosystem.
                </p>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {[
                    "Vendor setup",
                    "Distributor setup",
                    "Reseller setup",
                    "Foundry operational workspace",
                    "ForgeAI integration",
                    "Hierarchy management",
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 text-[13px]"
                      style={{ color: TEXT_SOFT }}
                    >
                      <OrangeCheck />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  data-ocid="ulp.setup_tile.start_setup.button"
                  onClick={() => navigate({ to: "/workspace-setup" })}
                  className="ulp-orange-btn mt-auto flex-shrink-0 w-full flex items-center justify-center gap-2 text-white font-semibold text-[15px] py-3.5 rounded-xl border-none"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                    boxShadow: "0 4px 20px rgba(255,107,43,0.35)",
                  }}
                >
                  Start Setup
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHY CHANNELFORGE EXISTS ────────────────── */}
      <section
        data-ocid="ulp.why.section"
        className="relative py-24 px-6"
        style={{
          background: `linear-gradient(160deg, ${BG_MID} 0%, #0c1726 100%)`,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 45% 50% at 20% 50%, rgba(255,107,43,0.04) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-10 mx-auto" style={{ maxWidth: "1100px" }}>
          <div className="text-center mb-14">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-3"
              style={{ color: ORANGE }}
            >
              Platform Purpose
            </p>
            <h2
              className="font-black text-white leading-tight tracking-[-0.03em] mb-5"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)",
              }}
            >
              Why CHANNELFORGE Exists
            </h2>
            <p
              className="text-[15px] leading-[1.75] mx-auto"
              style={{ color: TEXT_SOFT, maxWidth: "680px" }}
            >
              Built to solve the operational gaps that generic CRM platforms
              were never designed to fix.
            </p>
          </div>

          {/* Problem / Solution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div
              className="rounded-2xl p-8"
              style={{
                background: "rgba(11,18,32,0.7)",
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider rounded-full px-3 py-1 mb-5"
                style={{
                  background: "rgba(125,138,160,0.1)",
                  border: "1px solid rgba(125,138,160,0.2)",
                  color: TEXT_MUTED,
                }}
              >
                The Problem
              </div>
              <p
                className="text-[15px] leading-[1.85]"
                style={{ color: TEXT_SOFT }}
              >
                Channel operations are complex —{" "}
                <strong style={{ color: "#C8D6E8" }}>Vendors</strong>,{" "}
                <strong style={{ color: "#C8D6E8" }}>Distributors</strong>, and{" "}
                <strong style={{ color: "#C8D6E8" }}>Resellers</strong> each
                have distinct workflows, visibility requirements, and governance
                needs. Traditional CRM platforms weren't built with this
                hierarchy in mind. They force channel teams to adapt enterprise
                sales tools never designed for multi-tier ecosystem management.
              </p>
            </div>
            <div
              className="rounded-2xl p-8"
              style={{
                background: "rgba(255,107,43,0.04)",
                border: "1px solid rgba(255,107,43,0.2)",
              }}
            >
              <div
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider rounded-full px-3 py-1 mb-5"
                style={{
                  background: "rgba(255,107,43,0.1)",
                  border: "1px solid rgba(255,107,43,0.25)",
                  color: ORANGE,
                }}
              >
                The Solution
              </div>
              <p
                className="text-[15px] leading-[1.85]"
                style={{ color: TEXT_SOFT }}
              >
                CHANNELFORGE was purpose-built for channel ecosystems from the
                ground up — with renewal intelligence, deal registration
                workflows, account allocation visibility, and{" "}
                <strong style={{ color: ORANGE }}>
                  ForgeAI operational intelligence
                </strong>{" "}
                embedded at its core. Every feature solves a real channel
                problem.
              </p>
            </div>
          </div>

          {/* Feature callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {WHY_FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-xl p-5"
                style={{
                  background: "rgba(11,18,32,0.6)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(255,107,43,0.1)",
                    border: "1px solid rgba(255,107,43,0.2)",
                  }}
                >
                  <Icon size={16} color={ORANGE} />
                </div>
                <p className="text-[13px] font-semibold text-white mb-1.5 tracking-tight">
                  {label}
                </p>
                <p
                  className="text-[12px] leading-[1.65]"
                  style={{ color: TEXT_MUTED }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: BUILT FOR THE CHANNEL ──────────────────── */}
      <section
        data-ocid="ulp.channel.section"
        className="relative py-24 px-6"
        style={{ background: BG_BASE, borderTop: `1px solid ${BORDER}` }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 85% 50%, rgba(255,107,43,0.05) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-10 mx-auto" style={{ maxWidth: "1100px" }}>
          <div className="mb-14 text-center">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-3"
              style={{ color: ORANGE }}
            >
              Differentiation
            </p>
            <h2
              className="font-black text-white leading-tight tracking-[-0.03em]"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)",
                maxWidth: "700px",
              }}
            >
              Built for the Channel.
              <br />
              <span style={{ color: ORANGE }}>Not Retro-Fitted to It.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: legacy CRM problem */}
            <div>
              <h3
                className="text-[17px] font-semibold mb-4"
                style={{ color: TEXT_SOFT }}
              >
                Traditional CRM Platforms
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "Centralized architecture",
                    desc: "One data model for all business types — not designed for channel hierarchies.",
                  },
                  {
                    label: "Generic workflows",
                    desc: "Sales pipelines built for direct sales teams, not Vendor-Distributor-Reseller ecosystems.",
                  },
                  {
                    label: "Sales-only focus",
                    desc: "Optimized for closing deals, not managing ongoing channel relationships and renewals.",
                  },
                  {
                    label: "Retro-fitted channel modules",
                    desc: "Channel features bolted on as afterthoughts, not built into the platform's foundation.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{
                      background: "rgba(125,138,160,0.05)",
                      border: "1px solid rgba(125,138,160,0.12)",
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"
                      style={{
                        background: "rgba(125,138,160,0.15)",
                        border: "1px solid rgba(125,138,160,0.25)",
                      }}
                    />
                    <div>
                      <p
                        className="text-[13px] font-semibold mb-0.5"
                        style={{ color: TEXT_SOFT }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-[12px] leading-[1.6]"
                        style={{ color: TEXT_MUTED }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CHANNELFORGE differentiators */}
            <div>
              <h3
                className="text-[17px] font-semibold mb-4"
                style={{ color: "#C8D6E8" }}
              >
                CHANNELFORGE
              </h3>
              <div className="flex flex-col gap-2.5">
                {DIFFERENTIATORS.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(255,107,43,0.04)",
                      border: "1px solid rgba(255,107,43,0.15)",
                      borderLeft: `2px solid ${ORANGE}`,
                    }}
                  >
                    <CheckCircle2
                      size={14}
                      style={{ color: ORANGE, flexShrink: 0 }}
                    />
                    <span
                      className="text-[13px] font-medium"
                      style={{ color: TEXT_SOFT }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: DATA SOVEREIGNTY ───────────────────────── */}
      <section
        data-ocid="ulp.sovereignty.section"
        className="relative py-24 px-6"
        style={{
          background: `linear-gradient(160deg, #090f1e 0%, ${BG_MID} 100%)`,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 40% 55% at 50% 50%, rgba(255,107,43,0.06) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-10 mx-auto" style={{ maxWidth: "1100px" }}>
          <div className="text-center mb-14">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-3"
              style={{ color: ORANGE }}
            >
              Data Governance
            </p>
            <h2
              className="font-black text-white leading-tight tracking-[-0.03em] mb-5"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)",
              }}
            >
              Your Channel Data.
              <br />
              <span style={{ color: ORANGE }}>Your Control.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              {[
                "CHANNELFORGE is designed around operational ownership and visibility governance.",
                "Organizations maintain stronger control over account visibility and operational structure.",
                "Hierarchy-aware access reduces unnecessary data exposure across partner tiers.",
                "Operational visibility is permission-based and stakeholder-aligned — not shared by default.",
              ].map((para) => (
                <p
                  key={para.slice(0, 20)}
                  className="text-[15px] leading-[1.85] mb-4 last:mb-0"
                  style={{ color: TEXT_SOFT }}
                >
                  {para}
                </p>
              ))}
            </div>
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                background: "rgba(255,107,43,0.04)",
                border: "1px solid rgba(255,107,43,0.18)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "rgba(255,107,43,0.1)",
                  border: "1px solid rgba(255,107,43,0.25)",
                }}
              >
                <Lock size={28} color={ORANGE} />
              </div>
              <p
                className="font-black text-white mb-3 tracking-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
                }}
              >
                Sovereignty-First Architecture
              </p>
              <p
                className="text-[14px] leading-[1.7]"
                style={{ color: TEXT_MUTED }}
              >
                Built on principles of operational ownership — organizations
                control what is visible, to whom, and under what conditions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {SOVEREIGNTY_CARDS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl p-6 flex flex-col"
                style={{
                  background: "rgba(11,18,32,0.7)",
                  border: `1px solid ${BORDER}`,
                  borderTop: `2px solid ${ORANGE}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(255,107,43,0.1)",
                    border: "1px solid rgba(255,107,43,0.2)",
                  }}
                >
                  <Icon size={18} color={ORANGE} />
                </div>
                <p className="text-[14px] font-semibold text-white mb-2 tracking-tight">
                  {title}
                </p>
                <p
                  className="text-[13px] leading-[1.65]"
                  style={{ color: TEXT_MUTED }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6b: ENTERPRISE INFRASTRUCTURE & CLOUD ENGINE ── */}
      <section
        style={{
          background: BG_DEEP,
          borderTop: `1px solid ${BORDER}`,
          padding: "6rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}22`,
                color: ORANGE,
                border: `1px solid ${ORANGE}44`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Enterprise Infrastructure
            </span>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
              }}
            >
              Enterprise-Controlled Operational Compute
            </h2>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1.1rem",
                maxWidth: "680px",
                margin: "0 auto 2rem",
              }}
            >
              For large-scale Vendor, Distributor, and Reseller ecosystems
              requiring dedicated infrastructure and sovereign operational
              control.
            </p>
            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#fff",
                  marginBottom: "0.5rem",
                  display: "inline",
                }}
              >
                What is a Cloud Engine?
              </h3>
              <button
                type="button"
                onClick={() => setShowCloudEngineModal(true)}
                style={{
                  marginLeft: "0.75rem",
                  color: ORANGE,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Learn More
              </button>
            </div>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1rem",
                maxWidth: "720px",
                margin: "0 auto 2.5rem",
                lineHeight: 1.7,
              }}
            >
              Cloud Engines are isolated enterprise operational environments
              designed for large-scale channel ecosystems. Organizations
              maintain greater operational control with dedicated compute
              capacity and scalable AI-ready infrastructure. Designed for
              enterprise-grade Vendor, Distributor, and Reseller ecosystems
              requiring sovereign operational governance.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginBottom: "3rem",
            }}
          >
            {[
              {
                icon: <Server size={20} />,
                title: "Isolated Operational Environment",
                desc: "Dedicated infrastructure isolated from shared environments.",
              },
              {
                icon: <Layers size={20} />,
                title: "Scalable Enterprise Compute",
                desc: "Scale compute capacity as your ecosystem grows.",
              },
              {
                icon: <Shield size={20} />,
                title: "Sovereign Operational Architecture",
                desc: "Your data, your infrastructure, your control.",
              },
              {
                icon: <Cpu size={20} />,
                title: "Enterprise AI Readiness",
                desc: "AI-optimised compute for intensive operational workloads.",
              },
              {
                icon: <Lock size={20} />,
                title: "Advanced Operational Governance",
                desc: "Enterprise-grade governance and compliance controls.",
              },
              {
                icon: <Building2 size={20} />,
                title: "Dedicated Infrastructure Scaling",
                desc: "Scale infrastructure independently of shared pools.",
              },
              {
                icon: <Eye size={20} />,
                title: "Enhanced Operational Visibility",
                desc: "Full visibility into your dedicated infrastructure usage.",
              },
              {
                icon: <GitBranch size={20} />,
                title: "Future AI Node Readiness",
                desc: "Architecture designed for next-generation AI workloads.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                style={{
                  background: BG_MID,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "12px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <span style={{ color: ORANGE }}>{benefit.icon}</span>
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  {benefit.title}
                </span>
                <span style={{ color: TEXT_MUTED, fontSize: "0.8rem" }}>
                  {benefit.desc}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: BG_MID,
              border: `1px solid ${BORDER}`,
              borderRadius: "16px",
              padding: "2rem",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
              }}
            >
              Dedicated operational environments typically start from{" "}
              <strong style={{ color: "#fff" }}>
                £8,000–£25,000+ annually
              </strong>{" "}
              depending on workload and infrastructure scale.
            </p>
            <p style={{ color: TEXT_MUTED, fontSize: "0.8rem" }}>
              Enterprise infrastructure pricing depends on compute usage,
              storage requirements, AI operational load, and organisational
              scale.
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={() => navigate({ to: "/enterprise-calculator" })}
              data-ocid="ulp.enterprise.calculate_pricing.button"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, #e05a1f)`,
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "1rem 2.5rem",
                fontSize: "1.1rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 4px 24px ${ORANGE}44`,
              }}
            >
              Calculate Enterprise Pricing
            </button>
          </div>
        </div>
        {showCloudEngineModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1.5rem",
            }}
          >
            <div
              data-ocid="ulp.cloud_engine.dialog"
              style={{
                background: BG_MID,
                border: `1px solid ${BORDER}`,
                borderRadius: "20px",
                padding: "2.5rem",
                maxWidth: "680px",
                width: "100%",
                maxHeight: "80vh",
                overflowY: "auto",
                position: "relative",
              }}
            >
              <button
                type="button"
                data-ocid="ulp.cloud_engine.close_button"
                onClick={() => setShowCloudEngineModal(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  color: TEXT_MUTED,
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
              <h2
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "#fff",
                  marginBottom: "1rem",
                }}
              >
                Cloud Engine: Enterprise Infrastructure
              </h2>
              <p
                style={{
                  color: TEXT_SOFT,
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                Cloud Engines provide enterprise organizations with dedicated
                operational infrastructure environments. Unlike shared
                infrastructure models, a Cloud Engine gives your organization
                isolated compute and storage resources, advanced governance
                controls, and the ability to scale independently of other
                platform users. Ideal for organizations with strict operational
                governance, high AI workload requirements, or multi-region
                channel ecosystems.
              </p>
              <h3
                style={{ color: "#fff", fontWeight: 700, marginBottom: "1rem" }}
              >
                Typical Use Cases
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginBottom: "2rem",
                }}
              >
                {[
                  "Large Vendor ecosystems managing global channel networks",
                  "Global Distributors requiring regional operational segregation",
                  "Multi-region deployments with local data governance requirements",
                  "AI-heavy operations with high-volume inference workloads",
                  "Organizations with sovereign governance and compliance requirements",
                  "Enterprise escalation handling across complex partner hierarchies",
                ].map((uc) => (
                  <li
                    key={uc}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      color: TEXT_SOFT,
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: ORANGE, flexShrink: 0 }}>→</span>
                    {uc}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                data-ocid="ulp.cloud_engine.contact.button"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, #e05a1f)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.875rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Speak With CHANNELFORGE Enterprise Solutions
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── SECTION 7: PRICING SUMMARY ────────────────────────── */}
      <section
        data-ocid="ulp.pricing.section"
        className="relative py-24 px-6"
        style={{
          background: `linear-gradient(160deg, ${BG_MID} 0%, #0c1726 100%)`,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 50% 100%, rgba(255,107,43,0.06) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-10 mx-auto" style={{ maxWidth: "1100px" }}>
          <div className="text-center mb-5">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em] mb-3"
              style={{ color: ORANGE }}
            >
              Pricing
            </p>
            <h2
              className="font-black text-white leading-tight tracking-[-0.03em] mb-3"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(1.9rem, 3.2vw, 2.8rem)",
              }}
            >
              Infrastructure-Based Operational Pricing
            </h2>
            <p className="text-[15px]" style={{ color: TEXT_MUTED }}>
              Scale your channel ecosystem with compute and storage — not seat
              counts.
            </p>
          </div>

          {/* Free trial banner */}
          <div
            className="flex items-center justify-center gap-3 text-[13px] font-medium rounded-xl px-6 py-3 mb-10 mx-auto"
            style={{
              background: "rgba(255,107,43,0.08)",
              border: "1px solid rgba(255,107,43,0.25)",
              color: ORANGE,
              maxWidth: "520px",
            }}
          >
            <Sparkles size={14} />1 month free trial — No immediate billing.
            Cancel anytime.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                data-ocid={`ulp.pricing.${tier.name.toLowerCase()}.card`}
                className="ulp-pricing-card relative flex flex-col rounded-2xl overflow-hidden"
                style={{
                  background: tier.popular
                    ? "rgba(255,107,43,0.06)"
                    : "rgba(11,18,32,0.8)",
                  border: tier.popular
                    ? "1.5px solid rgba(255,107,43,0.4)"
                    : `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="h-[3px]"
                  style={{
                    background: tier.popular
                      ? ORANGE
                      : `linear-gradient(90deg, ${ORANGE}, transparent)`,
                  }}
                />
                <div className="flex flex-col flex-1 p-7">
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[12px] font-semibold uppercase tracking-widest"
                      style={{ color: ORANGE }}
                    >
                      {tier.name}
                    </p>
                    {tier.popular && (
                      <div
                        className="ml-auto flex-shrink-0 text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1"
                        style={{ background: ORANGE, color: "white" }}
                      >
                        Most Popular
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <p
                      className="text-[13px] leading-[1.65] mb-1"
                      style={{ color: TEXT_MUTED }}
                    >
                      {tier.tagline}
                    </p>
                    <p
                      className="text-[12px] font-semibold"
                      style={{ color: ORANGE }}
                    >
                      {tier.users}
                    </p>
                  </div>
                  <p
                    className="text-[12px] leading-[1.6] mb-6"
                    style={{ color: TEXT_MUTED }}
                  >
                    {tier.ecosystem}
                  </p>
                  <ul className="flex flex-col gap-2 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-[13px]"
                        style={{ color: TEXT_SOFT }}
                      >
                        <OrangeCheck />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {tier.name === "Small" || tier.name === "Medium" ? (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        background: `${ORANGE}11`,
                        border: `1px solid ${ORANGE}33`,
                        borderRadius: "8px",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          background: ORANGE,
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "0.125rem 0.5rem",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          marginBottom: "0.4rem",
                        }}
                      >
                        Shared Infrastructure
                      </span>
                      <p
                        style={{
                          color: TEXT_MUTED,
                          fontSize: "0.75rem",
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        Cloud Engine setup not included. Available for
                        enterprise-scale deployments for organisations who want
                        data on dedicated nodes they own globally.
                      </p>
                    </div>
                  ) : tier.name === "Large" ? (
                    <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.375rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {[
                        "Enterprise-ready",
                        "Cloud Engine Assessment Available",
                        "Dedicated Operational Compute Option",
                      ].map((label) => (
                        <span
                          key={label}
                          style={{
                            background: `${ORANGE}22`,
                            color: ORANGE,
                            border: `1px solid ${ORANGE}55`,
                            borderRadius: "4px",
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                          }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    data-ocid={`ulp.pricing.${tier.name.toLowerCase()}.start_trial.button`}
                    onClick={() => navigate({ to: "/pricing" })}
                    className={
                      tier.popular
                        ? "ulp-orange-btn mt-auto w-full py-3 rounded-xl text-white font-semibold text-[14px] border-none"
                        : "ulp-ghost-btn mt-auto w-full py-3 rounded-xl font-semibold text-[14px] border transition-all duration-200"
                    }
                    style={
                      tier.popular
                        ? {
                            background: `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                            boxShadow: "0 4px 20px rgba(255,107,43,0.3)",
                          }
                        : {
                            borderColor: "rgba(255,107,43,0.3)",
                            color: ORANGE,
                            background: "transparent",
                          }
                    }
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[13px]" style={{ color: TEXT_MUTED }}>
            CHANNELFORGE scales through operational compute and storage, not
            per-seat licensing.
          </p>
        </div>
      </section>

      {/* ── SECTION 8: WORKSPACE SELECTOR (SIGN IN) ───────────── */}
      <section
        id="signin-section"
        data-ocid="ulp.signin.section"
        className="relative py-28 px-6 border-t"
        style={{ background: BG_DEEP, borderTop: `1px solid ${BORDER}` }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(255,107,43,0.07) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,107,43,0.3), transparent)",
          }}
        />

        <div className="relative z-10 mx-auto" style={{ maxWidth: "960px" }}>
          {/* Heading */}
          <div className="text-center mb-12">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.18em] mb-4"
              style={{ color: ORANGE }}
            >
              Access your workspace
            </p>
            <h2
              className="font-black text-white leading-[1.05] tracking-[-0.04em] mb-5"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              }}
            >
              Sign In to{" "}
              <span className="forge-pulse" style={{ color: ORANGE }}>
                CHANNELFORGE
              </span>
            </h2>
            <p
              className="text-[15px] leading-[1.65]"
              style={{ color: TEXT_MUTED }}
            >
              Choose your workspace type to continue.
            </p>
          </div>

          {/* Workspace cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch"
            data-ocid="ulp.signin.cards"
          >
            {LOGIN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                data-ocid={`ulp.signin.${opt.id}_card`}
                onClick={() => navigate({ to: opt.route })}
                className="ulp-workspace-card group text-left rounded-2xl p-7 flex flex-col gap-4 transition-all duration-200"
                style={{
                  background: "rgba(11,18,32,0.85)",
                  border: `1px solid ${BORDER}`,
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.border =
                    "1px solid rgba(255,107,43,0.45)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 24px rgba(255,107,43,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.border =
                    `1px solid ${BORDER}`;
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "none";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,107,43,0.12)",
                    border: "1px solid rgba(255,107,43,0.25)",
                    color: ORANGE,
                  }}
                >
                  {opt.icon}
                </div>

                <div>
                  <h3
                    className="text-[16px] font-bold mb-1"
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      color: "#E7EEF8",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {opt.title}
                  </h3>
                  <p
                    className="text-[11px] uppercase tracking-[0.1em] font-semibold"
                    style={{ color: ORANGE, opacity: 0.8 }}
                  >
                    {opt.subtitle}
                  </p>
                </div>

                <p
                  className="text-[13px] leading-relaxed flex-1"
                  style={{ color: TEXT_SOFT }}
                >
                  {opt.description}
                </p>

                <div
                  className="mt-1 w-full py-2.5 px-4 rounded-lg text-center text-[13px] font-semibold transition-all duration-150"
                  style={{
                    background: "rgba(255,107,43,0.14)",
                    border: "1px solid rgba(255,107,43,0.35)",
                    color: ORANGE,
                  }}
                >
                  Sign In as {opt.title}
                </div>
              </button>
            ))}
          </div>

          {/* Footer links */}
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[12px]"
            style={{ color: TEXT_MUTED }}
          >
            <button
              type="button"
              data-ocid="ulp.signin.pricing.link"
              onClick={() => navigate({ to: "/pricing" })}
              className="hover:opacity-80 transition-opacity"
              style={{ color: TEXT_MUTED }}
            >
              View Pricing
            </button>
            <span style={{ color: BORDER }}>·</span>
            <button
              type="button"
              data-ocid="ulp.signin.forgot_password.link"
              onClick={() => navigate({ to: "/forgot-password" })}
              className="hover:opacity-80 transition-opacity"
              style={{ color: TEXT_MUTED }}
            >
              Forgot Password?
            </button>
            <span style={{ color: BORDER }}>·</span>
            <button
              type="button"
              data-ocid="ulp.signin.new_workspace.link"
              onClick={() => navigate({ to: "/workspace-setup" })}
              className="hover:opacity-80 transition-opacity"
              style={{ color: TEXT_MUTED }}
            >
              New? Set Up Workspace
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="relative z-10 mt-20 mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            maxWidth: "1100px",
            borderTop: "1px solid #1a2840",
            paddingTop: "1.5rem",
          }}
        >
          <div className="flex flex-col items-center sm:items-start">
            <div
              className="flex items-baseline"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              <span
                className="font-black text-[12px]"
                style={{ color: "#C8D6E8" }}
              >
                CHANNEL
              </span>
              <span
                className="font-black text-[12px] forge-pulse"
                style={{ color: ORANGE }}
              >
                FORGE
              </span>
            </div>
            <span
              className="text-[9px] font-medium tracking-[0.22em] uppercase"
              style={{ color: "rgba(125,138,160,0.55)" }}
            >
              Sovereign Channel Operations Platform
            </span>
          </div>
          <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
            &copy; {new Date().getFullYear()} &middot;{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="no-underline hover:opacity-80 transition-opacity"
              style={{ color: TEXT_MUTED }}
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </footer>
      </section>

      <style>{`
        .ulp-root { scrollbar-width: none; }
        .ulp-root::-webkit-scrollbar { display: none; }
        .ulp-orange-btn { transition: opacity 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease; cursor: pointer; }
        .ulp-orange-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .ulp-orange-btn:active:not(:disabled) { transform: scale(0.98); opacity: 1; }
        .ulp-ghost-btn { cursor: pointer; }
        .ulp-ghost-btn:hover:not(:disabled) { border-color: rgba(255,107,43,0.55) !important; color: #E7EEF8 !important; background: rgba(255,107,43,0.04) !important; }
        .ulp-cta-tile { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .ulp-cta-tile:hover { transform: translateY(-5px); border-color: rgba(255,107,43,0.45) !important; box-shadow: 0 12px 40px rgba(255,107,43,0.18), 0 4px 16px rgba(0,0,0,0.4); }
        .ulp-pricing-card { transition: transform 0.2s ease, border-color 0.2s ease; }
        .ulp-pricing-card:hover { transform: translateY(-3px); border-color: rgba(255,107,43,0.45) !important; }
        .ulp-workspace-card { transition: transform 0.2s ease; }
        .ulp-workspace-card:hover { transform: translateY(-4px); }
      `}</style>
    </div>
  );
}
