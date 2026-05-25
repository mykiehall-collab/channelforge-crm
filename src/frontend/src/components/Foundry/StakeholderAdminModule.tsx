import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Filter,
  Globe,
  Info,
  Lock,
  MapPin,
  Pencil,
  Plus,
  Search,
  Shield,
  Tag,
  Trash2,
  Upload,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────────

type VisibilityTier = "private" | "department" | "organization" | "hierarchy";

type StakeholderRecord = {
  id: string;
  name: string;
  email: string;
  organization: string;
  orgType: "vendor" | "distributor" | "reseller";
  department: string;
  role: string;
  territory: string;
  phone?: string;
  employeeNumber?: string;
  visibility: VisibilityTier;
  tags: string[];
  linkedAccounts: string[];
  status: "active" | "inactive";
};

type ImportHistoryEntry = {
  id: string;
  timestamp: string;
  importedBy: string;
  recordCount: number;
  successCount: number;
  duplicatesFound: number;
  errorsFound: number;
  warningsFound: number;
  status: "completed" | "completed_with_warnings" | "failed" | "partial";
  fileName: string;
};

type CsvRow = Record<string, string>;

// ─── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_STAKEHOLDERS: StakeholderRecord[] = [
  {
    id: "s1",
    name: "James Harrington",
    email: "j.harrington@acmecorp.com",
    organization: "AcmeCorp",
    orgType: "vendor",
    department: "Sales",
    role: "Account Manager",
    territory: "EMEA",
    employeeNumber: "EMP-0041",
    visibility: "organization",
    tags: ["Strategic Contact", "Renewal Owner"],
    linkedAccounts: ["Desperado", "Nordic Energy Group"],
    status: "active",
  },
  {
    id: "s2",
    name: "Rachel Chen",
    email: "r.chen@acmecorp.com",
    organization: "AcmeCorp",
    orgType: "vendor",
    department: "Operations",
    role: "Deal Desk",
    territory: "APAC",
    employeeNumber: "EMP-0037",
    visibility: "department",
    tags: ["Deal Desk", "Escalation Contact"],
    linkedAccounts: ["Global Pharma Holdings"],
    status: "active",
  },
  {
    id: "s3",
    name: "Marcus Webb",
    email: "m.webb@ingram.com",
    organization: "Ingram Micro",
    orgType: "distributor",
    department: "Renewals",
    role: "Renewal Specialist",
    territory: "EMEA",
    visibility: "hierarchy",
    tags: ["Renewal Owner"],
    linkedAccounts: ["Nordic Energy Group", "Adobe"],
    status: "active",
  },
  {
    id: "s4",
    name: "Sofia Alvarez",
    email: "s.alvarez@techsol.com",
    organization: "TechSolutions Ltd",
    orgType: "reseller",
    department: "Marketing",
    role: "Marketing Lead",
    territory: "LATAM",
    visibility: "private",
    tags: ["Marketing Lead"],
    linkedAccounts: [],
    status: "active",
  },
  {
    id: "s5",
    name: "Tom Nakamura",
    email: "t.nakamura@acmecorp.com",
    organization: "AcmeCorp",
    orgType: "vendor",
    department: "Finance",
    role: "Finance Lead",
    territory: "APAC",
    employeeNumber: "EMP-0029",
    visibility: "department",
    tags: ["Operations Lead"],
    linkedAccounts: ["Desperado"],
    status: "inactive",
  },
  {
    id: "s6",
    name: "Priya Sharma",
    email: "p.sharma@distribco.com",
    organization: "DistribCo Europe",
    orgType: "distributor",
    department: "Sales",
    role: "Sales Lead",
    territory: "EMEA",
    visibility: "hierarchy",
    tags: ["Strategic Contact", "Executive Sponsor"],
    linkedAccounts: ["Nordic Energy Group"],
    status: "active",
  },
];

