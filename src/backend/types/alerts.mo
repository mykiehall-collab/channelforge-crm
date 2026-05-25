// Alert, news and audit types for CHANNELFORGE CRM
module {
  public type AlertType = {
    #RenewalDue;
    #LeadToCall;
    #CustomerRisk;
    #MissingContact;
    #DealExpiry;
    #PromoExpiry;
    #BusinessPlanDue;
    #DuplicateAccount;
  };

  public type AlertSeverity = { #High; #Medium; #Low };

  public type Alert = {
    id : Text;
    accountId : ?Text;
    userId : Text;
    alertType : AlertType;
    message : Text;
    severity : AlertSeverity;
    isRead : Bool;
    createdAt : Int;
  };

  public type AlertInput = {
    accountId : ?Text;
    userId : Text;
    alertType : AlertType;
    message : Text;
    severity : AlertSeverity;
  };

  public type NewsVisibility = {
    #AllResellers;
    #SpecificResellers : [Text];
    #VendorOnly;
    #SpecificRegions : [Text];
  };

  public type NewsItem = {
    id : Text;
    title : Text;
    body : Text;
    publishDate : Int;
    visibility : NewsVisibility;
    publishedBy : Text;
    createdAt : Int;
  };

  public type NewsItemInput = {
    title : Text;
    body : Text;
    publishDate : Int;
    visibility : NewsVisibility;
  };

  public type AuditEntry = {
    id : Text;
    userId : Text;
    action : Text;
    entityType : Text;
    entityId : Text;
    details : Text;
    timestamp : Int;
  };
};
