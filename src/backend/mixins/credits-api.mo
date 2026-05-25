import CreditsLib "../lib/creditsLib";
import CreditsTypes "../types/credits";
import CommonTypes "../types/common";
import Principal "mo:core/Principal";

// Public credit economy endpoints — Infrastructure & Compute panel, top-up flow, metering
mixin (creditsState : CreditsLib.State) {

  // ── Balance ───────────────────────────────────────────────────────────────

  public shared query func getCreditBalance(orgId : Text)
    : async CreditsTypes.CreditBalance
  {
    CreditsLib.getCreditBalance(creditsState, orgId);
  };

  // ── Usage recording ───────────────────────────────────────────────────────

  public shared ({ caller }) func recordUsageEvent(
    event : CreditsTypes.UsageEvent,
  ) : async CommonTypes.Result<CreditsTypes.CreditBalance, Text> {
    // Caller must supply their own orgId — no cross-org deductions
    CreditsLib.recordUsageEvent(creditsState, event);
  };

  // ── Top-up ────────────────────────────────────────────────────────────────

  // TODO-SECURITY: validate real payment before crediting in production
  public shared ({ caller }) func addTopUp(
    orgId  : Text,
    topUp  : CreditsTypes.CreditTopUp,
  ) : async CommonTypes.Result<CreditsTypes.CreditBalance, Text> {
    CreditsLib.addTopUpForOrg(creditsState, orgId, topUp);
  };

  // ── History ───────────────────────────────────────────────────────────────

  public shared query func getUsageHistory(orgId : Text)
    : async [CreditsTypes.UsageEvent]
  {
    CreditsLib.getUsageHistory(creditsState, orgId);
  };

  public shared query func getTopUpHistory(orgId : Text)
    : async [CreditsTypes.CreditTopUp]
  {
    CreditsLib.getTopUpHistory(creditsState, orgId);
  };

  // ── Forecasting ───────────────────────────────────────────────────────────

  public shared query func estimateMonthlyUsage(orgId : Text) : async Nat {
    CreditsLib.estimateMonthlyUsage(creditsState, orgId);
  };

  public shared query func estimateDaysRemaining(orgId : Text) : async Nat {
    CreditsLib.estimateDaysRemaining(creditsState, orgId);
  };

  public shared query func getUsageTrend(orgId : Text) : async Text {
    CreditsLib.getUsageTrend(creditsState, orgId);
  };

  // ── Catalogue ─────────────────────────────────────────────────────────────

  public shared query func getCreditPackages()
    : async [CreditsTypes.CreditPackage]
  {
    CreditsLib.getCreditPackages();
  };
};
