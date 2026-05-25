import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  Globe,
  Lock,
  Network,
  Server,
  Shield,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const NAVY = "#060d18";
const NAVY_MID = "rgba(13,26,46,0.95)";
const NAVY_CARD = "rgba(13,26,46,0.7)";
const ORANGE = "#FF6B2B";
const BORDER = "rgba(255,107,43,0.15)";
const BORDER_SUBTLE = "rgba(255,107,43,0.08)";
const TEXT_SOFT = "rgba(255,255,255,0.72)";
const TEXT_MUTED = "rgba(255,255,255,0.45)";

type CategoryTag =
  | "Technical"
  | "Commercial"
  | "Infrastructure"
  | "AI"
  | "Sovereignty"
  | "Enterprise Operations"
  | "Distributed Infrastructure";

interface Resource {
  id: string;
  title: string;
  description: string;
  source: string;
  contentType: string;
  readTime: string;
  category: CategoryTag;
  url: string;
  summary: string;
}

const CATEGORY_COLORS: Record<CategoryTag, string> = {
  Technical: "#3b82f6",
  Commercial: "#10b981",
  Infrastructure: ORANGE,
  AI: "#8b5cf6",
  Sovereignty: "#f59e0b",
  "Enterprise Operations": "#06b6d4",
  "Distributed Infrastructure": "#ec4899",
};

const RESOURCES: Resource[] = [
  {
    id: "dfinity-foundation",
    title: "DFINITY Foundation",
    description:
      "Official home of the Internet Computer Protocol and Cloud Engine infrastructure research.",
    source: "DFINITY Foundation",
    contentType: "Website",
    readTime: "Ongoing",
    category: "Infrastructure",
    url: "https://dfinity.org/",
    summary:
      "Official home of the Internet Computer Protocol — distributed public infrastructure built for enterprise-scale operational compute and sovereign operational environments. Explore technical documentation, research papers, ecosystem updates, and resources across sovereign compute, AI workloads, and distributed operational infrastructure.",
  },
  {
    id: "icp-docs",
    title: "Internet Computer Documentation",
    description:
      "Comprehensive technical documentation for the Internet Computer operational infrastructure.",
    source: "ICP",
    contentType: "Documentation",
    readTime: "20 min read",
    category: "Technical",
    url: "https://docs.internetcomputer.org/",
    summary:
      "The official developer and enterprise documentation hub for the Internet Computer. Covers architecture fundamentals, canister development, operational compute, infrastructure governance, and enterprise deployment patterns. Essential technical reference for organizations evaluating sovereign infrastructure at scale.",
  },
  {
    id: "mission70",
    title: "Mission 70 Whitepaper",
    description:
      "Official DFINITY whitepaper outlining enterprise-scale operational infrastructure goals and technical architecture.",
    source: "DFINITY",
    contentType: "Whitepaper",
    readTime: "45 min read",
    category: "Enterprise Operations",
    url: "https://internetcomputer.org/whitepapers/mission70.pdf",
    summary:
      "Mission 70 outlines DFINITY's strategic roadmap for achieving 70% of global enterprise compute on sovereign infrastructure. The whitepaper details technical architecture goals, operational governance models, infrastructure scaling strategy, and the enterprise path towards decentralized operational sovereignty. A critical read for infrastructure and enterprise strategy teams.",
  },
  {
    id: "pakistan-partnership",
    title: "Pakistan Digital Authority Partnership",
    description:
      "Official announcement of the Pakistan sovereign infrastructure initiative and DFINITY collaboration.",
    source: "ICP News",
    contentType: "Announcement",
    readTime: "5 min read",
    category: "Sovereignty",
    url: "https://internetcomputer.org/news/media-releases/pakistan-digital-authority-dfinity-partnership-announcement/",
    summary:
      "The Pakistan Digital Authority and DFINITY Foundation announced a landmark partnership to deploy sovereign digital infrastructure at national scale. This initiative represents a significant adoption milestone for distributed operational infrastructure in strategic national environments — with implications for enterprise governance, digital sovereignty, and AI-ready national infrastructure models globally.",
  },
  {
    id: "dfinity-github",
    title: "DFINITY GitHub Repository",
    description:
      "Open source operational infrastructure code repository for the Internet Computer.",
    source: "GitHub",
    contentType: "Repository",
    readTime: "Developer reference",
    category: "Distributed Infrastructure",
    url: "https://github.com/dfinity/ic",
    summary:
      "The open source repository for the Internet Computer protocol and infrastructure. Contains core components for distributed operational environments, governance systems, consensus protocols, and enterprise compute modules. Essential reference for technical teams evaluating infrastructure architecture and sovereignty-first operational design.",
  },
];

