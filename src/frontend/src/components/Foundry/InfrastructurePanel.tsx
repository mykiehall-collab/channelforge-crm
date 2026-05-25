import {
  AlertTriangle,
  Brain,
  Building2,
  CheckCircle2,
  Cpu,
  CreditCard,
  Database,
  Globe,
  Lock,
  Minus,
  Server,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../AppContext";
import { OPERATIONAL_REGIONS } from "../../data/operationalRegions";
import { CreditVisibilityManagement } from "./CreditVisibilityManagement";
import RegionChangeRequestModal from "./RegionChangeRequestModal";
import { SharedBillingSection } from "./SharedBillingSection";
import { SovereignInfraBanner } from "./SovereignInfraBanner";

// ─── Types ─────────────────────────────────────────────────────────────────────

type CreditPackage = {
  id: string;
  name: string;
  compute: number;
  storage: number;
  ai: number;
  price: number;
  popular?: boolean;
};

// ─── Demo data ─────────────────────────────────────────────────────────────────

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "small",
    name: "Small",
    compute: 2500,
    storage: 100,
    ai: 500,
    price: 49,
  },
  {
    id: "medium",
    name: "Medium",
    compute: 7500,
    storage: 300,
    ai: 1500,
    price: 149,
    popular: true,
  },
  {
    id: "large",
    name: "Large",
    compute: 25000,
    storage: 1000,
    ai: 5000,
    price: 449,
  },
];

const CANISTER_DATA = [
  {
    name: "Primary Operations Unit",
    label: "Operational Unit",
    status: "active",
    storage: "2.4 GB",
    health: "Healthy",
  },
  {
    name: "Reporting Unit",
    label: "Operational Unit",
    status: "active",
    storage: "1.1 GB",
    health: "Healthy",
  },
  {
    name: "Messaging Unit",
    label: "Operational Unit",
    status: "active",
    storage: "0.8 GB",
    health: "Healthy",
  },
];

// 30-day compute usage dummy data (slight upward trend)
const USAGE_DATA = [
  620, 645, 630, 670, 690, 710, 705, 730, 750, 740, 760, 780, 775, 800, 820,
  810, 835, 850, 845, 870, 890, 885, 910, 930, 920, 940, 955, 950, 970, 985,
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  glow = false,
  "data-ocid": dataOcid,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  "data-ocid"?: string;
}) {
  return (
    <div
      data-ocid={dataOcid}
      className={`rounded-xl border backdrop-blur-sm transition-all ${
        glow
          ? "border-orange-500/30 shadow-[0_0_24px_rgba(249,115,22,0.08),inset_0_1px_0_rgba(255,255,255,0.05)]"
          : "border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      } bg-white/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

function CreditMetricCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent?: boolean;
}) {
  return (
    <GlassCard
      className="p-5"
      glow={accent}
      data-ocid={`infrastructure.credit_card.${label.toLowerCase().replace(/\s+/g, "_")}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`p-1.5 rounded-lg ${accent ? "bg-orange-500/15" : "bg-white/[0.06]"}`}
        >
          <Icon
            size={14}
            className={accent ? "text-orange-400" : "text-muted-foreground"}
          />
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div
        className={`text-3xl font-black tracking-tight ${accent ? "text-orange-400" : "text-foreground"}`}
      >
        {value.toLocaleString()}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1">
        credits remaining
      </div>
    </GlassCard>
  );
}

function TrendIndicator({
  trend,
}: {
  trend: "increasing" | "stable" | "decreasing";
}) {
  if (trend === "increasing")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-orange-400">
        <TrendingUp size={11} />
        Increasing
      </span>
    );
  if (trend === "decreasing")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
        <TrendingDown size={11} />
        Decreasing
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <Minus size={11} />
      Stable
    </span>
  );
}

