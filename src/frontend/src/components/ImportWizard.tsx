import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  X,
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

export const EXPECTED_FIELDS = [
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
  { key: "billingFrequency", label: "Billing Frequency", required: false },
] as const;

type FieldKey = (typeof EXPECTED_FIELDS)[number]["key"];

export interface MappedRow {
  sku: string;
  productName: string;
  productFamily: string;
  vendor: string;
  region: string;
  currency: string;
  basePrice: string;
  promoPrice: string;
  renewalPrice: string;
  incentivePct: string;
  distributorCost: string;
  resellerCost: string;
  contractTerm: string;
  billingFrequency: string;
  _rowIndex: number;
  _issues: string[];
}

export interface ImportSummary {
  rows: MappedRow[];
  validCount: number;
  invalidCount: number;
  duplicateSkus: string[];
  intraFileDupes: string[];
}

interface ImportWizardProps {
  open: boolean;
  onClose: () => void;
  rawHeaders: string[];
  rawRows: string[][];
  existingSkus?: Set<string>;
  onImport: (summary: ImportSummary) => void;
}

const STEP_LABELS = [
  "Preview",
  "Map Columns",
  "Validation",
  "Review",
  "Import",
];

function autoDetectMapping(
  headers: string[],
): Partial<Record<FieldKey, string>> {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const aliases: Record<FieldKey, string[]> = {
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
      "billingcycle",
    ],
  };
  const result: Partial<Record<FieldKey, string>> = {};
  for (const header of headers) {
    const n = norm(header);
    for (const [field, keys] of Object.entries(aliases) as [
      FieldKey,
      string[],
    ][]) {
      if (!result[field] && keys.includes(n)) {
        result[field] = header;
        break;
      }
    }
  }
  return result;
}

function buildMappedRows(
  rawRows: string[][],
  headers: string[],
  mapping: Partial<Record<FieldKey, string>>,
  existingSkus: Set<string>,
): ImportSummary {
  const getIdx = (field: FieldKey) => {
    const col = mapping[field];
    if (!col) return -1;
    return headers.indexOf(col);
  };
  const skusSeen = new Set<string>();
  const intraFileDupes: string[] = [];
  const duplicateSkus: string[] = [];
  const rows: MappedRow[] = rawRows.map((row, idx) => {
    const get = (field: FieldKey) => {
      const i = getIdx(field);
      return i >= 0 ? (row[i] ?? "").trim() : "";
    };
    const issues: string[] = [];
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
      _issues: issues,
    };
  });
  const validCount = rows.filter((r) => r._issues.length === 0).length;
  return {
    rows,
    validCount,
    invalidCount: rows.length - validCount,
    duplicateSkus,
    intraFileDupes,
  };
}

