import {
  AlertTriangle,
  Award,
  BarChart3,
  Check,
  ChevronDown,
  Copy,
  Edit,
  History,
  Plus,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useKPIGovernance } from "../../hooks/useKPIGovernance";
import type {
  KPIAuditEntry,
  KPICategory,
  KPIDefinition,
  KPIFormulaType,
  KPIStatus,
  KPIVisibilityRole,
} from "../../types/kpi";

// ─── Types ────────────────────────────────────────────────────────────────────

type PerfTab =
  | "kpi-definitions"
  | "yoy-tracking"
  | "scorecards"
  | "forecasting"
  | "governance";

// ─── Shared Sub-components ───────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border backdrop-blur-sm ${
        glow
          ? "border-orange-500/30 shadow-[0_0_24px_rgba(249,115,22,0.08)]"
          : "border-white/[0.08]"
      } bg-white/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

function CategoryBadge({ category }: { category: KPICategory }) {
  const map: Record<KPICategory, string> = {
    Revenue: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Renewals: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    Pipeline: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    Adoption: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    Marketing: "bg-pink-500/15 text-pink-400 border-pink-500/20",
    Operations: "bg-slate-400/15 text-slate-300 border-slate-400/20",
    Forecasting: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    Growth: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${map[category]}`}
    >
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: KPIStatus }) {
  const map: Record<KPIStatus, { label: string; cls: string }> = {
    exceeding: {
      label: "Exceeding",
      cls: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    },
    ahead: {
      label: "Ahead",
      cls: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    },
    on_track: {
      label: "On Track",
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    },
    growth_risk: {
      label: "Growth Risk",
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    },
    underperforming: {
      label: "Underperforming",
      cls: "bg-red-500/15 text-red-400 border-red-500/20",
    },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

function InsightTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    trending_up: "bg-emerald-500/15 text-emerald-400",
    trending_down: "bg-amber-500/15 text-amber-400",
    growth_acceleration: "bg-blue-500/15 text-blue-400",
    underperformance_warning: "bg-red-500/15 text-red-400",
    territory_trend: "bg-purple-500/15 text-purple-400",
    forecast_movement: "bg-[#0f172a]/60 text-slate-300 border border-white/10",
    yoy_variance: "bg-orange-500/15 text-orange-400",
    momentum: "bg-teal-500/15 text-teal-400",
  };
  const label = type.replace(/_/g, " ");
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize ${map[type] ?? "bg-white/10 text-white/60"}`}
    >
      {label}
    </span>
  );
}

