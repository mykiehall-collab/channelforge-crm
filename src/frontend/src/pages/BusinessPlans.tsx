import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import {
  ActivityStatus as ActivityStatusEnum,
  type BusinessPlan,
  type BusinessPlanInput,
  PlanType,
} from "../backend";
import type { ActivityStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { formatCurrency, formatDate } from "../utils/channelforge";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function planPeriodLabel(plan: BusinessPlan): string {
  if (plan.planType === PlanType.Quarterly) {
    return `Q${plan.quarter ?? 1} ${plan.year}`;
  }
  if (plan.planType === PlanType.Monthly) {
    const m = Number(plan.month ?? 1) - 1;
    return `${MONTHS[m] ?? ""} ${plan.year}`;
  }
  return `Annual ${plan.year}`;
}

function activityStatusClass(status: ActivityStatus): string {
  switch (status) {
    case ActivityStatusEnum.Completed:
      return "status-badge bg-green-500 bg-opacity-20 text-green-300";
    case ActivityStatusEnum.InProgress:
      return "status-badge bg-yellow-500 bg-opacity-20 text-yellow-300";
    case ActivityStatusEnum.Overdue:
      return "status-badge bg-red-500 bg-opacity-20 text-red-300";
    default:
      return "status-badge status-draft";
  }
}

function dueDateClass(dueDateNs: bigint): string {
  const due = new Date(Number(dueDateNs) / 1_000_000);
  const diffDays = (due.getTime() - Date.now()) / 86_400_000;
  if (diffDays < 0) return "text-red-400";
  if (diffDays <= 7) return "text-yellow-400";
  return "text-green-400";
}

function completedCount(plan: BusinessPlan): number {
  return plan.activities.filter(
    (a) => a.status === ActivityStatusEnum.Completed,
  ).length;
}

function overdueCount(plan: BusinessPlan): number {
  return plan.activities.filter((a) => a.status === ActivityStatusEnum.Overdue)
    .length;
}

// ─── Add Activity Inline Form ────────────────────────────────────────────────

interface AddActivityFormProps {
  planId: string;
  onDone: () => void;
}

function AddActivityForm({ planId, onDone }: AddActivityFormProps) {
  const { actor } = useActor();
  const { businessPlans, refreshBusinessPlans } = useApp();
  const [desc, setDesc] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const plan = businessPlans.find((p) => p.id === planId);

  async function handleSave() {
    if (!actor || !plan || !desc.trim() || !owner.trim() || !dueDate) {
      toast.error("Please fill in all activity fields.");
      return;
    }
    setSaving(true);
    try {
      const dueDateNs = BigInt(new Date(dueDate).getTime()) * BigInt(1_000_000);
      const newActivity = {
        id: `act-${Date.now()}`,
        description: desc.trim(),
        owner: owner.trim(),
        dueDate: dueDateNs,
        status: ActivityStatusEnum.Pending,
        notes: "",
      };
      const input: BusinessPlanInput = {
        partnerId: plan.partnerId,
        vendorOwnerId: plan.vendorOwnerId,
        planType: plan.planType,
        quarter: plan.quarter,
        month: plan.month,
        year: plan.year,
        objective: plan.objective,
        revenueTarget: plan.revenueTarget,
        pipelineTarget: plan.pipelineTarget,
        activities: [...plan.activities, newActivity],
      };
      const result = await actor.updateBusinessPlan(planId, input);
      if (result.__kind__ === "ok") {
        await refreshBusinessPlans();
        toast.success("Activity added.");
        onDone();
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to add activity.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3 p-3 rounded-lg border border-dashed border-border bg-background/50 space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        New Activity
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input
          data-ocid="biz_plan.activity.description_input"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="crm-input text-sm h-8"
        />
        <Input
          data-ocid="biz_plan.activity.owner_input"
          placeholder="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="crm-input text-sm h-8"
        />
        <Input
          data-ocid="biz_plan.activity.due_date_input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="crm-input text-sm h-8"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDone}
          data-ocid="biz_plan.activity.cancel_button"
          className="text-muted-foreground"
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={saving}
          onClick={handleSave}
          data-ocid="biz_plan.activity.save_button"
          style={{ background: "#FF6B2B" }}
          className="text-white"
        >
          {saving ? "Saving…" : "Add"}
        </Button>
      </div>
    </div>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────

interface ActivityRowProps {
  activity: BusinessPlan["activities"][number];
  planId: string;
  index: number;
  canEdit: boolean;
  onUpdated: () => void;
}

function ActivityRow({
  activity,
  planId,
  index,
  canEdit,
  onUpdated,
}: ActivityRowProps) {
  const { actor } = useActor();
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(status: string) {
    if (!actor) return;
    setUpdating(true);
    try {
      const result = await actor.updateBusinessPlanActivity(
        planId,
        activity.id,
        status as ActivityStatus,
      );
      if (result.__kind__ === "ok") {
        onUpdated();
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <tr
      className="border-b border-border last:border-0 hover:bg-card/50 transition-colors"
      data-ocid={`biz_plan.activity.item.${index}`}
    >
      <td className="py-2.5 px-3 text-sm text-foreground">
        {activity.description}
      </td>
      <td className="py-2.5 px-3 text-sm text-muted-foreground">
        {activity.owner}
      </td>
      <td
        className={`py-2.5 px-3 text-sm font-medium ${dueDateClass(activity.dueDate)}`}
      >
        {formatDate(activity.dueDate)}
      </td>
      <td className="py-2.5 px-3">
        {canEdit ? (
          <Select
            value={activity.status}
            onValueChange={handleStatusChange}
            disabled={updating}
          >
            <SelectTrigger
              data-ocid={`biz_plan.activity.status_select.${index}`}
              className="h-7 text-xs w-32 crm-input"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ActivityStatusEnum).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className={activityStatusClass(activity.status)}>
            {activity.status}
          </span>
        )}
      </td>
    </tr>
  );
}

// ─── Plan Detail Panel ────────────────────────────────────────────────────────

interface PlanDetailProps {
  plan: BusinessPlan;
  canEdit: boolean;
  onEdit: () => void;
  onUpdated: () => void;
}

function PlanDetail({ plan, canEdit, onEdit, onUpdated }: PlanDetailProps) {
  const [addingActivity, setAddingActivity] = useState(false);

  return (
    <div className="px-4 pb-4 pt-2 space-y-4 slide-in-left">
      {/* Targets row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-background/60 rounded-lg px-3 py-2 border border-border">
          <p className="text-xs text-muted-foreground">Revenue Target</p>
          <p className="text-sm font-bold text-foreground mt-0.5">
            {formatCurrency(plan.revenueTarget)}
          </p>
        </div>
        <div className="bg-background/60 rounded-lg px-3 py-2 border border-border">
          <p className="text-xs text-muted-foreground">Pipeline Target</p>
          <p className="text-sm font-bold text-foreground mt-0.5">
            {formatCurrency(plan.pipelineTarget)}
          </p>
        </div>
        <div className="bg-background/60 rounded-lg px-3 py-2 border border-border">
          <p className="text-xs text-muted-foreground">Activities</p>
          <p className="text-sm font-bold text-foreground mt-0.5">
            {completedCount(plan)}/{plan.activities.length} done
          </p>
        </div>
        <div className="bg-background/60 rounded-lg px-3 py-2 border border-border">
          <p className="text-xs text-muted-foreground">Overdue</p>
          <p
            className={`text-sm font-bold mt-0.5 ${overdueCount(plan) > 0 ? "text-red-400" : "text-green-400"}`}
          >
            {overdueCount(plan)}
          </p>
        </div>
      </div>

      {/* Objective */}
      {plan.objective && (
        <div>
          <p className="text-xs text-muted-foreground mb-1">Objective</p>
          <p className="text-sm text-foreground">{plan.objective}</p>
        </div>
      )}

      {/* Activities table */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Activities
          </p>
          {canEdit && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setAddingActivity(true)}
              data-ocid="biz_plan.add_activity_button"
              className="h-6 text-xs text-accent hover:text-accent"
            >
              <Plus size={12} className="mr-1" /> Add Activity
            </Button>
          )}
        </div>

        {plan.activities.length === 0 && !addingActivity ? (
          <p
            className="text-xs text-muted-foreground py-3"
            data-ocid="biz_plan.activities.empty_state"
          >
            No activities yet. Add one to track progress.
          </p>
        ) : (
          <div className="crm-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Description", "Owner", "Due Date", "Status"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plan.activities.map((act, i) => (
                  <ActivityRow
                    key={act.id}
                    activity={act}
                    planId={plan.id}
                    index={i + 1}
                    canEdit={canEdit}
                    onUpdated={onUpdated}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {addingActivity && (
          <AddActivityForm
            planId={plan.id}
            onDone={() => setAddingActivity(false)}
          />
        )}
      </div>

      {canEdit && (
        <div className="flex justify-end pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEdit}
            data-ocid="biz_plan.edit_plan_button"
            className="text-xs"
          >
            Edit Plan
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

interface PlanCardProps {
  plan: BusinessPlan;
  index: number;
  canEdit: boolean;
  onEdit: (plan: BusinessPlan) => void;
  onUpdated: () => void;
}

function PlanCard({ plan, index, canEdit, onEdit, onUpdated }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const done = completedCount(plan);
  const total = plan.activities.length;
  const overdue = overdueCount(plan);
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className="crm-card overflow-hidden transition-all"
      data-ocid={`biz_plan.plan.item.${index}`}
    >
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-card/70 transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`biz_plan.plan.toggle.${index}`}
        aria-expanded={expanded}
      >
        <span className="text-muted-foreground shrink-0">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>

        <span
          className={`status-badge text-xs shrink-0 ${
            plan.planType === PlanType.Quarterly
              ? "bg-blue-500 bg-opacity-20 text-blue-300"
              : plan.planType === PlanType.Annual
                ? "bg-purple-500 bg-opacity-20 text-purple-300"
                : "status-draft"
          }`}
        >
          {plan.planType}
        </span>

        <span className="text-sm font-semibold text-foreground min-w-[80px] shrink-0">
          {planPeriodLabel(plan)}
        </span>

        <span className="text-sm text-muted-foreground flex-1 truncate min-w-0 hidden sm:block">
          {plan.objective || "No objective set"}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          {overdue > 0 && (
            <Badge className="bg-red-500 bg-opacity-20 text-red-300 border-0 text-xs">
              {overdue} overdue
            </Badge>
          )}
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {done}/{total}
          </span>
          <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "#FF6B2B" }}
            />
          </div>
        </div>
      </button>

      {expanded && (
        <PlanDetail
          plan={plan}
          canEdit={canEdit}
          onEdit={() => onEdit(plan)}
          onUpdated={onUpdated}
        />
      )}
    </div>
  );
}

// ─── Partner Group (vendor view) ─────────────────────────────────────────────

interface PartnerGroupProps {
  partnerId: string;
  plans: BusinessPlan[];
  partnerName: string;
  canEdit: boolean;
  onEdit: (plan: BusinessPlan) => void;
  onUpdated: () => void;
  groupIndex: number;
}

function PartnerGroup({
  plans,
  partnerName,
  canEdit,
  onEdit,
  onUpdated,
  groupIndex,
}: PartnerGroupProps) {
  const [collapsed, setCollapsed] = useState(false);
  const activePlans = plans.filter((p) =>
    p.activities.some((a) => a.status !== ActivityStatusEnum.Completed),
  ).length;
  const totalOverdue = plans.reduce((sum, p) => sum + overdueCount(p), 0);
  const totalRevTarget = plans.reduce((sum, p) => sum + p.revenueTarget, 0);

  return (
    <div
      className="space-y-2"
      data-ocid={`biz_plan.partner_group.item.${groupIndex}`}
    >
      <button
        type="button"
        className="flex items-center gap-3 w-full group"
        onClick={() => setCollapsed((v) => !v)}
        data-ocid={`biz_plan.partner_group.toggle.${groupIndex}`}
      >
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        </span>
        <h2 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
          {partnerName}
        </h2>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-muted-foreground">
            {plans.length} plans
          </span>
          {activePlans > 0 && (
            <Badge className="bg-blue-500 bg-opacity-20 text-blue-300 border-0 text-xs">
              {activePlans} active
            </Badge>
          )}
          {totalOverdue > 0 && (
            <Badge className="bg-red-500 bg-opacity-20 text-red-300 border-0 text-xs">
              {totalOverdue} overdue
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            Rev target: {formatCurrency(totalRevTarget)}
          </span>
        </div>
      </button>

      {!collapsed && (
        <div className="pl-4 space-y-2">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={i + 1}
              canEdit={canEdit}
              onEdit={onEdit}
              onUpdated={onUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Create/Edit Modal ───────────────────────────────────────────────────────

interface PlanModalProps {
  open: boolean;
  onClose: () => void;
  editPlan?: BusinessPlan | null;
  partnerOptions: Array<{ id: string; name: string }>;
  onSaved: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

function PlanModal({
  open,
  onClose,
  editPlan,
  partnerOptions,
  onSaved,
}: PlanModalProps) {
  const { actor } = useActor();
  const [planType, setPlanType] = useState<string>(
    editPlan?.planType ?? PlanType.Quarterly,
  );
  const [partnerId, setPartnerId] = useState(editPlan?.partnerId ?? "");
  const [vendorOwner, setVendorOwner] = useState(editPlan?.vendorOwnerId ?? "");
  const [quarter, setQuarter] = useState(String(editPlan?.quarter ?? 1));
  const [month, setMonth] = useState(String(editPlan?.month ?? 1));
  const [year, setYear] = useState(String(editPlan?.year ?? CURRENT_YEAR));
  const [objective, setObjective] = useState(editPlan?.objective ?? "");
  const [revenueTarget, setRevenueTarget] = useState(
    String(editPlan?.revenueTarget ?? ""),
  );
  const [pipelineTarget, setPipelineTarget] = useState(
    String(editPlan?.pipelineTarget ?? ""),
  );
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (open) {
      setPlanType(editPlan?.planType ?? PlanType.Quarterly);
      setPartnerId(editPlan?.partnerId ?? "");
      setVendorOwner(editPlan?.vendorOwnerId ?? "");
      setQuarter(String(editPlan?.quarter ?? 1));
      setMonth(String(editPlan?.month ?? 1));
      setYear(String(editPlan?.year ?? CURRENT_YEAR));
      setObjective(editPlan?.objective ?? "");
      setRevenueTarget(String(editPlan?.revenueTarget ?? ""));
      setPipelineTarget(String(editPlan?.pipelineTarget ?? ""));
    }
  }, [open, editPlan]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !partnerId) {
      toast.error("Please select a partner.");
      return;
    }
    setSaving(true);
    try {
      const input: BusinessPlanInput = {
        partnerId,
        vendorOwnerId: vendorOwner,
        planType: planType as PlanType,
        quarter:
          planType === PlanType.Quarterly ? BigInt(Number(quarter)) : undefined,
        month:
          planType === PlanType.Monthly ? BigInt(Number(month)) : undefined,
        year: BigInt(Number(year)),
        objective,
        revenueTarget: Number(revenueTarget) || 0,
        pipelineTarget: Number(pipelineTarget) || 0,
        activities: editPlan?.activities ?? [],
      };
      const result = editPlan
        ? await actor.updateBusinessPlan(editPlan.id, input)
        : await actor.createBusinessPlan(input);
      if (result.__kind__ === "ok") {
        toast.success(editPlan ? "Plan updated." : "Plan created.");
        onSaved();
        onClose();
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to save plan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-lg"
        data-ocid="biz_plan.modal.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {editPlan ? "Edit Business Plan" : "New Business Plan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Reseller *</Label>
            <Select value={partnerId} onValueChange={setPartnerId}>
              <SelectTrigger
                data-ocid="biz_plan.modal.partner_select"
                className="crm-input h-9"
              >
                <SelectValue placeholder="Select reseller…" />
              </SelectTrigger>
              <SelectContent>
                {partnerOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Vendor Owner
            </Label>
            <Input
              data-ocid="biz_plan.modal.vendor_owner_input"
              placeholder="Vendor owner name"
              value={vendorOwner}
              onChange={(e) => setVendorOwner(e.target.value)}
              className="crm-input h-9"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Plan Type</Label>
              <Select value={planType} onValueChange={setPlanType}>
                <SelectTrigger
                  data-ocid="biz_plan.modal.plan_type_select"
                  className="crm-input h-9"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PlanType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {planType === PlanType.Quarterly && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Quarter</Label>
                <Select value={quarter} onValueChange={setQuarter}>
                  <SelectTrigger
                    data-ocid="biz_plan.modal.quarter_select"
                    className="crm-input h-9"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4"].map((q) => (
                      <SelectItem key={q} value={q}>
                        Q{q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {planType === PlanType.Monthly && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger
                    data-ocid="biz_plan.modal.month_select"
                    className="crm-input h-9"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={m} value={String(i + 1)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Year</Label>
              <Input
                data-ocid="biz_plan.modal.year_input"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="crm-input h-9"
                min="2020"
                max="2035"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Objective</Label>
            <Textarea
              data-ocid="biz_plan.modal.objective_textarea"
              placeholder="Plan objective…"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="crm-input min-h-[72px] text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Revenue Target ($)
              </Label>
              <Input
                data-ocid="biz_plan.modal.revenue_target_input"
                type="number"
                placeholder="0"
                value={revenueTarget}
                onChange={(e) => setRevenueTarget(e.target.value)}
                className="crm-input h-9"
                min="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Pipeline Target ($)
              </Label>
              <Input
                data-ocid="biz_plan.modal.pipeline_target_input"
                type="number"
                placeholder="0"
                value={pipelineTarget}
                onChange={(e) => setPipelineTarget(e.target.value)}
                className="crm-input h-9"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-ocid="biz_plan.modal.cancel_button"
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              data-ocid="biz_plan.modal.submit_button"
              style={{ background: "#FF6B2B" }}
              className="text-white"
            >
              {saving ? "Saving…" : editPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BusinessPlans() {
  const {
    businessPlans,
    loading,
    refreshBusinessPlans,
    isVendor,
    isReseller,
    companyProfile,
    hasPermission,
    userProfile,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<BusinessPlan | null>(null);

  const vendor = isVendor();
  const reseller = isReseller();

  const canCreate =
    hasPermission("edit_business_plans") ||
    userProfile?.role === "VendorAdmin" ||
    userProfile?.role === "ResellerAdmin";

  const partnerOptions = useMemo(() => {
    if (!companyProfile) return [];
    return companyProfile.partnerDomains.map((d, i) => ({
      id: `partner-${i}`,
      name: d,
    }));
  }, [companyProfile]);

  const partnerGroups = useMemo(() => {
    if (!vendor) return null;
    const map = new Map<string, BusinessPlan[]>();
    for (const plan of businessPlans) {
      if (!map.has(plan.partnerId)) map.set(plan.partnerId, []);
      map.get(plan.partnerId)!.push(plan);
    }
    return Array.from(map.entries()).map(([pid, plans]) => ({
      partnerId: pid,
      plans,
    }));
  }, [businessPlans, vendor]);

  const totalOverdue = useMemo(
    () => businessPlans.reduce((sum, p) => sum + overdueCount(p), 0),
    [businessPlans],
  );
  const activePlansCount = useMemo(
    () =>
      businessPlans.filter((p) =>
        p.activities.some((a) => a.status !== ActivityStatusEnum.Completed),
      ).length,
    [businessPlans],
  );

  function openCreate() {
    setEditPlan(null);
    setModalOpen(true);
  }

  function openEdit(plan: BusinessPlan) {
    setEditPlan(plan);
    setModalOpen(true);
  }

  async function handleSaved() {
    await refreshBusinessPlans();
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            Business Plans
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {vendor
              ? "Track quarterly execution across all partners"
              : "Manage your business plans and activities"}
          </p>
        </div>
        {canCreate && (
          <Button
            type="button"
            onClick={openCreate}
            data-ocid="biz_plan.create.primary_button"
            style={{ background: "#FF6B2B" }}
            className="text-white shrink-0"
          >
            <Plus size={15} className="mr-1.5" /> New Plan
          </Button>
        )}
      </div>

      {!loading && businessPlans.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="metric-tile">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ClipboardList size={14} />
              <span className="text-xs">Total Plans</span>
            </div>
            <p className="metric-value text-2xl">{businessPlans.length}</p>
          </div>
          <div className="metric-tile">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target size={14} />
              <span className="text-xs">Active Plans</span>
            </div>
            <p className="metric-value text-2xl">{activePlansCount}</p>
          </div>
          <div className="metric-tile">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp size={14} />
              <span className="text-xs">Revenue Targets</span>
            </div>
            <p className="metric-value text-2xl">
              {formatCurrency(
                businessPlans.reduce((s, p) => s + p.revenueTarget, 0),
              )}
            </p>
          </div>
          <div className="metric-tile">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${totalOverdue > 0 ? "text-red-400" : "text-muted-foreground"}`}
              >
                Overdue Activities
              </span>
            </div>
            <p
              className={`metric-value text-2xl ${totalOverdue > 0 ? "text-red-400" : ""}`}
            >
              {totalOverdue}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3" data-ocid="biz_plan.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : businessPlans.length === 0 ? (
        <div
          className="crm-card flex flex-col items-center py-16 px-6"
          data-ocid="biz_plan.empty_state"
        >
          <ClipboardList size={40} className="text-muted-foreground mb-4" />
          <p className="text-base font-semibold text-foreground mb-1">
            No business plans yet
          </p>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
            Create your first business plan to start tracking partner execution
            and quarterly objectives.
          </p>
          {canCreate && (
            <Button
              type="button"
              onClick={openCreate}
              data-ocid="biz_plan.empty.create_button"
              style={{ background: "#FF6B2B" }}
              className="text-white"
            >
              <Plus size={15} className="mr-1.5" /> Create Business Plan
            </Button>
          )}
        </div>
      ) : vendor && partnerGroups ? (
        <div className="space-y-6">
          {partnerGroups.map((group, gi) => (
            <PartnerGroup
              key={group.partnerId}
              partnerId={group.partnerId}
              plans={group.plans}
              partnerName={group.partnerId}
              canEdit={canCreate}
              onEdit={openEdit}
              onUpdated={handleSaved}
              groupIndex={gi + 1}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {businessPlans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={i + 1}
              canEdit={canCreate}
              onEdit={openEdit}
              onUpdated={handleSaved}
            />
          ))}
        </div>
      )}

      <PlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editPlan={editPlan}
        partnerOptions={
          reseller && companyProfile
            ? [{ id: companyProfile.id, name: companyProfile.companyName }]
            : partnerOptions
        }
        onSaved={handleSaved}
      />
    </div>
  );
}
