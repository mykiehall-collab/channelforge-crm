// Partner tier permission system types for CHANNELFORGE CRM
import CommonTypes "common";

module {
  public type PartnerTier = { #Silver; #Gold; #Platinum };

  public type TierPermission = {
    #DealRegistrations;
    #MDFRequests;
    #PromotionsVisibility;
    #PricingDiscounts;
    #ForecastVisibility;
    #CustomerAnalytics;
    #ExportPermissions;
    #PipelineReporting;
    #AdvancedDashboards;
    #APIAccess;
    #RenewalVisibilityDepth;
    #AIRecommendations;
    #StrategicAccountInsights;
    #SecondaryAdminAccess;
  };

  public type TierConfig = {
    tier : PartnerTier;
    permissions : [TierPermission];
    maxSecondaryAdmins : Nat;
    updatedAt : CommonTypes.Timestamp;
    updatedBy : Principal;
  };

  public type TierAssignment = {
    resellerId : Text;
    tier : PartnerTier;
    assignedAt : CommonTypes.Timestamp;
    assignedBy : Principal;
  };

  public type TierOverride = {
    resellerId : Text;
    permission : TierPermission;
    granted : Bool;
    reason : Text;
    overriddenBy : Principal;
    overriddenAt : CommonTypes.Timestamp;
  };
};
