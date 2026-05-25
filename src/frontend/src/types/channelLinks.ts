export type ChannelLinkStatus = "Pending" | "Active" | "Suspended" | "Revoked";

export type ChannelLinkDirection =
  | "VendorToDistributor"
  | "VendorToReseller"
  | "DistributorToReseller"
  | "DistributorToVendor"
  | "ResellerToVendor"
  | "ResellerToDistributor";

export type PermissionTemplateType =
  | "View Only"
  | "Collaborator"
  | "MDF Contributor"
  | "Sales Reporting Access"
  | "Renewal Management Access"
  | "Deal Registration Access"
  | "Executive Dashboard Access"
  | "Custom Access";

export type SectionAccessLevel =
  | "hidden"
  | "read-only"
  | "comment"
  | "edit"
  | "admin-only";

export type VisibilityTag =
  | "private"
  | "shared"
  | "restricted"
  | "external-only"
  | "internal-only";

export type AccountDataSection =
  | "Account Summary"
  | "Renewal Dates"
  | "Opportunity Pipeline"
  | "Deal Registrations"
  | "MDF Requests"
  | "Pricing/Promotions"
  | "Internal Notes"
  | "External Shared Notes"
  | "Sales Tasks"
  | "Escalations"
  | "Reports"
  | "Dashboards"
  | "Forecasting"
  | "Stakeholder Mapping"
  | "ForgeAI Insights";

export type OrgTag = "VENDOR" | "DISTRIBUTOR" | "RESELLER";

export type ForgeAIAccessLevel = "none" | "basic" | "operational" | "full";

export interface ChannelLink {
  id: string;
  orgName: string;
  orgType: OrgTag;
  linkedOrgId: string;
  linkedOrgName: string;
  linkedOrgType: OrgTag;
  status: ChannelLinkStatus;
  direction: ChannelLinkDirection;
  templateName: string;
  templateId: string;
  invitedBy: string;
  invitedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  expiresAt?: string;
  domainVerified: boolean;
  mfaRequired: boolean;
}

export interface PermissionTemplate {
  id: string;
  name: PermissionTemplateType;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  isCustom: boolean;
  sectionPermissions: Record<AccountDataSection, SectionAccessLevel>;
  forgeAIAccess: ForgeAIAccessLevel;
  canExport: boolean;
  canShareDashboards: boolean;
  canManageMDF: boolean;
  canViewPricing: boolean;
  canViewInternalNotes: boolean;
}

export interface AccountChannelLinkOverride {
  overrideId: string;
  channelLinkId: string;
  accountId: string;
  accountName: string;
  sectionPermissions: Partial<Record<AccountDataSection, SectionAccessLevel>>;
  forgeAIAccess: ForgeAIAccessLevel;
  updatedBy: string;
  updatedAt: string;
}

export interface ChannelLinkAuditEntry {
  entryId: string;
  channelLinkId: string;
  actorId: string;
  actorName: string;
  actorOrg: string;
  action: string;
  targetSection?: AccountDataSection;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress?: string;
  sessionId?: string;
}

export interface MdfComment {
  commentId: string;
  mdfRequestId: string;
  authorId: string;
  authorName: string;
  authorOrgTag: OrgTag;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isInternal: boolean;
  isShared: boolean;
  parentCommentId?: string;
  attachments?: string[];
}

