import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/forgeai";
import NotificationTypes "../types/notifications";
import CompanyTypes "../types/company";
import AccountTypes "../types/accounts";
import DealTypes "../types/deals";
import MessagingTypes "../types/messaging";
import PlanTypes "../types/plans";
import Text "mo:core/Text";

module {
  // Nanoseconds per day
  let NS_PER_DAY : Int = 86_400_000_000_000;

  public type State = {
    settings        : { var value : Types.ForgeAISettings };
    recommendations : List.List<Types.ForgeAIRecommendation>;
    auditLog        : List.List<Types.ForgeAIAuditEntry>;
    idCounter       : { var value : Nat };
    // Deduplication: key = accountId # "|" # entityId # "|" # severity
    gapNotifSentAt  : Map.Map<Text, Int>;
  };

  public func initState() : State {
    {
      settings = { var value = defaultSettings() };
      recommendations = List.empty<Types.ForgeAIRecommendation>();
      auditLog        = List.empty<Types.ForgeAIAuditEntry>();
      idCounter       = { var value = 0 };
      gapNotifSentAt  = Map.empty<Text, Int>();
    };
  };

  public func defaultSettings() : Types.ForgeAISettings {
    {
      enabled                            = true;
      renewalRiskEnabled                 = true;
      engagementGapEnabled               = true;
      smartQueriesEnabled                = true;
      recommendationsEnabled             = true;
      messagingAssistEnabled             = true;
      resellerInactivityThresholdDays    = 45;
      distributorInactivityThresholdDays = 30;
      warningThresholdDays               = 14;
      escalationThresholdDays            = 30;
      auditLogLevel                      = "Full";
      gapNotificationConfig              = {
        critical = { accountOwner = true; primaryAdmin = true;  assignedDistributor = false; assignedReseller = false };
        high     = { accountOwner = true; primaryAdmin = false; assignedDistributor = false; assignedReseller = false };
      };
    };
  };

  // ── Settings ──────────────────────────────────────────────────────────────

  public func getSettings(state : State) : Types.ForgeAISettings {
    state.settings.value;
  };

  public func updateSettings(state : State, settings : Types.ForgeAISettings) {
    state.settings.value := settings;
  };

  // ── Audit log ─────────────────────────────────────────────────────────────

  public func logAuditEntry(state : State, entry : Types.ForgeAIAuditEntry) {
    state.auditLog.add(entry);
  };

  public func getAuditLog(state : State, limit : Nat) : [Types.ForgeAIAuditEntry] {
    state.auditLog.reverseValues().take(limit).toArray();
  };

  // ── Recommendations ───────────────────────────────────────────────────────

  public func getRecommendations(state : State) : [Types.ForgeAIRecommendation] {
    state.recommendations.values().filter(func(r) { not r.dismissed }).toArray();
  };

  public func storeRecommendations(
    state : State,
    recs  : [Types.ForgeAIRecommendation],
  ) {
    for (r in recs.values()) {
      // Replace existing entry with same id, or add new
      let existing = state.recommendations.findIndex(func(x) { x.id == r.id });
      switch (existing) {
        case (?idx) { state.recommendations.put(idx, r) };
        case null   { state.recommendations.add(r) };
      };
    };
  };

  public func dismissRecommendation(
    state : State,
    id    : Text,
  ) : CommonTypes.Result<(), Text> {
    let idx = state.recommendations.findIndex(func(r) { r.id == id });
    switch (idx) {
      case null { #err("Recommendation not found") };
      case (?i) {
        let existing = state.recommendations.at(i);
        state.recommendations.put(i, { existing with dismissed = true });
        #ok(());
      };
    };
  };

  // ── Risk scoring ──────────────────────────────────────────────────────────

  public func computeRenewalRiskScore(
    accounts  : [AccountTypes.Account],
    deals     : [DealTypes.DealRegistration],
    messages  : [MessagingTypes.Conversation],
    plans     : [PlanTypes.BusinessPlan],
    settings  : Types.ForgeAISettings,
  ) : [Types.RenewalRiskScore] {
    let now = Time.now();
    let resellerThresholdNs  = settings.resellerInactivityThresholdDays.toInt()  * NS_PER_DAY;
    let distributorThresholdNs = settings.distributorInactivityThresholdDays.toInt() * NS_PER_DAY;
    let thirtyDayNs = 30 * NS_PER_DAY;

    accounts.map<AccountTypes.Account, Types.RenewalRiskScore>(func(acc) {
      var score = 0;
      let signals = List.empty<Types.RiskSignal>();

      // 1. Renewal within 30 days with no active deal (+25)
      let daysUntilRenewal = (acc.renewalDate - now) / NS_PER_DAY;
      let activeDeal = deals.find(func(d) {
        d.accountId == acc.id and
        (switch (d.status) { case (#Submitted or #UnderReview or #Approved) true; case _ false })
      });
      if (acc.renewalDate > now and acc.renewalDate <= now + thirtyDayNs and activeDeal == null) {
        score += 25;
        signals.add({
          signalType  = "RenewalNoActiveDeal";
          description = "Renewal within 30 days with no active deal registration";
          severity    = #High;
          dataSource  = "AccountDetails+DealRegistrations";
        });
      };

      // 2. Reseller engagement gap (+20)
      let lastResellerMsg = messages.find(func(c) {
        switch (c.relatedEntityId) {
          case (?eid) { eid == acc.id };
          case null   { false };
        };
      });
      let resellerGap = switch (lastResellerMsg) {
        case null     { true };
        case (?conv)  { now - conv.lastMessageAt > resellerThresholdNs };
      };
      if (resellerGap) {
        score += 20;
        signals.add({
          signalType  = "ResellerEngagementGap";
          description = "No reseller engagement detected in " # settings.resellerInactivityThresholdDays.toText() # " days";
          severity    = #Medium;
          dataSource  = "MessageHistory";
        });
      };

      // 3. Distributor engagement gap (+15)
      let distIds = acc.distributorIds;
      let distMsgFound = messages.any(func(c) {
        switch (c.relatedEntityId) {
          case (?eid) { eid == acc.id };
          case null   { false };
        }
      });
      let distributorGap = not distMsgFound or (switch (lastResellerMsg) {
        case null     { true };
        case (?conv)  { now - conv.lastMessageAt > distributorThresholdNs };
      });
      if (distributorGap and distIds.size() > 0) {
        score += 15;
        signals.add({
          signalType  = "DistributorEngagementGap";
          description = "No distributor engagement detected in " # settings.distributorInactivityThresholdDays.toText() # " days";
          severity    = #Medium;
          dataSource  = "MessageHistory";
        });
      };

      // 4. Missed business plan milestones (+15)
      let planMissed = plans.find(func(p) {
        p.partnerId == acc.resellerOwnerId and
        p.activities.find(func(a) {
          switch (a.status) { case (#Overdue) true; case _ false }
        }) != null
      });
      if (planMissed != null) {
        score += 15;
        signals.add({
          signalType  = "MissedMilestones";
          description = "Business plan has overdue activities or missed milestones";
          severity    = #Medium;
          dataSource  = "BusinessPlans";
        });
      };

      // 5. Stalled deal registrations (+10)
      let stalledDeal = deals.find(func(d) {
        d.accountId == acc.id and
        (switch (d.status) { case (#Draft or #UnderReview) true; case _ false }) and
        (d.updatedAt < now - 14 * NS_PER_DAY)
      });
      if (stalledDeal != null) {
        score += 10;
        signals.add({
          signalType  = "StalledDealRegistration";
          description = "Deal registration stalled with no progress in 14+ days";
          severity    = #Low;
          dataSource  = "DealRegistrations";
        });
      };

      // 6. Duplicate deal registrations (+10)
      let accountDeals = deals.filter(func(d) { d.accountId == acc.id });
      if (accountDeals.size() > 1) {
        let products = accountDeals.map(func(d) { d.product });
        let hasDup = products.find(func(p) {
          products.filter(func(q) { q == p }).size() > 1
        }) != null;
        if (hasDup) {
          score += 10;
          signals.add({
            signalType  = "DuplicateDealRegistration";
            description = "Duplicate deal registrations detected for this account";
            severity    = #Low;
            dataSource  = "DealRegistrations";
          });
        };
      };

      // Cap score at 100
      if (score > 100) { score := 100 };

      let tier : Types.RiskTier = if      (score >= 75) { #Critical }
                                  else if (score >= 60) { #High }
                                  else if (score >= 45) { #Medium }
                                  else if (score >= 30) { #Low }
                                  else                  { #Healthy };

      let recs = List.empty<Text>();
      if (score >= 60) {
        recs.add("Initiate urgent outreach to reseller and confirm renewal strategy");
      };
      if (resellerGap) {
        recs.add("Contact reseller to re-establish engagement on this account");
      };
      if (activeDeal == null and acc.renewalDate > now and acc.renewalDate <= now + thirtyDayNs) {
        recs.add("Register a deal for the upcoming renewal immediately");
      };

      {
        accountId       = acc.id;
        score;
        tier;
        signals         = signals.toArray();
        recommendations = recs.toArray();
        lastAnalyzed    = now;
        confidence      = if (signals.size() == 0) { 95 } else { 80 };
      };
    });
  };

  // ── Engagement gap detection ───────────────────────────────────────────────

  public func detectEngagementGaps(
    accounts  : [AccountTypes.Account],
    messages  : [MessagingTypes.Conversation],
    settings  : Types.ForgeAISettings,
  ) : [Types.EngagementGapAlert] {
    let now = Time.now();
    let resellerThresholdNs    = settings.resellerInactivityThresholdDays.toInt()    * NS_PER_DAY;
    let distributorThresholdNs = settings.distributorInactivityThresholdDays.toInt() * NS_PER_DAY;
    let alerts = List.empty<Types.EngagementGapAlert>();

    for (acc in accounts.values()) {
      // Find last conversation related to this account
      let accountConvs = messages.filter(func(c) {
        switch (c.relatedEntityId) {
          case (?eid) { eid == acc.id };
          case null   { false };
        };
      });
      let lastMsgTime = accountConvs.foldLeft<MessagingTypes.Conversation, Int>(0, func(best, c) {
        if (c.lastMessageAt > best) { c.lastMessageAt } else { best }
      });

      // Reseller gap
      let resellerGapDays = if (lastMsgTime == 0) {
        settings.resellerInactivityThresholdDays + 1
      } else {
        let diff = now - lastMsgTime;
        if (diff > 0) { (diff / NS_PER_DAY).toNat() } else { 0 };
      };
      if (resellerGapDays >= settings.resellerInactivityThresholdDays) {
        let level : Types.RiskTier =
          if      (resellerGapDays.toInt() >= settings.escalationThresholdDays.toInt() * 2) { #Critical }
          else if (resellerGapDays.toInt() >= settings.escalationThresholdDays.toInt())     { #High }
          else                                                                               { #Medium };
        alerts.add({
          entityType           = "Reseller";
          entityId             = acc.resellerOwnerId;
          entityName           = acc.accountName;
          daysSinceEngagement  = resellerGapDays;
          threshold            = settings.resellerInactivityThresholdDays;
          alertLevel           = level;
          description          = "No reseller engagement detected in " # resellerGapDays.toText() # " days";
          detectedAt           = now;
        });
      };

      // Distributor gap — check each associated distributor
      for (distId in acc.distributorIds.values()) {
        let distGapDays = resellerGapDays; // same conversation source per account
        if (distGapDays >= settings.distributorInactivityThresholdDays) {
          let level : Types.RiskTier =
            if      (distGapDays.toInt() >= settings.escalationThresholdDays.toInt() * 2) { #Critical }
            else if (distGapDays.toInt() >= settings.escalationThresholdDays.toInt())     { #High }
            else                                                                           { #Medium };
          alerts.add({
            entityType           = "Distributor";
            entityId             = distId;
            entityName           = acc.accountName;
            daysSinceEngagement  = distGapDays;
            threshold            = settings.distributorInactivityThresholdDays;
            alertLevel           = level;
            description          = "No distributor activity recorded in " # distGapDays.toText() # " days";
            detectedAt           = now;
          });
        };
      };
    };

    alerts.toArray();
  };

  // ── Recommendation generation ──────────────────────────────────────────────

  public func generateRecommendations(
    state      : State,
    riskScores : [Types.RenewalRiskScore],
    gapAlerts  : [Types.EngagementGapAlert],
  ) : [Types.ForgeAIRecommendation] {
    let now = Time.now();
    let recs = List.empty<Types.ForgeAIRecommendation>();

    for (rs in riskScores.values()) {
      let priority = switch (rs.tier) {
        case (#Critical or #High) { true };
        case _ { false };
      };
      if (priority) {
        state.idCounter.value += 1;
        let id = "forgeai-rec-" # state.idCounter.value.toText();
        let action = switch (rs.tier) {
          case (#Critical) { "Escalate immediately — contact reseller, vendor owner, and distributor. Review renewal strategy and pricing." };
          case (#High)     { "Initiate reseller outreach within 48 hours. Confirm deal registration and renewal readiness." };
          case _           { "Schedule reseller check-in and review account health." };
        };
        recs.add({
          id;
          recommendationType  = "RenewalRisk";
          summary             = "Renewal risk " # tierText(rs.tier) # " for account " # rs.accountId;
          riskLevel           = rs.tier;
          affectedEntityType  = "Account";
          affectedEntityId    = rs.accountId;
          affectedEntityName  = rs.accountId;
          suggestedAction     = action;
          timestamp           = now;
          confidence          = rs.confidence;
          dismissed           = false;
        });
      };
    };

    for (gap in gapAlerts.values()) {
      let priority = switch (gap.alertLevel) {
        case (#Critical or #High) { true };
        case _ { false };
      };
      if (priority) {
        state.idCounter.value += 1;
        let id = "forgeai-rec-" # state.idCounter.value.toText();
        recs.add({
          id;
          recommendationType  = "EngagementGap";
          summary             = gap.description;
          riskLevel           = gap.alertLevel;
          affectedEntityType  = gap.entityType;
          affectedEntityId    = gap.entityId;
          affectedEntityName  = gap.entityName;
          suggestedAction     = "Re-establish contact with " # gap.entityType # " to prevent renewal risk escalation";
          timestamp           = now;
          confidence          = 85;
          dismissed           = false;
        });
      };
    };

    recs.toArray();
  };

  // ── Smart queries ─────────────────────────────────────────────────────────

  public func runSmartQuery(
    queryType  : Types.SmartQueryType,
    filter     : Types.SmartQueryFilter,
    accounts   : [AccountTypes.Account],
    deals      : [DealTypes.DealRegistration],
    messages   : [MessagingTypes.Conversation],
    plans      : [PlanTypes.BusinessPlan],
    riskScores : [Types.RenewalRiskScore],
  ) : Types.SmartQueryResult {
    let now = Time.now();
    let items = List.empty<Types.SmartQueryResultItem>();
    let insights = List.empty<Text>();
    var summary = "";

    // Helper: apply common filters to an account
    func passesAccountFilter(acc : AccountTypes.Account) : Bool {
      let regionOk = switch (filter.region) {
        case null { true };
        case (?r) {
          acc.sites.find(func(s) { s.region == r }) != null
        };
      };
      let productOk = switch (filter.product) {
        case null { true };
        case (?p) { acc.productList.contains(p) };
      };
      let resellerOk = switch (filter.resellerId) {
        case null   { true };
        case (?rid) { acc.resellerOwnerId == rid };
      };
      let distOk = switch (filter.distributorId) {
        case null   { true };
        case (?did) { acc.distributorIds.contains(did) };
      };
      let valueOk = switch (filter.minContractValue) {
        case null { true };
        case (?minV) {
          let v = acc.estimatedRenewalValue;
          v >= minV.toFloat();
        };
      };
      regionOk and productOk and resellerOk and distOk and valueOk;
    };

    // Helper: find risk score for account
    func riskFor(accountId : Text) : ?Types.RenewalRiskScore {
      riskScores.find(func(rs) { rs.accountId == accountId })
    };

    // Helper: days until renewal
    func daysUntil(renewalDate : Int) : Int {
      (renewalDate - now) / NS_PER_DAY;
    };

    switch (queryType) {
      case (#HighRiskRenewals) {
        summary := "Accounts with high or critical renewal risk scores";
        for (acc in accounts.values()) {
          if (passesAccountFilter(acc)) {
            switch (riskFor(acc.id)) {
              case (?rs) {
                let isHighRisk = switch (rs.tier) {
                  case (#Critical or #High) { true }; case _ { false }
                };
                let riskLevelFilter = switch (filter.riskLevel) {
                  case null    { true };
                  case (?rl)   { tierText(rs.tier) == rl };
                };
                if (isHighRisk and riskLevelFilter) {
                  items.add(makeItem(acc, ?rs, now));
                };
              };
              case null {};
            };
          };
        };
        insights.add("High-risk accounts require immediate reseller engagement");
      };

      case (#RenewalsExpiringNextMonth) {
        let windowDays = switch (filter.renewalWindowDays) { case (?d) d; case null 30 };
        let windowNs = windowDays.toInt() * NS_PER_DAY;
        summary := "Renewals expiring within " # windowDays.toText() # " days";
        for (acc in accounts.values()) {
          if (passesAccountFilter(acc) and acc.renewalDate > now and acc.renewalDate <= now + windowNs) {
            items.add(makeItem(acc, riskFor(acc.id), now));
          };
        };
        insights.add("Prioritize deal registrations for all expiring renewals");
      };

      case (#PendingDRsOver14Days) {
        summary := "Deal registrations pending approval for over 14 days";
        let cutoff = now - 14 * NS_PER_DAY;
        for (d in deals.values()) {
          let isPending = switch (d.status) { case (#Submitted or #UnderReview) true; case _ false };
          if (isPending and d.createdAt < cutoff) {
            let accOpt = accounts.find(func(a) { a.id == d.accountId });
            switch (accOpt) {
              case (?acc) {
                if (passesAccountFilter(acc)) {
                  items.add(makeItem(acc, riskFor(acc.id), now));
                };
              };
              case null {};
            };
          };
        };
        insights.add("Escalate stalled approvals to reduce pipeline delays");
      };

      case (#InactiveResellers) {
        summary := "Resellers with no recent engagement activity";
        let resellerSeen = List.empty<Text>();
        for (acc in accounts.values()) {
          if (not resellerSeen.contains(acc.resellerOwnerId)) {
            resellerSeen.add(acc.resellerOwnerId);
            let accountConvs = messages.filter(func(c) {
              switch (c.relatedEntityId) { case (?eid) { eid == acc.id }; case null false }
            });
            let lastMsg = accountConvs.foldLeft<MessagingTypes.Conversation, Int>(0, func(best, c) {
              if (c.lastMessageAt > best) c.lastMessageAt else best
            });
            let gapDays = if (lastMsg == 0) { 999 } else {
              let diff = now - lastMsg;
              if (diff > 0) (diff / NS_PER_DAY).toNat() else 0
            };
            if (gapDays >= 30 and passesAccountFilter(acc)) {
              items.add(makeItem(acc, riskFor(acc.id), now));
            };
          };
        };
        insights.add("Re-engage inactive resellers to prevent account risk escalation");
      };

      case (#AccountsNoEngagement) {
        summary := "Customer accounts with no recent engagement";
        for (acc in accounts.values()) {
          if (passesAccountFilter(acc)) {
            let accountConvs = messages.filter(func(c) {
              switch (c.relatedEntityId) { case (?eid) eid == acc.id; case null false }
            });
            if (accountConvs.size() == 0) {
              items.add(makeItem(acc, riskFor(acc.id), now));
            };
          };
        };
        insights.add("Accounts with zero engagement are high-priority for outreach");
      };

      case (#TopPerformingDistributors) {
        summary := "Distributors with strongest renewal and deal performance";
        let distMap = Map.empty<Text, Nat>();
        for (d in deals.values()) {
          let isWon = switch (d.status) { case (#Won) true; case _ false };
          if (isWon) {
            let current = switch (distMap.get(d.resellerId)) { case (?n) n; case null 0 };
            distMap.add(d.resellerId, current + 1);
          };
        };
        for (acc in accounts.values()) {
          if (passesAccountFilter(acc)) {
            for (did in acc.distributorIds.values()) {
              let count = switch (distMap.get(did)) { case (?n) n; case null 0 };
              if (count > 0) {
                items.add(makeItem(acc, riskFor(acc.id), now));
              };
            };
          };
        };
        insights.add("Top-performing distributors drive strong renewal conversion rates");
      };

      case (#ResellersBelowTarget) {
        summary := "Resellers performing below revenue or pipeline targets";
        for (p in plans.values()) {
          let wonDeals = deals.filter(func(d) {
            d.resellerId == p.partnerId and
            (switch (d.status) { case (#Won) true; case _ false })
          });
          let wonValue = wonDeals.foldLeft(0.0, func(acc2, d) { acc2 + d.estimatedValue });
          if (wonValue < p.revenueTarget) {
            let partnerAccounts = accounts.filter(func(a) {
              a.resellerOwnerId == p.partnerId and passesAccountFilter(a)
            });
            for (acc in partnerAccounts.values()) {
              items.add(makeItem(acc, riskFor(acc.id), now));
            };
          };
        };
        insights.add("Below-target resellers may need enablement or incentive support");
      };

      case (#CustomersNoActivePipeline) {
        summary := "Customers with no active deal registrations in pipeline";
        for (acc in accounts.values()) {
          if (passesAccountFilter(acc)) {
            let activeDeal = deals.find(func(d) {
              d.accountId == acc.id and
              (switch (d.status) { case (#Submitted or #UnderReview or #Approved) true; case _ false })
            });
            if (activeDeal == null) {
              items.add(makeItem(acc, riskFor(acc.id), now));
            };
          };
        };
        insights.add("Customers without active pipeline are at renewal risk");
      };

      case (#ContractsMissingPlans) {
        summary := "Accounts with active contracts but no associated business plan";
        for (acc in accounts.values()) {
          if (passesAccountFilter(acc)) {
            let hasPlan = plans.find(func(p) { p.partnerId == acc.resellerOwnerId });
            if (hasPlan == null) {
              items.add(makeItem(acc, riskFor(acc.id), now));
            };
          };
        };
        insights.add("Business plans drive reseller accountability and renewal success");
      };

      case (#StalledApprovals) {
        summary := "Deal registrations with stalled approval workflows";
        for (d in deals.values()) {
          let isStalled = switch (d.status) { case (#UnderReview) true; case _ false };
          if (isStalled and d.updatedAt < now - 7 * NS_PER_DAY) {
            let accOpt = accounts.find(func(a) { a.id == d.accountId });
            switch (accOpt) {
              case (?acc) {
                if (passesAccountFilter(acc)) {
                  items.add(makeItem(acc, riskFor(acc.id), now));
                };
              };
              case null {};
            };
          };
        };
        insights.add("Escalate stalled approvals to unblock partner pipeline");
      };

      case (#DecliningEngagement) {
        summary := "Accounts with declining engagement trends";
        for (acc in accounts.values()) {
          if (passesAccountFilter(acc)) {
            switch (riskFor(acc.id)) {
              case (?rs) {
                let hasEngagementSignal = rs.signals.find(func(s) {
                  s.signalType == "ResellerEngagementGap" or s.signalType == "DistributorEngagementGap"
                });
                if (hasEngagementSignal != null) {
                  items.add(makeItem(acc, ?rs, now));
                };
              };
              case null {};
            };
          };
        };
        insights.add("Declining engagement is an early warning signal for churn risk");
      };

      case (#HighGrowthOpportunities) {
        summary := "Accounts with high growth or upsell potential";
        for (acc in accounts.values()) {
          if (passesAccountFilter(acc)) {
            let isHealthy = switch (riskFor(acc.id)) {
              case (?rs) { switch (rs.tier) { case (#Healthy or #Low) true; case _ false } };
              case null  { true };
            };
            let activeDeals = deals.filter(func(d) {
              d.accountId == acc.id and
              (switch (d.status) { case (#Submitted or #UnderReview or #Approved) true; case _ false })
            });
            if (isHealthy and activeDeals.size() > 0) {
              items.add(makeItem(acc, riskFor(acc.id), now));
            };
          };
        };
        insights.add("Invest in healthy accounts with active deals for expansion revenue");
      };
    };

    {
      queryType;
      totalCount     = items.size();
      items          = items.toArray();
      generatedAt    = now;
      filtersApplied = filter;
      summary;
      insights       = insights.toArray();
    };
  };

  // ── Engagement gap notifications ───────────────────────────────────────────

  // Notification state injected separately to keep forgeai.mo decoupled
  public type NotificationsState = {
    notifications : Map.Map<Text, NotificationTypes.InAppNotification>;
    idCounter : { var value : Nat };
  };

  // createNotification shim (matches lib/notifications.mo signature)
  public func createNotification(
    notifState   : NotificationsState,
    recipientId  : Principal,
    notifType    : NotificationTypes.NotificationType,
    title        : Text,
    message      : Text,
    entityId     : ?Text,
    entityType   : ?Text,
  ) {
    notifState.idCounter.value += 1;
    let id = "notif-" # notifState.idCounter.value.toText();
    notifState.notifications.add(id, {
      id;
      recipientId;
      notificationType = notifType;
      title;
      message;
      entityId;
      entityType;
      isRead    = false;
      createdAt = Time.now();
    });
  };

  // Resolve all notification recipients for a given gap alert
  func resolveRecipients(
    alert       : Types.EngagementGapAlert,
    cfg         : Types.GapNotificationRecipientConfig,
    accounts    : [AccountTypes.Account],
    userProfiles: Map.Map<Text, CompanyTypes.UserProfile>,
  ) : [Principal] {
    let recipients = List.empty<Principal>();

    // Find the account this alert relates to
    // Gap alerts carry entityId = resellerOwnerId or distributorId;
    // use description to match account by comparing entityName or scan accounts
    let matchingAccounts = accounts.filter(func(a) {
      a.resellerOwnerId == alert.entityId or
      a.distributorIds.find(func(d) { d == alert.entityId }) != null
    });
    let firstAcc = matchingAccounts.find(func(_) { true });

    // Account owner = vendor owner of the matched account
    if (cfg.accountOwner) {
      switch (firstAcc) {
        case (?acc) {
          switch (userProfiles.get(acc.vendorOwnerId)) {
            case (?p) {
              let pid = Principal.fromText(p.id);
              if (recipients.find(func(r) { Principal.equal(r, pid) }) == null) {
                recipients.add(pid);
              };
            };
            case null {};
          };
        };
        case null {};
      };
    };

    // Primary admin = any user profile with isPrimaryAdmin = true in same company
    if (cfg.primaryAdmin) {
      switch (firstAcc) {
        case (?acc) {
          for ((_, profile) in userProfiles.entries()) {
            if (profile.companyId == acc.vendorOwnerId and profile.isPrimaryAdmin) {
              let pid = Principal.fromText(profile.id);
              if (recipients.find(func(r) { Principal.equal(r, pid) }) == null) {
                recipients.add(pid);
              };
            };
          };
        };
        case null {};
      };
    };

    // Assigned distributor — look up each distributorId as a profile
    if (cfg.assignedDistributor) {
      switch (firstAcc) {
        case (?acc) {
          for (distId in acc.distributorIds.values()) {
            switch (userProfiles.get(distId)) {
              case (?p) {
                let pid = Principal.fromText(p.id);
                if (recipients.find(func(r) { Principal.equal(r, pid) }) == null) {
                  recipients.add(pid);
                };
              };
              case null {};
            };
          };
        };
        case null {};
      };
    };

    // Assigned reseller
    if (cfg.assignedReseller) {
      switch (firstAcc) {
        case (?acc) {
          switch (userProfiles.get(acc.resellerOwnerId)) {
            case (?p) {
              let pid = Principal.fromText(p.id);
              if (recipients.find(func(r) { Principal.equal(r, pid) }) == null) {
                recipients.add(pid);
              };
            };
            case null {};
          };
        };
        case null {};
      };
    };

    recipients.toArray();
  };

  // Determine dedup key for a gap alert (account-scoped per entity+severity)
  func gapDedupKey(alert : Types.EngagementGapAlert) : Text {
    alert.entityId # "|" # alert.entityType # "|" # tierText(alert.alertLevel);
  };

  let NS_PER_24H : Int = 86_400_000_000_000;

  // Send in-app notifications for Critical/High gap alerts, with 24h deduplication.
  // Returns the number of notifications sent (for audit details).
  public func triggerEngagementGapNotifications(
    state        : State,
    notifState   : NotificationsState,
    gapAlerts    : [Types.EngagementGapAlert],
    accounts     : [AccountTypes.Account],
    userProfiles : Map.Map<Text, CompanyTypes.UserProfile>,
  ) : Nat {
    let now   = Time.now();
    var count = 0;

    for (alert in gapAlerts.values()) {
      // Only fire for Critical and High
      let cfgOpt : ?Types.GapNotificationRecipientConfig = switch (alert.alertLevel) {
        case (#Critical) { ?(state.settings.value.gapNotificationConfig.critical) };
        case (#High)     { ?(state.settings.value.gapNotificationConfig.high) };
        case _           { null };
      };
      switch (cfgOpt) {
        case null {};
        case (?cfg) {
          // Deduplication check — skip if notified in last 24 h
          let key = gapDedupKey(alert);
          let alreadySent = switch (state.gapNotifSentAt.get(key)) {
            case (?ts) { now - ts < NS_PER_24H };
            case null  { false };
          };
          if (not alreadySent) {
            let recipients = resolveRecipients(alert, cfg, accounts, userProfiles);
            let title = "[ForgeAI] " # tierText(alert.alertLevel) # " Engagement Gap — " # alert.entityType;
            let message = alert.description # " Action required: re-establish contact to prevent renewal risk escalation.";
            for (r in recipients.values()) {
              createNotification(
                notifState,
                r,
                #EngagementGapAlert,
                title,
                message,
                ?alert.entityId,
                ?alert.entityType,
              );
              count += 1;
            };
            // Record send time for dedup (even if 0 recipients, prevents repeated resolution)
            state.gapNotifSentAt.add(key, now);
          };
        };
      };
    };
    count;
  };

  // ── Gap notification config helpers ───────────────────────────────────────

  public func getGapNotificationConfig(state : State) : Types.GapNotificationConfig {
    state.settings.value.gapNotificationConfig;
  };

  public func updateGapNotificationConfig(
    state : State,
    cfg   : Types.GapNotificationConfig,
  ) {
    state.settings.value := { state.settings.value with gapNotificationConfig = cfg };
  };



  func tierText(tier : Types.RiskTier) : Text {
    switch (tier) {
      case (#Critical) { "Critical" };
      case (#High)     { "High" };
      case (#Medium)   { "Medium" };
      case (#Low)      { "Low" };
      case (#Healthy)  { "Healthy" };
    };
  };

  func makeItem(
    acc   : AccountTypes.Account,
    rsOpt : ?Types.RenewalRiskScore,
    now   : Int,
  ) : Types.SmartQueryResultItem {
    let daysUntilRenewal = (acc.renewalDate - now) / NS_PER_DAY;
    let (score, tier) = switch (rsOpt) {
      case (?rs) { (?rs.score, ?rs.tier) };
      case null  { (null, null) };
    };
    {
      entityId           = acc.id;
      entityType         = "Account";
      entityName         = acc.accountName;
      riskScore          = score;
      riskTier           = tier;
      daysUntilRenewal   = ?daysUntilRenewal;
      lastEngagementDays = null;
      resellerName       = ?acc.resellerOwnerId;
      distributorName    = if (acc.distributorIds.size() > 0) { ?acc.distributorIds[0] } else { null };
      details            = acc.contractType;
    };
  };
};
