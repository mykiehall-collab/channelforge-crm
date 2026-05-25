// Marketing Activity object type for CHANNELFORGE CRM
module {

  public type MarketingActivityType = {
    #webinar;
    #event;
    #emailCampaign;
    #content;
    #sponsorship;
    #other;
  };

  public type MarketingActivityStatus = {
    #planned;
    #inProgress;
    #completed;
    #cancelled;
  };

  // Lightweight reference to a custom field value (avoids circular import)
  public type CustomFieldValueRef = {
    fieldDefId : Text;
    value      : Text;
  };

  // Full marketing activity record
  public type MarketingActivity = {
    id                    : Text;
    activityName          : Text;
    activityType          : MarketingActivityType;
    startDate             : Int;   // timestamp
    endDate               : Int;   // timestamp
    budget                : Nat;   // base currency units
    currency              : Text;
    ownerUserId           : Text;
    targetAccountIds      : [Text];
    vendorOwnerId         : Text;
    distributorId         : ?Text;
    resellerId            : ?Text;
    roi                   : ?Int;  // return on investment (basis points or percent x100)
    status                : MarketingActivityStatus;
    associatedPromotionIds: [Text];
    customFieldValues     : [CustomFieldValueRef];
    createdAt             : Int;
    updatedAt             : Int;
  };

  // Input for creating a new marketing activity
  public type MarketingActivityInput = {
    activityName          : Text;
    activityType          : MarketingActivityType;
    startDate             : Int;
    endDate               : Int;
    budget                : Nat;
    currency              : Text;
    targetAccountIds      : [Text];
    vendorOwnerId         : Text;
    distributorId         : ?Text;
    resellerId            : ?Text;
    associatedPromotionIds: [Text];
  };

  // Input for updating a marketing activity
  public type MarketingActivityUpdateInput = {
    activityName          : ?Text;
    activityType          : ?MarketingActivityType;
    startDate             : ?Int;
    endDate               : ?Int;
    budget                : ?Nat;
    currency              : ?Text;
    targetAccountIds      : ?[Text];
    roi                   : ?Int;
    status                : ?MarketingActivityStatus;
    associatedPromotionIds: ?[Text];
  };
};
