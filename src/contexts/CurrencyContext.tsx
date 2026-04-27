"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { SHOP_CONFIG } from "../../shop.config";
import type { Currency } from "../../types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(
    SHOP_CONFIG.currencies.default
  );

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrencyState((prev) => (prev === "VND" ? "USD" : "VND"));
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside <CurrencyProvider>");
  }
  return ctx;
}
