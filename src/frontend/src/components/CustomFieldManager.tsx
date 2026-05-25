import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sliders,
  Trash2,
  X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CustomFieldObjectType,
  CustomFieldPermission,
  CustomFieldType,
  CustomFieldValidationRuleType,
  CustomFieldVisibilityScope,
} from "../backend";
import type {
  CustomFieldDef,
  CustomFieldDefInput,
  CustomFieldValidationRule,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CustomFieldManagerProps {
  orgType: "vendor" | "distributor" | "reseller";
  canCreate: boolean;
  canArchive: boolean;
  canLock: boolean;
}

const OBJECT_TYPE_LABELS: Record<CustomFieldObjectType, string> = {
  [CustomFieldObjectType.customerAccount]: "Customer Accounts",
  [CustomFieldObjectType.dealRegistration]: "Deal Registrations",
  [CustomFieldObjectType.opportunity]: "Opportunities",
  [CustomFieldObjectType.businessPlan]: "Business Plans",
  [CustomFieldObjectType.mdfRequest]: "MDF Requests",
  [CustomFieldObjectType.promotion]: "Promotions",
  [CustomFieldObjectType.marketingActivity]: "Marketing Activities",
  [CustomFieldObjectType.userProfile]: "User Profiles",
  [CustomFieldObjectType.resellerProfile]: "Reseller Profiles",
  [CustomFieldObjectType.distributorProfile]: "Distributor Profiles",
};

const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  [CustomFieldType.text]: "Text",
  [CustomFieldType.longText]: "Long Text",
  [CustomFieldType.number_]: "Number",
  [CustomFieldType.currency]: "Currency",
  [CustomFieldType.percentage]: "Percentage",
  [CustomFieldType.dropdown]: "Dropdown / Select",
  [CustomFieldType.multiSelect]: "Multi-Select",
  [CustomFieldType.date]: "Date",
  [CustomFieldType.datetime]: "Datetime",
  [CustomFieldType.checkbox]: "Checkbox",
  [CustomFieldType.url]: "URL",
  [CustomFieldType.email]: "Email",
  [CustomFieldType.phoneNumber]: "Phone Number",
  [CustomFieldType.attachment]: "Attachment",
  [CustomFieldType.tag]: "Tag Field",
  [CustomFieldType.regionSelector]: "Region Selector",
  [CustomFieldType.userSelector]: "User Selector",
  [CustomFieldType.organizationSelector]: "Organisation Selector",
};

const VISIBILITY_LABELS: Record<CustomFieldVisibilityScope, string> = {
  [CustomFieldVisibilityScope.allOrgs]: "All Organisations",
  [CustomFieldVisibilityScope.vendorOnly]: "Vendor Only",
  [CustomFieldVisibilityScope.distributorOnly]: "Distributor Only",
  [CustomFieldVisibilityScope.resellerOnly]: "Reseller Only",
  [CustomFieldVisibilityScope.internalOnly]: "Internal Only",
  [CustomFieldVisibilityScope.roleSpecific]: "Role Specific",
};

const RULE_TYPE_LABELS: Record<CustomFieldValidationRuleType, string> = {
  [CustomFieldValidationRuleType.required]: "Required",
  [CustomFieldValidationRuleType.minLength]: "Min Length",
  [CustomFieldValidationRuleType.maxLength]: "Max Length",
  [CustomFieldValidationRuleType.minValue]: "Min Value",
  [CustomFieldValidationRuleType.maxValue]: "Max Value",
  [CustomFieldValidationRuleType.regex]: "Regex Pattern",
  [CustomFieldValidationRuleType.unique]: "Unique",
  [CustomFieldValidationRuleType.allowedValues]: "Allowed Values",
  [CustomFieldValidationRuleType.conditionalRequired]: "Conditional Required",
};

const ALL_OBJECT_TYPES = Object.values(CustomFieldObjectType);
const ALL_FIELD_TYPES = Object.values(CustomFieldType);
const ALL_VISIBILITY = Object.values(CustomFieldVisibilityScope);
const ALL_RULE_TYPES = Object.values(CustomFieldValidationRuleType);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

type FieldTypePrimary = Record<
  string,
  { icon: string; needsOptions?: boolean; noDefault?: boolean }
