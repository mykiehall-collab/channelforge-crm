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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  Package,
  Plus,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import type { QuoteLineItem, QuoteRecord } from "../types/quotes";
import { formatCurrency } from "../utils/channelforge";

// ─── Mock product catalogue ───────────────────────────────────────────────────────────
const PRODUCT_CATALOGUE = [
  {
    sku: "SEC-ENT-001",
    name: "Security Suite Enterprise",
    basePrice: 2400,
    family: "Security",
  },
  {
    sku: "SEC-SMB-001",
    name: "Security Suite SMB",
    basePrice: 890,
    family: "Security",
  },
  {
    sku: "NET-SW-100",
    name: "Core Network Switch 48-port",
    basePrice: 8200,
    family: "Networking",
  },
  {
    sku: "NET-FW-200",
    name: "Next-Gen Firewall",
    basePrice: 18500,
    family: "Networking",
  },
  {
    sku: "COMP-CLD-001",
    name: "Cloud Compute Bundle",
    basePrice: 5600,
    family: "Compute",
  },
  {
    sku: "COMP-STG-001",
    name: "Object Storage 10TB",
    basePrice: 1200,
    family: "Compute",
  },
  {
    sku: "AI-OPS-001",
    name: "ForgeAI Operations Module",
    basePrice: 3800,
    family: "AI & Analytics",
  },
  {
    sku: "AI-INS-001",
    name: "AI Insights Pack",
    basePrice: 950,
    family: "AI & Analytics",
  },
  {
    sku: "SUP-PRO-001",
    name: "Premium Support",
    basePrice: 300,
    family: "Support",
  },
  {
    sku: "SUP-ENT-001",
    name: "Enterprise Support SLA",
    basePrice: 1200,
    family: "Support",
  },
  {
    sku: "LIC-USR-100",
    name: "User Licenses (100-pack)",
    basePrice: 12000,
    family: "Licensing",
  },
  {
    sku: "RNW-STD-001",
    name: "Standard Renewal Package",
    basePrice: 4800,
    family: "Renewal",
  },
];

const MOCK_ACCOUNTS = [
  "Nordic Energy Group",
  "Desperado",
  "Global Pharma Holdings",
  "Adobe Systems",
  "Ingram Micro",
  "Crayon AS",
  "TD SYNNEX",
  "BluePeak Consulting",
  "Arvo Technologies",
  "Meridian Capital Partners",
];

const MOCK_OPPORTUNITIES: Record<string, string[]> = {
  "Nordic Energy Group": [
    "Cloud Security Suite Expansion",
    "Annual Renewal 2025",
  ],
  Desperado: ["Networking Infrastructure Refresh", "Edge Security Pilot"],
  "Global Pharma Holdings": [
    "Data Sovereignty Migration",
    "Compute Upgrade Q2",
  ],
  "Adobe Systems": ["Creative Suite Renewal 2025"],
  "Ingram Micro": ["Distributor Platform Licensing"],
};

const BILLING_TERMS: QuoteLineItem["billingTerm"][] = [
  "Monthly",
  "Annual",
  "Multi-Year",
  "One-Time",
  "Renewal",
];

// ─── ForgeAI pricing insights ───────────────────────────────────────────────────────────
function getForgeAIInsights(items: QuoteLineItem[], margin: number): string[] {
  const insights: string[] = [];
  if (margin < 15)
    insights.push(
      "This quote falls below the expected margin threshold (15%). Consider adjusting discounts.",
    );
  if (items.some((i) => i.billingTerm === "Monthly"))
    insights.push(
      "Switching from monthly to annual billing increases ARR predictability and may qualify for volume pricing.",
    );
  if (items.some((i) => i.discountPct > 20))
    insights.push(
      "One or more lines exceed 20% discount. This may require Deal Desk approval.",
    );
  if (items.some((i) => i.billingTerm === "Renewal"))
    insights.push(
      "Customer may qualify for renewal incentive pricing. Check distributor promotions.",
    );
  if (items.length >= 3)
    insights.push(
      "Similar multi-product quotes converted better with 3-year terms. Consider offering a multi-year option.",
    );
  return insights;
}

