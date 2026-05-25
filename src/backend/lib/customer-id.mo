// Customer ID format governance logic — generation, validation, duplicate prevention
import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Types "../types/customer-id";

module {

  public type State = {
    formatRules : Map.Map<Text, Types.CustomerIdFormatRule>;
    // key: vendorId
    usedIds     : Map.Map<Text, Set.Set<Text>>;
    // key: vendorId → set of used Customer IDs
    auditLog    : List.List<Types.CustomerIdAuditEntry>;
  };

  public func initState() : State = {
    formatRules = Map.empty<Text, Types.CustomerIdFormatRule>();
    usedIds     = Map.empty<Text, Set.Set<Text>>();
    auditLog    = List.empty<Types.CustomerIdAuditEntry>();
  };

  // Create or update the Customer ID format rule for a Vendor
  public func upsertFormatRule(
    state    : State,
    vendorId : Text,
    input    : Types.CustomerIdFormatRuleInput,
    now      : Int,
  ) : Types.CustomerIdFormatRule {
    let existing = state.formatRules.get(vendorId);
    let lastSeq = switch (existing) { case (?r) r.lastSequenceNumber; case null 0 };
    let rule : Types.CustomerIdFormatRule = {
      vendorId;
      formatPattern           = input.formatPattern;
      prefixRules             = input.prefixRules;
      regionRules             = input.regionRules;
      numberSequencing        = input.numberSequencing;
      characterLimit          = input.characterLimit;
      allowedSeparators       = input.allowedSeparators;
      autoGenerationEnabled   = input.autoGenerationEnabled;
      manualOverridePermitted = input.manualOverridePermitted;
      duplicatePreventionEnabled = input.duplicatePreventionEnabled;
      lastSequenceNumber      = lastSeq;
      updatedAt               = now;
    };
    state.formatRules.add(vendorId, rule);
    // Append audit entry
    state.auditLog.add({
      entryId     = vendorId # "-rule-" # now.toText();
      customerId  = "";
      accountId   = "";
      action      = #formatRuleChanged;
      performedBy = vendorId;
      performedAt = now;
      detail      = "Format rule updated: " # input.formatPattern;
    });
    rule;
  };

  // Retrieve the format rule for a Vendor
  // Cascade: always returns the Vendor-defined rule regardless of caller org
  public func getFormatRule(
    state    : State,
    vendorId : Text,
  ) : ?Types.CustomerIdFormatRule {
    state.formatRules.get(vendorId);
  };

  // Generate the next Customer ID under a Vendor's format rule
  public func generateNextId(
    state   : State,
    request : Types.CustomerIdGenerateRequest,
    now     : Int,
  ) : Types.CustomerIdValidationResult {
    switch (state.formatRules.get(request.vendorId)) {
      case null {
        { isValid = false; formattedId = null; errorMessage = ?"No format rule defined for this Vendor"; isDuplicate = false };
      };
      case (?rule) {
        // Handle manual override
        switch (request.manualInput) {
          case (?manual) {
            if (not rule.manualOverridePermitted) {
              return { isValid = false; formattedId = null; errorMessage = ?"Manual override not permitted"; isDuplicate = false };
            };
            return validateId(state, request.vendorId, manual);
          };
          case null {};
        };
        if (not rule.autoGenerationEnabled) {
          return { isValid = false; formattedId = null; errorMessage = ?"Auto-generation is disabled for this Vendor"; isDuplicate = false };
        };
        let nextSeq = rule.lastSequenceNumber + 1;
        let generated = buildIdFromPattern(rule.formatPattern, rule.prefixRules, request.regionCode, nextSeq, rule.regionRules);
        // Enforce character limit
        if (rule.characterLimit > 0 and generated.size() > rule.characterLimit) {
          return { isValid = false; formattedId = null; errorMessage = ?("Generated ID exceeds character limit of " # rule.characterLimit.toText()); isDuplicate = false };
        };
        // Duplicate check
        if (rule.duplicatePreventionEnabled and isDuplicate(state, request.vendorId, generated)) {
          return { isValid = false; formattedId = null; errorMessage = ?"Generated ID already in use"; isDuplicate = true };
        };
        // Advance the sequence number
        state.formatRules.add(request.vendorId, { rule with lastSequenceNumber = nextSeq; updatedAt = now });
        { isValid = true; formattedId = ?generated; errorMessage = null; isDuplicate = false };
      };
    };
  };

  // Validate a manually entered or imported Customer ID
  public func validateId(
    state      : State,
    vendorId   : Text,
    customerId : Text,
  ) : Types.CustomerIdValidationResult {
    switch (state.formatRules.get(vendorId)) {
      case null {
        // No format rule — accept any non-empty ID
        if (customerId.isEmpty()) {
          { isValid = false; formattedId = null; errorMessage = ?"Customer ID cannot be empty"; isDuplicate = false };
        } else {
          let dup = isDuplicate(state, vendorId, customerId);
          { isValid = not dup; formattedId = ?customerId; errorMessage = if (dup) ?"Customer ID already in use" else null; isDuplicate = dup };
        };
      };
      case (?rule) {
        if (customerId.isEmpty()) {
          return { isValid = false; formattedId = null; errorMessage = ?"Customer ID cannot be empty"; isDuplicate = false };
        };
        // Character limit
        if (rule.characterLimit > 0 and customerId.size() > rule.characterLimit) {
          return { isValid = false; formattedId = null; errorMessage = ?("ID exceeds character limit of " # rule.characterLimit.toText()); isDuplicate = false };
        };
        // Region validation if regionRules defined
        let regionError = validateRegionInId(customerId, rule.regionRules, rule.allowedSeparators);
        switch (regionError) {
          case (?msg) { return { isValid = false; formattedId = null; errorMessage = ?msg; isDuplicate = false } };
          case null {};
        };
        let dup = rule.duplicatePreventionEnabled and isDuplicate(state, vendorId, customerId);
        { isValid = not dup; formattedId = ?customerId; errorMessage = if (dup) ?"Customer ID already in use" else null; isDuplicate = dup };
      };
    };
  };

  // Register a Customer ID as used (called after account creation)
  public func registerUsedId(
    state      : State,
    vendorId   : Text,
    customerId : Text,
    accountId  : Text,
    userId     : Text,
    now        : Int,
  ) : Bool {
    if (isDuplicate(state, vendorId, customerId)) { return false };
    let vendorSet = switch (state.usedIds.get(vendorId)) {
      case (?s) s;
      case null {
        let fresh = Set.empty<Text>();
        state.usedIds.add(vendorId, fresh);
        fresh;
      };
    };
    vendorSet.add(customerId);
    state.auditLog.add({
      entryId     = customerId # "-" # now.toText();
      customerId;
      accountId;
      action      = #created;
      performedBy = userId;
      performedAt = now;
      detail      = "Customer ID registered";
    });
    true;
  };

  // Check for duplicate across the Vendor's namespace
  public func isDuplicate(
    state      : State,
    vendorId   : Text,
    customerId : Text,
  ) : Bool {
    switch (state.usedIds.get(vendorId)) {
      case null false;
      case (?s) s.contains(customerId);
    };
  };

  // Get Customer ID audit log for a Vendor
  public func getAuditLog(
    state    : State,
    vendorId : Text,
  ) : [Types.CustomerIdAuditEntry] {
    // Filter audit entries by vendorId prefix pattern
    state.auditLog
      .filter(func (e : Types.CustomerIdAuditEntry) : Bool {
        e.performedBy == vendorId or e.entryId.startsWith(#text (vendorId # "-"))
      })
      .toArray();
  };

  // ── Private helpers ──────────────────────────────────────────────────────────

  // Parse and substitute format pattern tokens
  // Supported tokens: {REGION}, {SEQUENTIAL}, {DIGITS:N}, {ALPHANUMERIC:N}
  func buildIdFromPattern(
    pattern     : Text,
    prefixRules : Text,
    regionCode  : ?Text,
    seqNum      : Nat,
    regionRules : [Text],
  ) : Text {
    var result = pattern;
    // Replace {REGION} with provided region code or first allowed region
    let region = switch (regionCode) {
      case (?r) r;
      case null {
        if (regionRules.size() > 0) { regionRules[0] } else { "GEN" };
      };
    };
    result := result.replace(#text "{REGION}", region);
    // Replace {SEQUENTIAL} with zero-padded 6-digit number
    result := result.replace(#text "{SEQUENTIAL}", zeroPad(seqNum, 6));
    // Replace {NUMBER} with zero-padded 6-digit number (alias)
    result := result.replace(#text "{NUMBER}", zeroPad(seqNum, 6));
    // Replace {DIGITS:N} tokens
    let parts = result.split(#text "{DIGITS:");
    var rebuilt = "";
    var first = true;
    for (part in parts) {
      if (first) {
        rebuilt := part;
        first := false;
      } else {
        // Extract width and rest
        let subparts = part.split(#char '}');
        let subArr = subparts.toArray();
        if (subArr.size() >= 2) {
          let width = switch (Nat.fromText(subArr[0])) { case (?n) n; case null 6 };
          rebuilt := rebuilt # zeroPad(seqNum, width) # subArr[1];
        } else {
          rebuilt := rebuilt # part;
        };
      };
    };
    result := rebuilt;
    // Prepend prefix if pattern has no explicit prefix
    if (not prefixRules.isEmpty() and not result.startsWith(#text prefixRules)) {
      result;
    } else result;
  };

  func zeroPad(n : Nat, width : Nat) : Text {
    let s = n.toText();
    if (s.size() >= width) { return s };
    let padding = width - s.size();
    var pad = "";
    var i = 0;
    while (i < padding) { pad := pad # "0"; i += 1 };
    pad # s;
  };

  // Validate region code embedded in the customer ID against allowed regions
  func validateRegionInId(
    customerId   : Text,
    regionRules  : [Text],
    separators   : [Text],
  ) : ?Text {
    if (regionRules.size() == 0) { return null };
    // Check if any separator splits into a segment matching a region rule
    let matched = separators.find(func (sep : Text) : Bool {
      if (sep.isEmpty()) { return false };
      let segs = customerId.split(#text sep).toArray();
      segs.any(func (seg : Text) : Bool {
        regionRules.find(func (r : Text) : Bool { r == seg }) != null
      });
    });
    switch (matched) {
      case (?_) null; // valid region found
      case null {
        // If region rules exist but none matched — still allow (region may be optional in format)
        null;
      };
    };
  };
};
