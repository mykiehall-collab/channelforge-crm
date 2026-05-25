import { useNavigate } from "@tanstack/react-router";
import {
  Brain,
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  FlaskConical,
  Globe,
  Info,
  Lock,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ORANGE = "#FF6B2B";
const BG_BASE = "#0b1220";
const BG_DEEP = "#060d18";
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
        <span className="font-black text-[20px]" style={{ color: "#C8D6E8" }}>
          CHANNEL
        </span>
        <span
          className="font-black text-[20px] forge-pulse"
          style={{ color: ORANGE }}
        >
          FORGE
        </span>
      </div>
      <div
        className="text-[8px] font-medium tracking-[0.28em] uppercase"
        style={{ color: "rgba(125,138,160,0.65)" }}
      >
        CRM
      </div>
    </div>
  );
}

const ORG_TYPES = [
  "Standard Vendor",
  "Multi-Tier Vendor",
  "Regional Distributor",
  "Global Distributor",
  "Standard Reseller",
  "Multi-Group Reseller",
];

const REGIONS = [
  "UK",
  "Europe",
  "North America",
  "Asia Pacific",
  "Middle East",
  "Global",
];

const COMPLEXITY_LEVELS = [
  "Low — simple operations, single region",
  "Medium — multi-region or growing team",
  "High — complex hierarchy, multiple divisions",
  "Enterprise — global operations, advanced governance",
];

const STEP_LABELS = [
  { num: 1, label: "Organisation Complexity" },
  { num: 2, label: "Payment Details" },
  { num: 3, label: "Trial Confirmation" },
];

interface OrgFormData {
  orgType: string;
  adminCount: string;
  endUserCount: string;
  salesUserCount: string;
  customerAccountCount: string;
  regions: string[];
  complexityLevel: string;
}

