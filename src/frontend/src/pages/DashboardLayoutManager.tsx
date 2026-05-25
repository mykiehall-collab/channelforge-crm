/**
 * DashboardLayoutManager — premium enterprise dashboard customization page.
 * Full drag-and-drop widget management, template library, widget config panel,
 * and Add Widget dialog. Part of The Foundry customization suite.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  ChevronRight,
  Copy,
  GripVertical,
  LayoutDashboard,
  Loader2,
  Pin,
  Plus,
  Save,
  Search,
  Settings,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LayoutBuilderProvider,
  useLayoutBuilderContext,
} from "../contexts/LayoutBuilderContext";
import {
  DEFAULT_DASHBOARD_TEMPLATES,
  FORGEAI_LAYOUT_SUGGESTIONS,
  WIDGET_CATALOG,
} from "../data/layoutBuilderDefaults";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import type {
  DashboardLayout,
  WidgetCatalogItem,
  WidgetConfig,
  WidgetType,
} from "../types/layoutBuilder";
import { WidgetSize } from "../types/layoutBuilder";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WIDGET_ICONS: Record<string, string> = {
  KpiCard: "📊",
  LineGraph: "📈",
  BarChart: "📉",
  PipelineBoard: "🔄",
  AccountHealth: "💚",
  AiInsights: "🤖",
  ActivityFeed: "📋",
  RenewalTracker: "🔁",
  OpportunitySummary: "💰",
  MessagingWidget: "💬",
  SlaTracking: "⏱️",
  Forecasting: "🔮",
  OperationalAlerts: "🚨",
  TerritoryPerformance: "🗺️",
  MdfTracking: "📦",
  ResellerPerformance: "🤝",
  DistributorPerformance: "🏭",
  AiUsage: "⚡",
  ComputeStorage: "💾",
  Custom: "⚙️",
};

const CATEGORY_COLORS: Record<string, string> = {
  KPI: "bg-primary/20 text-primary border-primary/30",
  Charts: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  Operations: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  AI: "bg-purple-500/20 text-purple-300 border-purple-400/30",
  Infrastructure: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
};

const WIDGET_CATEGORIES = [
  "All",
  "KPI",
  "Charts",
  "Operations",
  "AI",
  "Infrastructure",
] as const;
type WidgetCategory = (typeof WIDGET_CATEGORIES)[number];

const SIZE_LABELS: Record<string, string> = {
  [WidgetSize.Small]: "Small (1×1)",
  [WidgetSize.Medium]: "Medium (2×1)",
  [WidgetSize.Wide]: "Wide (3×1)",
  [WidgetSize.Tall]: "Tall (1×2)",
  [WidgetSize.FullWidth]: "Full Width (4×1)",
  [WidgetSize.Large]: "Large (2×2)",
};

const ROLES = ["Sales", "Marketing", "Sales Ops", "Leadership", "IT", "Admin"];
const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "Operations",
  "Finance",
  "IT",
  "Leadership",
];

// ---------------------------------------------------------------------------
// WidgetPreview
// ---------------------------------------------------------------------------

function WidgetPreview({
  widgetType,
  title,
}: { widgetType: WidgetType | string; title: string }) {
  const typeKey =
    typeof widgetType === "string" ? widgetType : String(widgetType);

  if (typeKey === "KpiCard") {
    return (
      <div className="flex flex-col gap-1 p-1">
        <span className="text-xs text-muted-foreground">{title}</span>
        <span className="text-2xl font-bold text-foreground">£2.4M</span>
        <span className="text-xs text-emerald-400">↑ 12.3% vs last month</span>
      </div>
    );
  }
  if (typeKey === "BarChart" || typeKey === "LineGraph") {
    const bars = [60, 80, 45, 90, 70, 55, 85];
    return (
      <div className="flex flex-col gap-1 p-1">
        <span className="text-xs text-muted-foreground">{title}</span>
        <div className="flex items-end gap-0.5 h-10">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-primary/60"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    );
  }
  if (typeKey === "PipelineBoard") {
    return (
      <div className="flex gap-1 p-1">
        {["Prospect", "Proposal", "Closed"].map((col) => (
          <div key={col} className="flex-1 bg-background/40 rounded p-1">
            <span className="text-[10px] text-muted-foreground block mb-1">
              {col}
            </span>
            <div className="h-2 bg-primary/40 rounded mb-0.5" />
            <div className="h-2 bg-primary/30 rounded" />
          </div>
        ))}
      </div>
    );
  }
  if (typeKey === "AiInsights" || typeKey === "Forecasting") {
    return (
      <div className="flex flex-col gap-1 p-1">
        <span className="text-xs text-muted-foreground">{title}</span>
        {[
          "3 accounts at renewal risk",
          "Pipeline velocity +18%",
          "2 stalled deals",
        ].map((tip, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
            <span className="text-[10px] text-foreground/70">{tip}</span>
          </div>
        ))}
      </div>
    );
  }
  if (typeKey === "ActivityFeed") {
    return (
      <div className="flex flex-col gap-1 p-1">
        <span className="text-xs text-muted-foreground">{title}</span>
        {[
          "Account updated · 2m",
          "Deal registered · 15m",
          "Renewal approved · 1h",
        ].map((item, i) => (
          <div
            key={i}
            className="text-[10px] text-foreground/60 border-l-2 border-primary/40 pl-1"
          >
            {item}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-2">
      <span className="text-2xl">{WIDGET_ICONS[typeKey] ?? "📊"}</span>
      <span className="text-[10px] text-muted-foreground text-center">
        {title}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WidgetCard
// ---------------------------------------------------------------------------

interface WidgetCardProps {
  widget: WidgetConfig;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  dragProps: ReturnType<ReturnType<typeof useDragAndDrop>["getItemProps"]>;
}

function WidgetCard({
  widget,
  isSelected,
  onSelect,
  onRemove,
  dragProps,
}: WidgetCardProps) {
  const typeKey =
    typeof widget.widgetType === "string"
      ? widget.widgetType
      : String(widget.widgetType);
  const isPinned = widget.isPinned;

  const sizeClass = (() => {
    switch (widget.size) {
      case WidgetSize.Small:
        return "col-span-1 row-span-1";
      case WidgetSize.Medium:
        return "col-span-2 row-span-1";
      case WidgetSize.Wide:
        return "col-span-3 row-span-1";
      case WidgetSize.Tall:
        return "col-span-1 row-span-2";
      case WidgetSize.FullWidth:
        return "col-span-4 row-span-1";
      case WidgetSize.Large:
        return "col-span-2 row-span-2";
      default:
        return "col-span-2 row-span-1";
    }
  })();

  return (
    <div
      {...dragProps}
      className={`${dragProps.className} ${sizeClass} group relative rounded-xl border transition-all duration-200 overflow-hidden cursor-grab active:cursor-grabbing ${
        isSelected
          ? "border-primary shadow-lg shadow-primary/20 bg-card/90"
          : "border-border/40 bg-card/60 hover:border-border/70 hover:bg-card/80"
      }`}
      onClick={() => onSelect(widget.widgetId)}
      data-ocid={`dashboard.widget.${widget.widgetId}`}
    >
      {/* Drag handle */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-60 transition-opacity">
        <GripVertical className="w-3 h-3 text-muted-foreground builder-drag-handle" />
      </div>

      {/* Pin badge */}
      {isPinned && (
        <div className="absolute top-1.5 right-8 z-10">
          <Pin className="w-3 h-3 text-primary fill-primary" />
        </div>
      )}

      {/* Remove button */}
      <button
        type="button"
        className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-destructive/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(widget.widgetId);
        }}
        aria-label={`Remove ${widget.title}`}
        data-ocid={`dashboard.widget.remove.${widget.widgetId}`}
      >
        <X className="w-2.5 h-2.5 text-white" />
      </button>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
      )}

      {/* Content */}
      <div className="h-full min-h-[100px] flex flex-col">
        <WidgetPreview widgetType={widget.widgetType} title={widget.title} />
      </div>

      {/* Type badge */}
      <div className="absolute bottom-1.5 left-2">
        <span className="text-[9px] text-muted-foreground/60 font-mono">
          {typeKey}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AddWidgetDialog
