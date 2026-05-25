// MDF (Market Development Fund) Request object type for CHANNELFORGE CRM
module {

  public type MdfRequestStatus = {
    #pending;
    #approved;
    #rejected;
    #paid;
    #cancelled;
  };

  // Lightweight reference to a custom field value (avoids circular import)
  public type CustomFieldValueRef = {
    fieldDefId : Text;
    value      : Text;
  };

  // Full MDF request record
  public type MdfRequest = {
    id                : Text;
    requestorOrgId    : Text;
    requestorUserId   : Text;
    vendorOwnerId     : Text;
    amount            : Nat;       // stored in base currency units (e.g. cents)
    currency          : Text;
    purpose           : Text;
    associatedAccountId : ?Text;
    budgetYear        : Nat;
    budgetQuarter     : ?Nat;      // 1–4
    approvalNote      : ?Text;
    status            : MdfRequestStatus;
    approvedBy        : ?Text;     // userId
    approvedAt        : ?Int;      // timestamp
    customFieldValues : [CustomFieldValueRef];
    createdAt         : Int;
    updatedAt         : Int;
  };

  // Input for creating a new MDF request
  public type MdfRequestInput = {
    vendorOwnerId       : Text;
    amount              : Nat;
    currency            : Text;
    purpose             : Text;
    associatedAccountId : ?Text;
    budgetYear          : Nat;
    budgetQuarter       : ?Nat;
  };

  // Input for approving or rejecting an MDF request
  public type MdfRequestDecisionInput = {
    decision     : MdfRequestStatus; // #approved or #rejected
    approvalNote : ?Text;
  };
};
