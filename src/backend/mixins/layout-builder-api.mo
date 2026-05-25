import LayoutBuilderLib "../lib/layout-builder";
import T "../types/layout-builder";
import DW "../types/dashboard-widgets";
import Gov "../types/layout-governance";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

mixin (layoutBuilderState : LayoutBuilderLib.State) {

  public shared({ caller }) func saveAccountLayout(layout : T.AccountLayout) : async { #ok : Text; #err : Text } {
    let perms = LayoutBuilderLib.getPermissions(layoutBuilderState, caller.toText());
    let allowed = switch perms { case null false; case (?p) p.canManageLayouts };
    if (not allowed) return #err("Requires canManageLayouts permission");
    let result = LayoutBuilderLib.saveLayout(layoutBuilderState, layout);
    switch result {
      case (#ok id) {
        LayoutBuilderLib.addAuditEntry(layoutBuilderState, {
          id = Time.now().toText();
          action = "saveLayout";
          entityType = "AccountLayout";
          entityId = id;
          performedBy = caller.toText();
          timestamp = Time.now();
          beforeState = null;
          afterState = ?layout.name;
        });
      };
      case (#err _) {};
    };
    result
  };

  public shared query func getAccountLayouts() : async [T.AccountLayout] {
    LayoutBuilderLib.getLayouts(layoutBuilderState)
  };

  public shared query func getLayoutForUser(orgType : Text, department : Text, role : Text) : async ?T.AccountLayout {
    LayoutBuilderLib.getLayoutForUser(layoutBuilderState, orgType, department, role)
  };

  public shared({ caller }) func deleteAccountLayout(layoutId : Text) : async { #ok : (); #err : Text } {
    let perms = LayoutBuilderLib.getPermissions(layoutBuilderState, caller.toText());
    let allowed = switch perms { case null false; case (?p) p.canManageLayouts };
    if (not allowed) return #err("Requires canManageLayouts permission");
    LayoutBuilderLib.deleteLayout(layoutBuilderState, layoutId)
  };

  public shared({ caller }) func saveDashboardLayout(layout : DW.DashboardLayout) : async { #ok : Text; #err : Text } {
    let perms = LayoutBuilderLib.getPermissions(layoutBuilderState, caller.toText());
    let allowed = switch perms { case null false; case (?p) p.canManageWidgets };
    if (not allowed) return #err("Requires canManageWidgets permission");
    LayoutBuilderLib.saveDashboardLayout(layoutBuilderState, layout)
  };

  public shared query func getDashboardLayouts() : async [DW.DashboardLayout] {
    LayoutBuilderLib.getDashboardLayouts(layoutBuilderState)
  };

  public shared query func getDashboardTemplates() : async [DW.DashboardLayout] {
    LayoutBuilderLib.getDashboardTemplates(layoutBuilderState)
  };

  public shared({ caller }) func cloneDashboardLayout(layoutId : Text, newName : Text) : async { #ok : Text; #err : Text } {
    let perms = LayoutBuilderLib.getPermissions(layoutBuilderState, caller.toText());
    let allowed = switch perms { case null false; case (?p) p.canManageDashboardTemplates };
    if (not allowed) return #err("Requires canManageDashboardTemplates permission");
    LayoutBuilderLib.cloneDashboard(layoutBuilderState, layoutId, newName, caller.toText())
  };

  public shared({ caller }) func updateLayoutPermissions(userId : Text, perms : Gov.LayoutPermissions) : async { #ok : (); #err : Text } {
    let callerPerms = LayoutBuilderLib.getPermissions(layoutBuilderState, caller.toText());
    let allowed = switch callerPerms { case null false; case (?p) p.canManageLayouts };
    if (not allowed) return #err("Requires canManageLayouts permission");
    LayoutBuilderLib.updatePermissions(layoutBuilderState, userId, perms)
  };

  public shared query func getLayoutPermissions(userId : Text) : async ?Gov.LayoutPermissions {
    LayoutBuilderLib.getPermissions(layoutBuilderState, userId)
  };

  public shared query func getLayoutAuditLog() : async [Gov.LayoutAuditEntry] {
    LayoutBuilderLib.getAuditLog(layoutBuilderState)
  };

  public shared({ caller }) func saveVisibilityRule(rule : T.VisibilityRule) : async { #ok : Text; #err : Text } {
    let perms = LayoutBuilderLib.getPermissions(layoutBuilderState, caller.toText());
    let allowed = switch perms { case null false; case (?p) p.canManageLayouts };
    if (not allowed) return #err("Requires canManageLayouts permission");
    LayoutBuilderLib.saveVisibilityRule(layoutBuilderState, rule, rule.targetId)
  };

  public shared query func getVisibilityRulesForLayout(layoutId : Text) : async [T.VisibilityRule] {
    LayoutBuilderLib.getVisibilityRules(layoutBuilderState, layoutId)
  };
}
