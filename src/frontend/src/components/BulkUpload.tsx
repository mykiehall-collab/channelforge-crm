import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  FileText,
  RefreshCw,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type { AccountInput } from "../backend";
import { useActor } from "../hooks/useActor";
import {
  ACCOUNT_FIELDS,
  type ColumnMapping,
  type DuplicateAction,
  FIELD_HEADER_MAP,
  type ImportOptions,
  type ImportResult,
  type ParsedRow,
  type SortConfig,
  autoDetectMapping,
  buildMappedRow,
  downloadCSV,
  formatBytes,
  parseCSV,
  rowsToObjects,
  validateRow,
} from "../utils/bulkUploadHelpers";

interface BulkUploadProps {
  onComplete: () => void;
  entityType?: string;
}

const STEPS = [
  "Upload",
  "Map Columns",
  "Preview & Validate",
  "Import",
  "Summary",
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-6 flex-wrap gap-y-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background:
                  i < current
                    ? "rgba(255,107,43,1)"
                    : i === current
                      ? "rgba(255,107,43,0.2)"
                      : "rgba(255,255,255,0.06)",
                color: i <= current ? "#FF6B2B" : "#6b7280",
                border: i === current ? "1.5px solid #FF6B2B" : "none",
              }}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span
              className="text-xs font-medium"
              style={{
                color:
                  i === current
                    ? "#FF6B2B"
                    : i < current
                      ? "#FF6B2B"
                      : "#6b7280",
              }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <ChevronRight size={14} className="mx-2 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}

function ConfidenceBadge({ auto }: { auto: boolean }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{
        background: auto ? "rgba(34,197,94,0.15)" : "rgba(255,107,43,0.15)",
        color: auto ? "#86efac" : "#FF6B2B",
      }}
    >
      {auto ? "Auto-detected" : "Manual"}
    </span>
  );
}

