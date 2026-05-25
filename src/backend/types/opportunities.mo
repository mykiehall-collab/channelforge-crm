// Opportunity object type for CHANNELFORGE CRM pipeline management
module {

  // Sales funnel stages for an opportunity
  public type OpportunityStage = {
    #prospecting;
    #qualification;
    #proposal;
    #negotiation;
    #closedWon;
    #closedLost;
  };

  public type OpportunityStatus = { #active; #archived };

  // Full opportunity record
  public type Opportunity = {
    id                : Text;
    opportunityName   : Text;
    revenueEstimate   : Nat;   // stored in base currency units (e.g. cents)
    stage             : OpportunityStage;
    closeDate         : Int;   // timestamp
    ownerUserId       : Text;
    customerAccountId : ?Text;
    associatedDealIds : [Text];
    vendorOwnerId     : Text;
    distributorId     : ?Text;
    resellerId        : ?Text;
    status            : OpportunityStatus;
    customFieldValues : [CustomFieldValueRef];
    createdAt         : Int;
    updatedAt         : Int;
  };

  // Lightweight reference to a custom field value (avoids circular import)
  public type CustomFieldValueRef = {
    fieldDefId : Text;
    value      : Text;
  };

  // Input record for creating an opportunity
  public type OpportunityInput = {
    opportunityName   : Text;
    revenueEstimate   : Nat;
    stage             : OpportunityStage;
    closeDate         : Int;
    customerAccountId : ?Text;
    associatedDealIds : [Text];
    vendorOwnerId     : Text;
    distributorId     : ?Text;
    resellerId        : ?Text;
  };

  // Input for updating an existing opportunity
  public type OpportunityUpdateInput = {
    opportunityName   : ?Text;
    revenueEstimate   : ?Nat;
    stage             : ?OpportunityStage;
    closeDate         : ?Int;
    customerAccountId : ?Text;
    associatedDealIds : ?[Text];
    distributorId     : ?Text;
    resellerId        : ?Text;
    status            : ?OpportunityStatus;
  };
};
