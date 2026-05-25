import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Hash,
  Info,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  CustomerIdAuditEntry,
  CustomerIdFormatRule,
  CustomerIdFormatRuleInput,
} from "../backend";
import { CustomerIdNumberSequencing } from "../backend";
import { useActor } from "../hooks/useActor";
import { formatDate } from "../utils/channelforge";

const TOKEN_BUTTONS = [
  { label: "+ Prefix", token: "{PREFIX}", tooltip: "Static prefix e.g. UK" },
  { label: "+ Region", token: "{REGION}", tooltip: "Region code e.g. LON" },
  {
    label: "+ Sequential",
    token: "{SEQUENTIAL}",
    tooltip: "Auto-incrementing number",
  },
  {
    label: "+ Digits:N",
    token: "{DIGITS:4}",
    tooltip: "Fixed-length digit block",
  },
  {
    label: "+ Alpha:N",
    token: "{ALPHANUMERIC:4}",
    tooltip: "Fixed alphanumeric block",
  },
  { label: "+ Custom", token: "{CUSTOM}", tooltip: "Custom segment" },
];

const EXAMPLE_REGIONS = ["LON", "NOR", "MAN", "NYC", "BER"];
const EXAMPLE_NUMBERS = ["000145", "000912", "001033", "002441"];

function generatePreview(
  pattern: string,
  regionRules: string[],
  prefixRules: string,
): string[] {
  const regions =
    regionRules.length > 0
      ? regionRules.slice(0, 3)
      : EXAMPLE_REGIONS.slice(0, 3);
  return regions.slice(0, 3).map((region, i) => {
    let id = pattern;
    id = id.replace("{PREFIX}", prefixRules || "UK");
    id = id.replace("{REGION}", region);
    id = id.replace("{SEQUENTIAL}", EXAMPLE_NUMBERS[i] ?? "000001");
    id = id.replace(/{DIGITS:\d+}/g, (match) => {
      const n = Number.parseInt(
        match.replace("{DIGITS:", "").replace("}", ""),
        10,
      );
      return String(Math.floor(Math.random() * 10 ** n))
        .padStart(n, "0")
        .slice(0, n);
    });
    id = id.replace(/{ALPHANUMERIC:\d+}/g, (match) => {
      const n = Number.parseInt(
        match.replace("{ALPHANUMERIC:", "").replace("}", ""),
        10,
      );
      return "A1B2C3D4".slice(0, n);
    });
    id = id.replace("{CUSTOM}", "X");
    return id;
  });
}