const MOCK_IMPORT_HISTORY: ImportHistoryEntry[] = [
  {
    id: "ih1",
    timestamp: "2026-05-20 14:32",
    importedBy: "James Harrington",
    recordCount: 247,
    successCount: 241,
    duplicatesFound: 4,
    errorsFound: 2,
    warningsFound: 6,
    status: "completed_with_warnings",
    fileName: "stakeholders_may2026.csv",
  },
  {
    id: "ih2",
    timestamp: "2026-04-15 09:10",
    importedBy: "Rachel Chen",
    recordCount: 120,
    successCount: 120,
    duplicatesFound: 0,
    errorsFound: 0,
    warningsFound: 1,
    status: "completed",
    fileName: "distributor_contacts_q2.xlsx",
  },
  {
    id: "ih3",
    timestamp: "2026-03-02 17:44",
    importedBy: "James Harrington",
    recordCount: 55,
    successCount: 38,
    duplicatesFound: 8,
    errorsFound: 9,
    warningsFound: 3,
    status: "partial",
    fileName: "reseller_stakeholders_march.csv",
  },
  {
    id: "ih4",
    timestamp: "2026-02-11 11:20",
    importedBy: "James Harrington",
    recordCount: 310,
    successCount: 310,
    duplicatesFound: 0,
    errorsFound: 0,
    warningsFound: 0,
    status: "completed",
    fileName: "full_stakeholder_export_q1.csv",
  },
];

const SYSTEM_FIELDS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "organization",
  "org_type",
  "department",
  "role",
  "territory",
  "employee_number",
  "linkedin_url",
  "visibility_tier",
  "tags",
  "linked_accounts",
  "(skip)",
];

// ─── Subcomponents ──────────────────────────────────────────────────────────────

