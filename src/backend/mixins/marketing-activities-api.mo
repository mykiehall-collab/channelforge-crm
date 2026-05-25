// Public API mixin for Marketing Activity lifecycle management
import MarketingLib "../lib/marketing-activities";
import Types "../types/marketing-activities";
import Time "mo:core/Time";

mixin (marketingState : MarketingLib.State) {

    /// Create a new marketing activity
    public shared ({ caller }) func createMarketingActivity(
      input : Types.MarketingActivityInput
    ) : async Types.MarketingActivity {
      MarketingLib.createActivity(marketingState, caller.toText(), input, Time.now());
    };

    /// Update a marketing activity
    public shared ({ caller }) func updateMarketingActivity(
      id    : Text,
      input : Types.MarketingActivityUpdateInput,
    ) : async ?Types.MarketingActivity {
      MarketingLib.updateActivity(marketingState, id, input, Time.now());
    };

    /// Get a single marketing activity by id
    public query func getMarketingActivity(
      id : Text
    ) : async ?Types.MarketingActivity {
      MarketingLib.getActivity(marketingState, id);
    };

    /// List marketing activities with optional filters
    public query func listMarketingActivities(
      vendorId      : ?Text,
      resellerId    : ?Text,
      distributorId : ?Text,
      activityType  : ?Types.MarketingActivityType,
      status        : ?Types.MarketingActivityStatus,
    ) : async [Types.MarketingActivity] {
      MarketingLib.listActivities(marketingState, vendorId, resellerId, distributorId, activityType, status);
    };

    /// List marketing activities scoped by caller role
    public query func listMarketingActivitiesForCaller(
      vendorId    : ?Text,
      callerOrgId : Text,
      callerRole  : Text,
      fieldDefId  : ?Text,
      fieldValue  : ?Text,
    ) : async [Types.MarketingActivity] {
      let fieldFilter = switch (fieldDefId, fieldValue) {
        case (?fid, ?fval) ?{ fieldDefId = fid; value = fval };
        case _ null;
      };
      MarketingLib.listActivitiesForCaller(marketingState, vendorId, callerOrgId, callerRole, fieldFilter);
    };

    /// Record ROI for a completed marketing activity
    public shared ({ caller }) func recordMarketingActivityRoi(
      id  : Text,
      roi : Int,
    ) : async Bool {
      MarketingLib.recordRoi(marketingState, id, roi, Time.now());
    };
};
