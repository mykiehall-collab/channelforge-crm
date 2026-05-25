import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Edit2,
  ExternalLink,
  Link2,
  MoreVertical,
  Save,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  DealRegistration,
  Opportunity,
  OpportunityStage,
} from "../backend.d";
import { CustomFieldEditor } from "../components/CustomFieldEditor";
import { CustomFieldRenderer } from "../components/CustomFieldRenderer";
import { ForgeAIRecommendationCard } from "../components/ForgeAIRecommendationCard";
import { PriceCalculator } from "../components/PriceCalculator";
import { useActor } from "../hooks/useActor";
import { useCustomFields } from "../hooks/useCustomFields";
import { useForgeAI } from "../hooks/useForgeAI";
import { formatCurrency, timeAgo } from "../utils/channelforge";

// ── Helpers ────────────────────────────────────────────────────────────────────

const STAGE_ORDER: OpportunityStage[] = [
  "prospecting" as OpportunityStage,
  "qualification" as OpportunityStage,
  "proposal" as OpportunityStage,
  "negotiation" as OpportunityStage,
  "closedWon" as OpportunityStage,
  "closedLost" as OpportunityStage,
];

const STAGE_LABEL: Record<string, string> = {
  prospecting: "Prospecting",
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closedWon: "Closed Won",
  closedLost: "Closed Lost",
};

const STAGE_COLOR: Record<string, string> = {
  prospecting: "bg-muted/40 text-muted-foreground border-border",
  qualification: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  proposal: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  negotiation: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  closedWon: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  closedLost: "bg-red-500/15 text-red-300 border-red-500/30",
};