const BENEFITS = [
  {
    icon: Lock,
    title: "Data Sovereignty",
    desc: "Maintain full operational control over where enterprise data resides and who can access it.",
  },
  {
    icon: Shield,
    title: "Operational Resilience",
    desc: "Distributed infrastructure reduces single points of failure across operational environments.",
  },
  {
    icon: Building2,
    title: "Vendor Independence",
    desc: "Reduce dependency on any single hyperscaler provider for mission-critical operational systems.",
  },
  {
    icon: Network,
    title: "Infrastructure Portability",
    desc: "Operational environments can be repositioned without being locked to a specific provider.",
  },
  {
    icon: Cpu,
    title: "AI Operational Control",
    desc: "Deploy AI workloads within sovereign operational environments you govern and control.",
  },
  {
    icon: CheckCircle,
    title: "Regulatory Alignment",
    desc: "Align infrastructure with national, regional, and enterprise regulatory requirements.",
  },
  {
    icon: Globe,
    title: "Reduced Single-Provider Dependency",
    desc: "Distribute operational risk across sovereign infrastructure environments.",
  },
  {
    icon: Database,
    title: "Operational Governance",
    desc: "Enterprise-grade governance controls for compute, data, and access management.",
  },
  {
    icon: Zap,
    title: "Secure Infrastructure Segmentation",
    desc: "Isolate operational environments by region, department, or organizational tier.",
  },
];

const CLOUD_ENGINE_FEATURES = [
  {
    icon: Server,
    title: "Dedicated Operational Environments",
    desc: "Run applications in isolated enterprise compute environments — not shared infrastructure pools.",
  },
  {
    icon: Shield,
    title: "Sovereign Operational Control",
    desc: "Unlike hyperscaler models, organizations control their compute, data residency, and governance rules.",
  },
  {
    icon: Lock,
    title: "Infrastructure Isolation",
    desc: "Each Cloud Engine is operationally isolated — no shared tenancy with unrelated organizations.",
  },
  {
    icon: Cpu,
    title: "AI-Ready Compute",
    desc: "Purpose-built for AI operational workloads at enterprise scale — optimized for inference and training.",
  },
  {
    icon: Database,
    title: "Configurable Infrastructure",
    desc: "Operational environments are configurable by organization, region, and operational workload type.",
  },
  {
    icon: Globe,
    title: "Distributed Architecture",
    desc: "Cloud Engines operate across a distributed global network — not a single centralized data centre.",
  },
];

const SETUP_STEPS = [
  {
    step: 1,
    title: "Enterprise Operational Assessment",
    desc: "Evaluate current infrastructure dependencies, operational workload scale, and sovereign infrastructure requirements.",
  },
  {
    step: 2,
    title: "Operational Sizing",
    desc: "Define compute, storage, and AI workload requirements across organizational tiers.",
  },
  {
    step: 3,
    title: "Regional Infrastructure Alignment",
    desc: "Select regional operational environments aligned with geographic, regulatory, and enterprise governance needs.",
  },
  {
    step: 4,
    title: "AI Workload Planning",
    desc: "Map AI operational requirements to dedicated compute environments for optimal performance.",
  },
  {
    step: 5,
    title: "Operational Governance Setup",
    desc: "Configure access governance, organizational controls, and operational permission models.",
  },
  {
    step: 6,
    title: "Infrastructure Deployment",
    desc: "Deploy dedicated Cloud Engine environments with enterprise configuration and operational isolation.",
  },
  {
    step: 7,
    title: "Ongoing Operational Management",
    desc: "Monitor, scale, and govern infrastructure through CHANNELFORGE's operational intelligence layer.",
  },
];

const REGIONS = [
  {
    name: "Europe",
    nodes: "42 operational nodes",
    desc: "GDPR-aligned operational compute environments across Western and Central Europe.",
    flag: "🇪🇺",
  },
  {
    name: "North America",
    nodes: "38 operational nodes",
    desc: "Enterprise-grade compute spanning North American operational infrastructure corridors.",
    flag: "🌎",
  },
  {
    name: "APAC",
    nodes: "27 operational nodes",
    desc: "Asia-Pacific sovereign infrastructure environments aligned with regional data governance requirements.",
    flag: "🌏",
  },
  {
    name: "Middle East",
    nodes: "14 operational nodes",
    desc: "Emerging sovereign infrastructure footprint supporting national AI and enterprise digital initiatives.",
    flag: "🌍",
  },
];