interface PaymentFormData {
  companyName: string;
  companyEmail: string;
  streetAddress: string;
  city: string;
  postcode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_LABELS.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold"
              style={{
                background:
                  s.num < step
                    ? ORANGE
                    : s.num === step
                      ? ORANGE
                      : "rgba(30,48,80,0.8)",
                border: `2px solid ${s.num <= step ? ORANGE : BORDER}`,
                color: s.num <= step ? "#fff" : TEXT_MUTED,
              }}
            >
              {s.num < step ? <Check size={14} /> : s.num}
            </div>
            <span
              className="text-[11px] font-medium whitespace-nowrap"
              style={{ color: s.num === step ? "#E7EEF8" : TEXT_MUTED }}
            >
              {s.label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div
              className="w-16 h-px mx-2 mb-5"
              style={{ background: i < step - 1 ? ORANGE : BORDER }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function OrgComplexityStep({
  data,
  onChange,
  bundleName,
  bundlePrice,
  bundleCompute,
  bundleStorage,
  bundleAi,
}: {
  data: OrgFormData;
  onChange: (d: OrgFormData) => void;
  bundleName: string;
  bundlePrice: string;
  bundleCompute: string;
  bundleStorage: string;
  bundleAi: string;
}) {
  const isMultiGroup = data.orgType === "Multi-Group Reseller";
  const totalUsers =
    (Number.parseInt(data.adminCount) || 0) +
    (Number.parseInt(data.endUserCount) || 0) +
    (Number.parseInt(data.salesUserCount) || 0);
  const estimatedMonthly = Number.parseInt(bundlePrice) || 0;

  const toggleRegion = (r: string) => {
    const next = data.regions.includes(r)
      ? data.regions.filter((x) => x !== r)
      : [...data.regions, r];
    onChange({ ...data, regions: next });
  };

  // ── Recommendation engine ──────────────────────────────────────────────────
  function computeRecommendation(): {
    tier: string;
    tierId: string;
    price: string;
    reason: string;
  } | null {
    if (
      !data.orgType &&
      !data.adminCount &&
      !data.endUserCount &&
      !data.salesUserCount &&
      !data.customerAccountCount
    ) {
      return null; // not enough input
    }
    // Need at least org type OR one count field
    const hasOrgType = !!data.orgType;
    const hasAnyCount = !!(
      data.adminCount ||
      data.endUserCount ||
      data.salesUserCount ||
      data.customerAccountCount
    );
    if (!hasOrgType && !hasAnyCount) return null;

    let score = 0;

    // Org type score
    if (
      data.orgType === "Standard Vendor" ||
      data.orgType === "Multi-Tier Vendor"
    )
      score += 3;
    else if (
      data.orgType === "Regional Distributor" ||
      data.orgType === "Global Distributor"
    )
      score += 2;
    else if (data.orgType === "Multi-Group Reseller") score += 2;
    else if (data.orgType === "Standard Reseller") score += 1;

    // Admin count
    const admins = Number.parseInt(data.adminCount) || 0;
    if (admins >= 11) score += 2;
    else if (admins >= 4) score += 1;

    // End user count
    const endUsers = Number.parseInt(data.endUserCount) || 0;
    if (endUsers >= 101) score += 2;
    else if (endUsers >= 21) score += 1;

    // Sales user count
    const salesUsers = Number.parseInt(data.salesUserCount) || 0;
    if (salesUsers >= 51) score += 2;
    else if (salesUsers >= 11) score += 1;

    // Customer accounts
    const accounts = Number.parseInt(data.customerAccountCount) || 0;
    if (accounts >= 501) score += 2;
    else if (accounts >= 51) score += 1;

    // Regions
    const regionCount = data.regions.length;
    if (regionCount >= 6) score += 2;
    else if (regionCount >= 2) score += 1;

    // Complexity level
    if (data.complexityLevel.startsWith("Enterprise")) score += 3;
    else if (data.complexityLevel.startsWith("High")) score += 2;
    else if (data.complexityLevel.startsWith("Medium")) score += 1;

    let tier: string;
    let tierId: string;
    let price: string;
    if (score >= 9) {
      tier = "Large";
      tierId = "large";
      price = "";
    } else if (score >= 4) {
      tier = "Medium";
      tierId = "medium";
      price = "";
    } else {
      tier = "Small";
      tierId = "small";
      price = "";
    }

    // Build reason
    const orgLabel = data.orgType || "your organisation";
    const regionPart =
      regionCount > 0
        ? ` across ${regionCount} region${regionCount > 1 ? "s" : ""}`
        : "";
    const userPart = totalUsers > 0 ? ` with ${totalUsers} users` : "";
    const reason = `Your ${orgLabel} profile${userPart}${regionPart} aligns with ${tier} operational scope.`;

    return { tier, tierId, price, reason };
  }

  const recommendation = computeRecommendation();
  const currentTierId =
    sessionStorage.getItem("cf_selected_tier") || "professional";
  const recommendationMatchesCurrent = recommendation?.tierId === currentTierId;

  function handleSwitchPlan() {
    if (!recommendation) return;
    sessionStorage.setItem("cf_selected_tier", recommendation.tierId);
    sessionStorage.setItem("cf_tier_name", recommendation.tier);
    sessionStorage.setItem("cf_tier_price", recommendation.price);
    toast.success(`Plan updated to ${recommendation.tier}`, { duration: 3000 });
  }

  // TODO-SECURITY: Remove "Fill with Test Data" button before live launch. Test-only helper.
  function fillTestData() {
    onChange({
      orgType: "Standard Vendor",
      adminCount: "5",
      endUserCount: "50",
      salesUserCount: "20",
      customerAccountCount: "200",
      regions: ["UK", "Europe"],
      complexityLevel: "Medium — multi-region or growing team",
    });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-2">
        <h2
          className="font-bold text-white tracking-tight"
          style={{
            fontSize: "1.6rem",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Tell us about your organisation
        </h2>
        {/* TODO-SECURITY: Remove "Fill with Test Data" button before live launch. Test-only helper. */}
        <button
          type="button"
          data-ocid="subscription.org_complexity.fill_test_data.button"
          onClick={fillTestData}
          title="Test environment only — fills all fields with dummy data"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold flex-shrink-0"
          style={{
            background: "rgba(255,107,43,0.12)",
            border: "1px solid rgba(255,107,43,0.35)",
            color: "#FF6B2B",
          }}
        >
          <FlaskConical size={12} /> Fill with Test Data
        </button>
      </div>
      <p className="text-[14px] mb-8" style={{ color: TEXT_SOFT }}>
        This helps us calculate the right pricing and tailor your workspace
        setup.
      </p>

      {/* Role distribution reference */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{
          background: "rgba(255,107,43,0.05)",
          border: "1px solid rgba(255,107,43,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Info size={14} style={{ color: ORANGE }} />
          <span
            className="text-[12px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: ORANGE }}
          >
            Typical role distributions
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "SMB", admins: "1–3 admins", users: "5–20 end users" },
            {
              label: "Mid-market",
              admins: "3–10 admins",
              users: "25–200 end users",
            },
            {
              label: "Enterprise",
              admins: "10+ admins",
              users: "hundreds of end users",
            },
          ].map((ex) => (
            <div
              key={ex.label}
              className="rounded-lg p-3"
              style={{
                background: "rgba(255,107,43,0.04)",
                border: `1px solid ${BORDER}`,
              }}
            >
              <p
                className="text-[12px] font-bold mb-1"
                style={{ color: "#E7EEF8" }}
              >
                {ex.label}
              </p>
              <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
                {ex.admins}
              </p>
              <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
                {ex.users}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Org type */}
      <div className="mb-5">
        <label
          htmlFor="org-type"
          className="block text-[12px] font-semibold uppercase tracking-[0.08em] mb-2"
          style={{ color: TEXT_MUTED }}
        >
          Organisation Type <span style={{ color: ORANGE }}>*</span>
        </label>
        <select
          id="org-type"
          data-ocid="subscription.org_type.select"
          value={data.orgType}
          onChange={(e) => onChange({ ...data, orgType: e.target.value })}
          className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border appearance-none cursor-pointer"
          style={{
            background: "rgba(11,18,32,0.8)",
            borderColor: BORDER,
            color: "#E7EEF8",
          }}
        >
          <option value="">Select organisation type…</option>
          {ORG_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Multi-Group Reseller callout */}
      {isMultiGroup && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{
            background: "rgba(255,107,43,0.07)",
            border: "1px solid rgba(255,107,43,0.3)",
          }}
        >
          <div className="flex items-start gap-2">
            <Building2
              size={15}
              style={{ color: ORANGE, marginTop: 2, flexShrink: 0 }}
            />
            <div>
              <p
                className="text-[13px] font-semibold mb-1"
                style={{ color: "#E7EEF8" }}
              >
                Multi-Group Reseller
              </p>
              <p
                className="text-[12px] leading-[1.6]"
                style={{ color: TEXT_SOFT }}
              >
                Multi-Group Resellers operate with multiple divisions, regional
                groups, or multi-brand operations. Your pricing will align to{" "}
                <strong style={{ color: ORANGE }}>Medium</strong> — including
                advanced hierarchy management, regional structures, and expanded
                Foundry capabilities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User counts */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          {
            field: "adminCount" as const,
            label: "Estimated Admins",
            placeholder: "e.g. 3",
          },
          {
            field: "endUserCount" as const,
            label: "Estimated End Users",
            placeholder: "e.g. 45",
          },
          {
            field: "salesUserCount" as const,
            label: "Estimated Sales Users",
            placeholder: "e.g. 20",
          },
          {
            field: "customerAccountCount" as const,
            label: "Estimated Customer Accounts",
            placeholder: "e.g. 200",
          },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <label
              htmlFor={`field-${field}`}
              className="block text-[12px] font-semibold uppercase tracking-[0.08em] mb-2"
              style={{ color: TEXT_MUTED }}
            >
              {label}
            </label>
            <input
              id={`field-${field}`}
              type="number"
              data-ocid={`subscription.${field}.input`}
              value={data[field]}
              onChange={(e) => onChange({ ...data, [field]: e.target.value })}
              placeholder={placeholder}
              min="0"
              className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border"
              style={{
                background: "rgba(11,18,32,0.8)",
                borderColor: BORDER,
                color: "#E7EEF8",
              }}
            />
          </div>
        ))}
      </div>

      {/* Regions */}
      <div className="mb-5">
        <div
          className="block text-[12px] font-semibold uppercase tracking-[0.08em] mb-3"
          style={{ color: TEXT_MUTED }}
        >
          Operational Regions
        </div>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              data-ocid={`subscription.region.${r.toLowerCase().replace(/ /g, "_")}.toggle`}
              onClick={() => toggleRegion(r)}
              className="px-3.5 py-2 rounded-lg text-[13px] font-medium cursor-pointer border"
              style={{
                background: data.regions.includes(r)
                  ? "rgba(255,107,43,0.1)"
                  : "rgba(11,18,32,0.6)",
                borderColor: data.regions.includes(r)
                  ? "rgba(255,107,43,0.5)"
                  : BORDER,
                color: data.regions.includes(r) ? ORANGE : TEXT_SOFT,
                transition: "all 0.15s ease",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Complexity level */}
      <div className="mb-6">
        <div
          className="block text-[12px] font-semibold uppercase tracking-[0.08em] mb-3"
          style={{ color: TEXT_MUTED }}
        >
          Operational Complexity
        </div>
        <div className="flex flex-col gap-2">
          {COMPLEXITY_LEVELS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ ...data, complexityLevel: c })}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] cursor-pointer border text-left"
              style={{
                background:
                  data.complexityLevel === c
                    ? "rgba(255,107,43,0.07)"
                    : "rgba(11,18,32,0.5)",
                borderColor:
                  data.complexityLevel === c ? "rgba(255,107,43,0.4)" : BORDER,
                color: data.complexityLevel === c ? "#E7EEF8" : TEXT_SOFT,
              }}
            >
              <div
                className="w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center"
                style={{
                  borderColor: data.complexityLevel === c ? ORANGE : BORDER,
                  background:
                    data.complexityLevel === c ? ORANGE : "transparent",
                }}
              >
                {data.complexityLevel === c && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tier recommendation panel ──────────────────────────────────────── */}
      {recommendation && (
        <div
          className="rounded-xl p-4 mb-6"
          data-ocid="subscription.recommendation_panel"
          style={{
            background: "rgba(11,18,32,0.85)",
            borderLeft: `3px solid ${ORANGE}`,
            border: "1px solid rgba(255,107,43,0.25)",
            borderLeftWidth: "3px",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} style={{ color: ORANGE, flexShrink: 0 }} />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.1em]"
              style={{ color: ORANGE }}
            >
              ForgeAI Plan Recommendation
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <p
                className="text-[14px] font-bold mb-0.5"
                style={{ color: "#E7EEF8" }}
              >
                {recommendation.tier}{" "}
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: ORANGE }}
                >
                  {recommendation.tier}
                </span>
              </p>
              <p
                className="text-[12px] leading-[1.5]"
                style={{ color: TEXT_SOFT }}
              >
                {recommendation.reason}
              </p>
            </div>
          </div>

          {recommendationMatchesCurrent ? (
            <div className="flex items-center gap-1.5 mt-2">
              <Check size={13} style={{ color: "#4ade80" }} />
              <span
                className="text-[12px] font-medium"
                style={{ color: "#4ade80" }}
              >
                Your selected plan matches your profile
              </span>
            </div>
          ) : (
            <button
              type="button"
              data-ocid="subscription.recommendation.switch_button"
              onClick={handleSwitchPlan}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer border-none"
              style={{
                background: "rgba(255,107,43,0.12)",
                border: "1px solid rgba(255,107,43,0.35)",
                color: ORANGE,
              }}
            >
              Switch to {recommendation.tier}
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* Selected tier + estimated billing summary */}
      <div
        className="rounded-xl p-4"
        style={{ background: BG_DEEP, border: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[13px] font-semibold"
            style={{ color: TEXT_SOFT }}
          >
            Selected Bundle
          </span>
          <span className="text-[13px] font-bold" style={{ color: ORANGE }}>
            {bundleName}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
            Infrastructure Package
          </span>
          <span className="text-[13px] font-mono" style={{ color: "#E7EEF8" }}>
            {bundleName}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
            Compute Credits
          </span>
          <span className="text-[13px] font-mono" style={{ color: "#E7EEF8" }}>
            {(Number.parseInt(bundleCompute) || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
            Storage Credits
          </span>
          <span className="text-[13px] font-mono" style={{ color: "#E7EEF8" }}>
            {(Number.parseInt(bundleStorage) || 0).toLocaleString()} GB
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
            AI Credits
          </span>
          <span className="text-[13px] font-mono" style={{ color: "#E7EEF8" }}>
            {(Number.parseInt(bundleAi) || 0).toLocaleString()}
          </span>
        </div>
        {totalUsers > 0 && (
          <>
            <div className="h-px my-2" style={{ background: BORDER }} />
            <div className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                Estimated total users
              </span>
              <span
                className="text-[13px] font-mono"
                style={{ color: "#E7EEF8" }}
              >
                {totalUsers}
              </span>
            </div>
            {estimatedMonthly && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                  Estimated monthly billing
                </span>
                <span
                  className="text-[14px] font-bold"
                  style={{ color: ORANGE }}
                >
                  £{estimatedMonthly.toLocaleString()}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PaymentStep({
  data,
  onChange,
  bundleName,
  bundlePrice,
  bundleCompute,
  bundleStorage,
  bundleAi,
  orgData,
}: {
  data: PaymentFormData;
  onChange: (d: PaymentFormData) => void;
  bundleName: string;
  bundlePrice: string;
  bundleCompute: string;
  bundleStorage: string;
  bundleAi: string;
  orgData: OrgFormData;
}) {
  const totalUsers =
    (Number.parseInt(orgData.adminCount) || 0) +
    (Number.parseInt(orgData.endUserCount) || 0) +
    (Number.parseInt(orgData.salesUserCount) || 0);
  const estimatedMonthly = Number.parseInt(bundlePrice) || 0;

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  // TODO-SECURITY: Remove "Fill with Test Data" button before live launch. Test-only helper.
  function fillTestPaymentData() {
    onChange({
      ...data,
      companyName: "ChannelForge Test Ltd",
      companyEmail: "billing@test-channelforge.com",
      streetAddress: "123 Test Street",
      city: "London",
      postcode: "EC1A 1BB",
      country: "United Kingdom",
      cardNumber: "4242 4242 4242 4242",
      cardExpiry: "12/28",
      cardCvv: "123",
      cardName: "Test User",
    });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-2">
        <h2
          className="font-bold text-white tracking-tight"
          style={{
            fontSize: "1.6rem",
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Set up your billing
        </h2>
        {/* TODO-SECURITY: Remove "Fill with Test Data" button before live launch. Test-only helper. */}
        <button
          type="button"
          data-ocid="subscription.payment.fill_test_data.button"
          onClick={fillTestPaymentData}
          title="Test environment only — fills payment form with Stripe test card details"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold flex-shrink-0"
          style={{
            background: "rgba(255,107,43,0.12)",
            border: "1px solid rgba(255,107,43,0.35)",
            color: "#FF6B2B",
          }}
        >
          <FlaskConical size={12} /> Fill with Test Data
        </button>
      </div>
      <p className="text-[14px] mb-2" style={{ color: TEXT_SOFT }}>
        Your 1-month free trial starts immediately. No charges until your trial
        ends.
      </p>

      {/* Simulated notice */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3 mb-8"
        style={{
          background: "rgba(255,107,43,0.07)",
          border: "1px solid rgba(255,107,43,0.25)",
        }}
      >
        <Lock
          size={15}
          style={{ color: ORANGE, marginTop: 1, flexShrink: 0 }}
        />
        <div>
          <p
            className="text-[13px] font-semibold mb-0.5"
            style={{ color: ORANGE }}
          >
            Live billing activation coming soon.
          </p>
          <p className="text-[12px] leading-[1.6]" style={{ color: TEXT_SOFT }}>
            No charges will be made during this trial phase. Your payment
            details are collected for future billing activation and will be
            securely stored.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Forms */}
        <div className="flex flex-col gap-5">
          {/* Company info */}
          <div>
            <p
              className="text-[12px] font-bold uppercase tracking-[0.1em] mb-4"
              style={{ color: TEXT_MUTED }}
            >
              Company Information
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="company-name"
                  className="block text-[12px] font-semibold mb-1.5"
                  style={{ color: TEXT_SOFT }}
                >
                  Company Name <span style={{ color: ORANGE }}>*</span>
                </label>
                <input
                  id="company-name"
                  type="text"
                  data-ocid="subscription.company_name.input"
                  value={data.companyName}
                  onChange={(e) =>
                    onChange({ ...data, companyName: e.target.value })
                  }
                  placeholder="Acme Corporation Ltd"
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border"
                  style={{
                    background: "rgba(11,18,32,0.8)",
                    borderColor: BORDER,
                    color: "#E7EEF8",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="billing-email"
                  className="block text-[12px] font-semibold mb-1.5"
                  style={{ color: TEXT_SOFT }}
                >
                  Billing Email <span style={{ color: ORANGE }}>*</span>
                </label>
                <input
                  id="billing-email"
                  type="email"
                  data-ocid="subscription.company_email.input"
                  value={data.companyEmail}
                  onChange={(e) =>
                    onChange({ ...data, companyEmail: e.target.value })
                  }
                  placeholder="billing@company.com"
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border"
                  style={{
                    background: "rgba(11,18,32,0.8)",
                    borderColor: BORDER,
                    color: "#E7EEF8",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Billing address */}
          <div>
            <p
              className="text-[12px] font-bold uppercase tracking-[0.1em] mb-4"
              style={{ color: TEXT_MUTED }}
            >
              Billing Address
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                data-ocid="subscription.street_address.input"
                value={data.streetAddress}
                onChange={(e) =>
                  onChange({ ...data, streetAddress: e.target.value })
                }
                placeholder="Street address"
                className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border"
                style={{
                  background: "rgba(11,18,32,0.8)",
                  borderColor: BORDER,
                  color: "#E7EEF8",
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  data-ocid="subscription.city.input"
                  value={data.city}
                  onChange={(e) => onChange({ ...data, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border"
                  style={{
                    background: "rgba(11,18,32,0.8)",
                    borderColor: BORDER,
                    color: "#E7EEF8",
                  }}
                />
                <input
                  type="text"
                  data-ocid="subscription.postcode.input"
                  value={data.postcode}
                  onChange={(e) =>
                    onChange({ ...data, postcode: e.target.value })
                  }
                  placeholder="Postcode"
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border"
                  style={{
                    background: "rgba(11,18,32,0.8)",
                    borderColor: BORDER,
                    color: "#E7EEF8",
                  }}
                />
              </div>
              <select
                data-ocid="subscription.country.select"
                value={data.country}
                onChange={(e) => onChange({ ...data, country: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border appearance-none cursor-pointer"
                style={{
                  background: "rgba(11,18,32,0.8)",
                  borderColor: BORDER,
                  color: data.country ? "#E7EEF8" : TEXT_MUTED,
                }}
              >
                <option value="">Country…</option>
                {[
                  "United Kingdom",
                  "United States",
                  "Germany",
                  "France",
                  "Australia",
                  "Canada",
                  "Netherlands",
                  "Sweden",
                  "Other",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Card details */}
          <div>
            <p
              className="text-[12px] font-bold uppercase tracking-[0.1em] mb-1"
              style={{ color: TEXT_MUTED }}
            >
              Payment Card (Simulated)
            </p>
            <p
              className="text-[11px] mb-4 italic"
              style={{ color: "rgba(125,138,160,0.6)" }}
            >
              This is a simulated payment form. No real charges will occur.
            </p>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <CreditCard
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: TEXT_MUTED }}
                />
                <input
                  type="text"
                  data-ocid="subscription.card_number.input"
                  value={data.cardNumber}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      cardNumber: formatCard(e.target.value),
                    })
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] outline-none border font-mono"
                  style={{
                    background: "rgba(11,18,32,0.8)",
                    borderColor: BORDER,
                    color: "#E7EEF8",
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  data-ocid="subscription.card_expiry.input"
                  value={data.cardExpiry}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      cardExpiry: formatExpiry(e.target.value),
                    })
                  }
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border font-mono"
                  style={{
                    background: "rgba(11,18,32,0.8)",
                    borderColor: BORDER,
                    color: "#E7EEF8",
                  }}
                />
                <input
                  type="text"
                  data-ocid="subscription.card_cvv.input"
                  value={data.cardCvv}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      cardCvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  placeholder="CVV"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border font-mono"
                  style={{
                    background: "rgba(11,18,32,0.8)",
                    borderColor: BORDER,
                    color: "#E7EEF8",
                  }}
                />
              </div>
              <input
                type="text"
                data-ocid="subscription.card_name.input"
                value={data.cardName}
                onChange={(e) =>
                  onChange({ ...data, cardName: e.target.value })
                }
                placeholder="Name on card"
                className="w-full px-4 py-3 rounded-xl text-[14px] outline-none border"
                style={{
                  background: "rgba(11,18,32,0.8)",
                  borderColor: BORDER,
                  color: "#E7EEF8",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Summary sidebar */}
        <div>
          <div
            className="rounded-2xl p-6 sticky top-8"
            style={{ background: BG_DEEP, border: `1px solid ${BORDER}` }}
          >
            <p
              className="text-[12px] font-bold uppercase tracking-[0.1em] mb-5"
              style={{ color: TEXT_MUTED }}
            >
              Order Summary
            </p>

            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[14px] font-semibold"
                style={{ color: "#E7EEF8" }}
              >
                {bundleName}
              </span>
              <span className="text-[14px] font-bold" style={{ color: ORANGE }}>
                {bundleName}
              </span>
            </div>

            <div className="h-px mb-4" style={{ background: BORDER }} />

            <div className="flex flex-col gap-2.5 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                  Trial period
                </span>
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: "#E7EEF8" }}
                >
                  30 days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                  Estimated users
                </span>
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: "#E7EEF8" }}
                >
                  {totalUsers > 0 ? totalUsers : "TBC"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                  Est. monthly cost
                </span>
                <span
                  className="text-[13px] font-bold"
                  style={{ color: ORANGE }}
                >
                  £{estimatedMonthly.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                  Compute Credits
                </span>
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: "#E7EEF8" }}
                >
                  {(Number.parseInt(bundleCompute) || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                  Storage
                </span>
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: "#E7EEF8" }}
                >
                  {(Number.parseInt(bundleStorage) || 0).toLocaleString()} GB
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                  AI Credits
                </span>
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: "#E7EEF8" }}
                >
                  {(Number.parseInt(bundleAi) || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div
              className="rounded-xl px-4 py-3 mb-5"
              style={{
                background: "rgba(255,107,43,0.07)",
                border: "1px solid rgba(255,107,43,0.2)",
              }}
            >
              <p
                className="text-[12px] font-semibold mb-1"
                style={{ color: ORANGE }}
              >
                Trial — No charge today
              </p>
              <p
                className="text-[11px] leading-[1.6]"
                style={{ color: TEXT_SOFT }}
              >
                Your free trial begins immediately. First billing date will be
                set upon trial activation.{" "}
                <strong style={{ color: ORANGE }}>
                  Live billing activation coming soon.
                </strong>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { icon: Shield, text: "Secure simulated payment entry" },
                { icon: Globe, text: "Sovereign enterprise infrastructure" },
                { icon: Brain, text: "ForgeAI included from day one" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={12} style={{ color: ORANGE, flexShrink: 0 }} />
                  <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationStep({
  bundleName,
  bundleCompute,
  bundleStorage,
  bundleAi,
  orgData,
  paymentData,
  anniversaryDate,
  trialStartDate,
}: {
  bundleName: string;
  bundleCompute: string;
  bundleStorage: string;
  bundleAi: string;
  orgData: OrgFormData;
  paymentData: PaymentFormData;
  anniversaryDate: string;
  trialStartDate: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      {/* Success animation */}
      <div className="flex justify-center mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,107,43,0.12)",
            border: "2px solid rgba(255,107,43,0.4)",
            boxShadow: "0 0 32px rgba(255,107,43,0.2)",
          }}
        >
          <Check size={36} style={{ color: ORANGE }} strokeWidth={2.5} />
        </div>
      </div>

      <h2
        className="font-black text-white mb-2 tracking-tight"
        style={{
          fontSize: "1.8rem",
          fontFamily: "'Bricolage Grotesque', sans-serif",
        }}
      >
        Your free trial is now active!
      </h2>
      <p className="text-[15px] mb-8" style={{ color: TEXT_SOFT }}>
        Welcome to CHANNELFORGE. Your workspace is ready to set up.
      </p>

      {/* Trial details */}
      <div
        className="rounded-2xl p-6 mb-6 text-left mx-auto"
        style={{
          background: BG_DEEP,
          border: `1px solid ${BORDER}`,
          maxWidth: "560px",
        }}
      >
        <p
          className="text-[12px] font-bold uppercase tracking-[0.1em] mb-5"
          style={{ color: TEXT_MUTED }}
        >
          Infrastructure Summary
        </p>
        <div className="flex flex-col gap-4">
          {[
            { label: "Credit Bundle", value: bundleName, highlight: true },
            {
              label: "Infrastructure Package",
              value: bundleName,
              highlight: true,
            },
            {
              label: "Compute Credits",
              value: `${(Number.parseInt(bundleCompute) || 0).toLocaleString()}`,
            },
            {
              label: "Storage",
              value: `${(Number.parseInt(bundleStorage) || 0).toLocaleString()} GB`,
            },
            {
              label: "AI Credits",
              value: `${(Number.parseInt(bundleAi) || 0).toLocaleString()}`,
            },
            { label: "Trial Period", value: "30 days" },
            { label: "Trial Start", value: trialStartDate },
            {
              label: "Anniversary Date",
              value: anniversaryDate,
              highlight: true,
            },
            { label: "Next Billing Date", value: anniversaryDate },
            {
              label: "No Charges Until",
              value: anniversaryDate,
              highlight: true,
            },
            {
              label: "Organisation Type",
              value: orgData.orgType || "Not specified",
            },
            {
              label: "Estimated Users",
              value: (() => {
                const t =
                  (Number.parseInt(orgData.adminCount) || 0) +
                  (Number.parseInt(orgData.endUserCount) || 0) +
                  (Number.parseInt(orgData.salesUserCount) || 0);
                return t > 0 ? String(t) : "TBC";
              })(),
            },
            {
              label: "Operational Regions",
              value:
                orgData.regions.length > 0
                  ? orgData.regions.join(", ")
                  : "Not specified",
            },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-[13px]" style={{ color: TEXT_MUTED }}>
                {label}
              </span>
              <span
                className="text-[13px] font-semibold text-right"
                style={{ color: highlight ? ORANGE : "#E7EEF8" }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing notice */}
      <div
        className="rounded-xl px-5 py-3 mb-8 mx-auto text-left"
        style={{
          background: "rgba(255,107,43,0.07)",
          border: "1px solid rgba(255,107,43,0.2)",
          maxWidth: "560px",
        }}
      >
        <div className="flex items-center gap-2">
          <Lock size={13} style={{ color: ORANGE }} />
          <p className="text-[13px] font-semibold" style={{ color: ORANGE }}>
            Live billing activation coming soon.
          </p>
        </div>
        <p className="text-[12px] mt-1" style={{ color: TEXT_SOFT }}>
          No charges will be made during this trial phase. Your anniversary date
          ({anniversaryDate}) will become your future billing anchor date when
          live billing is activated.
        </p>
      </div>

      {/* Billing info */}
      <div className="mb-8 mx-auto" style={{ maxWidth: "560px" }}>
        <div className="flex items-center gap-2 mb-2">
          <Users size={13} style={{ color: TEXT_MUTED }} />
          <span className="text-[12px]" style={{ color: TEXT_MUTED }}>
            Billing contact: {paymentData.companyEmail || "—"}
          </span>
        </div>
      </div>

      <button
        type="button"
        data-ocid="subscription.confirmation.continue_button"
        onClick={() => navigate({ to: "/workspace-setup" })}
        className="flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-[16px] text-white cursor-pointer border-none mx-auto"
        style={{
          background: ORANGE,
          boxShadow: "0 4px 20px rgba(255,107,43,0.35)",
        }}
      >
        Continue to Account Setup
        <ChevronRight size={18} />
      </button>
      <p
        className="mt-3 text-[12px]"
        style={{ color: "rgba(125,138,160,0.5)" }}
      >
        Next: Select your workspace type (Vendor, Distributor, or Reseller)
      </p>
    </div>
  );
}

export function SubscriptionOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isActivating, setIsActivating] = useState(false);

  const bundleName = sessionStorage.getItem("cf_bundle_name") || "Medium";
  const bundlePrice = sessionStorage.getItem("cf_bundle_price") || "";
  const bundleId = sessionStorage.getItem("cf_selected_bundle") || "medium";
  const bundleCompute = sessionStorage.getItem("cf_bundle_compute") || "7500";
  const bundleStorage = sessionStorage.getItem("cf_bundle_storage") || "300";
  const bundleAi = sessionStorage.getItem("cf_bundle_ai") || "1500";

  const [orgData, setOrgData] = useState<OrgFormData>({
    orgType: "",
    adminCount: "",
    endUserCount: "",
    salesUserCount: "",
    customerAccountCount: "",
    regions: [],
    complexityLevel: "",
  });

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    companyName: "",
    companyEmail: "",
    streetAddress: "",
    city: "",
    postcode: "",
    country: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });

  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [trialStartDate, setTrialStartDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const anniversary = new Date(now);
    anniversary.setDate(anniversary.getDate() + 30);
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    setTrialStartDate(fmt(now));
    setAnniversaryDate(fmt(anniversary));
  }, []);

  const handleActivate = () => {
    setIsActivating(true);
    // Persist subscription data
    const subData = {
      bundle: bundleId,
      bundleName,
      bundlePrice,
      bundleCompute,
      bundleStorage,
      bundleAi,
      orgType: orgData.orgType,
      adminCount: orgData.adminCount,
      endUserCount: orgData.endUserCount,
      salesUserCount: orgData.salesUserCount,
      customerAccountCount: orgData.customerAccountCount,
      regions: orgData.regions,
      complexityLevel: orgData.complexityLevel,
      companyName: paymentData.companyName,
      companyEmail: paymentData.companyEmail,
      anniversaryDate,
      trialStartDate,
      isMultiGroupReseller: orgData.orgType === "Multi-Group Reseller",
      isTrialActive: true,
    };
    sessionStorage.setItem("cf_subscription", JSON.stringify(subData));
    setTimeout(() => {
      setIsActivating(false);
      setStep(3);
    }, 1200);
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
          style={{ maxWidth: "1100px" }}
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/pricing" })}
            className="cursor-pointer border-none bg-transparent p-0"
          >
            <ChannelForgeLogo />
          </button>
          <div
            className="flex items-center gap-2 text-[12px]"
            style={{ color: TEXT_MUTED }}
          >
            <Lock size={12} style={{ color: ORANGE }} />
            Secure checkout
          </div>
        </div>
      </header>

      <div className="pt-[80px] pb-20 px-6">
        <div className="mx-auto" style={{ maxWidth: "860px" }}>
          {/* Step indicator */}
          <div className="mt-8 mb-2">
            <StepIndicator step={step} />
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8 relative"
            style={{ background: BG_MID, border: `1px solid ${BORDER}` }}
          >
            <div
              className="absolute top-0 left-12 right-12 h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,107,43,0.5), transparent)",
              }}
            />

            {step === 1 && (
              <OrgComplexityStep
                data={orgData}
                onChange={setOrgData}
                bundleName={bundleName}
                bundlePrice={bundlePrice}
                bundleCompute={bundleCompute}
                bundleStorage={bundleStorage}
                bundleAi={bundleAi}
              />
            )}

            {step === 2 && (
              <PaymentStep
                data={paymentData}
                onChange={setPaymentData}
                bundleName={bundleName}
                bundlePrice={bundlePrice}
                bundleCompute={bundleCompute}
                bundleStorage={bundleStorage}
                bundleAi={bundleAi}
                orgData={orgData}
              />
            )}

            {step === 3 && (
              <ConfirmationStep
                bundleName={bundleName}
                bundleCompute={bundleCompute}
                bundleStorage={bundleStorage}
                bundleAi={bundleAi}
                orgData={orgData}
                paymentData={paymentData}
                anniversaryDate={anniversaryDate}
                trialStartDate={trialStartDate}
              />
            )}

            {/* Navigation */}
            {step < 3 && (
              <div
                className="flex items-center justify-between mt-8 pt-6"
                style={{ borderTop: `1px solid ${BORDER}` }}
              >
                <button
                  type="button"
                  data-ocid="subscription.back.button"
                  onClick={() => {
                    if (step === 1) navigate({ to: "/pricing" });
                    else setStep((s) => s - 1);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-medium cursor-pointer border"
                  style={{
                    borderColor: BORDER,
                    color: TEXT_SOFT,
                    background: "transparent",
                  }}
                >
                  ← {step === 1 ? "Back to Pricing" : "Back"}
                </button>

                {step === 1 && (
                  <button
                    type="button"
                    data-ocid="subscription.next.button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-[14px] text-white cursor-pointer border-none"
                    style={{ background: ORANGE }}
                  >
                    Continue to Payment
                    <ChevronRight size={16} />
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="button"
                    data-ocid="subscription.activate.button"
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-[14px] text-white cursor-pointer border-none"
                    style={{
                      background: ORANGE,
                      opacity: isActivating ? 0.7 : 1,
                    }}
                  >
                    {isActivating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Activating Trial…
                      </>
                    ) : (
                      <>
                        Activate Free Trial
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
