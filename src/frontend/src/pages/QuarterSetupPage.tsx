import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Info,
  Lock,
  Save,
  Settings,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../AppContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useTargets } from "../hooks/useTargets";
import type { FiscalYearType, QuarterDef } from "../types";
import { formatDate } from "../utils/channelforge";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuarterFormState {
  quarterId: string;
  name: string;
  startDate: string;
  endDate: string;
}

type ValidationError =
  | { type: "end_before_start" }
  | { type: "overlap"; conflictWith: string }
  | { type: "gap"; gapDays: number }
  | { type: "missing_field"; field: string };

interface QuarterValidation {
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ─── Validation helpers ───────────────────────────────────────────────────────

function validateQuarters(
  quarters: QuarterFormState[],
): Record<string, QuarterValidation> {
  const result: Record<string, QuarterValidation> = {};

  for (let i = 0; i < quarters.length; i++) {
    const q = quarters[i];
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!q.name.trim()) errors.push({ type: "missing_field", field: "name" });
    if (!q.startDate)
      errors.push({ type: "missing_field", field: "start date" });
    if (!q.endDate) errors.push({ type: "missing_field", field: "end date" });

    if (q.startDate && q.endDate) {
      const start = new Date(q.startDate).getTime();
      const end = new Date(q.endDate).getTime();
      if (end < start) errors.push({ type: "end_before_start" });

      // Check overlap with other quarters
      for (let j = 0; j < quarters.length; j++) {
        if (j === i) continue;
        const other = quarters[j];
        if (!other.startDate || !other.endDate) continue;
        const oStart = new Date(other.startDate).getTime();
        const oEnd = new Date(other.endDate).getTime();
        if (start <= oEnd && end >= oStart) {
          errors.push({
            type: "overlap",
            conflictWith: other.name || other.quarterId,
          });
          break;
        }
      }

      // Warn about gaps between consecutive quarters
      if (i > 0) {
        const prev = quarters[i - 1];
        if (prev.endDate) {
          const prevEnd = new Date(prev.endDate).getTime();
          const gapDays = Math.round((start - prevEnd) / 86_400_000) - 1;
          if (gapDays > 0) {
            warnings.push({ type: "gap", gapDays });
          }
        }
      }
    }

    result[q.quarterId] = { errors, warnings };
  }

  return result;
}

