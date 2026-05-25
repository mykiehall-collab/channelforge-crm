// QTD dashboard and target management public API for CHANNELFORGE CRM
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import QuartersLib "../lib/quarters";
import TargetsLib "../lib/targets";
import DealsLib "../lib/deals";
import CompanyLib "../lib/company";
import AlertsLib "../lib/alerts";
import CommonTypes "../types/common";
import QTypes "../types/quarters";
import TTypes "../types/targets";
import CompanyTypes "../types/company";

mixin (
  quartersState : QuartersLib.State,
  targetsState  : TargetsLib.State,
  dealsState    : DealsLib.State,
  companyState  : CompanyLib.State,
  alertsState   : AlertsLib.State,
) {

  // ── Role helpers ──────────────────────────────────────────────────────────

  func callerProfile(caller : Principal) : ?CompanyTypes.UserProfile {
    CompanyLib.getUserProfile(companyState, caller.toText());
  };

  func isVendorPrimaryAdmin(caller : Principal) : Bool {
    switch (callerProfile(caller)) {
      case (?(p)) {
        switch (p.role) {
          case (#VendorPrimaryAdmin) { true };
          case _ { false };
        };
      };
      case null { false };
    };
  };

  func isVendorAdmin(caller : Principal) : Bool {
    switch (callerProfile(caller)) {
      case (?(p)) {
        switch (p.role) {
          case (#VendorPrimaryAdmin or #VendorAdmin) { true };
          case (#VendorSecondaryAdmin) { true };
          case _ { false };
        };
      };
      case null { false };
    };
  };

  func hasPermission(caller : Principal, perm : Text) : Bool {
    switch (callerProfile(caller)) {
      case null { false };
      case (?p) {
        switch (p.role) {
          case (#VendorPrimaryAdmin or #VendorAdmin) { true };
          case (#VendorSecondaryAdmin) {
            p.permissions.find(func(s : Text) : Bool { s == perm }) != null;
          };
          case _ { false };
        };
      };
    };
  };

  func callerVendorId(caller : Principal) : ?Text {
    switch (callerProfile(caller)) {
      case null { null };
      case (?p) { ?p.companyId };
    };
  };

  func callerResellerId(caller : Principal) : ?Text {
    switch (callerProfile(caller)) {
      case null { null };
      case (?p) {
        switch (p.role) {
          case (#ResellerPrimaryAdmin or #ResellerAdmin or #ResellerSalesUser) { ?p.companyId };
          case _ { null };
        };
      };
    };
  };

  // ── Fiscal year config ────────────────────────────────────────────────────

  public shared ({ caller }) func saveFiscalYearConfig(
    input : QTypes.FiscalYearConfigInput
  ) : async CommonTypes.Result<QTypes.FiscalYearConfig, Text> {
    if (not hasPermission(caller, "ManageQuarterSetup")) {
      return #err("Only Vendor Admins with ManageQuarterSetup permission may configure fiscal quarters");
    };
    let vendorId = switch (callerVendorId(caller)) {
      case null { return #err("Vendor company not found for caller") };
      case (?vid) { vid };
    };
    // Capture old config for audit details
    let oldCfg = QuartersLib.getFiscalYearConfig(quartersState, vendorId);
    let oldDetails = switch (oldCfg) {
      case null { "no previous config" };
      case (?c) { "previous quarters: " # debug_show(c.quarters) };
    };
    let result = QuartersLib.saveFiscalYearConfig(quartersState, vendorId, input, caller.toText());
    switch (result) {
      case (#ok(cfg)) {
        AlertsLib.appendAuditEntry(
          alertsState,
          caller.toText(),
          "quarter_config_updated",
          "FiscalYearConfig",
          vendorId,
          oldDetails # " | new quarters: " # debug_show(cfg.quarters),
        );
      };
      case (#err(_)) {};
    };
    result;
  };

  public query ({ caller }) func getFiscalYearConfig() : async ?QTypes.FiscalYearConfig {
    switch (callerVendorId(caller)) {
      case null { null };
      case (?vid) { QuartersLib.getFiscalYearConfig(quartersState, vid) };
    };
  };

  public query ({ caller }) func getCurrentQuarter() : async ?QTypes.CurrentQuarterResult {
    switch (callerVendorId(caller)) {
      case null { null };
      case (?vid) { QuartersLib.getCurrentQuarter(quartersState, vid, Time.now()) };
    };
  };

  // ── Measure config ────────────────────────────────────────────────────────

  public query ({ caller }) func getMeasureConfig() : async TTypes.TargetMeasureConfig {
    let vendorId = switch (callerVendorId(caller)) {
      case null { "" };
      case (?vid) { vid };
    };
    TargetsLib.getMeasureConfig(targetsState, vendorId);
  };

  public shared ({ caller }) func updateMeasureName(
    measureId : TTypes.TargetMeasureId,
    newName   : Text,
  ) : async CommonTypes.Result<TTypes.TargetMeasureConfig, Text> {
    if (not isVendorPrimaryAdmin(caller)) {
      return #err("Only Vendor Primary Admins may rename target measures");
    };
    let vendorId = switch (callerVendorId(caller)) {
      case null { return #err("Vendor company not found for caller") };
      case (?vid) { vid };
    };
    let current = TargetsLib.getMeasureConfig(targetsState, vendorId);
    let oldName = switch (current.measures.find(func(m : TTypes.TargetMeasure) : Bool { m.measureId == measureId })) {
      case null { "unknown" };
      case (?m) { switch (m.customName) { case (?n) n; case null { m.defaultName } } };
    };
    let result = TargetsLib.updateMeasureName(targetsState, vendorId, measureId, newName, caller.toText());
    switch (result) {
      case (#ok(_)) {
        let midText = debug_show(measureId);
        AlertsLib.appendAuditEntry(
          alertsState,
          caller.toText(),
          "measure_renamed",
          "TargetMeasureConfig",
          vendorId,
          "measureId=" # midText # " oldName=" # oldName # " newName=" # newName,
        );
      };
      case (#err(_)) {};
    };
    result;
  };

  // ── Target assignments ────────────────────────────────────────────────────

  public shared ({ caller }) func saveTargetAssignment(
    input : TTypes.TargetAssignmentInput
  ) : async CommonTypes.Result<TTypes.TargetAssignment, Text> {
    if (not hasPermission(caller, "ManageTargets")) {
      return #err("Only Vendor Admins with ManageTargets permission may create targets");
    };
    let vendorId = switch (callerVendorId(caller)) {
      case null { return #err("Vendor company not found for caller") };
      case (?vid) { vid };
    };
    let result = TargetsLib.saveTargetAssignment(targetsState, vendorId, input, caller.toText());
    switch (result) {
      case (#ok(a)) {
        AlertsLib.appendAuditEntry(
          alertsState,
          caller.toText(),
          "target_assigned",
          "TargetAssignment",
          a.assignmentId,
          "measureId=" # debug_show(a.measureId) # " periodKey=" # a.periodKey #
            " targetValue=" # debug_show(a.targetValue) # " scope=" # debug_show(a.assignmentScope),
        );
      };
      case (#err(_)) {};
    };
    result;
  };

  public query ({ caller }) func getTargetAssignments(
    measureId : ?TTypes.TargetMeasureId,
    periodKey : ?Text,
  ) : async [TTypes.TargetAssignment] {
    let vendorId = switch (callerVendorId(caller)) {
      case null { return [] };
      case (?vid) { vid };
    };
    // Reseller users see only their own scope
    let allAssignments = TargetsLib.getTargetAssignments(targetsState, vendorId, measureId, periodKey);
    switch (callerResellerId(caller)) {
      case null { allAssignments }; // vendor user — sees everything
      case (?rid) {
        allAssignments.filter(func(a : TTypes.TargetAssignment) : Bool {
          switch (a.assignmentScope) {
            case (#AllPartners) { true };
            case (#ByReseller(r)) { r == rid };
            case _ { false };
          };
        });
      };
    };
  };

  public shared ({ caller }) func deleteTargetAssignment(
    assignmentId : Text
  ) : async CommonTypes.Result<(), Text> {
    if (not isVendorPrimaryAdmin(caller)) {
      return #err("Only Vendor Primary Admins may delete target assignments");
    };
    let vendorId = switch (callerVendorId(caller)) {
      case null { return #err("Vendor company not found for caller") };
      case (?vid) { vid };
    };
    let result = TargetsLib.deleteTargetAssignment(targetsState, vendorId, assignmentId);
    switch (result) {
      case (#ok(())) {
        AlertsLib.appendAuditEntry(
          alertsState,
          caller.toText(),
          "target_assignment_deleted",
          "TargetAssignment",
          assignmentId,
          "deleted by VendorPrimaryAdmin",
        );
      };
      case (#err(_)) {};
    };
    result;
  };

  // ── QTD metrics ───────────────────────────────────────────────────────────

  public query ({ caller }) func getQTDMetrics(
    filters : TTypes.QTDFilters
  ) : async TTypes.QTDMetrics {
    let vendorId = switch (callerVendorId(caller)) {
      case null { return emptyMetrics(filters) };
      case (?vid) { vid };
    };
    let currency = switch (filters.currency) { case (?c) c; case null { "USD" } };
    // Reseller users may only query their own metrics
    let effectiveFilters : TTypes.QTDFilters = switch (callerResellerId(caller)) {
      case null { filters }; // vendor user
      case (?rid) { { filters with resellerId = ?rid } };
    };
    let allDeals = DealsLib.getAllDealRegistrations(dealsState);
    TargetsLib.calculateQTDMetrics(targetsState, quartersState, vendorId, effectiveFilters, allDeals, currency);
  };

  public query ({ caller }) func getPartnerRankings(
    quarterKey : Text
  ) : async [TTypes.ResellerQTDRanking] {
    if (not isVendorAdmin(caller)) return [];
    let vendorId = switch (callerVendorId(caller)) {
      case null { return [] };
      case (?vid) { vid };
    };
    // Gather reseller companies linked to this vendor
    let allDeals = DealsLib.getAllDealRegistrations(dealsState);
    let allAssignments = TargetsLib.getTargetAssignments(targetsState, vendorId, null, ?quarterKey);
    // Build (resellerId, resellerName) list from company state
    let resellerPairs : [(Text, Text)] = companyState.companies.values()
      .filter(func(c : CompanyTypes.CompanyProfile) : Bool {
        c.companyType == #Reseller and c.vendorId == ?vendorId and
          (switch (c.activationStatus) { case (#Active) true; case _ false })
      })
      .map<CompanyTypes.CompanyProfile, (Text, Text)>(func(c) { (c.id, c.companyName) })
      .toArray();
    TargetsLib.calculatePartnerRankings(
      targetsState, vendorId, quarterKey, resellerPairs, allDeals, allAssignments
    );
  };

  // Helper: empty metrics record when caller has no vendor context
  func emptyMetrics(filters : TTypes.QTDFilters) : TTypes.QTDMetrics {
    {
      resellerId                 = filters.resellerId;
      quarterKey                 = switch (filters.quarterKey) { case (?k) k; case null "" };
      renewalRevenue             = 0.0;
      newBusinessRevenue         = 0.0;
      pipelineCreated            = 0.0;
      pipelineClosed             = 0.0;
      dealRegistrationsSubmitted = 0;
      dealRegistrationsApproved  = 0;
      currency                   = switch (filters.currency) { case (?c) c; case null "USD" };
      calculatedAt               = Time.now();
    };
  };
};
