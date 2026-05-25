// Authentication types for CHANNELFORGE CRM enterprise auth system
import CompanyTypes "company";

module {
  // ── Core credential types ───────────────────────────────────────────────

  public type PasswordHash = {
    hash : Text;  // hex-encoded SHA-256 of (salt ++ password)
    salt : Text;  // hex-encoded 32-byte random salt
  };

  // ── Auth error variants ──────────────────────────────────────────────────

  public type AuthError = {
    #InvalidCredentials;
    #AccountLocked : { lockedUntil : Int };
    #AccountInactive;
    #UserNotFound;
    #CompanyNotFound;
    #PasswordAuthDisabled;
    #MfaRequired;
    #MfaInvalidCode;
    #MfaNotEnrolled;
    #MfaAlreadyEnrolled;
    #SessionInvalid;
    #SessionExpired;
    #TokenInvalid;
    #TokenExpired;
    #TokenAlreadyUsed;
    #PasswordTooWeak : [Text];   // list of unmet criteria
    #PasswordReused;
    #NotAuthorized;
    #ConfigError : Text;
  };

  // ── Session ──────────────────────────────────────────────────────────────

  public type SessionToken = {
    token      : Text;
    userId     : Text;          // principal as text
    companyId  : Text;
    companyType: CompanyTypes.CompanyType;
    createdAt  : Int;
    expiresAt  : Int;
    mfaVerified: Bool;
    isPendingMfa: Bool;         // true while waiting for TOTP challenge
  };

  // ── Account lockout ──────────────────────────────────────────────────────

  public type LockedAccountInfo = {
    userId      : Text;
    email       : Text;
    fullName    : Text;
    companyId   : Text;
    lockedUntil : Int;          // maxInt = permanent
    failedCount : Nat;
    lockedAt    : Int;
  };

  public type FailedLoginEvent = {
    id          : Text;
    userId      : ?Text;        // null if user not found
    email       : Text;
    companyType : CompanyTypes.CompanyType;
    reason      : Text;
    attemptCount: Nat;
    ipHint      : Text;         // always empty on IC, reserved
    timestamp   : Int;
  };

  // ── Password reset ───────────────────────────────────────────────────────

  public type PasswordResetToken = {
    id        : Text;           // the opaque token value
    userId    : Text;
    email     : Text;
    companyType: CompanyTypes.CompanyType;
    createdAt : Int;
    expiresAt : Int;
    used      : Bool;
    revokedBy : ?Text;          // admin principal as text
  };

  // ── TOTP / MFA ───────────────────────────────────────────────────────────

  public type MfaSetupChallenge = {
    totpSecret  : Text;         // base32 encoded secret (returned once only)
    qrCodeUrl   : Text;         // otpauth:// URI
  };

  // ── Auth state (per-user fields stored alongside UserProfile) ───────────

  public type UserAuthState = {
    userId                : Text;
    companyId             : Text;
    passwordHash          : ?PasswordHash;
    mfaSecret             : ?Text;          // base32 TOTP secret
    mfaPendingSecret      : ?Text;          // during enrollment, not yet confirmed
    mfaRecoveryCodes      : [Text];         // plaintext single-use codes
    mfaEnrolled           : Bool;
    lastPasswordChange    : Int;
    passwordExpiryAt      : ?Int;
    accountLockedUntil    : ?Int;
    failedLoginCount      : Nat;
    previousPasswordHashes: [PasswordHash]; // for reuse prevention
    isActive              : Bool;
    createdAt             : Int;
    updatedAt             : Int;
  };

  // ── SSO config (architecture placeholder) ───────────────────────────────

  public type SSOProvider = {
    #okta;
    #azure_ad;
    #google_workspace;
    #saml;
    #oidc;
    #internet_identity;
    #custom;
    #none;
  };

  public type RoleMapping = {
    providerGroup     : Text;
    channelforgeRole  : Text;
  };

  public type SSOConfig = {
    orgId             : Text;
    provider          : SSOProvider;
    clientId          : Text;
    clientSecret      : Text;   // stored; never returned to frontend
    issuerUrl         : Text;
    metadataUrl       : Text;
    callbackUrl       : Text;
    domainMapping     : [Text];
    roleMapping       : [RoleMapping];
    forceSso          : Bool;
    allowFallbackPassword: Bool;
    enabled           : Bool;
    updatedAt         : Int;
    updatedBy         : Text;
  };

  // ── Per-org auth settings ────────────────────────────────────────────────

  public type AuthSettings = {
    orgId                       : Text;
    // Password policy
    passwordMinLength           : Nat;    // default 8
    passwordMaxLength           : Nat;    // default 128
    passwordComplexityRequired  : Bool;   // default true
    passwordExpiryDays          : Nat;    // 0 = disabled
    passwordReusePreventCount   : Nat;    // default 3
    // Account lockout
    maxFailedAttempts           : Nat;    // default 5
    lockoutDurationMinutes      : Nat;    // default 30
    permanentLockUntilReset     : Bool;   // default false
    lockoutEnabled              : Bool;   // default true
    // MFA
    mfaEnabled                  : Bool;
    mfaRequiredForAll           : Bool;
    mfaRequiredForAdmins        : Bool;
    mfaOptionalEnrollment       : Bool;
    mfaGracePeriodDays          : Nat;    // default 7
    // Auth methods
    passwordLoginEnabled        : Bool;   // default true
    internetIdentityEnabled     : Bool;   // default true
    ssoEnabled                  : Bool;   // default false
    // Session
    sessionTimeoutMinutes       : Nat;    // default 480 (8 hours)
  };

  // ── Admin views ─────────────────────────────────────────────────────────

  public type ActiveResetTokenView = {
    userEmail   : Text;
    tokenPrefix : Text;     // first 8 chars only
    expiresAt   : Int;
    createdAt   : Int;
    userId      : Text;
  };
};