// ---------------------------------------------------------------------------

function AddWidgetDialog({
  open,
  onClose,
  onAdd,
  existingWidgetTypes,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: WidgetCatalogItem) => void;
  existingWidgetTypes: string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<WidgetCategory>("All");

  const filtered = WIDGET_CATALOG.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="dashboard.add_widget.dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40 bg-card/80">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Add Widget
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Choose from {WIDGET_CATALOG.length} available widget types
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            data-ocid="dashboard.add_widget.close_button"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search + categories */}
        <div className="p-4 border-b border-border/30 space-y-3 bg-card/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-background/40 border-border/40 text-sm"
              placeholder="Search widgets…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-ocid="dashboard.add_widget.search_input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {WIDGET_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/40 text-muted-foreground border-border/40 hover:border-border"
                }`}
                data-ocid={`dashboard.add_widget.category.${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Widget grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-muted-foreground"
              data-ocid="dashboard.add_widget.empty_state"
            >
              <span className="text-3xl mb-2">🔍</span>
              <p className="text-sm">No widgets match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((item) => {
                const isAdded = existingWidgetTypes.includes(item.type);
                return (
                  <div
                    key={item.type}
                    className="flex gap-3 p-3 rounded-xl border border-border/40 bg-background/30 hover:bg-background/60 hover:border-border/70 transition-all duration-150 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-xl">
                      {WIDGET_ICONS[item.type] ?? "📊"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          {item.name}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${CATEGORY_COLORS[item.category]}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAdd(item);
                      }}
                      disabled={isAdded}
                      className={`flex-shrink-0 self-center w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 ${
                        isAdded
                          ? "bg-emerald-500/20 border border-emerald-500/40 cursor-default"
                          : "bg-primary/20 border border-primary/40 hover:bg-primary hover:text-primary-foreground"
                      }`}
                      data-ocid={`dashboard.add_widget.add.${item.type.toLowerCase()}`}
                    >
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-primary" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ForgeAI suggestion */}
        <div className="p-4 border-t border-border/30 bg-primary/5">
          <div className="flex items-start gap-2">
            <span className="text-base">🤖</span>
            <div>
              <span className="text-xs font-medium text-primary">
                ForgeAI Suggestion
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                {FORGEAI_LAYOUT_SUGGESTIONS[
                  Math.floor(Math.random() * FORGEAI_LAYOUT_SUGGESTIONS.length)
                ]?.suggestion ??
                  "Sales users in EMEA frequently use Renewal Risk widgets."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WidgetConfigPanel
// ---------------------------------------------------------------------------

function WidgetConfigPanel({
  widget,
  onSave,
  onRemove,
  onClose,
}: {
  widget: WidgetConfig | null;
  onSave: (updated: WidgetConfig) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(widget?.title ?? "");
  const [size, setSize] = useState<string>(
    widget?.size ?? (WidgetSize.Medium as string),
  );
  const [pinned, setPinned] = useState(widget?.isPinned ?? false);
  const [aiSummary, setAiSummary] = useState(widget?.aiSummaryEnabled ?? false);
  const [roles, setRoles] = useState<string[]>(widget?.roleFilter ?? []);
  const [depts, setDepts] = useState<string[]>(widget?.deptFilter ?? []);

  useEffect(() => {
    if (widget) {
      setTitle(widget.title);
      setSize(widget.size);
      setPinned(widget.isPinned);
      setAiSummary(widget.aiSummaryEnabled);
      setRoles(widget.roleFilter);
      setDepts(widget.deptFilter);
    }
  }, [widget]);

  if (!widget) return null;

  const toggleRole = (role: string) =>
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  const toggleDept = (dept: string) =>
    setDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );

  const handleSave = () => {
    onSave({
      ...widget,
      title,
      size: size as WidgetSize,
      isPinned: pinned,
      aiSummaryEnabled: aiSummary,
      roleFilter: roles,
      deptFilter: depts,
    });
    toast.success("Widget settings saved");
  };

  return (
    <aside
      className="w-72 border-l border-border/40 bg-card/80 flex flex-col overflow-hidden"
      data-ocid="dashboard.config_panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {WIDGET_ICONS[
              typeof widget.widgetType === "string"
                ? widget.widgetType
                : String(widget.widgetType)
            ] ?? "📊"}
          </span>
          <span className="text-sm font-semibold text-foreground">
            Widget Settings
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-muted"
          data-ocid="dashboard.config_panel.close_button"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Widget Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm bg-background/40 border-border/40"
            data-ocid="dashboard.config_panel.title_input"
          />
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Size</Label>
          <div className="space-y-1.5">
            {Object.entries(SIZE_LABELS).map(([val, label]) => (
              <label
                key={val}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    size === val
                      ? "border-primary"
                      : "border-muted-foreground/40 group-hover:border-primary/60"
                  }`}
                >
                  {size === val && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-xs text-foreground/80">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <Label className="text-xs font-medium">Options</Label>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-foreground/80">Pin widget</span>
              <p className="text-[10px] text-muted-foreground">
                Always visible at top
              </p>
            </div>
            <Switch
              checked={pinned}
              onCheckedChange={setPinned}
              data-ocid="dashboard.config_panel.pin_switch"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-foreground/80">AI Summary</span>
              <p className="text-[10px] text-muted-foreground">
                ForgeAI context overlay
              </p>
            </div>
            <Switch
              checked={aiSummary}
              onCheckedChange={setAiSummary}
              data-ocid="dashboard.config_panel.ai_switch"
            />
          </div>
        </div>

        {/* Role visibility */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Visible to Roles</Label>
          <p className="text-[10px] text-muted-foreground">
            Empty = visible to all roles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`px-2 py-0.5 rounded text-[10px] border transition-all duration-150 ${
                  roles.includes(role)
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-background/40 border-border/40 text-muted-foreground hover:border-border"
                }`}
                data-ocid={`dashboard.config_panel.role.${role.toLowerCase().replace(" ", "_")}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Department visibility */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Visible to Departments</Label>
          <p className="text-[10px] text-muted-foreground">
            Empty = visible to all departments
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => toggleDept(dept)}
                className={`px-2 py-0.5 rounded text-[10px] border transition-all duration-150 ${
                  depts.includes(dept)
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-background/40 border-border/40 text-muted-foreground hover:border-border"
                }`}
                data-ocid={`dashboard.config_panel.dept.${dept.toLowerCase()}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-border/30 space-y-2">
        <Button
          onClick={handleSave}
          className="w-full text-xs"
          size="sm"
          data-ocid="dashboard.config_panel.save_button"
        >
          <Save className="w-3 h-3 mr-1.5" /> Save Settings
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="w-full text-xs"
          onClick={() => {
            onRemove(widget.widgetId);
            onClose();
          }}
          data-ocid="dashboard.config_panel.delete_button"
        >
          <Trash2 className="w-3 h-3 mr-1.5" /> Remove Widget
        </Button>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Assignment Modal
// ---------------------------------------------------------------------------

function AssignmentModal({ onClose }: { onClose: () => void }) {
  const [assignTo, setAssignTo] = useState<"role" | "department" | "org">(
    "role",
  );
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const OPTIONS: Record<string, string[]> = {
    role: ROLES,
    department: DEPARTMENTS,
    org: ["Vendor", "Distributor", "Reseller"],
  };

  const toggle = (v: string) =>
    setSelectedValues((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="dashboard.assign.dialog"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Assign Dashboard
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control who sees this dashboard
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted"
            data-ocid="dashboard.assign.close_button"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            {(["role", "department", "org"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setAssignTo(type);
                  setSelectedValues([]);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  assignTo === type
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-background/40 border-border/40 text-muted-foreground"
                }`}
                data-ocid={`dashboard.assign.type.${type}`}
              >
                {type === "org"
                  ? "Org Type"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {OPTIONS[assignTo].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => toggle(val)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  selectedValues.includes(val)
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-background/40 border-border/40 text-muted-foreground hover:border-border"
                }`}
                data-ocid={`dashboard.assign.value.${val.toLowerCase()}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            onClick={() => {
              toast.success(
                `Dashboard assigned to ${selectedValues.length ? selectedValues.join(", ") : "everyone"}`,
              );
              onClose();
            }}
            className="flex-1 text-xs"
            size="sm"
            data-ocid="dashboard.assign.confirm_button"
          >
            <Check className="w-3 h-3 mr-1.5" /> Apply Assignment
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
            data-ocid="dashboard.assign.cancel_button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DashboardLayoutManager (main)
// ---------------------------------------------------------------------------

export function DashboardLayoutManager() {
  const {
    dashboardLayouts,
    templates,
    saveDashboard,
    cloneDashboard,
    loading,
  } = useLayoutBuilderContext();

  const [currentDashboard, setCurrentDashboard] =
    useState<DashboardLayout | null>(null);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [showAssignment, setShowAssignment] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"mine" | "templates">("mine");

  const drag = useDragAndDrop<WidgetConfig & { id: string }>();

  // Initialize with first dashboard/template
  useEffect(() => {
    const all = dashboardLayouts.length
      ? dashboardLayouts
      : DEFAULT_DASHBOARD_TEMPLATES;
    if (!currentDashboard && all.length > 0) {
      const first = all[0];
      setCurrentDashboard(first);
      setDashboardName(first.name);
    }
  }, [dashboardLayouts, currentDashboard]);

  // Wire drag reorder
  useEffect(() => {
    drag.setOnReorder((fromId, toId) => {
      if (!currentDashboard) return;
      const widgets = currentDashboard.widgets.map((w) => ({
        ...w,
        id: w.widgetId,
      }));
      const reordered = drag.reorderItems(widgets, fromId, toId);
      setCurrentDashboard((prev) =>
        prev
          ? { ...prev, widgets: reordered.map(({ id: _id, ...w }) => w) }
          : prev,
      );
    });
  }, [drag, currentDashboard]);

  const selectedWidget =
    currentDashboard?.widgets.find((w) => w.widgetId === selectedWidgetId) ??
    null;
  const existingTypes =
    currentDashboard?.widgets.map((w) =>
      typeof w.widgetType === "string" ? w.widgetType : String(w.widgetType),
    ) ?? [];

  const handleSelectDashboard = (dash: DashboardLayout) => {
    setCurrentDashboard(dash);
    setDashboardName(dash.name);
    setSelectedWidgetId(null);
  };

  const handleAddWidget = useCallback(
    (item: WidgetCatalogItem) => {
      if (!currentDashboard) return;
      const newWidget: WidgetConfig = {
        widgetId: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        widgetType: item.type as WidgetType,
        title: item.name,
        size: item.defaultSize as WidgetSize,
        isPinned: false,
        aiSummaryEnabled: false,
        roleFilter: [],
        deptFilter: [],
        posX: BigInt(0),
        posY: BigInt(currentDashboard.widgets.length),
        customConfig: "",
      };
      setCurrentDashboard((prev) =>
        prev ? { ...prev, widgets: [...prev.widgets, newWidget] } : prev,
      );
      toast.success(`${item.name} added to dashboard`);
    },
    [currentDashboard],
  );

  const handleRemoveWidget = useCallback(
    (widgetId: string) => {
      setCurrentDashboard((prev) =>
        prev
          ? {
              ...prev,
              widgets: prev.widgets.filter((w) => w.widgetId !== widgetId),
            }
          : prev,
      );
      if (selectedWidgetId === widgetId) setSelectedWidgetId(null);
      toast.success("Widget removed");
    },
    [selectedWidgetId],
  );

  const handleUpdateWidget = useCallback((updated: WidgetConfig) => {
    setCurrentDashboard((prev) =>
      prev
        ? {
            ...prev,
            widgets: prev.widgets.map((w) =>
              w.widgetId === updated.widgetId ? updated : w,
            ),
          }
        : prev,
    );
  }, []);

  const handleSave = async () => {
    if (!currentDashboard) return;
    setIsSaving(true);
    const updated = { ...currentDashboard, name: dashboardName };
    await saveDashboard(updated);
    setCurrentDashboard(updated);
    setIsSaving(false);
    toast.success("Dashboard saved successfully");
  };

  const handleClone = async () => {
    if (!currentDashboard) return;
    const newId = await cloneDashboard(
      currentDashboard.id,
      `${dashboardName} (Copy)`,
    );
    if (newId) toast.success("Dashboard cloned successfully");
  };

  const allDashboards = dashboardLayouts.length
    ? dashboardLayouts
    : DEFAULT_DASHBOARD_TEMPLATES;
  const templateList = templates.length
    ? templates
    : DEFAULT_DASHBOARD_TEMPLATES;

  return (
    <div
      className="flex h-full overflow-hidden bg-background"
      data-ocid="dashboard.manager.page"
    >
      {/* ── Left sidebar ── */}
      <aside className="w-60 flex-shrink-0 border-r border-border/40 bg-card/60 flex flex-col overflow-hidden">
        {/* Sidebar tabs */}
        <div className="flex border-b border-border/30">
          {(["mine", "templates"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSidebarTab(tab)}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                sidebarTab === tab
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`dashboard.sidebar.${tab}.tab`}
            >
              {tab === "mine" ? "My Dashboards" : "Templates"}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {(sidebarTab === "mine" ? allDashboards : templateList).map(
            (dash) => (
              <button
                key={dash.id}
                type="button"
                onClick={() => handleSelectDashboard(dash)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group flex items-center gap-2 ${
                  currentDashboard?.id === dash.id
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-foreground/70 hover:bg-muted/50 hover:text-foreground border border-transparent"
                }`}
                data-ocid={`dashboard.sidebar.item.${dash.id}`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium truncate block">
                    {dash.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {dash.widgets.length} widgets
                  </span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 flex-shrink-0" />
              </button>
            ),
          )}
        </div>

        {/* ForgeAI suggestion */}
        <div className="p-3 border-t border-border/30">
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">🤖</span>
              <span className="text-[10px] font-semibold text-primary">
                ForgeAI
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Marketing teams commonly pin MDF Performance panels.
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/40 bg-card/70">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <LayoutDashboard className="w-4 h-4 text-primary" />
          )}
          <input
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            className="flex-1 text-base font-semibold bg-transparent text-foreground border-none outline-none focus:ring-0 placeholder:text-muted-foreground/50"
            placeholder="Dashboard name…"
            data-ocid="dashboard.manager.name_input"
          />
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssignment(true)}
              className="text-xs gap-1.5 border-border/50"
              data-ocid="dashboard.manager.assign_button"
            >
              <Share2 className="w-3 h-3" /> Assign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClone}
              className="text-xs gap-1.5 border-border/50"
              data-ocid="dashboard.manager.clone_button"
            >
              <Copy className="w-3 h-3" /> Clone
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="text-xs gap-1.5"
              data-ocid="dashboard.manager.save_button"
            >
              {isSaving ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              Save
            </Button>
          </div>
        </div>

        {/* Widget canvas + config panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-y-auto p-5">
            {!currentDashboard ? (
              <div
                className="flex flex-col items-center justify-center h-full text-muted-foreground"
                data-ocid="dashboard.manager.empty_state"
              >
                <LayoutDashboard className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">No dashboard selected</p>
                <p className="text-xs mt-1">
                  Choose one from the sidebar or create a new one
                </p>
              </div>
            ) : currentDashboard.widgets.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-full text-muted-foreground"
                data-ocid="dashboard.canvas.empty_state"
              >
                <span className="text-5xl mb-3 opacity-40">📊</span>
                <p className="text-sm font-medium">No widgets yet</p>
                <p className="text-xs mt-1 mb-4">
                  Click the orange button below to add your first widget
                </p>
                <Button
                  onClick={() => setAddWidgetOpen(true)}
                  className="gap-2 text-xs"
                  size="sm"
                  data-ocid="dashboard.canvas.add_first_button"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Widget
                </Button>
              </div>
            ) : (
              <div className="builder-widget-grid grid grid-cols-4 gap-3 auto-rows-[120px]">
                {currentDashboard.widgets.map((widget, _idx) => {
                  const dragProps = drag.getItemProps(widget.widgetId, "");
                  return (
                    <WidgetCard
                      key={widget.widgetId}
                      widget={widget}
                      isSelected={selectedWidgetId === widget.widgetId}
                      onSelect={setSelectedWidgetId}
                      onRemove={handleRemoveWidget}
                      dragProps={dragProps}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Config panel */}
          {selectedWidget && (
            <WidgetConfigPanel
              widget={selectedWidget}
              onSave={handleUpdateWidget}
              onRemove={handleRemoveWidget}
              onClose={() => setSelectedWidgetId(null)}
            />
          )}
        </div>
      </div>

      {/* ── Floating Add Widget button ── */}
      <button
        type="button"
        onClick={() => setAddWidgetOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/50 transition-all duration-200 font-medium text-sm"
        data-ocid="dashboard.add_widget.open_modal_button"
      >
        <Plus className="w-4 h-4" />
        Add Widget
      </button>

      {/* ── Modals ── */}
      <AddWidgetDialog
        open={addWidgetOpen}
        onClose={() => setAddWidgetOpen(false)}
        onAdd={(item) => {
          handleAddWidget(item);
          setAddWidgetOpen(false);
        }}
        existingWidgetTypes={existingTypes}
      />

      {showAssignment && (
        <AssignmentModal onClose={() => setShowAssignment(false)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default export — wrapped in provider
// ---------------------------------------------------------------------------

export default function DashboardLayoutManagerPage() {
  return (
    <LayoutBuilderProvider>
      <DashboardLayoutManager />
    </LayoutBuilderProvider>
  );
}
