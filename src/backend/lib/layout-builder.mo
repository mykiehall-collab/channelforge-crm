import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";

import T "../types/layout-builder";
import DW "../types/dashboard-widgets";
import Gov "../types/layout-governance";
import Iter "mo:core/Iter";

module {
  public type State = {
    layouts : Map.Map<Text, T.AccountLayout>;
    dashboardLayouts : Map.Map<Text, DW.DashboardLayout>;
    assignments : List.List<T.LayoutAssignment>;
    visibilityRules : Map.Map<Text, List.List<T.VisibilityRule>>;
    permissions : Map.Map<Text, Gov.LayoutPermissions>;
    auditLog : List.List<Gov.LayoutAuditEntry>;
  };

  public func initState() : State {
    let s : State = {
      layouts = Map.empty<Text, T.AccountLayout>();
      dashboardLayouts = Map.empty<Text, DW.DashboardLayout>();
      assignments = List.empty<T.LayoutAssignment>();
      visibilityRules = Map.empty<Text, List.List<T.VisibilityRule>>();
      permissions = Map.empty<Text, Gov.LayoutPermissions>();
      auditLog = List.empty<Gov.LayoutAuditEntry>();
    };
    seedDefaultLayouts(s);
    s
  };

  func makeDefaultLayout(id : Text, name : Text, isDefault : Bool) : T.AccountLayout {
    {
      id = id;
      name = name;
      description = "CHANNELFORGE " # name;
      sections = [];
      fields = [];
      tabs = [];
      visibilityRules = [];
      isDefault = isDefault;
      createdBy = "system";
      createdAt = Time.now();
      updatedAt = Time.now();
      version = 1;
    }
  };

  func makeDefaultDashboard(id : Text, name : Text) : DW.DashboardLayout {
    {
      id = id;
      name = name;
      description = "CHANNELFORGE " # name;
      widgets = [];
      isTemplate = true;
      templateType = null;
      assignedTo = [];
      createdBy = "system";
      createdAt = Time.now();
      updatedAt = Time.now();
    }
  };

  func seedDefaultLayouts(state : State) {
    state.layouts.add("layout-default", makeDefaultLayout("layout-default", "Default Layout", true));
    state.layouts.add("layout-sales", makeDefaultLayout("layout-sales", "Sales Team Layout", false));
    state.layouts.add("layout-marketing", makeDefaultLayout("layout-marketing", "Marketing Layout", false));
    state.layouts.add("layout-leadership", makeDefaultLayout("layout-leadership", "Leadership Layout", false));
    state.layouts.add("layout-ops", makeDefaultLayout("layout-ops", "Operations Layout", false));

    state.dashboardLayouts.add("tpl-executive", makeDefaultDashboard("tpl-executive", "Executive Dashboard"));
    state.dashboardLayouts.add("tpl-sales", makeDefaultDashboard("tpl-sales", "Sales Dashboard"));
    state.dashboardLayouts.add("tpl-marketing", makeDefaultDashboard("tpl-marketing", "Marketing Dashboard"));
    state.dashboardLayouts.add("tpl-ops", makeDefaultDashboard("tpl-ops", "Operations Dashboard"));
    state.dashboardLayouts.add("tpl-it", makeDefaultDashboard("tpl-it", "IT Dashboard"));
  };

  public func saveLayout(state : State, layout : T.AccountLayout) : { #ok : Text; #err : Text } {
    state.layouts.add(layout.id, layout);
    #ok(layout.id)
  };

  public func getLayouts(state : State) : [T.AccountLayout] {
    let iter = state.layouts.values();
    iter.toArray()
  };

  public func getLayoutForUser(state : State, _orgType : Text, _dept : Text, _role : Text) : ?T.AccountLayout {
    // Find the default layout by iterating entries
    for ((_, layout) in state.layouts.entries()) {
      if (layout.isDefault) return ?layout;
    };
    // Fall back to first entry if no default found
    switch (state.layouts.entries().next()) {
      case (?(_, first)) ?first;
      case null null;
    }
  };

  public func deleteLayout(state : State, layoutId : Text) : { #ok : (); #err : Text } {
    if (not state.layouts.containsKey(layoutId)) {
      return #err("Layout not found");
    };
    state.layouts.remove(layoutId);
    #ok(())
  };

  public func saveVisibilityRule(state : State, rule : T.VisibilityRule, layoutId : Text) : { #ok : Text; #err : Text } {
    let existing = switch (state.visibilityRules.get(layoutId)) {
      case null List.empty<T.VisibilityRule>();
      case (?list) list;
    };
    existing.add(rule);
    state.visibilityRules.add(layoutId, existing);
    #ok(rule.id)
  };

  public func getVisibilityRules(state : State, layoutId : Text) : [T.VisibilityRule] {
    switch (state.visibilityRules.get(layoutId)) {
      case null [];
      case (?list) list.toArray();
    }
  };

  public func saveDashboardLayout(state : State, layout : DW.DashboardLayout) : { #ok : Text; #err : Text } {
    state.dashboardLayouts.add(layout.id, layout);
    #ok(layout.id)
  };

  public func getDashboardLayouts(state : State) : [DW.DashboardLayout] {
    let iter = state.dashboardLayouts.values();
    iter.toArray()
  };

  public func getDashboardTemplates(state : State) : [DW.DashboardLayout] {
    let all = state.dashboardLayouts.values().toArray();
    all.filter<DW.DashboardLayout>(func(d) { d.isTemplate })
  };

  public func cloneDashboard(state : State, layoutId : Text, newName : Text, creator : Text) : { #ok : Text; #err : Text } {
    switch (state.dashboardLayouts.get(layoutId)) {
      case null { #err("Dashboard not found") };
      case (?original) {
        let newId = layoutId # "-clone-" # Time.now().toText();
        let cloned : DW.DashboardLayout = {
          id = newId;
          name = newName;
          description = original.description;
          widgets = original.widgets;
          isTemplate = false;
          templateType = original.templateType;
          assignedTo = [];
          createdBy = creator;
          createdAt = Time.now();
          updatedAt = Time.now();
        };
        state.dashboardLayouts.add(newId, cloned);
        #ok(newId)
      };
    }
  };

  public func updatePermissions(state : State, userId : Text, perms : Gov.LayoutPermissions) : { #ok : (); #err : Text } {
    state.permissions.add(userId, perms);
    #ok(())
  };

  public func getPermissions(state : State, userId : Text) : ?Gov.LayoutPermissions {
    state.permissions.get(userId)
  };

  public func getAuditLog(state : State) : [Gov.LayoutAuditEntry] {
    state.auditLog.toArray()
  };

  public func addAuditEntry(state : State, entry : Gov.LayoutAuditEntry) {
    state.auditLog.add(entry);
  };
}
