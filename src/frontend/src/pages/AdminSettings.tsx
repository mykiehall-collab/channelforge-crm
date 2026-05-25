import { DepartmentAllocation } from "@/components/DepartmentAllocation";
import { AIProviderSettings } from "@/components/ForgeAI/AIProviderSettings";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalBlob } from "@caffeineai/object-storage";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Download,
  ExternalLink,
  Eye,
  Hash,
  Lock,
  Mail,
  Moon,
  Network,
  Palette,
  Pencil,
  Plus,
  Settings2,
  ShieldCheck,
  ShieldOff,
  Sun,
  Trash2,
  Upload,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { ActivationStatus, UserRole } from "../backend";
import type {
  AuditEntry,
  CompanyProfile,
  ResidentInvitation,
  UserProfile,
} from "../backend";
import { AuthSettingsSection } from "../components/AuthSettingsSection";
import { CustomFieldManager } from "../components/CustomFieldManager";
import { CustomerIdConfig } from "../components/CustomerIdConfig";
import { VisibilityRulesConfig } from "../components/VisibilityRulesConfig";
import { useActor } from "../hooks/useActor";
import { useDebounce } from "../hooks/useDebounce";
import { useForgeAI } from "../hooks/useForgeAI";
import type { AuditLogLevel } from "../hooks/useForgeAI";
import { useGapNotificationConfig } from "../hooks/useNotifications";
import { useTheme } from "../hooks/useTheme";
import type {
  ForgeAISettings,
  GapNotificationConfig,
  GapNotificationRecipientConfig,
} from "../types";
import { formatDate, getInitials } from "../utils/channelforge";

// ─── Permissions list ─────────────────────────────────────────────────────────
const ALL_PERMISSIONS = [
  { id: "view_accounts", label: "View Accounts" },
  { id: "edit_accounts", label: "Edit Accounts" },
  { id: "upload_contacts", label: "Upload Contacts" },
  { id: "manage_partner_users", label: "Manage Reseller Users" },
  { id: "view_reports", label: "View Reports" },
  { id: "create_reports", label: "Create Reports" },
  { id: "upload_promotions", label: "Upload Promotions" },
  { id: "upload_price_lists", label: "Upload Price Lists" },
  { id: "manage_deal_registrations", label: "Manage Deal Registrations" },
  { id: "view_business_plans", label: "View Business Plans" },
  { id: "edit_business_plans", label: "Edit Business Plans" },
  { id: "manage_account_alerts", label: "Manage Account Alerts" },
  { id: "propose_domain_changes", label: "Propose Domain Changes" },
];

type AdminTab =
  | "company"
  | "partners"
  | "distributors"
  | "users"
  | "audit"
  | "authentication"
  | "forgeai"
  | "customfields"
  | "customerids"
  | "visibility"
  | "appearance";

const TABS: {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "company", label: "Company Profile", icon: Building2 },
  { id: "partners", label: "Reseller Management", icon: Users },
  { id: "distributors", label: "Distributor Management", icon: Network },
  { id: "users", label: "User Management", icon: ShieldCheck },
  { id: "audit", label: "Audit Log", icon: ClipboardList },
  { id: "authentication", label: "Authentication", icon: Lock },
  { id: "forgeai", label: "ForgeAI Settings", icon: Bot },
  { id: "customfields", label: "Custom Fields", icon: Settings2 },
  { id: "customerids", label: "Customer IDs", icon: Hash },
  { id: "visibility", label: "Visibility Rules", icon: Eye },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function formatAction(action: string): string {
  return action
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ActivationBadge({ status }: { status: ActivationStatus }) {
  const cfg: Record<ActivationStatus, { cls: string; label: string }> = {
    [ActivationStatus.Active]: {
      cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
      label: "Active",
    },
    [ActivationStatus.Pending]: {
      cls: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
      label: "Pending",
    },
    [ActivationStatus.Suspended]: {
      cls: "bg-red-500/15 text-red-400 border border-red-500/20",
      label: "Suspended",
    },
  };
  const c = cfg[status] ?? cfg[ActivationStatus.Pending];
  return (
    <span className={`status-badge text-[11px] font-semibold ${c.cls}`}>
      {c.label}
    </span>
  );
}

function InvBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
    Accepted: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    Expired: "bg-secondary/50 text-muted-foreground",
    Cancelled: "bg-secondary/50 text-muted-foreground line-through",
  };
  return (
    <span
      className={`status-badge text-[11px] font-semibold ${map[status] ?? map.Pending}`}
    >
      {status}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AdminSettings() {
  const { userProfile, companyProfile } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>("company");
  const isPrimaryAdmin = userProfile?.isPrimaryAdmin === true;
  const isVendorAdmin =
    userProfile?.role === UserRole.VendorAdmin ||
    userProfile?.role === UserRole.VendorPrimaryAdmin;

  if (!isVendorAdmin) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
        data-ocid="admin.access_restricted"
      >
        <Lock className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-bold font-display text-foreground">
          Access Restricted
        </h2>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          This section is only available to Vendor Admins. Contact your
          administrator for access.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 fade-in" data-ocid="admin.page">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Admin Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your company, partners, users, and audit logs
        </p>
      </div>

      {/* Tab navigation */}
      <div
        className="flex gap-1 border-b border-border overflow-x-auto scrollbar-thin pb-0"
        data-ocid="admin.tabs"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              data-ocid={`admin.${tab.id}.tab`}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="fade-in">
        {activeTab === "company" && (
          <CompanyProfileTab company={companyProfile} />
        )}
        {activeTab === "partners" && (
          <PartnerManagementTab company={companyProfile} />
        )}
        {activeTab === "distributors" && (
          <DistributorManagementTab company={companyProfile} />
        )}
        {activeTab === "users" && (
          <UserManagementTab isPrimaryAdmin={isPrimaryAdmin} />
        )}
        {activeTab === "audit" && <AuditLogTab />}
        {activeTab === "authentication" && companyProfile && (
          <AuthSettingsSection orgId={companyProfile.id} />
        )}
        {activeTab === "forgeai" && isPrimaryAdmin && <ForgeAISettingsTab />}
        {activeTab === "forgeai" && isPrimaryAdmin && (
          <div className="mt-6">
            <AIProviderSettings wsType="vendor" />
          </div>
        )}
        {activeTab === "customerids" && companyProfile && (
          <CustomerIdTab companyId={companyProfile.id} />
        )}
        {activeTab === "forgeai" && !isPrimaryAdmin && (
          <div
            className="flex flex-col items-center justify-center min-h-[400px] gap-4"
            data-ocid="forgeai.access_restricted"
          >
            <ShieldOff className="w-14 h-14 text-muted-foreground" />
            <h2 className="text-xl font-bold font-display text-foreground">
              Primary Admin Required
            </h2>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              ForgeAI settings are only configurable by Primary Admins.
            </p>
          </div>
        )}
        {activeTab === "customfields" && (
          <CustomFieldManager orgType="vendor" canCreate canArchive canLock />
        )}
        {activeTab === "visibility" && companyProfile && (
          <VisibilityRulesConfig orgId={companyProfile.id} orgType="vendor" />
        )}
        {activeTab === "appearance" && <AppearanceTab />}
      </div>
    </div>
  );
}

