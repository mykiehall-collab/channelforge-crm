// Re-export backend types for convenience
export type {
  Account,
  AccountStatus,
  ActivityStatus,
  Alert,
  AlertSeverity,
  AlertType,
  AuditEntry,
  BulkImportResult,
  BusinessPlan,
  BusinessPlanActivity,
  CompanyProfile,
  CompanyType,
  Contact,
  DealRegistration,
  DealStatus,
  NewsItem,
  NewsVisibility,
  Note,
  PlanType,
  PriceList,
  Promotion,
  ReportFilters,
  UserProfile,
  UserRole,
  // Custom fields
  CustomFieldDef,
  CustomFieldValue,
  CustomFieldValidationRule,
  CustomFieldValidationResult,
  CustomFieldBulkValidationResult,
  // Custom field enums
  CustomFieldType,
  CustomFieldObjectType,
  CustomFieldVisibilityScope,
  CustomFieldPermission,
  CustomFieldValidationRuleType,
  // New CRM entities
  Opportunity,
  OpportunityStage,
  OpportunityStatus,
  MdfRequest,
  MdfRequestStatus,
  MarketingActivity,
  MarketingActivityType,
  MarketingActivityStatus,
  CustomerIdFormatRule,
  OrgVisibilityConfig,
  VisibilityRule,
  VisibilityRuleCondition,
  VisibilityRuleType,
  CustomFieldValueRef,
} from "../backend.d";

// ─── QTD / Quarter / Target types (frontend-only until backend bindgen) ───────

export type FiscalYearType = "CalendarYear" | "CustomFiscal";

export interface QuarterDef {
  quarterId: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface FiscalYearConfig {
  vendorId: string;
  fiscalYearType: FiscalYearType;
  quarters: QuarterDef[];
  updatedAt: bigint;
  updatedBy: string;
}

export interface CurrentQuarterResult {
  quarterDef: QuarterDef;
  daysElapsed: number;
  daysRemaining: number;
  progressPercent: number;
}

export type TargetMeasureId =
  | "Measure1"
  | "Measure2"
  | "Measure3"
  | "Measure4"
  | "Measure5";

export type TargetCalculationType =
  | "Revenue"
  | "Count"
  | "Percentage"
  | "Weighted";

export interface TargetMeasure {
  measureId: TargetMeasureId;
  defaultName: string;
  customName: string | null;
  calculationType: TargetCalculationType;
}

export interface TargetMeasureConfig {
  vendorId: string;
  measures: TargetMeasure[];
  updatedAt: bigint;
  updatedBy: string;
}

export type TargetScope =
  | { AllPartners: null }
  | { ByReseller: string }
  | { ByTier: string }
  | { ByCountry: string }
  | { ByProductFamily: string }
  | { ByUser: string };

export interface TargetAssignment {
  assignmentId: string;
  vendorId: string;
  measureId: TargetMeasureId;
  targetValue: number;
  periodType: "Quarterly" | "Annual";
  periodKey: string;
  assignmentScope: TargetScope;
  assignedAt: bigint;
  assignedBy: string;
}

export interface QTDMetrics {
  resellerId: string | null;
  quarterKey: string;
  renewalRevenue: number;
  newBusinessRevenue: number;
  pipelineCreated: number;
  pipelineClosed: number;
  dealRegistrationsSubmitted: number;
  dealRegistrationsApproved: number;
  currency: string;
  calculatedAt: bigint;
}

export interface PartnerQTDRanking {
  resellerId: string;
  resellerName: string;
  renewalRevenue: number;
  attainmentPercent: number;
  rank: number;
}

export interface QTDFilters {
  quarterKey: string | null;
  country: string | null;
  resellerId: string | null;
  tierName: string | null;
  productFamily: string | null;
  currency: string | null;
  targetSegment: TargetMeasureId | null;
}

// Extended frontend-only types
export interface CRMUserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  companyId: string;
  permissions: string[];
  createdAt: bigint;
}

