import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Calendar,
  DollarSign,
  Plus,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import {
  CustomFieldObjectType,
  MarketingActivityStatus,
  MarketingActivityType,
} from "../backend";
import type { MarketingActivity, MarketingActivityInput } from "../backend.d";
import { CustomFieldEditor } from "../components/CustomFieldEditor";
import { useActor } from "../hooks/useActor";
import { useCustomFields } from "../hooks/useCustomFields";
import { formatCurrency, formatDate } from "../utils/channelforge";

// ─── Badge helpers ────────────────────────────────────────────────────────────

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
    "bg-red-500/15 text-red-300 border-red-500/25",
};

const STATUS_LABELS: Record<string, string> = {
  [MarketingActivityStatus.planned]: "Planned",
  [MarketingActivityStatus.inProgress]: "In Progress",
  [MarketingActivityStatus.completed]: "Completed",
  [MarketingActivityStatus.cancelled]: "Cancelled",
};

function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`status-badge border ${
        TYPE_COLORS[type] ?? "bg-muted/30 text-muted-foreground border-border"
      }`}
    >
      {TYPE_LABELS[type] ?? type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`status-badge border ${
        STATUS_COLORS[status] ??
        "bg-muted/30 text-muted-foreground border-border"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function RoiCell({ roi }: { roi: bigint | undefined }) {
  if (roi === undefined || roi === null) {
    return (
      <span className="text-muted-foreground italic text-xs">Not tracked</span>
    );
  }
  const pct = Number(roi);
  return (
    <span className="text-green-400 font-mono text-sm font-medium">{pct}%</span>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="metric-tile">
      <div className="flex items-center justify-between">
        <span className="metric-label">{label}</span>
        <Icon
          size={16}
          className={accent ? "text-primary" : "text-muted-foreground"}
        />
      </div>
      <span className={`metric-value text-2xl ${accent ? "text-primary" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// ─── New Activity Form (inline via modal) ─────────────────────────────────────

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "JPY", "CNY"];

function NewActivityModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { actor } = useActor();
  const { userProfile } = useApp();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    activityName: "",
    activityType: MarketingActivityType.event as string,
    startDate: "",
    endDate: "",
    budget: "",
    currency: "USD",
    ownerUserId: userProfile?.id ?? "",
    status: MarketingActivityStatus.planned as string,
    resellerId: "",
    distributorId: "",
    targetAccountsRaw: "",
  });
  const [saving, setSaving] = useState(false);
  const [customFieldObjectId] = useState("__new__");

  const {
    fieldDefs,
    pendingChanges,
    setFieldValue,
    errors: cfErrors,
    isLoading: cfLoading,
  } = useCustomFields(
    CustomFieldObjectType.marketingActivity,
    customFieldObjectId,
  );

  const activeDefs = fieldDefs.filter((d) => !d.isArchived);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const startMs = new Date(form.startDate).getTime();
      const endMs = new Date(form.endDate).getTime();
      if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
        toast.error("Invalid date values");
        return;
      }
      const targetIds = form.targetAccountsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const input: MarketingActivityInput = {
        activityName: form.activityName,
        activityType: form.activityType as MarketingActivityType,
        startDate: BigInt(startMs * 1_000_000),
        endDate: BigInt(endMs * 1_000_000),
        budget: BigInt(Math.round(Number.parseFloat(form.budget) * 100) || 0),
        currency: form.currency,
        vendorOwnerId: userProfile?.companyId ?? "",
        targetAccountIds: targetIds,
        associatedPromotionIds: [],
        ...(form.resellerId ? { resellerId: form.resellerId } : {}),
        ...(form.distributorId ? { distributorId: form.distributorId } : {}),
      };
      await actor.createMarketingActivity(input);
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      toast.success("Marketing activity created");
      onCreated();
      onClose();
    } catch {
      toast.error("Failed to create activity");
    } finally {
      setSaving(false);
    }
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      data-ocid="marketing-activities.new_modal"
    >
      <div className="crm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground font-display">
            New Marketing Activity
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="marketing-activities.close_button"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Activity Name */}
            <div className="sm:col-span-2">
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-name"
              >
                Activity Name *
              </label>
              <Input
                id="ma-name"
                required
                data-ocid="marketing-activities.name.input"
                value={form.activityName}
                onChange={(e) => set("activityName", e.target.value)}
                className="crm-input"
                placeholder="Q3 Partner Webinar Series"
              />
            </div>

            {/* Activity Type */}
            <div>
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-type"
              >
                Activity Type *
              </label>
              <select
                id="ma-type"
                required
                data-ocid="marketing-activities.type.select"
                value={form.activityType}
                onChange={(e) => set("activityType", e.target.value)}
                className="crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
              >
                {Object.values(MarketingActivityType).map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-status"
              >
                Status
              </label>
              <select
                id="ma-status"
                data-ocid="marketing-activities.status.select"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
              >
                {Object.values(MarketingActivityStatus).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-start"
              >
                Start Date *
              </label>
              <Input
                id="ma-start"
                type="date"
                required
                data-ocid="marketing-activities.start_date.input"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="crm-input"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-end"
              >
                End Date *
              </label>
              <Input
                id="ma-end"
                type="date"
                required
                data-ocid="marketing-activities.end_date.input"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="crm-input"
              />
            </div>

            {/* Budget */}
            <div>
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-budget"
              >
                Budget *
              </label>
              <Input
                id="ma-budget"
                type="number"
                required
                min="0"
                step="0.01"
                data-ocid="marketing-activities.budget.input"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
                className="crm-input"
                placeholder="10000"
              />
            </div>

            {/* Currency */}
            <div>
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-currency"
              >
                Currency
              </label>
              <select
                id="ma-currency"
                data-ocid="marketing-activities.currency.select"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                className="crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Accounts */}
            <div className="sm:col-span-2">
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-accounts"
              >
                Target Account IDs
                <span className="ml-1 text-muted-foreground/60">
                  (comma-separated)
                </span>
              </label>
              <Input
                id="ma-accounts"
                data-ocid="marketing-activities.target_accounts.input"
                value={form.targetAccountsRaw}
                onChange={(e) => set("targetAccountsRaw", e.target.value)}
                className="crm-input"
                placeholder="account-id-1, account-id-2"
              />
            </div>

            {/* Reseller ID */}
            <div>
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-reseller"
              >
                Reseller
                <span className="ml-1 text-muted-foreground/60">
                  (optional)
                </span>
              </label>
              <Input
                id="ma-reseller"
                data-ocid="marketing-activities.reseller.input"
                value={form.resellerId}
                onChange={(e) => set("resellerId", e.target.value)}
                className="crm-input"
                placeholder="Reseller ID"
              />
            </div>

            {/* Distributor ID */}
            <div>
              <label
                className="block text-xs text-muted-foreground mb-1"
                htmlFor="ma-distributor"
              >
                Distributor
                <span className="ml-1 text-muted-foreground/60">
                  (optional)
                </span>
              </label>
              <Input
                id="ma-distributor"
                data-ocid="marketing-activities.distributor.input"
                value={form.distributorId}
                onChange={(e) => set("distributorId", e.target.value)}
                className="crm-input"
                placeholder="Distributor ID"
              />
            </div>
          </div>

          {/* Custom Fields */}
          {!cfLoading && activeDefs.length > 0 && (
            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Custom Fields
              </p>
              {activeDefs.map((def) => (
                <CustomFieldEditor
                  key={def.id}
                  fieldDef={def}
                  value={pendingChanges[def.id] ?? ""}
                  onChange={(v) => setFieldValue(def.id, v)}
                  error={cfErrors[def.id]}
                />
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="marketing-activities.cancel_button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="marketing-activities.submit_button"
              disabled={saving}
              style={{ background: "#FF6B2B" }}
              className="text-white"
            >
              {saving ? "Creating…" : "Create Activity"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TypeFilter = "all" | MarketingActivityType;
type StatusFilter = "all" | MarketingActivityStatus;

const TYPE_TABS: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: MarketingActivityType.webinar, label: "Webinar" },
  { value: MarketingActivityType.event, label: "Event" },
  { value: MarketingActivityType.emailCampaign, label: "Email Campaign" },
  { value: MarketingActivityType.content, label: "Content" },
  { value: MarketingActivityType.sponsorship, label: "Sponsorship" },
  { value: MarketingActivityType.other, label: "Other" },
];

export function MarketingActivitiesPage() {
  const { actor } = useActor();
  const { userProfile } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showCreate, setShowCreate] = useState(false);

  const {
    data: activities = [],
    isLoading,
    refetch,
  } = useQuery<MarketingActivity[]>({
    queryKey: ["marketingActivities", userProfile?.companyId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMarketingActivitiesForCaller(
        null,
        userProfile?.companyId ?? "",
        userProfile?.role ?? "",
        null,
        null,
      );
    },
    enabled: !!actor && !!userProfile,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const filtered = activities.filter((a) => {
    if (search && !a.activityName.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (typeFilter !== "all" && a.activityType !== typeFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  // Stats
  const totalBudget = activities.reduce(
    (sum, a) => sum + Number(a.budget) / 100,
    0,
  );
  const activeCount = activities.filter(
    (a) => a.status === MarketingActivityStatus.inProgress,
  ).length;
  const completedThisQuarter = activities.filter((a) => {
    if (a.status !== MarketingActivityStatus.completed) return false;
    const ms = Number(a.endDate) / 1_000_000;
    const d = new Date(ms);
    const now = new Date();
    const quarterStart = new Date(
      now.getFullYear(),
      Math.floor(now.getMonth() / 3) * 3,
      1,
    );
    return d >= quarterStart;
  }).length;

  return (
    <div className="space-y-5 fade-in" data-ocid="marketing-activities.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display">
            Marketing Activities
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Campaigns, events, webinars and channel programmes
          </p>
        </div>
        <Button
          type="button"
          data-ocid="marketing-activities.new_activity.primary_button"
          onClick={() => setShowCreate(true)}
          style={{ background: "#FF6B2B" }}
          className="text-white flex-shrink-0"
        >
          <Plus size={14} className="mr-1.5" /> New Activity
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile
          label="Total Activities"
          value={activities.length}
          icon={Activity}
        />
        <StatTile label="Active" value={activeCount} icon={TrendingUp} accent />
        <StatTile
          label="Total Budget"
          value={formatCurrency(totalBudget)}
          icon={DollarSign}
          accent
        />
        <StatTile
          label="Completed This Quarter"
          value={completedThisQuarter}
          icon={Calendar}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Type tabs */}
        <div
          className="flex flex-wrap gap-1 p-1 bg-card border border-border rounded-[0.5rem]"
          data-ocid="marketing-activities.type.tab"
        >
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setTypeFilter(tab.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-[0.375rem] transition-colors duration-150 ${
                typeFilter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              data-ocid="marketing-activities.search_input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activities…"
              className="crm-input pl-9"
            />
          </div>

          <select
            data-ocid="marketing-activities.status.select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {Object.values(MarketingActivityStatus).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          {(search || typeFilter !== "all" || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              data-ocid="marketing-activities.clear_filters.button"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} activit{filtered.length !== 1 ? "ies" : "y"}
        </p>
      )}

      {/* Table */}
      <div className="crm-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-16"
            data-ocid="marketing-activities.empty_state"
          >
            <Activity size={40} className="text-muted-foreground mb-4" />
            <p className="text-base font-semibold text-foreground mb-1">
              {search || typeFilter !== "all" || statusFilter !== "all"
                ? "No activities match your filters"
                : "No marketing activities yet"}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {search || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first marketing activity to get started."}
            </p>
            <Button
              onClick={() => setShowCreate(true)}
              style={{ background: "#FF6B2B" }}
              className="text-white"
              data-ocid="marketing-activities.empty.create_button"
            >
              <Plus size={14} className="mr-1.5" /> New Activity
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Activity Name",
                    "Type",
                    "Status",
                    "Start Date",
                    "End Date",
                    "Budget",
                    "Target Accounts",
                    "ROI",
                    "",
                  ].map((h) => (
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
                {filtered.map((a, i) => (
                  <tr
                    key={a.id}
                    data-ocid={`marketing-activities.item.${i + 1}`}
                    onClick={() =>
                      navigate({
                        to: "/marketing-activities/$id",
                        params: { id: a.id },
                      })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      navigate({
                        to: "/marketing-activities/$id",
                        params: { id: a.id },
                      })
                    }
                    tabIndex={0}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs"
                          style={{
                            background: "rgba(255,107,43,0.15)",
                            color: "#FF6B2B",
                          }}
                        >
                          {a.activityName[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground truncate max-w-[200px]">
                          {a.activityName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <TypeBadge type={a.activityType} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {formatDate(a.startDate)}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">
                      {formatDate(a.endDate)}
                    </td>
                    <td
                      className="px-5 py-3.5 font-mono text-foreground"
                      style={{ color: "#FF6B2B" }}
                    >
                      {formatCurrency(Number(a.budget) / 100, a.currency)}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {a.targetAccountIds.length > 0 ? (
                        <span className="text-foreground font-medium">
                          {a.targetAccountIds.length}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 italic text-xs">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <RoiCell roi={a.roi} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate({
                            to: "/marketing-activities/$id",
                            params: { id: a.id },
                          });
                        }}
                        className="text-xs text-primary hover:underline"
                        data-ocid={`marketing-activities.view.${i + 1}`}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <NewActivityModal
          onClose={() => setShowCreate(false)}
          onCreated={refetch}
        />
      )}
    </div>
  );
}
