import { loadConfig } from "@caffeineai/core-infrastructure";
import { ExternalBlob } from "@caffeineai/object-storage";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  Account,
  Alert,
  BusinessPlan,
  CompanyProfile,
  Contact,
  DealRegistration,
  NewsItem,
  PriceList,
  Promotion,
  UserProfile,
} from "./backend";
import { UserRole } from "./backend";
import { useActor } from "./hooks/useActor";
import {
  AccessGovernanceProvider,
  FIELD_PERMISSIONS,
} from "./stores/accessGovernanceStore";
import type {
  ChannelLink,
  ChannelLinkAuditEntry,
  MdfComment,
  PermissionTemplate,
  SharedDashboard,
} from "./types";
import type {
  Conversation,
  CurrentQuarterResult,
  FiscalYearConfig,
  OperationalRegionPreferences,
  TargetMeasureConfig,
  UserProfileDetail,
} from "./types";
import {
  hasDemoBeenSeeded,
  isDemoEnvironment,
  markDemoSeeded,
} from "./utils/demoSeed";
import {
  type OperationalRole,
  ROLE_DISPLAY_NAMES,
  ROLE_PLAYBOOKS,
  deriveOperationalRoleFromString,
} from "./utils/roleIntelligenceEngine";
import { IS_TEST_MODE } from "./utils/testMode";

interface ResellerContext {
  resellerId: string;
  resellerName: string;
}

interface DistributorContext {
  distributorId: string;
  distributorName: string;
}

export interface TeamMember {
  id: string;
  fullName: string;
  role: string;
  department: string;
  territory: string;
  jobTitle: string;
  userType: "PrimaryAdmin" | "SecondaryAdmin" | "EndUser";
  profilePhotoUrl: string | null;
  isAdmin: boolean;
  email: string;
  reportingToId: string | null;
}

export interface OrgNode extends TeamMember {
  directReports: OrgNode[];
}

interface AppState {
  // Data
  accounts: Account[];
  contacts: Contact[];
  dealRegistrations: DealRegistration[];
  businessPlans: BusinessPlan[];
  promotions: Promotion[];
  priceLists: PriceList[];
  alerts: Alert[];
  newsItems: NewsItem[];
  // Auth
  userProfile: UserProfile | null;
  companyProfile: CompanyProfile | null;
  companyLogoUrl: string | null;
  loading: boolean;
  // Fiscal year & target config
  fiscalYearConfig: FiscalYearConfig | null;
  currentQuarter: CurrentQuarterResult | null;
  measureConfig: TargetMeasureConfig | null;
  refreshFiscalYear: () => Promise<void>;
  refreshMeasureConfig: () => Promise<void>;
  // Reseller context (vendor drilling into a reseller workspace)
  resellerContext: ResellerContext | null;
  setResellerContext: (ctx: ResellerContext | null) => void;
  // Distributor context (vendor drilling into a distributor workspace)
  distributorContext: DistributorContext | null;
  setDistributorContext: (ctx: DistributorContext | null) => void;
  // Messaging state
  conversations: Conversation[];
  unreadCount: number;
  refreshConversations: () => Promise<void>;
  // User profile detail
  userProfileDetail: UserProfileDetail | null;
  refreshUserProfileDetail: () => Promise<void>;
  // Channel Links
  channelLinks: ChannelLink[];
  permissionTemplates: PermissionTemplate[];
  channelLinkAuditLog: ChannelLinkAuditEntry[];
  mdfComments: MdfComment[];
  sharedDashboards: SharedDashboard[];
  addChannelLink: (link: Omit<ChannelLink, "id">) => void;
  updateChannelLink: (id: string, updates: Partial<ChannelLink>) => void;
  revokeChannelLink: (id: string) => void;
  addMdfComment: (comment: Omit<MdfComment, "commentId">) => void;
  updateSharedDashboard: (
    id: string,
    updates: Partial<SharedDashboard>,
  ) => void;
  // Refresh methods
  refreshAccounts: () => Promise<void>;
  refreshContacts: () => Promise<void>;
  refreshDealRegistrations: () => Promise<void>;
  refreshBusinessPlans: () => Promise<void>;
  refreshPromotions: () => Promise<void>;
  refreshPriceLists: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  refreshNewsItems: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshAll: () => Promise<void>;
  // Team members
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  // Helpers
  isVendor: () => boolean;
  isReseller: () => boolean;
  isDistributor: () => boolean;
  isPrimaryAdmin: () => boolean;
  isSecondaryAdmin: () => boolean;
  isBDR: () => boolean;
  isSalesManager: () => boolean;
  isRegionalDirector: () => boolean;
  isPartnerMarketing: () => boolean;
  isSecurityAdmin: () => boolean;
  canManageForgeAIAlerts: boolean;
  hasPermission: (perm: string) => boolean;
  isOrgAccessible: (accountOrgDomain: string) => boolean;
  getUserRole: () => string;
  canEditField: (fieldName: string, accountId?: string) => boolean;
  canEditAccount: (account: unknown) => boolean;
  // Operational role intelligence
  operationalRole: OperationalRole | null;
  rolePlaybook: string[] | null;
  roleDisplayName: string | null;
  operationalRegionPrefs: OperationalRegionPreferences;
  setOperationalRegionPrefs: (prefs: OperationalRegionPreferences) => void;
  // TEST_MODE_ONLY: Test Experience Mode persona simulation
  isTestModeActive: boolean;
  testModeOrgType: string | null;
  testModeRole: string | null;
  setTestModeOrgType: (orgType: string | null) => void;
  setTestModeRole: (role: string | null) => void;
}

const AppContext = createContext<AppState | null>(null);

// Derive current quarter from fiscal config
function deriveCurrentQuarter(
  cfg: FiscalYearConfig,
): CurrentQuarterResult | null {
  const today = Date.now();
  for (const q of cfg.quarters) {
    const start = new Date(q.startDate).getTime();
    const end = new Date(q.endDate).getTime();
    if (today >= start && today <= end) {
      const totalDays = Math.ceil((end - start) / 86_400_000);
      const elapsed = Math.ceil((today - start) / 86_400_000);
      const remaining = Math.max(0, totalDays - elapsed);
      return {
        quarterDef: q,
        daysElapsed: elapsed,
        daysRemaining: remaining,
        progressPercent: Math.min(
          100,
          totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 0,
        ),
      };
    }
  }
  return null;
}