interface ResourcePreviewModalProps {
  resource: Resource;
  onClose: () => void;
}

function ResourcePreviewModal({
  resource,
  onClose,
}: ResourcePreviewModalProps) {
  const catColor = CATEGORY_COLORS[resource.category] ?? ORANGE;

  return (
    <dialog
      aria-label={`Preview: ${resource.title}`}
      open
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1.5rem",
        border: "none",
        maxWidth: "100vw",
        width: "100%",
        height: "100%",
        margin: 0,
      }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        style={{
          background: NAVY_MID,
          border: `1px solid ${BORDER}`,
          borderTop: `3px solid ${catColor}`,
          borderRadius: "20px",
          padding: "2.5rem",
          maxWidth: "580px",
          width: "100%",
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 40px ${ORANGE}18`,
          backdropFilter: "blur(20px)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          aria-label="Close preview"
          data-ocid="sovereign.resource_preview.close_button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: TEXT_SOFT,
            cursor: "pointer",
            padding: "0.35rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={16} />
        </button>

        {/* Category & Type badges */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1.25rem",
          }}
        >
          <span
            style={{
              background: `${catColor}22`,
              color: catColor,
              border: `1px solid ${catColor}44`,
              borderRadius: "9999px",
              padding: "0.2rem 0.75rem",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {resource.category}
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.06)",
              color: TEXT_MUTED,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "9999px",
              padding: "0.2rem 0.75rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {resource.contentType}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          {resource.title}
        </h3>

        {/* Summary */}
        <p
          style={{
            color: TEXT_SOFT,
            fontSize: "0.9rem",
            lineHeight: 1.75,
            marginBottom: "1.5rem",
          }}
        >
          {resource.summary}
        </p>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
            paddingTop: "1rem",
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          {[
            { label: "Source", value: resource.source },
            { label: "Type", value: resource.contentType },
            { label: "Est. Time", value: resource.readTime },
          ].map(({ label, value }) => (
            <div key={label}>
              <p
                style={{
                  color: TEXT_MUTED,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "0.2rem",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          data-ocid="sovereign.resource_preview.open_button"
          onClick={() =>
            window.open(resource.url, "_blank", "noopener,noreferrer")
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            background: `linear-gradient(135deg, ${ORANGE}, #e05a1f)`,
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "0.9rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 4px 24px ${ORANGE}44`,
            letterSpacing: "0.01em",
          }}
        >
          Open Official Resource
          <ExternalLink size={16} />
        </button>

        <p
          style={{
            textAlign: "center",
            color: TEXT_MUTED,
            fontSize: "0.75rem",
            marginTop: "0.75rem",
          }}
        >
          Opens in a new tab — your CHANNELFORGE session is preserved
        </p>
      </div>
    </dialog>
  );
}

function SectionDivider() {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        background:
          "linear-gradient(90deg, transparent, rgba(255,107,43,0.25) 30%, rgba(255,107,43,0.25) 70%, transparent)",
        margin: "0",
      }}
    />
  );
}

