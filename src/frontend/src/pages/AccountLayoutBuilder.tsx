/**
 * AccountLayoutBuilder — Full-page Account Layout Builder inside The Foundry.
 *
 * Split into focused sub-components to stay under 350 lines per logical block.
 * All drag-and-drop uses useDragAndDrop. State via useLayoutBuilderContext.
 */

import { useLayoutBuilderContext } from "@/contexts/LayoutBuilderContext";
import {
  DEFAULT_ACCOUNT_LAYOUT,
  FIELD_TYPE_META,
  FORGEAI_LAYOUT_SUGGESTIONS,
  PREBUILT_LAYOUTS,
  PREBUILT_LAYOUT_NAMES,
} from "@/data/layoutBuilderDefaults";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import type {
  AccountLayout,
  AccountTab,
  LayoutAssignment,
  LayoutField,
  LayoutSection,
  VisibilityRule,
} from "@/types/layoutBuilder";
import {
  FieldType,
  VisibilityConditionType,
  VisibilityOperator,
  VisibilityRuleAction,
  VisibilityTargetType,
} from "@/types/layoutBuilder";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Flame,
  GripVertical,
  Info,
  Layers,
  Layout,
  LayoutTemplate,
  Pencil,
  Plus,
  Save,
  Shield,
  Sparkles,
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Shared Design Atoms ──────────────────────────────────────────────────────

function GlassPanel({
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
          ? "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.08)]"
          : "border-white/[0.08]"
      } bg-white/[0.04] ${className}`}
    >
      {children}
    </div>
  );
}

function FieldTypeIcon({
  type,
  size = 13,
}: { type: FieldType; size?: number }) {
  const meta = FIELD_TYPE_META[type];
  if (!meta) return <span className="text-muted-foreground text-xs">?</span>;
  return (
    <span
      className="font-mono text-orange-400 flex-shrink-0"
      style={{ fontSize: size }}
    >
      {meta.icon}
    </span>
  );
}

// ─── Tab Manager ─────────────────────────────────────────────────────────────

function TabManager({
  tabs,
  onTabsChange,
  selectedTabId,
  onSelectTab,
}: {
  tabs: AccountTab[];
  onTabsChange: (tabs: AccountTab[]) => void;
  selectedTabId: string | null;
  onSelectTab: (id: string) => void;
}) {
  const { getItemProps, reorderItems, setOnReorder } =
    useDragAndDrop<AccountTab>();
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOnReorder((fromId, toId) => {
      onTabsChange(reorderItems(tabs, fromId, toId));
    });
  }, [tabs, onTabsChange, reorderItems, setOnReorder]);

  useEffect(() => {
    if (editingTabId && editRef.current) editRef.current.focus();
  }, [editingTabId]);

  const toggleVisible = (id: string) =>
    onTabsChange(
      tabs.map((t) => (t.id === id ? { ...t, isVisible: !t.isVisible } : t)),
    );

  const deleteTab = (id: string) =>
    onTabsChange(tabs.filter((t) => t.id !== id));

  const addTab = () => {
    const newTab: AccountTab = {
      id: `tab-custom-${Date.now()}`,
      tabLabel: "New Tab",
      sortOrder: BigInt(tabs.length),
      isVisible: true,
      isCustom: true,
      hiddenForRoles: [],
      hiddenForDepts: [],
    };
    onTabsChange([...tabs, newTab]);
    setEditingTabId(newTab.id);
    setEditLabel(newTab.tabLabel);
  };

  const commitEdit = () => {
    if (!editingTabId) return;
    onTabsChange(
      tabs.map((t) =>
        t.id === editingTabId ? { ...t, tabLabel: editLabel } : t,
      ),
    );
    setEditingTabId(null);
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap px-4 py-3 border-b border-white/[0.07] bg-card/60">
      <Layers size={13} className="text-muted-foreground flex-shrink-0" />
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
        Tabs
      </span>
      {tabs.map((tab) => {
        const isSelected = selectedTabId === tab.id;
        const dragProps = getItemProps(
          tab.id,
          `group flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-grab ${
            isSelected
              ? "bg-orange-500/15 text-orange-300 border border-orange-500/30"
              : tab.isVisible
                ? "text-muted-foreground border border-white/10 hover:border-orange-500/20 hover:text-foreground"
                : "text-muted-foreground/40 border border-white/5 line-through"
          }`,
        );
        return (
          <div
            key={tab.id}
            {...dragProps}
            data-ocid={`alb.tab.${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <GripVertical
              size={9}
              className="builder-drag-handle opacity-0 group-hover:opacity-60 flex-shrink-0"
            />
            {editingTabId === tab.id ? (
              <input
                ref={editRef}
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-b border-orange-500 outline-none w-20 text-xs text-foreground"
              />
            ) : (
              <span>{tab.tabLabel}</span>
            )}
            {isSelected && (
              <div className="flex items-center gap-0.5 ml-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTabId(tab.id);
                    setEditLabel(tab.tabLabel);
                  }}
                  className="p-0.5 rounded hover:bg-white/10 text-muted-foreground hover:text-orange-300"
                  aria-label="Rename tab"
                >
                  <Pencil size={9} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisible(tab.id);
                  }}
                  className="p-0.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  aria-label={tab.isVisible ? "Hide tab" : "Show tab"}
                >
                  {tab.isVisible ? <Eye size={9} /> : <EyeOff size={9} />}
                </button>
                {tab.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTab(tab.id);
                    }}
                    className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    aria-label="Delete tab"
                  >
                    <Trash2 size={9} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        data-ocid="alb.add_tab.button"
        onClick={addTab}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 transition-colors"
      >
        <Plus size={10} /> Tab
      </button>
    </div>
  );
}

