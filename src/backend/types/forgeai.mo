// ForgeAI — Channel Operations Intelligence Engine types
import Common "common";
module {
  public type Timestamp = Common.Timestamp;

  // Risk classification tier
  public type RiskTier = {
    #Critical;
    #High;
    #Medium;
    #Low;
    #Healthy;
  };

  // A single contributing signal to a risk score
  public type RiskSignal = {
    signalType  : Text;
    description : Text;
    severity    : RiskTier;
    dataSource  : Text;
  };

  // Composite renewal risk score for one account
  public type RenewalRiskScore = {
    accountId        : Text;
    score            : Nat;
    tier             : RiskTier;
    signals          : [RiskSignal];
    recommendations  : [Text];
    lastAnalyzed     : Timestamp;
    confidence       : Nat;
  };

  // Alert raised when engagement inactivity exceeds configured thresholds
  public type EngagementGapAlert = {
    entityType           : Text;
    entityId             : Text;
    entityName           : Text;
    daysSinceEngagement  : Nat;
    threshold            : Nat;
    alertLevel           : RiskTier;
    description          : Text;
    detectedAt           : Timestamp;
  };

  // Assistive recommendation card produced by ForgeAI analysis
  public type ForgeAIRecommendation = {
    id                 : Text;
    recommendationType : Text;
    summary            : Text;
    riskLevel          : RiskTier;
    affectedEntityType : Text;
    affectedEntityId   : Text;
    affectedEntityName : Text;
    suggestedAction    : Text;
    timestamp          : Timestamp;
    confidence         : Nat;
    dismissed          : Bool;
  };

  // Immutable audit record for every ForgeAI analysis action
  public type ForgeAIAuditEntry = {
    id           : Text;
    analysisType : Text;
    entityId     : Text;
    entityName   : Text;
    riskLevel    : ?RiskTier;
    confidence   : ?Nat;
    triggeredBy  : Text;
    timestamp    : Timestamp;
    details      : Text;
  };

  // Per-severity recipient configuration for engagement gap notifications
  public type GapNotificationRecipientConfig = {
    accountOwner        : Bool;
    primaryAdmin        : Bool;
    assignedDistributor : Bool;
    assignedReseller    : Bool;
  };

  // Maps each relevant risk tier to its recipient config
  public type GapNotificationConfig = {
    critical : GapNotificationRecipientConfig;
    high     : GapNotificationRecipientConfig;
  };

  // Organization-level ForgeAI feature configuration (set by Primary Admin)
  public type ForgeAISettings = {
    enabled                             : Bool;
    renewalRiskEnabled                  : Bool;
    engagementGapEnabled                : Bool;
    smartQueriesEnabled                 : Bool;
    recommendationsEnabled              : Bool;
    messagingAssistEnabled              : Bool;
    resellerInactivityThresholdDays     : Nat;
    distributorInactivityThresholdDays  : Nat;
    warningThresholdDays                : Nat;
    escalationThresholdDays             : Nat;
    auditLogLevel                       : Text;
    gapNotificationConfig               : GapNotificationConfig;
  };

  // Pre-built smart query identifiers (Option A — curated operational intelligence)
  public type SmartQueryType = {
    #HighRiskRenewals;
    #RenewalsExpiringNextMonth;
    #PendingDRsOver14Days;
    #InactiveResellers;
    #AccountsNoEngagement;
    #TopPerformingDistributors;
    #ResellersBelowTarget;
    #CustomersNoActivePipeline;
    #ContractsMissingPlans;
    #StalledApprovals;
    #DecliningEngagement;
    #HighGrowthOpportunities;
  };

  // Filters applied to a smart query execution
  public type SmartQueryFilter = {
    region           : ?Text;
    product          : ?Text;
    distributorId    : ?Text;
    resellerId       : ?Text;
    accountManagerId : ?Text;
    renewalWindowDays: ?Nat;
    riskLevel        : ?Text;
    minContractValue : ?Nat;
    maxContractValue : ?Nat;
  };

  // Individual result item returned within a SmartQueryResult
  public type SmartQueryResultItem = {
    entityId           : Text;
    entityType         : Text;
    entityName         : Text;
    riskScore          : ?Nat;
    riskTier           : ?RiskTier;
    daysUntilRenewal   : ?Int;
    lastEngagementDays : ?Nat;
    resellerName       : ?Text;
    distributorName    : ?Text;
    details            : Text;
  };

  // Result of a natural-language query parse + execution
  public type NLQueryResult = {
    originalQuery          : Text;
    interpretedQueryType   : SmartQueryType;
    interpretedFilters     : SmartQueryFilter;
    interpretationExplanation : Text;
    confidenceLevel        : Text;
    queryResult            : SmartQueryResult;
  };

  // Immutable audit record for an NL query submission
  public type NLQueryAuditEntry = {
    id               : Text;
    originalQuery    : Text;
    interpretedType  : Text;
    confidenceLevel  : Text;
    filtersExtracted : Text;
    triggeredBy      : Text;
    timestamp        : Timestamp;
  };

  // Complete result set produced by executing a smart query
  public type SmartQueryResult = {
    queryType      : SmartQueryType;
    totalCount     : Nat;
    items          : [SmartQueryResultItem];
    generatedAt    : Timestamp;
    filtersApplied : SmartQueryFilter;
    summary        : Text;
    insights       : [Text];
  };
};
