import Principal "mo:core/Principal";
import Time "mo:core/Time";
import ForgeAILib "../lib/forgeai";
import AccountsLib "../lib/accounts";
import DealsLib "../lib/deals";
import MessagingLib "../lib/messaging";
import PlansLib "../lib/plans";
import NotificationsLib "../lib/notifications";
import CompanyLib "../lib/company";
import CommonTypes "../types/common";
import Types "../types/forgeai";
import NLQueryLib "../lib/nl-query";

mixin (
  forgeaiState      : ForgeAILib.State,
  accountsState     : AccountsLib.State,
  dealsState        : DealsLib.State,
  messagingState    : MessagingLib.State,
  plansState        : PlansLib.State,
  notificationsState: NotificationsLib.State,
  companyState      : CompanyLib.State,
) {

  // ── Settings ──────────────────────────────────────────────────────────────

  public query func getForgeAISettings() : async Types.ForgeAISettings {
    ForgeAILib.getSettings(forgeaiState);
  };

  public shared ({ caller }) func updateForgeAISettings(
    settings : Types.ForgeAISettings
  ) : async CommonTypes.Result<(), Text> {
    let callerId = caller.toText();
    ForgeAILib.updateSettings(forgeaiState, settings);
    let now = Time.now();
    forgeaiState.idCounter.value += 1;
    let entryId = "forgeai-audit-" # forgeaiState.idCounter.value.toText();
    ForgeAILib.logAuditEntry(forgeaiState, {
      id           = entryId;
      analysisType = "SettingsUpdate";
      entityId     = callerId;
      entityName   = "ForgeAISettings";
      riskLevel    = null;
      confidence   = null;
      triggeredBy  = callerId;
      timestamp    = now;
      details      = "ForgeAI settings updated by admin";
    });
    #ok(());
  };

  // ── Recommendations ───────────────────────────────────────────────────────

  public query func getForgeAIRecommendations() : async [Types.ForgeAIRecommendation] {
    ForgeAILib.getRecommendations(forgeaiState);
  };

  public shared ({ caller }) func dismissForgeAIRecommendation(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    let result = ForgeAILib.dismissRecommendation(forgeaiState, id);
    switch (result) {
      case (#ok(())) {
        let callerId = caller.toText();
        forgeaiState.idCounter.value += 1;
        let entryId = "forgeai-audit-" # forgeaiState.idCounter.value.toText();
        ForgeAILib.logAuditEntry(forgeaiState, {
          id           = entryId;
          analysisType = "RecommendationDismissed";
          entityId     = id;
          entityName   = "ForgeAIRecommendation";
          riskLevel    = null;
          confidence   = null;
          triggeredBy  = callerId;
          timestamp    = Time.now();
          details      = "Recommendation dismissed by user";
        });
      };
      case (#err(_)) {};
    };
    result;
  };

  // ── Full analysis ─────────────────────────────────────────────────────────

  public shared ({ caller }) func runForgeAIAnalysis() : async CommonTypes.Result<{
    riskScores      : [Types.RenewalRiskScore];
    gapAlerts       : [Types.EngagementGapAlert];
    recommendations : [Types.ForgeAIRecommendation];
  }, Text> {
    let settings = ForgeAILib.getSettings(forgeaiState);
    if (not settings.enabled) {
      return #err("ForgeAI is disabled by organization settings");
    };

    let accounts  = AccountsLib.getAllAccounts(accountsState);
    let deals     = DealsLib.getAllDealRegistrations(dealsState);
    let messages  = MessagingLib.getAllConversations(messagingState);
    let plans     = PlansLib.getAllBusinessPlans(plansState);

    let riskScores = if (settings.renewalRiskEnabled) {
      ForgeAILib.computeRenewalRiskScore(accounts, deals, messages, plans, settings);
    } else { [] };

    let gapAlerts = if (settings.engagementGapEnabled) {
      ForgeAILib.detectEngagementGaps(accounts, messages, settings);
    } else { [] };

    let recs = if (settings.recommendationsEnabled) {
      ForgeAILib.generateRecommendations(forgeaiState, riskScores, gapAlerts);
    } else { [] };
    ForgeAILib.storeRecommendations(forgeaiState, recs);

    // Trigger engagement gap notifications for Critical/High alerts
    let notifCount = if (settings.engagementGapEnabled) {
      ForgeAILib.triggerEngagementGapNotifications(
        forgeaiState,
        notificationsState,
        gapAlerts,
        accounts,
        companyState.userProfiles,
      );
    } else { 0 };

    // Audit entry
    let callerId = caller.toText();
    forgeaiState.idCounter.value += 1;
    let entryId = "forgeai-audit-" # forgeaiState.idCounter.value.toText();
    ForgeAILib.logAuditEntry(forgeaiState, {
      id           = entryId;
      analysisType = "FullAnalysis";
      entityId     = "system";
      entityName   = "ForgeAIAnalysis";
      riskLevel    = null;
      confidence   = null;
      triggeredBy  = callerId;
      timestamp    = Time.now();
      details      = "Full ForgeAI analysis: " # riskScores.size().toText() # " risk scores, " #
                     gapAlerts.size().toText() # " gap alerts, " # recs.size().toText() # " recommendations, " #
                     notifCount.toText() # " gap notifications sent";
    });

    #ok({ riskScores; gapAlerts; recommendations = recs });
  };

  // ── Smart queries ─────────────────────────────────────────────────────────

  public query ({ caller }) func runSmartQuery(
    queryType : Types.SmartQueryType,
    filter    : Types.SmartQueryFilter,
  ) : async CommonTypes.Result<Types.SmartQueryResult, Text> {
    let settings = ForgeAILib.getSettings(forgeaiState);
    if (not settings.enabled or not settings.smartQueriesEnabled) {
      return #err("ForgeAI smart queries are disabled");
    };

    let accounts  = AccountsLib.getAllAccounts(accountsState);
    let deals     = DealsLib.getAllDealRegistrations(dealsState);
    let messages  = MessagingLib.getAllConversations(messagingState);
    let plans     = PlansLib.getAllBusinessPlans(plansState);
    let riskScores = ForgeAILib.computeRenewalRiskScore(accounts, deals, messages, plans, settings);

    let result = ForgeAILib.runSmartQuery(
      queryType, filter, accounts, deals, messages, plans, riskScores,
    );
    #ok(result);
  };

  // ── Gap notification config ─────────────────────────────────────────────────

  public query func getGapNotificationConfig() : async Types.GapNotificationConfig {
    ForgeAILib.getGapNotificationConfig(forgeaiState);
  };

  public shared ({ caller }) func updateGapNotificationConfig(
    cfg : Types.GapNotificationConfig
  ) : async CommonTypes.Result<(), Text> {
    let callerId = caller.toText();
    ForgeAILib.updateGapNotificationConfig(forgeaiState, cfg);
    forgeaiState.idCounter.value += 1;
    let entryId = "forgeai-audit-" # forgeaiState.idCounter.value.toText();
    ForgeAILib.logAuditEntry(forgeaiState, {
      id           = entryId;
      analysisType = "EngagementGapNotification";
      entityId     = "GapNotificationConfig";
      entityName   = "GapNotificationConfig";
      riskLevel    = null;
      confidence   = null;
      triggeredBy  = callerId;
      timestamp    = Time.now();
      details      = "Gap notification recipient config updated by admin";
    });
    #ok(());
  };

  // ── Natural language query ───────────────────────────────────────────────

  public shared ({ caller }) func runNLQuery(
    naturalLanguageQuery : Text
  ) : async CommonTypes.Result<Types.NLQueryResult, Text> {
    let settings = ForgeAILib.getSettings(forgeaiState);
    if (not settings.enabled or not settings.smartQueriesEnabled) {
      return #err("ForgeAI smart queries are disabled");
    };

    // 1. Parse
    let parsed = NLQueryLib.parse(naturalLanguageQuery);

    // 2. Execute underlying smart query with parsed type + filters
    let accounts   = AccountsLib.getAllAccounts(accountsState);
    let deals      = DealsLib.getAllDealRegistrations(dealsState);
    let messages   = MessagingLib.getAllConversations(messagingState);
    let plans      = PlansLib.getAllBusinessPlans(plansState);
    let riskScores = ForgeAILib.computeRenewalRiskScore(accounts, deals, messages, plans, settings);
    let queryResult = ForgeAILib.runSmartQuery(
      parsed.queryType, parsed.filter, accounts, deals, messages, plans, riskScores,
    );

    // 3. Audit log
    let callerId = caller.toText();
    forgeaiState.idCounter.value += 1;
    let entryId = "forgeai-audit-" # forgeaiState.idCounter.value.toText();
    ForgeAILib.logAuditEntry(forgeaiState, {
      id           = entryId;
      analysisType = "NLQuery";
      entityId     = "nl-query";
      entityName   = naturalLanguageQuery;
      riskLevel    = null;
      confidence   = null;
      triggeredBy  = callerId;
      timestamp    = Time.now();
      details      = "NL query parsed as: " # parsed.explanation # " Confidence: " # parsed.confidence;
    });

    #ok({
      originalQuery             = naturalLanguageQuery;
      interpretedQueryType      = parsed.queryType;
      interpretedFilters        = parsed.filter;
      interpretationExplanation = parsed.explanation;
      confidenceLevel           = parsed.confidence;
      queryResult;
    });
  };

  // ── Audit log ─────────────────────────────────────────────────────────────

  public query func getForgeAIAuditLog(
    limit : Nat
  ) : async [Types.ForgeAIAuditEntry] {
    ForgeAILib.getAuditLog(forgeaiState, limit);
  };
};
