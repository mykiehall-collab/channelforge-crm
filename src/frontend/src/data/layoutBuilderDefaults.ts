/**
 * layoutBuilderDefaults — rich seed data for the Account Layout Builder
 * and Dashboard Customization system.
 *
 * Provides:
 *   WIDGET_CATALOG           — 20 widget catalog entries
 *   FIELD_TYPE_META          — 18 field type metadata entries
 *   DEFAULT_ACCOUNT_LAYOUT   — full layout with 3 sections and 8 tabs
 *   PREBUILT_LAYOUTS         — 7 org/team-specific layout templates
 *   DEFAULT_DASHBOARD_TEMPLATES — 5 dashboard templates
 *   PERMISSION_DEFAULTS      — default permission flags (all OFF)
 *   PREBUILT_LAYOUT_NAMES    — display names for prebuilt keys
 *   FORGEAI_LAYOUT_SUGGESTIONS — 12 ForgeAI layout recommendations
 */

import {
  DashboardTemplateType,
  FieldType,
  WidgetSize,
  WidgetType,
} from "@/backend";
import type {
  FieldTypeMeta,
  ForgeAILayoutSuggestion,
  WidgetCatalogItem,
} from "@/types/layoutBuilder";
import type {
  AccountLayout,
  DashboardLayout,
  LayoutPermissions,
} from "@/types/layoutBuilder";

// ---------------------------------------------------------------------------
// Widget catalog
// ---------------------------------------------------------------------------

export const WIDGET_CATALOG: WidgetCatalogItem[] = [
  {
    type: WidgetType.KpiCard,
    name: "KPI Card",
    description: "Single metric tile with trend indicator and sparkline.",
    category: "KPI",
    defaultSize: WidgetSize.Small,
  },
  {
    type: WidgetType.LineGraph,
    name: "Line Graph",
    description:
      "Time-series trend visualization for revenue, renewals, or activity.",
    category: "Charts",
    defaultSize: WidgetSize.Wide,
  },
  {
    type: WidgetType.BarChart,
    name: "Bar Chart",
    description:
      "Comparative bar chart for pipeline stages, reseller performance, or MDF spend.",
    category: "Charts",
    defaultSize: WidgetSize.Medium,
  },
  {
    type: WidgetType.PipelineBoard,
    name: "Pipeline Board",
    description:
      "Kanban-style deal pipeline overview across all active stages.",
    category: "Operations",
    defaultSize: WidgetSize.FullWidth,
  },
  {
    type: WidgetType.AccountHealth,
    name: "Account Health Panel",
    description:
      "Risk-scored health overview for key accounts in your territory.",
    category: "Operations",
    defaultSize: WidgetSize.Medium,
  },
  {
    type: WidgetType.AiInsights,
    name: "AI Insight Panel",
    description:
      "ForgeAI recommendations, risk signals, and next-best actions.",
    category: "AI",
    defaultSize: WidgetSize.Wide,
  },
  {
    type: WidgetType.ActivityFeed,
    name: "Activity Feed",
    description:
      "Unified timeline of account changes, messages, and approvals.",
    category: "Operations",
    defaultSize: WidgetSize.Tall,
  },
  {
    type: WidgetType.RenewalTracker,
    name: "Renewal Tracker",
    description:
      "Upcoming renewals sorted by risk and value with AI risk scores.",
    category: "Operations",
    defaultSize: WidgetSize.Wide,
  },
  {
    type: WidgetType.OpportunitySummary,
    name: "Opportunity Summary",
    description: "Pipeline value by stage with win-rate and weighted forecast.",
    category: "Operations",
    defaultSize: WidgetSize.Medium,
  },
  {
    type: WidgetType.MessagingWidget,
    name: "Messaging Widget",
    description:
      "Recent conversations and unread messages across linked accounts.",
    category: "Operations",
    defaultSize: WidgetSize.Medium,
  },
  {
    type: WidgetType.SlaTracking,
    name: "SLA Tracking",
    description: "Response time, escalation, and resolution SLA metrics.",
    category: "Operations",
    defaultSize: WidgetSize.Medium,
  },
  {
    type: WidgetType.Forecasting,
    name: "Forecasting Widget",
    description: "AI-assisted revenue forecast with confidence intervals.",
    category: "AI",
    defaultSize: WidgetSize.Wide,
  },
  {
    type: WidgetType.OperationalAlerts,
    name: "Operational Alerts",
    description:
      "High-priority alerts: stalled deals, at-risk accounts, overdue tasks.",
    category: "Operations",
    defaultSize: WidgetSize.Medium,
  },
  {
    type: WidgetType.TerritoryPerformance,
    name: "Territory Performance",
    description:
      "KPI breakdown by territory for renewals, pipeline, and engagement.",
    category: "KPI",
    defaultSize: WidgetSize.Wide,
  },
  {
    type: WidgetType.MdfTracking,
    name: "MDF Tracking Widget",
    description:
      "Market development fund usage, approval status, and available balance.",
    category: "Operations",
    defaultSize: WidgetSize.Medium,
  },
  {
    type: WidgetType.ResellerPerformance,
    name: "Reseller Performance",
    description:
      "QTD revenue, deal registrations, and engagement scores per reseller.",
    category: "KPI",
    defaultSize: WidgetSize.Wide,
  },
  {
    type: WidgetType.DistributorPerformance,
    name: "Distributor Performance",
    description:
      "Distributor-level pipeline health, revenue, and reseller network activity.",
    category: "KPI",
    defaultSize: WidgetSize.Wide,
  },
  {
    type: WidgetType.AiUsage,
    name: "AI Usage Widget",
    description:
      "ForgeAI credit consumption, query volume, and model usage breakdown.",
    category: "AI",
    defaultSize: WidgetSize.Medium,
  },
  {
    type: WidgetType.ComputeStorage,
    name: "Compute & Storage Usage",
    description:
      "Infrastructure credit burn rate, storage growth, and compute trends.",
    category: "Infrastructure",
    defaultSize: WidgetSize.Wide,
  },
  {
    type: WidgetType.Custom,
    name: "Custom Widget",
    description:
      "Build a fully custom widget with your own data source and display.",
    category: "Operations",
    defaultSize: WidgetSize.Medium,
  },
];

