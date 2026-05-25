import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  Lock,
  Save,
  Shield,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  X,
  ZapOff,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import OperationalRegionSelector from "../components/OperationalRegionSelector";
import type { OperationalRegionPreferences } from "../types";

// ─── Color constants (mirrors LoginPage pattern) ───────────────────────────────
const BG_DEEP = "#0b1220";
const BG_BASE = "#0e1829";
const BG_MID = "#121b2a";
const BORDER = "#1e3050";
const ORANGE = "#FF6B2B";

const LS_KEY = "cf-reseller-onboarding";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface FormData {
  // Step 1
  companyName: string;
  industry: string;
  territory: string;
  companySize: string;
  websiteUrl: string;
  companyDescription: string;
  // Step 2
  logoPreviewUrl: string;
  domain: string;
  // Step 3
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  mfaRequired: boolean;
  // Step 4
  customerSegments: string[];
  estimatedAccounts: string;
  ownershipModel: string;
  renewalModel: string;
  // Step 5
  visibilityScopeConfirmed: boolean;
  // Step 6
  alertRenewalRisk: boolean;
  alertOpportunity: boolean;
  alertDealReg: boolean;
  alertEngagement: boolean;
  alertForgeAI: boolean;
  alertDelivery: string;
  alertFrequency: string;
}

