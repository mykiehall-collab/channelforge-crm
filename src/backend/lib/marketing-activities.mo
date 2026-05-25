// Marketing Activity domain logic — lifecycle management, ROI tracking, custom fields
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/marketing-activities";

module {

  public type State = {
    activities : Map.Map<Text, Types.MarketingActivity>;
    state      : { var nextSeq : Nat };
  };

  public func initState() : State = {
    activities = Map.empty<Text, Types.MarketingActivity>();
    state      = { var nextSeq = 1 };
  };

  // Create a new marketing activity
  public func createActivity(
    state       : State,
    ownerUserId : Text,
    input       : Types.MarketingActivityInput,
    now         : Int,
  ) : Types.MarketingActivity {
    let seq = state.state.nextSeq;
    state.state.nextSeq += 1;
    let id = "mkt-" # input.vendorOwnerId # "-" # seq.toText();
    let activity : Types.MarketingActivity = {
      id;
      activityName           = input.activityName;
      activityType           = input.activityType;
      startDate              = input.startDate;
      endDate                = input.endDate;
      budget                 = input.budget;
      currency               = input.currency;
      ownerUserId;
      targetAccountIds       = input.targetAccountIds;
      vendorOwnerId          = input.vendorOwnerId;
      distributorId          = input.distributorId;
      resellerId             = input.resellerId;
      roi                    = null;
      status                 = #planned;
      associatedPromotionIds = input.associatedPromotionIds;
      customFieldValues      = [];
      createdAt              = now;
      updatedAt              = now;
    };
    state.activities.add(id, activity);
    activity;
  };

  // Update a marketing activity
  public func updateActivity(
    state : State,
    id    : Text,
    input : Types.MarketingActivityUpdateInput,
    now   : Int,
  ) : ?Types.MarketingActivity {
    switch (state.activities.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.MarketingActivity = {
          existing with
          activityName           = switch (input.activityName)           { case (?v) v; case null existing.activityName };
          activityType           = switch (input.activityType)           { case (?v) v; case null existing.activityType };
          startDate              = switch (input.startDate)              { case (?v) v; case null existing.startDate };
          endDate                = switch (input.endDate)                { case (?v) v; case null existing.endDate };
          budget                 = switch (input.budget)                 { case (?v) v; case null existing.budget };
          currency               = switch (input.currency)               { case (?v) v; case null existing.currency };
          targetAccountIds       = switch (input.targetAccountIds)       { case (?v) v; case null existing.targetAccountIds };
          roi                    = switch (input.roi)                    { case (?v) ?v; case null existing.roi };
          status                 = switch (input.status)                 { case (?v) v; case null existing.status };
          associatedPromotionIds = switch (input.associatedPromotionIds) { case (?v) v; case null existing.associatedPromotionIds };
          updatedAt              = now;
        };
        state.activities.add(id, updated);
        ?updated;
      };
    };
  };

  // Get a single activity by id
  public func getActivity(
    state : State,
    id    : Text,
  ) : ?Types.MarketingActivity {
    state.activities.get(id);
  };

  // List activities with role-scoped caller visibility
  public func listActivitiesForCaller(
    state         : State,
    vendorId      : ?Text,
    callerOrgId   : Text,
    callerRole    : Text,   // "vendor", "distributor", "reseller"
    fieldFilter   : ?{ fieldDefId : Text; value : Text },
  ) : [Types.MarketingActivity] {
    state.activities.values().filter(func (a : Types.MarketingActivity) : Bool {
      let scopeOk = switch (callerRole) {
        case "vendor" {
          switch (vendorId) { case (?vid) a.vendorOwnerId == vid; case null true };
        };
        case "distributor" {
          a.distributorId == ?callerOrgId and
          (switch (vendorId) { case (?vid) a.vendorOwnerId == vid; case null true });
        };
        case "reseller" {
          a.resellerId == ?callerOrgId and
          (switch (vendorId) { case (?vid) a.vendorOwnerId == vid; case null true });
        };
        case _ false;
      };
      if (not scopeOk) { return false };
      switch (fieldFilter) {
        case null true;
        case (?ff) {
          a.customFieldValues.find(func (cfv : Types.CustomFieldValueRef) : Bool {
            cfv.fieldDefId == ff.fieldDefId and cfv.value == ff.value
          }) != null;
        };
      };
    }).toArray();
  };

  // List activities with optional filters
  public func listActivities(
    state        : State,
    vendorId     : ?Text,
    resellerId   : ?Text,
    distributorId: ?Text,
    activityType : ?Types.MarketingActivityType,
    status       : ?Types.MarketingActivityStatus,
  ) : [Types.MarketingActivity] {
    state.activities.values().filter(func (a : Types.MarketingActivity) : Bool {
      (switch (vendorId)      { case (?v) a.vendorOwnerId == v;   case null true }) and
      (switch (resellerId)    { case (?v) a.resellerId == ?v;     case null true }) and
      (switch (distributorId) { case (?v) a.distributorId == ?v; case null true }) and
      (switch (activityType)  { case (?v) a.activityType == v;   case null true }) and
      (switch (status)        { case (?v) a.status == v;         case null true });
    }).toArray();
  };

  // Record ROI outcome for a completed activity
  public func recordRoi(
    state : State,
    id    : Text,
    roi   : Int,
    now   : Int,
  ) : Bool {
    switch (state.activities.get(id)) {
      case null false;
      case (?existing) {
        state.activities.add(id, { existing with roi = ?roi; updatedAt = now });
        true;
      };
    };
  };

  // Set custom field values on an activity
  public func setCustomFieldValues(
    state  : State,
    id     : Text,
    values : [Types.CustomFieldValueRef],
    now    : Int,
  ) : Bool {
    switch (state.activities.get(id)) {
      case null false;
      case (?existing) {
        var merged = List.fromArray<Types.CustomFieldValueRef>(existing.customFieldValues);
        for (v in values.values()) {
          let idx = merged.findIndex(func (c : Types.CustomFieldValueRef) : Bool { c.fieldDefId == v.fieldDefId });
          switch (idx) {
            case null { merged.add(v) };
            case (?i) { merged.put(i, v) };
          };
        };
        state.activities.add(id, { existing with customFieldValues = merged.toArray(); updatedAt = now });
        true;
      };
    };
  };
};
