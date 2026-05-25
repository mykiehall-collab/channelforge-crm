// Customer ID format governance — Vendor-controlled, cascades to Distributors and Resellers
module {

  // Number sequencing strategy for auto-generated Customer IDs
  public type CustomerIdNumberSequencing = {
    #sequential;
    #random;
    #custom;
  };

  // Token variants used to build a Customer ID format pattern
  public type CustomerIdFormatToken = {
    #prefix    : Text;   // static text prefix
    #region;             // replaced with region code
    #sequential: Nat;    // zero-padded sequential number (width)
    #alphanumeric: Nat;  // random alphanumeric segment (length)
    #digits    : Nat;    // zero-padded digits segment (width)
    #custom    : Text;   // user-defined literal segment
  };

  // Full format rule defined by a Vendor and inherited downstream
  public type CustomerIdFormatRule = {
    vendorId               : Text;
    formatPattern          : Text;   // human-readable e.g. "UK-{REGION}-{NUMBER}"
    prefixRules            : Text;
    regionRules            : [Text];
    numberSequencing       : CustomerIdNumberSequencing;
    characterLimit         : Nat;
    allowedSeparators      : [Text];
    autoGenerationEnabled  : Bool;
    manualOverridePermitted: Bool;
    duplicatePreventionEnabled : Bool;
    lastSequenceNumber     : Nat;
    updatedAt              : Int;
  };

  // Input for creating or updating a Customer ID format rule
  public type CustomerIdFormatRuleInput = {
    formatPattern          : Text;
    prefixRules            : Text;
    regionRules            : [Text];
    numberSequencing       : CustomerIdNumberSequencing;
    characterLimit         : Nat;
    allowedSeparators      : [Text];
    autoGenerationEnabled  : Bool;
    manualOverridePermitted: Bool;
    duplicatePreventionEnabled : Bool;
  };

  // Result of validating or generating a Customer ID
  public type CustomerIdValidationResult = {
    isValid      : Bool;
    formattedId  : ?Text;
    errorMessage : ?Text;
    isDuplicate  : Bool;
  };

  // Request to generate the next Customer ID under a Vendor's format
  public type CustomerIdGenerateRequest = {
    vendorId    : Text;
    regionCode  : ?Text;
    manualInput : ?Text; // if manual override is permitted
  };

  // Audit entry tracking Customer ID creation, changes, and duplicate blocks
  public type CustomerIdAuditEntry = {
    entryId     : Text;
    customerId  : Text;
    accountId   : Text;
    action      : CustomerIdAuditAction;
    performedBy : Text;    // userId
    performedAt : Int;
    detail      : Text;
  };

  public type CustomerIdAuditAction = {
    #created;
    #updated;
    #duplicateBlocked;
    #formatRuleChanged;
    #manualOverride;
    #mergeResolved;
  };
};
