import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  Copy,
  Download,
  Edit3,
  FileText,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { QuoteBuilder } from "../components/QuoteBuilder";
import type { QuoteRecord } from "../types/quotes";
import { formatCurrency } from "../utils/channelforge";

const SEED_QUOTES: QuoteRecord[] = [
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
        billingTerm: "Annual",
      },
      {
        id: "li-002",
        sku: "SUP-PRO-001",
        productName: "Premium Support",
        quantity: 50,
        unitPrice: 300,
        discountPct: 5,
        billingTerm: "Annual",
      },
    ],
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
    totalValue: 328000,
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
        billingTerm: "One-Time",
      },
      {
        id: "li-004",
        sku: "NET-FW-200",
        productName: "Next-Gen Firewall",
        quantity: 4,
        unitPrice: 18500,
        discountPct: 10,
        billingTerm: "One-Time",
      },
    ],
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
        billingTerm: "Monthly",
      },
    ],
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
    totalValue: 142000,
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
        billingTerm: "Annual",
      },
    ],
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
    lineItems: [],
  },
];

const STATUS_COLORS: Record<QuoteRecord["status"], string> = {
  Draft: "bg-muted text-muted-foreground border border-border",
  "Pending Approval":
    "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Expired: "bg-red-500/15 text-red-400 border border-red-500/30",
};

function loadQuotes(): QuoteRecord[] {
  try {
    const raw = localStorage.getItem("channelforge_quotes");
    if (raw) return JSON.parse(raw) as QuoteRecord[];
  } catch {}
  localStorage.setItem("channelforge_quotes", JSON.stringify(SEED_QUOTES));
  return SEED_QUOTES;
}

function saveQuotes(quotes: QuoteRecord[]) {
  try {
    localStorage.setItem("channelforge_quotes", JSON.stringify(quotes));
  } catch {}
}

