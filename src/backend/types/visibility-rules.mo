// Visibility rule configuration for custom fields and account access governance
import CustomFieldsTypes "custom-fields";

module {

  // Operators for visibility rule conditions
  public type ConditionOperator = {
    #equals;
    #notEquals;
    #contains;
  };

  // A single condition that must be matched for a visibility rule to apply
  public type VisibilityRuleCondition = {
    conditionField    : Text;             // e.g. "role", "org", "region"
    conditionOperator : ConditionOperator;
    conditionValue    : Text;
  };

  // Whether the rule allows or denies visibility
  public type VisibilityRuleType = { #allow; #deny };

  // A named visibility rule tied to an org and object type
  public type VisibilityRule = {
    id         : Text;
    orgId      : Text;
    objectType : CustomFieldsTypes.CustomFieldObjectType;
    ruleType   : VisibilityRuleType;
    conditions : [VisibilityRuleCondition];
    isActive   : Bool;
    createdAt  : Int;
    updatedAt  : Int;
  };

  // Input for creating or updating a visibility rule
  public type VisibilityRuleInput = {
    objectType : CustomFieldsTypes.CustomFieldObjectType;
    ruleType   : VisibilityRuleType;
    conditions : [VisibilityRuleCondition];
    isActive   : Bool;
  };

  // Per-org visibility configuration — controls default inheritance and custom overrides
  public type OrgVisibilityConfig = {
    orgId                  : Text;
    defaultInheritFromVendor : Bool;
    customRules            : [VisibilityRule];
    lockedByParent         : Bool;
    updatedAt              : Int;
  };

  // Input for updating an org's visibility config
  public type OrgVisibilityConfigInput = {
    defaultInheritFromVendor : Bool;
    lockedByParent           : Bool;
  };
};
