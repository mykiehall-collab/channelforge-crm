// Opportunity domain logic — pipeline management, stage tracking, custom fields
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/opportunities";

module {

  public type State = {
    opportunities : Map.Map<Text, Types.Opportunity>;
    state         : { var nextSeq : Nat };
  };

  public func initState() : State = {
    opportunities = Map.empty<Text, Types.Opportunity>();
    state         = { var nextSeq = 1 };
  };

  // Create a new opportunity
  public func createOpportunity(
    state       : State,
    input       : Types.OpportunityInput,
    ownerUserId : Text,
    now         : Int,
  ) : Types.Opportunity {
    let seq = state.state.nextSeq;
    state.state.nextSeq += 1;
    let id = "opp-" # input.vendorOwnerId # "-" # seq.toText();
    let opp : Types.Opportunity = {
      id;
      opportunityName   = input.opportunityName;
      revenueEstimate   = input.revenueEstimate;
      stage             = input.stage;
      closeDate         = input.closeDate;
      ownerUserId;
      customerAccountId = input.customerAccountId;
      associatedDealIds = input.associatedDealIds;
      vendorOwnerId     = input.vendorOwnerId;
      distributorId     = input.distributorId;
      resellerId        = input.resellerId;
      status            = #active;
      customFieldValues = [];
      createdAt         = now;
      updatedAt         = now;
    };
    state.opportunities.add(id, opp);
    opp;
  };

  // Update an existing opportunity
  public func updateOpportunity(
    state  : State,
    id     : Text,
    input  : Types.OpportunityUpdateInput,
    now    : Int,
  ) : ?Types.Opportunity {
    switch (state.opportunities.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Opportunity = {
          existing with
          opportunityName   = switch (input.opportunityName)   { case (?v) v; case null existing.opportunityName };
          revenueEstimate   = switch (input.revenueEstimate)   { case (?v) v; case null existing.revenueEstimate };
          stage             = switch (input.stage)             { case (?v) v; case null existing.stage };
          closeDate         = switch (input.closeDate)         { case (?v) v; case null existing.closeDate };
          customerAccountId = switch (input.customerAccountId) { case (?v) ?v; case null existing.customerAccountId };
          associatedDealIds = switch (input.associatedDealIds) { case (?v) v; case null existing.associatedDealIds };
          distributorId     = switch (input.distributorId)     { case (?v) ?v; case null existing.distributorId };
          resellerId        = switch (input.resellerId)        { case (?v) ?v; case null existing.resellerId };
          status            = switch (input.status)            { case (?v) v; case null existing.status };
          updatedAt         = now;
        };
        state.opportunities.add(id, updated);
        ?updated;
      };
    };
  };

  // Get a single opportunity by id
  public func getOpportunity(
    state : State,
    id    : Text,
  ) : ?Types.Opportunity {
    state.opportunities.get(id);
  };

  // List opportunities with role-scoped visibility
  // Vendor sees all within their namespace; Distributor sees own org; Reseller sees their accounts
  public func listOpportunitiesForCaller(
    state         : State,
    vendorId      : ?Text,
    callerOrgId   : Text,
    callerRole    : Text,    // "vendor", "distributor", "reseller"
    fieldFilter   : ?{ fieldDefId : Text; value : Text },
  ) : [Types.Opportunity] {
    state.opportunities.values().filter(func (o : Types.Opportunity) : Bool {
      let scopeOk = switch (callerRole) {
        case "vendor" {
          switch (vendorId) {
            case (?vid) o.vendorOwnerId == vid;
            case null true;
          };
        };
        case "distributor" {
          o.distributorId == ?callerOrgId and
          (switch (vendorId) { case (?vid) o.vendorOwnerId == vid; case null true });
        };
        case "reseller" {
          o.resellerId == ?callerOrgId and
          (switch (vendorId) { case (?vid) o.vendorOwnerId == vid; case null true });
        };
        case _ false;
      };
      if (not scopeOk) { return false };
      // Custom field value filter
      switch (fieldFilter) {
        case null true;
        case (?ff) {
          o.customFieldValues.find(func (cfv : Types.CustomFieldValueRef) : Bool {
            cfv.fieldDefId == ff.fieldDefId and cfv.value == ff.value
          }) != null;
        };
      };
    }).toArray();
  };

  // List opportunities with basic optional filters
  public func listOpportunities(
    state         : State,
    vendorId      : ?Text,
    resellerId    : ?Text,
    distributorId : ?Text,
    accountId     : ?Text,
    stage         : ?Types.OpportunityStage,
    activeOnly    : Bool,
  ) : [Types.Opportunity] {
    state.opportunities.values().filter(func (o : Types.Opportunity) : Bool {
      (switch (vendorId)      { case (?v) o.vendorOwnerId == v;        case null true }) and
      (switch (resellerId)    { case (?v) o.resellerId == ?v;          case null true }) and
      (switch (distributorId) { case (?v) o.distributorId == ?v;      case null true }) and
      (switch (accountId)     { case (?v) o.customerAccountId == ?v;  case null true }) and
      (switch (stage)         { case (?v) o.stage == v;               case null true }) and
      (if (activeOnly) { o.status == #active } else { true });
    }).toArray();
  };

  // Set custom field values on an opportunity
  public func setCustomFieldValues(
    state  : State,
    id     : Text,
    values : [Types.CustomFieldValueRef],
    now    : Int,
  ) : Bool {
    switch (state.opportunities.get(id)) {
      case null false;
      case (?existing) {
        // Merge: replace existing values for matching fieldDefIds, append new
        var merged = List.fromArray<Types.CustomFieldValueRef>(existing.customFieldValues);
        for (v in values.values()) {
          let idx = merged.findIndex(func (c : Types.CustomFieldValueRef) : Bool { c.fieldDefId == v.fieldDefId });
          switch (idx) {
            case null { merged.add(v) };
            case (?i) { merged.put(i, v) };
          };
        };
        state.opportunities.add(id, { existing with customFieldValues = merged.toArray(); updatedAt = now });
        true;
      };
    };
  };

  // Archive an opportunity
  public func archiveOpportunity(
    state : State,
    id    : Text,
    now   : Int,
  ) : Bool {
    switch (state.opportunities.get(id)) {
      case null false;
      case (?existing) {
        state.opportunities.add(id, { existing with status = #archived; updatedAt = now });
        true;
      };
    };
  };
};