>;
const FIELD_META: FieldTypePrimary = {
  text: { icon: "Aa" },
  longText: { icon: "¶" },
  number_: { icon: "#" },
  currency: { icon: "$" },
  percentage: { icon: "%" },
  dropdown: { icon: "▾", needsOptions: true },
  multiSelect: { icon: "☑", needsOptions: true },
  date: { icon: "📅" },
  datetime: { icon: "🕐" },
  checkbox: { icon: "✓" },
  url: { icon: "🔗" },
  email: { icon: "✉" },
  phoneNumber: { icon: "📞" },
  attachment: { icon: "📎", noDefault: true },
  tag: { icon: "🏷", noDefault: true },
  regionSelector: { icon: "🌍", noDefault: true },
  userSelector: { icon: "👤", noDefault: true },
  organizationSelector: { icon: "🏢", noDefault: true },
};

// ─── Blank form state ─────────────────────────────────────────────────────────
interface FieldForm {
  fieldLabel: string;
  fieldName: string;
  fieldDescription: string;
  fieldType: CustomFieldType;
  objectType: CustomFieldObjectType;
  isRequired: boolean;
  isSearchable: boolean;
  isReportable: boolean;
  isApiVisible: boolean;
  isExportVisible: boolean;
  defaultValue: string;
  allowedValues: string[];
  visibilityScope: CustomFieldVisibilityScope;
  lockedByVendor: boolean;
  validationRules: CustomFieldValidationRule[];
}

function blankForm(): FieldForm {
  return {
    fieldLabel: "",
    fieldName: "",
    fieldDescription: "",
    fieldType: CustomFieldType.text,
    objectType: CustomFieldObjectType.customerAccount,
    isRequired: false,
    isSearchable: true,
    isReportable: true,
    isApiVisible: false,
    isExportVisible: true,
    defaultValue: "",
    allowedValues: [],
    visibilityScope: CustomFieldVisibilityScope.allOrgs,
    lockedByVendor: false,
    validationRules: [],
  };
}

function formToInput(form: FieldForm): CustomFieldDefInput {
  return {
    fieldLabel: form.fieldLabel.trim(),
    fieldName: form.fieldName.trim(),
    fieldDescription: form.fieldDescription.trim(),
    fieldType: form.fieldType,
    objectType: form.objectType,
    isRequired: form.isRequired,
    isSearchable: form.isSearchable,
    isReportable: form.isReportable,
    isApiVisible: form.isApiVisible,
    isExportVisible: form.isExportVisible,
    defaultValue: form.defaultValue.trim() || undefined,
    allowedValues: form.allowedValues,
    visibilityScope: form.visibilityScope,
    validationRules: form.validationRules,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
  };
}

