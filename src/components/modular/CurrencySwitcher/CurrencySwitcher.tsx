"use client";

import { SHOP_CONFIG } from "../../../../shop.config";
import type { Currency } from "../../../../types";
import { useCurrency } from "../../../contexts/CurrencyContext";

// ── CurrencySwitcher ──────────────────────────────────────────────────────────

interface CurrencySwitcherProps {
  className?: string;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  VND: "₫",
  USD: "$",
};

export default function CurrencySwitcher({ className = "" }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className={`currency-switcher ${className}`}
      aria-label="Currency switcher"
      role="group"
    >
      {SHOP_CONFIG.currencies.codes.map((code) => {
        const isActive = code === currency;
        return (
          <button
            key={code}
            id={`currency-btn-${code}`}
            onClick={() => setCurrency(code)}
            aria-pressed={isActive}
            className={`currency-btn ${isActive ? "currency-btn--active" : "currency-btn--inactive"}`}
          >
            <span className="currency-btn__symbol" aria-hidden="true">
              {CURRENCY_SYMBOLS[code]}
            </span>
            <span className="currency-btn__code">{code}</span>
          </button>
        );
      })}
    </div>
  );
}