function VisibilityBadge({ tier }: { tier: VisibilityTier }) {
  const config: Record<VisibilityTier, { label: string; cls: string }> = {
    private: { label: "Private", cls: "bg-slate-500/20 text-slate-300" },
    department: { label: "Department", cls: "bg-blue-500/20 text-blue-300" },
    organization: {
      label: "Organisation",
      cls: "bg-orange-500/20 text-orange-300",
    },
    hierarchy: { label: "Hierarchy", cls: "bg-purple-500/20 text-purple-300" },
  };
  const { label, cls } = config[tier];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

function OrgTypeBadge({
  type,
}: { type: "vendor" | "distributor" | "reseller" }) {
  const config: Record<string, { label: string; cls: string }> = {
    vendor: { label: "Vendor", cls: "bg-orange-500/20 text-orange-300" },
    distributor: { label: "Distributor", cls: "bg-blue-500/20 text-blue-300" },
    reseller: { label: "Reseller", cls: "bg-emerald-500/20 text-emerald-300" },
  };
  const { label, cls } = config[type];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

function ImportStatusBadge({
  status,
}: { status: ImportHistoryEntry["status"] }) {
  const config: Record<
    ImportHistoryEntry["status"],
    { label: string; cls: string }
  > = {
    completed: {
      label: "Completed",
      cls: "bg-emerald-500/20 text-emerald-300",
    },
    completed_with_warnings: {
      label: "Warnings",
      cls: "bg-yellow-500/20 text-yellow-300",
    },
    partial: { label: "Partial", cls: "bg-orange-500/20 text-orange-300" },
    failed: { label: "Failed", cls: "bg-red-500/20 text-red-300" },
  };
  const { label, cls } = config[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

// ─── Tab: Bulk Import ────────────────────────────────────────────────────────────

function BulkImportTab() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<
    "upload" | "mapping" | "validation" | "preview" | "done"
  >("upload");
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [visibilityTier, setVisibilityTier] =
    useState<VisibilityTier>("organization");
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Simulated CSV headers from uploaded file
  const simulatedCsvHeaders = [
    "First Name",
    "Last Name",
    "Email Address",
    "Phone",
    "Company",
    "Org Type",
    "Dept",
    "Job Title",
    "Region",
    "Emp No",
    "LinkedIn",
  ];

  const simulatedPreviewRows: CsvRow[] = [
    {
      "First Name": "Anna",
      "Last Name": "Bailey",
      "Email Address": "a.bailey@nordic.com",
      Company: "Nordic Energy Group",
      "Org Type": "distributor",
      Dept: "Renewals",
      "Job Title": "Renewal Manager",
      Region: "EMEA",
    },
    {
      "First Name": "Chen",
      "Last Name": "Liu",
      "Email Address": "c.liu@acmecorp.com",
      Company: "AcmeCorp",
      "Org Type": "vendor",
      Dept: "Sales",
      "Job Title": "Sales Rep",
      Region: "APAC",
    },
    {
      "First Name": "Dave",
      "Last Name": "Moss",
      "Email Address": "d.moss@techsol.com",
      Company: "TechSolutions Ltd",
      "Org Type": "reseller",
      Dept: "Marketing",
      "Job Title": "Marketing Lead",
      Region: "LATAM",
    },
  ];

  const duplicatesPreview: CsvRow[] = [
    {
      "First Name": "Rachel",
      "Last Name": "Chen",
      "Email Address": "r.chen@acmecorp.com",
      Company: "AcmeCorp",
      Note: "Existing record found",
    },
    {
      "First Name": "James",
      "Last Name": "Harrington",
      "Email Address": "j.harrington@acmecorp.com",
      Company: "AcmeCorp",
      Note: "Existing record found",
    },
  ];

  const validationErrors = [
    { row: 14, field: "Email Address", message: "Invalid email format" },
    {
      row: 27,
      field: "Org Type",
      message: "Unrecognised org type 'distributor-uk'",
    },
  ];

  const validationWarnings = [
    { row: 7, field: "Region", message: "Territory 'Europe' mapped to 'EMEA'" },
    {
      row: 19,
      field: "Dept",
      message: "Department 'Pre-Sales' created as new department",
    },
    {
      row: 33,
      field: "Dept",
      message: "Department 'Inside Sales' mapped to 'Sales'",
    },
  ];

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setStep("mapping");
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setStep("mapping");
    }
  }

  function handleImport() {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImportSuccess(true);
      setStep("done");
    }, 1800);
  }

  function reset() {
    setFile(null);
    setStep("upload");
    setColumnMap({});
    setImportSuccess(false);
  }

  const steps = ["upload", "mapping", "validation", "preview", "done"];
  const stepLabels = [
    "Upload",
    "Field Mapping",
    "Validation",
    "Preview",
    "Import",
  ];

  return (
    <div className="space-y-6">
      {/* Step progress */}
      <div className="flex items-center gap-0">
        {stepLabels.map((label, i) => {
          const sKey = steps[i];
          const currentIdx = steps.indexOf(step);
          const done = currentIdx > i;
          const active = currentIdx === i;
          return (
            <div key={sKey} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${
                  done
                    ? "bg-emerald-500/20 text-emerald-300"
                    : active
                      ? "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40"
                      : "text-white/30"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-orange-500 text-white"
                        : "bg-white/10 text-white/40"
                  }`}
                >
                  {done ? <CheckCircle2 size={10} /> : i + 1}
                </span>
                {label}
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  className={`h-px w-4 ${done ? "bg-emerald-500/40" : "bg-white/10"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step: Upload */}
      {step === "upload" && (
        <div className="space-y-4">
          <button
            type="button"
            data-ocid="stakeholder-admin.bulk-import.dropzone"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer
              ${dragActive ? "border-orange-400 bg-orange-500/10" : "border-white/20 hover:border-white/40 bg-white/[0.02]"}`}
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-14 h-14 rounded-full bg-orange-500/15 flex items-center justify-center">
              <Upload size={24} className="text-orange-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/80">
                Drag &amp; drop your CSV or Excel file here
              </p>
              <p className="text-xs text-white/40 mt-1">
                Supports .csv and .xlsx files up to 50 MB
              </p>
            </div>
            <span
              data-ocid="stakeholder-admin.bulk-import.upload_button"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Choose File
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleFileInput}
              aria-label="Upload stakeholder CSV or Excel file"
            />
          </button>
          <div className="p-4 rounded-xl border border-white/8 bg-white/[0.02] flex items-start gap-3">
            <Info size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-white/50 space-y-1">
              <p>
                Your CSV/Excel file should include columns for: name, email,
                organization, department, role, territory, and visibility tier.
              </p>
              <p>
                Duplicate detection runs automatically using email address as
                the unique key. Hierarchy relationships
                (Vendor/Distributor/Reseller links) are validated during import.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step: Field mapping */}
      {step === "mapping" && file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white/80">
                Map CSV Columns to System Fields
              </h3>
              <p className="text-xs text-white/40 mt-0.5">File: {file.name}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1"
            >
              <X size={12} /> Change file
            </button>
          </div>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.03]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                    CSV Column
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Sample Values
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Map to System Field
                  </th>
                </tr>
              </thead>
              <tbody>
                {simulatedCsvHeaders.map((header, i) => (
                  <tr
                    key={header}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-2.5 text-white/70 font-medium text-xs">
                      {header}
                    </td>
                    <td className="px-4 py-2.5 text-white/40 text-xs">
                      {simulatedPreviewRows[0]?.[header] ?? "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        data-ocid={`stakeholder-admin.bulk-import.field-map.${i}.select`}
                        value={columnMap[header] ?? ""}
                        onChange={(e) =>
                          setColumnMap((prev) => ({
                            ...prev,
                            [header]: e.target.value,
                          }))
                        }
                        className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
                        aria-label={`Map column ${header}`}
                      >
                        <option value="">— Select field —</option>
                        {SYSTEM_FIELDS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visibility tier + dept/territory mapping */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <label
                htmlFor="visibility-tier-select"
                className="text-xs font-semibold text-white/60 flex items-center gap-1.5"
              >
                <Shield size={12} className="text-orange-400" /> Default
                Visibility Tier
              </label>
              <select
                id="visibility-tier-select"
                data-ocid="stakeholder-admin.bulk-import.visibility_tier.select"
                value={visibilityTier}
                onChange={(e) =>
                  setVisibilityTier(e.target.value as VisibilityTier)
                }
                className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
                aria-label="Default visibility tier for imported contacts"
              >
                <option value="private">Private — creator only</option>
                <option value="department">Department — same dept users</option>
                <option value="organization">
                  Organisation — all org users
                </option>
                <option value="hierarchy">Hierarchy — linked partners</option>
              </select>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <span
                id="dept-mapping-label"
                className="text-xs font-semibold text-white/60 flex items-center gap-1.5"
              >
                <Building2 size={12} className="text-blue-400" /> Department
                Mapping
              </span>
              <p className="text-xs text-white/40">
                Imported department names will be matched to system departments.
                Unmatched names create new departments automatically.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <span
                id="territory-mapping-label"
                className="text-xs font-semibold text-white/60 flex items-center gap-1.5"
              >
                <MapPin size={12} className="text-emerald-400" /> Territory
                Mapping
              </span>
              <p className="text-xs text-white/40">
                Territory names are normalised to system territories (EMEA,
                APAC, AMER, LATAM). Custom territories are preserved as-is.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 rounded-lg text-sm text-white/50 border border-white/10 hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="stakeholder-admin.bulk-import.next_button"
              onClick={() => setStep("validation")}
              className="px-4 py-2 rounded-lg text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              Validate File
            </button>
          </div>
        </div>
      )}

      {/* Step: Validation */}
      {step === "validation" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/80">
            Validation Results
          </h3>

          {/* Duplicates */}
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-yellow-500/10 flex items-center gap-2">
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">
                Duplicates Detected ({duplicatesPreview.length})
              </span>
              <span className="text-xs text-white/40 ml-auto">
                These records already exist — they will be skipped unless you
                choose to update
              </span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {duplicatesPreview.map((row, i) => (
                <div
                  key={row["Email Address"] ?? i}
                  className="px-4 py-2.5 flex items-center gap-4 text-xs"
                >
                  <span className="text-white/60 font-medium">
                    {row["First Name"]} {row["Last Name"]}
                  </span>
                  <span className="text-white/40">{row["Email Address"]}</span>
                  <span className="ml-auto text-yellow-400/70">{row.Note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Errors */}
          {validationErrors.length > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-red-500/10 flex items-center gap-2">
                <X size={14} className="text-red-400" />
                <span className="text-sm font-medium text-red-300">
                  Validation Errors ({validationErrors.length})
                </span>
                <span className="text-xs text-white/40 ml-auto">
                  Rows with errors will be skipped
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {validationErrors.map((err, _i) => (
                  <div
                    key={`${err.row}-${err.field}`}
                    className="px-4 py-2.5 flex items-center gap-4 text-xs"
                  >
                    <span className="text-white/40">Row {err.row}</span>
                    <span className="text-red-300 font-medium">
                      {err.field}
                    </span>
                    <span className="text-white/50">{err.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {validationWarnings.length > 0 && (
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-orange-500/10 flex items-center gap-2">
                <Info size={14} className="text-orange-400" />
                <span className="text-sm font-medium text-orange-300">
                  Warnings ({validationWarnings.length})
                </span>
                <span className="text-xs text-white/40 ml-auto">
                  Import will continue with these adjustments
                </span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {validationWarnings.map((warn, _i) => (
                  <div
                    key={`${warn.row}-${warn.field}`}
                    className="px-4 py-2.5 flex items-center gap-4 text-xs"
                  >
                    <span className="text-white/40">Row {warn.row}</span>
                    <span className="text-orange-300 font-medium">
                      {warn.field}
                    </span>
                    <span className="text-white/50">{warn.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStep("mapping")}
              className="px-4 py-2 rounded-lg text-sm text-white/50 border border-white/10 hover:border-white/20 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              data-ocid="stakeholder-admin.bulk-import.preview_button"
              onClick={() => setStep("preview")}
              className="px-4 py-2 rounded-lg text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              Preview Import
            </button>
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/80">
              Import Preview
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>3 records ready to import</span>
              <span className="text-white/20">·</span>
              <AlertTriangle size={12} className="text-yellow-400" />
              <span>2 duplicates will be skipped</span>
              <span className="text-white/20">·</span>
              <X size={12} className="text-red-400" />
              <span>2 rows have errors</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.03]">
                  {[
                    "Name",
                    "Email",
                    "Organisation",
                    "Org Type",
                    "Department",
                    "Role",
                    "Territory",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2.5 font-semibold text-white/40 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {simulatedPreviewRows.map((row, i) => (
                  <tr
                    key={row["Email Address"] ?? i}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="px-3 py-2.5 text-white/70">
                      {row["First Name"]} {row["Last Name"]}
                    </td>
                    <td className="px-3 py-2.5 text-white/50">
                      {row["Email Address"]}
                    </td>
                    <td className="px-3 py-2.5 text-white/60">{row.Company}</td>
                    <td className="px-3 py-2.5">
                      <OrgTypeBadge
                        type={
                          (row["Org Type"] as
                            | "vendor"
                            | "distributor"
                            | "reseller") ?? "vendor"
                        }
                      />
                    </td>
                    <td className="px-3 py-2.5 text-white/50">{row.Dept}</td>
                    <td className="px-3 py-2.5 text-white/50">
                      {row["Job Title"]}
                    </td>
                    <td className="px-3 py-2.5 text-white/50">{row.Region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStep("validation")}
              className="px-4 py-2 rounded-lg text-sm text-white/50 border border-white/10 hover:border-white/20 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              data-ocid="stakeholder-admin.bulk-import.confirm_button"
              disabled={importing}
              onClick={handleImport}
              className="px-4 py-2 rounded-lg text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium transition-colors"
            >
              {importing ? "Importing…" : "Confirm Import"}
            </button>
          </div>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && importSuccess && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white/80">
              Import Successful
            </p>
            <p className="text-sm text-white/40 mt-1">
              3 stakeholders imported · 2 duplicates skipped · 2 rows with
              errors skipped
            </p>
          </div>
          <button
            type="button"
            data-ocid="stakeholder-admin.bulk-import.new_import_button"
            onClick={reset}
            className="mt-2 px-4 py-2 rounded-lg text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
          >
            Start New Import
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Stakeholder Directory Management ───────────────────────────────────────

function DirectoryManagementTab() {
  const [search, setSearch] = useState("");
  const [orgTypeFilter, setOrgTypeFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [visFilter, setVisFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_STAKEHOLDERS.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.organization.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.territory.toLowerCase().includes(q);
    const matchOrg = !orgTypeFilter || s.orgType === orgTypeFilter;
    const matchDept = !deptFilter || s.department === deptFilter;
    const matchVis = !visFilter || s.visibility === visFilter;
    return matchSearch && matchOrg && matchDept && matchVis;
  });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((s) => s.id)));
  }

  const departments = Array.from(
    new Set(MOCK_STAKEHOLDERS.map((s) => s.department)),
  ).sort();

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="search"
            data-ocid="stakeholder-admin.directory.search_input"
            placeholder="Search by name, email, org, department, role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/[0.04] border border-white/10 text-foreground placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <button
          type="button"
          data-ocid="stakeholder-admin.directory.filters.toggle"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors
            ${showFilters ? "border-orange-500/40 text-orange-400 bg-orange-500/10" : "border-white/10 text-white/50 hover:border-white/20"}`}
        >
          <Filter size={13} /> Filters
          <ChevronDown
            size={12}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
        <button
          type="button"
          data-ocid="stakeholder-admin.directory.export_button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-white/10 text-white/50 hover:border-white/20 transition-colors"
        >
          <Download size={13} /> Export
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          <div>
            <label
              htmlFor="org-type-filter"
              className="text-xs text-white/40 mb-1 block"
            >
              Organisation Type
            </label>
            <select
              id="org-type-filter"
              data-ocid="stakeholder-admin.directory.org_type_filter.select"
              value={orgTypeFilter}
              onChange={(e) => setOrgTypeFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
              aria-label="Filter by organisation type"
            >
              <option value="">All org types</option>
              <option value="vendor">Vendor</option>
              <option value="distributor">Distributor</option>
              <option value="reseller">Reseller</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="dept-filter"
              className="text-xs text-white/40 mb-1 block"
            >
              Department
            </label>
            <select
              id="dept-filter"
              data-ocid="stakeholder-admin.directory.dept_filter.select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
              aria-label="Filter by department"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="visibility-filter"
              className="text-xs text-white/40 mb-1 block"
            >
              Visibility Tier
            </label>
            <select
              id="visibility-filter"
              data-ocid="stakeholder-admin.directory.visibility_filter.select"
              value={visFilter}
              onChange={(e) => setVisFilter(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
              aria-label="Filter by visibility tier"
            >
              <option value="">All tiers</option>
              <option value="private">Private</option>
              <option value="department">Department</option>
              <option value="organization">Organisation</option>
              <option value="hierarchy">Hierarchy</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setOrgTypeFilter("");
                setDeptFilter("");
                setVisFilter("");
              }}
              className="w-full px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/40 hover:text-white/60 transition-colors"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-orange-500/20 bg-orange-500/5">
          <span className="text-sm text-orange-300 font-medium">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <select
              data-ocid="stakeholder-admin.directory.bulk_action.select"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
              aria-label="Bulk action"
            >
              <option value="">— Bulk action —</option>
              <option value="set-visibility">Set Visibility Tier</option>
              <option value="set-dept">Assign Department</option>
              <option value="set-territory">Assign Territory</option>
              <option value="add-tag">Add Tag</option>
              <option value="remove-tag">Remove Tag</option>
              <option value="deactivate">Deactivate</option>
            </select>
            <button
              type="button"
              data-ocid="stakeholder-admin.directory.bulk_apply_button"
              className="px-3 py-1.5 rounded-lg text-xs bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs text-white/30 hover:text-white/60"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.03]">
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={
                    selected.size > 0 && selected.size === filtered.length
                  }
                  onChange={toggleAll}
                  aria-label="Select all stakeholders"
                  className="rounded"
                />
              </th>
              {[
                "Name",
                "Organisation",
                "Department / Role",
                "Territory",
                "Visibility",
                "Tags",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-3 font-semibold text-white/40 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-white/30 text-sm"
                >
                  No stakeholders match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
                <tr
                  key={s.id}
                  data-ocid={`stakeholder-admin.directory.row.${i + 1}`}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.02] ${selected.has(s.id) ? "bg-orange-500/[0.04]" : ""}`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      aria-label={`Select ${s.name}`}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-white/80">{s.name}</div>
                    <div className="text-white/40 mt-0.5">{s.email}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-white/60">{s.organization}</div>
                    <div className="mt-0.5">
                      <OrgTypeBadge type={s.orgType} />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-white/60">{s.department}</div>
                    <div className="text-white/40 mt-0.5">{s.role}</div>
                  </td>
                  <td className="px-3 py-3 text-white/50">{s.territory}</td>
                  <td className="px-3 py-3">
                    <VisibilityBadge tier={s.visibility} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-white/8 text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                      {s.tags.length > 2 && (
                        <span className="text-white/30">
                          +{s.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium
                      ${s.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-400"}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        data-ocid={`stakeholder-admin.directory.edit_button.${i + 1}`}
                        aria-label={`Edit ${s.name}`}
                        className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        data-ocid={`stakeholder-admin.directory.delete_button.${i + 1}`}
                        aria-label={`Remove ${s.name}`}
                        className="p-1 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/30">
        {filtered.length} stakeholders shown
      </p>
    </div>
  );
}

// ─── Tab: Visibility Governance ──────────────────────────────────────────────────

function VisibilityGovernanceTab() {
  const [orgSharingEnabled, setOrgSharingEnabled] = useState(true);
  const [hierarchyEnabled, setHierarchyEnabled] = useState(true);
  const [deptRules, setDeptRules] = useState([
    { dept: "Sales", canShare: true, toLinked: false },
    { dept: "Marketing", canShare: true, toLinked: true },
    { dept: "Finance", canShare: false, toLinked: false },
    { dept: "Operations", canShare: true, toLinked: false },
  ]);

  const visibilityTiers = [
    {
      tier: "private" as VisibilityTier,
      label: "Private",
      description: "Visible only to the creator and approved admins",
      roles: ["Creator", "Primary Admin"],
    },
    {
      tier: "department" as VisibilityTier,
      label: "Department Shared",
      description: "Visible to same-department users and departmental admins",
      roles: ["Same Dept Users", "Dept Admins"],
    },
    {
      tier: "organization" as VisibilityTier,
      label: "Organisation Shared",
      description:
        "Visible to all users within the same organisation workspace",
      roles: ["All Org Users"],
    },
    {
      tier: "hierarchy" as VisibilityTier,
      label: "Hierarchy Shared",
      description:
        "Visible across linked Vendors, Distributors, and Resellers where governance permits",
      roles: ["Linked Partners", "Hierarchy Admins"],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white/80">
          Visibility Tiers &amp; Role Access
        </h3>
        <p className="text-xs text-white/40 mt-1">
          Configure which roles can see contacts at each visibility level across
          your organisation and partner ecosystem.
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibilityTiers.map((t) => (
          <div
            key={t.tier}
            className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <VisibilityBadge tier={t.tier} />
                  <span className="text-sm font-medium text-white/70">
                    {t.label}
                  </span>
                </div>
                <p className="text-xs text-white/40 mt-1.5">{t.description}</p>
              </div>
              <Shield
                size={14}
                className="text-white/20 flex-shrink-0 mt-0.5"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {t.roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded-full text-[10px] bg-white/8 text-white/50"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Org-wide sharing policies */}
      <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
        <h4 className="text-sm font-semibold text-white/70 flex items-center gap-2">
          <Globe size={14} className="text-orange-400" /> Organisation-Wide
          Sharing Policies
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">
                Organisation-wide contact sharing
              </p>
              <p className="text-xs text-white/40">
                Allow contacts marked as Organisation-shared to be visible to
                all users in this workspace
              </p>
            </div>
            <button
              type="button"
              data-ocid="stakeholder-admin.visibility.org_sharing.toggle"
              onClick={() => setOrgSharingEnabled(!orgSharingEnabled)}
              aria-label="Toggle organisation sharing"
              className={`relative w-10 h-5 rounded-full transition-colors ${orgSharingEnabled ? "bg-orange-500" : "bg-white/20"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${orgSharingEnabled ? "left-5" : "left-0.5"}`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">
                Hierarchy-linked partner sharing
              </p>
              <p className="text-xs text-white/40">
                Allow hierarchy-shared contacts to flow to linked Vendors,
                Distributors, or Resellers where governance permits
              </p>
            </div>
            <button
              type="button"
              data-ocid="stakeholder-admin.visibility.hierarchy_sharing.toggle"
              onClick={() => setHierarchyEnabled(!hierarchyEnabled)}
              aria-label="Toggle hierarchy sharing"
              className={`relative w-10 h-5 rounded-full transition-colors ${hierarchyEnabled ? "bg-orange-500" : "bg-white/20"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${hierarchyEnabled ? "left-5" : "left-0.5"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Department sharing rules */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/8 bg-white/[0.02] flex items-center gap-2">
          <Building2 size={14} className="text-orange-400" />
          <span className="text-sm font-semibold text-white/70">
            Department-Level Sharing Rules
          </span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.02]">
              {[
                "Department",
                "Can share org-wide",
                "Can share to linked orgs",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deptRules.map((rule, i) => (
              <tr
                key={rule.dept}
                className="border-b border-white/[0.04] hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 text-white/70 font-medium text-xs">
                  {rule.dept}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    data-ocid={`stakeholder-admin.visibility.dept_sharing.${i + 1}.org_toggle`}
                    onClick={() =>
                      setDeptRules((prev) =>
                        prev.map((r, idx) =>
                          idx === i ? { ...r, canShare: !r.canShare } : r,
                        ),
                      )
                    }
                    aria-label={`Toggle org sharing for ${rule.dept}`}
                    className={`relative w-8 h-4 rounded-full transition-colors ${rule.canShare ? "bg-orange-500" : "bg-white/20"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${rule.canShare ? "left-4" : "left-0.5"}`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    data-ocid={`stakeholder-admin.visibility.dept_sharing.${i + 1}.linked_toggle`}
                    onClick={() =>
                      setDeptRules((prev) =>
                        prev.map((r, idx) =>
                          idx === i ? { ...r, toLinked: !r.toLinked } : r,
                        ),
                      )
                    }
                    aria-label={`Toggle linked org sharing for ${rule.dept}`}
                    className={`relative w-8 h-4 rounded-full transition-colors ${rule.toLinked ? "bg-orange-500" : "bg-white/20"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${rule.toLinked ? "left-4" : "left-0.5"}`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-xs text-white/30 hover:text-orange-400 transition-colors"
                  >
                    Edit rules
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Import History ────────────────────────────────────────────────────────

function ImportHistoryTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white/80">
            Import History
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            All bulk stakeholder import operations performed in this workspace
          </p>
        </div>
        <button
          type="button"
          data-ocid="stakeholder-admin.history.export_button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-white/10 text-white/50 hover:border-white/20 transition-colors"
        >
          <Download size={13} /> Export Log
        </button>
      </div>

      <div className="space-y-2">
        {MOCK_IMPORT_HISTORY.map((entry, i) => (
          <div
            key={entry.id}
            data-ocid={`stakeholder-admin.history.item.${i + 1}`}
            className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            {/* Header row */}
            <button
              type="button"
              className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
              onClick={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
              aria-expanded={expandedId === entry.id}
            >
              <FileSpreadsheet
                size={16}
                className="text-orange-400 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/70 truncate">
                  {entry.fileName}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {entry.timestamp} · Imported by {entry.importedBy}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ImportStatusBadge status={entry.status} />
                <span className="text-xs text-white/40">
                  {entry.successCount}/{entry.recordCount} records
                </span>
                <ChevronDown
                  size={14}
                  className={`text-white/30 transition-transform ${expandedId === entry.id ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {/* Expanded details */}
            {expandedId === entry.id && (
              <div className="px-4 pb-4 border-t border-white/[0.06] pt-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
                    <p className="text-xl font-bold text-emerald-300">
                      {entry.successCount}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">Imported</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-center">
                    <p className="text-xl font-bold text-yellow-300">
                      {entry.duplicatesFound}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      Duplicates
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-center">
                    <p className="text-xl font-bold text-red-300">
                      {entry.errorsFound}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">Errors</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 text-center">
                    <p className="text-xl font-bold text-orange-300">
                      {entry.warningsFound}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">Warnings</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main module ─────────────────────────────────────────────────────────────────

export function StakeholderAdminModule({
  isPrimaryAdmin = true,
}: { isPrimaryAdmin?: boolean }) {
  type Tab = "import" | "directory" | "visibility" | "history";
  const [activeTab, setActiveTab] = useState<Tab>("import");

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { id: "import", label: "Bulk Import", icon: Upload },
    { id: "directory", label: "Stakeholder Directory", icon: Users },
    { id: "visibility", label: "Visibility Governance", icon: Shield },
    { id: "history", label: "Import History", icon: FileSpreadsheet },
  ];

  if (!isPrimaryAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center">
          <Lock size={24} className="text-orange-400" />
        </div>
        <div className="text-center max-w-sm">
          <p className="text-base font-semibold text-white/80">
            Primary Admin Access Required
          </p>
          <p className="text-sm text-white/40 mt-2">
            User &amp; Stakeholder Administration is restricted to Primary
            Admins only. Contact your Primary Admin to perform bulk imports or
            configure visibility governance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">
              User &amp; Stakeholder Administration
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
              Primary Admin Only
            </span>
          </div>
          <p className="text-sm text-white/50">
            Bulk import stakeholders, manage the operational directory, and
            govern visibility across your channel ecosystem.
          </p>
        </div>
        <button
          type="button"
          data-ocid="stakeholder-admin.add_contact_button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors flex-shrink-0"
        >
          <Plus size={14} /> Add Stakeholder
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Stakeholders",
            value: "6",
            icon: Users,
            color: "text-orange-400",
          },
          {
            label: "Active",
            value: "5",
            icon: UserCheck,
            color: "text-emerald-400",
          },
          {
            label: "Pending Import",
            value: "0",
            icon: Upload,
            color: "text-blue-400",
          },
          {
            label: "Visibility Conflicts",
            value: "0",
            icon: AlertTriangle,
            color: "text-yellow-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              <stat.icon size={16} className={stat.color} />
            </div>
            <div>
              <p className="text-lg font-bold text-white/80 leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] text-white/40 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-ocid={`stakeholder-admin.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-white/40 hover:text-white/60"
              }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "import" && <BulkImportTab />}
        {activeTab === "directory" && <DirectoryManagementTab />}
        {activeTab === "visibility" && <VisibilityGovernanceTab />}
        {activeTab === "history" && <ImportHistoryTab />}
      </div>
    </div>
  );
}
