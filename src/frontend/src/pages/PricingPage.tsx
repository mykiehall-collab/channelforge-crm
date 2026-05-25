import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Brain,
  Building2,
  Check,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Network,
  Server,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

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
        <span className="font-black text-[22px]" style={{ color: "#C8D6E8" }}>
          CHANNEL
        </span>
        <span
          className="font-black text-[22px] forge-pulse"
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

interface Tier {
  id: string;
  name: string;
  badge?: string;
  price: number;
  annualPrice?: number;
  annualSavings?: string;
  period: string;
  tagline: string;
  yearlyCoverage: string;
  userGuidance: string;
  adminGuidance: string;
  aiUsage: string;
  ecosystemSize: string;
  compute: number;
  storage: number;
  ai: number;
  recommendedFor: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  customEngagement?: boolean;
  engagementLabel?: string;
  consultationNote?: string;
  extraMessaging?: string[];
}

const TIERS: Tier[] = [
  {
    id: "small",
    name: "Small",
    price: 499,
    annualPrice: 5500,
    annualSavings: "Save £488 annually — 2 months free",
    period: "/ month",
    tagline:
      "For smaller operational ecosystems. Supports SMB Vendor, Distributor, and Reseller operations on shared sovereign infrastructure.",
    yearlyCoverage: "5–25 users · 1–3 admins · limited AI usage",
    userGuidance: "5–25 users",
    adminGuidance: "1–3 admins",
    aiUsage: "Limited AI usage",
    ecosystemSize: "Small Vendor / Distributor / Reseller ecosystems",
    compute: 5000,
    storage: 250,
    ai: 1000,
    recommendedFor: "SMB Resellers · Lightweight Vendors · Small Distributors",
    features: [
      "CRM account management",
      "Opportunities & pipeline",
      "Renewal tracking & alerts",
      "Deal registrations",
      "Task management & callbacks",
      "Foundry Lite workspace",
      "Messaging & collaboration",
      "Light reporting workloads",
      "Limited operational automation",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    id: "medium",
    name: "Medium",
    badge: "Most Popular",
    price: 1499,
    annualPrice: 16500,
    annualSavings: "Save £1,488 annually — 2 months free",
    period: "/ month",
    tagline:
      "For growing Vendor, Distributor, and Multi-Group Reseller operations on shared sovereign infrastructure.",
    yearlyCoverage: "25–150 users · 3–15 admins · moderate AI usage",
    userGuidance: "25–150 users",
    adminGuidance: "3–15 admins",
    aiUsage: "Moderate AI usage",
    ecosystemSize: "Multiple Vendors / Distributors / Resellers",
    compute: 20000,
    storage: 1000,
    ai: 5000,
    recommendedFor:
      "Growing Vendors · Mid-Sized Distributors · Multi-Group Resellers",
    features: [
      "Everything in Small",
      "The Foundry admin workspace",
      "Promotions & incentive management",
      "MDF management & workflows",
      "Advanced account allocation",
      "Custom fields (all 10 objects)",
      "Operational visibility controls",
      "Regular reporting & multiple dashboards",
      "Active operational workflows",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    id: "large",
    name: "Large",
    price: 0,
    period: "/ month",
    tagline:
      "Enterprise-scale channel ecosystems with sovereign infrastructure control and dedicated Cloud Engine readiness.",
    yearlyCoverage: "150+ users · 15+ admins · high AI usage",
    userGuidance: "150+ users",
    adminGuidance: "15+ admins",
    aiUsage: "High AI usage",
    ecosystemSize: "Enterprise Vendor / Distributor / Reseller networks",
    compute: 75000,
    storage: 5000,
    ai: 20000,
    recommendedFor:
      "Enterprise Vendors · Global Distributors · Enterprise Channel Ecosystems",
    features: [
      "Enterprise-scale operational ecosystems",
      "Dedicated Cloud Engine readiness",
      "Sovereign operational infrastructure",
      "Advanced AI operational environments",
      "Enterprise governance support",
      "Multi-region channel operations",
    ],
    cta: "Calculate Enterprise Environment",
    highlighted: false,
    customEngagement: true,
    engagementLabel: "Custom Enterprise Engagement",
    consultationNote:
      "Enterprise operational environments are tailored based on infrastructure scale, AI workload, storage requirements, and organizational complexity. Speak with CHANNELFORGE Enterprise Solutions for tailored planning.",
    extraMessaging: [
      "Large-scale organizations can later deploy dedicated operational infrastructure environments.",
      "Dedicated node readiness included.",
      "Sovereign deployment readiness included.",
    ],
  },
];

interface BillingMode {
  id: string;
  title: string;
  description: string;
  examples: string[];
}

const BILLING_MODES: BillingMode[] = [
  {
    id: "centralized",
    title: "Centralized Billing",
    description:
      "One organization covers all compute and storage costs across the entire channel ecosystem.",
    examples: [
      "Vendor pays for entire ecosystem",
      "Distributor pays for connected Resellers",
      "Enterprise parent organization covers all usage",
    ],
  },
  {
    id: "shared",
    title: "Shared Billing",
    description:
      "Compute and storage consumption is dynamically distributed across connected organizations based on workload.",
    examples: [
      "Vendors cover Vendor operational workloads",
      "Distributors cover Distributor workloads",
      "Resellers cover customer-facing workloads",
    ],
  },
  {
    id: "hybrid",
    title: "Hybrid Billing",
    description:
      "Primary organization covers baseline infrastructure while connected organizations contribute based on usage thresholds.",
    examples: [
      "Vendor funds core infrastructure",
      "Resellers top up additional operational usage",
      "Distributor funds regional reporting workloads",
    ],
  },
];

export function PricingPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelectTier = (tier: Tier) => {
    if (tier.customEngagement) {
      navigate({ to: "/enterprise-calculator" });
      return;
    }
    sessionStorage.setItem("cf_selected_bundle", tier.id);
    sessionStorage.setItem("cf_bundle_name", tier.name);
    sessionStorage.setItem("cf_bundle_price", String(tier.price));
    sessionStorage.setItem("cf_bundle_compute", String(tier.compute));
    sessionStorage.setItem("cf_bundle_storage", String(tier.storage));
    sessionStorage.setItem("cf_bundle_ai", String(tier.ai));
    navigate({ to: "/subscription-onboarding" });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: BG_BASE, color: "#E7EEF8" }}
    >
      {/* Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(11,18,32,0.97)",
          borderColor: "rgba(34,48,71,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="mx-auto px-6 h-[60px] flex items-center justify-between"
          style={{ maxWidth: "1200px" }}
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="cursor-pointer border-none bg-transparent p-0"
          >
            <ChannelForgeLogo />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
              Already have an account?
            </span>
            <button
              type="button"
              data-ocid="pricing.nav.login.button"
              onClick={() => navigate({ to: "/vendor-login" })}
              className="px-4 py-1.5 rounded-lg text-[12px] font-semibold border cursor-pointer"
              style={{
                borderColor: BORDER,
                color: TEXT_SOFT,
                background: "transparent",
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Back Button Bar */}
      <div
        className="fixed top-[60px] left-0 right-0 z-40 border-b"
        style={{
          background: "rgba(11,18,32,0.95)",
          borderColor: "rgba(34,48,71,0.5)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          className="mx-auto px-6 h-[48px] flex items-center"
          style={{ maxWidth: "1200px" }}
        >
          <button
            type="button"
            data-ocid="pricing.back.button"
            onClick={() => navigate({ to: "/login" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold border cursor-pointer"
            style={{
              borderColor: "rgba(255,107,43,0.35)",
              color: ORANGE,
              background: "rgba(255,107,43,0.08)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,107,43,0.15)";
              e.currentTarget.style.borderColor = "rgba(255,107,43,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,107,43,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,107,43,0.35)";
            }}
          >
            <ArrowLeft size={15} />
            Back
          </button>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative pt-[140px] pb-16 px-6 text-center"
        style={{
          background: `linear-gradient(160deg, ${BG_DEEP} 0%, ${BG_BASE} 100%)`,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,107,43,0.1) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,107,43,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 mx-auto" style={{ maxWidth: "720px" }}>
          <div
            className="inline-flex items-center gap-2 border rounded-full px-3.5 py-1.5 text-[11px] font-medium mb-8"
            style={{
              borderColor: BORDER,
              background: "#121b2a",
              color: TEXT_MUTED,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: ORANGE }}
            />
            Compute-Driven Operations · Sovereign Infrastructure · AI-Powered
          </div>
          <h1
            className="font-black tracking-[-0.04em] leading-[1.05] text-white mb-5"
            style={{
              fontSize: "clamp(2.2rem, 4.2vw, 3.6rem)",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            Operational Infrastructure
            <br />
            <span style={{ color: ORANGE }}>Pricing.</span>
          </h1>
          <p
            className="text-[16px] leading-[1.75] mb-3"
            style={{
              color: TEXT_SOFT,
              maxWidth: "560px",
              margin: "0 auto 12px",
            }}
          >
            Pay for compute, storage, and AI capacity — not per-user seats.
            Scale your operational infrastructure dynamically as your channel
            ecosystem grows.
          </p>
          <p className="text-[13px] mb-10" style={{ color: TEXT_MUTED }}>
            Sovereign enterprise infrastructure · 1 month free trial · No credit
            card required during trial
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Shield, label: "Data Sovereignty" },
              { icon: Cpu, label: "Compute Credits" },
              { icon: Database, label: "Storage Credits" },
              { icon: Brain, label: "AI Credits" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2"
                style={{ color: TEXT_MUTED }}
              >
                <Icon size={14} style={{ color: ORANGE }} />
                <span className="text-[13px]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit bundle cards */}
      <section className="relative px-6 pb-20" style={{ background: BG_BASE }}>
        <div className="mx-auto" style={{ maxWidth: "1200px" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                data-ocid={`pricing.tier.${tier.id}.card`}
                onMouseEnter={() => setHovered(tier.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative rounded-2xl flex flex-col"
                style={{
                  background: tier.highlighted
                    ? "rgba(20,36,64,0.95)"
                    : "rgba(13,26,46,0.8)",
                  border: `1.5px solid ${
                    tier.highlighted
                      ? "rgba(255,107,43,0.5)"
                      : hovered === tier.id
                        ? "rgba(255,107,43,0.35)"
                        : BORDER
                  }`,
                  boxShadow: tier.highlighted
                    ? "0 0 40px rgba(255,107,43,0.12), 0 4px 24px rgba(0,0,0,0.3)"
                    : hovered === tier.id
                      ? "0 0 20px rgba(255,107,43,0.08)"
                      : "0 2px 12px rgba(0,0,0,0.2)",
                  transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                  transform: hovered === tier.id ? "translateY(-3px)" : "none",
                }}
              >
                {/* Top edge glow */}
                <div
                  className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
                  style={{
                    background: tier.highlighted
                      ? `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`
                      : "linear-gradient(90deg, transparent, rgba(255,107,43,0.3), transparent)",
                  }}
                />

                {/* Popular badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div
                      className="px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] text-white"
                      style={{
                        background: ORANGE,
                        boxShadow: "0 2px 12px rgba(255,107,43,0.45)",
                      }}
                    >
                      {tier.badge}
                    </div>
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  {/* Tier name */}
                  <h3
                    className="text-[28px] font-black leading-none mb-2"
                    style={{
                      color: "#E7EEF8",
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    {tier.name}
                  </h3>

                  {/* Price / Engagement */}
                  {tier.customEngagement ? (
                    <div className="mb-4">
                      <div
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 mb-2"
                        style={{
                          background: "rgba(255,107,43,0.08)",
                          border: "1px solid rgba(255,107,43,0.3)",
                        }}
                      >
                        <span
                          className="text-[11px] font-bold uppercase tracking-[0.1em]"
                          style={{ color: ORANGE }}
                        >
                          Enterprise
                        </span>
                      </div>
                      <p
                        className="text-[24px] font-black leading-tight mb-2"
                        style={{
                          color: ORANGE,
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                        }}
                      >
                        {tier.engagementLabel}
                      </p>
                      <p
                        className="text-[13px] leading-[1.6] mb-3"
                        style={{ color: TEXT_SOFT }}
                      >
                        {tier.consultationNote}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-end gap-1.5 mb-1">
                        <span
                          className="text-[42px] font-black leading-none"
                          style={{
                            color: "#E7EEF8",
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                          }}
                        >
                          £{tier.price.toLocaleString()}
                        </span>
                        <span
                          className="text-[13px] mb-2"
                          style={{ color: TEXT_MUTED }}
                        >
                          {tier.period}
                        </span>
                      </div>
                      {tier.annualPrice && (
                        <p
                          className="text-[12px] mb-1"
                          style={{ color: TEXT_MUTED }}
                        >
                          or £{tier.annualPrice.toLocaleString()}/year
                        </p>
                      )}
                      {tier.annualSavings && (
                        <div
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold mb-3"
                          style={{
                            background: "rgba(255,107,43,0.12)",
                            border: "1px solid rgba(255,107,43,0.28)",
                            color: ORANGE,
                          }}
                        >
                          <Sparkles size={10} />
                          {tier.annualSavings}
                        </div>
                      )}
                      {/* Trial */}
                      <div
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium mb-4"
                        style={{
                          background: "rgba(255,107,43,0.08)",
                          border: "1px solid rgba(255,107,43,0.2)",
                          color: ORANGE,
                        }}
                      >
                        <Zap size={11} />1 Month Free Trial included
                      </div>
                    </>
                  )}

                  {/* Tagline */}
                  <p
                    className="text-[13px] leading-[1.6] mb-1"
                    style={{ color: TEXT_SOFT }}
                  >
                    {tier.tagline}
                  </p>
                  <p className="text-[11px] mb-3" style={{ color: TEXT_MUTED }}>
                    {tier.yearlyCoverage}
                  </p>

                  {/* Recommended org type */}
                  <div
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold mb-3"
                    style={{
                      background: "rgba(255,107,43,0.06)",
                      border: "1px solid rgba(255,107,43,0.15)",
                      color: ORANGE,
                    }}
                  >
                    <Building2 size={11} />
                    {tier.recommendedFor}
                  </div>

                  {/* Guidance row */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px]"
                      style={{
                        background: "rgba(13,26,46,0.8)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT_SOFT,
                      }}
                    >
                      <Users size={10} style={{ color: ORANGE }} />
                      {tier.userGuidance}
                    </div>
                    <div
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px]"
                      style={{
                        background: "rgba(13,26,46,0.8)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT_SOFT,
                      }}
                    >
                      <Shield size={10} style={{ color: ORANGE }} />
                      {tier.adminGuidance}
                    </div>
                    <div
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px]"
                      style={{
                        background: "rgba(13,26,46,0.8)",
                        border: `1px solid ${BORDER}`,
                        color: TEXT_SOFT,
                      }}
                    >
                      <Brain size={10} style={{ color: ORANGE }} />
                      {tier.aiUsage}
                    </div>
                  </div>

                  {/* Ecosystem size */}
                  <div
                    className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 text-[12px]"
                    style={{
                      background: "rgba(13,26,46,0.8)",
                      border: `1px solid ${BORDER}`,
                      color: TEXT_SOFT,
                    }}
                  >
                    <Network
                      size={13}
                      style={{ color: ORANGE, flexShrink: 0 }}
                    />
                    <span>{tier.ecosystemSize}</span>
                  </div>

                  {(tier.id === "small" || tier.id === "medium") && (
                    <div
                      className="rounded-lg px-3 py-3 mb-4"
                      style={{
                        background: "rgba(255,107,43,0.05)",
                        border: "1px solid rgba(255,107,43,0.2)",
                      }}
                    >
                      <div
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white mb-2"
                        style={{ background: ORANGE }}
                      >
                        <Server size={10} />
                        Shared Operational Infrastructure
                      </div>
                      <div className="flex flex-col gap-1">
                        {[
                          "Cloud Engine not included",
                          "Enterprise Cloud Engine available separately",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-1.5">
                            <span
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: TEXT_MUTED,
                                flexShrink: 0,
                              }}
                            />
                            <span
                              className="text-[11px]"
                              style={{ color: TEXT_MUTED }}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {tier.id === "large" && (
                    <div className="flex flex-col gap-2 mb-4">
                      {[
                        "Enterprise-ready",
                        "Cloud Engine Assessment Available",
                        "Dedicated Operational Compute Option",
                      ].map((label) => (
                        <div
                          key={label}
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white w-fit"
                          style={{
                            background: ORANGE,
                            boxShadow: "0 1px 8px rgba(255,107,43,0.3)",
                          }}
                        >
                          <Shield size={10} />
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Separator */}
                  <div className="h-px mb-5" style={{ background: BORDER }} />

                  {/* Credit allocations */}
                  <div
                    className="flex flex-col gap-2 rounded-lg px-3 py-3 mb-5 text-[12px]"
                    style={{
                      background: "rgba(255,107,43,0.06)",
                      border: "1px solid rgba(255,107,43,0.15)",
                      color: TEXT_SOFT,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu size={13} style={{ color: ORANGE, flexShrink: 0 }} />
                      <span className="font-medium">
                        {tier.compute.toLocaleString()} Compute Credits
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive
                        size={13}
                        style={{ color: ORANGE, flexShrink: 0 }}
                      />
                      <span className="font-medium">
                        {tier.storage.toLocaleString()} Storage Credits
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles
                        size={13}
                        style={{ color: ORANGE, flexShrink: 0 }}
                      />
                      <span className="font-medium">
                        {tier.ai.toLocaleString()} AI Credits
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-2.5 mb-5 flex-1">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check
                          size={14}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: ORANGE }}
                        />
                        <span
                          className="text-[13px] leading-[1.5]"
                          style={{ color: TEXT_SOFT }}
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Extra messaging for Large */}
                  {tier.extraMessaging && (
                    <div
                      className="flex flex-col gap-2 rounded-lg px-3 py-3 mb-5 text-[12px]"
                      style={{
                        background: "rgba(255,107,43,0.04)",
                        border: "1px solid rgba(255,107,43,0.12)",
                        color: TEXT_SOFT,
                      }}
                    >
                      {tier.extraMessaging.map((msg) => (
                        <div key={msg} className="flex items-start gap-2">
                          <Server
                            size={12}
                            className="flex-shrink-0 mt-0.5"
                            style={{ color: ORANGE }}
                          />
                          <span>{msg}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    type="button"
                    data-ocid={`pricing.tier.${tier.id}.start_button`}
                    onClick={() => handleSelectTier(tier)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[15px] cursor-pointer border-none"
                    style={{
                      background: tier.highlighted
                        ? ORANGE
                        : "rgba(255,107,43,0.1)",
                      color: tier.highlighted ? "#fff" : ORANGE,
                      border: tier.highlighted
                        ? "none"
                        : "1px solid rgba(255,107,43,0.3)",
                      transition: "opacity 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.88";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    {tier.cta}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trial note */}
          <p
            className="text-center text-[12px] mt-8"
            style={{ color: TEXT_MUTED }}
          >
            All tiers include a 1-month free trial. No charges until your trial
            period ends. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Shared Operational Billing */}
      <section
        className="relative px-6 py-20"
        style={{
          background: `linear-gradient(160deg, ${BG_MID} 0%, ${BG_DEEP} 100%)`,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "900px" }}>
          <div className="text-center mb-12">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3"
              style={{ color: ORANGE }}
            >
              Shared Operational Billing
            </p>
            <h2
              className="font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4"
              style={{
                fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Choose how infrastructure costs flow across your ecosystem
            </h2>
            <p
              className="text-[14px] leading-[1.7]"
              style={{ color: TEXT_SOFT, maxWidth: "560px", margin: "0 auto" }}
            >
              Organizations can choose how compute and storage costs are handled
              across the channel ecosystem — centralized, shared, or hybrid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BILLING_MODES.map((mode) => (
              <div
                key={mode.id}
                className="rounded-xl p-6 flex flex-col"
                style={{
                  background: "rgba(13,26,46,0.6)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(255,107,43,0.1)",
                    border: "1px solid rgba(255,107,43,0.2)",
                  }}
                >
                  <Globe size={18} style={{ color: ORANGE }} />
                </div>
                <h3
                  className="text-[15px] font-bold mb-2"
                  style={{ color: "#E7EEF8" }}
                >
                  {mode.title}
                </h3>
                <p
                  className="text-[13px] leading-[1.6] mb-4"
                  style={{ color: TEXT_SOFT }}
                >
                  {mode.description}
                </p>
                <ul className="flex flex-col gap-2 flex-1">
                  {mode.examples.map((ex) => (
                    <li
                      key={ex}
                      className="flex items-start gap-2 text-[12px]"
                      style={{ color: TEXT_SOFT }}
                    >
                      <ChevronRight
                        size={12}
                        style={{ color: ORANGE, flexShrink: 0, marginTop: 2 }}
                      />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Credits Work explainer */}
      <section
        className="relative px-6 py-20"
        style={{
          background: `linear-gradient(160deg, ${BG_MID} 0%, ${BG_DEEP} 100%)`,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "900px" }}>
          <div className="text-center mb-12">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3"
              style={{ color: ORANGE }}
            >
              How Credits Work
            </p>
            <h2
              className="font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4"
              style={{
                fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Simple, transparent operational economics
            </h2>
            <p
              className="text-[14px] leading-[1.7]"
              style={{ color: TEXT_SOFT, maxWidth: "560px", margin: "0 auto" }}
            >
              CHANNELFORGE Credits power your entire operational infrastructure.
              No per-user fees. No hidden costs. Just clear, scalable compute
              and storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu,
                title: "Compute Credits",
                description:
                  "Power every workflow, report, dashboard refresh, and operational process. Compute scales automatically with your activity.",
              },
              {
                icon: HardDrive,
                title: "Storage Credits",
                description:
                  "Store accounts, opportunities, documents, audit logs, and all operational data in isolated, sovereign canisters.",
              },
              {
                icon: Brain,
                title: "AI Credits",
                description:
                  "Fuel ForgeAI insights, renewal risk scoring, automated summaries, forecasting, and intelligent recommendations.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl p-6"
                style={{
                  background: "rgba(13,26,46,0.6)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(255,107,43,0.1)",
                    border: "1px solid rgba(255,107,43,0.2)",
                  }}
                >
                  <Icon size={18} style={{ color: ORANGE }} />
                </div>
                <h3
                  className="text-[15px] font-bold mb-2"
                  style={{ color: "#E7EEF8" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[13px] leading-[1.6]"
                  style={{ color: TEXT_SOFT }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-6 mt-8"
            style={{
              background: "rgba(11,18,32,0.85)",
              border: `1px solid ${BORDER}`,
            }}
          >
            <div className="flex items-start gap-3">
              <Zap
                size={16}
                style={{ color: ORANGE, marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <p
                  className="text-[13px] font-semibold mb-1"
                  style={{ color: "#E7EEF8" }}
                >
                  Credit consumption examples
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2">
                  {[
                    "AI Chat session — 10 Compute Credits",
                    "Report generation — 5 Compute Credits",
                    "Dashboard refresh — 1 Compute Credit",
                    "File upload — Storage-based credits",
                    "AI summary — 15 AI Credits",
                    "Forecast analysis — 25 AI Credits",
                    "Messaging activity — 0.5 Compute Credits",
                    "Export operation — 3 Compute Credits",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-[12px]"
                      style={{ color: TEXT_SOFT }}
                    >
                      <Check size={11} style={{ color: ORANGE }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sovereign infrastructure messaging */}
      <section
        className="relative px-6 py-20"
        style={{
          background: BG_DEEP,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div className="mx-auto" style={{ maxWidth: "760px" }}>
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3"
              style={{ color: ORANGE }}
            >
              Sovereign Infrastructure
            </p>
            <h2
              className="font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4"
              style={{
                fontSize: "clamp(1.6rem, 2.4vw, 2rem)",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              Your operational data. Your control.
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                title: "Operational infrastructure aligned to your ecosystem.",
                description:
                  "Compute and storage can scale across your Vendor, Distributor, and Reseller network.",
              },
              {
                title:
                  "Control infrastructure allocation across your operational hierarchy.",
                description:
                  "Hierarchy-aware access reduces unnecessary data exposure. Users only see what they are permitted to see.",
              },
              {
                title: "Enterprise-grade compute architecture",
                description:
                  "Built on decentralized infrastructure designed for enterprise-scale operations — scalable, resilient, and sovereign.",
              },
              {
                title: "No blockchain complexity exposed",
                description:
                  "All infrastructure mechanics remain behind the scenes. You see only credits, usage, and operational analytics.",
              },
            ].map(({ title, description }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-xl px-5 py-4"
                style={{
                  background: "rgba(13,26,46,0.6)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "rgba(255,107,43,0.12)",
                    border: "1px solid rgba(255,107,43,0.25)",
                  }}
                >
                  <Shield size={12} style={{ color: ORANGE }} />
                </div>
                <div>
                  <p
                    className="text-[14px] font-semibold mb-1"
                    style={{ color: "#E7EEF8" }}
                  >
                    {title}
                  </p>
                  <p
                    className="text-[13px] leading-[1.6]"
                    style={{ color: TEXT_SOFT }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="relative px-6 py-20 text-center"
        style={{ background: BG_DEEP, borderTop: `1px solid ${BORDER}` }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(255,107,43,0.06) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-10 mx-auto" style={{ maxWidth: "580px" }}>
          <h2
            className="font-black text-white tracking-[-0.04em] leading-[1.05] mb-5"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            Start your free trial today.
            <br />
            <span style={{ color: ORANGE }}>No commitment required.</span>
          </h2>
          <p
            className="text-[14px] leading-[1.7] mb-8"
            style={{ color: TEXT_MUTED }}
          >
            Choose your credit bundle, set up your workspace, and experience
            enterprise-grade channel operations built specifically for your role
            in the ecosystem.
          </p>
          <button
            type="button"
            data-ocid="pricing.bottom.cta.primary_button"
            onClick={() => {
              const medium = TIERS.find((t) => t.id === "medium")!;
              sessionStorage.setItem("cf_selected_bundle", medium.id);
              sessionStorage.setItem("cf_bundle_name", medium.name);
              sessionStorage.setItem("cf_bundle_price", String(medium.price));
              sessionStorage.setItem(
                "cf_bundle_compute",
                String(medium.compute),
              );
              sessionStorage.setItem(
                "cf_bundle_storage",
                String(medium.storage),
              );
              sessionStorage.setItem("cf_bundle_ai", String(medium.ai));
              navigate({ to: "/subscription-onboarding" });
            }}
            className="px-12 py-4 rounded-xl font-bold text-[16px] text-white cursor-pointer border-none"
            style={{ background: ORANGE }}
          >
            Get Started — Start Free Trial &rarr;
          </button>
          <p
            className="mt-4 text-[12px]"
            style={{ color: "rgba(125,138,160,0.55)" }}
          >
            1 month free &middot; No card charged during trial &middot;
            Enterprise-grade security
          </p>
        </div>

        <footer
          className="mt-16 mx-auto flex items-center justify-between px-0"
          style={{
            maxWidth: "1200px",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: "1.5rem",
          }}
        >
          <div className="flex flex-col items-start" style={{ lineHeight: 1 }}>
            <div
              className="flex items-baseline"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              <span
                className="font-black text-[11px]"
                style={{ color: "#C8D6E8" }}
              >
                CHANNEL
              </span>
              <span
                className="font-black text-[11px] forge-pulse"
                style={{ color: ORANGE }}
              >
                FORGE
              </span>
            </div>
            <span
              className="text-[8px] font-medium tracking-[0.22em] uppercase"
              style={{ color: "rgba(125,138,160,0.6)" }}
            >
              CRM
            </span>
          </div>
          <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
            &copy; {new Date().getFullYear()}.{" "}
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
    </div>
  );
}
