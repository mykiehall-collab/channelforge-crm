// Partner tier permission domain logic for CHANNELFORGE CRM
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/tiers";

module {
  public type State = {
    tierConfigs : Map.Map<Text, Types.TierConfig>;
    tierAssignments : Map.Map<Text, Types.TierAssignment>;
    tierOverrides : List.List<Types.TierOverride>;
  };

  func tierKey(tier : Types.PartnerTier) : Text {
    switch tier {
      case (#Silver) { "Silver" };
      case (#Gold) { "Gold" };
      case (#Platinum) { "Platinum" };
    };
  };

  // Default permissions for each tier if not configured
  func defaultPermissions(tier : Types.PartnerTier) : [Types.TierPermission] {
    switch tier {
      case (#Silver) {
        [#DealRegistrations, #PromotionsVisibility, #PipelineReporting]
      };
      case (#Gold) {
        [
          #DealRegistrations, #MDFRequests, #PromotionsVisibility, #PricingDiscounts,
          #ForecastVisibility, #CustomerAnalytics, #ExportPermissions,
          #PipelineReporting, #RenewalVisibilityDepth, #SecondaryAdminAccess,
        ]
      };
      case (#Platinum) {
        [
          #DealRegistrations, #MDFRequests, #PromotionsVisibility, #PricingDiscounts,
          #ForecastVisibility, #CustomerAnalytics, #ExportPermissions,
          #PipelineReporting, #AdvancedDashboards, #APIAccess,
          #RenewalVisibilityDepth, #AIRecommendations, #StrategicAccountInsights,
          #SecondaryAdminAccess,
        ]
      };
    };
  };

  func defaultMaxAdmins(tier : Types.PartnerTier) : Nat {
    switch tier {
      case (#Silver) { 2 };
      case (#Gold) { 5 };
      case (#Platinum) { 10 };
    };
  };

  public func initState() : State {
    {
      tierConfigs = Map.empty<Text, Types.TierConfig>();
      tierAssignments = Map.empty<Text, Types.TierAssignment>();
      tierOverrides = List.empty<Types.TierOverride>();
    };
  };

  public func getTierConfig(state : State, tier : Types.PartnerTier) : ?Types.TierConfig {
    state.tierConfigs.get(tierKey(tier));
  };

  public func updateTierPermissions(
    state : State,
    tier : Types.PartnerTier,
    permissions : [Types.TierPermission],
    maxAdmins : Nat,
    caller : Principal,
  ) : Bool {
    let config : Types.TierConfig = {
      tier;
      permissions;
      maxSecondaryAdmins = maxAdmins;
      updatedAt = Time.now();
      updatedBy = caller;
    };
    state.tierConfigs.add(tierKey(tier), config);
    true;
  };

  public func cloneTierPermissions(
    state : State,
    sourceTier : Types.PartnerTier,
    targetTier : Types.PartnerTier,
    caller : Principal,
  ) : Bool {
    let sourcePerms = switch (state.tierConfigs.get(tierKey(sourceTier))) {
      case (?cfg) { cfg.permissions };
      case null { defaultPermissions(sourceTier) };
    };
    let sourceMax = switch (state.tierConfigs.get(tierKey(sourceTier))) {
      case (?cfg) { cfg.maxSecondaryAdmins };
      case null { defaultMaxAdmins(sourceTier) };
    };
    updateTierPermissions(state, targetTier, sourcePerms, sourceMax, caller);
  };

  public func assignTierToReseller(
    state : State,
    resellerId : Text,
    tier : Types.PartnerTier,
    caller : Principal,
  ) : Bool {
    let assignment : Types.TierAssignment = {
      resellerId;
      tier;
      assignedAt = Time.now();
      assignedBy = caller;
    };
    state.tierAssignments.add(resellerId, assignment);
    true;
  };

  public func getResellerTier(state : State, resellerId : Text) : ?Types.TierAssignment {
    state.tierAssignments.get(resellerId);
  };

  public func addTierOverride(
    state : State,
    resellerId : Text,
    permission : Types.TierPermission,
    granted : Bool,
    reason : Text,
    caller : Principal,
  ) : Bool {
    let override : Types.TierOverride = {
      resellerId;
      permission;
      granted;
      reason;
      overriddenBy = caller;
      overriddenAt = Time.now();
    };
    state.tierOverrides.add(override);
    true;
  };

  // Effective permissions = tier base + overrides (overrides may add or remove)
  public func getEffectiveTierPermissions(
    state : State,
    resellerId : Text,
  ) : [Types.TierPermission] {
    // Get base permissions from assigned tier
    let basePerms : [Types.TierPermission] = switch (state.tierAssignments.get(resellerId)) {
      case null { [] };
      case (?assignment) {
        switch (state.tierConfigs.get(tierKey(assignment.tier))) {
          case (?cfg) { cfg.permissions };
          case null { defaultPermissions(assignment.tier) };
        };
      };
    };
    // Get overrides for this reseller (most-recent wins per permission)
    let overrides = state.tierOverrides.filter(func(o : Types.TierOverride) : Bool {
      o.resellerId == resellerId
    }).toArray();
    // Build a map of permission -> granted for the most recent override of each permission
    // Since overrides are appended in order, iterate forward and let later ones overwrite
    let overrideMap = Map.empty<Text, Bool>();
    for (o in overrides.values()) {
      overrideMap.add(permKey(o.permission), o.granted);
    };
    // Start from base, apply removals, then add grants
    let filtered = basePerms.filter(func(p : Types.TierPermission) : Bool {
      switch (overrideMap.get(permKey(p))) {
        case (?false) { false };  // override revokes this permission
        case (_) { true };        // keep base permission
      };
    });
    // Add granted overrides that aren't already in the base
    let granted = overrides.filter(func(o : Types.TierOverride) : Bool {
      if (not o.granted) { return false };
      filtered.find(func(p : Types.TierPermission) : Bool {
        permKey(p) == permKey(o.permission)
      }) == null
    }).map(func(o) { o.permission });
    filtered.concat(granted);
  };

  public func hasPermission(
    state : State,
    resellerId : Text,
    permission : Types.TierPermission,
  ) : Bool {
    let perms = getEffectiveTierPermissions(state, resellerId);
    let pk = permKey(permission);
    perms.find(func(p : Types.TierPermission) : Bool { permKey(p) == pk }) != null;
  };

  public func getAllTierConfigs(state : State) : [Types.TierConfig] {
    state.tierConfigs.values().toArray();
  };

  public func getOverridesForReseller(
    state : State,
    resellerId : Text,
  ) : [Types.TierOverride] {
    state.tierOverrides.filter(func(o : Types.TierOverride) : Bool {
      o.resellerId == resellerId
    }).toArray();
  };

  // Helper: permission -> Text key for map storage
  func permKey(p : Types.TierPermission) : Text {
    switch p {
      case (#DealRegistrations) { "DealRegistrations" };
      case (#MDFRequests) { "MDFRequests" };
      case (#PromotionsVisibility) { "PromotionsVisibility" };
      case (#PricingDiscounts) { "PricingDiscounts" };
      case (#ForecastVisibility) { "ForecastVisibility" };
      case (#CustomerAnalytics) { "CustomerAnalytics" };
      case (#ExportPermissions) { "ExportPermissions" };
      case (#PipelineReporting) { "PipelineReporting" };
      case (#AdvancedDashboards) { "AdvancedDashboards" };
      case (#APIAccess) { "APIAccess" };
      case (#RenewalVisibilityDepth) { "RenewalVisibilityDepth" };
      case (#AIRecommendations) { "AIRecommendations" };
      case (#StrategicAccountInsights) { "StrategicAccountInsights" };
      case (#SecondaryAdminAccess) { "SecondaryAdminAccess" };
    };
  };
};
