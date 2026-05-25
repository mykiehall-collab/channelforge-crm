import type { Currency, ForexProvider, ForexRefreshMode } from "../backend";

// ─── Currency metadata ────────────────────────────────────────────────────────

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  AUD: "A$",
  BTC: "₿",
};

export const CURRENCY_NAMES: Record<string, string> = {
  EUR: "Euro",
  USD: "US Dollar",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CNY: "Chinese Yuan",
  AUD: "Australian Dollar",
  BTC: "Bitcoin",
};

/** Ordered list for display */
export const CURRENCIES: string[] = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CNY",
  "AUD",
  "BTC",
];

// ─── Provider metadata ────────────────────────────────────────────────────────

export const PROVIDER_NAMES: Record<string, string> = {
  ECB: "European Central Bank",
  BankOfEngland: "Bank of England",
  XE: "XE Exchange",
  OpenExchangeRates: "Open Exchange Rates",
  Coinbase: "Coinbase",
  Binance: "Binance",
  CustomAPI: "Custom Enterprise API",
};

// ─── Base reference rates (vs USD) ───────────────────────────────────────────

/** Hardcoded reference rates. 1 USD = X foreign currency */
export const BASE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  AUD: 1.53,
  BTC: 0.0000159, // ~1 USD = 0.0000159 BTC (i.e., 1 BTC ≈ $62,893)
};

// ─── Refresh mode labels ──────────────────────────────────────────────────────

export const REFRESH_MODE_LABELS: Record<string, string> = {
  LiveOnLoad: "Live on every load",
  Hourly: "Hourly refresh",
  Daily: "Daily cached",
  Weekly: "Weekly refresh",
  ManualOnly: "Manual refresh only",
};

// ─── Conversion utilities ─────────────────────────────────────────────────────

/**
 * Convert an amount from one currency to another using USD as the pivot.
 * rates: Record of currency code → rate vs USD (same structure as BASE_RATES)
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency] ?? BASE_RATES[fromCurrency] ?? 1;
  const toRate = rates[toCurrency] ?? BASE_RATES[toCurrency] ?? 1;
  // Convert to USD first, then to target
  const usdAmount = fromCurrency === "USD" ? amount : amount / fromRate;
  return toCurrency === "USD" ? usdAmount : usdAmount * toRate;
}

/**
 * Get the USD fiat equivalent of a BTC amount as a formatted string.
 */
export function getFiatEquivalent(
  btcAmount: number,
  targetCurrency: string,
  rates: Record<string, number>,
): string {
  const btcRate = rates.BTC ?? BASE_RATES.BTC;
  const usdValue = btcAmount / btcRate;
  if (targetCurrency === "USD") {
    return formatCurrencyAmount(usdValue, "USD");
  }
  const converted = convertCurrency(usdValue, "USD", targetCurrency, rates);
  return formatCurrencyAmount(converted, targetCurrency);
}

/**
 * Format a currency amount with the appropriate symbol and precision.
 * - BTC: ₿ X.XXXXXXXX (8 decimal places)
 * - JPY/CNY: whole numbers
 * - Others: 2 decimal places
 * compact: abbreviate large numbers (1.2M, 450K)
 */
export function formatCurrencyAmount(
  amount: number,
  currency: string,
  compact = false,
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;

  if (currency === "BTC") {
    const formatted = amount.toFixed(8);
    return `${symbol} ${formatted}`;
  }

  if (compact && Math.abs(amount) >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(1)}K`;
  }

  const isWholeNumber = currency === "JPY" || currency === "CNY";
  const decimals = isWholeNumber ? 0 : 2;

  const numeric = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(amount));

  return `${amount < 0 ? "-" : ""}${symbol}${numeric}`;
}

/**
 * Build a simulated historical rate by applying ±5% variance based on a date offset.
 * Used to simulate "Historical FX at transaction date" without real API access.
 */
export function getHistoricalRateVariance(
  currency: string,
  dateNs: bigint,
): number {
  const base = BASE_RATES[currency] ?? 1;
  if (currency === "USD") return 1;
  // Deterministic pseudo-random variance based on date
  const daysSinceEpoch = Math.floor(Number(dateNs) / 1_000_000 / 86_400_000);
  const seed = (daysSinceEpoch * 2654435761) >>> 0;
  const variance = ((seed % 100) / 100) * 0.1 - 0.05; // ±5%
  return base * (1 + variance);
}

// Re-export enum types so consumers can import from one place
export type { Currency, ForexProvider, ForexRefreshMode };