function AuditActionBadge({ action }: { action: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    created: { bg: "rgba(16,185,129,0.12)", color: "#34d399" },
    formatRuleChanged: { bg: "rgba(255,107,43,0.12)", color: "#FF6B2B" },
    duplicateBlocked: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
    manualOverride: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
    mergeResolved: { bg: "rgba(99,102,241,0.12)", color: "#818cf8" },
    updated: { bg: "rgba(100,140,220,0.12)", color: "#648CDC" },
  };
  const c = cfg[action] ?? cfg.updated;
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.color}33`,
      }}
    >
      {action.replace(/([A-Z])/g, " $1").trim()}
    </span>
  );
}

interface CustomerIdConfigProps {
  vendorId: string;
  isVendor?: boolean;
}

export function CustomerIdConfig({
  vendorId,
  isVendor = true,
}: CustomerIdConfigProps) {
  const { actor } = useActor();
  const [rule, setRule] = useState<CustomerIdFormatRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [auditEntries, setAuditEntries] = useState<CustomerIdAuditEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Edit form state
  const [formatPattern, setFormatPattern] = useState(
    "UK-{REGION}-{SEQUENTIAL}",
  );
  const [prefixRules, setPrefixRules] = useState("UK");
  const [regionRules, setRegionRules] = useState<string[]>([
    "LON",
    "NOR",
    "MAN",
  ]);
  const [newRegion, setNewRegion] = useState("");
  const [numberSequencing, setNumberSequencing] =
    useState<CustomerIdNumberSequencing>(CustomerIdNumberSequencing.sequential);
  const [characterLimit, setCharacterLimit] = useState("20");
  const [separators, setSeparators] = useState<string[]>(["-"]);
  const [newSeparator, setNewSeparator] = useState("");
  const [autoGenEnabled, setAutoGenEnabled] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);
  const [dupPreventionEnabled, setDupPreventionEnabled] = useState(true);

  const loadRule = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const data = await actor.getCustomerIdFormatRule(vendorId);
      if (data) {
        setRule(data);
        setFormatPattern(data.formatPattern);
        setPrefixRules(data.prefixRules);
        setRegionRules([...data.regionRules]);
        setNumberSequencing(data.numberSequencing);
        setCharacterLimit(data.characterLimit.toString());
        setSeparators([...data.allowedSeparators]);
        setAutoGenEnabled(data.autoGenerationEnabled);
        setManualOverride(data.manualOverridePermitted);
        setDupPreventionEnabled(data.duplicatePreventionEnabled);
      }
    } catch {
      /* rule not yet set */
    } finally {
      setLoading(false);
    }
  }, [actor, vendorId]);

  useEffect(() => {
    loadRule();
  }, [loadRule]);

  async function loadAudit() {
    if (!actor) return;
    setAuditLoading(true);
    try {
      const data = await actor.getCustomerIdAuditLog(vendorId);
      setAuditEntries(data.slice(0, 20));
    } catch {
      setAuditEntries([]);
    } finally {
      setAuditLoading(false);
    }
  }

  async function handleSave() {
    if (!actor) return;
    setSaving(true);
    try {
      const input: CustomerIdFormatRuleInput = {
        formatPattern,
        prefixRules,
        regionRules,
        numberSequencing,
        characterLimit: BigInt(Number.parseInt(characterLimit, 10) || 20),
        allowedSeparators: separators,
        autoGenerationEnabled: autoGenEnabled,
        manualOverridePermitted: manualOverride,
        duplicatePreventionEnabled: dupPreventionEnabled,
      };
      await actor.upsertCustomerIdFormatRule(vendorId, input);
      toast.success("Customer ID format rule saved");
      await loadRule();
    } catch {
      toast.error("Failed to save Customer ID format rule");
    } finally {
      setSaving(false);
    }
  }

  function insertToken(token: string) {
    setFormatPattern((prev) => prev + token);
  }

  function addRegion() {
    const r = newRegion.trim().toUpperCase();
    if (!r || regionRules.includes(r)) return;
    setRegionRules((prev) => [...prev, r]);
    setNewRegion("");
  }

  function removeRegion(r: string) {
    setRegionRules((prev) => prev.filter((x) => x !== r));
  }

  function addSeparator() {
    const s = newSeparator.trim();
    if (!s || separators.includes(s)) return;
    setSeparators((prev) => [...prev, s]);
    setNewSeparator("");
  }

  function removeSeparator(s: string) {
    setSeparators((prev) => prev.filter((x) => x !== s));
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied"));
  }

  const previews = generatePreview(formatPattern, regionRules, prefixRules);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-secondary/30" />
        ))}
      </div>
    );
  }

  // ── Read-only view for non-vendor users ─────────────────────────────────────
  if (!isVendor) {
    if (!rule) {
      return (
        <div
          className="flex flex-col items-center py-10 gap-2 text-center"
          data-ocid="customer_id_config.no_rule.panel"
        >
          <Hash size={32} className="text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground">
            No Customer ID format configured
          </p>
          <p className="text-xs text-muted-foreground">
            Contact your Vendor to configure a Customer ID format standard.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4" data-ocid="customer_id_config.readonly.panel">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
          style={{
            background: "rgba(100,140,220,0.08)",
            border: "1px solid rgba(100,140,220,0.2)",
          }}
        >
          <Lock size={13} style={{ color: "#648CDC" }} />
          <span className="text-xs font-medium" style={{ color: "#648CDC" }}>
            Inherited from Vendor
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            — Read-only
          </span>
        </div>
        <div className="crm-card p-5 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">
              Format Pattern
            </Label>
            <p className="text-sm font-mono font-semibold text-foreground mt-1">
              {rule.formatPattern}
            </p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Example IDs</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {previews.map((p) => (
                <span
                  key={p}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,107,43,0.1)",
                    color: "#FF6B2B",
                    border: "1px solid rgba(255,107,43,0.2)",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info size={12} />
            Contact your Vendor to request format changes.
          </p>
        </div>
      </div>
    );
  }

  // ── Vendor full editor ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6" data-ocid="customer_id_config.panel">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield size={14} style={{ color: "#FF6B2B" }} />
            Customer ID Format Governance
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Define the Customer ID standard that all Distributors and Resellers
            must follow.
          </p>
        </div>
        {rule && (
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(16,185,129,0.12)",
              color: "#34d399",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            Format Active
          </span>
        )}
      </div>

      {/* Format Pattern Builder */}
      <div className="crm-card p-5 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Format Pattern
          </Label>
          <Input
            value={formatPattern}
            onChange={(e) => setFormatPattern(e.target.value)}
            className="crm-input font-mono text-sm"
            placeholder="e.g. UK-{REGION}-{SEQUENTIAL}"
            data-ocid="customer_id_config.format_pattern.input"
          />
          <p className="text-[10px] text-muted-foreground">
            Use tokens to define the structure. Insert tokens with the buttons
            below.
          </p>
        </div>

        {/* Token insertion buttons */}
        <div className="flex flex-wrap gap-2">
          {TOKEN_BUTTONS.map((t) => (
            <button
              key={t.token}
              type="button"
              onClick={() => insertToken(t.token)}
              title={t.tooltip}
              className="text-xs px-2.5 py-1 rounded-md transition-colors border font-mono"
              style={{
                background: "rgba(255,107,43,0.08)",
                color: "#FF6B2B",
                borderColor: "rgba(255,107,43,0.2)",
              }}
              data-ocid={`customer_id_config.token.${t.token.replace(/[{}:]/g, "_")}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Live Preview */}
        <div
          className="rounded-lg p-4 space-y-2"
          style={{
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,107,43,0.15)",
          }}
          data-ocid="customer_id_config.preview.panel"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
            Live Preview
          </p>
          <div className="flex flex-wrap gap-2">
            {previews.map((p) => (
              <div key={p} className="flex items-center gap-1.5">
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: "#FF6B2B" }}
                >
                  {p}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(p)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy example ID"
                >
                  <Copy size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Fields */}
      <div className="crm-card p-5 space-y-5">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Format Configuration
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Prefix Rules */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Prefix Rules
            </Label>
            <Input
              value={prefixRules}
              onChange={(e) => setPrefixRules(e.target.value)}
              placeholder="e.g. UK, EU, US"
              className="crm-input"
              data-ocid="customer_id_config.prefix_rules.input"
            />
            <p className="text-[10px] text-muted-foreground">
              Static prefix applied to all generated IDs.
            </p>
          </div>

          {/* Character Limit */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Character Limit
            </Label>
            <Input
              type="number"
              min="5"
              max="64"
              value={characterLimit}
              onChange={(e) => setCharacterLimit(e.target.value)}
              className="crm-input"
              data-ocid="customer_id_config.character_limit.input"
            />
          </div>
        </div>

        {/* Region Rules (chips) */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Region Rules</Label>
          <div className="flex flex-wrap gap-2">
            {regionRules.map((r) => (
              <div
                key={r}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold"
                style={{
                  background: "rgba(100,140,220,0.1)",
                  color: "#648CDC",
                  border: "1px solid rgba(100,140,220,0.2)",
                }}
              >
                {r}
                <button
                  type="button"
                  onClick={() => removeRegion(r)}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                  aria-label={`Remove region ${r}`}
                  data-ocid={`customer_id_config.remove_region.${r}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <Input
                value={newRegion}
                onChange={(e) =>
                  setNewRegion(e.target.value.toUpperCase().slice(0, 6))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRegion();
                  }
                }}
                placeholder="ADD"
                className="crm-input h-7 w-20 text-xs font-mono uppercase"
                data-ocid="customer_id_config.new_region.input"
              />
              <button
                type="button"
                onClick={addRegion}
                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                data-ocid="customer_id_config.add_region.button"
                aria-label="Add region"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Allowed Separators (chips) */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Allowed Separators
          </Label>
          <div className="flex flex-wrap gap-2">
            {separators.map((s) => (
              <div
                key={s}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold"
                style={{
                  background: "rgba(255,107,43,0.08)",
                  color: "#FF6B2B",
                  border: "1px solid rgba(255,107,43,0.18)",
                }}
              >
                "{s}"
                <button
                  type="button"
                  onClick={() => removeSeparator(s)}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                  aria-label={`Remove separator ${s}`}
                  data-ocid={`customer_id_config.remove_separator.${s}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <Input
                value={newSeparator}
                onChange={(e) => setNewSeparator(e.target.value.slice(0, 1))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSeparator();
                  }
                }}
                placeholder="-"
                className="crm-input h-7 w-12 text-xs font-mono text-center"
                maxLength={1}
                data-ocid="customer_id_config.new_separator.input"
              />
              <button
                type="button"
                onClick={addSeparator}
                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                aria-label="Add separator"
                data-ocid="customer_id_config.add_separator.button"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Number Sequencing */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Number Sequencing
          </Label>
          <div className="flex gap-4">
            {[
              {
                value: CustomerIdNumberSequencing.sequential,
                label: "Sequential",
              },
              { value: CustomerIdNumberSequencing.random, label: "Random" },
              { value: CustomerIdNumberSequencing.custom, label: "Custom" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
                data-ocid={`customer_id_config.sequencing.${opt.value}`}
              >
                <input
                  type="radio"
                  name="numberSequencing"
                  value={opt.value}
                  checked={numberSequencing === opt.value}
                  onChange={() => setNumberSequencing(opt.value)}
                  className="accent-orange-500"
                />
                <span className="text-sm text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="crm-card p-5 space-y-4">
        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Governance Toggles
        </h4>
        {[
          {
            id: "autoGen",
            label: "Auto-generate Customer IDs",
            description:
              "IDs are generated automatically when accounts are created.",
            value: autoGenEnabled,
            onChange: setAutoGenEnabled,
            ocid: "customer_id_config.auto_gen.toggle",
            warn: false,
          },
          {
            id: "manualOverride",
            label: "Permit Manual Override",
            description:
              "Allow Distributors and Resellers to enter IDs manually. Relaxes format enforcement.",
            value: manualOverride,
            onChange: setManualOverride,
            ocid: "customer_id_config.manual_override.toggle",
            warn: true,
          },
          {
            id: "dupPrev",
            label: "Duplicate Prevention",
            description: "Block duplicate Customer IDs across all accounts.",
            value: dupPreventionEnabled,
            onChange: setDupPreventionEnabled,
            ocid: "customer_id_config.dup_prevention.toggle",
            warn: false,
          },
        ].map((t) => (
          <div key={t.id} className="flex items-start gap-4 justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{t.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.description}
              </p>
              {t.warn && t.value && (
                <p
                  className="text-xs mt-1 flex items-center gap-1"
                  style={{ color: "#fbbf24" }}
                >
                  <Info size={11} /> Governance implication: Distributors and
                  Resellers can create IDs outside the standard format.
                </p>
              )}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={t.value}
              onClick={() => t.onChange(!t.value)}
              data-ocid={t.ocid}
              className="flex-shrink-0 w-10 h-5.5 rounded-full relative transition-colors"
              style={{
                background: t.value ? "#FF6B2B" : "rgba(255,255,255,0.1)",
                minWidth: "2.5rem",
                height: "1.375rem",
                transition: "background 0.2s",
              }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{
                  transform: t.value ? "translateX(1.125rem)" : "translateX(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          disabled={saving}
          onClick={handleSave}
          style={{ background: "#FF6B2B" }}
          className="text-white gap-2"
          data-ocid="customer_id_config.save.button"
        >
          {saving ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {saving ? "Saving…" : "Save Format Rule"}
        </Button>
      </div>

      {/* Audit Log */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => {
            setShowAudit((v) => !v);
            if (!showAudit) loadAudit();
          }}
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
          data-ocid="customer_id_config.audit.toggle"
        >
          {showAudit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Customer ID Audit Log
          <span className="text-xs text-muted-foreground font-normal">
            (last 20 entries)
          </span>
        </button>

        {showAudit && (
          <div
            className="crm-card overflow-hidden fade-in"
            data-ocid="customer_id_config.audit.panel"
          >
            {auditLoading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full bg-secondary/30" />
                ))}
              </div>
            ) : auditEntries.length === 0 ? (
              <div
                className="flex flex-col items-center py-8 gap-2"
                data-ocid="customer_id_config.audit.empty_state"
              >
                <Hash size={24} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No audit entries yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      {[
                        "Action",
                        "Customer ID",
                        "Account ID",
                        "Performed By",
                        "Timestamp",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left text-muted-foreground uppercase tracking-wide px-4 py-2.5 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditEntries.map((entry, i) => (
                      <tr
                        key={entry.entryId}
                        className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
                        data-ocid={`customer_id_config.audit.item.${i + 1}`}
                      >
                        <td className="px-4 py-2.5">
                          <AuditActionBadge action={entry.action} />
                        </td>
                        <td className="px-4 py-2.5 font-mono text-foreground font-semibold">
                          {entry.customerId}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground font-mono">
                          {entry.accountId}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {entry.performedBy}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                          {formatDate(entry.performedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
