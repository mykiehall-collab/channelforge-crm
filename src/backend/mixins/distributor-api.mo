import Principal "mo:core/Principal";
import DistributorLib "../lib/distributor";
import CompanyLib "../lib/company";
import AccountsLib "../lib/accounts";
import AlertsLib "../lib/alerts";
import CommonTypes "../types/common";
import Types "../types/company";
import AccountTypes "../types/accounts";

mixin (
  distributorState : DistributorLib.State,
  companyState     : CompanyLib.State,
  accountsState    : AccountsLib.State,
  alertsState      : AlertsLib.State,
) {
  // Create a distributor workspace — Vendor Admins only
  public shared ({ caller }) func createDistributor(
    vendorCompanyId : Text,
    input           : Types.DistributorInput,
  ) : async CommonTypes.Result<Types.DistributorProfile, Text> {
    DistributorLib.createDistributor(
      distributorState, companyState, alertsState, caller, vendorCompanyId, input,
    );
  };

  public query func getDistributor(id : Text) : async ?Types.DistributorProfile {
    DistributorLib.getDistributor(distributorState, id);
  };

  public shared ({ caller }) func updateDistributor(
    id    : Text,
    input : Types.DistributorInput,
  ) : async CommonTypes.Result<Types.DistributorProfile, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?p) {
        let allowed = switch (p.role) {
          case (#VendorPrimaryAdmin)       { true };
          case (#VendorAdmin)              { true };
          case (#DistributorPrimaryAdmin)  {
            switch (distributorState.distributors.get(id)) {
              case null  { false };
              case (?d)  { p.companyId == d.id };
            };
          };
          case (_) { false };
        };
        if (not allowed) { return #err("Not authorised to update this distributor") };
      };
    };
    DistributorLib.updateDistributor(distributorState, alertsState, caller, id, input);
  };

  public query func listDistributors() : async [Types.DistributorProfile] {
    DistributorLib.listDistributors(distributorState);
  };

  public query func listDistributorsByVendor(
    vendorId : Text
  ) : async [Types.DistributorProfile] {
    DistributorLib.listDistributorsByVendor(distributorState, vendorId);
  };

  public shared ({ caller }) func activateDistributor(
    id : Text
  ) : async CommonTypes.Result<Types.DistributorProfile, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?p) {
        switch (p.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin)        {};
          case (_) { return #err("Only Vendor Admins can activate distributors") };
        };
      };
    };
    DistributorLib.activateDistributor(distributorState, alertsState, caller, id);
  };

  public shared ({ caller }) func suspendDistributor(
    id : Text
  ) : async CommonTypes.Result<Types.DistributorProfile, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?p) {
        switch (p.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin)        {};
          case (_) { return #err("Only Vendor Admins can suspend distributors") };
        };
      };
    };
    DistributorLib.suspendDistributor(distributorState, alertsState, caller, id);
  };

  public shared ({ caller }) func addVendorRelationship(
    distributorId : Text,
    vendorId      : Text,
  ) : async CommonTypes.Result<Types.DistributorProfile, Text> {
    DistributorLib.addVendorRelationship(distributorState, alertsState, caller, distributorId, vendorId);
  };

  public shared ({ caller }) func addResellerToDistributor(
    distributorId : Text,
    resellerId    : Text,
  ) : async CommonTypes.Result<Types.DistributorProfile, Text> {
    DistributorLib.addResellerToDistributor(distributorState, alertsState, caller, distributorId, resellerId);
  };

  public query func getDistributorResellers(
    distributorId : Text
  ) : async [Text] {
    switch (DistributorLib.getDistributor(distributorState, distributorId)) {
      case null  { [] };
      case (?d)  { d.resellerIds };
    };
  };

  // Returns all accounts where distributorId appears in account.distributorIds.
  // Distributor users can only see accounts assigned to their own workspace.
  public query ({ caller }) func getDistributorCustomerAccounts(
    distributorId : Text
  ) : async [AccountTypes.Account] {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return [] };
      case (?p) {
        let allowed = switch (p.role) {
          case (#VendorPrimaryAdmin)        { true };
          case (#VendorAdmin)               { true };
          case (#DistributorPrimaryAdmin)   {
            switch (distributorState.distributors.get(distributorId)) {
              case null  { false };
              case (?d)  { p.companyId == d.id };
            };
          };
          case (#DistributorSecondaryAdmin) {
            switch (distributorState.distributors.get(distributorId)) {
              case null  { false };
              case (?d)  { p.companyId == d.id };
            };
          };
          case (_) { false };
        };
        if (not allowed) { return [] };
      };
    };
    AccountsLib.getAllAccounts(accountsState).filter(func(a : AccountTypes.Account) : Bool {
      a.distributorIds.filter(func(did : Text) : Bool { did == distributorId }).size() > 0
    });
  };
};
