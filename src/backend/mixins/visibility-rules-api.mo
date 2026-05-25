// Public API mixin for org-level visibility rule management
import VisibilityLib "../lib/visibility-rules";
import Types "../types/visibility-rules";
import CFTypes "../types/custom-fields";
import Time "mo:core/Time";

mixin (visibilityState : VisibilityLib.State) {

    /// Get the visibility configuration for an org
    public query func getOrgVisibilityConfig(
      orgId : Text
    ) : async Types.OrgVisibilityConfig {
      VisibilityLib.getOrgConfig(visibilityState, orgId);
    };

    /// Update the visibility configuration for an org
    public shared ({ caller }) func updateOrgVisibilityConfig(
      orgId : Text,
      input : Types.OrgVisibilityConfigInput,
    ) : async Types.OrgVisibilityConfig {
      VisibilityLib.updateOrgConfig(visibilityState, orgId, input, Time.now());
    };

    /// Create a visibility rule for an org
    public shared ({ caller }) func createVisibilityRule(
      orgId : Text,
      input : Types.VisibilityRuleInput,
    ) : async Types.VisibilityRule {
      VisibilityLib.createRule(visibilityState, orgId, input, Time.now());
    };

    /// Update an existing visibility rule
    public shared ({ caller }) func updateVisibilityRule(
      id    : Text,
      input : Types.VisibilityRuleInput,
    ) : async ?Types.VisibilityRule {
      VisibilityLib.updateRule(visibilityState, id, input, Time.now());
    };

    /// Delete a visibility rule
    public shared ({ caller }) func deleteVisibilityRule(
      id : Text
    ) : async Bool {
      VisibilityLib.deleteRule(visibilityState, id);
    };

    /// List all active rules for an org (optionally including inactive)
    public query func listVisibilityRules(
      orgId      : Text,
      activeOnly : Bool,
    ) : async [Types.VisibilityRule] {
      VisibilityLib.listRules(visibilityState, orgId, activeOnly);
    };

    /// Evaluate whether a given role/region combination can view an object type
    public query func checkVisibility(
      orgId      : Text,
      objectType : CFTypes.CustomFieldObjectType,
      role       : Text,
      region     : ?Text,
    ) : async Bool {
      VisibilityLib.canView(visibilityState, orgId, objectType, role, region);
    };
};