export function QuotesPage() {
  const { userProfile } = useApp();
  const roleStr = String(userProfile?.role ?? "").toLowerCase();
  const isReadOnly =
    roleStr.includes("finance") ||
    roleStr.includes("leadership") ||
    roleStr.includes("regional director");
  const isSalesOps =
    roleStr.includes("sales ops") || roleStr.includes("sales operations");

  const [quotes, setQuotes] = useState<QuoteRecord[]>(() => loadQuotes());
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const owners = useMemo(
    () => Array.from(new Set(quotes.map((q) => q.owner))).sort(),
    [quotes],
  );

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
      if (ownerFilter && q.owner !== ownerFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          q.quoteNumber.toLowerCase().includes(term) ||
          q.accountName.toLowerCase().includes(term) ||
          (q.opportunityName ?? "").toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [quotes, statusFilter, ownerFilter, searchTerm]);

  function handleSaveQuote(quote: QuoteRecord) {
    setQuotes((prev) => {
      const idx = prev.findIndex((q) => q.id === quote.id);
      const next =
        idx >= 0
          ? prev.map((q) => (q.id === quote.id ? quote : q))
          : [quote, ...prev];
      saveQuotes(next);
      return next;
    });
    setBuilderOpen(false);
    setEditingQuote(null);
    toast.success(`Quote ${quote.quoteNumber} saved`);
  }

  function handleClone(quote: QuoteRecord) {
    const now = new Date();
    const year = now.getFullYear();
    const existing = quotes.filter((q) =>
      q.quoteNumber.startsWith(`CF-${year}-`),
    );
    const nextNum = String(existing.length + 1).padStart(4, "0");
    const cloned: QuoteRecord = {
      ...quote,
      id: `q-${Date.now()}`,
      quoteNumber: `CF-${year}-${nextNum}`,
      version: 1,
      status: "Draft",
      createdDate: now.toISOString().split("T")[0],
    };
    setQuotes((prev) => {
      const next = [cloned, ...prev];
      saveQuotes(next);
      return next;
    });
    toast.success(`Cloned as ${cloned.quoteNumber}`);
  }

  function handleDelete(id: string) {
    setQuotes((prev) => {
      const next = prev.filter((q) => q.id !== id);
      saveQuotes(next);
      return next;
    });
    toast.success("Quote deleted");
  }

  function handleExportPDF(quote: QuoteRecord) {
    // Render a print-ready hidden div then trigger window.print()
    const printContent = buildPrintHTML(quote);
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Could not open print window — allow popups");
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

  function handleEdit(quote: QuoteRecord) {
    setEditingQuote(quote);
    setBuilderOpen(true);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <FileText size={16} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display text-foreground">
              Quotes
            </h1>
            <p className="text-xs text-muted-foreground">
              {quotes.length} quotes in system
            </p>
          </div>
        </div>
        {!isReadOnly && (
          <Button
            type="button"
            onClick={handleNewQuote}
            className="gap-2"
            data-ocid="quotes.new_quote_button"
          >
            <Plus size={14} />
            New Quote
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-border bg-card/60 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quotes…"
            className="pl-9 h-8 text-sm"
            data-ocid="quotes.search_input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="h-8 text-sm w-[160px]"
              data-ocid="quotes.status_filter"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          {isSalesOps && (
            <Select
              value={ownerFilter || "all"}
              onValueChange={(v) => setOwnerFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger
                className="h-8 text-sm w-[180px]"
                data-ocid="quotes.owner_filter"
              >
                <SelectValue placeholder="All Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                {owners.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-64 gap-3"
            data-ocid="quotes.empty_state"
          >
            <FileText size={36} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No quotes found</p>
            {!isReadOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNewQuote}
              >
                <Plus size={13} className="mr-1" /> Create first quote
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Quote #
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Account
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden lg:table-cell">
                  Opportunity
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                  Owner
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden xl:table-cell">
                  Created
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide hidden xl:table-cell">
                  Expires
                </th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                  Value
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr
                  key={q.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
                  data-ocid={`quotes.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {q.quoteNumber}
                      </span>
                      {q.version > 1 && (
                        <span className="text-[10px] text-muted-foreground">
                          v{q.version}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {q.accountName}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-muted-foreground text-xs">
                      {q.opportunityName ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_COLORS[q.status]}`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-muted-foreground text-xs">
                      {q.owner}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-muted-foreground text-xs">
                      {q.createdDate}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <span className="text-muted-foreground text-xs">
                      {q.expiryDate}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-foreground tabular-nums">
                      {q.totalValue > 0
                        ? formatCurrency(q.totalValue, q.currency)
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isReadOnly && (
                        <button
                          type="button"
                          title="Edit"
                          data-ocid={`quotes.edit_button.${i + 1}`}
                          onClick={() => handleEdit(q)}
                          className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Edit3 size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Clone"
                        data-ocid={`quotes.clone_button.${i + 1}`}
                        onClick={() => handleClone(q)}
                        className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        type="button"
                        title="Export PDF"
                        data-ocid={`quotes.export_button.${i + 1}`}
                        onClick={() => handleExportPDF(q)}
                        className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Download size={13} />
                      </button>
                      {!isReadOnly && q.status === "Draft" && (
                        <button
                          type="button"
                          title="Delete"
                          data-ocid={`quotes.delete_button.${i + 1}`}
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {builderOpen && (
        <QuoteBuilder
          quote={editingQuote}
          allQuotes={quotes}
          onSave={handleSaveQuote}
          onClose={() => {
            setBuilderOpen(false);
            setEditingQuote(null);
          }}
          readOnly={isReadOnly}
        />
      )}
    </div>
  );
}

// ─── PDF print HTML ───────────────────────────────────────────────────────────
function buildPrintHTML(q: QuoteRecord): string {
  const lineItemRows = q.lineItems
    .map((li) => {
      const lineTotal = li.quantity * li.unitPrice * (1 - li.discountPct / 100);
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${li.sku}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${li.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${li.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right">£${li.unitPrice.toLocaleString()}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${li.discountPct}%</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right">£${lineTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${li.billingTerm}</td>
      </tr>`;
    })
    .join("");

  const subtotal = q.lineItems.reduce(
    (s, li) => s + li.quantity * li.unitPrice * (1 - li.discountPct / 100),
    0,
  );
  const totalDiscount = q.lineItems.reduce(
    (s, li) => s + li.quantity * li.unitPrice * (li.discountPct / 100),
    0,
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
      <tr><td colspan="5" style="padding:8px 12px;text-align:right;color:#64748b">List Subtotal:</td><td style="padding:8px 12px;text-align:right">£${(subtotal + totalDiscount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td><td></td></tr>
      <tr><td colspan="5" style="padding:8px 12px;text-align:right;color:#64748b">Discount:</td><td style="padding:8px 12px;text-align:right;color:#16a34a">-£${totalDiscount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td><td></td></tr>
      <tr class="total-row"><td colspan="5" style="padding:8px 12px;text-align:right">Total Quote Value:</td><td style="padding:8px 12px;text-align:right;color:#f97316;font-size:16px">£${subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td><td></td></tr>
    </tfoot>
  </table>
  ${q.notes ? `<div style="padding:12px 16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:4px;margin-bottom:24px"><div style="font-size:11px;color:#64748b;margin-bottom:4px">NOTES</div><div style="font-size:13px">${q.notes}</div></div>` : ""}
  <div style="padding:12px 16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:4px;font-size:12px;color:#64748b">
    <strong>Terms & Conditions:</strong> This quote is valid until ${q.expiryDate}. All prices are exclusive of applicable taxes. Payment terms: 30 days net. Prices subject to change after expiry date. CHANNELFORGE CRM is proprietary software. All rights reserved.
  </div>
  </body></html>`;
}