// ---------------------------------------------------------------------------
// Field type metadata
// ---------------------------------------------------------------------------

export const FIELD_TYPE_META: Record<FieldType, FieldTypeMeta> = {
  [FieldType.Text]: {
    label: "Text",
    icon: "T",
    description: "Single-line text input.",
    hasOptions: false,
  },
  [FieldType.LongText]: {
    label: "Long Text",
    icon: "📝",
    description: "Multi-line text area for notes and descriptions.",
    hasOptions: false,
  },
  [FieldType.Number]: {
    label: "Number",
    icon: "#",
    description: "Numeric value with optional decimal.",
    hasOptions: false,
  },
  [FieldType.Currency]: {
    label: "Currency",
    icon: "£",
    description: "Monetary value with currency selector.",
    hasOptions: false,
  },
  [FieldType.Percentage]: {
    label: "Percentage",
    icon: "%",
    description: "Percentage value 0–100.",
    hasOptions: false,
  },
  [FieldType.Dropdown]: {
    label: "Dropdown",
    icon: "▾",
    description: "Single selection from a predefined list.",
    hasOptions: true,
  },
  [FieldType.MultiSelect]: {
    label: "Multi-Select",
    icon: "☰",
    description: "Multiple selections from a predefined list.",
    hasOptions: true,
  },
  [FieldType.Date_]: {
    label: "Date",
    icon: "📅",
    description: "Calendar date picker.",
    hasOptions: false,
  },
  [FieldType.DateTime]: {
    label: "Date & Time",
    icon: "🕐",
    description: "Date and time picker.",
    hasOptions: false,
  },
  [FieldType.Checkbox]: {
    label: "Checkbox",
    icon: "✓",
    description: "Boolean true/false toggle.",
    hasOptions: false,
  },
  [FieldType.Url]: {
    label: "URL",
    icon: "🔗",
    description: "Web address with validation.",
    hasOptions: false,
  },
  [FieldType.Email]: {
    label: "Email",
    icon: "@",
    description: "Email address with format validation.",
    hasOptions: false,
  },
  [FieldType.Phone]: {
    label: "Phone",
    icon: "📞",
    description: "Phone number with regional format.",
    hasOptions: false,
  },
  [FieldType.Attachment]: {
    label: "Attachment",
    icon: "📎",
    description: "File upload with object storage support.",
    hasOptions: false,
  },
  [FieldType.Tag]: {
    label: "Tag",
    icon: "🏷",
    description: "Freeform tags for categorization and filtering.",
    hasOptions: false,
  },
  [FieldType.RegionSelector]: {
    label: "Region Selector",
    icon: "🌍",
    description: "Country and region picker.",
    hasOptions: false,
  },
  [FieldType.UserSelector]: {
    label: "User Selector",
    icon: "👤",
    description: "Select a user from the workspace.",
    hasOptions: false,
  },
  [FieldType.OrgSelector]: {
    label: "Organization Selector",
    icon: "🏢",
    description: "Select a Vendor, Distributor, or Reseller.",
    hasOptions: false,
  },
};

