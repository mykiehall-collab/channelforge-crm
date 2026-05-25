import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Info,
  Pencil,
  RefreshCcw,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { useTargets } from "../hooks/useTargets";
import type {
  TargetCalculationType,
  TargetMeasure,
  TargetMeasureId,
} from "../types";
import { formatDate } from "../utils/channelforge";

// ─── Calculation type badge config ────────────────────────────────────────────
const CALC_BADGE: Record<
  TargetCalculationType,
  { label: string; cls: string }
> = {
  Revenue: {
    label: "Revenue",
    cls: "bg-primary/20 text-primary border-primary/30",
  },
  Count: {
    label: "Count",
    cls: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  Percentage: {
    label: "Percentage",
    cls: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  Weighted: {
    label: "Weighted",
    cls: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  },
};

// Ordered calculation types for each default measure slot
const DEFAULT_CALC_TYPES: Record<TargetMeasureId, TargetCalculationType> = {
  Measure1: "Revenue",
  Measure2: "Revenue",
  Measure3: "Revenue",
  Measure4: "Count",
  Measure5: "Revenue",
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow({ index }: { index: number }) {
  return (
    <tr className={index % 2 === 0 ? "bg-card/40" : "bg-background/60"}>
      <td className="px-4 py-3 text-center">
        <Skeleton className="h-4 w-4 mx-auto rounded" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-20 rounded" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-36 rounded" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-40 rounded" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-20 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-8 w-16 rounded" />
      </td>
    </tr>
  );
}

// ─── Measure row ──────────────────────────────────────────────────────────────
interface MeasureRowProps {
  measure: TargetMeasure;
  index: number;
  isEditing: boolean;
  canEdit: boolean;
  onEdit: (id: TargetMeasureId) => void;
  onSave: (id: TargetMeasureId, value: string) => Promise<void>;
  onCancel: () => void;
  onReset: (id: TargetMeasureId) => Promise<void>;
  saving: boolean;
}

function MeasureRow({
  measure,
  index,
  isEditing,
  canEdit,
  onEdit,
  onSave,
  onCancel,
  onReset,
  saving,
}: MeasureRowProps) {
  const displayName = measure.customName ?? measure.defaultName;
  const hasCustom = !!(
    measure.customName && measure.customName !== measure.defaultName
  );
  const [editValue, setEditValue] = useState(displayName);
  const inputRef = useRef<HTMLInputElement>(null);
  const calcType =
    measure.calculationType ?? DEFAULT_CALC_TYPES[measure.measureId];
  const badge = CALC_BADGE[calcType];
  const segmentLabel = `Segment ${index + 1}`;

  useEffect(() => {
    if (isEditing) {
      setEditValue(displayName);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isEditing, displayName]);

  const validationError =
    isEditing && (editValue.trim().length === 0 || editValue.trim().length > 50)
      ? editValue.trim().length === 0
        ? "Name cannot be empty"
        : "Name must be 50 characters or fewer"
      : null;

  const rowBg = index % 2 === 0 ? "bg-card/40" : "bg-background/60";
  const editingBg = isEditing ? "bg-primary/5 ring-1 ring-primary/20" : "";

  return (
    <tr
      className={`${rowBg} ${editingBg} transition-colors duration-150 hover:bg-secondary/30`}
      data-ocid={`target_measures.row.${index + 1}`}
    >
      {/* # */}
      <td className="px-4 py-3 text-center">
        <span className="text-xs font-mono text-muted-foreground font-semibold">
          {index + 1}
        </span>
      </td>

      {/* Measure Slot */}
      <td className="px-4 py-3">
        <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
          {segmentLabel}
        </span>
      </td>

      {/* Default Name */}
      <td className="px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {measure.defaultName}
        </span>
      </td>

      {/* Current Name */}
      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !validationError)
                  onSave(measure.measureId, editValue.trim());
                if (e.key === "Escape") onCancel();
              }}
              className="h-8 text-sm bg-input border-primary/50 focus:border-primary text-foreground max-w-[200px]"
              maxLength={51}
              data-ocid={`target_measures.name_input.${index + 1}`}
            />
            {validationError && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationError}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${hasCustom ? "text-primary" : "text-foreground"}`}
            >
              {displayName}
            </span>
            {hasCustom && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium uppercase tracking-wide">
                Custom
              </span>
            )}
          </div>
        )}
      </td>

      {/* Calculation Type */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border font-medium ${badge.cls}`}
        >
          {badge.label}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              className="h-7 px-2.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() =>
                !validationError && onSave(measure.measureId, editValue.trim())
              }
              disabled={!!validationError || saving}
              data-ocid={`target_measures.save_button.${index + 1}`}
            >
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={onCancel}
              disabled={saving}
              data-ocid={`target_measures.cancel_button.${index + 1}`}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : canEdit ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border"
              onClick={() => onEdit(measure.measureId)}
              data-ocid={`target_measures.edit_button.${index + 1}`}
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit
            </Button>
            {hasCustom && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors"
                onClick={() => onReset(measure.measureId)}
                data-ocid={`target_measures.reset_button.${index + 1}`}
              >
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </span>
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/40">—</span>
        )}
      </td>
    </tr>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function TargetMeasuresPage() {
  const navigate = useNavigate();
  const { isPrimaryAdmin } = useApp();
  const { measureConfig, loading, updateMeasureName, refreshAll } =
    useTargets();

  const canEdit = isPrimaryAdmin();
  const [editingId, setEditingId] = useState<TargetMeasureId | null>(null);
  const [saving, setSaving] = useState(false);

  // Ensure measures always cover all 5 slots even if config is partial
  const DEFAULT_MEASURES: TargetMeasure[] = [
    {
      measureId: "Measure1",
      defaultName: "Renewal Revenue",
      customName: null,
      calculationType: "Revenue",
    },
    {
      measureId: "Measure2",
      defaultName: "New Business Revenue",
      customName: null,
      calculationType: "Revenue",
    },
    {
      measureId: "Measure3",
      defaultName: "Pipeline Created",
      customName: null,
      calculationType: "Revenue",
    },
    {
      measureId: "Measure4",
      defaultName: "Deal Registrations Approved",
      customName: null,
      calculationType: "Count",
    },
    {
      measureId: "Measure5",
      defaultName: "Closed Won Revenue",
      customName: null,
      calculationType: "Revenue",
    },
  ];

  const measures: TargetMeasure[] = measureConfig
    ? DEFAULT_MEASURES.map((def) => {
        const found = measureConfig.measures.find(
          (m) => m.measureId === def.measureId,
        );
        return found ?? def;
      })
    : DEFAULT_MEASURES;

  const handleEdit = useCallback((id: TargetMeasureId) => {
    setEditingId(id);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleSave = useCallback(
    async (id: TargetMeasureId, value: string) => {
      if (!value.trim()) return;
      setSaving(true);
      try {
        const ok = await updateMeasureName(id, value.trim());
        if (ok) {
          toast.success("Measure updated", {
            description: "Segment label saved successfully.",
          });
          setEditingId(null);
          await refreshAll();
        } else {
          toast.error("Failed to update measure", {
            description: "Please try again.",
          });
        }
      } finally {
        setSaving(false);
      }
    },
    [updateMeasureName, refreshAll],
  );

  const handleReset = useCallback(
    async (id: TargetMeasureId) => {
      const def = DEFAULT_MEASURES.find((m) => m.measureId === id);
      if (!def) return;
      setSaving(true);
      try {
        const ok = await updateMeasureName(id, def.defaultName);
        if (ok) {
          toast.success("Measure reset to default", {
            description: `"${def.defaultName}" restored.`,
          });
          await refreshAll();
        } else {
          toast.error("Failed to reset measure");
        }
      } finally {
        setSaving(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateMeasureName, refreshAll],
  );

  const lastUpdatedText =
    measureConfig?.updatedAt && measureConfig.updatedAt > BigInt(0)
      ? `Last updated by ${measureConfig.updatedBy || "Admin"} on ${formatDate(measureConfig.updatedAt)}`
      : null;

  return (
    <div className="min-h-full bg-background" data-ocid="target_measures.page">
      {/* ── Page header ── */}
      <div className="border-b border-border bg-card px-6 py-5">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            className="hover:text-foreground transition-colors"
            onClick={() => navigate({ to: "/admin" })}
            data-ocid="target_measures.breadcrumb_admin"
          >
            Admin
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Target Measures</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-display font-semibold text-foreground tracking-tight">
              Target Segment Measures
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Rename the five measures used to track performance across your
              channel. These labels appear on all dashboards, reports, and
              targets.
            </p>
            {lastUpdatedText && (
              <p className="text-xs text-muted-foreground/70 mt-1.5 font-mono">
                {lastUpdatedText}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={refreshAll}
            data-ocid="target_measures.refresh_button"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-6 py-6 space-y-5 max-w-5xl">
        {/* Info card */}
        <div
          className="flex items-start gap-3 rounded-md border border-border bg-card px-4 py-3.5 border-l-4"
          style={{ borderLeftColor: "oklch(var(--primary))" }}
          data-ocid="target_measures.info_card"
        >
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            These labels are used across your{" "}
            <span className="text-foreground font-medium">QTD Dashboard</span>,{" "}
            <span className="text-foreground font-medium">reports</span>, and
            all{" "}
            <span className="text-foreground font-medium">
              target assignments
            </span>
            . Renaming a measure updates it everywhere immediately.
          </p>
        </div>

        {/* Table */}
        <div
          className="rounded-md border border-border overflow-hidden"
          data-ocid="target_measures.table"
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border">
                <th className="px-4 py-2.5 text-left w-10">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    #
                  </span>
                </th>
                <th className="px-4 py-2.5 text-left w-28">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Slot
                  </span>
                </th>
                <th className="px-4 py-2.5 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Default Name
                  </span>
                </th>
                <th className="px-4 py-2.5 text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Current Name
                  </span>
                </th>
                <th className="px-4 py-2.5 text-left w-36">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Calc Type
                  </span>
                </th>
                <th className="px-4 py-2.5 text-left w-40">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading
                ? ["s0", "s1", "s2", "s3", "s4"].map((sk, i) => (
                    <SkeletonRow key={`skeleton-${sk}`} index={i} />
                  ))
                : measures.map((m, i) => (
                    <MeasureRow
                      key={m.measureId}
                      measure={m}
                      index={i}
                      isEditing={editingId === m.measureId}
                      canEdit={canEdit}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onReset={handleReset}
                      saving={saving}
                    />
                  ))}
            </tbody>
          </table>
        </div>

        {/* Access control notice (read-only view) */}
        {!canEdit && (
          <div
            className="flex items-center gap-2.5 rounded border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground"
            data-ocid="target_measures.readonly_notice"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-muted-foreground/60" />
            Only the{" "}
            <span className="text-foreground font-medium mx-1">
              Vendor Primary Admin
            </span>{" "}
            can rename measures.
          </div>
        )}

        {/* Audit trail notice */}
        <div
          className="flex items-center gap-2 text-xs text-muted-foreground/70"
          data-ocid="target_measures.audit_notice"
        >
          <ClipboardList className="w-3.5 h-3.5 shrink-0" />
          All measure renames are logged in the{" "}
          <button
            type="button"
            className="underline underline-offset-2 hover:text-primary transition-colors"
            onClick={() => navigate({ to: "/admin" })}
            data-ocid="target_measures.audit_log_link"
          >
            Audit Log
          </button>
          .
        </div>
      </div>
    </div>
  );
}
