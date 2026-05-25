import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalBlob } from "@caffeineai/object-storage";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Edit2,
  FileDown,
  FileSpreadsheet,
  History,
  Lock,
  Plus,
  RotateCcw,
  ScrollText,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useApp } from "../AppContext";
import type { PriceListInput } from "../backend";
import {
  type ImportSummary,
  ImportWizard,
  parseCSVText,
} from "../components/ImportWizard";
import { useActor } from "../hooks/useActor";
import { formatDate } from "../utils/channelforge";

interface PLFormState {
  name: string;
  region: string;
  currency: string;
  productFamily: string;
  effectiveDate: string;
  expiryDate: string;
  version: string;
  fileKey: string;
  fileName: string;
}

const EMPTY_FORM: PLFormState = {
  name: "",
  region: "",
  currency: "USD",
  productFamily: "",
  effectiveDate: "",
  expiryDate: "",
  version: "1.0",
  fileKey: "",
  fileName: "",
};

// ── Version History & Upload Log types (local state only) ────────────────────────
interface VersionEntry {
  versionId: string;
  versionNumber: number;
  uploadDate: string;
  uploadedBy: string;
  rowCount: number;
  status: "active" | "archived";
}

interface UploadLogEntry {
  logId: string;
  timestamp: string;
  fileName: string;
  rowsImported: number;
  rowsSkipped: number;
  duplicatesHandled: number;
  uploaderName: string;
  details: {
    rowIndex: number;
    sku: string;
    status: "imported" | "skipped";
    reason?: string;
  }[];
  expanded: boolean;
}

// Dummy seed data
const SEED_VERSIONS: VersionEntry[] = [
  {
    versionId: "v3",
    versionNumber: 3,
    uploadDate: "2026-05-10",
    uploadedBy: "Sarah Chen",
    rowCount: 142,
    status: "active",
  },
  {
    versionId: "v2",
    versionNumber: 2,
    uploadDate: "2026-04-02",
    uploadedBy: "James Miller",
    rowCount: 138,
    status: "archived",
  },
  {
    versionId: "v1",
    versionNumber: 1,
    uploadDate: "2026-02-15",
    uploadedBy: "Sarah Chen",
    rowCount: 125,
    status: "archived",
  },
];

const SEED_LOGS: UploadLogEntry[] = [
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
        reason: "Missing Product Name",
      },
      { rowIndex: 18, sku: "", status: "skipped", reason: "Missing SKU" },
      {
        rowIndex: 99,
        sku: "NW-2211",
        status: "skipped",
        reason: "Missing SKU",
      },
    ],
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
    details: [],
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
    details: [],
  },
];

