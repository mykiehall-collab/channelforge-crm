// AI Provider domain logic — BYO AI governance for CHANNELFORGE
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Types "../types/ai-provider";

module {

  // ── State ──────────────────────────────────────────────────────────────

  public type State = {
    providers      : Map.Map<Text, Types.AIProvider>;
    configs        : Map.Map<Text, Types.AIProviderConfig>;
    accessRules    : Map.Map<Text, Types.AIAccessRule>;
    auditLog       : List.List<Types.AIAuditEntry>;
    chatSessions   : Map.Map<Text, Types.ForgeAIChatSession>;
    counterState   : { var nextId : Nat };
  };

  public func initState() : State = {
    providers    = Map.empty<Text, Types.AIProvider>();
    configs      = Map.empty<Text, Types.AIProviderConfig>();
    accessRules  = Map.empty<Text, Types.AIAccessRule>();
    auditLog     = List.empty<Types.AIAuditEntry>();
    chatSessions = Map.empty<Text, Types.ForgeAIChatSession>();
    counterState = { var nextId = 0 };
  };

  // ── Next-ID helper ─────────────────────────────────────────────────────

  public func nextId(state : State, prefix : Text) : Text {
    state.counterState.nextId += 1;
    prefix # "-" # state.counterState.nextId.toText();
  };

  // ── Provider CRUD ──────────────────────────────────────────────────────

  public func addProvider(
    state    : State,
    provider : Types.AIProvider,
    config   : Types.AIProviderConfig,
  ) : () {
    state.providers.add(provider.id, provider);
    // TODO-SECURITY: upgrade to encrypted vault before go-live
    state.configs.add(config.providerId, config);
  };

  public func getProvider(
    state      : State,
    providerId : Text,
  ) : ?Types.AIProvider {
    state.providers.get(providerId);
  };

  public func listProviders(
    state          : State,
    workspaceId    : Text,
  ) : [Types.AIProvider] {
    state.providers.values().filter(func(p) { p.workspaceId == workspaceId }).toArray(
      
    );
  };

  public func updateProviderStatus(
    state      : State,
    providerId : Text,
    status     : Types.AIProviderStatus,
    actorId    : Text,
  ) : Bool {
    switch (state.providers.get(providerId)) {
      case null { false };
      case (?p) {
        state.providers.add(providerId, { p with status });
        logAuditEvent(state, {
          id             = nextId(state, "audit");
          action         = if (status == #Active) #ProviderEnabled else #ProviderDisabled;
          userId         = actorId;
          organizationId = p.workspaceId;
          providerId     = ?providerId;
          timestamp      = Time.now();
          details        = "Provider status changed to " # debug_show(status);
        });
        true;
      };
    };
  };

  public func deleteProvider(
    state      : State,
    providerId : Text,
    actorId    : Text,
  ) : Bool {
    switch (state.providers.get(providerId)) {
      case null { false };
      case (?p) {
        state.providers.remove(providerId);
        state.configs.remove(providerId);
        logAuditEvent(state, {
          id             = nextId(state, "audit");
          action         = #ProviderDeleted;
          userId         = actorId;
          organizationId = p.workspaceId;
          providerId     = ?providerId;
          timestamp      = Time.now();
          details        = "Provider deleted: " # p.name;
        });
        true;
      };
    };
  };

  public func updateProviderConfig(
    state   : State,
    config  : Types.AIProviderConfig,
    actorId : Text,
  ) : Bool {
    switch (state.providers.get(config.providerId)) {
      case null { false };
      case (?p) {
        // TODO-SECURITY: upgrade to encrypted vault before go-live
        state.configs.add(config.providerId, config);
        logAuditEvent(state, {
          id             = nextId(state, "audit");
          action         = #ProviderUpdated;
          userId         = actorId;
          organizationId = p.workspaceId;
          providerId     = ?config.providerId;
          timestamp      = Time.now();
          details        = "Provider config updated";
        });
        true;
      };
    };
  };

  public func getProviderConfig(
    state      : State,
    providerId : Text,
  ) : ?Types.AIProviderConfig {
    // TODO-SECURITY: upgrade to encrypted vault before go-live
    state.configs.get(providerId);
  };

  // ── Masked API-key update ──────────────────────────────────────────────
  // TODO-SECURITY: maskedKey is display-only placeholder; upgrade to
  // encrypted vault write before go-live.
  public func updateMaskedApiKey(
    state      : State,
    providerId : Text,
    maskedKey  : Text,
    actorId    : Text,
  ) : Bool {
    switch (state.configs.get(providerId)) {
      case null { false };
      case (?cfg) {
        // TODO-SECURITY: upgrade to encrypted vault before go-live
        state.configs.add(providerId, { cfg with maskedApiKey = ?maskedKey });
        switch (state.providers.get(providerId)) {
          case (?p) {
            logAuditEvent(state, {
              id             = nextId(state, "audit");
              action         = #ApiKeyUpdated;  // TODO-SECURITY: log key rotation event only — never log the key
              userId         = actorId;
              organizationId = p.workspaceId;
              providerId     = ?providerId;
              timestamp      = Time.now();
              details        = "API key placeholder updated for provider";
            });
          };
          case null {};
        };
        true;
      };
    };
  };

  // ── Access-rule management ─────────────────────────────────────────────

  public func grantAccess(
    state : State,
    rule  : Types.AIAccessRule,
  ) : () {
    state.accessRules.add(rule.id, rule);
  };

  public func revokeAccess(
    state   : State,
    ruleId  : Text,
    actorId : Text,
  ) : Bool {
    switch (state.accessRules.get(ruleId)) {
      case null { false };
      case (?rule) {
        state.accessRules.add(ruleId, { rule with active = false });
        ignore actorId;
        true;
      };
    };
  };

  public func listAccessRules(
    state      : State,
    providerId : Text,
  ) : [Types.AIAccessRule] {
    state.accessRules.values().filter(func(r) { r.providerId == providerId and r.active }).toArray(
      
    );
  };

  // Resolves which providerId the user should use, respecting hierarchy:
  // 1. Check direct grants matching user, role, or department
  // 2. Fall back to any workspace-level grant
  // 3. Return null → caller falls back to Native ForgeAI
  public func resolveProviderForUser(
    state          : State,
    userId         : Text,
    organizationId : Text,
    role           : Text,
    department     : ?Text,
  ) : ?Text {
    let activeRules = state.accessRules.values().filter(func(r) {
      r.organizationId == organizationId and r.active
    });
    // Direct user grant wins
    switch (activeRules.find(func(r) { r.grantedToType == #SpecificUser(userId) })) {
      case (?r) { return ?r.providerId };
      case null {};
    };
    // Role grant
    switch (state.accessRules.values().filter(func(r) {
      r.organizationId == organizationId and r.active
    }).find(func(r) { r.grantedToType == #ByRole(role) })) {
      case (?r) { return ?r.providerId };
      case null {};
    };
    // Department grant
    switch (department) {
      case (?dept) {
        switch (state.accessRules.values().filter(func(r) {
          r.organizationId == organizationId and r.active
        }).find(func(r) { r.grantedToType == #ByDepartment(dept) })) {
          case (?r) { return ?r.providerId };
          case null {};
        };
      };
      case null {};
    };
    // AllUsers grant
    switch (state.accessRules.values().filter(func(r) {
      r.organizationId == organizationId and r.active
    }).find(func(r) { r.grantedToType == #AllUsers })) {
      case (?r) { ?r.providerId };
      case null { null };
    };
  };

  // ── Provider test (placeholder — no live calls) ────────────────────────

  public func testProviderConnection(
    state      : State,
    providerId : Text,
    actorId    : Text,
  ) : Text {
    switch (state.providers.get(providerId)) {
      case null { "Provider not found." };
      case (?p) {
        logAuditEvent(state, {
          id             = nextId(state, "audit");
          action         = #TestAttempt;
          userId         = actorId;
          organizationId = p.workspaceId;
          providerId     = ?providerId;
          timestamp      = Time.now();
          details        = "Connection test initiated (simulated — external AI activation coming in a future update).";
        });
        "External AI activation coming in a future update. Provider '" # p.name # "' is configured and ready for activation.";
      };
    };
  };

  // ── Chat sessions ──────────────────────────────────────────────────────

  public func createChatSession(
    state       : State,
    userId      : Text,
    providerId  : Text,
    contextType : ?Text,
    contextId   : ?Text,
  ) : Types.ForgeAIChatSession {
    let now     = Time.now();
    let session : Types.ForgeAIChatSession = {
      id          = nextId(state, "session");
      userId;
      providerId;
      contextType;
      contextId;
      messages    = [];
      createdAt   = now;
      updatedAt   = now;
    };
    state.chatSessions.add(session.id, session);
    session;
  };

  public func appendChatMessage(
    state     : State,
    sessionId : Text,
    message   : Types.ChatMessage,
  ) : Bool {
    switch (state.chatSessions.get(sessionId)) {
      case null { false };
      case (?s) {
        let updated = { s with
          messages  = s.messages.concat([message]);
          updatedAt = Time.now();
        };
        state.chatSessions.add(sessionId, updated);
        true;
      };
    };
  };

  public func getChatSession(
    state     : State,
    sessionId : Text,
  ) : ?Types.ForgeAIChatSession {
    state.chatSessions.get(sessionId);
  };

  public func listChatSessions(
    state  : State,
    userId : Text,
  ) : [Types.ForgeAIChatSession] {
    state.chatSessions.values().filter(func(s) { s.userId == userId }).toArray(
      
    );
  };

  // ── Simulated AI response (placeholder — no live calls) ───────────────
  // Produces realistic-feeling placeholder responses for common ForgeAI queries.
  // No external HTTP calls are made in this phase.
  public func simulateChatResponse(
    state      : State,
    sessionId  : Text,
    userInput  : Text,
    providerId : Text,
  ) : Types.ChatMessage {
    let lower = userInput.toLower();
    let (content, suggested) : (Text, [Text]) =
      if (lower.contains(#text "summarize") or lower.contains(#text "summary")) {
        (
          "Account Summary (ForgeAI Simulation): This account has maintained an active relationship over the past 12 months. Renewal dates are approaching for 3 product lines. Two open opportunities are progressing through the pipeline. No critical risk flags are currently active. Recommended action: schedule a renewal review call.",
          ["Schedule renewal call", "View account timeline", "Check open opportunities"]
        )
      } else if (lower.contains(#text "renewal risk") or lower.contains(#text "renewal")) {
        (
          "Renewal Risk Analysis (ForgeAI Simulation): 4 accounts are flagged as high renewal risk this quarter. Key risk factors include: inactivity > 60 days (2 accounts), pricing objection on record (1 account), no executive sponsor confirmed (1 account). Recommended action: prioritise engagement outreach on all 4 accounts before end of quarter.",
          ["View high-risk accounts", "Create renewal task", "Open renewal pipeline"]
        )
      } else if (lower.contains(#text "deal registration") or lower.contains(#text "deal reg")) {
        (
          "Deal Registration Status (ForgeAI Simulation): You have 3 pending deal registrations awaiting approval. 1 registration is approaching SLA breach (2 days remaining). Recommended action: review pending approvals in the Deal Desk queue and escalate the at-risk registration to the deal desk lead.",
          ["Review pending deal registrations", "Open Deal Desk queue", "View SLA status"]
        )
      } else if (lower.contains(#text "inactive") or lower.contains(#text "inactiv")) {
        (
          "Reseller Inactivity Report (ForgeAI Simulation): 7 resellers have had no logged activity in the past 30 days. Of these, 3 also have renewal events scheduled within the next 60 days. Recommended action: assign re-engagement tasks for the 3 at-risk resellers and initiate a broader outreach campaign for the remaining 4.",
          ["View inactive resellers", "Create re-engagement task", "Open reseller performance report"]
        )
      } else if (lower.contains(#text "opportunity") or lower.contains(#text "pipeline")) {
        (
          "Pipeline Intelligence (ForgeAI Simulation): Your current pipeline contains 18 open opportunities with a combined value of £1.4M. 5 opportunities have been stagnant for more than 21 days and are flagged for follow-up. Forecast confidence for this quarter is 72% based on current stage distribution and historical close rates.",
          ["View stagnant opportunities", "Open pipeline forecast", "Review close rate report"]
        )
      } else if (lower.contains(#text "follow-up") or lower.contains(#text "follow up") or lower.contains(#text "draft")) {
        (
          "Follow-up Draft (ForgeAI Simulation): \"Hi [Contact Name], I wanted to follow up on our recent conversation regarding [Product/Service]. Based on your upcoming renewal date and current usage, I believe there is a strong case for [Value Proposition]. I'd love to schedule 20 minutes to walk through how we can support your goals for the coming year. Are you available [Date/Time]?\"",
          ["Send message", "Log follow-up activity", "Update opportunity stage"]
        )
      } else {
        (
          "ForgeAI (Simulation): I can help you with account summaries, renewal risk analysis, deal registration status, reseller inactivity reports, pipeline intelligence, and drafting follow-up messages. What would you like to explore?",
          ["Account summary", "Renewal risks this quarter", "Pipeline overview"]
        )
      };

    let providerLabel = switch (state.providers.get(providerId)) {
      case (?p) { p.name };
      case null { "Native ForgeAI" };
    };

    let message : Types.ChatMessage = {
      id               = nextId(state, "msg");
      role             = #Assistant;
      content;
      aiSource         = providerLabel # " (Simulation)";
      context          = ?sessionId;
      timestamp        = Time.now();
      suggestedActions = suggested;
    };

    // Append to session
    ignore appendChatMessage(state, sessionId, message);

    // Audit log for chat usage
    logAuditEvent(state, {
      id             = nextId(state, "audit");
      action         = #ChatMessage;
      userId         = sessionId;  // session carries userId context
      organizationId = providerLabel;
      providerId     = ?providerId;
      timestamp      = Time.now();
      details        = "Simulated chat response generated";
    });

    message;
  };

  // ── Audit log ──────────────────────────────────────────────────────────

  public func logAuditEvent(
    state : State,
    entry : Types.AIAuditEntry,
  ) : () {
    state.auditLog.add(entry);
  };

  public func listAuditLog(
    state          : State,
    organizationId : Text,
    limit          : Nat,
  ) : [Types.AIAuditEntry] {
    let all = state.auditLog.toArray().filter(func(e : Types.AIAuditEntry) : Bool {
      organizationId == "" or e.organizationId == organizationId
    });
    let size = all.size();
    if (limit == 0 or size <= limit) {
      all;
    } else {
      // Return the most recent `limit` entries
      all.sliceToArray(size - limit : Int, size : Int);
    };
  };
};
