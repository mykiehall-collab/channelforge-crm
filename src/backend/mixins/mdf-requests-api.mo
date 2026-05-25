// Public API mixin for MDF Request lifecycle management
import MdfRequestsLib "../lib/mdf-requests";
import Types "../types/mdf-requests";
import Time "mo:core/Time";

mixin (mdfRequestsState : MdfRequestsLib.State) {

    /// Submit a new MDF request
    public shared ({ caller }) func createMdfRequest(
      vendorOwnerId : Text,
      input         : Types.MdfRequestInput,
    ) : async Types.MdfRequest {
      MdfRequestsLib.createRequest(mdfRequestsState, caller.toText(), caller.toText(), input, Time.now());
    };

    /// Get a single MDF request by id
    public query func getMdfRequest(
      id : Text
    ) : async ?Types.MdfRequest {
      MdfRequestsLib.getRequest(mdfRequestsState, id);
    };

    /// List MDF requests with optional filters
    public query func listMdfRequests(
      vendorId       : ?Text,
      requestorOrgId : ?Text,
      status         : ?Types.MdfRequestStatus,
      budgetYear     : ?Nat,
    ) : async [Types.MdfRequest] {
      MdfRequestsLib.listRequests(mdfRequestsState, vendorId, requestorOrgId, status, budgetYear);
    };

    /// List MDF requests scoped by caller role
    public query func listMdfRequestsForCaller(
      vendorId    : ?Text,
      callerOrgId : Text,
      callerRole  : Text,
      fieldDefId  : ?Text,
      fieldValue  : ?Text,
    ) : async [Types.MdfRequest] {
      let fieldFilter = switch (fieldDefId, fieldValue) {
        case (?fid, ?fval) ?{ fieldDefId = fid; value = fval };
        case _ null;
      };
      MdfRequestsLib.listMdfRequestsForCaller(mdfRequestsState, vendorId, callerOrgId, callerRole, fieldFilter);
    };

    /// Approve or reject an MDF request (Vendor Admin)
    public shared ({ caller }) func decideMdfRequest(
      id    : Text,
      input : Types.MdfRequestDecisionInput,
    ) : async ?Types.MdfRequest {
      MdfRequestsLib.applyDecision(mdfRequestsState, id, caller.toText(), input, Time.now());
    };

    /// Mark an MDF request as paid
    public shared ({ caller }) func markMdfRequestPaid(
      id : Text
    ) : async Bool {
      MdfRequestsLib.markPaid(mdfRequestsState, id, Time.now());
    };

    /// Cancel an MDF request
    public shared ({ caller }) func cancelMdfRequest(
      id : Text
    ) : async Bool {
      MdfRequestsLib.cancelRequest(mdfRequestsState, id, Time.now());
    };
};