// ─── Pricing engine helpers ──────────────────────────────────────────────────────────────
function calcLineTotals(items: QuoteLineItem[]) {
  const listTotal = items.reduce((s, li) => s + li.quantity * li.unitPrice, 0);
  const discountTotal = items.reduce(
    (s, li) => s + li.quantity * li.unitPrice * (li.discountPct / 100),
    0,
  );
  const subtotal = listTotal - discountTotal;
  const partnerPrice = subtotal * 0.85; // 15% partner margin
  const customerPrice = subtotal;
  const marginEst = ((subtotal - partnerPrice) / subtotal) * 100;
  const annualItems = items.filter(
    (li) => li.billingTerm === "Annual" || li.billingTerm === "Multi-Year",
  );
  const arr = annualItems.reduce(
    (s, li) => s + li.quantity * li.unitPrice * (1 - li.discountPct / 100),
    0,
  );
  const renewalValue = arr * 1.05; // 5% uplift
  return {
    listTotal,
    discountTotal,
    subtotal,
    partnerPrice,
    customerPrice,
    marginEst,
    arr,
    renewalValue,
  };
}

function genQuoteNumber(allQuotes: QuoteRecord[]): string {
  const year = new Date().getFullYear();
  const existing = allQuotes.filter((q) =>
    q.quoteNumber.startsWith(`CF-${year}-`),
  );
  const n = String(existing.length + 1).padStart(4, "0");
  return `CF-${year}-${n}`;
}

// ─── Step indicator ───────────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Account & Opportunity", icon: ClipboardList },
  { id: 2, label: "Products & Pricing", icon: Package },
  { id: 3, label: "Quote Summary", icon: FileText },
  { id: 4, label: "Review & Export", icon: Send },
];

