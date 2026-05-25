import { ChevronDown, RefreshCw, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ForexState } from "../hooks/useForex";
import {
  BASE_RATES,
  CURRENCIES,
  CURRENCY_NAMES,
  CURRENCY_SYMBOLS,
  formatCurrencyAmount,
} from "../utils/forex";

interface CurrencySelectorProps {
  forex: ForexState;
  compact?: boolean;
}

const CURRENCY_ORDER = CURRENCIES; // ["EUR", "USD", "GBP", "JPY", "CNY", "AUD", "BTC"]

/** Convert BASE_RATES to show "1 USD = X currency" */
function rateDisplay(currency: string): string {
  if (currency === "USD") return "Base";
  const rate = BASE_RATES[currency];
  if (!rate) return "—";
  if (currency === "BTC") {
    // show 1 BTC = $XX,XXX
    const usdVal = 1 / rate;
    return `1 ₿ ≈ $${Math.round(usdVal).toLocaleString()}`;
  }
  return `1 $ = ${rate < 1 ? rate.toFixed(4) : rate.toFixed(2)} ${currency}`;
}

export function CurrencySelector({
  forex,
  compact = false,
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const symbol =
    CURRENCY_SYMBOLS[forex.displayCurrency] ?? forex.displayCurrency;
  const lastUpdatedStr = forex.lastUpdated
    ? forex.lastUpdated.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  if (compact) {
    return (
      <div ref={ref} className="relative" data-ocid="currency_selector.toggle">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-border bg-background hover:bg-secondary/30 transition-colors text-xs font-mono font-medium text-foreground"
          aria-label="Select reporting currency"
          data-ocid="currency_selector.button"
        >
          <span className="text-accent font-bold">{symbol}</span>
          <span className="hidden sm:inline">{forex.displayCurrency}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-1.5 z-50 w-64 rounded-lg border border-border shadow-xl overflow-hidden"
            style={{ background: "hsl(var(--card))" }}
          >
            {/* Terminal header */}
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-mono font-semibold text-accent uppercase tracking-widest">
                  FX RATES
                </span>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground">
                {forex.providerName
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")
                  .toUpperCase()}
              </span>
            </div>

            {/* Currency list */}
            <div className="py-1">
              {CURRENCY_ORDER.map((code) => {
                const isSelected = forex.displayCurrency === code;
                const sym = CURRENCY_SYMBOLS[code] ?? code;
                return (
                  <button
                    key={code}
                    type="button"
                    data-ocid={`currency_selector.option.${code.toLowerCase()}`}
                    onClick={() => {
                      forex.setDisplayCurrency(code);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 transition-colors hover:bg-secondary/40 ${
                      isSelected ? "bg-accent/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      )}
                      {!isSelected && (
                        <span className="w-1.5 h-1.5 flex-shrink-0" />
                      )}
                      <span
                        className={`text-xs font-mono font-bold w-5 ${isSelected ? "text-accent" : "text-foreground"}`}
                      >
                        {sym}
                      </span>
                      <div className="text-left">
                        <div
                          className={`text-xs font-mono font-semibold ${
                            isSelected ? "text-accent" : "text-foreground"
                          }`}
                        >
                          {code}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          {CURRENCY_NAMES[code]}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {rateDisplay(code)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-border flex items-center gap-1.5">
              <RefreshCw className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[9px] font-mono text-muted-foreground">
                {forex.loading ? "Loading..." : `Updated ${lastUpdatedStr}`}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Full mode ─────────────────────────────────────────────────────────────
  return (
    <div ref={ref} className="relative" data-ocid="currency_selector.full">
      {/* Selected currency display bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 h-10 pl-3 pr-4 rounded-lg border border-border bg-card hover:border-accent/50 transition-colors group"
        data-ocid="currency_selector.full_button"
      >
        <TrendingUp className="w-3.5 h-3.5 text-accent" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-bold text-accent">
            {symbol}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {forex.displayCurrency}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            — {CURRENCY_NAMES[forex.displayCurrency]}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground ml-1 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 w-80 rounded-lg border border-border shadow-xl overflow-hidden"
          style={{ background: "hsl(var(--card))" }}
        >
          {/* Terminal header */}
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                FX RATES — {forex.providerName.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[9px] font-mono text-muted-foreground">
                {forex.loading ? "Loading..." : `${lastUpdatedStr}`}
              </span>
            </div>
          </div>

          {/* Header row */}
          <div className="grid grid-cols-3 px-4 py-1.5 border-b border-border/50">
            <span className="text-[9px] font-mono font-semibold text-muted-foreground uppercase tracking-widest col-span-2">
              Currency
            </span>
            <span className="text-[9px] font-mono font-semibold text-muted-foreground uppercase tracking-widest text-right">
              vs USD
            </span>
          </div>

          {/* Currency rows */}
          <div className="py-1">
            {CURRENCY_ORDER.map((code) => {
              const isSelected = forex.displayCurrency === code;
              const sym = CURRENCY_SYMBOLS[code] ?? code;
              const rate = BASE_RATES[code];
              const rateStr =
                code === "USD"
                  ? "1.0000"
                  : code === "BTC"
                    ? rate.toFixed(8)
                    : rate.toFixed(4);
              return (
                <button
                  key={code}
                  type="button"
                  data-ocid={`currency_selector.full_option.${code.toLowerCase()}`}
                  onClick={() => {
                    forex.setDisplayCurrency(code);
                    setOpen(false);
                  }}
                  className={`w-full grid grid-cols-3 items-center px-4 py-2.5 transition-colors hover:bg-secondary/40 border-b border-border/20 last:border-0 ${
                    isSelected ? "bg-accent/10 border-l-2 border-l-accent" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 col-span-2">
                    <span
                      className={`text-base font-mono font-bold w-6 text-center ${
                        isSelected ? "text-accent" : "text-muted-foreground"
                      }`}
                    >
                      {sym}
                    </span>
                    <div className="text-left">
                      <div
                        className={`text-sm font-mono font-semibold ${
                          isSelected ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {code}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {CURRENCY_NAMES[code]}
                      </div>
                    </div>
                    {code === "BTC" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono ml-1">
                        CRYPTO
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-mono ${
                        isSelected
                          ? "text-accent font-bold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {rateStr}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* BTC toggle */}
          {forex.forexConfig.cryptoEnabled && (
            <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">
                Show BTC equivalent in reports
              </span>
              <button
                type="button"
                data-ocid="currency_selector.btc_toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  forex.setShowBtcEquivalent(!forex.showBtcEquivalent);
                }}
                className={`relative w-8 h-4 rounded-full transition-colors ${
                  forex.showBtcEquivalent ? "bg-accent" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                    forex.showBtcEquivalent
                      ? "left-4.5 translate-x-0"
                      : "left-0.5"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Rate info footer */}
          <div className="px-4 py-2 border-t border-border bg-secondary/20">
            <p className="text-[9px] font-mono text-muted-foreground">
              Reference rates. Simulated from {forex.providerName}. Configure
              provider in Admin → Forex Settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
