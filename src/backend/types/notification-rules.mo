// Notification rule locking, unlock requests, and ForgeAI alert config types for CHANNELFORGE CRM
import CommonTypes "common";
import CompanyTypes "company";

module {
  // ── Lock hierarchy ──────────────────────────────────────────────────────────

  /// Which tier in the hierarchy imposed the lock.
  public type LockSource = { #Vendor; #Distributor };

  /// Whether a rule is freely editable, locked in place, or inherited (visible but not editable).
  public type LockStatus = {
    #Unlocked;
    #LockedBy    : LockSource;
    #InheritedFrom : LockSource;
  };

  // ── Notification rules ──────────────────────────────────────────────────────

  /// Stable string identifier for a notification rule, e.g. "renewalRiskAlerts".
  public type NotificationRuleId = Text;

  /// A single configurable notification rule with its current lock state.
  public type NotificationRule = {
    ruleId       : NotificationRuleId;
    displayName  : Text;
    currentValue : Bool;   // the currently enforced value
    lockStatus   : LockStatus;
    isEditable   : Bool;   // false when locked or inherited from a higher org
  };

  /// The full set of notification rules for one organisation.
  public type OrgNotificationRules = {
    orgId       : Text;
    companyType : CompanyTypes.CompanyType;
    rules       : [NotificationRule];
  };

  // ── Unlock requests ─────────────────────────────────────────────────────────

  public type UnlockRequestStatus = { #Pending; #Approved; #Declined };

  public type UnlockRequest = {
    requestId            : Text;
    ruleId               : NotificationRuleId;
    ruleName             : Text;
    requestingOrgId      : Text;
    requestingAdminId    : Principal;
    requestingAdminName  : Text;
    targetOrgId          : Text;      // the org that enforced the lock
    lockSource           : LockSource;
    reason               : Text;
    status               : UnlockRequestStatus;
    createdAt            : CommonTypes.Timestamp; // nanoseconds
    resolvedAt           : ?CommonTypes.Timestamp;
    resolvedBy           : ?Principal;
  };

  // ── ForgeAI alert config ────────────────────────────────────────────────────

  public type ForgeAIAlertType = {
    #RenewalRisk;
    #ResellerEngagementGap;
    #DistributorEngagementGap;
    #DealRegistrationWarning;
    #StalledApproval;
    #AccountRisk;
    #BusinessPlanInactivity;
    #PipelineHealth;
    #ChannelHealthScoreChange;
  };

  public type AlertDeliveryMode = { #DashboardOnly; #MessageOnly; #Both };

  public type AlertFrequency = { #Realtime; #Hourly; #Daily; #Weekly };

  /// Per-alert-type delivery and recipient configuration for one organisation.
  public type ForgeAIAlertConfig = {
    alertType             : ForgeAIAlertType;
    enabled               : Bool;
    primaryAdminRecipient : Bool;
    secondaryAdminRecipient : Bool; // requires canManageForgeAIAlerts permission
    endUsersRecipient     : Bool;
    deliveryMode          : AlertDeliveryMode;
    frequency             : AlertFrequency;
    riskThreshold         : ?Nat;    // 0-100; null = use platform default
    escalationRecipients  : [Text];  // Principal text IDs
    lockStatus            : LockStatus;
  };

  /// Full ForgeAI alert settings for one organisation, including who has the
  /// secondary-admin permission to manage alert delivery.
  public type OrgForgeAIAlertSettings = {
    orgId                                     : Text;
    alertConfigs                              : [ForgeAIAlertConfig];
    canManageForgeAIAlertsSecondaryAdmins     : [Principal];
  };
};
