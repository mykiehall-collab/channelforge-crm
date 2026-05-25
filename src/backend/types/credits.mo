// Credit economy types for CHANNELFORGE CRM
// Customers purchase operational credits (compute, storage, AI) — ICP infrastructure abstracted away.
module {
  // Balance snapshot per organisation
  public type CreditBalance = {
    computeCredits : Nat;
    storageCredits : Nat;
    aiCredits      : Nat;
  };

  // A single metered usage event recorded against an organisation
  public type UsageEvent = {
    actionType   : Text;   // e.g. "ai_chat", "report", "export"
    computeCost  : Nat;
    storageCost  : Nat;
    aiCost       : Nat;
    timestamp    : Int;
    userId       : Text;
    orgId        : Text;
  };

  // A simulated top-up purchase
  // TODO-SECURITY: replace simulatedAmount with live payment reference before go-live
  public type CreditTopUp = {
    packageId      : Text;
    computeAdded   : Nat;
    storageAdded   : Nat;
    aiAdded        : Nat;
    timestamp      : Int;
    userId         : Text;
    simulatedAmount : Float; // TODO-SECURITY: fiat amount placeholder only
  };

  // A purchasable credit bundle shown on the pricing/top-up screens
  public type CreditPackage = {
    id             : Text;
    name           : Text;
    computeCredits : Nat;
    storageCredits : Nat;
    aiCredits      : Nat;
    pricingGBP     : Float;
    description    : Text;
  };

  // Credit cost constants — shared config so frontend and backend stay in sync
  public let AI_CHAT_COST     : Nat = 10;
  public let REPORT_COST      : Nat = 5;
  public let DASHBOARD_COST   : Nat = 1;
  public let EXPORT_COST      : Nat = 10;
  public let MESSAGE_COST     : Nat = 1;
  public let AI_SUMMARY_COST  : Nat = 7;
  public let AI_FORECAST_COST : Nat = 15;
  // UPLOAD_COST is per-MB so stored as Nat (credits per MB, fractional rounded up by caller)
  public let UPLOAD_COST_PER_MB : Nat = 1; // 0.5 credits/MB rounded to 1 for integer math

  // Standard credit packages available for purchase
  public let PACKAGES : [CreditPackage] = [
    {
      id             = "starter";
      name           = "Starter Credits";
      computeCredits = 5_000;
      storageCredits = 100;
      aiCredits      = 500;
      pricingGBP     = 49.0;
      description    = "Ideal for small teams getting started on sovereign infrastructure.";
    },
    {
      id             = "growth";
      name           = "Growth Credits";
      computeCredits = 20_000;
      storageCredits = 500;
      aiCredits      = 2_000;
      pricingGBP     = 149.0;
      description    = "For growing channel operations with higher AI and compute demands.";
    },
    {
      id             = "enterprise";
      name           = "Enterprise Compute Pools";
      computeCredits = 100_000;
      storageCredits = 5_000;
      aiCredits      = 10_000;
      pricingGBP     = 599.0;
      description    = "Enterprise-scale infrastructure allocation for high-volume channel ecosystems.";
    },
    {
      id             = "ai_expansion";
      name           = "AI Expansion Credits";
      computeCredits = 0;
      storageCredits = 0;
      aiCredits      = 5_000;
      pricingGBP     = 79.0;
      description    = "Boost your AI operational capacity — ForgeAI chats, summaries, and forecasts.";
    },
    {
      id             = "storage_expansion";
      name           = "Storage Expansion Pack";
      computeCredits = 0;
      storageCredits = 2_000;
      aiCredits      = 0;
      pricingGBP     = 39.0;
      description    = "Extend your sovereign storage allocation for documents, assets, and data.";
    },
  ];
};
