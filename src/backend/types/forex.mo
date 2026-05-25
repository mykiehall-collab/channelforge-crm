// Multi-currency and forex configuration types for CHANNELFORGE CRM
import CommonTypes "common";

module {
  public type ForexProvider = {
    #ECB;
    #BankOfEngland;
    #XE;
    #OpenExchangeRates;
    #Coinbase;
    #Binance;
    #CustomAPI;
  };

  public type Currency = {
    #EUR;
    #USD;
    #GBP;
    #JPY;
    #CNY;
    #AUD;
    #BTC;
  };

  public type ForexRefreshMode = {
    #LiveOnLoad;
    #Hourly;
    #Daily;
    #Weekly;
    #ManualOnly;
  };

  public type ForexConfig = {
    primaryProvider : ForexProvider;
    fallbackProviders : [ForexProvider];
    refreshMode : ForexRefreshMode;
    cryptoEnabled : Bool;
    defaultCurrency : Currency;
    customApiEndpoint : ?Text;
    updatedAt : CommonTypes.Timestamp;
    updatedBy : Principal;
  };

  public type ExchangeRateSnapshot = {
    fromCurrency : Currency;
    toCurrency : Currency;
    rate : Float;
    provider : ForexProvider;
    fetchedAt : CommonTypes.Timestamp;
  };
};