const DEFAULT_FORM: FormData = {
  companyName: "",
  industry: "",
  territory: "",
  companySize: "",
  websiteUrl: "",
  companyDescription: "",
  logoPreviewUrl: "",
  domain: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
  mfaRequired: false,
  customerSegments: [],
  estimatedAccounts: "",
  ownershipModel: "",
  renewalModel: "",
  visibilityScopeConfirmed: false,
  alertRenewalRisk: true,
  alertOpportunity: true,
  alertDealReg: true,
  alertEngagement: true,
  alertForgeAI: true,
  alertDelivery: "Primary Admin only",
  alertFrequency: "Real-time",
};

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS: { label: string; icon: React.ReactNode }[] = [
  { label: "Company Profile", icon: <Building2 size={14} /> },
  { label: "Logo & Domain", icon: <Globe size={14} /> },
  { label: "Admin Setup", icon: <Shield size={14} /> },
  { label: "Customer Accounts", icon: <Users size={14} /> },
  { label: "Vendor & Distributor", icon: <Eye size={14} /> },
  { label: "Notifications", icon: <Bell size={14} /> },
  { label: "Infrastructure Preferences", icon: <Globe size={14} /> },
  { label: "Dashboard Preview", icon: <BarChart3 size={14} /> },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function WizardSidebar({ step, progress }: { step: Step; progress: number }) {
  return (
    <aside
      className="hidden lg:flex flex-col"
      style={{
        width: "240px",
        minWidth: "240px",
        background: BG_BASE,
        borderRight: `1px solid ${BORDER}`,
        padding: "32px 24px",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: ORANGE }}
        >
          <span className="font-black text-white text-[11px]">CF</span>
        </div>
        <div className="min-w-0">
          <div
            className="font-black text-white text-[12px] leading-tight tracking-tight truncate"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            CHANNELFORGE
          </div>
          <div className="text-[8px] text-white/40 font-medium tracking-[0.15em] uppercase">
            CRM
          </div>
        </div>
      </div>

      {/* Workspace badge */}
      <div
        className="rounded-full px-3 py-1.5 mb-8 text-center"
        style={{
          background: "rgba(255,107,43,0.1)",
          border: "1px solid rgba(255,107,43,0.25)",
        }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ color: ORANGE }}
        >
          Reseller Workspace
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div
          className="flex justify-between text-[10px] mb-1.5"
          style={{ color: "#4A5568" }}
        >
          <span>Setup Progress</span>
          <span style={{ color: ORANGE }}>{Math.round(progress)}%</span>
        </div>
        <div
          className="w-full h-1.5 rounded-full"
          style={{ background: BORDER }}
        >
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: ORANGE }}
          />
        </div>
      </div>

      {/* Steps */}
      <nav className="flex flex-col gap-1">
        {STEPS.map((s, i) => {
          const stepNum = (i + 1) as Step;
          const active = step === stepNum;
          const done = step > stepNum;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
              style={{
                background: active ? "rgba(255,107,43,0.1)" : "transparent",
                border: active
                  ? "1px solid rgba(255,107,43,0.2)"
                  : "1px solid transparent",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                style={{
                  background: done ? "#22c55e" : active ? ORANGE : "#1a2840",
                  color: done || active ? "white" : "#4A5568",
                }}
              >
                {done ? <CheckCircle2 size={10} /> : stepNum}
              </div>
              <span
                className="text-[11px] font-medium truncate"
                style={{
                  color: active ? "#fff" : done ? "#22c55e" : "#4A5568",
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div
          className="rounded-lg p-3"
          style={{
            background: "rgba(255,107,43,0.06)",
            border: "1px solid rgba(255,107,43,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={11} style={{ color: ORANGE }} />
            <span
              className="text-[10px] font-semibold"
              style={{ color: ORANGE }}
            >
              ForgeAI
            </span>
          </div>
          <p
            className="text-[10px] leading-relaxed"
            style={{ color: "#7D8AA0" }}
          >
            Your intelligent channel co-pilot activates after setup.
          </p>
        </div>
      </div>
    </aside>
  );
}

function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs font-semibold" style={{ color: "#C8D0DC" }}>
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "#FF5555" }}>
            *
          </span>
        )}
      </div>
      {children}
      {hint && (
        <p className="text-[11px] italic" style={{ color: "#4A5568" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
  dataOcid,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  dataOcid?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-ocid={dataOcid}
      className="w-full rounded-lg px-3 py-2.5 text-sm transition-colors"
      style={{
        background: "#0b1724",
        border: `1px solid ${BORDER}`,
        color: value ? "#fff" : "#4A5568",
        outline: "none",
        WebkitAppearance: "none",
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o} style={{ background: BG_MID, color: "#fff" }}>
          {o}
        </option>
      ))}
    </select>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  dataOcid,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  dataOcid?: string;
  readOnly?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly}
      data-ocid={dataOcid}
      className="w-full rounded-lg px-3 py-2.5 text-sm crm-input"
      style={{
        background: readOnly ? "rgba(255,255,255,0.03)" : "#0b1724",
        border: `1px solid ${BORDER}`,
        color: readOnly ? "#7D8AA0" : "#fff",
        outline: "none",
        cursor: readOnly ? "not-allowed" : "text",
      }}
    />
  );
}

function TextAreaInput({
  value,
  onChange,
  placeholder,
  maxLength,
  dataOcid,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  dataOcid?: string;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        data-ocid={dataOcid}
        rows={3}
        className="w-full rounded-lg px-3 py-2.5 text-sm resize-none"
        style={{
          background: "#0b1724",
          border: `1px solid ${BORDER}`,
          color: "#fff",
          outline: "none",
        }}
      />
      {maxLength && (
        <span
          className="absolute bottom-2 right-3 text-[10px]"
          style={{ color: "#4A5568" }}
        >
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  dataOcid,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  dataOcid?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      data-ocid={dataOcid}
      className="flex items-start gap-3 w-full text-left rounded-lg px-4 py-3 transition-colors"
      style={{
        background: checked
          ? "rgba(255,107,43,0.07)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${checked ? "rgba(255,107,43,0.2)" : BORDER}`,
      }}
    >
      <div
        className="flex-shrink-0 mt-0.5 w-9 h-5 rounded-full flex items-center transition-all duration-200"
        style={{
          background: checked ? ORANGE : "#1a2840",
          padding: "2px",
          justifyContent: checked ? "flex-end" : "flex-start",
        }}
      >
        <div className="w-4 h-4 rounded-full" style={{ background: "#fff" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white">{label}</div>
        {description && (
          <div className="text-[11px] mt-0.5" style={{ color: "#7D8AA0" }}>
            {description}
          </div>
        )}
      </div>
    </button>
  );
}

function Radio({
  value,
  selected,
  onChange,
  label,
  dataOcid,
}: {
  value: string;
  selected: string;
  onChange: (v: string) => void;
  label: string;
  dataOcid?: string;
}) {
  const active = value === selected;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      data-ocid={dataOcid}
      className="flex items-center gap-3 w-full text-left rounded-lg px-4 py-2.5 transition-colors"
      style={{
        background: active ? "rgba(255,107,43,0.07)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(255,107,43,0.25)" : BORDER}`,
      }}
    >
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ border: `2px solid ${active ? ORANGE : "#4A5568"}` }}
      >
        {active && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: ORANGE }}
          />
        )}
      </div>
      <span className="text-sm" style={{ color: active ? "#fff" : "#7D8AA0" }}>
        {label}
      </span>
    </button>
  );
}

function CheckboxOption({
  value,
  checked,
  onChange,
  label,
  dataOcid,
}: {
  value: string;
  checked: boolean;
  onChange: (v: string, c: boolean) => void;
  label: string;
  dataOcid?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value, !checked)}
      data-ocid={dataOcid}
      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left"
      style={{
        background: checked
          ? "rgba(255,107,43,0.07)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${checked ? "rgba(255,107,43,0.2)" : BORDER}`,
      }}
    >
      <div
        className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
        style={{
          background: checked ? ORANGE : "#1a2840",
          border: `1px solid ${checked ? ORANGE : "#4A5568"}`,
        }}
      >
        {checked && <CheckCircle2 size={10} className="text-white" />}
      </div>
      <span className="text-sm" style={{ color: checked ? "#fff" : "#7D8AA0" }}>
        {label}
      </span>
    </button>
  );
}

function LogoDropZone({
  previewUrl,
  onFile,
  onClear,
}: {
  previewUrl: string;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  if (previewUrl) {
    return (
      <div
        className="flex items-center gap-4 rounded-xl px-4 py-3"
        style={{
          background: "rgba(255,107,43,0.06)",
          border: "1px solid rgba(255,107,43,0.2)",
        }}
        data-ocid="reseller_setup.logo.preview"
      >
        <img
          src={previewUrl}
          alt="Logo preview"
          className="w-12 h-12 rounded-lg object-contain"
          style={{ background: BG_DEEP }}
        />
        <span className="flex-1 text-sm text-white">Logo uploaded</span>
        <button
          type="button"
          onClick={onClear}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
          aria-label="Remove logo"
          data-ocid="reseller_setup.logo.clear_button"
        >
          <X size={14} style={{ color: "#7D8AA0" }} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      data-ocid="reseller_setup.logo.dropzone"
      className="w-full rounded-xl py-8 flex flex-col items-center gap-2 transition-colors cursor-pointer"
      style={{
        border: `2px dashed ${dragging ? ORANGE : BORDER}`,
        background: dragging ? "rgba(255,107,43,0.06)" : BG_DEEP,
      }}
    >
      <Upload size={22} style={{ color: dragging ? ORANGE : "#7D8AA0" }} />
      <span className="text-sm" style={{ color: "#7D8AA0" }}>
        Drag and drop your logo, or{" "}
        <span style={{ color: ORANGE }}>browse files</span>
      </span>
      <span className="text-xs" style={{ color: "#4A5568" }}>
        PNG, JPG, SVG — max 5 MB
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
    </button>
  );
}

function DashboardPreviewCard({
  title,
  value,
  subtitle,
  trend,
  accentColor,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  accentColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.06em]"
          style={{ color: "#7D8AA0" }}
        >
          {title}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}18` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>
      <div
        className="text-3xl font-black"
        style={{
          color: "#fff",
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        {value}
      </div>
      <div className="text-[11px]" style={{ color: "#7D8AA0" }}>
        {subtitle}
      </div>
      <div
        className="text-[11px] font-medium rounded px-2 py-0.5 inline-flex items-center gap-1 self-start"
        style={{ background: `${accentColor}15`, color: accentColor }}
      >
        <TrendingUp size={9} />
        {trend}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-lg font-bold text-white mb-1"
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
    >
      {children}
    </h2>
  );
}

function HelpBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-3.5 mb-5"
      style={{
        background: "rgba(255,107,43,0.05)",
        border: "1px solid rgba(255,107,43,0.12)",
      }}
    >
      <p className="text-[11px] leading-relaxed" style={{ color: "#C17A5A" }}>
        {children}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ResellerSetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      const base: FormData = saved
        ? { ...DEFAULT_FORM, ...(JSON.parse(saved) as Partial<FormData>) }
        : { ...DEFAULT_FORM };
      // Pre-populate empty fields from subscription profile
      if (
        !localStorage
          .getItem("cf_prepopulation_dismissed")
          ?.includes("reseller")
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
            if (!base.territory && sub.regions?.length > 0)
              base.territory = sub.regions[0];
          }
        } catch {
          /* ignore */
        }
      }
      return base;
    } catch {
      return DEFAULT_FORM;
    }
  });
  const [complete, setComplete] = useState(false);
  const [prepopDismissed, setPrepopDismissed] = useState(
    () => localStorage.getItem("cf_prepopulation_dismissed") === "reseller",
  );

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const { setOperationalRegionPrefs } = useApp();

  const hasPrepopData = (() => {
    try {
      const sub = JSON.parse(sessionStorage.getItem("cf_subscription") || "");
      return !!(sub?.companyName || sub?.companyEmail);
    } catch {
      return false;
    }
  })();

  // Auto-save on form change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSegment(segment: string, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      customerSegments: checked
        ? [...prev.customerSegments, segment]
        : prev.customerSegments.filter((s) => s !== segment),
    }));
  }

  function handleLogoFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const url = URL.createObjectURL(file);
    update("logoPreviewUrl", url);
  }

  function clearLogo() {
    if (form.logoPreviewUrl) URL.revokeObjectURL(form.logoPreviewUrl);
    update("logoPreviewUrl", "");
  }

  const progress = ((step - 1) / 7) * 100;

  // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
  // In test mode we show amber warnings but never block progression.
  // Original per-step validation is preserved in getResellerMissingFields() below.

  // LIVE MODE validation (kept for easy reinstatement):
  // const canStep1 =
  //   form.companyName.trim().length > 0 &&
  //   form.industry.length > 0 &&
  //   form.territory.length > 0 &&
  //   form.companySize.length > 0;
  // const canStep2 = form.domain.trim().length > 0;
  // const canStep3 =
  //   form.adminName.trim().length > 0 && form.adminEmail.includes("@");
  // const canStep4 =
  //   form.customerSegments.length > 0 &&
  //   form.estimatedAccounts.length > 0 &&
  //   form.ownershipModel.length > 0 &&
  //   form.renewalModel.length > 0;
  // const canStep5 = form.visibilityScopeConfirmed; // TODO-SECURITY: RE-ENABLE — visibility scope confirmation bypassed for test env
  // const canStep6 =
  //   form.alertDelivery.length > 0 && form.alertFrequency.length > 0;

  // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
  // Returns incomplete fields for current step — used for soft amber warnings in test mode.
  function getResellerMissingFields(): string[] {
    const missing: string[] = [];
    if (step === 1) {
      if (!form.companyName.trim()) missing.push("Reseller Company Name");
      if (!form.industry) missing.push("Primary Industry");
      if (!form.territory) missing.push("Primary Territory");
      if (!form.companySize) missing.push("Company Size");
    }
    if (step === 2) {
      if (!form.domain.trim()) missing.push("Workspace Domain");
    }
    if (step === 3) {
      if (!form.adminName.trim()) missing.push("Primary Admin Full Name");
      if (!form.adminEmail.includes("@"))
        missing.push("Admin Email (please enter a valid email address)");
    }
    if (step === 4) {
      if (form.customerSegments.length === 0) missing.push("Customer Segments");
      if (!form.estimatedAccounts) missing.push("Estimated Active Accounts");
      if (!form.ownershipModel) missing.push("Account Owner Assignment");
      if (!form.renewalModel) missing.push("Renewal Management Priority");
    }
    if (step === 5) {
      // TODO-SECURITY: RE-ENABLE — visibility scope confirmation bypassed for test environment.
      // In live mode, this should block until visibilityScopeConfirmed === true.
      // if (!form.visibilityScopeConfirmed) missing.push("Visibility Scope Confirmation");
      // SOFT WARNING instead:
      if (!form.visibilityScopeConfirmed)
        missing.push(
          "Visibility scope (recommended to confirm before continuing)",
        );
    }
    if (step === 6) {
      if (!form.alertDelivery) missing.push("ForgeAI Alert Delivery");
      if (!form.alertFrequency) missing.push("Alert Frequency");
    }
    return missing;
  }

  // TEST MODE: canProceed always returns true — warnings shown inline instead of blocking.
  // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
  // To reinstate, replace `return true` with the per-step canStepX checks above.
  // biome-ignore lint/correctness/noUnusedVariables: TODO-SECURITY preserved for live reinstatement
  function canProceed(): boolean {
    return true; // TEST MODE — never blocks progression
  }

  const resellerMissingFields = getResellerMissingFields();
  const resellerHasWarnings = resellerMissingFields.length > 0;

  function nextStep() {
    if (step === 7) {
      setOperationalRegionPrefs({
        selectedRegionId: selectedRegionId ?? "europe",
        isConfigured: !!selectedRegionId,
        isLocked: !!selectedRegionId,
        lockedAt: selectedRegionId ? new Date().toISOString() : null,
        changeRequest: null,
      } as OperationalRegionPreferences);
      setStep((s) => (s + 1) as Step);
      return;
    }
    if (step < 8) setStep((s) => (s + 1) as Step);
    else completeSetup();
  }

  function prevStep() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  function completeSetup() {
    localStorage.removeItem(LS_KEY);
    setComplete(true);
  }

  // ─── Success screen ───────────────────────────────────────────────────────
  if (complete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: BG_DEEP }}
      >
        <div
          className="flex flex-col items-center text-center px-8 py-12 rounded-2xl"
          style={{
            maxWidth: "440px",
            background: BG_MID,
            border: `1px solid ${BORDER}`,
          }}
          data-ocid="reseller_setup.success_state"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: "rgba(78,203,113,0.12)",
              border: "1px solid rgba(78,203,113,0.25)",
            }}
          >
            <CheckCircle2 size={32} style={{ color: "#4ECB71" }} />
          </div>
          <h2
            className="text-2xl font-black text-white mb-2"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Reseller Workspace Created
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "#7D8AA0" }}
          >
            Your CHANNELFORGE Reseller workspace is ready. ForgeAI is monitoring
            your customer accounts, renewals, and pipeline.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard" })}
            data-ocid="reseller_setup.go_to_dashboard_button"
            className="w-full rounded-lg py-3 font-semibold text-white text-sm transition-opacity hover:opacity-90"
            style={{ background: ORANGE }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Wizard layout ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: BG_DEEP }}>
      <WizardSidebar step={step} progress={progress} />

      {/* Content area */}
      <div
        className="flex-1 flex flex-col min-w-0"
        style={{ minHeight: "100vh" }}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${BORDER}`, background: BG_BASE }}
        >
          {/* Mobile brand */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: ORANGE }}
            >
              <span className="font-black text-white text-[10px]">CF</span>
            </div>
            <span
              className="font-black text-white text-[13px]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              CHANNELFORGE
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs" style={{ color: "#4A5568" }}>
              Setting up your
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,107,43,0.1)", color: ORANGE }}
            >
              Reseller Workspace
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            data-ocid="reseller_setup.save_exit_button"
            className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 transition-colors hover:bg-white/5"
            style={{ color: "#7D8AA0" }}
          >
            <Save size={12} />
            Save &amp; Exit
          </button>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-12">
          <div style={{ maxWidth: "620px" }}>
            {step === 1 && (
              <Step1CompanyProfile
                form={form}
                update={update}
                prepopDismissed={prepopDismissed}
                setPrepopDismissed={setPrepopDismissed}
                hasPrepopData={hasPrepopData}
              />
            )}
            {step === 2 && (
              <Step2LogoDomain
                form={form}
                update={update}
                handleLogoFile={handleLogoFile}
                clearLogo={clearLogo}
              />
            )}
            {step === 3 && <Step3AdminSetup form={form} update={update} />}
            {step === 4 && (
              <Step4CustomerAccounts
                form={form}
                update={update}
                toggleSegment={toggleSegment}
              />
            )}
            {step === 5 && (
              <Step5VendorDistributor form={form} update={update} />
            )}
            {step === 6 && <Step6Notifications form={form} update={update} />}
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
                  You can configure this later from The Foundry →
                  Infrastructure.
                </p>
              </div>
            )}
            {step === 8 && <Step7DashboardPreview form={form} />}
          </div>
        </div>

        {/* TODO-SECURITY: RE-ENABLE required field blocking before live launch. */}
        {/* Amber warning banner — soft guide, never blocks progression */}
        {resellerHasWarnings && step <= 6 && (
          <div
            className="px-6 py-3"
            style={{ borderTop: "1px solid rgba(245,158,11,0.2)" }}
          >
            <div
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.35)",
              }}
              data-ocid="reseller_setup.field_warning.banner"
            >
              <AlertTriangle
                size={15}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#f59e0b" }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold"
                  style={{ color: "#f59e0b" }}
                >
                  {step === 5 && !form.visibilityScopeConfirmed
                    ? "We recommend confirming your visibility scope settings before continuing."
                    : "Some fields need attention — please review the highlighted items before continuing."}
                </div>
                <div className="text-xs mt-1" style={{ color: "#b08a3a" }}>
                  {resellerMissingFields.join(", ")}. This field helps us
                  configure your workspace correctly — you can update it later
                  in settings.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div
          className="flex items-center justify-between px-6 py-4 gap-4"
          style={{ borderTop: `1px solid ${BORDER}`, background: BG_BASE }}
          data-ocid="reseller_setup.action_bar"
        >
          {step === 1 ? (
            <button
              type="button"
              onClick={() => navigate({ to: "/workspace-setup" })}
              data-ocid="reseller_setup.back_to_workspace_select.button"
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#7D8AA0",
                border: `1px solid ${BORDER}`,
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={15} /> Back to Workspace Selection
            </button>
          ) : (
            <button
              type="button"
              onClick={prevStep}
              data-ocid="reseller_setup.prev_button"
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#7D8AA0",
                border: `1px solid ${BORDER}`,
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={15} /> Back
            </button>
          )}

          <div className="flex items-center gap-3">
            {/* Mobile progress indicator */}
            <span className="text-xs lg:hidden" style={{ color: "#4A5568" }}>
              Step {step} of 8
            </span>
            {step === 7 && (
              <button
                type="button"
                data-ocid="reseller_setup.skip_region.button"
                onClick={() => {
                  setOperationalRegionPrefs({
                    selectedRegionId: "europe",
                    isConfigured: false,
                    isLocked: false,
                    lockedAt: null,
                    changeRequest: null,
                  } as OperationalRegionPreferences);
                  setStep((s) => (s + 1) as Step);
                }}
                className="text-sm hover:underline"
                style={{ color: "#4a5a70", cursor: "pointer" }}
              >
                Skip for now
              </button>
            )}
            {/* TODO-SECURITY: RE-ENABLE disabled={!canProceed()} before live launch. */}
            {/* Button is always enabled in test mode; warnings shown inline instead. */}
            <button
              type="button"
              onClick={() => {
                if (resellerHasWarnings) {
                  toast.warning(
                    "You've proceeded with incomplete fields. You can come back and update these later.",
                    { duration: 5000 },
                  );
                }
                nextStep();
              }}
              data-ocid="reseller_setup.next_button"
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: ORANGE,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {step === 8 ? "Complete Setup" : "Continue"}
              {step < 8 ? (
                <ChevronRight size={15} />
              ) : (
                <CheckCircle2 size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Company Profile ──────────────────────────────────────────────────
function Step1CompanyProfile({
  form,
  update,
  prepopDismissed,
  setPrepopDismissed,
  hasPrepopData,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  prepopDismissed: boolean;
  setPrepopDismissed: (v: boolean) => void;
  hasPrepopData: boolean;
}) {
  return (
    <div data-ocid="reseller_setup.step1.panel">
      <SectionTitle>Company Profile</SectionTitle>
      <p className="text-sm mb-4" style={{ color: "#7D8AA0" }}>
        Setting up your Reseller workspace
      </p>
      <HelpBox>
        Your Reseller profile is shared with your assigned Vendor and
        Distributor. It helps define your territory, capabilities, and
        operational focus.
      </HelpBox>
      {hasPrepopData && !prepopDismissed && (
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 mb-4"
          style={{
            background: "rgba(255,107,43,0.07)",
            border: "1px solid rgba(255,107,43,0.25)",
          }}
          data-ocid="reseller_setup.prepop_notice.banner"
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
              localStorage.setItem("cf_prepopulation_dismissed", "reseller");
            }}
          >
            <X size={12} style={{ color: "#7D8AA0" }} />
          </button>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <FormField label="Reseller Company Name" required>
          <TextInput
            value={form.companyName}
            onChange={(v) => update("companyName", v)}
            placeholder="e.g. Acme Reseller Group"
            dataOcid="reseller_setup.company_name.input"
          />
        </FormField>
        <FormField label="Primary Industry / Vertical" required>
          <SelectInput
            value={form.industry}
            onChange={(v) => update("industry", v)}
            placeholder="Select your industry"
            options={[
              "Technology",
              "Healthcare",
              "Manufacturing",
              "Financial Services",
              "Telecommunications",
              "Professional Services",
              "Other",
            ]}
            dataOcid="reseller_setup.industry.select"
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Primary Territory / Region" required>
            <SelectInput
              value={form.territory}
              onChange={(v) => update("territory", v)}
              placeholder="Select region"
              options={[
                "North America",
                "EMEA",
                "APAC",
                "LATAM",
                "Multiple Regions",
              ]}
              dataOcid="reseller_setup.territory.select"
            />
          </FormField>
          <FormField label="Company Size" required>
            <SelectInput
              value={form.companySize}
              onChange={(v) => update("companySize", v)}
              placeholder="Select size"
              options={["1-50", "51-200", "201-1000", "1000+"]}
              dataOcid="reseller_setup.company_size.select"
            />
          </FormField>
        </div>
        <FormField
          label="Company Website"
          hint="Optional — publicly visible on your Reseller profile"
        >
          <TextInput
            value={form.websiteUrl}
            onChange={(v) => update("websiteUrl", v)}
            placeholder="https://yourcompany.com"
            type="url"
            dataOcid="reseller_setup.website.input"
          />
        </FormField>
        <FormField
          label="Brief Company Description"
          hint="Optional — max 500 characters. Visible to your Vendor and Distributor."
        >
          <TextAreaInput
            value={form.companyDescription}
            onChange={(v) => update("companyDescription", v)}
            placeholder="Describe your company, specializations, and key markets..."
            maxLength={500}
            dataOcid="reseller_setup.description.textarea"
          />
        </FormField>
      </div>
    </div>
  );
}

// ─── Step 2: Logo & Domain ────────────────────────────────────────────────────
function Step2LogoDomain({
  form,
  update,
  handleLogoFile,
  clearLogo,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  handleLogoFile: (f: File) => void;
  clearLogo: () => void;
}) {
  return (
    <div data-ocid="reseller_setup.step2.panel">
      <SectionTitle>Logo &amp; Domain</SectionTitle>
      <p className="text-sm mb-4" style={{ color: "#7D8AA0" }}>
        Setting up your Reseller workspace
      </p>
      <HelpBox>
        Your workspace domain identifies your Reseller organization on
        CHANNELFORGE. It cannot be changed after setup.
      </HelpBox>
      <div className="flex flex-col gap-6">
        <FormField
          label="Company Logo"
          hint="Optional — PNG, JPG, SVG — max 5 MB"
        >
          <LogoDropZone
            previewUrl={form.logoPreviewUrl}
            onFile={handleLogoFile}
            onClear={clearLogo}
          />
        </FormField>
        <FormField
          label="Workspace Domain"
          required
          hint="This is your permanent workspace identifier on CHANNELFORGE. Choose carefully."
        >
          <TextInput
            value={form.domain}
            onChange={(v) => update("domain", v)}
            placeholder="e.g. acmereseller.channelforge.io"
            dataOcid="reseller_setup.domain.input"
          />
        </FormField>
      </div>
    </div>
  );
}

// ─── Step 3: Admin Setup ──────────────────────────────────────────────────────
function Step3AdminSetup({
  form,
  update,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div data-ocid="reseller_setup.step3.panel">
      <SectionTitle>Reseller Admin Setup</SectionTitle>
      <p className="text-sm mb-4" style={{ color: "#7D8AA0" }}>
        Setting up your Reseller workspace
      </p>
      <HelpBox>
        Your Primary Admin has full control over your Reseller workspace —
        managing customer accounts, users, deal registrations, and notification
        preferences.
      </HelpBox>
      <div className="flex flex-col gap-4">
        <FormField label="Primary Admin Full Name" required>
          <TextInput
            value={form.adminName}
            onChange={(v) => update("adminName", v)}
            placeholder="e.g. Alex Chen"
            dataOcid="reseller_setup.admin_name.input"
          />
        </FormField>
        <FormField label="Admin Email" required>
          <TextInput
            value={form.adminEmail}
            onChange={(v) => update("adminEmail", v)}
            placeholder="alex@yourcompany.com"
            type="email"
            dataOcid="reseller_setup.admin_email.input"
          />
        </FormField>
        <FormField
          label="Admin Phone"
          hint="Optional — used for escalation alerts"
        >
          <TextInput
            value={form.adminPhone}
            onChange={(v) => update("adminPhone", v)}
            placeholder="+1 555 000 0000"
            type="tel"
            dataOcid="reseller_setup.admin_phone.input"
          />
        </FormField>
        <div
          className="rounded-xl p-4"
          style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Role</span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,107,43,0.1)", color: ORANGE }}
            >
              Reseller Primary Admin
            </span>
          </div>
          <p className="text-[11px]" style={{ color: "#4A5568" }}>
            This role is defined by your workspace type and cannot be changed
            here.
          </p>
        </div>
        <Toggle
          checked={form.mfaRequired}
          onChange={(v) => update("mfaRequired", v)}
          label="Require MFA for all admin logins"
          description="Enforce multi-factor authentication for every admin sign-in"
          dataOcid="reseller_setup.mfa.toggle"
        />
      </div>
    </div>
  );
}

// ─── Step 4: Customer Account Setup ──────────────────────────────────────────
function Step4CustomerAccounts({
  form,
  update,
  toggleSegment,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
  toggleSegment: (s: string, c: boolean) => void;
}) {
  const segments = [
    "SMB",
    "Mid-Market",
    "Enterprise",
    "Public Sector",
    "Healthcare",
    "Education",
  ];
  return (
    <div data-ocid="reseller_setup.step4.panel">
      <SectionTitle>Customer Account Configuration</SectionTitle>
      <p className="text-sm mb-4" style={{ color: "#7D8AA0" }}>
        Setting up your Reseller workspace
      </p>
      <HelpBox>
        Configure how you manage your customer accounts. This defines your
        operational scope and account servicing model.
      </HelpBox>
      <div className="flex flex-col gap-5">
        <FormField
          label="Customer Segments"
          required
          hint="Select all that apply"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {segments.map((seg) => (
              <CheckboxOption
                key={seg}
                value={seg}
                checked={form.customerSegments.includes(seg)}
                onChange={toggleSegment}
                label={seg}
                dataOcid={`reseller_setup.segment.${seg.toLowerCase().replace(/ /g, "_")}`}
              />
            ))}
          </div>
        </FormField>
        <FormField label="Estimated Active Customer Accounts" required>
          <SelectInput
            value={form.estimatedAccounts}
            onChange={(v) => update("estimatedAccounts", v)}
            placeholder="Select range"
            options={["1-25", "26-100", "101-500", "500+"]}
            dataOcid="reseller_setup.account_count.select"
          />
        </FormField>
        <FormField label="Account Owner Assignment" required>
          <div className="flex flex-col gap-2">
            {[
              "Single Owner per Account",
              "Shared Account Management",
              "Team-Based Ownership",
            ].map((opt) => (
              <Radio
                key={opt}
                value={opt}
                selected={form.ownershipModel}
                onChange={(v) => update("ownershipModel", v)}
                label={opt}
                dataOcid={`reseller_setup.ownership.${opt.toLowerCase().replace(/ /g, "_")}`}
              />
            ))}
          </div>
        </FormField>
        <FormField
          label="Renewal Management Priority"
          required
          hint="This determines how renewal visibility and alerts are shared across your channel hierarchy."
        >
          <div className="flex flex-col gap-2">
            {[
              "Self-managed renewals",
              "Co-managed with Distributor",
              "Vendor-supported renewals",
            ].map((opt) => (
              <Radio
                key={opt}
                value={opt}
                selected={form.renewalModel}
                onChange={(v) => update("renewalModel", v)}
                label={opt}
                dataOcid={`reseller_setup.renewal.${opt.toLowerCase().replace(/ /g, "_")}`}
              />
            ))}
          </div>
        </FormField>
      </div>
    </div>
  );
}

// ─── Step 5: Vendor & Distributor Visibility ──────────────────────────────────
function Step5VendorDistributor({
  form,
  update,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div data-ocid="reseller_setup.step5.panel">
      <SectionTitle>Assigned Vendor &amp; Distributor Visibility</SectionTitle>
      <p className="text-sm mb-4" style={{ color: "#7D8AA0" }}>
        Setting up your Reseller workspace
      </p>
      <HelpBox>
        Your visibility is determined by your Vendor and Distributor
        assignments. Review your access scope below.
      </HelpBox>
      <div className="flex flex-col gap-4">
        {/* Assigned Vendor card */}
        <div
          className="rounded-xl p-5"
          style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
          data-ocid="reseller_setup.vendor_card"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,107,43,0.1)" }}
            >
              <Briefcase size={14} style={{ color: ORANGE }} />
            </div>
            <span className="text-sm font-semibold text-white">
              Your Assigned Vendor
            </span>
            <Lock size={12} className="ml-auto" style={{ color: "#4A5568" }} />
          </div>
          <p className="text-sm mb-2" style={{ color: "#7D8AA0" }}>
            To be assigned by your Vendor organization
          </p>
          <p className="text-[11px]" style={{ color: "#4A5568" }}>
            Your Vendor manages governance policies, Customer ID formatting, and
            channel-wide notification rules.
          </p>
        </div>

        {/* Assigned Distributor card */}
        <div
          className="rounded-xl p-5"
          style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
          data-ocid="reseller_setup.distributor_card"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,107,43,0.1)" }}
            >
              <Users size={14} style={{ color: ORANGE }} />
            </div>
            <span className="text-sm font-semibold text-white">
              Your Assigned Distributor
            </span>
            <Lock size={12} className="ml-auto" style={{ color: "#4A5568" }} />
          </div>
          <p className="text-sm mb-2" style={{ color: "#7D8AA0" }}>
            To be assigned by your Distributor
          </p>
          <p className="text-[11px]" style={{ color: "#4A5568" }}>
            Your Distributor manages regional policies, MDF activities, and
            Reseller coordination for your territory.
          </p>
        </div>

        {/* Visibility note */}
        <div
          className="rounded-lg p-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${BORDER}`,
          }}
        >
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: "#7D8AA0" }}
          >
            Your Vendor and Distributor can see your customer account activity,
            deal registrations, and renewal pipeline. They cannot modify your
            accounts without your admin approval.
          </p>
        </div>

        {/* Confirmation toggle */}
        <Toggle
          checked={form.visibilityScopeConfirmed}
          onChange={(v) => update("visibilityScopeConfirmed", v)}
          label="I understand my account visibility is governed by my Vendor and Distributor hierarchy"
          dataOcid="reseller_setup.visibility.confirm_toggle"
        />
      </div>
    </div>
  );
}

