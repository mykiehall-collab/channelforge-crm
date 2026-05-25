// AI Provider mixin — public API endpoints for BYO AI governance
import Types "../types/ai-provider";
import Lib "../lib/ai-provider";
import Time "mo:core/Time";

mixin (aiProviderState : Lib.State) {

  // ── Provider management ────────────────────────────────────────────────

  public shared ({ caller }) func aiAddProvider(
    provider : Types.AIProvider,
    config   : Types.AIProviderConfig,
  ) : async Bool {
    Lib.addProvider(aiProviderState, provider, config);
    Lib.logAuditEvent(aiProviderState, {
      id             = Lib.nextId(aiProviderState, "audit");
      action         = #ProviderAdded;
      userId         = caller.toText();
      organizationId = provider.workspaceId;
      providerId     = ?provider.id;
      timestamp      = Time.now();
      details        = "Provider added: " # provider.name;
    });
    true;
  };

  public query func aiGetProvider(
    providerId : Text,
  ) : async ?Types.AIProvider {
    Lib.getProvider(aiProviderState, providerId);
  };

  public query func aiListProviders(
    workspaceId : Text,
  ) : async [Types.AIProvider] {
    Lib.listProviders(aiProviderState, workspaceId);
  };

  public shared ({ caller }) func aiEnableProvider(
    providerId : Text,
  ) : async Bool {
    Lib.updateProviderStatus(aiProviderState, providerId, #Active, caller.toText());
  };

  public shared ({ caller }) func aiDisableProvider(
    providerId : Text,
  ) : async Bool {
    Lib.updateProviderStatus(aiProviderState, providerId, #Disabled, caller.toText());
  };

  public shared ({ caller }) func aiDeleteProvider(
    providerId : Text,
  ) : async Bool {
    Lib.deleteProvider(aiProviderState, providerId, caller.toText());
  };

  public shared ({ caller }) func aiUpdateProviderConfig(
    config : Types.AIProviderConfig,
  ) : async Bool {
    // TODO-SECURITY: upgrade to encrypted vault before go-live
    Lib.updateProviderConfig(aiProviderState, config, caller.toText());
  };

  public query func aiGetProviderConfig(
    providerId : Text,
  ) : async ?Types.AIProviderConfig {
    // TODO-SECURITY: upgrade to encrypted vault before go-live
    Lib.getProviderConfig(aiProviderState, providerId);
  };

  // TODO-SECURITY: maskedKey is a display-only placeholder; upgrade to
  // encrypted vault write before go-live.
  public shared ({ caller }) func aiUpdateApiKey(
    providerId : Text,
    maskedKey  : Text,
  ) : async Bool {
    // TODO-SECURITY: upgrade to encrypted vault before go-live
    Lib.updateMaskedApiKey(aiProviderState, providerId, maskedKey, caller.toText());
  };

  // Placeholder test — no live external calls in this phase.
  // "External AI activation coming in a future update."
  public shared ({ caller }) func aiTestProviderConnection(
    providerId : Text,
  ) : async Text {
    Lib.testProviderConnection(aiProviderState, providerId, caller.toText());
  };

  // ── Access-rule management ─────────────────────────────────────────────

  public shared ({ caller }) func aiGrantAccess(
    rule : Types.AIAccessRule,
  ) : async Bool {
    Lib.grantAccess(aiProviderState, rule);
    Lib.logAuditEvent(aiProviderState, {
      id             = Lib.nextId(aiProviderState, "audit");
      action         = #SharingGranted;
      userId         = caller.toText();
      organizationId = rule.organizationId;
      providerId     = ?rule.providerId;
      timestamp      = Time.now();
      details        = "Access rule granted: " # rule.id;
    });
    true;
  };

  public shared ({ caller }) func aiRevokeAccess(
    ruleId : Text,
  ) : async Bool {
    let ok = Lib.revokeAccess(aiProviderState, ruleId, caller.toText());
    if (ok) {
      Lib.logAuditEvent(aiProviderState, {
        id             = Lib.nextId(aiProviderState, "audit");
        action         = #SharingRevoked;
        userId         = caller.toText();
        organizationId = "";
        providerId     = null;
        timestamp      = Time.now();
        details        = "Access rule revoked: " # ruleId;
      });
    };
    ok;
  };

  public query func aiListAccessRules(
    providerId : Text,
  ) : async [Types.AIAccessRule] {
    Lib.listAccessRules(aiProviderState, providerId);
  };

  // Returns the providerId the caller should use, respecting hierarchy.
  // Returns null when no grant found — callers fall back to Native ForgeAI.
  public shared ({ caller }) func aiResolveProviderForCaller(
    organizationId : Text,
    role           : Text,
    department     : ?Text,
  ) : async ?Text {
    Lib.resolveProviderForUser(aiProviderState, caller.toText(), organizationId, role, department);
  };

  // ── Chat session API ───────────────────────────────────────────────────

  public shared ({ caller }) func aiCreateChatSession(
    providerId  : Text,
    contextType : ?Text,
    contextId   : ?Text,
  ) : async Types.ForgeAIChatSession {
    Lib.createChatSession(aiProviderState, caller.toText(), providerId, contextType, contextId);
  };

  // Appends the user message, generates a simulated AI reply, and returns it.
  // No external HTTP calls are made in this phase.
  public shared ({ caller }) func aiSendChatMessage(
    sessionId : Text,
    content   : Text,
  ) : async Types.ChatMessage {
    // Append the user's message first
    let userMsg : Types.ChatMessage = {
      id               = Lib.nextId(aiProviderState, "msg");
      role             = #User;
      content;
      aiSource         = "User";
      context          = ?sessionId;
      timestamp        = Time.now();
      suggestedActions = [];
    };
    ignore Lib.appendChatMessage(aiProviderState, sessionId, userMsg);
    // Resolve the provider for the session
    let providerId = switch (Lib.getChatSession(aiProviderState, sessionId)) {
      case (?s) { s.providerId };
      case null { "native" };
    };
    // Produce simulated response — no live AI calls
    Lib.simulateChatResponse(aiProviderState, sessionId, content, providerId);
  };

  public query func aiGetChatSession(
    sessionId : Text,
  ) : async ?Types.ForgeAIChatSession {
    Lib.getChatSession(aiProviderState, sessionId);
  };

  public shared ({ caller }) func aiListChatSessions() : async [Types.ForgeAIChatSession] {
    Lib.listChatSessions(aiProviderState, caller.toText());
  };

  // ── Audit log ──────────────────────────────────────────────────────────

  public query func aiListAuditLog(
    organizationId : Text,
    limit          : Nat,
  ) : async [Types.AIAuditEntry] {
    Lib.listAuditLog(aiProviderState, organizationId, limit);
  };

  // ── Key rotation hook (future) ────────────────────────────────────────
  // TODO-SECURITY: shareMaskAuthority is a placeholder for future encrypted
  // key rotation delegation. No real credentials are processed here.
  public shared ({ caller }) func shareMaskAuthority(
    providerId : Text,
    targetOrg  : Text,
  ) : async Bool {
    // TODO-SECURITY: upgrade to encrypted vault before go-live
    Lib.logAuditEvent(aiProviderState, {
      id             = Lib.nextId(aiProviderState, "audit");
      action         = #ApiKeyUpdated;  // TODO-SECURITY: log rotation event only
      userId         = caller.toText();
      organizationId = targetOrg;
      providerId     = ?providerId;
      timestamp      = Time.now();
      details        = "Mask authority delegation recorded (placeholder — encrypted vault activation pending)";
    });
    true;
  };
};
