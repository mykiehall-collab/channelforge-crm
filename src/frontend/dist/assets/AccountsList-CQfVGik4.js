import { p as useActor, u as useApp, r as reactExports, j as jsxRuntimeExports, a7 as Upload, aa as CircleX, V as FileText, m as Button, a6 as RefreshCw, J as CircleCheck, T as TriangleAlert, X, i as ChevronRight, ab as ue, k as ChevronDown, ac as ChevronUp, a as useNavigate, S as Search, ad as Input, O as AccountStatus, a8 as Plus, B as Building2, ae as accountStatusColor, af as formatDate } from "./index-DvFvlUBj.js";
import { S as Skeleton } from "./skeleton-Cqz48f6n.js";
import { D as Download } from "./download-DVLbZ_Ir.js";
const ACCOUNT_FIELDS = [
  { key: "customerName", label: "Customer Name", required: true },
  { key: "customerId", label: "Customer ID", required: false },
  { key: "customerDomain", label: "Customer Domain", required: true },
  { key: "resellerOwner", label: "Reseller Owner", required: false },
  { key: "renewalDate", label: "Renewal Date", required: false },
  { key: "subscriptionType", label: "Subscription Type", required: false },
  { key: "contractValue", label: "Contract Value", required: false },
  { key: "currency", label: "Currency", required: false },
  { key: "region", label: "Region", required: false },
  { key: "contactName", label: "Contact Name", required: false },
  { key: "contactEmail", label: "Contact Email", required: false },
  { key: "dealRegistrationStatus", label: "Deal Reg. Status", required: false }
];
const FIELD_HEADER_MAP = {
  customerName: [
    "customer name",
    "company name",
    "account name",
    "name",
    "client name"
  ],
  customerId: ["customer id", "account id", "id", "client id", "cust id"],
  customerDomain: ["domain", "customer domain", "email domain", "website"],
  resellerOwner: ["reseller", "partner", "reseller owner", "channel partner"],
  renewalDate: [
    "renewal",
    "renewal date",
    "expiry",
    "expiry date",
    "contract end",
    "end date"
  ],
  subscriptionType: [
    "subscription",
    "contract type",
    "subscription type",
    "plan",
    "tier"
  ],
  contractValue: [
    "value",
    "contract value",
    "arr",
    "amount",
    "revenue",
    "annual value"
  ],
  currency: ["currency", "currency code", "ccy"],
  region: ["region", "country", "territory", "location", "geo"],
  contactName: ["contact name", "primary contact", "contact"],
  contactEmail: ["contact email", "email", "contact e-mail"],
  dealRegistrationStatus: [
    "deal status",
    "dr status",
    "deal registration status",
    "deal reg status"
  ]
};
function parseCSV(text) {
  const firstLine = text.slice(
    0,
    text.indexOf("\n") === -1 ? text.length : text.indexOf("\n")
  );
  const delimiter = firstLine.includes("	") ? "	" : ",";
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };
  const splitLine = (line) => {
    if (delimiter === "	") return line.split("	").map((s) => s.trim());
    const result = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuote = !inQuote;
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
  const headers = splitLine(lines[0]);
  const rows = lines.slice(1).map(splitLine);
  return { headers, rows };
}
function rowsToObjects(headers, rows) {
  return rows.map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    return obj;
  });
}
function autoDetectMapping(headers, fieldMap) {
  return ACCOUNT_FIELDS.map((f) => {
    const patterns = fieldMap[f.key] ?? [];
    let matched = "";
    let auto = false;
    for (const header of headers) {
      const lh = header.toLowerCase().trim();
      if (patterns.some((p) => lh === p || lh.includes(p) || p.includes(lh))) {
        matched = header;
        auto = true;
        break;
      }
    }
    return { targetField: f.key, sourceColumn: matched, autoDetected: auto };
  });
}
function buildMappedRow(raw, mappingLookup, fields) {
  const m = {};
  for (const f of fields) {
    m[f.key] = mappingLookup[f.key] ? raw[mappingLookup[f.key]] ?? "" : "";
  }
  return m;
}
const VALID_CURRENCIES = /* @__PURE__ */ new Set([
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CNY",
  "AUD",
  "BTC"
]);
function validateRow(mapped, fields, existingAccounts) {
  var _a, _b, _c;
  const errors = [];
  const warnings = [];
  for (const f of fields.filter((fld) => fld.required)) {
    if (!((_a = mapped[f.key]) == null ? void 0 : _a.trim())) {
      errors.push(`Missing required field: ${f.label}`);
    }
  }
  if (mapped.currency && !VALID_CURRENCIES.has(mapped.currency.toUpperCase())) {
    warnings.push(`Unrecognised currency code: "${mapped.currency}"`);
  }
  if (mapped.renewalDate) {
    const d = new Date(mapped.renewalDate);
    if (Number.isNaN(d.getTime())) {
      errors.push(`Invalid renewal date format: "${mapped.renewalDate}"`);
    }
  }
  const domain = (_b = mapped.customerDomain) == null ? void 0 : _b.toLowerCase().trim();
  const name = (_c = mapped.customerName) == null ? void 0 : _c.toLowerCase().trim();
  if (domain || name) {
    const dup = existingAccounts.find(
      (a) => domain && a.customerDomain.toLowerCase() === domain || name && a.accountName.toLowerCase() === name
    );
    if (dup) {
      warnings.push(
        `Possible duplicate: matches existing account "${dup.accountName}" (ID: ${dup.id})`
      );
    }
  }
  return {
    hasError: errors.length > 0,
    hasWarning: warnings.length > 0,
    errors,
    warnings
  };
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function downloadCSV(data, filename) {
  const csvContent = data.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
const STEPS = [
  "Upload",
  "Map Columns",
  "Preview & Validate",
  "Import",
  "Summary"
];
function StepBar({ current }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0 mb-6 flex-wrap gap-y-2", children: STEPS.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
          style: {
            background: i < current ? "rgba(255,107,43,1)" : i === current ? "rgba(255,107,43,0.2)" : "rgba(255,255,255,0.06)",
            color: i <= current ? "#FF6B2B" : "#6b7280",
            border: i === current ? "1.5px solid #FF6B2B" : "none"
          },
          children: i < current ? "✓" : i + 1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-xs font-medium",
          style: {
            color: i === current ? "#FF6B2B" : i < current ? "#FF6B2B" : "#6b7280"
          },
          children: label
        }
      )
    ] }),
    i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "mx-2 text-muted-foreground" })
  ] }, label)) });
}
function ConfidenceBadge({ auto }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
      style: {
        background: auto ? "rgba(34,197,94,0.15)" : "rgba(255,107,43,0.15)",
        color: auto ? "#86efac" : "#FF6B2B"
      },
      children: auto ? "Auto-detected" : "Manual"
    }
  );
}
function BulkUpload({ onComplete }) {
  var _a;
  const { actor } = useActor();
  const {
    isVendor,
    userProfile,
    companyProfile,
    accounts: existingAccounts
  } = useApp();
  const fileInputRef = reactExports.useRef(null);
  const tableRef = reactExports.useRef(null);
  const [step, setStep] = reactExports.useState(0);
  const [dragOver, setDragOver] = reactExports.useState(false);
  const [fileName, setFileName] = reactExports.useState("");
  const [fileSize, setFileSize] = reactExports.useState(0);
  const [fileError, setFileError] = reactExports.useState("");
  const [headers, setHeaders] = reactExports.useState([]);
  const [rawObjects, setRawObjects] = reactExports.useState([]);
  const [columnMappings, setColumnMappings] = reactExports.useState([]);
  const [rows, setRows] = reactExports.useState([]);
  const [sortConfig, setSortConfig] = reactExports.useState({
    key: "",
    dir: "asc"
  });
  const [filterText, setFilterText] = reactExports.useState("");
  const [filterCurrency, setFilterCurrency] = reactExports.useState("");
  const [filterRenewalFrom, setFilterRenewalFrom] = reactExports.useState("");
  const [filterRenewalTo, setFilterRenewalTo] = reactExports.useState("");
  const [selectedRows, setSelectedRows] = reactExports.useState(/* @__PURE__ */ new Set());
  const [highlightedRow, setHighlightedRow] = reactExports.useState(null);
  const [importOptions, setImportOptions] = reactExports.useState({
    skipDuplicates: true,
    mergeExisting: false,
    sendDuplicatesToReview: false,
    targetResellerId: ""
  });
  const [importProgress, setImportProgress] = reactExports.useState(0);
  const [importing, setImporting] = reactExports.useState(false);
  const [importResult, setImportResult] = reactExports.useState(null);
  const handleFile = reactExports.useCallback((file) => {
    setFileError("");
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (![".csv", ".xlsx", ".xls"].includes(ext)) {
      setFileError(
        "Invalid file type. Please upload a .csv, .xlsx, or .xls file."
      );
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
      const { headers: h, rows: r } = parseCSV(text);
      if (h.length === 0) {
        setFileError("Could not parse file — ensure it is a valid CSV or TSV.");
        return;
      }
      setHeaders(h);
      const objs = rowsToObjects(h, r);
      setRawObjects(objs);
      const mappings = autoDetectMapping(h, FIELD_HEADER_MAP);
      setColumnMappings(mappings);
      setStep(1);
    };
    reader.readAsText(file);
  }, []);
  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }
  function onFileChange(e) {
    var _a2;
    const file = (_a2 = e.target.files) == null ? void 0 : _a2[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  async function handleMappingConfirm() {
    const missingRequired = ACCOUNT_FIELDS.filter(
      (f) => {
        var _a2;
        return f.required && !((_a2 = columnMappings.find((m) => m.targetField === f.key)) == null ? void 0 : _a2.sourceColumn);
      }
    );
    if (missingRequired.length > 0) {
      ue.error(
        `Required fields not mapped: ${missingRequired.map((f) => f.label).join(", ")}`
      );
      return;
    }
    const mappingLookup = {};
    for (const cm of columnMappings) {
      if (cm.sourceColumn) mappingLookup[cm.targetField] = cm.sourceColumn;
    }
    const mapped = rawObjects.map((obj, idx) => {
      const m = buildMappedRow(obj, mappingLookup, ACCOUNT_FIELDS);
      const validation = validateRow(m, ACCOUNT_FIELDS, existingAccounts);
      return {
        raw: obj,
        mapped: m,
        duplicateAction: validation.hasWarning ? "skip" : "create",
        hasError: validation.hasError,
        hasWarning: validation.hasWarning,
        errorMessages: validation.errors,
        warningMessages: validation.warnings,
        rowIndex: idx,
        selected: true
      };
    });
    let drQueue = [];
    if (actor) {
      try {
        drQueue = await actor.getDuplicateDRQueue();
      } catch {
      }
    }
    const finalRows = mapped.map((row) => {
      var _a2;
      const domain = (_a2 = row.mapped.customerDomain) == null ? void 0 : _a2.toLowerCase();
      const hasDRRisk = drQueue.some(
        (dr) => dr.accountId && existingAccounts.some(
          (a) => a.id === dr.accountId && a.customerDomain.toLowerCase() === domain
        )
      );
      if (hasDRRisk) {
        return {
          ...row,
          hasWarning: true,
          warningMessages: [
            ...row.warningMessages ?? [],
            "Active duplicate DR on this domain"
          ]
        };
      }
      return row;
    });
    setRows(finalRows);
    setSelectedRows(new Set(finalRows.map((_, i) => i)));
    setStep(2);
  }
  function toggleSort(key) {
    setSortConfig(
      (prev) => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }
  function getSortedFilteredRows(input) {
    let result = input.map((r, i) => ({ row: r, originalIdx: i }));
    if (filterText) {
      const q = filterText.toLowerCase();
      result = result.filter(
        (e) => (e.row.mapped.customerName ?? "").toLowerCase().includes(q) || (e.row.mapped.resellerOwner ?? "").toLowerCase().includes(q) || (e.row.mapped.customerDomain ?? "").toLowerCase().includes(q)
      );
    }
    if (filterCurrency) {
      result = result.filter(
        (e) => (e.row.mapped.currency ?? "").toUpperCase() === filterCurrency.toUpperCase()
      );
    }
    if (filterRenewalFrom) {
      result = result.filter(
        (e) => !e.row.mapped.renewalDate || e.row.mapped.renewalDate >= filterRenewalFrom
      );
    }
    if (filterRenewalTo) {
      result = result.filter(
        (e) => !e.row.mapped.renewalDate || e.row.mapped.renewalDate <= filterRenewalTo
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        const va = (a.row.mapped[sortConfig.key] ?? "").toLowerCase();
        const vb = (b.row.mapped[sortConfig.key] ?? "").toLowerCase();
        return sortConfig.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return result.slice(0, 100);
  }
  async function handleImport(selectedOnly) {
    if (!actor) return;
    setImporting(true);
    setImportProgress(0);
    setStep(3);
    const toImport = rows.filter((r, i) => {
      if (selectedOnly && !selectedRows.has(i)) return false;
      if (importOptions.skipDuplicates && r.hasWarning && r.duplicateAction === "skip")
        return false;
      return !r.hasError;
    });
    const toReview = importOptions.sendDuplicatesToReview ? rows.filter((r) => r.hasWarning && r.duplicateAction === "skip") : [];
    const inputs = toImport.map((r) => ({
      distributorIds: [],
      sites: [],
      accountName: r.mapped.customerName ?? "",
      customerDomain: r.mapped.customerDomain ?? "",
      resellerOwnerId: importOptions.targetResellerId || r.mapped.resellerOwner || "",
      vendorOwnerId: (userProfile == null ? void 0 : userProfile.id) ?? "",
      contractType: r.mapped.subscriptionType ?? "",
      renewalDate: r.mapped.renewalDate ? BigInt(new Date(r.mapped.renewalDate).getTime()) * 1000000n : 0n,
      estimatedRenewalValue: Number(r.mapped.contractValue) || 0,
      licenceQuantity: 0n,
      status: "Active",
      productList: []
    }));
    try {
      let result = {
        created: 0n,
        skipped: 0n,
        errors: []
      };
      const chunkSize = 25;
      let created = 0n;
      let skipped = 0n;
      const errors = [];
      for (let i = 0; i < inputs.length; i += chunkSize) {
        const chunk = inputs.slice(i, i + chunkSize);
        const res = await actor.bulkCreateAccounts(chunk);
        created += res.created;
        skipped += res.skipped;
        errors.push(...res.errors);
        setImportProgress(
          Math.round((i + chunk.length) / Math.max(inputs.length, 1) * 100)
        );
      }
      result = { created, skipped, errors };
      try {
        await actor.createAlert({
          alertType: "DuplicateAccount",
          userId: (userProfile == null ? void 0 : userProfile.id) ?? "",
          message: `BULK_UPLOAD: ${fileName} — ${Number(result.created)} created, ${Number(result.skipped)} skipped, ${result.errors.length} errors, ${toReview.length} sent to review`,
          severity: "Low",
          accountId: void 0
        });
      } catch {
      }
      setImportResult({
        imported: Number(result.created),
        skipped: Number(result.skipped),
        merged: 0,
        sentToReview: toReview.length,
        failed: result.errors.length,
        errors: result.errors,
        fileName,
        totalRows: rows.length
      });
      setImportProgress(100);
      setStep(4);
    } catch {
      ue.error("Import failed. Please try again.");
      setStep(2);
    } finally {
      setImporting(false);
    }
  }
  function downloadErrorReport() {
    if (!rows.length) return;
    const errorRows = rows.filter((r) => r.hasError || r.hasWarning);
    const csvData = [
      [
        "Row",
        "Customer Name",
        "Domain",
        "Renewal Date",
        "Issue Type",
        "Issues"
      ],
      ...errorRows.map((r, i) => [
        String(i + 1),
        r.mapped.customerName ?? "",
        r.mapped.customerDomain ?? "",
        r.mapped.renewalDate ?? "",
        r.hasError ? "Error" : "Warning",
        [...r.errorMessages ?? [], ...r.warningMessages ?? []].join(" | ")
      ])
    ];
    downloadCSV(csvData, `error-report-${fileName || "upload"}.csv`);
  }
  function downloadImportLog() {
    if (!importResult) return;
    const logData = [
      ["Metric", "Value"],
      ["File", importResult.fileName],
      ["Total Rows", String(importResult.totalRows)],
      ["Imported", String(importResult.imported)],
      ["Skipped", String(importResult.skipped)],
      ["Merged", String(importResult.merged)],
      ["Sent to Review", String(importResult.sentToReview)],
      ["Failed", String(importResult.failed)],
      ["Timestamp", (/* @__PURE__ */ new Date()).toISOString()],
      ["", ""],
      ["Errors", ""],
      ...importResult.errors.map((e) => ["", e])
    ];
    downloadCSV(logData, `import-log-${Date.now()}.csv`);
  }
  function resetAll() {
    setStep(0);
    setFileName("");
    setFileSize(0);
    setFileError("");
    setHeaders([]);
    setRawObjects([]);
    setColumnMappings([]);
    setRows([]);
    setSelectedRows(/* @__PURE__ */ new Set());
    setImportResult(null);
    setImportProgress(0);
    setFilterText("");
    setFilterCurrency("");
    setFilterRenewalFrom("");
    setFilterRenewalTo("");
    setSortConfig({ key: "", dir: "asc" });
  }
  const allCurrencies = Array.from(
    new Set(rows.map((r) => r.mapped.currency).filter(Boolean))
  );
  const readyCount = rows.filter((r) => !r.hasError && !r.hasWarning).length;
  const warningCount = rows.filter((r) => r.hasWarning && !r.hasError).length;
  const errorCount = rows.filter((r) => r.hasError).length;
  const vendorAdminCanUpload = isVendor();
  const visibleRows = getSortedFilteredRows(rows);
  const allVisible = visibleRows.length > 0 && visibleRows.every((e) => selectedRows.has(e.originalIdx));
  function toggleSelectAll() {
    if (allVisible) {
      setSelectedRows((prev) => {
        const next = new Set(prev);
        for (const e of visibleRows) next.delete(e.originalIdx);
        return next;
      });
    } else {
      setSelectedRows((prev) => {
        const next = new Set(prev);
        for (const e of visibleRows) next.add(e.originalIdx);
        return next;
      });
    }
  }
  function SortIcon({ col }) {
    if (sortConfig.key !== col)
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 12, className: "opacity-30" });
    return sortConfig.dir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 12, style: { color: "#FF6B2B" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 12, style: { color: "#FF6B2B" } });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onComplete,
          className: "text-muted-foreground hover:text-foreground transition-colors",
          "data-ocid": "bulk_upload.back_button",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display", children: "Import Accounts" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepBar, { current: step }),
      step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "bulk_upload.dropzone",
            onDragOver: (e) => {
              e.preventDefault();
              setDragOver(true);
            },
            onDragLeave: () => setDragOver(false),
            onDrop,
            onClick: () => {
              var _a2;
              return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
            },
            onKeyDown: (e) => {
              var _a2;
              if (e.key === "Enter" || e.key === " ")
                (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
            },
            className: "w-full border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            style: {
              borderColor: dragOver ? "#FF6B2B" : "rgba(255,255,255,0.12)",
              background: dragOver ? "rgba(255,107,43,0.06)" : "rgba(255,255,255,0.02)",
              animation: dragOver ? "pulse-border 1s ease-in-out infinite" : "none"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Upload,
                {
                  size: 36,
                  className: "mb-4",
                  style: { color: dragOver ? "#FF6B2B" : "#6b7280" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "Drag & drop your file here" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "or click to browse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-4 py-1.5 rounded-lg text-xs font-medium border",
                  style: {
                    borderColor: "rgba(255,107,43,0.4)",
                    color: "#FF6B2B",
                    background: "rgba(255,107,43,0.08)"
                  },
                  children: ".csv, .xlsx, .xls"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: ".csv,.xlsx,.xls",
                  className: "hidden",
                  onChange: onFileChange
                }
              )
            ]
          }
        ),
        fileError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 16 }),
          " ",
          fileError
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-lg bg-secondary/20 text-xs text-muted-foreground space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-2", children: "Required columns" }),
          ACCOUNT_FIELDS.filter((f) => f.required).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "· ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: f.label })
          ] }, f.key))
        ] })
      ] }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, style: { color: "#FF6B2B" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: fileName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                formatBytes(fileSize),
                " · ",
                rawObjects.length,
                " rows detected"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: resetAll,
              "data-ocid": "bulk_upload.replace_file_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: "mr-1" }),
                " Replace File"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Column Mapping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => setColumnMappings(
                  autoDetectMapping(headers, FIELD_HEADER_MAP)
                ),
                "data-ocid": "bulk_upload.reset_mapping_button",
                className: "text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11, className: "mr-1" }),
                  " Reset Mapping"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-muted-foreground font-medium", children: "Source Column" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-muted-foreground font-medium", children: "Map To Field" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-muted-foreground font-medium", children: "Confidence" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: columnMappings.map((cm, idx) => {
              var _a2, _b;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "border-b border-border/40 hover:bg-secondary/10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-muted-foreground", children: cm.sourceColumn || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-red-400", children: "Not mapped" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          value: cm.sourceColumn,
                          onChange: (e) => {
                            const next = [...columnMappings];
                            next[idx] = {
                              ...next[idx],
                              sourceColumn: e.target.value,
                              autoDetected: false
                            };
                            setColumnMappings(next);
                          },
                          className: "crm-input px-2 py-1 text-xs w-full",
                          "data-ocid": `bulk_upload.map.${cm.targetField}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Skip —" }),
                            headers.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: h, children: h }, h))
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground mt-0.5 block", children: [
                        (_a2 = ACCOUNT_FIELDS.find(
                          (f) => f.key === cm.targetField
                        )) == null ? void 0 : _a2.label,
                        ((_b = ACCOUNT_FIELDS.find(
                          (f) => f.key === cm.targetField
                        )) == null ? void 0 : _b.required) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#FF6B2B" }, children: " *" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfidenceBadge, { auto: cm.autoDetected }) })
                  ]
                },
                cm.targetField
              );
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: resetAll,
              "data-ocid": "bulk_upload.mapping.back_button",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleMappingConfirm,
              style: { background: "#FF6B2B" },
              className: "text-white",
              "data-ocid": "bulk_upload.mapping.next_button",
              children: "Next: Preview & Validate"
            }
          )
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/15 text-green-300 text-xs font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
            " ",
            readyCount,
            " ready"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/15 text-yellow-300 text-xs font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }),
            " ",
            warningCount,
            " warnings"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 text-xs font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 12 }),
            " ",
            errorCount,
            " errors"
          ] }),
          (warningCount > 0 || errorCount > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: downloadErrorReport,
              className: "text-xs ml-auto",
              "data-ocid": "bulk_upload.download_error_report_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 12, className: "mr-1" }),
                " Download Error Report"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search by name, domain, reseller…",
              value: filterText,
              onChange: (e) => setFilterText(e.target.value),
              className: "crm-input px-3 py-1.5 text-xs flex-1 min-w-[180px]",
              "data-ocid": "bulk_upload.filter.search_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filterCurrency,
              onChange: (e) => setFilterCurrency(e.target.value),
              className: "crm-input px-3 py-1.5 text-xs",
              "data-ocid": "bulk_upload.filter.currency_select",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Currencies" }),
                allCurrencies.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: filterRenewalFrom,
              onChange: (e) => setFilterRenewalFrom(e.target.value),
              className: "crm-input px-3 py-1.5 text-xs",
              title: "Renewal from",
              "data-ocid": "bulk_upload.filter.renewal_from"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              value: filterRenewalTo,
              onChange: (e) => setFilterRenewalTo(e.target.value),
              className: "crm-input px-3 py-1.5 text-xs",
              title: "Renewal to",
              "data-ocid": "bulk_upload.filter.renewal_to"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: tableRef,
            className: "overflow-x-auto max-h-[360px] overflow-y-auto rounded-lg border border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-card", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: allVisible,
                      onChange: toggleSelectAll,
                      className: "accent-orange-500",
                      "data-ocid": "bulk_upload.preview.select_all_checkbox"
                    }
                  ) }),
                  [
                    "customerName",
                    "customerDomain",
                    "renewalDate",
                    "contractValue",
                    "currency",
                    "resellerOwner",
                    "dealRegistrationStatus"
                  ].map((col) => {
                    var _a2;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "th",
                      {
                        className: "px-3 py-2.5 text-left text-muted-foreground cursor-pointer whitespace-nowrap select-none hover:text-foreground transition-colors",
                        onClick: () => toggleSort(col),
                        onKeyDown: (e) => e.key === "Enter" && toggleSort(col),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
                          ((_a2 = ACCOUNT_FIELDS.find((f) => f.key === col)) == null ? void 0 : _a2.label) ?? col,
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col })
                        ] })
                      },
                      col
                    );
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left text-muted-foreground", children: "Status" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: visibleRows.map(({ row, originalIdx }) => {
                  const rowBg = row.hasError ? "rgba(239,68,68,0.08)" : row.hasWarning ? "rgba(234,179,8,0.08)" : "transparent";
                  const isHighlighted = highlightedRow === originalIdx;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      "data-ocid": `bulk_upload.preview.row.${originalIdx + 1}`,
                      className: "border-b border-border/30 transition-colors",
                      style: {
                        background: isHighlighted ? "rgba(255,107,43,0.15)" : rowBg
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: selectedRows.has(originalIdx),
                            onChange: () => {
                              setSelectedRows((prev) => {
                                const next = new Set(prev);
                                if (next.has(originalIdx))
                                  next.delete(originalIdx);
                                else next.add(originalIdx);
                                return next;
                              });
                            },
                            className: "accent-orange-500",
                            "data-ocid": `bulk_upload.preview.checkbox.${originalIdx + 1}`
                          }
                        ) }),
                        [
                          "customerName",
                          "customerDomain",
                          "renewalDate",
                          "contractValue",
                          "currency",
                          "resellerOwner",
                          "dealRegistrationStatus"
                        ].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: "px-3 py-2 text-foreground max-w-[140px] truncate",
                            children: row.mapped[col] || "—"
                          },
                          col
                        )),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: row.hasError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 9 }),
                          " Error"
                        ] }) : row.hasWarning ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-500/20 text-yellow-300", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 9 }),
                          " Warning"
                        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/20 text-green-300", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 9 }),
                          " OK"
                        ] }) })
                      ]
                    },
                    `row-${originalIdx}`
                  );
                }) })
              ] }),
              rows.length > 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "px-4 py-2.5 text-xs text-muted-foreground border-t border-border", children: [
                "Showing first 100 of ",
                rows.length,
                " rows"
              ] })
            ]
          }
        ),
        (warningCount > 0 || errorCount > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-2", children: "Validation Issues" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-40 overflow-y-auto space-y-1.5", children: rows.map((r, i) => {
            const issues = [
              ...r.errorMessages ?? [],
              ...r.warningMessages ?? []
            ];
            if (!issues.length) return null;
            return issues.map((issue) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "flex items-start gap-2 w-full text-left hover:bg-secondary/20 px-2 py-1 rounded transition-colors",
                onClick: () => {
                  var _a2;
                  setHighlightedRow(i);
                  setTimeout(() => setHighlightedRow(null), 2e3);
                  (_a2 = tableRef.current) == null ? void 0 : _a2.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                },
                children: [
                  r.hasError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleX,
                    {
                      size: 12,
                      className: "text-red-400 mt-0.5 flex-shrink-0"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TriangleAlert,
                    {
                      size: 12,
                      className: "text-yellow-300 mt-0.5 flex-shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Row ",
                    i + 1,
                    " — ",
                    issue
                  ] })
                ]
              },
              `issue-${issue.slice(0, 30)}`
            ));
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Import Options" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4 text-xs", children: [
            { key: "skipDuplicates", label: "Skip duplicate records" },
            {
              key: "mergeExisting",
              label: "Merge with existing accounts"
            },
            {
              key: "sendDuplicatesToReview",
              label: "Send duplicates to Vendor Admin review"
            }
          ].map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: importOptions[key],
                    onChange: (e) => setImportOptions((prev) => ({
                      ...prev,
                      [key]: e.target.checked
                    })),
                    className: "accent-orange-500",
                    "data-ocid": `bulk_upload.option.${key}`
                  }
                ),
                label
              ]
            },
            key
          )) }),
          vendorAdminCanUpload && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "block text-xs text-muted-foreground mb-1",
                htmlFor: "target-reseller",
                children: "Assign to Reseller Workspace"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                id: "target-reseller",
                value: importOptions.targetResellerId,
                onChange: (e) => setImportOptions((prev) => ({
                  ...prev,
                  targetResellerId: e.target.value
                })),
                className: "crm-input px-3 py-1.5 text-xs w-full max-w-xs",
                "data-ocid": "bulk_upload.option.target_reseller_select",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Auto / use row value —" }),
                  (_a = companyProfile == null ? void 0 : companyProfile.partnerDomains) == null ? void 0 : _a.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d, children: d }, d))
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-wrap items-center gap-3 pt-2",
            "data-ocid": "bulk_upload.action_bar",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setStep(1),
                  "data-ocid": "bulk_upload.preview.back_button",
                  children: "Back"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
              selectedRows.size > 0 && selectedRows.size < rows.length && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => handleImport(true),
                  disabled: importing,
                  "data-ocid": "bulk_upload.preview.import_selected_button",
                  children: [
                    "Import ",
                    selectedRows.size,
                    " Selected"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  onClick: () => handleImport(false),
                  disabled: importing || readyCount === 0,
                  style: { background: "#FF6B2B" },
                  className: "text-white",
                  "data-ocid": "bulk_upload.preview.import_all_button",
                  children: [
                    "Import All Valid Rows (",
                    readyCount,
                    ")"
                  ]
                }
              )
            ]
          }
        )
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "space-y-6 py-8",
          "data-ocid": "bulk_upload.import_progress",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                  style: { background: "rgba(255,107,43,0.12)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Upload,
                    {
                      size: 28,
                      style: { color: "#FF6B2B" },
                      className: "animate-bounce"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "Importing accounts…" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                importProgress,
                "% complete"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-secondary overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-300",
                style: { width: `${importProgress}%`, background: "#FF6B2B" }
              }
            ) })
          ]
        }
      ),
      step === 4 && importResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "bulk_upload.summary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-16 h-16 rounded-full flex items-center justify-center",
            style: { background: "rgba(255,107,43,0.15)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 32, style: { color: "#FF6B2B" } })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-center text-base font-semibold text-foreground", children: "Import Complete" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3", children: [
          {
            label: "Imported",
            value: importResult.imported,
            color: "#FF6B2B"
          },
          {
            label: "Skipped",
            value: importResult.skipped,
            color: "#eab308"
          },
          {
            label: "Merged",
            value: importResult.merged,
            color: "#60a5fa"
          },
          {
            label: "In Review",
            value: importResult.sentToReview,
            color: "#a78bfa"
          },
          {
            label: "Failed",
            value: importResult.failed,
            color: "#f87171"
          }
        ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-2xl font-bold",
              style: { color },
              "data-ocid": `bulk_upload.summary.${label.toLowerCase().replace(" ", "_")}`,
              children: value
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: label })
        ] }, label)) }),
        importResult.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14, className: "text-red-400" }),
            " Failed rows"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-36 overflow-y-auto space-y-1", children: importResult.errors.map((err) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-xs text-red-400",
              children: [
                "· ",
                err
              ]
            },
            `err-${err.slice(0, 40)}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: downloadImportLog,
              "data-ocid": "bulk_upload.summary.download_log_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14, className: "mr-1.5" }),
                " Download Import Log"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: resetAll,
              "data-ocid": "bulk_upload.summary.import_another_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "mr-1.5" }),
                " Import Another File"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: onComplete,
              style: { background: "#FF6B2B" },
              className: "text-white px-8",
              "data-ocid": "bulk_upload.summary.done_button",
              children: "Done"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: AccountStatus.Active, label: "Active" },
  { value: AccountStatus.AtRisk, label: "At Risk" },
  { value: AccountStatus.Churned, label: "Churned" },
  { value: AccountStatus.Prospect, label: "Prospect" }
];
const RENEWAL_OPTIONS = [
  { value: "all", label: "Any Renewal Date" },
  { value: "30", label: "Due in 30 days" },
  { value: "60", label: "Due in 60 days" },
  { value: "90", label: "Due in 90 days" }
];
const RENEWAL_STATUS_OPTIONS = [
  { value: "all", label: "All Renewal Status" },
  { value: "overdue", label: "Overdue" },
  { value: "due_soon", label: "Due Soon (90d)" },
  { value: "healthy", label: "Healthy" }
];
const RISK_OPTIONS = [
  { value: "all", label: "All Risk Levels" },
  { value: "high", label: "High Risk" },
  { value: "medium", label: "Medium Risk" },
  { value: "low", label: "Low Risk" }
];
function renewalDays(ns) {
  return (Number(ns) / 1e6 - Date.now()) / 864e5;
}
function RenewalCell({ ns }) {
  if (!ns) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" });
  const days = renewalDays(ns);
  const color = days <= 30 ? "text-red-400" : days <= 90 ? "text-yellow-400" : "text-green-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: color, children: formatDate(ns) });
}
function AccountsList() {
  const {
    accounts: allAccounts,
    loading,
    refreshAccounts,
    isVendor,
    isReseller,
    isDistributor,
    isOrgAccessible,
    hasPermission,
    userProfile
  } = useApp();
  const { actor } = useActor();
  const navigate = useNavigate();
  const [resellerAccounts, setResellerAccounts] = reactExports.useState(allAccounts);
  const [resellerProfiles, setResellerProfiles] = reactExports.useState(
    []
  );
  const [loadingScoped, setLoadingScoped] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!actor) return;
    if (isReseller() && (userProfile == null ? void 0 : userProfile.companyId)) {
      setLoadingScoped(true);
      actor.getAccountsByReseller(userProfile.companyId).then(setResellerAccounts).catch(() => {
      }).finally(() => setLoadingScoped(false));
    } else {
      setResellerAccounts(allAccounts);
    }
  }, [actor, isReseller, userProfile, allAccounts]);
  reactExports.useEffect(() => {
    if (!actor || !isVendor() || !(userProfile == null ? void 0 : userProfile.companyId)) return;
    actor.getResellersForVendor(userProfile.companyId).then(setResellerProfiles).catch(() => {
    });
  }, [actor, isVendor, userProfile]);
  const accounts = isReseller() ? resellerAccounts : allAccounts;
  const orgIsolatedAccounts = accounts.filter((a) => {
    const vendorDom = a.vendorDomain || "";
    const distDom = a.distributorDomain || "";
    if (isVendor() && vendorDom) return isOrgAccessible(vendorDom);
    if (isDistributor() && distDom) return isOrgAccessible(distDom);
    return true;
  });
  const isLoading = loading || loadingScoped;
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [renewalWindow, setRenewalWindow] = reactExports.useState("all");
  const [renewalStatus, setRenewalStatus] = reactExports.useState("all");
  const [riskLevel, setRiskLevel] = reactExports.useState("all");
  const [regionFilter, setRegionFilter] = reactExports.useState("");
  const [productFilter, setProductFilter] = reactExports.useState("");
  const [resellerFilter, setResellerFilter] = reactExports.useState("");
  const [contractValueMin, setContractValueMin] = reactExports.useState("");
  const [contractValueMax, setContractValueMax] = reactExports.useState("");
  const [accountManagerFilter, setAccountManagerFilter] = reactExports.useState("");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [showImport, setShowImport] = reactExports.useState(false);
  const [showAdvanced, setShowAdvanced] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    accountName: "",
    customerDomain: "",
    resellerOwnerId: "",
    vendorOwnerId: "",
    contractType: "",
    estimatedRenewalValue: "",
    customerIdNumber: ""
  });
  const [customerIdStatus, setCustomerIdStatus] = reactExports.useState("idle");
  const [customerIdMessage, setCustomerIdMessage] = reactExports.useState("");
  const [customerIdFormat, setCustomerIdFormat] = reactExports.useState("");
  const [generatingId, setGeneratingId] = reactExports.useState(false);
  const canCreate = isVendor() || hasPermission("edit_accounts");
  reactExports.useEffect(() => {
    if (!actor || !(userProfile == null ? void 0 : userProfile.companyId)) return;
    actor.getCustomerIdFormatRule(userProfile.companyId).then((rule) => {
      if (rule) setCustomerIdFormat(rule.formatPattern);
    }).catch(() => {
    });
  }, [actor, userProfile]);
  const domainCounts = orgIsolatedAccounts.reduce(
    (acc, a) => {
      if (a.customerDomain)
        acc[a.customerDomain] = (acc[a.customerDomain] ?? 0) + 1;
      return acc;
    },
    {}
  );
  const hasDuplicates = Object.values(domainCounts).some((c) => c > 1);
  function getRiskLevel(status) {
    if (status === AccountStatus.AtRisk) return "high";
    if (status === AccountStatus.Churned) return "high";
    if (status === AccountStatus.Prospect) return "medium";
    return "low";
  }
  const filtered = orgIsolatedAccounts.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      if (!a.accountName.toLowerCase().includes(q) && !a.customerDomain.toLowerCase().includes(q) && !a.vendorOwnerId.toLowerCase().includes(q))
        return false;
    }
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (resellerFilter && a.resellerOwnerId !== resellerFilter) return false;
    if (renewalWindow !== "all") {
      const days = renewalDays(a.renewalDate);
      if (days < 0 || days > Number(renewalWindow)) return false;
    }
    if (renewalStatus !== "all") {
      const days = renewalDays(a.renewalDate);
      if (renewalStatus === "overdue" && days >= 0) return false;
      if (renewalStatus === "due_soon" && (days < 0 || days > 90)) return false;
      if (renewalStatus === "healthy" && days < 90) return false;
    }
    if (riskLevel !== "all" && getRiskLevel(a.status) !== riskLevel)
      return false;
    if (productFilter) {
      const q = productFilter.toLowerCase();
      if (!a.productList.some((p) => p.toLowerCase().includes(q))) return false;
    }
    const min = Number.parseFloat(contractValueMin);
    const max = Number.parseFloat(contractValueMax);
    if (!Number.isNaN(min) && a.estimatedRenewalValue < min) return false;
    if (!Number.isNaN(max) && a.estimatedRenewalValue > max) return false;
    if (accountManagerFilter && a.vendorOwnerId !== accountManagerFilter)
      return false;
    return true;
  });
  const accountManagers = Array.from(
    new Set(accounts.map((a) => a.vendorOwnerId).filter(Boolean))
  );
  async function checkCustomerId(value) {
    if (!value.trim() || !actor || !(userProfile == null ? void 0 : userProfile.companyId)) {
      setCustomerIdStatus("idle");
      setCustomerIdMessage("");
      return;
    }
    setCustomerIdStatus("checking");
    try {
      const isDup = await actor.isCustomerIdDuplicate(
        userProfile.companyId,
        value.trim()
      );
      if (isDup) {
        setCustomerIdStatus("duplicate");
        setCustomerIdMessage("This Customer ID already exists.");
      } else {
        setCustomerIdStatus("valid");
        setCustomerIdMessage("Customer ID is available.");
      }
    } catch {
      setCustomerIdStatus("idle");
    }
  }
  async function validateCustomerIdFormat(value) {
    if (!value.trim() || !actor || !(userProfile == null ? void 0 : userProfile.companyId)) return;
    try {
      const result = await actor.validateCustomerId(
        userProfile.companyId,
        value.trim()
      );
      if (!result.isValid && result.errorMessage) {
        setCustomerIdStatus("invalid");
        setCustomerIdMessage(result.errorMessage);
      }
    } catch {
    }
  }
  async function handleAutoGenerateId() {
    if (!actor || !(userProfile == null ? void 0 : userProfile.companyId)) return;
    setGeneratingId(true);
    try {
      const result = await actor.generateCustomerId({
        vendorId: userProfile.companyId
      });
      if (result.isValid && result.formattedId) {
        setForm((f) => ({ ...f, customerIdNumber: result.formattedId ?? "" }));
        setCustomerIdStatus("valid");
        setCustomerIdMessage("Auto-generated ID is available.");
      } else {
        ue.error(result.errorMessage ?? "Failed to generate Customer ID");
      }
    } catch {
      ue.error("Failed to auto-generate Customer ID");
    } finally {
      setGeneratingId(false);
    }
  }
  async function handleCreate(e) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.createAccount({
        distributorIds: [],
        sites: [],
        accountName: form.accountName,
        customerDomain: form.customerDomain,
        resellerOwnerId: form.resellerOwnerId,
        vendorOwnerId: form.vendorOwnerId,
        contractType: form.contractType,
        estimatedRenewalValue: Number.parseFloat(form.estimatedRenewalValue) || 0,
        licenceQuantity: BigInt(0),
        productList: [],
        renewalDate: BigInt(0),
        status: AccountStatus.Prospect,
        customerIdNumber: form.customerIdNumber || void 0
      });
      if (result.__kind__ === "err") {
        ue.error(result.err);
        return;
      }
      await refreshAccounts();
      setShowCreate(false);
      setForm({
        accountName: "",
        customerDomain: "",
        resellerOwnerId: "",
        vendorOwnerId: "",
        contractType: "",
        estimatedRenewalValue: "",
        customerIdNumber: ""
      });
      setCustomerIdStatus("idle");
      setCustomerIdMessage("");
      ue.success("Account created successfully");
    } catch {
      ue.error("Failed to create account");
    } finally {
      setSaving(false);
    }
  }
  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setRenewalWindow("all");
    setRenewalStatus("all");
    setRiskLevel("all");
    setResellerFilter("");
    setRegionFilter("");
    setProductFilter("");
    setContractValueMin("");
    setContractValueMax("");
    setAccountManagerFilter("");
  }
  const hasActiveFilters = search || statusFilter !== "all" || renewalWindow !== "all" || renewalStatus !== "all" || riskLevel !== "all" || resellerFilter || regionFilter || productFilter || contractValueMin || contractValueMax || accountManagerFilter;
  const showLoading = isLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 fade-in", children: [
    hasDuplicates && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-3 px-4 py-3 rounded-lg border",
        style: {
          background: "rgba(239,68,68,0.08)",
          borderColor: "rgba(239,68,68,0.25)"
        },
        "data-ocid": "accounts.duplicate_warning",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TriangleAlert,
            {
              size: 16,
              className: "text-red-400 flex-shrink-0 mt-0.5"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-red-300", children: "Duplicate accounts detected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Multiple accounts share the same customer domain. Review and merge duplicates to maintain data quality." })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
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
              "data-ocid": "accounts.search_input",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Search by name, domain or owner…",
              className: "crm-input pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "accounts.status.select",
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: "crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
            children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "accounts.renewal_window.select",
            value: renewalWindow,
            onChange: (e) => setRenewalWindow(e.target.value),
            className: "crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
            children: RENEWAL_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
          }
        ),
        isVendor() && resellerProfiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            "data-ocid": "accounts.reseller.select",
            value: resellerFilter,
            onChange: (e) => setResellerFilter(e.target.value),
            className: "crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Resellers" }),
              resellerProfiles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r.id, children: r.companyName }, r.id))
            ]
          }
        ),
        isVendor() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowAdvanced((v) => !v),
            className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg border border-border",
            "data-ocid": "accounts.advanced_filters.toggle",
            children: [
              "Filters",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  size: 12,
                  className: `transition-transform ${showAdvanced ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: clearFilters,
            className: "text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors",
            "data-ocid": "accounts.clear_filters.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
              " Clear"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
          isVendor() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              "data-ocid": "accounts.import.button",
              onClick: () => setShowImport(true),
              className: "flex-shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14, className: "mr-1.5" }),
                " Import"
              ]
            }
          ),
          canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              "data-ocid": "accounts.create.button",
              onClick: () => setShowCreate((v) => !v),
              className: "bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
                " New Account"
              ]
            }
          )
        ] })
      ] }),
      isVendor() && showAdvanced && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "crm-card p-4 fade-in",
          "data-ocid": "accounts.advanced_filters.panel",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                "data-ocid": "accounts.renewal_status.select",
                value: renewalStatus,
                onChange: (e) => setRenewalStatus(e.target.value),
                className: "crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
                children: RENEWAL_STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                "data-ocid": "accounts.risk_level.select",
                value: riskLevel,
                onChange: (e) => setRiskLevel(e.target.value),
                className: "crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer",
                children: RISK_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "accounts.product_filter.input",
                value: productFilter,
                onChange: (e) => setProductFilter(e.target.value),
                placeholder: "Filter by product…",
                className: "crm-input h-10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "accounts.contract_min.input",
                type: "number",
                value: contractValueMin,
                onChange: (e) => setContractValueMin(e.target.value),
                placeholder: "Min value",
                className: "crm-input h-10"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "accounts.contract_max.input",
                type: "number",
                value: contractValueMax,
                onChange: (e) => setContractValueMax(e.target.value),
                placeholder: "Max value",
                className: "crm-input h-10"
              }
            ),
            accountManagers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                "data-ocid": "accounts.account_manager.select",
                className: "crm-input text-sm px-3 py-2 h-10 rounded-[0.5rem] cursor-pointer col-span-2 sm:col-span-1",
                value: accountManagerFilter,
                onChange: (e) => setAccountManagerFilter(e.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Account Managers" }),
                  accountManagers.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: m, children: m }, m))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "accounts.distributor_filter.input",
                value: regionFilter,
                onChange: (e) => setRegionFilter(e.target.value),
                placeholder: "Filter by region…",
                className: "crm-input h-10"
              }
            )
          ] })
        }
      )
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crm-card p-5 fade-in", "data-ocid": "accounts.create.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-foreground font-semibold text-sm", children: "New Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowCreate(false),
            className: "text-muted-foreground hover:text-foreground transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleCreate,
          className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "acc-name",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Account Name *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "acc-name",
                  required: true,
                  "data-ocid": "accounts.name.input",
                  value: form.accountName,
                  onChange: (e) => setForm({ ...form, accountName: e.target.value }),
                  className: "crm-input",
                  placeholder: "Acme Ltd"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  htmlFor: "acc-customer-id",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: [
                    "Customer ID",
                    customerIdFormat && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "ml-2 font-mono text-[10px]",
                        style: { color: "#FF6B2B" },
                        children: [
                          "Format: ",
                          customerIdFormat
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "acc-customer-id",
                      "data-ocid": "accounts.customer_id.input",
                      value: form.customerIdNumber,
                      onChange: (e) => {
                        setForm({ ...form, customerIdNumber: e.target.value });
                        setCustomerIdStatus("idle");
                        checkCustomerId(e.target.value);
                      },
                      onBlur: () => validateCustomerIdFormat(form.customerIdNumber),
                      className: `crm-input pr-8 ${customerIdStatus === "duplicate" || customerIdStatus === "invalid" ? "border-red-500/60" : customerIdStatus === "valid" ? "border-emerald-500/40" : ""}`,
                      placeholder: "e.g. UK-LON-000145"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-2.5 top-1/2 -translate-y-1/2", children: [
                    customerIdStatus === "checking" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RefreshCw,
                      {
                        size: 13,
                        className: "animate-spin text-muted-foreground"
                      }
                    ),
                    customerIdStatus === "valid" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13, className: "text-emerald-400" }),
                    (customerIdStatus === "duplicate" || customerIdStatus === "invalid") && /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13, className: "text-red-400" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleAutoGenerateId,
                    disabled: generatingId,
                    className: "px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0",
                    style: {
                      background: "rgba(255,107,43,0.1)",
                      color: "#FF6B2B",
                      border: "1px solid rgba(255,107,43,0.25)"
                    },
                    "data-ocid": "accounts.customer_id_auto_generate.button",
                    children: generatingId ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: "animate-spin" }) : "Auto-generate"
                  }
                )
              ] }),
              customerIdMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-[10px] mt-1 ${customerIdStatus === "valid" ? "text-emerald-400" : "text-red-400"}`,
                  "data-ocid": "accounts.customer_id.field_error",
                  children: customerIdMessage
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "acc-domain",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Customer Domain *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "acc-domain",
                  required: true,
                  "data-ocid": "accounts.domain.input",
                  value: form.customerDomain,
                  onChange: (e) => setForm({ ...form, customerDomain: e.target.value }),
                  className: "crm-input",
                  placeholder: "acme.com"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "acc-reseller",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Reseller Owner"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "acc-reseller",
                  value: form.resellerOwnerId,
                  onChange: (e) => setForm({ ...form, resellerOwnerId: e.target.value }),
                  className: "crm-input",
                  placeholder: "Partner name or ID"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "acc-contract",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Contract Type"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "acc-contract",
                  value: form.contractType,
                  onChange: (e) => setForm({ ...form, contractType: e.target.value }),
                  className: "crm-input",
                  placeholder: "Annual, 3-year…"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "acc-value",
                  className: "block text-xs text-muted-foreground mb-1",
                  children: "Estimated Renewal Value"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "acc-value",
                  type: "number",
                  value: form.estimatedRenewalValue,
                  onChange: (e) => setForm({ ...form, estimatedRenewalValue: e.target.value }),
                  className: "crm-input",
                  placeholder: "25000"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex gap-3 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  "data-ocid": "accounts.cancel.button",
                  onClick: () => setShowCreate(false),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  "data-ocid": "accounts.submit_button",
                  disabled: saving,
                  className: "bg-primary text-primary-foreground hover:bg-primary/90",
                  children: saving ? "Creating…" : "Create Account"
                }
              )
            ] })
          ]
        }
      )
    ] }),
    showImport && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card p-5 fade-in", "data-ocid": "accounts.import.panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      BulkUpload,
      {
        onComplete: () => {
          setShowImport(false);
          refreshAccounts();
        }
      }
    ) }),
    !showLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      filtered.length,
      " account",
      filtered.length !== 1 ? "s" : "",
      hasActiveFilters ? " matching filters" : " total",
      isReseller() && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-secondary", children: "Your workspace" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crm-card overflow-hidden", children: showLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16",
        "data-ocid": "accounts.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 40, className: "text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: hasActiveFilters ? "No accounts match your filters" : "No accounts yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: hasActiveFilters ? "Try adjusting your search or filter criteria." : "Add accounts manually or import via CSV/Excel." }),
          hasActiveFilters ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: clearFilters,
              "data-ocid": "accounts.empty.clear_button",
              children: "Clear Filters"
            }
          ) : canCreate ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setShowCreate(true),
              className: "bg-primary text-primary-foreground hover:bg-primary/90",
              "data-ocid": "accounts.empty.create_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
                " Create Account"
              ]
            }
          ) : null
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Domain" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: isVendor() ? "Reseller Owner" : "Vendor Owner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Renewal Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((a, i) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `accounts.item.${i + 1}`,
            onClick: () => navigate({ to: "/accounts/$id", params: { id: a.id } }),
            onKeyDown: (e) => e.key === "Enter" && navigate({ to: "/accounts/$id", params: { id: a.id } }),
            tabIndex: 0,
            className: "border-b border-border/50 last:border-0 hover:bg-[var(--hover-bg)] transition-colors duration-150 cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs",
                    style: {
                      background: "rgba(255,107,43,0.15)",
                      color: "#FF6B2B"
                    },
                    children: (_a = a.accountName[0]) == null ? void 0 : _a.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-medium text-foreground truncate max-w-[200px]",
                    title: a.accountName,
                    children: a.accountName
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "truncate max-w-[160px] block",
                  title: a.customerDomain || void 0,
                  children: a.customerDomain || "—"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-muted-foreground", children: (() => {
                var _a2;
                const name = isVendor() ? ((_a2 = resellerProfiles.find(
                  (r) => r.id === a.resellerOwnerId
                )) == null ? void 0 : _a2.companyName) ?? a.resellerOwnerId : a.vendorOwnerId;
                return name ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "truncate max-w-[160px] block",
                    title: name,
                    children: name
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 italic", children: "Unassigned" });
              })() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RenewalCell, { ns: a.renewalDate }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5 text-right tabular-nums font-mono text-foreground", children: new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
                notation: "compact"
              }).format(a.estimatedRenewalValue) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `${accountStatusColor(a.status)} min-w-[80px] inline-flex justify-center`,
                  children: a.status
                }
              ) })
            ]
          },
          a.id
        );
      }) })
    ] }) }) })
  ] });
}
export {
  AccountsList
};
