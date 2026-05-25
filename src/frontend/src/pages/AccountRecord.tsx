import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  Building2,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Edit2,
  ExternalLink,
  FileText,
  Folder,
  GitBranch,
  Globe,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  RefreshCcw,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { AccountStatus, CustomFieldObjectType } from "../backend";
import type {
  CompanyProfile,
  Contact,
  DealRegistration,
  DuplicateCheckResult,
  Note,
} from "../backend";
import { CustomFieldEditor } from "../components/CustomFieldEditor";
import { CustomFieldRenderer } from "../components/CustomFieldRenderer";
import { ForgeAIRecommendationCard } from "../components/ForgeAIRecommendationCard";
import { PriceCalculator } from "../components/PriceCalculator";
import { useActor } from "../hooks/useActor";
import { useCustomFields } from "../hooks/useCustomFields";
import { useForgeAI } from "../hooks/useForgeAI";
import {
  accountStatusColor,
  dealStatusColor,
  dealStatusLabel,
  formatCurrency,
  formatDate,
  getInitials,
  timeAgo,
} from "../utils/channelforge";

// ─── Types ──────────────────────────────────────────────────────────────────

type Tab =
  | "overview"
  | "contacts"
  | "opportunities"
  | "renewals"
  | "deal-regs"
  | "products"
  | "timeline"
  | "notes"
  | "documents"
  | "tasks"
  | "marketing"
  | "mdf"
  | "stakeholders"
  | "channel-relationships"
  | "ai-insights"
  | "external-access"
  | "price-calculator";

type NoteVisibility =
  | "internal"
  | "external-vendor"
  | "external-distributor"
  | "external-reseller";

const VISIBILITY_PREFIXES: Record<NoteVisibility, string> = {
  internal: "[INTERNAL] ",
  "external-vendor": "[EXTERNAL:vendor] ",
  "external-distributor": "[EXTERNAL:distributor] ",
  "external-reseller": "[EXTERNAL:reseller] ",
};

type OverviewAccount = ReturnType<typeof useApp>["accounts"][number];

// ─── Tab definitions ─────────────────────────────────────────────────────────

const TABS: Array<{
  id: Tab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "opportunities", label: "Opportunities", icon: TrendingUp },
  { id: "renewals", label: "Renewals", icon: Calendar },
  { id: "deal-regs", label: "Deal Registrations", icon: Edit2 },
  { id: "products", label: "Products & Subscriptions", icon: Zap },
  { id: "timeline", label: "Activity Timeline", icon: Target },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "documents", label: "Documents", icon: Folder },
  { id: "tasks", label: "Tasks", icon: CheckCircle2 },
  { id: "marketing", label: "Marketing Activity", icon: Globe },
  { id: "mdf", label: "MDF Activity", icon: MessageSquare },
  { id: "stakeholders", label: "Stakeholders", icon: UserCheck },
  {
    id: "channel-relationships",
    label: "Channel Relationships",
    icon: GitBranch,
  },
  { id: "ai-insights", label: "AI Insights", icon: BrainCircuit },
  { id: "external-access", label: "External Access", icon: Lock },
  { id: "price-calculator", label: "Price Calculator", icon: Calculator },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseNoteVisibility(content: string): {
  visibility: NoteVisibility;
  displayContent: string;
} {
  if (content.startsWith("[EXTERNAL:vendor] "))
    return {
      visibility: "external-vendor",
      displayContent: content.slice("[EXTERNAL:vendor] ".length),
    };
  if (content.startsWith("[EXTERNAL:distributor] "))
    return {
      visibility: "external-distributor",
      displayContent: content.slice("[EXTERNAL:distributor] ".length),
    };
  if (content.startsWith("[EXTERNAL:reseller] "))
    return {
      visibility: "external-reseller",
      displayContent: content.slice("[EXTERNAL:reseller] ".length),
    };
  if (content.startsWith("[INTERNAL] "))
    return {
      visibility: "internal",
      displayContent: content.slice("[INTERNAL] ".length),
    };
  return { visibility: "internal", displayContent: content };
}

function getDaysUntilRenewal(renewalDate: bigint): number | null {
  if (renewalDate <= BigInt(0)) return null;
  return Math.round(
    (Number(renewalDate) / 1_000_000 - Date.now()) / 86_400_000,
  );
}

function getHealthScore(
  status: AccountStatus,
  daysUntilRenewal: number | null,
): number {
  if (status === AccountStatus.Churned) return 15;
  if (status === AccountStatus.AtRisk) return 35;
  if (daysUntilRenewal !== null && daysUntilRenewal <= 30) return 52;
  if (daysUntilRenewal !== null && daysUntilRenewal <= 90) return 68;
  return 82;
}

// ─── CSS-only circular health gauge ────────────────────────────────────────

