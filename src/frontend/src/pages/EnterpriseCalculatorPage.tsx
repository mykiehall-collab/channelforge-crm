import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Cpu,
  Database,
  Globe,
  Info,
  Lock,
  Server,
  Shield,
  Sparkles,
  TrendingUp,
  X,
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

const CLOUD_ENGINE_BENEFITS = [
  {
    icon: Shield,
    label: "Isolated Operational Environment",
    desc: "Dedicated infrastructure isolated from shared workloads.",
  },
  {
    icon: TrendingUp,
    label: "Scalable Enterprise Compute",
    desc: "Operational compute scales dynamically with your ecosystem.",
  },
  {
    icon: Lock,
    label: "Sovereign Operational Architecture",
    desc: "Your data remains under your organisational control.",
  },
  {
    icon: Sparkles,
    label: "Enterprise AI Readiness",
    desc: "AI-optimised compute for high-demand ForgeAI workloads.",
  },
  {
    icon: Building2,
    label: "Advanced Operational Governance",
    desc: "Enhanced controls across your Vendor/Distributor/Reseller hierarchy.",
  },
  {
    icon: Server,
    label: "Dedicated Infrastructure Scaling",
    desc: "Elastic resource allocation for peak operational demands.",
  },
  {
    icon: Database,
    label: "Enhanced Operational Visibility",
    desc: "Granular infrastructure usage analytics and health monitoring.",
  },
  {
    icon: Globe,
    label: "Future AI Node Readiness",
    desc: "Architecture designed for next-generation AI operational nodes.",
  },
];

type AiUsage = "Low" | "Moderate" | "High" | "Enterprise AI Intensive";
type WorkloadProfile =
  | "Standard"
  | "Reporting-Heavy"
  | "AI-Heavy"
  | "Governance-Heavy"
  | "Multi-Region Operations";
type InfrastructureChoice =
  | "Shared Infrastructure"
  | "Dedicated Cloud Engine Environment";

function calcEstimate(params: {
  users: number;
  admins: number;
  vendors: number;
  distributors: number;
  resellers: number;
  customerAccounts: number;
  aiUsage: AiUsage;
  docStorage: number;
  opStorage: number;
  reportStorage: number;
  mktStorage: number;
  workload: WorkloadProfile;
  infrastructure: InfrastructureChoice;
}) {
  const base =
    params.users * 50 +
    params.admins * 200 +
    (params.vendors + params.distributors + params.resellers) * 100 +
    params.customerAccounts * 0.5;

  const aiMultiplier: Record<AiUsage, number> = {
    Low: 1.0,
    Moderate: 1.5,
    High: 2.0,
    "Enterprise AI Intensive": 3.0,
  };

  const storageTotal =
    params.docStorage +
    params.opStorage +
    params.reportStorage +
    params.mktStorage;
  const storageCost = storageTotal * 10;

  const workloadMultiplier: Record<WorkloadProfile, number> = {
    Standard: 1.0,
    "Reporting-Heavy": 1.3,
    "AI-Heavy": 1.8,
    "Governance-Heavy": 2.0,
    "Multi-Region Operations": 2.5,
  };

  const cloudEngineMultiplier =
    params.infrastructure === "Dedicated Cloud Engine Environment" ? 1.4 : 1.0;

  const annualEstimate =
    (base * aiMultiplier[params.aiUsage] + storageCost) *
    workloadMultiplier[params.workload] *
    cloudEngineMultiplier;

  const low = Math.round((annualEstimate * 0.85) / 1000) * 1000;
  const high = Math.round((annualEstimate * 1.15) / 1000) * 1000;

  let tier = "Enterprise Cloud Engine";
  if (low < 5000) tier = "Small";
  else if (low < 20000) tier = "Medium";
  else if (low < 50000) tier = "Large";

  let cloudEngineSuitability = "Not Required";
  if (
    params.users > 150 ||
    params.aiUsage === "Enterprise AI Intensive" ||
    params.infrastructure === "Dedicated Cloud Engine Environment"
  ) {
    cloudEngineSuitability = "Highly Recommended";
  } else if (params.users > 75 || params.aiUsage === "High") {
    cloudEngineSuitability = "Recommended";
  }

  return { low, high, tier, cloudEngineSuitability, storageTotal };
}

