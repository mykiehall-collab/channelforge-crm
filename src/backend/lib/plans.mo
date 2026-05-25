import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/plans";
import Array "mo:core/Array";

module {
  public type State = {
    plans : Map.Map<Text, Types.BusinessPlan>;
    idCounter : { var value : Nat };
  };

  public func initState() : State {
    {
      plans = Map.empty<Text, Types.BusinessPlan>();
      idCounter = { var value = 0 };
    };
  };

  public func createBusinessPlan(
    state : State,
    caller : Principal,
    input : Types.BusinessPlanInput,
  ) : CommonTypes.Result<Types.BusinessPlan, Text> {
    state.idCounter.value += 1;
    let id = "plan-" # state.idCounter.value.toText();
    let plan : Types.BusinessPlan = {
      id;
      partnerId = input.partnerId;
      vendorOwnerId = input.vendorOwnerId;
      planType = input.planType;
      quarter = input.quarter;
      month = input.month;
      year = input.year;
      objective = input.objective;
      activities = input.activities;
      revenueTarget = input.revenueTarget;
      pipelineTarget = input.pipelineTarget;
      createdAt = Time.now();
    };
    state.plans.add(id, plan);
    #ok(plan);
  };

  public func getBusinessPlan(
    state : State,
    id : Text,
  ) : ?Types.BusinessPlan {
    state.plans.get(id);
  };

  public func updateBusinessPlan(
    state : State,
    caller : Principal,
    id : Text,
    input : Types.BusinessPlanInput,
  ) : CommonTypes.Result<Types.BusinessPlan, Text> {
    switch (state.plans.get(id)) {
      case null { #err("Business plan not found") };
      case (?existing) {
        let updated : Types.BusinessPlan = {
          existing with
          partnerId = input.partnerId;
          vendorOwnerId = input.vendorOwnerId;
          planType = input.planType;
          quarter = input.quarter;
          month = input.month;
          year = input.year;
          objective = input.objective;
          activities = input.activities;
          revenueTarget = input.revenueTarget;
          pipelineTarget = input.pipelineTarget;
        };
        state.plans.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func getBusinessPlansByPartner(
    state : State,
    partnerId : Text,
  ) : [Types.BusinessPlan] {
    state.plans.values().filter(func(p) { p.partnerId == partnerId }).toArray();
  };

  public func getAllBusinessPlans(state : State) : [Types.BusinessPlan] {
    state.plans.values().toArray();
  };

  public func updateBusinessPlanActivity(
    state : State,
    caller : Principal,
    planId : Text,
    activityId : Text,
    status : Types.ActivityStatus,
  ) : CommonTypes.Result<Types.BusinessPlan, Text> {
    switch (state.plans.get(planId)) {
      case null { #err("Business plan not found") };
      case (?existing) {
        let activityFound = existing.activities.find(func(a : Types.BusinessPlanActivity) : Bool { a.id == activityId });
        switch (activityFound) {
          case null { #err("Activity not found in plan") };
          case (?_) {
            let updatedActivities = existing.activities.map(
              func(a) {
                if (a.id == activityId) { { a with status } } else { a }
              }
            );
            let updated : Types.BusinessPlan = { existing with activities = updatedActivities };
            state.plans.add(planId, updated);
            #ok(updated);
          };
        };
      };
    };
  };
};