function AuditChangeBadge({ changeType }: { changeType: string }) {
  const map: Record<string, string> = {
    created: "bg-emerald-500/15 text-emerald-400",
    updated: "bg-blue-500/15 text-blue-400",
    disabled: "bg-red-500/15 text-red-400",
    enabled: "bg-emerald-500/15 text-emerald-400",
    weight_changed: "bg-amber-500/15 text-amber-400",
    formula_changed: "bg-orange-500/15 text-orange-400",
    restored: "bg-purple-500/15 text-purple-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
        map[changeType] ?? "bg-white/10 text-white/60"
      }`}
    >
      {changeType.replace(/_/g, " ")}
    </span>
  );
}

// ─── KPI Form ─────────────────────────────────────────────────────────────────

const CATEGORIES: KPICategory[] = [
  "Revenue",
  "Renewals",
  "Pipeline",
  "Adoption",
  "Marketing",
  "Operations",
  "Forecasting",
  "Growth",
];
const FORMULA_TYPES: KPIFormulaType[] = [
  "percentage",
  "average",
  "weighted_score",
  "growth_rate",
  "ratio",
  "attainment",
  "custom",
];
const VISIBILITY_ROLES: { value: KPIVisibilityRole; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "leadership", label: "Leadership" },
  { value: "sales_manager", label: "Sales Manager" },
  { value: "sales_rep", label: "Sales Rep" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
];

type KPIFormValues = {
  name: string;
  category: KPICategory;
  description: string;
  formulaType: KPIFormulaType;
  weight: number;
  benchmarkTarget: number;
  benchmarkUnit: string;
  warningThreshold: number;
  criticalThreshold: number;
  visibilityRoles: KPIVisibilityRole[];
};

const EMPTY_FORM: KPIFormValues = {
  name: "",
  category: "Revenue",
  description: "",
  formulaType: "percentage",
  weight: 5,
  benchmarkTarget: 80,
  benchmarkUnit: "%",
  warningThreshold: 10,
  criticalThreshold: 20,
  visibilityRoles: ["all"],
};

function KPIForm({
  initial,
  totalWeight,
  onSave,
  onCancel,
}: {
  initial?: KPIFormValues;
  totalWeight: number;
  onSave: (v: KPIFormValues) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<KPIFormValues>(initial ?? EMPTY_FORM);

  function toggleRole(role: KPIVisibilityRole) {
    setForm((prev) => ({
      ...prev,
      visibilityRoles: prev.visibilityRoles.includes(role)
        ? prev.visibilityRoles.filter((r) => r !== role)
        : [...prev.visibilityRoles, role],
    }));
  }

  const projectedTotal = totalWeight + form.weight;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label
            htmlFor="kpi-name"
            className="block text-xs text-muted-foreground mb-1 font-medium"
          >
            KPI Name
          </label>
          <input
            id="kpi-name"
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Renewal Rate"
          />
        </div>
        <div>
          <label
            htmlFor="kpi-category"
            className="block text-xs text-muted-foreground mb-1 font-medium"
          >
            Category
          </label>
          <select
            id="kpi-category"
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                category: e.target.value as KPICategory,
              }))
            }
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="kpi-formula-type"
            className="block text-xs text-muted-foreground mb-1 font-medium"
          >
            Formula Type
          </label>
          <select
            id="kpi-formula-type"
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            value={form.formulaType}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                formulaType: e.target.value as KPIFormulaType,
              }))
            }
          >
            {FORMULA_TYPES.map((f) => (
              <option key={f} value={f}>
                {f.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="kpi-weight"
            className="block text-xs text-muted-foreground mb-1 font-medium"
          >
            Weight %
          </label>
          <input
            id="kpi-weight"
            type="number"
            min={0}
            max={100}
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            value={form.weight}
            onChange={(e) =>
              setForm((p) => ({ ...p, weight: Number(e.target.value) }))
            }
          />
          <p
            className={`text-[10px] mt-1 ${
              projectedTotal > 100
                ? "text-red-400"
                : projectedTotal < 90
                  ? "text-amber-400"
                  : "text-emerald-400"
            }`}
          >
            Projected total: {projectedTotal}%
          </p>
        </div>
        <div>
          <label
            htmlFor="kpi-benchmark"
            className="block text-xs text-muted-foreground mb-1 font-medium"
          >
            Benchmark Target
          </label>
          <div className="flex gap-2">
            <input
              id="kpi-benchmark"
              type="number"
              className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
              value={form.benchmarkTarget}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  benchmarkTarget: Number(e.target.value),
                }))
              }
            />
            <input
              className="w-20 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
              value={form.benchmarkUnit}
              placeholder="Unit"
              onChange={(e) =>
                setForm((p) => ({ ...p, benchmarkUnit: e.target.value }))
              }
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="kpi-warning"
            className="block text-xs text-muted-foreground mb-1 font-medium"
          >
            Warning Threshold %
          </label>
          <input
            id="kpi-warning"
            type="number"
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            value={form.warningThreshold}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                warningThreshold: Number(e.target.value),
              }))
            }
          />
        </div>
        <div>
          <label
            htmlFor="kpi-critical"
            className="block text-xs text-muted-foreground mb-1 font-medium"
          >
            Critical Threshold %
          </label>
          <input
            id="kpi-critical"
            type="number"
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            value={form.criticalThreshold}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                criticalThreshold: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="kpi-description"
            className="block text-xs text-muted-foreground mb-1 font-medium"
          >
            Description
          </label>
          <textarea
            id="kpi-description"
            rows={2}
            className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50 resize-none"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Describe what this KPI measures..."
          />
        </div>
        <div className="col-span-2">
          <p className="block text-xs text-muted-foreground mb-2 font-medium">
            Visibility Roles
          </p>
          <div className="flex flex-wrap gap-2">
            {VISIBILITY_ROLES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleRole(value)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                  form.visibilityRoles.includes(value)
                    ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
                    : "text-muted-foreground border-white/10 hover:border-white/20"
                }`}
              >
                {form.visibilityRoles.includes(value) && <Check size={10} />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-white/8">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-white/10 hover:border-white/20 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(form)}
          disabled={!form.name.trim()}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save KPI
        </button>
      </div>
    </div>
  );
}

// ─── Tab 1: KPI Definitions ──────────────────────────────────────────────────