export function SovereignInfrastructurePage() {
  const navigate = useNavigate();
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  return (
    <div
      style={{
        background: NAVY,
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── NAV BAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(6,13,24,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${BORDER}`,
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}
      >
        <button
          type="button"
          data-ocid="sovereign.nav.home_link"
          onClick={() => navigate({ to: "/" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              background: `linear-gradient(135deg, ${ORANGE}, #e05a1f)`,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={14} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 900,
              fontSize: "1rem",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            CHANNELFORGE
          </span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {[
            { label: "Key Concepts", href: "#what-are-cloud-engines" },
            { label: "Strategic Value", href: "#why-enterprises-care" },
            { label: "Adoption Trends", href: "#national-adoption" },
            { label: "How It Works", href: "#how-global-infrastructure-works" },
            { label: "Setup Guide", href: "#cloud-engine-setup" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                color: TEXT_SOFT,
                fontSize: "0.8rem",
                fontWeight: 500,
                textDecoration: "none",
                display: "none",
              }}
              className="hidden lg:inline"
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            data-ocid="sovereign.nav.request_consultation_button"
            onClick={() => navigate({ to: "/enterprise-calculator" })}
            style={{
              background: `linear-gradient(135deg, ${ORANGE}, #e05a1f)`,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.25rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Request a Consultation
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          padding: "7rem 1.5rem 5rem",
          textAlign: "center",
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,43,0.1) 0%, transparent 60%), ${NAVY}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: `radial-gradient(ellipse, ${ORANGE}18 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{ maxWidth: "860px", margin: "0 auto", position: "relative" }}
        >
          <span
            style={{
              display: "inline-block",
              background: `${ORANGE}18`,
              color: ORANGE,
              border: `1px solid ${ORANGE}40`,
              borderRadius: "9999px",
              padding: "0.3rem 1.1rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
            }}
          >
            Enterprise Infrastructure Briefing
          </span>

          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              marginBottom: "1.5rem",
            }}
          >
            Cloud Engines & <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, #ffb347)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sovereign
            </span>{" "}
            Infrastructure
          </h1>

          <p
            style={{
              color: TEXT_SOFT,
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              lineHeight: 1.75,
              maxWidth: "680px",
              margin: "0 auto 2.5rem",
            }}
          >
            An enterprise operational infrastructure briefing for Vendors,
            Distributors, Resellers, and operational leaders who want control
            over where their data lives and how their infrastructure runs.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#what-are-cloud-engines"
              data-ocid="sovereign.hero.explore_button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: `linear-gradient(135deg, ${ORANGE}, #e05a1f)`,
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "0.9rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
                boxShadow: `0 4px 32px ${ORANGE}44`,
              }}
            >
              Explore Cloud Engines
              <ArrowRight size={16} />
            </a>
            <button
              type="button"
              data-ocid="sovereign.hero.calculator_button"
              onClick={() => navigate({ to: "/enterprise-calculator" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: NAVY_CARD,
                color: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: "10px",
                padding: "0.9rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(12px)",
              }}
            >
              Enterprise Calculator
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── SECTION 1: WHAT ARE CLOUD ENGINES ── */}
      <section
        id="what-are-cloud-engines"
        style={{ padding: "5rem 1.5rem", background: "rgba(8,17,32,0.95)" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}18`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Key Concepts
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
              What Are Cloud Engines?
            </h2>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1.05rem",
                maxWidth: "680px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Cloud Engines are dedicated operational environments that allow
              organizations to run applications, AI systems, and operational
              data infrastructure in environments they control — not rented from
              a centralized provider.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {CLOUD_ENGINE_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: NAVY_CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "16px",
                  padding: "1.75rem",
                  backdropFilter: "blur(12px)",
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    background: `${ORANGE}18`,
                    border: `1px solid ${ORANGE}40`,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Icon size={20} color={ORANGE} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "0.5rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: TEXT_MUTED,
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── SECTION 2: WHY ENTERPRISES CARE ── */}
      <section
        id="why-enterprises-care"
        style={{ padding: "5rem 1.5rem", background: NAVY }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}18`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Strategic Value
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
              Why Enterprises Care
            </h2>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1.05rem",
                maxWidth: "620px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Enterprise organizations increasingly want operational control
              over where their data lives, how it is processed, and who governs
              their infrastructure.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: "rgba(13,26,46,0.5)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "14px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  backdropFilter: "blur(8px)",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: `${ORANGE}14`,
                    border: `1px solid ${ORANGE}30`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} color={ORANGE} />
                </div>
                <h3
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: TEXT_MUTED,
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── SECTION 3: COMPARISON ── */}
      <section
        id="centralized-vs-sovereign"
        style={{ padding: "5rem 1.5rem", background: "rgba(8,17,32,0.95)" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}18`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Infrastructure Comparison
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
              Centralized Cloud vs Sovereign Infrastructure
            </h2>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1rem",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Understanding the operational difference between renting
              infrastructure and controlling it.
            </p>
          </div>

          {/* Comparison table */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
            className="grid-cols-1 lg:grid-cols-2"
          >
            {/* Traditional Cloud */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "2rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Server size={18} color="rgba(255,255,255,0.4)" />
                </div>
                <div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.1rem",
                    }}
                  >
                    Traditional
                  </p>
                  <p
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      color: "#fff",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                    }}
                  >
                    Centralized Cloud
                  </p>
                </div>
              </div>
              {[
                "Rented infrastructure on shared compute pools",
                "Centralized control by provider (AWS, GCP, Azure)",
                "Vendor lock-in through proprietary services",
                "Limited governance — provider sets the rules",
                "Data residency subject to provider terms",
                "Dependency risk if provider disrupts service",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "50%",
                      marginTop: "7px",
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      color: TEXT_MUTED,
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* Cloud Engine */}
            <div
              style={{
                background: NAVY_CARD,
                border: `1px solid ${BORDER}`,
                borderTop: `3px solid ${ORANGE}`,
                borderRadius: "16px",
                padding: "2rem",
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 40px ${ORANGE}10`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    background: `${ORANGE}18`,
                    border: `1px solid ${ORANGE}40`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shield size={18} color={ORANGE} />
                </div>
                <div>
                  <p
                    style={{
                      color: ORANGE,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.1rem",
                    }}
                  >
                    Sovereign
                  </p>
                  <p
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      color: "#fff",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                    }}
                  >
                    Cloud Engine Environments
                  </p>
                </div>
              </div>
              {[
                "Sovereign control over dedicated operational compute",
                "Organization governs access, data residency, and policies",
                "Infrastructure portability — no single-provider dependency",
                "Enterprise governance controls built in from day one",
                "Dedicated compute options with operational isolation",
                "Reduced single-provider risk across operational environments",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.6rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <CheckCircle
                    size={14}
                    color={ORANGE}
                    style={{ marginTop: "4px", flexShrink: 0 }}
                  />
                  <p
                    style={{
                      color: TEXT_SOFT,
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Not anti-cloud */}
          <div
            style={{
              background: "rgba(255,107,43,0.04)",
              border: `1px solid ${ORANGE}22`,
              borderRadius: "16px",
              padding: "2rem 2.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "0.75rem",
                letterSpacing: "-0.01em",
              }}
            >
              Not Anti-Cloud — Operationally Intelligent
            </p>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "0.925rem",
                lineHeight: 1.75,
                maxWidth: "680px",
                margin: "0 auto 1rem",
              }}
            >
              Cloud Engines are not necessarily a replacement for existing cloud
              infrastructure. Organizations can start within existing
              environments — AWS, Google Cloud, Azure — and migrate operational
              workloads into sovereign infrastructure at their own pace, on
              their own terms.
            </p>
            <p
              style={{
                color: ORANGE,
                fontSize: "0.95rem",
                fontWeight: 600,
                fontStyle: "italic",
              }}
            >
              "CHANNELFORGE is built for organizations that want operational
              intelligence without surrendering operational control."
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── SECTION 4: NATIONAL ADOPTION ── */}
      <section
        id="national-adoption"
        style={{ padding: "5rem 1.5rem", background: NAVY }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}18`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Adoption Trends
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
              National & Sovereign Infrastructure Adoption
            </h2>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1rem",
                maxWidth: "680px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              National-scale operational infrastructure initiatives are
              beginning to emerge where countries and large organizations seek
              stronger control over strategic operational systems and AI-ready
              infrastructure.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {/* Switzerland */}
            <div
              style={{
                background: NAVY_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "16px",
                padding: "2rem",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🇨🇭</span>
                <div>
                  <p
                    style={{
                      color: ORANGE,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.2rem",
                    }}
                  >
                    Europe · Sovereign Infrastructure
                  </p>
                  <p
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: 800,
                    }}
                  >
                    Switzerland
                  </p>
                </div>
              </div>
              <p
                style={{
                  color: TEXT_SOFT,
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                }}
              >
                Switzerland has been an early adopter of distributed operational
                infrastructure, hosting subnet nodes that support enterprise
                operational environments with strong data residency and
                governance alignment. Financial services, healthcare, and
                government-adjacent organizations have explored sovereign
                infrastructure to meet strict operational governance
                requirements.
              </p>
            </div>

            {/* Pakistan */}
            <div
              style={{
                background: NAVY_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "16px",
                padding: "2rem",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <span style={{ fontSize: "2rem" }}>🇵🇰</span>
                <div>
                  <p
                    style={{
                      color: ORANGE,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "0.2rem",
                    }}
                  >
                    National Initiative · Strategic Partnership
                  </p>
                  <p
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      color: "#fff",
                      fontSize: "1.2rem",
                      fontWeight: 800,
                    }}
                  >
                    Pakistan
                  </p>
                </div>
              </div>
              <p
                style={{
                  color: TEXT_SOFT,
                  fontSize: "0.9rem",
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}
              >
                The Pakistan Digital Authority and DFINITY Foundation announced
                a landmark partnership to deploy sovereign digital
                infrastructure at national scale. This initiative represents a
                significant adoption milestone for distributed operational
                infrastructure in strategic national environments — with
                implications for enterprise governance, digital sovereignty, and
                AI-ready national infrastructure models globally.
              </p>
              <a
                href="https://internetcomputer.org/news/media-releases/pakistan-digital-authority-dfinity-partnership-announcement/"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="sovereign.national.pakistan_announcement_link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: ORANGE,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  borderBottom: `1px solid ${ORANGE}40`,
                  paddingBottom: "2px",
                }}
              >
                Read the official announcement
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Additional context */}
          <div
            style={{
              background: "rgba(255,107,43,0.04)",
              border: `1px solid ${ORANGE}20`,
              borderRadius: "12px",
              padding: "1.5rem 2rem",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <Globe
              size={20}
              color={ORANGE}
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "0.875rem",
                lineHeight: 1.75,
              }}
            >
              As organizations assess strategic AI infrastructure, the ability
              to operate sovereign computing environments — free from
              single-provider dependency — is becoming a governance and
              operational priority across industries, regions, and national
              infrastructure programmes.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── SECTION 5: GLOBAL INFRASTRUCTURE ── */}
      <section
        id="how-global-infrastructure-works"
        style={{ padding: "5rem 1.5rem", background: "rgba(8,17,32,0.95)" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}18`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Global Infrastructure
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
              How Global Infrastructure Works
            </h2>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1rem",
                maxWidth: "640px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Distributed operational infrastructure enables organizations to
              align compute environments geographically — reducing latency,
              meeting data residency requirements, and distributing operational
              risk.
            </p>
          </div>

          {/* World map concept */}
          <div
            style={{
              background: NAVY_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "20px",
              padding: "2.5rem",
              backdropFilter: "blur(12px)",
              marginBottom: "2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${ORANGE}08, transparent)`,
                pointerEvents: "none",
              }}
            />

            <p
              style={{
                textAlign: "center",
                color: TEXT_MUTED,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              Operational Infrastructure Regions
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.25rem",
                position: "relative",
              }}
            >
              {REGIONS.map(({ name, nodes, desc, flag }) => (
                <div
                  key={name}
                  style={{
                    background: "rgba(255,107,43,0.04)",
                    border: `1px solid ${ORANGE}25`,
                    borderRadius: "12px",
                    padding: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{flag}</span>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                      }}
                    >
                      {name}
                    </span>
                  </div>
                  <p
                    style={{
                      color: ORANGE,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {nodes}
                  </p>
                  <p
                    style={{
                      color: TEXT_MUTED,
                      fontSize: "0.8rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Two-tier explanation */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              {
                icon: Building2,
                title: "Large Enterprise Deployment",
                desc: "Large organizations may operate dedicated infrastructure environments — isolated operational compute aligned geographically, with enterprise governance and AI-optimised workloads running in sovereign environments.",
                highlight: true,
              },
              {
                icon: Server,
                title: "Shared Infrastructure Pools",
                desc: "Smaller organizations and growing businesses may benefit from shared operational infrastructure pools — accessing sovereign compute benefits without the overhead of dedicated environments.",
                highlight: false,
              },
            ].map(({ icon: Icon, title, desc, highlight }) => (
              <div
                key={title}
                style={{
                  background: highlight ? NAVY_CARD : "rgba(13,26,46,0.4)",
                  border: `1px solid ${highlight ? BORDER : BORDER_SUBTLE}`,
                  borderRadius: "14px",
                  padding: "1.75rem",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: `${ORANGE}18`,
                    border: `1px solid ${ORANGE}30`,
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Icon size={18} color={ORANGE} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: TEXT_MUTED,
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── SECTION 6: SETUP PROCESS ── */}
      <section
        id="cloud-engine-setup"
        style={{ padding: "5rem 1.5rem", background: NAVY }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}18`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Setup Guide
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
              How Enterprise Cloud Engine Setup Works
            </h2>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1rem",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              A structured operational process designed for enterprise-scale
              deployment and governance.
            </p>
          </div>

          {/* Stepper */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {SETUP_STEPS.map(({ step, title, desc }, i) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                  position: "relative",
                  paddingBottom: i < SETUP_STEPS.length - 1 ? "0" : "0",
                }}
              >
                {/* Connector line */}
                {i < SETUP_STEPS.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "24px",
                      top: "52px",
                      width: "2px",
                      height: "calc(100% - 4px)",
                      background: `linear-gradient(to bottom, ${ORANGE}60, ${ORANGE}20)`,
                    }}
                  />
                )}

                {/* Step badge */}
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: `linear-gradient(135deg, ${ORANGE}, #e05a1f)`,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    color: "#fff",
                    boxShadow: `0 4px 16px ${ORANGE}40`,
                    zIndex: 1,
                    position: "relative",
                  }}
                >
                  {step}
                </div>

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    background: NAVY_CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "14px",
                    padding: "1.5rem",
                    backdropFilter: "blur(8px)",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      color: TEXT_MUTED,
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── SECTION 7: FOUNDER ── */}
      <section
        id="founder-vision"
        style={{ padding: "5rem 1.5rem", background: "rgba(8,17,32,0.95)" }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}18`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Founder Vision
            </span>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.03em",
              }}
            >
              Built for the Channel
            </h2>
          </div>

          <div
            style={{
              background: NAVY_CARD,
              border: `1px solid ${BORDER}`,
              borderLeft: `4px solid ${ORANGE}`,
              borderRadius: "20px",
              padding: "2.5rem",
              backdropFilter: "blur(16px)",
              boxShadow: `0 0 60px ${ORANGE}10`,
              display: "flex",
              gap: "2rem",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <img
                src="/assets/founder-photo.jpg"
                alt="Mykie Hall, Founder of CHANNELFORGE"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  border: `2px solid ${ORANGE}50`,
                  boxShadow: `0 8px 32px ${ORANGE}30`,
                  display: "block",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <p
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 900,
                  color: "#fff",
                  marginBottom: "0.25rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Mykie Hall
              </p>
              <p
                style={{
                  color: ORANGE,
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                }}
              >
                Founder, CHANNELFORGE
              </p>
              <p
                style={{
                  color: TEXT_SOFT,
                  fontSize: "0.95rem",
                  lineHeight: 1.8,
                  marginBottom: "1.25rem",
                }}
              >
                Built by a channel professional with over 25 years of enterprise
                sales and operational ecosystem experience, CHANNELFORGE was
                created to solve the operational fragmentation, visibility,
                governance, and infrastructure dependency challenges faced by
                Vendors, Distributors, and Resellers globally.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {[
                  "Built for the Channel",
                  "25+ Years Ecosystem Experience",
                  "Governance-First Design",
                  "Operational Intelligence",
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      background: `${ORANGE}14`,
                      color: TEXT_SOFT,
                      border: `1px solid ${ORANGE}28`,
                      borderRadius: "9999px",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    <Tag size={10} color={ORANGE} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── SECTION 8: OFFICIAL RESOURCES ── */}
      <section
        id="official-resources"
        style={{ padding: "5rem 1.5rem", background: NAVY }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span
              style={{
                display: "inline-block",
                background: `${ORANGE}18`,
                color: ORANGE,
                border: `1px solid ${ORANGE}40`,
                borderRadius: "9999px",
                padding: "0.25rem 1rem",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Official Resources
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
              Enterprise Infrastructure Learning Hub
            </h2>
            <p
              style={{
                color: TEXT_SOFT,
                fontSize: "1rem",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Authoritative resources from DFINITY and official Internet
              Computer channels for enterprise, technical, and operational
              audiences.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {RESOURCES.map((resource) => {
              const catColor = CATEGORY_COLORS[resource.category] ?? ORANGE;
              return (
                <div
                  key={resource.id}
                  data-ocid={`sovereign.resource.${resource.id}.card`}
                  style={{
                    background: NAVY_CARD,
                    border: `1px solid ${BORDER}`,
                    borderTop: `3px solid ${catColor}`,
                    borderRadius: "16px",
                    padding: "1.75rem",
                    backdropFilter: "blur(12px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                >
                  {/* Category & type */}
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        background: `${catColor}22`,
                        color: catColor,
                        border: `1px solid ${catColor}44`,
                        borderRadius: "9999px",
                        padding: "0.15rem 0.65rem",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {resource.category}
                    </span>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: TEXT_MUTED,
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "9999px",
                        padding: "0.15rem 0.65rem",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {resource.contentType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "#fff",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      color: TEXT_MUTED,
                      fontSize: "0.82rem",
                      lineHeight: 1.65,
                      flex: 1,
                    }}
                  >
                    {resource.description}
                  </p>

                  {/* Meta */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      paddingTop: "0.75rem",
                      borderTop: `1px solid ${BORDER}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Clock size={11} color={TEXT_MUTED} />
                      <span
                        style={{
                          color: TEXT_MUTED,
                          fontSize: "0.72rem",
                          fontWeight: 500,
                        }}
                      >
                        {resource.readTime}
                      </span>
                    </div>
                    <span style={{ color: TEXT_MUTED, fontSize: "0.72rem" }}>
                      {resource.source}
                    </span>
                  </div>

                  {/* Preview button */}
                  <button
                    type="button"
                    data-ocid={`sovereign.resource.${resource.id}.preview_button`}
                    onClick={() => setPreviewResource(resource)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      background: `${catColor}18`,
                      color: catColor,
                      border: `1px solid ${catColor}40`,
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                      letterSpacing: "0.02em",
                      transition: "background 0.15s",
                    }}
                  >
                    Preview Resource
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── BOTTOM CTA ── */}
      <section
        id="deploy-cta"
        style={{
          padding: "6rem 1.5rem",
          background: `radial-gradient(ellipse 80% 70% at 50% 100%, rgba(255,107,43,0.12) 0%, transparent 60%), ${NAVY}`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: `radial-gradient(ellipse, ${ORANGE}20, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{ maxWidth: "760px", margin: "0 auto", position: "relative" }}
        >
          <span
            style={{
              display: "inline-block",
              background: `${ORANGE}18`,
              color: ORANGE,
              border: `1px solid ${ORANGE}40`,
              borderRadius: "9999px",
              padding: "0.3rem 1.1rem",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1.75rem",
            }}
          >
            Ready to Deploy?
          </span>

          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              lineHeight: 1.15,
            }}
          >
            Build operational infrastructure around your organization — not
            around someone else's cloud.
          </h2>

          <p
            style={{
              color: TEXT_SOFT,
              fontSize: "1rem",
              lineHeight: 1.75,
              maxWidth: "560px",
              margin: "0 auto 0.75rem",
            }}
          >
            Deploy sovereign operational environments designed for Vendors,
            Distributors, and Resellers.
          </p>
          <p
            style={{
              color: TEXT_MUTED,
              fontSize: "0.9rem",
              lineHeight: 1.75,
              maxWidth: "540px",
              margin: "0 auto 3rem",
            }}
          >
            Explore operational infrastructure built for the AI era.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              data-ocid="sovereign.cta.calculator_button"
              onClick={() => navigate({ to: "/enterprise-calculator" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: `linear-gradient(135deg, ${ORANGE}, #e05a1f)`,
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "1rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 4px 32px ${ORANGE}50`,
                letterSpacing: "0.01em",
              }}
            >
              Calculate Enterprise Environment
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              data-ocid="sovereign.cta.pricing_button"
              onClick={() => navigate({ to: "/pricing" })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: NAVY_CARD,
                color: "#fff",
                border: `1px solid ${BORDER}`,
                borderRadius: "10px",
                padding: "1rem 2rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                backdropFilter: "blur(12px)",
              }}
            >
              Explore Compute & Infrastructure Pricing
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              data-ocid="sovereign.cta.speak_enterprise_button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "transparent",
                color: TEXT_MUTED,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "1rem 2rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "not-allowed",
                opacity: 0.6,
              }}
            >
              Speak With Enterprise Solutions
              <span
                style={{
                  background: `${ORANGE}30`,
                  color: ORANGE,
                  borderRadius: "9999px",
                  padding: "0.1rem 0.5rem",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Coming Soon
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "rgba(6,13,24,0.98)",
          borderTop: `1px solid ${BORDER}`,
          padding: "1.75rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p style={{ color: TEXT_MUTED, fontSize: "0.8rem" }}>
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ORANGE, textDecoration: "none" }}
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </footer>

      {/* ── RESOURCE PREVIEW MODAL ── */}
      {previewResource && (
        <ResourcePreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}
    </div>
  );
}
