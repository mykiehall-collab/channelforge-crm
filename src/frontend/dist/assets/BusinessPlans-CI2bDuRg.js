import { u as useApp, r as reactExports, aD as ActivityStatus, j as jsxRuntimeExports, m as Button, a8 as Plus, y as Target, e as TrendingUp, W as formatCurrency, i as ChevronRight, k as ChevronDown, o as Badge, aE as PlanType, p as useActor, R as React, aF as Label, ad as Input, ab as ue, af as formatDate } from "./index-DvFvlUBj.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CJsIFtIC.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D4bdvzsb.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { C as ClipboardList } from "./clipboard-list-BvyAGRk8.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
import "./index-CNckvLjz.js";
import "./index-B1ifXNtV.js";
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
  "December"
];
function planPeriodLabel(plan) {
  if (plan.planType === PlanType.Quarterly) {
    return `Q${plan.quarter ?? 1} ${plan.year}`;
  }
  if (plan.planType === PlanType.Monthly) {
    const m = Number(plan.month ?? 1) - 1;
    return `${MONTHS[m] ?? ""} ${plan.year}`;
  }
  return `Annual ${plan.year}`;
}
function activityStatusClass(status) {
  switch (status) {
    case ActivityStatus.Completed:
      return "status-badge bg-green-500 bg-opacity-20 text-green-300";
    case ActivityStatus.InProgress:
      return "status-badge bg-yellow-500 bg-opacity-20 text-yellow-300";
    case ActivityStatus.Overdue:
      return "status-badge bg-red-500 bg-opacity-20 text-red-300";
    default:
      return "status-badge status-draft";
  }
}
function dueDateClass(dueDateNs) {
  const due = new Date(Number(dueDateNs) / 1e6);
  const diffDays = (due.getTime() - Date.now()) / 864e5;
  if (diffDays < 0) return "text-red-400";
  if (diffDays <= 7) return "text-yellow-400";
  return "text-green-400";
}
function completedCount(plan) {
  return plan.activities.filter(
    (a) => a.status === ActivityStatus.Completed
  ).length;
}
function overdueCount(plan) {
  return plan.activities.filter((a) => a.status === ActivityStatus.Overdue).length;
}
function AddActivityForm({ planId, onDone }) {
  const { actor } = useActor();
  const { businessPlans, refreshBusinessPlans } = useApp();
  const [desc, setDesc] = reactExports.useState("");
  const [owner, setOwner] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const plan = businessPlans.find((p) => p.id === planId);
  async function handleSave() {
    if (!actor || !plan || !desc.trim() || !owner.trim() || !dueDate) {
      ue.error("Please fill in all activity fields.");
      return;
    }
    setSaving(true);
    try {
      const dueDateNs = BigInt(new Date(dueDate).getTime()) * BigInt(1e6);
      const newActivity = {
        id: `act-${Date.now()}`,
        description: desc.trim(),
        owner: owner.trim(),
        dueDate: dueDateNs,
        status: ActivityStatus.Pending,
        notes: ""
      };
      const input = {
        partnerId: plan.partnerId,
        vendorOwnerId: plan.vendorOwnerId,
        planType: plan.planType,
        quarter: plan.quarter,
        month: plan.month,
        year: plan.year,
        objective: plan.objective,
        revenueTarget: plan.revenueTarget,
        pipelineTarget: plan.pipelineTarget,
        activities: [...plan.activities, newActivity]
      };
      const result = await actor.updateBusinessPlan(planId, input);
      if (result.__kind__ === "ok") {
        await refreshBusinessPlans();
        ue.success("Activity added.");
        onDone();
      } else {
        ue.error(result.err);
      }
    } catch {
      ue.error("Failed to add activity.");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-3 rounded-lg border border-dashed border-border bg-background/50 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "New Activity" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "biz_plan.activity.description_input",
          placeholder: "Description",
          value: desc,
          onChange: (e) => setDesc(e.target.value),
          className: "crm-input text-sm h-8"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "biz_plan.activity.owner_input",
          placeholder: "Owner",
          value: owner,
          onChange: (e) => setOwner(e.target.value),
          className: "crm-input text-sm h-8"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "biz_plan.activity.due_date_input",
          type: "date",
          value: dueDate,
          onChange: (e) => setDueDate(e.target.value),
          className: "crm-input text-sm h-8"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          onClick: onDone,
          "data-ocid": "biz_plan.activity.cancel_button",
          className: "text-muted-foreground",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          disabled: saving,
          onClick: handleSave,
          "data-ocid": "biz_plan.activity.save_button",
          style: { background: "#FF6B2B" },
          className: "text-white",
          children: saving ? "Saving…" : "Add"
        }
      )
    ] })
  ] });
}
function ActivityRow({
  activity,
  planId,
  index,
  canEdit,
  onUpdated
}) {
  const { actor } = useActor();
  const [updating, setUpdating] = reactExports.useState(false);
  async function handleStatusChange(status) {
    if (!actor) return;
    setUpdating(true);
    try {
      const result = await actor.updateBusinessPlanActivity(
        planId,
        activity.id,
        status
      );
      if (result.__kind__ === "ok") {
        onUpdated();
      } else {
        ue.error(result.err);
      }
    } catch {
      ue.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border last:border-0 hover:bg-card/50 transition-colors",
      "data-ocid": `biz_plan.activity.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-sm text-foreground", children: activity.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 text-sm text-muted-foreground", children: activity.owner }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: `py-2.5 px-3 text-sm font-medium ${dueDateClass(activity.dueDate)}`,
            children: formatDate(activity.dueDate)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: canEdit ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: activity.status,
            onValueChange: handleStatusChange,
            disabled: updating,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  "data-ocid": `biz_plan.activity.status_select.${index}`,
                  className: "h-7 text-xs w-32 crm-input",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(ActivityStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: activityStatusClass(activity.status), children: activity.status }) })
      ]
    }
  );
}
function PlanDetail({ plan, canEdit, onEdit, onUpdated }) {
  const [addingActivity, setAddingActivity] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-2 space-y-4 slide-in-left", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/60 rounded-lg px-3 py-2 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Revenue Target" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mt-0.5", children: formatCurrency(plan.revenueTarget) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/60 rounded-lg px-3 py-2 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Pipeline Target" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground mt-0.5", children: formatCurrency(plan.pipelineTarget) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/60 rounded-lg px-3 py-2 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Activities" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-foreground mt-0.5", children: [
          completedCount(plan),
          "/",
          plan.activities.length,
          " done"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/60 rounded-lg px-3 py-2 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Overdue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `text-sm font-bold mt-0.5 ${overdueCount(plan) > 0 ? "text-red-400" : "text-green-400"}`,
            children: overdueCount(plan)
          }
        )
      ] })
    ] }),
    plan.objective && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Objective" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: plan.objective })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Activities" }),
        canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "ghost",
            onClick: () => setAddingActivity(true),
            "data-ocid": "biz_plan.add_activity_button",
            className: "h-6 text-xs text-accent hover:text-accent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12, className: "mr-1" }),
              " Add Activity"
            ]
          }
        )
      ] }),
      plan.activities.length === 0 && !addingActivity ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-muted-foreground py-3",
          "data-ocid": "biz_plan.activities.empty_state",
          children: "No activities yet. Add one to track progress."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["Description", "Owner", "Due Date", "Status"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left py-2 px-3 text-xs font-semibold text-muted-foreground",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: plan.activities.map((act, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ActivityRow,
          {
            activity: act,
            planId: plan.id,
            index: i + 1,
            canEdit,
            onUpdated
          },
          act.id
        )) })
      ] }) }),
      addingActivity && /* @__PURE__ */ jsxRuntimeExports.jsx(
        AddActivityForm,
        {
          planId: plan.id,
          onDone: () => setAddingActivity(false)
        }
      )
    ] }),
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: onEdit,
        "data-ocid": "biz_plan.edit_plan_button",
        className: "text-xs",
        children: "Edit Plan"
      }
    ) })
  ] });
}
function PlanCard({ plan, index, canEdit, onEdit, onUpdated }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const done = completedCount(plan);
  const total = plan.activities.length;
  const overdue = overdueCount(plan);
  const progress = total > 0 ? Math.round(done / total * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card overflow-hidden transition-all",
      "data-ocid": `biz_plan.plan.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-card/70 transition-colors text-left",
            onClick: () => setExpanded((v) => !v),
            "data-ocid": `biz_plan.plan.toggle.${index}`,
            "aria-expanded": expanded,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `status-badge text-xs shrink-0 ${plan.planType === PlanType.Quarterly ? "bg-blue-500 bg-opacity-20 text-blue-300" : plan.planType === PlanType.Annual ? "bg-purple-500 bg-opacity-20 text-purple-300" : "status-draft"}`,
                  children: plan.planType
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground min-w-[80px] shrink-0", children: planPeriodLabel(plan) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground flex-1 truncate min-w-0 hidden sm:block", children: plan.objective || "No objective set" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                overdue > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500 bg-opacity-20 text-red-300 border-0 text-xs", children: [
                  overdue,
                  " overdue"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: [
                  done,
                  "/",
                  total
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 bg-border rounded-full overflow-hidden hidden sm:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full transition-all",
                    style: { width: `${progress}%`, background: "#FF6B2B" }
                  }
                ) })
              ] })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          PlanDetail,
          {
            plan,
            canEdit,
            onEdit: () => onEdit(plan),
            onUpdated
          }
        )
      ]
    }
  );
}
function PartnerGroup({
  plans,
  partnerName,
  canEdit,
  onEdit,
  onUpdated,
  groupIndex
}) {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const activePlans = plans.filter(
    (p) => p.activities.some((a) => a.status !== ActivityStatus.Completed)
  ).length;
  const totalOverdue = plans.reduce((sum, p) => sum + overdueCount(p), 0);
  const totalRevTarget = plans.reduce((sum, p) => sum + p.revenueTarget, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-2",
      "data-ocid": `biz_plan.partner_group.item.${groupIndex}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "flex items-center gap-3 w-full group",
            onClick: () => setCollapsed((v) => !v),
            "data-ocid": `biz_plan.partner_group.toggle.${groupIndex}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground group-hover:text-foreground transition-colors", children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground group-hover:text-accent transition-colors", children: partnerName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  plans.length,
                  " plans"
                ] }),
                activePlans > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500 bg-opacity-20 text-blue-300 border-0 text-xs", children: [
                  activePlans,
                  " active"
                ] }),
                totalOverdue > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500 bg-opacity-20 text-red-300 border-0 text-xs", children: [
                  totalOverdue,
                  " overdue"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "Rev target: ",
                  formatCurrency(totalRevTarget)
                ] })
              ] })
            ]
          }
        ),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-4 space-y-2", children: plans.map((plan, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          PlanCard,
          {
            plan,
            index: i + 1,
            canEdit,
            onEdit,
            onUpdated
          },
          plan.id
        )) })
      ]
    }
  );
}
const CURRENT_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
function PlanModal({
  open,
  onClose,
  editPlan,
  partnerOptions,
  onSaved
}) {
  const { actor } = useActor();
  const [planType, setPlanType] = reactExports.useState(
    (editPlan == null ? void 0 : editPlan.planType) ?? PlanType.Quarterly
  );
  const [partnerId, setPartnerId] = reactExports.useState((editPlan == null ? void 0 : editPlan.partnerId) ?? "");
  const [vendorOwner, setVendorOwner] = reactExports.useState((editPlan == null ? void 0 : editPlan.vendorOwnerId) ?? "");
  const [quarter, setQuarter] = reactExports.useState(String((editPlan == null ? void 0 : editPlan.quarter) ?? 1));
  const [month, setMonth] = reactExports.useState(String((editPlan == null ? void 0 : editPlan.month) ?? 1));
  const [year, setYear] = reactExports.useState(String((editPlan == null ? void 0 : editPlan.year) ?? CURRENT_YEAR));
  const [objective, setObjective] = reactExports.useState((editPlan == null ? void 0 : editPlan.objective) ?? "");
  const [revenueTarget, setRevenueTarget] = reactExports.useState(
    String((editPlan == null ? void 0 : editPlan.revenueTarget) ?? "")
  );
  const [pipelineTarget, setPipelineTarget] = reactExports.useState(
    String((editPlan == null ? void 0 : editPlan.pipelineTarget) ?? "")
  );
  const [saving, setSaving] = reactExports.useState(false);
  React.useEffect(() => {
    if (open) {
      setPlanType((editPlan == null ? void 0 : editPlan.planType) ?? PlanType.Quarterly);
      setPartnerId((editPlan == null ? void 0 : editPlan.partnerId) ?? "");
      setVendorOwner((editPlan == null ? void 0 : editPlan.vendorOwnerId) ?? "");
      setQuarter(String((editPlan == null ? void 0 : editPlan.quarter) ?? 1));
      setMonth(String((editPlan == null ? void 0 : editPlan.month) ?? 1));
      setYear(String((editPlan == null ? void 0 : editPlan.year) ?? CURRENT_YEAR));
      setObjective((editPlan == null ? void 0 : editPlan.objective) ?? "");
      setRevenueTarget(String((editPlan == null ? void 0 : editPlan.revenueTarget) ?? ""));
      setPipelineTarget(String((editPlan == null ? void 0 : editPlan.pipelineTarget) ?? ""));
    }
  }, [open, editPlan]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!actor || !partnerId) {
      ue.error("Please select a partner.");
      return;
    }
    setSaving(true);
    try {
      const input = {
        partnerId,
        vendorOwnerId: vendorOwner,
        planType,
        quarter: planType === PlanType.Quarterly ? BigInt(Number(quarter)) : void 0,
        month: planType === PlanType.Monthly ? BigInt(Number(month)) : void 0,
        year: BigInt(Number(year)),
        objective,
        revenueTarget: Number(revenueTarget) || 0,
        pipelineTarget: Number(pipelineTarget) || 0,
        activities: (editPlan == null ? void 0 : editPlan.activities) ?? []
      };
      const result = editPlan ? await actor.updateBusinessPlan(editPlan.id, input) : await actor.createBusinessPlan(input);
      if (result.__kind__ === "ok") {
        ue.success(editPlan ? "Plan updated." : "Plan created.");
        onSaved();
        onClose();
      } else {
        ue.error(result.err);
      }
    } catch {
      ue.error("Failed to save plan.");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-lg",
      "data-ocid": "biz_plan.modal.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: editPlan ? "Edit Business Plan" : "New Business Plan" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Reseller *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: partnerId, onValueChange: setPartnerId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  "data-ocid": "biz_plan.modal.partner_select",
                  className: "crm-input h-9",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select reseller…" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: partnerOptions.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Vendor Owner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "biz_plan.modal.vendor_owner_input",
                placeholder: "Vendor owner name",
                value: vendorOwner,
                onChange: (e) => setVendorOwner(e.target.value),
                className: "crm-input h-9"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Plan Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: planType, onValueChange: setPlanType, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "biz_plan.modal.plan_type_select",
                    className: "crm-input h-9",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(PlanType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
              ] })
            ] }),
            planType === PlanType.Quarterly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Quarter" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: quarter, onValueChange: setQuarter, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "biz_plan.modal.quarter_select",
                    className: "crm-input h-9",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["1", "2", "3", "4"].map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: q, children: [
                  "Q",
                  q
                ] }, q)) })
              ] })
            ] }),
            planType === PlanType.Monthly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Month" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: month, onValueChange: setMonth, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "biz_plan.modal.month_select",
                    className: "crm-input h-9",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MONTHS.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(i + 1), children: m }, m)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Year" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "biz_plan.modal.year_input",
                  type: "number",
                  value: year,
                  onChange: (e) => setYear(e.target.value),
                  className: "crm-input h-9",
                  min: "2020",
                  max: "2035"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Objective" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                "data-ocid": "biz_plan.modal.objective_textarea",
                placeholder: "Plan objective…",
                value: objective,
                onChange: (e) => setObjective(e.target.value),
                className: "crm-input min-h-[72px] text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Revenue Target ($)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "biz_plan.modal.revenue_target_input",
                  type: "number",
                  placeholder: "0",
                  value: revenueTarget,
                  onChange: (e) => setRevenueTarget(e.target.value),
                  className: "crm-input h-9",
                  min: "0"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Pipeline Target ($)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "biz_plan.modal.pipeline_target_input",
                  type: "number",
                  placeholder: "0",
                  value: pipelineTarget,
                  onChange: (e) => setPipelineTarget(e.target.value),
                  className: "crm-input h-9",
                  min: "0"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: onClose,
                "data-ocid": "biz_plan.modal.cancel_button",
                className: "text-muted-foreground",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: saving,
                "data-ocid": "biz_plan.modal.submit_button",
                style: { background: "#FF6B2B" },
                className: "text-white",
                children: saving ? "Saving…" : editPlan ? "Update Plan" : "Create Plan"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function BusinessPlans() {
  const {
    businessPlans,
    loading,
    refreshBusinessPlans,
    isVendor,
    isReseller,
    companyProfile,
    hasPermission,
    userProfile
  } = useApp();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editPlan, setEditPlan] = reactExports.useState(null);
  const vendor = isVendor();
  const reseller = isReseller();
  const canCreate = hasPermission("edit_business_plans") || (userProfile == null ? void 0 : userProfile.role) === "VendorAdmin" || (userProfile == null ? void 0 : userProfile.role) === "ResellerAdmin";
  const partnerOptions = reactExports.useMemo(() => {
    if (!companyProfile) return [];
    return companyProfile.partnerDomains.map((d, i) => ({
      id: `partner-${i}`,
      name: d
    }));
  }, [companyProfile]);
  const partnerGroups = reactExports.useMemo(() => {
    if (!vendor) return null;
    const map = /* @__PURE__ */ new Map();
    for (const plan of businessPlans) {
      if (!map.has(plan.partnerId)) map.set(plan.partnerId, []);
      map.get(plan.partnerId).push(plan);
    }
    return Array.from(map.entries()).map(([pid, plans]) => ({
      partnerId: pid,
      plans
    }));
  }, [businessPlans, vendor]);
  const totalOverdue = reactExports.useMemo(
    () => businessPlans.reduce((sum, p) => sum + overdueCount(p), 0),
    [businessPlans]
  );
  const activePlansCount = reactExports.useMemo(
    () => businessPlans.filter(
      (p) => p.activities.some((a) => a.status !== ActivityStatus.Completed)
    ).length,
    [businessPlans]
  );
  function openCreate() {
    setEditPlan(null);
    setModalOpen(true);
  }
  function openEdit(plan) {
    setEditPlan(plan);
    setModalOpen(true);
  }
  async function handleSaved() {
    await refreshBusinessPlans();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: "Business Plans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: vendor ? "Track quarterly execution across all partners" : "Manage your business plans and activities" })
      ] }),
      canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: openCreate,
          "data-ocid": "biz_plan.create.primary_button",
          style: { background: "#FF6B2B" },
          className: "text-white shrink-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15, className: "mr-1.5" }),
            " New Plan"
          ]
        }
      )
    ] }),
    !loading && businessPlans.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-tile", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Total Plans" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "metric-value text-2xl", children: businessPlans.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-tile", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Active Plans" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "metric-value text-2xl", children: activePlansCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-tile", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Revenue Targets" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "metric-value text-2xl", children: formatCurrency(
          businessPlans.reduce((s, p) => s + p.revenueTarget, 0)
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-tile", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs ${totalOverdue > 0 ? "text-red-400" : "text-muted-foreground"}`,
            children: "Overdue Activities"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `metric-value text-2xl ${totalOverdue > 0 ? "text-red-400" : ""}`,
            children: totalOverdue
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "biz_plan.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, i)) }) : businessPlans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card flex flex-col items-center py-16 px-6",
        "data-ocid": "biz_plan.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 40, className: "text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "No business plans yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6 text-center max-w-sm", children: "Create your first business plan to start tracking partner execution and quarterly objectives." }),
          canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: openCreate,
              "data-ocid": "biz_plan.empty.create_button",
              style: { background: "#FF6B2B" },
              className: "text-white",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15, className: "mr-1.5" }),
                " Create Business Plan"
              ]
            }
          )
        ]
      }
    ) : vendor && partnerGroups ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: partnerGroups.map((group, gi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PartnerGroup,
      {
        partnerId: group.partnerId,
        plans: group.plans,
        partnerName: group.partnerId,
        canEdit: canCreate,
        onEdit: openEdit,
        onUpdated: handleSaved,
        groupIndex: gi + 1
      },
      group.partnerId
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: businessPlans.map((plan, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlanCard,
      {
        plan,
        index: i + 1,
        canEdit: canCreate,
        onEdit: openEdit,
        onUpdated: handleSaved
      },
      plan.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlanModal,
      {
        open: modalOpen,
        onClose: () => setModalOpen(false),
        editPlan,
        partnerOptions: reseller && companyProfile ? [{ id: companyProfile.id, name: companyProfile.companyName }] : partnerOptions,
        onSaved: handleSaved
      }
    )
  ] });
}
export {
  BusinessPlans
};
