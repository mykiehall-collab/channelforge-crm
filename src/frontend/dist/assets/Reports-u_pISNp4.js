import { c as createLucideIcon, aq as useAccessGovernance, r as reactExports, j as jsxRuntimeExports, L as Lock, X, H as Shield, m as Button, ai as ArrowLeft, ar as Save, A as ArrowRight, as as Check, a8 as Plus, k as ChevronDown, p as useActor, at as useForex, u as useApp, s as useFilterContext, b as ChartColumn, S as Search, U as Users, o as Badge, O as AccountStatus, P as DealStatus, a9 as Globe, V as FileText, au as Eye, av as PROVIDER_NAMES, aw as convertCurrency, e as TrendingUp, n as Clock, x as ChartNoAxesColumn, ax as CurrencySelector, G as RefreshCcw, ay as Layers, az as Copy, aA as getHistoricalRateVariance, aB as formatCurrencyAmount, af as formatDate, ae as accountStatusColor, ak as dealStatusLabel, al as dealStatusColor } from "./index-DvFvlUBj.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CJsIFtIC.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { S as Switch } from "./switch-7D4xT4MC.js";
import { S as ShieldOff } from "./shield-off-2d9YhE28.js";
import { S as Share2 } from "./share-2-BFP_6Fru.js";
import { G as GripVertical } from "./grip-vertical-CItGB637.js";
import { D as Download } from "./download-DVLbZ_Ir.js";
import { L as LockOpen } from "./lock-open-DZv958mu.js";
import { A as Activity } from "./activity-BzA2r-7b.js";
import { P as Pencil } from "./pencil-CSymqQ5s.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
import "./index-B1ifXNtV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M8 18v-2", key: "qcmpov" }],
  ["path", { d: "M12 18v-4", key: "q1q25u" }],
  ["path", { d: "M16 18v-6", key: "15y0np" }]
];
const FileChartColumnIncreasing = createLucideIcon("file-chart-column-increasing", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
      key: "gugj83"
    }
  ]
];
const Table2 = createLucideIcon("table-2", __iconNode);
const PRIMARY_ADMIN_FEATURES = /* @__PURE__ */ new Set([
  "pricing-governance",
  "cross-org-visibility",
  "infrastructure-analytics",
  "security-administration",
  "ai-governance",
  "enterprise-controls",
  "strategic-forecasting"
]);
const REASON_OPTIONS = [
  "Operational Need",
  "Business Requirement",
  "Project Requirement",
  "Role Expansion"
];
function RequestAccessModal({
  featureId,
  featureName,
  featureType,
  onClose
}) {
  const { submitRequest } = useAccessGovernance();
  const [reason, setReason] = reactExports.useState(REASON_OPTIONS[0]);
  const [justification, setJustification] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [fieldError, setFieldError] = reactExports.useState("");
  const overlayRef = reactExports.useRef(null);
  const isPrimary = PRIMARY_ADMIN_FEATURES.has(featureType);
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  const handleSubmit = () => {
    if (justification.trim().length < 20) {
      setFieldError(
        "Please provide a business justification of at least 20 characters."
      );
      return;
    }
    submitRequest(
      featureId,
      featureName,
      featureType,
      reason,
      justification.trim()
    );
    setSubmitted(true);
  };
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: overlayRef,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm",
      onClick: handleOverlayClick,
      "data-ocid": "request_access.dialog",
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      role: "presentation",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-[#0f1623] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden",
          "aria-labelledby": "request-access-title",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg flex items-center justify-center bg-orange-500/10 border border-orange-500/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16, className: "text-orange-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    id: "request-access-title",
                    className: "text-base font-bold text-foreground",
                    children: "Request Access"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: "Submit a request for governance review" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Close dialog",
                  onClick: onClose,
                  className: "w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors",
                  "data-ocid": "request_access.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 15 })
                }
              )
            ] }),
            submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-4 p-10 text-center",
                "data-ocid": "request_access.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full flex items-center justify-center bg-green-500/10 border border-green-500/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 22, className: "text-green-400" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-foreground", children: "Request Submitted" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed max-w-sm", children: "Your access request has been submitted for review. You will be notified once a decision has been made." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      className: "mt-2 px-6 py-2 rounded-lg text-sm font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-all",
                      "data-ocid": "request_access.done_button",
                      children: "Done"
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Requested Feature" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-foreground", children: featureName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${isPrimary ? "border-orange-500/30 bg-orange-500/8 text-orange-300" : "border-blue-500/25 bg-blue-500/8 text-blue-300"}`,
                  "data-ocid": "request_access.routing_info",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Shield,
                      {
                        size: 14,
                        className: `mt-0.5 flex-shrink-0 ${isPrimary ? "text-orange-400" : "text-blue-400"}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: isPrimary ? "Primary Admin Required" : "Secondary Admin Review" }),
                      " ",
                      "— This request will be reviewed by",
                      " ",
                      isPrimary ? "a Primary Admin" : "a Secondary Admin",
                      "."
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "access-reason",
                    className: "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5",
                    children: "Reason"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    id: "access-reason",
                    value: reason,
                    onChange: (e) => setReason(e.target.value),
                    className: "w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-foreground focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25",
                    "data-ocid": "request_access.reason_select",
                    children: REASON_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, className: "bg-[#1a1f2e]", children: opt }, opt))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "access-justification",
                    className: "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5",
                    children: [
                      "Business Justification",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 font-normal normal-case", children: "(required, min 20 chars)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "access-justification",
                    value: justification,
                    onChange: (e) => {
                      setJustification(e.target.value);
                      if (fieldError) setFieldError("");
                    },
                    rows: 4,
                    placeholder: "Describe your operational need and how this access supports your role or a specific project...",
                    className: "w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/25 resize-none",
                    "data-ocid": "request_access.justification_textarea"
                  }
                ),
                fieldError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "mt-1.5 text-xs text-red-400",
                    "data-ocid": "request_access.field_error",
                    children: fieldError
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Request Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.03] text-sm text-foreground flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Permanent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60 italic", children: "Temporary access coming soon" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-white/10 hover:border-white/20 hover:text-foreground transition-all",
                    "data-ocid": "request_access.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleSubmit,
                    className: "px-5 py-2 rounded-lg text-sm font-semibold bg-orange-500 text-white hover:bg-orange-400 transition-all shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_24px_rgba(249,115,22,0.45)]",
                    "data-ocid": "request_access.submit_button",
                    children: "Submit Request"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function AccessDenied({
  featureName,
  onRequestAccess,
  showRequestButton = true
}) {
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  function handleRequest() {
    if (onRequestAccess) {
      onRequestAccess();
    } else {
      setModalOpen(true);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 px-6 text-center bg-white/5 backdrop-blur border border-white/10 rounded-xl",
        "data-ocid": "access_denied.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-16 h-16 rounded-2xl flex items-center justify-center",
                style: {
                  background: "rgba(255,107,43,0.08)",
                  border: "1px solid rgba(255,107,43,0.25)",
                  boxShadow: "0 0 24px rgba(255,107,43,0.08)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 28, className: "text-orange-400" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center",
                style: {
                  background: "rgba(30,48,80,0.9)",
                  border: "1px solid rgba(255,107,43,0.3)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { size: 12, style: { color: "rgba(255,107,43,0.6)" } })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4",
              style: {
                background: "rgba(255,107,43,0.07)",
                border: "1px solid rgba(255,107,43,0.2)",
                color: "rgba(255,107,43,0.7)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 10 }),
                featureName
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-lg mb-2", children: "You do not currently have access to this operational area." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm max-w-sm leading-relaxed mb-8", children: "Access to this area is controlled by your organisation's admin. Submit a request if you require access." }),
          showRequestButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleRequest,
              "data-ocid": "access_denied.request_access.button",
              className: "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
              style: {
                background: "rgba(255,107,43,0.12)",
                border: "1px solid rgba(255,107,43,0.35)",
                color: "#FF6B2B"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = "rgba(255,107,43,0.2)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = "rgba(255,107,43,0.12)";
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 14 }),
                "Request Access"
              ]
            }
          )
        ]
      }
    ),
    modalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      RequestAccessModal,
      {
        featureId: (featureName == null ? void 0 : featureName.toLowerCase().replace(/\s+/g, "-")) || "feature",
        featureType: "module",
        featureName,
        onClose: () => setModalOpen(false)
      }
    )
  ] });
}
const DATA_SOURCES = [
  {
    id: "customer_accounts",
    label: "Customer Accounts",
    desc: "Account records, customer details, renewal dates and ownership.",
    icon: "🏢"
  },
  {
    id: "deal_registrations",
    label: "Deal Registrations",
    desc: "Partner deal registrations, approval status, estimated value.",
    icon: "📋"
  },
  {
    id: "opportunities",
    label: "Opportunities",
    desc: "Pipeline opportunities, stages, close dates and forecasts.",
    icon: "🎯"
  },
  {
    id: "renewals",
    label: "Renewals",
    desc: "Renewal tracking, risk scoring, expiry timelines.",
    icon: "🔄"
  },
  {
    id: "business_plans",
    label: "Business Plans",
    desc: "Partner business plans, milestones, activity status.",
    icon: "📊"
  },
  {
    id: "mdf_requests",
    label: "MDF Requests",
    desc: "Market development fund requests, spend, ROI tracking.",
    icon: "💰"
  },
  {
    id: "promotions",
    label: "Promotions",
    desc: "Active promotions, eligibility, redemption rates.",
    icon: "🏷️"
  },
  {
    id: "marketing_activities",
    label: "Marketing Activities",
    desc: "Campaigns, engagement metrics, asset performance.",
    icon: "📣"
  }
];
const SOURCE_COLUMNS = {
  customer_accounts: [
    "Account Name",
    "Customer ID",
    "Domain",
    "Reseller",
    "Distributor",
    "Vendor",
    "Renewal Date",
    "Contract Value",
    "Status",
    "Region",
    "Risk Level",
    "Last Activity",
    "Contacts",
    "Products"
  ],
  deal_registrations: [
    "Opportunity Name",
    "Account",
    "Reseller",
    "Vendor Owner",
    "Submitted Date",
    "Close Date",
    "Estimated Value",
    "Deal Stage",
    "Status",
    "Region",
    "Product",
    "Approver"
  ],
  opportunities: [
    "Opportunity Name",
    "Account",
    "Stage",
    "Close Date",
    "Amount",
    "Owner",
    "Probability",
    "Reseller",
    "Product",
    "Region",
    "Created Date",
    "Last Modified"
  ],
  renewals: [
    "Account Name",
    "Customer ID",
    "Renewal Date",
    "Days Until Renewal",
    "Estimated Value",
    "Risk Score",
    "Status",
    "Reseller",
    "Distributor",
    "Products",
    "Last Engagement"
  ],
  business_plans: [
    "Plan Name",
    "Partner",
    "Period",
    "Revenue Target",
    "Status",
    "Milestones",
    "Last Updated",
    "Owner"
  ],
  mdf_requests: [
    "Request ID",
    "Partner",
    "Campaign",
    "Requested Amount",
    "Approved Amount",
    "Spend",
    "Status",
    "Period",
    "ROI"
  ],
  promotions: [
    "Promotion Name",
    "Type",
    "Start Date",
    "End Date",
    "Eligibility",
    "Redemptions",
    "Revenue Impact",
    "Status"
  ],
  marketing_activities: [
    "Activity Name",
    "Type",
    "Campaign",
    "Date",
    "Engagement Rate",
    "Leads Generated",
    "Asset Downloads",
    "Region"
  ]
};
const FILTER_DEFS = [
  { type: "date_range", label: "Date Range", color: "border-accent/60" },
  {
    type: "entity",
    label: "Entity",
    color: "border-primary/60",
    options: ["Vendor", "Distributor", "Reseller"]
  },
  { type: "product", label: "Product / SKU", color: "border-chart-2/60" },
  {
    type: "renewal_status",
    label: "Renewal Status",
    color: "border-chart-3/60",
    options: ["Active", "Expiring Soon", "Expired", "At Risk"]
  },
  {
    type: "opportunity_status",
    label: "Opportunity Status",
    color: "border-chart-4/60",
    options: ["Open", "Won", "Lost", "Stalled"]
  },
  {
    type: "deal_reg_status",
    label: "Deal Reg Status",
    color: "border-accent/40",
    options: ["Pending", "Approved", "Rejected"]
  },
  {
    type: "risk_level",
    label: "Risk Level",
    color: "border-destructive/50",
    options: ["Low", "Medium", "High", "Critical"]
  }
];
const DATE_PRESETS = [
  "Today",
  "Last 7 Days",
  "This Month",
  "Last Quarter",
  "This Year",
  "Custom"
];
const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "IT",
  "BDR",
  "Sales Management",
  "Sales Operations",
  "Deal Desk",
  "Order Management",
  "Leadership",
  "Finance",
  "Admin"
];
function uid() {
  return Math.random().toString(36).slice(2, 9);
}
function StepIndicator({ step, total }) {
  const labels = ["Setup", "Columns", "Filters", "Preview", "Save"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0 mb-8 overflow-x-auto pb-1", children: labels.slice(0, total).map((label, i) => {
    const num = i + 1;
    const isActive = num === step;
    const isDone = num < step;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isDone ? "bg-accent text-accent-foreground" : isActive ? "bg-accent text-accent-foreground ring-2 ring-accent/40 ring-offset-1 ring-offset-card" : "bg-secondary/60 text-muted-foreground"}`,
            children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) : num
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`,
            children: label
          }
        )
      ] }),
      i < total - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-8 h-px mx-2 shrink-0 ${isDone ? "bg-accent/60" : "bg-border"}`
        }
      )
    ] }, label);
  }) });
}
function Step1Source({
  selected,
  reportName,
  description,
  onSelect,
  onNameChange,
  onDescChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: "Report Setup" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Name your report and choose a data source." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "text-xs font-medium text-muted-foreground block mb-1",
            htmlFor: "rb-name-step1",
            children: [
              "Report Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive-foreground", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "rb-name-step1",
            type: "text",
            className: "crm-input h-10 px-3 text-sm w-full max-w-lg",
            placeholder: "e.g. Q3 Renewal Risk Summary",
            value: reportName,
            onChange: (e) => onNameChange(e.target.value),
            "data-ocid": "report_builder.name_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "text-xs font-medium text-muted-foreground block mb-1",
            htmlFor: "rb-desc-step1",
            children: [
              "Description",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 text-[10px]", children: "(optional)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "rb-desc-step1",
            className: "crm-input px-3 py-2 text-sm w-full max-w-lg resize-none",
            rows: 2,
            placeholder: "Brief description of what this report shows...",
            value: description,
            onChange: (e) => onDescChange(e.target.value),
            "data-ocid": "report_builder.description_input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Data Source" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: DATA_SOURCES.map((src) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `report_builder.source.${src.id}`,
        onClick: () => onSelect(src.id),
        className: `text-left p-4 rounded-lg border transition-all ${selected === src.id ? "border-accent bg-accent/10 ring-1 ring-accent/40" : "border-border bg-secondary/20 hover:border-accent/40 hover:bg-secondary/40"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl leading-none mt-0.5", children: src.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm text-foreground", children: src.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: src.desc })
          ] }),
          selected === src.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" })
        ] })
      },
      src.id
    )) })
  ] });
}
function Step2Columns({
  dataSource,
  selected,
  onChange
}) {
  const allCols = SOURCE_COLUMNS[dataSource] ?? [];
  const dragIdx = reactExports.useRef(null);
  const dragOverIdx = reactExports.useRef(null);
  function toggle(col) {
    onChange(
      selected.includes(col) ? selected.filter((c) => c !== col) : [...selected, col]
    );
  }
  function handleDragStart(i) {
    dragIdx.current = i;
  }
  function handleDragEnter(i) {
    dragOverIdx.current = i;
  }
  function handleDragEnd() {
    if (dragIdx.current === null || dragOverIdx.current === null) return;
    const reordered = [...selected];
    const [moved] = reordered.splice(dragIdx.current, 1);
    reordered.splice(dragOverIdx.current, 0, moved);
    onChange(reordered);
    dragIdx.current = null;
    dragOverIdx.current = null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: "Select Columns" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Choose which fields appear in your report. Drag to reorder." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Available Columns" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-lg overflow-y-auto max-h-72 scrollbar-thin", children: allCols.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => toggle(col),
            className: `w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm border-b border-border/40 last:border-b-0 transition-colors ${selected.includes(col) ? "bg-accent/10 text-accent" : "text-foreground hover:bg-secondary/30"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected.includes(col) ? "border-accent bg-accent" : "border-border"}`,
                  children: selected.includes(col) && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-2.5 h-2.5 text-accent-foreground" })
                }
              ),
              col
            ]
          },
          col
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
          selected.length,
          " of ",
          allCols.length,
          " selected"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Column Order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-lg overflow-y-auto max-h-72 scrollbar-thin", children: selected.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-8 text-center text-xs text-muted-foreground", children: "Select columns from the left to add them here." }) : selected.map((col, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            draggable: true,
            onDragStart: () => handleDragStart(i),
            onDragEnter: () => handleDragEnter(i),
            onDragEnd: handleDragEnd,
            onDragOver: (e) => e.preventDefault(),
            className: "flex items-center gap-2 px-3 py-2.5 border-b border-border/40 last:border-b-0 bg-secondary/10 cursor-grab active:cursor-grabbing hover:bg-secondary/30 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground flex-1", children: col }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => toggle(col),
                  className: "text-muted-foreground hover:text-destructive-foreground transition-colors",
                  "aria-label": `Remove ${col}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                }
              )
            ]
          },
          col
        )) }),
        selected.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Drag rows to reorder columns." })
      ] })
    ] })
  ] });
}
function FilterChipEditor({
  chip,
  onUpdate,
  onRemove
}) {
  const def = FILTER_DEFS.find((f) => f.type === chip.type);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-lg border ${def.color} bg-secondary/20 mb-2 overflow-hidden transition-all`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: def.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onUpdate({ ...chip, expanded: !chip.expanded }),
              className: "ml-auto text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Toggle filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  className: `w-3.5 h-3.5 transition-transform ${chip.expanded ? "rotate-180" : ""}`
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onRemove,
              className: "text-muted-foreground hover:text-destructive-foreground transition-colors",
              "aria-label": "Remove filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        chip.expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-3 border-t border-border/40", children: [
          chip.type === "date_range" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mb-2", children: DATE_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onUpdate({
                  ...chip,
                  value: p === chip.value[0] ? [] : [p]
                }),
                className: `px-2 py-1 rounded text-xs transition-colors ${chip.value[0] === p ? "bg-accent text-accent-foreground" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"}`,
                children: p
              },
              p
            )) }),
            chip.value[0] === "Custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  className: "crm-input px-2 py-1 text-xs flex-1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs self-center", children: "to" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "date",
                  className: "crm-input px-2 py-1 text-xs flex-1"
                }
              )
            ] })
          ] }),
          chip.type === "product" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search products or SKUs...",
              className: "crm-input px-2 py-1.5 text-xs w-full"
            }
          ) }),
          def.options && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex flex-wrap gap-1", children: def.options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                const val = chip.value.includes(opt) ? chip.value.filter((v) => v !== opt) : [...chip.value, opt];
                onUpdate({ ...chip, value: val });
              },
              className: `px-2 py-1 rounded text-xs transition-colors ${chip.value.includes(opt) ? "bg-accent text-accent-foreground" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"}`,
              children: opt
            },
            opt
          )) })
        ] })
      ]
    }
  );
}
function Step3Filters({
  filters,
  onChange
}) {
  function addFilter(type) {
    const def = FILTER_DEFS.find((f) => f.type === type);
    const newChip = {
      id: uid(),
      type,
      label: def.label,
      value: [],
      expanded: true
    };
    onChange([...filters, newChip]);
  }
  function updateChip(id, updated) {
    onChange(filters.map((c) => c.id === id ? updated : c));
  }
  function removeChip(id) {
    onChange(filters.filter((c) => c.id !== id));
  }
  const activeTypes = new Set(filters.map((f) => f.type));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Add Filters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: FILTER_DEFS.map((def) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `report_builder.filter.add_${def.type}`,
          onClick: () => addFilter(def.type),
          className: `flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${activeTypes.has(def.type) ? `${def.color} bg-secondary/30 text-foreground` : "border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/30 hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 shrink-0" }),
            def.label,
            activeTypes.has(def.type) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full", children: filters.filter((f) => f.type === def.type).length })
          ]
        },
        def.type
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Active Filters" }),
      filters.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-border rounded-lg py-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "No filters added yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1", children: "Add filters from the left panel." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto max-h-72 scrollbar-thin pr-1", children: filters.map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FilterChipEditor,
        {
          chip,
          onUpdate: (updated) => updateChip(chip.id, updated),
          onRemove: () => removeChip(chip.id)
        },
        chip.id
      )) })
    ] })
  ] });
}
function Step4Save({
  name,
  description,
  shareLevel,
  sharedDepts,
  onNameChange,
  onDescChange,
  onShareChange,
  onDeptsChange
}) {
  function toggleDept(d) {
    onDeptsChange(
      sharedDepts.includes(d) ? sharedDepts.filter((x) => x !== d) : [...sharedDepts, d]
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: "Name & Save" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "Give your report a name and configure sharing settings." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "text-xs font-medium text-muted-foreground block mb-1",
            htmlFor: "rb-name",
            children: [
              "Report Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive-foreground", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "rb-name",
            type: "text",
            className: "crm-input h-10 px-3 text-sm w-full",
            placeholder: "e.g. Q3 Renewal Risk Summary",
            value: name,
            onChange: (e) => onNameChange(e.target.value),
            "data-ocid": "report_builder.name_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "text-xs font-medium text-muted-foreground block mb-1",
            htmlFor: "rb-desc",
            children: [
              "Description",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 text-[10px]", children: "(optional)" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "rb-desc",
            className: "crm-input px-3 py-2 text-sm w-full resize-none",
            rows: 3,
            placeholder: "Brief description of what this report shows...",
            value: description,
            onChange: (e) => onDescChange(e.target.value),
            "data-ocid": "report_builder.description_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground block mb-2", children: "Sharing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ["private", "internal", "shared"].map(
          (level) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `report_builder.share_${level}`,
              onClick: () => onShareChange(level),
              className: `p-3 rounded-lg border text-left transition-all ${shareLevel === level ? "border-accent bg-accent/10 ring-1 ring-accent/40" : "border-border bg-secondary/20 hover:border-accent/40"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-foreground capitalize mb-0.5", children: level === "private" ? "🔒 Private" : level === "internal" ? "🏢 Internal" : "🔗 Shared" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground leading-relaxed", children: [
                  level === "private" && "Only visible to you",
                  level === "internal" && "Visible to your organization",
                  level === "shared" && "Share with specific depts or users"
                ] })
              ]
            },
            level
          )
        ) })
      ] }),
      shareLevel === "shared" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: "Share with Departments" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => toggleDept(d),
            className: `px-2.5 py-1 rounded-full text-xs transition-colors ${sharedDepts.includes(d) ? "bg-accent text-accent-foreground" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"}`,
            children: d
          },
          d
        )) })
      ] })
    ] })
  ] });
}
const MOCK_ROW_DATA = {
  customer_accounts: [
    [
      "Meridian Technologies",
      "CUST-0042",
      "Active",
      "Apex Resellers",
      "EMEA",
      "87",
      "2026-09-15"
    ],
    [
      "Vertex Solutions",
      "CUST-0107",
      "At Risk",
      "Blue Star Dist.",
      "NOAM",
      "41",
      "2026-07-30"
    ],
    [
      "Quantum Dynamics",
      "CUST-0201",
      "Active",
      "Apex Resellers",
      "APAC",
      "92",
      "2026-11-01"
    ],
    [
      "Northgate Systems",
      "CUST-0088",
      "Expiring",
      "SkyBridge Ltd.",
      "EMEA",
      "63",
      "2026-06-20"
    ],
    [
      "Ironclad Corp",
      "CUST-0155",
      "Active",
      "Blue Star Dist.",
      "NOAM",
      "78",
      "2027-01-10"
    ]
  ],
  renewals: [
    [
      "Meridian Technologies",
      "CUST-0042",
      "2026-09-15",
      "47d",
      "£28,400",
      "Low",
      "Active"
    ],
    [
      "Vertex Solutions",
      "CUST-0107",
      "2026-07-30",
      "12d",
      "£14,200",
      "High",
      "At Risk"
    ],
    [
      "Quantum Dynamics",
      "CUST-0201",
      "2026-11-01",
      "105d",
      "£52,800",
      "Low",
      "Active"
    ],
    [
      "Northgate Systems",
      "CUST-0088",
      "2026-06-20",
      "2d",
      "£9,600",
      "Critical",
      "Expiring"
    ],
    [
      "Ironclad Corp",
      "CUST-0155",
      "2027-01-10",
      "180d",
      "£37,900",
      "Low",
      "Active"
    ]
  ],
  opportunities: [
    [
      "EMEA Expansion Deal",
      "Meridian Technologies",
      "Proposal",
      "2026-08-31",
      "£84,000",
      "Sarah Chen",
      "65%"
    ],
    [
      "Security Suite Renewal",
      "Vertex Solutions",
      "Negotiation",
      "2026-06-30",
      "£28,500",
      "Tom Harris",
      "85%"
    ],
    [
      "Cloud Migration Project",
      "Quantum Dynamics",
      "Qualification",
      "2026-10-15",
      "£120,000",
      "Lisa Park",
      "30%"
    ],
    [
      "Platform Upgrade",
      "Northgate Systems",
      "Proposal",
      "2026-07-20",
      "£45,000",
      "Mark Webb",
      "70%"
    ],
    [
      "Analytics Bundle",
      "Ironclad Corp",
      "Closed Won",
      "2026-05-01",
      "£22,000",
      "Sarah Chen",
      "100%"
    ]
  ],
  deal_registrations: [
    [
      "EMEA Expansion",
      "Meridian Tech",
      "Apex Resellers",
      "2026-05-01",
      "Pending",
      "£84,000"
    ],
    [
      "Security Renewal",
      "Vertex Solutions",
      "Blue Star Dist.",
      "2026-04-22",
      "Approved",
      "£28,500"
    ],
    [
      "Cloud Migration",
      "Quantum Dynamics",
      "SkyBridge Ltd.",
      "2026-05-10",
      "Pending",
      "£120,000"
    ]
  ],
  mdf_requests: [
    [
      "MDF-001",
      "Apex Resellers",
      "EMEA Roadshow Q2",
      "£12,000",
      "£10,000",
      "Pending",
      "Q2 2026",
      "—"
    ],
    [
      "MDF-002",
      "Blue Star Dist.",
      "Partner Summit",
      "£8,500",
      "£8,500",
      "Approved",
      "Q1 2026",
      "2.4x"
    ],
    [
      "MDF-003",
      "SkyBridge Ltd.",
      "Digital Campaign",
      "£5,000",
      "£0",
      "Rejected",
      "Q2 2026",
      "—"
    ]
  ],
  business_plans: [
    [
      "Apex Q2 Growth Plan",
      "Apex Resellers",
      "Q2 2026",
      "£240,000",
      "On Track",
      "3 / 5",
      "2026-05-15"
    ],
    [
      "Blue Star Annual",
      "Blue Star Dist.",
      "FY 2026",
      "£800,000",
      "Behind",
      "1 / 6",
      "2026-04-30"
    ]
  ],
  promotions: [
    [
      "Summer Surge",
      "Discount",
      "2026-06-01",
      "2026-08-31",
      "Silver+",
      "142",
      "£38,400",
      "Active"
    ],
    [
      "Q3 Accelerator",
      "Rebate",
      "2026-07-01",
      "2026-09-30",
      "Gold+",
      "0",
      "—",
      "Scheduled"
    ]
  ],
  marketing_activities: [
    [
      "EMEA Channel Summit",
      "Event",
      "Spring Enablement",
      "2026-05-14",
      "68%",
      "124",
      "340",
      "EMEA"
    ],
    [
      "Partner Enablement Webinar",
      "Webinar",
      "Q2 Enablement",
      "2026-04-28",
      "54%",
      "87",
      "210",
      "Global"
    ],
    [
      "Digital Prospecting Kit",
      "Content",
      "Pipeline Drive",
      "2026-05-02",
      "—",
      "—",
      "892",
      "NOAM"
    ]
  ]
};
function Step4Preview({
  dataSource,
  columns,
  reportName
}) {
  if (!dataSource) return null;
  const allRows = MOCK_ROW_DATA[dataSource] ?? [];
  const allCols = SOURCE_COLUMNS[dataSource] ?? [];
  const colIndices = columns.map((c) => allCols.indexOf(c));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: "Preview" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-5", children: [
      "Preview of",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: reportName || "your report" }),
      " ",
      "— showing sample data matching your selected columns."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto rounded-lg border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/40", children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap",
            children: col
          },
          col
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: allRows.slice(0, 5).map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "tr",
          {
            className: `border-b border-border/50 transition-colors hover:bg-secondary/20 ${i % 2 === 1 ? "bg-secondary/10" : ""}`,
            children: colIndices.map((colIdx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "px-4 py-2.5 text-foreground text-xs whitespace-nowrap",
                children: colIdx >= 0 ? row[colIdx] ?? "—" : "—"
              },
              `preview-col-${colIdx}`
            ))
          },
          `preview-row-${row.join("|")}`.slice(0, 60)
        )) })
      ] }),
      allRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground text-xs", children: "Sample data not available for this source." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-3", children: "Showing up to 5 sample rows. Actual results will vary based on your filters and live data." })
  ] });
}
function ReportBuilder({
  onSave,
  onClose,
  initial
}) {
  var _a;
  const TOTAL_STEPS = 5;
  const [step, setStep] = reactExports.useState(initial ? 5 : 1);
  const [dataSource, setDataSource] = reactExports.useState(
    (initial == null ? void 0 : initial.dataSource) ?? null
  );
  const [columns, setColumns] = reactExports.useState((initial == null ? void 0 : initial.columns) ?? []);
  const [filters, setFilters] = reactExports.useState((initial == null ? void 0 : initial.filters) ?? []);
  const [name, setName] = reactExports.useState((initial == null ? void 0 : initial.name) ?? "");
  const [description, setDescription] = reactExports.useState((initial == null ? void 0 : initial.description) ?? "");
  const [shareLevel, setShareLevel] = reactExports.useState(
    (initial == null ? void 0 : initial.shareLevel) ?? "private"
  );
  const [sharedDepts, setSharedDepts] = reactExports.useState(
    (initial == null ? void 0 : initial.sharedDepts) ?? []
  );
  function canProceed() {
    if (step === 1) return dataSource !== null && name.trim().length > 0;
    if (step === 2) return columns.length > 0;
    if (step === 5) return name.trim().length > 0;
    return true;
  }
  function handleSave() {
    if (!dataSource || !name.trim()) return;
    onSave({
      id: (initial == null ? void 0 : initial.id) ?? uid(),
      name: name.trim(),
      description,
      dataSource,
      columns,
      filters,
      shareLevel,
      sharedDepts,
      createdAt: (initial == null ? void 0 : initial.createdAt) ?? (/* @__PURE__ */ new Date()).toISOString(),
      owner: "You",
      lastRun: void 0
    });
  }
  const srcLabel = (_a = DATA_SOURCES.find((s) => s.id === dataSource)) == null ? void 0 : _a.label;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      "data-ocid": "report_builder.dialog",
      "aria-modal": "true",
      "aria-labelledby": "rb-title",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-background/80 backdrop-blur-sm",
            onClick: onClose,
            onKeyDown: (e) => {
              if (e.key === "Escape") onClose();
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-[92vw] max-w-4xl h-[88vh] crm-card flex flex-col overflow-hidden shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  id: "rb-title",
                  className: "text-base font-semibold text-foreground font-display",
                  children: initial ? "Edit Report" : "Custom Report Builder"
                }
              ),
              srcLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                "Data source:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: srcLabel })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "text-muted-foreground hover:text-foreground transition-colors p-1 rounded",
                "aria-label": "Close report builder",
                "data-ocid": "report_builder.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-5 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { step, total: TOTAL_STEPS }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-6 pb-4 scrollbar-thin", children: [
            step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Step1Source,
              {
                selected: dataSource,
                reportName: name,
                description,
                onSelect: (s) => {
                  setDataSource(s);
                  if (columns.length > 0 && dataSource !== s) setColumns([]);
                },
                onNameChange: setName,
                onDescChange: setDescription
              }
            ),
            step === 2 && dataSource && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Step2Columns,
              {
                dataSource,
                selected: columns,
                onChange: setColumns
              }
            ),
            step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step3Filters, { filters, onChange: setFilters }),
            step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Step4Preview,
              {
                dataSource,
                columns,
                reportName: name
              }
            ),
            step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Step4Save,
              {
                name,
                description,
                shareLevel,
                sharedDepts,
                onNameChange: setName,
                onDescChange: setDescription,
                onShareChange: setShareLevel,
                onDeptsChange: setSharedDepts
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border flex items-center justify-between shrink-0 bg-card/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: step === 1 ? onClose : () => setStep(step - 1),
                "data-ocid": "report_builder.back_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }),
                  step === 1 ? "Cancel" : "Back"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "Step ",
              step,
              " of ",
              TOTAL_STEPS
            ] }),
            step < TOTAL_STEPS ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: () => setStep(step + 1),
                disabled: !canProceed(),
                "data-ocid": "report_builder.next_button",
                className: "bg-accent hover:bg-accent/90 text-accent-foreground",
                children: step === 4 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-1" }),
                  " Review & Save"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  "Next ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-1" })
                ] })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    handleSave();
                  },
                  disabled: !canProceed(),
                  "data-ocid": "report_builder.save_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-1" }),
                    " Save Report"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  onClick: () => {
                    handleSave();
                  },
                  disabled: !canProceed(),
                  "data-ocid": "report_builder.save_run_button",
                  className: "bg-accent hover:bg-accent/90 text-accent-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-1" }),
                    " Save & Run"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function ShareModal({ report, onClose, onSave }) {
  const [level, setLevel] = reactExports.useState("view");
  const [depts, setDepts] = reactExports.useState(report.sharedDepts);
  function toggleDept(d) {
    setDepts(
      (prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      "data-ocid": "share_modal.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-background/80 backdrop-blur-sm",
            onClick: onClose,
            onKeyDown: (e) => {
              if (e.key === "Escape") onClose();
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 crm-card w-full max-w-md p-6 shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground font-display", children: "Share Report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "text-muted-foreground hover:text-foreground",
                "data-ocid": "share_modal.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: report.name }),
            " — select departments and permission level."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Permission Level" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["view", "view_export"].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setLevel(l),
                className: `p-2.5 rounded-lg border text-xs transition-all ${level === l ? "border-accent bg-accent/10" : "border-border bg-secondary/20 hover:border-accent/40"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: l === "view" ? "View Only" : "View & Export" })
              },
              l
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-muted-foreground", children: "Departments" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggleDept(d),
                className: `px-2.5 py-1 rounded-full text-xs transition-colors ${depts.includes(d) ? "bg-accent text-accent-foreground" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"}`,
                children: d
              },
              d
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: onClose,
                "data-ocid": "share_modal.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: () => {
                  onSave({ ...report, sharedDepts: depts, shareLevel: "shared" });
                  onClose();
                },
                className: "bg-accent hover:bg-accent/90 text-accent-foreground",
                "data-ocid": "share_modal.confirm_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-3.5 h-3.5 mr-1" }),
                  " Share Report"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const SOURCE_LABEL_MAP = {
  customer_accounts: "Customer Accounts",
  deal_registrations: "Deal Registrations",
  opportunities: "Opportunities",
  renewals: "Renewals",
  business_plans: "Business Plans",
  mdf_requests: "MDF Requests",
  promotions: "Promotions",
  marketing_activities: "Marketing Activities"
};
const PREBUILT_CATEGORIES = [
  {
    id: "accounts",
    label: "Account Reports",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3.5 h-3.5" }),
    items: [
      {
        id: "acc_status",
        category: "accounts",
        label: "Accounts by Status",
        description: "All customer accounts segmented by current status.",
        icon: null
      },
      {
        id: "acc_region",
        category: "accounts",
        label: "Accounts by Region",
        description: "Account distribution across regions and territories.",
        icon: null
      },
      {
        id: "acc_health",
        category: "accounts",
        label: "Account Health",
        description: "Health scores, risk levels, and engagement metrics.",
        icon: null
      }
    ]
  },
  {
    id: "renewals",
    label: "Renewal Reports",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-3.5 h-3.5" }),
    items: [
      {
        id: "ren_due",
        category: "renewals",
        label: "Renewals Due",
        description: "Contracts expiring within the next 90 days.",
        icon: null,
        type: "renewal"
      },
      {
        id: "ren_risk",
        category: "renewals",
        label: "At-Risk Renewals",
        description: "High-risk accounts with low engagement scores.",
        icon: null,
        type: "renewal"
      },
      {
        id: "ren_perf",
        category: "renewals",
        label: "Renewal Performance",
        description: "Renewal win rates and revenue impact by reseller.",
        icon: null,
        type: "renewal"
      }
    ]
  },
  {
    id: "pipeline",
    label: "Pipeline Reports",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3.5 h-3.5" }),
    items: [
      {
        id: "pip_opp",
        category: "pipeline",
        label: "Opportunity Pipeline",
        description: "All open opportunities by stage and close date.",
        icon: null,
        type: "pipeline"
      },
      {
        id: "pip_winloss",
        category: "pipeline",
        label: "Win/Loss Analysis",
        description: "Closed deals with win/loss breakdown and reasons.",
        icon: null,
        type: "pipeline"
      },
      {
        id: "pip_forecast",
        category: "pipeline",
        label: "Forecast",
        description: "Weighted forecast by quarter and distributor.",
        icon: null,
        type: "pipeline"
      }
    ]
  },
  {
    id: "partner",
    label: "Partner Reports",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
    items: [
      {
        id: "par_reseller",
        category: "partner",
        label: "Reseller Performance",
        description: "Revenue, pipeline, and activity by reseller.",
        icon: null,
        type: "dealreg"
      },
      {
        id: "par_dist",
        category: "partner",
        label: "Distributor Activity",
        description: "Distributor engagement, accounts managed, and MDF.",
        icon: null,
        type: "dealreg"
      },
      {
        id: "par_tier",
        category: "partner",
        label: "Partner Tiers",
        description: "Tier status and qualification progress by partner.",
        icon: null
      }
    ]
  },
  {
    id: "mdf",
    label: "MDF Reports",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { className: "w-3.5 h-3.5" }),
    items: [
      {
        id: "mdf_spend",
        category: "mdf",
        label: "MDF Spend",
        description: "Total MDF requested and approved by quarter.",
        icon: null
      },
      {
        id: "mdf_roi",
        category: "mdf",
        label: "MDF ROI",
        description: "Return on investment per MDF campaign.",
        icon: null
      },
      {
        id: "mdf_pending",
        category: "mdf",
        label: "Pending MDF",
        description: "Unresolved MDF requests awaiting approval.",
        icon: null
      }
    ]
  },
  {
    id: "activity",
    label: "Activity Reports",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-3.5 h-3.5" }),
    items: [
      {
        id: "act_user",
        category: "activity",
        label: "User Activity",
        description: "Login history, actions, and system activity by user.",
        icon: null
      },
      {
        id: "act_account",
        category: "activity",
        label: "Account Activity",
        description: "Notes, calls, emails, and meetings per account.",
        icon: null
      },
      {
        id: "act_audit",
        category: "activity",
        label: "Login Audit",
        description: "Authentication events and session history.",
        icon: null
      }
    ]
  }
];
const SAMPLE_MY_REPORTS = [
  {
    id: "r1",
    name: "Q3 Renewal Risk Summary",
    description: "High-risk renewals expiring within 90 days across all resellers.",
    dataSource: "renewals",
    columns: [
      "Account Name",
      "Renewal Date",
      "Risk Score",
      "Reseller",
      "Estimated Value"
    ],
    filters: [],
    shareLevel: "internal",
    sharedDepts: [],
    createdAt: "2026-04-10T09:00:00Z",
    owner: "You",
    lastRun: "2026-05-15T14:22:00Z"
  },
  {
    id: "r2",
    name: "Active Pipeline by Distributor",
    description: "Open opportunities segmented by distributor and deal stage.",
    dataSource: "opportunities",
    columns: [
      "Opportunity Name",
      "Stage",
      "Amount",
      "Distributor",
      "Close Date"
    ],
    filters: [],
    shareLevel: "private",
    sharedDepts: [],
    createdAt: "2026-03-22T11:30:00Z",
    owner: "You",
    lastRun: "2026-05-14T09:00:00Z"
  },
  {
    id: "r3",
    name: "Deal Registration Approval Status",
    description: "Pending and recently approved deal registrations by reseller.",
    dataSource: "deal_registrations",
    columns: [
      "Opportunity Name",
      "Reseller",
      "Submitted Date",
      "Status",
      "Estimated Value"
    ],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Deal Desk", "Sales Operations"],
    createdAt: "2026-02-18T08:45:00Z",
    owner: "You",
    lastRun: "2026-05-16T16:05:00Z"
  }
];
const SAMPLE_SHARED_REPORTS = [
  {
    id: "sr1",
    name: "Vendor Channel Health Overview",
    description: "Cross-vendor channel health scores and engagement metrics.",
    dataSource: "customer_accounts",
    columns: [
      "Account Name",
      "Status",
      "Risk Level",
      "Vendor",
      "Last Activity"
    ],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Leadership", "Sales"],
    createdAt: "2026-01-05T10:00:00Z",
    owner: "Sarah Mitchell",
    lastRun: "2026-05-17T08:00:00Z",
    sharedBy: "Sarah Mitchell",
    permLevel: "View Only",
    visibility: "Internal"
  },
  {
    id: "sr2",
    name: "MDF Spend & ROI Tracker",
    description: "Quarterly MDF spend, approved amounts, and ROI by partner.",
    dataSource: "mdf_requests",
    columns: [
      "Partner",
      "Campaign",
      "Requested Amount",
      "Approved Amount",
      "ROI",
      "Status"
    ],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Marketing", "Finance"],
    createdAt: "2026-04-01T12:00:00Z",
    owner: "James O'Brien",
    lastRun: "2026-05-10T11:30:00Z",
    sharedBy: "James O'Brien",
    permLevel: "View & Export",
    visibility: "Internal"
  }
];
const LINKED_ORGS = [
  { id: "org-adobe", name: "Adobe", type: "Vendor" },
  { id: "org-ingram", name: "Ingram Micro", type: "Distributor" },
  { id: "org-nordic", name: "Nordic Cloud Solutions", type: "Reseller" }
];
const INITIAL_DASHBOARDS = [
  {
    id: "dash-qtd",
    name: "QTD Performance",
    type: "Performance",
    orgConfigs: [
      { orgId: "org-adobe", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF"] },
      { orgId: "org-nordic", enabled: false, exportFormats: [] }
    ],
    filterScope: "Assigned accounts only",
    exportAllowed: true
  },
  {
    id: "dash-renewal",
    name: "Renewal Risk",
    type: "Risk",
    orgConfigs: [
      {
        orgId: "org-adobe",
        enabled: true,
        exportFormats: ["PDF", "CSV", "Excel"]
      },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-nordic", enabled: true, exportFormats: ["PDF"] }
    ],
    filterScope: "Assigned accounts only",
    exportAllowed: true
  },
  {
    id: "dash-pipeline",
    name: "Pipeline Overview",
    type: "Pipeline",
    orgConfigs: [
      { orgId: "org-adobe", enabled: false, exportFormats: [] },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-nordic", enabled: true, exportFormats: ["PDF"] }
    ],
    filterScope: "Downstream visibility",
    exportAllowed: true
  },
  {
    id: "dash-mdf",
    name: "MDF ROI",
    type: "MDF",
    orgConfigs: [
      {
        orgId: "org-adobe",
        enabled: true,
        exportFormats: ["PDF", "CSV", "Excel"]
      },
      {
        orgId: "org-ingram",
        enabled: true,
        exportFormats: ["PDF", "CSV", "Excel"]
      },
      { orgId: "org-nordic", enabled: false, exportFormats: [] }
    ],
    filterScope: "Campaign-level",
    exportAllowed: true
  },
  {
    id: "dash-deal",
    name: "Deal Registration Performance",
    type: "Deal Reg",
    orgConfigs: [
      { orgId: "org-adobe", enabled: true, exportFormats: ["PDF"] },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-nordic", enabled: true, exportFormats: ["PDF"] }
    ],
    filterScope: "Assigned accounts only",
    exportAllowed: true
  },
  {
    id: "dash-churn",
    name: "Churn/Save Performance",
    type: "Retention",
    orgConfigs: [
      { orgId: "org-adobe", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-ingram", enabled: false, exportFormats: [] },
      { orgId: "org-nordic", enabled: false, exportFormats: [] }
    ],
    filterScope: "Internal only",
    exportAllowed: false
  },
  {
    id: "dash-campaign",
    name: "Campaign Performance",
    type: "Marketing",
    orgConfigs: [
      {
        orgId: "org-adobe",
        enabled: true,
        exportFormats: ["PDF", "CSV", "Excel"]
      },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF", "CSV"] },
      { orgId: "org-nordic", enabled: true, exportFormats: ["PDF"] }
    ],
    filterScope: "Campaign-level",
    exportAllowed: true
  },
  {
    id: "dash-missed",
    name: "Missed Opportunity",
    type: "Opportunity",
    orgConfigs: [
      { orgId: "org-adobe", enabled: true, exportFormats: ["PDF"] },
      { orgId: "org-ingram", enabled: true, exportFormats: ["PDF"] },
      { orgId: "org-nordic", enabled: false, exportFormats: [] }
    ],
    filterScope: "Territory-scoped",
    exportAllowed: true
  }
];
const SAVED_REPORTS_FOR_SHARING = [
  {
    id: "shr1",
    name: "Q1 Renewal Pipeline",
    description: "Renewal pipeline summary for Q1.",
    dataSource: "renewals",
    columns: ["Account", "Renewal Date", "Value"],
    filters: [],
    shareLevel: "internal",
    sharedDepts: [],
    createdAt: "2026-01-10T09:00:00Z",
    owner: "You",
    lastRun: "2026-05-15T14:22:00Z",
    sharedExternally: true
  },
  {
    id: "shr2",
    name: "Partner Performance",
    description: "Reseller and distributor performance metrics.",
    dataSource: "customer_accounts",
    columns: ["Partner", "Revenue", "Accounts"],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Sales"],
    createdAt: "2026-02-12T10:00:00Z",
    owner: "You",
    lastRun: "2026-05-14T09:00:00Z",
    sharedExternally: false
  },
  {
    id: "shr3",
    name: "MDF ROI Analysis",
    description: "MDF spend and return analysis by campaign.",
    dataSource: "mdf_requests",
    columns: ["Campaign", "Spend", "ROI"],
    filters: [],
    shareLevel: "internal",
    sharedDepts: [],
    createdAt: "2026-03-05T11:30:00Z",
    owner: "You",
    lastRun: "2026-05-16T16:05:00Z",
    sharedExternally: true
  },
  {
    id: "shr4",
    name: "Deal Registration Summary",
    description: "Summary of all deal registrations this quarter.",
    dataSource: "deal_registrations",
    columns: ["Deal", "Reseller", "Status", "Value"],
    filters: [],
    shareLevel: "shared",
    sharedDepts: ["Deal Desk"],
    createdAt: "2026-04-01T08:45:00Z",
    owner: "You",
    lastRun: "2026-05-17T10:00:00Z",
    sharedExternally: false
  },
  {
    id: "shr5",
    name: "Territory Coverage",
    description: "Territory coverage and account distribution.",
    dataSource: "customer_accounts",
    columns: ["Territory", "Accounts", "Coverage %"],
    filters: [],
    shareLevel: "internal",
    sharedDepts: [],
    createdAt: "2026-04-20T09:15:00Z",
    owner: "You",
    lastRun: "2026-05-18T11:30:00Z",
    sharedExternally: true
  }
];
const AUDIT_EVENTS = [
  {
    id: "a1",
    who: "Sarah Mitchell",
    org: "Adobe",
    dashboard: "QTD Performance",
    action: "viewed",
    timestamp: "2026-05-22T09:30:00Z"
  },
  {
    id: "a2",
    who: "James O'Brien",
    org: "Ingram Micro",
    dashboard: "Renewal Risk",
    action: "exported",
    timestamp: "2026-05-22T08:45:00Z"
  },
  {
    id: "a3",
    who: "Lisa Chen",
    org: "Nordic Cloud Solutions",
    dashboard: "Pipeline Overview",
    action: "viewed",
    timestamp: "2026-05-21T16:20:00Z"
  },
  {
    id: "a4",
    who: "Sarah Mitchell",
    org: "Adobe",
    dashboard: "MDF ROI",
    action: "shared",
    timestamp: "2026-05-21T14:10:00Z"
  },
  {
    id: "a5",
    who: "James O'Brien",
    org: "Ingram Micro",
    dashboard: "Deal Registration Performance",
    action: "viewed",
    timestamp: "2026-05-21T11:00:00Z"
  },
  {
    id: "a6",
    who: "Lisa Chen",
    org: "Nordic Cloud Solutions",
    dashboard: "Campaign Performance",
    action: "exported",
    timestamp: "2026-05-20T15:30:00Z"
  },
  {
    id: "a7",
    who: "Sarah Mitchell",
    org: "Adobe",
    dashboard: "QTD Performance",
    action: "viewed",
    timestamp: "2026-05-20T10:15:00Z"
  },
  {
    id: "a8",
    who: "James O'Brien",
    org: "Ingram Micro",
    dashboard: "Renewal Risk",
    action: "viewed",
    timestamp: "2026-05-19T09:45:00Z"
  },
  {
    id: "a9",
    who: "Lisa Chen",
    org: "Nordic Cloud Solutions",
    dashboard: "Pipeline Overview",
    action: "revoked",
    timestamp: "2026-05-19T08:00:00Z"
  },
  {
    id: "a10",
    who: "Sarah Mitchell",
    org: "Adobe",
    dashboard: "Missed Opportunity",
    action: "viewed",
    timestamp: "2026-05-18T17:00:00Z"
  }
];
const REPORTS = [
  {
    id: "renewal",
    label: "Renewal Report",
    statusOptions: Object.values(AccountStatus)
  },
  {
    id: "pipeline",
    label: "Pipeline Report",
    statusOptions: Object.values(DealStatus)
  },
  {
    id: "dealreg",
    label: "Deal Registration Report",
    statusOptions: Object.values(DealStatus)
  }
];
function getSourceBadgeClass(source) {
  const map = {
    renewals: "bg-accent/20 text-accent",
    opportunities: "bg-chart-2/20 text-chart-2",
    deal_registrations: "bg-chart-3/20 text-chart-3",
    customer_accounts: "bg-primary/20 text-primary",
    mdf_requests: "bg-chart-4/20 text-chart-4",
    marketing_activities: "bg-secondary text-muted-foreground",
    business_plans: "bg-chart-2/10 text-chart-2",
    promotions: "bg-accent/10 text-accent"
  };
  return map[source] ?? "bg-secondary text-muted-foreground";
}
function daysUntil(ns) {
  const ms = Number(ns) / 1e6;
  return Math.ceil((ms - Date.now()) / 864e5);
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function isoToNs(iso) {
  return BigInt(new Date(iso).getTime()) * 1000000n;
}
function exportCSV(headers, rows, filename) {
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function exportPDF(title) {
  const style = document.createElement("style");
  style.id = "print-override";
  style.textContent = "@media print { body > *:not(#report-print-area) { display: none !important; } #report-print-area { display: block !important; } }";
  document.head.appendChild(style);
  const prev = document.title;
  document.title = title;
  window.print();
  document.title = prev;
  style.remove();
}
function buildRates(forex, currency, dateNs, fxMode) {
  if (fxMode === "live") return forex.rates;
  return {
    ...forex.rates,
    [currency]: getHistoricalRateVariance(currency, dateNs)
  };
}
function ReportCard({
  report,
  canExport = true,
  canShare = true,
  onRun,
  onEdit,
  onDuplicate,
  onExport,
  onShare
}) {
  const srcLabel = SOURCE_LABEL_MAP[report.dataSource] ?? report.dataSource;
  const lastRunDate = report.lastRun ? new Date(report.lastRun).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crm-card p-4 flex flex-col gap-3 hover:border-accent/40 transition-colors",
      "data-ocid": `reports.saved.item.${report.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground truncate", children: report.name }),
            report.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: report.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${getSourceBadgeClass(report.dataSource)}`,
              children: srcLabel
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-muted-foreground", children: [
          lastRunDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            " ",
            lastRunDate
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: report.shareLevel === "private" ? "🔒 Private" : report.shareLevel === "internal" ? "🏢 Internal" : `🔗 ${report.sharedDepts.slice(0, 2).join(", ")}${report.sharedDepts.length > 2 ? ` +${report.sharedDepts.length - 2}` : ""}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-auto pt-1 border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: onRun,
              className: "bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3",
              "data-ocid": `reports.saved.run.${report.id}`,
              children: "Run Report"
            }
          ),
          onEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              onClick: onEdit,
              className: "h-7 w-7 p-0",
              "aria-label": "Edit",
              "data-ocid": `reports.saved.edit.${report.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
            }
          ),
          onDuplicate && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              onClick: onDuplicate,
              className: "h-7 w-7 p-0",
              "aria-label": "Duplicate",
              "data-ocid": `reports.saved.duplicate.${report.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
            }
          ),
          canExport && onExport && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              onClick: onExport,
              className: "h-7 w-7 p-0",
              "aria-label": "Export",
              "data-ocid": `reports.saved.export.${report.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" })
            }
          ),
          canShare && onShare && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              onClick: onShare,
              className: "h-7 w-7 p-0",
              "aria-label": "Share",
              "data-ocid": `reports.saved.share.${report.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
function RecentReportsGrid({
  myReports,
  sharedReports,
  searchQuery,
  onRun,
  onEdit,
  onDuplicate,
  onShare
}) {
  const recentMy = myReports.filter(
    (r) => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4);
  const recentShared = sharedReports.filter(
    (r) => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 2);
  const hasResults = recentMy.length > 0 || recentShared.length > 0;
  if (!hasResults && searchQuery) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "reports.search.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-8 h-8 text-muted-foreground/30 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "No reports match",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
              '"',
              searchQuery,
              '"'
            ] })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-7", children: [
    recentMy.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "My Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1.5", children: recentMy.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3", children: recentMy.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReportCard,
        {
          report: r,
          canExport: true,
          canShare: true,
          onRun: () => onRun(r),
          onEdit: () => onEdit(r),
          onDuplicate: () => onDuplicate(r),
          onExport: () => exportCSV(r.columns, [], `${r.name}.csv`),
          onShare: () => onShare(r)
        },
        r.id
      )) })
    ] }),
    recentShared.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Shared with Me" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1.5", children: recentShared.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-3", children: recentShared.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "crm-card p-4 hover:border-accent/40 transition-colors",
          "data-ocid": `reports.shared.item.${r.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground truncate", children: r.name }),
                r.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: r.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${getSourceBadgeClass(r.dataSource)}`,
                  children: SOURCE_LABEL_MAP[r.dataSource] ?? r.dataSource
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Owner: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: r.owner })
              ] }),
              r.sharedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Shared by:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: r.sharedBy })
              ] }),
              r.permLevel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded bg-secondary/60", children: r.permLevel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                className: "bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3",
                "data-ocid": `reports.shared.run.${r.id}`,
                children: "Run Report"
              }
            )
          ]
        },
        r.id
      )) })
    ] }),
    !hasResults && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "reports.my_reports.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-10 h-10 text-muted-foreground/30 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "No reports yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create your first custom report to analyse your channel data." })
        ]
      }
    )
  ] });
}
function PrebuiltTemplatesPanel({
  onSelect
}) {
  const [expanded, setExpanded] = reactExports.useState(
    /* @__PURE__ */ new Set(["accounts", "renewals"])
  );
  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: PREBUILT_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => toggle(cat.id),
        className: "w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: cat.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-left", children: cat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              className: `w-3 h-3 transition-transform ${expanded.has(cat.id) ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    expanded.has(cat.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-4 pb-1", children: cat.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onSelect(item),
        className: "w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded transition-colors",
        "data-ocid": `reports.prebuilt.${item.id}`,
        children: item.label
      },
      item.id
    )) })
  ] }, cat.id)) });
}
function BarChartView({
  labels,
  values,
  currency
}) {
  const max = Math.max(...values, 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-4", children: labels.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-36 shrink-0 text-muted-foreground text-xs truncate text-right", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-secondary/30 rounded-full h-6 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full bg-accent/80 rounded-full flex items-center pl-2 transition-all",
        style: { width: `${Math.max(values[i] / max * 100, 2)}%` },
        children: values[i] > max * 0.15 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-accent-foreground font-mono", children: formatCurrencyAmount(values[i], currency) })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 shrink-0 text-right font-mono text-xs text-foreground", children: formatCurrencyAmount(values[i], currency) })
  ] }, label)) });
}
function ReportResultsView({
  reportLabel,
  reportType,
  data,
  forex,
  fxMode,
  loading,
  hasRun,
  onRun,
  startDate,
  endDate,
  partnerId,
  status,
  statusOptions,
  onStartDateChange,
  onEndDateChange,
  onPartnerIdChange,
  onStatusChange,
  onFxModeChange,
  incumbentDistributor,
  onIncumbentDistributorChange,
  incumbentReseller,
  onIncumbentResellerChange,
  vendorAlignment,
  onVendorAlignmentChange,
  servicingOwner,
  onServicingOwnerChange,
  territory,
  onTerritoryChange
}) {
  const [resultView, setResultView] = reactExports.useState("table");
  const [statusOpen, setStatusOpen] = reactExports.useState(false);
  const lastUpdatedStr = forex.lastUpdated ? forex.lastUpdated.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  }) : "—";
  const providerShort = (PROVIDER_NAMES[forex.forexConfig.primaryProvider] ?? forex.forexConfig.primaryProvider).split(" ").slice(0, 3).join(" ");
  const chartData = reactExports.useMemo(() => {
    if (!data || data.length === 0) return { labels: [], values: [] };
    if (reportType === "renewal") {
      const accs = data;
      return {
        labels: accs.slice(0, 8).map((a) => a.accountName),
        values: accs.slice(0, 8).map(
          (a) => convertCurrency(
            a.estimatedRenewalValue,
            "USD",
            forex.displayCurrency,
            buildRates(forex, forex.displayCurrency, a.renewalDate, fxMode)
          )
        )
      };
    }
    const deals = data;
    return {
      labels: deals.slice(0, 8).map((d) => d.opportunityName),
      values: deals.slice(0, 8).map(
        (d) => convertCurrency(
          d.estimatedValue,
          "USD",
          forex.displayCurrency,
          buildRates(forex, forex.displayCurrency, d.closeDate, fxMode)
        )
      )
    };
  }, [data, reportType, forex, fxMode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border bg-card flex items-start justify-between shrink-0 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground font-display", children: reportLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-mono text-muted-foreground", children: [
            "Rates: ",
            providerShort
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-[11px]", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-mono text-muted-foreground", children: lastUpdatedStr }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-[11px]", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-mono font-semibold text-accent", children: forex.displayCurrency }),
          fxMode === "historical" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground font-mono", children: "HIST. FX" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        hasRun && data && data.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-lg border border-border overflow-hidden h-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setResultView("table"),
              className: `px-3 text-xs font-medium transition-colors flex items-center gap-1.5 ${resultView === "table" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
              "data-ocid": "reports.view_table_toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Table2, { className: "w-3.5 h-3.5" }),
                " Table"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setResultView("chart"),
              className: `px-3 text-xs font-medium border-l border-border transition-colors flex items-center gap-1.5 ${resultView === "chart" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
              "data-ocid": "reports.view_chart_toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-3.5 h-3.5" }),
                " Chart"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencySelector, { forex, compact: false })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-6 py-3 border-b border-border bg-card/60 shrink-0",
        "data-ocid": "reports.filter_bar",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "reports-start-date",
                className: "text-xs text-muted-foreground",
                children: "Start Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "reports-start-date",
                type: "date",
                className: "crm-input h-9 px-3 text-sm",
                value: startDate,
                onChange: (e) => onStartDateChange(e.target.value),
                "data-ocid": "reports.start_date_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "reports-end-date",
                className: "text-xs text-muted-foreground",
                children: "End Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "reports-end-date",
                type: "date",
                className: "crm-input h-9 px-3 text-sm",
                value: endDate,
                onChange: (e) => onEndDateChange(e.target.value),
                "data-ocid": "reports.end_date_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "reports-partner-id",
                className: "text-xs text-muted-foreground",
                children: "Reseller ID"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "reports-partner-id",
                type: "text",
                className: "crm-input h-9 px-3 text-sm w-40",
                placeholder: "Any reseller",
                value: partnerId,
                onChange: (e) => onPartnerIdChange(e.target.value),
                "data-ocid": "reports.partner_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "crm-input h-9 px-3 text-sm w-44 flex items-center justify-between gap-2",
                onClick: () => setStatusOpen((v) => !v),
                "data-ocid": "reports.status_select",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: status ? "text-foreground" : "text-muted-foreground",
                      children: status || "Any status"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" })
                ]
              }
            ),
            statusOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full mt-1 left-0 z-20 crm-card w-44 py-1 shadow-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "w-full text-left px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30",
                  onClick: () => {
                    onStatusChange("");
                    setStatusOpen(false);
                  },
                  children: "Any status"
                }
              ),
              statusOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: `w-full text-left px-3 py-1.5 text-sm hover:bg-secondary/30 ${status === s ? "text-accent font-medium" : "text-foreground"}`,
                  onClick: () => {
                    onStatusChange(s);
                    setStatusOpen(false);
                  },
                  children: s
                },
                s
              ))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "FX Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex rounded-lg border border-border overflow-hidden h-9",
                "data-ocid": "reports.fx_mode_toggle",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "reports.fx_mode_live",
                      onClick: () => onFxModeChange("live"),
                      className: `px-3 text-xs font-mono font-semibold transition-colors ${fxMode === "live" ? "bg-accent text-accent-foreground" : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
                      children: "Live FX"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "reports.fx_mode_historical",
                      onClick: () => onFxModeChange("historical"),
                      className: `px-3 text-xs font-mono font-semibold border-l border-border transition-colors ${fxMode === "historical" ? "bg-accent text-accent-foreground" : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
                      children: "Historical"
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-incumbent-distributor",
                className: "text-xs text-muted-foreground whitespace-nowrap",
                children: "Incumbent Distributor"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "filter-incumbent-distributor",
                type: "text",
                value: incumbentDistributor,
                onChange: (e) => onIncumbentDistributorChange(e.target.value),
                placeholder: "Filter by distributor...",
                className: "bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-incumbent-reseller",
                className: "text-xs text-muted-foreground whitespace-nowrap",
                children: "Incumbent Reseller"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "filter-incumbent-reseller",
                type: "text",
                value: incumbentReseller,
                onChange: (e) => onIncumbentResellerChange(e.target.value),
                placeholder: "Filter by reseller...",
                className: "bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-vendor-alignment",
                className: "text-xs text-muted-foreground whitespace-nowrap",
                children: "Vendor Alignment"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "filter-vendor-alignment",
                type: "text",
                value: vendorAlignment,
                onChange: (e) => onVendorAlignmentChange(e.target.value),
                placeholder: "Filter by vendor...",
                className: "bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-servicing-owner",
                className: "text-xs text-muted-foreground whitespace-nowrap",
                children: "Servicing Owner"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "filter-servicing-owner",
                type: "text",
                value: servicingOwner,
                onChange: (e) => onServicingOwnerChange(e.target.value),
                placeholder: "Filter by owner...",
                className: "bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "filter-territory",
                className: "text-xs text-muted-foreground whitespace-nowrap",
                children: "Territory"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "filter-territory",
                type: "text",
                value: territory,
                onChange: (e) => onTerritoryChange(e.target.value),
                placeholder: "Filter by territory...",
                className: "bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground placeholder-muted-foreground w-40"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => exportPDF(reportLabel),
                className: "h-9 text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 mr-1" }),
                  " PDF"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: onRun,
                disabled: loading,
                "data-ocid": "reports.run_report_button",
                className: "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-9",
                children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "w-3.5 h-3.5 mr-1.5 animate-spin" }),
                  " ",
                  "Running..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-3.5 h-3.5 mr-1.5" }),
                  " Run Report"
                ] })
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-6", children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "reports.loading_state", className: "space-y-2", children: ["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded" }, k)) }),
      !loading && !hasRun && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "crm-card flex flex-col items-center justify-center py-20 text-center",
          "data-ocid": "reports.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-10 h-10 text-muted-foreground mb-4 opacity-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              "Set your filters and click",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Run Report" }),
              " to see results."
            ] })
          ]
        }
      ),
      !loading && hasRun && data !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fade-in", children: [
        resultView === "chart" && data.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          BarChartView,
          {
            labels: chartData.labels,
            values: chartData.values,
            currency: forex.displayCurrency
          }
        ),
        (resultView === "table" || data.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          reportType === "renewal" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            RenewalTable,
            {
              data,
              forex,
              fxMode
            }
          ),
          reportType === "pipeline" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            PipelineTable,
            {
              data,
              forex,
              fxMode
            }
          ),
          reportType === "dealreg" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            DealRegTable,
            {
              data,
              forex,
              fxMode
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function RenewalTable({ data, forex, fxMode }) {
  const sorted = reactExports.useMemo(
    () => [...data].sort((a, b) => Number(a.renewalDate - b.renewalDate)),
    [data]
  );
  const convertVal = (amount, dateNs) => convertCurrency(
    amount,
    "USD",
    forex.displayCurrency,
    buildRates(forex, forex.displayCurrency, dateNs, fxMode)
  );
  const totalValue = sorted.reduce(
    (s, a) => s + convertVal(a.estimatedRenewalValue, a.renewalDate),
    0
  );
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const csvRows = sorted.map((a) => {
    const converted = convertVal(a.estimatedRenewalValue, a.renewalDate);
    const rates = buildRates(
      forex,
      forex.displayCurrency,
      a.renewalDate,
      fxMode
    );
    const rate = rates[forex.displayCurrency] ?? 1;
    return [
      a.accountName,
      a.customerDomain,
      a.resellerOwnerId,
      formatDate(a.renewalDate),
      String(a.estimatedRenewalValue),
      "USD",
      formatCurrencyAmount(converted, forex.displayCurrency),
      forex.displayCurrency,
      String(rate.toFixed(6)),
      forex.forexConfig.primaryProvider,
      now,
      a.status,
      String(daysUntil(a.renewalDate))
    ];
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          sorted.length,
          " accounts"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Total Est. Value:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold font-mono", children: formatCurrencyAmount(totalValue, forex.displayCurrency) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          "data-ocid": "reports.export_excel_button",
          onClick: () => exportCSV(
            [
              "Account Name",
              "Customer Domain",
              "Reseller Owner",
              "Renewal Date",
              "Original Value",
              "Original Currency",
              "Converted Value",
              "Converted Currency",
              "FX Rate",
              "FX Provider",
              "Conversion Timestamp",
              "Status",
              "Days Until Renewal"
            ],
            csvRows,
            "renewal-report.xlsx"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5 mr-1" }),
            " Export CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto rounded-[0.5rem] border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", id: "report-print-area", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/40", children: [
          "Account Name",
          "Customer Domain",
          "Reseller Owner",
          "Renewal Date",
          `Est. Value (${forex.displayCurrency})`,
          "Status",
          "Days Until Renewal"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((a, i) => {
          const days = daysUntil(a.renewalDate);
          const daysColor = days <= 30 ? "text-destructive" : days <= 90 ? "text-yellow-400" : "text-emerald-400";
          const converted = convertVal(
            a.estimatedRenewalValue,
            a.renewalDate
          );
          const isBtc = forex.displayCurrency === "BTC";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `reports.renewal.item.${i + 1}`,
              className: `border-b border-border/50 transition-colors hover:bg-secondary/20 ${i % 2 === 1 ? "bg-secondary/10" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: a.accountName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: a.customerDomain }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: a.resellerOwnerId || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: formatDate(a.renewalDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: formatCurrencyAmount(converted, forex.displayCurrency) }),
                  isBtc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                    "≈ ",
                    formatCurrencyAmount(a.estimatedRenewalValue, "USD")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: accountStatusColor(a.status), children: a.status }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-4 py-2.5 font-semibold ${daysColor}`, children: days > 0 ? `${days}d` : `${Math.abs(days)}d overdue` })
              ]
            },
            a.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border bg-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 4,
              className: "px-4 py-2.5 text-xs text-muted-foreground font-medium",
              children: [
                "Summary — ",
                sorted.length,
                " accounts"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-semibold text-foreground font-mono", children: formatCurrencyAmount(totalValue, forex.displayCurrency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 2 })
        ] }) })
      ] }),
      sorted.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-12 text-muted-foreground",
          "data-ocid": "reports.renewal.empty_state",
          children: "No accounts match the selected filters."
        }
      )
    ] })
  ] });
}
function PipelineTable({ data, forex, fxMode }) {
  const sorted = reactExports.useMemo(
    () => [...data].sort((a, b) => Number(a.closeDate - b.closeDate)),
    [data]
  );
  const convertVal = (amount, dateNs) => convertCurrency(
    amount,
    "USD",
    forex.displayCurrency,
    buildRates(forex, forex.displayCurrency, dateNs, fxMode)
  );
  const totalValue = sorted.reduce(
    (s, d) => s + convertVal(d.estimatedValue, d.closeDate),
    0
  );
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const csvRows = sorted.map((d) => {
    const converted = convertVal(d.estimatedValue, d.closeDate);
    const rates = buildRates(forex, forex.displayCurrency, d.closeDate, fxMode);
    const rate = rates[forex.displayCurrency] ?? 1;
    return [
      d.opportunityName,
      d.accountId,
      d.resellerId,
      d.vendorOwnerId,
      String(d.estimatedValue),
      "USD",
      formatCurrencyAmount(converted, forex.displayCurrency),
      forex.displayCurrency,
      String(rate.toFixed(6)),
      forex.forexConfig.primaryProvider,
      now,
      formatDate(d.closeDate),
      d.dealStage,
      dealStatusLabel(d.status)
    ];
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          sorted.length,
          " deals"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Total Pipeline:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold font-mono", children: formatCurrencyAmount(totalValue, forex.displayCurrency) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          "data-ocid": "reports.export_excel_button",
          onClick: () => exportCSV(
            [
              "Opportunity",
              "Account",
              "Reseller",
              "Vendor Owner",
              "Original Value",
              "Original Currency",
              "Converted Value",
              "Converted Currency",
              "FX Rate",
              "FX Provider",
              "Conversion Timestamp",
              "Close Date",
              "Deal Stage",
              "Status"
            ],
            csvRows,
            "pipeline-report.xlsx"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5 mr-1" }),
            " Export CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto rounded-[0.5rem] border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", id: "report-print-area", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/40", children: [
          "Opportunity Name",
          "Account",
          "Reseller",
          "Vendor Owner",
          `Est. Value (${forex.displayCurrency})`,
          "Close Date",
          "Deal Stage",
          "Status"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((d, i) => {
          const converted = convertVal(d.estimatedValue, d.closeDate);
          const isBtc = forex.displayCurrency === "BTC";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `reports.pipeline.item.${i + 1}`,
              className: `border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 1 ? "bg-secondary/10" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: d.opportunityName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: d.accountId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: d.resellerId || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: d.vendorOwnerId || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: formatCurrencyAmount(converted, forex.displayCurrency) }),
                  isBtc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                    "≈ ",
                    formatCurrencyAmount(d.estimatedValue, "USD")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: formatDate(d.closeDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: d.dealStage || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: dealStatusColor(d.status), children: dealStatusLabel(d.status) }) })
              ]
            },
            d.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border bg-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 4,
              className: "px-4 py-2.5 text-xs text-muted-foreground font-medium",
              children: [
                "Summary — ",
                sorted.length,
                " deals"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-semibold text-foreground font-mono", children: formatCurrencyAmount(totalValue, forex.displayCurrency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3 })
        ] }) })
      ] }),
      sorted.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-12 text-muted-foreground",
          "data-ocid": "reports.pipeline.empty_state",
          children: "No deals match the selected filters."
        }
      )
    ] })
  ] });
}
function DealRegTable({ data, forex, fxMode }) {
  const sorted = reactExports.useMemo(
    () => [...data].sort(
      (a, b) => Number((b.submittedDate ?? 0n) - (a.submittedDate ?? 0n))
    ),
    [data]
  );
  const convertVal = (amount, dateNs) => convertCurrency(
    amount,
    "USD",
    forex.displayCurrency,
    buildRates(forex, forex.displayCurrency, dateNs, fxMode)
  );
  const totalValue = sorted.reduce(
    (s, d) => s + convertVal(d.estimatedValue, d.closeDate),
    0
  );
  const statusCounts = reactExports.useMemo(() => {
    const map = {};
    for (const d of sorted) map[d.status] = (map[d.status] ?? 0) + 1;
    return map;
  }, [sorted]);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const csvRows = sorted.map((d) => {
    const converted = convertVal(d.estimatedValue, d.closeDate);
    const rates = buildRates(forex, forex.displayCurrency, d.closeDate, fxMode);
    const rate = rates[forex.displayCurrency] ?? 1;
    return [
      d.opportunityName,
      d.accountId,
      d.resellerId,
      d.submittedBy,
      d.submittedDate ? formatDate(d.submittedDate) : "—",
      formatDate(d.closeDate),
      dealStatusLabel(d.status),
      d.vendorOwnerId || "—",
      String(d.estimatedValue),
      "USD",
      formatCurrencyAmount(converted, forex.displayCurrency),
      forex.displayCurrency,
      String(rate.toFixed(6)),
      forex.forexConfig.primaryProvider,
      now
    ];
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          sorted.length,
          " registrations"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Total:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold font-mono", children: formatCurrencyAmount(totalValue, forex.displayCurrency) })
        ] }),
        Object.entries(statusCounts).map(([s, n]) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: dealStatusColor(s), children: [
          dealStatusLabel(s),
          ": ",
          n
        ] }) }, s))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          "data-ocid": "reports.export_excel_button",
          onClick: () => exportCSV(
            [
              "Opportunity",
              "Account",
              "Reseller",
              "Submitted By",
              "Submitted Date",
              "Close Date",
              "Status",
              "Approver",
              "Original Value",
              "Original Currency",
              "Converted Value",
              "Converted Currency",
              "FX Rate",
              "FX Provider",
              "Conversion Timestamp"
            ],
            csvRows,
            "deal-reg-report.xlsx"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5 mr-1" }),
            " Export CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto rounded-[0.5rem] border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", id: "report-print-area", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/40", children: [
          "Opportunity",
          "Account",
          "Reseller",
          "Submitted By",
          "Submitted Date",
          "Close Date",
          "Status",
          `Value (${forex.displayCurrency})`,
          "Approver"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((d, i) => {
          const converted = convertVal(d.estimatedValue, d.closeDate);
          const isBtc = forex.displayCurrency === "BTC";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `reports.dealreg.item.${i + 1}`,
              className: `border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 1 ? "bg-secondary/10" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: d.opportunityName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: d.accountId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: d.resellerId || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: d.submittedBy || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: d.submittedDate ? formatDate(d.submittedDate) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: formatDate(d.closeDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: dealStatusColor(d.status), children: dealStatusLabel(d.status) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-right font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: formatCurrencyAmount(converted, forex.displayCurrency) }),
                  isBtc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                    "≈ ",
                    formatCurrencyAmount(d.estimatedValue, "USD")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground", children: d.vendorOwnerId || "—" })
              ]
            },
            d.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border bg-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 6,
              className: "px-4 py-2.5 text-xs text-muted-foreground font-medium",
              children: [
                "Summary — ",
                sorted.length,
                " registrations"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-semibold text-foreground font-mono", children: formatCurrencyAmount(totalValue, forex.displayCurrency) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", {})
        ] }) })
      ] }),
      sorted.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "text-center py-12 text-muted-foreground",
          "data-ocid": "reports.dealreg.empty_state",
          children: "No registrations match the selected filters."
        }
      )
    ] })
  ] });
}
function SharedDashboardsPanel({
  dashboards,
  setDashboards
}) {
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [shareModalOpen, setShareModalOpen] = reactExports.useState(false);
  function toggleOrg(dashId, orgId) {
    setDashboards(
      (prev) => prev.map(
        (d) => d.id === dashId ? {
          ...d,
          orgConfigs: d.orgConfigs.map(
            (oc) => oc.orgId === orgId ? { ...oc, enabled: !oc.enabled } : oc
          )
        } : d
      )
    );
  }
  function toggleExportFormat(dashId, orgId, fmt) {
    setDashboards(
      (prev) => prev.map(
        (d) => d.id === dashId ? {
          ...d,
          orgConfigs: d.orgConfigs.map(
            (oc) => oc.orgId === orgId ? {
              ...oc,
              exportFormats: oc.exportFormats.includes(fmt) ? oc.exportFormats.filter((f) => f !== fmt) : [...oc.exportFormats, fmt]
            } : oc
          )
        } : d
      )
    );
  }
  function sharedOrgNames(d) {
    return d.orgConfigs.filter((oc) => oc.enabled).map(
      (oc) => {
        var _a;
        return ((_a = LINKED_ORGS.find((o) => o.id === oc.orgId)) == null ? void 0 : _a.name) ?? oc.orgId;
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground font-display", children: "Shared Dashboards & Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 max-w-xl", children: "Control which linked organisations can access your operational intelligence." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: () => setShareModalOpen(true),
          className: "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold",
          "data-ocid": "shared_dashboards.share_new_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4 mr-1.5" }),
            " Share Dashboard"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "crm-card p-4 border-l-4 border-accent bg-accent/5",
        "data-ocid": "shared_dashboards.scope_banner",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-accent shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Permission-Scoped Sharing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: "Dashboards and reports shared with linked organisations are dynamically filtered to show only data within their approved access scope. A Reseller sees only their assigned territory. A Distributor sees downstream Reseller performance only." })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Dashboard Sharing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1.5", children: dashboards.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-[0.5rem] border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/40", children: [
          "Dashboard Name",
          "Type",
          "Shared With",
          "Filter Scope",
          "Export Allowed",
          "Actions"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: dashboards.map((d, i) => {
          const shared = sharedOrgNames(d);
          const isExpanded = expandedId === d.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                "data-ocid": `shared_dashboards.item.${i + 1}`,
                className: "border-b border-border/50 hover:bg-secondary/20 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground", children: d.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary", children: d.type }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: shared.length > 0 ? shared.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-[10px] h-5 px-1.5",
                      children: name
                    },
                    name
                  )) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground italic", children: "Not shared" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-muted-foreground", children: d.filterScope }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: d.exportAllowed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-emerald-400", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "w-3 h-3" }),
                    " Yes"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-destructive", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }),
                    " No"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "outline",
                      className: "h-7 text-xs",
                      onClick: () => setExpandedId(isExpanded ? null : d.id),
                      "data-ocid": `shared_dashboards.manage_access.${d.id}`,
                      children: isExpanded ? "Close" : "Manage Access"
                    }
                  ) })
                ]
              },
              d.id
            ),
            isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-3 bg-secondary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Linked Organisation Access" }),
              LINKED_ORGS.map((org) => {
                const cfg = d.orgConfigs.find(
                  (oc) => oc.orgId === org.id
                );
                const enabled = (cfg == null ? void 0 : cfg.enabled) ?? false;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center justify-between gap-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: org.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "secondary",
                            className: "text-[10px] h-4 px-1",
                            children: org.type
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: ["PDF", "CSV", "Excel"].map(
                          (fmt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "label",
                            {
                              className: `flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border cursor-pointer transition-colors ${enabled && (cfg == null ? void 0 : cfg.exportFormats.includes(fmt)) ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground"}`,
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "input",
                                  {
                                    type: "checkbox",
                                    className: "sr-only",
                                    checked: enabled && (cfg == null ? void 0 : cfg.exportFormats.includes(fmt)),
                                    onChange: () => toggleExportFormat(
                                      d.id,
                                      org.id,
                                      fmt
                                    )
                                  }
                                ),
                                fmt
                              ]
                            },
                            fmt
                          )
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Switch,
                          {
                            checked: enabled,
                            onCheckedChange: () => toggleOrg(d.id, org.id),
                            "data-ocid": `shared_dashboards.toggle.${d.id}.${org.id}`
                          }
                        )
                      ] })
                    ]
                  },
                  org.id
                );
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "Data filtered to viewer's assigned accounts" })
            ] }) }) })
          ] });
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Report Sharing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1.5", children: SAVED_REPORTS_FOR_SHARING.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-3", children: SAVED_REPORTS_FOR_SHARING.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "crm-card p-4 hover:border-accent/40 transition-colors",
          "data-ocid": `shared_dashboards.report.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground truncate", children: r.name }),
                r.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: r.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${getSourceBadgeClass(r.dataSource)}`,
                  children: SOURCE_LABEL_MAP[r.dataSource] ?? r.dataSource
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: r.sharedExternally ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] h-5 px-1.5 text-emerald-400 border-emerald-400/30",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 mr-1" }),
                  " Shared"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] h-5 px-1.5 text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 mr-1" }),
                  " Private"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  className: "bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3",
                  "data-ocid": `shared_dashboards.report.share.${r.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-3.5 h-3.5 mr-1" }),
                    " Share"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "h-7 w-7 p-0",
                  "aria-label": "Export",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" })
                }
              )
            ] })
          ]
        },
        r.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Access Audit Trail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1.5", children: "Last 10 events" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-[0.5rem] border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/40", children: ["Who", "Organisation", "Dashboard", "Action", "When"].map(
          (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide",
              children: h
            },
            h
          )
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: AUDIT_EVENTS.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `shared_dashboards.audit.item.${i + 1}`,
            className: "border-b border-border/50 hover:bg-secondary/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground text-xs", children: e.who }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-muted-foreground", children: e.org }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-foreground", children: e.dashboard }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${e.action === "viewed" ? "bg-primary/10 text-primary" : e.action === "exported" ? "bg-accent/10 text-accent" : e.action === "shared" ? "bg-emerald-400/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`,
                  children: [
                    e.action === "viewed" && /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                    e.action === "exported" && /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                    e.action === "shared" && /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-3 h-3" }),
                    e.action === "revoked" && /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
                    e.action
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-[11px] text-muted-foreground font-mono", children: new Date(e.timestamp).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
              }) })
            ]
          },
          e.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShareDashboardModal,
      {
        open: shareModalOpen,
        onClose: () => setShareModalOpen(false),
        onShare: (newDash) => setDashboards((prev) => [
          ...prev,
          { ...newDash, id: `dash-${Date.now()}` }
        ])
      }
    )
  ] });
}
function ShareDashboardModal({
  open,
  onClose,
  onShare
}) {
  const [title, setTitle] = reactExports.useState("");
  const [selectedType, setSelectedType] = reactExports.useState("");
  const [selectedOrgs, setSelectedOrgs] = reactExports.useState(/* @__PURE__ */ new Set());
  const [exportFormats, setExportFormats] = reactExports.useState({ PDF: true, CSV: false, Excel: false });
  const [notes, setNotes] = reactExports.useState("");
  const DASHBOARD_TYPES = [
    "QTD Performance",
    "Renewal Risk",
    "Pipeline Overview",
    "MDF ROI",
    "Deal Registration Performance",
    "Churn/Save Performance",
    "Campaign Performance",
    "Missed Opportunity"
  ];
  function toggleOrg(orgId) {
    setSelectedOrgs((prev) => {
      const next = new Set(prev);
      next.has(orgId) ? next.delete(orgId) : next.add(orgId);
      return next;
    });
  }
  function handleShare() {
    if (!title.trim() || !selectedType) return;
    const fmts = ["PDF", "CSV", "Excel"].filter(
      (f) => exportFormats[f]
    );
    onShare({
      name: title.trim(),
      type: selectedType,
      orgConfigs: LINKED_ORGS.map((o) => ({
        orgId: o.id,
        enabled: selectedOrgs.has(o.id),
        exportFormats: selectedOrgs.has(o.id) ? fmts : []
      })),
      filterScope: "Assigned accounts only",
      exportAllowed: fmts.length > 0
    });
    setTitle("");
    setSelectedType("");
    setSelectedOrgs(/* @__PURE__ */ new Set());
    setExportFormats({ PDF: true, CSV: false, Excel: false });
    setNotes("");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg bg-card border-border text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-semibold font-display", children: "Share Dashboard" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "dash-title",
            className: "text-xs font-medium text-muted-foreground",
            children: "Dashboard Title"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: "dash-title",
            type: "text",
            className: "crm-input h-9 px-3 text-sm w-full",
            placeholder: "e.g. Q3 Partner Performance",
            value: title,
            onChange: (e) => setTitle(e.target.value),
            "data-ocid": "shared_dashboards.modal.title_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "dash-type",
            className: "text-xs font-medium text-muted-foreground",
            children: "Dashboard Type"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "dash-type", className: "grid grid-cols-2 gap-2", children: DASHBOARD_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSelectedType(t),
            className: `text-left px-3 py-2 rounded-md border text-xs transition-colors ${selectedType === t ? "border-accent bg-accent/10 text-accent font-medium" : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
            "data-ocid": `shared_dashboards.modal.type.${t}`,
            children: t
          },
          t
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "share-with",
            className: "text-xs font-medium text-muted-foreground",
            children: "Share With"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "share-with", className: "space-y-2", children: LINKED_ORGS.map((org) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "flex items-center gap-2 cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedOrgs.has(org.id) ? "bg-accent border-accent" : "border-border"}`,
                  children: selectedOrgs.has(org.id) && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 text-accent-foreground" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only",
                  checked: selectedOrgs.has(org.id),
                  onChange: () => toggleOrg(org.id),
                  "data-ocid": `shared_dashboards.modal.org.${org.id}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: org.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1", children: org.type })
            ]
          },
          org.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "export-perms",
            className: "text-xs font-medium text-muted-foreground",
            children: "Export Permissions"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "export-perms", className: "flex gap-3", children: ["PDF", "CSV", "Excel"].map((fmt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: `flex items-center gap-1 text-xs px-2 py-1 rounded border cursor-pointer transition-colors ${exportFormats[fmt] ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  className: "sr-only",
                  checked: exportFormats[fmt],
                  onChange: () => setExportFormats((prev) => ({
                    ...prev,
                    [fmt]: !prev[fmt]
                  }))
                }
              ),
              fmt
            ]
          },
          fmt
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "dash-notes",
            className: "text-xs font-medium text-muted-foreground",
            children: "Notes"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            id: "dash-notes",
            className: "crm-input px-3 py-2 text-sm w-full min-h-[60px] resize-none",
            placeholder: "Optional notes for recipients...",
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            "data-ocid": "shared_dashboards.modal.notes_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: onClose,
            "data-ocid": "shared_dashboards.modal.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            onClick: handleShare,
            disabled: !title.trim() || !selectedType,
            className: "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold",
            "data-ocid": "shared_dashboards.modal.confirm_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-3.5 h-3.5 mr-1" }),
              " Share Dashboard"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function Reports() {
  const { actor } = useActor();
  const forex = useForex();
  const { isPrimaryAdmin } = useApp();
  const [viewMode, setViewMode] = reactExports.useState("library");
  const [sidebarSection, setSidebarSection] = reactExports.useState("library");
  const [activeReport, setActiveReport] = reactExports.useState("renewal");
  const [startDate, setStartDate] = reactExports.useState("");
  const [endDate, setEndDate] = reactExports.useState(todayISO());
  const [partnerId, setPartnerId] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [fxMode, setFxMode] = reactExports.useState("live");
  const [incumbentDistributor, setIncumbentDistributor] = reactExports.useState("");
  const [incumbentReseller, setIncumbentReseller] = reactExports.useState("");
  const [vendorAlignment, setVendorAlignment] = reactExports.useState("");
  const [servicingOwner, setServicingOwner] = reactExports.useState("");
  const [territory, setTerritory] = reactExports.useState("");
  const [activePrebuiltLabel, setActivePrebuiltLabel] = reactExports.useState("");
  const [renewalData, setRenewalData] = reactExports.useState(null);
  const [pipelineData, setPipelineData] = reactExports.useState(
    null
  );
  const [dealRegData, setDealRegData] = reactExports.useState(
    null
  );
  const [loading, setLoading] = reactExports.useState(false);
  const [hasRun, setHasRun] = reactExports.useState(false);
  const [builderOpen, setBuilderOpen] = reactExports.useState(false);
  const [editingReport, setEditingReport] = reactExports.useState(
    void 0
  );
  const [shareTarget, setShareTarget] = reactExports.useState(
    void 0
  );
  const [myReports, setMyReports] = reactExports.useState(SAMPLE_MY_REPORTS);
  const sharedReports = SAMPLE_SHARED_REPORTS;
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [sharedDashboards, setSharedDashboards] = reactExports.useState(INITIAL_DASHBOARDS);
  const currentMeta = REPORTS.find(
    (r) => r.id === activeReport && r.id !== "custom"
  );
  function buildFilters() {
    const f = {};
    if (startDate) f.startDate = isoToNs(startDate);
    if (endDate) f.endDate = isoToNs(endDate);
    if (partnerId.trim()) f.resellerId = partnerId.trim();
    if (status) f.status = status;
    if (incumbentDistributor.trim())
      f.incumbentDistributor = incumbentDistributor.trim();
    if (incumbentReseller.trim())
      f.incumbentReseller = incumbentReseller.trim();
    if (vendorAlignment.trim())
      f.vendorAlignment = vendorAlignment.trim();
    if (servicingOwner.trim())
      f.servicingOwner = servicingOwner.trim();
    if (territory.trim()) f.territory = territory.trim();
    return f;
  }
  async function runReport() {
    if (!actor) return;
    setLoading(true);
    setHasRun(true);
    const filters = buildFilters();
    try {
      if (activeReport === "renewal")
        setRenewalData(await actor.getRenewalReport(filters));
      else if (activeReport === "pipeline")
        setPipelineData(await actor.getPipelineReport(filters));
      else setDealRegData(await actor.getDealRegistrationReport(filters));
    } finally {
      setLoading(false);
    }
  }
  function selectBuiltIn(type, label) {
    setActiveReport(type);
    setStatus("");
    setHasRun(false);
    setViewMode("run");
    if (label) setActivePrebuiltLabel(label);
  }
  function handleSaveReport(report) {
    if (editingReport) {
      setMyReports(
        (prev) => prev.map((r) => r.id === report.id ? report : r)
      );
    } else {
      setMyReports((prev) => [report, ...prev]);
    }
    setBuilderOpen(false);
    setEditingReport(void 0);
    setViewMode("library");
  }
  function handleDuplicate(r) {
    const copy = {
      ...r,
      id: Math.random().toString(36).slice(2, 9),
      name: `${r.name} (Copy)`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastRun: void 0
    };
    setMyReports((prev) => [copy, ...prev]);
  }
  function handleShare(r) {
    setShareTarget(r);
  }
  function handleShareSave(r) {
    setMyReports((prev) => prev.map((x) => x.id === r.id ? r : x));
    setShareTarget(void 0);
  }
  const currentData = activeReport === "renewal" ? renewalData : activeReport === "pipeline" ? pipelineData : dealRegData;
  const reportLabel = activePrebuiltLabel || (currentMeta == null ? void 0 : currentMeta.label) || "Report";
  useFilterContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: "w-64 shrink-0 crm-sidebar border-r border-border flex flex-col",
        "data-ocid": "reports.sidebar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Reports" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: () => {
                  setEditingReport(void 0);
                  setBuilderOpen(true);
                },
                className: "w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold",
                "data-ocid": "reports.create_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1.5" }),
                  " New Report"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "Search reports...",
                className: "crm-input h-8 pl-7 pr-2 text-xs w-full",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                "data-ocid": "reports.sidebar.search_input"
              }
            ),
            searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setSearchQuery(""),
                className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                "aria-label": "Clear search",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-2 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest", children: "My Reports" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "reports.library.tab",
                onClick: () => {
                  setSidebarSection("library");
                  setViewMode("library");
                },
                className: `w-full text-left px-4 py-2 text-xs transition-colors ${sidebarSection === "library" && viewMode === "library" ? "text-accent font-semibold bg-accent/10 border-r-2 border-accent" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
                children: [
                  "All My Reports",
                  myReports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10px] bg-secondary/60 rounded-full px-1.5 py-0.5", children: myReports.length })
                ]
              }
            ),
            myReports.slice(0, 3).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `reports.sidebar.my.${r.id}`,
                onClick: () => {
                  setSidebarSection("library");
                  setViewMode("library");
                },
                className: "w-full text-left px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-colors truncate",
                children: r.name
              },
              r.id
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest", children: "Shared with Me" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "reports.shared.tab",
                onClick: () => {
                  setSidebarSection("shared");
                  setViewMode("library");
                },
                className: `w-full text-left px-4 py-2 text-xs transition-colors ${sidebarSection === "shared" && viewMode === "library" ? "text-accent font-semibold bg-accent/10 border-r-2 border-accent" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
                children: [
                  "Shared Reports",
                  sharedReports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10px] bg-secondary/60 rounded-full px-1.5 py-0.5", children: sharedReports.length })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest", children: "External Sharing" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "reports.shared_dashboards.tab",
                onClick: () => {
                  setSidebarSection("shared_dashboards");
                  setViewMode("library");
                },
                className: `w-full text-left px-4 py-2 text-xs transition-colors ${sidebarSection === "shared_dashboards" && viewMode === "library" ? "text-accent font-semibold bg-accent/10 border-r-2 border-accent" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
                children: [
                  "Shared Dashboards",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10px] bg-secondary/60 rounded-full px-1.5 py-0.5", children: sharedDashboards.length })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest", children: "Pre-built" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PrebuiltTemplatesPanel,
              {
                onSelect: (tmpl) => {
                  setSidebarSection("prebuilt");
                  if (tmpl.type) {
                    selectBuiltIn(tmpl.type, tmpl.label);
                  } else {
                    setActivePrebuiltLabel(tmpl.label);
                    setViewMode("library");
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest", children: "Run Reports" }) }),
            REPORTS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `reports.${r.id}.tab`,
                onClick: () => selectBuiltIn(r.id),
                className: `w-full text-left px-4 py-2 text-xs transition-colors ${viewMode === "run" && activeReport === r.id ? "text-accent font-semibold bg-accent/10 border-r-2 border-accent" : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"}`,
                children: r.label
              },
              r.id
            ))
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col overflow-hidden", children: viewMode === "library" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border bg-card flex items-center justify-between shrink-0 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground font-display", children: sidebarSection === "shared" ? "Shared with Me" : sidebarSection === "prebuilt" ? "Pre-built Reports" : "Report Library" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Create, manage, and run your channel reports." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            onClick: () => {
              setEditingReport(void 0);
              setBuilderOpen(true);
            },
            className: "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold",
            "data-ocid": "reports.create_button_header",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
              " Create Report"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-6", children: sidebarSection === "shared_dashboards" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        SharedDashboardsPanel,
        {
          dashboards: sharedDashboards,
          setDashboards: setSharedDashboards
        }
      ) : sidebarSection === "shared" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Shared with Me" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "text-[10px] h-4 px-1.5",
              children: sharedReports.length
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-3", children: sharedReports.map((r) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "crm-card p-4 hover:border-accent/40 transition-colors",
              "data-ocid": `reports.shared.card.${r.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground truncate", children: r.name }),
                    r.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: r.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${getSourceBadgeClass(r.dataSource)}`,
                      children: SOURCE_LABEL_MAP[r.dataSource] ?? r.dataSource
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Owner:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: r.owner })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Shared by:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: r.sharedBy })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded bg-secondary/60", children: r.permLevel }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded bg-secondary/60", children: r.visibility })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      className: "bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7 px-3",
                      "data-ocid": `reports.shared.run.${r.id}`,
                      children: "Run Report"
                    }
                  ),
                  ((_a = r.permLevel) == null ? void 0 : _a.includes("Export")) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "ghost",
                      className: "h-7 w-7 p-0",
                      "aria-label": "Export",
                      "data-ocid": `reports.shared.export.${r.id}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] })
              ]
            },
            r.id
          );
        }) })
      ] }) : sidebarSection === "prebuilt" && !isPrimaryAdmin() ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccessDenied,
        {
          featureName: "Advanced Report Templates",
          showRequestButton: true
        }
      ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecentReportsGrid,
        {
          myReports,
          sharedReports,
          searchQuery,
          onRun: (_r) => {
          },
          onEdit: (r) => {
            setEditingReport(r);
            setBuilderOpen(true);
          },
          onDuplicate: handleDuplicate,
          onShare: handleShare
        }
      ) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReportResultsView,
      {
        reportLabel,
        reportType: activeReport,
        data: currentData,
        forex,
        fxMode,
        loading,
        hasRun,
        onRun: runReport,
        startDate,
        endDate,
        partnerId,
        status,
        statusOptions: (currentMeta == null ? void 0 : currentMeta.statusOptions) ?? [],
        onStartDateChange: setStartDate,
        onEndDateChange: setEndDate,
        onPartnerIdChange: setPartnerId,
        onStatusChange: setStatus,
        onFxModeChange: setFxMode,
        incumbentDistributor,
        onIncumbentDistributorChange: setIncumbentDistributor,
        incumbentReseller,
        onIncumbentResellerChange: setIncumbentReseller,
        vendorAlignment,
        onVendorAlignmentChange: setVendorAlignment,
        servicingOwner,
        onServicingOwnerChange: setServicingOwner,
        territory,
        onTerritoryChange: setTerritory
      }
    ) }),
    builderOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReportBuilder,
      {
        initial: editingReport,
        onSave: handleSaveReport,
        onClose: () => {
          setBuilderOpen(false);
          setEditingReport(void 0);
        }
      }
    ),
    shareTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShareModal,
      {
        report: shareTarget,
        onSave: handleShareSave,
        onClose: () => setShareTarget(void 0)
      }
    )
  ] });
}
export {
  Reports
};
