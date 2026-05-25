// Quarter and fiscal year configuration domain logic for CHANNELFORGE CRM
import Map "mo:core/Map";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import Types "../types/quarters";

module {
  public type State = {
    fiscalYearConfigs : Map.Map<Text, Types.FiscalYearConfig>;
  };

  public func initState() : State = {
    fiscalYearConfigs = Map.empty<Text, Types.FiscalYearConfig>();
  };

  // ── Date helpers ──────────────────────────────────────────────────────────

  // Parse a YYYY-MM-DD string into (year, month, day) or return null on failure
  func parseDate(d : Text) : ?(Nat, Nat, Nat) {
    let parts = d.split(#char '-');
    let arr = parts.toArray();
    if (arr.size() != 3) return null;
    switch (Nat.fromText(arr[0]), Nat.fromText(arr[1]), Nat.fromText(arr[2])) {
      case (?y, ?m, ?day) {
        if (y < 2000 or y > 2100) return null;
        if (m < 1 or m > 12) return null;
        if (day < 1 or day > 31) return null;
        ?(y, m, day);
      };
      case _ { null };
    };
  };

  // Days since a fixed epoch (1970-01-01) — simplified for comparison and deltas
  // Uses Zeller-style arithmetic (no leap-day precision needed for business logic).
  func dateToDays(y : Nat, m : Nat, d : Nat) : Int {
    // Shift year so March is month 1 (avoids leap-day edge on Feb)
    let adjMonth : Int = if (m <= 2) { m.toInt() + 10 } else { m.toInt() - 2 };
    let adjYear  : Int = if (m <= 2) { y.toInt() - 1 } else { y.toInt() };
    let era      : Int = if (adjYear >= 0) { adjYear / 400 } else { (adjYear - 399) / 400 };
    let yoe      : Int = adjYear - era * 400;         // [0, 399]
    let doy      : Int = (153 * adjMonth + 2) / 5 + d.toInt() - 1; // [0, 365]
    let doe      : Int = yoe * 365 + yoe / 4 - yoe / 100 + doy;    // [0, 146096]
    era * 146097 + doe - 719468; // days since unix epoch
  };

  func parseDateToDays(date : Text) : ?Int {
    switch (parseDate(date)) {
      case (?(y, m, d)) { ?(dateToDays(y, m, d)) };
      case null { null };
    };
  };

  // True when dateA < dateB (both YYYY-MM-DD)
  func dateStrLess(a : Text, b : Text) : Bool {
    switch (parseDateToDays(a), parseDateToDays(b)) {
      case (?da, ?db) { da < db };
      case _ { a < b };   // fallback lexicographic
    };
  };

  // ── Validation ────────────────────────────────────────────────────────────

  func validateQuarters(quarters : [Types.QuarterDef]) : ?Text {
    if (quarters.size() != 4) {
      return ?("Exactly 4 quarters (Q1-Q4) must be defined; got " # quarters.size().toText());
    };
    // Each quarter must have valid date strings
    for (q in quarters.values()) {
      switch (parseDate(q.startDate), parseDate(q.endDate)) {
        case (null, _) { return ?("Invalid startDate '" # q.startDate # "' for " # q.quarterId) };
        case (_, null) { return ?("Invalid endDate '" # q.endDate # "' for " # q.quarterId) };
        case (?_, ?_) {
          if (not dateStrLess(q.startDate, q.endDate)) {
            return ?("startDate must be before endDate for " # q.quarterId);
          };
        };
      };
    };
    // No overlaps — check each pair
    for (i in Nat.range(0, 4)) {
      for (j in Nat.range(i + 1, 4)) {
        let qi = quarters[i];
        let qj = quarters[j];
        // qi and qj overlap if qi.startDate <= qj.endDate && qj.startDate <= qi.endDate
        let qiStartDays = switch (parseDateToDays(qi.startDate)) { case (?d) d; case null 0 };
        let qiEndDays   = switch (parseDateToDays(qi.endDate))   { case (?d) d; case null 0 };
        let qjStartDays = switch (parseDateToDays(qj.startDate)) { case (?d) d; case null 0 };
        let qjEndDays   = switch (parseDateToDays(qj.endDate))   { case (?d) d; case null 0 };
        if (qiStartDays <= qjEndDays and qjStartDays <= qiEndDays) {
          return ?("Quarters " # qi.quarterId # " and " # qj.quarterId # " have overlapping dates");
        };
      };
    };
    null;
  };

  // ── Public API ────────────────────────────────────────────────────────────

  public func saveFiscalYearConfig(
    state : State,
    vendorId : Text,
    input : Types.FiscalYearConfigInput,
    updatedBy : Text,
  ) : CommonTypes.Result<Types.FiscalYearConfig, Text> {
    switch (validateQuarters(input.quarters)) {
      case (?err) { return #err(err) };
      case null {};
    };
    let config : Types.FiscalYearConfig = {
      vendorId;
      fiscalYearType = input.fiscalYearType;
      quarters       = input.quarters;
      updatedAt      = Time.now();
      updatedBy;
    };
    state.fiscalYearConfigs.add(vendorId, config);
    #ok(config);
  };

  public func getFiscalYearConfig(
    state : State,
    vendorId : Text,
  ) : ?Types.FiscalYearConfig {
    state.fiscalYearConfigs.get(vendorId);
  };

  public func getCurrentQuarter(
    state : State,
    vendorId : Text,
    nowNanoseconds : Int,
  ) : ?Types.CurrentQuarterResult {
    switch (state.fiscalYearConfigs.get(vendorId)) {
      case null { null };
      case (?cfg) {
        // Convert nanoseconds to days since epoch
        let nanosPerDay : Int = 86_400_000_000_000;
        let todayDays : Int = nowNanoseconds / nanosPerDay;

        let matched = cfg.quarters.find(func(q : Types.QuarterDef) : Bool {
          switch (parseDateToDays(q.startDate), parseDateToDays(q.endDate)) {
            case (?sd, ?ed) { todayDays >= sd and todayDays <= ed };
            case _ { false };
          };
        });
        switch (matched) {
          case null { null };
          case (?q) {
            let startDays = switch (parseDateToDays(q.startDate)) { case (?d) d; case null 0 };
            let endDays   = switch (parseDateToDays(q.endDate))   { case (?d) d; case null 0 };
            let totalDays = endDays - startDays + 1;
            let elapsed   = todayDays - startDays;
            let remaining = endDays - todayDays;
            let progress  : Float = if (totalDays <= 0) { 0.0 } else {
              (elapsed.toFloat() / totalDays.toFloat()) * 100.0
            };
            ?{
              quarterDef      = q;
              daysElapsed     = elapsed.toNat();
              daysRemaining   = remaining.toNat();
              progressPercent = progress;
            };
          };
        };
      };
    };
  };

  // quarterKey format: "Q1-2025" — matches quarterId field in QuarterDef
  public func getQuarterByKey(
    state : State,
    vendorId : Text,
    quarterKey : Text,
  ) : ?Types.QuarterDef {
    switch (state.fiscalYearConfigs.get(vendorId)) {
      case null { null };
      case (?cfg) {
        cfg.quarters.find(func(q : Types.QuarterDef) : Bool {
          q.quarterId == quarterKey
        });
      };
    };
  };
};
