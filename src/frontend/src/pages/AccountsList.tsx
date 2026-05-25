import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type { CompanyProfile } from "../backend";
import { AccountStatus } from "../backend";
import { BulkUpload } from "../components/BulkUpload";
import { useActor } from "../hooks/useActor";
import {
  accountStatusColor,
  formatCurrency,
  formatDate,
} from "../utils/channelforge";

type RenewalWindow = "all" | "30" | "60" | "90";
type StatusFilter = "all" | AccountStatus;
type RenewalStatus = "all" | "overdue" | "due_soon" | "healthy";
type RiskLevel = "all" | "high" | "medium" | "low";

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: AccountStatus.Active, label: "Active" },
  { value: AccountStatus.AtRisk, label: "At Risk" },
  { value: AccountStatus.Churned, label: "Churned" },
  { value: AccountStatus.Prospect, label: "Prospect" },
];

const RENEWAL_OPTIONS: Array<{ value: RenewalWindow; label: string }> = [
  { value: "all", label: "Any Renewal Date" },
  { value: "30", label: "Due in 30 days" },
  { value: "60", label: "Due in 60 days" },
  { value: "90", label: "Due in 90 days" },
];

const RENEWAL_STATUS_OPTIONS: Array<{ value: RenewalStatus; label: string }> = [
  { value: "all", label: "All Renewal Status" },
  { value: "overdue", label: "Overdue" },
  { value: "due_soon", label: "Due Soon (90d)" },
  { value: "healthy", label: "Healthy" },
];

const RISK_OPTIONS: Array<{ value: RiskLevel; label: string }> = [
  { value: "all", label: "All Risk Levels" },
  { value: "high", label: "High Risk" },
  { value: "medium", label: "Medium Risk" },
  { value: "low", label: "Low Risk" },
];

function renewalDays(ns: bigint): number {
  return (Number(ns) / 1_000_000 - Date.now()) / 86_400_000;
}

function RenewalCell({ ns }: { ns: bigint }) {
  if (!ns) return <span className="text-muted-foreground">—</span>;
  const days = renewalDays(ns);
  const color =
    days <= 30
      ? "text-red-400"
      : days <= 90
        ? "text-yellow-400"
        : "text-green-400";
  return <span className={color}>{formatDate(ns)}</span>;
}

