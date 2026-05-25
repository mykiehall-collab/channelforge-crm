// Account, Contact, Note, site and reassignment types for CHANNELFORGE CRM
module {
  public type AccountStatus = { #Active; #AtRisk; #Churned; #Prospect };

  // Per-site assignment within a multi-site customer account
  public type AccountSite = {
    siteId        : Text;
    siteName      : Text;
    country       : Text;
    region        : Text;
    distributorId : ?Text;  // distributor serving this site
    resellerId    : ?Text;  // reseller serving this site
    productLines  : [Text];
  };

  // Owner types tracked in the reassignment log
  public type OwnerType = { #Distributor; #Reseller; #Vendor };

  // Approval state for a reassignment change request
  public type ReassignmentApprovalStatus = {
    #Pending;
    #Approved;
    #Rejected;
  };

  // Immutable log entry written every time ownership changes on an account
  public type AccountReassignmentEntry = {
    entryId         : Text;
    changedBy       : Text;  // userId of the person who initiated the change
    changedAt       : Int;
    previousOwnerId : Text;
    newOwnerId      : Text;
    ownerType       : OwnerType;
    reason          : Text;
    approvalStatus  : ReassignmentApprovalStatus;
  };

  public type Account = {
    id : Text;
    accountName : Text;
    customerDomain : Text;
    customerIdNumber : ?Text;  // Vendor-governed unique customer identifier
    resellerOwnerId : Text;
    vendorOwnerId : Text;
    distributorIds : [Text];
    sites : [AccountSite];
    reassignmentLog : [AccountReassignmentEntry];
    renewalDate : Int;
    contractType : Text;
    productList : [Text];
    licenceQuantity : Nat;
    estimatedRenewalValue : Float;
    status : AccountStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  public type AccountInput = {
    accountName : Text;
    customerDomain : Text;
    customerIdNumber : ?Text;  // Optional — validated against Vendor format rule on creation
    resellerOwnerId : Text;
    vendorOwnerId : Text;
    distributorIds : [Text];
    sites : [AccountSite];
    renewalDate : Int;
    contractType : Text;
    productList : [Text];
    licenceQuantity : Nat;
    estimatedRenewalValue : Float;
    status : AccountStatus;
  };

  public type DuplicateCheckResult = {
    isDuplicate : Bool;
    existingAccountId : ?Text;
    existingOwner : ?Text;
    matchingDomain : ?Text;
    matchType : Text;
    suggestion : Text;
  };

  public type Contact = {
    id : Text;
    accountId : Text;
    firstName : Text;
    lastName : Text;
    jobTitle : Text;
    email : Text;
    phone : Text;
    contactOwner : Text;
    contactType : Text;
    notes : Text;
    lastContactedDate : ?Int;
    nextActionDate : ?Int;
    createdAt : Int;
  };

  public type ContactInput = {
    accountId : Text;
    firstName : Text;
    lastName : Text;
    jobTitle : Text;
    email : Text;
    phone : Text;
    contactOwner : Text;
    contactType : Text;
    notes : Text;
    lastContactedDate : ?Int;
    nextActionDate : ?Int;
  };

  public type Note = {
    id : Text;
    accountId : Text;
    content : Text;
    authorId : Text;
    authorName : Text;
    authorRole : Text;
    createdAt : Int;
    updatedAt : ?Int;
    editedBy : ?Text;
  };

  public type NoteInput = {
    accountId : Text;
    content : Text;
    authorName : Text;
    authorRole : Text;
  };
};