// ---------------------------------------------------------------------------
// Default account layout
// ---------------------------------------------------------------------------

export const DEFAULT_ACCOUNT_LAYOUT: AccountLayout = {
  id: "default-layout",
  name: "Standard Account Layout",
  description: "Default layout for all account types.",
  createdAt: BigInt(0),
  updatedAt: BigInt(0),
  createdBy: "system",
  isDefault: true,
  version: BigInt(1),
  visibilityRules: [],
  tabs: [
    {
      id: "tab-overview",
      tabLabel: "Overview",
      sortOrder: BigInt(0),
      isVisible: true,
      isCustom: false,
      hiddenForRoles: [],
      hiddenForDepts: [],
    },
    {
      id: "tab-contacts",
      tabLabel: "Contacts",
      sortOrder: BigInt(1),
      isVisible: true,
      isCustom: false,
      hiddenForRoles: [],
      hiddenForDepts: [],
    },
    {
      id: "tab-opportunities",
      tabLabel: "Opportunities",
      sortOrder: BigInt(2),
      isVisible: true,
      isCustom: false,
      hiddenForRoles: [],
      hiddenForDepts: [],
    },
    {
      id: "tab-renewals",
      tabLabel: "Renewals",
      sortOrder: BigInt(3),
      isVisible: true,
      isCustom: false,
      hiddenForRoles: [],
      hiddenForDepts: [],
    },
    {
      id: "tab-activity",
      tabLabel: "Activity Timeline",
      sortOrder: BigInt(4),
      isVisible: true,
      isCustom: false,
      hiddenForRoles: [],
      hiddenForDepts: [],
    },
    {
      id: "tab-notes",
      tabLabel: "Notes",
      sortOrder: BigInt(5),
      isVisible: true,
      isCustom: false,
      hiddenForRoles: [],
      hiddenForDepts: [],
    },
    {
      id: "tab-documents",
      tabLabel: "Documents",
      sortOrder: BigInt(6),
      isVisible: true,
      isCustom: false,
      hiddenForRoles: [],
      hiddenForDepts: [],
    },
    {
      id: "tab-ai",
      tabLabel: "AI Insights",
      sortOrder: BigInt(7),
      isVisible: true,
      isCustom: false,
      hiddenForRoles: [],
      hiddenForDepts: [],
    },
  ],
  sections: [
    {
      id: "section-overview",
      title: "Account Overview",
      sortOrder: BigInt(0),
      collapsible: false,
      fieldIds: [
        "f-name",
        "f-domain",
        "f-status",
        "f-owner",
        "f-renewal",
        "f-health",
      ],
    },
    {
      id: "section-renewals",
      title: "Renewal Information",
      sortOrder: BigInt(1),
      collapsible: true,
      fieldIds: [
        "f-renewal-date",
        "f-renewal-value",
        "f-renewal-risk",
        "f-contract-type",
      ],
    },
    {
      id: "section-contacts",
      title: "Key Contacts",
      sortOrder: BigInt(2),
      collapsible: true,
      fieldIds: ["f-primary-contact", "f-exec-sponsor", "f-tech-contact"],
    },
  ],
  fields: [
    {
      id: "f-name",
      fieldLabel: "Account Name",
      fieldType: FieldType.Text,
      sortOrder: BigInt(0),
      visible: true,
      required: true,
      options: [],
      sectionId: "section-overview",
    },
    {
      id: "f-domain",
      fieldLabel: "Customer Domain",
      fieldType: FieldType.Url,
      sortOrder: BigInt(1),
      visible: true,
      required: true,
      options: [],
      sectionId: "section-overview",
    },
    {
      id: "f-status",
      fieldLabel: "Account Status",
      fieldType: FieldType.Dropdown,
      sortOrder: BigInt(2),
      visible: true,
      required: false,
      options: ["Active", "AtRisk", "Churned", "Prospect"],
      sectionId: "section-overview",
    },
    {
      id: "f-owner",
      fieldLabel: "Account Owner",
      fieldType: FieldType.UserSelector,
      sortOrder: BigInt(3),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-overview",
    },
    {
      id: "f-renewal",
      fieldLabel: "Renewal Date",
      fieldType: FieldType.Date_,
      sortOrder: BigInt(4),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-overview",
    },
    {
      id: "f-health",
      fieldLabel: "Account Health Score",
      fieldType: FieldType.Number,
      sortOrder: BigInt(5),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-overview",
    },
    {
      id: "f-renewal-date",
      fieldLabel: "Renewal Date",
      fieldType: FieldType.Date_,
      sortOrder: BigInt(0),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-renewals",
    },
    {
      id: "f-renewal-value",
      fieldLabel: "Estimated Renewal Value",
      fieldType: FieldType.Currency,
      sortOrder: BigInt(1),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-renewals",
    },
    {
      id: "f-renewal-risk",
      fieldLabel: "Renewal Risk",
      fieldType: FieldType.Dropdown,
      sortOrder: BigInt(2),
      visible: true,
      required: false,
      options: ["Low", "Medium", "High", "Critical"],
      sectionId: "section-renewals",
    },
    {
      id: "f-contract-type",
      fieldLabel: "Contract Type",
      fieldType: FieldType.Text,
      sortOrder: BigInt(3),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-renewals",
    },
    {
      id: "f-primary-contact",
      fieldLabel: "Primary Contact",
      fieldType: FieldType.UserSelector,
      sortOrder: BigInt(0),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-contacts",
    },
    {
      id: "f-exec-sponsor",
      fieldLabel: "Executive Sponsor",
      fieldType: FieldType.UserSelector,
      sortOrder: BigInt(1),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-contacts",
    },
    {
      id: "f-tech-contact",
      fieldLabel: "Technical Contact",
      fieldType: FieldType.UserSelector,
      sortOrder: BigInt(2),
      visible: true,
      required: false,
      options: [],
      sectionId: "section-contacts",
    },
  ],
};

