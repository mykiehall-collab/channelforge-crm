// User profile detail types for CHANNELFORGE CRM profile personalisation
import CompanyTypes "company";

module {
  // Controls who can view a user profile
  public type ProfileVisibilityScope = {
    #WorkspaceOnly;   // only approved users inside the same workspace
    #ConnectedOnly;   // only approved users in connected vendor/distributor/reseller hierarchy
  };

  public type UserProfileDetail = {
    userId            : Text;
    displayName       : Text;
    email             : Text;
    companyId         : Text;
    companyType       : CompanyTypes.CompanyType;
    userRole          : CompanyTypes.UserRole;
    jobTitle          : Text;
    roleDescription   : ?Text;   // user-controlled optional field
    region            : ?Text;
    timezone          : ?Text;
    linkedInUrl       : ?Text;   // user-controlled optional field
    photoUrl          : ?Text;   // object-storage key; user-controlled optional field
    createdAt         : Int;
    updatedAt         : Int;
    visibilityScope   : ProfileVisibilityScope;
  };

  public type UserProfileDetailInput = {
    displayName     : Text;
    jobTitle        : Text;
    roleDescription : ?Text;
    region          : ?Text;
    timezone        : ?Text;
    linkedInUrl     : ?Text;
    photoUrl        : ?Text;
    visibilityScope : ProfileVisibilityScope;
  };
};
