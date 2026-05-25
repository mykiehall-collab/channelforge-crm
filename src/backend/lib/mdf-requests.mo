// MDF Request domain logic — creation, approval workflow, audit
import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/mdf-requests";

module {

  public type State = {
    requests : Map.Map<Text, Types.MdfRequest>;
    state    : { var nextSeq : Nat };
  };

  public func initState() : State = {
    requests = Map.empty<Text, Types.MdfRequest>();
    state    = { var nextSeq = 1 };
  };

  // Submit a new MDF request
  public func createRequest(
    state           : State,
    requestorOrgId  : Text,
    requestorUserId : Text,
    input           : Types.MdfRequestInput,
    now             : Int,
  ) : Types.MdfRequest {
    let seq = state.state.nextSeq;
    state.state.nextSeq += 1;
    let id = "mdf-" # requestorOrgId # "-" # seq.toText();
    let req : Types.MdfRequest = {
      id;
      requestorOrgId;
      requestorUserId;
      vendorOwnerId       = input.vendorOwnerId;
      amount              = input.amount;
      currency            = input.currency;
      purpose             = input.purpose;
      associatedAccountId = input.associatedAccountId;
      budgetYear          = input.budgetYear;
      budgetQuarter       = input.budgetQuarter;
      approvalNote        = null;
      status              = #pending;
      approvedBy          = null;
      approvedAt          = null;
      customFieldValues   = [];
      createdAt           = now;
      updatedAt           = now;
    };
    state.requests.add(id, req);
    req;
  };

  // Get a single MDF request by id
  public func getRequest(
    state : State,
    id    : Text,
  ) : ?Types.MdfRequest {
    state.requests.get(id);
  };

  // List MDF requests with role-scoped caller visibility
  public func listMdfRequestsForCaller(
    state         : State,
    vendorId      : ?Text,
    callerOrgId   : Text,
    callerRole    : Text,  // "vendor", "distributor", "reseller"
    fieldFilter   : ?{ fieldDefId : Text; value : Text },
  ) : [Types.MdfRequest] {
    state.requests.values().filter(func (r : Types.MdfRequest) : Bool {
      let scopeOk = switch (callerRole) {
        case "vendor" {
          switch (vendorId) { case (?vid) r.vendorOwnerId == vid; case null true };
        };
        case _ {
          r.requestorOrgId == callerOrgId and
          (switch (vendorId) { case (?vid) r.vendorOwnerId == vid; case null true });
        };
      };
      if (not scopeOk) { return false };
      switch (fieldFilter) {
        case null true;
        case (?ff) {
          r.customFieldValues.find(func (cfv : Types.CustomFieldValueRef) : Bool {
            cfv.fieldDefId == ff.fieldDefId and cfv.value == ff.value
          }) != null;
        };
      };
    }).toArray();
  };

  // List MDF requests with optional filters
  public func listRequests(
    state          : State,
    vendorId       : ?Text,
    requestorOrgId : ?Text,
    status         : ?Types.MdfRequestStatus,
    budgetYear     : ?Nat,
  ) : [Types.MdfRequest] {
    state.requests.values().filter(func (r : Types.MdfRequest) : Bool {
      (switch (vendorId)       { case (?v) r.vendorOwnerId == v;     case null true }) and
      (switch (requestorOrgId) { case (?v) r.requestorOrgId == v;   case null true }) and
      (switch (status)         { case (?v) r.status == v;           case null true }) and
      (switch (budgetYear)     { case (?v) r.budgetYear == v;       case null true });
    }).toArray();
  };

  // Approve or reject an MDF request
  public func applyDecision(
    state      : State,
    id         : Text,
    approverId : Text,
    input      : Types.MdfRequestDecisionInput,
    now        : Int,
  ) : ?Types.MdfRequest {
    switch (state.requests.get(id)) {
      case null null;
      case (?existing) {
        if (existing.status != #pending) { return null };
        let updated : Types.MdfRequest = {
          existing with
          status       = input.decision;
          approvalNote = input.approvalNote;
          approvedBy   = ?approverId;
          approvedAt   = ?now;
          updatedAt    = now;
        };
        state.requests.add(id, updated);
        ?updated;
      };
    };
  };

  // Mark an MDF request as paid
  public func markPaid(
    state : State,
    id    : Text,
    now   : Int,
  ) : Bool {
    switch (state.requests.get(id)) {
      case null false;
      case (?existing) {
        if (existing.status != #approved) { return false };
        state.requests.add(id, { existing with status = #paid; updatedAt = now });
        true;
      };
    };
  };

  // Cancel an MDF request
  public func cancelRequest(
    state : State,
    id    : Text,
    now   : Int,
  ) : Bool {
    switch (state.requests.get(id)) {
      case null false;
      case (?existing) {
        if (existing.status == #paid or existing.status == #cancelled) { return false };
        state.requests.add(id, { existing with status = #cancelled; updatedAt = now });
        true;
      };
    };
  };
};