// ---------------------------------------------------------------------------
// Prebuilt layout templates (keyed by org/team type)
// ---------------------------------------------------------------------------

const makeLayout = (
  id: string,
  name: string,
  description: string,
  hiddenTabs: string[],
  hiddenFields: string[],
): AccountLayout => ({
  ...DEFAULT_ACCOUNT_LAYOUT,
  id,
  name,
  description,
  isDefault: false,
  tabs: DEFAULT_ACCOUNT_LAYOUT.tabs.map((t) => ({
    ...t,
    isVisible: !hiddenTabs.includes(t.id),
  })),
  fields: DEFAULT_ACCOUNT_LAYOUT.fields.map((f) => ({
    ...f,
    visible: !hiddenFields.includes(f.id),
  })),
});

export const PREBUILT_LAYOUTS: Record<string, AccountLayout> = {
  vendor: makeLayout(
    "tpl-vendor",
    "Vendor Account Layout",
    "Optimised for Vendor account management and governance.",
    [],
    [],
  ),
  distributor: makeLayout(
    "tpl-distributor",
    "Distributor Account Layout",
    "Focused on Distributor-managed accounts with reseller visibility.",
    ["tab-ai"],
    ["f-tech-contact"],
  ),
  reseller: makeLayout(
    "tpl-reseller",
    "Reseller Account Layout",
    "Streamlined view for Reseller account records.",
    ["tab-ai", "tab-documents"],
    ["f-health", "f-exec-sponsor"],
  ),
  sales: makeLayout(
    "tpl-sales",
    "Sales Team Layout",
    "Pipeline, renewals, and opportunity-focused fields for Sales.",
    ["tab-notes", "tab-documents"],
    ["f-tech-contact"],
  ),
  marketing: makeLayout(
    "tpl-marketing",
    "Marketing Team Layout",
    "Engagement, MDF, and campaign-focused account view.",
    ["tab-ai"],
    ["f-renewal-risk", "f-contract-type"],
  ),
  leadership: makeLayout(
    "tpl-leadership",
    "Leadership View",
    "Strategic KPIs, forecast, and account health for leadership.",
    ["tab-documents"],
    ["f-domain", "f-primary-contact", "f-tech-contact"],
  ),
  salesops: makeLayout(
    "tpl-salesops",
    "Sales Ops Layout",
    "Territory, pricing, and operational governance for Sales Ops.",
    [],
    ["f-exec-sponsor"],
  ),
};

