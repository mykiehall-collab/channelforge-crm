import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  GripVertical,
  Lock,
  Plus,
  Save,
  Share2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DataSource =
  | "customer_accounts"
  | "deal_registrations"
  | "opportunities"
  | "renewals"
  | "business_plans"
  | "mdf_requests"
  | "promotions"
  | "marketing_activities";

export type FilterType =
  | "date_range"
  | "entity"
  | "product"
  | "renewal_status"
  | "opportunity_status"
  | "deal_reg_status"
  | "risk_level";

export type ShareLevel = "private" | "internal" | "shared";

export interface FilterChip {
  id: string;
  type: FilterType;
  label: string;
  value: string[];
  expanded: boolean;
}

export interface SavedReport {
  id: string;
  name: string;
  description: string;
  dataSource: DataSource;
  columns: string[];
  filters: FilterChip[];
  shareLevel: ShareLevel;
  sharedDepts: string[];
  createdAt: string;
  owner: string;
  lastRun?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DATA_SOURCES: {
  id: DataSource;
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: "customer_accounts",
    label: "Customer Accounts",
    desc: "Account records, customer details, renewal dates and ownership.",
    icon: "🏢",
  },
  {
    id: "deal_registrations",
    label: "Deal Registrations",
    desc: "Partner deal registrations, approval status, estimated value.",
    icon: "📋",
  },
  {
    id: "opportunities",
    label: "Opportunities",
    desc: "Pipeline opportunities, stages, close dates and forecasts.",
    icon: "🎯",
  },
  {
    id: "renewals",
    label: "Renewals",
    desc: "Renewal tracking, risk scoring, expiry timelines.",
    icon: "🔄",
  },
  {
    id: "business_plans",
    label: "Business Plans",
    desc: "Partner business plans, milestones, activity status.",
    icon: "📊",
  },
  {
    id: "mdf_requests",
    label: "MDF Requests",
    desc: "Market development fund requests, spend, ROI tracking.",
    icon: "💰",
  },
  {
    id: "promotions",
    label: "Promotions",
    desc: "Active promotions, eligibility, redemption rates.",
    icon: "🏷️",
  },
  {
    id: "marketing_activities",
    label: "Marketing Activities",
    desc: "Campaigns, engagement metrics, asset performance.",
    icon: "📣",
  },
];

const SOURCE_COLUMNS: Record<DataSource, string[]> = {
  customer_accounts: [
    "Account Name",
    "Customer ID",
    "Domain",
    "Reseller",
    "Distributor",
    "Vendor",
    "Renewal Date",
    "Contract Value",
    "Status",
    "Region",
    "Risk Level",
    "Last Activity",
    "Contacts",
    "Products",
  ],
  deal_registrations: [
    "Opportunity Name",
    "Account",
    "Reseller",
    "Vendor Owner",
    "Submitted Date",
    "Close Date",
    "Estimated Value",
    "Deal Stage",
    "Status",
    "Region",
    "Product",
    "Approver",
  ],
  opportunities: [
    "Opportunity Name",
    "Account",
    "Stage",
    "Close Date",
    "Amount",
    "Owner",
    "Probability",
    "Reseller",
    "Product",
    "Region",
    "Created Date",
    "Last Modified",
  ],
  renewals: [
    "Account Name",
    "Customer ID",
    "Renewal Date",
    "Days Until Renewal",
    "Estimated Value",
    "Risk Score",
    "Status",
    "Reseller",
    "Distributor",
    "Products",
    "Last Engagement",
  ],
  business_plans: [
    "Plan Name",
    "Partner",
    "Period",
    "Revenue Target",
    "Status",
    "Milestones",
    "Last Updated",
    "Owner",
  ],
  mdf_requests: [
    "Request ID",
    "Partner",
    "Campaign",
    "Requested Amount",
    "Approved Amount",
    "Spend",
    "Status",
    "Period",
    "ROI",
  ],
  promotions: [
    "Promotion Name",
    "Type",
    "Start Date",
    "End Date",
    "Eligibility",
    "Redemptions",
    "Revenue Impact",
    "Status",
  ],
  marketing_activities: [
    "Activity Name",
    "Type",
    "Campaign",
    "Date",
    "Engagement Rate",
    "Leads Generated",
    "Asset Downloads",
    "Region",
  ],
};

