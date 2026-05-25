import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadConfig } from "@caffeineai/core-infrastructure";
import { StorageClient } from "@caffeineai/object-storage";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  ImagePlus,
  Loader2,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { CompanyType, UserRole } from "../backend";
import OperationalRegionSelector from "../components/OperationalRegionSelector";
import { useActor } from "../hooks/useActor";
import type { OperationalRegionPreferences } from "../types";

// ── Constants ─────────────────────────────────────────────────────────────────

const ORANGE = "#FF6B2B";
const BG_DEEP = "#07101d";
const BG_BASE = "#0b1724";
const BG_MID = "#111e30";
const BG_CARD = "#131f33";
const BORDER = "#1e3050";
const LS_KEY = "cf-vendor-onboarding";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DistributorEntry {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  region: string;
  tier: string;
}

interface ResellerEntry {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  distributorId: string;
  region: string;
  tier: string;
}

interface VendorFormData {
  companyName: string;
  industry: string;
  hqRegion: string;
  companySize: string;
  website: string;
  description: string;
  logoKey: string;
  logoPreviewUrl: string;
  domain: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  requireMFA: boolean;
  distributors: DistributorEntry[];
  resellers: ResellerEntry[];
  customerIdFormat: string;
  ownershipStructure: string;
  accountVisibility: string;
  notifRenewal: boolean;
  notifEngagement: boolean;
  notifDistributor: boolean;
  notifDealReg: boolean;
  notifForgeAI: boolean;
  forgeAIFrequency: string;
  escalationRecipient: string;
}

const DEFAULT_DATA: VendorFormData = {
  companyName: "",
  industry: "",
  hqRegion: "",
  companySize: "",
  website: "",
  description: "",
  logoKey: "",
  logoPreviewUrl: "",
  domain: "",
  adminName: "",
  adminEmail: "",
  adminPhone: "",
  requireMFA: false,
  distributors: [],
  resellers: [],
  customerIdFormat: "",
  ownershipStructure: "vendor",
  accountVisibility: "full",
  notifRenewal: true,
  notifEngagement: true,
  notifDistributor: true,
  notifDealReg: true,
  notifForgeAI: true,
  forgeAIFrequency: "realtime",
  escalationRecipient: "Primary Admin only",
};

const STEPS = [
  { num: 1, title: "Company Profile", desc: "Organization details" },
  { num: 2, title: "Logo & Domain", desc: "Branding & workspace ID" },
  { num: 3, title: "Admin Setup", desc: "Primary administrator" },
  { num: 4, title: "Distributor Network", desc: "Channel structure" },
  { num: 5, title: "Reseller Network", desc: "Channel hierarchy" },
  { num: 6, title: "Customer Governance", desc: "ID format & visibility" },
  { num: 7, title: "Notifications & ForgeAI", desc: "Alerts & intelligence" },
  {
    num: 8,
    title: "Infrastructure Preferences",
    desc: "Select your operational region",
  },
  { num: 9, title: "Dashboard Preview", desc: "Review & complete" },
];

// ── Atoms ─────────────────────────────────────────────────────────────────────

function FieldGroup({
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
    <div className="wizard-form-field">
      <Label className="wizard-form-label">
        {label}
        {required && <span className="wizard-form-required ml-1">*</span>}
      </Label>
      {children}
      {hint && <p className="wizard-form-hint mt-1">{hint}</p>}
    </div>
  );
}

function WizardSelect({
  value,
  onChange,
  options,
  placeholder,
  dataOcid,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  dataOcid?: string;
}) {
  return (
    <select
      data-ocid={dataOcid}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="wiz-select"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 flex-shrink-0"
      style={{ background: checked ? ORANGE : BORDER }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ml-1"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="flex items-start gap-3 rounded-lg px-4 py-3 text-left transition-all duration-150"
          style={{
            background: value === opt.value ? "rgba(255,107,43,0.08)" : BG_BASE,
            border: `1px solid ${value === opt.value ? "rgba(255,107,43,0.4)" : BORDER}`,
          }}
        >
          <div
            className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
            style={{
              border: `2px solid ${value === opt.value ? ORANGE : "#3a4a60"}`,
            }}
          >
            {value === opt.value && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: ORANGE }}
              />
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{opt.label}</div>
            {opt.desc && (
              <div className="text-xs mt-0.5" style={{ color: "#5a6a80" }}>
                {opt.desc}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function WizardSidebar({ currentStep }: { currentStep: number }) {
  const progress = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);
  return (
    <aside
      className="wiz-sidebar"
      style={{ background: BG_MID }}
      data-ocid="vendor-onboarding.sidebar"
    >
      <div className="flex items-center gap-2.5 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #FF6B2B, #e0531a)" }}
        >
          <span className="font-black text-white text-[12px] tracking-tight">
            CF
          </span>
        </div>
        <div>
          <div
            className="font-black text-white text-[13px] leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            CHANNELFORGE
          </div>
          <div className="text-[9px] text-white/30 tracking-[0.15em] uppercase">
            CRM Platform
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 mb-8"
        style={{
          background: "rgba(255,107,43,0.1)",
          border: "1px solid rgba(255,107,43,0.2)",
        }}
      >
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: ORANGE }}
        />
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ORANGE }}
        >
          Vendor Workspace
        </span>
      </div>

      <div className="mb-6">
        <div
          className="h-[3px] rounded-full overflow-hidden mb-2"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: ORANGE }}
          />
        </div>
        <div className="text-[10px] font-mono" style={{ color: "#4a5568" }}>
          Step {currentStep} of {STEPS.length} — {progress}% complete
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {STEPS.map((s) => {
          const done = s.num < currentStep;
          const active = s.num === currentStep;
          return (
            <div
              key={s.num}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150"
              style={{
                background: active ? "rgba(255,107,43,0.08)" : "transparent",
                border: active
                  ? "1px solid rgba(255,107,43,0.15)"
                  : "1px solid transparent",
              }}
              data-ocid={`vendor-onboarding.step_${s.num}.nav_item`}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{
                  background: done
                    ? "rgba(34,197,94,0.2)"
                    : active
                      ? ORANGE
                      : "#1a2840",
                  color: done ? "#22c55e" : active ? "white" : "#3a4a60",
                  boxShadow: active ? "0 0 10px rgba(255,107,43,0.3)" : "none",
                }}
              >
                {done ? <Check size={11} /> : s.num}
              </div>
              <div className="min-w-0">
                <div
                  className="text-xs font-semibold truncate"
                  style={{
                    color: active ? ORANGE : done ? "#7D8AA0" : "#4a5568",
                  }}
                >
                  {s.title}
                </div>
                <div
                  className="text-[9px] leading-tight mt-0.5"
                  style={{ color: "#2a3a50" }}
                >
                  {s.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-6 pt-4 text-[10px]"
        style={{ color: "#2a3a50", borderTop: `1px solid ${BORDER}` }}
      >
        Forge partner pipeline into revenue.
      </div>
    </aside>
  );
}

// ── Step header ───────────────────────────────────────────────────────────────

function StepHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8 pb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div
        className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-2"
        style={{ color: ORANGE }}
      >
        Setting up your Vendor workspace
      </div>
      <h2
        className="text-2xl font-bold text-white mb-2"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {title}
      </h2>
      <p className="text-sm" style={{ color: "#7D8AA0" }}>
        {desc}
      </p>
    </div>
  );
}

