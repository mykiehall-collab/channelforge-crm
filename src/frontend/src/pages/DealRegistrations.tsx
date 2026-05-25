import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Briefcase,
  Calculator,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  LayoutGrid,
  Plus,
  Search,
  X,
  Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import {
  CustomFieldObjectType,
  DealStatus,
  DuplicateDRStatus,
} from "../backend";
import type {
  DealRegistration,
  DealRegistrationInput,
  DuplicateDRRecord,
} from "../backend";
import { ClickableAccountName } from "../components/ClickableAccountName";
import { CustomFieldEditor } from "../components/CustomFieldEditor";
import { CustomFieldRenderer } from "../components/CustomFieldRenderer";
import { ForgeAIRecommendationCard } from "../components/ForgeAIRecommendationCard";
import { PriceCalculator } from "../components/PriceCalculator";
import { useActor } from "../hooks/useActor";
import { useCustomFields } from "../hooks/useCustomFields";
import { useForgeAI } from "../hooks/useForgeAI";
import {
  dealStatusColor,
  dealStatusLabel,
  formatCurrency,
  formatDate,
} from "../utils/channelforge";
import { DuplicateQueue } from "./DuplicateQueue";

// ── Status Filter Options ─────────────────────────────────────────────────────
const ALL_STATUSES = [
  DealStatus.Draft,
  DealStatus.Submitted,
  DealStatus.UnderReview,
  DealStatus.Approved,
  DealStatus.Rejected,
  DealStatus.Won,
  DealStatus.Lost,
  DealStatus.Expired,
];

