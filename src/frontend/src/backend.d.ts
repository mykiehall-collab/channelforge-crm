import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TargetMeasure {
    calculationType: TargetCalculationType;
    defaultName: string;
    customName?: string;
    measureId: TargetMeasureId;
}
export type Result_4 = {
    __kind__: "ok";
    ok: Promotion;
} | {
    __kind__: "err";
    err: string;
};
export interface FiscalYearConfigInput {
    fiscalYearType: FiscalYearType;
    quarters: Array<QuarterDef>;
}
export interface CustomFieldValue {
    value: string;
    createdAt: bigint;
    uploadedFileKeys: Array<string>;
    updatedAt: bigint;
    updatedBy: string;
    objectId: string;
    fieldDefId: string;
    objectType: CustomFieldObjectType;
}
export interface OpportunityUpdateInput {
    status?: OpportunityStatus;
    closeDate?: bigint;
    customerAccountId?: string;
    distributorId?: string;
    associatedDealIds?: Array<string>;
    stage?: OpportunityStage;
    resellerId?: string;
    opportunityName?: string;
    revenueEstimate?: bigint;
}
export interface OrgForgeAIAlertSettings {
    orgId: string;
    canManageForgeAIAlertsSecondaryAdmins: Array<Principal>;
    alertConfigs: Array<ForgeAIAlertConfig>;
}
export interface MfaSetupChallenge {
    totpSecret: string;
    qrCodeUrl: string;
}
export interface CustomFieldValueInput {
    value: string;
    uploadedFileKeys: Array<string>;
    objectId: string;
    fieldDefId: string;
    objectType: CustomFieldObjectType;
}
export interface AIProviderConfig {
    region?: string;
    orgId?: string;
    temperature: number;
    timeoutSecs: bigint;
    deploymentName?: string;
    endpointUrl?: string;
    modelName?: string;
    maxTokens: bigint;
    providerId: string;
    maskedApiKey?: string;
}
export interface AuthSettings {
    passwordMaxLength: bigint;
    passwordLoginEnabled: boolean;
    lockoutDurationMinutes: bigint;
    mfaGracePeriodDays: bigint;
    mfaRequiredForAll: boolean;
    passwordMinLength: bigint;
    orgId: string;
    ssoEnabled: boolean;
    passwordComplexityRequired: boolean;
    internetIdentityEnabled: boolean;
    mfaOptionalEnrollment: boolean;
    sessionTimeoutMinutes: bigint;
    maxFailedAttempts: bigint;
    mfaRequiredForAdmins: boolean;
    passwordExpiryDays: bigint;
    lockoutEnabled: boolean;
    passwordReusePreventCount: bigint;
    permanentLockUntilReset: boolean;
    mfaEnabled: boolean;
}
export type Result_26 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface Opportunity {
    id: string;
    status: OpportunityStatus;
    closeDate: bigint;
    customFieldValues: Array<CustomFieldValueRef>;
    createdAt: bigint;
    customerAccountId?: string;
    distributorId?: string;
    ownerUserId: string;
    associatedDealIds: Array<string>;
    updatedAt: bigint;
    stage: OpportunityStage;
    vendorOwnerId: string;
    resellerId?: string;
    opportunityName: string;
    revenueEstimate: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: Array<string>;
} | {
    __kind__: "err";
    err: AuthError;
};
export type Result_10 = {
    __kind__: "ok";
    ok: DistributorProfile;
} | {
    __kind__: "err";
    err: string;
};
export type MessageId = string;
export interface AIAccessRule {
    id: string;
    organizationId: string;
    active: boolean;
    grantedAt: bigint;
    grantedBy: string;
    providerId: string;
    grantedToType: AIAccessRuleTarget;
}
export type Result_8 = {
    __kind__: "ok";
    ok: UserProfileDetail;
} | {
    __kind__: "err";
    err: string;
};
export interface AccountLayout {
    id: LayoutId;
    visibilityRules: Array<VisibilityRule__1>;
    name: string;
    createdAt: bigint;
    createdBy: string;
    tabs: Array<AccountTab>;
    description: string;
    version: bigint;
    fields: Array<LayoutField>;
    updatedAt: bigint;
    isDefault: boolean;
    sections: Array<LayoutSection>;
}
export interface Conversation {
    id: ConversationId;
    lastMessageAt: bigint;
    lastMessagePreview: string;
    createdAt: bigint;
    relatedEntityId?: string;
    participantIds: Array<string>;
    conversationType: ConversationType;
}
export interface NewsItemInput {
    title: string;
    publishDate: bigint;
    body: string;
    visibility: NewsVisibility;
}
export type Result_25 = {
    __kind__: "ok";
    ok: ResidentInvitation;
} | {
    __kind__: "err";
    err: string;
};
export interface DistributorProfile {
    id: string;
    emailDomain: string;
    setupComplete: boolean;
    primaryAdminEmail: string;
    createdAt: bigint;
    updatedAt: bigint;
    logoKey?: string;
    activationStatus: ActivationStatus;
    companyName: string;
    resellerIds: Array<string>;
    vendorIds: Array<string>;
    companyId: string;
}
export type Result_11 = {
    __kind__: "ok";
    ok: DealRegistration;
} | {
    __kind__: "err";
    err: string;
};
export interface UserProfileDetailInput {
    region?: string;
    timezone?: string;
    displayName: string;
    photoUrl?: string;
    roleDescription?: string;
    linkedInUrl?: string;
    jobTitle: string;
    visibilityScope: ProfileVisibilityScope;
}
export interface CreditPackage {
    id: string;
    storageCredits: bigint;
    pricingGBP: number;
    aiCredits: bigint;
    name: string;
    description: string;
    computeCredits: bigint;
}
export interface ForgeAIChatSession {
    id: string;
    contextId?: string;
    contextType?: string;
    messages: Array<ChatMessage>;
    userId: string;
    createdAt: bigint;
    updatedAt: bigint;
    providerId: string;
}
export interface LayoutSection {
    id: string;
    title: string;
    sortOrder: bigint;
    collapsible: boolean;
    fieldIds: Array<string>;
}
export interface CurrentQuarterResult {
    daysElapsed: bigint;
    quarterDef: QuarterDef;
    progressPercent: number;
    daysRemaining: bigint;
}
export interface MdfRequestInput {
    budgetYear: bigint;
    vendorOwnerId: string;
    currency: string;
    budgetQuarter?: bigint;
    associatedAccountId?: string;
    amount: bigint;
    purpose: string;
}
export interface Alert {
    id: string;
    alertType: AlertType;
    accountId?: string;
    userId: string;
    createdAt: bigint;
    isRead: boolean;
    message: string;
    severity: AlertSeverity;
}
export interface VisibilityRuleCondition {
    conditionOperator: ConditionOperator;
    conditionField: string;
    conditionValue: string;
}
export interface Promotion {
    id: string;
    resellerEligibility: Array<string>;
    endDate: bigint;
    createdAt: bigint;
    createdBy: string;
    description: string;
    fileKeys: Array<string>;
    callToAction: string;
    promoName: string;
    product: string;
    startDate: bigint;
}
export interface AccountReassignmentEntry {
    previousOwnerId: string;
    changedAt: bigint;
    changedBy: string;
    ownerType: OwnerType;
    newOwnerId: string;
    entryId: string;
    approvalStatus: ReassignmentApprovalStatus;
    reason: string;
}
export interface NotificationRule {
    displayName: string;
    ruleId: NotificationRuleId;
    isEditable: boolean;
    lockStatus: LockStatus;
    currentValue: boolean;
}
export type Result_21 = {
    __kind__: "ok";
    ok: SmartQueryResult;
} | {
    __kind__: "err";
    err: string;
};
export interface UserProfileDetail {
    region?: string;
    timezone?: string;
    userRole: UserRole;
    displayName: string;
    userId: string;
    createdAt: bigint;
    photoUrl?: string;
    roleDescription?: string;
    email: string;
    linkedInUrl?: string;
    updatedAt: bigint;
    jobTitle: string;
    companyType: CompanyType;
    visibilityScope: ProfileVisibilityScope;
    companyId: string;
}
export interface ForgeAIAlertConfig {
    alertType: ForgeAIAlertType;
    escalationRecipients: Array<string>;
    primaryAdminRecipient: boolean;
    endUsersRecipient: boolean;
    riskThreshold?: bigint;
    lockStatus: LockStatus;
    secondaryAdminRecipient: boolean;
    deliveryMode: AlertDeliveryMode;
    enabled: boolean;
    frequency: AlertFrequency;
}
export interface BusinessPlan {
    id: string;
    month?: bigint;
    revenueTarget: number;
    objective: string;
    quarter?: bigint;
    createdAt: bigint;
    year: bigint;
    activities: Array<BusinessPlanActivity>;
    partnerId: string;
    vendorOwnerId: string;
    pipelineTarget: number;
    planType: PlanType;
}
export type Result_18 = {
    __kind__: "ok";
    ok: UserProfile;
} | {
    __kind__: "err";
    err: string;
};
export interface ReportFilters {
    status?: string;
    endDate?: Timestamp;
    distributorId?: string;
    accountOwnerId?: string;
    resellerId?: string;
    startDate?: Timestamp;
}
export type Result_3 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface SSOConfig {
    metadataUrl: string;
    clientId: string;
    issuerUrl: string;
    allowFallbackPassword: boolean;
    provider: SSOProvider;
    orgId: string;
    roleMapping: Array<RoleMapping>;
    enabled: boolean;
    updatedAt: bigint;
    updatedBy: string;
    domainMapping: Array<string>;
    forceSso: boolean;
    callbackUrl: string;
    clientSecret: string;
}
export type Result_15 = {
    __kind__: "ok";
    ok: UnlockRequest;
} | {
    __kind__: "err";
    err: string;
};
export interface CustomFieldDef {
    id: string;
    lockedByVendor: boolean;
    editPermissions: Array<CustomFieldPermission>;
    isRequired: boolean;
    isExportVisible: boolean;
    fieldLabel: string;
    createdAt: bigint;
    createdBy: string;
    allowedValues: Array<string>;
    isSearchable: boolean;
    isReportable: boolean;
    isArchived: boolean;
    updatedAt: bigint;
    viewPermissions: Array<CustomFieldPermission>;
    validationRules: Array<CustomFieldValidationRule>;
    fieldDescription: string;
    visibilityScope: CustomFieldVisibilityScope;
    objectType: CustomFieldObjectType;
    isApiVisible: boolean;
    fieldName: string;
    fieldType: CustomFieldType;
    defaultValue?: string;
}
export type AIAccessRuleTarget = {
    __kind__: "ByRole";
    ByRole: string;
} | {
    __kind__: "SpecificUser";
    SpecificUser: string;
} | {
    __kind__: "AllUsers";
    AllUsers: null;
} | {
    __kind__: "ByDepartment";
    ByDepartment: string;
};
export interface OpportunityInput {
    closeDate: bigint;
    customerAccountId?: string;
    distributorId?: string;
    associatedDealIds: Array<string>;
    stage: OpportunityStage;
    vendorOwnerId: string;
    resellerId?: string;
    opportunityName: string;
    revenueEstimate: bigint;
}
export interface DuplicateDRRecord {
    id: string;
    status: DuplicateDRStatus;
    accountId: string;
    submittedAt: bigint;
    reviewNote?: string;
    existingDRId: string;
    reviewedAt?: bigint;
    reviewedBy?: Principal;
    reviewAction?: string;
    resellerId: string;
    existingResellerId: string;
    product: string;
    newDRId: string;
}
export interface GapNotificationRecipientConfig {
    primaryAdmin: boolean;
    assignedDistributor: boolean;
    assignedReseller: boolean;
    accountOwner: boolean;
}
export interface TierAssignment {
    assignedAt: Timestamp;
    assignedBy: Principal;
    tier: PartnerTier;
    resellerId: string;
}
export interface CustomFieldValidationResult {
    errorMessage?: string;
    fieldDefId: string;
    isValid: boolean;
}
export type Result_31 = {
    __kind__: "ok";
    ok: Alert;
} | {
    __kind__: "err";
    err: string;
};
export interface SessionToken {
    token: string;
    expiresAt: bigint;
    userId: string;
    createdAt: bigint;
    mfaVerified: boolean;
    isPendingMfa: boolean;
    companyType: CompanyType;
    companyId: string;
}
export type Result_7 = {
    __kind__: "ok";
    ok: NewsItem;
} | {
    __kind__: "err";
    err: string;
};
export interface ConversationThread {
    messages: Array<Message>;
    conversation: Conversation;
}
export interface CustomFieldValidationRule {
    ruleType: CustomFieldValidationRuleType;
    ruleValue: string;
}
export interface VisibilityCondition {
    value: string;
    conditionType: VisibilityConditionType;
}
export interface CustomerIdGenerateRequest {
    vendorId: string;
    manualInput?: string;
    regionCode?: string;
}
export interface Note {
    id: string;
    content: string;
    accountId: string;
    authorId: string;
    createdAt: bigint;
    authorName: string;
    authorRole: string;
    updatedAt?: bigint;
    editedBy?: string;
}
export interface ContactInput {
    contactType: string;
    lastContactedDate?: bigint;
    accountId: string;
    email: string;
    contactOwner: string;
    jobTitle: string;
    notes: string;
    nextActionDate?: bigint;
    phone: string;
    lastName: string;
    firstName: string;
}
export interface TargetAssignmentInput {
    periodType: TargetPeriodType;
    assignmentScope: TargetScope;
    periodKey: string;
    targetValue: number;
    measureId: TargetMeasureId;
}
export interface ActiveResetTokenView {
    userEmail: string;
    expiresAt: bigint;
    userId: string;
    tokenPrefix: string;
    createdAt: bigint;
}
export type NewsVisibility = {
    __kind__: "SpecificResellers";
    SpecificResellers: Array<string>;
} | {
    __kind__: "SpecificRegions";
    SpecificRegions: Array<string>;
} | {
    __kind__: "AllResellers";
    AllResellers: null;
} | {
    __kind__: "VendorOnly";
    VendorOnly: null;
};
export interface InAppNotification {
    id: string;
    title: string;
    notificationType: NotificationType;
    createdAt: Timestamp;
    isRead: boolean;
    entityId?: string;
    message: string;
    entityType?: string;
    recipientId: Principal;
}
export type Result_30 = {
    __kind__: "ok";
    ok: ConversationThread;
} | {
    __kind__: "err";
    err: string;
};
export interface ResellerQTDRanking {
    rank: bigint;
    attainmentPercent: number;
    resellerId: string;
    resellerName: string;
    renewalRevenue: number;
}
export type NotificationRuleId = string;
export interface UserProfile {
    id: string;
    isPrimaryAdmin: boolean;
    permissions: Array<string>;
    createdAt: bigint;
    role: UserRole;
    fullName: string;
    email: string;
    companyId: string;
}
export type Timestamp = bigint;
export interface AccountTab {
    id: string;
    sortOrder: bigint;
    isCustom: boolean;
    isVisible: boolean;
    tabLabel: string;
    hiddenForDepts: Array<string>;
    hiddenForRoles: Array<string>;
}
export interface PriceList {
    id: string;
    region: string;
    expiryDate: bigint;
    productFamily: string;
    name: string;
    createdAt: bigint;
    createdBy: string;
    version: string;
    currency: string;
    effectiveDate: bigint;
    fileKey: string;
}
export interface TargetAssignment {
    periodType: TargetPeriodType;
    assignedAt: Timestamp;
    assignedBy: string;
    assignmentScope: TargetScope;
    periodKey: string;
    assignmentId: string;
    vendorId: string;
    targetValue: number;
    measureId: TargetMeasureId;
}
export type Result_16 = {
    __kind__: "ok";
    ok: MfaSetupChallenge;
} | {
    __kind__: "err";
    err: AuthError;
};
export type Result_1 = {
    __kind__: "ok";
    ok: SessionToken;
} | {
    __kind__: "err";
    err: AuthError;
};
export interface QuarterDef {
    endDate: string;
    name: string;
    quarterId: string;
    startDate: string;
}
export type Result_22 = {
    __kind__: "ok";
    ok: NLQueryResult;
} | {
    __kind__: "err";
    err: string;
};
export interface SmartQueryResultItem {
    riskTier?: RiskTier;
    distributorName?: string;
    lastEngagementDays?: bigint;
    entityId: string;
    resellerName?: string;
    details: string;
    entityName: string;
    entityType: string;
    daysUntilRenewal?: bigint;
    riskScore?: bigint;
}
export interface DuplicateCheckResult {
    matchType: string;
    matchingDomain?: string;
    suggestion: string;
    existingOwner?: string;
    isDuplicate: boolean;
    existingAccountId?: string;
}
export type Result_19 = {
    __kind__: "ok";
    ok: TargetAssignment;
} | {
    __kind__: "err";
    err: string;
};
export type Result_29 = {
    __kind__: "ok";
    ok: Conversation;
} | {
    __kind__: "err";
    err: string;
};
export interface NLQueryResult {
    interpretationExplanation: string;
    queryResult: SmartQueryResult;
    confidenceLevel: string;
    interpretedFilters: SmartQueryFilter;
    originalQuery: string;
    interpretedQueryType: SmartQueryType;
}
export interface PriceListInput {
    region: string;
    expiryDate: bigint;
    productFamily: string;
    name: string;
    version: string;
    currency: string;
    effectiveDate: bigint;
    fileKey: string;
}
export interface TierConfig {
    permissions: Array<TierPermission>;
    tier: PartnerTier;
    updatedAt: Timestamp;
    updatedBy: Principal;
    maxSecondaryAdmins: bigint;
}
export interface RoleMapping {
    providerGroup: string;
    channelforgeRole: string;
}
export interface PromotionInput {
    resellerEligibility: Array<string>;
    endDate: bigint;
    description: string;
    fileKeys: Array<string>;
    callToAction: string;
    promoName: string;
    product: string;
    startDate: bigint;
}
export interface CustomFieldValueRef {
    value: string;
    fieldDefId: string;
}
export interface BulkImportResult {
    created: bigint;
    skipped: bigint;
    errors: Array<string>;
}
export interface DealRegistrationInput {
    submittedDate?: bigint;
    status: DealStatus;
    closeDate: bigint;
    accountId: string;
    submittedBy: string;
    vendorOwnerId: string;
    resellerId: string;
    opportunityName: string;
    notes: string;
    estimatedValue: number;
    quantity: bigint;
    customerDomain: string;
    competitor: string;
    product: string;
    dealStage: string;
}
export interface AccountInput {
    status: AccountStatus;
    licenceQuantity: bigint;
    distributorIds: Array<string>;
    estimatedRenewalValue: number;
    contractType: string;
    productList: Array<string>;
    sites: Array<AccountSite>;
    vendorOwnerId: string;
    accountName: string;
    resellerOwnerId: string;
    customerIdNumber?: string;
    customerDomain: string;
    renewalDate: bigint;
}
export interface TargetMeasureConfig {
    measures: Array<TargetMeasure>;
    updatedAt: Timestamp;
    updatedBy: string;
    vendorId: string;
}
export interface NoteInput {
    content: string;
    accountId: string;
    authorName: string;
    authorRole: string;
}
export interface UserProfileInput {
    isPrimaryAdmin: boolean;
    permissions: Array<string>;
    role: UserRole;
    fullName: string;
    email: string;
    companyId: string;
}
export type LayoutId = string;
export type Result_2 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: AuthError;
};
export interface CreditTopUp {
    simulatedAmount: number;
    userId: string;
    aiAdded: bigint;
    computeAdded: bigint;
    timestamp: bigint;
    storageAdded: bigint;
    packageId: string;
}
export interface OrgVisibilityConfig {
    orgId: string;
    lockedByParent: boolean;
    updatedAt: bigint;
    customRules: Array<VisibilityRule>;
    defaultInheritFromVendor: boolean;
}
export interface DealRegistration {
    id: string;
    submittedDate?: bigint;
    status: DealStatus;
    closeDate: bigint;
    accountId: string;
    createdAt: bigint;
    submittedBy: string;
    updatedAt: bigint;
    vendorOwnerId: string;
    resellerId: string;
    opportunityName: string;
    notes: string;
    estimatedValue: number;
    quantity: bigint;
    customerDomain: string;
    competitor: string;
    product: string;
    dealStage: string;
}
export interface ForgeAIRecommendation {
    id: string;
    affectedEntityName: string;
    affectedEntityType: string;
    suggestedAction: string;
    recommendationType: string;
    affectedEntityId: string;
    summary: string;
    timestamp: Timestamp;
    confidence: bigint;
    dismissed: boolean;
    riskLevel: RiskTier;
}
export interface BusinessPlanInput {
    month?: bigint;
    revenueTarget: number;
    objective: string;
    quarter?: bigint;
    year: bigint;
    activities: Array<BusinessPlanActivity>;
    partnerId: string;
    vendorOwnerId: string;
    pipelineTarget: number;
    planType: PlanType;
}
export interface QTDMetrics {
    dealRegistrationsApproved: bigint;
    pipelineClosed: number;
    quarterKey: string;
    newBusinessRevenue: number;
    calculatedAt: Timestamp;
    resellerId?: string;
    currency: string;
    renewalRevenue: number;
    dealRegistrationsSubmitted: bigint;
    pipelineCreated: number;
}
export interface CustomFieldBulkValidationResult {
    allValid: boolean;
    results: Array<CustomFieldValidationResult>;
}
export interface CustomerIdAuditEntry {
    action: CustomerIdAuditAction;
    accountId: string;
    detail: string;
    entryId: string;
    performedAt: bigint;
    performedBy: string;
    customerId: string;
}
export interface VisibilityRule__1 {
    id: string;
    action: VisibilityRuleAction;
    operator: VisibilityOperator;
    targetType: VisibilityTargetType;
    conditions: Array<VisibilityCondition>;
    targetId: string;
}
export type Result_6 = {
    __kind__: "ok";
    ok: Note;
} | {
    __kind__: "err";
    err: string;
};
export interface CreditBalance {
    storageCredits: bigint;
    aiCredits: bigint;
    computeCredits: bigint;
}
export type Result_12 = {
    __kind__: "ok";
    ok: Contact;
} | {
    __kind__: "err";
    err: string;
};
export interface BusinessPlanActivity {
    id: string;
    status: ActivityStatus;
    owner: string;
    dueDate: bigint;
    description: string;
    notes: string;
}
export interface LayoutAuditEntry {
    id: string;
    beforeState?: string;
    action: string;
    entityId: string;
    performedBy: string;
    timestamp: bigint;
    entityType: string;
    afterState?: string;
}
export interface RenewalRiskScore {
    accountId: string;
    lastAnalyzed: Timestamp;
    signals: Array<RiskSignal>;
    recommendations: Array<string>;
    tier: RiskTier;
    score: bigint;
    confidence: bigint;
}
export interface EngagementGapAlert {
    threshold: bigint;
    detectedAt: Timestamp;
    alertLevel: RiskTier;
    description: string;
    daysSinceEngagement: bigint;
    entityId: string;
    entityName: string;
    entityType: string;
}
export interface Account {
    id: string;
    status: AccountStatus;
    reassignmentLog: Array<AccountReassignmentEntry>;
    licenceQuantity: bigint;
    distributorIds: Array<string>;
    estimatedRenewalValue: number;
    createdAt: bigint;
    contractType: string;
    productList: Array<string>;
    sites: Array<AccountSite>;
    updatedAt: bigint;
    vendorOwnerId: string;
    accountName: string;
    resellerOwnerId: string;
    customerIdNumber?: string;
    customerDomain: string;
    renewalDate: bigint;
}
export interface VisibilityRule {
    id: string;
    ruleType: VisibilityRuleType;
    orgId: string;
    createdAt: bigint;
    isActive: boolean;
    updatedAt: bigint;
    conditions: Array<VisibilityRuleCondition>;
    objectType: CustomFieldObjectType;
}
export type Result_13 = {
    __kind__: "ok";
    ok: BusinessPlan;
} | {
    __kind__: "err";
    err: string;
};
export interface AIAuditEntry {
    id: string;
    organizationId: string;
    action: AIAuditAction;
    userId: string;
    timestamp: bigint;
    details: string;
    providerId?: string;
}
export interface InviteUserInput {
    role: UserRole;
    email: string;
    companyId: string;
}
export interface MdfRequestDecisionInput {
    decision: MdfRequestStatus;
    approvalNote?: string;
}
export interface ForgeAISettings {
    distributorInactivityThresholdDays: bigint;
    recommendationsEnabled: boolean;
    resellerInactivityThresholdDays: bigint;
    engagementGapEnabled: boolean;
    escalationThresholdDays: bigint;
    gapNotificationConfig: GapNotificationConfig;
    auditLogLevel: string;
    enabled: boolean;
    messagingAssistEnabled: boolean;
    smartQueriesEnabled: boolean;
    warningThresholdDays: bigint;
    renewalRiskEnabled: boolean;
}
export interface WidgetConfig {
    title: string;
    widgetId: string;
    refreshIntervalSecs?: bigint;
    posX: bigint;
    posY: bigint;
    size: WidgetSize;
    roleFilter: Array<string>;
    widgetType: WidgetType;
    aiSummaryEnabled: boolean;
    accountFilter?: string;
    dateRange?: string;
    customConfig: string;
    isPinned: boolean;
    deptFilter: Array<string>;
    territoryFilter?: string;
}
export type Result_27 = {
    __kind__: "ok";
    ok: PasswordResetToken;
} | {
    __kind__: "err";
    err: AuthError;
};
export type LockStatus = {
    __kind__: "Unlocked";
    Unlocked: null;
} | {
    __kind__: "LockedBy";
    LockedBy: LockSource;
} | {
    __kind__: "InheritedFrom";
    InheritedFrom: LockSource;
};
export interface VisibilityRuleInput {
    ruleType: VisibilityRuleType;
    isActive: boolean;
    conditions: Array<VisibilityRuleCondition>;
    objectType: CustomFieldObjectType;
}
export interface MarketingActivityUpdateInput {
    roi?: bigint;
    status?: MarketingActivityStatus;
    activityName?: string;
    activityType?: MarketingActivityType;
    endDate?: bigint;
    associatedPromotionIds?: Array<string>;
    currency?: string;
    targetAccountIds?: Array<string>;
    budget?: bigint;
    startDate?: bigint;
}
export interface CompanyProfileInput {
    emailDomain: string;
    partnerDomains: Array<string>;
    logoKey?: string;
    companyName: string;
    companyType: CompanyType;
    companyId: string;
}
export interface ResidentInvitation {
    id: string;
    status: InvitationStatus;
    expiresAt: bigint;
    createdAt: bigint;
    role: UserRole;
    invitedBy: string;
    email: string;
    companyId: string;
}
export interface PasswordResetToken {
    id: string;
    expiresAt: bigint;
    userId: string;
    createdAt: bigint;
    used: boolean;
    email: string;
    companyType: CompanyType;
    revokedBy?: string;
}
export interface ResellerInput {
    emailDomain: string;
    primaryAdminEmail: string;
    logoKey?: string;
    companyName: string;
    companyId: string;
}
export interface UnlockRequest {
    ruleName: string;
    requestingAdminName: string;
    status: UnlockRequestStatus;
    requestingOrgId: string;
    requestId: string;
    requestingAdminId: Principal;
    ruleId: NotificationRuleId;
    createdAt: Timestamp;
    lockSource: LockSource;
    targetOrgId: string;
    resolvedAt?: Timestamp;
    resolvedBy?: Principal;
    reason: string;
}
export interface SmartQueryFilter {
    region?: string;
    renewalWindowDays?: bigint;
    distributorId?: string;
    accountManagerId?: string;
    resellerId?: string;
    maxContractValue?: bigint;
    minContractValue?: bigint;
    riskLevel?: string;
    product?: string;
}
export interface TierOverride {
    permission: TierPermission;
    overriddenAt: Timestamp;
    overriddenBy: Principal;
    granted: boolean;
    resellerId: string;
    reason: string;
}
export interface MarketingActivity {
    id: string;
    roi?: bigint;
    status: MarketingActivityStatus;
    activityName: string;
    activityType: MarketingActivityType;
    endDate: bigint;
    associatedPromotionIds: Array<string>;
    customFieldValues: Array<CustomFieldValueRef>;
    createdAt: bigint;
    distributorId?: string;
    ownerUserId: string;
    updatedAt: bigint;
    vendorOwnerId: string;
    resellerId?: string;
    currency: string;
    targetAccountIds: Array<string>;
    budget: bigint;
    startDate: bigint;
}
export type Result_23 = {
    __kind__: "ok";
    ok: {
        gapAlerts: Array<EngagementGapAlert>;
        recommendations: Array<ForgeAIRecommendation>;
        riskScores: Array<RenewalRiskScore>;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface ForexConfig {
    refreshMode: ForexRefreshMode;
    customApiEndpoint?: string;
    updatedAt: Timestamp;
    updatedBy: Principal;
    primaryProvider: ForexProvider;
    defaultCurrency: Currency;
    fallbackProviders: Array<ForexProvider>;
    cryptoEnabled: boolean;
}
export interface CustomerIdFormatRule {
    duplicatePreventionEnabled: boolean;
    regionRules: Array<string>;
    autoGenerationEnabled: boolean;
    formatPattern: string;
    characterLimit: bigint;
    numberSequencing: CustomerIdNumberSequencing;
    updatedAt: bigint;
    manualOverridePermitted: boolean;
    prefixRules: string;
    vendorId: string;
    allowedSeparators: Array<string>;
    lastSequenceNumber: bigint;
}
export interface CustomerIdValidationResult {
    formattedId?: string;
    errorMessage?: string;
    isDuplicate: boolean;
    isValid: boolean;
}
export interface OrgVisibilityConfigInput {
    lockedByParent: boolean;
    defaultInheritFromVendor: boolean;
}
export type AuthError = {
    __kind__: "SessionInvalid";
    SessionInvalid: null;
} | {
    __kind__: "TokenAlreadyUsed";
    TokenAlreadyUsed: null;
} | {
    __kind__: "CompanyNotFound";
    CompanyNotFound: null;
} | {
    __kind__: "NotAuthorized";
    NotAuthorized: null;
} | {
    __kind__: "PasswordReused";
    PasswordReused: null;
} | {
    __kind__: "MfaNotEnrolled";
    MfaNotEnrolled: null;
} | {
    __kind__: "TokenExpired";
    TokenExpired: null;
} | {
    __kind__: "InvalidCredentials";
    InvalidCredentials: null;
} | {
    __kind__: "TokenInvalid";
    TokenInvalid: null;
} | {
    __kind__: "AccountLocked";
    AccountLocked: {
        lockedUntil: bigint;
    };
} | {
    __kind__: "ConfigError";
    ConfigError: string;
} | {
    __kind__: "MfaInvalidCode";
    MfaInvalidCode: null;
} | {
    __kind__: "MfaAlreadyEnrolled";
    MfaAlreadyEnrolled: null;
} | {
    __kind__: "MfaRequired";
    MfaRequired: null;
} | {
    __kind__: "PasswordAuthDisabled";
    PasswordAuthDisabled: null;
} | {
    __kind__: "PasswordTooWeak";
    PasswordTooWeak: Array<string>;
} | {
    __kind__: "SessionExpired";
    SessionExpired: null;
} | {
    __kind__: "UserNotFound";
    UserNotFound: null;
} | {
    __kind__: "AccountInactive";
    AccountInactive: null;
};
export interface AuditEntry {
    id: string;
    action: string;
    userId: string;
    entityId: string;
    timestamp: bigint;
    details: string;
    entityType: string;
}
export type TargetScope = {
    __kind__: "ByDistributor";
    ByDistributor: string;
} | {
    __kind__: "ByTier";
    ByTier: string;
} | {
    __kind__: "ByUser";
    ByUser: string;
} | {
    __kind__: "ByCountry";
    ByCountry: string;
} | {
    __kind__: "ByReseller";
    ByReseller: string;
} | {
    __kind__: "AllResellers";
    AllResellers: null;
} | {
    __kind__: "ByProductFamily";
    ByProductFamily: string;
};
export type Result_5 = {
    __kind__: "ok";
    ok: PriceList;
} | {
    __kind__: "err";
    err: string;
};
export interface SmartQueryResult {
    insights: Array<string>;
    queryType: SmartQueryType;
    generatedAt: Timestamp;
    totalCount: bigint;
    summary: string;
    items: Array<SmartQueryResultItem>;
    filtersApplied: SmartQueryFilter;
}
export interface MarketingActivityInput {
    activityName: string;
    activityType: MarketingActivityType;
    endDate: bigint;
    associatedPromotionIds: Array<string>;
    distributorId?: string;
    vendorOwnerId: string;
    resellerId?: string;
    currency: string;
    targetAccountIds: Array<string>;
    budget: bigint;
    startDate: bigint;
}
export interface DistributorInput {
    emailDomain: string;
    primaryAdminEmail: string;
    logoKey?: string;
    companyName: string;
    companyId: string;
}
export interface ChatMessage {
    id: string;
    content: string;
    context?: string;
    aiSource: string;
    role: ChatRole;
    timestamp: bigint;
    suggestedActions: Array<string>;
}
export type Result_28 = {
    __kind__: "ok";
    ok: CompanyProfile;
} | {
    __kind__: "err";
    err: string;
};
export interface CompanyProfile {
    id: string;
    emailDomain: string;
    partnerDomains: Array<string>;
    setupComplete: boolean;
    createdAt: bigint;
    claimedAt?: bigint;
    claimedBy?: string;
    logoKey?: string;
    activationStatus: ActivationStatus;
    vendorId?: string;
    companyName: string;
    companyType: CompanyType;
    companyId: string;
}
export interface FiscalYearConfig {
    fiscalYearType: FiscalYearType;
    updatedAt: Timestamp;
    updatedBy: string;
    vendorId: string;
    quarters: Array<QuarterDef>;
}
export interface FailedLoginEvent {
    id: string;
    userId?: string;
    email: string;
    attemptCount: bigint;
    timestamp: bigint;
    ipHint: string;
    companyType: CompanyType;
    reason: string;
}
export type Result_9 = {
    __kind__: "ok";
    ok: TargetMeasureConfig;
} | {
    __kind__: "err";
    err: string;
};
export interface CustomerIdFormatRuleInput {
    duplicatePreventionEnabled: boolean;
    regionRules: Array<string>;
    autoGenerationEnabled: boolean;
    formatPattern: string;
    characterLimit: bigint;
    numberSequencing: CustomerIdNumberSequencing;
    manualOverridePermitted: boolean;
    prefixRules: string;
    allowedSeparators: Array<string>;
}
export interface CustomFieldDefInput {
    editPermissions: Array<CustomFieldPermission>;
    isRequired: boolean;
    isExportVisible: boolean;
    fieldLabel: string;
    allowedValues: Array<string>;
    isSearchable: boolean;
    isReportable: boolean;
    viewPermissions: Array<CustomFieldPermission>;
    validationRules: Array<CustomFieldValidationRule>;
    fieldDescription: string;
    visibilityScope: CustomFieldVisibilityScope;
    objectType: CustomFieldObjectType;
    isApiVisible: boolean;
    fieldName: string;
    fieldType: CustomFieldType;
    defaultValue?: string;
}
export interface MdfRequest {
    id: string;
    status: MdfRequestStatus;
    requestorOrgId: string;
    customFieldValues: Array<CustomFieldValueRef>;
    approvedAt?: bigint;
    approvedBy?: string;
    createdAt: bigint;
    approvalNote?: string;
    budgetYear: bigint;
    updatedAt: bigint;
    vendorOwnerId: string;
    requestorUserId: string;
    currency: string;
    budgetQuarter?: bigint;
    associatedAccountId?: string;
    amount: bigint;
    purpose: string;
}
export interface QTDFilters {
    country?: string;
    tierName?: string;
    productFamily?: string;
    quarterKey?: string;
    resellerId?: string;
    currency?: string;
    targetSegment?: TargetMeasureId;
}
export interface ReadReceipt {
    userId: string;
    readAt: bigint;
}
export type Result_17 = {
    __kind__: "ok";
    ok: Message;
} | {
    __kind__: "err";
    err: string;
};
export interface ExchangeRateSnapshot {
    toCurrency: Currency;
    provider: ForexProvider;
    fetchedAt: Timestamp;
    fromCurrency: Currency;
    rate: number;
}
export interface LockedAccountInfo {
    failedCount: bigint;
    userId: string;
    fullName: string;
    email: string;
    lockedAt: bigint;
    lockedUntil: bigint;
    companyId: string;
}
export interface NewsItem {
    id: string;
    title: string;
    publishDate: bigint;
    body: string;
    createdAt: bigint;
    publishedBy: string;
    visibility: NewsVisibility;
}
export type ConversationId = string;
export interface LayoutField {
    id: string;
    fieldLabel: string;
    sortOrder: bigint;
    sectionId?: string;
    visible: boolean;
    required: boolean;
    options: Array<string>;
    fieldType: FieldType;
    defaultValue?: string;
}
export type Result_24 = {
    __kind__: "ok";
    ok: CreditBalance;
} | {
    __kind__: "err";
    err: string;
};
export type Result_14 = {
    __kind__: "ok";
    ok: Account;
} | {
    __kind__: "err";
    err: string;
};
export interface AIProvider {
    id: string;
    status: AIProviderStatus;
    name: string;
    createdAt: bigint;
    createdBy: string;
    isShared: boolean;
    workspaceId: string;
    providerType: AIProviderType;
}
export interface LayoutPermissions {
    canManageDashboardTemplates: boolean;
    canManageCustomFields: boolean;
    canManageWidgets: boolean;
    canManageLayouts: boolean;
}
export interface Contact {
    id: string;
    contactType: string;
    lastContactedDate?: bigint;
    accountId: string;
    createdAt: bigint;
    email: string;
    contactOwner: string;
    jobTitle: string;
    notes: string;
    nextActionDate?: bigint;
    phone: string;
    lastName: string;
    firstName: string;
}
export interface AlertInput {
    alertType: AlertType;
    accountId?: string;
    userId: string;
    message: string;
    severity: AlertSeverity;
}
export interface RiskSignal {
    dataSource: string;
    description: string;
    severity: RiskTier;
    signalType: string;
}
export interface AccountSite {
    region: string;
    country: string;
    distributorId?: string;
    siteName: string;
    productLines: Array<string>;
    resellerId?: string;
    siteId: string;
}
export interface DashboardLayout {
    id: string;
    assignedTo: Array<string>;
    isTemplate: boolean;
    widgets: Array<WidgetConfig>;
    name: string;
    createdAt: bigint;
    createdBy: string;
    description: string;
    templateType?: DashboardTemplateType;
    updatedAt: bigint;
}
export interface GapNotificationConfig {
    high: GapNotificationRecipientConfig;
    critical: GapNotificationRecipientConfig;
}
export interface Message {
    id: MessageId;
    content: string;
    sentAt: bigint;
    conversationId: ConversationId;
    attachmentUrls: Array<string>;
    senderId: string;
    readBy: Array<ReadReceipt>;
}
export interface ForgeAIAuditEntry {
    id: string;
    analysisType: string;
    triggeredBy: string;
    entityId: string;
    timestamp: Timestamp;
    details: string;
    entityName: string;
    confidence?: bigint;
    riskLevel?: RiskTier;
}
export interface UsageEvent {
    orgId: string;
    storageCost: bigint;
    userId: string;
    actionType: string;
    aiCost: bigint;
    timestamp: bigint;
    computeCost: bigint;
}
export type Result_20 = {
    __kind__: "ok";
    ok: FiscalYearConfig;
} | {
    __kind__: "err";
    err: string;
};
export enum AIAuditAction {
    ChatMessage = "ChatMessage",
    ProviderAdded = "ProviderAdded",
    SharingRevoked = "SharingRevoked",
    ProviderDeleted = "ProviderDeleted",
    ApiKeyUpdated = "ApiKeyUpdated",
    SharingGranted = "SharingGranted",
    ProviderDisabled = "ProviderDisabled",
    ProviderEnabled = "ProviderEnabled",
    TestAttempt = "TestAttempt",
    ProviderUpdated = "ProviderUpdated"
}
export enum AIProviderStatus {
    Active = "Active",
    Disabled = "Disabled",
    Testing = "Testing"
}
export enum AIProviderType {
    Mistral = "Mistral",
    OpenAI = "OpenAI",
    Native = "Native",
    AnthropicClaude = "AnthropicClaude",
    GoogleGemini = "GoogleGemini",
    LocalLLM = "LocalLLM",
    AzureOpenAI = "AzureOpenAI",
    CustomEndpoint = "CustomEndpoint"
}
export enum AccountStatus {
    Churned = "Churned",
    Prospect = "Prospect",
    Active = "Active",
    AtRisk = "AtRisk"
}
export enum ActivationStatus {
    Active = "Active",
    Suspended = "Suspended",
    Pending = "Pending"
}
export enum ActivityStatus {
    Overdue = "Overdue",
    InProgress = "InProgress",
    Completed = "Completed",
    Pending = "Pending"
}
export enum AlertDeliveryMode {
    DashboardOnly = "DashboardOnly",
    Both = "Both",
    MessageOnly = "MessageOnly"
}
export enum AlertFrequency {
    Hourly = "Hourly",
    Weekly = "Weekly",
    Daily = "Daily",
    Realtime = "Realtime"
}
export enum AlertSeverity {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export enum AlertType {
    MissingContact = "MissingContact",
    DealExpiry = "DealExpiry",
    RenewalDue = "RenewalDue",
    BusinessPlanDue = "BusinessPlanDue",
    PromoExpiry = "PromoExpiry",
    CustomerRisk = "CustomerRisk",
    DuplicateAccount = "DuplicateAccount",
    LeadToCall = "LeadToCall"
}
export enum ChatRole {
    System = "System",
    User = "User",
    Assistant = "Assistant"
}
export enum CompanyType {
    Distributor = "Distributor",
    Reseller = "Reseller",
    Vendor = "Vendor"
}
export enum ConditionOperator {
    contains = "contains",
    notEquals = "notEquals",
    equals = "equals"
}
export enum ConversationType {
    DealThread = "DealThread",
    RenewalThread = "RenewalThread",
    DirectMessage = "DirectMessage",
    GroupMessage = "GroupMessage",
    AccountThread = "AccountThread"
}
export enum Currency {
    AUD = "AUD",
    BTC = "BTC",
    CNY = "CNY",
    EUR = "EUR",
    GBP = "GBP",
    JPY = "JPY",
    USD = "USD"
}
export enum CustomFieldObjectType {
    distributorProfile = "distributorProfile",
    mdfRequest = "mdfRequest",
    businessPlan = "businessPlan",
    marketingActivity = "marketingActivity",
    resellerProfile = "resellerProfile",
    promotion = "promotion",
    customerAccount = "customerAccount",
    opportunity = "opportunity",
    userProfile = "userProfile",
    dealRegistration = "dealRegistration"
}
export enum CustomFieldPermission {
    creator = "creator",
    owner = "owner",
    edit = "edit",
    view = "view"
}
export enum CustomFieldType {
    tag = "tag",
    url = "url",
    regionSelector = "regionSelector",
    date = "date",
    userSelector = "userSelector",
    text = "text",
    multiSelect = "multiSelect",
    email = "email",
    currency = "currency",
    number_ = "number",
    longText = "longText",
    checkbox = "checkbox",
    organizationSelector = "organizationSelector",
    phoneNumber = "phoneNumber",
    attachment = "attachment",
    percentage = "percentage",
    datetime = "datetime",
    dropdown = "dropdown"
}
export enum CustomFieldValidationRuleType {
    minValue = "minValue",
    conditionalRequired = "conditionalRequired",
    allowedValues = "allowedValues",
    unique = "unique",
    required = "required",
    maxLength = "maxLength",
    maxValue = "maxValue",
    regex = "regex",
    minLength = "minLength"
}
export enum CustomFieldVisibilityScope {
    internalOnly = "internalOnly",
    allOrgs = "allOrgs",
    distributorOnly = "distributorOnly",
    resellerOnly = "resellerOnly",
    roleSpecific = "roleSpecific",
    vendorOnly = "vendorOnly"
}
export enum CustomerIdAuditAction {
    created = "created",
    formatRuleChanged = "formatRuleChanged",
    duplicateBlocked = "duplicateBlocked",
    manualOverride = "manualOverride",
    mergeResolved = "mergeResolved",
    updated = "updated"
}
export enum CustomerIdNumberSequencing {
    custom = "custom",
    random = "random",
    sequential = "sequential"
}
export enum DashboardTemplateType {
    Role = "Role",
    Department = "Department",
    OrgType = "OrgType"
}
export enum DealStatus {
    Won = "Won",
    UnderReview = "UnderReview",
    Lost = "Lost",
    Approved = "Approved",
    Draft = "Draft",
    Rejected = "Rejected",
    Submitted = "Submitted",
    Expired = "Expired"
}
export enum DuplicateDRStatus {
    Merged = "Merged",
    PendingVendorReview = "PendingVendorReview",
    Approved = "Approved",
    Rejected = "Rejected",
    Escalated = "Escalated",
    Reassigned = "Reassigned"
}
export enum FieldType {
    Tag = "Tag",
    Url = "Url",
    Email = "Email",
    UserSelector = "UserSelector",
    Date_ = "Date",
    Text = "Text",
    MultiSelect = "MultiSelect",
    Phone = "Phone",
    Currency = "Currency",
    LongText = "LongText",
    Checkbox = "Checkbox",
    DateTime = "DateTime",
    RegionSelector = "RegionSelector",
    OrgSelector = "OrgSelector",
    Attachment = "Attachment",
    Number = "Number",
    Dropdown = "Dropdown",
    Percentage = "Percentage"
}
export enum FiscalYearType {
    CustomFiscal = "CustomFiscal",
    CalendarYear = "CalendarYear"
}
export enum ForexProvider {
    XE = "XE",
    ECB = "ECB",
    Binance = "Binance",
    BankOfEngland = "BankOfEngland",
    Coinbase = "Coinbase",
    CustomAPI = "CustomAPI",
    OpenExchangeRates = "OpenExchangeRates"
}
export enum ForexRefreshMode {
    Hourly = "Hourly",
    Weekly = "Weekly",
    Daily = "Daily",
    LiveOnLoad = "LiveOnLoad",
    ManualOnly = "ManualOnly"
}
export enum ForgeAIAlertType {
    BusinessPlanInactivity = "BusinessPlanInactivity",
    AccountRisk = "AccountRisk",
    ResellerEngagementGap = "ResellerEngagementGap",
    DealRegistrationWarning = "DealRegistrationWarning",
    DistributorEngagementGap = "DistributorEngagementGap",
    StalledApproval = "StalledApproval",
    ChannelHealthScoreChange = "ChannelHealthScoreChange",
    RenewalRisk = "RenewalRisk",
    PipelineHealth = "PipelineHealth"
}
export enum InvitationStatus {
    Accepted = "Accepted",
    Cancelled = "Cancelled",
    Expired = "Expired",
    Pending = "Pending"
}
export enum LockSource {
    Distributor = "Distributor",
    Vendor = "Vendor"
}
export enum MarketingActivityStatus {
    cancelled = "cancelled",
    completed = "completed",
    planned = "planned",
    inProgress = "inProgress"
}
export enum MarketingActivityType {
    sponsorship = "sponsorship",
    content = "content",
    other = "other",
    emailCampaign = "emailCampaign",
    webinar = "webinar",
    event = "event"
}
export enum MdfRequestStatus {
    cancelled = "cancelled",
    pending = "pending",
    paid = "paid",
    approved = "approved",
    rejected = "rejected"
}
export enum NotificationType {
    TierAssigned = "TierAssigned",
    WorkspaceActivated = "WorkspaceActivated",
    DealApproved = "DealApproved",
    DealRejected = "DealRejected",
    DuplicateDRFlagged = "DuplicateDRFlagged",
    DuplicateDRReviewed = "DuplicateDRReviewed",
    EngagementGapAlert = "EngagementGapAlert",
    UnlockRequested = "UnlockRequested"
}
export enum OpportunityStage {
    prospecting = "prospecting",
    closedWon = "closedWon",
    proposal = "proposal",
    negotiation = "negotiation",
    qualification = "qualification",
    closedLost = "closedLost"
}
export enum OpportunityStatus {
    active = "active",
    archived = "archived"
}
export enum PartnerTier {
    Gold = "Gold",
    Platinum = "Platinum",
    Silver = "Silver"
}
export enum PlanType {
    Quarterly = "Quarterly",
    Monthly = "Monthly",
    Annual = "Annual"
}
export enum ProfileVisibilityScope {
    ConnectedOnly = "ConnectedOnly",
    WorkspaceOnly = "WorkspaceOnly"
}
export enum ReassignmentApprovalStatus {
    Approved = "Approved",
    Rejected = "Rejected",
    Pending = "Pending"
}
export enum RiskTier {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Healthy = "Healthy",
    Critical = "Critical"
}
export enum SSOProvider {
    azure_ad = "azure_ad",
    custom = "custom",
    none = "none",
    oidc = "oidc",
    okta = "okta",
    saml = "saml",
    google_workspace = "google_workspace",
    internet_identity = "internet_identity"
}
export enum SmartQueryType {
    CustomersNoActivePipeline = "CustomersNoActivePipeline",
    InactiveResellers = "InactiveResellers",
    AccountsNoEngagement = "AccountsNoEngagement",
    HighRiskRenewals = "HighRiskRenewals",
    ContractsMissingPlans = "ContractsMissingPlans",
    StalledApprovals = "StalledApprovals",
    DecliningEngagement = "DecliningEngagement",
    HighGrowthOpportunities = "HighGrowthOpportunities",
    TopPerformingDistributors = "TopPerformingDistributors",
    PendingDRsOver14Days = "PendingDRsOver14Days",
    ResellersBelowTarget = "ResellersBelowTarget",
    RenewalsExpiringNextMonth = "RenewalsExpiringNextMonth"
}
export enum TargetCalculationType {
    Weighted = "Weighted",
    Count = "Count",
    Percentage = "Percentage",
    Revenue = "Revenue"
}
export enum TargetMeasureId {
    Measure1 = "Measure1",
    Measure2 = "Measure2",
    Measure3 = "Measure3",
    Measure4 = "Measure4",
    Measure5 = "Measure5"
}
export enum TargetPeriodType {
    Quarterly = "Quarterly",
    Annual = "Annual"
}
export enum TierPermission {
    MDFRequests = "MDFRequests",
    ExportPermissions = "ExportPermissions",
    PricingDiscounts = "PricingDiscounts",
    RenewalVisibilityDepth = "RenewalVisibilityDepth",
    CustomerAnalytics = "CustomerAnalytics",
    StrategicAccountInsights = "StrategicAccountInsights",
    APIAccess = "APIAccess",
    AIRecommendations = "AIRecommendations",
    ForecastVisibility = "ForecastVisibility",
    PromotionsVisibility = "PromotionsVisibility",
    PipelineReporting = "PipelineReporting",
    AdvancedDashboards = "AdvancedDashboards",
    DealRegistrations = "DealRegistrations",
    SecondaryAdminAccess = "SecondaryAdminAccess"
}
export enum UnlockRequestStatus {
    Approved = "Approved",
    Declined = "Declined",
    Pending = "Pending"
}
export enum UserRole {
    DistributorSecondaryAdmin = "DistributorSecondaryAdmin",
    ResellerSalesUser = "ResellerSalesUser",
    ResellerPrimaryAdmin = "ResellerPrimaryAdmin",
    VendorSecondaryAdmin = "VendorSecondaryAdmin",
    VendorAdmin = "VendorAdmin",
    DistributorPrimaryAdmin = "DistributorPrimaryAdmin",
    DistributorSalesUser = "DistributorSalesUser",
    ResellerAdmin = "ResellerAdmin",
    VendorPrimaryAdmin = "VendorPrimaryAdmin",
    ReadOnlyViewer = "ReadOnlyViewer"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VisibilityConditionType {
    ByRole = "ByRole",
    ByOrgType = "ByOrgType",
    ByAccountType = "ByAccountType",
    ByDepartment = "ByDepartment",
    ByMarketSegment = "ByMarketSegment",
    ByTerritory = "ByTerritory"
}
export enum VisibilityOperator {
    Or = "Or",
    And = "And"
}
export enum VisibilityRuleAction {
    Hide = "Hide",
    Show = "Show"
}
export enum VisibilityRuleType {
    allow = "allow",
    deny = "deny"
}
export enum VisibilityTargetType {
    Tab = "Tab",
    Section = "Section",
    Field = "Field"
}
export enum WidgetSize {
    Large = "Large",
    Small = "Small",
    Medium = "Medium",
    Tall = "Tall",
    Wide = "Wide",
    FullWidth = "FullWidth"
}
export enum WidgetType {
    PipelineBoard = "PipelineBoard",
    MessagingWidget = "MessagingWidget",
    SlaTracking = "SlaTracking",
    OpportunitySummary = "OpportunitySummary",
    AiInsights = "AiInsights",
    DistributorPerformance = "DistributorPerformance",
    MdfTracking = "MdfTracking",
    TerritoryPerformance = "TerritoryPerformance",
    AccountHealth = "AccountHealth",
    Custom = "Custom",
    Forecasting = "Forecasting",
    LineGraph = "LineGraph",
    ResellerPerformance = "ResellerPerformance",
    KpiCard = "KpiCard",
    ComputeStorage = "ComputeStorage",
    RenewalTracker = "RenewalTracker",
    OperationalAlerts = "OperationalAlerts",
    AiUsage = "AiUsage",
    ActivityFeed = "ActivityFeed",
    BarChart = "BarChart"
}
export interface backendInterface {
    activateDistributor(id: string): Promise<Result_10>;
    activateReseller(resellerId: string): Promise<Result_28>;
    activateUser(userId: string): Promise<Result_2>;
    addAccountSite(accountId: string, site: AccountSite): Promise<Result_14>;
    addDistributorToAccount(accountId: string, distributorId: string, callerRole: string): Promise<Result_14>;
    addResellerToDistributor(distributorId: string, resellerId: string): Promise<Result_10>;
    addTierOverride(resellerId: string, permission: TierPermission, granted: boolean, reason: string): Promise<boolean>;
    addTopUp(orgId: string, topUp: CreditTopUp): Promise<Result_24>;
    addVendorRelationship(distributorId: string, vendorId: string): Promise<Result_10>;
    aiAddProvider(provider: AIProvider, config: AIProviderConfig): Promise<boolean>;
    aiCreateChatSession(providerId: string, contextType: string | null, contextId: string | null): Promise<ForgeAIChatSession>;
    aiDeleteProvider(providerId: string): Promise<boolean>;
    aiDisableProvider(providerId: string): Promise<boolean>;
    aiEnableProvider(providerId: string): Promise<boolean>;
    aiGetChatSession(sessionId: string): Promise<ForgeAIChatSession | null>;
    aiGetProvider(providerId: string): Promise<AIProvider | null>;
    aiGetProviderConfig(providerId: string): Promise<AIProviderConfig | null>;
    aiGrantAccess(rule: AIAccessRule): Promise<boolean>;
    aiListAccessRules(providerId: string): Promise<Array<AIAccessRule>>;
    aiListAuditLog(organizationId: string, limit: bigint): Promise<Array<AIAuditEntry>>;
    aiListChatSessions(): Promise<Array<ForgeAIChatSession>>;
    aiListProviders(workspaceId: string): Promise<Array<AIProvider>>;
    aiResolveProviderForCaller(organizationId: string, role: string, department: string | null): Promise<string | null>;
    aiRevokeAccess(ruleId: string): Promise<boolean>;
    aiSendChatMessage(sessionId: string, content: string): Promise<ChatMessage>;
    aiTestProviderConnection(providerId: string): Promise<string>;
    aiUpdateApiKey(providerId: string, maskedKey: string): Promise<boolean>;
    aiUpdateProviderConfig(config: AIProviderConfig): Promise<boolean>;
    archiveCustomFieldDef(id: string): Promise<boolean>;
    archiveOpportunity(id: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignTierToReseller(resellerId: string, tier: PartnerTier): Promise<boolean>;
    bulkCreateAccounts(inputs: Array<AccountInput>): Promise<BulkImportResult>;
    bulkCreateContacts(inputs: Array<ContactInput>): Promise<BulkImportResult>;
    bulkSetCustomFieldValues(inputs: Array<CustomFieldValueInput>): Promise<CustomFieldBulkValidationResult>;
    cancelInvitation(invitationId: string): Promise<Result_3>;
    cancelMdfRequest(id: string): Promise<boolean>;
    checkAccountDuplicate(name: string, domain: string): Promise<DuplicateCheckResult>;
    checkVisibility(orgId: string, objectType: CustomFieldObjectType, role: string, region: string | null): Promise<boolean>;
    cloneDashboardLayout(layoutId: string, newName: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    cloneTierPermissions(sourceTier: PartnerTier, targetTier: PartnerTier): Promise<boolean>;
    completeSetup(companyId: string): Promise<Result_28>;
    createAccount(input: AccountInput): Promise<Result_14>;
    createAlert(input: AlertInput): Promise<Result_31>;
    createBusinessPlan(input: BusinessPlanInput): Promise<Result_13>;
    createCompanyProfile(input: CompanyProfileInput): Promise<Result_28>;
    createContact(input: ContactInput): Promise<Result_12>;
    createCustomFieldDef(input: CustomFieldDefInput): Promise<CustomFieldDef>;
    createDealRegistration(input: DealRegistrationInput): Promise<Result_11>;
    createDirectMessage(recipientId: string, content: string, attachmentUrls: Array<string>): Promise<Result_30>;
    createDistributor(vendorCompanyId: string, input: DistributorInput): Promise<Result_10>;
    createGroupConversation(participantIds: Array<string>, entityType: string, entityId: string | null): Promise<Result_29>;
    createMarketingActivity(input: MarketingActivityInput): Promise<MarketingActivity>;
    createMdfRequest(vendorOwnerId: string, input: MdfRequestInput): Promise<MdfRequest>;
    createNewsItem(input: NewsItemInput): Promise<Result_7>;
    createNote(input: NoteInput): Promise<Result_6>;
    createOpportunity(input: OpportunityInput): Promise<Opportunity>;
    createPriceList(input: PriceListInput): Promise<Result_5>;
    createPromotion(input: PromotionInput): Promise<Result_4>;
    createReseller(vendorCompanyId: string, input: ResellerInput): Promise<Result_28>;
    createVisibilityRule(orgId: string, input: VisibilityRuleInput): Promise<VisibilityRule>;
    deactivateReseller(resellerId: string): Promise<Result_28>;
    deactivateUser(userId: string): Promise<Result_2>;
    decideMdfRequest(id: string, input: MdfRequestDecisionInput): Promise<MdfRequest | null>;
    deleteAccount(id: string): Promise<Result_3>;
    deleteAccountLayout(layoutId: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteContact(id: string): Promise<Result_3>;
    deleteDealRegistration(id: string): Promise<Result_3>;
    deleteNewsItem(id: string): Promise<Result_3>;
    deleteNote(id: string): Promise<Result_3>;
    deleteNotification(id: string): Promise<Result_3>;
    deletePriceList(id: string): Promise<Result_3>;
    deletePromotion(id: string): Promise<Result_3>;
    deleteTargetAssignment(assignmentId: string): Promise<Result_3>;
    deleteVisibilityRule(id: string): Promise<boolean>;
    dismissAlert(id: string): Promise<Result_3>;
    dismissForgeAIRecommendation(id: string): Promise<Result_3>;
    estimateDaysRemaining(orgId: string): Promise<bigint>;
    estimateMonthlyUsage(orgId: string): Promise<bigint>;
    forgotPassword(email: string, companyType: CompanyType, companyId: string): Promise<Result_27>;
    generateCustomerId(request: CustomerIdGenerateRequest): Promise<CustomerIdValidationResult>;
    getAccount(id: string): Promise<Account | null>;
    getAccountLayouts(): Promise<Array<AccountLayout>>;
    getAccountReassignmentLog(accountId: string): Promise<Array<AccountReassignmentEntry>>;
    getAccountsByDistributor(distributorId: string): Promise<Array<Account>>;
    getAccountsByReseller(resellerId: string): Promise<Array<Account>>;
    getActiveResetTokens(companyId: string): Promise<Array<ActiveResetTokenView>>;
    getAllAccounts(): Promise<Array<Account>>;
    getAllBusinessPlans(): Promise<Array<BusinessPlan>>;
    getAllDealRegistrations(): Promise<Array<DealRegistration>>;
    getAllNews(): Promise<Array<NewsItem>>;
    getAllPriceLists(): Promise<Array<PriceList>>;
    getAllPromotions(): Promise<Array<Promotion>>;
    getAuditLog(limit: bigint): Promise<Array<AuditEntry>>;
    getAuthSettings(orgId: string): Promise<AuthSettings>;
    getBusinessPlan(id: string): Promise<BusinessPlan | null>;
    getBusinessPlansByPartner(partnerId: string): Promise<Array<BusinessPlan>>;
    getCallerUserRole(): Promise<UserRole__1>;
    getCompanyProfile(id: string): Promise<CompanyProfile | null>;
    getContact(id: string): Promise<Contact | null>;
    getContactsByAccount(accountId: string): Promise<Array<Contact>>;
    getConversationMessages(conversationId: string, limit: bigint, offset: bigint): Promise<Array<Message>>;
    getConversationThread(conversationId: string): Promise<ConversationThread | null>;
    getCreditBalance(orgId: string): Promise<CreditBalance>;
    getCreditPackages(): Promise<Array<CreditPackage>>;
    getCurrentQuarter(): Promise<CurrentQuarterResult | null>;
    getCustomFieldDef(id: string): Promise<CustomFieldDef | null>;
    getCustomFieldValues(objectId: string, objectType: CustomFieldObjectType): Promise<Array<CustomFieldValue>>;
    getCustomerIdAuditLog(vendorId: string): Promise<Array<CustomerIdAuditEntry>>;
    getCustomerIdFormatRule(vendorId: string): Promise<CustomerIdFormatRule | null>;
    getDashboardLayouts(): Promise<Array<DashboardLayout>>;
    getDashboardTemplates(): Promise<Array<DashboardLayout>>;
    getDealRegistration(id: string): Promise<DealRegistration | null>;
    getDealRegistrationReport(filters: ReportFilters): Promise<Array<DealRegistration>>;
    getDealRegistrationsByReseller(resellerId: string): Promise<Array<DealRegistration>>;
    getDistributor(id: string): Promise<DistributorProfile | null>;
    getDistributorCustomerAccounts(distributorId: string): Promise<Array<Account>>;
    getDistributorResellers(distributorId: string): Promise<Array<string>>;
    getDuplicateDRQueue(): Promise<Array<DuplicateDRRecord>>;
    getEffectiveTierPermissions(resellerId: string): Promise<Array<TierPermission>>;
    getFailedLoginHistory(userId: string, limit: bigint): Promise<Array<FailedLoginEvent>>;
    getFiscalYearConfig(): Promise<FiscalYearConfig | null>;
    getForexConfig(): Promise<ForexConfig>;
    getForgeAIAuditLog(limit: bigint): Promise<Array<ForgeAIAuditEntry>>;
    getForgeAIRecommendations(): Promise<Array<ForgeAIRecommendation>>;
    getForgeAISettings(): Promise<ForgeAISettings>;
    getGapNotificationConfig(): Promise<GapNotificationConfig>;
    getHighRiskAccounts(): Promise<Array<Account>>;
    getInvitations(companyId: string): Promise<Array<ResidentInvitation>>;
    getLatestRate(from: Currency, to: Currency): Promise<ExchangeRateSnapshot | null>;
    getLayoutAuditLog(): Promise<Array<LayoutAuditEntry>>;
    getLayoutForUser(orgType: string, department: string, role: string): Promise<AccountLayout | null>;
    getLayoutPermissions(userId: string): Promise<LayoutPermissions | null>;
    getLockedAccounts(companyId: string): Promise<Array<LockedAccountInfo>>;
    getMarketingActivity(id: string): Promise<MarketingActivity | null>;
    getMdfRequest(id: string): Promise<MdfRequest | null>;
    getMeasureConfig(): Promise<TargetMeasureConfig>;
    getMyAlerts(): Promise<Array<Alert>>;
    getMyCompany(): Promise<CompanyProfile | null>;
    getMyNotifications(): Promise<Array<InAppNotification>>;
    getMyProfile(): Promise<UserProfileDetail | null>;
    getMyUserProfile(): Promise<UserProfile | null>;
    getNewsItem(id: string): Promise<NewsItem | null>;
    getNextAvailableResellerId(vendorId: string, prefix: string): Promise<Result_26>;
    getNotesByAccount(accountId: string): Promise<Array<Note>>;
    getOpportunity(id: string): Promise<Opportunity | null>;
    getOrgForgeAIAlertSettings(orgId: string): Promise<OrgForgeAIAlertSettings>;
    getOrgNotificationRules(orgId: string): Promise<Array<NotificationRule>>;
    getOrgVisibilityConfig(orgId: string): Promise<OrgVisibilityConfig>;
    getOverridesForReseller(resellerId: string): Promise<Array<TierOverride>>;
    getPartnerRankings(quarterKey: string): Promise<Array<ResellerQTDRanking>>;
    getPipelineReport(filters: ReportFilters): Promise<Array<DealRegistration>>;
    getPriceList(id: string): Promise<PriceList | null>;
    getPromotion(id: string): Promise<Promotion | null>;
    getPromotionsForPartner(partnerId: string): Promise<Array<Promotion>>;
    getQTDMetrics(filters: QTDFilters): Promise<QTDMetrics>;
    getRateAtDate(from: Currency, to: Currency, date: Timestamp): Promise<ExchangeRateSnapshot | null>;
    getRenewalReport(filters: ReportFilters): Promise<Array<Account>>;
    getRenewalsDue(daysAhead: bigint): Promise<Array<Account>>;
    getResellerTier(resellerId: string): Promise<TierAssignment | null>;
    getResellersForVendor(vendorId: string): Promise<Array<CompanyProfile>>;
    getSsoConfig(orgId: string): Promise<SSOConfig | null>;
    getTargetAssignments(measureId: TargetMeasureId | null, periodKey: string | null): Promise<Array<TargetAssignment>>;
    getTierConfigs(): Promise<Array<TierConfig>>;
    getTopUpHistory(orgId: string): Promise<Array<CreditTopUp>>;
    getUnlockRequests(orgId: string): Promise<Array<UnlockRequest>>;
    getUnreadNotificationCount(): Promise<bigint>;
    getUsageHistory(orgId: string): Promise<Array<UsageEvent>>;
    getUsageTrend(orgId: string): Promise<string>;
    getUserProfile(targetUserId: string): Promise<UserProfileDetail | null>;
    getUsersByCompany(companyId: string): Promise<Array<UserProfile>>;
    getVisibilityRulesForLayout(layoutId: string): Promise<Array<VisibilityRule__1>>;
    getVisibleNews(callerCompanyType: string, callerCompanyId: string): Promise<Array<NewsItem>>;
    grantForgeAIAlertsPermission(orgId: string, targetPrincipal: Principal): Promise<Result_3>;
    initUserAuthState(userId: string, companyId: string): Promise<void>;
    inviteUser(input: InviteUserInput): Promise<Result_25>;
    isCallerAdmin(): Promise<boolean>;
    isCustomerIdDuplicate(vendorId: string, customerId: string): Promise<boolean>;
    listCustomFieldDefs(objectType: CustomFieldObjectType): Promise<Array<CustomFieldDef>>;
    listDistributors(): Promise<Array<DistributorProfile>>;
    listDistributorsByVendor(vendorId: string): Promise<Array<DistributorProfile>>;
    listMarketingActivities(vendorId: string | null, resellerId: string | null, distributorId: string | null, activityType: MarketingActivityType | null, status: MarketingActivityStatus | null): Promise<Array<MarketingActivity>>;
    listMarketingActivitiesForCaller(vendorId: string | null, callerOrgId: string, callerRole: string, fieldDefId: string | null, fieldValue: string | null): Promise<Array<MarketingActivity>>;
    listMdfRequests(vendorId: string | null, requestorOrgId: string | null, status: MdfRequestStatus | null, budgetYear: bigint | null): Promise<Array<MdfRequest>>;
    listMdfRequestsForCaller(vendorId: string | null, callerOrgId: string, callerRole: string, fieldDefId: string | null, fieldValue: string | null): Promise<Array<MdfRequest>>;
    listMyConversations(): Promise<Array<Conversation>>;
    listOpportunities(vendorId: string | null, resellerId: string | null, distributorId: string | null, accountId: string | null, stage: OpportunityStage | null, activeOnly: boolean): Promise<Array<Opportunity>>;
    listOpportunitiesForCaller(vendorId: string | null, callerOrgId: string, callerRole: string, fieldDefId: string | null, fieldValue: string | null): Promise<Array<Opportunity>>;
    listVisibilityRules(orgId: string, activeOnly: boolean): Promise<Array<VisibilityRule>>;
    listWorkspaceProfiles(companyId: string): Promise<Array<UserProfileDetail>>;
    logAccountReassignment(accountId: string, entry: AccountReassignmentEntry): Promise<Result_3>;
    loginWithEmailPassword(email: string, password: string, companyType: CompanyType, companyId: string): Promise<Result_1>;
    logout(token: string): Promise<void>;
    mapCsvHeadersToCustomFields(objectType: CustomFieldObjectType, headers: Array<string>): Promise<Array<[string, string | null]>>;
    markAlertRead(id: string): Promise<Result_3>;
    markMdfRequestPaid(id: string): Promise<boolean>;
    markMessagesRead(conversationId: string, upToMessageId: string): Promise<Result_3>;
    markNotificationRead(id: string): Promise<Result_3>;
    reassignAccountReseller(accountId: string, newResellerId: string): Promise<Result_14>;
    recordMarketingActivityRoi(id: string, roi: bigint): Promise<boolean>;
    recordUsageEvent(event: UsageEvent): Promise<Result_24>;
    regenerateRecoveryCodes(sessionToken: string): Promise<Result>;
    registerCustomerId(vendorId: string, customerId: string, accountId: string): Promise<boolean>;
    removeAccountSite(accountId: string, siteId: string): Promise<Result_14>;
    removeDistributorFromAccount(accountId: string, distributorId: string): Promise<Result_14>;
    resetMfaForUser(userId: string): Promise<Result_2>;
    resetPasswordWithToken(tokenValue: string, newPassword: string, companyId: string): Promise<Result_2>;
    resolveUnlockRequest(requestId: string, approved: boolean): Promise<Result_3>;
    reviewDuplicateDR(id: string, action: DuplicateDRStatus, note: string): Promise<boolean>;
    revokeAllSessions(userId: string): Promise<void>;
    revokeForgeAIAlertsPermission(orgId: string, targetPrincipal: Principal): Promise<Result_3>;
    revokePasswordResetToken(tokenValue: string): Promise<Result_2>;
    runForgeAIAnalysis(): Promise<Result_23>;
    runNLQuery(naturalLanguageQuery: string): Promise<Result_22>;
    runSmartQuery(queryType: SmartQueryType, filter: SmartQueryFilter): Promise<Result_21>;
    saveAccountLayout(layout: AccountLayout): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveDashboardLayout(layout: DashboardLayout): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveFiscalYearConfig(input: FiscalYearConfigInput): Promise<Result_20>;
    saveTargetAssignment(input: TargetAssignmentInput): Promise<Result_19>;
    saveUserProfile(input: UserProfileInput): Promise<Result_18>;
    saveVisibilityRule(rule: VisibilityRule__1): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    searchCustomFieldValues(objectType: CustomFieldObjectType, fieldDefId: string, searchTerm: string): Promise<Array<string>>;
    searchMyMessages(searchQuery: string): Promise<Array<Message>>;
    sendMessageToConversation(conversationId: string, content: string, attachmentUrls: Array<string>): Promise<Result_17>;
    setCustomFieldValue(input: CustomFieldValueInput): Promise<CustomFieldValidationResult>;
    setPassword(newPassword: string, companyId: string): Promise<Result_2>;
    setupMfa(sessionToken: string): Promise<Result_16>;
    shareMaskAuthority(providerId: string, targetOrg: string): Promise<boolean>;
    storeExchangeRates(snapshots: Array<ExchangeRateSnapshot>): Promise<void>;
    submitUnlockRequest(ruleId: string, ruleName: string, requestingOrgId: string, requestingAdminName: string, targetOrgId: string, lockSource: LockSource, reason: string, targetAdminPrincipal: Principal): Promise<Result_15>;
    suspendDistributor(id: string): Promise<Result_10>;
    unlockUserAccount(userId: string, reason: string): Promise<Result_2>;
    updateAccount(id: string, input: AccountInput): Promise<Result_14>;
    updateAccountSite(accountId: string, site: AccountSite): Promise<Result_14>;
    updateAuthSettings(orgId: string, settings: AuthSettings): Promise<Result_2>;
    updateBusinessPlan(id: string, input: BusinessPlanInput): Promise<Result_13>;
    updateBusinessPlanActivity(planId: string, activityId: string, status: ActivityStatus): Promise<Result_13>;
    updateContact(id: string, input: ContactInput): Promise<Result_12>;
    updateCustomFieldDef(id: string, input: CustomFieldDefInput): Promise<CustomFieldDef | null>;
    updateDealRegistration(id: string, input: DealRegistrationInput): Promise<Result_11>;
    updateDealStatus(id: string, status: DealStatus): Promise<Result_11>;
    updateDistributor(id: string, input: DistributorInput): Promise<Result_10>;
    updateForexConfig(config: ForexConfig): Promise<boolean>;
    updateForgeAIAlertConfig(orgId: string, config: ForgeAIAlertConfig): Promise<Result_3>;
    updateForgeAISettings(settings: ForgeAISettings): Promise<Result_3>;
    updateGapNotificationConfig(cfg: GapNotificationConfig): Promise<Result_3>;
    updateLayoutPermissions(userId: string, perms: LayoutPermissions): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateMarketingActivity(id: string, input: MarketingActivityUpdateInput): Promise<MarketingActivity | null>;
    updateMeasureName(measureId: TargetMeasureId, newName: string): Promise<Result_9>;
    updateMyProfile(input: UserProfileDetailInput): Promise<Result_8>;
    updateNewsItem(id: string, input: NewsItemInput): Promise<Result_7>;
    updateNote(id: string, content: string): Promise<Result_6>;
    updateOpportunity(id: string, input: OpportunityUpdateInput): Promise<Opportunity | null>;
    updateOrgVisibilityConfig(orgId: string, input: OrgVisibilityConfigInput): Promise<OrgVisibilityConfig>;
    updatePriceList(id: string, input: PriceListInput): Promise<Result_5>;
    updatePromotion(id: string, input: PromotionInput): Promise<Result_4>;
    updateSecondaryAdminPermissions(userId: string, permissions: Array<string>): Promise<Result_3>;
    updateSsoConfig(orgId: string, config: SSOConfig): Promise<Result_2>;
    updateTierPermissions(tier: PartnerTier, permissions: Array<TierPermission>, maxSecondaryAdmins: bigint): Promise<boolean>;
    updateVisibilityRule(id: string, input: VisibilityRuleInput): Promise<VisibilityRule | null>;
    upsertCustomerIdFormatRule(vendorId: string, input: CustomerIdFormatRuleInput): Promise<CustomerIdFormatRule>;
    validateCustomFieldValues(inputs: Array<CustomFieldValueInput>): Promise<CustomFieldBulkValidationResult>;
    validateCustomerId(vendorId: string, customerId: string): Promise<CustomerIdValidationResult>;
    validateMfaToken(sessionToken: string, totpCode: string, companyId: string): Promise<Result_1>;
    validateSession(token: string): Promise<Result_1>;
    verifyMfaEnrollment(sessionToken: string, totpCode: string): Promise<Result>;
}
