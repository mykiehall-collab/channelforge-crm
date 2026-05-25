// Deal registration types for CHANNELFORGE CRM
module {
  public type DuplicateDRStatus = {
    #PendingVendorReview;
    #Approved;
    #Rejected;
    #Merged;
    #Reassigned;
    #Escalated;
  };

  public type DuplicateDRRecord = {
    id : Text;
    newDRId : Text;
    existingDRId : Text;
    product : Text;
    accountId : Text;
    resellerId : Text;
    existingResellerId : Text;
    status : DuplicateDRStatus;
    reviewAction : ?Text;
    reviewNote : ?Text;
    reviewedBy : ?Principal;
    reviewedAt : ?Int;
    submittedAt : Int;
  };

  public type DealStatus = {
    #Draft;
    #Submitted;
    #UnderReview;
    #Approved;
    #Rejected;
    #Expired;
    #Won;
    #Lost;
  };

  public type DealRegistration = {
    id : Text;
    accountId : Text;
    customerDomain : Text;
    resellerId : Text;
    vendorOwnerId : Text;
    opportunityName : Text;
    product : Text;
    estimatedValue : Float;
    quantity : Nat;
    closeDate : Int;
    dealStage : Text;
    competitor : Text;
    notes : Text;
    status : DealStatus;
    submittedBy : Text;
    submittedDate : ?Int;
    createdAt : Int;
    updatedAt : Int;
  };

  public type DealRegistrationInput = {
    accountId : Text;
    customerDomain : Text;
    resellerId : Text;
    vendorOwnerId : Text;
    opportunityName : Text;
    product : Text;
    estimatedValue : Float;
    quantity : Nat;
    closeDate : Int;
    dealStage : Text;
    competitor : Text;
    notes : Text;
    status : DealStatus;
    submittedBy : Text;
    submittedDate : ?Int;
  };
};