function buildCalendarYearFallback(): FiscalYearConfig {
  const year = new Date().getFullYear();
  return {
    vendorId: "",
    fiscalYearType: "CalendarYear",
    quarters: [
      {
        quarterId: "Q1",
        name: "Q1",
        startDate: `${year}-01-01`,
        endDate: `${year}-03-31`,
      },
      {
        quarterId: "Q2",
        name: "Q2",
        startDate: `${year}-04-01`,
        endDate: `${year}-06-30`,
      },
      {
        quarterId: "Q3",
        name: "Q3",
        startDate: `${year}-07-01`,
        endDate: `${year}-09-30`,
      },
      {
        quarterId: "Q4",
        name: "Q4",
        startDate: `${year}-10-01`,
        endDate: `${year}-12-31`,
      },
    ],
    updatedAt: BigInt(0),
    updatedBy: "",
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { actor } = useActor();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dealRegistrations, setDealRegistrations] = useState<
    DealRegistration[]
  >([]);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(
    null,
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [resellerContext, setResellerContext] =
    useState<ResellerContext | null>(null);
  const [distributorContext, setDistributorContext] =
    useState<DistributorContext | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [userProfileDetail, setUserProfileDetail] =
    useState<UserProfileDetail | null>(null);
  const [fiscalYearConfig, setFiscalYearConfig] =
    useState<FiscalYearConfig | null>(null);
  const [currentQuarter, setCurrentQuarter] =
    useState<CurrentQuarterResult | null>(null);
  const [measureConfig, setMeasureConfig] =
    useState<TargetMeasureConfig | null>(null);

  // TEST_MODE_ONLY: tab-scoped persona simulation state (no persistence)
  const [testModeOrgType, setTestModeOrgType] = useState<string | null>(null);
  const [testModeRole, setTestModeRole] = useState<string | null>(null);
  const isTestModeActive =
    IS_TEST_MODE && (testModeOrgType !== null || testModeRole !== null);

  // ─── Channel Links state ─────────────────────────────────────────────────────
  const [channelLinks, setChannelLinks] = useState<ChannelLink[]>([
    {
      id: "cl-001",
      orgName: "Adobe",
      orgType: "VENDOR",
      linkedOrgId: "dist-001",
      linkedOrgName: "Ingram Micro",
      linkedOrgType: "DISTRIBUTOR",
      status: "Active",
      direction: "VendorToDistributor",
      templateName: "Collaborator",
      templateId: "tpl-collaborator",
      invitedBy: "admin@adobe.com",
      invitedAt: "2024-03-15T09:00:00Z",
      approvedBy: "admin@ingram.com",
      approvedAt: "2024-03-16T14:30:00Z",
      domainVerified: true,
      mfaRequired: true,
    },
    {
      id: "cl-002",
      orgName: "Ingram Micro",
      orgType: "DISTRIBUTOR",
      linkedOrgId: "res-001",
      linkedOrgName: "Nordic Cloud Solutions",
      linkedOrgType: "RESELLER",
      status: "Active",
      direction: "DistributorToReseller",
      templateName: "Sales Reporting Access",
      templateId: "tpl-sales-reporting",
      invitedBy: "admin@ingram.com",
      invitedAt: "2024-04-01T11:00:00Z",
      approvedBy: "admin@nordic.com",
      approvedAt: "2024-04-02T09:15:00Z",
      domainVerified: true,
      mfaRequired: false,
    },
    {
      id: "cl-003",
      orgName: "Crayon",
      orgType: "DISTRIBUTOR",
      linkedOrgId: "res-002",
      linkedOrgName: "BluePeak Consulting",
      linkedOrgType: "RESELLER",
      status: "Pending",
      direction: "DistributorToReseller",
      templateName: "View Only",
      templateId: "tpl-view-only",
      invitedBy: "admin@crayon.com",
      invitedAt: "2024-05-20T16:45:00Z",
      domainVerified: false,
      mfaRequired: false,
    },
    {
      id: "cl-004",
      orgName: "NVIDIA",
      orgType: "VENDOR",
      linkedOrgId: "dist-003",
      linkedOrgName: "TD SYNNEX",
      linkedOrgType: "DISTRIBUTOR",
      status: "Revoked",
      direction: "VendorToDistributor",
      templateName: "Custom Access",
      templateId: "tpl-custom",
      invitedBy: "admin@nvidia.com",
      invitedAt: "2023-11-10T08:00:00Z",
      approvedBy: "admin@tdsynnex.com",
      approvedAt: "2023-11-12T10:00:00Z",
      domainVerified: true,
      mfaRequired: true,
    },
  ]);

  const [permissionTemplates, _setPermissionTemplates] = useState<
    PermissionTemplate[]
  >([
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
      sectionPermissions: {
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
      },
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
        "Account Summary": "read-only",
        "Renewal Dates": "read-only",
        "Opportunity Pipeline": "read-only",
        "Deal Registrations": "read-only",
        "MDF Requests": "read-only",
        "Pricing/Promotions": "hidden",
        "Internal Notes": "hidden",
        "External Shared Notes": "edit",
        "Sales Tasks": "comment",
        Escalations: "hidden",
        Reports: "read-only",
        Dashboards: "read-only",
        Forecasting: "hidden",
        "Stakeholder Mapping": "edit",
        "ForgeAI Insights": "read-only",
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
        "Account Summary": "read-only",
        "Renewal Dates": "read-only",
        "Opportunity Pipeline": "read-only",
        "Deal Registrations": "read-only",
        "MDF Requests": "edit",
        "Pricing/Promotions": "hidden",
        "Internal Notes": "hidden",
        "External Shared Notes": "edit",
        "Sales Tasks": "read-only",
        Escalations: "hidden",
        Reports: "read-only",
        Dashboards: "read-only",
        Forecasting: "hidden",
        "Stakeholder Mapping": "read-only",
        "ForgeAI Insights": "read-only",
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
        "Account Summary": "read-only",
        "Renewal Dates": "read-only",
        "Opportunity Pipeline": "read-only",
        "Deal Registrations": "edit",
        "MDF Requests": "read-only",
        "Pricing/Promotions": "hidden",
        "Internal Notes": "hidden",
        "External Shared Notes": "comment",
        "Sales Tasks": "read-only",
        Escalations: "hidden",
        Reports: "read-only",
        Dashboards: "read-only",
        Forecasting: "read-only",
        "Stakeholder Mapping": "read-only",
        "ForgeAI Insights": "read-only",
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
        "Account Summary": "edit",
        "Renewal Dates": "edit",
        "Opportunity Pipeline": "read-only",
        "Deal Registrations": "read-only",
        "MDF Requests": "read-only",
        "Pricing/Promotions": "hidden",
        "Internal Notes": "hidden",
        "External Shared Notes": "edit",
        "Sales Tasks": "edit",
        Escalations: "hidden",
        Reports: "read-only",
        Dashboards: "read-only",
        Forecasting: "read-only",
        "Stakeholder Mapping": "edit",
        "ForgeAI Insights": "read-only",
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
        "Account Summary": "read-only",
        "Renewal Dates": "read-only",
        "Opportunity Pipeline": "read-only",
        "Deal Registrations": "edit",
        "MDF Requests": "read-only",
        "Pricing/Promotions": "hidden",
        "Internal Notes": "hidden",
        "External Shared Notes": "comment",
        "Sales Tasks": "comment",
        Escalations: "hidden",
        Reports: "read-only",
        Dashboards: "read-only",
        Forecasting: "hidden",
        "Stakeholder Mapping": "read-only",
        "ForgeAI Insights": "read-only",
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
        "Account Summary": "read-only",
        "Renewal Dates": "read-only",
        "Opportunity Pipeline": "read-only",
        "Deal Registrations": "read-only",
        "MDF Requests": "read-only",
        "Pricing/Promotions": "read-only",
        "Internal Notes": "hidden",
        "External Shared Notes": "read-only",
        "Sales Tasks": "read-only",
        Escalations: "hidden",
        Reports: "read-only",
        Dashboards: "read-only",
        Forecasting: "read-only",
        "Stakeholder Mapping": "read-only",
        "ForgeAI Insights": "read-only",
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
      description:
        "Fully configurable permissions defined by the Primary Admin.",
      createdBy: "system",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      isDefault: false,
      isCustom: true,
      sectionPermissions: {
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
      },
      forgeAIAccess: "none",
      canExport: false,
      canShareDashboards: false,
      canManageMDF: false,
      canViewPricing: false,
      canViewInternalNotes: false,
    },
  ]);

  const [channelLinkAuditLog, _setChannelLinkAuditLog] = useState<
    ChannelLinkAuditEntry[]
  >([
    {
      entryId: "aud-001",
      channelLinkId: "cl-001",
      actorId: "u-001",
      actorName: "Sarah Chen",
      actorOrg: "Adobe",
      action: "LINK_CREATED",
      timestamp: "2024-03-15T09:00:00Z",
    },
    {
      entryId: "aud-002",
      channelLinkId: "cl-001",
      actorId: "u-002",
      actorName: "James Miller",
      actorOrg: "Ingram Micro",
      action: "LINK_APPROVED",
      timestamp: "2024-03-16T14:30:00Z",
    },
    {
      entryId: "aud-003",
      channelLinkId: "cl-001",
      actorId: "u-001",
      actorName: "Sarah Chen",
      actorOrg: "Adobe",
      action: "TEMPLATE_ASSIGNED",
      targetSection: "MDF Requests",
      previousValue: "read-only",
      newValue: "edit",
      timestamp: "2024-03-20T10:15:00Z",
    },
    {
      entryId: "aud-004",
      channelLinkId: "cl-001",
      actorId: "u-003",
      actorName: "Priya Patel",
      actorOrg: "Adobe",
      action: "PERMISSION_CHANGED",
      targetSection: "External Shared Notes",
      previousValue: "comment",
      newValue: "edit",
      timestamp: "2024-04-05T11:00:00Z",
    },
    {
      entryId: "aud-005",
      channelLinkId: "cl-001",
      actorId: "u-002",
      actorName: "James Miller",
      actorOrg: "Ingram Micro",
      action: "DASHBOARD_SHARED",
      timestamp: "2024-04-10T09:30:00Z",
    },
    {
      entryId: "aud-006",
      channelLinkId: "cl-002",
      actorId: "u-004",
      actorName: "Maria Gonzalez",
      actorOrg: "Ingram Micro",
      action: "LINK_CREATED",
      timestamp: "2024-04-01T11:00:00Z",
    },
    {
      entryId: "aud-007",
      channelLinkId: "cl-002",
      actorId: "u-005",
      actorName: "Erik Johansson",
      actorOrg: "Nordic Cloud Solutions",
      action: "LINK_APPROVED",
      timestamp: "2024-04-02T09:15:00Z",
    },
    {
      entryId: "aud-008",
      channelLinkId: "cl-002",
      actorId: "u-004",
      actorName: "Maria Gonzalez",
      actorOrg: "Ingram Micro",
      action: "TEMPLATE_CHANGED",
      previousValue: "View Only",
      newValue: "Sales Reporting Access",
      timestamp: "2024-04-03T14:00:00Z",
    },
    {
      entryId: "aud-009",
      channelLinkId: "cl-003",
      actorId: "u-006",
      actorName: "David Kim",
      actorOrg: "Crayon",
      action: "LINK_CREATED",
      timestamp: "2024-05-20T16:45:00Z",
    },
    {
      entryId: "aud-010",
      channelLinkId: "cl-003",
      actorId: "u-007",
      actorName: "Lisa Wong",
      actorOrg: "BluePeak Consulting",
      action: "DOMAIN_VERIFICATION_PENDING",
      timestamp: "2024-05-21T08:00:00Z",
    },
    {
      entryId: "aud-011",
      channelLinkId: "cl-004",
      actorId: "u-008",
      actorName: "Robert Taylor",
      actorOrg: "NVIDIA",
      action: "LINK_CREATED",
      timestamp: "2023-11-10T08:00:00Z",
    },
    {
      entryId: "aud-012",
      channelLinkId: "cl-004",
      actorId: "u-009",
      actorName: "Amanda Lewis",
      actorOrg: "TD SYNNEX",
      action: "LINK_APPROVED",
      timestamp: "2023-11-12T10:00:00Z",
    },
    {
      entryId: "aud-013",
      channelLinkId: "cl-004",
      actorId: "u-008",
      actorName: "Robert Taylor",
      actorOrg: "NVIDIA",
      action: "LINK_REVOKED",
      timestamp: "2024-01-15T16:00:00Z",
    },
    {
      entryId: "aud-014",
      channelLinkId: "cl-004",
      actorId: "u-008",
      actorName: "Robert Taylor",
      actorOrg: "NVIDIA",
      action: "ACCESS_REMOVED",
      targetSection: "Dashboards",
      timestamp: "2024-01-15T16:05:00Z",
    },
    {
      entryId: "aud-015",
      channelLinkId: "cl-001",
      actorId: "u-001",
      actorName: "Sarah Chen",
      actorOrg: "Adobe",
      action: "MFA_ENABLED",
      timestamp: "2024-03-18T09:00:00Z",
    },
    {
      entryId: "aud-016",
      channelLinkId: "cl-002",
      actorId: "u-005",
      actorName: "Erik Johansson",
      actorOrg: "Nordic Cloud Solutions",
      action: "EXPORT_REQUESTED",
      timestamp: "2024-04-12T13:20:00Z",
    },
    {
      entryId: "aud-017",
      channelLinkId: "cl-001",
      actorId: "u-002",
      actorName: "James Miller",
      actorOrg: "Ingram Micro",
      action: "COMMENT_ADDED",
      targetSection: "External Shared Notes",
      timestamp: "2024-04-22T10:00:00Z",
    },
  ]);

  const [mdfComments, setMdfComments] = useState<MdfComment[]>([
    {
      commentId: "mc-001",
      mdfRequestId: "mdf-001",
      authorId: "u-001",
      authorName: "Sarah Chen",
      authorOrgTag: "VENDOR",
      content:
        "[VENDOR] Approved the initial campaign budget. Please proceed with asset creation.",
      createdAt: "2024-03-20T10:00:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-002",
      mdfRequestId: "mdf-001",
      authorId: "u-002",
      authorName: "James Miller",
      authorOrgTag: "DISTRIBUTOR",
      content:
        "[DISTRIBUTOR] Assets are in progress. Expect draft by end of week.",
      createdAt: "2024-03-21T14:30:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-003",
      mdfRequestId: "mdf-001",
      authorId: "u-005",
      authorName: "Erik Johansson",
      authorOrgTag: "RESELLER",
      content:
        "[RESELLER] Customer has confirmed event attendance. 45 registrations so far.",
      createdAt: "2024-03-22T09:15:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-004",
      mdfRequestId: "mdf-001",
      authorId: "u-001",
      authorName: "Sarah Chen",
      authorOrgTag: "VENDOR",
      content:
        "[VENDOR] Internal note: monitor ROI closely. Target is 4:1 return.",
      createdAt: "2024-03-22T11:00:00Z",
      isInternal: true,
      isShared: false,
    },
    {
      commentId: "mc-005",
      mdfRequestId: "mdf-002",
      authorId: "u-004",
      authorName: "Maria Gonzalez",
      authorOrgTag: "DISTRIBUTOR",
      content:
        "[DISTRIBUTOR] Requesting additional £5k for digital ad spend. Performance is exceeding projections.",
      createdAt: "2024-04-10T16:00:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-006",
      mdfRequestId: "mdf-002",
      authorId: "u-001",
      authorName: "Sarah Chen",
      authorOrgTag: "VENDOR",
      content:
        "[VENDOR] Approved the uplift. Please update the campaign tracker.",
      createdAt: "2024-04-11T09:30:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-007",
      mdfRequestId: "mdf-003",
      authorId: "u-005",
      authorName: "Erik Johansson",
      authorOrgTag: "RESELLER",
      content:
        "[RESELLER] Event completed. Uploading evidence and attendance list now.",
      createdAt: "2024-05-01T10:00:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-008",
      mdfRequestId: "mdf-003",
      authorId: "u-002",
      authorName: "James Miller",
      authorOrgTag: "DISTRIBUTOR",
      content:
        "[DISTRIBUTOR] Evidence received. Processing for ROI calculation.",
      createdAt: "2024-05-02T14:00:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-009",
      mdfRequestId: "mdf-003",
      authorId: "u-001",
      authorName: "Sarah Chen",
      authorOrgTag: "VENDOR",
      content: "[VENDOR] ROI looks strong at 5.2:1. Great work team.",
      createdAt: "2024-05-03T09:00:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-010",
      mdfRequestId: "mdf-004",
      authorId: "u-006",
      authorName: "David Kim",
      authorOrgTag: "DISTRIBUTOR",
      content:
        "[DISTRIBUTOR] Campaign plan submitted for Q3. Awaiting Vendor approval.",
      createdAt: "2024-05-25T11:00:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-011",
      mdfRequestId: "mdf-004",
      authorId: "u-007",
      authorName: "Lisa Wong",
      authorOrgTag: "RESELLER",
      content: "[RESELLER] We have secured the venue. Deposit paid.",
      createdAt: "2024-05-26T13:30:00Z",
      isInternal: false,
      isShared: true,
    },
    {
      commentId: "mc-012",
      mdfRequestId: "mdf-004",
      authorId: "u-001",
      authorName: "Sarah Chen",
      authorOrgTag: "VENDOR",
      content:
        "[VENDOR] Approved. Please proceed with vendor onboarding for the venue.",
      createdAt: "2024-05-27T10:00:00Z",
      isInternal: false,
      isShared: true,
    },
  ]);

  const [sharedDashboards, setSharedDashboards] = useState<SharedDashboard[]>([
    {
      dashboardId: "dash-001",
      name: "QTD Performance",
      description: "Quarter-to-date revenue and pipeline performance",
      ownerOrgId: "vendor-001",
      ownerOrgName: "Adobe",
      sharedWithOrgId: "dist-001",
      sharedWithOrgName: "Ingram Micro",
      channelLinkId: "cl-001",
      widgets: ["kpi-revenue", "chart-pipeline", "table-deals"],
      filters: { quarter: "Q2-2024", region: "EMEA" },
      allowedRoles: ["PrimaryAdmin", "SecondaryAdmin", "EndUser"],
      isActive: true,
      createdAt: "2024-04-01T00:00:00Z",
      updatedAt: "2024-04-01T00:00:00Z",
    },
    {
      dashboardId: "dash-002",
      name: "Renewal Risk",
      description: "Accounts at risk of non-renewal with AI scoring",
      ownerOrgId: "vendor-001",
      ownerOrgName: "Adobe",
      sharedWithOrgId: "dist-001",
      sharedWithOrgName: "Ingram Micro",
      channelLinkId: "cl-001",
      widgets: ["kpi-risk", "chart-renewals", "list-alerts"],
      filters: { riskLevel: "High", daysToRenewal: "90" },
      allowedRoles: ["PrimaryAdmin", "SecondaryAdmin"],
      isActive: true,
      createdAt: "2024-04-05T00:00:00Z",
      updatedAt: "2024-04-05T00:00:00Z",
    },
    {
      dashboardId: "dash-003",
      name: "Pipeline Overview",
      description: "Active opportunities across all stages",
      ownerOrgId: "dist-001",
      ownerOrgName: "Ingram Micro",
      sharedWithOrgId: "res-001",
      sharedWithOrgName: "Nordic Cloud Solutions",
      channelLinkId: "cl-002",
      widgets: ["kpi-pipeline", "chart-stages", "table-opportunities"],
      filters: { stage: "All", productFamily: "Creative Cloud" },
      allowedRoles: ["PrimaryAdmin", "SecondaryAdmin", "EndUser"],
      isActive: true,
      createdAt: "2024-04-10T00:00:00Z",
      updatedAt: "2024-04-10T00:00:00Z",
    },
    {
      dashboardId: "dash-004",
      name: "MDF ROI Tracker",
      description: "Campaign spend vs return on investment",
      ownerOrgId: "vendor-001",
      ownerOrgName: "Adobe",
      sharedWithOrgId: "dist-001",
      sharedWithOrgName: "Ingram Micro",
      channelLinkId: "cl-001",
      widgets: ["kpi-roi", "chart-spend", "table-campaigns"],
      filters: { campaignStatus: "Active", year: "2024" },
      allowedRoles: ["PrimaryAdmin", "SecondaryAdmin"],
      isActive: true,
      createdAt: "2024-04-15T00:00:00Z",
      updatedAt: "2024-04-15T00:00:00Z",
    },
    {
      dashboardId: "dash-005",
      name: "Deal Registration Performance",
      description: "Submitted, approved, and rejected deal registrations",
      ownerOrgId: "dist-001",
      ownerOrgName: "Ingram Micro",
      sharedWithOrgId: "res-001",
      sharedWithOrgName: "Nordic Cloud Solutions",
      channelLinkId: "cl-002",
      widgets: ["kpi-deals", "chart-approval-rate", "table-registrations"],
      filters: { status: "All", quarter: "Q2-2024" },
      allowedRoles: ["PrimaryAdmin", "SecondaryAdmin"],
      isActive: true,
      createdAt: "2024-04-20T00:00:00Z",
      updatedAt: "2024-04-20T00:00:00Z",
    },
    {
      dashboardId: "dash-006",
      name: "Churn / Save Performance",
      description: "Retention metrics and save-rate tracking",
      ownerOrgId: "vendor-001",
      ownerOrgName: "Adobe",
      sharedWithOrgId: "dist-001",
      sharedWithOrgName: "Ingram Micro",
      channelLinkId: "cl-001",
      widgets: ["kpi-churn", "chart-retention", "list-at-risk"],
      filters: { segment: "Enterprise", year: "2024" },
      allowedRoles: ["PrimaryAdmin"],
      isActive: true,
      createdAt: "2024-04-25T00:00:00Z",
      updatedAt: "2024-04-25T00:00:00Z",
    },
    {
      dashboardId: "dash-007",
      name: "Campaign Performance",
      description: "Marketing campaign metrics and engagement",
      ownerOrgId: "dist-001",
      ownerOrgName: "Ingram Micro",
      sharedWithOrgId: "res-001",
      sharedWithOrgName: "Nordic Cloud Solutions",
      channelLinkId: "cl-002",
      widgets: ["kpi-engagement", "chart-campaigns", "table-leads"],
      filters: { channel: "Digital", quarter: "Q2-2024" },
      allowedRoles: ["PrimaryAdmin", "SecondaryAdmin", "EndUser"],
      isActive: true,
      createdAt: "2024-05-01T00:00:00Z",
      updatedAt: "2024-05-01T00:00:00Z",
    },
    {
      dashboardId: "dash-008",
      name: "Missed Opportunities",
      description: "Left-on-the-table analysis and recovery actions",
      ownerOrgId: "vendor-001",
      ownerOrgName: "Adobe",
      sharedWithOrgId: "dist-001",
      sharedWithOrgName: "Ingram Micro",
      channelLinkId: "cl-001",
      widgets: ["kpi-missed", "chart-trends", "list-recovery"],
      filters: { reason: "Competitor", quarter: "Q1-2024" },
      allowedRoles: ["PrimaryAdmin", "SecondaryAdmin"],
      isActive: false,
      createdAt: "2024-05-10T00:00:00Z",
      updatedAt: "2024-05-10T00:00:00Z",
    },
  ]);

  // ─── Team members state ─────────────────────────────────────────────────────
  const DEMO_TEAM_MEMBERS: TeamMember[] = [
    {
      id: "tm-001",
      fullName: "Sarah Chen",
      role: "Chief Executive Officer",
      department: "Leadership",
      territory: "Global",
      jobTitle: "CEO",
      userType: "PrimaryAdmin",
      profilePhotoUrl: null,
      isAdmin: true,
      email: "sarah.chen@channelforge.net",
      reportingToId: null,
    },
    {
      id: "tm-002",
      fullName: "James Miller",
      role: "VP Sales",
      department: "Sales",
      territory: "EMEA",
      jobTitle: "VP Sales",
      userType: "SecondaryAdmin",
      profilePhotoUrl: null,
      isAdmin: true,
      email: "james.miller@channelforge.net",
      reportingToId: "tm-001",
    },
    {
      id: "tm-003",
      fullName: "Priya Patel",
      role: "VP Marketing",
      department: "Marketing",
      territory: "APAC",
      jobTitle: "VP Marketing",
      userType: "SecondaryAdmin",
      profilePhotoUrl: null,
      isAdmin: true,
      email: "priya.patel@channelforge.net",
      reportingToId: "tm-001",
    },
    {
      id: "tm-004",
      fullName: "Tom Bradley",
      role: "Account Executive",
      department: "Sales",
      territory: "UK",
      jobTitle: "Account Executive",
      userType: "EndUser",
      profilePhotoUrl: null,
      isAdmin: false,
      email: "tom.bradley@channelforge.net",
      reportingToId: "tm-002",
    },
    {
      id: "tm-005",
      fullName: "Emma Wilson",
      role: "Channel Manager",
      department: "Sales",
      territory: "Nordics",
      jobTitle: "Channel Manager",
      userType: "EndUser",
      profilePhotoUrl: null,
      isAdmin: false,
      email: "emma.wilson@channelforge.net",
      reportingToId: "tm-002",
    },
    {
      id: "tm-006",
      fullName: "Alex Rodriguez",
      role: "Systems Administrator",
      department: "IT",
      territory: "US",
      jobTitle: "Systems Admin",
      userType: "EndUser",
      profilePhotoUrl: null,
      isAdmin: false,
      email: "alex.rodriguez@channelforge.net",
      reportingToId: "tm-001",
    },
    {
      id: "tm-007",
      fullName: "Rachel Kim",
      role: "Marketing Executive",
      department: "Marketing",
      territory: "APAC",
      jobTitle: "Marketing Executive",
      userType: "EndUser",
      profilePhotoUrl: null,
      isAdmin: false,
      email: "rachel.kim@channelforge.net",
      reportingToId: "tm-003",
    },
    {
      id: "tm-008",
      fullName: "David Hughes",
      role: "Operations Manager",
      department: "Operations",
      territory: "EMEA",
      jobTitle: "Operations Manager",
      userType: "EndUser",
      profilePhotoUrl: null,
      isAdmin: false,
      email: "david.hughes@channelforge.net",
      reportingToId: "tm-001",
    },
  ];

  const loadTeamMembers = (): TeamMember[] => {
    try {
      const stored = localStorage.getItem("cf_team_members");
      if (stored) return JSON.parse(stored) as TeamMember[];
    } catch {}
    if (isDemoEnvironment()) return DEMO_TEAM_MEMBERS;
    return [];
  };

  const [teamMembers, setTeamMembersState] =
    useState<TeamMember[]>(loadTeamMembers);

  const [operationalRegionPrefs, setOperationalRegionPrefs] =
    useState<OperationalRegionPreferences>({
      selectedRegionId: null,
      isConfigured: false,
      isLocked: false,
      lockedAt: null,
      changeRequest: null,
    });

  const setTeamMembers = useCallback((members: TeamMember[]) => {
    setTeamMembersState(members);
    try {
      localStorage.setItem("cf_team_members", JSON.stringify(members));
    } catch {}
  }, []);

  // Start loading=false when no token exists (public/pre-login routes).
  // This prevents the authenticated loading gate from blocking public pages.
  const hasToken = !!(
    sessionStorage.getItem("cf_session_token") ||
    localStorage.getItem("cf_session_token")
  );
  const [loading, setLoading] = useState(hasToken);
  const initialLoadDone = useRef(false);

  // ─── Individual refreshers (declared BEFORE refreshAll) ──────────────────────

  const refreshAccounts = useCallback(async () => {
    if (!actor) return;
    try {
      setAccounts(await actor.getAllAccounts());
    } catch {}
  }, [actor]);

  const refreshContacts = useCallback(async () => {
    if (!actor) return;
    try {
      const all = await actor.getAllAccounts();
      const results = await Promise.all(
        all
          .slice(0, 50)
          .map((a) =>
            actor.getContactsByAccount(a.id).catch(() => [] as Contact[]),
          ),
      );
      const flat = results.flat();
      const seen = new Set<string>();
      setContacts(
        flat.filter((c) => {
          if (seen.has(c.id)) return false;
          seen.add(c.id);
          return true;
        }),
      );
    } catch {}
  }, [actor]);

  const refreshDealRegistrations = useCallback(async () => {
    if (!actor) return;
    try {
      setDealRegistrations(await actor.getAllDealRegistrations());
    } catch {}
  }, [actor]);

  const refreshBusinessPlans = useCallback(async () => {
    if (!actor) return;
    try {
      setBusinessPlans(await actor.getAllBusinessPlans());
    } catch {}
  }, [actor]);

  const refreshPromotions = useCallback(async () => {
    if (!actor) return;
    try {
      setPromotions(await actor.getAllPromotions());
    } catch {}
  }, [actor]);

  const refreshPriceLists = useCallback(async () => {
    if (!actor) return;
    try {
      setPriceLists(await actor.getAllPriceLists());
    } catch {}
  }, [actor]);

  const refreshAlerts = useCallback(async () => {
    if (!actor) return;
    try {
      setAlerts(await actor.getMyAlerts());
    } catch {}
  }, [actor]);

  const refreshNewsItems = useCallback(async () => {
    if (!actor) return;
    try {
      setNewsItems(await actor.getVisibleNews("", ""));
    } catch {}
  }, [actor]);

  const refreshUserProfile = useCallback(async () => {
    if (!actor) return;
    try {
      const profile = await actor.getMyUserProfile();
      setUserProfile(profile ?? null);
      if (profile) {
        const company = await actor.getMyCompany();
        setCompanyProfile(company ?? null);
        if (company?.logoKey) {
          try {
            const config = await loadConfig();
            const gatewayBase = config.storage_gateway_url ?? "";
            const url = ExternalBlob.fromURL(
              gatewayBase.endsWith("/")
                ? `${gatewayBase}${company.logoKey}`
                : `${gatewayBase}/${company.logoKey}`,
            ).getDirectURL();
            setCompanyLogoUrl(url);
          } catch {
            setCompanyLogoUrl(null);
          }
        } else {
          setCompanyLogoUrl(null);
        }
      }
    } catch {}
  }, [actor]);

  const refreshFiscalYear = useCallback(async () => {
    if (!actor) return;
    try {
      const actorAny = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if ("getFiscalYearConfig" in actor) {
        const raw = await actorAny.getFiscalYearConfig();
        if (raw) {
          const cfg = raw as FiscalYearConfig;
          setFiscalYearConfig(cfg);
          setCurrentQuarter(deriveCurrentQuarter(cfg));
          return;
        }
      }
    } catch {}
    const fallback = buildCalendarYearFallback();
    setFiscalYearConfig(fallback);
    setCurrentQuarter(deriveCurrentQuarter(fallback));
  }, [actor]);

  const refreshConversations = useCallback(async () => {
    // Conversations are fetched from messaging backend when available.
    // For now, seed with an empty list — MessagingPage will populate from actor.
    setConversations([]);
  }, []);

  const refreshUserProfileDetail = useCallback(async () => {
    if (!actor) return;
    // Extended profile detail — gracefully degrade if backend method not yet available.
    try {
      const actorAny = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if ("getUserProfileDetail" in actor) {
        const raw = await actorAny.getUserProfileDetail();
        if (raw) {
          setUserProfileDetail(raw as UserProfileDetail);
          return;
        }
      }
    } catch {}
    setUserProfileDetail(null);
  }, [actor]);

  const refreshMeasureConfig = useCallback(async () => {
    if (!actor) return;
    try {
      const actorAny = actor as unknown as Record<
        string,
        (...args: unknown[]) => Promise<unknown>
      >;
      if ("getMeasureConfig" in actor) {
        const raw = await actorAny.getMeasureConfig();
        if (raw) {
          setMeasureConfig(raw as TargetMeasureConfig);
          return;
        }
      }
    } catch {}
    setMeasureConfig({
      vendorId: "",
      measures: [
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
      ],
      updatedAt: BigInt(0),
      updatedBy: "",
    });
  }, [actor]);

  // ─── refreshAll (after all individual refreshers) ────────────────────────────

  const refreshAll = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    await Promise.all([
      refreshAccounts(),
      refreshDealRegistrations(),
      refreshBusinessPlans(),
      refreshPromotions(),
      refreshPriceLists(),
      refreshAlerts(),
      refreshNewsItems(),
      refreshUserProfile(),
      refreshFiscalYear(),
      refreshMeasureConfig(),
    ]);
    setLoading(false);
  }, [
    actor,
    refreshAccounts,
    refreshDealRegistrations,
    refreshBusinessPlans,
    refreshPromotions,
    refreshPriceLists,
    refreshAlerts,
    refreshNewsItems,
    refreshUserProfile,
    refreshFiscalYear,
    refreshMeasureConfig,
  ]);

  useEffect(() => {
    // Only initialize actor data if a valid session token exists.
    // This prevents refreshAll() from firing in the pre-login/public context
    // (e.g. when AppProvider is mounted inside PublicShell on login/pricing/setup pages)
    // and stops any authenticated API calls before the user has actually signed in.
    const token =
      sessionStorage.getItem("cf_session_token") ||
      localStorage.getItem("cf_session_token");
    const sessionTimestamp =
      localStorage.getItem("cf_session_timestamp") ||
      sessionStorage.getItem("cf_session_timestamp");
    if (
      sessionTimestamp &&
      Date.now() - Number.parseInt(sessionTimestamp, 10) > 8 * 60 * 60 * 1000
    ) {
      localStorage.removeItem("cf_session_token");
      localStorage.removeItem("cf_session_timestamp");
      sessionStorage.removeItem("cf_session_token");
      sessionStorage.removeItem("cf_session_timestamp");
      return; // skip refreshAll, user must re-login
    }
    if (actor && !initialLoadDone.current && token) {
      initialLoadDone.current = true;
      refreshAll();
      if (isDemoEnvironment() && !hasDemoBeenSeeded()) {
        markDemoSeeded();
        // Seed team members if not already persisted
        if (!localStorage.getItem("cf_team_members")) {
          setTeamMembers(DEMO_TEAM_MEMBERS);
        }
      }
    }
  }, [actor, refreshAll, setTeamMembers]);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const isVendor = useCallback(() => {
    return (
      userProfile?.role === UserRole.VendorAdmin ||
      userProfile?.role === UserRole.VendorSecondaryAdmin
    );
  }, [userProfile]);

  const isReseller = useCallback(() => {
    return (
      userProfile?.role === UserRole.ResellerAdmin ||
      userProfile?.role === UserRole.ResellerSalesUser
    );
  }, [userProfile]);

  const isDistributor = useCallback(() => {
    return companyProfile?.companyType === "Distributor";
  }, [companyProfile]);

  const isPrimaryAdmin = useCallback(() => {
    return userProfile?.isPrimaryAdmin === true;
  }, [userProfile]);

  const isSecondaryAdmin = useCallback(() => {
    return (
      userProfile?.role === UserRole.VendorSecondaryAdmin ||
      userProfile?.role === UserRole.DistributorSecondaryAdmin ||
      (userProfile?.isPrimaryAdmin !== true &&
        (userProfile?.role === UserRole.ResellerAdmin ||
          userProfile?.role === UserRole.ResellerSalesUser))
    );
  }, [userProfile]);

  const isOrgAccessible = useCallback(
    (accountOrgDomain: string): boolean => {
      if (!accountOrgDomain) return true;
      const myOrgId =
        companyProfile?.companyName || userProfile?.email?.split("@")[1] || "";
      if (accountOrgDomain === myOrgId) return true;
      const activeLinks = (channelLinks || []).filter(
        (l: ChannelLink) => l.status === "Active",
      );
      return activeLinks.some(
        (l: ChannelLink) =>
          ((l as unknown as Record<string, string>).linkedOrgName ||
            (l as unknown as Record<string, string>).linkedOrgId ||
            "") === accountOrgDomain ||
          ((l as unknown as Record<string, string>).orgName ||
            (l as unknown as Record<string, string>).invitedBy ||
            "") === accountOrgDomain,
      );
    },
    [userProfile, companyProfile, channelLinks],
  );

  const isBDR = useCallback((): boolean => {
    const role = getUserRole();
    return (
      role === "BDR" ||
      ((userProfile?.role as string) || "").toLowerCase().includes("bdr") ||
      ((userProfile?.role as string) || "")
        .toLowerCase()
        .includes("business development") ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("bdr") ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("business development")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const isSalesManager = useCallback((): boolean => {
    const role = getUserRole();
    return (
      role === "SalesManager" ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("sales manager") ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("head of sales")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const isRegionalDirector = useCallback((): boolean => {
    const role = getUserRole();
    return (
      role === "RegionalDirector" ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("regional director") ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("country manager")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const isPartnerMarketing = useCallback((): boolean => {
    const role = getUserRole();
    return (
      role === "PartnerMarketing" ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("partner marketing") ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("channel marketing")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const isSecurityAdmin = useCallback((): boolean => {
    const role = getUserRole();
    return (
      role === "SecurityAdmin" ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("security") ||
      ((userProfile as unknown as Record<string, string>)?.jobTitle || "")
        .toLowerCase()
        .includes("ciso")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const getUserRole = useCallback((): string => {
    const role = ((userProfile?.role as string) || "").toLowerCase();
    const dept = (
      (userProfile as unknown as Record<string, string>)?.department || ""
    ).toLowerCase();
    const roleMap: Record<string, string> = {
      sales_rep: "SalesRep",
      salesrep: "SalesRep",
      sales: "SalesRep",
      account_manager: "AccountManager",
      accountmanager: "AccountManager",
      "account manager": "AccountManager",
      renewal_specialist: "RenewalSpecialist",
      renewalspecialist: "RenewalSpecialist",
      "renewal specialist": "RenewalSpecialist",
      marketing: "Marketing",
      "marketing manager": "Marketing",
      sales_ops: "SalesOps",
      salesops: "SalesOps",
      operations: "SalesOps",
      "sales operations": "SalesOps",
      "business analyst": "SalesOps",
      leadership: "Leadership",
      executive: "Leadership",
      vp: "Leadership",
      director: "Leadership",
      ceo: "Leadership",
      coo: "Leadership",
      "regional sales lead": "Leadership",
      it: "IT",
      security: "IT",
      infrastructure: "IT",
      deal_desk: "DealDesk",
      dealdesk: "DealDesk",
      "deal desk": "DealDesk",
      customer_success: "CustomerSuccess",
      customersuccess: "CustomerSuccess",
      "customer success": "CustomerSuccess",
      finance: "Finance",
      billing: "Finance",
      // Extended operational roles
      bdr: "BDR",
      "business development": "BDR",
      sdr: "BDR",
      "sales manager": "SalesManager",
      salesmanager: "SalesManager",
      "regional director": "RegionalDirector",
      regionaldirector: "RegionalDirector",
      "partner marketing": "PartnerMarketing",
      partnermarketing: "PartnerMarketing",
      "channel marketing": "PartnerMarketing",
      security_admin: "SecurityAdmin",
      securityadmin: "SecurityAdmin",
      ciso: "SecurityAdmin",
    };
    if (roleMap[role]) return roleMap[role];
    if (roleMap[dept]) return roleMap[dept];
    if (userProfile?.isPrimaryAdmin === true) return "Leadership";
    return "SalesRep";
  }, [userProfile]);

  const canEditField = useCallback(
    (fieldName: string, _accountId?: string): boolean => {
      if (isPrimaryAdmin()) return true;
      const role = getUserRole();
      const rule = FIELD_PERMISSIONS[fieldName];
      if (!rule) return true;
      return rule.editableByRoles.includes(role);
    },
    [isPrimaryAdmin, getUserRole],
  );

  const canEditAccount = useCallback(
    (account: unknown): boolean => {
      if (!account) return false;
      if (isPrimaryAdmin()) return true;
      const checkFields = [
        "status",
        "externalNotes",
        "renewalDates",
        "contractType",
        "estimatedRenewalValue",
        "products",
      ];
      return checkFields.some((f) => canEditField(f));
    },
    [isPrimaryAdmin, canEditField],
  );

  // Default false; Primary Admin must grant canManageForgeAIAlerts explicitly.
  const canManageForgeAIAlerts =
    userProfile?.permissions?.includes("canManageForgeAIAlerts") ?? false;

  // Derive operational role from getUserRole() result
  const operationalRole: OperationalRole | null = userProfile
    ? deriveOperationalRoleFromString(getUserRole())
    : null;

  const rolePlaybook: string[] | null = operationalRole
    ? (ROLE_PLAYBOOKS[operationalRole] ?? null)
    : null;

  const roleDisplayName: string | null = operationalRole
    ? (ROLE_DISPLAY_NAMES[operationalRole] ?? null)
    : null;

  const hasPermission = useCallback(
    (perm: string) => {
      if (!userProfile) return false;
      if (userProfile.role === UserRole.VendorAdmin) return true;
      return userProfile.permissions.includes(perm);
    },
    [userProfile],
  );

  // ─── Channel Link helpers ────────────────────────────────────────────────────

  const addChannelLink = useCallback((link: Omit<ChannelLink, "id">) => {
    const newLink: ChannelLink = {
      ...link,
      id: `cl-${Date.now()}`,
    };
    setChannelLinks((prev) => [...prev, newLink]);
  }, []);

  const updateChannelLink = useCallback(
    (id: string, updates: Partial<ChannelLink>) => {
      setChannelLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      );
    },
    [],
  );

  const revokeChannelLink = useCallback((id: string) => {
    setChannelLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "Revoked" as const } : l)),
    );
  }, []);

  const addMdfComment = useCallback(
    (comment: Omit<MdfComment, "commentId">) => {
      const newComment: MdfComment = {
        ...comment,
        commentId: `mc-${Date.now()}`,
      };
      setMdfComments((prev) => [...prev, newComment]);
    },
    [],
  );

  const updateSharedDashboard = useCallback(
    (id: string, updates: Partial<SharedDashboard>) => {
      setSharedDashboards((prev) =>
        prev.map((d) => (d.dashboardId === id ? { ...d, ...updates } : d)),
      );
    },
    [],
  );

  return (
    <AccessGovernanceProvider>
      <AppContext.Provider
        value={{
          accounts,
          contacts,
          dealRegistrations,
          businessPlans,
          promotions,
          priceLists,
          alerts,
          newsItems,
          userProfile,
          companyProfile,
          companyLogoUrl,
          loading,
          fiscalYearConfig,
          currentQuarter,
          measureConfig,
          refreshFiscalYear,
          refreshMeasureConfig,
          resellerContext,
          setResellerContext,
          distributorContext,
          setDistributorContext,
          conversations,
          unreadCount: conversations.reduce(
            (acc, c) => acc + (c.unreadCount ?? 0),
            0,
          ),
          refreshConversations,
          userProfileDetail,
          refreshUserProfileDetail,
          refreshAccounts,
          refreshContacts,
          refreshDealRegistrations,
          refreshBusinessPlans,
          refreshPromotions,
          refreshPriceLists,
          refreshAlerts,
          refreshNewsItems,
          refreshUserProfile,
          refreshAll,
          isVendor,
          isReseller,
          isDistributor,
          isPrimaryAdmin,
          isSecondaryAdmin,
          isBDR,
          isSalesManager,
          isRegionalDirector,
          isPartnerMarketing,
          isSecurityAdmin,
          canManageForgeAIAlerts,
          operationalRole,
          rolePlaybook,
          roleDisplayName,
          operationalRegionPrefs,
          setOperationalRegionPrefs,
          isTestModeActive,
          testModeOrgType,
          testModeRole,
          setTestModeOrgType,
          setTestModeRole,
          hasPermission,
          isOrgAccessible,
          getUserRole,
          canEditField,
          canEditAccount,
          teamMembers,
          setTeamMembers,
          channelLinks,
          permissionTemplates,
          channelLinkAuditLog,
          mdfComments,
          sharedDashboards,
          addChannelLink,
          updateChannelLink,
          revokeChannelLink,
          addMdfComment,
          updateSharedDashboard,
        }}
      >
        {children}
      </AppContext.Provider>
    </AccessGovernanceProvider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
