// Visibility rule domain logic — org-level config, cascade, lock management
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/visibility-rules";
import CFTypes "../types/custom-fields";

module {

  public type State = {
    orgConfigs : Map.Map<Text, Types.OrgVisibilityConfig>;
    // key: orgId
    rules      : Map.Map<Text, Types.VisibilityRule>;
    // key: ruleId
    ruleSeq    : { var next : Nat };
  };

  public func initState() : State = {
    orgConfigs = Map.empty<Text, Types.OrgVisibilityConfig>();
    rules      = Map.empty<Text, Types.VisibilityRule>();
    ruleSeq    = { var next = 1 };
  };

  // Get or initialise the visibility config for an org
  public func getOrgConfig(
    state : State,
    orgId : Text,
  ) : Types.OrgVisibilityConfig {
    switch (state.orgConfigs.get(orgId)) {
      case (?cfg) cfg;
      case null {
        // Default: inherit from vendor, no custom rules, not locked
        let defaults : Types.OrgVisibilityConfig = {
          orgId;
          defaultInheritFromVendor = true;
          customRules              = [];
          lockedByParent           = false;
          updatedAt                = 0;
        };
        state.orgConfigs.add(orgId, defaults);
        defaults;
      };
    };
  };

  // Update org-level visibility config
  public func updateOrgConfig(
    state : State,
    orgId : Text,
    input : Types.OrgVisibilityConfigInput,
    now   : Int,
  ) : Types.OrgVisibilityConfig {
    let existing = getOrgConfig(state, orgId);
    if (existing.lockedByParent) {
      // Locked by parent — only update non-locked fields if permitted; for now return as-is
      return existing;
    };
    let updated : Types.OrgVisibilityConfig = {
      existing with
      defaultInheritFromVendor = input.defaultInheritFromVendor;
      lockedByParent           = input.lockedByParent;
      updatedAt                = now;
    };
    state.orgConfigs.add(orgId, updated);
    updated;
  };

  // Create a visibility rule for an org
  public func createRule(
    state : State,
    orgId : Text,
    input : Types.VisibilityRuleInput,
    now   : Int,
  ) : Types.VisibilityRule {
    let seq = state.ruleSeq.next;
    state.ruleSeq.next += 1;
    let id = "vr-" # orgId # "-" # seq.toText();
    let rule : Types.VisibilityRule = {
      id;
      orgId;
      objectType = input.objectType;
      ruleType   = input.ruleType;
      conditions = input.conditions;
      isActive   = input.isActive;
      createdAt  = now;
      updatedAt  = now;
    };
    state.rules.add(id, rule);
    // Update the org config's customRules list
    let cfg = getOrgConfig(state, orgId);
    let newRules = List.fromArray<Types.VisibilityRule>(cfg.customRules);
    newRules.add(rule);
    state.orgConfigs.add(orgId, { cfg with customRules = newRules.toArray(); updatedAt = now });
    rule;
  };

  // Update an existing visibility rule
  public func updateRule(
    state : State,
    id    : Text,
    input : Types.VisibilityRuleInput,
    now   : Int,
  ) : ?Types.VisibilityRule {
    switch (state.rules.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.VisibilityRule = {
          existing with
          objectType = input.objectType;
          ruleType   = input.ruleType;
          conditions = input.conditions;
          isActive   = input.isActive;
          updatedAt  = now;
        };
        state.rules.add(id, updated);
        // Sync in org config customRules
        switch (state.orgConfigs.get(existing.orgId)) {
          case null {};
          case (?cfg) {
            let cfgRules = cfg.customRules.map(
              func (r) { if (r.id == id) { updated } else { r } }
            );
            state.orgConfigs.add(existing.orgId, { cfg with customRules = cfgRules; updatedAt = now });
          };
        };
        ?updated;
      };
    };
  };

  // Delete a visibility rule
  public func deleteRule(
    state : State,
    id    : Text,
  ) : Bool {
    switch (state.rules.get(id)) {
      case null false;
      case (?existing) {
        state.rules.remove(id);
        // Remove from org config customRules
        switch (state.orgConfigs.get(existing.orgId)) {
          case null {};
          case (?cfg) {
            let filtered = cfg.customRules.filter(func (r : Types.VisibilityRule) : Bool { r.id != id });
            state.orgConfigs.add(existing.orgId, { cfg with customRules = filtered });
          };
        };
        true;
      };
    };
  };

  // Evaluate whether a user/role/org combination can view a given object type
  // Default allow; #deny rules override; custom rules checked after default
  public func canView(
    state      : State,
    orgId      : Text,
    objectType : CFTypes.CustomFieldObjectType,
    role       : Text,
    region     : ?Text,
  ) : Bool {
    let cfg = switch (state.orgConfigs.get(orgId)) {
      case (?c) c;
      case null { return true }; // no config — default allow
    };
    if (cfg.defaultInheritFromVendor and cfg.customRules.size() == 0) {
      return true; // inheriting from vendor with no overrides — default allow
    };
    // Evaluate custom rules: if any matching #deny rule applies, deny access
    let activeRules = cfg.customRules.filter(func (r : Types.VisibilityRule) : Bool {
      r.isActive and r.objectType == objectType
    });
    let denied = activeRules.any(func (r : Types.VisibilityRule) : Bool {
      r.ruleType == #deny and conditionsMatch(r.conditions, role, region)
    });
    if (denied) { return false };
    // If there are #allow rules, at least one must match
    let allowRules = activeRules.filter(func (r : Types.VisibilityRule) : Bool { r.ruleType == #allow });
    if (allowRules.size() > 0) {
      return allowRules.any(func (r : Types.VisibilityRule) : Bool {
        conditionsMatch(r.conditions, role, region)
      });
    };
    true; // no applicable rules — default allow
  };

  // List all active/inactive rules for an org
  public func listRules(
    state  : State,
    orgId  : Text,
    active : Bool,
  ) : [Types.VisibilityRule] {
    state.rules.values().filter(func (r : Types.VisibilityRule) : Bool {
      r.orgId == orgId and (not active or r.isActive)
    }).toArray();
  };

  // ── Private helpers ──────────────────────────────────────────────────────────

  func conditionsMatch(
    conditions : [Types.VisibilityRuleCondition],
    role       : Text,
    region     : ?Text,
  ) : Bool {
    conditions.all(func (cond : Types.VisibilityRuleCondition) : Bool {
      let fieldValue : Text = switch (cond.conditionField) {
        case "role"   role;
        case "region" switch (region) { case (?r) r; case null "" };
        case _        "";
      };
      switch (cond.conditionOperator) {
        case (#equals)    fieldValue == cond.conditionValue;
        case (#notEquals) fieldValue != cond.conditionValue;
        case (#contains)  fieldValue.contains(#text (cond.conditionValue));
      };
    });
  };
};
