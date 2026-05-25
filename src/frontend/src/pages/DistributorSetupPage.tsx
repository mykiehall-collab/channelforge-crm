import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadConfig } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Brain,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Globe,
  ImagePlus,
  Loader2,
  Network,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import OperationalRegionSelector from "../components/OperationalRegionSelector";
import { useActor } from "../hooks/useActor";
import type { OperationalRegionPreferences } from "../types";

const BG_DEEP = "#0b1220";
const BG_BASE = "#0e1624";
const BG_MID = "#121d2e";
const BORDER = "#1c2e44";
const ORANGE = "#FF6B2B";
const STORAGE_KEY = "cf-distributor-onboarding";

const TOTAL_STEPS = 8;

const STEP_LABELS = [
  "Company Profile",
  "Logo & Domain",
  "Admin Setup",
  "Vendor Relationship",
  "Reseller Network",
  "Notifications & ForgeAI",
  "Infrastructure Preferences",
  "Dashboard Preview",
];

const STEP_DESCRIPTIONS = [
  "Your organization details",
  "Branding & workspace identity",
  "Primary administrator",
  "Vendor governance setup",
  "Your reseller network",
  "Alerts & intelligence delivery",
  "Preview & complete setup",
];

type Reseller = {
  name: string;
  contactName: string;
  contactEmail: string;
  territory: string;
  tier: string;
};

type NotificationSettings = {
  vendorOpportunities: boolean;
  resellerEngagement: boolean;
  regionalPipeline: boolean;
  dealRegistration: boolean;
  forgeAiAlerts: boolean;
  alertDelivery: string;
  alertFrequency: string;
};

type OnboardingData = {
  // Step 1
  companyName: string;
  industry: string;
  region: string;
  companySize: string;
  website: string;
  description: string;
  // Step 2
  logoKey: string;
  logoPreviewUrl: string;
  domain: string;
  // Step 3
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  requireMfa: boolean;
  // Step 4
  vendorName: string;
  vendorContactName: string;
  vendorContactEmail: string;
  assignedTerritory: string;
  channelRole: string;
  // Step 5
  resellers: Reseller[];
  // Step 6
  notifications: NotificationSettings;
};

const DEFAULT_DATA: OnboardingData = {
  companyName: "",
  industry: "",
  region: "",
  companySize: "",
  website: "",
  description: "",
  logoKey: "",
  logoPreviewUrl: "",
  domain: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
  requireMfa: false,
  vendorName: "",
  vendorContactName: "",
  vendorContactEmail: "",
  assignedTerritory: "",
  channelRole: "",
  resellers: [],
  notifications: {
    vendorOpportunities: true,
    resellerEngagement: true,
    regionalPipeline: true,
    dealRegistration: true,
    forgeAiAlerts: true,
    alertDelivery: "primary",
    alertFrequency: "realtime",
  },
};