function dateToNs(dateStr: string): bigint {
  if (!dateStr) return BigInt(0);
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

function isExpired(expiryDate: bigint): boolean {
  const ms = Number(expiryDate) / 1_000_000;
  return ms < Date.now();
}

export function PriceLists() {
  const {
    priceLists,
    loading,
    isVendor,
    isPrimaryAdmin,
    getUserRole,
    hasPermission,
    refreshPriceLists,
  } = useApp();
  const { actor } = useActor();

  // Access governance: only upload if primaryAdmin, salesOps, or canManagePricing
  const canUpload =
    isPrimaryAdmin() ||
    getUserRole() === "SalesOps" ||
    hasPermission("canManagePricing");
  const vendorView = isVendor();

  // Upload wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardHeaders, setWizardHeaders] = useState<string[]>([]);
  const [wizardRows, setWizardRows] = useState<string[][]>([]);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<PLFormState>(EMPTY_FORM);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Version history + upload logs
  const [versions, setVersions] = useState<VersionEntry[]>(SEED_VERSIONS);
  const [logs, setLogs] = useState<UploadLogEntry[]>(SEED_LOGS);
  const [activeTab, setActiveTab] = useState<"lists" | "versions" | "logs">(
    "lists",
  );

  const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CAD", "SGD"];

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setUploadProgress(null);
    setModalOpen(true);
  }

  function openEdit(pl: (typeof priceLists)[number]) {
    setForm({
      name: pl.name,
      region: pl.region,
      currency: pl.currency,
      productFamily: pl.productFamily,
      effectiveDate: new Date(Number(pl.effectiveDate) / 1_000_000)
        .toISOString()
        .slice(0, 10),
      expiryDate: new Date(Number(pl.expiryDate) / 1_000_000)
        .toISOString()
        .slice(0, 10),
      version: pl.version,
      fileKey: pl.fileKey,
      fileName: pl.fileKey.split("/").pop() ?? "",
    });
    setEditId(pl.id);
    setUploadProgress(null);
    setModalOpen(true);
  }

  async function handleFileUpload(files: FileList | null) {
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

  async function handleCSVSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setPendingFile(file);
    const text = await file.text();
    const { headers, rows } = parseCSVText(text);
    setWizardHeaders(headers);
    setWizardRows(rows);
    setWizardOpen(true);
  }

  function handleImportComplete(summary: ImportSummary) {
    const newVersion: VersionEntry = {
      versionId: `v${versions.length + 1}`,
      versionNumber: versions.length + 1,
      uploadDate: new Date().toISOString().slice(0, 10),
      uploadedBy: "You",
      rowCount: summary.validCount,
      status: "active",
    };
    setVersions((vs) =>
      [
        newVersion,
        ...vs.map((v) => ({ ...v, status: "archived" as const })),
      ].slice(0, 10),
    );
    const newLog: UploadLogEntry = {
      logId: `ul${Date.now()}`,
      timestamp: new Date().toISOString(),
      fileName: pendingFile?.name ?? "imported.csv",
      rowsImported: summary.validCount,
      rowsSkipped: summary.invalidCount,
      duplicatesHandled: summary.duplicateSkus.length,
      uploaderName: "You",
      expanded: false,
      details: summary.rows
        .filter((r) => r._issues.length > 0)
        .slice(0, 20)
        .map((r) => ({
          rowIndex: r._rowIndex,
          sku: r.sku,
          status: "skipped",
          reason: r._issues[0],
        })),
    };
    setLogs((l) => [newLog, ...l]);
    setPendingFile(null);
    setActiveTab("logs");
  }

  function handleRollback(versionId: string) {
    setVersions((vs) =>
      vs.map((v) => ({
        ...v,
        status: v.versionId === versionId ? "active" : "archived",
      })),
    );
  }

  function toggleLogExpanded(logId: string) {
    setLogs((ls) =>
      ls.map((l) => (l.logId === logId ? { ...l, expanded: !l.expanded } : l)),
    );
  }

  async function handleSave() {
    if (!actor || !form.name || !form.effectiveDate || !form.expiryDate) return;
    setSaving(true);
    try {
      const input: PriceListInput = {
        name: form.name,
        region: form.region,
        currency: form.currency,
        productFamily: form.productFamily,
        effectiveDate: dateToNs(form.effectiveDate),
        expiryDate: dateToNs(form.expiryDate),
        version: form.version,
        fileKey: form.fileKey,
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

  async function handleDelete(id: string) {
    if (!actor) return;
    await actor.deletePriceList(id);
    await refreshPriceLists();
    setDeleteConfirmId(null);
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display">
            Price List Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {canUpload
              ? "Upload, manage, and version-control price lists for your reseller network"
              : "Price lists shared by your vendor partner"}
          </p>
        </div>
        {canUpload && vendorView && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              data-ocid="price_lists.import_csv_button"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary/40 gap-1.5 text-sm"
              onClick={() => csvInputRef.current?.click()}
            >
              <FileSpreadsheet size={14} /> Import CSV
            </Button>
            <Button
              type="button"
              data-ocid="price_lists.create_button"
              onClick={openCreate}
              className="text-white gap-1.5"
              style={{ background: "#FF6B2B" }}
            >
              <Plus size={15} /> Upload Price List
            </Button>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,.tsv"
              className="hidden"
              onChange={(e) => handleCSVSelect(e.target.files)}
            />
          </div>
        )}
        {!canUpload && vendorView && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
            style={{
              borderColor: "rgba(255,107,43,0.2)",
              background: "rgba(255,107,43,0.05)",
            }}
          >
            <Lock size={13} style={{ color: "#FF6B2B" }} />
            <span className="text-xs" style={{ color: "#FF6B2B" }}>
              Read-only access
            </span>
          </div>
        )}
      </div>

      {/* Read-only notice for non-upload users */}
      {!canUpload && (
        <div
          className="flex items-start gap-3 p-3 rounded-lg border"
          style={{
            borderColor: "rgba(255,107,43,0.2)",
            background: "rgba(255,107,43,0.04)",
          }}
        >
          <AlertCircle
            size={15}
            style={{ color: "#FF6B2B" }}
            className="mt-0.5 shrink-0"
          />
          <p className="text-xs text-muted-foreground">
            You have read-only access to price lists. To upload or modify
            pricing data, contact your Primary Admin or Sales Ops administrator.
          </p>
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-border/50">
        {(
          [
            { id: "lists", label: "Price Lists", icon: FileSpreadsheet },
            { id: "versions", label: "Version History", icon: History },
            { id: "logs", label: "Upload History", icon: ScrollText },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            data-ocid={`price_lists.tab.${id}`}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? "border-orange-500 text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
            style={activeTab === id ? { borderBottomColor: "#FF6B2B" } : {}}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Price Lists */}
      {activeTab === "lists" && (
        <div>
          {loading ? (
            <div className="crm-card p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : priceLists.length === 0 ? (
            <div
              className="crm-card flex flex-col items-center py-16"
              data-ocid="price_lists.empty_state"
            >
              <FileSpreadsheet
                size={40}
                className="text-muted-foreground mb-4"
              />
              <p className="text-base font-semibold text-foreground mb-1">
                No price lists yet
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {canUpload && vendorView
                  ? "Upload CSV or Excel price lists to share with your partners."
                  : "No price lists have been shared with you yet."}
              </p>
              {canUpload && vendorView && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="price_lists.empty.import_button"
                    onClick={() => csvInputRef.current?.click()}
                    className="border-border text-foreground hover:bg-secondary/40 gap-1.5"
                  >
                    <FileSpreadsheet size={14} /> Import CSV
                  </Button>
                  <Button
                    type="button"
                    data-ocid="price_lists.empty.upload_button"
                    onClick={openCreate}
                    className="text-white gap-1.5"
                    style={{ background: "#FF6B2B" }}
                  >
                    <Upload size={15} /> Upload Price List
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {priceLists.map((pl, i) => {
                  const expired = isExpired(pl.expiryDate);
                  return (
                    <div
                      key={pl.id}
                      data-ocid={`price_lists.item.${i + 1}`}
                      className="crm-card p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileSpreadsheet
                            size={16}
                            className="text-muted-foreground shrink-0"
                          />
                          <p className="font-semibold text-foreground text-sm truncate">
                            {pl.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className="status-badge"
                            style={{
                              background: expired
                                ? "rgba(239,68,68,0.12)"
                                : "rgba(34,197,94,0.12)",
                              color: expired ? "#f87171" : "#4ade80",
                            }}
                          >
                            {expired ? "Expired" : "Active"}
                          </span>
                          {canUpload && vendorView && (
                            <>
                              <button
                                type="button"
                                data-ocid={`price_lists.edit_button.${i + 1}`}
                                onClick={() => openEdit(pl)}
                                className="p-1 rounded hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Edit price list"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                data-ocid={`price_lists.delete_button.${i + 1}`}
                                onClick={() => setDeleteConfirmId(pl.id)}
                                className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                                aria-label="Delete price list"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {pl.region && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-border text-muted-foreground"
                          >
                            {pl.region}
                          </Badge>
                        )}
                        {pl.currency && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-border text-muted-foreground"
                          >
                            {pl.currency}
                          </Badge>
                        )}
                        {pl.productFamily && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-border text-muted-foreground"
                          >
                            {pl.productFamily}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                          style={{
                            borderColor: "rgba(255,107,43,0.3)",
                            color: "#FF6B2B",
                          }}
                        >
                          v{pl.version}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                            Effective
                          </p>
                          <p className="text-foreground">
                            {formatDate(pl.effectiveDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                            Expires
                          </p>
                          <p
                            className={
                              expired ? "text-red-400" : "text-foreground"
                            }
                          >
                            {formatDate(pl.expiryDate)}
                          </p>
                        </div>
                      </div>

                      {pl.fileKey && (
                        <a
                          href={ExternalBlob.fromURL(pl.fileKey).getDirectURL()}
                          target="_blank"
                          rel="noreferrer"
                          data-ocid={`price_lists.download_button.${i + 1}`}
                          className="flex items-center gap-1.5 text-xs mt-auto pt-2 border-t border-border/50 transition-colors group"
                          style={{ color: "#FF6B2B" }}
                        >
                          <FileDown size={13} className="shrink-0" />
                          <span>Download Price List</span>
                          <Download
                            size={11}
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop table */}
              <div className="crm-card overflow-hidden hidden xl:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "Name",
                        "Region",
                        "Currency",
                        "Product Family",
                        "Effective",
                        "Expires",
                        "Version",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {priceLists.map((pl, i) => {
                      const expired = isExpired(pl.expiryDate);
                      return (
                        <tr
                          key={pl.id}
                          data-ocid={`price_lists.table.item.${i + 1}`}
                          className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-foreground max-w-[160px]">
                            <div className="flex items-center gap-2 truncate">
                              <FileSpreadsheet
                                size={13}
                                className="text-muted-foreground shrink-0"
                              />
                              <span className="truncate">{pl.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {pl.region || "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {pl.currency || "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {pl.productFamily || "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {formatDate(pl.effectiveDate)}
                          </td>
                          <td
                            className={`px-4 py-3 ${expired ? "text-red-400" : "text-muted-foreground"}`}
                          >
                            {formatDate(pl.expiryDate)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className="text-[10px]"
                              style={{
                                borderColor: "rgba(255,107,43,0.3)",
                                color: "#FF6B2B",
                              }}
                            >
                              v{pl.version}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {pl.fileKey && (
                              <a
                                href={ExternalBlob.fromURL(
                                  pl.fileKey,
                                ).getDirectURL()}
                                target="_blank"
                                rel="noreferrer"
                                data-ocid={`price_lists.table.download_button.${i + 1}`}
                                className="flex items-center gap-1 text-xs transition-colors"
                                style={{ color: "#FF6B2B" }}
                              >
                                <Download size={13} /> Download
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Version History */}
      {activeTab === "versions" && (
        <div className="space-y-3" data-ocid="price_lists.versions_section">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Last {versions.length} versions — only one version can be active
              at a time.
            </p>
          </div>
          <div className="crm-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Version",
                    "Upload Date",
                    "Uploaded By",
                    "Rows",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {versions.map((v, i) => (
                  <tr
                    key={v.versionId}
                    data-ocid={`price_lists.version.item.${i + 1}`}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-foreground">
                        v{v.versionNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {v.uploadDate}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {v.uploadedBy}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {v.rowCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="status-badge"
                        style={{
                          background:
                            v.status === "active"
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(148,163,184,0.1)",
                          color: v.status === "active" ? "#4ade80" : "#94a3b8",
                        }}
                      >
                        {v.status === "active" ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {canUpload && v.status === "archived" && (
                        <button
                          type="button"
                          data-ocid={`price_lists.rollback_button.${i + 1}`}
                          onClick={() => handleRollback(v.versionId)}
                          className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
                          style={{ color: "#FF6B2B" }}
                        >
                          <RotateCcw size={12} /> Rollback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Upload History */}
      {activeTab === "logs" && (
        <div className="space-y-3" data-ocid="price_lists.logs_section">
          <p className="text-sm text-muted-foreground">
            All price list imports in reverse chronological order.
          </p>
          {logs.length === 0 ? (
            <div className="crm-card flex flex-col items-center py-12">
              <ScrollText size={32} className="text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No upload history yet
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div
                  key={log.logId}
                  data-ocid={`price_lists.log.item.${i + 1}`}
                  className="crm-card overflow-hidden"
                >
                  <button
                    type="button"
                    className="flex items-center justify-between p-4 w-full text-left cursor-pointer hover:bg-secondary/20 transition-colors"
                    onClick={() => toggleLogExpanded(log.logId)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      toggleLogExpanded(log.logId)
                    }
                    aria-expanded={log.expanded}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,107,43,0.15)" }}
                      >
                        <FileSpreadsheet
                          size={13}
                          style={{ color: "#FF6B2B" }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {log.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()} &middot;{" "}
                          {log.uploaderName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 ml-4">
                      <div className="text-right hidden sm:block">
                        <p
                          className="text-xs font-semibold"
                          style={{ color: "#4ade80" }}
                        >
                          {log.rowsImported} imported
                        </p>
                        {log.rowsSkipped > 0 && (
                          <p className="text-xs" style={{ color: "#f87171" }}>
                            {log.rowsSkipped} skipped
                          </p>
                        )}
                        {log.duplicatesHandled > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {log.duplicatesHandled} dupes handled
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="text-muted-foreground"
                        data-ocid={`price_lists.log.toggle.${i + 1}`}
                      >
                        {log.expanded ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )}
                      </button>
                    </div>
                  </button>
                  {log.expanded && log.details.length > 0 && (
                    <div className="border-t border-border/40">
                      <div
                        className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                        style={{ background: "rgba(255,107,43,0.04)" }}
                      >
                        Per-row outcomes (skipped rows)
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border/20">
                            {["Row", "SKU", "Status", "Reason"].map((h) => (
                              <th
                                key={h}
                                className="px-4 py-2 text-left text-muted-foreground"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {log.details.map((d) => (
                            <tr
                              key={d.rowIndex}
                              className="border-b border-border/10 last:border-0"
                            >
                              <td className="px-4 py-2 text-muted-foreground">
                                {d.rowIndex}
                              </td>
                              <td className="px-4 py-2 font-mono text-foreground">
                                {d.sku || (
                                  <em className="text-muted-foreground">—</em>
                                )}
                              </td>
                              <td className="px-4 py-2">
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded"
                                  style={{
                                    background: "rgba(239,68,68,0.15)",
                                    color: "#f87171",
                                  }}
                                >
                                  {d.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">
                                {d.reason ?? "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {log.expanded && log.details.length === 0 && (
                    <div className="px-4 pb-4 pt-2 border-t border-border/40">
                      <p className="text-xs text-muted-foreground">
                        All rows imported successfully — no issues detected.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Import Wizard */}
      <ImportWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        rawHeaders={wizardHeaders}
        rawRows={wizardRows}
        onImport={handleImportComplete}
      />

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            background: "#0e1b2e",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground font-display">
              {editId ? "Edit Price List" : "Upload Price List"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Price List Name *
              </Label>
              <Input
                data-ocid="price_lists.modal.name_input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Global Security Suite Q2 2026"
                className="crm-input h-8 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Region</Label>
                <Input
                  data-ocid="price_lists.modal.region_input"
                  value={form.region}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, region: e.target.value }))
                  }
                  placeholder="EMEA"
                  className="crm-input h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Currency
                </Label>
                <select
                  data-ocid="price_lists.modal.currency_select"
                  value={form.currency}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, currency: e.target.value }))
                  }
                  className="crm-input h-8 text-sm w-full px-2"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Product Family
                </Label>
                <Input
                  data-ocid="price_lists.modal.product_family_input"
                  value={form.productFamily}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, productFamily: e.target.value }))
                  }
                  placeholder="Security Suite"
                  className="crm-input h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Version</Label>
                <Input
                  data-ocid="price_lists.modal.version_input"
                  value={form.version}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, version: e.target.value }))
                  }
                  placeholder="1.0"
                  className="crm-input h-8 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Effective Date *
                </Label>
                <Input
                  data-ocid="price_lists.modal.effective_date_input"
                  type="date"
                  value={form.effectiveDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, effectiveDate: e.target.value }))
                  }
                  className="crm-input h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Expiry Date *
                </Label>
                <Input
                  data-ocid="price_lists.modal.expiry_date_input"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  className="crm-input h-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Price List File
              </Label>
              <button
                type="button"
                data-ocid="price_lists.modal.dropzone"
                className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    fileInputRef.current?.click();
                }}
                aria-label="Upload file"
              >
                <Upload
                  size={20}
                  className="mx-auto mb-2 text-muted-foreground"
                />
                {form.fileName ? (
                  <p className="text-xs text-foreground font-medium">
                    {form.fileName}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Drop file here or{" "}
                    <span style={{ color: "#FF6B2B" }}>browse</span>
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  XLSX, XLS, PDF
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </button>

              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                      background: "#FF6B2B",
                    }}
                  />
                </div>
              )}

              {form.fileKey && form.fileName && uploadProgress === 100 && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-secondary/20">
                  <FileSpreadsheet
                    size={13}
                    className="text-muted-foreground shrink-0"
                  />
                  <span className="text-xs text-foreground truncate flex-1">
                    {form.fileName}
                  </span>
                  <span className="text-[10px] text-green-400">✓ Uploaded</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, fileKey: "", fileName: "" }))
                    }
                    className="shrink-0 text-muted-foreground hover:text-red-400 transition-colors"
                    aria-label="Remove file"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                data-ocid="price_lists.modal.cancel_button"
                onClick={() => setModalOpen(false)}
                className="border-border text-foreground hover:bg-secondary/40"
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="price_lists.modal.submit_button"
                onClick={handleSave}
                disabled={
                  saving ||
                  !form.name ||
                  !form.effectiveDate ||
                  !form.expiryDate
                }
                className="text-white"
                style={{ background: "#FF6B2B" }}
              >
                {saving
                  ? "Saving..."
                  : editId
                    ? "Update Price List"
                    : "Save Price List"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent
          className="max-w-sm"
          style={{
            background: "#0e1b2e",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete Price List?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            This price list will be permanently removed and partners will no
            longer be able to download it.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              data-ocid="price_lists.delete.cancel_button"
              onClick={() => setDeleteConfirmId(null)}
              className="border-border text-foreground hover:bg-secondary/40"
            >
              Cancel
            </Button>
            <Button
              type="button"
              data-ocid="price_lists.delete.confirm_button"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
