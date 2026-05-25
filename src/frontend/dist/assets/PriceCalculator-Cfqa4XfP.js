import { r as reactExports, j as jsxRuntimeExports, a8 as Plus, m as Button, X, a6 as RefreshCw, ac as ChevronUp, k as ChevronDown, ar as Save, ad as Input, W as formatCurrency, T as TriangleAlert, S as Search, by as ScrollArea, bz as Separator, o as Badge } from "./index-DvFvlUBj.js";
import { D as Download } from "./download-DVLbZ_Ir.js";
import { M as Minus } from "./minus-OwCcNK6_.js";
const MOCK_PRODUCTS = [
  // ─── Security Suite ──────────────────────────────────────────────
  {
    sku: "SS-EP-001",
    name: "Endpoint Protection Advanced",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "EMEA",
    currency: "GBP",
    basePrice: 4800,
    promoPrice: 3840,
    renewalPrice: 4320,
    incentivePct: 12,
    distributorCost: 3120,
    resellerCost: 3600,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Enterprise endpoint detection and response platform"
  },
  {
    sku: "SS-SIEM-002",
    name: "SIEM Enterprise Edition",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "EMEA",
    currency: "GBP",
    basePrice: 18500,
    promoPrice: 15725,
    renewalPrice: 16650,
    incentivePct: 15,
    distributorCost: 11100,
    resellerCost: 13875,
    contractTerm: 3,
    billingFrequency: "annual",
    description: "Security information and event management — full deployment"
  },
  {
    sku: "SS-ZT-003",
    name: "Zero Trust Network Access",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "Americas",
    currency: "USD",
    basePrice: 12e3,
    promoPrice: 9600,
    renewalPrice: 10800,
    incentivePct: 10,
    distributorCost: 7200,
    resellerCost: 9e3,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Cloud-native zero trust access for distributed workforces"
  },
  {
    sku: "SS-IAM-004",
    name: "Identity & Access Management Pro",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "APAC",
    currency: "USD",
    basePrice: 7200,
    promoPrice: 6120,
    renewalPrice: 6840,
    incentivePct: 8,
    distributorCost: 4680,
    resellerCost: 5400,
    contractTerm: 2,
    billingFrequency: "annual",
    description: "Enterprise IAM with MFA, SSO, and privileged access"
  },
  {
    sku: "SS-SOC-005",
    name: "Managed SOC Services",
    productFamily: "Security Suite",
    vendor: "CyberShield Technologies",
    region: "EMEA",
    currency: "GBP",
    basePrice: 3200,
    promoPrice: 2880,
    renewalPrice: 3040,
    incentivePct: 5,
    distributorCost: 2080,
    resellerCost: 2560,
    contractTerm: 1,
    billingFrequency: "monthly",
    description: "24/7 security operations centre — per-month managed service"
  },
  // ─── Cloud Infrastructure ─────────────────────────────────────────
  {
    sku: "CI-COMP-006",
    name: "Compute Cluster Standard",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "EMEA",
    currency: "GBP",
    basePrice: 9600,
    promoPrice: 8160,
    renewalPrice: 8880,
    incentivePct: 10,
    distributorCost: 6240,
    resellerCost: 7200,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Managed compute cluster — 16 vCPU, 64 GB RAM"
  },
  {
    sku: "CI-OBJ-007",
    name: "Object Storage Enterprise",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "Americas",
    currency: "USD",
    basePrice: 4200,
    promoPrice: 3570,
    renewalPrice: 3990,
    incentivePct: 8,
    distributorCost: 2730,
    resellerCost: 3150,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "S3-compatible object storage — 100 TB allocated"
  },
  {
    sku: "CI-CDN-008",
    name: "Global CDN & Edge Delivery",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "APAC",
    currency: "USD",
    basePrice: 6500,
    promoPrice: 5525,
    renewalPrice: 6175,
    incentivePct: 12,
    distributorCost: 3900,
    resellerCost: 4875,
    contractTerm: 2,
    billingFrequency: "annual",
    description: "Content delivery network with 200+ global PoPs"
  },
  {
    sku: "CI-DB-009",
    name: "Managed Database Cluster",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "EMEA",
    currency: "EUR",
    basePrice: 11200,
    promoPrice: 9520,
    renewalPrice: 10640,
    incentivePct: 10,
    distributorCost: 7280,
    resellerCost: 8400,
    contractTerm: 3,
    billingFrequency: "annual",
    description: "Multi-AZ managed PostgreSQL / MySQL cluster"
  },
  {
    sku: "CI-KUBE-010",
    name: "Kubernetes Platform Enterprise",
    productFamily: "Cloud Infrastructure",
    vendor: "NovaCom Cloud",
    region: "Americas",
    currency: "USD",
    basePrice: 22e3,
    promoPrice: 18700,
    renewalPrice: 20900,
    incentivePct: 15,
    distributorCost: 14300,
    resellerCost: 16500,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Managed Kubernetes with auto-scaling, GitOps, and observability"
  },
  // ─── Analytics Platform ────────────────────────────────────────────
  {
    sku: "AP-BI-011",
    name: "Business Intelligence Suite",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "EMEA",
    currency: "GBP",
    basePrice: 8400,
    promoPrice: 7140,
    renewalPrice: 7980,
    incentivePct: 10,
    distributorCost: 5460,
    resellerCost: 6300,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Self-service BI, dashboards, and data visualisation"
  },
  {
    sku: "AP-DL-012",
    name: "Data Lake Pro",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "Americas",
    currency: "USD",
    basePrice: 16800,
    promoPrice: 14280,
    renewalPrice: 15960,
    incentivePct: 12,
    distributorCost: 10920,
    resellerCost: 12600,
    contractTerm: 2,
    billingFrequency: "annual",
    description: "Petabyte-scale data lake with Spark and query engine"
  },
  {
    sku: "AP-RT-013",
    name: "Real-Time Streaming Analytics",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "APAC",
    currency: "USD",
    basePrice: 9600,
    promoPrice: 8160,
    renewalPrice: 9120,
    incentivePct: 8,
    distributorCost: 6240,
    resellerCost: 7200,
    contractTerm: 1,
    billingFrequency: "monthly",
    description: "Kafka-compatible real-time event streaming and analytics"
  },
  {
    sku: "AP-ML-014",
    name: "ML & AI Model Platform",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "EMEA",
    currency: "GBP",
    basePrice: 24e3,
    promoPrice: 20400,
    renewalPrice: 22800,
    incentivePct: 15,
    distributorCost: 15600,
    resellerCost: 18e3,
    contractTerm: 3,
    billingFrequency: "annual",
    description: "Enterprise MLOps platform with model registry and serving"
  },
  {
    sku: "AP-GOV-015",
    name: "Data Governance & Cataloguing",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "EMEA",
    currency: "GBP",
    basePrice: 6e3,
    promoPrice: 5100,
    renewalPrice: 5700,
    incentivePct: 8,
    distributorCost: 3900,
    resellerCost: 4500,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Data catalogue, lineage, and governance for enterprise data estates"
  },
  {
    sku: "AP-ADV-016",
    name: "Advanced Reporting Add-On",
    productFamily: "Analytics Platform",
    vendor: "DataPulse Analytics",
    region: "Americas",
    currency: "USD",
    basePrice: 2400,
    promoPrice: 2040,
    renewalPrice: 2280,
    incentivePct: 5,
    distributorCost: 1560,
    resellerCost: 1800,
    contractTerm: 1,
    billingFrequency: "annual",
    description: "Pre-built executive report templates and scheduled delivery"
  }
];
const FAMILY_COLORS = {
  "Security Suite": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Cloud Infrastructure": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Analytics Platform": "bg-purple-500/20 text-purple-300 border-purple-500/30"
};
const TERM_MULTIPLIERS = {
  monthly: 1,
  annual: 12,
  "2year": 24,
  "3year": 36
};
const RENEWAL_UPLIFT = 0.03;
function getUnitPrice(product, pricingType) {
  switch (pricingType) {
    case "promo":
      return product.promoPrice;
    case "renewal":
      return product.renewalPrice;
    case "distributor":
      return product.distributorCost;
    case "reseller":
      return product.resellerCost;
    default:
      return product.basePrice;
  }
}
function getMonthlyBase(product, pricingType) {
  const unit = getUnitPrice(product, pricingType);
  return product.billingFrequency === "monthly" ? unit : unit / 12;
}
function calcRowLineTotals(row, billingTerm) {
  const termMonths = TERM_MULTIPLIERS[billingTerm];
  const monthlyUnit = getMonthlyBase(row.product, row.pricingType);
  const monthlyList = getMonthlyBase(row.product, "list");
  const monthlyPartner = Math.min(
    getMonthlyBase(row.product, "distributor"),
    getMonthlyBase(row.product, "reseller")
  );
  const monthlyRenewal = getMonthlyBase(row.product, "renewal");
  const unitPrice = monthlyUnit * termMonths;
  const listLineTotal = monthlyList * termMonths * row.quantity;
  const rawLineTotal = unitPrice * row.quantity;
  const discountAmount = rawLineTotal * (row.discountPct / 100);
  const lineTotal = rawLineTotal - discountAmount;
  const partnerLineTotal = monthlyPartner * termMonths * row.quantity;
  const renewalLineTotal = monthlyRenewal * termMonths * row.quantity;
  const marginPct = lineTotal > 0 ? Math.max(0, (lineTotal - partnerLineTotal) / lineTotal * 100) : 0;
  return {
    unitPrice,
    lineTotal,
    listLineTotal,
    discountAmount,
    partnerLineTotal,
    renewalLineTotal,
    marginPct
  };
}
function generateQuoteId() {
  return `QT-${Date.now().toString(36).toUpperCase()}`;
}
function FamilyBadge({ family }) {
  const cls = FAMILY_COLORS[family] ?? "bg-muted text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${cls}`,
      children: family
    }
  );
}
function PriceCalculator({
  onQuoteCreated,
  readOnly = false,
  userRole = "salesRep"
}) {
  const isReadOnly = readOnly || userRole === "finance" || userRole === "leadership";
  const isSalesOps = userRole === "salesOps";
  const [billingTerm, setBillingTerm] = reactExports.useState("annual");
  const [rows, setRows] = reactExports.useState([]);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showSearch, setShowSearch] = reactExports.useState(false);
  const [showMarginAnalysis, setShowMarginAnalysis] = reactExports.useState(false);
  const [showMultiYearBreakdown, setShowMultiYearBreakdown] = reactExports.useState(false);
  const [quoteSaved, setQuoteSaved] = reactExports.useState(false);
  const filteredProducts = reactExports.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.productFamily.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q)
    );
  }, [searchQuery]);
  const totals = reactExports.useMemo(() => {
    let subtotal = 0;
    let totalDiscounts = 0;
    let partnerPrice = 0;
    let customerPrice = 0;
    let renewalValue = 0;
    for (const row of rows) {
      const t = calcRowLineTotals(row, billingTerm);
      subtotal += t.listLineTotal;
      totalDiscounts += t.discountAmount;
      partnerPrice += t.partnerLineTotal;
      customerPrice += t.lineTotal;
      renewalValue += t.renewalLineTotal;
    }
    const marginPct = customerPrice > 0 ? (customerPrice - partnerPrice) / customerPrice * 100 : 0;
    const arr = billingTerm === "monthly" ? customerPrice * 12 : customerPrice;
    const finalQuoteEstimate = customerPrice;
    return {
      subtotal,
      totalDiscounts,
      partnerPrice,
      customerPrice,
      marginPct,
      renewalValue,
      arr,
      finalQuoteEstimate
    };
  }, [rows, billingTerm]);
  const multiYearBreakdown = reactExports.useMemo(() => {
    if (billingTerm !== "2year" && billingTerm !== "3year") return null;
    const years = billingTerm === "2year" ? 2 : 3;
    return Array.from({ length: years }, (_, i) => {
      const uplift = (1 + RENEWAL_UPLIFT) ** i;
      return {
        year: i + 1,
        value: i === 0 ? totals.customerPrice : totals.customerPrice * uplift,
        label: i === 0 ? "Initial Term" : `Year ${i + 1} (Renewal +${(RENEWAL_UPLIFT * 100).toFixed(0)}%/yr)`
      };
    });
  }, [billingTerm, totals.customerPrice]);
  const addProduct = reactExports.useCallback((product) => {
    setRows((prev) => [
      ...prev,
      {
        rowId: `${product.sku}-${Date.now()}`,
        product,
        quantity: 1,
        discountPct: 0,
        pricingType: "list"
      }
    ]);
    setShowSearch(false);
    setSearchQuery("");
  }, []);
  const removeRow = reactExports.useCallback((rowId) => {
    setRows((prev) => prev.filter((r) => r.rowId !== rowId));
  }, []);
  const updateRow = reactExports.useCallback(
    (rowId, patch) => {
      setRows(
        (prev) => prev.map((r) => r.rowId === rowId ? { ...r, ...patch } : r)
      );
    },
    []
  );
  const handleSaveQuote = reactExports.useCallback(() => {
    const quote = {
      id: generateQuoteId(),
      rows,
      ...totals,
      billingTerm,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    onQuoteCreated == null ? void 0 : onQuoteCreated(quote);
    setQuoteSaved(true);
    setTimeout(() => setQuoteSaved(false), 3e3);
  }, [rows, totals, billingTerm, onQuoteCreated]);
  const handleExport = reactExports.useCallback(() => {
    const lines = [
      "CHANNELFORGE — Pricing Summary",
      `Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}`,
      `Billing Term: ${billingTerm}`,
      "",
      "SKU,Product,Qty,Pricing Type,Discount %,Unit Price,Line Total",
      ...rows.map((row) => {
        const t = calcRowLineTotals(row, billingTerm);
        return [
          row.product.sku,
          `"${row.product.name}"`,
          row.quantity,
          row.pricingType,
          row.discountPct,
          t.unitPrice.toFixed(2),
          t.lineTotal.toFixed(2)
        ].join(",");
      }),
      "",
      `Subtotal (List),${totals.subtotal.toFixed(2)}`,
      `Total Discounts,-${totals.totalDiscounts.toFixed(2)}`,
      `Partner Price,${totals.partnerPrice.toFixed(2)}`,
      `Customer Price,${totals.customerPrice.toFixed(2)}`,
      `Estimated Margin,${totals.marginPct.toFixed(1)}%`,
      `Renewal Value,${totals.renewalValue.toFixed(2)}`,
      `ARR,${totals.arr.toFixed(2)}`,
      `Final Quote Estimate,${totals.finalQuoteEstimate.toFixed(2)}`,
      "Tax,TBD — calculated at invoicing"
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `channelforge-pricing-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, totals, billingTerm]);
  reactExports.useEffect(() => {
    setQuoteSaved(false);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pricing-panel flex flex-col gap-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border/40 bg-card/80 px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold tracking-tight text-foreground", children: "Operational Price Calculator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Real-time pricing · ",
          rows.length,
          " product",
          rows.length !== 1 ? "s" : "",
          " selected"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 rounded-lg border border-border/50 bg-background/60 p-1", children: ["monthly", "annual", "2year", "3year"].map(
        (term) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `price-calc.billing_term.${term}`,
            onClick: () => !isReadOnly && setBillingTerm(term),
            className: `rounded-md px-3 py-1 text-xs font-medium transition-all duration-150 ${billingTerm === term ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"} ${isReadOnly ? "cursor-default" : "cursor-pointer"}`,
            children: term === "monthly" ? "Monthly" : term === "annual" ? "Annual" : term === "2year" ? "2-Year" : "3-Year"
          },
          term
        )
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-1 flex-col lg:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center gap-3 py-16 text-center",
            "data-ocid": "price-calc.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No products added" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Search and add products to begin calculating" })
              ] }),
              !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => setShowSearch(true),
                  "data-ocid": "price-calc.add_product_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }),
                    "Add Product"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_80px_100px_110px_80px_90px_32px] items-center gap-2 bg-muted/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center", children: "Qty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pricing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Discount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ] }),
          rows.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProductRow,
            {
              row,
              billingTerm,
              isReadOnly,
              onUpdate: updateRow,
              onRemove: removeRow,
              index: idx + 1
            },
            row.rowId
          ))
        ] }) }),
        !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/30 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-1.5",
            onClick: () => setShowSearch((v) => !v),
            "data-ocid": "price-calc.add_product_button",
            children: showSearch ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
              " Close Search"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Product"
            ] })
          }
        ) }),
        showSearch && !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductSearchPanel,
          {
            query: searchQuery,
            onQueryChange: setSearchQuery,
            products: filteredProducts,
            onSelect: addProduct,
            selectedSkus: rows.map((r) => r.product.sku)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full shrink-0 border-t border-border/30 bg-muted/20 lg:w-72 lg:border-l lg:border-t-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PricingSummaryPanel,
        {
          totals,
          billingTerm,
          multiYearBreakdown,
          showMultiYearBreakdown,
          onToggleMultiYear: () => setShowMultiYearBreakdown((v) => !v)
        }
      ) })
    ] }),
    isSalesOps && rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex w-full items-center justify-between px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors",
          onClick: () => setShowMarginAnalysis((v) => !v),
          "data-ocid": "price-calc.margin_analysis.toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
              "Margin Analysis"
            ] }),
            showMarginAnalysis ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
          ]
        }
      ),
      showMarginAnalysis && /* @__PURE__ */ jsxRuntimeExports.jsx(MarginAnalysisPanel, { rows, billingTerm })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border/40 bg-card/60 px-5 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-1.5",
          onClick: handleExport,
          "data-ocid": "price-calc.export_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
            "Export Pricing Summary"
          ]
        }
      ),
      !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          className: "gap-1.5",
          onClick: handleSaveQuote,
          disabled: rows.length === 0,
          "data-ocid": "price-calc.save_quote_button",
          children: quoteSaved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }),
            " Saved!"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
            " Save as Quote"
          ] })
        }
      )
    ] })
  ] });
}
const PRICING_TYPE_LABELS = {
  list: "List Price",
  promo: "Promo",
  renewal: "Renewal",
  distributor: "Distributor",
  reseller: "Reseller"
};
function ProductRow({
  row,
  billingTerm,
  isReadOnly,
  onUpdate,
  onRemove,
  index
}) {
  const t = calcRowLineTotals(row, billingTerm);
  const isLowMargin = t.marginPct < 15;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "editable-product-row pricing-row grid grid-cols-[1fr_80px_100px_110px_80px_90px_32px] items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/20",
      "data-ocid": `price-calc.product_row.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 truncate", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm font-medium text-foreground", children: row.product.name }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: row.product.sku }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FamilyBadge, { family: row.product.productFamily })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: isReadOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: row.quantity }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "flex h-6 w-6 items-center justify-center rounded border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              onClick: () => onUpdate(row.rowId, { quantity: Math.max(1, row.quantity - 1) }),
              "data-ocid": `price-calc.qty_minus.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 1,
              value: row.quantity,
              onChange: (e) => onUpdate(row.rowId, {
                quantity: Math.max(1, Number.parseInt(e.target.value) || 1)
              }),
              className: "h-6 w-10 border-border/50 bg-background/60 px-1 text-center text-xs",
              "data-ocid": `price-calc.qty_input.${index}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "flex h-6 w-6 items-center justify-center rounded border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              onClick: () => onUpdate(row.rowId, { quantity: row.quantity + 1 }),
              "data-ocid": `price-calc.qty_plus.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isReadOnly ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: PRICING_TYPE_LABELS[row.pricingType] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: row.pricingType,
            onChange: (e) => onUpdate(row.rowId, {
              pricingType: e.target.value
            }),
            className: "h-7 w-full rounded border border-border/50 bg-background/60 px-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
            "data-ocid": `price-calc.pricing_type.${index}`,
            children: Object.entries(PRICING_TYPE_LABELS).map(([value, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value, children: label }, value))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
          isReadOnly ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-foreground", children: [
            row.discountPct,
            "%"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 0,
                max: 100,
                step: 1,
                value: row.discountPct,
                onChange: (e) => onUpdate(row.rowId, {
                  discountPct: Math.min(
                    100,
                    Math.max(0, Number.parseFloat(e.target.value) || 0)
                  )
                }),
                className: "h-7 w-16 border-border/50 bg-background/60 pr-4 text-right text-xs",
                "data-ocid": `price-calc.discount_input.${index}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute right-1.5 text-xs text-muted-foreground", children: "%" })
          ] }),
          row.discountPct > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pricing-discount-badge inline-flex items-center rounded border border-orange-500/30 bg-orange-500/10 px-1 py-0.5 text-[9px] font-semibold text-orange-400", children: [
            "-",
            row.discountPct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground", children: formatCurrency(t.unitPrice, row.product.currency) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold tabular-nums text-foreground", children: formatCurrency(t.lineTotal, row.product.currency) }),
          isLowMargin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pricing-margin-warning mt-0.5 flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 text-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-amber-400", children: "Low margin" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: !isReadOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "flex h-6 w-6 items-center justify-center rounded text-muted-foreground/60 transition-colors hover:bg-red-500/10 hover:text-red-400",
            onClick: () => onRemove(row.rowId),
            "data-ocid": `price-calc.remove_row.${index}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
          }
        ) })
      ]
    }
  );
}
function ProductSearchPanel({
  query,
  onQueryChange,
  products,
  onSelect,
  selectedSkus
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-t border-border/30 bg-background/60 px-4 pb-4 pt-3",
      "data-ocid": "price-calc.product_search_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: query,
              onChange: (e) => onQueryChange(e.target.value),
              placeholder: "Search by name, SKU, or product family…",
              className: "pl-8 text-sm",
              autoFocus: true,
              "data-ocid": "price-calc.search_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-xs text-muted-foreground", children: "No products match your search" }) : products.map((p) => {
          const already = selectedSkus.includes(p.sku);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: already,
              onClick: () => !already && onSelect(p),
              className: `flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${already ? "cursor-default opacity-40" : "cursor-pointer hover:bg-primary/10 hover:border-primary/30 border border-transparent"}`,
              "data-ocid": `price-calc.search_result.${p.sku}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: p.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FamilyBadge, { family: p.productFamily })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: p.sku }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "·" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: p.region }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "·" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: p.vendor })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold tabular-nums text-foreground", children: formatCurrency(p.basePrice, p.currency) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: p.billingFrequency })
                ] })
              ]
            },
            p.sku
          );
        }) }) })
      ]
    }
  );
}
function PricingSummaryPanel({
  totals,
  billingTerm,
  multiYearBreakdown,
  showMultiYearBreakdown,
  onToggleMultiYear
}) {
  const isLowMargin = totals.marginPct < 15 && totals.customerPrice > 0;
  const isHighRenewal = totals.renewalValue > 5e4;
  const SummaryRow = ({
    label,
    value,
    highlight,
    muted,
    large
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-center justify-between py-1.5 ${highlight ? "pricing-renewal-highlight" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs ${muted ? "text-muted-foreground" : highlight ? "font-medium text-emerald-400" : "text-foreground/80"}`,
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `tabular-nums ${large ? "text-base font-bold text-foreground" : highlight ? "text-sm font-semibold text-emerald-400" : muted ? "text-xs text-muted-foreground" : "text-sm font-medium text-foreground"}`,
            children: value
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col px-5 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Pricing Summary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryRow,
        {
          label: "Subtotal (List Price)",
          value: totals.subtotal > 0 ? formatCurrency(totals.subtotal) : "—",
          muted: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryRow,
        {
          label: "Total Discounts",
          value: totals.totalDiscounts > 0 ? `-${formatCurrency(totals.totalDiscounts)}` : "—",
          muted: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-2 opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryRow,
        {
          label: "Partner Price",
          value: totals.partnerPrice > 0 ? formatCurrency(totals.partnerPrice) : "—"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryRow,
        {
          label: "Customer Price",
          value: totals.customerPrice > 0 ? formatCurrency(totals.customerPrice) : "—"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center justify-between py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/80", children: "Est. Margin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          isLowMargin && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pricing-margin-warning flex items-center gap-0.5 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
            "Below threshold"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-sm font-semibold tabular-nums ${isLowMargin ? "text-amber-400" : totals.marginPct >= 30 ? "text-emerald-400" : "text-foreground"}`,
              children: totals.customerPrice > 0 ? `${totals.marginPct.toFixed(1)}%` : "—"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-2 opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center justify-between py-1.5 ${isHighRenewal ? "pricing-renewal-highlight rounded px-1" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `text-xs ${isHighRenewal ? "font-medium text-emerald-400" : "text-foreground/80"}`,
                children: [
                  "Renewal Value",
                  isHighRenewal && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "ml-1.5 border-emerald-500/30 bg-emerald-500/10 px-1 py-0 text-[9px] text-emerald-400",
                      children: "High Value"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-sm font-semibold tabular-nums ${isHighRenewal ? "text-emerald-400" : "text-foreground"}`,
                children: totals.renewalValue > 0 ? formatCurrency(totals.renewalValue) : "—"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryRow,
        {
          label: `ARR ${billingTerm === "monthly" ? "(annualised)" : ""}`,
          value: totals.arr > 0 ? formatCurrency(totals.arr) : "—"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-2 opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Tax", value: "TBD at invoicing", muted: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Final Quote Estimate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold tabular-nums text-primary", children: totals.finalQuoteEstimate > 0 ? formatCurrency(totals.finalQuoteEstimate) : "—" })
      ] })
    ] }),
    multiYearBreakdown && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors",
          onClick: onToggleMultiYear,
          "data-ocid": "price-calc.multi_year_toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Multi-Year Breakdown" }),
            showMultiYearBreakdown ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" })
          ]
        }
      ),
      showMultiYearBreakdown && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-1", children: multiYearBreakdown.map((yr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between rounded-md border border-border/30 bg-background/40 px-3 py-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: yr.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold tabular-nums text-foreground", children: formatCurrency(yr.value) })
          ]
        },
        yr.year
      )) })
    ] })
  ] });
}
function MarginAnalysisPanel({
  rows,
  billingTerm
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-4", "data-ocid": "price-calc.margin_analysis_panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-lg border border-border/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30 bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-semibold uppercase tracking-wider text-muted-foreground", children: "Product" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold uppercase tracking-wider text-muted-foreground", children: "Customer Price" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold uppercase tracking-wider text-muted-foreground", children: "Partner Cost" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold uppercase tracking-wider text-muted-foreground", children: "Margin £" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-semibold uppercase tracking-wider text-muted-foreground", children: "Margin %" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/20", children: rows.map((row) => {
      const t = calcRowLineTotals(row, billingTerm);
      const marginGbp = t.lineTotal - t.partnerLineTotal;
      const low = t.marginPct < 15;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: low ? "bg-amber-500/5" : "", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground", children: row.product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums text-foreground", children: formatCurrency(t.lineTotal, row.product.currency) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums text-muted-foreground", children: formatCurrency(t.partnerLineTotal, row.product.currency) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right tabular-nums text-foreground", children: formatCurrency(marginGbp, row.product.currency) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "td",
          {
            className: `px-3 py-2 text-right font-semibold tabular-nums ${low ? "text-amber-400" : "text-emerald-400"}`,
            children: [
              t.marginPct.toFixed(1),
              "%",
              low && " ⚠"
            ]
          }
        )
      ] }, row.rowId);
    }) })
  ] }) }) });
}
export {
  PriceCalculator as P
};