function KPIDefinitionsTab() {
  const { kpiDefinitions, saveKPIDefinitions, addAuditEntry } =
    useKPIGovernance();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const enabledTotal = kpiDefinitions
    .filter((k) => k.isEnabled)
    .reduce((s, k) => s + k.weight, 0);

  function handleSave(vals: KPIFormValues) {
    if (editId) {
      const updated = kpiDefinitions.map((k) =>
        k.id === editId
          ? {
              ...k,
              ...vals,
              updatedAt: new Date().toISOString(),
              version: k.version + 1,
            }
          : k,
      );
      saveKPIDefinitions(updated);
      addAuditEntry(editId, vals.name, "updated", "admin");
      toast.success("KPI updated");
    } else {
      const newKpi: KPIDefinition = {
        id: `kpi-${Date.now()}`,
        ...vals,
        formulaExpression: "",
        isEnabled: true,
        isDefault: false,
        ownerId: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        tags: [],
      };
      saveKPIDefinitions([...kpiDefinitions, newKpi]);
      addAuditEntry(newKpi.id, vals.name, "created", "admin");
      toast.success("KPI created");
    }
    setShowForm(false);
    setEditId(null);
  }

  function handleToggle(kpi: KPIDefinition) {
    const updated = kpiDefinitions.map((k) =>
      k.id === kpi.id ? { ...k, isEnabled: !k.isEnabled } : k,
    );
    saveKPIDefinitions(updated);
    addAuditEntry(
      kpi.id,
      kpi.name,
      kpi.isEnabled ? "disabled" : "enabled",
      "admin",
    );
    toast.success(`KPI ${kpi.isEnabled ? "disabled" : "enabled"}`);
  }

  function handleDuplicate(kpi: KPIDefinition) {
    const copy: KPIDefinition = {
      ...kpi,
      id: `kpi-${Date.now()}`,
      name: `${kpi.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    saveKPIDefinitions([...kpiDefinitions, copy]);
    addAuditEntry(copy.id, copy.name, "created", "admin");
    toast.success("KPI duplicated");
  }

  const editingKpi = editId
    ? kpiDefinitions.find((k) => k.id === editId)
    : null;
  const editInitial: KPIFormValues | undefined = editingKpi
    ? {
        name: editingKpi.name,
        category: editingKpi.category,
        description: editingKpi.description,
        formulaType: editingKpi.formulaType,
        weight: editingKpi.weight,
        benchmarkTarget: editingKpi.benchmarkTarget,
        benchmarkUnit: editingKpi.benchmarkUnit,
        warningThreshold: editingKpi.warningThreshold,
        criticalThreshold: editingKpi.criticalThreshold,
        visibilityRoles: editingKpi.visibilityRoles,
      }
    : undefined;

  const formTotalExcludingEdit = editId
    ? enabledTotal - (editingKpi?.weight ?? 0)
    : enabledTotal;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            KPI Definitions
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define, weight, and govern all operational KPIs
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Weight indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
              enabledTotal > 100
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : enabledTotal < 95
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}
          >
            <Target size={11} />
            <span>Total Weight: {enabledTotal}%</span>
          </div>
          <button
            type="button"
            data-ocid="pg.kpi_definitions.add_button"
            onClick={() => {
              setEditId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 transition-colors"
          >
            <Plus size={12} />
            Add KPI
          </button>
        </div>
      </div>

      {/* Inline form */}
      {(showForm || editId) && (
        <GlassCard className="p-4" glow>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            {editId ? "Edit KPI" : "New KPI"}
          </h4>
          <KPIForm
            initial={editInitial}
            totalWeight={formTotalExcludingEdit}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditId(null);
            }}
          />
        </GlassCard>
      )}

      {/* KPI table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {[
                  "KPI Name",
                  "Category",
                  "Formula",
                  "Weight",
                  "Benchmark",
                  "Status",
                  "Ver.",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpiDefinitions.map((kpi, i) => (
                <>
                  <tr
                    key={kpi.id}
                    data-ocid={`pg.kpi_definitions.item.${i + 1}`}
                    className={`border-b border-white/5 last:border-0 transition-colors ${
                      !kpi.isEnabled ? "opacity-50" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(expandedId === kpi.id ? null : kpi.id)
                          }
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Expand row"
                        >
                          <ChevronDown
                            size={12}
                            className={`transition-transform ${
                              expandedId === kpi.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <span className="font-medium text-foreground">
                          {kpi.name}
                        </span>
                        {kpi.isDefault && (
                          <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wide">
                            default
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={kpi.category} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                      {kpi.formulaType.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full bg-orange-500/30"
                          style={{ width: "48px" }}
                        >
                          <div
                            className="h-full rounded-full bg-orange-400"
                            style={{
                              width: `${Math.min(100, (kpi.weight / 40) * 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-orange-400">
                          {kpi.weight}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {kpi.benchmarkTarget}
                      {kpi.benchmarkUnit}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${
                          kpi.isEnabled
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                            : "bg-white/5 text-muted-foreground border-white/10"
                        }`}
                      >
                        {kpi.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      v{kpi.version}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          data-ocid={`pg.kpi_definitions.edit_button.${i + 1}`}
                          title="Edit"
                          onClick={() => {
                            setShowForm(false);
                            setEditId(kpi.id);
                          }}
                          className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-orange-400 transition-colors"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          type="button"
                          data-ocid={`pg.kpi_definitions.duplicate_button.${i + 1}`}
                          title="Duplicate"
                          onClick={() => handleDuplicate(kpi)}
                          className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-blue-400 transition-colors"
                        >
                          <Copy size={12} />
                        </button>
                        <button
                          type="button"
                          data-ocid={`pg.kpi_definitions.toggle_button.${i + 1}`}
                          title={kpi.isEnabled ? "Disable" : "Enable"}
                          onClick={() => handleToggle(kpi)}
                          className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                            kpi.isEnabled
                              ? "text-muted-foreground hover:text-red-400"
                              : "text-muted-foreground hover:text-emerald-400"
                          }`}
                        >
                          {kpi.isEnabled ? (
                            <X size={12} />
                          ) : (
                            <Check size={12} />
                          )}
                        </button>
                        <button
                          type="button"
                          title="View History"
                          onClick={() =>
                            setExpandedId(expandedId === kpi.id ? null : kpi.id)
                          }
                          className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-purple-400 transition-colors"
                        >
                          <History size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === kpi.id && (
                    <tr
                      key={`${kpi.id}-expand`}
                      className="border-b border-white/5"
                    >
                      <td colSpan={8} className="px-6 py-3 bg-white/[0.02]">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>
                            <span className="text-foreground/80 font-medium">
                              Description:
                            </span>{" "}
                            {kpi.description || "No description."}
                          </p>
                          <p>
                            <span className="text-foreground/80 font-medium">
                              Formula:
                            </span>{" "}
                            <code className="text-orange-300/80 font-mono text-[11px]">
                              {kpi.formulaExpression || "—"}
                            </code>
                          </p>
                          <p>
                            <span className="text-foreground/80 font-medium">
                              Visibility:
                            </span>{" "}
                            {kpi.visibilityRoles.join(", ")}
                          </p>
                          <p>
                            <span className="text-foreground/80 font-medium">
                              Thresholds:
                            </span>{" "}
                            Warning -{kpi.warningThreshold}% / Critical -
                            {kpi.criticalThreshold}%
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Tab 2: YoY Tracking ─────────────────────────────────────────────────────

const TERRITORIES = ["Nordics", "UK&I", "DACH", "Benelux", "Southern Europe"];
const TOP_KPI_IDS = [
  "kpi-renewal-revenue",
  "kpi-pipeline-growth",
  "kpi-ai-adoption",
  "kpi-forecast-accuracy",
  "kpi-reseller-growth",
  "kpi-quote-conversion",
];

const STATUS_CELL: Record<KPIStatus, string> = {
  exceeding: "bg-purple-500/20 text-purple-300",
  ahead: "bg-blue-500/20 text-blue-300",
  on_track: "bg-emerald-500/20 text-emerald-300",
  growth_risk: "bg-amber-500/20 text-amber-300",
  underperforming: "bg-red-500/20 text-red-300",
};

const STATUS_LABEL: Record<KPIStatus, string> = {
  exceeding: "EXC",
  ahead: "AHD",
  on_track: "OK",
  growth_risk: "RISK",
  underperforming: "LOW",
};

// Seeded heatmap data for 5 territories × 6 KPIs
const HEATMAP_DATA: Record<string, Record<string, KPIStatus>> = {
  Nordics: {
    "kpi-renewal-revenue": "growth_risk",
    "kpi-pipeline-growth": "underperforming",
    "kpi-ai-adoption": "on_track",
    "kpi-forecast-accuracy": "growth_risk",
    "kpi-reseller-growth": "underperforming",
    "kpi-quote-conversion": "on_track",
  },
  "UK&I": {
    "kpi-renewal-revenue": "ahead",
    "kpi-pipeline-growth": "on_track",
    "kpi-ai-adoption": "exceeding",
    "kpi-forecast-accuracy": "ahead",
    "kpi-reseller-growth": "on_track",
    "kpi-quote-conversion": "ahead",
  },
  DACH: {
    "kpi-renewal-revenue": "exceeding",
    "kpi-pipeline-growth": "ahead",
    "kpi-ai-adoption": "on_track",
    "kpi-forecast-accuracy": "on_track",
    "kpi-reseller-growth": "ahead",
    "kpi-quote-conversion": "exceeding",
  },
  Benelux: {
    "kpi-renewal-revenue": "on_track",
    "kpi-pipeline-growth": "on_track",
    "kpi-ai-adoption": "growth_risk",
    "kpi-forecast-accuracy": "on_track",
    "kpi-reseller-growth": "on_track",
    "kpi-quote-conversion": "growth_risk",
  },
  "Southern Europe": {
    "kpi-renewal-revenue": "growth_risk",
    "kpi-pipeline-growth": "growth_risk",
    "kpi-ai-adoption": "underperforming",
    "kpi-forecast-accuracy": "underperforming",
    "kpi-reseller-growth": "growth_risk",
    "kpi-quote-conversion": "on_track",
  },
};

const YOY_TABLE_DATA = [
  {
    name: "Renewal Revenue",
    kpiId: "kpi-renewal-revenue",
    prior: "£2.4M",
    target: "£3.0M",
    yoyExpected: "+25%",
    forecast: "£2.85M",
    variance: "-5%",
    status: "growth_risk" as KPIStatus,
  },
  {
    name: "Pipeline Growth",
    kpiId: "kpi-pipeline-growth",
    prior: "£5.1M",
    target: "£6.4M",
    yoyExpected: "+25%",
    forecast: "£6.5M",
    variance: "+1.6%",
    status: "ahead" as KPIStatus,
  },
  {
    name: "AI Adoption",
    kpiId: "kpi-ai-adoption",
    prior: "48%",
    target: "65%",
    yoyExpected: "+17pp",
    forecast: "71%",
    variance: "+6pp",
    status: "exceeding" as KPIStatus,
  },
  {
    name: "MDF ROI",
    kpiId: "kpi-mdf-roi",
    prior: "2.8x",
    target: "3.5x",
    yoyExpected: "+25%",
    forecast: "3.3x",
    variance: "-5.7%",
    status: "growth_risk" as KPIStatus,
  },
  {
    name: "Forecast Accuracy",
    kpiId: "kpi-forecast-accuracy",
    prior: "82%",
    target: "90%",
    yoyExpected: "+8pp",
    forecast: "88%",
    variance: "-2pp",
    status: "on_track" as KPIStatus,
  },
  {
    name: "Opportunity Velocity",
    kpiId: "kpi-opportunity-velocity",
    prior: "58 days",
    target: "42 days",
    yoyExpected: "-28%",
    forecast: "45 days",
    variance: "-7%",
    status: "on_track" as KPIStatus,
  },
  {
    name: "Reseller Growth",
    kpiId: "kpi-reseller-growth",
    prior: "£1.2M",
    target: "£1.42M",
    yoyExpected: "+18%",
    forecast: "£1.18M",
    variance: "-16.9%",
    status: "underperforming" as KPIStatus,
  },
  {
    name: "Quote Conversion",
    kpiId: "kpi-quote-conversion",
    prior: "31%",
    target: "38%",
    yoyExpected: "+7pp",
    forecast: "36%",
    variance: "-2pp",
    status: "on_track" as KPIStatus,
  },
];

const PERIODS = ["Q1 2025", "Q4 2024", "Q3 2024"];

function YoYTrackingTab() {
  const [period, setPeriod] = useState("Q1 2025");
  const { kpiDefinitions } = useKPIGovernance();

  const topKpis = TOP_KPI_IDS.map((id) =>
    kpiDefinitions.find((k) => k.id === id),
  ).filter(Boolean) as KPIDefinition[];

  const counts = {
    exceeding: YOY_TABLE_DATA.filter((r) => r.status === "exceeding").length,
    ahead: YOY_TABLE_DATA.filter((r) => r.status === "ahead").length,
    on_track: YOY_TABLE_DATA.filter((r) => r.status === "on_track").length,
    growth_risk: YOY_TABLE_DATA.filter((r) => r.status === "growth_risk")
      .length,
    underperforming: YOY_TABLE_DATA.filter(
      (r) => r.status === "underperforming",
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Year-over-Year Growth Tracking
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Performance against YoY growth expectations across KPIs and
            territories
          </p>
        </div>
        <select
          data-ocid="pg.yoy.period_select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
        >
          {PERIODS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          {
            label: "Exceeding",
            value: counts.exceeding,
            cls: "text-purple-400",
          },
          { label: "Ahead", value: counts.ahead, cls: "text-blue-400" },
          {
            label: "On Track",
            value: counts.on_track,
            cls: "text-emerald-400",
          },
          {
            label: "Growth Risk",
            value: counts.growth_risk,
            cls: "text-amber-400",
          },
          {
            label: "Underperforming",
            value: counts.underperforming,
            cls: "text-red-400",
          },
        ].map((s) => (
          <GlassCard key={s.label} className="p-3 text-center">
            <div className={`text-2xl font-black ${s.cls}`}>{s.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {s.label}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Territory heatmap */}
      <GlassCard className="overflow-hidden">
        <div className="px-4 py-3 border-b border-white/8">
          <h4 className="text-sm font-semibold text-foreground">
            Territory Performance Heatmap
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Top 6 KPIs × 5 territories — color indicates YoY status
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-4 py-2.5 text-muted-foreground font-medium min-w-[140px]">
                  Territory
                </th>
                {topKpis.map((k) => (
                  <th
                    key={k.id}
                    className="text-center px-3 py-2.5 text-muted-foreground font-medium whitespace-nowrap"
                  >
                    {k.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TERRITORIES.map((t) => (
                <tr key={t} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground/80">
                    {t}
                  </td>
                  {topKpis.map((k) => {
                    const status = HEATMAP_DATA[t]?.[k.id] ?? "on_track";
                    return (
                      <td key={k.id} className="px-3 py-2.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-14 py-0.5 rounded text-[10px] font-bold ${
                            STATUS_CELL[status]
                          }`}
                        >
                          {STATUS_LABEL[status]}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* YoY comparison table */}
      <GlassCard>
        <div className="px-4 py-3 border-b border-white/8">
          <h4 className="text-sm font-semibold text-foreground">
            YoY Comparison — {period}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {[
                  "KPI",
                  "Prior Year",
                  "Current Target",
                  "YoY Expected",
                  "Forecasted",
                  "YoY Variance",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {YOY_TABLE_DATA.map((row, i) => (
                <tr
                  key={row.kpiId}
                  data-ocid={`pg.yoy.row.${i + 1}`}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.prior}
                  </td>
                  <td className="px-4 py-3 text-foreground/80">{row.target}</td>
                  <td className="px-4 py-3 text-orange-400 font-medium">
                    {row.yoyExpected}
                  </td>
                  <td className="px-4 py-3 text-foreground/80">
                    {row.forecast}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      row.variance.startsWith("+")
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {row.variance}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Tab 3: Operational Scorecards ──────────────────────────────────────────

const SCORECARD_DATA = [
  {
    kpiId: "kpi-renewal-revenue",
    name: "Renewal Revenue",
    weight: 30,
    score: 74,
    status: "on_track" as KPIStatus,
    trend: "up" as const,
    trendMag: 3.2,
  },
  {
    kpiId: "kpi-ai-adoption",
    name: "AI Adoption",
    weight: 10,
    score: 95,
    status: "exceeding" as KPIStatus,
    trend: "up" as const,
    trendMag: 8.1,
  },
  {
    kpiId: "kpi-pipeline-growth",
    name: "Pipeline Growth",
    weight: 15,
    score: 81,
    status: "ahead" as KPIStatus,
    trend: "up" as const,
    trendMag: 2.4,
  },
  {
    kpiId: "kpi-mdf-roi",
    name: "MDF ROI",
    weight: 8,
    score: 66,
    status: "on_track" as KPIStatus,
    trend: "stable" as const,
    trendMag: 0.5,
  },
  {
    kpiId: "kpi-forecast-accuracy",
    name: "Forecast Accuracy",
    weight: 12,
    score: 78,
    status: "on_track" as KPIStatus,
    trend: "up" as const,
    trendMag: 1.8,
  },
  {
    kpiId: "kpi-opportunity-velocity",
    name: "Opportunity Velocity",
    weight: 8,
    score: 72,
    status: "on_track" as KPIStatus,
    trend: "up" as const,
    trendMag: 4.1,
  },
  {
    kpiId: "kpi-reseller-growth",
    name: "Reseller Growth",
    weight: 7,
    score: 42,
    status: "underperforming" as KPIStatus,
    trend: "down" as const,
    trendMag: 6.2,
  },
  {
    kpiId: "kpi-distributor-activation",
    name: "Distributor Activation",
    weight: 5,
    score: 68,
    status: "on_track" as KPIStatus,
    trend: "stable" as const,
    trendMag: 1.0,
  },
  {
    kpiId: "kpi-customer-expansion",
    name: "Customer Expansion",
    weight: 3,
    score: 58,
    status: "growth_risk" as KPIStatus,
    trend: "down" as const,
    trendMag: 2.9,
  },
  {
    kpiId: "kpi-quote-conversion",
    name: "Quote Conversion",
    weight: 2,
    score: 76,
    status: "on_track" as KPIStatus,
    trend: "up" as const,
    trendMag: 1.5,
  },
];

const FILTER_OPTIONS = [
  "All Territories",
  "UK&I",
  "Nordics",
  "DACH",
  "Benelux",
  "Southern Europe",
];

function OperationalScorecardsTab() {
  const [filter, setFilter] = useState("All Territories");

  const totalScore = Math.round(
    SCORECARD_DATA.reduce((s, e) => s + (e.score * e.weight) / 100, 0),
  );

  const ringColor =
    totalScore >= 80
      ? "stroke-emerald-400"
      : totalScore >= 60
        ? "stroke-amber-400"
        : "stroke-red-400";
  const ringText =
    totalScore >= 80
      ? "text-emerald-400"
      : totalScore >= 60
        ? "text-amber-400"
        : "text-red-400";
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Operational Scorecard
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Weighted KPI attainment score — current period
          </p>
        </div>
        <select
          data-ocid="pg.scorecard.filter_select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
        >
          {FILTER_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Scorecard hero */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <GlassCard
          className="p-6 flex flex-col items-center justify-center min-w-[180px]"
          glow
        >
          <svg
            width="140"
            height="140"
            className="-rotate-90"
            aria-label="Performance score ring"
            role="img"
          >
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="10"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              className={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="-mt-2 text-center">
            <div className={`text-4xl font-black ${ringText}`}>
              {totalScore}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Operational Score
            </div>
          </div>
        </GlassCard>

        <div className="flex-1 grid grid-cols-2 gap-2">
          {[
            {
              label: "Exceeding Target",
              count: SCORECARD_DATA.filter((e) => e.status === "exceeding")
                .length,
              cls: "text-purple-400",
            },
            {
              label: "Ahead of Target",
              count: SCORECARD_DATA.filter((e) => e.status === "ahead").length,
              cls: "text-blue-400",
            },
            {
              label: "On Track",
              count: SCORECARD_DATA.filter((e) => e.status === "on_track")
                .length,
              cls: "text-emerald-400",
            },
            {
              label: "Growth Risk",
              count: SCORECARD_DATA.filter((e) => e.status === "growth_risk")
                .length,
              cls: "text-amber-400",
            },
            {
              label: "Underperforming",
              count: SCORECARD_DATA.filter(
                (e) => e.status === "underperforming",
              ).length,
              cls: "text-red-400",
            },
          ].map((s) => (
            <GlassCard key={s.label} className="p-3">
              <div className={`text-2xl font-black ${s.cls}`}>{s.count}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {s.label}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Weighted breakdown table */}
      <GlassCard>
        <div className="px-4 py-3 border-b border-white/8">
          <h4 className="text-sm font-semibold text-foreground">
            Weighted KPI Breakdown
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {[
                  "KPI",
                  "Weight",
                  "Score",
                  "Contribution",
                  "Trend",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCORECARD_DATA.map((entry, i) => {
                const contribution = (entry.score * entry.weight) / 100;
                return (
                  <tr
                    key={entry.kpiId}
                    data-ocid={`pg.scorecard.row.${i + 1}`}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {entry.name}
                    </td>
                    <td className="px-4 py-3 text-orange-400 font-semibold">
                      {entry.weight}%
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full bg-white/10"
                          style={{ width: "64px" }}
                        >
                          <div
                            className={`h-full rounded-full ${
                              entry.score >= 80
                                ? "bg-emerald-400"
                                : entry.score >= 60
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                            }`}
                            style={{ width: `${entry.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground/80">
                          {entry.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground/80 font-semibold">
                      {contribution.toFixed(1)}
                    </td>
                    <td className="px-4 py-3">
                      {entry.trend === "up" ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs">
                          <TrendingUp size={12} />+{entry.trendMag}%
                        </span>
                      ) : entry.trend === "down" ? (
                        <span className="flex items-center gap-1 text-red-400 text-xs">
                          <TrendingDown size={12} />-{entry.trendMag}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          — Stable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={entry.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Tab 4: Forecasting ──────────────────────────────────────────────────────

const FORECAST_BARS = [
  {
    name: "Renewal Revenue",
    actual: 82,
    forecast: 92,
    target: 100,
    unit: "% of £3M target",
  },
  {
    name: "Pipeline Growth",
    actual: 78,
    forecast: 100,
    target: 100,
    unit: "% of £6.4M target",
  },
  {
    name: "AI Adoption",
    actual: 71,
    forecast: 109,
    target: 100,
    unit: "% of 65% target",
  },
  {
    name: "MDF ROI",
    actual: 80,
    forecast: 94,
    target: 100,
    unit: "% of 3.5x target",
  },
  {
    name: "Forecast Accuracy",
    actual: 85,
    forecast: 97,
    target: 100,
    unit: "% of 90% target",
  },
  {
    name: "Reseller Growth",
    actual: 52,
    forecast: 67,
    target: 100,
    unit: "% of £1.42M target",
  },
];

function ForecastingTab() {
  const { forgeInsights } = useKPIGovernance();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Forecasting Intelligence
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Current period forecast vs target — and ForgeAI operational insights
        </p>
      </div>

      {/* Forecast bars */}
      <GlassCard className="p-5">
        <h4 className="text-sm font-semibold text-foreground mb-4">
          KPI Forecast vs Target
        </h4>
        <div className="space-y-5">
          {FORECAST_BARS.map((b) => (
            <div key={b.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground/80">
                  {b.name}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {b.unit}
                </span>
              </div>
              <div className="space-y-1">
                {/* Actual */}
                <div className="flex items-center gap-2">
                  <span className="w-14 text-[10px] text-muted-foreground/70">
                    Actual
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-orange-500/70"
                      style={{ width: `${Math.min(100, b.actual)}%` }}
                    />
                  </div>
                  <span className="w-8 text-[10px] text-right text-orange-400 font-medium">
                    {b.actual}%
                  </span>
                </div>
                {/* Forecast */}
                <div className="flex items-center gap-2">
                  <span className="w-14 text-[10px] text-muted-foreground/70">
                    Forecast
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        b.forecast >= 100
                          ? "bg-emerald-500/70"
                          : "bg-blue-500/70"
                      }`}
                      style={{ width: `${Math.min(100, b.forecast)}%` }}
                    />
                  </div>
                  <span
                    className={`w-8 text-[10px] text-right font-medium ${
                      b.forecast >= 100 ? "text-emerald-400" : "text-blue-400"
                    }`}
                  >
                    {b.forecast}%
                  </span>
                </div>
                {/* Target line */}
                <div className="flex items-center gap-2">
                  <span className="w-14 text-[10px] text-muted-foreground/70">
                    Target
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/20"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <span className="w-8 text-[10px] text-right text-muted-foreground">
                    100%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ForgeAI insights panel */}
      <GlassCard className="p-5" glow>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="text-[10px] text-orange-400 font-bold">AI</span>
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            ForgeAI Performance Insights
          </h4>
          <span className="ml-auto text-[10px] text-orange-400/70">
            {forgeInsights.length} active signals
          </span>
        </div>
        <div className="space-y-3">
          {forgeInsights.slice(0, 8).map((insight) => (
            <div
              key={insight.id}
              data-ocid={`pg.forecasting.insight.${insight.id}`}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                insight.severity === "critical"
                  ? "bg-red-500/5 border-red-500/20"
                  : insight.severity === "warning"
                    ? "bg-amber-500/5 border-amber-500/20"
                    : insight.severity === "positive"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-white/[0.03] border-white/8"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {insight.severity === "critical" ? (
                  <AlertTriangle size={13} className="text-red-400" />
                ) : insight.severity === "warning" ? (
                  <AlertTriangle size={13} className="text-amber-400" />
                ) : insight.severity === "positive" ? (
                  <TrendingUp size={13} className="text-emerald-400" />
                ) : (
                  <BarChart3 size={13} className="text-blue-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <InsightTypeBadge type={insight.type} />
                  {insight.territory && (
                    <span className="text-[10px] text-muted-foreground/70 border border-white/10 px-1.5 py-0.5 rounded">
                      {insight.territory}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          ))}
          {forgeInsights.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No ForgeAI insights available for this period.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Tab 5: Governance & Audit ───────────────────────────────────────────────

const CHANGE_TYPE_OPTIONS = [
  "all",
  "created",
  "updated",
  "disabled",
  "enabled",
  "weight_changed",
  "formula_changed",
  "restored",
] as const;

const DATE_RANGE_OPTIONS = ["all time", "last 7d", "last 30d"] as const;

type ChangeTypeFilter = (typeof CHANGE_TYPE_OPTIONS)[number];
type DateRangeFilter = (typeof DATE_RANGE_OPTIONS)[number];

function GovernanceAuditTab() {
  const { auditLog, kpiDefinitions } = useKPIGovernance();
  const [filterType, setFilterType] = useState<ChangeTypeFilter>("all");
  const [filterKpi, setFilterKpi] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<DateRangeFilter>("all time");

  const now = Date.now();
  const filtered = auditLog.filter((e: KPIAuditEntry) => {
    if (filterType !== "all" && e.changeType !== filterType) return false;
    if (filterKpi !== "all" && e.kpiId !== filterKpi) return false;
    if (filterDate === "last 7d") {
      if (now - new Date(e.changedAt).getTime() > 7 * 24 * 3600 * 1000)
        return false;
    } else if (filterDate === "last 30d") {
      if (now - new Date(e.changedAt).getTime() > 30 * 24 * 3600 * 1000)
        return false;
    }
    return true;
  });

  const thisWeek = auditLog.filter(
    (e: KPIAuditEntry) =>
      now - new Date(e.changedAt).getTime() <= 7 * 24 * 3600 * 1000,
  ).length;

  const kpiModCount: Record<string, number> = {};
  for (const e of auditLog) {
    kpiModCount[e.kpiName] = (kpiModCount[e.kpiName] ?? 0) + 1;
  }
  const mostModified =
    Object.entries(kpiModCount).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Governance & Audit Log
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Full change history for all KPI definitions — persistent across
          sessions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Changes",
            value: auditLog.length,
            icon: Shield,
            cls: "text-blue-400",
          },
          {
            label: "This Week",
            value: thisWeek,
            icon: BarChart3,
            cls: "text-orange-400",
          },
          {
            label: "Most Modified",
            value: mostModified,
            icon: Award,
            cls: "text-purple-400",
          },
        ].map((s) => (
          <GlassCard key={s.label} className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={13} className={s.cls} />
              <span className="text-[11px] text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="text-lg font-bold text-foreground truncate">
              {s.value}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          data-ocid="pg.audit.filter_type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as ChangeTypeFilter)}
          className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
        >
          {CHANGE_TYPE_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Types" : c.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select
          data-ocid="pg.audit.filter_kpi"
          value={filterKpi}
          onChange={(e) => setFilterKpi(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
        >
          <option value="all">All KPIs</option>
          {kpiDefinitions.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name}
            </option>
          ))}
        </select>
        <select
          data-ocid="pg.audit.filter_date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value as DateRangeFilter)}
          className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
        >
          {DATE_RANGE_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Audit log table */}
      <GlassCard>
        {filtered.length === 0 ? (
          <div
            data-ocid="pg.audit.empty_state"
            className="text-center py-12 text-muted-foreground text-sm"
          >
            No audit entries match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {[
                    "Timestamp",
                    "KPI Name",
                    "Change Type",
                    "Changed By",
                    "Previous",
                    "New Value",
                    "Notes",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry: KPIAuditEntry, i: number) => (
                  <tr
                    key={entry.id}
                    data-ocid={`pg.audit.row.${i + 1}`}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(entry.changedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {entry.kpiName}
                    </td>
                    <td className="px-4 py-3">
                      <AuditChangeBadge changeType={entry.changeType} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {entry.changedBy}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[100px] truncate">
                      {entry.previousValue ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground/80 max-w-[100px] truncate">
                      {entry.newValue ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">
                      {entry.notes ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        data-ocid={`pg.audit.rollback_button.${i + 1}`}
                        onClick={() =>
                          toast.info(
                            `Rollback to ${new Date(entry.changedAt).toLocaleDateString()} version confirmed — preview mode only`,
                          )
                        }
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-purple-400 border border-purple-500/20 hover:bg-purple-500/10 transition-colors whitespace-nowrap"
                      >
                        <History size={10} />
                        Rollback
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TABS: {
  id: PerfTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: "kpi-definitions", label: "KPI Definitions", icon: Target },
  { id: "yoy-tracking", label: "YoY Tracking", icon: TrendingUp },
  { id: "scorecards", label: "Operational Scorecards", icon: Award },
  { id: "forecasting", label: "Forecasting", icon: BarChart3 },
  { id: "governance", label: "Governance & Audit", icon: Shield },
];

export function PerformanceGovernanceModule() {
  const [activeTab, setActiveTab] = useState<PerfTab>("kpi-definitions");

  return (
    <div className="space-y-0">
      {/* Module header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500/20 border border-orange-500/30">
            <BarChart3 size={15} className="text-orange-400" />
          </div>
          <h2 className="text-lg font-bold text-foreground font-display">
            Performance Governance
          </h2>
        </div>
        <p className="text-xs text-muted-foreground ml-11">
          Define, weight, and govern your operational KPI framework — YoY growth
          intelligence, scorecards, and ForgeAI performance insights
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-0 border-b border-white/10 mb-5 overflow-x-auto"
        data-ocid="pg.tabs"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-ocid={`pg.${tab.id}.tab`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon
              size={13}
              className={activeTab === tab.id ? "text-orange-400" : ""}
            />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "kpi-definitions" && <KPIDefinitionsTab />}
        {activeTab === "yoy-tracking" && <YoYTrackingTab />}
        {activeTab === "scorecards" && <OperationalScorecardsTab />}
        {activeTab === "forecasting" && <ForecastingTab />}
        {activeTab === "governance" && <GovernanceAuditTab />}
      </div>
    </div>
  );
}
