import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, R as React, i as ChevronRight, m as Button, T as TriangleAlert, I as CircleAlert, J as CircleCheck, X, u as useApp, p as useActor, a8 as Plus, L as Lock, a1 as ScrollText, a7 as Upload, aC as Trash2, o as Badge, af as formatDate, aG as ExternalBlob, n as Clock, aI as RotateCcw, ac as ChevronUp, k as ChevronDown, aF as Label, ad as Input } from "./index-DvFvlUBj.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CJsIFtIC.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { F as FileSpreadsheet, H as History } from "./history-Dg-OWikc.js";
import { P as Pen } from "./pen-CQ3Xm2Uu.js";
import { D as Download } from "./download-DVLbZ_Ir.js";
import "./index-D-5r5K-M.js";
import "./index-CwZfxY3Y.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M12 18v-6", key: "17g6i2" }],
  ["path", { d: "m9 15 3 3 3-3", key: "1npd3o" }]
];
const FileDown = createLucideIcon("file-down", __iconNode);
const EXPECTED_FIELDS = [
  { key: "sku", label: "SKU", required: true },
  { key: "productName", label: "Product Name", required: true },
  { key: "productFamily", label: "Product Family", required: false },
  { key: "vendor", label: "Vendor", required: false },
  { key: "region", label: "Region", required: false },
  { key: "currency", label: "Currency", required: false },
  { key: "basePrice", label: "Base Price", required: false },
  { key: "promoPrice", label: "Promo Price", required: false },
  { key: "renewalPrice", label: "Renewal Price", required: false },
  { key: "incentivePct", label: "Incentive %", required: false },
  { key: "distributorCost", label: "Distributor Cost", required: false },
  { key: "resellerCost", label: "Reseller Cost", required: false },
  { key: "contractTerm", label: "Contract Term", required: false },
  { key: "billingFrequency", label: "Billing Frequency", required: false }
];
const STEP_LABELS = [
  "Preview",
  "Map Columns",
  "Validation",
  "Review",
  "Import"
];
function autoDetectMapping(headers) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const aliases = {
    sku: ["sku", "partnumber", "productcode", "itemcode", "code"],
    productName: ["productname", "name", "description", "product"],
    productFamily: ["productfamily", "family", "category", "line"],
    vendor: ["vendor", "manufacturer", "brand", "supplier"],
    region: ["region", "territory", "geo", "area"],
    currency: ["currency", "cur", "ccy"],
    basePrice: ["baseprice", "listprice", "price", "msrp", "rrp"],
    promoPrice: ["promoprice", "promotionprice", "saleprice"],
    renewalPrice: ["renewalprice", "renewalcost", "renewrate"],
    incentivePct: ["incentive", "incentivepct", "incentive%", "rebate%"],
    distributorCost: ["distributorcost", "distcost", "distribprice"],
    resellerCost: ["resellercost", "resellerprice", "partnerprice"],
    contractTerm: ["contractterm", "term", "contractlength"],
    billingFrequency: [
      "billingfrequency",
      "billing",
      "frequency",
      "billingcycle"
    ]
  };
  const result = {};
  for (const header of headers) {
    const n = norm(header);
    for (const [field, keys] of Object.entries(aliases)) {
      if (!result[field] && keys.includes(n)) {
        result[field] = header;
        break;
      }
    }
  }
  return result;
}
function buildMappedRows(rawRows, headers, mapping, existingSkus) {
  const getIdx = (field) => {
    const col = mapping[field];
    if (!col) return -1;
    return headers.indexOf(col);
  };
  const skusSeen = /* @__PURE__ */ new Set();
  const intraFileDupes = [];
  const duplicateSkus = [];
  const rows = rawRows.map((row, idx) => {
    const get = (field) => {
      const i = getIdx(field);
      return i >= 0 ? (row[i] ?? "").trim() : "";
    };
    const issues = [];
    const sku = get("sku");
    const productName = get("productName");
    if (!sku) issues.push("Missing SKU");
    if (!productName) issues.push("Missing Product Name");
    if (sku) {
      if (skusSeen.has(sku)) {
        issues.push("Duplicate SKU in file");
        if (!intraFileDupes.includes(sku)) intraFileDupes.push(sku);
      } else {
        skusSeen.add(sku);
      }
      if (existingSkus.has(sku)) {
        issues.push("SKU already exists in price list");
        if (!duplicateSkus.includes(sku)) duplicateSkus.push(sku);
      }
    }
    return {
      sku,
      productName,
      productFamily: get("productFamily"),
      vendor: get("vendor"),
      region: get("region"),
      currency: get("currency"),
      basePrice: get("basePrice"),
      promoPrice: get("promoPrice"),
      renewalPrice: get("renewalPrice"),
      incentivePct: get("incentivePct"),
      distributorCost: get("distributorCost"),
      resellerCost: get("resellerCost"),
      contractTerm: get("contractTerm"),
      billingFrequency: get("billingFrequency"),
      _rowIndex: idx + 1,
      _issues: issues
    };
  });
  const validCount = rows.filter((r) => r._issues.length === 0).length;
  return {
    rows,
    validCount,
    invalidCount: rows.length - validCount,
    duplicateSkus,
    intraFileDupes
  };
}
function ImportWizard({
  open,
  onClose,
  rawHeaders,
  rawRows,
  existingSkus = /* @__PURE__ */ new Set(),
  onImport
}) {
  const [step, setStep] = reactExports.useState(0);
  const [mapping, setMapping] = reactExports.useState(
    () => autoDetectMapping(rawHeaders)
  );
  const [skipInvalid, setSkipInvalid] = reactExports.useState(true);
  const [dupeAction, setDupeAction] = reactExports.useState("skip");
  const summary = reactExports.useMemo(
    () => buildMappedRows(rawRows, rawHeaders, mapping, existingSkus),
    [rawRows, rawHeaders, mapping, existingSkus]
  );
  const handleClose = reactExports.useCallback(() => {
    setStep(0);
    onClose();
  }, [onClose]);
  const doImport = reactExports.useCallback(() => {
    onImport(summary);
    handleClose();
  }, [onImport, summary, handleClose]);
  const validToImport = skipInvalid ? summary.rows.filter((r) => r._issues.length === 0).length : summary.rows.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl max-h-[88vh] overflow-hidden flex flex-col",
      style: { background: "#0e1b2e", borderColor: "rgba(255,255,255,0.08)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground font-display flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Import Price Data" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex items-center gap-1 px-1 pb-3 border-b border-border/40", children: STEP_LABELS.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => i < step && setStep(i),
              className: `flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors ${i === step ? "text-white font-semibold" : i < step ? "text-muted-foreground hover:text-foreground cursor-pointer" : "text-muted-foreground/40 cursor-default"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0",
                    style: {
                      background: i === step ? "#FF6B2B" : i < step ? "rgba(255,107,43,0.3)" : "rgba(255,255,255,0.1)",
                      color: i <= step ? "white" : ""
                    },
                    children: i < step ? "✓" : i + 1
                  }
                ),
                label
              ]
            }
          ),
          i < STEP_LABELS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronRight,
            {
              size: 12,
              className: "text-muted-foreground/30 shrink-0"
            }
          )
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto min-h-0 space-y-4 py-1", children: [
          step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step0Preview, { headers: rawHeaders, rows: rawRows }),
          step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Step1Mapping,
            {
              headers: rawHeaders,
              mapping,
              setMapping
            }
          ),
          step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Step2Validation,
            {
              summary,
              dupeAction,
              setDupeAction
            }
          ),
          step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(Step3Preview, { summary, skipInvalid }),
          step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Step4Import,
            {
              summary,
              validToImport,
              skipInvalid,
              setSkipInvalid
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex justify-between items-center pt-3 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => step === 0 ? handleClose() : setStep((s) => s - 1),
              className: "border-border text-foreground hover:bg-secondary/40",
              children: step === 0 ? "Cancel" : "Back"
            }
          ),
          step < 4 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: () => setStep((s) => s + 1),
              className: "text-white",
              style: { background: "#FF6B2B" },
              children: "Next"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              "data-ocid": "import_wizard.confirm_button",
              onClick: doImport,
              disabled: validToImport === 0,
              className: "text-white",
              style: { background: "#FF6B2B" },
              children: [
                "Import ",
                validToImport,
                " row",
                validToImport !== 1 ? "s" : ""
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function Step0Preview({
  headers,
  rows
}) {
  const preview = rows.slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "Detected",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
        headers.length,
        " columns"
      ] }),
      " ",
      "and ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
        rows.length,
        " data rows"
      ] }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "tr",
        {
          className: "border-b border-border/40",
          style: { background: "rgba(255,107,43,0.08)" },
          children: headers.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "px-3 py-2 text-left text-muted-foreground font-semibold whitespace-nowrap",
              children: h
            },
            h
          ))
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: preview.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "tr",
        {
          className: "border-b border-border/20 last:border-0",
          children: headers.map((_, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: "px-3 py-2 text-foreground/80 whitespace-nowrap max-w-[140px] truncate",
              children: row[ci] ?? ""
            },
            `col-${ci}-${headers[ci] ?? ci}`
          ))
        },
        `row-${ri}-${Array.isArray(row) ? row[0] ?? ri : ri}`
      )) })
    ] }) }),
    rows.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Showing 5 of ",
      rows.length,
      " rows"
    ] })
  ] });
}
function Step1Mapping({
  headers,
  mapping,
  setMapping
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Map your file columns to the expected fields. Required fields are marked with *." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2", children: EXPECTED_FIELDS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          htmlFor: `col-map-select-${f.key}`,
          className: "text-xs text-muted-foreground w-32 shrink-0 truncate",
          children: [
            f.label,
            f.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#FF6B2B" }, children: " *" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          id: `col-map-select-${f.key}`,
          value: mapping[f.key] ?? "",
          onChange: (e) => setMapping((m) => ({
            ...m,
            [f.key]: e.target.value || void 0
          })),
          className: "crm-input h-7 text-xs flex-1 px-2",
          "data-ocid": `import_wizard.map.${f.key}_select`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "(not mapped)" }),
            headers.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: h, children: h }, h))
          ]
        }
      )
    ] }, f.key)) })
  ] });
}
function Step2Validation({
  summary,
  dupeAction,
  setDupeAction
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pricing-panel p-3 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Valid rows" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", style: { color: "#4ade80" }, children: summary.validCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pricing-panel p-3 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Invalid rows" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xl font-bold",
            style: { color: summary.invalidCount > 0 ? "#f87171" : "#4ade80" },
            children: summary.invalidCount
          }
        )
      ] })
    ] }),
    summary.intraFileDupes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 p-3 rounded-lg border",
        style: {
          borderColor: "rgba(251,191,36,0.3)",
          background: "rgba(251,191,36,0.05)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TriangleAlert,
            {
              size: 14,
              className: "text-yellow-400 mt-0.5 shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-yellow-300 font-semibold mb-0.5", children: [
              "Duplicate SKUs in file: ",
              summary.intraFileDupes.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
              summary.intraFileDupes.slice(0, 5).join(", "),
              summary.intraFileDupes.length > 5 ? " …" : ""
            ] })
          ] })
        ]
      }
    ),
    summary.duplicateSkus.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-2 p-3 rounded-lg border",
          style: {
            borderColor: "rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.05)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "text-red-400 mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-300 font-semibold mb-0.5", children: [
                "Duplicates detected: ",
                summary.duplicateSkus.length,
                " SKUs already exist"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                summary.duplicateSkus.slice(0, 5).join(", "),
                summary.duplicateSkus.length > 5 ? " …" : ""
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Action:" }),
        ["skip", "overwrite"].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setDupeAction(opt),
            className: `text-xs px-3 py-1 rounded-full border transition-colors ${dupeAction === opt ? "border-accent text-white" : "border-border text-muted-foreground hover:border-accent/50"}`,
            style: dupeAction === opt ? { background: "#FF6B2B" } : {},
            children: opt === "skip" ? "Skip duplicates" : "Overwrite existing"
          },
          opt
        ))
      ] })
    ] }),
    summary.invalidCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-40 overflow-y-auto rounded-lg border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/40 sticky top-0",
          style: { background: "#0e1b2e" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-muted-foreground", children: "Row" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-muted-foreground", children: "SKU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left text-muted-foreground", children: "Issues" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: summary.rows.filter((r) => r._issues.length > 0).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/20 last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-muted-foreground", children: r._rowIndex }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5 text-foreground", children: r.sku || /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-1.5", children: r._issues.map((issue) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-block mr-1 text-[10px] px-1.5 py-0.5 rounded",
                style: {
                  background: "rgba(239,68,68,0.15)",
                  color: "#f87171"
                },
                children: issue
              },
              issue
            )) })
          ]
        },
        r._rowIndex
      )) })
    ] }) })
  ] });
}
function Step3Preview({
  summary,
  skipInvalid
}) {
  const rows = (skipInvalid ? summary.rows.filter((r) => r._issues.length === 0) : summary.rows).slice(0, 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Preview of first 10 rows to be imported:" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "tr",
        {
          className: "border-b border-border/40",
          style: { background: "rgba(255,107,43,0.08)" },
          children: [
            "SKU",
            "Product Name",
            "Base Price",
            "Currency",
            "Region",
            "Status"
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "px-3 py-2 text-left text-muted-foreground font-semibold whitespace-nowrap",
              children: h
            },
            h
          ))
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/20 last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground font-mono", children: r.sku || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground max-w-[180px] truncate", children: r.productName || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: r.basePrice || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: r.currency || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: r.region || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r._issues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13, className: "text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1 text-[10px]",
                style: { color: "#f87171" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 11 }),
                  r._issues.length,
                  " issue",
                  r._issues.length !== 1 ? "s" : ""
                ]
              }
            ) })
          ]
        },
        r._rowIndex
      )) })
    ] }) })
  ] });
}
function Step4Import({
  summary,
  validToImport,
  skipInvalid,
  setSkipInvalid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pricing-panel p-4 rounded-lg space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Import Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total rows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground", children: summary.rows.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Valid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold", style: { color: "#4ade80" }, children: summary.validCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Invalid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-lg font-bold",
              style: {
                color: summary.invalidCount > 0 ? "#f87171" : "#4ade80"
              },
              children: summary.invalidCount
            }
          )
        ] })
      ] })
    ] }),
    summary.invalidCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          checked: skipInvalid,
          onChange: (e) => setSkipInvalid(e.target.checked),
          className: "accent-orange-500",
          "data-ocid": "import_wizard.skip_invalid_checkbox"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground group-hover:text-foreground transition-colors", children: [
        "Skip ",
        summary.invalidCount,
        " invalid row",
        summary.invalidCount !== 1 ? "s" : "",
        " and import only valid rows"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-3 rounded-lg border",
        style: {
          borderColor: "rgba(255,107,43,0.3)",
          background: "rgba(255,107,43,0.06)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", style: { color: "#FF6B2B" }, children: [
            "Ready to import ",
            validToImport,
            " row",
            validToImport !== 1 ? "s" : ""
          ] }),
          validToImport === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "No valid rows to import. Review and fix issues first." })
        ]
      }
    )
  ] });
}
function parseCSVText(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };
  const parse = (line) => {
    const result = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  };
  const headers = parse(lines[0]);
  const rows = lines.slice(1).filter((l) => l.trim()).map(parse);
  return { headers, rows };
}
const EMPTY_FORM = {
  name: "",
  region: "",
  currency: "USD",
  productFamily: "",
  effectiveDate: "",
  expiryDate: "",
  version: "1.0",
  fileKey: "",
  fileName: ""
};
const SEED_VERSIONS = [
  {
    versionId: "v3",
    versionNumber: 3,
    uploadDate: "2026-05-10",
    uploadedBy: "Sarah Chen",
    rowCount: 142,
    status: "active"
  },
  {
    versionId: "v2",
    versionNumber: 2,
    uploadDate: "2026-04-02",
    uploadedBy: "James Miller",
    rowCount: 138,
    status: "archived"
  },
  {
    versionId: "v1",
    versionNumber: 1,
    uploadDate: "2026-02-15",
    uploadedBy: "Sarah Chen",
    rowCount: 125,
    status: "archived"
  }
];
const SEED_LOGS = [
  {
    logId: "ul3",
    timestamp: "2026-05-10T09:14:02Z",
    fileName: "GlobalPriceList_Q2_2026.csv",
    rowsImported: 142,
    rowsSkipped: 3,
    duplicatesHandled: 5,
    uploaderName: "Sarah Chen",
    expanded: false,
    details: [
      {
        rowIndex: 7,
        sku: "SEC-0042",
        status: "skipped",
        reason: "Missing Product Name"
      },
      { rowIndex: 18, sku: "", status: "skipped", reason: "Missing SKU" },
      {
        rowIndex: 99,
        sku: "NW-2211",
        status: "skipped",
        reason: "Missing SKU"
      }
    ]
  },
  {
    logId: "ul2",
    timestamp: "2026-04-02T14:30:00Z",
    fileName: "GlobalPriceList_Q1_2026.csv",
    rowsImported: 138,
    rowsSkipped: 0,
    duplicatesHandled: 0,
    uploaderName: "James Miller",
    expanded: false,
    details: []
  },
  {
    logId: "ul1",
    timestamp: "2026-02-15T11:05:33Z",
    fileName: "InitialPriceList_v1.csv",
    rowsImported: 125,
    rowsSkipped: 8,
    duplicatesHandled: 2,
    uploaderName: "Sarah Chen",
    expanded: false,
    details: []
  }
];
function dateToNs(dateStr) {
  if (!dateStr) return BigInt(0);
  return BigInt(new Date(dateStr).getTime()) * BigInt(1e6);
}
function isExpired(expiryDate) {
  const ms = Number(expiryDate) / 1e6;
  return ms < Date.now();
}
function PriceLists() {
  const {
    priceLists,
    loading,
    isVendor,
    isPrimaryAdmin,
    getUserRole,
    hasPermission,
    refreshPriceLists
  } = useApp();
  const { actor } = useActor();
  const canUpload = isPrimaryAdmin() || getUserRole() === "SalesOps" || hasPermission("canManagePricing");
  const vendorView = isVendor();
  const [wizardOpen, setWizardOpen] = reactExports.useState(false);
  const [wizardHeaders, setWizardHeaders] = reactExports.useState([]);
  const [wizardRows, setWizardRows] = reactExports.useState([]);
  const [pendingFile, setPendingFile] = reactExports.useState(null);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editId, setEditId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const csvInputRef = reactExports.useRef(null);
  const [versions, setVersions] = reactExports.useState(SEED_VERSIONS);
  const [logs, setLogs] = reactExports.useState(SEED_LOGS);
  const [activeTab, setActiveTab] = reactExports.useState(
    "lists"
  );
  const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CAD", "SGD"];
  function openCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setUploadProgress(null);
    setModalOpen(true);
  }
  function openEdit(pl) {
    setForm({
      name: pl.name,
      region: pl.region,
      currency: pl.currency,
      productFamily: pl.productFamily,
      effectiveDate: new Date(Number(pl.effectiveDate) / 1e6).toISOString().slice(0, 10),
      expiryDate: new Date(Number(pl.expiryDate) / 1e6).toISOString().slice(0, 10),
      version: pl.version,
      fileKey: pl.fileKey,
      fileName: pl.fileKey.split("/").pop() ?? ""
    });
    setEditId(pl.id);
    setUploadProgress(null);
    setModalOpen(true);
  }
  async function handleFileUpload(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
      const url = blob.getDirectURL();
      setForm((f) => ({ ...f, fileKey: url, fileName: file.name }));
      setUploadProgress(100);
    } catch {
      setUploadProgress(null);
    }
  }
  async function handleCSVSelect(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setPendingFile(file);
    const text = await file.text();
    const { headers, rows } = parseCSVText(text);
    setWizardHeaders(headers);
    setWizardRows(rows);
    setWizardOpen(true);
  }
  function handleImportComplete(summary) {
    const newVersion = {
      versionId: `v${versions.length + 1}`,
      versionNumber: versions.length + 1,
      uploadDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      uploadedBy: "You",
      rowCount: summary.validCount,
      status: "active"
    };
    setVersions(
      (vs) => [
        newVersion,
        ...vs.map((v) => ({ ...v, status: "archived" }))
      ].slice(0, 10)
    );
    const newLog = {
      logId: `ul${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      fileName: (pendingFile == null ? void 0 : pendingFile.name) ?? "imported.csv",
      rowsImported: summary.validCount,
      rowsSkipped: summary.invalidCount,
      duplicatesHandled: summary.duplicateSkus.length,
      uploaderName: "You",
      expanded: false,
      details: summary.rows.filter((r) => r._issues.length > 0).slice(0, 20).map((r) => ({
        rowIndex: r._rowIndex,
        sku: r.sku,
        status: "skipped",
        reason: r._issues[0]
      }))
    };
    setLogs((l) => [newLog, ...l]);
    setPendingFile(null);
    setActiveTab("logs");
  }
  function handleRollback(versionId) {
    setVersions(
      (vs) => vs.map((v) => ({
        ...v,
        status: v.versionId === versionId ? "active" : "archived"
      }))
    );
  }
  function toggleLogExpanded(logId) {
    setLogs(
      (ls) => ls.map((l) => l.logId === logId ? { ...l, expanded: !l.expanded } : l)
    );
  }
  async function handleSave() {
    if (!actor || !form.name || !form.effectiveDate || !form.expiryDate) return;
    setSaving(true);
    try {
      const input = {
        name: form.name,
        region: form.region,
        currency: form.currency,
        productFamily: form.productFamily,
        effectiveDate: dateToNs(form.effectiveDate),
        expiryDate: dateToNs(form.expiryDate),
        version: form.version,
        fileKey: form.fileKey
      };
      if (editId) {
        await actor.updatePriceList(editId, input);
      } else {
        await actor.createPriceList(input);
      }
      await refreshPriceLists();
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete(id) {
    if (!actor) return;
    await actor.deletePriceList(id);
    await refreshPriceLists();
    setDeleteConfirmId(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: "Price List Engine" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: canUpload ? "Upload, manage, and version-control price lists for your reseller network" : "Price lists shared by your vendor partner" })
      ] }),
      canUpload && vendorView && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            "data-ocid": "price_lists.import_csv_button",
            variant: "outline",
            className: "border-border text-foreground hover:bg-secondary/40 gap-1.5 text-sm",
            onClick: () => {
              var _a;
              return (_a = csvInputRef.current) == null ? void 0 : _a.click();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { size: 14 }),
              " Import CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            "data-ocid": "price_lists.create_button",
            onClick: openCreate,
            className: "text-white gap-1.5",
            style: { background: "#FF6B2B" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
              " Upload Price List"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: csvInputRef,
            type: "file",
            accept: ".csv,.tsv",
            className: "hidden",
            onChange: (e) => handleCSVSelect(e.target.files)
          }
        )
      ] }),
      !canUpload && vendorView && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
          style: {
            borderColor: "rgba(255,107,43,0.2)",
            background: "rgba(255,107,43,0.05)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 13, style: { color: "#FF6B2B" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", style: { color: "#FF6B2B" }, children: "Read-only access" })
          ]
        }
      )
    ] }),
    !canUpload && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 p-3 rounded-lg border",
        style: {
          borderColor: "rgba(255,107,43,0.2)",
          background: "rgba(255,107,43,0.04)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CircleAlert,
            {
              size: 15,
              style: { color: "#FF6B2B" },
              className: "mt-0.5 shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You have read-only access to price lists. To upload or modify pricing data, contact your Primary Admin or Sales Ops administrator." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 border-b border-border/50", children: [
      { id: "lists", label: "Price Lists", icon: FileSpreadsheet },
      { id: "versions", label: "Version History", icon: History },
      { id: "logs", label: "Upload History", icon: ScrollText }
    ].map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `price_lists.tab.${id}`,
        onClick: () => setActiveTab(id),
        className: `flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === id ? "border-orange-500 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
        style: activeTab === id ? { borderBottomColor: "#FF6B2B" } : {},
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13 }),
          label
        ]
      },
      id
    )) }),
    activeTab === "lists" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card p-6 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }, i)) }) : priceLists.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crm-card flex flex-col items-center py-16",
        "data-ocid": "price_lists.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FileSpreadsheet,
            {
              size: 40,
              className: "text-muted-foreground mb-4"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "No price lists yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: canUpload && vendorView ? "Upload CSV or Excel price lists to share with your partners." : "No price lists have been shared with you yet." }),
          canUpload && vendorView && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "price_lists.empty.import_button",
                onClick: () => {
                  var _a;
                  return (_a = csvInputRef.current) == null ? void 0 : _a.click();
                },
                className: "border-border text-foreground hover:bg-secondary/40 gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { size: 14 }),
                  " Import CSV"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                "data-ocid": "price_lists.empty.upload_button",
                onClick: openCreate,
                className: "text-white gap-1.5",
                style: { background: "#FF6B2B" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 15 }),
                  " Upload Price List"
                ]
              }
            )
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: priceLists.map((pl, i) => {
        const expired = isExpired(pl.expiryDate);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `price_lists.item.${i + 1}`,
            className: "crm-card p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FileSpreadsheet,
                    {
                      size: 16,
                      className: "text-muted-foreground shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm truncate", children: pl.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "status-badge",
                      style: {
                        background: expired ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
                        color: expired ? "#f87171" : "#4ade80"
                      },
                      children: expired ? "Expired" : "Active"
                    }
                  ),
                  canUpload && vendorView && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": `price_lists.edit_button.${i + 1}`,
                        onClick: () => openEdit(pl),
                        className: "p-1 rounded hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors",
                        "aria-label": "Edit price list",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 13 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": `price_lists.delete_button.${i + 1}`,
                        onClick: () => setDeleteConfirmId(pl.id),
                        className: "p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors",
                        "aria-label": "Delete price list",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                pl.region && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px] border-border text-muted-foreground",
                    children: pl.region
                  }
                ),
                pl.currency && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px] border-border text-muted-foreground",
                    children: pl.currency
                  }
                ),
                pl.productFamily && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px] border-border text-muted-foreground",
                    children: pl.productFamily
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px]",
                    style: {
                      borderColor: "rgba(255,107,43,0.3)",
                      color: "#FF6B2B"
                    },
                    children: [
                      "v",
                      pl.version
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5", children: "Effective" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground", children: formatDate(pl.effectiveDate) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5", children: "Expires" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: expired ? "text-red-400" : "text-foreground",
                      children: formatDate(pl.expiryDate)
                    }
                  )
                ] })
              ] }),
              pl.fileKey && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: ExternalBlob.fromURL(pl.fileKey).getDirectURL(),
                  target: "_blank",
                  rel: "noreferrer",
                  "data-ocid": `price_lists.download_button.${i + 1}`,
                  className: "flex items-center gap-1.5 text-xs mt-auto pt-2 border-t border-border/50 transition-colors group",
                  style: { color: "#FF6B2B" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { size: 13, className: "shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Download Price List" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Download,
                      {
                        size: 11,
                        className: "ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      }
                    )
                  ]
                }
              )
            ]
          },
          pl.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden hidden xl:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
          "Name",
          "Region",
          "Currency",
          "Product Family",
          "Effective",
          "Expires",
          "Version",
          ""
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: priceLists.map((pl, i) => {
          const expired = isExpired(pl.expiryDate);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `price_lists.table.item.${i + 1}`,
              className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 truncate", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FileSpreadsheet,
                    {
                      size: 13,
                      className: "text-muted-foreground shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: pl.name })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: pl.region || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: pl.currency || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: pl.productFamily || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: formatDate(pl.effectiveDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    className: `px-4 py-3 ${expired ? "text-red-400" : "text-muted-foreground"}`,
                    children: formatDate(pl.expiryDate)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px]",
                    style: {
                      borderColor: "rgba(255,107,43,0.3)",
                      color: "#FF6B2B"
                    },
                    children: [
                      "v",
                      pl.version
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: pl.fileKey && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: ExternalBlob.fromURL(
                      pl.fileKey
                    ).getDirectURL(),
                    target: "_blank",
                    rel: "noreferrer",
                    "data-ocid": `price_lists.table.download_button.${i + 1}`,
                    className: "flex items-center gap-1 text-xs transition-colors",
                    style: { color: "#FF6B2B" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
                      " Download"
                    ]
                  }
                ) })
              ]
            },
            pl.id
          );
        }) })
      ] }) })
    ] }) }),
    activeTab === "versions" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "price_lists.versions_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Last ",
        versions.length,
        " versions — only one version can be active at a time."
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [
          "Version",
          "Upload Date",
          "Uploaded By",
          "Rows",
          "Status",
          ""
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: versions.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `price_lists.version.item.${i + 1}`,
            className: "border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                "v",
                v.versionNumber
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
                v.uploadDate
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: v.uploadedBy }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: v.rowCount.toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "status-badge",
                  style: {
                    background: v.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.1)",
                    color: v.status === "active" ? "#4ade80" : "#94a3b8"
                  },
                  children: v.status === "active" ? "Active" : "Archived"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: canUpload && v.status === "archived" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `price_lists.rollback_button.${i + 1}`,
                  onClick: () => handleRollback(v.versionId),
                  className: "flex items-center gap-1 text-xs transition-colors hover:opacity-80",
                  style: { color: "#FF6B2B" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 12 }),
                    " Rollback"
                  ]
                }
              ) })
            ]
          },
          v.versionId
        )) })
      ] }) })
    ] }),
    activeTab === "logs" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "price_lists.logs_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "All price list imports in reverse chronological order." }),
      logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card flex flex-col items-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { size: 32, className: "text-muted-foreground mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No upload history yet" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: logs.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `price_lists.log.item.${i + 1}`,
          className: "crm-card overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "flex items-center justify-between p-4 w-full text-left cursor-pointer hover:bg-secondary/20 transition-colors",
                onClick: () => toggleLogExpanded(log.logId),
                onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && toggleLogExpanded(log.logId),
                "aria-expanded": log.expanded,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                        style: { background: "rgba(255,107,43,0.15)" },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          FileSpreadsheet,
                          {
                            size: 13,
                            style: { color: "#FF6B2B" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: log.fileName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        new Date(log.timestamp).toLocaleString(),
                        " ·",
                        " ",
                        log.uploaderName
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 shrink-0 ml-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right hidden sm:block", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: "text-xs font-semibold",
                          style: { color: "#4ade80" },
                          children: [
                            log.rowsImported,
                            " imported"
                          ]
                        }
                      ),
                      log.rowsSkipped > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: { color: "#f87171" }, children: [
                        log.rowsSkipped,
                        " skipped"
                      ] }),
                      log.duplicatesHandled > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        log.duplicatesHandled,
                        " dupes handled"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "text-muted-foreground",
                        "data-ocid": `price_lists.log.toggle.${i + 1}`,
                        children: log.expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 })
                      }
                    )
                  ] })
                ]
              }
            ),
            log.expanded && log.details.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide",
                  style: { background: "rgba(255,107,43,0.04)" },
                  children: "Per-row outcomes (skipped rows)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/20", children: ["Row", "SKU", "Status", "Reason"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "th",
                  {
                    className: "px-4 py-2 text-left text-muted-foreground",
                    children: h
                  },
                  h
                )) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: log.details.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border/10 last:border-0",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground", children: d.rowIndex }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-mono text-foreground", children: d.sku || /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "text-muted-foreground", children: "—" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] px-1.5 py-0.5 rounded",
                          style: {
                            background: "rgba(239,68,68,0.15)",
                            color: "#f87171"
                          },
                          children: d.status
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground", children: d.reason ?? "—" })
                    ]
                  },
                  d.rowIndex
                )) })
              ] })
            ] }),
            log.expanded && log.details.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 pt-2 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All rows imported successfully — no issues detected." }) })
          ]
        },
        log.logId
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImportWizard,
      {
        open: wizardOpen,
        onClose: () => setWizardOpen(false),
        rawHeaders: wizardHeaders,
        rawRows: wizardRows,
        onImport: handleImportComplete
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: modalOpen, onOpenChange: setModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-lg max-h-[90vh] overflow-y-auto",
        style: {
          background: "#0e1b2e",
          borderColor: "rgba(255,255,255,0.08)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground font-display", children: editId ? "Edit Price List" : "Upload Price List" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Price List Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "price_lists.modal.name_input",
                  value: form.name,
                  onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
                  placeholder: "Global Security Suite Q2 2026",
                  className: "crm-input h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Region" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "price_lists.modal.region_input",
                    value: form.region,
                    onChange: (e) => setForm((f) => ({ ...f, region: e.target.value })),
                    placeholder: "EMEA",
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Currency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    "data-ocid": "price_lists.modal.currency_select",
                    value: form.currency,
                    onChange: (e) => setForm((f) => ({ ...f, currency: e.target.value })),
                    className: "crm-input h-8 text-sm w-full px-2",
                    children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Product Family" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "price_lists.modal.product_family_input",
                    value: form.productFamily,
                    onChange: (e) => setForm((f) => ({ ...f, productFamily: e.target.value })),
                    placeholder: "Security Suite",
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Version" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "price_lists.modal.version_input",
                    value: form.version,
                    onChange: (e) => setForm((f) => ({ ...f, version: e.target.value })),
                    placeholder: "1.0",
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Effective Date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "price_lists.modal.effective_date_input",
                    type: "date",
                    value: form.effectiveDate,
                    onChange: (e) => setForm((f) => ({ ...f, effectiveDate: e.target.value })),
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Expiry Date *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "price_lists.modal.expiry_date_input",
                    type: "date",
                    value: form.expiryDate,
                    onChange: (e) => setForm((f) => ({ ...f, expiryDate: e.target.value })),
                    className: "crm-input h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Price List File" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "price_lists.modal.dropzone",
                  className: `border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`,
                  onDragOver: (e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  },
                  onDragLeave: () => setIsDragging(false),
                  onDrop: (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                  },
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  onKeyDown: (e) => {
                    var _a;
                    if (e.key === "Enter" || e.key === " ")
                      (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  "aria-label": "Upload file",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Upload,
                      {
                        size: 20,
                        className: "mx-auto mb-2 text-muted-foreground"
                      }
                    ),
                    form.fileName ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground font-medium", children: form.fileName }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Drop file here or",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#FF6B2B" }, children: "browse" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "XLSX, XLS, PDF" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: fileInputRef,
                        type: "file",
                        accept: ".xlsx,.xls,.pdf",
                        className: "hidden",
                        onChange: (e) => handleFileUpload(e.target.files)
                      }
                    )
                  ]
                }
              ),
              uploadProgress !== null && uploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1 bg-border rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full transition-all duration-300",
                  style: {
                    width: `${uploadProgress}%`,
                    background: "#FF6B2B"
                  }
                }
              ) }),
              form.fileKey && form.fileName && uploadProgress === 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 rounded-md bg-secondary/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FileSpreadsheet,
                  {
                    size: 13,
                    className: "text-muted-foreground shrink-0"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground truncate flex-1", children: form.fileName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-green-400", children: "✓ Uploaded" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setForm((f) => ({ ...f, fileKey: "", fileName: "" })),
                    className: "shrink-0 text-muted-foreground hover:text-red-400 transition-colors",
                    "aria-label": "Remove file",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  "data-ocid": "price_lists.modal.cancel_button",
                  onClick: () => setModalOpen(false),
                  className: "border-border text-foreground hover:bg-secondary/40",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  "data-ocid": "price_lists.modal.submit_button",
                  onClick: handleSave,
                  disabled: saving || !form.name || !form.effectiveDate || !form.expiryDate,
                  className: "text-white",
                  style: { background: "#FF6B2B" },
                  children: saving ? "Saving..." : editId ? "Update Price List" : "Save Price List"
                }
              )
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!deleteConfirmId,
        onOpenChange: () => setDeleteConfirmId(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-sm",
            style: {
              background: "#0e1b2e",
              borderColor: "rgba(255,255,255,0.08)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: "Delete Price List?" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "This price list will be permanently removed and partners will no longer be able to download it." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    "data-ocid": "price_lists.delete.cancel_button",
                    onClick: () => setDeleteConfirmId(null),
                    className: "border-border text-foreground hover:bg-secondary/40",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    "data-ocid": "price_lists.delete.confirm_button",
                    onClick: () => deleteConfirmId && handleDelete(deleteConfirmId),
                    className: "bg-red-600 hover:bg-red-700 text-white",
                    children: "Delete"
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
  PriceLists
};