export function AccountsList() {
  const {
    accounts: allAccounts,
    loading,
    refreshAccounts,
    isVendor,
    isReseller,
    isDistributor,
    isOrgAccessible,
    hasPermission,
    userProfile,
  } = useApp();
  const { actor } = useActor();
  const navigate = useNavigate();

  // Reseller-scoped accounts: resellers only see their own
  const [resellerAccounts, setResellerAccounts] = useState(allAccounts);
  const [resellerProfiles, setResellerProfiles] = useState<CompanyProfile[]>(
    [],
  );
  const [loadingScoped, setLoadingScoped] = useState(false);

  useEffect(() => {
    if (!actor) return;
    if (isReseller() && userProfile?.companyId) {
      setLoadingScoped(true);
      actor
        .getAccountsByReseller(userProfile.companyId)
        .then(setResellerAccounts)
        .catch(() => {})
        .finally(() => setLoadingScoped(false));
    } else {
      setResellerAccounts(allAccounts);
    }
  }, [actor, isReseller, userProfile, allAccounts]);

  // Load reseller profiles for vendor filter dropdown
  useEffect(() => {
    if (!actor || !isVendor() || !userProfile?.companyId) return;
    actor
      .getResellersForVendor(userProfile.companyId)
      .then(setResellerProfiles)
      .catch(() => {});
  }, [actor, isVendor, userProfile]);

  const accounts = isReseller() ? resellerAccounts : allAccounts;

  // ORG-ISOLATION: filter by accessible orgs only
  const orgIsolatedAccounts = accounts.filter((a) => {
    const vendorDom = (a as any).vendorDomain || "";
    const distDom = (a as any).distributorDomain || "";
    if (isVendor() && vendorDom) return isOrgAccessible(vendorDom);
    if (isDistributor() && distDom) return isOrgAccessible(distDom);
    return true;
  });

  const isLoading = loading || loadingScoped;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [renewalWindow, setRenewalWindow] = useState<RenewalWindow>("all");
  const [renewalStatus, setRenewalStatus] = useState<RenewalStatus>("all");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("all");
  const [regionFilter, setRegionFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [resellerFilter, setResellerFilter] = useState("");
  const [contractValueMin, setContractValueMin] = useState("");
  const [contractValueMax, setContractValueMax] = useState("");
  const [accountManagerFilter, setAccountManagerFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    accountName: "",
    customerDomain: "",
    resellerOwnerId: "",
    vendorOwnerId: "",
    contractType: "",
    estimatedRenewalValue: "",
    customerIdNumber: "",
  });
  // Customer ID state
  const [customerIdStatus, setCustomerIdStatus] = useState<
    "idle" | "checking" | "valid" | "duplicate" | "invalid"
  >("idle");
  const [customerIdMessage, setCustomerIdMessage] = useState("");
  const [customerIdFormat, setCustomerIdFormat] = useState("");
  const [generatingId, setGeneratingId] = useState(false);

  const canCreate = isVendor() || hasPermission("edit_accounts");

  // Load vendor Customer ID format for hint
  useEffect(() => {
    if (!actor || !userProfile?.companyId) return;
    actor
      .getCustomerIdFormatRule(userProfile.companyId)
      .then((rule) => {
        if (rule) setCustomerIdFormat(rule.formatPattern);
      })
      .catch(() => {});
  }, [actor, userProfile]);

  // Check duplicates
  const domainCounts = orgIsolatedAccounts.reduce<Record<string, number>>(
    (acc, a) => {
      if (a.customerDomain)
        acc[a.customerDomain] = (acc[a.customerDomain] ?? 0) + 1;
      return acc;
    },
    {},
  );
  const hasDuplicates = Object.values(domainCounts).some((c) => c > 1);

  function getRiskLevel(status: AccountStatus): RiskLevel {
    if (status === AccountStatus.AtRisk) return "high";
    if (status === AccountStatus.Churned) return "high";
    if (status === AccountStatus.Prospect) return "medium";
    return "low";
  }

  const filtered = orgIsolatedAccounts.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !a.accountName.toLowerCase().includes(q) &&
        !a.customerDomain.toLowerCase().includes(q) &&
        !a.vendorOwnerId.toLowerCase().includes(q)
      )
        return false;
    }
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (resellerFilter && a.resellerOwnerId !== resellerFilter) return false;
    if (renewalWindow !== "all") {
      const days = renewalDays(a.renewalDate);
      if (days < 0 || days > Number(renewalWindow)) return false;
    }
    if (renewalStatus !== "all") {
      const days = renewalDays(a.renewalDate);
      if (renewalStatus === "overdue" && days >= 0) return false;
      if (renewalStatus === "due_soon" && (days < 0 || days > 90)) return false;
      if (renewalStatus === "healthy" && days < 90) return false;
    }
    if (riskLevel !== "all" && getRiskLevel(a.status) !== riskLevel)
      return false;
    if (productFilter) {
      const q = productFilter.toLowerCase();
      if (!a.productList.some((p) => p.toLowerCase().includes(q))) return false;
    }
    const min = Number.parseFloat(contractValueMin);
    const max = Number.parseFloat(contractValueMax);
    if (!Number.isNaN(min) && a.estimatedRenewalValue < min) return false;
    if (!Number.isNaN(max) && a.estimatedRenewalValue > max) return false;
    if (accountManagerFilter && a.vendorOwnerId !== accountManagerFilter)
      return false;
    return true;
  });

  // Account manager dropdown options (unique vendor owners)
  const accountManagers = Array.from(
    new Set(accounts.map((a) => a.vendorOwnerId).filter(Boolean)),
  );

  async function checkCustomerId(value: string) {
    if (!value.trim() || !actor || !userProfile?.companyId) {
      setCustomerIdStatus("idle");
      setCustomerIdMessage("");
      return;
    }
    setCustomerIdStatus("checking");
    try {
      const isDup = await actor.isCustomerIdDuplicate(
        userProfile.companyId,
        value.trim(),
      );
      if (isDup) {
        setCustomerIdStatus("duplicate");
        setCustomerIdMessage("This Customer ID already exists.");
      } else {
        setCustomerIdStatus("valid");
        setCustomerIdMessage("Customer ID is available.");
      }
    } catch {
      setCustomerIdStatus("idle");
    }
  }

  async function validateCustomerIdFormat(value: string) {
    if (!value.trim() || !actor || !userProfile?.companyId) return;
    try {
      const result = await actor.validateCustomerId(
        userProfile.companyId,
        value.trim(),
      );
      if (!result.isValid && result.errorMessage) {
        setCustomerIdStatus("invalid");
        setCustomerIdMessage(result.errorMessage);
      }
    } catch {
      /* non-blocking */
    }
  }

  async function handleAutoGenerateId() {
    if (!actor || !userProfile?.companyId) return;
    setGeneratingId(true);
    try {
      const result = await actor.generateCustomerId({
        vendorId: userProfile.companyId,
      });
      if (result.isValid && result.formattedId) {
        setForm((f) => ({ ...f, customerIdNumber: result.formattedId ?? "" }));
        setCustomerIdStatus("valid");
        setCustomerIdMessage("Auto-generated ID is available.");
      } else {
        toast.error(result.errorMessage ?? "Failed to generate Customer ID");
      }
    } catch {
      toast.error("Failed to auto-generate Customer ID");
    } finally {
      setGeneratingId(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.createAccount({
        distributorIds: [],
        sites: [],
        accountName: form.accountName,
        customerDomain: form.customerDomain,
        resellerOwnerId: form.resellerOwnerId,
        vendorOwnerId: form.vendorOwnerId,
        contractType: form.contractType,
        estimatedRenewalValue:
          Number.parseFloat(form.estimatedRenewalValue) || 0,
        licenceQuantity: BigInt(0),
        productList: [],
        renewalDate: BigInt(0),
        status: AccountStatus.Prospect,
        customerIdNumber: form.customerIdNumber || undefined,
      });
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      await refreshAccounts();
      setShowCreate(false);
      setForm({
        accountName: "",
        customerDomain: "",
        resellerOwnerId: "",
        vendorOwnerId: "",
        contractType: "",
        estimatedRenewalValue: "",
        customerIdNumber: "",
      });
      setCustomerIdStatus("idle");
      setCustomerIdMessage("");
      toast.success("Account created successfully");
    } catch {
      toast.error("Failed to create account");
    } finally {
      setSaving(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setRenewalWindow("all");
    setRenewalStatus("all");
    setRiskLevel("all");
    setResellerFilter("");
    setRegionFilter("");
    setProductFilter("");
    setContractValueMin("");
    setContractValueMax("");
    setAccountManagerFilter("");
  }

  const hasActiveFilters =
    search ||
    statusFilter !== "all" ||
    renewalWindow !== "all" ||
    renewalStatus !== "all" ||
    riskLevel !== "all" ||
    resellerFilter ||
    regionFilter ||
    productFilter ||
    contractValueMin ||
    contractValueMax ||
    accountManagerFilter;

  const showLoading = isLoading;

  return (
    <div className="space-y-5 fade-in">
      {/* Duplicate warning */}
      {hasDuplicates && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-lg border"
          style={{
            background: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.25)",
          }}
          data-ocid="accounts.duplicate_warning"
        >
          <AlertTriangle
            size={16}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-medium text-red-300">
              Duplicate accounts detected
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Multiple accounts share the same customer domain. Review and merge
              duplicates to maintain data quality.
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              data-ocid="accounts.search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, domain or owner…"
              className="crm-input pl-9"
            />
          </div>

          <select
            data-ocid="accounts.status.select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            data-ocid="accounts.renewal_window.select"
            value={renewalWindow}
            onChange={(e) => setRenewalWindow(e.target.value as RenewalWindow)}
            className="crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
          >
            {RENEWAL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Vendor-only: reseller filter */}
          {isVendor() && resellerProfiles.length > 0 && (
            <select
              data-ocid="accounts.reseller.select"
              value={resellerFilter}
              onChange={(e) => setResellerFilter(e.target.value)}
              className="crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
            >
              <option value="">All Resellers</option>
              {resellerProfiles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.companyName}
                </option>
              ))}
            </select>
          )}

          {/* Advanced filters toggle (vendor only) */}
          {isVendor() && (
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg border border-border"
              data-ocid="accounts.advanced_filters.toggle"
            >
              Filters{" "}
              <ChevronDown
                size={12}
                className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              />
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              data-ocid="accounts.clear_filters.button"
            >
              <X size={12} /> Clear
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {isVendor() && (
              <Button
                type="button"
                variant="outline"
                data-ocid="accounts.import.button"
                onClick={() => setShowImport(true)}
                className="flex-shrink-0"
              >
                <Download size={14} className="mr-1.5" /> Import
              </Button>
            )}
            {canCreate && (
              <Button
                type="button"
                data-ocid="accounts.create.button"
                onClick={() => setShowCreate((v) => !v)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
              >
                <Plus size={14} className="mr-1.5" /> New Account
              </Button>
            )}
          </div>
        </div>

        {/* Advanced filter row — vendor only */}
        {isVendor() && showAdvanced && (
          <div
            className="crm-card p-4 fade-in"
            data-ocid="accounts.advanced_filters.panel"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <select
                data-ocid="accounts.renewal_status.select"
                value={renewalStatus}
                onChange={(e) =>
                  setRenewalStatus(e.target.value as RenewalStatus)
                }
                className="crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
              >
                {RENEWAL_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                data-ocid="accounts.risk_level.select"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                className="crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
              >
                {RISK_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Input
                data-ocid="accounts.product_filter.input"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                placeholder="Filter by product…"
                className="crm-input h-10"
              />
              <Input
                data-ocid="accounts.contract_min.input"
                type="number"
                value={contractValueMin}
                onChange={(e) => setContractValueMin(e.target.value)}
                placeholder="Min value"
                className="crm-input h-10"
              />
              <Input
                data-ocid="accounts.contract_max.input"
                type="number"
                value={contractValueMax}
                onChange={(e) => setContractValueMax(e.target.value)}
                placeholder="Max value"
                className="crm-input h-10"
              />
              {accountManagers.length > 0 && (
                <select
                  data-ocid="accounts.account_manager.select"
                  className="crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer col-span-2 sm:col-span-1"
                  value={accountManagerFilter}
                  onChange={(e) => setAccountManagerFilter(e.target.value)}
                >
                  <option value="">All Account Managers</option>
                  {accountManagers.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              )}
              {/* Distributor filter placeholder */}
              <Input
                data-ocid="accounts.distributor_filter.input"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                placeholder="Filter by region…"
                className="crm-input h-10"
              />
            </div>
          </div>
        )}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="crm-card p-5 fade-in" data-ocid="accounts.create.panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-semibold text-sm">
              New Account
            </h3>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="acc-name"
                className="block text-xs text-muted-foreground mb-1"
              >
                Account Name *
              </label>
              <Input
                id="acc-name"
                required
                data-ocid="accounts.name.input"
                value={form.accountName}
                onChange={(e) =>
                  setForm({ ...form, accountName: e.target.value })
                }
                className="crm-input"
                placeholder="Acme Ltd"
              />
            </div>
            {/* Customer ID field */}
            <div>
              <label
                htmlFor="acc-customer-id"
                className="block text-xs text-muted-foreground mb-1"
              >
                Customer ID
                {customerIdFormat && (
                  <span
                    className="ml-2 font-mono text-[10px]"
                    style={{ color: "#FF6B2B" }}
                  >
                    Format: {customerIdFormat}
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="acc-customer-id"
                    data-ocid="accounts.customer_id.input"
                    value={form.customerIdNumber}
                    onChange={(e) => {
                      setForm({ ...form, customerIdNumber: e.target.value });
                      setCustomerIdStatus("idle");
                      checkCustomerId(e.target.value);
                    }}
                    onBlur={() =>
                      validateCustomerIdFormat(form.customerIdNumber)
                    }
                    className={`crm-input pr-8 ${
                      customerIdStatus === "duplicate" ||
                      customerIdStatus === "invalid"
                        ? "border-red-500/60"
                        : customerIdStatus === "valid"
                          ? "border-emerald-500/40"
                          : ""
                    }`}
                    placeholder="e.g. UK-LON-000145"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {customerIdStatus === "checking" && (
                      <RefreshCw
                        size={13}
                        className="animate-spin text-muted-foreground"
                      />
                    )}
                    {customerIdStatus === "valid" && (
                      <CheckCircle2 size={13} className="text-emerald-400" />
                    )}
                    {(customerIdStatus === "duplicate" ||
                      customerIdStatus === "invalid") && (
                      <X size={13} className="text-red-400" />
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutoGenerateId}
                  disabled={generatingId}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0"
                  style={{
                    background: "rgba(255,107,43,0.1)",
                    color: "#FF6B2B",
                    border: "1px solid rgba(255,107,43,0.25)",
                  }}
                  data-ocid="accounts.customer_id_auto_generate.button"
                >
                  {generatingId ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    "Auto-generate"
                  )}
                </button>
              </div>
              {customerIdMessage && (
                <p
                  className={`text-[10px] mt-1 ${
                    customerIdStatus === "valid"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                  data-ocid="accounts.customer_id.field_error"
                >
                  {customerIdMessage}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="acc-domain"
                className="block text-xs text-muted-foreground mb-1"
              >
                Customer Domain *
              </label>
              <Input
                id="acc-domain"
                required
                data-ocid="accounts.domain.input"
                value={form.customerDomain}
                onChange={(e) =>
                  setForm({ ...form, customerDomain: e.target.value })
                }
                className="crm-input"
                placeholder="acme.com"
              />
            </div>
            <div>
              <label
                htmlFor="acc-reseller"
                className="block text-xs text-muted-foreground mb-1"
              >
                Reseller Owner
              </label>
              <Input
                id="acc-reseller"
                value={form.resellerOwnerId}
                onChange={(e) =>
                  setForm({ ...form, resellerOwnerId: e.target.value })
                }
                className="crm-input"
                placeholder="Partner name or ID"
              />
            </div>
            <div>
              <label
                htmlFor="acc-contract"
                className="block text-xs text-muted-foreground mb-1"
              >
                Contract Type
              </label>
              <Input
                id="acc-contract"
                value={form.contractType}
                onChange={(e) =>
                  setForm({ ...form, contractType: e.target.value })
                }
                className="crm-input"
                placeholder="Annual, 3-year…"
              />
            </div>
            <div>
              <label
                htmlFor="acc-value"
                className="block text-xs text-muted-foreground mb-1"
              >
                Estimated Renewal Value
              </label>
              <Input
                id="acc-value"
                type="number"
                value={form.estimatedRenewalValue}
                onChange={(e) =>
                  setForm({ ...form, estimatedRenewalValue: e.target.value })
                }
                className="crm-input"
                placeholder="25000"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                data-ocid="accounts.cancel.button"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="accounts.submit_button"
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {saving ? "Creating…" : "Create Account"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Import panel — full BulkUpload flow */}
      {showImport && (
        <div className="crm-card p-5 fade-in" data-ocid="accounts.import.panel">
          <BulkUpload
            onComplete={() => {
              setShowImport(false);
              refreshAccounts();
            }}
          />
        </div>
      )}

      {/* Results count */}
      {!showLoading && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} account{filtered.length !== 1 ? "s" : ""}
          {hasActiveFilters ? " matching filters" : " total"}
          {isReseller() && (
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-secondary">
              Your workspace
            </span>
          )}
        </p>
      )}

      {/* Table */}
      <div className="crm-card overflow-hidden">
        {showLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-16"
            data-ocid="accounts.empty_state"
          >
            <Building2 size={40} className="text-muted-foreground mb-4" />
            <p className="text-base font-semibold text-foreground mb-1">
              {hasActiveFilters
                ? "No accounts match your filters"
                : "No accounts yet"}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria."
                : "Add accounts manually or import via CSV/Excel."}
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                onClick={clearFilters}
                data-ocid="accounts.empty.clear_button"
              >
                Clear Filters
              </Button>
            ) : canCreate ? (
              <Button
                onClick={() => setShowCreate(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="accounts.empty.create_button"
              >
                <Plus size={14} className="mr-1.5" /> Create Account
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Account
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Domain
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {isVendor() ? "Reseller Owner" : "Vendor Owner"}
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Renewal Date
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Value
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr
                    key={a.id}
                    data-ocid={`accounts.item.${i + 1}`}
                    onClick={() =>
                      navigate({ to: "/accounts/$id", params: { id: a.id } })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      navigate({ to: "/accounts/$id", params: { id: a.id } })
                    }
                    tabIndex={0}
                    className="border-b border-border/50 last:border-0 hover:bg-[var(--hover-bg)] transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs"
                          style={{
                            background: "rgba(255,107,43,0.15)",
                            color: "#FF6B2B",
                          }}
                        >
                          {a.accountName[0]?.toUpperCase()}
                        </div>
                        <span
                          className="font-medium text-foreground truncate max-w-[200px]"
                          title={a.accountName}
                        >
                          {a.accountName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <span
                        className="truncate max-w-[160px] block"
                        title={a.customerDomain || undefined}
                      >
                        {a.customerDomain || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {(() => {
                        const name = isVendor()
                          ? (resellerProfiles.find(
                              (r) => r.id === a.resellerOwnerId,
                            )?.companyName ?? a.resellerOwnerId)
                          : a.vendorOwnerId;
                        return name ? (
                          <span
                            className="truncate max-w-[160px] block"
                            title={name}
                          >
                            {name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60 italic">
                            Unassigned
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <RenewalCell ns={a.renewalDate} />
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums font-mono text-foreground">
                      {new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                        notation: "compact",
                      }).format(a.estimatedRenewalValue)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`${accountStatusColor(a.status)} min-w-[80px] inline-flex justify-center`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
