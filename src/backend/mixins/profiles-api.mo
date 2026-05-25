import Principal "mo:core/Principal";
import ProfilesLib "../lib/profiles";
import CompanyLib "../lib/company";
import CommonTypes "../types/common";
import Types "../types/profiles";

mixin (
  profilesState : ProfilesLib.State,
  companyState  : CompanyLib.State,
) {
  // Update (or create) the caller's own profile details
  public shared ({ caller }) func updateMyProfile(
    input : Types.UserProfileDetailInput
  ) : async CommonTypes.Result<Types.UserProfileDetail, Text> {
    ProfilesLib.createOrUpdateProfile(
      profilesState,
      companyState.userProfiles,
      companyState.companies,
      caller,
      input,
    );
  };

  // Get the caller's own profile
  public query ({ caller }) func getMyProfile() : async ?Types.UserProfileDetail {
    let callerId = caller.toText();
    ProfilesLib.getProfile(
      profilesState,
      companyState.userProfiles,
      callerId,
      callerId,
    );
  };

  // Get another user's profile — subject to visibility rules
  public query ({ caller }) func getUserProfile(
    targetUserId : Text
  ) : async ?Types.UserProfileDetail {
    ProfilesLib.getProfile(
      profilesState,
      companyState.userProfiles,
      targetUserId,
      caller.toText(),
    );
  };

  // List all profiles visible to the caller within a specific workspace
  public query ({ caller }) func listWorkspaceProfiles(
    companyId : Text
  ) : async [Types.UserProfileDetail] {
    ProfilesLib.listProfilesForWorkspace(
      profilesState,
      companyState.userProfiles,
      companyId,
      caller.toText(),
    );
  };
};