// ── Step 1: Company Profile ───────────────────────────────────────────────────

function Step1Panel({
  data,
  update,
  prepopDismissed,
  setPrepopDismissed,
  hasPrepopData,
}: {
  data: VendorFormData;
  update: (k: keyof VendorFormData, v: unknown) => void;
  prepopDismissed: boolean;
  setPrepopDismissed: (v: boolean) => void;
  hasPrepopData: boolean;
}) {
  return (
    <div data-ocid="vendor-onboarding.step1.panel">
      <StepHeader
        title="Company Profile"
        desc="Your company profile identifies your organization across the channel ecosystem and appears to Distributors and Resellers you work with."
      />
      {hasPrepopData && !prepopDismissed && (
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 mb-5"
          style={{
            background: "rgba(255,107,43,0.07)",
            border: "1px solid rgba(255,107,43,0.25)",
          }}
          data-ocid="vendor-onboarding.prepop_notice.banner"
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
              localStorage.setItem("cf_prepopulation_dismissed", "vendor");
            }}
          >
            <X size={12} style={{ color: "#7D8AA0" }} />
          </button>
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Company Name" required>
            <Input
              data-ocid="vendor-onboarding.company_name.input"
              placeholder="e.g. Acme Software"
              value={data.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              className="crm-input w-full"
            />
          </FieldGroup>
          <FieldGroup label="Industry / Vertical" required>
            <WizardSelect
              dataOcid="vendor-onboarding.industry.select"
              value={data.industry}
              onChange={(v) => update("industry", v)}
              placeholder="Select industry"
              options={[
                "Technology",
                "Healthcare",
                "Manufacturing",
                "Financial Services",
                "Telecommunications",
                "Professional Services",
                "Other",
              ]}
            />
          </FieldGroup>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Headquarters Region" required>
            <WizardSelect
              dataOcid="vendor-onboarding.hq_region.select"
              value={data.hqRegion}
              onChange={(v) => update("hqRegion", v)}
              placeholder="Select region"
              options={["North America", "EMEA", "APAC", "LATAM", "Global"]}
            />
          </FieldGroup>
          <FieldGroup label="Company Size" required>
            <WizardSelect
              dataOcid="vendor-onboarding.company_size.select"
              value={data.companySize}
              onChange={(v) => update("companySize", v)}
              placeholder="Select size"
              options={["1-50", "51-200", "201-1000", "1000+"]}
            />
          </FieldGroup>
        </div>
        <FieldGroup label="Company Website">
          <div className="flex items-center gap-2">
            <Globe
              size={14}
              style={{ color: "#4a5568" }}
              className="flex-shrink-0"
            />
            <Input
              data-ocid="vendor-onboarding.website.input"
              placeholder="https://yourcompany.com"
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
              className="crm-input flex-1"
            />
          </div>
        </FieldGroup>
        <FieldGroup
          label="Company Description"
          hint="Optional, max 500 characters"
        >
          <textarea
            data-ocid="vendor-onboarding.description.textarea"
            placeholder="Brief description of your company and what you do..."
            value={data.description}
            onChange={(e) =>
              update("description", e.target.value.slice(0, 500))
            }
            rows={3}
            className="field-textarea w-full"
            style={{ background: BG_BASE, resize: "none" }}
          />
          <div className="text-right text-[10px]" style={{ color: "#3a4a60" }}>
            {data.description.length}/500
          </div>
        </FieldGroup>
      </div>
    </div>
  );
}

// ── Step 2: Logo & Domain ─────────────────────────────────────────────────────

function Step2Panel({
  data,
  update,
}: {
  data: VendorFormData;
  update: (k: keyof VendorFormData, v: unknown) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadLogo(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a PNG, JPG, or SVG image.");
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

  return (
    <div data-ocid="vendor-onboarding.step2.panel">
      <StepHeader
        title="Logo & Domain"
        desc="Upload your company logo and claim your workspace domain. Your domain cannot be changed after setup."
      />
      <div className="flex flex-col gap-5">
        {/* Logo */}
        {data.logoKey ? (
          <div
            className="flex items-center gap-4 rounded-xl p-4"
            style={{
              background: "rgba(34,197,94,0.06)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div
              className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
              style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
            >
              <img
                src={data.logoPreviewUrl}
                alt="Logo preview"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="flex-1">
              <div
                className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#22c55e" }}
              >
                <CheckCircle2 size={14} /> Logo uploaded
              </div>
              <p className="text-xs mt-1" style={{ color: "#5a6a80" }}>
                Visible to all workspace users and channel partners.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-ocid="vendor-onboarding.logo.replace_button"
              onClick={() => fileRef.current?.click()}
              className="gap-1.5 text-xs"
              style={{ color: "#7D8AA0" }}
            >
              <RefreshCw size={11} /> Replace
            </Button>
          </div>
        ) : (
          <button
            type="button"
            data-ocid="vendor-onboarding.logo.dropzone"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) uploadLogo(f);
            }}
            disabled={uploading}
            className="w-full rounded-xl flex flex-col items-center justify-center gap-3 py-10 transition-all duration-200"
            style={{
              background: dragging ? "rgba(255,107,43,0.06)" : BG_BASE,
              border: `2px dashed ${dragging ? ORANGE : BORDER}`,
            }}
          >
            {uploading ? (
              <>
                <Loader2
                  size={24}
                  className="animate-spin"
                  style={{ color: ORANGE }}
                />
                <div className="text-sm text-white">
                  Uploading… {uploadProgress}%
                </div>
                <div
                  className="w-40 h-1 rounded-full overflow-hidden"
                  style={{ background: BORDER }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${uploadProgress}%`,
                      background: ORANGE,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,107,43,0.08)",
                    border: "1px solid rgba(255,107,43,0.2)",
                  }}
                >
                  <ImagePlus size={22} style={{ color: ORANGE }} />
                </div>
                <div className="text-sm font-medium text-white">
                  <span style={{ color: ORANGE }}>Click to upload</span> or drag
                  and drop
                </div>
                <div className="text-xs" style={{ color: "#3a4a60" }}>
                  PNG, JPG, SVG · Max 5 MB
                </div>
              </>
            )}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) uploadLogo(e.target.files[0]);
          }}
          data-ocid="vendor-onboarding.logo.upload_button"
        />
        {uploadError && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
            }}
            data-ocid="vendor-onboarding.logo.error_state"
          >
            <AlertTriangle size={12} />
            <span className="flex-1">{uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError("")}
              aria-label="Dismiss error"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Domain */}
        <FieldGroup
          label="Workspace Domain"
          required
          hint="Your workspace domain is used for unique identification across the platform. It cannot be changed after setup."
        >
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <span
              className="px-3 py-2.5 text-sm border-r"
              style={{
                color: "#5a6a80",
                borderColor: BORDER,
                background: BG_DEEP,
              }}
            >
              https://
            </span>
            <Input
              data-ocid="vendor-onboarding.domain.input"
              placeholder="acmecorp.channelforge.io"
              value={data.domain}
              onChange={(e) =>
                update(
                  "domain",
                  e.target.value.toLowerCase().replace(/\s/g, ""),
                )
              }
              className="crm-input border-0 flex-1"
              style={{ borderRadius: 0 }}
            />
          </div>
        </FieldGroup>

        {!data.logoKey && (
          <p className="text-xs text-center" style={{ color: "#3a4a60" }}>
            Logo upload is optional — you can continue without one and add it
            later in Admin Settings.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Step 3: Admin Setup ───────────────────────────────────────────────────────

function Step3Panel({
  data,
  update,
}: {
  data: VendorFormData;
  update: (k: keyof VendorFormData, v: unknown) => void;
}) {
  return (
    <div data-ocid="vendor-onboarding.step3.panel">
      <StepHeader
        title="Admin Setup"
        desc="The Primary Admin has full control over workspace settings, users, permissions, and notification rules."
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Full Name" required>
            <Input
              data-ocid="vendor-onboarding.admin_name.input"
              placeholder="e.g. Jordan Smith"
              value={data.adminName}
              onChange={(e) => update("adminName", e.target.value)}
              className="crm-input w-full"
            />
          </FieldGroup>
          <FieldGroup label="Work Email" required>
            <Input
              data-ocid="vendor-onboarding.admin_email.input"
              type="email"
              placeholder="jordan@yourcompany.com"
              value={data.adminEmail}
              onChange={(e) => update("adminEmail", e.target.value)}
              className="crm-input w-full"
            />
          </FieldGroup>
        </div>
        <FieldGroup label="Phone Number" hint="Optional">
          <Input
            data-ocid="vendor-onboarding.admin_phone.input"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={data.adminPhone}
            onChange={(e) => update("adminPhone", e.target.value)}
            className="crm-input w-full"
          />
        </FieldGroup>
        <div
          className="flex items-start justify-between gap-4 rounded-xl px-4 py-4"
          style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
        >
          <div>
            <div className="text-sm font-semibold text-white">
              Require MFA for all admin logins
            </div>
            <div className="text-xs mt-1" style={{ color: "#5a6a80" }}>
              Enforce multi-factor authentication for all admin accounts in this
              workspace.
            </div>
          </div>
          <Toggle
            id="mfa-toggle"
            checked={data.requireMFA}
            onChange={(v) => update("requireMFA", v)}
          />
        </div>
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background: "rgba(255,107,43,0.04)",
            border: "1px solid rgba(255,107,43,0.1)",
          }}
        >
          <div className="text-xs font-semibold mb-2" style={{ color: ORANGE }}>
            Primary Admin permissions
          </div>
          {[
            "Full workspace configuration",
            "User & permission management",
            "Notification governance",
            "ForgeAI settings control",
            "Distributor & Reseller management",
          ].map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 text-xs py-1"
              style={{ color: "#7D8AA0" }}
            >
              <Check size={11} style={{ color: ORANGE }} />
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Distributor Network ───────────────────────────────────────────────

function Step4Panel({
  data,
  update,
}: {
  data: VendorFormData;
  update: (k: keyof VendorFormData, v: unknown) => void;
}) {
  function addDist() {
    const entry: DistributorEntry = {
      id: crypto.randomUUID(),
      name: "",
      contactName: "",
      contactEmail: "",
      region: "North America",
      tier: "Silver",
    };
    update("distributors", [...data.distributors, entry]);
  }
  function removeDist(id: string) {
    update(
      "distributors",
      data.distributors.filter((d) => d.id !== id),
    );
  }
  function updateDist(id: string, field: keyof DistributorEntry, val: string) {
    update(
      "distributors",
      data.distributors.map((d) => (d.id === id ? { ...d, [field]: val } : d)),
    );
  }

  return (
    <div data-ocid="vendor-onboarding.step4.panel">
      <StepHeader
        title="Set Up Your Distributor Network"
        desc="Add your Distributors to define your channel structure. You can add more Distributors after setup."
      />
      <div className="flex flex-col gap-4">
        {data.distributors.map((d, i) => (
          <div
            key={d.id}
            className="rounded-xl p-4 space-y-3"
            style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
            data-ocid={`vendor-onboarding.distributor.item.${i + 1}`}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: ORANGE }}
              >
                Distributor {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeDist(d.id)}
                data-ocid={`vendor-onboarding.distributor.delete_button.${i + 1}`}
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Remove distributor"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Distributor Name *</Label>
                <Input
                  placeholder="e.g. Global Distribution Co."
                  value={d.name}
                  onChange={(e) => updateDist(d.id, "name", e.target.value)}
                  className="crm-input w-full"
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Contact Name *</Label>
                <Input
                  placeholder="e.g. Sarah Mitchell"
                  value={d.contactName}
                  onChange={(e) =>
                    updateDist(d.id, "contactName", e.target.value)
                  }
                  className="crm-input w-full"
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Contact Email *</Label>
                <Input
                  type="email"
                  placeholder="contact@distributor.com"
                  value={d.contactEmail}
                  onChange={(e) =>
                    updateDist(d.id, "contactEmail", e.target.value)
                  }
                  className="crm-input w-full"
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Territory / Region</Label>
                <WizardSelect
                  value={d.region}
                  onChange={(v) => updateDist(d.id, "region", v)}
                  options={[
                    "North America",
                    "EMEA",
                    "APAC",
                    "LATAM",
                    "Global",
                    "Multiple",
                  ]}
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Partner Tier</Label>
                <WizardSelect
                  value={d.tier}
                  onChange={(v) => updateDist(d.id, "tier", v)}
                  options={["Silver", "Gold", "Platinum"]}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          data-ocid="vendor-onboarding.distributor.add_button"
          onClick={addDist}
          className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-80"
          style={{
            background: "rgba(255,107,43,0.06)",
            border: `1px dashed ${BORDER}`,
            color: ORANGE,
          }}
        >
          + Add Distributor
        </button>
        {data.distributors.length === 0 && (
          <p className="text-xs text-center" style={{ color: "#3a4a60" }}>
            This step is optional. You can add Distributors later in your
            workspace settings.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Step 5: Reseller Network ──────────────────────────────────────────────────

function Step5Panel({
  data,
  update,
}: {
  data: VendorFormData;
  update: (k: keyof VendorFormData, v: unknown) => void;
}) {
  function addRes() {
    const entry: ResellerEntry = {
      id: crypto.randomUUID(),
      name: "",
      contactName: "",
      contactEmail: "",
      distributorId: "",
      region: "North America",
      tier: "Silver",
    };
    update("resellers", [...data.resellers, entry]);
  }
  function removeRes(id: string) {
    update(
      "resellers",
      data.resellers.filter((r) => r.id !== id),
    );
  }
  function updateRes(id: string, field: keyof ResellerEntry, val: string) {
    update(
      "resellers",
      data.resellers.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    );
  }
  const distOptions = [
    "Unassigned",
    ...data.distributors.filter((d) => d.name).map((d) => d.name),
  ];

  return (
    <div data-ocid="vendor-onboarding.step5.panel">
      <StepHeader
        title="Configure Your Reseller Network"
        desc="Add your Resellers to complete your channel hierarchy. Resellers will be managed through the assigned Distributor."
      />
      <div className="flex flex-col gap-4">
        {data.resellers.map((r, i) => (
          <div
            key={r.id}
            className="rounded-xl p-4 space-y-3"
            style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
            data-ocid={`vendor-onboarding.reseller.item.${i + 1}`}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: ORANGE }}
              >
                Reseller {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeRes(r.id)}
                data-ocid={`vendor-onboarding.reseller.delete_button.${i + 1}`}
                className="text-red-400 hover:text-red-300 transition-colors"
                aria-label="Remove reseller"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Reseller Name *</Label>
                <Input
                  placeholder="e.g. Pinnacle Tech Solutions"
                  value={r.name}
                  onChange={(e) => updateRes(r.id, "name", e.target.value)}
                  className="crm-input w-full"
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Contact Name *</Label>
                <Input
                  placeholder="e.g. James Hartley"
                  value={r.contactName}
                  onChange={(e) =>
                    updateRes(r.id, "contactName", e.target.value)
                  }
                  className="crm-input w-full"
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Contact Email *</Label>
                <Input
                  type="email"
                  placeholder="contact@reseller.com"
                  value={r.contactEmail}
                  onChange={(e) =>
                    updateRes(r.id, "contactEmail", e.target.value)
                  }
                  className="crm-input w-full"
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">
                  Assigned Distributor
                </Label>
                <WizardSelect
                  value={r.distributorId || "Unassigned"}
                  onChange={(v) =>
                    updateRes(
                      r.id,
                      "distributorId",
                      v === "Unassigned" ? "" : v,
                    )
                  }
                  options={distOptions}
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Territory / Region</Label>
                <WizardSelect
                  value={r.region}
                  onChange={(v) => updateRes(r.id, "region", v)}
                  options={[
                    "North America",
                    "EMEA",
                    "APAC",
                    "LATAM",
                    "Global",
                    "Multiple",
                  ]}
                />
              </div>
              <div className="wizard-form-field">
                <Label className="wizard-form-label">Partner Tier</Label>
                <WizardSelect
                  value={r.tier}
                  onChange={(v) => updateRes(r.id, "tier", v)}
                  options={["Silver", "Gold", "Platinum"]}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          data-ocid="vendor-onboarding.reseller.add_button"
          onClick={addRes}
          className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 hover:opacity-80"
          style={{
            background: "rgba(255,107,43,0.06)",
            border: `1px dashed ${BORDER}`,
            color: ORANGE,
          }}
        >
          + Add Reseller
        </button>
        {data.resellers.length === 0 && (
          <p className="text-xs text-center" style={{ color: "#3a4a60" }}>
            This step is optional. You can add Resellers later in your workspace
            settings.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Step 6: Customer Governance ───────────────────────────────────────────────

function Step6Panel({
  data,
  update,
}: {
  data: VendorFormData;
  update: (k: keyof VendorFormData, v: unknown) => void;
}) {
  const preview = data.customerIdFormat
    ? data.customerIdFormat
        .replace("{REGION}", "EMEA")
        .replace("{NUMBER}", "000145")
        .replace("{number}", "000145")
        .replace("{region}", "EMEA")
    : "CUST-EMEA-000145";

  return (
    <div data-ocid="vendor-onboarding.step6.panel">
      <StepHeader
        title="Customer ID & Governance"
        desc="Define how Customer IDs are formatted across your channel ecosystem. This format applies to all Distributors and Resellers."
      />
      <div className="flex flex-col gap-6">
        <FieldGroup
          label="Customer ID Format"
          hint="Use {REGION} and {NUMBER} as placeholders. e.g. CUST-{REGION}-{NUMBER}"
        >
          <Input
            data-ocid="vendor-onboarding.customer_id_format.input"
            placeholder="e.g. CUST-{REGION}-{NUMBER}"
            value={data.customerIdFormat}
            onChange={(e) => update("customerIdFormat", e.target.value)}
            className="crm-input w-full font-mono"
          />
        </FieldGroup>

        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3"
          style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
        >
          <span className="text-xs" style={{ color: "#4a5568" }}>
            Preview:
          </span>
          <span
            className="font-mono font-bold text-sm"
            style={{ color: ORANGE }}
          >
            {preview}
          </span>
        </div>

        <div>
          <div className="wizard-form-label mb-3">
            Customer Ownership Structure
          </div>
          <RadioGroup
            value={data.ownershipStructure}
            onChange={(v) => update("ownershipStructure", v)}
            options={[
              {
                value: "vendor",
                label: "Vendor-managed",
                desc: "Vendor owns all customer accounts directly",
              },
              {
                value: "distributor",
                label: "Distributor-managed",
                desc: "Distributors manage their regional customer accounts",
              },
              {
                value: "reseller",
                label: "Reseller-managed",
                desc: "Resellers own their customer relationships",
              },
            ]}
          />
        </div>

        <div>
          <div className="wizard-form-label mb-1">Account Visibility</div>
          <p className="text-xs mb-3" style={{ color: "#5a6a80" }}>
            Controls how much detail Distributors and Resellers see about
            accounts you manage directly.
          </p>
          <RadioGroup
            value={data.accountVisibility}
            onChange={(v) => update("accountVisibility", v)}
            options={[
              {
                value: "full",
                label: "Full hierarchy",
                desc: "All tiers see complete account detail",
              },
              {
                value: "partial-full",
                label: "Partial — Vendors see all",
                desc: "Vendors see everything; Distributors and Resellers see limited detail",
              },
              {
                value: "partial-summary",
                label: "Partial — Vendors see summary only",
                desc: "Vendor-managed accounts show summary view to all downstream partners",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 7: Notifications & ForgeAI ──────────────────────────────────────────

function Step7Panel({
  data,
  update,
}: {
  data: VendorFormData;
  update: (k: keyof VendorFormData, v: unknown) => void;
}) {
  const toggleItems: {
    key: keyof VendorFormData;
    label: string;
    help: string;
  }[] = [
    {
      key: "notifRenewal",
      label: "Renewal risk alerts",
      help: "Alert your team when high-risk renewals are detected",
    },
    {
      key: "notifEngagement",
      label: "Reseller engagement gap alerts",
      help: "Notify when a Reseller has not engaged with a customer account",
    },
    {
      key: "notifDistributor",
      label: "Distributor performance alerts",
      help: "Alert when Distributor activity drops below threshold",
    },
    {
      key: "notifDealReg",
      label: "Deal registration alerts",
      help: "Notify on pending, stalled, or conflicting deal registrations",
    },
    {
      key: "notifForgeAI",
      label: "ForgeAI recommendations",
      help: "Receive proactive channel intelligence and next-best-action guidance",
    },
  ];

  return (
    <div data-ocid="vendor-onboarding.step7.panel">
      <StepHeader
        title="Notifications & ForgeAI Intelligence"
        desc="Configure how your team receives operational alerts and ForgeAI intelligence recommendations."
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {toggleItems.map((t) => (
            <div
              key={String(t.key)}
              className="flex items-start justify-between gap-4 rounded-xl px-4 py-3"
              style={{ background: BG_BASE, border: `1px solid ${BORDER}` }}
            >
              <div>
                <div className="text-sm font-semibold text-white">
                  {t.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#5a6a80" }}>
                  {t.help}
                </div>
              </div>
              <Toggle
                id={`toggle-${String(t.key)}`}
                checked={data[t.key] as boolean}
                onChange={(v) => update(t.key, v)}
              />
            </div>
          ))}
        </div>

        <div>
          <div className="wizard-form-label mb-3">
            ForgeAI delivery frequency
          </div>
          <RadioGroup
            value={data.forgeAIFrequency}
            onChange={(v) => update("forgeAIFrequency", v)}
            options={[
              {
                value: "realtime",
                label: "Real-time",
                desc: "Alerts delivered immediately as events are detected",
              },
              {
                value: "daily",
                label: "Daily Digest",
                desc: "Consolidated report of all ForgeAI alerts once per day",
              },
              {
                value: "weekly",
                label: "Weekly Summary",
                desc: "Weekly roll-up of channel intelligence and recommendations",
              },
            ]}
          />
        </div>

        <FieldGroup label="Escalation recipient">
          <WizardSelect
            dataOcid="vendor-onboarding.escalation.select"
            value={data.escalationRecipient}
            onChange={(v) => update("escalationRecipient", v)}
            options={[
              "Primary Admin only",
              "Primary + Secondary Admins",
              "All Admins",
            ]}
          />
        </FieldGroup>
      </div>
    </div>
  );
}

// ── Step 8: Dashboard Preview ─────────────────────────────────────────────────

function Step8Panel({
  data,
  submitting,
  onComplete,
}: {
  data: VendorFormData;
  submitting: boolean;
  onComplete: () => void;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);

  const metrics = [
    {
      title: "High-Risk Renewals",
      value: "12",
      sub: "Require immediate action",
      trend: "\u2191 3 from last week",
      accent: "#ef4444",
    },
    {
      title: "Distributor Performance",
      value: "87%",
      sub: "Active distributors on target",
      trend: "\u2193 2% vs last month",
      accent: "#22c55e",
    },
    {
      title: "Reseller Engagement",
      value: "64%",
      sub: "Resellers active this month",
      trend: "\u2191 8% vs last month",
      accent: "#3b82f6",
    },
    {
      title: "Deal Registrations",
      value: "34",
      sub: "Pending approvals",
      trend: "5 expiring today",
      accent: ORANGE,
    },
    {
      title: "ForgeAI Insights",
      value: "9",
      sub: "Active recommendations",
      trend: "3 critical, 6 advisory",
      accent: "#a855f7",
    },
    {
      title: "Channel Health Score",
      value: "72/100",
      sub: "Ecosystem health rating",
      trend: "Score improving",
      accent: "#22c55e",
    },
  ];

  const summaryRows = [
    { label: "Company", value: data.companyName || "\u2014" },
    { label: "Domain", value: data.domain || "\u2014" },
    { label: "Primary Admin", value: data.adminName || "\u2014" },
    { label: "Distributors added", value: String(data.distributors.length) },
    { label: "Resellers added", value: String(data.resellers.length) },
    {
      label: "Customer ID Format",
      value: data.customerIdFormat || "Not configured",
    },
    { label: "ForgeAI Frequency", value: data.forgeAIFrequency },
  ];

  return (
    <div data-ocid="vendor-onboarding.step8.panel">
      <StepHeader
        title="Your Vendor Dashboard Preview"
        desc="Here's a preview of your CHANNELFORGE Vendor command center. Your live dashboard will populate with real data after setup is complete."
      />
      <div className="flex flex-col gap-6">
        {/* 6-metric grid */}
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <div
              key={m.title}
              className="wizard-dashboard-preview"
              data-ocid={`vendor-onboarding.dashboard_preview.item.${i + 1}`}
            >
              <div className="wizard-dashboard-metric-title">{m.title}</div>
              <div
                className="wizard-dashboard-metric-value"
                style={{ color: m.accent }}
              >
                {m.value}
              </div>
              <div className="wizard-dashboard-metric-label">{m.sub}</div>
              <div
                className="text-xs font-mono"
                style={{ color: m.accent, opacity: 0.7 }}
              >
                {m.trend}
              </div>
            </div>
          ))}
        </div>

        {/* ForgeAI badge */}
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            background: "rgba(168,85,247,0.06)",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
          data-ocid="vendor-onboarding.forgeai_badge"
        >
          <Brain
            size={18}
            style={{ color: "#a855f7" }}
            className="flex-shrink-0 mt-0.5"
          />
          <div>
            <div
              className="text-sm font-bold mb-1"
              style={{ color: "#a855f7" }}
            >
              ForgeAI Operational Intelligence
            </div>
            <div className="text-xs" style={{ color: "#7D8AA0" }}>
              AI-powered renewal risk detection, reseller engagement monitoring,
              deal registration intelligence, and channel health scoring —
              active from day one.
            </div>
          </div>
        </div>

        {/* Collapsible review summary */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <button
            type="button"
            data-ocid="vendor-onboarding.review_summary.toggle"
            onClick={() => setReviewOpen(!reviewOpen)}
            className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150"
            style={{ background: BG_BASE }}
          >
            <span className="text-sm font-semibold text-white">
              Review Setup Summary
            </span>
            <ChevronRight
              size={16}
              style={{
                color: "#5a6a80",
                transform: reviewOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.15s",
              }}
            />
          </button>
          {reviewOpen && (
            <div className="px-4 pb-4" style={{ background: BG_DEEP }}>
              <div className="divide-y" style={{ borderColor: BORDER }}>
                {summaryRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-xs" style={{ color: "#5a6a80" }}>
                      {row.label}
                    </span>
                    <span className="text-xs font-medium text-white">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Complete setup button (full width, on page) */}
        <button
          type="button"
          data-ocid="vendor-onboarding.complete_setup.button"
          onClick={onComplete}
          disabled={submitting}
          className="w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-60"
          style={{
            background: ORANGE,
            color: "white",
            boxShadow: "0 0 24px rgba(255,107,43,0.3)",
          }}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Creating Vendor
              Workspace…
            </>
          ) : (
            "Complete Setup & Launch Workspace"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Success overlay ───────────────────────────────────────────────────────────

function SuccessOverlay({ onGo }: { onGo: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(7,16,29,0.95)", backdropFilter: "blur(12px)" }}
      data-ocid="vendor-onboarding.success.dialog"
    >
      <div
        className="flex flex-col items-center text-center rounded-2xl p-12"
        style={{
          maxWidth: "480px",
          background: BG_CARD,
          border: "1px solid rgba(255,107,43,0.25)",
          boxShadow: "0 0 60px rgba(255,107,43,0.15)",
        }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "2px solid rgba(34,197,94,0.3)",
          }}
        >
          <CheckCircle2 size={36} style={{ color: "#22c55e" }} />
        </div>
        <h2
          className="text-2xl font-black text-white mb-3"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          Vendor Workspace Created
        </h2>
        <p className="text-sm mb-8" style={{ color: "#7D8AA0" }}>
          Your CHANNELFORGE Vendor workspace is ready. ForgeAI is active and
          monitoring your channel ecosystem.
        </p>
        <button
          type="button"
          data-ocid="vendor-onboarding.success.go_to_dashboard.button"
          onClick={onGo}
          className="px-8 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
          style={{
            background: ORANGE,
            boxShadow: "0 0 20px rgba(255,107,43,0.3)",
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const navigate = useNavigate();
  const { actor } = useActor();

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

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
  // In test mode we show amber warnings but never block progression.
  const [warnDismissed, setWarnDismissed] = useState(false);

  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const [prepopDismissed, setPrepopDismissed] = useState(
    () => localStorage.getItem("cf_prepopulation_dismissed") === "vendor",
  );

  const [data, setData] = useState<VendorFormData>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      const base: VendorFormData = saved
        ? { ...DEFAULT_DATA, ...JSON.parse(saved) }
        : { ...DEFAULT_DATA };
      // Pre-populate empty fields from subscription profile
      if (
        !localStorage.getItem("cf_prepopulation_dismissed")?.includes("vendor")
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
            if (!base.hqRegion && sub.regions?.length > 0)
              base.hqRegion = sub.regions[0];
          }
        } catch {
          /* ignore */
        }
      }
      return base;
    } catch {
      /* ignore */
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

  const update = useCallback((k: keyof VendorFormData, v: unknown) => {
    setData((prev) => {
      const next = { ...prev, [k]: v };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync on mount
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset warning on step change
  useEffect(() => {
    setWarnDismissed(false);
  }, [step]);

  // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
  // Currently showing amber warnings only — the Next button is NEVER disabled in test mode.
  // Original blocking logic is preserved below as comments for easy reinstatement.
  // biome-ignore lint/correctness/noUnusedVariables: TODO-SECURITY preserved for live reinstatement
  function canAdvance(): boolean {
    // TEST MODE: always allow advancing regardless of field state
    return true;
    // LIVE MODE (re-enable by removing the `return true` above and uncommenting below):
    // if (step === 1)
    //   return (
    //     !!data.companyName &&
    //     !!data.industry &&
    //     !!data.hqRegion &&
    //     !!data.companySize
    //   );
    // if (step === 2) return !!data.domain;
    // if (step === 3)
    //   return (
    //     !!data.adminName && !!data.adminEmail && data.adminEmail.includes("@")
    //   );
    // return true;
  }

  // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
  // Returns which fields are incomplete for the current step — used for soft amber warnings.
  function getMissingFields(): string[] {
    const missing: string[] = [];
    if (step === 1) {
      if (!data.companyName) missing.push("Company Name");
      if (!data.industry) missing.push("Industry / Vertical");
      if (!data.hqRegion) missing.push("Headquarters Region");
      if (!data.companySize) missing.push("Company Size");
    }
    if (step === 2) {
      if (!data.domain) missing.push("Workspace Domain");
    }
    if (step === 3) {
      if (!data.adminName) missing.push("Full Name");
      if (!data.adminEmail) missing.push("Work Email");
      else if (!data.adminEmail.includes("@"))
        missing.push("Work Email (please enter a valid email address)");
    }
    return missing;
  }

  async function handleSubmit() {
    if (!actor) {
      toast.error("Not connected. Please try again.");
      return;
    }
    setSubmitting(true);
    try {
      const companyId = `${data.companyName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 12)}-VND`;
      const companyResult = await actor.createCompanyProfile({
        companyName: data.companyName.trim() || "Test Vendor",
        companyId,
        emailDomain:
          data.domain
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .trim() || "test.example.com",
        partnerDomains: [],
        companyType: CompanyType.Vendor,
        logoKey: data.logoKey || undefined,
      });
      if (companyResult.__kind__ === "err") {
        toast.error(companyResult.err);
        setSubmitting(false);
        return;
      }
      const company = companyResult.ok;
      const profileResult = await actor.saveUserProfile({
        fullName: data.adminName.trim() || "Admin",
        email: data.adminEmail.trim() || "admin@test.example.com",
        companyId: company.id,
        role: UserRole.VendorPrimaryAdmin,
        permissions: [],
        isPrimaryAdmin: true,
      });
      if (profileResult.__kind__ === "err") {
        toast.error(profileResult.err);
        setSubmitting(false);
        return;
      }
      await actor.completeSetup(company.id).catch(() => {
        /* non-fatal */
      });
      localStorage.removeItem(LS_KEY);
      setSuccess(true);
    } catch (err) {
      console.error("Vendor setup failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSaveExit() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
    toast.success("Progress saved. You can continue setup later.");
    navigate({ to: "/login" });
  }

  const { setOperationalRegionPrefs } = useApp();
  const isOptional = step === 4 || step === 5 || step === 8;
  const missingFields = getMissingFields();
  const hasWarnings = missingFields.length > 0;

  function handleNext() {
    // TODO-SECURITY: RE-ENABLE required field blocking before live launch.
    // In test mode, admins can always proceed. Show a toast if fields are incomplete.
    if (step === 8) {
      setOperationalRegionPrefs({
        selectedRegionId: selectedRegionId ?? "europe",
        isConfigured: !!selectedRegionId,
        isLocked: !!selectedRegionId,
        lockedAt: selectedRegionId ? new Date().toISOString() : null,
        changeRequest: null,
      } as OperationalRegionPreferences);
      setStep((s) => Math.min(9, s + 1));
      return;
    }
    if (hasWarnings && !warnDismissed) {
      toast.warning(
        "You've proceeded with incomplete fields. You can come back and update these later.",
        { duration: 5000 },
      );
    }
    setStep((s) => Math.min(9, s + 1));
  }

  return (
    <div
      className="wiz-page"
      style={{ background: BG_DEEP, minHeight: "100vh" }}
      data-ocid="vendor-onboarding.page"
    >
      <WizardSidebar currentStep={step} />

      <main
        className="wiz-main"
        style={{ paddingBottom: step < 8 ? "96px" : "48px" }}
        data-ocid="vendor-onboarding.content"
      >
        {/* Save & Exit */}
        <div className="flex items-center justify-end mb-6">
          <button
            type="button"
            data-ocid="vendor-onboarding.save_exit.button"
            onClick={handleSaveExit}
            className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
            style={{ color: "#4a5568" }}
          >
            <Save size={12} /> Save &amp; Exit
          </button>
        </div>

        {/* TODO-SECURITY: RE-ENABLE required field blocking before live launch. */}
        {/* Amber warning banner — shown when fields are incomplete but not blocking */}
        {hasWarnings && !warnDismissed && step <= 3 && (
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3 mb-6"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.35)",
            }}
            data-ocid="vendor-onboarding.field_warning.banner"
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
                Some fields need attention — please review the highlighted items
                before continuing.
              </div>
              <div className="text-xs mt-1" style={{ color: "#b08a3a" }}>
                Missing: {missingFields.join(", ")}. This field helps us
                configure your workspace correctly — you can update it later in
                settings.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setWarnDismissed(true)}
              aria-label="Dismiss warning"
              style={{ color: "#b08a3a" }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {step === 1 && (
          <Step1Panel
            data={data}
            update={update}
            prepopDismissed={prepopDismissed}
            setPrepopDismissed={setPrepopDismissed}
            hasPrepopData={hasPrepopData}
          />
        )}
        {step === 2 && <Step2Panel data={data} update={update} />}
        {step === 3 && <Step3Panel data={data} update={update} />}
        {step === 4 && <Step4Panel data={data} update={update} />}
        {step === 5 && <Step5Panel data={data} update={update} />}
        {step === 6 && <Step6Panel data={data} update={update} />}
        {step === 7 && <Step7Panel data={data} update={update} />}
        {step === 8 && (
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
        {step === 9 && (
          <Step8Panel
            data={data}
            submitting={submitting}
            onComplete={handleSubmit}
          />
        )}
      </main>

      {/* Action bar — hidden on step 9 (has its own complete button) */}
      {step < 9 && (
        <div
          className="wiz-action-bar"
          style={{ background: BG_MID }}
          data-ocid="vendor-onboarding.action_bar"
        >
          <div className="flex items-center gap-3">
            {step === 1 ? (
              <Button
                type="button"
                variant="outline"
                data-ocid="vendor-onboarding.back_to_workspace_select.button"
                onClick={() => navigate({ to: "/workspace-setup" })}
                className="font-semibold gap-1.5"
                style={{ borderColor: BORDER, color: "#7D8AA0" }}
              >
                <ArrowLeft size={15} /> Back to Workspace Selection
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                data-ocid="vendor-onboarding.prev.button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="font-semibold gap-1.5"
                style={{ borderColor: BORDER, color: "#7D8AA0" }}
              >
                <ChevronLeft size={15} /> Back
              </Button>
            )}
            {isOptional && (
              <Button
                type="button"
                variant="ghost"
                data-ocid="vendor-onboarding.skip.button"
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
                className="text-sm"
                style={{ color: "#4a5568" }}
              >
                Skip for now
              </Button>
            )}
          </div>
          {/* TODO-SECURITY: RE-ENABLE disabled={!canAdvance() && !isOptional} before live launch. */}
          {/* Button is always enabled in test mode; warnings are shown inline instead. */}
          <Button
            type="button"
            data-ocid="vendor-onboarding.next.button"
            onClick={handleNext}
            className="font-semibold gap-2"
            style={{ background: ORANGE, color: "white" }}
          >
            Continue <ChevronRight size={15} />
          </Button>
        </div>
      )}

      {success && (
        <SuccessOverlay onGo={() => navigate({ to: "/dashboard" })} />
      )}

      <style>{`
        .wiz-page { display: flex; min-height: 100vh; }
        .wiz-sidebar {
          width: 260px;
          min-width: 240px;
          max-width: 280px;
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 28px 20px;
          overflow-y: auto;
          border-right: 1px solid ${BORDER};
          flex-shrink: 0;
        }
        .wiz-main {
          flex: 1;
          padding: 32px 48px;
          overflow-y: auto;
          background: ${BG_DEEP};
        }
        .wiz-action-bar {
          position: fixed;
          bottom: 0;
          right: 0;
          left: 260px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 48px;
          border-top: 1px solid ${BORDER};
          z-index: 20;
        }
        .wiz-select {
          background: ${BG_BASE};
          border: 1px solid ${BORDER};
          color: white;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 6px;
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
        }
        .wiz-select option { background: ${BG_BASE}; }
        .wiz-select:focus {
          outline: none;
          border-color: ${ORANGE};
          box-shadow: 0 0 0 3px rgba(255,107,43,0.12);
        }
        .crm-input {
          background: ${BG_BASE} !important;
          border: 1px solid ${BORDER} !important;
          color: white !important;
          font-size: 14px;
        }
        .crm-input::placeholder { color: #3a4a60; }
        .crm-input:focus {
          outline: none !important;
          border-color: ${ORANGE} !important;
          box-shadow: 0 0 0 3px rgba(255,107,43,0.12) !important;
        }
        .field-textarea {
          background: ${BG_BASE};
          border: 1px solid ${BORDER};
          color: white;
          font-size: 14px;
          padding: 8px 12px;
          border-radius: 6px;
        }
        .field-textarea::placeholder { color: #3a4a60; }
        .field-textarea:focus {
          outline: none;
          border-color: ${ORANGE};
          box-shadow: 0 0 0 3px rgba(255,107,43,0.12);
        }
        @media (max-width: 768px) {
          .wiz-page { flex-direction: column; }
          .wiz-sidebar {
            width: 100%;
            max-width: 100%;
            height: auto;
            position: relative;
            padding: 20px;
          }
          .wiz-main { padding: 20px; }
          .wiz-action-bar { left: 0; padding: 14px 20px; }
        }
      `}</style>
    </div>
  );
}
