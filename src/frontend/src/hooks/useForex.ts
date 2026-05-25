import { useCallback, useEffect, useMemo, useState } from "react";
import type { ForexConfig } from "../backend";
import { Currency, ForexProvider, ForexRefreshMode } from "../backend";
import {
  BASE_RATES,
  PROVIDER_NAMES,
  convertCurrency,
  formatCurrencyAmount,
  getFiatEquivalent,
} from "../utils/forex";
import { useActor } from "./useActor";

const STORAGE_KEY = "channelforge_currency";

const DEFAULT_CONFIG: ForexConfig = {
  primaryProvider: ForexProvider.ECB,
  fallbackProviders: [ForexProvider.OpenExchangeRates],
  refreshMode: ForexRefreshMode.Daily,
  cryptoEnabled: true,
  defaultCurrency: Currency.USD,
  customApiEndpoint: undefined,
  updatedAt: 0n,
  updatedBy: "" as unknown as import("@icp-sdk/core/principal").Principal,
};

export interface ForexState {
  displayCurrency: string;
  setDisplayCurrency: (currency: string) => void;
  forexConfig: ForexConfig;
  rates: Record<string, number>;
  convertAmount: (amount: number, fromCurrency: string) => number;
  formatAmount: (amount: number, fromCurrency: string) => string;
  formatBtcWithFiat: (btcAmount: number) => string;
  lastUpdated: Date | null;
  loading: boolean;
  providerName: string;
  showBtcEquivalent: boolean;
  setShowBtcEquivalent: (v: boolean) => void;
}

export function useForex(): ForexState {
  const { actor } = useActor();
  const [forexConfig, setForexConfig] = useState<ForexConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showBtcEquivalent, setShowBtcEquivalent] = useState(false);

  // Initialize display currency from localStorage or config default
  const [displayCurrency, setDisplayCurrencyState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "USD";
    } catch {
      return "USD";
    }
  });

  const setDisplayCurrency = useCallback((currency: string) => {
    setDisplayCurrencyState(currency);
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {}
  }, []);

  // Load forex config from backend
  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    actor
      .getForexConfig()
      .then((config) => {
        setForexConfig(config);
        // Only apply config default if user has no stored preference
        try {
          if (!localStorage.getItem(STORAGE_KEY)) {
            setDisplayCurrencyState(config.defaultCurrency);
          }
        } catch {}
        setLastUpdated(new Date());
      })
      .catch(() => {
        setLastUpdated(new Date());
      })
      .finally(() => setLoading(false));
  }, [actor]);

  // Rates are BASE_RATES (simulated); in production, these would come from storeExchangeRates
  const rates = useMemo<Record<string, number>>(() => ({ ...BASE_RATES }), []);

  const convertAmount = useCallback(
    (amount: number, fromCurrency: string): number => {
      return convertCurrency(amount, fromCurrency, displayCurrency, rates);
    },
    [displayCurrency, rates],
  );

  const formatAmount = useCallback(
    (amount: number, fromCurrency: string): string => {
      const converted = convertCurrency(
        amount,
        fromCurrency,
        displayCurrency,
        rates,
      );
      const formatted = formatCurrencyAmount(converted, displayCurrency);
      if (displayCurrency === "BTC") {
        const fiat = getFiatEquivalent(converted, "USD", rates);
        return `${formatted} (≈ ${fiat} USD)`;
      }
      return formatted;
    },
    [displayCurrency, rates],
  );

  const formatBtcWithFiat = useCallback(
    (btcAmount: number): string => {
      const btcFormatted = formatCurrencyAmount(btcAmount, "BTC");
      const fiat = getFiatEquivalent(btcAmount, "USD", rates);
      return `${btcFormatted} (≈ ${fiat} USD)`;
    },
    [rates],
  );

  const providerName =
    PROVIDER_NAMES[forexConfig.primaryProvider] ?? forexConfig.primaryProvider;

  return {
    displayCurrency,
    setDisplayCurrency,
    forexConfig,
    rates,
    convertAmount,
    formatAmount,
    formatBtcWithFiat,
    lastUpdated,
    loading,
    providerName,
    showBtcEquivalent,
    setShowBtcEquivalent,
  };
}