interface StepIndicatorProps {
  currentStep: number;
}
function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 mb-0">
      {STEPS.map((s, idx) => {
        const done = s.id < currentStep;
        const active = s.id === currentStep;
        const Icon = s.icon;
        return (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                active
                  ? "bg-primary/20 text-primary"
                  : done
                    ? "text-emerald-400"
                    : "text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle size={13} /> : <Icon size={13} />}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.id}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <ChevronRight size={14} className="text-border mx-0.5" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────────────────────
interface QuoteBuilderProps {
  quote: QuoteRecord | null;
  allQuotes: QuoteRecord[];
  onSave: (q: QuoteRecord) => void;
  onClose: () => void;
  readOnly?: boolean;
}

export function QuoteBuilder({
  quote,
  allQuotes,
  onSave,
  onClose,
  readOnly,
}: QuoteBuilderProps) {
  const { userProfile } = useApp();
  const ownerName = userProfile
    ? ((userProfile as { fullName?: string }).fullName ??
      String(userProfile.email ?? "Current User"))
    : "Current User";

  // Initialise from existing quote or blank
  const [step, setStep] = useState(1);
  const [accountName, setAccountName] = useState(quote?.accountName ?? "");
  const [opportunityName, setOpportunityName] = useState(
    quote?.opportunityName ?? "",
  );
  const [dealRegNumber, setDealRegNumber] = useState(
    quote?.dealRegNumber ?? "",
  );
  const [owner, setOwner] = useState(quote?.owner ?? ownerName);
  const [expiryDate, setExpiryDate] = useState(() => {
    if (quote?.expiryDate) return quote.expiryDate;
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split("T")[0];
  });
  const [notes, setNotes] = useState(quote?.notes ?? "");
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>(
    quote?.lineItems ?? [],
  );
  const [productSearch, setProductSearch] = useState("");
  const [saveAsNewVersion, setSaveAsNewVersion] = useState(false);

  const isEditing = !!quote;
  const quoteNumber =
    isEditing && !saveAsNewVersion
      ? quote.quoteNumber
      : genQuoteNumber(allQuotes);
  const version = isEditing
    ? saveAsNewVersion
      ? quote.version + 1
      : quote.version
    : 1;

  const oppOptions = accountName ? (MOCK_OPPORTUNITIES[accountName] ?? []) : [];
  const filteredProducts = PRODUCT_CATALOGUE.filter(
    (p) =>
      productSearch.length < 2 ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.family.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const totals = useMemo(() => calcLineTotals(lineItems), [lineItems]);
  const forgeAIInsights = useMemo(
    () => getForgeAIInsights(lineItems, totals.marginEst),
    [lineItems, totals.marginEst],
  );

  function addProduct(p: (typeof PRODUCT_CATALOGUE)[number]) {
    const exists = lineItems.find((li) => li.sku === p.sku);
    if (exists) {
      setLineItems((prev) =>
        prev.map((li) =>
          li.sku === p.sku ? { ...li, quantity: li.quantity + 1 } : li,
        ),
      );
    } else {
      setLineItems((prev) => [
        ...prev,
        {
          id: `li-${Date.now()}`,
          sku: p.sku,
          productName: p.name,
          quantity: 1,
          unitPrice: p.basePrice,
          discountPct: 0,
          billingTerm: "Annual",
        },
      ]);
    }
    setProductSearch("");
  }

  function updateLineItem(id: string, updates: Partial<QuoteLineItem>) {
    setLineItems((prev) =>
      prev.map((li) => (li.id === id ? { ...li, ...updates } : li)),
    );
  }

  function removeLineItem(id: string) {
    setLineItems((prev) => prev.filter((li) => li.id !== id));
  }

  const buildRecord = useCallback(
    (status: QuoteRecord["status"]): QuoteRecord => ({
      id: isEditing && !saveAsNewVersion ? quote.id : `q-${Date.now()}`,
      quoteNumber,
      version,
      accountName,
      opportunityName: opportunityName || null,
      dealRegNumber: dealRegNumber || null,
      status,
      owner,
      createdDate: new Date().toISOString().split("T")[0],
      expiryDate,
      totalValue: Math.round(totals.subtotal),
      currency: "GBP",
      notes,
      lineItems,
    }),
    [
      isEditing,
      saveAsNewVersion,
      quote,
      quoteNumber,
      version,
      accountName,
      opportunityName,
      dealRegNumber,
      owner,
      expiryDate,
      totals.subtotal,
      notes,
      lineItems,
    ],
  );

  function handleSaveDraft() {
    if (!accountName) {
      toast.error("Account name is required");
      return;
    }
    onSave(buildRecord("Draft"));
  }

  function handleSubmitApproval() {
    if (!accountName) {
      toast.error("Account name is required");
      return;
    }
    toast.success("Quote submitted for approval");
    onSave(buildRecord("Pending Approval"));
  }

  function handleExportPDF() {
    toast.info("Generating PDF…");
    // Delegate to QuotesPage print logic by triggering save first, then auto-print
    const rec = buildRecord("Draft");
    onSave(rec);
  }

  const canAdvance = () => {
    if (step === 1) return accountName.trim().length > 0;
    if (step === 2) return lineItems.length > 0;
    return true;
  };

  return (
    // Full-height side panel overlay
    <div
      className="fixed inset-0 z-50 flex justify-end"
      data-ocid="quote_builder.dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      />

      {/* Panel */}
      <div className="quote-builder-card relative w-full max-w-3xl h-full flex flex-col shadow-2xl border-l border-border overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <FileText size={15} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm font-display text-foreground">
                  {isEditing ? `Edit Quote — ${quoteNumber}` : "New Quote"}
                </h2>
                {version > 1 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    v{version}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {readOnly
                  ? "Read-only view"
                  : isEditing
                    ? "Update or save as new version"
                    : "Create a new commercial quote"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded hover:bg-muted transition-colors"
            data-ocid="quote_builder.close_button"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-3 pb-2 bg-muted/20 border-b border-border">
          <StepIndicator currentStep={step} />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {step === 1 && (
            <Step1
              accountName={accountName}
              setAccountName={setAccountName}
              opportunityName={opportunityName}
              setOpportunityName={setOpportunityName}
              dealRegNumber={dealRegNumber}
              setDealRegNumber={setDealRegNumber}
              owner={owner}
              setOwner={setOwner}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              notes={notes}
              setNotes={setNotes}
              oppOptions={oppOptions}
              readOnly={!!readOnly}
            />
          )}
          {step === 2 && (
            <Step2
              lineItems={lineItems}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              filteredProducts={filteredProducts}
              addProduct={addProduct}
              updateLineItem={updateLineItem}
              removeLineItem={removeLineItem}
              totals={totals}
              forgeAIInsights={forgeAIInsights}
              readOnly={!!readOnly}
            />
          )}
          {step === 3 && (
            <Step3
              quoteNumber={quoteNumber}
              version={version}
              accountName={accountName}
              opportunityName={opportunityName}
              owner={owner}
              expiryDate={expiryDate}
              lineItems={lineItems}
              totals={totals}
              notes={notes}
            />
          )}
          {step === 4 && (
            <Step4
              isEditing={isEditing}
              saveAsNewVersion={saveAsNewVersion}
              setSaveAsNewVersion={setSaveAsNewVersion}
              readOnly={!!readOnly}
              forgeAIInsights={forgeAIInsights}
            />
          )}
        </div>

        {/* Footer navigation */}
        <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between gap-3">
          <div className="flex gap-2">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                data-ocid="quote_builder.prev_button"
              >
                <ChevronLeft size={13} className="mr-1" /> Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {step < 4 && (
              <Button
                type="button"
                size="sm"
                disabled={!canAdvance()}
                onClick={() => setStep((s) => s + 1)}
                data-ocid="quote_builder.next_button"
              >
                Next <ChevronRight size={13} className="ml-1" />
              </Button>
            )}
            {step === 4 && !readOnly && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  data-ocid="quote_builder.save_draft_button"
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSubmitApproval}
                  data-ocid="quote_builder.submit_button"
                >
                  <Send size={12} className="mr-1" /> Submit for Approval
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleExportPDF}
                  className="gap-1"
                  data-ocid="quote_builder.export_button"
                >
                  <Download size={12} /> Export PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────────────────────────
interface Step1Props {
  accountName: string;
  setAccountName: (v: string) => void;
  opportunityName: string;
  setOpportunityName: (v: string) => void;
  dealRegNumber: string;
  setDealRegNumber: (v: string) => void;
  owner: string;
  setOwner: (v: string) => void;
  expiryDate: string;
  setExpiryDate: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  oppOptions: string[];
  readOnly: boolean;
}
function Step1({
  accountName,
  setAccountName,
  opportunityName,
  setOpportunityName,
  dealRegNumber,
  setDealRegNumber,
  owner,
  setOwner,
  expiryDate,
  setExpiryDate,
  notes,
  setNotes,
  oppOptions,
  readOnly,
}: Step1Props) {
  return (
    <div className="space-y-5">
      <SectionHeader>Account & Opportunity</SectionHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup label="Account *" id="qb-account">
          <Select
            value={accountName}
            onValueChange={setAccountName}
            disabled={readOnly}
          >
            <SelectTrigger
              id="qb-account"
              data-ocid="quote_builder.account_select"
            >
              <SelectValue placeholder="Select account…" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_ACCOUNTS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label="Linked Opportunity" id="qb-opp">
          <Select
            value={opportunityName || "none"}
            onValueChange={(v) => setOpportunityName(v === "none" ? "" : v)}
            disabled={readOnly || oppOptions.length === 0}
          >
            <SelectTrigger
              id="qb-opp"
              data-ocid="quote_builder.opportunity_select"
            >
              <SelectValue
                placeholder={
                  oppOptions.length
                    ? "Select opportunity…"
                    : "Select account first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {oppOptions.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label="Deal Registration #" id="qb-dr">
          <Input
            id="qb-dr"
            value={dealRegNumber}
            onChange={(e) => setDealRegNumber(e.target.value)}
            placeholder="DR-2025-XXXX"
            disabled={readOnly}
            data-ocid="quote_builder.deal_reg_input"
          />
        </FieldGroup>
        <FieldGroup label="Quote Owner" id="qb-owner">
          <Input
            id="qb-owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            disabled={readOnly}
            data-ocid="quote_builder.owner_input"
          />
        </FieldGroup>
        <FieldGroup label="Expiry Date" id="qb-expiry">
          <Input
            id="qb-expiry"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            disabled={readOnly}
            data-ocid="quote_builder.expiry_input"
          />
        </FieldGroup>
      </div>
      <FieldGroup label="Internal Notes" id="qb-notes">
        <Textarea
          id="qb-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes visible to your team…"
          disabled={readOnly}
          data-ocid="quote_builder.notes_textarea"
        />
      </FieldGroup>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────────────────────────
interface Step2Props {
  lineItems: QuoteLineItem[];
  productSearch: string;
  setProductSearch: (v: string) => void;
  filteredProducts: typeof PRODUCT_CATALOGUE;
  addProduct: (p: (typeof PRODUCT_CATALOGUE)[number]) => void;
  updateLineItem: (id: string, updates: Partial<QuoteLineItem>) => void;
  removeLineItem: (id: string) => void;
  totals: ReturnType<typeof calcLineTotals>;
  forgeAIInsights: string[];
  readOnly: boolean;
}
function Step2({
  lineItems,
  productSearch,
  setProductSearch,
  filteredProducts,
  addProduct,
  updateLineItem,
  removeLineItem,
  totals,
  forgeAIInsights,
  readOnly,
}: Step2Props) {
  const showProductSearch = productSearch.length >= 1;
  return (
    <div className="space-y-5">
      <SectionHeader>Products & Pricing</SectionHeader>

      {/* ForgeAI insights */}
      {forgeAIInsights.length > 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <Brain size={13} />
            ForgeAI Pricing Insights
          </div>
          {forgeAIInsights.map((insight, i) => (
            <div
              key={`insight-${i}-${insight.slice(0, 20).replace(/\s/g, "")}`}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <AlertTriangle
                size={11}
                className="text-amber-400 mt-0.5 flex-shrink-0"
              />
              {insight}
            </div>
          ))}
        </div>
      )}

      {/* Product search */}
      {!readOnly && (
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name, SKU or category…"
                className="pl-9 h-9 text-sm"
                data-ocid="quote_builder.product_search"
              />
            </div>
          </div>
          {showProductSearch && (
            <div className="absolute top-10 left-0 right-0 z-10 rounded-lg border border-border bg-popover shadow-lg max-h-56 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  No products found
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <button
                    key={p.sku}
                    type="button"
                    onClick={() => addProduct(p)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors text-sm"
                  >
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {p.sku} &middot; {p.family}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-primary">
                      {formatCurrency(p.basePrice, "GBP")}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Line items table */}
      {lineItems.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 gap-2 rounded-lg border border-dashed border-border"
          data-ocid="quote_builder.products_empty_state"
        >
          <Package size={28} className="text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground">
            Search above to add products
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {lineItems.map((li, i) => (
            <div
              key={li.id}
              className="rounded-lg border border-border bg-card p-3 space-y-2 hover:border-primary/30 transition-colors"
              data-ocid={`quote_builder.line_item.${i + 1}`}
              style={{
                background: "oklch(var(--editable-product-row-bg))",
                borderColor: "oklch(var(--editable-product-row-border))",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {li.productName}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {li.sku}
                  </div>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeLineItem(li.id)}
                    className="p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                    data-ocid={`quote_builder.remove_item.${i + 1}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <FieldGroup label="Qty" id={`qty-${li.id}`}>
                  <Input
                    id={`qty-${li.id}`}
                    type="number"
                    min={1}
                    value={li.quantity}
                    onChange={(e) =>
                      updateLineItem(li.id, {
                        quantity: Math.max(1, Number(e.target.value)),
                      })
                    }
                    disabled={readOnly}
                    className="h-8 text-sm"
                  />
                </FieldGroup>
                <FieldGroup label="Unit Price" id={`up-${li.id}`}>
                  <Input
                    id={`up-${li.id}`}
                    type="number"
                    min={0}
                    value={li.unitPrice}
                    onChange={(e) =>
                      updateLineItem(li.id, {
                        unitPrice: Math.max(0, Number(e.target.value)),
                      })
                    }
                    disabled={readOnly}
                    className="h-8 text-sm"
                  />
                </FieldGroup>
                <FieldGroup label="Discount %" id={`disc-${li.id}`}>
                  <Input
                    id={`disc-${li.id}`}
                    type="number"
                    min={0}
                    max={100}
                    value={li.discountPct}
                    onChange={(e) =>
                      updateLineItem(li.id, {
                        discountPct: Math.min(
                          100,
                          Math.max(0, Number(e.target.value)),
                        ),
                      })
                    }
                    disabled={readOnly}
                    className="h-8 text-sm"
                  />
                </FieldGroup>
                <FieldGroup label="Billing Term" id={`term-${li.id}`}>
                  <Select
                    value={li.billingTerm}
                    onValueChange={(v) =>
                      updateLineItem(li.id, {
                        billingTerm: v as QuoteLineItem["billingTerm"],
                      })
                    }
                    disabled={readOnly}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BILLING_TERMS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  Line total:{" "}
                </span>
                <span className="text-xs font-semibold text-primary ml-1">
                  {formatCurrency(
                    li.quantity * li.unitPrice * (1 - li.discountPct / 100),
                    "GBP",
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Totals panel */}
      {lineItems.length > 0 && <TotalsPanel totals={totals} />}
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────────────────────────
interface Step3Props {
  quoteNumber: string;
  version: number;
  accountName: string;
  opportunityName: string;
  owner: string;
  expiryDate: string;
  lineItems: QuoteLineItem[];
  totals: ReturnType<typeof calcLineTotals>;
  notes: string;
}
function Step3({
  quoteNumber,
  version,
  accountName,
  opportunityName,
  owner,
  expiryDate,
  lineItems,
  totals,
  notes,
}: Step3Props) {
  return (
    <div className="space-y-5">
      <SectionHeader>Quote Summary</SectionHeader>

      {/* Quote meta */}
      <div className="rounded-lg border border-border bg-muted/20 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetaField label="Quote #">{quoteNumber}</MetaField>
        <MetaField label="Version">v{version}</MetaField>
        <MetaField label="Account">{accountName}</MetaField>
        {opportunityName && (
          <MetaField label="Opportunity">{opportunityName}</MetaField>
        )}
        <MetaField label="Owner">{owner}</MetaField>
        <MetaField label="Expires">{expiryDate}</MetaField>
      </div>

      {/* Line items */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                Product
              </th>
              <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                Qty
              </th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                Unit Price
              </th>
              <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                Disc
              </th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">
                Line Total
              </th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">
                Term
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No products added
                </td>
              </tr>
            ) : (
              lineItems.map((li) => {
                const lineTotal =
                  li.quantity * li.unitPrice * (1 - li.discountPct / 100);
                return (
                  <tr key={li.id} className="border-b border-border/50">
                    <td className="px-3 py-2">
                      <div className="font-medium text-foreground">
                        {li.productName}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {li.sku}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center tabular-nums">
                      {li.quantity}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatCurrency(li.unitPrice, "GBP")}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {li.discountPct > 0 ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                          {li.discountPct}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-semibold text-foreground">
                      {formatCurrency(lineTotal, "GBP")}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {li.billingTerm}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <TotalsPanel totals={totals} />

      {/* Notes & T&C */}
      {notes && (
        <div className="rounded-lg border border-border bg-muted/20 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Notes
          </div>
          <p className="text-xs text-foreground">{notes}</p>
        </div>
      )}
      <div className="rounded-lg border border-border bg-muted/10 p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
          Terms & Conditions
        </div>
        <p className="text-xs text-muted-foreground">
          This quote is valid until {expiryDate}. All prices are exclusive of
          applicable taxes. Payment terms: 30 days net. Prices subject to change
          after expiry date. CHANNELFORGE CRM is proprietary software. All
          rights reserved.
        </p>
      </div>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────────────────────────
interface Step4Props {
  isEditing: boolean;
  saveAsNewVersion: boolean;
  setSaveAsNewVersion: (v: boolean) => void;
  readOnly: boolean;
  forgeAIInsights: string[];
}
function Step4({
  isEditing,
  saveAsNewVersion,
  setSaveAsNewVersion,
  readOnly,
  forgeAIInsights,
}: Step4Props) {
  return (
    <div className="space-y-5">
      <SectionHeader>Review & Export</SectionHeader>

      {readOnly ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          You have read-only access to this quote. Contact Sales Ops or the
          quote owner to make changes.
        </div>
      ) : (
        <>
          {isEditing && (
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveAsNewVersion}
                  onChange={(e) => setSaveAsNewVersion(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                  data-ocid="quote_builder.new_version_checkbox"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Save as new version
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Creates a new version while preserving the current quote
                    history
                  </div>
                </div>
              </label>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Export Options
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ActionCard
                icon={FileText}
                title="Save as Draft"
                description="Store progress without submitting"
              />
              <ActionCard
                icon={Send}
                title="Submit for Approval"
                description="Send to deal desk for review"
              />
              <ActionCard
                icon={Download}
                title="Export PDF"
                description="Generate branded PDF quote"
              />
            </div>
          </div>

          {forgeAIInsights.length > 0 && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Brain size={13} />
                ForgeAI Recommendations
              </div>
              {forgeAIInsights.map((insight, i) => (
                <div
                  key={`insight-${i}-${insight.slice(0, 20).replace(/\s/g, "")}`}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <AlertTriangle
                    size={11}
                    className="text-amber-400 mt-0.5 flex-shrink-0"
                  />
                  {insight}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Shared sub-components ───────────────────────────────────────────────────────────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-sm font-bold font-display text-foreground">
        {children}
      </h3>
      <Separator className="flex-1" />
    </div>
  );
}

function FieldGroup({
  label,
  id,
  children,
}: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function MetaField({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
        {label}
      </div>
      <div className="text-sm font-medium text-foreground truncate">
        {children}
      </div>
    </div>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-primary" />
        <span className="text-xs font-semibold text-foreground">{title}</span>
      </div>
      <span className="text-[11px] text-muted-foreground">{description}</span>
    </div>
  );
}

function TotalsPanel({
  totals,
}: { totals: ReturnType<typeof calcLineTotals> }) {
  const rows = [
    { label: "List Price", value: totals.listTotal, highlight: false },
    {
      label: "Discount",
      value: -totals.discountTotal,
      highlight: false,
      color: "text-emerald-400",
    },
    { label: "Partner Price", value: totals.partnerPrice, highlight: false },
    { label: "Customer Price", value: totals.customerPrice, highlight: false },
    {
      label: "Margin Estimate",
      value: null,
      formatted: `${totals.marginEst.toFixed(1)}%`,
      highlight: false,
      color: totals.marginEst < 15 ? "text-red-400" : "text-emerald-400",
    },
    {
      label: "ARR",
      value: totals.arr,
      highlight: false,
      color: "text-primary",
    },
    {
      label: "Renewal Value (+5%)",
      value: totals.renewalValue,
      highlight: false,
      color: "text-primary",
    },
    { label: "Final Quote Estimate", value: totals.subtotal, highlight: true },
  ];
  return (
    <div
      className="rounded-lg border border-border overflow-hidden"
      style={{
        background: "oklch(var(--pricing-panel-bg))",
        borderColor: "oklch(var(--pricing-panel-border))",
      }}
    >
      <div className="px-4 py-2.5 border-b border-border/50 bg-muted/20">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Pricing Breakdown
        </span>
      </div>
      <div className="divide-y divide-border/40">
        {rows.map((r) => (
          <div
            key={r.label}
            className={`flex items-center justify-between px-4 py-2 text-xs ${r.highlight ? "bg-primary/5" : ""}`}
          >
            <span
              className={
                r.highlight
                  ? "font-bold text-foreground"
                  : "text-muted-foreground"
              }
            >
              {r.label}
            </span>
            <span
              className={`tabular-nums font-${r.highlight ? "bold" : "medium"} ${r.color ?? (r.highlight ? "text-primary" : "text-foreground")}`}
            >
              {r.formatted ??
                (r.value !== null ? formatCurrency(r.value, "GBP") : "—")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