export interface SharedDashboard {
  dashboardId: string;
  name: string;
  description: string;
  ownerOrgId: string;
  ownerOrgName: string;
  sharedWithOrgId: string;
  sharedWithOrgName: string;
  channelLinkId: string;
  widgets: string[];
  filters: Record<string, string>;
  allowedRoles: string[];
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ACCOUNT_DATA_SECTIONS: AccountDataSection[] = [
  "Account Summary",
  "Renewal Dates",
  "Opportunity Pipeline",
  "Deal Registrations",
  "MDF Requests",
  "Pricing/Promotions",
  "Internal Notes",
  "External Shared Notes",
  "Sales Tasks",
  "Escalations",
  "Reports",
  "Dashboards",
  "Forecasting",
  "Stakeholder Mapping",
  "ForgeAI Insights",
];

export const SECTION_VISIBILITY_TAGS: Record<
  AccountDataSection,
  VisibilityTag
> = {
  "Account Summary": "shared",
  "Renewal Dates": "shared",
  "Opportunity Pipeline": "restricted",
  "Deal Registrations": "restricted",
  "MDF Requests": "shared",
  "Pricing/Promotions": "private",
  "Internal Notes": "internal-only",
  "External Shared Notes": "external-only",
  "Sales Tasks": "restricted",
  Escalations: "private",
  Reports: "restricted",
  Dashboards: "restricted",
  Forecasting: "private",
  "Stakeholder Mapping": "shared",
  "ForgeAI Insights": "restricted",
};

export const DEFAULT_TEMPLATE_PERMISSIONS: Record<
  AccountDataSection,
  SectionAccessLevel
> = {
  "Account Summary": "read-only",
  "Renewal Dates": "read-only",
  "Opportunity Pipeline": "read-only",
  "Deal Registrations": "read-only",
  "MDF Requests": "read-only",
  "Pricing/Promotions": "hidden",
  "Internal Notes": "hidden",
  "External Shared Notes": "comment",
  "Sales Tasks": "read-only",
  Escalations: "hidden",
  Reports: "read-only",
  Dashboards: "read-only",
  Forecasting: "hidden",
  "Stakeholder Mapping": "read-only",
  "ForgeAI Insights": "read-only",
};

export const PERMISSION_TEMPLATE_DEFAULTS: PermissionTemplate[] = [
  {
    id: "tpl-view-only",
    name: "View Only",
    description:
      "Read-only access to shared account data. No editing, commenting, or export rights.",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isDefault: true,
    isCustom: false,
    sectionPermissions: { ...DEFAULT_TEMPLATE_PERMISSIONS },
    forgeAIAccess: "basic",
    canExport: false,
    canShareDashboards: false,
    canManageMDF: false,
    canViewPricing: false,
    canViewInternalNotes: false,
  },
  {
    id: "tpl-collaborator",
    name: "Collaborator",
    description:
      "Can view, comment on shared notes, and edit select fields where permitted.",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isDefault: true,
    isCustom: false,
    sectionPermissions: {
      ...DEFAULT_TEMPLATE_PERMISSIONS,
      "External Shared Notes": "edit",
      "Sales Tasks": "comment",
      "Stakeholder Mapping": "edit",
    },
    forgeAIAccess: "operational",
    canExport: false,
    canShareDashboards: false,
    canManageMDF: false,
    canViewPricing: false,
    canViewInternalNotes: false,
  },
  {
    id: "tpl-mdf-contributor",
    name: "MDF Contributor",
    description:
      "Full MDF workflow access including requests, approvals, campaign planning, and ROI tracking.",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isDefault: true,
    isCustom: false,
    sectionPermissions: {
      ...DEFAULT_TEMPLATE_PERMISSIONS,
      "MDF Requests": "edit",
      "External Shared Notes": "edit",
      Reports: "read-only",
    },
    forgeAIAccess: "operational",
    canExport: true,
    canShareDashboards: false,
    canManageMDF: true,
    canViewPricing: false,
    canViewInternalNotes: false,
  },
  {
    id: "tpl-sales-reporting",
    name: "Sales Reporting Access",
    description:
      "Access to pipeline, deal registrations, forecasting, and sales dashboards.",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isDefault: true,
    isCustom: false,
    sectionPermissions: {
      ...DEFAULT_TEMPLATE_PERMISSIONS,
      "Opportunity Pipeline": "read-only",
      "Deal Registrations": "edit",
      Forecasting: "read-only",
      Reports: "read-only",
      Dashboards: "read-only",
      "External Shared Notes": "comment",
    },
    forgeAIAccess: "operational",
    canExport: true,
    canShareDashboards: true,
    canManageMDF: false,
    canViewPricing: false,
    canViewInternalNotes: false,
  },
  {
    id: "tpl-renewal-management",
    name: "Renewal Management Access",
    description:
      "Focused on renewals, account health, and stakeholder mapping with edit rights on renewal tasks.",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isDefault: true,
    isCustom: false,
    sectionPermissions: {
      ...DEFAULT_TEMPLATE_PERMISSIONS,
      "Renewal Dates": "edit",
      "Account Summary": "edit",
      "Stakeholder Mapping": "edit",
      "Sales Tasks": "edit",
      "External Shared Notes": "edit",
    },
    forgeAIAccess: "full",
    canExport: true,
    canShareDashboards: false,
    canManageMDF: false,
    canViewPricing: false,
    canViewInternalNotes: false,
  },
  {
    id: "tpl-deal-registration",
    name: "Deal Registration Access",
    description:
      "Create and manage deal registrations, view pipeline, and collaborate on opportunity data.",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isDefault: true,
    isCustom: false,
    sectionPermissions: {
      ...DEFAULT_TEMPLATE_PERMISSIONS,
      "Deal Registrations": "edit",
      "Opportunity Pipeline": "read-only",
      "External Shared Notes": "comment",
      "Sales Tasks": "comment",
    },
    forgeAIAccess: "operational",
    canExport: false,
    canShareDashboards: false,
    canManageMDF: false,
    canViewPricing: false,
    canViewInternalNotes: false,
  },
  {
    id: "tpl-executive-dashboard",
    name: "Executive Dashboard Access",
    description:
      "High-level dashboards, forecasting, and AI insights for executive stakeholders.",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isDefault: true,
    isCustom: false,
    sectionPermissions: {
      ...DEFAULT_TEMPLATE_PERMISSIONS,
      Dashboards: "read-only",
      Forecasting: "read-only",
      Reports: "read-only",
      "Account Summary": "read-only",
      "ForgeAI Insights": "read-only",
      "Stakeholder Mapping": "read-only",
    },
    forgeAIAccess: "full",
    canExport: true,
    canShareDashboards: true,
    canManageMDF: false,
    canViewPricing: true,
    canViewInternalNotes: false,
  },
  {
    id: "tpl-custom",
    name: "Custom Access",
    description: "Fully configurable permissions defined by the Primary Admin.",
    createdBy: "system",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isDefault: false,
    isCustom: true,
    sectionPermissions: { ...DEFAULT_TEMPLATE_PERMISSIONS },
    forgeAIAccess: "none",
    canExport: false,
    canShareDashboards: false,
    canManageMDF: false,
    canViewPricing: false,
    canViewInternalNotes: false,
  },
];
