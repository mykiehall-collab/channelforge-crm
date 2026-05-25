import Principal "mo:core/Principal";
import AccountsLib "../lib/accounts";
import CommonTypes "../types/common";
import Types "../types/accounts";
import CompanyLib "../lib/company";
import AlertsLib "../lib/alerts";
import Time "mo:core/Time";

mixin (accountsState : AccountsLib.State, companyState : CompanyLib.State, alertsState : AlertsLib.State) {
  // Accounts
  public shared ({ caller }) func createAccount(
    input : Types.AccountInput
  ) : async CommonTypes.Result<Types.Account, Text> {
    AccountsLib.createAccount(accountsState, caller, input);
  };

  public query func checkAccountDuplicate(
    name : Text,
    domain : Text,
  ) : async Types.DuplicateCheckResult {
    AccountsLib.checkAccountDuplicate(accountsState, name, domain);
  };

  public query func getAccount(id : Text) : async ?Types.Account {
    AccountsLib.getAccount(accountsState, id);
  };

  public shared ({ caller }) func updateAccount(
    id : Text,
    input : Types.AccountInput,
  ) : async CommonTypes.Result<Types.Account, Text> {
    AccountsLib.updateAccount(accountsState, caller, id, input);
  };

  public shared ({ caller }) func deleteAccount(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    AccountsLib.deleteAccount(accountsState, caller, id);
  };

  public query ({ caller }) func getAllAccounts() : async [Types.Account] {
    AccountsLib.getAllAccounts(accountsState);
  };

  public query func getAccountsByReseller(
    resellerId : Text
  ) : async [Types.Account] {
    AccountsLib.getAccountsByReseller(accountsState, resellerId);
  };

  public shared ({ caller }) func bulkCreateAccounts(
    inputs : [Types.AccountInput]
  ) : async CommonTypes.BulkImportResult {
    AccountsLib.bulkCreateAccounts(accountsState, caller, inputs);
  };

  // Renewals (derived from accounts)
  public query func getRenewalsDue(daysAhead : Nat) : async [Types.Account] {
    AccountsLib.getRenewalsDue(accountsState, daysAhead);
  };

  public query func getHighRiskAccounts() : async [Types.Account] {
    AccountsLib.getHighRiskAccounts(accountsState);
  };

  // Contacts
  public shared ({ caller }) func createContact(
    input : Types.ContactInput
  ) : async CommonTypes.Result<Types.Contact, Text> {
    AccountsLib.createContact(accountsState, caller, input);
  };

  public query func getContact(id : Text) : async ?Types.Contact {
    AccountsLib.getContact(accountsState, id);
  };

  public shared ({ caller }) func updateContact(
    id : Text,
    input : Types.ContactInput,
  ) : async CommonTypes.Result<Types.Contact, Text> {
    AccountsLib.updateContact(accountsState, caller, id, input);
  };

  public shared ({ caller }) func deleteContact(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    AccountsLib.deleteContact(accountsState, caller, id);
  };

  public query func getContactsByAccount(
    accountId : Text
  ) : async [Types.Contact] {
    AccountsLib.getContactsByAccount(accountsState, accountId);
  };

  public shared ({ caller }) func bulkCreateContacts(
    inputs : [Types.ContactInput]
  ) : async CommonTypes.BulkImportResult {
    AccountsLib.bulkCreateContacts(accountsState, caller, inputs);
  };

  // Notes
  public shared ({ caller }) func createNote(
    input : Types.NoteInput
  ) : async CommonTypes.Result<Types.Note, Text> {
    AccountsLib.createNote(accountsState, caller, input);
  };

  public shared ({ caller }) func updateNote(
    id : Text,
    content : Text,
  ) : async CommonTypes.Result<Types.Note, Text> {
    AccountsLib.updateNote(accountsState, caller, id, content);
  };

  public shared ({ caller }) func deleteNote(
    id : Text
  ) : async CommonTypes.Result<(), Text> {
    AccountsLib.deleteNote(accountsState, caller, id);
  };

  public query func getNotesByAccount(
    accountId : Text
  ) : async [Types.Note] {
    AccountsLib.getNotesByAccount(accountsState, accountId);
  };

  // Reassign an account to a different reseller — vendor admin only
  public shared ({ caller }) func reassignAccountReseller(
    accountId : Text,
    newResellerId : Text,
  ) : async CommonTypes.Result<Types.Account, Text> {
    AccountsLib.reassignAccountReseller(accountsState, companyState, alertsState, caller, accountId, newResellerId);
  };

  // Distributor assignments on an account
  public shared ({ caller }) func addDistributorToAccount(
    accountId     : Text,
    distributorId : Text,
    callerRole    : Text,
  ) : async CommonTypes.Result<Types.Account, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?cp) {
        let allowed = switch (cp.role) {
          case (#VendorPrimaryAdmin)       { true };
          case (#VendorAdmin)              { true };
          case (#DistributorPrimaryAdmin)  { true };
          case (_) { false };
        };
        if (not allowed) { return #err("Not authorised to modify distributor assignments") };
      };
    };
    switch (accountsState.accounts.get(accountId)) {
      case null { #err("Account not found") };
      case (?acc) {
        if (acc.distributorIds.filter(func(d) { d == distributorId }).size() > 0) {
          return #err("Distributor already assigned to this account");
        };
        let updated = { acc with distributorIds = acc.distributorIds.concat([distributorId]); updatedAt = Time.now() };
        accountsState.accounts.add(accountId, updated);
        #ok(updated);
      };
    };
  };

  public shared ({ caller }) func removeDistributorFromAccount(
    accountId     : Text,
    distributorId : Text,
  ) : async CommonTypes.Result<Types.Account, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?cp) {
        switch (cp.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin)        {};
          case (_) { return #err("Only Vendor Admins can remove distributor assignments") };
        };
      };
    };
    switch (accountsState.accounts.get(accountId)) {
      case null { #err("Account not found") };
      case (?acc) {
        let updated = { acc with distributorIds = acc.distributorIds.filter(func(d) { d != distributorId }); updatedAt = Time.now() };
        accountsState.accounts.add(accountId, updated);
        #ok(updated);
      };
    };
  };

  // Account site management
  public shared ({ caller }) func addAccountSite(
    accountId : Text,
    site      : Types.AccountSite,
  ) : async CommonTypes.Result<Types.Account, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?cp) {
        let allowed = switch (cp.role) {
          case (#VendorPrimaryAdmin) { true };
          case (#VendorAdmin)        { true };
          case (_)                   { false };
        };
        if (not allowed) { return #err("Only Vendor Admins can add sites") };
      };
    };
    switch (accountsState.accounts.get(accountId)) {
      case null { #err("Account not found") };
      case (?acc) {
        let updated = { acc with sites = acc.sites.concat([site]); updatedAt = Time.now() };
        accountsState.accounts.add(accountId, updated);
        #ok(updated);
      };
    };
  };

  public shared ({ caller }) func removeAccountSite(
    accountId : Text,
    siteId    : Text,
  ) : async CommonTypes.Result<Types.Account, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?cp) {
        switch (cp.role) {
          case (#VendorPrimaryAdmin) {};
          case (#VendorAdmin)        {};
          case (_) { return #err("Only Vendor Admins can remove sites") };
        };
      };
    };
    switch (accountsState.accounts.get(accountId)) {
      case null { #err("Account not found") };
      case (?acc) {
        let updated = { acc with sites = acc.sites.filter(func(s : Types.AccountSite) : Bool { s.siteId != siteId }); updatedAt = Time.now() };
        accountsState.accounts.add(accountId, updated);
        #ok(updated);
      };
    };
  };

  public shared ({ caller }) func updateAccountSite(
    accountId : Text,
    site      : Types.AccountSite,
  ) : async CommonTypes.Result<Types.Account, Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?cp) {
        let allowed = switch (cp.role) {
          case (#VendorPrimaryAdmin) { true };
          case (#VendorAdmin)        { true };
          case (_)                   { false };
        };
        if (not allowed) { return #err("Only Vendor Admins can update sites") };
      };
    };
    switch (accountsState.accounts.get(accountId)) {
      case null { #err("Account not found") };
      case (?acc) {
        let newSites = acc.sites.map(func(s) {
          if (s.siteId == site.siteId) { site } else { s }
        });
        let updated = { acc with sites = newSites; updatedAt = Time.now() };
        accountsState.accounts.add(accountId, updated);
        #ok(updated);
      };
    };
  };

  // Ownership reassignment log — append an immutable entry
  public shared ({ caller }) func logAccountReassignment(
    accountId : Text,
    entry     : Types.AccountReassignmentEntry,
  ) : async CommonTypes.Result<(), Text> {
    let callerId = caller.toText();
    switch (companyState.userProfiles.get(callerId)) {
      case null { return #err("Caller profile not found") };
      case (?cp) {
        let allowed = switch (cp.role) {
          case (#VendorPrimaryAdmin)       { true };
          case (#VendorAdmin)              { true };
          case (#DistributorPrimaryAdmin)  { true };
          case (#ResellerPrimaryAdmin)     { true };
          case (_) { false };
        };
        if (not allowed) { return #err("Not authorised to log reassignments") };
      };
    };
    switch (accountsState.accounts.get(accountId)) {
      case null { #err("Account not found") };
      case (?acc) {
        let updated = { acc with reassignmentLog = acc.reassignmentLog.concat([entry]); updatedAt = Time.now() };
        accountsState.accounts.add(accountId, updated);
        #ok(());
      };
    };
  };

  public query func getAccountReassignmentLog(
    accountId : Text
  ) : async [Types.AccountReassignmentEntry] {
    switch (accountsState.accounts.get(accountId)) {
      case null { [] };
      case (?acc) { acc.reassignmentLog };
    };
  };

  public query func getAccountsByDistributor(
    distributorId : Text
  ) : async [Types.Account] {
    AccountsLib.getAllAccounts(accountsState).filter(func(a : Types.Account) : Bool {
      a.distributorIds.filter(func(d : Text) : Bool { d == distributorId }).size() > 0
    });
  };

  // Renewal report
  public query func getRenewalReport(
    filters : CommonTypes.ReportFilters
  ) : async [Types.Account] {
    let accounts = AccountsLib.getAllAccounts(accountsState);
    accounts.filter(func(a : Types.Account) : Bool {
      let matchStart = switch (filters.startDate) {
        case null { true };
        case (?sd) { a.renewalDate >= sd };
      };
      let matchEnd = switch (filters.endDate) {
        case null { true };
        case (?ed) { a.renewalDate <= ed };
      };
      let matchPartner = switch (filters.resellerId) {
        case null { true };
        case (?pid) { a.resellerOwnerId == pid };
      };
      matchStart and matchEnd and matchPartner
    });
  };
};
