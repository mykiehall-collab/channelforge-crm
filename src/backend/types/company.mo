// Company and user profile types for CHANNELFORGE CRM
module {
  public type CompanyType = { #Vendor; #Distributor; #Reseller };

  public type ActivationStatus = { #Pending; #Active; #Suspended };

  public type CompanyProfile = {
    id : Text;
    companyType : CompanyType;
    companyName : Text;
    companyId : Text;           // human-readable company ID entered during setup
    emailDomain : Text;
    partnerDomains : [Text];
    logoKey : ?Text;            // object-storage key for company logo
    vendorId : ?Text;           // for reseller companies: links to vendor workspace
    activationStatus : ActivationStatus;
    setupComplete : Bool;
    claimedAt : ?Int;           // timestamp when domain was claimed
    claimedBy : ?Text;          // principal (as text) who claimed the domain
    createdAt : Int;
  };

  public type CompanyProfileInput = {
    companyType : CompanyType;
    companyName : Text;
    companyId : Text;
    emailDomain : Text;
    partnerDomains : [Text];
    logoKey : ?Text;
  };

  public type UserRole = {
    #VendorPrimaryAdmin;           // distinct from VendorAdmin for routing/access
    #VendorAdmin;                  // kept for backward compatibility
    #VendorSecondaryAdmin;
    #DistributorPrimaryAdmin;
    #DistributorSecondaryAdmin;
    #DistributorSalesUser;
    #ResellerPrimaryAdmin;         // distinct from ResellerAdmin for routing/access
    #ResellerAdmin;                // kept for backward compatibility
    #ResellerSalesUser;
    #ReadOnlyViewer;
  };

  public type UserProfile = {
    id : Text; // principal as text
    companyId : Text;
    role : UserRole;
    permissions : [Text]; // for secondary admins
    fullName : Text;
    email : Text;
    isPrimaryAdmin : Bool;
    createdAt : Int;
  };

  public type UserProfileInput = {
    companyId : Text;
    role : UserRole;
    permissions : [Text];
    fullName : Text;
    email : Text;
    isPrimaryAdmin : Bool;
  };

  public type InvitationStatus = { #Pending; #Accepted; #Expired; #Cancelled };

  public type ResidentInvitation = {
    id : Text;
    companyId : Text;
    email : Text;
    role : UserRole;
    invitedBy : Text;  // principal as text
    createdAt : Int;
    expiresAt : Int;
    status : InvitationStatus;
  };

  public type InviteUserInput = {
    companyId : Text;
    email : Text;
    role : UserRole;
  };

  public type ResellerInput = {
    companyName : Text;
    companyId : Text;
    emailDomain : Text;
    logoKey : ?Text;
    primaryAdminEmail : Text;
  };

  // Input provided by Vendor Admin when creating a Distributor company profile.
  // The Distributor Primary Admin receives an invitation to complete setup.
  public type DistributorInput = {
    companyName : Text;
    companyId : Text;
    emailDomain : Text;
    logoKey : ?Text;
    primaryAdminEmail : Text;
  };

  // Full Distributor workspace profile (persisted once the invitation is accepted)
  public type DistributorProfile = {
    id : Text;
    companyName : Text;
    companyId : Text;
    emailDomain : Text;
    logoKey : ?Text;
    primaryAdminEmail : Text;
    vendorIds : [Text];
    resellerIds : [Text];
    activationStatus : ActivationStatus;
    setupComplete : Bool;
    createdAt : Int;
    updatedAt : Int;
  };
};
