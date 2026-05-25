import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/deals";

module {
  public type State = {
    deals : Map.Map<Text, Types.DealRegistration>;
    duplicateDRs : Map.Map<Text, Types.DuplicateDRRecord>;
    idCounter : { var value : Nat };
  };

  public func initState() : State {
    {
      deals = Map.empty<Text, Types.DealRegistration>();
      duplicateDRs = Map.empty<Text, Types.DuplicateDRRecord>();
      idCounter = { var value = 0 };
    };
  };

  func statusText(status : Types.DealStatus) : Text {
    switch (status) {
      case (#Draft) { "Draft" };
      case (#Submitted) { "Submitted" };
      case (#UnderReview) { "UnderReview" };
      case (#Approved) { "Approved" };
      case (#Rejected) { "Rejected" };
      case (#Expired) { "Expired" };
      case (#Won) { "Won" };
      case (#Lost) { "Lost" };
    };
  };

  public func createDealRegistration(
    state : State,
    caller : Principal,
    input : Types.DealRegistrationInput,
  ) : CommonTypes.Result<Types.DealRegistration, Text> {
    state.idCounter.value += 1;
    let now = Time.now();
    let id = "deal-" # state.idCounter.value.toText();
    let deal : Types.DealRegistration = {
      id;
      accountId = input.accountId;
      customerDomain = input.customerDomain;
      resellerId = input.resellerId;
      vendorOwnerId = input.vendorOwnerId;
      opportunityName = input.opportunityName;
      product = input.product;
      estimatedValue = input.estimatedValue;
      quantity = input.quantity;
      closeDate = input.closeDate;
      dealStage = input.dealStage;
      competitor = input.competitor;
      notes = input.notes;
      status = #Draft;
      submittedBy = caller.toText();
      submittedDate = null;
      createdAt = now;
      updatedAt = now;
    };
    state.deals.add(id, deal);
    #ok(deal);
  };

  public func getDealRegistration(
    state : State,
    id : Text,
  ) : ?Types.DealRegistration {
    state.deals.get(id);
  };

  public func updateDealRegistration(
    state : State,
    caller : Principal,
    id : Text,
    input : Types.DealRegistrationInput,
  ) : CommonTypes.Result<Types.DealRegistration, Text> {
    switch (state.deals.get(id)) {
      case null { #err("Deal registration not found") };
      case (?existing) {
        let updated : Types.DealRegistration = {
          existing with
          accountId = input.accountId;
          customerDomain = input.customerDomain;
          resellerId = input.resellerId;
          vendorOwnerId = input.vendorOwnerId;
          opportunityName = input.opportunityName;
          product = input.product;
          estimatedValue = input.estimatedValue;
          quantity = input.quantity;
          closeDate = input.closeDate;
          dealStage = input.dealStage;
          competitor = input.competitor;
          notes = input.notes;
          status = input.status;
          submittedBy = input.submittedBy;
          submittedDate = input.submittedDate;
          updatedAt = Time.now();
        };
        state.deals.add(id, updated);
        #ok(updated);
      };
    };
  };

  // Duplicate DR detection: ONLY same product + same accountId triggers a duplicate flag.
  // Different products on the same account are NOT flagged.
  public func checkDuplicateDR(
    state : State,
    product : Text,
    accountId : Text,
    resellerId : Text,
  ) : ?Types.DealRegistration {
    state.deals.values().find(func(d : Types.DealRegistration) : Bool {
      d.product == product and d.accountId == accountId and
        (switch (d.status) { case (#Approved) { true }; case (_) { false } })
    });
  };

  public func createDuplicateDRRecord(
    state : State,
    newDRId : Text,
    existingDRId : Text,
    product : Text,
    accountId : Text,
    resellerId : Text,
    existingResellerId : Text,
  ) : Types.DuplicateDRRecord {
    state.idCounter.value += 1;
    let id = "dupdr-" # state.idCounter.value.toText();
    let record : Types.DuplicateDRRecord = {
      id;
      newDRId;
      existingDRId;
      product;
      accountId;
      resellerId;
      existingResellerId;
      status = #PendingVendorReview;
      reviewAction = null;
      reviewNote = null;
      reviewedBy = null;
      reviewedAt = null;
      submittedAt = Time.now();
    };
    state.duplicateDRs.add(id, record);
    record;
  };

  public func getDuplicateDRsForVendor(state : State) : [Types.DuplicateDRRecord] {
    state.duplicateDRs.values().toArray();
  };

  public func getDuplicateDRByNewDRId(
    state : State,
    newDRId : Text,
  ) : ?Types.DuplicateDRRecord {
    state.duplicateDRs.values().find(func(r : Types.DuplicateDRRecord) : Bool {
      r.newDRId == newDRId
    });
  };

  // Review a duplicate DR: valid actions are Approved/Rejected/Merged/Reassigned/Escalated
  public func reviewDuplicateDR(
    state : State,
    id : Text,
    action : Types.DuplicateDRStatus,
    note : Text,
    caller : Principal,
  ) : CommonTypes.Result<(), Text> {
    switch (state.duplicateDRs.get(id)) {
      case null { #err("Duplicate DR record not found") };
      case (?record) {
        let now = Time.now();
        let actionText = switch action {
          case (#Approved) { "Approved" };
          case (#Rejected) { "Rejected" };
          case (#Merged) { "Merged" };
          case (#Reassigned) { "Reassigned" };
          case (#Escalated) { "Escalated" };
          case (#PendingVendorReview) { "PendingVendorReview" };
        };
        let updated : Types.DuplicateDRRecord = {
          record with
          status = action;
          reviewAction = ?actionText;
          reviewNote = ?note;
          reviewedBy = ?caller;
          reviewedAt = ?now;
        };
        state.duplicateDRs.add(id, updated);
        // Side effects on the referenced DealRegistration records
        switch action {
          case (#Approved) {
            ignore updateDealStatus(state, caller, record.newDRId, #Approved);
          };
          case (#Rejected) {
            ignore updateDealStatus(state, caller, record.newDRId, #Rejected);
          };
          case (#Merged) {
            // Mark new DR as Rejected; existing DR stays unchanged (merged)
            ignore updateDealStatus(state, caller, record.newDRId, #Rejected);
          };
          case (#Reassigned) {
            // Reassign ownership of existing DR to new reseller
            switch (state.deals.get(record.existingDRId)) {
              case null {};
              case (?existingDeal) {
                state.deals.add(record.existingDRId, {
                  existingDeal with
                  resellerId = record.resellerId;
                  updatedAt = now;
                });
              };
            };
          };
          case (_) {};
        };
        #ok(());
      };
    };
  };

  public func deleteDealRegistration(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.deals.get(id)) {
      case null { #err("Deal registration not found") };
      case (?_) {
        state.deals.remove(id);
        #ok(());
      };
    };
  };

  public func getAllDealRegistrations(state : State) : [Types.DealRegistration] {
    state.deals.values().toArray();
  };

  public func getDealRegistrationsByReseller(
    state : State,
    resellerId : Text,
  ) : [Types.DealRegistration] {
    state.deals.values().filter(func(d) { d.resellerId == resellerId }).toArray();
  };

  public func updateDealStatus(
    state : State,
    caller : Principal,
    id : Text,
    status : Types.DealStatus,
  ) : CommonTypes.Result<Types.DealRegistration, Text> {
    switch (state.deals.get(id)) {
      case null { #err("Deal registration not found") };
      case (?existing) {
        let now = Time.now();
        let submittedDate = switch (status) {
          case (#Submitted) { ?now };
          case (_) { existing.submittedDate };
        };
        let updated : Types.DealRegistration = {
          existing with
          status;
          submittedDate;
          updatedAt = now;
        };
        state.deals.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func getPipelineReport(
    state : State,
    filters : CommonTypes.ReportFilters,
  ) : [Types.DealRegistration] {
    state.deals.values().filter(func(d) {
      let matchStart = switch (filters.startDate) {
        case null { true };
        case (?sd) { d.closeDate >= sd };
      };
      let matchEnd = switch (filters.endDate) {
        case null { true };
        case (?ed) { d.closeDate <= ed };
      };
      let matchPartner = switch (filters.resellerId) {
        case null { true };
        case (?pid) { d.resellerId == pid };
      };
      let matchStatus = switch (filters.status) {
        case null { true };
        case (?s) { statusText(d.status) == s };
      };
      matchStart and matchEnd and matchPartner and matchStatus
    }).toArray();
  };

  public func getDealRegistrationReport(
    state : State,
    filters : CommonTypes.ReportFilters,
  ) : [Types.DealRegistration] {
    getPipelineReport(state, filters);
  };
};