export interface AppUserState {
  profile: CRMUserProfile | null;
  companyProfile: import("../backend.d").CompanyProfile | null;
  isLoading: boolean;
}

// ─── Distributor types ────────────────────────────────────────────────────────

export interface DistributorProfile {
  id: string;
  companyName: string;
  companyId: string;
  emailDomain: string;
  logoKey?: string;
  setupComplete: boolean;
  vendorIds: string[];
  resellerIds: string[];
  createdAt: bigint;
  updatedAt: bigint;
}

// ─── Account site / multi-region types ───────────────────────────────────────

export interface AccountSite {
  siteId: string;
  siteName: string;
  region: string;
  country: string;
  assignedDistributorId?: string;
  assignedResellerId?: string;
  productLines: string[];
  notes?: string;
}

export interface AccountReassignmentEntry {
  entryId: string;
  accountId: string;
  changedBy: string;
  changedAt: bigint;
  previousOwnerId: string;
  newOwnerId: string;
  ownerType: "Reseller" | "Distributor";
  reason: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  approvedAt?: bigint;
}

// ─── Messaging types ──────────────────────────────────────────────────────────

export type MessageStatus = "Sent" | "Delivered" | "Read";

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: bigint;
  status: MessageStatus;
  attachmentKey?: string;
}

export type ConversationThreadType =
  | "Direct"
  | "Group"
  | "AccountThread"
  | "DealThread"
  | "RenewalThread";

export interface Conversation {
  conversationId: string;
  threadType: ConversationThreadType;
  title: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: bigint;
  updatedAt: bigint;
  linkedEntityId?: string; // account/deal/renewal ID if applicable
}

export interface ConversationThread {
  conversation: Conversation;
  messages: Message[];
}

// ─── User profile detail (extended profile) ───────────────────────────────────

export type UserType = "Vendor" | "Distributor" | "Reseller";
export type RoleType = "PrimaryAdmin" | "SecondaryAdmin" | "EndUser";

export interface UserProfileDetail {
  userId: string;
  fullName: string;
  email: string;
  companyId: string;
  companyName: string;
  userType: UserType;
  roleType: RoleType;
  jobTitle?: string;
  roleDescription?: string;
  region?: string;
  timeZone?: string;
  linkedInUrl?: string;
  profilePhotoKey?: string;
  profilePhotoUrl?: string;
  isVisible: boolean;
  createdAt: bigint;
  updatedAt: bigint;
}

// ─── ForgeAI frontend types ──────────────────────────────────────────────────

export type ForgeAIRiskTier =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Opportunity";

export interface ForgeAIRecommendation {
  id: string;
  riskTier: ForgeAIRiskTier;
  summary: string;
  fullDetail?: string;
  affectedEntityId: string;
  affectedEntityName: string;
  affectedEntityType: "Account" | "Deal" | "Reseller" | "Distributor";
  suggestedNextAction: string;
  recommendedAt: bigint;
  confidence: number; // 0-100
  dataSources?: string[];
  dismissed: boolean;
}

export interface ForgeAICapabilities {
  renewalRiskScoring: boolean;
  engagementGapDetection: boolean;
  dealRegistrationAnalysis: boolean;
  channelHealthScoring: boolean;
  incentiveIntelligence: boolean;
  smartQuerySearch: boolean;
  messagingAssistance: boolean;
}

export interface ForgeAISettings {
  enabled: boolean;
  engagementGapThresholdReseller: number;
  engagementGapThresholdDistributor: number;
  warningLevel: "Standard" | "Elevated" | "Critical";
  escalationDays: number;
  aiCapabilities: ForgeAICapabilities;
  notificationBehavior: "InAppOnly" | "InAppAndEmail";
  updatedAt: bigint;
  updatedBy: string;
}

export type SmartQueryType =
  | "HighRiskRenewals"
  | "RenewalsExpiringNextMonth"
  | "PendingDealRegistrationsOver14Days"
  | "InactiveResellerAccounts"
  | "AccountsNoEngagement"
  | "TopPerformingDistributors"
  | "ResellersBelowTarget"
  | "CustomersNoActivePipeline"
  | "ContractsMissingBusinessPlans"
  | "OpportunitiesStalledApprovals"
  | "AccountsDecliningEngagement"
  | "HighGrowthResellerOpportunities";