function normaliseDomain(raw: string): string {
  return raw.replace(/^@/, "").toLowerCase().trim();
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  id: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-b-white/5 last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white">{label}</div>
        {description && (
          <div className="text-xs mt-0.5" style={{ color: "#6a7a90" }}>
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        data-ocid={id}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus-visible:ring-2"
        style={{
          background: checked ? ORANGE : "#1c2e44",
          boxShadow: checked ? "0 0 8px rgba(255,107,43,0.35)" : "none",
        }}
        aria-label={label}
      >
        <span
          className="inline-block w-4 h-4 rounded-full bg-white transition-transform duration-200"
          style={{
            transform: checked ? "translateX(24px)" : "translateX(4px)",
          }}
        />
      </button>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  accentColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  accentColor: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{
        background: BG_MID,
        border: `1px solid ${BORDER}`,
        borderTop: `2px solid ${accentColor}`,
      }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "#5a6a80" }}
      >
        {title}
      </div>
      <div
        className="text-2xl font-bold"
        style={{
          color: accentColor,
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        {value}
      </div>
      <div className="text-xs" style={{ color: "#7D8AA0" }}>
        {subtitle}
      </div>
      <div
        className="text-xs font-mono"
        style={{ color: accentColor, opacity: 0.8 }}
      >
        {trend}
      </div>
    </div>
  );
}

const METRICS = [
  {
    title: "Vendor-Linked Opportunities",
    value: "18",
    subtitle: "Active across your region",
    trend: "↑ 5 new this week",
    accentColor: "#648CDC",
  },
  {
    title: "Reseller Activity",
    value: "74%",
    subtitle: "Resellers active this month",
    trend: "↑ 6% vs last month",
    accentColor: "#22c55e",
  },
  {
    title: "Regional Pipeline",
    value: "$2.4M",
    subtitle: "Pipeline value in your territory",
    trend: "↑ $340K from last quarter",
    accentColor: ORANGE,
  },
  {
    title: "MDF Activity",
    value: "6",
    subtitle: "Active MDF campaigns",
    trend: "3 pending approval",
    accentColor: "#a855f7",
  },
  {
    title: "Pending Approvals",
    value: "11",
    subtitle: "Deal registrations pending",
    trend: "4 expiring in 48h",
    accentColor: "#ef4444",
  },
  {
    title: "ForgeAI Alerts",
    value: "7",
    subtitle: "Engagement alerts active",
    trend: "2 critical, 5 advisory",
    accentColor: ORANGE,
  },
];

export function DistributorSetupPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const { setOperationalRegionPrefs } = useApp();

  const [prepopDismissed, setPrepopDismissed] = useState(
    () => localStorage.getItem("cf_prepopulation_dismissed") === "distributor",
  );

  const [data, setData] = useState<OnboardingData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const base: OnboardingData = saved
        ? { ...DEFAULT_DATA, ...JSON.parse(saved) }
        : { ...DEFAULT_DATA };
      // Pre-populate empty fields from subscription profile
      if (
        !localStorage
          .getItem("cf_prepopulation_dismissed")
          ?.includes("distributor")
      ) {
        try {
          const sub = JSON.parse(
            sessionStorage.getItem("cf_subscription") || "",
          );
          if (sub) {
            if (!base.companyName && sub.companyName)
              base.companyName = sub.companyName;
            if (!base.adminEmail && sub.companyEmail)
              base.adminEmail = sub.companyEmail;
            if (!base.region && sub.regions?.length > 0)
              base.region = sub.regions[0];
          }
        } catch {
          /* ignore */
        }
      }
      return base;
    } catch {
      // ignore
    }
    return DEFAULT_DATA;
  });

  const hasPrepopData = (() => {
    try {
      const sub = JSON.parse(sessionStorage.getItem("cf_subscription") || "");
      return !!(sub?.companyName || sub?.companyEmail);
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  function update<K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K],
  ) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function updateNotif<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) {
    setData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  }

  function addReseller() {
    setData((prev) => ({
      ...prev,
      resellers: [
        ...prev.resellers,
        {
          name: "",
          contactName: "",
          contactEmail: "",
          territory: "",
          tier: "Silver",
        },
      ],
    }));
  }

  function updateReseller(index: number, field: keyof Reseller, value: string) {
    setData((prev) => {
      const updated = [...prev.resellers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, resellers: updated };
    });
  }

  function removeReseller(index: number) {
    setData((prev) => ({
      ...prev,
      resellers: prev.resellers.filter((_, i) => i !== index),
    }));
  }

  async function uploadLogo(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Logo must be smaller than 5 MB.");
      return;
    }
    setUploadError("");
    setUploading(true);
    setUploadProgress(0);
    try {
      const config = await loadConfig();
      const { HttpAgent } = await import("@icp-sdk/core/agent");
      const agent = await HttpAgent.create({
        host: config.backend_host ?? "https://ic0.app",
      });
      const client = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, (pct) =>
        setUploadProgress(Math.round(pct)),
      );
      update("logoKey", hash);
      update("logoPreviewUrl", URL.createObjectURL(file));
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!actor) {
      toast.error("Not connected. Please try again.");
      return;
    }
    setSubmitting(true);
    try {
      const actorAny = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      const companyResult = await (
        actorAny.createCompanyProfile as (
          p: unknown,
        ) => Promise<{ __kind__: string; ok?: { id: string }; err?: string }>
      )({
        companyName: data.companyName.trim(),
        companyId: normaliseDomain(data.domain),
        emailDomain: normaliseDomain(data.domain),
        partnerDomains: [],
        companyType: "Distributor",
        logoKey: data.logoKey || undefined,
      });
      if (companyResult.__kind__ === "err") {
        toast.error(companyResult.err ?? "Setup failed.");
        setSubmitting(false);
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      setComplete(true);
    } catch (err) {
      console.error("Distributor setup failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
  // Currently showing amber warnings only — the Continue button is NEVER disabled in test mode.
  // Original blocking logic is preserved in getMissingFieldsDist() below for easy reinstatement.
  const _canContinue = true; // TEST MODE: always allow progression — TODO-SECURITY: replace with getMissingFieldsDist() before live launch
  // LIVE MODE: replace the line above with the block below:
  // const canContinue = (() => {
  //   if (step === 1)
  //     return (
  //       data.companyName.trim().length > 0 &&
  //       data.industry !== "" &&
  //       data.region !== ""
  //     );
  //   if (step === 2) return data.domain.trim().length > 2;
  //   if (step === 3)
  //     return data.adminName.trim().length > 0 && data.adminEmail.includes("@");
  //   if (step === 4) return data.vendorName.trim().length > 0;
  //   return true;
  // })();

  // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
  // Returns incomplete fields for current step — used for soft amber warnings in test mode.
  function getMissingFieldsDist(): string[] {
    const missing: string[] = [];
    if (step === 1) {
      if (!data.companyName.trim()) missing.push("Distributor Company Name");
      if (!data.industry) missing.push("Primary Industry");
      if (!data.region) missing.push("Primary Operating Region");
    }
    if (step === 2) {
      if (data.domain.trim().length < 3) missing.push("Workspace Domain");
    }
    if (step === 3) {
      if (!data.adminName.trim()) missing.push("Primary Admin Full Name");
      if (!data.adminEmail.includes("@"))
        missing.push("Admin Email (please enter a valid email address)");
    }
    if (step === 4) {
      if (!data.vendorName.trim()) missing.push("Parent Vendor Name");
    }
    return missing;
  }

  const distMissingFields = getMissingFieldsDist();
  const distHasWarnings = distMissingFields.length > 0;

  if (complete) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: BG_DEEP }}
        data-ocid="dist_setup.success.panel"
      >
        <div
          className="w-full max-w-md rounded-2xl p-10 flex flex-col items-center text-center gap-6"
          style={{ background: BG_MID, border: `1px solid ${BORDER}` }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,107,43,0.1)",
              border: `2px solid ${ORANGE}`,
            }}
          >
            <CheckCircle2 size={36} style={{ color: ORANGE }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Distributor Workspace Created
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#7D8AA0" }}>
              Your CHANNELFORGE Distributor workspace is ready. ForgeAI is
              monitoring your Vendor relationships and Reseller network.
            </p>
          </div>
          <Button
            type="button"
            data-ocid="dist_setup.go_to_dashboard.button"
            className="w-full font-semibold py-3"
            style={{ background: ORANGE, color: "white" }}
            onClick={() => navigate({ to: "/dashboard" })}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="wizard-container"
      style={{ background: BG_DEEP }}
      data-ocid="dist_setup.page"
    >
      {/* SIDEBAR */}
      <aside
        className="wizard-sidebar"
        style={{ background: BG_BASE, borderRightColor: BORDER }}
        data-ocid="dist_setup.sidebar"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1a2e45, #0e1b2e)",
              border: `1px solid ${BORDER}`,
            }}
          >
            <Network size={16} style={{ color: ORANGE }} />
          </div>
          <div>
            <div
              className="font-black text-white text-[14px] leading-tight tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              CHANNEL
              <span style={{ color: ORANGE }} className="forge-pulse">
                FORGE
              </span>
            </div>
            <div className="text-[9px] text-white/30 font-medium tracking-[0.15em] uppercase">
              CRM
            </div>
          </div>
        </div>

        {/* Workspace badge */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-6"
          style={{
            background: "rgba(255,107,43,0.08)",
            border: "1px solid rgba(255,107,43,0.2)",
          }}
        >
          <Building2 size={12} style={{ color: ORANGE }} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ color: ORANGE }}
          >
            Distributor Workspace
          </span>
        </div>

        {/* Progress bar */}
        <div className="wizard-progress-bar mb-1">
          <div
            className="wizard-progress-fill"
            style={{ width: `${progressPct}%`, background: ORANGE }}
          />
        </div>
        <div className="wizard-progress-label mb-6">
          Step {step} of {TOTAL_STEPS} — {progressPct}% complete
        </div>

        {/* Step list */}
        <nav className="wizard-step-list" data-ocid="dist_setup.step_list">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1;
            const isActive = s === step;
            const isDone = s < step;
            return (
              <button
                type="button"
                key={label}
                data-ocid={`dist_setup.step_nav.${s}`}
                onClick={() => s < step && setStep(s)}
                className={`wizard-step-item ${
                  isActive
                    ? "wizard-step-item-active"
                    : isDone
                      ? "wizard-step-item-completed"
                      : "wizard-step-item-pending"
                } text-left w-full`}
                style={{
                  cursor: isDone
                    ? "pointer"
                    : isActive
                      ? "default"
                      : "not-allowed",
                  background: isActive ? "rgba(255,107,43,0.08)" : undefined,
                  borderLeft: isActive
                    ? `2px solid ${ORANGE}`
                    : "2px solid transparent",
                }}
              >
                <div
                  className="wizard-step-number"
                  style={{
                    background: isActive
                      ? ORANGE
                      : isDone
                        ? "rgba(34,197,94,0.2)"
                        : undefined,
                    color: isActive ? "white" : isDone ? "#22c55e" : undefined,
                  }}
                >
                  {isDone ? <CheckCircle2 size={12} /> : s}
                </div>
                <div>
                  <div
                    className="wizard-step-title"
                    style={{
                      color: isActive ? ORANGE : isDone ? "#c8d4e0" : undefined,
                    }}
                  >
                    {label}
                  </div>
                  <div className="wizard-step-description">
                    {STEP_DESCRIPTIONS[i]}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Save & exit */}
        <div className="mt-auto pt-6 border-t" style={{ borderColor: BORDER }}>
          <button
            type="button"
            data-ocid="dist_setup.save_exit.button"
            onClick={() => navigate({ to: "/login" })}
            className="text-xs w-full text-center hover:underline"
            style={{ color: "#4a5a70" }}
          >
            Save &amp; Exit
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="wizard-content pb-32"
        style={{ background: BG_DEEP }}
        data-ocid="dist_setup.content"
      >
        {/* Role context header */}
        <div className="wizard-header">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={13} style={{ color: ORANGE }} />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: ORANGE }}
            >
              Setting up your Distributor workspace
            </span>
          </div>
          <h1 className="wizard-role-title" style={{ color: "white" }}>
            {STEP_LABELS[step - 1]}
          </h1>
          <p className="wizard-step-description-main">
            {step === 1 &&
              "Your Distributor profile is shared with Vendors you partner with and Resellers you manage. Keep it accurate and professional."}
            {step === 2 &&
              "Your workspace domain is used for unique identification. It cannot be changed after setup."}
            {step === 3 &&
              "The Primary Admin controls this Distributor workspace — user management, notification rules, ForgeAI alert delivery, and visibility settings."}
            {step === 4 &&
              "Define your primary Vendor relationship. Your Vendor controls the overarching governance policies for your workspace."}
            {step === 5 &&
              "Add Resellers you currently manage. You can expand your Reseller network after setup is complete."}
            {step === 6 &&
              "Configure how your team receives alerts for your Vendor relationships, Reseller operations, and regional pipeline activity."}
            {step === 7 &&
              "Here's a preview of your CHANNELFORGE Distributor command center. Live data populates after setup."}
          </p>
        </div>

        {/* ── STEP 1: Company Profile ── */}
        {step === 1 && (
          <div
            className="wizard-form-section"
            data-ocid="dist_setup.step1.panel"
          >
            <div className="wizard-form-group">
              {hasPrepopData && !prepopDismissed && (
                <div
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 mb-4"
                  style={{
                    background: "rgba(255,107,43,0.07)",
                    border: "1px solid rgba(255,107,43,0.25)",
                  }}
                  data-ocid="dist_setup.prepop_notice.banner"
                >
                  <CheckCircle2
                    size={13}
                    style={{ color: ORANGE }}
                    className="flex-shrink-0"
                  />
                  <span className="flex-1 text-xs" style={{ color: "#d4a070" }}>
                    Pre-filled from your subscription profile
                  </span>
                  <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={() => {
                      setPrepopDismissed(true);
                      localStorage.setItem(
                        "cf_prepopulation_dismissed",
                        "distributor",
                      );
                    }}
                  >
                    <X size={12} style={{ color: "#7D8AA0" }} />
                  </button>
                </div>
              )}
              <div className="wizard-form-row">
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">
                    Distributor Company Name{" "}
                    <span className="wizard-form-required">*</span>
                  </Label>
                  <Input
                    data-ocid="dist_setup.company_name.input"
                    placeholder="e.g. Ingram Micro"
                    value={data.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    className="crm-input"
                  />
                </div>
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">
                    Primary Industry{" "}
                    <span className="wizard-form-required">*</span>
                  </Label>
                  <select
                    data-ocid="dist_setup.industry.select"
                    value={data.industry}
                    onChange={(e) => update("industry", e.target.value)}
                    className="field-dropdown"
                  >
                    <option value="">Select industry…</option>
                    {[
                      "Technology",
                      "Healthcare",
                      "Manufacturing",
                      "Financial Services",
                      "Telecommunications",
                      "Professional Services",
                      "Other",
                    ].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="wizard-form-row">
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">
                    Primary Operating Region{" "}
                    <span className="wizard-form-required">*</span>
                  </Label>
                  <select
                    data-ocid="dist_setup.region.select"
                    value={data.region}
                    onChange={(e) => update("region", e.target.value)}
                    className="field-dropdown"
                  >
                    <option value="">Select region…</option>
                    {[
                      "North America",
                      "EMEA",
                      "APAC",
                      "LATAM",
                      "Multiple Regions",
                    ].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">Company Size</Label>
                  <select
                    data-ocid="dist_setup.company_size.select"
                    value={data.companySize}
                    onChange={(e) => update("companySize", e.target.value)}
                    className="field-dropdown"
                  >
                    <option value="">Select size…</option>
                    {["1-50", "51-200", "201-1000", "1000+"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">
                  Company Website{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  data-ocid="dist_setup.website.input"
                  placeholder="https://yourdistributor.com"
                  value={data.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="crm-input"
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">
                  Brief Company Description{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional, max 500 chars)
                  </span>
                </Label>
                <textarea
                  data-ocid="dist_setup.description.textarea"
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Describe your distribution business, territories, and specializations…"
                  className="field-textarea"
                />
                <span className="wizard-form-hint">
                  {data.description.length}/500 characters
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Logo & Domain ── */}
        {step === 2 && (
          <div
            className="wizard-form-section"
            data-ocid="dist_setup.step2.panel"
          >
            <div className="wizard-form-group">
              <div className="wizard-form-field">
                <Label className="wizard-form-label">
                  Company Logo{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional — PNG, JPG, SVG, max 5 MB)
                  </span>
                </Label>
                {data.logoKey ? (
                  <div
                    className="flex items-center gap-4 rounded-xl p-5"
                    style={{
                      background: "rgba(34,197,94,0.05)",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{
                        background: BG_BASE,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <img
                        src={data.logoPreviewUrl}
                        alt="Logo preview"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className="flex items-center gap-1.5 text-sm font-semibold"
                        style={{ color: "#22c55e" }}
                      >
                        <CheckCircle2 size={14} /> Logo uploaded successfully
                      </div>
                      <button
                        type="button"
                        data-ocid="dist_setup.logo.replace_button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs flex items-center gap-1.5"
                        style={{ color: "#6a7a90" }}
                      >
                        <RefreshCw size={11} /> Replace logo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid="dist_setup.logo.dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      if (e.dataTransfer.files?.[0])
                        uploadLogo(e.dataTransfer.files[0]);
                    }}
                    className="w-full rounded-xl flex flex-col items-center justify-center gap-3 py-14 transition-all duration-200 cursor-pointer"
                    style={{
                      background: dragging ? "rgba(255,107,43,0.05)" : BG_BASE,
                      border: `2px dashed ${dragging ? ORANGE : BORDER}`,
                    }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2
                          size={24}
                          className="animate-spin"
                          style={{ color: ORANGE }}
                        />
                        <div className="text-sm font-medium text-white">
                          Uploading… {uploadProgress}%
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{
                            background: "rgba(255,107,43,0.06)",
                            border: "1px solid rgba(255,107,43,0.15)",
                          }}
                        >
                          <ImagePlus size={22} style={{ color: ORANGE }} />
                        </div>
                        <div className="text-sm font-semibold text-white">
                          <span style={{ color: ORANGE }}>Click to upload</span>{" "}
                          or drag and drop
                        </div>
                        <div className="text-xs" style={{ color: "#4a5568" }}>
                          PNG, JPG, SVG, WebP · Max 5 MB
                        </div>
                      </>
                    )}
                  </button>
                )}
                {uploadError && (
                  <p className="text-xs" style={{ color: "#f87171" }}>
                    {uploadError}
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) uploadLogo(e.target.files[0]);
                  }}
                  data-ocid="dist_setup.logo.upload_button"
                />
              </div>

              <div className="wizard-form-field">
                <Label className="wizard-form-label">
                  Workspace Domain{" "}
                  <span className="wizard-form-required">*</span>
                </Label>
                <Input
                  data-ocid="dist_setup.domain.input"
                  placeholder="e.g. acmedist.channelforge.io"
                  value={data.domain}
                  onChange={(e) => update("domain", e.target.value)}
                  className="crm-input font-mono"
                />
                <span className="wizard-form-hint">
                  Your workspace domain is used for unique identification. It
                  cannot be changed after setup.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Admin Setup ── */}
        {step === 3 && (
          <div
            className="wizard-form-section"
            data-ocid="dist_setup.step3.panel"
          >
            <div className="wizard-form-group">
              <div
                className="flex items-center gap-2 rounded-lg px-4 py-3 mb-2"
                style={{
                  background: "rgba(255,107,43,0.06)",
                  border: "1px solid rgba(255,107,43,0.15)",
                }}
              >
                <Shield size={14} style={{ color: ORANGE }} />
                <span className="text-sm text-white font-medium">
                  Distributor Admin Setup
                </span>
              </div>
              <div className="wizard-form-row">
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">
                    Primary Admin Full Name{" "}
                    <span className="wizard-form-required">*</span>
                  </Label>
                  <Input
                    data-ocid="dist_setup.admin_name.input"
                    placeholder="e.g. Jordan Smith"
                    value={data.adminName}
                    onChange={(e) => update("adminName", e.target.value)}
                    className="crm-input"
                  />
                </div>
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">
                    Admin Email <span className="wizard-form-required">*</span>
                  </Label>
                  <Input
                    data-ocid="dist_setup.admin_email.input"
                    type="email"
                    placeholder="admin@yourdistributor.com"
                    value={data.adminEmail}
                    onChange={(e) => update("adminEmail", e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">
                  Admin Phone{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  data-ocid="dist_setup.admin_phone.input"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={data.adminPhone}
                  onChange={(e) => update("adminPhone", e.target.value)}
                  className="crm-input"
                />
              </div>
              <div
                className="rounded-xl p-4"
                style={{ background: BG_MID, border: `1px solid ${BORDER}` }}
              >
                <Toggle
                  id="dist_setup.mfa.toggle"
                  checked={data.requireMfa}
                  onChange={(v) => update("requireMfa", v)}
                  label="Require MFA for all admin logins"
                  description="Enforces multi-factor authentication for all admin-level access to this workspace."
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Vendor Relationship ── */}
        {step === 4 && (
          <div
            className="wizard-form-section"
            data-ocid="dist_setup.step4.panel"
          >
            <div className="wizard-form-group">
              <div className="wizard-form-field">
                <Label className="wizard-form-label">
                  Parent Vendor Name{" "}
                  <span className="wizard-form-required">*</span>
                </Label>
                <Input
                  data-ocid="dist_setup.vendor_name.input"
                  placeholder="Enter Vendor organization name"
                  value={data.vendorName}
                  onChange={(e) => update("vendorName", e.target.value)}
                  className="crm-input"
                />
              </div>
              <div className="wizard-form-row">
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">
                    Vendor Contact Name{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    data-ocid="dist_setup.vendor_contact_name.input"
                    placeholder="e.g. Sarah Chen"
                    value={data.vendorContactName}
                    onChange={(e) =>
                      update("vendorContactName", e.target.value)
                    }
                    className="crm-input"
                  />
                </div>
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">
                    Vendor Contact Email{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    data-ocid="dist_setup.vendor_contact_email.input"
                    type="email"
                    placeholder="contact@vendor.com"
                    value={data.vendorContactEmail}
                    onChange={(e) =>
                      update("vendorContactEmail", e.target.value)
                    }
                    className="crm-input"
                  />
                </div>
              </div>
              <div className="wizard-form-row">
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">
                    Assigned Territory
                  </Label>
                  <select
                    data-ocid="dist_setup.assigned_territory.select"
                    value={data.assignedTerritory}
                    onChange={(e) =>
                      update("assignedTerritory", e.target.value)
                    }
                    className="field-dropdown"
                  >
                    <option value="">Select territory…</option>
                    {[
                      "North America",
                      "EMEA",
                      "APAC",
                      "LATAM",
                      "Global",
                      "Multiple",
                    ].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="wizard-form-field">
                  <Label className="wizard-form-label">Channel Role</Label>
                  <select
                    data-ocid="dist_setup.channel_role.select"
                    value={data.channelRole}
                    onChange={(e) => update("channelRole", e.target.value)}
                    className="field-dropdown"
                  >
                    <option value="">Select role…</option>
                    {[
                      "Tier 1 Distributor",
                      "Regional Distributor",
                      "Specialist Distributor",
                      "Authorized Distributor",
                    ].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {data.channelRole && (
                <div
                  className="rounded-lg px-4 py-3 flex items-start gap-2"
                  style={{
                    background: "rgba(255,107,43,0.04)",
                    border: "1px solid rgba(255,107,43,0.12)",
                  }}
                >
                  <AlertCircle
                    size={13}
                    style={{ color: ORANGE, marginTop: 2 }}
                  />
                  <span className="text-xs" style={{ color: "#8a9ab0" }}>
                    Your channel role determines your visibility into Vendor
                    accounts and deal registrations.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 5: Reseller Network ── */}
        {step === 5 && (
          <div
            className="wizard-form-section"
            data-ocid="dist_setup.step5.panel"
          >
            <div className="wizard-form-group">
              {data.resellers.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center gap-4 rounded-xl py-14"
                  style={{
                    background: BG_BASE,
                    border: `2px dashed ${BORDER}`,
                  }}
                  data-ocid="dist_setup.resellers.empty_state"
                >
                  <Users size={28} style={{ color: "#3a4a60" }} />
                  <div className="text-center">
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#6a7a90" }}
                    >
                      No Resellers added yet
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#3a4a60" }}>
                      Add Resellers you currently manage, or skip and add them
                      later.
                    </div>
                  </div>
                  <Button
                    type="button"
                    data-ocid="dist_setup.add_reseller.button"
                    onClick={addReseller}
                    className="flex items-center gap-2 font-semibold"
                    style={{ background: ORANGE, color: "white" }}
                  >
                    <Plus size={14} /> Add Reseller
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {data.resellers.map((reseller, index) => (
                    <div
                      key={reseller.name || String(index)}
                      className="rounded-xl p-5"
                      style={{
                        background: BG_MID,
                        border: `1px solid ${BORDER}`,
                      }}
                      data-ocid={`dist_setup.reseller.item.${index + 1}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-white">
                          Reseller {index + 1}
                        </div>
                        <button
                          type="button"
                          data-ocid={`dist_setup.reseller.delete_button.${index + 1}`}
                          onClick={() => removeReseller(index)}
                          className="text-white/30 hover:text-red-400 transition-colors duration-150"
                          aria-label="Remove reseller"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="wizard-form-field">
                          <Label className="wizard-form-label text-xs">
                            Reseller Name
                          </Label>
                          <Input
                            data-ocid={`dist_setup.reseller_name.input.${index + 1}`}
                            placeholder="Company name"
                            value={reseller.name}
                            onChange={(e) =>
                              updateReseller(index, "name", e.target.value)
                            }
                            className="crm-input"
                          />
                        </div>
                        <div className="wizard-form-field">
                          <Label className="wizard-form-label text-xs">
                            Contact Name
                          </Label>
                          <Input
                            data-ocid={`dist_setup.reseller_contact_name.input.${index + 1}`}
                            placeholder="Primary contact"
                            value={reseller.contactName}
                            onChange={(e) =>
                              updateReseller(
                                index,
                                "contactName",
                                e.target.value,
                              )
                            }
                            className="crm-input"
                          />
                        </div>
                        <div className="wizard-form-field">
                          <Label className="wizard-form-label text-xs">
                            Contact Email
                          </Label>
                          <Input
                            data-ocid={`dist_setup.reseller_contact_email.input.${index + 1}`}
                            type="email"
                            placeholder="contact@reseller.com"
                            value={reseller.contactEmail}
                            onChange={(e) =>
                              updateReseller(
                                index,
                                "contactEmail",
                                e.target.value,
                              )
                            }
                            className="crm-input"
                          />
                        </div>
                        <div className="wizard-form-field">
                          <Label className="wizard-form-label text-xs">
                            Territory / Region
                          </Label>
                          <select
                            data-ocid={`dist_setup.reseller_territory.select.${index + 1}`}
                            value={reseller.territory}
                            onChange={(e) =>
                              updateReseller(index, "territory", e.target.value)
                            }
                            className="field-dropdown"
                          >
                            <option value="">Select…</option>
                            {[
                              "North America",
                              "EMEA",
                              "APAC",
                              "LATAM",
                              "Global",
                            ].map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="wizard-form-field col-span-2">
                          <Label className="wizard-form-label text-xs">
                            Partner Tier
                          </Label>
                          <select
                            data-ocid={`dist_setup.reseller_tier.select.${index + 1}`}
                            value={reseller.tier}
                            onChange={(e) =>
                              updateReseller(index, "tier", e.target.value)
                            }
                            className="field-dropdown"
                          >
                            {["Silver", "Gold", "Platinum"].map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    data-ocid="dist_setup.add_another_reseller.button"
                    onClick={addReseller}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Plus size={14} /> Add Another Reseller
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 6: Notifications & ForgeAI ── */}
        {step === 6 && (
          <div
            className="wizard-form-section"
            data-ocid="dist_setup.step6.panel"
          >
            <div className="wizard-form-group">
              {/* Alert toggles */}
              <div
                className="rounded-xl p-5"
                style={{ background: BG_MID, border: `1px solid ${BORDER}` }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: ORANGE }}
                >
                  <Bell size={12} className="inline mr-1.5" />
                  Notification Channels
                </div>
                <Toggle
                  id="dist_setup.notif.vendor_opportunities.toggle"
                  checked={data.notifications.vendorOpportunities}
                  onChange={(v) => updateNotif("vendorOpportunities", v)}
                  label="Vendor-Linked Opportunity Alerts"
                  description="Notify when new Vendor-assigned opportunities are available for your region"
                />
                <Toggle
                  id="dist_setup.notif.reseller_engagement.toggle"
                  checked={data.notifications.resellerEngagement}
                  onChange={(v) => updateNotif("resellerEngagement", v)}
                  label="Reseller Engagement Alerts"
                  description="Alert when a Reseller account goes inactive or misses activity targets"
                />
                <Toggle
                  id="dist_setup.notif.regional_pipeline.toggle"
                  checked={data.notifications.regionalPipeline}
                  onChange={(v) => updateNotif("regionalPipeline", v)}
                  label="Regional Pipeline Alerts"
                  description="Track changes in your regional pipeline and MDF activity"
                />
                <Toggle
                  id="dist_setup.notif.deal_registration.toggle"
                  checked={data.notifications.dealRegistration}
                  onChange={(v) => updateNotif("dealRegistration", v)}
                  label="Deal Registration Alerts"
                  description="Receive alerts on deal registration status changes and approvals"
                />
                <Toggle
                  id="dist_setup.notif.forgeai.toggle"
                  checked={data.notifications.forgeAiAlerts}
                  onChange={(v) => updateNotif("forgeAiAlerts", v)}
                  label="ForgeAI Engagement Alerts"
                  description="Receive proactive ForgeAI operational intelligence for your accounts"
                />
              </div>

              {/* Alert delivery */}
              <div
                className="rounded-xl p-5"
                style={{ background: BG_MID, border: `1px solid ${BORDER}` }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: ORANGE }}
                >
                  <Brain size={12} className="inline mr-1.5" />
                  ForgeAI Alert Delivery
                </div>
                {(
                  [
                    { value: "primary", label: "Primary Admin only" },
                    {
                      value: "primary_secondary",
                      label: "Primary + Secondary Admins",
                    },
                    {
                      value: "configurable",
                      label: "Configurable per alert type",
                    },
                  ] as const
                ).map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                    data-ocid={`dist_setup.alert_delivery.${value}`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor:
                          data.notifications.alertDelivery === value
                            ? ORANGE
                            : BORDER,
                        background:
                          data.notifications.alertDelivery === value
                            ? "rgba(255,107,43,0.15)"
                            : "transparent",
                      }}
                    >
                      {data.notifications.alertDelivery === value && (
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: ORANGE }}
                        />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="alertDelivery"
                      value={value}
                      checked={data.notifications.alertDelivery === value}
                      onChange={() => updateNotif("alertDelivery", value)}
                      className="sr-only"
                    />
                    <span className="text-sm text-white">{label}</span>
                  </label>
                ))}
              </div>

              {/* Alert frequency */}
              <div
                className="rounded-xl p-5"
                style={{ background: BG_MID, border: `1px solid ${BORDER}` }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: ORANGE }}
                >
                  <Zap size={12} className="inline mr-1.5" />
                  Alert Frequency
                </div>
                {(
                  [
                    { value: "realtime", label: "Real-time" },
                    { value: "daily", label: "Daily Digest" },
                    { value: "weekly", label: "Weekly Summary" },
                  ] as const
                ).map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                    data-ocid={`dist_setup.alert_frequency.${value}`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor:
                          data.notifications.alertFrequency === value
                            ? ORANGE
                            : BORDER,
                        background:
                          data.notifications.alertFrequency === value
                            ? "rgba(255,107,43,0.15)"
                            : "transparent",
                      }}
                    >
                      {data.notifications.alertFrequency === value && (
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: ORANGE }}
                        />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="alertFrequency"
                      value={value}
                      checked={data.notifications.alertFrequency === value}
                      onChange={() => updateNotif("alertFrequency", value)}
                      className="sr-only"
                    />
                    <span className="text-sm text-white">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 7: Infrastructure Preferences ── */}
        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Preferred Operational Region
            </h2>
            <p className="text-white/60 mt-2 mb-6">
              Select the operational region that best aligns with your
              organization's infrastructure and governance preferences.
            </p>
            <OperationalRegionSelector
              selectedRegionId={selectedRegionId}
              isLocked={false}
              onSelect={setSelectedRegionId}
            />
            <p className="text-white/40 text-xs text-center mt-4">
              You can configure this later from The Foundry → Infrastructure.
            </p>
          </div>
        )}
        {/* ── STEP 8: Dashboard Preview ── */}
        {step === 8 && (
          <div
            className="wizard-form-section"
            data-ocid="dist_setup.step7.panel"
          >
            {/* ForgeAI badge */}
            <div
              className="flex items-start gap-3 rounded-xl px-5 py-4 mb-6"
              style={{
                background: "rgba(255,107,43,0.06)",
                border: "1px solid rgba(255,107,43,0.2)",
              }}
            >
              <Brain
                size={18}
                style={{ color: ORANGE, flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: ORANGE }}
                >
                  ForgeAI Operational Intelligence
                </div>
                <div
                  className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: "#8a9ab0" }}
                >
                  Monitoring Vendor relationships, Reseller engagement, regional
                  pipeline health, and MDF activity in real time.
                </div>
              </div>
            </div>

            {/* Dashboard metrics grid */}
            <div
              className="grid gap-4 mb-6"
              style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
              data-ocid="dist_setup.dashboard_preview.panel"
            >
              {METRICS.map((m, i) => (
                <MetricCard
                  key={m.title}
                  {...m}
                  data-ocid={`dist_setup.metric.item.${i + 1}`}
                />
              ))}
            </div>

            {/* Review summary */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: BG_MID, border: `1px solid ${BORDER}` }}
              data-ocid="dist_setup.review_summary.panel"
            >
              <button
                type="button"
                data-ocid="dist_setup.review_summary.toggle"
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors duration-150"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} style={{ color: ORANGE }} />
                  <span className="text-sm font-semibold text-white">
                    Review Workspace Summary
                  </span>
                </div>
                {summaryOpen ? (
                  <ChevronUp size={16} style={{ color: "#5a6a80" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "#5a6a80" }} />
                )}
              </button>
              {summaryOpen && (
                <div
                  className="px-5 pb-5 border-t"
                  style={{ borderColor: BORDER }}
                >
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { label: "Company", value: data.companyName || "—" },
                      { label: "Industry", value: data.industry || "—" },
                      { label: "Region", value: data.region || "—" },
                      { label: "Domain", value: data.domain || "—" },
                      { label: "Primary Admin", value: data.adminName || "—" },
                      {
                        label: "Vendor Partner",
                        value: data.vendorName || "—",
                      },
                      { label: "Channel Role", value: data.channelRole || "—" },
                      {
                        label: "Resellers Added",
                        value: String(data.resellers.length),
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col gap-0.5">
                        <span
                          className="text-[10px] uppercase tracking-wider"
                          style={{ color: "#4a5a70" }}
                        >
                          {label}
                        </span>
                        <span className="text-sm font-medium text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TODO-SECURITY: RE-ENABLE required field blocking before live launch. */}
        {/* Amber warning banner — soft guide, never blocks progression */}
        {distHasWarnings && step <= 4 && (
          <div
            className="wizard-form-section"
            style={{ paddingBottom: 0, paddingTop: 0 }}
          >
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3 mb-4"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.35)",
              }}
              data-ocid="dist_setup.field_warning.banner"
            >
              <AlertCircle
                size={15}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#f59e0b" }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#f59e0b" }}
                >
                  Some fields need attention — please review the highlighted
                  items before continuing.
                </div>
                <div className="text-xs mt-1" style={{ color: "#b08a3a" }}>
                  Missing: {distMissingFields.join(", ")}. This field helps us
                  configure your workspace correctly — you can update it later
                  in settings.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTION BAR ── */}
        <div
          className="wizard-action-bar"
          style={{ background: BG_BASE, borderColor: BORDER }}
          data-ocid="dist_setup.action_bar"
        >
          {step === 1 ? (
            <Button
              type="button"
              variant="outline"
              data-ocid="dist_setup.back_to_workspace_select.button"
              onClick={() => navigate({ to: "/workspace-setup" })}
              className="flex items-center gap-1.5 font-semibold"
              style={{ borderColor: BORDER, color: "#7D8AA0" }}
            >
              <ArrowLeft size={15} /> Back to Workspace Selection
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              data-ocid="dist_setup.back.button"
              disabled={submitting}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="flex items-center gap-1.5 font-semibold"
              style={{ borderColor: BORDER, color: "#7D8AA0" }}
            >
              <ChevronLeft size={15} /> Back
            </Button>
          )}

          <div className="flex items-center gap-3">
            {step === 5 && (
              <button
                type="button"
                data-ocid="dist_setup.skip.button"
                onClick={() => setStep((s) => s + 1)}
                className="text-sm hover:underline"
                style={{ color: "#4a5a70" }}
              >
                Skip this step
              </button>
            )}
            {step === 7 && (
              <button
                type="button"
                data-ocid="dist_setup.skip_region.button"
                onClick={() => {
                  setOperationalRegionPrefs({
                    selectedRegionId: "europe",
                    isConfigured: false,
                    isLocked: false,
                    lockedAt: null,
                    changeRequest: null,
                  } as OperationalRegionPreferences);
                  setStep((s) => s + 1);
                }}
                className="text-sm hover:underline"
                style={{ color: "#4a5a70" }}
              >
                Skip for now
              </button>
            )}
            {/* TODO-SECURITY: RE-ENABLE disabled={!canContinue} before live launch. */}
            {/* Button is always enabled in test mode; warnings are shown inline instead. */}
            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                data-ocid="dist_setup.continue.button"
                onClick={() => {
                  if (step === 7) {
                    setOperationalRegionPrefs({
                      selectedRegionId: selectedRegionId ?? "europe",
                      isConfigured: !!selectedRegionId,
                      isLocked: !!selectedRegionId,
                      lockedAt: selectedRegionId
                        ? new Date().toISOString()
                        : null,
                      changeRequest: null,
                    } as OperationalRegionPreferences);
                    setStep((s) => s + 1);
                    return;
                  }
                  if (distHasWarnings) {
                    toast.warning(
                      "You've proceeded with incomplete fields. You can come back and update these later.",
                      { duration: 5000 },
                    );
                  }
                  setStep((s) => s + 1);
                }}
                className="flex items-center gap-2 font-semibold px-8"
                style={{ background: ORANGE, color: "white" }}
              >
                Continue <ChevronRight size={15} />
              </Button>
            ) : (
              <Button
                type="button"
                data-ocid="dist_setup.complete_setup.button"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 font-semibold px-10"
                style={{ background: ORANGE, color: "white" }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Creating
                    Workspace…
                  </>
                ) : (
                  <>
                    Complete Setup <CheckCircle2 size={15} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .crm-input { background: ${BG_BASE} !important; border: 1px solid ${BORDER} !important; color: white !important; font-size: 14px; }
        .crm-input::placeholder { color: #3a4a60; }
        .crm-input:focus { outline: none !important; border-color: ${ORANGE} !important; box-shadow: 0 0 0 3px rgba(255,107,43,0.12) !important; }
        .field-dropdown { background: ${BG_BASE}; border: 1px solid ${BORDER}; color: white; font-size: 14px; padding: 8px 12px; border-radius: 0.5rem; width: 100%; }
        .field-dropdown:focus { outline: none; border-color: ${ORANGE}; box-shadow: 0 0 0 3px rgba(255,107,43,0.12); }
        .field-dropdown option { background: #0e1b2e; color: white; }
        .field-textarea { background: ${BG_BASE} !important; border: 1px solid ${BORDER} !important; color: white !important; font-size: 14px; border-radius: 0.5rem; padding: 8px 12px; width: 100%; resize: none; }
        .field-textarea::placeholder { color: #3a4a60; }
        .field-textarea:focus { outline: none !important; border-color: ${ORANGE} !important; box-shadow: 0 0 0 3px rgba(255,107,43,0.12) !important; }
      `}</style>
    </div>
  );
}