function formatDateStr(ns: bigint): string {
  if (!ns) return "—";
  const d = new Date(Number(ns) / 1_000_000);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dateToNs(val: string): bigint {
  if (!val) return BigInt(0);
  return BigInt(new Date(val).getTime() * 1_000_000);
}

function nsToDateInput(ns: bigint): string {
  if (!ns) return "";
  return new Date(Number(ns) / 1_000_000).toISOString().split("T")[0];
}

type Tab = "overview" | "deals" | "customFields" | "history" | "priceCalc";

// ── History Entry ─────────────────────────────────────────────────────────────

interface HistoryEntry {
  id: string;
  type: "stage" | "field" | "created" | "archived";
  label: string;
  detail?: string;
  by: string;
  at: bigint;
}

function buildHistory(opp: Opportunity): HistoryEntry[] {
  // Build synthetic history from available data
  const entries: HistoryEntry[] = [
    {
      id: "created",
      type: "created",
      label: "Opportunity created",
      by: opp.ownerUserId || "System",
      at: opp.createdAt,
    },
  ];
  if (opp.updatedAt !== opp.createdAt) {
    entries.push({
      id: "updated",
      type: "field",
      label: "Opportunity updated",
      detail: `Stage: ${STAGE_LABEL[opp.stage] ?? opp.stage}`,
      by: opp.ownerUserId || "System",
      at: opp.updatedAt,
    });
  }
  return entries.sort((a, b) => (a.at < b.at ? 1 : -1));
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({
  opp,
  onStageChange,
  stageChanging,
  editMode,
  editForm,
  onEditChange,
  forgeRec,
}: {
  opp: Opportunity;
  onStageChange: (stage: OpportunityStage) => void;
  stageChanging: boolean;
  editMode: boolean;
  editForm: Partial<Opportunity & { closeDateStr: string; revenueStr: string }>;
  onEditChange: (key: string, val: string) => void;
  forgeRec: import("../types").ForgeAIRecommendation | null;
}) {
  const [showStageMenu, setShowStageMenu] = useState(false);

  const fields: Array<{ label: string; value: ReactNode }> = [
    {
      label: "Customer Account",
      value: editMode ? (
        <Input
          className="crm-input h-8 text-sm"
          value={editForm.customerAccountId ?? ""}
          onChange={(e) => onEditChange("customerAccountId", e.target.value)}
        />
      ) : opp.customerAccountId ? (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          style={{ color: "#FF6B2B" }}
        >
          <ExternalLink size={12} />
          {opp.customerAccountId}
        </button>
      ) : (
        <span className="text-sm text-muted-foreground italic">—</span>
      ),
    },
    {
      label: "Owner",
      value: (
        <span className="text-sm text-foreground">
          {opp.ownerUserId || "—"}
        </span>
      ),
    },
    {
      label: "Revenue Estimate",
      value: editMode ? (
        <Input
          type="number"
          className="crm-input h-8 text-sm"
          value={editForm.revenueStr ?? ""}
          onChange={(e) => onEditChange("revenueStr", e.target.value)}
        />
      ) : (
        <span
          className="text-sm font-bold font-mono"
          style={{ color: "#FF6B2B" }}
        >
          {formatCurrency(Number(opp.revenueEstimate))}
        </span>
      ),
    },
    {
      label: "Close Date",
      value: editMode ? (
        <Input
          type="date"
          className="crm-input h-8 text-sm"
          value={editForm.closeDateStr ?? ""}
          onChange={(e) => onEditChange("closeDateStr", e.target.value)}
        />
      ) : (
        <span className="text-sm text-foreground">
          {formatDateStr(opp.closeDate)}
        </span>
      ),
    },
    {
      label: "Reseller",
      value: editMode ? (
        <Input
          className="crm-input h-8 text-sm"
          value={editForm.resellerId ?? ""}
          onChange={(e) => onEditChange("resellerId", e.target.value)}
        />
      ) : (
        <span className="text-sm text-foreground">{opp.resellerId || "—"}</span>
      ),
    },
    {
      label: "Distributor",
      value: editMode ? (
        <Input
          className="crm-input h-8 text-sm"
          value={editForm.distributorId ?? ""}
          onChange={(e) => onEditChange("distributorId", e.target.value)}
        />
      ) : (
        <span className="text-sm text-foreground">
          {opp.distributorId || "—"}
        </span>
      ),
    },
    {
      label: "Vendor",
      value: (
        <span className="text-sm text-foreground">
          {opp.vendorOwnerId || "—"}
        </span>
      ),
    },
    {
      label: "Status",
      value: <span className="text-sm text-foreground">{opp.status}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stage control */}
      <div className="crm-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {STAGE_ORDER.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && (
                  <ChevronRight size={12} className="text-muted-foreground" />
                )}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    s === opp.stage
                      ? STAGE_COLOR[s]
                      : "bg-transparent text-muted-foreground/50 border-transparent"
                  }`}
                >
                  {STAGE_LABEL[s]}
                </span>
              </div>
            ))}
          </div>
          <div className="relative flex-shrink-0">
            <button
              type="button"
              data-ocid="opportunity.stage_change.button"
              disabled={stageChanging}
              onClick={() => setShowStageMenu((v) => !v)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:border-accent/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              Move Stage <MoreVertical size={12} />
            </button>
            {showStageMenu && (
              <div
                className="absolute right-0 top-8 z-20 crm-card min-w-[160px] py-1 shadow-lg fade-in"
                data-ocid="opportunity.stage_change.dropdown_menu"
              >
                {STAGE_ORDER.filter((s) => s !== opp.stage).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setShowStageMenu(false);
                      onStageChange(s);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary/40 transition-colors"
                  >
                    {STAGE_LABEL[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core fields */}
      <div className="crm-card p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Core Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {f.label}
              </span>
              {f.value}
            </div>
          ))}
        </div>
      </div>

      {/* ForgeAI Recommendation */}
      {forgeRec && (
        <div
          className="p-3 rounded-[0.5rem] border"
          style={{
            background: "rgba(255,107,43,0.04)",
            borderColor: "rgba(255,107,43,0.18)",
          }}
          data-ocid="opportunity.forgeai.panel"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={13} style={{ color: "#FF6B2B" }} />
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#FF6B2B" }}
            >
              ForgeAI Recommendation
            </span>
          </div>
          <ForgeAIRecommendationCard recommendation={forgeRec} />
        </div>
      )}
    </div>
  );
}

// ── Deals Tab ─────────────────────────────────────────────────────────────────

function DealsTab({
  deals,
  loadingDeals,
}: {
  deals: DealRegistration[];
  loadingDeals: boolean;
}) {
  const navigate = useNavigate();

  if (loadingDeals) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {deals.length} associated deal registration
          {deals.length !== 1 ? "s" : ""}
        </p>
        <button
          type="button"
          data-ocid="opportunity.deals.link_button"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:border-accent/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link2 size={12} /> Link Deal
        </button>
      </div>

      {deals.length === 0 ? (
        <div
          className="crm-card py-12 flex flex-col items-center gap-3"
          data-ocid="opportunity.deals.empty_state"
        >
          <Link2 size={32} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No deal registrations linked yet
          </p>
        </div>
      ) : (
        <div className="crm-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Deal Name", "Value", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deals.map((d, i) => (
                <tr
                  key={d.id}
                  data-ocid={`opportunity.deals.item.${i + 1}`}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    {d.opportunityName}
                  </td>
                  <td
                    className="px-5 py-3.5 font-mono font-semibold"
                    style={{ color: "#FF6B2B" }}
                  >
                    {formatCurrency(d.estimatedValue)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/40 text-muted-foreground">
                      {d.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      data-ocid={`opportunity.deals.view.${i + 1}`}
                      onClick={() =>
                        navigate({
                          to: "/deal-registrations",
                        })
                      }
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      View <ExternalLink size={10} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Custom Fields Tab ─────────────────────────────────────────────────────────

function CustomFieldsTab({
  objectId,
  canEdit,
}: {
  objectId: string;
  canEdit: boolean;
}) {
  const customFields = useCustomFields(
    "opportunity" as import("../backend.d").CustomFieldObjectType,
    objectId,
  );
  const [editMode, setEditMode] = useState(false);

  if (customFields.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  const activeDefs = customFields.fieldDefs.filter((f) => !f.isArchived);

  if (activeDefs.length === 0) {
    return (
      <div
        className="crm-card py-12 flex flex-col items-center gap-3"
        data-ocid="opportunity.custom_fields.empty_state"
      >
        <p className="text-sm text-muted-foreground">
          No custom fields configured for Opportunities
        </p>
      </div>
    );
  }

  async function handleSave() {
    try {
      await customFields.saveFieldValues();
      if (Object.keys(customFields.errors).length === 0) {
        setEditMode(false);
        toast.success("Custom fields saved");
      }
    } catch {
      toast.error("Failed to save custom fields");
    }
  }

  return (
    <div className="space-y-4">
      {canEdit && (
        <div className="flex items-center justify-between">
          {!editMode ? (
            <Button
              type="button"
              variant="outline"
              data-ocid="opportunity.custom_fields.edit_button"
              onClick={() => setEditMode(true)}
            >
              <Edit2 size={13} className="mr-1.5" /> Edit Custom Fields
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                data-ocid="opportunity.custom_fields.cancel_button"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="opportunity.custom_fields.save_button"
                disabled={
                  customFields.isSaving || !customFields.hasPendingChanges
                }
                onClick={handleSave}
                style={{ background: "#FF6B2B" }}
                className="text-white"
              >
                <Save size={13} className="mr-1.5" />
                {customFields.isSaving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="crm-card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {activeDefs.map((def) =>
            editMode ? (
              <CustomFieldEditor
                key={def.id}
                fieldDef={def}
                value={
                  customFields.pendingChanges[def.id] ??
                  customFields.fieldValues[def.id]?.value ??
                  ""
                }
                onChange={(v) => customFields.setFieldValue(def.id, v)}
                error={customFields.errors[def.id]}
              />
            ) : (
              <CustomFieldRenderer
                key={def.id}
                fieldDef={def}
                value={customFields.fieldValues[def.id]}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

// ── History Tab ───────────────────────────────────────────────────────────────

function HistoryTab({ opp }: { opp: Opportunity }) {
  const entries = buildHistory(opp);

  return (
    <div className="space-y-3" data-ocid="opportunity.history.list">
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          data-ocid={`opportunity.history.item.${i + 1}`}
          className="flex items-start gap-3"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background:
                entry.type === "stage"
                  ? "rgba(255,107,43,0.15)"
                  : "rgba(100,140,220,0.1)",
            }}
          >
            <Clock
              size={13}
              style={{
                color: entry.type === "stage" ? "#FF6B2B" : "#6B8CAE",
              }}
            />
          </div>
          <div className="flex-1 crm-card p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">
                {entry.label}
              </span>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {timeAgo(entry.at)}
              </span>
            </div>
            {entry.detail && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {entry.detail}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">
              by {entry.by}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function OpportunityRecord() {
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/opportunities/")[1];
  const navigate = useNavigate();
  const { actor } = useActor();
  const { recommendations } = useForgeAI();

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<
    Partial<Opportunity & { closeDateStr: string; revenueStr: string }>
  >({});
  const [saving, setSaving] = useState(false);
  const [stageChanging, setStageChanging] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [deals, setDeals] = useState<DealRegistration[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(false);

  const forgeRec =
    recommendations.find(
      (r) =>
        r.affectedEntityId === id ||
        ((r.affectedEntityType as string) === "Opportunity" &&
          r.affectedEntityName === opp?.opportunityName),
    ) ?? null;

  const load = useCallback(async () => {
    if (!actor || !id) return;
    setLoading(true);
    try {
      const result = await actor.getOpportunity(id);
      if (result) {
        setOpp(result);
      } else {
        toast.error("Opportunity not found");
        navigate({ to: "/opportunities" });
      }
    } catch {
      toast.error("Failed to load opportunity");
    } finally {
      setLoading(false);
    }
  }, [actor, id, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  // Load associated deals
  useEffect(() => {
    if (!actor || !opp || opp.associatedDealIds.length === 0) return;
    setLoadingDeals(true);
    Promise.allSettled(
      opp.associatedDealIds.map((dealId) => actor.getDealRegistration(dealId)),
    )
      .then((results) => {
        const loaded: DealRegistration[] = [];
        for (const r of results) {
          if (r.status === "fulfilled" && r.value) {
            loaded.push(r.value);
          }
        }
        setDeals(loaded);
      })
      .catch(() => {})
      .finally(() => setLoadingDeals(false));
  }, [actor, opp]);

  function enterEditMode() {
    if (!opp) return;
    setEditForm({
      opportunityName: opp.opportunityName,
      customerAccountId: opp.customerAccountId,
      ownerUserId: opp.ownerUserId,
      resellerId: opp.resellerId,
      distributorId: opp.distributorId,
      closeDateStr: nsToDateInput(opp.closeDate),
      revenueStr: String(opp.revenueEstimate),
    });
    setEditMode(true);
  }

  function handleEditChange(key: string, val: string) {
    setEditForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    if (!actor || !opp) return;
    setSaving(true);
    try {
      const updated = await actor.updateOpportunity(id, {
        opportunityName: editForm.opportunityName,
        customerAccountId: editForm.customerAccountId || undefined,
        resellerId: editForm.resellerId || undefined,
        distributorId: editForm.distributorId || undefined,
        closeDate: editForm.closeDateStr
          ? dateToNs(editForm.closeDateStr)
          : undefined,
        revenueEstimate: editForm.revenueStr
          ? BigInt(Math.round(Number(editForm.revenueStr)))
          : undefined,
      });
      if (updated) {
        setOpp(updated);
        setEditMode(false);
        toast.success("Opportunity updated");
      } else {
        toast.error("Failed to update: not found");
      }
    } catch {
      toast.error("Failed to update opportunity");
    } finally {
      setSaving(false);
    }
  }

  async function handleStageChange(stage: OpportunityStage) {
    if (!actor || !opp) return;
    setStageChanging(true);
    try {
      const updated = await actor.updateOpportunity(id, { stage });
      if (updated) {
        setOpp(updated);
        toast.success(`Stage updated to ${STAGE_LABEL[stage]}`);
      } else {
        toast.error("Failed to update stage");
      }
    } catch {
      toast.error("Failed to update stage");
    } finally {
      setStageChanging(false);
    }
  }

  async function handleArchive() {
    if (!actor) return;
    setArchiving(true);
    try {
      const ok = await actor.archiveOpportunity(id);
      if (ok) {
        toast.success("Opportunity archived");
        navigate({ to: "/opportunities" });
      } else {
        toast.error("Failed to archive opportunity");
      }
    } catch {
      toast.error("Failed to archive opportunity");
    } finally {
      setArchiving(false);
      setShowArchiveConfirm(false);
    }
  }

  const TABS: Array<{ key: Tab; label: string }> = [
    { key: "overview", label: "Overview" },
    { key: "deals", label: `Deals (${deals.length})` },
    { key: "customFields", label: "Custom Fields" },
    { key: "history", label: "History" },
    { key: "priceCalc", label: "Price Calculator" },
  ];

  if (loading) {
    return (
      <div
        className="space-y-5 fade-in"
        data-ocid="opportunity-record.loading_state"
      >
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!opp) return null;

  return (
    <div className="space-y-5 fade-in" data-ocid="opportunity-record.page">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          type="button"
          data-ocid="opportunity-record.back.link"
          onClick={() => navigate({ to: "/opportunities" })}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Opportunities
        </button>
        <ChevronRight size={12} />
        <span className="text-foreground truncate max-w-[240px]">
          {opp.opportunityName}
        </span>
      </nav>

      {/* Header */}
      <div
        className="crm-card p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,107,43,0.04) 0%, rgba(14,27,46,0.8) 100%)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            {editMode ? (
              <Input
                className="crm-input text-xl font-bold font-display mb-2"
                value={editForm.opportunityName ?? ""}
                onChange={(e) =>
                  handleEditChange("opportunityName", e.target.value)
                }
                data-ocid="opportunity-record.name.input"
              />
            ) : (
              <h1 className="text-xl font-bold text-foreground font-display break-words">
                {opp.opportunityName}
              </h1>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className="text-lg font-bold font-mono"
                style={{ color: "#FF6B2B" }}
              >
                {formatCurrency(Number(opp.revenueEstimate))}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  STAGE_COLOR[opp.stage]
                }`}
              >
                {STAGE_LABEL[opp.stage] ?? opp.stage}
              </span>
              <span className="text-sm text-muted-foreground">
                Close: {formatDateStr(opp.closeDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {editMode ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="opportunity-record.cancel_button"
                  onClick={() => setEditMode(false)}
                >
                  <X size={13} className="mr-1" /> Cancel
                </Button>
                <Button
                  type="button"
                  data-ocid="opportunity-record.save_button"
                  disabled={saving}
                  onClick={handleSave}
                  style={{ background: "#FF6B2B" }}
                  className="text-white"
                >
                  <Save size={13} className="mr-1" />
                  {saving ? "Saving…" : "Save"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="opportunity-record.edit_button"
                  onClick={enterEditMode}
                >
                  <Edit2 size={13} className="mr-1" /> Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="opportunity-record.archive.open_modal_button"
                  onClick={() => setShowArchiveConfirm(true)}
                  className="text-destructive border-destructive/40 hover:bg-destructive/10"
                >
                  <Trash2 size={13} className="mr-1" /> Archive
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 border-b border-border"
        role="tablist"
        data-ocid="opportunity-record.tabs"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            data-ocid={`opportunity-record.${tab.key}.tab`}
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div data-ocid={`opportunity-record.${activeTab}.panel`}>
        {activeTab === "overview" && (
          <OverviewTab
            opp={opp}
            onStageChange={handleStageChange}
            stageChanging={stageChanging}
            editMode={editMode}
            editForm={editForm}
            onEditChange={handleEditChange}
            forgeRec={forgeRec}
          />
        )}
        {activeTab === "deals" && (
          <DealsTab deals={deals} loadingDeals={loadingDeals} />
        )}
        {activeTab === "customFields" && (
          <CustomFieldsTab objectId={id} canEdit={true} />
        )}
        {activeTab === "history" && <HistoryTab opp={opp} />}
        {activeTab === "priceCalc" && (
          <div>
            <h2 className="text-base font-semibold text-foreground px-4 pt-4">
              Price Calculator
            </h2>
            <div className="p-4">
              <PriceCalculator
                opportunityId={opp?.id ?? ""}
                accountId={opp?.customerAccountId ?? ""}
                readOnly={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Archive Confirmation */}
      {showArchiveConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)" }}
        >
          <div
            className="crm-card w-full max-w-md p-6 fade-in"
            data-ocid="opportunity-record.archive.dialog"
          >
            <h3 className="text-base font-bold text-foreground mb-2">
              Archive Opportunity
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Are you sure you want to archive{" "}
              <span className="text-foreground font-medium">
                {opp.opportunityName}
              </span>
              ? This action can be reversed by an admin.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                data-ocid="opportunity-record.archive.cancel_button"
                onClick={() => setShowArchiveConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="opportunity-record.archive.confirm_button"
                disabled={archiving}
                onClick={handleArchive}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {archiving ? "Archiving…" : "Archive"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