export interface SmartQueryFilter {
  region?: string;
  product?: string;
  distributorId?: string;
  resellerId?: string;
  accountManagerId?: string;
  renewalWindowDays?: number;
  riskLevel?: ForgeAIRiskTier;
  contractValueMin?: number;
}

export interface SmartQueryResultItem {
  id: string;
  label: string;
  subLabel?: string;
  riskTier?: ForgeAIRiskTier;
  metric?: string;
}

export interface SmartQueryResult {
  queryType: SmartQueryType;
  title: string;
  summary: string;
  items: SmartQueryResultItem[];
  generatedAt: bigint;
  insight?: string;
}

export interface EngagementGapAlert {
  alertId: string;
  entityId: string;
  entityName: string;
  entityType: "Reseller" | "Distributor" | "Account";
  daysSinceLastEngagement: number;
  threshold: number;
  affectedAccountCount: number;
  severity: ForgeAIRiskTier;
  detectedAt: bigint;
}

export type AuditLogLevel = "Full" | "Recommended" | "Minimal";

export interface ForgeAIAuditEntry {
  entryId: string;
  analysisType: string;
  entityName: string;
  riskLevel: ForgeAIRiskTier;
  timestamp: bigint;
  triggeredBy: string;
}

export interface RenewalRiskScore {
  accountId: string;
  accountName: string;
  riskScore: number;
  riskTier: ForgeAIRiskTier;
  renewalDate: string;
  contractValue: number;
  currency: string;
  factors: string[];
  lastCalculated: bigint;
}
// ─── Gap Notification config types ──────────────────────────────────────────

export interface GapNotificationRecipientConfig {
  accountOwner: boolean;
  primaryAdmin: boolean;
  assignedDistributor: boolean;
  assignedReseller: boolean;
}

export interface GapNotificationConfig {
  critical: GapNotificationRecipientConfig;
  high: GapNotificationRecipientConfig;
}

export interface NLQueryResult {
  interpretedQueryType: SmartQueryType;
  interpretedFilters: SmartQueryFilter;
  interpretationExplanation: string;
  confidenceLevel: "High" | "Medium" | "Low";
  originalQuery: string;
  queryResult: SmartQueryResult;
}

// ─── Account customer ID augmentation (frontend-only) ───────────────────────
// Extends Account display without touching backend.d
export interface AccountWithCustomerId {
  customerIdNumber?: string;
}

// ─── Price Calculator types ──────────────────────────────────────────────────
// Re-exported from PriceCalculator so consumers can import from @/types
export type {
  CalculatedQuote,
  PriceRow,
  BillingTerm,
} from "../components/PriceCalculator";

// ─── Team & Org Chart types — canonical definitions live in AppContext.tsx ─────
// Re-exported from AppContext so consumers can import from @/types too.
export type { TeamMember, OrgNode } from "../AppContext";

// ─── Channel governance types ────────────────────────────────────────────────
// CRMAccountExtension, RichAccount, IncumbentDistributor, IncumbentReseller,
// ChannelProduct, AccountOwnershipRoles, ChannelRelationshipSummary, and
// related types are all available from here.
// ─── Operational region governance types ─────────────────────────────────────
export type RegionChangeRequest = {
  id: string;
  status:
    | "pending_review"
    | "under_assessment"
    | "approved"
    | "rejected"
    | "scheduled_migration";
  businessJustification: string;
  submittedAt: string;
  impactSummary: string;
  referenceNumber: string;
};

export type OperationalRegionPreferences = {
  selectedRegionId: string | null;
  isConfigured: boolean;
  isLocked: boolean;
  lockedAt: string | null;
  changeRequest: RegionChangeRequest | null;
};

export * from "./accountTypes";
export * from "./channelLinks";
