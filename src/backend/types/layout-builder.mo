module {
  public type LayoutId = Text;

  public type FieldType = {
    #Text_;
    #LongText;
    #Number_;
    #Currency;
    #Percentage;
    #Dropdown;
    #MultiSelect;
    #Date_;
    #DateTime_;
    #Checkbox;
    #Url;
    #Email_;
    #Phone;
    #Attachment;
    #Tag;
    #RegionSelector;
    #UserSelector;
    #OrgSelector;
  };

  public type LayoutField = {
    id : Text;
    fieldLabel : Text;
    fieldType : FieldType;
    required : Bool;
    visible : Bool;
    sortOrder : Nat;
    sectionId : ?Text;
    defaultValue : ?Text;
    options : [Text];
  };

  public type LayoutSection = {
    id : Text;
    title : Text;
    sortOrder : Nat;
    collapsible : Bool;
    fieldIds : [Text];
  };

  public type VisibilityConditionType = {
    #ByRole;
    #ByDepartment;
    #ByOrgType;
    #ByAccountType;
    #ByTerritory;
    #ByMarketSegment;
  };

  public type VisibilityCondition = {
    conditionType : VisibilityConditionType;
    value : Text;
  };

  public type VisibilityOperator = {
    #And_;
    #Or_;
  };

  public type VisibilityRuleAction = {
    #Show_;
    #Hide_;
  };

  public type VisibilityTargetType = {
    #Field_;
    #Section_;
    #Tab_;
  };

  public type VisibilityRule = {
    id : Text;
    targetId : Text;
    targetType : VisibilityTargetType;
    conditions : [VisibilityCondition];
    operator : VisibilityOperator;
    action : VisibilityRuleAction;
  };

  public type AccountTab = {
    id : Text;
    tabLabel : Text;
    sortOrder : Nat;
    hiddenForRoles : [Text];
    hiddenForDepts : [Text];
    isCustom : Bool;
    isVisible : Bool;
  };

  public type AccountLayout = {
    id : LayoutId;
    name : Text;
    description : Text;
    sections : [LayoutSection];
    fields : [LayoutField];
    tabs : [AccountTab];
    visibilityRules : [VisibilityRule];
    isDefault : Bool;
    createdBy : Text;
    createdAt : Int;
    updatedAt : Int;
    version : Nat;
  };

  public type LayoutAssignment = {
    layoutId : LayoutId;
    orgType : ?Text;
    department : ?Text;
    role : ?Text;
    territory : ?Text;
    marketSegment : ?Text;
    priority : Nat;
  };
}
