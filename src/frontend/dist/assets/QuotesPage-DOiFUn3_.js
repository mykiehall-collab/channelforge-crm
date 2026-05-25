import { u as useApp, r as reactExports, j as jsxRuntimeExports, V as FileText, o as Badge, X, m as Button, g as ChevronLeft, i as ChevronRight, be as CircleCheckBig, ad as Input, d as Brain, T as TriangleAlert, S as Search, W as formatCurrency, aC as Trash2, ab as ue, bz as Separator, a8 as Plus, az as Copy } from "./index-DvFvlUBj.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D4bdvzsb.js";
import { T as Textarea } from "./textarea-BHUaDciu.js";
import { S as Send } from "./send-Bb1KdK72.js";
import { D as Download } from "./download-DVLbZ_Ir.js";
import { C as ClipboardList } from "./clipboard-list-BvyAGRk8.js";
import { P as Package } from "./package-BhTTwTjw.js";
import { F as Funnel } from "./funnel-ouUqz1CV.js";
import { P as PenLine } from "./pen-line-CeRHR2h1.js";
import "./index-CNckvLjz.js";
import "./index-D-5r5K-M.js";
import "./index-B1ifXNtV.js";
import "./index-CwZfxY3Y.js";
const PRODUCT_CATALOGUE = [
  {
    sku: "SEC-ENT-001",
    name: "Security Suite Enterprise",
    basePrice: 2400,
    family: "Security"
  },
  {
    sku: "SEC-SMB-001",
    name: "Security Suite SMB",
    basePrice: 890,
    family: "Security"
  },
  {
    sku: "NET-SW-100",
    name: "Core Network Switch 48-port",
    basePrice: 8200,
    family: "Networking"
  },
  {
    sku: "NET-FW-200",
    name: "Next-Gen Firewall",
    basePrice: 18500,
    family: "Networking"
  },
  {
    sku: "COMP-CLD-001",
    name: "Cloud Compute Bundle",
    basePrice: 5600,
    family: "Compute"
  },
  {
    sku: "COMP-STG-001",
    name: "Object Storage 10TB",
    basePrice: 1200,
    family: "Compute"
  },
  {
    sku: "AI-OPS-001",
    name: "ForgeAI Operations Module",
    basePrice: 3800,
    family: "AI & Analytics"
  },
  {
    sku: "AI-INS-001",
    name: "AI Insights Pack",
    basePrice: 950,
    family: "AI & Analytics"
  },
  {
    sku: "SUP-PRO-001",
    name: "Premium Support",
    basePrice: 300,
    family: "Support"
  },
  {
    sku: "SUP-ENT-001",
    name: "Enterprise Support SLA",
    basePrice: 1200,
    family: "Support"
  },
  {
    sku: "LIC-USR-100",
    name: "User Licenses (100-pack)",
    basePrice: 12e3,
    family: "Licensing"
  },
  {
    sku: "RNW-STD-001",
    name: "Standard Renewal Package",
    basePrice: 4800,
    family: "Renewal"
  }
];
const MOCK_ACCOUNTS = [
  "Nordic Energy Group",
  "Desperado",
  "Global Pharma Holdings",
  "Adobe Systems",
  "Ingram Micro",
  "Crayon AS",
  "TD SYNNEX",
  "BluePeak Consulting",
  "Arvo Technologies",
  "Meridian Capital Partners"
];
const MOCK_OPPORTUNITIES = {
  "Nordic Energy Group": [
    "Cloud Security Suite Expansion",
    "Annual Renewal 2025"
  ],
  Desperado: ["Networking Infrastructure Refresh", "Edge Security Pilot"],
  "Global Pharma Holdings": [
    "Data Sovereignty Migration",
    "Compute Upgrade Q2"
  ],
  "Adobe Systems": ["Creative Suite Renewal 2025"],
  "Ingram Micro": ["Distributor Platform Licensing"]
};
const BILLING_TERMS = [
  "Monthly",
  "Annual",
  "Multi-Year",
  "One-Time",
  "Renewal"
];
function getForgeAIInsights(items, margin) {
  const insights = [];
  if (margin < 15)
    insights.push(
      "This quote falls below the expected margin threshold (15%). Consider adjusting discounts."
    );
  if (items.some((i) => i.billingTerm === "Monthly"))
    insights.push(
      "Switching from monthly to annual billing increases ARR predictability and may qualify for volume pricing."
    );
  if (items.some((i) => i.discountPct > 20))
    insights.push(
      "One or more lines exceed 20% discount. This may require Deal Desk approval."
    );
  if (items.some((i) => i.billingTerm === "Renewal"))
    insights.push(
      "Customer may qualify for renewal incentive pricing. Check distributor promotions."
    );
  if (items.length >= 3)
    insights.push(
      "Similar multi-product quotes converted better with 3-year terms. Consider offering a multi-year option."
    );
  return insights;
}
function calcLineTotals(items) {
  const listTotal = items.reduce((s, li) => s + li.quantity * li.unitPrice, 0);
  const discountTotal = items.reduce(
    (s, li) => s + li.quantity * li.unitPrice * (li.discountPct / 100),
    0
  );
  const subtotal = listTotal - discountTotal;
  const partnerPrice = subtotal * 0.85;
  const customerPrice = subtotal;
  const marginEst = (subtotal - partnerPrice) / subtotal * 100;
  const annualItems = items.filter(
    (li) => li.billingTerm === "Annual" || li.billingTerm === "Multi-Year"
  );
  const arr = annualItems.reduce(
    (s, li) => s + li.quantity * li.unitPrice * (1 - li.discountPct / 100),
    0
  );
  const renewalValue = arr * 1.05;
  return {
    listTotal,
    discountTotal,
    subtotal,
    partnerPrice,
    customerPrice,
    marginEst,
    arr,
    renewalValue
  };
}
function genQuoteNumber(allQuotes) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const existing = allQuotes.filter(
    (q) => q.quoteNumber.startsWith(`CF-${year}-`)
  );
  const n = String(existing.length + 1).padStart(4, "0");
  return `CF-${year}-${n}`;
}
const STEPS = [
  { id: 1, label: "Account & Opportunity", icon: ClipboardList },
  { id: 2, label: "Products & Pricing", icon: Package },
  { id: 3, label: "Quote Summary", icon: FileText },
  { id: 4, label: "Review & Export", icon: Send }
];
function StepIndicator({ currentStep }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0 mb-0", children: STEPS.map((s, idx) => {
    const done = s.id < currentStep;
    const active = s.id === currentStep;
    const Icon = s.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${active ? "bg-primary/20 text-primary" : done ? "text-emerald-400" : "text-muted-foreground"}`,
          children: [
            done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: s.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: s.id })
          ]
        }
      ),
      idx < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "text-border mx-0.5" })
    ] }, s.id);
  }) });
}
function QuoteBuilder({
  quote,
  allQuotes,
  onSave,
  onClose,
  readOnly
}) {
  const { userProfile } = useApp();
  const ownerName = userProfile ? userProfile.fullName ?? String(userProfile.email ?? "Current User") : "Current User";
  const [step, setStep] = reactExports.useState(1);
  const [accountName, setAccountName] = reactExports.useState((quote == null ? void 0 : quote.accountName) ?? "");
  const [opportunityName, setOpportunityName] = reactExports.useState(
    (quote == null ? void 0 : quote.opportunityName) ?? ""
  );
  const [dealRegNumber, setDealRegNumber] = reactExports.useState(
    (quote == null ? void 0 : quote.dealRegNumber) ?? ""
  );
  const [owner, setOwner] = reactExports.useState((quote == null ? void 0 : quote.owner) ?? ownerName);
  const [expiryDate, setExpiryDate] = reactExports.useState(() => {
    if (quote == null ? void 0 : quote.expiryDate) return quote.expiryDate;
    const d = /* @__PURE__ */ new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split("T")[0];
  });
  const [notes, setNotes] = reactExports.useState((quote == null ? void 0 : quote.notes) ?? "");
  const [lineItems, setLineItems] = reactExports.useState(
    (quote == null ? void 0 : quote.lineItems) ?? []
  );
  const [productSearch, setProductSearch] = reactExports.useState("");
  const [saveAsNewVersion, setSaveAsNewVersion] = reactExports.useState(false);
  const isEditing = !!quote;
  const quoteNumber = isEditing && !saveAsNewVersion ? quote.quoteNumber : genQuoteNumber(allQuotes);
  const version = isEditing ? saveAsNewVersion ? quote.version + 1 : quote.version : 1;
  const oppOptions = accountName ? MOCK_OPPORTUNITIES[accountName] ?? [] : [];
  const filteredProducts = PRODUCT_CATALOGUE.filter(
    (p) => productSearch.length < 2 || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase()) || p.family.toLowerCase().includes(productSearch.toLowerCase())
  );
  const totals = reactExports.useMemo(() => calcLineTotals(lineItems), [lineItems]);
  const forgeAIInsights = reactExports.useMemo(
    () => getForgeAIInsights(lineItems, totals.marginEst),
    [lineItems, totals.marginEst]
  );
  function addProduct(p) {
    const exists = lineItems.find((li) => li.sku === p.sku);
    if (exists) {
      setLineItems(
        (prev) => prev.map(
          (li) => li.sku === p.sku ? { ...li, quantity: li.quantity + 1 } : li
        )
      );
    } else {
      setLineItems((prev) => [
        ...prev,
        {
          id: `li-${Date.now()}`,
          sku: p.sku,
          productName: p.name,
          quantity: 1,
          unitPrice: p.basePrice,
          discountPct: 0,
          billingTerm: "Annual"
        }
      ]);
    }
    setProductSearch("");
  }
  function updateLineItem(id, updates) {
    setLineItems(
      (prev) => prev.map((li) => li.id === id ? { ...li, ...updates } : li)
    );
  }
  function removeLineItem(id) {
    setLineItems((prev) => prev.filter((li) => li.id !== id));
  }
  const buildRecord = reactExports.useCallback(
    (status) => ({
      id: isEditing && !saveAsNewVersion ? quote.id : `q-${Date.now()}`,
      quoteNumber,
      version,
      accountName,
      opportunityName: opportunityName || null,
      dealRegNumber: dealRegNumber || null,
      status,
      owner,
      createdDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      expiryDate,
      totalValue: Math.round(totals.subtotal),
      currency: "GBP",
      notes,
      lineItems
    }),
    [
      isEditing,
      saveAsNewVersion,
      quote,
      quoteNumber,
      version,
      accountName,
      opportunityName,
      dealRegNumber,
      owner,
      expiryDate,
      totals.subtotal,
      notes,
      lineItems
    ]
  );
  function handleSaveDraft() {
    if (!accountName) {
      ue.error("Account name is required");
      return;
    }
    onSave(buildRecord("Draft"));
  }
  function handleSubmitApproval() {
    if (!accountName) {
      ue.error("Account name is required");
      return;
    }
    ue.success("Quote submitted for approval");
    onSave(buildRecord("Pending Approval"));
  }
  function handleExportPDF() {
    ue.info("Generating PDF…");
    const rec = buildRecord("Draft");
    onSave(rec);
  }
  const canAdvance = () => {
    if (step === 1) return accountName.trim().length > 0;
    if (step === 2) return lineItems.length > 0;
    return true;
  };
  return (
    // Full-height side panel overlay
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 z-50 flex justify-end",
        "data-ocid": "quote_builder.dialog",
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quote-builder-card relative w-full max-w-3xl h-full flex flex-col shadow-2xl border-l border-border overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 15, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-sm font-display text-foreground", children: isEditing ? `Edit Quote — ${quoteNumber}` : "New Quote" }),
                    version > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "secondary",
                        className: "text-[10px] px-1.5 py-0",
                        children: [
                          "v",
                          version
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: readOnly ? "Read-only view" : isEditing ? "Update or save as new version" : "Create a new commercial quote" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "p-2 rounded hover:bg-muted transition-colors",
                  "data-ocid": "quote_builder.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16, className: "text-muted-foreground" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pt-3 pb-2 bg-muted/20 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { currentStep: step }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-6 py-5 space-y-5", children: [
              step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Step1,
                {
                  accountName,
                  setAccountName,
                  opportunityName,
                  setOpportunityName,
                  dealRegNumber,
                  setDealRegNumber,
                  owner,
                  setOwner,
                  expiryDate,
                  setExpiryDate,
                  notes,
                  setNotes,
                  oppOptions,
                  readOnly: !!readOnly
                }
              ),
              step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Step2,
                {
                  lineItems,
                  productSearch,
                  setProductSearch,
                  filteredProducts,
                  addProduct,
                  updateLineItem,
                  removeLineItem,
                  totals,
                  forgeAIInsights,
                  readOnly: !!readOnly
                }
              ),
              step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Step3,
                {
                  quoteNumber,
                  version,
                  accountName,
                  opportunityName,
                  owner,
                  expiryDate,
                  lineItems,
                  totals,
                  notes
                }
              ),
              step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Step4,
                {
                  isEditing,
                  saveAsNewVersion,
                  setSaveAsNewVersion,
                  readOnly: !!readOnly,
                  forgeAIInsights
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border bg-card flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: step > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setStep((s) => s - 1),
                  "data-ocid": "quote_builder.prev_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 13, className: "mr-1" }),
                    " Back"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                step < 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    disabled: !canAdvance(),
                    onClick: () => setStep((s) => s + 1),
                    "data-ocid": "quote_builder.next_button",
                    children: [
                      "Next ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 13, className: "ml-1" })
                    ]
                  }
                ),
                step === 4 && !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: handleSaveDraft,
                      "data-ocid": "quote_builder.save_draft_button",
                      children: "Save Draft"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: handleSubmitApproval,
                      "data-ocid": "quote_builder.submit_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 12, className: "mr-1" }),
                        " Submit for Approval"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      onClick: handleExportPDF,
                      className: "gap-1",
                      "data-ocid": "quote_builder.export_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 12 }),
                        " Export PDF"
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ]
      }
    )
  );
}
function Step1({
  accountName,
  setAccountName,
  opportunityName,
  setOpportunityName,
  dealRegNumber,
  setDealRegNumber,
  owner,
  setOwner,
  expiryDate,
  setExpiryDate,
  notes,
  setNotes,
  oppOptions,
  readOnly
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Account & Opportunity" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Account *", id: "qb-account", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: accountName,
          onValueChange: setAccountName,
          disabled: readOnly,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                id: "qb-account",
                "data-ocid": "quote_builder.account_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select account…" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MOCK_ACCOUNTS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: a, children: a }, a)) })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Linked Opportunity", id: "qb-opp", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: opportunityName || "none",
          onValueChange: (v) => setOpportunityName(v === "none" ? "" : v),
          disabled: readOnly || oppOptions.length === 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                id: "qb-opp",
                "data-ocid": "quote_builder.opportunity_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectValue,
                  {
                    placeholder: oppOptions.length ? "Select opportunity…" : "Select account first"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "None" }),
              oppOptions.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o, children: o }, o))
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Deal Registration #", id: "qb-dr", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "qb-dr",
          value: dealRegNumber,
          onChange: (e) => setDealRegNumber(e.target.value),
          placeholder: "DR-2025-XXXX",
          disabled: readOnly,
          "data-ocid": "quote_builder.deal_reg_input"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Quote Owner", id: "qb-owner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "qb-owner",
          value: owner,
          onChange: (e) => setOwner(e.target.value),
          disabled: readOnly,
          "data-ocid": "quote_builder.owner_input"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Expiry Date", id: "qb-expiry", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "qb-expiry",
          type: "date",
          value: expiryDate,
          onChange: (e) => setExpiryDate(e.target.value),
          disabled: readOnly,
          "data-ocid": "quote_builder.expiry_input"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Internal Notes", id: "qb-notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Textarea,
      {
        id: "qb-notes",
        rows: 3,
        value: notes,
        onChange: (e) => setNotes(e.target.value),
        placeholder: "Internal notes visible to your team…",
        disabled: readOnly,
        "data-ocid": "quote_builder.notes_textarea"
      }
    ) })
  ] });
}
function Step2({
  lineItems,
  productSearch,
  setProductSearch,
  filteredProducts,
  addProduct,
  updateLineItem,
  removeLineItem,
  totals,
  forgeAIInsights,
  readOnly
}) {
  const showProductSearch = productSearch.length >= 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Products & Pricing" }),
    forgeAIInsights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-primary mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 13 }),
        "ForgeAI Pricing Insights"
      ] }),
      forgeAIInsights.map((insight, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-2 text-xs text-muted-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TriangleAlert,
              {
                size: 11,
                className: "text-amber-400 mt-0.5 flex-shrink-0"
              }
            ),
            insight
          ]
        },
        `insight-${i}-${insight.slice(0, 20).replace(/\s/g, "")}`
      ))
    ] }),
    !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Search,
          {
            size: 13,
            className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: productSearch,
            onChange: (e) => setProductSearch(e.target.value),
            placeholder: "Search products by name, SKU or category…",
            className: "pl-9 h-9 text-sm",
            "data-ocid": "quote_builder.product_search"
          }
        )
      ] }) }),
      showProductSearch && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-10 left-0 right-0 z-10 rounded-lg border border-border bg-popover shadow-lg max-h-56 overflow-y-auto", children: filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 text-center text-xs text-muted-foreground", children: "No products found" }) : filteredProducts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => addProduct(p),
          className: "w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
                p.sku,
                " · ",
                p.family
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-primary", children: formatCurrency(p.basePrice, "GBP") })
          ]
        },
        p.sku
      )) })
    ] }),
    lineItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 gap-2 rounded-lg border border-dashed border-border",
        "data-ocid": "quote_builder.products_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 28, className: "text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Search above to add products" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: lineItems.map((li, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border border-border bg-card p-3 space-y-2 hover:border-primary/30 transition-colors",
        "data-ocid": `quote_builder.line_item.${i + 1}`,
        style: {
          background: "oklch(var(--editable-product-row-bg))",
          borderColor: "oklch(var(--editable-product-row-border))"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: li.productName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: li.sku })
            ] }),
            !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => removeLineItem(li.id),
                className: "p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors",
                "data-ocid": `quote_builder.remove_item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Qty", id: `qty-${li.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `qty-${li.id}`,
                type: "number",
                min: 1,
                value: li.quantity,
                onChange: (e) => updateLineItem(li.id, {
                  quantity: Math.max(1, Number(e.target.value))
                }),
                disabled: readOnly,
                className: "h-8 text-sm"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Unit Price", id: `up-${li.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `up-${li.id}`,
                type: "number",
                min: 0,
                value: li.unitPrice,
                onChange: (e) => updateLineItem(li.id, {
                  unitPrice: Math.max(0, Number(e.target.value))
                }),
                disabled: readOnly,
                className: "h-8 text-sm"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Discount %", id: `disc-${li.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: `disc-${li.id}`,
                type: "number",
                min: 0,
                max: 100,
                value: li.discountPct,
                onChange: (e) => updateLineItem(li.id, {
                  discountPct: Math.min(
                    100,
                    Math.max(0, Number(e.target.value))
                  )
                }),
                disabled: readOnly,
                className: "h-8 text-sm"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGroup, { label: "Billing Term", id: `term-${li.id}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: li.billingTerm,
                onValueChange: (v) => updateLineItem(li.id, {
                  billingTerm: v
                }),
                disabled: readOnly,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: BILLING_TERMS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "Line total:",
              " "
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary ml-1", children: formatCurrency(
              li.quantity * li.unitPrice * (1 - li.discountPct / 100),
              "GBP"
            ) })
          ] })
        ]
      },
      li.id
    )) }),
    lineItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TotalsPanel, { totals })
  ] });
}
function Step3({
  quoteNumber,
  version,
  accountName,
  opportunityName,
  owner,
  expiryDate,
  lineItems,
  totals,
  notes
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Quote Summary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetaField, { label: "Quote #", children: quoteNumber }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(MetaField, { label: "Version", children: [
        "v",
        version
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetaField, { label: "Account", children: accountName }),
      opportunityName && /* @__PURE__ */ jsxRuntimeExports.jsx(MetaField, { label: "Opportunity", children: opportunityName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetaField, { label: "Owner", children: owner }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetaField, { label: "Expires", children: expiryDate })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium text-muted-foreground", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Qty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium text-muted-foreground", children: "Unit Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium text-muted-foreground", children: "Disc" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium text-muted-foreground", children: "Line Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium text-muted-foreground", children: "Term" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: lineItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 6,
          className: "text-center py-6 text-muted-foreground",
          children: "No products added"
        }
      ) }) : lineItems.map((li) => {
        const lineTotal = li.quantity * li.unitPrice * (1 - li.discountPct / 100);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: li.productName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: li.sku })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center tabular-nums", children: li.quantity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums", children: formatCurrency(li.unitPrice, "GBP") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: li.discountPct > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]", children: [
            li.discountPct,
            "%"
          ] }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums font-semibold text-foreground", children: formatCurrency(lineTotal, "GBP") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: li.billingTerm })
        ] }, li.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TotalsPanel, { totals }),
    notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1", children: "Notes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: notes })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/10 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1", children: "Terms & Conditions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "This quote is valid until ",
        expiryDate,
        ". All prices are exclusive of applicable taxes. Payment terms: 30 days net. Prices subject to change after expiry date. CHANNELFORGE CRM is proprietary software. All rights reserved."
      ] })
    ] })
  ] });
}
function Step4({
  isEditing,
  saveAsNewVersion,
  setSaveAsNewVersion,
  readOnly,
  forgeAIInsights
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "Review & Export" }),
    readOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300", children: "You have read-only access to this quote. Contact Sales Ops or the quote owner to make changes." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-muted/20 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: saveAsNewVersion,
            onChange: (e) => setSaveAsNewVersion(e.target.checked),
            className: "w-4 h-4 accent-primary",
            "data-ocid": "quote_builder.new_version_checkbox"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: "Save as new version" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Creates a new version while preserving the current quote history" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/10 p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Export Options" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActionCard,
            {
              icon: FileText,
              title: "Save as Draft",
              description: "Store progress without submitting"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActionCard,
            {
              icon: Send,
              title: "Submit for Approval",
              description: "Send to deal desk for review"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActionCard,
            {
              icon: Download,
              title: "Export PDF",
              description: "Generate branded PDF quote"
            }
          )
        ] })
      ] }),
      forgeAIInsights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-semibold text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 13 }),
          "ForgeAI Recommendations"
        ] }),
        forgeAIInsights.map((insight, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2 text-xs text-muted-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TriangleAlert,
                {
                  size: 11,
                  className: "text-amber-400 mt-0.5 flex-shrink-0"
                }
              ),
              insight
            ]
          },
          `insight-${i}-${insight.slice(0, 20).replace(/\s/g, "")}`
        ))
      ] })
    ] })
  ] });
}
function SectionHeader({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold font-display text-foreground", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "flex-1" })
  ] });
}
function FieldGroup({
  label,
  id,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: id, className: "text-xs font-medium text-muted-foreground", children: label }),
    children
  ] });
}
function MetaField({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground truncate", children })
  ] });
}
function ActionCard({
  icon: Icon,
  title,
  description
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 p-3 rounded-lg border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13, className: "text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: description })
  ] });
}
function TotalsPanel({
  totals
}) {
  const rows = [
    { label: "List Price", value: totals.listTotal, highlight: false },
    {
      label: "Discount",
      value: -totals.discountTotal,
      highlight: false,
      color: "text-emerald-400"
    },
    { label: "Partner Price", value: totals.partnerPrice, highlight: false },
    { label: "Customer Price", value: totals.customerPrice, highlight: false },
    {
      label: "Margin Estimate",
      value: null,
      formatted: `${totals.marginEst.toFixed(1)}%`,
      highlight: false,
      color: totals.marginEst < 15 ? "text-red-400" : "text-emerald-400"
    },
    {
      label: "ARR",
      value: totals.arr,
      highlight: false,
      color: "text-primary"
    },
    {
      label: "Renewal Value (+5%)",
      value: totals.renewalValue,
      highlight: false,
      color: "text-primary"
    },
    { label: "Final Quote Estimate", value: totals.subtotal, highlight: true }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border border-border overflow-hidden",
      style: {
        background: "oklch(var(--pricing-panel-bg))",
        borderColor: "oklch(var(--pricing-panel-border))"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 border-b border-border/50 bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Pricing Breakdown" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center justify-between px-4 py-2 text-xs ${r.highlight ? "bg-primary/5" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: r.highlight ? "font-bold text-foreground" : "text-muted-foreground",
                  children: r.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `tabular-nums font-${r.highlight ? "bold" : "medium"} ${r.color ?? (r.highlight ? "text-primary" : "text-foreground")}`,
                  children: r.formatted ?? (r.value !== null ? formatCurrency(r.value, "GBP") : "—")
                }
              )
            ]
          },
          r.label
        )) })
      ]
    }
  );
}
const SEED_QUOTES = [
  {
    id: "q-001",
    quoteNumber: "CF-2025-0001",
    version: 1,
    accountName: "Nordic Energy Group",
    opportunityName: "Cloud Security Suite Expansion",
    dealRegNumber: null,
    status: "Approved",
    owner: "James Harrington",
    createdDate: "2025-01-15",
    expiryDate: "2025-04-15",
    totalValue: 184500,
    currency: "GBP",
    notes: "Approved by deal desk. Ready for customer delivery.",
    lineItems: [
      {
        id: "li-001",
        sku: "SEC-ENT-001",
        productName: "Security Suite Enterprise",
        quantity: 50,
        unitPrice: 2400,
        discountPct: 10,
        billingTerm: "Annual"
      },
      {
        id: "li-002",
        sku: "SUP-PRO-001",
        productName: "Premium Support",
        quantity: 50,
        unitPrice: 300,
        discountPct: 5,
        billingTerm: "Annual"
      }
    ]
  },
  {
    id: "q-002",
    quoteNumber: "CF-2025-0002",
    version: 2,
    accountName: "Desperado",
    opportunityName: "Networking Infrastructure Refresh",
    dealRegNumber: "DR-2025-0042",
    status: "Pending Approval",
    owner: "Sarah Mitchell",
    createdDate: "2025-02-03",
    expiryDate: "2025-05-03",
    totalValue: 328e3,
    currency: "GBP",
    notes: "Version 2 — adjusted quantities per customer feedback.",
    lineItems: [
      {
        id: "li-003",
        sku: "NET-SW-100",
        productName: "Core Network Switch 48-port",
        quantity: 20,
        unitPrice: 8200,
        discountPct: 15,
        billingTerm: "One-Time"
      },
      {
        id: "li-004",
        sku: "NET-FW-200",
        productName: "Next-Gen Firewall",
        quantity: 4,
        unitPrice: 18500,
        discountPct: 10,
        billingTerm: "One-Time"
      }
    ]
  },
  {
    id: "q-003",
    quoteNumber: "CF-2025-0003",
    version: 1,
    accountName: "Global Pharma Holdings",
    opportunityName: null,
    dealRegNumber: null,
    status: "Draft",
    owner: "Emma Lawson",
    createdDate: "2025-03-10",
    expiryDate: "2025-06-10",
    totalValue: 67200,
    currency: "GBP",
    notes: "Initial draft — awaiting product confirmation.",
    lineItems: [
      {
        id: "li-005",
        sku: "COMP-CLD-001",
        productName: "Cloud Compute Bundle",
        quantity: 12,
        unitPrice: 5600,
        discountPct: 0,
        billingTerm: "Monthly"
      }
    ]
  },
  {
    id: "q-004",
    quoteNumber: "CF-2025-0004",
    version: 1,
    accountName: "Adobe Systems",
    opportunityName: "Creative Suite Renewal 2025",
    dealRegNumber: "DR-2025-0028",
    status: "Expired",
    owner: "James Harrington",
    createdDate: "2024-11-20",
    expiryDate: "2025-02-20",
    totalValue: 142e3,
    currency: "GBP",
    notes: "Expired — customer requested new quote with updated pricing.",
    lineItems: [
      {
        id: "li-006",
        sku: "CC-ENT-2025",
        productName: "Creative Cloud Enterprise",
        quantity: 200,
        unitPrice: 710,
        discountPct: 0,
        billingTerm: "Annual"
      }
    ]
  },
  {
    id: "q-005",
    quoteNumber: "CF-2025-0005",
    version: 1,
    accountName: "Ingram Micro",
    opportunityName: "Distributor Platform Licensing",
    dealRegNumber: null,
    status: "Draft",
    owner: "Sarah Mitchell",
    createdDate: "2025-03-18",
    expiryDate: "2025-06-18",
    totalValue: 0,
    currency: "GBP",
    notes: "Work in progress.",
    lineItems: []
  }
];
const STATUS_COLORS = {
  Draft: "bg-muted text-muted-foreground border border-border",
  "Pending Approval": "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Expired: "bg-red-500/15 text-red-400 border border-red-500/30"
};
function loadQuotes() {
  try {
    const raw = localStorage.getItem("channelforge_quotes");
    if (raw) return JSON.parse(raw);
  } catch {
  }
  localStorage.setItem("channelforge_quotes", JSON.stringify(SEED_QUOTES));
  return SEED_QUOTES;
}
function saveQuotes(quotes) {
  try {
    localStorage.setItem("channelforge_quotes", JSON.stringify(quotes));
  } catch {
  }
}
function QuotesPage() {
  const { userProfile } = useApp();
  const roleStr = String((userProfile == null ? void 0 : userProfile.role) ?? "").toLowerCase();
  const isReadOnly = roleStr.includes("finance") || roleStr.includes("leadership") || roleStr.includes("regional director");
  const isSalesOps = roleStr.includes("sales ops") || roleStr.includes("sales operations");
  const [quotes, setQuotes] = reactExports.useState(() => loadQuotes());
  const [builderOpen, setBuilderOpen] = reactExports.useState(false);
  const [editingQuote, setEditingQuote] = reactExports.useState(null);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [ownerFilter, setOwnerFilter] = reactExports.useState("");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const owners = reactExports.useMemo(
    () => Array.from(new Set(quotes.map((q) => q.owner))).sort(),
    [quotes]
  );
  const filtered = reactExports.useMemo(() => {
    return quotes.filter((q) => {
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
      if (ownerFilter && q.owner !== ownerFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return q.quoteNumber.toLowerCase().includes(term) || q.accountName.toLowerCase().includes(term) || (q.opportunityName ?? "").toLowerCase().includes(term);
      }
      return true;
    });
  }, [quotes, statusFilter, ownerFilter, searchTerm]);
  function handleSaveQuote(quote) {
    setQuotes((prev) => {
      const idx = prev.findIndex((q) => q.id === quote.id);
      const next = idx >= 0 ? prev.map((q) => q.id === quote.id ? quote : q) : [quote, ...prev];
      saveQuotes(next);
      return next;
    });
    setBuilderOpen(false);
    setEditingQuote(null);
    ue.success(`Quote ${quote.quoteNumber} saved`);
  }
  function handleClone(quote) {
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const existing = quotes.filter(
      (q) => q.quoteNumber.startsWith(`CF-${year}-`)
    );
    const nextNum = String(existing.length + 1).padStart(4, "0");
    const cloned = {
      ...quote,
      id: `q-${Date.now()}`,
      quoteNumber: `CF-${year}-${nextNum}`,
      version: 1,
      status: "Draft",
      createdDate: now.toISOString().split("T")[0]
    };
    setQuotes((prev) => {
      const next = [cloned, ...prev];
      saveQuotes(next);
      return next;
    });
    ue.success(`Cloned as ${cloned.quoteNumber}`);
  }
  function handleDelete(id) {
    setQuotes((prev) => {
      const next = prev.filter((q) => q.id !== id);
      saveQuotes(next);
      return next;
    });
    ue.success("Quote deleted");
  }
  function handleExportPDF(quote) {
    const printContent = buildPrintHTML(quote);
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      ue.error("Could not open print window — allow popups");
      return;
    }
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
  function handleNewQuote() {
    setEditingQuote(null);
    setBuilderOpen(true);
  }
  function handleEdit(quote) {
    setEditingQuote(quote);
    setBuilderOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold font-display text-foreground", children: "Quotes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            quotes.length,
            " quotes in system"
          ] })
        ] })
      ] }),
      !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: handleNewQuote,
          className: "gap-2",
          "data-ocid": "quotes.new_quote_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
            "New Quote"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3 border-b border-border bg-card/60 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px] max-w-[320px]", children: [
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
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "Search quotes…",
            className: "pl-9 h-8 text-sm",
            "data-ocid": "quotes.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 13, className: "text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 text-sm w-[160px]",
              "data-ocid": "quotes.status_filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Statuses" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Statuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Draft", children: "Draft" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending Approval", children: "Pending Approval" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Approved", children: "Approved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Expired", children: "Expired" })
          ] })
        ] }),
        isSalesOps && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: ownerFilter || "all",
            onValueChange: (v) => setOwnerFilter(v === "all" ? "" : v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-sm w-[180px]",
                  "data-ocid": "quotes.owner_filter",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Owners" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Owners" }),
                owners.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o, children: o }, o))
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
        filtered.length,
        " result",
        filtered.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-64 gap-3",
        "data-ocid": "quotes.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 36, className: "text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No quotes found" }),
          !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: handleNewQuote,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13, className: "mr-1" }),
                " Create first quote"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide", children: "Quote #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide", children: "Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell", children: "Opportunity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell", children: "Owner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden xl:table-cell", children: "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden xl:table-cell", children: "Expires" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide", children: "Value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-muted/20 transition-colors group",
          "data-ocid": `quotes.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold text-primary", children: q.quoteNumber }),
              q.version > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                "v",
                q.version
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: q.accountName }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: q.opportunityName ?? "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLORS[q.status]}`,
                children: q.status
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: q.owner }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden xl:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: q.createdDate }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden xl:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: q.expiryDate }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground tabular-nums", children: q.totalValue > 0 ? formatCurrency(q.totalValue, q.currency) : "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity", children: [
              !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: "Edit",
                  "data-ocid": `quotes.edit_button.${i + 1}`,
                  onClick: () => handleEdit(q),
                  className: "p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: "Clone",
                  "data-ocid": `quotes.clone_button.${i + 1}`,
                  onClick: () => handleClone(q),
                  className: "p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: "Export PDF",
                  "data-ocid": `quotes.export_button.${i + 1}`,
                  onClick: () => handleExportPDF(q),
                  className: "p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 })
                }
              ),
              !isReadOnly && q.status === "Draft" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: "Delete",
                  "data-ocid": `quotes.delete_button.${i + 1}`,
                  onClick: () => handleDelete(q.id),
                  className: "p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                }
              )
            ] }) })
          ]
        },
        q.id
      )) })
    ] }) }),
    builderOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuoteBuilder,
      {
        quote: editingQuote,
        allQuotes: quotes,
        onSave: handleSaveQuote,
        onClose: () => {
          setBuilderOpen(false);
          setEditingQuote(null);
        },
        readOnly: isReadOnly
      }
    )
  ] });
}
function buildPrintHTML(q) {
  const lineItemRows = q.lineItems.map((li) => {
    const lineTotal = li.quantity * li.unitPrice * (1 - li.discountPct / 100);
    return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${li.sku}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${li.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${li.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right">£${li.unitPrice.toLocaleString()}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${li.discountPct}%</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right">£${lineTotal.toLocaleString(void 0, { maximumFractionDigits: 0 })}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${li.billingTerm}</td>
      </tr>`;
  }).join("");
  const subtotal = q.lineItems.reduce(
    (s, li) => s + li.quantity * li.unitPrice * (1 - li.discountPct / 100),
    0
  );
  const totalDiscount = q.lineItems.reduce(
    (s, li) => s + li.quantity * li.unitPrice * (li.discountPct / 100),
    0
  );
  return `<!DOCTYPE html><html><head><title>${q.quoteNumber}</title>
  <style>body{font-family:Arial,sans-serif;color:#111;margin:0;padding:40px}h1{margin:0}table{width:100%;border-collapse:collapse}th{background:#0f172a;color:#fff;padding:8px 12px;text-align:left}tr:nth-child(even){background:#f8fafc}.total-row td{font-weight:700;border-top:2px solid #0f172a}</style>
  </head><body>
  <table style="margin-bottom:32px"><tr>
    <td><div style="font-size:22px;font-weight:900;letter-spacing:-0.5px"><span style="color:#1e3a5f">CHANNEL</span><span style="color:#f97316">FORGE</span></div><div style="font-size:10px;letter-spacing:3px;color:#64748b;margin-top:2px">CRM</div></td>
    <td style="text-align:right"><div style="font-size:18px;font-weight:700;color:#0f172a">${q.quoteNumber}</div><div style="font-size:12px;color:#64748b">Version ${q.version}</div><div style="font-size:12px;color:#64748b">Prepared: ${q.createdDate}</div><div style="font-size:12px;color:#64748b">Expires: ${q.expiryDate}</div></td>
  </tr></table>
  <table style="margin-bottom:24px;border:1px solid #e5e7eb"><tr>
    <td style="padding:12px 16px;width:50%"><div style="font-size:11px;color:#64748b;margin-bottom:4px">PREPARED FOR</div><div style="font-size:15px;font-weight:700">${q.accountName}</div>${q.opportunityName ? `<div style="font-size:12px;color:#64748b;margin-top:2px">${q.opportunityName}</div>` : ""}</td>
    <td style="padding:12px 16px"><div style="font-size:11px;color:#64748b;margin-bottom:4px">PREPARED BY</div><div style="font-size:15px;font-weight:700">${q.owner}</div><div style="font-size:12px;color:#64748b;margin-top:2px">CHANNELFORGE CRM</div></td>
  </tr></table>
  <table style="margin-bottom:24px;border:1px solid #e5e7eb">
    <thead><tr><th>SKU</th><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:center">Disc %</th><th style="text-align:right">Line Total</th><th>Term</th></tr></thead>
    <tbody>${lineItemRows}</tbody>
    <tfoot>
      <tr><td colspan="5" style="padding:8px 12px;text-align:right;color:#64748b">List Subtotal:</td><td style="padding:8px 12px;text-align:right">£${(subtotal + totalDiscount).toLocaleString(void 0, { maximumFractionDigits: 0 })}</td><td></td></tr>
      <tr><td colspan="5" style="padding:8px 12px;text-align:right;color:#64748b">Discount:</td><td style="padding:8px 12px;text-align:right;color:#16a34a">-£${totalDiscount.toLocaleString(void 0, { maximumFractionDigits: 0 })}</td><td></td></tr>
      <tr class="total-row"><td colspan="5" style="padding:8px 12px;text-align:right">Total Quote Value:</td><td style="padding:8px 12px;text-align:right;color:#f97316;font-size:16px">£${subtotal.toLocaleString(void 0, { maximumFractionDigits: 0 })}</td><td></td></tr>
    </tfoot>
  </table>
  ${q.notes ? `<div style="padding:12px 16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:4px;margin-bottom:24px"><div style="font-size:11px;color:#64748b;margin-bottom:4px">NOTES</div><div style="font-size:13px">${q.notes}</div></div>` : ""}
  <div style="padding:12px 16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:4px;font-size:12px;color:#64748b">
    <strong>Terms & Conditions:</strong> This quote is valid until ${q.expiryDate}. All prices are exclusive of applicable taxes. Payment terms: 30 days net. Prices subject to change after expiry date. CHANNELFORGE CRM is proprietary software. All rights reserved.
  </div>
  </body></html>`;
}
export {
  QuotesPage
};
