import { p as useActor, u as useApp, a as useNavigate, r as reactExports, aZ as useQuery, bT as MarketingActivityStatus, j as jsxRuntimeExports, m as Button, a8 as Plus, e as TrendingUp, z as DollarSign, W as formatCurrency, bU as MarketingActivityType, S as Search, ad as Input, X, af as formatDate, aY as useQueryClient, ah as CustomFieldObjectType, ab as ue } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { u as useCustomFields, C as CustomFieldEditor } from "./useCustomFields-Do4Q3M8P.js";
import { A as Activity } from "./activity-BzA2r-7b.js";
import { C as Calendar } from "./calendar-BzO3LGDM.js";
import "./checkbox-Cr6u9Lap.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
import "./textarea-BHUaDciu.js";
import "./useMutation-D0Tr8pyU.js";
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
  [MarketingActivityStatus.cancelled]: "bg-red-500/15 text-red-300 border-red-500/25"
};
const STATUS_LABELS = {
  [MarketingActivityStatus.planned]: "Planned",
  [MarketingActivityStatus.inProgress]: "In Progress",
  [MarketingActivityStatus.completed]: "Completed",
  [MarketingActivityStatus.cancelled]: "Cancelled"
};
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
function RoiCell({ roi }) {
  if (roi === void 0 || roi === null) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground italic text-xs", children: "Not tracked" });
  }
  const pct = Number(roi);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400 font-mono text-sm font-medium", children: [
    pct,
    "%"
  ] });
}
function StatTile({
  label,
  value,
  icon: Icon,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-tile", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "metric-label", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Icon,
        {
          size: 16,
          className: accent ? "text-primary" : "text-muted-foreground"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `metric-value text-2xl ${accent ? "text-primary" : ""}`, children: value })
  ] });
}
const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "JPY", "CNY"];
function NewActivityModal({
  onClose,
  onCreated
}) {
  const { actor } = useActor();
  const { userProfile } = useApp();
  const queryClient = useQueryClient();
  const [form, setForm] = reactExports.useState({
    activityName: "",
    activityType: MarketingActivityType.event,
    startDate: "",
    endDate: "",
    budget: "",
    currency: "USD",
    ownerUserId: (userProfile == null ? void 0 : userProfile.id) ?? "",
    status: MarketingActivityStatus.planned,
    resellerId: "",
    distributorId: "",
    targetAccountsRaw: ""
  });
  const [saving, setSaving] = reactExports.useState(false);
  const [customFieldObjectId] = reactExports.useState("__new__");
  const {
    fieldDefs,
    pendingChanges,
    setFieldValue,
    errors: cfErrors,
    isLoading: cfLoading
  } = useCustomFields(
    CustomFieldObjectType.marketingActivity,
    customFieldObjectId
  );
  const activeDefs = fieldDefs.filter((d) => !d.isArchived);
  async function handleSubmit(e) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const startMs = new Date(form.startDate).getTime();
      const endMs = new Date(form.endDate).getTime();
      if (Number.isNaN(startMs) || Number.isNaN(endMs)) {
        ue.error("Invalid date values");
        return;
      }
      const targetIds = form.targetAccountsRaw.split(",").map((s) => s.trim()).filter(Boolean);
      const input = {
        activityName: form.activityName,
        activityType: form.activityType,
        startDate: BigInt(startMs * 1e6),
        endDate: BigInt(endMs * 1e6),
        budget: BigInt(Math.round(Number.parseFloat(form.budget) * 100) || 0),
        currency: form.currency,
        vendorOwnerId: (userProfile == null ? void 0 : userProfile.companyId) ?? "",
        targetAccountIds: targetIds,
        associatedPromotionIds: [],
        ...form.resellerId ? { resellerId: form.resellerId } : {},
        ...form.distributorId ? { distributorId: form.distributorId } : {}
      };
      await actor.createMarketingActivity(input);
      queryClient.invalidateQueries({ queryKey: ["marketingActivities"] });
      ue.success("Marketing activity created");
      onCreated();
      onClose();
    } catch {
      ue.error("Failed to create activity");
    } finally {
      setSaving(false);
    }
  }
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm",
      "data-ocid": "marketing-activities.new_modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground font-display", children: "New Marketing Activity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "text-muted-foreground hover:text-foreground transition-colors",
              "data-ocid": "marketing-activities.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-name",
                  children: "Activity Name *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ma-name",
                  required: true,
                  "data-ocid": "marketing-activities.name.input",
                  value: form.activityName,
                  onChange: (e) => set("activityName", e.target.value),
                  className: "crm-input",
                  placeholder: "Q3 Partner Webinar Series"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-type",
                  children: "Activity Type *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "ma-type",
                  required: true,
                  "data-ocid": "marketing-activities.type.select",
                  value: form.activityType,
                  onChange: (e) => set("activityType", e.target.value),
                  className: "crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
                  children: Object.values(MarketingActivityType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: TYPE_LABELS[t] }, t))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-status",
                  children: "Status"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "ma-status",
                  "data-ocid": "marketing-activities.status.select",
                  value: form.status,
                  onChange: (e) => set("status", e.target.value),
                  className: "crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
                  children: Object.values(MarketingActivityStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: STATUS_LABELS[s] }, s))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-start",
                  children: "Start Date *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ma-start",
                  type: "date",
                  required: true,
                  "data-ocid": "marketing-activities.start_date.input",
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
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-end",
                  children: "End Date *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ma-end",
                  type: "date",
                  required: true,
                  "data-ocid": "marketing-activities.end_date.input",
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
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-budget",
                  children: "Budget *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ma-budget",
                  type: "number",
                  required: true,
                  min: "0",
                  step: "0.01",
                  "data-ocid": "marketing-activities.budget.input",
                  value: form.budget,
                  onChange: (e) => set("budget", e.target.value),
                  className: "crm-input",
                  placeholder: "10000"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-currency",
                  children: "Currency"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "ma-currency",
                  "data-ocid": "marketing-activities.currency.select",
                  value: form.currency,
                  onChange: (e) => set("currency", e.target.value),
                  className: "crm-input w-full text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
                  children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-accounts",
                  children: [
                    "Target Account IDs",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-muted-foreground/60", children: "(comma-separated)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ma-accounts",
                  "data-ocid": "marketing-activities.target_accounts.input",
                  value: form.targetAccountsRaw,
                  onChange: (e) => set("targetAccountsRaw", e.target.value),
                  className: "crm-input",
                  placeholder: "account-id-1, account-id-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-reseller",
                  children: [
                    "Reseller",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-muted-foreground/60", children: "(optional)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ma-reseller",
                  "data-ocid": "marketing-activities.reseller.input",
                  value: form.resellerId,
                  onChange: (e) => set("resellerId", e.target.value),
                  className: "crm-input",
                  placeholder: "Reseller ID"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "block text-xs text-muted-foreground mb-1",
                  htmlFor: "ma-distributor",
                  children: [
                    "Distributor",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-muted-foreground/60", children: "(optional)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "ma-distributor",
                  "data-ocid": "marketing-activities.distributor.input",
                  value: form.distributorId,
                  onChange: (e) => set("distributorId", e.target.value),
                  className: "crm-input",
                  placeholder: "Distributor ID"
                }
              )
            ] })
          ] }),
          !cfLoading && activeDefs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Custom Fields" }),
            activeDefs.map((def) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              CustomFieldEditor,
              {
                fieldDef: def,
                value: pendingChanges[def.id] ?? "",
                onChange: (v) => setFieldValue(def.id, v),
                error: cfErrors[def.id]
              },
              def.id
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "marketing-activities.cancel_button",
                onClick: onClose,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                "data-ocid": "marketing-activities.submit_button",
                disabled: saving,
                style: { background: "#FF6B2B" },
                className: "text-white",
                children: saving ? "Creating…" : "Create Activity"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
const TYPE_TABS = [
  { value: "all", label: "All" },
  { value: MarketingActivityType.webinar, label: "Webinar" },
  { value: MarketingActivityType.event, label: "Event" },
  { value: MarketingActivityType.emailCampaign, label: "Email Campaign" },
  { value: MarketingActivityType.content, label: "Content" },
  { value: MarketingActivityType.sponsorship, label: "Sponsorship" },
  { value: MarketingActivityType.other, label: "Other" }
];
function MarketingActivitiesPage() {
  const { actor } = useActor();
  const { userProfile } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const {
    data: activities = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["marketingActivities", userProfile == null ? void 0 : userProfile.companyId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMarketingActivitiesForCaller(
        null,
        (userProfile == null ? void 0 : userProfile.companyId) ?? "",
        (userProfile == null ? void 0 : userProfile.role) ?? "",
        null,
        null
      );
    },
    enabled: !!actor && !!userProfile,
    staleTime: 3e4,
    refetchInterval: 3e4
  });
  const filtered = activities.filter((a) => {
    if (search && !a.activityName.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (typeFilter !== "all" && a.activityType !== typeFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });
  const totalBudget = activities.reduce(
    (sum, a) => sum + Number(a.budget) / 100,
    0
  );
  const activeCount = activities.filter(
    (a) => a.status === MarketingActivityStatus.inProgress
  ).length;
  const completedThisQuarter = activities.filter((a) => {
    if (a.status !== MarketingActivityStatus.completed) return false;
    const ms = Number(a.endDate) / 1e6;
    const d = new Date(ms);
    const now = /* @__PURE__ */ new Date();
    const quarterStart = new Date(
      now.getFullYear(),
      Math.floor(now.getMonth() / 3) * 3,
      1
    );
    return d >= quarterStart;
  }).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", "data-ocid": "marketing-activities.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground font-display", children: "Marketing Activities" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Campaigns, events, webinars and channel programmes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "marketing-activities.new_activity.primary_button",
          onClick: () => setShowCreate(true),
          style: { background: "#FF6B2B" },
          className: "text-white flex-shrink-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
            " New Activity"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatTile,
        {
          label: "Total Activities",
          value: activities.length,
          icon: Activity
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Active", value: activeCount, icon: TrendingUp, accent: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatTile,
        {
          label: "Total Budget",
          value: formatCurrency(totalBudget),
          icon: DollarSign,
          accent: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatTile,
        {
          label: "Completed This Quarter",
          value: completedThisQuarter,
          icon: Calendar
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-wrap gap-1 p-1 bg-card border border-border rounded-[0.5rem]",
          "data-ocid": "marketing-activities.type.tab",
          children: TYPE_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setTypeFilter(tab.value),
              className: `px-3 py-1.5 text-xs font-medium rounded-[0.375rem] transition-colors duration-150 ${typeFilter === tab.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`,
              children: tab.label
            },
            tab.value
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              size: 14,
              className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "marketing-activities.search_input",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Search activities…",
              className: "crm-input pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            "data-ocid": "marketing-activities.status.select",
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: "crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Statuses" }),
              Object.values(MarketingActivityStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: STATUS_LABELS[s] }, s))
            ]
          }
        ),
        (search || typeFilter !== "all" || statusFilter !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setSearch("");
              setTypeFilter("all");
              setStatusFilter("all");
            },
            className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors",
            "data-ocid": "marketing-activities.clear_filters.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
              " Clear"
            ]
          }
        )
      ] })
    ] }),
    !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      filtered.length,
      " activit",
      filtered.length !== 1 ? "ies" : "y"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16",
        "data-ocid": "marketing-activities.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 40, className: "text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: search || typeFilter !== "all" || statusFilter !== "all" ? "No activities match your filters" : "No marketing activities yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: search || typeFilter !== "all" || statusFilter !== "all" ? "Try adjusting your search or filter criteria." : "Create your first marketing activity to get started." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setShowCreate(true),
              style: { background: "#FF6B2B" },
              className: "text-white",
              "data-ocid": "marketing-activities.empty.create_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
                " New Activity"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
        "Activity Name",
        "Type",
        "Status",
        "Start Date",
        "End Date",
        "Budget",
        "Target Accounts",
        "ROI",
        ""
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((a, i) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `marketing-activities.item.${i + 1}`,
            onClick: () => navigate({
              to: "/marketing-activities/$id",
              params: { id: a.id }
            }),
            onKeyDown: (e) => e.key === "Enter" && navigate({
              to: "/marketing-activities/$id",
              params: { id: a.id }
            }),
            tabIndex: 0,
            className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs",
                    style: {
                      background: "rgba(255,107,43,0.15)",
                      color: "#FF6B2B"
                    },
                    children: (_a = a.activityName[0]) == null ? void 0 : _a.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[200px]", children: a.activityName })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: a.activityType }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground text-xs", children: formatDate(a.startDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground text-xs", children: formatDate(a.endDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  className: "px-5 py-3.5 font-mono text-foreground",
                  style: { color: "#FF6B2B" },
                  children: formatCurrency(Number(a.budget) / 100, a.currency)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: a.targetAccountIds.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: a.targetAccountIds.length }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 italic text-xs", children: "None" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoiCell, { roi: a.roi }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    navigate({
                      to: "/marketing-activities/$id",
                      params: { id: a.id }
                    });
                  },
                  className: "text-xs text-primary hover:underline",
                  "data-ocid": `marketing-activities.view.${i + 1}`,
                  children: "View"
                }
              ) })
            ]
          },
          a.id
        );
      }) })
    ] }) }) }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NewActivityModal,
      {
        onClose: () => setShowCreate(false),
        onCreated: refetch
      }
    )
  ] });
}
export {
  MarketingActivitiesPage
};