export function ImportWizard({
  open,
  onClose,
  rawHeaders,
  rawRows,
  existingSkus = new Set(),
  onImport,
}: ImportWizardProps) {
  const [step, setStep] = useState(0);
  const [mapping, setMapping] = useState<Partial<Record<FieldKey, string>>>(
    () => autoDetectMapping(rawHeaders),
  );
  const [skipInvalid, setSkipInvalid] = useState(true);
  const [dupeAction, setDupeAction] = useState<"skip" | "overwrite">("skip");

  const summary = useMemo(
    () => buildMappedRows(rawRows, rawHeaders, mapping, existingSkus),
    [rawRows, rawHeaders, mapping, existingSkus],
  );

  const handleClose = useCallback(() => {
    setStep(0);
    onClose();
  }, [onClose]);

  const doImport = useCallback(() => {
    onImport(summary);
    handleClose();
  }, [onImport, summary, handleClose]);

  const validToImport = skipInvalid
    ? summary.rows.filter((r) => r._issues.length === 0).length
    : summary.rows.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[88vh] overflow-hidden flex flex-col"
        style={{ background: "#0e1b2e", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-foreground font-display flex items-center justify-between">
            <span>Import Price Data</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="shrink-0 flex items-center gap-1 px-1 pb-3 border-b border-border/40">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={label}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors ${
                  i === step
                    ? "text-white font-semibold"
                    : i < step
                      ? "text-muted-foreground hover:text-foreground cursor-pointer"
                      : "text-muted-foreground/40 cursor-default"
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0"
                  style={{
                    background:
                      i === step
                        ? "#FF6B2B"
                        : i < step
                          ? "rgba(255,107,43,0.3)"
                          : "rgba(255,255,255,0.1)",
                    color: i <= step ? "white" : "",
                  }}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                {label}
              </button>
              {i < STEP_LABELS.length - 1 && (
                <ChevronRight
                  size={12}
                  className="text-muted-foreground/30 shrink-0"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-4 py-1">
          {step === 0 && <Step0Preview headers={rawHeaders} rows={rawRows} />}
          {step === 1 && (
            <Step1Mapping
              headers={rawHeaders}
              mapping={mapping}
              setMapping={setMapping}
            />
          )}
          {step === 2 && (
            <Step2Validation
              summary={summary}
              dupeAction={dupeAction}
              setDupeAction={setDupeAction}
            />
          )}
          {step === 3 && (
            <Step3Preview summary={summary} skipInvalid={skipInvalid} />
          )}
          {step === 4 && (
            <Step4Import
              summary={summary}
              validToImport={validToImport}
              skipInvalid={skipInvalid}
              setSkipInvalid={setSkipInvalid}
            />
          )}
        </div>

        {/* Footer navigation */}
        <div className="shrink-0 flex justify-between items-center pt-3 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 0 ? handleClose() : setStep((s) => s - 1))}
            className="border-border text-foreground hover:bg-secondary/40"
          >
            {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="text-white"
              style={{ background: "#FF6B2B" }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              data-ocid="import_wizard.confirm_button"
              onClick={doImport}
              disabled={validToImport === 0}
              className="text-white"
              style={{ background: "#FF6B2B" }}
            >
              Import {validToImport} row{validToImport !== 1 ? "s" : ""}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Step sub-components ─────────────────────────────────────────── */

function Step0Preview({
  headers,
  rows,
}: { headers: string[]; rows: string[][] }) {
  const preview = rows.slice(0, 5);
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Detected{" "}
        <strong className="text-foreground">{headers.length} columns</strong>{" "}
        and <strong className="text-foreground">{rows.length} data rows</strong>
        .
      </p>
      <div className="overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full text-xs">
          <thead>
            <tr
              className="border-b border-border/40"
              style={{ background: "rgba(255,107,43,0.08)" }}
            >
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-muted-foreground font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, ri) => (
              <tr
                key={`row-${ri}-${Array.isArray(row) ? (row[0] ?? ri) : ri}`}
                className="border-b border-border/20 last:border-0"
              >
                {headers.map((_, ci) => (
                  <td
                    key={`col-${ci}-${headers[ci] ?? ci}`}
                    className="px-3 py-2 text-foreground/80 whitespace-nowrap max-w-[140px] truncate"
                  >
                    {row[ci] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 5 && (
        <p className="text-xs text-muted-foreground">
          Showing 5 of {rows.length} rows
        </p>
      )}
    </div>
  );
}

function Step1Mapping({
  headers,
  mapping,
  setMapping,
}: {
  headers: string[];
  mapping: Partial<Record<FieldKey, string>>;
  setMapping: React.Dispatch<
    React.SetStateAction<Partial<Record<FieldKey, string>>>
  >;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-3">
        Map your file columns to the expected fields. Required fields are marked
        with *.
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {EXPECTED_FIELDS.map((f) => (
          <div key={f.key} className="flex items-center gap-2">
            <label
              htmlFor={`col-map-select-${f.key}`}
              className="text-xs text-muted-foreground w-32 shrink-0 truncate"
            >
              {f.label}
              {f.required && <span style={{ color: "#FF6B2B" }}> *</span>}
            </label>
            <select
              id={`col-map-select-${f.key}`}
              value={mapping[f.key] ?? ""}
              onChange={(e) =>
                setMapping((m) => ({
                  ...m,
                  [f.key]: e.target.value || undefined,
                }))
              }
              className="crm-input h-7 text-xs flex-1 px-2"
              data-ocid={`import_wizard.map.${f.key}_select`}
            >
              <option value="">(not mapped)</option>
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step2Validation({
  summary,
  dupeAction,
  setDupeAction,
}: {
  summary: ImportSummary;
  dupeAction: "skip" | "overwrite";
  setDupeAction: (a: "skip" | "overwrite") => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="pricing-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Valid rows</p>
          <p className="text-xl font-bold" style={{ color: "#4ade80" }}>
            {summary.validCount}
          </p>
        </div>
        <div className="pricing-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Invalid rows</p>
          <p
            className="text-xl font-bold"
            style={{ color: summary.invalidCount > 0 ? "#f87171" : "#4ade80" }}
          >
            {summary.invalidCount}
          </p>
        </div>
      </div>

      {summary.intraFileDupes.length > 0 && (
        <div
          className="flex items-start gap-2 p-3 rounded-lg border"
          style={{
            borderColor: "rgba(251,191,36,0.3)",
            background: "rgba(251,191,36,0.05)",
          }}
        >
          <AlertTriangle
            size={14}
            className="text-yellow-400 mt-0.5 shrink-0"
          />
          <div className="text-xs">
            <p className="text-yellow-300 font-semibold mb-0.5">
              Duplicate SKUs in file: {summary.intraFileDupes.length}
            </p>
            <p className="text-muted-foreground">
              {summary.intraFileDupes.slice(0, 5).join(", ")}
              {summary.intraFileDupes.length > 5 ? " …" : ""}
            </p>
          </div>
        </div>
      )}

      {summary.duplicateSkus.length > 0 && (
        <div className="space-y-2">
          <div
            className="flex items-start gap-2 p-3 rounded-lg border"
            style={{
              borderColor: "rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.05)",
            }}
          >
            <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <div className="text-xs flex-1">
              <p className="text-red-300 font-semibold mb-0.5">
                Duplicates detected: {summary.duplicateSkus.length} SKUs already
                exist
              </p>
              <p className="text-muted-foreground">
                {summary.duplicateSkus.slice(0, 5).join(", ")}
                {summary.duplicateSkus.length > 5 ? " …" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-1">
            <p className="text-xs text-muted-foreground">Action:</p>
            {(["skip", "overwrite"] as const).map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setDupeAction(opt)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  dupeAction === opt
                    ? "border-accent text-white"
                    : "border-border text-muted-foreground hover:border-accent/50"
                }`}
                style={dupeAction === opt ? { background: "#FF6B2B" } : {}}
              >
                {opt === "skip" ? "Skip duplicates" : "Overwrite existing"}
              </button>
            ))}
          </div>
        </div>
      )}

      {summary.invalidCount > 0 && (
        <div className="max-h-40 overflow-y-auto rounded-lg border border-border/40">
          <table className="w-full text-xs">
            <thead>
              <tr
                className="border-b border-border/40 sticky top-0"
                style={{ background: "#0e1b2e" }}
              >
                <th className="px-3 py-2 text-left text-muted-foreground">
                  Row
                </th>
                <th className="px-3 py-2 text-left text-muted-foreground">
                  SKU
                </th>
                <th className="px-3 py-2 text-left text-muted-foreground">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.rows
                .filter((r) => r._issues.length > 0)
                .map((r) => (
                  <tr
                    key={r._rowIndex}
                    className="border-b border-border/20 last:border-0"
                  >
                    <td className="px-3 py-1.5 text-muted-foreground">
                      {r._rowIndex}
                    </td>
                    <td className="px-3 py-1.5 text-foreground">
                      {r.sku || <em className="text-muted-foreground">—</em>}
                    </td>
                    <td className="px-3 py-1.5">
                      {r._issues.map((issue) => (
                        <span
                          key={issue}
                          className="inline-block mr-1 text-[10px] px-1.5 py-0.5 rounded"
                          style={{
                            background: "rgba(239,68,68,0.15)",
                            color: "#f87171",
                          }}
                        >
                          {issue}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Step3Preview({
  summary,
  skipInvalid,
}: { summary: ImportSummary; skipInvalid: boolean }) {
  const rows = (
    skipInvalid
      ? summary.rows.filter((r) => r._issues.length === 0)
      : summary.rows
  ).slice(0, 10);
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Preview of first 10 rows to be imported:
      </p>
      <div className="overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full text-xs">
          <thead>
            <tr
              className="border-b border-border/40"
              style={{ background: "rgba(255,107,43,0.08)" }}
            >
              {[
                "SKU",
                "Product Name",
                "Base Price",
                "Currency",
                "Region",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-muted-foreground font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r._rowIndex}
                className="border-b border-border/20 last:border-0"
              >
                <td className="px-3 py-2 text-foreground font-mono">
                  {r.sku || "—"}
                </td>
                <td className="px-3 py-2 text-foreground max-w-[180px] truncate">
                  {r.productName || "—"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {r.basePrice || "—"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {r.currency || "—"}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {r.region || "—"}
                </td>
                <td className="px-3 py-2">
                  {r._issues.length === 0 ? (
                    <CheckCircle2 size={13} className="text-green-400" />
                  ) : (
                    <span
                      className="flex items-center gap-1 text-[10px]"
                      style={{ color: "#f87171" }}
                    >
                      <X size={11} />
                      {r._issues.length} issue
                      {r._issues.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Step4Import({
  summary,
  validToImport,
  skipInvalid,
  setSkipInvalid,
}: {
  summary: ImportSummary;
  validToImport: number;
  skipInvalid: boolean;
  setSkipInvalid: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="pricing-panel p-4 rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Import Summary
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Total rows</p>
            <p className="text-lg font-bold text-foreground">
              {summary.rows.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valid</p>
            <p className="text-lg font-bold" style={{ color: "#4ade80" }}>
              {summary.validCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Invalid</p>
            <p
              className="text-lg font-bold"
              style={{
                color: summary.invalidCount > 0 ? "#f87171" : "#4ade80",
              }}
            >
              {summary.invalidCount}
            </p>
          </div>
        </div>
      </div>

      {summary.invalidCount > 0 && (
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={skipInvalid}
            onChange={(e) => setSkipInvalid(e.target.checked)}
            className="accent-orange-500"
            data-ocid="import_wizard.skip_invalid_checkbox"
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Skip {summary.invalidCount} invalid row
            {summary.invalidCount !== 1 ? "s" : ""} and import only valid rows
          </span>
        </label>
      )}

      <div
        className="p-3 rounded-lg border"
        style={{
          borderColor: "rgba(255,107,43,0.3)",
          background: "rgba(255,107,43,0.06)",
        }}
      >
        <p className="text-sm font-semibold" style={{ color: "#FF6B2B" }}>
          Ready to import {validToImport} row{validToImport !== 1 ? "s" : ""}
        </p>
        {validToImport === 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            No valid rows to import. Review and fix issues first.
          </p>
        )}
      </div>
    </div>
  );
}

export function parseCSVText(text: string): {
  headers: string[];
  rows: string[][];
} {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };
  const parse = (line: string): string[] => {
    const result: string[] = [];
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
  const rows = lines
    .slice(1)
    .filter((l) => l.trim())
    .map(parse);
  return { headers, rows };
}

export function parseTSVText(text: string): {
  headers: string[];
  rows: string[][];
} {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split("\t").map((h) => h.trim());
  const rows = lines
    .slice(1)
    .filter((l) => l.trim())
    .map((l) => l.split("\t").map((c) => c.trim()));
  return { headers, rows };
}
