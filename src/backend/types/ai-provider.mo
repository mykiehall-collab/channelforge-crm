// AI Provider — BYO AI governance types for CHANNELFORGE ForgeAI
module {

  // ── Provider identity ───────────────────────────────────────────────────

  public type AIProviderType = {
    #Native;
    #OpenAI;
    #AzureOpenAI;
    #AnthropicClaude;
    #GoogleGemini;
    #Mistral;
    #CustomEndpoint;
    #LocalLLM;
  };

  public type AIProviderStatus = {
    #Active;
    #Disabled;
    #Testing;
  };

  // Core provider record — no credentials stored here (TODO-SECURITY)
  public type AIProvider = {
    id           : Text;
    name         : Text;
    providerType : AIProviderType;
    workspaceId  : Text;
    createdBy    : Text;
    createdAt    : Int;
    status       : AIProviderStatus;
    isShared     : Bool;
  };

  // ── Provider configuration ───────────────────────────────────────────────

  // TODO-SECURITY: maskedApiKey is a placeholder; real keys must be
  // encrypted at rest and stored in a secure vault before go-live.
  // All credential fields below are intentionally non-encrypted for
  // this development phase and must be upgraded before production.
  public type AIProviderConfig = {
    providerId      : Text;
    endpointUrl     : ?Text;
    modelName       : ?Text;
    orgId           : ?Text;        // TODO-SECURITY: org/account identifier
    deploymentName  : ?Text;
    region          : ?Text;
    maxTokens       : Nat;
    temperature     : Float;
    timeoutSecs     : Nat;
    maskedApiKey    : ?Text;        // TODO-SECURITY: display-only masked value
  };

  // ── Access control ───────────────────────────────────────────────────────

  public type AIAccessRuleTarget = {
    #AllUsers;
    #ByRole       : Text;
    #ByDepartment : Text;
    #SpecificUser : Text;
  };

  public type AIAccessRule = {
    id             : Text;
    providerId     : Text;
    organizationId : Text;
    grantedToType  : AIAccessRuleTarget;
    grantedBy      : Text;
    grantedAt      : Int;
    active         : Bool;
  };

  // ── Audit logging ────────────────────────────────────────────────────────

  public type AIAuditAction = {
    #ProviderAdded;
    #ProviderUpdated;
    #ProviderDeleted;
    #ProviderEnabled;
    #ProviderDisabled;
    #ApiKeyUpdated;    // TODO-SECURITY: log key rotation events only; never log the key itself
    #SharingGranted;
    #SharingRevoked;
    #TestAttempt;
    #ChatMessage;
  };

  public type AIAuditEntry = {
    id             : Text;
    action         : AIAuditAction;
    userId         : Text;
    organizationId : Text;
    providerId     : ?Text;
    timestamp      : Int;
    details        : Text;
  };

  // ── Chat session ─────────────────────────────────────────────────────────

  public type ChatRole = {
    #User;
    #Assistant;
    #System;
  };

  public type ChatMessage = {
    id               : Text;
    role             : ChatRole;
    content          : Text;
    aiSource         : Text;
    context          : ?Text;
    timestamp        : Int;
    suggestedActions : [Text];
  };

  public type ForgeAIChatSession = {
    id          : Text;
    userId      : Text;
    providerId  : Text;
    contextType : ?Text;
    contextId   : ?Text;
    messages    : [ChatMessage];
    createdAt   : Int;
    updatedAt   : Int;
  };
};
