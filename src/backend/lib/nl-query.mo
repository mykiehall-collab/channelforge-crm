// ForgeAI NL Query — pure rule-based natural language parser
// Maps natural language text to SmartQueryType + SmartQueryFilter via keyword matching.
// No LLM or HTTP outcalls — deterministic, enterprise-safe, predictable.
import Types "../types/forgeai";
import Text "mo:core/Text";
import List "mo:core/List";

module {

  // Result of parsing a natural language query
  public type NLParseResult = {
    queryType   : Types.SmartQueryType;
    filter      : Types.SmartQueryFilter;
    explanation : Text;
    confidence  : Text; // "High" | "Medium" | "Low"
  };

  // ── Public entry point ────────────────────────────────────────────────────────

  public func parse(queryText : Text) : NLParseResult {
    let q = queryText.toLower();

    // ── Query type detection (priority order) ─────────────────────────────
    let (queryType, typeExplanation, typeConfidence) = detectQueryType(q);

    // ── Filter extraction ─────────────────────────────────────────────────
    let filter = extractFilters(q);

    // ── Build explanation ─────────────────────────────────────────────────
    let filterNote = buildFilterNote(filter);
    let explanation = typeExplanation # filterNote;

    { queryType; filter; explanation; confidence = typeConfidence };
  };

  // ── Query type detection ──────────────────────────────────────────────────

  func has(q : Text, sub : Text) : Bool {
    q.contains(#text sub);
  };

  func detectQueryType(q : Text) : (Types.SmartQueryType, Text, Text) {

    // High-risk renewals
    if (has(q, "high risk") or has(q, "high-risk") or has(q, "critical renewal")) {
      return (
        #HighRiskRenewals,
        "Matched query: high-risk renewal accounts.",
        "High",
      );
    };

    // Renewals expiring next month / soon
    if (has(q, "expir") or has(q, "renewing") or has(q, "renewal next") or has(q, "renew next") or has(q, "renew this month") or has(q, "expiring this month") or has(q, "expiring next month") or has(q, "coming up for renewal") or has(q, "due for renewal")) {
      return (
        #RenewalsExpiringNextMonth,
        "Matched query: renewals expiring soon.",
        "High",
      );
    };

    // Pending deal registrations over 14 days
    if ((has(q, "pending") and has(q, "deal")) or has(q, "pending dr") or has(q, "pending deal registration") or has(q, "deal registration pending") or (has(q, "pending") and has(q, "registration"))) {
      return (
        #PendingDRsOver14Days,
        "Matched query: deal registrations pending over 14 days.",
        "High",
      );
    };

    // Inactive reseller accounts
    if (has(q, "inactive reseller") or has(q, "reseller inactive") or (has(q, "inactive") and has(q, "reseller"))) {
      return (
        #InactiveResellers,
        "Matched query: inactive reseller accounts.",
        "High",
      );
    };

    // Accounts with no engagement / activity
    if (has(q, "no engagement") or has(q, "no activity") or has(q, "no recent engagement") or has(q, "no recent activity") or has(q, "zero engagement") or has(q, "without engagement")) {
      return (
        #AccountsNoEngagement,
        "Matched query: accounts with no engagement activity.",
        "High",
      );
    };

    // Top-performing distributors
    if (has(q, "top performing") or has(q, "top-performing") or has(q, "best distributor") or has(q, "highest performing") or has(q, "best performing distributor") or (has(q, "top") and has(q, "distributor"))) {
      return (
        #TopPerformingDistributors,
        "Matched query: top-performing distributors.",
        "High",
      );
    };

    // Resellers below target / underperforming
    if (has(q, "below target") or has(q, "underperforming reseller") or has(q, "underperforming") or has(q, "reseller below") or has(q, "below quota") or (has(q, "reseller") and has(q, "underperform"))) {
      return (
        #ResellersBelowTarget,
        "Matched query: resellers below performance target.",
        "High",
      );
    };

    // Customers with no active pipeline
    if (has(q, "no pipeline") or has(q, "no active pipeline") or has(q, "without pipeline") or has(q, "missing pipeline") or has(q, "no active deal") or has(q, "no deals")) {
      return (
        #CustomersNoActivePipeline,
        "Matched query: customers with no active pipeline.",
        "High",
      );
    };

    // Contracts missing business plans
    if (has(q, "missing business plan") or has(q, "no business plan") or has(q, "without business plan") or has(q, "missing plan") or has(q, "no plan")) {
      return (
        #ContractsMissingPlans,
        "Matched query: contracts missing business plans.",
        "High",
      );
    };

    // Stalled approvals / pending approval
    if (has(q, "stalled") or has(q, "pending approval") or has(q, "stalled approval") or has(q, "approval stalled") or has(q, "stuck approval")) {
      return (
        #StalledApprovals,
        "Matched query: opportunities with stalled approvals.",
        "High",
      );
    };

    // Declining engagement
    if (has(q, "declining engagement") or has(q, "declining") or has(q, "engagement declining") or has(q, "dropping engagement") or has(q, "reduced engagement")) {
      return (
        #DecliningEngagement,
        "Matched query: accounts with declining engagement.",
        "High",
      );
    };

    // High-growth / growth opportunity
    if (has(q, "high growth") or has(q, "high-growth") or has(q, "growth opportunity") or has(q, "growth reseller") or has(q, "upsell opportunity") or has(q, "expansion opportunity")) {
      return (
        #HighGrowthOpportunities,
        "Matched query: high-growth reseller opportunities.",
        "High",
      );
    };

    // Generic renewal mention (lower confidence)
    if (has(q, "renew") or has(q, "renewal")) {
      return (
        #RenewalsExpiringNextMonth,
        "Partial match on 'renewal'  -  showing renewals expiring soon.",
        "Medium",
      );
    };

    // Generic deal mention (lower confidence)
    if (has(q, "deal") or has(q, "registration")) {
      return (
        #PendingDRsOver14Days,
        "Partial match on 'deal'  -  showing pending deal registrations.",
        "Medium",
      );
    };

    // Generic reseller mention (lower confidence)
    if (has(q, "reseller")) {
      return (
        #InactiveResellers,
        "Partial match on 'reseller'  -  showing inactive reseller accounts.",
        "Low",
      );
    };

    // Generic distributor mention (lower confidence)
    if (has(q, "distributor")) {
      return (
        #TopPerformingDistributors,
        "Partial match on 'distributor'  -  showing top-performing distributors.",
        "Low",
      );
    };

    // Default fallback
    (
      #HighRiskRenewals,
      "No specific query type detected. Showing high-risk renewals as default.",
      "Low",
    );
  };

  // ── Filter extraction ────────────────────────────────────────────────────────

  func extractFilters(q : Text) : Types.SmartQueryFilter {
    {
      region           = extractRegion(q);
      product          = extractProduct(q);
      distributorId    = extractDistributorId(q);
      resellerId       = extractResellerId(q);
      accountManagerId = null; // not extractable from plain text
      renewalWindowDays = extractRenewalWindow(q);
      riskLevel        = extractRiskLevel(q);
      minContractValue = null;
      maxContractValue = null;
    };
  };

  func extractRegion(q : Text) : ?Text {
    if (has(q, " uk ") or has(q, " uk,") or has(q, "united kingdom") or has(q, " in uk") or has(q, "in the uk")) {
      return ?"UK";
    };
    if (has(q, "emea")) { return ?"EMEA" };
    if (has(q, "apac") or has(q, "asia pacific")) { return ?"APAC" };
    if (has(q, " us ") or has(q, " us,") or has(q, "united states") or has(q, " in us") or has(q, "in the us")) {
      return ?"US";
    };
    if (has(q, "europe") and not has(q, "emea")) { return ?"Europe" };
    if (has(q, "north america")) { return ?"NorthAmerica" };
    if (has(q, "latin america") or has(q, "latam")) { return ?"LATAM" };
    if (has(q, "middle east")) { return ?"MiddleEast" };
    if (has(q, "germany") or has(q, "deutschland")) { return ?"Germany" };
    if (has(q, "france")) { return ?"France" };
    if (has(q, "nordics") or has(q, "nordic") or has(q, "scandinavia")) { return ?"Nordics" };
    null;
  };

  func extractProduct(q : Text) : ?Text {
    // Match known product keywords in query; extendable for full product catalog
    if (has(q, "acrobat studio")) { return ?"AcrobatStudio" };
    if (has(q, "acrobat")) { return ?"Acrobat" };
    null;
  };

  func extractDistributorId(q : Text) : ?Text {
    // Detect patterns: "under distributor X", "distributor X" (word after keyword)
    let patterns = ["under distributor ", "distributor "];
    for (prefix in patterns.values()) {
      switch (extractWordAfter(q, prefix)) {
        case (?word) { return ?word };
        case null {};
      };
    };
    null;
  };

  func extractResellerId(q : Text) : ?Text {
    // Detect patterns: "reseller X", "under reseller X"
    let patterns = ["under reseller ", "reseller "];
    for (prefix in patterns.values()) {
      switch (extractWordAfter(q, prefix)) {
        case (?word) { return ?word };
        case null {};
      };
    };
    null;
  };

  func extractRenewalWindow(q : Text) : ?Nat {
    if (has(q, "next 30 days") or has(q, "30 days") or has(q, "this month") or has(q, "next month")) {
      return ?30;
    };
    if (has(q, "next 60 days") or has(q, "60 days")) { return ?60 };
    if (has(q, "next 90 days") or has(q, "90 days") or has(q, "next quarter")) { return ?90 };
    if (has(q, "next 14 days") or has(q, "14 days") or has(q, "two weeks")) { return ?14 };
    if (has(q, "next 7 days") or has(q, "7 days") or has(q, "this week")) { return ?7 };
    null;
  };

  func extractRiskLevel(q : Text) : ?Text {
    if (has(q, "critical")) { return ?"Critical" };
    if (has(q, "high risk") or has(q, "high-risk")) { return ?"High" };
    if (has(q, "medium risk") or has(q, "medium-risk")) { return ?"Medium" };
    if (has(q, "low risk") or has(q, "low-risk")) { return ?"Low" };
    null;
  };

  // ── Text helpers ───────────────────────────────────────────────────────────────

  // Extract the first word that immediately follows a given prefix in the string.
  // Returns null if prefix is not found or nothing follows.
  func extractWordAfter(q : Text, prefix : Text) : ?Text {
    let prefixLen = prefix.size();
    let qLen = q.size();
    if (qLen <= prefixLen) { return null };

    var i = 0;
    let chars = q.toArray();
    let prefixChars = prefix.toArray();
    let limit = qLen - prefixLen;

    label search while (i <= limit) {
      var isMatch = true;
      var j = 0;
      while (j < prefixLen) {
        if (chars[i + j] != prefixChars[j]) {
          isMatch := false;
        };
        j += 1;
      };
      if (isMatch) {
        var k = i + prefixLen;
        let wordBuf = List.empty<Char>();
        label wordLoop while (k < qLen and wordBuf.size() < 40) {
          let c = chars[k];
          if (c == ' ' or c == ',' or c == '.' or c == ';' or c == ')') {
            break wordLoop;
          };
          wordBuf.add(c);
          k += 1;
        };
        if (wordBuf.size() > 0) {
          return ?Text.fromIter(wordBuf.values());
        };
        return null;
      };
      i += 1;
    };
    null;
  };

  // ── Filter note builder ──────────────────────────────────────────────────────

  func buildFilterNote(filter : Types.SmartQueryFilter) : Text {
    var note = "";
    switch (filter.region) {
      case (?r) { note #= " Region filter: " # r # "." };
      case null {};
    };
    switch (filter.distributorId) {
      case (?d) { note #= " Distributor filter: " # d # "." };
      case null {};
    };
    switch (filter.resellerId) {
      case (?r) { note #= " Reseller filter: " # r # "." };
      case null {};
    };
    switch (filter.riskLevel) {
      case (?rl) { note #= " Risk level filter: " # rl # "." };
      case null {};
    };
    switch (filter.renewalWindowDays) {
      case (?d) { note #= " Renewal window: " # d.toText() # " days." };
      case null {};
    };
    note;
  };
};
