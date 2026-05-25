import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import Types "../types/company";
import AlertTypes "../types/alerts";

module {
  public type State = {
    distributors : Map.Map<Text, Types.DistributorProfile>;
    idCounter    : { var value : Nat };
  };

  public func initState() : State {
    {
      distributors = Map.empty<Text, Types.DistributorProfile>();
      idCounter    = { var value = 0 };
    };
  };

  // ── Shared AlertsState alias (matches lib/company.mo and lib/alerts.mo) ──
  public type AlertsState = {
    alerts   : Map.Map<Text, AlertTypes.Alert>;
    news     : Map.Map<Text, AlertTypes.NewsItem>;
    auditLog : List.List<AlertTypes.AuditEntry>;
    idCounter: { var value : Nat };
  };

  func appendAudit(
    alertsState : AlertsState,
    userId      : Text,
    action      : Text,
    entityType  : Text,
    entityId    : Text,
    details     : Text,
  ) : () {
    alertsState.idCounter.value += 1;
    let id = "audit-" # alertsState.idCounter.value.toText();
    alertsState.auditLog.add({
      id; userId; action; entityType; entityId; details;
      timestamp = Time.now();
    });
  };

  // CompanyState subset needed for distributor operations
  type CompanyStateSub = {
    companies    : Map.Map<Text, Types.CompanyProfile>;
    userProfiles : Map.Map<Text, Types.UserProfile>;
    invitations  : Map.Map<Text, Types.ResidentInvitation>;
    idCounter    : { var value : Nat };
  };

  // ── CRUD ────────────────────────────────────────────────────────────

  public func createDistributor(
    state           : State,
    companyState    : CompanyStateSub,
    alertsState     : AlertsState,
    caller          : Principal,
    vendorCompanyId : Text,
    input           : Types.DistributorInput,
  ) : CommonTypes.Result<Types.DistributorProfile, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?cp) {
        switch (cp.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin)        {};
          case (_) { return #err("Only Vendor Admins can create distributors") };
        };
        if (cp.companyId != vendorCompanyId) {
          return #err("Caller does not belong to the specified vendor company");
        };
      };
    };
    // Enforce unique companyId per workspace
    let dupId = state.distributors.values().find(func(d) { d.companyId == input.companyId });
    switch (dupId) {
      case (?_) { return #err("A distributor with this company ID already exists") };
      case null {};
    };
    // Enforce unique email domain
    let dupDomain = state.distributors.values().find(func(d) {
      d.emailDomain.toLower() == input.emailDomain.toLower()
    });
    switch (dupDomain) {
      case (?_) { return #err("A distributor with this email domain already exists") };
      case null {};
    };
    state.idCounter.value += 1;
    let id  = "dist-" # state.idCounter.value.toText();
    let now = Time.now();
    let profile : Types.DistributorProfile = {
      id;
      companyName       = input.companyName;
      companyId         = input.companyId;
      emailDomain       = input.emailDomain.toLower();
      logoKey           = input.logoKey;
      primaryAdminEmail = input.primaryAdminEmail;
      vendorIds         = [vendorCompanyId];
      resellerIds       = [];
      activationStatus  = #Pending;
      setupComplete     = false;
      createdAt         = now;
      updatedAt         = now;
    };
    state.distributors.add(id, profile);
    // Create invitation for the Distributor Primary Admin
    companyState.idCounter.value += 1;
    let invId = "inv-" # companyState.idCounter.value.toText();
    let invitation : Types.ResidentInvitation = {
      id       = invId;
      companyId= id;
      email    = input.primaryAdminEmail;
      role     = #DistributorPrimaryAdmin;
      invitedBy= callerId;
      createdAt= now;
      expiresAt= now + 7 * 24 * 3_600_000_000_000;
      status   = #Pending;
    };
    companyState.invitations.add(invId, invitation);
    appendAudit(alertsState, callerId, "CREATE_DISTRIBUTOR", "distributor", id,
      "Distributor created: " # input.companyName # " domain: " # input.emailDomain);
    #ok(profile);
  };

  public func getDistributor(state : State, id : Text) : ?Types.DistributorProfile {
    state.distributors.get(id);
  };

  public func updateDistributor(
    state       : State,
    alertsState : AlertsState,
    caller      : Principal,
    id          : Text,
    input       : Types.DistributorInput,
  ) : CommonTypes.Result<Types.DistributorProfile, Text> {
    switch (state.distributors.get(id)) {
      case null { #err("Distributor not found") };
      case (?existing) {
        let updated : Types.DistributorProfile = {
          existing with
          companyName       = input.companyName;
          emailDomain       = input.emailDomain.toLower();
          logoKey           = input.logoKey;
          primaryAdminEmail = input.primaryAdminEmail;
          updatedAt         = Time.now();
        };
        state.distributors.add(id, updated);
        appendAudit(alertsState, caller.toText(), "UPDATE_DISTRIBUTOR", "distributor", id,
          "Distributor updated: " # input.companyName);
        #ok(updated);
      };
    };
  };

  public func listDistributors(state : State) : [Types.DistributorProfile] {
    state.distributors.values().toArray();
  };

  public func listDistributorsByVendor(state : State, vendorId : Text) : [Types.DistributorProfile] {
    state.distributors.values().filter(func(d) {
      d.vendorIds.filter(func(v) { v == vendorId }).size() > 0
    }).toArray();
  };

  public func activateDistributor(
    state       : State,
    alertsState : AlertsState,
    caller      : Principal,
    id          : Text,
  ) : CommonTypes.Result<Types.DistributorProfile, Text> {
    switch (state.distributors.get(id)) {
      case null { #err("Distributor not found") };
      case (?existing) {
        let updated = { existing with activationStatus = (#Active : Types.ActivationStatus); updatedAt = Time.now() };
        state.distributors.add(id, updated);
        appendAudit(alertsState, caller.toText(), "ACTIVATE_DISTRIBUTOR", "distributor", id,
          "Distributor activated: " # existing.companyName);
        #ok(updated);
      };
    };
  };

  public func suspendDistributor(
    state       : State,
    alertsState : AlertsState,
    caller      : Principal,
    id          : Text,
  ) : CommonTypes.Result<Types.DistributorProfile, Text> {
    switch (state.distributors.get(id)) {
      case null { #err("Distributor not found") };
      case (?existing) {
        let updated = { existing with activationStatus = (#Suspended : Types.ActivationStatus); updatedAt = Time.now() };
        state.distributors.add(id, updated);
        appendAudit(alertsState, caller.toText(), "SUSPEND_DISTRIBUTOR", "distributor", id,
          "Distributor suspended: " # existing.companyName);
        #ok(updated);
      };
    };
  };

  public func addVendorRelationship(
    state         : State,
    alertsState   : AlertsState,
    caller        : Principal,
    distributorId : Text,
    vendorId      : Text,
  ) : CommonTypes.Result<Types.DistributorProfile, Text> {
    switch (state.distributors.get(distributorId)) {
      case null { #err("Distributor not found") };
      case (?existing) {
        if (existing.vendorIds.filter(func(v) { v == vendorId }).size() > 0) {
          return #err("Vendor relationship already exists");
        };
        let updated = { existing with vendorIds = existing.vendorIds.concat([vendorId]); updatedAt = Time.now() };
        state.distributors.add(distributorId, updated);
        appendAudit(alertsState, caller.toText(), "ADD_VENDOR_RELATIONSHIP", "distributor", distributorId,
          "Added vendor " # vendorId # " to distributor " # existing.companyName);
        #ok(updated);
      };
    };
  };

  public func removeVendorRelationship(
    state         : State,
    alertsState   : AlertsState,
    caller        : Principal,
    distributorId : Text,
    vendorId      : Text,
  ) : CommonTypes.Result<Types.DistributorProfile, Text> {
    switch (state.distributors.get(distributorId)) {
      case null { #err("Distributor not found") };
      case (?existing) {
        let updated = { existing with vendorIds = existing.vendorIds.filter(func(v) { v != vendorId }); updatedAt = Time.now() };
        state.distributors.add(distributorId, updated);
        appendAudit(alertsState, caller.toText(), "REMOVE_VENDOR_RELATIONSHIP", "distributor", distributorId,
          "Removed vendor " # vendorId # " from distributor " # existing.companyName);
        #ok(updated);
      };
    };
  };

  public func addResellerToDistributor(
    state         : State,
    alertsState   : AlertsState,
    caller        : Principal,
    distributorId : Text,
    resellerId    : Text,
  ) : CommonTypes.Result<Types.DistributorProfile, Text> {
    switch (state.distributors.get(distributorId)) {
      case null { #err("Distributor not found") };
      case (?existing) {
        if (existing.resellerIds.filter(func(r) { r == resellerId }).size() > 0) {
          return #err("Reseller already linked to this distributor");
        };
        let updated = { existing with resellerIds = existing.resellerIds.concat([resellerId]); updatedAt = Time.now() };
        state.distributors.add(distributorId, updated);
        appendAudit(alertsState, caller.toText(), "ADD_RESELLER_TO_DISTRIBUTOR", "distributor", distributorId,
          "Added reseller " # resellerId # " to distributor " # existing.companyName);
        #ok(updated);
      };
    };
  };

  public func removeResellerFromDistributor(
    state         : State,
    alertsState   : AlertsState,
    caller        : Principal,
    distributorId : Text,
    resellerId    : Text,
  ) : CommonTypes.Result<Types.DistributorProfile, Text> {
    switch (state.distributors.get(distributorId)) {
      case null { #err("Distributor not found") };
      case (?existing) {
        let updated = { existing with resellerIds = existing.resellerIds.filter(func(r) { r != resellerId }); updatedAt = Time.now() };
        state.distributors.add(distributorId, updated);
        appendAudit(alertsState, caller.toText(), "REMOVE_RESELLER_FROM_DISTRIBUTOR", "distributor", distributorId,
          "Removed reseller " # resellerId # " from distributor " # existing.companyName);
        #ok(updated);
      };
    };
  };
};
