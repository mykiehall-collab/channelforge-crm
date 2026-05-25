// Promotion and price list types for CHANNELFORGE CRM
module {
  public type Promotion = {
    id : Text;
    promoName : Text;
    startDate : Int;
    endDate : Int;
    product : Text;
    resellerEligibility : [Text];
    description : Text;
    callToAction : Text;
    fileKeys : [Text];
    createdBy : Text;
    createdAt : Int;
  };

  public type PromotionInput = {
    promoName : Text;
    startDate : Int;
    endDate : Int;
    product : Text;
    resellerEligibility : [Text];
    description : Text;
    callToAction : Text;
    fileKeys : [Text];
  };

  public type PriceList = {
    id : Text;
    name : Text;
    region : Text;
    currency : Text;
    productFamily : Text;
    effectiveDate : Int;
    expiryDate : Int;
    fileKey : Text;
    version : Text;
    createdBy : Text;
    createdAt : Int;
  };

  public type PriceListInput = {
    name : Text;
    region : Text;
    currency : Text;
    productFamily : Text;
    effectiveDate : Int;
    expiryDate : Int;
    fileKey : Text;
    version : Text;
  };
};