function formatGBP(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

function SectionPanel({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{ background: BG_MID, border: `1px solid ${BORDER}` }}
    >
      <p
        className="text-[13px] font-bold uppercase tracking-[0.14em] mb-5"
        style={{ color: ORANGE }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 99999,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={`ni-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-[12px] font-medium"
        style={{ color: TEXT_SOFT }}
      >
        {label}
      </label>
      <input
        type="number"
        id={`ni-${label.replace(/\s+/g, "-").toLowerCase()}`}
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))
        }
        className="rounded-lg px-3 py-2 text-[13px] text-white outline-none w-full"
        style={
          {
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${BORDER}`,
            "--tw-ring-color": ORANGE,
          } as React.CSSProperties
        }
        onFocus={(e) => {
          e.target.style.borderColor = ORANGE;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = BORDER;
        }}
      />
    </div>
  );
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          htmlFor={`rg-${opt}`}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onChange(opt)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onChange(opt);
            }
          }}
        >
          <input
            type="radio"
            id={`rg-${opt}`}
            name={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="sr-only"
          />
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              border: `2px solid ${value === opt ? ORANGE : BORDER}`,
              background: value === opt ? ORANGE : "transparent",
            }}
          >
            {value === opt && (
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </div>
          <span
            className="text-[13px] group-hover:text-white transition-colors"
            style={{ color: value === opt ? "white" : TEXT_SOFT }}
          >
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

export function EnterpriseCalculatorPage() {
  const [users, setUsers] = useState(50);
  const [admins, setAdmins] = useState(5);
  const [vendors, setVendors] = useState(2);
  const [distributors, setDistributors] = useState(5);
  const [resellers, setResellers] = useState(20);
  const [customerAccounts, setCustomerAccounts] = useState(500);
  const [aiUsage, setAiUsage] = useState<AiUsage>("Moderate");
  const [docStorage, setDocStorage] = useState(50);
  const [opStorage, setOpStorage] = useState(100);
  const [reportStorage, setReportStorage] = useState(30);
  const [mktStorage, setMktStorage] = useState(20);
  const [workload, setWorkload] = useState<WorkloadProfile>("Standard");
  const [infrastructure, setInfrastructure] = useState<InfrastructureChoice>(
    "Shared Infrastructure",
  );
  const [showAssessmentPrompt, setShowAssessmentPrompt] = useState(false);

  const result = calcEstimate({
    users,
    admins,
    vendors,
    distributors,
    resellers,
    customerAccounts,
    aiUsage,
    docStorage,
    opStorage,
    reportStorage,
    mktStorage,
    workload,
    infrastructure,
  });

  const showEnterpriseBtn =
    users > 100 || aiUsage === "High" || aiUsage === "Enterprise AI Intensive";

  return (
    <div
      className="min-h-screen"
      style={{
        background: BG_DEEP,
        fontFamily: "'Bricolage Grotesque', Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50 flex items-center gap-4 px-6 py-4"
        style={{
          background: "rgba(6,13,24,0.95)",
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: "blur(12px)",
        }}
      >
        <a
          href="/"
          data-ocid="calc.back.button"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all duration-200"
          style={{
            color: TEXT_MUTED,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${BORDER}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = ORANGE;
            e.currentTarget.style.borderColor = ORANGE;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = TEXT_MUTED;
            e.currentTarget.style.borderColor = BORDER;
          }}
        >
          <ArrowLeft size={15} />
          <span className="text-[13px] font-medium">Back</span>
        </a>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1"
            style={{
              background: "rgba(255,107,43,0.12)",
              border: "1px solid rgba(255,107,43,0.25)",
            }}
          >
            <Cpu size={12} color={ORANGE} />
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: ORANGE }}
            >
              Enterprise Calculator
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-12">
        {/* Page heading */}
        <div className="mb-10">
          <h1
            className="font-black text-white leading-tight tracking-[-0.03em] mb-3"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            }}
          >
            Enterprise Operational Pricing Calculator
          </h1>
          <p
            className="text-[15px] max-w-[600px]"
            style={{ color: TEXT_MUTED }}
          >
            Get an indicative annual estimate for your operational
            infrastructure needs. Adjust the parameters below to reflect your
            organisation's scale.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* ── INPUTS ── */}
          <div>
            {/* Section 1: Organisation Scale */}
            <SectionPanel title="Organisation Scale">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <NumberInput
                  label="Users"
                  value={users}
                  onChange={setUsers}
                  min={1}
                  max={500}
                />
                <NumberInput
                  label="Admins"
                  value={admins}
                  onChange={setAdmins}
                  min={1}
                  max={50}
                />
                <NumberInput
                  label="Vendors"
                  value={vendors}
                  onChange={setVendors}
                  min={1}
                  max={20}
                />
                <NumberInput
                  label="Distributors"
                  value={distributors}
                  onChange={setDistributors}
                  min={1}
                  max={50}
                />
                <NumberInput
                  label="Resellers"
                  value={resellers}
                  onChange={setResellers}
                  min={1}
                  max={200}
                />
                <NumberInput
                  label="Customer Accounts"
                  value={customerAccounts}
                  onChange={setCustomerAccounts}
                  min={1}
                  max={10000}
                />
              </div>
            </SectionPanel>

            {/* Section 2: AI Usage */}
            <SectionPanel title="AI Usage">
              <RadioGroup<AiUsage>
                options={["Low", "Moderate", "High", "Enterprise AI Intensive"]}
                value={aiUsage}
                onChange={setAiUsage}
              />
            </SectionPanel>

            {/* Section 3: Storage Requirements */}
            <SectionPanel title="Storage Requirements (GB)">
              <div className="grid grid-cols-2 gap-4">
                <NumberInput
                  label="Document Storage (GB)"
                  value={docStorage}
                  onChange={setDocStorage}
                  min={0}
                  max={10000}
                />
                <NumberInput
                  label="Operational Storage (GB)"
                  value={opStorage}
                  onChange={setOpStorage}
                  min={0}
                  max={10000}
                />
                <NumberInput
                  label="Reporting Storage (GB)"
                  value={reportStorage}
                  onChange={setReportStorage}
                  min={0}
                  max={10000}
                />
                <NumberInput
                  label="Marketing Assets (GB)"
                  value={mktStorage}
                  onChange={setMktStorage}
                  min={0}
                  max={10000}
                />
              </div>
            </SectionPanel>

            {/* Section 4: Workload Profile */}
            <SectionPanel title="Workload Profile">
              <RadioGroup<WorkloadProfile>
                options={[
                  "Standard",
                  "Reporting-Heavy",
                  "AI-Heavy",
                  "Governance-Heavy",
                  "Multi-Region Operations",
                ]}
                value={workload}
                onChange={setWorkload}
              />
            </SectionPanel>

            {/* Infrastructure choice */}
            <SectionPanel title="Sovereign Infrastructure">
              <RadioGroup<InfrastructureChoice>
                options={[
                  "Shared Infrastructure",
                  "Dedicated Cloud Engine Environment",
                ]}
                value={infrastructure}
                onChange={setInfrastructure}
              />
              <p
                className="mt-4 text-[12px] leading-[1.6]"
                style={{ color: TEXT_MUTED }}
              >
                Dedicated Cloud Engine Environments provide isolated operational
                infrastructure for large-scale deployments.
              </p>
            </SectionPanel>
          </div>

          {/* ── LIVE OUTPUT ── */}
          <div className="lg:sticky lg:top-[72px]">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: BG_MID,
                border: "1.5px solid rgba(255,107,43,0.3)",
                boxShadow: "0 8px 40px rgba(255,107,43,0.1)",
              }}
            >
              <div
                className="h-[3px]"
                style={{
                  background: `linear-gradient(90deg, ${ORANGE}, #e55a1f)`,
                }}
              />
              <div className="p-6">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4"
                  style={{ color: ORANGE }}
                >
                  Indicative Annual Estimate
                </p>
                <p
                  className="font-black text-white leading-none tracking-[-0.03em] mb-1"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  }}
                >
                  {formatGBP(result.low)}
                  <span
                    className="text-[1.2rem] font-semibold mx-2"
                    style={{ color: TEXT_MUTED }}
                  >
                    –
                  </span>
                  {formatGBP(result.high)}
                </p>
                <p className="text-[12px] mb-6" style={{ color: TEXT_MUTED }}>
                  estimated per year
                </p>

                <div className="flex flex-col gap-3 mb-6">
                  {[
                    {
                      label: "Recommended Infrastructure Tier",
                      value: result.tier,
                    },
                    {
                      label: "Estimated Storage Allocation",
                      value: `${result.storageTotal.toLocaleString()} GB`,
                    },
                    { label: "AI Operational Capacity", value: aiUsage },
                    {
                      label: "Cloud Engine Suitability",
                      value: result.cloudEngineSuitability,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-3 py-3"
                      style={{ borderBottom: `1px solid ${BORDER}` }}
                    >
                      <span
                        className="text-[12px]"
                        style={{ color: TEXT_MUTED }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-[12px] font-semibold text-right"
                        style={{
                          color:
                            value === "Highly Recommended"
                              ? ORANGE
                              : value === "Recommended"
                                ? "#fbbf24"
                                : "white",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {showEnterpriseBtn && (
                  <button
                    type="button"
                    data-ocid="calc.request_assessment.button"
                    onClick={() => setShowAssessmentPrompt(true)}
                    className="w-full py-3 rounded-xl font-bold text-[14px] text-white mb-3 transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                      boxShadow: "0 4px 20px rgba(255,107,43,0.35)",
                    }}
                  >
                    Request Enterprise Assessment
                  </button>
                )}

                <div
                  className="rounded-xl p-4 flex gap-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <Info
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    color={TEXT_MUTED}
                  />
                  <p
                    className="text-[11px] leading-[1.65]"
                    style={{ color: TEXT_MUTED }}
                  >
                    Indicative enterprise operational estimate only. Final
                    pricing determined during CHANNELFORGE enterprise solution
                    assessment.
                  </p>
                </div>
              </div>
            </div>

            {/* Cloud Engine benefits */}
            <div className="mt-6">
              <p
                className="text-[12px] font-bold uppercase tracking-[0.14em] mb-4"
                style={{ color: TEXT_MUTED }}
              >
                Cloud Engine Benefits
              </p>
              <div className="grid grid-cols-2 gap-3">
                {CLOUD_ENGINE_BENEFITS.slice(0, 4).map(
                  ({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3 flex items-start gap-2"
                      style={{
                        background: BG_BASE,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <Icon
                        size={13}
                        color={ORANGE}
                        className="flex-shrink-0 mt-0.5"
                      />
                      <p
                        className="text-[11px] leading-[1.5]"
                        style={{ color: TEXT_SOFT }}
                      >
                        {label}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment prompt modal */}
      {showAssessmentPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="relative rounded-2xl p-8 w-full max-w-[500px]"
            style={{
              background: BG_MID,
              border: "1.5px solid rgba(255,107,43,0.35)",
            }}
            data-ocid="calc.assessment_modal.dialog"
          >
            <button
              type="button"
              data-ocid="calc.assessment_modal.close_button"
              className="absolute top-4 right-4 rounded-lg p-2 transition-all"
              style={{
                color: TEXT_MUTED,
                background: "rgba(255,255,255,0.04)",
              }}
              onClick={() => setShowAssessmentPrompt(false)}
            >
              <X size={16} />
            </button>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{
                background: "rgba(255,107,43,0.12)",
                border: "1px solid rgba(255,107,43,0.25)",
              }}
            >
              <Zap size={22} color={ORANGE} />
            </div>
            <h3
              className="font-black text-white text-[1.3rem] leading-tight tracking-[-0.02em] mb-3"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Speak with CHANNELFORGE Enterprise Solutions
            </h3>
            <p
              className="text-[14px] leading-[1.7] mb-6"
              style={{ color: TEXT_MUTED }}
            >
              Our enterprise solutions team can provide a detailed
              infrastructure assessment, tailored pricing, and deployment
              planning for your operational environment.
            </p>
            <a
              href="mailto:enterprise@channelforge.net"
              data-ocid="calc.assessment_modal.contact_button"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[14px] text-white transition-all duration-200 mb-3"
              style={{
                background: `linear-gradient(135deg, ${ORANGE} 0%, #e55a1f 100%)`,
                boxShadow: "0 4px 20px rgba(255,107,43,0.3)",
              }}
            >
              Contact Enterprise Solutions
              <ChevronRight size={15} />
            </a>
            <p
              className="text-center text-[11px]"
              style={{ color: TEXT_MUTED }}
            >
              enterprise@channelforge.net
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
