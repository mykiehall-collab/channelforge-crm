/**
 * Layout Builder Types
 * Re-exports backend types and defines UI-only state types for the
 * Account Layout Builder and Dashboard Customization system.
 */

import type {
  AccountLayout,
  AccountTab,
  DashboardLayout,
  LayoutAuditEntry,
  LayoutField,
  LayoutPermissions,
  LayoutSection,
  VisibilityRule__1,
  WidgetConfig,
} from "@/backend";

// Re-export backend types with friendly aliases
export type {
  AccountLayout,
  AccountTab,
  DashboardLayout,
  LayoutAuditEntry,
  LayoutField,
  LayoutPermissions,
  LayoutSection,
  WidgetConfig,
};

/** Backend type alias: VisibilityRule__1 is the layout-specific visibility rule */
export type VisibilityRule = VisibilityRule__1;

// Re-export backend enums
export {
  DashboardTemplateType,
  FieldType,
  VisibilityConditionType,
  VisibilityOperator,
  VisibilityRuleAction,
  VisibilityTargetType,
  WidgetSize,
  WidgetType,
} from "@/backend";

// ---------------------------------------------------------------------------
// Layout Assignment
// ---------------------------------------------------------------------------

/** Criteria used to dynamically assign a layout to users */
export interface LayoutAssignment {
  layoutId: string;
  orgType?: "Vendor" | "Distributor" | "Reseller";
  department?: string;
  role?: string;
  territory?: string;
  marketSegment?: string;
}

// ---------------------------------------------------------------------------
// UI-only state types
// ---------------------------------------------------------------------------

/**
 * Ephemeral state for the Account Layout Builder panel.
 * Not persisted to backend — purely for UI interaction.
 */
export interface LayoutBuilderState {
  currentLayout: AccountLayout | null;
  isDirty: boolean;
  selectedFieldId: string | null;
  selectedSectionId: string | null;
  /** Role to simulate in the layout preview */
  previewRole: string;
  /** Department to simulate in the layout preview */
  previewDept: string;
  /** Org type to simulate in the layout preview */
  previewOrgType: string;
}

/**
 * Ephemeral state for the Dashboard Layout Builder.
 * Not persisted to backend — purely for UI interaction.
 */
export interface DashboardBuilderState {
  currentDashboard: DashboardLayout | null;
  editingWidgetId: string | null;
  addWidgetOpen: boolean;
}

/**
 * Display metadata for a FieldType, used in the field type picker UI.
 */
export interface FieldTypeMeta {
  /** Human-readable label shown in the UI */
  label: string;
  /** Emoji or icon identifier */
  icon: string;
  /** Short description of the field type */
  description: string;
  /** Whether this field type supports configuring allowed option values */
  hasOptions: boolean;
}

/**
 * A widget catalog entry shown in the "Add Widget" dialog.
 */
export interface WidgetCatalogItem {
  type: string;
  name: string;
  description: string;
  /** Grouping category shown in the catalog: KPI | Charts | Operations | AI | Infrastructure */
  category: "KPI" | "Charts" | "Operations" | "AI" | "Infrastructure";
  /** Backend WidgetSize value used as the default size */
  defaultSize: string;
}

/**
 * A prebuilt layout template available to admins.
 */
export interface LayoutTemplate {
  key: string;
  name: string;
  description: string;
  orgType?: "Vendor" | "Distributor" | "Reseller";
  teamType?: string;
  layout: AccountLayout;
}

/**
 * A ForgeAI recommendation shown inside the layout builder.
 */
export interface ForgeAILayoutSuggestion {
  role: string;
  suggestion: string;
}