const FILTER_DEFS: {
  type: FilterType;
  label: string;
  color: string;
  options?: string[];
}[] = [
  { type: "date_range", label: "Date Range", color: "border-accent/60" },
  {
    type: "entity",
    label: "Entity",
    color: "border-primary/60",
    options: ["Vendor", "Distributor", "Reseller"],
  },
  { type: "product", label: "Product / SKU", color: "border-chart-2/60" },
  {
    type: "renewal_status",
    label: "Renewal Status",
    color: "border-chart-3/60",
    options: ["Active", "Expiring Soon", "Expired", "At Risk"],
  },
  {
    type: "opportunity_status",
    label: "Opportunity Status",
    color: "border-chart-4/60",
    options: ["Open", "Won", "Lost", "Stalled"],
  },
  {
    type: "deal_reg_status",
    label: "Deal Reg Status",
    color: "border-accent/40",
    options: ["Pending", "Approved", "Rejected"],
  },
  {
    type: "risk_level",
    label: "Risk Level",
    color: "border-destructive/50",
    options: ["Low", "Medium", "High", "Critical"],
  },
];

const DATE_PRESETS = [
  "Today",
  "Last 7 Days",
  "This Month",
  "Last Quarter",
  "This Year",
  "Custom",
];

const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "IT",
  "BDR",
  "Sales Management",
  "Sales Operations",
  "Deal Desk",
  "Order Management",
  "Leadership",
  "Finance",
  "Admin",
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step, total }: { step: number; total: number }) {
  const labels = ["Setup", "Columns", "Filters", "Preview", "Save"];
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
      {labels.slice(0, total).map((label, i) => {
        const num = i + 1;
        const isActive = num === step;
        const isDone = num < step;
        return (
          <div key={label} className="flex items-center shrink-0">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? "bg-accent text-accent-foreground"
                    : isActive
                      ? "bg-accent text-accent-foreground ring-2 ring-accent/40 ring-offset-1 ring-offset-card"
                      : "bg-secondary/60 text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : num}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < total - 1 && (
              <div
                className={`w-8 h-px mx-2 shrink-0 ${
                  isDone ? "bg-accent/60" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Data Source ──────────────────────────────────────────────────────

function Step1Source({
  selected,
  reportName,
  description,
  onSelect,
  onNameChange,
  onDescChange,
}: {
  selected: DataSource | null;
  reportName: string;
  description: string;
  onSelect: (s: DataSource) => void;
  onNameChange: (v: string) => void;
  onDescChange: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        Report Setup
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Name your report and choose a data source.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label
            className="text-xs font-medium text-muted-foreground block mb-1"
            htmlFor="rb-name-step1"
          >
            Report Name <span className="text-destructive-foreground">*</span>
          </label>
          <input
            id="rb-name-step1"
            type="text"
            className="crm-input h-10 px-3 text-sm w-full max-w-lg"
            placeholder="e.g. Q3 Renewal Risk Summary"
            value={reportName}
            onChange={(e) => onNameChange(e.target.value)}
            data-ocid="report_builder.name_input"
          />
        </div>
        <div>
          <label
            className="text-xs font-medium text-muted-foreground block mb-1"
            htmlFor="rb-desc-step1"
          >
            Description{" "}
            <span className="text-muted-foreground/60 text-[10px]">
              (optional)
            </span>
          </label>
          <textarea
            id="rb-desc-step1"
            className="crm-input px-3 py-2 text-sm w-full max-w-lg resize-none"
            rows={2}
            placeholder="Brief description of what this report shows..."
            value={description}
            onChange={(e) => onDescChange(e.target.value)}
            data-ocid="report_builder.description_input"
          />
        </div>
      </div>

      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Data Source
      </div>
      <div className="grid grid-cols-2 gap-3">
        {DATA_SOURCES.map((src) => (
          <button
            key={src.id}
            type="button"
            data-ocid={`report_builder.source.${src.id}`}
            onClick={() => onSelect(src.id)}
            className={`text-left p-4 rounded-lg border transition-all ${
              selected === src.id
                ? "border-accent bg-accent/10 ring-1 ring-accent/40"
                : "border-border bg-secondary/20 hover:border-accent/40 hover:bg-secondary/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">{src.icon}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm text-foreground">
                  {src.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {src.desc}
                </div>
              </div>
              {selected === src.id && (
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Column Picker ────────────────────────────────────────────────────

function Step2Columns({
  dataSource,
  selected,
  onChange,
}: {
  dataSource: DataSource;
  selected: string[];
  onChange: (cols: string[]) => void;
}) {
  const allCols = SOURCE_COLUMNS[dataSource] ?? [];
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  function toggle(col: string) {
    onChange(
      selected.includes(col)
        ? selected.filter((c) => c !== col)
        : [...selected, col],
    );
  }

  function handleDragStart(i: number) {
    dragIdx.current = i;
  }

  function handleDragEnter(i: number) {
    dragOverIdx.current = i;
  }

  function handleDragEnd() {
    if (dragIdx.current === null || dragOverIdx.current === null) return;
    const reordered = [...selected];
    const [moved] = reordered.splice(dragIdx.current, 1);
    reordered.splice(dragOverIdx.current, 0, moved);
    onChange(reordered);
    dragIdx.current = null;
    dragOverIdx.current = null;
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        Select Columns
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Choose which fields appear in your report. Drag to reorder.
      </p>
      <div className="grid grid-cols-2 gap-5">
        {/* Available */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Available Columns
          </div>
          <div className="border border-border rounded-lg overflow-y-auto max-h-72 scrollbar-thin">
            {allCols.map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => toggle(col)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm border-b border-border/40 last:border-b-0 transition-colors ${
                  selected.includes(col)
                    ? "bg-accent/10 text-accent"
                    : "text-foreground hover:bg-secondary/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selected.includes(col)
                      ? "border-accent bg-accent"
                      : "border-border"
                  }`}
                >
                  {selected.includes(col) && (
                    <Check className="w-2.5 h-2.5 text-accent-foreground" />
                  )}
                </div>
                {col}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {selected.length} of {allCols.length} selected
          </p>
        </div>

        {/* Selected (draggable) */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Column Order
          </div>
          <div className="border border-border rounded-lg overflow-y-auto max-h-72 scrollbar-thin">
            {selected.length === 0 ? (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                Select columns from the left to add them here.
              </div>
            ) : (
              selected.map((col, i) => (
                <div
                  key={col}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40 last:border-b-0 bg-secondary/10 cursor-grab active:cursor-grabbing hover:bg-secondary/30 transition-colors"
                >
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground flex-1">{col}</span>
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => toggle(col)}
                    className="text-muted-foreground hover:text-destructive-foreground transition-colors"
                    aria-label={`Remove ${col}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
          {selected.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Drag rows to reorder columns.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Filters ──────────────────────────────────────────────────────────

function FilterChipEditor({
  chip,
  onUpdate,
  onRemove,
}: {
  chip: FilterChip;
  onUpdate: (chip: FilterChip) => void;
  onRemove: () => void;
}) {
  const def = FILTER_DEFS.find((f) => f.type === chip.type)!;

  return (
    <div
      className={`rounded-lg border ${def.color} bg-secondary/20 mb-2 overflow-hidden transition-all`}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-xs font-semibold text-foreground">
          {def.label}
        </span>
        <button
          type="button"
          onClick={() => onUpdate({ ...chip, expanded: !chip.expanded })}
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle filter"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              chip.expanded ? "rotate-180" : ""
            }`}
          />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive-foreground transition-colors"
          aria-label="Remove filter"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {chip.expanded && (
        <div className="px-3 pb-3 border-t border-border/40">
          {chip.type === "date_range" && (
            <div className="pt-2">
              <div className="flex flex-wrap gap-1 mb-2">
                {DATE_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...chip,
                        value: p === chip.value[0] ? [] : [p],
                      })
                    }
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      chip.value[0] === p
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {chip.value[0] === "Custom" && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="date"
                    className="crm-input px-2 py-1 text-xs flex-1"
                  />
                  <span className="text-muted-foreground text-xs self-center">
                    to
                  </span>
                  <input
                    type="date"
                    className="crm-input px-2 py-1 text-xs flex-1"
                  />
                </div>
              )}
            </div>
          )}
          {chip.type === "product" && (
            <div className="pt-2">
              <input
                type="text"
                placeholder="Search products or SKUs..."
                className="crm-input px-2 py-1.5 text-xs w-full"
              />
            </div>
          )}
          {def.options && (
            <div className="pt-2 flex flex-wrap gap-1">
              {def.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const val = chip.value.includes(opt)
                      ? chip.value.filter((v) => v !== opt)
                      : [...chip.value, opt];
                    onUpdate({ ...chip, value: val });
                  }}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    chip.value.includes(opt)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Step3Filters({
  filters,
  onChange,
}: {
  filters: FilterChip[];
  onChange: (filters: FilterChip[]) => void;
}) {
  function addFilter(type: FilterType) {
    const def = FILTER_DEFS.find((f) => f.type === type)!;
    const newChip: FilterChip = {
      id: uid(),
      type,
      label: def.label,
      value: [],
      expanded: true,
    };
    onChange([...filters, newChip]);
  }

  function updateChip(id: string, updated: FilterChip) {
    onChange(filters.map((c) => (c.id === id ? updated : c)));
  }

  function removeChip(id: string) {
    onChange(filters.filter((c) => c.id !== id));
  }

  const activeTypes = new Set(filters.map((f) => f.type));

  return (
    <div className="grid grid-cols-5 gap-5">
      {/* Filter palette */}
      <div className="col-span-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Add Filters
        </div>
        <div className="flex flex-col gap-1.5">
          {FILTER_DEFS.map((def) => (
            <button
              key={def.type}
              type="button"
              data-ocid={`report_builder.filter.add_${def.type}`}
              onClick={() => addFilter(def.type)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${
                activeTypes.has(def.type)
                  ? `${def.color} bg-secondary/30 text-foreground`
                  : "border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
              }`}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              {def.label}
              {activeTypes.has(def.type) && (
                <span className="ml-auto text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">
                  {filters.filter((f) => f.type === def.type).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters canvas */}
      <div className="col-span-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Active Filters
        </div>
        {filters.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg py-10 text-center">
            <p className="text-muted-foreground text-xs">
              No filters added yet.
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Add filters from the left panel.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-72 scrollbar-thin pr-1">
            {filters.map((chip) => (
              <FilterChipEditor
                key={chip.id}
                chip={chip}
                onUpdate={(updated) => updateChip(chip.id, updated)}
                onRemove={() => removeChip(chip.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Name & Save ──────────────────────────────────────────────────────

function Step4Save({
  name,
  description,
  shareLevel,
  sharedDepts,
  onNameChange,
  onDescChange,
  onShareChange,
  onDeptsChange,
}: {
  name: string;
  description: string;
  shareLevel: ShareLevel;
  sharedDepts: string[];
  onNameChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onShareChange: (v: ShareLevel) => void;
  onDeptsChange: (v: string[]) => void;
}) {
  function toggleDept(d: string) {
    onDeptsChange(
      sharedDepts.includes(d)
        ? sharedDepts.filter((x) => x !== d)
        : [...sharedDepts, d],
    );
  }

  return (
    <div className="max-w-lg">
      <h3 className="text-base font-semibold text-foreground mb-1">
        Name & Save
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        Give your report a name and configure sharing settings.
      </p>

      <div className="space-y-4">
        <div>
          <label
            className="text-xs font-medium text-muted-foreground block mb-1"
            htmlFor="rb-name"
          >
            Report Name <span className="text-destructive-foreground">*</span>
          </label>
          <input
            id="rb-name"
            type="text"
            className="crm-input h-10 px-3 text-sm w-full"
            placeholder="e.g. Q3 Renewal Risk Summary"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            data-ocid="report_builder.name_input"
          />
        </div>

        <div>
          <label
            className="text-xs font-medium text-muted-foreground block mb-1"
            htmlFor="rb-desc"
          >
            Description{" "}
            <span className="text-muted-foreground/60 text-[10px]">
              (optional)
            </span>
          </label>
          <textarea
            id="rb-desc"
            className="crm-input px-3 py-2 text-sm w-full resize-none"
            rows={3}
            placeholder="Brief description of what this report shows..."
            value={description}
            onChange={(e) => onDescChange(e.target.value)}
            data-ocid="report_builder.description_input"
          />
        </div>

        <div>
          <span className="text-xs font-medium text-muted-foreground block mb-2">
            Sharing
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(["private", "internal", "shared"] as ShareLevel[]).map(
              (level) => (
                <button
                  key={level}
                  type="button"
                  data-ocid={`report_builder.share_${level}`}
                  onClick={() => onShareChange(level)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    shareLevel === level
                      ? "border-accent bg-accent/10 ring-1 ring-accent/40"
                      : "border-border bg-secondary/20 hover:border-accent/40"
                  }`}
                >
                  <div className="text-xs font-semibold text-foreground capitalize mb-0.5">
                    {level === "private"
                      ? "🔒 Private"
                      : level === "internal"
                        ? "🏢 Internal"
                        : "🔗 Shared"}
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed">
                    {level === "private" && "Only visible to you"}
                    {level === "internal" && "Visible to your organization"}
                    {level === "shared" && "Share with specific depts or users"}
                  </div>
                </button>
              ),
            )}
          </div>
        </div>

        {shareLevel === "shared" && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Share with Departments
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDept(d)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    sharedDepts.includes(d)
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Preview ─────────────────────────────────────────────────────────

const MOCK_ROW_DATA: Record<DataSource, string[][]> = {
  customer_accounts: [
    [
      "Meridian Technologies",
      "CUST-0042",
      "Active",
      "Apex Resellers",
      "EMEA",
      "87",
      "2026-09-15",
    ],
    [
      "Vertex Solutions",
      "CUST-0107",
      "At Risk",
      "Blue Star Dist.",
      "NOAM",
      "41",
      "2026-07-30",
    ],
    [
      "Quantum Dynamics",
      "CUST-0201",
      "Active",
      "Apex Resellers",
      "APAC",
      "92",
      "2026-11-01",
    ],
    [
      "Northgate Systems",
      "CUST-0088",
      "Expiring",
      "SkyBridge Ltd.",
      "EMEA",
      "63",
      "2026-06-20",
    ],
    [
      "Ironclad Corp",
      "CUST-0155",
      "Active",
      "Blue Star Dist.",
      "NOAM",
      "78",
      "2027-01-10",
    ],
  ],
  renewals: [
    [
      "Meridian Technologies",
      "CUST-0042",
      "2026-09-15",
      "47d",
      "£28,400",
      "Low",
      "Active",
    ],
    [
      "Vertex Solutions",
      "CUST-0107",
      "2026-07-30",
      "12d",
      "£14,200",
      "High",
      "At Risk",
    ],
    [
      "Quantum Dynamics",
      "CUST-0201",
      "2026-11-01",
      "105d",
      "£52,800",
      "Low",
      "Active",
    ],
    [
      "Northgate Systems",
      "CUST-0088",
      "2026-06-20",
      "2d",
      "£9,600",
      "Critical",
      "Expiring",
    ],
    [
      "Ironclad Corp",
      "CUST-0155",
      "2027-01-10",
      "180d",
      "£37,900",
      "Low",
      "Active",
    ],
  ],
  opportunities: [
    [
      "EMEA Expansion Deal",
      "Meridian Technologies",
      "Proposal",
      "2026-08-31",
      "£84,000",
      "Sarah Chen",
      "65%",
    ],
    [
      "Security Suite Renewal",
      "Vertex Solutions",
      "Negotiation",
      "2026-06-30",
      "£28,500",
      "Tom Harris",
      "85%",
    ],
    [
      "Cloud Migration Project",
      "Quantum Dynamics",
      "Qualification",
      "2026-10-15",
      "£120,000",
      "Lisa Park",
      "30%",
    ],
    [
      "Platform Upgrade",
      "Northgate Systems",
      "Proposal",
      "2026-07-20",
      "£45,000",
      "Mark Webb",
      "70%",
    ],
    [
      "Analytics Bundle",
      "Ironclad Corp",
      "Closed Won",
      "2026-05-01",
      "£22,000",
      "Sarah Chen",
      "100%",
    ],
  ],
  deal_registrations: [
    [
      "EMEA Expansion",
      "Meridian Tech",
      "Apex Resellers",
      "2026-05-01",
      "Pending",
      "£84,000",
    ],
    [
      "Security Renewal",
      "Vertex Solutions",
      "Blue Star Dist.",
      "2026-04-22",
      "Approved",
      "£28,500",
    ],
    [
      "Cloud Migration",
      "Quantum Dynamics",
      "SkyBridge Ltd.",
      "2026-05-10",
      "Pending",
      "£120,000",
    ],
  ],
  mdf_requests: [
    [
      "MDF-001",
      "Apex Resellers",
      "EMEA Roadshow Q2",
      "£12,000",
      "£10,000",
      "Pending",
      "Q2 2026",
      "—",
    ],
    [
      "MDF-002",
      "Blue Star Dist.",
      "Partner Summit",
      "£8,500",
      "£8,500",
      "Approved",
      "Q1 2026",
      "2.4x",
    ],
    [
      "MDF-003",
      "SkyBridge Ltd.",
      "Digital Campaign",
      "£5,000",
      "£0",
      "Rejected",
      "Q2 2026",
      "—",
    ],
  ],
  business_plans: [
    [
      "Apex Q2 Growth Plan",
      "Apex Resellers",
      "Q2 2026",
      "£240,000",
      "On Track",
      "3 / 5",
      "2026-05-15",
    ],
    [
      "Blue Star Annual",
      "Blue Star Dist.",
      "FY 2026",
      "£800,000",
      "Behind",
      "1 / 6",
      "2026-04-30",
    ],
  ],
  promotions: [
    [
      "Summer Surge",
      "Discount",
      "2026-06-01",
      "2026-08-31",
      "Silver+",
      "142",
      "£38,400",
      "Active",
    ],
    [
      "Q3 Accelerator",
      "Rebate",
      "2026-07-01",
      "2026-09-30",
      "Gold+",
      "0",
      "—",
      "Scheduled",
    ],
  ],
  marketing_activities: [
    [
      "EMEA Channel Summit",
      "Event",
      "Spring Enablement",
      "2026-05-14",
      "68%",
      "124",
      "340",
      "EMEA",
    ],
    [
      "Partner Enablement Webinar",
      "Webinar",
      "Q2 Enablement",
      "2026-04-28",
      "54%",
      "87",
      "210",
      "Global",
    ],
    [
      "Digital Prospecting Kit",
      "Content",
      "Pipeline Drive",
      "2026-05-02",
      "—",
      "—",
      "892",
      "NOAM",
    ],
  ],
};

function Step4Preview({
  dataSource,
  columns,
  reportName,
}: {
  dataSource: DataSource | null;
  columns: string[];
  reportName: string;
}) {
  if (!dataSource) return null;
  const allRows = MOCK_ROW_DATA[dataSource] ?? [];
  const allCols = SOURCE_COLUMNS[dataSource] ?? [];

  // Get column indices for selected columns
  const colIndices = columns.map((c) => allCols.indexOf(c));

  return (
    <div>
      <h3 className="text-base font-semibold text-foreground mb-1">Preview</h3>
      <p className="text-sm text-muted-foreground mb-5">
        Preview of{" "}
        <span className="text-accent font-medium">
          {reportName || "your report"}
        </span>{" "}
        — showing sample data matching your selected columns.
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.slice(0, 5).map((row, i) => (
              <tr
                key={`preview-row-${row.join("|")}`.slice(0, 60)}
                className={`border-b border-border/50 transition-colors hover:bg-secondary/20 ${i % 2 === 1 ? "bg-secondary/10" : ""}`}
              >
                {colIndices.map((colIdx) => (
                  <td
                    key={`preview-col-${colIdx}`}
                    className="px-4 py-2.5 text-foreground text-xs whitespace-nowrap"
                  >
                    {colIdx >= 0 ? (row[colIdx] ?? "—") : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {allRows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-xs">
            Sample data not available for this source.
          </div>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground mt-3">
        Showing up to 5 sample rows. Actual results will vary based on your
        filters and live data.
      </p>
    </div>
  );
}

// ─── Report Builder Modal ─────────────────────────────────────────────────────

export interface ReportBuilderProps {
  onSave: (report: SavedReport) => void;
  onClose: () => void;
  initial?: SavedReport;
}

export function ReportBuilder({
  onSave,
  onClose,
  initial,
}: ReportBuilderProps) {
  const TOTAL_STEPS = 5;
  const [step, setStep] = useState(initial ? 5 : 1);
  const [dataSource, setDataSource] = useState<DataSource | null>(
    initial?.dataSource ?? null,
  );
  const [columns, setColumns] = useState<string[]>(initial?.columns ?? []);
  const [filters, setFilters] = useState<FilterChip[]>(initial?.filters ?? []);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [shareLevel, setShareLevel] = useState<ShareLevel>(
    initial?.shareLevel ?? "private",
  );
  const [sharedDepts, setSharedDepts] = useState<string[]>(
    initial?.sharedDepts ?? [],
  );

  function canProceed() {
    if (step === 1) return dataSource !== null && name.trim().length > 0;
    if (step === 2) return columns.length > 0;
    if (step === 5) return name.trim().length > 0;
    return true;
  }

  function handleSave() {
    if (!dataSource || !name.trim()) return;
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim(),
      description,
      dataSource,
      columns,
      filters,
      shareLevel,
      sharedDepts,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      owner: "You",
      lastRun: undefined,
    });
  }

  const srcLabel = DATA_SOURCES.find((s) => s.id === dataSource)?.label;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="report_builder.dialog"
      aria-modal="true"
      aria-labelledby="rb-title"
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
      <div className="relative z-10 w-[92vw] max-w-4xl h-[88vh] crm-card flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2
              id="rb-title"
              className="text-base font-semibold text-foreground font-display"
            >
              {initial ? "Edit Report" : "Custom Report Builder"}
            </h2>
            {srcLabel && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Data source:{" "}
                <span className="text-accent font-medium">{srcLabel}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Close report builder"
            data-ocid="report_builder.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-5 shrink-0">
          <StepIndicator step={step} total={TOTAL_STEPS} />
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 scrollbar-thin">
          {step === 1 && (
            <Step1Source
              selected={dataSource}
              reportName={name}
              description={description}
              onSelect={(s) => {
                setDataSource(s);
                if (columns.length > 0 && dataSource !== s) setColumns([]);
              }}
              onNameChange={setName}
              onDescChange={setDescription}
            />
          )}
          {step === 2 && dataSource && (
            <Step2Columns
              dataSource={dataSource}
              selected={columns}
              onChange={setColumns}
            />
          )}
          {step === 3 && (
            <Step3Filters filters={filters} onChange={setFilters} />
          )}
          {step === 4 && (
            <Step4Preview
              dataSource={dataSource}
              columns={columns}
              reportName={name}
            />
          )}
          {step === 5 && (
            <Step4Save
              name={name}
              description={description}
              shareLevel={shareLevel}
              sharedDepts={sharedDepts}
              onNameChange={setName}
              onDescChange={setDescription}
              onShareChange={setShareLevel}
              onDeptsChange={setSharedDepts}
            />
          )}
        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between shrink-0 bg-card/80">
          <Button
            type="button"
            variant="ghost"
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            data-ocid="report_builder.back_button"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          <div className="text-xs text-muted-foreground">
            Step {step} of {TOTAL_STEPS}
          </div>

          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              data-ocid="report_builder.next_button"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {step === 4 ? (
                <>
                  <Save className="w-4 h-4 mr-1" /> Review & Save
                </>
              ) : (
                <>
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleSave();
                }}
                disabled={!canProceed()}
                data-ocid="report_builder.save_button"
              >
                <Save className="w-4 h-4 mr-1" /> Save Report
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleSave();
                }}
                disabled={!canProceed()}
                data-ocid="report_builder.save_run_button"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Save className="w-4 h-4 mr-1" /> Save &amp; Run
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────

export interface ShareModalProps {
  report: SavedReport;
  onClose: () => void;
  onSave: (report: SavedReport) => void;
}

export function ShareModal({ report, onClose, onSave }: ShareModalProps) {
  const [level, setLevel] = useState<"view" | "view_export">("view");
  const [depts, setDepts] = useState<string[]>(report.sharedDepts);

  function toggleDept(d: string) {
    setDepts((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="share_modal.dialog"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      />
      <div className="relative z-10 crm-card w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground font-display">
            Share Report
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-ocid="share_modal.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          <span className="text-foreground font-medium">{report.name}</span> —
          select departments and permission level.
        </p>
        <div className="mb-4">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Permission Level
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["view", "view_export"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`p-2.5 rounded-lg border text-xs transition-all ${
                  level === l
                    ? "border-accent bg-accent/10"
                    : "border-border bg-secondary/20 hover:border-accent/40"
                }`}
              >
                <div className="font-medium text-foreground">
                  {l === "view" ? "View Only" : "View & Export"}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Lock className="w-3 h-3 text-muted-foreground" />
            <div className="text-xs font-medium text-muted-foreground">
              Departments
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDept(d)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  depts.includes(d)
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            data-ocid="share_modal.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onSave({ ...report, sharedDepts: depts, shareLevel: "shared" });
              onClose();
            }}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            data-ocid="share_modal.confirm_button"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" /> Share Report
          </Button>
        </div>
      </div>
    </div>
  );
}
