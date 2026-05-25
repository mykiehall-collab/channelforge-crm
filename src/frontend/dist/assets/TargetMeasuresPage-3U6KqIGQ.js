import { a as useNavigate, u as useApp, r as reactExports, ab as ue, af as formatDate, j as jsxRuntimeExports, i as ChevronRight, m as Button, G as RefreshCcw, aN as Info, v as BookOpen, ad as Input, I as CircleAlert, ar as Save, X, aI as RotateCcw } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { u as useTargets } from "./useTargets-v1HbgFMi.js";
import { C as ClipboardList } from "./clipboard-list-BvyAGRk8.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
const CALC_BADGE = {
  Revenue: {
    label: "Revenue",
    cls: "bg-primary/20 text-primary border-primary/30"
  },
  Count: {
    label: "Count",
    cls: "bg-blue-500/20 text-blue-300 border-blue-500/30"
  },
  Percentage: {
    label: "Percentage",
    cls: "bg-purple-500/20 text-purple-300 border-purple-500/30"
  },
  Weighted: {
    label: "Weighted",
    cls: "bg-teal-500/20 text-teal-300 border-teal-500/30"
  }
};
const DEFAULT_CALC_TYPES = {
  Measure1: "Revenue",
  Measure2: "Revenue",
  Measure3: "Revenue",
  Measure4: "Count",
  Measure5: "Revenue"
};
function SkeletonRow({ index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: index % 2 === 0 ? "bg-card/40" : "bg-background/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4 mx-auto rounded" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 rounded" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36 rounded" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40 rounded" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 rounded" }) })
  ] });
}
function MeasureRow({
  measure,
  index,
  isEditing,
  canEdit,
  onEdit,
  onSave,
  onCancel,
  onReset,
  saving
}) {
  const displayName = measure.customName ?? measure.defaultName;
  const hasCustom = !!(measure.customName && measure.customName !== measure.defaultName);
  const [editValue, setEditValue] = reactExports.useState(displayName);
  const inputRef = reactExports.useRef(null);
  const calcType = measure.calculationType ?? DEFAULT_CALC_TYPES[measure.measureId];
  const badge = CALC_BADGE[calcType];
  const segmentLabel = `Segment ${index + 1}`;
  reactExports.useEffect(() => {
    if (isEditing) {
      setEditValue(displayName);
      setTimeout(() => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.focus();
      }, 50);
    }
  }, [isEditing, displayName]);
  const validationError = isEditing && (editValue.trim().length === 0 || editValue.trim().length > 50) ? editValue.trim().length === 0 ? "Name cannot be empty" : "Name must be 50 characters or fewer" : null;
  const rowBg = index % 2 === 0 ? "bg-card/40" : "bg-background/60";
  const editingBg = isEditing ? "bg-primary/5 ring-1 ring-primary/20" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: `${rowBg} ${editingBg} transition-colors duration-150 hover:bg-secondary/30`,
      "data-ocid": `target_measures.row.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground font-semibold", children: index + 1 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground tracking-wider uppercase", children: segmentLabel }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: measure.defaultName }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              ref: inputRef,
              value: editValue,
              onChange: (e) => setEditValue(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && !validationError)
                  onSave(measure.measureId, editValue.trim());
                if (e.key === "Escape") onCancel();
              },
              className: "h-8 text-sm bg-input border-primary/50 focus:border-primary text-foreground max-w-[200px]",
              maxLength: 51,
              "data-ocid": `target_measures.name_input.${index + 1}`
            }
          ),
          validationError && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-destructive flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" }),
            validationError
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-sm font-medium ${hasCustom ? "text-primary" : "text-foreground"}`,
              children: displayName
            }
          ),
          hasCustom && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium uppercase tracking-wide", children: "Custom" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `inline-flex items-center gap-1 text-xs px-2 py-1 rounded border font-medium ${badge.cls}`,
            children: badge.label
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              className: "h-7 px-2.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground",
              onClick: () => !validationError && onSave(measure.measureId, editValue.trim()),
              disabled: !!validationError || saving,
              "data-ocid": `target_measures.save_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3 h-3 mr-1" }),
                "Save"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              className: "h-7 px-2 text-xs text-muted-foreground hover:text-foreground",
              onClick: onCancel,
              disabled: saving,
              "data-ocid": `target_measures.cancel_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
            }
          )
        ] }) : canEdit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              className: "h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border",
              onClick: () => onEdit(measure.measureId),
              "data-ocid": `target_measures.edit_button.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3 h-3 mr-1" }),
                "Edit"
              ]
            }
          ),
          hasCustom && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors",
              onClick: () => onReset(measure.measureId),
              "data-ocid": `target_measures.reset_button.${index + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3" }),
                "Reset"
              ] })
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/40", children: "—" }) })
      ]
    }
  );
}
function TargetMeasuresPage() {
  const navigate = useNavigate();
  const { isPrimaryAdmin } = useApp();
  const { measureConfig, loading, updateMeasureName, refreshAll } = useTargets();
  const canEdit = isPrimaryAdmin();
  const [editingId, setEditingId] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const DEFAULT_MEASURES = [
    {
      measureId: "Measure1",
      defaultName: "Renewal Revenue",
      customName: null,
      calculationType: "Revenue"
    },
    {
      measureId: "Measure2",
      defaultName: "New Business Revenue",
      customName: null,
      calculationType: "Revenue"
    },
    {
      measureId: "Measure3",
      defaultName: "Pipeline Created",
      customName: null,
      calculationType: "Revenue"
    },
    {
      measureId: "Measure4",
      defaultName: "Deal Registrations Approved",
      customName: null,
      calculationType: "Count"
    },
    {
      measureId: "Measure5",
      defaultName: "Closed Won Revenue",
      customName: null,
      calculationType: "Revenue"
    }
  ];
  const measures = measureConfig ? DEFAULT_MEASURES.map((def) => {
    const found = measureConfig.measures.find(
      (m) => m.measureId === def.measureId
    );
    return found ?? def;
  }) : DEFAULT_MEASURES;
  const handleEdit = reactExports.useCallback((id) => {
    setEditingId(id);
  }, []);
  const handleCancel = reactExports.useCallback(() => {
    setEditingId(null);
  }, []);
  const handleSave = reactExports.useCallback(
    async (id, value) => {
      if (!value.trim()) return;
      setSaving(true);
      try {
        const ok = await updateMeasureName(id, value.trim());
        if (ok) {
          ue.success("Measure updated", {
            description: "Segment label saved successfully."
          });
          setEditingId(null);
          await refreshAll();
        } else {
          ue.error("Failed to update measure", {
            description: "Please try again."
          });
        }
      } finally {
        setSaving(false);
      }
    },
    [updateMeasureName, refreshAll]
  );
  const handleReset = reactExports.useCallback(
    async (id) => {
      const def = DEFAULT_MEASURES.find((m) => m.measureId === id);
      if (!def) return;
      setSaving(true);
      try {
        const ok = await updateMeasureName(id, def.defaultName);
        if (ok) {
          ue.success("Measure reset to default", {
            description: `"${def.defaultName}" restored.`
          });
          await refreshAll();
        } else {
          ue.error("Failed to reset measure");
        }
      } finally {
        setSaving(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateMeasureName, refreshAll]
  );
  const lastUpdatedText = (measureConfig == null ? void 0 : measureConfig.updatedAt) && measureConfig.updatedAt > BigInt(0) ? `Last updated by ${measureConfig.updatedBy || "Admin"} on ${formatDate(measureConfig.updatedAt)}` : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full bg-background", "data-ocid": "target_measures.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border bg-card px-6 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "nav",
        {
          className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-3",
          "aria-label": "Breadcrumb",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "hover:text-foreground transition-colors",
                onClick: () => navigate({ to: "/admin" }),
                "data-ocid": "target_measures.breadcrumb_admin",
                children: "Admin"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Target Measures" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-semibold text-foreground tracking-tight", children: "Target Segment Measures" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-xl", children: "Rename the five measures used to track performance across your channel. These labels appear on all dashboards, reports, and targets." }),
          lastUpdatedText && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1.5 font-mono", children: lastUpdatedText })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            className: "shrink-0 text-xs text-muted-foreground hover:text-foreground",
            onClick: refreshAll,
            "data-ocid": "target_measures.refresh_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-3.5 h-3.5 mr-1.5" }),
              "Refresh"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 space-y-5 max-w-5xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 rounded-md border border-border bg-card px-4 py-3.5 border-l-4",
          style: { borderLeftColor: "oklch(var(--primary))" },
          "data-ocid": "target_measures.info_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-primary mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
              "These labels are used across your",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "QTD Dashboard" }),
              ",",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "reports" }),
              ", and all",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "target assignments" }),
              ". Renaming a measure updates it everywhere immediately."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-md border border-border overflow-hidden",
          "data-ocid": "target_measures.table",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-secondary/60 border-b border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left w-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "#" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left w-28", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Slot" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Default Name" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Current Name" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left w-36", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Calc Type" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground", children: "Actions" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: loading ? ["s0", "s1", "s2", "s3", "s4"].map((sk, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, { index: i }, `skeleton-${sk}`)) : measures.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              MeasureRow,
              {
                measure: m,
                index: i,
                isEditing: editingId === m.measureId,
                canEdit,
                onEdit: handleEdit,
                onSave: handleSave,
                onCancel: handleCancel,
                onReset: handleReset,
                saving
              },
              m.measureId
            )) })
          ] })
        }
      ),
      !canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2.5 rounded border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground",
          "data-ocid": "target_measures.readonly_notice",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 shrink-0 text-muted-foreground/60" }),
            "Only the",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium mx-1", children: "Vendor Primary Admin" }),
            " ",
            "can rename measures."
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-xs text-muted-foreground/70",
          "data-ocid": "target_measures.audit_notice",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-3.5 h-3.5 shrink-0" }),
            "All measure renames are logged in the",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "underline underline-offset-2 hover:text-primary transition-colors",
                onClick: () => navigate({ to: "/admin" }),
                "data-ocid": "target_measures.audit_log_link",
                children: "Audit Log"
              }
            ),
            "."
          ]
        }
      )
    ] })
  ] });
}
export {
  TargetMeasuresPage
};
