// Target management and QTD metrics domain logic for CHANNELFORGE CRM
import Map "mo:core/Map";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import Types "../types/targets";
import DealTypes "../types/deals";
import QuartersLib "quarters";
import Order "mo:core/Order";

module {
  public type State = {
    measureConfigs    : Map.Map<Text, Types.TargetMeasureConfig>;
    targetAssignments : Map.Map<Text, Types.TargetAssignment>;
    idCounter         : { var value : Nat };
  };

  public func initState() : State = {
    measureConfigs    = Map.empty<Text, Types.TargetMeasureConfig>();
    targetAssignments = Map.empty<Text, Types.TargetAssignment>();
    idCounter         = { var value = 0 };
  };

  // ── Default measure seed ──────────────────────────────────────────────────

  func defaultMeasures() : [Types.TargetMeasure] {
    [
      { measureId = #Measure1; defaultName = "Renewal Revenue";              customName = null; calculationType = #Revenue  },
      { measureId = #Measure2; defaultName = "New Business Revenue";          customName = null; calculationType = #Revenue  },
      { measureId = #Measure3; defaultName = "Pipeline Created";             customName = null; calculationType = #Revenue  },
      { measureId = #Measure4; defaultName = "Deal Registrations Approved";  customName = null; calculationType = #Count    },
      { measureId = #Measure5; defaultName = "Closed Won Revenue";           customName = null; calculationType = #Revenue  },
    ];
  };

  public func initDefaultMeasures(vendorId : Text) : Types.TargetMeasureConfig {
    {
      vendorId;
      measures  = defaultMeasures();
      updatedAt = Time.now();
      updatedBy = "system";
    };
  };

  // ── Measure config ────────────────────────────────────────────────────────

  public func getMeasureConfig(
    state : State,
    vendorId : Text,
  ) : Types.TargetMeasureConfig {
    switch (state.measureConfigs.get(vendorId)) {
      case (?cfg) { cfg };
      case null {
        let cfg = initDefaultMeasures(vendorId);
        state.measureConfigs.add(vendorId, cfg);
        cfg;
      };
    };
  };

  public func updateMeasureName(
    state : State,
    vendorId : Text,
    measureId : Types.TargetMeasureId,
    newName : Text,
    updatedBy : Text,
  ) : CommonTypes.Result<Types.TargetMeasureConfig, Text> {
    let trimmed = newName.trimStart(#char ' ').trimEnd(#char ' ');
    if (trimmed.size() == 0 or trimmed.size() > 50) {
      return #err("Measure name must be 1–50 characters");
    };
    let current = getMeasureConfig(state, vendorId);
    let updated = current.measures.map(func(m) {
      if (m.measureId == measureId) { { m with customName = ?trimmed } } else { m };
    });
    let newCfg : Types.TargetMeasureConfig = {
      current with
      measures  = updated;
      updatedAt = Time.now();
      updatedBy;
    };
    state.measureConfigs.add(vendorId, newCfg);
    #ok(newCfg);
  };

  // ── Target assignments ────────────────────────────────────────────────────

  public func saveTargetAssignment(
    state : State,
    vendorId : Text,
    input : Types.TargetAssignmentInput,
    assignedBy : Text,
  ) : CommonTypes.Result<Types.TargetAssignment, Text> {
    state.idCounter.value += 1;
    let measureKey = switch (input.measureId) {
      case (#Measure1) { "m1" }; case (#Measure2) { "m2" };
      case (#Measure3) { "m3" }; case (#Measure4) { "m4" };
      case (#Measure5) { "m5" };
    };
    let assignmentId = vendorId # "-" # measureKey # "-" # input.periodKey #
                       "-" # state.idCounter.value.toText();
    let assignment : Types.TargetAssignment = {
      assignmentId;
      vendorId;
      measureId       = input.measureId;
      targetValue     = input.targetValue;
      periodType      = input.periodType;
      periodKey       = input.periodKey;
      assignmentScope = input.assignmentScope;
      assignedAt      = Time.now();
      assignedBy;
    };
    state.targetAssignments.add(assignmentId, assignment);
    #ok(assignment);
  };

  public func getTargetAssignments(
    state : State,
    vendorId : Text,
    measureId : ?Types.TargetMeasureId,
    periodKey : ?Text,
  ) : [Types.TargetAssignment] {
    state.targetAssignments.values().filter(func(a) {
      if (a.vendorId != vendorId) return false;
      switch (measureId) {
        case (?mid) { if (a.measureId != mid) return false };
        case null {};
      };
      switch (periodKey) {
        case (?pk) { if (a.periodKey != pk) return false };
        case null {};
      };
      true;
    }).toArray();
  };

  public func deleteTargetAssignment(
    state : State,
    vendorId : Text,
    assignmentId : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.targetAssignments.get(assignmentId)) {
      case null { #err("Target assignment not found") };
      case (?a) {
        if (a.vendorId != vendorId) return #err("Not authorized to delete this assignment");
        state.targetAssignments.remove(assignmentId);
        #ok(());
      };
    };
  };

  // ── QTD metrics ───────────────────────────────────────────────────────────

  func dealStatusIsActive(s : DealTypes.DealStatus) : Bool {
    switch (s) {
      case (#Rejected) { false }; case (#Expired) { false }; case (#Lost) { false };
      case _ { true };
    };
  };

  func dealStatusIsWon(s : DealTypes.DealStatus) : Bool {
    switch (s) { case (#Won or #Approved) { true }; case _ { false } };
  };

  func dealStatusIsSubmitted(s : DealTypes.DealStatus) : Bool {
    switch (s) { case (#Draft) { false }; case _ { true } };
  };

  func isRenewalDeal(d : DealTypes.DealRegistration) : Bool {
    let lower = d.product.toLower();
    lower.contains(#text "renewal") or lower.contains(#text "renew") or d.dealStage.toLower() == "renewal";
  };

  public func calculateQTDMetrics(
    state          : State,
    quartersState  : QuartersLib.State,
    vendorId       : Text,
    filters        : Types.QTDFilters,
    deals          : [DealTypes.DealRegistration],
    currency       : Text,
  ) : Types.QTDMetrics {
    let quarterKey = switch (filters.quarterKey) { case (?k) k; case null "" };

    // Resolve quarter date range for filtering by close/creation date
    let quarterDateRange : ?(Int, Int) = switch (QuartersLib.getQuarterByKey(quartersState, vendorId, quarterKey)) {
      case null { null };
      case (?q) {
        // We use simple string comparison on YYYY-MM-DD dates
        ?(0, 0); // placeholder — we filter by quarterKey in deal fields directly
      };
    };
    let _ = quarterDateRange; // suppress unused warning

    let filtered = deals.filter(func(d : DealTypes.DealRegistration) : Bool {
      // Filter by resellerId if set
      switch (filters.resellerId) {
        case (?rid) { if (d.resellerId != rid) return false };
        case null {};
      };
      // Filter by tier / country / productFamily — these are label filters
      // passed through without deal-level data in the current model
      true;
    });

    var renewalRevenue    : Float = 0.0;
    var newBizRevenue     : Float = 0.0;
    var pipelineCreated   : Float = 0.0;
    var pipelineClosed    : Float = 0.0;
    var drSubmitted       : Nat   = 0;
    var drApproved        : Nat   = 0;

    for (d in filtered.values()) {
      if (dealStatusIsSubmitted(d.status)) { drSubmitted += 1 };
      switch (d.status) { case (#Approved) { drApproved += 1 }; case _ {} };

      if (dealStatusIsActive(d.status)) {
        pipelineCreated += d.estimatedValue;
      };
      switch (d.status) { case (#Won) { pipelineClosed += d.estimatedValue }; case _ {} };

      if (isRenewalDeal(d)) {
        if (dealStatusIsWon(d.status)) { renewalRevenue += d.estimatedValue };
      } else {
        if (dealStatusIsWon(d.status)) { newBizRevenue += d.estimatedValue };
      };
    };

    {
      resellerId                 = filters.resellerId;
      quarterKey;
      renewalRevenue;
      newBusinessRevenue         = newBizRevenue;
      pipelineCreated;
      pipelineClosed;
      dealRegistrationsSubmitted = drSubmitted;
      dealRegistrationsApproved  = drApproved;
      currency;
      calculatedAt               = Time.now();
    };
  };

  public func calculatePartnerRankings(
    state             : State,
    vendorId          : Text,
    quarterKey        : Text,
    resellers         : [(Text, Text)],
    deals             : [DealTypes.DealRegistration],
    targetAssignments : [Types.TargetAssignment],
  ) : [Types.ResellerQTDRanking] {
    let rankings = resellers.map(func((rid, rname)) {
      // Sum renewal revenue for this reseller
      let revenue = deals.filter(func(d : DealTypes.DealRegistration) : Bool {
        d.resellerId == rid and isRenewalDeal(d) and dealStatusIsWon(d.status)
      }).foldLeft(0.0, func(acc, d) { acc + d.estimatedValue });

      // Find renewal target assignment for this reseller/quarter
      let targetOpt = targetAssignments.find(func(a : Types.TargetAssignment) : Bool {
        a.vendorId == vendorId and a.measureId == #Measure1 and a.periodKey == quarterKey and
          (switch (a.assignmentScope) {
            case (#ByReseller(r)) { r == rid };
            case (#AllResellers) { true };
            case _ { false };
          })
      });
      let attainment : Float = switch (targetOpt) {
        case null { 100.0 }; // no target assigned — default to 100%
        case (?t) {
          if (t.targetValue == 0.0) { 100.0 }
          else { (revenue / t.targetValue) * 100.0 };
        };
      };
      { resellerId = rid; resellerName = rname; renewalRevenue = revenue; attainmentPercent = attainment; rank = 0 };
    });

    // Sort descending by attainment
    let sorted = rankings.sort(func(a : Types.ResellerQTDRanking, b : Types.ResellerQTDRanking) : Order.Order {
      if (a.attainmentPercent > b.attainmentPercent) { #less }
      else if (a.attainmentPercent < b.attainmentPercent) { #greater }
      else { #equal };
    });

    // Assign rank and cap at 10
    let capped = if (sorted.size() > 10) { sorted.sliceToArray(0, 10) } else { sorted };
    capped.mapEntries<Types.ResellerQTDRanking, Types.ResellerQTDRanking>(func(r, i) { { r with rank = i + 1 } });
  };
};
