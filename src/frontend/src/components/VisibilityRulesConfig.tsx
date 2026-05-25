import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Info,
  Lock,
  Plus,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  ConditionOperator,
  CustomFieldObjectType,
  OrgVisibilityConfig,
  VisibilityRule,
  VisibilityRuleType,
} from "../backend";
import { useActor } from "../hooks/useActor";

const OBJECT_TYPES = [
  { value: "customerAccount", label: "Customer Accounts" },
  { value: "dealRegistration", label: "Deal Registrations" },
  { value: "opportunity", label: "Opportunities" },
  { value: "businessPlan", label: "Business Plans" },
  { value: "mdfRequest", label: "MDF Requests" },
  { value: "promotion", label: "Promotions" },
  { value: "marketingActivity", label: "Marketing Activities" },
  { value: "userProfile", label: "User Profiles" },
  { value: "resellerProfile", label: "Reseller Profiles" },
  { value: "distributorProfile", label: "Distributor Profiles" },
];

const CONDITION_FIELDS = [
  { value: "role", label: "Role" },
  { value: "region", label: "Region" },
  { value: "org", label: "Organisation" },
];

const CONDITION_OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
];

const TEMPLATES = [
  {
    id: "vendor_sees_all",
    label: "Vendor sees all",
    ruleType: "allow" as const,
    objectType: "customerAccount",
    conditions: [
      {
        conditionField: "role",
        conditionOperator: "equals",
        conditionValue: "VendorAdmin",
      },
    ],
  },
  {
    id: "distributor_assigned",
    label: "Distributor sees assigned only",
    ruleType: "allow" as const,
    objectType: "customerAccount",
    conditions: [
      {
        conditionField: "org",
        conditionOperator: "equals",
        conditionValue: "assigned_distributor",
      },
    ],
  },
  {
    id: "reseller_transacted",
    label: "Reseller sees transacted accounts only",
    ruleType: "allow" as const,
    objectType: "customerAccount",
    conditions: [
      {
        conditionField: "role",
        conditionOperator: "equals",
        conditionValue: "ResellerAdmin",
      },
    ],
  },
  {
    id: "manager_team",
    label: "Manager sees team accounts",
    ruleType: "allow" as const,
    objectType: "customerAccount",
    conditions: [
      {
        conditionField: "role",
        conditionOperator: "contains",
        conditionValue: "Manager",
      },
    ],
  },
];

interface RuleCondition {
  conditionField: string;
  conditionOperator: string;
  conditionValue: string;
}

interface NewRuleForm {
  objectType: string;
  ruleType: "allow" | "deny";
  conditions: RuleCondition[];
}

const EMPTY_FORM: NewRuleForm = {
  objectType: "customerAccount",
  ruleType: "allow",
  conditions: [
    { conditionField: "role", conditionOperator: "equals", conditionValue: "" },
  ],
};

interface Props {
  orgId: string;
  orgType: "vendor" | "distributor" | "reseller";
}

