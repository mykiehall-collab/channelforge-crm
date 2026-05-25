// Public API mixin for Opportunity pipeline management
import OpportunitiesLib "../lib/opportunities";
import Types "../types/opportunities";
import Time "mo:core/Time";

mixin (opportunitiesState : OpportunitiesLib.State) {

    /// Create a new opportunity
    public shared ({ caller }) func createOpportunity(
      input : Types.OpportunityInput
    ) : async Types.Opportunity {
      OpportunitiesLib.createOpportunity(opportunitiesState, input, caller.toText(), Time.now());
    };

    /// Update an existing opportunity
    public shared ({ caller }) func updateOpportunity(
      id    : Text,
      input : Types.OpportunityUpdateInput,
    ) : async ?Types.Opportunity {
      OpportunitiesLib.updateOpportunity(opportunitiesState, id, input, Time.now());
    };

    /// Get a single opportunity by id
    public query func getOpportunity(
      id : Text
    ) : async ?Types.Opportunity {
      OpportunitiesLib.getOpportunity(opportunitiesState, id);
    };

    /// List opportunities with optional filters
    public query func listOpportunities(
      vendorId      : ?Text,
      resellerId    : ?Text,
      distributorId : ?Text,
      accountId     : ?Text,
      stage         : ?Types.OpportunityStage,
      activeOnly    : Bool,
    ) : async [Types.Opportunity] {
      OpportunitiesLib.listOpportunities(opportunitiesState, vendorId, resellerId, distributorId, accountId, stage, activeOnly);
    };

    /// List opportunities scoped by caller role (Vendor / Distributor / Reseller)
    public query func listOpportunitiesForCaller(
      vendorId      : ?Text,
      callerOrgId   : Text,
      callerRole    : Text,
      fieldDefId    : ?Text,
      fieldValue    : ?Text,
    ) : async [Types.Opportunity] {
      let fieldFilter = switch (fieldDefId, fieldValue) {
        case (?fid, ?fval) ?{ fieldDefId = fid; value = fval };
        case _ null;
      };
      OpportunitiesLib.listOpportunitiesForCaller(opportunitiesState, vendorId, callerOrgId, callerRole, fieldFilter);
    };

    /// Archive an opportunity
    public shared ({ caller }) func archiveOpportunity(
      id : Text
    ) : async Bool {
      OpportunitiesLib.archiveOpportunity(opportunitiesState, id, Time.now());
    };
};
