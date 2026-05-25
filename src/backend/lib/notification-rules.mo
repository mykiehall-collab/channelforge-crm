// Notification rule locking, unlock requests, and ForgeAI alert config — domain logic
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/notification-rules";
import AlertTypes "../types/alerts";
import NotifLib "../lib/notifications";

module {
  public type State = {
    orgNotificationRules : Map.Map<Text, [Types.NotificationRule]>;
    unlockRequests       : Map.Map<Text, Types.UnlockRequest>;
    forgeAIAlertSettings : Map.Map<Text, Types.OrgForgeAIAlertSettings>;
    idCounter            : { var value : Nat };
  };

  public func initState() : State {
    {
      orgNotificationRules = Map.empty<Text, [Types.NotificationRule]>();
      unlockRequests       = Map.empty<Text, Types.UnlockRequest>();
      forgeAIAlertSettings = Map.empty<Text, Types.OrgForgeAIAlertSettings>();
      idCounter            = { var value = 0 };
    };
  };

  // Shared audit-log convenience type
  public type AuditEntry = AlertTypes.AuditEntry;

  // Shared AlertsState type for audit writing (mirrors lib/alerts.mo State)
  public type AlertsState = {
    alerts    : Map.Map<Text, AlertTypes.Alert>;
    news      : Map.Map<Text, AlertTypes.NewsItem>;
    auditLog  : List.List<AlertTypes.AuditEntry>;
    idCounter : { var value : Nat };
  };

  // ── Private helpers ─────────────────────────────────────────────────────────

  func lockSourceLabel(src : Types.LockSource) : Text {
    switch src {
      case (#Vendor)      { "Vendor" };
      case (#Distributor) { "Distributor" };
    };
  };

  func generateId(state : State, prefix : Text) : Text {
    state.idCounter.value += 1;
    prefix # "-" # Time.now().toText() # "-" # state.idCounter.value.toText();
  };

  func defaultRules() : [Types.NotificationRule] {
    [
      { ruleId = "renewalRiskAlerts";             displayName = "Renewal Risk Alerts";             currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "resellerEngagementGapAlerts";   displayName = "Reseller Engagement Gap Alerts";   currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "distributorEngagementGapAlerts"; displayName = "Distributor Engagement Gap Alerts"; currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "dealRegistrationWarnings";       displayName = "Deal Registration Warnings";       currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "stalledApprovalAlerts";          displayName = "Stalled Approval Alerts";          currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "accountRiskAlerts";              displayName = "Account Risk Alerts";              currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "businessPlanInactivityAlerts";   displayName = "Business Plan Inactivity Alerts";   currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "pipelineHealthAlerts";           displayName = "Pipeline Health Alerts";           currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "channelHealthScoreChanges";      displayName = "Channel Health Score Changes";      currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "messagingNotifications";         displayName = "Messaging Notifications";         currentValue = true; lockStatus = #Unlocked; isEditable = true },
      { ruleId = "securityAlerts";                 displayName = "MFA & Security Alerts";           currentValue = true; lockStatus = #Unlocked; isEditable = true },
    ];
  };

  func defaultForgeAIConfigs() : [Types.ForgeAIAlertConfig] {
    let allTypes : [Types.ForgeAIAlertType] = [
      #RenewalRisk, #ResellerEngagementGap, #DistributorEngagementGap,
      #DealRegistrationWarning, #StalledApproval, #AccountRisk,
      #BusinessPlanInactivity, #PipelineHealth, #ChannelHealthScoreChange,
    ];
    allTypes.map<Types.ForgeAIAlertType, Types.ForgeAIAlertConfig>(func(t) {
      {
        alertType               = t;
        enabled                 = true;
        primaryAdminRecipient   = true;
        secondaryAdminRecipient = false;
        endUsersRecipient       = false;
        deliveryMode            = #Both;
        frequency               = #Realtime;
        riskThreshold           = null;
        escalationRecipients    = [];
        lockStatus              = #Unlocked;
      };
    });
  };

  public func appendAudit(
    auditLog  : List.List<AlertTypes.AuditEntry>,
    idCounter : { var value : Nat },
    userId    : Text,
    action    : Text,
    entityType : Text,
    entityId  : Text,
    details   : Text,
  ) : () {
    idCounter.value += 1;
    auditLog.add({
      id        = "audit-" # idCounter.value.toText();
      userId;
      action;
      entityType;
      entityId;
      details;
      timestamp = Time.now();
    });
  };

  // ── Notification rules ──────────────────────────────────────────────────────

  public func getOrgNotificationRules(
    state : State,
    orgId : Text,
  ) : [Types.NotificationRule] {
    switch (state.orgNotificationRules.get(orgId)) {
      case (?rules) rules;
      case null     defaultRules();
    };
  };

  public func updateOrgNotificationRule(
    state  : State,
    orgId  : Text,
    rule   : Types.NotificationRule,
    caller : Principal,
  ) : CommonTypes.Result<(), Text> {
    let current = getOrgNotificationRules(state, orgId);
    let existing = current.find(func(r : Types.NotificationRule) : Bool { r.ruleId == rule.ruleId });
    switch existing {
      case null { return #err("Rule not found: " # rule.ruleId) };
      case (?r) {
        switch (r.lockStatus) {
          case (#LockedBy src) {
            return #err("Rule is locked by " # lockSourceLabel(src) # ". Submit an unlock request.");
          };
          case (#InheritedFrom src) {
            return #err("Rule is inherited from " # lockSourceLabel(src) # ". Submit an unlock request.");
          };
          case (#Unlocked) {};
        };
      };
    };
    ignore caller;
    let updated = current.map(func(r) {
      if (r.ruleId == rule.ruleId) {
        { rule with lockStatus = r.lockStatus; isEditable = r.isEditable };
      } else { r };
    });
    state.orgNotificationRules.add(orgId, updated);
    #ok(());
  };

  // ── Unlock requests ─────────────────────────────────────────────────────────

  public func submitUnlockRequest(
    state                : State,
    notifState           : NotifLib.State,
    ruleId               : Text,
    ruleName             : Text,
    requestingOrgId      : Text,
    requestingAdminId    : Principal,
    requestingAdminName  : Text,
    targetOrgId          : Text,
    lockSource           : Types.LockSource,
    reason               : Text,
    targetAdminPrincipal : Principal,
  ) : CommonTypes.Result<Types.UnlockRequest, Text> {
    if (reason.size() == 0) { return #err("Reason must not be empty") };
    let requestId = generateId(state, "unlreq");
    let req : Types.UnlockRequest = {
      requestId;
      ruleId;
      ruleName;
      requestingOrgId;
      requestingAdminId;
      requestingAdminName;
      targetOrgId;
      lockSource;
      reason;
      status     = #Pending;
      createdAt  = Time.now();
      resolvedAt = null;
      resolvedBy = null;
    };
    state.unlockRequests.add(requestId, req);
    ignore NotifLib.createNotification(
      notifState,
      targetAdminPrincipal,
      #UnlockRequested,
      "Unlock Request: " # ruleName,
      requestingAdminName # " from org " # requestingOrgId #
        " requests unlock of '" # ruleName # "'. Reason: " # reason,
      ?requestId,
      ?"unlock_request",
    );
    #ok(req);
  };

  public func getUnlockRequests(
    state : State,
    orgId : Text,
  ) : [Types.UnlockRequest] {
    state.unlockRequests.values()
      .filter(func(r : Types.UnlockRequest) : Bool {
        r.requestingOrgId == orgId or r.targetOrgId == orgId
      })
      .toArray();
  };

  public func resolveUnlockRequest(
    state     : State,
    requestId : Text,
    approved  : Bool,
    resolver  : Principal,
    auditLog  : List.List<AlertTypes.AuditEntry>,
    idCounter : { var value : Nat },
  ) : CommonTypes.Result<(), Text> {
    switch (state.unlockRequests.get(requestId)) {
      case null { #err("Unlock request not found: " # requestId) };
      case (?req) {
        switch (req.status) {
          case (#Pending) {};
          case _ { return #err("Request already resolved") };
        };
        let newStatus : Types.UnlockRequestStatus = if approved { #Approved } else { #Declined };
        state.unlockRequests.add(requestId, {
          req with
          status     = newStatus;
          resolvedAt = ?Time.now();
          resolvedBy = ?resolver;
        });
        if (approved) {
          let current = getOrgNotificationRules(state, req.requestingOrgId);
          let unlocked = current.map(func(r) {
            if (r.ruleId == req.ruleId) { { r with lockStatus = #Unlocked; isEditable = true } }
            else { r };
          });
          state.orgNotificationRules.add(req.requestingOrgId, unlocked);
        };
        appendAudit(
          auditLog, idCounter,
          resolver.toText(),
          if approved { "unlock_request_approved" } else { "unlock_request_declined" },
          "unlock_request",
          requestId,
          "Rule '" # req.ruleName # "' for org " # req.requestingOrgId #
            " was " # (if approved { "approved" } else { "declined" }) # " by " # resolver.toText(),
        );
        #ok(());
      };
    };
  };

  // ── ForgeAI alert config ────────────────────────────────────────────────────

  public func getOrgForgeAIAlertSettings(
    state : State,
    orgId : Text,
  ) : Types.OrgForgeAIAlertSettings {
    switch (state.forgeAIAlertSettings.get(orgId)) {
      case (?s) s;
      case null {
        {
          orgId;
          alertConfigs                          = defaultForgeAIConfigs();
          canManageForgeAIAlertsSecondaryAdmins = [];
        };
      };
    };
  };

  public func updateForgeAIAlertConfig(
    state     : State,
    orgId     : Text,
    config    : Types.ForgeAIAlertConfig,
    caller    : Principal,
    auditLog  : List.List<AlertTypes.AuditEntry>,
    idCounter : { var value : Nat },
  ) : CommonTypes.Result<(), Text> {
    let settings = getOrgForgeAIAlertSettings(state, orgId);
    let found = settings.alertConfigs.find(func(c : Types.ForgeAIAlertConfig) : Bool {
      c.alertType == config.alertType
    });
    let updatedConfigs = switch found {
      case null { settings.alertConfigs.concat([config]) };
      case _ {
        settings.alertConfigs.map(func(c) {
          if (c.alertType == config.alertType) { config } else { c };
        });
      };
    };
    state.forgeAIAlertSettings.add(orgId, { settings with alertConfigs = updatedConfigs });
    appendAudit(
      auditLog, idCounter,
      caller.toText(),
      "forgeai_alert_config_updated",
      "forgeai_alert",
      orgId,
      "ForgeAI alert config updated by " # caller.toText() # " for org " # orgId,
    );
    #ok(());
  };

  // ── Secondary admin ForgeAI permission ─────────────────────────────────────

  public func grantForgeAIAlertsPermission(
    state           : State,
    orgId           : Text,
    targetPrincipal : Principal,
    caller          : Principal,
    auditLog        : List.List<AlertTypes.AuditEntry>,
    idCounter       : { var value : Nat },
  ) : CommonTypes.Result<(), Text> {
    let settings  = getOrgForgeAIAlertSettings(state, orgId);
    let alreadyIn = settings.canManageForgeAIAlertsSecondaryAdmins
      .find(func(p : Principal) : Bool { Principal.equal(p, targetPrincipal) }) != null;
    if (alreadyIn) { return #err("Principal already has this permission") };
    let updated : [Principal] = settings.canManageForgeAIAlertsSecondaryAdmins.concat([targetPrincipal]);
    state.forgeAIAlertSettings.add(orgId, { settings with canManageForgeAIAlertsSecondaryAdmins = updated });
    appendAudit(
      auditLog, idCounter,
      caller.toText(),
      "forgeai_permission_granted",
      "forgeai_permission",
      orgId,
      "canManageForgeAIAlerts granted to " # targetPrincipal.toText() # " by " # caller.toText(),
    );
    #ok(());
  };

  public func revokeForgeAIAlertsPermission(
    state           : State,
    orgId           : Text,
    targetPrincipal : Principal,
    caller          : Principal,
    auditLog        : List.List<AlertTypes.AuditEntry>,
    idCounter       : { var value : Nat },
  ) : CommonTypes.Result<(), Text> {
    let settings = getOrgForgeAIAlertSettings(state, orgId);
    let updated  : [Principal] = settings.canManageForgeAIAlertsSecondaryAdmins
      .filter(func(p : Principal) : Bool { not Principal.equal(p, targetPrincipal) });
    state.forgeAIAlertSettings.add(orgId, { settings with canManageForgeAIAlertsSecondaryAdmins = updated });
    appendAudit(
      auditLog, idCounter,
      caller.toText(),
      "forgeai_permission_revoked",
      "forgeai_permission",
      orgId,
      "canManageForgeAIAlerts revoked from " # targetPrincipal.toText() # " by " # caller.toText(),
    );
    #ok(());
  };
};