// ─── Appearance Tab ──────────────────────────────────────────────────────────
function AppearanceTab() {
  const { effectiveTheme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.appearance.panel">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground">
          Theme &amp; Display
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose your preferred display theme for authenticated workspace areas.
          Pre-login screens always use the CHANNELFORGE dark identity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {/* Dark Mode card */}
        <button
          type="button"
          onClick={() => setTheme("dark")}
          data-ocid="admin.appearance.dark_mode.toggle"
          className={`flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all ${
            effectiveTheme === "dark"
              ? "border-accent bg-accent/8 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
              : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                effectiveTheme === "dark" ? "bg-accent/15" : "bg-secondary/50"
              }`}
            >
              <Moon
                className={`w-5 h-5 ${
                  effectiveTheme === "dark"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  effectiveTheme === "dark" ? "text-accent" : "text-foreground"
                }`}
              >
                Dark Mode
              </p>
              {effectiveTheme === "dark" && (
                <p className="text-[11px] text-accent/70 font-medium">
                  Currently active
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Navy backgrounds, dark gradients, orange highlights. Operational
            command-center feel.
          </p>
        </button>

        {/* Light Mode card */}
        <button
          type="button"
          onClick={() => setTheme("light")}
          data-ocid="admin.appearance.light_mode.toggle"
          className={`flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all ${
            effectiveTheme === "light"
              ? "border-accent bg-accent/8 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
              : "border-border bg-card hover:border-border/80 hover:bg-secondary/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                effectiveTheme === "light" ? "bg-accent/15" : "bg-secondary/50"
              }`}
            >
              <Sun
                className={`w-5 h-5 ${
                  effectiveTheme === "light"
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  effectiveTheme === "light" ? "text-accent" : "text-foreground"
                }`}
              >
                Light Mode
              </p>
              {effectiveTheme === "light" && (
                <p className="text-[11px] text-accent/70 font-medium">
                  Currently active
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            White/light grey backgrounds, navy typography, orange accents. Clean
            productivity feel.
          </p>
        </button>
      </div>
    </div>
  );
}

// ─── Distributor Management Tab ─────────────────────────────────────────────
function DistributorManagementTab({
  company,
}: { company: CompanyProfile | null }) {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    companyId: "",
    emailDomain: "",
    primaryAdminEmail: "",
  });

  const SAMPLE_DISTRIBUTORS = [
    {
      id: "dist-1",
      companyName: "Ingram Micro",
      companyId: "INGM0001",
      emailDomain: "ingrammicro.com",
      status: "Active",
      tier: "Platinum",
      resellerCount: 12,
      vendorCount: 3,
    },
    {
      id: "dist-2",
      companyName: "TD Synnex",
      companyId: "SYNN0002",
      emailDomain: "tdsynnex.com",
      status: "Active",
      tier: "Gold",
      resellerCount: 8,
      vendorCount: 2,
    },
    {
      id: "dist-3",
      companyName: "Arrow Electronics",
      companyId: "ARRO0003",
      emailDomain: "arrow.com",
      status: "Pending",
      tier: "Silver",
      resellerCount: 0,
      vendorCount: 1,
    },
  ];

  const TIER_COLORS: Record<string, { bg: string; color: string }> = {
    Silver: { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
    Gold: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
    Platinum: { bg: "rgba(148,163,184,0.12)", color: "#e2e8f0" },
  };

  const _company = company;

  async function handleCreateDistributor(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setCreateOpen(false);
    toast.success(
      `Distributor "${form.companyName}" created. Invitation sent to primary admin.`,
    );
    setForm({
      companyName: "",
      companyId: "",
      emailDomain: "",
      primaryAdminEmail: "",
    });
  }

  return (
    <div className="flex flex-col gap-4" data-ocid="admin.distributors.panel">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {SAMPLE_DISTRIBUTORS.length} distributor
          {SAMPLE_DISTRIBUTORS.length !== 1 ? "s" : ""} connected
        </p>
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          onClick={() => setCreateOpen(true)}
          data-ocid="admin.distributors.create_button"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Distributor
        </Button>
      </div>

      <div className="crm-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[
                  "Company",
                  "Distributor ID",
                  "Domain",
                  "Status",
                  "Tier",
                  "Resellers",
                  "Vendors",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_DISTRIBUTORS.map((d, i) => {
                const tierCfg = TIER_COLORS[d.tier] ?? TIER_COLORS.Silver;
                return (
                  <tr
                    key={d.id}
                    className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                    data-ocid={`admin.distributors.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                          style={{
                            background: "rgba(100,140,220,0.1)",
                            color: "#648CDC",
                          }}
                        >
                          {d.companyName.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground text-xs">
                          {d.companyName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {d.companyId}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      @{d.emailDomain}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`status-badge text-[11px] font-semibold ${
                          d.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : d.status === "Pending"
                              ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                              : "bg-secondary/50 text-muted-foreground"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={{
                          background: tierCfg.bg,
                          color: tierCfg.color,
                          border: `1px solid ${tierCfg.color}40`,
                        }}
                      >
                        {d.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-center text-foreground font-medium">
                      {d.resellerCount}
                    </td>
                    <td className="px-4 py-3 text-xs text-center text-foreground font-medium">
                      {d.vendorCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() =>
                            navigate({ to: `/distributor/${d.id}` })
                          }
                          data-ocid={`admin.distributors.view_button.${i + 1}`}
                        >
                          View
                        </Button>
                        {d.status === "Pending" && (
                          <Button
                            type="button"
                            size="sm"
                            className="h-7 text-xs"
                            data-ocid={`admin.distributors.activate_button.${i + 1}`}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent
          className="max-w-md"
          style={{ background: "#121b2a", border: "1px solid #223047" }}
          data-ocid="admin.distributors.create.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Network className="w-4 h-4" style={{ color: "#648CDC" }} />
              Create Distributor
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateDistributor} className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Distributor Company Name *
              </Label>
              <Input
                required
                value={form.companyName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, companyName: e.target.value }))
                }
                placeholder="e.g. Ingram Micro"
                className="crm-input"
                data-ocid="admin.distributors.company_name.input"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Distributor ID *
              </Label>
              <Input
                required
                value={form.companyId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    companyId: e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 8),
                  }))
                }
                placeholder="e.g. INGM0001"
                className="crm-input font-mono"
                data-ocid="admin.distributors.company_id.input"
              />
              <p className="text-[10px] mt-1 text-muted-foreground">
                4 letters + 4 numbers (e.g. INGM0001)
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Email Domain *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @
                </span>
                <Input
                  required
                  value={form.emailDomain}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      emailDomain: e.target.value.replace(/^@/, ""),
                    }))
                  }
                  placeholder="ingrammicro.com"
                  className="crm-input pl-7"
                  data-ocid="admin.distributors.email_domain.input"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                Primary Admin Email *
              </Label>
              <Input
                required
                type="email"
                value={form.primaryAdminEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, primaryAdminEmail: e.target.value }))
                }
                placeholder="admin@ingrammicro.com"
                className="crm-input"
                data-ocid="admin.distributors.primary_admin_email.input"
              />
              <p className="text-[10px] mt-1 text-muted-foreground">
                An invitation will be sent to this email to complete distributor
                setup.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                data-ocid="admin.distributors.create.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  saving ||
                  !form.companyName ||
                  !form.companyId ||
                  !form.emailDomain ||
                  !form.primaryAdminEmail
                }
                style={{ background: "#648CDC" }}
                className="text-white"
                data-ocid="admin.distributors.create.submit_button"
              >
                {saving ? "Creating..." : "Create Distributor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Company Profile Tab ──────────────────────────────────────────────────────
function CompanyProfileTab({ company }: { company: CompanyProfile | null }) {
  const { refreshUserProfile, companyLogoUrl } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [companyName, setCompanyName] = useState(company?.companyName ?? "");
  const [savingName, setSavingName] = useState(false);
  const [addingDomain, setAddingDomain] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [domains, setDomains] = useState<string[]>(
    company?.partnerDomains ?? [],
  );
  const [confirmRemoveDomain, setConfirmRemoveDomain] = useState<string | null>(
    null,
  );
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(companyLogoUrl);

  useEffect(() => {
    setCompanyName(company?.companyName ?? "");
    setDomains(company?.partnerDomains ?? []);
  }, [company]);
  useEffect(() => {
    setLogoPreview(companyLogoUrl);
  }, [companyLogoUrl]);

  async function saveName() {
    if (!company) return;
    setSavingName(true);
    try {
      toast.success("Company name updated");
      setEditingName(false);
    } finally {
      setSavingName(false);
    }
  }

  async function addDomain() {
    const d = newDomain.trim().toLowerCase();
    if (!d || domains.includes(d)) return;
    setDomains((prev) => [...prev, d]);
    setNewDomain("");
    setAddingDomain(false);
    toast.success(`Reseller domain ${d} added`);
  }

  function removeDomain(domain: string) {
    setDomains((prev) => prev.filter((d) => d !== domain));
    setConfirmRemoveDomain(null);
    toast.success(`Domain ${domain} removed`);
  }

  async function handleLogoUpload(files: FileList | null) {
    if (!files || files.length === 0 || !company) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setUploadingLogo(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const url = blob.getDirectURL();
      setLogoPreview(url);
      await refreshUserProfile();
      toast.success("Company logo updated");
    } catch {
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  }

  return (
    <div
      className="crm-card p-6 flex flex-col gap-6"
      data-ocid="admin.company.panel"
    >
      {/* Logo */}
      <div className="flex flex-col gap-3">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Company Logo
        </Label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border border-border bg-secondary/30 flex items-center justify-center overflow-hidden flex-shrink-0">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-border text-xs h-8 gap-1.5"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
              data-ocid="admin.company_logo.upload_button"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploadingLogo
                ? "Uploading..."
                : logoPreview
                  ? "Change Logo"
                  : "Upload Logo"}
            </Button>
            <p className="text-[10px] text-muted-foreground">
              PNG, JPG, SVG · Shown on login screen and dashboard
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleLogoUpload(e.target.files)}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-border/50" />

      {/* Company name */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Company Name
        </Label>
        {editingName ? (
          <div className="flex gap-2 max-w-sm">
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="crm-input"
              data-ocid="admin.company_name.input"
            />
            <Button
              type="button"
              size="sm"
              onClick={saveName}
              disabled={savingName}
              data-ocid="admin.company_name.save_button"
            >
              {savingName ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEditingName(false)}
              data-ocid="admin.company_name.cancel_button"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-foreground">
              {company?.companyName ?? "—"}
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setEditingName(true)}
              className="text-muted-foreground hover:text-foreground h-7 text-xs gap-1"
              data-ocid="admin.company_name.edit_button"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Email Domain
        </Label>
        <span className="text-sm text-foreground font-mono">
          {company?.emailDomain ?? "—"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Company ID
        </Label>
        <span className="text-sm text-foreground font-mono">
          {company?.companyId ?? "—"}
        </span>
      </div>

      {/* Partner domains */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Reseller Domains
          </Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-border h-7 text-xs"
            onClick={() => setAddingDomain(true)}
            data-ocid="admin.add_domain.button"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Domain
          </Button>
        </div>
        {addingDomain && (
          <div className="flex gap-2 max-w-sm">
            <Input
              placeholder="e.g. partner.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDomain()}
              className="crm-input text-sm"
              data-ocid="admin.new_domain.input"
            />
            <Button
              type="button"
              size="sm"
              onClick={addDomain}
              data-ocid="admin.new_domain.submit_button"
            >
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setAddingDomain(false)}
              data-ocid="admin.new_domain.cancel_button"
            >
              Cancel
            </Button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {domains.length === 0 && (
            <span className="text-sm text-muted-foreground">
              No partner domains configured
            </span>
          )}
          {domains.map((domain) => (
            <div
              key={domain}
              className="flex items-center gap-1.5 bg-secondary/40 border border-border rounded-full px-3 py-1"
            >
              <span className="text-sm font-mono text-foreground">
                {domain}
              </span>
              <button
                type="button"
                onClick={() => setConfirmRemoveDomain(domain)}
                className="text-muted-foreground hover:text-red-400 transition-colors ml-1"
                aria-label={`Remove ${domain}`}
                data-ocid="admin.remove_domain.button"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={!!confirmRemoveDomain}
        onOpenChange={() => setConfirmRemoveDomain(null)}
      >
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Remove Reseller Domain?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-mono text-foreground">
              {confirmRemoveDomain}
            </span>
            ? Resellers using this domain will lose access.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmRemoveDomain(null)}
              data-ocid="admin.remove_domain.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                confirmRemoveDomain && removeDomain(confirmRemoveDomain)
              }
              data-ocid="admin.remove_domain.confirm_button"
            >
              Remove Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Partner Management Tab ───────────────────────────────────────────────────
function PartnerManagementTab({ company }: { company: CompanyProfile | null }) {
  const { actor } = useActor();
  const navigate = useNavigate();
  const { setResellerContext } = useApp();
  const [resellers, setResellers] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CompanyProfile | null>(null);
  const [form, setForm] = useState({
    companyName: "",
    companyId: "",
    emailDomain: "",
    primaryAdminEmail: "",
  });
  const [saving, setSaving] = useState(false);
  const [actionTarget, setActionTarget] = useState<string | null>(null);
  const [resellerIdError, setResellerIdError] = useState<string | null>(null);
  const [suggestedId, setSuggestedId] = useState<string | null>(null);
  const debouncedCompanyName = useDebounce(form.companyName, 500);

  const loadResellers = useCallback(async () => {
    if (!actor || !company) return;
    setLoading(true);
    try {
      const data = await actor.getResellersForVendor(company.id);
      setResellers([...data]);
    } catch {
      toast.error("Failed to load partner list");
    } finally {
      setLoading(false);
    }
  }, [actor, company]);

  useEffect(() => {
    loadResellers();
  }, [loadResellers]);

  // ─── Auto-suggest Reseller ID from company name ─────────────────────────────
  useEffect(() => {
    if (!debouncedCompanyName || editTarget) {
      setSuggestedId(null);
      return;
    }
    const prefix = debouncedCompanyName
      .replace(/[^A-Za-z]/g, "")
      .toUpperCase()
      .slice(0, 4);
    if (prefix.length < 4) {
      setSuggestedId(null);
      return;
    }
    // Find the highest existing number for this prefix
    const existingNums = resellers
      .map((r) => r.companyId)
      .filter((id) => id.length === 8 && id.startsWith(prefix))
      .map((id) => Number.parseInt(id.slice(4), 10))
      .filter((n) => !Number.isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
    setSuggestedId(`${prefix}${String(nextNum).padStart(4, "0")}`);
  }, [debouncedCompanyName, resellers, editTarget]);

  // ─── Reseller ID validation ──────────────────────────────────────────────────
  function validateResellerId(value: string): string | null {
    if (value.length === 0) return null; // empty: handled by required check
    if (/[^A-Z0-9]/.test(value))
      return "Only letters (A-Z) and numbers are allowed — no spaces, hyphens, or symbols.";
    if (value.length !== 8) return "Reseller ID must be exactly 8 characters.";
    if (!/^[A-Z]{4}/.test(value))
      return "The first 4 characters must be letters from the partner name.";
    if (!/[0-9]{4}$/.test(value))
      return "The last 4 characters must be 4 numbers.";
    return null;
  }

  function handleResellerIdChange(raw: string) {
    // Auto-uppercase first 4 chars, allow only alphanumeric
    const sanitized = raw
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 8)
      .replace(/^([A-Za-z]{0,4})/, (m) => m.toUpperCase());
    setForm((f) => ({ ...f, companyId: sanitized }));
    setResellerIdError(validateResellerId(sanitized));
  }

  function applySuggestion() {
    if (!suggestedId) return;
    setForm((f) => ({ ...f, companyId: suggestedId }));
    setResellerIdError(null);
  }

  function openCreate() {
    setForm({
      companyName: "",
      companyId: "",
      emailDomain: "",
      primaryAdminEmail: "",
    });
    setEditTarget(null);
    setResellerIdError(null);
    setSuggestedId(null);
    setCreateOpen(true);
  }

  function openEdit(r: CompanyProfile) {
    setForm({
      companyName: r.companyName,
      companyId: r.companyId,
      emailDomain: r.emailDomain,
      primaryAdminEmail: "",
    });
    setEditTarget(r);
    setResellerIdError(null);
    setSuggestedId(null);
    setCreateOpen(true);
  }

  function validateForm(): string | null {
    if (!form.companyName.trim()) return "Company name is required.";
    if (!form.companyId.trim()) return "Reseller ID is required.";
    const idErr = validateResellerId(form.companyId);
    if (idErr) return idErr;
    if (!form.emailDomain.trim()) return "Email domain is required.";
    if (!editTarget && !form.primaryAdminEmail.trim())
      return "Primary admin email is required.";
    const d = form.emailDomain.trim().toLowerCase();
    if (!editTarget && resellers.some((r) => r.emailDomain === d))
      return `Domain @${d} is already registered to another partner.`;
    if (form.primaryAdminEmail && !form.primaryAdminEmail.endsWith(`@${d}`))
      return `Primary admin email must belong to @${d}.`;
    return null;
  }

  const isFormValid = useMemo(() => {
    if (
      !form.companyName.trim() ||
      !form.companyId.trim() ||
      !form.emailDomain.trim()
    )
      return false;
    if (!editTarget && !form.primaryAdminEmail.trim()) return false;
    const id = form.companyId;
    if (/[^A-Z0-9]/.test(id) || id.length !== 8) return false;
    if (!/^[A-Z]{4}/.test(id) || !/[0-9]{4}$/.test(id)) return false;
    return true;
  }, [form, editTarget]);

  async function handleSave() {
    const err = validateForm();
    if (err) {
      toast.error(err);
      return;
    }
    if (!actor || !company) return;
    setSaving(true);
    try {
      if (editTarget) {
        toast.success(`Partner "${form.companyName}" updated`);
        setCreateOpen(false);
        await loadResellers();
      } else {
        const result = await actor.createReseller(company.id, {
          companyName: form.companyName.trim(),
          companyId: form.companyId.trim(),
          emailDomain: form.emailDomain.trim().toLowerCase(),
          primaryAdminEmail: form.primaryAdminEmail.trim(),
        });
        if (result.__kind__ === "ok") {
          toast.success(`Partner "${form.companyName}" created`);
          setCreateOpen(false);
          await loadResellers();
        } else {
          const errMsg = result.err;
          if (
            errMsg.toLowerCase().includes("already exists") ||
            errMsg.toLowerCase().includes("duplicate")
          ) {
            setResellerIdError(
              "This Reseller ID already exists in your vendor workspace. Please enter a unique ID.",
            );
          } else {
            toast.error(errMsg);
          }
        }
      }
    } catch {
      toast.error("Failed to save reseller");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(resellerId: string) {
    if (!actor) return;
    setActionTarget(resellerId);
    try {
      const result = await actor.activateReseller(resellerId);
      if (result.__kind__ === "ok") {
        toast.success("Reseller activated");
        await loadResellers();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to activate reseller");
    } finally {
      setActionTarget(null);
    }
  }

  async function handleDeactivate(resellerId: string) {
    if (!actor) return;
    setActionTarget(resellerId);
    try {
      const result = await actor.deactivateReseller(resellerId);
      if (result.__kind__ === "ok") {
        toast.success("Reseller suspended");
        await loadResellers();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to suspend reseller");
    } finally {
      setActionTarget(null);
    }
  }

  function viewWorkspace(r: CompanyProfile) {
    setResellerContext({ resellerId: r.id, resellerName: r.companyName });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex flex-col gap-4" data-ocid="admin.partners.panel">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resellers.length} reseller{resellers.length !== 1 ? "s" : ""}{" "}
          connected
        </p>
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          onClick={openCreate}
          data-ocid="admin.partners.create_button"
        >
          <Plus className="w-3.5 h-3.5" />
          Create New Reseller
        </Button>
      </div>

      <div className="crm-card overflow-hidden">
        {loading ? (
          <div
            className="p-4 flex flex-col gap-2"
            data-ocid="admin.partners.loading_state"
          >
            {["s1", "s2", "s3"].map((k) => (
              <Skeleton key={k} className="h-12 w-full bg-secondary/30" />
            ))}
          </div>
        ) : resellers.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 gap-2"
            data-ocid="admin.partners.empty_state"
          >
            <Users className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No resellers yet</p>
            <p className="text-xs text-muted-foreground">
              Create a reseller to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Company",
                    "Reseller ID",
                    "Domain",
                    "Primary Admin",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resellers.map((r, idx) => (
                  <tr
                    key={r.id}
                    data-ocid={`admin.partners.item.${idx + 1}`}
                    className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                          {getInitials(r.companyName)}
                        </div>
                        <p className="text-foreground font-medium text-sm">
                          {r.companyName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-semibold tracking-wider">
                        {r.companyId}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                      @{r.emailDomain}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">
                      {r.claimedBy ?? (
                        <span className="italic text-muted-foreground/60">
                          Not set
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ActivationBadge status={r.activationStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-border text-xs h-7"
                          onClick={() => viewWorkspace(r)}
                          data-ocid={`admin.partners.view_workspace.button.${idx + 1}`}
                        >
                          View Workspace
                        </Button>
                        {r.activationStatus !== ActivationStatus.Active && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs h-7"
                            disabled={actionTarget === r.id}
                            onClick={() => handleActivate(r.id)}
                            data-ocid={`admin.partners.activate.button.${idx + 1}`}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Activate
                          </Button>
                        )}
                        {r.activationStatus === ActivationStatus.Active && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-7"
                            disabled={actionTarget === r.id}
                            onClick={() => handleDeactivate(r.id)}
                            data-ocid={`admin.partners.deactivate.button.${idx + 1}`}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Deactivate
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-foreground text-xs h-7 px-2"
                          onClick={() => openEdit(r)}
                          aria-label="Edit reseller"
                          data-ocid={`admin.partners.edit.button.${idx + 1}`}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="admin.partners.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editTarget
                ? `Edit ${editTarget.companyName}`
                : "Create New Reseller"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            {/* Company Name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Company Name *
              </Label>
              <Input
                value={form.companyName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, companyName: e.target.value }))
                }
                placeholder="Acme Solutions Ltd"
                className="crm-input"
                data-ocid="admin.partners.company_name.input"
              />
            </div>

            {/* Reseller ID */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Reseller ID *
              </Label>
              <div className="relative">
                <Input
                  value={form.companyId}
                  onChange={(e) => handleResellerIdChange(e.target.value)}
                  placeholder="ATEA0001"
                  maxLength={8}
                  className={`crm-input font-mono uppercase tracking-widest pr-10 ${
                    resellerIdError
                      ? "border-red-500/60 focus-visible:ring-red-500/40"
                      : form.companyId.length === 8 && !resellerIdError
                        ? "border-emerald-500/40 focus-visible:ring-emerald-500/30"
                        : ""
                  }`}
                  data-ocid="admin.partners.reseller_id.input"
                  aria-describedby="reseller-id-helper reseller-id-error"
                />
                {form.companyId.length === 8 && !resellerIdError && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
                )}
              </div>

              {/* Inline validation error */}
              {resellerIdError && (
                <p
                  id="reseller-id-error"
                  className="text-xs text-red-400 flex items-center gap-1"
                  data-ocid="admin.partners.reseller_id.error_state"
                >
                  <XCircle className="w-3 h-3 flex-shrink-0" />
                  {resellerIdError}
                </p>
              )}

              {/* Auto-suggestion */}
              {!editTarget &&
                suggestedId &&
                form.companyId !== suggestedId &&
                !resellerIdError && (
                  <div
                    className="flex items-center gap-2 p-2 rounded-md bg-accent/8 border border-accent/20"
                    data-ocid="admin.partners.reseller_id_suggestion.panel"
                  >
                    <span className="text-[11px] text-muted-foreground flex-1">
                      Suggested:{" "}
                      <button
                        type="button"
                        onClick={applySuggestion}
                        className="font-mono font-bold text-accent hover:text-accent/80 transition-colors underline decoration-dotted underline-offset-2"
                        data-ocid="admin.partners.reseller_id_suggestion.button"
                      >
                        {suggestedId}
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={applySuggestion}
                      className="text-[10px] text-accent/80 hover:text-accent px-2 py-0.5 rounded border border-accent/30 hover:border-accent/50 transition-colors"
                      data-ocid="admin.partners.reseller_id_apply.button"
                    >
                      Apply
                    </button>
                  </div>
                )}

              {/* Helper text */}
              <p
                id="reseller-id-helper"
                className="text-[10px] text-muted-foreground"
              >
                Reseller ID must use 4 letters from the partner name followed by
                4 numbers, e.g.{" "}
                <span className="font-mono font-semibold text-foreground/70">
                  ATEA0001
                </span>
                .
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Email Domain *
                </Label>
                <Input
                  value={form.emailDomain}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emailDomain: e.target.value }))
                  }
                  placeholder="acme.com"
                  className="crm-input"
                  data-ocid="admin.partners.email_domain.input"
                />
              </div>
              {!editTarget && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Primary Admin Email *
                  </Label>
                  <Input
                    type="email"
                    value={form.primaryAdminEmail}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        primaryAdminEmail: e.target.value,
                      }))
                    }
                    placeholder={`admin@${form.emailDomain || "partner.com"}`}
                    className="crm-input"
                    data-ocid="admin.partners.primary_admin_email.input"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Must match the partner email domain
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCreateOpen(false)}
              data-ocid="admin.partners.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || !isFormValid}
              data-ocid="admin.partners.save_button"
            >
              {saving
                ? "Saving..."
                : editTarget
                  ? "Save Changes"
                  : "Create Reseller"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── User Management Tab ──────────────────────────────────────────────────────
function UserManagementTab({ isPrimaryAdmin }: { isPrimaryAdmin: boolean }) {
  const { userProfile, companyProfile } = useApp();
  const { actor } = useActor();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [invitations, setInvitations] = useState<ResidentInvitation[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [permModalUser, setPermModalUser] = useState<UserProfile | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [savingPerms, setSavingPerms] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: UserRole.VendorSecondaryAdmin as UserRole,
  });
  const [inviting, setInviting] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [deptMap, setDeptMap] = useState<Record<string, string>>({});

  const isVendorUser =
    userProfile?.role === UserRole.VendorAdmin ||
    userProfile?.role === UserRole.VendorSecondaryAdmin;
  const inviteRoleOptions: { value: UserRole; label: string }[] = isVendorUser
    ? [
        {
          value: UserRole.VendorSecondaryAdmin,
          label: "Vendor Secondary Admin",
        },
      ]
    : [
        { value: UserRole.ResellerAdmin, label: "Reseller Admin" },
        { value: UserRole.ResellerSalesUser, label: "Reseller Sales User" },
      ];

  const loadData = useCallback(async () => {
    if (!actor || !companyProfile) return;
    setLoadingUsers(true);
    try {
      const [usersData, invData] = await Promise.all([
        actor.getUsersByCompany(companyProfile.id),
        actor.getInvitations(companyProfile.id),
      ]);
      setUsers([...usersData]);
      setInvitations([...invData]);
    } catch {
      toast.error("Failed to load user data");
    } finally {
      setLoadingUsers(false);
    }
  }, [actor, companyProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openPermModal(user: UserProfile) {
    setPermModalUser(user);
    setSelectedPerms([...user.permissions]);
  }
  function togglePerm(id: string) {
    setSelectedPerms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  async function savePermissions() {
    if (!actor || !permModalUser) return;
    setSavingPerms(true);
    try {
      const result = await actor.updateSecondaryAdminPermissions(
        permModalUser.id,
        selectedPerms,
      );
      if (result.__kind__ === "ok") {
        toast.success("Permissions updated");
        setPermModalUser(null);
        await loadData();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to update permissions");
    } finally {
      setSavingPerms(false);
    }
  }

  async function handleInvite() {
    if (!actor || !companyProfile) return;
    const emailDomain = inviteForm.email.split("@")[1];
    if (!emailDomain || emailDomain !== companyProfile.emailDomain) {
      toast.error(`Email must belong to @${companyProfile.emailDomain}`);
      return;
    }
    setInviting(true);
    try {
      const result = await actor.inviteUser({
        email: inviteForm.email.trim(),
        role: inviteForm.role,
        companyId: companyProfile.id,
      });
      if (result.__kind__ === "ok") {
        toast.success(`Invitation sent to ${inviteForm.email}`);
        setInviteOpen(false);
        setInviteForm({ email: "", role: UserRole.VendorSecondaryAdmin });
        await loadData();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  }

  async function handleCancelInvite(id: string) {
    if (!actor) return;
    setCancellingId(id);
    try {
      const result = await actor.cancelInvitation(id);
      if (result.__kind__ === "ok") {
        toast.success("Invitation cancelled");
        await loadData();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to cancel invitation");
    } finally {
      setCancellingId(null);
    }
  }

  const roleLabel = (role: string) => {
    const map: Record<string, string> = {
      [UserRole.VendorAdmin]: "Vendor Admin",
      [UserRole.VendorPrimaryAdmin]: "Primary Admin",
      [UserRole.VendorSecondaryAdmin]: "Secondary Admin",
      [UserRole.ResellerAdmin]: "Reseller Admin",
      [UserRole.ResellerPrimaryAdmin]: "Reseller Primary Admin",
      [UserRole.ResellerSalesUser]: "Sales User",
      [UserRole.ReadOnlyViewer]: "Viewer",
    };
    return map[role] ?? role;
  };

  const pendingCount = invitations.filter((i) => i.status === "Pending").length;

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.users.panel">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} user{users.length !== 1 ? "s" : ""}
          {pendingCount > 0
            ? ` \u00b7 ${pendingCount} pending invite${pendingCount !== 1 ? "s" : ""}`
            : ""}
        </p>
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          onClick={() => setInviteOpen(true)}
          data-ocid="admin.users.invite_button"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Invite User
        </Button>
      </div>

      {/* Team members */}
      <div className="crm-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Team Members
          </p>
        </div>
        {loadingUsers ? (
          <div
            className="p-4 flex flex-col gap-2"
            data-ocid="admin.users.loading_state"
          >
            {["s1", "s2", "s3"].map((k) => (
              <Skeleton key={k} className="h-10 w-full bg-secondary/30" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 gap-2"
            data-ocid="admin.users.empty_state"
          >
            <ShieldCheck className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No users yet. Invite team members to get started.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["User", "Email", "Role", "Department", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  data-ocid={`admin.users.item.${idx + 1}`}
                  className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        {getInitials(user.fullName)}
                      </div>
                      <div>
                        <span className="text-foreground font-medium">
                          {user.fullName}
                        </span>
                        {user.isPrimaryAdmin && (
                          <span className="ml-1.5 text-[10px] text-accent font-semibold">
                            (Primary)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="status-badge bg-accent/10 text-accent border border-accent/20">
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {deptMap[user.id] || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {(user.role === UserRole.VendorSecondaryAdmin ||
                      user.role === UserRole.ResellerAdmin) && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-border text-xs h-7"
                        onClick={() => openPermModal(user)}
                        data-ocid={`admin.manage_permissions.button.${idx + 1}`}
                      >
                        <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                        Permissions
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Department & Reporting Permissions */}
      <DepartmentAllocation
        users={users.map((u) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: roleLabel(u.role),
          isPrimary: u.isPrimaryAdmin,
        }))}
        isPrimaryAdmin={isPrimaryAdmin}
        orgType="vendor"
        onDeptChange={(userId, dept) =>
          setDeptMap((prev) => ({ ...prev, [userId]: dept }))
        }
      />

      {/* Invitations */}
      {invitations.length > 0 && (
        <div className="crm-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Pending Invitations
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Email", "Role", "Invited By", "Expires", "Status", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv, idx) => (
                <tr
                  key={inv.id}
                  data-ocid={`admin.invitations.item.${idx + 1}`}
                  className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${idx % 2 === 1 ? "bg-secondary/10" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground text-sm">
                        {inv.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {roleLabel(inv.role)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {inv.invitedBy}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {formatDate(inv.expiresAt)}
                  </td>
                  <td className="px-4 py-3">
                    <InvBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-3">
                    {inv.status === "Pending" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7"
                        disabled={cancellingId === inv.id}
                        onClick={() => handleCancelInvite(inv.id)}
                        data-ocid={`admin.invitations.cancel.button.${idx + 1}`}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="admin.invite.dialog"
        >
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Email Address *
              </Label>
              <Input
                type="email"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder={`user@${companyProfile?.emailDomain ?? "company.com"}`}
                className="crm-input"
                data-ocid="admin.invite.email.input"
              />
              <p className="text-[10px] text-muted-foreground">
                Must match @
                {companyProfile?.emailDomain ?? "your company domain"}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Role *</Label>
              <select
                value={inviteForm.role}
                onChange={(e) =>
                  setInviteForm((f) => ({
                    ...f,
                    role: e.target.value as UserRole,
                  }))
                }
                className="crm-input text-sm w-full px-3 py-2 bg-input border border-border rounded-[0.5rem] text-foreground"
                data-ocid="admin.invite.role.select"
              >
                {inviteRoleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setInviteOpen(false)}
              data-ocid="admin.invite.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleInvite}
              disabled={inviting || !inviteForm.email}
              data-ocid="admin.invite.submit_button"
            >
              {inviting ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions modal */}
      <Dialog
        open={!!permModalUser}
        onOpenChange={() => setPermModalUser(null)}
      >
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="admin.permissions.dialog"
        >
          <DialogHeader>
            <DialogTitle>Permissions — {permModalUser?.fullName}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            All permissions are off by default. Enable only what this user
            needs.
          </p>
          <div className="grid grid-cols-1 gap-3 py-2 max-h-[340px] overflow-y-auto scrollbar-thin pr-1">
            {ALL_PERMISSIONS.map((perm) => (
              <div key={perm.id} className="flex items-center gap-3">
                <Checkbox
                  id={perm.id}
                  checked={selectedPerms.includes(perm.id)}
                  onCheckedChange={() => togglePerm(perm.id)}
                  className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent focus-visible:ring-accent"
                  data-ocid={`admin.perm.${perm.id}.checkbox`}
                />
                <Label
                  htmlFor={perm.id}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {perm.label}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPermModalUser(null)}
              data-ocid="admin.permissions.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={savePermissions}
              disabled={savingPerms}
              data-ocid="admin.permissions.save_button"
            >
              {savingPerms ? "Saving..." : "Save Permissions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Audit Log Tab ───────────────────────────────────────────────────

function AuditLogTab() {
  const { actor } = useActor();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAuditLog(BigInt(200))
      .then((res: AuditEntry[]) => {
        setEntries(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="audit.loading_state"
      >
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" data-ocid="audit.panel">
      <div className="crm-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Audit Log
          </p>
          <span className="text-xs text-muted-foreground">
            {entries.length} entries
          </span>
        </div>
        {entries.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16"
            data-ocid="audit.empty_state"
          >
            <ClipboardList className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No audit entries found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Action", "Entity", "ID", "User", "At", "Details"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {entries.slice(0, 100).map((entry, i) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border/50 hover:bg-muted/20"
                    data-ocid={`audit.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatAction(entry.action)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="status-badge bg-secondary/50 text-muted-foreground">
                        {entry.entityType}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground font-mono truncate max-w-[100px]"
                      title={entry.entityId}
                    >
                      {entry.entityId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.userId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(entry.timestamp)}
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground truncate max-w-[200px]"
                      title={entry.details}
                    >
                      {entry.details}
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

// ─── Gap Notification Config Section ────────────────────────────────────────

interface RecipientToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  ocid: string;
}

function RecipientToggle({
  label,
  checked,
  onChange,
  ocid,
}: RecipientToggleProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-foreground">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-ocid={ocid}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{ background: checked ? "#f97316" : "rgba(255,255,255,0.08)" }}
      >
        <span
          className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
          style={{
            transform: checked ? "translateX(18px)" : "translateX(2px)",
          }}
        />
      </button>
    </div>
  );
}

interface GapSeverityCardProps {
  severity: "Critical" | "High";
  config: GapNotificationRecipientConfig;
  onChange: (cfg: GapNotificationRecipientConfig) => void;
}

function GapSeverityCard({ severity, config, onChange }: GapSeverityCardProps) {
  const isCritical = severity === "Critical";
  const severityStyle = isCritical
    ? {
        background: "rgba(239,68,68,0.12)",
        color: "#f87171",
        border: "1px solid rgba(239,68,68,0.3)",
      }
    : {
        background: "rgba(251,146,60,0.12)",
        color: "#fb923c",
        border: "1px solid rgba(251,146,60,0.3)",
      };

  function patch(key: keyof GapNotificationRecipientConfig, val: boolean) {
    onChange({ ...config, [key]: val });
  }

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      data-ocid={`forgeai.gap_notif.${severity.toLowerCase()}_card`}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wide"
          style={severityStyle}
        >
          {severity}
        </span>
        <span className="text-xs text-muted-foreground">
          {isCritical
            ? "Critical engagement gaps — immediate action required"
            : "High engagement gaps — elevated risk detected"}
        </span>
      </div>
      <div className="flex flex-col">
        <RecipientToggle
          label="Account Owner"
          checked={config.accountOwner}
          onChange={(v) => patch("accountOwner", v)}
          ocid={`forgeai.gap_notif.${severity.toLowerCase()}.account_owner.toggle`}
        />
        <RecipientToggle
          label="Primary Admin"
          checked={config.primaryAdmin}
          onChange={(v) => patch("primaryAdmin", v)}
          ocid={`forgeai.gap_notif.${severity.toLowerCase()}.primary_admin.toggle`}
        />
        <RecipientToggle
          label="Assigned Distributor"
          checked={config.assignedDistributor}
          onChange={(v) => patch("assignedDistributor", v)}
          ocid={`forgeai.gap_notif.${severity.toLowerCase()}.distributor.toggle`}
        />
        <RecipientToggle
          label="Assigned Reseller"
          checked={config.assignedReseller}
          onChange={(v) => patch("assignedReseller", v)}
          ocid={`forgeai.gap_notif.${severity.toLowerCase()}.reseller.toggle`}
        />
      </div>
    </div>
  );
}

function GapNotificationConfigSection({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const { config, updateConfig, loading, saving } = useGapNotificationConfig();
  const [local, setLocal] = useState<GapNotificationConfig>(config);

  useEffect(() => {
    setLocal(config);
  }, [config]);

  async function handleSave() {
    try {
      await updateConfig(local);
      toast.success("Engagement gap notification settings saved");
    } catch {
      toast.error("Failed to save notification settings");
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      data-ocid="forgeai.gap_notif.section"
    >
      {/* Section header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-card/50 hover:bg-card/80 transition-colors"
        data-ocid="forgeai.gap_notif.toggle"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(249,115,22,0.12)" }}
          >
            <Bell className="w-4 h-4" style={{ color: "#f97316" }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              ForgeAI Engagement Gap Notifications
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure who receives in-app alerts when ForgeAI detects a
              reseller or distributor has become inactive
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="px-5 pt-2 pb-5 flex flex-col gap-4">
          {loading ? (
            <div
              data-ocid="forgeai.gap_notif.loading_state"
              className="space-y-2 py-4"
            >
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <GapSeverityCard
                  severity="Critical"
                  config={local.critical}
                  onChange={(cfg) =>
                    setLocal((prev) => ({ ...prev, critical: cfg }))
                  }
                />
                <GapSeverityCard
                  severity="High"
                  config={local.high}
                  onChange={(cfg) =>
                    setLocal((prev) => ({ ...prev, high: cfg }))
                  }
                />
              </div>

              {/* Deduplication note */}
              <p className="text-[11px] text-muted-foreground/70 flex items-center gap-1.5">
                <span
                  className="inline-block w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: "#f97316" }}
                />
                Alerts are sent at most once per account per 24 hours to prevent
                notification fatigue.
              </p>

              <div className="flex justify-end">
                <Button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  data-ocid="forgeai.gap_notif.save_button"
                  size="sm"
                  className="gap-2 text-xs"
                  style={{ background: "#f97316" }}
                >
                  <Bell className="w-3.5 h-3.5" />
                  {saving ? "Saving…" : "Save Notification Settings"}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Customer ID Tab ────────────────────────────────────────────────────────
function CustomerIdTab({ companyId }: { companyId: string }) {
  return (
    <div className="space-y-4" data-ocid="admin.customerids.panel">
      <CustomerIdConfig vendorId={companyId} isVendor />
    </div>
  );
}

// ─── ForgeAI Settings Tab ─────────────────────────────────────────────────────
type CapabilityKey = keyof NonNullable<ForgeAISettings["aiCapabilities"]>;

const CAPABILITY_LABELS: Record<CapabilityKey, string> = {
  renewalRiskScoring: "Renewal Risk Scoring",
  engagementGapDetection: "Engagement Gap Detection",
  dealRegistrationAnalysis: "Deal Registration Analysis",
  channelHealthScoring: "Channel Health Scoring",
  incentiveIntelligence: "Incentive Intelligence",
  smartQuerySearch: "Smart Queries",
  messagingAssistance: "Messaging Assistance",
};

const CAPABILITY_DESCRIPTIONS: Record<CapabilityKey, string> = {
  renewalRiskScoring:
    "Analyze renewal dates, reseller activity, and pipeline engagement to score at-risk accounts",
  engagementGapDetection:
    "Detect when resellers, distributors, or accounts have been inactive beyond configured thresholds",
  dealRegistrationAnalysis:
    "Identify duplicate registrations, stalled approvals, and conflict detection across deals",
  channelHealthScoring:
    "Generate health scores and trend analysis for vendors, distributors, resellers, and accounts",
  incentiveIntelligence:
    "Surface best-fit promotions, renewal incentives, and upsell opportunities",
  smartQuerySearch:
    "Pre-built AI-assisted smart queries for operational intelligence searches",
  messagingAssistance:
    "Draft reseller outreach, renewal follow-ups, and QBR summaries inside messaging",
};

const RISK_TIER_COLORS: Record<string, { bg: string; color: string }> = {
  Critical: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
  High: { bg: "rgba(251,146,60,0.12)", color: "#fb923c" },
  Medium: { bg: "rgba(234,179,8,0.12)", color: "#facc15" },
  Low: { bg: "rgba(100,140,220,0.12)", color: "#648CDC" },
  Opportunity: { bg: "rgba(52,211,153,0.12)", color: "#34d399" },
};

function ForgeAISettingsTab() {
  const { settings, updateSettings, auditLog } = useForgeAI();
  const [localSettings, setLocalSettings] = useState<ForgeAISettings | null>(
    settings,
  );
  const [auditLogLevel, setAuditLogLevel] =
    useState<AuditLogLevel>("Recommended");
  const [gapNotifOpen, setGapNotifOpen] = useState(true);
  const [capabilitiesOpen, setCapabilitiesOpen] = useState(true);
  const [thresholdsOpen, setThresholdsOpen] = useState(true);
  const [auditOpen, setAuditOpen] = useState(true);
  const [saving, setSaving] = useState(false);

  const local = localSettings;

  function patchLocal(patch: Partial<ForgeAISettings>) {
    setLocalSettings((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function patchCapability(key: CapabilityKey, value: boolean) {
    if (!local) return;
    setLocalSettings((prev) =>
      prev
        ? { ...prev, aiCapabilities: { ...prev.aiCapabilities, [key]: value } }
        : prev,
    );
  }

  async function handleSave() {
    if (!local) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateSettings(local);
    setSaving(false);
    toast.success("ForgeAI settings saved");
  }

  if (!local) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="forgeai.settings.loading_state"
      >
        <Skeleton className="h-8 w-48 bg-secondary/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5" data-ocid="forgeai.settings.panel">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(255,107,43,0.12)",
            border: "1px solid rgba(255,107,43,0.25)",
          }}
        >
          <Bot className="w-4 h-4" style={{ color: "#FF6B2B" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold font-display text-foreground">
              ForgeAI Intelligence Settings
            </h2>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                background: "rgba(255,107,43,0.15)",
                color: "#FF6B2B",
                border: "1px solid rgba(255,107,43,0.3)",
              }}
            >
              Primary Admin
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure AI capabilities, engagement thresholds, and audit logging
            for ForgeAI
          </p>
        </div>
        {/* Master toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground">ForgeAI</span>
          <button
            type="button"
            onClick={() => patchLocal({ enabled: !local.enabled })}
            data-ocid="forgeai.master_toggle"
            aria-label={local.enabled ? "Disable ForgeAI" : "Enable ForgeAI"}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            style={{
              background: local.enabled ? "#FF6B2B" : "rgba(100,116,139,0.4)",
            }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
              style={{
                transform: local.enabled
                  ? "translateX(24px)"
                  : "translateX(4px)",
              }}
            />
          </button>
          <span
            className="text-xs font-semibold w-6"
            style={{ color: local.enabled ? "#FF6B2B" : "#64748b" }}
          >
            {local.enabled ? "ON" : "OFF"}
          </span>
        </div>
      </div>

      {/* ── Subsection 1: AI Capabilities ──────────────────────────────────── */}
      <div
        className="crm-card overflow-hidden"
        data-ocid="forgeai.capabilities.section"
      >
        <button
          type="button"
          onClick={() => setCapabilitiesOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/10 transition-colors"
          data-ocid="forgeai.capabilities.toggle"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" style={{ color: "#FF6B2B" }} />
            <span className="text-sm font-semibold text-foreground">
              AI Capabilities
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {Object.values(local.aiCapabilities).filter(Boolean).length} of{" "}
              {Object.values(local.aiCapabilities).length} enabled
            </span>
          </div>
          {capabilitiesOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {capabilitiesOpen && (
          <div className="border-t border-border/50">
            {(Object.keys(CAPABILITY_LABELS) as CapabilityKey[]).map(
              (key, idx) => {
                const isEnabled = local.aiCapabilities[key];
                const isDisabled = !local.enabled;
                return (
                  <div
                    key={key}
                    className={`flex items-start gap-4 px-5 py-3.5 ${idx < Object.keys(CAPABILITY_LABELS).length - 1 ? "border-b border-border/30" : ""} ${isDisabled ? "opacity-50" : ""}`}
                    data-ocid={`forgeai.capability.${key}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {CAPABILITY_LABELS[key]}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {CAPABILITY_DESCRIPTIONS[key]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                      <span
                        className="text-[10px] font-semibold w-6 text-right"
                        style={{
                          color:
                            isEnabled && !isDisabled ? "#FF6B2B" : "#64748b",
                        }}
                      >
                        {isEnabled ? "ON" : "OFF"}
                      </span>
                      <button
                        type="button"
                        disabled={isDisabled}
                        onClick={() => patchCapability(key, !isEnabled)}
                        data-ocid={`forgeai.capability.${key}.toggle`}
                        aria-label={`${isEnabled ? "Disable" : "Enable"} ${CAPABILITY_LABELS[key]}`}
                        className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed"
                        style={{
                          background:
                            isEnabled && !isDisabled
                              ? "#FF6B2B"
                              : "rgba(100,116,139,0.4)",
                        }}
                      >
                        <span
                          className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                          style={{
                            transform: isEnabled
                              ? "translateX(20px)"
                              : "translateX(3px)",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* ── Subsection 2: Engagement Gap Thresholds ────────────────────────── */}
      <div
        className="crm-card overflow-hidden"
        data-ocid="forgeai.thresholds.section"
      >
        <button
          type="button"
          onClick={() => setThresholdsOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/10 transition-colors"
          data-ocid="forgeai.thresholds.toggle"
        >
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" style={{ color: "#FF6B2B" }} />
            <span className="text-sm font-semibold text-foreground">
              Engagement Gap Thresholds
            </span>
          </div>
          {thresholdsOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {thresholdsOpen && (
          <div className="border-t border-border/50 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground block">
                Reseller Inactivity Threshold (days)
              </Label>
              <Input
                type="number"
                min={7}
                max={365}
                value={local.engagementGapThresholdReseller}
                onChange={(e) =>
                  patchLocal({
                    engagementGapThresholdReseller: Math.min(
                      365,
                      Math.max(7, Number(e.target.value)),
                    ),
                  })
                }
                className="crm-input max-w-[160px]"
                data-ocid="forgeai.thresholds.reseller.input"
              />
              <p className="text-[10px] text-muted-foreground">
                Alert when a reseller has not engaged in this many days (7–365)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground block">
                Distributor Inactivity Threshold (days)
              </Label>
              <Input
                type="number"
                min={7}
                max={365}
                value={local.engagementGapThresholdDistributor}
                onChange={(e) =>
                  patchLocal({
                    engagementGapThresholdDistributor: Math.min(
                      365,
                      Math.max(7, Number(e.target.value)),
                    ),
                  })
                }
                className="crm-input max-w-[160px]"
                data-ocid="forgeai.thresholds.distributor.input"
              />
              <p className="text-[10px] text-muted-foreground">
                Alert when a distributor has not engaged in this many days
                (7–365)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground block">
                Warning Threshold (days, first alert)
              </Label>
              <Input
                type="number"
                min={7}
                max={90}
                value={14}
                onChange={() => {}}
                className="crm-input max-w-[160px]"
                data-ocid="forgeai.thresholds.warning.input"
              />
              <p className="text-[10px] text-muted-foreground">
                First-level warning before escalation fires (7–90)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground block">
                Escalation Threshold (days)
              </Label>
              <Input
                type="number"
                min={14}
                max={180}
                value={local.escalationDays}
                onChange={(e) =>
                  patchLocal({
                    escalationDays: Math.min(
                      180,
                      Math.max(14, Number(e.target.value)),
                    ),
                  })
                }
                className="crm-input max-w-[160px]"
                data-ocid="forgeai.thresholds.escalation.input"
              />
              <p className="text-[10px] text-muted-foreground">
                Days after warning before escalation alert is triggered (14–180)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Subsection 3: Audit Logging ─────────────────────────────────────── */}
      <div
        className="crm-card overflow-hidden"
        data-ocid="forgeai.audit.section"
      >
        <button
          type="button"
          onClick={() => setAuditOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-secondary/10 transition-colors"
          data-ocid="forgeai.audit.toggle"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" style={{ color: "#FF6B2B" }} />
            <span className="text-sm font-semibold text-foreground">
              Audit Logging
            </span>
          </div>
          {auditOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {auditOpen && (
          <div className="border-t border-border/50">
            {/* Audit level selector */}
            <div className="px-5 py-4 border-b border-border/30">
              <Label className="text-xs text-muted-foreground block mb-2">
                Audit Log Level
              </Label>
              <div className="flex gap-2 flex-wrap">
                {(["Full", "Recommended", "Minimal"] as AuditLogLevel[]).map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setAuditLogLevel(level)}
                      data-ocid={`forgeai.audit.level.${level.toLowerCase()}`}
                      className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors border"
                      style={
                        auditLogLevel === level
                          ? {
                              background: "rgba(255,107,43,0.15)",
                              color: "#FF6B2B",
                              borderColor: "rgba(255,107,43,0.4)",
                            }
                          : {
                              background: "transparent",
                              color: "#64748b",
                              borderColor: "rgba(100,116,139,0.2)",
                            }
                      }
                    >
                      {level}
                    </button>
                  ),
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {auditLogLevel === "Full" &&
                  "Log all ForgeAI analyses, smart queries, and background processing"}
                {auditLogLevel === "Recommended" &&
                  "Log critical and high-risk analyses and all user-initiated queries"}
                {auditLogLevel === "Minimal" &&
                  "Log only user-initiated actions — no background analysis logging"}
              </p>
            </div>
            {/* Compact audit table */}
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Analysis Type",
                      "Entity",
                      "Risk Level",
                      "Timestamp",
                      "Triggered By",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-2.5 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLog.slice(0, 10).map((entry, idx) => {
                    const tierCfg =
                      RISK_TIER_COLORS[entry.riskLevel] ?? RISK_TIER_COLORS.Low;
                    return (
                      <tr
                        key={entry.entryId}
                        className={`border-b border-border/30 hover:bg-secondary/10 transition-colors ${idx % 2 === 1 ? "bg-secondary/5" : ""}`}
                        data-ocid={`forgeai.audit.item.${idx + 1}`}
                      >
                        <td className="px-4 py-2.5 text-xs text-foreground font-medium">
                          {entry.analysisType}
                        </td>
                        <td
                          className="px-4 py-2.5 text-xs text-muted-foreground max-w-[160px] truncate"
                          title={entry.entityName}
                        >
                          {entry.entityName}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: tierCfg.bg,
                              color: tierCfg.color,
                              border: `1px solid ${tierCfg.color}30`,
                            }}
                          >
                            {entry.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(Number(entry.timestamp)).toLocaleString(
                            "en-GB",
                            { dateStyle: "short", timeStyle: "short" },
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {entry.triggeredBy}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* View full log link */}
            <div className="px-5 py-3 border-t border-border/30">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-7 gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  toast.info(
                    "Full ForgeAI audit log available in the ForgeAI dashboard",
                  )
                }
                data-ocid="forgeai.audit.view_full_button"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Full Audit Log
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── ForgeAI Engagement Gap Notifications ──────────────────────────────────── */}
      <GapNotificationConfigSection
        open={gapNotifOpen}
        onToggle={() => setGapNotifOpen((v) => !v)}
      />

      {/* ── Data Sovereignty Note ───────────────────────────────────────────── */}
      <div
        className="rounded-xl p-4 flex gap-3"
        style={{
          background: "rgba(255,107,43,0.06)",
          border: "1px solid rgba(255,107,43,0.18)",
        }}
        data-ocid="forgeai.sovereignty.card"
      >
        <ShieldCheck
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          style={{ color: "#FF6B2B" }}
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold" style={{ color: "#FF6B2B" }}>
            AI Intelligence Without Losing Control
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            ForgeAI is designed around a sovereignty-first philosophy. All
            channel intelligence remains within approved organizational
            boundaries with full auditability and enterprise governance — no
            centralized SaaS processing.
          </p>
        </div>
      </div>

      {/* ── Save button ─────────────────────────────────────────────────────── */}
      <div className="flex justify-end pt-1">
        <Button
          type="button"
          disabled={saving}
          onClick={handleSave}
          data-ocid="forgeai.settings.save_button"
          className="gap-2"
          style={{ background: "#FF6B2B" }}
        >
          <Bot className="w-4 h-4" />
          {saving ? "Saving…" : "Save ForgeAI Settings"}
        </Button>
      </div>
    </div>
  );
}