export const PREBUILT_LAYOUT_NAMES: Record<string, string> = {
  vendor: "Vendor Account Layout",
  distributor: "Distributor Account Layout",
  reseller: "Reseller Account Layout",
  sales: "Sales Team Layout",
  marketing: "Marketing Team Layout",
  leadership: "Leadership View",
  salesops: "Sales Ops Layout",
};

// ---------------------------------------------------------------------------
// Default dashboard templates
// ---------------------------------------------------------------------------

const makeWidget = (
  widgetId: string,
  title: string,
  type: WidgetType,
  size: WidgetSize,
  posX: number,
  posY: number,
) => ({
  widgetId,
  title,
  widgetType: type,
  size,
  posX: BigInt(posX),
  posY: BigInt(posY),
  isPinned: false,
  aiSummaryEnabled: false,
  roleFilter: [],
  deptFilter: [],
  customConfig: "{}",
});

export const DEFAULT_DASHBOARD_TEMPLATES: DashboardLayout[] = [
  {
    id: "tpl-dashboard-executive",
    name: "Executive Dashboard",
    description:
      "High-level KPIs, account health, AI forecast, and renewal risk for leadership.",
    isTemplate: true,
    templateType: DashboardTemplateType.Role,
    assignedTo: ["VendorPrimaryAdmin", "VendorAdmin"],
    createdBy: "system",
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
    widgets: [
      makeWidget(
        "w-kpi-renewal",
        "Renewal Revenue",
        WidgetType.KpiCard,
        WidgetSize.Small,
        0,
        0,
      ),
      makeWidget(
        "w-kpi-pipeline",
        "Active Pipeline",
        WidgetType.KpiCard,
        WidgetSize.Small,
        1,
        0,
      ),
      makeWidget(
        "w-kpi-health",
        "Avg Account Health",
        WidgetType.KpiCard,
        WidgetSize.Small,
        2,
        0,
      ),
      makeWidget(
        "w-forecast",
        "Revenue Forecast",
        WidgetType.Forecasting,
        WidgetSize.Wide,
        0,
        1,
      ),
      makeWidget(
        "w-renewal",
        "Renewal Tracker",
        WidgetType.RenewalTracker,
        WidgetSize.Wide,
        2,
        1,
      ),
      makeWidget(
        "w-ai",
        "ForgeAI Insights",
        WidgetType.AiInsights,
        WidgetSize.Medium,
        0,
        2,
      ),
    ],
  },
  {
    id: "tpl-dashboard-sales",
    name: "Sales Team Dashboard",
    description:
      "Pipeline board, opportunity summary, activity feed, and renewal tracking for Sales.",
    isTemplate: true,
    templateType: DashboardTemplateType.Department,
    assignedTo: ["Sales"],
    createdBy: "system",
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
    widgets: [
      makeWidget(
        "s-pipeline",
        "Deal Pipeline",
        WidgetType.PipelineBoard,
        WidgetSize.FullWidth,
        0,
        0,
      ),
      makeWidget(
        "s-opps",
        "Opportunity Summary",
        WidgetType.OpportunitySummary,
        WidgetSize.Medium,
        0,
        1,
      ),
      makeWidget(
        "s-activity",
        "Activity Feed",
        WidgetType.ActivityFeed,
        WidgetSize.Tall,
        2,
        1,
      ),
      makeWidget(
        "s-renewal",
        "Renewal Tracker",
        WidgetType.RenewalTracker,
        WidgetSize.Wide,
        0,
        2,
      ),
      makeWidget(
        "s-alerts",
        "Operational Alerts",
        WidgetType.OperationalAlerts,
        WidgetSize.Medium,
        2,
        2,
      ),
    ],
  },
  {
    id: "tpl-dashboard-marketing",
    name: "Marketing Dashboard",
    description:
      "MDF tracking, campaign performance, and engagement analytics for Marketing.",
    isTemplate: true,
    templateType: DashboardTemplateType.Department,
    assignedTo: ["Marketing"],
    createdBy: "system",
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
    widgets: [
      makeWidget(
        "m-mdf",
        "MDF Performance",
        WidgetType.MdfTracking,
        WidgetSize.Wide,
        0,
        0,
      ),
      makeWidget(
        "m-reseller",
        "Reseller Performance",
        WidgetType.ResellerPerformance,
        WidgetSize.Wide,
        2,
        0,
      ),
      makeWidget(
        "m-territory",
        "Territory Performance",
        WidgetType.TerritoryPerformance,
        WidgetSize.Wide,
        0,
        1,
      ),
      makeWidget(
        "m-ai",
        "Campaign AI Insights",
        WidgetType.AiInsights,
        WidgetSize.Medium,
        2,
        1,
      ),
    ],
  },
  {
    id: "tpl-dashboard-operations",
    name: "Operations Dashboard",
    description:
      "SLA tracking, account health, messaging, and alerts for Ops teams.",
    isTemplate: true,
    templateType: DashboardTemplateType.Department,
    assignedTo: ["Operations", "SalesOps"],
    createdBy: "system",
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
    widgets: [
      makeWidget(
        "o-sla",
        "SLA Performance",
        WidgetType.SlaTracking,
        WidgetSize.Wide,
        0,
        0,
      ),
      makeWidget(
        "o-health",
        "Account Health",
        WidgetType.AccountHealth,
        WidgetSize.Medium,
        2,
        0,
      ),
      makeWidget(
        "o-alerts",
        "Operational Alerts",
        WidgetType.OperationalAlerts,
        WidgetSize.Medium,
        0,
        1,
      ),
      makeWidget(
        "o-messaging",
        "Messaging",
        WidgetType.MessagingWidget,
        WidgetSize.Medium,
        2,
        1,
      ),
      makeWidget(
        "o-distributor",
        "Distributor Performance",
        WidgetType.DistributorPerformance,
        WidgetSize.Wide,
        0,
        2,
      ),
    ],
  },
  {
    id: "tpl-dashboard-it",
    name: "IT & Infrastructure Dashboard",
    description:
      "Compute usage, AI consumption, and infrastructure health for IT admins.",
    isTemplate: true,
    templateType: DashboardTemplateType.Department,
    assignedTo: ["IT", "VendorPrimaryAdmin"],
    createdBy: "system",
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
    widgets: [
      makeWidget(
        "i-compute",
        "Compute & Storage",
        WidgetType.ComputeStorage,
        WidgetSize.Wide,
        0,
        0,
      ),
      makeWidget(
        "i-ai",
        "AI Usage",
        WidgetType.AiUsage,
        WidgetSize.Medium,
        2,
        0,
      ),
      makeWidget(
        "i-alerts",
        "Operational Alerts",
        WidgetType.OperationalAlerts,
        WidgetSize.Medium,
        0,
        1,
      ),
    ],
  },
];

