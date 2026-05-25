// Partner tier permission public API for CHANNELFORGE CRM
import Principal "mo:core/Principal";
import TiersLib "../lib/tiers";
import AlertsLib "../lib/alerts";
import Types "../types/tiers";

mixin (
  tiersState : TiersLib.State,
  alertsState : AlertsLib.State,
) {
  public query func getTierConfigs() : async [Types.TierConfig] {
    TiersLib.getAllTierConfigs(tiersState);
  };

  public shared ({ caller }) func updateTierPermissions(
    tier : Types.PartnerTier,
    permissions : [Types.TierPermission],
    maxSecondaryAdmins : Nat,
  ) : async Bool {
    let result = TiersLib.updateTierPermissions(tiersState, tier, permissions, maxSecondaryAdmins, caller);
    let tierName = switch tier { case (#Silver) { "Silver" }; case (#Gold) { "Gold" }; case (#Platinum) { "Platinum" } };
    AlertsLib.appendAuditEntry(
      alertsState,
      caller.toText(),
      "TIER_PERMISSION_CHANGE",
      "tier",
      tierName,
      "Updated permissions for " # tierName # " tier; maxAdmins=" # maxSecondaryAdmins.toText(),
    );
    result;
  };

  public shared ({ caller }) func cloneTierPermissions(
    sourceTier : Types.PartnerTier,
    targetTier : Types.PartnerTier,
  ) : async Bool {
    let result = TiersLib.cloneTierPermissions(tiersState, sourceTier, targetTier, caller);
    let srcName = switch sourceTier { case (#Silver) { "Silver" }; case (#Gold) { "Gold" }; case (#Platinum) { "Platinum" } };
    let tgtName = switch targetTier { case (#Silver) { "Silver" }; case (#Gold) { "Gold" }; case (#Platinum) { "Platinum" } };
    AlertsLib.appendAuditEntry(
      alertsState,
      caller.toText(),
      "TIER_PERMISSION_CHANGE",
      "tier",
      tgtName,
      "Cloned permissions from " # srcName # " to " # tgtName,
    );
    result;
  };

  public shared ({ caller }) func assignTierToReseller(
    resellerId : Text,
    tier : Types.PartnerTier,
  ) : async Bool {
    let result = TiersLib.assignTierToReseller(tiersState, resellerId, tier, caller);
    let tierName = switch tier { case (#Silver) { "Silver" }; case (#Gold) { "Gold" }; case (#Platinum) { "Platinum" } };
    AlertsLib.appendAuditEntry(
      alertsState,
      caller.toText(),
      "TIER_ASSIGNED",
      "reseller",
      resellerId,
      "Assigned tier " # tierName # " to reseller " # resellerId,
    );
    result;
  };

  public query func getResellerTier(resellerId : Text) : async ?Types.TierAssignment {
    TiersLib.getResellerTier(tiersState, resellerId);
  };

  public shared ({ caller }) func addTierOverride(
    resellerId : Text,
    permission : Types.TierPermission,
    granted : Bool,
    reason : Text,
  ) : async Bool {
    let result = TiersLib.addTierOverride(tiersState, resellerId, permission, granted, reason, caller);
    let action = if (granted) { "granted" } else { "revoked" };
    AlertsLib.appendAuditEntry(
      alertsState,
      caller.toText(),
      "TIER_OVERRIDE_ADDED",
      "reseller",
      resellerId,
      "Permission override " # action # " for reseller " # resellerId,
    );
    result;
  };

  public query func getEffectiveTierPermissions(resellerId : Text) : async [Types.TierPermission] {
    TiersLib.getEffectiveTierPermissions(tiersState, resellerId);
  };

  public query func getOverridesForReseller(resellerId : Text) : async [Types.TierOverride] {
    TiersLib.getOverridesForReseller(tiersState, resellerId);
  };
};
