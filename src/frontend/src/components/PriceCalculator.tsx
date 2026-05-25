import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/channelforge";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Minus,
  Plus,
  RefreshCw,
  Save,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FAMILY_COLORS,
  MOCK_PRODUCTS,
  type MockProduct,
  type PricingType,
} from "../data/mockPriceLists";

// ─── Types ───────────────────────────────────────────────────────────────────

export type BillingTerm = "monthly" | "annual" | "2year" | "3year";

export interface PriceRow {
  rowId: string;
  product: MockProduct;
  quantity: number;
  discountPct: number;
  pricingType: PricingType;
}

export interface CalculatedQuote {
  id: string;
  rows: PriceRow[];
  subtotal: number;
  totalDiscounts: number;
  partnerPrice: number;
  customerPrice: number;
  marginPct: number;
  renewalValue: number;
  arr: number;
  finalQuoteEstimate: number;
  billingTerm: BillingTerm;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TERM_MULTIPLIERS: Record<BillingTerm, number> = {
  monthly: 1,
  annual: 12,
  "2year": 24,
  "3year": 36,
};

const RENEWAL_UPLIFT = 0.03; // 3% default renewal uplift

function getUnitPrice(product: MockProduct, pricingType: PricingType): number {
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

function getMonthlyBase(
  product: MockProduct,
  pricingType: PricingType,
): number {
  const unit = getUnitPrice(product, pricingType);
  return product.billingFrequency === "monthly" ? unit : unit / 12;
}

function calcRowLineTotals(
  row: PriceRow,
  billingTerm: BillingTerm,
): {
  unitPrice: number;
  lineTotal: number;
  listLineTotal: number;
  discountAmount: number;
  partnerLineTotal: number;
  renewalLineTotal: number;
  marginPct: number;
} {
  const termMonths = TERM_MULTIPLIERS[billingTerm];
  const monthlyUnit = getMonthlyBase(row.product, row.pricingType);
  const monthlyList = getMonthlyBase(row.product, "list");
  const monthlyPartner = Math.min(
    getMonthlyBase(row.product, "distributor"),
    getMonthlyBase(row.product, "reseller"),
  );
  const monthlyRenewal = getMonthlyBase(row.product, "renewal");

  const unitPrice = monthlyUnit * termMonths;
  const listLineTotal = monthlyList * termMonths * row.quantity;
  const rawLineTotal = unitPrice * row.quantity;
  const discountAmount = rawLineTotal * (row.discountPct / 100);
  const lineTotal = rawLineTotal - discountAmount;
  const partnerLineTotal = monthlyPartner * termMonths * row.quantity;
  const renewalLineTotal = monthlyRenewal * termMonths * row.quantity;
  const marginPct =
    lineTotal > 0
      ? Math.max(0, ((lineTotal - partnerLineTotal) / lineTotal) * 100)
      : 0;

  return {
    unitPrice,
    lineTotal,
    listLineTotal,
    discountAmount,
    partnerLineTotal,
    renewalLineTotal,
    marginPct,
  };
}

function generateQuoteId(): string {
  return `QT-${Date.now().toString(36).toUpperCase()}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FamilyBadge({ family }: { family: string }) {
  const cls =
    FAMILY_COLORS[family as keyof typeof FAMILY_COLORS] ??
    "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${cls}`}
    >
      {family}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface PriceCalculatorProps {
  accountId?: string;
  opportunityId?: string;
  onQuoteCreated?: (quote: CalculatedQuote) => void;
  readOnly?: boolean;
  /** Override for role-based display; if not provided, falls back to non-restricted */
  userRole?: string;
}

export function PriceCalculator({
  onQuoteCreated,
  readOnly = false,
  userRole = "salesRep",
}: PriceCalculatorProps) {
  const isReadOnly =
    readOnly || userRole === "finance" || userRole === "leadership";
  const isSalesOps = userRole === "salesOps";

  // ── State ────────────────────────────────────────────────────────────
  const [billingTerm, setBillingTerm] = useState<BillingTerm>("annual");
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showMarginAnalysis, setShowMarginAnalysis] = useState(false);
  const [showMultiYearBreakdown, setShowMultiYearBreakdown] = useState(false);
  const [quoteSaved, setQuoteSaved] = useState(false);

  // ── Product search filter ─────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.productFamily.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // ── Derived totals ────────────────────────────────────────────────────
  const totals = useMemo(() => {
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

    const marginPct =
      customerPrice > 0
        ? ((customerPrice - partnerPrice) / customerPrice) * 100
        : 0;

    const arr = billingTerm === "monthly" ? customerPrice * 12 : customerPrice;
    const finalQuoteEstimate = customerPrice; // tax TBD

    return {
      subtotal,
      totalDiscounts,
      partnerPrice,
      customerPrice,
      marginPct,
      renewalValue,
      arr,
      finalQuoteEstimate,
    };
  }, [rows, billingTerm]);

  // ── Multi-year breakdown ──────────────────────────────────────────────
  const multiYearBreakdown = useMemo(() => {
    if (billingTerm !== "2year" && billingTerm !== "3year") return null;
    const years = billingTerm === "2year" ? 2 : 3;
    return Array.from({ length: years }, (_, i) => {
      const uplift = (1 + RENEWAL_UPLIFT) ** i;
      return {
        year: i + 1,
        value: i === 0 ? totals.customerPrice : totals.customerPrice * uplift,
        label:
          i === 0
            ? "Initial Term"
            : `Year ${i + 1} (Renewal +${(RENEWAL_UPLIFT * 100).toFixed(0)}%/yr)`,
      };
    });
  }, [billingTerm, totals.customerPrice]);

  // ── Row management ────────────────────────────────────────────────────
  const addProduct = useCallback((product: MockProduct) => {
    setRows((prev) => [
      ...prev,
      {
        rowId: `${product.sku}-${Date.now()}`,
        product,
        quantity: 1,
        discountPct: 0,
        pricingType: "list",
      },
    ]);
    setShowSearch(false);
    setSearchQuery("");
  }, []);

  const removeRow = useCallback((rowId: string) => {
    setRows((prev) => prev.filter((r) => r.rowId !== rowId));
  }, []);

  const updateRow = useCallback(
    (rowId: string, patch: Partial<Omit<PriceRow, "rowId" | "product">>) => {
      setRows((prev) =>
        prev.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)),
      );
    },
    [],
  );

  // ── Quote save ────────────────────────────────────────────────────────
  const handleSaveQuote = useCallback(() => {
    const quote: CalculatedQuote = {
      id: generateQuoteId(),
      rows,
      ...totals,
      billingTerm,
      createdAt: new Date().toISOString(),
    };
    onQuoteCreated?.(quote);
    setQuoteSaved(true);
    setTimeout(() => setQuoteSaved(false), 3000);
  }, [rows, totals, billingTerm, onQuoteCreated]);

  // ── Export pricing summary ────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const lines: string[] = [
      "CHANNELFORGE — Pricing Summary",
      `Generated: ${new Date().toLocaleString()}`,
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
          t.lineTotal.toFixed(2),
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
      "Tax,TBD — calculated at invoicing",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `channelforge-pricing-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rows, totals, billingTerm]);

  // Reset quoteSaved on mount only
  useEffect(() => {
    setQuoteSaved(false);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="pricing-panel flex flex-col gap-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-card/80 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Operational Price Calculator
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time pricing · {rows.length} product
            {rows.length !== 1 ? "s" : ""} selected
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Billing term selector */}
          <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-background/60 p-1">
            {(["monthly", "annual", "2year", "3year"] as BillingTerm[]).map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  data-ocid={`price-calc.billing_term.${term}`}
                  onClick={() => !isReadOnly && setBillingTerm(term)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all duration-150 ${
                    billingTerm === term
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  } ${isReadOnly ? "cursor-default" : "cursor-pointer"}`}
                >
                  {term === "monthly"
                    ? "Monthly"
                    : term === "annual"
                      ? "Annual"
                      : term === "2year"
                        ? "2-Year"
                        : "3-Year"}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left: Product rows */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Product rows */}
          <div className="flex-1 overflow-auto">
            {rows.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-3 py-16 text-center"
                data-ocid="price-calc.empty_state"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No products added
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Search and add products to begin calculating
                  </p>
                </div>
                {!isReadOnly && (
                  <Button
                    size="sm"
                    onClick={() => setShowSearch(true)}
                    data-ocid="price-calc.add_product_button"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Product
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {/* Column headers */}
                <div className="grid grid-cols-[1fr_80px_100px_110px_80px_90px_32px] items-center gap-2 bg-muted/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Product</span>
                  <span className="text-center">Qty</span>
                  <span>Pricing</span>
                  <span className="text-right">Discount</span>
                  <span className="text-right">Unit</span>
                  <span className="text-right">Total</span>
                  <span />
                </div>

                {rows.map((row, idx) => (
                  <ProductRow
                    key={row.rowId}
                    row={row}
                    billingTerm={billingTerm}
                    isReadOnly={isReadOnly}
                    onUpdate={updateRow}
                    onRemove={removeRow}
                    index={idx + 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add Product button */}
          {!isReadOnly && (
            <div className="border-t border-border/30 px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setShowSearch((v) => !v)}
                data-ocid="price-calc.add_product_button"
              >
                {showSearch ? (
                  <>
                    <X className="h-3.5 w-3.5" /> Close Search
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" /> Add Product
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Search panel */}
          {showSearch && !isReadOnly && (
            <ProductSearchPanel
              query={searchQuery}
              onQueryChange={setSearchQuery}
              products={filteredProducts}
              onSelect={addProduct}
              selectedSkus={rows.map((r) => r.product.sku)}
            />
          )}
        </div>

        {/* Right: Pricing Summary */}
        <div className="w-full shrink-0 border-t border-border/30 bg-muted/20 lg:w-72 lg:border-l lg:border-t-0">
          <PricingSummaryPanel
            totals={totals}
            billingTerm={billingTerm}
            multiYearBreakdown={multiYearBreakdown}
            showMultiYearBreakdown={showMultiYearBreakdown}
            onToggleMultiYear={() => setShowMultiYearBreakdown((v) => !v)}
          />
        </div>
      </div>

      {/* Sales Ops: Margin Analysis */}
      {isSalesOps && rows.length > 0 && (
        <div className="border-t border-border/30">
          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowMarginAnalysis((v) => !v)}
            data-ocid="price-calc.margin_analysis.toggle"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Margin Analysis
            </span>
            {showMarginAnalysis ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {showMarginAnalysis && (
            <MarginAnalysisPanel rows={rows} billingTerm={billingTerm} />
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between border-t border-border/40 bg-card/60 px-5 py-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleExport}
          data-ocid="price-calc.export_button"
        >
          <Download className="h-3.5 w-3.5" />
          Export Pricing Summary
        </Button>

        {!isReadOnly && (
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleSaveQuote}
            disabled={rows.length === 0}
            data-ocid="price-calc.save_quote_button"
          >
            {quoteSaved ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Saved!
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Save as Quote
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Product Row ──────────────────────────────────────────────────────────────

const PRICING_TYPE_LABELS: Record<PricingType, string> = {
  list: "List Price",
  promo: "Promo",
  renewal: "Renewal",
  distributor: "Distributor",
  reseller: "Reseller",
};

function ProductRow({
  row,
  billingTerm,
  isReadOnly,
  onUpdate,
  onRemove,
  index,
}: {
  row: PriceRow;
  billingTerm: BillingTerm;
  isReadOnly: boolean;
  onUpdate: (
    rowId: string,
    patch: Partial<Omit<PriceRow, "rowId" | "product">>,
  ) => void;
  onRemove: (rowId: string) => void;
  index: number;
}) {
  const t = calcRowLineTotals(row, billingTerm);
  const isLowMargin = t.marginPct < 15;

  return (
    <div
      className="editable-product-row pricing-row grid grid-cols-[1fr_80px_100px_110px_80px_90px_32px] items-center gap-2 px-4 py-3 transition-colors hover:bg-muted/20"
      data-ocid={`price-calc.product_row.${index}`}
    >
      {/* Product info */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate text-sm font-medium text-foreground">
            {row.product.name}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">
            {row.product.sku}
          </span>
          <FamilyBadge family={row.product.productFamily} />
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-center">
        {isReadOnly ? (
          <span className="text-sm text-foreground">{row.quantity}</span>
        ) : (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() =>
                onUpdate(row.rowId, { quantity: Math.max(1, row.quantity - 1) })
              }
              data-ocid={`price-calc.qty_minus.${index}`}
            >
              <Minus className="h-3 w-3" />
            </button>
            <Input
              type="number"
              min={1}
              value={row.quantity}
              onChange={(e) =>
                onUpdate(row.rowId, {
                  quantity: Math.max(1, Number.parseInt(e.target.value) || 1),
                })
              }
              className="h-6 w-10 border-border/50 bg-background/60 px-1 text-center text-xs"
              data-ocid={`price-calc.qty_input.${index}`}
            />
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded border border-border/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() =>
                onUpdate(row.rowId, { quantity: row.quantity + 1 })
              }
              data-ocid={`price-calc.qty_plus.${index}`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Pricing type */}
      <div>
        {isReadOnly ? (
          <span className="text-xs text-foreground">
            {PRICING_TYPE_LABELS[row.pricingType]}
          </span>
        ) : (
          <select
            value={row.pricingType}
            onChange={(e) =>
              onUpdate(row.rowId, {
                pricingType: e.target.value as PricingType,
              })
            }
            className="h-7 w-full rounded border border-border/50 bg-background/60 px-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            data-ocid={`price-calc.pricing_type.${index}`}
          >
            {(
              Object.entries(PRICING_TYPE_LABELS) as [PricingType, string][]
            ).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Discount */}
      <div className="flex items-center justify-end gap-1">
        {isReadOnly ? (
          <span className="text-xs text-foreground">{row.discountPct}%</span>
        ) : (
          <div className="relative flex items-center">
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              value={row.discountPct}
              onChange={(e) =>
                onUpdate(row.rowId, {
                  discountPct: Math.min(
                    100,
                    Math.max(0, Number.parseFloat(e.target.value) || 0),
                  ),
                })
              }
              className="h-7 w-16 border-border/50 bg-background/60 pr-4 text-right text-xs"
              data-ocid={`price-calc.discount_input.${index}`}
            />
            <span className="pointer-events-none absolute right-1.5 text-xs text-muted-foreground">
              %
            </span>
          </div>
        )}
        {row.discountPct > 0 && (
          <span className="pricing-discount-badge inline-flex items-center rounded border border-orange-500/30 bg-orange-500/10 px-1 py-0.5 text-[9px] font-semibold text-orange-400">
            -{row.discountPct}%
          </span>
        )}
      </div>

      {/* Unit price */}
      <div className="text-right">
        <span className="text-xs font-mono text-muted-foreground">
          {formatCurrency(t.unitPrice, row.product.currency)}
        </span>
      </div>

      {/* Line total */}
      <div className="text-right">
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatCurrency(t.lineTotal, row.product.currency)}
        </span>
        {isLowMargin && (
          <div className="pricing-margin-warning mt-0.5 flex items-center justify-end gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span className="text-[10px] text-amber-400">Low margin</span>
          </div>
        )}
      </div>

      {/* Remove */}
      <div className="flex items-center justify-center">
        {!isReadOnly && (
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
            onClick={() => onRemove(row.rowId)}
            data-ocid={`price-calc.remove_row.${index}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Product Search Panel ────────────────────────────────────────────────────

function ProductSearchPanel({
  query,
  onQueryChange,
  products,
  onSelect,
  selectedSkus,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  products: MockProduct[];
  onSelect: (p: MockProduct) => void;
  selectedSkus: string[];
}) {
  return (
    <div
      className="border-t border-border/30 bg-background/60 px-4 pb-4 pt-3"
      data-ocid="price-calc.product_search_panel"
    >
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name, SKU, or product family…"
          className="pl-8 text-sm"
          autoFocus
          data-ocid="price-calc.search_input"
        />
      </div>
      <ScrollArea className="h-56">
        <div className="space-y-1">
          {products.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No products match your search
            </p>
          ) : (
            products.map((p) => {
              const already = selectedSkus.includes(p.sku);
              return (
                <button
                  key={p.sku}
                  type="button"
                  disabled={already}
                  onClick={() => !already && onSelect(p)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${
                    already
                      ? "cursor-default opacity-40"
                      : "cursor-pointer hover:bg-primary/10 hover:border-primary/30 border border-transparent"
                  }`}
                  data-ocid={`price-calc.search_result.${p.sku}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">
                        {p.name}
                      </span>
                      <FamilyBadge family={p.productFamily} />
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {p.sku}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        ·
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {p.region}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        ·
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {p.vendor}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(p.basePrice, p.currency)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {p.billingFrequency}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Pricing Summary Panel ────────────────────────────────────────────────────

interface TotalsShape {
  subtotal: number;
  totalDiscounts: number;
  partnerPrice: number;
  customerPrice: number;
  marginPct: number;
  renewalValue: number;
  arr: number;
  finalQuoteEstimate: number;
}

function PricingSummaryPanel({
  totals,
  billingTerm,
  multiYearBreakdown,
  showMultiYearBreakdown,
  onToggleMultiYear,
}: {
  totals: TotalsShape;
  billingTerm: BillingTerm;
  multiYearBreakdown: { year: number; value: number; label: string }[] | null;
  showMultiYearBreakdown: boolean;
  onToggleMultiYear: () => void;
}) {
  const isLowMargin = totals.marginPct < 15 && totals.customerPrice > 0;
  const isHighRenewal = totals.renewalValue > 50000;

  const SummaryRow = ({
    label,
    value,
    highlight,
    muted,
    large,
  }: {
    label: string;
    value: string;
    highlight?: boolean;
    muted?: boolean;
    large?: boolean;
  }) => (
    <div
      className={`flex items-center justify-between py-1.5 ${
        highlight ? "pricing-renewal-highlight" : ""
      }`}
    >
      <span
        className={`text-xs ${
          muted
            ? "text-muted-foreground"
            : highlight
              ? "font-medium text-emerald-400"
              : "text-foreground/80"
        }`}
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${
          large
            ? "text-base font-bold text-foreground"
            : highlight
              ? "text-sm font-semibold text-emerald-400"
              : muted
                ? "text-xs text-muted-foreground"
                : "text-sm font-medium text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="flex h-full flex-col px-5 py-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Pricing Summary
      </h3>

      <div className="flex-1 space-y-0.5">
        <SummaryRow
          label="Subtotal (List Price)"
          value={totals.subtotal > 0 ? formatCurrency(totals.subtotal) : "—"}
          muted
        />
        <SummaryRow
          label="Total Discounts"
          value={
            totals.totalDiscounts > 0
              ? `-${formatCurrency(totals.totalDiscounts)}`
              : "—"
          }
          muted
        />
        <Separator className="my-2 opacity-30" />
        <SummaryRow
          label="Partner Price"
          value={
            totals.partnerPrice > 0 ? formatCurrency(totals.partnerPrice) : "—"
          }
        />
        <SummaryRow
          label="Customer Price"
          value={
            totals.customerPrice > 0
              ? formatCurrency(totals.customerPrice)
              : "—"
          }
        />

        {/* Margin */}
        <div className="mt-1 flex items-center justify-between py-1">
          <span className="text-xs text-foreground/80">Est. Margin</span>
          <div className="flex items-center gap-1.5">
            {isLowMargin && (
              <span className="pricing-margin-warning flex items-center gap-0.5 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                Below threshold
              </span>
            )}
            <span
              className={`text-sm font-semibold tabular-nums ${
                isLowMargin
                  ? "text-amber-400"
                  : totals.marginPct >= 30
                    ? "text-emerald-400"
                    : "text-foreground"
              }`}
            >
              {totals.customerPrice > 0
                ? `${totals.marginPct.toFixed(1)}%`
                : "—"}
            </span>
          </div>
        </div>

        <Separator className="my-2 opacity-30" />

        {/* Renewal value */}
        <div
          className={`flex items-center justify-between py-1.5 ${
            isHighRenewal ? "pricing-renewal-highlight rounded px-1" : ""
          }`}
        >
          <span
            className={`text-xs ${
              isHighRenewal
                ? "font-medium text-emerald-400"
                : "text-foreground/80"
            }`}
          >
            Renewal Value
            {isHighRenewal && (
              <Badge
                variant="outline"
                className="ml-1.5 border-emerald-500/30 bg-emerald-500/10 px-1 py-0 text-[9px] text-emerald-400"
              >
                High Value
              </Badge>
            )}
          </span>
          <span
            className={`text-sm font-semibold tabular-nums ${
              isHighRenewal ? "text-emerald-400" : "text-foreground"
            }`}
          >
            {totals.renewalValue > 0
              ? formatCurrency(totals.renewalValue)
              : "—"}
          </span>
        </div>

        <SummaryRow
          label={`ARR ${billingTerm === "monthly" ? "(annualised)" : ""}`}
          value={totals.arr > 0 ? formatCurrency(totals.arr) : "—"}
        />

        <Separator className="my-2 opacity-30" />

        <SummaryRow label="Tax" value="TBD at invoicing" muted />

        <div className="mt-1 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
          <span className="text-xs font-semibold text-foreground">
            Final Quote Estimate
          </span>
          <span className="text-base font-bold tabular-nums text-primary">
            {totals.finalQuoteEstimate > 0
              ? formatCurrency(totals.finalQuoteEstimate)
              : "—"}
          </span>
        </div>
      </div>

      {/* Multi-year breakdown */}
      {multiYearBreakdown && (
        <div className="mt-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            onClick={onToggleMultiYear}
            data-ocid="price-calc.multi_year_toggle"
          >
            <span>Multi-Year Breakdown</span>
            {showMultiYearBreakdown ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
          {showMultiYearBreakdown && (
            <div className="mt-2 space-y-1">
              {multiYearBreakdown.map((yr) => (
                <div
                  key={yr.year}
                  className="flex items-center justify-between rounded-md border border-border/30 bg-background/40 px-3 py-2"
                >
                  <span className="text-[11px] text-muted-foreground">
                    {yr.label}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {formatCurrency(yr.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Margin Analysis Panel (Sales Ops) ───────────────────────────────────────

function MarginAnalysisPanel({
  rows,
  billingTerm,
}: {
  rows: PriceRow[];
  billingTerm: BillingTerm;
}) {
  return (
    <div className="px-5 pb-4" data-ocid="price-calc.margin_analysis_panel">
      <div className="overflow-hidden rounded-lg border border-border/30">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/30 bg-muted/30">
              <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-muted-foreground">
                Product
              </th>
              <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider text-muted-foreground">
                Customer Price
              </th>
              <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider text-muted-foreground">
                Partner Cost
              </th>
              <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider text-muted-foreground">
                Margin £
              </th>
              <th className="px-3 py-2 text-right font-semibold uppercase tracking-wider text-muted-foreground">
                Margin %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {rows.map((row) => {
              const t = calcRowLineTotals(row, billingTerm);
              const marginGbp = t.lineTotal - t.partnerLineTotal;
              const low = t.marginPct < 15;
              return (
                <tr key={row.rowId} className={low ? "bg-amber-500/5" : ""}>
                  <td className="px-3 py-2 text-foreground">
                    {row.product.name}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-foreground">
                    {formatCurrency(t.lineTotal, row.product.currency)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                    {formatCurrency(t.partnerLineTotal, row.product.currency)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-foreground">
                    {formatCurrency(marginGbp, row.product.currency)}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-semibold tabular-nums ${
                      low ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {t.marginPct.toFixed(1)}%{low && " ⚠"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
