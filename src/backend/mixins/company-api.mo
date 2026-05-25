import Principal "mo:core/Principal";
import CompanyLib "../lib/company";
import CommonTypes "../types/common";
import Types "../types/company";
import AlertsLib "../lib/alerts";
import NotificationsLib "../lib/notifications";
import NotifTypes "../types/notifications";

mixin (
  companyState : CompanyLib.State,
  alertsState : AlertsLib.State,
  notificationsState : NotificationsLib.State,
) {
  // Create a new vendor or reseller company profile
  public shared ({ caller }) func createCompanyProfile(
    input : Types.CompanyProfileInput
  ) : async CommonTypes.Result<Types.CompanyProfile, Text> {
    CompanyLib.createCompanyProfile(companyState, caller, input);
  };

  // Get a company profile by ID
  public query func getCompanyProfile(id : Text) : async ?Types.CompanyProfile {
    CompanyLib.getCompanyProfile(companyState, id);
  };

  // Get the calling user's own company
  public query ({ caller }) func getMyCompany() : async ?Types.CompanyProfile {
    switch (CompanyLib.getUserProfile(companyState, caller.toText())) {
      case null { null };
      case (?up) { CompanyLib.getCompanyProfile(companyState, up.companyId) };
    };
  };

  // Save or update the calling user's profile
  public shared ({ caller }) func saveUserProfile(
    input : Types.UserProfileInput
  ) : async CommonTypes.Result<Types.UserProfile, Text> {
    CompanyLib.saveUserProfile(companyState, alertsState, caller, input);
  };

  // Get the calling user's profile
  public query ({ caller }) func getMyUserProfile() : async ?Types.UserProfile {
    CompanyLib.getUserProfile(companyState, caller.toText());
  };

  // Vendor admin: grant/update secondary admin permissions
  public shared ({ caller }) func updateSecondaryAdminPermissions(
    userId : Text,
    permissions : [Text],
  ) : async CommonTypes.Result<(), Text> {
    CompanyLib.updateSecondaryAdminPermissions(companyState, caller, userId, permissions);
  };

  // Vendor admin: create a new reseller/partner company and link it to the vendor workspace
  public shared ({ caller }) func createReseller(
    vendorCompanyId : Text,
    input : Types.ResellerInput,
  ) : async CommonTypes.Result<Types.CompanyProfile, Text> {
    CompanyLib.createReseller(companyState, alertsState, caller, vendorCompanyId, input);
  };

  // Vendor admin: activate a pending reseller workspace
  public shared ({ caller }) func activateReseller(
    resellerId : Text
  ) : async CommonTypes.Result<Types.CompanyProfile, Text> {
    let result = CompanyLib.activateReseller(companyState, alertsState, caller, resellerId);
    switch result {
      case (#ok(reseller)) {
        // Find the reseller primary admin and send workspace activated notification
        let resellerUsers = CompanyLib.getUsersByCompany(companyState, resellerId);
        let primaryAdmin = resellerUsers.find(func(u : Types.UserProfile) : Bool { u.isPrimaryAdmin });
        switch primaryAdmin {
          case (?admin) {
            ignore NotificationsLib.createNotification(
              notificationsState,
              Principal.fromText(admin.id),
              #WorkspaceActivated,
              "Workspace Activated",
              "Your partner workspace for " # reseller.companyName # " has been activated. You can now access your full partner portal.",
              ?resellerId,
              ?"company",
            );
            AlertsLib.appendAuditEntry(
              alertsState, caller.toText(), "WORKSPACE_ACTIVATED_NOTIFICATION_SENT",
              "company", resellerId, "Activation notification sent to primary admin " # admin.id,
            );
          };
          case null {};
        };
      };
      case (#err(_)) {};
    };
    result;
  };

  // Primary admin: invite a user to join their company workspace
  public shared ({ caller }) func inviteUser(
    input : Types.InviteUserInput
  ) : async CommonTypes.Result<Types.ResidentInvitation, Text> {
    CompanyLib.inviteUser(companyState, alertsState, caller, input);
  };

  // Get all invitations for a company (primary admin only)
  public query func getInvitations(
    companyId : Text
  ) : async [Types.ResidentInvitation] {
    CompanyLib.getInvitations(companyState, companyId);
  };

  // Cancel an outstanding invitation
  public shared ({ caller }) func cancelInvitation(
    invitationId : Text
  ) : async CommonTypes.Result<(), Text> {
    CompanyLib.cancelInvitation(companyState, alertsState, caller, invitationId);
  };

  // Get all users belonging to a company — vendor can inspect reseller workspace users
  public query func getUsersByCompany(
    companyId : Text
  ) : async [Types.UserProfile] {
    CompanyLib.getUsersByCompany(companyState, companyId);
  };

  // Primary admin: mark company setup as complete and claim the domain
  public shared ({ caller }) func completeSetup(
    companyId : Text
  ) : async CommonTypes.Result<Types.CompanyProfile, Text> {
    CompanyLib.completeSetup(companyState, alertsState, caller, companyId);
  };

  // Vendor admin: deactivate (suspend) a reseller workspace
  public shared ({ caller }) func deactivateReseller(
    resellerId : Text
  ) : async CommonTypes.Result<Types.CompanyProfile, Text> {
    CompanyLib.deactivateReseller(companyState, alertsState, caller, resellerId);
  };

  // Vendor admin: suggest next available Reseller ID for a given prefix within the vendor workspace
  public query func getNextAvailableResellerId(
    vendorId : Text,
    prefix : Text,
  ) : async CommonTypes.Result<Text, Text> {
    CompanyLib.getNextAvailableResellerId(companyState, vendorId, prefix);
  };

  // Get all reseller companies linked to a vendor workspace
  public query func getResellersForVendor(
    vendorId : Text
  ) : async [Types.CompanyProfile] {
    CompanyLib.getResellersForVendor(companyState, vendorId);
  };
};
