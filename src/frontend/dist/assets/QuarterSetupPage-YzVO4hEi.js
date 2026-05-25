import { u as useApp, r as reactExports, af as formatDate, j as jsxRuntimeExports, m as Button, w as Settings, n as Clock, o as Badge, T as TriangleAlert, ar as Save, aN as Info, L as Lock, bw as Link, i as ChevronRight, ab as ue, J as CircleCheck, aF as Label, ad as Input } from "./index-DvFvlUBj.js";
import { u as useTargets } from "./useTargets-v1HbgFMi.js";
import { C as Calendar } from "./calendar-BzO3LGDM.js";
function validateQuarters(quarters) {
  const result = {};
  for (let i = 0; i < quarters.length; i++) {
    const q = quarters[i];
    const errors = [];
    const warnings = [];
    if (!q.name.trim()) errors.push({ type: "missing_field", field: "name" });
    if (!q.startDate)
      errors.push({ type: "missing_field", field: "start date" });
    if (!q.endDate) errors.push({ type: "missing_field", field: "end date" });
    if (q.startDate && q.endDate) {
      const start = new Date(q.startDate).getTime();
      const end = new Date(q.endDate).getTime();
      if (end < start) errors.push({ type: "end_before_start" });
      for (let j = 0; j < quarters.length; j++) {
        if (j === i) continue;
        const other = quarters[j];
        if (!other.startDate || !other.endDate) continue;
        const oStart = new Date(other.startDate).getTime();
        const oEnd = new Date(other.endDate).getTime();
        if (start <= oEnd && end >= oStart) {
          errors.push({
            type: "overlap",
            conflictWith: other.name || other.quarterId
          });
          break;
        }
      }
      if (i > 0) {
        const prev = quarters[i - 1];
        if (prev.endDate) {
          const prevEnd = new Date(prev.endDate).getTime();
          const gapDays = Math.round((start - prevEnd) / 864e5) - 1;
          if (gapDays > 0) {
            warnings.push({ type: "gap", gapDays });
          }
        }
      }
    }
    result[q.quarterId] = { errors, warnings };
  }
  return result;
}
function buildCalendarDefaults() {
  const y = (/* @__PURE__ */ new Date()).getFullYear();
  return [
    {
      quarterId: "Q1",
      name: `Q1 FY${y}`,
      startDate: `${y}-01-01`,
      endDate: `${y}-03-31`
    },
    {
      quarterId: "Q2",
      name: `Q2 FY${y}`,
      startDate: `${y}-04-01`,
      endDate: `${y}-06-30`
    },
    {
      quarterId: "Q3",
      name: `Q3 FY${y}`,
      startDate: `${y}-07-01`,
      endDate: `${y}-09-30`
    },
    {
      quarterId: "Q4",
      name: `Q4 FY${y}`,
      startDate: `${y}-10-01`,
      endDate: `${y}-12-31`
    }
  ];
}
function Breadcrumb() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-5",
      "aria-label": "breadcrumb",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "hover:text-foreground transition-colors", children: "Admin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Quarter Configuration" })
      ]
    }
  );
}
function FiscalTypeToggle({
  value,
  onChange,
  disabled
}) {
  const options = [
    {
      value: "CalendarYear",
      label: "Calendar Year",
      description: "Jan 1 – Dec 31 split into standard quarters"
    },
    {
      value: "CustomFiscal",
      label: "Custom Fiscal Year",
      description: "Define exact start and end dates per quarter"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
      role: "radiogroup",
      "aria-label": "Fiscal year type",
      children: options.map((opt) => {
        const active = value === opt.value;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "aria-pressed": active,
            disabled,
            onClick: () => onChange(opt.value),
            "data-ocid": `quarter_setup.fiscal_type_${opt.value.toLowerCase()}`,
            className: [
              "flex items-start gap-3 p-4 rounded-lg border text-left transition-all duration-150",
              active ? "border-primary bg-primary/10 ring-1 ring-primary/40" : "border-border bg-card hover:border-primary/30 hover:bg-secondary/40",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            ].join(" "),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: [
                    "mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                    active ? "border-primary" : "border-muted-foreground"
                  ].join(" "),
                  children: active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: `text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`,
                    children: opt.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-snug", children: opt.description })
              ] })
            ]
          },
          opt.value
        );
      })
    }
  );
}
function QuarterCard({
  quarter,
  validation,
  onChange,
  disabled,
  calendarMode
}) {
  const hasError = validation.errors.length > 0;
  const hasWarning = validation.warnings.length > 0;
  const borderClass = hasError ? "border-destructive ring-1 ring-destructive/40" : hasWarning ? "border-yellow-500/60 ring-1 ring-yellow-500/20" : "border-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `bg-card rounded-xl border p-5 flex flex-col gap-4 ${borderClass}`,
      "data-ocid": `quarter_setup.${quarter.quarterId.toLowerCase()}_card`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary/15 text-primary text-xs font-bold font-mono", children: quarter.quarterId }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground", children: [
              "Quarter ",
              quarter.quarterId.replace("Q", "")
            ] })
          ] }),
          hasError && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5" }),
            "Fix required"
          ] }),
          !hasError && hasWarning && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-yellow-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5" }),
            "Date gap"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: `${quarter.quarterId}-name`,
              className: "text-xs text-muted-foreground uppercase tracking-wider",
              children: "Quarter Label"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: `${quarter.quarterId}-name`,
              value: quarter.name,
              onChange: (e) => onChange({ ...quarter, name: e.target.value }),
              disabled,
              placeholder: `e.g. ${quarter.quarterId} FY2025`,
              className: "h-9 text-sm bg-input border-border focus:border-primary font-mono",
              "data-ocid": `quarter_setup.${quarter.quarterId.toLowerCase()}_name_input`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `${quarter.quarterId}-start`,
                className: "text-xs text-muted-foreground uppercase tracking-wider",
                children: "Start Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `${quarter.quarterId}-start`,
                type: "date",
                value: quarter.startDate,
                onChange: (e) => onChange({ ...quarter, startDate: e.target.value }),
                disabled: disabled || calendarMode,
                className: "h-9 text-sm bg-input border-border focus:border-primary",
                "data-ocid": `quarter_setup.${quarter.quarterId.toLowerCase()}_start_input`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `${quarter.quarterId}-end`,
                className: "text-xs text-muted-foreground uppercase tracking-wider",
                children: "End Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `${quarter.quarterId}-end`,
                type: "date",
                value: quarter.endDate,
                onChange: (e) => onChange({ ...quarter, endDate: e.target.value }),
                disabled: disabled || calendarMode,
                className: "h-9 text-sm bg-input border-border focus:border-primary",
                "data-ocid": `quarter_setup.${quarter.quarterId.toLowerCase()}_end_input`
              }
            )
          ] })
        ] }),
        validation.errors.map((err, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "flex items-center gap-1.5 text-xs text-destructive mt-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 flex-shrink-0" }),
              err.type === "end_before_start" && "End date cannot be before start date",
              err.type === "overlap" && `Date conflict with ${err.conflictWith}`,
              err.type === "missing_field" && `Missing required ${err.field}`
            ]
          },
          `error-${err.type}-${idx}`
        )),
        validation.warnings.map((warn, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            className: "flex items-center gap-1.5 text-xs text-yellow-400 mt-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5 flex-shrink-0" }),
              warn.type === "gap" && `${warn.gapDays} day gap before previous quarter`
            ]
          },
          `warning-${warn.type}-${idx}`
        )),
        calendarMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3.5 h-3.5" }),
          "Dates auto-set by Calendar Year mode"
        ] })
      ]
    }
  );
}
function PermissionDenied() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center gap-5 py-24 text-center",
      "data-ocid": "quarter_setup.permission_denied",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-8 h-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: "Access Restricted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-sm", children: "Quarter configuration is managed by your Vendor Primary Admin. Contact them to make changes." })
        ] })
      ]
    }
  );
}
function QuarterSetupPage() {
  const { userProfile, isPrimaryAdmin, hasPermission, refreshFiscalYear } = useApp();
  const { fiscalYearConfig, saveFiscalYearConfig } = useTargets();
  const canEdit = isPrimaryAdmin() || (userProfile == null ? void 0 : userProfile.role) === "VendorSecondaryAdmin" && hasPermission("ManageQuarterSetup");
  const [fiscalType, setFiscalType] = reactExports.useState("CalendarYear");
  const [quarters, setQuarters] = reactExports.useState(
    buildCalendarDefaults()
  );
  const [saving, setSaving] = reactExports.useState(false);
  const [dirty, setDirty] = reactExports.useState(false);
  const [initialized, setInitialized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (initialized) return;
    if (fiscalYearConfig && fiscalYearConfig.quarters.length === 4) {
      setFiscalType(fiscalYearConfig.fiscalYearType);
      setQuarters(
        fiscalYearConfig.quarters.map((q) => ({
          quarterId: q.quarterId,
          name: q.name,
          startDate: q.startDate,
          endDate: q.endDate
        }))
      );
      setInitialized(true);
    } else if (fiscalYearConfig !== void 0) {
      setInitialized(true);
    }
  }, [fiscalYearConfig, initialized]);
  const handleFiscalTypeChange = reactExports.useCallback((type) => {
    setFiscalType(type);
    if (type === "CalendarYear") {
      const defaults = buildCalendarDefaults();
      setQuarters(
        (prev) => prev.map((q, i) => ({
          ...q,
          startDate: defaults[i].startDate,
          endDate: defaults[i].endDate
        }))
      );
    }
    setDirty(true);
  }, []);
  const handleQuarterChange = reactExports.useCallback((updated) => {
    setQuarters(
      (prev) => prev.map((q) => q.quarterId === updated.quarterId ? updated : q)
    );
    setDirty(true);
  }, []);
  const validations = reactExports.useMemo(() => validateQuarters(quarters), [quarters]);
  const allValid = reactExports.useMemo(
    () => Object.values(validations).every(
      (v) => !v.errors.some(
        (e) => e.type === "end_before_start" || e.type === "overlap" || e.type === "missing_field"
      )
    ),
    [validations]
  );
  const totalWarnings = reactExports.useMemo(
    () => Object.values(validations).reduce((acc, v) => acc + v.warnings.length, 0),
    [validations]
  );
  async function handleSave() {
    if (!allValid || !dirty || saving) return;
    setSaving(true);
    try {
      const quarterDefs = quarters.map((q) => ({
        quarterId: q.quarterId,
        name: q.name.trim(),
        startDate: q.startDate,
        endDate: q.endDate
      }));
      const success = await saveFiscalYearConfig(fiscalType, quarterDefs);
      if (success) {
        await refreshFiscalYear();
        setDirty(false);
        ue.success("Quarter configuration saved", {
          description: "All reports and dashboards will now use these dates.",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-emerald-400" })
        });
      } else {
        ue.error("Failed to save configuration", {
          description: "Please try again or contact support."
        });
      }
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  }
  function handleSetupNow() {
    setQuarters(buildCalendarDefaults());
    setFiscalType("CalendarYear");
    setDirty(true);
    setInitialized(true);
  }
  const lastUpdatedMeta = reactExports.useMemo(() => {
    if (!fiscalYearConfig || fiscalYearConfig.updatedAt === BigInt(0))
      return null;
    return {
      by: fiscalYearConfig.updatedBy || "Unknown",
      at: formatDate(fiscalYearConfig.updatedAt)
    };
  }, [fiscalYearConfig]);
  if (!canEdit)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionDenied, {}) });
  if (!initialized) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumb, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center gap-6 py-24 text-center",
          "data-ocid": "quarter_setup.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-8 h-8 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: "No fiscal year configured yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Define your quarter dates so all reports and dashboards align to your vendor's fiscal calendar." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: handleSetupNow,
                className: "bg-primary text-primary-foreground hover:bg-primary/90",
                "data-ocid": "quarter_setup.setup_now_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4 mr-2" }),
                  "Set up fiscal year now"
                ]
              }
            )
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumb, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display tracking-tight", children: "Quarter Configuration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Define your fiscal year structure. All reports and dashboards use these dates." }),
        lastUpdatedMeta && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
          "Last updated by",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: lastUpdatedMeta.by }),
          " ",
          "on ",
          lastUpdatedMeta.at
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
        totalWarnings > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10 text-xs gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
              totalWarnings,
              " gap warning",
              totalWarnings > 1 ? "s" : ""
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            onClick: handleSave,
            disabled: !dirty || !allValid || saving,
            className: "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40",
            "data-ocid": "quarter_setup.save_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-1.5" }),
              saving ? "Saving…" : "Save Configuration"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-7", "data-ocid": "quarter_setup.fiscal_type_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Fiscal Year Structure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Calendar Year auto-fills standard quarter dates. Custom Fiscal lets you set any date range." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FiscalTypeToggle,
        {
          value: fiscalType,
          onChange: handleFiscalTypeChange,
          disabled: saving
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border mb-7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "quarter_setup.quarters_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Quarter Date Ranges" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: fiscalType === "CalendarYear" ? "Dates are locked to standard calendar quarters. Switch to Custom Fiscal to edit them." : "Set precise start and end dates for each quarter. Gaps between quarters will generate warnings." })
        ] }),
        !allValid && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5" }),
          "Fix errors to save"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: quarters.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuarterCard,
        {
          quarter: q,
          validation: validations[q.quarterId] ?? { errors: [], warnings: [] },
          onChange: handleQuarterChange,
          disabled: saving,
          calendarMode: fiscalType === "CalendarYear"
        },
        q.quarterId
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Quarter date changes take effect immediately across all reports, dashboards, and QTD calculations. Changes are logged in the admin audit trail. Only Vendor Primary Admins and permitted Secondary Admins can modify these settings." })
    ] })
  ] });
}
function Layout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children });
}
export {
  QuarterSetupPage
};
