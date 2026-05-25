import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronDown,
  DollarSign,
  Edit2,
  Plus,
  Save,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  CustomFieldObjectType,
  MarketingActivityStatus,
  MarketingActivityType,
} from "../backend";
import type {
  MarketingActivity,
  MarketingActivityUpdateInput,
} from "../backend.d";
import { CustomFieldEditor } from "../components/CustomFieldEditor";
import { CustomFieldRenderer } from "../components/CustomFieldRenderer";
import { useActor } from "../hooks/useActor";
import { useCustomFields } from "../hooks/useCustomFields";
import { formatCurrency, formatDate } from "../utils/channelforge";

// ─── Shared badge helpers ─────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  [MarketingActivityType.webinar]:
    "bg-purple-500/15 text-purple-300 border-purple-500/25",
  [MarketingActivityType.event]:
    "bg-blue-500/15 text-blue-300 border-blue-500/25",
  [MarketingActivityType.emailCampaign]:
    "bg-green-500/15 text-green-300 border-green-500/25",
  [MarketingActivityType.content]:
    "bg-teal-500/15 text-teal-300 border-teal-500/25",
  [MarketingActivityType.sponsorship]:
    "bg-amber-500/15 text-amber-300 border-amber-500/25",
  [MarketingActivityType.other]:
    "bg-muted/40 text-muted-foreground border-border",
};

const TYPE_LABELS: Record<string, string> = {
  [MarketingActivityType.webinar]: "Webinar",
  [MarketingActivityType.event]: "Event",
  [MarketingActivityType.emailCampaign]: "Email Campaign",
  [MarketingActivityType.content]: "Content",
  [MarketingActivityType.sponsorship]: "Sponsorship",
  [MarketingActivityType.other]: "Other",
};

const STATUS_COLORS: Record<string, string> = {
  [MarketingActivityStatus.planned]:
    "bg-muted/40 text-muted-foreground border-border",
  [MarketingActivityStatus.inProgress]:
    "bg-blue-500/15 text-blue-300 border-blue-500/25",
  [MarketingActivityStatus.completed]:
    "bg-green-500/15 text-green-300 border-green-500/25",
  [MarketingActivityStatus.cancelled]:
    "bg-[oklch(0.22_0.03_250)]/60 text-[oklch(0.55_0.02_250)] border border-[oklch(0.28_0.03_250)]",
};