export function VisibilityRulesConfig({ orgId, orgType }: Props) {
  const { actor } = useActor();
  const [config, setConfig] = useState<OrgVisibilityConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<NewRuleForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [inheritToggling, setInheritToggling] = useState(false);

  useEffect(() => {
    if (!actor || !orgId) return;
    setLoading(true);
    actor
      .getOrgVisibilityConfig(orgId)
      .then((cfg) => setConfig(cfg))
      .catch(() => setConfig(null))
      .finally(() => setLoading(false));
  }, [actor, orgId]);

  async function handleToggleInherit(checked: boolean) {
    if (!actor || !orgId) return;
    setInheritToggling(true);
    try {
      await actor.updateOrgVisibilityConfig(orgId, {
        defaultInheritFromVendor: checked,
        lockedByParent: config?.lockedByParent ?? false,
      });
      setConfig((prev) =>
        prev ? { ...prev, defaultInheritFromVendor: checked } : prev,
      );
      toast.success(checked ? "Inheritance enabled" : "Inheritance disabled");
    } catch {
      toast.error("Failed to update config");
    } finally {
      setInheritToggling(false);
    }
  }

  async function handleDeleteRule(ruleId: string) {
    if (!actor) return;
    setDeletingId(ruleId);
    try {
      await actor.deleteVisibilityRule(ruleId);
      setConfig((prev) =>
        prev
          ? {
              ...prev,
              customRules: prev.customRules.filter((r) => r.id !== ruleId),
            }
          : prev,
      );
      toast.success("Rule deleted");
    } catch {
      toast.error("Failed to delete rule");
    } finally {
      setDeletingId(null);
    }
  }

  function addCondition() {
    setForm((f) => ({
      ...f,
      conditions: [
        ...f.conditions,
        {
          conditionField: "role",
          conditionOperator: "equals",
          conditionValue: "",
        },
      ],
    }));
  }

  function removeCondition(idx: number) {
    setForm((f) => ({
      ...f,
      conditions: f.conditions.filter((_, i) => i !== idx),
    }));
  }

  function updateCondition(
    idx: number,
    field: keyof RuleCondition,
    value: string,
  ) {
    setForm((f) => {
      const next = [...f.conditions];
      next[idx] = { ...next[idx], [field]: value };
      return { ...f, conditions: next };
    });
  }

  function applyTemplate(templateId: string) {
    const t = TEMPLATES.find((t) => t.id === templateId);
    if (!t) return;
    setForm({
      objectType: t.objectType,
      ruleType: t.ruleType,
      conditions: [...t.conditions],
    });
    setShowCreate(true);
  }

  async function handleCreateRule(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !orgId) return;
    const invalid = form.conditions.some((c) => !c.conditionValue.trim());
    if (invalid) {
      toast.error("All conditions must have a value");
      return;
    }
    setSaving(true);
    try {
      const newRule = await actor.createVisibilityRule(orgId, {
        objectType: form.objectType as CustomFieldObjectType,
        ruleType: form.ruleType as VisibilityRuleType,
        conditions: form.conditions.map((c) => ({
          conditionField: c.conditionField,
          conditionOperator: c.conditionOperator as ConditionOperator,
          conditionValue: c.conditionValue,
        })),
        isActive: true,
      });
      setConfig((prev) =>
        prev ? { ...prev, customRules: [...prev.customRules, newRule] } : prev,
      );
      setShowCreate(false);
      setForm(EMPTY_FORM);
      toast.success("Visibility rule created");
    } catch {
      toast.error("Failed to create rule");
    } finally {
      setSaving(false);
    }
  }

  function conditionsSummary(rule: VisibilityRule): string {
    if (!rule.conditions?.length) return "No conditions";
    return rule.conditions
      .map(
        (c) =>
          `${c.conditionField} ${c.conditionOperator} "${c.conditionValue}"`,
      )
      .join(" AND ");
  }

  const objectLabel = (val: string) =>
    OBJECT_TYPES.find((o) => o.value === val)?.label ?? val;

  return (
    <div className="space-y-6" data-ocid="visibility_rules.panel">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShieldAlert size={15} style={{ color: "#FF6B2B" }} />
          Data Visibility Rules
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Control who can access each type of data in your organisation
        </p>
      </div>

      {/* Locked banner */}
      {config?.lockedByParent && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-lg border"
          style={{
            background: "rgba(245,158,11,0.07)",
            borderColor: "rgba(245,158,11,0.25)",
          }}
          data-ocid="visibility_rules.locked_banner"
        >
          <Lock size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-300">
            Visibility rules are locked by your parent organisation. Contact
            your {orgType === "reseller" ? "Distributor or Vendor" : "Vendor"}{" "}
            admin to request changes.
          </p>
        </div>
      )}

      {/* Inherit toggle */}
      <div className="crm-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Label className="text-sm font-medium text-foreground">
              Inherit parent org visibility rules by default
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              When enabled, rules from your parent organisation apply
              automatically.
            </p>
          </div>
          <Switch
            checked={config?.defaultInheritFromVendor ?? false}
            onCheckedChange={handleToggleInherit}
            disabled={inheritToggling || !!config?.lockedByParent || loading}
            data-ocid="visibility_rules.inherit_toggle"
          />
        </div>
      </div>

      {/* Templates */}
      <div className="crm-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info size={13} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Quick Templates
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t.id)}
              disabled={!!config?.lockedByParent}
              className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              data-ocid={`visibility_rules.template.${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules list */}
      <div className="crm-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            Active Rules
            {config && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                ({config.customRules.filter((r) => r.isActive).length} active)
              </span>
            )}
          </span>
          <Button
            type="button"
            size="sm"
            disabled={!!config?.lockedByParent || loading}
            onClick={() => setShowCreate(true)}
            style={{ background: "#FF6B2B" }}
            className="text-white gap-1.5"
            data-ocid="visibility_rules.create_rule_button"
          >
            <Plus size={13} /> Create Rule
          </Button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Loading rules…
          </div>
        ) : !config || config.customRules.length === 0 ? (
          <div
            className="flex flex-col items-center py-12 gap-3"
            data-ocid="visibility_rules.empty_state"
          >
            <Eye size={32} className="text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No custom rules defined
            </p>
            <p className="text-xs text-muted-foreground">
              Create a rule or apply a template to control data access.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[
                    "Object Type",
                    "Rule Type",
                    "Conditions",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.customRules.map((rule, i) => (
                  <tr
                    key={rule.id}
                    className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors"
                    data-ocid={`visibility_rules.rule.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground text-xs">
                      {objectLabel(rule.objectType)}
                    </td>
                    <td className="px-4 py-3">
                      {rule.ruleType === "allow" ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Eye size={9} /> Allow
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <EyeOff size={9} /> Deny
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[260px] truncate">
                      {conditionsSummary(rule)}
                    </td>
                    <td className="px-4 py-3">
                      {rule.isActive ? (
                        <span className="status-badge text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <span className="status-badge text-[11px] font-semibold bg-muted/40 text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={
                          deletingId === rule.id || !!config?.lockedByParent
                        }
                        onClick={() => handleDeleteRule(rule.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
                        aria-label="Delete rule"
                        data-ocid={`visibility_rules.delete_button.${i + 1}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Rule Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.65)" }}
          data-ocid="visibility_rules.create.dialog"
        >
          <div className="crm-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <ShieldAlert size={14} style={{ color: "#FF6B2B" }} />
                Create Visibility Rule
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setForm(EMPTY_FORM);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="visibility_rules.create.close_button"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="p-6 space-y-5">
              {/* Object type */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Object Type *
                </Label>
                <select
                  value={form.objectType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, objectType: e.target.value }))
                  }
                  className="crm-input w-full px-3 py-2 text-sm"
                  data-ocid="visibility_rules.create.object_type.select"
                >
                  {OBJECT_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rule type */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Rule Type *
                </Label>
                <div className="flex gap-3">
                  {(["allow", "deny"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, ruleType: type }))}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        form.ruleType === type
                          ? type === "allow"
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                            : "bg-red-500/15 border-red-500/40 text-red-400"
                          : "border-border text-muted-foreground hover:border-accent/50"
                      }`}
                      data-ocid={`visibility_rules.create.rule_type_${type}`}
                    >
                      {type === "allow" ? "✓ Allow" : "✗ Deny"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Conditions (AND logic)
                  </Label>
                  <button
                    type="button"
                    onClick={addCondition}
                    className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
                    data-ocid="visibility_rules.create.add_condition_button"
                  >
                    <Plus size={11} /> Add Condition
                  </button>
                </div>
                {form.conditions.map((cond, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: condition order is user-managed
                  <div key={idx} className="flex items-center gap-2 flex-wrap">
                    <select
                      value={cond.conditionField}
                      onChange={(e) =>
                        updateCondition(idx, "conditionField", e.target.value)
                      }
                      className="crm-input px-2 py-1.5 text-xs flex-1 min-w-[100px]"
                    >
                      {CONDITION_FIELDS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={cond.conditionOperator}
                      onChange={(e) =>
                        updateCondition(
                          idx,
                          "conditionOperator",
                          e.target.value,
                        )
                      }
                      className="crm-input px-2 py-1.5 text-xs flex-1 min-w-[90px]"
                    >
                      {CONDITION_OPERATORS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={cond.conditionValue}
                      onChange={(e) =>
                        updateCondition(idx, "conditionValue", e.target.value)
                      }
                      placeholder="value…"
                      className="crm-input flex-1 min-w-[100px] h-8 text-xs"
                    />
                    {form.conditions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCondition(idx)}
                        className="text-muted-foreground hover:text-red-400 transition-colors"
                        aria-label="Remove condition"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreate(false);
                    setForm(EMPTY_FORM);
                  }}
                  data-ocid="visibility_rules.create.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  style={{ background: "#FF6B2B" }}
                  className="text-white"
                  data-ocid="visibility_rules.create.submit_button"
                >
                  {saving ? "Creating…" : "Create Rule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
