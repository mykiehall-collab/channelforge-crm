import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/accounts";
import List "mo:core/List";
import CompanyLib "../lib/company";

module {
  public type State = {
    accounts : Map.Map<Text, Types.Account>;
    contacts : Map.Map<Text, Types.Contact>;
    notes : Map.Map<Text, Types.Note>;
    idCounter : { var value : Nat };
  };

  public func initState() : State {
    {
      accounts = Map.empty<Text, Types.Account>();
      contacts = Map.empty<Text, Types.Contact>();
      notes = Map.empty<Text, Types.Note>();
      idCounter = { var value = 0 };
    };
  };

  public func createAccount(
    state : State,
    caller : Principal,
    input : Types.AccountInput,
  ) : CommonTypes.Result<Types.Account, Text> {
    let dupCheck = checkAccountDuplicate(state, input.accountName, input.customerDomain);
    if (dupCheck.isDuplicate) {
      return #err("Possible duplicate: " # dupCheck.suggestion);
    };
    state.idCounter.value += 1;
    let now = Time.now();
    let id = "acc-" # state.idCounter.value.toText() # "-" # caller.toText();
    let account : Types.Account = {
      id;
      accountName = input.accountName;
      customerDomain = input.customerDomain;
      customerIdNumber = input.customerIdNumber;
      resellerOwnerId = input.resellerOwnerId;
      vendorOwnerId = input.vendorOwnerId;
      distributorIds = input.distributorIds;
      sites = input.sites;
      reassignmentLog = [];
      renewalDate = input.renewalDate;
      contractType = input.contractType;
      productList = input.productList;
      licenceQuantity = input.licenceQuantity;
      estimatedRenewalValue = input.estimatedRenewalValue;
      status = input.status;
      createdAt = now;
      updatedAt = now;
    };
    state.accounts.add(id, account);
    #ok(account);
  };

  public func checkAccountDuplicate(
    state : State,
    name : Text,
    domain : Text,
  ) : Types.DuplicateCheckResult {
    let domainLower = domain.toLower();
    let nameLower = name.toLower();
    // Exact domain match
    let domainMatch = state.accounts.entries().find(func((_, a)) {
      a.customerDomain.toLower() == domainLower
    });
    switch (domainMatch) {
      case (?(_, a)) {
        return {
          isDuplicate = true;
          existingAccountId = ?a.id;
          existingOwner = ?a.resellerOwnerId;
          matchingDomain = ?a.customerDomain;
          matchType = "domain";
          suggestion = "An account with this domain already exists. Consider updating the existing account instead.";
        };
      };
      case null {};
    };
    // Name similarity (case-insensitive exact match)
    let nameMatch = state.accounts.entries().find(func((_, a)) {
      a.accountName.toLower() == nameLower
    });
    switch (nameMatch) {
      case (?(_, a)) {
        return {
          isDuplicate = true;
          existingAccountId = ?a.id;
          existingOwner = ?a.resellerOwnerId;
          matchingDomain = ?a.customerDomain;
          matchType = "name";
          suggestion = "An account with a similar name already exists. Please verify this is not a duplicate.";
        };
      };
      case null {};
    };
    {
      isDuplicate = false;
      existingAccountId = null;
      existingOwner = null;
      matchingDomain = null;
      matchType = "none";
      suggestion = "No duplicates found. Safe to create.";
    };
  };

  public func getAccount(
    state : State,
    id : Text,
  ) : ?Types.Account {
    state.accounts.get(id);
  };

  public func updateAccount(
    state : State,
    caller : Principal,
    id : Text,
    input : Types.AccountInput,
  ) : CommonTypes.Result<Types.Account, Text> {
    switch (state.accounts.get(id)) {
      case null { #err("Account not found") };
      case (?existing) {
        let callerId = caller.toText();
        // Allow: reseller owner, vendor owner, or any vendor admin (checked by mixin)
        let now = Time.now();
        let updated : Types.Account = {
          existing with
          accountName = input.accountName;
          customerDomain = input.customerDomain;
          resellerOwnerId = input.resellerOwnerId;
          vendorOwnerId = input.vendorOwnerId;
          renewalDate = input.renewalDate;
          contractType = input.contractType;
          productList = input.productList;
          licenceQuantity = input.licenceQuantity;
          estimatedRenewalValue = input.estimatedRenewalValue;
          status = input.status;
          updatedAt = now;
        };
        state.accounts.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteAccount(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.accounts.get(id)) {
      case null { #err("Account not found") };
      case (?_) {
        state.accounts.remove(id);
        #ok(());
      };
    };
  };

  public func getAllAccounts(state : State) : [Types.Account] {
    state.accounts.values().toArray();
  };

  public func getAccountsByReseller(
    state : State,
    resellerId : Text,
  ) : [Types.Account] {
    state.accounts.values().filter(func(a) { a.resellerOwnerId == resellerId }).toArray();
  };

  public func bulkCreateAccounts(
    state : State,
    caller : Principal,
    inputs : [Types.AccountInput],
  ) : CommonTypes.BulkImportResult {
    var created = 0;
    var skipped = 0;
    let errors = List.empty<Text>();
    for (input in inputs.values()) {
      switch (createAccount(state, caller, input)) {
        case (#ok(_)) { created += 1 };
        case (#err(e)) {
          skipped += 1;
          errors.add(e);
        };
      };
    };
    { created; skipped; errors = errors.toArray() };
  };

  public func getRenewalsDue(
    state : State,
    daysAhead : Nat,
  ) : [Types.Account] {
    let now = Time.now();
    let cutoff = now + daysAhead.toInt() * 86_400_000_000_000;
    state.accounts.values().filter(func(a) {
      a.renewalDate >= now and a.renewalDate <= cutoff
    }).toArray();
  };

  public func getHighRiskAccounts(state : State) : [Types.Account] {
    let now = Time.now();
    let cutoff = now + 90 * 86_400_000_000_000;
    state.accounts.values().filter(func(a) {
      let isRiskStatus = switch (a.status) {
        case (#Active) { true };
        case (#AtRisk) { true };
        case (_) { false };
      };
      isRiskStatus and a.renewalDate >= now and a.renewalDate <= cutoff
    }).toArray();
  };

  // --- Contacts ---

  public func createContact(
    state : State,
    caller : Principal,
    input : Types.ContactInput,
  ) : CommonTypes.Result<Types.Contact, Text> {
    switch (state.accounts.get(input.accountId)) {
      case null { return #err("Account not found") };
      case (?_) {};
    };
    state.idCounter.value += 1;
    let id = "con-" # state.idCounter.value.toText();
    let contact : Types.Contact = {
      id;
      accountId = input.accountId;
      firstName = input.firstName;
      lastName = input.lastName;
      jobTitle = input.jobTitle;
      email = input.email;
      phone = input.phone;
      contactOwner = input.contactOwner;
      contactType = input.contactType;
      notes = input.notes;
      lastContactedDate = input.lastContactedDate;
      nextActionDate = input.nextActionDate;
      createdAt = Time.now();
    };
    state.contacts.add(id, contact);
    #ok(contact);
  };

  public func getContact(
    state : State,
    id : Text,
  ) : ?Types.Contact {
    state.contacts.get(id);
  };

  public func updateContact(
    state : State,
    caller : Principal,
    id : Text,
    input : Types.ContactInput,
  ) : CommonTypes.Result<Types.Contact, Text> {
    switch (state.contacts.get(id)) {
      case null { #err("Contact not found") };
      case (?existing) {
        let updated : Types.Contact = {
          existing with
          accountId = input.accountId;
          firstName = input.firstName;
          lastName = input.lastName;
          jobTitle = input.jobTitle;
          email = input.email;
          phone = input.phone;
          contactOwner = input.contactOwner;
          contactType = input.contactType;
          notes = input.notes;
          lastContactedDate = input.lastContactedDate;
          nextActionDate = input.nextActionDate;
        };
        state.contacts.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteContact(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.contacts.get(id)) {
      case null { #err("Contact not found") };
      case (?_) {
        state.contacts.remove(id);
        #ok(());
      };
    };
  };

  public func getContactsByAccount(
    state : State,
    accountId : Text,
  ) : [Types.Contact] {
    state.contacts.values().filter(func(c) { c.accountId == accountId }).toArray();
  };

  public func bulkCreateContacts(
    state : State,
    caller : Principal,
    inputs : [Types.ContactInput],
  ) : CommonTypes.BulkImportResult {
    var created = 0;
    var skipped = 0;
    let errors = List.empty<Text>();
    for (input in inputs.values()) {
      switch (createContact(state, caller, input)) {
        case (#ok(_)) { created += 1 };
        case (#err(e)) {
          skipped += 1;
          errors.add(e);
        };
      };
    };
    { created; skipped; errors = errors.toArray() };
  };

  // --- Notes ---

  public func createNote(
    state : State,
    caller : Principal,
    input : Types.NoteInput,
  ) : CommonTypes.Result<Types.Note, Text> {
    switch (state.accounts.get(input.accountId)) {
      case null { return #err("Account not found") };
      case (?_) {};
    };
    state.idCounter.value += 1;
    let id = "note-" # state.idCounter.value.toText();
    let note : Types.Note = {
      id;
      accountId = input.accountId;
      content = input.content;
      authorId = caller.toText();
      authorName = input.authorName;
      authorRole = input.authorRole;
      createdAt = Time.now();
      updatedAt = null;
      editedBy = null;
    };
    state.notes.add(id, note);
    #ok(note);
  };

  public func updateNote(
    state : State,
    caller : Principal,
    id : Text,
    content : Text,
  ) : CommonTypes.Result<Types.Note, Text> {
    switch (state.notes.get(id)) {
      case null { #err("Note not found") };
      case (?existing) {
        let callerId = caller.toText();
        if (existing.authorId != callerId) {
          return #err("Only the note author can edit this note");
        };
        let updated : Types.Note = {
          existing with
          content;
          updatedAt = ?Time.now();
          editedBy = ?callerId;
        };
        state.notes.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteNote(
    state : State,
    caller : Principal,
    id : Text,
  ) : CommonTypes.Result<(), Text> {
    switch (state.notes.get(id)) {
      case null { #err("Note not found") };
      case (?existing) {
        let callerId = caller.toText();
        if (existing.authorId != callerId) {
          return #err("Only the note author can delete this note");
        };
        state.notes.remove(id);
        #ok(());
      };
    };
  };

  public func getNotesByAccount(
    state : State,
    accountId : Text,
  ) : [Types.Note] {
    state.notes.values().filter(func(n) { n.accountId == accountId }).toArray();
  };

  // Vendor admin only: reassign an account to a different reseller partner
  public func reassignAccountReseller(
    state : State,
    companyState : CompanyLib.State,
    alertsState : CompanyLib.AlertsState,
    caller : Principal,
    accountId : Text,
    newResellerId : Text,
  ) : CommonTypes.Result<Types.Account, Text> {
    let callerId = caller.toText();
    // Verify caller is a vendor primary admin or vendor admin
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?callerProfile) {
        switch (callerProfile.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin) {};
          case (_) { return #err("Only Vendor Admins can reassign accounts") };
        };
      };
    };
    // Verify new reseller exists
    switch (companyState.companies.get(newResellerId)) {
      case null { return #err("New reseller company not found") };
      case (?company) {
        switch (company.companyType) {
          case (#Reseller) {};
          case (_) { return #err("Target company is not a reseller") };
        };
      };
    };
    switch (state.accounts.get(accountId)) {
      case null { return #err("Account not found") };
      case (?account) {
        let oldResellerId = account.resellerOwnerId;
        let updated = { account with resellerOwnerId = newResellerId; updatedAt = Time.now() };
        state.accounts.add(accountId, updated);
        // Log audit entry
        alertsState.idCounter.value += 1;
        let auditId = "audit-" # alertsState.idCounter.value.toText();
        alertsState.auditLog.add({
          id = auditId;
          userId = callerId;
          action = "REASSIGN_ACCOUNT_RESELLER";
          entityType = "account";
          entityId = accountId;
          details = "Reassigned from reseller " # oldResellerId # " to " # newResellerId;
          timestamp = Time.now();
        });
        #ok(updated);
      };
    };
  };
};