function UsageChart() {
  const width = 600;
  const height = 160;
  const padding = { top: 10, right: 10, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...USAGE_DATA);
  const minVal = Math.min(...USAGE_DATA);
  const range = maxVal - minVal || 1;

  const points = USAGE_DATA.map((v, i) => {
    const x = padding.left + (i / (USAGE_DATA.length - 1)) * chartW;
    const y = padding.top + chartH - ((v - minVal) / range) * chartH;
    return `${x},${y}`;
  });

  const areaPath = `${padding.left},${padding.top + chartH} ${points.join(" ")} ${padding.left + chartW},${padding.top + chartH}`;

  // Y-axis labels
  const yLabels = [minVal, (minVal + maxVal) / 2, maxVal];

  return (
    <svg
      role="img"
      aria-label="Compute usage trend chart"
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      preserveAspectRatio="none"
      style={{ minHeight: 160 }}
    >
      {/* Grid lines */}
      {[0, 1, 2].map((i) => {
        const y = padding.top + (i / 2) * chartH;
        return (
          <line
            key={i}
            x1={padding.left}
            y1={y}
            x2={padding.left + chartW}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        );
      })}

      {/* Area fill */}
      <polygon points={areaPath} fill="rgba(249,115,22,0.08)" />

      {/* Line */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#f97316"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {USAGE_DATA.map((v, i) => {
        const x = padding.left + (i / (USAGE_DATA.length - 1)) * chartW;
        const y = padding.top + chartH - ((v - minVal) / range) * chartH;
        const isLast = i === USAGE_DATA.length - 1;
        return (
          <circle
            key={`point-${x}-${y}`}
            cx={x}
            cy={y}
            r={isLast ? 4 : 2}
            fill={isLast ? "#f97316" : "rgba(249,115,22,0.5)"}
            stroke={isLast ? "#fff" : "none"}
            strokeWidth={isLast ? 2 : 0}
          />
        );
      })}

      {/* Y-axis labels */}
      {yLabels.map((val, _i) => {
        const y = padding.top + chartH - ((val - minVal) / range) * chartH;
        return (
          <text
            key={`ylabel-${val}-${y}`}
            x={padding.left - 8}
            y={y + 4}
            textAnchor="end"
            fill="rgba(255,255,255,0.35)"
            fontSize={10}
          >
            {Math.round(val)}
          </text>
        );
      })}

      {/* X-axis labels */}
      <text
        x={padding.left}
        y={height - 8}
        fill="rgba(255,255,255,0.35)"
        fontSize={10}
      >
        30 days ago
      </text>
      <text
        x={padding.left + chartW}
        y={height - 8}
        textAnchor="end"
        fill="rgba(255,255,255,0.35)"
        fontSize={10}
      >
        Today
      </text>
    </svg>
  );
}

