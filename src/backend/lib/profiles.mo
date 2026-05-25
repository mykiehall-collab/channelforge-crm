import Map "mo:core/Map";
import Time "mo:core/Time";
import CommonTypes "../types/common";
import Types "../types/profiles";
import CompanyTypes "../types/company";

module {
  public type State = {
    profileDetails : Map.Map<Text, Types.UserProfileDetail>;
  };

  public func initState() : State {
    {
      profileDetails = Map.empty<Text, Types.UserProfileDetail>();
    };
  };

  // Create or update the caller's profile detail.
  // Core identity fields are sourced from the authoritative UserProfile in companyState.
  public func createOrUpdateProfile(
    state        : State,
    userProfiles : Map.Map<Text, CompanyTypes.UserProfile>,
    companies    : Map.Map<Text, CompanyTypes.CompanyProfile>,
    caller       : Principal,
    input        : Types.UserProfileDetailInput,
  ) : CommonTypes.Result<Types.UserProfileDetail, Text> {
    let userId = caller.toText();
    switch (userProfiles.get(userId)) {
      case null { return #err("No user profile found for caller") };
      case (?up) {
        let companyType : CompanyTypes.CompanyType = switch (companies.get(up.companyId)) {
          case null  { #Vendor };
          case (?c)  { c.companyType };
        };
        let now = Time.now();
        let detail : Types.UserProfileDetail = {
          userId;
          displayName     = input.displayName;
          email           = up.email;
          companyId       = up.companyId;
          companyType;
          userRole        = up.role;
          jobTitle        = input.jobTitle;
          roleDescription = input.roleDescription;
          region          = input.region;
          timezone        = input.timezone;
          linkedInUrl     = input.linkedInUrl;
          photoUrl        = input.photoUrl;
          createdAt       = switch (state.profileDetails.get(userId)) {
            case null  { now };
            case (?ex) { ex.createdAt };
          };
          updatedAt       = now;
          visibilityScope = input.visibilityScope;
        };
        state.profileDetails.add(userId, detail);
        #ok(detail);
      };
    };
  };

  // Retrieve a profile — enforces visibility rules
  public func getProfile(
    state        : State,
    userProfiles : Map.Map<Text, CompanyTypes.UserProfile>,
    targetUserId : Text,
    callerId     : Text,
  ) : ?Types.UserProfileDetail {
    switch (state.profileDetails.get(targetUserId)) {
      case null { null };
      case (?detail) {
        if (targetUserId == callerId) { return ?detail };
        switch (userProfiles.get(callerId)) {
          case null { null };
          case (?callerUp) {
            switch (detail.visibilityScope) {
              case (#WorkspaceOnly) {
                if (callerUp.companyId == detail.companyId) { ?detail } else { null };
              };
              case (#ConnectedOnly) { ?detail };
            };
          };
        };
      };
    };
  };

  public func listProfilesForWorkspace(
    state        : State,
    userProfiles : Map.Map<Text, CompanyTypes.UserProfile>,
    companyId    : Text,
    callerId     : Text,
  ) : [Types.UserProfileDetail] {
    switch (userProfiles.get(callerId)) {
      case null { return [] };
      case (?callerUp) {
        if (callerUp.companyId != companyId) { return [] };
      };
    };
    state.profileDetails.values().filter(func(d) { d.companyId == companyId }).toArray();
  };
};
