import Principal "mo:core/Principal";
import DealsLib "../lib/deals";
import AlertsLib "../lib/alerts";
import NotificationsLib "../lib/notifications";
import CommonTypes "../types/common";
import Types "../types/deals";

mixin (
  dealsState : DealsLib.State,
  alertsState : AlertsLib.State,
  notificationsState : NotificationsLib.State,
) {
  public shared ({ caller }) func createDealRegistration(
    input : Types.DealRegistrationInput
  ) : async CommonTypes.Result<Types.DealRegistration, Text> {
    let createResult = DealsLib.createDealRegistration(dealsState, caller, input);
    switch createResult {
      case (#err(_)) { createResult };
      case (#ok(newDeal)) {
        // Duplicate detection: ONLY same product + same accountId triggers a flag
        switch (DealsLib.checkDuplicateDR(dealsState, input.product, input.accountId, input.resellerId)) {
          case null { #ok(newDeal) };
          case (?existingDeal) {
            // Flag as duplicate — set status to UnderReview
            ignore DealsLib.updateDealStatus(dealsState, caller, newDeal.id, #UnderReview);
            let dupRecord = DealsLib.createDuplicateDRRecord(
              dealsState,
              newDeal.id,
              existingDeal.id,
              input.product,
              input.accountId,
              input.resellerId,
              existingDeal.resellerId,
            );
            // Audit the duplicate flag
            AlertsLib.appendAuditEntry(
              alertsState,
              caller.toText(),
              "DUPLICATE_DR_FLAGGED",
              "deal",
              newDeal.id,
              "Duplicate DR flagged: product=" # input.product # " accountId=" # input.accountId #
                " newDR=" # newDeal.id # " existingDR=" # existingDeal.id,
            );
            // Notify the submitter that their DR is pending vendor review
            ignore NotificationsLib.createNotification(
              notificationsState,
              caller,
              #DuplicateDRFlagged,
              "Deal Registration Pending Vendor Review",
              "Your deal registration for " # input.product # " is pending vendor review as a duplicate product registration already exists for this account.",
              ?newDeal.id,
              ?"deal",
            );
            // Return the updated deal with UnderReview status
            switch (DealsLib.getDealRegistration(dealsState, newDeal.id)) {
              case (?updated) { #ok(updated) };
              case null { #ok(newDeal) };
            };
          };
        };
      };
    };
  };

  public query func getDealRegistration(
    id : Text
  ) : async ?Types.DealRegistration {
    DealsLib.getDealRegistration(dealsState, id);
  };

  public shared ({ caller }) func updateDealRegistration(
    id : Text,
    input : Types.DealRegistrationInput,
  ) : async CommonTypes.Result<Types.DealRegistration, Text> {
    DealsLib.updateDealRegistration(dealsState, caller, id, input);
  };

  public shared ({ caller }) func deleteDealRegistration(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    DealsLib.deleteDealRegistration(dealsState, caller, id);
  };

  public query ({ caller }) func getAllDealRegistrations() : async [Types.DealRegistration] {
    DealsLib.getAllDealRegistrations(dealsState);
  };

  public query func getDealRegistrationsByReseller(
    resellerId : Text
  ) : async [Types.DealRegistration] {
    DealsLib.getDealRegistrationsByReseller(dealsState, resellerId);
  };

  public shared ({ caller }) func updateDealStatus(
    id : Text,
    status : Types.DealStatus,
  ) : async CommonTypes.Result<Types.DealRegistration, Text> {
    let result = DealsLib.updateDealStatus(dealsState, caller, id, status);
    // Send in-app notification to the deal submitter on Approved/Rejected
    switch result {
      case (#ok(deal)) {
        switch status {
          case (#Approved) {
            let submitterPrincipal = Principal.fromText(deal.submittedBy);
            ignore NotificationsLib.createNotification(
              notificationsState,
              submitterPrincipal,
              #DealApproved,
              "Deal Registration Approved",
              "Your deal registration \"" # deal.opportunityName # "\" has been approved.",
              ?deal.id,
              ?"deal",
            );
            AlertsLib.appendAuditEntry(
              alertsState, caller.toText(), "DEAL_APPROVED_NOTIFICATION_SENT",
              "deal", deal.id, "Approval notification sent to " # deal.submittedBy,
            );
          };
          case (#Rejected) {
            let submitterPrincipal = Principal.fromText(deal.submittedBy);
            ignore NotificationsLib.createNotification(
              notificationsState,
              submitterPrincipal,
              #DealRejected,
              "Deal Registration Rejected",
              "Your deal registration \"" # deal.opportunityName # "\" has been rejected.",
              ?deal.id,
              ?"deal",
            );
            AlertsLib.appendAuditEntry(
              alertsState, caller.toText(), "DEAL_REJECTED_NOTIFICATION_SENT",
              "deal", deal.id, "Rejection notification sent to " # deal.submittedBy,
            );
          };
          case (_) {};
        };
      };
      case (#err(_)) {};
    };
    result;
  };

  // Vendor-only: get all pending duplicate DR records
  public query func getDuplicateDRQueue() : async [Types.DuplicateDRRecord] {
    DealsLib.getDuplicateDRsForVendor(dealsState);
  };

  // Vendor-only: review a duplicate DR (Approve/Reject/Merge/Reassign/Escalate)
  public shared ({ caller }) func reviewDuplicateDR(
    id : Text,
    action : Types.DuplicateDRStatus,
    note : Text,
  ) : async Bool {
    switch (DealsLib.reviewDuplicateDR(dealsState, id, action, note, caller)) {
      case (#err(_)) { false };
      case (#ok(())) {
        let actionText = switch action {
          case (#Approved) { "Approved" };
          case (#Rejected) { "Rejected" };
          case (#Merged) { "Merged" };
          case (#Reassigned) { "Reassigned" };
          case (#Escalated) { "Escalated" };
          case (#PendingVendorReview) { "PendingVendorReview" };
        };
        AlertsLib.appendAuditEntry(
          alertsState,
          caller.toText(),
          "DUPLICATE_DR_REVIEWED",
          "duplicateDR",
          id,
          "Duplicate DR reviewed: action=" # actionText # " note=" # note,
        );
        true;
      };
    };
  };

  public query func getPipelineReport(
    filters : CommonTypes.ReportFilters
  ) : async [Types.DealRegistration] {
    DealsLib.getPipelineReport(dealsState, filters);
  };

  public query func getDealRegistrationReport(
    filters : CommonTypes.ReportFilters
  ) : async [Types.DealRegistration] {
    DealsLib.getDealRegistrationReport(dealsState, filters);
  };
};