const STATUS_LABELS: Record<string, string> = {
  [MarketingActivityStatus.planned]: "Planned",
  [MarketingActivityStatus.inProgress]: "In Progress",
  [MarketingActivityStatus.completed]: "Completed",
  [MarketingActivityStatus.cancelled]: "Cancelled",
};

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "JPY", "CNY"];

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`status-badge border ${TYPE_COLORS[type] ?? "bg-muted/30 text-muted-foreground border-border"}`}
    >
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`status-badge border ${STATUS_COLORS[status] ?? "bg-muted/30 text-muted-foreground border-border"}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

// ─── Tab navigation ───────────────────────────────────────────────────────────

type Tab = "overview" | "target-accounts" | "custom-fields" | "roi-tracking";

const TABS: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: "overview", label: "Overview", icon: Target },
  { id: "target-accounts", label: "Target Accounts", icon: Building2 },
  { id: "custom-fields", label: "Custom Fields", icon: Edit2 },
  { id: "roi-tracking", label: "ROI Tracking", icon: TrendingUp },
];

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewField({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function OverviewTab({
  activity,
  onRefetch,
}: {
  activity: MarketingActivity;
  onRefetch: () => void;
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    activityName: activity.activityName,
    activityType: activity.activityType as string,
    status: activity.status as string,
    startDate: new Date(Number(activity.startDate) / 1_000_000)
      .toISOString()
      .split("T")[0],
    endDate: new Date(Number(activity.endDate) / 1_000_000)
      .toISOString()
      .split("T")[0],
    budget: String(Number(activity.budget) / 100),
    currency: activity.currency,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const startMs = new Date(form.startDate).getTime();
      const endMs = new Date(form.endDate).getTime();
      const update: MarketingActivityUpdateInput = {
        activityName: form.activityName,
        activityType: form.activityType as MarketingActivityType,
        status: form.status as MarketingActivityStatus,
        startDate: BigInt(startMs * 1_000_000),
        endDate: BigInt(endMs * 1_000_000),
        budget: BigInt(Math.round(Number.parseFloat(form.budget) * 100) || 0),
        currency: form.currency,
      };
      await actor.updateMarketingActivity(activity.id, update);
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id],
      });
      toast.success("Activity updated");
      setEditing(false);
      onRefetch();
    } catch {
      toast.error("Failed to update activity");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="space-y-4 fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="ma-name"
              className="block text-xs text-muted-foreground mb-1"
            >
              Activity Name *
            </label>
            <Input
              id="ma-name"
              required
              data-ocid="marketing-activity-record.edit.name.input"
              value={form.activityName}
              onChange={(e) => set("activityName", e.target.value)}
              className="crm-input"
            />
          </div>
          <div>
            <label
              htmlFor="ma-type"
              className="block text-xs text-muted-foreground mb-1"
            >
              Type
            </label>
            <select
              id="ma-type"
              data-ocid="marketing-activity-record.edit.type.select"
              value={form.activityType}
              onChange={(e) => set("activityType", e.target.value)}
              className="crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem]"
            >
              {Object.values(MarketingActivityType).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="ma-status"
              className="block text-xs text-muted-foreground mb-1"
            >
              Status
            </label>
            <select
              id="ma-status"
              data-ocid="marketing-activity-record.edit.status.select"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem]"
            >
              {Object.values(MarketingActivityStatus).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="ma-start-date"
              className="block text-xs text-muted-foreground mb-1"
            >
              Start Date
            </label>
            <Input
              id="ma-start-date"
              type="date"
              data-ocid="marketing-activity-record.edit.start_date.input"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className="crm-input"
            />
          </div>
          <div>
            <label
              htmlFor="ma-end-date"
              className="block text-xs text-muted-foreground mb-1"
            >
              End Date
            </label>
            <Input
              id="ma-end-date"
              type="date"
              data-ocid="marketing-activity-record.edit.end_date.input"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              className="crm-input"
            />
          </div>
          <div>
            <label
              htmlFor="ma-budget"
              className="block text-xs text-muted-foreground mb-1"
            >
              Budget
            </label>
            <Input
              id="ma-budget"
              type="number"
              min="0"
              step="0.01"
              data-ocid="marketing-activity-record.edit.budget.input"
              value={form.budget}
              onChange={(e) => set("budget", e.target.value)}
              className="crm-input"
            />
          </div>
          <div>
            <label
              htmlFor="ma-currency"
              className="block text-xs text-muted-foreground mb-1"
            >
              Currency
            </label>
            <select
              id="ma-currency"
              data-ocid="marketing-activity-record.edit.currency.select"
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
              className="crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem]"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            data-ocid="marketing-activity-record.edit.cancel_button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            data-ocid="marketing-activity-record.edit.save_button"
            disabled={saving}
            style={{ background: "#FF6B2B" }}
            className="text-white"
          >
            <Save size={14} className="mr-1.5" />
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-5 fade-in">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="marketing-activity-record.edit.button"
          onClick={() => setEditing(true)}
        >
          <Edit2 size={13} className="mr-1.5" /> Edit
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <OverviewField label="Activity Type">
          <TypeBadge type={activity.activityType} />
        </OverviewField>
        <OverviewField label="Status">
          <StatusBadge status={activity.status} />
        </OverviewField>
        <OverviewField label="Budget">
          <span className="font-mono" style={{ color: "#FF6B2B" }}>
            {formatCurrency(Number(activity.budget) / 100, activity.currency)}
            <span className="ml-1.5 text-xs text-muted-foreground">
              {activity.currency}
            </span>
          </span>
        </OverviewField>
        <OverviewField label="Start Date">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-muted-foreground" />
            {formatDate(activity.startDate)}
          </span>
        </OverviewField>
        <OverviewField label="End Date">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-muted-foreground" />
            {formatDate(activity.endDate)}
          </span>
        </OverviewField>
        <OverviewField label="Owner User ID">
          <span className="text-muted-foreground text-xs font-mono">
            {activity.ownerUserId || "—"}
          </span>
        </OverviewField>
        <OverviewField label="Vendor Owner">
          <span className="text-muted-foreground text-xs font-mono">
            {activity.vendorOwnerId || "—"}
          </span>
        </OverviewField>
        {activity.distributorId && (
          <OverviewField label="Distributor">
            <span className="text-muted-foreground text-xs font-mono">
              {activity.distributorId}
            </span>
          </OverviewField>
        )}
        {activity.resellerId && (
          <OverviewField label="Reseller">
            <span className="text-muted-foreground text-xs font-mono">
              {activity.resellerId}
            </span>
          </OverviewField>
        )}
        {activity.associatedPromotionIds.length > 0 && (
          <OverviewField label="Associated Promotions">
            <div className="flex flex-wrap gap-1">
              {activity.associatedPromotionIds.map((pid) => (
                <span
                  key={pid}
                  className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
                >
                  {pid}
                </span>
              ))}
            </div>
          </OverviewField>
        )}
        <OverviewField label="ROI">
          {activity.roi !== undefined && activity.roi !== null ? (
            <span className="text-green-400 font-mono font-semibold">
              {Number(activity.roi)}%
            </span>
          ) : (
            <span className="text-muted-foreground italic text-xs">
              Not tracked
            </span>
          )}
        </OverviewField>
      </div>
    </div>
  );
}

// ─── Target Accounts tab ──────────────────────────────────────────────────────

function TargetAccountsTab({
  activity,
  onRefetch,
}: {
  activity: MarketingActivity;
  onRefetch: () => void;
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [newAccountId, setNewAccountId] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleRemove(accountId: string) {
    if (!actor) return;
    const updated = activity.targetAccountIds.filter((id) => id !== accountId);
    try {
      await actor.updateMarketingActivity(activity.id, {
        targetAccountIds: updated,
      });
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id],
      });
      toast.success("Account removed");
      onRefetch();
    } catch {
      toast.error("Failed to remove account");
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !newAccountId.trim()) return;
    setSaving(true);
    try {
      const ids = newAccountId
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const updated = Array.from(
        new Set([...activity.targetAccountIds, ...ids]),
      );
      await actor.updateMarketingActivity(activity.id, {
        targetAccountIds: updated,
      });
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id],
      });
      toast.success("Account(s) added");
      setNewAccountId("");
      setShowAdd(false);
      onRefetch();
    } catch {
      toast.error("Failed to add accounts");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {activity.targetAccountIds.length} target account
          {activity.targetAccountIds.length !== 1 ? "s" : ""}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="marketing-activity-record.accounts.add_button"
          onClick={() => setShowAdd((v) => !v)}
        >
          <Plus size={13} className="mr-1.5" /> Add Accounts
        </Button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="crm-card p-4 flex items-end gap-3 fade-in"
          data-ocid="marketing-activity-record.accounts.add_panel"
        >
          <div className="flex-1">
            <label
              htmlFor="ma-account-ids"
              className="block text-xs text-muted-foreground mb-1"
            >
              Account IDs{" "}
              <span className="text-muted-foreground/60">
                (comma-separated)
              </span>
            </label>
            <Input
              id="ma-account-ids"
              data-ocid="marketing-activity-record.accounts.new.input"
              value={newAccountId}
              onChange={(e) => setNewAccountId(e.target.value)}
              className="crm-input"
              placeholder="account-id-1, account-id-2"
            />
          </div>
          <Button
            type="submit"
            disabled={saving || !newAccountId.trim()}
            data-ocid="marketing-activity-record.accounts.add.submit_button"
            style={{ background: "#FF6B2B" }}
            className="text-white flex-shrink-0"
          >
            {saving ? "Adding…" : "Add"}
          </Button>
          <Button
            type="button"
            variant="outline"
            data-ocid="marketing-activity-record.accounts.add.cancel_button"
            onClick={() => {
              setShowAdd(false);
              setNewAccountId("");
            }}
          >
            Cancel
          </Button>
        </form>
      )}

      {activity.targetAccountIds.length === 0 ? (
        <div
          className="crm-card flex flex-col items-center py-12"
          data-ocid="marketing-activity-record.accounts.empty_state"
        >
          <Building2 size={32} className="text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No target accounts linked
          </p>
        </div>
      ) : (
        <div className="crm-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account ID
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {activity.targetAccountIds.map((accountId, i) => (
                <tr
                  key={accountId}
                  data-ocid={`marketing-activity-record.accounts.item.${i + 1}`}
                  className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/accounts/$id",
                          params: { id: accountId },
                        })
                      }
                      className="font-mono text-xs text-primary hover:underline"
                      data-ocid={`marketing-activity-record.accounts.link.${i + 1}`}
                    >
                      {accountId}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(accountId)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      data-ocid={`marketing-activity-record.accounts.delete_button.${i + 1}`}
                    >
                      Remove
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

// ─── Custom Fields tab ────────────────────────────────────────────────────────

function CustomFieldsTab({ activityId }: { activityId: string }) {
  const {
    fieldDefs,
    fieldValues,
    pendingChanges,
    setFieldValue,
    saveFieldValues,
    hasPendingChanges,
    isSaving,
    errors,
    isLoading,
  } = useCustomFields(CustomFieldObjectType.marketingActivity, activityId);

  const [editMode, setEditMode] = useState(false);

  const activeDefs = fieldDefs.filter((d) => !d.isArchived);

  async function handleSave() {
    await saveFieldValues();
    toast.success("Custom fields saved");
    setEditMode(false);
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (activeDefs.length === 0) {
    return (
      <div
        className="crm-card flex flex-col items-center py-12"
        data-ocid="marketing-activity-record.custom_fields.empty_state"
      >
        <p className="text-sm text-muted-foreground">
          No custom fields defined for Marketing Activities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="flex justify-end">
        {editMode ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="marketing-activity-record.custom_fields.cancel_button"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              data-ocid="marketing-activity-record.custom_fields.save_button"
              disabled={isSaving || !hasPendingChanges}
              onClick={handleSave}
              style={{ background: "#FF6B2B" }}
              className="text-white"
            >
              <Save size={13} className="mr-1.5" />
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="marketing-activity-record.custom_fields.edit_button"
            onClick={() => setEditMode(true)}
          >
            <Edit2 size={13} className="mr-1.5" /> Edit Custom Fields
          </Button>
        )}
      </div>

      <div className="crm-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {activeDefs.map((def) =>
          editMode ? (
            <CustomFieldEditor
              key={def.id}
              fieldDef={def}
              value={pendingChanges[def.id] ?? fieldValues[def.id]?.value ?? ""}
              onChange={(v) => setFieldValue(def.id, v)}
              error={errors[def.id]}
            />
          ) : (
            <CustomFieldRenderer
              key={def.id}
              fieldDef={def}
              value={fieldValues[def.id]}
            />
          ),
        )}
      </div>
    </div>
  );
}

// ─── ROI Tracking tab ─────────────────────────────────────────────────────────

function RoiTrackingTab({
  activity,
  onRefetch,
}: {
  activity: MarketingActivity;
  onRefetch: () => void;
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);
  const [roiValue, setRoiValue] = useState(
    activity.roi !== undefined && activity.roi !== null
      ? String(Number(activity.roi))
      : "",
  );
  const [saving, setSaving] = useState(false);

  async function handleSaveRoi(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    const parsed = Number.parseInt(roiValue, 10);
    if (Number.isNaN(parsed)) {
      toast.error("ROI must be a valid number");
      return;
    }
    setSaving(true);
    try {
      await actor.recordMarketingActivityRoi(activity.id, BigInt(parsed));
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id],
      });
      toast.success("ROI recorded");
      setShowEdit(false);
      onRefetch();
    } catch {
      toast.error("Failed to record ROI");
    } finally {
      setSaving(false);
    }
  }

  const hasRoi = activity.roi !== undefined && activity.roi !== null;

  return (
    <div className="space-y-5 fade-in">
      {/* Current ROI */}
      <div className="crm-card p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Current ROI
          </p>
          {hasRoi ? (
            <div className="flex items-end gap-2">
              <span
                className="text-4xl font-bold font-display"
                style={{ color: "#4ade80" }}
              >
                {Number(activity.roi)}%
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                return on investment
              </span>
            </div>
          ) : (
            <p className="text-lg text-muted-foreground italic">
              No ROI recorded yet
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          data-ocid="marketing-activity-record.roi.edit_button"
          onClick={() => setShowEdit((v) => !v)}
        >
          <Edit2 size={13} className="mr-1.5" />
          {hasRoi ? "Update ROI" : "Record ROI"}
        </Button>
      </div>

      {/* Edit ROI form */}
      {showEdit && (
        <form
          onSubmit={handleSaveRoi}
          className="crm-card p-5 space-y-4 fade-in"
          data-ocid="marketing-activity-record.roi.edit_panel"
        >
          <p className="text-sm font-semibold text-foreground">Record ROI</p>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="roi-val"
              >
                ROI Percentage (%)
              </label>
              <Input
                id="roi-val"
                type="number"
                required
                data-ocid="marketing-activity-record.roi.input"
                value={roiValue}
                onChange={(e) => setRoiValue(e.target.value)}
                className="crm-input"
                placeholder="e.g. 145"
              />
            </div>
            <Button
              type="submit"
              disabled={saving}
              data-ocid="marketing-activity-record.roi.submit_button"
              style={{ background: "#FF6B2B" }}
              className="text-white flex-shrink-0"
            >
              {saving ? "Saving…" : "Save ROI"}
            </Button>
            <Button
              type="button"
              variant="outline"
              data-ocid="marketing-activity-record.roi.cancel_button"
              onClick={() => setShowEdit(false)}
            >
              Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the ROI as a percentage. For example, a budget of $10,000 that
            generated $14,500 in pipeline would be recorded as 145.
          </p>
        </form>
      )}

      {/* Budget for reference */}
      <div className="crm-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Budget
          </span>
          <span
            className="font-mono font-semibold"
            style={{ color: "#FF6B2B" }}
          >
            {formatCurrency(Number(activity.budget) / 100, activity.currency)}
          </span>
        </div>
        {hasRoi && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Estimated Return
            </span>
            <span className="font-mono font-semibold text-green-400">
              {formatCurrency(
                (Number(activity.budget) / 100) * (Number(activity.roi) / 100),
                activity.currency,
              )}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Activity Status
          </span>
          <StatusBadge status={activity.status} />
        </div>
      </div>
    </div>
  );
}

// ─── Status quick-change dropdown ─────────────────────────────────────────────

function StatusQuickChange({
  activity,
  onRefetch,
}: {
  activity: MarketingActivity;
  onRefetch: () => void;
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  async function handleChange(status: MarketingActivityStatus) {
    if (!actor) return;
    try {
      await actor.updateMarketingActivity(activity.id, { status });
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id],
      });
      toast.success(`Status updated to ${STATUS_LABELS[status]}`);
      setOpen(false);
      onRefetch();
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs border border-border rounded-[0.5rem] px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
        data-ocid="marketing-activity-record.status.toggle"
      >
        Update Status{" "}
        <ChevronDown size={12} className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 crm-card min-w-[160px] z-20 py-1 shadow-lg fade-in"
          data-ocid="marketing-activity-record.status.dropdown_menu"
        >
          {Object.values(MarketingActivityStatus).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleChange(s)}
              className={`w-full px-4 py-2 text-xs text-left hover:bg-secondary/40 transition-colors ${
                s === activity.status
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main record page ─────────────────────────────────────────────────────────

export function MarketingActivityRecord() {
  const { id } = useParams({ from: "/marketing-activities/$id" });
  const navigate = useNavigate();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const {
    data: activity,
    isLoading,
    refetch,
  } = useQuery<MarketingActivity | null>({
    queryKey: ["marketingActivity", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketingActivity(id);
    },
    enabled: !!actor && !!id,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  function handleRefetch() {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
  }

  if (isLoading) {
    return (
      <div className="space-y-5 fade-in p-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div
        className="flex flex-col items-center py-20"
        data-ocid="marketing-activity-record.error_state"
      >
        <p className="text-muted-foreground text-sm">Activity not found.</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: "/marketing-activities" })}
        >
          Back to Marketing Activities
        </Button>
      </div>
    );
  }

  return (
    <div
      className="space-y-5 fade-in"
      data-ocid="marketing-activity-record.page"
    >
      {/* Breadcrumb */}
      <nav className="workspace-breadcrumb" aria-label="breadcrumb">
        <button
          type="button"
          onClick={() => navigate({ to: "/marketing-activities" })}
          className="workspace-breadcrumb-link flex items-center gap-1"
          data-ocid="marketing-activity-record.breadcrumb.back_link"
        >
          <ArrowLeft size={13} /> Marketing Activities
        </button>
        <span>/</span>
        <span className="text-foreground truncate max-w-[260px]">
          {activity.activityName}
        </span>
      </nav>

      {/* Header card */}
      <div className="crm-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg"
              style={{ background: "rgba(255,107,43,0.15)", color: "#FF6B2B" }}
            >
              {activity.activityName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-foreground font-display truncate">
                {activity.activityName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <TypeBadge type={activity.activityType} />
                <StatusBadge status={activity.status} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar size={11} />
                  {formatDate(activity.startDate)} –{" "}
                  {formatDate(activity.endDate)}
                </span>
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: "#FF6B2B" }}
                >
                  <DollarSign size={11} className="inline" />
                  {formatCurrency(
                    Number(activity.budget) / 100,
                    activity.currency,
                  )}
                </span>
              </div>
            </div>
          </div>
          <StatusQuickChange activity={activity} onRefetch={handleRefetch} />
        </div>
      </div>

      {/* Tab nav */}
      <div
        className="flex flex-wrap gap-1 p-1 bg-card border border-border rounded-[0.5rem]"
        role="tablist"
        data-ocid="marketing-activity-record.tab"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[0.375rem] transition-colors duration-150 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              data-ocid={`marketing-activity-record.${tab.id}.tab`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="min-h-[300px]">
        {activeTab === "overview" && (
          <OverviewTab activity={activity} onRefetch={handleRefetch} />
        )}
        {activeTab === "target-accounts" && (
          <TargetAccountsTab activity={activity} onRefetch={handleRefetch} />
        )}
        {activeTab === "custom-fields" && (
          <CustomFieldsTab activityId={activity.id} />
        )}
        {activeTab === "roi-tracking" && (
          <RoiTrackingTab activity={activity} onRefetch={handleRefetch} />
        )}
      </div>
    </div>
  );
}