// ─── Lock status badge ────────────────────────────────────────────────────────
function LockBadge({
  source,
  size = "sm",
}: {
  source: "vendor" | "distributor";
  size?: "sm" | "xs";
}) {
  const label =
    source === "vendor" ? "Locked by Vendor" : "Locked by Distributor";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
        size === "xs" ? "text-[10px]" : "text-[11px]"
      } font-semibold`}
      style={{
        background: "rgba(249,115,22,0.1)",
        color: "#F97316",
        border: "1px solid rgba(249,115,22,0.3)",
      }}
    >
      <Lock className={size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      {label}
    </span>
  );
}

// ─── Request Unlock Modal ─────────────────────────────────────────────────────
function RequestUnlockModal({
  open,
  field,
  orgType,
  onClose,
}: {
  open: boolean;
  field: CustomFieldDef | null;
  orgType: "vendor" | "distributor" | "reseller";
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const targetAdmin = orgType === "reseller" ? "Vendor Admin" : "Vendor Admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!field || !reason.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success(
      `Unlock request sent to ${targetAdmin} for field "${field.fieldLabel}". Status: Pending.`,
    );
    setReason("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent
        className="max-w-md"
        style={{ background: "#121b2a", border: "1px solid #223047" }}
        data-ocid="custom_fields.unlock_request.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" style={{ color: "#F97316" }} />
            Request Field Unlock
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {field && (
            <div
              className="rounded-lg p-3 text-sm"
              style={{
                background: "rgba(249,115,22,0.07)",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
            >
              <p className="text-foreground font-medium">{field.fieldLabel}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Field name: <span className="font-mono">{field.fieldName}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This field is locked by Vendor. Your request will be sent to the
                Vendor Admin.
              </p>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Reason for unlock request *
            </Label>
            <Textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this field configuration needs to be changed…"
              rows={4}
              className="crm-input resize-none"
              data-ocid="custom_fields.unlock_request.reason.textarea"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="custom_fields.unlock_request.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !reason.trim()}
              style={{ background: "#F97316" }}
              className="text-white"
              data-ocid="custom_fields.unlock_request.submit_button"
            >
              {submitting ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Allowed Values chip input ────────────────────────────────────────────────
function AllowedValuesInput({
  values,
  onChange,
}: {
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function addValue(val: string) {
    const trimmed = val.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInput("");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(100,140,220,0.12)",
              color: "#8AABDC",
              border: "1px solid rgba(100,140,220,0.25)",
            }}
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((o) => o !== v))}
              className="hover:text-red-400 transition-colors ml-0.5"
              aria-label={`Remove option ${v}`}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addValue(input);
            }
          }}
          placeholder="Type option and press Enter"
          className="crm-input text-xs h-8"
          data-ocid="custom_fields.allowed_values.input"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs border-border"
          onClick={() => addValue(input)}
          data-ocid="custom_fields.allowed_values.add_button"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

// ─── Validation Rule Builder ──────────────────────────────────────────────────
function ValidationRuleBuilder({
  rules,
  onChange,
}: {
  rules: CustomFieldValidationRule[];
  onChange: (rules: CustomFieldValidationRule[]) => void;
}) {
  function addRule() {
    onChange([
      ...rules,
      { ruleType: CustomFieldValidationRuleType.required, ruleValue: "" },
    ]);
  }

  function updateRule(
    index: number,
    patch: Partial<CustomFieldValidationRule>,
  ) {
    const next = rules.map((r, i) => (i === index ? { ...r, ...patch } : r));
    onChange(next);
  }

  function removeRule(index: number) {
    onChange(rules.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {rules.map((rule, i) => {
        const ruleKey = `${rule.ruleType}-${i}`;
        return (
          <div
            key={ruleKey}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{
              background: "rgba(100,116,139,0.1)",
              border: "1px solid rgba(100,116,139,0.15)",
            }}
            data-ocid={`custom_fields.validation_rule.item.${i + 1}`}
          >
            <select
              value={rule.ruleType}
              onChange={(e) =>
                updateRule(i, {
                  ruleType: e.target.value as CustomFieldValidationRuleType,
                })
              }
              className="flex-1 rounded-md border border-input bg-background text-foreground text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {ALL_RULE_TYPES.map((rt) => (
                <option key={rt} value={rt}>
                  {RULE_TYPE_LABELS[rt]}
                </option>
              ))}
            </select>
            {rule.ruleType !== CustomFieldValidationRuleType.required &&
              rule.ruleType !== CustomFieldValidationRuleType.unique && (
                <Input
                  value={rule.ruleValue}
                  onChange={(e) => updateRule(i, { ruleValue: e.target.value })}
                  placeholder="Value"
                  className="crm-input text-xs h-8 w-28"
                />
              )}
            <button
              type="button"
              onClick={() => removeRule(i)}
              className="text-muted-foreground hover:text-red-400 transition-colors p-1"
              aria-label="Remove rule"
              data-ocid={`custom_fields.validation_rule.remove_button.${i + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 text-xs border-border gap-1"
        onClick={addRule}
        data-ocid="custom_fields.add_validation_rule_button"
      >
        <Plus className="w-3 h-3" /> Add Rule
      </Button>
    </div>
  );
}

