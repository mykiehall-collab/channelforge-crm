// Forex configuration and exchange rates public API for CHANNELFORGE CRM
import Principal "mo:core/Principal";
import ForexLib "../lib/forex";
import AlertsLib "../lib/alerts";
import CommonTypes "../types/common";
import Types "../types/forex";

mixin (
  forexState : ForexLib.State,
  alertsState : AlertsLib.State,
) {
  public query func getForexConfig() : async Types.ForexConfig {
    ForexLib.getForexConfig(forexState);
  };

  public shared ({ caller }) func updateForexConfig(config : Types.ForexConfig) : async Bool {
    let oldCfg = ForexLib.getForexConfig(forexState);
    let result = ForexLib.updateForexConfig(forexState, config, caller);
    AlertsLib.appendAuditEntry(
      alertsState,
      caller.toText(),
      "FOREX_CONFIG_CHANGE",
      "forex",
      "config",
      "Forex config updated by " # caller.toText(),
    );
    result;
  };

  public shared ({ caller }) func storeExchangeRates(
    snapshots : [Types.ExchangeRateSnapshot]
  ) : async () {
    for (snapshot in snapshots.values()) {
      ForexLib.addRateSnapshot(forexState, snapshot);
    };
  };

  public query func getLatestRate(
    from : Types.Currency,
    to : Types.Currency,
  ) : async ?Types.ExchangeRateSnapshot {
    ForexLib.getLatestRate(forexState, from, to);
  };

  public query func getRateAtDate(
    from : Types.Currency,
    to : Types.Currency,
    date : CommonTypes.Timestamp,
  ) : async ?Types.ExchangeRateSnapshot {
    ForexLib.getRateAtDate(forexState, from, to, date);
  };
};
