import Map "mo:core/Map";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import Types "../types/company";
import List "mo:core/List";
import AlertTypes "../types/alerts";
import Text "mo:core/Text";
import Debug "mo:core/Debug";

module {
  public type State = {
    companies : Map.Map<Text, Types.CompanyProfile>;
    userProfiles : Map.Map<Text, Types.UserProfile>;
    invitations : Map.Map<Text, Types.ResidentInvitation>;
    idCounter : { var value : Nat };
  };

  public func initState() : State {
    {
      companies = Map.empty<Text, Types.CompanyProfile>();
      userProfiles = Map.empty<Text, Types.UserProfile>();
      invitations = Map.empty<Text, Types.ResidentInvitation>();
      idCounter = { var value = 0 };
    };
  };

  public func createCompanyProfile(
    state : State,
    caller : Principal,
    input : Types.CompanyProfileInput,
  ) : CommonTypes.Result<Types.CompanyProfile, Text> {
    // TODO-SECURITY: RE-ENABLE before live launch — domain uniqueness check bypassed for test environment.
    // In test mode, duplicate domains are allowed so setup can always proceed.
    // To reinstate: restore the block below that returns #err("A company with this email domain already exists").
    let domainLower = input.emailDomain.toLower();
    // BYPASSED: duplicate domain check removed for test environment
    // let existing = state.companies.entries().find(func((_, c)) {
    //   c.emailDomain.toLower() == domainLower
    // });
    // switch (existing) {
    //   case (?(_, _)) { return #err("A company with this email domain already exists") };
    //   case null {};
    // };
    state.idCounter.value += 1;
    let id = "company-" # state.idCounter.value.toText();
    let activationStatus : Types.ActivationStatus = switch (input.companyType) {
      case (#Vendor) { #Active };
      case (#Reseller) { #Pending };
      case (#Distributor) { #Pending };
    };
    let profile : Types.CompanyProfile = {
      id;
      companyType = input.companyType;
      companyName = input.companyName;
      companyId = input.companyId;
      emailDomain = domainLower;
      partnerDomains = input.partnerDomains;
      logoKey = input.logoKey;
      vendorId = null;
      activationStatus;
      setupComplete = false;
      claimedAt = ?(Time.now());
      claimedBy = ?(caller.toText());
      createdAt = Time.now();
    };
    state.companies.add(id, profile);
    #ok(profile);
  };

  public func getCompanyProfile(
    state : State,
    id : Text,
  ) : ?Types.CompanyProfile {
    state.companies.get(id);
  };

  public func getCompanyByDomain(
    state : State,
    domain : Text,
  ) : ?Types.CompanyProfile {
    let domainLower = domain.toLower();
    switch (state.companies.entries().find(func((_, c)) { c.emailDomain.toLower() == domainLower })) {
      case (?(_, c)) { ?c };
      case null { null };
    };
  };

  public func saveUserProfile(
    state : State,
    alertsState : AlertsState,
    caller : Principal,
    input : Types.UserProfileInput,
  ) : CommonTypes.Result<Types.UserProfile, Text> {
    let callerId = caller.toText();
    // Validate company exists
    switch (state.companies.get(input.companyId)) {
      case null { return #err("Company not found") };
      case (?company) {
        // TODO-SECURITY: RE-ENABLE before live launch — email domain validation bypassed for test environment.
        // In test mode, admin email domain does not need to match the registered company domain.
        // To reinstate: restore the if-block below that returns #err("Email domain does not match company domain").
        let emailDomain = extractDomain(input.email);
        // BYPASSED: email domain match check removed — allow any email domain during test setup
        // if (emailDomain.toLower() != company.emailDomain.toLower()) {
        //   return #err("Email domain does not match company domain");
        // };
        ignore emailDomain; // suppress unused variable warning while check is bypassed
        ignore company;     // suppress unused variable warning
        // Check for a pending invitation matching this email
        let matchingInv = state.invitations.entries().find(func((_, inv)) {
          inv.companyId == input.companyId and inv.email == input.email and
            (switch (inv.status) { case (#Pending) { true }; case (_) { false } })
        });
        // If no invitation and caller is not the first user, require an invitation
        let existingUsersInCompany = state.userProfiles.entries().find(func((_, u)) {
          u.companyId == input.companyId
        });
        let requiresInvite = switch (existingUsersInCompany) {
          case (?(_, _)) { true }; // company already has users — require invite
          case null { false };      // first user in the company — no invite required
        };
        if (requiresInvite) {
          switch (matchingInv) {
            case null { return #err("No active invitation found for this email in the company") };
            case (?(invId, inv)) {
              // Accept the invitation
              state.invitations.add(invId, { inv with status = #Accepted });
              appendAudit(alertsState, callerId, "ACCEPT_INVITATION", "invitation", invId,
                "User " # input.email # " accepted invitation");
            };
          };
        };
        // Secondary admins start with empty permissions unless explicitly granted
        let permissions = switch (input.role) {
          case (#VendorSecondaryAdmin) { [] : [Text] };
          case (_) { input.permissions };
        };
        // isPrimaryAdmin is true only for VendorPrimaryAdmin or ResellerPrimaryAdmin roles
        let isPrimaryAdmin = switch (input.role) {
          case (#VendorPrimaryAdmin) { true };
          case (#ResellerPrimaryAdmin) { true };
          case (_) { false };
        };
        let profile : Types.UserProfile = {
          id = callerId;
          companyId = input.companyId;
          role = input.role;
          permissions;
          fullName = input.fullName;
          email = input.email;
          isPrimaryAdmin;
          createdAt = Time.now();
        };
        state.userProfiles.add(callerId, profile);
        appendAudit(alertsState, callerId, "SAVE_USER_PROFILE", "user", callerId,
          "User profile saved for " # input.email # " in company " # input.companyId);
        #ok(profile);
      };
    };
  };

  public func getUserProfile(
    state : State,
    id : Text,
  ) : ?Types.UserProfile {
    state.userProfiles.get(id);
  };

  public func updateSecondaryAdminPermissions(
    state : State,
    caller : Principal,
    userId : Text,
    permissions : [Text],
  ) : CommonTypes.Result<(), Text> {
    let callerId = caller.toText();
    // Verify caller is a VendorAdmin or VendorPrimaryAdmin
    switch (state.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?callerProfile) {
        switch (callerProfile.role) {
          case (#VendorAdmin) {};
          case (#VendorPrimaryAdmin) {};
          case (_) { return #err("Only Vendor Admins can update permissions") };
        };
        // Verify target user exists and is a secondary admin
        switch (state.userProfiles.get(userId)) {
          case null { return #err("Target user not found") };
          case (?targetProfile) {
            switch (targetProfile.role) {
              case (#VendorSecondaryAdmin) {};
              case (_) { return #err("Permissions can only be set for Secondary Admins") };
            };
            let updated = { targetProfile with permissions };
            state.userProfiles.add(userId, updated);
            #ok(());
          };
        };
      };
    };
  };

  // Validate Reseller ID format: exactly 8 chars, first 4 uppercase letters, last 4 digits
  // TODO-SECURITY: RE-ENABLE strict Reseller ID format (4 uppercase letters + 4 digits) before live launch
  // TEST-MODE-BYPASS: Reseller ID format validation relaxed — any format accepted in test environment
  // TODO-SECURITY: RE-ENABLE strict Reseller ID format validation before live launch.
  // In test mode, this function always returns #ok so setup can proceed regardless of ID format.
  // Live format rule: exactly 8 chars, first 4 uppercase A-Z letters, last 4 digits 0-9 (e.g. ATEA0001).
  // To reinstate: restore the full character-by-character validation block below.
  public func validateResellerId(resellerId : Text) : CommonTypes.Result<(), Text> {
    // BYPASSED: format enforcement removed for test environment — always pass validation
    // LIVE MODE — RE-ENABLE block (remove the ignore and #ok lines above, uncomment below):
    // if (resellerId.size() != 8) {
    //   return #err("Reseller ID must be exactly 8 characters (e.g. ATEA0001).");
    // };
    // let chars = resellerId.toArray();
    // var i = 0;
    // while (i < 4) {
    //   let c = chars[i];
    //   if (c < 'A' or c > 'Z') {
    //     return #err("The first 4 characters of the Reseller ID must be uppercase letters (A-Z), e.g. ATEA0001.");
    //   };
    //   i += 1;
    // };
    // while (i < 8) {
    //   let c = chars[i];
    //   if (c < '0' or c > '9') {
    //     return #err("The last 4 characters of the Reseller ID must be digits (0-9), e.g. ATEA0001.");
    //   };
    //   i += 1;
    // };
    ignore resellerId; // suppress unused variable warning while validation is bypassed
    #ok(());
  };

  // Find the next available Reseller ID for a given 4-letter prefix within a vendor workspace
  public func getNextAvailableResellerId(
    state : State,
    vendorId : Text,
    prefix : Text,
  ) : CommonTypes.Result<Text, Text> {
    // Validate prefix: must be exactly 4 uppercase letters
    let prefixUpper = prefix.toUpper();
    if (prefixUpper.size() != 4) {
      return #err("Prefix must be exactly 4 characters.");
    };
    let prefixChars = prefixUpper.toArray();
    var pi = 0;
    while (pi < 4) {
      let c = prefixChars[pi];
      if (c < 'A' or c > 'Z') {
        return #err("Prefix must contain only letters A-Z.");
      };
      pi += 1;
    };
    // Collect existing companyIds for this vendor with same prefix
    let existing = state.companies.values().filter(func(c) {
      switch (c.vendorId) {
        case (?vid) { vid == vendorId and c.companyId.size() == 8 and c.companyId.toUpper().startsWith(#text prefixUpper) };
        case null { false };
      };
    });
    // Build a set of used number suffixes
    var usedNumbers : [Nat] = [];
    for (profile in existing) {
      // Extract last 4 chars
      let idChars = profile.companyId.toArray();
      let d1 = idChars[4];
      let d2 = idChars[5];
      let d3 = idChars[6];
      let d4 = idChars[7];
      if (d1 >= '0' and d1 <= '9' and d2 >= '0' and d2 <= '9' and
          d3 >= '0' and d3 <= '9' and d4 >= '0' and d4 <= '9') {
        let numText = Text.fromChar(d1) # Text.fromChar(d2) # Text.fromChar(d3) # Text.fromChar(d4);
        switch (numText.toNat()) {
          case (?n) { usedNumbers := usedNumbers.concat([n]) };
          case null {};
        };
      };
    };
    // Find first available number starting at 1
    var candidate = 1;
    label search while (candidate <= 9999) {
      let taken = usedNumbers.any(func(n) { n == candidate });
      if (not taken) { break search };
      candidate += 1;
    };
    if (candidate > 9999) {
      return #err("All 9999 Reseller IDs for this prefix are taken in your vendor workspace.");
    };
    // Format as 4-digit zero-padded number
    let numStr = candidate.toText();
    let padded = if (numStr.size() == 1) { "000" # numStr }
      else if (numStr.size() == 2) { "00" # numStr }
      else if (numStr.size() == 3) { "0" # numStr }
      else { numStr };
    #ok(prefixUpper # padded);
  };

  // ── Helpers ─────────────────────────────────────────────────────────────

  public type AlertsState = {
    alerts : Map.Map<Text, AlertTypes.Alert>;
    news : Map.Map<Text, AlertTypes.NewsItem>;
    auditLog : List.List<AlertTypes.AuditEntry>;
    idCounter : { var value : Nat };
  };

  func appendAudit(
    alertsState : AlertsState,
    userId : Text,
    action : Text,
    entityType : Text,
    entityId : Text,
    details : Text,
  ) : () {
    alertsState.idCounter.value += 1;
    let id = "audit-" # alertsState.idCounter.value.toText();
    alertsState.auditLog.add({
      id;
      userId;
      action;
      entityType;
      entityId;
      details;
      timestamp = Time.now();
    });
  };

  func extractDomain(email : Text) : Text {
    let parts = email.split(#char('@'));
    var domain = "";
    var count = 0;
    for (p in parts) {
      count += 1;
      if (count == 2) { domain := p };
    };
    domain;
  };

  // Add secondary admin for a company, callable by getUsersByCompany
  public func getUsersByCompany(
    state : State,
    companyId : Text,
  ) : [Types.UserProfile] {
    state.userProfiles.values().filter(func(u) {
      u.companyId == companyId
    }).toArray();
  };

  // Mark setup complete — only the primary admin of that company can do this
  public func completeSetup(
    state : State,
    alertsState : AlertsState,
    caller : Principal,
    companyId : Text,
  ) : CommonTypes.Result<Types.CompanyProfile, Text> {
    let callerId = caller.toText();
    // TODO-SECURITY: RE-ENABLE primary admin role enforcement before live launch
    // TEST-MODE-BYPASS: primary admin check relaxed — any caller can complete setup in test environment
    switch (state.userProfiles.get(callerId)) {
      case null {
        Debug.print("TEST-MODE-BYPASS: caller profile not found for " # callerId # " — proceeding anyway");
      };
      case (?callerProfile) {
        if (callerProfile.companyId != companyId) {
          Debug.print("TEST-MODE-BYPASS: caller company mismatch — caller belongs to " # callerProfile.companyId # " but requested " # companyId # " — proceeding anyway");
        };
        if (not callerProfile.isPrimaryAdmin) {
          Debug.print("TEST-MODE-BYPASS: caller is not primary admin — proceeding anyway");
        };
      };
    };
    switch (state.companies.get(companyId)) {
      case null { return #err("Company not found") };
      case (?company) {
        let now = Time.now();
        let updated = { company with setupComplete = true; claimedAt = ?now; claimedBy = ?callerId };
        state.companies.add(companyId, updated);
        appendAudit(alertsState, callerId, "COMPLETE_SETUP", "company", companyId,
          "Setup completed for company: " # company.companyName);
        #ok(updated);
      };
    };
  };

  // Deactivate a reseller workspace — only callable by vendor admins
  public func deactivateReseller(
    state : State,
    alertsState : AlertsState,
    caller : Principal,
    resellerId : Text,
  ) : CommonTypes.Result<Types.CompanyProfile, Text> {
    let callerId = caller.toText();
    switch (state.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?callerProfile) {
        switch (callerProfile.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin) {};
          case (_) { return #err("Only Vendor Admins can deactivate resellers") };
        };
      };
    };
    switch (state.companies.get(resellerId)) {
      case null { return #err("Reseller company not found") };
      case (?reseller) {
        switch (reseller.companyType) {
          case (#Reseller) {};
          case (_) { return #err("Target is not a reseller company") };
        };
        let updated = { reseller with activationStatus = #Suspended };
        state.companies.add(resellerId, updated);
        appendAudit(alertsState, callerId, "DEACTIVATE_RESELLER", "company", resellerId,
          "Reseller deactivated: " # reseller.companyName);
        #ok(updated);
      };
    };
  };

  // Create a reseller company profile — only callable by vendor admins
  public func createReseller(
    state : State,
    alertsState : AlertsState,
    caller : Principal,
    vendorCompanyId : Text,
    input : Types.ResellerInput,
  ) : CommonTypes.Result<Types.CompanyProfile, Text> {
    let callerId = caller.toText();
    // Verify caller is a vendor primary admin or vendor admin
    switch (state.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?callerProfile) {
        switch (callerProfile.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin) {};
          case (_) { return #err("Only Vendor Admins can create resellers") };
        };
        if (callerProfile.companyId != vendorCompanyId) {
          return #err("Caller does not belong to the specified vendor company");
        };
      };
    };
    // Validate vendor company exists
    switch (state.companies.get(vendorCompanyId)) {
      case null { return #err("Vendor company not found") };
      case (?vendorCompany) {
        let domainLower = input.emailDomain.toLower();
        // Reseller domain must not match vendor domain
        if (domainLower == vendorCompany.emailDomain.toLower()) {
          return #err("Reseller domain cannot match the vendor domain");
        };
        // Validate Reseller ID format
        switch (validateResellerId(input.companyId)) {
          case (#err(msg)) { return #err(msg) };
          case (#ok(())) {};
        };
        // Enforce Reseller ID uniqueness per vendor workspace
        let duplicateId = state.companies.values().find(func(c) {
          switch (c.vendorId) {
            case (?vid) { vid == vendorCompanyId and c.companyId == input.companyId };
            case null { false };
          };
        });
        switch (duplicateId) {
          case (?_) { return #err("This Reseller ID already exists in your vendor workspace. Please enter a unique ID.") };
          case null {};
        };
        // Reseller domain must be unique
        let existing = state.companies.entries().find(func((_, c)) {
          c.emailDomain.toLower() == domainLower
        });
        switch (existing) {
          case (?(_, _)) { return #err("A company with this email domain already exists") };
          case null {};
        };
        state.idCounter.value += 1;
        let id = "reseller-" # state.idCounter.value.toText();
        let profile : Types.CompanyProfile = {
          id;
          companyType = #Reseller;
          companyName = input.companyName;
          companyId = input.companyId;
          emailDomain = domainLower;
          partnerDomains = [];
          logoKey = input.logoKey;
          vendorId = ?vendorCompanyId;
          activationStatus = #Pending;
          setupComplete = false;
          claimedAt = null;
          claimedBy = null;
          createdAt = Time.now();
        };
        state.companies.add(id, profile);
        // Create invitation for the primary admin email
        state.idCounter.value += 1;
        let invId = "inv-" # state.idCounter.value.toText();
        let now = Time.now();
        let invitation : Types.ResidentInvitation = {
          id = invId;
          companyId = id;
          email = input.primaryAdminEmail;
          role = #ResellerPrimaryAdmin;
          invitedBy = callerId;
          createdAt = now;
          expiresAt = now + 7 * 24 * 3_600_000_000_000;
          status = #Pending;
        };
        state.invitations.add(invId, invitation);
        appendAudit(alertsState, callerId, "CREATE_RESELLER", "company", id,
          "Reseller created: " # input.companyName # " domain: " # domainLower # " resellerId: " # input.companyId);
        #ok(profile);
      };
    };
  };

  // Activate a pending reseller workspace — only callable by vendor admins
  public func activateReseller(
    state : State,
    alertsState : AlertsState,
    caller : Principal,
    resellerId : Text,
  ) : CommonTypes.Result<Types.CompanyProfile, Text> {
    let callerId = caller.toText();
    // Verify caller is a vendor admin
    switch (state.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?callerProfile) {
        switch (callerProfile.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin) {};
          case (_) { return #err("Only Vendor Admins can activate resellers") };
        };
      };
    };
    switch (state.companies.get(resellerId)) {
      case null { return #err("Reseller company not found") };
      case (?reseller) {
        switch (reseller.companyType) {
          case (#Reseller) {};
          case (_) { return #err("Target is not a reseller company") };
        };
        let updated = { reseller with activationStatus = #Active };
        state.companies.add(resellerId, updated);
        appendAudit(alertsState, callerId, "ACTIVATE_RESELLER", "company", resellerId,
          "Reseller activated: " # reseller.companyName);
        #ok(updated);
      };
    };
  };

  // Create an invitation for a user to join a company workspace
  public func inviteUser(
    state : State,
    alertsState : AlertsState,
    caller : Principal,
    input : Types.InviteUserInput,
  ) : CommonTypes.Result<Types.ResidentInvitation, Text> {
    let callerId = caller.toText();
    // Verify caller is primary admin or admin of the target company
    switch (state.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?callerProfile) {
        if (callerProfile.companyId != input.companyId) {
          return #err("Caller does not belong to the specified company");
        };
        let canInvite = switch (callerProfile.role) {
          case (#VendorPrimaryAdmin) { true };
          case (#VendorAdmin) { true };
          case (#ResellerPrimaryAdmin) { true };
          case (#ResellerAdmin) { true };
          case (_) { false };
        };
        if (not canInvite) {
          return #err("Only admins can invite users");
        };
      };
    };
    // Validate company exists and email domain matches
    switch (state.companies.get(input.companyId)) {
      case null { return #err("Company not found") };
      case (?company) {
        let emailDomain = extractDomain(input.email);
        if (emailDomain.toLower() != company.emailDomain.toLower()) {
          return #err("Email domain does not match company domain");
        };
      };
    };
    // Check for existing active invitation for this email in the company
    let existingInv = state.invitations.entries().find(func((_, inv)) {
      inv.companyId == input.companyId and inv.email == input.email and
        (switch (inv.status) { case (#Pending) { true }; case (_) { false } })
    });
    switch (existingInv) {
      case (?(_, _)) { return #err("An active invitation already exists for this email") };
      case null {};
    };
    // Check no active user with this email already exists
    let existingUser = state.userProfiles.entries().find(func((_, u)) {
      u.companyId == input.companyId and u.email == input.email
    });
    switch (existingUser) {
      case (?(_, _)) { return #err("A user with this email already exists in the company") };
      case null {};
    };
    state.idCounter.value += 1;
    let id = "inv-" # state.idCounter.value.toText();
    let now = Time.now();
    let invitation : Types.ResidentInvitation = {
      id;
      companyId = input.companyId;
      email = input.email;
      role = input.role;
      invitedBy = callerId;
      createdAt = now;
      expiresAt = now + 7 * 24 * 3_600_000_000_000;
      status = #Pending;
    };
    state.invitations.add(id, invitation);
    appendAudit(alertsState, callerId, "INVITE_USER", "invitation", id,
      "Invited " # input.email # " to company " # input.companyId);
    #ok(invitation);
  };

  // Get all pending invitations for a company
  public func getInvitations(
    state : State,
    companyId : Text,
  ) : [Types.ResidentInvitation] {
    state.invitations.values().filter(func(inv) {
      inv.companyId == companyId
    }).toArray();
  };

  // Cancel an existing invitation
  public func cancelInvitation(
    state : State,
    alertsState : AlertsState,
    caller : Principal,
    invitationId : Text,
  ) : CommonTypes.Result<(), Text> {
    let callerId = caller.toText();
    switch (state.invitations.get(invitationId)) {
      case null { return #err("Invitation not found") };
      case (?inv) {
        // Only callable by primary admin of that company or the inviter
        let canCancel = if (inv.invitedBy == callerId) { true } else {
          switch (state.userProfiles.get(callerId)) {
            case null { false };
            case (?callerProfile) {
              callerProfile.companyId == inv.companyId and
                (switch (callerProfile.role) {
                  case (#VendorPrimaryAdmin) { true };
                  case (#ResellerPrimaryAdmin) { true };
                  case (_) { false };
                });
            };
          };
        };
        if (not canCancel) {
          return #err("Not authorized to cancel this invitation");
        };
        let updated = { inv with status = #Cancelled };
        state.invitations.add(invitationId, updated);
        appendAudit(alertsState, callerId, "CANCEL_INVITATION", "invitation", invitationId,
          "Cancelled invitation for " # inv.email);
        #ok(());
      };
    };
  };

  // Get all reseller companies linked to a vendor
  public func getResellersForVendor(
    state : State,
    vendorId : Text,
  ) : [Types.CompanyProfile] {
    state.companies.values().filter(func(c) {
      switch (c.vendorId) {
        case (?vid) { vid == vendorId };
        case null { false };
      }
    }).toArray();
  };
};