function BuyCreditsModal({
  open,
  onClose,
  onPurchase,
}: {
  open: boolean;
  onClose: () => void;
  onPurchase: (pkg: CreditPackage) => void;
}) {
  const [selected, setSelected] = useState<string>("medium");
  const [billingEmail, setBillingEmail] = useState("");
  const [orgName, setOrgName] = useState("Acme Corp");

  if (!open) return null;

  const selectedPkg = CREDIT_PACKAGES.find((p) => p.id === selected)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#0d1a2e] shadow-2xl"
        data-ocid="infrastructure.buy_credits.dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div>
            <h2 className="text-lg font-bold text-foreground">Buy Credits</h2>
            <p className="text-xs text-muted-foreground">
              Purchase operational compute, storage, and AI credits for your
              workspace
            </p>
          </div>
          <button
            type="button"
            data-ocid="infrastructure.buy_credits.close_button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Package selector */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Select Credit Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CREDIT_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  data-ocid={`infrastructure.buy_credits.package.${pkg.id}`}
                  onClick={() => setSelected(pkg.id)}
                  className={`relative text-left p-4 rounded-xl border transition-all ${
                    selected === pkg.id
                      ? "border-orange-500/50 bg-orange-500/[0.08]"
                      : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 left-4 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-500 text-white">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">
                      {pkg.name}
                    </span>
                    <span className="text-lg font-black text-orange-400">
                      £{pkg.price}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] text-muted-foreground">
                      <span className="text-foreground font-medium">
                        {pkg.compute.toLocaleString()}
                      </span>{" "}
                      Compute Credits
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      <span className="text-foreground font-medium">
                        {pkg.storage.toLocaleString()}
                      </span>{" "}
                      Storage Credits
                    </div>
                    {pkg.ai > 0 && (
                      <div className="text-[11px] text-muted-foreground">
                        <span className="text-foreground font-medium">
                          {pkg.ai.toLocaleString()}
                        </span>{" "}
                        AI Credits
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected preview */}
          <GlassCard className="p-4" glow>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Selected Package: {selectedPkg.name}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">
                  +{selectedPkg.compute.toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground">Compute</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">
                  +{selectedPkg.storage.toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground">Storage</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">
                  +{selectedPkg.ai.toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground">AI</div>
              </div>
            </div>
          </GlassCard>

          {/* Payment form */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Billing Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="org-name"
                  className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5"
                >
                  Organisation
                </label>
                <input
                  id="org-name"
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-foreground text-sm focus:outline-none focus:border-orange-500/50"
                  data-ocid="infrastructure.buy_credits.org_input"
                />
              </div>
              <div>
                <label
                  htmlFor="billing-email"
                  className="block text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5"
                >
                  Billing Email
                </label>
                <input
                  id="billing-email"
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="billing@company.com"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-500/50"
                  data-ocid="infrastructure.buy_credits.email_input"
                />
              </div>
            </div>

            {/* Simulated payment */}
            <div className="p-4 rounded-xl bg-yellow-500/[0.06] border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={14} className="text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-300">
                  Simulated Payment — Test Mode
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {/* TODO-SECURITY: Replace with live Stripe integration before go-live */}
                No real payment will be processed. This is a simulated checkout
                for testing purposes only.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              data-ocid="infrastructure.buy_credits.cancel_button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="infrastructure.buy_credits.confirm_button"
              onClick={() => onPurchase(selectedPkg)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-br from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
            >
              <Zap size={14} />
              Complete Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main panel component ────────────────────────────────────────────────────

export function InfrastructurePanel({
  isAdmin,
  workspaceType = "vendor",
  section,
}: {
  isAdmin: boolean;
  workspaceType?: "vendor" | "distributor" | "reseller";
  section?: string;
}) {
  const creditVisibilityRef = useRef<HTMLDivElement>(null);
  const [credits, setCredits] = useState({
    compute: 10000,
    storage: 500,
    ai: 2000,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const { operationalRegionPrefs } = useApp();
  const [showRegionModal, setShowRegionModal] = useState(false);
  const currentRegion = OPERATIONAL_REGIONS.find(
    (r) => r.id === operationalRegionPrefs?.selectedRegionId,
  );

  useEffect(() => {
    if (!section) return;
    if (section === "top-up") {
      setModalOpen(true);
    } else if (section === "credit-visibility" || section === "alerts") {
      creditVisibilityRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [section]);

  const computeLow = credits.compute < 1000;

  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + 18);
  const projectedDateStr = projectedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function handlePurchase(pkg: CreditPackage) {
    setCredits((prev) => ({
      compute: prev.compute + pkg.compute,
      storage: prev.storage + pkg.storage,
      ai: prev.ai + pkg.ai,
    }));
    setModalOpen(false);
    toast.success(
      `Credits added to your workspace. You now have ${(credits.compute + pkg.compute).toLocaleString()} Compute Credits.`,
    );
  }

  // Non-admin read-only view
  if (!isAdmin) {
    return (
      <div className="space-y-6" data-ocid="infrastructure.panel.readonly">
        <SectionHeader
          title="Infrastructure & Compute"
          subtitle="Operational compute, storage, and AI credit management"
        />

        <GlassCard className="p-6 text-center">
          <div className="p-3 rounded-full bg-orange-500/10 w-fit mx-auto mb-3">
            <Lock size={20} className="text-orange-400" />
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-1">
            Read-Only View
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Credit management is restricted to Primary and Secondary Admins.
            Contact your admin to purchase additional credits.
          </p>
        </GlassCard>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CreditMetricCard
            label="Compute Credits"
            value={credits.compute}
            icon={Cpu}
            accent
          />
          <CreditMetricCard
            label="Storage Credits"
            value={credits.storage}
            icon={Database}
          />
          <CreditMetricCard
            label="AI Credits"
            value={credits.ai}
            icon={Brain}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="infrastructure.panel">
      <SectionHeader
        title="Infrastructure & Compute"
        subtitle="Operational compute, storage, and AI credit management"
      />

      {/* Operational Region Preferences */}
      <div className="rounded-xl border border-white/10 bg-[#0a1628] p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📍</span>
          <h3 className="text-white font-semibold text-sm">
            Operational Region Preferences
          </h3>
        </div>
        {!operationalRegionPrefs?.isConfigured ? (
          <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            <span>⚙️</span>
            <span>Operational region preferences are not yet configured.</span>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-medium text-sm">
                  {currentRegion?.name ??
                    operationalRegionPrefs.selectedRegionId}
                </span>
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-full px-2 py-0.5 text-xs flex items-center gap-1">
                  🔒 Region Locked
                </span>
              </div>
              <p className="text-white/50 text-xs">
                {currentRegion?.environmentLabel ??
                  "Shared Operational Environment"}
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowRegionModal(true)}
          className="mt-4 border border-orange-500/50 text-orange-400 hover:border-orange-500 text-sm rounded-lg px-4 py-2 transition-colors w-full text-center"
        >
          Request Operational Region Change
        </button>
        {operationalRegionPrefs?.changeRequest && (
          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-xs font-medium">
                Change Request Status
              </span>
              <span className="text-white/40 text-xs">
                {operationalRegionPrefs.changeRequest.referenceNumber}
              </span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium border ${
                operationalRegionPrefs.changeRequest.status === "pending_review"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : operationalRegionPrefs.changeRequest.status === "approved"
                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                    : operationalRegionPrefs.changeRequest.status === "rejected"
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : operationalRegionPrefs.changeRequest.status ===
                          "scheduled_migration"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/30"
              }`}
            >
              {operationalRegionPrefs.changeRequest.status === "pending_review"
                ? "Pending Review"
                : operationalRegionPrefs.changeRequest.status ===
                    "under_assessment"
                  ? "Under Assessment"
                  : operationalRegionPrefs.changeRequest.status === "approved"
                    ? "Approved"
                    : operationalRegionPrefs.changeRequest.status === "rejected"
                      ? "Rejected"
                      : "Scheduled Migration"}
            </span>
            <p className="text-white/40 text-xs mt-2 line-clamp-2">
              {operationalRegionPrefs.changeRequest.businessJustification}
            </p>
          </div>
        )}
      </div>

      {/* Low credit warning */}
      {computeLow && (
        <div
          className="rounded-xl p-4 flex items-start gap-3 bg-yellow-500/[0.06] border border-yellow-500/25"
          data-ocid="infrastructure.low_credit_banner"
        >
          <div className="p-2 rounded-lg flex-shrink-0 mt-0.5 bg-yellow-500/10">
            <AlertTriangle size={14} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-300">
              Compute credits running low
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Buy more credits to maintain operational capacity.
            </p>
          </div>
          <button
            type="button"
            data-ocid="infrastructure.low_credit.buy_button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/10 transition-all"
          >
            <Zap size={11} />
            Buy Credits
          </button>
        </div>
      )}

      {/* Credit balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CreditMetricCard
          label="Compute Credits"
          value={credits.compute}
          icon={Cpu}
          accent
        />
        <CreditMetricCard
          label="Storage Credits"
          value={credits.storage}
          icon={Database}
        />
        <CreditMetricCard label="AI Credits" value={credits.ai} icon={Brain} />
      </div>

      {/* Burn rate */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-orange-400" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Estimated Monthly Burn
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Compute:</span>
            <span className="text-sm font-bold text-orange-400">~850/mo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Storage:</span>
            <span className="text-sm font-bold text-foreground">~42/mo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">AI:</span>
            <span className="text-sm font-bold text-foreground">~210/mo</span>
          </div>
          <span className="text-[11px] text-muted-foreground/60 ml-auto">
            (based on current activity)
          </span>
        </div>
      </GlassCard>

      {/* Forecasting */}
      <GlassCard className="p-5" glow>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-orange-400" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Credit Forecast
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              Based on current activity, your organization may require
              additional credits within{" "}
              <span className="font-bold text-orange-400">18 days</span>.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Projected Depletion
                </span>
                <div className="text-sm font-semibold text-foreground">
                  {projectedDateStr}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  AI Trend
                </span>
                <div className="mt-0.5">
                  <TrendIndicator trend="increasing" />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Storage Trend
                </span>
                <div className="mt-0.5">
                  <TrendIndicator trend="stable" />
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            data-ocid="infrastructure.forecast.buy_button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-br from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/20 flex-shrink-0"
          >
            <Zap size={14} />
            Buy Credits
          </button>
        </div>
      </GlassCard>

      {/* Shared Operational Billing */}
      <SharedBillingSection workspaceType={workspaceType} />

      {/* Active canisters */}
      <div>
        <SectionHeader
          title="Active Operational Units"
          subtitle="Your organization's isolated infrastructure units"
        />
        <div className="space-y-2">
          {CANISTER_DATA.map((c, i) => (
            <GlassCard
              key={c.name}
              className="p-4"
              data-ocid={`infrastructure.canister.item.${i + 1}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.06]">
                    <Server size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {c.label}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {c.storage}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Storage
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <ShieldCheck size={11} className="text-emerald-400" />
                    {c.health}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Usage analytics chart */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-orange-400" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Compute Usage Trend (30 Days)
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground/60">
            Credits consumed per day
          </span>
        </div>
        <UsageChart />
      </GlassCard>

      {/* Buy Credits CTA */}
      <GlassCard className="p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-orange-500/10">
            <CreditCard size={24} className="text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Need More Operational Capacity?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-md mx-auto">
              Purchase additional compute, storage, and AI credits to scale your
              channel operations without interruption.
            </p>
          </div>
          <button
            type="button"
            data-ocid="infrastructure.buy_credits.primary_button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-br from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
          >
            <Zap size={14} />
            Buy Credits
          </button>
        </div>
      </GlassCard>

      {/* Credit Visibility Management */}
      <div ref={creditVisibilityRef}>
        <SectionHeader
          title="Credit Visibility Management"
          subtitle="Control which Secondary Admins can access Credit Usage Insights and operational credit alerts"
        />
        <CreditVisibilityManagement isPrimaryAdmin={isAdmin} />
      </div>

      {/* Sovereign Infrastructure Positioning */}
      <SovereignInfraBanner />

      {/* Sovereignty messaging */}
      <GlassCard className="p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
            <Globe size={14} className="text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Your Operational Data. Your Control.
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your operational data lives inside isolated infrastructure units
              under your organizational control.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { label: "Vendor Isolation", icon: Building2 },
                { label: "Distributor Isolation", icon: Users },
                { label: "Reseller Isolation", icon: ShieldCheck },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                >
                  <item.icon
                    size={11}
                    className="text-blue-400 flex-shrink-0"
                  />
                  <span className="text-[11px] text-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/70 mt-3">
              Permission-controlled visibility. Hierarchy-aware access reduces
              unnecessary data exposure.
            </p>
          </div>
        </div>
      </GlassCard>

      {showRegionModal && (
        <RegionChangeRequestModal onClose={() => setShowRegionModal(false)} />
      )}

      {/* Modal */}
      <BuyCreditsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