function buildCalendarDefaults(): QuarterFormState[] {
  const y = new Date().getFullYear();
  return [
    {
      quarterId: "Q1",
      name: `Q1 FY${y}`,
      startDate: `${y}-01-01`,
      endDate: `${y}-03-31`,
    },
    {
      quarterId: "Q2",
      name: `Q2 FY${y}`,
      startDate: `${y}-04-01`,
      endDate: `${y}-06-30`,
    },
    {
      quarterId: "Q3",
      name: `Q3 FY${y}`,
      startDate: `${y}-07-01`,
      endDate: `${y}-09-30`,
    },
    {
      quarterId: "Q4",
      name: `Q4 FY${y}`,
      startDate: `${y}-10-01`,
      endDate: `${y}-12-31`,
    },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Breadcrumb() {
  return (
    <nav
      className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5"
      aria-label="breadcrumb"
    >
      <Link to="/admin" className="hover:text-foreground transition-colors">
        Admin
      </Link>
      <ChevronRight className="w-3 h-3" />
      <span className="text-foreground font-medium">Quarter Configuration</span>
    </nav>
  );
}

function FiscalTypeToggle({
  value,
  onChange,
  disabled,
}: {
  value: FiscalYearType;
  onChange: (t: FiscalYearType) => void;
  disabled: boolean;
}) {
  const options: {
    value: FiscalYearType;
    label: string;
    description: string;
  }[] = [
    {
      value: "CalendarYear",
      label: "Calendar Year",
      description: "Jan 1 – Dec 31 split into standard quarters",
    },
    {
      value: "CustomFiscal",
      label: "Custom Fiscal Year",
      description: "Define exact start and end dates per quarter",
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      role="radiogroup"
      aria-label="Fiscal year type"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            data-ocid={`quarter_setup.fiscal_type_${opt.value.toLowerCase()}`}
            className={[
              "flex items-start gap-3 p-4 rounded-lg border text-left transition-all duration-150",
              active
                ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                : "border-border bg-card hover:border-primary/30 hover:bg-secondary/40",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
          >
            <div
              className={[
                "mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                active ? "border-primary" : "border-muted-foreground",
              ].join(" ")}
            >
              {active && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div className="min-w-0">
              <p
                className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}
              >
                {opt.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function QuarterCard({
  quarter,
  validation,
  onChange,
  disabled,
  calendarMode,
}: {
  quarter: QuarterFormState;
  validation: QuarterValidation;
  onChange: (updated: QuarterFormState) => void;
  disabled: boolean;
  calendarMode: boolean;
}) {
  const hasError = validation.errors.length > 0;
  const hasWarning = validation.warnings.length > 0;

  const borderClass = hasError
    ? "border-destructive ring-1 ring-destructive/40"
    : hasWarning
      ? "border-yellow-500/60 ring-1 ring-yellow-500/20"
      : "border-border";

  return (
    <div
      className={`bg-card rounded-xl border p-5 flex flex-col gap-4 ${borderClass}`}
      data-ocid={`quarter_setup.${quarter.quarterId.toLowerCase()}_card`}
    >
      {/* Quarter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary/15 text-primary text-xs font-bold font-mono">
            {quarter.quarterId}
          </span>
          <span className="text-sm font-semibold text-foreground">
            Quarter {quarter.quarterId.replace("Q", "")}
          </span>
        </div>
        {hasError && (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <AlertTriangle className="w-3.5 h-3.5" />
            Fix required
          </span>
        )}
        {!hasError && hasWarning && (
          <span className="flex items-center gap-1 text-xs text-yellow-400">
            <Info className="w-3.5 h-3.5" />
            Date gap
          </span>
        )}
      </div>

      {/* Quarter name */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor={`${quarter.quarterId}-name`}
          className="text-xs text-muted-foreground uppercase tracking-wider"
        >
          Quarter Label
        </Label>
        <Input
          id={`${quarter.quarterId}-name`}
          value={quarter.name}
          onChange={(e) => onChange({ ...quarter, name: e.target.value })}
          disabled={disabled}
          placeholder={`e.g. ${quarter.quarterId} FY2025`}
          className="h-9 text-sm bg-input border-border focus:border-primary font-mono"
          data-ocid={`quarter_setup.${quarter.quarterId.toLowerCase()}_name_input`}
        />
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor={`${quarter.quarterId}-start`}
            className="text-xs text-muted-foreground uppercase tracking-wider"
          >
            Start Date
          </Label>
          <Input
            id={`${quarter.quarterId}-start`}
            type="date"
            value={quarter.startDate}
            onChange={(e) =>
              onChange({ ...quarter, startDate: e.target.value })
            }
            disabled={disabled || calendarMode}
            className="h-9 text-sm bg-input border-border focus:border-primary"
            data-ocid={`quarter_setup.${quarter.quarterId.toLowerCase()}_start_input`}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor={`${quarter.quarterId}-end`}
            className="text-xs text-muted-foreground uppercase tracking-wider"
          >
            End Date
          </Label>
          <Input
            id={`${quarter.quarterId}-end`}
            type="date"
            value={quarter.endDate}
            onChange={(e) => onChange({ ...quarter, endDate: e.target.value })}
            disabled={disabled || calendarMode}
            className="h-9 text-sm bg-input border-border focus:border-primary"
            data-ocid={`quarter_setup.${quarter.quarterId.toLowerCase()}_end_input`}
          />
        </div>
      </div>

      {/* Validation messages */}
      {validation.errors.map((err, idx) => (
        <p
          key={`error-${err.type}-${idx}`}
          className="flex items-center gap-1.5 text-xs text-destructive mt-1"
        >
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {err.type === "end_before_start" &&
            "End date cannot be before start date"}
          {err.type === "overlap" && `Date conflict with ${err.conflictWith}`}
          {err.type === "missing_field" && `Missing required ${err.field}`}
        </p>
      ))}
      {validation.warnings.map((warn, idx) => (
        <p
          key={`warning-${warn.type}-${idx}`}
          className="flex items-center gap-1.5 text-xs text-yellow-400 mt-1"
        >
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          {warn.type === "gap" &&
            `${warn.gapDays} day gap before previous quarter`}
        </p>
      ))}

      {/* Calendar mode lock message */}
      {calendarMode && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <Lock className="w-3.5 h-3.5" />
          Dates auto-set by Calendar Year mode
        </p>
      )}
    </div>
  );
}

// ─── Permission-denied state ─────────────────────────────────────────────────

function PermissionDenied() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-24 text-center"
      data-ocid="quarter_setup.permission_denied"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Lock className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">
          Access Restricted
        </p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Quarter configuration is managed by your Vendor Primary Admin. Contact
          them to make changes.
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function QuarterSetupPage() {
  const { userProfile, isPrimaryAdmin, hasPermission, refreshFiscalYear } =
    useApp();
  const { fiscalYearConfig, saveFiscalYearConfig } = useTargets();

  const canEdit =
    isPrimaryAdmin() ||
    (userProfile?.role === "VendorSecondaryAdmin" &&
      hasPermission("ManageQuarterSetup"));

  const [fiscalType, setFiscalType] = useState<FiscalYearType>("CalendarYear");
  const [quarters, setQuarters] = useState<QuarterFormState[]>(
    buildCalendarDefaults(),
  );
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialise form from loaded config
  useEffect(() => {
    if (initialized) return;
    if (fiscalYearConfig && fiscalYearConfig.quarters.length === 4) {
      setFiscalType(fiscalYearConfig.fiscalYearType);
      setQuarters(
        fiscalYearConfig.quarters.map((q: QuarterDef) => ({
          quarterId: q.quarterId,
          name: q.name,
          startDate: q.startDate,
          endDate: q.endDate,
        })),
      );
      setInitialized(true);
    } else if (fiscalYearConfig !== undefined) {
      // Config loaded but null or partial — use defaults
      setInitialized(true);
    }
  }, [fiscalYearConfig, initialized]);

  // When Calendar Year is selected, auto-fill dates
  const handleFiscalTypeChange = useCallback((type: FiscalYearType) => {
    setFiscalType(type);
    if (type === "CalendarYear") {
      const defaults = buildCalendarDefaults();
      setQuarters((prev) =>
        prev.map((q, i) => ({
          ...q,
          startDate: defaults[i].startDate,
          endDate: defaults[i].endDate,
        })),
      );
    }
    setDirty(true);
  }, []);

  const handleQuarterChange = useCallback((updated: QuarterFormState) => {
    setQuarters((prev) =>
      prev.map((q) => (q.quarterId === updated.quarterId ? updated : q)),
    );
    setDirty(true);
  }, []);

  const validations = useMemo(() => validateQuarters(quarters), [quarters]);

  const allValid = useMemo(
    () =>
      Object.values(validations).every(
        (v) =>
          !v.errors.some(
            (e) =>
              e.type === "end_before_start" ||
              e.type === "overlap" ||
              e.type === "missing_field",
          ),
      ),
    [validations],
  );

  const totalWarnings = useMemo(
    () =>
      Object.values(validations).reduce((acc, v) => acc + v.warnings.length, 0),
    [validations],
  );

  async function handleSave() {
    if (!allValid || !dirty || saving) return;
    setSaving(true);
    try {
      const quarterDefs: QuarterDef[] = quarters.map((q) => ({
        quarterId: q.quarterId,
        name: q.name.trim(),
        startDate: q.startDate,
        endDate: q.endDate,
      }));
      const success = await saveFiscalYearConfig(fiscalType, quarterDefs);
      if (success) {
        await refreshFiscalYear();
        setDirty(false);
        toast.success("Quarter configuration saved", {
          description: "All reports and dashboards will now use these dates.",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        });
      } else {
        toast.error("Failed to save configuration", {
          description: "Please try again or contact support.",
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  function handleSetupNow() {
    setQuarters(buildCalendarDefaults());
    setFiscalType("CalendarYear");
    setDirty(true);
    setInitialized(true);
  }

  // Last-updated metadata
  const lastUpdatedMeta = useMemo(() => {
    if (!fiscalYearConfig || fiscalYearConfig.updatedAt === BigInt(0))
      return null;
    return {
      by: fiscalYearConfig.updatedBy || "Unknown",
      at: formatDate(fiscalYearConfig.updatedAt),
    };
  }, [fiscalYearConfig]);

  if (!canEdit)
    return (
      <Layout>
        <PermissionDenied />
      </Layout>
    );

  // No config yet — show initial empty state
  if (!initialized) {
    return (
      <Layout>
        <Breadcrumb />
        <div
          className="flex flex-col items-center justify-center gap-6 py-24 text-center"
          data-ocid="quarter_setup.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              No fiscal year configured yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Define your quarter dates so all reports and dashboards align to
              your vendor's fiscal calendar.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleSetupNow}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="quarter_setup.setup_now_button"
          >
            <Settings className="w-4 h-4 mr-2" />
            Set up fiscal year now
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Breadcrumb />

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-xl font-bold text-foreground font-display tracking-tight">
            Quarter Configuration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define your fiscal year structure. All reports and dashboards use
            these dates.
          </p>
          {lastUpdatedMeta && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3" />
              Last updated by{" "}
              <span className="font-medium text-foreground">
                {lastUpdatedMeta.by}
              </span>{" "}
              on {lastUpdatedMeta.at}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {totalWarnings > 0 && (
            <Badge
              variant="outline"
              className="text-yellow-400 border-yellow-500/40 bg-yellow-500/10 text-xs gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              {totalWarnings} gap warning{totalWarnings > 1 ? "s" : ""}
            </Badge>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={!dirty || !allValid || saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            data-ocid="quarter_setup.save_button"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? "Saving…" : "Save Configuration"}
          </Button>
        </div>
      </div>

      {/* ── Fiscal year type ── */}
      <section className="mb-7" data-ocid="quarter_setup.fiscal_type_section">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">
            Fiscal Year Structure
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Calendar Year auto-fills standard quarter dates. Custom Fiscal lets
            you set any date range.
          </p>
        </div>
        <FiscalTypeToggle
          value={fiscalType}
          onChange={handleFiscalTypeChange}
          disabled={saving}
        />
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border mb-7" />

      {/* ── Quarter cards ── */}
      <section data-ocid="quarter_setup.quarters_section">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Quarter Date Ranges
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {fiscalType === "CalendarYear"
                ? "Dates are locked to standard calendar quarters. Switch to Custom Fiscal to edit them."
                : "Set precise start and end dates for each quarter. Gaps between quarters will generate warnings."}
            </p>
          </div>
          {!allValid && (
            <span className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="w-3.5 h-3.5" />
              Fix errors to save
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quarters.map((q) => (
            <QuarterCard
              key={q.quarterId}
              quarter={q}
              validation={
                validations[q.quarterId] ?? { errors: [], warnings: [] }
              }
              onChange={handleQuarterChange}
              disabled={saving}
              calendarMode={fiscalType === "CalendarYear"}
            />
          ))}
        </div>
      </section>

      {/* ── Info banner ── */}
      <div className="mt-7 flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border">
        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Quarter date changes take effect immediately across all reports,
          dashboards, and QTD calculations. Changes are logged in the admin
          audit trail. Only Vendor Primary Admins and permitted Secondary Admins
          can modify these settings.
        </p>
      </div>
    </Layout>
  );
}

// ─── Internal layout wrapper (uses outer Layout only for non-shell paths) ─────

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-4xl mx-auto">{children}</div>;
}