// ─── Step 6: Notifications & ForgeAI ─────────────────────────────────────────
function Step6Notifications({
  form,
  update,
}: {
  form: FormData;
  update: <K extends keyof FormData>(k: K, v: FormData[K]) => void;
}) {
  return (
    <div data-ocid="reseller_setup.step6.panel">
      <SectionTitle>Notifications &amp; ForgeAI Alerts</SectionTitle>
      <p className="text-sm mb-4" style={{ color: "#7D8AA0" }}>
        Setting up your Reseller workspace
      </p>
      <HelpBox>
        Configure how your team receives alerts for renewals, opportunities,
        deal registrations, and customer engagement.
      </HelpBox>
      <div className="flex flex-col gap-3 mb-6">
        <Toggle
          checked={form.alertRenewalRisk}
          onChange={(v) => update("alertRenewalRisk", v)}
          label="Renewal Risk Alerts"
          description="Notify when customer renewals are approaching expiry or at risk"
          dataOcid="reseller_setup.alert_renewal.toggle"
        />
        <Toggle
          checked={form.alertOpportunity}
          onChange={(v) => update("alertOpportunity", v)}
          label="Opportunity Alerts"
          description="Alert when new opportunities become available from your Vendor"
          dataOcid="reseller_setup.alert_opportunity.toggle"
        />
        <Toggle
          checked={form.alertDealReg}
          onChange={(v) => update("alertDealReg", v)}
          label="Deal Registration Alerts"
          description="Receive status updates on your submitted deal registrations"
          dataOcid="reseller_setup.alert_dealreg.toggle"
        />
        <Toggle
          checked={form.alertEngagement}
          onChange={(v) => update("alertEngagement", v)}
          label="Customer Engagement Alerts"
          description="Alert when customers show reduced engagement or inactivity"
          dataOcid="reseller_setup.alert_engagement.toggle"
        />
        <Toggle
          checked={form.alertForgeAI}
          onChange={(v) => update("alertForgeAI", v)}
          label="ForgeAI Account Recommendations"
          description="Receive proactive ForgeAI recommendations for your customer accounts"
          dataOcid="reseller_setup.alert_forgeai.toggle"
        />
      </div>

      <FormField label="ForgeAI Alert Delivery" required>
        <div className="flex flex-col gap-2 mt-1">
          {[
            "Primary Admin only",
            "Primary + Secondary Admins",
            "All team members",
          ].map((opt) => (
            <Radio
              key={opt}
              value={opt}
              selected={form.alertDelivery}
              onChange={(v) => update("alertDelivery", v)}
              label={opt}
              dataOcid={`reseller_setup.alert_delivery.${opt.toLowerCase().replace(/[ +]/g, "_")}`}
            />
          ))}
        </div>
      </FormField>

      <div className="mt-4">
        <FormField label="Alert Frequency" required>
          <div className="flex flex-col gap-2 mt-1">
            {["Real-time", "Daily Digest", "Weekly Summary"].map((opt) => (
              <Radio
                key={opt}
                value={opt}
                selected={form.alertFrequency}
                onChange={(v) => update("alertFrequency", v)}
                label={opt}
                dataOcid={`reseller_setup.alert_frequency.${opt.toLowerCase().replace(/ /g, "_")}`}
              />
            ))}
          </div>
        </FormField>
      </div>
    </div>
  );
}

