import { bx as useParams, a as useNavigate, p as useActor, aY as useQueryClient, r as reactExports, aZ as useQuery, j as jsxRuntimeExports, m as Button, ai as ArrowLeft, af as formatDate, z as DollarSign, W as formatCurrency, y as Target, B as Building2, e as TrendingUp, k as ChevronDown, bT as MarketingActivityStatus, ad as Input, bU as MarketingActivityType, ar as Save, a8 as Plus, ah as CustomFieldObjectType, ab as ue } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { u as useCustomFields, C as CustomFieldEditor } from "./useCustomFields-Do4Q3M8P.js";
import { C as CustomFieldRenderer } from "./CustomFieldRenderer-DSYXzkdv.js";
import { C as Calendar } from "./calendar-BzO3LGDM.js";
import { P as Pen } from "./pen-CQ3Xm2Uu.js";
import "./checkbox-Cr6u9Lap.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
import "./textarea-BHUaDciu.js";
import "./useMutation-D0Tr8pyU.js";
import "./download-DVLbZ_Ir.js";
import "./phone-DSozTLzi.js";
import "./mail-BpQyu_iW.js";
const TYPE_COLORS = {
  [MarketingActivityType.webinar]: "bg-purple-500/15 text-purple-300 border-purple-500/25",
  [MarketingActivityType.event]: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  [MarketingActivityType.emailCampaign]: "bg-green-500/15 text-green-300 border-green-500/25",
  [MarketingActivityType.content]: "bg-teal-500/15 text-teal-300 border-teal-500/25",
  [MarketingActivityType.sponsorship]: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  [MarketingActivityType.other]: "bg-muted/40 text-muted-foreground border-border"
};
const TYPE_LABELS = {
  [MarketingActivityType.webinar]: "Webinar",
  [MarketingActivityType.event]: "Event",
  [MarketingActivityType.emailCampaign]: "Email Campaign",
  [MarketingActivityType.content]: "Content",
  [MarketingActivityType.sponsorship]: "Sponsorship",
  [MarketingActivityType.other]: "Other"
};
const STATUS_COLORS = {
  [MarketingActivityStatus.planned]: "bg-muted/40 text-muted-foreground border-border",
  [MarketingActivityStatus.inProgress]: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  [MarketingActivityStatus.completed]: "bg-green-500/15 text-green-300 border-green-500/25",
  [MarketingActivityStatus.cancelled]: "bg-[oklch(0.22_0.03_250)]/60 text-[oklch(0.55_0.02_250)] border border-[oklch(0.28_0.03_250)]"
};
const STATUS_LABELS = {
  [MarketingActivityStatus.planned]: "Planned",
  [MarketingActivityStatus.inProgress]: "In Progress",
  [MarketingActivityStatus.completed]: "Completed",
  [MarketingActivityStatus.cancelled]: "Cancelled"
};
const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "JPY", "CNY"];
function TypeBadge({ type }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `status-badge border ${TYPE_COLORS[type] ?? "bg-muted/30 text-muted-foreground border-border"}`,
      children: TYPE_LABELS[type] ?? type
    }
  );
}
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `status-badge border ${STATUS_COLORS[status] ?? "bg-muted/30 text-muted-foreground border-border"}`,
      children: STATUS_LABELS[status] ?? status
    }
  );
}
const TABS = [
  { id: "overview", label: "Overview", icon: Target },
  { id: "target-accounts", label: "Target Accounts", icon: Building2 },
  { id: "custom-fields", label: "Custom Fields", icon: Pen },
  { id: "roi-tracking", label: "ROI Tracking", icon: TrendingUp }
];
function OverviewField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children })
  ] });
}
function OverviewTab({
  activity,
  onRefetch
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [editing, setEditing] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    activityName: activity.activityName,
    activityType: activity.activityType,
    status: activity.status,
    startDate: new Date(Number(activity.startDate) / 1e6).toISOString().split("T")[0],
    endDate: new Date(Number(activity.endDate) / 1e6).toISOString().split("T")[0],
    budget: String(Number(activity.budget) / 100),
    currency: activity.currency
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  async function handleSave(e) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const startMs = new Date(form.startDate).getTime();
      const endMs = new Date(form.endDate).getTime();
      const update = {
        activityName: form.activityName,
        activityType: form.activityType,
        status: form.status,
        startDate: BigInt(startMs * 1e6),
        endDate: BigInt(endMs * 1e6),
        budget: BigInt(Math.round(Number.parseFloat(form.budget) * 100) || 0),
        currency: form.currency
      };
      await actor.updateMarketingActivity(activity.id, update);
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id]
      });
      ue.success("Activity updated");
      setEditing(false);
      onRefetch();
    } catch {
      ue.error("Failed to update activity");
    } finally {
      setSaving(false);
    }
  }
  if (editing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-4 fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "ma-name",
              className: "block text-xs text-muted-foreground mb-1",
              children: "Activity Name *"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "ma-name",
              required: true,
              "data-ocid": "marketing-activity-record.edit.name.input",
              value: form.activityName,
              onChange: (e) => set("activityName", e.target.value),
              className: "crm-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "ma-type",
              className: "block text-xs text-muted-foreground mb-1",
              children: "Type"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "ma-type",
              "data-ocid": "marketing-activity-record.edit.type.select",
              value: form.activityType,
              onChange: (e) => set("activityType", e.target.value),
              className: "crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem]",
              children: Object.values(MarketingActivityType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: TYPE_LABELS[t] }, t))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "ma-status",
              className: "block text-xs text-muted-foreground mb-1",
              children: "Status"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "ma-status",
              "data-ocid": "marketing-activity-record.edit.status.select",
              value: form.status,
              onChange: (e) => set("status", e.target.value),
              className: "crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem]",
              children: Object.values(MarketingActivityStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: STATUS_LABELS[s] }, s))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "ma-start-date",
              className: "block text-xs text-muted-foreground mb-1",
              children: "Start Date"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "ma-start-date",
              type: "date",
              "data-ocid": "marketing-activity-record.edit.start_date.input",
              value: form.startDate,
              onChange: (e) => set("startDate", e.target.value),
              className: "crm-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "ma-end-date",
              className: "block text-xs text-muted-foreground mb-1",
              children: "End Date"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "ma-end-date",
              type: "date",
              "data-ocid": "marketing-activity-record.edit.end_date.input",
              value: form.endDate,
              onChange: (e) => set("endDate", e.target.value),
              className: "crm-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "ma-budget",
              className: "block text-xs text-muted-foreground mb-1",
              children: "Budget"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "ma-budget",
              type: "number",
              min: "0",
              step: "0.01",
              "data-ocid": "marketing-activity-record.edit.budget.input",
              value: form.budget,
              onChange: (e) => set("budget", e.target.value),
              className: "crm-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "ma-currency",
              className: "block text-xs text-muted-foreground mb-1",
              children: "Currency"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "ma-currency",
              "data-ocid": "marketing-activity-record.edit.currency.select",
              value: form.currency,
              onChange: (e) => set("currency", e.target.value),
              className: "crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem]",
              children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            "data-ocid": "marketing-activity-record.edit.cancel_button",
            onClick: () => setEditing(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            "data-ocid": "marketing-activity-record.edit.save_button",
            disabled: saving,
            style: { background: "#FF6B2B" },
            className: "text-white",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14, className: "mr-1.5" }),
              saving ? "Saving…" : "Save Changes"
            ]
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        "data-ocid": "marketing-activity-record.edit.button",
        onClick: () => setEditing(true),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13, className: "mr-1.5" }),
          " Edit"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Activity Type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: activity.activityType }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: activity.status }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Budget", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", style: { color: "#FF6B2B" }, children: [
        formatCurrency(Number(activity.budget) / 100, activity.currency),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-xs text-muted-foreground", children: activity.currency })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Start Date", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13, className: "text-muted-foreground" }),
        formatDate(activity.startDate)
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "End Date", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13, className: "text-muted-foreground" }),
        formatDate(activity.endDate)
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Owner User ID", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono", children: activity.ownerUserId || "—" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Vendor Owner", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono", children: activity.vendorOwnerId || "—" }) }),
      activity.distributorId && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Distributor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono", children: activity.distributorId }) }),
      activity.resellerId && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Reseller", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs font-mono", children: activity.resellerId }) }),
      activity.associatedPromotionIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "Associated Promotions", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: activity.associatedPromotionIds.map((pid) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border",
          children: pid
        },
        pid
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewField, { label: "ROI", children: activity.roi !== void 0 && activity.roi !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400 font-mono font-semibold", children: [
        Number(activity.roi),
        "%"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic text-xs", children: "Not tracked" }) })
    ] })
  ] });
}
function TargetAccountsTab({
  activity,
  onRefetch
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [newAccountId, setNewAccountId] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  async function handleRemove(accountId) {
    if (!actor) return;
    const updated = activity.targetAccountIds.filter((id) => id !== accountId);
    try {
      await actor.updateMarketingActivity(activity.id, {
        targetAccountIds: updated
      });
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id]
      });
      ue.success("Account removed");
      onRefetch();
    } catch {
      ue.error("Failed to remove account");
    }
  }
  async function handleAdd(e) {
    e.preventDefault();
    if (!actor || !newAccountId.trim()) return;
    setSaving(true);
    try {
      const ids = newAccountId.split(",").map((s) => s.trim()).filter(Boolean);
      const updated = Array.from(
        /* @__PURE__ */ new Set([...activity.targetAccountIds, ...ids])
      );
      await actor.updateMarketingActivity(activity.id, {
        targetAccountIds: updated
      });
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id]
      });
      ue.success("Account(s) added");
      setNewAccountId("");
      setShowAdd(false);
      onRefetch();
    } catch {
      ue.error("Failed to add accounts");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        activity.targetAccountIds.length,
        " target account",
        activity.targetAccountIds.length !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          "data-ocid": "marketing-activity-record.accounts.add_button",
          onClick: () => setShowAdd((v) => !v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1.5" }),
            " Add Accounts"
          ]
        }
      )
    ] }),
    showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleAdd,
        className: "crm-card p-4 flex items-end gap-3 fade-in",
        "data-ocid": "marketing-activity-record.accounts.add_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                htmlFor: "ma-account-ids",
                className: "block text-xs text-muted-foreground mb-1",
                children: [
                  "Account IDs",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(comma-separated)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "ma-account-ids",
                "data-ocid": "marketing-activity-record.accounts.new.input",
                value: newAccountId,
                onChange: (e) => setNewAccountId(e.target.value),
                className: "crm-input",
                placeholder: "account-id-1, account-id-2"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: saving || !newAccountId.trim(),
              "data-ocid": "marketing-activity-record.accounts.add.submit_button",
              style: { background: "#FF6B2B" },
              className: "text-white flex-shrink-0",
              children: saving ? "Adding…" : "Add"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              "data-ocid": "marketing-activity-record.accounts.add.cancel_button",
              onClick: () => {
                setShowAdd(false);
                setNewAccountId("");
              },
              children: "Cancel"
            }
          )
        ]
      }
    ),
    activity.targetAccountIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card flex flex-col items-center py-12",
        "data-ocid": "marketing-activity-record.accounts.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 32, className: "text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No target accounts linked" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Account ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: activity.targetAccountIds.map((accountId, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `marketing-activity-record.accounts.item.${i + 1}`,
          className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => navigate({
                  to: "/accounts/$id",
                  params: { id: accountId }
                }),
                className: "font-mono text-xs text-primary hover:underline",
                "data-ocid": `marketing-activity-record.accounts.link.${i + 1}`,
                children: accountId
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => handleRemove(accountId),
                className: "text-xs text-red-400 hover:text-red-300 transition-colors",
                "data-ocid": `marketing-activity-record.accounts.delete_button.${i + 1}`,
                children: "Remove"
              }
            ) })
          ]
        },
        accountId
      )) })
    ] }) })
  ] });
}
function CustomFieldsTab({ activityId }) {
  const {
    fieldDefs,
    fieldValues,
    pendingChanges,
    setFieldValue,
    saveFieldValues,
    hasPendingChanges,
    isSaving,
    errors,
    isLoading
  } = useCustomFields(CustomFieldObjectType.marketingActivity, activityId);
  const [editMode, setEditMode] = reactExports.useState(false);
  const activeDefs = fieldDefs.filter((d) => !d.isArchived);
  async function handleSave() {
    await saveFieldValues();
    ue.success("Custom fields saved");
    setEditMode(false);
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 p-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) });
  }
  if (activeDefs.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "crm-card flex flex-col items-center py-12",
        "data-ocid": "marketing-activity-record.custom_fields.empty_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No custom fields defined for Marketing Activities." })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          "data-ocid": "marketing-activity-record.custom_fields.cancel_button",
          onClick: () => setEditMode(false),
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          size: "sm",
          "data-ocid": "marketing-activity-record.custom_fields.save_button",
          disabled: isSaving || !hasPendingChanges,
          onClick: handleSave,
          style: { background: "#FF6B2B" },
          className: "text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13, className: "mr-1.5" }),
            isSaving ? "Saving…" : "Save"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        "data-ocid": "marketing-activity-record.custom_fields.edit_button",
        onClick: () => setEditMode(true),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13, className: "mr-1.5" }),
          " Edit Custom Fields"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-5", children: activeDefs.map(
      (def) => {
        var _a;
        return editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomFieldEditor,
          {
            fieldDef: def,
            value: pendingChanges[def.id] ?? ((_a = fieldValues[def.id]) == null ? void 0 : _a.value) ?? "",
            onChange: (v) => setFieldValue(def.id, v),
            error: errors[def.id]
          },
          def.id
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomFieldRenderer,
          {
            fieldDef: def,
            value: fieldValues[def.id]
          },
          def.id
        );
      }
    ) })
  ] });
}
function RoiTrackingTab({
  activity,
  onRefetch
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [showEdit, setShowEdit] = reactExports.useState(false);
  const [roiValue, setRoiValue] = reactExports.useState(
    activity.roi !== void 0 && activity.roi !== null ? String(Number(activity.roi)) : ""
  );
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSaveRoi(e) {
    e.preventDefault();
    if (!actor) return;
    const parsed = Number.parseInt(roiValue, 10);
    if (Number.isNaN(parsed)) {
      ue.error("ROI must be a valid number");
      return;
    }
    setSaving(true);
    try {
      await actor.recordMarketingActivityRoi(activity.id, BigInt(parsed));
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id]
      });
      ue.success("ROI recorded");
      setShowEdit(false);
      onRefetch();
    } catch {
      ue.error("Failed to record ROI");
    } finally {
      setSaving(false);
    }
  }
  const hasRoi = activity.roi !== void 0 && activity.roi !== null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Current ROI" }),
        hasRoi ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-4xl font-bold font-display",
              style: { color: "#4ade80" },
              children: [
                Number(activity.roi),
                "%"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground mb-1", children: "return on investment" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground italic", children: "No ROI recorded yet" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          "data-ocid": "marketing-activity-record.roi.edit_button",
          onClick: () => setShowEdit((v) => !v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13, className: "mr-1.5" }),
            hasRoi ? "Update ROI" : "Record ROI"
          ]
        }
      )
    ] }),
    showEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSaveRoi,
        className: "crm-card p-5 space-y-4 fade-in",
        "data-ocid": "marketing-activity-record.roi.edit_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Record ROI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "roi-val",
                  children: "ROI Percentage (%)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "roi-val",
                  type: "number",
                  required: true,
                  "data-ocid": "marketing-activity-record.roi.input",
                  value: roiValue,
                  onChange: (e) => setRoiValue(e.target.value),
                  className: "crm-input",
                  placeholder: "e.g. 145"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: saving,
                "data-ocid": "marketing-activity-record.roi.submit_button",
                style: { background: "#FF6B2B" },
                className: "text-white flex-shrink-0",
                children: saving ? "Saving…" : "Save ROI"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "marketing-activity-record.roi.cancel_button",
                onClick: () => setShowEdit(false),
                children: "Cancel"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enter the ROI as a percentage. For example, a budget of $10,000 that generated $14,500 in pipeline would be recorded as 145." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Budget" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono font-semibold",
            style: { color: "#FF6B2B" },
            children: formatCurrency(Number(activity.budget) / 100, activity.currency)
          }
        )
      ] }),
      hasRoi && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Estimated Return" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-green-400", children: formatCurrency(
          Number(activity.budget) / 100 * (Number(activity.roi) / 100),
          activity.currency
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Activity Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: activity.status })
      ] })
    ] })
  ] });
}
function StatusQuickChange({
  activity,
  onRefetch
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  async function handleChange(status) {
    if (!actor) return;
    try {
      await actor.updateMarketingActivity(activity.id, { status });
      queryClient.invalidateQueries({
        queryKey: ["marketingActivity", activity.id]
      });
      ue.success(`Status updated to ${STATUS_LABELS[status]}`);
      setOpen(false);
      onRefetch();
    } catch {
      ue.error("Failed to update status");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        className: "flex items-center gap-1.5 text-xs border border-border rounded-[0.5rem] px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-accent transition-colors",
        "data-ocid": "marketing-activity-record.status.toggle",
        children: [
          "Update Status",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 12, className: open ? "rotate-180" : "" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute right-0 top-full mt-1 crm-card min-w-[160px] z-20 py-1 shadow-lg fade-in",
        "data-ocid": "marketing-activity-record.status.dropdown_menu",
        children: Object.values(MarketingActivityStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => handleChange(s),
            className: `w-full px-4 py-2 text-xs text-left hover:bg-secondary/40 transition-colors ${s === activity.status ? "text-primary font-semibold" : "text-muted-foreground"}`,
            children: STATUS_LABELS[s]
          },
          s
        ))
      }
    )
  ] });
}
function MarketingActivityRecord() {
  var _a;
  const { id } = useParams({ from: "/marketing-activities/$id" });
  const navigate = useNavigate();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const {
    data: activity,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["marketingActivity", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketingActivity(id);
    },
    enabled: !!actor && !!id,
    staleTime: 3e4,
    refetchInterval: 3e4
  });
  function handleRefetch() {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in p-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" })
    ] });
  }
  if (!activity) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-20",
        "data-ocid": "marketing-activity-record.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Activity not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "mt-4",
              onClick: () => navigate({ to: "/marketing-activities" }),
              children: "Back to Marketing Activities"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-5 fade-in",
      "data-ocid": "marketing-activity-record.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "workspace-breadcrumb", "aria-label": "breadcrumb", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/marketing-activities" }),
              className: "workspace-breadcrumb-link flex items-center gap-1",
              "data-ocid": "marketing-activity-record.breadcrumb.back_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 13 }),
                " Marketing Activities"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground truncate max-w-[260px]", children: activity.activityName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg",
                style: { background: "rgba(255,107,43,0.15)", color: "#FF6B2B" },
                children: (_a = activity.activityName[0]) == null ? void 0 : _a.toUpperCase()
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display truncate", children: activity.activityName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: activity.activityType }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: activity.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 11 }),
                  formatDate(activity.startDate),
                  " –",
                  " ",
                  formatDate(activity.endDate)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-mono font-semibold",
                    style: { color: "#FF6B2B" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { size: 11, className: "inline" }),
                      formatCurrency(
                        Number(activity.budget) / 100,
                        activity.currency
                      )
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusQuickChange, { activity, onRefetch: handleRefetch })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-wrap gap-1 p-1 bg-card border border-border rounded-[0.5rem]",
            role: "tablist",
            "data-ocid": "marketing-activity-record.tab",
            children: TABS.map((tab) => {
              const Icon = tab.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": activeTab === tab.id,
                  onClick: () => setActiveTab(tab.id),
                  className: `flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-[0.375rem] transition-colors duration-150 ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`,
                  "data-ocid": `marketing-activity-record.${tab.id}.tab`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14 }),
                    tab.label
                  ]
                },
                tab.id
              );
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[300px]", children: [
          activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { activity, onRefetch: handleRefetch }),
          activeTab === "target-accounts" && /* @__PURE__ */ jsxRuntimeExports.jsx(TargetAccountsTab, { activity, onRefetch: handleRefetch }),
          activeTab === "custom-fields" && /* @__PURE__ */ jsxRuntimeExports.jsx(CustomFieldsTab, { activityId: activity.id }),
          activeTab === "roi-tracking" && /* @__PURE__ */ jsxRuntimeExports.jsx(RoiTrackingTab, { activity, onRefetch: handleRefetch })
        ] })
      ]
    }
  );
}
export {
  MarketingActivityRecord
};
