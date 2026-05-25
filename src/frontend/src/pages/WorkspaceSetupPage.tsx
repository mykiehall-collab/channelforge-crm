import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, Network, Users } from "lucide-react";
import { useEffect, useState } from "react";

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
        <span
          className="font-black text-[24px]"
          style={{
            color: "#C8D6E8",
            textShadow: "0 1px 2px rgba(255,255,255,0.15)",
          }}
        >
          CHANNEL
        </span>
        <span className="font-black text-[24px]" style={{ color: ORANGE }}>
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

interface WorkspaceOption {
  id: "vendor" | "distributor" | "reseller";
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  route: string;
  icon: React.ReactNode;
  accentColor: string;
  features: string[];
}

const WORKSPACE_OPTIONS: WorkspaceOption[] = [
  {
    id: "vendor",
    title: "Vendor Workspace",
    subtitle: "Command center & partner oversight",
    description:
      "Manage Distributors, Resellers, customer operations, renewals, incentives, and channel intelligence.",
    buttonText: "Create Vendor Workspace",
    route: "/onboarding",
    icon: <Building2 size={28} />,
    accentColor: ORANGE,
    features: [
      "Distributor & Reseller management",
      "Channel intelligence & ForgeAI",
      "Renewal & incentive control",
      "Full tier governance",
    ],
  },
  {
    id: "distributor",
    title: "Distributor Workspace",
    subtitle: "Multi-vendor distribution operations",
    description:
      "Manage Vendor relationships, Resellers, regional operations, promotions, and channel execution.",
    buttonText: "Create Distributor Workspace",
    route: "/distributor-setup",
    icon: <Network size={28} />,
    accentColor: ORANGE,
    features: [
      "Vendor relationship management",
      "Reseller network operations",
      "Regional promotions & MDF",
      "Pipeline & deal execution",
    ],
  },
  {
    id: "reseller",
    title: "Reseller Workspace",
    subtitle: "Partner workspace & sales activity",
    description:
      "Manage customer accounts, renewals, opportunities, deal registrations, and pipeline activity.",
    buttonText: "Create Reseller Workspace",
    route: "/reseller-setup",
    icon: <Users size={28} />,
    accentColor: ORANGE,
    features: [
      "Customer account management",
      "Renewal & opportunity tracking",
      "Deal registration submissions",
      "Pipeline visibility",
    ],
  },
];

function WorkspaceCard({
  option,
  onSelect,
  isRecommended,
}: {
  option: WorkspaceOption;
  onSelect: (route: string) => void;
  isRecommended?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isRecommended;

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        background: active ? "rgba(15,24,42,0.97)" : "rgba(13,26,46,0.92)",
        border: active
          ? "1px solid rgba(255,107,43,0.55)"
          : `1px solid ${BORDER}`,
        backdropFilter: "blur(20px)",
        boxShadow: active
          ? "0 0 32px rgba(255,107,43,0.14), 0 24px 64px rgba(0,0,0,0.55)"
          : "0 12px 40px rgba(0,0,0,0.4)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`workspace_setup.${option.id}_card`}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(255,107,43,0.15)",
            border: "1px solid rgba(255,107,43,0.4)",
          }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{ color: ORANGE }}
          >
            Recommended based on your profile
          </span>
        </div>
      )}

      {/* Top accent bar */}
      <div
        className="absolute top-0 left-6 right-6 h-[2px] rounded-full transition-all duration-300"
        style={{
          background: active
            ? "linear-gradient(90deg, transparent, rgba(255,107,43,0.9), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,107,43,0.35), transparent)",
        }}
      />

      <div className="flex flex-col flex-1 p-7 gap-5">
        {/* Icon + title */}
        <div className="flex flex-col gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: hovered
                ? "rgba(255,107,43,0.16)"
                : "rgba(255,107,43,0.08)",
              border: hovered
                ? "1px solid rgba(255,107,43,0.4)"
                : "1px solid rgba(255,107,43,0.18)",
              color: ORANGE,
            }}
          >
            {option.icon}
          </div>

          <div>
            <h2
              className="text-xl font-black leading-tight mb-1"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: "#E7EEF8",
                letterSpacing: "-0.02em",
              }}
            >
              {option.title}
            </h2>
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.1em] px-2.5 py-0.5 rounded-full"
              style={{
                background: "rgba(255,107,43,0.08)",
                border: "1px solid rgba(255,107,43,0.22)",
                color: "rgba(255,107,43,0.8)",
              }}
            >
              {option.subtitle}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-[13.5px] leading-relaxed"
          style={{ color: TEXT_SOFT, lineHeight: "1.6" }}
        >
          {option.description}
        </p>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(30,48,80,0.7)" }} />

        {/* Feature list */}
        <ul className="flex flex-col gap-2 flex-1">
          {option.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5">
              <span
                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{
                  background: hovered ? ORANGE : "rgba(255,107,43,0.5)",
                  transition: "background 0.2s",
                }}
              />
              <span className="text-[12.5px]" style={{ color: TEXT_MUTED }}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => onSelect(option.route)}
          data-ocid={`workspace_setup.${option.id}.primary_button`}
          className="w-full mt-2 flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200"
          style={{
            background: active
              ? `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`
              : "rgba(255,107,43,0.12)",
            border: active
              ? "1px solid transparent"
              : "1px solid rgba(255,107,43,0.3)",
            color: active ? "#fff" : "rgba(255,107,43,0.9)",
            boxShadow: active ? "0 4px 20px rgba(255,107,43,0.4)" : "none",
          }}
        >
          {option.buttonText}
          <ArrowRight
            size={16}
            style={{
              opacity: active ? 1 : 0.7,
              transform: active ? "translateX(2px)" : "translateX(0)",
              transition: "all 0.2s",
            }}
          />
        </button>
      </div>
    </div>
  );
}

