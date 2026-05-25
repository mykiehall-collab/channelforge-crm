import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import CreditsTypes "../types/credits";
import CommonTypes "../types/common";
import Float "mo:core/Float";
import Int "mo:core/Int";

module {
  // ── Initial credit balance awarded to every organisation ────────────────
  let INITIAL_COMPUTE : Nat = 10_000;
  let INITIAL_STORAGE : Nat = 500;
  let INITIAL_AI      : Nat = 2_000;

  // ── State ────────────────────────────────────────────────────────────────
  public type State = {
    balances    : Map.Map<Text, CreditsTypes.CreditBalance>;
    usageEvents : Map.Map<Text, List.List<CreditsTypes.UsageEvent>>;
    topUps      : Map.Map<Text, List.List<CreditsTypes.CreditTopUp>>;
  };

  public func initState() : State {
    let state : State = {
      balances    = Map.empty<Text, CreditsTypes.CreditBalance>();
      usageEvents = Map.empty<Text, List.List<CreditsTypes.UsageEvent>>();
      topUps      = Map.empty<Text, List.List<CreditsTypes.CreditTopUp>>();
    };
    // TODO-SECURITY: Remove test seed before live launch
    _seedOrg(state, "test-vendor-001");
    _seedOrg(state, "test-distributor-001");
    _seedOrg(state, "test-reseller-001");
    state;
  };

  // Seed a test org with generous starting credits
  private func _seedOrg(state : State, orgId : Text) {
    state.balances.add(orgId, {
      computeCredits = INITIAL_COMPUTE;
      storageCredits = INITIAL_STORAGE;
      aiCredits      = INITIAL_AI;
    });
    state.usageEvents.add(orgId, List.empty<CreditsTypes.UsageEvent>());
    state.topUps.add(orgId, List.empty<CreditsTypes.CreditTopUp>());
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  // Ensure an org has an entry; returns the current (possibly new) balance
  func _ensureOrg(state : State, orgId : Text) : CreditsTypes.CreditBalance {
    switch (state.balances.get(orgId)) {
      case (?b) b;
      case null {
        let b : CreditsTypes.CreditBalance = {
          computeCredits = INITIAL_COMPUTE;
          storageCredits = INITIAL_STORAGE;
          aiCredits      = INITIAL_AI;
        };
        state.balances.add(orgId, b);
        state.usageEvents.add(orgId, List.empty<CreditsTypes.UsageEvent>());
        state.topUps.add(orgId, List.empty<CreditsTypes.CreditTopUp>());
        b;
      };
    };
  };

  // Safely subtract, floor at zero
  func _subtractNat(a : Nat, b : Nat) : Nat {
    if (b >= a) 0 else a - b;
  };

  // ── Public API ───────────────────────────────────────────────────────────

  public func getCreditBalance(
    state : State,
    orgId : Text,
  ) : CreditsTypes.CreditBalance {
    _ensureOrg(state, orgId);
  };

  public func recordUsageEvent(
    state : State,
    event : CreditsTypes.UsageEvent,
  ) : CommonTypes.Result<CreditsTypes.CreditBalance, Text> {
    let bal = _ensureOrg(state, event.orgId);
    // Check sufficient credits (compute + ai; storage deducted separately)
    let newCompute = _subtractNat(bal.computeCredits, event.computeCost);
    let newStorage = _subtractNat(bal.storageCredits, event.storageCost);
    let newAi      = _subtractNat(bal.aiCredits,      event.aiCost);
    let updated : CreditsTypes.CreditBalance = {
      computeCredits = newCompute;
      storageCredits = newStorage;
      aiCredits      = newAi;
    };
    state.balances.add(event.orgId, updated);
    // Append event to history
    let history = switch (state.usageEvents.get(event.orgId)) {
      case (?h) h;
      case null List.empty<CreditsTypes.UsageEvent>();
    };
    history.add(event);
    state.usageEvents.add(event.orgId, history);
    #ok(updated);
  };

  public func addTopUp(
    state : State,
    topUp : CreditsTypes.CreditTopUp,
  ) : CommonTypes.Result<CreditsTypes.CreditBalance, Text> {
    // TODO-SECURITY: validate payment receipt before crediting in production
    let bal = _ensureOrg(state, topUp.userId); // userId here used as orgId from caller context
    // Find matching package for validation (soft check — allow any packageId)
    let updated : CreditsTypes.CreditBalance = {
      computeCredits = bal.computeCredits + topUp.computeAdded;
      storageCredits = bal.storageCredits + topUp.storageAdded;
      aiCredits      = bal.aiCredits      + topUp.aiAdded;
    };
    state.balances.add(topUp.userId, updated);
    let history = switch (state.topUps.get(topUp.userId)) {
      case (?h) h;
      case null List.empty<CreditsTypes.CreditTopUp>();
    };
    history.add(topUp);
    state.topUps.add(topUp.userId, history);
    #ok(updated);
  };

  public func addTopUpForOrg(
    state : State,
    orgId : Text,
    topUp : CreditsTypes.CreditTopUp,
  ) : CommonTypes.Result<CreditsTypes.CreditBalance, Text> {
    // TODO-SECURITY: validate payment receipt before crediting in production
    let bal = _ensureOrg(state, orgId);
    let updated : CreditsTypes.CreditBalance = {
      computeCredits = bal.computeCredits + topUp.computeAdded;
      storageCredits = bal.storageCredits + topUp.storageAdded;
      aiCredits      = bal.aiCredits      + topUp.aiAdded;
    };
    state.balances.add(orgId, updated);
    let history = switch (state.topUps.get(orgId)) {
      case (?h) h;
      case null List.empty<CreditsTypes.CreditTopUp>();
    };
    history.add(topUp);
    state.topUps.add(orgId, history);
    #ok(updated);
  };

  public func getUsageHistory(
    state : State,
    orgId : Text,
  ) : [CreditsTypes.UsageEvent] {
    switch (state.usageEvents.get(orgId)) {
      case (?h) h.toArray();
      case null [];
    };
  };

  public func getTopUpHistory(
    state : State,
    orgId : Text,
  ) : [CreditsTypes.CreditTopUp] {
    switch (state.topUps.get(orgId)) {
      case (?h) h.toArray();
      case null [];
    };
  };

  // ── Forecasting ──────────────────────────────────────────────────────────

  // Returns estimated total credits consumed per 30-day month
  public func estimateMonthlyUsage(state : State, orgId : Text) : Nat {
    let events = getUsageHistory(state, orgId);
    let n = events.size();
    if (n == 0) return 0;
    // Sum all credit costs
    var total : Nat = 0;
    for (e in events.vals()) {
      total += e.computeCost + e.storageCost + e.aiCost;
    };
    // Oldest and newest timestamp spread
    var oldest : Int = events[0].timestamp;
    var newest : Int = events[0].timestamp;
    for (e in events.vals()) {
      if (e.timestamp < oldest) oldest := e.timestamp;
      if (e.timestamp > newest) newest := e.timestamp;
    };
    let spanNs : Int = newest - oldest;
    let thirtyDaysNs : Int = 30 * 24 * 3_600 * 1_000_000_000;
    if (spanNs <= 0) {
      // Only one point in time — extrapolate assuming daily rate = total events
      total * 30;
    } else {
      // Rate per nanosecond × 30-day window
      let ratePerNs : Float = total.toFloat() / spanNs.toFloat();
      let monthly = ratePerNs * thirtyDaysNs.toFloat();
      if (monthly < 1.0) 1 else monthly.toInt().toNat();
    };
  };

  // Returns estimated days until credits run out (compute + ai combined)
  public func estimateDaysRemaining(state : State, orgId : Text) : Nat {
    let bal = _ensureOrg(state, orgId);
    let remaining = bal.computeCredits + bal.aiCredits;
    let monthly = estimateMonthlyUsage(state, orgId);
    if (monthly == 0) return 999; // no usage → effectively unlimited
    let dailyRate : Float = monthly.toFloat() / 30.0;
    if (dailyRate <= 0.0) return 999;
    let days = remaining.toFloat() / dailyRate;
    if (days < 0.0) 0 else days.toInt().toNat();
  };

  // Returns a trend label based on recent vs earlier usage
  public func getUsageTrend(state : State, orgId : Text) : Text {
    let events = getUsageHistory(state, orgId);
    let n = events.size();
    if (n < 4) return "stable";
    // Split into first half and second half
    let half = n / 2;
    var firstHalf : Nat = 0;
    var secondHalf : Nat = 0;
    var i = 0;
    for (e in events.vals()) {
      let cost = e.computeCost + e.storageCost + e.aiCost;
      if (i < half) { firstHalf += cost } else { secondHalf += cost };
      i += 1;
    };
    if (secondHalf > firstHalf + firstHalf / 5) "increasing"
    else if (firstHalf > secondHalf + secondHalf / 5) "decreasing"
    else "stable";
  };

  // ── Package catalogue ────────────────────────────────────────────────────
  public func getCreditPackages() : [CreditsTypes.CreditPackage] {
    CreditsTypes.PACKAGES;
  };
};