// ---------------------------------------------------------------------------
// Permission defaults
// ---------------------------------------------------------------------------

export const PERMISSION_DEFAULTS: LayoutPermissions = {
  canManageLayouts: false,
  canManageWidgets: false,
  canManageDashboardTemplates: false,
  canManageCustomFields: false,
};

// ---------------------------------------------------------------------------
// ForgeAI layout suggestions
// ---------------------------------------------------------------------------

export const FORGEAI_LAYOUT_SUGGESTIONS: ForgeAILayoutSuggestion[] = [
  {
    role: "Sales",
    suggestion:
      "Sales users in EMEA frequently use the Renewal Risk field on the Overview section.",
  },
  {
    role: "Marketing",
    suggestion:
      "Marketing teams commonly pin MDF Performance panels in their dashboards.",
  },
  {
    role: "Leadership",
    suggestion:
      "Leadership views with AI Insights tabs see 34% higher strategic review completion rates.",
  },
  {
    role: "Sales Ops",
    suggestion:
      "Sales Ops teams benefit from displaying Territory and Account Owner fields at the top of the Overview section.",
  },
  {
    role: "Reseller",
    suggestion:
      "Reseller account layouts typically hide the Executive Sponsor field to reduce noise.",
  },
  {
    role: "Distributor",
    suggestion:
      "Distributor admins often enable the Renewal Information section for all accounts by default.",
  },
  {
    role: "Vendor",
    suggestion:
      "Vendor layouts with all 8 tabs visible achieve the highest data completeness scores.",
  },
  {
    role: "IT",
    suggestion:
      "IT teams benefit from adding a Customer Domain and Integration Status section to account layouts.",
  },
  {
    role: "Sales",
    suggestion:
      "Forecast visibility fields should be shown only to Sales and Leadership roles per governance best practices.",
  },
  {
    role: "Leadership",
    suggestion:
      "Accounts with an AI Insights tab assigned to Leadership roles see 28% faster renewal decisions.",
  },
  {
    role: "Marketing",
    suggestion:
      "Adding the MDF Activity tab to Reseller account views improves partner engagement tracking.",
  },
  {
    role: "Sales Ops",
    suggestion:
      "Role-based conditional rules on the Pricing section reduce data exposure for non-Sales Ops users.",
  },
];
