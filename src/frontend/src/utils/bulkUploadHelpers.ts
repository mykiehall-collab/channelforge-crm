import type { Account } from "../backend";

// ── Types ─────────────────────────────────────────────────────────────────────

export type DuplicateAction = "skip" | "update" | "create";

export interface ParsedRow {
  raw: Record<string, string>;
  mapped: Record<string, string>;
  duplicateAction: DuplicateAction;
  hasError: boolean;
  hasWarning: boolean;
  errorMessages: string[];
  warningMessages: string[];
  rowIndex: number;
  selected: boolean;
}

export interface ColumnMapping {
  targetField: string;
  sourceColumn: string;
  autoDetected: boolean;
}

export interface SortConfig {
  key: string;
  dir: "asc" | "desc";
}

export interface ImportOptions {
  skipDuplicates: boolean;
  mergeExisting: boolean;
  sendDuplicatesToReview: boolean;
  targetResellerId: string;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  merged: number;
  sentToReview: number;
  failed: number;
  errors: string[];
  fileName: string;
  totalRows: number;
}

// ── Field Definitions ─────────────────────────────────────────────────────────

export const ACCOUNT_FIELDS: {
  key: string;
  label: string;
  required: boolean;
}[] = [
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
  { key: "dealRegistrationStatus", label: "Deal Reg. Status", required: false },
];

// ── Header → field name matching map ─────────────────────────────────────────
// Maps lower-case partial header keywords to target field keys

export const FIELD_HEADER_MAP: Record<string, string[]> = {
  customerName: [
    "customer name",
    "company name",
    "account name",
    "name",
    "client name",
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
    "end date",
  ],
  subscriptionType: [
    "subscription",
    "contract type",
    "subscription type",
    "plan",
    "tier",
  ],
  contractValue: [
    "value",
    "contract value",
    "arr",
    "amount",
    "revenue",
    "annual value",
  ],
  currency: ["currency", "currency code", "ccy"],
  region: ["region", "country", "territory", "location", "geo"],
  contactName: ["contact name", "primary contact", "contact"],
  contactEmail: ["contact email", "email", "contact e-mail"],
  dealRegistrationStatus: [
    "deal status",
    "dr status",
    "deal registration status",
    "deal reg status",
  ],
};

// ── CSV Parser ────────────────────────────────────────────────────────────────

export function parseCSV(text: string): {
  headers: string[];
  rows: string[][];
} {
  // Detect delimiter: tab or comma
  const firstLine = text.slice(
    0,
    text.indexOf("\n") === -1 ? text.length : text.indexOf("\n"),
  );
  const delimiter = firstLine.includes("\t") ? "\t" : ",";

  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  const splitLine = (line: string): string[] => {
    if (delimiter === "\t") return line.split("\t").map((s) => s.trim());
    const result: string[] = [];
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

export function rowsToObjects(
  headers: string[],
  rows: string[][],
): Record<string, string>[] {
  return rows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    return obj;
  });
}

// ── Auto-detect column mapping ─────────────────────────────────────────────────

export function autoDetectMapping(
  headers: string[],
  fieldMap: Record<string, string[]>,
): ColumnMapping[] {
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

// ── Build mapped row object ───────────────────────────────────────────────────

export function buildMappedRow(
  raw: Record<string, string>,
  mappingLookup: Record<string, string>,
  fields: typeof ACCOUNT_FIELDS,
): Record<string, string> {
  const m: Record<string, string> = {};
  for (const f of fields) {
    m[f.key] = mappingLookup[f.key] ? (raw[mappingLookup[f.key]] ?? "") : "";
  }
  return m;
}

// ── Row validation ────────────────────────────────────────────────────────────

const VALID_CURRENCIES = new Set([
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CNY",
  "AUD",
  "BTC",
]);

export function validateRow(
  mapped: Record<string, string>,
  fields: typeof ACCOUNT_FIELDS,
  existingAccounts: Account[],
): {
  hasError: boolean;
  hasWarning: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field check
  for (const f of fields.filter((fld) => fld.required)) {
    if (!mapped[f.key]?.trim()) {
      errors.push(`Missing required field: ${f.label}`);
    }
  }

  // Currency format check
  if (mapped.currency && !VALID_CURRENCIES.has(mapped.currency.toUpperCase())) {
    warnings.push(`Unrecognised currency code: "${mapped.currency}"`);
  }

  // Renewal date format
  if (mapped.renewalDate) {
    const d = new Date(mapped.renewalDate);
    if (Number.isNaN(d.getTime())) {
      errors.push(`Invalid renewal date format: "${mapped.renewalDate}"`);
    }
  }

  // Possible duplicate: match by domain or name
  const domain = mapped.customerDomain?.toLowerCase().trim();
  const name = mapped.customerName?.toLowerCase().trim();
  if (domain || name) {
    const dup = existingAccounts.find(
      (a) =>
        (domain && a.customerDomain.toLowerCase() === domain) ||
        (name && a.accountName.toLowerCase() === name),
    );
    if (dup) {
      warnings.push(
        `Possible duplicate: matches existing account "${dup.accountName}" (ID: ${dup.id})`,
      );
    }
  }

  return {
    hasError: errors.length > 0,
    hasWarning: warnings.length > 0,
    errors,
    warnings,
  };
}

// ── Utilities ─────────────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function downloadCSV(data: string[][], filename: string) {
  const csvContent = data
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