const STATUS_PILL_COLORS: Record<string, string> = {
  [DealStatus.Draft]: "bg-muted/40 text-muted-foreground",
  [DealStatus.Submitted]: "bg-indigo-500/20 text-indigo-300",
  [DealStatus.UnderReview]: "bg-yellow-500/20 text-yellow-300",
  [DealStatus.Approved]: "bg-green-500/20 text-green-300",
  [DealStatus.Rejected]: "bg-red-500/20 text-red-300",
  [DealStatus.Won]: "bg-emerald-500/20 text-emerald-300",
  [DealStatus.Lost]: "bg-muted/30 text-muted-foreground",
  [DealStatus.Expired]: "bg-orange-500/10 text-orange-400/80",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
// nsToDateInputValue: reserved for future use when editing deal close dates
function _nsToDateInputValue(ns: bigint): string {
  if (!ns) return "";
  const d = new Date(Number(ns) / 1_000_000);
  return d.toISOString().split("T")[0];
}
function dateInputToNs(val: string): bigint {
  if (!val) return BigInt(0);
  return BigInt(new Date(val).getTime() * 1_000_000);
}

// ── Deal Form Component ───────────────────────────────────────────────────────
interface DealFormProps {
  accounts: Array<{ id: string; accountName: string; customerDomain: string }>;
  prefill?: Partial<DealFormState>;
  onClose: () => void;
  onSaved: () => void;
}
interface DealFormState {
  accountId: string;
  opportunityName: string;
  product: string;
  estimatedValue: string;
  quantity: string;
  closeDate: string;
  dealStage: string;
  competitor: string;
  notes: string;
  resellerId: string;
  vendorOwnerId: string;
  customerDomain: string;
  status: DealStatus;
}
const EMPTY_FORM: DealFormState = {
  accountId: "",
  opportunityName: "",
  product: "",
  estimatedValue: "",
  quantity: "1",
  closeDate: "",
  dealStage: "",
  competitor: "",
  notes: "",
  resellerId: "",
  vendorOwnerId: "",
  customerDomain: "",
  status: DealStatus.Draft,
};

function DealForm({ accounts, prefill, onClose, onSaved }: DealFormProps) {
  const { actor } = useActor();
  const [form, setForm] = useState<DealFormState>({
    ...EMPTY_FORM,
    ...prefill,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof DealFormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const input: DealRegistrationInput = {
        accountId: form.accountId,
        opportunityName: form.opportunityName,
        product: form.product,
        estimatedValue: Number.parseFloat(form.estimatedValue) || 0,
        quantity: BigInt(Number.parseInt(form.quantity) || 1),
        closeDate: dateInputToNs(form.closeDate),
        dealStage: form.dealStage,
        competitor: form.competitor,
        notes: form.notes,
        resellerId: form.resellerId,
        vendorOwnerId: form.vendorOwnerId,
        customerDomain: form.customerDomain,
        status: form.status,
        submittedBy: "",
        submittedDate: undefined,
      };
      const result = await actor.createDealRegistration(input);
      if (result.__kind__ === "err") {
        toast.error(result.err);
        return;
      }
      toast.success("Deal registration created");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to create deal");
    } finally {
      setSaving(false);
    }
  }

  const selectedAccount = accounts.find((a) => a.id === form.accountId);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Account selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label
            htmlFor="deal-account"
            className="block text-xs text-muted-foreground mb-1"
          >
            Account *
          </label>
          <select
            id="deal-account"
            required
            data-ocid="deal.account.select"
            value={form.accountId}
            onChange={(e) => {
              const acc = accounts.find((a) => a.id === e.target.value);
              setForm((f) => ({
                ...f,
                accountId: e.target.value,
                customerDomain: acc?.customerDomain ?? f.customerDomain,
              }));
            }}
            className="w-full crm-input px-3 py-2 text-sm"
          >
            <option value="">Select account…</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountName}
              </option>
            ))}
          </select>
          {selectedAccount && (
            <p className="text-xs text-muted-foreground mt-1">
              Domain: {selectedAccount.customerDomain}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="deal-opp-name"
            className="block text-xs text-muted-foreground mb-1"
          >
            Opportunity Name *
          </label>
          <Input
            id="deal-opp-name"
            required
            data-ocid="deal.name.input"
            value={form.opportunityName}
            onChange={(e) => set("opportunityName", e.target.value)}
            className="crm-input"
            placeholder="Q3 Renewal Expansion"
          />
        </div>

        <div>
          <label
            htmlFor="deal-product"
            className="block text-xs text-muted-foreground mb-1"
          >
            Product *
          </label>
          <Input
            id="deal-product"
            required
            data-ocid="deal.product.input"
            value={form.product}
            onChange={(e) => set("product", e.target.value)}
            className="crm-input"
            placeholder="Security Suite Pro"
          />
        </div>

        <div>
          <label
            htmlFor="deal-value"
            className="block text-xs text-muted-foreground mb-1"
          >
            Estimated Value (USD)
          </label>
          <Input
            id="deal-value"
            type="number"
            min="0"
            data-ocid="deal.value.input"
            value={form.estimatedValue}
            onChange={(e) => set("estimatedValue", e.target.value)}
            className="crm-input"
            placeholder="25000"
          />
        </div>

        <div>
          <label
            htmlFor="deal-quantity"
            className="block text-xs text-muted-foreground mb-1"
          >
            Quantity
          </label>
          <Input
            id="deal-quantity"
            type="number"
            min="1"
            data-ocid="deal.quantity.input"
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            className="crm-input"
            placeholder="10"
          />
        </div>

        <div>
          <label
            htmlFor="deal-close-date"
            className="block text-xs text-muted-foreground mb-1"
          >
            Close Date *
          </label>
          <Input
            id="deal-close-date"
            type="date"
            required
            data-ocid="deal.close_date.input"
            value={form.closeDate}
            onChange={(e) => set("closeDate", e.target.value)}
            className="crm-input"
          />
        </div>

        <div>
          <label
            htmlFor="deal-stage"
            className="block text-xs text-muted-foreground mb-1"
          >
            Deal Stage
          </label>
          <Input
            id="deal-stage"
            data-ocid="deal.stage.input"
            value={form.dealStage}
            onChange={(e) => set("dealStage", e.target.value)}
            className="crm-input"
            placeholder="Negotiation"
          />
        </div>

        <div>
          <label
            htmlFor="deal-reseller"
            className="block text-xs text-muted-foreground mb-1"
          >
            Reseller Company
          </label>
          <Input
            id="deal-reseller"
            data-ocid="deal.reseller.input"
            value={form.resellerId}
            onChange={(e) => set("resellerId", e.target.value)}
            className="crm-input"
            placeholder="Reseller name or ID"
          />
        </div>

        <div>
          <label
            htmlFor="deal-vendor-owner"
            className="block text-xs text-muted-foreground mb-1"
          >
            Vendor Owner
          </label>
          <Input
            id="deal-vendor-owner"
            data-ocid="deal.vendor_owner.input"
            value={form.vendorOwnerId}
            onChange={(e) => set("vendorOwnerId", e.target.value)}
            className="crm-input"
            placeholder="Vendor name or ID"
          />
        </div>

        <div>
          <label
            htmlFor="deal-competitor"
            className="block text-xs text-muted-foreground mb-1"
          >
            Competitor
          </label>
          <Input
            id="deal-competitor"
            data-ocid="deal.competitor.input"
            value={form.competitor}
            onChange={(e) => set("competitor", e.target.value)}
            className="crm-input"
            placeholder="CompetitorName"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="deal-notes"
            className="block text-xs text-muted-foreground mb-1"
          >
            Notes
          </label>
          <textarea
            id="deal-notes"
            data-ocid="deal.notes.textarea"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            className="crm-input w-full px-3 py-2 text-sm resize-none"
            placeholder="Additional context…"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-1">
        <Button
          type="button"
          variant="outline"
          data-ocid="deal.cancel_button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-ocid="deal.submit_button"
          disabled={saving}
          className="text-white bg-orange-500"
        >
          {saving ? "Creating…" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
interface DetailPanelProps {
  deal: DealRegistration;
  onClose: () => void;
  onStatusChange: (id: string, status: DealStatus) => Promise<void>;
  isVendor: boolean;
}

function DetailPanel({
  deal,
  onClose,
  onStatusChange,
  isVendor,
}: DetailPanelProps) {
  const [changing, setChanging] = useState(false);
  const [detailTab, setDetailTab] = useState<"details" | "customFields">(
    "details",
  );
  const [editingCF, setEditingCF] = useState(false);
  const navigate = useNavigate();
  const customFields = useCustomFields(
    CustomFieldObjectType.dealRegistration,
    deal.id,
  );

  async function handleStatus(status: DealStatus) {
    setChanging(true);
    await onStatusChange(deal.id, status);
    setChanging(false);
  }

  const vendorActions = [
    { label: "Approve", status: DealStatus.Approved, color: "text-green-400" },
    { label: "Reject", status: DealStatus.Rejected, color: "text-red-400" },
    {
      label: "Under Review",
      status: DealStatus.UnderReview,
      color: "text-yellow-400",
    },
  ];
  const resellerActions = [
    { label: "Submit", status: DealStatus.Submitted, color: "text-indigo-300" },
  ];
  const actions = isVendor ? vendorActions : resellerActions;

  return (
    <div
      className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col fade-in"
      data-ocid="deal_reg.detail.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Deal Registration</p>
          <h2 className="text-base font-bold text-foreground truncate">
            {deal.opportunityName}
          </h2>
        </div>
        <button
          type="button"
          data-ocid="deal_reg.detail.close_button"
          onClick={onClose}
          className="ml-3 p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground transition-colors flex-shrink-0"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Status badge + actions */}
      <div className="p-5 border-b border-border space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Status:</span>
          <span className={dealStatusColor(deal.status)}>
            {dealStatusLabel(deal.status)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions
            .filter((a) => a.status !== deal.status)
            .map((a) => (
              <button
                key={a.status}
                type="button"
                data-ocid={`deal_reg.status_${a.status.toLowerCase()}_button`}
                disabled={changing}
                onClick={() => handleStatus(a.status)}
                className={`text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent transition-colors ${a.color} disabled:opacity-50`}
              >
                {a.label}
              </button>
            ))}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex border-b border-border px-2"
        data-ocid="deal_reg.detail.tabs"
      >
        {[
          { id: "details" as const, label: "Details" },
          {
            id: "customFields" as const,
            label: `Custom Fields${customFields.fieldDefs.length > 0 ? ` (${customFields.fieldDefs.length})` : ""}`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setDetailTab(tab.id)}
            data-ocid={`deal_reg.detail.tab.${tab.id}`}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              detailTab === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.id === "customFields" && <LayoutGrid size={11} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Details body */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {detailTab === "details" && (
          <div className="p-5 space-y-4">
            {(
              [
                ["Account ID", deal.accountId],
                ["Customer Domain", deal.customerDomain],
                ["Product", deal.product],
                ["Estimated Value", formatCurrency(deal.estimatedValue)],
                ["Quantity", String(deal.quantity)],
                ["Close Date", formatDate(deal.closeDate)],
                ["Deal Stage", deal.dealStage || "—"],
                ["Competitor", deal.competitor || "—"],
                ["Reseller", deal.resellerId || "—"],
                ["Vendor Owner", deal.vendorOwnerId || "—"],
                ["Submitted By", deal.submittedBy || "—"],
                [
                  "Submitted Date",
                  deal.submittedDate ? formatDate(deal.submittedDate) : "—",
                ],
                ["Created", formatDate(deal.createdAt)],
                ["Last Updated", formatDate(deal.updatedAt)],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 gap-2">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs text-foreground text-right break-all">
                  {value}
                </span>
              </div>
            ))}
            {deal.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-xs text-foreground bg-secondary/20 rounded-md p-3 leading-relaxed">
                  {deal.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {detailTab === "customFields" && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <LayoutGrid size={12} className="text-orange-500" />
                Custom Fields
              </span>
              {!editingCF && customFields.fieldDefs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setEditingCF(true)}
                  className="text-[11px] text-accent hover:text-accent/80 transition-colors"
                  data-ocid="deal_reg.custom_fields.edit_button"
                >
                  Edit
                </button>
              )}
            </div>
            {customFields.isLoading ? (
              <div
                className="space-y-3"
                data-ocid="deal_reg.custom_fields.loading_state"
              >
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-12 rounded bg-secondary/30 animate-pulse"
                  />
                ))}
              </div>
            ) : customFields.fieldDefs.length === 0 ? (
              <div
                className="flex flex-col items-center py-10"
                data-ocid="deal_reg.custom_fields.empty_state"
              >
                <LayoutGrid size={28} className="text-muted-foreground mb-2" />
                <p className="text-xs font-medium text-foreground">
                  No custom fields defined
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Admins can create custom fields under Admin Settings.
                </p>
              </div>
            ) : editingCF ? (
              <div className="space-y-4">
                {customFields.fieldDefs
                  .filter((d) => !d.isArchived)
                  .map((def) => {
                    const existing =
                      customFields.fieldValues[def.id]?.value ?? "";
                    const pending = customFields.pendingChanges[def.id];
                    const current = pending !== undefined ? pending : existing;
                    return (
                      <CustomFieldEditor
                        key={def.id}
                        fieldDef={def}
                        value={current}
                        onChange={(v) => customFields.setFieldValue(def.id, v)}
                        error={customFields.errors[def.id]}
                      />
                    );
                  })}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      const errs = customFields.validateAll();
                      if (Object.keys(errs).length > 0) return;
                      await customFields.saveFieldValues();
                      setEditingCF(false);
                    }}
                    disabled={customFields.isSaving}
                    className="px-3 py-1.5 text-xs font-medium text-white rounded-md bg-orange-500"
                    data-ocid="deal_reg.custom_fields.save_button"
                  >
                    {customFields.isSaving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCF(false)}
                    className="px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-md hover:text-foreground transition-colors"
                    data-ocid="deal_reg.custom_fields.cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
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
        )}
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-border">
        <button
          type="button"
          data-ocid="deal_reg.view_account_link"
          onClick={() =>
            navigate({ to: "/accounts/$id", params: { id: deal.accountId } })
          }
          className="flex items-center gap-1.5 text-xs text-accent hover:underline"
        >
          View Account <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ── Deal Intelligence Panel ──────────────────────────────────────────────────
interface DealIntelligencePanelProps {
  selectedDealId: string | null;
  totalActive: number;
  stalledCount: number;
  duplicateCount: number;
}

function DealIntelligencePanel({
  selectedDealId,
  totalActive,
  stalledCount,
  duplicateCount,
}: DealIntelligencePanelProps) {
  const { recommendations, dismissRecommendation, isAnalyzing } = useForgeAI();
  const [collapsed, setCollapsed] = useState(false);

  const dealRecs = useMemo(
    () => recommendations.filter((r) => r.affectedEntityType === "Deal"),
    [recommendations],
  );

  const visibleRecs = useMemo(() => {
    if (!selectedDealId) return dealRecs;
    const specific = dealRecs.filter(
      (r) => r.affectedEntityId === selectedDealId,
    );
    return specific.length > 0 ? specific : dealRecs;
  }, [dealRecs, selectedDealId]);

  const hasRecs = visibleRecs.length > 0;

  return (
    <div
      className="crm-card overflow-hidden border-orange-500/20 bg-slate-950/97"
      data-ocid="deal_intelligence.panel"
    >
      <button
        type="button"
        data-ocid="deal_intelligence.panel.toggle"
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors duration-150"
        aria-expanded={!collapsed}
        aria-controls="deal-intelligence-body"
      >
        <div className="flex items-center gap-2.5">
          <Zap size={13} className="flex-shrink-0 text-orange-500" />
          <span className="text-sm font-semibold text-foreground font-display">
            Deal Intelligence
          </span>
          <span
            className="inline-flex items-center text-[9px] px-1.5 py-0.5 rounded font-bold bg-orange-500/15 text-orange-500 border border-orange-500/30"
            style={{ letterSpacing: "0.06em" }}
          >
            ForgeAI
          </span>
          {isAnalyzing && (
            <span className="forgeai-pulse-dot" title="ForgeAI is analyzing" />
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasRecs && !collapsed && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center justify-center bg-orange-500/10 text-orange-500 border border-orange-500/20">
              {visibleRecs.length} insight{visibleRecs.length !== 1 ? "s" : ""}
            </span>
          )}
          {collapsed ? (
            <ChevronDown size={13} className="text-slate-400" />
          ) : (
            <ChevronUp size={13} className="text-slate-400" />
          )}
        </div>
      </button>

      {!collapsed && (
        <div
          id="deal-intelligence-body"
          className="border-t border-orange-500/10 px-4 pb-4 pt-3 space-y-3"
        >
          {!selectedDealId && (
            <div
              className="grid grid-cols-3 gap-2 mb-3"
              data-ocid="deal_intelligence.health_summary"
            >
              {(
                [
                  { label: "Active DRs", value: totalActive, color: "#8AABDC" },
                  {
                    label: "Stalled",
                    value: stalledCount,
                    color: stalledCount > 0 ? "#fb923c" : "#8AABDC",
                  },
                  {
                    label: "Duplicates",
                    value: duplicateCount,
                    color: duplicateCount > 0 ? "#fb923c" : "#8AABDC",
                  },
                ] as const
              ).map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-0.5 rounded-[0.375rem] py-2"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span
                    className="text-base font-bold"
                    style={{
                      color: stat.color,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {selectedDealId && (
            <p className="text-[11px] mb-2 text-slate-400 font-body">
              Showing insights for selected deal
            </p>
          )}

          {hasRecs ? (
            <div
              className="space-y-2.5"
              data-ocid="deal_intelligence.recommendations_list"
            >
              {visibleRecs.map((rec) => (
                <ForgeAIRecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onDismiss={dismissRecommendation}
                  showExpand
                />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center py-6 gap-2"
              data-ocid="deal_intelligence.empty_state"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-orange-500/10">
                <Zap size={14} className="text-orange-500" />
              </div>
              <p className="text-xs text-center text-slate-400 font-body">
                No deal intelligence signals detected.
                <br />
                <span className="text-slate-500">
                  ForgeAI is monitoring deal registrations in real time.
                </span>
              </p>
            </div>
          )}

          <div className="pt-2 mt-1 border-t border-orange-500/[0.08]">
            <p className="text-[10px] text-slate-600 font-mono">
              ForgeAI recommendations are assistive only — no auto-approvals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type ActiveTab = "all" | "under_review" | "duplicate_queue";

// ── Main Page ─────────────────────────────────────────────────────────────────
export function DealRegistrations() {
  const {
    dealRegistrations,
    accounts,
    loading,
    isVendor,
    refreshDealRegistrations,
  } = useApp();
  const { actor } = useActor();

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [duplicateQueue, setDuplicateQueue] = useState<DuplicateDRRecord[]>([]);
  const [dupLoading, setDupLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set());
  const [resellerFilter, setResellerFilter] = useState("");
  const [closeDateFrom, setCloseDateFrom] = useState("");
  const [closeDateTo, setCloseDateTo] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<DealRegistration | null>(
    null,
  );
  const [showCreate, setShowCreate] = useState(false);
  const [calcOpenForDeal, setCalcOpenForDeal] = useState<string | null>(null);

  const refreshDuplicateQueue = useCallback(async () => {
    if (!actor || !isVendor()) return;
    setDupLoading(true);
    try {
      const queue = await actor.getDuplicateDRQueue();
      setDuplicateQueue(queue);
    } catch {
      // silently fail
    } finally {
      setDupLoading(false);
    }
  }, [actor, isVendor]);

  useEffect(() => {
    if (actor && isVendor()) refreshDuplicateQueue();
  }, [actor, isVendor, refreshDuplicateQueue]);

  const duplicateDRIds = useMemo(
    () => new Set(duplicateQueue.map((r) => r.newDRId)),
    [duplicateQueue],
  );

  const pendingDupCount = useMemo(
    () =>
      duplicateQueue.filter(
        (r) => r.status === DuplicateDRStatus.PendingVendorReview,
      ).length,
    [duplicateQueue],
  );

  const stalledDealCount = useMemo(
    () =>
      dealRegistrations.filter((d) => d.status === DealStatus.UnderReview)
        .length,
    [dealRegistrations],
  );

  function toggleStatus(s: string) {
    setStatusFilters((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const resellers = useMemo(() => {
    const ids = new Set(
      dealRegistrations.map((d) => d.resellerId).filter(Boolean),
    );
    return Array.from(ids);
  }, [dealRegistrations]);

  const filtered = useMemo(() => {
    return dealRegistrations.filter((d) => {
      if (search) {
        const q = search.toLowerCase();
        const acc = accounts.find((a) => a.id === d.accountId);
        if (
          !d.opportunityName.toLowerCase().includes(q) &&
          !acc?.accountName.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilters.size > 0 && !statusFilters.has(d.status)) return false;
      if (resellerFilter && d.resellerId !== resellerFilter) return false;
      if (closeDateFrom) {
        const from = new Date(closeDateFrom).getTime() * 1_000_000;
        if (Number(d.closeDate) < from) return false;
      }
      if (closeDateTo) {
        const to = new Date(closeDateTo).getTime() * 1_000_000;
        if (Number(d.closeDate) > to) return false;
      }
      return true;
    });
  }, [
    dealRegistrations,
    accounts,
    search,
    statusFilters,
    resellerFilter,
    closeDateFrom,
    closeDateTo,
  ]);

  const handleStatusChange = useCallback(
    async (id: string, status: DealStatus) => {
      if (!actor) return;
      try {
        const result = await actor.updateDealStatus(id, status);
        if (result.__kind__ === "err") {
          toast.error(result.err);
          return;
        }
        toast.success(`Status updated to ${dealStatusLabel(status)}`);
        await refreshDealRegistrations();
        setSelectedDeal((prev) =>
          prev?.id === id ? { ...prev, status } : prev,
        );
      } catch {
        toast.error("Failed to update status");
      }
    },
    [actor, refreshDealRegistrations],
  );

  const totalValue = useMemo(
    () => filtered.reduce((sum, d) => sum + d.estimatedValue, 0),
    [filtered],
  );

  const underReviewDeals = useMemo(
    () => dealRegistrations.filter((d) => d.status === DealStatus.UnderReview),
    [dealRegistrations],
  );

  const accountsArr = useMemo(
    () =>
      accounts.map((a) => ({
        id: a.id,
        accountName: a.accountName,
        customerDomain: a.customerDomain,
      })),
    [accounts],
  );

  const tableDeals = activeTab === "under_review" ? underReviewDeals : filtered;

  return (
    <div className="space-y-5 fade-in" data-ocid="deal_registrations.page">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            Deal Registrations
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} deal{filtered.length !== 1 ? "s" : ""} &middot;{" "}
            {formatCurrency(totalValue)} total pipeline
            {isVendor() && pendingDupCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-orange-400">
                <AlertTriangle size={11} />
                {pendingDupCount} duplicate{pendingDupCount !== 1 ? "s" : ""}{" "}
                awaiting review
              </span>
            )}
          </p>
        </div>
        <Button
          data-ocid="deal_reg.new_deal_button"
          onClick={() => setShowCreate(true)}
          className="text-white flex-shrink-0 bg-orange-500"
        >
          <Plus size={14} className="mr-1.5" /> New Deal
        </Button>
      </div>

      {/* Tab bar (vendor only) */}
      {isVendor() && (
        <div
          className="flex items-center gap-1 border-b border-border"
          data-ocid="deal_reg.tabs"
        >
          {[
            {
              id: "all" as ActiveTab,
              label: "All Deals",
              count: dealRegistrations.length,
              alert: false,
            },
            {
              id: "under_review" as ActiveTab,
              label: "Under Review",
              count: underReviewDeals.length,
              alert: false,
            },
            {
              id: "duplicate_queue" as ActiveTab,
              label: "Duplicate Queue",
              count: pendingDupCount,
              alert: pendingDupCount > 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`deal_reg.tab.${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 text-xs px-4 py-2.5 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 ${
                    tab.alert
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-secondary/60 text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Duplicate Queue panel */}
      {isVendor() && activeTab === "duplicate_queue" && (
        <DuplicateQueue
          records={duplicateQueue}
          allDeals={dealRegistrations}
          accounts={accounts}
          loading={dupLoading}
          onRefresh={async () => {
            await Promise.all([
              refreshDuplicateQueue(),
              refreshDealRegistrations(),
            ]);
          }}
        />
      )}

      {/* Filter bar — hidden on duplicate_queue tab */}
      {activeTab !== "duplicate_queue" && (
        <div className="crm-card p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                data-ocid="deal_reg.search_input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by opportunity or account…"
                className="crm-input pl-8 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <select
                data-ocid="deal_reg.reseller.select"
                value={resellerFilter}
                onChange={(e) => setResellerFilter(e.target.value)}
                className="crm-input px-3 py-2 text-sm"
              >
                <option value="">All Resellers</option>
                {resellers.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Close date:</span>
            <Input
              type="date"
              data-ocid="deal_reg.close_from.input"
              value={closeDateFrom}
              onChange={(e) => setCloseDateFrom(e.target.value)}
              className="crm-input text-xs w-36"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="date"
              data-ocid="deal_reg.close_to.input"
              value={closeDateTo}
              onChange={(e) => setCloseDateTo(e.target.value)}
              className="crm-input text-xs w-36"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                data-ocid={`deal_reg.filter_${s.toLowerCase()}.toggle`}
                onClick={() => toggleStatus(s)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  statusFilters.has(s)
                    ? `${STATUS_PILL_COLORS[s]} border-transparent`
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
              >
                {dealStatusLabel(s)}
              </button>
            ))}
            {statusFilters.size > 0 && (
              <button
                type="button"
                data-ocid="deal_reg.clear_filters.button"
                onClick={() => setStatusFilters(new Set())}
                className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X size={10} /> Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          data-ocid="deal_reg.create.dialog"
        >
          <div className="crm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 fade-in scrollbar-thin">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-foreground">
                New Deal Registration
              </h2>
              <button
                type="button"
                data-ocid="deal_reg.create.close_button"
                onClick={() => setShowCreate(false)}
                className="p-1.5 rounded-md hover:bg-secondary/40 text-muted-foreground"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
            <DealForm
              accounts={accountsArr}
              onClose={() => setShowCreate(false)}
              onSaved={refreshDealRegistrations}
            />
          </div>
        </div>
      )}

      {/* Table — hidden on duplicate_queue tab */}
      {activeTab !== "duplicate_queue" && (
        <div className="crm-card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : tableDeals.length === 0 ? (
            <div
              className="flex flex-col items-center py-16 px-6"
              data-ocid="deal_reg.empty_state"
            >
              <Briefcase size={40} className="text-muted-foreground mb-4" />
              <p className="text-base font-semibold text-foreground mb-1">
                {activeTab === "under_review"
                  ? "No deals under review"
                  : "No deal registrations found"}
              </p>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
                {dealRegistrations.length === 0
                  ? "Create your first deal registration to track partner opportunities."
                  : "Adjust your filters or search to see more results."}
              </p>
              {dealRegistrations.length === 0 && (
                <Button
                  data-ocid="deal_reg.empty.create_button"
                  onClick={() => setShowCreate(true)}
                  style={{ background: "#FF6B2B" }}
                  className="text-white"
                >
                  <Plus size={14} className="mr-1.5" /> Create Deal Registration
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {[
                      "Opportunity",
                      "Account",
                      "Reseller",
                      "Value",
                      "Close Date",
                      "Status",
                      "Vendor Owner",
                      "Submitted",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableDeals.map((d, i) => {
                    const acc = accounts.find((a) => a.id === d.accountId);
                    const isDup = duplicateDRIds.has(d.id);
                    return (
                      <tr
                        key={d.id}
                        data-ocid={`deal_reg.item.${i + 1}`}
                        onClick={() => setSelectedDeal(d)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setSelectedDeal(d)
                        }
                        tabIndex={0}
                        className={`border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer${
                          isDup ? " bg-orange-500/5" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 font-medium text-foreground max-w-[160px]">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-orange-500/15 text-orange-500">
                              {d.opportunityName[0]?.toUpperCase() ?? "D"}
                            </div>
                            <span className="truncate max-w-[120px]">
                              {d.opportunityName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <ClickableAccountName
                            accountName={
                              acc?.accountName ?? d.accountId.slice(0, 8)
                            }
                            accountId={d.accountId}
                            context="deal-registration"
                            className="text-muted-foreground"
                          />
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {d.resellerId || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-foreground font-mono text-xs">
                          {formatCurrency(d.estimatedValue)}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                          {formatDate(d.closeDate)}
                        </td>
                        <td className="px-4 py-3.5">
                          {isDup ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className="inline-flex items-center gap-1 bg-orange-500/15 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/30"
                                title="Duplicate registration — pending vendor review"
                              >
                                <AlertTriangle size={8} /> Pending Vendor Review
                              </span>
                              {isVendor() && (
                                <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-orange-500/25">
                                  DUPLICATE
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className={dealStatusColor(d.status)}>
                              {dealStatusLabel(d.status)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {d.vendorOwnerId || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                          {d.submittedDate ? formatDate(d.submittedDate) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCalcOpenForDeal(d.id);
                            }}
                            className="p-1.5 rounded text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
                            title="Price Calculator"
                            type="button"
                          >
                            <Calculator size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Deal Intelligence Panel */}
      {activeTab !== "duplicate_queue" && (
        <DealIntelligencePanel
          selectedDealId={selectedDeal?.id ?? null}
          totalActive={dealRegistrations.length}
          stalledCount={stalledDealCount}
          duplicateCount={pendingDupCount}
        />
      )}

      {/* Price Calculator slide-over */}
      {calcOpenForDeal && (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-slate-900 border-l border-slate-700 z-50 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-white font-semibold">Price Calculator</h2>
            <button
              onClick={() => setCalcOpenForDeal(null)}
              className="text-slate-400 hover:text-white"
              type="button"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <PriceCalculator readOnly={false} />
          </div>
        </div>
      )}

      {/* Detail side panel */}
      {selectedDeal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSelectedDeal(null)}
            onKeyDown={(e) => e.key === "Escape" && setSelectedDeal(null)}
            aria-hidden="true"
          />
          <DetailPanel
            deal={selectedDeal}
            onClose={() => setSelectedDeal(null)}
            onStatusChange={handleStatusChange}
            isVendor={isVendor()}
          />
        </>
      )}
    </div>
  );
}
