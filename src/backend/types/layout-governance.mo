module {
  public type LayoutPermissions = {
    canManageLayouts : Bool;
    canManageWidgets : Bool;
    canManageDashboardTemplates : Bool;
    canManageCustomFields : Bool;
  };

  public type LayoutAuditEntry = {
    id : Text;
    action : Text;
    entityType : Text;
    entityId : Text;
    performedBy : Text;
    timestamp : Int;
    beforeState : ?Text;
    afterState : ?Text;
  };
}
