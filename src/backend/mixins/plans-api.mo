import Principal "mo:core/Principal";
import PlansLib "../lib/plans";
import CommonTypes "../types/common";
import Types "../types/plans";

mixin (plansState : PlansLib.State) {
  public shared ({ caller }) func createBusinessPlan(
    input : Types.BusinessPlanInput
  ) : async CommonTypes.Result<Types.BusinessPlan, Text> {
    PlansLib.createBusinessPlan(plansState, caller, input);
  };

  public query func getBusinessPlan(
    id : Text
  ) : async ?Types.BusinessPlan {
    PlansLib.getBusinessPlan(plansState, id);
  };

  public shared ({ caller }) func updateBusinessPlan(
    id : Text,
    input : Types.BusinessPlanInput,
  ) : async CommonTypes.Result<Types.BusinessPlan, Text> {
    PlansLib.updateBusinessPlan(plansState, caller, id, input);
  };

  public query func getBusinessPlansByPartner(
    partnerId : Text
  ) : async [Types.BusinessPlan] {
    PlansLib.getBusinessPlansByPartner(plansState, partnerId);
  };

  public query ({ caller }) func getAllBusinessPlans() : async [Types.BusinessPlan] {
    PlansLib.getAllBusinessPlans(plansState);
  };

  public shared ({ caller }) func updateBusinessPlanActivity(
    planId : Text,
    activityId : Text,
    status : Types.ActivityStatus,
  ) : async CommonTypes.Result<Types.BusinessPlan, Text> {
    PlansLib.updateBusinessPlanActivity(plansState, caller, planId, activityId, status);
  };
};