// ─── Step 7: Dashboard Preview ────────────────────────────────────────────────
function Step7DashboardPreview({ form }: { form: FormData }) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  const metrics = [
    {
      title: "Expiring Renewals",
      value: "8",
      subtitle: "Expiring within 30 days",
      trend: "↑ 3 from last week",
      accentColor: "#FF6B2B",
      icon: <ZapOff size={14} />,
    },
    {
      title: "Open Opportunities",
      value: "15",
      subtitle: "Active in your pipeline",
      trend: "↑ 4 new this month",
      accentColor: "#4ECB71",
      icon: <TrendingUp size={14} />,
    },
    {
      title: "Deal Registrations",
      value: "6",
      subtitle: "Pending Vendor review",
      trend: "2 expiring in 72h",
      accentColor: ORANGE,
      icon: <Briefcase size={14} />,
    },
    {
      title: "Customer Engagement Gaps",
      value: "5",
      subtitle: "Accounts with no recent activity",
      trend: "Requires attention",
      accentColor: "#EF4444",
      icon: <AlertTriangle size={14} />,
    },
    {
      title: "ForgeAI Recommendations",
      value: "11",
      subtitle: "Account & renewal recommendations",
      trend: "3 high priority",
      accentColor: "#A855F7",
      icon: <Sparkles size={14} />,
    },
    {
      title: "Performance Metrics",
      value: "91%",
      subtitle: "Renewal conversion rate",
      trend: "↑ 4% vs last quarter",
      accentColor: "#4ECB71",
      icon: <BarChart3 size={14} />,
    },
  ];

  return (
    <div data-ocid="reseller_setup.step7.panel">
      <SectionTitle>Your Reseller Dashboard Preview</SectionTitle>
      <p className="text-sm mb-4" style={{ color: "#7D8AA0" }}>
        Setting up your Reseller workspace
      </p>
      <HelpBox>
        Here&apos;s a preview of your CHANNELFORGE Reseller command center. Your
        live data loads after setup.
      </HelpBox>

      {/* Dashboard grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
        data-ocid="reseller_setup.dashboard_preview"
      >
        {metrics.map((m) => (
          <DashboardPreviewCard key={m.title} {...m} />
        ))}
      </div>

      {/* ForgeAI badge */}
      <div
        className="rounded-xl p-4 mb-5 flex items-start gap-3"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(255,107,43,0.05))",
          border: "1px solid rgba(168,85,247,0.2)",
        }}
        data-ocid="reseller_setup.forgeai_badge"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(168,85,247,0.15)" }}
        >
          <Sparkles size={16} style={{ color: "#A855F7" }} />
        </div>
        <div>
          <div className="text-sm font-semibold text-white mb-1">
            ForgeAI Operational Intelligence
          </div>
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: "#7D8AA0" }}
          >
            Monitoring your customer account health, renewal risk, deal
            registration status, and pipeline activity in real time.
          </p>
        </div>
      </div>

      {/* Review Summary accordion */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}
        data-ocid="reseller_setup.review_summary"
      >
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          style={{ background: BG_BASE }}
          data-ocid="reseller_setup.summary_toggle"
        >
          <span>Review Your Setup</span>
          <ChevronRight
            size={14}
            style={{
              color: "#7D8AA0",
              transform: summaryOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </button>
        {summaryOpen && (
          <div
            className="px-5 py-4 flex flex-col gap-2.5"
            style={{ background: BG_MID }}
          >
            {[
              ["Company", form.companyName || "—"],
              ["Domain", form.domain || "—"],
              ["Primary Admin", form.adminName || "—"],
              ["Customer Segments", form.customerSegments.join(", ") || "—"],
              ["Estimated Accounts", form.estimatedAccounts || "—"],
              ["Ownership Model", form.ownershipModel || "—"],
              ["Renewal Model", form.renewalModel || "—"],
              ["Alert Frequency", form.alertFrequency || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: "#4A5568" }}>
                  {label}
                </span>
                <span className="text-[11px] font-medium text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
