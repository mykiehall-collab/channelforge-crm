// Business plan types for CHANNELFORGE CRM
module {
  public type ActivityStatus = { #Pending; #InProgress; #Completed; #Overdue };

  public type BusinessPlanActivity = {
    id : Text;
    description : Text;
    owner : Text;
    dueDate : Int;
    status : ActivityStatus;
    notes : Text;
  };

  public type PlanType = { #Quarterly; #Monthly; #Annual };

  public type BusinessPlan = {
    id : Text;
    partnerId : Text;
    vendorOwnerId : Text;
    planType : PlanType;
    quarter : ?Nat;
    month : ?Nat;
    year : Nat;
    objective : Text;
    activities : [BusinessPlanActivity];
    revenueTarget : Float;
    pipelineTarget : Float;
    createdAt : Int;
  };

  public type BusinessPlanInput = {
    partnerId : Text;
    vendorOwnerId : Text;
    planType : PlanType;
    quarter : ?Nat;
    month : ?Nat;
    year : Nat;
    objective : Text;
    activities : [BusinessPlanActivity];
    revenueTarget : Float;
    pipelineTarget : Float;
  };
};