type RecommendedWorkspace = "vendor" | "distributor" | "reseller" | null;

export function WorkspaceSetupPage() {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState<RecommendedWorkspace>(null);

  useEffect(() => {
    const hasSession =
      localStorage.getItem("cf_session_token") ||
      sessionStorage.getItem("cf_session_token");
    const hasCompany =
      localStorage.getItem("cf_company_type") ||
      sessionStorage.getItem("cf_company_type");
    if (hasSession && hasCompany) {
      navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cf_subscription");
      if (!raw) return;
      const sub = JSON.parse(raw) as { orgType?: string };
      const ot = sub.orgType?.toLowerCase() ?? "";
      if (ot.includes("vendor")) setRecommended("vendor");
      else if (ot.includes("distributor")) setRecommended("distributor");
      else if (ot.includes("reseller")) setRecommended("reseller");
    } catch {
      // ignore
    }
  }, []);

  const handleSelect = (route: string) => {
    navigate({
      to: route as "/onboarding" | "/distributor-setup" | "/reseller-setup",
    });
  };

  return (
    <>
      <style>{`
        @keyframes workspace-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .workspace-glow-ring {
          animation: workspace-glow 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className="min-h-screen flex flex-col"
        style={{
          background: `linear-gradient(160deg, ${BG_DEEP} 0%, ${BG_BASE} 40%, ${BG_MID} 100%)`,
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
            data-ocid="workspace_setup.back_button"
          >
            ← Back
          </button>
        </header>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 w-full">
          {/* Page header */}
          <div className="text-center mb-12 max-w-[600px]">
            {/* Step badge */}
            <div className="flex justify-center mb-5">
              <span
                className="workspace-glow-ring text-[11px] font-semibold uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-full border"
                style={{
                  borderColor: "rgba(255,107,43,0.35)",
                  background: "rgba(255,107,43,0.08)",
                  color: ORANGE,
                }}
              >
                Workspace Setup
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: "#E7EEF8",
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
              }}
              data-ocid="workspace_setup.page_title"
            >
              Set Up Your <span style={{ color: ORANGE }}>CHANNELFORGE</span>{" "}
              Workspace
            </h1>

            <p
              className="text-base md:text-lg"
              style={{ color: TEXT_MUTED, lineHeight: "1.65" }}
              data-ocid="workspace_setup.page_subtitle"
            >
              Choose the workspace type that matches your role within the
              channel ecosystem.
            </p>
          </div>

          {/* Cards grid — explicit 3-column grid, all cards always rendered */}
          <div
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ maxWidth: "1120px" }}
            data-ocid="workspace_setup.cards_list"
          >
            {WORKSPACE_OPTIONS.map((option) => (
              <WorkspaceCard
                key={option.id}
                option={option}
                onSelect={handleSelect}
                isRecommended={recommended === option.id}
              />
            ))}
          </div>

          {/* Footer note */}
          <p
            className="mt-10 text-[12px] text-center max-w-[480px]"
            style={{ color: "rgba(125,138,160,0.45)", lineHeight: "1.6" }}
          >
            Your workspace selection determines your permissions, hierarchy, and
            available features within the CHANNELFORGE platform. This cannot be
            changed after setup.
          </p>
        </div>

        {/* Bottom footer */}
        <footer
          className="text-center py-4 border-t"
          style={{
            borderColor: "rgba(30,48,80,0.35)",
            background: "rgba(6,13,24,0.6)",
          }}
        >
          <p
            className="text-[11px]"
            style={{ color: "rgba(125,138,160,0.35)" }}
          >
            Sovereignty-first · Enterprise-grade · Audit-ready ·{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "rgba(255,107,43,0.4)" }}
            >
              Built with caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
