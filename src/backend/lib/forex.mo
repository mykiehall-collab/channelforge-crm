// Forex configuration and exchange rate history domain logic for CHANNELFORGE CRM
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import Types "../types/forex";

module {
  public type State = {
    config : { var value : ?Types.ForexConfig };
    rateHistory : List.List<Types.ExchangeRateSnapshot>;
  };

  public func initState() : State {
    {
      config = { var value = null };
      rateHistory = List.empty<Types.ExchangeRateSnapshot>();
    };
  };

  // Default config returned when vendor has not yet configured forex
  func defaultConfig() : Types.ForexConfig {
    {
      primaryProvider = #ECB;
      fallbackProviders = [];
      refreshMode = #Daily;
      cryptoEnabled = false;
      defaultCurrency = #USD;
      customApiEndpoint = null;
      updatedAt = 0;
      updatedBy = Principal.anonymous();
    };
  };

  public func getForexConfig(state : State) : Types.ForexConfig {
    switch (state.config.value) {
      case (?cfg) { cfg };
      case null { defaultConfig() };
    };
  };

  public func updateForexConfig(
    state : State,
    config : Types.ForexConfig,
    caller : Principal,
  ) : Bool {
    let updated : Types.ForexConfig = {
      config with
      updatedAt = Time.now();
      updatedBy = caller;
    };
    state.config.value := ?updated;
    true;
  };

  public func addRateSnapshot(
    state : State,
    snapshot : Types.ExchangeRateSnapshot,
  ) : () {
    state.rateHistory.add(snapshot);
  };

  func currencyKey(c : Types.Currency) : Text {
    switch c {
      case (#EUR) { "EUR" };
      case (#USD) { "USD" };
      case (#GBP) { "GBP" };
      case (#JPY) { "JPY" };
      case (#CNY) { "CNY" };
      case (#AUD) { "AUD" };
      case (#BTC) { "BTC" };
    };
  };

  public func getLatestRate(
    state : State,
    from : Types.Currency,
    to : Types.Currency,
  ) : ?Types.ExchangeRateSnapshot {
    let fromKey = currencyKey(from);
    let toKey = currencyKey(to);
    // Scan in reverse (most-recent first) to find the latest matching snapshot
    state.rateHistory.reverseValues().find(func(s : Types.ExchangeRateSnapshot) : Bool {
      currencyKey(s.fromCurrency) == fromKey and currencyKey(s.toCurrency) == toKey
    });
  };

  public func getRateAtDate(
    state : State,
    from : Types.Currency,
    to : Types.Currency,
    date : CommonTypes.Timestamp,
  ) : ?Types.ExchangeRateSnapshot {
    let fromKey = currencyKey(from);
    let toKey = currencyKey(to);
    // Find the snapshot closest to (and not after) the requested date
    var best : ?Types.ExchangeRateSnapshot = null;
    state.rateHistory.forEach(func(s : Types.ExchangeRateSnapshot) {
      if (currencyKey(s.fromCurrency) == fromKey and currencyKey(s.toCurrency) == toKey and s.fetchedAt <= date) {
        switch best {
          case null { best := ?s };
          case (?prev) {
            if (s.fetchedAt > prev.fetchedAt) { best := ?s };
          };
        };
      };
    });
    best;
  };

  public func getRecentRates(state : State, limit : Nat) : [Types.ExchangeRateSnapshot] {
    state.rateHistory.reverseValues().take(limit).toArray();
  };
};