// ─── Field Type selector ──────────────────────────────────────────────────────
function FieldTypeSelector({
  value,
  onChange,
}: {
  value: CustomFieldType;
  onChange: (t: CustomFieldType) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {ALL_FIELD_TYPES.map((ft) => {
        const meta = FIELD_META[ft];
        const active = value === ft;
        return (
          <button
            key={ft}
            type="button"
            onClick={() => onChange(ft)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${
              active
                ? "border-accent/60 text-accent"
                : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
            style={{
              background: active
                ? "rgba(249,115,22,0.08)"
                : "rgba(30,41,59,0.5)",
            }}
            data-ocid={`custom_fields.type_selector.${ft}`}
          >
            <span className="text-base leading-none">{meta?.icon ?? "?"}</span>
            <span className="text-[10px] leading-tight font-medium">
              {FIELD_TYPE_LABELS[ft]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
function FieldFormModal({
  open,
  editTarget,
  orgType,
  canLock,
  onClose,
  onSaved,
}: {
  open: boolean;
  editTarget: CustomFieldDef | null;
  orgType: "vendor" | "distributor" | "reseller";
  canLock: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { actor } = useActor();
  const [form, setForm] = useState<FieldForm>(
    editTarget ? fieldDefToForm(editTarget) : blankForm(),
  );
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState<
    "basic" | "options" | "rules" | "permissions"
  >("basic");

  function fieldDefToForm(def: CustomFieldDef): FieldForm {
    return {
      fieldLabel: def.fieldLabel,
      fieldName: def.fieldName,
      fieldDescription: def.fieldDescription,
      fieldType: def.fieldType,
      objectType: def.objectType,
      isRequired: def.isRequired,
      isSearchable: def.isSearchable,
      isReportable: def.isReportable,
      isApiVisible: def.isApiVisible,
      isExportVisible: def.isExportVisible,
      defaultValue: def.defaultValue ?? "",
      allowedValues: [...def.allowedValues],
      visibilityScope: def.visibilityScope,
      lockedByVendor: def.lockedByVendor,
      validationRules: [...def.validationRules],
    };
  }

  function handleLabelChange(label: string) {
    setForm((f) => ({
      ...f,
      fieldLabel: label,
      fieldName: editTarget ? f.fieldName : slugify(label),
    }));
  }

  const needsOptions =
    form.fieldType === CustomFieldType.dropdown ||
    form.fieldType === CustomFieldType.multiSelect;
  const noDefault = FIELD_META[form.fieldType]?.noDefault;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !form.fieldLabel.trim() || !form.fieldName.trim()) return;
    setSaving(true);
    try {
      const input = formToInput(form);
      if (editTarget) {
        await actor.updateCustomFieldDef(editTarget.id, input);
        toast.success(`Field "${form.fieldLabel}" updated`);
      } else {
        await actor.createCustomFieldDef(input);
        toast.success(`Custom field "${form.fieldLabel}" created`);
      }
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to save custom field");
    } finally {
      setSaving(false);
    }
  }

  const SECTIONS = [
    { id: "basic" as const, label: "Field Details" },
    { id: "options" as const, label: "Options & Defaults" },
    { id: "rules" as const, label: "Validation Rules" },
    { id: "permissions" as const, label: "Visibility & Permissions" },
  ];

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: "#0f1923", border: "1px solid #1e3048" }}
        data-ocid="custom_fields.form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Sliders className="w-4 h-4" style={{ color: "#F97316" }} />
            {editTarget
              ? `Edit Field: ${editTarget.fieldLabel}`
              : "Create Custom Field"}
          </DialogTitle>
        </DialogHeader>

        {/* Section tabs */}
        <div className="flex gap-0.5 border-b border-border/50 -mx-6 px-6 pb-0 mb-4">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                section === s.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Basic ── */}
          {section === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Field Label *
                  </Label>
                  <Input
                    required
                    value={form.fieldLabel}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    placeholder="e.g. Internal Risk Rating"
                    className="crm-input"
                    data-ocid="custom_fields.form.field_label.input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Field Name (API slug) *
                  </Label>
                  <Input
                    required
                    value={form.fieldName}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        fieldName: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_]/g, "_"),
                      }))
                    }
                    placeholder="e.g. internal_risk_rating"
                    className="crm-input font-mono text-xs"
                    data-ocid="custom_fields.form.field_name.input"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Used in API and exports
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  value={form.fieldDescription}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fieldDescription: e.target.value }))
                  }
                  placeholder="Describe what this field captures…"
                  rows={2}
                  className="crm-input resize-none text-sm"
                  data-ocid="custom_fields.form.description.textarea"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Object Type *
                </Label>
                <select
                  value={form.objectType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      objectType: e.target.value as CustomFieldObjectType,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
                  data-ocid="custom_fields.form.object_type.select"
                >
                  {ALL_OBJECT_TYPES.map((ot) => (
                    <option key={ot} value={ot}>
                      {OBJECT_TYPE_LABELS[ot]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">
                  Field Type *
                </Label>
                <FieldTypeSelector
                  value={form.fieldType}
                  onChange={(ft) => setForm((f) => ({ ...f, fieldType: ft }))}
                />
              </div>
            </div>
          )}

          {/* ── Options & Defaults ── */}
          {section === "options" && (
            <div className="space-y-4">
              {needsOptions && (
                <div className="flex flex-col gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Dropdown Options *
                  </Label>
                  <AllowedValuesInput
                    values={form.allowedValues}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, allowedValues: v }))
                    }
                  />
                </div>
              )}

              {!noDefault && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Default Value
                  </Label>
                  <Input
                    value={form.defaultValue}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, defaultValue: e.target.value }))
                    }
                    placeholder="Leave blank for no default"
                    className="crm-input"
                    data-ocid="custom_fields.form.default_value.input"
                  />
                </div>
              )}

              {/* Toggles */}
              <div className="space-y-3 pt-1">
                {(
                  [
                    ["isRequired", "Required Field", "Field must be filled in"],
                    ["isSearchable", "Searchable", "Appears in search filters"],
                    [
                      "isReportable",
                      "Reportable",
                      "Available in reports and dashboards",
                    ],
                    [
                      "isApiVisible",
                      "API Visible",
                      "Exposed via API endpoints",
                    ],
                    [
                      "isExportVisible",
                      "Export Visible",
                      "Included in CSV/XLSX exports",
                    ],
                  ] as [keyof FieldForm, string, string][]
                ).map(([key, label, desc]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={!!form[key]}
                      onCheckedChange={(v) =>
                        setForm((f) => ({ ...f, [key]: v }))
                      }
                      data-ocid={`custom_fields.form.${key}.switch`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Validation Rules ── */}
          {section === "rules" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Add validation rules to control what data can be entered in this
                field.
              </p>
              <ValidationRuleBuilder
                rules={form.validationRules}
                onChange={(rules) =>
                  setForm((f) => ({ ...f, validationRules: rules }))
                }
              />
            </div>
          )}

          {/* ── Visibility & Permissions ── */}
          {section === "permissions" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Visibility Scope
                </Label>
                <select
                  value={form.visibilityScope}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      visibilityScope: e.target
                        .value as CustomFieldVisibilityScope,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
                  data-ocid="custom_fields.form.visibility_scope.select"
                >
                  {ALL_VISIBILITY.map((v) => (
                    <option key={v} value={v}>
                      {VISIBILITY_LABELS[v]}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground">
                  Controls which organisational tiers can see this field.
                </p>
              </div>

              {canLock && orgType === "vendor" && (
                <div
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: "rgba(249,115,22,0.07)",
                    border: "1px solid rgba(249,115,22,0.2)",
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Lock for Downstream Orgs
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Distributors and Resellers cannot modify this field
                      definition
                    </p>
                  </div>
                  <Switch
                    checked={form.lockedByVendor}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, lockedByVendor: v }))
                    }
                    data-ocid="custom_fields.form.locked_by_vendor.switch"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="custom_fields.form.cancel_button"
            >
              Cancel
            </Button>
            {section !== "permissions" ? (
              <Button
                type="button"
                onClick={() => {
                  const next =
                    section === "basic"
                      ? "options"
                      : section === "options"
                        ? "rules"
                        : "permissions";
                  setSection(next);
                }}
                style={{
                  background: "rgba(100,140,220,0.2)",
                  border: "1px solid rgba(100,140,220,0.4)",
                  color: "#8AABDC",
                }}
                data-ocid="custom_fields.form.next_button"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={saving || !form.fieldLabel.trim()}
                style={{ background: "#F97316" }}
                className="text-white"
                data-ocid="custom_fields.form.save_button"
              >
                {saving
                  ? "Saving..."
                  : editTarget
                    ? "Save Changes"
                    : "Create Field"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Archive Confirm Modal ────────────────────────────────────────────────────
function ArchiveConfirmModal({
  open,
  field,
  onClose,
  onConfirm,
}: {
  open: boolean;
  field: CustomFieldDef | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent
        className="max-w-sm"
        style={{ background: "#121b2a", border: "1px solid #223047" }}
        data-ocid="custom_fields.archive_confirm.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Archive className="w-4 h-4 text-yellow-400" />
            Archive Custom Field?
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Archiving{" "}
          <span className="font-medium text-foreground">
            {field?.fieldLabel}
          </span>{" "}
          will hide it from all forms. Existing data will be preserved.
        </p>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            data-ocid="custom_fields.archive_confirm.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={onConfirm}
            data-ocid="custom_fields.archive_confirm.confirm_button"
          >
            Archive Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CustomFieldManager({
  orgType,
  canCreate,
  canArchive,
  canLock,
}: CustomFieldManagerProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [objectFilter, setObjectFilter] = useState<
    CustomFieldObjectType | "all"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CustomFieldDef | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<CustomFieldDef | null>(
    null,
  );
  const [unlockTarget, setUnlockTarget] = useState<CustomFieldDef | null>(null);

  // Fetch all object types in one pass using customerAccount as pivot; re-fetch all
  const allDefs = useQuery<CustomFieldDef[]>({
    queryKey: ["customFieldDefs", "all"],
    queryFn: async () => {
      if (!actor) return SAMPLE_FIELDS;
      const results = await Promise.all(
        ALL_OBJECT_TYPES.map((ot) => actor.listCustomFieldDefs(ot)),
      );
      const seen = new Set<string>();
      const combined: CustomFieldDef[] = [];
      for (const arr of results) {
        for (const f of arr) {
          if (!seen.has(f.id)) {
            seen.add(f.id);
            combined.push(f);
          }
        }
      }
      return combined;
    },
    enabled: true,
    staleTime: 30_000,
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.archiveCustomFieldDef(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customFieldDefs"] });
      toast.success("Field archived. Existing data preserved.");
    },
    onError: () => toast.error("Failed to archive field"),
  });

  const filteredDefs = useMemo(() => {
    let defs = allDefs.data ?? [];
    if (!showArchived) defs = defs.filter((d) => !d.isArchived);
    if (objectFilter !== "all")
      defs = defs.filter((d) => d.objectType === objectFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      defs = defs.filter(
        (d) =>
          d.fieldLabel.toLowerCase().includes(q) ||
          d.fieldName.toLowerCase().includes(q),
      );
    }
    return defs;
  }, [allDefs.data, objectFilter, searchTerm, showArchived]);

  function handleArchiveConfirm() {
    if (archiveTarget) {
      archiveMutation.mutate(archiveTarget.id);
      setArchiveTarget(null);
    }
  }

  function handleSaved() {
    queryClient.invalidateQueries({ queryKey: ["customFieldDefs"] });
  }

  const loading = allDefs.isLoading;

  return (
    <div
      className="flex flex-col gap-4"
      data-ocid="custom_fields.manager.panel"
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fields…"
              className="crm-input pl-8 h-8 text-xs w-52"
              data-ocid="custom_fields.search.input"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              showArchived
                ? "border-accent/60 text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            style={{
              background: showArchived ? "rgba(249,115,22,0.08)" : undefined,
            }}
            data-ocid="custom_fields.show_archived.toggle"
          >
            <Archive className="w-3 h-3" />
            Archived
          </button>
        </div>

        {canCreate && (
          <Button
            type="button"
            size="sm"
            className="gap-1.5 text-xs h-8"
            style={{ background: "#F97316" }}
            onClick={() => {
              setEditTarget(null);
              setCreateOpen(true);
            }}
            data-ocid="custom_fields.create_button"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Custom Field
          </Button>
        )}
      </div>

      {/* Object type filter tabs */}
      <div
        className="flex gap-0.5 overflow-x-auto scrollbar-thin border-b border-border/40 pb-0"
        data-ocid="custom_fields.object_filter.tabs"
      >
        {(
          ["all", ...ALL_OBJECT_TYPES] as ("all" | CustomFieldObjectType)[]
        ).map((ot) => (
          <button
            key={ot}
            type="button"
            onClick={() => setObjectFilter(ot)}
            data-ocid={`custom_fields.object_filter.${ot}.tab`}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              objectFilter === ot
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {ot === "all" ? "All Objects" : OBJECT_TYPE_LABELS[ot]}
          </button>
        ))}
      </div>

      {/* Fields table */}
      <div className="crm-card overflow-hidden" data-ocid="custom_fields.table">
        {loading ? (
          <div
            className="p-4 flex flex-col gap-2"
            data-ocid="custom_fields.loading_state"
          >
            {["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-12 w-full bg-secondary/30" />
            ))}
          </div>
        ) : filteredDefs.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-14 gap-3"
            data-ocid="custom_fields.empty_state"
          >
            <Sliders className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {searchTerm
                ? "No fields match your search"
                : showArchived
                  ? "No archived fields"
                  : "No custom fields yet"}
            </p>
            {canCreate && !searchTerm && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => {
                  setEditTarget(null);
                  setCreateOpen(true);
                }}
                data-ocid="custom_fields.empty_state.create_button"
              >
                <Plus className="w-3 h-3 mr-1" /> Create your first field
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Field Name",
                    "Type",
                    "Object",
                    "Visibility",
                    "Flags",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-muted-foreground uppercase tracking-wide px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDefs.map((field, i) => (
                  <FieldRow
                    key={field.id}
                    field={field}
                    index={i + 1}
                    orgType={orgType}
                    canArchive={canArchive}
                    onEdit={() => {
                      setEditTarget(field);
                      setCreateOpen(true);
                    }}
                    onArchive={() => setArchiveTarget(field)}
                    onUnarchive={() => {
                      toast.info(
                        "Contact Vendor Admin to restore archived fields.",
                      );
                    }}
                    onRequestUnlock={() => setUnlockTarget(field)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Count */}
      {!loading && filteredDefs.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filteredDefs.length} field{filteredDefs.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Modals */}
      <FieldFormModal
        open={createOpen}
        editTarget={editTarget}
        orgType={orgType}
        canLock={canLock}
        onClose={() => {
          setCreateOpen(false);
          setEditTarget(null);
        }}
        onSaved={handleSaved}
      />

      <ArchiveConfirmModal
        open={!!archiveTarget}
        field={archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchiveConfirm}
      />

      <RequestUnlockModal
        open={!!unlockTarget}
        field={unlockTarget}
        orgType={orgType}
        onClose={() => setUnlockTarget(null)}
      />
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────
function FieldRow({
  field,
  index,
  orgType,
  canArchive,
  onEdit,
  onArchive,
  onUnarchive,
  onRequestUnlock,
}: {
  field: CustomFieldDef;
  index: number;
  orgType: "vendor" | "distributor" | "reseller";
  canArchive: boolean;
  onEdit: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onRequestUnlock: () => void;
}) {
  const isLocked = field.lockedByVendor && orgType !== "vendor";

  return (
    <tr
      className="border-b border-border/40 hover:bg-secondary/10 transition-colors"
      data-ocid={`custom_fields.field.item.${index}`}
    >
      {/* Name + label */}
      <td className="px-4 py-3 min-w-[160px]">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-foreground">
              {field.fieldLabel}
            </span>
            {field.isRequired && (
              <span className="text-[9px] text-red-400 font-bold">REQ</span>
            )}
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/70">
            {field.fieldName}
          </span>
          {isLocked && (
            <div className="mt-0.5">
              <LockBadge source="vendor" size="xs" />
            </div>
          )}
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(100,140,220,0.1)",
            color: "#8AABDC",
            border: "1px solid rgba(100,140,220,0.2)",
          }}
        >
          {FIELD_TYPE_LABELS[field.fieldType]}
        </span>
      </td>

      {/* Object */}
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {OBJECT_TYPE_LABELS[field.objectType]}
      </td>

      {/* Visibility */}
      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {VISIBILITY_LABELS[field.visibilityScope]}
      </td>

      {/* Flags */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 flex-wrap">
          {field.isSearchable && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Search
            </span>
          )}
          {field.isReportable && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Report
            </span>
          )}
          {field.isApiVisible && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              API
            </span>
          )}
          {field.isExportVisible && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              Export
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        {field.isArchived ? (
          <span className="status-badge text-[11px] font-semibold bg-secondary/50 text-muted-foreground">
            Archived
          </span>
        ) : (
          <span className="status-badge text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {isLocked ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              onClick={onRequestUnlock}
              data-ocid={`custom_fields.request_unlock_button.${index}`}
            >
              <RefreshCw className="w-3 h-3" />
              Request Unlock
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                onClick={onEdit}
                aria-label={`Edit ${field.fieldLabel}`}
                data-ocid={`custom_fields.edit_button.${index}`}
              >
                <Pencil className="w-3 h-3" />
              </Button>

              {canArchive && !field.isArchived && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-yellow-400"
                  onClick={onArchive}
                  aria-label={`Archive ${field.fieldLabel}`}
                  data-ocid={`custom_fields.archive_button.${index}`}
                >
                  <Archive className="w-3 h-3" />
                </Button>
              )}

              {field.isArchived && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-emerald-400"
                  onClick={onUnarchive}
                  aria-label={`Restore ${field.fieldLabel}`}
                  data-ocid={`custom_fields.restore_button.${index}`}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Sample fields (for no-actor fallback) ────────────────────────────────────
const SAMPLE_FIELDS: CustomFieldDef[] = [
  {
    id: "cf-001",
    fieldLabel: "Internal Risk Rating",
    fieldName: "internal_risk_rating",
    fieldDescription: "Vendor-assigned risk level for this account",
    fieldType: CustomFieldType.dropdown,
    objectType: CustomFieldObjectType.customerAccount,
    isRequired: false,
    isSearchable: true,
    isReportable: true,
    isApiVisible: false,
    isExportVisible: true,
    isArchived: false,
    lockedByVendor: true,
    allowedValues: ["Low", "Medium", "High", "Critical"],
    validationRules: [],
    visibilityScope: CustomFieldVisibilityScope.allOrgs,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    createdBy: "vendor-admin",
    defaultValue: "Low",
  },
  {
    id: "cf-002",
    fieldLabel: "Government Sector Priority",
    fieldName: "government_sector_priority",
    fieldDescription: "Flag accounts targeting public sector",
    fieldType: CustomFieldType.checkbox,
    objectType: CustomFieldObjectType.customerAccount,
    isRequired: false,
    isSearchable: true,
    isReportable: true,
    isApiVisible: true,
    isExportVisible: true,
    isArchived: false,
    lockedByVendor: false,
    allowedValues: [],
    validationRules: [],
    visibilityScope: CustomFieldVisibilityScope.vendorOnly,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    createdBy: "vendor-admin",
    defaultValue: undefined,
  },
  {
    id: "cf-003",
    fieldLabel: "Renewal Probability Score",
    fieldName: "renewal_probability_score",
    fieldDescription: "AI-assisted probability of renewal (0–100)",
    fieldType: CustomFieldType.percentage,
    objectType: CustomFieldObjectType.dealRegistration,
    isRequired: false,
    isSearchable: false,
    isReportable: true,
    isApiVisible: true,
    isExportVisible: true,
    isArchived: false,
    lockedByVendor: false,
    allowedValues: [],
    validationRules: [
      { ruleType: CustomFieldValidationRuleType.minValue, ruleValue: "0" },
      { ruleType: CustomFieldValidationRuleType.maxValue, ruleValue: "100" },
    ],
    visibilityScope: CustomFieldVisibilityScope.allOrgs,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    createdBy: "vendor-admin",
    defaultValue: undefined,
  },
  {
    id: "cf-004",
    fieldLabel: "Target Vertical",
    fieldName: "target_vertical",
    fieldDescription: "Industry vertical for this opportunity",
    fieldType: CustomFieldType.multiSelect,
    objectType: CustomFieldObjectType.opportunity,
    isRequired: false,
    isSearchable: true,
    isReportable: true,
    isApiVisible: false,
    isExportVisible: true,
    isArchived: false,
    lockedByVendor: false,
    allowedValues: [
      "Healthcare",
      "Finance",
      "Manufacturing",
      "Retail",
      "Education",
      "Government",
    ],
    validationRules: [],
    visibilityScope: CustomFieldVisibilityScope.allOrgs,
    editPermissions: [CustomFieldPermission.edit],
    viewPermissions: [CustomFieldPermission.view],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    createdBy: "vendor-admin",
    defaultValue: undefined,
  },
];