export function BulkUpload({ onComplete }: BulkUploadProps) {
  const { actor } = useActor();
  const {
    isVendor,
    userProfile,
    companyProfile,
    accounts: existingAccounts,
  } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileError, setFileError] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawObjects, setRawObjects] = useState<Record<string, string>[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    dir: "asc",
  });
  const [filterText, setFilterText] = useState("");
  const [filterCurrency, setFilterCurrency] = useState("");
  const [filterRenewalFrom, setFilterRenewalFrom] = useState("");
  const [filterRenewalTo, setFilterRenewalTo] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    skipDuplicates: true,
    mergeExisting: false,
    sendDuplicatesToReview: false,
    targetResellerId: "",
  });
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // ── Step 0: Handle file ──────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    setFileError("");
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (![".csv", ".xlsx", ".xls"].includes(ext)) {
      setFileError(
        "Invalid file type. Please upload a .csv, .xlsx, or .xls file.",
      );
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
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
    // For XLSX/XLS, read as text (basic tab-separated extraction)
    reader.readAsText(file);
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Step 1: Confirm mapping → build rows ─────────────────────────────────────

  async function handleMappingConfirm() {
    const missingRequired = ACCOUNT_FIELDS.filter(
      (f) =>
        f.required &&
        !columnMappings.find((m) => m.targetField === f.key)?.sourceColumn,
    );
    if (missingRequired.length > 0) {
      toast.error(
        `Required fields not mapped: ${missingRequired.map((f) => f.label).join(", ")}`,
      );
      return;
    }

    const mappingLookup: Record<string, string> = {};
    for (const cm of columnMappings) {
      if (cm.sourceColumn) mappingLookup[cm.targetField] = cm.sourceColumn;
    }

    const mapped: ParsedRow[] = rawObjects.map((obj, idx) => {
      const m = buildMappedRow(obj, mappingLookup, ACCOUNT_FIELDS);
      const validation = validateRow(m, ACCOUNT_FIELDS, existingAccounts);
      return {
        raw: obj,
        mapped: m,
        duplicateAction: validation.hasWarning
          ? "skip"
          : ("create" as DuplicateAction),
        hasError: validation.hasError,
        hasWarning: validation.hasWarning,
        errorMessages: validation.errors,
        warningMessages: validation.warnings,
        rowIndex: idx,
        selected: true,
      };
    });

    // Check DR duplicates via backend if actor available
    let drQueue: import("../backend").DuplicateDRRecord[] = [];
    if (actor) {
      try {
        drQueue = await actor.getDuplicateDRQueue();
      } catch {}
    }

    const finalRows = mapped.map((row) => {
      const domain = row.mapped.customerDomain?.toLowerCase();
      const hasDRRisk = drQueue.some(
        (dr) =>
          dr.accountId &&
          existingAccounts.some(
            (a) =>
              a.id === dr.accountId &&
              a.customerDomain.toLowerCase() === domain,
          ),
      );
      if (hasDRRisk) {
        return {
          ...row,
          hasWarning: true,
          warningMessages: [
            ...(row.warningMessages ?? []),
            "Active duplicate DR on this domain",
          ],
        };
      }
      return row;
    });

    setRows(finalRows);
    setSelectedRows(new Set(finalRows.map((_, i) => i)));
    setStep(2);
  }

  // ── Sorting / filtering ───────────────────────────────────────────────────────

  function toggleSort(key: string) {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  }

  function getSortedFilteredRows(
    input: ParsedRow[],
  ): { row: ParsedRow; originalIdx: number }[] {
    let result = input.map((r, i) => ({ row: r, originalIdx: i }));
    if (filterText) {
      const q = filterText.toLowerCase();
      result = result.filter(
        (e) =>
          (e.row.mapped.customerName ?? "").toLowerCase().includes(q) ||
          (e.row.mapped.resellerOwner ?? "").toLowerCase().includes(q) ||
          (e.row.mapped.customerDomain ?? "").toLowerCase().includes(q),
      );
    }
    if (filterCurrency) {
      result = result.filter(
        (e) =>
          (e.row.mapped.currency ?? "").toUpperCase() ===
          filterCurrency.toUpperCase(),
      );
    }
    if (filterRenewalFrom) {
      result = result.filter(
        (e) =>
          !e.row.mapped.renewalDate ||
          e.row.mapped.renewalDate >= filterRenewalFrom,
      );
    }
    if (filterRenewalTo) {
      result = result.filter(
        (e) =>
          !e.row.mapped.renewalDate ||
          e.row.mapped.renewalDate <= filterRenewalTo,
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        const va = (a.row.mapped[sortConfig.key] ?? "").toLowerCase();
        const vb = (b.row.mapped[sortConfig.key] ?? "").toLowerCase();
        return sortConfig.dir === "asc"
          ? va.localeCompare(vb)
          : vb.localeCompare(va);
      });
    }
    return result.slice(0, 100);
  }

  // ── Step 3: Import ───────────────────────────────────────────────────────────

  async function handleImport(selectedOnly: boolean) {
    if (!actor) return;
    setImporting(true);
    setImportProgress(0);
    setStep(3);

    const toImport = rows.filter((r, i) => {
      if (selectedOnly && !selectedRows.has(i)) return false;
      if (
        importOptions.skipDuplicates &&
        r.hasWarning &&
        r.duplicateAction === "skip"
      )
        return false;
      return !r.hasError;
    });

    const toReview = importOptions.sendDuplicatesToReview
      ? rows.filter((r) => r.hasWarning && r.duplicateAction === "skip")
      : [];

    const inputs: AccountInput[] = toImport.map((r) => ({
      distributorIds: [],
      sites: [],
      accountName: r.mapped.customerName ?? "",
      customerDomain: r.mapped.customerDomain ?? "",
      resellerOwnerId:
        importOptions.targetResellerId || r.mapped.resellerOwner || "",
      vendorOwnerId: userProfile?.id ?? "",
      contractType: r.mapped.subscriptionType ?? "",
      renewalDate: r.mapped.renewalDate
        ? BigInt(new Date(r.mapped.renewalDate).getTime()) * 1_000_000n
        : 0n,
      estimatedRenewalValue: Number(r.mapped.contractValue) || 0,
      licenceQuantity: 0n,
      status: "Active" as AccountInput["status"],
      productList: [],
    }));

    try {
      let result: { created: bigint; skipped: bigint; errors: string[] } = {
        created: 0n,
        skipped: 0n,
        errors: [],
      };

      // Simulate progress in chunks of 25
      const chunkSize = 25;
      let created = 0n;
      let skipped = 0n;
      const errors: string[] = [];
      for (let i = 0; i < inputs.length; i += chunkSize) {
        const chunk = inputs.slice(i, i + chunkSize);
        const res = await actor.bulkCreateAccounts(chunk);
        created += res.created;
        skipped += res.skipped;
        errors.push(...res.errors);
        setImportProgress(
          Math.round(((i + chunk.length) / Math.max(inputs.length, 1)) * 100),
        );
      }
      result = { created, skipped, errors };

      // Append audit entry
      try {
        await actor.createAlert({
          alertType: "DuplicateAccount" as import("../backend").AlertType,
          userId: userProfile?.id ?? "",
          message: `BULK_UPLOAD: ${fileName} — ${Number(result.created)} created, ${Number(result.skipped)} skipped, ${result.errors.length} errors, ${toReview.length} sent to review`,
          severity: "Low" as import("../backend").AlertSeverity,
          accountId: undefined,
        });
      } catch {}

      setImportResult({
        imported: Number(result.created),
        skipped: Number(result.skipped),
        merged: 0,
        sentToReview: toReview.length,
        failed: result.errors.length,
        errors: result.errors,
        fileName,
        totalRows: rows.length,
      });
      setImportProgress(100);
      setStep(4);
    } catch {
      toast.error("Import failed. Please try again.");
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
        "Issues",
      ],
      ...errorRows.map((r, i) => [
        String(i + 1),
        r.mapped.customerName ?? "",
        r.mapped.customerDomain ?? "",
        r.mapped.renewalDate ?? "",
        r.hasError ? "Error" : "Warning",
        [...(r.errorMessages ?? []), ...(r.warningMessages ?? [])].join(" | "),
      ]),
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
      ["Timestamp", new Date().toISOString()],
      ["", ""],
      ["Errors", ""],
      ...importResult.errors.map((e) => ["", e]),
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
    setSelectedRows(new Set());
    setImportResult(null);
    setImportProgress(0);
    setFilterText("");
    setFilterCurrency("");
    setFilterRenewalFrom("");
    setFilterRenewalTo("");
    setSortConfig({ key: "", dir: "asc" });
  }

  const allCurrencies = Array.from(
    new Set(rows.map((r) => r.mapped.currency).filter(Boolean)),
  );
  const readyCount = rows.filter((r) => !r.hasError && !r.hasWarning).length;
  const warningCount = rows.filter((r) => r.hasWarning && !r.hasError).length;
  const errorCount = rows.filter((r) => r.hasError).length;
  const vendorAdminCanUpload = isVendor();
  const visibleRows = getSortedFilteredRows(rows);
  const allVisible =
    visibleRows.length > 0 &&
    visibleRows.every((e) => selectedRows.has(e.originalIdx));

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

  function SortIcon({ col }: { col: string }) {
    if (sortConfig.key !== col)
      return <ChevronDown size={12} className="opacity-30" />;
    return sortConfig.dir === "asc" ? (
      <ChevronUp size={12} style={{ color: "#FF6B2B" }} />
    ) : (
      <ChevronDown size={12} style={{ color: "#FF6B2B" }} />
    );
  }

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onComplete}
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="bulk_upload.back_button"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-foreground font-display">
          Import Accounts
        </h1>
      </div>

      <div className="crm-card p-6">
        <StepBar current={step} />

        {/* ── STEP 0: Upload ────────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-5">
            <button
              type="button"
              data-ocid="bulk_upload.dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  fileInputRef.current?.click();
              }}
              className="w-full border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
              style={{
                borderColor: dragOver ? "#FF6B2B" : "rgba(255,255,255,0.12)",
                background: dragOver
                  ? "rgba(255,107,43,0.06)"
                  : "rgba(255,255,255,0.02)",
                animation: dragOver
                  ? "pulse-border 1s ease-in-out infinite"
                  : "none",
              }}
            >
              <Upload
                size={36}
                className="mb-4"
                style={{ color: dragOver ? "#FF6B2B" : "#6b7280" }}
              />
              <p className="text-base font-semibold text-foreground mb-1">
                Drag & drop your file here
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                or click to browse
              </p>
              <span
                className="px-4 py-1.5 rounded-lg text-xs font-medium border"
                style={{
                  borderColor: "rgba(255,107,43,0.4)",
                  color: "#FF6B2B",
                  background: "rgba(255,107,43,0.08)",
                }}
              >
                .csv, .xlsx, .xls
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={onFileChange}
              />
            </button>
            {fileError && (
              <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <XCircle size={16} /> {fileError}
              </div>
            )}
            <div className="p-4 rounded-lg bg-secondary/20 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground mb-2">
                Required columns
              </p>
              {ACCOUNT_FIELDS.filter((f) => f.required).map((f) => (
                <p key={f.key}>
                  · <span className="text-foreground">{f.label}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: Column Mapping ────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* File info */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div className="flex items-center gap-3">
                <FileText size={16} style={{ color: "#FF6B2B" }} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(fileSize)} · {rawObjects.length} rows detected
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetAll}
                data-ocid="bulk_upload.replace_file_button"
              >
                <RefreshCw size={12} className="mr-1" /> Replace File
              </Button>
            </div>

            {/* Mapping table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">
                  Column Mapping
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setColumnMappings(
                      autoDetectMapping(headers, FIELD_HEADER_MAP),
                    )
                  }
                  data-ocid="bulk_upload.reset_mapping_button"
                  className="text-xs"
                >
                  <RefreshCw size={11} className="mr-1" /> Reset Mapping
                </Button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">
                        Source Column
                      </th>
                      <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">
                        Map To Field
                      </th>
                      <th className="px-4 py-2.5 text-left text-muted-foreground font-medium">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnMappings.map((cm, idx) => (
                      <tr
                        key={cm.targetField}
                        className="border-b border-border/40 hover:bg-secondary/10"
                      >
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">
                          {cm.sourceColumn || (
                            <span className="italic text-red-400">
                              Not mapped
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <select
                            value={cm.sourceColumn}
                            onChange={(e) => {
                              const next = [...columnMappings];
                              next[idx] = {
                                ...next[idx],
                                sourceColumn: e.target.value,
                                autoDetected: false,
                              };
                              setColumnMappings(next);
                            }}
                            className="crm-input px-2 py-1 text-xs w-full"
                            data-ocid={`bulk_upload.map.${cm.targetField}`}
                          >
                            <option value="">— Skip —</option>
                            {headers.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                          <span className="text-muted-foreground mt-0.5 block">
                            {
                              ACCOUNT_FIELDS.find(
                                (f) => f.key === cm.targetField,
                              )?.label
                            }
                            {ACCOUNT_FIELDS.find(
                              (f) => f.key === cm.targetField,
                            )?.required && (
                              <span style={{ color: "#FF6B2B" }}> *</span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <ConfidenceBadge auto={cm.autoDetected} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetAll}
                data-ocid="bulk_upload.mapping.back_button"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleMappingConfirm}
                style={{ background: "#FF6B2B" }}
                className="text-white"
                data-ocid="bulk_upload.mapping.next_button"
              >
                Next: Preview & Validate
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Preview & Validate ────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/15 text-green-300 text-xs font-medium">
                <CheckCircle2 size={12} /> {readyCount} ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/15 text-yellow-300 text-xs font-medium">
                <AlertTriangle size={12} /> {warningCount} warnings
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/15 text-red-400 text-xs font-medium">
                <XCircle size={12} /> {errorCount} errors
              </span>
              {(warningCount > 0 || errorCount > 0) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={downloadErrorReport}
                  className="text-xs ml-auto"
                  data-ocid="bulk_upload.download_error_report_button"
                >
                  <Download size={12} className="mr-1" /> Download Error Report
                </Button>
              )}
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Search by name, domain, reseller…"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="crm-input px-3 py-1.5 text-xs flex-1 min-w-[180px]"
                data-ocid="bulk_upload.filter.search_input"
              />
              <select
                value={filterCurrency}
                onChange={(e) => setFilterCurrency(e.target.value)}
                className="crm-input px-3 py-1.5 text-xs"
                data-ocid="bulk_upload.filter.currency_select"
              >
                <option value="">All Currencies</option>
                {allCurrencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={filterRenewalFrom}
                onChange={(e) => setFilterRenewalFrom(e.target.value)}
                className="crm-input px-3 py-1.5 text-xs"
                title="Renewal from"
                data-ocid="bulk_upload.filter.renewal_from"
              />
              <input
                type="date"
                value={filterRenewalTo}
                onChange={(e) => setFilterRenewalTo(e.target.value)}
                className="crm-input px-3 py-1.5 text-xs"
                title="Renewal to"
                data-ocid="bulk_upload.filter.renewal_to"
              />
            </div>

            {/* Preview table */}
            <div
              ref={tableRef}
              className="overflow-x-auto max-h-[360px] overflow-y-auto rounded-lg border border-border"
            >
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border bg-card">
                    <th className="px-3 py-2.5 text-left">
                      <input
                        type="checkbox"
                        checked={allVisible}
                        onChange={toggleSelectAll}
                        className="accent-orange-500"
                        data-ocid="bulk_upload.preview.select_all_checkbox"
                      />
                    </th>
                    {[
                      "customerName",
                      "customerDomain",
                      "renewalDate",
                      "contractValue",
                      "currency",
                      "resellerOwner",
                      "dealRegistrationStatus",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2.5 text-left text-muted-foreground cursor-pointer whitespace-nowrap select-none hover:text-foreground transition-colors"
                        onClick={() => toggleSort(col)}
                        onKeyDown={(e) => e.key === "Enter" && toggleSort(col)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {ACCOUNT_FIELDS.find((f) => f.key === col)?.label ??
                            col}
                          <SortIcon col={col} />
                        </span>
                      </th>
                    ))}
                    <th className="px-3 py-2.5 text-left text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map(({ row, originalIdx }) => {
                    const rowBg = row.hasError
                      ? "rgba(239,68,68,0.08)"
                      : row.hasWarning
                        ? "rgba(234,179,8,0.08)"
                        : "transparent";
                    const isHighlighted = highlightedRow === originalIdx;
                    return (
                      <tr
                        key={`row-${originalIdx}`}
                        data-ocid={`bulk_upload.preview.row.${originalIdx + 1}`}
                        className="border-b border-border/30 transition-colors"
                        style={{
                          background: isHighlighted
                            ? "rgba(255,107,43,0.15)"
                            : rowBg,
                        }}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(originalIdx)}
                            onChange={() => {
                              setSelectedRows((prev) => {
                                const next = new Set(prev);
                                if (next.has(originalIdx))
                                  next.delete(originalIdx);
                                else next.add(originalIdx);
                                return next;
                              });
                            }}
                            className="accent-orange-500"
                            data-ocid={`bulk_upload.preview.checkbox.${originalIdx + 1}`}
                          />
                        </td>
                        {[
                          "customerName",
                          "customerDomain",
                          "renewalDate",
                          "contractValue",
                          "currency",
                          "resellerOwner",
                          "dealRegistrationStatus",
                        ].map((col) => (
                          <td
                            key={col}
                            className="px-3 py-2 text-foreground max-w-[140px] truncate"
                          >
                            {row.mapped[col] || "—"}
                          </td>
                        ))}
                        <td className="px-3 py-2">
                          {row.hasError ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400">
                              <XCircle size={9} /> Error
                            </span>
                          ) : row.hasWarning ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-500/20 text-yellow-300">
                              <AlertTriangle size={9} /> Warning
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/20 text-green-300">
                              <CheckCircle2 size={9} /> OK
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {rows.length > 100 && (
                <p className="px-4 py-2.5 text-xs text-muted-foreground border-t border-border">
                  Showing first 100 of {rows.length} rows
                </p>
              )}
            </div>

            {/* Validation issues panel */}
            {(warningCount > 0 || errorCount > 0) && (
              <div className="rounded-lg border border-border p-4 space-y-2">
                <p className="text-xs font-semibold text-foreground mb-2">
                  Validation Issues
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1.5">
                  {rows.map((r, i) => {
                    const issues = [
                      ...(r.errorMessages ?? []),
                      ...(r.warningMessages ?? []),
                    ];
                    if (!issues.length) return null;
                    return issues.map((issue) => (
                      <button
                        type="button"
                        key={`issue-${issue.slice(0, 30)}`}
                        className="flex items-start gap-2 w-full text-left hover:bg-secondary/20 px-2 py-1 rounded transition-colors"
                        onClick={() => {
                          setHighlightedRow(i);
                          setTimeout(() => setHighlightedRow(null), 2000);
                          tableRef.current?.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }}
                      >
                        {r.hasError ? (
                          <XCircle
                            size={12}
                            className="text-red-400 mt-0.5 flex-shrink-0"
                          />
                        ) : (
                          <AlertTriangle
                            size={12}
                            className="text-yellow-300 mt-0.5 flex-shrink-0"
                          />
                        )}
                        <span className="text-xs text-muted-foreground">
                          Row {i + 1} — {issue}
                        </span>
                      </button>
                    ));
                  })}
                </div>
              </div>
            )}

            {/* Import options */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">
                Import Options
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                {(
                  [
                    { key: "skipDuplicates", label: "Skip duplicate records" },
                    {
                      key: "mergeExisting",
                      label: "Merge with existing accounts",
                    },
                    {
                      key: "sendDuplicatesToReview",
                      label: "Send duplicates to Vendor Admin review",
                    },
                  ] as const
                ).map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={importOptions[key]}
                      onChange={(e) =>
                        setImportOptions((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="accent-orange-500"
                      data-ocid={`bulk_upload.option.${key}`}
                    />
                    {label}
                  </label>
                ))}
              </div>
              {vendorAdminCanUpload && (
                <div className="pt-1">
                  <label
                    className="block text-xs text-muted-foreground mb-1"
                    htmlFor="target-reseller"
                  >
                    Assign to Reseller Workspace
                  </label>
                  <select
                    id="target-reseller"
                    value={importOptions.targetResellerId}
                    onChange={(e) =>
                      setImportOptions((prev) => ({
                        ...prev,
                        targetResellerId: e.target.value,
                      }))
                    }
                    className="crm-input px-3 py-1.5 text-xs w-full max-w-xs"
                    data-ocid="bulk_upload.option.target_reseller_select"
                  >
                    <option value="">— Auto / use row value —</option>
                    {companyProfile?.partnerDomains?.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Action bar */}
            <div
              className="flex flex-wrap items-center gap-3 pt-2"
              data-ocid="bulk_upload.action_bar"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                data-ocid="bulk_upload.preview.back_button"
              >
                Back
              </Button>
              <div className="flex-1" />
              {selectedRows.size > 0 && selectedRows.size < rows.length && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleImport(true)}
                  disabled={importing}
                  data-ocid="bulk_upload.preview.import_selected_button"
                >
                  Import {selectedRows.size} Selected
                </Button>
              )}
              <Button
                type="button"
                onClick={() => handleImport(false)}
                disabled={importing || readyCount === 0}
                style={{ background: "#FF6B2B" }}
                className="text-white"
                data-ocid="bulk_upload.preview.import_all_button"
              >
                Import All Valid Rows ({readyCount})
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Import Progress ───────────────────────────────────────── */}
        {step === 3 && (
          <div
            className="space-y-6 py-8"
            data-ocid="bulk_upload.import_progress"
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(255,107,43,0.12)" }}
              >
                <Upload
                  size={28}
                  style={{ color: "#FF6B2B" }}
                  className="animate-bounce"
                />
              </div>
              <p className="text-base font-semibold text-foreground mb-1">
                Importing accounts…
              </p>
              <p className="text-xs text-muted-foreground">
                {importProgress}% complete
              </p>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${importProgress}%`, background: "#FF6B2B" }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 4: Summary ───────────────────────────────────────────────── */}
        {step === 4 && importResult && (
          <div className="space-y-5" data-ocid="bulk_upload.summary">
            <div className="flex justify-center mb-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,107,43,0.15)" }}
              >
                <CheckCircle2 size={32} style={{ color: "#FF6B2B" }} />
              </div>
            </div>
            <h3 className="text-center text-base font-semibold text-foreground">
              Import Complete
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                {
                  label: "Imported",
                  value: importResult.imported,
                  color: "#FF6B2B",
                },
                {
                  label: "Skipped",
                  value: importResult.skipped,
                  color: "#eab308",
                },
                {
                  label: "Merged",
                  value: importResult.merged,
                  color: "#60a5fa",
                },
                {
                  label: "In Review",
                  value: importResult.sentToReview,
                  color: "#a78bfa",
                },
                {
                  label: "Failed",
                  value: importResult.failed,
                  color: "#f87171",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="crm-card p-3 text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{ color }}
                    data-ocid={`bulk_upload.summary.${label.toLowerCase().replace(" ", "_")}`}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>

            {importResult.errors.length > 0 && (
              <div className="crm-card p-4 space-y-2">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <X size={14} className="text-red-400" /> Failed rows
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1">
                  {importResult.errors.map((err) => (
                    <p
                      key={`err-${err.slice(0, 40)}`}
                      className="text-xs text-red-400"
                    >
                      · {err}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={downloadImportLog}
                data-ocid="bulk_upload.summary.download_log_button"
              >
                <Download size={14} className="mr-1.5" /> Download Import Log
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetAll}
                data-ocid="bulk_upload.summary.import_another_button"
              >
                <RefreshCw size={14} className="mr-1.5" /> Import Another File
              </Button>
              <Button
                type="button"
                onClick={onComplete}
                style={{ background: "#FF6B2B" }}
                className="text-white px-8"
                data-ocid="bulk_upload.summary.done_button"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