// ─── Custom Field Creator ─────────────────────────────────────────────────────

function CustomFieldCreator({
  sectionId,
  onAdd,
  onClose,
}: {
  sectionId: string;
  onAdd: (field: LayoutField) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldType>(FieldType.Text);
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");
  const hasMeta = FIELD_TYPE_META[type]?.hasOptions ?? false;

  const handleCreate = () => {
    if (!label.trim()) return;
    const field: LayoutField = {
      id: `f-custom-${Date.now()}`,
      fieldLabel: label.trim(),
      fieldType: type,
      sortOrder: BigInt(0),
      visible: true,
      required,
      options: hasMeta
        ? options
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean)
        : [],
      sectionId,
    };
    onAdd(field);
    onClose();
  };

  return (
    <div className="builder-field-card mt-2 p-4 border border-orange-500/25 rounded-xl bg-orange-500/[0.04] space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-orange-300">
          New Custom Field
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-0.5 rounded hover:bg-white/10 text-muted-foreground"
        >
          <X size={12} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
            Field Label
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Strategic Priority"
            className="w-full px-2.5 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
            Field Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
            className="w-full px-2.5 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
          >
            {Object.entries(FIELD_TYPE_META).map(([k, m]) => (
              <option key={k} value={k}>
                {m.icon} {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasMeta && (
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
            Options (comma-separated)
          </label>
          <input
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            placeholder="Option A, Option B, Option C"
            className="w-full px-2.5 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-orange-500/50"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="accent-orange-500"
          />
          <span className="text-xs text-muted-foreground">Required</span>
        </label>
        <button
          type="button"
          data-ocid="alb.create_field.submit_button"
          disabled={!label.trim()}
          onClick={handleCreate}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-500/80 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={11} /> Create & Add
        </button>
      </div>
    </div>
  );
}

// ─── Visibility Rule Builder ──────────────────────────────────────────────────

const CONDITION_TYPE_LABELS: Record<string, string> = {
  [VisibilityConditionType.ByRole]: "By Role",
  [VisibilityConditionType.ByDepartment]: "By Department",
  [VisibilityConditionType.ByOrgType]: "By Org Type",
  [VisibilityConditionType.ByAccountType]: "By Account Type",
  [VisibilityConditionType.ByTerritory]: "By Territory",
  [VisibilityConditionType.ByMarketSegment]: "By Market Segment",
};

function VisibilityRuleBuilder({
  targetId,
  targetType,
  existingRules,
  onSave,
  onDelete,
}: {
  targetId: string;
  targetType: VisibilityTargetType;
  existingRules: VisibilityRule[];
  onSave: (rule: VisibilityRule) => void;
  onDelete: (ruleId: string) => void;
}) {
  const [condType, setCondType] = useState<VisibilityConditionType>(
    VisibilityConditionType.ByRole,
  );
  const [condValue, setCondValue] = useState("");
  const [action, setAction] = useState<VisibilityRuleAction>(
    VisibilityRuleAction.Show,
  );

  const handleAdd = () => {
    if (!condValue.trim()) return;
    const rule: VisibilityRule = {
      id: `rule-${Date.now()}`,
      targetId,
      targetType,
      conditions: [{ conditionType: condType, value: condValue.trim() }],
      operator: VisibilityOperator.And,
      action,
    };
    onSave(rule);
    setCondValue("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield size={12} className="text-orange-400" />
        <span className="text-xs font-semibold text-foreground">
          Visibility Rules
        </span>
      </div>

      {existingRules.length > 0 && (
        <div className="space-y-1.5">
          {existingRules.map((r) => (
            <div
              key={r.id}
              className="builder-rule-row flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.07]"
            >
              <Shield size={10} className="text-orange-400/60 flex-shrink-0" />
              <span className="text-[11px] text-muted-foreground flex-1 min-w-0 truncate">
                {r.action === VisibilityRuleAction.Show ? "Show" : "Hide"} for{" "}
                <span className="text-foreground">
                  {r.conditions[0]?.conditionType}
                </span>
                {" = "}
                <span className="text-orange-300">
                  {r.conditions[0]?.value}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onDelete(r.id)}
                className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive flex-shrink-0"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
              Condition
            </label>
            <select
              value={condType}
              onChange={(e) =>
                setCondType(e.target.value as VisibilityConditionType)
              }
              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            >
              {Object.entries(CONDITION_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
              Action
            </label>
            <select
              value={action}
              onChange={(e) =>
                setAction(e.target.value as VisibilityRuleAction)
              }
              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-orange-500/50"
            >
              <option value={VisibilityRuleAction.Show}>Show</option>
              <option value={VisibilityRuleAction.Hide}>Hide</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
            Value (e.g. Sales, Marketing, Vendor)
          </label>
          <input
            value={condValue}
            onChange={(e) => setCondValue(e.target.value)}
            placeholder="Role, department, or org type value"
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <button
          type="button"
          data-ocid="alb.visibility_rule.add_button"
          onClick={handleAdd}
          disabled={!condValue.trim()}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={11} /> Add Condition
        </button>
      </div>
    </div>
  );
}

// ─── Section Builder ─────────────────────────────────────────────────────────

function SectionCard({
  section,
  fields,
  allRules,
  isSelected,
  onSelect,
  onSectionUpdate,
  onFieldUpdate,
  onFieldAdd,
  onFieldDelete,
  onFieldsReorder,
  dragProps,
}: {
  section: LayoutSection;
  fields: LayoutField[];
  allRules: VisibilityRule[];
  isSelected: boolean;
  onSelect: () => void;
  onSectionUpdate: (s: LayoutSection) => void;
  onFieldUpdate: (f: LayoutField) => void;
  onFieldAdd: (f: LayoutField) => void;
  onFieldDelete: (id: string) => void;
  onFieldsReorder: (fields: LayoutField[]) => void;
  dragProps: ReturnType<
    ReturnType<typeof useDragAndDrop>["getItemProps"]
  > extends infer T
    ? T
    : Record<string, unknown>;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [addingField, setAddingField] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(section.title);
  const titleRef = useRef<HTMLInputElement>(null);
  const fieldDnD = useDragAndDrop<LayoutField>();

  useEffect(() => {
    fieldDnD.setOnReorder((fromId, toId) => {
      onFieldsReorder(fieldDnD.reorderItems(fields, fromId, toId));
    });
  }, [fields, fieldDnD, onFieldsReorder]);

  useEffect(() => {
    if (editingTitle && titleRef.current) titleRef.current.focus();
  }, [editingTitle]);

  const ruleCount = allRules.filter((r) => r.targetId === section.id).length;

  return (
    <div
      {...(dragProps as React.HTMLAttributes<HTMLDivElement> & {
        draggable: true;
      })}
      data-ocid={`alb.section.${section.id}`}
      onClick={onSelect}
      className={`builder-field-card rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? "border-orange-500/40 shadow-[0_0_16px_rgba(249,115,22,0.08)] bg-orange-500/[0.03]"
          : "border-white/[0.08] hover:border-white/[0.14] bg-white/[0.03]"
      } ${(dragProps as { className?: string }).className ?? ""}`}
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="builder-drag-handle cursor-grab p-0.5 rounded hover:bg-white/10">
          <GripVertical size={13} className="text-muted-foreground/50" />
        </div>
        {editingTitle ? (
          <input
            ref={titleRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={() => {
              onSectionUpdate({ ...section, title: titleValue });
              setEditingTitle(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSectionUpdate({ ...section, title: titleValue });
                setEditingTitle(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent border-b border-orange-500 outline-none text-sm font-semibold text-foreground min-w-0"
          />
        ) : (
          <span className="flex-1 text-sm font-semibold text-foreground truncate min-w-0">
            {section.title}
          </span>
        )}
        {ruleCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
            <Shield size={8} /> {ruleCount}
          </span>
        )}
        <div
          className="flex items-center gap-0.5 ml-auto flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setEditingTitle(true);
              setTitleValue(section.title);
            }}
            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Rename section"
          >
            <Pencil size={11} />
          </button>
          <button
            type="button"
            onClick={() =>
              onSectionUpdate({ ...section, collapsible: !section.collapsible })
            }
            className={`p-1 rounded hover:bg-white/10 transition-colors ${
              section.collapsible ? "text-orange-400" : "text-muted-foreground"
            }`}
            aria-label="Toggle collapsible"
          >
            <Layers size={11} />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="p-1 rounded hover:bg-white/10 text-muted-foreground transition-colors"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
          </button>
        </div>
      </div>

      {/* Fields list */}
      {!collapsed && (
        <div className="px-3 pb-3 space-y-1.5">
          {fields.length === 0 && !addingField && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-white/10 text-muted-foreground/50">
              <AlertCircle size={12} />
              <span className="text-xs">No fields yet. Add a field below.</span>
            </div>
          )}

          {fields.map((field, idx) => {
            const fieldDragProps = fieldDnD.getItemProps(
              field.id,
              "rounded-lg border bg-white/[0.03] hover:bg-white/[0.06]",
            );
            const fieldRules = allRules.filter((r) => r.targetId === field.id);
            return (
              <div
                key={field.id}
                {...(fieldDragProps as React.HTMLAttributes<HTMLDivElement> & {
                  draggable: true;
                })}
                data-ocid={`alb.field.item.${idx + 1}`}
                onClick={(e) => e.stopPropagation()}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border border-white/[0.07] hover:border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.06] transition-all ${
                  (fieldDragProps as { className?: string }).className ?? ""
                }`}
              >
                <div className="builder-drag-handle cursor-grab">
                  <GripVertical
                    size={11}
                    className="text-muted-foreground/40"
                  />
                </div>
                <FieldTypeIcon type={field.fieldType} />
                <span className="flex-1 text-xs font-medium text-foreground truncate min-w-0">
                  {field.fieldLabel}
                </span>
                {field.required && (
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-orange-500/10 text-orange-400">
                    REQ
                  </span>
                )}
                {fieldRules.length > 0 && (
                  <Shield
                    size={9}
                    className="text-orange-400/60 flex-shrink-0"
                  />
                )}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onFieldUpdate({ ...field, visible: !field.visible })
                    }
                    className={`p-0.5 rounded hover:bg-white/10 transition-colors ${
                      field.visible
                        ? "text-muted-foreground"
                        : "text-muted-foreground/30"
                    }`}
                    aria-label={field.visible ? "Hide field" : "Show field"}
                  >
                    {field.visible ? <Eye size={10} /> : <EyeOff size={10} />}
                  </button>
                  <button
                    type="button"
                    data-ocid={`alb.field.delete_button.${idx + 1}`}
                    onClick={() => onFieldDelete(field.id)}
                    className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-colors"
                    aria-label="Delete field"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            );
          })}

          {addingField ? (
            <CustomFieldCreator
              sectionId={section.id}
              onAdd={(f) => {
                onFieldAdd(f);
                setAddingField(false);
              }}
              onClose={() => setAddingField(false)}
            />
          ) : (
            <button
              type="button"
              data-ocid={`alb.section.add_field_button.${section.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setAddingField(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 mt-1 rounded-lg text-[11px] font-medium text-orange-400/70 border border-dashed border-orange-500/20 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/[0.03] transition-all"
            >
              <Plus size={10} /> Add Field
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Assignment Panel ─────────────────────────────────────────────────────────

const ORG_TYPES = ["Vendor", "Distributor", "Reseller"] as const;
const DEPARTMENTS = [
  "Sales",
  "Marketing",
  "Leadership",
  "IT",
  "Operations",
  "Sales Ops",
] as const;
const ROLES = [
  "Sales Rep",
  "Sales Manager",
  "Marketing",
  "Leadership",
  "Admin",
  "IT",
] as const;

function AssignmentPanel({
  assignment,
  onChange,
  onSave,
}: {
  assignment: LayoutAssignment;
  onChange: (a: LayoutAssignment) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users size={12} className="text-orange-400" />
        <span className="text-xs font-semibold text-foreground">
          Layout Assignment
        </span>
      </div>

      {/* Org Type */}
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">
          Organisation Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ORG_TYPES.map((o) => (
            <button
              key={o}
              type="button"
              data-ocid={`alb.assignment.org.${o.toLowerCase()}`}
              onClick={() =>
                onChange({
                  ...assignment,
                  orgType: assignment.orgType === o ? undefined : o,
                })
              }
              className={`builder-assignment-badge px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                assignment.orgType === o
                  ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
                  : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:border-orange-500/20"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Department */}
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">
          Department
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              type="button"
              data-ocid={`alb.assignment.dept.${d.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() =>
                onChange({
                  ...assignment,
                  department: assignment.department === d ? undefined : d,
                })
              }
              className={`builder-assignment-badge px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                assignment.department === d
                  ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                  : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:border-blue-500/20"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">
          Role
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                onChange({
                  ...assignment,
                  role: assignment.role === r ? undefined : r,
                })
              }
              className={`builder-assignment-badge px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                assignment.role === r
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-white/[0.04] text-muted-foreground border-white/[0.08] hover:border-emerald-500/20"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Territory / Market Segment */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
            Territory
          </label>
          <input
            value={assignment.territory ?? ""}
            onChange={(e) =>
              onChange({
                ...assignment,
                territory: e.target.value || undefined,
              })
            }
            placeholder="e.g. EMEA"
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
            Market Segment
          </label>
          <input
            value={assignment.marketSegment ?? ""}
            onChange={(e) =>
              onChange({
                ...assignment,
                marketSegment: e.target.value || undefined,
              })
            }
            placeholder="e.g. Enterprise"
            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </div>

      <button
        type="button"
        data-ocid="alb.assignment.save_button"
        onClick={onSave}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white bg-orange-500/80 hover:bg-orange-500 transition-colors"
      >
        <CheckCircle2 size={12} /> Save Assignment
      </button>
    </div>
  );
}

// ─── Preview Mode ─────────────────────────────────────────────────────────────

function PreviewMode({
  layout,
  previewRole,
  previewDept,
  previewOrgType,
  onRoleChange,
  onDeptChange,
  onOrgTypeChange,
}: {
  layout: AccountLayout;
  previewRole: string;
  previewDept: string;
  previewOrgType: string;
  onRoleChange: (v: string) => void;
  onDeptChange: (v: string) => void;
  onOrgTypeChange: (v: string) => void;
}) {
  const isFieldVisible = (field: LayoutField): boolean => {
    if (!field.visible) return false;
    const rules =
      layout.visibilityRules?.filter((r) => r.targetId === field.id) ?? [];
    if (rules.length === 0) return true;
    for (const rule of rules) {
      const match =
        (rule.conditions[0]?.conditionType === VisibilityConditionType.ByRole &&
          rule.conditions[0]?.value === previewRole) ||
        (rule.conditions[0]?.conditionType ===
          VisibilityConditionType.ByDepartment &&
          rule.conditions[0]?.value === previewDept) ||
        (rule.conditions[0]?.conditionType ===
          VisibilityConditionType.ByOrgType &&
          rule.conditions[0]?.value === previewOrgType);
      if (match) return rule.action === VisibilityRuleAction.Show;
    }
    return true;
  };

  const isSectionVisible = (section: LayoutSection): boolean => {
    const rules =
      layout.visibilityRules?.filter((r) => r.targetId === section.id) ?? [];
    if (rules.length === 0) return true;
    for (const rule of rules) {
      const match =
        (rule.conditions[0]?.conditionType === VisibilityConditionType.ByRole &&
          rule.conditions[0]?.value === previewRole) ||
        (rule.conditions[0]?.conditionType ===
          VisibilityConditionType.ByDepartment &&
          rule.conditions[0]?.value === previewDept) ||
        (rule.conditions[0]?.conditionType ===
          VisibilityConditionType.ByOrgType &&
          rule.conditions[0]?.value === previewOrgType);
      if (match) return rule.action === VisibilityRuleAction.Show;
    }
    return true;
  };

  const visibleTabs = layout.tabs.filter((t) => t.isVisible);

  return (
    <div className="space-y-4">
      {/* Simulator controls */}
      <GlassPanel className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={13} className="text-orange-400" />
          <span className="text-xs font-semibold text-foreground">
            Simulate View As
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
              Role
            </label>
            <select
              value={previewRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none"
            >
              <option value="">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
              Department
            </label>
            <select
              value={previewDept}
              onChange={(e) => onDeptChange(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none"
            >
              <option value="">All Depts</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">
              Org Type
            </label>
            <select
              value={previewOrgType}
              onChange={(e) => onOrgTypeChange(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground focus:outline-none"
            >
              <option value="">All Orgs</option>
              {ORG_TYPES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassPanel>

      {/* Mock account header */}
      <GlassPanel glow className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center font-black text-orange-400">
            A
          </div>
          <div>
            <div className="text-base font-bold text-foreground">
              Acme Corporation
            </div>
            <div className="text-xs text-muted-foreground">
              CID-001 · Enterprise · Account Owner: Sarah Chen
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">
              Active
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/15 text-orange-400">
              Medium Risk
            </span>
          </div>
        </div>

        {/* Preview tabs */}
        <div className="flex items-center gap-1 flex-wrap border-b border-white/[0.07] pb-2 mb-3">
          {visibleTabs.map((tab) => (
            <span
              key={tab.id}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-muted-foreground border border-white/[0.07] bg-white/[0.03]"
            >
              {tab.tabLabel}
            </span>
          ))}
        </div>

        {/* Preview sections */}
        <div className="space-y-3">
          {layout.sections.filter(isSectionVisible).map((section) => {
            const sectionFields = layout.fields.filter(
              (f) => f.sectionId === section.id && isFieldVisible(f),
            );
            return (
              <div
                key={section.id}
                className="rounded-lg border border-white/[0.07] p-3 bg-white/[0.02]"
              >
                <div className="text-xs font-semibold text-foreground mb-2">
                  {section.title}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {sectionFields.map((field) => (
                    <div key={field.id}>
                      <div className="text-[10px] text-muted-foreground">
                        {field.fieldLabel}
                      </div>
                      <div className="text-xs text-foreground/60 font-mono">
                        —
                      </div>
                    </div>
                  ))}
                  {sectionFields.length === 0 && (
                    <span className="text-[10px] text-muted-foreground/40 col-span-2">
                      No visible fields for this context
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </div>
  );
}

// ─── ForgeAI Panel ────────────────────────────────────────────────────────────

function ForgeAIRecommendationsPanel({
  onApply,
}: {
  onApply: (suggestion: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const visibleSuggestions = FORGEAI_LAYOUT_SUGGESTIONS.slice(0, 4);

  return (
    <div
      className="border-t border-orange-500/20 bg-gradient-to-r from-orange-500/[0.04] to-transparent"
      data-ocid="alb.forgeai_panel"
    >
      <button
        type="button"
        data-ocid="alb.forgeai_panel.toggle"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-orange-500/[0.04] transition-colors"
      >
        <div className="p-1 rounded bg-orange-500/10">
          <Brain size={12} className="text-orange-400" />
        </div>
        <span className="text-xs font-semibold text-orange-300">
          ForgeAI Layout Recommendations
        </span>
        <div className="flex items-center gap-1 ml-1">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 forgeai-pulse" />
          <span className="text-[10px] text-orange-400">Live</span>
        </div>
        <div className="ml-auto">
          {expanded ? (
            <ChevronDown size={13} className="text-muted-foreground" />
          ) : (
            <ChevronUp size={13} className="text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {visibleSuggestions.map((s, i) => (
            <div
              key={i}
              data-ocid={`alb.forgeai_panel.suggestion.${i + 1}`}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-orange-500/10 hover:border-orange-500/20 transition-colors"
            >
              <Sparkles
                size={11}
                className="text-orange-400 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-orange-400 block mb-0.5">
                  {s.role}
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {s.suggestion}
                </p>
              </div>
              <button
                type="button"
                data-ocid={`alb.forgeai_panel.apply_button.${i + 1}`}
                onClick={() => onApply(s.suggestion)}
                className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-medium text-orange-400 border border-orange-500/30 hover:bg-orange-500/10 transition-colors"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AccountLayoutBuilder() {
  const { layouts, saveLayout, loading } = useLayoutBuilderContext();

  // ── Local working state ──────────────────────────────────────────────────
  const [activeLayoutId, setActiveLayoutId] = useState<string>(
    layouts[0]?.id ?? DEFAULT_ACCOUNT_LAYOUT.id,
  );
  const [draftLayout, setDraftLayout] = useState<AccountLayout>(
    layouts.find((l) => l.id === activeLayoutId) ?? DEFAULT_ACCOUNT_LAYOUT,
  );
  const [isDirty, setIsDirty] = useState(false);
  const [layoutName, setLayoutName] = useState(draftLayout.name);
  const [editingName, setEditingName] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // ── Right panel state ────────────────────────────────────────────────────
  type RightPanel = "properties" | "rules" | "assignment" | "preview";
  const [rightPanel, setRightPanel] = useState<RightPanel>("properties");
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );

  // ── Preview state ────────────────────────────────────────────────────────
  const [previewRole, setPreviewRole] = useState("");
  const [previewDept, setPreviewDept] = useState("");
  const [previewOrgType, setPreviewOrgType] = useState("");

  // ── Assignment state ─────────────────────────────────────────────────────
  const [assignment, setAssignment] = useState<LayoutAssignment>({
    layoutId: draftLayout.id,
  });

  // ── Section drag-and-drop ────────────────────────────────────────────────
  const sectionDnD = useDragAndDrop<LayoutSection>();
  useEffect(() => {
    sectionDnD.setOnReorder((fromId, toId) => {
      updateLayout({
        sections: sectionDnD.reorderItems(draftLayout.sections, fromId, toId),
      });
    });
  }, [draftLayout.sections, sectionDnD]);

  // ── Sync active layout from context ─────────────────────────────────────
  useEffect(() => {
    const found = layouts.find((l) => l.id === activeLayoutId);
    if (found) {
      setDraftLayout(found);
      setLayoutName(found.name);
      setAssignment({ layoutId: found.id });
    }
  }, [activeLayoutId, layouts]);

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const updateLayout = (patch: Partial<AccountLayout>) => {
    setDraftLayout((prev) => ({ ...prev, ...patch }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    const updated: AccountLayout = {
      ...draftLayout,
      name: layoutName,
      updatedAt: BigInt(Date.now()),
    };
    const result = await saveLayout(updated);
    if (result) {
      setIsDirty(false);
      toast.success("Layout saved successfully");
    } else {
      toast.error("Failed to save layout");
    }
  };

  const handlePublish = async () => {
    await handleSave();
    toast.success("Layout published and active", {
      description: "Users matching assignment rules will see this layout.",
    });
  };

  const addSection = () => {
    const newSection: LayoutSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      sortOrder: BigInt(draftLayout.sections.length),
      collapsible: false,
      fieldIds: [],
    };
    updateLayout({ sections: [...draftLayout.sections, newSection] });
    setSelectedSectionId(newSection.id);
  };

  const updateSection = (updated: LayoutSection) => {
    updateLayout({
      sections: draftLayout.sections.map((s) =>
        s.id === updated.id ? updated : s,
      ),
    });
  };

  const deleteSection = (id: string) => {
    updateLayout({
      sections: draftLayout.sections.filter((s) => s.id !== id),
      fields: draftLayout.fields.filter((f) => f.sectionId !== id),
    });
    if (selectedSectionId === id) setSelectedSectionId(null);
  };

  const addField = (field: LayoutField) => {
    updateLayout({
      fields: [...draftLayout.fields, field],
      sections: draftLayout.sections.map((s) =>
        s.id === field.sectionId
          ? { ...s, fieldIds: [...s.fieldIds, field.id] }
          : s,
      ),
    });
  };

  const updateField = (field: LayoutField) => {
    updateLayout({
      fields: draftLayout.fields.map((f) => (f.id === field.id ? field : f)),
    });
  };

  const deleteField = (id: string) => {
    updateLayout({
      fields: draftLayout.fields.filter((f) => f.id !== id),
      sections: draftLayout.sections.map((s) => ({
        ...s,
        fieldIds: s.fieldIds.filter((fid) => fid !== id),
      })),
    });
  };

  const reorderSectionFields = (
    sectionId: string,
    reordered: LayoutField[],
  ) => {
    const other = draftLayout.fields.filter((f) => f.sectionId !== sectionId);
    updateLayout({ fields: [...other, ...reordered] });
  };

  const saveRule = (rule: VisibilityRule) => {
    const existing = draftLayout.visibilityRules ?? [];
    updateLayout({ visibilityRules: [...existing, rule] });
    toast.success("Visibility rule added");
  };

  const deleteRule = (ruleId: string) => {
    updateLayout({
      visibilityRules: (draftLayout.visibilityRules ?? []).filter(
        (r) => r.id !== ruleId,
      ),
    });
  };

  const cloneTemplate = (key: string) => {
    const tpl = PREBUILT_LAYOUTS[key];
    if (!tpl) return;
    const cloned: AccountLayout = {
      ...tpl,
      id: `clone-${key}-${Date.now()}`,
      name: `${tpl.name} (Copy)`,
      isDefault: false,
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
    };
    saveLayout(cloned).then(() => {
      setActiveLayoutId(cloned.id);
      toast.success("Template cloned");
    });
  };

  const selectedSection =
    draftLayout.sections.find((s) => s.id === selectedSectionId) ?? null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-120px)] bg-background">
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-card/60 flex-shrink-0">
        <div className="p-1.5 rounded-lg bg-orange-500/15">
          <Layout size={14} className="text-orange-400" />
        </div>
        {editingName ? (
          <input
            ref={nameRef}
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
            className="text-sm font-bold bg-transparent border-b border-orange-500 outline-none text-foreground min-w-[120px]"
          />
        ) : (
          <button
            type="button"
            data-ocid="alb.layout_name.button"
            onClick={() => setEditingName(true)}
            className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-orange-300 transition-colors"
          >
            {layoutName}
            <Pencil size={11} className="text-muted-foreground" />
          </button>
        )}
        {isDirty && (
          <span className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
            <Info size={9} /> Unsaved changes
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Panel toggles */}
          {(
            ["properties", "rules", "assignment", "preview"] as RightPanel[]
          ).map((p) => (
            <button
              key={p}
              type="button"
              data-ocid={`alb.panel.${p}.tab`}
              onClick={() => setRightPanel(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                rightPanel === p
                  ? "bg-orange-500/15 text-orange-300 border border-orange-500/30"
                  : "text-muted-foreground hover:text-foreground border border-transparent hover:border-white/10"
              }`}
            >
              {p === "rules" ? "Visibility" : p === "assignment" ? "Assign" : p}
            </button>
          ))}

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button
            type="button"
            data-ocid="alb.save.button"
            onClick={handleSave}
            disabled={!isDirty || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground border border-white/15 hover:border-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Save size={12} /> Save
          </button>
          <button
            type="button"
            data-ocid="alb.publish.button"
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-orange-500/80 hover:bg-orange-500 transition-all"
          >
            <Zap size={12} /> Publish
          </button>
        </div>
      </div>

      {/* ── 3-column layout ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Left sidebar ───────────────────────────────────────────── */}
        <aside className="w-[210px] flex-shrink-0 border-r border-white/[0.07] bg-card/40 flex flex-col hidden md:flex overflow-y-auto">
          {/* My Layouts */}
          <div className="p-3 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                My Layouts
              </span>
              <button
                type="button"
                data-ocid="alb.sidebar.new_layout.button"
                onClick={() => {
                  const blank: AccountLayout = {
                    ...DEFAULT_ACCOUNT_LAYOUT,
                    id: `layout-${Date.now()}`,
                    name: "New Layout",
                    isDefault: false,
                    createdAt: BigInt(Date.now()),
                    updatedAt: BigInt(Date.now()),
                  };
                  saveLayout(blank).then(() => setActiveLayoutId(blank.id));
                }}
                className="p-1 rounded hover:bg-orange-500/10 text-muted-foreground hover:text-orange-400 transition-colors"
                aria-label="New layout"
              >
                <Plus size={12} />
              </button>
            </div>
            <div className="space-y-0.5">
              {layouts.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  data-ocid={`alb.sidebar.layout.item.${i + 1}`}
                  onClick={() => setActiveLayoutId(l.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all ${
                    activeLayoutId === l.id
                      ? "bg-orange-500/15 text-orange-300 border border-orange-500/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <LayoutTemplate size={10} className="flex-shrink-0" />
                    <span className="truncate">{l.name}</span>
                    {l.isDefault && (
                      <span className="ml-auto text-[9px] text-orange-400/60">
                        default
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prebuilt Templates */}
          <div className="p-3 flex-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Templates
            </span>
            <div className="space-y-0.5">
              {Object.entries(PREBUILT_LAYOUT_NAMES).map(([key, name], i) => (
                <div
                  key={key}
                  data-ocid={`alb.sidebar.template.item.${i + 1}`}
                  className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <LayoutTemplate
                    size={10}
                    className="text-muted-foreground/50 flex-shrink-0"
                  />
                  <span className="flex-1 text-xs text-muted-foreground truncate">
                    {name}
                  </span>
                  <button
                    type="button"
                    data-ocid={`alb.sidebar.template.clone_button.${i + 1}`}
                    onClick={() => cloneTemplate(key)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 text-muted-foreground hover:text-orange-400 transition-all"
                    aria-label={`Clone ${name}`}
                  >
                    <Copy size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main canvas ────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Tab manager */}
          <TabManager
            tabs={draftLayout.tabs}
            onTabsChange={(tabs) => updateLayout({ tabs })}
            selectedTabId={selectedTabId}
            onSelectTab={(id) => {
              setSelectedTabId(id);
              setRightPanel("rules");
            }}
          />

          {/* Preview or builder canvas */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {rightPanel === "preview" ? (
              <PreviewMode
                layout={draftLayout}
                previewRole={previewRole}
                previewDept={previewDept}
                previewOrgType={previewOrgType}
                onRoleChange={setPreviewRole}
                onDeptChange={setPreviewDept}
                onOrgTypeChange={setPreviewOrgType}
              />
            ) : (
              <>
                {draftLayout.sections.length === 0 && (
                  <div
                    data-ocid="alb.canvas.empty_state"
                    className="flex flex-col items-center justify-center gap-3 py-16 text-center border border-dashed border-white/10 rounded-xl"
                  >
                    <div className="p-4 rounded-2xl bg-orange-500/10">
                      <Layout size={28} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        No sections yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Add a section to start building your layout
                      </p>
                    </div>
                    <button
                      type="button"
                      data-ocid="alb.canvas.add_section_button"
                      onClick={addSection}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-orange-500/80 hover:bg-orange-500 transition-colors"
                    >
                      <Plus size={14} /> Add First Section
                    </button>
                  </div>
                )}

                {draftLayout.sections.map((section) => {
                  const sectionFields = draftLayout.fields
                    .filter((f) => f.sectionId === section.id)
                    .sort((a, b) =>
                      Number(a.sortOrder) < Number(b.sortOrder) ? -1 : 1,
                    );
                  const sdProps = sectionDnD.getItemProps(section.id, "");
                  return (
                    <div key={section.id} className="relative group">
                      <SectionCard
                        section={section}
                        fields={sectionFields}
                        allRules={draftLayout.visibilityRules ?? []}
                        isSelected={selectedSectionId === section.id}
                        onSelect={() => {
                          setSelectedSectionId(section.id);
                          setRightPanel("properties");
                        }}
                        onSectionUpdate={updateSection}
                        onFieldUpdate={updateField}
                        onFieldAdd={addField}
                        onFieldDelete={deleteField}
                        onFieldsReorder={(reordered) =>
                          reorderSectionFields(section.id, reordered)
                        }
                        dragProps={sdProps}
                      />
                      <button
                        type="button"
                        data-ocid={`alb.section.delete_button.${section.id}`}
                        onClick={() => deleteSection(section.id)}
                        className="absolute top-2.5 right-12 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-all"
                        aria-label="Delete section"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  );
                })}

                {draftLayout.sections.length > 0 && (
                  <button
                    type="button"
                    data-ocid="alb.canvas.add_section.button"
                    onClick={addSection}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-orange-500/30 text-xs font-medium text-muted-foreground/60 hover:text-orange-400 hover:bg-orange-500/[0.02] transition-all"
                  >
                    <Plus size={12} /> Add Section
                  </button>
                )}
              </>
            )}
          </div>

          {/* ForgeAI recommendations panel */}
          {rightPanel !== "preview" && (
            <ForgeAIRecommendationsPanel
              onApply={(suggestion) => {
                toast.info("ForgeAI suggestion noted", {
                  description: suggestion,
                });
              }}
            />
          )}
        </div>

        {/* ── Right panel ────────────────────────────────────────────── */}
        <aside className="w-[260px] flex-shrink-0 border-l border-white/[0.07] bg-card/40 hidden lg:flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              {rightPanel === "properties" && (
                <Layers size={12} className="text-orange-400" />
              )}
              {rightPanel === "rules" && (
                <Shield size={12} className="text-orange-400" />
              )}
              {rightPanel === "assignment" && (
                <Users size={12} className="text-orange-400" />
              )}
              {rightPanel === "preview" && (
                <Eye size={12} className="text-orange-400" />
              )}
              <span className="text-xs font-semibold text-foreground capitalize">
                {rightPanel === "rules"
                  ? "Visibility Rules"
                  : rightPanel === "assignment"
                    ? "Layout Assignment"
                    : rightPanel}
              </span>
            </div>
          </div>

          <div className="p-3 flex-1 space-y-4">
            {/* Properties */}
            {rightPanel === "properties" && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Layout Description
                  </label>
                  <textarea
                    value={draftLayout.description}
                    onChange={(e) =>
                      updateLayout({ description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-2.5 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-orange-500/50"
                    placeholder="Describe this layout…"
                  />
                </div>

                {selectedSection && (
                  <div className="pt-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 mb-2">
                      <ChevronRight size={11} className="text-orange-400" />
                      <span className="text-xs font-semibold text-foreground">
                        Selected: {selectedSection.title}
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSection.collapsible}
                        onChange={(e) =>
                          updateSection({
                            ...selectedSection,
                            collapsible: e.target.checked,
                          })
                        }
                        className="accent-orange-500"
                      />
                      <span className="text-xs text-muted-foreground">
                        Collapsible section
                      </span>
                    </label>
                  </div>
                )}

                {/* Tab role visibility */}
                {selectedTabId &&
                  (() => {
                    const tab = draftLayout.tabs.find(
                      (t) => t.id === selectedTabId,
                    );
                    if (!tab) return null;
                    return (
                      <div className="pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1.5 mb-2">
                          <ChevronRight size={11} className="text-orange-400" />
                          <span className="text-xs font-semibold text-foreground">
                            Tab: {tab.tabLabel}
                          </span>
                        </div>
                        <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">
                          Hide from Roles
                        </label>
                        <div className="space-y-1">
                          {ROLES.map((r) => (
                            <label
                              key={r}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={tab.hiddenForRoles.includes(r)}
                                onChange={(e) => {
                                  const hiddenForRoles = e.target.checked
                                    ? [...tab.hiddenForRoles, r]
                                    : tab.hiddenForRoles.filter((x) => x !== r);
                                  updateLayout({
                                    tabs: draftLayout.tabs.map((t) =>
                                      t.id === tab.id
                                        ? { ...t, hiddenForRoles }
                                        : t,
                                    ),
                                  });
                                }}
                                className="accent-orange-500"
                              />
                              <span className="text-xs text-muted-foreground">
                                {r}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Info size={11} className="text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      Layout info
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Sections</span>
                      <span className="text-foreground font-medium">
                        {draftLayout.sections.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fields</span>
                      <span className="text-foreground font-medium">
                        {draftLayout.fields.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tabs</span>
                      <span className="text-foreground font-medium">
                        {draftLayout.tabs.filter((t) => t.isVisible).length}{" "}
                        visible
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rules</span>
                      <span className="text-foreground font-medium">
                        {(draftLayout.visibilityRules ?? []).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Visibility Rules */}
            {rightPanel === "rules" && (
              <VisibilityRuleBuilder
                targetId={selectedSectionId ?? selectedTabId ?? draftLayout.id}
                targetType={
                  selectedSectionId
                    ? VisibilityTargetType.Section
                    : VisibilityTargetType.Field
                }
                existingRules={(draftLayout.visibilityRules ?? []).filter(
                  (r) =>
                    r.targetId ===
                    (selectedSectionId ?? selectedTabId ?? draftLayout.id),
                )}
                onSave={saveRule}
                onDelete={deleteRule}
              />
            )}

            {/* Assignment */}
            {rightPanel === "assignment" && (
              <AssignmentPanel
                assignment={assignment}
                onChange={setAssignment}
                onSave={() => {
                  toast.success("Layout assignment saved", {
                    description: `Assigned to ${
                      [
                        assignment.orgType,
                        assignment.department,
                        assignment.role,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "All users"
                    }`,
                  });
                }}
              />
            )}

            {/* Preview info when panel = preview */}
            {rightPanel === "preview" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/[0.06] border border-orange-500/15">
                  <Eye size={12} className="text-orange-400 flex-shrink-0" />
                  <p className="text-[11px] text-muted-foreground">
                    Preview mode shows how this layout renders for different
                    roles, departments, and org types.
                  </p>
                </div>
                <div className="text-[10px] text-muted-foreground space-y-1.5 pt-2">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={9} className="text-emerald-400" />{" "}
                    Visibility rules applied
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={9} className="text-emerald-400" />{" "}
                    Hidden fields filtered
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle2 size={9} className="text-emerald-400" /> Tab
                    visibility respected
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
