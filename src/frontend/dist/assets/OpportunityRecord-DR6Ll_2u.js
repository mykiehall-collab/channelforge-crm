import { c as createLucideIcon, ag as useRouterState, a as useNavigate, p as useActor, r as reactExports, ab as ue, j as jsxRuntimeExports, ai as ArrowLeft, i as ChevronRight, ad as Input, W as formatCurrency, m as Button, X, ar as Save, aC as Trash2, E as ExternalLink, Z as Zap, a4 as Link2, n as Clock, an as timeAgo } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { u as useCustomFields, C as CustomFieldEditor } from "./useCustomFields-Do4Q3M8P.js";
import { C as CustomFieldRenderer } from "./CustomFieldRenderer-DSYXzkdv.js";
import { F as ForgeAIRecommendationCard } from "./ForgeAIRecommendationCard-C4eBPTAG.js";
import { P as PriceCalculator } from "./PriceCalculator-Cfqa4XfP.js";
import { u as useForgeAI } from "./useForgeAI-CFLYJlF1.js";
import { P as Pen } from "./pen-CQ3Xm2Uu.js";
import "./checkbox-Cr6u9Lap.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
import "./textarea-BHUaDciu.js";
import "./useMutation-D0Tr8pyU.js";
import "./download-DVLbZ_Ir.js";
import "./phone-DSozTLzi.js";
import "./mail-BpQyu_iW.js";
import "./minus-OwCcNK6_.js";
import "./backend.d-Bio-_uWv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
];
const EllipsisVertical = createLucideIcon("ellipsis-vertical", __iconNode);
const STAGE_ORDER = [
  "prospecting",
  "qualification",
  "proposal",
  "negotiation",
  "closedWon",
  "closedLost"
];
const STAGE_LABEL = {
  prospecting: "Prospecting",
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closedWon: "Closed Won",
  closedLost: "Closed Lost"
};
const STAGE_COLOR = {
  prospecting: "bg-muted/40 text-muted-foreground border-border",
  qualification: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  proposal: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  negotiation: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  closedWon: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  closedLost: "bg-red-500/15 text-red-300 border-red-500/30"
};
function formatDateStr(ns) {
  if (!ns) return "—";
  const d = new Date(Number(ns) / 1e6);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function dateToNs(val) {
  if (!val) return BigInt(0);
  return BigInt(new Date(val).getTime() * 1e6);
}
function nsToDateInput(ns) {
  if (!ns) return "";
  return new Date(Number(ns) / 1e6).toISOString().split("T")[0];
}
function buildHistory(opp) {
  const entries = [
    {
      id: "created",
      type: "created",
      label: "Opportunity created",
      by: opp.ownerUserId || "System",
      at: opp.createdAt
    }
  ];
  if (opp.updatedAt !== opp.createdAt) {
    entries.push({
      id: "updated",
      type: "field",
      label: "Opportunity updated",
      detail: `Stage: ${STAGE_LABEL[opp.stage] ?? opp.stage}`,
      by: opp.ownerUserId || "System",
      at: opp.updatedAt
    });
  }
  return entries.sort((a, b) => a.at < b.at ? 1 : -1);
}
function OverviewTab({
  opp,
  onStageChange,
  stageChanging,
  editMode,
  editForm,
  onEditChange,
  forgeRec
}) {
  const [showStageMenu, setShowStageMenu] = reactExports.useState(false);
  const fields = [
    {
      label: "Customer Account",
      value: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "crm-input h-8 text-sm",
          value: editForm.customerAccountId ?? "",
          onChange: (e) => onEditChange("customerAccountId", e.target.value)
        }
      ) : opp.customerAccountId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "inline-flex items-center gap-1.5 text-sm font-medium hover:underline",
          style: { color: "#FF6B2B" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 }),
            opp.customerAccountId
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground italic", children: "—" })
    },
    {
      label: "Owner",
      value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: opp.ownerUserId || "—" })
    },
    {
      label: "Revenue Estimate",
      value: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "number",
          className: "crm-input h-8 text-sm",
          value: editForm.revenueStr ?? "",
          onChange: (e) => onEditChange("revenueStr", e.target.value)
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-sm font-bold font-mono",
          style: { color: "#FF6B2B" },
          children: formatCurrency(Number(opp.revenueEstimate))
        }
      )
    },
    {
      label: "Close Date",
      value: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "date",
          className: "crm-input h-8 text-sm",
          value: editForm.closeDateStr ?? "",
          onChange: (e) => onEditChange("closeDateStr", e.target.value)
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: formatDateStr(opp.closeDate) })
    },
    {
      label: "Reseller",
      value: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "crm-input h-8 text-sm",
          value: editForm.resellerId ?? "",
          onChange: (e) => onEditChange("resellerId", e.target.value)
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: opp.resellerId || "—" })
    },
    {
      label: "Distributor",
      value: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "crm-input h-8 text-sm",
          value: editForm.distributorId ?? "",
          onChange: (e) => onEditChange("distributorId", e.target.value)
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: opp.distributorId || "—" })
    },
    {
      label: "Vendor",
      value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: opp.vendorOwnerId || "—" })
    },
    {
      label: "Status",
      value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: opp.status })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 flex-wrap", children: STAGE_ORDER.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12, className: "text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${s === opp.stage ? STAGE_COLOR[s] : "bg-transparent text-muted-foreground/50 border-transparent"}`,
            children: STAGE_LABEL[s]
          }
        )
      ] }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "opportunity.stage_change.button",
            disabled: stageChanging,
            onClick: () => setShowStageMenu((v) => !v),
            className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:border-accent/50 text-muted-foreground hover:text-foreground transition-colors",
            children: [
              "Move Stage ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 12 })
            ]
          }
        ),
        showStageMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute right-0 top-8 z-20 crm-card min-w-[160px] py-1 shadow-lg fade-in",
            "data-ocid": "opportunity.stage_change.dropdown_menu",
            children: STAGE_ORDER.filter((s) => s !== opp.stage).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setShowStageMenu(false);
                  onStageChange(s);
                },
                className: "w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary/40 transition-colors",
                children: STAGE_LABEL[s]
              },
              s
            ))
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Core Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide", children: f.label }),
        f.value
      ] }, f.label)) })
    ] }),
    forgeRec && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-3 rounded-[0.5rem] border",
        style: {
          background: "rgba(255,107,43,0.04)",
          borderColor: "rgba(255,107,43,0.18)"
        },
        "data-ocid": "opportunity.forgeai.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 13, style: { color: "#FF6B2B" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-semibold uppercase tracking-wide",
                style: { color: "#FF6B2B" },
                children: "ForgeAI Recommendation"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ForgeAIRecommendationCard, { recommendation: forgeRec })
        ]
      }
    )
  ] });
}
function DealsTab({
  deals,
  loadingDeals
}) {
  const navigate = useNavigate();
  if (loadingDeals) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        deals.length,
        " associated deal registration",
        deals.length !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "opportunity.deals.link_button",
          className: "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:border-accent/50 text-muted-foreground hover:text-foreground transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 12 }),
            " Link Deal"
          ]
        }
      )
    ] }),
    deals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card py-12 flex flex-col items-center gap-3",
        "data-ocid": "opportunity.deals.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 32, className: "text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No deal registrations linked yet" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["Deal Name", "Value", "Status", ""].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: deals.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `opportunity.deals.item.${i + 1}`,
          className: "border-b border-border/50 last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 font-medium text-foreground", children: d.opportunityName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "px-5 py-3.5 font-mono font-semibold",
                style: { color: "#FF6B2B" },
                children: formatCurrency(d.estimatedValue)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/40 text-muted-foreground", children: d.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": `opportunity.deals.view.${i + 1}`,
                onClick: () => navigate({
                  to: "/deal-registrations"
                }),
                className: "text-xs text-primary hover:underline flex items-center gap-1",
                children: [
                  "View ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 10 })
                ]
              }
            ) })
          ]
        },
        d.id
      )) })
    ] }) })
  ] });
}
function CustomFieldsTab({
  objectId,
  canEdit
}) {
  const customFields = useCustomFields(
    "opportunity",
    objectId
  );
  const [editMode, setEditMode] = reactExports.useState(false);
  if (customFields.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }, i)) });
  }
  const activeDefs = customFields.fieldDefs.filter((f) => !f.isArchived);
  if (activeDefs.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "crm-card py-12 flex flex-col items-center gap-3",
        "data-ocid": "opportunity.custom_fields.empty_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No custom fields configured for Opportunities" })
      }
    );
  }
  async function handleSave() {
    try {
      await customFields.saveFieldValues();
      if (Object.keys(customFields.errors).length === 0) {
        setEditMode(false);
        ue.success("Custom fields saved");
      }
    } catch {
      ue.error("Failed to save custom fields");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: !editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        "data-ocid": "opportunity.custom_fields.edit_button",
        onClick: () => setEditMode(true),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13, className: "mr-1.5" }),
          " Edit Custom Fields"
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          "data-ocid": "opportunity.custom_fields.cancel_button",
          onClick: () => setEditMode(false),
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "opportunity.custom_fields.save_button",
          disabled: customFields.isSaving || !customFields.hasPendingChanges,
          onClick: handleSave,
          style: { background: "#FF6B2B" },
          className: "text-white",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13, className: "mr-1.5" }),
            customFields.isSaving ? "Saving…" : "Save Changes"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5", children: activeDefs.map(
      (def) => {
        var _a;
        return editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomFieldEditor,
          {
            fieldDef: def,
            value: customFields.pendingChanges[def.id] ?? ((_a = customFields.fieldValues[def.id]) == null ? void 0 : _a.value) ?? "",
            onChange: (v) => customFields.setFieldValue(def.id, v),
            error: customFields.errors[def.id]
          },
          def.id
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          CustomFieldRenderer,
          {
            fieldDef: def,
            value: customFields.fieldValues[def.id]
          },
          def.id
        );
      }
    ) }) })
  ] });
}
function HistoryTab({ opp }) {
  const entries = buildHistory(opp);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "opportunity.history.list", children: entries.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `opportunity.history.item.${i + 1}`,
      className: "flex items-start gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
            style: {
              background: entry.type === "stage" ? "rgba(255,107,43,0.15)" : "rgba(100,140,220,0.1)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Clock,
              {
                size: 13,
                style: {
                  color: entry.type === "stage" ? "#FF6B2B" : "#6B8CAE"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 crm-card p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: entry.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground flex-shrink-0", children: timeAgo(entry.at) })
          ] }),
          entry.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: entry.detail }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            "by ",
            entry.by
          ] })
        ] })
      ]
    },
    entry.id
  )) });
}
function OpportunityRecord() {
  const routerState = useRouterState();
  const id = routerState.location.pathname.split("/opportunities/")[1];
  const navigate = useNavigate();
  const { actor } = useActor();
  const { recommendations } = useForgeAI();
  const [opp, setOpp] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [editMode, setEditMode] = reactExports.useState(false);
  const [editForm, setEditForm] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  const [stageChanging, setStageChanging] = reactExports.useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = reactExports.useState(false);
  const [archiving, setArchiving] = reactExports.useState(false);
  const [deals, setDeals] = reactExports.useState([]);
  const [loadingDeals, setLoadingDeals] = reactExports.useState(false);
  const forgeRec = recommendations.find(
    (r) => r.affectedEntityId === id || r.affectedEntityType === "Opportunity" && r.affectedEntityName === (opp == null ? void 0 : opp.opportunityName)
  ) ?? null;
  const load = reactExports.useCallback(async () => {
    if (!actor || !id) return;
    setLoading(true);
    try {
      const result = await actor.getOpportunity(id);
      if (result) {
        setOpp(result);
      } else {
        ue.error("Opportunity not found");
        navigate({ to: "/opportunities" });
      }
    } catch {
      ue.error("Failed to load opportunity");
    } finally {
      setLoading(false);
    }
  }, [actor, id, navigate]);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  reactExports.useEffect(() => {
    if (!actor || !opp || opp.associatedDealIds.length === 0) return;
    setLoadingDeals(true);
    Promise.allSettled(
      opp.associatedDealIds.map((dealId) => actor.getDealRegistration(dealId))
    ).then((results) => {
      const loaded = [];
      for (const r of results) {
        if (r.status === "fulfilled" && r.value) {
          loaded.push(r.value);
        }
      }
      setDeals(loaded);
    }).catch(() => {
    }).finally(() => setLoadingDeals(false));
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
      revenueStr: String(opp.revenueEstimate)
    });
    setEditMode(true);
  }
  function handleEditChange(key, val) {
    setEditForm((f) => ({ ...f, [key]: val }));
  }
  async function handleSave() {
    if (!actor || !opp) return;
    setSaving(true);
    try {
      const updated = await actor.updateOpportunity(id, {
        opportunityName: editForm.opportunityName,
        customerAccountId: editForm.customerAccountId || void 0,
        resellerId: editForm.resellerId || void 0,
        distributorId: editForm.distributorId || void 0,
        closeDate: editForm.closeDateStr ? dateToNs(editForm.closeDateStr) : void 0,
        revenueEstimate: editForm.revenueStr ? BigInt(Math.round(Number(editForm.revenueStr))) : void 0
      });
      if (updated) {
        setOpp(updated);
        setEditMode(false);
        ue.success("Opportunity updated");
      } else {
        ue.error("Failed to update: not found");
      }
    } catch {
      ue.error("Failed to update opportunity");
    } finally {
      setSaving(false);
    }
  }
  async function handleStageChange(stage) {
    if (!actor || !opp) return;
    setStageChanging(true);
    try {
      const updated = await actor.updateOpportunity(id, { stage });
      if (updated) {
        setOpp(updated);
        ue.success(`Stage updated to ${STAGE_LABEL[stage]}`);
      } else {
        ue.error("Failed to update stage");
      }
    } catch {
      ue.error("Failed to update stage");
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
        ue.success("Opportunity archived");
        navigate({ to: "/opportunities" });
      } else {
        ue.error("Failed to archive opportunity");
      }
    } catch {
      ue.error("Failed to archive opportunity");
    } finally {
      setArchiving(false);
      setShowArchiveConfirm(false);
    }
  }
  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "deals", label: `Deals (${deals.length})` },
    { key: "customFields", label: "Custom Fields" },
    { key: "history", label: "History" },
    { key: "priceCalc", label: "Price Calculator" }
  ];
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-5 fade-in",
        "data-ocid": "opportunity-record.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-64" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" })
        ]
      }
    );
  }
  if (!opp) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", "data-ocid": "opportunity-record.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "opportunity-record.back.link",
          onClick: () => navigate({ to: "/opportunities" }),
          className: "flex items-center gap-1.5 hover:text-foreground transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
            " Opportunities"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground truncate max-w-[240px]", children: opp.opportunityName })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "crm-card p-5",
        style: {
          background: "linear-gradient(135deg, rgba(255,107,43,0.04) 0%, rgba(14,27,46,0.8) 100%)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            editMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "crm-input text-xl font-bold font-display mb-2",
                value: editForm.opportunityName ?? "",
                onChange: (e) => handleEditChange("opportunityName", e.target.value),
                "data-ocid": "opportunity-record.name.input"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display break-words", children: opp.opportunityName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-lg font-bold font-mono",
                  style: { color: "#FF6B2B" },
                  children: formatCurrency(Number(opp.revenueEstimate))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STAGE_COLOR[opp.stage]}`,
                  children: STAGE_LABEL[opp.stage] ?? opp.stage
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                "Close: ",
                formatDateStr(opp.closeDate)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-shrink-0", children: editMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "opportunity-record.cancel_button",
                onClick: () => setEditMode(false),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13, className: "mr-1" }),
                  " Cancel"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                "data-ocid": "opportunity-record.save_button",
                disabled: saving,
                onClick: handleSave,
                style: { background: "#FF6B2B" },
                className: "text-white",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 13, className: "mr-1" }),
                  saving ? "Saving…" : "Save"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "opportunity-record.edit_button",
                onClick: enterEditMode,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13, className: "mr-1" }),
                  " Edit"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "opportunity-record.archive.open_modal_button",
                onClick: () => setShowArchiveConfirm(true),
                className: "text-destructive border-destructive/40 hover:bg-destructive/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13, className: "mr-1" }),
                  " Archive"
                ]
              }
            )
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-1 border-b border-border",
        role: "tablist",
        "data-ocid": "opportunity-record.tabs",
        children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "data-ocid": `opportunity-record.${tab.key}.tab`,
            "aria-selected": activeTab === tab.key,
            onClick: () => setActiveTab(tab.key),
            className: `px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.key ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`,
            children: tab.label
          },
          tab.key
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `opportunity-record.${activeTab}.panel`, children: [
      activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        OverviewTab,
        {
          opp,
          onStageChange: handleStageChange,
          stageChanging,
          editMode,
          editForm,
          onEditChange: handleEditChange,
          forgeRec
        }
      ),
      activeTab === "deals" && /* @__PURE__ */ jsxRuntimeExports.jsx(DealsTab, { deals, loadingDeals }),
      activeTab === "customFields" && /* @__PURE__ */ jsxRuntimeExports.jsx(CustomFieldsTab, { objectId: id, canEdit: true }),
      activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryTab, { opp }),
      activeTab === "priceCalc" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground px-4 pt-4", children: "Price Calculator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PriceCalculator,
          {
            opportunityId: (opp == null ? void 0 : opp.id) ?? "",
            accountId: (opp == null ? void 0 : opp.customerAccountId) ?? "",
            readOnly: false
          }
        ) })
      ] })
    ] }),
    showArchiveConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        style: { background: "rgba(0,0,0,0.65)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "crm-card w-full max-w-md p-6 fade-in",
            "data-ocid": "opportunity-record.archive.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-foreground mb-2", children: "Archive Opportunity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-5", children: [
                "Are you sure you want to archive",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: opp.opportunityName }),
                "? This action can be reversed by an admin."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    "data-ocid": "opportunity-record.archive.cancel_button",
                    onClick: () => setShowArchiveConfirm(false),
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "opportunity-record.archive.confirm_button",
                    disabled: archiving,
                    onClick: handleArchive,
                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    children: archiving ? "Archiving…" : "Archive"
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  OpportunityRecord
};
