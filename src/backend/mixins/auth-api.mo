// Auth API mixin for CHANNELFORGE CRM — exposes all public auth endpoints
import Principal "mo:core/Principal";
import AuthLib "../lib/auth";
import CompanyLib "../lib/company";
import AlertsLib "../lib/alerts";
import CommonTypes "../types/common";
import AuthTypes "../types/auth";
import CompanyTypes "../types/company";

mixin (
  authState    : AuthLib.State,
  companyState : CompanyLib.State,
  alertsState  : AlertsLib.State,
) {
  // ── Session management ───────────────────────────────────────────────────

  /// Login with email + password.
  /// Returns a SessionToken; if MFA is enrolled the session will have isPendingMfa=true.
  public shared func loginWithEmailPassword(
    email       : Text,
    password    : Text,
    companyType : CompanyTypes.CompanyType,
    companyId   : Text,
  ) : async CommonTypes.Result<AuthTypes.SessionToken, AuthTypes.AuthError> {
    let settings = AuthLib.getAuthSettings(authState, companyId);
    let allUsers = companyState.userProfiles.entries().toArray();
    AuthLib.loginWithEmailPassword(
      authState, alertsState, allUsers,
      email, password, companyType, companyId, settings,
    );
  };

  /// Validate an active session token.
  public query func validateSession(
    token : Text
  ) : async CommonTypes.Result<AuthTypes.SessionToken, AuthTypes.AuthError> {
    AuthLib.validateSession(authState, token);
  };

  /// Revoke (log out) the given session.
  public shared func logout(token : Text) : async () {
    AuthLib.logout(authState, token);
  };

  /// Revoke all active sessions for a user (admin action or self after password reset).
  public shared ({ caller }) func revokeAllSessions(
    userId : Text
  ) : async () {
    AuthLib.revokeAllSessions(authState, userId);
  };

  // ── Account lockout management ───────────────────────────────────────────

  /// Admin: list all currently locked accounts in an org.
  public query func getLockedAccounts(
    companyId : Text
  ) : async [AuthTypes.LockedAccountInfo] {
    AuthLib.getLockedAccounts(authState, companyId);
  };

  /// Admin: unlock a specific user account.
  public shared ({ caller }) func unlockUserAccount(
    userId : Text,
    reason : Text,
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    AuthLib.unlockUserAccount(authState, alertsState, userId, caller.toText(), reason);
  };

  /// Admin: view failed login history for a user.
  public query func getFailedLoginHistory(
    userId : Text,
    limit  : Nat,
  ) : async [AuthTypes.FailedLoginEvent] {
    AuthLib.getFailedLoginHistory(authState, userId, limit);
  };

  // ── Password management ──────────────────────────────────────────────────

  /// Set or change a user's password. The caller must be authenticated.
  public shared ({ caller }) func setPassword(
    newPassword : Text,
    companyId   : Text,
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    let settings = AuthLib.getAuthSettings(authState, companyId);
    AuthLib.setPasswordForUser(authState, alertsState, caller.toText(), newPassword, settings);
  };

  /// Initiate password reset — generates a single-use token displayed on-screen.
  public shared func forgotPassword(
    email       : Text,
    companyType : CompanyTypes.CompanyType,
    companyId   : Text,
  ) : async CommonTypes.Result<AuthTypes.PasswordResetToken, AuthTypes.AuthError> {
    let allUsers = companyState.userProfiles.entries().toArray();
    AuthLib.forgotPassword(authState, alertsState, allUsers, email, companyType, companyId);
  };

  /// Consume a reset token and set a new password.
  public shared func resetPasswordWithToken(
    tokenValue  : Text,
    newPassword : Text,
    companyId   : Text,
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    let settings = AuthLib.getAuthSettings(authState, companyId);
    AuthLib.resetPasswordWithToken(authState, alertsState, tokenValue, newPassword, settings);
  };

  /// Admin: revoke an active password reset token.
  public shared ({ caller }) func revokePasswordResetToken(
    tokenValue : Text
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    AuthLib.revokePasswordResetToken(authState, alertsState, tokenValue, caller.toText());
  };

  /// Admin: list all active (unused, unexpired) reset tokens for an org.
  public query func getActiveResetTokens(
    companyId : Text
  ) : async [AuthTypes.ActiveResetTokenView] {
    AuthLib.getActiveResetTokens(authState, companyId);
  };

  // ── TOTP MFA ─────────────────────────────────────────────────────────────

  /// Begin MFA enrollment — returns TOTP secret and QR code URL.
  public shared func setupMfa(
    sessionToken : Text
  ) : async CommonTypes.Result<AuthTypes.MfaSetupChallenge, AuthTypes.AuthError> {
    switch (AuthLib.validateSession(authState, sessionToken)) {
      case (#err(e))  { #err(e) };
      case (#ok(sess)) {
        AuthLib.setupMfa(authState, alertsState, sess);
      };
    };
  };

  /// Confirm MFA enrollment by verifying the first TOTP code.
  /// Returns the 10 backup recovery codes.
  public shared func verifyMfaEnrollment(
    sessionToken : Text,
    totpCode     : Text,
  ) : async CommonTypes.Result<[Text], AuthTypes.AuthError> {
    switch (AuthLib.validateSession(authState, sessionToken)) {
      case (#err(e))  { #err(e) };
      case (#ok(sess)) {
        AuthLib.verifyMfaEnrollment(authState, alertsState, sess, totpCode);
      };
    };
  };

  /// Validate a TOTP code (or recovery code) for a pending-MFA session.
  public shared func validateMfaToken(
    sessionToken : Text,
    totpCode     : Text,
    companyId    : Text,
  ) : async CommonTypes.Result<AuthTypes.SessionToken, AuthTypes.AuthError> {
    switch (AuthLib.validateSession(authState, sessionToken)) {
      case (#err(e))  { #err(e) };
      case (#ok(sess)) {
        let settings = AuthLib.getAuthSettings(authState, companyId);
        AuthLib.validateMfaToken(authState, alertsState, sess, totpCode, settings);
      };
    };
  };

  /// Admin: reset MFA for a user, clearing their TOTP secret and recovery codes.
  public shared ({ caller }) func resetMfaForUser(
    userId : Text
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    AuthLib.resetMfaForUser(authState, alertsState, userId, caller.toText());
  };

  /// User: regenerate backup recovery codes (invalidates old ones).
  public shared func regenerateRecoveryCodes(
    sessionToken : Text
  ) : async CommonTypes.Result<[Text], AuthTypes.AuthError> {
    switch (AuthLib.validateSession(authState, sessionToken)) {
      case (#err(e))  { #err(e) };
      case (#ok(sess)) {
        AuthLib.regenerateRecoveryCodes(authState, alertsState, sess);
      };
    };
  };

  // ── Auth settings ────────────────────────────────────────────────────────

  /// Get auth settings for an org (returns defaults if not yet configured).
  public query func getAuthSettings(
    orgId : Text
  ) : async AuthTypes.AuthSettings {
    AuthLib.getAuthSettings(authState, orgId);
  };

  /// Admin: update auth settings for an org.
  public shared ({ caller }) func updateAuthSettings(
    orgId    : Text,
    settings : AuthTypes.AuthSettings,
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    AuthLib.updateAuthSettings(authState, alertsState, orgId, settings, caller.toText());
  };

  // ── User activation / deactivation ──────────────────────────────────────

  /// Admin: deactivate a user (blocks login, revokes sessions).
  public shared ({ caller }) func deactivateUser(
    userId : Text
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    AuthLib.deactivateUser(authState, alertsState, userId, caller.toText());
  };

  /// Admin: reactivate a previously deactivated user.
  public shared ({ caller }) func activateUser(
    userId : Text
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    AuthLib.activateUser(authState, alertsState, userId, caller.toText());
  };

  // ── Initialize user auth state ───────────────────────────────────────────

  /// Initialize auth state for a newly created user profile.
  public shared ({ caller }) func initUserAuthState(
    userId    : Text,
    companyId : Text,
  ) : async () {
    AuthLib.initUserAuthState(authState, userId, companyId);
  };

  // ── SSO config (architecture placeholder) ────────────────────────────────

  /// Admin: save SSO configuration (placeholder — no functional SSO in this phase).
  public shared ({ caller }) func updateSsoConfig(
    orgId  : Text,
    config : AuthTypes.SSOConfig,
  ) : async CommonTypes.Result<(), AuthTypes.AuthError> {
    AuthLib.updateSsoConfig(authState, alertsState, orgId, config, caller.toText());
  };

  /// Get SSO configuration for an org.
  public query func getSsoConfig(
    orgId : Text
  ) : async ?AuthTypes.SSOConfig {
    AuthLib.getSsoConfig(authState, orgId);
  };
};
