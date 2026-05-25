// Authentication domain logic for CHANNELFORGE CRM
// Implements: password hashing, session management, account lockout,
// token-based password reset, TOTP MFA, SSO config storage, auth settings.
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Int "mo:core/Int";
import Blob "mo:core/Blob";
import Char "mo:core/Char";
import CommonTypes "../types/common";
import AuthTypes "../types/auth";
import CompanyTypes "../types/company";
import AlertTypes "../types/alerts";

module {
  // ── State ──────────────────────────────────────────────────────────────────

  public type AlertsState = {
    alerts    : Map.Map<Text, AlertTypes.Alert>;
    news      : Map.Map<Text, AlertTypes.NewsItem>;
    auditLog  : List.List<AlertTypes.AuditEntry>;
    idCounter : { var value : Nat };
  };

  public type State = {
    userAuthStates : Map.Map<Text, AuthTypes.UserAuthState>;
    activeSessions : Map.Map<Text, AuthTypes.SessionToken>;
    resetTokens    : Map.Map<Text, AuthTypes.PasswordResetToken>;
    failedLoginLog : List.List<AuthTypes.FailedLoginEvent>;
    authSettings   : Map.Map<Text, AuthTypes.AuthSettings>;
    ssoConfigs     : Map.Map<Text, AuthTypes.SSOConfig>;
    idCounter      : { var value : Nat };
  };

  public func initState() : State {
    {
      userAuthStates = Map.empty<Text, AuthTypes.UserAuthState>();
      activeSessions = Map.empty<Text, AuthTypes.SessionToken>();
      resetTokens    = Map.empty<Text, AuthTypes.PasswordResetToken>();
      failedLoginLog = List.empty<AuthTypes.FailedLoginEvent>();
      authSettings   = Map.empty<Text, AuthTypes.AuthSettings>();
      ssoConfigs     = Map.empty<Text, AuthTypes.SSOConfig>();
      idCounter      = { var value = 0 };
    };
  };

  // ── Default auth settings ──────────────────────────────────────────────────

  func defaultAuthSettings(orgId : Text) : AuthTypes.AuthSettings {
    {
      orgId;
      passwordMinLength          = 8;
      passwordMaxLength          = 128;
      passwordComplexityRequired = true;
      passwordExpiryDays         = 0;
      passwordReusePreventCount  = 3;
      maxFailedAttempts          = 5;
      lockoutDurationMinutes     = 30;
      permanentLockUntilReset    = false;
      lockoutEnabled             = true;
      mfaEnabled                 = false;
      mfaRequiredForAll          = false;
      mfaRequiredForAdmins       = false;
      mfaOptionalEnrollment      = true;
      mfaGracePeriodDays         = 7;
      passwordLoginEnabled       = true;
      internetIdentityEnabled    = true;
      ssoEnabled                 = false;
      sessionTimeoutMinutes      = 480;
    };
  };

  public func getAuthSettings(state : State, orgId : Text) : AuthTypes.AuthSettings {
    switch (state.authSettings.get(orgId)) {
      case (?s) s;
      case null defaultAuthSettings(orgId);
    };
  };

  public func updateAuthSettings(
    state       : State,
    alertsState : AlertsState,
    orgId       : Text,
    settings    : AuthTypes.AuthSettings,
    adminId     : Text,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    let old = getAuthSettings(state, orgId);
    state.authSettings.add(orgId, { settings with orgId });
    appendAuthAudit(
      alertsState, adminId, "auth_settings_changed", "authentication", orgId,
      "Auth settings updated. old_max_attempts=" # old.maxFailedAttempts.toText() #
        " new_max_attempts=" # settings.maxFailedAttempts.toText(),
    );
    #ok(())
  };

  // ── SHA-256 (pure Motoko) ──────────────────────────────────────────────────
  // Round constants
  let sha256K : [Nat32] = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  func rotr32(x : Nat32, n : Nat32) : Nat32 {
    (x >> n) | (x << (32 - n))
  };

  // Encode a big-endian 64-bit value as 8 bytes
  func nat64ToBytes(v : Nat64) : [Nat8] {
    Array.tabulate<Nat8>(8, func(i) {
      let shift = Nat64.fromNat((7 - i) * 8);
      Nat8.fromNat(((v >> shift) & 0xFF).toNat())
    })
  };

  func sha256Bytes(data : [Nat8]) : [Nat8] {
    let msgLen   = data.size();
    let bitLen   = Nat64.fromNat(msgLen) * 8;
    let padLen   = if ((msgLen + 9) % 64 == 0) { 0 } else { 64 - ((msgLen + 9) % 64) };
    let totalLen = msgLen + 1 + padLen + 8;
    let lenBytes = nat64ToBytes(bitLen);
    let padded   = Array.tabulate<Nat8>(totalLen, func(i) {
      if      (i < msgLen)         { data[i] }
      else if (i == msgLen)        { 0x80 }
      else if (i < totalLen - 8)   { 0x00 }
      else                         { lenBytes[i - (totalLen - 8)] }
    });
    var h0 : Nat32 = 0x6a09e667; var h1 : Nat32 = 0xbb67ae85;
    var h2 : Nat32 = 0x3c6ef372; var h3 : Nat32 = 0xa54ff53a;
    var h4 : Nat32 = 0x510e527f; var h5 : Nat32 = 0x9b05688c;
    var h6 : Nat32 = 0x1f83d9ab; var h7 : Nat32 = 0x5be0cd19;
    var cs = 0;
    while (cs < padded.size()) {
      // Build message schedule as mutable array (can't self-reference in tabulate)
      // Build full 64-word schedule (mutable array sized 64 from the start)
      let wv = Array.tabulate<Nat32>(64, func(i) {
        if (i < 16) {
          let b = cs + i * 4;
          (Nat32.fromNat(padded[b].toNat())   << 24) |
          (Nat32.fromNat(padded[b+1].toNat()) << 16) |
          (Nat32.fromNat(padded[b+2].toNat()) << 8)  |
           Nat32.fromNat(padded[b+3].toNat())
        } else { 0 }
      }).toVarArray();
      // Extend to 64 words
      var wi = 16;
      while (wi < 64) {
        let s0 = rotr32(wv[wi-15], 7)  ^ rotr32(wv[wi-15], 18) ^ (wv[wi-15] >> 3);
        let s1 = rotr32(wv[wi-2],  17) ^ rotr32(wv[wi-2],  19) ^ (wv[wi-2]  >> 10);
        wv[wi] := wv[wi-16] +% s0 +% wv[wi-7] +% s1;
        wi += 1;
      };
      let wf = wv;
      var a = h0; var b = h1; var c = h2; var d = h3;
      var e = h4; var f = h5; var g = h6; var h = h7;
      var i = 0;
      while (i < 64) {
        let S1    = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
        let ch    = (e & f) ^ ((^e) & g);
        let temp1 = h +% S1 +% ch +% sha256K[i] +% wf[i];
        let S0    = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
        let maj   = (a & b) ^ (a & c) ^ (b & c);
        let temp2 = S0 +% maj;
        h := g; g := f; f := e; e := d +% temp1;
        d := c; c := b; b := a; a := temp1 +% temp2;
        i += 1;
      };
      h0 +%= a; h1 +%= b; h2 +%= c; h3 +%= d;
      h4 +%= e; h5 +%= f; h6 +%= g; h7 +%= h;
      cs += 64;
    };
    func w4(v : Nat32) : [Nat8] {
      [
        Nat8.fromNat((v >> 24).toNat() % 256),
        Nat8.fromNat((v >> 16).toNat() % 256),
        Nat8.fromNat((v >> 8).toNat()  % 256),
        Nat8.fromNat(v.toNat()        % 256),
      ]
    };
    w4(h0).concat(w4(h1)).concat(w4(h2)).concat(w4(h3))
          .concat(w4(h4)).concat(w4(h5)).concat(w4(h6)).concat(w4(h7))
  };

  func bytesToHex(bytes : [Nat8]) : Text {
    let hexChars : [Char] = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    var result = "";
    for (bv in bytes.values()) {
      result := result #
        Text.fromChar(hexChars[(bv >> 4).toNat()]) #
        Text.fromChar(hexChars[(bv & 0x0F).toNat()]);
    };
    result
  };

  func textToBytes(t : Text) : [Nat8] {
    t.encodeUtf8().toArray()
  };

  func hexNibble(c : Char) : Nat {
    let n = c.toNat32();
    if (c >= '0' and c <= '9') { (n - '0'.toNat32()).toNat() }
    else if (c >= 'a' and c <= 'f') { (n - 'a'.toNat32()).toNat() + 10 }
    else if (c >= 'A' and c <= 'F') { (n - 'A'.toNat32()).toNat() + 10 }
    else 0
  };

  func hexToBytes(hex : Text) : [Nat8] {
    let chars = hex.toArray();
    let len   = chars.size();
    Array.tabulate<Nat8>(len / 2, func(i) {
      Nat8.fromNat((hexNibble(chars[i * 2]) * 16 + hexNibble(chars[i * 2 + 1])) % 256)
    })
  };

  func generateSalt(state : State) : Text {
    state.idCounter.value += 1;
    let combined = textToBytes(Time.now().toText() # state.idCounter.value.toText());
    bytesToHex(sha256Bytes(combined))
  };

  func hashPassword(password : Text, salt : Text) : Text {
    bytesToHex(sha256Bytes(hexToBytes(salt).concat(textToBytes(password))))
  };

  public func makePasswordHash(state : State, password : Text) : AuthTypes.PasswordHash {
    let salt = generateSalt(state);
    { hash = hashPassword(password, salt); salt }
  };

  func passwordMatchesHash(password : Text, ph : AuthTypes.PasswordHash) : Bool {
    hashPassword(password, ph.salt) == ph.hash
  };

  // ── Weak password list ─────────────────────────────────────────────────────

  func isWeakPassword(password : Text) : Bool {
    let lower = password.toLower();
    lower == "password"    or lower == "password1"   or lower == "password123" or
    lower == "123456"      or lower == "12345678"    or lower == "qwerty"       or
    lower == "abc123"      or lower == "letmein"     or lower == "monkey"       or
    lower == "1234567890"  or lower == "admin"       or lower == "admin123"     or
    lower == "admin1234"   or lower == "welcome"     or lower == "welcome1"     or
    lower == "iloveyou"    or lower == "sunshine"    or lower == "princess"     or
    lower == "dragon"      or lower == "master"      or lower == "login"        or
    lower == "login123"    or lower == "test123"     or lower == "pass"         or
    lower == "pass123"
  };

  // ── Password validation ────────────────────────────────────────────────────

  public func validatePassword(
    settings : AuthTypes.AuthSettings,
    password : Text,
  ) : [Text] {
    var errors : [Text] = [];
    let len = password.size();
    if (len < settings.passwordMinLength) {
      errors := errors.concat(["Minimum " # settings.passwordMinLength.toText() # " characters required"]);
    };
    if (settings.passwordMaxLength > 0 and len > settings.passwordMaxLength) {
      errors := errors.concat(["Maximum " # settings.passwordMaxLength.toText() # " characters allowed"]);
    };
    if (settings.passwordComplexityRequired) {
      let chars = password.toArray();
      let hasUpper  = chars.any(func(c : Char) : Bool { c >= 'A' and c <= 'Z' });
      let hasLower  = chars.any(func(c : Char) : Bool { c >= 'a' and c <= 'z' });
      let hasDigit  = chars.any(func(c : Char) : Bool { c >= '0' and c <= '9' });
      let hasSymbol = chars.any(func(c : Char) : Bool {
        not ((c >= 'A' and c <= 'Z') or (c >= 'a' and c <= 'z') or (c >= '0' and c <= '9'))
      });
      if (not hasUpper)  errors := errors.concat(["At least 1 uppercase letter required"]);
      if (not hasLower)  errors := errors.concat(["At least 1 lowercase letter required"]);
      if (not hasDigit)  errors := errors.concat(["At least 1 number required"]);
      if (not hasSymbol) errors := errors.concat(["At least 1 special character required"]);
    };
    if (isWeakPassword(password)) {
      errors := errors.concat(["Password is too common — choose a stronger password"]);
    };
    errors
  };

  func isPasswordReused(
    newPassword    : Text,
    previousHashes : [AuthTypes.PasswordHash],
    maxCount       : Nat,
  ) : Bool {
    let toCheck = if (previousHashes.size() <= maxCount) { previousHashes }
                  else { previousHashes.sliceToArray(0, maxCount.toInt()) };
    toCheck.any(func(ph : AuthTypes.PasswordHash) : Bool {
      passwordMatchesHash(newPassword, ph)
    })
  };

  // ── Token generation ───────────────────────────────────────────────────────

  func generateToken(state : State, prefix : Text) : Text {
    state.idCounter.value += 1;
    let seed = textToBytes(Time.now().toText() # "-" # state.idCounter.value.toText() # "-" # prefix);
    bytesToHex(sha256Bytes(seed))
  };

  func tokenPrefix(token : Text) : Text {
    var result = "";
    var i = 0;
    for (c in token.toArray().values()) {
      if (i < 8) { result := result # Text.fromChar(c); i += 1; };
    };
    result
  };

  // ── Session management ─────────────────────────────────────────────────────

  public func createSession(
    state        : State,
    userId       : Text,
    companyId    : Text,
    companyType  : CompanyTypes.CompanyType,
    settings     : AuthTypes.AuthSettings,
    mfaVerified  : Bool,
    isPendingMfa : Bool,
  ) : AuthTypes.SessionToken {
    let token     = generateToken(state, "sess");
    let now       = Time.now();
    let expiresAt = now + settings.sessionTimeoutMinutes.toInt() * 60_000_000_000;
    let session : AuthTypes.SessionToken = {
      token; userId; companyId; companyType;
      createdAt = now; expiresAt; mfaVerified; isPendingMfa;
    };
    state.activeSessions.add(token, session);
    session
  };

  public func validateSession(
    state : State,
    token : Text,
  ) : CommonTypes.Result<AuthTypes.SessionToken, AuthTypes.AuthError> {
    switch (state.activeSessions.get(token)) {
      case null    { #err(#SessionInvalid) };
      case (?sess) {
        if (Time.now() > sess.expiresAt) {
          state.activeSessions.remove(token);
          #err(#SessionExpired)
        } else {
          #ok(sess)
        }
      };
    };
  };

  public func logout(state : State, token : Text) : () {
    state.activeSessions.remove(token);
  };

  public func revokeAllSessions(state : State, userId : Text) : () {
    let toRemove = state.activeSessions.entries()
      .filter(func((_, s) : (Text, AuthTypes.SessionToken)) : Bool { s.userId == userId })
      .map(func((k, _)) { k })
      .toArray();
    for (k in toRemove.values()) {
      state.activeSessions.remove(k);
    };
  };

  // ── Permanent-lock sentinel (Int.maxInt does not exist in mo:core) ───────────
  // 2^62 - 1 nanoseconds ~= year 2178; effectively permanent for our purposes
  func permanentLockSentinel() : Int { 4_611_686_018_427_387_903 };

  // ── Login with email + password ────────────────────────────────────────────

  public func loginWithEmailPassword(
    state        : State,
    alertsState  : AlertsState,
    companyUsers : [(Text, CompanyTypes.UserProfile)],
    email        : Text,
    password     : Text,
    companyType  : CompanyTypes.CompanyType,
    companyId    : Text,
    orgSettings  : AuthTypes.AuthSettings,
  ) : CommonTypes.Result<AuthTypes.SessionToken, AuthTypes.AuthError> {
    // TODO-SECURITY: Remove test bypass before live launch
    // Fast-path for the three seeded test accounts — bypasses hash verification
    // so test logins work regardless of salt/hash state after redeploys.
    let testBypass : ?(Text, Text, CompanyTypes.CompanyType) =
      if (email == "vendor@test.channelforge.net" and password == "Test1234!") {
        ?("test-user-vendor", "test-vendor-001", #Vendor)
      } else if (email == "distributor@test.channelforge.net" and password == "Test1234!") {
        ?("test-user-distributor", "test-distributor-001", #Distributor)
      } else if (email == "reseller@test.channelforge.net" and password == "Test1234!") {
        ?("test-user-reseller", "test-reseller-001", #Reseller)
      } else {
        null
      };
    switch (testBypass) {
      case (?(testUserId, testCompanyId, testCompanyType)) {
        // Ensure auth state exists for this test user (idempotent)
        switch (state.userAuthStates.get(testUserId)) {
          case null {
            initUserAuthState(state, testUserId, testCompanyId);
          };
          case (?_) {};
        };
        let testSettings = getAuthSettings(state, testCompanyId);
        let session = createSession(state, testUserId, testCompanyId, testCompanyType, testSettings, true, false);
        appendAuthAudit(alertsState, testUserId, "auth_login", "authentication", testUserId, "Test account login bypass");
        return #ok(session);
      };
      case null {};
    };
    let matchingUser = companyUsers.find(func((_, u) : (Text, CompanyTypes.UserProfile)) : Bool {
      u.email == email and u.companyId == companyId
    });
    let (userId, _up) = switch (matchingUser) {
      case null {
        logFailedLogin(state, alertsState, null, email, companyType, "User not found", 0);
        return #err(#UserNotFound);
      };
      case (?pair) { pair };
    };
    if (not orgSettings.passwordLoginEnabled) {
      return #err(#PasswordAuthDisabled);
    };
    let authSt = switch (state.userAuthStates.get(userId)) {
      case null {
        logFailedLogin(state, alertsState, ?userId, email, companyType, "No auth state", 0);
        return #err(#InvalidCredentials);
      };
      case (?s) s;
    };
    if (not authSt.isActive) { return #err(#AccountInactive) };
    // Lockout check
    if (orgSettings.lockoutEnabled) {
      switch (authSt.accountLockedUntil) {
        case (?lu) {
          if (lu >= permanentLockSentinel() or Time.now() < lu) {
            return #err(#AccountLocked { lockedUntil = lu });
          };
          // Auto-unlock: lockout expired
          state.userAuthStates.add(userId, { authSt with accountLockedUntil = null; failedLoginCount = 0 });
        };
        case null {};
      };
    };
    let ph = switch (authSt.passwordHash) {
      case null {
        logFailedLogin(state, alertsState, ?userId, email, companyType, "No password set", authSt.failedLoginCount);
        return #err(#InvalidCredentials);
      };
      case (?h) h;
    };
    if (not passwordMatchesHash(password, ph)) {
      let newCount = authSt.failedLoginCount + 1;
      let now      = Time.now();
      var lockedUntil : ?Int = authSt.accountLockedUntil;
      if (orgSettings.lockoutEnabled and newCount >= orgSettings.maxFailedAttempts) {
        if (orgSettings.permanentLockUntilReset) {
          lockedUntil := ?permanentLockSentinel();
        } else {
          lockedUntil := ?(now + orgSettings.lockoutDurationMinutes.toInt() * 60_000_000_000);
        };
        appendAuthAudit(alertsState, userId, "auth_account_locked", "authentication", userId,
          "Account locked after " # newCount.toText() # " failed attempts");
      };
      state.userAuthStates.add(userId, {
        authSt with
        failedLoginCount   = newCount;
        accountLockedUntil = lockedUntil;
        updatedAt          = now;
      });
      logFailedLogin(state, alertsState, ?userId, email, companyType, "Invalid password", newCount);
      return #err(#InvalidCredentials);
    };
    // Success: reset fail counter
    let now = Time.now();
    state.userAuthStates.add(userId, { authSt with failedLoginCount = 0; accountLockedUntil = null; updatedAt = now });
    let mfaRequired = orgSettings.mfaRequiredForAll or (orgSettings.mfaEnabled and authSt.mfaEnrolled);
    if (mfaRequired and authSt.mfaEnrolled) {
      let session = createSession(state, userId, companyId, companyType, orgSettings, false, true);
      appendAuthAudit(alertsState, userId, "auth_login", "authentication", userId, "Password login; MFA required");
      return #ok(session);
    };
    let session = createSession(state, userId, companyId, companyType, orgSettings, true, false);
    appendAuthAudit(alertsState, userId, "auth_login", "authentication", userId, "Password login; method=password");
    #ok(session)
  };

  // ── Account lockout management ─────────────────────────────────────────────

  public func getLockedAccounts(state : State, companyId : Text) : [AuthTypes.LockedAccountInfo] {
    let now = Time.now();
    state.userAuthStates.values().filter(func(a : AuthTypes.UserAuthState) : Bool {
      a.companyId == companyId and (
        switch (a.accountLockedUntil) {
          case (?until) { until >= permanentLockSentinel() or now < until };
          case null     { false };
        }
      )
    }).map<AuthTypes.UserAuthState, AuthTypes.LockedAccountInfo>(func(a) {
      {
        userId      = a.userId;
        email       = "";
        fullName    = "";
        companyId   = a.companyId;
        lockedUntil = switch (a.accountLockedUntil) { case (?u) u; case null 0 };
        failedCount = a.failedLoginCount;
        lockedAt    = a.updatedAt;
      }
    }).toArray()
  };

  public func unlockUserAccount(
    state       : State,
    alertsState : AlertsState,
    userId      : Text,
    adminId     : Text,
    reason      : Text,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    switch (state.userAuthStates.get(userId)) {
      case null { #err(#UserNotFound) };
      case (?a) {
        state.userAuthStates.add(userId, { a with accountLockedUntil = null; failedLoginCount = 0; updatedAt = Time.now() });
        appendAuthAudit(alertsState, adminId, "auth_account_unlocked", "authentication", userId,
          "Unlocked by " # adminId # ". Reason: " # reason);
        #ok(())
      };
    };
  };

  public func getFailedLoginHistory(
    state  : State,
    userId : Text,
    limit  : Nat,
  ) : [AuthTypes.FailedLoginEvent] {
    state.failedLoginLog.reverseValues()
      .filter(func(e : AuthTypes.FailedLoginEvent) : Bool {
        switch (e.userId) { case (?uid) uid == userId; case null false }
      })
      .take(limit)
      .toArray()
  };

  // ── Password reset (token-based, no email) ─────────────────────────────────

  func resetTokenTtlNs() : Int { 15 * 60 * 1_000_000_000 };

  public func forgotPassword(
    state        : State,
    alertsState  : AlertsState,
    companyUsers : [(Text, CompanyTypes.UserProfile)],
    email        : Text,
    companyType  : CompanyTypes.CompanyType,
    companyId    : Text,
  ) : CommonTypes.Result<AuthTypes.PasswordResetToken, AuthTypes.AuthError> {
    let matchingUser = companyUsers.find(func((_, u) : (Text, CompanyTypes.UserProfile)) : Bool {
      u.email == email and u.companyId == companyId
    });
    let (userId, _) = switch (matchingUser) {
      case null { return #err(#UserNotFound) };
      case (?p) p;
    };
    let token = generateToken(state, "reset");
    let now   = Time.now();
    let rt : AuthTypes.PasswordResetToken = {
      id = token; userId; email; companyType;
      createdAt = now; expiresAt = now + resetTokenTtlNs();
      used = false; revokedBy = null;
    };
    state.resetTokens.add(token, rt);
    appendAuthAudit(alertsState, userId, "auth_password_reset_request", "authentication", userId,
      "Reset token generated; prefix=" # tokenPrefix(token));
    #ok(rt)
  };

  public func resetPasswordWithToken(
    state       : State,
    alertsState : AlertsState,
    tokenValue  : Text,
    newPassword : Text,
    orgSettings : AuthTypes.AuthSettings,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    let rt = switch (state.resetTokens.get(tokenValue)) {
      case null  { return #err(#TokenInvalid) };
      case (?t)  t;
    };
    if (rt.used)                   { return #err(#TokenAlreadyUsed) };
    if (rt.revokedBy != null)      { return #err(#TokenInvalid) };
    if (Time.now() > rt.expiresAt) { return #err(#TokenExpired) };
    let errors = validatePassword(orgSettings, newPassword);
    if (errors.size() > 0) { return #err(#PasswordTooWeak errors) };
    let authSt = switch (state.userAuthStates.get(rt.userId)) {
      case null  { return #err(#UserNotFound) };
      case (?s)  s;
    };
    if (isPasswordReused(newPassword, authSt.previousPasswordHashes, orgSettings.passwordReusePreventCount)) {
      return #err(#PasswordReused);
    };
    let newHash    = makePasswordHash(state, newPassword);
    let updatedPrev = switch (authSt.passwordHash) {
      case null  authSt.previousPasswordHashes;
      case (?h)  [h].concat(authSt.previousPasswordHashes)
                    .sliceToArray(0, orgSettings.passwordReusePreventCount.toInt());
    };
    let now = Time.now();
    state.userAuthStates.add(rt.userId, {
      authSt with
      passwordHash           = ?newHash;
      previousPasswordHashes = updatedPrev;
      lastPasswordChange     = now;
      passwordExpiryAt       = if (orgSettings.passwordExpiryDays > 0)
                                 ?(now + orgSettings.passwordExpiryDays.toInt() * 86_400_000_000_000)
                               else null;
      updatedAt              = now;
    });
    state.resetTokens.add(tokenValue, { rt with used = true });
    revokeAllSessions(state, rt.userId);
    appendAuthAudit(alertsState, rt.userId, "auth_password_reset_success", "authentication", rt.userId,
      "Password reset via token; prefix=" # tokenPrefix(tokenValue));
    #ok(())
  };

  public func revokePasswordResetToken(
    state       : State,
    alertsState : AlertsState,
    tokenValue  : Text,
    adminId     : Text,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    switch (state.resetTokens.get(tokenValue)) {
      case null  { #err(#TokenInvalid) };
      case (?t) {
        if (t.used) { return #err(#TokenAlreadyUsed) };
        state.resetTokens.add(tokenValue, { t with revokedBy = ?adminId });
        appendAuthAudit(alertsState, adminId, "auth_token_revoked", "authentication", t.userId,
          "Reset token revoked by " # adminId);
        #ok(())
      };
    };
  };

  public func getActiveResetTokens(
    state     : State,
    _companyId : Text,
  ) : [AuthTypes.ActiveResetTokenView] {
    let now = Time.now();
    state.resetTokens.values().filter(func(t : AuthTypes.PasswordResetToken) : Bool {
      not t.used and t.revokedBy == null and now < t.expiresAt
    }).map<AuthTypes.PasswordResetToken, AuthTypes.ActiveResetTokenView>(func(t) {
      {
        userEmail   = t.email;
        tokenPrefix = tokenPrefix(t.id);
        expiresAt   = t.expiresAt;
        createdAt   = t.createdAt;
        userId      = t.userId;
      }
    }).toArray()
  };

  // ── SHA-1 (for TOTP/HMAC-SHA1) ──────────────────────────────────────────────

  func sha1Bytes(data : [Nat8]) : [Nat8] {
    var h0 : Nat32 = 0x67452301; var h1 : Nat32 = 0xEFCDAB89;
    var h2 : Nat32 = 0x98BADCFE; var h3 : Nat32 = 0x10325476;
    var h4 : Nat32 = 0xC3D2E1F0;
    let msgLen   = data.size();
    let bitLen   = Nat64.fromNat(msgLen) * 8;
    let padLen   = if ((msgLen + 9) % 64 == 0) { 0 } else { 64 - ((msgLen + 9) % 64) };
    let totalLen = msgLen + 1 + padLen + 8;
    let lenBytes = nat64ToBytes(bitLen);
    let padded   = Array.tabulate<Nat8>(totalLen, func(i) {
      if      (i < msgLen)         { data[i] }
      else if (i == msgLen)        { 0x80 }
      else if (i < totalLen - 8)   { 0x00 }
      else                         { lenBytes[i - (totalLen - 8)] }
    });
    var ck = 0;
    while (ck < padded.size()) {
      // Build message schedule as mutable array
      // Build full 80-word schedule (mutable array sized 80 from the start)
      let wv1 = Array.tabulate<Nat32>(80, func(i) {
        if (i < 16) {
          let b = ck + i * 4;
          (Nat32.fromNat(padded[b].toNat())   << 24) |
          (Nat32.fromNat(padded[b+1].toNat()) << 16) |
          (Nat32.fromNat(padded[b+2].toNat()) << 8)  |
           Nat32.fromNat(padded[b+3].toNat())
        } else { 0 }
      }).toVarArray();
      // Extend to 80 words for SHA-1
      var wi1 = 16;
      while (wi1 < 80) {
        let v1 = wv1[wi1-3] ^ wv1[wi1-8] ^ wv1[wi1-14] ^ wv1[wi1-16];
        wv1[wi1] := (v1 << 1) | (v1 >> 31);
        wi1 += 1;
      };
      let wf1 = wv1;
      var a = h0; var b = h1; var c = h2; var d = h3; var e = h4;
      var i = 0;
      while (i < 80) {
        let (f, k) : (Nat32, Nat32) =
          if      (i < 20) { ((b & c) | ((^b) & d),        0x5A827999) }
          else if (i < 40) { (b ^ c ^ d,                    0x6ED9EBA1) }
          else if (i < 60) { ((b & c) | (b & d) | (c & d), 0x8F1BBCDC) }
          else             { (b ^ c ^ d,                    0xCA62C1D6) };
        let temp = ((a << 5) | (a >> 27)) +% f +% e +% k +% wf1[i];
        e := d; d := c; c := (b << 30) | (b >> 2); b := a; a := temp;
        i += 1;
      };
      h0 +%= a; h1 +%= b; h2 +%= c; h3 +%= d; h4 +%= e;
      ck += 64;
    };
    func w4(v : Nat32) : [Nat8] {
      [
        Nat8.fromNat((v >> 24).toNat() % 256),
        Nat8.fromNat((v >> 16).toNat() % 256),
        Nat8.fromNat((v >> 8).toNat()  % 256),
        Nat8.fromNat(v.toNat()         % 256),
      ]
    };
    w4(h0).concat(w4(h1)).concat(w4(h2)).concat(w4(h3)).concat(w4(h4))
  };

  func hmacSha1(key : [Nat8], msg : [Nat8]) : [Nat8] {
    let bk = 64;
    let normKey : [Nat8] = if (key.size() > bk) { sha1Bytes(key) }
                           else {
                             key.concat(Array.tabulate<Nat8>(bk - key.size(), func(_) { 0x00 }))
                           };
    let ipad = normKey.map(func(bv) { bv ^ 0x36 });
    let opad = normKey.map(func(bv) { bv ^ 0x5C });
    sha1Bytes(opad.concat(sha1Bytes(ipad.concat(msg))))
  };

  // base32 alphabet (RFC 4648)
  let b32Alpha : [Char] = [
    'A','B','C','D','E','F','G','H','I','J','K','L','M',
    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
    '2','3','4','5','6','7',
  ];

  func base32Decode(encoded : Text) : [Nat8] {
    let input  = encoded.toUpper().toArray().filter(func(c : Char) : Bool { c != '=' });
    var bits   : Nat32 = 0;
    var bLeft  : Nat = 0;
    var output : [Nat8] = [];
    for (c in input.values()) {
      let idx = b32Alpha.findIndex(func(ch : Char) : Bool { ch == c });
      let val : Nat32 = switch (idx) { case (?i) Nat32.fromNat(i); case null 0 };
      bits  := (bits << 5) | val;
      bLeft += 5;
      if (bLeft >= 8) {
        bLeft  -= 8;
        output := output.concat([
           Nat8.fromNat(((bits >> Nat32.fromNat(bLeft)) & 0xFF).toNat() % 256)
        ]);
      };
    };
    output
  };

  func base32Encode(bytes : [Nat8]) : Text {
    var result = "";
    var i = 0;
    while (i + 5 <= bytes.size()) {
      let b0 = Nat64.fromNat(bytes[i].toNat());
      let b1 = Nat64.fromNat(bytes[i+1].toNat());
      let b2 = Nat64.fromNat(bytes[i+2].toNat());
      let b3 = Nat64.fromNat(bytes[i+3].toNat());
      let b4 = Nat64.fromNat(bytes[i+4].toNat());
      let chunk = (b0 << 32) | (b1 << 24) | (b2 << 16) | (b3 << 8) | b4;
      var k = 7;
      var row = "";
      while (k >= 0) {
        let idx = ((chunk >> Nat64.fromNat(k * 5)) & 0x1F).toNat();
        row := row # Text.fromChar(b32Alpha[idx]);
        k -= 1;
      };
      result := result # row;
      i += 5;
    };
    // Handle remaining bytes (partial group)
    if (i < bytes.size()) {
      var accum : Nat64 = 0;
      var rem = 0;
      while (i + rem < bytes.size()) {
        accum := (accum << 8) | Nat64.fromNat(bytes[i + rem].toNat());
        rem += 1;
      };
      let numChars = (rem * 8 + 4) / 5;
      let padBits = Nat64.fromNat((5 - rem) * 8);
      accum := accum << padBits;
      var k = numChars;
      var row = "";
      while (k > 0) {
        k -= 1;
        let idx = ((accum >> Nat64.fromNat(k * 5)) & 0x1F).toNat();
        row := row # Text.fromChar(b32Alpha[idx]);
      };
      result := result # row;
    };
    result
  };

  func generateTotpSecret(state : State) : Text {
    state.idCounter.value += 1;
    let seed = textToBytes(Time.now().toText() # "-totp-" # state.idCounter.value.toText());
    base32Encode(sha256Bytes(seed).sliceToArray(0, 20))
  };

  func nat64TimestepToBytes(step : Nat64) : [Nat8] {
    Array.tabulate<Nat8>(8, func(i) {
      let shift = Nat64.fromNat((7 - i) * 8);
      Nat8.fromNat(((step >> shift) & 0xFF).toNat())
    })
  };

  func computeTotp(secret : Text, timeStep : Int) : Text {
    let keyBytes = base32Decode(secret);
    let step64   = if (timeStep < 0) { 0 : Nat64 } else { Nat64.fromNat(timeStep.toNat()) };
    let msgBytes = nat64TimestepToBytes(step64);
    let mac      = hmacSha1(keyBytes, msgBytes);
    let offset   = mac[19].toNat() % 16;
    let b0 = Nat32.fromNat(mac[offset].toNat())   & 0x7F;
    let b1 = Nat32.fromNat(mac[offset+1].toNat()) & 0xFF;
    let b2 = Nat32.fromNat(mac[offset+2].toNat()) & 0xFF;
    let b3 = Nat32.fromNat(mac[offset+3].toNat()) & 0xFF;
    let code = ((b0 << 24) | (b1 << 16) | (b2 << 8) | b3).toNat() % 1_000_000;
    let s    = code.toText();
    var pad  = "";
    var p    = s.size();
    while (p < 6) { pad := pad # "0"; p += 1 };
    pad # s
  };

  func validateTotpCode(secret : Text, code : Text) : Bool {
    let step30 = Time.now() / 30_000_000_000;
    computeTotp(secret, step30 - 1) == code or
    computeTotp(secret, step30)     == code or
    computeTotp(secret, step30 + 1) == code
  };

  func generateRecoveryCodes(state : State) : [Text] {
    Array.tabulate<Text>(10, func(i) {
      state.idCounter.value += 1;
      let seed = textToBytes(Time.now().toText() # "-rc-" # i.toText() # "-" # state.idCounter.value.toText());
      var result = "";
      var j = 0;
      for (c in bytesToHex(sha256Bytes(seed)).toArray().values()) {
        if (j < 10) { result := result # Text.fromChar(c); j += 1; };
      };
      result
    })
  };

  // ── MFA functions ───────────────────────────────────────────────────────────────

  public func setupMfa(
    state        : State,
    alertsState  : AlertsState,
    sessionToken : AuthTypes.SessionToken,
  ) : CommonTypes.Result<AuthTypes.MfaSetupChallenge, AuthTypes.AuthError> {
    switch (state.userAuthStates.get(sessionToken.userId)) {
      case null { #err(#UserNotFound) };
      case (?a) {
        if (a.mfaEnrolled) { return #err(#MfaAlreadyEnrolled) };
        let secret    = generateTotpSecret(state);
        let qrCodeUrl = "otpauth://totp/CHANNELFORGE%20CRM:" # sessionToken.userId #
                        "?secret=" # secret # "&issuer=CHANNELFORGE%20CRM&algorithm=SHA1&digits=6&period=30";
        state.userAuthStates.add(sessionToken.userId, { a with mfaPendingSecret = ?secret; updatedAt = Time.now() });
        #ok({ totpSecret = secret; qrCodeUrl })
      };
    };
  };

  public func verifyMfaEnrollment(
    state        : State,
    alertsState  : AlertsState,
    sessionToken : AuthTypes.SessionToken,
    totpCode     : Text,
  ) : CommonTypes.Result<[Text], AuthTypes.AuthError> {
    let authSt = switch (state.userAuthStates.get(sessionToken.userId)) {
      case null  { return #err(#UserNotFound) };
      case (?s)  s;
    };
    let pending = switch (authSt.mfaPendingSecret) {
      case null  { return #err(#MfaNotEnrolled) };
      case (?s)  s;
    };
    if (not validateTotpCode(pending, totpCode)) { return #err(#MfaInvalidCode) };
    let codes = generateRecoveryCodes(state);
    state.userAuthStates.add(sessionToken.userId, {
      authSt with
      mfaSecret = ?pending; mfaPendingSecret = null;
      mfaRecoveryCodes = codes; mfaEnrolled = true;
      updatedAt = Time.now();
    });
    appendAuthAudit(alertsState, sessionToken.userId, "auth_mfa_enrolled", "authentication", sessionToken.userId,
      "MFA enrolled; method=totp");
    #ok(codes)
  };

  public func validateMfaToken(
    state        : State,
    alertsState  : AlertsState,
    sessionToken : AuthTypes.SessionToken,
    totpCode     : Text,
    _orgSettings : AuthTypes.AuthSettings,
  ) : CommonTypes.Result<AuthTypes.SessionToken, AuthTypes.AuthError> {
    let authSt = switch (state.userAuthStates.get(sessionToken.userId)) {
      case null  { return #err(#UserNotFound) };
      case (?s)  s;
    };
    if (not authSt.mfaEnrolled) { return #err(#MfaNotEnrolled) };
    let secret = switch (authSt.mfaSecret) {
      case null  { return #err(#MfaNotEnrolled) };
      case (?s)  s;
    };
    var validated    = false;
    var usedRecovery = false;
    if (validateTotpCode(secret, totpCode)) {
      validated := true;
    } else {
      let codeIdx = authSt.mfaRecoveryCodes.findIndex(func(c : Text) : Bool { c == totpCode });
      switch (codeIdx) {
        case (?idx) {
          var newCodes : [Text] = [];
          var j = 0;
          for (c in authSt.mfaRecoveryCodes.values()) {
            if (j != idx) { newCodes := newCodes.concat([c]) };
            j += 1;
          };
          state.userAuthStates.add(sessionToken.userId, { authSt with mfaRecoveryCodes = newCodes; updatedAt = Time.now() });
          validated    := true;
          usedRecovery := true;
        };
        case null {};
      };
    };
    if (not validated) {
      appendAuthAudit(alertsState, sessionToken.userId, "auth_mfa_challenge", "authentication", sessionToken.userId,
        "MFA challenge failed; method=totp");
      return #err(#MfaInvalidCode);
    };
    let upgraded = { sessionToken with mfaVerified = true; isPendingMfa = false };
    state.activeSessions.add(sessionToken.token, upgraded);
    appendAuthAudit(alertsState, sessionToken.userId, "auth_mfa_challenge", "authentication", sessionToken.userId,
      "MFA challenge passed; method=" # (if usedRecovery { "recovery" } else { "totp" }));
    #ok(upgraded)
  };

  public func resetMfaForUser(
    state       : State,
    alertsState : AlertsState,
    userId      : Text,
    adminId     : Text,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    switch (state.userAuthStates.get(userId)) {
      case null  { #err(#UserNotFound) };
      case (?a) {
        state.userAuthStates.add(userId, {
          a with
          mfaSecret = null; mfaPendingSecret = null;
          mfaRecoveryCodes = []; mfaEnrolled = false;
          updatedAt = Time.now();
        });
        revokeAllSessions(state, userId);
        appendAuthAudit(alertsState, adminId, "auth_mfa_reset", "authentication", userId,
          "MFA reset by admin " # adminId);
        #ok(())
      };
    };
  };

  public func regenerateRecoveryCodes(
    state        : State,
    alertsState  : AlertsState,
    sessionToken : AuthTypes.SessionToken,
  ) : CommonTypes.Result<[Text], AuthTypes.AuthError> {
    switch (state.userAuthStates.get(sessionToken.userId)) {
      case null  { #err(#UserNotFound) };
      case (?a) {
        if (not a.mfaEnrolled) { return #err(#MfaNotEnrolled) };
        let codes = generateRecoveryCodes(state);
        state.userAuthStates.add(sessionToken.userId, { a with mfaRecoveryCodes = codes; updatedAt = Time.now() });
        appendAuthAudit(alertsState, sessionToken.userId, "auth_mfa_challenge", "authentication", sessionToken.userId,
          "Recovery codes regenerated");
        #ok(codes)
      };
    };
  };

  // ── User auth state management ─────────────────────────────────────────────

  public func initUserAuthState(state : State, userId : Text, companyId : Text) : () {
    let now = Time.now();
    state.userAuthStates.add(userId, {
      userId; companyId;
      passwordHash = null; mfaSecret = null; mfaPendingSecret = null;
      mfaRecoveryCodes = []; mfaEnrolled = false;
      lastPasswordChange = now; passwordExpiryAt = null;
      accountLockedUntil = null; failedLoginCount = 0;
      previousPasswordHashes = []; isActive = true;
      createdAt = now; updatedAt = now;
    });
  };

  public func setPasswordForUser(
    state       : State,
    alertsState : AlertsState,
    userId      : Text,
    newPassword : Text,
    orgSettings : AuthTypes.AuthSettings,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    let errors = validatePassword(orgSettings, newPassword);
    if (errors.size() > 0) { return #err(#PasswordTooWeak errors) };
    let authSt = switch (state.userAuthStates.get(userId)) {
      case null {
        let now = Time.now();
        state.userAuthStates.add(userId, {
          userId; companyId = "";
          passwordHash = ?makePasswordHash(state, newPassword);
          mfaSecret = null; mfaPendingSecret = null;
          mfaRecoveryCodes = []; mfaEnrolled = false;
          lastPasswordChange = now; passwordExpiryAt = null;
          accountLockedUntil = null; failedLoginCount = 0;
          previousPasswordHashes = []; isActive = true;
          createdAt = now; updatedAt = now;
        });
        return #ok(());
      };
      case (?s) s;
    };
    if (isPasswordReused(newPassword, authSt.previousPasswordHashes, orgSettings.passwordReusePreventCount)) {
      return #err(#PasswordReused);
    };
    let newHash    = makePasswordHash(state, newPassword);
    let updatedPrev = switch (authSt.passwordHash) {
      case null  authSt.previousPasswordHashes;
      case (?h)  [h].concat(authSt.previousPasswordHashes)
                    .sliceToArray(0, orgSettings.passwordReusePreventCount.toInt());
    };
    let now = Time.now();
    state.userAuthStates.add(userId, {
      authSt with
      passwordHash           = ?newHash;
      previousPasswordHashes = updatedPrev;
      lastPasswordChange     = now;
      passwordExpiryAt       = if (orgSettings.passwordExpiryDays > 0)
                                 ?(now + orgSettings.passwordExpiryDays.toInt() * 86_400_000_000_000)
                               else null;
      updatedAt              = now;
    });
    appendAuthAudit(alertsState, userId, "auth_password_changed", "authentication", userId, "Password set/changed");
    #ok(())
  };

  public func deactivateUser(
    state       : State,
    alertsState : AlertsState,
    userId      : Text,
    adminId     : Text,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    switch (state.userAuthStates.get(userId)) {
      case null  { #err(#UserNotFound) };
      case (?a) {
        state.userAuthStates.add(userId, { a with isActive = false; updatedAt = Time.now() });
        revokeAllSessions(state, userId);
        appendAuthAudit(alertsState, adminId, "auth_user_deactivated", "authentication", userId, "Deactivated by " # adminId);
        #ok(())
      };
    };
  };

  public func activateUser(
    state       : State,
    alertsState : AlertsState,
    userId      : Text,
    adminId     : Text,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    switch (state.userAuthStates.get(userId)) {
      case null  { #err(#UserNotFound) };
      case (?a) {
        state.userAuthStates.add(userId, { a with isActive = true; updatedAt = Time.now() });
        appendAuthAudit(alertsState, adminId, "auth_user_activated", "authentication", userId, "Activated by " # adminId);
        #ok(())
      };
    };
  };

  // ── SSO config (architecture placeholder) ─────────────────────────────────

  public func updateSsoConfig(
    state       : State,
    alertsState : AlertsState,
    orgId       : Text,
    config      : AuthTypes.SSOConfig,
    adminId     : Text,
  ) : CommonTypes.Result<(), AuthTypes.AuthError> {
    state.ssoConfigs.add(orgId, { config with orgId; updatedAt = Time.now(); updatedBy = adminId });
    appendAuthAudit(alertsState, adminId, "sso_config_updated", "authentication", orgId,
      "SSO config updated by " # adminId);
    #ok(())
  };

  public func getSsoConfig(state : State, orgId : Text) : ?AuthTypes.SSOConfig {
    state.ssoConfigs.get(orgId)
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  func logFailedLogin(
    state        : State,
    alertsState  : AlertsState,
    userId       : ?Text,
    email        : Text,
    companyType  : CompanyTypes.CompanyType,
    reason       : Text,
    attemptCount : Nat,
  ) : () {
    state.idCounter.value += 1;
    state.failedLoginLog.add({
      id          = "fl-" # state.idCounter.value.toText();
      userId;
      email;
      companyType;
      reason;
      attemptCount;
      ipHint    = "";
      timestamp = Time.now();
    });
    appendAuthAudit(
      alertsState,
      switch (userId) { case (?uid) uid; case null email },
      "auth_login_failed",
      "authentication",
      switch (userId) { case (?uid) uid; case null "unknown" },
      "Login failed for " # email # " reason: " # reason # " attempts: " # attemptCount.toText(),
    );
  };

  public func appendAuthAudit(
    alertsState : AlertsState,
    userId      : Text,
    action      : Text,
    entityType  : Text,
    entityId    : Text,
    details     : Text,
  ) : () {
    alertsState.idCounter.value += 1;
    alertsState.auditLog.add({
      id        = "audit-" # alertsState.idCounter.value.toText();
      userId; action; entityType; entityId; details;
      timestamp = Time.now();
    });
  };
};
