// Custom field architecture — all 18 field types, all 10 object types
// Supports Vendor-controlled governance, visibility scoping, and full CRM integration
module {

  // All 18 supported custom field types
  public type CustomFieldType = {
    #text;
    #longText;
    #number;
    #currency;
    #percentage;
    #dropdown;
    #multiSelect;
    #date;
    #datetime;
    #checkbox;
    #url;
    #email;
    #phoneNumber;
    #attachment;
    #tag;
    #regionSelector;
    #userSelector;
    #organizationSelector;
  };

  // All 10 supported object types for custom fields
  public type CustomFieldObjectType = {
    #customerAccount;
    #dealRegistration;
    #opportunity;
    #businessPlan;
    #mdfRequest;
    #promotion;
    #marketingActivity;
    #userProfile;
    #resellerProfile;
    #distributorProfile;
  };

  // Visibility scope for a custom field
  public type CustomFieldVisibilityScope = {
    #allOrgs;
    #vendorOnly;
    #distributorOnly;
    #resellerOnly;
    #internalOnly;
    #roleSpecific;
  };

  // Permission levels for a custom field
  public type CustomFieldPermission = {
    #view;
    #edit;
    #owner;
    #creator;
  };

  // Validation rule types
  public type CustomFieldValidationRuleType = {
    #required;
    #minLength;
    #maxLength;
    #minValue;
    #maxValue;
    #regex;
    #unique;
    #allowedValues;
    #conditionalRequired;
  };

  // A single validation rule attached to a custom field definition
  public type CustomFieldValidationRule = {
    ruleType  : CustomFieldValidationRuleType;
    ruleValue : Text; // serialized rule parameter (e.g. "8" for minLength)
  };

  // Full definition of a custom field created by an admin
  public type CustomFieldDef = {
    id               : Text;
    objectType       : CustomFieldObjectType;
    fieldName        : Text;  // internal identifier
    fieldLabel       : Text;  // display label shown in UI
    fieldDescription : Text;
    fieldType        : CustomFieldType;
    isRequired       : Bool;
    isSearchable     : Bool;
    isReportable     : Bool;
    isApiVisible     : Bool;
    isExportVisible  : Bool;
    defaultValue     : ?Text;
    allowedValues    : [Text]; // for #dropdown and #multiSelect
    validationRules  : [CustomFieldValidationRule];
    visibilityScope  : CustomFieldVisibilityScope;
    editPermissions  : [CustomFieldPermission];
    viewPermissions  : [CustomFieldPermission];
    isArchived       : Bool;
    createdBy        : Text;  // userId
    createdAt        : Int;
    updatedAt        : Int;
    lockedByVendor   : Bool;
  };

  // Input record for creating a new custom field definition
  public type CustomFieldDefInput = {
    objectType       : CustomFieldObjectType;
    fieldName        : Text;
    fieldLabel       : Text;
    fieldDescription : Text;
    fieldType        : CustomFieldType;
    isRequired       : Bool;
    isSearchable     : Bool;
    isReportable     : Bool;
    isApiVisible     : Bool;
    isExportVisible  : Bool;
    defaultValue     : ?Text;
    allowedValues    : [Text];
    validationRules  : [CustomFieldValidationRule];
    visibilityScope  : CustomFieldVisibilityScope;
    editPermissions  : [CustomFieldPermission];
    viewPermissions  : [CustomFieldPermission];
  };

  // A stored value for a custom field on a specific object instance
  public type CustomFieldValue = {
    fieldDefId       : Text;
    objectId         : Text;
    objectType       : CustomFieldObjectType;
    value            : Text;           // serialized value
    uploadedFileKeys : [Text];         // for #attachment type
    createdAt        : Int;
    updatedAt        : Int;
    updatedBy        : Text;           // userId
  };

  // Input for setting or updating a custom field value
  public type CustomFieldValueInput = {
    fieldDefId       : Text;
    objectId         : Text;
    objectType       : CustomFieldObjectType;
    value            : Text;
    uploadedFileKeys : [Text];
  };

  // Result of validating a custom field value against its definition
  public type CustomFieldValidationResult = {
    isValid      : Bool;
    fieldDefId   : Text;
    errorMessage : ?Text;
  };

  // Bulk validation result for a set of field values
  public type CustomFieldBulkValidationResult = {
    allValid : Bool;
    results  : [CustomFieldValidationResult];
  };
};