function HealthGauge({ score }: { score: number }) {
  const colorClass =
    score >= 80
      ? "text-emerald-400"
      : score >= 50
        ? "text-orange-400"
        : "text-red-400/70";
  const label = score >= 80 ? "Healthy" : score >= 50 ? "Moderate" : "At Risk";
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        role="img"
        aria-label={`Health score: ${score}`}
        className={colorClass}
      >
        <title>Health score: {score}</title>
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-white/[0.08]"
        />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
        <text
          x="26"
          y="30"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="currentColor"
        >
          {score}
        </text>
      </svg>
      <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function AccountRecord() {
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/accounts/")[1];
  const navigate = useNavigate();
  const { actor } = useActor();
  const {
    accounts,
    dealRegistrations,
    refreshAccounts,
    userProfile,
    isVendor,
    companyProfile,
    canEditField,
    canEditAccount,
  } = useApp();

  const account = accounts.find((a) => a.id === id);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [copiedId, setCopiedId] = useState(false);
  const [editingCustomFields, setEditingCustomFields] = useState(false);
  const customFields = useCustomFields(
    CustomFieldObjectType.customerAccount,
    id ?? "",
  );

  const [resellerProfiles, setResellerProfiles] = useState<CompanyProfile[]>(
    [],
  );
  const [showReassign, setShowReassign] = useState(false);
  const [newResellerId, setNewResellerId] = useState("");
  const [reassigning, setReassigning] = useState(false);

  const [noteContent, setNoteContent] = useState("");
  const [noteVisibility, setNoteVisibility] =
    useState<NoteVisibility>("internal");
  const [savingNote, setSavingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState("");
  const [timelineFilter, setTimelineFilter] = useState<string>("All");

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    accountName: "",
    customerDomain: "",
    resellerOwnerId: "",
    vendorOwnerId: "",
    contractType: "",
    estimatedRenewalValue: "",
    licenceQuantity: "",
    products: "",
    status: AccountStatus.Active as AccountStatus,
    customerIdNumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [duplicateCheck, setDuplicateCheck] =
    useState<DuplicateCheckResult | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [customerIdStatus, setCustomerIdStatus] = useState<
    "idle" | "checking" | "valid" | "duplicate"
  >("idle");
  const [customerIdMsg, setCustomerIdMsg] = useState("");
  const [generatingId, setGeneratingId] = useState(false);

  useEffect(() => {
    if (!id || !actor) return;
    setDetailLoading(true);
    Promise.all([
      actor.getContactsByAccount(id).catch(() => [] as Contact[]),
      actor.getNotesByAccount(id).catch(() => [] as Note[]),
    ])
      .then(([c, n]) => {
        setContacts(c);
        setNotes([...n].sort((a, b) => Number(b.createdAt - a.createdAt)));
      })
      .finally(() => setDetailLoading(false));
  }, [id, actor]);

  useEffect(() => {
    if (!actor || !isVendor() || !companyProfile?.id) return;
    actor
      .getResellersForVendor(companyProfile.id)
      .then(setResellerProfiles)
      .catch(() => {});
  }, [actor, isVendor, companyProfile]);

  useEffect(() => {
    if (account) {
      setEditForm({
        accountName: account.accountName,
        customerDomain: account.customerDomain,
        resellerOwnerId: account.resellerOwnerId,
        vendorOwnerId: account.vendorOwnerId,
        contractType: account.contractType,
        estimatedRenewalValue: account.estimatedRenewalValue.toString(),
        licenceQuantity: account.licenceQuantity.toString(),
        products: account.productList.join(", "),
        status: account.status,
        customerIdNumber: account.customerIdNumber ?? "",
      });
    }
  }, [account]);

  async function checkDuplicate(name: string, domain: string) {
    if (!actor || !name || !domain) return;
    setCheckingDuplicate(true);
    try {
      const result = await actor.checkAccountDuplicate(name, domain);
      if (result.isDuplicate && result.existingAccountId !== id)
        setDuplicateCheck(result);
      else setDuplicateCheck(null);
    } finally {
      setCheckingDuplicate(false);
    }
  }

  async function handleReassignReseller(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !id || !newResellerId) return;
    setReassigning(true);
    try {
      const result = await actor.reassignAccountReseller(id, newResellerId);
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      await refreshAccounts();
      setShowReassign(false);
      setNewResellerId("");
      toast.success("Reseller reassigned successfully");
    } catch {
      toast.error("Failed to reassign reseller");
    } finally {
      setReassigning(false);
    }
  }

  async function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !id || !account) return;
    setSaving(true);
    try {
      const result = await actor.updateAccount(id, {
        distributorIds: account.distributorIds ?? [],
        sites: account.sites ?? [],
        accountName: editForm.accountName,
        customerDomain: editForm.customerDomain,
        resellerOwnerId: editForm.resellerOwnerId,
        vendorOwnerId: editForm.vendorOwnerId,
        contractType: editForm.contractType,
        estimatedRenewalValue:
          Number.parseFloat(editForm.estimatedRenewalValue) || 0,
        licenceQuantity: BigInt(editForm.licenceQuantity || "0"),
        productList: editForm.products
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        renewalDate: account.renewalDate,
        status: editForm.status,
        customerIdNumber: editForm.customerIdNumber || undefined,
      });
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      await refreshAccounts();
      setShowEdit(false);
      setDuplicateCheck(null);
      toast.success("Account updated");
    } catch {
      toast.error("Failed to update account");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !id || !noteContent.trim()) return;
    setSavingNote(true);
    try {
      await actor.createNote({
        accountId: id,
        content: VISIBILITY_PREFIXES[noteVisibility] + noteContent,
        authorName: userProfile?.fullName ?? "User",
        authorRole: userProfile?.role ?? "Admin",
      });
      const updated = await actor.getNotesByAccount(id);
      setNotes([...updated].sort((a, b) => Number(b.createdAt - a.createdAt)));
      setNoteContent("");
      setNoteVisibility("internal");
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    } finally {
      setSavingNote(false);
    }
  }

  async function handleEditNote(note: Note) {
    if (!actor) return;
    try {
      await actor.updateNote(note.id, note.content);
      const updated = await actor.getNotesByAccount(id);
      setNotes([...updated].sort((a, b) => Number(b.createdAt - a.createdAt)));
      setEditingNoteId(null);
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    }
  }

  async function checkCustomerIdDuplicate(value: string) {
    if (!value.trim() || !actor || !companyProfile?.id) {
      setCustomerIdStatus("idle");
      return;
    }
    setCustomerIdStatus("checking");
    try {
      const isDup = await actor.isCustomerIdDuplicate(
        companyProfile.id,
        value.trim(),
      );
      if (isDup && value !== (account?.customerIdNumber ?? "")) {
        setCustomerIdStatus("duplicate");
        setCustomerIdMsg("This Customer ID is already in use.");
      } else {
        setCustomerIdStatus("valid");
        setCustomerIdMsg("");
      }
    } catch {
      setCustomerIdStatus("idle");
    }
  }

  async function handleAutoGenerateId() {
    if (!actor || !companyProfile?.id) return;
    setGeneratingId(true);
    try {
      const result = await actor.generateCustomerId({
        vendorId: companyProfile.id,
      });
      if (result.isValid && result.formattedId) {
        setEditForm((f) => ({
          ...f,
          customerIdNumber: result.formattedId ?? "",
        }));
        setCustomerIdStatus("valid");
        setCustomerIdMsg("");
      }
    } catch {
      /* ignore */
    } finally {
      setGeneratingId(false);
    }
  }

  function copyCustomerId(cid: string) {
    navigator.clipboard.writeText(cid).then(() => {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    });
  }

  const accountDeals = dealRegistrations.filter((d) => d.accountId === id);
  const { recommendations, engagementGaps, dismissRecommendation } =
    useForgeAI();
  const RISK_ORDER: Record<string, number> = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
    Opportunity: 4,
  };
  const accountRecommendations = recommendations
    .filter(
      (r) => r.affectedEntityId === id || r.affectedEntityType === "Account",
    )
    .sort(
      (a, b) => (RISK_ORDER[a.riskTier] ?? 5) - (RISK_ORDER[b.riskTier] ?? 5),
    )
    .slice(0, 5);
  const accountEngagementGaps = engagementGaps.filter(
    (g) =>
      g.entityId === id ||
      g.entityId === account?.resellerOwnerId ||
      g.entityId === account?.vendorOwnerId,
  );

  if (!account) {
    return (
      <div className="flex flex-col items-center py-20">
        <Building2 size={40} className="text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Account not found</p>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/accounts" })}
          className="mt-4"
        >
          Back to Accounts
        </Button>
      </div>
    );
  }

  const daysUntilRenewal = getDaysUntilRenewal(account.renewalDate);
  const healthScore = getHealthScore(account.status, daysUntilRenewal);
  const riskLevel =
    healthScore >= 80 ? "LOW" : healthScore >= 50 ? "MEDIUM" : "HIGH";
  const riskBadgeClass =
    riskLevel === "LOW"
      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
      : riskLevel === "MEDIUM"
        ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
        : "bg-red-500/15 text-red-400 border border-red-500/25";

  return (
    <div className="fade-in flex flex-col h-full flex-1 min-h-0">
      {/* Back nav */}
      <button
        type="button"
        onClick={() => navigate({ to: "/accounts" })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mb-4"
        data-ocid="account_record.back.button"
      >
        <ArrowLeft size={14} /> Back to Accounts
      </button>

      {/* ── Sticky account header ── */}
      <div className="sticky top-0 z-20 crm-card border-b border-border mb-0 rounded-b-none">
        <div className="px-5 py-4 flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 bg-accent/15 text-accent">
            {account.accountName[0]?.toUpperCase()}
          </div>
          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground font-display truncate">
                {account.accountName}
              </h1>
              <span className={accountStatusColor(account.status)}>
                {account.status}
              </span>
              {account.customerIdNumber && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/25"
                    data-ocid="account_record.customer_id.display"
                  >
                    {account.customerIdNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCustomerId(account.customerIdNumber ?? "")
                    }
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Copy Customer ID"
                    data-ocid="account_record.customer_id.copy_button"
                  >
                    {copiedId ? (
                      <ClipboardCheck size={12} className="text-emerald-400" />
                    ) : (
                      <Clipboard size={12} />
                    )}
                  </button>
                </div>
              )}
            </div>
            {/* Hierarchy */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {account.vendorOwnerId && (
                <>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary/50 text-muted-foreground border border-border">
                    {account.vendorOwnerId}
                  </span>
                  <span className="text-muted-foreground/40 text-xs">→</span>
                </>
              )}
              {account.resellerOwnerId && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                  {account.resellerOwnerId}
                </span>
              )}
              {account.customerDomain && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ExternalLink size={9} />
                  {account.customerDomain}
                </span>
              )}
            </div>
            {/* Renewal + value */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {daysUntilRenewal !== null && (
                <span
                  className={`text-xs font-medium ${daysUntilRenewal <= 30 ? "text-red-400" : daysUntilRenewal <= 90 ? "text-amber-400" : "text-emerald-400"}`}
                >
                  {daysUntilRenewal <= 0
                    ? "Renewal overdue"
                    : `Renewal in ${daysUntilRenewal}d`}
                </span>
              )}
              <span className="text-xs font-bold text-accent">
                {formatCurrency(account.estimatedRenewalValue)}
              </span>
              <span className="text-xs text-muted-foreground">
                {account.licenceQuantity.toString()} seats
              </span>
            </div>
          </div>
          {/* Right: gauge + actions */}
          <div className="flex items-start gap-4 flex-shrink-0">
            <HealthGauge score={healthScore} />
            <div className="flex flex-col gap-1.5 items-end">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskBadgeClass} ${riskLevel === "HIGH" ? "intelligence-pulse" : ""}`}
              >
                ForgeAI: {riskLevel}
              </span>
              {daysUntilRenewal !== null && daysUntilRenewal <= 90 && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Due {formatDate(account.renewalDate)}
                </span>
              )}
              <div className="flex items-center gap-1.5 mt-1">
                {!canEditAccount(account) && (
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(
                        "Contact your admin to request edit access for this account.",
                        {
                          description:
                            "Edit access is governed by your organization's Account Governance settings.",
                          duration: 5000,
                        },
                      )
                    }
                    className="px-3 py-1.5 text-xs border border-orange-500 text-orange-400 rounded hover:bg-orange-500/10 flex items-center gap-1"
                    data-ocid="account_record.request_edit_access.button"
                  >
                    <span>Request Edit Access</span>
                  </button>
                )}
                {canEditAccount(account) && (
                  <button
                    type="button"
                    onClick={() => setShowEdit(true)}
                    className="action-icon-btn"
                    aria-label="Edit account"
                    data-ocid="account_record.edit.open_modal_button"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("timeline");
                  }}
                  className="action-icon-btn"
                  aria-label="Log Activity"
                  data-ocid="account_record.log_activity.button"
                >
                  <Target size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("New Opportunity coming soon")}
                  className="action-icon-btn action-icon-btn-accent"
                  aria-label="New Opportunity"
                  data-ocid="account_record.new_opportunity.button"
                >
                  <Plus size={14} />
                </button>
                {isVendor() && (
                  <button
                    type="button"
                    onClick={() => setShowReassign(true)}
                    className="action-icon-btn"
                    aria-label="Reassign reseller"
                    data-ocid="account_record.reassign.open_modal_button"
                  >
                    <UserCheck size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {!canEditAccount(account) && (
          <div className="mx-6 mb-1 flex items-center gap-2 px-3 py-1 border-l-2 border-orange-500/50 bg-orange-500/5 text-orange-300/80 text-xs">
            <span>🔒</span>
            <span>
              You have view-only access to this account. Contact your admin to
              request edit permissions.
            </span>
          </div>
        )}

        {/* Tab bar */}
        <div
          className="flex gap-1 overflow-x-auto scrollbar-hide border-t border-border px-5"
          data-ocid="account_record.tabs"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const countMap: Partial<Record<Tab, number>> = {
              contacts: contacts.length,
              notes: notes.length,
              "deal-regs": accountDeals.length,
            };
            const count = countMap[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                data-ocid={`account_record.tab.${tab.id}`}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${isActive ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
              >
                <tab.icon size={12} />
                {tab.label}
                {count !== undefined && count > 0 && (
                  <span className="text-[9px] bg-secondary text-muted-foreground px-1 py-0.5 rounded-full font-bold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="crm-card rounded-t-none border-t-0 flex-1 overflow-y-auto min-h-0 flex flex-col">
        <AccountTabContent
          tab={activeTab}
          account={account}
          contacts={contacts}
          notes={notes}
          accountDeals={accountDeals}
          detailLoading={detailLoading}
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          noteVisibility={noteVisibility}
          setNoteVisibility={setNoteVisibility}
          savingNote={savingNote}
          editingNoteId={editingNoteId}
          setEditingNoteId={setEditingNoteId}
          editNoteContent={editNoteContent}
          setEditNoteContent={setEditNoteContent}
          handleAddNote={handleAddNote}
          handleEditNote={handleEditNote}
          parseNoteVisibility={parseNoteVisibility}
          userProfile={userProfile}
          VISIBILITY_PREFIXES={VISIBILITY_PREFIXES}
          timelineFilter={timelineFilter}
          setTimelineFilter={setTimelineFilter}
          accountRecommendations={accountRecommendations}
          accountEngagementGaps={accountEngagementGaps}
          dismissRecommendation={dismissRecommendation}
          editingCustomFields={editingCustomFields}
          setEditingCustomFields={setEditingCustomFields}
          customFields={customFields}
          daysUntilRenewal={daysUntilRenewal}
          healthScore={healthScore}
          setShowEdit={setShowEdit}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Reassign modal */}
      {showReassign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          data-ocid="account_record.reassign.dialog"
        >
          <div className="crm-card w-full max-w-md">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <RefreshCcw size={14} className="text-accent" /> Reassign
                Reseller
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowReassign(false);
                  setNewResellerId("");
                }}
                className="text-muted-foreground hover:text-foreground"
                data-ocid="account_record.reassign.close_button"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleReassignReseller} className="p-6 space-y-4">
              <p className="text-xs text-muted-foreground">
                Reassigning{" "}
                <span className="text-foreground font-medium">
                  {account.accountName}
                </span>{" "}
                to a new reseller. This action is audited.
              </p>
              <div>
                <label
                  htmlFor="reassign-reseller"
                  className="block text-xs text-muted-foreground mb-1"
                >
                  Select Reseller *
                </label>
                {resellerProfiles.length > 0 ? (
                  <select
                    id="reassign-reseller"
                    required
                    value={newResellerId}
                    onChange={(e) => setNewResellerId(e.target.value)}
                    className="crm-input w-full text-sm px-3 py-2 rounded-lg h-10"
                    data-ocid="account_record.reassign.reseller.select"
                  >
                    <option value="">Select a reseller…</option>
                    {resellerProfiles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.companyName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    required
                    value={newResellerId}
                    onChange={(e) => setNewResellerId(e.target.value)}
                    className="crm-input"
                    placeholder="Reseller company ID"
                    data-ocid="account_record.reassign.reseller_id.input"
                  />
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReassign(false);
                    setNewResellerId("");
                  }}
                  data-ocid="account_record.reassign.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={reassigning || !newResellerId}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-ocid="account_record.reassign.confirm_button"
                >
                  {reassigning ? "Reassigning…" : "Confirm Reassign"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          data-ocid="account_record.edit.dialog"
        >
          <div className="crm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-sm font-semibold text-foreground">
                Edit Account
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowEdit(false);
                  setDuplicateCheck(null);
                }}
                className="text-muted-foreground hover:text-foreground"
                data-ocid="account_record.edit.close_button"
              >
                ✕
              </button>
            </div>
            {duplicateCheck && (
              <div
                className="mx-6 mt-4 flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/25"
                data-ocid="account_record.duplicate_warning"
              >
                <AlertTriangle
                  size={15}
                  className="text-amber-400 flex-shrink-0 mt-0.5"
                />
                <div className="text-xs">
                  <p className="font-medium text-amber-300">
                    Possible duplicate detected
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    {duplicateCheck.suggestion}
                  </p>
                </div>
              </div>
            )}
            <form
              onSubmit={handleSaveAccount}
              className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                {
                  id: "edit-name",
                  label: "Account Name *",
                  required: true,
                  fieldKey: "accountName",
                  value: editForm.accountName,
                  onChange: (v: string) => {
                    setEditForm({ ...editForm, accountName: v });
                    checkDuplicate(v, editForm.customerDomain);
                  },
                },
                {
                  id: "edit-domain",
                  label: "Customer Domain *",
                  required: true,
                  fieldKey: "customerDomain",
                  value: editForm.customerDomain,
                  onChange: (v: string) => {
                    setEditForm({ ...editForm, customerDomain: v });
                    checkDuplicate(editForm.accountName, v);
                  },
                  placeholder: "customer.com",
                },
                {
                  id: "edit-reseller",
                  label: "Reseller Owner",
                  fieldKey: "resellerOwnerId",
                  value: editForm.resellerOwnerId,
                  onChange: (v: string) =>
                    setEditForm({ ...editForm, resellerOwnerId: v }),
                },
                {
                  id: "edit-vendor",
                  label: "Vendor Owner",
                  fieldKey: "vendorOwnerId",
                  value: editForm.vendorOwnerId,
                  onChange: (v: string) =>
                    setEditForm({ ...editForm, vendorOwnerId: v }),
                },
                {
                  id: "edit-contract",
                  label: "Contract Type",
                  fieldKey: "contractType",
                  value: editForm.contractType,
                  onChange: (v: string) =>
                    setEditForm({ ...editForm, contractType: v }),
                  placeholder: "Annual, 3-year…",
                },
                {
                  id: "edit-value",
                  label: "Est. Renewal Value",
                  type: "number",
                  fieldKey: "estimatedRenewalValue",
                  value: editForm.estimatedRenewalValue,
                  onChange: (v: string) =>
                    setEditForm({ ...editForm, estimatedRenewalValue: v }),
                },
                {
                  id: "edit-licences",
                  label: "Licence Quantity",
                  type: "number",
                  fieldKey: "licenceQuantity",
                  value: editForm.licenceQuantity,
                  onChange: (v: string) =>
                    setEditForm({ ...editForm, licenceQuantity: v }),
                },
              ].map((f) => {
                const fKey = (f as { fieldKey?: string }).fieldKey ?? f.id;
                const editable = canEditField(fKey, account?.id);
                return (
                  <div key={f.id}>
                    <label
                      htmlFor={f.id}
                      className="block text-xs text-muted-foreground mb-1"
                    >
                      {f.label}
                    </label>
                    {editable ? (
                      <Input
                        id={f.id}
                        required={f.required}
                        type={(f as { type?: string }).type}
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                        className="crm-input"
                        placeholder={
                          (f as { placeholder?: string }).placeholder
                        }
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded bg-slate-800/50 text-slate-300 text-sm border border-slate-700">
                        <Lock className="w-3 h-3 inline text-slate-400" />
                        <span>{f.value || "Not set"}</span>
                        <span className="ml-auto text-xs text-slate-500">
                          Read only
                        </span>
                      </div>
                    )}
                    {f.id === "edit-domain" && checkingDuplicate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Checking for duplicates…
                      </p>
                    )}
                  </div>
                );
              })}
              <div>
                <label
                  htmlFor="edit-status"
                  className="block text-xs text-muted-foreground mb-1"
                >
                  Status
                </label>
                {!canEditField("status", account?.id) ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded bg-slate-800/50 text-slate-300 text-sm border border-slate-700">
                    <span>🔒</span>
                    <span>{editForm.status || "Not set"}</span>
                    <span className="ml-auto text-xs text-slate-500">
                      Read only
                    </span>
                  </div>
                ) : (
                  <select
                    id="edit-status"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as AccountStatus,
                      })
                    }
                    className="crm-input w-full text-sm px-3 py-2 rounded-lg h-10"
                    data-ocid="account_record.edit.status.select"
                  >
                    {Object.values(AccountStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {canEditField("customerIdNumber", account?.id) ? (
                <div className="sm:col-span-2">
                  <label
                    htmlFor="edit-customer-id"
                    className="block text-xs text-muted-foreground mb-1"
                  >
                    Customer ID
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="edit-customer-id"
                        value={editForm.customerIdNumber}
                        onChange={(e) => {
                          setEditForm({
                            ...editForm,
                            customerIdNumber: e.target.value,
                          });
                          checkCustomerIdDuplicate(e.target.value);
                        }}
                        className={`crm-input pr-8 ${customerIdStatus === "duplicate" ? "border-red-500/60" : customerIdStatus === "valid" && editForm.customerIdNumber ? "border-emerald-500/40" : ""}`}
                        placeholder="e.g. UK-LON-000145"
                        data-ocid="account_record.edit.customer_id.input"
                      />
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        {customerIdStatus === "checking" && (
                          <RefreshCw
                            size={12}
                            className="animate-spin text-muted-foreground"
                          />
                        )}
                        {customerIdStatus === "valid" &&
                          editForm.customerIdNumber && (
                            <CheckCircle2
                              size={12}
                              className="text-emerald-400"
                            />
                          )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoGenerateId}
                      disabled={generatingId}
                      className="px-2.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                      data-ocid="account_record.edit.customer_id_auto_generate.button"
                    >
                      {generatingId ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        "Auto-gen"
                      )}
                    </button>
                  </div>
                  {customerIdStatus === "duplicate" && (
                    <p
                      className="text-[10px] text-red-400 mt-1"
                      data-ocid="account_record.edit.customer_id.field_error"
                    >
                      {customerIdMsg}
                    </p>
                  )}
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <p className="block text-xs text-muted-foreground mb-1">
                    Customer ID
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded bg-slate-800/50 text-slate-300 text-sm border border-slate-700">
                    <span>🔒</span>
                    <span>{editForm.customerIdNumber || "Not set"}</span>
                    <span className="ml-auto text-xs text-slate-500">
                      Read only
                    </span>
                  </div>
                </div>
              )}
              {canEditField("products", account?.id) ? (
                <div className="sm:col-span-2">
                  <label
                    htmlFor="edit-products"
                    className="block text-xs text-muted-foreground mb-1"
                  >
                    Products (comma-separated)
                  </label>
                  <Input
                    id="edit-products"
                    value={editForm.products}
                    onChange={(e) =>
                      setEditForm({ ...editForm, products: e.target.value })
                    }
                    className="crm-input"
                    placeholder="Product A, Product B"
                  />
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <p className="block text-xs text-muted-foreground mb-1">
                    Products
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded bg-slate-800/50 text-slate-300 text-sm border border-slate-700">
                    <span>🔒</span>
                    <span>{editForm.products || "Not set"}</span>
                    <span className="ml-auto text-xs text-slate-500">
                      Read only
                    </span>
                  </div>
                </div>
              )}
              <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEdit(false);
                    setDuplicateCheck(null);
                  }}
                  data-ocid="account_record.edit.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-ocid="account_record.edit.save_button"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab content props ───────────────────────────────────────────────────────

type TabContentProps = {
  tab: Tab;
  account: OverviewAccount;
  contacts: Contact[];
  notes: Note[];
  accountDeals: DealRegistration[];
  detailLoading: boolean;
  noteContent: string;
  setNoteContent: (v: string) => void;
  noteVisibility: NoteVisibility;
  setNoteVisibility: (v: NoteVisibility) => void;
  savingNote: boolean;
  editingNoteId: string | null;
  setEditingNoteId: (v: string | null) => void;
  editNoteContent: string;
  setEditNoteContent: (v: string) => void;
  handleAddNote: (e: React.FormEvent) => Promise<void>;
  handleEditNote: (note: Note) => Promise<void>;
  parseNoteVisibility: typeof parseNoteVisibility;
  userProfile: ReturnType<typeof useApp>["userProfile"];
  VISIBILITY_PREFIXES: Record<NoteVisibility, string>;
  timelineFilter: string;
  setTimelineFilter: (v: string) => void;
  accountRecommendations: ReturnType<typeof useForgeAI>["recommendations"];
  accountEngagementGaps: ReturnType<typeof useForgeAI>["engagementGaps"];
  dismissRecommendation: (id: string) => void;
  editingCustomFields: boolean;
  setEditingCustomFields: (v: boolean) => void;
  customFields: ReturnType<typeof useCustomFields>;
  daysUntilRenewal: number | null;
  healthScore: number;
  setShowEdit: (v: boolean) => void;
  setActiveTab: (tab: Tab) => void;
};

function AccountTabContent(props: TabContentProps) {
  const {
    tab,
    account,
    contacts,
    notes,
    accountDeals,
    detailLoading,
    noteContent,
    setNoteContent,
    noteVisibility,
    setNoteVisibility,
    savingNote,
    editingNoteId,
    setEditingNoteId,
    editNoteContent,
    setEditNoteContent,
    handleAddNote,
    handleEditNote,
    parseNoteVisibility: pnv,
    userProfile,
    VISIBILITY_PREFIXES: VP,
    timelineFilter,
    setTimelineFilter,
    accountRecommendations,
    accountEngagementGaps,
    dismissRecommendation,
    editingCustomFields,
    setEditingCustomFields,
    customFields,
    daysUntilRenewal,
    healthScore,
    setShowEdit,
    setActiveTab,
  } = props;

  if (tab === "overview")
    return (
      <TabOverview
        account={account}
        contacts={contacts}
        accountDeals={accountDeals}
        daysUntilRenewal={daysUntilRenewal}
        healthScore={healthScore}
        notes={notes}
        setShowEdit={setShowEdit}
        setActiveTab={setActiveTab}
      />
    );
  if (tab === "contacts")
    return <TabContacts contacts={contacts} detailLoading={detailLoading} />;
  if (tab === "opportunities")
    return <TabOpportunities accountDeals={accountDeals} />;
  if (tab === "renewals")
    return (
      <TabRenewals account={account} daysUntilRenewal={daysUntilRenewal} />
    );
  if (tab === "deal-regs") return <TabDealRegs accountDeals={accountDeals} />;
  if (tab === "products") return <TabProducts account={account} />;
  if (tab === "price-calculator")
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Price Calculator
        </h3>
        <PriceCalculator accountId={account?.id ?? ""} readOnly={false} />
      </div>
    );
  if (tab === "timeline")
    return (
      <TabTimeline
        timelineFilter={timelineFilter}
        setTimelineFilter={setTimelineFilter}
      />
    );
  if (tab === "notes")
    return (
      <TabNotes
        account={account}
        notes={notes}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        noteVisibility={noteVisibility}
        setNoteVisibility={setNoteVisibility}
        savingNote={savingNote}
        editingNoteId={editingNoteId}
        setEditingNoteId={setEditingNoteId}
        editNoteContent={editNoteContent}
        setEditNoteContent={setEditNoteContent}
        handleAddNote={handleAddNote}
        handleEditNote={handleEditNote}
        parseNoteVisibility={pnv}
        userProfile={userProfile}
        VISIBILITY_PREFIXES={VP}
        detailLoading={detailLoading}
      />
    );
  if (tab === "documents")
    return (
      <TabSimple
        title="Documents"
        icon={Folder}
        emptyMsg="Upload contracts, presentations, or documents related to this account."
        actionLabel="Upload Document"
      />
    );
  if (tab === "tasks")
    return (
      <TabSimple
        title="Tasks"
        icon={CheckCircle2}
        emptyMsg="Create tasks to track follow-ups and actions for this account."
        actionLabel="New Task"
      />
    );
  if (tab === "marketing")
    return (
      <TabSimple
        title="Marketing Activity"
        icon={Globe}
        emptyMsg="No marketing activity recorded for this account."
        actionLabel="Log Activity"
      />
    );
  if (tab === "mdf")
    return (
      <TabSimple
        title="MDF Activity"
        icon={MessageSquare}
        emptyMsg="MDF requests linked to this account will appear here."
        actionLabel="New MDF Request"
      />
    );
  if (tab === "stakeholders")
    return (
      <TabSimple
        title="Stakeholders"
        icon={UserCheck}
        emptyMsg="Add key stakeholders to track relationship ownership and contacts."
        actionLabel="Add Stakeholder"
      />
    );
  if (tab === "channel-relationships")
    return <ChannelRelationshipsContent account={account} />;
  if (tab === "ai-insights")
    return (
      <TabAIInsights
        account={account}
        accountRecommendations={accountRecommendations}
        accountEngagementGaps={accountEngagementGaps}
        dismissRecommendation={dismissRecommendation}
        daysUntilRenewal={daysUntilRenewal}
        healthScore={healthScore}
      />
    );
  if (tab === "external-access") return <ExternalAccessTab account={account} />;
  return (
    <TabCustomFields
      customFields={customFields}
      editingCustomFields={editingCustomFields}
      setEditingCustomFields={setEditingCustomFields}
    />
  );
}

// ─── Tab: External Access ───────────────────────────────────────────────────

const MOCK_LINKED_ORGS = [
  {
    id: "adobe",
    name: "Adobe",
    orgType: "VENDOR",
    status: "Active",
    template: "Executive Dashboard",
  },
  {
    id: "ingram",
    name: "Ingram Micro",
    orgType: "DISTRIBUTOR",
    status: "Active",
    template: "MDF Contributor",
  },
  {
    id: "nordic",
    name: "Nordic Cloud Solutions",
    orgType: "RESELLER",
    status: "Pending",
    template: "View Only",
  },
];

const DATA_SECTIONS = [
  "Account Summary",
  "Renewal Dates",
  "Opportunity Pipeline",
  "Deal Registrations",
  "MDF Requests",
  "Pricing/Promotions",
  "Internal Notes",
  "External Shared Notes",
  "Sales Tasks",
  "Escalations",
  "Reports",
  "Dashboards",
  "Forecasting",
  "Stakeholder Mapping",
  "ForgeAI Insights",
];

const SECTION_CATEGORIES: Record<string, { label: string; color: string }> = {
  "Internal Notes": {
    label: "Private",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  "External Shared Notes": {
    label: "Shared",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  "Pricing/Promotions": {
    label: "Restricted",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  "ForgeAI Insights": {
    label: "AI",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
};

const ORG_TYPE_STYLES: Record<string, string> = {
  VENDOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  DISTRIBUTOR: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  RESELLER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const MOCK_ACCESS_REQUESTS = [
  {
    id: "r1",
    orgName: "Adobe",
    section: "Pricing/Promotions",
    reason: "Need visibility for Q3 campaign planning",
  },
  {
    id: "r2",
    orgName: "Ingram Micro",
    section: "Forecasting",
    reason: "Required for joint pipeline review",
  },
  {
    id: "r3",
    orgName: "Nordic Cloud Solutions",
    section: "Deal Registrations",
    reason: "To validate partner-sourced deals",
  },
];

const MOCK_ACTIVITIES = [
  {
    id: "a1",
    org: "VENDOR",
    orgName: "Adobe",
    action: "Updated account health score to 87",
    time: "2 hours ago",
  },
  {
    id: "a2",
    org: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    action: "Approved MDF request #MDF-2024-089",
    time: "4 hours ago",
  },
  {
    id: "a3",
    org: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    action: "Added external shared note on renewal timeline",
    time: "6 hours ago",
  },
  {
    id: "a4",
    org: "VENDOR",
    orgName: "Adobe",
    action: "Changed permission template to Executive Dashboard",
    time: "1 day ago",
  },
  {
    id: "a5",
    org: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    action: "Requested access to Forecasting section",
    time: "1 day ago",
  },
  {
    id: "a6",
    org: "RESELLER",
    orgName: "Nordic Cloud Solutions",
    action: "Uploaded deal registration DR-2024-112",
    time: "2 days ago",
  },
  {
    id: "a7",
    org: "VENDOR",
    orgName: "Adobe",
    action: "Revoked access to Internal Notes for all linked orgs",
    time: "3 days ago",
  },
  {
    id: "a8",
    org: "DISTRIBUTOR",
    orgName: "Ingram Micro",
    action: "Shared QTD pipeline dashboard with Reseller view",
    time: "3 days ago",
  },
];

function ExternalAccessTab({ account: _account }: { account: any }) {
  const [permissions, setPermissions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const org of MOCK_LINKED_ORGS) {
      for (const section of DATA_SECTIONS) {
        const key = `${org.id}::${section}`;
        initial[key] = section === "Internal Notes" ? "hidden" : "read-only";
      }
    }
    return initial;
  });

  const [previewOrgId, setPreviewOrgId] = useState<string>("");
  const [requests, setRequests] = useState(MOCK_ACCESS_REQUESTS);

  const updatePermission = (orgId: string, section: string, value: string) => {
    setPermissions((prev) => ({ ...prev, [`${orgId}::${section}`]: value }));
  };

  const resetToTemplate = (orgId: string) => {
    setPermissions((prev) => {
      const next = { ...prev };
      for (const section of DATA_SECTIONS) {
        next[`${orgId}::${section}`] =
          section === "Internal Notes" ? "hidden" : "read-only";
      }
      return next;
    });
    toast.success(
      `Reset permissions to template defaults for ${MOCK_LINKED_ORGS.find((o) => o.id === orgId)?.name}`,
    );
  };

  const handleApprove = (reqId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    toast.success("Access request approved");
  };

  const handleDeny = (reqId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    toast.error("Access request denied");
  };

  const previewOrg = MOCK_LINKED_ORGS.find((o) => o.id === previewOrgId);

  return (
    <div
      className="space-y-6"
      data-ocid="account_record.external_access.section"
    >
      {/* Preview Banner */}
      {previewOrg && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
          <Lock size={16} />
          <span>
            Previewing as <strong>{previewOrg.name}</strong> — restricted fields
            shown as locked
          </span>
        </div>
      )}

      {/* Header + Preview Select */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lock size={18} className="text-accent" />
            External Channel Link Access
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Control what each linked organisation can see and do on this
            account.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="preview-org-select"
            className="text-xs text-muted-foreground"
          >
            Preview as:
          </label>
          <select
            id="preview-org-select"
            className="text-sm rounded-md border border-border bg-card px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            value={previewOrgId}
            onChange={(e) => setPreviewOrgId(e.target.value)}
            data-ocid="account_record.external_access.preview_select"
          >
            <option value="">— Select org —</option>
            {MOCK_LINKED_ORGS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-card/5 border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Permission Matrix
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => toast.success("Permission changes saved")}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
              data-ocid="account_record.external_access.save_button"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="px-5 py-3 border-b border-border flex flex-wrap gap-2">
          {DATA_SECTIONS.map((section) => {
            const cat = SECTION_CATEGORIES[section];
            return (
              <span
                key={section}
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${cat ? cat.color : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}
              >
                {cat ? cat.label : "Shared"}
                <span className="ml-1 opacity-70">{section}</span>
              </span>
            );
          })}
        </div>

        {/* Matrix table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground sticky left-0 bg-muted/30 z-10 min-w-[180px]">
                  Linked Organisation
                </th>
                {DATA_SECTIONS.map((section) => (
                  <th
                    key={section}
                    className="px-3 py-3 font-medium text-muted-foreground text-center min-w-[110px]"
                  >
                    <span
                      className="block truncate max-w-[100px] mx-auto"
                      title={section}
                    >
                      {section}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 font-medium text-muted-foreground text-left sticky right-0 bg-muted/30 z-10 min-w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LINKED_ORGS.map((org) => (
                <tr
                  key={org.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 sticky left-0 bg-card/5 z-10">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground text-sm">
                        {org.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${ORG_TYPE_STYLES[org.orgType] || "bg-muted text-muted-foreground border-border"}`}
                        >
                          {org.orgType}
                        </span>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${org.status === "Active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}
                        >
                          {org.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {org.template}
                      </span>
                    </div>
                  </td>
                  {DATA_SECTIONS.map((section) => {
                    const key = `${org.id}::${section}`;
                    const value = permissions[key] || "read-only";
                    const isLocked =
                      previewOrgId === org.id && value === "hidden";
                    return (
                      <td key={section} className="px-3 py-3 text-center">
                        <select
                          value={value}
                          onChange={(e) =>
                            updatePermission(org.id, section, e.target.value)
                          }
                          disabled={isLocked}
                          className={`w-full rounded-md border border-border bg-card px-1.5 py-1 text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent ${isLocked ? "opacity-40 cursor-not-allowed" : ""}`}
                          data-ocid={`account_record.external_access.permission.${org.id}.${section}`}
                        >
                          <option value="hidden">Hidden</option>
                          <option value="read-only">Read Only</option>
                          <option value="comment">Comment</option>
                          <option value="edit">Edit</option>
                          <option value="admin-only">Admin Only</option>
                        </select>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 sticky right-0 bg-card/5 z-10">
                    <button
                      type="button"
                      onClick={() => resetToTemplate(org.id)}
                      className="text-[10px] text-muted-foreground hover:text-foreground underline transition-colors"
                      data-ocid={`account_record.external_access.reset_button.${org.id}`}
                    >
                      Reset to Template Defaults
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Access Requests */}
      <div className="bg-card/5 border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Access Requests
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Pending requests from linked organisations for additional account
            access.
          </p>
        </div>
        {requests.length === 0 ? (
          <div
            className="px-5 py-8 text-center text-sm text-muted-foreground"
            data-ocid="account_record.external_access.requests.empty_state"
          >
            No pending access requests.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((req) => (
              <div
                key={req.id}
                className="px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {req.orgName}
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {req.section}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {req.reason}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApprove(req.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                    data-ocid={`account_record.external_access.request.approve_button.${req.id}`}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeny(req.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid={`account_record.external_access.request.deny_button.${req.id}`}
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Org-Tagged Activity Feed */}
      <div className="bg-card/5 border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Shared Activity Feed
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Recent actions and updates from linked organisations on this
            account.
          </p>
        </div>
        <div className="divide-y divide-border">
          {MOCK_ACTIVITIES.map((act) => {
            const badgeStyle =
              act.org === "VENDOR"
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                : act.org === "DISTRIBUTOR"
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            return (
              <div key={act.id} className="px-5 py-3 flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${badgeStyle}`}
                >
                  [{act.org}]
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-foreground">
                    {act.orgName}
                  </span>
                  <span className="text-xs text-muted-foreground mx-1">—</span>
                  <span className="text-xs text-muted-foreground">
                    {act.action}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {act.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Channel Relationships ──────────────────────────────────────────────

function ChannelRelationshipsContent({ account }: { account: any }) {
  const ownershipRoles: Record<
    string,
    { ownerName: string; ownerOrgName: string; ownerType: string }
  > = account?.ownershipRoles || {};

  const roleOrder = [
    { key: "strategic", label: "Strategic Owner" },
    { key: "renewal", label: "Renewal Owner" },
    { key: "operational", label: "Operational Owner" },
    { key: "servicing", label: "Servicing Owner" },
    { key: "escalation", label: "Escalation Owner" },
  ];

  const ownerTypeClass = (type: string) => {
    switch (type) {
      case "vendor":
        return "bg-accent text-accent-foreground";
      case "distributor":
        return "bg-amber-500 text-white";
      case "reseller":
        return "bg-emerald-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 p-5">
      {/* Account Ownership */}
      <div className="bg-card/5 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users size={16} className="text-accent" />
          Account Ownership
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {roleOrder.map((role) => {
            const owner = ownershipRoles[role.key];
            return (
              <div
                key={role.key}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <span className="text-sm text-muted-foreground">
                  {role.label}
                </span>
                {owner ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {owner.ownerName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {owner.ownerOrgName}
                    </span>
                    <Badge
                      className={`text-[10px] ${ownerTypeClass(owner.ownerType)}`}
                    >
                      {owner.ownerType}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-sm italic text-muted-foreground/60">
                    Not assigned
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Incumbent Distributors */}
      <div className="bg-card/5 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-accent" />
          Current Incumbent Distributors
        </h3>
        {account?.incumbentDistributors?.length > 0 ? (
          <div className="space-y-3">
            {account.incumbentDistributors.map((d: any, i: number) => (
              <div
                key={d.distributorId ?? d.distributorName}
                className="flex flex-col gap-2 p-3 rounded-lg bg-background/40 border border-border/60"
                data-ocid={`account_record.distributor.item.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {d.distributorName}
                  </span>
                  {d.isPrimary && (
                    <Badge className="text-[10px] bg-accent/20 text-accent border-accent/30">
                      Primary
                    </Badge>
                  )}
                </div>
                {d.territories?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {d.territories.map((t: string) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {d.servicingResponsibilities?.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {d.servicingResponsibilities.map((r: string) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            No incumbent distributors assigned.
          </div>
        )}
      </div>

      {/* Current Incumbent Resellers */}
      <div className="bg-card/5 rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users size={16} className="text-accent" />
          Current Incumbent Resellers
        </h3>
        {account?.incumbentResellers?.length > 0 ? (
          <div className="space-y-3">
            {account.incumbentResellers.map((r: any, i: number) => (
              <div
                key={r.resellerId ?? r.resellerName}
                className="flex flex-col gap-2 p-3 rounded-lg bg-background/40 border border-border/60"
                data-ocid={`account_record.reseller.item.${i + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {r.resellerName}
                  </span>
                  <div className="flex items-center gap-2">
                    {r.isPrimary && (
                      <Badge className="text-[10px] bg-accent/20 text-accent border-accent/30">
                        Primary
                      </Badge>
                    )}
                    {r.servicingType && (
                      <Badge
                        className={`text-[10px] ${
                          r.servicingType === "renewals"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            : r.servicingType === "support"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                              : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                        }`}
                      >
                        {r.servicingType}
                      </Badge>
                    )}
                  </div>
                </div>
                {r.territories?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.territories.map((t: string) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            No incumbent resellers assigned.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Overview ───────────────────────────────────────────────────────────

function TabOverview({
  account,
  contacts,
  accountDeals,
  daysUntilRenewal,
  healthScore,
  notes,
  setShowEdit,
  setActiveTab,
}: {
  account: OverviewAccount;
  contacts: Contact[];
  accountDeals: DealRegistration[];
  daysUntilRenewal: number | null;
  healthScore: number;
  notes: Note[];
  setShowEdit: (v: boolean) => void;
  setActiveTab: (t: Tab) => void;
}) {
  const fields = [
    { label: "Company Name", value: account.accountName },
    { label: "Customer Domain", value: account.customerDomain || "—" },
    { label: "Customer ID", value: account.customerIdNumber || "Not assigned" },
    { label: "Account Status", value: account.status },
    { label: "Contract Type", value: account.contractType || "—" },
    {
      label: "Assigned Reseller",
      value: account.resellerOwnerId || (
        <span className="italic text-muted-foreground/60">Unassigned</span>
      ),
    },
    { label: "Vendor Manager", value: account.vendorOwnerId || "—" },
    {
      label: "Renewal Date",
      value:
        account.renewalDate > BigInt(0) ? formatDate(account.renewalDate) : "—",
    },
    {
      label: "ARR / Contract Value",
      value: formatCurrency(account.estimatedRenewalValue),
    },
    { label: "Licence Seats", value: account.licenceQuantity.toString() },
    {
      label: "Products",
      value:
        account.productList.length > 0 ? account.productList.join(", ") : "—",
    },
    { label: "Industry", value: "Technology" },
    {
      label: "Annual Revenue",
      value: formatCurrency(account.estimatedRenewalValue * 4.2),
    },
    { label: "Employee Count", value: "250–500" },
  ];
  const quickStats = [
    {
      label: "Open Opportunities",
      value: String(
        accountDeals.filter((d) => d.dealStage && d.dealStage !== "Closed")
          .length,
      ),
      sub: formatCurrency(
        accountDeals.reduce((s, d) => s + (d.estimatedValue || 0), 0),
      ),
      tab: "opportunities" as Tab,
    },
    {
      label: "Active Renewals",
      value: daysUntilRenewal !== null ? "1" : "0",
      sub:
        daysUntilRenewal !== null
          ? `Due in ${daysUntilRenewal}d`
          : "None scheduled",
      tab: "renewals" as Tab,
    },
    {
      label: "Deal Registrations",
      value: String(accountDeals.length),
      sub: `${accountDeals.length} total`,
      tab: "deal-regs" as Tab,
    },
    {
      label: "Contacts",
      value: String(contacts.length),
      sub: "Key relationships",
      tab: "contacts" as Tab,
    },
    {
      label: "Notes",
      value: String(notes.length),
      sub: "Internal + external",
      tab: "notes" as Tab,
    },
    {
      label: "Account Health",
      value: `${healthScore}/100`,
      sub:
        healthScore >= 80
          ? "Healthy"
          : healthScore >= 50
            ? "Moderate"
            : "At Risk",
      tab: null,
    },
  ];
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Account Details
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-secondary/20 rounded-lg px-3 py-2.5"
                >
                  <dt className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                    {label}
                  </dt>
                  <dd className="text-sm text-foreground font-medium break-words">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bg-secondary/10 rounded-lg px-4 py-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Custom Fields
              </h4>
              <button
                type="button"
                onClick={() => setShowEdit(true)}
                className="text-[10px] text-accent hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                "Contract Tier",
                "Region Code",
                "SLA Level",
                "Support Plan",
              ].map((cf) => (
                <div key={cf} className="text-xs">
                  <span className="text-muted-foreground">{cf}:</span>{" "}
                  <span className="text-foreground font-medium">—</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Quick Stats
          </h3>
          {quickStats.map(({ label, value, sub, tab }) => (
            <button
              type="button"
              key={label}
              onClick={() => {
                if (tab) setActiveTab(tab);
              }}
              className="w-full bg-secondary/20 hover:bg-secondary/35 border border-border/50 rounded-lg px-4 py-3 text-left transition-colors"
              data-ocid={`account_record.overview.stat.${label.toLowerCase().replace(/ /g, "_")}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {label}
                </span>
                <span className="text-lg font-bold text-accent font-display">
                  {value}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {sub}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Contacts ──────────────────────────────────────────────────────────

const MOCK_CONTACTS = [
  {
    id: "m1",
    firstName: "Sarah",
    lastName: "Mitchell",
    jobTitle: "VP of Technology",
    email: "s.mitchell@customer.com",
    phone: "+44 7700 900123",
    isPrimary: true,
  },
  {
    id: "m2",
    firstName: "James",
    lastName: "Harrington",
    jobTitle: "IT Director",
    email: "j.harrington@customer.com",
    phone: "+44 7700 900456",
    isPrimary: false,
  },
  {
    id: "m3",
    firstName: "Emma",
    lastName: "Thornton",
    jobTitle: "Procurement Manager",
    email: "e.thornton@customer.com",
    phone: "+44 7700 900789",
    isPrimary: false,
  },
];

function TabContacts({
  contacts,
  detailLoading,
}: { contacts: Contact[]; detailLoading: boolean }) {
  const display =
    contacts.length > 0
      ? contacts.map((c) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          jobTitle: c.jobTitle,
          email: c.email,
          phone: c.phone ?? "",
          isPrimary: false,
        }))
      : MOCK_CONTACTS;
  return (
    <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Contacts ({display.length})
        </h3>
        <Button
          type="button"
          size="sm"
          onClick={() => toast.info("Add Contact coming soon")}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          data-ocid="account_record.contacts.add_button"
        >
          <Plus size={13} className="mr-1" /> Add Contact
        </Button>
      </div>
      {detailLoading ? (
        <div className="p-5 space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {display.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors"
              data-ocid={`account_record.contact.item.${i + 1}`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-accent/15 text-accent">
                {getInitials(`${c.firstName} ${c.lastName}`)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {c.firstName} {c.lastName}
                  </p>
                  {c.isPrimary && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                      PRIMARY
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{c.jobTitle}</p>
              </div>
              <div className="text-right flex-shrink-0 hidden sm:block">
                <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                  <Mail size={11} />
                  {c.email}
                </div>
                {c.phone && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end mt-0.5">
                    <Phone size={11} />
                    {c.phone}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Opportunities ──────────────────────────────────────────────────────

const STAGE_COLOR: Record<string, string> = {
  Prospecting: "bg-secondary/50 text-muted-foreground",
  Qualification: "bg-blue-500/15 text-blue-400",
  Proposal: "bg-amber-500/15 text-amber-400",
  Approval: "bg-accent/15 text-accent",
  Negotiation: "bg-yellow-500/15 text-yellow-400",
  "Closed Won": "bg-emerald-500/15 text-emerald-400",
  "Closed Lost": "bg-red-500/15 text-red-400",
};
const MOCK_OPPS = [
  {
    id: "o1",
    name: "Security Suite Renewal",
    stage: "Proposal",
    value: 48000,
    closeDate: "Mar 31, 2025",
    owner: "Alex Turner",
    prob: 65,
  },
  {
    id: "o2",
    name: "Cloud Platform Upsell",
    stage: "Qualification",
    value: 22000,
    closeDate: "Apr 15, 2025",
    owner: "Sam Chen",
    prob: 35,
  },
  {
    id: "o3",
    name: "Professional Services",
    stage: "Closed Won",
    value: 15000,
    closeDate: "Jan 10, 2025",
    owner: "Alex Turner",
    prob: 100,
  },
];

function TabOpportunities({
  accountDeals,
}: { accountDeals: DealRegistration[] }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Opportunities</h3>
        <Button
          type="button"
          size="sm"
          onClick={() => toast.info("New Opportunity coming soon")}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          data-ocid="account_record.opportunities.new_button"
        >
          <Plus size={13} className="mr-1" /> New Opportunity
        </Button>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/20">
              {[
                "Name",
                "Stage",
                "Value",
                "Close Date",
                "Owner",
                "Probability",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] text-muted-foreground uppercase tracking-wide px-5 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_OPPS.map((opp, i) => (
              <tr
                key={opp.id}
                className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                data-ocid={`account_record.opportunity.item.${i + 1}`}
              >
                <td className="px-5 py-3 font-medium text-foreground">
                  {opp.name}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STAGE_COLOR[opp.stage] ?? "bg-secondary/50 text-muted-foreground"}`}
                  >
                    {opp.stage}
                  </span>
                </td>
                <td className="px-5 py-3 text-accent font-bold">
                  {formatCurrency(opp.value)}
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">
                  {opp.closeDate}
                </td>
                <td className="px-5 py-3 text-xs text-foreground">
                  {opp.owner}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden max-w-16">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${opp.prob}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {opp.prob}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {accountDeals.length === 0 && MOCK_OPPS.length === 0 && (
        <div
          className="flex flex-col items-center py-12"
          data-ocid="account_record.opportunities.empty_state"
        >
          <TrendingUp size={32} className="text-muted-foreground mb-3" />
          <p className="text-sm text-foreground font-medium">
            No opportunities
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Renewals ──────────────────────────────────────────────────────────

const MOCK_RENEWALS = [
  {
    id: "r1",
    product: "Security Suite Enterprise",
    renewalDate: "Mar 15, 2025",
    value: 48000,
    status: "At Risk",
    owner: "Alex Turner",
  },
  {
    id: "r2",
    product: "Cloud Backup Pro",
    renewalDate: "Jun 30, 2025",
    value: 12000,
    status: "Healthy",
    owner: "Sam Chen",
  },
  {
    id: "r3",
    product: "Monitoring & Analytics",
    renewalDate: "Sep 01, 2025",
    value: 8500,
    status: "Due Soon",
    owner: "Alex Turner",
  },
];

function TabRenewals({
  account,
  daysUntilRenewal,
}: { account: OverviewAccount; daysUntilRenewal: number | null }) {
  const rstyle = (s: string) =>
    s === "At Risk"
      ? "bg-red-500/15 text-red-400 border border-red-500/25"
      : s === "Due Soon"
        ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25";
  return (
    <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Renewals</h3>
        {daysUntilRenewal !== null && (
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${daysUntilRenewal <= 30 ? "bg-red-500/15 text-red-400" : daysUntilRenewal <= 90 ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"}`}
          >
            Next: {formatDate(account.renewalDate)}
          </span>
        )}
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/20">
              {[
                "Product / SKU",
                "Renewal Date",
                "Value",
                "Status",
                "Owner",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] text-muted-foreground uppercase tracking-wide px-5 py-3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_RENEWALS.map((r, i) => (
              <tr
                key={r.id}
                className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                data-ocid={`account_record.renewal.item.${i + 1}`}
              >
                <td className="px-5 py-3 font-medium text-foreground">
                  {r.product}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {r.renewalDate}
                </td>
                <td className="px-5 py-3 text-accent font-bold">
                  {formatCurrency(r.value)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rstyle(r.status)}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-foreground">{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Deal Regs ───────────────────────────────────────────────────────────

function TabDealRegs({ accountDeals }: { accountDeals: DealRegistration[] }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Deal Registrations ({accountDeals.length})
        </h3>
      </div>
      {accountDeals.length === 0 ? (
        <div
          className="flex flex-col items-center py-12"
          data-ocid="account_record.deals.empty_state"
        >
          <Edit2 size={32} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No deal registrations
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Deal registrations linked to this account will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {accountDeals.map((deal, i) => (
            <div
              key={deal.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/20 transition-colors"
              data-ocid={`account_record.deal.item.${i + 1}`}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {deal.opportunityName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatCurrency(deal.estimatedValue)} · {deal.product || "—"}
                </p>
              </div>
              <span
                className={`${dealStatusColor(deal.status)} ml-4 flex-shrink-0`}
              >
                {dealStatusLabel(deal.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Products ─────────────────────────────────────────────────────────────

function TabProducts({ account }: { account: OverviewAccount }) {
  const channelProducts = (account as any).channelProducts;

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "expiring":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "at-risk":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "expired":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Products & Services
        </h3>
        <Button
          type="button"
          size="sm"
          onClick={() => toast.info("Add product coming soon")}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus size={13} className="mr-1" /> Add Product
        </Button>
      </div>

      {channelProducts && channelProducts.length > 0 ? (
        <div className="divide-y divide-border">
          {channelProducts.map((product: any, i: number) => (
            <div
              key={product.productId ?? product.productName}
              className="px-5 py-4"
              data-ocid={`account_record.subscription.item.${i + 1}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">
                      {product.productName}
                    </p>
                    {product.productCategory && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        {product.productCategory}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.licenseType}
                    {product.seats ? ` · ${product.seats} seats` : ""}
                  </p>
                  {(product.suppliedBy || product.servicedBy) && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {product.suppliedBy && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                          Supplied by: {product.suppliedBy}
                        </span>
                      )}
                      {product.servicedBy && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                          Serviced by: {product.servicedBy}
                        </span>
                      )}
                    </div>
                  )}
                  {product.operationalNotes && (
                    <p className="text-xs italic text-muted-foreground/70 mt-2">
                      {product.operationalNotes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {product.contractValue !== undefined && (
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(product.contractValue)}
                    </span>
                  )}
                  {product.renewalDate && (
                    <span className="text-[10px] text-muted-foreground">
                      Renews {product.renewalDate}
                    </span>
                  )}
                  {product.serviceStatus && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusBadge(product.serviceStatus)}`}
                    >
                      {product.serviceStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : account.productList.length === 0 ? (
        <div
          className="flex flex-col items-center py-12"
          data-ocid="account_record.products.empty_state"
        >
          <Zap size={32} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No products recorded
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add products via Edit Account.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {account.productList.map((product, i) => (
            <div
              key={product}
              className="flex items-center justify-between px-5 py-3.5"
              data-ocid={`account_record.subscription.item.${i + 1}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-accent/15 text-accent">
                  {product[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {product}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {account.licenceQuantity.toString()} seats · Annual
                  </p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Activity Timeline ───────────────────────────────────────────────────

const TIMELINE_EVENTS = [
  {
    id: "t1",
    type: "call",
    icon: Phone,
    title: "Discovery call with VP Technology",
    actor: "Alex Turner",
    time: "2 hours ago",
    note: "Discussed renewal timeline and satisfaction levels. Customer expressed concern about support response times.",
    borderColor: "border-accent",
  },
  {
    id: "t2",
    type: "meeting",
    icon: Users,
    title: "Quarterly Business Review (QBR)",
    actor: "Sam Chen",
    time: "3 days ago",
    note: "Reviewed KPIs. Customer happy with product performance. Agreed on next QBR in Q2.",
    borderColor: "border-accent",
  },
  {
    id: "t3",
    type: "note",
    icon: FileText,
    title: "Internal note added",
    actor: "Alex Turner",
    time: "5 days ago",
    note: "Flagged for renewal risk review — procurement cycle starting earlier this year.",
    borderColor: "border-border",
  },
  {
    id: "t4",
    type: "email",
    icon: Mail,
    title: "Renewal proposal sent",
    actor: "Alex Turner",
    time: "1 week ago",
    note: "Sent customised renewal proposal with 3-year pricing option.",
    borderColor: "border-blue-500/40",
  },
  {
    id: "t5",
    type: "system",
    icon: CheckCircle2,
    title: "Account status updated to Active",
    actor: "System",
    time: "2 weeks ago",
    note: null,
    borderColor: "border-border",
  },
  {
    id: "t6",
    type: "call",
    icon: Phone,
    title: "Follow-up call re: pricing concerns",
    actor: "Sam Chen",
    time: "3 weeks ago",
    note: "Customer requested competitive pricing comparison. Escalated to Deal Desk.",
    borderColor: "border-accent",
  },
  {
    id: "t7",
    type: "meeting",
    icon: MapPin,
    title: "On-site kick-off meeting",
    actor: "Alex Turner",
    time: "6 weeks ago",
    note: "Successful kick-off. Introduced implementation team. Key stakeholders mapped.",
    borderColor: "border-accent",
  },
  {
    id: "t8",
    type: "email",
    icon: Mail,
    title: "Welcome email sent after contract signature",
    actor: "System",
    time: "2 months ago",
    note: null,
    borderColor: "border-blue-500/40",
  },
];
const TIMELINE_FILTERS = [
  "All",
  "Calls",
  "Meetings",
  "Notes",
  "Emails",
  "System",
];
const FILTER_MAP: Record<string, string[]> = {
  Calls: ["call"],
  Meetings: ["meeting"],
  Notes: ["note"],
  Emails: ["email"],
  System: ["system"],
};

function TabTimeline({
  timelineFilter,
  setTimelineFilter,
}: { timelineFilter: string; setTimelineFilter: (v: string) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filtered =
    timelineFilter === "All"
      ? TIMELINE_EVENTS
      : TIMELINE_EVENTS.filter((e) =>
          (FILTER_MAP[timelineFilter] ?? []).includes(e.type),
        );
  return (
    <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-sm font-semibold text-foreground">
          Activity Timeline
        </h3>
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-lg overflow-hidden border border-border"
            data-ocid="account_record.timeline.filter"
          >
            {TIMELINE_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTimelineFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${timelineFilter === f ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"}`}
                data-ocid={`account_record.timeline.filter.${f.toLowerCase()}`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => toast.info("Log Activity coming soon")}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="account_record.timeline.log_button"
          >
            <Plus size={13} className="mr-1" /> Log Activity
          </Button>
        </div>
      </div>
      <div className="p-5 space-y-0">
        {filtered.map((event, i) => (
          <div
            key={event.id}
            className="relative flex gap-4"
            data-ocid={`account_record.timeline.item.${i + 1}`}
          >
            {i < filtered.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
            )}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${event.borderColor} bg-card z-10`}
            >
              <event.icon size={14} className="text-foreground" />
            </div>
            <div className="flex-1 min-w-0 pb-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {event.actor} · {event.time}
                  </p>
                </div>
                {event.note && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(expandedId === event.id ? null : event.id)
                    }
                    className="text-[10px] text-accent hover:underline flex-shrink-0"
                  >
                    {expandedId === event.id ? "Less" : "More"}
                  </button>
                )}
              </div>
              {expandedId === event.id && event.note && (
                <p className="mt-2 text-xs text-muted-foreground bg-secondary/20 rounded-lg px-3 py-2 border-l-2 border-accent">
                  {event.note}
                </p>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            className="flex flex-col items-center py-12"
            data-ocid="account_record.timeline.empty_state"
          >
            <Target size={32} className="text-muted-foreground mb-3" />
            <p className="text-sm text-foreground font-medium">
              No activities match this filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Notes ────────────────────────────────────────────────────────────

type TabNotesProps = {
  account: OverviewAccount;
  notes: Note[];
  noteContent: string;
  setNoteContent: (v: string) => void;
  noteVisibility: NoteVisibility;
  setNoteVisibility: (v: NoteVisibility) => void;
  savingNote: boolean;
  editingNoteId: string | null;
  setEditingNoteId: (v: string | null) => void;
  editNoteContent: string;
  setEditNoteContent: (v: string) => void;
  handleAddNote: (e: React.FormEvent) => Promise<void>;
  handleEditNote: (note: Note) => Promise<void>;
  parseNoteVisibility: typeof parseNoteVisibility;
  userProfile: ReturnType<typeof useApp>["userProfile"];
  VISIBILITY_PREFIXES: Record<NoteVisibility, string>;
  detailLoading: boolean;
};

const MOCK_INTERNAL_NOTES: Note[] = [
  {
    id: "in1",
    accountId: "",
    authorName: "Alex Turner",
    authorRole: "Account Manager",
    authorId: "",
    createdAt: BigInt(Date.now() - 86400000) * BigInt(1_000_000),
    updatedAt: BigInt(0),
    content:
      "[INTERNAL] Customer seems happy with Q4 results. Renewal risk is low if we can book the renewal meeting before March.",
  },
  {
    id: "in2",
    accountId: "",
    authorName: "Sam Chen",
    authorRole: "Sales Manager",
    authorId: "",
    createdAt: BigInt(Date.now() - 604800000) * BigInt(1_000_000),
    updatedAt: BigInt(0),
    content:
      "[INTERNAL] Competitor approach noted — need to run ROI comparison for renewal deck.",
  },
];
const MOCK_EXTERNAL_NOTES: Note[] = [
  {
    id: "ex1",
    accountId: "",
    authorName: "Alex Turner",
    authorRole: "Account Manager",
    authorId: "",
    createdAt: BigInt(Date.now() - 172800000) * BigInt(1_000_000),
    updatedAt: BigInt(0),
    content:
      "[EXTERNAL:vendor] Renewal proposal shared with customer on 12 Feb. Awaiting sign-off from procurement.",
  },
];

function TabNotes(props: TabNotesProps) {
  const { canEditField } = useApp();
  const {
    notes,
    noteContent,
    setNoteContent,
    noteVisibility,
    setNoteVisibility,
    savingNote,
    editingNoteId,
    setEditingNoteId,
    editNoteContent,
    setEditNoteContent,
    handleAddNote,
    handleEditNote,
    parseNoteVisibility: pnv,
    userProfile,
    VISIBILITY_PREFIXES: VP,
    detailLoading,
  } = props;
  const allNotes =
    notes.length > 0 ? notes : [...MOCK_INTERNAL_NOTES, ...MOCK_EXTERNAL_NOTES];
  const internalNotes = allNotes.filter(
    (n) => pnv(n.content).visibility === "internal",
  );
  const externalNotes = allNotes.filter(
    (n) => pnv(n.content).visibility !== "internal",
  );

  function renderNote(note: Note, idx: number) {
    const { visibility, displayContent } = pnv(note.content);
    const isAuthor =
      userProfile?.id === (note as Note & { authorId?: string }).authorId;
    const isEditing = editingNoteId === note.id;
    const visLabel =
      visibility === "external-vendor"
        ? "Shared w/ Vendor"
        : visibility === "external-distributor"
          ? "Shared w/ Distributor"
          : visibility === "external-reseller"
            ? "Shared w/ Reseller"
            : "Internal Only";
    return (
      <div
        key={note.id}
        className="crm-card p-4"
        data-ocid={`account_record.note.item.${idx + 1}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 bg-accent/15 text-accent">
              {getInitials(note.authorName)}
            </div>
            <div>
              <span className="text-xs font-medium text-foreground">
                {note.authorName}
              </span>
              <span className="text-[10px] text-muted-foreground ml-1">
                · {note.authorRole}
              </span>
            </div>
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${visibility === "internal" ? "bg-secondary text-muted-foreground border border-border" : "bg-accent/15 text-accent border border-accent/30"}`}
            >
              {visLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              {timeAgo(note.createdAt)}
            </span>
            {isAuthor && !isEditing && canEditField("internalNotes") && (
              <button
                type="button"
                onClick={() => {
                  setEditingNoteId(note.id);
                  setEditNoteContent(displayContent);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid={`account_record.note.edit_button.${idx + 1}`}
                aria-label="Edit note"
              >
                <Pencil size={11} />
              </button>
            )}
          </div>
        </div>
        {isEditing ? (
          <div>
            <textarea
              value={editNoteContent}
              onChange={(e) => setEditNoteContent(e.target.value)}
              rows={3}
              className="crm-input w-full rounded-lg px-3 py-2 text-sm resize-none mb-2 focus:border-accent outline-none"
              data-ocid={`account_record.note.edit_textarea.${idx + 1}`}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  handleEditNote({
                    ...note,
                    content: VP[visibility] + editNoteContent,
                  })
                }
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-ocid={`account_record.note.save_button.${idx + 1}`}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setEditingNoteId(null)}
                data-ocid={`account_record.note.cancel_button.${idx + 1}`}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Internal */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={13} className="text-muted-foreground" />
            <h4 className="text-xs font-semibold text-foreground">
              Internal Notes
            </h4>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
              {internalNotes.length}
            </span>
            <span className="text-[10px] text-muted-foreground ml-auto">
              Visible to your org only
            </span>
          </div>
          {canEditField("internalNotes") && (
            <form onSubmit={handleAddNote} className="crm-card p-3 space-y-2">
              <textarea
                value={noteVisibility === "internal" ? noteContent : ""}
                onChange={(e) => {
                  setNoteContent(e.target.value);
                  setNoteVisibility("internal");
                }}
                placeholder="Write an internal note…"
                rows={3}
                className="crm-input w-full rounded-lg px-3 py-2 text-sm resize-none focus:border-accent outline-none"
                data-ocid="account_record.internal_note.textarea"
              />
              <Button
                type="submit"
                size="sm"
                disabled={
                  savingNote ||
                  noteVisibility !== "internal" ||
                  !noteContent.trim()
                }
                onClick={() => setNoteVisibility("internal")}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-ocid="account_record.internal_note.submit_button"
              >
                {savingNote && noteVisibility === "internal"
                  ? "Saving…"
                  : "Add Internal Note"}
              </Button>
            </form>
          )}
          {detailLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            internalNotes.map((n, i) => renderNote(n, i))
          )}
          {!detailLoading && internalNotes.length === 0 && (
            <p className="text-xs text-muted-foreground px-3">
              No internal notes yet.
            </p>
          )}
        </div>
        {/* External */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={13} className="text-accent" />
            <h4 className="text-xs font-semibold text-foreground">
              External Notes
            </h4>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
              {externalNotes.length}
            </span>
          </div>
          <form onSubmit={handleAddNote} className="crm-card p-3 space-y-2">
            <textarea
              value={noteVisibility !== "internal" ? noteContent : ""}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write an external note…"
              rows={3}
              className="crm-input w-full rounded-lg px-3 py-2 text-sm resize-none focus:border-accent outline-none"
              data-ocid="account_record.external_note.textarea"
            />
            <div className="flex items-center gap-2">
              <select
                value={
                  noteVisibility !== "internal"
                    ? noteVisibility
                    : "external-vendor"
                }
                onChange={(e) =>
                  setNoteVisibility(e.target.value as NoteVisibility)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    if (noteVisibility === "internal")
                      setNoteVisibility("external-vendor");
                  }
                }}
                className="crm-input flex-1 rounded-lg px-2 py-1.5 text-xs focus:border-accent outline-none"
                data-ocid="account_record.external_note.visibility_select"
              >
                <option value="external-vendor">Share with Vendor</option>
                <option value="external-distributor">
                  Share with Distributor
                </option>
                <option value="external-reseller">Share with Reseller</option>
              </select>
              <Button
                type="submit"
                size="sm"
                disabled={
                  savingNote ||
                  noteVisibility === "internal" ||
                  !noteContent.trim()
                }
                onClick={() => {
                  if (noteVisibility === "internal")
                    setNoteVisibility("external-vendor");
                }}
                className="bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0"
                data-ocid="account_record.external_note.submit_button"
              >
                {savingNote && noteVisibility !== "internal"
                  ? "Saving…"
                  : "Add"}
              </Button>
            </div>
          </form>
          {detailLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            externalNotes.map((n, i) => renderNote(n, internalNotes.length + i))
          )}
          {!detailLoading && externalNotes.length === 0 && (
            <p className="text-xs text-muted-foreground px-3">
              No external notes yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Simple placeholder ────────────────────────────────────────────────────

function TabSimple({
  title,
  icon: Icon,
  emptyMsg,
  actionLabel,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  emptyMsg: string;
  actionLabel: string;
}) {
  const ocid = title.toLowerCase().replace(/ /g, "_");
  return (
    <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Button
          type="button"
          size="sm"
          onClick={() => toast.info(`${actionLabel} coming soon`)}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          data-ocid={`account_record.${ocid}.add_button`}
        >
          <Plus size={13} className="mr-1" /> {actionLabel}
        </Button>
      </div>
      <div
        className="flex flex-col items-center py-14"
        data-ocid={`account_record.${ocid}.empty_state`}
      >
        <Icon size={36} className="text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">{title}</p>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {emptyMsg}
        </p>
      </div>
    </div>
  );
}

// ─── Tab: AI Insights ─────────────────────────────────────────────────────────

const NEXT_ACTIONS = [
  {
    id: 1,
    action: "Schedule renewal kickoff call before month-end",
    priority: "HIGH",
  },
  {
    id: 2,
    action: "Send competitive ROI comparison document to procurement",
    priority: "MEDIUM",
  },
  {
    id: 3,
    action: "Introduce new support contact — previous rep departed",
    priority: "MEDIUM",
  },
  { id: 4, action: "Book QBR for Q2 2025", priority: "LOW" },
  {
    id: 5,
    action: "Review licence utilisation data before renewal meeting",
    priority: "LOW",
  },
];

function TabAIInsights({
  account,
  accountRecommendations,
  accountEngagementGaps,
  dismissRecommendation,
  daysUntilRenewal,
  healthScore,
}: {
  account: OverviewAccount;
  accountRecommendations: ReturnType<typeof useForgeAI>["recommendations"];
  accountEngagementGaps: ReturnType<typeof useForgeAI>["engagementGaps"];
  dismissRecommendation: (id: string) => void;
  daysUntilRenewal: number | null;
  healthScore: number;
}) {
  const riskLevel =
    healthScore >= 80 ? "LOW" : healthScore >= 50 ? "MEDIUM" : "HIGH";
  return (
    <div className="p-5 space-y-5">
      <div className="forgeai-card-elevated rounded-xl border border-accent/20 intelligence-pulse">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-accent/15">
          <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
            <Sparkles size={18} className="text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">
              ForgeAI Account Intelligence
            </h3>
            <p className="text-[10px] text-muted-foreground">
              AI-powered insights for {account.accountName}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent forgeai-pulse" />
            <span className="text-[10px] text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-secondary/20 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-accent mb-2">
              Account Health Summary
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {account.accountName} is currently rated{" "}
              <strong>{healthScore}/100</strong> health.{" "}
              {riskLevel === "HIGH" &&
                "Immediate attention required — multiple risk signals detected. Renewal is at risk without proactive engagement."}
              {riskLevel === "MEDIUM" &&
                "Moderate risk indicators detected. Renewal conversation should begin within 30 days to maintain conversion probability."}
              {riskLevel === "LOW" &&
                "Account is in a healthy state with strong engagement signals. Continue proactive touchpoints to maintain renewal confidence."}
            </p>
          </div>
          <div className="bg-secondary/20 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-accent mb-2">
              Renewal Risk Assessment
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {daysUntilRenewal === null
                ? "No renewal date set. Configure a renewal date to enable risk tracking."
                : daysUntilRenewal <= 0
                  ? "Renewal date has passed. Immediate outreach required."
                  : daysUntilRenewal <= 30
                    ? `Renewal is due in ${daysUntilRenewal} days. HIGH RISK — engage immediately.`
                    : daysUntilRenewal <= 90
                      ? `Renewal is due in ${daysUntilRenewal} days. MEDIUM risk window. Begin renewal conversation now.`
                      : `Renewal is due in ${daysUntilRenewal} days. LOW risk. Continue standard engagement cadence.`}
            </p>
          </div>
          {accountEngagementGaps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-accent">
                Engagement Gap Alerts
              </h4>
              {accountEngagementGaps.map((gap) => (
                <div
                  key={gap.alertId}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/20"
                  data-ocid={`account_record.ai_insights.gap.${gap.alertId}`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {gap.entityName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {gap.daysSinceLastEngagement} days without engagement
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                    {gap.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div>
            <h4 className="text-xs font-semibold text-accent mb-2">
              Recommended Next Actions
            </h4>
            <div className="space-y-2">
              {NEXT_ACTIONS.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/20 border border-border"
                  data-ocid={`account_record.ai_insights.action.${a.id}`}
                >
                  <Zap size={13} className="text-accent flex-shrink-0" />
                  <p className="text-xs text-foreground flex-1">{a.action}</p>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${a.priority === "HIGH" ? "bg-red-500/15 text-red-400 border border-red-500/25" : a.priority === "MEDIUM" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" : "bg-secondary text-muted-foreground border border-border"}`}
                  >
                    {a.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {accountRecommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-accent">
                Live ForgeAI Signals
              </h4>
              {accountRecommendations.map((rec) => (
                <ForgeAIRecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onDismiss={dismissRecommendation}
                  showExpand
                />
              ))}
            </div>
          )}
          <div className="bg-secondary/20 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-accent mb-2">
              Historical Activity Pattern
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This account has an average touchpoint frequency of{" "}
              <strong className="text-foreground">
                2.4 interactions per month
              </strong>
              . Last engagement was via phone 2 hours ago. Engagement velocity
              is trending upward vs. last quarter, indicating positive renewal
              momentum.
            </p>
          </div>
          {/* ─── Channel Ecosystem Intelligence ─── */}
          {(() => {
            const rich = account as any;
            const cards: React.ReactNode[] = [];
            if (rich.incumbentDistributors?.length >= 2) {
              cards.push(
                <div
                  key="multi-dist"
                  className="rounded-xl border-l-2 border-orange-400 bg-orange-400/5 p-3 mb-2 flex items-start gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">
                      Multi-Distributor Servicing
                    </span>
                    <p className="text-muted-foreground mt-0.5">
                      This account is currently serviced by{" "}
                      {rich.incumbentDistributors.length} Distributors across
                      regions. Review territorial alignment to avoid channel
                      conflict.
                    </p>
                  </div>
                </div>,
              );
            }
            if (
              rich.ownershipRoles?.renewalOwner &&
              rich.ownershipRoles?.operationalOwner &&
              rich.ownershipRoles.renewalOwner !==
                rich.ownershipRoles.operationalOwner
            ) {
              cards.push(
                <div
                  key="owner-mismatch"
                  className="rounded-xl border-l-2 border-orange-400 bg-orange-400/5 p-3 mb-2 flex items-start gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">
                      Ownership Divergence
                    </span>
                    <p className="text-muted-foreground mt-0.5">
                      Renewal ownership differs from operational servicing
                      ownership. Ensure escalation paths are clearly defined.
                    </p>
                  </div>
                </div>,
              );
            }
            if (rich.incumbentResellers?.length >= 2) {
              cards.push(
                <div
                  key="multi-reseller"
                  className="rounded-xl border-l-2 border-orange-400 bg-orange-400/5 p-3 mb-2 flex items-start gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">
                      Overlapping Reseller Relationships
                    </span>
                    <p className="text-muted-foreground mt-0.5">
                      {rich.incumbentResellers.length} Resellers are mapped to
                      this account. Clarify primary vs. secondary servicing
                      responsibilities.
                    </p>
                  </div>
                </div>,
              );
            }
            if (
              rich.channelProducts?.some(
                (p: any) =>
                  p.serviceStatus === "at-risk" ||
                  p.serviceStatus === "expiring",
              )
            ) {
              cards.push(
                <div
                  key="product-risk"
                  className="rounded-xl border-l-2 border-orange-400 bg-orange-400/5 p-3 mb-2 flex items-start gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">
                      Product-Level Renewal Risk
                    </span>
                    <p className="text-muted-foreground mt-0.5">
                      One or more products/services on this account are flagged
                      at-risk or expiring. Review contract timelines and renewal
                      ownership.
                    </p>
                  </div>
                </div>,
              );
            }
            return (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <h4 className="text-xs font-semibold text-accent uppercase tracking-wider">
                    Channel Ecosystem Intelligence
                  </h4>
                </div>
                {cards.length > 0 ? (
                  cards
                ) : (
                  <div className="rounded-xl border border-border bg-card p-3 text-sm text-muted-foreground">
                    No channel ecosystem insights detected for this account.
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Custom Fields ──────────────────────────────────────────────────────

function TabCustomFields({
  customFields,
  editingCustomFields,
  setEditingCustomFields,
}: {
  customFields: ReturnType<typeof useCustomFields>;
  editingCustomFields: boolean;
  setEditingCustomFields: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <LayoutGrid size={14} className="text-accent" /> Custom Fields
          {customFields.fieldDefs.length > 0 && (
            <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full">
              {customFields.fieldDefs.length}
            </span>
          )}
        </h3>
        {!editingCustomFields && customFields.fieldDefs.length > 0 && (
          <button
            type="button"
            onClick={() => setEditingCustomFields(true)}
            className="text-xs text-accent hover:text-accent/80 flex items-center gap-1.5 transition-colors"
            data-ocid="account_record.custom_fields.edit_button"
          >
            <Pencil size={12} /> Edit
          </button>
        )}
      </div>
      {customFields.isLoading ? (
        <div
          className="p-5 space-y-3"
          data-ocid="account_record.custom_fields.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded bg-secondary/30 animate-pulse"
            />
          ))}
        </div>
      ) : customFields.fieldDefs.length === 0 ? (
        <div
          className="flex flex-col items-center py-14"
          data-ocid="account_record.custom_fields.empty_state"
        >
          <LayoutGrid size={32} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            No custom fields defined
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Admins can create custom fields under Admin Settings.
          </p>
        </div>
      ) : editingCustomFields ? (
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {customFields.fieldDefs
              .filter((d) => !d.isArchived)
              .map((def) => {
                const existing = customFields.fieldValues[def.id]?.value ?? "";
                const pending = customFields.pendingChanges[def.id];
                return (
                  <CustomFieldEditor
                    key={def.id}
                    fieldDef={def}
                    value={pending !== undefined ? pending : existing}
                    onChange={(v) => customFields.setFieldValue(def.id, v)}
                    error={customFields.errors[def.id]}
                  />
                );
              })}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={async () => {
                const errs = customFields.validateAll();
                if (Object.keys(errs).length > 0) return;
                await customFields.saveFieldValues();
                setEditingCustomFields(false);
                toast.success("Custom fields saved");
              }}
              disabled={customFields.isSaving}
              className="px-4 py-2 text-sm font-medium text-accent-foreground rounded-lg bg-accent hover:bg-accent/90 transition-colors"
              data-ocid="account_record.custom_fields.save_button"
            >
              {customFields.isSaving ? "Saving…" : "Save All"}
            </button>
            <button
              type="button"
              onClick={() => setEditingCustomFields(false)}
              className="px-4 py-2 text-sm font-medium border border-border text-muted-foreground rounded-lg hover:text-foreground transition-colors"
              data-ocid="account_record.custom_fields.cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {customFields.fieldDefs
            .filter((d) => !d.isArchived)
            .map((def) => (
              <CustomFieldRenderer
                key={def.id}
                fieldDef={def}
                value={customFields.fieldValues[def.id]}
              />
            ))}
        </div>
      )}
    </div>
  );
}
