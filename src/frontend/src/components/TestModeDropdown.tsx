// ===== TEST_MODE_ONLY START =====
import { useEffect, useRef, useState } from "react";
import { useApp } from "../AppContext";
import { IS_TEST_MODE } from "../utils/testMode";

const ROLE_DESCRIPTIONS: Record<string, string> = {
  salesRep: "Sees assigned accounts, pipeline, renewals, and callbacks",
  accountManager:
    "Manages assigned customer accounts and strategic opportunities",
  renewalSpecialist:
    "Focuses on renewal queue, expiring contracts, and churn prevention",
  bdr: "Tracks prospects, sequences, and outreach performance",
  salesManager: "Views team attainment, territory performance, and forecast",
  regionalDirector:
    "Strategic ecosystem overview, YoY growth, and territory KPIs",
  salesOps:
    "Manages allocations, pricing, pipeline governance, and The Foundry",
  dealDesk:
    "Processes deal registrations, approvals, quotes, and pricing exceptions",
  marketing:
    "Tracks campaigns, MDF, asset performance, and reseller engagement",
  customerSuccess:
    "Monitors customer health, onboarding, adoption, and renewals",
  finance:
    "Views credit usage, infrastructure costs, and org-wide revenue forecasting",
  itOperations:
    "Sees system health, cases, integrations, and infrastructure status",
  securityAdmin:
    "Manages access control, MFA coverage, SSO health, and security reviews",
  leadership:
    "Strategic command — ecosystem health, YoY growth, and executive KPIs",
  partnerMarketing:
    "Tracks channel campaigns, MDF utilisation, and partner engagement",
  channelAccountManager:
    "CAM — partner ecosystem health, Distributor and Reseller performance",
  channelSalesManager:
    "Channel Sales Manager — regional CAM team oversight and ecosystem forecasting",
  channelDirector:
    "Channel Director — executive ecosystem strategy and strategic forecasting",
  primaryAdmin: "Full access — governance, The Foundry, all departments",
  secondaryAdmin: "Admin access minus infrastructure-level controls",
  departmentAdmin: "Department-scoped admin access",
  endUser: "Limited assigned data, no admin areas, request access CTAs",
};

type OrgTypeValue =
  | "Vendor"
  | "Distributor"
  | "GlobalDistributor"
  | "Reseller"
  | "MultiGroupReseller";

type AdminRoleValue =
  | "primaryAdmin"
  | "secondaryAdmin"
  | "departmentAdmin"
  | "endUser";

const ORG_TYPES: { value: OrgTypeValue; label: string }[] = [
  { value: "Vendor", label: "Vendor" },
  { value: "Distributor", label: "Distributor" },
  { value: "GlobalDistributor", label: "Global Distributor" },
  { value: "Reseller", label: "Reseller" },
  { value: "MultiGroupReseller", label: "Multi-Group Reseller" },
];

const ROLE_GROUPS: {
  label: string;
  roles: { value: string; label: string }[];
}[] = [
  {
    label: "Sales",
    roles: [
      { value: "salesRep", label: "Sales Rep" },
      { value: "accountManager", label: "Account Manager" },
      { value: "renewalSpecialist", label: "Renewal Specialist" },
      { value: "bdr", label: "BDR" },
      { value: "customerSuccess", label: "Customer Success" },
    ],
  },
  {
    label: "Management",
    roles: [
      { value: "salesManager", label: "Sales Manager" },
      { value: "regionalDirector", label: "Regional Director" },
      { value: "leadership", label: "Leadership" },
    ],
  },
  {
    label: "Channel Management",
    roles: [
      {
        value: "channelAccountManager",
        label: "Channel Account Manager (CAM)",
      },
      { value: "channelSalesManager", label: "Channel Sales Manager" },
      { value: "channelDirector", label: "Channel Director" },
    ],
  },
  {
    label: "Operations",
    roles: [
      { value: "salesOps", label: "Sales Ops" },
      { value: "dealDesk", label: "Deal Desk" },
      { value: "finance", label: "Finance" },
      { value: "marketing", label: "Marketing" },
      { value: "itOperations", label: "IT Ops" },
      { value: "securityAdmin", label: "Security Admin" },
    ],
  },
  {
    label: "Admin",
    roles: [
      { value: "primaryAdmin" as AdminRoleValue, label: "Primary Admin" },
      { value: "secondaryAdmin" as AdminRoleValue, label: "Secondary Admin" },
      { value: "departmentAdmin" as AdminRoleValue, label: "Department Admin" },
      { value: "endUser" as AdminRoleValue, label: "End User" },
    ],
  },
];

function FlaskIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      role="img"
      aria-label="Test Mode"
    >
      <title>Test Mode</title>
      <path
        d="M9 3H15M9 3V10L4.5 18C4 19 4.5 21 7 21H17C19.5 21 20 19 19.5 18L15 10V3M9 3H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="15.5" r="1" fill="currentColor" />
      <circle cx="13" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export function TestModeDropdown() {
  const {
    testModeOrgType,
    testModeRole,
    setTestModeOrgType,
    setTestModeRole,
    isTestModeActive,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [switchedToast, setSwitchedToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!IS_TEST_MODE) return null;

  function showSwitchToast(label: string) {
    setSwitchedToast(label);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setSwitchedToast(null), 3000);
  }

  function handleReset() {
    setTestModeOrgType(null);
    setTestModeRole(null);
    setSwitchedToast(null);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Persona switched toast */}
      {switchedToast && (
        <div
          data-ocid="test_mode.switch_toast"
          className="fixed top-14 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a1628] border border-orange-500/50 shadow-xl text-xs text-orange-300 font-medium transition-all duration-300"
        >
          <span className="text-orange-500">⬡</span>
          Persona switched to{" "}
          <span className="text-orange-400 font-semibold">{switchedToast}</span>
        </div>
      )}

      {/* Trigger button */}
      <button
        type="button"
        data-ocid="test_mode.toggle"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-orange-300 transition-colors text-xs font-medium"
      >
        <FlaskIcon />
        <span>Test Mode</span>
        {isTestModeActive && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 uppercase tracking-wider">
            SIMULATION ACTIVE
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          data-ocid="test_mode.panel"
          className="absolute right-0 top-full mt-2 z-50 bg-[#0a1628] border border-white/10 rounded-xl shadow-2xl p-4 w-72"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
            <FlaskIcon />
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              Test Experience Mode
            </span>
          </div>

          {/* Section 1: Org Type */}
          <p className="text-xs text-orange-400 uppercase tracking-wider mb-2">
            Organization Type
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {ORG_TYPES.map(({ value, label }) => {
              const isActive = testModeOrgType === value;
              return (
                <button
                  key={value}
                  type="button"
                  data-ocid={`test_mode.org_type.${value.toLowerCase()}`}
                  onClick={() => setTestModeOrgType(isActive ? null : value)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    isActive
                      ? "bg-orange-500/20 border-orange-500 text-orange-300"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Section 2: Role */}
          <p className="text-xs text-orange-400 uppercase tracking-wider mb-2">
            Operational Role
          </p>
          <div className="space-y-0.5">
            {ROLE_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-2 mb-1">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1">
                  {group.roles.map(({ value, label }) => {
                    const isActive = testModeRole === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        data-ocid={`test_mode.role.${value.toLowerCase()}`}
                        onClick={() => {
                          if (isActive) {
                            setTestModeRole(null);
                          } else {
                            setTestModeRole(value);
                            showSwitchToast(label);
                          }
                        }}
                        className={`text-xs px-2 py-1 rounded border transition-colors ${
                          isActive
                            ? "bg-orange-500/20 border-orange-500 text-orange-300"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Active role description */}
          {testModeRole && ROLE_DESCRIPTIONS[testModeRole] && (
            <div
              data-ocid="test_mode.role_description"
              className="mt-3 px-2.5 py-2 rounded-lg bg-orange-500/8 border border-orange-500/20"
            >
              <p className="text-[11px] text-orange-300/80 leading-relaxed">
                {ROLE_DESCRIPTIONS[testModeRole]}
              </p>
            </div>
          )}

          {/* Reset */}
          <button
            type="button"
            data-ocid="test_mode.reset_button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-orange-400 border border-white/10 rounded px-3 py-1 w-full mt-3 transition-colors"
          >
            Reset Simulation
          </button>
        </div>
      )}
    </div>
  );
}
// ===== TEST_MODE_ONLY END =====
